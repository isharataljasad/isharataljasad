import { plot, render, curve, dot, label } from '../svg.mjs';

const f = (x) => x ** 3 - 3 * x; // f' = 3x² − 3, f'' = 6x
const fig = render('ma-shape', {
  title: 'Shape of f(x) = x³ − 3x from the signs of f′ and f″',
  desc: 'The cubic rises to a local maximum at (−1, 2), falls through an inflection point at the origin, reaches a local minimum at (1, −2) and rises again. Left of x = 0 it is concave down; right of x = 0 it is concave up.',
}, plot({ x: [-2.4, 2.4], y: [-3.4, 3.4], xticks: [-2, -1, 1, 2], yticks: [-2, 2], xlabel: 'x', ylabel: 'y' }, [
  curve(f, -2.2, 2.2, { clip: [-3.4, 3.4] }),
  dot(-1, 2, { color: '#b3412e' }), dot(1, -2, { color: '#355b90' }), dot(0, 0, { open: true, color: '#9b6328' }),
  label(-1, 2, 'local max (−1, 2)', { dy: -12, anchor: 'middle', size: 14, color: '#b3412e' }),
  label(1, -2, 'local min (1, −2)', { dy: 24, anchor: 'middle', size: 14, color: '#355b90' }),
  label(0, 0, 'inflection (0, 0)', { dx: 12, dy: -8, size: 14, color: '#9b6328' }),
  label(-2.3, 2.9, 'concave down', { size: 13, color: '#5e7376' }),
  label(1.5, 2.9, 'concave up', { anchor: 'end', size: 13, color: '#5e7376' }),
]));

