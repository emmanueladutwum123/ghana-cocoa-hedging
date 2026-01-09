// SEO Optimization Script
class SEOOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateMetaTags();
        this.generateStructuredData();
        this.trackPagePerformance();
    }
    
    updateMetaTags() {
        // Update title with current page
        const pageTitle = document.querySelector('h1')?.textContent || 'Ghana Cocoa Derivatives';
        document.title = `${pageTitle} | Ghana Cocoa Risk Management Platform`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Advanced options pricing and delta hedging simulator for Ghana Cocoa Board (COCOBOD) risk management.';
            document.head.appendChild(meta);
        }
    }
    
    generateStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Ghana Cocoa Derivatives Research Platform",
            "description": "Advanced computational finance tools for cocoa hedging and risk management",
            "url": "https://emmanueladutwum123.github.io/ghana-cocoa-hedging/",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    trackPagePerformance() {
        window.addEventListener('load', () => {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                           window.performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime,
                    'event_category': 'Performance'
                });
            }
        });
    }
}

// Initialize SEO optimizer
new SEOOptimizer();
