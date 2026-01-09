// Cocoa Derivatives Research Platform - Main JavaScript
class CocoaResearchPlatform {
    constructor() {
        this.initializePlatform();
    }
    
    initializePlatform() {
        this.setupNavigation();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateLiveData();
    }
    
    setupNavigation() {
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Mobile menu toggle (if needed)
        this.setupMobileMenu();
    }
    
    setupMobileMenu() {
        // Add mobile menu toggle if needed
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768 && navLinks) {
            const menuToggle = document.createElement('button');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.className = 'menu-toggle';
            document.querySelector('.nav-container').appendChild(menuToggle);
            
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }
    }
    
    setupEventListeners() {
        // Setup any global event listeners
        this.setupTooltips();
        this.setupCopyButtons();
    }
    
    setupTooltips() {
        // Simple tooltip implementation
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.dataset.tooltip;
                this.showTooltip(e, tooltipText);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    showTooltip(event, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0,0,0,0.9)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '0.875rem';
        tooltip.style.pointerEvents = 'none';
        
        document.body.appendChild(tooltip);
        
        const x = event.clientX + 10;
        const y = event.clientY + 10;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        
        this.currentTooltip = tooltip;
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
    
    setupCopyButtons() {
        // Setup copy buttons for code snippets
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.closest('.code-block').querySelector('code').textContent;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            });
        });
    }
    
    initializeCharts() {
        // Initialize any charts on the page
        if (typeof Chart !== 'undefined') {
            this.initializePriceCharts();
        }
    }
    
    initializePriceCharts() {
        // Initialize price charts if they exist on the page
        const priceCharts = document.querySelectorAll('.price-chart');
        priceCharts.forEach(chart => {
            // Chart initialization logic here
        });
    }
    
    updateLiveData() {
        // Simulate live data updates
        if (document.querySelector('.ticker-item')) {
            setInterval(() => {
                this.updateTickerData();
            }, 5000);
        }
    }
    
    updateTickerData() {
        const tickers = document.querySelectorAll('.ticker-item');
        tickers.forEach(ticker => {
            const valueElement = ticker.querySelector('strong');
            const changeElement = ticker.querySelector('.change');
            
            if (valueElement && changeElement) {
                let currentValue = parseFloat(valueElement.textContent.replace(/[$,%]/g, ''));
                const changePercent = (Math.random() - 0.5) * 0.5;
                const changeValue = currentValue * (changePercent / 100);
                const newValue = currentValue + changeValue;
                
                // Update value
                if (ticker.textContent.includes('$')) {
                    valueElement.textContent = `$${newValue.toFixed(2)}`;
                } else {
                    valueElement.textContent = `${newValue.toFixed(1)}%`;
                }
                
                // Update change indicator
                changeElement.textContent = `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
                changeElement.className = `change ${changePercent > 0 ? 'positive' : 'negative'}`;
            }
        });
    }
    
    // Financial calculations
    calculateBlackScholes(S, K, T, sigma, r, optionType) {
        const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        const normCDF = x => (1 + this.erf(x / Math.sqrt(2))) / 2;
        const normPDF = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
        
        let price, delta;
        
        if (optionType === 'call') {
            price = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
            delta = normCDF(d1);
        } else {
            price = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
            delta = normCDF(d1) - 1;
        }
        
        return { price, delta };
    }
    
    erf(x) {
        // Error function approximation
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        
        const sign = Math.sign(x);
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }
    
    // Export functionality
    exportToCSV(data, filename = 'cocoa_data.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // Format currency
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    }
    
    // Format percentage
    formatPercent(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2
        }).format(value);
    }
}

// Initialize platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new CocoaResearchPlatform();
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
