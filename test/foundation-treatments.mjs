/* Tests for the foundation-treatment checker itself.

   An independent review broke the previous version by pointing its sources at
   a directory that did not exist: it reported "0 route(s) checked, all pass"
   and exited 0. These cases pin that behaviour down, so the tool cannot go
   back to passing when it has checked nothing.

   Each case builds a synthetic registry and a temporary tree, so the real
   content is never modified and a failure here means the checker is wrong,
   not that a lesson is wrong. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { check } from '../tools/lib/foundation-treatments.mjs';

let checks = 0;
const ok = (label, fn) => { fn(); checks += 1; void label; };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'treatments-'));
const write = (rel, text) => {
  const file = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
};

/* Bodies long enough to clear the word floor, with the required structure. */
const filler = (seed) => Array.from({ length: 130 }, (_, i) => `${seed}${i} word here about the idea`).join(' ');

const reference = (seed) => `# Title

## What this route covers

${filler(seed)}

## Where the idea sits

| a | b |
| --- | --- |
| one | two |
| three | four |
| five | six |
| seven | eight |

## Boundary checks

Some limits apply.

## Four checks after the reference

1. First check.
2. Second check.
3. Third check.

## Move between routes

- elsewhere
`;

const practice = (seed) => `# Title

## What this route covers

${filler(seed)}

## Family 1 · One

### Decide: a

:::answer why
Because the mistake is this.
:::

## Family 2 · Two

### Decide: b

### Decide: c

:::answer why
Because the error is that.
:::

## Family 3 · Three

### Decide: d

## Move between routes

- elsewhere
`;

const guide = (seed) => `# Guide\n\n${filler(seed)}\n`;

const conceptAt = (slug, id) => ({
  id,
  slug,
  approaches: {
    1: `/foundations/concepts/${slug}/approach-1/`,
    2: `/foundations/concepts/${slug}/approach-2/`,
    3: `/foundations/reading/x/${slug}/`,
  },
});

const readingSources = { '/foundations/reading/x/good/': 'reading/good.md' };

/* --- 1. a complete set passes ------------------------------------------- */
write('foundations/concepts/source/good/approach-1.md', reference('alpha'));
write('foundations/concepts/source/good/approach-2.md', practice('beta'));
write('reading/good.md', guide('gamma'));

ok('a complete, distinct set passes', () => {
  const r = check({ concepts: [conceptAt('good', 'C-GOOD')], root: tmp, readingSources });
  assert.deepEqual(r.problems, [], 'a correct set should report no problems');
  assert.equal(r.checked, 3);
});

/* --- 2. the review's counter-experiment: nothing on disk ---------------- */
ok('a registry whose sources are all missing fails, and does not report a pass', () => {
  const r = check({ concepts: [conceptAt('nowhere', 'C-GONE')], root: tmp, readingSources: {} });
  assert.ok(r.problems.length > 0, 'missing sources must be reported');
  assert.ok(r.problems.some((p) => /source .* is missing|no source rule matches/.test(p)));
  assert.ok(r.problems.some((p) => /zero routes were checked/.test(p)),
    'checking nothing must itself be a failure');
});

/* --- 3. one file of a pair missing --------------------------------------- */
write('foundations/concepts/source/half/approach-1.md', reference('delta'));
write('reading/half.md', guide('epsilon'));

ok('one missing file of a pair is reported', () => {
  const r = check({
    concepts: [conceptAt('half', 'C-HALF')],
    root: tmp,
    readingSources: { '/foundations/reading/x/half/': 'reading/half.md' },
  });
  assert.ok(r.problems.some((p) => /approach-2: source .* is missing/.test(p)));
  assert.equal(r.checked, 2, 'the two routes that exist are still checked');
});

/* --- 4. the guide's own source missing ---------------------------------- */
write('foundations/concepts/source/noguide/approach-1.md', reference('zeta'));
write('foundations/concepts/source/noguide/approach-2.md', practice('eta'));

ok('a missing guide source is reported, and no comparison is claimed', () => {
  const r = check({
    concepts: [conceptAt('noguide', 'C-NOGUIDE')],
    root: tmp,
    readingSources: { '/foundations/reading/x/noguide/': 'reading/absent.md' },
  });
  assert.ok(r.problems.some((p) => /guide's source could not be read/.test(p)));
  /* The two treatments are still checked, but their overlap was not run. */
  for (const row of r.rows.filter((x) => x.number !== '3')) {
    assert.equal(row.overlapRan, false, 'overlap must not be reported as run');
    assert.equal(row.overlap, null);
  }
});

/* --- 5. deliberate verbatim duplication fails ---------------------------- */
const shared = filler('theta');
write('foundations/concepts/source/copied/approach-1.md', reference('x').replace(filler('x'), shared));
write('foundations/concepts/source/copied/approach-2.md', practice('y').replace(filler('y'), shared));
write('reading/copied.md', `# Guide\n\n${shared}\n`);

ok('a treatment copied from the guide fails the overlap limit', () => {
  const r = check({
    concepts: [conceptAt('copied', 'C-COPIED')],
    root: tmp,
    readingSources: { '/foundations/reading/x/copied/': 'reading/copied.md' },
  });
  assert.ok(r.problems.some((p) => /appears verbatim in the written guide/.test(p)),
    'copying the guide must be caught');
  assert.ok(r.problems.some((p) => /repeat \d+% of each other verbatim/.test(p)),
    'two routes copied from one source must also be caught against each other');
});

/* --- 6. an empty registry is a failure, not a pass ----------------------- */
ok('an empty registry fails', () => {
  const r = check({ concepts: [], root: tmp, readingSources });
  assert.ok(r.problems.some((p) => /registry is empty/.test(p)));
  assert.ok(r.problems.some((p) => /zero routes were checked/.test(p)));
});

/* --- 7. a route the rules cannot resolve is reported --------------------- */
ok('an unmatched href is reported rather than skipped', () => {
  const r = check({
    concepts: [{ id: 'C-ODD', slug: 'odd', approaches: { 1: '/somewhere/else/' } }],
    root: tmp,
    readingSources,
  });
  assert.ok(r.problems.some((p) => /no source rule matches/.test(p)));
});

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`foundation-treatments: ${checks} checks passed.`);
