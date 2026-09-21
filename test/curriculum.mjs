/* The shared teaching spine: program/concepts.mjs plus what the builder
   generates from it. These checks exist to stop the ledger from ever claiming
   more than the filesystem contains, and to keep every episode accounted for. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { approaches, strands, unitNames, concepts } from '../program/concepts.mjs';
import { catalog as programme } from '../program/catalog.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const episodes = JSON.parse(read('foundations/reading/catalog.json'));
const coverage = JSON.parse(read('program/coverage.json'));

/* ---- the registry itself ---- */
assert.equal(approaches.length, 3, 'three student-facing routes');
assert.deepEqual(approaches.map((a) => a.number), [1, 2, 3]);
for (const a of approaches) assert.ok(a.name && a.purpose && a.bestFor, `approach ${a.number} needs a name, purpose and bestFor`);

const ids = concepts.map((c) => c.id);
assert.equal(new Set(ids).size, ids.length, 'concept ids are unique');
const slugs = concepts.map((c) => c.slug);
assert.equal(new Set(slugs).size, slugs.length, 'concept slugs are unique');
const byId = new Map(concepts.map((c) => [c.id, c]));

for (const c of concepts) {
  assert.ok(/^[A-Z][A-Z0-9-]+-\d{2}$/.test(c.id), `${c.id} is not a stable id of the form AREA-NAME-01`);
  assert.ok(c.title && c.summary && c.evidence, `${c.id} needs a title, summary and evidence note`);
  /* A stable id must not encode where the concept currently sits, or moving it
     between units would force a rename and break saved links. */
  assert.equal(/SEMESTER|UNIT\d/.test(c.id), false, `${c.id} encodes placement`);
  for (const id of [...c.prerequisites, ...c.next]) assert.ok(byId.has(id), `${c.id} -> unknown concept ${id}`);
  for (const id of c.prerequisites) {
    assert.ok(byId.get(id).next.includes(c.id), `${id} is a prerequisite of ${c.id} but does not list it in next`);
  }
  for (const code of c.courses) {
    assert.ok(programme.courses.some((x) => x.id === code), `${c.id} -> unknown course ${code}`);
  }
}

/* ---- every episode is accounted for, exactly once ---- */
const unitKeyOf = (item) => item.title.includes(' - ')
  ? `${item.track}/${item.title.split(' - ')[0].trim()}`
  : `${item.track}/${String(item.episode).split('.')[0]}`;

const units = new Map();
for (const item of episodes) {
  const key = unitKeyOf(item);
  if (!units.has(key)) units.set(key, []);
  units.get(key).push(item);
}
assert.equal([...units.values()].reduce((n, l) => n + l.length, 0), episodes.length, 'every episode lands in one unit');
assert.equal(episodes.length, 296, 'the catalogue still holds 296 unique episodes');
assert.equal(JSON.parse(read('foundations/source-files.json')).length, 297, 'still 297 source records');

for (const key of units.keys()) {
  const named = key.includes('/') && /\D/.test(key.split('/')[1]);
  if (!named) assert.ok(unitNames[key], `unit ${key} has no derivable title and none in unitNames`);
}
const trackOfStrand = new Map(strands.flatMap((s) => s.tracks.map((t) => [t, s.id])));
for (const key of units.keys()) assert.ok(trackOfStrand.has(key.split('/')[0]), `unit ${key} belongs to no strand`);

/* ---- the ledger may never overclaim ---- */
const exists = (href) => {
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  return fs.existsSync(path.join(root, clean, 'index.html')) || fs.existsSync(path.join(root, `${clean}.html`));
};

for (const c of concepts) {
  for (const [number, href] of Object.entries(c.approaches)) {
    assert.ok(exists(href), `${c.id} approach ${number} points at a missing page: ${href}`);
  }
}

assert.equal(coverage.deployment.status, 'not-verified', 'a local build must not claim deployment verification');
assert.equal(coverage.episodes.catalogued, 296);
assert.equal(coverage.episodes.sourceRecords, 297);
assert.equal(coverage.episodes.units, units.size);
assert.equal(coverage.concepts.length, concepts.length);

