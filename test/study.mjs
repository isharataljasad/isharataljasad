/* The Semester 1 student experience: entrance → subject contents → one canonical
 * lesson per topic, read in order. Checks the lesson pattern and teaching content
 * of all 31 lessons (every numerical claim listed in the content files, including
 * each check of release aa7c04c), the migration ledger for all 333 original notes,
 * the old-link pages, reading-only behaviour, links and anchors, the deployment
 * allow-list, and that the build and the ledger are reproducible. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { deployedFiles } from './lib/deployed.mjs';
import { md } from '../tools/content/markup.mjs';
import { sequence } from '../tools/content/sequence.mjs';
import * as english from '../tools/content/english/index.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const curriculum = JSON.parse(read('semester-1/curriculum.json'));
const library = JSON.parse(read('tools/data/study-library.json'));
const ledger = JSON.parse(read('tools/data/migration-ledger.json'));
const baseline = JSON.parse(read('tools/data/numeric-checks-aa7c04c.json'));
const ROUTES = ['book', 'pearson', 'educator'];
const text = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
let checks = 0;

// Absolute-value bars must stay inside the numerator, not split a fraction.
assert.equal(md('{{∣x − 5∣|x − 5}}'), '<span class="frac"><span class="num">∣x − 5∣</span><span class="vh"> / </span><span class="den">x − 5</span></span>');
assert.throws(() => md('{{|x − 5||x − 5}}'), /Ambiguous fraction/);
assert.throws(() => md('{{x|}}'), /Empty numerator or denominator/);
assert.throws(() => md('{{ |x}}'), /Empty numerator or denominator/);
assert.ok(md('{{1|{{x|y}}}}').includes('<span class="num">x</span>'), 'nested fractions still render');

// ---------- the lesson sequence ----------
const courses = [];
for (const c of curriculum.courses) {
  const lessons = [];
  for (const entry of sequence[c.id]) {
    const id = typeof entry === 'string' ? entry : entry.id;
    const topic = c.topics.find((t) => t.id === id);
    const k = (await import(pathToFileURL(path.join(root, `tools/content/${c.id}/${id}.mjs`)).href)).default;
    lessons.push({ id, at: `${c.id}/${id}`, href: topic?.href ?? `/semester-1/${c.path}/${id}/`, k });
  }
  for (const t of c.topics) assert.ok(lessons.some((l) => l.id === t.id), `${c.id}/${t.id}: every curriculum topic has one lesson`);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length, `${c.id}: one canonical lesson per topic`);
  courses.push({ ...c, lessons });
}
const all = courses.flatMap((c) => c.lessons);
assert.equal(all.length, 31, 'Semester 1 has 31 lessons');
// Background lessons sit where they are first needed.
const order = (c, id) => courses.find((x) => x.id === c).lessons.findIndex((l) => l.id === id);
assert.equal(order('ma101', 'functions'), 0, 'function review comes first in Mathematics');
assert.equal(order('ma101', 'derivative'), 3, 'the derivative follows limits and continuity');
assert.equal(order('phy101', 'relative-motion'), order('phy101', 'motion') + 1, 'relative motion follows vectors and motion');
assert.ok(order('chemistry', 'intermolecular-forces') === order('chemistry', 'bonding') + 1, 'intermolecular forces follow bonding');
assert.ok(order('chemistry', 'chemical-naming') < order('chemistry', 'moles-and-formulas'), 'naming precedes moles and formulas');
assert.ok(order('chemistry', 'moles-and-formulas') < order('chemistry', 'aqueous-reactions'), 'moles precede reactions in solution');
assert.ok(order('chemistry', 'intermolecular-forces') < order('chemistry', 'solutions'), 'intermolecular forces precede solutions');

for (const { at, k } of all) {
  assert.ok(k.summary?.length > 40, `${at}: summary`);
  assert.ok(k.why?.length >= 1 && k.idea?.length >= 3, `${at}: purpose and the idea`);
  assert.ok(k.background?.length >= 1 && k.background.every((b) => b.title && b.text), `${at}: background`);
  assert.ok(k.symbols?.length >= 3 && k.symbols.every((s) => s.length === 3), `${at}: symbols with meanings and units`);
  assert.ok(k.formulas?.length >= 3 && k.formulas.every((f) => f.name && f.f && f.when?.length > 10), `${at}: formulas with conditions`);
  assert.ok(k.figure?.svg?.includes('<title id=') && k.figure.svg.includes('<desc id=') && k.figure.caption, `${at}: accessible figure`);
  assert.ok(k.table?.rows?.length >= 3, `${at}: table`);
  assert.ok(k.method?.steps?.length >= 3, `${at}: method`);
  assert.ok(k.examples?.length >= 4, `${at}: at least four fully worked examples`);
  for (const e of k.examples) {
    assert.ok(e.title && e.problem && e.result, `${at}: example "${e.title}" is complete`);
    assert.ok(e.steps.length >= 1 && e.steps.every(([d, why]) => d && why), `${at}: every step of "${e.title}" has its reason`);
  }
  assert.equal(new Set(k.examples.map((e) => e.title)).size, k.examples.length, `${at}: no repeated example`);
  assert.ok(k.mistakes?.length >= 3 && k.scope?.length >= 1, `${at}: misunderstandings and scope`);
  if (k.derivation) assert.ok(k.derivation.steps.length >= 2 && k.derivation.steps.every(([d, why]) => d && why), `${at}: reasoning steps`);
  for (const x of k.extra ?? []) assert.ok(x.title && x.text?.length, `${at}: optional section complete`);
  // Every number stated in a worked example or table that is listed here is recomputed.
  assert.ok(k.checks?.length >= 3, `${at}: numerical checks`);
  for (const [label, actual, expected, tol] of k.checks) {
    assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tol + 1e-12, `${at}: numerical check "${label}": ${actual} ≠ ${expected}`);
    checks++;
  }
}
// No numerical check of the verified release may disappear silently.
assert.equal(baseline.checks.length, 259);
for (const b of baseline.checks) {
  const l = all.find((x) => x.at === b.lesson);
  assert.ok(l?.k.checks.some(([label, , expected]) => label === b.label && Math.abs(expected - b.expected) < 1e-9), `check "${b.label}" of ${b.was} is missing from ${b.lesson}`);
}
assert.ok(checks >= 259, 'all earlier numerical checks retained');

// Science wording that was corrected in review stays corrected.
const derivative = all.find((l) => l.at === 'ma101/derivative').k;
assert.ok(!/just touches/i.test(JSON.stringify(derivative)), 'tangent is not described as a line that "just touches"');
assert.ok(/limit(?:ing)? (?:line|of (?:the )?secant)/i.test(JSON.stringify(derivative)) && /may cross|can cross/i.test(JSON.stringify(derivative)), 'tangent is defined as the limit of secants and may cross the curve');

// ---------- page set ----------
// English, the fourth subject, follows its own reading order and language layout.
const slug = (s) => s.toLowerCase().replace(/’/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const eng = english.lessons.map((l, i) => ({ ...l, n: i + 1, href: `/semester-1/english/${slug(l.title)}/` }));
const engPage = (l) => l.href.slice(1) + 'index.html';
const SUBJECT_IDS = [...courses.map((c) => c.id), 'english'];
const subjectPath = (id) => id === 'english' ? 'english' : courses.find((c) => c.id === id).path;
const home = ['index.html', 'bayt/index.html', 'semester-1/index.html'];
const subjects = SUBJECT_IDS.map((id) => `semester-1/${subjectPath(id)}/index.html`);
const sources = SUBJECT_IDS.map((id) => `semester-1/${subjectPath(id)}/sources/index.html`);
const lessonPages = [...all.map((l) => l.href.slice(1) + 'index.html'), ...eng.map(engPage)];
const compat = [...courses.flatMap((c) => ROUTES.map((r) => `${c.id}/${r}/index.html`)), ...ROUTES.map((r) => `semester-1/english/old-links/${r}/index.html`)];
const pages = [...home, ...subjects, ...sources, ...lessonPages, ...compat];
assert.equal(pages.length, 74);
const html = new Map(pages.map((p) => [p, read(p)]));
for (const c of courses) assert.ok(!fs.existsSync(path.join(root, `${c.id}/index.html`)), `${c.id}/index.html: the old subject hub is gone (redirected)`);

for (const p of home) {
  const h = html.get(p);
  const cards = [...h.matchAll(/<article class="subject-card[^"]*" data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
  assert.deepEqual(cards.map((m) => m[1]), SUBJECT_IDS, `${p}: exactly the four authorised subjects`);
  for (const [, id, card] of cards) assert.deepEqual([...card.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), [`/semester-1/${subjectPath(id)}/`], `${p}: one action for ${id}`);
  assert.deepEqual([...h.match(/<nav aria-label="Subjects">([\s\S]*?)<\/nav>/)[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]), SUBJECT_IDS.map((id) => `/semester-1/${subjectPath(id)}/`), `${p}: subject navigation`);
  assert.ok(!/\b\d+\s+(?:lessons?|topics?|units?|notes?|examples?|checks?)\b/i.test(text(h)), `${p}: no totals on the entrance`);
}
const branding = /\b(?:Book|Pearson|Educator)\b|engine-card|route-topic|compare-bar|class="compare/;
for (const c of courses) {
  const p = `semester-1/${c.path}/index.html`, h = html.get(p);
  const rows = [...h.matchAll(/<li class="topic-row" id="topic-([^"]+)"><span>(\d+)<\/span><div><h3><a href="([^"]+)">/g)];
  assert.deepEqual(rows.map((m) => m[1]), c.lessons.map((l) => l.id), `${p}: ordered contents`);
  assert.deepEqual(rows.map((m) => m[3]), c.lessons.map((l) => l.href), `${p}: contents links`);
  assert.deepEqual(rows.map((m) => +m[2]), c.lessons.map((_, i) => i + 1), `${p}: numbered in order`);
  assert.ok(h.includes(`href="/semester-1/${c.path}/sources/"`), `${p}: quiet sources link`);
  const s = html.get(`semester-1/${c.path}/sources/index.html`);
  assert.match(text(s), /has not reviewed or endorsed this library/i, `${c.id} sources: no implied endorsement`);
  assert.match(text(s), /original study text/i, `${c.id} sources: original-text statement`);
  if (c.id === 'chemistry') assert.match(s, /OpenStax[\s\S]*creativecommons\.org\/licenses\/by\/4\.0/, 'chemistry sources: OpenStax CC BY credit');
}
const SECTION_ORDER = ['why', 'background', 'idea', 'formulas', 'examples', 'different-case', 'more-examples', 'mistakes', 'scope'];
for (const c of courses) c.lessons.forEach((l, i) => {
  const p = l.href.slice(1) + 'index.html', h = html.get(p), k = l.k;
  const ids = [...h.matchAll(/<section id="([^"]+)" class="reading-section">/g)].map((m) => m[1]);
  const expected = SECTION_ORDER.filter((s) => s !== 'more-examples' || k.examples.length > 2);
  assert.deepEqual(ids, expected, `${p}: lesson pattern`);
  for (const id of ['visual', 'method']) assert.ok(h.includes(`id="${id}"`), `${p}: ${id}`);
  assert.equal((h.match(/class="worked-example"/g) || []).length, k.examples.length, `${p}: worked examples`);
  for (const e of k.examples) assert.ok(h.includes(md(e.result)), `${p}: visible result of "${e.title}"`);
  for (const f of k.formulas) assert.ok(h.includes(md(f.when)), `${p}: conditions of ${f.name}`);
  if (k.extra?.length) assert.equal((h.match(/<details class="extra"/g) || []).length, k.extra.length, `${p}: optional depth is collapsed and labelled`);
  const nav = h.match(/<nav class="lesson-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const prev = c.lessons[i - 1], next = c.lessons[i + 1];
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), [prev?.href, `/semester-1/${c.path}/`, next?.href].filter(Boolean), `${p}: previous / contents / next`);
  if (next) assert.ok(h.includes(`Next: <a href="${next.href}">`), `${p}: points to the next lesson`);
});
const scienceStudentPages = [...home, ...subjects.filter((p) => !p.includes('/english/')), ...all.map((l) => l.href.slice(1) + 'index.html')];
for (const p of scienceStudentPages) assert.ok(!branding.test(html.get(p)), `${p}: no route branding or compare bars on student pages`);
// English lesson text may name publishers in its own disclaimers (“not recordings from Cambridge, Pearson or Educator”),
// so on English pages the check is structural: no route choice, route labels or compare bars.
for (const p of [subjects.find((x) => x.includes('/english/')), ...eng.map(engPage)]) assert.ok(!/engine-card|route-topic|compare-bar|class="compare|\b(?:Book|Pearson|Educator) (?:route|collection|version)\b/.test(html.get(p)), `${p}: no route choice on English pages`);

// ---------- migration ledger ----------
const units = [];
for (const c of courses) for (const r of ROUTES) for (const u of library[c.id][r].units) for (const n of u.lessons) units.push(`${c.id}/${r}/${n.id}`);
assert.equal(units.length, 333);
assert.equal(ledger.notes.length, 333, 'ledger covers the 333 original notes');
assert.deepEqual(ledger.notes.map((n) => n.key).sort(), [...units].sort(), 'each original note appears once in the ledger');
const keys = new Set(units);
const anchorExists = (dest) => {
  const [url, anchor] = dest.split('#');
  const file = url.slice(1) + 'index.html';
  assert.ok(html.has(file), `ledger destination ${dest} is not a study page`);
  if (anchor) assert.ok(html.get(file).includes(`id="${anchor}"`), `ledger destination ${dest}: missing anchor`);
};
for (const n of ledger.notes) {
  assert.ok(['retain', 'rewrite', 'combine', 'archive'].includes(n.decision), `${n.key}: decision`);
  assert.ok(n.title && n.concept && n.reason?.length > 10, `${n.key}: identity, concept and reason`);
  for (const d of n.duplicates) assert.ok(keys.has(d) && d !== n.key, `${n.key}: duplicate ${d}`);
  if (n.decision === 'archive') {
    assert.equal(n.destination, `archive: tools/data/study-library.json#${n.key}`, `${n.key}: archived where it can be recovered`);
    const [c, r, id] = n.key.split('/');
    assert.ok(library[c][r].units.some((u) => u.lessons.some((x) => x.id === id && x.html)), `${n.key}: archived text is kept`);
  } else anchorExists(n.destination);
}
assert.ok(ledger.sections.length > 300, 'ledger covers the guide and support sections');
for (const s of ledger.sections) { assert.ok(s.source && s.decision && s.reason, `section ${s.source}: complete`); if (s.destination.startsWith('/')) anchorExists(s.destination); }
// Unique required cases that were added from the notes are really in the lessons.
for (const n of ledger.notes.filter((x) => x.decision === 'retain' || x.decision === 'rewrite')) {
  const [url] = n.destination.split('#');
  assert.ok(all.some((l) => l.href === url), `${n.key}: kept in a canonical lesson`);
}

// ---------- old links ----------
for (const c of courses) for (const r of ROUTES) {
  const p = `${c.id}/${r}/index.html`, h = html.get(p);
  assert.deepEqual([...h.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]), ['<script src="/semester-1/assets/old-links.js" defer>'], `${p}: only the old-link forwarder`);
  const items = new Map([...h.matchAll(/<li id="([^"]+)"><a href="([^"]+)">/g)].map((m) => [m[1], m[2]]));
  for (const t of c.topics) assert.equal(items.get(`topic-${t.id}`), t.href, `${p}: #topic-${t.id} goes to its lesson`);
  for (const n of ledger.notes.filter((x) => x.key.startsWith(`${c.id}/${r}/`))) {
    assert.ok(items.has(n.id), `${p}: old anchor #${n.id} is listed`);
    const dest = items.get(n.id);
    assert.ok(dest.startsWith(`/semester-1/${c.path}/`), `${p}: #${n.id} stays in ${c.name ?? c.id}`);
    if (n.decision !== 'archive') assert.equal(dest, n.destination, `${p}: #${n.id} follows the ledger`);
  }
}
assert.match(read('semester-1/assets/old-links.js'), /location\.replace\(link\.getAttribute\('href'\)\)/);
// Sections that became lessons keep their old anchors on the lesson they left.
for (const [p, id, dest] of [['semester-1/physics/motion/index.html', 'support-relative-motion', '/semester-1/physics/relative-motion/'], ['semester-1/chemistry/atomic-structure/index.html', 'support-amount-and-formulas', '/semester-1/chemistry/moles-and-formulas/'], ['semester-1/chemistry/bonding/index.html', 'support-chemical-naming', '/semester-1/chemistry/chemical-naming/'], ['semester-1/chemistry/bonding/index.html', 'support-intermolecular-forces', '/semester-1/chemistry/intermolecular-forces/']])
  assert.match(html.get(p), new RegExp(`id="${id}"[^>]*>[^<]*<a href="${dest}"`), `${p}: #${id} points to ${dest}`);

// ---------- English ----------
{
  const packDir = path.join(root, 'tools/content/english/pack');
  // The supplied pack is kept exactly as delivered; corrections live in tools/content/english/index.mjs.
  const sums = JSON.parse(fs.readFileSync(path.join(packDir, 'checksums.json'), 'utf8'));
  for (const [f, sha] of Object.entries(sums)) assert.equal(createHash('sha256').update(fs.readFileSync(path.join(packDir, f))).digest('hex'), sha, `English pack file ${f} differs from the delivered version`);
  const H = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const manifestIds = english.manifest.lessons.map((m) => m.id);
  assert.deepEqual(eng.map((l) => l.id), manifestIds, 'English lessons follow the manifest order');
  assert.equal(eng.length, 20);
  assert.equal(eng.filter((l) => l.media_status === 'recording_required').length, 5);
  for (const c of english.corrections) assert.ok(c.reason?.length > 40, 'every English correction is recorded with its reason');
  const registry = new Map(english.sourceRegistry.map((s) => [s.id, s]));
  const contents = html.get('semester-1/english/index.html');
  const engSources = html.get('semester-1/english/sources/index.html');
  let last = -1;
  const strings = [];
  const walk = (v) => { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  for (const l of eng) {
    const p = engPage(l), h = html.get(p), at = `${l.id} ${p}`;
    walk({ ...l, original: undefined });
    // Contents: in order, each lesson once.
    const pos = contents.indexOf(`<li class="topic-row" id="topic-${slug(l.title)}">`);
    assert.ok(pos > last, `${at}: listed in order on the English contents`); last = pos;
    // Prerequisites come earlier and link only to real lessons.
    for (const pre of l.prerequisites) {
      const target = eng.find((x) => x.id === pre);
      assert.ok(target && target.n < l.n, `${at}: prerequisite ${pre} comes earlier`);
      assert.ok(h.slice(h.indexOf('<section id="background"'), h.indexOf('<section id="idea"')).includes(`href="${target.href}"`), `${at}: links its prerequisite ${pre}`);
    }
    // The language layout, not the science schema.
    const ids = [...h.matchAll(/<section id="([^"]+)" class="reading-section">/g)].map((m) => m[1]);
    assert.deepEqual(ids, ['why', 'background', 'idea', 'pattern', 'examples', 'second-example', 'mistakes', 'scope'], `${at}: lesson pattern`);
    assert.ok(h.includes('<h2>Language pattern</h2>') && !/Symbols, meanings and units|The formulas and what they mean|Conditions and limits/.test(h), `${at}: language headings, not formula headings`);
    for (const x of [l.purpose, ...l.explanation, l.language_pattern.form, l.language_pattern.meaning, l.language_pattern.limits, ...l.takeaways, l.scope]) assert.ok(h.includes(H(x)), `${at}: text shown: ${x.slice(0, 40)}`);
    // Two fully visible worked examples: model text marked as a quotation, with every annotation.
    assert.equal(l.worked_examples.length, 2, `${at}: two worked examples`);
    assert.equal((h.match(/<figure class="model-text">/g) || []).length, 2, `${at}: two model texts`);
    for (const e of l.worked_examples) {
      for (const para of e.model.split(/\n{2,}/)) assert.ok(h.includes(H(para).replace(/\n/g, '<br>')), `${at}: model of "${e.title}" is shown in full`);
      for (const a of [e.context, e.meaning, ...e.annotations]) assert.ok(h.includes(H(a)), `${at}: "${e.title}": ${a.slice(0, 40)}`);
    }
    // Incorrect drafts are labelled and styled apart from explanations and models.
    for (const m of l.common_mistakes) {
      assert.ok(h.includes(`<strong>Draft (not correct):</strong> <span class="draft-text">${H(m.draft)}</span>`), `${at}: draft labelled as not correct`);
      assert.ok(h.includes(H(m.revision)) && h.includes(H(m.reason)), `${at}: revision and reason shown`);
    }
    // Written models of listening and speaking are labelled honestly; there is no player.
    const recording = l.media_status === 'recording_required';
    assert.equal(h.includes('class="media-note"'), recording, `${at}: written-model notice only where recordings are missing`);
    if (recording) assert.equal((h.match(/Model script \(written; not yet recorded\)/g) || []).length, 2, `${at}: model scripts labelled as not recorded`);
    // Source alignment links to the English Sources and credits entries.
    for (const id of l.source_refs) {
      assert.ok(registry.has(id), `${at}: known source ${id}`);
      assert.ok(h.includes(`href="/semester-1/english/sources/#source-${id.toLowerCase()}"`), `${at}: credits link for ${id}`);
    }
    // No placement, band, GPA or level claims.
    assert.ok(!/\bband\s*(?:score\s*)?\d|\b(?:A1|A2|B1|B2|C1|C2)\b|\bGPA\b|IELTS [5-9]/.test(text(h)), `${at}: no level, band or grade claim`);
  }
  // Punctuation: curly apostrophes and quotation marks, no stray spaces, in every supplied string.
  for (const s of strings) {
    assert.ok(!/[A-Za-z]'[A-Za-z]|"/.test(s), `straight quote or apostrophe in English text: ${s.slice(0, 60)}`);
    assert.ok(!/ [,.;:!?]| {2}|\s$|^\s/.test(s.replace(/\n/g, '')), `spacing problem in English text: ${s.slice(0, 60)}`);
  }
  // ENG-11: the data are shown before the model, and the model and later lessons agree with them.
  const e11 = eng.find((l) => l.id === 'ENG-11'), h11 = html.get(engPage(e11));
  assert.ok(h11.indexOf('<table>') > 0 && h11.indexOf('<table>') < h11.indexOf('<figure class="model-text">'), 'ENG-11: data table before its model description');
  const [t] = e11.assets;
  const [y15, y20, y25] = t.rows.map(([year, bus, walk, car]) => ({ year, bus, walk, car }));
  for (const r of [y15, y20, y25]) assert.equal(r.bus + r.walk + r.car, 100, `${r.year} shares total 100%`);
  for (const r of [y15, y20, y25]) for (const v of [r.year, r.bus, r.walk, r.car]) assert.ok(h11.includes(`<td>${v}</td>`) || h11.includes(`<th scope="row">${v}</th>`), `ENG-11 table shows ${v}`);
  const m1 = e11.worked_examples[0].model;
  const words = (s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  assert.ok(words(m1) >= 150, `Task 1 model has at least 150 words (${words(m1)})`);
  assert.ok(e11.worked_examples[0].context.includes(`2015: bus ${y15.bus}, walking ${y15.walk}, car ${y15.car}. 2020: bus ${y20.bus}, walking ${y20.walk}, car ${y20.car}. 2025: bus ${y25.bus}, walking ${y25.walk}, car ${y25.car}.`), 'ENG-11 context repeats the table');
  const claims = [
    [y15.bus === y15.car && y15.bus === 40 && y15.walk === 20, 'In 2015, buses and cars each represented 40% of the sample, whereas walking accounted for the remaining 20%.'],
    [y20.bus === 50, 'the bus share had risen to 50%'],
    [y20.walk === y20.car && y20.walk === 25, 'Walking and car travel were then equal at 25% each.'],
    [y25.bus === 55 && y25.bus > 50, 'the proportion reporting bus travel had reached 55%'],
    [y25.walk === 30, 'walking had increased to 30%'],
    [y25.car === 15 && y15.car - y25.car === 25, 'Car travel, in contrast, had declined to 15%, a fall of 25 percentage points from its initial level.'],
    [y20.walk - y15.walk === 5 && y25.walk - y20.walk === 5, 'at five percentage points between each pair of surveys'],
    [y25.bus - y20.bus < y20.bus - y15.bus, 'the growth in bus use slowed in the second interval'],
    [y20.bus > Math.max(y20.walk, y20.car) && y25.bus > Math.max(y25.walk, y25.car), 'Bus travel was the largest category in the final two surveys'],
    [y25.bus > 50, 'by 2025 it accounted for more than half of the responses'],
    [y25.walk > y15.walk && y25.bus > y15.bus && y25.car < y15.car, 'Overall, bus use and walking became more common, while the proportion travelling mainly by car fell.'],
  ];
  for (const [ok, sentence] of claims) { assert.ok(m1.includes(sentence), `ENG-11 model states: ${sentence}`); assert.ok(ok, `ENG-11 data support: ${sentence}`); }
  const pts = y25.bus - y15.bus, rel = (pts / y15.bus) * 100;
  assert.equal(pts, 15); assert.equal(rel, 37.5);
  assert.ok(e11.worked_examples[1].model.includes(`${pts} percentage points, equivalent to a ${rel}% increase`), 'ENG-11 relative change');
  assert.ok(e11.explanation[1].includes('15 divided by 40, or 37.5%'), 'ENG-11 explanation arithmetic');
  const e19 = eng.find((l) => l.id === 'ENG-19').worked_examples[0].model;
  assert.ok(e19.includes(`from ${y15.bus}% in 2015 to ${y25.bus}% in 2025, a rise of ${pts} percentage points`) && e19.includes(`from ${y15.car}% to ${y25.car}%`), 'ENG-19 presentation matches the ENG-11 data');
  assert.ok(eng.find((l) => l.id === 'ENG-20').worked_examples[0].model.includes('forty per cent / to fifty-five per cent. / That is an increase of fifteen percentage points'), 'ENG-20 spoken numbers match the data');
  const e12 = eng.find((l) => l.id === 'ENG-12').worked_examples[0].model;
  assert.ok(e12.includes('outlet flow of 150 kg/h') && e12.includes('20/150, or approximately 13.3%') && Math.abs((100 * 0.2) / (100 + 50) * 100 - 13.3) < 0.05, 'ENG-12 mixer arithmetic');
  const m13 = eng.find((l) => l.id === 'ENG-13').worked_examples[0].model;
  assert.ok(words(m13) >= 250, `Task 2 model has at least 250 words (${words(m13)})`);
  // Sources and credits: every reference, with its limits, and no implied endorsement.
  for (const s of english.sourceRegistry) {
    assert.ok(engSources.includes(`<li id="source-${s.id.toLowerCase()}" class="source-item"><h3><a href="${H(s.url)}">${H(s.title)}</a></h3>`), `English sources list ${s.id}`);
    assert.ok(engSources.includes(H(s.limit)), `English sources state the limit of ${s.id}`);
  }
  assert.match(text(engSources), /no publisher has reviewed or endorsed this library/);
  assert.match(text(engSources), /the full book and its licensed audio were not available/);
  // The 82 blocks of the earlier English pages are all accounted for on the forwarding pages.
  assert.equal(english.legacy.length, 82);
  assert.deepEqual(ROUTES.map((r) => english.legacy.filter((x) => x.route === r).length), [23, 28, 31]);
  for (const r of ROUTES) {
    const h = html.get(`semester-1/english/old-links/${r}/index.html`);
    for (const l of eng) assert.ok(h.includes(`<li id="topic-${slug(l.title)}"><a href="${l.href}">`), `English ${r} old link: topic ${l.id}`);
    for (const x of english.legacy.filter((y) => y.route === r)) {
      for (const id of x.targets) assert.ok(manifestIds.includes(id), `${x.original}: target ${id} exists`);
      const dest = x.targets.length ? eng.find((l) => l.id === x.targets[0]).href : '/semester-1/english/';
      assert.ok(h.includes(`<li id="${x.anchor}"><a href="${dest}">`), `${x.original} forwards to ${dest}`);
    }
  }
}

// ---------- every page ----------
const deployed = deployedFiles(root);
const toFile = (url) => (url === '/' ? 'index.html' : url.endsWith('/') ? url.slice(1) + 'index.html' : url.slice(1));
for (const [p, h] of html) {
  assert.ok(deployed.has(p), `${p}: must be deployed`);
  assert.match(h, /^<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport"/, `${p}: document basics`);
  assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `${p}: one h1`);
  assert.ok(h.includes('<a class="skip" href="#content">') && h.includes('<main id="content"'), `${p}: skip link`);
  // Reading only: no forms, inputs, buttons, embedded frames or assessment language.
  // The only interactive element is the optional lesson feedback form: exactly one, collapsed,
  // on lesson pages only, with no score, answer or personal fields. Everything else is reading.
  const isLesson = lessonPages.includes(p);
  const feedback = h.match(/<details class="feedback" id="feedback">[\s\S]*?<\/details>/g) || [];
  assert.equal(feedback.length, isLesson ? 1 : 0, `${p}: feedback form only on lesson pages`);
  if (isLesson) {
    const f = feedback[0];
    assert.ok(!/<details[^>]* open/.test(f), `${p}: feedback starts collapsed`);
    assert.deepEqual([...f.matchAll(/<(input|select|textarea|button)\b[^>]*?(?:name="([^"]+)"|type="(submit)")/g)].map((m) => m[2] || m[3]).filter((v, i, a) => a.indexOf(v) === i), ['subject', 'lesson', 'category', 'section', 'comment', 'submit'], `${p}: feedback fields`);
    assert.ok(!/\b(?:score|grade|mark|answer|correct|quiz)\b/i.test(f.replace(/<[^>]+>/g, ' ').replace('nothing here is marked', '')), `${p}: feedback is not assessment`);
  }
  const rest = feedback.length ? h.replace(feedback[0], '') : h;
  assert.ok(!/<(?:form|input|button|select|textarea|iframe)\b/i.test(rest), `${p}: interactive UI`);
  const scripts = [...h.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
  const allowedScript = compat.includes(p) ? '<script src="/semester-1/assets/old-links.js" defer>' : isLesson ? '<script src="/semester-1/assets/feedback.js" defer>' : null;
  assert.deepEqual(scripts, allowedScript ? [allowedScript] : [], `${p}: scripts`);
  // English lessons discuss grades and scores as subject matter (“the survey did not measure grades”,
  // “not a score prediction”), so there the bare words are allowed but every assessment phrase is not.
  const assessment = p.includes('semester-1/english/')
    ? /\b(?:quiz|your answer|check your answer|reveal (?:the )?answers?|submit (?:your|an?) answer|your (?:score|grade|mark|band)|scored? out of|unlock|test yourself|try it yourself|your progress|progress bar|mark as complete|correct answer|choose the correct)\b/i
    : /\b(?:quiz|your answer|check your answer|reveal (?:the )?answer|submit|score|grade[sd]?|unlock|test yourself|try it yourself|your progress|progress bar|mark as complete)\b/i;
  assert.ok(!assessment.test(text(h)), `${p}: assessment language`);
  assert.ok(!/<(?:audio|video|source|track)\b/i.test(h), `${p}: no media player`);
  assert.ok(!/data-question=|data-bayt-check=|class="answer"|Partially available|Under development/i.test(h), `${p}: old assessment markup`);
  // No unrendered markup and no leftover Arabic machine-translation artefacts in student text.
  assert.ok(!/\{\{|\}\}|\^\{|_\{|\*\*/.test(text(h)), `${p}: unrendered markup`);
  assert.ok(!/[؀-ۿ]/.test(h), `${p}: stray Arabic text`);
  assert.ok(!/Boycott|the training|Deletion is|outlet tolerance|gravitational wheel/.test(text(h)), `${p}: known mistranslation`);
  const ids = [...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${p}: duplicate ids`);
  assert.equal((h.match(/href="data:/g) || []).length, 1, `${p}: only the empty icon uses a data: URL`);
  assert.ok(h.includes('<link rel="icon" href="data:,">'), `${p}: empty icon (avoids a /favicon.ico 404)`);
  for (const [, raw] of h.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (raw === 'data:,') continue;
    if (/^https:\/\//.test(raw)) { assert.ok(/^https:\/\/[a-z0-9.-]+\//.test(raw), `${p}: external ${raw}`); assert.ok(sources.includes(p) || /openstax\.org|creativecommons\.org|khanacademy\.org|libretexts\.org|nist\.gov|bipm\.org|iupac\.org/.test(raw), `${p}: publisher link outside Sources and credits: ${raw}`); continue; }
    assert.ok(!/^(?:http:|javascript:|mailto:|data:)/.test(raw), `${p}: unexpected link scheme ${raw}`);
    const [url, anchor] = raw.split('#');
    const target = url ? toFile(url) : p;
    assert.ok(fs.existsSync(path.join(root, target)), `${p}: missing ${raw}`);
    assert.ok(deployed.has(target), `${p}: links to something that is not deployed: ${raw}`);
    if (target.endsWith('.html')) assert.ok(html.has(target), `${p}: link leaves the Semester 1 flow: ${raw}`);
    if (anchor) assert.ok((html.get(target) ?? read(target)).includes(`id="${anchor}"`), `${p}: missing anchor ${raw}`);
  }
}

// ---------- deployment allow-list ----------
for (const f of ['middleware.js', 'gate/gate.js', 'gate/login-page.js', 'vercel.json', 'package.json', 'semester-1/assets/study.css', 'semester-1/assets/old-links.js']) assert.ok(deployed.has(f), `deploys ${f}`);
for (const f of [...deployed]) assert.ok(html.has(f) || /^(?:middleware\.js|vercel\.json|package(?:-lock)?\.json|gate\/[\w-]+\.js|semester-1\/assets\/(?:study\.css|old-links\.js|feedback\.js)|api\/feedback\.js|api\/_lib\/lessons\.js)$/.test(f), `unexpected deployed file ${f}`);
for (const f of ['program/index.html', 'foundations/index.html', 'english/index.html', 'english/book/index.html', 'english/pearson/index.html', 'english/educator/index.html', 'tools/content/english/pack/manifest.json', 'biology/index.html', 'bayt/planner/index.html', 'bayt/app/index.html', 'semester-1/coverage/index.html', 'semester-1/assets/bayt-practice.mjs', 'resources/claude-next.txt', 'data/project.json', 'docs/semester-architecture.md', 'docs/migration-ledger.md', 'tools/build-study.mjs', 'tools/data/study-library.json', 'tools/data/migration-ledger.json', '.env.example', 'chemistry/atomic/index.html', 'ma101/assets/app.js'])
  if (fs.existsSync(path.join(root, f))) assert.ok(!deployed.has(f), `must not deploy ${f}`);
const vercel = JSON.parse(read('vercel.json'));
for (const s of ['/program/:path*', '/foundations/:path*', '/biology/:path*', '/bayt/:path+', '/semester-1/coverage']) assert.ok(vercel.redirects.some((r) => r.source === s && r.destination === '/'), `old URL ${s} redirects to the entrance`);
// /english used to redirect home; it must now lead to the English lessons, and the old
// route pages to their forwarding pages, before the catch-all /english/:path*.
const rIdx = (src) => vercel.redirects.findIndex((r) => r.source === src);
const libraryHome = 'https://baytalfuad.com/ilm-sinaa/student/semester-1';
const migratedDestination = (local) => local.replace('/semester-1', libraryHome);
for (const [src, dest] of [['/english', '/semester-1/english'], ['/english/:path*', '/semester-1/english'], ...ROUTES.map((r) => [`/english/${r}`, `/semester-1/english/old-links/${r}`])]) assert.ok(rIdx(src) >= 0 && vercel.redirects[rIdx(src)].destination === migratedDestination(dest) && !vercel.redirects[rIdx(src)].permanent, `${src} → ${migratedDestination(dest)}`);
for (const r of ROUTES) assert.ok(rIdx(`/english/${r}`) < rIdx('/english/:path*'), `/english/${r} is matched before the catch-all`);
assert.ok(!vercel.redirects.some((r) => r.source.startsWith('/english') && r.destination === '/'), 'no English URL is sent back to the entrance');
for (const c of courses) assert.ok(vercel.redirects.some((r) => r.source === `/${c.id}` && r.destination === `${libraryHome}/${c.path}` && !r.permanent), `old hub /${c.id} redirects to the ${c.id} contents in Bayt Al-Fuad`);
const served = new Set(pages.map((p) => '/' + p.replace(/(?:^|\/)index\.html$/, '')).map((u) => u === '/' ? u : u.replace(/\/$/, '')));
// The owner authorized moving academic pages, while preserving the source site's
// entrance, assets and feedback service. Explicit routes avoid asset redirects.
for (const source of [...served].filter((p) => p.startsWith('/semester-1'))) {
  assert.ok(vercel.redirects.some((r) => r.source === source && r.destination === migratedDestination(source) && !r.permanent), `published academic page ${source} must move to its corresponding destination`);
}
assert.ok(!vercel.redirects.some((r) => r.source === '/semester-1/:path*'), 'no catch-all that would redirect source assets');
for (const untouched of ['/', '/bayt', '/api/feedback', '/login', '/semester-1/assets/study.css', '/semester-1/assets/feedback.js', '/semester-1/assets/old-links.js']) {
  assert.ok(!vercel.redirects.some((r) => r.source === untouched), `${untouched} is preserved on the source site`);
}
for (const r of vercel.redirects) {
  if (r.destination.startsWith('https://')) {
    assert.ok(/^\/(semester-1|ma101|phy101|chemistry|english)(\/|$)/.test(r.source), `external redirect ${r.source} must be academic`);
    assert.ok(r.destination === libraryHome || r.destination.startsWith(libraryHome + '/'), `external redirect ${r.source} stays in the Bayt library`);
    assert.equal(r.permanent, false, `migration ${r.source} remains reversible`);
    continue;
  }
  const [prefix, param] = r.source.split('/:');
  assert.ok(param ? ![...served].some((u) => u.startsWith(prefix + '/')) : !served.has(r.source), `redirect ${r.source} shadows a study page`);
}

// ---------- build hygiene ----------
const scripts = JSON.parse(read('package.json')).scripts;
for (const [name, cmd] of Object.entries(scripts)) if (/^build/.test(name)) assert.equal(cmd, 'node tools/build-study.mjs', `${name} must use the study builder`);
for (const f of fs.readdirSync(path.join(root, 'tools'))) {
  if (!/\.(mjs|py)$/.test(f) || ['build-study.mjs', 'make-ledger.mjs', 'preview-server.mjs', 'check-figures.mjs', 'check-foundation-treatments.mjs', 'semester_curriculum.py', 'fix-unit-notation.py'].includes(f)) continue;
  const src = read(`tools/${f}`);
  if (/writeFileSync|write\(|open\([^)]*['"]w/.test(src)) assert.ok(src.startsWith("import './lib/legacy-guard.mjs';") || src.includes("ALLOW_LEGACY_BUILD"), `legacy writer tools/${f} must be guarded`);
}
const generated = [...pages, 'tools/data/migration-ledger.json', 'docs/migration-ledger.md', 'api/_lib/lessons.js'];
for (const f of ['api/feedback.js', 'api/_lib/lessons.js', 'semester-1/assets/feedback.js']) assert.ok(deployed.has(f), `deploys ${f}`);
// Git may check text out with CRLF on Windows; generators always write LF.
const hashes = () => Object.fromEntries(generated.map((p) => [p, createHash('sha256').update(read(p).replace(/\r\n/g, '\n')).digest('hex')]));
const before = hashes();
execFileSync(process.execPath, ['tools/make-ledger.mjs'], { cwd: root });
execFileSync(process.execPath, ['tools/build-study.mjs'], { cwd: root });
assert.deepEqual(hashes(), before, 'rebuilding the ledger and the pages changes them');

const tally = Object.entries(ledger.notes.reduce((m, n) => ({ ...m, [n.decision]: (m[n.decision] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(', ');
console.log(`Study release: ${pages.length} pages (3 entrances, 4 subject contents, 4 sources, ${all.length} science and ${eng.length} English lessons, ${compat.length} old-link pages); English pack intact, ENG-11 data and models consistent, 82 earlier English blocks forwarded; ${checks} numerical checks (all 259 of aa7c04c traced); ledger: 333 notes (${tally}), ${ledger.sections.length} sections; reading-only; links, anchors and deploy allow-list verified; reproducible build and ledger.`);