export default {
  summary: 'The first derivative shows where a graph rises and falls; the second shows how it bends. Together they locate maxima, minima and inflection points.',
  why: [
    'Before computers drew graphs, engineers sketched them from derivatives — and they still check computer output that way. More importantly, locating maxima and minima is the basis of optimization: the largest yield, the smallest cost, the strongest beam. This topic gives the tests; the next applies them.',
  ],
  idea: [
    'The sign of f′ tells you the direction of the graph: f′ > 0 on an interval means f is increasing there, f′ < 0 means decreasing. (This follows from the Mean Value Theorem.) The graph can only turn around where f′ = 0 or where f′ does not exist. Those inputs, inside the domain, are the **critical points**.',
    'A critical point is only a candidate. At a **local maximum** the graph rises then falls, so f′ changes from + to −; at a **local minimum** f′ changes from − to +. If f′ does not change sign (as for x^{3} at 0), there is no extremum at all. This is the **first-derivative test**.',
    'The sign of f″ tells you how the graph bends. f″ > 0: **concave up**, shaped like a cup, with slopes increasing. f″ < 0: **concave down**, shaped like a cap. A point where the concavity changes is an **inflection point**. The **second-derivative test**: if f′(c) = 0 and f″(c) > 0 the point is a local minimum (bottom of a cup); if f″(c) < 0 it is a local maximum. If f″(c) = 0 the test says nothing and you must use the first-derivative test.',
    'On a **closed interval** [a, b], a continuous function always has an absolute maximum and an absolute minimum (the Extreme Value Theorem). They occur either at critical points or at the endpoints, so you find them by comparing the function values at all these candidates. Forgetting the endpoints is a classic error.',
    'For a full sketch, also check the domain, intercepts, symmetry and asymptotes (the behaviour as x → ±∞ and near points where the function is undefined).',
  ],
  background: [
    { title: 'Solving f′(x) = 0', text: 'Factor: 3x^{2} − 3 = 3(x − 1)(x + 1) = 0 gives x = ±1. A product is zero when one factor is zero.' },
    { title: 'Sign charts', text: 'Between consecutive zeros (and points of discontinuity) a continuous expression keeps one sign. Test one number in each interval.' },
    { title: 'Asymptotes', text: 'Vertical asymptote at x = a if f(x) → ±∞ as x → a. Horizontal asymptote y = L if f(x) → L as x → ±∞ (see Limits).' },
  ],
  definitions: [
    ['Critical point', 'A number c in the domain of f where f′(c) = 0 or f′(c) does not exist.'],
    ['Local maximum / minimum', 'f(c) is a local maximum if f(c) ≥ f(x) for all x near c (local minimum: ≤).'],
    ['Absolute maximum / minimum', 'The largest / smallest value of f on the whole domain or interval being considered.'],
    ['Concave up / down', 'On an interval, the graph lies above its tangent lines (up, f″ > 0) or below them (down, f″ < 0).'],
    ['Inflection point', 'A point on the graph where the concavity changes. f″ = 0 or undefined there is necessary but not sufficient.'],
  ],
  symbols: [
    ['f′(x)', 'slope: sign gives increasing (+) or decreasing (−)', 'output ÷ input'],
    ['f″(x)', 'rate of change of slope: sign gives concavity', 'output ÷ input²'],
    ['c', 'a critical point', 'input units'],
  ],
  formulas: [
    { name: 'First-derivative test', f: 'f′: + → −  at c ⇒ local max;   − → +  ⇒ local min;   no sign change ⇒ neither', when: 'f continuous at c; c a critical point. Works even when f″(c) = 0 or f′(c) does not exist.' },
    { name: 'Second-derivative test', f: 'f′(c) = 0 and f″(c) > 0 ⇒ local min;   f″(c) < 0 ⇒ local max', when: 'Needs f′(c) = 0 (not just “undefined”). If f″(c) = 0 the test is inconclusive.' },
    { name: 'Closed-interval method', f: 'absolute extrema on [a, b] ∈ { f(a), f(b), f(critical points in (a, b)) }', when: 'f continuous on the closed interval [a, b]. On open or infinite intervals an absolute extremum need not exist.' },
    { name: 'Concavity', f: 'f″ > 0 ⇒ concave up;   f″ < 0 ⇒ concave down', when: 'On an interval. At an inflection point the sign of f″ changes.' },
  ],
  derivation: {
    title: 'Why f″ = 0 does not always give an inflection point',
    intro: 'Consider f(x) = x^{4}.',
    steps: [
      ['f″(x) = 12x^{2}, so f″(0) = 0.', 'A candidate for inflection.'],
      ['But f″(x) = 12x^{2} > 0 on both sides of 0.', 'The concavity does not change: the graph is a cup on both sides.'],
      ['So (0, 0) is not an inflection point; it is actually a minimum.', 'An inflection point needs a change of sign.'],
    ],
    end: 'Always check the sign of f″ on both sides, just as the first-derivative test checks the sign of f′.',
  },
  figure: { svg: fig, caption: 'x³ − 3x: increasing, then decreasing between the critical points x = −1 and x = 1, then increasing. The concavity changes at x = 0.' },
  table: {
    caption: 'Sign chart for f(x) = x³ − 3x,  f′(x) = 3(x − 1)(x + 1),  f″(x) = 6x',
    head: ['interval / point', 'f′', 'f″', 'graph'],
    rows: [
      ['x < −1', '+', '−', 'increasing, concave down'],
      ['x = −1', '0', '−6', 'local maximum, f(−1) = 2'],
      ['−1 < x < 0', '−', '−', 'decreasing, concave down'],
      ['x = 0', '−3', '0', 'inflection point (0, 0)'],
      ['0 < x < 1', '−', '+', 'decreasing, concave up'],
      ['x = 1', '0', '+6', 'local minimum, f(1) = −2'],
      ['x > 1', '+', '+', 'increasing, concave up'],
    ],
  },
  method: {
    title: 'Curve-sketching and extrema procedure',
    steps: [
      'Domain, intercepts, symmetry, and asymptotes (limits at ±∞ and near excluded points).',
      'Compute f′; find critical points (f′ = 0 or undefined, inside the domain).',
      'Make a sign chart for f′: intervals of increase and decrease; classify each critical point (first-derivative test).',
      'Compute f″; make a sign chart: concavity and inflection points (where the sign changes).',
      'Plot the key points and join them with the shape the charts describe.',
      'For absolute extrema on [a, b]: evaluate f at the endpoints and at the critical points inside, and compare.',
    ],
  },
  examples: [
    {
      title: 'Locate a minimum',
      problem: 'Find the minimum of f(x) = x^{2} − 6x.',
      steps: [
        ['f′(x) = 2x − 6 = 0 ⇒ x = 3.', 'The only critical point.'],
        ['f″(x) = 2 > 0.', 'Concave up everywhere.'],
        ['f(3) = 9 − 18 = −9.', 'Evaluate at the critical point.'],
      ],
      result: 'Minimum value −9 at x = 3 (the vertex).',
      meaning: 'Because the parabola is concave up everywhere, this local minimum is also the absolute minimum.',
    },
    {
      title: 'Absolute extrema on a closed interval',
      problem: 'Find the absolute maximum and minimum of f(x) = x^{2} on [−1, 2].',
      steps: [
        ['f′(x) = 2x = 0 ⇒ x = 0, which is in [−1, 2].', 'Critical point inside.'],
        ['Candidates: f(−1) = 1, f(0) = 0, f(2) = 4.', 'Endpoints and critical point.'],
        ['Compare.', 'The largest and smallest of the candidate values.'],
      ],
      result: 'Absolute maximum 4 at x = 2; absolute minimum 0 at x = 0.',
      meaning: 'The maximum is at an endpoint, where f′ ≠ 0. Solving f′ = 0 alone would miss it.',
    },
    {
      title: 'Full analysis of a cubic',
      problem: 'Analyse f(x) = x^{3} − 3x: extrema, concavity and inflection.',
      steps: [
        ['f′(x) = 3x^{2} − 3 = 3(x − 1)(x + 1): critical points x = −1, 1.', 'Factor the derivative.'],
        ['Sign of f′: + for x < −1, − for −1 < x < 1, + for x > 1.', 'Test x = −2, 0, 2.'],
        ['So local max at x = −1, f(−1) = 2; local min at x = 1, f(1) = −2.', 'First-derivative test.'],
        ['f″(x) = 6x: negative for x < 0, positive for x > 0.', 'Sign change at 0.'],
        ['Inflection point at (0, 0).', 'Concavity changes there.'],
      ],
      result: 'Local max (−1, 2), local min (1, −2), inflection point (0, 0).',
      meaning: 'f is odd (f(−x) = −f(x)), so the graph is symmetric about the origin, which agrees with these results. There are no absolute extrema on the whole real line: f → ±∞.',
    },
    {
      title: 'A critical point that is not an extremum',
      problem: 'Classify the critical point of f(x) = x^{3}.',
      steps: [
        ['f′(x) = 3x^{2} = 0 ⇒ x = 0.', 'Critical point.'],
        ['f″(0) = 0: the second-derivative test is inconclusive.', 'Cannot decide from f″.'],
        ['f′(x) = 3x^{2} > 0 on both sides of 0.', 'No sign change of f′.'],
      ],
      result: 'x = 0 is neither a maximum nor a minimum (it is an inflection point with a horizontal tangent).',
      meaning: 'f′ = 0 identifies candidates; it does not by itself produce extrema.',
    },
    {
      title: 'Asymptotes in a sketch',
      problem: 'Describe the asymptotes and monotonicity of f(x) = {{2x|x − 1}}.',
      steps: [
        ['Domain: x ≠ 1. Near x = 1 the numerator → 2 and the denominator → 0: vertical asymptote x = 1.', 'Non-zero over zero.'],
        ['As x → ±∞, f(x) = {{2|1 − 1/x}} → 2: horizontal asymptote y = 2.', 'Divide by x.'],
        ['f′(x) = {{2(x − 1) − 2x|(x − 1)^{2}}} = {{−2|(x − 1)^{2}}} < 0.', 'Quotient rule.'],
      ],
      result: 'Asymptotes x = 1 and y = 2; f is decreasing on (−∞, 1) and on (1, ∞); no critical points and no extrema.',
      meaning: 'Say “decreasing on each interval”, not “decreasing everywhere”: f(0) = 0 < f(2) = 4 across the asymptote.',
    },
  ],
  mistakes: [
    ['Every critical point is a maximum or minimum.', 'Check the sign change: x³ has a critical point at 0 but no extremum.'],
    ['Forgetting endpoints when finding absolute extrema on [a, b].', 'Always evaluate f at a and b as well as at the critical points.'],
    ['f″(c) = 0 means inflection point.', 'The concavity must change; x⁴ has f″(0) = 0 but no inflection.'],
    ['Reporting the x-value when the question asks for the maximum value.', 'The maximum value is f(c); c is where it occurs. Give both.'],
    ['Including points outside the domain as critical points.', 'For 1/x, f′ is undefined at 0, but 0 is not in the domain, so it is not a critical point (still a place where the sign chart can change).'],
  ],
  scope: [
    'Graphs of functions of one variable only.',
    'Slant (oblique) asymptotes and detailed sketches of transcendental functions are not covered; check your outline for the level required.',
  ],
  checks: [
    ['f(−1)', f(-1), 2, 0], ['f(1)', f(1), -2, 0], ['min x²−6x', 9 - 18, -9, 0],
    ['closed', Math.max(1, 0, 4), 4, 0], ['f′ at 0 for 2x/(x−1)', -2 / 1, -2, 0],
    ['numeric f′(−1)=0', (f(-1 + 1e-6) - f(-1 - 1e-6)) / 2e-6, 0, 1e-6],
  ],
};
