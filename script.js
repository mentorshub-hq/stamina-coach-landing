/**
 * Vitality74 Landing Page Scripts
 * Premium Stealth Luxury Edition
 */

// ========================================
// Particle Field Animation
// ========================================
class ParticleField {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: null, y: null };

        this.init();
    }

    init() {
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.4;
        `;
        document.body.prepend(this.canvas);

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.7 ? '#F59E0B' : '#3F3F46'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Subtle mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    particle.x -= dx * 0.01;
                    particle.y -= dy * 0.01;
                }
            }

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// Scroll Reveal Animations (Framer-style)
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Select all animatable elements
        // Note: privacy-card removed since parent .privacy-grid has data-animate
        const selectors = [
            '.hero-content',
            '.hero-phone',
            '.section-header',
            '.cycle-timeline',
            '.protocol-block',
            '.insight-card',
            '.pricing-card',
            '.pricing-comparison',
            '.faq-item'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${index * 0.1}s`;
                this.elements.push(el);
            });
        });

        // Add reveal styles
        const style = document.createElement('style');
        style.textContent = `
            .reveal {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .reveal.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .reveal-left {
                opacity: 0;
                transform: translateX(-60px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .reveal-left.visible {
                opacity: 1;
                transform: translateX(0);
            }

            .reveal-right {
                opacity: 0;
                transform: translateX(60px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .reveal-right.visible {
                opacity: 1;
                transform: translateX(0);
            }

            .reveal-scale {
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .reveal-scale.visible {
                opacity: 1;
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);

        // Apply directional reveals
        document.querySelectorAll('.protocol-block:nth-child(odd) .protocol-visual').forEach(el => {
            el.classList.add('reveal-left');
            this.elements.push(el);
        });

        document.querySelectorAll('.protocol-block:nth-child(even) .protocol-visual').forEach(el => {
            el.classList.add('reveal-right');
            this.elements.push(el);
        });

        document.querySelectorAll('.hero-phone').forEach(el => {
            el.classList.remove('reveal');
            el.classList.add('reveal-scale');
        });

        // Also observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.elements.push(el);
        });

        // Set up observer
        this.setupObserver();
    }

    setupObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));

        // Also observe elements with reveal classes
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el);
        });
    }
}

// ========================================
// Navbar Controller
// ========================================
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.lastScrollY = 0;

        if (this.navbar) {
            this.init();
        }
    }

    init() {
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu
        if (this.mobileMenuBtn && this.navLinks) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());

            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Background opacity based on scroll
        if (currentScrollY > 50) {
            this.navbar.style.background = 'rgba(9, 9, 11, 0.95)';
            this.navbar.style.borderBottom = '1px solid rgba(63, 63, 70, 0.5)';
        } else {
            this.navbar.style.background = 'rgba(9, 9, 11, 0.8)';
            this.navbar.style.borderBottom = '1px solid transparent';
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        this.mobileMenuBtn.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
    }
}

// ========================================
// Smooth Scroll
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    }

    handleClick(e, anchor) {
        const href = anchor.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ========================================
// FAQ Accordion
// ========================================
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');

        if (this.items.length > 0) {
            this.init();
        }
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', () => this.toggle(item));
            }
        });
    }

    toggle(item) {
        // Close other items
        this.items.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('open')) {
                otherItem.classList.remove('open');
            }
        });

        // Toggle current item
        item.classList.toggle('open');
    }
}

// ========================================
// Cycle Timeline Animation
// ========================================
class CycleTimeline {
    constructor() {
        this.timeline = document.querySelector('.cycle-timeline');
        this.phases = document.querySelectorAll('.cycle-phase');

        if (this.timeline && this.phases.length > 0) {
            this.init();
        }
    }

    init() {
        // Animate phases sequentially when timeline is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animatePhases();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.timeline);
    }

    animatePhases() {
        this.phases.forEach((phase, index) => {
            phase.style.opacity = '0';
            phase.style.transform = 'translateY(20px)';
            phase.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                phase.style.opacity = '1';
                phase.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// ========================================
// Button Glow Effect
// ========================================
class ButtonGlow {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-glow');

        if (this.buttons.length > 0) {
            this.init();
        }
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMouseMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, button));
        });
    }

    handleMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--glow-x', `${x}px`);
        button.style.setProperty('--glow-y', `${y}px`);
    }

    handleMouseLeave(e, button) {
        button.style.setProperty('--glow-x', '50%');
        button.style.setProperty('--glow-y', '50%');
    }
}

// ========================================
// Mobile Menu Styles (injected)
// ========================================
function injectMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(9, 9, 11, 0.98);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                flex-direction: column;
                padding: 24px;
                gap: 16px;
                border-bottom: 1px solid rgba(63, 63, 70, 0.5);
                transform: translateY(-100%);
                opacity: 0;
                pointer-events: none;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            .nav-links.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
                display: flex;
            }

            .mobile-menu-btn.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-btn.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Number Counter Animation
// ========================================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');

        if (this.counters.length > 0) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inject mobile styles first
    injectMobileStyles();

    // Initialize all modules
    new ParticleField();
    new ScrollReveal();
    new NavbarController();
    new SmoothScroll();
    new FAQAccordion();
    new CycleTimeline();
    new ButtonGlow();
    new NumberCounter();

    // Add loading complete class
    document.body.classList.add('loaded');
});

// ========================================
// Preloader (optional enhancement)
// ========================================
window.addEventListener('load', function() {
    document.body.classList.add('ready');
});
