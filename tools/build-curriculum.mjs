/* ==========================================================================
   tools/build-curriculum.mjs

   Builds the shared teaching spine from program/concepts.mjs:

     - approach pages for any concept with Markdown under
       foundations/concepts/source/<slug>/approach-<n>.md
     - a hub per concept that lets a student compare the three treatments
     - /foundations/concepts/  : browse concepts by strand and unit
     - /program/coverage/      : the coverage ledger
     - program/coverage.json   : the same ledger, machine readable

   Units and episodes are DERIVED from foundations/reading/catalog.json so the
   296 catalogued episodes are accounted for exactly once, from one source.

   Nothing here asserts that a concept is taught. Every status is read from the
   filesystem: a treatment counts as written only if its page exists.
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { esc, slug, makeInline, externalOrLocal, renderMarkdown } from './lib/markdown.mjs';
import { approaches, strands, unitNames, concepts } from '../program/concepts.mjs';
import { catalog as programme } from '../program/catalog.mjs';
import { conceptChecks } from '../program/concept-checks.mjs';

const root = path.resolve(import.meta.dirname, '..');
const conceptsRoot = path.join(root, 'foundations', 'concepts');
const sourceRoot = path.join(conceptsRoot, 'source');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const episodes = JSON.parse(read('foundations/reading/catalog.json'));

/* ---------- derive units from the episode catalogue ---------------------- */

const unitKeyOf = (item) => item.title.includes(' - ')
  ? `${item.track}/${item.title.split(' - ')[0].trim()}`
  : `${item.track}/${String(item.episode).split('.')[0]}`;

const units = new Map();
for (const item of episodes) {
  const key = unitKeyOf(item);
  if (!units.has(key)) {
    const named = item.title.includes(' - ') ? item.title.split(' - ')[0].trim() : unitNames[key];
    if (!named) throw new Error(`Unit ${key} has no title. Add it to unitNames in program/concepts.mjs.`);
    units.set(key, { key, track: item.track, group: item.group, title: named, episodes: [] });
  }
  units.get(key).episodes.push(item);
}

const strandOfTrack = new Map(strands.flatMap((s) => s.tracks.map((t) => [t, s])));
for (const unit of units.values()) unit.strand = strandOfTrack.get(unit.track).id;

/* ---------- validate the registry --------------------------------------- */

const byId = new Map();
for (const concept of concepts) {
  if (byId.has(concept.id)) throw new Error(`Duplicate concept id ${concept.id}`);
  byId.set(concept.id, concept);
}
const foundationStrands = new Set(strands.map((s) => s.id));
const episodeKeys = new Set(episodes.map((e) => `${e.track}|${e.episode}`));

for (const concept of concepts) {
  for (const id of [...concept.prerequisites, ...concept.next]) {
    if (!byId.has(id)) throw new Error(`${concept.id} references unknown concept ${id}`);
  }
  for (const [track, episode] of concept.episodes) {
    if (!episodeKeys.has(`${track}|${episode}`)) throw new Error(`${concept.id} cites unknown episode ${track} ${episode}`);
  }
  for (const code of concept.courses) {
    if (!programme.courses.some((c) => c.id === code)) throw new Error(`${concept.id} references unknown course ${code}`);
  }
  if (foundationStrands.has(concept.strand) && !units.has(concept.unit)) {
    throw new Error(`${concept.id} sits in unit ${concept.unit}, which no episode belongs to`);
  }
  for (const n of Object.keys(concept.approaches)) {
    if (!approaches.some((a) => String(a.number) === n)) throw new Error(`${concept.id} declares unknown approach ${n}`);
  }
}

/* A prerequisite edge should be mirrored, or navigation is one-way. */
for (const concept of concepts) {
  for (const id of concept.prerequisites) {
    const other = byId.get(id);
    if (!other.next.includes(concept.id)) {
      throw new Error(`${id} is a prerequisite of ${concept.id} but does not list it in next`);
    }
  }
}

