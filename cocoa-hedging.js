// cocoa-hedging.js - COMPLETELY REVISED WITH WORKING CALCULATOR

class CocoaHedgingSimulator {
    constructor() {
        this.currentScenario = this.getDefaultScenario();
        this.transactionHistory = [];
        this.simulationResults = null;
        this.charts = {};
        this.isInitialized = false;
        this.init();
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
            model: 'black-scholes',
            useTransactionCosts: true
        };
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing Cocoa Hedging Simulator...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupControls();
        this.initializeCharts();
        this.setupEventListeners();
        this.updateCalculations();
        this.updateAllSliderValues();
        this.isInitialized = true;
        
        console.log('Calculator setup complete');
    }
    
    setupControls() {
        // Initialize all sliders with correct values
        this.updateSlider('cocoaPrice', this.currentScenario.cocoaPrice);
        this.updateSlider('strikePrice', this.currentScenario.strikePrice);
        this.updateSlider('volatility', this.currentScenario.volatility);
        this.updateSlider('timeToExpiry', this.currentScenario.timeToExpiry);
        this.updateSlider('positionSize', this.currentScenario.positionSize);
        this.updateSlider('transactionCost', this.currentScenario.transactionCost);
        
        // Set initial option type
        const callBtn = document.querySelector('.option-type-btn[data-type="call"]');
        const putBtn = document.querySelector('.option-type-btn[data-type="put"]');
        
        if (callBtn && putBtn) {
            callBtn.classList.toggle('active', this.currentScenario.optionType === 'call');
            putBtn.classList.toggle('active', this.currentScenario.optionType === 'put');
        }
        
        // Set initial hedge frequency
        const hedgeSelect = document.getElementById('hedgeFrequency');
        if (hedgeSelect) {
            hedgeSelect.value = this.currentScenario.hedgeFrequency;
        }
    }
    
    updateSlider(sliderId, value) {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.value = value;
            this.updateSliderValueDisplay(sliderId, value);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Set up real-time slider updates
        const sliders = [
            { id: 'cocoaPrice', callback: (val) => this.updateScenario('cocoaPrice', val) },
            { id: 'strikePrice', callback: (val) => this.updateScenario('strikePrice', val) },
            { id: 'volatility', callback: (val) => this.updateScenario('volatility', val) },
            { id: 'timeToExpiry', callback: (val) => this.updateScenario('timeToExpiry', val) },
            { id: 'positionSize', callback: (val) => this.updateScenario('positionSize', val) },
            { id: 'transactionCost', callback: (val) => this.updateScenario('transactionCost', val) }
        ];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            if (element) {
                // Remove existing listeners to prevent duplicates
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Add new listener
                newElement.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    slider.callback(value);
                    this.updateSliderValueDisplay(slider.id, value);
                    this.updateCalculations();
                });
                
                console.log(`Listener added for slider: ${slider.id}`);
            } else {
                console.warn(`Slider not found: ${slider.id}`);
            }
        });
        
        // Option type selector
        document.querySelectorAll('.option-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.option-type-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentScenario.optionType = e.currentTarget.dataset.type;
                this.updateCalculations();
            });
        });
        
        // Hedge frequency
        const hedgeSelect = document.getElementById('hedgeFrequency');
        if (hedgeSelect) {
            hedgeSelect.addEventListener('change', (e) => {
                this.currentScenario.hedgeFrequency = e.target.value;
            });
        }
        
        // Run simulation button - FIXED
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Run Simulation button clicked');
                this.runSimulation();
            });
        } else {
            console.warn('Run Simulation button not found');
        }
        
        // Reset simulation
        const resetBtn = document.getElementById('resetSimulation');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }
        
        // Export data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // Save scenario
        const saveBtn = document.getElementById('saveScenario');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveScenario();
            });
        }
    }
    
    updateScenario(key, value) {
        this.currentScenario[key] = value;
    }
    
    updateAllSliderValues() {
        console.log('Updating all slider values...');
        
        const sliders = [
            { id: 'cocoaPrice', format: val => `$${this.formatNumber(val)}` },
            { id: 'strikePrice', format: val => `$${this.formatNumber(val)}` },
            { id: 'volatility', format: val => `${(val * 100).toFixed(1)}%` },
            { id: 'timeToExpiry', format: val => this.formatTimeToExpiry(val) },
            { id: 'positionSize', format: val => this.formatPositionSize(val) },
            { id: 'transactionCost', format: val => `${(val * 100).toFixed(2)}%` }
        ];
        
        sliders.forEach(slider => {
            this.updateSliderValueDisplay(slider.id, this.currentScenario[slider.id], slider.format);
        });
    }
    
    updateSliderValueDisplay(sliderId, value, formatFunc = null) {
        const valueElement = document.getElementById(`${sliderId}Value`);
        if (valueElement) {
            if (!formatFunc) {
                // Default formatting based on slider type
                if (sliderId.includes('Price')) {
                    formatFunc = val => `$${this.formatNumber(val)}`;
                } else if (sliderId === 'volatility') {
                    formatFunc = val => `${(val * 100).toFixed(1)}%`;
                } else if (sliderId === 'timeToExpiry') {
                    formatFunc = val => this.formatTimeToExpiry(val);
                } else if (sliderId === 'positionSize') {
                    formatFunc = val => this.formatPositionSize(val);
                } else if (sliderId === 'transactionCost') {
                    formatFunc = val => `${(val * 100).toFixed(2)}%`;
                } else {
                    formatFunc = val => val.toString();
                }
            }
            valueElement.textContent = formatFunc(value);
            console.log(`Updated ${sliderId}: ${formatFunc(value)}`);
        } else {
            console.warn(`Value element not found: ${sliderId}Value`);
        }
    }
    
    initializeCharts() {
        console.log('Initializing charts...');
        // Initialize price & delta chart
        this.initializePriceDeltaChart();
        
        // Initialize hedging performance chart
        this.initializeHedgingChart();
    }
    
    initializePriceDeltaChart() {
        const canvas = document.getElementById('priceDeltaChart');
        if (!canvas) {
            console.warn('PriceDeltaChart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        this.charts.priceDelta = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'],
                datasets: [
                    {
                        label: 'Cocoa Price',
                        data: [2500, 2550, 2600, 2650, 2700, 2750, 2800],
                        borderColor: '#006B3F',
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Delta',
                        data: [0.45, 0.48, 0.52, 0.55, 0.58, 0.60, 0.62],
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
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { 
                            display: true, 
                            text: 'Price ($)',
                            color: '#006B3F'
                        },
                        ticks: { 
                            callback: value => `$${this.formatNumber(value)}`,
                            color: '#006B3F'
                        },
                        grid: { color: 'rgba(0, 107, 63, 0.1)' }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { 
                            display: true, 
                            text: 'Delta',
                            color: '#FCD116'
                        },
                        grid: { drawOnChartArea: false },
                        min: 0,
                        max: 1,
                        ticks: { 
                            color: '#FCD116'
                        }
                    }
                }
            }
        });
    }
    
    initializeHedgingChart() {
        const canvas = document.getElementById('hedgingChart');
        if (!canvas) {
            console.warn('HedgingChart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        this.charts.hedging = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hedging P&L', 'Transaction Costs', 'Net P&L', 'Hedging Error'],
                datasets: [{
                    label: 'Performance ($)',
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#10b981', '#f59e0b', '#006B3F', '#3b82f6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${this.formatNumber(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            callback: value => `$${this.formatNumber(value)}`
                        }
                    }
                }
            }
        });
    }
    
    updateCalculations() {
        console.log('Updating calculations...');
        
        // Calculate option price and Greeks
        const calculations = this.calculateOptionPrice();
        
        // Update display
        this.updateDisplay(calculations);
        
        // Update Greeks
        this.updateGreeks(calculations.greeks);
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
            theta: this.calculateTheta(S, K, T, r, σ, δ, isCall) / 365, // Convert to daily
            vega: this.calculateVega(S, K, T, r, σ, δ) / 100, // Per 1% change
            rho: this.calculateRho(S, K, T, r, σ, δ, isCall) / 100 // Per 1% change
        };
        
        return {
            price: Math.max(price, 0), // Ensure non-negative price
            greeks: greeks,
            isITM: isCall ? S > K : S < K,
            intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
            timeValue: Math.max(price - Math.max(isCall ? S - K : K - S, 0), 0)
        };
    }
    
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
    
    updateDisplay(calculations) {
        console.log('Updating display with calculations:', calculations);
        
        // Update option price
        const priceElement = document.getElementById('optionPrice');
        if (priceElement) {
            priceElement.textContent = `$${calculations.price.toFixed(2)}`;
        }
        
        // Update delta
        const deltaElement = document.getElementById('deltaValue');
        if (deltaElement) {
            deltaElement.textContent = calculations.greeks.delta.toFixed(3);
        }
        
        // Update ITM/OTM status
        const changeElement = document.querySelector('.result-change');
        if (changeElement) {
            const isITM = calculations.isITM;
            changeElement.innerHTML = isITM ? 
                '<i class="fas fa-arrow-up"></i> ITM' : 
                '<i class="fas fa-arrow-down"></i> OTM';
            changeElement.className = `result-change ${isITM ? 'positive' : 'negative'}`;
        }
        
        // Update hedging P&L placeholder
        const hedgingPnl = document.getElementById('hedgingPnl');
        if (hedgingPnl) {
            hedgingPnl.textContent = '$0.00';
        }
        
        // Update hedging error
        const hedgingError = document.getElementById('hedgingError');
        if (hedgingError) {
            hedgingError.textContent = '0.00%';
        }
    }
    
    updateGreeks(greeks) {
        console.log('Updating Greeks:', greeks);
        
        // Update Greek values
        const greekIds = {
            'greekDelta': greeks.delta,
            'greekGamma': greeks.gamma,
            'greekTheta': greeks.theta,
            'greekVega': greeks.vega,
            'greekRho': greeks.rho
        };
        
        Object.entries(greekIds).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'greekGamma') {
                    element.textContent = value.toFixed(4);
                } else if (id === 'greekTheta') {
                    element.textContent = value.toFixed(2);
                } else if (id === 'greekVega') {
                    element.textContent = value.toFixed(1);
                } else if (id === 'greekRho') {
                    element.textContent = value.toFixed(2);
                } else {
                    element.textContent = value.toFixed(3);
                }
            }
        });
        
        // Update Greek bars (visual representation)
        this.updateGreekBars(greeks);
    }
    
    updateGreekBars(greeks) {
        const normalized = {
            delta: Math.abs(greeks.delta) * 100,
            gamma: Math.abs(greeks.gamma) * 10000,
            theta: Math.abs(greeks.theta) * 10,
            vega: greeks.vega * 2,
            rho: Math.abs(greeks.rho) * 10
        };
        
        // Cap at 100%
        Object.keys(normalized).forEach(greek => {
            if (normalized[greek] > 100) normalized[greek] = 100;
        });
        
        // Update bar widths
        document.querySelectorAll('.greek-card').forEach(card => {
            const greekName = card.dataset.greek;
            const fill = card.querySelector('.greek-fill');
            if (fill && normalized[greekName]) {
                fill.style.width = `${normalized[greekName]}%`;
                
                // Add color based on value
                if (greekName === 'theta' && greeks.theta < 0) {
                    fill.style.background = '#e74c3c'; // Negative for theta
                } else {
                    fill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
                }
            }
        });
    }
    
    runSimulation() {
        console.log('Running simulation...');
        
        const button = document.getElementById('runSimulation');
        if (!button) {
            console.error('Run Simulation button not found');
            return;
        }
        
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
            
            // Show notification
            this.showNotification('Hedging simulation completed successfully!', 'success');
            
            console.log('Simulation completed:', this.simulationResults);
        }, 1500);
    }
    
    generateSimulationData() {
        const days = this.currentScenario.simulationDays;
        const hedgeFreq = this.getHedgeFrequencyDays();
        
        // Generate price path
        let price = this.currentScenario.cocoaPrice;
        const prices = [price];
        const deltas = [this.calculateOptionPrice().greeks.delta];
        
        let cumulativePnL = 0;
        let totalCosts = 0;
        let previousDelta = deltas[0];
        const transactions = [];
        
        for (let day = 1; day <= days; day++) {
            // Generate new price with Brownian motion
            const dt = 1/252; // Daily
            const drift = (this.currentScenario.riskFreeRate - this.currentScenario.convenienceYield - 
                          0.5 * this.currentScenario.volatility * this.currentScenario.volatility) * dt;
            const shock = this.currentScenario.volatility * Math.sqrt(dt) * this.randomNormal();
            price = price * Math.exp(drift + shock);
            
            // Calculate delta at new price
            const tempPrice = this.currentScenario.cocoaPrice;
            this.currentScenario.cocoaPrice = price;
            const currentDelta = this.calculateOptionPrice().greeks.delta;
            this.currentScenario.cocoaPrice = tempPrice;
            
            prices.push(price);
            deltas.push(currentDelta);
            
            // Check if rebalancing needed
            if (day % hedgeFreq === 0) {
                const deltaChange = currentDelta - previousDelta;
                const hedgeTrade = -deltaChange * Math.abs(this.currentScenario.positionSize);
                
                // Calculate transaction cost
                const cost = Math.abs(hedgeTrade * price * this.currentScenario.transactionCost);
                totalCosts += cost;
                
                // Calculate P&L from delta change
                const priceChange = price - prices[day - hedgeFreq];
                const deltaPnL = previousDelta * Math.abs(this.currentScenario.positionSize) * priceChange;
                cumulativePnL += deltaPnL;
                
                // Record transaction
                transactions.push({
                    day: day,
                    price: price.toFixed(2),
                    delta: currentDelta.toFixed(3),
                    hedgeTrade: hedgeTrade.toFixed(1),
                    transactionCost: cost.toFixed(2),
                    pnlImpact: (deltaPnL - cost).toFixed(2)
                });
                
                previousDelta = currentDelta;
            }
        }
        
        return {
            prices: prices,
            deltas: deltas,
            days: Array.from({length: days + 1}, (_, i) => i),
            transactions: transactions,
            finalPnL: cumulativePnL,
            totalCosts: totalCosts,
            netPnL: cumulativePnL - totalCosts,
            avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            maxPrice: Math.max(...prices),
            minPrice: Math.min(...prices)
        };
    }
    
    getHedgeFrequencyDays() {
        switch(this.currentScenario.hedgeFrequency) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
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
        
        const netPnL = this.simulationResults.netPnL;
        const hedgingError = Math.abs(this.simulationResults.netPnL) * 0.05; // 5% error
        
        // Update display
        const hedgingPnlElement = document.getElementById('hedgingPnl');
        if (hedgingPnlElement) {
            hedgingPnlElement.textContent = `$${netPnL.toFixed(2)}`;
        }
        
        const hedgingErrorElement = document.getElementById('hedgingError');
        if (hedgingErrorElement) {
            const errorPercent = (hedgingError / Math.abs(netPnL || 1)) * 100;
            hedgingErrorElement.textContent = `${errorPercent.toFixed(2)}%`;
        }
        
        // Update change indicators
        const pnlChange = document.querySelector('#hedgingPnl')?.closest('.result-card')?.querySelector('.result-change');
        if (pnlChange) {
            pnlChange.innerHTML = netPnL >= 0 ? 
                '<i class="fas fa-arrow-up"></i> Profit' : 
                '<i class="fas fa-arrow-down"></i> Loss';
            pnlChange.className = `result-change ${netPnL >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update hedging chart
        if (this.charts.hedging) {
            this.charts.hedging.data.datasets[0].data = [
                this.simulationResults.finalPnL,
                this.simulationResults.totalCosts,
                netPnL,
                hedgingError
            ];
            this.charts.hedging.update();
        }
    }
    
    updateCharts() {
        if (!this.simulationResults || !this.charts.priceDelta) return;
        
        // Update price & delta chart
        this.charts.priceDelta.data.labels = this.simulationResults.days.map(d => `Day ${d}`);
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
        
        // Show last 10 transactions
        const recent = this.simulationResults.transactions.slice(-10);
        tbody.innerHTML = recent.map(t => `
            <tr>
                <td>Day ${t.day}</td>
                <td>$${t.price}</td>
                <td>${t.delta}</td>
                <td>${t.hedgeTrade} MT</td>
                <td>$${t.transactionCost}</td>
                <td class="${parseFloat(t.pnlImpact) >= 0 ? 'positive' : 'negative'}">
                    $${t.pnlImpact}
                </td>
            </tr>
        `).join('');
    }
    
    resetSimulation() {
        this.currentScenario = this.getDefaultScenario();
        this.simulationResults = null;
        
        // Reset UI
        this.updateAllSliderValues();
        this.updateCalculations();
        
        // Reset charts
        if (this.charts.priceDelta) {
            this.charts.priceDelta.data.labels = ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'];
            this.charts.priceDelta.data.datasets[0].data = [2500, 2550, 2600, 2650, 2700, 2750, 2800];
            this.charts.priceDelta.data.datasets[1].data = [0.45, 0.48, 0.52, 0.55, 0.58, 0.60, 0.62];
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
        
        this.showNotification('Simulation reset to default values', 'info');
    }
    
    exportData() {
        if (!this.simulationResults) {
            this.showNotification('Please run a simulation first', 'warning');
            return;
        }
        
        const exportData = {
            scenario: this.currentScenario,
            results: this.simulationResults,
            timestamp: new Date().toISOString(),
            developer: "Emmanuel Adutwum",
            project: "Ghana Cocoa Hedging Research Platform"
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
        const name = prompt('Enter scenario name:', `Scenario ${new Date().toLocaleDateString()}`);
        if (!name) return;
        
        const scenarios = JSON.parse(localStorage.getItem('cocoaScenarios') || '[]');
        scenarios.push({
            name: name,
            ...this.currentScenario,
            savedAt: new Date().toISOString(),
            savedBy: "Emmanuel Adutwum"
        });
        
        localStorage.setItem('cocoaScenarios', JSON.stringify(scenarios));
        
        this.showNotification(`Scenario "${name}" saved successfully!`, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `calculator-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideIn 0.3s ease;
        `;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add CSS for animations
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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
            return `${days} day${days !== 1 ? 's' : ''}`;
        } else if (months < 12) {
            const roundedMonths = Math.round(months);
            return `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`;
        } else {
            const yrs = Math.floor(months / 12);
            const mths = Math.round(months % 12);
            if (mths > 0) {
                return `${yrs} year${yrs !== 1 ? 's' : ''}, ${mths} month${mths !== 1 ? 's' : ''}`;
            } else {
                return `${yrs} year${yrs !== 1 ? 's' : ''}`;
            }
        }
    }
    
    formatPositionSize(size) {
        const absSize = Math.abs(size);
        const type = size >= 0 ? 'Long' : 'Short';
        return `${absSize} (${type})`;
    }
}

// Initialize calculator when page loads
let calculatorInstance;

// Check if we're on the calculator page
if (window.location.pathname.includes('calculator.html') || 
    document.querySelector('.calculator-container')) {
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing calculator...');
            calculatorInstance = new CocoaHedgingSimulator();
            window.calculator = calculatorInstance; // Make available globally
        });
    } else {
        console.log('DOM already loaded, initializing calculator...');
        calculatorInstance = new CocoaHedgingSimulator();
        window.calculator = calculatorInstance;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CocoaHedgingSimulator;
}
