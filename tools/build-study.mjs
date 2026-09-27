/** Builds the student-facing Semester 1 library as ONE learning sequence per subject:
 *
 *   /                                   entrance: Mathematics, Physics, Chemistry
 *   /semester-1/<subject>/              ordered lesson contents
 *   /semester-1/<subject>/<lesson>/     one canonical lesson per topic
 *   /semester-1/<subject>/sources/      sources and credits
 *   /<course>/<book|pearson|educator>/  compatibility pages for old links (with anchors)
 *
 * Lesson text:  tools/content/<course>/<lesson>.mjs, ordered by tools/content/sequence.mjs
 * Old notes:    tools/data/study-library.json (archived source, not deployed)
 * Migration:    tools/data/migration-ledger.json (built by tools/make-ledger.mjs)
 *
 * Output is plain HTML and CSS. The only script is the optional old-link forwarder on
 * compatibility pages. No forms, answer fields, scores or progress tracking.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { md, plain } from './content/markup.mjs';
import { sequence } from './content/sequence.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s + '\n'); };
const H = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const two = (i) => String(i).padStart(2, '0');

const curriculum = JSON.parse(read('semester-1/curriculum.json'));
const ledger = JSON.parse(read('tools/data/migration-ledger.json'));

const meta = {
  ma101: { name: 'Mathematics', glyph: '∫', summary: 'Functions, limits, continuity, derivatives and their applications.', color: 'math', published: 'the published MA 101 (Calculus I) course description' },
  phy101: { name: 'Physics', glyph: 'F = ma', summary: 'Measurement, motion, forces, energy, momentum and laboratory graphs.', color: 'physics', published: 'the published PHY 101 (General Physics I) course description' },
  chemistry: { name: 'Chemistry', glyph: 'H₂O', summary: 'Atoms, bonding, formulas and moles, reactions in solution, gases and chemical energy.', color: 'chemistry', published: 'the published CHEM 101 (General Chemistry I) course description' },
};
export const OLD_ROUTES = ['book', 'pearson', 'educator'];

const courses = [];
for (const c of curriculum.courses) {
  const lessons = [];
  for (const entry of sequence[c.id]) {
    const id = typeof entry === 'string' ? entry : entry.id;
    const topic = c.topics.find((t) => t.id === id);
    if (typeof entry === 'string' && !topic) throw new Error(`Unknown curriculum topic ${c.id}/${id}`);
    const file = `tools/content/${c.id}/${id}.mjs`;
    if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing lesson text: ${file}`);
    const content = (await import(pathToFileURL(path.join(root, file)).href)).default;
    lessons.push({ id, title: topic?.title ?? entry.title, href: topic?.href ?? `/semester-1/${c.path}/${id}/`, added: topic ? null : entry.added, content });
  }
  for (const t of c.topics) if (!lessons.some((l) => l.id === t.id)) throw new Error(`Curriculum topic ${c.id}/${t.id} has no lesson`);
  lessons.forEach((l, i) => { l.n = i + 1; });
  courses.push({ ...c, ...meta[c.id], lessons });
}
const subjectUrl = (c) => `/semester-1/${c.path}/`;
const sourcesUrl = (c) => `/semester-1/${c.path}/sources/`;

// ---------- shell ----------
function header(c) {
  return `<a class="skip" href="#content">Skip to content</a><header class="site-header"><a class="brand" href="/">BAYT AL-FUAD<span>Semester 1 · Study library</span></a><nav aria-label="Subjects">${courses.map((x) => `<a href="${subjectUrl(x)}"${c?.id === x.id ? ' aria-current="page"' : ''}>${x.name}</a>`).join('')}</nav></header>`;
}
function shell(title, body, c, { wide = false, script = '' } = {}) {
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Semester 1 study material: Mathematics, Physics and Chemistry. Explanations, formulas, diagrams and fully worked examples."><title>${H(title)} | Bayt Al-Fuad</title><link rel="stylesheet" href="/semester-1/assets/study.css"><link rel="icon" href="data:,">${script}</head><body class="${c?.color ?? 'home'}">${header(c)}<main id="content" class="${wide ? 'reader' : 'page'}">${body}</main><footer class="site-footer"><a href="/">Semester 1</a><span>Understand the idea. Follow the formula. Read the worked example.</span></footer></body></html>`;
}
function breadcrumbs(c, label = '') {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Semester 1</a>${c ? `<span aria-hidden="true">/</span>${label ? `<a href="${subjectUrl(c)}">${c.name}</a><span aria-hidden="true">/</span><span>${H(label)}</span>` : `<span>${c.name}</span>`}` : ''}</nav>`;
}

// ---------- teaching blocks ----------
const paras = (list) => (list ?? []).map((p) => `<p>${md(p)}</p>`).join('');
const steps = (list) => `<ol class="worked-steps">${list.map(([d, why]) => `<li><p>${md(d)}</p>${why ? `<p class="reason">${md(why)}</p>` : ''}</li>`).join('')}</ol>`;
function table(t) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${H(plain(t.caption))}"><table><caption>${md(t.caption)}</caption><thead><tr>${t.head.map((x) => `<th scope="col">${md(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((row) => `<tr>${row.map((x, i) => i ? `<td>${md(x)}</td>` : `<th scope="row">${md(x)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>${t.note ? `<p>${md(t.note)}</p>` : ''}`;
}
function example(w) {
  return `<article class="worked-example"><h3>${md(w.title)}</h3><p class="problem"><strong>Problem.</strong> ${md(w.problem)}</p>${steps(w.steps)}<p class="result"><strong>Result:</strong> ${md(w.result)}</p>${w.meaning ? `<p class="meaning"><strong>What it means:</strong> ${md(w.meaning)}</p>` : ''}</article>`;
}
const figureHtml = (f) => `<figure class="concept-figure">${f.svg}<figcaption>${md(f.caption)}</figcaption></figure>`;

/** The lesson pattern: purpose → background → idea with visual → formulas with meaning →
 *  first worked example → a different case → further cases → misconceptions and optional
 *  depth → keep in mind and continue. Sections without material are omitted. */
