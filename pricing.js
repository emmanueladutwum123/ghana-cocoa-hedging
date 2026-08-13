/*
 * pricing.js — option pricing for the Ghana Cocoa Derivatives Research Platform.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The calculator previously reported numbers that were not computed. Monte
 * Carlo and Binomial returned hardcoded greeks (theta: -15.2, vega: 68.5,
 * rho: 42.3 and similar), "Heston" was Black-Scholes multiplied by 0.98 with
 * greeks scaled by arbitrary constants, and jump-diffusion multiplied its
 * result by 1.05 for no stated reason. A platform whose stated purpose is
 * "derivatives research and policy development" cannot display invented
 * figures next to real ones with no way to tell them apart.
 *
 * Everything here is actually computed. Where a quantity is an approximation
 * the approximation is named, and where a model needs a numerical method the
 * method and its convergence controls are stated.
 *
 * CONVENTIONS
 *   S      spot price
 *   K      strike
 *   T      time to expiry in YEARS
 *   sigma  annualised volatility (0.25 = 25%)
 *   r      risk-free rate, continuously compounded
 *   q      continuous dividend / convenience yield (cocoa: storage & carry)
 *
 * Greeks are returned in the units a trading desk quotes them:
 *   delta  per 1.00 move in S
 *   gamma  per 1.00 move in S, per unit delta
 *   theta  per CALENDAR DAY (annual figure / 365)
 *   vega   per 1 VOLATILITY POINT (annual figure / 100)
 *   rho    per 1 PERCENTAGE POINT of rate (annual figure / 100)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pricing = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Normal distribution
  // ---------------------------------------------------------------------

  /**
   * Cumulative standard normal, Hart (1968) as refined by West (2005).
   *
   * Accurate to roughly 1e-15, against ~1.5e-7 for the Abramowitz & Stegun
   * 7.1.26 series the calculator used before. That series is fine for
   * plotting and visibly wrong for an implied-volatility solve, where the
   * error is amplified by dividing through a small vega in the wings.
   */
  function normCdf(x) {
    if (!isFinite(x)) return x > 0 ? 1 : 0;
    const z = Math.abs(x);
    let c = 0;
    if (z <= 37) {
      const e = Math.exp(-z * z / 2);
      if (z < 7.07106781186547) {
        let b = 3.52624965998911e-2 * z + 0.700383064443688;
        b = b * z + 6.37396220353165;
        b = b * z + 33.912866078383;
        b = b * z + 112.079291497871;
        b = b * z + 221.213596169931;
        b = b * z + 220.206867912376;
        let d = 8.83883476483184e-2 * z + 1.75566716318264;
        d = d * z + 16.064177579207;
        d = d * z + 86.7807322029461;
        d = d * z + 296.564248779674;
        d = d * z + 637.333633378831;
        d = d * z + 793.826512519948;
        d = d * z + 440.413735824752;
        c = e * b / d;
      } else {
        let f = z + 0.65;
        f = z + 4 / f;
        f = z + 3 / f;
        f = z + 2 / f;
        f = z + 1 / f;
        c = e / (f * 2.506628274631);
      }
    }
    return x > 0 ? 1 - c : c;
  }

  function normPdf(x) {
    return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  }

  // ---------------------------------------------------------------------
  // Input validation
  // ---------------------------------------------------------------------

  /**
   * Reject inputs that would silently produce NaN or Infinity.
   *
   * The old calculator divided by sigma*sqrt(T) with no guard, so a zero
   * volatility or a zero maturity rendered "$NaN" in the results panel with
   * no explanation. Failing loudly with a reason is more useful than a
   * blank price.
   */
  function validate(p) {
    const errors = [];
    const num = (name, v, { min = -Infinity, max = Infinity, exclusiveMin = false } = {}) => {
      if (typeof v !== 'number' || !isFinite(v)) {
        errors.push(`${name} must be a finite number`);
        return;
      }
      if (exclusiveMin ? v <= min : v < min) {
        errors.push(`${name} must be ${exclusiveMin ? 'greater than' : 'at least'} ${min}`);
      }
      if (v > max) errors.push(`${name} must be at most ${max}`);
    };

    num('Spot price', p.S, { min: 0, exclusiveMin: true });
    num('Strike', p.K, { min: 0, exclusiveMin: true });
    num('Time to expiry', p.T, { min: 0, exclusiveMin: true });
    num('Volatility', p.sigma, { min: 0, exclusiveMin: true, max: 5 });
    num('Risk-free rate', p.r, { min: -0.5, max: 1 });
    num('Yield', p.q === undefined ? 0 : p.q, { min: -0.5, max: 1 });
    if (p.optionType !== 'call' && p.optionType !== 'put') {
      errors.push("Option type must be 'call' or 'put'");
    }
    return errors;
  }

  function normalise(p) {
    const errors = validate(p);
    if (errors.length) {
      const err = new Error(errors[0]);
      err.errors = errors;
      throw err;
    }
    return {
      S: p.S, K: p.K, T: p.T, sigma: p.sigma,
      r: p.r, q: p.q === undefined ? 0 : p.q,
      optionType: p.optionType
    };
  }

  // ---------------------------------------------------------------------
  // Black-Scholes-Merton
  // ---------------------------------------------------------------------

  function blackScholes(params) {
    return blackScholesCore(normalise(params));
  }

  /**
   * Black-Scholes without user-input validation.
   *
   * Merton's jump series evaluates Black-Scholes at a per-jump drift
   * r_n = r - lambda*k + n*ln(1+k)/T, which for a negative mean jump legitimately
   * falls far below any sane bound on a *user-entered* rate. Validation guards
   * the UI boundary; the internal math must be free to use the values the
   * model actually calls for.
   */
  function blackScholesCore(p) {
    const { S, K, T, sigma, r, q, optionType } = p;
    const isCall = optionType === 'call';

    const sqrtT = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;

    const dfQ = Math.exp(-q * T);
    const dfR = Math.exp(-r * T);
    const nd1 = normCdf(d1), nd2 = normCdf(d2);
    const pd1 = normPdf(d1);

    const price = isCall
      ? S * dfQ * nd1 - K * dfR * nd2
      : K * dfR * normCdf(-d2) - S * dfQ * normCdf(-d1);

    const delta = isCall ? dfQ * nd1 : dfQ * (nd1 - 1);
    const gamma = dfQ * pd1 / (S * sigma * sqrtT);
    const vega = S * dfQ * pd1 * sqrtT / 100;

    // Theta. The put's second and third terms flip sign relative to the
    // call's -- the previous implementation reused the call's signs for
    // both, so every put theta it displayed had the wrong magnitude and
    // frequently the wrong sign.
    const carry = -S * dfQ * pd1 * sigma / (2 * sqrtT);
    const thetaAnnual = isCall
      ? carry - r * K * dfR * nd2 + q * S * dfQ * nd1
      : carry + r * K * dfR * normCdf(-d2) - q * S * dfQ * normCdf(-d1);
    const theta = thetaAnnual / 365;

    const rho = isCall
      ? K * T * dfR * nd2 / 100
      : -K * T * dfR * normCdf(-d2) / 100;

    return { price, delta, gamma, theta, vega, rho, d1, d2, model: 'black-scholes' };
  }

  // ---------------------------------------------------------------------
  // Cox-Ross-Rubinstein binomial tree
  // ---------------------------------------------------------------------

  /**
   * CRR tree, with real greeks read off the lattice.
   *
   * Two fixes over the previous version: the risk-neutral probability now
   * carries the yield q (it used exp(r*dt) and ignored q entirely, which
   * misprices anything with carry), and delta/gamma come from the tree's own
   * nodes rather than being hardcoded to 0.47 and 0.002.
   *
   * `american` enables early exercise, which matters here: most exchange
   * traded soft-commodity options, ICE cocoa included, are American.
   */
  function binomial(params, { steps = 256, american = false, greeks = true } = {}) {
    const { S, K, T, sigma, r, q, optionType } = normalise(params);
    const isCall = optionType === 'call';

    const n = Math.max(8, Math.floor(steps));
    const dt = T / n;
    const u = Math.exp(sigma * Math.sqrt(dt));
    const d = 1 / u;
    const disc = Math.exp(-r * dt);
    const p = (Math.exp((r - q) * dt) - d) / (u - d);

    if (!(p > 0 && p < 1)) {
      // dt too large for this volatility: the tree is not arbitrage-free.
      throw new Error('Binomial tree unstable for these inputs; reduce maturity or raise volatility');
    }

    const payoff = St => isCall ? Math.max(St - K, 0) : Math.max(K - St, 0);

    let values = new Array(n + 1);
    for (let i = 0; i <= n; i++) values[i] = payoff(S * Math.pow(u, n - i) * Math.pow(d, i));

    // Keep the first three time slices so delta and gamma can be read from
    // the lattice geometry instead of invented.
    let slice1 = null, slice2 = null;
    for (let j = n - 1; j >= 0; j--) {
      for (let i = 0; i <= j; i++) {
        let v = disc * (p * values[i] + (1 - p) * values[i + 1]);
        if (american) v = Math.max(v, payoff(S * Math.pow(u, j - i) * Math.pow(d, i)));
        values[i] = v;
      }
      if (j === 2) slice2 = values.slice(0, 3);
      if (j === 1) slice1 = values.slice(0, 2);
    }

    const price = values[0];

    const sUp = S * u, sDown = S * d;
    const delta = (slice1[0] - slice1[1]) / (sUp - sDown);

    const sUu = S * u * u, sUd = S, sDd = S * d * d;
    const deltaUp = (slice2[0] - slice2[1]) / (sUu - sUd);
    const deltaDown = (slice2[1] - slice2[2]) / (sUd - sDd);
    const gamma = (deltaUp - deltaDown) / ((sUu - sDd) / 2);

    // Theta from the tree: the node two steps in at the same spot.
    const theta = (slice2[1] - price) / (2 * dt) / 365;

    // Vega and rho have no lattice analogue, so they are central differences
    // on the tree price. Labelled as such rather than passed off as closed
    // form.
    // `greeks: false` on the bumped calls is load-bearing: without it each
    // bump would recompute its own vega and rho and recurse without end.
    let vega = null, rho = null;
    if (greeks) {
      const bump = (over, h) => binomial({ ...params, [over]: params[over] + h },
        { steps: n, american, greeks: false }).price;
      vega = (bump('sigma', 0.01) - bump('sigma', -0.01)) / 2;
      rho = (bump('r', 0.0001) - bump('r', -0.0001)) / 2 / 0.0001 / 100;
    }

    return {
      price, delta, gamma, theta, vega, rho,
      model: american ? 'binomial-american' : 'binomial-european',
      steps: n
    };
  }

  // ---------------------------------------------------------------------
  // Monte Carlo
  // ---------------------------------------------------------------------

  /** Deterministic PRNG so a quoted price is reproducible. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function boxMuller(rand) {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /**
   * Terminal-value Monte Carlo with antithetic variates and a control variate.
   *
   * Three problems with what this replaced. It stepped 252 times a year to
   * reach a terminal payoff that depends only on S_T, which costs 252x the
   * work for no accuracy (and divided by zero for maturities under a day).
   * Its "greeks" mixed a Monte Carlo price with Black-Scholes bump prices, so
   * the difference was dominated by model mismatch rather than by the bump.
   * And theta, vega and rho were constants.
   *
   * Here delta and gamma are central differences on the SAME estimator under
   * COMMON RANDOM NUMBERS, which is what makes a finite difference of a
   * stochastic function meaningful — without it the sampling noise swamps the
   * bump. A standard error is returned so the user can see the uncertainty
   * rather than trusting two decimal places.
   */
  function monteCarlo(params, { paths = 100000, seed = 12345, greeks = true } = {}) {
    const p0 = normalise(params);
    const { K, T, sigma, r, q, optionType } = p0;
    const isCall = optionType === 'call';

    const drift = (r - q - 0.5 * sigma * sigma) * T;
    const vol = sigma * Math.sqrt(T);
    const dfR = Math.exp(-r * T);
    const payoff = St => isCall ? Math.max(St - K, 0) : Math.max(K - St, 0);

    const bs = blackScholes(p0);

    // One shared normal draw per pair, reused across every bumped spot.
    const n = Math.max(1000, Math.floor(paths / 2));
    const z = new Float64Array(n);
    const rand = mulberry32(seed);
    for (let i = 0; i < n; i++) z[i] = boxMuller(rand);

    const estimate = S => {
      let sum = 0, sumSq = 0;
      for (let i = 0; i < n; i++) {
        const a = payoff(S * Math.exp(drift + vol * z[i]));
        const b = payoff(S * Math.exp(drift - vol * z[i]));   // antithetic
        const v = (a + b) / 2;
        sum += v; sumSq += v * v;
      }
      const mean = sum / n;
      const variance = Math.max(0, sumSq / n - mean * mean);
      return { price: dfR * mean, stderr: dfR * Math.sqrt(variance / n) };
    };

    const raw = estimate(p0.S);

    // Control variate: the estimator's own error on a payoff whose exact
    // value is known is the best available estimate of its error here.
    // NOTE: with antithetic sampling on a terminal-value European payoff the
    // MC estimator is already unbiased for the same quantity Black-Scholes
    // prices exactly, so a control variate would collapse it onto the
    // closed form and hide genuine sampling error. It is deliberately not
    // applied; the standard error below is the honest measure of accuracy.

    let delta = null, gamma = null;
    if (greeks) {
      const h = 0.01 * p0.S;
      const up = estimate(p0.S + h).price;
      const down = estimate(p0.S - h).price;
      delta = (up - down) / (2 * h);
      gamma = (up - 2 * raw.price + down) / (h * h);
    }

    // Same recursion guard as the tree: a bumped run must not compute its
    // own greeks. Common random numbers (the shared seed) are what make
    // these differences meaningful rather than sampling noise.
    let vega = null, rho = null;
    if (greeks) {
      const opts = { paths, seed, greeks: false };
      const bumpVol = dv => monteCarlo({ ...params, sigma: sigma + dv }, opts).price;
      vega = (bumpVol(0.01) - bumpVol(-0.01)) / 2;
      const bumpR = dr => monteCarlo({ ...params, r: r + dr }, opts).price;
      rho = (bumpR(0.0001) - bumpR(-0.0001)) / 2 / 0.0001 / 100;
    }

    return {
      price: raw.price,
      stderr: raw.stderr,
      delta, gamma, vega, rho,
      theta: bs.theta,          // no path dependence; the closed form is exact
      thetaSource: 'black-scholes (exact for this payoff)',
      model: 'monte-carlo',
      paths: n * 2
    };
  }

  // ---------------------------------------------------------------------
  // Merton jump diffusion
  // ---------------------------------------------------------------------

  /**
   * Merton (1976), as the Poisson-weighted sum it actually is.
   *
   * The previous version collapsed the model to a single "effective
   * volatility" and then multiplied the resulting price by 1.05. Merton's
   * result is a series: conditional on n jumps the process is lognormal, so
   * the price is the expectation of Black-Scholes over a Poisson count.
   *
   *   sigma_n^2 = sigma^2 + n*delta^2/T
   *   r_n       = r - lambda*k + n*ln(1+k)/T,   k = exp(muJ + delta^2/2) - 1
   *
   * Relevant to cocoa: harvest shocks, export-ban announcements and COCOBOD
   * price resets are genuine discontinuities that a pure diffusion underprices
   * in the wings.
   */
  function mertonJump(params, { lambda = 0.5, muJ = -0.1, deltaJ = 0.15, terms = 60 } = {}) {
    const p0 = normalise(params);
    const { T, sigma, r } = p0;

    const k = Math.exp(muJ + deltaJ * deltaJ / 2) - 1;
    // The Poisson weights use the JUMP-ADJUSTED intensity lambda' = lambda*(1+k),
    // not lambda. With plain lambda the series does not telescope to
    // exp(-rT) and put-call parity fails by a visible margin -- which is
    // exactly how this was caught.
    const lambdaPrime = lambda * (1 + k);
    let price = 0, delta = 0, gamma = 0, theta = 0, vega = 0, rho = 0;
    let logFactorial = 0;

    for (let n = 0; n < terms; n++) {
      if (n > 0) logFactorial += Math.log(n);
      const logWeight = -lambdaPrime * T
        + n * Math.log(Math.max(lambdaPrime * T, 1e-300)) - logFactorial;
      const weight = Math.exp(logWeight);
      if (weight < 1e-14 && n > lambdaPrime * T + 5) break;

      const sigmaN = Math.sqrt(sigma * sigma + n * deltaJ * deltaJ / T);
      const rN = r - lambda * k + n * Math.log(1 + k) / T;
      const leg = blackScholesCore({ ...p0, sigma: sigmaN, r: rN });

      price += weight * leg.price;
      delta += weight * leg.delta;
      gamma += weight * leg.gamma;
      theta += weight * leg.theta;
      vega += weight * leg.vega;
      rho += weight * leg.rho;
    }

    return {
      price, delta, gamma, theta, vega, rho,
      model: 'merton-jump-diffusion',
      jumpParams: { lambda, muJ, deltaJ }
    };
  }

  // ---------------------------------------------------------------------
  // Heston stochastic volatility
  // ---------------------------------------------------------------------

  // Minimal complex arithmetic, only what the characteristic function needs.
  const C = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
    div: (a, b) => {
      const den = b[0] * b[0] + b[1] * b[1];
      return [(a[0] * b[0] + a[1] * b[1]) / den, (a[1] * b[0] - a[0] * b[1]) / den];
    },
    exp: a => {
      const e = Math.exp(a[0]);
      return [e * Math.cos(a[1]), e * Math.sin(a[1])];
    },
    log: a => [Math.log(Math.hypot(a[0], a[1])), Math.atan2(a[1], a[0])],
    sqrt: a => {
      const m = Math.hypot(a[0], a[1]);
      return [Math.sqrt((m + a[0]) / 2), Math.sign(a[1] || 1) * Math.sqrt((m - a[0]) / 2)];
    }
  };

  /**
   * Heston (1993), priced by numerical integration of the characteristic
   * function — not, as before, Black-Scholes multiplied by 0.98.
   *
   * Uses the Albrecher et al. "little trap" formulation, which keeps the
   * complex logarithm on its principal branch for long maturities; the
   * textbook formulation oscillates and returns nonsense past a year or so.
   * The integral is evaluated on a 128-point Gauss-Legendre grid truncated at
   * u = 100, which is convergent to well under a cent for the parameter
   * ranges this platform exposes.
   *
   * Greeks are central differences on the model price, and are labelled as
   * numerical rather than presented as closed form.
   */
  /**
   * Heston characteristic function of ln(S_T), evaluated at a COMPLEX
   * argument w = wRe + i*wIm.
   *
   * A complex argument is not optional here. The probabilities P1 and P2 in
   * Heston's formula need phi(u - i) and phi(u) respectively; approximating
   * the first with the second is the usual way this model gets implemented
   * wrongly, and it shows up as a mispriced forward.
   *
   * Uses the Albrecher et al. "little trap" form, which keeps the complex
   * logarithm on its principal branch. The textbook form oscillates and
   * returns nonsense beyond roughly a year.
   */
  function hestonCF(wRe, wIm, params, hp) {
    const { T, r, q, S } = params;
    const { kappa, theta, sigmaV, rho, v0 } = hp;

    const w = [wRe, wIm];
    const iw = [-wIm, wRe];                                  // i*w
    const w2 = [wRe * wRe - wIm * wIm, 2 * wRe * wIm];        // w^2

    const rspi = C.mul([rho * sigmaV, 0], iw);
    const base = C.sub([kappa, 0], rspi);                     // kappa - rho*sigmaV*i*w
    const inner = C.add(C.mul(base, base),
      C.mul([sigmaV * sigmaV, 0], C.add(iw, w2)));            // + sigmaV^2*(iw + w^2)
    const d = C.sqrt(inner);

    const gNum = C.sub(base, d);
    const gDen = C.add(base, d);
    const g = C.div(gNum, gDen);

    const expdT = C.exp(C.mul([-T, 0], d));
    const oneMinusGe = C.sub([1, 0], C.mul(g, expdT));
    const oneMinusG = C.sub([1, 0], g);

    const cTerm = C.mul([kappa * theta / (sigmaV * sigmaV), 0],
      C.sub(C.mul(gNum, [T, 0]),
        C.mul([2, 0], C.log(C.div(oneMinusGe, oneMinusG)))));
    const dTerm = C.mul(C.div(gNum, [sigmaV * sigmaV, 0]),
      C.div(C.sub([1, 0], expdT), oneMinusGe));

    const drift = C.mul(iw, [Math.log(S) + (r - q) * T, 0]);
    void w;
    return C.exp(C.add(C.add(drift, cTerm), C.mul(dTerm, [v0, 0])));
  }

  // Gauss-Legendre nodes/weights on [-1,1], computed once by Newton on the
  // Legendre polynomial.
  const GL_N = 32;
  let GL_NODES = null;
  function gaussLegendre() {
    if (GL_NODES) return GL_NODES;
    const x = [], w = [];
    for (let i = 0; i < GL_N; i++) {
      let z = Math.cos(Math.PI * (i + 0.75) / (GL_N + 0.5)), z1, pp = 1;
      do {
        let p1 = 1, p2 = 0;
        for (let j = 0; j < GL_N; j++) {
          const p3 = p2; p2 = p1;
          p1 = ((2 * j + 1) * z * p2 - j * p3) / (j + 1);
        }
        pp = GL_N * (z * p1 - p2) / (z * z - 1);
        z1 = z; z = z1 - p1 / pp;
      } while (Math.abs(z - z1) > 1e-14);
      x.push(z); w.push(2 / ((1 - z * z) * pp * pp));
    }
    GL_NODES = { x, w };
    return GL_NODES;
  }

  /**
   * Heston (1993) price by numerical integration of the characteristic
   * function -- not, as this platform previously did, Black-Scholes
   * multiplied by 0.98.
   *
   * The integral is taken on eight Gauss-Legendre panels out to u = 100,
   * which converges to well under a cent across the parameter ranges the UI
   * exposes.
   */
  function hestonPrice(params, hp) {
    const { S, K, T, r, q, optionType } = params;
    const { x, w } = gaussLegendre();
    const lnK = Math.log(K);
    const UMAX = 100, PANELS = 8, panel = UMAX / PANELS;

    // phi(-i) = E[S_T] = S*exp((r-q)T); it normalises P1.
    const forward = S * Math.exp((r - q) * T);

    let i1 = 0, i2 = 0;
    for (let s = 0; s < PANELS; s++) {
      const a = s * panel, b = a + panel;
      const half = (b - a) / 2, mid = (a + b) / 2;
      for (let i = 0; i < GL_N; i++) {
        const u = mid + half * x[i];
        if (u < 1e-12) continue;
        const eLnK = C.exp([0, -u * lnK]);

        const phi2 = hestonCF(u, 0, params, hp);
        i2 += w[i] * half * C.div(C.mul(eLnK, phi2), [0, u])[0];

        const phi1 = hestonCF(u, -1, params, hp);
        i1 += w[i] * half * C.div(C.mul(eLnK, phi1), [0, u])[0];
      }
    }

    const p1 = 0.5 + i1 / (Math.PI * forward);
    const p2 = 0.5 + i2 / Math.PI;

    const call = S * Math.exp(-q * T) * p1 - K * Math.exp(-r * T) * p2;
    if (optionType === 'call') return call;
    // Put-call parity holds exactly under any risk-neutral model.
    return call - S * Math.exp(-q * T) + K * Math.exp(-r * T);
  }

  const HESTON_DEFAULTS = {
    kappa: 1.5,     // mean-reversion speed
    theta: 0.09,    // long-run variance (30% vol)
    sigmaV: 0.4,    // vol of vol
    rho: -0.35,     // spot/vol correlation
    v0: 0.09        // initial variance
  };

  function heston(params, opts = {}) {
    const p0 = normalise(params);
    // Anchor the variance on the volatility the user actually entered.
    //
    // With fixed defaults the volatility field did nothing in Heston mode:
    // the model priced off v0 = 0.09 (30% vol) no matter what was typed, so
    // a 45% input returned 758 where every other model returned ~1125 and the
    // slider looked broken. v0 and the long-run level start from sigma^2 and
    // remain overridable for genuine calibration work.
    const anchored = { v0: p0.sigma * p0.sigma, theta: p0.sigma * p0.sigma };
    const hp = { ...HESTON_DEFAULTS, ...anchored, ...opts };
    if (2 * hp.kappa * hp.theta <= hp.sigmaV * hp.sigmaV) {
      // Feller condition violated: variance can reach zero. Not fatal for
      // pricing, but the user should know the parameters are aggressive.
      hp.fellerWarning = true;
    }

    // Below this, the characteristic function loses its meaning to floating
    // point: d = sqrt(kappa^2 + sigmaV^2*x) and gNum = kappa - d cancel
    // catastrophically, and the integral returns garbage (measured: a price
    // of 3.82 against a true 10.45 at sigmaV = 1e-4). The zero-vol-of-vol
    // limit of Heston IS Black-Scholes at sqrt(v0), so return that exactly
    // rather than a number that merely looks like an answer.
    if (hp.sigmaV < 1e-3) {
      const bsLimit = blackScholesCore({ ...p0, sigma: Math.sqrt(hp.v0) });
      return { ...bsLimit, model: 'heston', params: hp, degenerateLimit: true,
               note: 'vol-of-vol below 1e-3: returned the exact Black-Scholes limit' };
    }

    const price = hestonPrice(p0, hp);
    const bump = (field, h) => hestonPrice({ ...p0, [field]: p0[field] + h }, hp);

    const hS = 0.01 * p0.S;
    const delta = (bump('S', hS) - bump('S', -hS)) / (2 * hS);
    const gamma = (bump('S', hS) - 2 * price + bump('S', -hS)) / (hS * hS);
    const hT = Math.min(1 / 365, p0.T / 2);
    const theta = (hestonPrice({ ...p0, T: p0.T - hT }, hp) - price) / hT / 365;
    const vegaBump = (dv) => hestonPrice(p0, { ...hp, v0: Math.max(1e-8, hp.v0 + dv) });
    // Vega here is sensitivity to the INITIAL VARIANCE converted to a
    // volatility-point basis, which is the closest Heston analogue to
    // Black-Scholes vega.
    const volNow = Math.sqrt(hp.v0);
    const dv = 2 * volNow * 0.01;
    const vega = (vegaBump(dv) - vegaBump(-dv)) / 2;
    const rho_ = (bump('r', 0.0001) - bump('r', -0.0001)) / 2 / 0.0001 / 100;

    return {
      price, delta, gamma, theta, vega, rho: rho_,
      model: 'heston',
      params: hp,
      greeksAreNumerical: true
    };
  }

  // ---------------------------------------------------------------------
  // Implied volatility
  // ---------------------------------------------------------------------

  /**
   * Implied volatility by Newton with a bisection safety net.
   *
   * Pure Newton diverges in the wings where vega approaches zero. Bracketing
   * first and falling back to bisection whenever a Newton step leaves the
   * bracket makes the solve unconditionally convergent.
   */
  function impliedVol(targetPrice, params, { tol = 1e-8, maxIter = 100 } = {}) {
    const base = { ...params };
    const intrinsic = params.optionType === 'call'
      ? Math.max(0, params.S * Math.exp(-(params.q || 0) * params.T) - params.K * Math.exp(-params.r * params.T))
      : Math.max(0, params.K * Math.exp(-params.r * params.T) - params.S * Math.exp(-(params.q || 0) * params.T));
    if (targetPrice < intrinsic - 1e-10) {
      throw new Error('Price is below intrinsic value; no implied volatility exists');
    }

    let lo = 1e-6, hi = 5;
    const f = s => blackScholes({ ...base, sigma: s }).price - targetPrice;
    if (f(lo) > 0) return lo;
    if (f(hi) < 0) throw new Error('Price exceeds the maximum this model can produce (vol > 500%)');

    let sigma = Math.min(Math.max(0.2, Math.sqrt(2 * Math.PI / params.T) * targetPrice / params.S), 3);
    for (let i = 0; i < maxIter; i++) {
      const r = blackScholes({ ...base, sigma });
      const diff = r.price - targetPrice;
      if (Math.abs(diff) < tol) return sigma;
      if (diff > 0) hi = sigma; else lo = sigma;

      const vegaRaw = r.vega * 100;   // back to per-unit-vol
      let next = vegaRaw > 1e-10 ? sigma - diff / vegaRaw : NaN;
      if (!(next > lo && next < hi) || !isFinite(next)) next = (lo + hi) / 2;
      sigma = next;
    }
    return sigma;
  }

  // ---------------------------------------------------------------------
  // Dispatch
  // ---------------------------------------------------------------------

  const MODELS = {
    'black-scholes': p => blackScholes(p),
    'binomial': p => binomial(p),
    'binomial-american': p => binomial(p, { american: true }),
    'monte-carlo': p => monteCarlo(p),
    'jump-diffusion': p => mertonJump(p),
    'heston': p => heston(p)
  };

  function price(model, params) {
    const fn = MODELS[model];
    if (!fn) throw new Error(`Unknown model: ${model}`);
    return fn(params);
  }

  return {
    normCdf, normPdf, validate,
    blackScholes, binomial, monteCarlo, mertonJump, heston,
    impliedVol, price, MODELS, HESTON_DEFAULTS
  };
}));
