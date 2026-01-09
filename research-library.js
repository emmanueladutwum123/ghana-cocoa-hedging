// research-library.js - COMPLETE REVISED with Working Display

class ResearchLibrary {
    constructor() {
        this.papers = this.generateSamplePapers();
        this.filteredPapers = [...this.papers];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.currentView = 'grid';
        this.currentCategory = 'all';
        
        this.init();
    }
    
    init() {
        this.renderPapersGrid();
        this.setupEventListeners();
        this.setupSearch();
        this.updateResultsCount();
        this.fixLayoutIssues();
        this.initializeCategories();
        this.attachPaperEventListeners();
    }
    
    generateSamplePapers() {
        return [
            {
                id: 1,
                title: "Black-Scholes Adaptation for Cocoa Options in Emerging Markets",
                authors: ["Agyei-Ampomah, S.", "Mensah, K.", "Appiah, J."],
                year: 2023,
                journal: "Journal of Derivatives",
                abstract: "This paper adapts the Black-Scholes-Merton model for pricing cocoa options in emerging markets, incorporating Ghana-specific parameters including convenience yield, storage costs, and seasonal effects. We derive closed-form solutions and validate with market data.",
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
                title: "Delta Hedging Strategies for Ghana Cocoa Board",
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
                title: "Risk Management Strategies for Smallholder Cocoa Farmers",
                authors: ["Addo, M.", "Quartey, P.", "Osei, R."],
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
                title: "Convenience Yield in Cocoa Storage and Pricing",
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
                title: "Machine Learning for Cocoa Price Prediction",
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
                title: "Option Pricing with Jump Diffusion for Cocoa",
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
        // Make sure all research elements are visible
        document.querySelectorAll('.paper-card, .featured-paper, .category-card').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            card.style.transform = 'translateY(0)';
        });
        
        // Fix search section
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.style.opacity = '1';
            searchSection.style.zIndex = '1';
            searchSection.style.position = 'relative';
        }
        
