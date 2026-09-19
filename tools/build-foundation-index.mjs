import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const foundations = path.join(root, 'foundations');
const catalog = JSON.parse(fs.readFileSync(path.join(foundations, 'reading', 'catalog.json'), 'utf8'));
const inventoryPath = path.join(foundations, 'source-files.json');
const areas = [
  { name: 'Basic Math', slug: 'basic-math', count: 67, tracks: ['BM'] },
  { name: 'Algebra', slug: 'algebra', count: 136, tracks: ['A1', 'A2'] },
  { name: 'Geometry', slug: 'geometry', count: 71, tracks: ['GE'] },
  { name: 'Trigonometry', slug: 'trigonometry', count: 23, tracks: ['TR'] },
];
const folders = [
  { name: 'SRT-Basic Math-Educator', track: 'BM', pattern: /^(\d+\.\d+)\.\s+(.+?) \(transcribed on .+\)\.srt$/i },
  { name: 'SRT-Algebra 1 with Dr. Carleen Eaton-4', track: 'A1', pattern: /^(\d{2})(.+?) \(transcribed on .+\)\.srt$/i },
  { name: 'SRT-Algebra 2 with Dr. Carleen Eaton', track: 'A2', pattern: /^(\d{2})(.+?) \(transcribed on .+\)\.srt$/i },
  { name: 'SRT-Geometry with Mary Pyo', track: 'GE', pattern: /^(\d{2})(.+?) \(transcribed on .+\)\.srt$/i },
  { name: 'SRT-Trigonometry-Educator', track: 'TR', pattern: /^(\d+\.\d+)\.\s+(.+?) \(transcribed on .+\)\.srt$/i },
];
const byKey = new Map(catalog.map((item, index) => [`${item.track}|${item.episode}`, { ...item, index }]));
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

