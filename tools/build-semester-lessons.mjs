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
import {createHash} from 'node:crypto';
import { lessons } from '../bayt/data/lessons/index.mjs';
import { validate } from '../bayt/data/lessons/schema.mjs';
import {explorations,evaluate} from '../semester-1/assets/exploration-models.mjs';

const root = path.resolve(import.meta.dirname, '..');
const verifyOnly = process.argv.includes('--verify');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const translationVersions = JSON.parse(read('bayt/data/lessons/translation-versions.json'));
// Wording-only English changes retain progress. Any later content edit produces
// a different hash and invalidates the compatibility mapping automatically.
function questionVersion(lesson, question) {
  const hash = createHash('sha256').update(JSON.stringify(question)).digest('hex').slice(0,12);
  const compatible = translationVersions[`${lesson.course}.${lesson.topic}.${question.id}`];
  return compatible?.englishHash === hash ? compatible.compatibleVersion : hash;
}

const H = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* العربية داخل صفحة إنجليزية: كل كتلة تحمل لغتها واتجاهها، وإلا اختل الترتيب. */
const AR = 'lang="en" dir="ltr"';
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
    + `<p class="bayt-prereq-why">You need it because: ${H(p.why)}</p>`
    + `<p>${H(p.recap)}</p>`
    + (p.href ? `<p><a href="${H(p.href)}">${H(p.hrefLabel ?? "Wider article on this skill")}</a></p>` : '')
    + `</details></li>`).join('');
  const index = [
    ['#bayt-reference', "Reference explanation: definitions and relationships"],
    ['#bayt-visual', "Picture and table"],
    ['#bayt-guided', "From zero to solution, step by step"],
    ['#bayt-practice', "Question types"],
  ].map(([href, label]) => `<li><a href="${href}">${H(label)}</a></li>`).join('');

  return `<section class="bayt-intro" ${AR} aria-labelledby="bayt-intro-title">`
    + `<p class="bayt-brand">Bayt Al-Fuad</p>`
    + `<h2 id="bayt-intro-title">Before you start</h2>`
    + `<div class="bayt-grid">`
      + `<div class="bayt-card"><h3>What will you be able to do after this lesson?</h3><ul>${objectives}</ul></div>`
      + `<div class="bayt-card"><h3>What this lesson does not cover</h3><ul>${boundaries}</ul>`
        + `<p class="bayt-note">We mentioned them so that you do not think that you have completed the whole topic.</p></div>`
      + `<div class="bayt-card"><h3>Prerequisites</h3><ul>${prereq}</ul></div>`
    + `</div>`
    + `<nav class="bayt-index" aria-label="Lesson sections"><h3>Lesson index</h3><ol>${index}</ol></nav>`
  + `</section>`;
}

