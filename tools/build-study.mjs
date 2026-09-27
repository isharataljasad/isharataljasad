/** Builds the student-facing Semester 1 library: the entrance, three subject hubs,
 * nine route pages (Book, Pearson, Educator for each subject) and 26 topic guides.
 *
 * Teaching text:   tools/content/<course>/<topic>.mjs (original English study text)
 * Route units:     tools/data/study-library.json (the 333 original collection units,
 *                  preserved verbatim) placed by semester-1/curriculum.json resources
 *                  and tools/data/route-plan.json
 *
 * Output is plain HTML and CSS: no scripts, forms, answer fields, scores or
 * progress tracking. The build is deterministic, so rebuilding cannot bring back
 * the earlier dashboard or quiz interface.
 */
import fs from 'node:fs';
import path from 'node:path';
import { md, plain } from './content/markup.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s + '\n'); };
const H = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const library = JSON.parse(read('tools/data/study-library.json'));
const plan = JSON.parse(read('tools/data/route-plan.json'));
const curriculum = JSON.parse(read('semester-1/curriculum.json'));

const meta = {
  ma101: { name: 'Mathematics', glyph: '∫', summary: 'Limits, continuity, derivatives and their applications.', color: 'math', published: 'the published MA 101 (Calculus I) course description' },
  phy101: { name: 'Physics', glyph: 'F = ma', summary: 'Measurement, motion, forces, energy, momentum and laboratory graphs.', color: 'physics', published: 'the published PHY 101 (General Physics I) course description' },
  chemistry: { name: 'Chemistry', glyph: 'H₂O', summary: 'Atoms, bonding, reactions in solution, solutions, gases and chemical energy.', color: 'chemistry', published: 'the published CHEM 101 (General Chemistry I) course description' },
};
export const routes = {
  book: { name: 'Book', title: 'Reference & formulas', description: 'The textbook approach: precise definitions, symbols and units, every formula with its conditions, and the derivations behind them.' },
  pearson: { name: 'Pearson', title: 'Methods & worked examples', description: 'The problem-solving approach: a step-by-step method for each kind of problem and fully worked examples showing every intermediate step.' },
  educator: { name: 'Educator', title: 'Concepts & explanations', description: 'The teacher’s approach: why the idea matters, what it means, pictures and tables that make it visible, and the misunderstandings to avoid.' },
};

const courses = [];
for (const c of curriculum.courses) {
  const topics = [];
  for (const t of c.topics) {
    const file = `tools/content/${c.id}/${t.id}.mjs`;
    if (!fs.existsSync(path.join(root, file))) { if (process.env.STUDY_DRAFT) continue; throw new Error(`Missing study text: ${file}`); }
    const content = (await import(path.join(root, file))).default;
    topics.push({ ...t, content, anchor: `topic-${t.id}` });
  }
  courses.push({ ...c, ...meta[c.id], topics });
}

const subjectUrl = (c) => `/semester-1/${c.path}/`;
const routeUrl = (c, r) => `/${c.id}/${r}/`;
const guideUrl = (t) => t.href;
const two = (i) => String(i).padStart(2, '0');

