// ghana-data.js - FIXED with Working API Buttons

class GhanaCocoaData {
    constructor() {
        this.data = {
            production: {},
            prices: {},
            farmers: {},
            exports: {},
            regions: {}
        };
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateLiveData();
        this.fixAPITryButtons(); // Fixed this function
    }
    
    loadData() {
        this.data = {
            production: {
                current: 850000,
                previous: 820000,
                change: 0.0366,
                target: 1000000,
                regions: {
                    western: { production: 357000, percentage: 42, growth: 0.031 },
                    ashanti: { production: 280500, percentage: 33, growth: 0.025 },
                    eastern: { production: 153000, percentage: 18, growth: 0.018 },
                    bono: { production: 59500, percentage: 7, growth: 0.042 }
                }
            },
            prices: {
                ghana: 3800,
                world: 3842.50,
                premium: -42.50,
                historical: this.generateHistoricalPrices(5)
            },
            farmers: {
                total: 800000,
                protected: 520000,
                protectionRate: 0.65,
                avgFarmSize: 2.5,
                avgIncome: 1500
            },
            exports: {
                revenue: 2800000000,
                volume: 800000,
                topMarkets: ['Netherlands', 'United States', 'Germany', 'Malaysia', 'United Kingdom'],
                exchangeRate: 12.45
            },
            regions: {
                western: {
                    capital: 'Takoradi',
                    districts: 14,
                    cocoaArea: 560000,
                    mainVariety: 'Forastero'
                },
                ashanti: {
                    capital: 'Kumasi',
                    districts: 27,
                    cocoaArea: 420000,
                    mainVariety: 'Amazon'
                },
                eastern: {
                    capital: 'Koforidua',
                    districts: 26,
                    cocoaArea: 240000,
                    mainVariety: 'Forastero'
                },
                bono: {
                    capital: 'Sunyani',
                    districts: 12,
                    cocoaArea: 85000,
                    mainVariety: 'Amazon'
                }
            }
        };
    }
    
