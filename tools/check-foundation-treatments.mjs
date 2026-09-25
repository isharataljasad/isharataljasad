/* ==========================================================================
   tools/check-foundation-treatments.mjs

   Command-line wrapper. The checkable logic lives in
   tools/lib/foundation-treatments.mjs so that test/foundation-treatments.mjs
   can drive it with synthetic registries, including the failure cases an
   independent review found this tool missing.

   What the overlap number does and does not mean: it measures how much of a
   route's running prose appears VERBATIM in the written guide, in runs of
   eight words. A low score shows the text was not copied or lightly
   reworded. It does not establish that the treatments teach differently, and
   it cannot detect a careful paraphrase. It is one indicator; judging whether
   each route does its own job is a reading task, not a measurement.

     node tools/check-foundation-treatments.mjs
     node tools/check-foundation-treatments.mjs --verbose
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { concepts } from '../program/concepts.mjs';
import { check } from './lib/foundation-treatments.mjs';

const root = path.resolve(import.meta.dirname, '..');
const verbose = process.argv.includes('--verbose');

const readingSources = (() => {
  const file = path.join(root, 'foundations/reading/source/manifest.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
})();

const { problems, rows, checked } = check({ concepts, root, readingSources });

if (verbose) {
  console.log('concept              route  shape        words  verbatim overlap with guide');
  for (const r of rows) {
    const overlap = r.number === '3' ? '    —  (is the guide)'
      : r.overlapRan ? `${(r.overlap * 100).toFixed(0).padStart(5)}%` : '  not run';
    console.log(`${r.id.padEnd(20)} ${r.number.padEnd(6)} ${r.shape.padEnd(12)} `
      + `${String(r.words).padStart(5)}  ${overlap}`);
  }
  console.log('');
}

if (problems.length) {
  console.error(`foundation treatments: ${problems.length} problem(s) across ${checked} route(s) checked`);
  for (const p of problems) console.error('  · ' + p);
  process.exit(1);
}

console.log(`foundation treatments: ${checked} route(s) checked against the concept registry, all pass.`);
