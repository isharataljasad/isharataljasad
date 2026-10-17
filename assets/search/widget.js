/* بيت الفؤاد — مكوّن البحث العام <bayt-global-search>.
   يبحث في فهرسين عامّين: صفحات baytalfuad.com، ومكتبة مسار كير (masarcare.health).
   يُحمّل المحرك والفهارس عند أول فتح فقط. لا يحفظ الاستعلام ولا يرسله. النصوص تُعرض بـtextContent.
   في baytalfuad.com يحمّل هذا الملف أيضًا الشريط الموحّد (/shell/bf-shell.js). */
(() => {
  'use strict';
  if (customElements.get('bayt-global-search')) return;
  const SELF = document.currentScript && document.currentScript.src ? document.currentScript.src : new URL('/search/widget.js', location.href).href;
  const INDEX_URL = '/search/index.json';
  const MASAR_INDEX_URL = '/data/search-index.json';
  const ENGINE_URL = new URL('engine.js', SELF).href;
  const PATHS = [['all', 'الكل'], ['masar', 'مسار كير'], ['movement', 'الحركة'], ['sleep', 'النوم والتعافي'], ['ilm', 'العلم والعمل'], ['home', 'البيت والأركان']];
  let loading = null;

  // The shared bar (bf-shell.js) sets window.__bfShell; before it loads, this is baytalfuad.com.
  const shell = () => window.__bfShell || { site: 'bayt', origins: { bayt: 'https://baytalfuad.com', masar: 'https://www.masarcare.health' } };
  function sources() {
    const { site, origins } = shell();
    return [
      { id: 'bayt', label: 'بيت الفؤاد', url: site === 'bayt' ? INDEX_URL : origins.bayt + INDEX_URL, base: site === 'bayt' ? '' : 'https://baytalfuad.com' },
      { id: 'masar', label: 'مسار كير', url: site === 'masar' ? MASAR_INDEX_URL : origins.masar + MASAR_INDEX_URL, base: '' },
    ];
  }
  const getJSON = (url) => fetch(url, { credentials: 'omit', cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });

  function loadEngine() {
    if (window.BaytSearchEngine) return Promise.resolve(window.BaytSearchEngine);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = ENGINE_URL; s.async = true;
      s.onload = () => (window.BaytSearchEngine ? res(window.BaytSearchEngine) : rej(new Error('engine')));
      s.onerror = () => rej(new Error('engine'));
      document.head.append(s);
    });
  }
  function loadAll() {
    if (!loading) {
      const list = sources();
      loading = Promise.all([loadEngine(), Promise.allSettled(list.map((src) => getJSON(src.url)))])
        .then(([engine, settled]) => {
          const docs = [], ok = [], failed = [];
          let built = '';
          settled.forEach((r, i) => {
            const src = list[i];
            if (r.status !== 'fulfilled' || !engine.validIndex(r.value)) { failed.push(src); return; }
            ok.push({ ...src, count: r.value.docs.length });
            if (src.id === 'bayt') built = r.value.built || '';
            for (const d of r.value.docs) docs.push({ ...d, src: src.id, url: src.base && d.url.startsWith('/') ? src.base + d.url : d.url });
          });
          if (!ok.length) throw new Error('index');
          return { engine, ok, failed, built, data: { docs }, prepared: engine.prepare(docs) };
        })
        .catch((e) => { loading = null; throw e; });
    }
    return loading;
  }

  const CSS = `
:host{display:inline-block;font:inherit;color:inherit}
:host([floating]){position:fixed;left:16px;bottom:16px;z-index:60}
*{box-sizing:border-box}
.trigger{font:inherit;font-size:.92rem;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:6px 14px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer}
.trigger svg{width:18px;height:18px;flex:0 0 auto}
:host([floating]) .trigger{background:var(--bfs-accent,#D97757);color:var(--bfs-on-accent,#1B1A18);border-color:transparent;box-shadow:0 6px 20px rgba(0,0,0,.25);min-height:48px;font-weight:600}
:host([data-variant="bar"]) .trigger{min-height:40px;padding:0 12px 0 14px;border-radius:10px;border:1px solid var(--bfs-line,#3A352F);background:var(--bfs-surface,#262320);color:var(--bfs-text,#F2EBDD);font-family:var(--bfs-font,inherit);font-size:.9375rem;font-weight:600;line-height:1}
:host([data-variant="bar"]) .trigger:hover{background:var(--bfs-surface-2,#312D28);border-color:var(--bfs-line-strong,#5A5249)}
.trigger kbd{font:inherit;font-size:.75rem;opacity:.75;border:1px solid currentColor;border-radius:6px;padding:1px 5px;direction:ltr;font-weight:500}
.trigger:focus-visible,button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--bfs-focus,#E8906F);outline-offset:2px}
dialog{width:min(760px,calc(100vw - 24px));max-height:min(86vh,900px);padding:0;border:1px solid var(--bfs-line,#3A352F);border-radius:18px;background:var(--bfs-surface,#262320);color:var(--bfs-text,#F2EBDD);font-family:var(--bfs-font,"IBM Plex Sans Arabic","Segoe UI",Tahoma,Arial,sans-serif);line-height:1.75;direction:rtl;text-align:right;box-shadow:0 24px 64px rgba(0,0,0,.45)}
dialog::backdrop{background:rgba(12,10,8,.62)}
.inner{display:flex;flex-direction:column;max-height:min(86vh,900px)}
header{padding:18px 18px 10px;border-bottom:1px solid var(--bfs-line,#3A352F);display:grid;gap:10px}
.row{display:flex;gap:8px;align-items:center}
label{font-weight:700;font-size:1rem}
input{flex:1;font:inherit;font-size:1.0625rem;color:var(--bfs-text,#F2EBDD);background:var(--bfs-bg,#1B1A18);border:1px solid var(--bfs-line-strong,#5A5249);border-radius:12px;padding:10px 12px;min-height:48px;width:100%}
input::placeholder{color:var(--bfs-muted,#ABA192)}
.close{font:inherit;min-height:44px;padding:6px 14px;border-radius:10px;border:1px solid var(--bfs-line,#3A352F);background:transparent;color:var(--bfs-text,#F2EBDD);cursor:pointer}
.filters{display:flex;flex-wrap:wrap;gap:6px}
.filters button{font:inherit;font-size:.875rem;min-height:36px;padding:4px 12px;border-radius:999px;border:1px solid var(--bfs-line,#3A352F);background:transparent;color:var(--bfs-text-2,#D8CFBF);cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--bfs-accent,#D97757);color:var(--bfs-on-accent,#1B1A18);border-color:transparent;font-weight:600}
.filters button[hidden]{display:none}
.status{margin:0;font-size:.9rem;color:var(--bfs-muted,#ABA192);min-height:1.5em}
.results{list-style:none;margin:0;padding:8px 10px;overflow:auto;flex:1}
.results li{margin:0}
.results a{display:block;padding:12px 12px;border-radius:12px;color:var(--bfs-text,#F2EBDD);text-decoration:none;border:1px solid transparent}
.results a:hover,.results a[aria-selected="true"]{background:var(--bfs-surface-2,#312D28);border-color:var(--bfs-line,#3A352F)}
.results strong{display:block;color:var(--bfs-text,#F2EBDD);font-size:1rem;font-weight:600}
.meta{display:flex;gap:6px;flex-wrap:wrap;font-size:.78rem;color:var(--bfs-muted,#ABA192);margin:4px 0}
.chip{border-radius:999px;background:var(--bfs-bg,#1B1A18);border:1px solid var(--bfs-line,#3A352F);padding:0 8px}
.chip.site{border-color:var(--bfs-accent,#D97757);color:var(--bfs-text-2,#D8CFBF)}
.chip.ext{border-style:dashed}
.snip{font-size:.92rem;color:var(--bfs-text-2,#D8CFBF);margin:4px 0 0}
mark{background:color-mix(in srgb,var(--bfs-accent,#D97757) 35%,transparent);color:inherit;border-radius:3px;padding:0 1px}
.empty,.error{padding:18px;color:var(--bfs-text-2,#D8CFBF)}
.error{background:color-mix(in srgb,#F0A08A 14%,transparent);border-radius:12px;margin:10px}
.retry{font:inherit;min-height:40px;padding:4px 14px;border-radius:10px;border:1px solid #F0A08A;background:transparent;color:inherit;cursor:pointer}
footer{border-top:1px solid var(--bfs-line,#3A352F);padding:10px 18px 14px;font-size:.84rem;color:var(--bfs-muted,#ABA192);line-height:1.7}
footer p{margin:0}
footer .scope{color:var(--bfs-text-2,#D8CFBF)}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid var(--bfs-line-strong,#5A5249);border-top-color:var(--bfs-accent,#D97757);border-radius:50%;vertical-align:-2px;margin-inline-end:6px;animation:spin .9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.spinner{animation:none}}
@media (max-width:720px){:host([data-variant="bar"]) .trigger{width:40px;padding:0;justify-content:center}:host([data-variant="bar"]) .lbl,:host([data-variant="bar"]) kbd{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@media (max-width:1100px){:host([data-variant="bar"]) kbd{display:none}}
@media (max-width:520px){dialog{width:100vw;max-width:100vw;max-height:100vh;height:100%;border-radius:0;margin:0}.inner{max-height:100vh;height:100%}.trigger kbd{display:none}}
@media (forced-colors:active){.results a[aria-selected="true"]{outline:2px solid Highlight}}
`;

  const h = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'text') n.textContent = v; else if (k === 'class') n.className = v; else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => c != null && n.append(c));
    return n;
  };
  function glass() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'aria-hidden': 'true', focusable: 'false' })) svg.setAttribute(k, v);
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', '10.5'); c.setAttribute('cy', '10.5'); c.setAttribute('r', '6.5');
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'm15.5 15.5 5 5');
    svg.append(c, p);
    return svg;
  }

  class BaytGlobalSearch extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const sh = this.attachShadow({ mode: 'open' });
      const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      const bar = this.getAttribute('data-variant') === 'bar';
      this.trigger = h('button', { class: 'trigger', type: 'button', 'aria-haspopup': 'dialog', 'aria-label': 'بحث في بيت الفؤاد ومسار كير', title: `بحث (${mac ? '⌘K' : 'Ctrl K'})`, 'aria-keyshortcuts': mac ? 'Meta+K' : 'Control+K' }, glass(), h('span', { class: 'lbl', text: bar ? 'بحث' : 'بحث في بيت الفؤاد' }), h('kbd', { text: mac ? '⌘K' : 'Ctrl K', 'aria-hidden': 'true' }));
      this.input = h('input', { id: 'q', type: 'search', role: 'combobox', 'aria-expanded': 'false', 'aria-controls': 'results', 'aria-autocomplete': 'list', autocomplete: 'off', spellcheck: 'false', maxlength: '160', placeholder: 'مثال: النوم، الكتف، الحديد، المشتقة' });
      this.filters = h('div', { class: 'filters', role: 'group', 'aria-label': 'تصفية بالمسار' }, PATHS.map(([id, t]) => h('button', { type: 'button', 'data-path': id, 'aria-pressed': id === 'all' ? 'true' : 'false', text: t })));
      this.status = h('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
      this.list = h('ul', { class: 'results', id: 'results', role: 'listbox', 'aria-label': 'نتائج البحث' });
      this.scope = h('p', { class: 'scope', text: 'يبحث في: صفحات baytalfuad.com العامة (الحركة، والنوم، والعلم والعمل، والرئيسية) ومكتبة مسار كير في masarcare.health.' });
      const close = h('button', { class: 'close', type: 'button', text: 'إغلاق' });
      this.dialog = h('dialog', { 'aria-labelledby': 'q-label' }, h('div', { class: 'inner' },
        h('header', {}, h('label', { id: 'q-label', for: 'q', text: 'ابحثي في بيت الفؤاد ومسار كير' }), h('div', { class: 'row' }, this.input, close), this.filters, this.status),
        this.list,
        h('footer', {}, this.scope, h('p', { text: 'لا يشمل: مسار القرآن والتدبر في isharataljasad.com لأنه قسم خاص يتطلب الدخول، وموقع السكن. لا تُحفظ كلمات البحث ولا تُرسل.' }), h('p', { class: 'idx' }))));
      sh.append(h('style', { text: CSS }), this.trigger, this.dialog);
      this.path = 'all';
      this.active = -1;
      this.trigger.addEventListener('click', () => this.open());
      close.addEventListener('click', () => this.close());
      this.dialog.addEventListener('cancel', (e) => { e.preventDefault(); this.close(); });
      this.dialog.addEventListener('click', (e) => { if (e.target === this.dialog) this.close(); });
      this.filters.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-path]'); if (!b) return;
        this.path = b.dataset.path;
        this.filters.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        this.run();
      });
      let t = null;
      this.input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => this.run(), 120); });
      this.input.addEventListener('keydown', (e) => this.keys(e));
      if (!window.__baytSearchKeys) {
        window.__baytSearchKeys = true;
        document.addEventListener('keydown', (e) => {
          const el = document.querySelector('bayt-global-search');
          if (!el) return;
          const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable;
          if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); el.open(); }
          else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); el.open(); }
        });
      }
    }
    close() {
      if (this.dialog.open) this.dialog.close();
      this.input.value = ''; this.list.replaceChildren(); this.status.textContent = '';
      this.input.setAttribute('aria-expanded', 'false'); this.input.removeAttribute('aria-activedescendant');
      this.trigger.focus();
    }
    async open() {
      if (!this.dialog.open) this.dialog.showModal();
      this.input.focus();
      try { await this.ready(); this.run(); } catch { /* shown by ready */ }
    }
    async ready() {
      if (this.state) return this.state;
      this.status.replaceChildren(h('span', { class: 'spinner', 'aria-hidden': 'true' }), 'جارٍ تحميل فهرس البحث…');
      try {
        this.state = await loadAll();
        const { ok, failed, built } = this.state;
        this.scope.textContent = `يبحث في: ${ok.map((s) => `${s.label} (${s.count} موضعًا)`).join(' و')}.${failed.length ? ` تعذّر تحميل فهرس ${failed.map((s) => s.label).join(' و')} الآن، فالنتائج من ${ok.map((s) => s.label).join(' و')} فقط.` : ''}`;
        this.filters.querySelector('[data-path="masar"]').hidden = !ok.some((s) => s.id === 'masar');
        this.shadowRoot.querySelector('.idx').textContent = built ? `فهرس بيت الفؤاد بُني في ${built}.` : '';
        this.status.textContent = 'اكتبي كلمة من حرفين على الأقل.';
        return this.state;
      } catch (e) {
        this.status.textContent = '';
        const retry = h('button', { class: 'retry', type: 'button', text: 'أعيدي المحاولة' });
        retry.addEventListener('click', () => { this.list.replaceChildren(); this.ready().then(() => this.run()).catch(() => {}); });
        this.list.replaceChildren(h('li', { class: 'error', role: 'alert' }, h('p', { text: 'تعذر تحميل فهرس البحث. تحققي من الاتصال ثم أعيدي المحاولة. يمكنكِ أيضًا التنقل من القائمة.' }), retry));
        throw e;
      }
    }
    run() {
      if (!this.state) return;
      const { engine, prepared } = this.state;
      const local = shell().site === 'bayt';
      const here = location.hostname;
      const q = this.input.value;
      this.active = -1;
      this.input.removeAttribute('aria-activedescendant');
      if (engine.normalize(q).length < 2) { this.list.replaceChildren(); this.input.setAttribute('aria-expanded', 'false'); this.status.textContent = 'اكتبي حرفين على الأقل.'; return; }
      const results = engine.search(prepared, q, { path: this.path, limit: 30 }).filter((r) => engine.safeHref(r.doc.url, { local }));
      this.input.setAttribute('aria-expanded', String(results.length > 0));
      if (!results.length) {
        this.list.replaceChildren(h('li', { class: 'empty' }, h('p', { text: this.path === 'all' ? 'لا نتائج مطابقة. جرّبي كلمة أقصر أو مرادفًا، مثل «توازن» بدل «الاتزان».' : 'لا نتائج في هذا المسار. جرّبي «الكل».' })));
        this.status.textContent = 'لا نتائج.';
        return;
      }
      const related = results.some((r) => r.related);
      this.status.textContent = `${results.length} نتيجة${related ? '؛ بعضها لمصطلح قريب وليس تطابقًا حرفيًا' : ''}. استعملي الأسهم ثم Enter.`;
      this.list.replaceChildren(...results.map((r, i) => {
        const d = r.doc;
        const href = engine.safeHref(d.url, { local });
        const ext = d.kind === 'external';
        let other = false;
        try { other = new URL(href, location.href).hostname !== here; } catch { /* relative */ }
        const snip = h('p', { class: 'snip' }, engine.snippet(d, q).map((s) => (s.hit ? h('mark', { text: s.text }) : document.createTextNode(s.text))));
        const a = h('a', { id: `r${i}`, role: 'option', href, 'aria-selected': 'false', ...(other ? { rel: 'noopener' } : {}) },
          h('strong', { text: d.section ? `${d.title} — ${d.section}` : d.title }),
          h('span', { class: 'meta' }, h('span', { class: 'chip site', text: d.src === 'masar' ? 'مسار كير' : 'بيت الفؤاد' }), d.pathLabel && d.src !== 'masar' ? h('span', { class: 'chip', text: d.pathLabel }) : null, ext ? h('span', { class: 'chip ext', text: 'مدخل موقع منفصل' }) : null, r.related ? h('span', { class: 'chip', text: 'مصطلح قريب' }) : null),
          snip);
        a.addEventListener('mousemove', () => this.setActive(i, false));
        return h('li', { role: 'presentation' }, a);
      }));
    }
    setActive(i, scroll = true) {
      const opts = [...this.list.querySelectorAll('[role="option"]')];
      if (!opts.length) return;
      this.active = (i + opts.length) % opts.length;
      opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === this.active)));
      this.input.setAttribute('aria-activedescendant', opts[this.active].id);
      if (scroll) opts[this.active].scrollIntoView({ block: 'nearest' });
    }
    keys(e) {
      if (e.key === 'Escape') { e.preventDefault(); this.close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); this.setActive(this.active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.setActive(this.active - 1); }
      else if (e.key === 'Enter') {
        const opt = this.list.querySelector('[aria-selected="true"]') || this.list.querySelector('[role="option"]');
        if (opt) { e.preventDefault(); opt.click(); }
      }
    }
  }
  customElements.define('bayt-global-search', BaytGlobalSearch);

  // On baytalfuad.com pages this file is the single entry point: it also brings the shared bar,
  // which hosts the search button. The floating button is only a fallback if the bar cannot load.
  const floating = () => {
    if (document.querySelector('bayt-global-search')) return;
    const el = document.createElement('bayt-global-search');
    el.setAttribute('floating', '');
    document.body.append(el);
    // Sit above any fixed bottom bar (e.g. the home page's mobile tabs) instead of covering it.
    const lift = () => {
      el.style.bottom = '';
      let offset = 16;
      for (const x of [24, Math.round(innerWidth / 2), innerWidth - 24]) {
        for (const node of document.elementsFromPoint(x, innerHeight - 6)) {
          if (node === el || el.contains(node)) continue;
          for (let n = node; n && n !== document.body; n = n.parentElement) {
            const pos = getComputedStyle(n).position;
            if (pos === 'fixed' || pos === 'sticky') { offset = Math.max(offset, innerHeight - n.getBoundingClientRect().top + 12); break; }
          }
        }
      }
      el.style.bottom = `${Math.min(offset, innerHeight / 2)}px`;
    };
    setTimeout(lift, 300);
    addEventListener('resize', () => { clearTimeout(lift.t); lift.t = setTimeout(lift, 150); });
  };
  const mount = () => {
    if (window.__bfShell || document.querySelector('script[data-bfs-shell]')) return;
    if (document.documentElement.hasAttribute('data-bfs-off')) { floating(); return; }
    const s = document.createElement('script');
    s.src = new URL('/shell/bf-shell.js', SELF).href;
    s.setAttribute('data-bf-site', 'bayt');
    s.setAttribute('data-bfs-shell', '');
    s.onerror = floating;
    document.head.append(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
