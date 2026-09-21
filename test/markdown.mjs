/* The shared Markdown renderer, and the table bug it used to have.

   Splitting a table row on every `|` broke any cell holding a formula with
   absolute-value bars: `| \`AB = |a - b|\` |` became three cells. The header of
   Measuring Segments ended up with six cells over four-cell body rows, and a
   row in Midpoints had seven cells in a three-column table. Neither failed the
   build, because nothing compared the row widths. Both are checked here. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { splitRow, renderMarkdown, makeInline, externalOrLocal } from '../tools/lib/markdown.mjs';

const root = path.resolve(import.meta.dirname, '..');
const inline = makeInline(externalOrLocal);
const render = (md) => renderMarkdown(md, { source: '(test)', inline });

/* ---- the splitter itself ---- */
assert.deepEqual(splitRow('| a | b | c |'), ['a', 'b', 'c']);
assert.deepEqual(splitRow('| `AB = |a - b|` | 5 |'), ['`AB = |a - b|`', '5']);
assert.deepEqual(splitRow('| How far apart? | `|a - b|` | `|-3 - 9| = 12` |'),
  ['How far apart?', '`|a - b|`', '`|-3 - 9| = 12`']);
assert.deepEqual(splitRow('| `a|b|c` |'), ['`a|b|c`'], 'every pipe inside one code span stays in the cell');
assert.deepEqual(splitRow('|  padded  |  cells  |'), ['padded', 'cells'], 'cells are trimmed');

/* ---- a real table with bars survives rendering ---- */
const withBars = render(`# T

## S

| \`a\` | \`b\` | \`AB = |a - b|\` |
| --- | --- | --- |
| \`2\` | \`7\` | \`5\` |
`);
const headerCells = (withBars.body.match(/<th[ >]/g) || []).length;
const bodyCells = (withBars.body.match(/<td[ >]/g) || []).length;
assert.equal(headerCells, 3, 'three header cells, not six');
assert.equal(bodyCells, 3);
assert.ok(withBars.body.includes('AB = |a - b|'), 'the formula keeps both bars');

/* ---- a ragged table must now stop the build ---- */
assert.throws(() => render(`# T

## S

| a | b |
| --- | --- |
| 1 | 2 | 3 |
`), /has 3 cells but the header has 2/, 'a row wider than the header fails loudly');

assert.throws(() => render(`# T

## S

| a | b | c |
| --- | --- | --- |
| 1 | 2 |
`), /has 2 cells but the header has 3/, 'a row narrower than the header fails loudly');

/* ---- emphasis and blockquotes render, rather than shipping as characters ----

   Both were being swallowed into paragraphs, so seven pages reached students
   with literal *beyond* and "> Plane M contains line g". */
const emphasised = render('# T\n\n## S\n\nA point *beyond* the endpoint is **only** on one ray.\n');
assert.ok(emphasised.body.includes('<em>beyond</em>'), 'single asterisks become emphasis');
assert.ok(emphasised.body.includes('<strong>only</strong>'), 'double asterisks still become strong');
assert.equal(/\*/.test(emphasised.body), false, 'no asterisk survives into the output');

/* An asterisk with space around it is arithmetic, not emphasis. */
const arithmetic = render('# T\n\n## S\n\nCompute 3 * 4 * 5 here.\n');
assert.ok(arithmetic.body.includes('3 * 4 * 5'), 'spaced asterisks are left alone');

const quoted = render('# T\n\n## S\n\n> Plane `M` contains line `g`.\n> Point `C` lies in `M`.\n\nAfter the quote.\n');
assert.ok(quoted.body.includes('<blockquote><p>'), 'a quoted line becomes a blockquote');
assert.ok(quoted.body.includes('contains line <code>g</code>'), 'inline markup still runs inside a quote');
assert.ok(quoted.body.includes('Point <code>C</code> lies'), 'consecutive quoted lines join into one paragraph');
assert.ok(quoted.body.includes('<p>After the quote.</p>'), 'the paragraph after the quote is separate');

/* ---- Markdown the renderer does not implement must stop the build ---- */
for (const [snippet, expected] of [
  ['#### Too deep', /headings deeper than/],
  ['![alt](x.png)', /figure registry/],
  ['* a bullet', /use "- " for a bullet list/],
  ['+ a bullet', /use "- " for a bullet list/],
  ['---', /horizontal rules/],
  ['```js', /fenced code blocks/],
  ['  - nested', /nested lists/],
]) {
  assert.throws(() => render(`# T\n\n## S\n\n${snippet}\n`), expected, `"${snippet}" should raise`);
}

/* ---- and no published page ships an unrendered marker ----
   Only these two shapes are checked: a paragraph that opens with a quote
   marker, and asterisk-delimited text. A bare > elsewhere is mathematics. */
const literalMarkup = [];

const SKIP = new Set(['node_modules', '.git', '.github', '.claude', 'test', 'security', 'docs', 'source', 'tools']);
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const ragged = [];
let tables = 0;
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [table] of html.matchAll(/<table>[\s\S]*?<\/table>/g)) {
    tables++;
    const widths = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
      .map((row) => (row[1].match(/<t[dh][ >]/g) || []).length);
    if (new Set(widths).size > 1) ragged.push(`${path.relative(root, file)}: rows ${widths.join(',')}`);
  }
  const body = (html.match(/<article[\s\S]*?<\/article>/) || [''])[0];
  for (const [hit] of body.matchAll(/<p>&gt; /g)) literalMarkup.push(`${path.relative(root, file)}: paragraph opens with "${hit}"`);
  for (const [hit] of body.replace(/<[^>]+>/g, ' ').matchAll(/\*(?=\S)[^*\n]{1,60}(?<=\S)\*/g)) {
    literalMarkup.push(`${path.relative(root, file)}: unrendered emphasis ${hit}`);
  }
}
assert.deepEqual(ragged, [], `Tables with uneven rows:\n  ${ragged.join('\n  ')}`);
assert.deepEqual(literalMarkup, [], `Markdown reached the page as literal characters:\n  ${literalMarkup.join('\n  ')}`);

console.log(`Markdown: pipes inside code stay in their cell, ragged tables and unsupported syntax fail the build, emphasis and blockquotes render, ${tables} published tables are rectangular.`);
