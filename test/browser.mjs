/* Browser checks for the Semester 1 pages, run against the local preview
 * (node tools/preview-server.mjs), which applies vercel.json redirects, headers
 * and the CSP. Needs Playwright with Chromium, so it is not part of `npm test`:
 *
 *   node tools/preview-server.mjs &   node test/browser.mjs [http://127.0.0.1:4178]
 * For a gated hosted preview, set BROWSER_STORAGE_STATE to an absolute path outside
 * this repository containing Playwright state exported after legitimate login.
 * The state must belong to the exact preview origin. Never commit or share it.
 *
 * Checks every page at desktop (1280 px) and phone (390 px) width: console and CSP
 * errors, horizontal page overflow, figure text clipped by or overlapping inside its
 * SVG, readable text size, keyboard access (skip link first, scrollable tables
 * focusable). Then follows old bookmarks, including fragments that only a browser
 * can see, and checks where each one lands. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { sequence } from '../tools/content/sequence.mjs';
import * as english from '../tools/content/english/index.mjs';

const require = createRequire(import.meta.url);
let playwright;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { playwright = require(p); break; } catch { /* next */ } }
if (!playwright) { console.error('Browser verification failed: Playwright is unavailable. Configure the browser runtime and rerun; no checks were executed.'); process.exit(1); }

const BASE = (process.argv[2] ?? 'http://127.0.0.1:4178').replace(/\/$/, '');
const root = path.resolve(import.meta.dirname, '..');
const stateFile = process.env.BROWSER_STORAGE_STATE;
if (stateFile) {
  assert.ok(path.isAbsolute(stateFile), 'BROWSER_STORAGE_STATE must be an absolute path outside the repository');
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(stateFile));
  assert.ok(path.isAbsolute(relative) || relative === '..' || relative.startsWith('..' + path.sep), 'Keep authenticated browser state outside the repository');
}
const authenticated = stateFile ? { storageState: stateFile } : {};
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'semester-1/curriculum.json'), 'utf8'));
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'tools/data/migration-ledger.json'), 'utf8'));

const pages = ['/', '/semester-1'];
for (const c of curriculum.courses) {
  pages.push(`/semester-1/${c.path}`, `/semester-1/${c.path}/sources`);
  for (const e of sequence[c.id]) pages.push(`/semester-1/${c.path}/${typeof e === 'string' ? e : e.id}`);
  for (const r of ['book', 'pearson', 'educator']) pages.push(`/${c.id}/${r}?stay`);
}
pages.push('/semester-1/english', '/semester-1/english/sources');
for (const l of english.lessons) pages.push(`/semester-1/english/${l.slug}`);
for (const r of ['book', 'pearson', 'educator']) pages.push(`/semester-1/english/old-links/${r}?stay`);

const browser = await playwright.chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined }).catch(() => playwright.chromium.launch());
const issues = [];
let visits = 0;
for (const width of [1280, 390]) {
  const context = await browser.newContext({ ...authenticated, viewport: { width, height: 900 }, javaScriptEnabled: true });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const u of pages) {
    // Old-link pages forward immediately; check them as pages with scripts off below.
    if (u.endsWith('?stay')) continue;
    errors.length = 0;
    const res = await page.goto(BASE + u, { waitUntil: 'load' });
    visits++;
    if (new URL(page.url()).pathname === '/login' || await page.locator('input[type="password"]').count()) {
      await browser.close();
      throw new Error('Browser verification stopped at an access gate. Supply legitimate authenticated state for this exact origin; hosted lesson checks have not passed.');
    }
    if (res.status() !== 200) { issues.push(`${width} ${u}: HTTP ${res.status()}`); continue; }
    const found = await page.evaluate(() => {
      const out = [];
      const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) out.push(`page overflows by ${de.scrollWidth - de.clientWidth}px`);
      for (const svg of document.querySelectorAll('svg.study-svg')) {
        const vb = svg.viewBox.baseVal, name = svg.getAttribute('aria-labelledby');
        const boxes = [...svg.querySelectorAll('text')].map((t) => { const b = t.getBBox(); return { t: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height }; });
        for (const b of boxes) if (b.x < -1 || b.y < -1 || b.x + b.w > vb.width + 1 || b.y + b.h > vb.height + 1) out.push(`figure text clipped "${b.t}" (${name})`);
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], c = boxes[j];
          if (Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x) > 2 && Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y) > 2) out.push(`figure text overlaps "${a.t}" / "${c.t}" (${name})`);
        }
      }
      for (const el of document.querySelectorAll('main p:not(.eyebrow), main li, main dd, main td, main th')) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 13) { out.push(`text below 13px (${size}px): ${el.textContent.trim().slice(0, 40)}`); break; }
      }
      for (const w of document.querySelectorAll('.table-wrap')) if (w.getAttribute('tabindex') !== '0') out.push('scrollable table not focusable');
      for (const f of document.querySelectorAll('.frac')) if (!f.querySelector('.num')?.textContent.trim() || !f.querySelector('.den')?.textContent.trim()) out.push('empty fraction part');
      return out;
    });
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.className + '|' + document.activeElement?.getAttribute('href'));
    if (first !== 'skip|#content') found.push(`first Tab stop is ${first}, not the skip link`);
    for (const e of errors) found.push(`console: ${e}`);
    for (const x of [...new Set(found)]) issues.push(`${width} ${u}: ${x}`);
  }
  await context.close();
}

