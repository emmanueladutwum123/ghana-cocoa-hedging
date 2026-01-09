// typewriter.js - Typewriter animation effects

class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.dataset.text || element.textContent;
        this.speed = parseInt(element.dataset.speed) || options.speed || 50;
        this.delay = parseInt(element.dataset.delay) || options.delay || 1000;
        this.loop = element.dataset.loop === 'true' || options.loop || false;
        this.cursor = element.dataset.cursor !== 'false';
        this.cursorChar = element.dataset.cursorChar || options.cursorChar || '|';
        this.deleteSpeed = parseInt(element.dataset.deleteSpeed) || options.deleteSpeed || 30;
        
        this.init();
    }
    
    init() {
        // Clear element content
        this.element.textContent = '';
        
        // Add cursor if enabled
        if (this.cursor) {
            this.cursorElement = document.createElement('span');
            this.cursorElement.className = 'typewriter-cursor';
            this.cursorElement.textContent = this.cursorChar;
            this.element.appendChild(this.cursorElement);
        }
        
        // Start typing
        setTimeout(() => {
            this.type();
        }, this.delay);
    }
    
    type() {
        let i = 0;
        const typing = () => {
            if (i < this.text.length) {
                // Insert character before cursor
                const textNode = document.createTextNode(this.text.charAt(i));
                this.element.insertBefore(textNode, this.cursorElement);
                i++;
                
                // Add slight random delay for natural feel
                const delay = this.speed + (Math.random() * 20 - 10);
                setTimeout(typing, delay);
            } else {
                // Finished typing
                if (this.loop) {
                    setTimeout(() => {
                        this.delete();
                    }, 2000); // Pause before deleting
                }
            }
        };
        
        typing();
    }
    
    delete() {
        let i = this.text.length;
        const deleting = () => {
            if (i > 0) {
                // Remove last character
                const lastChild = this.element.childNodes[this.element.childNodes.length - 2];
                if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
                    lastChild.remove();
                }
                i--;
                
                setTimeout(deleting, this.deleteSpeed);
            } else {
                // Start typing again
                setTimeout(() => {
                    this.type();
                }, 500);
            }
        };
        
        deleting();
    }
}

// Initialize all typewriter elements on page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typewriter elements
    document.querySelectorAll('.typewriter-text').forEach(element => {
        new Typewriter(element);
    });
    
    // Initialize main typewriter with special options
    const mainTypewriter = document.querySelector('.typewriter-main');
    if (mainTypewriter) {
        new Typewriter(mainTypewriter, {
            speed: 60,
            delay: 500,
            loop: true,
            deleteSpeed: 40
        });
    }
    
    // Add CSS for cursor animation
    if (!document.querySelector('#typewriter-styles')) {
        const style = document.createElement('style');
        style.id = 'typewriter-styles';
        style.textContent = `
            .typewriter-cursor {
                display: inline-block;
                margin-left: 2px;
                animation: blink 1s infinite;
                color: var(--secondary);
                font-weight: 400;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .typewriter-text, .typewriter-main {
                display: inline-block;
                min-height: 1.2em;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animate numbers in hero section
    animateHeroNumbers();
});

function animateHeroNumbers() {
    const numberElements = document.querySelectorAll('.stat-value[data-count]');
    
    numberElements.forEach(element => {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const steps = 60; // 60fps
        const stepValue = target / (duration / (1000/60));
        let current = 0;
        
        const animate = () => {
            current += stepValue;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animate();
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Typewriter;
}
