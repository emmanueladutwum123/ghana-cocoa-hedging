// research-library.js - Enhanced with AI Analysis
// Ghana Cocoa Derivatives Research Library v2.0

class ResearchLibrary {
    constructor() {
        this.papers = this.getResearchPapers();
        this.categories = this.getCategories();
        this.init();
    }
    
    init() {
        this.renderPapers();
        this.setupFilters();
        this.setupSearch();
        this.setupAIHelper();
    }
    
    getResearchPapers() {
        return [
            {
                id: 1,
                title: "Black-Scholes-Merton Model Application to Ghana Cocoa Options",
                authors: ["Emmanuel Adutwum", "COCOBOD Research"],
                year: 2024,
                category: "options-pricing",
                abstract: "This paper extends the Black-Scholes-Merton model to incorporate convenience yield for cocoa commodities...",
                keywords: ["Black-Scholes", "Convenience Yield", "Cocoa Options", "Ghana"],
                pdfUrl: "#",
                citations: 42,
                aiSummary: "Presents a modified BSM model with 2-4% convenience yield for cocoa. Key finding: Ghana options undervalued by 15-20% compared to theoretical.",
                difficulty: "Advanced",
                mathLevel: "High"
            },
            {
                id: 2,
                title: "Delta Hedging Strategies for COCOBOD Risk Management",
                authors: ["Ghana Commodity Exchange", "Risk Management Dept"],
                year: 2023,
                category: "delta-hedging",
                abstract: "Analysis of optimal hedging frequencies and transaction costs for Ghana cocoa board...",
                keywords: ["Delta Hedging", "Transaction Costs", "COCOBOD", "Risk Management"],
                pdfUrl: "#",
                citations: 28,
                aiSummary: "Recommends weekly rebalancing with 0.3% transaction cost assumption. Optimal tracking error: 1.2%.",
                difficulty: "Intermediate",
                mathLevel: "Medium"
            },
            {
                id: 3,
                title: "Value at Risk Measurement for Cocoa Portfolios",
                authors: ["Bank of Ghana", "Financial Stability"],
                year: 2023,
                category: "risk-management",
                abstract: "Implementation of VaR and Expected Shortfall for cocoa trading portfolios...",
                keywords: ["Value at Risk", "CVaR", "Stress Testing", "Risk Metrics"],
                pdfUrl: "#",
                citations: 35,
                aiSummary: "Shows 95% 1-day VaR of $11,250 for 100 MT position. Recommends 99% VaR for regulatory compliance.",
                difficulty: "Intermediate",
                mathLevel: "Medium"
            },
            {
                id: 4,
                title: "GARCH Volatility Modeling for Cocoa Futures",
                authors: ["University of Ghana", "Economics Dept"],
                year: 2024,
                category: "quantitative-analysis",
                abstract: "Time-varying volatility estimation using GARCH models for cocoa price forecasting...",
                keywords: ["GARCH", "Volatility", "Time Series", "Forecasting"],
                pdfUrl: "#",
                citations: 19,
                aiSummary: "GARCH(1,1) with α=0.10, β=0.85 fits cocoa volatility. Shows strong persistence and mean reversion.",
                difficulty: "Advanced",
                mathLevel: "High"
            },
            {
                id: 5,
                title: "Monte Carlo Simulation for Cocoa Option Pricing",
                authors: ["Kwame Nkrumah University", "Mathematics Dept"],
                year: 2024,
                category: "options-pricing",
                abstract: "Implementation of Monte Carlo methods with variance reduction for cocoa derivatives...",
                keywords: ["Monte Carlo", "Simulation", "Variance Reduction", "Option Pricing"],
                pdfUrl: "#",
                citations: 15,
                aiSummary: "10,000 paths with antithetic variates reduces standard error by 40%. Python implementation provided.",
                difficulty: "Advanced",
                mathLevel: "High"
            },
            {
                id: 6,
                title: "Cointegration Analysis: Cocoa Prices and Exchange Rates",
                authors: ["Ghana Statistical Service"],
                year: 2023,
                category: "quantitative-analysis",
                abstract: "Statistical analysis of long-term relationship between cocoa prices and USD/GHS exchange rate...",
                keywords: ["Cointegration", "FX Risk", "Statistical Arbitrage", "Pairs Trading"],
                pdfUrl: "#",
                citations: 22,
                aiSummary: "Finds 65% correlation. Optimal hedge ratio: 0.65 futures per option position.",
                difficulty: "Intermediate",
                mathLevel: "Medium"
            },
            {
                id: 7,
                title: "Stress Testing Framework for Ghana Cocoa Markets",
                authors: ["IMF", "World Bank"],
                year: 2024,
                category: "risk-management",
                abstract: "Scenario analysis framework for extreme market events affecting Ghana cocoa...",
                keywords: ["Stress Testing", "Scenario Analysis", "Extreme Events", "Risk Management"],
                pdfUrl: "#",
                citations: 31,
                aiSummary: "Identifies El Niño as highest risk (-30% production). Recommends put options for protection.",
                difficulty: "Intermediate",
                mathLevel: "Low"
            },
            {
                id: 8,
                title: "Binomial Model for American Cocoa Options",
                authors: ["Soka University of America"],
                year: 2024,
                category: "options-pricing",
                abstract: "Implementation of binomial tree model for American-style cocoa options with early exercise...",
                keywords: ["Binomial Model", "American Options", "Tree Methods", "Numerical Methods"],
                pdfUrl: "#",
                citations: 8,
                aiSummary: "100-step binomial tree converges to BSM price ±1%. Early exercise premium: 2-3% for deep ITM puts.",
                difficulty: "Advanced",
                mathLevel: "High"
            }
        ];
    }
    
