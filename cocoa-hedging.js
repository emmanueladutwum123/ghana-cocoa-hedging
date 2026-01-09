// cocoa-hedging.js - Advanced Cocoa Options Pricing and Delta Hedging Simulator

class CocoaHedgingSimulator {
    constructor() {
        this.currentScenario = this.getDefaultScenario();
        this.transactionHistory = [];
        this.simulationResults = null;
        this.charts = {};
        this.init();
    }
    
    init() {
        this.setupControls();
        this.initializeCharts();
        this.setupEventListeners();
        this.updateCalculations();
    }
    
    getDefaultScenario() {
        return {
            cocoaPrice: 2500,
            strikePrice: 2600,
            volatility: 0.25,
            timeToExpiry: 0.25, // 3 months
            riskFreeRate: 0.05,
            convenienceYield: 0.02,
            optionType: 'call',
            positionSize: -100,
            hedgeFrequency: 'weekly',
            transactionCost: 0.001, // 0.1%
            simulationDays: 90,
            
            // Model parameters
            model: 'black-scholes',
            useStochasticVol: false,
            useTransactionCosts: true,
            useConvenienceYield: true
        };
    }
    
    setupControls() {
        // Update slider values
        this.updateSliderValues();
        
        // Set initial option type
        document.querySelectorAll('.option-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this.currentScenario.optionType);
        });
        
