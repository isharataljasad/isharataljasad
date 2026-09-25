import fs from 'node:fs';
import path from 'node:path';
import { esc, slug, makeInline, renderMarkdown as render } from './lib/markdown.mjs';
import { concepts, approaches } from '../program/concepts.mjs';

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
  ['BM', '04.1', 'Basic Math/BM-04-01-integers-and-the-number-line.md'],
  ['A1', '01', 'Algebra/A1-01-variables-and-expressions.md'],
  ['GE', '01', 'Geometry/GE-01-coordinate-plane.md'],
  ['GE', '02', 'Geometry/GE-02-points-lines-and-planes.md'],
  ['GE', '03', 'Geometry/GE-03-measuring-segments.md'],
  ['GE', '04', 'Geometry/GE-04-midpoints-and-congruence.md'],
  ['GE', '05', 'Geometry/GE-05-angles.md'],
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
  '/foundations/reading/geometry/points-lines-and-planes/|2-a-line-a-segment-and-a-ray-are-different-sets': {
    src: '/foundations/reading/figures/geometry-extents.svg', width: 420, height: 360,
    alt: 'Segment AB stops at A and B. Ray AB starts at A and extends through and beyond B. Line AB extends beyond both A and B.',
    caption: 'The endpoint and arrow marks describe extent. Letter order matters for the ray.',
  },
  '/foundations/reading/geometry/points-lines-and-planes/|3-name-an-object-using-enough-information': {
    src: '/foundations/reading/figures/geometry-names.svg', width: 440, height: 340,
    alt: 'Given configuration: A, B, D lie in that order on g in plane M. C is in M off g. E is outside M.',
    caption: 'Use the stated locations, not apparent distances or angles. The slanted patch has no mathematical boundary.',
  },
  '/foundations/reading/geometry/points-lines-and-planes/|4-why-two-points-fix-a-line-but-three-fix-a-plane': {
    src: '/foundations/reading/figures/geometry-plane-pencil.svg', width: 440, height: 340,
    alt: 'Three differently tilted plane patches all contain the same line, shown as a shared spine. Points A, B, D on the spine belong to every plane.',
    caption: 'Three collinear points cannot select one plane. Other planes can rotate around the same line.',
  },
  '/foundations/reading/geometry/points-lines-and-planes/|6-a-line-can-lie-in-pierce-or-miss-a-plane': {
    src: '/foundations/reading/figures/geometry-line-plane-cases.svg', width: 360, height: 620,
    alt: 'Three separate cases: a line contained in a plane shares the whole line; a piercing line shares only T; a parallel line outside shares no points.',
    caption: 'Classify the complete line against the complete plane. The drawn patch shows only part of the plane.',
  },
  '/foundations/reading/geometry/measuring-segments/|3-betweenness-is-a-measured-fact-not-a-picture': {
    src: '/foundations/reading/figures/segment-addition.svg', width: 520, height: 250,
    alt: 'A number line with P at negative three, Q at two and R at six. PQ is five, QR is four and PR is nine, so the two parts add to the whole.',
    caption: 'Each length is the absolute difference of the coordinates. The parts add to the whole only because Q lies between P and R.',
  },
  '/foundations/reading/geometry/midpoints-and-congruence/|2-finding-a-midpoint-from-coordinates': {
    src: '/foundations/reading/figures/midpoint-average.svg', width: 520, height: 250,
    alt: 'A number line with A at negative three, M at three and B at nine. Equal tick marks on both halves show AM equals MB. Averaging gives three; subtracting gives twelve.',
    caption: 'Averaging the endpoints locates a point. Subtracting them measures a length. The two questions need different operations.',
  },
  '/foundations/reading/geometry/angles/|1-an-angle-is-two-rays-from-one-point': {
    src: '/foundations/reading/figures/angle-arm-length.svg', width: 520, height: 280,
    alt: 'Two fifty-degree angles side by side. The right one has arms two and a half times longer, yet both arcs are identical because the measure is unchanged.',
    caption: 'Both angles measure fifty degrees. Arm length belongs to the drawing, never to the angle.',
  },
  '/foundations/reading/basic-math/integers-and-the-number-line/|2-the-number-line-orders-integers-by-position': {
    src: '/foundations/reading/figures/integer-number-line.svg', width: 660, height: 300,
    alt: 'A number line from negative eight to eight. Negative eight lies five steps left of negative three, so it is the smaller number, while its distance from zero is the larger one.',
    caption: 'Order is decided by position, not by the size of the digits. Distance from zero is a separate measurement.',
  },
  '/foundations/reading/trigonometry/angles/|2-radians-connect-angle-to-arc-length': {
    src: '/foundations/reading/figures/radian-arc.svg',
    alt: 'An arc of length s on a circle of radius r defines an angle theta of s divided by r radians.',
    caption: 'Arc length and radius have the same length unit; their ratio measures the angle in radians.',
  },
};
/* Chapter-to-chapter links are written as relative Markdown paths in the
   source and resolved here to the published URL of the linked chapter. An
   unmapped target fails the build rather than shipping a dead link. */
