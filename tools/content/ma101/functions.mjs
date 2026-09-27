// New opening lesson. It combines the function-review notes of the three earlier
// collections (book 01–05, pearson 01–06, educator 01–02; see the migration ledger)
// into one sequence, because every calculus lesson relies on them.
import { plot, render, curve, dot, label, raw } from '../svg.mjs';

const f = (x) => x * x;
const g = (x) => -2 * (x - 3) ** 2 + 1;
const fig = render('ma-func', {
  title: 'Transforming y = x² into y = −2(x − 3)² + 1',
  desc: 'The parent parabola y = x² with vertex at the origin, and the transformed parabola y = −2(x − 3)² + 1, which opens downward, is narrower, and has its vertex at (3, 1). The point (1, 1) on the parent graph corresponds to the point (4, −1) on the new graph.',
}, plot({ x: [-4, 5.5], y: [-5, 5], xticks: [-3, -2, -1, 1, 2, 3, 4, 5], yticks: [-4, -2, 2, 4], xlabel: 'x', ylabel: 'y' }, [
  curve(f, -2.2, 2.2, { color: '#5e7376', dash: '6 4', clip: [-5, 5] }),
  curve(g, 1.2, 4.8, { clip: [-5, 5] }),
  dot(0, 0, { color: '#5e7376' }), dot(3, 1, { color: '#b3412e' }), dot(1, 1, { color: '#5e7376', r: 4 }), dot(4, -1, { color: '#176e66', r: 4 }),
  label(-3.8, 1.6, 'parent y = x²', { size: 13, color: '#5e7376' }),
  label(3, 1, 'vertex (3, 1)', { dy: -10, anchor: 'middle', size: 13, color: '#b3412e' }),
  label(-3.8, -2.6, 'y = −2(x − 3)² + 1', { size: 13, color: '#176e66' }),
  label(-3.8, -3.5, 'point (1, 1) → (4, −1)', { size: 13, color: '#176e66' }),
]));

