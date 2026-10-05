/* Browser checks for the visitor journey this site serves today, run against the local
 * preview (tools/preview-server.mjs applies vercel.json redirects, headers and the CSP)
 * or a hosted site. Needs Playwright with Chromium, so it is not part of `npm test`:
 *
 *   node test/browser.mjs              (starts its own local preview)
 *   node test/browser.mjs <base-url>   (an already running local or hosted site)
 *
 * The Semester 1 lessons now live in Bayt Al-Fuad (/ilm-sinaa/student/semester-1) and
 * are checked in that repository; here every academic URL must forward there. Checks:
 *   1. the entrance at 1280, 390 and 320 px: no console/CSP errors or failed requests,
 *      no horizontal overflow, self-hosted fonts loaded, readable text size,
 *      one h1, Arabic RTL;
 *   2. keyboard: skip link first and working, every stop has a visible focus ring,
 *      section anchors land on their section;
 *   3. old academic bookmarks: each returns a temporary redirect to its exact
 *      Bayt Al-Fuad destination (not followed: Bayt is password-protected before launch);
 *   4. search policy: / is indexable, every other path carries noindex;
 *   5. the login page (rendered from gate/login-page.js): Arabic RTL, LTR password
 *      field, no overflow at 390 px, visible focus. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { loginPage } from '../gate/login-page.js';

const require = createRequire(import.meta.url);
let playwright;
for (const p of ['playwright', '/opt/npm-tools/node_modules/playwright', '/opt/node22/lib/node_modules/playwright']) { try { playwright = require(p); break; } catch { /* next */ } }
if (!playwright) { console.error('Browser verification failed: Playwright is unavailable. Configure the browser runtime and rerun; no checks were executed.'); process.exit(1); }

const root = path.resolve(import.meta.dirname, '..');
const log = [];
const step = (s) => process.env.DEBUG && console.error('[browser]', s);
let BASE = process.argv[2]?.replace(/\/$/, '');
let preview = null;
if (!BASE) {
  const { spawn } = await import('node:child_process');
  const port = 4190 + Math.floor(Math.random() * 50);
  preview = spawn(process.execPath, ['tools/preview-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((resolve, reject) => { preview.stdout.on('data', (d) => { if (String(d).includes('preview on')) resolve(); }); preview.on('exit', reject); });
  BASE = `http://127.0.0.1:${port}`;
}
process.on('exit', () => preview?.kill());
step('preview at ' + BASE);

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const exe = ['/opt/pw-browsers/chromium', ...fs.readdirSync('/opt/pw-browsers', { withFileTypes: true }).filter((d) => d.name.startsWith('chromium-')).map((d) => `/opt/pw-browsers/${d.name}/chrome-linux/chrome`)].find((p) => { try { return fs.statSync(p).isFile(); } catch { return false; } });
step('launching ' + exe);
const browser = await playwright.chromium.launch(exe ? { executablePath: exe } : {});
step('launched');

// 1–2. The entrance at three widths, and the keyboard journey.
for (const width of [1280, 390, 320]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push('failed: ' + r.url()));
  for (const u of ['/', '/bayt']) {
    step(width + ' ' + u);
    errors.length = 0;
    const res = await page.goto(BASE + u, { waitUntil: 'networkidle' });
    assert.equal(res.status(), 200, `${u} at ${width}px: status ${res.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      dir: getComputedStyle(document.documentElement).direction,
      fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
      h1: document.querySelectorAll('h1').length,
      smallest: Math.min(...[...document.querySelectorAll('main p, main li, main a')].map((e) => parseFloat(getComputedStyle(e).fontSize))),
    }));
    assert.deepEqual(errors, [], `${u} at ${width}px: console, CSP or request errors`);
    assert.equal(m.overflow, 0, `${u} at ${width}px: horizontal overflow ${m.overflow}px`);
    assert.equal(m.dir, 'rtl', `${u}: not right-to-left`);
    assert.equal(m.h1, 1, `${u}: one h1`);
    assert.ok(m.fonts.includes('Plex Arabic') && m.fonts.includes('Amiri House'), `${u} at ${width}px: self-hosted fonts did not load (${m.fonts})`);
    assert.ok(m.smallest >= 14, `${u} at ${width}px: text below 14px (${m.smallest}px)`);
  }
  if (width === 1280) {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const stops = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); return { key: e.outerHTML.slice(0, 80), href: e.getAttribute('href'), visible: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 }; });
      if (!s || (stops.length && s.key === stops[0].key)) break;
      stops.push(s);
    }
    assert.equal(stops[0].href, '#content', 'the skip link is the first stop');
    assert.ok(stops.every((s) => s.visible), 'every keyboard stop shows a visible focus ring');
    assert.ok(stops.length >= 8, `expected the header, sections and Bayt links on the keyboard path, got ${stops.length}`);
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => location.hash), '#content', 'the skip link works');
    for (const id of ['now', 'method', 'start']) {
      await page.click(`.site-nav a[href="#${id}"]`);
      const top = await page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
      assert.ok(Math.abs(top) <= 2, `#${id} did not scroll to its section (top ${top})`);
    }
    log.push(`keyboard: ${stops.length} stops, skip link first, all with visible focus`);
  }
  log.push(`entrance at ${width}px: no errors, no overflow, fonts loaded`);
  await context.close();
}

// 3. Old academic bookmarks forward to their exact Bayt Al-Fuad destination.
const request = (await browser.newContext()).request;
const external = vercel.redirects.filter((r) => r.destination.startsWith('https://baytalfuad.com/ilm-sinaa/'));
let followed = 0;
for (const r of external) {
  const src = r.source.includes('/:') ? r.source.split('/:')[0] + '/anything' : r.source;
  const res = await request.get(BASE + src, { maxRedirects: 0 });
  assert.ok([307, 308].includes(res.status()) || (res.status() === 302), `${src}: expected a redirect, got ${res.status()}`);
  assert.equal(res.headers().location, r.destination, `${src} forwards to the wrong place`);
  followed++;
}
log.push(`${followed} academic URLs forward to their exact Bayt Al-Fuad destinations`);

// 4. Search policy.
const robots = async (u) => (await request.get(BASE + u, { maxRedirects: 0 })).headers()['x-robots-tag'] || '';
assert.ok(!/noindex/.test(await robots('/')), 'the entrance must be indexable');
for (const u of ['/bayt', '/site/site.css']) assert.ok(/noindex/.test(await robots(u)), `${u} must stay out of search results`);
log.push('search policy: / indexable; /bayt and assets noindex');

// 5. The login page, rendered from the gate's own template.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  for (const error of ['', 'كلمة المرور غير صحيحة.']) {
    await page.setContent(loginPage({ nonce: 'n', error }).replace(' nonce="n"', ''));
    const m = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, dir: getComputedStyle(document.body).direction, inputDir: getComputedStyle(document.querySelector('input')).direction }));
    assert.equal(m.overflow, 0, 'login page overflows at 390px');
    assert.equal(m.dir, 'rtl', 'login page is not RTL');
    assert.equal(m.inputDir, 'ltr', 'the password field must stay LTR');
    await page.focus('input');
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'none', 'password field focus is not visible');
  }
  log.push('login page: RTL, LTR password field, no overflow, visible focus (normal and error states)');
  await context.close();
}

await browser.close();
preview?.kill(); // the open stdout pipe would otherwise keep this process alive
console.log('Browser: ' + log.join('; ') + '.');
