/* ==========================================================================
   UNLIMIT3D NEXT-GEN ELITE - MOTION DESIGN
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SPLASH SCREEN SEQUENCE
    // ==========================================
    const splashScreen = document.querySelector('.splash-screen');
    const splashBar = document.querySelector('.splash-progress-bar');
    const splashLogo = document.querySelector('.splash-logo');

    const initSequence = gsap.timeline();

    initSequence
        .to(splashLogo, { opacity: 1, duration: 1, ease: "power2.out" })
        .to(splashBar, { width: "100%", duration: 1.5, ease: "expo.inOut" })
        .to(splashScreen, { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.2 })
        .call(initMainAnimations); // Starts the rest of the animations after splash

    // ==========================================
    // 2. SMOOTH SCROLL (LENIS)
    // ==========================================
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
        });

        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    } catch(e) {
        console.error("Lenis Init Error:", e);
    }

    // ==========================================
    // 3. FLOATING NAVBAR EFFECT
    // ==========================================
    const nav = document.querySelector('.floating-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. MAIN ANIMATIONS (Called after Splash)
    // ==========================================
    function initMainAnimations() {
        
        // --- SPLIT TYPE REVEALS ---
        try {
            if (typeof SplitType !== 'undefined') {
                // Hero Title
                const heroTitle = new SplitType('.hero-title', { types: 'lines, words, chars' });
                gsap.from(heroTitle.chars, {
                    y: 100,
                    opacity: 0,
                    stagger: 0.02,
                    duration: 1.5,
                    ease: "power4.out"
                });

                // Other Section Titles
                const sectionTitles = document.querySelectorAll('.reveal-text');
                sectionTitles.forEach(title => {
                    const st = new SplitType(title, { types: 'words, chars' });
                    gsap.from(st.chars, {
                        scrollTrigger: {
                            trigger: title,
                            start: "top 85%",
                        },
                        y: 50,
                        opacity: 0,
                        stagger: 0.02,
                        duration: 1,
                        ease: "power3.out"
                    });
                });
            }
        } catch(e) { console.log(e); }

        // --- HERO ELEMENTS ---
        gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
        gsap.from('.hero .btn-premium', { scale: 0.9, opacity: 0, duration: 1, ease: "back.out(1.7)", delay: 0.8 });
        gsap.to('.scroll-indicator', { opacity: 1, duration: 1, delay: 1.5 });

        // --- HERO BACKGROUND PARALLAX ---
        gsap.to('.hero-bg', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            yPercent: 30,
            ease: "none"
        });

        // --- BENTO GRID STAGGER ---
        const bentoItems = document.querySelectorAll('.bento-item');
        if(bentoItems.length > 0) {
            ScrollTrigger.batch(bentoItems, {
                onEnter: batch => gsap.from(batch, {
                    y: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power3.out"
                }),
                start: "top 85%"
            });
        }

        // --- BENEFITS CARDS ---
        const benefits = document.querySelectorAll('.benefit-card');
        if(benefits.length > 0) {
            ScrollTrigger.batch(benefits, {
                onEnter: batch => gsap.from(batch, {
                    scale: 0.9,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "back.out(1.5)"
                }),
                start: "top 85%"
            });
        }

        // --- PROCESS SCROLL PINNING ---
        const processSection = document.querySelector('#process');
        const steps = document.querySelectorAll('.step-item');
        const imgs = document.querySelectorAll('.process-step-img');

        if (processSection && steps.length > 0) {
            ScrollTrigger.create({
                trigger: '.process-wrapper',
                start: 'top 20%',
                end: '+=200%', // Scroll distance to pin
                pin: true,
                onUpdate: (self) => {
                    // Logic to switch active steps based on scroll progress
                    const progress = self.progress;
                    let activeIndex = 0;
                    
                    if(progress > 0.33 && progress <= 0.66) activeIndex = 1;
                    else if (progress > 0.66) activeIndex = 2;

                    steps.forEach((step, i) => {
                        if(i === activeIndex) step.classList.add('active');
                        else step.classList.remove('active');
                    });

                    imgs.forEach((img, i) => {
                        if(i === activeIndex) img.classList.add('active');
                        else img.classList.remove('active');
                    });
                }
            });
        }
    }

    // ==========================================
    // 5. FAQ ACCORDION LOGIC
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if(other !== item) other.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // 6. MAGNETIC BUTTON EFFECT
    // ==========================================
    const magneticBtns = document.querySelectorAll('.btn-premium');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
});
