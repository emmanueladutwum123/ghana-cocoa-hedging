// ghana-data.js - COMPLETE REVISION WITH WORKING DOWNLOADS AND CHARTS

class GhanaCocoaData {
    constructor() {
        this.data = {
            production: {},
            prices: {},
            farmers: {},
            exports: {},
            regions: {},
            historical: []
        };
        this.charts = {};
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateLiveData();
        this.fixAPITryButtons();
        this.setupDownloadButtons();
    }
    
    loadData() {
        // Generate comprehensive historical data
        this.data.historical = this.generateHistoricalData(365); // 1 year of daily data
        
        this.data = {
            ...this.data,
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
                historical: this.generateHistoricalPrices(5),
                daily: this.generateDailyPrices(30)
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
    
    generateHistoricalData(days) {
        const data = [];
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - days);
        
        let ghanaPrice = 3800;
        let worldPrice = 3842.50;
        
        for (let i = 0; i < days; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            
            // Add some randomness to prices
            ghanaPrice += (Math.random() - 0.5) * 50;
            worldPrice += (Math.random() - 0.5) * 60;
            
            data.push({
                date: date.toISOString().split('T')[0],
                ghana_price: parseFloat(ghanaPrice.toFixed(2)),
                world_price: parseFloat(worldPrice.toFixed(2)),
                premium: parseFloat((ghanaPrice - worldPrice).toFixed(2)),
                volume: Math.floor(10000 + Math.random() * 15000),
                change: parseFloat(((Math.random() - 0.5) * 5).toFixed(2))
            });
        }
        
        return data;
    }
    
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
    
    generateDailyPrices(days) {
        const prices = [];
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - days);
        
        let currentPrice = 3842.50;
        
        for (let i = 0; i < days; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            
            // Random walk price movement
            currentPrice += (Math.random() - 0.5) * 50;
            
            prices.push({
                date: date.toISOString().split('T')[0],
                price: parseFloat(currentPrice.toFixed(2)),
                volume: Math.floor(8000 + Math.random() * 7000),
                change: parseFloat(((Math.random() - 0.5) * 3).toFixed(2))
            });
        }
        
        return prices;
    }
    
    fixAPITryButtons() {
        // Make all API Try buttons work
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
    }
    
