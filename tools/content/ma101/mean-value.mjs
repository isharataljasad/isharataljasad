import { plot, render, curve, dot, label, seg } from '../svg.mjs';

const f = (x) => 0.25 * x * x - 0.5 * x + 1; // on [0, 4]; f(0)=1, f(4)=3, secant slope 0.5, f'(c)=0.5c−0.5=0.5 → c=2
const fig = render('ma-mvt', {
  title: 'Mean Value Theorem: a tangent parallel to the secant',
  desc: 'The curve y = x²/4 − x/2 + 1 on [0, 4] from (0, 1) to (4, 3). The secant line joining the endpoints has slope 0.5. At x = 2 the tangent line also has slope 0.5 and is drawn parallel to the secant.',
}, plot({ x: [-0.5, 4.8], y: [0, 4], xticks: [1, 2, 3, 4], yticks: [1, 2, 3], xlabel: 'x', ylabel: 'y' }, [
  curve(f, -0.3, 4.5),
  seg(0, 1, 4, 3, { color: '#9b6328', width: 2.5 }),
  seg(0.2, f(2) + 0.5 * (0.2 - 2), 3.8, f(2) + 0.5 * (3.8 - 2), { color: '#b3412e', width: 2.5, dash: '7 4' }),
  dot(0, 1, { color: '#9b6328' }), dot(4, 3, { color: '#9b6328' }), dot(2, 1, { color: '#b3412e' }),
  label(-0.45, 1.55, 'a = 0', { dx: 0, dy: 0, size: 14, color: '#9b6328' }),
  label(4, 3, 'b = 4', { dx: -8, dy: -12, anchor: 'end', size: 14, color: '#9b6328' }),
  label(2, 1, 'c = 2', { dx: 0, dy: 24, anchor: 'middle', size: 14, color: '#b3412e' }),
  label(3.9, 1.05, 'tangent ∥ secant', { dx: 0, dy: 0, anchor: 'end', size: 14, color: '#b3412e' }),
]));

