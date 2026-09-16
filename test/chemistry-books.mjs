import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const inventory = JSON.parse(read('chemistry/books.json'));
const scope = JSON.parse(read('chemistry/scope.json'));
const html = read('chemistry/index.html');
const books = inventory.books;
const byId = Object.fromEntries(books.map(book => [book.id, book]));
const arenaIds = new Set(scope.arena_targets.map(arena => `CHEM-${arena.id}`));

assert.equal(scope.course_code, 'CHEM 101');
assert.equal(scope.arena_targets.length, 9);
assert.equal(books.length, 7, 'three existing editions plus four added book records');
assert.equal(new Set(books.map(book => book.id)).size, books.length);
assert.deepEqual(books.slice(0, 3).map(book => book.id), ['B1', 'B2', 'B3'], 'preserve original book IDs');
assert.deepEqual(books.slice(3).map(book => book.id), ['B4', 'B5', 'B6', 'B7']);
assert.equal(byId.B2.edition, '6th, standard US edition');
assert.equal(byId.B4.edition, '6th, AP Edition');
assert.equal(byId.B3.edition, '15th, standard US edition');
assert.equal(byId.B5.edition, '15th Global Edition in SI Units');
assert.equal(byId.B1.title, 'Chemistry 2e');
assert.equal(byId.B7.title, 'Chemistry: Atoms First 2e');
assert.notEqual(byId.B1.url, byId.B7.url);

for (const book of books) {
  assert.ok(book.title && book.edition && book.publisher && book.url);
  const url = new URL(book.url);
  assert.equal(url.protocol, 'https:');
  assert.ok(url.hostname === 'openstax.org' || url.hostname === 'www.pearson.com', `unapproved public URL in ${book.id}`);
  assert.ok(book.arena_map && typeof book.arena_map === 'object');
  assert.ok(Object.keys(book.arena_map).every(id => arenaIds.has(id)), `${book.id} maps outside CHEM 101`);
  assert.ok(!('full_text' in book) && !('transcript' in book) && !('copied_problems' in book));
}

assert.equal(Object.keys(byId.B4.arena_map).length, 0, 'do not invent chapter mappings for unreadable AP PDF');
assert.match(byId.B4.verification_status, /PENDING/);
assert.equal(Object.keys(byId.B5.arena_map).length, 9, 'Global SI TOC spans all nine Arenas');
assert.ok(!('CHEM-A9' in byId.B6.arena_map), 'Introductory Chemistry has no verified electrochemistry chapter');
assert.match(byId.B6.arena_map['CHEM-A8'], /PREREQUISITE_ONLY/);
assert.match(byId.B7.arena_map['CHEM-A9'], /^16\./, 'Atoms First has a different electrochemistry chapter number');
assert.match(byId.B1.arena_map['CHEM-A9'], /^17\./, 'preserve regular OpenStax chapter number');
assert.equal(scope.exam_dna_status, 'PENDING_PAST_EXAMS_OR_INSTRUCTOR_MATERIALS');
assert.ok(html.includes('D.b.books.forEach'), 'Chemistry page must render inventory dynamically');
assert.ok(html.includes('books.json'), 'Chemistry page must fetch verified book inventory');

const published = read('chemistry/books.json');
assert.ok(!published.includes('drive.google.com') && !published.includes('1GrKo29QbgI4UjEPV7jHjcm_nfD3OTGVo'), 'no shared private textbook links in public repo');
console.log('PASS Chemistry books: 7 edition-aware records, nine-Arena scope, honest AP/Intro gaps, publisher links only, no private PDFs.');
