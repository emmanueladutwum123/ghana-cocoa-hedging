// ml-predictor.js - Machine Learning Models for Cocoa Price Prediction

class MLPredictor {
    constructor() {
        this.models = {};
        this.currentModel = 'lstm';
        this.trainingData = null;
        this.isTraining = false;
        this.predictionResults = null;
        this.init();
    }
    
    init() {
        this.loadSampleData();
        this.initializeModels();
        this.setupEventListeners();
    }
    
    loadSampleData() {
        // Generate sample historical cocoa prices
        this.trainingData = this.generateHistoricalData(1000);
    }
    
    generateHistoricalData(days) {
        const data = {
            dates: [],
            prices: [],
            volumes: [],
            volatilities: []
        };
        
        let price = 2500;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            data.dates.push(date);
            
            // Generate price with random walk and trend
            const dailyReturn = 0.0005 + (Math.random() - 0.5) * 0.02;
            price = price * (1 + dailyReturn);
            data.prices.push(price);
            
            // Generate volume
            const volume = 10000 + Math.random() * 15000;
            data.volumes.push(volume);
            
            // Generate volatility (GARCH-like)
            const volatility = 0.2 + Math.random() * 0.1;
            data.volatilities.push(volatility);
        }
        
        return data;
    }
    
    initializeModels() {
        // Initialize different ML models (simulated)
        this.models = {
            lstm: {
                name: 'LSTM Neural Network',
                accuracy: 0.942,
                mae: 42.80,
                description: 'Deep learning model for time-series forecasting',
                parameters: {
                    lookback: 60,
                    units: 128,
                    epochs: 50,
                    batchSize: 32
                }
            },
            xgboost: {
                name: 'XGBoost Ensemble',
                accuracy: 0.912,
                mae: 58.30,
                description: 'Gradient boosting for price direction',
                parameters: {
                    nEstimators: 100,
                    maxDepth: 6,
                    learningRate: 0.1
                }
            },
            prophet: {
                name: 'Facebook Prophet',
                accuracy: 0.887,
                mae: 72.10,
                description: 'Seasonality and trend forecasting',
                parameters: {
                    seasonalityMode: 'multiplicative',
                    changepointPriorScale: 0.05
                }
            },
            svm: {
                name: 'SVM Classifier',
                accuracy: 0.865,
                mae: 89.50,
                description: 'Support Vector Machine for price movement',
                parameters: {
                    kernel: 'rbf',
                    C: 1.0,
                    gamma: 'scale'
                }
            }
        };
    }
    
    setupEventListeners() {
        // Model selection
        document.querySelectorAll('[data-model]')?.forEach(element => {
            element.addEventListener('click', (e) => {
                const modelType = e.currentTarget.dataset.model;
                this.selectModel(modelType);
            });
        });
        
        // Prediction buttons
        document.getElementById('runPrediction')?.addEventListener('click', () => {
            this.runPrediction();
        });
        
        document.getElementById('trainModel')?.addEventListener('click', () => {
            this.retrainModel();
        });
        
        document.getElementById('exportResults')?.addEventListener('click', () => {
            this.exportResults();
        });
        
        // Training controls
        document.getElementById('startTraining')?.addEventListener('click', () => {
            this.startTraining();
        });
        
        document.getElementById('stopTraining')?.addEventListener('click', () => {
            this.stopTraining();
        });
        
        document.getElementById('saveModel')?.addEventListener('click', () => {
            this.saveModel();
        });
    }
    
    selectModel(modelType) {
        this.currentModel = modelType;
        const model = this.models[modelType];
        
        // Update UI
        document.getElementById('currentModel')?.textContent = model.name;
        
        // Update model info
        this.updateModelInfo(model);
        
        // Update prediction display
        this.updatePredictionDisplay();
    }
    
    updateModelInfo(model) {
        // Update accuracy and MAE displays
        document.getElementById('modelAccuracy')?.textContent = 
            `${(model.accuracy * 100).toFixed(1)}%`;
        
        document.getElementById('maeValue')?.textContent = 
            `$${model.mae.toFixed(2)}`;
    }
    
    updatePredictionDisplay() {
        if (!this.predictionResults) {
            // Generate initial prediction
            this.predictionResults = this.generatePrediction();
        }
        
        // Update prediction chart
        this.updatePredictionChart();
        
        // Update prediction metrics
        this.updatePredictionMetrics();
    }
    
    generatePrediction(horizon = 30) {
        const model = this.models[this.currentModel];
        const lastPrice = this.trainingData.prices[this.trainingData.prices.length - 1];
        
        // Generate prediction based on model type
        let predictions = [];
        let confidenceIntervals = [];
        
        switch(this.currentModel) {
            case 'lstm':
                // LSTM typically captures complex patterns
                predictions = this.generateLSTMPredictions(lastPrice, horizon);
                confidenceIntervals = this.generateConfidenceIntervals(predictions, 0.02);
                break;
                
            case 'xgboost':
                // XGBoost for directional accuracy
                predictions = this.generateXGBoostPredictions(lastPrice, horizon);
                confidenceIntervals = this.generateConfidenceIntervals(predictions, 0.025);
                break;
                
            case 'prophet':
                // Prophet for seasonality
                predictions = this.generateProphetPredictions(lastPrice, horizon);
                confidenceIntervals = this.generateConfidenceIntervals(predictions, 0.03);
                break;
                
            case 'svm':
                // SVM for classification-based predictions
                predictions = this.generateSVMPredictions(lastPrice, horizon);
                confidenceIntervals = this.generateConfidenceIntervals(predictions, 0.035);
                break;
        }
        
        return {
            model: model.name,
            horizon: horizon,
            predictions: predictions,
            confidenceIntervals: confidenceIntervals,
            finalPrediction: predictions[predictions.length - 1],
            predictionInterval: [
                confidenceIntervals[0][confidenceIntervals[0].length - 1],
                confidenceIntervals[1][confidenceIntervals[1].length - 1]
            ],
            generatedAt: new Date().toISOString()
        };
    }
    
    generateLSTMPredictions(lastPrice, horizon) {
        const predictions = [lastPrice];
        let currentPrice = lastPrice;
        
        // LSTM simulation with memory of trends
        const trendMemory = [];
        
        for (let i = 1; i <= horizon; i++) {
            // Calculate trend from recent memory
            let trend = 0;
            if (trendMemory.length > 0) {
                trend = trendMemory.reduce((a, b) => a + b, 0) / trendMemory.length;
            }
            
            // Add random noise with decreasing volatility
            const noise = (Math.random() - 0.5) * 0.02 * (1 - i/horizon);
            
            // Update price
            const change = trend * 0.7 + noise;
            currentPrice = currentPrice * (1 + change);
            predictions.push(currentPrice);
            
            // Update trend memory
            trendMemory.push(change);
            if (trendMemory.length > 10) trendMemory.shift();
        }
        
        return predictions;
    }
    
    generateXGBoostPredictions(lastPrice, horizon) {
        const predictions = [lastPrice];
        let currentPrice = lastPrice;
        
        // XGBoost simulation with feature importance weighting
        for (let i = 1; i <= horizon; i++) {
            // Weighted factors
            const momentum = 0.6; // 60% weight to momentum
            const meanReversion = 0.3; // 30% to mean reversion
            const noise = 0.1; // 10% noise
            
            const avgPrice = this.trainingData.prices.reduce((a, b) => a + b, 0) / 
                           this.trainingData.prices.length;
            
            const change = 
                (momentum * 0.001) + // Small upward momentum
                (meanReversion * (avgPrice - currentPrice) / currentPrice * 0.01) +
                (noise * (Math.random() - 0.5) * 0.015);
            
            currentPrice = currentPrice * (1 + change);
            predictions.push(currentPrice);
        }
        
        return predictions;
    }
    
    generateProphetPredictions(lastPrice, horizon) {
        const predictions = [lastPrice];
        let currentPrice = lastPrice;
        
        // Prophet simulation with seasonality
        const seasonality = this.calculateSeasonality();
        
        for (let i = 1; i <= horizon; i++) {
            // Base trend + seasonality + noise
            const dayOfYear = (new Date().getDayOfYear() + i) % 365;
            const seasonalEffect = seasonality[dayOfYear % seasonality.length];
            
            const change = 0.0008 + // Small upward trend
                          seasonalEffect * 0.002 +
                          (Math.random() - 0.5) * 0.01;
            
            currentPrice = currentPrice * (1 + change);
            predictions.push(currentPrice);
        }
        
        return predictions;
    }
    
    generateSVMPredictions(lastPrice, horizon) {
        const predictions = [lastPrice];
        let currentPrice = lastPrice;
        
        // SVM simulation (more conservative)
        for (let i = 1; i <= horizon; i++) {
            // Conservative predictions with smaller moves
            const change = (Math.random() - 0.5) * 0.01; // ±1% max
            
            currentPrice = currentPrice * (1 + change);
            predictions.push(currentPrice);
        }
        
        return predictions;
    }
    
    calculateSeasonality() {
        // Simulate seasonal pattern (harvest cycles, weather patterns)
        const seasonality = [];
        for (let i = 0; i < 12; i++) {
            // Higher prices in Q1 (post-harvest), lower in Q3 (pre-harvest)
            const seasonalFactor = Math.sin(i * Math.PI / 6 - Math.PI / 2) * 0.5 + 0.5;
            seasonality.push(seasonalFactor);
        }
        return seasonality;
    }
    
    generateConfidenceIntervals(predictions, uncertainty) {
        const lower = [];
        const upper = [];
        
        predictions.forEach((price, index) => {
            const spread = price * uncertainty * (1 + index / predictions.length);
            lower.push(price - spread);
            upper.push(price + spread);
        });
        
        return [lower, upper];
    }
    
    updatePredictionChart() {
        const chartElement = document.getElementById('predictionChart');
        if (!chartElement || !this.predictionResults) return;
        
        const ctx = chartElement.getContext('2d');
        
        // Get historical data for context
        const historicalDays = 60;
        const historicalStart = Math.max(0, this.trainingData.prices.length - historicalDays);
        const historicalPrices = this.trainingData.prices.slice(historicalStart);
        const historicalDates = this.trainingData.dates.slice(historicalStart);
        
        // Combine historical and prediction data
        const allDates = [
            ...historicalDates.map(d => d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
            'Today',
            ...Array.from({length: this.predictionResults.horizon}, (_, i) => 
                `+${i + 1}d`)
        ];
        
        const allPrices = [
            ...historicalPrices,
            historicalPrices[historicalPrices.length - 1],
            ...this.predictionResults.predictions.slice(1)
        ];
        
        // Create or update chart
        if (!this.predictionChart) {
            this.predictionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: allDates,
                    datasets: [
                        {
                            label: 'Historical Price',
                            data: historicalPrices.concat([historicalPrices[historicalPrices.length - 1]]),
                            borderColor: '#006B3F',
                            backgroundColor: 'rgba(0, 107, 63, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Prediction',
                            data: [
                                ...Array(historicalPrices.length - 1).fill(null),
                                historicalPrices[historicalPrices.length - 1],
                                ...this.predictionResults.predictions.slice(1)
                            ],
                            borderColor: '#FCD116',
                            backgroundColor: 'rgba(252, 209, 22, 0.1)',
                            borderWidth: 3,
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: '95% Confidence',
                            data: [
                                ...Array(historicalPrices.length).fill(null),
                                ...this.predictionResults.confidenceIntervals[0]
                            ],
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            fill: '+1'
                        },
                        {
                            label: '',
                            data: [
                                ...Array(historicalPrices.length).fill(null),
                                ...this.predictionResults.confidenceIntervals[1]
                            ],
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 1,
                            borderDash: [2, 2],
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
                                filter: function(item, chart) {
                                    // Hide duplicate confidence interval label
                                    return item.text !== '';
                                }
                            }
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
        } else {
            // Update existing chart
            this.predictionChart.data.labels = allDates;
            this.predictionChart.data.datasets[0].data = 
                historicalPrices.concat([historicalPrices[historicalPrices.length - 1]]);
            this.predictionChart.data.datasets[1].data = [
                ...Array(historicalPrices.length - 1).fill(null),
                historicalPrices[historicalPrices.length - 1],
                ...this.predictionResults.predictions.slice(1)
            ];
            this.predictionChart.data.datasets[2].data = 
                [...Array(historicalPrices.length).fill(null), ...this.predictionResults.confidenceIntervals[0]];
            this.predictionChart.data.datasets[3].data = 
                [...Array(historicalPrices.length).fill(null), ...this.predictionResults.confidenceIntervals[1]];
            this.predictionChart.update();
        }
    }
    
    updatePredictionMetrics() {
        if (!this.predictionResults) return;
        
        const model = this.models[this.currentModel];
        
        // Update predicted price
        document.getElementById('predictedPrice')?.textContent = 
            `$${this.predictionResults.finalPrediction.toFixed(2)}`;
        
        // Update prediction interval
        const intervalElement = document.getElementById('predictionInterval');
        if (intervalElement) {
            const [lower, upper] = this.predictionResults.predictionInterval;
            intervalElement.textContent = `[$${lower.toFixed(2)} - $${upper.toFixed(2)}]`;
        }
        
        // Calculate percentage change
        const lastPrice = this.trainingData.prices[this.trainingData.prices.length - 1];
        const percentageChange = 
            ((this.predictionResults.finalPrediction - lastPrice) / lastPrice * 100).toFixed(1);
        
        // Update change indicator
        const changeElement = document.querySelector('#predictedPrice').closest('.metric-card').querySelector('.metric-change');
        if (changeElement) {
            changeElement.textContent = `${percentageChange >= 0 ? '+' : ''}${percentageChange}%`;
            changeElement.className = `metric-change ${percentageChange >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update model accuracy
        document.getElementById('modelAccuracy')?.textContent = 
            `${(model.accuracy * 100).toFixed(1)}%`;
        
        // Update MAE
        document.getElementById('maeValue')?.textContent = 
            `$${model.mae.toFixed(2)}`;
    }
    
    runPrediction() {
        const button = document.getElementById('runPrediction');
        const originalText = button?.innerHTML;
        
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
            button.disabled = true;
        }
        
        // Simulate prediction time
        setTimeout(() => {
            this.predictionResults = this.generatePrediction();
            this.updatePredictionDisplay();
            
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
            
            this.showNotification('Prediction completed successfully!', 'success');
        }, 2000);
    }
    
    retrainModel() {
        if (this.isTraining) {
            this.showNotification('Model is already training', 'warning');
            return;
        }
        
        const button = document.getElementById('trainModel');
        const originalText = button?.innerHTML;
        
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Retraining...';
            button.disabled = true;
        }
        
        // Simulate retraining
        setTimeout(() => {
            // Improve model accuracy slightly
            const model = this.models[this.currentModel];
            model.accuracy = Math.min(0.99, model.accuracy + 0.005);
            model.mae = Math.max(10, model.mae * 0.95);
            
            this.updateModelInfo(model);
            
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
            
            // Update last trained time
            const now = new Date();
            document.getElementById('lastUpdated')?.textContent = 
                `Last trained: ${now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`;
            
            this.showNotification('Model retrained successfully!', 'success');
        }, 3000);
    }
    
    startTraining() {
        if (this.isTraining) {
            this.showNotification('Training already in progress', 'warning');
            return;
        }
        
        this.isTraining = true;
        
        // Get training parameters
        const epochs = parseInt(document.getElementById('epochs')?.value || 50);
        const learningRate = parseFloat(document.getElementById('learningRate')?.value || 0.01);
        
        // Update UI
        document.getElementById('progressStatus')?.textContent = 'Training...';
        document.getElementById('startTraining')?.disabled = true;
        document.getElementById('stopTraining')?.disabled = false;
        
        // Initialize training chart
        this.initializeTrainingChart();
        
        // Simulate training progress
        let currentEpoch = 0;
        const startTime = Date.now();
        
        this.trainingInterval = setInterval(() => {
            currentEpoch++;
            const progress = (currentEpoch / epochs) * 100;
            
            // Update progress bar
            const progressBar = document.getElementById('trainingProgress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            // Update metrics
            document.getElementById('epochValue')?.textContent = `${currentEpoch}/${epochs}`;
            
            // Simulate decreasing loss
            const baseLoss = 0.1;
            const trainLoss = baseLoss * Math.exp(-currentEpoch/20) + Math.random() * 0.01;
            const valLoss = baseLoss * Math.exp(-currentEpoch/20) + Math.random() * 0.02;
            
            document.getElementById('lossValue')?.textContent = trainLoss.toFixed(4);
            document.getElementById('accuracyValue')?.textContent = 
                `${(100 - trainLoss * 100).toFixed(1)}%`;
            
            // Update time
            const elapsed = Date.now() - startTime;
            document.getElementById('trainingTime')?.textContent = `${Math.floor(elapsed / 1000)}s`;
            
            // Update training chart
            if (this.trainingChart) {
                this.trainingChart.data.labels.push(currentEpoch.toString());
                this.trainingChart.data.datasets[0].data.push(trainLoss);
                this.trainingChart.data.datasets[1].data.push(valLoss);
                this.trainingChart.update();
            }
            
            // Check if training is complete
            if (currentEpoch >= epochs) {
                this.stopTraining();
                this.showNotification('Training completed successfully!', 'success');
            }
        }, 100);
    }
    
    stopTraining() {
        if (!this.isTraining) return;
        
        this.isTraining = false;
        clearInterval(this.trainingInterval);
        
        // Update UI
        document.getElementById('progressStatus')?.textContent = 'Stopped';
        document.getElementById('startTraining')?.disabled = false;
        document.getElementById('stopTraining')?.disabled = true;
    }
    
    initializeTrainingChart() {
        const chartElement = document.getElementById('trainingChart');
        if (!chartElement) return;
        
        const ctx = chartElement.getContext('2d');
        
        this.trainingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Training Loss',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Validation Loss',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
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
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Loss (log scale)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        }
                    }
                }
            }
        });
    }
    
    exportResults() {
        if (!this.predictionResults) {
            this.showNotification('Please run a prediction first', 'warning');
            return;
        }
        
        const exportData = {
            model: this.models[this.currentModel],
            prediction: this.predictionResults,
            trainingData: {
                size: this.trainingData.prices.length,
                dateRange: {
                    start: this.trainingData.dates[0].toISOString(),
                    end: this.trainingData.dates[this.trainingData.dates.length - 1].toISOString()
                }
            },
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cocoa-prediction-${this.currentModel}-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Prediction results exported successfully!', 'success');
    }
    
    saveModel() {
        const modelConfig = {
            name: this.models[this.currentModel].name,
            type: this.currentModel,
            parameters: this.models[this.currentModel].parameters,
            accuracy: this.models[this.currentModel].accuracy,
            mae: this.models[this.currentModel].mae,
            savedAt: new Date().toISOString(),
            trainingDataSize: this.trainingData.prices.length
        };
        
        const blob = new Blob([JSON.stringify(modelConfig, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentModel}-config-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Model configuration saved!', 'success');
    }
    
    // Utility functions
    formatNumber(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize predictor when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.ml-container')) {
        new MLPredictor();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MLPredictor;
}

// Helper extension for Date
if (!Date.prototype.getDayOfYear) {
    Date.prototype.getDayOfYear = function() {
        const start = new Date(this.getFullYear(), 0, 0);
        const diff = this - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };
}
