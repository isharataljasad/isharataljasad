import { plot, render, curve, dot, label, dashTo } from '../svg.mjs';

// Open box from a 12 × 12 cm sheet: V(x) = x(12 − 2x)², 0 < x < 6. Max at x = 2, V = 128.
const V = (x) => x * (12 - 2 * x) ** 2;
const fig = render('ma-opt', {
  title: 'Volume of an open box cut from a 12 cm square sheet',
  desc: 'Graph of V(x) = x(12 − 2x)² for 0 ≤ x ≤ 6, where x is the side of the corner squares. The volume is 0 at both ends of the interval and reaches its maximum 128 cm³ at x = 2.',
}, plot({ x: [0, 6.3], y: [0, 150], xticks: [1, 2, 3, 4, 5, 6], yticks: [50, 100, 128], xlabel: 'x (cm)', ylabel: 'V (cm³)' }, [
  curve(V, 0, 6),
  dashTo(2, 128),
  dot(2, 128, { color: '#b3412e' }),
  label(2, 128, 'maximum: x = 2 cm, V = 128 cm³', { dx: 12, dy: -6, size: 14, color: '#b3412e' }),
]));

export default {
  summary: 'Turn a “best design” question into a function of one variable on an interval, then use derivatives to find and justify the optimum.',
  why: [
    'Optimization is where calculus pays for itself in engineering: minimum material for a container of given volume, maximum power transfer, minimum cost or energy, maximum yield. The mathematics is the closed-interval method and the derivative tests; the real skill is building the right model and checking that the answer makes physical sense.',
  ],
  idea: [
    'Every optimization problem has an **objective** (the quantity to maximise or minimise, such as area, volume or cost) and one or more **constraints** (fixed conditions, such as a given perimeter or volume). The constraint lets you eliminate variables until the objective depends on a single variable.',
    'The variable also has a **feasible interval**: lengths must be positive, a cut cannot exceed half the sheet, and so on. The interval is part of the model; the answer must lie in it.',
    'Then use the previous topic. Find critical points of the objective inside the interval. On a closed interval, compare the objective at the critical points and endpoints. On an open interval, justify that a critical point is the absolute optimum, for example because it is the only critical point and the first-derivative test shows a maximum (or minimum), or because the function is concave down (up) everywhere on the interval.',
    'Finally answer the question that was asked — often the dimensions, not the maximum value — with units, and check that it is sensible (does the box have positive height? is the cost smaller than at the endpoints?).',
  ],
  background: [
    { title: 'Area, perimeter and volume', text: 'Rectangle: A = xy, P = 2x + 2y. Box: V = lwh. Closed cylinder: V = πr^{2}h, surface area S = 2πr^{2} + 2πrh.' },
    { title: 'Extrema tests', text: 'Critical points solve f′ = 0 (or f′ undefined). First-derivative test: + → − is a maximum. Second-derivative test: f″ < 0 at a critical point is a maximum. See “Extrema and curve shape”.' },
  ],
  definitions: [
    ['Objective function', 'The quantity to be made as large or as small as possible, written as a function of one variable after using the constraints.'],
    ['Constraint', 'An equation (or inequality) that the variables must satisfy, such as a fixed perimeter or volume.'],
    ['Feasible interval', 'The set of values of the variable that make physical sense (for example 0 < x < 6).'],
    ['Optimum', 'The value of the variable that gives the largest or smallest objective, together with that objective value.'],
  ],
  symbols: [
    ['x, y, r, h', 'design variables (lengths)', 'm, cm'],
    ['A, V, S, C', 'area, volume, surface area, cost', 'm², m³, m², currency'],
    ['x*', 'the optimal value of the design variable', 'units of x'],
    ['f′(x), f″(x)', 'first and second derivatives of the objective', 'objective units per unit of x (per unit of x²)'],
  ],
  formulas: [
    { name: 'Optimality condition', f: 'f′(x*) = 0  (x* inside the feasible interval)', when: 'Necessary for an interior optimum of a differentiable function; not sufficient on its own. Endpoints must be checked separately.' },
    { name: 'Justifying a maximum', f: 'f″(x*) < 0, or f′ changes from + to − at x*', when: 'Gives a local maximum; to call it absolute, it must be the only critical point on an interval, or be compared with the endpoints.' },
    { name: 'Closed interval', f: 'best value = max or min of { f(a), f(b), f(critical points) }', when: 'f continuous on [a, b].' },
  ],
  derivation: {
    title: 'Why a square gives the largest rectangle with a fixed perimeter',
    intro: 'Let the perimeter be P and one side x. Then the other side is P/2 − x.',
    steps: [
      ['A(x) = x({{P|2}} − x) = {{P|2}}x − x^{2}, for 0 < x < {{P|2}}.', 'Constraint used to eliminate the second side.'],
      ['A′(x) = {{P|2}} − 2x = 0 ⇒ x = {{P|4}}.', 'Critical point.'],
      ['A″(x) = −2 < 0 everywhere, so this is the absolute maximum on the interval.', 'Concave down on the whole interval.'],
      ['The other side is {{P|2}} − {{P|4}} = {{P|4}}: the rectangle is a square.', 'Interpret the answer.'],
    ],
    end: 'Maximum area = (P/4)² = P²/16.',
  },
  figure: { svg: fig, caption: 'The box volume is zero when no corner is cut (x = 0) and when the base disappears (x = 6). Between them it has a single maximum at x = 2 cm.' },
  table: {
    caption: 'Volume of the open box for different cuts',
    head: ['corner cut x (cm)', 'base side 12 − 2x (cm)', 'volume x(12 − 2x)² (cm³)'],
    rows: [['1', '10', '100'], ['1.5', '9', '121.5'], ['2', '8', '128'], ['2.5', '7', '122.5'], ['3', '6', '108'], ['4', '4', '64']],
    note: 'The table suggests x = 2 and the derivative confirms it. A table alone cannot prove that no other x does better.',
  },
  method: {
    title: 'Optimization procedure',
    steps: [
      'Read the problem, draw a diagram and name the variables with units.',
      'Write the objective function.',
      'Write the constraint and use it to express the objective in one variable.',
      'State the feasible interval for that variable.',
      'Differentiate, solve f′ = 0, and keep critical points inside the interval.',
      'Justify the optimum: closed-interval comparison, first-derivative test, or second-derivative test with a uniqueness argument.',
      'Answer the actual question (dimensions and/or optimal value) with units, and check that it is reasonable.',
    ],
  },
  examples: [
    {
      title: 'Largest rectangle with a fixed perimeter',
      problem: 'A rectangle has perimeter 24 m. Find the side lengths giving the largest area, and that area.',
      steps: [
        ['Sides x and y with 2x + 2y = 24, so y = 12 − x.', 'Constraint.'],
        ['A(x) = x(12 − x) = 12x − x^{2}, for 0 < x < 12.', 'Objective in one variable, with its interval.'],
        ['A′(x) = 12 − 2x = 0 ⇒ x = 6.', 'Critical point, inside the interval.'],
        ['A″(x) = −2 < 0, so x = 6 gives the maximum.', 'Concave down on the whole interval.'],
      ],
      result: 'A 6 m × 6 m square, area 36 m^{2}.',
      meaning: 'For a perimeter of 40 m the same method gives a 10 m × 10 m square of area 100 m^{2}.',
    },
    {
      title: 'Open box from a square sheet',
      problem: 'Equal squares of side x are cut from the corners of a 12 cm × 12 cm sheet, and the sides are folded up. Find x for maximum volume.',
      steps: [
        ['V(x) = x(12 − 2x)^{2}, with 0 < x < 6 (the base side 12 − 2x must be positive).', 'Height x, square base of side 12 − 2x.'],
        ['V′(x) = (12 − 2x)^{2} + x·2(12 − 2x)(−2) = (12 − 2x)(12 − 6x).', 'Product and chain rules, then factor.'],
        ['V′ = 0 ⇒ x = 6 (not inside the interval) or x = 2.', 'Keep only feasible critical points.'],
        ['Closed-interval check on [0, 6]: V(0) = 0, V(6) = 0, V(2) = 2·8^{2} = 128.', 'The endpoints give no volume.'],
      ],
      result: 'Cut 2 cm squares; the maximum volume is 128 cm^{3} (base 8 cm × 8 cm, height 2 cm).',
      meaning: 'The sign of V′ is + for 0 < x < 2 and − for 2 < x < 6, confirming a maximum.',
    },
    {
      title: 'Minimum material for a cylindrical can',
      problem: 'A closed cylindrical can must hold 500 cm^{3}. Find the radius and height that minimise the surface area.',
      steps: [
        ['Constraint: πr^{2}h = 500 ⇒ h = {{500|πr^{2}}}.', 'Fixed volume.'],
        ['S = 2πr^{2} + 2πrh = 2πr^{2} + {{1000|r}}, for r > 0.', 'Substitute h.'],
        ['S′(r) = 4πr − {{1000|r^{2}}} = 0 ⇒ r^{3} = {{250|π}} ⇒ r ≈ 4.30 cm.', 'Critical point.'],
        ['S″(r) = 4π + {{2000|r^{3}}} > 0 for all r > 0.', 'Concave up everywhere: the only critical point is the absolute minimum.'],
        ['h = {{500|π(4.30)^{2}}} ≈ 8.60 cm.', 'Back-substitute.'],
      ],
      result: 'r ≈ 4.30 cm, h ≈ 8.60 cm, so h = 2r (height equals diameter); S ≈ 349 cm^{2}.',
      meaning: 'At the optimum, h = 2r exactly: from r^{3} = 250/π, h = 500/(πr²) = 2r. Real cans are often taller because of other costs (seams, handling).',
    },
    {
      title: 'Fencing along a river',
      problem: 'A rectangular field along a straight river needs fencing on three sides only (none along the river). There are 200 m of fence. Find the largest possible area.',
      steps: [
        ['Let x be the two sides perpendicular to the river and y the side parallel to it: 2x + y = 200.', 'Only three sides are fenced.'],
        ['A(x) = x(200 − 2x) = 200x − 2x^{2}, 0 < x < 100.', 'Objective and interval.'],
        ['A′(x) = 200 − 4x = 0 ⇒ x = 50; A″ = −4 < 0.', 'Maximum.'],
        ['y = 200 − 100 = 100 m; A = 50 × 100.', 'Dimensions and value.'],
      ],
      result: '50 m × 100 m (the long side along the river), area 5000 m^{2}.',
      meaning: 'Unlike the four-sided case, the optimum is not a square, because the river side is free.',
    },
  ],
  mistakes: [
    ['Differentiating before using the constraint (with two variables left).', 'Reduce the objective to one variable first.'],
    ['Ignoring the feasible interval, or keeping critical points outside it.', 'Write the interval and discard infeasible solutions (like x = 6 in the box problem).'],
    ['Stopping at f′ = 0 without justifying a maximum or minimum.', 'Use the endpoint comparison, the first-derivative test or the second-derivative test.'],
    ['Answering with the wrong quantity.', 'If the question asks for dimensions, give the dimensions (with units), not just the optimal value.'],
  ],
  scope: [
    'Single-variable optimization only. Problems with several free variables need partial derivatives (a later course).',
    'Constraints are equations that can be solved for one variable.',
  ],
  checks: [
    ['box V(2)', V(2), 128, 0], ['box V(1.5)', V(1.5), 121.5, 1e-9], ['box V(2.5)', V(2.5), 122.5, 1e-9], ['box V(3)', V(3), 108, 0], ['box V(4)', V(4), 64, 0],
    ['box derivative at 2', (V(2 + 1e-6) - V(2 - 1e-6)) / 2e-6, 0, 1e-5],
    ['can r', Math.cbrt(250 / Math.PI), 4.30, 0.005], ['can h', 500 / (Math.PI * Math.cbrt(250 / Math.PI) ** 2), 8.60, 0.005],
    ['can S', (() => { const r = Math.cbrt(250 / Math.PI); return 2 * Math.PI * r * r + 1000 / r; })(), 349, 0.6],
    ['river', 50 * 100, 5000, 0], ['perimeter 40', 10 * 10, 100, 0],
  ],
};
