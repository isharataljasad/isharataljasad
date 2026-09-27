/* The Semester 1 student experience: entrance → subject → Book / Pearson / Educator
 * or a full topic guide. Checks structure, reading-only behaviour, links and anchors,
 * the teaching content of all 26 topics (including every numerical claim listed in
 * the content files), the placement of all 333 original collection units, the
 * deployment allow-list, and that a rebuild is reproducible. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { deployedFiles } from './lib/deployed.mjs';
import { md } from '../tools/content/markup.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const curriculum = JSON.parse(read('semester-1/curriculum.json'));
const library = JSON.parse(read('tools/data/study-library.json'));
const plan = JSON.parse(read('tools/data/route-plan.json'));
const ROUTES = ['book', 'pearson', 'educator'];
let checks = 0;

// ---------- teaching content ----------
const content = {};
for (const c of curriculum.courses) {
  for (const t of c.topics) {
    const k = (await import(path.join(root, `tools/content/${c.id}/${t.id}.mjs`))).default;
    const at = `${c.id}/${t.id}`;
    content[at] = k;
    assert.ok(k.summary?.length > 40, `${at}: summary`);
    assert.ok(k.why?.length >= 1 && k.idea?.length >= 3, `${at}: explanation of why it matters and the idea`);
    assert.ok(k.background?.length >= 1, `${at}: background`);
    assert.ok(k.definitions?.length >= 3, `${at}: definitions`);
    assert.ok(k.symbols?.length >= 3 && k.symbols.every((s) => s.length === 3), `${at}: symbols with meanings and units`);
    assert.ok(k.formulas?.length >= 3 && k.formulas.every((f) => f.name && f.f && f.when?.length > 10), `${at}: formulas with conditions`);
    assert.ok(k.derivation?.steps?.length >= 2 && k.derivation.steps.every(([d, why]) => d && why), `${at}: reasoning or derivation`);
    assert.ok(k.figure?.svg?.includes('<title id=') && k.figure.svg.includes('<desc id=') && k.figure.caption, `${at}: accessible figure`);
    assert.ok(k.table?.rows?.length >= 3, `${at}: table`);
    assert.ok(k.method?.steps?.length >= 3, `${at}: method`);
    assert.ok(k.examples?.length >= 4, `${at}: at least four fully worked examples`);
    for (const e of k.examples) {
      assert.ok(e.title && e.problem && e.result, `${at}: example "${e.title}" is complete`);
      assert.ok(e.steps.length >= 1 && e.steps.every(([d, why]) => d && why), `${at}: every step of "${e.title}" has its reason`);
    }
    assert.ok(k.mistakes?.length >= 3 && k.scope?.length >= 1, `${at}: misunderstandings and scope`);
    // Every number stated in a worked example or table that is listed here is recomputed.
    assert.ok(k.checks?.length >= 4, `${at}: numerical checks`);
    for (const [label, actual, expected, tol] of k.checks) {
      assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tol + 1e-12, `${at}: numerical check "${label}": ${actual} ≠ ${expected}`);
      checks++;
    }
  }
}

// ---------- page set ----------
const home = ['index.html', 'bayt/index.html', 'semester-1/index.html'];
const hubs = curriculum.courses.flatMap((c) => [`semester-1/${c.path}/index.html`, `${c.id}/index.html`]);
const routePages = curriculum.courses.flatMap((c) => ROUTES.map((r) => `${c.id}/${r}/index.html`));
const guides = curriculum.courses.flatMap((c) => c.topics.map((t) => t.href.slice(1) + 'index.html'));
const pages = [...home, ...hubs, ...routePages, ...guides];
assert.equal(pages.length, 44);
const html = new Map(pages.map((p) => [p, read(p)]));

for (const p of home) {
  const h = html.get(p);
  assert.equal((h.match(/data-subject=/g) || []).length, 3, `${p}: exactly three subjects`);
  for (const c of curriculum.courses) {
    assert.ok(h.includes(`href="/semester-1/${c.path}/"`), `${p}: subject ${c.id}`);
    for (const r of ROUTES) assert.ok(h.includes(`href="/${c.id}/${r}/"`), `${p}: route ${c.id}/${r}`);
  }
}
for (const c of curriculum.courses) {
  for (const p of [`semester-1/${c.path}/index.html`, `${c.id}/index.html`]) {
    const h = html.get(p);
    assert.equal((h.match(/class="engine-card"/g) || []).length, 3, `${p}: three route cards`);
    assert.equal((h.match(/class="topic-row"/g) || []).length, c.topics.length, `${p}: topic rows`);
    for (const t of c.topics) for (const r of ROUTES) assert.ok(h.includes(`href="/${c.id}/${r}/#topic-${t.id}"`), `${p}: ${t.id} in ${r}`);
  }
  // Route pages: every Semester 1 topic, in order, with a compare bar and its route material.
  const placed = new Map();
  for (const r of ROUTES) {
    const p = `${c.id}/${r}/index.html`, h = html.get(p);
    let last = -1;
    for (const t of c.topics) {
      const at = h.indexOf(`<section id="topic-${t.id}" class="route-topic">`);
      assert.ok(at > last, `${p}: topic ${t.id} present and in study order`); last = at;
      const next = h.indexOf('<section id="topic-', at + 10), section = h.slice(at, next > 0 ? next : h.indexOf('id="equation-review"'));
      for (const other of ROUTES.filter((x) => x !== r)) assert.ok(section.includes(`href="/${c.id}/${other}/#topic-${t.id}"`), `${p}: compare ${t.id} → ${other}`);
      assert.ok(section.includes(`href="${t.href}"`), `${p}: compare ${t.id} → full guide`);
      const k = content[`${c.id}/${t.id}`];
      const own = { book: [k.formulas[0].f, k.definitions[0][1]], pearson: [k.method.steps[0], ...k.examples.map((e) => e.result)], educator: [k.idea[0], k.mistakes[0][1]] }[r];
      for (const s of own) assert.ok(section.includes(md(s)), `${p}: ${t.id} route material missing: ${s.slice(0, 40)}`);
    }
    const heads = { book: ['<h3>Definitions</h3>', '<h3>Formulas and their conditions</h3>'], pearson: ['<h3>Method</h3>', '<h3>Worked examples</h3>'], educator: ['<h3>The idea</h3>', '<h3>See it</h3>'] }[r];
    for (const s of heads) assert.equal(h.split(s).length - 1, c.topics.length, `${p}: "${s}" for every topic`);
    // All original units of this collection appear exactly once.
    for (const u of library[c.id][r].units) for (const l of u.lessons) {
      assert.equal(h.split(l.html).length - 1, 1, `${p}: original unit ${l.id} must appear exactly once`);
      placed.set(`${r}/${l.id}`, true);
    }
    assert.ok(h.includes('id="equation-review"'), `${p}: formula reference`);
    if (h.includes('id="beyond"')) assert.match(h, /<section id="beyond" class="route-extra beyond"><h2>[^<]+<\/h2><details>/, `${p}: later-course notes are collapsed and labelled`);
    // Honest attribution: no route may claim to be the publisher’s course.
    assert.ok(/original study (?:material|text)/.test(h), `${p}: original-material statement`);
  }
  assert.equal(placed.size, ROUTES.reduce((n, r) => n + library[c.id][r].units.reduce((m, u) => m + u.lessons.length, 0), 0));
}
assert.equal(routePages.reduce((n, p) => n + (html.get(p).match(/class="lesson (?:math|physics|chemistry)-lesson"/g) || []).length, 0), 333, 'all 333 original units published');
for (const c of curriculum.courses) for (const t of c.topics) {
  const p = t.href.slice(1) + 'index.html', h = html.get(p);
  for (const id of ['why', 'idea', 'background', 'definitions', 'formulas', 'visual', 'method', 'examples', 'mistakes', 'scope']) assert.ok(h.includes(`<section id="${id}" class="reading-section">`), `${p}: section ${id}`);
  assert.equal((h.match(/class="worked-example"/g) || []).length, content[`${c.id}/${t.id}`].examples.length, `${p}: worked examples`);
  for (const r of ROUTES) assert.ok(h.includes(`href="/${c.id}/${r}/#topic-${t.id}"`), `${p}: compare → ${r}`);
}

// ---------- every page ----------
const deployed = deployedFiles(root);
const toFile = (url) => (url === '/' ? 'index.html' : url.endsWith('/') ? url.slice(1) + 'index.html' : url.slice(1));
for (const [p, h] of html) {
  assert.ok(deployed.has(p), `${p}: must be deployed`);
  assert.match(h, /^<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport"/, `${p}: document basics`);
  assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `${p}: one h1`);
  assert.ok(h.includes('<a class="skip" href="#content">') && h.includes('<main id="content"'), `${p}: skip link`);
  // Reading only: no forms, inputs, buttons, scripts, embedded frames or assessment language.
  assert.ok(!/<(?:form|input|button|select|textarea|script|iframe)\b/i.test(h), `${p}: interactive or scripted UI`);
  assert.ok(!/\b(?:quiz|your answer|check your answer|reveal (?:the )?answer|submit|score|grade[sd]?|unlock|test yourself|try it yourself|your progress|progress bar|mark as complete)\b/i.test(h.replace(/<[^>]+>/g, ' ')), `${p}: assessment language`);
  assert.ok(!/data-question=|data-bayt-check=|class="answer"|Partially available|Under development/i.test(h), `${p}: old assessment markup`);
  // No unrendered markup and no leftover Arabic machine-translation artefacts in student text.
  const text = h.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
  assert.ok(!/\{\{|\}\}|\^\{|_\{|\*\*/.test(text), `${p}: unrendered markup`);
  assert.ok(!/[؀-ۿ]/.test(h), `${p}: stray Arabic text`);
  assert.ok(!/Boycott|the training|Deletion is|outlet tolerance|gravitational wheel/.test(text), `${p}: known mistranslation`);
  const ids = [...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${p}: duplicate ids`);
  for (const [, raw] of h.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^https:\/\//.test(raw)) { assert.ok(/^https:\/\/(?:www\.)?(?:pearson\.com|openstax\.org|youtube\.com|www\.youtube\.com|youtu\.be|khanacademy\.org|www\.khanacademy\.org)\//.test(raw) || /^https:\/\/[a-z0-9.-]+\//.test(raw), `${p}: external ${raw}`); continue; }
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
for (const f of ['middleware.js', 'gate/gate.js', 'gate/login-page.js', 'vercel.json', 'package.json', 'semester-1/assets/study.css']) assert.ok(deployed.has(f), `deploys ${f}`);
for (const f of [...deployed]) assert.ok(html.has(f) || /^(?:middleware\.js|vercel\.json|package(?:-lock)?\.json|gate\/[\w-]+\.js|semester-1\/assets\/study\.css|(?:ma101|phy101|chemistry)\/assets\/(?:book|pearson|educator)\/[\w.-]+\.png)$/.test(f), `unexpected deployed file ${f}`);
for (const f of ['program/index.html', 'foundations/index.html', 'english/index.html', 'biology/index.html', 'bayt/planner/index.html', 'bayt/app/index.html', 'semester-1/coverage/index.html', 'semester-1/assets/bayt-practice.mjs', 'resources/claude-next.txt', 'data/project.json', 'docs/semester-architecture.md', 'tools/build-study.mjs', '.env.example', 'chemistry/atomic/index.html'])
  if (fs.existsSync(path.join(root, f))) assert.ok(!deployed.has(f), `must not deploy ${f}`);
const vercel = JSON.parse(read('vercel.json'));
for (const s of ['/program/:path*', '/foundations/:path*', '/english/:path*', '/biology/:path*', '/bayt/:path+', '/semester-1/coverage']) assert.ok(vercel.redirects.some((r) => r.source === s && r.destination === '/'), `old URL ${s} redirects to the entrance`);
assert.ok(!vercel.redirects.some((r) => /^\/(?:semester-1|ma101|phy101|chemistry)(?:\/(?:math|physics|chemistry|book|pearson|educator))?\/?$/.test(r.source)), 'no redirect may shadow a study page');

// ---------- build hygiene ----------
const scripts = JSON.parse(read('package.json')).scripts;
for (const [name, cmd] of Object.entries(scripts)) if (/^build/.test(name)) assert.equal(cmd, 'node tools/build-study.mjs', `${name} must use the study builder`);
for (const f of fs.readdirSync(path.join(root, 'tools'))) {
  if (!/\.(mjs|py)$/.test(f) || ['build-study.mjs', 'preview-server.mjs', 'check-figures.mjs', 'check-foundation-treatments.mjs', 'semester_curriculum.py', 'fix-unit-notation.py'].includes(f)) continue;
  const src = read(`tools/${f}`);
  if (/writeFileSync|write\(|open\([^)]*['"]w/.test(src)) assert.ok(src.startsWith("import './lib/legacy-guard.mjs';") || src.includes("ALLOW_LEGACY_BUILD"), `legacy writer tools/${f} must be guarded`);
}
const hashes = () => Object.fromEntries(pages.map((p) => [p, createHash('sha256').update(read(p)).digest('hex')]));
const before = hashes();
execFileSync(process.execPath, ['tools/build-study.mjs'], { cwd: root });
assert.deepEqual(hashes(), before, 'rebuild changes the published pages');

console.log(`Study release: ${pages.length} pages (3 entrances, 6 hubs, 9 routes, 26 guides); ${checks} numerical checks; all 333 original units placed once; reading-only; links, anchors and deploy allow-list verified; reproducible build.`);