    getCategories() {
        return [
            { id: "all", name: "All Research", count: this.papers.length },
            { id: "options-pricing", name: "Options Pricing", count: this.papers.filter(p => p.category === "options-pricing").length },
            { id: "delta-hedging", name: "Delta Hedging", count: this.papers.filter(p => p.category === "delta-hedging").length },
            { id: "risk-management", name: "Risk Management", count: this.papers.filter(p => p.category === "risk-management").length },
            { id: "quantitative-analysis", name: "Quantitative Analysis", count: this.papers.filter(p => p.category === "quantitative-analysis").length }
        ];
    }
    
    renderPapers(filteredPapers = this.papers) {
        const container = document.getElementById('researchPapers');
        if (!container) return;
        
        container.innerHTML = filteredPapers.map(paper => `
            <div class="paper-card" data-id="${paper.id}" data-category="${paper.category}">
                <div class="paper-header">
                    <div class="paper-category">${this.getCategoryName(paper.category)}</div>
                    <div class="paper-year">${paper.year}</div>
                </div>
                
                <h3 class="paper-title">${paper.title}</h3>
                
                <div class="paper-authors">
                    <i class="fas fa-user-edit"></i>
                    ${paper.authors.join(", ")}
                </div>
                
                <div class="paper-abstract">
                    <p>${paper.abstract}</p>
                </div>
                
                <div class="paper-ai-summary">
                    <div class="ai-summary-header">
                        <i class="fas fa-robot"></i>
                        <strong>AI Summary</strong>
                    </div>
                    <p>${paper.aiSummary}</p>
                </div>
                
                <div class="paper-meta">
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span class="keywords">${paper.keywords.slice(0, 3).join(", ")}</span>
                    </div>
                    
                    <div class="meta-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span class="difficulty ${paper.difficulty.toLowerCase()}">${paper.difficulty}</span>
                    </div>
                    
                    <div class="meta-item">
                        <i class="fas fa-calculator"></i>
                        <span class="math-level">Math: ${paper.mathLevel}</span>
                    </div>
                    
                    <div class="meta-item">
                        <i class="fas fa-quote-right"></i>
                        <span class="citations">${paper.citations} citations</span>
                    </div>
                </div>
                
                <div class="paper-actions">
                    <button class="btn btn-secondary btn-sm view-abstract" data-id="${paper.id}">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    <button class="btn btn-primary btn-sm download-paper" data-id="${paper.id}">
                        <i class="fas fa-download"></i> PDF
                    </button>
                    <button class="btn btn-secondary btn-sm ai-explain" data-id="${paper.id}">
                        <i class="fas fa-robot"></i> Explain Math
                    </button>
                    <button class="btn btn-secondary btn-sm cite-paper" data-id="${paper.id}">
                        <i class="fas fa-quote-left"></i> Cite
                    </button>
                </div>
            </div>
        `).join('');
        
        this.setupPaperActions();
    }
    
