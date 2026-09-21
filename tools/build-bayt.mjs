/* ==========================================================================
   tools/build-bayt.mjs — يبني قسم «بيت الفؤاد».

   يولّد من bayt/data/: الصفحة الرئيسة، الرحلة، البلانر، درس الإنجليزية،
   وملف الإنجاز. إضافة مادة أو فصل لاحقًا = إدخال في journey.mjs، لا صفحة
   جديدة تُكتب بخط اليد.

   يفشل البناء إذا أشار رابط تعلّم إلى صفحة غير موجودة، حتى لا يصل الطالب
   إلى رابط مكسور. الصفحات تلتزم سياسة الأمان: لا نص برمجي ولا نمط داخل
   الصفحة، كل شيء ملفات منفصلة.
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { sections, skills, goals, statuses, suggestedHabits, days, skillById } from '../bayt/data/journey.mjs';
import { lesson } from '../bayt/data/english-process-description.mjs';
import { lesson as unitsLesson } from '../bayt/data/units-and-mass-fractions.mjs';

const root = path.resolve(import.meta.dirname, '..');
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function write(relative, html) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}

/* الصفحات التي يُنتجها هذا البنّاء نفسه. تُعدّ موجودة أثناء التحقق، وإلا لفشل
   البناء على رابط يشير إلى صفحة سيكتبها بعد سطور. */
const producedPages = new Set([
  '/bayt/', '/bayt/journey/', '/bayt/planner/',
  '/bayt/english/', '/bayt/english/process-description/',
  '/bayt/math/units-and-mass-fractions/', '/bayt/report/', '/bayt/portfolio/',
]);

const pageExists = (href) => {
  if (producedPages.has(href)) return true;
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  return fs.existsSync(path.join(root, clean, 'index.html')) || fs.existsSync(path.join(root, `${clean}.html`));
};

/* ---- تحقق قبل البناء ---- */
for (const section of sections) {
  if (!statuses[section.status]) throw new Error(`القسم ${section.id} له حالة غير معروفة: ${section.status}`);
}
for (const skill of skills) {
  if (!sections.some((s) => s.id === skill.section)) throw new Error(`المهارة ${skill.id} تشير إلى قسم غير موجود`);
}
for (const goal of goals) {
  for (const id of goal.skills) if (!skillById.has(id)) throw new Error(`الهدف ${goal.id} يشير إلى مهارة غير معروفة ${id}`);
  for (const item of goal.weekPlan) {
    if (!skillById.has(item.skill)) throw new Error(`خطة ${goal.id} تشير إلى مهارة غير معروفة ${item.skill}`);
    if (item.day < 0 || item.day >= days.length) throw new Error(`خطة ${goal.id} فيها يوم خارج الأسبوع`);
  }
}

/* ---- القالب ---- */
function shell(title, description, body, { script = null, active = '' } = {}) {
  const nav = [
    ['/bayt/', 'الرئيسة'],
    ['/bayt/journey/', 'رحلتي'],
    ['/bayt/planner/', 'البلانر'],
    ['/bayt/english/', 'الإنجليزية'],
    ['/bayt/portfolio/', 'ملف الإنجاز'],
  ].map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  return `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}"><title>${esc(title)} · بيت الفؤاد</title>
<link rel="stylesheet" href="/bayt/bayt.css"></head>
<body><a class="skip" href="#main">تخطَّ إلى المحتوى</a>
<header class="bayt-header"><a class="bayt-brand" href="/bayt/">بيت الفؤاد<span>مساحة الطالب الجامعي</span></a>
<nav class="bayt-nav" aria-label="أقسام التطبيق">${nav}</nav></header>
<main id="main" class="bayt-main">${body}</main>
<footer class="bayt-footer"><p>نموذج تجريبي. كل ما تحفظه يبقى على جهازك ولا يُرسل إلى أي خادم.</p>
<p>الكتابة التعليمية أصلية. الروابط الخارجية تشير إلى مصادرها الرسمية، ولا توجد شراكة مع أي ناشر.</p></footer>
${script ? `<script type="module" src="${script}"></script>` : ''}
</body></html>
`;
}

const badge = (status) => `<span class="badge tone-${statuses[status].tone}">${esc(statuses[status].label)}</span>`;

