/* بيت الفؤاد — محرك البحث العام (متصفح وNode).
   بحث نصي محلي: تطبيع عربي، ترتيب، مقتطفات آمنة، وتحقق من الروابط. لا شبكة ولا تخزين للاستعلام. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BaytSearchEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SITE = 'https://baytalfuad.com';
  const EXTERNAL_HOSTS = ['www.masarcare.health', 'masarcare.health', 'www.isharataljasad.com', 'isharataljasad.com', 'sakan.baytalfuad.com'];

  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
      .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Strip common attached particles and the article so «والتوازن» finds «توازن».
  function stem(word) {
    let w = word;
    if (w.length > 4) w = w.replace(/^(وال|فال|بال|كال|لل)/, '');
    if (w.length > 4 && /^ال/.test(w)) w = w.slice(2);
    if (w.length > 4 && /^[وفبل]/.test(w)) w = w.slice(1);
    if (w.length > 5) w = w.replace(/(ات|ين|ون|ها|هم|كم)$/, '');
    if (w.length > 4) w = w.replace(/[هي]$/, '');
    return w;
  }

  const GROUPS = [
    ['كتف', 'الكفه المدوره', 'shoulder', 'rotator cuff'],
    ['عظم', 'هشاشه', 'كثافه العظم', 'osteoporosis'],
    ['قوه', 'مقاومه', 'عضل', 'strength'],
    ['توازن', 'سقوط', 'balance'],
    ['نوم', 'ارق', 'sleep', 'insomnia'],
    ['مفاصل', 'خشونه', 'ركبه'],
    ['حوض', 'سلس', 'تسرب'],
    ['مشي', 'هوائي'],
    ['انقطاع الطمث', 'سن الياس', 'هبات'],
    ['رياضيات', 'math', 'calculus', 'تفاضل'],
    ['مشتقه', 'اشتقاق', 'derivative', 'derivatives'],
    ['نهايه', 'نهايات', 'limit', 'limits'],
    ['داله', 'دوال', 'function', 'functions'],
    ['اتزان', 'توازن'],
    ['كيمياء', 'chemistry'],
    ['فيزياء', 'physics'],
    ['انجليزي', 'english', 'لغه انجليزيه'],
  ].map((g) => g.map(normalize));

  const STOP = new Set(['من', 'في', 'على', 'الي', 'عن', 'مع', 'او', 'ما', 'لا', 'ان', 'هل', 'كل', 'ثم', 'بعد', 'قبل', 'هذا', 'هذه', 'التي', 'الذي', 'لمن', 'به', 'بها', 'the', 'of', 'and', 'to', 'in', 'a']);
  function tokens(q) {
    const all = normalize(q).split(' ').filter((w) => w.length > 1);
    const content = all.filter((w) => !STOP.has(w));
    return (content.length ? content : all).slice(0, 12);
  }

  function prepare(docs) {
    return docs.map((d) => {
      const title = normalize(`${d.title || ''} ${d.section || ''}`);
      const body = normalize(d.text || '');
      return { doc: d, title: ` ${title} `, body: ` ${body} `, hay: ` ${title} ${body} `, stems: new Set(`${title} ${body}`.split(' ').map(stem)) };
    });
  }

  // Whole word = 2, same stem («والتوازن» ~ «توازن») = 1.5, word prefix of 4+ letters = 1. No mid-word matches.
  function hasWord(p, w) {
    if (p.hay.includes(` ${w} `)) return 2;
    if (p.stems.has(stem(w))) return 1.5;
    return w.length >= 4 && p.hay.includes(` ${w}`) ? 1 : 0;
  }
  const inText = (s, t) => (t.includes(' ') ? s.includes(` ${t}`) : s.includes(` ${t} `));

  function search(prepared, query, opts = {}) {
    const { path = 'all', limit = 40 } = opts;
    const q = normalize(query).slice(0, 160);
    if (q.length < 2) return [];
    const words = tokens(q);
    if (!words.length) return [];
    const related = GROUPS.filter((g) => g.some((t) => q.includes(t) || words.some((w) => stem(w) === stem(t)))).flat().filter((t) => !q.includes(t));
    const out = [];
    for (const p of prepared) {
      if (path !== 'all' && p.doc.path !== path) continue;
      let score = 0;
      if (p.title.includes(` ${q} `)) score += 60;
      else if (p.body.includes(` ${q} `)) score += 22;
      let matched = 0;
      for (const w of words) {
        const h = hasWord(p, w);
        if (!h) continue;
        matched += 1;
        const inTitle = p.title.includes(` ${w}`) || p.title.split(' ').some((t) => t && stem(t) === stem(w));
        score += (inTitle ? 12 : 3) * (h / 2);
      }
      let viaRelated = false;
      if (words.length > 1 && matched === words.length) score += 10;
      if (matched < words.length) {
        const rel = related.filter((t) => inText(p.hay, t) || (!t.includes(' ') && p.stems.has(stem(t)))).length;
        if (!matched && rel) { score = 3 + Math.min(rel, 3); viaRelated = true; }
        else if (matched) score = score * 0.6 + 6;
      }
      if (score <= 0) continue;
      if (p.doc.kind === 'page') score += 1;
      if (p.doc.kind === 'external') score *= 0.8;
      out.push({ doc: p.doc, score, related: viaRelated });
    }
    return out.sort((a, b) => b.score - a.score || String(a.doc.title).localeCompare(String(b.doc.title), 'ar')).slice(0, limit);
  }

  /** Returns [{text, hit}] segments of a short excerpt; render with textContent only. */
  function snippet(doc, query, max = 200) {
    const text = String(doc.text || '').replace(/\s+/g, ' ').trim();
    if (!text) return [];
    const words = tokens(query).map(stem).filter((w) => w.length > 1);
    const raw = text.split(' ');
    let best = 0, bestScore = -1;
    for (let i = 0; i < raw.length; i += 1) {
      const win = raw.slice(i, i + 22).map((x) => stem(normalize(x)));
      const s = words.filter((w) => win.some((x) => x.includes(w))).length;
      if (s > bestScore) { bestScore = s; best = i; }
      if (s === words.length) break;
    }
    const from = Math.max(0, best - 6);
    let excerpt = raw.slice(from, from + 34).join(' ');
    if (excerpt.length > max) excerpt = `${excerpt.slice(0, max)}…`;
    else if (from + 34 < raw.length) excerpt += ' …';
    if (from > 0) excerpt = `… ${excerpt}`;
    return excerpt.split(/(\s+)/).map((part) => {
      const n = stem(normalize(part));
      return { text: part, hit: !!n && n.length > 1 && words.some((w) => n.includes(w) || (w.length > 2 && w.includes(n) && n.length > 2)) };
    });
  }

  /** Only same-site paths or approved https hosts; everything else is rejected.
      On masarcare.health and isharataljasad.com the widget passes { local: false }, so
      baytalfuad.com links stay absolute and bare paths (which would resolve to the wrong site) are refused. */
  function safeHref(url, opts = {}) {
    const local = opts.local !== false;
    const s = String(url || '').trim();
    if (/^\/(?!\/)[^\s\\]*$/.test(s)) return local ? s : null;
    try {
      const u = new URL(s);
      if (u.protocol !== 'https:' || u.username || u.password) return null;
      if (u.hostname === 'baytalfuad.com' || u.hostname === 'www.baytalfuad.com') return local ? u.pathname + u.search + u.hash : u.href;
      if (EXTERNAL_HOSTS.includes(u.hostname)) return u.href;
    } catch { /* not a URL */ }
    return null;
  }

  function validIndex(data) {
    return !!data && data.schema === 'bayt-search-v1' && Array.isArray(data.docs) && data.docs.every((d) => d && typeof d.title === 'string' && typeof d.url === 'string' && typeof d.text === 'string' && typeof d.path === 'string');
  }

  return { SITE, EXTERNAL_HOSTS, normalize, stem, tokens, prepare, search, snippet, safeHref, validIndex };
});
