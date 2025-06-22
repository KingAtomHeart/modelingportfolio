// ===============================
// SMOOTH ANIMATIONS & INTERACTIONS
// Portfolio Website JavaScript
// ===============================

class PortfolioAnimations {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObserver();
        // Removed setupParallax() call to disable hero parallax
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        // Initialize all components
        this.preloadImages();
        this.initNavigation();
        this.initLightbox();
        this.initSmoothScroll();
        this.initAnimationTriggers();
    }

    bindEvents() {
        // Smooth scroll performance optimization
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize handling with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });
    }

    // ===============================
    // NAVIGATION ANIMATIONS
    // ===============================
    initNavigation() {
        const nav = document.querySelector('.nav');
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links a');

        // Mobile menu toggle with smooth animation
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu(menuToggle, navLinks);
            });

            // Close menu when clicking on links
            navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu(menuToggle, navLinks);
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                    this.closeMobileMenu(menuToggle, navLinks);
                }
            });
        }

        // Active link highlighting
        this.highlightActiveSection();
    }

    toggleMobileMenu(toggle, menu) {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu(toggle, menu);
        } else {
            this.openMobileMenu(toggle, menu);
        }
    }

    openMobileMenu(toggle, menu) {
        toggle.classList.add('active');
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = menu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideInLeft 0.3s ease forwards ${(index + 1) * 0.1}s`;
        });
    }

    closeMobileMenu(toggle, menu) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset animations
        const menuItems = menu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.animation = '';
        });
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // ===============================
    // SCROLL ANIMATIONS
    // ===============================
    handleScroll() {
        const nav = document.querySelector('.nav');
        const scrollY = window.scrollY;

        // Navbar background transition
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Removed parallax effect call - hero image will now stay fixed
    }

    // Removed setupParallax() and updateParallax() methods entirely
    // This eliminates the hero image movement on scroll

    // ===============================
    // INTERSECTION OBSERVER ANIMATIONS
    // ===============================
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        this.observeElements();
    }

    observeElements() {
        const elementsToObserve = [
            '.stat-item',
            '.gallery-item',
            '.about-content',
            '.about-image',
            '.featured-content',
            '.featured-image',
            '.contact-link',
            '.section-title'
        ];

        elementsToObserve.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('animate-on-scroll');
                this.observer.observe(el);
            });
        });
    }

    triggerAnimation(element) {
        element.classList.add('animate-in');
        
        // Special handling for different element types
        if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        } else if (element.classList.contains('gallery-item')) {
            this.animateGalleryItem(element);
        }
    }

    animateCounter(statItem) {
        const valueElement = statItem.querySelector('.stat-value');
        if (!valueElement || valueElement.textContent === '?') return;

        const finalValue = valueElement.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const increment = numericValue / 60; // 60 frames animation
        const suffix = finalValue.replace(/[\d,]/g, '');

        const updateCounter = () => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                valueElement.textContent = finalValue;
                return;
            }
            
            const displayValue = Math.floor(currentValue);
            valueElement.textContent = displayValue.toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
        };

        valueElement.textContent = '0' + suffix;
        setTimeout(updateCounter, 200);
    }

    animateGalleryItem(item) {
        const delay = Array.from(item.parentElement.children).indexOf(item) * 100;
        setTimeout(() => {
            item.style.transform = 'translateY(0)';
            item.style.opacity = '1';
        }, delay);
    }

    // ===============================
    // SMOOTH SCROLLING
    // ===============================
    initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                }
            });
        });

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about') || document.querySelector('.section');
                if (aboutSection) {
                    this.smoothScrollTo(aboutSection);
                }
            });
        }
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(1000, Math.abs(distance) * 0.5); // Dynamic duration
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    // ===============================
    // LIGHTBOX FUNCTIONALITY
    // ===============================
    initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        const lightbox = document.querySelector('#lightbox');
        const lightboxImg = document.querySelector('.lightbox-image');
        const closeBtn = document.querySelector('.lightbox-close');

        if (!lightbox || !lightboxImg) return;

        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(lightbox, lightboxImg, img.src, img.alt);
            });
        });

        // Close lightbox
        closeBtn?.addEventListener('click', () => {
            this.closeLightbox(lightbox);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                this.closeLightbox(lightbox);
            }
        });
    }

    openLightbox(lightbox, lightboxImg, src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.style.display = 'block';
        
        // Smooth fade in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '0';
            lightbox.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
            });
        });

        document.body.style.overflow = 'hidden';
    }

    closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // ===============================
    // PERFORMANCE OPTIMIZATIONS
    // ===============================
    preloadImages() {
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            if (img.complete) return;
            
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }

    handleResize() {
        // Recalculate positions and animations on resize
        this.highlightActiveSection();
    }

    initAnimationTriggers() {
        // Add initial states for animations
        const animationElements = document.querySelectorAll('.animate-on-scroll');
        animationElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    }
}

// ===============================
// CUSTOM ANIMATIONS & EFFECTS
// ===============================

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .gallery-item {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .contact-link {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .nav-links.active li {
        opacity: 0;
        transform: translateX(20px);
    }

    @keyframes slideInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes float {
        0%, 100% { 
            transform: translateX(-50%) translateY(0px); 
        }
        50% { 
            transform: translateX(-50%) translateY(-10px); 
        }
    }

    .scroll-indicator {
        animation: float 2s ease-in-out infinite;
        cursor: pointer;
        transition: opacity 0.3s ease;
    }

    .scroll-indicator:hover {
        opacity: 1;
    }

    /* Smooth focus transitions */
    *:focus {
        outline: 2px solid var(--accent-gold, #c9a96e);
        outline-offset: 2px;
        border-radius: 4px;
        transition: outline 0.2s ease;
    }
`;

document.head.appendChild(style);

// ===============================
// INITIALIZE APPLICATION
// ===============================

// Initialize when DOM is ready
const portfolio = new PortfolioAnimations();

// Expose to global scope for debugging
window.PortfolioAnimations = portfolio;