function inlineFor(source) {
  return makeInline((target, label) => {
    const resolved = path.normalize(path.resolve(path.dirname(source), decodeURIComponent(target)));
    const url = bySource.get(resolved);
    if (!url) throw new Error(`Unmapped chapter link ${target} in ${source}`);
    return `<a href="${esc(url)}">${label}</a>`;
  });
}

function renderMarkdown(markdown, source, item) {
  return render(markdown, {
    source,
    inline: inlineFor(source),
    tableClass: 'reading-table-wrap',
    answerClass: 'reading-answer',
    onHeading: (id) => {
      const figure = figures[`${item.url}|${id}`];
      if (!figure) return null;
      return `<figure class="reading-figure"><img src="${figure.src}" alt="${esc(figure.alt)}" width="${figure.width || 660}" height="${figure.height || 360}"><figcaption>${esc(figure.caption)}</figcaption></figure>`;
    },
  });
}

function shell(title, body, needsRouteStyles = false) {
  /* concepts.css carries the route switcher; only chapters that show one load it. */
  const routeStyles = needsRouteStyles ? '<link rel="stylesheet" href="/foundations/concepts/concepts.css">' : '';
  return `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Original, explanation-first math foundation chapters for engineering study."><title>${esc(title)} | Yanbu Engineering Study</title>
<link rel="stylesheet" href="/semester-1/assets/curriculum.css"><link rel="stylesheet" href="/foundations/reading/reading.css">${routeStyles}</head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Study areas"><a href="/semester-1/math/">Calculus I</a><a href="/semester-1/physics/">Physics</a><a href="/semester-1/chemistry/">Chemistry</a><a href="/foundations/" aria-current="page">Foundations</a></nav><span class="semester">SEMESTER 1</span></header>
<main id="main" class="page reading-page">${body}</main>
<footer class="footer">Math Foundations supports every semester. <a href="/foundations/">Browse the four Foundations folders</a>.</footer>
<script type="module" src="/foundations/concepts/return-topic.mjs"></script></body></html>\n`;
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

/* A chapter that is registered as a concept treatment carries the same route
   switcher the generated approach pages use, so a student can move between all
   three treatments from any of them rather than only forwards. It appears only
   when there is somewhere to switch to. */
const conceptForUrl = new Map();
for (const concept of concepts) {
  for (const href of Object.values(concept.approaches)) conceptForUrl.set(href, concept);
}

function routeSwitcher(url) {
  const concept = conceptForUrl.get(url);
  if (!concept) return '';
  const written = approaches.filter((a) => concept.approaches[a.number]);
  if (written.length < 2) return '';
  const items = approaches.map((a) => {
    const href = concept.approaches[a.number];
    const label = `<span class="switch-number">Approach ${a.number}</span><span class="switch-name">${esc(a.name)}</span>`;
    if (!href) return `<span class="concept-switch-item is-missing">${label}<span class="switch-note">not written yet</span></span>`;
    const here = href === url;
    return `<a class="concept-switch-item" href="${esc(href)}"${here ? ' aria-current="page"' : ''}>${label}<span class="switch-note">${esc(a.bestFor)}</span></a>`;
  }).join('');
  return `<nav class="concept-switch" aria-label="Three ways to learn this concept">${items}</nav><p class="reading-note"><a href="${esc(concept.hub || '/foundations/concepts/')}">Compare the three routes for ${esc(concept.title)} →</a></p>`;
}

for (const item of lessons) {
  const markdown = fs.readFileSync(item.source, 'utf8');
  const { title, headings, body } = renderMarkdown(markdown, item.source, item);
  const toc = `<nav class="reading-toc" aria-label="On this page"><h2>On this page</h2><ol>${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>`;
  const switcher = routeSwitcher(item.url);
  const article = `<p class="reading-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/reading/">Reading</a> / ${esc(item.group)}</p><header class="reading-hero chapter-hero"><p class="eyebrow">${esc(item.group.toUpperCase())} · EPISODE ${esc(item.episode)}</p><h1>${esc(title)}</h1><p class="reading-note">Early reading edition. Explanations come first; selected question types and answers follow.</p></header>${switcher}<div class="reading-layout">${toc}<article class="reading-article">${body}<p class="chapter-end"><a href="/foundations/reading/">← All reading chapters</a> · <a href="/foundations/">Browse the four folders →</a></p></article></div>`;
  writePage(item.url, shell(title, article, switcher !== ''));
}
/* Which chapter came from which Markdown file. The coverage ledger reads this
   to identify local pages that this repository can rebuild; not to verify deployment.
   It lives under source/ so it is never deployed. */
fs.writeFileSync(
  path.join(sourceRoot, 'manifest.json'),
  JSON.stringify(Object.fromEntries(lessons.map((item) => [item.url, path.relative(root, item.source).split(path.sep).join('/')])), null, 2) + '\n',
  'utf8'
);

console.log(`Built ${lessons.length} reading chapters, one library page, and one ${catalog.length}-episode map.`);