/* ---- الصفحة الرئيسة ---- */
const sectionCards = sections.map((s) => `<a class="section-card" href="${s.href}">
<div class="section-card-head"><h3>${esc(s.title)}</h3>${badge(s.status)}</div>
<p class="section-line">${esc(s.line)}</p><p class="section-note">${esc(s.note)}</p></a>`).join('');

const home = `<header class="bayt-hero">
<p class="eyebrow">نموذج أولي · للتجربة والملاحظات</p>
<h1>ادرس، نظّم أسبوعك، واخرج بإنجاز تعرضه.</h1>
<p class="lead">بيت الفؤاد يربط ما تتعلّمه بجدولك وبملفك المهني. تختار هدفًا، فيعرض لك المهارات التي يحتاجها، ويضع خطوات التعلّم في أسبوعك، ويحفظ ما أنجزته.</p>
<p class="hero-actions"><a class="button" href="/bayt/journey/">ابدأ من هدف</a> <a class="button ghost" href="/bayt/planner/">افتح البلانر</a></p>
</header>
<section class="chain" aria-labelledby="chain-title">
<h2 id="chain-title">كيف تتصل الأقسام</h2>
<ol class="chain-steps">
<li><strong>هدفك</strong><span>ماذا تريد أن تنجز هذا الفصل؟</span></li>
<li><strong>المهارات</strong><span>ما الذي يحتاجه هذا الهدف فعلًا؟</span></li>
<li><strong>التعلّم</strong><span>درس بشرح أولًا ثم تمرين.</span></li>
<li><strong>جدولك</strong><span>خطوات بأوقات في أسبوعك.</span></li>
<li><strong>إنجازك</strong><span>عمل محفوظ يمكنك عرضه.</span></li>
</ol></section>
<section aria-labelledby="sections-title"><h2 id="sections-title">الأقسام السبعة</h2>
<p class="section-intro">كل بطاقة تذكر حالتها الحقيقية. «قيد التطوير» تعني أن المحتوى لم يُكتب بعد، لا أنه قادم قريبًا.</p>
<div class="section-grid">${sectionCards}</div></section>
<section class="honesty" aria-labelledby="honesty-title"><h2 id="honesty-title">ما هذا النموذج وما ليس هو</h2>
<ul>
<li>البلانر وملف الإنجاز <strong>يعملان فعلًا</strong> ويحفظان على جهازك.</li>
<li>الدروس المرتبطة موجودة ومكتوبة، وعددها محدود ومذكور في كل قسم.</li>
<li>لا يصحّح التطبيق لغتك ولا يعطي درجة. مهمة الإنجليزية تُراجَع ذاتيًا بمعايير معلنة.</li>
<li>التحضير لـ IELTS لا يضمن درجة 7 ولا أي درجة.</li>
<li>لا يوجد حساب ولا خادم ولا مزامنة بين الأجهزة في هذا النموذج.</li>
</ul></section>`;

write('bayt/index.html', shell('الرئيسة', 'بيت الفؤاد: تطبيق يربط تنظيم الحياة بفهم الدراسة وبالاستعداد لسوق العمل.', home, { active: '/bayt/' }));

/* ---- الرحلة ---- */
const goalCards = goals.map((goal) => {
  const list = goal.skills.map((id) => {
    const skill = skillById.get(id);
    if (!pageExists(skill.learn.href)) throw new Error(`المهارة ${skill.id} تشير إلى صفحة غير موجودة: ${skill.learn.href}`);
    return `<li><strong>${esc(skill.title)}</strong><span>${esc(skill.why)}</span>
<a href="${skill.learn.href}">${esc(skill.learn.label)} · ${skill.learn.minutes} دقيقة ←</a></li>`;
  }).join('');
  const action = goal.weekPlan.length
    ? `<button type="button" class="button" data-add-goal="${esc(goal.id)}">أضف خطة هذا الهدف إلى أسبوعي</button>
<p class="added-note" data-added-for="${esc(goal.id)}" role="status"></p>`
    : `<p class="section-note">لا توجد خطة أسبوعية بعد، لأن دروس هذا الهدف لم تُكتب.</p>`;
  const reportLink = goal.report
    ? `<p><a class="button ghost" href="${goal.report.href}">${esc(goal.report.label)} ←</a></p>` : '';
  return `<article class="goal-card" id="${esc(goal.id)}">
<div class="section-card-head"><h3>${esc(goal.title)}</h3>${badge(goal.status)}</div>
<p class="goal-audience">${esc(goal.audience)}</p><p>${esc(goal.summary)}</p>
${list ? `<h4>المهارات التي يحتاجها</h4><ol class="skill-list">${list}</ol>` : ''}
<p class="goal-outcome"><strong>الناتج:</strong> ${esc(goal.outcome)}</p>
${reportLink}${action}</article>`;
}).join('');

