/** English for Study and Communication: the owner-supplied content pack
 * (tools/content/english/pack, version 2026-09-27.1) is canonical and stays byte-for-byte
 * as delivered (test/study.mjs checks its checksums). Editorial corrections are applied
 * here, each with its reason, so every change to the supplied text is on record. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(import.meta.dirname, 'pack');
const json = (p) => JSON.parse(fs.readFileSync(path.join(dir, p), 'utf8'));

export const manifest = json('manifest.json');
export const sourceRegistry = json('source-registry.json');
export const audioManifest = json('audio-production-manifest.json');

export const groups = [
  { id: '01-language-foundations', title: 'Language foundations' },
  { id: '02-reading-for-study', title: 'Reading for study' },
  { id: '03-academic-writing', title: 'Academic writing' },
  { id: '04-listening-and-speaking', title: 'Listening and speaking: written strategies and models' },
];

/** Material corrections to the supplied text. `apply` receives one lesson and returns it. */
export const corrections = [
  {
    lessons: 'all',
    field: 'scope',
    reason: 'Every lesson carried the label “Foundational reading lesson”, including the writing, listening and speaking lessons. It is replaced by “Foundation lesson”; the rest of the scope statement is unchanged.',
    apply: (l) => ({ ...l, scope: l.scope.replace(/^Foundational reading lesson/, 'Foundation lesson') }),
  },
];

const slug = (s) => s.toLowerCase().replace(/’/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const raw = [];
for (const g of groups) for (const l of json(`content/${g.id}.json`).lessons) raw.push(l);
const order = manifest.lessons.map((m) => m.id);
raw.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

export const lessons = raw.map((original) => {
  let l = original;
  for (const c of corrections) if (c.lessons === 'all' || c.lessons.includes(l.id)) l = c.apply(l);
  return { ...l, slug: slug(l.title), original };
});

/** The 82 blocks of the earlier English pages and the lessons that now teach their overlap. */
export const legacy = (() => {
  const text = fs.readFileSync(path.join(dir, 'legacy-inventory.csv'), 'utf8').replace(/^﻿/, '');
  const rows = [];
  for (const line of text.trim().split(/\r?\n/).slice(1)) {
    const cells = [];
    let cur = '', quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    const [original, title, targets, disposition, sha256] = cells;
    const [file, anchor] = original.split('#');
    rows.push({ original, route: file.split('/')[1], anchor, title, targets: targets ? targets.split(',').map((s) => s.trim()) : [], disposition, sha256 });
  }
  return rows;
})();
