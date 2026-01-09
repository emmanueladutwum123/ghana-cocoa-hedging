// research-library.js - Fixed Research Library

class ResearchLibrary {
    constructor() {
        this.papers = this.generateSamplePapers();
        this.filteredPapers = [...this.papers];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.currentView = 'grid';
        
        this.init();
    }
    
    init() {
        this.renderPapersGrid();
        this.setupEventListeners();
        this.setupSearch();
        this.updateResultsCount();
        this.fixLayoutIssues();
    }
    
    generateSamplePapers() {
        // Return sample papers array (same as before but corrected)
        return [
            {
                id: 1,
                title: "Black-Scholes Adaptation for Cocoa Options in Emerging Markets",
                authors: ["Agyei-Ampomah, S.", "Mensah, K."],
                year: 2023,
                journal: "Journal of Derivatives",
                abstract: "Adaptation of Black-Scholes model for cocoa options pricing with Ghana-specific parameters including convenience yield and storage costs.",
                category: "pricing",
                citations: 28,
                downloads: 189,
                pages: 22,
                tags: ["options", "pricing", "black-scholes"],
                access: "open"
            },
            // Add more papers...
        ];
    }
    
    fixLayoutIssues() {
        // Fix research page layout
        document.querySelectorAll('.paper-card, .featured-paper').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
        });
        
        // Fix search section
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.style.opacity = '1';
            searchSection.style.zIndex = '1';
        }
    }
    
    renderPapersGrid() {
        const grid = document.getElementById('papersGrid');
        if (!grid) return;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pagePapers = this.filteredPapers.slice(start, end);
        
        if (pagePapers.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No papers found</h3>
                    <p>Try different search terms or filters</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = pagePapers.map(paper => this.createPaperCard(paper)).join('');
        this.attachPaperEventListeners();
    }
    
    createPaperCard(paper) {
        return `
            <div class="paper-card" data-id="${paper.id}">
                <div class="paper-header">
                    <span class="paper-access ${paper.access}">
                        <i class="fas fa-${paper.access === 'open' ? 'lock-open' : 'lock'}"></i>
                        ${paper.access === 'open' ? 'Open Access' : 'Restricted'}
                    </span>
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
        
        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                document.getElementById('categoryFilter').value = category;
                this.applyFilters();
            });
        });
        
        // Apply filters
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || 'all';
        
        this.filteredPapers = this.papers.filter(paper => {
            // Search filter
            if (searchTerm && !this.paperMatchesSearch(paper, searchTerm)) {
                return false;
            }
            
            // Category filter
            if (category !== 'all' && paper.category !== category) {
                return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderPapersGrid();
        this.updateResultsCount();
    }
    
    paperMatchesSearch(paper, term) {
        const searchable = paper.title + ' ' + paper.authors.join(' ') + ' ' + paper.abstract;
        return searchable.toLowerCase().includes(term);
    }
    
    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            const total = this.filteredPapers.length;
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + this.itemsPerPage - 1, total);
            countElement.textContent = `Showing ${start}-${end} of ${total} papers`;
        }
    }
    
    attachPaperEventListeners() {
        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = e.target.closest('[data-id]').dataset.id;
                this.downloadPaper(paperId);
            });
        });
        
        // Cite buttons
        document.querySelectorAll('.cite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const paperId = e.target.closest('[data-id]').dataset.id;
                this.showCitation(paperId);
            });
        });
    }
    
    downloadPaper(paperId) {
        const paper = this.papers.find(p => p.id == paperId);
        if (!paper) return;
        
        // Simulate download
        const content = `Title: ${paper.title}\nAuthors: ${paper.authors.join(', ')}\nYear: ${paper.year}\n\nThis is a sample download for demonstration purposes.`;
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        if (typeof showNotification === 'function') {
            showNotification(`Downloading "${paper.title}"`, 'success');
        }
    }
    
    showCitation(paperId) {
        const paper = this.papers.find(p => p.id == paperId);
        if (!paper) return;
        
        const citation = `${paper.authors.join(', ')} (${paper.year}). "${paper.title}". <em>${paper.journal}</em>.`;
        
        const modalContent = `
            <h3>Citation</h3>
            <p>${citation}</p>
            <div class="modal-actions">
                <button class="btn btn-primary copy-citation">Copy</button>
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        `;
        
        // Show modal
        const modal = document.createElement('div');
        modal.className = 'citation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.copy-citation').addEventListener('click', () => {
            navigator.clipboard.writeText(citation.replace(/<[^>]*>/g, ''));
            if (typeof showNotification === 'function') {
                showNotification('Citation copied', 'success');
            }
            modal.remove();
        });
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    setupSearch() {
        // Debounced search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (e.target.value.length >= 3 || e.target.value.length === 0) {
                        this.applyFilters();
                    }
                }, 500);
            });
        }
    }
}

// Initialize research library
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.research-container')) {
        new ResearchLibrary();
    }
});
