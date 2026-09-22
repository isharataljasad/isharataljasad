/* ==========================================================================
   tools/audit-semester1.mjs — جدول تغطية الفصل الأول.

   يقيس ما هو موجود فعلًا في كل موضوع، لا ما يوحي به العنوان أو الفهرس.
   ثلاثة محاور، كما طُلبت:

     المرجعي   — تعريفات وعلاقات واشتقاق، مكتوبة أصلًا لبيت الفؤاد.
     البصري    — رسم أصلي، جدول، تفاعل، فيديو متحقق، تغذية راجعة تفسّر الخطأ.
     المتدرّج  — بداية واضحة، متطلبات موصولة بشروحها، خطوات بأسبابها.

   قاعدة الحساب: المحتوى المدمج من مصادر خارجية داخل <details> لا يُحسب
   تأليفًا لبيت الفؤاد، وصور المعادلات من مجلدات الناشرين لا تُحسب رسومًا
   أصلية. لذلك يفصل التقرير «أصلي» عن «مدمج».
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const curriculum = JSON.parse(read('semester-1/curriculum.json'));

/* دروس بيت الفؤاد الكاملة، إن وُجدت. */
let baytLessons = new Map();
try {
  const mod = await import('../bayt/data/lessons/index.mjs');
  baytLessons = new Map(mod.lessons.map((l) => [`${l.course}.${l.topic}`, l]));
} catch { /* لم يُبنَ بعد */ }

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => (s ? s.split(/\s+/).filter(Boolean).length : 0);

/* الحدّ الأدنى ليُعدّ المحور مكتملًا. مبني على ما تتطلبه المراجعة، لا على رقم اعتباطي. */
const MIN = { referenceWords: 350, questionTypes: 4, workedSteps: 3 };

