/* ==========================================================================
   tools/build-bayt.mjs — يبني قسم «بيت الفؤاد».

   يولّد من bayt/data/: الصفحة الرئيسة، الرحلة، التخطيط، درس الإنجليزية،
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
  if (!statuses[section.status]) throw new Error(`Section ${section.id} His condition is unknown: ${section.status}`);
}
for (const skill of skills) {
  if (!sections.some((s) => s.id === skill.section)) throw new Error(`Skill ${skill.id} Indicates a partition that does not exist`);
}
for (const goal of goals) {
  for (const id of goal.skills) if (!skillById.has(id)) throw new Error(`Goal ${goal.id} Indicates an unknown skill ${id}`);
  for (const item of goal.weekPlan) {
    if (!skillById.has(item.skill)) throw new Error(`Plan ${goal.id} Indicates an unknown skill ${item.skill}`);
    if (item.day < 0 || item.day >= days.length) throw new Error(`Plan ${goal.id} It has a day outside the week`);
  }
}

/* ---- القالب ---- */
function shell(title, description, body, { script = null, active = '' } = {}) {
  const nav = [
    ['/bayt/', "Home"],
    ['/bayt/journey/', "My learning journey"],
    ['/bayt/planner/', "Planning"],
    ['/bayt/english/', "English"],
    ['/bayt/portfolio/', "Portfolio"],
  ].map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  return `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}"><title>${esc(title)} · Bayt Al-Fuad</title>
<link rel="stylesheet" href="/bayt/bayt.css"></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="bayt-header"><a class="bayt-brand" href="/bayt/">Bayt Al-Fuad<span>University student space</span></a>
<nav class="bayt-nav" aria-label="Application sections">${nav}</nav></header>
<main id="main" class="bayt-main">${body}</main>
<footer class="bayt-footer"><p>Experimental model. Everything you save stays on your device and is not sent to any server.</p>
<p>Original educational writing. External links refer to their official sources, and there is no partnership with any publisher.</p></footer>
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
<p class="eyebrow">Prototype · for experimentation and feedback</p>
<h1>Study, organize your week, and come away with an accomplishment to showcase.</h1>
<p class="lead">Bayt Al-Fuad links what you learn to your schedule and professional profile. You choose a goal, it shows you the skills it needs, lays out the learning steps for your week, and saves what you've accomplished.</p>
<p class="hero-actions"><a class="button" href="/bayt/journey/">Start with a goal</a> <a class="button ghost" href="/bayt/planner/">Open planner</a></p>
<p><a href="/semester-1/coverage/">Browse first semester lessons in mathematics, physics, and chemistry →</a></p>
</header>
<section class="chain" aria-labelledby="chain-title">
<h2 id="chain-title">How are the departments connected?</h2>
<ol class="chain-steps">
<li><strong>Your goal</strong><span>What do you want to accomplish this semester?</span></li>
<li><strong>Skills</strong><span>What does this target actually need?</span></li>
<li><strong>Learning</strong><span>Lesson with explanation first, then practice.</span></li>
<li><strong>Your schedule</strong><span>Steps and times in your week.</span></li>
<li><strong>Your achievement</strong><span>Saved work that you can view.</span></li>
</ol></section>
<section aria-labelledby="sections-title"><h2 id="sections-title">The seven sections</h2>
<p class="section-intro">Each card states its true state. “In development” means that the content has not been written yet, not that it is coming soon.</p>
<div class="section-grid">${sectionCards}</div></section>
<section class="honesty" aria-labelledby="honesty-title"><h2 id="honesty-title">What this model is and what it is not</h2>
<ul>
<li>Time and study organizer and achievement file <strong>They really work</strong> They are saved on your device.</li>
<li>The associated lessons are available and written, and their number is limited and mentioned in each section.</li>
<li>The app does not correct your language and does not give a grade. The English assignment is self-reviewed with stated criteria.</li>
<li>Preparation for IELTS does not guarantee a grade for 7 nor any grade.</li>
<li>There is no account, no server, and no syncing between devices in this model.</li>
</ul></section>`;

write('bayt/index.html', shell("Home", "Bayt Al-Fuad: An application that links life organization with understanding study and preparing for the labor market.", home, { active: '/bayt/' }));

/* ---- الرحلة ---- */
const goalCards = goals.map((goal) => {
  const list = goal.skills.map((id) => {
    const skill = skillById.get(id);
    if (!pageExists(skill.learn.href)) throw new Error(`Skill ${skill.id} Refers to a non-existent page: ${skill.learn.href}`);
    return `<li><strong>${esc(skill.title)}</strong><span>${esc(skill.why)}</span>
<a href="${skill.learn.href}">${esc(skill.learn.label)} · ${skill.learn.minutes} Minute →</a></li>`;
  }).join('');
  const action = goal.weekPlan.length
    ? `<button type="button" class="button" data-add-goal="${esc(goal.id)}">Add this goal plan to my week</button>
<p class="added-note" data-added-for="${esc(goal.id)}" role="status"></p>`
    : `<p class="section-note">There is no weekly plan yet, because the lessons for this goal have not been written.</p>`;
  const reportLink = goal.report
    ? `<p><a class="button ghost" href="${goal.report.href}">${esc(goal.report.label)} ←</a></p>` : '';
  return `<article class="goal-card" id="${esc(goal.id)}">
<div class="section-card-head"><h3>${esc(goal.title)}</h3>${badge(goal.status)}</div>
<p class="goal-audience">${esc(goal.audience)}</p><p>${esc(goal.summary)}</p>
${list ? `<h4>The skills he needs</h4><ol class="skill-list">${list}</ol>` : ''}
<p class="goal-outcome"><strong>Output:</strong> ${esc(goal.outcome)}</p>
${reportLink}${action}</article>`;
}).join('');

const journey = `<header class="bayt-hero compact"><p class="eyebrow">First step</p><h1>Pick a goal, and we'll turn it into a week.</h1>
<p class="lead">The goal is not a general intention. Here it turns into specific skills, existing lessons, and tasks that have times in your schedule.</p></header>
<div class="goal-grid">${goalCards}</div>
<p class="section-note">Add Plan creates real tasks in your weekly schedule and saves them on your device. You can delete any task later.</p>`;

write('bayt/journey/index.html', shell("My learning journey", "Choose a goal and it turns into skills, lessons, and tasks on your schedule.", journey, { script: '/bayt/app/journey-page.mjs', active: '/bayt/journey/' }));

/* ---- التخطيط ---- */
const dayColumns = days.map((d, i) => `<section class="day-column" data-day="${i}"><h3>${esc(d)}<span class="day-date" data-day-date="${i}"></span></h3><ul class="day-tasks" data-day-list="${i}"></ul></section>`).join('');

const weekBar = `<nav class="week-bar" aria-label="Moving between weeks">
<button type="button" class="week-step" data-week-prev aria-label="The previous week">→</button>
<div class="week-current"><strong data-week-label></strong><span data-week-relative></span></div>
<button type="button" class="week-step" data-week-next aria-label="Next week">←</button>
<button type="button" class="button ghost week-today" data-week-today hidden>Back to this week</button>
</nav><p class="section-note" data-week-others role="status"></p>`;
const habitOptions = suggestedHabits.map((h) => `<option value="${esc(h.title)}" data-area="${esc(h.area)}">${esc(h.title)} · ${esc(h.area)}</option>`).join('');

const planner = `<header class="bayt-hero compact"><p class="eyebrow">Planning</p><h1>Your week</h1>
<p class="lead">Each week has its own history, tasks, and record of customs. You move between weeks without losing what passed.</p></header>
${weekBar}
<div class="demo-bar" data-demo-bar hidden>
<p><strong>You have experimental data.</strong> Items marked “experimental” were added to test the interface, and are not your input.</p>
<button type="button" class="button ghost" data-clear-demo>Clear demo data only</button></div>
<p class="storage-warning" data-storage-warning hidden>Browser storage is offline right now, so what you add won't be saved after you close the page.</p>

<section class="planner-add" aria-labelledby="add-title"><h2 id="add-title">Add a task</h2>
<form data-task-form class="row-form">
<label>Task <input type="text" name="title" required maxlength="120" placeholder="Example: material balance review"></label>
<label>Day <select name="day">${days.map((d, i) => `<option value="${i}">${esc(d)}</option>`).join('')}</select></label>
<label>Minutes <input type="number" name="minutes" min="5" max="240" step="5" value="30"></label>
<button type="submit" class="button">Add</button></form></section>

<section aria-labelledby="week-title"><h2 id="week-title">week</h2>
<p class="planner-summary" data-summary role="status"></p>
<div class="week-grid">${dayColumns}</div></section>

<section class="planner-add" aria-labelledby="habits-title"><h2 id="habits-title">Habits</h2>
<p class="section-note">Mark the day you completed the habit. This is a personal record, not an evaluation.</p>
<form data-habit-form class="row-form">
<label>Habit <input type="text" name="title" list="habit-suggestions" required maxlength="80" placeholder="Type or choose"></label>
<datalist id="habit-suggestions">${habitOptions}</datalist>
<label>Domain <input type="text" name="area" maxlength="40" placeholder="Health, study, relationships"></label>
<button type="submit" class="button">Add habit</button></form>
<div class="habit-list" data-habit-list></div></section>

<section class="honesty"><h2>Under development in planning</h2>
<ul><li>The budget has not yet been built.</li><li>Relationship tracking is not built yet.</li><li>No alerts and no syncing between devices.</li>
<li>No automatic repetition of a weekly task; Added manually every week.</li></ul></section>`;

write('bayt/planner/index.html', shell("Planning", "Organize your week: tasks and habits saved on your device.", planner, { script: '/bayt/app/planner-page.mjs', active: '/bayt/planner/' }));

/* ---- الإنجليزية: الفهرس ثم الدرس ---- */
const englishIndex = `<header class="bayt-hero compact"><p class="eyebrow">English</p><h1>Academic language and technical writing</h1>
<p class="lead">One completed lesson in Bayt Al-Fuad now, with an explanation, a solved example, and a self-review task.</p></header>
<div class="section-grid">
<a class="section-card" href="/bayt/english/process-description/">
<div class="section-card-head"><h3>${esc(lesson.title)}</h3>${badge('ready')}</div>
<p class="section-line">${esc(lesson.minutes)} Minutes · Related to the lesson on material balance</p>
<p class="section-note">The fixed format for describing the process, a solved example, five common mistakes, and then a short writing assignment.</p></a>
<a class="section-card" href="/english/">
<div class="section-card-head"><h3>Previous study paths</h3>${badge('partial')}</div>
<p class="section-line">Three independent tracks: Book, Educator, Pearson.</p>
<p class="section-note">Cataloging and previous study materials in English, outside the identity of Bayt Al-Fuad.</p></a>
</div>
<section class="honesty"><h2>About preparing for IELTS</h2>
<ul><li>The stated target is 7 in IELTS Academic, which is <strong>A goal, not a promise</strong>.</li>
<li>No application guarantees a degree. The score depends on your level, time and the test itself.</li>
<li>Registration and official specifications are taken directly from the organizing body.</li></ul></section>`;

write('bayt/english/index.html', shell("English", "Technical writing and academic language within Beit Al-Fouad.", englishIndex, { active: '/bayt/english/' }));

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

if (!pageExists(lesson.prerequisite.href)) throw new Error(`English lesson points to a page that does not exist: ${lesson.prerequisite.href}`);

const englishLesson = `<p class="crumb"><a href="/bayt/">Bayt Al-Fuad</a> / <a href="/bayt/english/">English</a> / ${esc(lesson.title)}</p>
<header class="bayt-hero compact"><p class="eyebrow">Technical writing · ${esc(lesson.minutes)} Minute</p><h1>${esc(lesson.title)}</h1>
<p class="lead">${esc(lesson.intro)}</p>
<p class="prereq">Before you start: <a href="${lesson.prerequisite.href}">${esc(lesson.prerequisite.label)}</a> — ${esc(lesson.prerequisite.why)}</p></header>
${lesson.sections.map(renderSection).join('')}

<section class="lesson-section task" id="task"><h2>5 · Your mission</h2>
<p>${esc(lesson.task.prompt)}</p>
<p class="section-note">${esc(lesson.task.hint)}</p>
<form data-english-task>
<label for="answer">Your text in English</label>
<textarea id="answer" name="answer" dir="ltr" lang="en" rows="6" maxlength="1200" placeholder="Two streams are fed to a mixer…"></textarea>
<p class="counter" data-counter role="status"></p>
<fieldset><legend>Review your text yourself</legend>
${lesson.task.checklist.map((c) => `<label class="check"><input type="checkbox" name="check" value="${esc(c.id)}"> ${esc(c.text)}</label>`).join('')}
</fieldset>
<p class="section-note">The application does not correct your language. This list is a criterion by which you can control your text.</p>
<div class="task-actions">
<button type="button" class="button ghost" data-show-model>Show sample answer</button>
<button type="submit" class="button">Save in my achievement file</button></div>
<p class="save-note" data-save-note role="status"></p></form>

<div class="model-hidden" data-model hidden>
<figure class="model-answer"><figcaption>${esc(lesson.task.model.label)}</figcaption>
<p class="en" dir="ltr" lang="en">${esc(lesson.task.model.text)}</p>
<p>${lesson.task.model.why}</p></figure></div></section>`;

write('bayt/english/process-description/index.html', shell(lesson.title, "An original lesson in describing the industrial process in English, with an explanation, example, solution and task.", englishLesson, { script: '/bayt/app/english-task.mjs', active: '/bayt/english/' }));

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

if (!pageExists(unitsLesson.leadsTo.href)) throw new Error(`Units lesson refers to a page that does not exist: ${unitsLesson.leadsTo.href}`);

const unitsPage = `<p class="crumb"><a href="/bayt/">Bayt Al-Fuad</a> /Mathematics/ ${esc(unitsLesson.title)}</p>
<header class="bayt-hero compact"><p class="eyebrow">Basics of engineering calculation ${esc(unitsLesson.minutes)} Minute</p>
<h1>${esc(unitsLesson.title)}</h1><p class="lead">${esc(unitsLesson.intro)}</p>
<p class="prereq">Used directly in: <a href="${unitsLesson.leadsTo.href}">${esc(unitsLesson.leadsTo.label)}</a> — ${esc(unitsLesson.leadsTo.why)}</p></header>
${unitsLesson.sections.map(renderUnitsSection).join('')}
<section class="lesson-section"><h2>6 · Application</h2>
<p class="section-note">Try before you open the answer. The answers explain the cause, not the effect alone.</p>
<ol class="question-list">${unitsLesson.questions.map((q) => `<li><p>${q.q}</p>
<details class="reading-answer"><summary>The answer and its reason</summary><p>${q.a}</p></details></li>`).join('')}</ol></section>
<section class="lesson-section"><h2>Next step</h2>
<p>You now have two material balance tools. Open <a href="${unitsLesson.leadsTo.href}">${esc(unitsLesson.leadsTo.label)}</a>, then write your report in <a href="/bayt/report/">Report template</a>.</p></section>`;

write('bayt/math/units-and-mass-fractions/index.html', shell(unitsLesson.title, "An original lesson on mass units and fractions, paving the way for material balance.", unitsPage, { active: '' }));

/* ---- نموذج التقرير ---- */
const reportPage = `<p class="crumb"><a href="/bayt/">Bayt Al-Fuad</a> / <a href="/bayt/journey/">My learning journey</a> / report</p>
<header class="bayt-hero compact"><p class="eyebrow">Final output</p><h1 data-report-mode>Material balance report</h1>
<p class="lead">One report brings together three things: the calculation with its units, the assumptions on which you built it, and a description of the process in English. It is saved complete and you can edit it later.</p>
<p class="prereq">Before you start: <a href="/bayt/math/units-and-mass-fractions/">Units and mass fractions</a> · <a href="/program/lessons/material-balances/">Material balance</a> · <a href="/bayt/english/process-description/">Description of the process in English</a></p></header>
<p class="storage-warning" data-storage-warning hidden>Browser storage is currently unavailable, so what you type will not be saved.</p>

<form data-report-form>
<section class="lesson-section"><h2>1 · Inputs</h2>
<p class="section-note">Unit flows <code dir="ltr">kg/h</code>, the mass fractions between 0 and 1 are unitless. Do not enter a percentage here.</p>
<div class="field-grid">
<label>The first stream flow <span class="unit">kg/h</span><input type="number" name="feedA" step="any" min="0" inputmode="decimal"></label>
<label>Its mass fraction of solute <span class="unit">0–1</span><input type="number" name="fractionA" step="any" min="0" max="1" inputmode="decimal"></label>
<label>The second stream flows <span class="unit">kg/h</span><input type="number" name="feedB" step="any" min="0" inputmode="decimal"></label>
<label>Its mass fraction of solute <span class="unit">0–1</span><input type="number" name="fractionB" step="any" min="0" max="1" inputmode="decimal"></label>
</div>
<div data-live></div></section>

<section class="lesson-section"><h2>2 · Your calculation</h2>
<p class="section-note">Calculate yourself and then enter your results. The app doesn't count for you; Compare only when you ask.</p>
<div class="field-grid">
<label>Total outflow <span class="unit">kg/h</span><input type="number" name="outTotal" step="any" inputmode="decimal"></label>
<label>Outflow of solute <span class="unit">kg/h</span><input type="number" name="outSolute" step="any" inputmode="decimal"></label>
<label>Percentage of solute in the outlet <span class="unit">%</span><input type="number" name="outPercent" step="any" inputmode="decimal"></label>
</div>
<p><button type="button" class="button ghost" data-check>Compare my results with the reference calculation</button></p>
<div class="check-box" data-check-result></div></section>

<section class="lesson-section"><h2>3 · Your assumptions</h2>
<p class="section-note">Assumption on each line. Example: Steady state · No reaction · No loss of substance · Mass fractions, not molarity.</p>
<textarea name="assumptions" rows="4" placeholder="Steady state&#10;No chemical reaction&#10;No loss of matter"></textarea></section>

<section class="lesson-section"><h2>4 · Description of the process in English</h2>
<p class="section-note">Three to five sentences, in the format you studied in <a href="/bayt/english/process-description/">Lesson describing the process</a>.</p>
<textarea name="processDescription" dir="ltr" lang="en" rows="6" maxlength="1200" placeholder="Two streams are fed to a mixer…"></textarea></section>

<section class="lesson-section"><h2>5 · Save</h2>
<div class="status-key"><h3>What the app logs, and what it doesn't</h3>
<ul>
<li><strong>Task completion:</strong> He records it. You registered work on a specified date.</li>
<li><strong>Correct answer:</strong> Score it for this issue alone, by comparing your numbers to the reference account.</li>
<li><strong>Skill Mastery:</strong> <em>He does not record it or claim it</em>. Mastering requires different problems, time lag, and human judgment.</li>
</ul></div>
<p><button type="submit" class="button">Save the report in an achievement file</button></p>
<p class="save-note" data-save-note role="status"></p></section>
</form>`;

write('bayt/report/index.html', shell("Material balance report", "Combine calculation, assumptions and English description into one editable report.", reportPage, { script: '/bayt/app/report-page.mjs', active: '' }));

/* ---- ملف الإنجاز ---- */
const portfolio = `<header class="bayt-hero compact"><p class="eyebrow">The future</p><h1>Portfolio</h1>
<p class="lead">What you actually accomplish, preserved in a format suitable for presentation to a training body or in an interview.</p></header>
<div class="demo-bar" data-demo-bar hidden>
<p><strong>You have experimental data.</strong> Items marked “beta” are not yours.</p>
<button type="button" class="button ghost" data-clear-demo>Clear demo data only</button></div>
<p class="storage-warning" data-storage-warning hidden>Browser storage is currently unavailable, so what you add will not be saved.</p>
<section aria-labelledby="ach-title"><h2 id="ach-title">Your achievements</h2>
<p class="planner-summary" data-summary role="status"></p>
<div data-achievements></div></section>
<section class="planner-add"><h2>Add an achievement manually</h2>
<form data-achievement-form class="row-form">
<label>Title <input type="text" name="title" required maxlength="120" placeholder="Example: Fluids lab report"></label>
<label>Type <input type="text" name="kind" maxlength="40" placeholder="Report, project, certificate"></label>
<button type="submit" class="button">Save</button></form></section>
<section class="honesty"><h2>Under development in the future section</h2>
<ul><li>Cooperative training and vocational skills manuals have not yet been written.</li>
<li>There is no export to PDF and no public link to the file in this form.</li>
<li>You can export your data as a JSON file for preservation.</li></ul>
<p><button type="button" class="button ghost" data-export>Export my data (JSON)</button></p></section>`;

write('bayt/portfolio/index.html', shell("Portfolio", "What you've actually done is saved on your device.", portfolio, { script: '/bayt/app/portfolio-page.mjs', active: '/bayt/portfolio/' }));

console.log(`Bayt Al-Fuad: ${sections.length} Sections, ${goals.length} goals, ${skills.length} Skills, 6 Built Pages.`);
