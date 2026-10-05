/* Launch check for the public entrance. Reads files only (no git, no network), so
 * it can run inside the Vercel build as well as locally and in CI.
 *
 *   node tools/check-launch.mjs                  always check
 *   node tools/check-launch.mjs --if-production  check only when VERCEL_ENV=production
 *                                                (preview deployments stay possible)
 *
 * It verifies that the entrance is complete for its current scope: no draft or
 * pending blocks, no disabled "coming soon" controls, indexable in production while
 * every other path and the login page stay out of search results. It does not
 * judge future commercial decisions (service, prices, name, domain). */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

export function launchProblems() {
  const problems = [];
  const home = read('index.html');
  const text = home.replace(/<[^>]+>/g, ' ');
  if (/data-draft=/.test(home)) problems.push('the entrance still contains a draft slot (data-draft)');
  if (/status--pending|notice--pending|draft-slot/.test(home)) problems.push('the entrance still shows a pending block');
  if (/aria-disabled="true"/.test(home)) problems.push('the entrance still shows a disabled control for something that does not exist');
  if (/بانتظار|لم يُحسم|قيد الإعداد/.test(text)) problems.push('the entrance still describes itself as unfinished');
  if (/<meta name="robots"[^>]*noindex/i.test(home)) problems.push('the entrance carries the preview noindex meta tag');
  if (read('bayt/index.html') !== home) problems.push('/bayt does not serve the same entrance');
  const vercel = JSON.parse(read('vercel.json'));
  const robotsFor = (src) => vercel.headers.filter((h) => h.source === src).flatMap((h) => h.headers).find((h) => h.key === 'X-Robots-Tag');
  if (robotsFor('/(.*)')) problems.push('vercel.json sends X-Robots-Tag on every path, including the entrance');
  if (!/noindex/.test(robotsFor('/(.+)')?.value ?? '')) problems.push('vercel.json must keep every path except / out of search results');
  if (!/x-robots-tag["']?\s*:\s*["']noindex/i.test(read('middleware.js'))) problems.push('the login page must stay noindex');
  return problems;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename);
if (isMain) {
  if (process.argv.includes('--if-production') && process.env.VERCEL_ENV !== 'production') {
    console.log(`Launch check skipped: VERCEL_ENV=${process.env.VERCEL_ENV || 'unset'} (only production deployments are gated).`);
  } else {
    const problems = launchProblems();
    if (problems.length) {
      console.error('Launch check failed:\n  ' + problems.join('\n  '));
      process.exit(1);
    }
    console.log('Launch check passed: the entrance is complete, indexable at /, and every other path and the login page stay noindex.');
  }
}