export function lessonSections(c, l) {
  const k = l.content, ex = k.examples;
  const idea = k.idea ?? [];
  const split = Math.min(2, idea.length);
  const figures = [k.figure, ...(k.figures ?? [])].filter(Boolean);
  const tables = [k.table, ...(k.tables ?? [])].filter(Boolean);
  const S = [];
  S.push(['why', 'What this lesson explains', paras(k.why)]);
  if (k.background?.length) S.push(['background', 'Before you begin', k.background.map((b) => `<div class="background-item"><h3>${md(b.title)}</h3><p>${md(b.text)}</p></div>`).join('')]);
  S.push(['idea', 'The idea, made visible', `${paras(idea.slice(0, split))}<div id="visual">${figures.map(figureHtml).join('')}</div>${paras(idea.slice(split))}${tables.map(table).join('')}${k.definitions?.length ? `<h3 id="definitions">Key terms</h3><dl class="definitions">${k.definitions.map(([term, text]) => `<div><dt>${md(term)}</dt><dd>${md(text)}</dd></div>`).join('')}</dl>` : ''}`]);
  S.push(['formulas', 'The formulas and what they mean', `${k.symbols?.length ? table({ caption: 'Symbols, meanings and units', head: ['Symbol', 'Meaning', 'Unit'], rows: k.symbols }) : ''}<div class="formula-list">${k.formulas.map((x) => `<article><h3>${md(x.name)}</h3><p class="formula">${md(x.f)}</p><p class="conditions"><strong>Conditions and limits:</strong> ${md(x.when)}</p>${x.note ? `<p>${md(x.note)}</p>` : ''}</article>`).join('')}</div>${k.derivation ? `<div class="derivation"><h3>Why it works: ${md(k.derivation.title)}</h3><p>${md(k.derivation.intro)}</p>${steps(k.derivation.steps)}${k.derivation.end ? `<p>${md(k.derivation.end)}</p>` : ''}</div>` : ''}`]);
  S.push(['examples', 'A first worked example', `${k.method ? `<div class="method" id="method"><h3>${md(k.method.title)}</h3><ol>${k.method.steps.map((s) => `<li>${md(s)}</li>`).join('')}</ol></div>` : ''}${example(ex[0])}`]);
  if (ex[1]) S.push(['different-case', 'A different case', example(ex[1])]);
  if (ex.length > 2) S.push(['more-examples', 'More worked cases', `<p>Each case below uses a different skill. Every step and result is shown.</p>${ex.slice(2).map(example).join('')}`]);
  S.push(['mistakes', 'Common misunderstandings', `<ul class="mistakes">${k.mistakes.map(([wrong, right]) => `<li><p class="wrong"><strong>Misunderstanding:</strong> ${md(wrong)}</p><p class="right"><strong>Correct idea:</strong> ${md(right)}</p></li>`).join('')}</ul>${(k.extra ?? []).map((x, i) => `<details class="extra"${i ? '' : ' id="further"'}><summary>Going further (optional): ${md(x.title)}</summary>${paras(x.text)}</details>`).join('')}`]);
  const next = c.lessons[l.n];
  S.push(['scope', 'Keep in mind', `<ul class="formula-compact">${k.formulas.map((x) => `<li><span class="formula">${md(x.f)}</span><span class="muted">${md(x.name)}</span></li>`).join('')}</ul><h3>Scope of this lesson</h3><ul class="scope-list">${k.scope.map((s) => `<li>${md(s)}</li>`).join('')}</ul>${next ? `<p>Next: <a href="${next.href}">${H(next.title)}</a>. ${md(next.content.summary)}</p>` : `<p>This is the last lesson in ${c.name}. <a href="${subjectUrl(c)}">Back to the ${c.name} contents</a>.</p>`}`]);
  return S;
}
// Old in-page anchors whose material moved to its own lesson.
export const movedAnchors = { 'phy101/motion': [['support-relative-motion', 'relative-motion']], 'chemistry/atomic-structure': [['support-amount-and-formulas', 'moles-and-formulas']], 'chemistry/bonding': [['support-chemical-naming', 'chemical-naming'], ['support-intermolecular-forces', 'intermolecular-forces']] };