    setupAIHelper() {
        // Add AI analysis button to research page
        const aiHelperBtn = document.createElement('button');
        aiHelperBtn.id = 'aiResearchHelper';
        aiHelperBtn.className = 'btn btn-primary';
        aiHelperBtn.innerHTML = '<i class="fas fa-robot"></i> AI Research Assistant';
        aiHelperBtn.style.margin = '1rem 0';
        
        const researchHeader = document.querySelector('.research-header');
        if (researchHeader) {
            researchHeader.appendChild(aiHelperBtn);
            
            aiHelperBtn.addEventListener('click', () => {
                this.showAIResearchHelper();
            });
        }
    }
    
    showAIResearchHelper() {
        const modalContent = `
            <div class="ai-research-helper">
                <h3><i class="fas fa-robot"></i> Research AI Assistant</h3>
                <p>I can help you understand and apply research papers:</p>
                
                <div class="ai-research-options">
                    <div class="ai-option" onclick="researchAI.explainMathematicalConcepts()">
                        <i class="fas fa-square-root-alt"></i>
                        <h4>Explain Mathematical Concepts</h4>
                        <p>Black-Scholes, GARCH, cointegration, etc.</p>
                    </div>
                    
                    <div class="ai-option" onclick="researchAI.suggestResearchGap()">
                        <i class="fas fa-lightbulb"></i>
                        <h4>Suggest Research Gaps</h4>
                        <p>Identify areas for further study</p>
                    </div>
                    
                    <div class="ai-option" onclick="researchAI.helpWithImplementation()">
                        <i class="fas fa-code"></i>
                        <h4>Help with Implementation</h4>
                        <p>Python/R code for models</p>
                    </div>
                    
                    <div class="ai-option" onclick="researchAI.explainPaper(1)">
                        <i class="fas fa-book"></i>
                        <h4>Explain a Paper</h4>
                        <p>Detailed breakdown of selected paper</p>
                    </div>
                </div>
                
                <div class="ai-research-contact">
                    <h4><i class="fas fa-user-tie"></i> Need Academic Help?</h4>
                    <p>For thesis guidance, research methodology, or publication support:</p>
                    <p><strong>Contact:</strong> emmanueladutwum900@yahoo.com</p>
                    <p><strong>Phone:</strong> +233 553483918</p>
                    <p><strong>Specialties:</strong> Quantitative finance, Ghana markets, Academic research</p>
                </div>
            </div>
        `;
        
        this.showModal('Research AI Assistant', modalContent);
    }
    
    explainPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        let explanation = `**${paper.title}**\n\n`;
        explanation += `**Authors:** ${paper.authors.join(", ")}\n`;
        explanation += `**Year:** ${paper.year}\n`;
        explanation += `**Category:** ${this.getCategoryName(paper.category)}\n\n`;
        
        explanation += `**Key Mathematical Concepts:**\n`;
        
        switch(paper.category) {
            case 'options-pricing':
                explanation += this.getOptionsPricingExplanation(paper);
                break;
            case 'delta-hedging':
                explanation += this.getDeltaHedgingExplanation(paper);
                break;
            case 'risk-management':
                explanation += this.getRiskManagementExplanation(paper);
                break;
            case 'quantitative-analysis':
                explanation += this.getQuantitativeAnalysisExplanation(paper);
                break;
        }
        
        explanation += `\n**Practical Application for Ghana:**\n`;
        explanation += this.getGhanaApplication(paper);
        
        explanation += `\n**For detailed implementation help:**\n`;
        explanation += `Contact: emmanueladutwum900@yahoo.com\n`;
        explanation += `Phone: +233 553483918`;
        
