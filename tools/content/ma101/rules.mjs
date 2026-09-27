import { svg, box, line, text, vector } from '../svg.mjs';

const fig = svg('ma-rules', { w: 520, h: 300, title: 'Choosing a differentiation rule from the last operation', desc: 'A decision diagram. The top box asks: what is the last operation you would do to evaluate the expression? Four branches lead to: sum or difference, differentiate term by term; product, product rule; quotient, quotient rule; function of a function, chain rule. Examples: x³ + 5x, x² sin x, (x + 1)/(x − 1), (2x + 5)⁴.' },
  box(110, 12, 300, 54, ['What is the LAST operation', 'when you evaluate it?'], { fill: '#fff' })
  + [0, 1, 2, 3].map((i) => vector(260, 66, 65 + i * 130, 116, 'ink', 1.6)).join('')
  + [['Sum/difference', 'term by term', 'x³ + 5x'], ['Product', 'product rule', 'x² sin x'], ['Quotient', 'quotient rule', '(x+1)/(x−1)'], ['Function of', 'a function: chain', '(2x + 5)⁴']]
    .map(([a, b, c], i) => box(8 + i * 128, 120, 118, 70, [a, b]) + text(67 + i * 128, 216, 'e.g. ' + c, { anchor: 'middle', size: 13, color: '#5e7376' })).join('')
  + text(260, 262, 'Inside each rule, apply the same question again to each part.', { anchor: 'middle', size: 14, color: '#9b6328' })
  + text(260, 284, 'Example: for (2x + 5)⁴ the last step is “raise to the 4th power”.', { anchor: 'middle', size: 13, color: '#5e7376' }));

