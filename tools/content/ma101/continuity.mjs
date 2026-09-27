import { plot, render, curve, dot, label, raw, seg } from '../svg.mjs';
import { svg, text, line } from '../svg.mjs';

// Three panels side by side: removable, jump, infinite discontinuity.
function panel(dx, kind) {
  const X = (x) => dx + 20 + x * 30, Y = (y) => 200 - y * 30; // x, y in 0..4
  let s = line(dx + 10, 200, dx + 150, 200, { width: 1.4 }) + line(dx + 20, 205, dx + 20, 50, { width: 1.4 });
  if (kind === 'removable') {
    s += `<path d="M${X(0.2)},${Y(0.8)} L${X(4.2)},${Y(3.6)}" stroke="#176e66" stroke-width="3" fill="none"/>`;
    const y2 = 0.8 + (2 - 0.2) * (2.8 / 4);
    s += `<circle cx="${X(2)}" cy="${Y(y2)}" r="5.5" fill="#fff" stroke="#b3412e" stroke-width="2.5"/><circle cx="${X(2)}" cy="${Y(4.3)}" r="5" fill="#176e66"/>`;
  } else if (kind === 'jump') {
    s += `<path d="M${X(0.2)},${Y(1)} L${X(2)},${Y(1.8)}" stroke="#176e66" stroke-width="3" fill="none"/><path d="M${X(2)},${Y(3.2)} L${X(4.2)},${Y(3.8)}" stroke="#176e66" stroke-width="3" fill="none"/>`;
    s += `<circle cx="${X(2)}" cy="${Y(1.8)}" r="5.5" fill="#fff" stroke="#b3412e" stroke-width="2.5"/><circle cx="${X(2)}" cy="${Y(3.2)}" r="5" fill="#176e66"/>`;
  } else {
    const f = (x) => 0.35 / ((x - 2) ** 2);
    let d1 = '', d2 = '';
    for (let i = 0; i <= 40; i++) { const x = 0.2 + (1.72 - 0.2) * i / 40; d1 += `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(Math.min(f(x), 5)).toFixed(1)} `; }
    for (let i = 0; i <= 40; i++) { const x = 2.28 + (4.2 - 2.28) * i / 40; d2 += `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(Math.min(f(x), 5)).toFixed(1)} `; }
    s += `<path d="${d1}" stroke="#176e66" stroke-width="3" fill="none"/><path d="${d2}" stroke="#176e66" stroke-width="3" fill="none"/>`;
    s += line(X(2), 45, X(2), 205, { color: '#9b6328', width: 1.6, dash: '5 4' });
  }
  return s;
}
const titles = { removable: ['Removable', 'limit exists ≠ value'], jump: ['Jump', 'one-sided limits differ'], infinite: ['Infinite', 'values grow without bound'] };
const fig = svg('ma-cont', { w: 510, h: 270, title: 'Three kinds of discontinuity at x = a', desc: 'Left: a line with an open circle (hole) and the function value drawn as a separate dot above it, a removable discontinuity. Middle: two line pieces with a gap between them at the same x, a jump discontinuity. Right: a curve rising without bound on both sides of a dashed vertical asymptote, an infinite discontinuity.' },
  ['removable', 'jump', 'infinite'].map((k, i) => panel(i * 170, k) + text(i * 170 + 85, 232, titles[k][0], { anchor: 'middle', weight: 650 }) + text(i * 170 + 85, 254, titles[k][1], { anchor: 'middle', size: 13, color: '#5e7376' })).join(''));

// IVT picture: continuous curve from f(a) < 0 to f(b) > 0 crosses zero.
const g = (x) => x ** 3 - x - 1;
const ivt = render('ma-ivt', {
  title: 'Intermediate Value Theorem for f(x) = x³ − x − 1 on [1, 2]',
  desc: 'The curve starts below the x-axis at x = 1, where f(1) = −1, and ends above it at x = 2, where f(2) = 5. Because the curve is unbroken it must cross the axis between them, near x = 1.32.',
}, plot({ x: [0.5, 2.2], y: [-2, 6], xticks: [1, 1.5, 2], yticks: [-1, 1, 3, 5], xlabel: 'x', ylabel: 'y' }, [
  curve(g, 0.6, 2.1),
  dot(1, -1, { color: '#b3412e' }), dot(2, 5, { color: '#355b90' }), dot(1.3247, 0, { open: true, color: '#9b6328' }),
  label(1, -1, 'f(1) = −1', { dx: 10, dy: 20, color: '#b3412e', size: 14 }),
  label(2, 5, 'f(2) = 5', { dx: -12, dy: -6, anchor: 'end', color: '#355b90', size: 14 }),
  label(1.3247, 0, 'root c ≈ 1.32', { dx: -10, dy: -12, anchor: 'end', color: '#9b6328', size: 14 }),
]));