const journey = `<header class="bayt-hero compact"><p class="eyebrow">الخطوة الأولى</p><h1>اختر هدفًا، وسنحوّله إلى أسبوع.</h1>
<p class="lead">الهدف ليس نية عامة. هنا يتحوّل إلى مهارات محددة، ودروس موجودة، ومهام لها أوقات في جدولك.</p></header>
<div class="goal-grid">${goalCards}</div>
<p class="section-note">إضافة الخطة تنشئ مهام حقيقية في بلانرك وتُحفظ على جهازك. يمكنك حذف أي مهمة لاحقًا.</p>`;

write('bayt/journey/index.html', shell('رحلتي', 'اختر هدفًا فيتحول إلى مهارات ودروس ومهام في جدولك.', journey, { script: '/bayt/app/journey-page.mjs', active: '/bayt/journey/' }));

/* ---- البلانر ---- */
const dayColumns = days.map((d, i) => `<section class="day-column" data-day="${i}"><h3>${esc(d)}<span class="day-date" data-day-date="${i}"></span></h3><ul class="day-tasks" data-day-list="${i}"></ul></section>`).join('');

const weekBar = `<nav class="week-bar" aria-label="التنقل بين الأسابيع">
<button type="button" class="week-step" data-week-prev aria-label="الأسبوع السابق">→</button>
<div class="week-current"><strong data-week-label></strong><span data-week-relative></span></div>
<button type="button" class="week-step" data-week-next aria-label="الأسبوع التالي">←</button>
<button type="button" class="button ghost week-today" data-week-today hidden>عُد إلى هذا الأسبوع</button>
</nav><p class="section-note" data-week-others role="status"></p>`;
const habitOptions = suggestedHabits.map((h) => `<option value="${esc(h.title)}" data-area="${esc(h.area)}">${esc(h.title)} · ${esc(h.area)}</option>`).join('');

const planner = `<header class="bayt-hero compact"><p class="eyebrow">البلانر</p><h1>أسبوعك</h1>
<p class="lead">كل أسبوع له تاريخه ومهامه وسجلّ عاداته. تنتقل بين الأسابيع دون أن يضيع ما مضى.</p></header>
${weekBar}
<div class="demo-bar" data-demo-bar hidden>
<p><strong>لديك بيانات تجريبية.</strong> العناصر المعلّمة بـ«تجريبي» أضيفت لتجربة الواجهة، وليست من إدخالك.</p>
<button type="button" class="button ghost" data-clear-demo>امسح البيانات التجريبية فقط</button></div>
<p class="storage-warning" data-storage-warning hidden>تخزين المتصفح غير متاح الآن، لذلك لن يُحفظ ما تضيفه بعد إغلاق الصفحة.</p>

<section class="planner-add" aria-labelledby="add-title"><h2 id="add-title">أضف مهمة</h2>
<form data-task-form class="row-form">
<label>المهمة <input type="text" name="title" required maxlength="120" placeholder="مثال: مراجعة موازنة المواد"></label>
<label>اليوم <select name="day">${days.map((d, i) => `<option value="${i}">${esc(d)}</option>`).join('')}</select></label>
<label>الدقائق <input type="number" name="minutes" min="5" max="240" step="5" value="30"></label>
<button type="submit" class="button">أضف</button></form></section>

<section aria-labelledby="week-title"><h2 id="week-title">الأسبوع</h2>
<p class="planner-summary" data-summary role="status"></p>
<div class="week-grid">${dayColumns}</div></section>

<section class="planner-add" aria-labelledby="habits-title"><h2 id="habits-title">العادات</h2>
<p class="section-note">علّم اليوم الذي أتممت فيه العادة. هذا سجل شخصي، لا تقييم.</p>
<form data-habit-form class="row-form">
<label>عادة <input type="text" name="title" list="habit-suggestions" required maxlength="80" placeholder="اكتب أو اختر"></label>
<datalist id="habit-suggestions">${habitOptions}</datalist>
<label>المجال <input type="text" name="area" maxlength="40" placeholder="الصحة، الدراسة، العلاقات"></label>
<button type="submit" class="button">أضف عادة</button></form>
<div class="habit-list" data-habit-list></div></section>

<section class="honesty"><h2>قيد التطوير في البلانر</h2>
<ul><li>الميزانية لم تُبنَ بعد.</li><li>تتبّع العلاقات لم يُبنَ بعد.</li><li>لا تنبيهات ولا مزامنة بين الأجهزة.</li>
<li>لا تكرار تلقائي لمهمة أسبوعية؛ تُضاف يدويًا في كل أسبوع.</li></ul></section>`;

