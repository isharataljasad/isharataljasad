import { plot, render, curve, dot, label, seg } from '../svg.mjs';

const f = (x) => x * x;
const fig = render('ma-der', {
  title: 'Secant lines approaching the tangent line of y = x² at x = 1',
  desc: 'The parabola y = x² with the point (1, 1). Two secant lines join (1, 1) to (2, 4), slope 3, and to (1.5, 2.25), slope 2.5. The tangent line at (1, 1) has slope 2. As the second point moves towards (1, 1), the secant slope approaches 2.',
}, plot({ x: [-0.3, 3.3], y: [-1, 5.2], xticks: [1, 2], yticks: [1, 2, 3, 4, 5], xlabel: 'x', ylabel: 'y' }, [
  curve(f, -0.3, 2.25),
  seg(0.2, 1 + 3 * (0.2 - 1), 2.3, 1 + 3 * (2.3 - 1), { color: '#9b6328', width: 2 }),
  seg(0.2, 1 + 2.5 * (0.2 - 1), 2.3, 1 + 2.5 * (2.3 - 1), { color: '#355b90', width: 2, dash: '6 4' }),
  seg(0.1, 1 + 2 * (0.1 - 1), 2.3, 1 + 2 * (2.3 - 1), { color: '#b3412e', width: 2.5 }),
  dot(1, 1, { color: '#183b3f' }), dot(2, 4, { color: '#9b6328' }), dot(1.5, 2.25, { color: '#355b90' }),
  label(1, 1, '(1, 1)', { dx: -10, dy: -8, anchor: 'end', size: 14 }),
  seg(1.45, 1.55, 1.65, 1.55, { color: '#9b6328', width: 2.5 }), label(1.7, 1.55, 'secant to (2, 4): slope 3', { dy: 5, size: 13, color: '#9b6328' }),
  seg(1.45, 1.1, 1.65, 1.1, { color: '#355b90', width: 2.5, dash: '6 4' }), label(1.7, 1.1, 'secant to (1.5, 2.25): slope 2.5', { dy: 5, size: 13, color: '#355b90' }),
  seg(1.45, 0.65, 1.65, 0.65, { color: '#b3412e', width: 2.5 }), label(1.7, 0.65, 'tangent at (1, 1): slope 2', { dy: 5, size: 13, color: '#b3412e' }),
]));