export default {
  summary: 'The function language that every calculus lesson uses: domains and ranges, piecewise rules, transformations, composition, inverses, exponentials and logarithms, and trigonometric functions in radians.',
  why: [
    'Calculus studies how functions change. Before you can find a limit or a derivative you must be able to read a function: which inputs are allowed, what its graph looks like, how it is built from simpler functions, and when it has an inverse. Most errors in first-year calculus are not calculus errors at all; they are domain, algebra or radian errors made along the way.',
  ],
  idea: [
    'A **function** assigns exactly one output to each allowed input. The **domain** is the set of allowed inputs; the **range** is the set of outputs the function actually produces. A graph represents a function of x exactly when every vertical line meets it at most once (the vertical-line test).',
    'A formula restricts its own domain in three common ways: a denominator cannot be zero; an even root (such as √{u}) needs u ≥ 0; a logarithm ln u needs u > 0 (strictly). A **piecewise** function uses different rules on different parts of the domain; the inequality attached to each piece decides which rule applies at a boundary point.',
    '**Transformations** build new graphs from a known “parent” graph. For y = a·f(b(x − h)) + k: changes outside f act on outputs (a stretches and, if negative, reflects; k shifts up or down); changes inside act on inputs (h shifts right by h; b scales horizontally by the factor 1/|b|, a compression when |b| > 1, and a negative b also reflects in the y-axis). The safest check is to track one known point.',
    '**Composition** feeds one function’s output into another: (f ∘ g)(x) = f(g(x)). Order matters, and the domain must survive both stages: x must be allowed in g, and g(x) must be allowed in f. Recognising compositions is exactly what the chain rule needs later.',
    'An **inverse** function f^{−1} reverses f: f^{−1}(f(x)) = x. It exists only if f is one-to-one (every horizontal line meets the graph at most once); otherwise the domain must be restricted, as with x² on x ≥ 0 or sin x on [−π/2, π/2]. The domain of f^{−1} is the range of f.',
    '**Exponential** functions b^{x} (b > 0, b ≠ 1) have the variable in the exponent; the **logarithm** log_{b} x is the inverse: log_{b} x = y means b^{y} = x, and it needs x > 0. The natural base e ≈ 2.71828 and ln x = log_{e} x are the ones calculus uses. **Trigonometric** functions in calculus use radians: θ = arc length ÷ radius, so 180° = π rad.',
  ],
  background: [
    { title: 'Interval notation', text: '[a, b] includes both ends; (a, b) excludes them; [a, b) includes a only. ∪ joins pieces: (−∞, 2) ∪ (2, ∞) means every real number except 2.' },
    { title: 'Exponent rules', text: 'a^{m}a^{n} = a^{m+n}; {{a^{m}|a^{n}}} = a^{m−n}; (a^{m})^{n} = a^{mn}; a^{−n} = {{1|a^{n}}}; a^{1/n} = the nth root of a (for even n this needs a ≥ 0). They combine powers of the same base only: x^{2} + x^{3} is not x^{5}.' },
  ],
  definitions: [
    ['Function', 'A rule giving exactly one output f(x) for each input x in its domain.'],
    ['Domain and range', 'Domain: all allowed inputs. Range: all outputs actually produced.'],
    ['Even and odd functions', 'Even: f(−x) = f(x) (symmetric about the y-axis, e.g. x², cos x). Odd: f(−x) = −f(x) (symmetric about the origin, e.g. x³, sin x). Most functions are neither.'],
    ['Composition', '(f ∘ g)(x) = f(g(x)): apply g first, then f.'],
    ['One-to-one; inverse', 'f is one-to-one if different inputs give different outputs. Then f^{−1} exists, with f^{−1}(f(x)) = x on the domain of f.'],
    ['Logarithm', 'log_{b} x = y ⇔ b^{y} = x, for b > 0, b ≠ 1, x > 0. ln x is log_{e} x.'],
    ['Radian', 'The angle subtended by an arc equal in length to the radius. 2π rad = 360°.'],
  ],
  symbols: [
    ['f(x)', 'output of f at input x', 'output units'],
    ['f ∘ g', 'composition, g first then f', '—'],
    ['f^{−1}', 'inverse function (not 1/f)', '—'],
    ['A, B, h, k', 'amplitude, frequency factor, horizontal and vertical shifts in y = A sin(B(x − h)) + k', 'output units; per unit of x; units of x; output units'],
  ],
  formulas: [
    { name: 'Domain restrictions', f: 'denominator ≠ 0;   √{u}: u ≥ 0;   ln u: u > 0', when: 'Apply every restriction present in the formula, then combine them.' },
    { name: 'Transformation form', f: 'y = a·f(b(x − h)) + k', when: 'a: vertical stretch/reflection; k: vertical shift; h: horizontal shift (right for h > 0); b: horizontal scale 1/|b|. Factor b out first: f(2x − 6) = f(2(x − 3)) has h = 3, not 6.' },
    { name: 'Logarithm laws', f: 'ln(ab) = ln a + ln b;   ln({{a|b}}) = ln a − ln b;   ln(a^{r}) = r ln a;   e^{ln x} = x', when: 'Only for positive a, b, x. Check solutions of log equations against the original domain.' },
    { name: 'Trigonometric identities and graphs', f: 'sin^{2} x + cos^{2} x = 1;   tan x = {{sin x|cos x}};   period of A sin(Bx) = {{2π|∣B∣}},  amplitude ∣A∣', when: 'Angles in radians. tan x is undefined where cos x = 0.' },
    { name: 'Inverse trigonometric ranges', f: 'arcsin x ∈ [−π/2, π/2];   arccos x ∈ [0, π];   arctan x ∈ (−π/2, π/2)', when: 'arcsin and arccos need −1 ≤ x ≤ 1. They return one principal angle, not every angle with that value.' },
  ],
  derivation: {
    title: 'Why an inside shift moves the graph the “wrong” way',
    intro: 'Compare y = √{x} with y = √{x + 4}.',
    steps: [
      ['√{x} starts at x = 0, where the radicand is 0.', 'Starting point of the parent graph.'],
      ['√{x + 4} starts where x + 4 = 0, that is at x = −4.', 'The same output now happens 4 units earlier.'],
      ['So the whole graph moves 4 units left.', 'Every output is reached at an input 4 smaller.'],
    ],
    end: 'Inside changes act on inputs, so they undo themselves: to get the same output you need x + 4 to equal the old x. Test a landmark point instead of memorising a sign rule.',
  },
  figure: { svg: fig, caption: 'y = −2(x − 3)² + 1: move the parent parabola 3 right and 1 up, stretch it by 2 and flip it. The point (1, 1) goes to (1 + 3, −2·1 + 1) = (4, −1).' },
  table: {
    caption: 'Parent functions used throughout calculus',
    head: ['function', 'domain', 'range', 'key feature'],
    rows: [['x²', 'all reals', '[0, ∞)', 'even; vertex at origin'], ['x³', 'all reals', 'all reals', 'odd; one-to-one'], ['√{x}', '[0, ∞)', '[0, ∞)', 'starts at origin'], ['1/x', 'x ≠ 0', 'y ≠ 0', 'asymptotes x = 0, y = 0'], ['e^{x}', 'all reals', '(0, ∞)', 'always positive; inverse of ln x'], ['ln x', '(0, ∞)', 'all reals', 'ln 1 = 0; undefined for x ≤ 0'], ['sin x', 'all reals', '[−1, 1]', 'odd; period 2π'], ['cos x', 'all reals', '[−1, 1]', 'even; period 2π']],
  },
  method: {
    title: 'Reading a function before calculus',
    steps: [
      'Find the domain: list every denominator, even root and logarithm, write each restriction, and combine them.',
      'Identify the structure: which parent function, which transformations, which composition (inside and outside)?',
      'For an equation with logs or roots, solve algebraically, then check every candidate in the original equation’s domain.',
      'For trigonometry, work in radians, find the reference angle, then fix the sign from the quadrant.',
    ],
  },
  examples: [
    {
      title: 'A domain with a root and a denominator',
      problem: 'Find the domain of f(x) = {{√{x + 3}|x − 2}}, and evaluate f(−3).',
      steps: [
        ['Root: x + 3 ≥ 0, so x ≥ −3.', 'An even root needs a non-negative radicand; equality is allowed.'],
        ['Denominator: x − 2 ≠ 0, so x ≠ 2.', 'Division by zero is undefined.'],
        ['Combine: [−3, 2) ∪ (2, ∞).', 'Keep inputs that satisfy both conditions.'],
        ['f(−3) = {{√{0}|−5}} = 0.', 'The endpoint −3 is allowed.'],
      ],
      result: 'Domain [−3, 2) ∪ (2, ∞); f(−3) = 0.',
      meaning: 'With a logarithm instead, ln(x + 3), the endpoint −3 would be excluded, because ln needs a strictly positive argument.',
    },
    {
      title: 'Composition in both orders',
      problem: 'For f(x) = √{x} and g(x) = x − 3, find (f ∘ g)(x) and (g ∘ f)(x) with their domains.',
      steps: [
        ['(f ∘ g)(x) = f(x − 3) = √{x − 3}; domain x ≥ 3.', 'The input reaching the root is x − 3, which must be ≥ 0.'],
        ['(g ∘ f)(x) = g(√{x}) = √{x} − 3; domain x ≥ 0.', 'Now the root acts first, on x itself.'],
      ],
      result: '√{x − 3} on [3, ∞) and √{x} − 3 on [0, ∞): different functions.',
      meaning: 'Order matters. Recognising which function is inside is the key step of the chain rule.',
    },
    {
      title: 'A transformation traced by a point',
      problem: 'Describe y = −2(x − 3)^{2} + 1 as a transformation of y = x^{2}, and give its range.',
      steps: [
        ['Inside: x − 3 shifts the graph 3 right.', 'h = 3.'],
        ['Outside: × (−2) stretches vertically by 2 and reflects in the x-axis; + 1 shifts up 1.', 'a = −2, k = 1.'],
        ['Vertex (0, 0) → (3, 1); the parabola now opens downward.', 'Track the landmark point.'],
      ],
      result: 'Vertex (3, 1), opening downward; range (−∞, 1].',
      meaning: 'The maximum value 1 occurs at x = 3 — the kind of fact that optimization later finds with derivatives.',
    },
    {
      title: 'An inverse with its domain',
      problem: 'Find the inverse of f(x) = √{x − 1}, x ≥ 1, and state its domain.',
      steps: [
        ['Write y = √{x − 1} and solve: y^{2} = x − 1, so x = y^{2} + 1.', 'Solve for the input.'],
        ['Exchange letters: f^{−1}(x) = x^{2} + 1.', 'The inverse takes outputs back to inputs.'],
        ['Domain of f^{−1} = range of f = [0, ∞).', 'A square root never produces negative outputs.'],
      ],
      result: 'f^{−1}(x) = x^{2} + 1 for x ≥ 0.',
      meaning: 'Without the restriction x ≥ 0, x² + 1 would not be one-to-one and could not be the inverse.',
    },
    {
      title: 'A logarithm equation with a domain check',
      problem: 'Solve ln(x − 1) + ln(x + 1) = ln 8.',
      steps: [
        ['Domain: x − 1 > 0 and x + 1 > 0, so x > 1.', 'Every logarithm argument must be positive.'],
        ['Combine: ln((x − 1)(x + 1)) = ln 8, so x^{2} − 1 = 8.', 'ln a + ln b = ln(ab); ln is one-to-one.'],
        ['x^{2} = 9, so x = 3 or x = −3.', 'Algebraic candidates.'],
        ['Only x = 3 satisfies x > 1.', 'Reject −3: ln(−4) is undefined.'],
      ],
      result: 'x = 3.',
      meaning: 'Algebra can create candidates that the original equation does not allow. Always check.',
    },
    {
      title: 'Trigonometric values from one ratio',
      problem: 'If sin θ = 5/13 and θ is in quadrant II, find cos θ and tan θ.',
      steps: [
        ['cos^{2} θ = 1 − (5/13)^{2} = 144/169, so |cos θ| = 12/13.', 'Pythagorean identity gives the size.'],
        ['In quadrant II cosine is negative: cos θ = −12/13.', 'The quadrant gives the sign.'],
        ['tan θ = {{sin θ|cos θ}} = −5/12.', 'Definition of tangent.'],
      ],
      result: 'cos θ = −12/13, tan θ = −5/12.',
      meaning: 'The identity fixes magnitudes; only the quadrant can fix signs.',
    },
    {
      title: 'Reading a sinusoidal graph',
      problem: 'For y = 3 cos(2x) − 1, give the amplitude, period, midline, maximum and minimum.',
      steps: [
        ['Amplitude |A| = 3; midline y = −1.', 'A = 3, k = −1.'],
        ['Period = 2π/2 = π.', 'B = 2.'],
        ['Maximum −1 + 3 = 2 (at x = 0); minimum −1 − 3 = −4 (at x = π/2).', 'cos 0 = 1 and cos π = −1.'],
      ],
      result: 'Amplitude 3, period π, midline y = −1, maximum 2, minimum −4.',
      meaning: 'Oscillating quantities (vibrations, alternating current) are described this way.',
    },
  ],
  mistakes: [
    ['Including a zero argument in a logarithm domain.', 'ln u needs u > 0 strictly; √{u} allows u = 0.'],
    ['Reading f(x − 3) as a shift to the left.', 'x − 3 shifts right by 3; test the point where the inside equals the old landmark.'],
    ['Writing f^{−1}(x) = 1/f(x).', 'The inverse function reverses f; 1/f is a reciprocal, a different thing.'],
    ['Combining x² + x³ into x⁵.', 'Exponent rules apply to products and quotients of the same base, not to sums.'],
    ['Using degrees in calculus.', 'Calculus formulas for sin, cos and tan assume radians.'],
    ['Assuming arcsin gives every solution.', 'arcsin returns one principal angle in [−π/2, π/2]; other solutions come from symmetry and periodicity.'],
  ],
  scope: [
    'This is a review of prerequisites, not a full precalculus course. Hyperbolic functions and detailed identities are not included.',
  ],
  checks: [
    ['f(−3)', Math.sqrt(0) / (-3 - 2), 0, 1e-12],
    ['vertex value', g(3), 1, 0], ['point map', g(4), -1, 0],
    ['inverse', ((x) => x * x + 1)(Math.sqrt(5 - 1)), 5, 1e-12],
    ['log eq', Math.log(3 - 1) + Math.log(3 + 1), Math.log(8), 1e-12],
    ['cos', -Math.sqrt(1 - (5 / 13) ** 2), -12 / 13, 1e-12],
    ['sinusoid max', 3 * Math.cos(0) - 1, 2, 0], ['sinusoid min', 3 * Math.cos(Math.PI) - 1, -4, 1e-12], ['period', 2 * Math.PI / 2, Math.PI, 0],
    ['radian', Math.PI, 180 * Math.PI / 180, 0],
  ],
};