write('bayt/planner/index.html', shell('البلانر', 'نظّم أسبوعك: مهام وعادات تُحفظ على جهازك.', planner, { script: '/bayt/app/planner-page.mjs', active: '/bayt/planner/' }));

/* ---- الإنجليزية: الفهرس ثم الدرس ---- */
const englishIndex = `<header class="bayt-hero compact"><p class="eyebrow">الإنجليزية</p><h1>اللغة الأكاديمية والكتابة التقنية</h1>
<p class="lead">درس واحد مكتمل داخل بيت الفؤاد الآن، بشرح ومثال محلول ومهمة بمراجعة ذاتية.</p></header>
<div class="section-grid">
<a class="section-card" href="/bayt/english/process-description/">
<div class="section-card-head"><h3>${esc(lesson.title)}</h3>${badge('ready')}</div>
<p class="section-line">${esc(lesson.minutes)} دقيقة · مرتبط بدرس موازنة المواد</p>
<p class="section-note">الصيغة الثابتة لوصف العملية، مثال محلول، خمسة أخطاء شائعة، ثم مهمة كتابة قصيرة.</p></a>
<a class="section-card" href="/english/">
<div class="section-card-head"><h3>مسارات الدراسة السابقة</h3>${badge('partial')}</div>
<p class="section-line">ثلاثة مسارات مستقلة: الكتاب، Educator، Pearson.</p>
<p class="section-note">فهرسة ومواد دراسية سابقة بالإنجليزية، خارج هوية بيت الفؤاد.</p></a>
</div>
<section class="honesty"><h2>عن التحضير لـ IELTS</h2>
<ul><li>الهدف المعلن هو 7 في IELTS Academic، وهو <strong>هدف وليس وعدًا</strong>.</li>
<li>لا يضمن أي تطبيق درجة. الدرجة تعتمد على مستواك ووقتك والاختبار نفسه.</li>
<li>التسجيل والمواصفات الرسمية تُؤخذ من الجهة المنظِّمة مباشرة.</li></ul></section>`;

write('bayt/english/index.html', shell('الإنجليزية', 'الكتابة التقنية واللغة الأكاديمية داخل بيت الفؤاد.', englishIndex, { active: '/bayt/english/' }));