// ---------- page shell ----------
function header(c) {
  return `<a class="skip" href="#content">Skip to content</a><header class="site-header"><a class="brand" href="/">BAYT AL-FUAD<span>Semester 1 · Study library</span></a><nav aria-label="Subjects">${courses.map((x) => `<a href="${subjectUrl(x)}"${c?.id === x.id ? ' aria-current="page"' : ''}>${x.name}</a>`).join('')}</nav></header>`;
}
function shell(title, body, c, wide = false) {
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Semester 1 study material: Mathematics, Physics and Chemistry. Explanations, formulas, diagrams and fully worked examples."><title>${H(title)} | Bayt Al-Fuad</title><link rel="stylesheet" href="/semester-1/assets/study.css"></head><body class="${c?.color ?? 'home'}">${header(c)}<main id="content" class="${wide ? 'reader' : 'page'}">${body}</main><footer class="site-footer"><a href="/">Semester 1</a><span>Understand the idea. Follow the formula. Read the worked example.</span></footer></body></html>`;
}
function breadcrumbs(c, label = '') {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Semester 1</a>${c ? `<span aria-hidden="true">/</span>${label ? `<a href="${subjectUrl(c)}">${c.name}</a><span aria-hidden="true">/</span><span>${H(label)}</span>` : `<span>${c.name}</span>`}` : ''}</nav>`;
}
function routeTabs(c, active) {
  return `<nav class="route-tabs" aria-label="${c.name} study routes"><a href="${subjectUrl(c)}">${c.name} topics</a>${Object.entries(routes).map(([r, e]) => `<a href="${routeUrl(c, r)}"${r === active ? ' aria-current="page"' : ''}>${e.name}</a>`).join('')}</nav>`;
}
/** Compare bar: the same topic in every route and in the combined guide. */
function compare(c, t, here) {
  const links = Object.entries(routes).map(([r, e]) => r === here ? `<span aria-current="true">${e.name}</span>` : `<a href="${routeUrl(c, r)}#${t.anchor}">${e.name}</a>`);
  links.push(here === 'guide' ? '<span aria-current="true">Full guide</span>' : `<a href="${guideUrl(t)}">Full guide</a>`);
  return `<nav class="compare" aria-label="Read ${H(t.title)} in another route"><span class="compare-label">Compare this topic:</span>${links.join('')}</nav>`;
}

// ---------- teaching blocks ----------
const paras = (list) => (list ?? []).map((p) => `<p>${md(p)}</p>`).join('');
const steps = (list) => `<ol class="worked-steps">${list.map(([d, why]) => `<li><p>${md(d)}</p>${why ? `<p class="reason">${md(why)}</p>` : ''}</li>`).join('')}</ol>`;
function table(t) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${H(plain(t.caption))}"><table><caption>${md(t.caption)}</caption><thead><tr>${t.head.map((x) => `<th scope="col">${md(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((row) => `<tr>${row.map((x, i) => i ? `<td>${md(x)}</td>` : `<th scope="row">${md(x)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>${t.note ? `<p>${md(t.note)}</p>` : ''}`;
}
function example(w, level = 'h3') {
  return `<article class="worked-example"><${level}>${md(w.title)}</${level}><p class="problem"><strong>Problem.</strong> ${md(w.problem)}</p>${steps(w.steps)}<p class="result"><strong>Result:</strong> ${md(w.result)}</p>${w.meaning ? `<p class="meaning"><strong>What it means:</strong> ${md(w.meaning)}</p>` : ''}</article>`;
}
const B = {
  why: (k) => paras(k.why),
  idea: (k) => paras(k.idea),
  background: (k) => (k.background ?? []).map((b) => `<div class="background-item"><h4>${md(b.title)}</h4><p>${md(b.text)}</p></div>`).join(''),
  definitions: (k) => `<dl class="definitions">${k.definitions.map(([term, text]) => `<div><dt>${md(term)}</dt><dd>${md(text)}</dd></div>`).join('')}</dl>`,
  symbols: (k) => k.symbols?.length ? table({ caption: 'Symbols, meanings and units', head: ['Symbol', 'Meaning', 'Unit'], rows: k.symbols }) : '',
  formulas: (k) => `<div class="formula-list">${k.formulas.map((x) => `<article><h4>${md(x.name)}</h4><p class="formula">${md(x.f)}</p><p class="conditions"><strong>Conditions and limits:</strong> ${md(x.when)}</p>${x.note ? `<p>${md(x.note)}</p>` : ''}</article>`).join('')}</div>`,
  formulasCompact: (k) => `<ul class="formula-compact">${k.formulas.map((x) => `<li><span class="formula">${md(x.f)}</span><span class="muted">${md(x.name)} — ${md(x.when)}</span></li>`).join('')}</ul>`,
  derivation: (k) => k.derivation ? `<div class="derivation"><h4>${md(k.derivation.title)}</h4><p>${md(k.derivation.intro)}</p>${steps(k.derivation.steps)}${k.derivation.end ? `<p>${md(k.derivation.end)}</p>` : ''}</div>` : '',
  extra: (k) => (k.extra ?? []).map((x) => `<div class="extra"><h4>${md(x.title)}</h4>${paras(x.text)}</div>`).join(''),
  figure: (k) => `<figure class="concept-figure">${k.figure.svg}<figcaption>${md(k.figure.caption)}</figcaption></figure>${(k.figures ?? []).map((f) => `<figure class="concept-figure">${f.svg}<figcaption>${md(f.caption)}</figcaption></figure>`).join('')}`,
  table: (k) => (k.table ? [k.table] : []).concat(k.tables ?? []).map(table).join(''),
  method: (k) => `<div class="method"><h4>${md(k.method.title)}</h4><ol>${k.method.steps.map((s) => `<li>${md(s)}</li>`).join('')}</ol></div>`,
  examples: (k, level) => k.examples.map((w) => example(w, level)).join(''),
  mistakes: (k) => `<ul class="mistakes">${k.mistakes.map(([wrong, right]) => `<li><p class="wrong"><strong>Misunderstanding:</strong> ${md(wrong)}</p><p class="right"><strong>Correct idea:</strong> ${md(right)}</p></li>`).join('')}</ul>`,
  scope: (k) => `<ul class="scope-list">${k.scope.map((s) => `<li>${md(s)}</li>`).join('')}</ul>`,
};

// ---------- combined topic guide ----------
function guide(c, t) {
  const k = t.content;
  const parts = [
    ['why', 'Why it matters', B.why(k)],
    ['idea', 'The idea', B.idea(k)],
    ['background', 'Background you need', B.background(k)],
    ['definitions', 'Definitions, symbols & units', B.definitions(k) + B.symbols(k)],
    ['formulas', 'Formulas & conditions', B.formulas(k) + B.derivation(k)],
    ['visual', 'See it', B.figure(k) + B.table(k)],
    ['method', 'Method', B.method(k)],
    ['examples', 'Worked examples', `<p>Every example shows the full solution. Read the reason under each step: it explains why the step is allowed.</p>${B.examples(k, 'h3')}`],
    ...(k.extra?.length ? [['further', 'Going further', B.extra(k)]] : []),
    ['mistakes', 'Common misunderstandings', B.mistakes(k)],
    ['scope', 'Scope & limits of this guide', B.scope(k)],
  ];
  const next = c.topics[t.sequence];
  const prev = c.topics[t.sequence - 2];
  const body = `<div class="reader-top">${breadcrumbs(c, t.title)}${routeTabs(c)}</div><div class="reader-layout"><aside class="contents"><details open><summary>In this guide</summary><nav aria-label="Guide contents">${parts.map(([id, title]) => `<a href="#${id}">${title}</a>`).join('')}<div class="toc-group"><span class="eyebrow">${c.name.toUpperCase()} · SEMESTER 1</span>${c.topics.map((x) => `<a href="${guideUrl(x)}"${x.id === t.id ? ' aria-current="page"' : ''}>${two(x.sequence)} ${H(x.title)}</a>`).join('')}</div></nav></details></aside><article class="reading-body"><header class="reading-heading"><p class="eyebrow">${c.code} · TOPIC ${two(t.sequence)} OF ${c.topics.length} · FULL GUIDE</p><h1>${H(t.title)}</h1><p class="lead">${md(k.summary)}</p>${compare(c, t, 'guide')}<p class="reading-note">This full guide combines the three routes. Open Book, Pearson or Educator above to read the same topic in one style; each link opens this topic directly.</p></header>${parts.map(([id, title, html]) => `<section id="${id}" class="reading-section"><h2>${title}</h2>${html}</section>`).join('')}<nav class="next-topic" aria-label="Previous and next topics">${prev ? `<a href="${guideUrl(prev)}">← ${H(prev.title)}</a>` : ''}${next ? `<a class="button" href="${guideUrl(next)}">Next: ${H(next.title)} →</a>` : ''}<a href="${subjectUrl(c)}">All ${c.name} topics</a></nav></article></div>`;
  return shell(`${t.title} · ${c.name}`, body, c, true);
}

// ---------- route pages ----------
function placeUnits(c, r) {
  const units = library[c.id][r].units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u.title })));
  const where = new Map();
  const all = curriculum.courses.find((x) => x.id === c.id).topics;
  for (const t of all) for (const id of t.resources[r] ?? []) if (!where.has(id)) where.set(id, t.id);
  for (const [id, target] of Object.entries(plan[c.id][r] ?? {})) {
    if (where.has(id)) throw new Error(`${c.id}/${r}/${id} is placed twice`);
    where.set(id, target);
  }
  const groups = new Map();
  for (const u of units) {
    const g = where.get(u.id);
    if (!g) throw new Error(`Unplaced collection unit: ${c.id}/${r}/${u.id} (${u.title})`);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(u);
  }
  for (const g of groups.keys()) if (!['background', 'related', 'beyond'].includes(g) && !all.some((t) => t.id === g)) throw new Error(`Unknown placement ${g}`);
  return { groups, where };
}
function routeCore(r, k) {
  if (r === 'book') return `<h3>Definitions</h3>${B.definitions(k)}${B.symbols(k)}<h3>Formulas and their conditions</h3>${B.formulas(k)}${B.derivation(k)}${B.extra(k)}<h3>Worked example</h3>${example(k.examples[0], 'h4')}<h3>Scope</h3>${B.scope(k)}`;
  if (r === 'pearson') return `<h3>Method</h3>${B.method(k)}<h3>Key formulas</h3>${B.formulasCompact(k)}<h3>Worked examples</h3>${B.examples(k, 'h4')}<h3>Where students go wrong</h3>${B.mistakes(k)}`;
  return `<h3>Why it matters</h3>${B.why(k)}<h3>The idea</h3>${B.idea(k)}<h3>See it</h3>${B.figure(k)}${B.table(k)}<h3>Background you need</h3>${B.background(k)}<h3>An example, explained</h3>${example(k.examples[0], 'h4')}<h3>Common misunderstandings</h3>${B.mistakes(k)}`;
}
function routePage(c, r) {
  const e = routes[r];
  const data = library[c.id][r];
  const { groups } = placeUnits(c, r);
  const unitBlock = (list, heading) => list?.length ? `<div class="collection-units"><h3>${heading}</h3><p class="muted">Short study notes from the original ${e.name} collection for this topic.</p>${list.map((u) => u.html).join('')}</div>` : '';
  const topics = c.topics.map((t) => `<section id="${t.anchor}" class="route-topic"><p class="eyebrow">${c.code} · TOPIC ${two(t.sequence)} OF ${c.topics.length}</p><h2>${H(t.title)}</h2><p class="lead">${md(t.content.summary)}</p>${compare(c, t, r)}${routeCore(r, t.content)}${unitBlock(groups.get(t.id), `More from the ${e.name} collection`)}</section>`).join('');
  const extraGroup = (g) => {
    const list = groups.get(g); if (!list?.length) return '';
    const [title, note] = plan.groups[c.id][g];
    const inner = `<p>${H(note)}</p>${list.map((u) => u.html).join('')}`;
    return g === 'beyond'
      ? `<section id="beyond" class="route-extra beyond"><h2>${H(title)}</h2><details><summary>Show ${list.length} later-course notes</summary>${inner}</details></section>`
      : `<section id="${g}" class="route-extra"><h2>${H(title)}</h2>${inner}</section>`;
  };
  const toc = `<div class="toc-group"><span class="eyebrow">SEMESTER 1 TOPICS</span>${c.topics.map((t) => `<a href="#${t.anchor}">${two(t.sequence)} ${H(t.title)}</a>`).join('')}</div><div class="toc-group"><span class="eyebrow">ALSO IN THIS COLLECTION</span>${['background', 'related', 'beyond'].filter((g) => groups.get(g)?.length).map((g) => `<a href="#${g}">${H(plan.groups[c.id][g][0].split(':')[0].split(' —')[0])}</a>`).join('')}<a href="#equation-review">Formula reference</a></div>`;
  const credit = data.credit || '';
  const honesty = r === 'book' && c.id === 'chemistry'
    ? 'The topic explanations are original study text written for this library. The short collection notes are adapted from OpenStax Chemistry 2e (credited below).'
    : `All text here is original study material written for this library in the ${e.name} style of teaching. It is not the publisher’s textbook, video course or question bank, and no licensed material is reproduced.${r === 'pearson' ? ' Links marked pearson.com lead to the publisher’s own site, which may require an account.' : ''}`;
  const body = `<div class="reader-top">${breadcrumbs(c, e.name)}${routeTabs(c, r)}</div><div class="reader-layout"><aside class="contents"><details open><summary>Contents</summary><nav aria-label="${e.name} contents">${toc}</nav></details></aside><article class="reading-body"><header class="reading-heading"><p class="eyebrow">${c.code} · ${e.name.toUpperCase()} ROUTE</p><h1>${c.name}: ${e.name}</h1><p class="lead">${e.title}. ${e.description}</p><p class="reading-note">${honesty}</p><p>The ${c.topics.length} Semester 1 topics come first, in study order. Each topic has a <strong>Compare</strong> bar that opens the same topic in the other routes, so you can read a second explanation and come straight back.</p></header>${topics}${extraGroup('background')}${extraGroup('related')}${extraGroup('beyond')}${data.formulaReview}${credit}<p class="scope-footer">The Semester 1 topics follow ${c.published}. Your lecturer’s current outline decides what is assessed and in which order.</p><a class="button" href="${subjectUrl(c)}">Back to ${c.name} →</a></article></div>`;
  return shell(`${c.name} · ${e.name}`, body, c, true);
}

// ---------- entrance and subject hubs ----------
const home = `<section class="home-hero"><div><p class="eyebrow">MATHEMATICS · PHYSICS · CHEMISTRY</p><h1>Semester 1.</h1><p class="lead">Choose a subject, then read it your way: Book, Pearson or Educator.</p></div><aside class="hero-note"><span class="eyebrow">THE STUDY LIBRARY</span><strong>3 subjects<span>${courses.reduce((n, c) => n + c.topics.length, 0)} topics · 3 routes each</span></strong></aside></section><section aria-labelledby="subjects-title"><div class="section-heading"><h2 id="subjects-title">Choose your subject</h2><p>Everything is open to read. There are no tests.</p></div><div class="subject-grid">${courses.map((c) => `<article class="subject-card ${c.color}" data-subject="${c.id}"><div class="subject-art" aria-hidden="true">${c.glyph}</div><div class="subject-body"><p class="eyebrow">${c.code}</p><h2><a href="${subjectUrl(c)}">${c.name}</a></h2><p>${c.summary}</p><a class="button" href="${subjectUrl(c)}">Open ${c.name} →</a><nav class="direct-routes" aria-label="${c.name} reading routes">${Object.entries(routes).map(([r, e]) => `<a href="${routeUrl(c, r)}">${e.name}</a>`).join('')}</nav><p class="collection-count">${c.topics.length} Semester 1 topics</p></div></article>`).join('')}</div></section><p class="home-footnote">Three ways to understand the same topic. Choose the style that helps you, or compare them.</p>`;

function hub(c) {
  const rows = c.topics.map((t) => `<div class="topic-row"><span>${two(t.sequence)}</span><div><h3><a href="${guideUrl(t)}">${H(t.title)}</a></h3><p>${md(t.content.summary)}</p><nav class="row-routes" aria-label="${H(t.title)} in each route"><a href="${guideUrl(t)}">Full guide</a>${Object.entries(routes).map(([r, e]) => `<a href="${routeUrl(c, r)}#${t.anchor}">${e.name}</a>`).join('')}</nav></div></div>`).join('');
  const cards = `<div class="engine-grid">${Object.entries(routes).map(([r, e], i) => `<a class="engine-card" href="${routeUrl(c, r)}"><div class="engine-meta"><span>ROUTE ${i + 1} OF 3</span><span>${c.topics.length} topics</span></div><h3>${e.name}<span aria-hidden="true">→</span></h3><strong>${e.title}</strong><p>${e.description}</p><span class="text-link">Read ${c.name} in ${e.name} →</span></a>`).join('')}</div>`;
  const body = `${breadcrumbs(c)}<section class="subject-heading"><div><p class="eyebrow">SEMESTER 1 · ${c.code} · ${H(c.title)}</p><h1>${c.name}</h1><p class="lead">${H(c.scope.replace(/ The detailed mechanics sequence below is provisional until the lecturer’s outline is available\./, ''))}</p></div><div class="subject-symbol" aria-hidden="true">${c.glyph}</div></section><section aria-labelledby="routes-title"><div class="section-heading"><div><p class="eyebrow">THREE STUDY ROUTES</p><h2 id="routes-title">Book · Pearson · Educator</h2></div><p>Same topics, three teaching styles.</p></div>${cards}<p class="collection-note">All three routes are original study text written for this library in the style of each approach; they are not publisher textbooks or video courses.</p></section><section class="topic-section" aria-labelledby="topics-title"><div class="section-heading"><div><p class="eyebrow">SEMESTER 1 TOPICS IN STUDY ORDER</p><h2 id="topics-title">Read by topic</h2></div><p>Open the full guide, or the same topic in one route.</p></div><div class="topic-list">${rows}</div></section><p class="scope-footer">These topics follow ${c.published}.${c.id === 'phy101' ? ' That description is broad (fundamentals, laws of motion and applications, laboratory work and graphing), so the eight-topic breakdown is a proposed study order.' : ' The order is a proposed study order.'} Your lecturer’s current outline decides what is assessed.</p>`;
  return shell(c.name, body, c);
}

for (const p of ['index.html', 'bayt/index.html', 'semester-1/index.html']) write(p, shell('Semester 1 · Mathematics, Physics & Chemistry', home));
for (const c of courses) {
  const h = hub(c);
  write(`semester-1/${c.path}/index.html`, h);
  write(`${c.id}/index.html`, h);
  for (const r of Object.keys(routes)) write(`${c.id}/${r}/index.html`, routePage(c, r));
  for (const t of c.topics) write(`${t.href.slice(1)}index.html`, guide(c, t));
}
console.log(`Built Semester 1: 3 subjects, 9 route pages, ${courses.reduce((n, c) => n + c.topics.length, 0)} topic guides. No assessment interface.`);