if (process.argv[2] === '--import') {
  const sourceRoot = process.argv[3];
  if (!sourceRoot) throw new Error('Pass the source directory after --import');
  const records = [];
  for (const folder of folders) {
    const names = fs.readdirSync(path.join(sourceRoot, folder.name)).filter((name) => name.toLowerCase().endsWith('.srt'));
    for (const name of names) {
      const match = name.match(folder.pattern);
      if (!match) throw new Error(`Unrecognized subtitle filename: ${name}`);
      const episode = match[1];
      const chapter = byKey.get(`${folder.track}|${episode}`);
      if (!chapter) throw new Error(`No canonical chapter for ${folder.track} ${episode}: ${name}`);
      const normalized = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
      if (normalized(match[2]) !== normalized(chapter.title)) throw new Error(`Title mismatch for ${folder.track} ${episode}: ${name}`);
      records.push({ group: chapter.group, track: folder.track, episode, title: chapter.title, fileName: name });
    }
  }
  records.sort((a, b) => byKey.get(`${a.track}|${a.episode}`).index - byKey.get(`${b.track}|${b.episode}`).index || a.fileName.localeCompare(b.fileName));
  const variants = new Map();
  for (const record of records) {
    const key = `${record.track}|${record.episode}`;
    const variant = (variants.get(key) ?? 0) + 1;
    variants.set(key, variant);
    record.id = `${record.track.toLowerCase()}-${record.episode.replace('.', '-')}-source-${variant}`;
  }
  fs.writeFileSync(inventoryPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

const records = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const keys = new Set(records.map((record) => `${record.track}|${record.episode}`));
if (records.length !== 297 || keys.size !== 296 || catalog.length !== 296) throw new Error('Expected 297 source files for 296 canonical episodes');
for (const area of areas) {
  if (records.filter((record) => record.group === area.name).length !== area.count) throw new Error(`Source count mismatch: ${area.name}`);
}
for (const record of records) {
  const chapter = byKey.get(`${record.track}|${record.episode}`);
  if (!chapter || record.title !== chapter.title || record.group !== chapter.group) throw new Error(`Invalid inventory record: ${record.id}`);
}

function shell(title, content) {
  return `<!doctype html>\n<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Browse all 297 indexed source files and the original written Math Foundations chapters."><title>${esc(title)} | Yanbu Engineering Study</title><link rel="stylesheet" href="/semester-1/assets/curriculum.css"><link rel="stylesheet" href="/foundations/library.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Study areas"><a href="/semester-1/math/">Calculus I</a><a href="/semester-1/physics/">Physics</a><a href="/semester-1/chemistry/">Chemistry</a><a href="/foundations/" aria-current="page">Foundations</a></nav><span class="semester">SEMESTER 1</span></header><main id="main" class="page library-page">${content}</main><footer class="footer">Math Foundations · <a href="/semester-1/">Return to Semester 1</a></footer></body></html>\n`;
}
function writePage(url, html) {
  const relative = url.replace(/^\/foundations\/?/, '');
  const directory = path.join(foundations, relative);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
}
function sourceUrl(record) {
  const area = areas.find((item) => item.name === record.group);
  return `/foundations/${area.slug}/files/${record.id}/`;
}
function chapterStatus(record) {
  return byKey.get(`${record.track}|${record.episode}`).url
    ? '<span class="file-state ready">Written chapter</span>'
    : '<span class="file-state pending">Source indexed · chapter not written</span>';
}

const written = catalog.filter((chapter) => chapter.url).length;
const cards = areas.map((area) => {
  const chapterCount = catalog.filter((chapter) => chapter.group === area.name).length;
  const ready = catalog.filter((chapter) => chapter.group === area.name && chapter.url).length;
  return `<a class="folder-card" href="/foundations/${area.slug}/"><span class="folder-icon" aria-hidden="true">📁</span><span class="folder-text"><strong>${esc(area.name)}</strong><span>${area.count} source files · ${chapterCount} distinct episodes</span><small>${ready} ${ready === 1 ? 'chapter' : 'chapters'} written</small></span><span class="folder-arrow" aria-hidden="true">→</span></a>`;
}).join('\n');
writePage('/foundations/', shell('Math Foundations', `<p class="library-crumb"><a href="/semester-1/">Semester 1</a> / Foundations</p><header class="library-hero"><p class="eyebrow">MATH FOUNDATIONS · TEXT LIBRARY</p><h1>Choose a folder, then read the lesson.</h1><p>Browse the four subject folders and their complete source file index. Open an original written chapter wherever one is available. Explanations come before selected questions inside each chapter.</p></header><div class="library-counts" aria-label="Library counts"><div><strong>4</strong><span>subject folders</span></div><div><strong>297</strong><span>source files indexed</span></div><div><strong>296</strong><span>distinct episodes</span></div><div><strong>${written}</strong><span>written chapters</span></div></div><section aria-labelledby="folders-title"><h2 id="folders-title">The four folders</h2><div class="folder-grid">${cards}</div></section><section class="model-pilot" aria-labelledby="model-pilot-title"><p class="eyebrow">NEW · ONE CONCEPT IN THREE ROUTES</p><h2 id="model-pilot-title">Compare three ways to learn functions.</h2><p>Curriculum placement, guided practice, and a complete written start are now available as separate live models. Study the same idea through each route before we build the final combined experience.</p><a href="/foundations/models/">Explore the three-model pilot →</a></section><p class="library-note">Two Algebra 2 source files belong to the same episode, so 297 files represent 296 distinct lessons. The transcript text is not published here. An indexed source file is not a written chapter. The remaining ${296 - written} chapters are still being written.</p><p class="library-secondary"><a href="/foundations/reading/">See the ${written} written chapters together →</a></p>`));

for (const area of areas) {
  const areaRecords = records.filter((record) => record.group === area.name);
  const chapterCount = catalog.filter((chapter) => chapter.group === area.name).length;
  const groups = area.tracks.map((track) => {
    const trackRecords = areaRecords.filter((record) => record.track === track);
    const label = area.name === 'Algebra' ? `Algebra ${track === 'A1' ? '1' : '2'}` : area.name;
    const rows = trackRecords.map((record) => `<li class="file-row"><div class="file-main"><span class="file-code">${esc(record.track)} ${esc(record.episode)}</span><div><a class="file-title" href="${sourceUrl(record)}">${esc(record.title)}</a><span class="file-name">${esc(record.fileName)}</span></div></div>${chapterStatus(record)}</li>`).join('\n');
    return `<section class="file-section" aria-labelledby="${track.toLowerCase()}-title"><h2 id="${track.toLowerCase()}-title">${esc(label)} <span>${trackRecords.length} source files</span></h2><ol class="file-list">${rows}</ol></section>`;
  }).join('\n');
  writePage(`/foundations/${area.slug}/`, shell(`${area.name} source index`, `<p class="library-crumb"><a href="/foundations/">Foundations</a> / ${esc(area.name)}</p><header class="library-hero"><p class="eyebrow">SOURCE FILE FOLDER</p><h1>${esc(area.name)}</h1><p>${areaRecords.length} indexed source files representing ${chapterCount} distinct episodes. Select a file to see its status and open its written chapter when available.</p></header><nav class="folder-nav" aria-label="Subject folders">${areas.map((item) => `<a href="/foundations/${item.slug}/"${item.slug === area.slug ? ' aria-current="page"' : ''}>${esc(item.name)}</a>`).join('')}</nav><div class="folder-search"><label for="file-search">Find a file in ${esc(area.name)}</label><input id="file-search" type="search" data-file-search placeholder="Search episode, topic, or file name" autocomplete="off"><p data-search-status role="status" aria-live="polite">${areaRecords.length} source files shown</p></div>${groups}<p class="library-note">File names identify the supplied transcripts. Their text is not reproduced here; original explanations are added chapter by chapter.</p><script type="module" src="/foundations/folder-search.mjs"></script>`));
}

for (const record of records) {
  const chapter = byKey.get(`${record.track}|${record.episode}`);
  const area = areas.find((item) => item.name === record.group);
  const siblingCount = records.filter((item) => item.track === record.track && item.episode === record.episode).length;
  const callout = chapter.url
    ? `<p class="record-ready">The original reading chapter is available.</p><p><a class="button" href="${esc(chapter.url)}">Read ${esc(record.title)} →</a></p>`
    : '<p class="record-pending">This source file is indexed. The original book-style chapter has not been written yet.</p>';
  writePage(sourceUrl(record), shell(record.title, `<p class="library-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/${area.slug}/">${esc(area.name)}</a> / ${esc(record.track)} ${esc(record.episode)}</p><header class="library-hero"><p class="eyebrow">SOURCE FILE ${esc(record.track)} ${esc(record.episode)}</p><h1>${esc(record.title)}</h1></header><section class="source-record"><h2>Indexed source</h2><dl><dt>File name</dt><dd>${esc(record.fileName)}</dd><dt>Subject</dt><dd>${esc(record.group)}${record.track === 'A1' ? ' · Algebra 1' : record.track === 'A2' ? ' · Algebra 2' : ''}</dd><dt>Episode</dt><dd>${esc(record.track)} ${esc(record.episode)}</dd>${siblingCount > 1 ? `<dt>Source versions</dt><dd>${siblingCount} files are indexed for this one episode.</dd>` : ''}</dl>${callout}</section><p class="library-secondary"><a href="/foundations/${area.slug}/">← Back to ${esc(area.name)} folder</a></p>`));
}
console.log(`Built four folder pages and ${records.length} source file records for ${keys.size} episodes; ${written} written chapters.`);