for (const entry of coverage.concepts) {
  const concept = byId.get(entry.id);
  assert.ok(concept, `ledger lists unknown concept ${entry.id}`);
  for (const route of entry.routes) {
    const declared = Boolean(concept.approaches[route.approach]);
    assert.equal(route.written, declared, `${entry.id} route ${route.approach}: ledger says written=${route.written}, registry says ${declared}`);
    if (route.written) {
      assert.ok(exists(route.href), `${entry.id} route ${route.approach} claims a page that does not exist`);
      assert.ok(route.words > 200, `${entry.id} route ${route.approach} has only ${route.words} words; an index entry or stub is not a lesson`);
      /* Generated means rebuildable from a source here; the path must be real. */
      assert.ok(['generated', 'local-file'].includes(route.state), `${entry.id} route ${route.approach} has no state`);
      if (route.state === 'generated') {
        assert.ok(route.source && fs.existsSync(path.join(root, route.source)),
          `${entry.id} route ${route.approach} is marked generated but its source ${route.source} is missing`);
      } else {
        assert.equal(route.source, null, `${entry.id} route ${route.approach} is marked local-file but names a source`);
      }
      /* The counter must never report a bare 0: that hides a parsing failure
         behind a number that reads as "this lesson has no questions". */
      assert.notEqual(route.questions, 0, `${entry.id} route ${route.approach} reports 0 questions; report null when the markup is not recognised`);
      if (route.questions !== null) {
        assert.ok(route.questions > 0 && Number.isInteger(route.questions), `${entry.id} route ${route.approach} has a bad question count`);
        assert.ok(['headed question families', 'numbered question list', 'interactive checks'].includes(route.countedBy),
          `${entry.id} route ${route.approach} did not name how it counted`);
      } else {
        assert.equal(route.countedBy, 'not identified');
      }
      assert.equal(typeof route.answersShown, 'boolean');
    }
  }
}

/* A treatment counted as written must actually teach before it asks. */
for (const entry of coverage.concepts) {
  for (const route of entry.routes.filter((r) => r.written)) {
    const html = read(route.href.replace(/^\//, '').replace(/\/$/, '') + '/index.html');
    const firstQuestion = Math.min(
      ...[/<form[ >]/, /<details[^>]*class="[^"]*answer/, /Question fingerprints/i, /question famil/i]
        .map((re) => { const m = html.match(re); return m ? m.index : Infinity; })
    );
    if (firstQuestion === Infinity) continue;
    const firstExplanation = html.indexOf('<h2');
    assert.ok(firstExplanation > -1 && firstExplanation < firstQuestion,
      `${entry.id} route ${route.approach} asks before it explains`);
  }
}

/* ---- the generated pages ---- */
const index = read('foundations/concepts/index.html');
assert.equal((index.match(/<h1[ >]/g) || []).length, 1);
assert.equal((index.match(/class="unit-block"/g) || []).length, units.size, 'the index shows every unit, including the empty ones');
for (const c of concepts) assert.ok(index.includes(c.title), `concept index omits ${c.id}`);

const ledgerPage = read('program/coverage/index.html');
assert.equal((ledgerPage.match(/<h1[ >]/g) || []).length, 1);
assert.ok(ledgerPage.includes('An indexed episode is not a lesson.'));
assert.ok(ledgerPage.includes('Publication status: not verified.'));
assert.equal(ledgerPage.includes('<dt>Published</dt>'), false, 'file existence must not mean published');
assert.ok(ledgerPage.includes('does not establish that anything has been learned'));
assert.equal(/100% complete|fully covered|all topics taught/i.test(ledgerPage), false, 'the ledger must not claim completeness');

/* Navigation between the treatments of one concept must work in every
   direction, including from a reading chapter back to the generated routes. */
for (const concept of concepts) {
  const routes = Object.entries(concept.approaches);
  if (routes.length < 2) continue;
  for (const [from, fromHref] of routes) {
    const html = read(fromHref.replace(/^\//, '') + 'index.html');
    for (const [to, toHref] of routes) {
      if (from === to) continue;
      assert.ok(html.includes(`href="${toHref}"`),
        `${concept.id}: route ${from} has no link to route ${to} (${toHref})`);
    }
    assert.ok(html.includes('aria-current="page"'), `${concept.id} route ${from} does not mark itself as current`);
  }
}

/* Each generated approach page offers all three routes so a student can switch. */
for (const c of concepts) {
  for (const [number, href] of Object.entries(c.approaches)) {
    if (!href.startsWith('/foundations/concepts/')) continue;
    const html = read(href.replace(/^\//, '') + 'index.html');
    assert.equal((html.match(/class="concept-switch-item/g) || []).length, 3, `${c.id} approach ${number} must show all three routes`);
    assert.ok(html.includes('aria-current="page"'), `${c.id} approach ${number} must mark the current route`);
    for (const wrapper of html.match(/<div class="reading-table-wrap"[^>]*>/g) || []) {
      assert.match(wrapper, /tabindex="0"/, 'scrollable tables stay keyboard reachable');
    }
  }
}

const live = concepts.reduce((n, c) => n + Object.keys(c.approaches).length, 0);
console.log(`Curriculum: ${concepts.length} concepts, ${units.size} units, ${episodes.length} episodes accounted for, ${live} treatments, ledger consistent with the filesystem.`);