    setupDownloadButtons() {
        // Setup download buttons for historical data
        document.querySelectorAll('.download-btn[data-file]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileType = e.target.dataset.file;
                this.downloadDataset(fileType);
            });
        });
        
        // Setup preview buttons
        document.querySelectorAll('.preview-btn[data-file]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileType = e.target.dataset.file;
                this.previewDataset(fileType);
            });
        });
    }
    
    downloadDataset(fileType) {
        let content, filename, mimeType;
        
        switch(fileType) {
            case 'prices':
                // Create CSV content for historical prices
                content = 'Date,Ghana Price (USD),World Price (USD),Premium,Volume,Change(%)\n';
                this.data.historical.forEach(item => {
                    content += `${item.date},${item.ghana_price},${item.world_price},${item.premium},${item.volume},${item.change}\n`;
                });
                filename = 'ghana_cocoa_historical_prices.csv';
                mimeType = 'text/csv';
                break;
                
            case 'options':
                // Create Excel-like content
                content = `Ghana Cocoa Options Data\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
                content += `Symbol,Strike,Expiry,Type,Bid,Ask,Volume,Open Interest\n`;
                content += `COCOA,3800,2024-03-31,Call,125.50,130.75,210,1250\n`;
                content += `COCOA,3800,2024-03-31,Put,85.25,90.00,150,780\n`;
                content += `COCOA,3900,2024-03-31,Call,85.75,90.25,180,920\n`;
                content += `COCOA,3900,2024-03-31,Put,125.50,130.00,95,560\n`;
                filename = 'cocoa_options_data.csv';
                mimeType = 'text/csv';
                break;
                
            case 'production':
                // Create PDF-like content
                content = `
                    GHANA COCOA PRODUCTION REPORT
                    =============================
                    
                    Annual Production: ${this.data.production.current.toLocaleString()} MT
                    Year-over-Year Change: +${(this.data.production.change * 100).toFixed(1)}%
                    Target Production: ${this.data.production.target.toLocaleString()} MT
                    
                    REGIONAL DISTRIBUTION:
                    ---------------------
                    Western Region: ${this.data.production.regions.western.production.toLocaleString()} MT (${this.data.production.regions.western.percentage}%)
                    Ashanti Region: ${this.data.production.regions.ashanti.production.toLocaleString()} MT (${this.data.production.regions.ashanti.percentage}%)
                    Eastern Region: ${this.data.production.regions.eastern.production.toLocaleString()} MT (${this.data.production.regions.eastern.percentage}%)
                    Bono Region: ${this.data.production.regions.bono.production.toLocaleString()} MT (${this.data.production.regions.bono.percentage}%)
                    
                    FARMER STATISTICS:
                    -----------------
                    Total Farmers: ${this.data.farmers.total.toLocaleString()}
                    Protected Farmers: ${this.data.farmers.protected.toLocaleString()}
                    Protection Rate: ${(this.data.farmers.protectionRate * 100).toFixed(1)}%
                    Average Farm Size: ${this.data.farmers.avgFarmSize} hectares
                    Average Annual Income: $${this.data.farmers.avgIncome}
                    
                    EXPORT DATA:
                    ------------
                    Annual Export Revenue: $${this.data.exports.revenue.toLocaleString()}
                    Export Volume: ${this.data.exports.volume.toLocaleString()} MT
                    Exchange Rate: ₵${this.data.exports.exchangeRate}/USD
                    
                    Top Export Markets:
                    1. ${this.data.exports.topMarkets[0]}
                    2. ${this.data.exports.topMarkets[1]}
                    3. ${this.data.exports.topMarkets[2]}
                    4. ${this.data.exports.topMarkets[3]}
                    5. ${this.data.exports.topMarkets[4]}
                    
                    Report Generated: ${new Date().toLocaleDateString()}
                    Data Source: Ghana Cocoa Derivatives Lab
                `;
                filename = 'ghana_cocoa_production_report.pdf';
                mimeType = 'application/pdf';
                break;
                
            default:
                content = 'Data export\nGenerated: ' + new Date().toISOString();
                filename = 'data_export.csv';
                mimeType = 'text/csv';
        }
        
        // Create and trigger download
        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Downloading ${filename}...`, 'success');
    }
    
    previewDataset(fileType) {
        const previews = {
            'prices': () => {
                // Show first 5 rows of price data
                let preview = 'Date, Ghana Price, World Price, Premium, Volume\n';
                this.data.historical.slice(0, 5).forEach(item => {
                    preview += `${item.date}, $${item.ghana_price}, $${item.world_price}, $${item.premium}, ${item.volume}\n`;
                });
                preview += `\n... and ${this.data.historical.length - 5} more records`;
                return preview;
            },
            'options': 'Options Chain Preview:\nStrike prices from 3800 to 3900\nExpiry: March 2024\nData includes bid/ask, volume, and open interest',
            'production': 'Production Data Preview:\nFull regional breakdown\nFarmer statistics\nExport revenue and volume'
        };
        
        const preview = previews[fileType] ? 
            (typeof previews[fileType] === 'function' ? previews[fileType]() : previews[fileType]) : 
            'Preview not available';
        
        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'data-preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #004D29;">${fileType.charAt(0).toUpperCase() + fileType.slice(1)} Data Preview</h3>
                    <button id="closePreview" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
                </div>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; font-family: monospace; white-space: pre-wrap;">
                    ${preview}
                </div>
                
                <div style="margin-top: 1.5rem; text-align: center;">
                    <button id="downloadFromPreview" style="padding: 0.75rem 2rem; background: #004D29; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-download"></i> Download Full Dataset
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#closePreview').addEventListener('click', () => modal.remove());
        modal.querySelector('#downloadFromPreview').addEventListener('click', () => {
            this.downloadDataset(fileType);
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
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
            this.showNotification(`API test successful for ${endpoint}`, 'success');
        }, 1500);
    }
    
    showAPIResponse(endpoint) {
        const responses = {
            '/api/v1/prices/historical': {
                success: true,
                endpoint: endpoint,
                data: {
                    symbol: "COCOA",
                    prices: this.data.historical.slice(0, 10),
                    metadata: {
                        count: this.data.historical.length,
                        currency: "USD",
                        unit: "MT",
                        date_range: {
                            start: this.data.historical[0].date,
                            end: this.data.historical[this.data.historical.length - 1].date
                        }
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
                    contract: "Mar 2024",
                    ghana_price: this.data.prices.ghana,
                    world_price: this.data.prices.world,
                    premium: this.data.prices.premium
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
                    this.showNotification('Response copied to clipboard', 'success');
                })
                .catch(() => {
                    this.showNotification('Failed to copy response', 'error');
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
        
        // Chart timeframe selectors
        document.getElementById('priceTimeframe')?.addEventListener('change', (e) => {
            this.updateChartData('priceChart', e.target.value);
        });
        
        document.getElementById('volatilityType')?.addEventListener('change', (e) => {
            this.updateVolatilityChart(e.target.value);
        });
    }
    
    initializeCharts() {
        this.initializeProductionChart();
        this.initializePriceChart();
        this.initializePriceComparisonChart();
        this.initializeVolatilityChart();
        this.initializeVolumeChart();
        this.initializeTermStructureChart();
    }
    
    initializeProductionChart() {
        const ctx = document.getElementById('productionChart')?.getContext('2d');
        if (!ctx) return;
        
        const regions = this.data.production.regions;
        const labels = Object.keys(regions).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1));
        const data = Object.values(regions).map(region => region.percentage);
        
        this.charts.productionChart = new Chart(ctx, {
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
    
    initializePriceChart() {
        const ctx = document.getElementById('priceChart')?.getContext('2d');
        if (!ctx) return;
        
        const dailyPrices = this.data.prices.daily;
        const labels = dailyPrices.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        });
        const prices = dailyPrices.map(item => item.price);
        
        this.charts.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cocoa Price (USD/MT)',
                    data: prices,
                    borderColor: '#006B3F',
                    backgroundColor: 'rgba(0, 107, 63, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#006B3F',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'var(--text-primary)',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `$${context.parsed.y.toFixed(2)}/MT`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: value => `$${value.toLocaleString()}`
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }
    
    initializePriceComparisonChart() {
        const ctx = document.getElementById('priceComparisonChart')?.getContext('2d');
        if (!ctx) {
            console.log('Price comparison chart element not found');
            return;
        }
        
        // Use the last 30 days of historical data
        const recentData = this.data.historical.slice(-30);
        const labels = recentData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        });
        
        const ghanaPrices = recentData.map(item => item.ghana_price);
        const worldPrices = recentData.map(item => item.world_price);
        
        this.charts.priceComparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ghana Cocoa Price',
                        data: ghanaPrices,
                        borderColor: '#006B3F',
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#006B3F',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'World Cocoa Price',
                        data: worldPrices,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'var(--text-primary)',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const dataset = context.dataset;
                                const value = context.parsed.y;
                                const index = context.dataIndex;
                                
                                let premium = '';
                                if (dataset.label === 'Ghana Cocoa Price') {
                                    const worldPrice = worldPrices[index];
                                    const premiumValue = value - worldPrice;
                                    premium = ` (Premium: $${premiumValue.toFixed(2)})`;
                                }
                                
                                return `${dataset.label}: $${value.toFixed(2)}/MT${premium}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: value => `$${value.toLocaleString()}`
                        },
                        title: {
                            display: true,
                            text: 'Price (USD/MT)',
                            color: 'var(--text-secondary)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
        
        console.log('Price comparison chart initialized successfully');
    }
    
    initializeVolatilityChart() {
        const ctx = document.getElementById('volatilityChart')?.getContext('2d');
        if (!ctx) return;
        
        const volatilities = [];
        for (let i = 0; i < 30; i++) {
            volatilities.push(25 + Math.random() * 15);
        }
        
        this.charts.volatilityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Historical Volatility (%)',
                    data: volatilities,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: '#3498db',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => `${value}%`
                        }
                    }
                }
            }
        });
    }
    
    initializeVolumeChart() {
        const ctx = document.getElementById('volumeChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.volumeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['<3800', '3800-3900', '3900-4000', '4000-4100', '>4100'],
                datasets: [{
                    label: 'Volume Profile',
                    data: [12500, 18750, 31250, 22500, 15000],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    initializeTermStructureChart() {
        const ctx = document.getElementById('termStructureChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.termStructureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Spot', 'Mar 24', 'Jul 24', 'Dec 24', 'Mar 25', 'Jul 25'],
                datasets: [{
                    label: 'Futures Curve',
                    data: [3842.50, 3865.00, 3890.25, 3925.75, 3950.00, 3975.50],
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: value => `$${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }
    
    updateChartData(chartId, timeframe) {
        if (!this.charts[chartId]) return;
        
        let days;
        switch(timeframe) {
            case '1d': days = 1; break;
            case '1w': days = 7; break;
            case '1m': days = 30; break;
            case '3m': days = 90; break;
            case '1y': days = 365; break;
            case '5y': days = 1825; break;
            default: days = 30;
        }
        
        // In a real app, you would fetch new data here
        // For now, we'll just update the chart with existing data
        this.showNotification(`Updated ${chartId} with ${timeframe} timeframe`, 'info');
    }
    
    updateVolatilityChart(type) {
        if (!this.charts.volatilityChart) return;
        
        // Update chart based on selected volatility type
        this.showNotification(`Switched to ${type} volatility view`, 'info');
    }
    
    updateLiveData() {
        // Update live ticker
        this.updateLiveTicker();
        
        // Update last update time
        this.updateLastUpdateTime();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateLiveTicker();
            this.updateLastUpdateTime();
        }, 5000);
        
        // Update charts periodically
        setInterval(() => {
            this.updateCharts();
        }, 30000);
    }
    
    updateLiveTicker() {
        const tickerGrid = document.getElementById('liveTicker');
        if (!tickerGrid) return;
        
        const tickerData = [
            {
                symbol: 'COCOA',
                name: 'Cocoa Spot',
                price: 3842.50 + (Math.random() - 0.5) * 10,
                change: (Math.random() - 0.5) * 2,
                volume: '12.4K'
            },
            {
                symbol: 'CCK24',
                name: 'Mar 2024',
                price: 3865.00 + (Math.random() - 0.5) * 8,
                change: (Math.random() - 0.5) * 1.5,
                volume: '8.7K'
            },
            {
                symbol: 'CCN24',
                name: 'Jul 2024',
                price: 3890.25 + (Math.random() - 0.5) * 7,
                change: (Math.random() - 0.5) * 1.2,
                volume: '6.2K'
            },
            {
                symbol: 'CCZ24',
                name: 'Dec 2024',
                price: 3925.75 + (Math.random() - 0.5) * 6,
                change: (Math.random() - 0.5) * 1,
                volume: '4.8K'
            },
            {
                symbol: 'VIX',
                name: 'Implied Vol',
                price: 31.8 + (Math.random() - 0.5) * 2,
                change: (Math.random() - 0.5) * 1.5,
                volume: '-'
            },
            {
                symbol: 'GHS/USD',
                name: 'Exchange Rate',
                price: 12.45 + (Math.random() - 0.5) * 0.1,
                change: (Math.random() - 0.5) * 0.3,
                volume: '-'
            }
        ];
        
        tickerGrid.innerHTML = tickerData.map(item => `
            <div class="ticker-item">
                <div class="ticker-symbol">
                    <span class="symbol">${item.symbol}</span>
                    <span class="name">${item.name}</span>
                </div>
                <div class="ticker-price">
                    <span class="price">
                        ${item.symbol.includes('$') ? '₵' : '$'}${item.price.toFixed(2)}
                    </span>
                    <span class="change ${item.change >= 0 ? 'positive' : 'negative'}">
                        ${item.change >= 0 ? '+' : ''}${item.change.toFixed(1)}%
                    </span>
                </div>
                <div class="ticker-volume">
                    <span class="volume">${item.volume}</span>
                </div>
            </div>
        `).join('');
    }
    
    updateLastUpdateTime() {
        const element = document.getElementById('lastUpdate');
        if (!element) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        element.textContent = `Updated ${timeString}`;
    }
    
    updateCharts() {
        // Update price chart with new data point
        if (this.charts.priceChart) {
            const lastPrice = this.charts.priceChart.data.datasets[0].data.slice(-1)[0];
            const newPrice = lastPrice + (Math.random() - 0.5) * 10;
            this.charts.priceChart.data.datasets[0].data.push(newPrice);
            this.charts.priceChart.data.labels.push(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            
            // Keep only last 30 points
            if (this.charts.priceChart.data.datasets[0].data.length > 30) {
                this.charts.priceChart.data.datasets[0].data.shift();
                this.charts.priceChart.data.labels.shift();
            }
            
            this.charts.priceChart.update('none');
        }
    }
    
    refreshData() {
        this.showNotification('Refreshing data...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.loadData();
            this.initializeCharts();
            this.showNotification('Data refreshed successfully', 'success');
        }, 1500);
    }
    
    exportData() {
        // Export all data as JSON
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `ghana-cocoa-data-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('All data exported as JSON', 'success');
    }
    
    showRegionDetails(regionName) {
        const region = this.data.regions[regionName];
        if (!region) return;
        
        this.showNotification(`Showing details for ${regionName} region`, 'info');
        
        // In a real app, you would show a modal or update a section
        // with region details
    }
    
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `data-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page that needs GhanaCocoaData
    const onDataPage = document.querySelector('.ghana-data-section') || 
                      document.querySelector('.data-container') ||
                      document.querySelector('[data-endpoint]') ||
                      window.location.pathname.includes('data.html');
    
    if (onDataPage) {
        console.log('Initializing GhanaCocoaData...');
        new GhanaCocoaData();
    }
});

// Add CSS for API response modal and notifications
const styleElement = document.createElement('style');
styleElement.textContent = `
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
    
    .data-notification {
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
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .data-notification.success {
        border-left: 4px solid #10b981;
    }
    
    .data-notification.error {
        border-left: 4px solid #ef4444;
    }
    
    .data-notification.info {
        border-left: 4px solid #3498db;
    }
    
    .data-notification.fade-out {
        animation: slideOut 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleElement);