// Old-link pages remain readable without JavaScript.
{
  const context = await browser.newContext({ ...authenticated, viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();
  for (const u of pages.filter((x) => x.endsWith('?stay'))) {
    const res = await page.goto(BASE + u.replace('?stay', ''), { waitUntil: 'load' });
    visits++;
    const n = await page.locator('.compat-list li a').count();
    if (res.status() !== 200 || n < 10) issues.push(`no-JS ${u}: status ${res.status()}, ${n} listed destinations`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 1) issues.push(`no-JS ${u}: page overflows by ${over}px`);
  }
  await context.close();
}

// Old bookmarks: server redirects, trailing slashes and fragments.
const note = (key) => ledger.notes.find((n) => n.key === key);
const cases = [
  ['/ma101', '/semester-1/math'],
  ['/phy101/', '/semester-1/physics'],
  ['/chemistry', '/semester-1/chemistry'],
  ['/ma101/book', '/semester-1/math'],
  ['/ma101/book/#topic-derivative', '/semester-1/math/derivative'],
  ['/phy101/pearson#topic-motion', '/semester-1/physics/motion'],
  ['/chemistry/educator/#topic-gases', '/semester-1/chemistry/gases'],
  ['/phy101/book#topic-relative-motion', '/semester-1/physics/relative-motion'],
  ['/semester-1/physics/motion/#support-relative-motion', '/semester-1/physics/motion#support-relative-motion'],
  ['/semester-1/chemistry/bonding#support-chemical-naming', '/semester-1/chemistry/bonding#support-chemical-naming'],
  ['/program/lessons', '/'],
  ['/english', '/semester-1/english'],
  ['/english/', '/semester-1/english'],
  ['/english/index.html', '/semester-1/english'],
  ['/english/pearson', '/semester-1/english'],
  ['/english/book/#lesson-1', `/semester-1/english/${english.lessons.find((l) => l.id === 'ENG-17').slug}`],
  ['/english/educator#lesson-1', `/semester-1/english/${english.lessons.find((l) => l.id === english.legacy.find((x) => x.route === 'educator' && x.anchor === 'lesson-1').targets[0]).slug}`],
  ['/english/pearson/#lesson-24', '/semester-1/english'],
  ['/bayt/planner', '/'],
];
for (const key of ['ma101/book/lesson-07', 'phy101/pearson/lesson-03', 'chemistry/educator/lesson-10', 'ma101/educator/lesson-30']) {
  const n = note(key);
  const [course, route, id] = key.split('/');
  const dest = n.decision === 'archive' ? null : n.destination.replace(/\/(#|$)/, '$1');
  cases.push([`/${course}/${route}/#${id}`, dest]);
}
const context = await browser.newContext({ ...authenticated, viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const results = [];
for (const [from, expected] of cases) {
  await page.goto(BASE + from, { waitUntil: 'load' });
  await page.waitForLoadState('load');
  await page.waitForTimeout(150);
  const at = new URL(page.url());
  const landed = at.pathname + at.hash;
  const targetVisible = at.hash ? await page.evaluate((id) => { const el = document.getElementById(id); if (!el) return false; const r = el.getBoundingClientRect(); return r.top >= -2 && r.top < innerHeight; }, decodeURIComponent(at.hash.slice(1))) : true;
  const ok = expected ? landed === expected : landed.startsWith('/semester-1/');
  results.push(`${ok && targetVisible ? 'ok  ' : 'FAIL'} ${from} → ${landed}`);
  if (!ok) issues.push(`old link ${from} landed on ${landed}, expected ${expected ?? 'a subject page'}`);
  if (!targetVisible) issues.push(`old link ${from}: target ${at.hash} is not in view`);
}

// A student's journey by clicking, at desktop and phone width: entrance → subject → first
// lesson → next lesson, for every subject; then the English data table and full models.
const journeys = [];
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({ ...authenticated, viewport: { width, height: 900 } });
  const tab = await ctx.newPage();
  const subjects = [...curriculum.courses.map((c) => [c.path, sequence[c.id]]), ['english', english.lessons.map((l) => l.slug)]];
  for (const [subjectPath, order] of subjects) {
    const id = (e) => typeof e === 'string' ? e : e.id ?? e;
    await tab.goto(BASE + '/', { waitUntil: 'load' });
    await Promise.all([tab.waitForURL(`**/semester-1/${subjectPath}`), tab.locator(`.subject-card a.button[href="/semester-1/${subjectPath}/"]`).click()]);
    await Promise.all([tab.waitForURL(`**/semester-1/${subjectPath}/${id(order[0])}`), tab.locator('.topic-list a').first().click()]);
    await Promise.all([tab.waitForURL(`**/semester-1/${subjectPath}/${id(order[1])}`), tab.locator('.next-topic a.button').click()]);
    const h1 = await tab.locator('h1').innerText();
    journeys.push(`${width}px ${subjectPath}: entrance → contents → ${id(order[0])} → ${id(order[1])} ("${h1}")`);
  }
  // ENG-11: the table is visible and above the model; the model is shown in full.
  const e11 = english.lessons.find((l) => l.id === 'ENG-11');
  await tab.goto(`${BASE}/semester-1/english/${e11.slug}`, { waitUntil: 'load' });
  const layout = await tab.evaluate(() => {
    const table = document.querySelector('#idea table'), model = document.querySelector('#examples .model-text blockquote');
    const r = (el) => el.getBoundingClientRect();
    return { tableTop: r(table).top, tableH: r(table).height, modelTop: r(model).top, modelH: r(model).height, cells: [...table.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.innerText.trim())), model: model.innerText };
  });
  if (!(layout.tableH > 0 && layout.tableTop < layout.modelTop && layout.modelH > 0)) issues.push(`${width}px ENG-11: table is not shown above its model`);
  if (JSON.stringify(layout.cells) !== JSON.stringify(e11.assets[0].rows.map((r) => r.map(String)))) issues.push(`${width}px ENG-11: table cells differ from the data`);
  const norm = (t) => t.replace(/\s+/g, ' ').trim();
  const words = (t) => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  if (norm(layout.model) !== norm(e11.worked_examples[0].model)) issues.push(`${width}px ENG-11: the rendered model differs from the supplied text`);
  const e13 = english.lessons.find((l) => l.id === 'ENG-13');
  await tab.goto(`${BASE}/semester-1/english/${e13.slug}`, { waitUntil: 'load' });
  const essay = await tab.evaluate(() => document.querySelector('#examples .model-text blockquote').innerText);
  if (norm(essay) !== norm(e13.worked_examples[0].model)) issues.push(`${width}px ENG-13: the rendered essay differs from the supplied text`);
  journeys.push(`${width}px ENG-11 table (3 rows, matches data) above its model, rendered identical to the supplied text; ENG-13 essay rendered in full (${words(essay)} words)`);
  await ctx.close();
}

await context.close();
await browser.close();

console.log(results.join('\n'));
console.log(journeys.join('\n'));
if (issues.length) console.log('\n' + issues.join('\n'));
assert.equal(issues.length, 0, `${issues.length} browser issues`);
console.log(`\nBrowser: ${visits} page visits at 1280 px and 390 px (plus old-link pages without JavaScript), ${cases.length} old bookmarks followed, ${journeys.length} click-through journeys and model checks; no console or CSP errors, overflow, clipped figure text or keyboard problems.`);
