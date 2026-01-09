// cocoa-hedging.js - COMPLETE REVISED VERSION WITH CORRECT GHANA FLAG
// Ghana Cocoa Board Hedging Simulator v3.1
// Developer: Emmanuel Adutwum
// GitHub: emmanueladutwum123/ghana-cocoa-hedging

class CocoaHedgingSimulator {
    constructor() {
        this.currentScenario = this.getDefaultScenario();
        this.transactionHistory = [];
        this.simulationResults = null;
        this.charts = {};
        this.isInitialized = false;
        
        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
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
            transactionCost: 0.001,
            simulationDays: 90,
            model: 'black-scholes',
            useTransactionCosts: true
        };
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('🇬🇭 Initializing Ghana Cocoa Hedging Simulator v3.1');
        console.log('⭐ Ghana Flag with Black Star implemented');
        console.log('👨‍💻 Developer: Emmanuel Adutwum');
        
        try {
            this.setupControls();
            this.initializeCharts();
            this.setupEventListeners();
            this.updateCalculations();
            this.updateAllSliderValues();
            this.isInitialized = true;
            
            console.log('✅ Simulator initialized successfully');
            this.showNotification('Ghana Cocoa Hedging Simulator Ready!', 'success');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showNotification('Failed to initialize simulator', 'error');
        }
    }
    
    setupControls() {
        console.log('Setting up controls...');
        
        // Set slider values
        const sliders = ['cocoaPrice', 'strikePrice', 'volatility', 'timeToExpiry', 'positionSize', 'transactionCost'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider && this.currentScenario[sliderId] !== undefined) {
                slider.value = this.currentScenario[sliderId];
            }
        });
        
        // Set option type
        document.querySelectorAll('.option-type-btn').forEach(btn => {
            const isActive = btn.dataset.type === this.currentScenario.optionType;
            btn.classList.toggle('active', isActive);
        });
        
        // Set hedge frequency
        const hedgeSelect = document.getElementById('hedgeFrequency');
        if (hedgeSelect) {
            hedgeSelect.value = this.currentScenario.hedgeFrequency;
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Slider event listeners
        const sliders = ['cocoaPrice', 'strikePrice', 'volatility', 'timeToExpiry', 'positionSize', 'transactionCost'];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                // Clone to remove existing listeners
                const newSlider = slider.cloneNode(true);
                slider.parentNode.replaceChild(newSlider, slider);
                
                newSlider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    this.currentScenario[sliderId] = value;
                    this.updateSliderValueDisplay(sliderId, value);
                    this.updateCalculations();
                });
                
                // Add change event for better mobile support
                newSlider.addEventListener('change', (e) => {
                    const value = parseFloat(e.target.value);
                    this.currentScenario[sliderId] = value;
                    this.updateSliderValueDisplay(sliderId, value);
                    this.updateCalculations();
                });
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
            console.log('Found run button, attaching click handler...');
            
            // Remove any existing listeners
            const newRunBtn = runBtn.cloneNode(true);
            runBtn.parentNode.replaceChild(newRunBtn, runBtn);
            
            newRunBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('▶️ Run Simulation clicked');
                this.runSimulation();
            });
            
            // Also allow Enter key on the button
            newRunBtn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.runSimulation();
                }
            });
        } else {
            console.error('❌ Run Simulation button not found!');
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetSimulation');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSimulation());
        }
        
        // Export button
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // Save scenario button
        const saveBtn = document.getElementById('saveScenario');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveScenario());
        }
        
        console.log('✅ Event listeners setup complete');
    }
    
    updateSliderValueDisplay(sliderId, value) {
        const valueElement = document.getElementById(`${sliderId}Value`);
        if (!valueElement) {
            console.warn(`Value display not found: ${sliderId}Value`);
            return;
        }
        
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
        const sliders = ['cocoaPrice', 'strikePrice', 'volatility', 'timeToExpiry', 'positionSize', 'transactionCost'];
        sliders.forEach(sliderId => {
            this.updateSliderValueDisplay(sliderId, this.currentScenario[sliderId]);
        });
    }
    
    initializeCharts() {
        console.log('Initializing charts...');
        
        // Initialize price & delta chart
        const priceDeltaCanvas = document.getElementById('priceDeltaChart');
        if (priceDeltaCanvas) {
            this.initializePriceDeltaChart(priceDeltaCanvas);
        } else {
            console.warn('PriceDeltaChart canvas not found');
        }
        
        // Initialize hedging performance chart
        const hedgingCanvas = document.getElementById('hedgingChart');
        if (hedgingCanvas) {
            this.initializeHedgingChart(hedgingCanvas);
        } else {
            console.warn('HedgingChart canvas not found');
        }
    }
    
    initializePriceDeltaChart(canvas) {
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if present
        if (this.charts.priceDelta) {
            this.charts.priceDelta.destroy();
        }
        
        this.charts.priceDelta = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 0', 'Day 15', 'Day 30', 'Day 45', 'Day 60', 'Day 75', 'Day 90'],
                datasets: [
                    {
                        label: 'Cocoa Price ($/MT)',
                        data: [2500, 2550, 2600, 2650, 2700, 2750, 2800],
                        borderColor: '#CE1126', // Ghana Red
                        backgroundColor: 'rgba(206, 17, 38, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Delta (Δ)',
                        data: [0.45, 0.48, 0.52, 0.55, 0.58, 0.60, 0.62],
                        borderColor: '#FCD116', // Ghana Gold
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
                        labels: { 
                            padding: 20,
                            color: '#212529',
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#212529',
                        bodyColor: '#495057',
                        borderColor: '#E9ECEF',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#495057' }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: { 
                            display: true, 
                            text: 'Price ($/MT)',
                            color: '#CE1126',
                            font: { weight: 'bold' }
                        },
                        ticks: { 
                            callback: value => `$${this.formatNumber(value)}`,
                            color: '#CE1126'
                        },
                        grid: { color: 'rgba(206, 17, 38, 0.1)' }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { 
                            display: true, 
                            text: 'Delta',
                            color: '#FCD116',
                            font: { weight: 'bold' }
                        },
                        min: 0,
                        max: 1,
                        grid: { drawOnChartArea: false },
                        ticks: { 
                            color: '#FCD116',
                            callback: value => value.toFixed(2)
                        }
                    }
                }
            }
        });
    }
    
    initializeHedgingChart(canvas) {
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if present
        if (this.charts.hedging) {
            this.charts.hedging.destroy();
        }
        
        // Generate sample data like your screenshot
        const days = 90;
        const labels = Array.from({length: days + 1}, (_, i) => `Day ${i}`);
        
        this.charts.hedging = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Hedged Portfolio',
                        data: this.generateHedgedData(days),
                        borderColor: '#006B3F', // Ghana Green
                        backgroundColor: 'rgba(0, 107, 63, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Unhedged',
                        data: this.generateUnhedgedData(days),
                        borderColor: '#CE1126', // Ghana Red
                        backgroundColor: 'rgba(206, 17, 38, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Hedging Error',
                        data: this.generateErrorData(days),
                        borderColor: '#000000', // Black for error line
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
                        labels: { 
                            padding: 20,
                            color: '#212529',
                            font: { size: 14 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
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
                            text: 'Days',
                            color: '#495057',
                            font: { weight: 'bold' }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#495057' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Portfolio Value ($)',
                            color: '#495057',
                            font: { weight: 'bold' }
                        },
                        ticks: { 
                            callback: value => {
                                if (Math.abs(value) >= 1000000000) {
                                    return `$${(value/1000000000).toFixed(1)}B`;
                                } else if (Math.abs(value) >= 1000000) {
                                    return `$${(value/1000000).toFixed(1)}M`;
                                } else if (Math.abs(value) >= 1000) {
                                    return `$${(value/1000).toFixed(1)}K`;
                                }
                                return `$${this.formatNumber(value)}`;
                            },
                            color: '#495057'
                        },
                        suggestedMin: -50000000,
                        suggestedMax: 300000000,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    }
                }
            }
        });
    }
    
    generateHedgedData(days) {
        const data = [0];
        let value = 0;
        for (let i = 1; i <= days; i++) {
            // More stable growth with small fluctuations
            const growth = 3500000 + (Math.random() * 1000000 - 500000);
            value += growth;
            data.push(value);
        }
        return data;
    }
    
    generateUnhedgedData(days) {
        const data = [0];
        let value = 0;
        for (let i = 1; i <= days; i++) {
            // More volatile growth
            const growth = 2000000 + (Math.random() * 3000000 - 1500000);
            value += growth;
            data.push(value);
        }
        return data;
    }
    
    generateErrorData(days) {
        const data = [0];
        for (let i = 1; i <= days; i++) {
            // Error increases but with randomness
            const error = 1500000 + (Math.random() * 1000000 - 500000);
            data.push(data[i-1] + error);
        }
        return data;
    }
    
    updateCalculations() {
        try {
            const calculations = this.calculateOptionPrice();
            this.updateDisplay(calculations);
            this.updateGreeks(calculations.greeks);
        } catch (error) {
            console.error('Calculation error:', error);
            this.showNotification('Error in calculation. Please check parameters.', 'error');
        }
    }
    
    calculateOptionPrice() {
        const S = this.currentScenario.cocoaPrice;
        const K = this.currentScenario.strikePrice;
        const T = Math.max(this.currentScenario.timeToExpiry, 0.0001);
        const r = this.currentScenario.riskFreeRate;
        const σ = Math.max(this.currentScenario.volatility, 0.0001);
        const δ = this.currentScenario.convenienceYield;
        const isCall = this.currentScenario.optionType === 'call';
        
        // Handle edge cases
        if (T <= 0 || S <= 0 || σ <= 0) {
            const intrinsic = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
            return {
                price: intrinsic,
                greeks: {
                    delta: isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0),
                    gamma: 0,
                    theta: 0,
                    vega: 0,
                    rho: 0
                },
                isITM: isCall ? S > K : S < K,
                intrinsicValue: intrinsic,
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
        
        // Ensure non-negative price
        price = Math.max(price, 0);
        
        // Calculate Greeks
        const greeks = {
            delta: this.calculateDelta(S, K, T, r, σ, δ, isCall),
            gamma: this.calculateGamma(S, K, T, r, σ, δ),
            theta: this.calculateTheta(S, K, T, r, σ, δ, isCall) / 365,
            vega: this.calculateVega(S, K, T, r, σ, δ) / 100,
            rho: this.calculateRho(S, K, T, r, σ, δ, isCall) / 100
        };
        
        return {
            price: price,
            greeks: greeks,
            isITM: isCall ? S > K : S < K,
            intrinsicValue: Math.max(isCall ? S - K : K - S, 0),
            timeValue: Math.max(price - Math.max(isCall ? S - K : K - S, 0), 0)
        };
    }
    
    calculateDelta(S, K, T, r, σ, δ, isCall) {
        if (T <= 0) return isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0);
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
        
        // Update delta value
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
        
        // Reset simulation results if no simulation run
        if (!this.simulationResults) {
            const hedgingPnlElement = document.getElementById('hedgingPnl');
            if (hedgingPnlElement) {
                hedgingPnlElement.textContent = '$0.00';
                const pnlChange = hedgingPnlElement.closest('.result-card')?.querySelector('.result-change');
                if (pnlChange) {
                    pnlChange.innerHTML = '<i class="fas fa-play"></i> Run simulation';
                    pnlChange.className = 'result-change neutral';
                }
            }
            
            const hedgingErrorElement = document.getElementById('hedgingError');
            if (hedgingErrorElement) {
                hedgingErrorElement.textContent = '0.00%';
                const errorChange = hedgingErrorElement.closest('.result-card')?.querySelector('.result-change');
                if (errorChange) {
                    errorChange.innerHTML = '<i class="fas fa-check"></i> Optimal';
                    errorChange.className = 'result-change positive';
                }
            }
        }
    }
    
    updateGreeks(greeks) {
        // Update Greek values display
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
        
        // Update Greek bars visualization
        this.updateGreekBars(greeks);
    }
    
    updateGreekBars(greeks) {
        const normalized = {
            delta: Math.abs(greeks.delta) * 100,
            gamma: Math.min(Math.abs(greeks.gamma) * 10000, 100),
            theta: Math.min(Math.abs(greeks.theta) * 10, 100),
            vega: Math.min(Math.abs(greeks.vega) * 0.2, 100),
            rho: Math.min(Math.abs(greeks.rho) * 10, 100)
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
                    fill.style.background = '#CE1126'; // Ghana Red for negative
                    fill.classList.add('negative');
                } else {
                    // Ghana flag colors for positive values
                    fill.style.background = 'linear-gradient(90deg, #CE1126, #FCD116, #006B3F)';
                    fill.classList.remove('negative');
                }
            }
        });
    }
    
    runSimulation() {
        console.log('Running hedging simulation...');
        
        const button = document.getElementById('runSimulation');
        if (!button) {
            this.showNotification('Simulation button not found!', 'error');
            return;
        }
        
        // Show loading state
        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulating...';
        button.disabled = true;
        
        try {
            // Generate simulation data
            this.simulationResults = this.generateSimulationData();
            
            // Update UI with results
            this.updateSimulationResults();
            this.updateCharts();
            this.updateTransactionsTable();
            
            console.log('✅ Simulation completed successfully');
            this.showNotification('Hedging simulation completed!', 'success');
        } catch (error) {
            console.error('Simulation error:', error);
            this.showNotification('Simulation failed: ' + error.message, 'error');
        } finally {
            // Restore button state
            button.innerHTML = originalText;
            button.disabled = originalDisabled;
        }
    }
    
    generateSimulationData() {
        const days = this.currentScenario.simulationDays;
        const hedgeFreq = this.getHedgeFrequencyDays();
        
        console.log(`Generating ${days}-day simulation with ${hedgeFreq}-day rebalancing`);
        
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
        const positionSize = Math.abs(this.currentScenario.positionSize);
        const isShort = this.currentScenario.positionSize < 0;
        
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
            const originalPrice = this.currentScenario.cocoaPrice;
            this.currentScenario.cocoaPrice = currentPrice;
            const currentDelta = this.calculateOptionPrice().greeks.delta;
            this.currentScenario.cocoaPrice = originalPrice;
            deltas.push(currentDelta);
            
            // Calculate unhedged P&L
            const priceChange = currentPrice - prices[0];
            const unhedgedPnl = (isShort ? -1 : 1) * positionSize * priceChange;
            unhedgedValues.push(unhedgedPnl);
            
            // Check if rebalancing needed
            if (day % hedgeFreq === 0) {
                const deltaChange = currentDelta - previousDelta;
                const hedgeTrade = -deltaChange * positionSize;
                
                // Calculate transaction cost
                const cost = Math.abs(hedgeTrade * currentPrice * this.currentScenario.transactionCost);
                totalCosts += cost;
                
                // Calculate P&L from delta change
                const priceChangeSinceLast = currentPrice - prices[day - hedgeFreq];
                const deltaPnL = previousDelta * positionSize * priceChangeSinceLast * (isShort ? -1 : 1);
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
            
            // Update hedged portfolio value
            const hedgedPnl = cumulativePnL;
            const hedgingError = Math.abs(unhedgedPnl - hedgedPnl);
            
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
            netPnL: cumulativePnL,
            hedgingError: errorValues[errorValues.length - 1],
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
            default: return 7; // weekly default
        }
    }
    
    randomNormal() {
        // Box-Muller transform for normal distribution
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
                const isProfit = results.netPnL >= 0;
                changeElement.innerHTML = isProfit ? 
                    '<i class="fas fa-arrow-up"></i> Profit' : 
                    '<i class="fas fa-arrow-down"></i> Loss';
                changeElement.className = `result-change ${isProfit ? 'positive' : 'negative'}`;
            }
        }
        
        // Update hedging error
        const hedgingErrorElement = document.getElementById('hedgingError');
        if (hedgingErrorElement) {
            const baseValue = Math.max(Math.abs(results.netPnL), Math.abs(results.hedgingError), 1);
            const errorPercent = (results.hedgingError / baseValue) * 100;
            hedgingErrorElement.textContent = `${errorPercent.toFixed(2)}%`;
            
            // Update change indicator
            const errorChange = hedgingErrorElement.closest('.result-card')?.querySelector('.result-change');
            if (errorChange) {
                const isOptimal = errorPercent < 5; // Less than 5% error is optimal
                errorChange.innerHTML = isOptimal ? 
                    '<i class="fas fa-check"></i> Optimal' : 
                    '<i class="fas fa-exclamation-triangle"></i> High Error';
                errorChange.className = `result-change ${isOptimal ? 'positive' : 'warning'}`;
            }
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
        
        // Update Hedging Chart
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
        
        // Show all transactions (or last 20 if many)
        const displayTransactions = this.simulationResults.transactions.slice(-20);
        tbody.innerHTML = displayTransactions.map(t => `
            <tr>
                <td>Day ${t.day}</td>
                <td>$${parseFloat(t.price).toFixed(2)}</td>
                <td>${t.delta}</td>
                <td>${t.hedgeTrade} MT</td>
                <td>$${parseFloat(t.transactionCost).toFixed(2)}</td>
                <td class="${parseFloat(t.pnlImpact) >= 0 ? 'positive' : 'negative'}">
                    $${parseFloat(t.pnlImpact).toFixed(2)}
                </td>
            </tr>
        `).join('');
    }
    
    resetSimulation() {
        console.log('Resetting simulation...');
        
        this.currentScenario = this.getDefaultScenario();
        this.simulationResults = null;
        
        // Reset UI controls
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
            const days = 90;
            this.charts.hedging.data.labels = Array.from({length: days + 1}, (_, i) => `Day ${i}`);
            this.charts.hedging.data.datasets[0].data = this.generateHedgedData(days);
            this.charts.hedging.data.datasets[1].data = this.generateUnhedgedData(days);
            this.charts.hedging.data.datasets[2].data = this.generateErrorData(days);
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
        
        // Reset results display
        const hedgingPnlElement = document.getElementById('hedgingPnl');
        if (hedgingPnlElement) {
            hedgingPnlElement.textContent = '$0.00';
        }
        
        const hedgingErrorElement = document.getElementById('hedgingError');
        if (hedgingErrorElement) {
            hedgingErrorElement.textContent = '0.00%';
        }
        
        this.showNotification('Simulation reset to default values', 'info');
    }
    
    exportData() {
        if (!this.simulationResults) {
            this.showNotification('Please run a simulation first', 'warning');
            return;
        }
        
        try {
            // Create CSV content
            const headers = ['Day', 'Cocoa Price', 'Delta', 'Hedged Portfolio Value', 'Unhedged Value', 'Hedging Error'];
            const rows = this.simulationResults.days.map((day, i) => [
                day,
                this.simulationResults.prices[i].toFixed(2),
                this.simulationResults.deltas[i].toFixed(4),
                this.simulationResults.hedgedValues[i].toFixed(2),
                this.simulationResults.unhedgedValues[i].toFixed(2),
                this.simulationResults.errorValues[i].toFixed(2)
            ]);
            
            const csvContent = [
                'Ghana Cocoa Hedging Simulation Data',
                `Generated: ${new Date().toLocaleString()}`,
                `Developer: Emmanuel Adutwum`,
                `Website: https://emmanueladutwum123.github.io/ghana-cocoa-hedging/`,
                '',
                'Scenario Parameters:',
                `Cocoa Price: $${this.currentScenario.cocoaPrice}`,
                `Strike Price: $${this.currentScenario.strikePrice}`,
                `Volatility: ${(this.currentScenario.volatility * 100).toFixed(1)}%`,
                `Time to Expiry: ${this.formatTimeToExpiry(this.currentScenario.timeToExpiry)}`,
                `Option Type: ${this.currentScenario.optionType.toUpperCase()}`,
                `Position Size: ${this.currentScenario.positionSize} MT`,
                `Hedge Frequency: ${this.currentScenario.hedgeFrequency}`,
                `Transaction Cost: ${(this.currentScenario.transactionCost * 100).toFixed(2)}%`,
                '',
                'Simulation Results:',
                `Final P&L: $${this.simulationResults.netPnL.toFixed(2)}`,
                `Total Costs: $${this.simulationResults.totalCosts.toFixed(2)}`,
                `Hedging Error: $${this.simulationResults.hedgingError.toFixed(2)}`,
                '',
                'Daily Data:',
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cocoa-hedging-${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('Simulation data exported as CSV', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }
    
    saveScenario() {
        const defaultName = `Scenario ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        const name = prompt('Enter scenario name:', defaultName);
        
        if (!name || name.trim() === '') {
            this.showNotification('Scenario name cannot be empty', 'warning');
            return;
        }
        
        try {
            const scenarios = JSON.parse(localStorage.getItem('cocoaScenarios') || '[]');
            const scenario = {
                id: Date.now(),
                name: name.trim(),
                ...this.currentScenario,
                savedAt: new Date().toISOString(),
                savedBy: "Emmanuel Adutwum",
                project: "Ghana Cocoa Hedging Research Platform"
            };
            
            scenarios.push(scenario);
            localStorage.setItem('cocoaScenarios', JSON.stringify(scenarios));
            
            this.showNotification(`Scenario "${name}" saved successfully!`, 'success');
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Failed to save scenario', 'error');
        }
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
        
        // Add styles if not present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .calculator-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius);
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 9999;
                    box-shadow: var(--shadow-lg);
                    animation: slideIn 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                    font-size: var(--font-sm);
                }
                .calculator-notification.success {
                    background: linear-gradient(135deg, #006B3F, #28A745);
                    border-left: 4px solid #004D29;
                }
                .calculator-notification.error {
                    background: linear-gradient(135deg, #CE1126, #DC3545);
                    border-left: 4px solid #8B0000;
                }
                .calculator-notification.warning {
                    background: linear-gradient(135deg, #FCD116, #FFC107);
                    border-left: 4px solid #D4AC0D;
                    color: #212529;
                }
                .calculator-notification.info {
                    background: linear-gradient(135deg, #006B3F, #17A2B8);
                    border-left: 4px solid #004D29;
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
            document.head.appendChild(style);
        }
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Utility functions
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        
        const absNum = Math.abs(num);
        if (absNum >= 1000000000) {
            return `${(num / 1000000000).toFixed(1)}B`;
        } else if (absNum >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (absNum >= 1000) {
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
        return `${absSize} MT (${type})`;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the calculator page
    const hasCalculator = document.querySelector('.calculator-container') || 
                         window.location.pathname.includes('calculator');
    
    if (hasCalculator) {
        console.log('🇬🇭 Ghana Cocoa Hedging Calculator - Loading...');
        
        // Add custom styles with correct Ghana flag colors
        const customStyles = document.createElement('style');
        customStyles.textContent = `
            /* Correct Ghana Flag Colors */
            :root {
                --ghana-red: #CE1126;
                --ghana-gold: #FCD116;
                --ghana-green: #006B3F;
                --ghana-black: #000000;
            }
            
            /* Ghana flag styling for navigation */
            .flag-mini {
                position: relative;
                width: 40px;
                height: 28px;
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 2px solid rgba(0,0,0,0.1);
            }
            
            .flag-red { 
                background: var(--ghana-red); 
                height: 33.33%; 
                position: relative;
            }
            
            .flag-yellow { 
                background: var(--ghana-gold); 
                height: 33.33%; 
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .flag-green { 
                background: var(--ghana-green); 
                height: 33.33%; 
                position: relative;
            }
            
            /* Black Star on yellow stripe */
            .flag-yellow::after {
                content: "★";
                color: var(--ghana-black);
                font-size: 12px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            /* Enhance slider visibility with Ghana colors */
            input[type="range"] {
                -webkit-appearance: none;
                height: 10px;
                background: linear-gradient(to right, var(--ghana-red), var(--ghana-gold), var(--ghana-green));
                border-radius: 5px;
                margin: 10px 0;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 24px;
                height: 24px;
                background: var(--ghana-black);
                border: 3px solid var(--ghana-gold);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
            }
            
            input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                background: var(--ghana-green);
            }
            
            /* Ghana flag colored buttons */
            #runSimulation {
                background: linear-gradient(135deg, var(--ghana-red), var(--ghana-green));
                font-weight: 700;
                letter-spacing: 0.5px;
                border: 2px solid var(--ghana-gold);
            }
            
            #runSimulation:hover {
                background: linear-gradient(135deg, var(--ghana-green), var(--ghana-red));
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(206, 17, 38, 0.3);
            }
            
            /* Result cards with Ghana colors */
            .result-change.positive {
                background: rgba(0, 107, 63, 0.1);
                color: var(--ghana-green);
            }
            
            .result-change.negative {
                background: rgba(206, 17, 38, 0.1);
                color: var(--ghana-red);
            }
            
            /* Greek bars with Ghana flag gradient */
            .greek-fill:not(.negative) {
                background: linear-gradient(90deg, var(--ghana-red), var(--ghana-gold), var(--ghana-green)) !important;
            }
            
            /* Chart enhancements */
            .chart-container {
                background: linear-gradient(135deg, rgba(206, 17, 38, 0.02), rgba(252, 209, 22, 0.02), rgba(0, 107, 63, 0.02));
                border-radius: 12px;
                padding: 15px;
                border: 2px solid rgba(206, 17, 38, 0.1);
            }
            
            /* Developer credit with Ghana theme */
            .developer-credit {
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 3px solid var(--ghana-gold);
                background: linear-gradient(135deg, rgba(206, 17, 38, 0.05), rgba(252, 209, 22, 0.05), rgba(0, 107, 63, 0.05));
                padding: 2rem;
                border-radius: 12px;
                position: relative;
                overflow: hidden;
            }
            
            .developer-credit::before {
                content: "★";
                position: absolute;
                top: 10px;
                right: 10px;
                color: var(--ghana-gold);
                font-size: 24px;
                opacity: 0.3;
            }
            
            .developer-credit h3 {
                color: var(--ghana-green);
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .developer-credit h3 i {
                color: var(--ghana-red);
            }
            
            .developer-info p {
                border-left: 3px solid var(--ghana-gold);
                padding-left: 1rem;
                margin-bottom: 1rem;
            }
            
            .developer-info p i {
                color: var(--ghana-red);
            }
            
            /* Table header with Ghana colors */
            .transactions-table th {
                background: linear-gradient(135deg, var(--ghana-red), var(--ghana-green));
                color: white;
                font-weight: 600;
            }
            
            .transactions-table tr:hover {
                background: rgba(252, 209, 22, 0.05);
            }
            
            /* Loading spinner with Ghana colors */
            .fa-spinner.fa-spin {
                color: var(--ghana-gold);
            }
            
            /* Ghana-themed section headers */
            h2, h3 {
                position: relative;
            }
            
            h2::after, h3::after {
                content: "";
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 50px;
                height: 3px;
                background: linear-gradient(to right, var(--ghana-red), var(--ghana-gold), var(--ghana-green));
                border-radius: 2px;
            }
        `;
        document.head.appendChild(customStyles);
        
        // Add developer credit if not present
        if (!document.querySelector('.developer-credit')) {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                const developerCredit = document.createElement('div');
                developerCredit.className = 'developer-credit';
                developerCredit.innerHTML = `
                    <h3><i class="fas fa-code"></i> Developer Information</h3>
                    <div class="developer-info">
                        <p><i class="fas fa-user"></i> <strong>Developer:</strong> Emmanuel Adutwum</p>
                        <p><i class="fas fa-github"></i> <strong>GitHub:</strong> <a href="https://github.com/emmanueladutwum123" target="_blank">@emmanueladutwum123</a></p>
                        <p><i class="fas fa-globe"></i> <strong>Website:</strong> <a href="https://emmanueladutwum123.github.io/ghana-cocoa-hedging/" target="_blank">Ghana Cocoa Hedging Platform</a></p>
                        <p><i class="fas fa-calculator"></i> <strong>Simulator Version:</strong> 3.1 (Black-Scholes with Convenience Yield)</p>
                        <p><i class="fas fa-university"></i> <strong>Institution:</strong> Ghana Cocoa Board (COCOBOD) Research Platform</p>
                        <p><i class="fas fa-flag"></i> <strong>Theme:</strong> 🇬🇭 Ghana Flag Colors (Red, Gold, Green, Black Star)</p>
                    </div>
                `;
                mainContent.appendChild(developerCredit);
            }
        }
        
        // Initialize the calculator
        window.calculator = new CocoaHedgingSimulator();
        
        // Make it globally accessible
        window.CocoaHedgingSimulator = CocoaHedgingSimulator;
        
        console.log('✅ Calculator initialized with Ghana flag theme!');
        
        // Update MathJax if available
        if (window.MathJax) {
            setTimeout(() => {
                MathJax.typeset();
            }, 1000);
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CocoaHedgingSimulator;
}
