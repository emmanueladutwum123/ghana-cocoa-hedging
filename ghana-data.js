// ghana-data.js - Ghana-specific market data and analytics

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
    }
    
    loadData() {
        // Load Ghana-specific cocoa data
        this.data = {
            production: {
                current: 850000, // MT
                previous: 820000,
                change: 0.0366, // 3.66%
                target: 1000000,
                regions: {
                    western: { production: 357000, percentage: 42, growth: 0.031 },
                    ashanti: { production: 280500, percentage: 33, growth: 0.025 },
                    eastern: { production: 153000, percentage: 18, growth: 0.018 },
                    bono: { production: 59500, percentage: 7, growth: 0.042 }
                }
            },
            prices: {
                ghana: 3800, // $/MT
                world: 3842.50,
                premium: -42.50, // Ghana discount
                historical: this.generateHistoricalPrices(5)
            },
            farmers: {
                total: 800000,
                protected: 520000,
                protectionRate: 0.65,
                avgFarmSize: 2.5, // hectares
                avgIncome: 1500 // USD/year
            },
            exports: {
                revenue: 2800000000, // $2.8B
                volume: 800000, // MT
                topMarkets: ['Netherlands', 'United States', 'Germany', 'Malaysia', 'United Kingdom'],
                exchangeRate: 12.45 // GHS/USD
            },
            regions: {
                western: {
                    capital: 'Takoradi',
                    districts: 14,
                    cocoaArea: 560000, // hectares
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
    
    generateHistoricalPrices(years) {
        const prices = [];
        const currentYear = new Date().getFullYear();
        
        for (let i = years - 1; i >= 0; i--) {
            const year = currentYear - i;
            const basePrice = 2500 + Math.random() * 1500;
            const volatility = 0.2 + Math.random() * 0.1;
            
            // Generate monthly prices for each year
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
        document.querySelectorAll('.region')?.forEach(region => {
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
        // Production distribution chart
        this.initializeProductionChart();
        
        // Price comparison chart
        this.initializePriceChart();
        
        // Export revenue chart
        this.initializeExportChart();
        
        // Regional map visualization
        this.initializeRegionalMap();
    }
    
    initializeProductionChart() {
        const ctx = document.getElementById('productionChart')?.getContext('2d');
        if (!ctx) return;
        
        const regions = this.data.production.regions;
        const labels = Object.keys(regions).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1));
        const data = Object.values(regions).map(region => region.percentage);
        const growth = Object.values(regions).map(region => region.growth * 100);
        
        this.productionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#006B3F', // Green
                        '#FCD116', // Yellow
                        '#CE1126', // Red
                        '#3498db'  // Blue
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
                            font: {
                                size: 12
                            }
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
    
    initializePriceChart() {
        const ctx = document.getElementById('priceComparisonChart')?.getContext('2d');
        if (!ctx) return;
        
        const historical = this.data.prices.historical;
        const labels = historical.map(item => item.year);
        const ghanaPrices = historical.map(item => item.average * 0.99); // Ghana typically at discount
        const worldPrices = historical.map(item => item.average);
        
        this.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ghana Price',
                        data: ghanaPrices,
                        borderColor: '#006B3F',
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'World Price',
                        data: worldPrices,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: value => `$${this.formatNumber(value)}`
                        }
                    }
                }
            }
        });
    }
    
    initializeExportChart() {
        const ctx = document.getElementById('exportChart')?.getContext('2d');
        if (!ctx) return;
        
        // Create canvas if it doesn't exist
        if (!document.getElementById('exportChart')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'exportChart';
            document.querySelector('.ghana-charts')?.appendChild(canvas);
        }
        
        const markets = this.data.exports.topMarkets;
        const marketShares = [35, 25, 15, 12, 13]; // Estimated percentages
        
        this.exportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: markets,
                datasets: [{
                    label: 'Market Share (%)',
                    data: marketShares,
                    backgroundColor: [
                        '#006B3F',
                        '#FCD116',
                        '#CE1126',
                        '#3498db',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            callback: value => `${value}%`
                        }
                    }
                }
            }
        });
    }
    
    initializeRegionalMap() {
        // This would typically use a proper mapping library
        // For now, we'll just highlight regions on click
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('mouseenter', (e) => {
                const regionName = e.currentTarget.dataset.region;
                this.highlightRegion(regionName);
            });
            
            region.addEventListener('mouseleave', () => {
                this.resetRegionHighlights();
            });
        });
    }
    
    highlightRegion(regionName) {
        document.querySelectorAll('.region').forEach(region => {
            if (region.dataset.region === regionName) {
                region.style.backgroundColor = 'rgba(0, 107, 63, 0.3)';
                region.style.transform = 'scale(1.05)';
            } else {
                region.style.opacity = '0.7';
            }
        });
    }
    
    resetRegionHighlights() {
        document.querySelectorAll('.region').forEach(region => {
            region.style.backgroundColor = '';
            region.style.transform = '';
            region.style.opacity = '';
        });
    }
    
    showRegionDetails(regionName) {
        const region = this.data.regions[regionName];
        const production = this.data.production.regions[regionName];
        
        const details = `
            <div class="region-details">
                <h3>${this.capitalizeFirst(regionName)} Region</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Capital:</span>
                        <span class="detail-value">${region.capital}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Districts:</span>
                        <span class="detail-value">${region.districts}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Cocoa Area:</span>
                        <span class="detail-value">${this.formatNumber(region.cocoaArea)} hectares</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Production:</span>
                        <span class="detail-value">${this.formatNumber(production.production)} MT (${production.percentage}%)</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Growth Rate:</span>
                        <span class="detail-value">${(production.growth * 100).toFixed(1)}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Main Variety:</span>
                        <span class="detail-value">${region.mainVariety}</span>
                    </div>
                </div>
                <div class="region-insights">
                    <h4>Key Insights:</h4>
                    <ul>
                        <li>${this.getRegionInsight(regionName)}</li>
                        <li>Accounts for ${production.percentage}% of national production</li>
                        <li>Annual growth rate of ${(production.growth * 100).toFixed(1)}%</li>
                        <li>Average farm size: 2.5 hectares</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Show in modal or dedicated section
        this.showModal('Region Details', details);
    }
    
    getRegionInsight(regionName) {
        const insights = {
            western: "Largest cocoa producing region with optimal growing conditions",
            ashanti: "Historical cocoa heartland with established farming communities",
            eastern: "Diverse agricultural region with mixed cropping systems",
            bono: "Emerging cocoa region with high growth potential"
        };
        return insights[regionName] || "Important cocoa producing region in Ghana";
    }
    
    updateLiveData() {
        // Update statistics displays
        this.updateStatistics();
        
        // Update exchange rate
        this.updateExchangeRate();
        
        // Update farmer statistics
        this.updateFarmerStats();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateExchangeRate();
        }, 30000); // Update every 30 seconds
    }
    
    updateStatistics() {
        // Production stats
        document.querySelectorAll('.stat-value').forEach(element => {
            if (element.textContent.includes('MT')) {
                const parent = element.closest('.stat-content');
                const label = parent?.querySelector('.stat-label');
                if (label?.textContent.includes('Production')) {
                    element.textContent = `${this.formatNumber(this.data.production.current)} MT`;
                    
                    // Update change indicator
                    const changeElement = parent?.querySelector('.stat-change');
                    if (changeElement) {
                        const change = this.data.production.change * 100;
                        changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}% YoY`;
                        changeElement.className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
                    }
                }
            }
        });
        
        // Export revenue
        document.querySelectorAll('.stat-value').forEach(element => {
            if (element.textContent.includes('$')) {
                const parent = element.closest('.stat-content');
                const label = parent?.querySelector('.stat-label');
                if (label?.textContent.includes('Export')) {
                    const revenue = this.data.exports.revenue;
                    if (revenue >= 1000000000) {
                        element.textContent = `$${(revenue / 1000000000).toFixed(1)}B`;
                    } else {
                        element.textContent = `$${this.formatNumber(revenue)}`;
                    }
                    
                    // Calculate growth (simulated)
                    const growth = 0.12; // 12% YoY
                    const changeElement = parent?.querySelector('.stat-change');
                    if (changeElement) {
                        changeElement.textContent = `${growth >= 0 ? '+' : ''}${(growth * 100).toFixed(0)}% YoY`;
                        changeElement.className = `stat-change ${growth >= 0 ? 'positive' : 'negative'}`;
                    }
                }
            }
        });
    }
    
    updateExchangeRate() {
        // Simulate exchange rate fluctuations
        const currentRate = this.data.exports.exchangeRate;
        const change = (Math.random() - 0.5) * 0.002; // ±0.2%
        const newRate = currentRate * (1 + change);
        this.data.exports.exchangeRate = newRate;
        
        // Update display
        document.querySelectorAll('.stat-value').forEach(element => {
            if (element.textContent.includes('₵')) {
                const parent = element.closest('.stat-content');
                const label = parent?.querySelector('.stat-label');
                if (label?.textContent.includes('GHS/USD')) {
                    element.textContent = `₵${newRate.toFixed(2)}`;
                    
                    const changeElement = parent?.querySelector('.stat-change');
                    if (changeElement) {
                        changeElement.textContent = `${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}% Today`;
                        changeElement.className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
                    }
                }
            }
        });
    }
    
    updateFarmerStats() {
        // Update farmer statistics
        const farmerElements = document.querySelectorAll('.stat-value');
        farmerElements.forEach(element => {
            const parent = element.closest('.stat-content');
            const label = parent?.querySelector('.stat-label');
            
            if (label?.textContent.includes('Farmers')) {
                if (label.textContent.includes('Protected')) {
                    element.textContent = `${this.formatNumber(this.data.farmers.protected)}+`;
                } else if (label.textContent.includes('Farmers')) {
                    element.textContent = `${this.formatNumber(this.data.farmers.total)}+`;
                }
                
                const changeElement = parent?.querySelector('.stat-change');
                if (changeElement) {
                    if (label.textContent.includes('Protected')) {
                        changeElement.textContent = 'Price Support Active';
                        changeElement.className = 'stat-change neutral';
                    } else {
                        changeElement.textContent = 'Stable';
                        changeElement.className = 'stat-change neutral';
                    }
                }
            }
        });
    }
    
    refreshData() {
        const button = document.getElementById('refreshData');
        const originalText = button?.innerHTML;
        
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            button.disabled = true;
        }
        
        // Simulate data refresh
        setTimeout(() => {
            // Update prices with random changes
            const priceChange = (Math.random() - 0.5) * 0.02;
            this.data.prices.ghana = this.data.prices.ghana * (1 + priceChange);
            this.data.prices.world = this.data.prices.world * (1 + priceChange);
            
            // Update production with small random change
            const productionChange = (Math.random() - 0.5) * 0.005;
            this.data.production.current = this.data.production.current * (1 + productionChange);
            
            // Update exchange rate
            this.updateExchangeRate();
            
            // Update charts
            this.updateCharts();
            
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
            
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1500);
    }
    
    updateCharts() {
        // Update production chart
        if (this.productionChart) {
            const regions = this.data.production.regions;
            const data = Object.values(regions).map(region => region.percentage);
            this.productionChart.data.datasets[0].data = data;
            this.productionChart.update();
        }
        
        // Update price chart with new data point
        if (this.priceChart) {
            const currentYear = new Date().getFullYear();
            const lastYearData = this.data.prices.historical[this.data.prices.historical.length - 1];
            
            if (lastYearData.year === currentYear) {
                // Update current year's data
                lastYearData.average = this.data.prices.world;
            } else {
                // Add new year
                this.data.prices.historical.push({
                    year: currentYear,
                    average: this.data.prices.world,
                    high: this.data.prices.world * 1.1,
                    low: this.data.prices.world * 0.9,
                    monthly: []
                });
                
                // Keep only last 5 years
                if (this.data.prices.historical.length > 5) {
                    this.data.prices.historical.shift();
                }
            }
            
            // Update chart data
            const labels = this.data.prices.historical.map(item => item.year);
            const ghanaPrices = this.data.prices.historical.map(item => item.average * 0.99);
            const worldPrices = this.data.prices.historical.map(item => item.average);
            
            this.priceChart.data.labels = labels;
            this.priceChart.data.datasets[0].data = ghanaPrices;
            this.priceChart.data.datasets[1].data = worldPrices;
            this.priceChart.update();
        }
    }
    
    exportData() {
        const exportData = {
            metadata: {
                source: 'Ghana Cocoa Derivatives Lab',
                lastUpdated: new Date().toISOString(),
                region: 'Ghana'
            },
            production: this.data.production,
            prices: this.data.prices,
            farmers: this.data.farmers,
            exports: this.data.exports,
            regions: this.data.regions
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ghana-cocoa-data-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }
    
    showModal(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.ghana-modal');
        if (existingModal) existingModal.remove();
        
        const modalHTML = `
            <div class="ghana-modal">
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
        
        // Add close event
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.querySelector('.ghana-modal').remove();
        });
        
        // Close on background click
        modal.querySelector('.ghana-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('ghana-modal')) {
                e.target.remove();
            }
        });
    }
    
    // Utility functions
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize Ghana data when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.ghana-data-section') || 
        document.querySelector('.insights-section') ||
        document.querySelector('.impact-section')) {
        new GhanaCocoaData();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GhanaCocoaData;
}
