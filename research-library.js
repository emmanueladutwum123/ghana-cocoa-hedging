// research-library.js - COMPLETE AND WORKING VERSION

// Main Research Library Class
class ResearchLibrary {
    constructor() {
        this.papers = this.generateSamplePapers();
        this.filteredPapers = [...this.papers];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.currentView = 'grid';
        this.currentCategory = 'all';
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('ResearchLibrary initialized');
        this.renderPapersGrid();
        this.setupEventListeners();
        this.setupSearch();
        this.updateResultsCount();
        this.initializeCategories();
        this.fixLayoutIssues();
    }
    
    generateSamplePapers() {
        // Return a robust array of sample papers
        return [
            {
                id: 1,
                title: "Black-Scholes Adaptation for Cocoa Options in Emerging Markets",
                authors: ["Agyei-Ampomah, S.", "Mensah, K.", "Appiah, J."],
                year: 2023,
                journal: "Journal of Derivatives",
                abstract: "This paper adapts the Black-Scholes-Merton model for pricing cocoa options in emerging markets, incorporating Ghana-specific parameters including convenience yield, storage costs, and seasonal effects.",
                category: "pricing",
                citations: 28,
                downloads: 189,
                pages: 22,
                tags: ["options", "pricing", "black-scholes", "emerging-markets"],
                access: "open",
                doi: "10.1234/deriv.2023.001",
                featured: true
            },
            {
                id: 2,
                title: "Delta Hedging Strategies for Ghana Cocoa Board Risk Management",
                authors: ["Owusu, F.", "Amoah, B.", "Danso, K."],
                year: 2022,
                journal: "Agricultural Finance Review",
                abstract: "We analyze delta hedging strategies for COCOBOD's cocoa sales, incorporating transaction costs and liquidity constraints. Our simulation shows monthly rebalancing with 70% hedge ratio optimizes risk-return tradeoff.",
                category: "hedging",
                citations: 42,
                downloads: 215,
                pages: 18,
                tags: ["delta-hedging", "cocobod", "risk-management", "simulation"],
                access: "open",
                doi: "10.5678/afr.2022.015",
                featured: true
            },
            {
                id: 3,
                title: "Volatility Forecasting in Cocoa Markets Using GARCH Models",
                authors: ["Kumi, P.", "Asante, R."],
                year: 2023,
                journal: "Journal of Commodity Markets",
                abstract: "This study applies GARCH-family models to forecast cocoa price volatility. We find EGARCH(1,1) with seasonal dummies provides best out-of-sample forecasts for Ghana cocoa prices.",
                category: "forecasting",
                citations: 31,
                downloads: 178,
                pages: 15,
                tags: ["volatility", "garch", "forecasting", "time-series"],
                access: "restricted",
                doi: "10.7890/jcm.2023.008",
                featured: false
            },
            {
                id: 4,
                title: "Risk Management Strategies for Smallholder Cocoa Farmers in West Africa",
                authors: ["Addo, M.", "Quartey, P.", "Osei, R.", "Mensah, A."],
                year: 2021,
                journal: "World Development",
                abstract: "We evaluate price risk management strategies for smallholder cocoa farmers in Ghana, comparing futures, options, and forward contracts. Options provide best protection with minimal upfront cost.",
                category: "risk",
                citations: 56,
                downloads: 312,
                pages: 24,
                tags: ["risk-management", "farmers", "smallholders", "options"],
                access: "open",
                doi: "10.1016/j.worlddev.2021.105203",
                featured: true
            },
            {
                id: 5,
                title: "Convenience Yield in Cocoa Storage and Pricing Models",
                authors: ["Boateng, K.", "Ankomah, S."],
                year: 2022,
                journal: "Energy Economics",
                abstract: "We estimate convenience yield for cocoa storage in Ghana, finding significant seasonal patterns and relationship to inventory levels. Results inform storage decisions and futures pricing.",
                category: "pricing",
                citations: 23,
                downloads: 145,
                pages: 16,
                tags: ["convenience-yield", "storage", "futures", "seasonality"],
                access: "restricted",
                doi: "10.1016/j.eneco.2022.106127",
                featured: false
            },
            {
                id: 6,
                title: "Machine Learning for Cocoa Price Prediction: LSTM vs XGBoost",
                authors: ["Yeboah, D.", "Frimpong, J.", "Antwi, M."],
                year: 2023,
                journal: "Expert Systems with Applications",
                abstract: "We compare LSTM, XGBoost, and traditional ARIMA models for cocoa price prediction. Ensemble methods achieve 92% directional accuracy for 30-day forecasts.",
                category: "forecasting",
                citations: 38,
                downloads: 267,
                pages: 20,
                tags: ["machine-learning", "lstm", "xgboost", "prediction"],
                access: "open",
                doi: "10.1016/j.eswa.2023.120456",
                featured: true
            },
            {
                id: 7,
                title: "Basis Risk in Ghana Cocoa Hedging Programs",
                authors: ["Sarpong, E.", "Arthur, B."],
                year: 2022,
                journal: "Journal of Futures Markets",
                abstract: "We measure basis risk between Ghana cocoa prices and ICE futures, identifying drivers and hedging effectiveness. Local quality differentials explain 60% of basis variation.",
                category: "risk",
                citations: 29,
                downloads: 198,
                pages: 14,
                tags: ["basis-risk", "hedging", "futures", "quality"],
                access: "open",
                doi: "10.1002/fut.22345",
                featured: false
            },
            {
                id: 8,
                title: "Option Pricing with Jump Diffusion for Cocoa Commodity Markets",
                authors: ["Amissah, C.", "Tweneboah, G."],
                year: 2023,
                journal: "Quantitative Finance",
                abstract: "We extend Black-Scholes to include jump diffusion for cocoa options, capturing weather-related price spikes. Model reduces pricing errors by 40% compared to standard BS.",
                category: "pricing",
                citations: 19,
                downloads: 156,
                pages: 22,
                tags: ["jump-diffusion", "options", "weather-risk", "pricing"],
                access: "restricted",
                doi: "10.1080/14697688.2023.2184567",
                featured: false
            }
        ];
    }
    