        // Set initial hedge frequency
        document.getElementById('hedgeFrequency').value = this.currentScenario.hedgeFrequency;
    }
    
    updateSliderValues() {
        const sliders = [
            { id: 'cocoaPrice', valueId: 'cocoaPriceValue', format: val => `$${this.formatNumber(val)}` },
            { id: 'strikePrice', valueId: 'strikePriceValue', format: val => `$${this.formatNumber(val)}` },
            { id: 'volatility', valueId: 'volatilityValue', format: val => `${(val * 100).toFixed(1)}%` },
            { id: 'timeToExpiry', valueId: 'timeToExpiryValue', format: val => `${this.formatTimeToExpiry(val)}` },
            { id: 'positionSize', valueId: 'positionSizeValue', format: val => this.formatPositionSize(val) },
            { id: 'transactionCost', valueId: 'transactionCostValue', format: val => `${(val * 100).toFixed(2)}%` }
        ];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.valueId);
            
            if (element && valueElement) {
                element.value = this.currentScenario[slider.id];
                valueElement.textContent = slider.format(this.currentScenario[slider.id]);
            }
        });
    }
    
    initializeCharts() {
        // Price & Delta Chart
        const priceDeltaCtx = document.getElementById('priceDeltaChart')?.getContext('2d');
        if (priceDeltaCtx) {
            this.charts.priceDelta = new Chart(priceDeltaCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Cocoa Price',
                            data: [],
                            borderColor: '#006B3F',
                            backgroundColor: 'rgba(0, 107, 63, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Delta',
                            data: [],
                            borderColor: '#FCD116',
                            backgroundColor: 'rgba(252, 209, 22, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Days'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Price ($)'
                            },
                            ticks: {
                                callback: value => `$${this.formatNumber(value)}`
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Delta'
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            min: 0,
                            max: 1
                        }
                    }
                }
            });
        }
        
        // Hedging Performance Chart
        const hedgingCtx = document.getElementById('hedgingChart')?.getContext('2d');
        if (hedgingCtx) {
            this.charts.hedging = new Chart(hedgingCtx, {
                type: 'bar',
                data: {
                    labels: ['Hedging P&L', 'Transaction Costs', 'Net P&L', 'Hedging Error'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#006B3F',
                            '#3b82f6'
                        ]
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
                                callback: value => `$${this.formatNumber(value)}`
                            }
                        }
                    }
                }
            });
        }
    }
    
    setupEventListeners() {
        // Slider controls
        document.getElementById('cocoaPrice')?.addEventListener('input', (e) => {
            this.currentScenario.cocoaPrice = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('strikePrice')?.addEventListener('input', (e) => {
            this.currentScenario.strikePrice = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('volatility')?.addEventListener('input', (e) => {
            this.currentScenario.volatility = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('timeToExpiry')?.addEventListener('input', (e) => {
            this.currentScenario.timeToExpiry = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('positionSize')?.addEventListener('input', (e) => {
            this.currentScenario.positionSize = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('transactionCost')?.addEventListener('input', (e) => {
            this.currentScenario.transactionCost = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        // Option type selector
        document.querySelectorAll('.option-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.option-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentScenario.optionType = e.target.dataset.type;
                this.updateCalculations();
            });
        });
        
        // Hedge frequency
        document.getElementById('hedgeFrequency')?.addEventListener('change', (e) => {
            this.currentScenario.hedgeFrequency = e.target.value;
            this.updateCalculations();
        });
        
        // Action buttons
        document.getElementById('runSimulation')?.addEventListener('click', () => {
            this.runSimulation();
        });
        
        document.getElementById('resetSimulation')?.addEventListener('click', () => {
            this.resetSimulation();
        });
        
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('saveScenario')?.addEventListener('click', () => {
            this.saveScenario();
        });
    }
    
    updateCalculations() {
        // Update slider values display
        this.updateSliderValues();
        
        // Calculate option price and Greeks
        const calculations = this.calculateOptionPrice();
        
        // Update live results
        this.updateLiveResults(calculations);
        
        // Update Greeks display
        this.updateGreeksDisplay(calculations.greeks);
    }
    
    calculateOptionPrice() {
        const S = this.currentScenario.cocoaPrice;
        const K = this.currentScenario.strikePrice;
        const T = this.currentScenario.timeToExpiry;
        const r = this.currentScenario.riskFreeRate;
        const σ = this.currentScenario.volatility;
        const δ = this.currentScenario.convenienceYield;
        const isCall = this.currentScenario.optionType === 'call';
        
        // Calculate d1 and d2
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const d2 = d1 - σ * Math.sqrt(T);
        
        // Calculate option price
        let price;
        if (isCall) {
            price = S * Math.exp(-δ * T) * this.normCDF(d1) - K * Math.exp(-r * T) * this.normCDF(d2);
        } else {
            price = K * Math.exp(-r * T) * this.normCDF(-d2) - S * Math.exp(-δ * T) * this.normCDF(-d1);
        }
        
        // Calculate Greeks
        const greeks = {
            delta: this.calculateDelta(S, K, T, r, σ, δ, isCall),
            gamma: this.calculateGamma(S, K, T, r, σ, δ),
            theta: this.calculateTheta(S, K, T, r, σ, δ, isCall),
            vega: this.calculateVega(S, K, T, r, σ, δ),
            rho: this.calculateRho(S, K, T, r, σ, δ, isCall)
        };
        
        return {
            price: price,
            greeks: greeks,
            isITM: isCall ? S > K : S < K,
            intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
            timeValue: price - Math.max(isCall ? S - K : K - S, 0)
        };
    }
    
    // Black-Scholes Greeks calculations
    calculateDelta(S, K, T, r, σ, δ, isCall) {
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        if (isCall) {
            return Math.exp(-δ * T) * this.normCDF(d1);
        } else {
            return Math.exp(-δ * T) * (this.normCDF(d1) - 1);
        }
    }
    
    calculateGamma(S, K, T, r, σ, δ) {
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const φ = this.normPDF(d1);
        return (Math.exp(-δ * T) * φ) / (S * σ * Math.sqrt(T));
    }
    
    calculateTheta(S, K, T, r, σ, δ, isCall) {
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const d2 = d1 - σ * Math.sqrt(T);
        const φ = this.normPDF(d1);
        
        if (isCall) {
            return (-(S * σ * Math.exp(-δ * T) * φ) / (2 * Math.sqrt(T))) +
                   (δ * S * Math.exp(-δ * T) * this.normCDF(d1)) -
                   (r * K * Math.exp(-r * T) * this.normCDF(d2));
        } else {
            return (-(S * σ * Math.exp(-δ * T) * φ) / (2 * Math.sqrt(T))) -
                   (δ * S * Math.exp(-δ * T) * this.normCDF(-d1)) +
                   (r * K * Math.exp(-r * T) * this.normCDF(-d2));
        }
    }
    
    calculateVega(S, K, T, r, σ, δ) {
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const φ = this.normPDF(d1);
        return S * Math.exp(-δ * T) * φ * Math.sqrt(T);
    }
    
    calculateRho(S, K, T, r, σ, δ, isCall) {
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const d2 = d1 - σ * Math.sqrt(T);
        
        if (isCall) {
            return K * T * Math.exp(-r * T) * this.normCDF(d2);
        } else {
            return -K * T * Math.exp(-r * T) * this.normCDF(-d2);
        }
    }
    
    // Normal distribution functions
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
    
    normPDF(x) {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }
    
    updateLiveResults(calculations) {
        // Update option price
        const optionPriceElement = document.getElementById('optionPrice');
        if (optionPriceElement) {
            optionPriceElement.textContent = `$${calculations.price.toFixed(2)}`;
        }
        
        // Update delta
        const deltaElement = document.getElementById('deltaValue');
        if (deltaElement) {
            deltaElement.textContent = calculations.greeks.delta.toFixed(3);
        }
        
        // Update ITM/OTM status
        const changeElement = document.querySelector('.result-change.positive, .result-change.negative');
        if (changeElement) {
            changeElement.innerHTML = calculations.isITM ? 
                '<i class="fas fa-arrow-up"></i> ITM' : 
                '<i class="fas fa-arrow-down"></i> OTM';
            changeElement.className = `result-change ${calculations.isITM ? 'positive' : 'negative'}`;
        }
        
        // Update Greeks values
        this.updateGreeksValues(calculations.greeks);
    }
    
    updateGreeksValues(greeks) {
        document.getElementById('greekDelta')?.textContent = greeks.delta.toFixed(3);
        document.getElementById('greekGamma')?.textContent = greeks.gamma.toFixed(4);
        document.getElementById('greekTheta')?.textContent = greeks.theta.toFixed(2);
        document.getElementById('greekVega')?.textContent = greeks.vega.toFixed(1);
        document.getElementById('greekRho')?.textContent = greeks.rho.toFixed(2);
        
        // Update Greek bars
        this.updateGreekBars(greeks);
    }
    
    updateGreekBars(greeks) {
        // Normalize values for display
        const normalized = {
            delta: Math.abs(greeks.delta) * 100,
            gamma: Math.abs(greeks.gamma) * 1000,
            theta: Math.abs(greeks.theta) / 10,
            vega: greeks.vega / 1000,
            rho: Math.abs(greeks.rho) / 10
        };
        
        // Cap at 100% for display
        Object.keys(normalized).forEach(greek => {
            if (normalized[greek] > 100) normalized[greek] = 100;
        });
        
        // Update bar widths
        document.querySelectorAll('.greek-card').forEach(card => {
            const greekName = card.dataset.greek;
            const fill = card.querySelector('.greek-fill');
            if (fill && normalized[greekName]) {
                fill.style.width = `${normalized[greekName]}%`;
            }
        });
    }
    
    updateGreeksDisplay(greeks) {
        // This is already handled by updateGreeksValues
        this.updateGreeksValues(greeks);
    }
    
    runSimulation() {
        const button = document.getElementById('runSimulation');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulating...';
        button.disabled = true;
        
        // Generate simulation data
        setTimeout(() => {
            this.simulationResults = this.generateSimulationData();
            this.updateSimulationResults();
            this.updateCharts();
            this.updateTransactionsTable();
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Hedging simulation completed successfully!', 'success');
        }, 1500);
    }
    
    generateSimulationData() {
        const days = this.currentScenario.simulationDays;
        const hedgeFrequency = this.getHedgeFrequencyDays();
        
        let price = this.currentScenario.cocoaPrice;
        let cumulativePnL = 0;
        let totalTransactionCosts = 0;
        let previousDelta = this.calculateOptionPrice().greeks.delta;
        
        const data = {
            prices: [price],
            deltas: [previousDelta],
            days: [0],
            transactions: [],
            pnl: [0],
            transactionCosts: [0]
        };
        
        for (let day = 1; day <= days; day++) {
            // Generate new price with random walk
            const dailyVol = this.currentScenario.volatility / Math.sqrt(252);
            price = price * Math.exp((this.currentScenario.riskFreeRate - this.currentScenario.convenienceYield - 
                                    0.5 * dailyVol * dailyVol) + dailyVol * this.randomNormal());
            
            // Calculate current delta
            this.currentScenario.cocoaPrice = price;
            const currentDelta = this.calculateOptionPrice().greeks.delta;
            
            data.prices.push(price);
            data.deltas.push(currentDelta);
            data.days.push(day);
            
            // Check if we need to rebalance
            if (day % hedgeFrequency === 0) {
                const deltaChange = currentDelta - previousDelta;
                const hedgeAmount = -deltaChange * Math.abs(this.currentScenario.positionSize);
                
                // Calculate transaction cost
                const transactionCost = Math.abs(hedgeAmount * price * this.currentScenario.transactionCost);
                totalTransactionCosts += transactionCost;
                
                // Calculate P&L from delta change
                const priceChange = price - data.prices[day - hedgeFrequency];
                const deltaPnL = previousDelta * Math.abs(this.currentScenario.positionSize) * priceChange;
                cumulativePnL += deltaPnL;
                
                // Record transaction
                data.transactions.push({
                    day: day,
                    price: price,
                    delta: currentDelta,
                    hedgeAmount: hedgeAmount,
                    transactionCost: transactionCost,
                    pnlImpact: deltaPnL - transactionCost
                });
                
                previousDelta = currentDelta;
            }
            
            data.pnl.push(cumulativePnL);
            data.transactionCosts.push(totalTransactionCosts);
        }
        
        // Reset price to original
        this.currentScenario.cocoaPrice = this.getDefaultScenario().cocoaPrice;
        
        return data;
    }
    
    getHedgeFrequencyDays() {
        switch(this.currentScenario.hedgeFrequency) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
            case 'dynamic': return 5; // Dynamic would be more complex
            default: return 7;
        }
    }
    
    randomNormal() {
        // Box-Muller transform
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    updateSimulationResults() {
        if (!this.simulationResults) return;
        
        const totalDays = this.simulationResults.days.length - 1;
        const finalPnL = this.simulationResults.pnl[totalDays];
        const totalCosts = this.simulationResults.transactionCosts[totalDays];
        const netPnL = finalPnL - totalCosts;
        
        // Calculate hedging error (standard deviation of P&L)
        const pnlChanges = [];
        for (let i = 1; i < this.simulationResults.pnl.length; i++) {
            pnlChanges.push(this.simulationResults.pnl[i] - this.simulationResults.pnl[i-1]);
        }
        const mean = pnlChanges.reduce((a, b) => a + b, 0) / pnlChanges.length;
        const variance = pnlChanges.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / pnlChanges.length;
        const hedgingError = Math.sqrt(variance);
        
        // Update results display
        document.getElementById('hedgingPnl')?.textContent = `$${netPnL.toFixed(2)}`;
        document.getElementById('hedgingError')?.textContent = `${(hedgingError / Math.abs(netPnL) * 100).toFixed(2)}%`;
        
        // Update change indicators
        const pnlChangeElement = document.querySelector('#hedgingPnl').closest('.result-card').querySelector('.result-change');
        if (pnlChangeElement) {
            pnlChangeElement.innerHTML = netPnL >= 0 ? 
                '<i class="fas fa-arrow-up"></i> Profit' : 
                '<i class="fas fa-arrow-down"></i> Loss';
            pnlChangeElement.className = `result-change ${netPnL >= 0 ? 'positive' : 'negative'}`;
        }
        
        const errorChangeElement = document.querySelector('#hedgingError').closest('.result-card').querySelector('.result-change');
        if (errorChangeElement) {
            const errorPercent = hedgingError / Math.abs(netPnL) * 100;
            errorChangeElement.innerHTML = errorPercent < 5 ? 
                '<i class="fas fa-check"></i> Optimal' : 
                '<i class="fas fa-exclamation"></i> High';
            errorChangeElement.className = `result-change ${errorPercent < 5 ? 'positive' : 'warning'}`;
        }
        
        // Update hedging chart
        if (this.charts.hedging) {
            this.charts.hedging.data.datasets[0].data = [
                finalPnL,
                totalCosts,
                netPnL,
                hedgingError
            ];
            this.charts.hedging.update();
        }
    }
    
    updateCharts() {
        if (!this.simulationResults || !this.charts.priceDelta) return;
        
        // Update price & delta chart
        this.charts.priceDelta.data.labels = this.simulationResults.days;
        this.charts.priceDelta.data.datasets[0].data = this.simulationResults.prices;
        this.charts.priceDelta.data.datasets[1].data = this.simulationResults.deltas;
        this.charts.priceDelta.update();
    }
    
    updateTransactionsTable() {
        if (!this.simulationResults) return;
        
        const tbody = document.getElementById('transactionsBody');
        if (!tbody) return;
        
        if (this.simulationResults.transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-message">
                        <i class="fas fa-info-circle"></i>
                        <p>No transactions during simulation period</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Show only last 10 transactions
        const recentTransactions = this.simulationResults.transactions.slice(-10);
        
        tbody.innerHTML = recentTransactions.map(transaction => `
            <tr>
                <td>Day ${transaction.day}</td>
                <td>$${transaction.price.toFixed(2)}</td>
                <td>${transaction.delta.toFixed(3)}</td>
                <td>${transaction.hedgeAmount.toFixed(1)} MT</td>
                <td>$${transaction.transactionCost.toFixed(2)}</td>
                <td class="${transaction.pnlImpact >= 0 ? 'positive' : 'negative'}">
                    $${transaction.pnlImpact.toFixed(2)}
                </td>
            </tr>
        `).join('');
    }
    
    resetSimulation() {
        this.currentScenario = this.getDefaultScenario();
        this.transactionHistory = [];
        this.simulationResults = null;
        
        this.updateCalculations();
        this.updateSliderValues();
        
        // Reset charts
        if (this.charts.priceDelta) {
            this.charts.priceDelta.data.labels = [];
            this.charts.priceDelta.data.datasets[0].data = [];
            this.charts.priceDelta.data.datasets[1].data = [];
            this.charts.priceDelta.update();
        }
        
        if (this.charts.hedging) {
            this.charts.hedging.data.datasets[0].data = [0, 0, 0, 0];
            this.charts.hedging.update();
        }
        
        // Reset transactions table
        const tbody = document.getElementById('transactionsBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-message">
                        <i class="fas fa-play-circle"></i>
                        <p>Run simulation to see transactions</p>
                    </td>
                </tr>
            `;
        }
        
        // Reset results
        document.getElementById('hedgingPnl')?.textContent = '$0.00';
        document.getElementById('hedgingError')?.textContent = '0.00%';
        
        this.showNotification('Simulation reset to default parameters', 'info');
    }
    
    exportData() {
        if (!this.simulationResults) {
            this.showNotification('Please run a simulation first', 'warning');
            return;
        }
        
        const exportData = {
            scenario: this.currentScenario,
            simulationResults: this.simulationResults,
            timestamp: new Date().toISOString(),
            summary: {
                finalPnL: this.simulationResults.pnl[this.simulationResults.pnl.length - 1],
                totalTransactionCosts: this.simulationResults.transactionCosts[this.simulationResults.transactionCosts.length - 1],
                netPnL: this.simulationResults.pnl[this.simulationResults.pnl.length - 1] - 
                       this.simulationResults.transactionCosts[this.simulationResults.transactionCosts.length - 1]
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cocoa-hedging-simulation-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Simulation data exported successfully!', 'success');
    }
    
    saveScenario() {
        const scenarios = JSON.parse(localStorage.getItem('cocoaHedgingScenarios') || '[]');
        const scenarioName = prompt('Enter a name for this scenario:', 
            `Scenario ${scenarios.length + 1}`);
        
        if (scenarioName) {
            const scenario = {
                name: scenarioName,
                ...this.currentScenario,
                savedAt: new Date().toISOString()
            };
            
            scenarios.push(scenario);
            localStorage.setItem('cocoaHedgingScenarios', JSON.stringify(scenarios));
            
            this.showNotification(`Scenario "${scenarioName}" saved successfully!`, 'success');
        }
    }
    
    // Utility functions
    formatNumber(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    formatTimeToExpiry(years) {
        const months = years * 12;
        if (months < 1) {
            const days = Math.round(months * 30);
            return `${days} days`;
        } else if (months < 12) {
            return `${Math.round(months)} months`;
        } else {
            const years = Math.floor(months / 12);
            const remainingMonths = Math.round(months % 12);
            return remainingMonths > 0 ? 
                `${years} years, ${remainingMonths} months` : 
                `${years} years`;
        }
    }
    
    formatPositionSize(size) {
        const absSize = Math.abs(size);
        const type = size >= 0 ? 'Long' : 'Short';
        return `${absSize} (${type})`;
    }
    
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback notification
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.calculator-container')) {
        new CocoaHedgingSimulator();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CocoaHedgingSimulator;
}