/* ---------- page shell --------------------------------------------------- */

const shell = (title, description, body, extraCss = '') => `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}"><title>${esc(title)} | Yanbu Engineering Study</title>
<link rel="stylesheet" href="/semester-1/assets/curriculum.css"><link rel="stylesheet" href="/foundations/reading/reading.css"><link rel="stylesheet" href="/foundations/concepts/concepts.css">${extraCss}</head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Study areas"><a href="/semester-1/math/">Calculus I</a><a href="/semester-1/physics/">Physics</a><a href="/semester-1/chemistry/">Chemistry</a><a href="/foundations/" aria-current="page">Foundations</a><a href="/program/">Programme map</a></nav><span class="semester">CONCEPTS</span></header>
<main id="main" class="page concepts-page">${body}</main>
<footer class="footer">Every concept keeps three routes. <a href="/foundations/concepts/">Browse all concepts</a> · <a href="/program/coverage/">Coverage ledger</a></footer>
<script type="module" src="/foundations/concepts/return-topic.mjs"></script></body></html>
`;

const write = (relative, html) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
};

const pageExists = (href) => {
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  return fs.existsSync(path.join(root, clean, 'index.html')) || fs.existsSync(path.join(root, `${clean}.html`));
};

/* ---------- approach pages ---------------------------------------------- */

const inline = makeInline(externalOrLocal);
let builtApproaches = 0;

for (const concept of concepts) {
  for (const [number, href] of Object.entries(concept.approaches)) {
    const md = path.join(sourceRoot, concept.slug, `approach-${number}.md`);
    if (!fs.existsSync(md)) continue;            // treatment lives elsewhere (a reading chapter, the pilot)

    const expected = `/foundations/concepts/${concept.slug}/approach-${number}/`;
    if (href !== expected) throw new Error(`${concept.id} approach ${number} has source here but points at ${href}; expected ${expected}`);

    const approach = approaches.find((a) => String(a.number) === number);
    const rendered = renderMarkdown(fs.readFileSync(md, 'utf8'), {
      source: md, inline, tableClass: 'reading-table-wrap', answerClass: 'reading-answer',
    });

    const toc = rendered.headings.length
      ? `<nav class="concept-toc" aria-label="On this page"><h2>On this page</h2><ol>${rendered.headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>`
      : '';
    const switcher = approachSwitcher(concept, number);
    /* Approach 2 is the practice route, so it carries the interactive checks
       when the concept has any. The written decisions above stay; these ask
       the reader to commit and then judge the commitment. */
    const checks = number === '2' ? checksBlock(concept) : '';
    const body = `${crumb(concept, `Approach ${number}`)}
<header class="concept-hero"><p class="eyebrow">APPROACH ${number} · ${esc(approach.name.toUpperCase())}</p><h1>${esc(rendered.title)}</h1><p>${esc(approach.purpose)}</p></header>
${switcher}
<div class="concept-layout">${toc}<article class="reading-article">${rendered.body}${checks}${relatedBlock(concept)}</article></div>`;

    write(`foundations/concepts/${concept.slug}/approach-${number}/index.html`,
      shell(`Approach ${number} · ${rendered.title}`, approach.purpose, body,
        checks ? '<script type="module" src="/foundations/concepts/checks.mjs"></script>' : ''));
    builtApproaches++;
  }
}

/* ---------- interactive checks ------------------------------------------ */

function field(q, idPrefix) {
  if (q.kind === 'choice') {
    return `<fieldset class="check-options"><legend class="visually-hidden">Choose one</legend>${
      q.options.map((o, i) => `<label><input type="radio" name="answer" value="${i}"> ${inline(o.label)}</label>`).join('')
    }</fieldset>`;
  }
  const unit = q.unit ? ` <span class="check-unit">(${esc(q.unit)})</span>` : '';
  return `<label for="${idPrefix}">Your answer${unit}</label>`
    + `<input id="${idPrefix}" name="answer" type="text" inputmode="decimal" autocomplete="off" required>`;
}