    fixLayoutIssues() {
        // Force visibility of all research elements
        const researchContainer = document.getElementById('researchContainer');
        if (researchContainer) {
            researchContainer.style.display = 'block';
            researchContainer.style.visibility = 'visible';
            researchContainer.style.opacity = '1';
        }
        
        // Make sure paper cards are visible
        document.querySelectorAll('.paper-card').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
        });
        
        console.log('Layout issues fixed');
    }
    
    renderPapersGrid() {
        const grid = document.getElementById('papersGrid');
        if (!grid) {
            console.error('Papers grid element not found!');
            return;
        }
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pagePapers = this.filteredPapers.slice(start, end);
        
        if (pagePapers.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3>No papers found</h3>
                    <p>Try different search terms or filters</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = pagePapers.map(paper => this.createPaperCard(paper)).join('');
        
        // Update pagination
        this.renderPagination();
    }
    
    createPaperCard(paper) {
        return `
            <div class="paper-card" data-id="${paper.id}">
                <div class="paper-header">
                    <span class="paper-access ${paper.access}">
                        <i class="fas fa-${paper.access === 'open' ? 'lock-open' : 'lock'}"></i>
                        ${paper.access === 'open' ? 'Open Access' : 'Restricted'}
                    </span>
                    ${paper.featured ? '<span class="paper-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                </div>
                
                <div class="paper-content">
                    <h3 class="paper-title">${paper.title}</h3>
                    
                    <div class="paper-meta">
                        <span class="authors">
                            <i class="fas fa-user"></i>
                            ${paper.authors.slice(0, 2).join(', ')}
                            ${paper.authors.length > 2 ? ' et al.' : ''}
                        </span>
                        <span class="year">
                            <i class="fas fa-calendar"></i>
                            ${paper.year}
                        </span>
                        <span class="journal">
                            <i class="fas fa-book"></i>
                            ${paper.journal}
                        </span>
                    </div>
                    
                    <p class="paper-abstract">${paper.abstract}</p>
                    
                    <div class="paper-metrics">
                        <span class="metric">
                            <i class="fas fa-quote-left"></i>
                            ${paper.citations} citations
                        </span>
                        <span class="metric">
                            <i class="fas fa-download"></i>
                            ${paper.downloads} downloads
                        </span>
                    </div>
                    
                    <div class="paper-actions">
                        <button class="btn btn-primary btn-sm download-btn" data-id="${paper.id}">
                            <i class="fas fa-file-pdf"></i> Download
                        </button>
                        <button class="btn btn-secondary btn-sm cite-btn" data-id="${paper.id}">
                            <i class="fas fa-quote-right"></i> Cite
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredPapers.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = `
            <button class="page-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
        
        // Show page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }
        
        paginationHTML += `
            <button class="page-btn next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
        
        // Attach event listeners
        this.attachPaginationListeners();
    }
    
    attachPaginationListeners() {
        document.querySelectorAll('.page-btn:not(.active):not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('prev')) {
                    this.currentPage--;
                } else if (e.target.classList.contains('next')) {
                    this.currentPage++;
                } else if (e.target.dataset.page) {
                    this.currentPage = parseInt(e.target.dataset.page);
                }
                this.renderPapersGrid();
                this.updateResultsCount();
            });
        });
    }
    
    setupEventListeners() {
        // Search button
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.applyFilters());
        }
        
        // Apply filters button
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
        
        // Reset filters button
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Attach paper event listeners after rendering
        this.attachPaperEventListeners();
    }
    
    attachPaperEventListeners() {
        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.closest('[data-id]').dataset.id);
                this.downloadPaper(paperId);
            });
        });
        
        // Cite buttons
        document.querySelectorAll('.cite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = parseInt(e.target.closest('[data-id]').dataset.id);
                this.showCitation(paperId);
            });
        });
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length >= 3 || e.target.value.length === 0) {
                        this.applyFilters();
                    }
                }, 500);
            });
        }
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const year = document.getElementById('yearFilter')?.value || 'all';
        
        this.filteredPapers = this.papers.filter(paper => {
            // Search term filter
            if (searchTerm && !this.paperMatchesSearch(paper, searchTerm)) {
                return false;
            }
            
            // Category filter
            if (category !== 'all' && paper.category !== category) {
                return false;
            }
            
            // Year filter
            if (year !== 'all' && paper.year.toString() !== year) {
                return false;
            }
            
            return true;
        });
        
        // Reset to first page
        this.currentPage = 1;
        
        // Update display
        this.renderPapersGrid();
        this.updateResultsCount();
    }
    
    paperMatchesSearch(paper, term) {
        const searchFields = [
            paper.title,
            paper.authors.join(' '),
            paper.journal,
            paper.abstract,
            paper.tags.join(' ')
        ].join(' ').toLowerCase();
        
        return searchFields.includes(term);
    }
    
    resetFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (yearFilter) yearFilter.value = 'all';
        
        this.applyFilters();
    }
    
    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            const total = this.filteredPapers.length;
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + this.itemsPerPage - 1, total);
            
            if (total === 0) {
                countElement.textContent = 'No papers found';
            } else {
                countElement.textContent = `Showing ${start}-${end} of ${total} papers`;
            }
        }
    }
    
    downloadPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        // Simulate download
        const content = `Title: ${paper.title}\nAuthors: ${paper.authors.join(', ')}\nYear: ${paper.year}\nJournal: ${paper.journal}\n\nThis is a sample download for demonstration purposes.`;
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Show notification if function exists
        if (typeof showNotification === 'function') {
            showNotification(`Downloading "${paper.title}"`, 'success');
        } else {
            alert(`Downloading: ${paper.title}`);
        }
    }
    
    showCitation(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const citation = `${paper.authors.join(', ')} (${paper.year}). "${paper.title}". <em>${paper.journal}</em>.`;
        
        // Create a simple modal for citation
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%;">
                <h3>Citation</h3>
                <p>${citation}</p>
                <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                    <button id="copyCitation" style="padding: 0.5rem 1rem; background: #004D29; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Copy
                    </button>
                    <button id="closeCitation" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#copyCitation').addEventListener('click', () => {
            navigator.clipboard.writeText(citation.replace(/<[^>]*>/g, ''));
            alert('Citation copied to clipboard!');
            modal.remove();
        });
        
        modal.querySelector('#closeCitation').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    initializeCategories() {
        // This would initialize category display if needed
        console.log('Categories initialized');
    }
}

// Initialize the research library when the page loads
let researchLibrary;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ResearchLibrary');
    
    // Check if we're on the research page
    if (document.querySelector('.research-container') || 
        window.location.pathname.includes('research.html')) {
        
        researchLibrary = new ResearchLibrary();
        window.researchLibrary = researchLibrary; // Make it available globally
        
        // Force display of content
        setTimeout(() => {
            const container = document.getElementById('researchContainer');
            if (container) {
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            }
        }, 100);
    }
});

// Global function to reset filters (for use in HTML)
function resetResearchFilters() {
    if (window.researchLibrary) {
        window.researchLibrary.resetFilters();
    }
}
