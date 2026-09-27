/* Figure helpers for the Semester 1 study text.
 * Graphs are computed from the stated functions, so a plotted curve, point or
 * tangent always agrees with the mathematics in the text. Every figure gets a
 * <title> and <desc>; ids are prefixed by the figure id so several figures can
 * share a page without duplicate ids.
 */
export const COLORS = { ink: '#183b3f', muted: '#5e7376', grid: '#e1e8e3', a: '#176e66', b: '#9b6328', c: '#b3412e', d: '#355b90', fill: '#e6f0ea', paper: '#ffffff' };
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const n = (v) => Number(v.toFixed(1));
const FONT = 'font-family="Inter, Segoe UI, Arial, sans-serif"';

export function svg(id, { w = 480, h = 320, title, desc }, body) {
  const markers = Object.entries({ a: COLORS.a, b: COLORS.b, c: COLORS.c, d: COLORS.d, ink: COLORS.ink })
    .map(([k, col]) => `<marker id="${id}-m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" ${FONT} font-size="15" class="study-svg"><title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc><defs>${markers}</defs>${body.replaceAll('#ID', id)}</svg>`;
}

export function text(x, y, s, { color = COLORS.ink, anchor = 'start', size = 15, weight = 400, italic = false } = {}) {
  return `<text x="${n(x)}" y="${n(y)}" fill="${color}" text-anchor="${anchor}" font-size="${size}"${weight !== 400 ? ` font-weight="${weight}"` : ''}${italic ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
}
export function line(x1, y1, x2, y2, { color = COLORS.ink, width = 2, dash = '', arrow = '' } = {}) {
  const m = arrow ? ` marker-end="url(##ID-m-${arrow})"` : '';
  return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}${m}/>`;
}
/** A vector arrow. `arrow` is a colour key: a, b, c, d or ink. */
export function vector(x1, y1, x2, y2, key = 'a', width = 3) {
  return line(x1, y1, x2, y2, { color: COLORS[key], width, arrow: key });
}
export function rect(x, y, w, h, { fill = COLORS.fill, stroke = COLORS.ink, width = 1.5, rx = 6, rotate = '' } = {}) {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${rotate ? ` transform="rotate(${rotate})"` : ''}/>`;
}
export function circle(x, y, r, { fill = COLORS.a, stroke = 'none', width = 2 } = {}) {
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}
export function path(d, { color = COLORS.a, width = 3, fill = 'none', dash = '' } = {}) {
  return `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linejoin="round" stroke-linecap="round"/>`;
}
/** A labelled box (for flow diagrams). Lines of text are centred. */
export function box(x, y, w, h, lines, { fill = COLORS.fill, stroke = COLORS.a, color = COLORS.ink, size = 15, bold = true } = {}) {
  const arr = Array.isArray(lines) ? lines : [lines];
  const top = y + h / 2 - ((arr.length - 1) * (size + 4)) / 2 + size / 3;
  return rect(x, y, w, h, { fill, stroke }) + arr.map((s, i) => text(x + w / 2, top + i * (size + 4), s, { anchor: 'middle', color, size, weight: bold && i === 0 && arr.length > 1 ? 650 : 400 })).join('');
}

/** A coordinate plot. Items are drawn in data coordinates. */
export function plot({ w = 480, h = 320, x: [x0, x1], y: [y0, y1], xticks = [], yticks = [], xlabel = 'x', ylabel = 'y', margin = {} }, items) {
  const m = { l: 46, r: 22, t: 18, b: 38, ...margin };
  const X = (v) => m.l + ((v - x0) / (x1 - x0)) * (w - m.l - m.r);
  const Y = (v) => h - m.b - ((v - y0) / (y1 - y0)) * (h - m.t - m.b);
  const ax = y0 <= 0 && y1 >= 0 ? Y(0) : h - m.b; // x-axis position
  const ay = x0 <= 0 && x1 >= 0 ? X(0) : m.l; // y-axis position
  let s = '';
  for (const t of xticks) s += line(X(t), m.t, X(t), h - m.b, { color: COLORS.grid, width: 1 });
  for (const t of yticks) s += line(m.l, Y(t), w - m.r, Y(t), { color: COLORS.grid, width: 1 });
  s += line(m.l - 6, ax, w - m.r + 4, ax, { color: COLORS.ink, width: 1.6 }) + line(ay, h - m.b + 6, ay, m.t - 4, { color: COLORS.ink, width: 1.6 });
  for (const t of xticks) s += line(X(t), ax - 4, X(t), ax + 4, { width: 1.4 }) + text(X(t), Math.min(ax + 20, h - 4), fmt(t), { anchor: 'middle', size: 13, color: COLORS.muted });
  for (const t of yticks) s += line(ay - 4, Y(t), ay + 4, Y(t), { width: 1.4 }) + text(ay - 8, Y(t) + 4.5, fmt(t), { anchor: 'end', size: 13, color: COLORS.muted });
  s += text(w - m.r + 2, ax - 8, xlabel, { anchor: 'end', italic: true, color: COLORS.muted }) + text(ay + 8, m.t + 12, ylabel, { italic: true, color: COLORS.muted });
  const api = { X, Y };
  for (const it of items) s += typeof it === 'function' ? it(api) : '';
  return { w, h, body: s };
}
const fmt = (t) => (Number.isInteger(t) ? String(t) : String(t)).replace('-', '−');

// Plot items (functions of the coordinate map)
export const curve = (f, from, to, { color = COLORS.a, width = 3, dash = '', steps = 160, clip } = {}) => ({ X, Y }) => {
  let d = '', pen = false;
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps, y = f(x);
    const ok = Number.isFinite(y) && (!clip || (y >= clip[0] && y <= clip[1]));
    if (ok) { d += `${pen ? 'L' : 'M'}${n(X(x))},${n(Y(y))} `; pen = true; } else pen = false;
  }
  return path(d.trim(), { color, width, dash });
};
export const seg = (xa, ya, xb, yb, opts = {}) => ({ X, Y }) => line(X(xa), Y(ya), X(xb), Y(yb), { color: COLORS.b, width: 2, ...opts });
export const arrowSeg = (xa, ya, xb, yb, key = 'b', width = 2.5) => ({ X, Y }) => vector(X(xa), Y(ya), X(xb), Y(yb), key, width);
export const dot = (x, y, { open = false, color = COLORS.a, r = 5.5 } = {}) => ({ X, Y }) => circle(X(x), Y(y), r, open ? { fill: COLORS.paper, stroke: color, width: 2.5 } : { fill: color });
export const label = (x, y, s, { dx = 0, dy = 0, ...o } = {}) => ({ X, Y }) => text(X(x) + dx, Y(y) + dy, s, o);
export const dashTo = (x, y, { color = COLORS.b } = {}) => ({ X, Y }) => line(X(x), Y(y), X(x), Y(0), { color, width: 1.6, dash: '5 4' }) + line(X(x), Y(y), X(0), Y(y), { color, width: 1.6, dash: '5 4' });
export const shade = (f, g, from, to, { color = COLORS.fill } = {}) => ({ X, Y }) => {
  const k = 60; let d = '';
  for (let i = 0; i <= k; i++) { const x = from + ((to - from) * i) / k; d += `${i ? 'L' : 'M'}${n(X(x))},${n(Y(f(x)))} `; }
  for (let i = k; i >= 0; i--) { const x = from + ((to - from) * i) / k; d += `L${n(X(x))},${n(Y(g(x)))} `; }
  return `<path d="${d}Z" fill="${color}" stroke="none"/>`;
};
export const raw = (s) => () => s;

export function render(id, meta, p) { return svg(id, { w: p.w, h: p.h, ...meta }, p.body); }
