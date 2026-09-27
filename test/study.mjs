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
const home = ['index.html', 'bayt/index.html', 'semester-1/index.html'];
const subjects = courses.map((c) => `semester-1/${c.path}/index.html`);
const sources = courses.map((c) => `semester-1/${c.path}/sources/index.html`);
const lessonPages = all.map((l) => l.href.slice(1) + 'index.html');
const compat = courses.flatMap((c) => ROUTES.map((r) => `${c.id}/${r}/index.html`));
const pages = [...home, ...subjects, ...sources, ...lessonPages, ...compat];
assert.equal(pages.length, 49);
const html = new Map(pages.map((p) => [p, read(p)]));
for (const c of courses) assert.ok(!fs.existsSync(path.join(root, `${c.id}/index.html`)), `${c.id}/index.html: the old subject hub is gone (redirected)`);

for (const p of home) {
  const h = html.get(p);
  const cards = [...h.matchAll(/<article class="subject-card[^"]*" data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
  assert.deepEqual(cards.map((m) => m[1]), courses.map((c) => c.id), `${p}: exactly three subjects`);
  for (const [, id, card] of cards) {
    const c = courses.find((x) => x.id === id);
    assert.deepEqual([...card.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), [`/semester-1/${c.path}/`], `${p}: one action for ${id}`);
  }
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
for (const p of [...home, ...subjects, ...lessonPages]) assert.ok(!branding.test(html.get(p)), `${p}: no route branding or compare bars on student pages`);

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

// ---------- every page ----------
const deployed = deployedFiles(root);
const toFile = (url) => (url === '/' ? 'index.html' : url.endsWith('/') ? url.slice(1) + 'index.html' : url.slice(1));
for (const [p, h] of html) {
  assert.ok(deployed.has(p), `${p}: must be deployed`);
  assert.match(h, /^<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport"/, `${p}: document basics`);
  assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `${p}: one h1`);
  assert.ok(h.includes('<a class="skip" href="#content">') && h.includes('<main id="content"'), `${p}: skip link`);
  // Reading only: no forms, inputs, buttons, embedded frames or assessment language.
  assert.ok(!/<(?:form|input|button|select|textarea|iframe)\b/i.test(h), `${p}: interactive UI`);
  if (!compat.includes(p)) assert.ok(!/<script\b/i.test(h), `${p}: scripts only on old-link pages`);
  assert.ok(!/\b(?:quiz|your answer|check your answer|reveal (?:the )?answer|submit|score|grade[sd]?|unlock|test yourself|try it yourself|your progress|progress bar|mark as complete)\b/i.test(text(h)), `${p}: assessment language`);
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
for (const f of [...deployed]) assert.ok(html.has(f) || /^(?:middleware\.js|vercel\.json|package(?:-lock)?\.json|gate\/[\w-]+\.js|semester-1\/assets\/(?:study\.css|old-links\.js))$/.test(f), `unexpected deployed file ${f}`);
for (const f of ['program/index.html', 'foundations/index.html', 'english/index.html', 'biology/index.html', 'bayt/planner/index.html', 'bayt/app/index.html', 'semester-1/coverage/index.html', 'semester-1/assets/bayt-practice.mjs', 'resources/claude-next.txt', 'data/project.json', 'docs/semester-architecture.md', 'docs/migration-ledger.md', 'tools/build-study.mjs', 'tools/data/study-library.json', 'tools/data/migration-ledger.json', '.env.example', 'chemistry/atomic/index.html', 'ma101/assets/app.js'])
  if (fs.existsSync(path.join(root, f))) assert.ok(!deployed.has(f), `must not deploy ${f}`);
const vercel = JSON.parse(read('vercel.json'));
for (const s of ['/program/:path*', '/foundations/:path*', '/english/:path*', '/biology/:path*', '/bayt/:path+', '/semester-1/coverage']) assert.ok(vercel.redirects.some((r) => r.source === s && r.destination === '/'), `old URL ${s} redirects to the entrance`);
for (const c of courses) assert.ok(vercel.redirects.some((r) => r.source === `/${c.id}` && r.destination === `/semester-1/${c.path}` && !r.permanent), `old hub /${c.id} redirects to the ${c.id} contents`);
const served = new Set(pages.map((p) => '/' + p.replace(/(?:^|\/)index\.html$/, '')).map((u) => u === '/' ? u : u.replace(/\/$/, '')));
for (const r of vercel.redirects) {
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
const generated = [...pages, 'tools/data/migration-ledger.json', 'docs/migration-ledger.md'];
const hashes = () => Object.fromEntries(generated.map((p) => [p, createHash('sha256').update(read(p)).digest('hex')]));
const before = hashes();
execFileSync(process.execPath, ['tools/make-ledger.mjs'], { cwd: root });
execFileSync(process.execPath, ['tools/build-study.mjs'], { cwd: root });
assert.deepEqual(hashes(), before, 'rebuilding the ledger and the pages changes them');

const tally = Object.entries(ledger.notes.reduce((m, n) => ({ ...m, [n.decision]: (m[n.decision] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(', ');
console.log(`Study release: ${pages.length} pages (3 entrances, 3 subject contents, 3 sources, ${all.length} lessons, ${compat.length} old-link pages); ${checks} numerical checks (all 259 of aa7c04c traced); ledger: 333 notes (${tally}), ${ledger.sections.length} sections; reading-only; links, anchors and deploy allow-list verified; reproducible build and ledger.`);
