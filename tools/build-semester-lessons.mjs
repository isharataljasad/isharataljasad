/* ==========================================================================
   tools/build-semester-lessons.mjs

   يدمج دروس بيت الفؤاد الكاملة في صفحات الفصل الأول المنشورة.

   لماذا مولّد بدل تحرير الصفحات يدويًا: التحرير اليدوي يُمحى عند أول إعادة
   بناء. هذا المولّد يقرأ الدرس من ملف بيانات ويكتب الصفحة، فيبقى المحتوى
   بعد كل بناء. وهو جراحي: يترك الترويسة وكتل المصادر والتذييل كما هي
   حرفيًا، ويملك وحده ما يضيفه، محصورًا بين علامتين.

     node tools/build-semester-lessons.mjs            يبني
     node tools/build-semester-lessons.mjs --verify   يتحقق دون كتابة
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { lessons } from '../bayt/data/lessons/index.mjs';
import { validate } from '../bayt/data/lessons/schema.mjs';

const root = path.resolve(import.meta.dirname, '..');
const verifyOnly = process.argv.includes('--verify');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const H = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* العربية داخل صفحة إنجليزية: كل كتلة تحمل لغتها واتجاهها، وإلا اختل الترتيب. */
const AR = 'lang="ar" dir="rtl"';
const OPEN = '<!--bayt:start-->';
const CLOSE = '<!--bayt:end-->';

/* ---------- أجزاء الدرس ---------- */

function intro(lesson) {
  const objectives = lesson.objectives.map((o) => `<li>${H(o)}</li>`).join('');
  const boundaries = lesson.boundaries.map((b) => `<li>${H(b)}</li>`).join('');
  /* المتطلب يُعالَج في مكانه. الطالب الذي ينقصه لا يُرسَل بعيدًا ليضيع،
     بل يجد الترميم هنا، ثم يتابع الدرس. */
  const prereq = lesson.prerequisites.map((p) =>
    `<li><details class="bayt-prereq"><summary>${H(p.title)}</summary>`
    + `<p class="bayt-prereq-why">تحتاجه لأن: ${H(p.why)}</p>`
    + `<p>${H(p.recap)}</p>`
    + (p.href ? `<p><a href="${H(p.href)}">${H(p.hrefLabel ?? 'مادة أوسع عن هذه المهارة')}</a></p>` : '')
    + `</details></li>`).join('');
  const index = [
    ['#bayt-reference', 'الشرح المرجعي: التعريفات والعلاقات'],
    ['#bayt-visual', 'الصورة والجدول'],
    ['#bayt-guided', 'من الصفر إلى الحل، خطوة بسببها'],
    ['#bayt-practice', 'أنماط الأسئلة'],
  ].map(([href, label]) => `<li><a href="${href}">${H(label)}</a></li>`).join('');

  return `<section class="bayt-intro" ${AR} aria-labelledby="bayt-intro-title">`
    + `<p class="bayt-brand">بيت الفؤاد</p>`
    + `<h2 id="bayt-intro-title">قبل أن تبدأ</h2>`
    + `<div class="bayt-grid">`
      + `<div class="bayt-card"><h3>ماذا ستقدر عليه بعد هذا الدرس</h3><ul>${objectives}</ul></div>`
      + `<div class="bayt-card"><h3>ما لا يغطيه هذا الدرس</h3><ul>${boundaries}</ul>`
        + `<p class="bayt-note">ذكرناها حتى لا تظن أنك أتممت الموضوع كله.</p></div>`
      + `<div class="bayt-card"><h3>تحتاج هذه قبله</h3><ul>${prereq}</ul></div>`
    + `</div>`
    + `<nav class="bayt-index" aria-label="أقسام الدرس"><h3>فهرس الدرس</h3><ol>${index}</ol></nav>`
  + `</section>`;
}

