import { plot, render, curve, dot, label, seg } from '../svg.mjs';

const fig = render('ma-lin', {
  title: 'Linear approximation of √x at x = 4',
  desc: 'The curve y = √x and its tangent line L(x) = 2 + (x − 4)/4 at the point (4, 2). Near x = 4 the line and the curve are almost indistinguishable; further away the line lies above the curve.',
}, plot({ x: [0, 10], y: [0, 3.6], xticks: [2, 4, 6, 8], yticks: [1, 2, 3], xlabel: 'x', ylabel: 'y' }, [
  curve(Math.sqrt, 0, 10),
  seg(0, 1, 10, 3.5, { color: '#b3412e', width: 2.5 }),
  dot(4, 2, { color: '#183b3f' }),
  dot(9, 3, { color: '#176e66' }), dot(9, 3.25, { color: '#b3412e' }),
  label(4, 2, '(4, 2)', { dx: 8, dy: 20, size: 14 }),
  label(9, 3.25, 'L(9) = 3.25', { dx: -8, dy: -8, anchor: 'end', color: '#b3412e', size: 14 }),
  label(9, 3, '√9 = 3', { dx: 8, dy: 22, color: '#176e66', size: 14 }),
  label(0.5, 1.9, 'tangent L(x)', { color: '#b3412e', size: 14 }),
]));

