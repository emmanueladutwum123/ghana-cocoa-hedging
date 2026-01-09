class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.dataset.text || '';
        this.speed = options.speed || 50;
        this.delay = options.delay || 1000;
        this.loop = options.loop || false;
        this.currentIndex = 0;
        this.isDeleting = false;
        this.init();
    }
    
    init() {
        setTimeout(() => this.type(), this.delay);
    }
    
    type() {
        const currentText = this.text.substring(0, this.currentIndex);
        this.element.textContent = currentText;
        
        if (!this.isDeleting && this.currentIndex < this.text.length) {
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.speed / 2);
        } else if (this.loop) {
            this.isDeleting = !this.isDeleting;
            setTimeout(() => this.type(), this.delay);
        }
    }
}

// Initialize all typewriters on page
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.typewriter-text').forEach(el => {
        new Typewriter(el, { speed: 50, delay: 500, loop: true });
    });
    
    document.querySelectorAll('.typewriter-main').forEach(el => {
        new Typewriter(el, { speed: 100, delay: 1000 });
    });
});