function reference(lesson) {
  const defs = lesson.reference.definitions.map((d) =>
    `<div class="bayt-def"><dt>${H(d.term)} `
    + `<span class="bayt-en" lang="en" dir="ltr">${H(d.en)}</span></dt>`
    + `<dd>${H(d.text)}</dd></div>`).join('');

  const relations = (lesson.reference.relations ?? []).map((r) =>
    `<li><span class="bayt-formula" lang="en" dir="ltr">${H(r.formula)}</span>`
    + `<span class="bayt-relation-name">${H(r.name)}</span>`
    + `<span class="bayt-relation-note">${H(r.note)}</span></li>`).join('');

  const d = lesson.reference.derivation;
  const derivation = d
    ? `<div class="bayt-derivation"><h3>${H(d.title)}</h3><p>${H(d.intro)}</p><ol>`
      + d.steps.map((s) => `<li><span class="bayt-step-do">${H(s.do)}</span>`
        + `<span class="bayt-step-why">لماذا: ${H(s.why)}</span></li>`).join('')
      + `</ol></div>`
    : '';

  return `<section id="bayt-reference" class="bayt-section" ${AR} aria-labelledby="bayt-reference-title">`
    + `<p class="section-label">الطريقة الأولى · مرجع</p>`
    + `<h2 id="bayt-reference-title">التعريفات والعلاقات</h2>`
    + `<dl class="bayt-definitions">${defs}</dl>`
    + (relations ? `<h3>العلاقات التي ستستعملها</h3><ul class="bayt-relations">${relations}</ul>` : '')
    + derivation
  + `</section>`;
}

