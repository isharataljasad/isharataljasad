/* ==========================================================================
   tools/lib/markdown.mjs — the shared renderer for reading chapters and concept approaches.

   It supports exactly the constructs listed below. Anything else that looks
   like Markdown raises an error naming what to write instead, because silently
   swallowing it shipped literal asterisks and > characters to students.

   Supported:
     ## heading            section heading, collected for the table of contents
     ### heading           sub-heading
     | a | b |             table (header row, --- separator, body rows)
     1. item               ordered list
     - item                unordered list
     > quoted line         blockquote; consecutive lines join into one paragraph
     :::answer Label       disclosure whose body is paragraphs, closed by :::
     **bold**  *emphasis*  `code`  [label](target)

   A pipe inside `code` stays in its cell, and a table row whose width differs
   from the header raises rather than rendering ragged.
   ========================================================================== */

export const esc = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const slug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Split one table row into cells on the pipes that are actually separators.

   A pipe inside a backtick span belongs to the formula, not to the table, so
   `|a - b|` is one cell and not three. Splitting the raw line on every pipe
   turned the absolute-value tables in the segment and midpoint chapters into
   ragged tables with more cells than columns. */
export function splitRow(line) {
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let cell = '';
  let inCode = false;
  for (const character of inner) {
    if (character === '`') inCode = !inCode;
    if (character === '|' && !inCode) { cells.push(cell.trim()); cell = ''; continue; }
    cell += character;
  }
  cells.push(cell.trim());
  return cells;
}

/* A paragraph runs until one of these begins. Every construct listed here
   must also have a branch in renderMarkdown, or its lines would be consumed
   as an empty paragraph. */
const startsBlock = (line) =>
  line.startsWith('## ') || line.startsWith('### ') || line.startsWith('|') ||
  /^\d+\. /.test(line) || /^- /.test(line) || line.startsWith(':::') ||
  line.startsWith('> ');

/* Markdown this renderer does not implement. These used to be swallowed into a
   paragraph and shipped as literal characters, so they now stop the build and
   say what to write instead. */