function reference(lesson) {
  const defs = lesson.reference.definitions.map((d) =>
    `<div class="bayt-def"><dt>${H(d.en)}</dt>`
    + `<dd>${H(d.text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</dd></div>`).join('');

  const relations = (lesson.reference.relations ?? []).map((r) =>
    `<li><span class="bayt-formula" lang="en" dir="ltr">${H(r.formula)}</span>`
    + `<span class="bayt-relation-name">${H(r.name)}</span>`
    + `<span class="bayt-relation-note">${H(r.note)}</span></li>`).join('');

  const d = lesson.reference.derivation;
  const derivation = d
    ? `<div class="bayt-derivation"><h3>${H(d.title)}</h3><p>${H(d.intro)}</p><ol>`
      + d.steps.map((s) => `<li><span class="bayt-step-do">${H(s.do)}</span>`
        + `<span class="bayt-step-why">Why: ${H(s.why)}</span></li>`).join('')
      + `</ol></div>`
    : '';

  return `<section id="bayt-reference" class="bayt-section" ${AR} aria-labelledby="bayt-reference-title">`
    + `<p class="section-label">Approach 1 · Reference</p>`
    + `<h2 id="bayt-reference-title">Definitions and relationships</h2>`
    + (lesson.reference.explanations ?? []).map(p => `<p class="bayt-explanation">${H(p)}</p>`).join('')
    + `<dl class="bayt-definitions">${defs}</dl>`
    + (relations ? `<h3>The relationships you will use</h3><ul class="bayt-relations">${relations}</ul>` : '')
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

function visual(lesson, topic) {
  const f = lesson.visual.figure;
  const video = lesson.visual.video
    ? `<p class="bayt-video"><a href="${H(lesson.visual.video.href)}" target="_blank" rel="noopener">`
      + `${H(lesson.visual.video.label)}</a> `
      + `<span class="bayt-note">${H(lesson.visual.video.note)}</span></p>`
    /* لا رابط فيديو بغير تحقق: الرابط الميت أسوأ من غيابه. */
    : '';

  return `<section id="bayt-visual" class="bayt-section" ${AR} aria-labelledby="bayt-visual-title">`
    + `<p class="section-label">Approach 2 · Visual exploration</p>`
    + `<h2 id="bayt-visual-title">${H(lesson.visual.title)}</h2>`
    + `<figure class="bayt-figure">${f.svg}<figcaption>${H(f.caption)}</figcaption></figure>`
    + `<p class="bayt-alt-note">Description of the drawing for those who do not see it: ${H(f.alt)}</p>`
    + table(lesson.visual.table)
    + (lesson.visual.reading ? `<p class="bayt-reading">${H(lesson.visual.reading)}</p>` : '')
    + video
    + exploration(topic)
  + `</section>`;
}

function exploration(topic) {
 const m=explorations[topic.key];
 if(!m) throw new Error(`Missing exploration: ${topic.key}`);
 const result=evaluate(m,m.start);
 return `<section class="bayt-exploration" data-exploration hidden><h3>${H(m.title)}</h3>`
  + `<p>${H(m.assumptions)}</p><label for="explore-value">${H(m.label)} <output data-explore-input></output></label>`
  + `<input id="explore-value" type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.start}">`
  + `<p class="bayt-explore-output">Output: <output data-explore-result dir="ltr"></output></p><p data-explore-why aria-live="polite"></p>`
  + `<table class="bayt-table"><caption>Compare the current value with its two neighbors</caption><thead><tr><th>${H(m.label)} (${H(m.unit)})</th><th>output (${H(m.resultUnit)})</th></tr></thead><tbody></tbody></table>`
  + `<button type="button">Reset values</button></section>`
  + `<noscript><p>Experiment example: ${H(m.assumptions)} At ${m.start} ${H(m.unit)}: ${H(result.value??"Undefined")} ${H(m.resultUnit)}. ${H(result.text)}</p></noscript>`;
}

function guided(lesson) {
  const examples = lesson.guided.workedExamples.map((w) =>
    `<article class="bayt-worked"><h3>${H(w.title)}</h3>`
    + `<p class="bayt-worked-task">${H(w.task)}</p><ol>`
    + w.steps.map((s) => `<li><span class="bayt-step-do">${H(s.do)}</span>`
      + `<span class="bayt-step-why">Why: ${H(s.why)}</span></li>`).join('')
    + `</ol><p class="bayt-worked-answer"><strong>Output:</strong> `
    + `<span lang="en" dir="ltr">${H(w.answer)}</span></p></article>`).join('');

  /* الأسئلة التي يتجاوزها الشرح عادة: هنا موضعها، لا في ذهن الطالب وحده. */
  const skipped = (lesson.guided.skipped ?? []).map((s) =>
    `<details class="bayt-skipped"><summary>${H(s.q)}</summary><p>${H(s.a)}</p></details>`).join('');

  return `<section id="bayt-guided" class="bayt-section" ${AR} aria-labelledby="bayt-guided-title">`
    + `<p class="section-label">Approach 3 · Step-by-step teaching</p>`
    + `<h2 id="bayt-guided-title">From zero to solution</h2>`
    + `<p class="bayt-start">${H(lesson.guided.start)}</p>`
    + examples
    + (skipped ? `<h3>Questions often left unexplained</h3>${skipped}` : '')
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
        + `<label for="${id}">Your answer${unit}</label>`
        + `<div class="answer-row">`
          + `<input id="${id}" name="answer" type="text" inputmode="decimal" autocomplete="off" required>`
          + `<button type="submit">Check</button>`
        + `</div>`
      + `</form>`
      + `<p class="feedback bayt-feedback" role="status" aria-live="polite"></p>`
      + `<button class="text-button bayt-reveal" type="button">Show the annotated solution</button>`
      + `<div class="solution bayt-solution" hidden>${H(q.solution)}</div>`
      + `<noscript><p>Answer: ${H(q.answer)} ${H(q.unit ?? '')}. ${H(q.solution)}</p></noscript>`
    + `</section>`;
  }).join('');

  return `<section id="bayt-practice" class="bayt-section" ${AR} aria-labelledby="bayt-practice-title">`
    + `<p class="section-label">Practice</p>`
    + `<h2 id="bayt-practice-title">Question types</h2>`
    + `<p>Each style examines something different. These selected patterns cover the lesson objectives, `
    + `It is not all that can be asked about the topic.</p>`
    + items
    + `<p id="bayt-summary" class="bayt-summary" role="status" aria-live="polite"></p>`
    + `<noscript><p>Automatic verification requires JavaScript. `
    + `Annotated solutions are available next to each question.</p></noscript>`
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
    if (!html.includes(anchor)) throw new Error(`${topic.key}: The course style sheet does not exist`);
    html = html.replace(anchor, anchor + sheet);
  }

  const navOld = '<a href="#learn">Learn</a><a href="#try">Check</a>';
  if (!html.includes(navOld)) throw new Error(`${topic.key}: The step bar is not present as expected`);
  html = html.replace(navOld, navOld + wrap(
    "<a href=\"#bayt-reference\">Reference</a><a href=\"#bayt-visual\">Image</a>"
    + "<a href=\"#bayt-guided\">Step by step</a><a href=\"#bayt-practice\">Practice</a>"));

  /* الفهرس والأهداف أولًا: الطالب يعرف إلى أين يمضي قبل أن يمضي. */
  const heading = '</nav></section>';
  const at = html.indexOf(heading);
  if (at < 0) throw new Error(`${topic.key}: the limit of the subject header does not exist`);
  html = html.slice(0, at + heading.length) + wrap(intro(lesson)) + html.slice(at + heading.length);

  /* الشرح الأصلي يبقى، وتضاف الطرق الثلاث بعده وقبل كتل المصادر. */
  const sources = '<section class="more-help">';
  if (!html.includes(sources)) throw new Error(`${topic.key}:Source mass does not exist`);
  html = html.replace(sources, wrap(reference(lesson) + visual(lesson, topic) + guided(lesson)) + sources);

  /* التدريب قبل خاتمة الصفحة، بعد الفحصين اللذين يحملان تقدم الطالب المحفوظ. */
  const finish = '<div class="finish">';
  if (!html.includes(finish)) throw new Error(`${topic.key}: Conclusion page not found`);
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
  if (!topic) { problems.push(`${key}: Does not agree with any topic in curriculum.json`); continue; }

  const found = validate(lesson);
  if (found.length) { problems.push(...found); continue; }

  /* بيانات الأسئلة في ملف مستقل لا داخل الصفحة: سياسة الأمان تمنع النصوص
     المضمّنة، والملف المستقل يُخزَّن مؤقتًا ويُقرأ عند الحاجة وحدها. */
  const data = {
    key: topic.key,
    questions: lesson.questionTypes.map((q) => ({
      id: q.id, version:questionVersion(lesson, q), answer: q.answer, tolerance: q.tolerance, unit: q.unit ?? '',
      solution: q.solution,
      commonErrors: q.commonErrors.map((e) => ({ value: e.value, why: e.why })),
    })),
  };
  const dataFile = path.join(root, 'semester-1/assets/bayt', `${topic.key}.json`);
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  const dataText = JSON.stringify(data, null, 1) + '\n';
  const dataBefore = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, 'utf8') : null;
  if (dataBefore !== dataText) {
    if (verifyOnly) problems.push(`${key}: Question data is not updated`);
    else { fs.writeFileSync(dataFile, dataText, 'utf8'); dataWritten += 1; }
  }

  const file = path.join(root, topic.href.slice(1), 'index.html');
  const before = fs.readFileSync(file, 'utf8');
  const after = build(before, lesson, topic);
  if (before === after) { unchanged += 1; continue; }
  if (verifyOnly) problems.push(`${key}: Page not updated — Run build None --verify`);
  else { fs.writeFileSync(file, after, 'utf8'); written += 1; }
}

if (problems.length) {
  console.error("Construction stopped:");
  for (const p of problems) console.error('  · ' + p);
  process.exit(1);
}

console.log(verifyOnly
  ? `Check: ${lessons.length} A lesson that matches what is built.`
  : `Updated pages: ${written} · Updated question files: ${dataWritten}`
    + ` Unchanged pages: ${unchanged} · Total lessons: ${lessons.length}.`);
