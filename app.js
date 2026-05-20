/* ============================================================
   إشارات الجسد | Bio-OS — app.js  v5-combined
   Fixes: mobile menu, nav dropdown, TOC highlight,
          reading progress, back-to-top, aria states,
          active nav (Vercel cleanUrls), accordion, library
   Enhanced: performance, accessibility, smooth interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. MOBILE MENU
  ────────────────────────────────────────────────────────── */
  const toggle  = document.querySelector('.menu-toggle');
  const nav     = document.querySelector('.main-nav');
  const overlay = document.querySelector('.mob-overlay');

  function openMenu() {
    nav?.classList.add('open');
    overlay?.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav?.classList.remove('open');
    overlay?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', e => {
    e.stopPropagation();
    nav?.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth < 960) closeMenu(); });
  });


  /* ──────────────────────────────────────────────────────────
     2. NAV DROPDOWN
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.nav-drop').forEach(drop => {
    const btn  = drop.querySelector('.nav-drop-btn');
    const menu = drop.querySelector('.nav-drop-menu');
    if (!btn || !menu) return;

    const openDrop  = () => { drop.classList.add('open');    btn.setAttribute('aria-expanded', 'true'); };
    const closeDrop = () => { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };

    btn.addEventListener('click', e => { e.stopPropagation(); drop.classList.contains('open') ? closeDrop() : openDrop(); });
    document.addEventListener('click', e => { if (!drop.contains(e.target)) closeDrop(); });
    btn.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrop(); btn.focus(); } });
  });


  /* ──────────────────────────────────────────────────────────
     3. ACTIVE NAV — works with Vercel cleanUrls (no .html)
  ────────────────────────────────────────────────────────── */
  const rawPath  = location.pathname.replace(/\/$/, '') || '/';
  const pageName = rawPath === '/' ? 'index' : rawPath.split('/').pop();

  document.querySelectorAll('.main-nav a, .nav-drop-menu a').forEach(a => {
    const href  = (a.getAttribute('href') || '').replace(/\.html$/, '');
    const hBase = href === '' ? 'index' : href.replace(/^\//, '').replace(/\/$/, '') || 'index';
    if (hBase === pageName) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('active');
    }
  });


  /* ──────────────────────────────────────────────────────────
     4. ACCORDION
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.acc-item').forEach(item => {
    const btn  = item.querySelector('.acc-btn');
    const body = item.querySelector('.acc-body');
    if (!btn || !body) return;
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     5. SMOOTH SCROLL with sticky-header offset
  ────────────────────────────────────────────────────────── */
  const headerH = () => (document.querySelector('.site-header')?.offsetHeight || 80) + 20;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - headerH(), behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────────────────────
     6. TOC ACTIVE SECTION  (IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (tocLinks.length) {
    const sections = tocLinks
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    const setActive = id => {
      tocLinks.forEach(a => a.classList.toggle('toc-active', a.getAttribute('href') === '#' + id));
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: `-${headerH()}px 0px -55% 0px`, threshold: 0 });

    sections.forEach(s => obs.observe(s));
    if (sections[0]) setActive(sections[0].id);
  }


  /* ──────────────────────────────────────────────────────────
     7. MOBILE TOC: <details> wrapper
  ────────────────────────────────────────────────────────── */
  const toc = document.querySelector('.toc');
  if (toc && window.innerWidth < 960) {
    const h     = toc.querySelector('h2');
    const links = [...toc.querySelectorAll('a')];
    if (h && links.length) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = h.textContent;
      details.appendChild(summary);
      const wrap = document.createElement('nav');
      links.forEach(a => wrap.appendChild(a.cloneNode(true)));
      details.appendChild(wrap);
      toc.innerHTML = '';
      toc.appendChild(details);
      toc.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          details.open = false;
          setTimeout(() => window.scrollTo({ top: target.offsetTop - headerH(), behavior: 'smooth' }), 40);
        });
      });
    }
  }


  /* ──────────────────────────────────────────────────────────
     8. READING PROGRESS BAR
  ────────────────────────────────────────────────────────── */
  const article = document.querySelector('.article, .content-single, .prose');
  if (article) {
    const bar = document.createElement('div');
    bar.id = 'read-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'تقدم القراءة');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(bar);

    const updateBar = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 100;
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }


  /* ──────────────────────────────────────────────────────────
     9. BACK TO TOP
  ────────────────────────────────────────────────────────── */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'العودة إلى الأعلى');
  btt.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btt);

  const updateBttVisibility = () => {
    btt.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', updateBttVisibility, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ──────────────────────────────────────────────────────────
     10. LIBRARY: search + filter
  ────────────────────────────────────────────────────────── */
  const searchBox  = document.getElementById('searchBox');
  const libItems   = [...document.querySelectorAll('.library-item')];
  const filterBtns = [...document.querySelectorAll('.filter-btn')];
  const libEmpty   = document.getElementById('lib-empty');
  let currentFilter = 'all';

  function runFilter() {
    const q = (searchBox?.value || '').trim().toLowerCase();
    let visible = 0;
    libItems.forEach(item => {
      const hay    = [item.dataset.title||'', item.dataset.category||'', item.dataset.tags||'', item.textContent].join(' ').toLowerCase();
      const okText = !q || hay.includes(q);
      const okCat  = currentFilter === 'all' || item.dataset.category === currentFilter;
      const show   = okText && okCat;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (libEmpty) libEmpty.style.display = visible === 0 ? 'block' : 'none';
  }

  searchBox?.addEventListener('input', () => {
    requestAnimationFrame(runFilter);
  });
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter || 'all';
    requestAnimationFrame(runFilter);
  }));


  /* ──────────────────────────────────────────────────────────
     11. EXTERNAL LINKS — safe new tab
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    if (a.hostname === location.hostname) return;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    const label = a.getAttribute('aria-label') || a.textContent;
    a.setAttribute('aria-label', label + ' (يفتح في نافذة جديدة)');
  });

});
