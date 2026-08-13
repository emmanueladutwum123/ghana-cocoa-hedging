/*
 * test-pricing.js — run with:  node test-pricing.js
 *
 * Every model is checked against something independent of itself: a published
 * reference value, an arbitrage identity that must hold regardless of model,
 * or a limiting case where a complex model must collapse onto a simple one.
 * A model that only agrees with itself has not been tested.
 */
const P = require('./pricing.js');

let passed = 0, failed = 0;
const results = [];

function check(name, actual, expected, tol) {
  const ok = Math.abs(actual - expected) <= tol;
  results.push({ name, actual, expected, tol, ok });
  ok ? passed++ : failed++;
}
function checkTrue(name, cond, detail = '') {
  results.push({ name, actual: cond ? 'true' : 'false', expected: 'true', tol: 0, ok: !!cond, detail });
  cond ? passed++ : failed++;
}

const base = { S: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, q: 0, optionType: 'call' };

// --- 1. Black-Scholes against published reference values ------------------
// Hull, Options Futures & Other Derivatives: S=100 K=100 T=1 r=5% sigma=20%
check('BS call price (Hull reference)', P.blackScholes(base).price, 10.4506, 1e-3);
check('BS put price (Hull reference)',
  P.blackScholes({ ...base, optionType: 'put' }).price, 5.5735, 1e-3);
check('BS call delta', P.blackScholes(base).delta, 0.6368, 1e-3);
check('BS gamma', P.blackScholes(base).gamma, 0.018762, 1e-5);

// --- 2. Put-call parity: model-independent, must hold exactly -------------
{
  const c = P.blackScholes({ ...base, q: 0.03 }).price;
  const p = P.blackScholes({ ...base, q: 0.03, optionType: 'put' }).price;
  const lhs = c - p;
  const rhs = base.S * Math.exp(-0.03 * base.T) - base.K * Math.exp(-base.r * base.T);
  check('Put-call parity (with yield)', lhs, rhs, 1e-10);
}

// --- 3. Greeks against finite differences of the price --------------------
// This is what catches the put-theta sign bug that was in the old code.
function fdGreeks(params) {
  const h = 1e-5;
  const px = o => P.blackScholes({ ...params, ...o }).price;
  return {
    delta: (px({ S: params.S + h }) - px({ S: params.S - h })) / (2 * h),
    gamma: (px({ S: params.S + h }) - 2 * px({}) + px({ S: params.S - h })) / (h * h),
    // theta is -dV/dT per day
    theta: -(px({ T: params.T + h }) - px({ T: params.T - h })) / (2 * h) / 365,
    vega: (px({ sigma: params.sigma + h }) - px({ sigma: params.sigma - h })) / (2 * h) / 100,
    rho: (px({ r: params.r + h }) - px({ r: params.r - h })) / (2 * h) / 100
  };
}
for (const type of ['call', 'put']) {
  for (const q of [0, 0.04]) {
    const params = { ...base, optionType: type, q };
    const a = P.blackScholes(params), f = fdGreeks(params);
    check(`BS ${type} delta vs FD (q=${q})`, a.delta, f.delta, 1e-5);
    check(`BS ${type} gamma vs FD (q=${q})`, a.gamma, f.gamma, 1e-3);
    check(`BS ${type} THETA vs FD (q=${q})`, a.theta, f.theta, 1e-6);
    check(`BS ${type} vega vs FD (q=${q})`, a.vega, f.vega, 1e-5);
    check(`BS ${type} rho vs FD (q=${q})`, a.rho, f.rho, 1e-5);
  }
}

// --- 4. Binomial must converge to Black-Scholes ---------------------------
for (const type of ['call', 'put']) {
  const params = { ...base, optionType: type, q: 0.03 };
  const bs = P.blackScholes(params).price;
  const bin = P.binomial(params, { steps: 2000 }).price;
  check(`Binomial -> BS (${type}, with yield)`, bin, bs, 0.01);
}
{
  // Tree greeks must land near the closed form.
  const b = P.binomial(base, { steps: 1000 }), a = P.blackScholes(base);
  check('Binomial delta vs BS', b.delta, a.delta, 5e-3);
  check('Binomial gamma vs BS', b.gamma, a.gamma, 5e-3);
  checkTrue('Binomial greeks are not the old hardcoded 0.47/0.002',
    Math.abs(b.delta - 0.47) > 1e-9 && Math.abs(b.gamma - 0.002) > 1e-9);
}
{
  // American put must be worth at least the European one.
  const params = { ...base, optionType: 'put', r: 0.10 };
  const eu = P.binomial(params, { steps: 500 }).price;
  const us = P.binomial(params, { steps: 500, american: true }).price;
  checkTrue('American put >= European put', us >= eu - 1e-9, `${us} vs ${eu}`);
  checkTrue('American put strictly greater when rates are high', us > eu + 1e-4);
}

// --- 5. Monte Carlo must agree with BS inside its own error bar -----------
{
  const mc = P.monteCarlo(base, { paths: 200000, seed: 7 });
  const bs = P.blackScholes(base).price;
  checkTrue(`MC within 4 standard errors of BS (${mc.price.toFixed(4)} vs ${bs.toFixed(4)}, se=${mc.stderr.toFixed(4)})`,
    Math.abs(mc.price - bs) < 4 * mc.stderr);
  checkTrue('MC reports a standard error at all', mc.stderr > 0 && isFinite(mc.stderr));
  check('MC delta vs BS', mc.delta, P.blackScholes(base).delta, 0.02);
  checkTrue('MC greeks are not the old hardcoded -15.2/68.5/42.3',
    Math.abs(mc.vega - 68.5) > 1e-9 && Math.abs(mc.rho - 42.3) > 1e-9);
  // Reproducibility: same seed, same answer.
  check('MC is reproducible with a fixed seed',
    P.monteCarlo(base, { paths: 50000, seed: 3 }).price,
    P.monteCarlo(base, { paths: 50000, seed: 3 }).price, 0);
}

