// script.js - Core JavaScript for Ghana Cocoa Hedging Platform

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
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        }
        
        const currentTheme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update icon
        this.updateThemeIcon(currentTheme);
        
        // Toggle theme
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
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
            mobileMenuBtn.addEventListener('click', () => {
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
        const aiChat = document.getElementById('aiChat');
        
        if (aiToggle && aiAssistant) {
            // Toggle AI assistant
            aiToggle.addEventListener('click', () => {
                aiAssistant.classList.toggle('active');
                if (aiAssistant.classList.contains('active')) {
                    aiInput.focus();
                }
            });
            
            // Close AI assistant
            if (aiClose) {
                aiClose.addEventListener('click', () => {
                    aiAssistant.classList.remove('active');
                });
            }
            
            // Send message
            if (aiSend && aiInput && aiChat) {
                const sendMessage = () => {
                    const message = aiInput.value.trim();
                    if (message) {
                        // Add user message
                        this.addAIMessage(message, 'user');
                        aiInput.value = '';
                        
                        // Get AI response
                        setTimeout(() => {
                            const response = this.getAIResponse(message);
                            this.addAIMessage(response, 'ai');
                        }, 1000);
                    }
                };
                
                aiSend.addEventListener('click', sendMessage);
                aiInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            }
        }
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
        const responses = {
            'hello': "Hello! I'm your AI assistant for cocoa risk management. How can I help you today?",
            'hi': "Hi there! I'm here to help with cocoa derivatives and risk management questions.",
            'help': "I can help with:\n• Options pricing calculations\n• Delta hedging strategies\n• Market data analysis\n• Risk management techniques\n\nWhat would you like to know?",
            'price': "Current cocoa price is $3,842.50 per metric ton, up 2.3% today. Would you like to see historical trends?",
            'hedge': "Delta hedging involves offsetting price risk by taking opposite positions in the underlying asset. Would you like to run a hedging simulation?",
            'volatility': "Current implied volatility is 31.8%. Historical volatility is 28.5%. This indicates moderate market uncertainty.",
            'options': "Cocoa options are traded on ICE Futures. The Black-Scholes model is commonly used for pricing, adjusted for convenience yield.",
            'risk': "Key risks in cocoa trading include price volatility, weather events, currency fluctuations, and supply chain disruptions.",
            'ghana': "Ghana is the world's second-largest cocoa producer. COCOBOD manages pricing and quality for 800,000+ smallholder farmers.",
            'calculator': "You can access the options calculator from the main navigation. It includes Black-Scholes pricing and delta hedging simulation.",
            'dashboard': "The dashboard provides real-time market data, volatility analysis, and risk metrics for cocoa derivatives.",
            'data': "Our data center includes real-time prices from ICE Futures, COCOBOD official data, and historical prices since 2010.",
            'research': "The research library contains academic papers, policy documents, and PhD theses on cocoa derivatives.",
            'ml': "Our AI models include LSTM neural networks for price prediction (94% accuracy) and XGBoost for volatility forecasting.",
            'thanks': "You're welcome! Let me know if you need any more assistance with cocoa risk management.",
            'bye': "Goodbye! Feel free to ask if you have more questions about cocoa derivatives."
        };
        
        // Find matching response
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // Default response
        return "I'm not sure I understand. I can help with cocoa pricing, hedging strategies, risk management, and market analysis. Could you rephrase your question?";
    }
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
    
    setupAnimations() {
        // Animate numbers
        this.animateNumbers();
        
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.feature-card, .step, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateNumbers() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
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
            
            // Start animation when element is in viewport
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
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Prevent form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => e.preventDefault());
        });
        
        // Update current year in footer
        const yearElements = document.querySelectorAll('.current-year');
        if (yearElements.length > 0) {
            const currentYear = new Date().getFullYear();
            yearElements.forEach(el => {
                el.textContent = currentYear;
            });
        }
    }
    
    initializeComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize notifications
        this.initializeNotifications();
        
        // Initialize data updates
        this.initializeDataUpdates();
    }
    
    initializeTooltips() {
        // Simple tooltip implementation
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            const tooltipText = el.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            el.addEventListener('mouseenter', (e) => {
                document.body.appendChild(tooltip);
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.classList.add('visible');
            });
            
            el.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    }
    
    initializeNotifications() {
        // Global notification system
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
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
            
            // Add styles if not already present
            if (!document.querySelector('#notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'notification-styles';
                styles.textContent = `
                    .global-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: var(--bg-secondary);
                        border: 1px solid var(--border);
                        border-radius: var(--radius);
                        padding: 1rem 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        box-shadow: var(--shadow-lg);
                        z-index: 9999;
                        animation: slideIn 0.3s ease;
                    }
                    .global-notification.success {
                        border-left: 4px solid #10b981;
                    }
                    .global-notification.error {
                        border-left: 4px solid #ef4444;
                    }
                    .global-notification.warning {
                        border-left: 4px solid #f59e0b;
                    }
                    .global-notification.info {
                        border-left: 4px solid #3b82f6;
                    }
                    .global-notification.fade-out {
                        animation: slideOut 0.3s ease;
                    }
                `;
                document.head.appendChild(styles);
            }
        };
    }
    
    initializeDataUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateLiveData();
        }, 10000); // Update every 10 seconds
    }
    
    updateLiveData() {
        // Update live price displays
        const priceElements = document.querySelectorAll('.live-price');
        priceElements.forEach(el => {
            const current = parseFloat(el.textContent.replace(/[$,]/g, ''));
            const change = (Math.random() - 0.5) * 0.01 * current;
            const newPrice = current + change;
            el.textContent = `$${newPrice.toFixed(2)}`;
        });
        
        // Update timestamp
        const timestampElements = document.querySelectorAll('.live-timestamp');
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CorePlatform;
}