export default {
  summary: 'Rules that give derivatives quickly and reliably: power, sum, product, quotient and chain rules, with the derivatives of trigonometric, exponential and logarithmic functions.',
  why: [
    'Computing every derivative from the limit definition is slow and error-prone. The rules below are consequences of that definition; once you trust them, you can differentiate almost any formula that appears in engineering models, from polynomials to damped oscillations and exponential decay.',
  ],
  idea: [
    'Every formula is built from simple functions (powers, sin, e^{x}, ln x) combined by a few operations: adding, multiplying, dividing, and putting one function inside another. There is one rule for each operation. The skill is to **read the structure** of the formula: which operation would you do last if you evaluated it at a number? That operation decides the first rule to use.',
    'The **power rule** says that the derivative of x^{n} is nx^{n−1}: the exponent comes down and decreases by one. Constants multiply through and sums split term by term, because limits behave that way.',
    'For a **product** f·g, both factors change, so both contribute: (fg)′ = f′g + fg′. It is **not** f′g′. For a **quotient**, (f/g)′ = (f′g − fg′)/g^{2}; the order in the numerator matters because of the minus sign.',
    'For a **composition** f(g(x)) — a function of a function — the rates multiply: if the inside changes at rate g′ and the outside responds at rate f′ (evaluated at the inside), the total rate is f′(g(x))·g′(x). This is the **chain rule**. Forgetting the inside derivative is the most common error in all of calculus.',
    'Trigonometric derivatives such as (sin x)′ = cos x are only true when x is in **radians**, because they depend on lim sin h / h = 1. The exponential e^{x} is its own derivative, and ln x has derivative 1/x for x > 0.',
  ],
  background: [
    { title: 'Exponent laws', text: '√{x} = x^{1/2}, {{1|x^{n}}} = x^{−n}, x^{a}·x^{b} = x^{a+b}. Rewrite roots and reciprocals as powers before using the power rule: {{1|√{x}}} = x^{−1/2}.' },
    { title: 'Composition', text: 'In f(g(x)), g is the inside function and f the outside. For (2x + 5)^{4}, the inside is u = 2x + 5 and the outside is u^{4}. For sin(x^{2}) the inside is x^{2} and the outside is sin.' },
    { title: 'Radians', text: 'π radians = 180°. Calculus formulas for sin, cos and tan assume radians.' },
  ],
  definitions: [
    ['Power rule', '{{d|dx}} x^{n} = nx^{n−1} for any constant n (for non-integer n, on x > 0 where x^{n} is defined).'],
    ['Linearity', '(cf)′ = cf′ and (f ± g)′ = f′ ± g′: constants factor out and sums split.'],
    ['Product rule', '(fg)′ = f′g + fg′.'],
    ['Quotient rule', '(f/g)′ = {{f′g − fg′|g^{2}}}, wherever g ≠ 0.'],
    ['Chain rule', '{{d|dx}} f(g(x)) = f′(g(x))·g′(x). In Leibniz form, with y = f(u) and u = g(x): {{dy|dx}} = {{dy|du}}·{{du|dx}}.'],
    ['Higher derivatives', 'f″ is the derivative of f′; it measures how the rate itself changes. If s(t) is position, s′ = v is velocity and s″ = a is acceleration.'],
    ['Implicit differentiation', 'When y is defined by an equation such as x^{2} + y^{2} = 25, differentiate both sides with respect to x, treating y as a function of x (so y^{2} gives 2y·y′), then solve for y′.'],
  ],
  symbols: [
    ['f′, {{df|dx}}, {{d|dx}}', 'derivative with respect to x', 'output units ÷ x units'],
    ['f″, {{d^{2}f|dx^{2}}}', 'second derivative', 'output units ÷ (x units)²'],
    ['u', 'the inside function in the chain rule', '—'],
  ],
  formulas: [
    { name: 'Constants and powers', f: '(c)′ = 0;  (x^{n})′ = nx^{n−1};  (cf)′ = cf′;  (f ± g)′ = f′ ± g′', when: 'n any real constant; for non-integer n restrict to x > 0 (and check endpoints separately).' },
    { name: 'Product and quotient', f: '(fg)′ = f′g + fg′;   ({{f|g}})′ = {{f′g − fg′|g^{2}}}', when: 'f and g differentiable; the quotient needs g(x) ≠ 0.' },
    { name: 'Chain rule', f: '[f(g(x))]′ = f′(g(x))·g′(x)', when: 'g differentiable at x and f differentiable at g(x).' },
    { name: 'Trigonometric', f: '(sin x)′ = cos x;  (cos x)′ = −sin x;  (tan x)′ = sec^{2} x', when: 'x in radians; tan x needs cos x ≠ 0.' },
    { name: 'Exponential and logarithmic', f: '(e^{x})′ = e^{x};  (a^{x})′ = a^{x} ln a;  (ln x)′ = {{1|x}};  (ln|x|)′ = {{1|x}}', when: 'a > 0 constant; ln x needs x > 0, ln|x| needs x ≠ 0.' },
    { name: 'Chain-rule versions', f: '(u^{n})′ = nu^{n−1}u′;  (sin u)′ = cos u·u′;  (e^{u})′ = e^{u}u′;  (ln u)′ = {{u′|u}}', when: 'u is any differentiable inside function (ln u needs u > 0).' },
    { name: 'Inverse trigonometric', f: '(arcsin x)′ = {{1|√{1 − x^{2}}}};  (arctan x)′ = {{1|1 + x^{2}}}', when: 'arcsin: |x| < 1. arctan: all real x. Note arcsin x is the inverse function, not 1/sin x.' },
  ],
  derivation: {
    title: 'Why the product rule has two terms',
    intro: 'Think of a rectangle with sides f(x) and g(x), so its area is A = fg. Increase x by h.',
    steps: [
      ['The sides become f + Δf and g + Δg. The new area is fg + Δf·g + f·Δg + Δf·Δg.', 'Expand (f + Δf)(g + Δg).'],
      ['The change in area is ΔA = Δf·g + f·Δg + Δf·Δg.', 'Subtract the original area fg.'],
      ['Divide by h: {{ΔA|h}} = {{Δf|h}}g + f{{Δg|h}} + {{Δf|h}}Δg.', 'This is the difference quotient of the product.'],
      ['Let h → 0: Δf/h → f′, Δg/h → g′ and Δg → 0 (g is continuous), so the last term vanishes.', 'Two strips survive; the tiny corner does not.'],
    ],
    end: 'Hence (fg)′ = f′g + fg′: each factor’s change, multiplied by the other factor.',
  },
  figure: { svg: fig, caption: 'Read the structure first. The operation you would do last when evaluating the expression at a number decides the rule.' },
  table: {
    caption: 'Examples of each rule',
    head: ['Function', 'Structure', 'Derivative'],
    rows: [
      ['4x^{3} − 2x + 7', 'sum of powers', '12x^{2} − 2'],
      ['√{x} = x^{1/2}', 'power', '{{1|2}}x^{−1/2} = {{1|2√{x}}}'],
      ['x^{2} sin x', 'product', '2x sin x + x^{2} cos x'],
      ['{{x + 1|x − 1}}', 'quotient', '{{(x − 1) − (x + 1)|(x − 1)^{2}}} = {{−2|(x − 1)^{2}}}'],
      ['(2x + 5)^{4}', 'chain (power of a linear function)', '4(2x + 5)^{3}·2 = 8(2x + 5)^{3}'],
      ['e^{3x}', 'chain', '3e^{3x}'],
      ['sin(x^{2})', 'chain', 'cos(x^{2})·2x'],
      ['ln(1 + x^{2})', 'chain with ln', '{{2x|1 + x^{2}}}'],
    ],
  },
  method: {
    title: 'How to differentiate a formula',
    steps: [
      'Rewrite roots and reciprocals as powers (√{x} = x^{1/2}, 1/x^{2} = x^{−2}) and simplify where it helps (expand simple products).',
      'Identify the last operation: sum, product, quotient or composition. Apply that rule.',
      'Inside each rule, differentiate each part by asking the same question again.',
      'For every composition, multiply by the derivative of the inside. Check that each chain has its inside factor.',
      'Simplify, and evaluate at the requested point last.',
    ],
  },
  examples: [
    {
      title: 'Power and sum rules',
      problem: 'Differentiate y = 4x^{3} − {{6|x}} + 2√{x}.',
      steps: [
        ['Rewrite: y = 4x^{3} − 6x^{−1} + 2x^{1/2}.', 'Every term becomes a power of x.'],
        ['Differentiate term by term: 12x^{2} − 6(−1)x^{−2} + 2·{{1|2}}x^{−1/2}.', 'Bring down each exponent and reduce it by one.'],
      ],
      result: 'y′ = 12x^{2} + {{6|x^{2}}} + {{1|√{x}}}  (for x > 0).',
      meaning: 'The domain x > 0 comes from √{x} in the original function and 1/√{x} in the derivative.',
    },
    {
      title: 'Chain rule',
      problem: 'For y = (2x + 1)^{2}, find y′ and its value at x = 1.',
      steps: [
        ['Outside: u^{2}; inside: u = 2x + 1.', 'The last operation is squaring.'],
        ['y′ = 2(2x + 1)·(2x + 1)′ = 2(2x + 1)·2 = 4(2x + 1).', 'Outside derivative, evaluated at the inside, times the inside derivative.'],
        ['At x = 1: y′ = 4·3 = 12.', 'Substitute last.'],
      ],
      result: 'y′ = 4(2x + 1); y′(1) = 12.',
      meaning: 'Check by expanding: y = 4x^{2} + 4x + 1, so y′ = 8x + 4 = 4(2x + 1). Without the inside factor 2 you would get 6, which is wrong.',
    },
    {
      title: 'Product rule',
      problem: 'Differentiate y = x(x^{2} + 1) and find y′(2).',
      steps: [
        ['f = x, f′ = 1; g = x^{2} + 1, g′ = 2x.', 'Name the two factors and their derivatives.'],
        ['y′ = 1·(x^{2} + 1) + x·2x = 3x^{2} + 1.', 'f′g + fg′.'],
        ['y′(2) = 3·4 + 1 = 13.', 'Substitute.'],
      ],
      result: 'y′ = 3x^{2} + 1; y′(2) = 13.',
      meaning: 'Check: y = x^{3} + x, so y′ = 3x^{2} + 1. Multiplying the derivatives (1·2x = 2x) would be wrong.',
    },
    {
      title: 'Quotient rule',
      problem: 'Differentiate y = {{x^{2}|x + 1}} (x ≠ −1).',
      steps: [
        ['f = x^{2}, f′ = 2x; g = x + 1, g′ = 1.', 'Top and bottom separately.'],
        ['y′ = {{2x(x + 1) − x^{2}·1|(x + 1)^{2}}}.', 'f′g − fg′ over g^{2}, in that order.'],
        ['Simplify the numerator: 2x^{2} + 2x − x^{2} = x^{2} + 2x.', 'Expand and collect.'],
      ],
      result: 'y′ = {{x^{2} + 2x|(x + 1)^{2}}} = {{x(x + 2)|(x + 1)^{2}}}.',
      meaning: 'y′ = 0 at x = 0 and x = −2, where the graph has horizontal tangents.',
    },
    {
      title: 'Product and chain together',
      problem: 'Differentiate y = x^{2}e^{3x}.',
      steps: [
        ['Last operation: multiplication, so use the product rule with f = x^{2} and g = e^{3x}.', 'Structure first.'],
        ['f′ = 2x; g′ = e^{3x}·3 by the chain rule (inside 3x has derivative 3).', 'Each part may need its own rule.'],
        ['y′ = 2x e^{3x} + x^{2}·3e^{3x} = e^{3x}(2x + 3x^{2}).', 'Factor out e^{3x} for a tidy answer.'],
      ],
      result: 'y′ = xe^{3x}(2 + 3x).',
      meaning: 'Since e^{3x} > 0, the sign of y′ is the sign of x(2 + 3x).',
    },
    {
      title: 'Trigonometric and logarithmic chains',
      problem: 'Find the derivatives of sin 3x at x = 0 and of ln(1 + x^{2}) at x = 1.',
      steps: [
        ['(sin 3x)′ = cos 3x·3. At x = 0: 3cos 0 = 3.', 'Inside 3x has derivative 3; radians assumed.'],
        ['(ln(1 + x^{2}))′ = {{2x|1 + x^{2}}}. At x = 1: {{2|2}} = 1.', '(ln u)′ = u′/u with u = 1 + x^{2} > 0.'],
      ],
      result: '3 and 1.',
      meaning: 'Near x = 0, sin 3x rises about three times as fast as sin x.',
    },
    {
      title: 'Implicit differentiation',
      problem: 'The circle x^{2} + y^{2} = 25 passes through (3, 4). Find the slope of the tangent there.',
      steps: [
        ['Differentiate both sides with respect to x: 2x + 2y·y′ = 0.', 'y depends on x, so y^{2} differentiates to 2y·y′ by the chain rule.'],
        ['Solve: y′ = −{{x|y}} (for y ≠ 0).', 'Isolate y′.'],
        ['At (3, 4): y′ = −{{3|4}}.', 'Substitute both coordinates.'],
      ],
      result: 'The slope is −0.75.',
      meaning: 'The tangent is perpendicular to the radius from (0, 0) to (3, 4), whose slope is 4/3, as geometry predicts.',
    },
    {
      title: 'Second derivative: velocity and acceleration',
      problem: 'Position s(t) = t^{3} (m, t in s). Find the velocity and acceleration at t = 2 s.',
      steps: [
        ['v = s′(t) = 3t^{2}; v(2) = 12 m/s.', 'Differentiate once.'],
        ['a = s″(t) = (3t^{2})′ = 6t; a(2) = 12 m/s^{2}.', 'Differentiate the derivative again. Do not square s′.'],
      ],
      result: 'v(2) = 12 m/s, a(2) = 12 m/s^{2}.',
      meaning: 'Each differentiation divides the units by seconds: m, m/s, m/s^{2}.',
    },
  ],
  mistakes: [
    ['(fg)′ = f′g′.', 'The product rule has two terms: f′g + fg′. Check with x·x = x²: f′g′ = 1, but the true derivative is 2x.'],
    ['Forgetting the inside derivative: (sin 3x)′ = cos 3x.', 'The chain rule multiplies by the inside derivative: (sin 3x)′ = 3cos 3x.'],
    ['Reversing the quotient-rule numerator.', 'It is f′g − fg′ (derivative of the top first). The reversed order gives the wrong sign.'],
    ['Applying the power rule to e^{x} or 2^{x}: (e^{x})′ = xe^{x−1}.', 'The power rule needs a variable base and constant exponent. For a constant base: (e^{x})′ = e^{x}, (2^{x})′ = 2^{x} ln 2.'],
    ['Using degrees in trigonometric derivatives.', 'The formulas require radians.'],
    ['Treating arcsin x as 1/sin x.', 'arcsin is the inverse function (angle whose sine is x); 1/sin x is csc x.'],
  ],
  scope: [
    'Derivatives of hyperbolic functions are not included; check your outline.',
    'The rules assume each function is differentiable where it is used; at corners, cusps or outside the domain they do not apply.',
    'Logarithmic differentiation (for example of x^{x}) is shown in the collection notes below; x^{x} is neither a power function nor an exponential with constant base.',
  ],
  checks: [
    ['(2x+1)^2 at 1', 4 * 3, 12, 0],
    ['x(x²+1) at 2', 3 * 4 + 1, 13, 0],
    ['numeric d/dx x(x²+1) at 2', ((2.0000001) * (2.0000001 ** 2 + 1) - 10) / 1e-7, 13, 1e-4],
    ['quotient at 1', (1.0000001 ** 2 / 2.0000001 - 0.5) / 1e-7, (1 + 2) / 4, 1e-5],
    ['x²e^{3x} at 0.5', ((0.5000001 ** 2) * Math.exp(3 * 0.5000001) - 0.25 * Math.exp(1.5)) / 1e-7, 0.5 * Math.exp(1.5) * (2 + 1.5), 1e-4],
    ['sin3x at 0', Math.sin(3e-7) / 1e-7, 3, 1e-6],
    ['ln(1+x²) at 1', (Math.log(1 + 1.0000001 ** 2) - Math.log(2)) / 1e-7, 1, 1e-5],
    ['implicit slope', -3 / 4, -0.75, 0],
    ['s″(2)', 6 * 2, 12, 0],
  ],
};