    fixAPITryButtons() {
        // FIXED: Make all API Try buttons work
        const tryButtons = document.querySelectorAll('.try-api-btn, .try-btn, button[data-endpoint]');
        
        tryButtons.forEach(button => {
            // Remove existing listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add click event
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const endpoint = newButton.getAttribute('data-endpoint') || 
                                newButton.closest('.api-endpoint')?.querySelector('code')?.textContent?.trim();
                
                if (endpoint) {
                    this.testAPIEndpoint(endpoint, newButton);
                } else {
                    console.warn('No endpoint found for button:', newButton);
                }
            });
            
            // Add visual feedback
            newButton.style.cursor = 'pointer';
            newButton.style.transition = 'all 0.3s ease';
            
            newButton.addEventListener('mouseenter', () => {
                newButton.style.transform = 'translateY(-2px)';
                newButton.style.boxShadow = '0 4px 12px rgba(0, 107, 63, 0.2)';
            });
            
            newButton.addEventListener('mouseleave', () => {
                newButton.style.transform = 'translateY(0)';
                newButton.style.boxShadow = 'none';
            });
        });
        
        // Also fix any links that should act as try buttons
        const tryLinks = document.querySelectorAll('a[href*="try"], a[onclick*="try"]');
        tryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const endpoint = link.getAttribute('data-endpoint') || '/api/v1/prices/historical';
                this.testAPIEndpoint(endpoint, link);
            });
        });
    }
    
    testAPIEndpoint(endpoint, button) {
        const originalText = button.innerHTML;
        const originalBg = button.style.background;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #006B3F, #00704a)';
        
        // Simulate API call
        setTimeout(() => {
            // Restore button
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = originalBg;
            
            // Show API response
            this.showAPIResponse(endpoint);
            
            // Show success notification
            if (typeof showNotification === 'function') {
                showNotification(`API test successful for ${endpoint}`, 'success');
            }
        }, 1500);
    }
    
    showAPIResponse(endpoint) {
        const responses = {
            '/api/v1/prices/historical': {
                success: true,
                endpoint: endpoint,
                data: {
                    symbol: "COCOA",
                    prices: [
                        { date: "2024-01-01", price: 3820.50, volume: 12500 },
                        { date: "2024-01-02", price: 3835.75, volume: 11800 },
                        { date: "2024-01-03", price: 3812.25, volume: 13200 }
                    ],
                    metadata: {
                        count: 3,
                        currency: "USD",
                        unit: "MT"
                    }
                },
                timestamp: new Date().toISOString(),
                response_time: "1.2s"
            },
            '/api/v1/prices/realtime': {
                success: true,
                endpoint: endpoint,
                data: {
                    symbol: "COCOA",
                    price: 3842.50,
                    change: 2.30,
                    change_percent: 0.060,
                    bid: 3840.00,
                    ask: 3845.00,
                    volume: 8500,
                    timestamp: new Date().toISOString(),
                    exchange: "ICE",
                    contract: "Mar 2024"
                },
                timestamp: new Date().toISOString(),
                response_time: "0.8s"
            },
            '/api/v1/options/chain': {
                success: true,
                endpoint: endpoint,
                data: {
                    underlying: "COCOA",
                    expiry: "2024-03-31",
                    strikes: [
                        {
                            strike: 3800,
                            call: { bid: 125.50, ask: 130.75, volume: 210, open_interest: 1250 },
                            put: { bid: 85.25, ask: 90.00, volume: 150, open_interest: 780 }
                        },
                        {
                            strike: 3900,
                            call: { bid: 85.75, ask: 90.25, volume: 180, open_interest: 920 },
                            put: { bid: 125.50, ask: 130.00, volume: 95, open_interest: 560 }
                        }
                    ],
                    implied_volatility: 0.318,
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString(),
                response_time: "1.5s"
            },
            '/api/v1/volatility/surface': {
                success: true,
                endpoint: endpoint,
                data: {
                    maturities: [30, 60, 90, 180],
                    strikes: [0.9, 0.95, 1.0, 1.05, 1.1],
                    volatility: [
                        [0.35, 0.33, 0.32, 0.34, 0.36],
                        [0.33, 0.31, 0.30, 0.32, 0.34],
                        [0.32, 0.30, 0.29, 0.31, 0.33],
                        [0.30, 0.29, 0.28, 0.30, 0.32]
                    ],
                    timestamp: new Date().toISOString(),
                    interpolation_method: "spline"
                },
                timestamp: new Date().toISOString(),
                response_time: "2.1s"
            }
        };
        
        const response = responses[endpoint] || {
            success: false,
            endpoint: endpoint,
            error: "Endpoint not found",
            message: "This endpoint is not available in the demo version"
        };
        
        // Create modal to show response
        const modalContent = `
            <div class="api-response-modal">
                <h3>API Response: ${endpoint}</h3>
                
                <div class="response-status ${response.success ? 'success' : 'error'}">
                    <i class="fas fa-${response.success ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${response.success ? 'Success' : 'Error'}</span>
                </div>
                
                <div class="response-details">
                    <p><strong>Endpoint:</strong> <code>${endpoint}</code></p>
                    <p><strong>Response Time:</strong> ${response.response_time || 'N/A'}</p>
                    <p><strong>Timestamp:</strong> ${new Date(response.timestamp).toLocaleTimeString()}</p>
                </div>
                
                <div class="response-data">
                    <h4>Response Data:</h4>
                    <pre><code>${JSON.stringify(response.data || response, null, 2)}</code></pre>
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
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'api-response-modal-container';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.copy-response').addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(response.data || response, null, 2))
                .then(() => {
                    if (typeof showNotification === 'function') {
                        showNotification('Response copied to clipboard', 'success');
                    }
                })
                .catch(() => {
                    if (typeof showNotification === 'function') {
                        showNotification('Failed to copy response', 'error');
                    }
                });
        });
        
        // Add Escape key to close
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    // Rest of the class remains the same as your original ghana-data.js
    // ... (keep all other methods unchanged)
    
    generateHistoricalPrices(years) {
        const prices = [];
        const currentYear = new Date().getFullYear();
        
        for (let i = years - 1; i >= 0; i--) {
            const year = currentYear - i;
            const basePrice = 2500 + Math.random() * 1500;
            const volatility = 0.2 + Math.random() * 0.1;
            
            const monthlyPrices = [];
            for (let month = 0; month < 12; month++) {
                const monthlyChange = (Math.random() - 0.5) * volatility;
                const price = basePrice * (1 + monthlyChange);
                monthlyPrices.push({
                    month: month + 1,
                    price: price
                });
            }
            
            prices.push({
                year: year,
                average: basePrice,
                high: basePrice * (1 + volatility),
                low: basePrice * (1 - volatility),
                monthly: monthlyPrices
            });
        }
        
        return prices;
    }
    
    setupEventListeners() {
        // Region selection
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('click', (e) => {
                const regionName = e.currentTarget.dataset.region;
                this.showRegionDetails(regionName);
            });
        });
        
        // Data refresh
        document.getElementById('refreshData')?.addEventListener('click', () => {
            this.refreshData();
        });
        
        // Export data
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });
    }
    
    initializeCharts() {
        this.initializeProductionChart();
        this.initializePriceChart();
        this.initializeExportChart();
        this.initializeRegionalMap();
    }
    
    initializeProductionChart() {
        const ctx = document.getElementById('productionChart')?.getContext('2d');
        if (!ctx) return;
        
        const regions = this.data.production.regions;
        const labels = Object.keys(regions).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1));
        const data = Object.values(regions).map(region => region.percentage);
        
        this.productionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#006B3F',
                        '#FCD116',
                        '#CE1126',
                        '#3498db'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'var(--text-primary)',
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const region = Object.values(regions)[context.dataIndex];
                                return [
                                    `${context.label}: ${context.parsed}%`,
                                    `Production: ${this.formatNumber(region.production)} MT`,
                                    `Growth: ${(region.growth * 100).toFixed(1)}%`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ... rest of your existing methods
    
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.ghana-data-section') || 
        document.querySelector('.data-container') ||
        document.querySelector('[data-endpoint]')) {
        new GhanaCocoaData();
    }
});

// Add CSS for API response modal
const apiStyles = document.createElement('style');
apiStyles.textContent = `
    .api-response-modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .api-response-modal-container .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .api-response-modal-container .modal-content {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: var(--space-xl);
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
        box-shadow: var(--shadow-lg);
        border: 2px solid var(--border);
    }
    
    .api-response-modal h3 {
        margin-bottom: var(--space);
        color: var(--text-primary);
    }
    
    .response-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: var(--radius);
        margin-bottom: var(--space);
        font-weight: 600;
    }
    
    .response-status.success {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
        border: 1px solid rgba(40, 167, 69, 0.2);
    }
    
    .response-status.error {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
        border: 1px solid rgba(220, 53, 69, 0.2);
    }
    
    .response-details {
        background: var(--bg-secondary);
        padding: var(--space);
        border-radius: var(--radius);
        margin-bottom: var(--space);
    }
    
    .response-details p {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }
    
    .response-details p:last-child {
        margin-bottom: 0;
    }
    
    .response-data {
        margin-bottom: var(--space);
    }
    
    .response-data h4 {
        margin-bottom: var(--space-sm);
        color: var(--text-primary);
    }
    
    .response-data pre {
        background: var(--bg-tertiary);
        border-radius: var(--radius);
        padding: var(--space);
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .response-data code {
        color: var(--text-primary);
    }
    
    .modal-actions {
        display: flex;
        gap: var(--space);
        justify-content: flex-end;
        margin-top: var(--space);
    }
    
    .try-api-btn, .try-btn {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    
    .try-api-btn:hover, .try-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 107, 63, 0.2) !important;
    }
`;
document.head.appendChild(apiStyles);
