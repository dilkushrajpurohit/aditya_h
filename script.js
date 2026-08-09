document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar solid on scroll ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('solid');
    else navbar.classList.remove('solid');
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile nav drawer ---------- */
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const mobilePanel = document.getElementById('mobilePanel');
  const openDrawer = () => { mobilePanel.classList.add('open'); document.body.classList.add('nav-open'); };
  const closeDrawer = () => { mobilePanel.classList.remove('open'); document.body.classList.remove('nav-open'); };
  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', openDrawer);
    navClose.addEventListener('click', closeDrawer);
    mobilePanel.addEventListener('click', (e) => { if (e.target === mobilePanel) closeDrawer(); });
    mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal], .tl-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countIO.observe(el));

  /* ---------- Export bars reveal ---------- */
  document.querySelectorAll('.export-bar-row').forEach(el => io.observe(el));

  /* ---------- Hero dots rotate ---------- */
  const dots = document.querySelectorAll('.hero-dots span');
  if (dots.length) {
    let di = 0;
    setInterval(() => {
      dots[di].classList.remove('active');
      di = (di + 1) % dots.length;
      dots[di].classList.add('active');
    }, 2600);
  }

  /* ---------- Cursor glow (desktop only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.querySelector('.cursor-glow');
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      document.body.classList.add('cursor-active');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    });
  }

  /* ---------- Hero parallax on mouse move ---------- */
  const heroVisual = document.querySelector('.hero-visual');
  const heroOrbs = document.querySelectorAll('.hero-orb');
  const hero = document.querySelector('.hero');
  if (hero && heroVisual) {
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5);
      const y = (e.clientY / innerHeight - 0.5);
      heroVisual.style.transform = `translate(${x * -14}px, ${y * -14}px)`;
      heroOrbs.forEach((orb, i) => {
        const factor = i % 2 === 0 ? 20 : -26;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------- Contact form email submission ---------- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const company = form.querySelector('#company').value.trim();
      const country = form.querySelector('#country').value.trim();
      const email = form.querySelector('#email').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const message = form.querySelector('#message').value.trim();

      const subject = encodeURIComponent('New inquiry from Aditya Handicrafts website');
      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company || 'N/A'}\n` +
        `Country: ${country || 'N/A'}\n` +
        `Phone: ${phone || 'N/A'}\n\n` +
        `Message:\n${message || 'No message provided.'}`
      );

      window.location.href = `mailto:info@adityahandicrafts.com?subject=${subject}&body=${body}`;

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Opening Mail...';
      btn.style.background = 'var(--forest)';
      setTimeout(() => { btn.textContent = original; form.reset(); }, 1800);
    });
  }

  /* ---------- Fair gallery — show more / show less ---------- */
  const fairGallery = document.getElementById('fairGallery');
  const fairMoreBtn = document.getElementById('fairMoreBtn');
  if (fairGallery && fairMoreBtn) {
    fairMoreBtn.addEventListener('click', () => {
      const expanded = fairGallery.classList.toggle('expanded');
      fairMoreBtn.classList.toggle('is-open', expanded);
      fairMoreBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      fairMoreBtn.querySelector('.fair-more-label').textContent = expanded ? 'Show Less' : 'Show More';
      if (!expanded) {
        fairGallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- Smooth in-page navigation ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const navbarEl = document.querySelector('.navbar');
      const offset = navbarEl ? navbarEl.offsetHeight + 12 : 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      history.pushState(null, '', hash);
    });
  });

  /* ---------- Current year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