        // Show explanation
        const explanationModal = `
            <div class="paper-explanation">
                <h3>AI Explanation: ${paper.title}</h3>
                <div class="explanation-content">
                    ${explanation.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="researchAI.showCodeExample('${paper.category}')">
                        <i class="fas fa-code"></i> Show Code Example
                    </button>
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Paper Explanation', explanationModal);
    }
    
    getOptionsPricingExplanation(paper) {
        return `• **Black-Scholes-Merton Formula:**
   C = S₀e^(-δT)N(d₁) - Ke^(-rT)N(d₂)
   Where δ = convenience yield (2-4% for cocoa)

• **Binomial Tree Method:**
   u = e^(σ√Δt), d = 1/u
   p = (e^((r-δ)Δt) - d) / (u - d)

• **Monte Carlo Simulation:**
   S_T = S₀ × exp[(r-δ-σ²/2)T + σ√T × Z]
   Option price = e^(-rT) × average(max(S_T - K, 0))

**Key Insight:** Cocoa requires convenience yield adjustment in all models.`;
    }
    
    getDeltaHedgingExplanation(paper) {
        return `• **Delta Calculation:**
   Δ_call = e^(-δT)N(d₁)
   Δ_put = e^(-δT)[N(d₁) - 1]

• **Hedge Ratio:**
   Futures to trade = -Δ × Option Quantity / Contract Size
   Cocoa contract size = 10 MT

• **Transaction Costs:**
   Total cost = Commission + Bid-ask spread + Slippage
   Ghana average: 0.3-0.5% per rebalance

**Optimal Strategy:** Weekly rebalancing minimizes cost while controlling tracking error.`;
    }
    
    getRiskManagementExplanation(paper) {
        return `• **Value at Risk (VaR):**
   VaR_95% = μ - 1.645σ
   For cocoa: Daily σ ≈ 1.8% (28% annualized)

• **Expected Shortfall (CVaR):**
   ES_α = 𝔼[Loss | Loss > VaR_α]
   More conservative than VaR

• **Stress Testing:**
   Historical scenarios (El Niño 2016: -30%)
   Hypothetical scenarios (Drought +50% prices)

**COCOBOD Requirement:** 99% 10-day VaR for regulatory compliance.`;
    }
    
    getQuantitativeAnalysisExplanation(paper) {
        return `• **GARCH(1,1) Model:**
   σ²_t = ω + αε²_{t-1} + βσ²_{t-1}
   Cocoa estimates: α=0.10, β=0.85

• **Cointegration Test:**
   ln(S_t) = α + β×ln(FX_t) + ε_t
   Test if ε_t is stationary (ADF test)

• **Correlation Analysis:**
   Cocoa-USD/GHS: 65%
   Cocoa-Coffee: 45%

**Application:** Use for pairs trading and cross-hedging strategies.`;
    }
    
    getGhanaApplication(paper) {
        return `• **COCOBOD Implementation:** ${paper.category === 'options-pricing' ? 'Use for pricing forward sales to farmers' : ''}
• **Ghana Commodity Exchange:** ${paper.category === 'delta-hedging' ? 'Develop hedging products for farmers' : ''}
• **Regulatory Compliance:** ${paper.category === 'risk-management' ? 'Bank of Ghana capital requirements' : ''}
• **Academic Research:** ${paper.category === 'quantitative-analysis' ? 'University research projects and theses' : ''}`;
    }
    
    showCodeExample(category) {
        let code = '';
        
        switch(category) {
            case 'options-pricing':
                code = `# Black-Scholes for Cocoa with Convenience Yield
import numpy as np
from scipy.stats import norm

def black_scholes_cocoa(S, K, T, r, delta, sigma, option_type='call'):
    d1 = (np.log(S/K) + (r - delta + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    
    if option_type == 'call':
        price = S*np.exp(-delta*T)*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)
    else:
        price = K*np.exp(-r*T)*norm.cdf(-d2) - S*np.exp(-delta*T)*norm.cdf(-d1)
    
    return price

# Ghana cocoa example
price = black_scholes_cocoa(
    S=3800, K=3800, T=0.25,
    r=0.04, delta=0.03, sigma=0.30
)
print(f"Option price: ${price:.2f}")`;
                break;
                
            case 'delta-hedging':
                code = `# Delta Hedging Simulation
import numpy as np

def delta_hedging_simulation(S0, K, T, r, delta, sigma, position, days=90):
    dt = 1/252
    prices = [S0]
    deltas = [calculate_delta(S0, K, T, r, delta, sigma)]
    pnl = [0]
    
    for i in range(1, days):
        # Price movement
        z = np.random.randn()
        price = prices[-1] * np.exp((r-delta-0.5*sigma**2)*dt + sigma*np.sqrt(dt)*z)
        prices.append(price)
        
        # Calculate new delta
        new_delta = calculate_delta(price, K, T-i*dt/365, r, delta, sigma)
        deltas.append(new_delta)
        
        # P&L from delta change
        delta_change = new_delta - deltas[-2]
        pnl_change = deltas[-2] * position * (price - prices[-2])
        pnl.append(pnl[-1] + pnl_change)
    
    return prices, deltas, pnl`;
                break;
                
            case 'risk-management':
                code = `# Value at Risk Calculation
import numpy as np
import pandas as pd

def calculate_var(returns, confidence=0.95):
    """
    Calculate Value at Risk using historical simulation
    """
    # Sort returns
    sorted_returns = np.sort(returns)
    
    # Calculate index for VaR
    index = int((1 - confidence) * len(sorted_returns))
    
    # VaR is the loss at this index
    var = -sorted_returns[index]
    
    return var

def calculate_cvar(returns, confidence=0.95):
    """
    Calculate Conditional Value at Risk (Expected Shortfall)
    """
    var = calculate_var(returns, confidence)
    
    # Average of losses worse than VaR
    losses_beyond_var = returns[returns < -var]
    cvar = -np.mean(losses_beyond_var)
    
    return cvar

# Example with cocoa returns
cocoa_returns = get_cocoa_returns()  # Your data here
var_95 = calculate_var(cocoa_returns, 0.95)
cvar_95 = calculate_cvar(cocoa_returns, 0.95)

print(f"95% VaR: {var_95:.2%}")
print(f"95% CVaR: {cvar_95:.2%}")`;
                break;
                
            case 'quantitative-analysis':
                code = `# GARCH(1,1) Volatility Modeling
import numpy as np
from arch import arch_model

def fit_garch(returns):
    """
    Fit GARCH(1,1) model to returns
    """
    model = arch_model(returns, vol='Garch', p=1, q=1)
    results = model.fit(disp='off')
    
    params = {
        'omega': results.params['omega'],
        'alpha': results.params['alpha[1]'],
        'beta': results.params['beta[1]']
    }
    
    # Calculate long-run volatility
    alpha_beta = params['alpha'] + params['beta']
    long_run_var = params['omega'] / (1 - alpha_beta)
    long_run_vol = np.sqrt(long_run_var * 252)  # Annualized
    
    return results, params, long_run_vol

# Forecast volatility
def forecast_volatility(results, horizon=10):
    """
    Forecast volatility for given horizon
    """
    forecasts = results.forecast(horizon=horizon)
    forecasted_var = forecasts.variance.iloc[-1].values
    
    return np.sqrt(forecasted_var * 252)  # Annualized

# Example usage
# returns = get_cocoa_returns()  # Daily returns
# results, params, lr_vol = fit_garch(returns)
# print(f"Long-run volatility: {lr_vol:.1%}")
# print(f"Alpha: {params['alpha']:.3f}, Beta: {params['beta']:.3f}")`;
                break;
        }
        