export default {
  summary: 'A function is continuous at a point when its limit there exists and equals its value: no holes, jumps or breaks.',
  why: [
    'Continuity is the mathematical version of “no sudden breaks”. Temperatures, positions and concentrations in physical processes change continuously, and many theorems of calculus (the Intermediate Value Theorem, the Extreme Value Theorem and the Mean Value Theorem) only work for continuous functions. Before you use one of those theorems you must check continuity.',
    'Continuity also tells you when direct substitution is allowed: at a point of continuity, the limit is simply the value.',
  ],
  idea: [
    'Informally, a function is continuous on an interval if you can draw its graph there without lifting your pen. Precisely, continuity at a single point x = a requires three things to happen together: f(a) is defined, lim_{x→a} f(x) exists, and the two are equal.',
    'When one of the three conditions fails we have a **discontinuity**, and its type tells you what went wrong. A **removable** discontinuity is a hole: the limit exists but the value is missing or different; redefining one value repairs it. A **jump** discontinuity has different one-sided limits; no single value can repair it. An **infinite** discontinuity has the function growing without bound, as with {{1|x}} at 0.',
    'Most functions you meet are continuous wherever they are defined: polynomials everywhere; rational functions except where the denominator is zero; √{x} for x ≥ 0; sin x and cos x everywhere; e^{x} everywhere and ln x for x > 0. Sums, products and compositions of continuous functions are continuous, and so are quotients wherever the denominator is not zero. The places to check carefully are the “joins” of piecewise functions and the zeros of denominators.',
    'Continuity on a closed interval [a, b] guarantees the **Intermediate Value Theorem**: the function takes every value between f(a) and f(b). In particular, if f(a) and f(b) have opposite signs, the equation f(x) = 0 has a solution between a and b. This is how we know an equation has a root before we can find it.',
  ],
  background: [
    { title: 'Limits and one-sided limits', text: 'lim_{x→a} f(x) = L means f(x) approaches L as x approaches a from both sides (see the Limits topic). For a piecewise function, the left-hand limit uses the rule for x < a and the right-hand limit uses the rule for x > a.' },
    { title: 'Domains', text: 'A rational function is undefined where its denominator is zero; √{u} needs u ≥ 0; ln u needs u > 0. A function cannot be continuous at a point where it is not defined.' },
  ],
  definitions: [
    ['Continuous at a point', 'f is continuous at x = a when (1) f(a) is defined, (2) lim_{x→a} f(x) exists, and (3) lim_{x→a} f(x) = f(a).'],
    ['Continuous on an interval', 'f is continuous at every point of an open interval (a, b). On a closed interval [a, b] we also need one-sided continuity at the ends: lim_{x→a^{+}} f(x) = f(a) and lim_{x→b^{−}} f(x) = f(b).'],
    ['Removable discontinuity', 'The limit at a exists, but f(a) is undefined or differs from it. Defining f(a) to be the limit removes the discontinuity.'],
    ['Jump discontinuity', 'Both one-sided limits exist but are different. The size of the jump is |right limit − left limit|.'],
    ['Infinite discontinuity', 'At least one one-sided limit is +∞ or −∞. The graph has a vertical asymptote at x = a.'],
  ],
  symbols: [
    ['f(a)', 'the value of f at a (must exist for continuity)', 'output units'],
    ['lim_{x→a^{±}} f(x)', 'one-sided limits from the right (+) or left (−)', 'output units'],
    ['[a, b], (a, b)', 'closed interval (endpoints included), open interval (endpoints excluded)', 'input units'],
  ],
  formulas: [
    { name: 'Continuity test', f: 'lim_{x→a} f(x) = f(a)', when: 'All three parts must be checked: the value exists, the limit exists, and they are equal.' },
    { name: 'Continuity of combinations', f: 'f ± g,  f·g,  {{f|g}},  f(g(x)) are continuous', when: 'When f and g are continuous at the relevant points; the quotient needs g(a) ≠ 0; the composition needs g continuous at a and f continuous at g(a).' },
    { name: 'Intermediate Value Theorem (IVT)', f: 'f continuous on [a, b] and N between f(a) and f(b)  ⇒  f(c) = N for some c in (a, b)', when: 'Continuity on the whole closed interval is essential. The theorem guarantees that c exists; it does not say where, or that there is only one.' },
  ],
  derivation: {
    title: 'Why the IVT needs continuity',
    intro: 'Consider f(x) = −1 for x < 0 and f(x) = 1 for x ≥ 0, on [−1, 1].',
    steps: [
      ['f(−1) = −1 < 0 and f(1) = 1 > 0, so the signs are opposite.', 'This is the situation in which the IVT would promise a zero.'],
      ['Yet f(x) is never 0: it only takes the values −1 and 1.', 'The graph jumps over the axis at x = 0.'],
      ['The hypothesis fails: f has a jump discontinuity at 0.', 'Without continuity the conclusion of the theorem can be false.'],
    ],
    end: 'A theorem’s conclusion is only guaranteed when its conditions are checked. That is why every IVT argument starts with “f is continuous on [a, b] because …”.',
  },
  figure: { svg: fig, caption: 'The three kinds of discontinuity. A hole (open circle) with the value elsewhere can be repaired; a jump or a vertical asymptote cannot.' },
  figures: [{ svg: ivt, caption: 'f(x) = x³ − x − 1 is continuous and changes sign between x = 1 and x = 2, so it has a root in between (about 1.32).' }],
  table: {
    caption: 'Checking the three conditions',
    head: ['Function at a', 'f(a) defined?', 'limit exists?', 'equal?', 'verdict'],
    rows: [
      ['x² + 1 at a = 2', 'yes, 5', 'yes, 5', 'yes', 'continuous'],
      ['(x² − 4)/(x − 2) at a = 2', 'no', 'yes, 4', '—', 'removable discontinuity'],
      ['same, but with f(2) = 4 defined', 'yes, 4', 'yes, 4', 'yes', 'continuous (repaired)'],
      ['x + 2 for x < 1, x² for x ≥ 1, at a = 1', 'yes, 1', 'no: left 3, right 1', '—', 'jump of size 2'],
      ['1/(x − 3)² at a = 3', 'no', 'no: +∞', '—', 'infinite discontinuity'],
    ],
  },
  method: {
    title: 'How to test continuity at x = a (especially for piecewise functions)',
    steps: [
      'Find f(a) from the rule that applies at a (watch for ≤ versus <). If it is undefined, f is not continuous at a.',
      'Find the left-hand limit using the rule for x < a and the right-hand limit using the rule for x > a.',
      'If the one-sided limits differ, there is a jump: not continuous. If they agree, that common value is the limit.',
      'Compare the limit with f(a). Equal: continuous. Different: removable discontinuity.',
      'To make a piecewise function continuous by choosing a constant, set the left-hand and right-hand expressions equal at the join and solve.',
    ],
  },
  examples: [
    {
      title: 'Repair a removable discontinuity',
      problem: 'f(x) = 2x + 1 for x ≠ 2. What value of f(2) makes f continuous at 2?',
      steps: [
        ['lim_{x→2} (2x + 1) = 5.', '2x + 1 is a polynomial, so substitute x = 2.'],
        ['Continuity needs f(2) = lim_{x→2} f(x).', 'The third condition of the definition.'],
      ],
      result: 'Define f(2) = 5.',
      meaning: 'Filling the hole with the limiting value makes the graph an unbroken line.',
    },
    {
      title: 'A piecewise function with a jump',
      problem: 'f(x) = x + 2 for x < 1 and f(x) = x^{2} for x ≥ 1. Is f continuous at x = 1? If not, how big is the jump?',
      steps: [
        ['f(1) = 1^{2} = 1.', 'x = 1 belongs to the rule for x ≥ 1.'],
        ['Left-hand limit: lim_{x→1^{−}} (x + 2) = 3.', 'Use the rule that holds for x < 1.'],
        ['Right-hand limit: lim_{x→1^{+}} x^{2} = 1.', 'Use the rule that holds for x > 1.'],
        ['3 ≠ 1, so the two-sided limit does not exist.', 'Condition (2) fails.'],
      ],
      result: 'f is not continuous at 1. It has a jump discontinuity of size |1 − 3| = 2.',
      meaning: 'No choice of f(1) could fix this, because the two pieces approach different heights.',
    },
    {
      title: 'Choose a constant to make a piecewise function continuous',
      problem: 'f(x) = kx + 1 for x < 2 and f(x) = x^{2} − 1 for x ≥ 2. Find k so that f is continuous everywhere.',
      steps: [
        ['Each piece is a polynomial, so f is continuous everywhere except possibly at the join x = 2.', 'Polynomials are continuous on their own.'],
        ['Right-hand limit and value: 2^{2} − 1 = 3. Left-hand limit: 2k + 1.', 'Substitute x = 2 into each rule.'],
        ['Set them equal: 2k + 1 = 3, so k = 1.', 'Continuity at the join requires equal one-sided limits, equal to f(2).'],
      ],
      result: 'k = 1.',
      meaning: 'With k = 1 the line y = x + 1 meets the parabola exactly at (2, 3).',
    },
    {
      title: 'Show that an equation has a root (IVT)',
      problem: 'Show that x^{3} − x − 1 = 0 has a solution between 1 and 2.',
      steps: [
        ['Let f(x) = x^{3} − x − 1. It is a polynomial, so it is continuous on [1, 2].', 'Check the hypothesis first.'],
        ['f(1) = 1 − 1 − 1 = −1 < 0 and f(2) = 8 − 2 − 1 = 5 > 0.', 'The values have opposite signs, so 0 lies between them.'],
        ['By the IVT there is c in (1, 2) with f(c) = 0.', 'The theorem applies because both conditions hold.'],
      ],
      result: 'The equation has a root in (1, 2). (Numerically, c ≈ 1.3247.)',
      meaning: 'The IVT proves existence. To locate the root more precisely, halve the interval repeatedly: f(1.5) = 0.875 > 0, so the root lies in (1, 1.5), and so on.',
    },
    {
      title: 'Where is a rational function discontinuous?',
      problem: 'Find and classify the discontinuities of f(x) = {{x^{2} − 1|x^{2} − 3x + 2}}.',
      steps: [
        ['Factor: {{(x − 1)(x + 1)|(x − 1)(x − 2)}}. The denominator is zero at x = 1 and x = 2.', 'A rational function is continuous everywhere else.'],
        ['At x = 1: for x ≠ 1, f(x) = {{x + 1|x − 2}} → {{2|−1}} = −2. The limit exists, f(1) does not.', 'The factor (x − 1) cancels: removable discontinuity.'],
        ['At x = 2: the numerator of {{x + 1|x − 2}} tends to 3 and the denominator to 0.', 'Non-zero over zero means the values grow without bound: infinite discontinuity.'],
      ],
      result: 'Removable discontinuity at x = 1 (hole at (1, −2)); infinite discontinuity (vertical asymptote) at x = 2.',
      meaning: 'A factor that cancels gives a hole; a factor that remains in the denominator gives an asymptote.',
    },
  ],
  mistakes: [
    ['“f(a) exists, so f is continuous at a.”', 'The value is only the first of three conditions. The limit must also exist and equal f(a).'],
    ['“The limit exists, so f is continuous.”', 'The limit may differ from the value (a removable discontinuity), or the value may be missing.'],
    ['Using the wrong rule at the join of a piecewise function.', 'Read the inequality signs: with “x ≥ 1”, f(1) comes from the second rule, but the left-hand limit comes from the first.'],
    ['“The IVT tells us where the root is.”', 'It only guarantees that at least one root exists in the interval. Finding it needs further work (for example, repeated halving).'],
    ['“1/x is discontinuous, so it is not a continuous function.”', '1/x is continuous at every point of its domain (x ≠ 0). It is discontinuous at 0, which is not in its domain. Always say where.'],
  ],
  scope: [
    'Continuity is treated for functions of one real variable. Uniform continuity and ε–δ proofs of continuity are beyond this course level.',
    'The Extreme Value Theorem (a continuous function on [a, b] has a maximum and a minimum) is used in the “Extrema and curve shape” topic.',
  ],
  checks: [
    ['k', (2 ** 2 - 1 - 1) / 2, 1, 0],
    ['f(1)', 1 - 1 - 1, -1, 0], ['f(2)', 8 - 2 - 1, 5, 0], ['f(1.5)', 1.5 ** 3 - 1.5 - 1, 0.875, 1e-12],
    ['root', 1.3247 ** 3 - 1.3247 - 1, 0, 1e-3],
    ['limit at 1', (1.000001 ** 2 - 1) / (1.000001 ** 2 - 3 * 1.000001 + 2), -2, 1e-4],
  ],
};
