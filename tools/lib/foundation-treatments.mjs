/* ==========================================================================
   tools/lib/foundation-treatments.mjs

   The checkable part of "did these foundation treatments actually get
   written", separated from the command-line wrapper so tests can drive it
   with a synthetic registry instead of the real one.

   Design note, after an independent review broke the previous version.

   The earlier checker walked `foundations/concepts/source/<slug>/` and
   skipped any concept whose two files were absent. Point it at a directory
   that does not exist and it reported "0 route(s) checked, all pass" and
   exited 0. A checker that passes when it has checked nothing is worse than
   no checker, because it is quoted as evidence.

   So this version works the other way round: it derives the routes it MUST
   check from the concept registry, resolves each one's source with the same
   rules the builder uses, and fails when a required source is missing, when
   a comparison could not be run, or when the number of routes checked is
   zero.
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

export const MAX_OVERLAP = 0.20;
export const MIN_WORDS = 600;
const SHINGLE = 8;

/* Running prose only. Headings, tables and code carry shared vocabulary that
   every route is expected to repeat, so counting them would flag correct work. */
export function prose(markdown) {
  return markdown
    .split('\n')
    .filter((line) => !/^#{1,3} /.test(line) && !/^\|/.test(line) && !/^:::/.test(line))
    .join(' ')
    /* Strip HTML tags — one source is an HTML lesson — but require a letter
       after the `<`. These treatments use `<` and `>` as comparison signs in
       running prose ("−8 < −3"), and an unanchored tag pattern matches from a
       stray `<` to the next `>`, swallowing hundreds of words between them.
       That silently cut one file's measured length from 744 to 448. */
    .replace(/<\/?[a-zA-Z][^<>]*>/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function shingles(text) {
  const words = text.split(' ').filter(Boolean);
  const out = new Set();
  for (let i = 0; i + SHINGLE <= words.length; i += 1) out.add(words.slice(i, i + SHINGLE).join(' '));
  return out;
}

/* Containment, not Jaccard: a short reference lifted from a long guide scores
   low on Jaccard because the guide dwarfs it. Containment asks how much of
   THIS route already appears elsewhere. */
export function containment(a, b) {
  if (!a.size) return null;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared += 1;
  return shared / a.size;
}

/* Same rules as tools/build-curriculum.mjs. Kept in step deliberately: a
   route the builder can find a source for is a route this must check. */
export function sourceFor(href, readingSources = {}) {
  let m = href.match(/^\/foundations\/concepts\/([^/]+)\/approach-(\d)\/$/);
  if (m) return { file: `foundations/concepts/source/${m[1]}/approach-${m[2]}.md`, shape: `approach-${m[2]}` };
  m = href.match(/^\/foundations\/models\/functions-and-domain\/foundation-(\d)\/$/);
  if (m) return { file: `foundations/models/source/foundation-${m[1]}.md`, shape: `model-${m[1]}` };
  if (readingSources[href]) return { file: readingSources[href], shape: 'reading' };
  if (href === '/program/lessons/material-balances/') {
    return { file: 'program/lessons/source/material-balances.html', shape: 'lesson' };
  }
  return null;
}

/* `check` returns { problems, rows, checked }. It never throws for missing
   content — a missing file is a finding, not a crash — so that one broken
   concept still reports the state of the others. */
export function check({ concepts, root, readingSources = {} }) {
  const problems = [];
  const rows = [];
  const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
  const exists = (p) => fs.existsSync(path.join(root, p));

  if (!concepts.length) problems.push('the concept registry is empty, so nothing could be checked');

  for (const concept of concepts) {
    const registered = Object.entries(concept.approaches ?? {});
    if (!registered.length) {
      problems.push(`${concept.id}: no approaches registered`);
      continue;
    }

    /* Resolve every registered route first. A route whose source cannot be
       located is a finding in itself: the ledger would show it as written. */
    const resolved = new Map();
    for (const [number, href] of registered) {
      const found = sourceFor(href, readingSources);
      if (!found) {
        problems.push(`${concept.id} approach-${number}: no source rule matches ${href}`);
        continue;
      }
      if (!exists(found.file)) {
        problems.push(`${concept.id} approach-${number}: source ${found.file} is missing`);
        continue;
      }
      resolved.set(number, found);
    }

    const guide = resolved.get('3');
    const guideShingles = guide ? shingles(prose(read(guide.file))) : null;
    if (!guideShingles && registered.some(([n]) => n === '3')) {
      problems.push(`${concept.id}: the written guide's source could not be read, so no overlap comparison was run`);
    }

    for (const [number, found] of resolved) {
      /* Structural rules apply to the two treatments this project authored in
         concept-source Markdown. Other shapes are checked for presence and
         substance only, because they are built by different tools. */
      const at = `${concept.id} approach-${number}`;
      const md = read(found.file);
      const body = prose(md);
      const words = body.split(' ').filter(Boolean).length;

      if (words < 120) problems.push(`${at}: only ${words} words of prose, which is not a treatment`);

      let overlap = null;
      let overlapRan = false;
      if (number !== '3' && guideShingles) {
        overlap = containment(shingles(body), guideShingles);
        overlapRan = overlap !== null;
        if (!overlapRan) {
          problems.push(`${at}: too short to compare against the guide, so the overlap check did not run`);
        } else if (overlap > MAX_OVERLAP) {
          problems.push(`${at}: ${(overlap * 100).toFixed(0)}% of its prose appears verbatim in the written guide `
            + `(limit ${MAX_OVERLAP * 100}%)`);
        }
      }

      if (found.shape === 'approach-1' || found.shape === 'approach-2') {
        problems.push(...structural(at, md, body, words, found.shape));
      }

      rows.push({
        id: concept.id, number, shape: found.shape, file: found.file,
        words, overlap, overlapRan,
      });
    }

    const one = resolved.get('1');
    const two = resolved.get('2');
    if (one && two) {
      const a = shingles(prose(read(one.file)));
      const b = shingles(prose(read(two.file)));
      const both = Math.max(containment(a, b) ?? 0, containment(b, a) ?? 0);
      if (both > MAX_OVERLAP) {
        problems.push(`${concept.id}: approach-1 and approach-2 repeat ${(both * 100).toFixed(0)}% of each other verbatim`);
      }
    }
  }

  /* The failure the review found: reporting success having checked nothing. */
  if (!rows.length) problems.push('zero routes were checked, which is a failure and not a pass');

  return { problems, rows, checked: rows.length };
}

function structural(at, md, body, words, shape) {
  const problems = [];
  if (!md.startsWith('# ')) problems.push(`${at}: must open with a "# " title`);
  if (words < MIN_WORDS) problems.push(`${at}: ${words} words of prose, below ${MIN_WORDS}`);
  if (!/^## What this route covers/m.test(md)) {
    problems.push(`${at}: no "What this route covers" section, so the reader cannot tell the routes apart`);
  }
  if (!/^## Move between routes/m.test(md)) {
    problems.push(`${at}: no "Move between routes" section linking the sibling treatments`);
  }

  const tableRows = (md.match(/^\|/gm) || []).length;

  if (shape === 'approach-1') {
    if (tableRows < 6) problems.push(`${at}: needs lookup tables; found ${tableRows} table rows`);
    if (!/^## .*(Boundary|boundary|limits|Not covered|does not)/m.test(md)) {
      problems.push(`${at}: no section stating where the rules stop applying`);
    }
    if (!/^## .*(checks after|Checks after)/m.test(md)) {
      problems.push(`${at}: no "checks after the reference" section`);
    } else {
      const checks = md.slice(md.search(/^## .*(checks after|Checks after)/m));
      if ((checks.match(/^\d+\. /gm) || []).length < 3) problems.push(`${at}: fewer than 3 numbered checks`);
    }
  } else {
    const families = (md.match(/^## Family /gm) || []).length;
    const decisions = (md.match(/^### /gm) || []).length;
    const answers = (md.match(/^:::answer /gm) || []).length;
    if (families < 3) problems.push(`${at}: ${families} question families, needs at least 3`);
    if (decisions < 4) problems.push(`${at}: ${decisions} decision prompts, needs at least 4`);
    if (answers < 2) problems.push(`${at}: ${answers} answer disclosures, needs at least 2`);
    if (!/because|the error|goes wrong|mistake|why this|confus/i.test(md)) {
      problems.push(`${at}: no reply that names why a wrong answer is wrong`);
    }
  }
  return problems;
}
