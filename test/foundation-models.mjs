import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFileSync(path.join(root, relative), 'utf8');
const home = read('foundations/index.html');
const overview = read('foundations/models/index.html');
const concept = read('foundations/models/functions-and-domain/index.html');
assert.ok(home.includes('href="/foundations/models/"'));
assert.ok(home.indexOf('The four folders') < home.indexOf('three-model pilot'));
assert.ok(overview.includes('ALG-FUNCTION-01') && concept.includes('Functions and allowed inputs'));

for (const number of [1, 2, 3]) {
  const url = `/foundations/models/functions-and-domain/foundation-${number}/`;
  assert.ok(overview.includes(`href="${url}"`));
  assert.ok(concept.includes(`href="${url}"`));
  const html = read(`${url.slice(1)}index.html`);
  assert.ok(html.includes(`<h1>`) && html.includes(`FOUNDATION ${number}`));
  assert.ok(!/\bPearson\b|\bEducator\b|Book Foundation|Internal model|Editorial source record/.test(html));
  assert.ok(!html.includes('C:\\Users\\'));
  for (const other of [1, 2, 3]) assert.ok(html.includes(`href="/foundations/models/functions-and-domain/foundation-${other}/"`));
}
const book = read('foundations/models/functions-and-domain/foundation-1/index.html');
const guided = read('foundations/models/functions-and-domain/foundation-2/index.html');
const kickstart = read('foundations/models/functions-and-domain/foundation-3/index.html');
assert.ok(book.indexOf('Principle and why it works') < book.indexOf('Distinct checks after the explanation'));
assert.ok(guided.indexOf('The short model before practice') < guided.indexOf('Choose a decision, then try one changed case'));
assert.ok(guided.includes('https://www.pearson.com/channels/calculus/learn/patrick/00-functions/introduction-to-functions#assetId=3e52649e'));
assert.ok(kickstart.indexOf('Coverage before questions') < kickstart.indexOf('Question fingerprints'));
assert.ok(kickstart.includes('/foundations/models/figures/function-mapping.svg'));
assert.ok(existsSync(path.join(root, 'foundations/models/figures/function-mapping.svg')));
console.log('Three-model Foundations pilot: routes, original content order, optional video, figure, and entry link passed.');
