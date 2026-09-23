// H07 — إخراج الصور 1080×1920 من النص المعتمد H07-TEXT-R03 (نصوص حقيقية عبر Chromium/HarfBuzz)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NODE_PATH + '/playwright');

const C = JSON.parse(fs.readFileSync('content_R03.json', 'utf8'));
const OUT = process.argv[2] || '../images-R03';
const ONLY = process.argv[3] || null;   // مثل H07-C003 لإعادة بطاقة واحدة
fs.mkdirSync(OUT, { recursive: true });

const AR = s => String(s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
// علامات الوقف: تُلصق بالكلمة السابقة عند العرض (الترميز الذي يتوقعه خط Amiri Quran)؛ لا يتغيّر أي حرف
const NB = t => t.replace(/ ([.،:؛؟])(?= |$)/g, '\u00A0$1');
const Qr = t => t.replace(/ ([ۖ-ۜ])/g, '$1').replace('﴾ (', '﴾\u00A0(');

const CSS = `
@font-face{font-family:AQ;src:url(fonts/AmiriQuran.ttf)}
@font-face{font-family:AR;src:url(fonts/Amiri-Regular.ttf)}
@font-face{font-family:NS;src:url(fonts/noto-sans-arabic-regular.woff2);font-weight:400}
@font-face{font-family:NS;src:url(fonts/noto-sans-arabic-bold.woff2);font-weight:700}
:root{--g:#123a2c;--gold:#b08a48;--bg:#f6f0e6;--muted:#7b7a70}
*{box-sizing:border-box}
body{margin:0;background:#ddd;font-family:NS,AR;direction:rtl}
.page{width:1080px;height:1920px;background:var(--bg);position:relative;overflow:hidden;margin-bottom:20px}
.hdr{height:128px;background:var(--g);border-bottom:5px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 60px}
.hdr .r{color:#fff;font-weight:700;font-size:34px}.hdr .l{color:var(--gold);font-size:32px}
.top{text-align:center;padding-top:26px}
.top h1{margin:0;color:var(--g);font-size:40px;font-weight:700;line-height:1.5}
.rule{width:170px;height:3px;background:var(--gold);margin:14px auto 14px}
.meta{color:var(--muted);font-size:27px;line-height:1.6}
.ctitle{color:var(--g);font-size:31px;font-weight:700;line-height:1.5;margin-top:6px;padding:0 60px}
.area{position:absolute;left:60px;right:60px;top:var(--top,430px);bottom:120px;display:flex;flex-direction:column;gap:26px;overflow:hidden}
.ftr{position:absolute;bottom:52px;left:0;right:0;text-align:center}
.ftr .rule{margin:0 auto 10px;width:140px}
.ftr .id{color:#a8a597;font-size:19px;font-family:NS;direction:ltr}
.panel{background:#fff;border-radius:18px;padding:30px 42px 30px 40px;border-right:8px solid var(--g);flex:0 0 auto}
.panel.q{border-right-color:var(--gold)}
.panel.ctx{border-right-color:#c9b58c;background:#fdfaf3}
.panel.d{border-right-color:var(--g);background:#eef3ee}
.lab{font-weight:700;font-size:27px;color:var(--g);margin-bottom:12px}
.panel.q .lab,.panel.ctx .lab{color:var(--gold)}
.lab .cont{font-weight:400;color:var(--muted);font-size:23px}
.it{margin:0 0 14px}.it:last-child{margin-bottom:0}
.q .it{font-family:AQ;font-size:45px;line-height:2.45;color:var(--g);text-align:center}
.ctx .it{font-family:AQ;font-size:40px;line-height:2.4;color:var(--g);text-align:center}
.p{font-size:30px;line-height:1.95;color:#1d1d1b;text-align:right}
.note{font-size:24px;line-height:1.8;color:var(--muted)}
.sub{font-size:28px;font-weight:700;color:var(--gold);text-align:center;border-top:1px solid #e5d7bb;border-bottom:1px solid #e5d7bb;padding:8px 0;margin:6px 0 18px}
.vs{font-family:AR;font-size:31px;line-height:1.9;text-align:center;color:#1d1d1b}
.endq{font-size:23px;color:var(--gold);text-align:center;margin-top:6px}
.src{font-size:21px;color:var(--muted);line-height:1.6;margin-top:10px}
.qst{background:#fff;border-radius:12px;padding:18px 24px;border:2px solid var(--gold)}
.qst .ql{font-weight:700;color:var(--gold);font-size:25px;display:block;margin-bottom:4px}
.qst .qt{font-size:30px;line-height:1.85;color:var(--g);font-weight:700}
.big{font-size:32px;line-height:2}
.row{padding:20px 32px}.row .lab{margin-bottom:2px;font-size:26px}.row .p{font-size:25px;line-height:1.6}.area.mapa{gap:16px}
.sumbig{font-size:38px;line-height:2.05;color:var(--g)}.area.center{justify-content:center}
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:absolute;top:133px;bottom:0;left:0;right:0;padding:0 80px}
.cover .a{color:var(--gold);font-size:44px;font-weight:700;line-height:1.7}
.cover .b{color:var(--g);font-size:74px;font-weight:700;line-height:1.5;margin:10px 0}
.cover .c{color:var(--muted);font-size:34px;line-height:1.8}
.cover .rule{width:220px;margin:34px auto}
`;

function shell() {
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div id=root></div>
<script>
${PAGINATE.toString()}
</script></body></html>`;
}

// يُنفَّذ داخل الصفحة: يوزّع الأقسام على صفحات دون حذف، ويقسم عند حدود الكلمات فقط
function PAGINATE(doc) {
  const root = document.getElementById('root'); root.innerHTML = '';
  const pages = []; let area, pageRec;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function newPage() {
    const pg = document.createElement('div'); pg.className = 'page';
    pg.innerHTML = `<div class=hdr><div class=r>بيت الفؤاد</div><div class=l>مسار الفؤاد للتدبر</div></div>
      <div class=top><h1>${doc.h1}</h1><div class=rule></div><div class=meta>${doc.meta.map(esc).join('<br>')}<span class=partx>${doc.partInMeta ? '<br>' + doc.partInMeta + ' — الجزء ٠٠/٠٠' : ''}</span></div>${doc.ctitle ? `<div class=ctitle>${esc(doc.ctitle)}</div>` : ''}</div>
      <div class=area></div><div class=ftr><div class=rule></div><div class=id></div></div>`;
    root.appendChild(pg);
    const top = pg.querySelector('.top'); pg.querySelector('.area').style.setProperty('--top', (133 + top.offsetHeight + 34) + 'px');
    area = pg.querySelector('.area'); if (doc.areaCls) area.classList.add(doc.areaCls); pageRec = { el: pg, items: [] }; pages.push(pageRec);
  }
  const over = () => area.scrollHeight > area.clientHeight + 1;
  function mk(kind, t) {
    const e = document.createElement('div');
    if (kind === 'question') { e.className = 'it qst'; e.innerHTML = `<span class=ql>سؤال للتأمل</span><span class=qt></span>`; e.querySelector('.qt').textContent = t; }
    else { e.className = 'it ' + ({ p: 'p', note: 'note', subhead: 'sub', verse: 'vs', endquote: 'endq', source: 'src', q: '', big: 'p big', sum: 'p sumbig' }[kind] ?? 'p'); e.textContent = t; }
    return e;
  }
  function addPanel(seg, cont) {
    const pn = document.createElement('div'); pn.className = 'panel ' + (seg.cls || '');
    if (seg.label) pn.innerHTML = `<div class=lab>${seg.label}${cont ? ' <span class=cont>(تابع)</span>' : ''}</div>`;
    area.appendChild(pn); return pn;
  }
  let guard = 0;
  if (!doc.segs.length) newPage();
  for (const seg of doc.segs) {
    if (!area) newPage();
    let pn = addPanel(seg, false);
    if (over()) { pn.remove(); newPage(); pn = addPanel(seg, false); }
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
        const fresh = area.children.length === 1 && !pn.querySelector('.it');
        if (++guard > 400) throw new Error('pagination loop');
        const canSplit = item.k !== 'question' && item.k !== 'subhead' && (item.k !== 'q' || fresh);
        if (canSplit && words.length > minW * 2) {
          while (lo <= hi) {
            const mid = (lo + hi) >> 1; const t = mk(item.k, words.slice(0, mid).join(' ')); pn.appendChild(t);
            const ok = !over(); t.remove(); if (ok) { best = mid; lo = mid + 1; } else hi = mid - 1;
          }
        }
        // لا يُقطع داخل قوسين {…} أو ﴿…﴾ إن أمكن
        let depth = 0; const okAt = [];
        words.forEach((w, i) => { for (const ch of w) { if (ch === '{' || ch === '﴿') depth++; if (ch === '}' || ch === '﴾') depth--; } okAt[i + 1] = depth <= 0; });
        if (item.k !== 'q') { let b2 = best; while (b2 >= minW && !okAt[b2]) b2--; if (b2 >= minW) best = b2; }
        if (best >= minW && words.length - best >= 3) {
          const head = words.slice(0, best).join(' ');
          pn.appendChild(mk(item.k, head)); pageRec.items.push({ k: item.k, t: head, seg: seg.key, split: 'head' });
          text = words.slice(best).join(' ');
        }
        if (!pn.querySelector('.it')) pn.remove();
        newPage(); pn = addPanel(seg, true);
        if (pn.querySelector('.it') === null && over()) throw new Error('panel header alone overflows');
      }
    }
  }
  const n = pages.length;
  pages.forEach((p, i) => {
    p.el.querySelector('.partx').innerHTML = doc.partInMeta ? `<br>${doc.partInMeta} — الجزء ${String(i + 1).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}/${String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}` : '';
    p.el.querySelector('.ftr .id').textContent = `${doc.id}-${String(i + 1).padStart(2, '0')}`;
  });
  // فحص القص الأفقي والرأسي
  const problems = [];
  pages.forEach((p, i) => {
    const a = p.el.querySelector('.area');
    if (a.scrollHeight > a.clientHeight + 1) problems.push(`page ${i + 1}: vertical overflow`);
    p.el.querySelectorAll('.it').forEach(e => { if (e.scrollWidth > e.clientWidth + 2) problems.push(`page ${i + 1}: horizontal overflow`); });
    // عدم تداخل الترويسة مع منطقة المحتوى
    const topB = p.el.querySelector('.top').getBoundingClientRect().bottom, areaT = a.getBoundingClientRect().top;
    if (areaT < topB) problems.push(`page ${i + 1}: header overlaps content`);
  });
  return { pages: pages.map(p => p.items), problems };
}

// ===== بناء المستندات =====
const docs = [];
const H1 = 'الحزب السابع';
const RNG = 'سورة آل عمران | الآيات ٩٢–١٧٠';
docs.push({ id: 'H07-COVER', folder: 'H07-00-INTRO', cover: true });
docs.push({ id: 'H07-DESC', folder: 'H07-00-INTRO', h1: H1, meta: [RNG], ctitle: 'وصف الحزب',
  segs: [{ key: 'desc', cls: '', label: 'وصف الحزب', items: C.desc.map(t => ({ k: 'big', t })) }] });
docs.push({ id: 'H07-MAP', folder: 'H07-00-INTRO', h1: H1, meta: [RNG], ctitle: 'خريطة المحطات المقترحة', areaCls: 'mapa',
  segs: C.map.map(r => ({ key: 'map' + r[0], cls: 'row', label: `المحطة ${r[0]}: ${r[1]}`,
    items: [{ k: 'p', t: `الآيات: ${r[2]}` }, { k: 'p', t: `البطاقات: ${r[3]}` }, { k: 'p', t: `السؤال المركزي: ${r[4]}` }] })) });
C.stations.forEach((st, si) => {
  const folder = `H07-ST${String(si + 1).padStart(2, '0')}`;
  docs.push({ id: `${folder}-OPEN`, folder, h1: H1, meta: [`المحطة ${st.n}`, `الآيات ${st.verses}`], ctitle: st.title,
    segs: [{ key: 'open', cls: '', label: 'افتتاحية المحطة', items: [{ k: 'big', t: st.opening }] },
           { key: 'sq', cls: 'd', label: 'سؤال المحطة', items: [{ k: 'big', t: st.q }] }] });
  for (const c of st.cards) {
    const segs = [{ key: 'quran', cls: 'q', label: 'القرآن الكريم', items: c.quran.map(t => ({ k: 'q', t: Qr(t), orig: t })) }];
    if (c.context.length) segs.push({ key: 'context', cls: 'ctx', label: c.context_note.replace(/:$/, ''), items: c.context.map(t => ({ k: 'q', t: Qr(t), orig: t })) });
    segs.push({ key: 'tafsir', cls: '', label: 'تفسير السعدي', items: [...c.tafsir.map(x => ({ k: x.k, t: NB(x.t), orig0: x.t })), { k: 'source', t: c.source }] });
    segs.push({ key: 'tadabbur', cls: 'd', label: 'تدبر الفؤاد', items: [...c.tadabbur.map(t => ({ k: 'p', t })), { k: 'question', t: c.question }] });
    docs.push({ id: c.id, folder, h1: H1, meta: [`المحطة ${st.n} | ${c.ref.replace('آل عمران', c.ref.includes('–') ? 'سورة آل عمران | الآيات' : 'سورة آل عمران | الآية')}`], ctitle: c.title,
      partInMeta: `البطاقة ${c.id}`, segs, card: c });
  }
});
C.summaries.forEach(s => {
  const id = 'H07-S' + s.id.slice(5).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  docs.push({ id, folder: 'H07-SUMMARY', h1: H1, meta: ['خلاصة المسار التدبّري المستخرج من H07'], ctitle: s.title,
    areaCls: 'center', segs: [{ key: 'sum', cls: 'd', label: '', items: s.lines.map(t => ({ k: 'sum', t })) }] });
});

// ===== التشغيل =====
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
fs.writeFileSync('page.html', shell());
await page.goto('file://' + path.resolve('page.html'));
await page.evaluate(() => document.fonts.ready);
const manifest = [];
for (const d of docs) {
  if (ONLY && d.id !== ONLY) continue;
  const dir = path.join(OUT, d.folder); fs.mkdirSync(dir, { recursive: true });
  if (d.cover) {
    await page.evaluate(() => {
      document.getElementById('root').innerHTML = `<div class=page><div class=hdr><div class=r>بيت الفؤاد</div><div class=l>مسار الفؤاد للتدبر</div></div>
      <div class=cover><div class=a>بلّغوا عني ولو آية</div><div class=c>مسار الفؤاد للتدبر</div><div class=rule></div>
      <div class=b>الحزب السابع</div><div class=c>سورة آل عمران</div><div class=c>الآيات ٩٢–١٧٠</div><div class=rule></div>
      <div class=c>٩ محطات · ٤٠ بطاقة</div></div><div class=ftr><div class=rule></div><div class=id>H07-COVER-01</div></div></div>`;
    });
    await page.evaluate(() => document.fonts.ready);
    const el = await page.$('.page'); const f = path.join(dir, 'H07-COVER-01.png'); await el.screenshot({ path: f });
    manifest.push({ id: d.id, file: path.relative(OUT, f), folder: d.folder, part: 1, of: 1, items: [] });
    continue;
  }
  const res = await page.evaluate(doc => PAGINATE(doc), { id: d.id, h1: d.h1, meta: d.meta, ctitle: d.ctitle, partInMeta: d.partInMeta, segs: d.segs, areaCls: d.areaCls });
  await page.evaluate(() => document.fonts.ready);
  if (res.problems.length) console.log('PROBLEMS', d.id, res.problems);
  // تحقق عدم الحذف: ضمّ الأجزاء يعيد النص الأصلي حرفًا بحرف
  const flat = res.pages.flat(); let k = 0; const errs = [];
  for (const s of d.segs) for (const it of s.items) {
    let acc = [];
    while (k < flat.length && flat[k].seg === s.key && flat[k].k === it.k) { acc.push(flat[k].t); const last = !flat[k].split; k++; if (last) break; }
    if (acc.join(' ') !== it.t) errs.push(`${s.key}: text mismatch`);
    if (it.orig0 !== undefined && it.t.replace(/\u00A0/g, ' ') !== it.orig0) errs.push('nbsp normalisation not reversible');
    if (it.orig && it.t.replace(/\u00A0/g, ' ').replace(/([^ ])([ۖ-ۜ])/g, '$1 $2') !== it.orig) errs.push('quran normalisation not reversible');
  }
  if (k !== flat.length) errs.push('extra items');
  if (errs.length) console.log('TEXT ERRORS', d.id, errs);
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) {
    const f = path.join(dir, `${d.id}-${String(i + 1).padStart(2, '0')}.png`);
    await els[i].screenshot({ path: f });
    manifest.push({ id: d.id, file: path.relative(OUT, f), folder: d.folder, part: i + 1, of: els.length, items: res.pages[i].map(x => ({ seg: x.seg, k: x.k, split: x.split || null, chars: x.t.length, head: x.t.slice(0, 40) })), problems: res.problems, textErrors: errs });
  }
  console.log(d.id, els.length);
}
await browser.close();
fs.writeFileSync(path.join(OUT, '..', ONLY ? `manifest-${ONLY}.json` : 'manifest.json'), JSON.stringify(manifest, null, 1));
