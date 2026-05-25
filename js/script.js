document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP Plugins (if available)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================
    // 1. PRELOADER ANIMATION
    // ==========================================
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    const loaderBar = document.getElementById('loader-bar');

    if (loader && loaderLogo && loaderBar) {
        // Animate preloader items
        const tl = gsap.timeline({
            onComplete: () => {
                // Remove loader when done
                loader.style.display = 'none';
                // Trigger page entry animations
                runEntranceAnimations();
            }
        });

        tl.to(loaderLogo, { opacity: 1, duration: 0.6, ease: 'power2.out' })
          .to(loaderBar, { width: '100%', duration: 1.2, ease: 'power3.inOut' }, '-=0.2')
          .to(loaderLogo, { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' })
          .to(loader, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.1');
    } else {
        // Fallback if no loader elements found
        runEntranceAnimations();
    }

    // ==========================================
    // 2. PAGE ENTRANCE ANIMATIONS (GSAP)
    // ==========================================
    function runEntranceAnimations() {
        if (typeof gsap === 'undefined') return;

        // Make elements visible after loader fades
        gsap.set('.text-line-content', { y: '100%' });
        
        const tl = gsap.timeline();

        // 2a. Header elements animation
        tl.fromTo('#logo-container', 
            { y: -50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }
        );

        tl.fromTo('#desktop-nav .nav-link', 
            { y: -30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }, 
            '-=0.6'
        );

        tl.fromTo('#desktop-cta', 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 
            '-=0.4'
        );

        tl.fromTo('#menu-toggle', 
            { x: 30, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 
            '-=0.6'
        );

        // 2b. Hero elements animation (Sleek text-reveal)
        tl.to('#hero-title .text-line-content', {
            y: '0%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        }, '-=0.5');

        // 2c. Navigation arrows and bottom dots fade-in
        tl.fromTo('#prev-slide', 
            { x: -50, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 
            '-=0.8'
        );

        tl.fromTo('#next-slide', 
            { x: 50, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 
            '-=0.8'
        );

        tl.fromTo('#slider-dots', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 
            '-=0.8'
        );
    }

    // ==========================================
    // 3. BACKGROUND HERO SLIDER (INTERACTIVE)
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const heroTitle = document.getElementById('hero-title');
    
    let currentSlide = 0;
    const slideIntervalTime = 5500; // 5.5 seconds per slide
    let slideTimer;

    // Initialize/Reset slide timer
    function startSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            changeSlide(currentSlide + 1);
        }, slideIntervalTime);
    }

    // Main slide changing function
    function changeSlide(nextIndex) {
        // Calculate bounded index
        let newIndex = nextIndex;
        if (nextIndex >= slides.length) {
            newIndex = 0;
        } else if (nextIndex < 0) {
            newIndex = slides.length - 1;
        }

        if (newIndex === currentSlide) return;

        // Animate text slide-out
        if (typeof gsap !== 'undefined') {
            gsap.to('#hero-title .text-line-content', {
                y: '-100%',
                duration: 0.5,
                stagger: 0.05,
                ease: 'power3.in',
                onComplete: () => {
                    // Update slide active classes
                    slides[currentSlide].classList.remove('active');
                    slides[newIndex].classList.add('active');

                    // Reset and update text positions
                    gsap.set('#hero-title .text-line-content', { y: '100%' });

                    // Update dots
                    dots[currentSlide].classList.remove('active');
                    dots[newIndex].classList.add('active');

                    // Set index
                    currentSlide = newIndex;

                    // Animate text back up
                    gsap.to('#hero-title .text-line-content', {
                        y: '0%',
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out'
                    });
                }
            });
        } else {
            // CSS only fallback
            slides[currentSlide].classList.remove('active');
            slides[newIndex].classList.add('active');
            dots[currentSlide].classList.remove('active');
            dots[newIndex].classList.add('active');
            currentSlide = newIndex;
        }

        // Restart automatic slider timer
        startSlideTimer();
    }

    // Slider Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeSlide(currentSlide + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeSlide(currentSlide - 1);
        });
    }

    // Connect dots
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            changeSlide(idx);
        });
    });

    // Start automated timer
    startSlideTimer();

    // ==========================================
    // 4. MOBILE MENU INTERACTION
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileCta = document.getElementById('mobile-menu-cta');
    let isMenuOpen = false;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            // Toggle classes
            mobileMenu.classList.toggle('active', isMenuOpen);
            
            // Prevent body scroll when menu is active
            if (isMenuOpen) {
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
            
            // Hamburger to 'X' animation via GSAP
            if (typeof gsap !== 'undefined') {
                const bars = menuToggle.querySelectorAll('span');
                if (isMenuOpen) {
                    // Animate to close 'X'
                    gsap.to(bars[0], { rotate: -45, y: 8, width: '32px', duration: 0.3, ease: 'power2.out' });
                    gsap.to(bars[1], { opacity: 0, duration: 0.2 });
                    gsap.to(bars[2], { rotate: 45, y: -8, width: '32px', duration: 0.3, ease: 'power2.out' });

                    // Fade in links sequentially
                    gsap.fromTo(mobileLinks, 
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
                    );
                    gsap.fromTo(mobileCta,
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.5 }
                    );
                } else {
                    // Animate back to hamburger
                    gsap.to(bars[0], { rotate: 0, y: 0, width: '32px', duration: 0.3, ease: 'power2.out' });
                    gsap.to(bars[1], { opacity: 1, duration: 0.2 });
                    gsap.to(bars[2], { rotate: 0, y: 0, width: '28px', duration: 0.3, ease: 'power2.out' });

                    // Fade out links
                    gsap.to([mobileLinks, mobileCta], { opacity: 0, y: 20, duration: 0.2, overwrite: 'auto' });
                }
            }
        });

        // Close mobile menu on clicking any navigation link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    menuToggle.click();
                }
            });
        });
    }

    // ==========================================
    // 5. STICKY HEADER & SCROLL ANIMATION
    // ==========================================
    const mainHeader = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('header-glass');
            mainHeader.classList.remove('py-4');
            mainHeader.classList.add('py-2.5');
        } else {
            mainHeader.classList.remove('header-glass');
            mainHeader.classList.add('py-4');
            mainHeader.classList.remove('py-2.5');
        }
    });

    // ==========================================
    // 6. MAGNETIC HOVER EFFECT (PREMIUM SENSATION)
    // ==========================================
    const magneticElements = document.querySelectorAll('.btn-premium, .btn-arrow-left, .btn-arrow-right');
    
    if (window.innerWidth > 1024) { // Only enable on desktop
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move button towards cursor (subtle magnetic pull)
                gsap.to(el, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Move inner elements slightly (optional, can do same for SVG inside if exists)
                const innerIcon = el.querySelector('svg');
                if (innerIcon) {
                    gsap.to(innerIcon, {
                        x: x * 0.15,
                        y: y * 0.15,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            el.addEventListener('mouseleave', () => {
                // Snap button back to original position
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });

                const innerIcon = el.querySelector('svg');
                if (innerIcon) {
                    gsap.to(innerIcon, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.3)'
                    });
                }
            });
        });
    }

    // ==========================================
    // 7. CATEGORIES SECTION INTERACTIVES & GSAP
    // ==========================================
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to the clicked card
            card.classList.add('active');
        });
    });

    // GSAP ScrollTrigger Reveal Animations for Categories
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Setup initial states
        gsap.set('#bg-text-design', { opacity: 0, scale: 0.9 });
        gsap.set('#cat-title .text-line-content', { y: '100%' });
        gsap.set('#cat-subtitle', { opacity: 0, y: 20 });
        gsap.set('.category-card', { opacity: 0, y: 45 });

        const categoriesTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#categories-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        categoriesTimeline
            // Background huge text expansion
            .to('#bg-text-design', { opacity: 0.015, scale: 1, duration: 1.5, ease: 'power2.out' })
            // Main title reveal
            .to('#cat-title .text-line-content', { y: '0%', duration: 1.0, ease: 'power4.out' }, '-=1.2')
            // Subtitle slide up
            .to('#cat-subtitle', { opacity: 0.5, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
            // Cards grid stagger slide in
            .to('.category-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out' }, '-=0.6');
    }

    // ==========================================
    // 8. TAKE A LOOK SECTION — GSAP ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        // Set initial states
        gsap.set('#bg-text-look', { opacity: 0, x: -40 });
        gsap.set('#look-title .text-line-content', { y: '110%' });
        gsap.set('#look-desc', { opacity: 0, y: 25 });
        gsap.set('.look-card[data-side="left"]', { opacity: 0, x: -60 });
        gsap.set('.look-card[data-side="right"]', { opacity: 0, x: 60 });

        const lookTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#look-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        });

        lookTimeline
            // Large background watermark text slides in
            .to('#bg-text-look', {
                opacity: 1,
                x: 0,
                duration: 1.4,
                ease: 'power3.out'
            })
            // Title lines unmask one after another
            .to('#look-title .text-line-content', {
                y: '0%',
                duration: 1.0,
                stagger: 0.18,
                ease: 'power4.out'
            }, '-=1.1')
            // Description paragraph fades up
            .to('#look-desc', {
                opacity: 0.5,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.7')
            // Left card slides in from left
            .to('.look-card[data-side="left"]', {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: 'power4.out'
            }, '-=0.5')
            // Right card slides in from right (slight delay)
            .to('.look-card[data-side="right"]', {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: 'power4.out'
            }, '-=0.9');
    }

    // ==========================================
    // 9. CRAFTED SECTION — GSAP ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        // Initial states
        gsap.set('#crafted-ghost-title', { opacity: 0, y: -15 });
        gsap.set('#crafted-title .text-line-content', { y: '110%' });
        gsap.set('#crafted-desc', { opacity: 0, y: 28 });
        gsap.set('.crafted-card[data-crafted="left"]', { opacity: 0, x: -70 });
        gsap.set('.crafted-card[data-crafted="right"]', { opacity: 0, x: 70 });

        const craftedTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#crafted-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        craftedTimeline
            // Ghost watermark title drifts into place
            .to('#crafted-ghost-title', {
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: 'power3.out'
            })
            // Main bold title unmasked from clip
            .to('#crafted-title .text-line-content', {
                y: '0%',
                duration: 1.1,
                ease: 'power4.out'
            }, '-=1.2')
            // Description fades and rises
            .to('#crafted-desc', {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out'
            }, '-=0.8')
            // Left card sweeps in
            .to('.crafted-card[data-crafted="left"]', {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: 'power4.out'
            }, '-=0.55')
            // Right card sweeps in with slight overlap
            .to('.crafted-card[data-crafted="right"]', {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: 'power4.out'
            }, '-=0.9');
    }

    // ==========================================
    // 10. STATS SECTION — COUNTER ANIMATION
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Hide items initially
        gsap.set('.stat-item', { opacity: 0, y: 40 });

        const statsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#stats-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        statsTimeline.to('.stat-item', {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power3.out',
            onStart: () => {
                // Animate numbers counting up from 0 to target
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            stat.textContent = Math.floor(obj.val);
                        },
                        onComplete: () => {
                            stat.textContent = target; // force precise target value at completion
                        }
                    });
                });
            }
        });
    }

    // ==========================================
    // 11. PREMIUM SLIDER LOGIC
    // ==========================================
    const sliderContainer = document.getElementById('premium-slider');
    if (sliderContainer) {
        const slides = Array.from(sliderContainer.querySelectorAll('.slide'));
        const dots = Array.from(sliderContainer.querySelectorAll('.s6-dot'));
        const prevBtn = document.getElementById('s6-prev');
        const nextBtn = document.getElementById('s6-next');

        let currentSlideIndex = 0;
        let slideInterval = null;
        const autoPlayDelay = 6000;

        // --- Initial state: set all slides hidden except first ---
        slides.forEach((slide, i) => {
            slide.style.opacity = i === 0 ? '1' : '0';
            slide.style.zIndex = i === 0 ? '1' : '0';
            slide.style.pointerEvents = i === 0 ? 'auto' : 'none';
        });

        function goToSlide(newIndex) {
            if (newIndex === currentSlideIndex) return;

            const outgoing = slides[currentSlideIndex];
            const incoming = slides[newIndex];

            // Update dots
            dots[currentSlideIndex].style.width = '8px';
            dots[currentSlideIndex].style.height = '8px';
            dots[currentSlideIndex].style.opacity = '0.4';
            dots[newIndex].style.width = '10px';
            dots[newIndex].style.height = '10px';
            dots[newIndex].style.opacity = '1';

            // Bring incoming slide on top, fade it in
            incoming.style.zIndex = '2';
            incoming.style.pointerEvents = 'auto';
            incoming.style.transition = 'opacity 1s ease';
            incoming.style.opacity = '1';

            // Fade out old slide after transition
            setTimeout(() => {
                outgoing.style.zIndex = '0';
                outgoing.style.opacity = '0';
                outgoing.style.pointerEvents = 'none';
                incoming.style.zIndex = '1';
            }, 1000);

            currentSlideIndex = newIndex;
        }

        function showNext() { goToSlide((currentSlideIndex + 1) % slides.length); }
        function showPrev() { goToSlide((currentSlideIndex - 1 + slides.length) % slides.length); }

        function startAutoPlay() {
            stopAutoPlay();
            slideInterval = setInterval(showNext, autoPlayDelay);
        }
        function stopAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { showNext(); startAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { showPrev(); startAutoPlay(); });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
        });

        // GSAP ScrollTrigger — animate only the section wrapper, NOT the slider container
        // This prevents buttons from becoming unclickable due to opacity:0
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.set('#slider-section .max-w-7xl', { opacity: 0, y: 40 });
            gsap.to('#slider-section .max-w-7xl', {
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#slider-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }

        startAutoPlay();
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // ==========================================
    // 12. CTA SECTION (SECTION 7) — ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection) {
            // Subtle Ken Burns zoom on background
            gsap.to('#cta-bg', {
                scale: 1.08,
                duration: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#cta-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Staggered entrance: tag → title → desc → button
            const ctaTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#cta-section',
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });

            ctaTl
                .to('#cta-tag',   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', fromVars: { y: 22 } })
                .fromTo('#cta-tag',   { y: 22 }, { y: 0, duration: 0.8, ease: 'power3.out' }, 0)
                .to('#cta-tag',   { opacity: 1, duration: 0.8, ease: 'power3.out' }, 0)

                .fromTo('#cta-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.2)
                .fromTo('#cta-desc',  { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.45)
                .fromTo('#cta-btn',   { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0.65);
        }
    }

    // ==========================================
    // 13. BEFORE & AFTER COMPARISON SLIDER
    // ==========================================
    const sliderRange = document.getElementById('slider-range');
    const beforeImage = document.getElementById('before-image');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderHandleBtn = document.getElementById('slider-handle-button');

    if (sliderRange && beforeImage && sliderHandle) {
        // Track the user dragging the range slider
        sliderRange.addEventListener('input', (e) => {
            const val = e.target.value;
            // Update clipped path of Before Image
            beforeImage.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            // Move vertical line & button
            sliderHandle.style.left = `${val}%`;
        });

        // Add premium GSAP animations to the handle button on hover/interaction
        if (typeof gsap !== 'undefined') {
            sliderRange.addEventListener('mouseenter', () => {
                gsap.to(sliderHandleBtn, {
                    scale: 1.15,
                    backgroundColor: '#252B20', // customBtn color
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.4)',
                    boxShadow: '0 10px 25px rgba(37, 43, 32, 0.5)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                const svgIcons = sliderHandleBtn.querySelectorAll('svg');
                gsap.to(svgIcons, {
                    color: '#FFFFFF',
                    duration: 0.3
                });
            });

            sliderRange.addEventListener('mouseleave', () => {
                gsap.to(sliderHandleBtn, {
                    scale: 1.0,
                    backgroundColor: '#FFFFFF',
                    color: '#27272a',
                    borderColor: 'rgba(255,255,255,0.8)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                const svgIcons = sliderHandleBtn.querySelectorAll('svg');
                gsap.to(svgIcons, {
                    color: '#27272a',
                    duration: 0.3
                });
            });
        }
    }

    // GSAP ScrollTrigger reveal animations for the Before & After Section
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.set('#bg-text-before-after', { opacity: 0, x: -40 });
        gsap.set('#before-after-title .text-line-content', { y: '110%' });
        gsap.set('#before-after-subtitle', { opacity: 0, y: 25 });
        gsap.set('#before-after-slider-wrapper', { opacity: 0, y: 60, scale: 0.96 });

        const beforeAfterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#before-after-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        beforeAfterTimeline
            // Huge watermark background text slides in
            .to('#bg-text-before-after', {
                opacity: 1,
                x: 0,
                duration: 1.4,
                ease: 'power3.out'
            })
            // Staggered reveal of titles
            .to('#before-after-title .text-line-content', {
                y: '0%',
                duration: 1.1,
                stagger: 0.15,
                ease: 'power4.out'
            }, '-=1.3')
            // Subtitle fades and slides up
            .to('#before-after-subtitle', {
                opacity: 0.5,
                y: 0,
                duration: 0.9,
                ease: 'power3.out'
            }, '-=0.9')
            // Whole slider wrapper reveals smoothly
            .to('#before-after-slider-wrapper', {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.3,
                ease: 'power4.out'
            }, '-=0.7');
    }

    // ==========================================
    // 14. TESTIMONIALS SLIDER
    // ==========================================
    const testiTrack    = document.getElementById('testimonials-track');
    const testiCards    = document.querySelectorAll('.testimonial-card');
    let testiDots       = document.querySelectorAll('.testi-dot');
    const testiDotsContainer = document.getElementById('testimonials-dots');
    const testiPrev     = document.getElementById('testi-prev');
    const testiNext     = document.getElementById('testi-next');
    const testiTotal    = testiCards.length;

    if (testiTrack && testiTotal > 0) {
        let testiCurrent = 0;
        let testiAutoTimer = null;
        
        function getVisibleCount() {
            const w = window.innerWidth;
            if (w >= 1024) return 3;
            if (w >= 768) return 2;
            return 1;
        }

        let visibleCount = getVisibleCount();

        function renderDots() {
            if (!testiDotsContainer) return;
            testiDotsContainer.innerHTML = '';
            const pages = Math.ceil(testiTotal / visibleCount);
            for (let i = 0; i < pages; i++) {
                const btn = document.createElement('button');
                btn.className = 'testi-dot rounded-full bg-white/80';
                btn.setAttribute('data-index', i);
                btn.setAttribute('aria-label', `Slide ${i+1}`);
                btn.addEventListener('click', () => {
                    resetAutoPlay();
                    goToTesti(i * visibleCount);
                });
                testiDotsContainer.appendChild(btn);
            }
            testiDots = document.querySelectorAll('.testi-dot');
        }

        function updateDotsActive() {
            if (!testiDots) return;
            const activePage = Math.floor(testiCurrent / visibleCount);
            testiDots.forEach((dot, i) => dot.classList.toggle('is-active', i === activePage));
        }

        function goToTesti(index) {
            // index is the starting card index for the page
            const maxStart = Math.max(0, testiTotal - visibleCount);
            if (index < 0) index = 0;
            if (index > maxStart) index = maxStart;
            testiCurrent = index;

            // Pixel-perfect shift based on outer width
            const outer = document.getElementById('testimonials-track-outer');
            if (outer) {
                const cardWidth = outer.clientWidth / visibleCount;
                const shiftPx = Math.round(testiCurrent * cardWidth);
                testiTrack.style.transform = `translateX(-${shiftPx}px)`;
            } else {
                const percent = (testiCurrent * 100) / visibleCount;
                testiTrack.style.transform = `translateX(-${percent}%)`;
            }

            updateDotsActive();

            if (typeof gsap !== 'undefined') {
                const activeCard = testiCards[testiCurrent];
                if (activeCard) {
                    gsap.fromTo(activeCard.children,
                        { opacity: 0.6, y: 8 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
                    );
                }
            }
        }

        // Init
        renderDots();
        updateDotsActive();

        // Arrows — move by a page (visibleCount)
        if (testiPrev) {
            testiPrev.addEventListener('click', () => {
                resetAutoPlay();
                const pages = Math.ceil(testiTotal / visibleCount);
                const currentPage = Math.floor(testiCurrent / visibleCount);
                const prevPage = (currentPage - 1 + pages) % pages;
                goToTesti(prevPage * visibleCount);
            });
        }
        if (testiNext) {
            testiNext.addEventListener('click', () => {
                resetAutoPlay();
                const pages = Math.ceil(testiTotal / visibleCount);
                const currentPage = Math.floor(testiCurrent / visibleCount);
                const nextPage = (currentPage + 1) % pages;
                goToTesti(nextPage * visibleCount);
            });
        }

        // Auto-play every 5 seconds (page-based)
        function startAutoPlay() {
            testiAutoTimer = setInterval(() => {
                const pages = Math.ceil(testiTotal / visibleCount);
                const currentPage = Math.floor(testiCurrent / visibleCount);
                const nextPage = (currentPage + 1) % pages;
                goToTesti(nextPage * visibleCount);
            }, 5000);
        }
        function resetAutoPlay() {
            clearInterval(testiAutoTimer);
            startAutoPlay();
        }
        startAutoPlay();

        // Pause auto-play on hover
        const testiSection = document.getElementById('testimonials-section');
        if (testiSection) {
            testiSection.addEventListener('mouseenter', () => clearInterval(testiAutoTimer));
            testiSection.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch swipe support
        let touchStartX = 0;
        testiTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        testiTrack.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                resetAutoPlay();
                goToTesti(diff > 0 ? testiCurrent + visibleCount : testiCurrent - visibleCount);
            }
        }, { passive: true });

        // Update on resize — re-render dots and clamp current index
        window.addEventListener('resize', () => {
            const oldVisible = visibleCount;
            visibleCount = getVisibleCount();
            if (oldVisible !== visibleCount) {
                const maxStart = Math.max(0, testiTotal - visibleCount);
                if (testiCurrent > maxStart) testiCurrent = maxStart;
                renderDots();
                goToTesti(testiCurrent);
            }
        });
    }

    // GSAP ScrollTrigger — Testimonials section reveal
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Set initial hidden states
        gsap.set('#bg-text-testimonials', { opacity: 0, x: -60 });
        gsap.set('#testimonials-label',   { opacity: 0, x: -20 });
        gsap.set('#testimonials-title',   { opacity: 0, y: 35 });
        gsap.set('#testimonials-sub',     { opacity: 0, y: 20 });
        gsap.set('#testimonials-img-panel', { opacity: 0, x: -40 });
        gsap.set('#testimonials-slider-area', { opacity: 0, x: 40 });
        gsap.set('#testimonials-nav',     { opacity: 0, y: 20 });

        const testiTL = gsap.timeline({
            scrollTrigger: {
                trigger: '#testimonials-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        });

        testiTL
            .to('#bg-text-testimonials', { opacity: 1, x: 0, duration: 1.6, ease: 'power3.out' })
            .to('#testimonials-label',   { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=1.4')
            .to('#testimonials-title',   { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }, '-=0.6')
            .to('#testimonials-sub',     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
            .to('#testimonials-img-panel',    { opacity: 1, x: 0, duration: 1.0, ease: 'power4.out' }, '-=0.7')
            .to('#testimonials-slider-area',  { opacity: 1, x: 0, duration: 1.0, ease: 'power4.out' }, '-=0.9')
            .to('#testimonials-nav',     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6');
    }

    // ==========================================
    // 15. INSPIRED INTERIOR LIVING SLIDER
    // ==========================================
    (function () {
        const track     = document.getElementById('inspired-track');
        const outer     = document.getElementById('inspired-slider-outer');
        const prevBtn   = document.getElementById('inspired-prev');
        const nextBtn   = document.getElementById('inspired-next');
        const cards     = document.querySelectorAll('.inspired-card');

        if (!track || !cards.length) return;

        let GAP            = window.innerWidth < 768 ? 16 : 20;
        const CARD_COUNT   = cards.length;
        let cardWidth      = cards[0].offsetWidth;
        let currentOffset  = 0;
        let autoTimer      = null;
        let isPaused       = false;
        const AUTO_DELAY   = 3500;   // ms between auto-steps
        const STEP         = 1;      // number of cards to move each step

        // How many cards are visible
        function getVisibleCount() {
            const w = window.innerWidth;
            if (w < 768) return 1; // mobile
            if (w < 1024) return 2; // tablet
            return 3; // desktop
        }

        // Dynamically resize cards so exactly `visible` cards fit in the container
        function resizeCards() {
            const w = window.innerWidth;
            const visibleCount = getVisibleCount();
            GAP = w < 768 ? 16 : 20;
            const containerWidth = outer.offsetWidth;
            cardWidth = (containerWidth - (GAP * (visibleCount - 1))) / visibleCount;
            
            cards.forEach(card => {
                card.style.width = `${cardWidth}px`;
            });
        }

        function getMaxOffset() {
            const total = CARD_COUNT * (cardWidth + GAP) - GAP;
            const visible = outer.offsetWidth;
            return Math.max(0, total - visible);
        }

        function updateDots() {
            const activeDotIndex = Math.min(
                Math.round(currentOffset / (cardWidth + GAP)),
                document.querySelectorAll('.inspired-dot').length - 1
            );
            document.querySelectorAll('.inspired-dot').forEach((dot, i) => {
                if (i === activeDotIndex) {
                    dot.classList.add('active');
                    dot.classList.remove('bg-white/30');
                    dot.classList.add('bg-white/80');
                } else {
                    dot.classList.remove('active');
                    dot.classList.remove('bg-white/80');
                    dot.classList.add('bg-white/30');
                }
            });
        }

        function buildDots() {
            const dotsContainer = document.getElementById('inspired-dots');
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const visible = getVisibleCount();
            const totalDots = Math.max(1, CARD_COUNT - visible + 1);

            for (let i = 0; i < totalDots; i++) {
                const btn = document.createElement('button');
                btn.className = `inspired-dot w-2 h-2 rounded-full transition-all duration-300 bg-white/30 cursor-pointer`;
                btn.setAttribute('data-index', i);
                btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) {
                    btn.classList.add('active');
                    btn.classList.remove('bg-white/30');
                    btn.classList.add('bg-white/80');
                }

                btn.addEventListener('click', () => {
                    slideTo(i * (cardWidth + GAP));
                    startAuto();
                });
                dotsContainer.appendChild(btn);
            }
        }

        function slideTo(offset) {
            const max = getMaxOffset();
            currentOffset = Math.max(0, Math.min(offset, max));
            track.style.transform = `translateX(-${currentOffset}px)`;
            updateDots();
        }

        function slideNext() {
            const step = (cardWidth + GAP) * STEP;
            const max  = getMaxOffset();
            if (currentOffset >= max - 1) {
                // Loop back to start with smooth wrap
                slideTo(0);
            } else {
                slideTo(currentOffset + step);
            }
        }

        function slidePrev() {
            const step = (cardWidth + GAP) * STEP;
            if (currentOffset <= 0) {
                // Jump to end
                slideTo(getMaxOffset());
            } else {
                slideTo(currentOffset - step);
            }
        }

        function startAuto() {
            stopAuto();
            if (!isPaused) {
                autoTimer = setInterval(slideNext, AUTO_DELAY);
            }
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        // Prev/Next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                slidePrev();
                startAuto();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                slideNext();
                startAuto();
            });
        }

        // Pause on hover (entire section)
        if (outer) {
            outer.addEventListener('mouseenter', () => {
                isPaused = true;
                stopAuto();
            });
            outer.addEventListener('mouseleave', () => {
                isPaused = false;
                startAuto();
            });
        }

        // Touch swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? slideNext() : slidePrev();
                startAuto();
            }
        }, { passive: true });

        // Recalculate on resize
        window.addEventListener('resize', () => {
            resizeCards();
            buildDots();
            slideTo(0);
            startAuto();
        });

        // Init
        // Run after brief timeout to ensure offsets are loaded
        setTimeout(() => {
            resizeCards();
            buildDots();
            slideTo(0);
            startAuto();
        }, 150);

        // GSAP scroll reveal for the section
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.set('#inspired-title .text-line-content', { y: '110%' });
            gsap.set('#inspired-desc', { opacity: 0, y: 20 });
            gsap.set('#inspired-nav', { opacity: 0, x: 30 });
            gsap.set('.inspired-card', { opacity: 0, y: 40 });
            gsap.set('#inspired-bottom-row', { opacity: 0, y: 15 });

            const inspiredTL = gsap.timeline({
                scrollTrigger: {
                    trigger: '#inspired-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            inspiredTL
                .to('#inspired-title .text-line-content', {
                    y: '0%',
                    duration: 1.0,
                    stagger: 0.15,
                    ease: 'power4.out'
                })
                .to('#inspired-desc', {
                    opacity: 0.5,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.7')
                .to('#inspired-nav', {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.7')
                .to('.inspired-card', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out'
                }, '-=0.5')
                .to('#inspired-bottom-row', {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                }, '-=0.4');
        }
    })();

    // ==========================================
    // 16. FOOTER ANIMATION (GSAP)
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#main-footer',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Animate the logo block dropping in with an elegant transition
        footerTl.to('#footer-logo-block', {
            opacity: 1,
            y: 0,
            xPercent: -50,
            duration: 1.0,
            ease: 'power3.out'
        });

        // Animate the three columns staggered sliding up
        footerTl.to('.footer-col', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.6');

        // Animate the bottom bar fading up
        footerTl.to('#footer-bottom', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');
    }

    // ==========================================
    // 17. LUXURY MEETS CRAFT SECTION — ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const luxuryTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#luxury-meets-craft',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Set initial states for clean reveal
        gsap.set('.luxury-reveal', { y: '110%' });
        gsap.set('.luxury-fade', { opacity: 0, y: 35 });

        luxuryTl
            // Background subtle zoom
            .to('#luxury-bg', { 
                scale: 1.15, 
                duration: 15, 
                ease: 'none', 
                scrollTrigger: { 
                    trigger: '#luxury-meets-craft', 
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true 
                } 
            })
            // Title reveal lines
            .to('.luxury-reveal', { 
                y: 0, 
                duration: 1.2, 
                stagger: 0.18, 
                ease: 'power4.out' 
            }, 0)
            // Quote block fade up
            .to('.luxury-fade', { 
                opacity: 1, 
                y: 0, 
                duration: 1.0, 
                ease: 'power3.out' 
            }, '-=0.7');
    }

});
