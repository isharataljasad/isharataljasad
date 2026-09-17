import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

const root = new URL('../ma101/', import.meta.url);
const hub = readFileSync(new URL('index.html', root), 'utf8');
for (const route of ['book', 'educator', 'pearson']) {
  assert.ok(hub.includes(`/ma101/${route}/`), `hub link to ${route}`);
}
assert.ok(!hub.includes('Adaptive Learning Arena'), 'obsolete mixed arena removed');

const expected = {book: 39, educator: 39, pearson: 29};
for (const [route, count] of Object.entries(expected)) {
  const html = readFileSync(new URL(`${route}/index.html`, root), 'utf8');
  assert.match(html, /<html lang="en" dir="ltr">/);
  assert.equal((html.match(/class="lesson math-lesson"/g) || []).length, count, `${route} count`);
  assert.equal((html.match(/<details class="answer">/g) || []).length, count, `${route} answer count`);
  assert.equal((html.match(/<div class="practice">/g) || []).length, count, `${route} check count`);
  assert.equal((html.match(/<div class="math-formula">/g) || []).length, count * 2, `${route} equations`);
  assert.ok(html.includes('Decision index') && html.includes('Equation review'));
  assert.ok(!html.includes('.docx') && !html.includes('pages '), `${route} is a native study route`);
  for (const match of html.matchAll(/(?:src|href)="(\/ma101\/assets\/[^"#]+)"/g)) {
    assert.ok(existsSync(new URL(`..${match[1]}`, root)), `missing ${match[1]}`);
  }
  for (const other of Object.keys(expected).filter(x => x !== route)) {
    assert.ok(!html.includes(`/ma101/assets/${other}/`), `${route} uses ${other} assets`);
  }
  if (route !== 'pearson') assert.ok(!html.includes('pearson.com/channels/calculus/learn/'));
}
assert.ok(existsSync(new URL('assets/math.css', root)));
assert.ok(existsSync(new URL('assets/math.js', root)));
console.log('MA 101 checks passed: three independent native routes, 107 lessons, equations, answers, and complete assets.');