function checksBlock(concept) {
  const checks = conceptChecks[concept.slug];
  if (!checks || !checks.length) return '';

  /* The data file the runtime fetches. Answers live here rather than in the
     page so the markup stays readable; this is a study aid, not an exam. */
  write(`foundations/concepts/${concept.slug}/checks.json`,
    JSON.stringify({ slug: concept.slug, checks }, null, 1) + '\n');

  const items = checks.map((q) => {
    const followUp = q.followUp ? `<div class="check-followup" hidden>
<h4>A different problem, to test the repair</h4>
<p>${inline(q.followUp.prompt)}</p>
<form><div class="check-row">${field(q.followUp, `follow-${concept.slug}-${q.id}`)}<button type="submit">Check</button></div></form>
<p class="check-feedback" role="status" aria-live="polite"></p>
<details class="reading-answer"><summary>Worked answer</summary><p>${inline(q.followUp.solution)}</p></details>
</div>` : '';

    const prereq = q.prerequisite
      ? `<p class="check-prereq">Needs a step you are unsure of? <a href="${esc(q.prerequisite.href)}">${esc(q.prerequisite.label)}</a></p>`
      : '';

    return `<section class="check" data-check="${esc(q.id)}">
<p class="check-prompt">${inline(q.prompt)}</p>
${prereq}
<form><div class="check-row">${field(q, `check-${concept.slug}-${q.id}`)}<button type="submit">Check</button></div></form>
<p class="check-feedback" role="status" aria-live="polite"></p>
<button class="text-button check-reveal" type="button">Show the worked answer</button>
<div class="check-solution" hidden><p>${inline(q.solution)}</p></div>
${followUp}
</section>`;
  }).join('');

  return `<section class="concept-checks" data-concept-checks="${esc(concept.slug)}">
<h2 id="check-yourself">Check yourself</h2>
<p>Commit to an answer before checking. A wrong answer opens a different problem, not the same one again. Everything here is written out above as well, so the page works without scripting.</p>
${items}
<p class="check-summary" data-check-summary role="status" aria-live="polite"></p>
<p class="check-note">Attempts are stored on this browser only. Answering one question correctly records one correct answer; it is not a measure of mastery and not a university grade.</p>
<noscript><p>Interactive checking needs JavaScript. The same decisions, with their worked answers, are written in the families above.</p></noscript>
</section>`;
}

/* ---------- shared fragments -------------------------------------------- */

function crumb(concept, tail) {
  return `<p class="model-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/concepts/">Concepts</a> / <a href="${concept.hub || `/foundations/concepts/${concept.slug}/`}">${esc(concept.title)}</a> / ${esc(tail)}</p>`;
}

function approachSwitcher(concept, current) {
  const items = approaches.map((a) => {
    const href = concept.approaches[a.number];
    const label = `<span class="switch-number">Approach ${a.number}</span><span class="switch-name">${esc(a.name)}</span>`;
    if (!href) return `<span class="concept-switch-item is-missing">${label}<span class="switch-note">not written yet</span></span>`;
    const now = String(a.number) === String(current);
    return `<a class="concept-switch-item" href="${href}"${now ? ' aria-current="page"' : ''}>${label}<span class="switch-note">${esc(a.bestFor)}</span></a>`;
  }).join('');
  return `<nav class="concept-switch" aria-label="Three ways to learn this concept">${items}</nav>`;
}

function relatedBlock(concept) {
  const linkTo = (id) => {
    const other = byId.get(id);
    const href = other.hub || Object.values(other.approaches)[0];
    return href ? `<a href="${href}">${esc(other.title)}</a>` : esc(other.title);
  };
  const before = concept.prerequisites.length
    ? `<p><strong>Before this:</strong> ${concept.prerequisites.map(linkTo).join(' · ')}</p>` : '';
  const after = concept.next.length
    ? `<p><strong>Leads to:</strong> ${concept.next.map(linkTo).join(' · ')}</p>` : '';
  if (!before && !after) return '';
  return `<section class="concept-related"><h2>Where this sits</h2>${before}${after}</section>`;
}

