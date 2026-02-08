document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll-triggered reveal animations ──
  const revealSelectors = '.reveal, .reveal-left, .reveal-scale';

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll(revealSelectors).forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(revealSelectors).forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // ── Counter animation for stats ──
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);

    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }

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

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsSection);
  }

  // ── Mobile menu toggle ──
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');

      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.toggle('hidden');
        menuIconClose.classList.toggle('hidden');
      }

      menuBtn.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (menuIconOpen && menuIconClose) {
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        }
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Navbar: background on scroll + hide/show on direction ──
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  if (navbar) {
    function updateNavbar() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.85)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(38, 38, 38, 0.5)';
      } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        navbar.style.borderBottom = '1px solid transparent';
      }

      // Hide navbar on scroll down, show on scroll up
      if (scrollY > 300) {
        if (scrollY > lastScrollY + 5) {
          navbar.style.transform = 'translateY(-100%)';
        } else if (scrollY < lastScrollY - 5) {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Smooth scroll with snap for nav links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ── Project showcase hover interaction ──
  const projectList = document.getElementById('project-list');
  const previewArea = document.getElementById('project-preview-area');
  const projectBg = document.getElementById('project-bg');

  if (projectList && previewArea) {
    const items = projectList.querySelectorAll('.project-item');
    const previews = previewArea.querySelectorAll('.project-preview');
    let activeIndex = 0;

    function switchProject(newIndex) {
      if (newIndex === activeIndex) return;

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

      activeIndex = newIndex;
    }

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
});
