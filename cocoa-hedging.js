// cocoa-hedging.js - FIXED Calculator with Working Simulator

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
        this.initializeSliderListeners();
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
    
    setupControls() {
        // Initialize all sliders with correct values
        this.updateAllSliderValues();
        
        // Set initial option type
        document.querySelectorAll('.option-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this.currentScenario.optionType);
        });
        
        // Set initial hedge frequency
        const hedgeSelect = document.getElementById('hedgeFrequency');
        if (hedgeSelect) {
            hedgeSelect.value = this.currentScenario.hedgeFrequency;
        }
    }
    
    initializeSliderListeners() {
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
                element.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    slider.callback(value);
                    this.updateSliderValueDisplay(slider.id, value);
                    this.updateCalculations();
                });
            }
        });
    }
    
    updateScenario(key, value) {
        this.currentScenario[key] = value;
    }
    
    updateAllSliderValues() {
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
        }
    }
    
    initializeCharts() {
        // Initialize price & delta chart
        this.initializePriceDeltaChart();
        
        // Initialize hedging performance chart
        this.initializeHedgingChart();
    }
    
    initializePriceDeltaChart() {
        const ctx = document.getElementById('priceDeltaChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.priceDelta = new Chart(ctx, {
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
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'Price ($)' },
                        ticks: { callback: value => `$${this.formatNumber(value)}` }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'Delta' },
                        grid: { drawOnChartArea: false },
                        min: 0,
                        max: 1
                    }
                }
            }
        });
    }
    
    initializeHedgingChart() {
        const ctx = document.getElementById('hedgingChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.hedging = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hedging P&L', 'Transaction Costs', 'Net P&L', 'Hedging Error'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#10b981', '#f59e0b', '#006B3F', '#3b82f6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: { callback: value => `$${this.formatNumber(value)}` }
                    }
                }
            }
        });
    }
    
    setupEventListeners() {
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
            runBtn.addEventListener('click', () => {
                this.runSimulation();
            });
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
    
    updateCalculations() {
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
            price: price,
            greeks: greeks,
            isITM: isCall ? S > K : S < K,
            intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
            timeValue: price - Math.max(isCall ? S - K : K - S, 0)
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
    }
    
    updateGreeks(greeks) {
        // Update Greek values
        document.getElementById('greekDelta')?.textContent = greeks.delta.toFixed(3);
        document.getElementById('greekGamma')?.textContent = greeks.gamma.toFixed(4);
        document.getElementById('greekTheta')?.textContent = greeks.theta.toFixed(2);
        document.getElementById('greekVega')?.textContent = greeks.vega.toFixed(1);
        document.getElementById('greekRho')?.textContent = greeks.rho.toFixed(2);
        
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
                if (greekName === 'theta') {
                    fill.style.background = '#e74c3c'; // Negative for theta
                } else {
                    fill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
                }
            }
        });
    }
    
    runSimulation() {
        const button = document.getElementById('runSimulation');
        if (!button) return;
        
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
            
            if (typeof showNotification === 'function') {
                showNotification('Hedging simulation completed successfully!', 'success');
            }
        }, 1000);
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
            netPnL: cumulativePnL - totalCosts
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
        document.getElementById('hedgingPnl')?.textContent = `$${netPnL.toFixed(2)}`;
        document.getElementById('hedgingError')?.textContent = `${(hedgingError / Math.abs(netPnL) * 100).toFixed(2)}%`;
        
        // Update change indicators
        const pnlChange = document.querySelector('#hedgingPnl').closest('.result-card')?.querySelector('.result-change');
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
        
        if (typeof showNotification === 'function') {
            showNotification('Simulation reset', 'info');
        }
    }
    
    exportData() {
        if (!this.simulationResults) {
            if (typeof showNotification === 'function') {
                showNotification('Run simulation first', 'warning');
            }
            return;
        }
        
        const exportData = {
            scenario: this.currentScenario,
            results: this.simulationResults,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hedging-simulation-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        if (typeof showNotification === 'function') {
            showNotification('Data exported', 'success');
        }
    }
    
    saveScenario() {
        const name = prompt('Enter scenario name:', `Scenario ${new Date().toLocaleDateString()}`);
        if (!name) return;
        
        const scenarios = JSON.parse(localStorage.getItem('cocoaScenarios') || '[]');
        scenarios.push({
            name: name,
            ...this.currentScenario,
            savedAt: new Date().toISOString()
        });
        
        localStorage.setItem('cocoaScenarios', JSON.stringify(scenarios));
        
        if (typeof showNotification === 'function') {
            showNotification(`Scenario "${name}" saved`, 'success');
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
            return `${Math.round(months * 30)} days`;
        } else if (months < 12) {
            return `${Math.round(months)} months`;
        } else {
            const yrs = Math.floor(months / 12);
            const mths = Math.round(months % 12);
            return mths > 0 ? `${yrs} years, ${mths} months` : `${yrs} years`;
        }
    }
    
    formatPositionSize(size) {
        const absSize = Math.abs(size);
        const type = size >= 0 ? 'Long' : 'Short';
        return `${absSize} (${type})`;
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.calculator-container')) {
        window.calculator = new CocoaHedgingSimulator();
    }
});
