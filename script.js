// script.js - COMPLETE REVISED with Fixed Functionality

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
    }
    
    fixNavigationIssues() {
        // Ensure navigation is always visible
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.opacity = '1';
            navbar.style.visibility = 'visible';
            navbar.style.zIndex = '1000';
        }
        
        // Fix navigation links visibility
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.style.color = 'var(--text-primary)';
            link.style.fontWeight = '600';
            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.gap = '0.5rem';
        });
        
        // Fix active state
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                link.classList.add('active');
                link.style.color = 'white';
            } else {
                link.classList.remove('active');
            }
        });
    }
    
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
        
        // Get AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addAIMessage(response, 'ai');
        }, 1000);
    }
    
    addAIMessage(message, sender) {
        const aiChat = document.getElementById('aiChat');
        if (!aiChat) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.setAttribute('aria-label', `${sender === 'user' ? 'You said' : 'AI assistant said'}`);
        
        // Format message with line breaks
        const formattedMessage = message.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<p>${this.escapeHTML(formattedMessage)}</p>`;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Advanced quantitative responses for cocoa derivatives
        const knowledgeBase = {
            // Black-Scholes and Pricing
            'black scholes': `The Black-Scholes-Merton model for cocoa options with convenience yield (δ):
C = S₀e^(-δT)N(d₁) - Ke^(-rT)N(d₂)
P = Ke^(-rT)N(-d₂) - S₀e^(-δT)N(-d₁)

where:
d₁ = [ln(S₀/K) + (r - δ + σ²/2)T] / (σ√T)
d₂ = d₁ - σ√T

Parameters for cocoa:
- S₀: Current cocoa price ($/MT)
- K: Strike price ($/MT)
- T: Time to expiration (years)
- r: Risk-free rate (≈3-5%)
- δ: Convenience yield (≈2-4% for cocoa)
- σ: Volatility (≈25-35%)

The convenience yield δ represents the benefit of physical ownership (storage, processing flexibility).`,

            'greeks': `Option Greeks for cocoa options:

1. Delta (Δ): Price sensitivity
   Call: Δ = e^(-δT)N(d₁) ≈ 0.4-0.6 for ATM
   Put: Δ = e^(-δT)[N(d₁) - 1]

2. Gamma (Γ): Delta sensitivity
   Γ = N'(d₁)e^(-δT) / (Sσ√T)
   Highest for ATM options

3. Theta (Θ): Time decay
   Θ = -SσN'(d₁)e^(-δT)/(2√T) + δSN(d₁)e^(-δT) - rKe^(-rT)N(d₂)

4. Vega (ν): Volatility sensitivity
   ν = S√T N'(d₁)e^(-δT)
   A 1% vol increase → price change of ν/100

5. Rho (ρ): Interest rate sensitivity
   Call: ρ = KTe^(-rT)N(d₂)
   Put: ρ = -KTe^(-rT)N(-d₂)

For cocoa options, vega and delta are typically most significant.`,

            // Delta Hedging
            'delta hedge': `Delta Hedging Strategy for Cocoa Options:

1. Objective: Create delta-neutral portfolio
   Total Δ = Δ_option + Δ_hedge ≈ 0

2. Hedge Ratio: h = -Δ_option / (Δ_future × ContractSize)
   For cocoa futures: Contract size = 10 MT
   Δ_future ≈ 1 (for near-month)

3. Rebalancing Frequency:
   - Daily: Low tracking error, high costs
   - Weekly: Balance of error/cost (recommended)
   - Monthly: High error, low costs

4. Transaction Costs:
   - Commission: $2-5 per contract
   - Bid-ask spread: $5-10/MT
   - Slippage: 0.05-0.1%

5. Performance Metrics:
   - Hedging Error = |Final P&L - Target|
   - Tracking Error = σ(P&L path)
   - Cost Efficiency = Benefit/Cost

Optimal strategy depends on volatility and liquidity.`,

            // Quantitative Models
            'monte carlo': `Monte Carlo Simulation for Cocoa:

1. Price Process: dS/S = (r-δ)dt + σdW + JdN
   where J~N(μ_jump, σ_jump) for weather events

2. Implementation:
   n_paths = 10,000
   n_steps = 252 × T (daily)
   dt = 1/252

3. Variance Reduction:
   - Antithetic variates: Use -ε for each ε
   - Control variates: Hedge with futures
   - Importance sampling: Focus on tails

4. Ghana Parameters:
   - Base volatility: 30%
   - Jump intensity (λ): 0.5/year
   - Jump size: -10% ± 15% (drought risk)
   - Convenience yield: 3%

5. Applications:
   - Option pricing with jumps
   - VaR/CVaR calculation
   - Stress testing`,

            'garch': `GARCH Modeling for Cocoa Volatility:

GARCH(1,1) Specification:
σ²_t = ω + αε²_{t-1} + βσ²_{t-1}

Typical Estimates for Cocoa:
- ω: 0.0001 (long-run variance)
- α: 0.10 (news impact)
- β: 0.85 (persistence)
- α + β ≈ 0.95 (high persistence)

Implied Volatility Dynamics:
1. Volatility clustering: High vol → high vol
2. Mean reversion: E[σ²] = ω/(1-α-β)
3. Leverage effect: Negative returns → higher vol

Forecasting:
1-day ahead: σ²_{t+1} = ω + αε²_t + βσ²_t
k-day ahead: E[σ²_{t+k}] = (α+β)^(k-1)σ²_{t+1} + [1-(α+β)^(k-1)]σ²_LR

Applications: Option pricing, risk management, hedging.`,

            // Risk Management
            'value at risk': `Value at Risk (VaR) for Cocoa:

1. Parametric (Normal) VaR:
   VaR_α = μ - z_ασ
   where z_95% = 1.645, z_99% = 2.326

2. Historical Simulation:
   - Sort historical returns
   - VaR_95% = 5th percentile
   - More accurate for fat tails

3. Monte Carlo VaR:
   - Simulate price paths
   - Calculate portfolio distribution
   - Read required percentile

4. Ghana Cocoa Example:
   - Daily σ: 1.8% (≈28% annualized)
   - Position: 100 MT @ $3,800/MT
   - 1-day 95% VaR = 100 × 3800 × 1.645 × 0.018 ≈ $11,250

5. Limitations:
   - Doesn't measure tail beyond VaR
   - Assumes normal returns (fat tails in cocoa)
   - Use Expected Shortfall (CVaR) for completeness.`,

            // Market Structure
            'ghana pricing': `Ghana Cocoa Pricing Structure:

1. World Price (ICE Futures):
   - Benchmark: ICE Cocoa (CC)
   - Contract: 10 MT, $/MT
   - Trading: 4:45-13:30 NY time

2. Ghana Differential:
   Ghana Price = ICE Price - Discount
   Discount range: $50-150/MT
   Factors: Quality, logistics, timing

3. COCOBOD Minimum Price:
   - Farmer price: ₵800/kg (≈$640/MT)
   - Floor price guarantee
   - Funded via forward sales

4. Exchange Rate Impact:
   GHS/USD volatility affects farmer income
   Hedging needed for currency risk

5. Quality Premiums:
   - Ghana premium for quality
   - Certification premiums (Fairtrade, Organic)
   - Traceability value`,

            // Basic Responses
            'hello': `Hello! I'm your quantitative cocoa risk assistant. I specialize in:

• Options pricing models (Black-Scholes, binomial)
• Delta hedging and risk management
• Quantitative finance (GARCH, Monte Carlo)
• Cocoa market structure and Ghana pricing
• Risk metrics (VaR, CVaR, Greeks)

Try asking about specific topics like:
"Explain delta hedging with transaction costs"
"How to calculate cocoa option Greeks"
"What is convenience yield in Black-Scholes?"
"Compare Monte Carlo vs. analytical pricing"

How can I help you with your cocoa risk management research?`,

            'help': `I can assist with these quantitative topics:

PRICING MODELS:
• Black-Scholes-Merton with convenience yield
• Binomial/trinomial trees
• Monte Carlo simulation
• Finite difference methods

RISK MANAGEMENT:
• Delta hedging strategies
• Gamma scalping techniques
• Portfolio Greeks calculation
• VaR and Expected Shortfall

QUANTITATIVE ANALYSIS:
• GARCH volatility modeling
• Jump-diffusion processes
• Stochastic calculus applications
• Numerical methods in finance

GHANA MARKET:
• Cocoa pricing structure
• COCOBOD risk management
• Exchange rate impacts
• Seasonality effects

MATHEMATICAL FOUNDATIONS:
• Itô's Lemma applications
• PDE solving methods
• Statistical arbitrage
• Machine learning in finance

Ask me anything specific about these areas!`,

            'thanks': `You're welcome! Remember these key principles for cocoa risk management:

1. Always model convenience yield in pricing
2. Consider transaction costs in hedging
3. Account for jumps (weather events)
4. Monitor basis risk (Ghana vs. ICE)
5. Validate models with market data

For more details, check the research papers or run simulations in the calculator. Always verify your models and assumptions.`,

            'bye': `Goodbye! Key takeaways for cocoa derivatives:

• Proper hedging requires continuous monitoring
• Always include transaction costs in analysis
• Consider both price and currency risk for Ghana
• Validate models with historical data
• Stay updated on market structure changes

Safe trading and happy researching!`
        };

        // Check for keywords
        for (const [keyword, response] of Object.entries(knowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        // Check for mathematical terms
        const mathTerms = ['calculate', 'formula', 'equation', 'derive', 'σ', 'μ', 'ρ', 'β', 'α', 'gamma', 'theta', 'vega'];
        if (mathTerms.some(term => lowerMessage.includes(term))) {
            return `I can help with mathematical models! Try asking about specific concepts like:

• "Black-Scholes formula derivation"
• "Delta calculation with convenience yield"
• "GARCH(1,1) parameter estimation"
• "Monte Carlo simulation steps for cocoa"
• "Ito's Lemma application in pricing"

Or be more specific about what you'd like to calculate or understand.`;
        }

        // Default quantitative response
        return `I focus on quantitative cocoa risk analysis. Could you ask about:

1. **Pricing Models**: "How to price cocoa options with convenience yield?"
2. **Risk Metrics**: "Calculate delta and gamma for ATM options"
3. **Hedging Strategies**: "Optimal delta hedging frequency with costs"
4. **Quantitative Methods**: "Implement GARCH for cocoa volatility"
5. **Market Analysis**: "Ghana cocoa pricing vs. ICE futures"

Or try: "Explain the Black-Scholes adjustment for commodities"
Or: "How to calculate hedging error in delta hedging"

What specific aspect of cocoa derivatives interests you?`;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
            },
            '/api/v1/prices/realtime': {
                method: 'GET',
                description: 'Real-time cocoa price feed',
                sampleResponse: {
                    "symbol": "COCOA",
                    "price": 3842.50,
                    "change": 2.30,
                    "change_percent": 0.060,
                    "bid": 3840.00,
                    "ask": 3845.00,
                    "volume": 8500,
                    "timestamp": new Date().toISOString(),
                    "exchange": "ICE",
                    "contract": "Mar 2024"
                }
            },
            '/api/v1/options/chain': {
                method: 'GET',
                description: 'Cocoa options chain data',
                sampleResponse: {
                    "underlying": "COCOA",
                    "expiry": "2024-03-31",
                    "strikes": [
                        {"strike": 3700, "call": { "bid": 185.25, "ask": 190.50, "volume": 120, "oi": 850 }, "put": { "bid": 65.75, "ask": 70.25, "volume": 85, "oi": 420 }},
                        {"strike": 3800, "call": { "bid": 125.50, "ask": 130.75, "volume": 210, "oi": 1250 }, "put": { "bid": 85.25, "ask": 90.00, "volume": 150, "oi": 780 }}
                    ],
                    "implied_vol": 0.318,
                    "timestamp": new Date().toISOString()
                }
            },
            '/api/v1/volatility/surface': {
                method: 'GET',
                description: 'Cocoa volatility surface data',
                sampleResponse: {
                    "maturities": [30, 60, 90, 180],
                    "strikes": [0.9, 0.95, 1.0, 1.05, 1.1],
                    "volatility": [
                        [0.35, 0.33, 0.32, 0.34, 0.36],
                        [0.33, 0.31, 0.30, 0.32, 0.34],
                        [0.32, 0.30, 0.29, 0.31, 0.33],
                        [0.30, 0.29, 0.28, 0.30, 0.32]
                    ],
                    "timestamp": new Date().toISOString(),
                    "interpolation_method": "spline"
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

    initializeComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize notifications system
        this.initializeNotifications();
        
        // Initialize data updates
        this.initializeDataUpdates();
        
        // Fix homepage layout issues
        this.fixHomepageLayout();
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