export default {
  summary: 'The derivative is the instantaneous rate of change: the limit of average rates, and the slope of the tangent line.',
  why: [
    'Engineering is full of rates: velocity is the rate of change of position, reaction rate is the rate of change of concentration, power is the rate of change of energy. An average rate over an interval is easy to compute, but often we need the rate at one instant. The derivative gives exactly that, and all later calculus (rules, optimization, related rates, approximation) is built on it.',
  ],
  idea: [
    'Start with an **average rate of change**. Between x = a and x = a + h, the output changes by f(a + h) − f(a) while the input changes by h. Their ratio {{f(a + h) − f(a)|h}} is the slope of the **secant line** through the two points of the graph.',
    'Now shrink the interval. As h → 0 the second point slides along the curve towards the first, and the secant lines approach a limiting line: the **tangent line** at x = a, the line through (a, f(a)) whose slope is the limit of the secant slopes. Close to a, the tangent follows the direction of the curve. It does not have to stay on one side of the curve or meet it only once: the tangent to y = x³ at the origin is the x-axis, and it crosses the curve there. The limit of the secant slopes is the derivative f′(a). We cannot simply put h = 0, because the quotient would become {{0|0}}; that is exactly why a limit is needed.',
    'The derivative has **units**: output units divided by input units. If s is position in metres and t is time in seconds, s′(t) is in m/s. If C is concentration in mmol/L and t is in minutes, C′(t) is in mmol/(L·min). The sign tells you the direction: f′(a) > 0 means f is increasing at a, f′(a) < 0 means it is decreasing.',
    'Doing this at every point gives a new function, the **derivative function** f′(x). A function is **differentiable** at a if this limit exists. A differentiable function is always continuous, but a continuous function need not be differentiable: |x| has a corner at 0, where the slope from the left is −1 and from the right is +1, so no single tangent slope exists.',
  ],
  background: [
    { title: 'Slope of a line', text: 'The slope between (x_{1}, y_{1}) and (x_{2}, y_{2}) is m = {{y_{2} − y_{1}|x_{2} − x_{1}}}. The line through (a, b) with slope m is y − b = m(x − a).' },
    { title: 'Expanding brackets', text: '(a + h)^{2} = a^{2} + 2ah + h^{2} and (a + h)^{3} = a^{3} + 3a^{2}h + 3ah^{2} + h^{3}. After subtracting f(a), every remaining term contains h, so h can be cancelled.' },
    { title: 'Limits of 0/0 forms', text: 'Cancel a common factor that is non-zero for the inputs the limit uses (h ≠ 0), then substitute. See the Limits topic.' },
  ],
  definitions: [
    ['Average rate of change', 'Over [a, a + h]: {{f(a + h) − f(a)|h}}, the slope of the secant line through (a, f(a)) and (a + h, f(a + h)).'],
    ['Derivative at a point', 'f′(a) = lim_{h→0} {{f(a + h) − f(a)|h}}, provided the limit exists. It is the instantaneous rate of change of f at a and the slope of the tangent line there.'],
    ['Tangent line', 'The line through (a, f(a)) with slope f′(a): y = f(a) + f′(a)(x − a). It is defined by this slope, not by “touching once”: a tangent line may cross the curve, and may meet it again elsewhere.'],
    ['Derivative function', 'f′(x) = lim_{h→0} {{f(x + h) − f(x)|h}} for each x where the limit exists. Other notations: {{dy|dx}}, {{df|dx}}, y′.'],
    ['Differentiable', 'f is differentiable at a if f′(a) exists. Differentiability fails at corners, cusps, vertical tangents and discontinuities.'],
  ],
  symbols: [
    ['h (or Δx)', 'a small change in the input', 'input units'],
    ['Δy = f(a + h) − f(a)', 'the corresponding change in the output', 'output units'],
    ['f′(a), {{dy|dx}}', 'derivative (instantaneous rate of change)', 'output units ÷ input units'],
    ['v = s′(t)', 'velocity as the derivative of position', 'm/s if s in m and t in s'],
  ],
  formulas: [
    { name: 'Definition of the derivative', f: 'f′(a) = lim_{h→0} {{f(a + h) − f(a)|h}}', when: 'The limit must exist (the same from both sides). If the left and right limits differ, as at a corner, f is not differentiable at a.' },
    { name: 'Alternative form', f: 'f′(a) = lim_{x→a} {{f(x) − f(a)|x − a}}', when: 'Equivalent to the first form (put x = a + h).' },
    { name: 'Tangent line', f: 'y = f(a) + f′(a)(x − a)', when: 'Requires f to be differentiable at a. It uses both the point value f(a) and the slope f′(a).' },
    { name: 'Differentiable ⇒ continuous', f: 'f′(a) exists  ⇒  lim_{x→a} f(x) = f(a)', when: 'The converse is false: |x| is continuous at 0 but not differentiable there.' },
  ],
  derivation: {
    title: 'Derivative of f(x) = x² from the definition',
    intro: 'This is the model for every first-principles calculation.',
    steps: [
      ['Difference quotient: {{(x + h)^{2} − x^{2}|h}}.', 'Substitute x + h and x into f.'],
      ['Expand: {{x^{2} + 2xh + h^{2} − x^{2}|h}} = {{2xh + h^{2}|h}}.', 'The x^{2} terms cancel; every remaining term contains h.'],
      ['Cancel h (allowed because h ≠ 0 inside the limit): 2x + h.', 'This removes the 0/0 form.'],
      ['Let h → 0: f′(x) = 2x.', '2x + h is a polynomial in h, so substitute h = 0.'],
    ],
    end: 'So the slope of y = x² at x = 1 is 2, at x = 3 is 6, and at x = −2 is −4. The slope changes from point to point, which is why the derivative is a function.',
  },
  figure: { svg: fig, caption: 'Secant lines from (1, 1) to (2, 4) and to (1.5, 2.25) have slopes 3 and 2.5. As the second point moves closer, the slopes approach 2, the slope of the tangent line.' },
  table: {
    caption: 'Secant slopes of f(x) = x² starting at x = 1',
    head: ['h', 'second point', 'secant slope (f(1 + h) − f(1))/h'],
    rows: [['1', '(2, 4)', '3'], ['0.5', '(1.5, 2.25)', '2.5'], ['0.1', '(1.1, 1.21)', '2.1'], ['0.01', '(1.01, 1.0201)', '2.01'], ['−0.01', '(0.99, 0.9801)', '1.99'], ['−0.1', '(0.9, 0.81)', '1.9']],
    note: 'The secant slope equals 2 + h, so it approaches 2 from both sides as h → 0. That limit is f′(1) = 2.',
  },
  method: {
    title: 'How to find a derivative from the definition, and how to use it',
    steps: [
      'Write f(a + h) by replacing x with a + h everywhere, then write the quotient {{f(a + h) − f(a)|h}}.',
      'Simplify the numerator (expand, combine fractions, or multiply by a conjugate for roots) until a factor of h appears.',
      'Cancel h and let h → 0.',
      'For a tangent line, compute both f(a) (the point) and f′(a) (the slope), then use y = f(a) + f′(a)(x − a).',
      'State units: output units per input unit. Interpret the sign (increasing or decreasing).',
    ],
  },
  examples: [
    {
      title: 'Derivative at a point from the definition',
      problem: 'For f(x) = x^{2} + 3x, find f′(2) from the definition.',
      steps: [
        ['f(2 + h) = (2 + h)^{2} + 3(2 + h) = 4 + 4h + h^{2} + 6 + 3h = 10 + 7h + h^{2}.', 'Replace x by 2 + h and expand.'],
        ['f(2) = 4 + 6 = 10, so f(2 + h) − f(2) = 7h + h^{2}.', 'The constant terms cancel.'],
        ['{{7h + h^{2}|h}} = 7 + h for h ≠ 0.', 'Cancel the common factor h.'],
        ['Let h → 0: f′(2) = 7.', 'Substitute h = 0 in 7 + h.'],
      ],
      result: 'f′(2) = 7.',
      meaning: 'Near x = 2 the output increases about 7 units for each unit increase in x.',
    },
    {
      title: 'A rate with units',
      problem: 'A concentration is modelled by C(t) = t^{2} + 3t (mmol/L, t in minutes). Find the rate of change of concentration at t = 2 min.',
      steps: [
        ['This is the same function as in the previous example, so C′(2) = 7.', 'The derivative does not depend on the letters used.'],
        ['Units: output units ÷ input units = (mmol/L) ÷ min.', 'Always attach units to a rate.'],
      ],
      result: 'C′(2) = 7 mmol/(L·min).',
      meaning: 'At t = 2 min the concentration is rising at 7 mmol/L per minute. This is an instantaneous rate; the average rate over the first 2 minutes is (C(2) − C(0))/2 = 10/2 = 5 mmol/(L·min).',
    },
    {
      title: 'Equation of a tangent line',
      problem: 'Find the tangent line to f(x) = x^{2} + 1 at x = 2.',
      steps: [
        ['Point: f(2) = 5, so the line passes through (2, 5).', 'A tangent line needs a point as well as a slope.'],
        ['Slope: by the same method as for x^{2}, f′(x) = 2x, so f′(2) = 4.', 'The constant 1 does not change the slope.'],
        ['y = 5 + 4(x − 2), that is y = 4x − 3.', 'Point–slope form, then simplify.'],
      ],
      result: 'y = 4x − 3.',
      meaning: 'Check: at x = 2 the line gives 8 − 3 = 5, matching the curve.',
    },
    {
      title: 'Derivative of 1/x from the definition',
      problem: 'Find f′(x) for f(x) = {{1|x}}, x ≠ 0.',
      steps: [
        ['{{f(x + h) − f(x)|h}} = {{1|h}}({{1|x + h}} − {{1|x}}).', 'Write the difference quotient.'],
        ['Combine the fractions: {{1|x + h}} − {{1|x}} = {{x − (x + h)|x(x + h)}} = {{−h|x(x + h)}}.', 'Use a common denominator.'],
        ['Divide by h: {{−1|x(x + h)}}.', 'The factor h cancels (h ≠ 0).'],
        ['Let h → 0: f′(x) = −{{1|x^{2}}}.', 'Substitute h = 0; valid because x ≠ 0.'],
      ],
      result: 'f′(x) = −1/x^{2}.',
      meaning: 'The slope is negative everywhere: 1/x decreases on each side of 0.',
    },
    {
      title: 'Where a derivative does not exist',
      problem: 'Is f(x) = |x| differentiable at x = 0?',
      steps: [
        ['{{f(0 + h) − f(0)|h}} = {{∣h∣|h}}.', 'Write the difference quotient at 0.'],
        ['For h > 0 this is 1; for h < 0 it is −1.', 'Use |h| = h for positive h and |h| = −h for negative h.'],
        ['The one-sided limits are 1 and −1, so the limit does not exist.', 'A derivative must have one value from both sides.'],
      ],
      result: '|x| is not differentiable at 0 (although it is continuous there).',
      meaning: 'The graph has a corner at the origin, so there is no single tangent line.',
    },
    {
      title: 'Velocity, a turning point, and total distance',
      problem: 'A particle moves along a line with position s(t) = t^{2} − 4t (metres, t in seconds) for 0 ≤ t ≤ 5. Find its velocity, when it turns around, its displacement and the total distance travelled.',
      steps: [
        ['v(t) = s′(t) = 2t − 4 m/s.', 'Velocity is the rate of change of position.'],
        ['v = 0 at t = 2 s; v < 0 before and v > 0 after.', 'The particle moves backwards, stops, then moves forwards: t = 2 s is a turning point.'],
        ['Positions: s(0) = 0, s(2) = −4 m, s(5) = 25 − 20 = 5 m.', 'Evaluate at the start, the turning time and the end.'],
        ['Displacement = s(5) − s(0) = 5 m.', 'Only the start and end positions matter.'],
        ['Distance = |−4 − 0| + |5 − (−4)| = 4 + 9 = 13 m.', 'Add the lengths of each one-direction stretch.'],
      ],
      result: 'v(t) = 2t − 4; turns at t = 2 s; displacement 5 m; total distance 13 m.',
      meaning: 'Displacement and distance differ whenever the motion reverses. Using s(5) − s(0) for distance misses the backward stretch.',
    },
  ],
  mistakes: [
    ['Putting h = 0 immediately in the difference quotient.', 'That gives 0/0. Simplify and cancel h first, then take the limit.'],
    ['Confusing the average rate with the instantaneous rate.', 'The average rate uses two points; the derivative is the limit as the interval shrinks to one point.'],
    ['Writing the tangent line as y = f′(a)x.', 'The line must pass through (a, f(a)): y = f(a) + f′(a)(x − a).'],
    ['Forgetting units.', 'A derivative is a rate: output units per input unit, for example m/s or mmol/(L·min).'],
    ['“Continuous means differentiable.”', 'Corners and cusps (|x| at 0) are continuous but have no derivative.'],
  ],
  scope: [
    'Here derivatives are computed from the definition. The faster rules (power, product, quotient, chain) are in the next topic.',
    'One-variable functions only; partial derivatives belong to later courses.',
  ],
  checks: [
    ['f′(2) for x²+3x', ((2 + 1e-7) ** 2 + 3 * (2 + 1e-7) - 10) / 1e-7, 7, 1e-5],
    ['avg rate', ((4 + 6) - 0) / 2, 5, 0],
    ['tangent at 2', 4 * 2 - 3, 5, 0],
    ['1/x derivative at 2', (1 / (2 + 1e-7) - 0.5) / 1e-7, -0.25, 1e-5],
    ['secant h=0.1', (1.21 - 1) / 0.1, 2.1, 1e-9],
    ['turning s(2)', 4 - 8, -4, 0], ['s(5)', 25 - 20, 5, 0], ['distance', Math.abs(-4) + Math.abs(5 + 4), 13, 0],
  ],
};
