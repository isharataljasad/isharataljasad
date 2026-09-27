/* Minimal, escaped reading markup for the Semester 1 study text.
 *
 *   **bold**        strong emphasis
 *   ^{...}          superscript          x^{2}, e^{3x}
 *   _{...}          subscript            v_{0}, H_{2}O
 *   {{num|den}}     stacked fraction     {{Δy|Δx}}
 *   √{...}          square root with a bar over its argument
 *
 * Everything else is HTML-escaped, so "<", ">" and "&" in mathematics are safe.
 * Groups may nest (for example {{x^{2} − 9|x − 3}}).
 */
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function group(s, i) {
  // s[i] is the character after an opening "{"; return [inner, indexAfterClosingBrace].
  let depth = 1, j = i;
  for (; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) break;
  }
  if (depth) throw new Error(`Unclosed group in: ${s}`);
  return [s.slice(i, j), j + 1];
}

function splitTop(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') depth--;
    else if (s[i] === '|' && depth === 0) return [s.slice(0, i), s.slice(i + 1)];
  }
  throw new Error(`Fraction without "|": {{${s}}}`);
}

function math(s) {
  let out = '';
  for (let i = 0; i < s.length;) {
    if (s.startsWith('{{', i)) {
      const [inner, next] = group(s, i + 1); // inner is "{num|den}"
      if (!inner.startsWith('{') || !inner.endsWith('}')) throw new Error(`Malformed fraction in: ${s}`);
      const [num, den] = splitTop(inner.slice(1, -1));
      out += `<span class="frac"><span class="num">${math(num)}</span><span class="vh"> / </span><span class="den">${math(den)}</span></span>`;
      i = next;
    } else if ((s[i] === '^' || s[i] === '_') && s[i + 1] === '{') {
      const [inner, next] = group(s, i + 2);
      out += s[i] === '^' ? `<sup>${math(inner)}</sup>` : `<sub>${math(inner)}</sub>`;
      i = next;
    } else if (s[i] === '√' && s[i + 1] === '{') {
      const [inner, next] = group(s, i + 2);
      out += `√<span class="rad">${math(inner)}</span>`;
      i = next;
    } else {
      out += esc(s[i]);
      i++;
    }
  }
  return out;
}

/** Render one line of study text. */
export function md(s) {
  if (s == null) return '';
  // Bold is applied after escaping; "**" never occurs in the mathematics.
  return math(String(s)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Plain text (for alt text, titles and search): strips the markup. */
const SUP = {0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹','+':'⁺','−':'⁻','-':'⁻',n:'ⁿ'};
const SUB = {0:'₀',1:'₁',2:'₂',3:'₃',4:'₄',5:'₅',6:'₆',7:'₇',8:'₈',9:'₉','+':'₊','−':'₋'};
const mapAll = (t, table, fallback) => [...t].every((c) => table[c]) ? [...t].map((c) => table[c]).join('') : fallback;
export function plain(s) {
  return String(s ?? '')
    .replace(/\{\{/g, '(').replace(/\}\}/g, ')').replace(/\|/g, ')/(')
    .replace(/\^\{([^{}]*)\}/g, (_, t) => mapAll(t, SUP, `^(${t})`))
    .replace(/_\{([^{}]*)\}/g, (_, t) => mapAll(t, SUB, `_${t}`))
    .replace(/√\{([^{}]*)\}/g, '√($1)').replace(/\*\*/g, '');
}

export { esc };
