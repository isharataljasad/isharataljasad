import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const modelsRoot = path.join(root, 'foundations', 'models');
const sourceRoot = path.join(modelsRoot, 'source');
const conceptUrl = '/foundations/models/functions-and-domain/';
const models = [
  { number: 1, name: 'Curriculum map', subtitle: 'Know where the idea belongs and which conditions make it valid.', source: 'foundation-1.md', url: `${conceptUrl}foundation-1/` },
  { number: 2, name: 'Guided practice', subtitle: 'Choose the right decision, diagnose a mistake, and try a changed case.', source: 'foundation-2.md', url: `${conceptUrl}foundation-2/` },
  { number: 3, name: 'Kickstart guide', subtitle: 'Build the idea from the beginning in a complete written explanation.', source: 'foundation-3.md', url: `${conceptUrl}foundation-3/` },
];
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(raw) {
  const saved = [];
  let output = esc(raw).replace(/`([^`]+)`/g, (_, value) => {
    saved.push(`<code>${value}</code>`);
    return `@@SAVED${saved.length - 1}@@`;
  });
  output = output.replace(/\[([^\]]+)\]\((\/[^)\s]+|https:\/\/[^)\s]+)\)/g, (_, label, href) => {
    if (href.startsWith('/') && !href.startsWith('//')) return `<a href="${href}">${label}</a>`;
    const parsed = new URL(href.replaceAll('&amp;', '&'));
    if (parsed.protocol !== 'https:') throw new Error(`Unsupported link: ${href}`);
    return `<a href="${esc(parsed.href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  });
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return output.replace(/@@SAVED(\d+)@@/g, (_, n) => saved[Number(n)]);
}

function table(block) {
  const rows = block.map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()));
  if (rows.length < 3 || !rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) throw new Error('Invalid model table');
  const head = `<thead><tr>${rows[0].map((cell) => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.slice(2).map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return `<div class="model-table-wrap"><table>${head}${body}</table></div>`;
}

function render(markdown, model) {
  const lines = markdown.trim().split(/\r?\n/);
  const titleLine = lines.shift();
  if (!titleLine?.startsWith('# ')) throw new Error(`Missing model title: ${model.source}`);
  const title = titleLine.slice(2).trim();
  const headings = [];
  const parts = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim();
      const id = slug(heading);
      headings.push({ heading, id });
      parts.push(`<h2 id="${id}">${esc(heading)}</h2>`);
      if (model.number === 3 && id === '2-a-function-is-a-relation-with-a-dependable-output') {
        parts.push('<figure class="model-figure"><img src="/foundations/models/figures/function-mapping.svg" alt="Two inputs can share one output in a function. One input leading to two different outputs is not a function." width="720" height="245"><figcaption>Follow the input: repeated outputs are allowed; two outputs for one input are not.</figcaption></figure>');
      }
      if (model.number === 3 && id === '4-read-function-notation-as-an-instruction') {
        parts.splice(parts.length-1,0,fs.readFileSync(path.join(modelsRoot,'graph-explorer.html'),'utf8'));
      }
      i++;
    } else if (line.startsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++].trim());
      parts.push(table(block));
    } else if (/^\d+\. /.test(line)) {
      const block = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) block.push(lines[i++].trim().replace(/^\d+\. /, ''));
      parts.push(`<ol>${block.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`);
    } else {
      const block = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('## ') && !lines[i].trim().startsWith('|') && !/^\d+\. /.test(lines[i].trim())) block.push(lines[i++].trim());
      parts.push(`<p>${inline(block.join(' '))}</p>`);
    }
  }
  return { title, headings, body: parts.join('\n') };
}

function shell(title, body) {
  return `<!doctype html>\n<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Three original approaches to one Math Foundations concept, available as a live comparison pilot."><title>${esc(title)} | Yanbu Engineering Study</title><link rel="stylesheet" href="/semester-1/assets/curriculum.css"><link rel="stylesheet" href="/foundations/models/models.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">YANBU <span>Engineering study</span></a><nav aria-label="Study areas"><a href="/semester-1/math/">Calculus I</a><a href="/semester-1/physics/">Physics</a><a href="/semester-1/chemistry/">Chemistry</a><a href="/foundations/" aria-current="page">Foundations</a></nav><span class="semester">SEMESTER 1</span></header><main id="main" class="page models-page">${body}</main><footer class="footer">Math Foundations · <a href="/foundations/">Browse the four subject folders</a></footer></body></html>\n`;
}

