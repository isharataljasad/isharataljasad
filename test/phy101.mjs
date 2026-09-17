import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

const root = new URL('../phy101/', import.meta.url);
const hub = readFileSync(new URL('index.html', root), 'utf8');
for (const route of ['book', 'educator', 'pearson']) {
  assert.ok(hub.includes(`/phy101/${route}/`), `hub link to ${route}`);
}
assert.ok(!hub.includes('Arena map in progress'), 'replaced Physics placeholder');

const expected = {book: 35, educator: 37, pearson: 28};
for (const [route, count] of Object.entries(expected)) {
  const html = readFileSync(new URL(`${route}/index.html`, root), 'utf8');
  assert.match(html, /<html lang="en" dir="ltr">/);
  assert.equal((html.match(/class="lesson physics-lesson"/g) || []).length, count, `${route} lesson count`);
  assert.equal((html.match(/<div class="practice">/g) || []).length, count, `${route} independent check count`);
  assert.ok(html.includes('Decision index') && html.includes('Mixed practice') && html.includes('Equation review'));
  assert.ok(!html.includes('.docx'), `${route} is a native study page`);
  for (const match of html.matchAll(/(?:src|href)="(\/phy101\/assets\/[^"#]+)"/g)) {
    assert.ok(existsSync(new URL(`..${match[1]}`, root)), `missing ${match[1]}`);
  }
  for (const other of Object.keys(expected).filter(x => x !== route)) {
    assert.ok(!html.includes(`/phy101/assets/${other}/`), `${route} should not use ${other} assets`);
  }
  if (route !== 'pearson') assert.ok(!html.includes('pearson.com/channels/physics/'));
}
assert.ok(existsSync(new URL('assets/physics.css', root)));
assert.ok(existsSync(new URL('assets/physics.js', root)));
console.log('PHY 101 checks passed: 3 independent routes, 100 lessons, complete assets, and native practice.');