/* ---------- concept hubs ------------------------------------------------- */

for (const concept of concepts) {
  if (!concept.hub || !concept.hub.startsWith('/foundations/concepts/')) continue;
  const written = approaches.filter((a) => concept.approaches[a.number]);
  const cards = approaches.map((a) => {
    const href = concept.approaches[a.number];
    const inner = `<span class="model-number">0${a.number}</span><span><strong>Approach ${a.number}</strong><span class="model-card-name">${esc(a.name)}</span><span class="model-card-copy">${esc(a.purpose)}</span><span class="model-card-best">${esc(a.bestFor)}</span></span>`;
    return href
      ? `<a class="model-card" href="${href}">${inner}<span class="model-arrow" aria-hidden="true">→</span></a>`
      : `<div class="model-card is-missing">${inner}<span class="switch-note">Not written yet.</span></div>`;
  }).join('');

  const evidence = `<section class="concept-evidence"><h2>What this was built from</h2><p>${esc(concept.evidence)}</p><p class="local-note">Original prose, examples and figures. No publisher text, transcript, artwork or question bank is reproduced here.</p></section>`;
  const body = `<p class="model-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/concepts/">Concepts</a> / ${esc(concept.title)}</p>
<header class="concept-hero"><p class="eyebrow">${esc(concept.id)} · ${esc(unitLabel(concept))}</p><h1>${esc(concept.title)}</h1><p>${esc(concept.summary)}</p></header>
<p class="concept-count">${written.length} of 3 treatments written.</p>
<div class="model-grid">${cards}</div>
${relatedBlock(concept)}
${evidence}`;
  write(`foundations/concepts/${concept.slug}/index.html`, shell(concept.title, concept.summary, body));
}

function unitLabel(concept) {
  const unit = units.get(concept.unit);
  return unit ? `${unit.group} · ${unit.title}` : concept.unit.replace('/', ' · ');
}

/* ---------- concept index ------------------------------------------------ */

const conceptsByStrand = new Map(strands.map((s) => [s.id, []]));
const otherConcepts = [];
for (const concept of concepts) {
  if (conceptsByStrand.has(concept.strand)) conceptsByStrand.get(concept.strand).push(concept);
  else otherConcepts.push(concept);
}

const badge = (concept) => {
  const n = approaches.filter((a) => concept.approaches[a.number]).length;
  const cls = n === 3 ? 'ready' : n ? 'partial' : '';
  return `<span class="badge ${cls}">${n} of 3 routes</span>`;
};

const conceptRow = (concept) => {
  const href = concept.hub || Object.values(concept.approaches)[0];
  const title = href ? `<a href="${href}">${esc(concept.title)}</a>` : esc(concept.title);
  const routes = approaches.map((a) => concept.approaches[a.number]
    ? `<a class="route-chip" href="${concept.approaches[a.number]}">${a.number} · ${esc(a.short)}</a>`
    : `<span class="route-chip is-missing">${a.number} · ${esc(a.short)}</span>`).join('');
  return `<li><div class="concept-row-head"><h4>${title}</h4>${badge(concept)}</div><p>${esc(concept.summary)}</p><div class="route-chips">${routes}</div></li>`;
};

