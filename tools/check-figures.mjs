/* ==========================================================================
   tools/check-figures.mjs — فحص هندسة رسوم الدروس في متصفح حقيقي.

   لماذا لا يكفي فحص النص: تراكب الوسوم وخروجها عن اللوحة لا يظهران إلا
   بعد رسم الخطوط وقياس أبعادها. والنص العربي في SVG يقلب معنى text-anchor،
   فـ start يضع x عند الحافة اليمنى لا اليسرى، وهذا وحده سبّب تراكبًا في
   رسمين قبل أن يُكتشف بالقياس.

   يطبع الأمر سطرًا لكل رسم، ويخرج بحالة فشل إن وُجد تراكب أو تجاوز.
   يحتاج خادم المعاينة يعمل على المنفذ 4178.

     node tools/preview-server.mjs &
     node tools/check-figures.mjs
   ========================================================================== */
import { lessons } from '../bayt/data/lessons/index.mjs';

const BASE = process.env.PREVIEW || 'http://127.0.0.1:4178';

/* السكربت المحقون يعمل داخل الصفحة، فيقيس ما رسمه المتصفح فعلًا. */
export const MEASURE = `(() => {
  const svg = document.querySelector('.bayt-svg');
  if (!svg) return { error: 'لا رسم في الصفحة' };
  const view = svg.getAttribute('viewBox').split(/\\s+/).map(Number);
  const [, , vw, vh] = view;
  const nodes = [...svg.querySelectorAll('text')];
  const boxes = nodes.map((t) => {
    const b = t.getBBox();
    return { txt: t.textContent.slice(0, 24), x: b.x, y: b.y, w: b.width, h: b.height };
  });
  const outside = boxes.filter((b) => b.x < 0 || b.y < 0 || b.x + b.w > vw || b.y + b.h > vh)
    .map((b) => b.txt);
  const hit = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  const overlaps = [];
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      if (hit(boxes[i], boxes[j])) overlaps.push(boxes[i].txt + ' ✕ ' + boxes[j].txt);
    }
  }
  return { count: boxes.length, outside, overlaps };
})()`;

export function report(key, result) {
  const problems = [];
  if (result.error) problems.push(`${key}: ${result.error}`);
  for (const t of result.outside ?? []) problems.push(`${key}: النص «${t}» خارج حدود اللوحة`);
  for (const o of result.overlaps ?? []) problems.push(`${key}: تراكب ${o}`);
  return problems;
}

/* يُستدعى من الجلسة عبر المتصفح المدمج؛ هنا نطبع ما يلزم فحصه فقط. */
if (process.argv[1]?.endsWith('check-figures.mjs')) {
  console.log('افحص هذه الصفحات، كلٌّ بالسكربت المصدَّر MEASURE:');
  for (const l of lessons) {
    const course = l.course === 'ma101' ? 'math' : l.course === 'phy101' ? 'physics' : 'chemistry';
    console.log(`  ${BASE}/semester-1/${course}/${l.topic}/`);
  }
}
