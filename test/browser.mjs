/* Browser checks for the Semester 1 pages, run against the local preview
 * (node tools/preview-server.mjs), which applies vercel.json redirects, headers
 * and the CSP. Needs Playwright with Chromium, so it is not part of `npm test`:
 *
 *   node tools/preview-server.mjs &   node test/browser.mjs [http://127.0.0.1:4178]
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

const require = createRequire(import.meta.url);
let playwright;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { playwright = require(p); break; } catch { /* next */ } }
if (!playwright) { console.log('Playwright is not installed; browser checks skipped.'); process.exit(0); }

const BASE = (process.argv[2] ?? 'http://127.0.0.1:4178').replace(/\/$/, '');
const root = path.resolve(import.meta.dirname, '..');
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'semester-1/curriculum.json'), 'utf8'));
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'tools/data/migration-ledger.json'), 'utf8'));

const pages = ['/', '/semester-1'];
for (const c of curriculum.courses) {
  pages.push(`/semester-1/${c.path}`, `/semester-1/${c.path}/sources`);
  for (const e of sequence[c.id]) pages.push(`/semester-1/${c.path}/${typeof e === 'string' ? e : e.id}`);
  for (const r of ['book', 'pearson', 'educator']) pages.push(`/${c.id}/${r}?stay`);
}

const browser = await playwright.chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined }).catch(() => playwright.chromium.launch());
const issues = [];
let visits = 0;
for (const width of [1280, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: true });
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
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
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
  ['/bayt/planner', '/'],
];
for (const key of ['ma101/book/lesson-07', 'phy101/pearson/lesson-03', 'chemistry/educator/lesson-10', 'ma101/educator/lesson-30']) {
  const n = note(key);
  const [course, route, id] = key.split('/');
  const dest = n.decision === 'archive' ? null : n.destination.replace(/\/(#|$)/, '$1');
  cases.push([`/${course}/${route}/#${id}`, dest]);
}
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
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
await context.close();
await browser.close();

console.log(results.join('\n'));
if (issues.length) console.log('\n' + issues.join('\n'));
assert.equal(issues.length, 0, `${issues.length} browser issues`);
console.log(`\nBrowser: ${visits} page visits at 1280 px and 390 px (plus old-link pages without JavaScript), ${cases.length} old bookmarks followed; no console or CSP errors, overflow, clipped figure text or keyboard problems.`);