function lessonPage(c, l) {
  const S = lessonSections(c, l);
  const prev = c.lessons[l.n - 2], next = c.lessons[l.n];
  const moved = (movedAnchors[`${c.id}/${l.id}`] ?? []).map(([anchor, target]) => { const t = c.lessons.find((x) => x.id === target); return `<p class="moved-note" id="${anchor}">An older bookmark may point here. That section is now its own lesson: <a href="${t.href}">${H(t.title)}</a>.</p>`; }).join('');
  const sources = `<p class="lesson-sources">${l.content.sources?.length ? `Further reading: ${l.content.sources.map((s) => `<a href="${H(s.url)}">${H(s.title)}</a>`).join(' · ')}. ` : 'Original study text. '}<a href="${sourcesUrl(c)}">Sources and credits</a>.</p>`;
  const body = `<div class="reader-top">${breadcrumbs(c, l.title)}</div><div class="reader-layout"><aside class="contents"><details open><summary>In this lesson</summary><nav aria-label="Lesson sections">${S.map(([id, title]) => `<a href="#${id}">${title}</a>`).join('')}<div class="toc-group"><span class="eyebrow">${c.name.toUpperCase()} LESSONS</span>${c.lessons.map((x) => `<a href="${x.href}"${x.id === l.id ? ' aria-current="page"' : ''}>${two(x.n)} ${H(x.title)}</a>`).join('')}</div></nav></details></aside><article class="reading-body"><header class="reading-heading"><p class="eyebrow">${c.name.toUpperCase()} · LESSON ${two(l.n)} OF ${c.lessons.length}</p><h1>${H(l.title)}</h1><p class="lead">${md(l.content.summary)}</p><nav class="lesson-nav" aria-label="Lesson navigation">${prev ? `<a href="${prev.href}">← ${H(prev.title)}</a>` : ''}<a href="${subjectUrl(c)}">${c.name} contents</a>${next ? `<a href="${next.href}">${H(next.title)} →</a>` : ''}</nav></header>${S.map(([id, title, html]) => `<section id="${id}" class="reading-section"><h2>${title}</h2>${html}</section>`).join('')}${moved}${sources}<nav class="next-topic" aria-label="Previous and next lessons">${prev ? `<a href="${prev.href}">← ${H(prev.title)}</a>` : ''}${next ? `<a class="button" href="${next.href}">Next: ${H(next.title)} →</a>` : ''}<a href="${subjectUrl(c)}">${c.name} contents</a></nav></article></div>`;
  return shell(`${l.title} · ${c.name}`, body, c, { wide: true });
}