function table(t) {
  const head = t.head.map((h) => `<th scope="col">${H(h)}</th>`).join('');
  const rows = t.rows.map((r) => `<tr>${r.map((c, i) =>
    i === 0 ? `<th scope="row">${H(c)}</th>` : `<td>${H(c)}</td>`).join('')}</tr>`).join('');
  /* الجدول القابل للتمرير يحتاج أن يبلغه لوح المفاتيح، وأن يحمل اسمًا. */
  return `<div class="bayt-table-wrap" role="region" tabindex="0" aria-label="${H(t.caption)}">`
    + `<table class="bayt-table"><caption>${H(t.caption)}</caption>`
    + `<thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function visual(lesson) {
  const f = lesson.visual.figure;
  const video = lesson.visual.video
    ? `<p class="bayt-video"><a href="${H(lesson.visual.video.href)}" target="_blank" rel="noopener">`
      + `${H(lesson.visual.video.label)}</a> `
      + `<span class="bayt-note">${H(lesson.visual.video.note)}</span></p>`
    /* لا رابط فيديو بغير تحقق: الرابط الميت أسوأ من غيابه. */
    : `<p class="bayt-note">لم ندرج فيديو هنا: لم نتحقق من مقطع يغطي هذه الفكرة بهذه الرموز.</p>`;

  return `<section id="bayt-visual" class="bayt-section" ${AR} aria-labelledby="bayt-visual-title">`
    + `<p class="section-label">الطريقة الثانية · صورة وتدريب</p>`
    + `<h2 id="bayt-visual-title">${H(lesson.visual.title)}</h2>`
    + `<figure class="bayt-figure">${f.svg}<figcaption>${H(f.caption)}</figcaption></figure>`
    + `<p class="bayt-alt-note">وصف الرسم لمن لا يراه: ${H(f.alt)}</p>`
    + table(lesson.visual.table)
    + (lesson.visual.reading ? `<p class="bayt-reading">${H(lesson.visual.reading)}</p>` : '')
    + video
  + `</section>`;
}

function guided(lesson) {
  const examples = lesson.guided.workedExamples.map((w) =>
    `<article class="bayt-worked"><h3>${H(w.title)}</h3>`
    + `<p class="bayt-worked-task">${H(w.task)}</p><ol>`
    + w.steps.map((s) => `<li><span class="bayt-step-do">${H(s.do)}</span>`
      + `<span class="bayt-step-why">لماذا: ${H(s.why)}</span></li>`).join('')
    + `</ol><p class="bayt-worked-answer"><strong>الناتج:</strong> `
    + `<span lang="en" dir="ltr">${H(w.answer)}</span></p></article>`).join('');

  /* الأسئلة التي يتجاوزها الشرح عادة: هنا موضعها، لا في ذهن الطالب وحده. */
  const skipped = (lesson.guided.skipped ?? []).map((s) =>
    `<details class="bayt-skipped"><summary>${H(s.q)}</summary><p>${H(s.a)}</p></details>`).join('');

  return `<section id="bayt-guided" class="bayt-section" ${AR} aria-labelledby="bayt-guided-title">`
    + `<p class="section-label">الطريقة الثالثة · متدرج</p>`
    + `<h2 id="bayt-guided-title">من الصفر إلى الحل</h2>`
    + `<p class="bayt-start">${H(lesson.guided.start)}</p>`
    + examples
    + (skipped ? `<h3>أسئلة يتجاوزها الشرح عادة</h3>${skipped}` : '')
  + `</section>`;
}

function practice(lesson, topic) {
  const items = lesson.questionTypes.map((q) => {
    const id = `bayt-${q.id}`;
    const unit = q.unit ? ` <span class="bayt-unit" lang="en" dir="ltr">(${H(q.unit)})</span>` : '';
    return `<section class="bayt-check" data-bayt-check="${H(q.id)}" data-topic-key="${H(topic.key)}">`
      + `<h3>${H(q.family)}</h3>`
      + `<p class="bayt-aim">${H(q.aim)}</p>`
      + `<p class="bayt-prompt">${H(q.prompt)}</p>`
      + `<form data-bayt-question="${H(q.id)}">`
        + `<label for="${id}">إجابتك${unit}</label>`
        + `<div class="answer-row">`
          + `<input id="${id}" name="answer" type="text" inputmode="decimal" autocomplete="off" required>`
          + `<button type="submit">تحقق</button>`
        + `</div>`
      + `</form>`
      + `<p class="feedback bayt-feedback" role="status" aria-live="polite"></p>`
      + `<button class="text-button bayt-reveal" type="button">اعرض الحل المشروح</button>`
      + `<div class="solution bayt-solution" hidden></div>`
    + `</section>`;
  }).join('');

  return `<section id="bayt-practice" class="bayt-section" ${AR} aria-labelledby="bayt-practice-title">`
    + `<p class="section-label">تدرب</p>`
    + `<h2 id="bayt-practice-title">أنماط الأسئلة</h2>`
    + `<p>كل نمط يفحص شيئًا مختلفًا. هذه أنماط مختارة تغطي أهداف الدرس، `
    + `وليست كل ما يمكن أن يُسأل عنه الموضوع.</p>`
    + items
    + `<p id="bayt-summary" class="bayt-summary" role="status" aria-live="polite"></p>`
    + `<noscript><p>التحقق التلقائي يحتاج جافاسكربت. `
    + `الحلول المشروحة مذكورة في الشرح أعلاه.</p></noscript>`
  + `</section>`;
}

/* ---------- الدمج في الصفحة ---------- */

function build(html, lesson, topic) {
  /* أزل ناتج بناء سابق حتى تبقى العملية قابلة للتكرار بلا تراكم. */
  html = html.replace(new RegExp(`${OPEN}[\\s\\S]*?${CLOSE}`, 'g'), '');
  const wrap = (s) => OPEN + s + CLOSE;

  /* ورقة الأنماط خارجية: سياسة الأمان تمنع الأنماط المضمّنة بلا بصمة. */
  const sheet = '<link rel="stylesheet" href="/semester-1/assets/bayt-lesson.css">';
  if (!html.includes(sheet)) {
    const anchor = '<link rel="stylesheet" href="/semester-1/assets/curriculum.css">';
    if (!html.includes(anchor)) throw new Error(`${topic.key}: ورقة أنماط المقرر غير موجودة`);
    html = html.replace(anchor, anchor + sheet);
  }

  const navOld = '<a href="#learn">Learn</a><a href="#try">Check</a>';
  if (!html.includes(navOld)) throw new Error(`${topic.key}: شريط الخطوات غير موجود كما هو متوقع`);
  html = html.replace(navOld, navOld + wrap(
    '<a href="#bayt-reference">مرجع</a><a href="#bayt-visual">صورة</a>'
    + '<a href="#bayt-guided">متدرج</a><a href="#bayt-practice">تدرب</a>'));

  /* الفهرس والأهداف أولًا: الطالب يعرف إلى أين يمضي قبل أن يمضي. */
  const heading = '</nav></section>';
  const at = html.indexOf(heading);
  if (at < 0) throw new Error(`${topic.key}: نهاية ترويسة الموضوع غير موجودة`);
  html = html.slice(0, at + heading.length) + wrap(intro(lesson)) + html.slice(at + heading.length);

  /* الشرح الأصلي يبقى، وتضاف الطرق الثلاث بعده وقبل كتل المصادر. */
  const sources = '<section class="more-help">';
  if (!html.includes(sources)) throw new Error(`${topic.key}: كتلة المصادر غير موجودة`);
  html = html.replace(sources, wrap(reference(lesson) + visual(lesson) + guided(lesson)) + sources);

  /* التدريب قبل خاتمة الصفحة، بعد الفحصين اللذين يحملان تقدم الطالب المحفوظ. */
  const finish = '<div class="finish">';
  if (!html.includes(finish)) throw new Error(`${topic.key}: خاتمة الصفحة غير موجودة`);
  html = html.replace(finish, wrap(practice(lesson, topic)) + finish);

  return html;
}

/* ---------- التشغيل ---------- */

const curriculum = JSON.parse(read('semester-1/curriculum.json'));
const topics = new Map();
for (const course of curriculum.courses) {
  for (const t of course.topics) topics.set(`${course.id}.${t.id}`, t);
}

const problems = [];
let written = 0;
let unchanged = 0;
let dataWritten = 0;

for (const lesson of lessons) {
  const key = `${lesson.course}.${lesson.topic}`;
  const topic = topics.get(key);
  if (!topic) { problems.push(`${key}: لا يوافق أي موضوع في curriculum.json`); continue; }

  const found = validate(lesson);
  if (found.length) { problems.push(...found); continue; }

  /* بيانات الأسئلة في ملف مستقل لا داخل الصفحة: سياسة الأمان تمنع النصوص
     المضمّنة، والملف المستقل يُخزَّن مؤقتًا ويُقرأ عند الحاجة وحدها. */
  const data = {
    key: topic.key,
    questions: lesson.questionTypes.map((q) => ({
      id: q.id, answer: q.answer, tolerance: q.tolerance, unit: q.unit ?? '',
      solution: q.solution,
      commonErrors: q.commonErrors.map((e) => ({ value: e.value, why: e.why })),
    })),
  };
  const dataFile = path.join(root, 'semester-1/assets/bayt', `${topic.key}.json`);
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  const dataText = JSON.stringify(data, null, 1) + '\n';
  const dataBefore = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, 'utf8') : null;
  if (dataBefore !== dataText) {
    if (verifyOnly) problems.push(`${key}: بيانات الأسئلة غير محدّثة`);
    else { fs.writeFileSync(dataFile, dataText, 'utf8'); dataWritten += 1; }
  }

  const file = path.join(root, topic.href.slice(1), 'index.html');
  const before = fs.readFileSync(file, 'utf8');
  const after = build(before, lesson, topic);
  if (before === after) { unchanged += 1; continue; }
  if (verifyOnly) problems.push(`${key}: الصفحة غير محدثة — شغل البناء بلا ‎--verify`);
  else { fs.writeFileSync(file, after, 'utf8'); written += 1; }
}

if (problems.length) {
  console.error('توقف البناء:');
  for (const p of problems) console.error('  · ' + p);
  process.exit(1);
}

console.log(verifyOnly
  ? `تحقق: ${lessons.length} درسًا مطابقة لما هو مبني.`
  : `صفحات محدَّثة: ${written} · ملفات أسئلة محدَّثة: ${dataWritten}`
    + ` · صفحات بلا تغيير: ${unchanged} · مجموع الدروس: ${lessons.length}.`);