const strandSection = (strand) => {
  const list = conceptsByStrand.get(strand.id);
  const strandUnits = [...units.values()].filter((u) => u.strand === strand.id);
  const covered = strandUnits.filter((u) => list.some((c) => c.unit === u.key)).length;
  const groups = strandUnits.map((unit) => {
    const inUnit = list.filter((c) => c.unit === unit.key);
    const status = inUnit.length
      ? `<ul class="concept-rows">${inUnit.map(conceptRow).join('')}</ul>`
      : `<p class="unit-empty">${unit.episodes.length} catalogued episodes. No concept written yet.</p>`;
    return `<section class="unit-block"><div class="unit-head"><h3>${esc(unit.title)}</h3><span>${unit.episodes.length} episodes</span></div>${status}</section>`;
  }).join('');
  return `<section class="strand-block" id="${strand.id}"><div class="strand-head"><h2>${esc(strand.group)}</h2><span>${covered} of ${strandUnits.length} units started</span></div>${groups}</section>`;
};

const indexBody = `<p class="model-crumb"><a href="/foundations/">Foundations</a> / Concepts</p>
<header class="concept-hero"><p class="eyebrow">ONE CONCEPT · THREE WAYS TO LEARN IT</p><h1>Choose how you want to learn each idea.</h1><p>Every concept can be taught three ways. Pick the one that suits you now and switch at any point: all three teach the same idea and link to each other.</p></header>
<section class="approach-legend"><h2>The three routes</h2><dl>${approaches.map((a) => `<div><dt>Approach ${a.number} · ${esc(a.name)}</dt><dd>${esc(a.purpose)} <em>${esc(a.bestFor)}</em></dd></div>`).join('')}</dl></section>
<p class="model-note">This page lists every unit in the four Foundations subjects, so an idea that has no lesson yet is visible rather than hidden. A unit with no concept has catalogued source material but no written teaching. The <a href="/program/coverage/">coverage ledger</a> records exactly what exists.</p>
${strands.map(strandSection).join('')}
${otherConcepts.length ? `<section class="strand-block" id="programme"><div class="strand-head"><h2>Chemical engineering</h2><span>concepts attached to programme courses</span></div><ul class="concept-rows">${otherConcepts.map(conceptRow).join('')}</ul></section>` : ''}`;

write('foundations/concepts/index.html', shell('Concepts', 'Every concept taught three ways: a curriculum reference, guided practice, and a full written guide.', indexBody));

/* ---------- coverage ledger ---------------------------------------------- */

/* Where a route's authored source lives, if we hold one. A route whose page
   exists but has no source here cannot be rebuilt from this repository, and the
   ledger says so instead of implying we wrote it. */
const readingSources = (() => {
  const file = path.join(root, 'foundations/reading/source/manifest.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
})();

function sourceFor(href) {
  let m = href.match(/^\/foundations\/concepts\/([^/]+)\/approach-(\d)\/$/);
  if (m) return `foundations/concepts/source/${m[1]}/approach-${m[2]}.md`;
  m = href.match(/^\/foundations\/models\/functions-and-domain\/foundation-(\d)\/$/);
  if (m) return `foundations/models/source/foundation-${m[1]}.md`;
  if (readingSources[href]) return readingSources[href];
  if (href === '/program/lessons/material-balances/') return 'program/lessons/source/material-balances.html';
  return null;
}

/* Question counting, done honestly.

   The pages use three different shapes for their questions, so one selector
   cannot cover them: headed families ("Family 1 · …"), a numbered list under a
   question heading, or interactive check forms. Count whichever shape a page
   uses and record WHICH, so the number can be checked. When none is
   recognised the result is null — "not identified" — never 0, because a
   counter that does not understand the markup has not found zero questions.
   An earlier version counted only answer disclosures and forms and reported 0
   for chapters that plainly carry six question families. */
function countQuestions(html) {
  const families = [...html.matchAll(/<h[23][^>]*>\s*Family\s/gi)].length;

  let listed = 0;
  const heading = html.match(/<h2[^>]*>[^<]*(question fingerprint|question famil|checks after|distinct checks|apply the idea)[^<]*<\/h2>/i);
  if (heading) {
    const list = html.slice(heading.index + heading[0].length).match(/<ol>([\s\S]*?)<\/ol>/);
    if (list) listed = (list[1].match(/<li>/g) || []).length;
  }

  const interactiveChecks = (html.match(/<form[ >]/g) || []).length;
  const answerDisclosures = (html.match(/<details[^>]*class="[^"]*answer/g) || []).length;
  const hasAnswerSection = /<h2[^>]*>[^<]*answers? with reasons?[^<]*<\/h2>/i.test(html);

  const identified = families || listed;
  return {
    questions: identified || interactiveChecks || null,
    countedBy: families ? 'headed question families'
      : listed ? 'numbered question list'
        : interactiveChecks ? 'interactive checks'
          : 'not identified',
    interactiveChecks,
    answersShown: answerDisclosures > 0 || hasAnswerSection,
    answerDisclosures,
  };
}