// ---------- subject contents, sources, entrance ----------
function subjectPage(c) {
  const rows = c.lessons.map((l) => `<li class="topic-row" id="topic-${l.id}"><span>${two(l.n)}</span><div><h3><a href="${l.href}">${H(l.title)}</a></h3><p>${md(l.content.summary)}</p></div></li>`).join('');
  const body = `${breadcrumbs(c)}<section class="subject-heading"><div><p class="eyebrow">SEMESTER 1 · ${c.code} · ${H(c.title)}</p><h1>${c.name}</h1><p class="lead">Read the lessons in order. Each lesson explains the idea, shows it in a diagram, gives the formulas with their conditions, and works through examples step by step.</p></div><div class="subject-symbol" aria-hidden="true">${c.glyph}</div></section><section class="topic-section" aria-labelledby="lessons-title"><h2 id="lessons-title">Lessons</h2><ol class="topic-list">${rows}</ol></section><p class="scope-footer">Lessons follow ${c.published}${c.id === 'phy101' ? ', which is broad (fundamentals, laws of motion and applications, laboratory work and graphing); the lesson breakdown is a proposed study order' : ', in a proposed study order'}. Your lecturer’s current outline decides what is assessed. <a href="${sourcesUrl(c)}">Sources and credits</a>.</p>`;
  return shell(c.name, body, c);
}

function sourcesPage(c) {
  const notes = ledger.notes.filter((n) => n.course === c.id);
  const videos = new Map();
  for (const n of notes) for (const v of n.external ?? []) {
    const dest = n.decision === 'archive' ? null : c.lessons.find((l) => n.destination.startsWith(l.href));
    const key = dest ? dest.title : 'Topics outside the Semester 1 lessons';
    if (!videos.has(key)) videos.set(key, new Map());
    videos.get(key).set(v.url, v.title);
  }
  const order = [...c.lessons.map((l) => l.title), 'Topics outside the Semester 1 lessons'];
  const lessonSources = c.lessons.flatMap((l) => (l.content.sources ?? []).map((s) => [l.title, s]));
  const credit = c.id === 'chemistry' ? '<p>Some chemistry explanations and examples in the earlier notes were adapted from <a href="https://openstax.org/details/books/chemistry-2e">OpenStax Chemistry 2e</a> (Rice University), licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Any adaptation is ours; OpenStax does not endorse this library.</p>' : '';
  const body = `${breadcrumbs(c, 'Sources and credits')}<section class="subject-heading"><div><p class="eyebrow">${c.code}</p><h1>Sources and credits</h1><p class="lead">What the ${c.name} lessons are based on, and where to read further.</p></div></section><section class="reading-section"><h2>About the lessons</h2><p>The lessons are original study text written for this library. They follow ${c.published}. The lecturer’s outline has not been supplied, so the order and depth of assessment are not confirmed. The lessons were checked by recalculating their numbers and by careful reading; they have not yet been reviewed by a subject specialist.</p><p>An earlier version of this library presented three collections of short notes written in the styles of a textbook, a publisher’s course and a teacher. Their content was merged into these lessons, and a record of where each note went is kept with the project’s source files. No publisher’s text, video or course is reproduced here.</p>${credit}</section>${lessonSources.length ? `<section class="reading-section"><h2>Open references</h2><ul>${lessonSources.map(([t, s]) => `<li>${H(t)}: <a href="${H(s.url)}">${H(s.title)}</a></li>`).join('')}</ul></section>` : ''}${videos.size ? `<section class="reading-section"><h2>External videos (optional)</h2><p>These videos are on the Pearson Channels website (pearson.com). They are listed only as optional further viewing. The lessons do not require them, Pearson has not reviewed or endorsed this library, and the site may require an account.</p>${order.filter((t) => videos.has(t)).map((t) => `<h3>${H(t)}</h3><ul>${[...videos.get(t)].map(([u, title]) => `<li><a href="${H(u)}">${H(title)}</a></li>`).join('')}</ul>`).join('')}</section>` : ''}<p><a class="button" href="${subjectUrl(c)}">Back to ${c.name} →</a></p>`;
  return shell(`Sources and credits · ${c.name}`, body, c);
}