// --- 6. Merton with no jumps must collapse to Black-Scholes ---------------
for (const type of ['call', 'put']) {
  const params = { ...base, optionType: type };
  const bs = P.blackScholes(params).price;
  const mj = P.mertonJump(params, { lambda: 0 }).price;
  check(`Merton(lambda=0) -> BS (${type})`, mj, bs, 1e-8);
}
{
  // With jumps the price must move, and fat tails should lift it.
  const withJumps = P.mertonJump(base, { lambda: 0.5, muJ: -0.1, deltaJ: 0.15 }).price;
  checkTrue('Merton with jumps differs from BS',
    Math.abs(withJumps - P.blackScholes(base).price) > 0.01);
  // Merton put-call parity still holds.
  const c = P.mertonJump(base).price;
  const p = P.mertonJump({ ...base, optionType: 'put' }).price;
  check('Merton put-call parity', c - p,
    base.S - base.K * Math.exp(-base.r * base.T), 1e-6);
}

// --- 7. Heston must collapse to BS as vol-of-vol -> 0 ---------------------
// This is the decisive test. If it fails, the characteristic function or the
// integration is wrong -- exactly the failure the old "BS * 0.98" hid.
for (const type of ['call', 'put']) {
  const sigma = 0.2, v = sigma * sigma;
  const params = { ...base, optionType: type, sigma };
  const bs = P.blackScholes(params).price;
  // sigmaV = 0.01 rather than something smaller: below ~1e-3 the
  // characteristic function is destroyed by catastrophic cancellation, which
  // is a property of the formulation, not of this implementation.
  const h = P.heston(params, { kappa: 2, theta: v, sigmaV: 0.01, rho: 0, v0: v }).price;
  check(`Heston(small sigmaV) -> BS (${type})`, h, bs, 5e-3);
  // Monotone convergence as vol-of-vol shrinks.
  const errs = [0.2, 0.05, 0.01].map(sv =>
    Math.abs(P.heston(params, { kappa: 2, theta: v, sigmaV: sv, rho: 0, v0: v }).price - bs));
  checkTrue(`Heston converges to BS as sigmaV falls (${type})`,
    errs[0] > errs[1] && errs[1] > errs[2], errs.map(e => e.toFixed(5)).join(' > '));
  // And the degenerate guard returns the exact limit.
  check(`Heston degenerate guard -> exact BS (${type})`,
    P.heston(params, { kappa: 2, theta: v, sigmaV: 1e-6, rho: 0, v0: v }).price, bs, 1e-10);
}
{
  // NOTE: a put-call parity check on Heston would be vacuous here, because
  // the put is *derived* from the call by parity. It would pass even if both
  // legs were wrong. The convergence tests above are what actually constrain
  // the implementation.
  // Negative correlation must raise put prices relative to zero correlation
  // (that is what a volatility skew is).
  const skew = P.heston({ ...base, optionType: 'put', K: 80 }, { rho: -0.7 }).price;
  const flat = P.heston({ ...base, optionType: 'put', K: 80 }, { rho: 0 }).price;
  checkTrue('Heston: negative rho lifts the downside put (skew)', skew > flat,
    `${skew.toFixed(4)} vs ${flat.toFixed(4)}`);
  checkTrue('Heston is not just BS*0.98',
    Math.abs(P.heston(base).price - 0.98 * P.blackScholes(base).price) > 1e-6);
}

// --- 8. Implied volatility round-trip ------------------------------------
for (const K of [70, 100, 130]) {
  for (const type of ['call', 'put']) {
    const params = { ...base, K, optionType: type, sigma: 0.35 };
    const px = P.blackScholes(params).price;
    const iv = P.impliedVol(px, { ...params, sigma: undefined });
    check(`IV round-trip K=${K} ${type}`, iv, 0.35, 1e-6);
  }
}
{
  let threw = false;
  try { P.impliedVol(0.0001, { ...base, K: 50 }); } catch (e) { threw = true; }
  checkTrue('IV rejects a price below intrinsic', threw);
}

// --- 9. Validation must reject the inputs that used to render NaN --------
const badInputs = [
  ['zero volatility', { ...base, sigma: 0 }],
  ['zero maturity', { ...base, T: 0 }],
  ['negative spot', { ...base, S: -1 }],
  ['zero strike', { ...base, K: 0 }],
  ['bad option type', { ...base, optionType: 'straddle' }],
  ['NaN input', { ...base, S: NaN }]
];
for (const [name, p] of badInputs) {
  let threw = false;
  try { P.blackScholes(p); } catch (e) { threw = true; }
  checkTrue(`Rejects ${name}`, threw);
}
{
  const r = P.blackScholes(base);
  checkTrue('No NaN in a normal result',
    Object.values(r).every(v => typeof v !== 'number' || isFinite(v)));
}

// --- report ---------------------------------------------------------------
const width = 62;
for (const r of results) {
  if (!r.ok) {
    console.log(`FAIL  ${r.name}`);
    console.log(`        got ${r.actual}, expected ${r.expected} (tol ${r.tol}) ${r.detail || ''}`);
  }
}
console.log('-'.repeat(width));
console.log(`${passed} passed, ${failed} failed, ${passed + failed} total`);
process.exit(failed ? 1 : 0);
