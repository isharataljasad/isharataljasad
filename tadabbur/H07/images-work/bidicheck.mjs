import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NODE_PATH + '/playwright');
const C = JSON.parse(fs.readFileSync('content_R03.json', 'utf8'));
const src = fs.readFileSync('render.mjs','utf8');
const Qr = eval(src.match(/const Qr = (t => [^\n]+);/)[1]);
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://' + path.resolve('page.html')); await p.evaluate(() => document.fonts.ready);
let bad = 0, checked = 0;
for (const st of C.stations) for (const c of st.cards) {
  const doc = { id: c.id, h1: 'x', meta: ['x','x'], ctitle: c.title, partInMeta: 'x', segs: [{ key:'quran', cls:'q', label:'القرآن الكريم', items: [...c.quran, ...c.context].map(t => ({ k:'q', t: Qr(t) })) }] };
  const r = await p.evaluate(doc => { PAGINATE(doc); const out = [];
    for (const el of document.querySelectorAll('.q .it')) {
      const tn = el.firstChild, s = tn.textContent; const words = []; let i = 0;
      for (const w of s.split(/[  ]/)) { const rg = document.createRange(); rg.setStart(tn, i); rg.setEnd(tn, i + w.length);
        const rs = [...rg.getClientRects()]; const top = Math.min(...rs.map(x=>x.top)), right = Math.max(...rs.map(x=>x.right)), left = Math.min(...rs.map(x=>x.left));
        words.push({ w, top: Math.round(top), right, left }); i += w.length + 1; }
      out.push(words); }
    return out; }, doc);
  for (const words of r) { checked += words.length;
    for (let i = 1; i < words.length; i++) { const a = words[i-1], z = words[i];
      const sameLine = Math.abs(a.top - z.top) < 25;
      if (sameLine ? !(z.right <= a.left + 2) : !(z.top > a.top)) { bad++; console.log('ORDER', c.id, a.w, '->', z.w, a, z); } } }
}
console.log('words checked', checked, 'order violations', bad); await b.close();
