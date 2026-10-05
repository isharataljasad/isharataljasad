/* The specialised entrance (/ and /bayt): Arabic, right-to-left, calm, honest.
 *
 *   node test/home.mjs            structure, honesty, links, deploy, CSP, contrast
 *   node test/home.mjs --launch   also fails while any draft slot (unapproved material) remains
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { deployedFiles } from './lib/deployed.mjs';
import { classify } from '../gate/gate.js';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const home = read('index.html');
const text = (h) => h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
let n = 0; const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

// ---------- document ----------
ok(/^<!doctype html>\s*<html lang="ar" dir="rtl">/.test(home), 'Arabic, right-to-left document');
ok(/<meta name="viewport" content="width=device-width,initial-scale=1">/.test(home), 'viewport');
ok(/<meta name="robots" content="noindex,nofollow,noarchive">/.test(home), 'not indexed before launch');
ok((home.match(/<h1[ >]/g) || []).length === 1, 'one h1');
ok(home.includes('<a class="skip" href="#content">') && home.includes('<main id="content">'), 'skip link');
ok(read('bayt/index.html') === home, '/bayt serves the same entrance');

// ---------- the four owner questions, plus how a lesson is built (the unified method) ----------
const h2 = [...home.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
assert.deepEqual(h2, ['ما الذي يقدمه الموقع الآن؟', 'كيف يُبنى الدرس في هذا المنهج', 'لمن يفيد؟', 'من أين أبدأ؟', 'حدود الخدمة والمحتوى']); n++;

// ---------- honesty: nothing sold, nothing promised, nothing unfinished shown as ready ----------
const t = text(home);
ok(!/﷼|ريال|SAR|\$|USD|سعر|أسعار|اشترك الآن|ادفع|بوابة دفع|checkout|pricing/i.test(t.replace(/لا اشتراكات ولا مدفوعات|ولا توجد اشتراكات أو أسعار أو حسابات/g, '')), 'no prices, payment or sign-up calls');
ok(!/<form|<input|<button|<iframe/i.test(home), 'no forms, inputs or embeds');
ok(!/يشفي|علاج مضمون|نتائج مضمونة|مضمون|الأفضل في|الأول في (?:العالم|المنطقة|المملكة)/.test(t), 'no health or commercial promises');
ok(t.includes('هذه الواجهة لا تقدّم خدمة مدفوعة بعد'), 'states plainly that no paid service exists yet');
ok(t.includes('بكلمة مرور'), 'does not present the password-protected Bayt library as open to everyone');
ok(!/(?<!ت)صحي|سريري|تشخيص|علاج|جرعة|طبيب|MasarCare/.test(t), 'no health or clinical function is claimed for the educational method');
ok(!/Book Foundation|Pearson Foundation|Educator Foundation|Pearson|Educator/.test(t), 'internal model names and publishers are not the visitor-facing identity');
// The lesson path is the real section order of a Semester 1 science lesson (README, unified-learning doc).
assert.deepEqual([...home.matchAll(/<li><b>([^<]+)<\/b>/g)].map((m) => m[1]), ['ما الذي يشرحه الدرس', 'قبل أن تبدأ', 'الفكرة', 'القوانين', 'مثال محلول كامل', 'حالة مختلفة', 'أخطاء شائعة', 'تذكّر']); n++;
for (const [, card] of home.matchAll(/<article class="card">([\s\S]*?)<\/article>/g)) {
  const ready = card.includes('status--ready'), pending = card.includes('status--pending') || card.includes('draft-slot');
  ok(ready !== pending, 'every service card is marked either ready or pending, never both or neither');
}
ok(/aria-disabled="true"[^>]*>قيد الإعداد</.test(home) && !/<a [^>]*aria-disabled/.test(home), 'the unopened service has no live link');
ok(!/Semester 1|MA 101|PHY 101|CHEM 101|subject-card/.test(home), 'no study library content on the entrance');

// ---------- links ----------
const hrefs = [...home.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
for (const h of hrefs) {
  if (h.startsWith('#')) { ok(home.includes(`id="${h.slice(1)}"`), `anchor ${h} exists`); continue; }
  if (h.startsWith('https://')) { ok(/^https:\/\/baytalfuad\.com\//.test(h), `external link ${h} stays in Bayt Al-Fuad`); continue; }
  const f = h === '/' ? 'index.html' : h.slice(1);
  ok(fs.existsSync(path.join(root, f)), `local link ${h} exists`);
}
ok(hrefs.includes('https://baytalfuad.com/ilm-sinaa/student/semester-1'), 'study visitors are sent to Bayt Al-Fuad');
const vercel = JSON.parse(read('vercel.json'));
ok(!vercel.redirects.some((r) => ['/', '/bayt', '/site', '/site/:path*'].includes(r.source)), 'the entrance and its assets are not redirected');
ok(vercel.redirects.filter((r) => r.destination.startsWith('https://baytalfuad.com/ilm-sinaa/')).length >= 60, 'academic redirects to Bayt Al-Fuad are intact');

// ---------- deploy, gate, CSP ----------
const deployed = deployedFiles(root);
const assets = [...home.matchAll(/(?:href|src)="(\/site\/[^"]+)"/g)].map((m) => m[1].slice(1));
const css = read('site/site.css');
const fonts = [...css.matchAll(/url\("(\/site\/fonts\/[^"]+)"\)/g)].map((m) => m[1].slice(1));
for (const f of [...assets, ...fonts]) {
  ok(fs.existsSync(path.join(root, f)), `${f} exists`);
  ok(deployed.has(f), `${f} is deployed`);
  ok(classify('/' + f) === 'public', `${f} is public (the entrance is public)`);
}
ok(['/', '/bayt'].every((p) => classify(p) === 'public'), 'the entrance is public');
ok(classify('/site-old') === 'protected' && classify('/fonts/x.woff2') === 'protected', 'no lookalike or old asset path opens');
ok(!/\sstyle="|<style|<script/i.test(home), 'no inline style or script (CSP allows neither)');
ok(!/https?:\/\//.test(css), 'the stylesheet loads nothing from outside the site');
ok(read('site/bayt-mark.svg').includes('M256 106 399 210 344 378H168L113 210Z'), 'the approved Bayt Al-Fuad mark is used unchanged');

// ---------- calm: no glow, gradients or decorative motion ----------
ok(!/box-shadow|text-shadow|filter:|gradient\(|@keyframes|animation/.test(css), 'no glow, shadow, gradient or animation');

// ---------- contrast of every text/background pair the stylesheet declares (WCAG 2) ----------
const v = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pairs = [
  ['ink on page', v.ink, v.page, 7], ['ink on surface', v.ink, v.surface, 7], ['ink on quiet band', v.ink, v.sunken, 7],
  ['secondary text on page', v.muted, v.page, 4.5], ['secondary text on quiet band', v.muted, v.sunken, 4.5],
  ['links on page', v.primary, v.page, 4.5], ['links on quiet band', v.primary, v.sunken, 4.5],
  ['button text', '#FFFFFF', v.primary, 4.5], ['button text (hover)', '#FFFFFF', v['primary-hover'], 4.5], ['button text (pressed)', '#FFFFFF', v['primary-active'], 4.5],
  ['secondary button (hover)', v.primary, v['primary-tint'], 4.5], ['disabled button', v.muted, v.sunken, 4.5],
  ['kicker and ready badge', v.accent, v.page, 4.5], ['ready badge on card', v.accent, v.surface, 4.5],
  ['info notice text', v.ink, v['accent-tint'], 7], ['info notice label', v.accent, v['accent-tint'], 4.5],
  ['pending label', v['pending-ink'], v['bronze-tint'], 4.5], ['pending badge on card', v['pending-ink'], v.surface, 4.5],
  ['error notice text', v.ink, v['danger-tint'], 7], ['error notice label', v['danger-ink'], v['danger-tint'], 4.5], ['error border', v.danger, v.page, 3],
  ['section numbers', v.bronze, v.page, 4.5], ['section numbers on quiet band', v.bronze, v.sunken, 3],
  ['control borders', v['line-strong'], v.page, 3], ['focus ring', v.focus, v.page, 3],
];
const report = [];
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  ok(r >= min, `${name}: ${r.toFixed(2)}:1 is below ${min}:1`);
  report.push(`${name} ${r.toFixed(1)}`);
}
ok(ratio(v.ink, v.page) < 15, 'body contrast is strong but not black-on-white harsh');

// ---------- launch readiness ----------
const drafts = [...home.matchAll(/data-draft="([^"]+)"/g)].map((m) => m[1]);
if (process.argv.includes('--launch')) {
  assert.deepEqual(drafts, [], `Not ready to launch: unapproved material is still a draft slot (${drafts.join(', ')})`);
}
console.log(`Home: ${n} checks passed. Contrast: ${report.join(' · ')}.`);
if (drafts.length) console.log(`Launch check pending: ${drafts.length} draft slot(s) await approved material — ${drafts.join(', ')}.`);
