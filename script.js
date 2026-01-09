// script.js - COMPLETE REVISED Core Platform JavaScript

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
    }
    
    fixNavigationIssues() {
        // Fix navigation visibility issues
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.style.color = 'var(--text-primary)';
            link.style.padding = '0.5rem 1rem';
            link.style.borderRadius = 'var(--radius)';
        });
        
        // Fix active state
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                link.classList.add('active');
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
            } else {
                icon.className = 'fas fa-moon';
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
                mobileMenuBtn.querySelector('i').className = 
                    navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });
            
            // Close menu on link click
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
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
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
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
                aiAssistant.classList.toggle('active');
                if (aiAssistant.classList.contains('active')) {
                    aiInput?.focus();
                }
            });
            
            if (aiClose) {
                aiClose.addEventListener('click', () => {
                    aiAssistant.classList.remove('active');
                });
            }
            
            if (aiSend && aiInput) {
                aiSend.addEventListener('click', () => this.handleAIMessage());
                aiInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleAIMessage();
                });
            }
        }
    }
    
    handleAIMessage() {
        const aiInput = document.getElementById('aiInput');
        const aiChat = document.getElementById('aiChat');
        
        if (!aiInput || !aiChat) return;
        
        const message = aiInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addAIMessage(message, 'user');
        aiInput.value = '';
        
        // Get AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addAIMessage(response, 'ai');
        }, 500);
    }
    
    addAIMessage(message, sender) {
        const aiChat = document.getElementById('aiChat');
        if (!aiChat) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.innerHTML = `<p>${this.escapeHTML(message)}</p>`;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Advanced quantitative responses
        const responses = {
            // Pricing and Valuation
            'black scholes': "The Black-Scholes-Merton model for cocoa options with convenience yield (δ): C = S₀e^(-δT)N(d₁) - Ke^(-rT)N(d₂) where d₁ = [ln(S₀/K) + (r - δ + σ²/2)T] / (σ√T)",
            'delta': "Delta (Δ) measures option price sensitivity to underlying price changes. For cocoa calls: Δ ≈ N(d₁)e^(-δT), typically 0.4-0.6 for at-the-money options.",
            'gamma': "Gamma (Γ) measures delta's sensitivity to price changes. Γ = N'(d₁)e^(-δT) / (Sσ√T). Important for delta hedging rebalancing frequency.",
            'vega': "Vega measures sensitivity to volatility. For cocoa: Vega = S√T N'(d₁)e^(-δT). A 1% volatility increase increases option price by vega amount.",
            'theta': "Theta (Θ) measures time decay. Θ = -SσN'(d₁)e^(-δT)/(2√T) + δSN(d₁)e^(-δT) - rKe^(-rT)N(d₂) for calls.",
            
            // Hedging Strategies
            'delta hedge': "Delta hedging involves offsetting option delta with opposite positions in cocoa futures. Rebalance when |Δ_portfolio| > threshold. Transaction costs ≈ 0.1% per trade.",
            'gamma scalping': "Gamma scalping: Buy options when implied vol < realized vol, sell when implied > realized. Rebalance delta frequently to capture volatility differences.",
            'risk reversal': "Cocoa risk reversal: Buy OTM calls + sell OTM puts to hedge against price spikes while funding with put premium.",
            'hedge ratio': "Optimal hedge ratio h* = ρ(σ_option/σ_future). For cocoa, ρ ≈ 0.85-0.95. Use regression: ΔPrice_option = α + βΔPrice_future + ε",
            
            // Quantitative Analysis
            'monte carlo': "Monte Carlo for cocoa: dS = (r-δ)Sdt + σSdW with jumps for weather events. Use 10,000+ simulations, control variates to reduce variance.",
            'garch': "GARCH(1,1) for cocoa volatility: σ²_t = ω + αε²_{t-1} + βσ²_{t-1}. Typical estimates: α=0.1, β=0.85, persistence α+β≈0.95",
            'value at risk': "Cocoa VaR calculation: VaR_95% = μ - 1.645σ. For portfolio: VaR = √(w'Σw) * 1.645. Historical simulation recommended for fat tails.",
            'expected shortfall': "Cocoa Expected Shortfall (CVaR): ES_α = E[L | L > VaR_α]. More conservative than VaR, accounts for tail risk beyond 95% quantile.",
            
            // Ghana-Specific
            'ghana pricing': "Ghana cocoa price = World price - Discount (≈$50-100/MT) + Quality premium. Discount reflects logistics, quality differentials.",
            'cocobod': "COCOBOD minimum price guarantee: ₵800/kg (≈$640/MT) floor for farmers. Funded via forward sales and World Bank syndicated loans.",
            'convenience yield': "Cocoa convenience yield δ ≈ 2-4% annually. Reflects benefits of physical ownership: supply assurance, processing flexibility.",
            'seasonality': "Cocoa seasonality: Main crop Oct-Mar, light crop Apr-Sep. Prices typically trough pre-harvest (Aug-Sep), peak Dec-Jan.",
            
            // Market Structure
            'ice futures': "ICE Cocoa (CC) contract: 10 metric tons, $/MT, delivery in US ports. Trading hours: 4:45-13:30 NY time. Margins ≈ $2,000-4,000/contract.",
            'options chain': "Cocoa options: American style, strikes every $50, monthly expiries. Open interest concentrated in front 3 months, put/call ratio ≈ 0.8-1.2",
            'volatility surface': "Cocoa volatility smile: ATM vol ≈ 30%, skew toward OTM puts (35-40%) for downside protection. Term structure usually upward sloping.",
            'basis risk': "Ghana basis risk = Local price - ICE futures. Driven by: FX rates (GHS/USD), port differentials, quality differences, local supply/demand.",
            
            // Mathematical Models
            'ito lemma': "Itô's Lemma for cocoa: dC = (∂C/∂t + (r-δ)S∂C/∂S + ½σ²S²∂²C/∂S²)dt + σS∂C/∂S dW",
            'stochastic calculus': "Cocoa price process: dS/S = (μ-δ)dt + σdW + JdN where J~N(-0.1,0.2) for weather shocks, λ=0.5 for jump intensity",
            'pde': "Black-Scholes PDE for cocoa: ∂C/∂t + (r-δ)S∂C/∂S + ½σ²S²∂²C/∂S² - rC = 0 with boundary conditions C(T)=max(S-K,0)",
            'finite difference': "Solve cocoa PDE via Crank-Nicolson: (1-θ)A·C^{n+1} = (1+θ)A·C^n where A is tridiagonal matrix from discretization",
            
            // Risk Management
            'greeks': "Full Greek suite for cocoa options: Δ, Γ, Θ, ν, ρ, λ (leverage), ε (elasticity), ζ (probability ITM). Use for dynamic hedging and risk limits.",
            'stress test': "Cocoa stress scenarios: 1) El Niño drought (-30% yield), 2) Currency crisis (GHS -50%), 3) Trade disruption (-100% exports for 3 months)",
            'correlation': "Cocoa correlations: vs USD -0.6, vs sugar +0.3, vs coffee +0.4, vs equity (S&P) -0.2. Time-varying, increase in crises.",
            'liquidity': "Cocoa liquidity: Daily volume ≈ 20k contracts ($80M notional), bid-ask spread ≈ $5/MT. Illiquid in Asian hours, OTC for large blocks.",
            
            // Basic responses
            'hello': "Hello! I'm your quantitative cocoa risk assistant. I can help with options pricing, hedging strategies, risk metrics, and Ghana market analysis. What would you like to know?",
            'help': "I specialize in:\n• Options pricing (Black-Scholes, Greeks)\n• Delta hedging and risk management\n• Quantitative models (GARCH, Monte Carlo)\n• Ghana cocoa market structure\n• Volatility analysis and forecasting\n\nTry asking about: 'delta hedging costs', 'GARCH parameters for cocoa', or 'COCOBOD pricing framework'",
            'price': "Current cocoa: $3,842.50/MT (+2.3%). Ghana price: $3,800 (-1.1% discount). Mar futures: $3,865. Implied vol: 31.8%. Historical vol: 28.5%.",
            'calculator': "The calculator implements Black-Scholes-Merton with convenience yield. Features: Real-time Greeks, delta hedging simulation, transaction costs, Ghana-specific parameters.",
            'research': "The research library contains 47 academic papers on cocoa derivatives. Use filters to find papers on pricing, risk management, or Ghana market structure.",
            'thanks': "You're welcome! For more details, check the research papers or run simulations in the calculator. Always verify models with market data.",
            'bye': "Goodbye! Remember: Proper hedging requires continuous monitoring and adjustment. Always consider transaction costs and liquidity constraints."
        };
        
        // Check for quantitative keywords first
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // Check for mathematical expressions
        const mathTerms = ['calculate', 'formula', 'equation', 'model', 'σ', 'μ', 'ρ', 'β', 'α'];
        if (mathTerms.some(term => lowerMessage.includes(term))) {
            return "I can help with mathematical models! Try asking about specific concepts like: 'Black-Scholes formula', 'delta calculation', 'GARCH model parameters', or 'Monte Carlo simulation for cocoa'";
        }
        
        // Default quantitative response
        return "I focus on quantitative cocoa risk analysis. Could you ask about:\n1. Pricing models (Black-Scholes, binomial)\n2. Risk metrics (Greeks, VaR, CVaR)\n3. Hedging strategies (delta, gamma, volatility)\n4. Ghana market specifics\n5. Mathematical derivations\n\nOr try: 'Explain delta hedging with transaction costs' or 'How to calculate cocoa option Greeks'";
    }
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
    
    setupAnimations() {
        // Animate numbers on homepage
        this.animateNumbers();
        
        // Setup scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.feature-card, .step, .stat-card').forEach(el => {
            observer.observe(el);
        });
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
            });
            
            observer.observe(counter);
        });
    }
    
    setupEventListeners() {
        // Fix all button functionality
        this.fixButtonFunctionality();
        
        // Fix research paper button
        const researchBtn = document.querySelector('a[href="research.html"]');
        if (researchBtn) {
            researchBtn.addEventListener('click', (e) => {
                if (window.location.pathname.includes('index.html')) {
                    window.location.href = 'research.html';
                }
            });
        }
        
        // Fix API try buttons
        document.querySelectorAll('.try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const endpoint = e.target.closest('.endpoint').querySelector('code').textContent;
                this.tryAPIEndpoint(endpoint);
            });
        });
        
        // Fix calculator simulator button
        const runSimulationBtn = document.getElementById('runSimulation');
        if (runSimulationBtn) {
            runSimulationBtn.addEventListener('click', () => {
                if (typeof CocoaHedgingSimulator !== 'undefined') {
                    const simulator = new CocoaHedgingSimulator();
                    simulator.runSimulation();
                } else {
                    console.error('CocoaHedgingSimulator not found');
                }
            });
        }
    }
    
    fixButtonFunctionality() {
        // Fix all broken buttons and links
        const brokenSelectors = [
            '.btn[href="#"]',
            'a:not([href])',
            'button:not([type])',
            '.feature-link',
            '.download-btn',
            '.preview-btn',
            '.request-btn'
        ];
        
        brokenSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.hasAttribute('onclick') && !element.classList.contains('fixed')) {
                    element.classList.add('fixed');
                    
                    if (element.classList.contains('feature-link')) {
                        element.addEventListener('click', (e) => {
                            e.preventDefault();
                            const target = element.getAttribute('href');
                            if (target) {
                                window.location.href = target;
                            }
                        });
                    }
                    
                    if (element.classList.contains('download-btn')) {
                        element.addEventListener('click', () => {
                            this.showNotification('Download simulation data', 'info');
                        });
                    }
                }
            });
        });
    }
    
    setupAPIFunctions() {
        // API key functionality
        const copyApiKeyBtn = document.getElementById('copyApiKey');
        if (copyApiKeyBtn) {
            copyApiKeyBtn.addEventListener('click', () => {
                const apiKey = document.getElementById('apiKeyValue')?.textContent;
                if (apiKey) {
                    navigator.clipboard.writeText(apiKey)
                        .then(() => this.showNotification('API key copied', 'success'))
                        .catch(() => this.showNotification('Failed to copy', 'error'));
                }
            });
        }
        
        const regenerateApiKeyBtn = document.getElementById('regenerateApiKey');
        if (regenerateApiKeyBtn) {
            regenerateApiKeyBtn.addEventListener('click', () => {
                if (confirm('Regenerate API key? Old key will be invalidated.')) {
                    const newKey = 'cdrl_sk_live_' + Math.random().toString(36).substr(2, 24);
                    document.getElementById('apiKeyValue').textContent = newKey;
                    this.showNotification('API key regenerated', 'success');
                }
            });
        }
    }
    
    tryAPIEndpoint(endpoint) {
        const endpoints = {
            '/api/v1/prices/historical': {
                method: 'GET',
                description: 'Historical price data',
                sampleResponse: {
                    "symbol": "COCOA",
                    "prices": [
                        {"date": "2024-01-01", "price": 3820.50},
                        {"date": "2024-01-02", "price": 3835.75}
                    ]
                }
            },
            '/api/v1/prices/realtime': {
                method: 'GET',
                description: 'Real-time price feed',
                sampleResponse: {
                    "symbol": "COCOA",
                    "price": 3842.50,
                    "change": 2.3,
                    "timestamp": new Date().toISOString()
                }
            },
            '/api/v1/options/chain': {
                method: 'GET',
                description: 'Options chain data',
                sampleResponse: {
                    "expiry": "2024-03-31",
                    "strikes": [
                        {"strike": 3800, "call": 125.50, "put": 85.25}
                    ]
                }
            },
            '/api/v1/volatility/surface': {
                method: 'GET',
                description: 'Volatility surface data',
                sampleResponse: {
                    "maturities": [30, 60, 90],
                    "strikes": [0.9, 1.0, 1.1],
                    "volatility": [[0.32, 0.30, 0.35], [0.31, 0.29, 0.34]]
                }
            }
        };
        
        const endpointData = endpoints[endpoint];
        if (endpointData) {
            const modalContent = `
                <h3>API Test: ${endpoint}</h3>
                <p><strong>Method:</strong> ${endpointData.method}</p>
                <p><strong>Description:</strong> ${endpointData.description}</p>
                
                <h4>Sample Request:</h4>
                <pre><code>curl -X GET "https://api.cocoa-lab.gh${endpoint}?api_key=YOUR_API_KEY"</code></pre>
                
                <h4>Sample Response:</h4>
                <pre><code>${JSON.stringify(endpointData.sampleResponse, null, 2)}</code></pre>
                
                <div class="modal-actions">
                    <button class="btn btn-primary copy-response">Copy Response</button>
                    <button class="btn btn-secondary close-modal">Close</button>
                </div>
            `;
            
            this.showModal('API Test Console', modalContent);
            
            // Add copy functionality
            document.querySelector('.copy-response')?.addEventListener('click', () => {
                navigator.clipboard.writeText(JSON.stringify(endpointData.sampleResponse, null, 2))
                    .then(() => this.showNotification('Response copied to clipboard', 'success'));
            });
        }
    }
    
    initializeComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize notifications system
        this.initializeNotifications();
        
        // Initialize data updates
        this.initializeDataUpdates();
        
        // Fix homepage layout
        this.fixHomepageLayout();
    }
    
    fixHomepageLayout() {
        // Ensure all homepage sections are visible
        const sections = ['hero', 'features', 'impact-section', 'quickstart-section'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.zIndex = '1';
            }
        });
        
        // Fix hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.background = 'linear-gradient(135deg, #006B3F 0%, #00704a 100%)';
            hero.style.position = 'relative';
            hero.style.zIndex = '1';
        }
        
        // Fix navigation visibility
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.style.color = 'var(--text-primary)';
            link.style.fontWeight = '500';
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
        });
    }
    
    initializeNotifications() {
        window.showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `global-notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                 type === 'error' ? 'exclamation-circle' : 
                                 type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        };
    }
    
    initializeDataUpdates() {
        // Update live data every 10 seconds
        setInterval(() => {
            this.updateLiveData();
        }, 10000);
    }
    
    updateLiveData() {
        // Update live prices
        const priceElements = document.querySelectorAll('.live-price');
        priceElements.forEach(el => {
            const current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 3842.50;
            const change = (Math.random() - 0.5) * 0.01 * current;
            const newPrice = current + change;
            el.textContent = `$${newPrice.toFixed(2)}`;
        });
        
        // Update timestamps
        const timestampElements = document.querySelectorAll('.live-timestamp, .timestamp');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
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
            <div class="custom-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
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
        
        // Add close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.querySelector('.custom-modal').remove();
        });
        
        modal.querySelector('.custom-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('custom-modal')) {
                e.target.remove();
            }
        });
        
        // Add close button listener if exists
        modal.querySelector('.close-modal')?.addEventListener('click', () => {
            document.querySelector('.custom-modal').remove();
        });
    }
    
    // Utility functions
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
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
    new CorePlatform();
});