const UNSUPPORTED = [
  [/^#{4,} /, 'headings deeper than ### are not supported; restructure the section'],
  [/^!\[/, 'images are placed through the figure registry in the builder, not in Markdown'],
  [/^(\*|\+) /, 'use "- " for a bullet list'],
  [/^(-{3,}|_{3,})\s*$/, 'horizontal rules are not supported; use a "## " heading instead'],
  [/^\s+(-|\d+\.) /, 'nested lists are not supported; flatten the list'],
  [/^```/, 'fenced code blocks are not supported; use `inline code`'],
];

/* `resolveLink(target)` turns a Markdown link target into an href, or throws
   if the target is not something this site is allowed to link to. Builders
   supply their own so each can enforce its own rules. */
export function makeInline(resolveLink) {
  return function inline(text) {
    const code = [];
    let out = esc(text).replace(/`([^`]+)`/g, (_, value) => {
      code.push(`<code>${value}</code>`);
      return `@@CODE${code.length - 1}@@`;
    });
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => resolveLink(target, label));
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    /* Single-asterisk emphasis, after bold so `**x**` is already gone. Both
       delimiters must hug non-space, so an asterisk used as a multiplication
       sign between numbers is left alone. Authors were already writing
       *beyond* and *not*, and it was reaching students as literal asterisks. */
    out = out.replace(/\*(?=\S)([^*\n]+?)(?<=\S)\*/g, '<em>$1</em>');
    return out.replace(/@@CODE(\d+)@@/g, (_, n) => code[Number(n)]);
  };
}

/* An https link opens in a new tab and is marked; a site-absolute link does
   not. Builders that also allow chapter-to-chapter Markdown paths wrap this. */
export function externalOrLocal(target, label) {
  if (target.startsWith('/') && !target.startsWith('//')) return `<a href="${target}">${label}</a>`;
  const parsed = new URL(target.replaceAll('&amp;', '&'));
  if (parsed.protocol !== 'https:') throw new Error(`Unsupported link: ${target}`);
  return `<a href="${esc(parsed.href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
}

export function renderMarkdown(markdown, options) {
  const {
    source = '(inline)',
    inline,
    tableClass = 'reading-table-wrap',
    answerClass = 'reading-answer',
    onHeading = () => null,
  } = options;

  const lines = markdown.trim().split(/\r?\n/);
  const first = lines.shift();
  if (!first?.startsWith('# ')) throw new Error(`Missing title: ${source}`);
  const title = first.slice(2).trim();
  const headings = [];
  const parts = [];

  const table = (block, label) => {
    const rows = block.map(splitRow);
    if (rows.length < 3 || !rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) throw new Error(`Bad table in ${source}`);
    /* A row whose cell count differs from the header used to render as a
       ragged table rather than failing. That is how a formula containing
       absolute-value bars silently split one cell into three. */
    const width = rows[0].length;
    rows.forEach((cells, index) => {
      if (cells.length !== width) {
        throw new Error(
          `Table row ${index + 1} in ${source} has ${cells.length} cells but the header has ${width}.\n` +
          `  row: ${block[index].trim()}\n` +
          `  A literal | inside a cell must sit inside backticks, for example \`|a - b|\`.`
        );
      }
    });
    const head = `<thead><tr>${rows[0].map((cell) => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${rows.slice(2).map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    /* Scrolls sideways on a narrow screen, so it has to be focusable or a
       keyboard reader cannot reach the columns that overflow. */
    const name = esc(label ? `Table: ${label}` : 'Table');
    return `<div class="${tableClass}" role="region" aria-label="${name}" tabindex="0"><table>${head}${body}</table></div>`;
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    for (const [pattern, advice] of UNSUPPORTED) {
      if (pattern.test(lines[i])) throw new Error(`Unsupported Markdown in ${source}: ${lines[i].trim()}\n  ${advice}`);
    }
    if (/^\*\*.*Early reading edition\*\*$/.test(line)) { i++; continue; }

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      const id = slug(text);
      headings.push({ text, id });
      parts.push(`<h2 id="${id}">${esc(text)}</h2>`);
      const extra = onHeading(id, text);
      if (extra) parts.push(extra);
      i++;
    } else if (line.startsWith(':::answer ')) {
      const label = line.slice(':::answer '.length).trim();
      const block = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') block.push(lines[i++]);
      if (i === lines.length || !label) throw new Error(`Invalid answer disclosure in ${source}`);
      i++;
      const answer = block.join('\n').trim().split(/\n\s*\n/)
        .map((p) => `<p>${inline(p.replace(/\n/g, ' '))}</p>`).join('');
      parts.push(`<details class="${answerClass}"><summary>${esc(label)}</summary>${answer}</details>`);
    } else if (line.startsWith(':::')) {
      throw new Error(`Unknown disclosure marker in ${source}: ${line}`);
    } else if (line.startsWith('### ')) {
      parts.push(`<h3>${esc(line.slice(4).trim())}</h3>`);
      i++;
    } else if (line.startsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++]);
      parts.push(table(block, headings[headings.length - 1]?.text));
    } else if (/^\d+\. /.test(line)) {
      const block = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) block.push(lines[i++].trim().replace(/^\d+\. /, ''));
      parts.push(`<ol>${block.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`);
    } else if (/^- /.test(line)) {
      const block = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) block.push(lines[i++].trim().slice(2));
      parts.push(`<ul>${block.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
    } else if (line.startsWith('> ')) {
      /* Used to set apart a configuration or statement the section then works
         from. Consecutive quoted lines join into one paragraph. */
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) block.push(lines[i++].trim().slice(2).trim());
      parts.push(`<blockquote><p>${inline(block.join(' '))}</p></blockquote>`);
    } else {
      const block = [];
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i].trim())) block.push(lines[i++].trim());
      parts.push(`<p>${inline(block.join(' '))}</p>`);
    }
  }

  return { title, headings, body: parts.join('\n') };
}
