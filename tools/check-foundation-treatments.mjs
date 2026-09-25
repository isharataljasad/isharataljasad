/* ==========================================================================
   tools/check-foundation-treatments.mjs

   Checks the two treatments that the foundation concepts were missing:
   approach 1 (Curriculum reference) and approach 2 (Guided practice).

   Two things are checked that a word count cannot see.

   First, each treatment has to do its own job. A reference is judged on
   stated definitions, conditions and lookup tables; a practice route on
   decisions the reader makes and on replies that name the error. A route
   that reads like the other one has not been written, only renamed.

   Second, the three routes must not be the same prose three times. The
   written guide already exists for all eleven concepts, so the cheap way
   to "complete" them is to paraphrase it twice. Shingle containment
   measures that directly: how much of a treatment's running text already
   appears in the guide.

     node tools/check-foundation-treatments.mjs
     node tools/check-foundation-treatments.mjs --verbose
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { concepts } from '../program/concepts.mjs';

const root = path.resolve(import.meta.dirname, '..');
const verbose = process.argv.includes('--verbose');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

/* Running prose only: headings, tables and code carry shared vocabulary that
   every route is expected to repeat, so counting them would flag correct work. */
function prose(markdown) {
  return markdown
    .split('\n')
    .filter((line) => !/^#{1,3} /.test(line) && !/^\|/.test(line) && !/^:::/.test(line))
    .join(' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SHINGLE = 8;

function shingles(text) {
  const words = text.split(' ').filter(Boolean);
  const out = new Set();
  for (let i = 0; i + SHINGLE <= words.length; i += 1) out.add(words.slice(i, i + SHINGLE).join(' '));
  return out;
}

/* Containment, not Jaccard: a short reference lifted wholesale from a long
   guide scores low on Jaccard because the guide dwarfs it. Containment asks
   the question that matters — how much of THIS route is already elsewhere. */
function containment(a, b) {
  if (!a.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared += 1;
  return shared / a.size;
}

const MAX_OVERLAP = 0.20;
const MIN_WORDS = 600;

const problems = [];
const rows = [];

for (const concept of concepts) {
  const dir = `foundations/concepts/source/${concept.slug}`;
  const one = `${dir}/approach-1.md`;
  const two = `${dir}/approach-2.md`;
  if (!exists(one) && !exists(two)) continue;

  const guidePath = concept.approaches?.['3'];
  let guideProse = '';
  /* The guide's source lives in a different tree per strand; resolve via
     coverage so this tool does not duplicate the builder's path rules. */
  try {
    const cov = JSON.parse(read('program/coverage.json'));
    const entry = cov.concepts.find((c) => c.id === concept.id);
    const route = entry?.routes?.find((r) => r.name === 'Written teaching guide');
    if (route?.source && exists(route.source)) guideProse = prose(read(route.source));
  } catch { /* coverage not built yet; overlap check is skipped below */ }

  const guideShingles = shingles(guideProse);

  for (const [n, file, kind] of [[1, one, 'reference'], [2, two, 'practice']]) {
    if (!exists(file)) { problems.push(`${concept.id}: ${file} is missing`); continue; }
    const md = read(file);
    const body = prose(md);
    const words = body.split(' ').filter(Boolean).length;
    const at = `${concept.id} approach-${n}`;

    if (!md.startsWith('# ')) problems.push(`${at}: must open with a "# " title`);
    if (words < MIN_WORDS) problems.push(`${at}: ${words} words of prose, below ${MIN_WORDS}`);
    if (!/^## What this route covers/m.test(md))
      problems.push(`${at}: no "What this route covers" section, so the reader cannot tell the routes apart`);
    if (!/^## Move between routes/m.test(md))
      problems.push(`${at}: no "Move between routes" section linking the sibling treatments`);

    const tables = (md.match(/^\|/gm) || []).length;
    const sections = (md.match(/^## /gm) || []).length;

    if (kind === 'reference') {
      /* A reference is a thing you look something up in. */
      if (tables < 6) problems.push(`${at}: needs lookup tables; found ${tables} table rows`);
      if (!/^## .*(Boundary|boundary|limits|Not covered|does not)/m.test(md))
        problems.push(`${at}: no section stating where the rules stop applying`);
      if (!/^## .*(checks after|Checks after)/m.test(md))
        problems.push(`${at}: no "checks after the reference" section (the coverage builder counts these)`);
      const checks = md.slice(md.search(/^## .*(checks after|Checks after)/m));
      if ((checks.match(/^\d+\. /gm) || []).length < 3)
        problems.push(`${at}: fewer than 3 numbered checks`);
    } else {
      /* A practice route is a sequence of decisions with replies. */
      const families = (md.match(/^## Family /gm) || []).length;
      const decisions = (md.match(/^### /gm) || []).length;
      const answers = (md.match(/^:::answer /gm) || []).length;
      if (families < 3) problems.push(`${at}: ${families} question families, needs at least 3`);
      if (decisions < 4) problems.push(`${at}: ${decisions} decision prompts, needs at least 4`);
      if (answers < 2) problems.push(`${at}: ${answers} answer disclosures, needs at least 2`);
      /* Feedback that only says "not quite" leaves the reader where they were. */
      if (!/because|the error|goes wrong|mistake|why this|confus/i.test(md))
        problems.push(`${at}: no reply that names why a wrong answer is wrong`);
    }

    let overlapGuide = null;
    if (guideShingles.size) {
      overlapGuide = containment(shingles(body), guideShingles);
      if (overlapGuide > MAX_OVERLAP)
        problems.push(`${at}: ${(overlapGuide * 100).toFixed(0)}% of its prose already appears in the written guide `
          + `(limit ${MAX_OVERLAP * 100}%) — this route is a paraphrase, not a separate treatment`);
    }

    rows.push({ id: concept.id, n, kind, words, sections, tables, overlapGuide });
  }

  /* The two new routes must also differ from each other. */
  if (exists(one) && exists(two)) {
    const a = shingles(prose(read(one)));
    const b = shingles(prose(read(two)));
    const both = Math.max(containment(a, b), containment(b, a));
    if (both > MAX_OVERLAP)
      problems.push(`${concept.id}: approach-1 and approach-2 share ${(both * 100).toFixed(0)}% of their prose`);
  }
}

if (verbose && rows.length) {
  console.log('concept              route       words  sections  tables  overlap with guide');
  for (const r of rows) {
    console.log(`${r.id.padEnd(20)} ${r.kind.padEnd(10)} ${String(r.words).padStart(5)} `
      + `${String(r.sections).padStart(9)} ${String(r.tables).padStart(7)}  `
      + (r.overlapGuide === null ? '     —' : `${(r.overlapGuide * 100).toFixed(0).padStart(5)}%`));
  }
  console.log('');
}

if (problems.length) {
  console.error(`foundation treatments: ${problems.length} problem(s)`);
  for (const p of problems) console.error('  · ' + p);
  process.exit(1);
}

console.log(`foundation treatments: ${rows.length} route(s) checked, all pass.`);