const renderSection = (section) => {
  const body = (section.body || []).map((p) => `<p>${p}</p>`).join('');
  const table = section.table ? `<div class="table-wrap" role="region" aria-label="${esc(section.table.caption)}" tabindex="0">
<table><caption>${esc(section.table.caption)}</caption>
<thead><tr>${section.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
<tbody>${section.table.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
  const example = section.example ? `<figure class="model-answer"><figcaption>${esc(section.example.label)}</figcaption>
<p class="en" dir="ltr" lang="en">${esc(section.example.text)}</p>
<ul class="model-notes">${section.example.notes.map((n) => `<li>${n}</li>`).join('')}</ul></figure>` : '';
  return `<section class="lesson-section"><h2>${esc(section.heading)}</h2>${body}${table}${example}</section>`;
};

if (!pageExists(lesson.prerequisite.href)) throw new Error(`درس الإنجليزية يشير إلى صفحة غير موجودة: ${lesson.prerequisite.href}`);

const englishLesson = `<p class="crumb"><a href="/bayt/">بيت الفؤاد</a> / <a href="/bayt/english/">الإنجليزية</a> / ${esc(lesson.title)}</p>
<header class="bayt-hero compact"><p class="eyebrow">كتابة تقنية · ${esc(lesson.minutes)} دقيقة</p><h1>${esc(lesson.title)}</h1>
<p class="lead">${esc(lesson.intro)}</p>
<p class="prereq">قبل أن تبدأ: <a href="${lesson.prerequisite.href}">${esc(lesson.prerequisite.label)}</a> — ${esc(lesson.prerequisite.why)}</p></header>
${lesson.sections.map(renderSection).join('')}

<section class="lesson-section task" id="task"><h2>٥ · مهمتك</h2>
<p>${esc(lesson.task.prompt)}</p>
<p class="section-note">${esc(lesson.task.hint)}</p>
<form data-english-task>
<label for="answer">نصّك بالإنجليزية</label>
<textarea id="answer" name="answer" dir="ltr" lang="en" rows="6" maxlength="1200" placeholder="Two streams are fed to a mixer…"></textarea>
<p class="counter" data-counter role="status"></p>
<fieldset><legend>راجع نصّك بنفسك</legend>
${lesson.task.checklist.map((c) => `<label class="check"><input type="checkbox" name="check" value="${esc(c.id)}"> ${esc(c.text)}</label>`).join('')}
</fieldset>
<p class="section-note">التطبيق لا يصحّح لغتك. هذه القائمة معيار تحكم به على نصّك.</p>
<div class="task-actions">
<button type="button" class="button ghost" data-show-model>أظهر نموذج الإجابة</button>
<button type="submit" class="button">احفظ في ملف إنجازي</button></div>
<p class="save-note" data-save-note role="status"></p></form>

<div class="model-hidden" data-model hidden>
<figure class="model-answer"><figcaption>${esc(lesson.task.model.label)}</figcaption>
<p class="en" dir="ltr" lang="en">${esc(lesson.task.model.text)}</p>
<p>${lesson.task.model.why}</p></figure></div></section>`;

write('bayt/english/process-description/index.html', shell(lesson.title, 'درس أصلي في وصف العملية الصناعية بالإنجليزية، بشرح ومثال محلول ومهمة.', englishLesson, { script: '/bayt/app/english-task.mjs', active: '/bayt/english/' }));

/* ---- درس الوحدات والكسور الكتلية ---- */
const renderUnitsSection = (section) => {
  const body = (section.body || []).map((p) => `<p>${p}</p>`).join('');
  const table = section.table ? `<div class="table-wrap" role="region" aria-label="${esc(section.table.caption)}" tabindex="0">
<table><caption>${esc(section.table.caption)}</caption>
<thead><tr>${section.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
<tbody>${section.table.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
  const example = section.example ? `<figure class="model-answer"><figcaption>${esc(section.example.label)}</figcaption>
<ol class="worked-steps">${section.example.steps.map((s) => `<li>${s}</li>`).join('')}</ol></figure>` : '';
  return `<section class="lesson-section"><h2>${esc(section.heading)}</h2>${body}${table}${example}</section>`;
};

if (!pageExists(unitsLesson.leadsTo.href)) throw new Error(`درس الوحدات يشير إلى صفحة غير موجودة: ${unitsLesson.leadsTo.href}`);

const unitsPage = `<p class="crumb"><a href="/bayt/">بيت الفؤاد</a> / الرياضيات / ${esc(unitsLesson.title)}</p>
<header class="bayt-hero compact"><p class="eyebrow">أساسيات الحساب الهندسي · ${esc(unitsLesson.minutes)} دقيقة</p>
<h1>${esc(unitsLesson.title)}</h1><p class="lead">${esc(unitsLesson.intro)}</p>
<p class="prereq">يُستعمل مباشرة في: <a href="${unitsLesson.leadsTo.href}">${esc(unitsLesson.leadsTo.label)}</a> — ${esc(unitsLesson.leadsTo.why)}</p></header>
${unitsLesson.sections.map(renderUnitsSection).join('')}
<section class="lesson-section"><h2>٦ · تطبيق</h2>
<p class="section-note">حاول قبل أن تفتح الإجابة. الإجابات تشرح السبب لا النتيجة وحدها.</p>
<ol class="question-list">${unitsLesson.questions.map((q) => `<li><p>${q.q}</p>
<details class="reading-answer"><summary>الإجابة وسببها</summary><p>${q.a}</p></details></li>`).join('')}</ol></section>
<section class="lesson-section"><h2>الخطوة التالية</h2>
<p>معك الآن أداتا موازنة المواد. افتح <a href="${unitsLesson.leadsTo.href}">${esc(unitsLesson.leadsTo.label)}</a>، ثم اكتب تقريرك في <a href="/bayt/report/">نموذج التقرير</a>.</p></section>`;

write('bayt/math/units-and-mass-fractions/index.html', shell(unitsLesson.title, 'درس أصلي في الوحدات والكسور الكتلية، يمهّد لموازنة المواد.', unitsPage, { active: '' }));

/* ---- نموذج التقرير ---- */
const reportPage = `<p class="crumb"><a href="/bayt/">بيت الفؤاد</a> / <a href="/bayt/journey/">رحلتي</a> / التقرير</p>
<header class="bayt-hero compact"><p class="eyebrow">الناتج النهائي</p><h1 data-report-mode>تقرير موازنة مواد</h1>
<p class="lead">التقرير الواحد يجمع ثلاثة أشياء: الحساب بوحداته، والافتراضات التي بنيتَ عليها، ووصف العملية بالإنجليزية. يُحفظ كاملًا ويمكنك تعديله لاحقًا.</p>
<p class="prereq">قبل أن تبدأ: <a href="/bayt/math/units-and-mass-fractions/">الوحدات والكسور الكتلية</a> · <a href="/program/lessons/material-balances/">موازنة المواد</a> · <a href="/bayt/english/process-description/">وصف العملية بالإنجليزية</a></p></header>
<p class="storage-warning" data-storage-warning hidden>تخزين المتصفح غير متاح الآن، لذلك لن يُحفظ ما تكتبه.</p>

<form data-report-form>
<section class="lesson-section"><h2>١ · المدخلات</h2>
<p class="section-note">التدفقات بوحدة <code dir="ltr">kg/h</code>، والكسور الكتلية بين 0 و 1 بلا وحدة. لا تُدخل نسبة مئوية هنا.</p>
<div class="field-grid">
<label>تدفق التيار الأول <span class="unit">kg/h</span><input type="number" name="feedA" step="any" min="0" inputmode="decimal"></label>
<label>كسره الكتلي من المذاب <span class="unit">0–1</span><input type="number" name="fractionA" step="any" min="0" max="1" inputmode="decimal"></label>
<label>تدفق التيار الثاني <span class="unit">kg/h</span><input type="number" name="feedB" step="any" min="0" inputmode="decimal"></label>
<label>كسره الكتلي من المذاب <span class="unit">0–1</span><input type="number" name="fractionB" step="any" min="0" max="1" inputmode="decimal"></label>
</div>
<div data-live></div></section>

<section class="lesson-section"><h2>٢ · حسابك أنت</h2>
<p class="section-note">احسب بنفسك ثم أدخل نتائجك. التطبيق لا يحسب عنك؛ يقارن فقط حين تطلب.</p>
<div class="field-grid">
<label>التدفق الكلي الخارج <span class="unit">kg/h</span><input type="number" name="outTotal" step="any" inputmode="decimal"></label>
<label>تدفق المذاب الخارج <span class="unit">kg/h</span><input type="number" name="outSolute" step="any" inputmode="decimal"></label>
<label>نسبة المذاب في المخرج <span class="unit">%</span><input type="number" name="outPercent" step="any" inputmode="decimal"></label>
</div>
<p><button type="button" class="button ghost" data-check>قارن نتائجي بالحساب المرجعي</button></p>
<div class="check-box" data-check-result></div></section>

<section class="lesson-section"><h2>٣ · افتراضاتك</h2>
<p class="section-note">افتراض في كل سطر. مثال: حالة مستقرة · لا تفاعل · لا فقد مادة · الكسور كتلية لا مولية.</p>
<textarea name="assumptions" rows="4" placeholder="حالة مستقرة&#10;لا تفاعل كيميائي&#10;لا فقد مادة"></textarea></section>

<section class="lesson-section"><h2>٤ · وصف العملية بالإنجليزية</h2>
<p class="section-note">ثلاث إلى خمس جمل، بالصيغة التي درستها في <a href="/bayt/english/process-description/">درس وصف العملية</a>.</p>
<textarea name="processDescription" dir="ltr" lang="en" rows="6" maxlength="1200" placeholder="Two streams are fed to a mixer…"></textarea></section>

<section class="lesson-section"><h2>٥ · احفظ</h2>
<div class="status-key"><h3>ما الذي يسجّله التطبيق، وما الذي لا يسجّله</h3>
<ul>
<li><strong>إتمام المهمة:</strong> يسجّله. أنت سجّلت عملًا في تاريخ معلوم.</li>
<li><strong>صحة الإجابة:</strong> يسجّلها لهذه المسألة وحدها، بمقارنة أرقامك بالحساب المرجعي.</li>
<li><strong>إتقان المهارة:</strong> <em>لا يسجّله ولا يدّعيه</em>. الإتقان يحتاج مسائل مختلفة، وفاصلًا زمنيًا، وحكمًا بشريًا.</li>
</ul></div>
<p><button type="submit" class="button">احفظ التقرير في ملف إنجازي</button></p>
<p class="save-note" data-save-note role="status"></p></section>
</form>`;

write('bayt/report/index.html', shell('تقرير موازنة مواد', 'اجمع الحساب والافتراضات والوصف الإنجليزي في تقرير واحد قابل للتعديل.', reportPage, { script: '/bayt/app/report-page.mjs', active: '' }));

/* ---- ملف الإنجاز ---- */
const portfolio = `<header class="bayt-hero compact"><p class="eyebrow">المستقبل</p><h1>ملف الإنجاز</h1>
<p class="lead">ما تنجزه فعلًا، محفوظًا بصيغة تصلح للعرض على جهة تدريب أو في مقابلة.</p></header>
<div class="demo-bar" data-demo-bar hidden>
<p><strong>لديك بيانات تجريبية.</strong> العناصر المعلّمة بـ«تجريبي» ليست من إنجازك.</p>
<button type="button" class="button ghost" data-clear-demo>امسح البيانات التجريبية فقط</button></div>
<p class="storage-warning" data-storage-warning hidden>تخزين المتصفح غير متاح الآن، لذلك لن يُحفظ ما تضيفه.</p>
<section aria-labelledby="ach-title"><h2 id="ach-title">إنجازاتك</h2>
<p class="planner-summary" data-summary role="status"></p>
<div data-achievements></div></section>
<section class="planner-add"><h2>أضف إنجازًا يدويًا</h2>
<form data-achievement-form class="row-form">
<label>العنوان <input type="text" name="title" required maxlength="120" placeholder="مثال: تقرير مختبر الموائع"></label>
<label>النوع <input type="text" name="kind" maxlength="40" placeholder="تقرير، مشروع، شهادة"></label>
<button type="submit" class="button">احفظ</button></form></section>
<section class="honesty"><h2>قيد التطوير في قسم المستقبل</h2>
<ul><li>أدلة التدريب التعاوني والمهارات المهنية لم تُكتب بعد.</li>
<li>لا يوجد تصدير إلى PDF ولا رابط عام للملف في هذا النموذج.</li>
<li>يمكنك تصدير بياناتك كملف JSON للاحتفاظ بها.</li></ul>
<p><button type="button" class="button ghost" data-export>صدّر بياناتي (JSON)</button></p></section>`;

write('bayt/portfolio/index.html', shell('ملف الإنجاز', 'ما أنجزته فعلًا، محفوظًا على جهازك.', portfolio, { script: '/bayt/app/portfolio-page.mjs', active: '/bayt/portfolio/' }));

console.log(`بيت الفؤاد: ${sections.length} أقسام، ${goals.length} أهداف، ${skills.length} مهارات، 6 صفحات مبنية.`);
