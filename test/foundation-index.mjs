import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFileSync(path.join(root, relative), 'utf8');
const esc = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const inventory = JSON.parse(read('foundations/source-files.json'));
const catalog = JSON.parse(read('foundations/reading/catalog.json'));
const groups = { 'Basic Math': ['basic-math', 67], Algebra: ['algebra', 136], Geometry: ['geometry', 71], Trigonometry: ['trigonometry', 23] };
assert.equal(inventory.length, 297);
assert.equal(new Set(inventory.map((item) => `${item.track}|${item.episode}`)).size, 296);
assert.equal(new Set(inventory.map((item) => item.id)).size, 297);
assert.equal(inventory.filter((item) => item.track === 'A2' && item.episode === '30').length, 2);
const home = read('foundations/index.html');
assert.ok(home.includes('297') && home.includes('296') && home.includes('four folders'));
assert.ok(!home.includes('/foundations/assets/app.mjs') && !home.includes('data-question') && !home.includes('Loading Math Foundations'));
for (const [group, [slug, expected]] of Object.entries(groups)) {
  const files = inventory.filter((item) => item.group === group);
  assert.equal(files.length, expected);
  assert.ok(home.includes(`href="/foundations/${slug}/"`));
  const page = read(`foundations/${slug}/index.html`);
  assert.equal((page.match(/class="file-row"/g) ?? []).length, expected);
  assert.ok(page.includes('data-file-search') && page.includes('/foundations/folder-search.mjs'));
  for (const item of files) {
    const url = `foundations/${slug}/files/${item.id}/index.html`;
    assert.ok(existsSync(path.join(root, url)), url);
    const record = read(url);
    assert.ok(record.includes(esc(item.fileName)));
    const chapter = catalog.find((entry) => entry.track === item.track && entry.episode === item.episode);
    assert.ok(chapter);
    if (chapter.url) assert.ok(record.includes(`href="${chapter.url}"`));
    else assert.ok(record.includes('has not been written yet'));
  }
}
console.log('Foundations index: four folders, 297 source records, 296 distinct episodes, and honest chapter states passed.');
