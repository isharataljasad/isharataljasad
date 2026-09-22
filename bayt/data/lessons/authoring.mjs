/* Small authoring helpers; all lesson explanations and questions are authored per topic. */
export const def = (term, en, text) => ({term, en, text});
export const rel = (formula, name, note) => ({formula, name, note});
export const step = (action, why) => ({do: action, why});
export const example = (title, task, steps, answer) => ({title, task, steps, answer});
export const question = (id, family, objective, prompt, answer, unit, solution, errors, tolerance = 0.001) => ({
  id, family, aim: family, objectives: Array.isArray(objective) ? objective : [objective], prompt,
  answer, unit, tolerance, solution, commonErrors: errors.map(([value, why]) => ({value, why})),
});
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function plot(id, title, fn, range, markers = []) {
  const [xmin,xmax,ymin,ymax] = range;
  const X = x => 55 + (x-xmin)/(xmax-xmin)*410;
  const Y = y => 265 - (y-ymin)/(ymax-ymin)*230;
  const points = Array.from({length: 121}, (_,i) => {const x=xmin+(xmax-xmin)*i/120; return `${X(x)},${Y(fn(x))}`;}).join(' ');
  return `<svg viewBox="0 0 520 310" role="img" aria-labelledby="${id}-title" class="bayt-svg"><title id="${id}-title">${esc(title)}</title><defs><clipPath id="${id}-clip"><rect x="55" y="35" width="410" height="230"/></clipPath></defs><path d="M55 35V265H475" fill="none" stroke="#284955" stroke-width="2"/><g clip-path="url(#${id}-clip)"><polyline points="${points}" fill="none" stroke="#105c78" stroke-width="3"/>${markers.map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="#c0392b"/>`).join('')}</g><g font-size="16" fill="#284955" direction="ltr" text-anchor="middle"><text x="55" y="289">${xmin}</text><text x="465" y="289">${xmax}</text><text x="480" y="267">x</text><text x="28" y="43">${ymax}</text><text x="28" y="265">${ymin}</text><text x="28" y="22">y</text></g></svg>`;
}
export function flow(id, title, labels) {
  return `<svg viewBox="0 0 520 310" role="img" aria-labelledby="${id}-title" class="bayt-svg"><title id="${id}-title">${esc(title)}</title>${labels.map((label,i)=>`<rect x="45" y="${20+i*95}" width="430" height="65" rx="12" fill="${i===1?'#105c78':'#e9f2f5'}" stroke="#105c78"/><text x="260" y="${60+i*95}" direction="ltr" text-anchor="middle" font-size="22" fill="${i===1?'white':'#153748'}">${esc(label)}</text>${i<2?`<path d="M260 ${87+i*95}v22m-7-7 7 7 7-7" fill="none" stroke="#b36a13" stroke-width="3"/>`:''}`).join('')}</svg>`;
}