function writePage(url, html) {
  const relative = url.replace(/^\/foundations\/models\/?/, '');
  const directory = path.join(modelsRoot, relative);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
}

const modelCards = models.map((model) => `<a class="model-card" href="${model.url}"><span class="model-number">0${model.number}</span><span><strong>Foundation ${model.number}</strong><span class="model-card-name">${esc(model.name)}</span><span class="model-card-copy">${esc(model.subtitle)}</span></span><span class="model-arrow" aria-hidden="true">→</span></a>`).join('\n');
const intro = `<p class="model-crumb"><a href="/foundations/">Foundations</a> / Three models</p><header class="model-hero"><p class="eyebrow">ONE CONCEPT · THREE WORKING MODELS</p><h1>See what each approach teaches best.</h1><p>Functions and allowed inputs is the first live comparison. Each route teaches the same underlying idea in its own way. Read the explanation, then inspect the selected checks. A later student-tested version will bring the strongest parts into one lesson.</p></header><section class="pilot-topic"><span>ALG-FUNCTION-01 · ALGEBRA PILOT</span><h2>Functions and allowed inputs</h2><p>Decide whether one input has two outputs, then find the inputs a formula permits.</p></section><section aria-labelledby="models-title"><h2 id="models-title" class="model-section-title">The three routes</h2><div class="model-grid">${modelCards}</div></section><p class="model-note">This pilot covers one concept. It does not certify that the four Foundations subjects have been fully written. The current <a href="/foundations/">source index</a> still lists 297 files for 296 distinct episodes and marks unwritten chapters clearly.</p>`;
writePage('/foundations/models/', shell('Three Foundation models', intro));
writePage(conceptUrl, shell('Functions and allowed inputs in three models', intro.replace(' / Three models', ' / <a href="/foundations/models/">Three models</a> / Functions and allowed inputs')));

for (const model of models) {
  const markdown = fs.readFileSync(path.join(sourceRoot, model.source), 'utf8');
  const rendered = render(markdown, model);
  if (model.number === 2) rendered.body += fs.readFileSync(path.join(modelsRoot,'guided-check.html'),'utf8');
  const switcher = `<nav class="model-switcher" aria-label="Compare the three models">${models.map((item) => `<a href="${item.url}"${item.number === model.number ? ' aria-current="page"' : ''}>Foundation ${item.number}<span>${esc(item.name)}</span></a>`).join('')}</nav>`;
  const toc = `<nav class="model-toc" aria-label="On this page"><h2>On this page</h2><ol>${rendered.headings.map((item) => `<li><a href="#${item.id}">${esc(item.heading)}</a></li>`).join('')}</ol></nav>`;
  const content = `<p class="model-crumb"><a href="/foundations/">Foundations</a> / <a href="/foundations/models/">Three models</a> / Foundation ${model.number}</p><header class="model-hero model-chapter-hero"><p class="eyebrow">FOUNDATION ${model.number} · ${esc(model.name.toUpperCase())}</p><h1>${esc(rendered.title)}</h1><p>${esc(model.subtitle)}</p></header>${switcher}<div class="model-layout">${toc}<article class="model-article">${rendered.body}<p class="model-end"><a href="/foundations/models/">← Compare all three routes</a></p></article></div>`;
  writePage(model.url, shell(`Foundation ${model.number} · ${rendered.title}`, content).replace('</head>','<script type="module" src="/foundations/models/interactions.mjs"></script></head>'));
}
console.log('Built the three-model pilot and three original Functions and Domain routes.');
