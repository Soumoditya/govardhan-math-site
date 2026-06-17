// ═══ GOVARDHAN MATH — Premium JS v3 ═══
document.addEventListener("DOMContentLoaded", () => {

    // ── Theme Toggle ──
    const savedTheme = localStorage.getItem('gm-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('gm-theme', next);
        updateThemeIcon(next);
    };

    function updateThemeIcon(theme) {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        });
    }

    // ── Mobile Menu ──
    window.toggleMenu = function() {
        document.getElementById('navLinks').classList.toggle('open');
        document.getElementById('hamburger').classList.toggle('open');
    };
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('open');
            document.getElementById('hamburger').classList.remove('open');
        });
    });

    // ── Nav Scroll Effect ──
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── Hero Particles ──
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 6) + 's';
            p.style.width = p.style.height = (1 + Math.random() * 2.5) + 'px';
            particleContainer.appendChild(p);
        }
    }

    // ── GSAP Animations (only if GSAP loaded) ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Mark body so CSS can hide elements for animation
        document.body.classList.add('gsap-ready');

        // Hero entrance
        const heroReveals = document.querySelectorAll('.hero .reveal');
        if (heroReveals.length) {
            gsap.to(heroReveals, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 0.3 });
        }

        // Scroll reveals
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            if (el.closest('.hero')) return;
            gsap.to(el, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
            });
        });

        // Staggered cards
        document.querySelectorAll('.grid-3, .grid-4, .grid-2').forEach(grid => {
            const cards = grid.querySelectorAll('.card, .stat-item, .ashram-card, .bank-card, .gallery-item');
            if (cards.length) {
                gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08,
                    scrollTrigger: { trigger: grid, start: 'top 88%', toggleActions: 'play none none none' }
                });
            }
        });

        // Parallax hero
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            gsap.to(heroBg, { yPercent: 20, ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
            });
        }

        // Counter animation
        document.querySelectorAll('.stat-number').forEach(el => {
            const text = el.textContent.trim();
            const num = parseInt(text);
            if (!isNaN(num) && num > 0 && num < 10000) {
                el.textContent = '0';
                ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true,
                    onEnter: () => {
                        gsap.to({ val: 0 }, { val: num, duration: 2, ease: 'power2.out',
                            onUpdate: function() { el.textContent = Math.floor(this.targets()[0].val); }
                        });
                    }
                });
            }
        });
    }
    // If GSAP fails to load, elements remain visible (no gsap-ready class added)

    // ── Image Tilt on Hover (desktop only) ──
    if (window.matchMedia('(min-width: 769px)').matches) {
        document.querySelectorAll('.img-frame').forEach(frame => {
            frame.addEventListener('mousemove', (e) => {
                const rect = frame.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                frame.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
            });
            frame.addEventListener('mouseleave', () => { frame.style.transform = 'none'; frame.style.transition = 'transform 0.5s ease'; });
            frame.addEventListener('mouseenter', () => { frame.style.transition = 'none'; });
        });
    }

    // ── Audio Autoplay on Homepage ──
    const autoAudio = document.getElementById('autoAudio');
    if (autoAudio) {
        // Try autoplay immediately
        autoAudio.volume = 0.5;
        const playPromise = autoAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Browser blocked autoplay, play on first user interaction
                const resumeAudio = () => {
                    autoAudio.play().catch(() => {});
                    document.removeEventListener('click', resumeAudio);
                    document.removeEventListener('scroll', resumeAudio);
                    document.removeEventListener('touchstart', resumeAudio);
                };
                document.addEventListener('click', resumeAudio, { once: true });
                document.addEventListener('scroll', resumeAudio, { once: true });
                document.addEventListener('touchstart', resumeAudio, { once: true });
            });
        }
    }

    // ── Book Carousel Scroll (for nav buttons) ──
    window.scrollBooks = function(dir) {
        const carousel = document.getElementById('bookCarousel');
        if (carousel) {
            carousel.classList.add('dragging');
            carousel.scrollBy({ left: dir * 240, behavior: 'smooth' });
            setTimeout(() => carousel.classList.remove('dragging'), 600);
        }
    };

    // ── Social Feeds Scroll ──
    window.scrollFeeds = function(dir) {
        const feed = document.getElementById('socialFeedScroll');
        if (feed) feed.scrollBy({ left: dir * 360, behavior: 'smooth' });
    };

    // ── Infinite Book Scroll (clone items for seamless loop + drag/touch) ──
    document.querySelectorAll('.infinite-scroll').forEach(carousel => {
        const items = Array.from(carousel.querySelectorAll('.catalog-book-item'));
        if (!items.length) return;

        // Clone items 3 times for seamless infinite loop
        for (let i = 0; i < 3; i++) {
            items.forEach(item => {
                carousel.appendChild(item.cloneNode(true));
            });
        }

        // ── Mouse Drag Support ──
        let isDragging = false, startX, scrollLeft;
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            carousel.classList.add('dragging');
            startX = e.pageX;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const walk = (e.pageX - startX) * 1.5;
            carousel.scrollLeft = scrollLeft - walk;
        });
        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => carousel.classList.remove('dragging'), 100);
            }
        };
        carousel.addEventListener('mouseup', stopDrag);
        carousel.addEventListener('mouseleave', stopDrag);

        // ── Touch Swipe Support ──
        carousel.addEventListener('touchstart', (e) => {
            carousel.classList.add('dragging');
            startX = e.touches[0].pageX;
            scrollLeft = carousel.scrollLeft;
        }, { passive: true });
        carousel.addEventListener('touchmove', (e) => {
            const walk = (e.touches[0].pageX - startX) * 1.5;
            carousel.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        carousel.addEventListener('touchend', () => {
            setTimeout(() => carousel.classList.remove('dragging'), 300);
        });
    });

    // ── Manual Book Carousel (for carousels without infinite-scroll) ──
    const bookCarousel = document.getElementById('bookCarousel');
    if (bookCarousel && !bookCarousel.classList.contains('infinite-scroll')) {
        let autoScrollDir = 1;
        setInterval(() => {
            const maxScroll = bookCarousel.scrollWidth - bookCarousel.clientWidth;
            if (bookCarousel.scrollLeft >= maxScroll - 10) autoScrollDir = -1;
            if (bookCarousel.scrollLeft <= 10) autoScrollDir = 1;
            bookCarousel.scrollBy({ left: autoScrollDir * 220, behavior: 'smooth' });
        }, 3500);
    }
});