        // Fix grid layout
        const papersGrid = document.getElementById('papersGrid');
        if (papersGrid) {
            papersGrid.style.display = 'grid';
            papersGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            papersGrid.style.gap = 'var(--space)';
        }
    }
    
    initializeCategories() {
        const categories = {
            'pricing': { name: 'Options Pricing', count: 3, icon: 'fa-calculator' },
            'hedging': { name: 'Hedging Strategies', count: 1, icon: 'fa-shield-alt' },
            'forecasting': { name: 'Forecasting Models', count: 2, icon: 'fa-chart-line' },
            'risk': { name: 'Risk Management', count: 2, icon: 'fa-exclamation-triangle' }
        };
        
        const container = document.querySelector('.categories-grid');
        if (container) {
            container.innerHTML = Object.entries(categories).map(([id, cat]) => `
                <div class="category-card" data-category="${id}">
                    <div class="category-icon">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <div class="category-content">
                        <h4>${cat.name}</h4>
                        <div class="category-count">${cat.count} papers</div>
                        <p class="category-desc">Research on ${cat.name.toLowerCase()}</p>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to category cards
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const category = e.currentTarget.dataset.category;
                    this.filterByCategory(category);
                });
            });
        }
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        document.getElementById('categoryFilter').value = category;
        this.applyFilters();
        
        // Update UI
        document.querySelectorAll('.category-card').forEach(card => {
            if (card.dataset.category === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    renderPapersGrid() {
        const grid = document.getElementById('papersGrid');
        const list = document.getElementById('papersList');
        
        if (!grid && !list) return;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pagePapers = this.filteredPapers.slice(start, end);
        
        if (pagePapers.length === 0) {
            const noResults = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No papers found</h3>
                    <p>Try different search terms or filters</p>
                    <button class="btn btn-secondary mt-2" onclick="researchLibrary.resetFilters()">
                        Reset Filters
                    </button>
                </div>
            `;
            
            if (grid) grid.innerHTML = noResults;
            if (list) list.innerHTML = noResults;
            return;
        }
        
        if (this.currentView === 'grid' && grid) {
            grid.innerHTML = pagePapers.map(paper => this.createPaperCard(paper)).join('');
        } else if (this.currentView === 'list' && list) {
            list.innerHTML = pagePapers.map(paper => this.createPaperListItem(paper)).join('');
        }
        
        this.attachPaperEventListeners();
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
                    <h3 class="paper-title" title="${paper.title}">${paper.title}</h3>
                    
                    <div class="paper-meta">
                        <span class="authors" title="${paper.authors.join(', ')}">
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
                    
                    <p class="paper-abstract">${paper.abstract.length > 200 ? paper.abstract.substring(0, 200) + '...' : paper.abstract}</p>
                    
                    <div class="paper-tags">
                        ${paper.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="paper-metrics">
                        <span class="metric">
                            <i class="fas fa-quote-left"></i>
                            ${paper.citations} citations
                        </span>
                        <span class="metric">
                            <i class="fas fa-download"></i>
                            ${paper.downloads} downloads
                        </span>
                        <span class="metric">
                            <i class="fas fa-file"></i>
                            ${paper.pages} pages
                        </span>
                    </div>
                    
                    <div class="paper-actions">
                        <button class="btn btn-primary btn-sm download-btn" data-id="${paper.id}">
                            <i class="fas fa-file-pdf"></i> Download
                        </button>
                        <button class="btn btn-secondary btn-sm cite-btn" data-id="${paper.id}">
                            <i class="fas fa-quote-right"></i> Cite
                        </button>
                        <button class="btn btn-secondary btn-sm details-btn" data-id="${paper.id}">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createPaperListItem(paper) {
        return `
            <div class="paper-list-item" data-id="${paper.id}">
                <div class="list-left">
                    <div class="list-header">
                        <span class="paper-access ${paper.access}">
                            <i class="fas fa-${paper.access === 'open' ? 'lock-open' : 'lock'}"></i>
                            ${paper.access === 'open' ? 'Open' : 'Restricted'}
                        </span>
                        ${paper.featured ? '<span class="paper-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                        <span class="year">${paper.year}</span>
                    </div>
                    <h3 class="paper-title">${paper.title}</h3>
                    <p class="authors">${paper.authors.join(', ')}</p>
                    <p class="journal"><i class="fas fa-book"></i> ${paper.journal}</p>
                    <p class="abstract">${paper.abstract.substring(0, 150)}...</p>
                </div>
                <div class="list-right">
                    <div class="paper-metrics">
                        <span class="metric">
                            <i class="fas fa-quote-left"></i> ${paper.citations}
                        </span>
                        <span class="metric">
                            <i class="fas fa-download"></i> ${paper.downloads}
                        </span>
                    </div>
                    <div class="paper-actions">
                        <button class="btn btn-primary btn-sm download-btn" data-id="${paper.id}">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm cite-btn" data-id="${paper.id}">
                            <i class="fas fa-quote-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => this.applyFilters());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.applyFilters();
            });
        }
        
        // View toggle
        const viewSelect = document.getElementById('viewSelect');
        if (viewSelect) {
            viewSelect.addEventListener('change', (e) => {
                this.currentView = e.target.value;
                this.renderPapersGrid();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Sort by
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.applyFilters());
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
        
        // Advanced search toggle
        const advancedToggle = document.getElementById('advancedSearchToggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => {
                const advancedSearch = document.getElementById('advancedSearch');
                if (advancedSearch) {
                    advancedSearch.style.display = advancedSearch.style.display === 'block' ? 'none' : 'block';
                    advancedToggle.innerHTML = advancedSearch.style.display === 'block' ? 
                        '<i class="fas fa-chevron-up"></i> Hide Advanced' : 
                        '<i class="fas fa-chevron-down"></i> Advanced Search';
                }
            });
        }
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
        const journal = document.getElementById('journalFilter')?.value || 'all';
        const sortBy = document.getElementById('sortBy')?.value || 'recent';
        
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
            if (year !== 'all') {
                if (year === '2020' && paper.year > 2020) {
                    return false;
                } else if (paper.year.toString() !== year) {
                    return false;
                }
            }
            
            // Journal filter
            if (journal !== 'all' && !paper.journal.toLowerCase().includes(journal.toLowerCase())) {
                return false;
            }
            
            return true;
        });
        
        // Sort papers
        this.sortPapers(sortBy);
        
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
    
    sortPapers(sortBy) {
        switch(sortBy) {
            case 'recent':
                this.filteredPapers.sort((a, b) => b.year - a.year);
                break;
            case 'cited':
                this.filteredPapers.sort((a, b) => b.citations - a.citations);
                break;
            case 'title':
                this.filteredPapers.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'downloads':
                this.filteredPapers.sort((a, b) => b.downloads - a.downloads);
                break;
        }
    }
    
    resetFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const yearFilter = document.getElementById('yearFilter');
        const journalFilter = document.getElementById('journalFilter');
        const sortBy = document.getElementById('sortBy');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (yearFilter) yearFilter.value = 'all';
        if (journalFilter) journalFilter.value = 'all';
        if (sortBy) sortBy.value = 'recent';
        
        this.currentCategory = 'all';
        this.applyFilters();
        
        // Reset category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
    }
    
    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            const total = this.filteredPapers.length;
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + this.itemsPerPage - 1, total);
            
            if (total === 0) {
                countElement.textContent = 'No papers found';
            } else if (total <= this.itemsPerPage) {
                countElement.textContent = `Showing ${total} papers`;
            } else {
                countElement.textContent = `Showing ${start}-${end} of ${total} papers`;
            }
        }
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
        pagination.querySelectorAll('.page-btn:not(.active):not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('prev')) {
                    this.currentPage--;
                } else if (e.target.classList.contains('next')) {
                    this.currentPage++;
                } else {
                    this.currentPage = parseInt(e.target.dataset.page);
                }
                this.renderPapersGrid();
                this.updateResultsCount();
                window.scrollTo({ top: document.querySelector('.papers-section').offsetTop - 100, behavior: 'smooth' });
            });
        });
    }
    
    attachPaperEventListeners() {
        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paperId = parseInt(e.currentTarget.closest('[data-id]').dataset.id);
                this.downloadPaper(paperId);
            });
        });
        
        // Cite buttons
        document.querySelectorAll('.cite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paperId = parseInt(e.currentTarget.closest('[data-id]').dataset.id);
                this.showCitationModal(paperId);
            });
        });
        
        // Details buttons
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paperId = parseInt(e.currentTarget.closest('[data-id]').dataset.id);
                this.showPaperDetails(paperId);
            });
        });
        
        // Paper cards click (for details)
        document.querySelectorAll('.paper-card, .paper-list-item').forEach(card => {
            card.addEventListener('click', (e) => {
                // Only trigger if not clicking on a button
                if (!e.target.closest('button') && !e.target.tagName === 'A') {
                    const paperId = parseInt(card.dataset.id);
                    this.showPaperDetails(paperId);
                }
            });
        });
    }
    
    downloadPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        // Show download in progress
        if (typeof showNotification === 'function') {
            showNotification(`Preparing download: "${paper.title}"`, 'info');
        }
        
        // Simulate download after delay
        setTimeout(() => {
            // Create download content
            const content = `
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Year: ${paper.year}
Journal: ${paper.journal}
DOI: ${paper.doi || 'Not available'}
Pages: ${paper.pages}
Citations: ${paper.citations}

ABSTRACT:
${paper.abstract}

TAGS: ${paper.tags.join(', ')}

---
This is a simulated download for demonstration purposes.
For the full paper, please visit the journal website.
            `.trim();
            
            // Create download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cocoa-research-${paper.id}-${paper.title.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Update download count
            paper.downloads++;
            
            // Show success notification
            if (typeof showNotification === 'function') {
                showNotification(`Downloaded: "${paper.title}"`, 'success');
            }
        }, 1000);
    }
    
    showCitationModal(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const apa = this.generateAPACitation(paper);
        const chicago = this.generateChicagoCitation(paper);
        const mla = this.generateMLACitation(paper);
        
        const modalContent = `
            <div class="citation-modal">
                <h3>Citation for: ${paper.title}</h3>
                <p>Select format and copy to clipboard:</p>
                
                <div class="citation-format">
                    <h4>APA Format</h4>
                    <div class="citation-text">
                        <p>${apa}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm copy-citation" data-citation="${this.escapeHTML(apa)}">
                        <i class="fas fa-copy"></i> Copy APA
                    </button>
                </div>
                
                <div class="citation-format">
                    <h4>Chicago Format</h4>
                    <div class="citation-text">
                        <p>${chicago}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm copy-citation" data-citation="${this.escapeHTML(chicago)}">
                        <i class="fas fa-copy"></i> Copy Chicago
                    </button>
                </div>
                
                <div class="citation-format">
                    <h4>MLA Format</h4>
                    <div class="citation-text">
                        <p>${mla}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm copy-citation" data-citation="${this.escapeHTML(mla)}">
                        <i class="fas fa-copy"></i> Copy MLA
                    </button>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary close-modal">Close</button>
                </div>
            </div>
        `;
        
        this.showModal('Citation Generator', modalContent);
        
        // Add copy functionality
        document.querySelectorAll('.copy-citation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const citation = e.target.getAttribute('data-citation');
                navigator.clipboard.writeText(citation.replace(/<[^>]*>/g, ''))
                    .then(() => {
                        if (typeof showNotification === 'function') {
                            showNotification('Citation copied to clipboard!', 'success');
                        }
                    })
                    .catch(() => {
                        if (typeof showNotification === 'function') {
                            showNotification('Failed to copy citation', 'error');
                        }
                    });
            });
        });
    }
    
    generateAPACitation(paper) {
        const authors = paper.authors.map(author => {
            const parts = author.split(' ');
            const lastName = parts[parts.length - 1];
            const initials = parts.slice(0, -1).map(name => name[0] + '.').join(' ');
            return `${lastName}, ${initials}`;
        }).join(', ');
        
        return `${authors} (${paper.year}). ${paper.title}. <em>${paper.journal}</em>.`;
    }
    
    generateChicagoCitation(paper) {
        const firstAuthor = paper.authors[0];
        const otherAuthors = paper.authors.slice(1);
        
        let authorsStr = firstAuthor;
        if (otherAuthors.length === 1) {
            authorsStr += ` and ${otherAuthors[0]}`;
        } else if (otherAuthors.length > 1) {
            authorsStr += ` et al.`;
        }
        
        return `${authorsStr}. "${paper.title}." <em>${paper.journal}</em> (${paper.year}).`;
    }
    
    generateMLACitation(paper) {
        const firstAuthor = paper.authors[0];
        const otherAuthors = paper.authors.slice(1);
        
        let authorsStr = firstAuthor;
        if (otherAuthors.length > 0) {
            authorsStr += ` et al.`;
        }
        
        return `${authorsStr}. "${paper.title}." <em>${paper.journal}</em>, ${paper.year}.`;
    }
    
    showPaperDetails(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const modalContent = `
            <div class="paper-details-modal">
                <div class="paper-header">
                    <div class="paper-badges">
                        <span class="paper-access ${paper.access}">
                            <i class="fas fa-${paper.access === 'open' ? 'lock-open' : 'lock'}"></i>
                            ${paper.access === 'open' ? 'Open Access' : 'Restricted Access'}
                        </span>
                        ${paper.featured ? '<span class="paper-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                    </div>
                    <h3>${paper.title}</h3>
                </div>
                
                <div class="paper-info">
                    <div class="info-section">
                        <h4>Authors</h4>
                        <p>${paper.authors.join(', ')}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Publication Details</h4>
                        <p><strong>Journal:</strong> ${paper.journal}</p>
                        <p><strong>Year:</strong> ${paper.year}</p>
                        <p><strong>Pages:</strong> ${paper.pages}</p>
                        ${paper.doi ? `<p><strong>DOI:</strong> <a href="https://doi.org/${paper.doi}" target="_blank">${paper.doi}</a></p>` : ''}
                    </div>
                    
                    <div class="info-section">
                        <h4>Abstract</h4>
                        <p>${paper.abstract}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Keywords</h4>
                        <div class="tags">
                            ${paper.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Metrics</h4>
                        <div class="metrics">
                            <div class="metric-item">
                                <i class="fas fa-quote-left"></i>
                                <span>${paper.citations} citations</span>
                            </div>
                            <div class="metric-item">
                                <i class="fas fa-download"></i>
                                <span>${paper.downloads} downloads</span>
                            </div>
                            <div class="metric-item">
                                <i class="fas fa-category"></i>
                                <span>${paper.category.replace(/-/g, ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="paper-actions">
                    <button class="btn btn-primary download-modal-btn" data-id="${paper.id}">
                        <i class="fas fa-file-pdf"></i> Download Paper
                    </button>
                    <button class="btn btn-secondary cite-modal-btn" data-id="${paper.id}">
                        <i class="fas fa-quote-right"></i> Generate Citation
                    </button>
                    <button class="btn btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        this.showModal('Paper Details', modalContent);
        
        // Add event listeners for buttons in modal
        document.querySelector('.download-modal-btn')?.addEventListener('click', () => {
            this.downloadPaper(paperId);
        });
        
        document.querySelector('.cite-modal-btn')?.addEventListener('click', () => {
            document.querySelector('.custom-modal')?.remove();
            this.showCitationModal(paperId);
        });
    }
    
    showModal(title, content) {
        // Remove existing modal
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) existingModal.remove();
        
        const modalHTML = `
            <div class="custom-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title">${title}</h3>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal.firstElementChild);
        
        // Add event listeners
        const modalElement = document.querySelector('.custom-modal');
        
        modalElement.querySelector('.modal-close').addEventListener('click', () => {
            modalElement.remove();
        });
        
        modalElement.querySelector('.modal-overlay').addEventListener('click', () => {
            modalElement.remove();
        });
        
        modalElement.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modalElement.remove();
            });
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modalElement.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize research library
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.research-container') || 
        document.querySelector('.papers-section') ||
        document.querySelector('#papersGrid')) {
        window.researchLibrary = new ResearchLibrary();
    }
});

// Add CSS for research library
const researchStyles = document.createElement('style');
researchStyles.textContent = `
    .paper-card {
        background: var(--bg-primary);
        border: 2px solid var(--border);
        border-radius: var(--radius-xl);
        padding: var(--space-lg);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: var(--shadow);
    }
    
    .paper-card:hover {
        transform: translateY(-5px);
        border-color: var(--primary);
        box-shadow: var(--shadow-lg);
    }
    
    .paper-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space);
    }
    
    .paper-access {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .paper-access.open {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
        border: 1px solid rgba(40, 167, 69, 0.2);
    }
    
    .paper-access.restricted {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
        border: 1px solid rgba(220, 53, 69, 0.2);
    }
    
    .paper-featured {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        background: rgba(255, 193, 7, 0.1);
        color: var(--warning);
        border: 1px solid rgba(255, 193, 7, 0.2);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .paper-title {
        font-size: 1.1rem;
        margin-bottom: var(--space-sm);
        line-height: 1.4;
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .paper-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-sm);
        margin-bottom: var(--space);
        color: var(--text-tertiary);
        font-size: 0.875rem;
    }
    
    .paper-meta span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .paper-abstract {
        color: var(--text-secondary);
        margin-bottom: var(--space);
        line-height: 1.6;
        font-size: 0.875rem;
        flex-grow: 1;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .paper-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: var(--space);
    }
    
    .paper-tags .tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background: var(--bg-tertiary);
        border-radius: 50px;
        color: var(--text-tertiary);
    }
    
    .paper-metrics {
        display: flex;
        gap: var(--space);
        margin-bottom: var(--space);
    }
    
    .paper-metrics .metric {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-tertiary);
    }
    
    .paper-actions {
        display: flex;
        gap: var(--space-sm);
        margin-top: auto;
    }
    
    .category-card {
        background: var(--bg-primary);
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space);
        display: flex;
        gap: var(--space);
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .category-card:hover,
    .category-card.active {
        border-color: var(--primary);
        background: rgba(0, 107, 63, 0.05);
        transform: translateY(-2px);
    }
    
    .category-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .category-content {
        flex: 1;
    }
    
    .category-content h4 {
        margin-bottom: 0.25rem;
        font-size: 1rem;
    }
    
    .category-count {
        color: var(--primary);
        font-weight: 700;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }
    
    .category-desc {
        color: var(--text-tertiary);
        font-size: 0.875rem;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--space-2xl);
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        border: 2px dashed var(--border);
    }
    
    .no-results i {
        font-size: 3rem;
        color: var(--text-tertiary);
        margin-bottom: var(--space);
        opacity: 0.5;
    }
    
    .no-results h3 {
        color: var(--text-secondary);
        margin-bottom: var(--space-sm);
    }
    
    .no-results p {
        color: var(--text-tertiary);
        margin-bottom: var(--space);
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        gap: var(--space-sm);
        margin-top: var(--space-xl);
    }
    
    .page-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }
    
    .page-btn:hover:not(:disabled):not(.active) {
        background: var(--bg-tertiary);
    }
    
    .page-btn.active {
        background: var(--primary);
        color: white;
        border-color: transparent;
    }
    
    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .page-dots {
        padding: 0.5rem 1rem;
        color: var(--text-tertiary);
    }
    
    .paper-details-modal .paper-header {
        margin-bottom: var(--space-lg);
    }
    
    .paper-details-modal .paper-badges {
        display: flex;
        gap: var(--space-sm);
        margin-bottom: var(--space);
    }
    
    .paper-details-modal .paper-info {
        margin-bottom: var(--space-xl);
    }
    
    .paper-details-modal .info-section {
        margin-bottom: var(--space);
    }
    
    .paper-details-modal .info-section h4 {
        color: var(--text-secondary);
        margin-bottom: var(--space-sm);
        font-size: 1rem;
    }
    
    .paper-details-modal .metrics {
        display: flex;
        gap: var(--space);
    }
    
    .paper-details-modal .metric-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border-radius: var(--radius);
        color: var(--text-secondary);
    }
    
    .citation-format {
        margin-bottom: var(--space);
        padding: var(--space);
        background: var(--bg-secondary);
        border-radius: var(--radius);
    }
    
    .citation-format h4 {
        margin-bottom: var(--space-sm);
        color: var(--text-primary);
    }
    
    .citation-text {
        background: var(--bg-tertiary);
        padding: var(--space);
        border-radius: var(--radius);
        margin-bottom: var(--space);
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
    }
    
    .citation-text p {
        margin: 0;
    }
`;
document.head.appendChild(researchStyles);