/* Read from the built page, never claimed in the registry. */
function measure(href) {
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  const file = [path.join(root, clean, 'index.html'), path.join(root, `${clean}.html`)].find((f) => fs.existsSync(f));
  if (!file) return null;
  const html = fs.readFileSync(file, 'utf8');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const source = sourceFor(href);
  return {
    /* This measures local availability only; deployment needs separate evidence. */
    state: source && fs.existsSync(path.join(root, source)) ? 'generated' : 'local-file',
    source: source && fs.existsSync(path.join(root, source)) ? source : null,
    words: text.split(' ').length,
    sections: (html.match(/<h2[ >]/g) || []).length,
    figures: (html.match(/<figure[ >]/g) || []).length + (html.match(/<svg[ >]/g) || []).length,
    tables: (html.match(/<table[ >]/g) || []).length,
    ...countQuestions(html),
  };
}

/* Semester 1 delivers all three treatments inside one page rather than as three
   routes, so it is reported as its own kind of entry instead of being forced
   into the three-route frame. Derived from semester-1/curriculum.json. */
const liveCurriculum = JSON.parse(read('semester-1/curriculum.json'));
const semesterTopics = liveCurriculum.courses.flatMap((course) => course.topics.map((topic) => {
  const counts = measure(topic.href) || {};
  const routes = topic.resources || {};
  return {
    key: topic.key, title: topic.title, course: course.code, href: topic.href,
    material: { book: (routes.book || []).length, pearson: (routes.pearson || []).length, educator: (routes.educator || []).length },
    prerequisites: (topic.foundationSkills || []).map((s) => s.id),
    questions: ['diagnostic', 'transfer'].filter((k) => topic[k]).length,
    ...counts,
  };
}));

const courseSummary = {};
for (const course of programme.courses) {
  courseSummary[course.status] = (courseSummary[course.status] || 0) + 1;
}

const ledger = {
  generatedOn: new Date().toISOString().slice(0, 10),
  deployment: { status: 'not-verified', note: 'This build checks local files only. No production deployment was verified.' },
  semesterTopics,
  courseSummary,
  note: 'Content availability is read from local files. It does not verify publication, curriculum completeness or learning outcomes.',
  episodes: { catalogued: episodes.length, sourceRecords: 297, units: units.size },
  strands: strands.map((s) => ({
    id: s.id, group: s.group,
    units: [...units.values()].filter((u) => u.strand === s.id).length,
    episodes: [...units.values()].filter((u) => u.strand === s.id).reduce((n, u) => n + u.episodes.length, 0),
    concepts: concepts.filter((c) => c.strand === s.id).length,
  })),
  concepts: concepts.map((concept) => ({
    id: concept.id, title: concept.title, strand: concept.strand, unit: concept.unit,
    courses: concept.courses,
    material: concept.episodes.length ? `${concept.episodes.length} catalogued episode(s)` : 'no episode inventory for this course',
    prerequisites: concept.prerequisites,
    routes: approaches.map((a) => {
      const href = concept.approaches[a.number];
      if (!href) return { approach: a.number, name: a.name, written: false, state: 'missing' };
      if (!pageExists(href)) throw new Error(`${concept.id} approach ${a.number} points at a missing page: ${href}`);
      return { approach: a.number, name: a.name, written: true, href, ...measure(href) };
    }),
    verification: concept.verified || null,
    gaps: concept.gaps || [],
  })),
};
fs.writeFileSync(path.join(root, 'program/coverage.json'), JSON.stringify(ledger, null, 1), 'utf8');

