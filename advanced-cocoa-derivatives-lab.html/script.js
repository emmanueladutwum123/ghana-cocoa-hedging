// Shared JavaScript for Cocoa Derivatives Research Lab

class CocoaResearchPlatform {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop();
        this.initialize();
    }
    
    initialize() {
        this.setupEventListeners();
        this.loadPageSpecificFeatures();
        this.initializeCharts();
    }
    
    setupEventListeners() {
        // Navigation active state
        const currentPage = this.currentPage || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Tooltip initialization
        this.initializeTooltips();
    }
    
    loadPageSpecificFeatures() {
        switch(this.currentPage) {
            case 'calculator.html':
                this.initializeCalculator();
                break;
            case 'dashboard.html':
                this.initializeDashboard();
                break;
            case 'ml-models.html':
                this.initializeMLModels();
                break;
            case 'data.html':
                this.initializeDataPage();
                break;
        }
    }
    
    initializeCharts() {
        // Common chart initialization
        if (typeof Plotly !== 'undefined') {
            this.createCommonCharts();
        }
    }
    
    initializeTooltips() {
        // Simple tooltip implementation
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.dataset.tooltip;
                this.showTooltip(e, tooltipText);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    showTooltip(event, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '0.875rem';
        tooltip.style.pointerEvents = 'none';
        
        document.body.appendChild(tooltip);
        
        const x = event.clientX + 10;
        const y = event.clientY + 10;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        
        this.currentTooltip = tooltip;
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
    
    createCommonCharts() {
        // Create common charts if needed
        if (document.getElementById('commonChart')) {
            // Example common chart
            const trace = {
                x: [1, 2, 3, 4, 5],
                y: [1, 3, 2, 4, 3],
                type: 'scatter',
                mode: 'lines'
            };
            
            Plotly.newPlot('commonChart', [trace], {
                title: 'Sample Chart',
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: {color: '#ffffff'}
            });
        }
    }
    
    // Financial Calculations
    calculateBlackScholes(S, K, T, sigma, r, optionType) {
        const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        const normCDF = x => (1 + this.erf(x / Math.sqrt(2))) / 2;
        const normPDF = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
        
        let price, delta, gamma, theta, vega;
        
        if (optionType === 'call') {
            price = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
            delta = normCDF(d1);
        } else {
            price = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
            delta = normCDF(d1) - 1;
        }
        
        gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
        vega = S * normPDF(d1) * Math.sqrt(T) * 0.01;
        theta = (-S * normPDF(d1) * sigma / (2 * Math.sqrt(T)) - 
                r * K * Math.exp(-r * T) * (optionType === 'call' ? normCDF(d2) : normCDF(-d2))) / 365;
        
        return { price, delta, gamma, theta, vega };
    }
    
    erf(x) {
        // Error function approximation
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        
        const sign = Math.sign(x);
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }
    
    // Monte Carlo Simulation
    monteCarloSimulation(params, nSimulations = 10000) {
        const { S, K, T, sigma, r, optionType } = params;
        const nSteps = Math.floor(252 * T);
        const dt = T / nSteps;
        
        let totalPayoff = 0;
        
        for (let i = 0; i < nSimulations; i++) {
            let St = S;
            
            for (let j = 0; j < nSteps; j++) {
                const drift = (r - 0.5 * sigma * sigma) * dt;
                const diffusion = sigma * Math.sqrt(dt) * this.randn_bm();
                St = St * Math.exp(drift + diffusion);
            }
            
            const payoff = optionType === 'call' ? Math.max(St - K, 0) : Math.max(K - St, 0);
            totalPayoff += payoff;
        }
        
        const price = (totalPayoff / nSimulations) * Math.exp(-r * T);
        return price;
    }
    
    randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    // Data Fetching
    async fetchCocoaData() {
        try {
            // In production, replace with actual API endpoint
            const response = await fetch('https://api.example.com/cocoa-prices');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cocoa data:', error);
            return this.getSampleData();
        }
    }
    
    getSampleData() {
        // Return sample data for demonstration
        const dates = [];
        const prices = [];
        let price = 3000;
        
        for (let i = 0; i < 100; i++) {
            dates.push(new Date(2024, 0, i));
            price += (Math.random() - 0.5) * 100;
            prices.push(Math.max(2000, Math.min(8000, price)));
        }
        
        return { dates, prices };
    }
    
    // Export functionality
    exportToCSV(data, filename = 'cocoa_data.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // Format currency
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    }
    
    // Format percentage
    formatPercent(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2
        }).format(value);
    }
    
    // Initialize page-specific features (to be overridden)
    initializeCalculator() {}
    initializeDashboard() {}
    initializeMLModels() {}
    initializeDataPage() {}
}

// Initialize platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new CocoaResearchPlatform();
});
