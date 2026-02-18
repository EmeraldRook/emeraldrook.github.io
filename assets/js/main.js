document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024;

  // ── 1. Lenis smooth scroll ──
  let lenis;
  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // Connect Lenis to GSAP ticker
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ── 2. Register GSAP plugins ──
  gsap.registerPlugin(ScrollTrigger);

  // ── Reduced motion: show everything immediately ──
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
      el.classList.add('is-visible');
    });
    // Show nav immediately
    const nav = document.getElementById('assembled-nav');
    if (nav) {
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }
    // Show counters at final value
    document.querySelectorAll('.counter').forEach(el => {
      el.textContent = el.getAttribute('data-target');
    });
    return;
  }

  // ── 3. Hero-to-Nav pin animation ──
  function initHeroToNav() {
    const hero = document.getElementById('hero');
    const nav = document.getElementById('assembled-nav');
    const heroLogo = document.getElementById('hero-logo');
    const heroTitle = document.getElementById('hero-title');
    const heroTagline = document.getElementById('hero-tagline');
    const heroCta = document.getElementById('hero-cta');
    const heroScroll = document.getElementById('hero-scroll-indicator');

    if (!hero || !nav) return;

    if (isMobile) {
      // Mobile: no pin, nav fades in when hero exits viewport
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        onEnter: () => {
          gsap.to(nav, { opacity: 1, duration: 0.3 });
          nav.style.pointerEvents = 'auto';
        },
        onLeaveBack: () => {
          gsap.to(nav, { opacity: 0, duration: 0.3 });
          nav.style.pointerEvents = 'none';
        }
      });
      return;
    }

    // Desktop: pin hero and crossfade to nav
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      }
    });

    // 0–30%: Tagline + chevron fade out
    tl.to([heroTagline, heroScroll], {
      opacity: 0,
      y: -10,
      duration: 0.3,
    }, 0);

    // 20–80%: Hero logo/title/CTA shrink and drift up, fade out
    tl.to(heroLogo, {
      opacity: 0,
      scale: 0.5,
      y: -60,
      duration: 0.6,
    }, 0.2);

    tl.to(heroTitle, {
      opacity: 0,
      scale: 0.7,
      y: -80,
      duration: 0.6,
    }, 0.2);

    tl.to(heroCta, {
      opacity: 0,
      y: -40,
      duration: 0.4,
    }, 0.3);

    // 60–100%: Nav fades in with frosted glass
    tl.fromTo(nav, {
      opacity: 0,
      y: -20,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      onComplete: () => { nav.style.pointerEvents = 'auto'; },
      onReverseComplete: () => { nav.style.pointerEvents = 'none'; },
    }, 0.6);
  }

  // ── 4. Stat badges (desktop only) ──
  function initStatBadges() {
    if (isMobile) return;

    const badges = document.querySelectorAll('.stat-badge-item');
    const statsSection = document.getElementById('stats-founders');
    if (!badges.length || !statsSection) return;

    // Stagger-fade in after 1.5s delay
    gsap.to(badges, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.5,
    });

    // Set initial offset
    gsap.set(badges, { y: 20 });

    // Morph/dissolve as stats-founders section approaches
    ScrollTrigger.create({
      trigger: statsSection,
      start: 'top 90%',
      end: 'top 30%',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        badges.forEach((badge, i) => {
          // Spread outward, scale up, fade out
          const spreadX = (i % 2 === 0 ? -1 : 1) * progress * 100;
          const spreadY = (i < 2 ? -1 : 1) * progress * 60;
          gsap.set(badge, {
            opacity: 1 - progress,
            x: spreadX,
            y: spreadY,
            scale: 1 + progress * 0.3,
          });
        });
      }
    });
  }

  // ── 5. Project scroll-driven switching ──
  function initProjectScroll() {
    const wrapper = document.getElementById('projects-scroll-wrapper');
    const section = document.getElementById('projects');
    const projectList = document.getElementById('project-list');
    const previewArea = document.getElementById('project-preview-area');
    const projectBg = document.getElementById('project-bg');
    const progressDots = document.querySelectorAll('.project-dot');

    if (!wrapper || !section || !projectList || !previewArea) return;

    const items = projectList.querySelectorAll('.project-item');
    const previews = previewArea.querySelectorAll('.project-preview');
    // Only count non-"all work" projects for pin duration
    const numProjects = items.length;
    let activeIndex = 0;

    function switchProject(newIndex) {
      if (newIndex === activeIndex || newIndex < 0 || newIndex >= items.length) return;

      // Deactivate current
      items[activeIndex].classList.remove('is-active');
      previews[activeIndex].classList.remove('opacity-100', 'scale-100');
      previews[activeIndex].classList.add('opacity-0', 'scale-95', 'pointer-events-none');

      // Activate new
      items[newIndex].classList.add('is-active');
      previews[newIndex].classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      previews[newIndex].classList.add('opacity-100', 'scale-100');

      // Update background gradient
      if (projectBg) {
        const from = items[newIndex].getAttribute('data-gradient-from');
        projectBg.style.background = `radial-gradient(ellipse 80% 60% at 70% 50%, ${from} 0%, transparent 70%)`;
      }

      // Update progress dots
      progressDots.forEach((dot, i) => {
        if (i === newIndex) {
          dot.classList.add('bg-emerald', 'scale-125');
          dot.classList.remove('bg-text-muted/30');
        } else {
          dot.classList.remove('bg-emerald', 'scale-125');
          dot.classList.add('bg-text-muted/30');
        }
      });

      activeIndex = newIndex;
    }

    if (isMobile) {
      // Mobile: no pin, stack vertically with scroll reveals
      items.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });
      });
      // Keep hover interaction for mobile tap
      items.forEach((item) => {
        item.addEventListener('click', (e) => {
          const idx = parseInt(item.getAttribute('data-index'), 10);
          switchProject(idx);
          const href = item.getAttribute('href');
          if (href === '#') e.preventDefault();
        });
      });
      return;
    }

    // Desktop: pin + scroll-driven switching
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => '+=' + (numProjects * 100) + '%',
      pin: section,
      scrub: 0.3,
      snap: {
        snapTo: 1 / (numProjects - 1),
        duration: { min: 0.2, max: 0.4 },
        ease: 'power1.inOut',
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const idx = Math.min(
          Math.round(progress * (numProjects - 1)),
          numProjects - 1
        );
        switchProject(idx);
      },
      onEnter: () => {
        // Show progress dots
        const dotsContainer = document.getElementById('project-progress-dots');
        if (dotsContainer) gsap.to(dotsContainer, { opacity: 1, duration: 0.3 });
      },
      onLeave: () => {
        const dotsContainer = document.getElementById('project-progress-dots');
        if (dotsContainer) gsap.to(dotsContainer, { opacity: 0, duration: 0.3 });
      },
      onLeaveBack: () => {
        const dotsContainer = document.getElementById('project-progress-dots');
        if (dotsContainer) gsap.to(dotsContainer, { opacity: 0, duration: 0.3 });
      },
      onEnterBack: () => {
        const dotsContainer = document.getElementById('project-progress-dots');
        if (dotsContainer) gsap.to(dotsContainer, { opacity: 1, duration: 0.3 });
      },
    });

    // Also allow hover interaction as fallback
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        switchProject(idx);
      });
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href === '#') e.preventDefault();
      });
    });
  }

  // ── 6. Stats + Founders animations ──
  function initStatsFounders() {
    const section = document.getElementById('stats-founders');
    if (!section) return;

    // Counter animation
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    // Trigger counters on scroll entry
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        section.querySelectorAll('.counter').forEach(animateCounter);
      }
    });

    // Stats items stagger reveal
    const statItems = section.querySelectorAll('.stat-final');
    gsap.from(statItems, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statItems[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    // Founder cards stagger reveal
    const founderCards = section.querySelectorAll('.founder-card');
    gsap.from(founderCards, {
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: founderCards[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  // ── 7. General .reveal scroll triggers (replaces IntersectionObserver) ──
  function initRevealTriggers() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: el.classList.contains('reveal-left') ? 0 : 24,
        x: el.classList.contains('reveal-left') ? -60 : 0,
        scale: el.classList.contains('reveal-scale') ? 0.95 : 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  // ── Initialize all ──
  initHeroToNav();
  initStatBadges();
  initProjectScroll();
  initStatsFounders();
  initRevealTriggers();

  // ── 8. Resize handler ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});
