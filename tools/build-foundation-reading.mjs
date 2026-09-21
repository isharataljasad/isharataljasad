import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const readingRoot = path.join(root, 'foundations', 'reading');
const sourceRoot = path.join(readingRoot, 'source');
const catalog = JSON.parse(fs.readFileSync(path.join(readingRoot, 'catalog.json'), 'utf8'));
const groups = [
  ['Basic Math', 'basic-math'],
  ['Algebra', 'algebra'],
  ['Geometry', 'geometry'],
  ['Trigonometry', 'trigonometry'],
];
const lessons = [
  ['BM', '01.1', 'Basic Math/BM-01-01-expressions-and-variables.md'],
  ['BM', '01.2', 'Basic Math/BM-01-02-exponents.md'],
  ['BM', '01.3', 'Basic Math/BM-01-03-order-of-operations.md'],
  ['A1', '01', 'Algebra/A1-01-variables-and-expressions.md'],
  ['GE', '01', 'Geometry/GE-01-coordinate-plane.md'],
  ['GE', '02', 'Geometry/GE-02-points-lines-and-planes.md'],
  ['TR', '1.1', 'Trigonometry/TR-01-01-angles.md'],
].map(([track, episode, source]) => {
  const item = catalog.find((x) => x.track === track && x.episode === episode);
  if (!item?.url) throw new Error(`Missing catalog URL: ${track} ${episode}`);
  return { ...item, source: path.join(sourceRoot, source) };
});
const bySource = new Map(lessons.map((item) => [path.normalize(item.source), item.url]));

/* A chapter file that is not in `lessons` above used to be skipped without a
   word, so a newly written chapter simply never appeared on the site and the
   author had no signal. Stop the build and name the file instead. */
const unregistered = fs.readdirSync(sourceRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => path.normalize(path.join(entry.parentPath ?? entry.path, entry.name)))
  .filter((file) => !bySource.has(file));
if (unregistered.length) {
  throw new Error(
    `Chapter markdown found but not registered in tools/build-foundation-reading.mjs:\n  ` +
    unregistered.map((file) => path.relative(root, file)).join('\n  ') +
    `\nAdd a [track, episode, relative path] entry to the lessons list, give the ` +
    `episode a url in foundations/reading/catalog.json, then rebuild.`
  );
}
const figures = {
  '/foundations/reading/geometry/coordinate-plane/|1-two-number-lines-make-one-plane': {
    src: '/foundations/reading/figures/coordinate-plane.svg',
    alt: 'The x and y axes divide the plane into four quadrants. P at negative three, positive two lies in quadrant II.',
    caption: 'A coordinate is read horizontally, then vertically. Axis points lie outside all four quadrants.',
  },
  '/foundations/reading/geometry/points-lines-and-planes/|3-being-in-a-plane-differs-from-passing-through-it': {
    src: '/foundations/reading/figures/line-and-plane.svg',
    alt: 'Line g lies entirely in plane M, while line h passes through plane N at only point T.',
    caption: 'The complete shared set is a line in the first picture and one point in the second.',
  },
  '/foundations/reading/trigonometry/angles/|2-radians-connect-angle-to-arc-length': {
    src: '/foundations/reading/figures/radian-arc.svg',
    alt: 'An arc of length s on a circle of radius r defines an angle theta of s divided by r radians.',
    caption: 'Arc length and radius have the same length unit; their ratio measures the angle in radians.',
  },
};
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(text, source) {
  const code = [];
  let out = esc(text).replace(/`([^`]+)`/g, (_, value) => {
    code.push(`<code>${value}</code>`);
    return `@@CODE${code.length - 1}@@`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
    const resolved = path.normalize(path.resolve(path.dirname(source), decodeURIComponent(target)));
    const url = bySource.get(resolved);
    if (!url) throw new Error(`Unmapped chapter link ${target} in ${source}`);
    return `<a href="${esc(url)}">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out.replace(/@@CODE(\d+)@@/g, (_, n) => code[Number(n)]);
}

function tableHtml(lines, source, label) {
  const rows = lines.map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim()));
  if (rows.length < 3 || !rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) throw new Error(`Bad table in ${source}`);
  const head = `<thead><tr>${rows[0].map((cell) => `<th scope="col">${inline(cell, source)}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.slice(2).map((row) => `<tr>${row.map((cell) => `<td>${inline(cell, source)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  /* The wrapper scrolls sideways on narrow screens, so it must be reachable by
     keyboard: without tabindex a keyboard-only reader cannot see the columns
     that overflow. role + name announce it as a scrollable region. */
  const name = esc(label ? `Table: ${label}` : 'Table');
  return `<div class="reading-table-wrap" role="region" aria-label="${name}" tabindex="0"><table>${head}${body}</table></div>`;
}

/* Every construct the renderer understands. A paragraph runs until one of
   these begins, so anything added here must also get its own branch below. */
const startsBlock = (line) =>
  line.startsWith('## ') || line.startsWith('### ') || line.startsWith('|') ||
  /^\d+\. /.test(line) || /^- /.test(line);

function renderMarkdown(markdown, source, item) {
  const lines = markdown.trim().split(/\r?\n/);
  const first = lines.shift();
  if (!first?.startsWith('# ')) throw new Error(`Missing title: ${source}`);
  const title = first.slice(2).trim();
  const headings = [];
  const parts = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (/^\*\*.*Early reading edition\*\*$/.test(line)) { i++; continue; }
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      const id = slug(text);
      headings.push({ text, id });
      parts.push(`<h2 id="${id}">${esc(text)}</h2>`);
      const figure = figures[`${item.url}|${id}`];
      if (figure) parts.push(`<figure class="reading-figure"><img src="${figure.src}" alt="${esc(figure.alt)}" width="660" height="360"><figcaption>${esc(figure.caption)}</figcaption></figure>`);
      i++;
    } else if (line.startsWith('### ')) {
      parts.push(`<h3>${esc(line.slice(4).trim())}</h3>`);
      i++;
    } else if (line.startsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++]);
      parts.push(tableHtml(block, source, headings[headings.length - 1]?.text));
    } else if (/^\d+\. /.test(line)) {
      const block = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) block.push(lines[i++].trim().replace(/^\d+\. /, ''));
      parts.push(`<ol>${block.map((item) => `<li>${inline(item, source)}</li>`).join('')}</ol>`);
    } else if (/^- /.test(line)) {
      const block = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) block.push(lines[i++].trim().slice(2));
      parts.push(`<ul>${block.map((item) => `<li>${inline(item, source)}</li>`).join('')}</ul>`);
    } else {
      const block = [];
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i].trim())) block.push(lines[i++].trim());
      parts.push(`<p>${inline(block.join(' '), source)}</p>`);
    }
  }
  return { title, headings, body: parts.join('\n') };
}

