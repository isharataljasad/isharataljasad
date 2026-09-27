import { plot, render, curve, dot, label, dashTo, seg } from '../svg.mjs';

const f = (x) => x + 3; // (x² − 9)/(x − 3) for x ≠ 3
const fig = render('ma-lim', {
  title: 'Graph of (x² − 9)/(x − 3): the line y = x + 3 with a hole at (3, 6)',
  desc: 'The graph is the straight line y = x + 3 except at x = 3, where there is an open circle at height 6. Dashed guides show the heights approaching 6 from both sides.',
}, plot({ x: [-1, 6], y: [0, 10], xticks: [1, 2, 3, 4, 5], yticks: [2, 4, 6, 8], xlabel: 'x', ylabel: 'y' }, [
  curve(f, -1, 6),
  dashTo(3, 6),
  dot(3, 6, { open: true, color: '#b3412e' }),
  label(3, 6, 'hole: no value at x = 3', { dx: 12, dy: 22, color: '#b3412e', size: 14 }),
  label(0.5, 9.3, 'limit as x → 3 is 6', { color: '#9b6328', size: 14 }),
  label(5.9, 7.2, 'y = x + 3', { color: '#176e66', size: 14, anchor: 'end' }),
]));

export default {
  summary: 'A limit describes the value a function approaches near a point, not the value at the point.',
  why: [
    'Every idea in calculus is built on limits. The derivative (instantaneous rate of change) is a limit of average rates, and continuity is defined with a limit. Engineers use limits whenever a quantity cannot be evaluated directly at a point but its behaviour close to that point is known: the speed at one instant, the steady value a process settles to, or a formula that breaks down at a single input.',
  ],
  idea: [
    'Think of walking along the graph of a function towards the input x = a. The limit asks: **what height are you heading towards?** It does not ask what happens exactly at x = a. The function may have a different value there, or no value at all, and the limit is unaffected.',
    'For example, f(x) = {{x^{2} − 9|x − 3}} cannot be evaluated at x = 3, because the denominator is zero. For every other input, the numerator factors as (x − 3)(x + 3), so f(x) = x + 3 whenever x ≠ 3. Near 3 the outputs are close to 6, so the limit is 6, even though f(3) does not exist. The graph is a straight line with a single hole.',
    'You approach a point from two sides. Coming from inputs smaller than a gives the **left-hand limit**; coming from larger inputs gives the **right-hand limit**. The (two-sided) limit exists only when both one-sided limits exist and agree.',
    'When direct substitution produces the expression {{0|0}}, the calculation is not finished: {{0|0}} is not a number. It is a signal that the numerator and denominator share a factor that vanishes at the point. The task is to rewrite the expression, using algebra that is valid for inputs near a (but not at a), until substitution works.',
  ],
  background: [
    { title: 'Factoring', text: 'Difference of squares: a^{2} − b^{2} = (a − b)(a + b), so x^{2} − 9 = (x − 3)(x + 3). A quadratic x^{2} + bx + c factors as (x + p)(x + q) when p + q = b and pq = c; for example x^{2} − 5x + 6 = (x − 2)(x − 3).' },
    { title: 'Cancelling in a fraction', text: 'A common factor may be cancelled only when it is not zero. The statement {{(x − 3)(x + 3)|x − 3}} = x + 3 is true for every x except x = 3. A limit never uses the input x = a itself, so inside a limit the cancellation is valid.' },
    { title: 'Conjugates', text: 'Multiplying √{A} − B by its conjugate √{A} + B gives A − B^{2}, which removes the square root. Multiplying the numerator and the denominator by the same non-zero expression does not change the value of a fraction.' },
  ],
  definitions: [
    ['Limit', 'We write lim_{x→a} f(x) = L when the values f(x) can be made as close to L as we like by taking x sufficiently close to a, with x ≠ a. The value f(a), if it exists, plays no part.'],
    ['One-sided limits', 'lim_{x→a^{−}} f(x) uses only inputs x < a; lim_{x→a^{+}} f(x) uses only x > a. The two-sided limit equals L exactly when both one-sided limits equal L.'],
    ['Indeterminate form', 'An expression such as {{0|0}} obtained by direct substitution. It tells you that more work is needed; different functions giving {{0|0}} can have completely different limits.'],
    ['Limit at infinity', 'lim_{x→∞} f(x) = L means f(x) gets arbitrarily close to L as x grows without bound. The line y = L is then a horizontal asymptote of the graph.'],
    ['Infinite limit', 'lim_{x→a} f(x) = ∞ means f(x) grows without bound near a. The limit does not exist as a number; writing ∞ describes how it fails. The line x = a is a vertical asymptote.'],
  ],
  symbols: [
    ['x → a', 'x approaches a, taking values near a but never equal to a', 'same units as x'],
    ['x → a^{−}, x → a^{+}', 'approach from the left (x < a) or from the right (x > a)', '—'],
    ['L', 'the limiting value of f(x)', 'same units as f(x)'],
    ['ε, δ', 'epsilon: allowed error in the output; delta: allowed distance of the input from a', 'output units, input units'],
  ],
  formulas: [
    { name: 'Existence test', f: 'lim_{x→a} f(x) = L  ⇔  lim_{x→a^{−}} f(x) = L and lim_{x→a^{+}} f(x) = L', when: 'Always. If the one-sided limits differ, or either fails to exist, the two-sided limit does not exist.' },
    { name: 'Limit laws', f: 'lim (f ± g) = lim f ± lim g;  lim (f·g) = (lim f)(lim g);  lim {{f|g}} = {{lim f|lim g}}', when: 'Valid when lim f and lim g exist (as finite numbers), and for the quotient only when lim g ≠ 0.' },
    { name: 'Direct substitution', f: 'lim_{x→a} p(x) = p(a)', when: 'For polynomials at every a; for rational functions {{p|q}} wherever q(a) ≠ 0. Also for √{x}, sin x, cos x, e^{x} at points of their domain.' },
    { name: 'Fundamental trigonometric limit', f: 'lim_{x→0} {{sin x|x}} = 1', when: 'x must be measured in radians. In degrees the limit is π/180, not 1.' },
    { name: 'Squeeze theorem', f: 'If g(x) ≤ f(x) ≤ h(x) near a and lim g = lim h = L, then lim f = L', when: 'The inequalities must hold for all x near a (except possibly at a).' },
    { name: 'Rational functions at infinity', f: 'lim_{x→∞} {{a_{n}x^{n} + …|b_{m}x^{m} + …}} = 0 if n < m;  {{a_{n}|b_{m}}} if n = m;  ±∞ if n > m', when: 'Divide numerator and denominator by the highest power of x in the denominator. For n > m the sign depends on the leading coefficients and on whether x → +∞ or −∞.' },
  ],
  derivation: {
    title: 'Why cancelling a factor that is zero at the point is allowed',
    intro: 'Cancelling (x − 3) looks like dividing by zero at x = 3. The definition of a limit is what makes it legitimate.',
    steps: [
      ['Factor: {{x^{2} − 9|x − 3}} = {{(x − 3)(x + 3)|x − 3}}.', 'Factoring exposes the factor that makes both numerator and denominator zero.'],
      ['The limit only uses inputs with x ≠ 3.', 'By definition, lim_{x→3} looks at x near 3 and excludes x = 3 itself.'],
      ['For x ≠ 3, x − 3 ≠ 0, so the factor cancels: the expression equals x + 3.', 'Dividing by a non-zero number is always allowed.'],
      ['The two functions agree at every input the limit uses, so they have the same limit: lim_{x→3} (x + 3) = 6.', 'x + 3 is a polynomial, so direct substitution is valid for it.'],
    ],
    end: 'The original expression is still undefined at x = 3. We have found its limit, not its value.',
  },
  table: {
    caption: 'Values of f(x) = (x² − 9)/(x − 3) near x = 3',
    head: ['x', 'side', 'f(x)'],
    rows: [['2.9', 'left', '5.9'], ['2.99', 'left', '5.99'], ['2.999', 'left', '5.999'], ['3', 'the point itself', 'undefined (0/0)'], ['3.001', 'right', '6.001'], ['3.01', 'right', '6.01'], ['3.1', 'right', '6.1']],
    note: 'Both columns of nearby values head towards 6. The middle row has no value, yet the limit is 6: a limit is decided by the surrounding rows. A table suggests a limit; algebra confirms it.',
  },
  figure: { svg: fig, caption: 'The graph of (x² − 9)/(x − 3) is the line y = x + 3 with one point removed. The heights approach 6 from both sides, so the limit is 6 even though there is no value at x = 3.' },
  method: {
    title: 'How to evaluate a limit lim_{x→a} f(x)',
    steps: [
      'Try direct substitution first. If you get a number (and no division by zero), that number is the limit for polynomials, rational functions with non-zero denominator, roots, exponentials and trigonometric functions in their domains.',
      'If you get {{0|0}}: factor and cancel, or multiply by a conjugate when there is a square root, or use a known limit such as {{sin x|x}} → 1.',
      'If you get {{k|0}} with k ≠ 0: the function grows without bound. Check the sign on each side to decide between +∞, −∞ or “does not exist”.',
      'For piecewise functions or absolute values, compute the left- and right-hand limits separately and compare them.',
      'For x → ±∞ with a rational function, divide by the highest power of x in the denominator.',
    ],
  },
  examples: [
    {
      title: 'Factoring a 0/0 form',
      problem: 'Find lim_{x→2} {{x^{2} − 4|x − 2}}.',
      steps: [
        ['Substitute x = 2: numerator 4 − 4 = 0, denominator 2 − 2 = 0. The form is {{0|0}}.', 'Substitution first tells us whether more work is needed.'],
        ['Factor the numerator: x^{2} − 4 = (x − 2)(x + 2).', 'Zero in both parts means (x − 2) is a common factor.'],
        ['Cancel (x − 2), valid because x ≠ 2 inside the limit: the expression becomes x + 2.', 'The limit never uses x = 2 itself.'],
        ['Substitute into the polynomial: 2 + 2 = 4.', 'Direct substitution is valid for polynomials.'],
      ],
      result: 'lim_{x→2} {{x^{2} − 4|x − 2}} = 4.',
      meaning: 'The graph is the line y = x + 2 with a hole at (2, 4).',
    },
    {
      title: 'A square root: multiply by the conjugate',
      problem: 'Find lim_{x→0} {{√{x + 4} − 2|x}}.',
      steps: [
        ['Substitute x = 0: numerator √{4} − 2 = 0, denominator 0. The form is {{0|0}}.', 'Factoring does not help directly because of the root.'],
        ['Multiply numerator and denominator by √{x + 4} + 2.', '(√{A} − 2)(√{A} + 2) = A − 4 removes the root.'],
        ['Numerator: (x + 4) − 4 = x. The fraction becomes {{x|x(√{x + 4} + 2)}}.', 'The hidden common factor x now appears.'],
        ['Cancel x (x ≠ 0): {{1|√{x + 4} + 2}}. Substitute x = 0: {{1|2 + 2}} = {{1|4}}.', 'The new denominator is 4, not zero, so substitution is valid.'],
      ],
      result: 'The limit is 1/4 = 0.25.',
      meaning: 'This limit is the slope of y = √{x} at x = 4, a preview of the derivative.',
    },
    {
      title: 'Value versus limit',
      problem: 'Let f(x) = {{x^{2} − 4|x − 2}} for x ≠ 2 and f(2) = 7. Find lim_{x→2} f(x) and f(2).',
      steps: [
        ['For x ≠ 2, f(x) = x + 2 (as in the first example).', 'Only inputs near 2, not equal to 2, matter for the limit.'],
        ['lim_{x→2} f(x) = 2 + 2 = 4.', 'Substitute into x + 2.'],
        ['The function value is given separately: f(2) = 7.', 'The value at the point is a separate piece of information.'],
      ],
      result: 'lim_{x→2} f(x) = 4, but f(2) = 7.',
      meaning: 'The limit and the value are different, so this function is not continuous at x = 2 (see the next topic).',
    },
    {
      title: 'One-sided limits that disagree',
      problem: 'Let f(x) = {{|x − 5||x − 5}}. Find the one-sided limits at x = 5 and decide whether lim_{x→5} f(x) exists.',
      steps: [
        ['For x > 5, x − 5 is positive, so |x − 5| = x − 5 and f(x) = 1.', 'The absolute value of a positive number is the number itself.'],
        ['For x < 5, x − 5 is negative, so |x − 5| = −(x − 5), which is positive. Then f(x) = {{−(x − 5)|x − 5}} = −1.', 'The absolute value of a negative number is its opposite, which is positive.'],
        ['lim_{x→5^{−}} f(x) = −1 and lim_{x→5^{+}} f(x) = 1.', 'Each side is constant.'],
      ],
      result: 'The one-sided limits are −1 and 1. They differ, so lim_{x→5} f(x) does not exist.',
      meaning: 'The graph jumps from height −1 to height 1 at x = 5.',
    },
    {
      title: 'A trigonometric limit (radians)',
      problem: 'Find lim_{x→0} {{sin 5x|x}}.',
      steps: [
        ['Rewrite: {{sin 5x|x}} = 5 · {{sin 5x|5x}}.', 'Multiply and divide by 5 so the argument of sine matches the denominator.'],
        ['Let u = 5x. As x → 0, u → 0, so {{sin u|u}} → 1.', 'The fundamental limit, with angles in radians.'],
      ],
      result: 'lim_{x→0} {{sin 5x|x}} = 5 · 1 = 5.',
      meaning: 'Near zero, sin 5x ≈ 5x, so the ratio is close to 5.',
    },
    {
      title: 'A limit at infinity',
      problem: 'Find lim_{x→∞} {{6x^{2} + 1|2x^{2} − 3}}.',
      steps: [
        ['Divide numerator and denominator by x^{2}: {{6 + 1/x^{2}|2 − 3/x^{2}}}.', 'x^{2} is the highest power in the denominator.'],
        ['As x → ∞, 1/x^{2} → 0 and 3/x^{2} → 0.', 'A constant divided by an ever larger number approaches 0.'],
      ],
      result: 'The limit is 6/2 = 3, so y = 3 is a horizontal asymptote.',
      meaning: 'For equal degrees, the limit is the ratio of the leading coefficients.',
    },
    {
      title: 'The squeeze theorem',
      problem: 'Find lim_{x→0} x^{2} cos(1/x).',
      steps: [
        ['For every x ≠ 0, −1 ≤ cos(1/x) ≤ 1.', 'Cosine is always between −1 and 1, even though cos(1/x) oscillates wildly near 0 and has no limit itself.'],
        ['Multiply by x^{2} ≥ 0: −x^{2} ≤ x^{2} cos(1/x) ≤ x^{2}.', 'Multiplying by a non-negative number keeps the inequalities in the same direction.'],
        ['Both outer functions have limit 0 as x → 0.', 'Direct substitution in ±x^{2}.'],
      ],
      result: 'By the squeeze theorem, lim_{x→0} x^{2} cos(1/x) = 0.',
      meaning: 'The factor x^{2} shrinks the oscillation to nothing.',
    },
  ],
  extra: [
    { title: 'The precise (ε–δ) meaning of a limit', text: [
      'lim_{x→a} f(x) = L means: for every tolerance ε > 0 on the output there is a distance δ > 0 such that 0 < |x − a| < δ guarantees |f(x) − L| < ε. In words, however strict the output tolerance, we can meet it by keeping the input close enough to a.',
      'Example: for f(x) = 2x + 1 at a = 3, L = 7. Then |f(x) − 7| = |2x − 6| = 2|x − 3|. To make this less than ε we need |x − 3| < ε/2, so δ = ε/2 works. For ε = 0.1, δ = 0.05. The factor 2 is the slope: the function doubles input errors, so the input tolerance must be half the output tolerance.',
    ] },
  ],
  mistakes: [
    ['“Substitution gives 0/0, so the limit is 0 (or 1, or does not exist).”', '0/0 is not an answer. lim_{x→0} x/x = 1, lim_{x→0} x^{2}/x = 0 and lim_{x→0} 5x/x = 5 all give 0/0 on substitution but have different limits.'],
    ['“The limit is the same as the value f(a).”', 'Only for continuous functions. A function can have a limit where it is undefined (the hole above) or a value different from its limit.'],
    ['“If the left-hand limit exists, the limit exists.”', 'You must check both sides. One side alone can prove that a limit does not exist (if it disagrees with the other), never that it exists.'],
    ['Treating ∞ as a number, e.g. “∞ − ∞ = 0”.', 'Forms such as ∞ − ∞ and ∞/∞ are indeterminate. Rewrite the expression (for example divide by the highest power) before concluding.'],
    ['Using degrees in lim_{x→0} sin x / x.', 'The value 1 requires radians. Calculators set to degrees give about 0.01745.'],
  ],
  scope: [
    'The ε–δ definition is explained with a linear example; general ε–δ proofs belong to real analysis.',
    'L’Hôpital’s rule is not used here. It needs derivatives and has its own conditions; check whether your lecturer includes it in MA 101.',
  ],
  checks: [
    ['(x²−4)/(x−2) near 2', ((2.000001) ** 2 - 4) / (2.000001 - 2), 4, 1e-4],
    ['(√(x+4)−2)/x near 0', (Math.sqrt(1e-8 + 4) - 2) / 1e-8, 0.25, 1e-4],
    ['sin 5x / x near 0', Math.sin(5e-6) / 1e-6, 5, 1e-6],
    ['(6x²+1)/(2x²−3) large x', (6e12 + 1) / (2e12 - 3), 3, 1e-6],
    ['x² cos(1/x) near 0', 1e-4 ** 2 * Math.cos(1e4), 0, 1e-7],
    ['|x−5|/(x−5) left', Math.abs(4.999 - 5) / (4.999 - 5), -1, 0],
    ['delta for eps 0.1', 0.1 / 2, 0.05, 0],
    ['table 2.99', (2.99 ** 2 - 9) / (2.99 - 3), 5.99, 1e-9],
  ],
};
