/* بيت الفؤاد — الشريط الموحّد (bfs v1).
   ملف واحد متطابق في المستودعات الثلاثة (baytalfuad و masarcare-health و isharataljasad).
   يبني الشريط العلوي الثابت: الشعار، ثم المسار، ثم الصفحة الحالية، ثم تنقّل المسار والبحث والقائمة.
   لا يغيّر المحتوى: يُخفي الترويسة القديمة ويُبقي أزرارها حيّة، فكل زر في الشريط يضغط زرها الأصلي.
   لا innerHTML، ولا تخزين، ولا طلبات شبكة غير ملف الأنماط ومكوّن البحث. */
(() => {
  'use strict';
  if (window.__bfShell) return;
  const me = document.currentScript;
  const BASE = new URL('.', (me && me.src) || new URL('/shell/bf-shell.js', location.href));
  const host = location.hostname;
  const SITE = (me && me.dataset.bfSite) || (/masarcare\.health$/.test(host) ? 'masar' : /isharataljasad\.com$/.test(host) ? 'ishara' : 'bayt');

  let ORIGINS = { bayt: 'https://baytalfuad.com', masar: 'https://www.masarcare.health', ishara: 'https://www.isharataljasad.com' };
  // Local testing only: sessionStorage may point the three origins at localhost servers.
  try {
    const o = JSON.parse(sessionStorage.getItem('bfs-origins') || 'null');
    if (o && typeof o === 'object') for (const k of Object.keys(ORIGINS)) if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o[k] || '')) ORIGINS[k] = o[k];
  } catch { /* storage blocked */ }
  window.__bfShell = { site: SITE, origins: ORIGINS, base: BASE.href };

  const here = ORIGINS[SITE];
  const local = (u) => (u.startsWith(here + '/') ? u.slice(here.length) : u);
  const B = ORIGINS.bayt;

  const SECTIONS = {
    home: { label: '', root: B + '/', accent: '#D97757' },
    sleep: { label: 'ركن النوم', root: B + '/sleep', accent: '#A99BD0' },
    movement: { label: 'الحركة', root: B + '/movement/', accent: '#D99A73' },
    semester: { label: 'الفصل الأول', root: B + '/ilm-sinaa/student/semester-1/', accent: '#D6A452' },
    ilm: { label: 'العلم والعمل', root: B + '/ilm-sinaa/', accent: '#D6A452' },
    masar: { label: 'مسار كير', root: ORIGINS.masar + '/', accent: '#93B98F' },
    ishara: { label: 'القرآن والتدبر', root: ORIGINS.ishara + '/', accent: '#8DB4CE' },
  };
  const SYSTEM = [
    { key: 'home', label: 'الرئيسية', sub: 'بيت الفؤاد', href: B + '/' },
    { key: 'masar', label: 'الغذاء والجسد', sub: 'مسار كير', href: ORIGINS.masar + '/' },
    { key: 'sleep', label: 'النوم', sub: 'ركن النوم', href: B + '/sleep' },
    { key: 'movement', label: 'الحركة', sub: 'قوّتها', href: B + '/movement/' },
    { key: 'semester', label: 'العلم والعمل', sub: 'الفصل الأول', href: B + '/ilm-sinaa/student/semester-1/' },
    { key: 'ishara', label: 'الصلة', sub: 'القرآن والتدبر', href: ORIGINS.ishara + '/' },
  ];

  function sectionKey() {
    if (SITE !== 'bayt') return SITE;
    const p = location.pathname;
    if (/^\/sleep(\/|$)/.test(p)) return 'sleep';
    if (/^\/movement(\/|$)/.test(p)) return 'movement';
    if (/^\/ilm-sinaa\/student\/semester-1(\/|$)/.test(p)) return 'semester';
    if (/^\/ilm-sinaa(\/|$)/.test(p)) return 'ilm';
    return 'home';
  }
  const SKEY = sectionKey();
  const SECTION = SECTIONS[SKEY];
  document.documentElement.setAttribute('data-bfs', SITE);

  /* ---------- helpers ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const h = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'text') n.textContent = v; else if (k === 'class') n.className = v; else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => c != null && n.append(c));
    return n;
  };
  const s = (tag, attrs = {}, ...kids) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    kids.forEach((c) => n.append(c));
    return n;
  };
  const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
  const norm = (t) => clean(t).replace(/[←→↗‹›«»]/g, '').replace(/^(ال)/, '').trim();

  function logo() {
    return s('svg', { viewBox: '0 0 512 512', class: 'bfs-logo', 'aria-hidden': 'true', focusable: 'false' },
      s('g', { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        s('circle', { cx: '256', cy: '268', r: '222', 'stroke-width': '9' }),
        s('path', { d: 'M212 395.82 L163.13 395.82 L105.73 219.18 L256 110 L406.27 219.18 L348.87 395.82 L300 395.82', 'stroke-width': '30' })),
      s('g', { fill: 'currentColor' },
        ...[[256, 46], [467.13, 199.4], [386.49, 447.6], [125.51, 447.6], [44.87, 199.4]].map(([x, y]) => s('circle', { cx: String(x), cy: String(y), r: '27' }))),
      s('circle', { cx: '256', cy: '278', r: '58', class: 'bfs-logo-core' }));
  }
  const icon = (d, extra = {}) => s('svg', { viewBox: '0 0 24 24', class: 'bfs-ico', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, s('path', { d }));
  const ICON_MENU = 'M4 7h16M4 12h16M4 17h16';
  const ICON_THEME = 'M12 3a9 9 0 1 0 0 18V3Z M12 3a9 9 0 0 1 0 18';

  function pathKey(u) {
    try {
      const x = new URL(u, location.href);
      let p = x.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
      if (p.length > 1) p = p.replace(/\/$/, '');
      return x.origin + p;
    } catch { return ''; }
  }
  const hereKey = () => pathKey(location.href);

  /* ---------- legacy header: find, harvest, hide ---------- */
  function findLegacy() {
    const list = [...document.querySelectorAll('body > header, body > div > header, #home-root > header, body > div > div > header')];
    return list.find((x) => !x.closest('main, article, .bfs-bar') && x.querySelector('nav, a[href]')) || null;
  }
  const isBrand = (el) => el.matches('.brand, .bf-brand, .mv-brand, [class*="brand"]');
  function isHomeOrBack(el) {
    if (el.matches('.back, .bf-back, .home-link')) return true;
    if (el.tagName !== 'A') return false;
    const k = pathKey(el.getAttribute('href'));
    return k === pathKey(B + '/') || k === pathKey(here + '/') && SITE === 'bayt' || /^العودة/.test(clean(el.textContent)) || /#pillars$/.test(el.getAttribute('href') || '');
  }
  function isMenuToggle(el, root) {
    if (el.tagName !== 'BUTTON') return false;
    if (el.matches('[data-menu], [data-nav-toggle], .nav-toggle, .mv-menu')) return true;
    const id = el.getAttribute('aria-controls');
    return !!(id && root.querySelector('#' + CSS.escape(id)));
  }
  const isTheme = (el) => el.matches('#theme, .theme-toggle, [data-theme-toggle]');
  function labelOf(el) {
    const c = el.cloneNode(true);
    c.querySelectorAll('small, svg, .sr-only, [aria-hidden="true"], .short').forEach((n) => n.remove());
    return clean(c.textContent) || clean(el.getAttribute('aria-label')) || clean(el.textContent);
  }

  // A proxy remembers how to find its original again, in case the page re-renders it.
  function proxyRef(el, root, rootSel) {
    const idx = [...root.querySelectorAll('a[href], button')].indexOf(el);
    return () => {
      if (el.isConnected) return el;
      const r = document.querySelector(rootSel);
      const again = r && r.querySelectorAll('a[href], button')[idx];
      if (again) el = again;
      return again || null;
    };
  }
  const rootSelector = (r) => (r.id ? '#' + CSS.escape(r.id) : r.tagName.toLowerCase() + (r.classList[0] ? '.' + CSS.escape(r.classList[0]) : ''));

  function harvest(legacy) {
    const nav = [], tools = [];
    const seen = new Set();
    const roots = [];
    if (legacy) roots.push(legacy);
    if (SITE === 'ishara') { const side = document.querySelector('#sideNav nav'); if (side) roots.push(side); }
    // Sections whose own in-page tabs also belong in the menu (not repeated inline in the bar).
    const extra = { sleep: 'nav#tabs' }[SKEY];
    const extraRoot = extra && document.querySelector(extra);
    if (extraRoot) roots.push(extraRoot);
    for (const root of roots) {
      const rootSel = root === legacy ? rootSelector(root) : root === extraRoot ? extra : '#sideNav nav';
      const menuOnly = root === extraRoot;
      for (const el of root.querySelectorAll('a[href], button')) {
        if (el.closest('bayt-global-search') || el.closest('.bfs-bar')) continue;
        if (root === legacy && (isBrand(el) || isHomeOrBack(el) || isMenuToggle(el, root))) continue;
        if (el.hidden || el.getAttribute('aria-hidden') === 'true') continue;
        if (el.id === 'menuBtn') { tools.push({ kind: 'button', label: 'حجم النص وأدوات السجل', get: proxyRef(el, root, rootSel), narrowOnly: true }); continue; }
        if (isTheme(el)) { tools.push({ kind: 'theme', label: clean(el.getAttribute('aria-label')) || labelOf(el) || 'تبديل المظهر', get: proxyRef(el, root, rootSel) }); continue; }
        const label = labelOf(el);
        if (!label) continue;
        if (el.tagName === 'A') {
          const href = el.href;
          const key = pathKey(href) + new URL(href, location.href).hash;
          if (seen.has(key)) continue;
          seen.add(key);
          nav.push({ kind: 'link', label, href: el.getAttribute('href'), abs: href, target: el.getAttribute('target'), rel: el.getAttribute('rel'), src: el, menuOnly });
        } else if (el.closest('nav') || root !== legacy) {
          if (seen.has('b:' + label)) continue;
          seen.add('b:' + label);
          nav.push({ kind: 'button', label, get: proxyRef(el, root, rootSel) });
        } else {
          tools.push({ kind: 'button', label, get: proxyRef(el, root, rootSel) });
        }
      }
    }
    return { nav, tools };
  }

  function isCurrent(item) {
    if (item.kind === 'link') {
      if (item.src && item.src.isConnected && item.src.getAttribute('aria-current')) return true;
      const u = new URL(item.abs, location.href);
      if (pathKey(u.href) !== hereKey()) return false;
      return u.hash ? (u.hash === location.hash || (u.hash === '#/home' && !location.hash)) : !/^#\//.test(location.hash);
    }
    const el = item.get && item.get();
    return !!(el && (el.getAttribute('aria-current') || el.classList.contains('is-active') || el.classList.contains('active')));
  }

  /* ---------- build ---------- */
  let legacy = null, model = { nav: [], tools: [] };
  let bar, inner, crumbPath, crumbPage, navInline, navList, actions, themeBtn, menuBtn, menu, menuNav, menuTools, searchEl;

  function pageLabel() {
    const atSectionRoot = SITE === 'bayt' && SKEY !== 'home' && pathKey(SECTION.root) === hereKey();
    if (atSectionRoot) return '';
    const cur = model.nav.find(isCurrent);
    if (cur && !/^(البيت|الرئيسية|البداية)$/.test(cur.label) && norm(cur.label) !== norm(SECTION.label)) return cur.label;
    const t =clean(document.title.split(/\s+[|·—–]\s+/)[0]);
    if (!t || norm(t) === norm(SECTION.label) || /^(بيت الفؤاد|Bayt Al-Fuad)$/.test(t)) return '';
    return t;
  }

  function build() {
    const pageLang = document.documentElement.lang || 'ar';
    bar = h('header', { class: 'bfs-bar', dir: 'rtl', lang: 'ar', 'data-section': SKEY, hidden: true });
    bar.style.setProperty('--bfs-path', SECTION.accent);
    inner = h('div', { class: 'bfs-in' });
    const brand = h('a', { class: 'bfs-brand', href: local(B + '/'), 'aria-label': 'بيت الفؤاد — الرئيسية' }, logo(), h('span', { class: 'bfs-brand-name', text: 'بيت الفؤاد' }));
    crumbPath = SECTION.label ? h('a', { class: 'bfs-path', href: local(SECTION.root) }, h('span', { class: 'bfs-dot', 'aria-hidden': 'true' }), h('span', { text: SECTION.label })) : null;
    crumbPage = h('span', { class: 'bfs-page', 'aria-current': 'page', lang: pageLang, dir: 'auto' });
    const crumb = h('nav', { class: 'bfs-crumb', 'aria-label': 'موقعك في بيت الفؤاد' },
      h('span', { class: 'bfs-crumb-top' }, h('span', { class: 'bfs-crumb-home', text: 'بيت الفؤاد' }), crumbPath ? h('span', { class: 'bfs-sep', 'aria-hidden': 'true', text: '/' }) : null, crumbPath),
      h('span', { class: 'bfs-sep bfs-sep-page', 'aria-hidden': 'true', text: '/' }),
      crumbPage);
    navList = h('ul', { class: 'bfs-nav-list' });
    navInline = h('nav', { class: 'bfs-nav', 'aria-label': SECTION.label ? 'صفحات ' + SECTION.label : 'أقسام الصفحة' }, navList);
    searchEl = document.createElement('bayt-global-search');
    searchEl.setAttribute('data-variant', 'bar');
    themeBtn = h('button', { class: 'bfs-icon-btn bfs-theme', type: 'button', hidden: true }, icon(ICON_THEME));
    menuBtn = h('button', { class: 'bfs-menu-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'bfs-menu' }, icon(ICON_MENU), h('span', { class: 'bfs-menu-lbl', text: 'القائمة' }));
    actions = h('div', { class: 'bfs-actions' }, themeBtn, searchEl, menuBtn);
    inner.append(brand, crumb, navInline, actions);
    bar.append(inner);

    menuNav = h('ul', { class: 'bfs-m-list' });
    menuTools = h('ul', { class: 'bfs-m-list' });
    const sys = h('ul', { class: 'bfs-m-sys' }, SYSTEM.map((x) => h('li', {}, h('a', { href: local(x.href), class: 'bfs-m-sys-a', 'data-key': x.key, ...(x.key === SKEY || (x.key === 'semester' && SKEY === 'ilm') ? { 'aria-current': 'true' } : {}) },
      h('span', { class: 'bfs-dot', 'aria-hidden': 'true', style: `--bfs-path:${(SECTIONS[x.key] || SECTIONS.home).accent}` }),
      h('span', { class: 'bfs-m-sys-t' }, h('strong', { text: x.label }), h('small', { text: x.sub }))))));
    menu = h('div', { class: 'bfs-menu', id: 'bfs-menu', dir: 'rtl', lang: 'ar', hidden: true },
      h('nav', { 'aria-label': 'قائمة بيت الفؤاد' },
        h('section', { class: 'bfs-m-sec', 'data-part': 'nav' }, h('h2', { class: 'bfs-m-h', text: SECTION.label ? 'في ' + SECTION.label : 'في هذه الصفحة' }), menuNav),
        h('section', { class: 'bfs-m-sec', 'data-part': 'tools' }, h('h2', { class: 'bfs-m-h', text: 'أدوات الصفحة' }), menuTools),
        h('section', { class: 'bfs-m-sec' }, h('h2', { class: 'bfs-m-h', text: 'منظومة بيت الفؤاد' }), sys)));
    menu.style.setProperty('--bfs-path', SECTION.accent);

    const skip = document.body.firstElementChild && document.body.firstElementChild.matches('a[href^="#"]') ? document.body.firstElementChild : null;
    if (skip) skip.after(bar, menu); else document.body.prepend(bar, menu);

    menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu(true)));
    themeBtn.addEventListener('click', () => { const t = model.tools.find((x) => x.kind === 'theme'); const el = t && t.get(); if (el) el.click(); setTimeout(refresh, 30); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(true); } });
    document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(false); });
    menu.addEventListener('click', (e) => { if (e.target.closest('a[href]')) closeMenu(false); });
  }

  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    const first = menu.querySelector('[aria-current], a[href], button');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(focusBack) {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    if (focusBack) menuBtn.focus();
  }

  function renderItem(item, where) {
    const cur = isCurrent(item);
    let node;
    if (item.kind === 'link') {
      node = h('a', { href: item.href, class: 'bfs-item', ...(item.target ? { target: item.target } : {}), ...(item.rel ? { rel: item.rel } : {}), ...(cur ? { 'aria-current': 'page' } : {}) });
    } else {
      const src = item.get && item.get();
      node = h('button', { type: 'button', class: 'bfs-item', ...(cur ? { 'aria-current': 'page' } : {}) });
      for (const a of ['aria-pressed', 'aria-expanded']) if (src && src.hasAttribute(a) && src.id !== 'menuBtn') node.setAttribute(a, src.getAttribute(a));
      node.addEventListener('click', () => {
        const el = item.get && item.get();
        if (where === 'menu') closeMenu(false);
        if (el) el.click();
        setTimeout(refresh, 40);
      });
    }
    node.append(h('span', { dir: 'auto', text: item.label }));
    return h('li', item.narrowOnly ? { class: 'bfs-narrow-only' } : {}, node);
  }

  function refresh() {
    if (!bar) return;
    navList.replaceChildren(...model.nav.filter((x) => !x.menuOnly).map((x) => renderItem(x, 'bar')));
    menuNav.replaceChildren(...model.nav.map((x) => renderItem(x, 'menu')));
    const tools = model.tools.filter((x) => x.kind !== 'theme');
    menuTools.replaceChildren(...tools.map((x) => renderItem(x, 'menu')));
    menuNav.closest('section').hidden = !model.nav.length;
    menuTools.closest('section').hidden = !tools.length;
    const theme = model.tools.find((x) => x.kind === 'theme');
    themeBtn.hidden = !theme;
    if (theme) { const el = theme.get(); const l = clean(el && (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent)) || 'تبديل المظهر'; themeBtn.setAttribute('aria-label', l); themeBtn.title = l; }
    const p = pageLabel();
    crumbPage.textContent = p;
    bar.classList.toggle('bfs-no-page', !p);
    fit();
    if (!bar.hidden) measure();
  }

  // Inline section links only while they fit; the menu always lists all of them.
  function fit() {
    const items = [...navList.children];
    items.forEach((li) => { li.hidden = false; });
    const wide = matchMedia('(min-width: 1000px)').matches;
    navInline.hidden = !wide || !items.length;
    if (navInline.hidden) return;
    const over = () => navList.scrollWidth > navInline.clientWidth + 1;
    // Drop from the end first, keeping the current page's link while anything else can go.
    for (let i = items.length - 1; i >= 0 && over(); i -= 1) if (!items[i].querySelector('[aria-current]')) items[i].hidden = true;
    for (let i = items.length - 1; i >= 0 && over(); i -= 1) items[i].hidden = true;
    if (items.every((li) => li.hidden)) navInline.hidden = true;
  }

  let measured = 0;
  function measure(force) {
    const hgt = Math.round(bar.getBoundingClientRect().height) || 56;
    if (hgt === measured && !force) return;
    measured = hgt;
    document.documentElement.style.setProperty('--bfs-bar-h', hgt + 'px');
    fixSticky(hgt);
  }

  // Sticky elements that sat at the very top now sit under the bar instead of behind it.
  function fixSticky(hgt) {
    for (const el of document.body.querySelectorAll('*')) {
      if (el === bar || el === menu || bar.contains(el) || menu.contains(el) || el.closest('[data-bfs-legacy]')) continue;
      const cs = getComputedStyle(el);
      if (cs.position !== 'sticky') continue;
      const orig = el.dataset.bfsTop != null ? parseFloat(el.dataset.bfsTop) : parseFloat(cs.top);
      if (Number.isNaN(orig) || orig >= hgt) continue;
      el.dataset.bfsTop = String(orig);
      el.style.top = (hgt + orig) + 'px';
    }
  }

  // Footer links that repeat the bar are hidden; references, privacy and contact stay.
  function dedupeFooter() {
    const labels = new Set(), hrefs = new Set();
    const linkKey = (u) => { try { return pathKey(u) + new URL(u, location.href).hash; } catch { return ''; } };
    const add = (label, href) => { if (label) labels.add(norm(label)); if (href) hrefs.add(linkKey(href)); };
    model.nav.forEach((x) => add(x.label, x.kind === 'link' ? x.abs : ''));
    SYSTEM.forEach((x) => { add(x.label, x.href); add(x.sub); });
    add('بيت الفؤاد', B + '/'); add('البيت'); add(SECTION.label, SECTION.root);
    for (const f of document.querySelectorAll('footer')) {
      if (f.closest('main article')) continue;
      for (const el of f.querySelectorAll('a[href], button')) {
        if (el.closest('p') && el.closest('p').textContent.trim() !== el.textContent.trim()) continue;
        const t = labelOf(el);
        const hrefDup = el.tagName === 'A' && hrefs.has(linkKey(el.href)) && !/^mailto:/.test(el.getAttribute('href') || '') && t.length <= 32;
        if (labels.has(norm(t)) || hrefDup) (el.parentElement && el.parentElement.tagName === 'LI' ? el.parentElement : el).setAttribute('data-bfs-dup', '');
      }
      for (const group of f.querySelectorAll('nav, ul')) {
        const kids = [...group.querySelectorAll('a[href], button')];
        if (kids.length && kids.every((k) => k.closest('[data-bfs-dup]'))) group.setAttribute('data-bfs-dup', '');
      }
    }
  }

  function ensureSearch() {
    if (customElements.get('bayt-global-search') || document.querySelector('script[data-bfs-search]')) return;
    const sc = document.createElement('script');
    sc.src = new URL('search/widget.js', BASE).href;
    sc.defer = true;
    sc.setAttribute('data-bfs-search', '');
    document.head.append(sc);
  }

  function start() {
    legacy = findLegacy();
    model = harvest(legacy);
    build();
    ensureSearch();
    const reveal = () => {
      if (!bar.hidden) return;
      bar.hidden = false;
      if (legacy) {
        legacy.setAttribute('data-bfs-legacy', '');
        legacy.querySelectorAll('bayt-global-search').forEach((x) => x.remove());
      }
      document.documentElement.classList.add('bfs-on');
      refresh();
      dedupeFooter();
      measure();
      if (location.hash === '#bf-search') {
        history.replaceState(null, '', location.pathname + location.search);
        customElements.whenDefined('bayt-global-search').then(() => searchEl.open && searchEl.open());
      }
    };
    const css = document.querySelector('link[data-bfs-css]');
    if (css && css.sheet) reveal();
    else if (css) { css.addEventListener('load', reveal); css.addEventListener('error', () => bar.remove()); setTimeout(reveal, 2500); }

    let t = null;
    const later = () => { clearTimeout(t); t = setTimeout(() => { if (legacy || SITE === 'ishara') model = harvest(legacy && legacy.isConnected ? legacy : (legacy = findLegacy())); refresh(); }, 60); };
    const watch = [legacy, SITE === 'ishara' ? document.querySelector('#sideNav') : null].filter(Boolean);
    if (watch.length) {
      const mo = new MutationObserver(later);
      watch.forEach((w) => mo.observe(w, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-current', 'class', 'aria-pressed', 'aria-label', 'hidden'] }));
    }
    addEventListener('hashchange', later);
    addEventListener('popstate', later);
    const titleEl = document.querySelector('title');
    if (titleEl) new MutationObserver(later).observe(titleEl, { childList: true, characterData: true, subtree: true });
    let r = null;
    addEventListener('resize', () => { clearTimeout(r); r = setTimeout(() => { fit(); measure(); }, 120); });
    if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(r); r = setTimeout(() => { measure(); }, 60); }).observe(bar);
    // Text-size changes (browser setting, page tools) can grow the bar without a resize event.
    let lastH = 0, ticking = false;
    addEventListener('scroll', () => {
      if (ticking || bar.hidden) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; const hh = bar.offsetHeight; if (hh !== lastH) { lastH = hh; measure(); } });
    }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!bar.hidden) { fit(); measure(); } });
    setTimeout(() => { if (!bar.hidden) { measure(true); dedupeFooter(); } }, 1500);
  }

  if (!document.querySelector('link[data-bfs-css]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = new URL('bf-shell.css', BASE).href;
    l.setAttribute('data-bfs-css', '');
    document.head.append(l);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