const rows = [];
for (const course of curriculum.courses) {
  for (const topic of course.topics) {
    const file = path.join(root, topic.href.slice(1), 'index.html');
    const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];

    /* الشرح الأصلي في الصفحة القائمة: الفكرة + المثال + السياق فقط. */
    const originalWords = words(topic.idea) + words(topic.example) + words(topic.context);
    /* المدمج: كل ما تحت «مزيد من المساعدة» مصدره خارجي. */
    const helpIndex = main.search(/Need more help|مزيد من المساعدة/i);
    const embeddedWords = helpIndex > -1 ? words(strip(main.slice(helpIndex))) : 0;

    /* الرسوم: تُحسب أصلية فقط إذا لم تأتِ من مجلدات المصادر. */
    const allImages = [...main.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    const publisherImages = allImages.filter((s) => /\/(educator|pearson|book)\//.test(s)).length;
    const originalFigures = (main.match(/<svg[ >]/g) || []).length + (allImages.length - publisherImages);

    const bayt = baytLessons.get(`${course.id}.${topic.id}`) || null;

    /* قِس ما يُعرض فعلًا على الصفحة، لا عيّنة من الحقول. العدّ من عيّنة
       يُظهر الدرس أفقر مما هو، ويخفي في حالات أخرى قسمًا فارغًا. */
    const section = (from, to) => {
      const a = main.indexOf(`id="${from}"`);
      if (a < 0) return '';
      const b = to ? main.indexOf(`id="${to}"`) : -1;
      return main.slice(a, b > a ? b : undefined);
    };
    const referenceBlock = section('bayt-reference', 'bayt-visual');
    const visualBlock = section('bayt-visual', 'bayt-guided');
    const reference = bayt ? words(strip(referenceBlock)) : originalWords;

    const questionTypes = bayt ? (bayt.questionTypes?.length || 0) : ['diagnostic', 'transfer'].filter((k) => topic[k]).length;
    const explainedFeedback = bayt
      ? (bayt.questionTypes || []).every((q) => (q.commonErrors || []).length > 0)
      : false;
    /* الرسم الأصلي يُعدّ من القسم البصري وحده، وإلا خلطناه بصور الناشرين. */
    const figures = bayt
      ? (visualBlock.match(/<svg[ >]/g) || []).length
      : originalFigures;
    const tables = (main.match(/<table[ >]/g) || []).length;
    const prereq = bayt ? (bayt.prerequisites?.length || 0) : (topic.foundationSkills || []).length;
    const workedSteps = bayt ? (bayt.guided?.workedExamples || []).reduce((n, w) => n + (w.steps?.length || 0), 0) : 1;
    const objectives = bayt ? (bayt.objectives?.length || 0) : 0;

    const axis = {
      /* المرجعي يكتمل بتعريفات وعلاقات مكتوبة، لا بفقرة واحدة. */
      reference: reference >= MIN.referenceWords && (bayt?.reference?.definitions?.length || 0) >= 2,
      /* البصري يكتمل برسم أصلي وتغذية راجعة تفسّر الخطأ. */
      visual: figures >= 1 && explainedFeedback,
      /* المتدرّج يكتمل ببداية ومتطلبات وخطوات بأسبابها. */
      guided: Boolean(bayt?.guided?.start) && prereq >= 1 && workedSteps >= MIN.workedSteps,
      questions: questionTypes >= MIN.questionTypes,
    };
    const done = Object.values(axis).filter(Boolean).length;
    const state = done === 4 ? 'مكتمل' : done === 0 ? 'ناقص' : 'جزئي';

    rows.push({
      course: course.code, courseId: course.id, topic: topic.id, title: topic.title,
      evidence: topic.evidence, state, axis,
      originalWords, embeddedWords, originalFigures: figures, publisherImages,
      tables, prereq, questionTypes, explainedFeedback, objectives, workedSteps,
      bayt: Boolean(bayt),
    });
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log('المادة    الموضوع             الحالة   مرجعي بصري متدرّج أسئلة | أصلي مدمج رسوم(أصلي/ناشر) جداول أنماط');
console.log('─'.repeat(112));
for (const r of rows) {
  const mark = (b) => (b ? ' ✓  ' : ' ✗  ');
  console.log(
    pad(r.course, 9) + pad(r.topic, 20) + pad(r.state, 8) +
    mark(r.axis.reference) + mark(r.axis.visual) + mark(r.axis.guided) + mark(r.axis.questions) +
    '| ' + pad(r.originalWords, 5) + pad(r.embeddedWords, 5) +
    pad(`${r.originalFigures}/${r.publisherImages}`, 16) + pad(r.tables, 6) + r.questionTypes
  );
}

console.log('\n═══ ملخّص لكل مادة ═══');
const summary = [];
for (const course of curriculum.courses) {
  const r = rows.filter((x) => x.courseId === course.id);
  const s = { code: course.code, total: r.length,
    complete: r.filter((x) => x.state === 'مكتمل').length,
    partial: r.filter((x) => x.state === 'جزئي').length,
    missing: r.filter((x) => x.state === 'ناقص').length,
    evidence: r[0]?.evidence };
  summary.push(s);
  console.log(`${pad(s.code, 9)} ${s.total} مواضيع → مكتمل ${s.complete} · جزئي ${s.partial} · ناقص ${s.missing}`);
  console.log(`${' '.repeat(9)} مصدر المواضيع: ${s.evidence}`);
}

const totals = summary.reduce((a, s) => ({ total: a.total + s.total, complete: a.complete + s.complete, partial: a.partial + s.partial, missing: a.missing + s.missing }), { total: 0, complete: 0, partial: 0, missing: 0 });
console.log(`\nالإجمالي: ${totals.total} موضوعًا → مكتمل ${totals.complete} · جزئي ${totals.partial} · ناقص ${totals.missing}`);

fs.writeFileSync(path.join(root, 'semester-1/coverage.json'),
  JSON.stringify({ generatedOn: new Date().toISOString().slice(0, 10), criteria: MIN, summary, topics: rows }, null, 1) + '\n', 'utf8');
console.log('كُتب التقرير إلى semester-1/coverage.json');