const home = `<section class="home-hero"><div><p class="eyebrow">MATHEMATICS · PHYSICS · CHEMISTRY</p><h1>Semester 1.</h1><p class="lead">Choose a subject and read its lessons in order: the idea, a diagram, the formulas and fully worked examples.</p></div></section><section aria-labelledby="subjects-title"><h2 id="subjects-title" class="vh">Subjects</h2><div class="subject-grid">${courses.map((c) => `<article class="subject-card ${c.color}" data-subject="${c.id}"><div class="subject-art" aria-hidden="true">${c.glyph}</div><div class="subject-body"><p class="eyebrow">${c.code}</p><h2>${c.name}</h2><p>${c.summary}</p><a class="button" href="${subjectUrl(c)}">Open ${c.name} →</a></div></article>`).join('')}</div></section><p class="home-footnote">Everything is open to read. There are no tests.</p>`;

// ---------- compatibility pages for the retired Book / Pearson / Educator links ----------
function compatPage(c, route) {
  const name = { book: 'Book', pearson: 'Pearson', educator: 'Educator' }[route];
  const rows = [];
  for (const l of c.lessons) rows.push([`topic-${l.id}`, l.title, l.href]);
  for (const list of Object.entries(movedAnchors).filter(([k]) => k.startsWith(c.id + '/'))) for (const [anchor, target] of list[1]) { const t = c.lessons.find((x) => x.id === target); rows.push([anchor, t.title, t.href]); }
  for (const g of ['background', 'related', 'beyond', 'equation-review']) rows.push([g, `${c.name} contents`, subjectUrl(c)]);
  for (const n of ledger.notes.filter((x) => x.course === c.id && x.route === route)) {
    rows.push([n.id, n.title, n.decision === 'archive' ? subjectUrl(c) : n.destination, n.decision === 'archive' ? 'not part of the Semester 1 lessons' : '']);
  }
  const body = `${breadcrumbs(c, 'Old link')}<section class="subject-heading"><div><p class="eyebrow">OLD LINK</p><h1>${c.name} lessons have moved</h1><p class="lead">The separate ${name} collection has been merged into one set of ${c.name} lessons. Each part of the old page is listed below with its new place.</p><p><a class="button" href="${subjectUrl(c)}">Open the ${c.name} lessons →</a></p></div></section><section class="reading-section"><h2>Where each part went</h2><ul class="compat-list">${rows.map(([id, title, href, note]) => `<li id="${H(id)}"><a href="${href}">${H(title)}</a>${note ? ` <span class="muted">(${H(note)})</span>` : ''}</li>`).join('')}</ul></section>`;
  return shell(`${c.name} lessons have moved`, body, c, { script: '<script src="/semester-1/assets/old-links.js" defer></script>' });
}

// ---------- write ----------
for (const p of ['index.html', 'bayt/index.html', 'semester-1/index.html']) write(p, shell('Semester 1 · Mathematics, Physics & Chemistry', home));
for (const c of courses) {
  write(`semester-1/${c.path}/index.html`, subjectPage(c));
  write(`semester-1/${c.path}/sources/index.html`, sourcesPage(c));
  for (const l of c.lessons) write(`${l.href.slice(1)}index.html`, lessonPage(c, l));
  for (const r of OLD_ROUTES) write(`${c.id}/${r}/index.html`, compatPage(c, r));
  // The old per-course hub is replaced by a redirect to the subject contents (vercel.json).
  fs.rmSync(path.join(root, `${c.id}/index.html`), { force: true });
}
console.log(`Built Semester 1: 3 subjects, ${courses.reduce((n, c) => n + c.lessons.length, 0)} lessons, 3 source pages, 9 old-link pages. No assessment interface.`);