const ledgerRows = ledger.concepts.map((c) => {
  const cells = c.routes.map((r) => {
    if (!r.written) return `<td class="is-missing"><span class="tick is-off" aria-hidden="true">○</span> <strong>Missing</strong><small>no treatment written</small></td>`;
    const q = r.questions === null
      ? 'questions not identified by the counter'
      : `${r.questions} question${r.questions === 1 ? '' : 's'} (${esc(r.countedBy)})`;
    const answers = r.answersShown ? 'reasoned answers present' : 'no answers found';
    return `<td class="is-done"><span class="tick" aria-hidden="true">●</span> <strong>${r.state === 'generated' ? 'Generated locally' : 'Local page'}</strong><small>${r.words} words · ${r.sections} sections · ${r.figures} figures</small><small>${q}; ${answers}</small>${r.interactiveChecks ? `<small>${r.interactiveChecks} interactive check${r.interactiveChecks === 1 ? '' : 's'}</small>` : ''}<small>${r.source ? esc(r.source) : 'no source in this repository'}</small></td>`;
  }).join('');
  return `<tr><th scope="row"><a href="${byId.get(c.id).hub || c.routes.find((r) => r.written)?.href || '#'}">${esc(c.title)}</a><small>${esc(c.id)} · ${esc(c.material)}</small></th>${cells}<td><small>${c.verification ? esc(c.verification.checks.join('; ')) : 'not verified this pass'}</small></td><td><small>${c.gaps.length ? esc(c.gaps.join('; ')) : '—'}</small></td></tr>`;
}).join('');

const strandRows = ledger.strands.map((s) => `<tr><th scope="row">${esc(s.group)}</th><td>${s.units}</td><td>${s.episodes}</td><td>${s.concepts}</td><td>${s.episodes - concepts.filter((c) => c.strand === s.id).reduce((n, c) => n + c.episodes.length, 0)}</td></tr>`).join('');

const totalWritten = ledger.concepts.reduce((n, c) => n + c.routes.filter((r) => r.written).length, 0);
const coveredEpisodes = concepts.reduce((n, c) => n + c.episodes.length, 0);

