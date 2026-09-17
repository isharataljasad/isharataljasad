import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const expect = {book: 34, educator: 46, pearson: 46};

for (const [route, count] of Object.entries(expect)) {
  const html = readFileSync(resolve(root, 'chemistry', route, 'index.html'), 'utf8');
  assert.match(html, /<html lang="en" dir="ltr">/);
  assert.equal((html.match(/class="lesson chemistry-lesson"/g) || []).length, count, `${route} lesson count`);
  assert.match(html, /id="equation-review"/);
  assert.match(html, /id="progress-count"/);
  const localAssets = [...html.matchAll(/(?:src|href)="(\/chemistry\/assets\/[^"#]+)"/g)].map(x => x[1]);
  assert.ok(localAssets.length > 3, `${route} should have real media`);
  for (const url of localAssets) assert.ok(existsSync(resolve(root, url.slice(1))), `missing ${url}`);
  console.log(`${route}: ${count} lessons; ${localAssets.length} local asset references`);
}

const book = readFileSync(resolve(root, 'chemistry/book/index.html'), 'utf8');
assert.match(book, /OpenStax Chemistry 2e/);
assert.match(book, /CC BY 4\.0/);
assert.match(book, /equations\.png/);

const educator = readFileSync(resolve(root, 'chemistry/educator/index.html'), 'utf8');
assert.ok((educator.match(/<details class="answer">/g) || []).length >= 60);

const pearson = readFileSync(resolve(root, 'chemistry/pearson/index.html'), 'utf8');
assert.ok((pearson.match(/#assetId=/g) || []).length >= 25);
assert.match(pearson, /id="decision-index"/);
assert.match(pearson, /id="error-audit"/);

const hub = readFileSync(resolve(root, 'chemistry/study/index.html'), 'utf8');
for (const route of Object.keys(expect)) assert.ok(hub.includes(`/chemistry/${route}/`));
const chemistryHome = readFileSync(resolve(root, 'chemistry/index.html'), 'utf8');
assert.ok(chemistryHome.includes('/chemistry/study/'));
console.log('Chemistry program checks passed.');