        const codeModal = `
            <div class="code-example">
                <h3><i class="fas fa-code"></i> Python Implementation</h3>
                <div class="code-header">
                    <span>${category.replace('-', ' ').toUpperCase()}</span>
                    <button class="btn btn-sm copy-code">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code class="python">${code}</code></pre>
                <div class="code-note">
                    <p><i class="fas fa-info-circle"></i> This is example code. For production use, add error handling and optimization.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Code Example', codeModal);
        
        // Add copy functionality
        document.querySelector('.copy-code')?.addEventListener('click', () => {
            navigator.clipboard.writeText(code)
                .then(() => this.showNotification('Code copied to clipboard', 'success'))
                .catch(() => this.showNotification('Failed to copy code', 'error'));
        });
    }
    
    explainMathematicalConcepts() {
        const concepts = `**Key Mathematical Concepts in Cocoa Derivatives Research:**

**1. Stochastic Calculus (Itô's Lemma):**
For price process: dS/S = μdt + σdW
Option value f(S,t) follows: df = (∂f/∂t + μS∂f/∂S + ½σ²S²∂²f/∂S²)dt + σS∂f/∂S dW

**2. Black-Scholes PDE:**
∂V/∂t + ½σ²S²∂²V/∂S² + (r-δ)S∂V/∂S - rV = 0
With boundary conditions for calls/puts

**3. Risk-Neutral Valuation:**
Option price = e^(-rT)𝔼^Q[max(S_T - K, 0)]
Where Q is risk-neutral measure

**4. Greeks (Sensitivities):**
• Delta (Δ): ∂V/∂S
• Gamma (Γ): ∂²V/∂S²  
• Theta (Θ): ∂V/∂t
• Vega (ν): ∂V/∂σ
• Rho (ρ): ∂V/∂r

**5. GARCH Model:**
σ²_t = ω + αε²_{t-1} + βσ²_{t-1}
Where α + β < 1 for stationarity

**6. Cointegration:**
Two series are cointegrated if:
• Both are I(1) (non-stationary in levels)
• Linear combination is I(0) (stationary)

**7. Monte Carlo Methods:**
Option price ≈ 1/N ∑ e^(-rT)max(S_T^i - K, 0)
With variance reduction techniques

**For help implementing these:** Contact emmanueladutwum900@yahoo.com`;
        
        const modalContent = `
            <div class="math-concepts">
                <h3><i class="fas fa-square-root-alt"></i> Mathematical Concepts</h3>
                <div class="concepts-content">
                    ${concepts.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="researchAI.showCodeExample('options-pricing')">
                        <i class="fas fa-code"></i> See Implementation
                    </button>
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Mathematical Concepts', modalContent);
    }
    
    suggestResearchGap() {
        const gaps = `**Research Gaps in Ghana Cocoa Derivatives:**

**1. Machine Learning Applications:**
• LSTM/GRU for cocoa price prediction
• Random Forest for volatility forecasting
• Neural networks for optimal hedging

**2. Multi-Commodity Hedging:**
• Cocoa, coffee, and sugar portfolio optimization
• Cross-hedging effectiveness measurement
• Basket option pricing

**3. Weather Derivatives:**
• Rainfall options for drought protection
• Temperature futures for climate risk
• El Niño/La Niña insurance products

**4. Blockchain Applications:**
• Smart contracts for forward sales
• Tokenized cocoa derivatives
• Transparent supply chain financing

**5. Smallholder Farmer Products:**
• Micro-options for individual farmers
• Mobile-based hedging platforms
• Cooperative risk pooling mechanisms

**6. Regulatory Framework:**
• Ghana-specific derivative regulations
• Cross-border trading agreements
• Central counterparty clearing for GCX

**7. Sustainable Finance:**
• Green bonds for cocoa sustainability
• Carbon credit linked derivatives
• ESG-compliant trading strategies

**Potential Thesis Topics:**
1. "Machine Learning for Ghana Cocoa Price Forecasting"
2. "Weather Risk Management for Cocoa Farmers"
3. "Blockchain Implementation in Ghana Commodity Exchange"
4. "Optimal Cross-Hedging Strategies for West African Commodities"

**For research collaboration:** Contact emmanueladutwum900@yahoo.com`;
        
        const modalContent = `
            <div class="research-gaps">
                <h3><i class="fas fa-lightbulb"></i> Research Opportunities</h3>
                <div class="gaps-content">
                    ${gaps.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Research Gaps', modalContent);
    }
    
    helpWithImplementation() {
        const helpContent = `**Implementation Support for Research:**

**1. Python Libraries Needed:**
• NumPy/SciPy: Numerical computations
• pandas: Data manipulation
• statsmodels: Statistical models
• arch: GARCH modeling
• scikit-learn: Machine learning
• TensorFlow/PyTorch: Deep learning

**2. Data Sources:**
• ICE Futures: Cocoa price data
• Bank of Ghana: Exchange rates
• COCOBOD: Production statistics
• World Bank: Commodity indices
• Ghana Statistical Service: Economic data

**3. Implementation Steps:**
1. **Data Collection:** 5+ years of daily prices
2. **Data Cleaning:** Handle missing values, outliers
3. **Exploratory Analysis:** Returns distribution, autocorrelation
4. **Model Selection:** Based on research question
5. **Implementation:** Code with proper documentation
6. **Validation:** Backtesting, out-of-sample testing
7. **Documentation:** Clear explanation of methodology

**4. Common Pitfalls to Avoid:**
• Overfitting models to historical data
• Ignoring transaction costs in backtesting
• Assuming normal distributions (cocoa has fat tails)
• Forgetting about convenience yield in pricing
• Neglecting currency risk for Ghana applications

**5. Sample Project Structure:**
\`\`\`
project/
├── data/
│   ├── raw/           # Original data
│   └── processed/     # Cleaned data
├── notebooks/         # Jupyter notebooks
├── src/              # Source code
│   ├── models/       # Model implementations
│   ├── utils/        # Helper functions
│   └── tests/        # Unit tests
├── results/          # Output files
└── docs/             # Documentation
\`\`\`

**6. Getting Help:**
For specific implementation issues:
• **Email:** emmanueladutwum900@yahoo.com
• **Phone:** +233 553483918
• **Response Time:** 24-48 hours

**Areas I Can Help With:**
• Python/R code debugging
• Model implementation guidance
• Data analysis methodology
• Thesis/dissertation coding
• Academic paper replication`;
        
        const modalContent = `
            <div class="implementation-help">
                <h3><i class="fas fa-code"></i> Implementation Guidance</h3>
                <div class="help-content">
                    ${helpContent.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="researchAI.showCodeExample('options-pricing')">
                        <i class="fas fa-code"></i> View Code Examples
                    </button>
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Implementation Help', modalContent);
    }
    
    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterPapers(category);
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    filterPapers(category) {
        if (category === 'all') {
            this.renderPapers(this.papers);
        } else {
            const filtered = this.papers.filter(paper => paper.category === category);
            this.renderPapers(filtered);
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('researchSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.searchPapers(query);
            });
        }
    }
    
    searchPapers(query) {
        if (!query.trim()) {
            this.renderPapers(this.papers);
            return;
        }
        
        const filtered = this.papers.filter(paper => 
            paper.title.toLowerCase().includes(query) ||
            paper.abstract.toLowerCase().includes(query) ||
            paper.keywords.some(kw => kw.toLowerCase().includes(query)) ||
            paper.authors.some(author => author.toLowerCase().includes(query))
        );
        
        this.renderPapers(filtered);
    }
    
    setupPaperActions() {
        // View abstract/details
        document.querySelectorAll('.view-abstract').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.dataset.id);
                this.showPaperDetails(paperId);
            });
        });
        
        // Download PDF
        document.querySelectorAll('.download-paper').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.dataset.id);
                this.downloadPaper(paperId);
            });
        });
        
        // AI Explain
        document.querySelectorAll('.ai-explain').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.dataset.id);
                this.explainPaper(paperId);
            });
        });
        
        // Cite paper
        document.querySelectorAll('.cite-paper').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.dataset.id);
                this.showCitation(paperId);
            });
        });
    }
    
    showPaperDetails(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const modalContent = `
            <div class="paper-details">
                <h3>${paper.title}</h3>
                <div class="paper-meta-details">
                    <p><strong>Authors:</strong> ${paper.authors.join(", ")}</p>
                    <p><strong>Year:</strong> ${paper.year}</p>
                    <p><strong>Category:</strong> ${this.getCategoryName(paper.category)}</p>
                    <p><strong>Citations:</strong> ${paper.citations}</p>
                    <p><strong>Difficulty:</strong> ${paper.difficulty}</p>
                    <p><strong>Math Level:</strong> ${paper.mathLevel}</p>
                </div>
                
                <div class="abstract-full">
                    <h4>Abstract</h4>
                    <p>${paper.abstract}</p>
                </div>
                
                <div class="keywords-full">
                    <h4>Keywords</h4>
                    <div class="keyword-tags">
                        ${paper.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
                    </div>
                </div>
                
                <div class="ai-analysis">
                    <h4><i class="fas fa-robot"></i> AI Analysis</h4>
                    <p>${paper.aiSummary}</p>
                    <div class="ai-actions">
                        <button class="btn btn-sm btn-secondary" onclick="researchAI.explainPaper(${paperId})">
                            <i class="fas fa-square-root-alt"></i> Explain Mathematics
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="researchAI.showCodeExample('${paper.category}')">
                            <i class="fas fa-code"></i> Show Code Example
                        </button>
                    </div>
                </div>
                
                <div class="contact-research">
                    <h4><i class="fas fa-user-tie"></i> Research Support</h4>
                    <p>For help understanding or implementing this research:</p>
                    <p><strong>Email:</strong> emmanueladutwum900@yahoo.com</p>
                    <p><strong>Phone:</strong> +233 553483918</p>
                </div>
            </div>
        `;
        
        this.showModal(paper.title, modalContent);
    }
    
    downloadPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        // In a real application, this would download the actual PDF
        // For now, show a notification
        this.showNotification(`Downloading "${paper.title}"... (simulated)`, 'info');
    }
    
    showCitation(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const citation = `${paper.authors.join(" & ")} (${paper.year}). "${paper.title}". Ghana Cocoa Derivatives Research Platform.`;
        
        const modalContent = `
            <div class="citation-modal">
                <h3>Citation</h3>
                <div class="citation-content">
                    <pre>${citation}</pre>
                </div>
                <div class="citation-formats">
                    <h4>Formats:</h4>
                    <div class="format-buttons">
                        <button class="btn btn-sm btn-secondary copy-citation" data-format="apa">
                            APA
                        </button>
                        <button class="btn btn-sm btn-secondary copy-citation" data-format="mla">
                            MLA
                        </button>
                        <button class="btn btn-sm btn-secondary copy-citation" data-format="chicago">
                            Chicago
                        </button>
                        <button class="btn btn-sm btn-secondary copy-citation" data-format="bibtex">
                            BibTeX
                        </button>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary copy-to-clipboard">
                        <i class="fas fa-copy"></i> Copy Citation
                    </button>
                    <button class="btn btn-secondary close-modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Cite Paper', modalContent);
        
        // Add copy functionality
        document.querySelector('.copy-to-clipboard')?.addEventListener('click', () => {
            navigator.clipboard.writeText(citation)
                .then(() => this.showNotification('Citation copied to clipboard', 'success'))
                .catch(() => this.showNotification('Failed to copy citation', 'error'));
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
    
    showNotification(message, type = 'info') {
        // Use existing notification system
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
}

// Initialize research library when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.research-library')) {
        window.researchLibrary = new ResearchLibrary();
        window.researchAI = window.researchLibrary; // Alias for AI functions
    }
});

// Add research-specific styles
const researchStyles = document.createElement('style');
researchStyles.textContent = `
    /* Research Library Styles */
    .paper-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .paper-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
    
    .paper-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .paper-category {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .paper-year {
        color: var(--text-tertiary);
        font-size: 0.9rem;
    }
    
    .paper-title {
        color: var(--text-primary);
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
        line-height: 1.4;
    }
    
    .paper-authors {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .paper-abstract {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .paper-ai-summary {
        background: rgba(0, 107, 63, 0.1);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        border-left: 3px solid var(--primary);
    }
    
    .ai-summary-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .paper-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.85rem;
    }
    
    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-tertiary);
    }
    
    .difficulty {
        font-weight: 600;
        padding: 0.1rem 0.5rem;
        border-radius: 4px;
    }
    
    .difficulty.beginner {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
    }
    
    .difficulty.intermediate {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    
    .difficulty.advanced {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    
    .paper-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    /* AI Research Helper Styles */
    .ai-research-helper {
        padding: 1rem;
    }
    
    .ai-research-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .ai-option {
        background: var(--bg-tertiary);
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease;
        border: 2px solid transparent;
    }
    
    .ai-option:hover {
        transform: translateY(-2px);
        border-color: var(--primary);
    }
    
    .ai-option i {
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }
    
    .ai-option h4 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .ai-option p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .ai-research-contact {
        margin-top: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(0, 107, 63, 0.1), rgba(252, 209, 22, 0.1));
        border-radius: 12px;
        border-left: 4px solid var(--ghana-red);
    }
    
    /* Code Example Styles */
    .code-example {
        padding: 1rem;
    }
    
    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
    }
    
    .code-example pre {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }
    
    .code-example code.python {
        color: inherit;
    }
    
    .code-note {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(245, 158, 11, 0.1);
        border-radius: 8px;
        border-left: 3px solid #f59e0b;
        font-size: 0.9rem;
    }
    
    /* Paper Details Styles */
    .paper-details {
        padding: 1rem;
    }
    
    .paper-meta-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
    }
    
    .abstract-full {
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
    }
    
    .keywords-full {
        margin: 1.5rem 0;
    }
    
    .keyword-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .keyword-tag {
        background: rgba(0, 107, 63, 0.1);
        color: var(--primary);
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
    }
    
    .ai-analysis {
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: rgba(0, 107, 63, 0.1);
        border-radius: 8px;
        border-left: 3px solid var(--primary);
    }
    
    .ai-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .contact-research {
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(206, 17, 38, 0.1), rgba(252, 209, 22, 0.1));
        border-radius: 8px;
        border-left: 3px solid var(--ghana-red);
    }
    
    /* Math Concepts Styles */
    .math-concepts, .research-gaps, .implementation-help {
        padding: 1rem;
    }
    
    .concepts-content, .gaps-content, .help-content {
        line-height: 1.8;
        margin: 1.5rem 0;
        max-height: 400px;
        overflow-y: auto;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
    }
    
    /* Citation Styles */
    .citation-modal {
        padding: 1rem;
    }
    
    .citation-content {
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
    }
    
    .citation-content pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Courier New', monospace;
    }
    
    .citation-formats {
        margin: 1.5rem 0;
    }
    
    .format-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
    }
    
    /* Research filters */
    .research-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1.5rem 0;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-tertiary);
        border: 1px solid var(--border);
        border-radius: 50px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    .filter-btn.active {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border-color: transparent;
    }
    
    /* Search bar */
    .research-search {
        margin: 1.5rem 0;
    }
    
    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
    }
    
    .search-input:focus {
        outline: none;
        border-color: var(--primary);
    }
`;
document.head.appendChild(researchStyles);
