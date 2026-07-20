document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const updateNav = () => {
      navbar.classList.toggle('solid', window.scrollY > 60);
      navbar.classList.toggle('transparent', window.scrollY <= 60);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // ── MOBILE MENU ──
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (toggle && links) {
    const closeMenu = () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      links.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    if (overlay) overlay.addEventListener('click', closeMenu);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ── HERO VIDEO PAUSE/PLAY ──
  const heroVideo = document.querySelector('.hero-video');
  const videoPauseBtn = document.getElementById('videoPauseBtn');
  if (heroVideo && videoPauseBtn) {
    videoPauseBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoPauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      } else {
        heroVideo.pause();
        videoPauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>';
      }
    });
  }

  // ── CARTES D'ARTICLES + ÉDITORIAL DG : AGRANDISSEMENT AU CLIC SUR "LIRE LA SUITE" (accordéon) ──
  const articleDetails = document.querySelectorAll('.actu-grid .actu-card details, .editorial-card details');
  articleDetails.forEach(details => {
    details.addEventListener('toggle', () => {
      const card = details.closest('.actu-card') || details.closest('.editorial-card');
      if (card) card.classList.toggle('is-expanded', details.open);
      if (details.open) {
        articleDetails.forEach(other => {
          if (other !== details && other.open) other.open = false;
        });
      }
    });
  });

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;
          }, 25);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

});

// ── RESPONSIVE IMAGES ──
function applyResponsiveImages() {
  var skipFiles = ['logo.jpg','anac_logo.jpeg','iata_logo.webp','presidence_logo.webp','logo_fdfp.jpeg','logo_fdfp_2.jpeg'];
  var w = window.innerWidth;
  var folder = w <= 480 ? 'small/' : w <= 1024 ? 'medium/' : '';

  if (folder) {
    document.querySelectorAll('.page-header-bg, .parallax-bg').forEach(function(el) {
      var bg = el.style.backgroundImage;
      if (bg.indexOf('/' + folder) !== -1) return;
      var m = bg.match(/url\(['"]?(.*?assets\/images\/)([^'"/)]+)['"]?\)/);
      if (m && skipFiles.indexOf(m[2]) === -1) {
        el.style.backgroundImage = bg.replace(m[1] + m[2], m[1] + folder + m[2]);
      }
    });
  }

  document.querySelectorAll('img[src*="assets/images/"]:not([srcset])').forEach(function(img) {
    var src = img.getAttribute('src');
    var m = src.match(/(.*?assets\/images\/)([^/]+)$/);
    if (!m || skipFiles.indexOf(m[2]) !== -1) return;
    var base = m[1], file = m[2];
    img.setAttribute('srcset', base + 'small/' + file + ' 400w, ' + base + 'medium/' + file + ' 800w, ' + base + file + ' 1600w');
    img.setAttribute('sizes', '(max-width: 480px) 400px, (max-width: 1024px) 800px, 1600px');
  });
}
if (document.readyState === 'complete') { applyResponsiveImages(); }
else { window.addEventListener('load', applyResponsiveImages); }