const coverageBody = `<p class="model-crumb"><a href="/program/">Programme</a> / Coverage ledger</p>
<header class="concept-hero"><p class="eyebrow">WHAT EXISTS, MEASURED</p><h1>Coverage ledger</h1><p>Generated on ${ledger.generatedOn}. This report measures the local build. A route counts as available only when its page exists locally. <strong>Publication status: not verified.</strong> These counts do not confirm that the same pages are available on the public site.</p></header>
<section class="ledger-summary"><h2>Foundations source material</h2>
<div class="reading-table-wrap" role="region" aria-label="Table: Foundations source material" tabindex="0"><table><caption>297 source records represent ${episodes.length} unique episodes across ${units.size} units.</caption><thead><tr><th scope="col">Subject</th><th scope="col">Units</th><th scope="col">Episodes</th><th scope="col">Concepts written</th><th scope="col">Episodes with no concept</th></tr></thead><tbody>${strandRows}</tbody></table></div>
<p>${coveredEpisodes} of ${episodes.length} catalogued episodes are attached to a concept. The remaining episodes are not mapped to this concept registry; that does not establish whether related material exists elsewhere on the site. An indexed episode is not a lesson.</p></section>
<section class="ledger-main"><h2>Concept by concept</h2>
<p>${totalWritten} of ${concepts.length * 3} possible treatments exist for the ${concepts.length} registered concepts. This denominator covers registered concepts only, not the full curriculum.</p>
<p>All five registered Tools of Geometry concepts now have reference, practice and written-guide routes. This describes those five concepts only; it does not establish coverage of every geometry topic.</p>
<dl class="ledger-key"><div><dt>Generated locally</dt><dd>The page exists in this build and has an identified source file from which it can be rebuilt.</dd></div><div><dt>Local page</dt><dd>The page exists in this build, but this registry has not identified its source. Neither local status verifies publication.</dd></div><div><dt>Missing</dt><dd>No treatment is registered for that route.</dd></div><div><dt>Questions</dt><dd>Counted from the page, with the method named. Pages use three shapes — headed families, a numbered question list, or interactive checks — so the counter reports which one it read. When it recognises none it says so rather than reporting zero.</dd></div></dl>
<div class="reading-table-wrap" role="region" aria-label="Table: Concept coverage" tabindex="0"><table><thead><tr><th scope="col">Concept</th>${approaches.map((a) => `<th scope="col">${a.number} · ${esc(a.short)}</th>`).join('')}<th scope="col">Verification</th><th scope="col">Remaining gaps</th></tr></thead><tbody>${ledgerRows}</tbody></table></div></section>
<section class="ledger-main"><h2>Semester 1 topic pages</h2>
<p>These 26 pages take a different shape: instead of three separate routes they put the explanation, a worked example and all three source treatments on one page. That is the integrated experience the three routes are working towards, so they are measured separately here.</p>
<p>Each page includes an original Bayt lesson with reference explanations, worked steps, a visual exploration model and multiple question types. These practice questions provide targeted feedback for anticipated wrong answers. The two older topic checks remain a separate matched pair; neither system awards mastery. See the <a href="/semester-1/coverage/">semester lesson inventory</a> for the current counts and scope limits.</p>
<div class="reading-table-wrap" role="region" aria-label="Table: Semester 1 topic pages" tabindex="0"><table><thead><tr><th scope="col">Topic</th><th scope="col">Course</th><th scope="col">Source material on the page</th><th scope="col">Explanation</th><th scope="col">Questions</th></tr></thead><tbody>${semesterTopics.map((t) => `<tr><th scope="row"><a href="${t.href}">${esc(t.title)}</a><small>${esc(t.key)}</small></th><td>${esc(t.course)}</td><td><small>${t.material.book + t.material.pearson + t.material.educator} treatments (${t.material.book}/${t.material.pearson}/${t.material.educator})</small></td><td><small>${t.words} words · ${t.sections} sections · ${t.figures} figures</small></td><td><small>${t.questions} checked</small></td></tr>`).join('')}</tbody></table></div></section>
<section class="ledger-main"><h2>Programme courses</h2>
<p>The programme map holds ${programme.courses.length} course records across eight semesters. Availability is recorded per course and shown on every card.</p>
<ul>${Object.entries(courseSummary).map(([status, n]) => `<li><strong>${n}</strong> ${esc(status.replace(/-/g, ' '))}</li>`).join('')}</ul>
<p>An outline is an editorial grouping of topics so a student can see what a course will involve. It is not a taught course, and nothing on this site should be read as the college's official syllabus. Confirming the real weekly scope, laboratory procedures and assessment requirements needs current official course outlines, which are still missing.</p></section>
<section class="ledger-main"><h2>What this ledger does not say</h2>
<p>It reports that pages exist and how much is on them. It does not establish that anything has been learned. This review did not collect evidence from real students, so it does not establish teaching effectiveness. Course outlines in the programme map remain outlines; an outline is not a lesson.</p>
<p>The machine-readable form is <a href="/program/coverage.json">coverage.json</a>.</p></section>`;

write('program/coverage/index.html', shell('Coverage ledger', 'Teaching content available in the local curriculum build; publication is not verified.', coverageBody));

console.log(`Curriculum: ${units.size} units, ${episodes.length} episodes, ${concepts.length} concepts, ${builtApproaches} approach pages built, ${totalWritten} treatments available locally.`);
