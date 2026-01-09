// cocoa-hedging.js - COMPLETELY REVISED & WORKING
// Ghana Cocoa Board Hedging Simulator
// Author: Emmanuel Adutwum
// Version: 2.0 - Enhanced Simulation & Charting

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
        
        console.log('🚀 Initializing Cocoa Hedging Simulator v2.0...');
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            setTimeout(() => this.setup(), 100);
        }
    }
    
    setup() {
        try {
            console.log('Setting up calculator...');
            this.setupControls();
            this.initializeCharts();
            this.setupEventListeners();
            this.updateCalculations();
            this.updateAllSliderValues();
            this.isInitialized = true;
            console.log('✅ Calculator setup complete');
        } catch (error) {
            console.error('Setup error:', error);
        }
    }
    
    setupControls() {
        // Set initial slider values from scenario
        Object.keys(this.currentScenario).forEach(key => {
            const slider = document.getElementById(key);
            if (slider) {
                slider.value = this.currentScenario[key];
            }
        });
        
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
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Real-time slider updates
        const sliders = [
            'cocoaPrice', 'strikePrice', 'volatility', 
            'timeToExpiry', 'positionSize', 'transactionCost'
        ];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                // Remove existing listener
                const newSlider = slider.cloneNode(true);
                slider.parentNode.replaceChild(newSlider, slider);
                
                // Add new listener
                newSlider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    this.currentScenario[sliderId] = value;
                    this.updateSliderValueDisplay(sliderId, value);
                    this.updateCalculations();
                });
                
                console.log(`✅ Listener added for: ${sliderId}`);
            }
        });
        
        // Option type buttons
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
        
        // Run Simulation Button - FIXED
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            // Remove any existing listeners
            const newBtn = runBtn.cloneNode(true);
            runBtn.parentNode.replaceChild(newBtn, runBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('▶️ Run Simulation clicked');
                this.runSimulation();
            });
            console.log('✅ Run Simulation button ready');
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetSimulation');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // Save scenario button
        const saveBtn = document.getElementById('saveScenario');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveScenario();
            });
        }
    }
    
    updateSliderValueDisplay(sliderId, value) {
        const valueElement = document.getElementById(`${sliderId}Value`);
        if (!valueElement) return;
        
        let formattedValue;
        switch(sliderId) {
            case 'cocoaPrice':
            case 'strikePrice':
                formattedValue = `$${this.formatNumber(value)}`;
                break;
            case 'volatility':
                formattedValue = `${(value * 100).toFixed(1)}%`;
                break;
            case 'timeToExpiry':
                formattedValue = this.formatTimeToExpiry(value);
                break;
            case 'positionSize':
                formattedValue = this.formatPositionSize(value);
                break;
            case 'transactionCost':
                formattedValue = `${(value * 100).toFixed(2)}%`;
                break;
            default:
                formattedValue = value;
        }
        
        valueElement.textContent = formattedValue;
    }
    
    updateAllSliderValues() {
        const sliders = [
            'cocoaPrice', 'strikePrice', 'volatility', 
            'timeToExpiry', 'positionSize', 'transactionCost'
        ];
        
        sliders.forEach(sliderId => {
            this.updateSliderValueDisplay(sliderId, this.currentScenario[sliderId]);
        });
    }
    
    initializeCharts() {
        console.log('Initializing charts...');
        
        // Price & Delta Chart
        this.initializePriceDeltaChart();
        
        // Hedging Performance Chart (like the attached image)
        this.initializeHedgingChart();
    }
    
    initializePriceDeltaChart() {
        const canvas = document.getElementById('priceDeltaChart');
        if (!canvas) {
            console.warn('PriceDeltaChart canvas not found');
            return;
        }
        
        if (this.charts.priceDelta) {
            this.charts.priceDelta.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        this.charts.priceDelta = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'],
                datasets: [
                    {
                        label: 'Cocoa Price ($/MT)',
                        data: [2500, 2550, 2600, 2650, 2700, 2750, 2800],
                        borderColor: '#006B3F',
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Delta (Δ)',
                        data: [0.45, 0.48, 0.52, 0.55, 0.58, 0.60, 0.62],
                        borderColor: '#FCD116',
                        backgroundColor: 'rgba(252, 209, 22, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { padding: 20 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { 
                            display: true, 
                            text: 'Price ($/MT)',
                            color: '#006B3F'
                        },
                        ticks: { 
                            callback: value => `$${this.formatNumber(value)}`
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
                        min: 0,
                        max: 1,
                        grid: { drawOnChartArea: false },
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
        
        if (this.charts.hedging) {
            this.charts.hedging.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        this.charts.hedging = new Chart(ctx, {
            type: 'line', // Changed to line chart for time series
            data: {
                labels: ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'],
                datasets: [
                    {
                        label: 'Hedged Portfolio',
                        data: [0, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000],
                        borderColor: '#006B3F',
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Unhedged',
                        data: [0, 30000000, 60000000, 90000000, 120000000, 150000000, 180000000],
                        borderColor: '#FCD116',
                        backgroundColor: 'rgba(252, 209, 22, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Hedging Error',
                        data: [0, 20000000, 40000000, 60000000, 80000000, 100000000, 120000000],
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        borderDash: [2, 2],
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { padding: 20 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += `$${this.formatNumber(context.parsed.y)}`;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Days'
                        },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Portfolio Value ($)'
                        },
                        ticks: { 
                            callback: value => {
                                if (value >= 1000000000) {
                                    return `$${(value/1000000000).toFixed(1)}B`;
                                } else if (value >= 1000000) {
                                    return `$${(value/1000000).toFixed(1)}M`;
                                } else {
                                    return `$${this.formatNumber(value)}`;
                                }
                            }
                        },
                        suggestedMin: -50000000,
                        suggestedMax: 300000000
                    }
                }
            }
        });
    }
    
    updateCalculations() {
        try {
            const calculations = this.calculateOptionPrice();
            this.updateDisplay(calculations);
            this.updateGreeks(calculations.greeks);
        } catch (error) {
            console.error('Calculation error:', error);
        }
    }
    
    calculateOptionPrice() {
        const S = this.currentScenario.cocoaPrice;
        const K = this.currentScenario.strikePrice;
        const T = this.currentScenario.timeToExpiry;
        const r = this.currentScenario.riskFreeRate;
        const σ = this.currentScenario.volatility;
        const δ = this.currentScenario.convenienceYield;
        const isCall = this.currentScenario.optionType === 'call';
        
        // Handle edge cases
        if (T <= 0 || S <= 0 || σ <= 0) {
            return {
                price: 0,
                greeks: {
                    delta: isCall ? 1 : -1,
                    gamma: 0,
                    theta: 0,
                    vega: 0,
                    rho: 0
                },
                isITM: isCall ? S > K : S < K,
                intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
                timeValue: 0
            };
        }
        
        // Black-Scholes-Merton with convenience yield
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const d2 = d1 - σ * Math.sqrt(T);
        
        let price;
        if (isCall) {
            price = S * Math.exp(-δ * T) * this.normCDF(d1) - K * Math.exp(-r * T) * this.normCDF(d2);
        } else {
            price = K * Math.exp(-r * T) * this.normCDF(-d2) - S * Math.exp(-δ * T) * this.normCDF(-d1);
        }
        
        // Greeks
        const greeks = {
            delta: this.calculateDelta(S, K, T, r, σ, δ, isCall),
            gamma: this.calculateGamma(S, K, T, r, σ, δ),
            theta: this.calculateTheta(S, K, T, r, σ, δ, isCall) / 365,
            vega: this.calculateVega(S, K, T, r, σ, δ) / 100,
            rho: this.calculateRho(S, K, T, r, σ, δ, isCall) / 100
        };
        
        return {
            price: Math.max(price, 0),
            greeks: greeks,
            isITM: isCall ? S > K : S < K,
            intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
            timeValue: Math.max(price - Math.max(isCall ? S - K : K - S, 0), 0)
        };
    }
    
    calculateDelta(S, K, T, r, σ, δ, isCall) {
        if (T <= 0) return isCall ? 1 : -1;
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        if (isCall) {
            return Math.exp(-δ * T) * this.normCDF(d1);
        } else {
            return Math.exp(-δ * T) * (this.normCDF(d1) - 1);
        }
    }
    
    calculateGamma(S, K, T, r, σ, δ) {
        if (T <= 0) return 0;
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const φ = this.normPDF(d1);
        return (Math.exp(-δ * T) * φ) / (S * σ * Math.sqrt(T));
    }
    
    calculateTheta(S, K, T, r, σ, δ, isCall) {
        if (T <= 0) return 0;
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
        if (T <= 0) return 0;
        const d1 = (Math.log(S / K) + (r - δ + (σ * σ) / 2) * T) / (σ * Math.sqrt(T));
        const φ = this.normPDF(d1);
        return S * Math.exp(-δ * T) * φ * Math.sqrt(T);
    }
    
    calculateRho(S, K, T, r, σ, δ, isCall) {
        if (T <= 0) return 0;
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
        const changeElement = document.querySelector('#optionPrice')?.closest('.result-card')?.querySelector('.result-change');
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
        const greekElements = {
            'greekDelta': greeks.delta,
            'greekGamma': greeks.gamma,
            'greekTheta': greeks.theta,
            'greekVega': greeks.vega,
            'greekRho': greeks.rho
        };
        
        Object.entries(greekElements).forEach(([id, value]) => {
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
        
        // Update Greek bars
        this.updateGreekBars(greeks);
    }
    
    updateGreekBars(greeks) {
        const normalized = {
            delta: Math.abs(greeks.delta) * 100,
            gamma: Math.abs(greeks.gamma) * 10000,
            theta: Math.abs(greeks.theta) * 10,
            vega: Math.abs(greeks.vega) * 0.2,
            rho: Math.abs(greeks.rho) * 10
        };
        
        Object.keys(normalized).forEach(greek => {
            if (normalized[greek] > 100) normalized[greek] = 100;
            if (normalized[greek] < 0) normalized[greek] = 0;
        });
        
        document.querySelectorAll('.greek-card').forEach(card => {
            const greekName = card.dataset.greek;
            const fill = card.querySelector('.greek-fill');
            if (fill && normalized[greekName] !== undefined) {
                fill.style.width = `${normalized[greekName]}%`;
                
                // Special color for negative theta
                if (greekName === 'theta' && greeks.theta < 0) {
                    fill.style.background = '#EF4444';
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
        
        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulating...';
        button.disabled = true;
        
        // Generate simulation data
        setTimeout(() => {
            try {
                this.simulationResults = this.generateSimulationData();
                this.updateSimulationResults();
                this.updateCharts();
                this.updateTransactionsTable();
                
                console.log('✅ Simulation completed:', this.simulationResults);
                this.showNotification('Hedging simulation completed successfully!', 'success');
            } catch (error) {
                console.error('Simulation error:', error);
                this.showNotification('Simulation failed. Please check parameters.', 'error');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }, 1000);
    }
    
    generateSimulationData() {
        const days = this.currentScenario.simulationDays;
        const hedgeFreq = this.getHedgeFrequencyDays();
        
        // Initialize arrays
        const prices = [this.currentScenario.cocoaPrice];
        const deltas = [this.calculateOptionPrice().greeks.delta];
        
        // Initialize portfolio values
        const hedgedValues = [0];
        const unhedgedValues = [0];
        const errorValues = [0];
        
        let cumulativePnL = 0;
        let totalCosts = 0;
        let previousDelta = deltas[0];
        const transactions = [];
        
        // Simulate daily price movements
        let currentPrice = this.currentScenario.cocoaPrice;
        for (let day = 1; day <= days; day++) {
            // Generate price with geometric Brownian motion
            const dt = 1/252;
            const mu = this.currentScenario.riskFreeRate - this.currentScenario.convenienceYield;
            const sigma = this.currentScenario.volatility;
            const drift = (mu - 0.5 * sigma * sigma) * dt;
            const shock = sigma * Math.sqrt(dt) * this.randomNormal();
            
            currentPrice = currentPrice * Math.exp(drift + shock);
            prices.push(currentPrice);
            
            // Calculate delta at new price
            const tempPrice = this.currentScenario.cocoaPrice;
            this.currentScenario.cocoaPrice = currentPrice;
            const currentDelta = this.calculateOptionPrice().greeks.delta;
            this.currentScenario.cocoaPrice = tempPrice;
            deltas.push(currentDelta);
            
            // Calculate portfolio values
            const priceChange = currentPrice - prices[0];
            const unhedgedPnl = this.currentScenario.positionSize * priceChange;
            unhedgedValues.push(unhedgedPnl);
            
            // Hedged P&L calculation
            let hedgedPnl = cumulativePnL;
            let hedgingError = 0;
            
            // Rebalance if needed
            if (day % hedgeFreq === 0) {
                const deltaChange = currentDelta - previousDelta;
                const hedgeTrade = -deltaChange * Math.abs(this.currentScenario.positionSize);
                
                // Transaction cost
                const cost = Math.abs(hedgeTrade * currentPrice * this.currentScenario.transactionCost);
                totalCosts += cost;
                
                // P&L from delta change
                const priceChangeSinceLast = currentPrice - prices[day - hedgeFreq];
                const deltaPnL = previousDelta * Math.abs(this.currentScenario.positionSize) * priceChangeSinceLast;
                cumulativePnL += deltaPnL - cost;
                
                // Record transaction
                transactions.push({
                    day: day,
                    price: currentPrice.toFixed(2),
                    delta: currentDelta.toFixed(3),
                    hedgeTrade: hedgeTrade.toFixed(1),
                    transactionCost: cost.toFixed(2),
                    pnlImpact: (deltaPnL - cost).toFixed(2)
                });
                
                previousDelta = currentDelta;
            }
            
            hedgedPnl = cumulativePnL;
            hedgingError = Math.abs(unhedgedPnl - hedgedPnl);
            
            hedgedValues.push(hedgedPnl);
            errorValues.push(hedgingError);
        }
        
        return {
            days: Array.from({length: days + 1}, (_, i) => i),
            prices: prices,
            deltas: deltas,
            hedgedValues: hedgedValues,
            unhedgedValues: unhedgedValues,
            errorValues: errorValues,
            transactions: transactions,
            finalPnL: cumulativePnL,
            totalCosts: totalCosts,
            netPnL: cumulativePnL - totalCosts,
            hedgingError: errorValues[errorValues.length - 1]
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
        
        const results = this.simulationResults;
        
        // Update hedging P&L
        const hedgingPnlElement = document.getElementById('hedgingPnl');
        if (hedgingPnlElement) {
            hedgingPnlElement.textContent = `$${results.netPnL.toFixed(2)}`;
            
            // Update change indicator
            const changeElement = hedgingPnlElement.closest('.result-card')?.querySelector('.result-change');
            if (changeElement) {
                changeElement.innerHTML = results.netPnL >= 0 ? 
                    '<i class="fas fa-arrow-up"></i> Profit' : 
                    '<i class="fas fa-arrow-down"></i> Loss';
                changeElement.className = `result-change ${results.netPnL >= 0 ? 'positive' : 'negative'}`;
            }
        }
        
        // Update hedging error
        const hedgingErrorElement = document.getElementById('hedgingError');
        if (hedgingErrorElement) {
            const errorPercent = (results.hedgingError / Math.max(Math.abs(results.netPnL), 1)) * 100;
            hedgingErrorElement.textContent = `${errorPercent.toFixed(2)}%`;
        }
    }
    
    updateCharts() {
        if (!this.simulationResults || !this.charts.priceDelta || !this.charts.hedging) return;
        
        const results = this.simulationResults;
        
        // Update Price & Delta Chart
        this.charts.priceDelta.data.labels = results.days.map(d => `Day ${d}`);
        this.charts.priceDelta.data.datasets[0].data = results.prices;
        this.charts.priceDelta.data.datasets[1].data = results.deltas;
        this.charts.priceDelta.update();
        
        // Update Hedging Chart (like the attached image)
        this.charts.hedging.data.labels = results.days.map(d => `Day ${d}`);
        this.charts.hedging.data.datasets[0].data = results.hedgedValues;
        this.charts.hedging.data.datasets[1].data = results.unhedgedValues;
        this.charts.hedging.data.datasets[2].data = results.errorValues;
        this.charts.hedging.update();
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
        
        const recent = this.simulationResults.transactions.slice(-10);
        tbody.innerHTML = recent.map(t => `
            <tr>
                <td>Day ${t.day}</td>
                <td>$${parseFloat(t.price).toFixed(2)}</td>
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
        this.setupControls();
        this.updateCalculations();
        this.updateAllSliderValues();
        
        // Reset charts to default
        if (this.charts.priceDelta) {
            this.charts.priceDelta.data.labels = ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'];
            this.charts.priceDelta.data.datasets[0].data = [2500, 2550, 2600, 2650, 2700, 2750, 2800];
            this.charts.priceDelta.data.datasets[1].data = [0.45, 0.48, 0.52, 0.55, 0.58, 0.60, 0.62];
            this.charts.priceDelta.update();
        }
        
        if (this.charts.hedging) {
            this.charts.hedging.data.labels = ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'];
            this.charts.hedging.data.datasets[0].data = [0, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000];
            this.charts.hedging.data.datasets[1].data = [0, 30000000, 60000000, 90000000, 120000000, 150000000, 180000000];
            this.charts.hedging.data.datasets[2].data = [0, 20000000, 40000000, 60000000, 80000000, 100000000, 120000000];
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
        document.getElementById('hedgingPnl').textContent = '$0.00';
        document.getElementById('hedgingError').textContent = '0.00%';
        
        this.showNotification('Simulation reset to default values', 'info');
    }
    
    exportData() {
        if (!this.simulationResults) {
            this.showNotification('Please run a simulation first', 'warning');
            return;
        }
        
        // Create CSV content
        const headers = ['Day', 'Cocoa Price', 'Delta', 'Hedged Portfolio', 'Unhedged', 'Hedging Error'];
        const rows = this.simulationResults.days.map((day, i) => [
            day,
            this.simulationResults.prices[i],
            this.simulationResults.deltas[i],
            this.simulationResults.hedgedValues[i],
            this.simulationResults.unhedgedValues[i],
            this.simulationResults.errorValues[i]
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cocoa-hedging-simulation-${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Simulation data exported as CSV!', 'success');
    }
    
    saveScenario() {
        const name = prompt('Enter scenario name:', `Scenario ${new Date().toLocaleDateString()}`);
        if (!name) return;
        
        const scenarios = JSON.parse(localStorage.getItem('cocoaScenarios') || '[]');
        const scenario = {
            id: Date.now(),
            name: name,
            ...this.currentScenario,
            savedAt: new Date().toISOString(),
            savedBy: "Emmanuel Adutwum"
        };
        
        scenarios.push(scenario);
        localStorage.setItem('cocoaScenarios', JSON.stringify(scenarios));
        
        this.showNotification(`Scenario "${name}" saved successfully!`, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.calculator-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `calculator-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Utility functions
    formatNumber(num) {
        if (num >= 1000000000) {
            return `${(num / 1000000000).toFixed(1)}B`;
        } else if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
    
    formatTimeToExpiry(years) {
        const months = years * 12;
        if (months < 1) {
            const days = Math.round(months * 30);
            return `${days} day${days !== 1 ? 's' : ''}`;
        } else if (months < 12) {
            return `${Math.round(months)} month${Math.round(months) !== 1 ? 's' : ''}`;
        } else {
            const yrs = Math.floor(months / 12);
            const mths = Math.round(months % 12);
            return `${yrs} year${yrs !== 1 ? 's' : ''}${mths > 0 ? `, ${mths} month${mths !== 1 ? 's' : ''}` : ''}`;
        }
    }
    
    formatPositionSize(size) {
        const absSize = Math.abs(size);
        const type = size >= 0 ? 'Long' : 'Short';
        return `${absSize} MT (${type})`;
    }
}

// Initialize calculator globally
window.CocoaHedgingSimulator = CocoaHedgingSimulator;

// Auto-initialize on calculator page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.calculator-container')) {
        console.log('🌍 Ghana Cocoa Hedging Simulator - Loading...');
        window.calculator = new CocoaHedgingSimulator();
        
        // Update MathJax if available
        if (window.MathJax) {
            MathJax.typeset();
        }
        
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            .calculator-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            .calculator-notification.success { background: #10b981; }
            .calculator-notification.error { background: #ef4444; }
            .calculator-notification.warning { background: #f59e0b; }
            .calculator-notification.info { background: #3b82f6; }
        `;
        document.head.appendChild(style);
    }
});

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CocoaHedgingSimulator;
}
