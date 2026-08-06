function setupLinkTargets() {
  document.querySelectorAll('a').forEach((link) => {
    link.setAttribute('target', '_blank');

    const rel = link.getAttribute('rel') || '';
    const relTokens = new Set(rel.split(/\s+/).filter(Boolean));
    relTokens.add('noopener');
    relTokens.add('noreferrer');
    link.setAttribute('rel', Array.from(relTokens).join(' '));
  });
}

function setupMobileMenu() {
  const hamburger = document.getElementById('hamburgerIcon');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  const setMenuState = (isOpen) => {
    navLinks.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  };

  const closeMenu = () => setMenuState(false);

  hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navLinks.classList.contains('is-open');
    setMenuState(!isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

function setupActiveNavLink() {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('section[id], div[id], footer[id]'));

  if (!navLinks.length || !sections.length) return;

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 140;
    let activeId = 'home';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeId = section.id || 'home';
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', () => requestAnimationFrame(setActiveLink), { passive: true });
  setActiveLink();
}

function setupRevealOnScroll() {
  const revealItems = Array.from(document.querySelectorAll('.hero, .feature-item, .category-card, .product-card, .promo-card, .insta-item'));

  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${index * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupFooterReveal() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add('is-visible');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(footer);
}

setupLinkTargets();
setupMobileMenu();
setupActiveNavLink();
setupRevealOnScroll();
setupFooterReveal();