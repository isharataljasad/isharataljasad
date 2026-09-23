// H07 — إخراج الصور بالتنسيق الثاني (مطابقة مرجع H07-E01-03) من النص المعتمد H07-TEXT-R03.
// النسخة الأولى (render.mjs و images-R03) تبقى كما هي دون تغيير.
// الاستعمال: node render2.mjs <مجلد الإخراج> [قائمة معرّفات مفصولة بفواصل، مثل H07-C001]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NODE_PATH + '/playwright');

const C = JSON.parse(fs.readFileSync('content_R03.json', 'utf8'));
const OUT = process.argv[2] || '../images-R03-F2';
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;

const AR = s => String(s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const NB = t => t.replace(/ ([.،:؛؟])(?= |$)/g, ' $1');
const Qr = t => t.replace(/ ([ۖ-ۜ])/g, '$1').replace('﴾ (', '﴾ (');

// إعدادات معايَرة على الصورة المرجعية H07-E01-03 بمقاسها 1080×1920 (عرض الحبر لنصوص مطابقة)
const CSS = `
@font-face{font-family:AQ;src:url(fonts/AmiriQuran.ttf)}
@font-face{font-family:AR;src:url(fonts/Amiri-Regular.ttf);font-weight:400}
@font-face{font-family:AR;src:url(fonts/Amiri-Bold.ttf);font-weight:700}
:root{--g:#103d30;--gold:#b68b43;--bg:#f5efe3}
*{box-sizing:border-box}
body{margin:0;background:#ddd;font-family:AR;direction:rtl}
.page{width:1080px;height:1920px;background:var(--bg);position:relative;overflow:hidden;margin-bottom:20px}
.hdr{position:absolute;top:0;left:0;right:0;height:200px;background:var(--g);border-bottom:6px solid var(--gold);text-align:center}
.hdr .l1{position:absolute;top:18px;left:0;right:0;color:#fff;font-weight:700;font-size:44px;line-height:1.6}
.hdr .l2{position:absolute;top:95px;left:0;right:0;color:#f4dfb9;font-size:36px;line-height:1.6}
.ftr{position:absolute;bottom:0;left:0;right:0;height:140px;background:var(--g);border-top:4px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 40px 8px 38px}
.ftr .r{color:#efe8d8;font-weight:700;font-size:33px;width:260px;text-align:right}
.ftr .c{color:#fff;font-weight:700;font-size:38px;text-align:center;flex:1}
.ftr .l{color:#d3b37b;font-size:32px;width:260px;text-align:left}
.area{position:absolute;left:40px;right:40px;top:224px;bottom:160px;display:flex;flex-direction:column;gap:20px;overflow:hidden}
.ctitle{flex:0 0 auto;color:var(--g);font-weight:700;font-size:36px;line-height:1.5;padding:0 8px 0 8px;margin-bottom:-4px}
.panel{background:#fff;border-radius:16px;padding:18px 30px 26px 32px;border-right:7px solid var(--g);flex:0 0 auto}
.panel.q{border-right-color:var(--gold)}
.panel.ctx{border-right-color:#c9b58c;background:#fdfaf3}
.panel.d{border-right-color:var(--g);background:#eef3ee}
.lab{font-weight:700;font-size:32px;line-height:1.35;color:#133e31;margin-bottom:4px}
.panel.q .lab,.panel.ctx .lab{color:#927036}
.lab .cont{font-weight:400;color:#7b7a70;font-size:26px}
.it{margin:0 0 12px}.it:last-child{margin-bottom:0}
.q .it,.ctx .it{font-family:AQ;font-size:48.5px;line-height:2.02;color:#123d30;text-align:right}
.p{font-size:48px;line-height:1.865;color:#202d27;text-align:right}
.note{font-size:30px;line-height:1.7;color:#7b7a70}
.sub{font-size:36px;font-weight:700;color:#927036;text-align:center;border-top:1px solid #e5d7bb;border-bottom:1px solid #e5d7bb;padding:6px 0;margin:8px 0 14px}
.vs{font-size:48px;line-height:1.865;text-align:center;color:#202d27}
.endq{font-size:30px;color:#927036;text-align:center;margin-top:4px}
.src{font-size:28px;color:#7b7a70;line-height:1.6;margin-top:8px}
.qst{background:#fff;border-radius:12px;padding:12px 22px 16px;border:2px solid var(--gold)}
.qst .ql{font-weight:700;color:#927036;font-size:32px;display:block;line-height:1.35}
.qst .qt{font-size:48px;line-height:1.865;color:var(--g);font-weight:700}
.area.center{justify-content:center}
.cover{position:absolute;top:206px;bottom:144px;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px}
.cover .a{color:#927036;font-size:48px;font-weight:700;line-height:1.7}
.cover .b{color:var(--g);font-size:80px;font-weight:700;line-height:1.5;margin:10px 0}
.cover .c{color:#5f6b63;font-size:40px;line-height:1.8}
.cover .rule{width:220px;height:3px;background:var(--gold);margin:34px auto}
`;

function shell() {
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div id=root></div>
<script>
${PAGINATE.toString()}
${setFooters.toString()}
</script></body></html>`;
}

// يُنفَّذ داخل الصفحة: يوزّع الأقسام على صفحات دون حذف
function PAGINATE(doc) {
  const root = document.getElementById('root'); root.innerHTML = '';
  const pages = []; let area, pageRec;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function newPage() {
    const pg = document.createElement('div'); pg.className = 'page';
    pg.innerHTML = `<div class=hdr><div class=l1>${esc(doc.l1)}</div><div class=l2>${esc(doc.l2)}</div></div>
      <div class=area></div><div class=ftr><div class=r>بيت الفؤاد</div><div class=c>٠٠ من ٠٠</div><div class=l>مسار الفؤاد للتدبر</div></div>`;
    root.appendChild(pg);
    area = pg.querySelector('.area'); if (doc.areaCls) area.classList.add(doc.areaCls);
    // عنوان البطاقة مرة واحدة: في أول صورة منها فقط
    if (doc.ctitle && pages.length === 0) { const t = document.createElement('div'); t.className = 'ctitle'; t.textContent = doc.ctitle; area.appendChild(t); }
    pageRec = { el: pg, items: [] }; pages.push(pageRec);
  }
  const over = () => area.scrollHeight > area.clientHeight + 1;
  function mk(kind, t) {
    const e = document.createElement('div');
    if (kind === 'question') { e.className = 'it qst'; e.innerHTML = `<span class=ql>سؤال للتأمل</span><span class=qt></span>`; e.querySelector('.qt').textContent = t; }
    else { e.className = 'it ' + ({ p: 'p', note: 'note', subhead: 'sub', verse: 'vs', endquote: 'endq', source: 'src', q: '' }[kind] ?? 'p'); e.textContent = t; }
    return e;
  }
  function addPanel(seg, cont) {
    const pn = document.createElement('div'); pn.className = 'panel ' + (seg.cls || '');
    if (seg.label) pn.innerHTML = `<div class=lab>${seg.label}${cont ? ' <span class=cont>(تابع)</span>' : ''}</div>`;
    area.appendChild(pn); return pn;
  }
  // أدوات الفاصل المعنوي
  const NEG = new Set(['لا', 'لن', 'لم', 'لما', 'ما', 'ليس', 'ليست', 'غير', 'إلا', 'ولا', 'ولن', 'ولم', 'وما', 'فلا', 'فلن', 'فلم', 'فما', 'أن', 'إن', 'أي:', 'من', 'في', 'على', 'إلى', 'عن', 'و', 'أو', 'بل', 'ثم', 'قد', 'الذي', 'التي', 'الذين', 'كما', 'حتى', 'مع']);
  const strip = w => w.replace(/[ً-ْٰ]/g, '');
  function scoreAt(words, i) { // فاصل بعد الكلمة i-1
    const w = words[i - 1]; const nxt = words[i] || '';
    if (/[.؟!]$/.test(w) || /[.؟!]$/.test(w.replace(/ /g, ''))) return 3;
    if (/[،؛:]$/.test(w.replace(/ /g, '')) || /^[،؛:]/.test(nxt)) return 2;
    if (NEG.has(strip(w))) return -1;
    return 1;
  }
  let guard = 0;
  if (!doc.segs.length) newPage();
  for (const seg of doc.segs) {
    if (!area) newPage();
    let pn = addPanel(seg, false);
    if (over()) { pn.remove(); newPage(); pn = addPanel(seg, false); }
    else if (seg.keep) {
      // يُبقى القسم القصير مجتمعًا في صورة واحدة إن اتسعت له صورة كاملة
      seg.items.forEach(it => pn.appendChild(mk(it.k, it.t)));
      const fitsHere = !over();
      [...pn.querySelectorAll('.it')].forEach(e => e.remove());
      if (!fitsHere) {
        pn.remove(); const saved = area; newPage(); const probe = addPanel(seg, false);
        seg.items.forEach(it => probe.appendChild(mk(it.k, it.t)));
        const fitsFresh = !over(); probe.remove();
        if (fitsFresh) { pn = addPanel(seg, false); }
        else { pages.pop().el.remove(); area = saved; pageRec = pages[pages.length - 1]; pn = addPanel(seg, false); }
      }
    }
    for (const item of seg.items) {
      let text = item.t;
      while (true) {
        const e = mk(item.k, text); pn.appendChild(e);
        if (!over()) { pageRec.items.push({ k: item.k, t: text, seg: seg.key }); break; }
        e.remove();
        if (item.k === 'source' && !item._kept) {
          const prevEl = [...pn.querySelectorAll('.it')].pop();
          const prevRec = pageRec.items[pageRec.items.length - 1];
          if (prevEl && prevRec && prevRec.seg === seg.key && !prevRec.split && pn.querySelectorAll('.it').length > 1) {
            prevEl.remove(); pageRec.items.pop(); item._kept = true;
            newPage(); pn = addPanel(seg, true);
            pn.appendChild(mk(prevRec.k, prevRec.t)); pageRec.items.push(prevRec);
            continue;
          }
        }
        const words = text.split(' ');
        let lo = 0, hi = words.length - 1, best = 0;
        const minW = item.k === 'q' ? 4 : 8;
        const fresh = !pn.querySelector('.it') && [...area.children].every(c => c === pn || c.classList.contains('ctitle'));
        if (++guard > 600) throw new Error('pagination loop');
        const canSplit = item.k !== 'question' && item.k !== 'subhead' && (item.k !== 'q' || fresh);
        if (canSplit && words.length > minW * 2) {
          while (lo <= hi) {
            const mid = (lo + hi) >> 1; const t = mk(item.k, words.slice(0, mid).join(' ')); pn.appendChild(t);
            const ok = !over(); t.remove(); if (ok) { best = mid; lo = mid + 1; } else hi = mid - 1;
          }
        }
        // لا يُقطع داخل قوسين {…} أو ﴿…﴾
        let depth = 0; const okAt = [];
        words.forEach((w, i) => { for (const ch of w) { if (ch === '{' || ch === '﴿') depth++; if (ch === '}' || ch === '﴾') depth--; } okAt[i + 1] = depth <= 0; });
        if (best >= minW) {
          if (item.k === 'q') {
            // في الآية الطويلة: يُفضَّل القطع بعد علامة وقف
            for (let b2 = best; b2 >= Math.max(minW, Math.floor(best * 0.6)); b2--) if (/[ۖ-ۜ]$/.test(words[b2 - 1])) { best = b2; break; }
          } else {
            // فاصل معنوي: نهاية جملة، ثم فاصلة، ثم أي كلمة ليست نفيًا أو حرفًا يعلّق ما بعده
            const cands = [];
            for (let b2 = best; b2 >= minW; b2--) if (okAt[b2]) cands.push([b2, scoreAt(words, b2)]);
            const pick = (sc, frac) => cands.find(([b2, s]) => s >= sc && b2 >= best * frac);
            const c = pick(3, 0.55) || pick(2, 0.75) || pick(1, 0) ;
            if (c) best = c[0]; else best = 0;
          }
        }
        if (best >= minW && words.length - best >= 3) {
          const head = words.slice(0, best).join(' ');
          pn.appendChild(mk(item.k, head)); pageRec.items.push({ k: item.k, t: head, seg: seg.key, split: 'head' });
          text = words.slice(best).join(' ');
        }
        if (!pn.querySelector('.it')) pn.remove();
        newPage(); pn = addPanel(seg, true);
      }
    }
  }
  const problems = [];
  pages.forEach((p, i) => {
    const a = p.el.querySelector('.area');
    if (a.scrollHeight > a.clientHeight + 1) problems.push(`page ${i + 1}: vertical overflow`);
    p.el.querySelectorAll('.it,.ctitle,.lab').forEach(e => { if (e.scrollWidth > e.clientWidth + 2) problems.push(`page ${i + 1}: horizontal overflow`); });
    const hb = p.el.querySelector('.hdr').getBoundingClientRect().bottom, at = a.getBoundingClientRect().top;
    const fb = p.el.querySelector('.ftr').getBoundingClientRect().top, ab = a.getBoundingClientRect().bottom;
    if (at < hb || ab > fb) problems.push(`page ${i + 1}: band overlap`);
    p.el.querySelectorAll('.hdr div,.ftr div').forEach(e => { if (e.scrollWidth > e.clientWidth + 2) problems.push(`page ${i + 1}: band text overflow`); });
  });
  return { pages: pages.map(p => p.items), problems };
}

function setFooters(start, total) {
  document.querySelectorAll('.page').forEach((p, i) => {
    const f = p.querySelector('.ftr .c'); if (f) f.textContent = `${String(start + i).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} من ${String(total).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}`;
  });
}

// ===== بناء المستندات =====
const L1 = 'الحزب السابع · آل عمران ٩٢–١٧٠';
const stRange = st => 'آل عمران ' + st.verses.replace(/\s*\(.*\)\s*/, '');
const docs = [];
docs.push({ id: 'H07-COVER', folder: 'H07-00-INTRO', l1: L1, l2: 'مقدمة الحزب', cover: true });
docs.push({ id: 'H07-DESC', folder: 'H07-00-INTRO', l1: L1, l2: 'مقدمة الحزب', ctitle: 'وصف الحزب',
  segs: [{ key: 'desc', cls: '', label: 'وصف الحزب', items: C.desc.map(t => ({ k: 'p', t })) }] });
docs.push({ id: 'H07-MAP', folder: 'H07-00-INTRO', l1: L1, l2: 'مقدمة الحزب', ctitle: 'خريطة المحطات المقترحة',
  segs: C.map.map(r => ({ key: 'map' + r[0], cls: '', label: `المحطة ${r[0]}: ${r[1]}`,
    keep: true, items: [{ k: 'p', t: `الآيات: ${r[2]}` }, { k: 'p', t: `البطاقات: ${r[3]}` }, { k: 'p', t: `السؤال المركزي: ${r[4]}` }] })) });
C.stations.forEach((st, si) => {
  const folder = `H07-ST${String(si + 1).padStart(2, '0')}`;
  const l2 = `المحطة ${st.n} من ٩ · ${stRange(st)}`;
  docs.push({ id: `${folder}-OPEN`, folder, l1: L1, l2, ctitle: st.title,
    segs: [{ key: 'open', cls: '', keep: true, label: 'افتتاحية المحطة', items: [{ k: 'p', t: st.opening }] },
           { key: 'sq', cls: 'd', keep: true, label: 'سؤال المحطة', items: [{ k: 'p', t: st.q }] }] });
  for (const c of st.cards) {
    const segs = [{ key: 'quran', cls: 'q', label: 'القرآن الكريم', items: c.quran.map(t => ({ k: 'q', t: Qr(t), orig: t })) }];
    if (c.context.length) segs.push({ key: 'context', cls: 'ctx', label: c.context_note.replace(/:$/, ''), items: c.context.map(t => ({ k: 'q', t: Qr(t), orig: t })) });
    segs.push({ key: 'tafsir', cls: '', label: 'تفسير السعدي', items: [...c.tafsir.map(x => ({ k: x.k, t: NB(x.t), orig0: x.t })), { k: 'source', t: c.source }] });
    segs.push({ key: 'tadabbur', cls: 'd', keep: true, label: 'تدبر الفؤاد', items: [...c.tadabbur.map(t => ({ k: 'p', t })), { k: 'question', t: c.question }] });
    docs.push({ id: c.id, folder, l1: L1, l2, ctitle: `${c.title} · ${c.ref}`, segs, card: c, station: st.n });
  }
});
C.summaries.forEach(s => {
  const id = 'H07-S' + s.id.slice(5).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  docs.push({ id, folder: 'H07-SUMMARY', l1: L1, l2: 'خلاصة المسار التدبّري', ctitle: s.title, areaCls: 'center',
    segs: [{ key: 'sum', cls: 'd', label: '', items: s.lines.map(t => ({ k: 'p', t })) }] });
});

// ===== التشغيل: تمريرة للعدّ، ثم تمريرة للإخراج مع ترقيم المحطة =====
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
fs.writeFileSync('page2.html', shell());
await page.goto('file://' + path.resolve('page2.html'));
await page.evaluate(() => document.fonts.ready);
const pd = d => ({ l1: d.l1, l2: d.l2, ctitle: d.ctitle, segs: d.segs, areaCls: d.areaCls });
const counts = {};
for (const d of docs) counts[d.id] = d.cover ? 1 : (await page.evaluate(doc => PAGINATE(doc).pages.length, pd(d)));
const folderTotal = {}, startOf = {};
for (const d of docs) { startOf[d.id] = (folderTotal[d.folder] || 0) + 1; folderTotal[d.folder] = (folderTotal[d.folder] || 0) + counts[d.id]; }

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const d of docs) {
  if (ONLY && !ONLY.includes(d.id)) continue;
  const dir = path.join(OUT, d.folder); fs.mkdirSync(dir, { recursive: true });
  if (d.cover) {
    await page.evaluate(d => {
      document.getElementById('root').innerHTML = `<div class=page><div class=hdr><div class=l1>${d.l1}</div><div class=l2>${d.l2}</div></div>
      <div class=cover><div class=a>بلّغوا عني ولو آية</div><div class=c>مسار الفؤاد للتدبر</div><div class=rule></div>
      <div class=b>الحزب السابع</div><div class=c>سورة آل عمران</div><div class=c>الآيات ٩٢–١٧٠</div><div class=rule></div>
      <div class=c>٩ محطات · ٤٠ بطاقة</div></div><div class=ftr><div class=r>بيت الفؤاد</div><div class=c></div><div class=l>مسار الفؤاد للتدبر</div></div></div>`;
    }, d);
  } else {
    var res = await page.evaluate(doc => PAGINATE(doc), pd(d));
    if (res.problems.length) console.log('PROBLEMS', d.id, res.problems);
  }
  await page.evaluate(([s, t]) => setFooters(s, t), [startOf[d.id], folderTotal[d.folder]]);
  await page.evaluate(() => document.fonts.ready);
  const errs = [];
  if (!d.cover) {
    const flat = res.pages.flat(); let k = 0;
    for (const s of d.segs) for (const it of s.items) {
      let acc = [];
      while (k < flat.length && flat[k].seg === s.key && flat[k].k === it.k) { acc.push(flat[k].t); const last = !flat[k].split; k++; if (last) break; }
      if (acc.join(' ') !== it.t) errs.push(`${s.key}: text mismatch`);
      if (it.orig0 !== undefined && it.t.replace(/ /g, ' ') !== it.orig0) errs.push('nbsp normalisation not reversible');
      if (it.orig && it.t.replace(/ /g, ' ').replace(/([^ ])([ۖ-ۜ])/g, '$1 $2') !== it.orig) errs.push('quran normalisation not reversible');
    }
    if (k !== flat.length) errs.push('extra items');
    if (errs.length) console.log('TEXT ERRORS', d.id, errs);
  }
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) {
    const f = path.join(dir, `${d.id}-${String(i + 1).padStart(2, '0')}.png`);
    await els[i].screenshot({ path: f });
    manifest.push({ id: d.id, file: path.relative(OUT, f), folder: d.folder, part: i + 1, of: els.length,
      stationPage: startOf[d.id] + i, stationTotal: folderTotal[d.folder], l2: d.l2,
      items: d.cover ? [] : res.pages[i].map(x => ({ seg: x.seg, k: x.k, split: x.split || null, chars: x.t.length, head: x.t.slice(0, 40), tail: x.t.slice(-30) })),
      problems: d.cover ? [] : res.problems, textErrors: errs });
  }
  console.log(d.id, els.length, `station pages ${startOf[d.id]}-${startOf[d.id] + els.length - 1} of ${folderTotal[d.folder]}`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, ONLY ? `manifest-sample.json` : 'manifest.json'), JSON.stringify({ totals: folderTotal, counts, pages: manifest }, null, 1));
