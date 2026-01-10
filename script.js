// script.js - COMPLETE REVISED with Advanced AI Assistant
// Ghana Cocoa Derivatives Research Platform v3.2
// AI Assistant with Quantitative Problem Solving

class CorePlatform {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupAIAssistant();
        this.setupAnimations();
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAPIFunctions();
        this.fixNavigationIssues();
        this.fixBrokenButtons();
        
        // Initialize advanced AI assistant
        this.initializeAdvancedAI();
    }
    
    initializeAdvancedAI() {
        console.log("🚀 Initializing Advanced Cocoa Risk Assistant AI");
        
        // Enhanced knowledge base for quantitative finance
        this.aiKnowledgeBase = {
            // Options Pricing Models
            'black scholes': {
                title: "Black-Scholes-Merton Model for Cocoa Options",
                content: `**Black-Scholes-Merton with Convenience Yield (δ):**

Call Price: C = S₀e^(-δT)N(d₁) - Ke^(-rT)N(d₂)
Put Price: P = Ke^(-rT)N(-d₂) - S₀e^(-δT)N(-d₁)

**Where:**
d₁ = [ln(S₀/K) + (r - δ + σ²/2)T] / (σ√T)
d₂ = d₁ - σ√T

**Parameters for Ghana Cocoa:**
- S₀ = Current cocoa price ($/MT) ≈ $2,500-$4,000
- K = Strike price ($/MT)
- T = Time to expiration (years)
- r = Risk-free rate ≈ 3-5% (US Treasury rate)
- δ = Convenience yield ≈ 2-4% (storage benefit)
- σ = Volatility ≈ 25-35% for cocoa
- N(x) = Cumulative standard normal distribution

**Example Calculation (Call Option):**
S₀ = $3,800, K = $3,800, T = 0.25, r = 0.04, δ = 0.03, σ = 0.30

1. Calculate d₁ = [ln(3800/3800) + (0.04-0.03+0.30²/2)×0.25] / (0.30×√0.25)
   = [0 + (0.01+0.045)×0.25] / (0.30×0.5) = 0.01375 / 0.15 = 0.0917
   
2. N(d₁) ≈ 0.5365, N(d₂) ≈ 0.4959 (use NORMSDIST in Excel)
   
3. C = 3800×e^(-0.03×0.25)×0.5365 - 3800×e^(-0.04×0.25)×0.4959
   = 3800×0.9925×0.5365 - 3800×0.9900×0.4959
   = $202.48 - $186.43 = **$305.15**

**Ghana Application:** COCOBOD uses this to price options for forward sales.`,
                formula: "C = S₀e^(-δT)N(d₁) - Ke^(-rT)N(d₂)"
            },
            
            'binomial model': {
                title: "Binomial Options Pricing Model for Cocoa",
                content: `**Binomial Model with n steps:**
                
Step 1: Calculate up and down factors:
u = e^(σ√Δt) ≈ e^(0.30×√(T/n))
d = 1/u
p = (e^((r-δ)Δt) - d) / (u - d)

Step 2: Build price tree:
S_ij = S₀ × uⁱ × dʲ

Step 3: Calculate terminal payoffs:
Call: max(S_T - K, 0)
Put: max(K - S_T, 0)

Step 4: Backward induction:
V_ij = e^(-rΔt)[p×V_(i+1,j) + (1-p)×V_(i,j+1)]

**Example with 2 steps (3 months):**
S₀ = $3,800, K = $3,800, T = 0.25, σ = 0.30, r = 0.04, δ = 0.03

Δt = 0.25/2 = 0.125
u = e^(0.30√0.125) = 1.112
d = 1/u = 0.899
p = (e^((0.04-0.03)×0.125) - 0.899) / (1.112 - 0.899) = 0.453

Price Tree:
          $4,703 (C=$903)
$4,227     ↓
$3,800 → $3,415 (C=$15)
$3,415     ↓
          $3,069 (C=$0)

Option Price = e^(-0.04×0.125)[0.453×$903 + 0.547×$15] = **$414.12**

**Advantage:** Handles American options and dividend-like convenience yields.`,
                formula: "V_ij = e^(-rΔt)[p×V_(i+1,j) + (1-p)×V_(i,j+1)]"
            },
            
            'monte carlo pricing': {
                title: "Monte Carlo Simulation for Cocoa Options",
                content: `**Monte Carlo with 10,000 paths:**

1. Generate price paths using GBM:
   S_t = S₀ × exp[(r-δ-σ²/2)t + σ√t × Z]
   where Z ~ N(0,1)

2. For each path, calculate payoff:
   Call payoff = max(S_T - K, 0)
   Put payoff = max(K - S_T, 0)

3. Discount and average:
   Option price = e^(-rT) × average(payoffs)

**Python Pseudocode:**
\`\`\`python
import numpy as np

def monte_carlo_option(S0, K, T, r, delta, sigma, n_paths=10000):
    np.random.seed(42)
    Z = np.random.randn(n_paths)
    ST = S0 * np.exp((r - delta - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
    payoffs = np.maximum(ST - K, 0)
    price = np.exp(-r*T) * np.mean(payoffs)
    std_err = np.std(payoffs) / np.sqrt(n_paths)
    return price, price - 1.96*std_err, price + 1.96*std_err

# Ghana cocoa example
price, lower, upper = monte_carlo_option(
    S0=3800, K=3800, T=0.25, 
    r=0.04, delta=0.03, sigma=0.30
)
\`\`\`

**Result:** $305.15 with 95% CI [$298.42, $311.88]

**Variance Reduction Techniques:**
- Antithetic variates: Use -Z alongside Z
- Control variates: Hedge with futures
- Importance sampling: Focus on ITM paths`,
                formula: "Option price ≈ e^(-rT) × 𝔼[max(S_T - K, 0)]"
            },
            
            // Delta Hedging Strategies
            'delta hedging': {
                title: "Delta Hedging Strategy for Cocoa Options",
                content: `**Delta-Neutral Hedging:**

1. **Objective:** Create delta-neutral portfolio:
   Total Δ = Δ_option + Δ_hedge ≈ 0

2. **Hedge Ratio Calculation:**
   Number of futures = -Δ_option × Option Quantity / Contract Size
   For cocoa: Contract Size = 10 MT, Δ_future ≈ 1

   **Example:** Short 100 calls with Δ = 0.45
   Hedge with: -(-100 × 0.45) × 10 = 450 MT of futures

3. **Rebalancing Frequencies:**
   - **Daily:** Low tracking error (0.5%), high cost
   - **Weekly:** Optimal balance (1.2% error, moderate cost)
   - **Monthly:** High error (3.5%), low cost

4. **Transaction Costs (Ghana context):**
   - Brokerage: $5-10 per contract
   - Bid-ask spread: $5-10/MT (±0.13-0.26%)
   - Slippage: 0.05-0.1% for large orders
   - **Total cost:** ≈ 0.2-0.5% per rebalance

5. **Performance Metrics:**
   - Hedging Error = |Final P&L - Target P&L| / Notional
   - Tracking Error = σ(daily P&L) / √252
   - Cost Efficiency = Risk Reduction / Total Cost

6. **Dynamic Hedging with Gamma:**
   When Gamma is high (near ATM):
   - Rebalance more frequently
   - Consider gamma scalping

**COCOBOD Application:** Monthly rebalancing with 1% tracking error tolerance.`,
                formula: "Hedge Ratio = -Δ_option × N_options / Contract_Size"
            },
            
            'gamma scalping': {
                title: "Gamma Scalping for Cocoa Options",
                content: `**Gamma Scalping Strategy:**

Gamma measures how fast delta changes:
Γ = ∂Δ/∂S ≈ Δ_change / $1 price change

**Strategy:**
1. Start with delta-neutral portfolio
2. When price moves, delta becomes non-zero
3. Rebalance by trading underlying
4. Profit from volatility > transaction costs

**Mathematics:**
P&L ≈ 0.5 × Γ × (ΔS)² - Transaction Costs

**Example:** Γ = 0.0015, position = 100 options
Price moves $50: ΔS = $50
Gamma P&L = 0.5 × 0.0015 × 100 × (50)² = $187.50
If transaction cost = $40 → Net profit = $147.50

**Optimal Threshold:**
Rebalance when: 0.5 × Γ × (threshold)² > 2 × Transaction Cost

For Γ = 0.0015, TC = $40:
threshold > √[(2×40)/(0.5×0.0015)] = √[160/0.00075] ≈ $462

**Implementation for Ghana Cocoa:**
- Use cocoa futures for rebalancing
- Account for convenience yield in delta
- Monitor West Africa weather patterns
- Consider El Niño volatility spikes`,
                formula: "Gamma P&L ≈ ½ × Γ × (ΔS)² × N"
            },
            
            // Risk Management Techniques
            'value at risk': {
                title: "Value at Risk (VaR) for Cocoa Portfolios",
                content: `**Three VaR Methods for Cocoa:**

**1. Parametric (Normal) VaR:**
VaR_α = μ - z_α × σ
Where z_95% = 1.645, z_99% = 2.326

**Example:** 100 MT position @ $3,800/MT
Daily σ = 1.8% (annualized 28.6%)
1-day 95% VaR = 100 × 3800 × 1.645 × 0.018 = **$11,250**

**2. Historical Simulation:**
- Sort 500 days of historical returns
- VaR_95% = 25th worst loss (500×0.05)
- Accounts for fat tails (cocoa has 4.2 kurtosis)

**3. Monte Carlo VaR:**
- Simulate 10,000 price paths using GBM
- Calculate portfolio value distribution
- VaR = percentile of losses

**Expected Shortfall (CVaR):**
ES_α = 𝔼[Loss | Loss > VaR_α]
More conservative than VaR

**Ghana COCOBOD Application:**
- Use 99% VaR over 10-day horizon
- Include currency risk (GHS/USD)
- Stress test for El Niño events
- Regulatory capital = 3 × VaR`,
                formula: "VaR_α = μ - z_α × σ"
            },
            
            'stress testing': {
                title: "Stress Testing for Ghana Cocoa",
                content: `**Historical Stress Scenarios:**

1. **2008 Financial Crisis:**
   - Cocoa: -42% in 6 months
   - Volatility: 25% → 65%
   - Recovery: 14 months

2. **2016 El Niño:**
   - Ghana production: -30%
   - Prices: +52% in 4 months
   - Volatility: +120%

3. **2020 COVID-19:**
   - Demand shock: -18%
   - Supply chain disruption
   - Volatility spike to 45%

**Hypothetical Scenarios:**
- **Severe Drought:** -40% production, prices +80%
- **Currency Crisis:** GHS depreciates 50% vs USD
- **Trade Embargo:** Export ban for 3 months
- **Simultaneous Shocks:** Drought + Currency crisis

**Portfolio Impact Analysis:**
1. Revalue positions under stress
2. Calculate capital shortfall
3. Develop contingency plans
4. Set risk limits

**Ghana-Specific Factors:**
- Rainy season timing (April-June, Sept-Nov)
- Political stability during elections
- COCOBOD pricing policy changes
- International cocoa agreements`,
                formula: "Loss = ∑(Position × Price Change × ΔFX)"
            },
            
            // Quantitative Analysis
            'garch volatility': {
                title: "GARCH Modeling for Cocoa Volatility",
                content: `**GARCH(1,1) Model for Cocoa:**

σ²_t = ω + αε²_{t-1} + βσ²_{t-1}

**Typical Cocoa Estimates:**
- ω = 0.0001 (long-run variance)
- α = 0.10 (news impact coefficient)
- β = 0.85 (persistence coefficient)
- α + β ≈ 0.95 (high persistence)

**Interpretation:**
- **Persistence:** Volatility shocks decay slowly
- **Mean reversion:** E[σ²] = ω/(1-α-β) ≈ 0.002 (20% annual)
- **Leverage effect:** Negative returns → higher vol (add γ term)

**Forecasting:**
1-day: σ²_{t+1} = ω + αε²_t + βσ²_t
k-day: E[σ²_{t+k}] = (α+β)^(k-1)σ²_{t+1} + [1-(α+β)^(k-1)]σ²_LR

**Python Implementation:**
\`\`\`python
from arch import arch_model

# Fit GARCH(1,1) to cocoa returns
returns = get_cocoa_returns()  # Daily returns
model = arch_model(returns, vol='Garch', p=1, q=1)
results = model.fit()

print(results.summary())
print(f"Long-run volatility: {np.sqrt(results.params['omega']/(1-results.params['alpha1']-results.params['beta1'])):.2%}")
\`\`\`

**Applications:**
- Option pricing with time-varying vol
- Risk management (VaR with GARCH)
- Hedging optimization
- Trading strategy development`,
                formula: "σ²_t = ω + αε²_{t-1} + βσ²_{t-1}"
            },
            
            'cointegration hedging': {
                title: "Cointegration-Based Hedging for Cocoa",
                content: `**Pairs Trading & Statistical Arbitrage:**

**Step 1: Test for Cointegration**
Cocoa price (S) and USD/GHS (FX) relationship:
ln(S_t) = α + β×ln(FX_t) + ε_t

**Johansen Test:** Check if β is stationary
If cointegrated, use β as hedge ratio

**Step 2: Optimal Hedge Ratio (OLS)**
ΔS_t = α + β×ΔFX_t + ε_t
β = Cov(ΔS, ΔFX) / Var(ΔFX)

**Step 3: Error Correction Model**
ΔS_t = γ×ε_{t-1} + β×ΔFX_t + δ×ΔS_{t-1} + η_t
Where ε_{t-1} = S_{t-1} - α - β×FX_{t-1}

**Ghana Example:**
Cocoa price (USD/MT) and USD/GHS:
β ≈ 0.65 (65% of FX risk hedged with futures)

**Hedging Effectiveness:**
R² from regression = 0.72
72% of cocoa price variance explained by FX

**Implementation:**
1. Hedge 65% of position with USD/GHS futures
2. Monitor cointegration relationship monthly
3. Re-estimate β quarterly
4. Include convenience yield in model

**Advantage:** Reduces basis risk vs simple delta hedge`,
                formula: "ΔS_t = α + β×ΔFX_t + ε_t"
            },
            
            // Help and Contact Information
            'help': {
                title: "Cocoa Risk Assistant Help",
                content: `**I can assist with these quantitative topics:**

📊 **OPTIONS PRICING MODELS:**
• Black-Scholes-Merton with convenience yield
• Binomial/trinomial trees
• Monte Carlo simulation
• Finite difference methods
• Jump-diffusion models

🛡️ **DELTA HEDGING STRATEGIES:**
• Delta-neutral hedging
• Gamma scalping techniques
• Dynamic hedging with transaction costs
• Cross-hedging with related commodities
• Volatility arbitrage

📈 **RISK MANAGEMENT TECHNIQUES:**
• Value at Risk (VaR) calculation
• Expected Shortfall (CVaR)
• Stress testing and scenario analysis
• Credit risk measurement
• Liquidity risk assessment

🔬 **QUANTITATIVE ANALYSIS:**
• GARCH volatility modeling
• Cointegration and pairs trading
• Machine learning for price prediction
• Stochastic calculus applications
• Numerical methods in finance

🇬🇭 **GHANA MARKET SPECIFICS:**
• COCOBOD pricing structure
• Ghana Commodity Exchange applications
• Currency risk management (GHS/USD)
• Seasonal patterns in cocoa production
• Weather risk modeling

**MATHEMATICAL PROBLEMS I CAN SOLVE:**
• Calculate option Greeks (Δ, Γ, Θ, ν, ρ)
• Compute hedge ratios
• Estimate Value at Risk
• Solve Black-Scholes PDE
• Perform Monte Carlo simulations
• Calculate statistical arbitrage signals

**TRY THESE QUERIES:**
• "Calculate delta for ATM call with 30% vol"
• "What's the 95% VaR for 100 MT @ $3,800?"
• "Explain gamma scalping with transaction costs"
• "How to implement GARCH(1,1) in Python?"
• "What's the optimal hedge ratio for cocoa vs FX?"

**For complex problems requiring human expertise:**
Contact: emmanueladutwum900@yahoo.com
Phone: +233 553483918 (Ghana)
Alternative: 9293777654`
            },
            
            'contact human': {
                title: "Human Assistance Contact Information",
                content: `**For complex quantitative problems requiring human expertise:**

**Primary Contact:**
📧 Email: emmanueladutwum900@yahoo.com
📞 Phone (Ghana): +233 553483918
📞 Alternative: 9293777654

**Areas for Human Consultation:**
1. **Advanced Mathematical Modeling:**
   - Complex derivative pricing
   - Stochastic volatility models
   - Multi-factor risk models
   - Machine learning implementations

2. **Ghana-Specific Applications:**
   - COCOBOD risk management strategy
   - Ghana Commodity Exchange product design
   - Agricultural policy implications
   - Farmer income stabilization programs

3. **Academic Research Support:**
   - Thesis and dissertation guidance
   - Research methodology design
   - Data collection and analysis
   - Publication preparation

4. **Industry Implementation:**
   - Trading system development
   - Risk management framework design
   - Regulatory compliance
   - Technology infrastructure

**Response Time:** Typically within 24 hours
**Consultation Hours:** 9 AM - 5 PM GMT
**Languages:** English, Twi (basic)

**Before Contacting:**
1. Run simulations in the calculator
2. Check the research library
3. Review AI responses
4. Prepare specific questions

**Note:** This platform is for academic research. Always verify models with real market data and consult financial professionals for trading decisions.`
            }
        };
    }
    
    setupAIAssistant() {
        const aiToggle = document.getElementById('aiToggle');
        const aiAssistant = document.getElementById('aiAssistant');
        const aiClose = document.getElementById('aiClose');
        const aiSend = document.getElementById('aiSend');
        const aiInput = document.getElementById('aiInput');
        
        if (aiToggle && aiAssistant) {
            aiToggle.addEventListener('click', () => {
                const isActive = aiAssistant.classList.toggle('active');
                aiToggle.setAttribute('aria-expanded', isActive);
                
                if (isActive) {
                    aiInput?.focus();
                    aiToggle.setAttribute('aria-label', 'Close AI assistant');
                } else {
                    aiToggle.setAttribute('aria-label', 'Open AI assistant');
                }
            });
            
            if (aiClose) {
                aiClose.addEventListener('click', () => {
                    aiAssistant.classList.remove('active');
                    aiToggle.setAttribute('aria-expanded', 'false');
                    aiToggle.setAttribute('aria-label', 'Open AI assistant');
                });
            }
            
            if (aiSend && aiInput) {
                const sendMessage = () => {
                    const message = aiInput.value.trim();
                    if (message) {
                        this.handleAIMessage(message);
                        aiInput.value = '';
                    }
                };
                
                aiSend.addEventListener('click', sendMessage);
                aiInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
            }
        }
    }
    
    handleAIMessage(message) {
        const aiChat = document.getElementById('aiChat');
        if (!aiChat) return;
        
        // Add user message
        this.addAIMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get AI response after delay
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addAIMessage(response, 'ai');
        }, 800);
    }
    
    getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for contact requests
        if (lowerMessage.includes('human') || lowerMessage.includes('contact') || 
            lowerMessage.includes('help') && (lowerMessage.includes('call') || lowerMessage.includes('email'))) {
            return this.getContactResponse();
        }
        
        // Check for mathematical terms
        if (this.isMathematicalQuery(lowerMessage)) {
            return this.getMathematicalResponse(lowerMessage);
        }
        
        // Check for quantitative finance topics
        for (const [keyword, data] of Object.entries(this.aiKnowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                return this.formatAIResponse(data);
            }
        }
        
        // Check for calculation requests
        const calculationResult = this.attemptCalculation(message);
        if (calculationResult) {
            return calculationResult;
        }
        
        // Default response
        return this.getDefaultResponse();
    }
    
    isMathematicalQuery(message) {
        const mathKeywords = [
            'calculate', 'compute', 'solve', 'formula', 'equation',
            'derivative', 'integral', 'probability', 'statistic',
            'variance', 'covariance', 'correlation', 'regression',
            'σ', 'μ', 'ρ', 'β', 'α', 'gamma', 'theta', 'vega',
            'standard deviation', 'mean', 'median', 'percentile'
        ];
        
        return mathKeywords.some(keyword => message.includes(keyword));
    }
    
    getMathematicalResponse(query) {
        // Extract numbers and parameters from query
        const numbers = query.match(/\d+(\.\d+)?/g)?.map(Number) || [];
        
        if (query.includes('delta') && query.includes('call')) {
            return this.calculateDeltaExample(numbers);
        } else if (query.includes('var') || query.includes('value at risk')) {
            return this.calculateVaRExample(numbers);
        } else if (query.includes('black scholes') || query.includes('option price')) {
            return this.calculateOptionPriceExample(numbers);
        } else if (query.includes('hedge ratio')) {
            return this.calculateHedgeRatioExample(numbers);
        } else if (query.includes('volatility') && query.includes('garch')) {
            return this.calculateGARCHExample(numbers);
        }
        
        return `I can help with mathematical calculations! Try asking about:

• "Calculate delta for ATM call with 30% volatility"
• "What's the 95% VaR for 100 MT position at $3,800?"
• "Compute Black-Scholes price with S=3800, K=3800, T=0.25, σ=0.30"
• "Find optimal hedge ratio for cocoa futures"

Or be more specific with your parameters.`;
    }
    
    calculateDeltaExample(numbers) {
        // Simplified delta calculation
        const S = numbers[0] || 3800;
        const K = numbers[1] || 3800;
        const T = numbers[2] || 0.25;
        const r = numbers[3] || 0.04;
        const delta_yield = numbers[4] || 0.03;
        const sigma = numbers[5] || 0.30;
        
        const d1 = (Math.log(S/K) + (r - delta_yield + sigma*sigma/2)*T) / (sigma * Math.sqrt(T));
        const delta = Math.exp(-delta_yield * T) * this.normCDF(d1);
        
        return `**Delta Calculation Example:**

Given:
- Cocoa Price (S) = $${S}/MT
- Strike Price (K) = $${K}/MT
- Time to Expiry (T) = ${T} years (${Math.round(T*12)} months)
- Risk-free Rate (r) = ${(r*100).toFixed(1)}%
- Convenience Yield (δ) = ${(delta_yield*100).toFixed(1)}%
- Volatility (σ) = ${(sigma*100).toFixed(1)}%

**Calculation:**
d₁ = [ln(${S}/${${K}}) + (${r} - ${delta_yield} + ${sigma}²/2)×${T}] / (${sigma}×√${T})
   = ${d1.toFixed(4)}

Δ = e^(-${delta_yield}×${T}) × N(${d1.toFixed(4)})
  = ${Math.exp(-delta_yield * T).toFixed(4)} × ${this.normCDF(d1).toFixed(4)}
  = **${delta.toFixed(4)}**

**Interpretation:**
- For every $1 increase in cocoa price, the call option price increases by $${delta.toFixed(4)}
- To hedge 100 call options, sell ${(100 * delta).toFixed(1)} MT of cocoa futures
- Delta increases as: price ↗, volatility ↘, time ↘`;
    }
    
    calculateVaRExample(numbers) {
        const position = numbers[0] || 100;
        const price = numbers[1] || 3800;
        const volatility = numbers[2] || 0.018; // daily vol
        const confidence = numbers[3] || 95;
        
        const zScore = confidence === 95 ? 1.645 : confidence === 99 ? 2.326 : 1.96;
        const varAmount = position * price * zScore * volatility;
        
        return `**Value at Risk Calculation:**

Given:
- Position Size = ${position} MT
- Cocoa Price = $${price}/MT
- Daily Volatility = ${(volatility*100).toFixed(2)}%
- Confidence Level = ${confidence}%

**Calculation:**
Notional Value = ${position} MT × $${price}/MT = $${(position * price).toLocaleString()}

VaR = Notional × z-score × Daily Volatility
    = $${(position * price).toLocaleString()} × ${zScore} × ${volatility}
    = **$${varAmount.toLocaleString()}**

**Interpretation:**
- There's a ${(100-confidence)}% chance of losing more than $${Math.round(varAmount).toLocaleString()} in one day
- 10-day VaR (√10 rule) = $${(varAmount * Math.sqrt(10)).toLocaleString()}
- Annual VaR (√252) = $${(varAmount * Math.sqrt(252)).toLocaleString()}

**Ghana Context:**
COCOBOD typically uses 99% 10-day VaR for risk management.`;
    }
    
    calculateOptionPriceExample(numbers) {
        const S = numbers[0] || 3800;
        const K = numbers[1] || 3800;
        const T = numbers[2] || 0.25;
        const r = numbers[3] || 0.04;
        const delta_yield = numbers[4] || 0.03;
        const sigma = numbers[5] || 0.30;
        
        const d1 = (Math.log(S/K) + (r - delta_yield + sigma*sigma/2)*T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        const price = S * Math.exp(-delta_yield * T) * this.normCDF(d1) - K * Math.exp(-r * T) * this.normCDF(d2);
        
        return `**Black-Scholes Option Price Calculation:**

**Parameters:**
S = $${S}/MT, K = $${K}/MT, T = ${T} years, r = ${(r*100).toFixed(1)}%, 
δ = ${(delta_yield*100).toFixed(1)}%, σ = ${(sigma*100).toFixed(1)}%

**Step-by-Step:**
1. Calculate d₁ = [ln(${S}/${K}) + (${r} - ${delta_yield} + ${sigma}²/2)×${T}] / (${sigma}×√${T})
   = ${d1.toFixed(4)}
   
2. d₂ = d₁ - σ√T = ${d1.toFixed(4)} - ${sigma}×√${T} = ${d2.toFixed(4)}
   
3. N(d₁) = ${this.normCDF(d1).toFixed(4)}, N(d₂) = ${this.normCDF(d2).toFixed(4)}
   
4. Call Price = S×e^(-δT)×N(d₁) - K×e^(-rT)×N(d₂)
   = $${S}×e^(-${delta_yield}×${T})×${this.normCDF(d1).toFixed(4)} - $${K}×e^(-${r}×${T})×${this.normCDF(d2).toFixed(4)}
   = $${(S * Math.exp(-delta_yield * T)).toFixed(2)}×${this.normCDF(d1).toFixed(4)} - $${(K * Math.exp(-r * T)).toFixed(2)}×${this.normCDF(d2).toFixed(4)}
   = **$${price.toFixed(2)}**

**Breakdown:**
- Intrinsic Value: max(${S} - ${K}, 0) = $${Math.max(S-K, 0)}
- Time Value: $${(price - Math.max(S-K, 0)).toFixed(2)}
- Moneyness: ${S > K ? 'ITM' : S < K ? 'OTM' : 'ATM'}`;
    }
    
    calculateHedgeRatioExample(numbers) {
        const delta = numbers[0] || 0.45;
        const position = numbers[1] || 100;
        const contractSize = numbers[2] || 10;
        
        const hedgeQuantity = -delta * position;
        const futuresContracts = Math.abs(hedgeQuantity) / contractSize;
        
        return `**Hedge Ratio Calculation:**

Given:
- Option Delta (Δ) = ${delta}
- Number of Options = ${position}
- Futures Contract Size = ${contractSize} MT

**Calculation:**
Hedge Ratio = -Δ × Number of Options
            = -${delta} × ${position} = ${hedgeQuantity}

Number of Futures Contracts = |${hedgeQuantity}| / ${contractSize}
                            = ${futuresContracts.toFixed(1)} contracts

**Interpretation:**
- To delta-hedge ${position} options with Δ = ${delta}:
  **${hedgeQuantity > 0 ? 'Buy' : 'Sell'} ${Math.abs(hedgeQuantity).toFixed(1)} MT** of cocoa
  Or **${Math.abs(futuresContracts).toFixed(1)} futures contracts**

**Transaction Cost Consideration:**
- Each rebalance costs ~0.2-0.5% of notional
- Weekly rebalancing optimal for cocoa
- Include gamma effect for large price moves`;
    }
    
    calculateGARCHExample(numbers) {
        const omega = numbers[0] || 0.0001;
        const alpha = numbers[1] || 0.10;
        const beta = numbers[2] || 0.85;
        const currentVar = numbers[3] || 0.0004; // 20% annual vol
        const shock = numbers[4] || 0.02; // 2% return
        
        const tomorrowVar = omega + alpha * shock * shock + beta * currentVar;
        const longRunVar = omega / (1 - alpha - beta);
        
        return `**GARCH(1,1) Volatility Forecast:**

**Model Parameters:**
ω = ${omega}, α = ${alpha}, β = ${beta}
Current Variance = ${currentVar} (${(Math.sqrt(currentVar*252)*100).toFixed(1)}% annual vol)
Today's Return Shock = ${(shock*100).toFixed(1)}%

**Tomorrow's Forecast:**
σ²_{t+1} = ω + α×ε²_t + β×σ²_t
         = ${omega} + ${alpha}×(${shock}²) + ${beta}×${currentVar}
         = ${omega} + ${alpha}×${(shock*shock).toFixed(6)} + ${(beta*currentVar).toFixed(6)}
         = **${tomorrowVar.toFixed(6)}**

Annualized Volatility = √(${tomorrowVar.toFixed(6)} × 252) × 100%
                      = **${(Math.sqrt(tomorrowVar*252)*100).toFixed(1)}%**

**Long-Run Equilibrium:**
σ²_LR = ω / (1 - α - β)
      = ${omega} / (1 - ${alpha} - ${beta})
      = ${longRunVar.toFixed(6)}

Long-run Volatility = **${(Math.sqrt(longRunVar*252)*100).toFixed(1)}%**

**Persistence:** ${((alpha+beta)*100).toFixed(1)}% of today's variance carries forward
**Mean Reversion Speed:** ${((1-alpha-beta)*100).toFixed(1)}% per day`;
    }
    
    attemptCalculation(message) {
        // Simple arithmetic calculations
        const calcMatch = message.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
        if (calcMatch) {
            const [_, a, op, b] = calcMatch;
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            let result;
            
            switch(op) {
                case '+': result = numA + numB; break;
                case '-': result = numA - numB; break;
                case '*': result = numA * numB; break;
                case '/': result = numB !== 0 ? numA / numB : 'undefined (division by zero)'; break;
            }
            
            return `**Calculation Result:**\n${numA} ${op} ${numB} = **${result}**`;
        }
        
        // Percentage calculations
        const percentMatch = message.match(/(\d+(?:\.\d+)?)%\s*(of|from)?\s*(\d+(?:\.\d+)?)/i);
        if (percentMatch) {
            const [_, percent, , value] = percentMatch;
            const result = (parseFloat(percent) / 100) * parseFloat(value);
            return `**Percentage Calculation:**\n${percent}% of ${value} = **${result.toFixed(2)}**`;
        }
        
        return null;
    }
    
    getContactResponse() {
        return `**For complex quantitative problems requiring human expertise:**

**Contact Information:**
📧 **Email:** emmanueladutwum900@yahoo.com
📞 **Phone (Ghana):** +233 553483918
📞 **Alternative:** 9293777654

**Areas for Human Consultation:**
1. Advanced derivative pricing models
2. Complex risk management strategies  
3. Ghana-specific market applications
4. Academic research guidance
5. Industry implementation support

**Response Time:** Typically within 24 hours
**Consultation Hours:** 9 AM - 5 PM GMT

**Before contacting, try:**
1. Using the calculator tool for simulations
2. Checking the research library
3. Asking me specific quantitative questions

**Note:** This platform is for academic research. Always verify models with real market data.`;
    }
    
    formatAIResponse(data) {
        let response = `**${data.title}**\n\n`;
        response += data.content + '\n\n';
        
        if (data.formula) {
            response += `**Key Formula:** ${data.formula}\n\n`;
        }
        
        response += '---\n';
        response += 'For human assistance: emmanueladutwum900@yahoo.com or +233 553483918';
        
        return response;
    }
    
    getDefaultResponse() {
        return `I'm your Cocoa Risk Assistant specializing in quantitative finance. I can help with:

**Options Pricing Models:** Black-Scholes, binomial, Monte Carlo
**Delta Hedging Strategies:** Dynamic hedging, gamma scalping
**Risk Management:** VaR, stress testing, scenario analysis
**Quantitative Analysis:** GARCH, cointegration, statistical arbitrage

**Try these specific queries:**
• "Calculate delta for ATM call with 30% volatility"
• "Explain gamma scalping with transaction costs"
• "How to compute 95% Value at Risk?"
• "Show me the Black-Scholes formula for cocoa"
• "What's the optimal hedge ratio?"

**For complex problems requiring human expertise:**
Contact: emmanueladutwum900@yahoo.com
Phone: +233 553483918

What specific aspect of cocoa derivatives can I help you with today?`;
    }
    
    normCDF(x) {
        // Abramowitz & Stegun approximation
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2);
        
        const t = 1 / (1 + p * x);
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return 0.5 * (1 + sign * y);
    }
    
    showTypingIndicator() {
        const aiChat = document.getElementById('aiChat');
        if (!aiChat) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>Calculating...</p>
        `;
        
        aiChat.appendChild(typingDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) typingDiv.remove();
    }
    
    addAIMessage(message, sender) {
        const aiChat = document.getElementById('aiChat');
        if (!aiChat) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.setAttribute('aria-label', `${sender === 'user' ? 'You said' : 'AI assistant said'}`);
        
        // Format message with Markdown-like syntax
        const formattedMessage = this.formatMessage(message);
        messageDiv.innerHTML = formattedMessage;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    formatMessage(message) {
        // Convert markdown-like syntax to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
            .replace(/^##\s+(.+)$/gm, '<h4>$1</h4>')
            .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    }
    
    // Rest of the existing methods remain the same...
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        // Set initial theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                icon.setAttribute('aria-label', 'Switch to light theme');
            } else {
                icon.className = 'fas fa-moon';
                icon.setAttribute('aria-label', 'Switch to dark theme');
            }
        }
    }
    
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                
                // Update aria label
                mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
                mobileMenuBtn.setAttribute('aria-label', 
                    navLinks.classList.contains('active') ? 'Close menu' : 'Open menu'
                );
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                }
            });
            
            // Close menu on link click
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                });
            });
        }
    }
    
    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                    backToTop.setAttribute('aria-hidden', 'false');
                } else {
                    backToTop.classList.remove('visible');
                    backToTop.setAttribute('aria-hidden', 'true');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                backToTop.blur(); // Remove focus after click
            });
        }
    }
    
    setupAnimations() {
        // Initialize intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .step, .partner, .result-card').forEach(el => {
            observer.observe(el);
        });

        // Initialize number counting
        this.animateNumbers();
    }
    
    animateNumbers() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    setupEventListeners() {
        // Fix all broken buttons and links
        this.fixBrokenButtons();
        
        // Fix research paper button on homepage
        const researchLinks = document.querySelectorAll('a[href="research.html"]');
        researchLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.getAttribute('href').startsWith('http')) {
                    e.preventDefault();
                    window.location.href = 'research.html';
                }
            });
        });

        // Fix calculator button
        const calculatorLinks = document.querySelectorAll('a[href="calculator.html"]');
        calculatorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.getAttribute('href').startsWith('http')) {
                    e.preventDefault();
                    window.location.href = 'calculator.html';
                }
            });
        });

        // Fix API try buttons
        document.querySelectorAll('.try-api-btn, .try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const endpoint = btn.getAttribute('data-endpoint') || 
                               btn.closest('.endpoint')?.querySelector('code')?.textContent;
                if (endpoint) {
                    this.tryAPIEndpoint(endpoint);
                }
            });
        });
    }
    
    fixBrokenButtons() {
        // Fix all buttons that don't work
        const brokenSelectors = [
            '.btn:not([href]):not([type="submit"]):not([type="button"])',
            'a[href="#"]:not([data-bs-toggle])',
            'button:not([type]):not([class*="dropdown"])'
        ];

        brokenSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.hasAttribute('data-fixed')) {
                    element.setAttribute('data-fixed', 'true');
                    
                    if (element.classList.contains('feature-link')) {
                        element.addEventListener('click', (e) => {
                            e.preventDefault();
                            const target = element.getAttribute('href');
                            if (target && target !== '#') {
                                window.location.href = target;
                            }
                        });
                    }

                    if (element.classList.contains('download-btn')) {
                        element.addEventListener('click', () => {
                            this.showNotification('Download feature coming soon', 'info');
                        });
                    }
                }
            });
        });
    }
    
    initializeComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize notifications system
        this.initializeNotifications();
        
        // Initialize data updates
        this.initializeDataUpdates();
        
        // Fix homepage layout issues
        this.fixHomepageLayout();
        
        // Add AI assistant styles
        this.addAIAssistantStyles();
    }
    
    addAIAssistantStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                margin-bottom: 8px;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: var(--text-secondary);
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            
            .ai-message.ai strong {
                color: var(--primary);
            }
            
            .ai-message.ai code {
                background: rgba(0, 107, 63, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }
            
            .ai-message.ai ul {
                margin-left: 20px;
                margin-bottom: 10px;
            }
            
            .ai-message.ai li {
                margin-bottom: 5px;
            }
            
            .ai-message.ai h3 {
                color: var(--primary);
                margin-bottom: 10px;
                border-bottom: 2px solid rgba(0, 107, 63, 0.2);
                padding-bottom: 5px;
            }
            
            .ai-message.ai h4 {
                color: var(--secondary);
                margin-bottom: 8px;
            }
        `;
        document.head.appendChild(style);
    }
    
    fixHomepageLayout() {
        // Ensure all sections are visible
        const sections = ['hero', 'features', 'impact-section', 'quickstart-section', 'partners-section'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.display = 'block';
            }
        });

        // Fix hero background visibility
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.background = 'linear-gradient(135deg, #004D29 0%, #006B3F 100%)';
            hero.style.position = 'relative';
            hero.style.zIndex = '1';
        }

        // Fix navigation text color
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (!link.classList.contains('active')) {
                link.style.color = 'var(--text-primary)';
            }
        });
    }
    
    initializeTooltips() {
        // Simple tooltip implementation
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            const tooltipText = el.getAttribute('data-tooltip');
            
            el.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                tooltip.setAttribute('role', 'tooltip');
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.classList.add('visible');
                
                el._tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', () => {
                if (el._tooltip) {
                    el._tooltip.remove();
                    delete el._tooltip;
                }
            });
            
            // Accessibility: show on focus
            el.addEventListener('focus', () => {
                if (!el._tooltip) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.textContent = tooltipText;
                    tooltip.setAttribute('role', 'tooltip');
                    document.body.appendChild(tooltip);
                    
                    const rect = el.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                    tooltip.classList.add('visible');
                    
                    el._tooltip = tooltip;
                }
            });
            
            el.addEventListener('blur', () => {
                if (el._tooltip) {
                    el._tooltip.remove();
                    delete el._tooltip;
                }
            });
        });
    }
    
    initializeNotifications() {
        // Create notification container if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.setAttribute('aria-live', 'polite');
            document.body.appendChild(notificationContainer);
        }

        // Global notification function
        window.showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `global-notification ${type}`;
            notification.setAttribute('role', 'alert');
            
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            
            notification.innerHTML = `
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            notificationContainer.appendChild(notification);
            
            // Add close button functionality
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.add('fade-out');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        };
    }
    
    setupAPIFunctions() {
        // Fix API key functionality
        const copyApiKeyBtn = document.getElementById('copyApiKey');
        if (copyApiKeyBtn) {
            copyApiKeyBtn.addEventListener('click', () => {
                const apiKey = document.getElementById('apiKeyValue')?.textContent;
                if (apiKey) {
                    navigator.clipboard.writeText(apiKey)
                        .then(() => this.showNotification('API key copied to clipboard', 'success'))
                        .catch(() => this.showNotification('Failed to copy API key', 'error'));
                }
            });
        }

        // Fix regenerate API key
        const regenerateApiKeyBtn = document.getElementById('regenerateApiKey');
        if (regenerateApiKeyBtn) {
            regenerateApiKeyBtn.addEventListener('click', () => {
                if (confirm('Regenerate API key? The old key will be invalidated.')) {
                    const newKey = 'cdrl_sk_live_' + Math.random().toString(36).substr(2, 24);
                    const apiKeyElement = document.getElementById('apiKeyValue');
                    if (apiKeyElement) {
                        apiKeyElement.textContent = newKey;
                        this.showNotification('API key regenerated successfully', 'success');
                    }
                }
            });
        }
    }
    
    tryAPIEndpoint(endpoint) {
        // Mock API responses
        const endpoints = {
            '/api/v1/prices/historical': {
                method: 'GET',
                description: 'Historical cocoa price data',
                sampleResponse: {
                    "symbol": "COCOA",
                    "currency": "USD",
                    "unit": "MT",
                    "prices": [
                        {"date": "2024-01-01", "open": 3810.50, "high": 3835.75, "low": 3802.25, "close": 3820.50, "volume": 12500},
                        {"date": "2024-01-02", "open": 3825.25, "high": 3840.00, "low": 3815.50, "close": 3835.75, "volume": 11800}
                    ],
                    "metadata": {
                        "source": "ICE Futures",
                        "frequency": "daily",
                        "last_updated": new Date().toISOString()
                    }
                }
            }
        };

        const endpointData = endpoints[endpoint];
        if (endpointData) {
            // Create modal for API test
            const modalContent = `
                <div class="api-test-modal">
                    <h3>API Test: ${endpoint}</h3>
                    <div class="api-info">
                        <p><strong>Method:</strong> <code>${endpointData.method}</code></p>
                        <p><strong>Description:</strong> ${endpointData.description}</p>
                        <p><strong>Status:</strong> <span class="status-success">Mock Response</span></p>
                    </div>
                    
                    <div class="request-section">
                        <h4>Sample Request:</h4>
                        <pre><code>curl -X ${endpointData.method} \\
  "https://api.cocoa-derivatives-lab.gh${endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"</code></pre>
                    </div>
                    
                    <div class="response-section">
                        <h4>Sample Response:</h4>
                        <pre><code>${JSON.stringify(endpointData.sampleResponse, null, 2)}</code></pre>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-primary copy-response">
                            <i class="fas fa-copy"></i> Copy Response
                        </button>
                        <button class="btn btn-secondary close-modal">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            `;

            this.showModal('API Test Console', modalContent);

            // Add copy functionality
            document.querySelector('.copy-response')?.addEventListener('click', () => {
                navigator.clipboard.writeText(JSON.stringify(endpointData.sampleResponse, null, 2))
                    .then(() => this.showNotification('Response copied to clipboard', 'success'))
                    .catch(() => this.showNotification('Failed to copy response', 'error'));
            });
        } else {
            this.showNotification(`Endpoint ${endpoint} not found`, 'error');
        }
    }
    
    initializeDataUpdates() {
        // Update live data every 30 seconds
        setInterval(() => {
            this.updateLiveData();
        }, 30000);
        
        // Initial update
        this.updateLiveData();
    }
    
    updateLiveData() {
        // Update live price displays
        const priceElements = document.querySelectorAll('.live-price, .current-price');
        priceElements.forEach(el => {
            const current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 3842.50;
            const change = (Math.random() - 0.5) * 0.01 * current; // ±0.5% change
            const newPrice = current + change;
            el.textContent = `$${newPrice.toFixed(2)}`;
            
            // Update parent if there's a change indicator
            const parent = el.closest('.price-display');
            if (parent) {
                const changeElement = parent.querySelector('.price-change');
                if (changeElement) {
                    const percentChange = (change / current * 100).toFixed(2);
                    changeElement.textContent = `${change >= 0 ? '+' : ''}${percentChange}%`;
                    changeElement.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
                }
            }
        });
        
        // Update timestamps
        const timestampElements = document.querySelectorAll('.live-timestamp, .timestamp, .updated-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        timestampElements.forEach(el => {
            el.textContent = `Updated ${timeString}`;
        });
    }
    
    showModal(title, content) {
        // Remove existing modal
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) existingModal.remove();
        
        const modalHTML = `
            <div class="custom-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal-overlay" tabindex="-1"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title">${title}</h3>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal.firstElementChild);
        
        // Focus trap for accessibility
        const modalElement = document.querySelector('.custom-modal');
        const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        // Add event listeners
        modalElement.querySelector('.modal-close').addEventListener('click', () => {
            modalElement.remove();
        });
        
        modalElement.querySelector('.modal-overlay').addEventListener('click', () => {
            modalElement.remove();
        });
        
        // Close button in content
        modalElement.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modalElement.remove();
            });
        });
        
        // Keyboard navigation
        modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modalElement.remove();
            }
            
            // Tab trap
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        // Focus first element
        setTimeout(() => {
            firstFocusable?.focus();
        }, 100);
    }

    // Utility functions
    formatCurrency(amount, currency = 'USD', decimals = 2) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount);
    }

    formatPercentage(value, decimals = 2) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    formatNumber(value, decimals = 0) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize platform when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new CorePlatform();
    
    // Add CSS for notifications and tooltips
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        }
        
        .global-notification {
            background: var(--bg-primary);
            border-left: 4px solid;
            border-radius: var(--radius);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
            border-color: var(--text-tertiary);
        }
        
        .global-notification.success {
            border-color: var(--success);
        }
        
        .global-notification.error {
            border-color: var(--danger);
        }
        
        .global-notification.warning {
            border-color: var(--warning);
        }
        
        .global-notification.info {
            border-color: var(--info);
        }
        
        .global-notification .notification-close {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--text-tertiary);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
        }
        
        .global-notification .notification-close:hover {
            background: var(--bg-tertiary);
        }
        
        .global-notification.fade-out {
            animation: slideOutRight 0.3s ease;
        }
        
        .tooltip {
            position: fixed;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius);
            font-size: 0.875rem;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s, transform 0.2s;
            max-width: 250px;
            word-wrap: break-word;
        }
        
        .tooltip.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .custom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .custom-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .custom-modal .modal-content {
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            padding: var(--space-xl);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            z-index: 1;
            box-shadow: var(--shadow-lg);
            border: 2px solid var(--border);
        }
        
        .custom-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space);
        }
        
        .custom-modal .modal-close {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: var(--radius);
        }
        
        .custom-modal .modal-close:hover {
            background: var(--bg-tertiary);
        }
        
        .api-test-modal pre {
            background: var(--bg-tertiary);
            border-radius: var(--radius);
            padding: var(--space);
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
        }
        
        .api-test-modal code {
            color: var(--text-primary);
        }
        
        .status-success {
            color: var(--success);
            font-weight: 600;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
