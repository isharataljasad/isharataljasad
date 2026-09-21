import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');
const catalog = JSON.parse(read('foundations/reading/catalog.json'));
assert.equal(catalog.length, 296);
assert.equal(new Set(catalog.map((x) => `${x.track}|${x.episode}|${x.title}`)).size, 296);
assert.deepEqual(Object.fromEntries(['Basic Math', 'Algebra', 'Geometry', 'Trigonometry'].map((group) => [group, catalog.filter((x) => x.group === group).length])), {
  'Basic Math': 67, Algebra: 135, Geometry: 71, Trigonometry: 23,
});
/* Derived from the catalogue, not hardcoded: adding a chapter should not need
   this file edited, but every published count must agree with the catalogue. */
const available = catalog.filter((x) => x.url);
const written = available.length;
assert.ok(written >= 8 && written <= catalog.length, `written chapter count ${written} is out of range`);
assert.ok(read('foundations/index.html').includes('href="/foundations/reading/"'));
const listing = read('foundations/reading/index.html');
const map = read('foundations/reading/map/index.html');
assert.ok(listing.includes(`${written} written chapters`), `listing must state ${written} written chapters`);
assert.equal((map.match(/class="map-state available"/g) ?? []).length, written);
assert.equal((map.match(/class="map-state">Not written yet/g) ?? []).length, catalog.length - written);
for (const item of available) {
  const html = read(path.join(item.url.slice(1), 'index.html'));
  assert.ok(html.includes('<h1>') && html.includes('Coverage before questions'));
  assert.ok(html.indexOf('Coverage before questions') < html.indexOf('question fingerprints'));
  assert.ok(html.indexOf('question fingerprints') < html.indexOf('Answers with reasons'));
  assert.ok(!/Written lesson draft - not published|Educator|Pearson|C:\\Users\\/i.test(html));
  for (const href of html.matchAll(/href="(\/foundations\/reading\/[^"#?]+)"/g)) {
    if (!href[1].endsWith('/')) continue;
    assert.ok(existsSync(path.join(root, href[1].slice(1), 'index.html')), href[1]);
  }
}
/* Every figure a chapter references must exist and carry alternative text. */
for (const item of available) {
  const html = read(path.join(item.url.slice(1), 'index.html'));
  for (const [, src] of html.matchAll(/<img src="(\/foundations\/reading\/figures\/[^"]+)"/g)) {
    assert.ok(existsSync(path.join(root, src.slice(1))), `missing figure ${src}`);
  }
  for (const [tag] of html.matchAll(/<img [^>]*>/g)) {
    assert.match(tag, /alt="[^"]{10,}"/, `figure needs descriptive alternative text: ${tag.slice(0, 70)}`);
  }
}
console.log(`Reading library: ${written} original chapters, four-area map, truthful availability, figures and chapter links passed.`);