function shell(title, body, active = 'reading') {
  return `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Original, explanation-first math foundation chapters for engineering study."><title>${esc(title)} | Yanbu Engineering Study</title>
<link rel="stylesheet" href="/semester-1/assets/curriculum.css"><link rel="stylesheet" href="/foundations/reading/reading.css"></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Study areas"><a href="/semester-1/math/">Calculus I</a><a href="/semester-1/physics/">Physics</a><a href="/semester-1/chemistry/">Chemistry</a><a href="/foundations/" aria-current="page">Foundations</a></nav><span class="semester">SEMESTER 1</span></header>
<main id="main" class="page reading-page">${body}</main>
<footer class="footer">Math Foundations supports every semester. <a href="/foundations/">Browse the four Foundations folders</a>.</footer>
</body></html>\n`;
}

function writePage(url, html) {
  const relative = url.replace(/^\/foundations\/reading\/?/, '');
  const folder = path.join(readingRoot, relative);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'index.html'), html, 'utf8');
}

const available = catalog.filter((x) => x.url);
const groupCards = groups.map(([group, id]) => {
  const chapters = available.filter((x) => x.group === group);
  return `<section class="reading-group" id="${id}"><div class="reading-group-head"><h2>${esc(group)}</h2><span>${chapters.length} available</span></div><ol>${chapters.map((x) => `<li><a href="${esc(x.url)}">${esc(x.title)}</a><small>${esc(x.track)} ${esc(x.episode)}</small></li>`).join('')}</ol></section>`;
}).join('\n');
writePage('/foundations/reading/', shell('Read Math Foundations', `<p class="reading-crumb"><a href="/foundations/">Foundations</a> / Reading</p>
<header class="reading-hero"><p class="eyebrow">THE READING LIBRARY</p><h1>Understand the lesson, then try its defining questions.</h1><p>Each chapter explains the idea, its conditions, and the decisions behind it before the selected question types and worked answers. You can read directly and return to practice when you are ready.</p><p class="reading-note">This early edition has ${available.length} written chapters across four areas. The full source sequence is being reviewed chapter by chapter.</p></header>
<nav class="reading-jump" aria-label="Reading areas">${groups.map(([name, id]) => `<a href="#${id}">${esc(name)}</a>`).join('')}</nav>
${groupCards}
<p class="reading-map-link"><a href="/foundations/reading/map/">Explore the ${catalog.length}-episode source map</a> <span>Planned topics are labeled separately from available chapters.</span></p>`));

const mapGroups = groups.map(([group, id]) => {
  const rows = catalog.filter((x) => x.group === group);
  return `<details class="map-group" id="${id}"><summary>${esc(group)} <span>${rows.length} planned · ${rows.filter((x) => x.url).length} available</span></summary><ol>${rows.map((x) => `<li><span class="episode-code">${esc(x.track)} ${esc(x.episode)}</span>${x.url ? `<a href="${esc(x.url)}">${esc(x.title)}</a><span class="map-state available">Read chapter</span>` : `<span>${esc(x.title)}</span><span class="map-state">Not written yet</span>`}</li>`).join('')}</ol></details>`;
}).join('\n');
writePage('/foundations/reading/map/', shell('Foundation episode map', `<p class="reading-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/reading/">Reading</a> / Episode map</p><header class="reading-hero"><p class="eyebrow">COURSE MAP</p><h1>Four areas, ${catalog.length} planned chapters</h1><p>There are ${available.length} written reading chapters available now. The other titles come from the supplied lesson sequence and are shown for orientation. A title in this map does not mean its explanation has been written or checked.</p></header>${mapGroups}`));

for (const item of lessons) {
  const markdown = fs.readFileSync(item.source, 'utf8');
  const { title, headings, body } = renderMarkdown(markdown, item.source, item);
  const toc = `<nav class="reading-toc" aria-label="On this page"><h2>On this page</h2><ol>${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>`;
  const article = `<p class="reading-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/reading/">Reading</a> / ${esc(item.group)}</p><header class="reading-hero chapter-hero"><p class="eyebrow">${esc(item.group.toUpperCase())} · EPISODE ${esc(item.episode)}</p><h1>${esc(title)}</h1><p class="reading-note">Early reading edition. Explanations come first; selected question types and answers follow.</p></header><div class="reading-layout">${toc}<article class="reading-article">${body}<p class="chapter-end"><a href="/foundations/reading/">← All reading chapters</a> · <a href="/foundations/">Browse the four folders →</a></p></article></div>`;
  writePage(item.url, shell(title, article));
}
console.log(`Built ${lessons.length} reading chapters, one library page, and one ${catalog.length}-episode map.`);