export default {
  summary: 'Near a point, a differentiable function is almost a straight line: its tangent line gives quick estimates and error sizes.',
  why: [
    'Engineers constantly replace complicated functions by simpler ones that are accurate enough nearby: small-angle approximations, linearised models of reactors and circuits, and error estimates for measurements. The tangent line is the simplest such replacement, and differentials tell you how an error in a measured input spreads to a calculated output.',
  ],
  idea: [
    'If you zoom in far enough on a smooth curve, it looks like a straight line — its tangent line. So near x = a we can approximate f(x) by the tangent line L(x) = f(a) + f′(a)(x − a). This is the **linear approximation** (or linearisation) of f at a.',
    'Choose a as a point where f is easy to evaluate exactly and close to the input you care about. To estimate √{4.08}, use a = 4 because √{4} = 2 is known exactly.',
    'The approximation is only good **near a**. The error grows as x moves away, and its size depends on how strongly the graph bends (the second derivative). If the graph is concave down (bending below its tangents), the tangent line lies above the curve and the estimate is too large; if concave up, the estimate is too small.',
    'The same idea in “change” language: a small change dx in the input produces a change in output of about dy = f′(x) dx. This **differential** is the change along the tangent line. It is how measurement errors propagate: if a radius is measured with a small error, the resulting error in a computed area is about A′(r) × (error in r).',
  ],
  background: [
    { title: 'Tangent line', text: 'The tangent to y = f(x) at x = a is y = f(a) + f′(a)(x − a). See “Derivative as a rate”.' },
    { title: 'Relative and percentage error', text: 'If a quantity Q has error ΔQ, the relative error is ΔQ/Q and the percentage error is 100·ΔQ/Q %.' },
  ],
  definitions: [
    ['Linearisation', 'L(x) = f(a) + f′(a)(x − a), the tangent-line function at a. For x near a, f(x) ≈ L(x).'],
    ['Differential', 'dx is an independent small change in x; dy = f′(x) dx is the corresponding change along the tangent line.'],
    ['Actual change', 'Δy = f(x + dx) − f(x), the true change on the curve. For small dx, Δy ≈ dy.'],
    ['Error propagation', 'If an input is measured with error dx, the computed output has error about |f′(x)| |dx|; the relative error is about |dy/y|.'],
  ],
  symbols: [
    ['a', 'the base point where f and f′ are known exactly', 'input units'],
    ['L(x)', 'linear approximation (tangent line)', 'output units'],
    ['dx, dy', 'differentials: small input change and the tangent-line output change', 'input units, output units'],
    ['Δy', 'actual change in output', 'output units'],
  ],
  formulas: [
    { name: 'Linear approximation', f: 'f(x) ≈ L(x) = f(a) + f′(a)(x − a)', when: 'f differentiable at a, and x close to a. Accuracy depends on how close x is and how much the graph curves.' },
    { name: 'Differential', f: 'dy = f′(x) dx,   Δy ≈ dy', when: 'dx small. The approximation Δy ≈ dy improves as dx → 0.' },
    { name: 'Relative error of a power', f: 'Q = kx^{n}  ⇒  {{dQ|Q}} = n{{dx|x}}', when: 'Follows from dQ = nkx^{n−1}dx. A 1% error in a radius gives about 2% error in an area and 3% in a volume.' },
    { name: 'Common small-value approximations', f: 'sin x ≈ x;  cos x ≈ 1;  e^{x} ≈ 1 + x;  ln(1 + x) ≈ x;  (1 + x)^{n} ≈ 1 + nx', when: 'Linearisations at a = 0, valid for |x| small (x in radians for sin and cos).' },
  ],
  derivation: {
    title: 'Where (1 + x)ⁿ ≈ 1 + nx comes from',
    intro: 'Linearise f(x) = (1 + x)^{n} at a = 0.',
    steps: [
      ['f(0) = 1.', 'Base value.'],
      ['f′(x) = n(1 + x)^{n−1}, so f′(0) = n.', 'Chain rule.'],
      ['L(x) = 1 + n(x − 0) = 1 + nx.', 'Tangent line at 0.'],
    ],
    end: 'Example: √{1.02} = (1 + 0.02)^{1/2} ≈ 1 + 0.01 = 1.01 (the true value is 1.00995…).',
  },
  figure: { svg: fig, caption: 'The tangent to √x at (4, 2) is an excellent approximation near x = 4 (√4.08 ≈ 2.02) but not far away: at x = 9 it gives 3.25 instead of 3.' },
  table: {
    caption: 'Linear approximation of √x at a = 4',
    head: ['x', 'L(x) = 2 + (x − 4)/4', 'true √x', 'error L(x) − √x'],
    rows: [['4.08', '2.02', '2.019901', '0.000099'], ['4.5', '2.125', '2.121320', '0.00368'], ['5', '2.25', '2.236068', '0.0139'], ['9', '3.25', '3', '0.25']],
    note: 'The error is always positive here because √x is concave down: the tangent lies above the curve. The error grows roughly like (x − 4)² as x moves away from 4.',
  },
  method: {
    title: 'How to make a linear approximation',
    steps: [
      'Identify the function f and the value you want, f(x).',
      'Choose a nearby base point a where f(a) and f′(a) are easy to compute exactly.',
      'Compute f(a) and f′(a), and write L(x) = f(a) + f′(a)(x − a).',
      'Evaluate L at the required x. Decide whether the estimate is too high or too low from the concavity.',
      'For error propagation, write dy = f′(x) dx with dx = measurement error; report absolute and relative errors.',
    ],
  },
  examples: [
    {
      title: 'Estimate a square root',
      problem: 'Use a linear approximation to estimate √{4.08}.',
      steps: [
        ['f(x) = √{x}, a = 4: f(4) = 2.', '4 is close to 4.08 and has an exact root.'],
        ['f′(x) = {{1|2√{x}}}, so f′(4) = {{1|4}}.', 'Power rule with exponent 1/2.'],
        ['L(x) = 2 + {{1|4}}(x − 4).', 'Tangent line at 4.'],
        ['L(4.08) = 2 + {{0.08|4}} = 2.02.', 'Substitute x = 4.08.'],
      ],
      result: '√{4.08} ≈ 2.02.',
      meaning: 'The true value is 2.019901…, so the error is about 0.0001. The estimate is slightly high because √x is concave down.',
    },
    {
      title: 'Estimate a square',
      problem: 'Use the linearisation of x^{2} at x = 3 to estimate (3.02)^{2}.',
      steps: [
        ['f(3) = 9 and f′(x) = 2x, so f′(3) = 6.', 'Base value and slope.'],
        ['L(x) = 9 + 6(x − 3); L(3.02) = 9 + 6(0.02) = 9.12.', 'Evaluate the tangent line.'],
      ],
      result: '(3.02)^{2} ≈ 9.12.',
      meaning: 'The exact value is 9.1204; the error 0.0004 = (0.02)² is exactly the curvature term that the line ignores. x² is concave up, so the estimate is low.',
    },
    {
      title: 'Error in a computed area',
      problem: 'The radius of a circular plate is measured as 10 cm with a possible error of ±0.1 cm. Estimate the maximum error in the computed area and the percentage error.',
      steps: [
        ['A = πr^{2}, so dA = 2πr dr.', 'Differential of the area.'],
        ['dA = 2π(10)(0.1) = 2π ≈ 6.28 cm^{2}.', 'Substitute r = 10 and dr = 0.1.'],
        ['A = π(10)^{2} = 100π ≈ 314.2 cm^{2}; relative error {{dA|A}} = {{2π|100π}} = 0.02.', 'Compare the error with the value.'],
      ],
      result: 'Maximum error ≈ ±6.3 cm^{2}, which is about 2%.',
      meaning: 'A 1% error in the radius becomes about a 2% error in the area, as the power rule for relative errors predicts (n = 2).',
    },
    {
      title: 'Small-angle approximation',
      problem: 'Estimate sin(0.1) (radians) and compare with the true value.',
      steps: [
        ['Linearise sin x at a = 0: sin 0 = 0 and cos 0 = 1, so L(x) = x.', 'Tangent line of sin x at the origin.'],
        ['sin(0.1) ≈ 0.1.', 'Substitute.'],
      ],
      result: 'sin(0.1) ≈ 0.1; the true value is 0.099833…, an error of about 0.17%.',
      meaning: 'This is the approximation used for a pendulum swinging through small angles. It only works in radians.',
    },
  ],
  extra: [
    { title: 'Newton’s method (check whether your outline includes it)', text: [
      'Newton’s method uses linearisation to solve f(x) = 0. From a guess x_{n}, follow the tangent line to where it crosses the x-axis: x_{n+1} = x_{n} − {{f(x_{n})|f′(x_{n})}}.',
      'Example: for f(x) = x^{2} − 2 (root √{2}), start at x_{0} = 1. Then x_{1} = 1 − {{−1|2}} = 1.5, x_{2} = 1.5 − {{0.25|3}} ≈ 1.41667, x_{3} ≈ 1.414216. The true value is 1.414214. The method fails if f′(x_{n}) = 0 or if the starting guess is poor.',
    ] },
  ],
  mistakes: [
    ['Choosing a base point that is far away or hard to evaluate.', 'Pick a close to x with f(a) and f′(a) exact, such as a perfect square for roots.'],
    ['Using the approximation far from a.', 'The error grows quickly with distance: √9 ≈ 3.25 from a = 4 is poor.'],
    ['Confusing dy with Δy.', 'dy is the change along the tangent; Δy is the true change on the curve. They are close only for small dx.'],
    ['Using degrees in sin x ≈ x.', 'The approximation requires radians: sin(5°) ≈ 0.0873, not 5.'],
  ],
  scope: [
    'Only first-order (linear) approximation is covered. Quadratic and Taylor approximations belong to later calculus.',
    'Error estimates here are first-order; for large errors compute the exact change.',
  ],
  checks: [
    ['√4.08 estimate', 2 + 0.08 / 4, 2.02, 1e-12], ['√4.08 true', Math.sqrt(4.08), 2.019901, 1e-6],
    ['√4.5', Math.sqrt(4.5), 2.121320, 1e-6], ['√5', Math.sqrt(5), 2.236068, 1e-6],
    ['4.5 error', 2.125 - Math.sqrt(4.5), 0.00368, 1e-5], ['5 error', 2.25 - Math.sqrt(5), 0.0139, 1e-4],
    ['3.02²', 9 + 6 * 0.02, 9.12, 1e-12], ['exact', 3.02 ** 2, 9.1204, 1e-9],
    ['dA', 2 * Math.PI * 10 * 0.1, 6.28, 0.01], ['A', 100 * Math.PI, 314.2, 0.05],
    ['sin0.1', Math.sin(0.1), 0.099833, 1e-6],
    ['newton x2', 1.5 - 0.25 / 3, 1.41667, 1e-5], ['newton x3', (() => { const x = 1.5 - 0.25 / 3; return x - (x * x - 2) / (2 * x); })(), 1.414216, 1e-6],
    ['√1.02', Math.sqrt(1.02), 1.00995, 1e-5],
  ],
};
