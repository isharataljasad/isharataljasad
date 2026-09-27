/* Builds the migration ledger: where every original collection note and every
 * section of the earlier guides and support blocks went in the unified lessons.
 *   input:  tools/data/study-library.json, semester-1/curriculum.json,
 *           tools/data/route-plan.json, tools/data/ledger-annotations.json
 *   output: tools/data/migration-ledger.json and docs/migration-ledger.md
 * Run: node tools/make-ledger.mjs  (deterministic; npm test checks it is current). */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = path.resolve(import.meta.dirname, '..');
const J = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const library = J('tools/data/study-library.json'), curriculum = J('semester-1/curriculum.json'), plan = J('tools/data/route-plan.json');
const notesAnn = J('tools/data/ledger-annotations.json');
const { sequence } = await import('../tools/content/sequence.mjs');
const text = (h) => h.replace(/<img[^>]*>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const lessonHref = (c, id) => c.topics.find((t) => t.id === id)?.href ?? `/semester-1/${c.path}/${id}/`;
const lessonIds = (c) => sequence[c.id].map((e) => (typeof e === 'string' ? e : e.id));
const notes = [];
for (const c of curriculum.courses) for (const route of ['book', 'pearson', 'educator']) for (const u of library[c.id][route].units) for (const l of u.lessons) {
  const key = `${c.id}/${route}/${l.id}`;
  const placedTopic = c.topics.find((t) => (t.resources[route] ?? []).includes(l.id))?.id;
  const placement = placedTopic ?? plan[c.id][route][l.id];
  const a = notesAnn[key];
  if (!a) throw new Error(`No ledger annotation for ${key} (${l.title})`);
  if (!['retain', 'rewrite', 'combine', 'archive'].includes(a.decision)) throw new Error(`${key}: bad decision`);
  const lesson = a.lesson ?? (lessonIds(c).includes(placement) ? placement : null);
  if (a.decision !== 'archive' && !lessonIds(c).includes(lesson)) throw new Error(`${key}: destination lesson missing (${lesson})`);
  const external = [...l.html.matchAll(/<a href="(https:\/\/www\.pearson\.com[^"]+)"[^>]*>([^<]+?)\s*↗?<\/a>/g)].map((m) => ({ url: m[1], title: m[2].replace(/\s*↗$/, '').trim() }));
  notes.push({
    key, course: c.id, route, id: l.id, title: l.title, unit: u.title, placement,
    concept: a.concept, decision: a.decision,
    destination: a.decision === 'archive' ? `archive: tools/data/study-library.json#${key}` : lessonHref(c, lesson) + (a.section ? `#${a.section}` : ''),
    reason: a.reason, words: text(l.html).split(' ').length, external,
  });
}
// Duplicates by meaning: notes that share a concept key.
const byConcept = new Map();
for (const n of notes) { const k = `${n.course}:${n.concept}`; if (!byConcept.has(k)) byConcept.set(k, []); byConcept.get(k).push(n.key); }
for (const n of notes) n.duplicates = byConcept.get(`${n.course}:${n.concept}`).filter((k) => k !== n.key);

// Sections of the earlier guides and support blocks.
const sections = [];
const guideParts = [['why', 'Why it matters', 'why'], ['idea', 'The idea', 'idea'], ['background', 'Background you need', 'background'], ['definitions', 'Definitions', 'definitions'], ['formulas', 'Formulas & conditions (with derivation)', 'formulas'], ['visual', 'Figure and table', 'visual'], ['method', 'Method', 'method'], ['examples', 'Worked examples', 'examples'], ['further', 'Going further', 'further'], ['mistakes', 'Common misunderstandings', 'mistakes'], ['scope', 'Scope & limits', 'scope']];
const supportMoves = { 'phy101/motion': ['relative-motion'], 'chemistry/atomic-structure': ['amount-and-formulas'], 'chemistry/bonding': ['chemical-naming', 'intermolecular-forces'] };
const supportLesson = { 'relative-motion': 'relative-motion', 'amount-and-formulas': 'moles-and-formulas', 'chemical-naming': 'chemical-naming', 'intermolecular-forces': 'intermolecular-forces' };
for (const c of curriculum.courses) for (const t of c.topics) {
  const k = (await import(pathToFileURL(path.join(root, `tools/content/${c.id}/${t.id}.mjs`)).href)).default;
  for (const [id, title, dest] of guideParts) {
    if (id === 'further' && !k.extra?.length) continue;
    const extraNote = id === 'examples' ? ` (${k.examples.length} examples: the first under “A first worked example”, the second under “A different case”, the rest under “More worked cases”)` : '';
    sections.push({ source: `${t.href}#${id}`, title: `${t.title}: ${title}`, destination: `${t.href}#${dest}`, decision: 'retain', reason: `Same text in the unified lesson${extraNote}.` });
  }
  for (const s of supportMoves[`${c.id}/${t.id}`] ?? []) sections.push({ source: `${t.href}#support-${s}`, title: `${t.title}: support section “${s}”`, destination: lessonHref(c, supportLesson[s]), decision: 'rewrite', reason: 'Promoted to its own lesson, placed where later lessons first depend on it; the old anchor now points to it.' });
  for (const r of ['book', 'pearson', 'educator']) sections.push({ source: `/${c.id}/${r}/#topic-${t.id}`, title: `${t.title}: ${r} route view`, destination: t.href, decision: 'combine', reason: 'The route views were selections of the same guide text; they are replaced by the one lesson.' });
}
const ledger = { generated: 'tools/make-ledger.mjs', notes, sections };
fs.writeFileSync(path.join(root, 'tools/data/migration-ledger.json'), JSON.stringify(ledger, null, 1) + '\n');

// Human-readable ledger.
const counts = notes.reduce((m, n) => ((m[n.decision] = (m[n.decision] ?? 0) + 1), m), {});
let doc = `# Migration ledger\n\nGenerated by \`tools/make-ledger.mjs\` from \`tools/data/ledger-annotations.json\`. Do not edit by hand.\n\nThe 333 short notes of the earlier Book, Pearson and Educator collections are no longer separate pages. Each note is listed below with the concept it covered, where that concept is now taught, and the decision. The original note text stays recoverable in \`tools/data/study-library.json\` (not deployed).\n\nDecisions: **combine** = the concept is taught in the destination lesson (duplicates across collections are grouped by the concept key); **retain** = a distinct case from the note was added to the lesson; **rewrite** = the note’s content was rewritten into a new lesson; **archive** = outside the published Semester 1 description or of unconfirmed scope, kept only in the source archive.\n\nTotals: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')} (of ${notes.length}).\n\n`;
for (const c of curriculum.courses) {
  doc += `## ${c.code}\n\n| note | title | concept | decision | destination | reason | same concept in |\n|---|---|---|---|---|---|---|\n`;
  for (const n of notes.filter((x) => x.course === c.id)) doc += `| ${n.route}/${n.id} | ${n.title} | ${n.concept} | ${n.decision} | ${n.destination.startsWith('archive') ? 'archive' : n.destination} | ${n.reason} | ${n.duplicates.map((d) => d.split('/').slice(1).join('/')).join(', ')} |\n`;
  doc += '\n';
}
doc += `## Sections of the earlier guides, support blocks and route views\n\n| source | decision | destination | reason |\n|---|---|---|---|\n${sections.map((s) => `| ${s.source} | ${s.decision} | ${s.destination} | ${s.reason} |`).join('\n')}\n`;
fs.writeFileSync(path.join(root, 'docs/migration-ledger.md'), doc);
console.log(`Ledger: ${notes.length} notes (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}), ${sections.length} sections.`);
