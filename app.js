/* ============================================================
   إشارات الجسد | Bio-OS — app.js
   Search, filter, mobile menu, TOC collapse
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Library: search + filter ---- */
  const search  = document.getElementById('searchBox');
  const items   = [...document.querySelectorAll('.library-item')];
  const buttons = [...document.querySelectorAll('.filter-btn')];
  let current   = 'all';

  function applyFilter() {
    const q = (search?.value || '').trim().toLowerCase();
    items.forEach(item => {
      const hay = [
        item.dataset.title    || '',
        item.dataset.category || '',
        item.dataset.tags     || '',
        item.textContent
      ].join(' ').toLowerCase();
      const okText = !q || hay.includes(q);
      const okCat  = current === 'all' || item.dataset.category === current;
      item.style.display = (okText && okCat) ? '' : 'none';
    });
  }

  if (search) {
    search.addEventListener('input', applyFilter);
  }

  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current = btn.dataset.filter;
    applyFilter();
  }));

  /* ---- Mobile menu: close when clicking outside ---- */
  document.addEventListener('click', e => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (!header.contains(e.target)) {
      document.body.classList.remove('menu-open');
    }
  });

  /* ---- Active nav link ---- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Mobile TOC: wrap with <details> if small screen ---- */
  const toc = document.querySelector('.toc');
  if (toc && window.innerWidth < 960) {
    const h = toc.querySelector('h2');
    const links = [...toc.querySelectorAll('a')];
    if (h && links.length > 0) {
      const details  = document.createElement('details');
      const summary  = document.createElement('summary');
      summary.textContent = h.textContent;
      details.appendChild(summary);
      links.forEach(a => details.appendChild(a.cloneNode(true)));
      toc.innerHTML = '';
      toc.appendChild(details);
    }
  }

  /* ---- Smooth scroll offset for sticky header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

});