export default {
  summary: 'If a smooth function goes from one value to another, somewhere its instantaneous rate equals its average rate.',
  why: [
    'The Mean Value Theorem (MVT) connects an average rate over an interval with an instantaneous rate at some point inside. It is the reason we can say “if f′ > 0 everywhere, f is increasing”, “if f′ = 0 everywhere, f is constant”, and it gives bounds such as “if the speed never exceeds 90 km/h, then in 2 hours you travel at most 180 km”.',
    'It is also a lesson in reading theorems carefully: the conclusion is guaranteed only when the hypotheses are checked.',
  ],
  idea: [
    'Drive 120 km in 1.5 hours: your average speed is 80 km/h. Common sense says your speedometer must have read exactly 80 km/h at some moment — you cannot average 80 without passing through 80 if your speed changes smoothly. The MVT is the precise version of this.',
    'Geometrically: join the endpoints (a, f(a)) and (b, f(b)) of the graph with a secant line. Somewhere between a and b there is a point c where the tangent line is **parallel** to the secant, so f′(c) equals the secant slope {{f(b) − f(a)|b − a}}.',
    '**Rolle’s theorem** is the special case f(a) = f(b): the secant is horizontal, so somewhere inside the tangent is horizontal, f′(c) = 0. A ball thrown up and caught at the same height has zero vertical velocity at the top.',
    'Both theorems need two hypotheses: f **continuous on the closed interval [a, b]** and **differentiable on the open interval (a, b)**. Without them the conclusion can fail. |x| on [−1, 1] has f(−1) = f(1), but no horizontal tangent, because of the corner at 0. The theorems promise existence of at least one c; they do not say how many or where. In simple examples we can locate c by solving f′(c) = slope.',
  ],
  background: [
    { title: 'Secant slope', text: 'The average rate of change of f on [a, b] is {{f(b) − f(a)|b − a}}.' },
    { title: 'Continuity and differentiability', text: 'Polynomials, sin, cos and e^{x} are continuous and differentiable everywhere. Rational functions fail where the denominator is 0; |x| and x^{2/3} fail to be differentiable at 0 (corner, cusp).' },
  ],
  definitions: [
    ['Rolle’s theorem', 'If f is continuous on [a, b], differentiable on (a, b), and f(a) = f(b), then there is at least one c in (a, b) with f′(c) = 0.'],
    ['Mean Value Theorem', 'If f is continuous on [a, b] and differentiable on (a, b), then there is at least one c in (a, b) with f′(c) = {{f(b) − f(a)|b − a}}.'],
    ['Hypotheses', 'The conditions of a theorem (here: continuity on [a, b], differentiability on (a, b), and for Rolle f(a) = f(b)). They must be checked before the conclusion is used.'],
  ],
  symbols: [
    ['[a, b]', 'closed interval, endpoints included', 'input units'],
    ['(a, b)', 'open interval, endpoints excluded; c must lie here', 'input units'],
    ['c', 'a point guaranteed by the theorem', 'input units'],
  ],
  formulas: [
    { name: 'Mean Value Theorem', f: 'f′(c) = {{f(b) − f(a)|b − a}}  for some c in (a, b)', when: 'f continuous on [a, b] and differentiable on (a, b).' },
    { name: 'Rolle’s theorem', f: 'f(a) = f(b)  ⇒  f′(c) = 0  for some c in (a, b)', when: 'Same hypotheses plus equal endpoint values.' },
    { name: 'Consequences', f: 'f′ > 0 on (a, b) ⇒ f increasing;  f′ < 0 ⇒ decreasing;  f′ = 0 ⇒ f constant', when: 'On an interval (not across a gap in the domain).' },
    { name: 'Bounding change', f: '|f(b) − f(a)| ≤ M|b − a|  if |f′(x)| ≤ M on (a, b)', when: 'f satisfies the MVT hypotheses on [a, b].' },
  ],
  derivation: {
    title: 'Why f′ > 0 on an interval means f is increasing',
    intro: 'Take any two points x_{1} < x_{2} in the interval.',
    steps: [
      ['The MVT on [x_{1}, x_{2}] gives c with f(x_{2}) − f(x_{1}) = f′(c)(x_{2} − x_{1}).', 'Rearranged form of the theorem; the hypotheses hold because f is differentiable on the interval.'],
      ['f′(c) > 0 and x_{2} − x_{1} > 0, so the right side is positive.', 'A product of positives is positive.'],
      ['Therefore f(x_{2}) > f(x_{1}).', 'This is what “increasing” means.'],
    ],
    end: 'The first-derivative test used for curve sketching rests on this argument.',
  },
  figure: { svg: fig, caption: 'For f(x) = x²/4 − x/2 + 1 on [0, 4] the secant slope is 0.5. At c = 2 the tangent has the same slope, as the MVT guarantees.' },
  table: {
    caption: 'Checking hypotheses before using the theorems',
    head: ['Function and interval', 'continuous on [a, b]?', 'differentiable on (a, b)?', 'conclusion guaranteed?'],
    rows: [
      ['x² on [0, 4]', 'yes', 'yes', 'yes: c = 2'],
      ['x³ on [0, 2]', 'yes', 'yes', 'yes: c = 2/√3 ≈ 1.155'],
      ['|x| on [−1, 1]', 'yes', 'no (corner at 0)', 'no; indeed no horizontal tangent'],
      ['1/x on [−1, 1]', 'no (undefined at 0)', 'no', 'no'],
      ['x^{2/3} on [−1, 1]', 'yes', 'no (cusp at 0)', 'no; f′ is never 0'],
    ],
  },
  method: {
    title: 'How to apply Rolle’s theorem or the MVT',
    steps: [
      'Check continuity on the closed interval [a, b]. Look for division by zero, roots of negative numbers and jumps.',
      'Check differentiability on the open interval (a, b). Look for corners (absolute values), cusps and vertical tangents.',
      'For Rolle, check f(a) = f(b). For the MVT, compute the secant slope {{f(b) − f(a)|b − a}}.',
      'Solve f′(c) = secant slope (0 for Rolle), and keep only solutions with a < c < b.',
      'If a hypothesis fails, say that the theorem does not apply (the conclusion may or may not still happen).',
    ],
  },
  examples: [
    {
      title: 'Find the MVT point for a parabola',
      problem: 'For f(x) = x^{2} on [0, 4], find all c guaranteed by the Mean Value Theorem.',
      steps: [
        ['f is a polynomial: continuous on [0, 4] and differentiable on (0, 4).', 'Hypotheses checked.'],
        ['Secant slope: {{16 − 0|4 − 0}} = 4.', 'Average rate of change.'],
        ['f′(c) = 2c = 4 ⇒ c = 2.', 'Solve f′(c) = secant slope.'],
        ['2 lies in (0, 4).', 'c must be strictly inside the interval.'],
      ],
      result: 'c = 2.',
      meaning: 'For any parabola, the MVT point is the midpoint of the interval.',
    },
    {
      title: 'An MVT point that is not the midpoint',
      problem: 'For f(x) = x^{3} on [0, 2], find c.',
      steps: [
        ['Polynomial, so the hypotheses hold.', 'Check first.'],
        ['Secant slope: {{8 − 0|2}} = 4.', 'Average rate.'],
        ['3c^{2} = 4 ⇒ c = ±{{2|√{3}}}. Only c = {{2|√{3}}} ≈ 1.155 lies in (0, 2).', 'Reject the negative solution.'],
      ],
      result: 'c = 2/√3 ≈ 1.155.',
      meaning: 'Solving f′(c) = slope may give points outside the interval; they do not count.',
    },
    {
      title: 'Rolle’s theorem',
      problem: 'Verify Rolle’s theorem for f(x) = (x − 2)^{2} on [0, 4].',
      steps: [
        ['Polynomial: continuous and differentiable everywhere.', 'Hypotheses 1 and 2.'],
        ['f(0) = 4 and f(4) = 4, so f(0) = f(4).', 'Hypothesis 3.'],
        ['f′(x) = 2(x − 2) = 0 ⇒ c = 2, which lies in (0, 4).', 'Solve f′(c) = 0.'],
      ],
      result: 'c = 2 (the vertex of the parabola).',
      meaning: 'The horizontal tangent is at the lowest point, between the two equal endpoint values.',
    },
    {
      title: 'When the theorem does not apply',
      problem: 'f(x) = |x| on [−1, 1] has f(−1) = f(1) = 1. Does Rolle’s theorem guarantee a c with f′(c) = 0?',
      steps: [
        ['f is continuous on [−1, 1].', 'Hypothesis 1 holds.'],
        ['f is not differentiable at 0, which lies in (−1, 1).', 'Hypothesis 2 fails: there is a corner.'],
        ['f′(x) = −1 for x < 0 and +1 for x > 0; it is never 0.', 'The conclusion is indeed false here.'],
      ],
      result: 'Rolle’s theorem does not apply, and no such c exists.',
      meaning: 'This shows why differentiability is required.',
    },
    {
      title: 'Using the MVT to bound a change',
      problem: 'A car’s speed never exceeds 90 km/h during a 2-hour trip. Use the MVT to bound the distance travelled.',
      steps: [
        ['Let s(t) be distance, differentiable, with s′(t) = speed ≤ 90.', 'Model the trip.'],
        ['MVT: s(2) − s(0) = s′(c)(2 − 0) for some c in (0, 2).', 'Apply the theorem on [0, 2].'],
        ['s′(c) ≤ 90, so s(2) − s(0) ≤ 180.', 'Bound the instantaneous rate.'],
      ],
      result: 'At most 180 km.',
      meaning: 'Conversely, if the car covered 200 km in 2 h, its speed must have been exactly 100 km/h at some moment.',
    },
  ],
  mistakes: [
    ['Using the conclusion without checking the hypotheses.', 'Always state why f is continuous on [a, b] and differentiable on (a, b).'],
    ['Accepting a c outside (a, b).', 'Solutions of f′(c) = slope outside the open interval are not the ones the theorem guarantees.'],
    ['“The MVT tells us exactly where c is.”', 'It guarantees existence of at least one c. We can compute c only when f′(c) = slope can be solved.'],
    ['“If the hypotheses fail, there is no such c.”', 'Then the theorem simply gives no guarantee. The conclusion might still happen by chance.'],
  ],
  scope: [
    'Proofs of Rolle’s theorem rely on the Extreme Value Theorem and are sketched only informally here.',
    'The Cauchy (generalised) Mean Value Theorem is not included.',
  ],
  checks: [
    ['parabola c', 4 / 2, 2, 0], ['cubic c', 2 / Math.sqrt(3), 1.155, 1e-3], ['cubic check', 3 * (2 / Math.sqrt(3)) ** 2, 4, 1e-12],
    ['figure secant', (f(4) - f(0)) / 4, 0.5, 1e-12], ['figure c', 0.5 * 2 - 0.5, 0.5, 0],
    ['rolle ends', (0 - 2) ** 2 - (4 - 2) ** 2, 0, 0], ['bound', 90 * 2, 180, 0],
  ],
};
