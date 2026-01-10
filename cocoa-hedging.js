// cocoa-hedging.js - COMPLETE REVISED VERSION WITH AI INTEGRATION
// Ghana Cocoa Board Hedging Simulator v3.2 with AI Assistant
// Developer: Emmanuel Adutwum
// GitHub: emmanueladutwum123/ghana-cocoa-hedging

class CocoaHedgingSimulator {
    constructor() {
        this.currentScenario = this.getDefaultScenario();
        this.transactionHistory = [];
        this.simulationResults = null;
        this.charts = {};
        this.isInitialized = false;
        
        // Initialize AI integration
        this.aiHelper = new AIHedgingHelper();
        
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
        
        console.log('🇬🇭 Initializing Ghana Cocoa Hedging Simulator v3.2 with AI');
        console.log('⭐ Ghana Flag with Black Star implemented');
        console.log('🤖 AI Hedging Assistant integrated');
        console.log('👨‍💻 Developer: Emmanuel Adutwum');
        
        try {
            this.setupControls();
            this.initializeCharts();
            this.setupEventListeners();
            this.updateCalculations();
            this.updateAllSliderValues();
            this.isInitialized = true;
            
            console.log('✅ Simulator initialized successfully');
            this.showNotification('Ghana Cocoa Hedging Simulator with AI Ready!', 'success');
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
        
        // AI Analysis button (added dynamically)
        setTimeout(() => {
            this.addAIAnalysisButton();
        }, 100);
        
        console.log('✅ Event listeners setup complete');
    }
    
    addAIAnalysisButton() {
        const controlActions = document.querySelector('.control-actions');
        if (controlActions && !document.getElementById('aiAnalysisBtn')) {
            const aiButton = document.createElement('button');
            aiButton.id = 'aiAnalysisBtn';
            aiButton.className = 'btn btn-secondary';
            aiButton.innerHTML = '<i class="fas fa-robot"></i> AI Analysis';
            aiButton.style.background = 'linear-gradient(135deg, #006B3F, #FCD116)';
            aiButton.style.marginLeft = '10px';
            aiButton.style.border = '2px solid #CE1126';
            
            controlActions.appendChild(aiButton);
            
            aiButton.addEventListener('click', () => {
                this.showScenarioExplanation();
            });
        }
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
                'Ghana Cocoa Hedging Simulation Data with AI Analysis',
                `Generated: ${new Date().toLocaleString()}`,
                `Developer: Emmanuel Adutwum`,
                `Contact: emmanueladutwum900@yahoo.com`,
                `Phone: +233 553483918`,
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
                'AI Analysis:',
                ...this.explainCurrentScenario().split('\n'),
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
            link.download = `cocoa-hedging-ai-${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('Simulation data with AI analysis exported as CSV', 'success');
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
                project: "Ghana Cocoa Hedging Research Platform with AI"
            };
            
            scenarios.push(scenario);
            localStorage.setItem('cocoaScenarios', JSON.stringify(scenarios));
            
            this.showNotification(`Scenario "${name}" saved successfully!`, 'success');
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Failed to save scenario', 'error');
        }
    }
    
    // Add AI explanation method
    explainCurrentScenario() {
        const scenario = this.currentScenario;
        const calculations = this.calculateOptionPrice();
        
        let explanation = `**Current Scenario Analysis:**\n\n`;
        
        // Moneyness analysis
        const isITM = scenario.optionType === 'call' ? 
            scenario.cocoaPrice > scenario.strikePrice : 
            scenario.cocoaPrice < scenario.strikePrice;
        
        const moneyness = Math.abs(scenario.cocoaPrice - scenario.strikePrice) / scenario.strikePrice;
        
        explanation += `**Moneyness:** ${isITM ? 'In-the-Money' : 'Out-of-the-Money'}\n`;
        explanation += `**Moneyness Percentage:** ${(moneyness * 100).toFixed(2)}%\n`;
        explanation += `**Time to Expiry:** ${this.formatTimeToExpiry(scenario.timeToExpiry)}\n\n`;
        
        // Greeks explanation
        explanation += `**Option Greeks:**\n`;
        explanation += `- **Delta (${calculations.greeks.delta.toFixed(3)})**: `;
        if (Math.abs(calculations.greeks.delta) > 0.7) {
            explanation += 'High sensitivity to price changes. ';
        } else if (Math.abs(calculations.greeks.delta) > 0.3) {
            explanation += 'Moderate sensitivity. ';
        } else {
            explanation += 'Low sensitivity. ';
        }
        explanation += `Hedge with ${Math.abs(calculations.greeks.delta * scenario.positionSize).toFixed(1)} MT.\n`;
        
        explanation += `- **Gamma (${calculations.greeks.gamma.toFixed(4)})**: `;
        if (calculations.greeks.gamma > 0.002) {
            explanation += 'High gamma - delta changes rapidly. Rebalance frequently.\n';
        } else {
            explanation += 'Low gamma - delta stable. Less frequent rebalancing.\n';
        }
        
        explanation += `- **Theta (${calculations.greeks.theta.toFixed(2)}/day)**: `;
        explanation += `Time decay of $${Math.abs(calculations.greeks.theta).toFixed(2)} per day.\n`;
        
        explanation += `- **Vega (${calculations.greeks.vega.toFixed(1)})**: `;
        explanation += `1% volatility change = $${calculations.greeks.vega.toFixed(1)} option price change.\n\n`;
        
        // Hedging recommendation
        explanation += `**Hedging Recommendation:**\n`;
        
        const optimalFrequency = this.aiHelper.getOptimalHedgingFrequency(
            calculations.greeks.gamma,
            scenario.transactionCost,
            scenario.volatility
        );
        
        explanation += `- **Frequency:** ${optimalFrequency.frequency} (${optimalFrequency.reason})\n`;
        explanation += `- **Expected Tracking Error:** ${optimalFrequency.trackingError}%\n`;
        explanation += `- **Cost Efficiency:** ${optimalFrequency.costEfficiency}\n`;
        
        // Risk metrics
        if (this.simulationResults) {
            explanation += `\n**Simulation Results:**\n`;
            explanation += `- **Final P&L:** $${this.simulationResults.netPnL.toFixed(2)}\n`;
            explanation += `- **Hedging Error:** ${(this.simulationResults.hedgingError / Math.abs(this.simulationResults.netPnL || 1) * 100).toFixed(2)}%\n`;
            explanation += `- **Max Drawdown:** $${Math.min(...this.simulationResults.hedgedValues).toFixed(2)}\n`;
        }
        
        // Ghana context
        explanation += `\n**Ghana Context:**\n`;
        explanation += `- COCOBOD typically hedges ${scenario.positionSize > 0 ? 'long' : 'short'} positions\n`;
        explanation += `- Transaction costs in Ghana: ~0.3-0.5% per trade\n`;
        explanation += `- Consider currency risk (GHS/USD) for complete hedge\n`;
        
        explanation += `\n**For detailed analysis:** Contact emmanueladutwum900@yahoo.com or +233 553483918`;
        
        return explanation;
    }
    
    showScenarioExplanation() {
        const explanation = this.explainCurrentScenario();
        
        // Create modal for explanation
        const modalId = 'aiExplanationModal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #006B3F, #FCD116); color: white;">
                            <h5 class="modal-title"><i class="fas fa-robot"></i> AI Hedging Analysis</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="explanation-content" style="white-space: pre-line; font-family: monospace; padding: 15px; background: #f8f9fa; border-radius: 5px; max-height: 400px; overflow-y: auto;">
                                ${explanation}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Close
                            </button>
                            <button type="button" class="btn btn-primary" id="runWithAI">
                                <i class="fas fa-play"></i> Run Optimized Simulation
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Initialize Bootstrap modal
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            } else {
                // Fallback if Bootstrap not available
                modal.style.display = 'block';
                modal.style.position = 'fixed';
                modal.style.top = '50%';
                modal.style.left = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
                modal.style.zIndex = '10000';
                modal.style.background = 'white';
                modal.style.padding = '20px';
                modal.style.borderRadius = '10px';
                modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
                modal.style.maxWidth = '80%';
                modal.style.maxHeight = '80%';
                modal.style.overflow = 'auto';
                
                // Add close button functionality
                const closeBtn = modal.querySelector('.btn-close, .btn-secondary');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                }
            }
            
            // Add event listener for optimized simulation
            const runWithAI = modal.querySelector('#runWithAI');
            if (runWithAI) {
                runWithAI.addEventListener('click', () => {
                    this.runOptimizedSimulation();
                    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                        const bsModalInstance = bootstrap.Modal.getInstance(modal);
                        if (bsModalInstance) bsModalInstance.hide();
                    } else {
                        modal.style.display = 'none';
                    }
                });
            }
        } else {
            // Update existing modal
            modal.querySelector('.explanation-content').textContent = explanation;
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            } else {
                modal.style.display = 'block';
            }
        }
    }
    
    runOptimizedSimulation() {
        const calculations = this.calculateOptionPrice();
        
        // AI-based optimization
        if (calculations.greeks.gamma > 0.002) {
            this.currentScenario.hedgeFrequency = 'daily';
            this.showNotification('AI: High gamma detected. Using daily rebalancing.', 'info');
        } else if (this.currentScenario.transactionCost > 0.002) {
            this.currentScenario.hedgeFrequency = 'weekly';
            this.showNotification('AI: High transaction costs. Using weekly rebalancing.', 'info');
        }
        
        // Update UI
        const hedgeSelect = document.getElementById('hedgeFrequency');
        if (hedgeSelect) {
            hedgeSelect.value = this.currentScenario.hedgeFrequency;
        }
        
        // Run simulation
        this.runSimulation();
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

// AI Helper Class for Hedging
class AIHedgingHelper {
    constructor() {
        this.historicalData = this.generateHistoricalData();
    }
    
    getOptimalHedgingFrequency(gamma, transactionCost, volatility) {
        // AI logic to determine optimal hedging frequency
        
        const gammaScore = gamma * 1000; // Normalize gamma
        const costScore = transactionCost * 1000; // Normalize cost
        const volScore = volatility * 100; // Normalize volatility
        
        const totalScore = gammaScore * 0.4 + costScore * 0.3 + volScore * 0.3;
        
        if (totalScore > 1.5) {
            return {
                frequency: 'daily',
                reason: 'High gamma and volatility',
                trackingError: '0.5-1.0%',
                costEfficiency: 'Moderate'
            };
        } else if (totalScore > 0.8) {
            return {
                frequency: 'weekly',
                reason: 'Balanced risk/cost',
                trackingError: '1.0-2.0%',
                costEfficiency: 'High'
            };
        } else {
            return {
                frequency: 'monthly',
                reason: 'Low gamma and costs',
                trackingError: '2.0-4.0%',
                costEfficiency: 'Very High'
            };
        }
    }
    
    calculateOptimalHedgeRatio(optionDelta, positionSize, correlation = 0.85) {
        // Calculate optimal hedge ratio considering correlation
        const naiveHedge = -optionDelta * positionSize;
        const optimalHedge = naiveHedge * correlation;
        
        return {
            naive: naiveHedge,
            optimal: optimalHedge,
            adjustment: ((optimalHedge - naiveHedge) / Math.abs(naiveHedge) * 100).toFixed(1) + '%',
            explanation: `Based on ${(correlation * 100).toFixed(0)}% historical correlation`
        };
    }
    
    generateHistoricalData() {
        // Generate synthetic historical data for analysis
        return {
            priceCorrelations: {
                'Cocoa-USD/GHS': 0.65,
                'Cocoa-Coffee': 0.45,
                'Cocoa-Sugar': 0.30,
                'Cocoa-Equities': 0.15
            },
            seasonalPatterns: {
                'Jan-Mar': { avgReturn: 0.025, volatility: 0.28 },
                'Apr-Jun': { avgReturn: 0.015, volatility: 0.32 },
                'Jul-Sep': { avgReturn: -0.010, volatility: 0.35 },
                'Oct-Dec': { avgReturn: 0.020, volatility: 0.30 }
            },
            stressScenarios: {
                'El_Nino_2016': { return: -0.30, duration: 180 },
                'COVID_2020': { return: -0.18, duration: 90 },
                'Financial_2008': { return: -0.42, duration: 180 }
            }
        };
    }
    
    analyzeStressScenario(scenarioName, position) {
        const scenario = this.historicalData.stressScenarios[scenarioName];
        if (!scenario) return null;
        
        const loss = position * scenario.return;
        const recoveryDays = scenario.duration * 0.8; // 80% recovery time
        
        return {
            scenario: scenarioName,
            estimatedLoss: `$${Math.abs(loss).toFixed(2)}`,
            lossPercentage: `${Math.abs(scenario.return * 100).toFixed(1)}%`,
            recoveryTime: `${recoveryDays} days`,
            recommendation: this.getStressRecommendation(scenario.return)
        };
    }
    
    getStressRecommendation(lossPercentage) {
        if (lossPercentage < -0.3) {
            return 'Immediate risk reduction required. Consider put options for protection.';
        } else if (lossPercentage < -0.2) {
            return 'Increase hedging. Review position limits.';
        } else if (lossPercentage < -0.1) {
            return 'Monitor closely. Consider partial hedging.';
        } else {
            return 'Normal risk levels. Maintain current strategy.';
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the calculator page
    const hasCalculator = document.querySelector('.calculator-container') || 
                         window.location.pathname.includes('calculator');
    
    if (hasCalculator) {
        console.log('🇬🇭 Ghana Cocoa Hedging Calculator v3.2 with AI - Loading...');
        
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
            
            /* AI Analysis button */
            #aiAnalysisBtn {
                background: linear-gradient(135deg, var(--ghana-green), var(--ghana-gold)) !important;
                border: 2px solid var(--ghana-red) !important;
                color: white !important;
                font-weight: 600 !important;
            }
            
            #aiAnalysisBtn:hover {
                background: linear-gradient(135deg, var(--ghana-red), var(--ghana-green)) !important;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(252, 209, 22, 0.3);
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
            
            /* AI Modal Styles */
            .ai-explanation-modal {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                padding: 0;
                overflow: hidden;
                border: 3px solid var(--ghana-gold);
            }
            
            .ai-explanation-modal h3 {
                background: linear-gradient(135deg, var(--ghana-green), var(--ghana-red));
                color: white;
                padding: 1.5rem;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .explanation-content {
                padding: 1.5rem;
                max-height: 400px;
                overflow-y: auto;
                line-height: 1.6;
                font-size: 14px;
            }
            
            .explanation-content strong {
                color: var(--ghana-green);
            }
            
            .modal-actions {
                padding: 1rem 1.5rem;
                background: #f8f9fa;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                border-top: 1px solid #dee2e6;
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
                        <p><i class="fas fa-envelope"></i> <strong>Email:</strong> emmanueladutwum900@yahoo.com</p>
                        <p><i class="fas fa-phone"></i> <strong>Phone:</strong> +233 553483918</p>
                        <p><i class="fas fa-github"></i> <strong>GitHub:</strong> <a href="https://github.com/emmanueladutwum123" target="_blank">@emmanueladutwum123</a></p>
                        <p><i class="fas fa-globe"></i> <strong>Website:</strong> <a href="https://emmanueladutwum123.github.io/ghana-cocoa-hedging/" target="_blank">Ghana Cocoa Hedging Platform</a></p>
                        <p><i class="fas fa-calculator"></i> <strong>Simulator Version:</strong> 3.2 with AI Assistant</p>
                        <p><i class="fas fa-university"></i> <strong>Institution:</strong> Soka University of America</p>
                        <p><i class="fas fa-flag"></i> <strong>Theme:</strong> 🇬🇭 Ghana Flag Colors (Red, Gold, Green)</p>
                        <p><i class="fas fa-robot"></i> <strong>AI Assistant:</strong> Provides optimal hedging recommendations</p>
                    </div>
                `;
                mainContent.appendChild(developerCredit);
            }
        }
        
        // Initialize the calculator
        window.calculator = new CocoaHedgingSimulator();
        
        // Make it globally accessible
        window.CocoaHedgingSimulator = CocoaHedgingSimulator;
        window.AIHedgingHelper = AIHedgingHelper;
        
        console.log('✅ Calculator with AI initialized successfully!');
        
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
