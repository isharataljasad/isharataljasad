/* Rules the interactive check data has to obey.

   These are the promises the practice routes make to a reader, expressed as
   assertions so they cannot quietly lapse:

   - a wrong answer leads to a DIFFERENT problem, not the same one re-asked
     after its solution has been shown;
   - an anticipated wrong value is far enough from the right one to be
     distinguishable, and from every other anticipated value;
   - explanations describe a possibility, not a certain diagnosis;
   - every check is reachable from a built page and its data file. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { conceptChecks } from '../program/concept-checks.mjs';
import { concepts } from '../program/concepts.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

let checks = 0;
const ok = (label, fn) => { fn(); checks += 1; void label; };

const bySlug = new Map(concepts.map((c) => [c.slug, c]));
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

let totalChecks = 0;

for (const [slug, list] of Object.entries(conceptChecks)) {
  const concept = bySlug.get(slug);

  ok(`${slug}: belongs to a registered concept with a practice route`, () => {
    assert.ok(concept, `${slug} is not a registered concept`);
    assert.ok(concept.approaches['2'], `${slug} has checks but no approach-2 to host them`);
  });

  ok(`${slug}: has at least three checks`, () => {
    assert.ok(list.length >= 3, `${slug} has only ${list.length} checks`);
  });

  const seen = new Set();
  for (const q of list) {
    totalChecks += 1;
    const at = `${slug}/${q.id}`;

    ok(`${at}: unique id, prompt and solution`, () => {
      assert.ok(!seen.has(q.id), `${at}: duplicate id`);
      seen.add(q.id);
      assert.ok(q.prompt && q.prompt.length > 20, `${at}: prompt too short`);
      assert.ok(q.solution && q.solution.length > 30, `${at}: no worked solution`);
      assert.ok(Number.isInteger(q.version) && q.version >= 1, `${at}: needs a version`);
    });

    if (q.kind === 'number') {
      ok(`${at}: numeric answer and a usable tolerance`, () => {
        assert.equal(typeof q.answer, 'number');
        assert.ok(Number.isFinite(q.answer), `${at}: answer must be finite`);
        assert.ok(q.tolerance > 0, `${at}: tolerance must be positive`);
      });

      /* An anticipated wrong value that sits inside the tolerance would be
         accepted as correct, and its explanation would never be shown. */
      ok(`${at}: anticipated wrong values are distinguishable`, () => {
        const values = [];
        for (const r of q.responses ?? []) {
          assert.equal(typeof r.value, 'number', `${at}: response without a value`);
          assert.ok(Math.abs(r.value - q.answer) > q.tolerance,
            `${at}: the response ${r.value} falls inside the tolerance of the correct answer`);
          for (const other of values) {
            assert.ok(Math.abs(r.value - other) > q.tolerance,
              `${at}: responses ${r.value} and ${other} cannot be told apart`);
          }
          values.push(r.value);
        }
      });

      /* "You did X" claims to know a mind from one number. */
      ok(`${at}: explanations are possibilities, not diagnoses`, () => {
        for (const r of q.responses ?? []) {
          assert.ok(r.why && r.why.length > 25, `${at}: response ${r.value} has no explanation`);
          assert.ok(/consistent with|suggests|would follow|may have/i.test(r.why),
            `${at}: response ${r.value} states a diagnosis rather than a possibility: "${r.why.slice(0, 60)}"`);
        }
      });
    } else {
      ok(`${at}: exactly one correct option, and the rest explained`, () => {
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `${at}: needs options`);
        const correct = q.options.filter((o) => o.correct);
        assert.equal(correct.length, 1, `${at}: must have exactly one correct option`);
        for (const o of q.options.filter((x) => !x.correct)) {
          assert.ok(o.why && o.why.length > 25, `${at}: option "${o.label}" has no explanation`);
          assert.ok(!/\byou (?:thought|assumed|believed|forgot|confused)\b/i.test(o.why),
            `${at}: option "${o.label}" states a diagnosis rather than a possibility`);
        }
      });
    }

    /* The point of the follow-up is that it is not the question just revealed. */
    ok(`${at}: the follow-up is a different problem`, () => {
      assert.ok(q.followUp, `${at}: no follow-up problem after a wrong answer`);
      const f = q.followUp;
      assert.ok(f.prompt && f.solution, `${at}: follow-up needs a prompt and a solution`);
      assert.notEqual(norm(f.prompt), norm(q.prompt), `${at}: the follow-up repeats the prompt`);
      if ((f.kind ?? 'number') === 'number') {
        assert.equal(typeof f.answer, 'number', `${at}: follow-up needs a numeric answer`);
        assert.ok(f.tolerance > 0, `${at}: follow-up needs a tolerance`);
      } else {
        assert.equal(f.options.filter((o) => o.correct).length, 1,
          `${at}: follow-up must have exactly one correct option`);
      }
    });
  }

  /* The built page and its data file must actually carry these. */
  const page = `foundations/concepts/${slug}/approach-2/index.html`;
  const data = `foundations/concepts/${slug}/checks.json`;

  ok(`${slug}: built page and data file carry every check`, () => {
    assert.ok(fs.existsSync(path.join(root, page)), `${page} is missing`);
    assert.ok(fs.existsSync(path.join(root, data)), `${data} is missing`);
    const html = read(page);
    const json = JSON.parse(read(data));
    assert.equal(json.checks.length, list.length);
    assert.deepEqual(json.checks, JSON.parse(JSON.stringify(list)), `${slug}: generated questions differ from their source`);
    assert.ok(html.includes(`data-concept-checks="${slug}"`), `${slug}: page does not mount the runtime`);
    assert.ok(html.includes('/foundations/concepts/checks.mjs'), `${slug}: page does not load the runtime`);
    for (const q of list) {
      assert.ok(html.includes(`data-check="${q.id}"`), `${slug}: ${q.id} has no block on the page`);
    }
    /* One form per check plus one per follow-up. */
    const forms = (html.match(/<form/g) || []).length;
    assert.equal(forms, list.length + list.filter((q) => q.followUp).length,
      `${slug}: form count does not match checks plus follow-ups`);
    assert.ok(html.includes('<noscript>'), `${slug}: no fallback for a reader without scripting`);
    assert.ok(/not a measure of mastery/i.test(html), `${slug}: page does not disclaim mastery`);
  });
}

/* Every concept with a practice route this project authored should have
   interaction, so a future concept cannot quietly ship without it. */
ok('every authored practice route has checks', () => {
  const authored = concepts.filter((c) => fs.existsSync(
    path.join(root, `foundations/concepts/source/${c.slug}/approach-2.md`),
  ));
  const without = authored.filter((c) => !conceptChecks[c.slug]);
  assert.deepEqual(without.map((c) => c.slug), ['points-lines-and-planes'],
    'a practice route gained interaction or lost it without this list being updated');
});

console.log(`concept-checks: ${checks} checks passed over ${totalChecks} questions.`);
