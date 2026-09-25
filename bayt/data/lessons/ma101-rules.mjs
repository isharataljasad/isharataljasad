/* درس بيت الفؤاد · MA 101 · قواعد الاشتقاق. */

/* الرسم: شجرة قرار. السؤال ليس «ما الدالة؟» بل «ما العملية الخارجية؟»،
   وهذا هو الفرق بين من يختار القاعدة ومن يجرّبها. */
const box = (x, y, w, h, stroke) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" `
  + `fill="#ffffff" stroke="${stroke}" stroke-width="2"/>`;

const figure = `<svg viewBox="0 0 540 250" role="img" aria-labelledby="fig-rules-title" class="bayt-svg">`
  + `<title id="fig-rules-title">A decision tree begins with a question about the external process and ends with four derivation rules</title>`
  + box(170, 14, 200, 44, '#105c78')
  + `<text x="270" y="42" font-size="16" fill="#153748" text-anchor="middle">What is the external process?</text>`
  /* خطوط من الجذر إلى الفروع الأربعة. */
  + `<line x1="270" y1="58" x2="70" y2="140" stroke="#566f7a" stroke-width="2"/>`
  + `<line x1="270" y1="58" x2="205" y2="140" stroke="#566f7a" stroke-width="2"/>`
  + `<line x1="270" y1="58" x2="340" y2="140" stroke="#566f7a" stroke-width="2"/>`
  + `<line x1="270" y1="58" x2="475" y2="140" stroke="#566f7a" stroke-width="2"/>`
  + box(10, 140, 120, 62, '#c69748')
  + `<text x="70" y="164" font-size="14" fill="#284955" text-anchor="middle">Addition or subtraction</text>`
  + `<text x="70" y="188" font-size="13" fill="#566f7a" text-anchor="middle">Derive each term</text>`
  + box(145, 140, 120, 62, '#c69748')
  + `<text x="205" y="164" font-size="14" fill="#284955" text-anchor="middle">Hit</text>`
  + `<text x="205" y="188" font-size="13" fill="#566f7a" text-anchor="middle">Product rule</text>`
  + box(280, 140, 120, 62, '#c69748')
  + `<text x="340" y="164" font-size="14" fill="#284955" text-anchor="middle">Divide</text>`
  + `<text x="340" y="188" font-size="13" fill="#566f7a" text-anchor="middle">Division rule</text>`
  + box(415, 140, 120, 62, '#c69748')
  + `<text x="475" y="164" font-size="14" fill="#284955" text-anchor="middle">Power of a function</text>`
  + `<text x="475" y="188" font-size="13" fill="#566f7a" text-anchor="middle">Chain base</text>`
  + `<text x="270" y="232" font-size="13" fill="#566f7a" text-anchor="middle">The outer operation is the last thing you do if you substitute a number</text>`
  + `</svg>`;

export default {
  course: 'ma101',
  topic: 'rules',

  objectives: [
    "The external operation in the function is determined, and the rule is chosen from it, not by experimentation.",
    "The product and division rules are applied along with the arrangement of terms and their signs.",
    "The chain rule is applied, separating the inner function from the outer function.",
  ],

  boundaries: [
    "implicit differentiation is the subject of the related rates lesson, not this lesson.",
    "Differentiation of trigonometric, exponential, and logarithmic functions is not in this lesson.",
    "Logarithmic differentiation and differentiation of inverse functions are out of scope here.",
    "Higher derivatives are mentioned and not detailed.",
  ],

  prerequisites: [
    {
      title: "Derived from the definition",
      why: "These rules are not a revelation; Each of them is derived from the definition of the limit, "
        + "Whoever understands the definition knows why the rule works and when it does not apply.",
      recap: '‎f′(a) = lim(h→0) (f(a + h) − f(a))/h‎. '
        + "You saw in the previous lesson that the derivative of x² is 2x in this way, "
        + "The power rule is a generalization of that result and there is no alternative to it.",
      href: '/semester-1/math/derivative/',
      hrefLabel: "Study the derivative of a rate of change",
    },
    {
      title: "Laws of exponents, especially negative and fractional exponents",
      why: "Most errors in the power rule are caused by a negative or fractional exponent that was not written in its exponential form first.",
      recap: "1/xⁿ = x⁻ⁿ, √x = x^(1/2) and 1/√x = x^(−1/2). "
        + "3/x² = 3x⁻², and its derivative 3(−2)x⁻³ = −6/x³. "
        + "Reducing the negative exponent means subtracting : −2 − 1 = −3 from it, not −1.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Power rule",
        en: 'Power rule',
        text: "For f(x)=xⁿ, the derivative is n x^(n−1) wherever the rule is valid. Multiply by the original exponent and reduce the exponent by one. For a general real exponent we use x>0; other domains and endpoints depend on the particular exponent.",
      },
      {
        term: "Product rule",
        en: 'Product rule',
        text: '‎(f g)′ = f′ g + f g′‎. '
          + "Differentiate the first and leave the second, then leave the first and differentiate the second, then add. "
          + "And note that it is not f′ g′; This is the most famous error in the lesson and has a reason that is explained in the derivation below.",
      },
      {
        term: "Quotient rule",
        en: 'Quotient rule',
        text: '‎(f/g)′ = (f′ g − f g′)/g²‎. '
          + "The order is important because the subtraction is not commutative: the numerator begins with the derivative of the numerator multiplied by the denominator. "
          + "The denominator is squared and is not left as it is.",
      },
      {
        term: "Chain rule",
        en: 'Chain rule',
        text: "The derivative of f(g(x)) is f′(g(x)) · g′(x). "
          + "Differentiate the external, keep the internal the same, then multiply by the derivative of the internal. "
          + "The last factor is the one that is often forgotten, and neglecting it gives a result that seems reasonable but is wrong.",
      },
    ],
    relations: [
      {
        formula: "(xⁿ)′ = n x^(n−1)",
        name: "force",
        note: "Suitable for negative and fractional exponents after rewriting.",
      },
      {
        formula: "(f g)′ = f′ g + f g′",
        name: "The goats",
        note: "Two terms are sums, not the product of two derivatives.",
      },
      {
        formula: "(f / g)′ = (f′ g − f g′) / g²",
        name: "Division",
        note: "An ordered subtraction, and the denominator is squared.",
      },
      {
        formula: "(f(g(x)))′ = f′(g(x)) · g′(x)",
        name: "Series",
        note: "Don't forget the last factor: the inner derivative.",
      },
    ],
    derivation: {
      title: "Why is the derivative of the product not the product of the two derivatives?",
      intro: "This is every student's first intuition, and therefore deserves an honest response, not just a correction.",
      steps: [
        {
          do: "Try f(x) = x and g(x) = x, their predecessors are x² and its derivative is 2x.",
          why: "A counterexample is the shortest way to overthrow a proposed rule, and it does not require proof.",
        },
        {
          do: "But f′ g′ = 1 × 1 = 1, which is only equal to 2x at one point.",
          why: "The proposed rule fell. The remaining question is: Why was the intuition wrong in the first place?",
        },
        {
          do: "Consider a rectangle with lengths f and g: with area f g. "
            + "If the two lengths increase slightly, the area increases with two strips: one Δf × g and the other f × Δg.",
          why: "The increase in product comes from two sides, not from one side: the first changes while the second remains, and vice versa.",
        },
        {
          do: "Divide the increase by Δx and take the limit: f′ g + f g′ remains, "
            + "The product of the two increments disappears because it is small of the second order.",
          why: "The terms in the base are the two bars, and multiplying the two derivatives corresponds to the small angle "
            + "That fades away alone. Hence the addition, not the multiplication.",
        },
      ],
    },
  },

  visual: {
    title: "Choose a differentiation rule from the outer operation",
    figure: {
      svg: figure,
      caption: "The outer operation is the last thing you do if you substitute a number into the function. "
        + "In (2x + 5)⁴, it is added first and then raised to the exponent, so the outer is the exponent, and the base is the base of the chain.",
      alt: "Decision tree. At the top is a box containing a question about the external operation, from which four lines branch "
        + "into four boxes. The first is addition or subtraction, so differentiate each term. The second is multiplication by the product rule. "
        + "The third is division, so the rule of division. The fourth is a raised parenthesis to an exponent at the base of the chain. "
        + "Below it is a line that defines the external operation as the last thing you would do if you substituted a number.",
    },
    table: {
      caption: "From structure to rule: comparative examples",
      head: ["Function", "External process", "The rule", "Derived"],
      rows: [
        ['x⁵ + 2x', "Plural", "Derive each term", '5x⁴ + 2'],
        ['x² (x + 1)', "Hit", "The goats", '2x(x + 1) + x²'],
        ['(x + 1) / x²', "Divide", "Division", '(x² − (x + 1)(2x)) / x⁴'],
        ['(x + 1)⁵', "Raise an exponent", "Series", '5(x + 1)⁴ · 1'],
        ['(x² + 1)⁵', "Raise an exponent", "Series", '5(x² + 1)⁴ · 2x'],
      ],
    },
    reading: "Compare the last two rows: the shape is the same, the derivative is different, and the whole difference is in the inner derivative. "
      + "In the first, the inner derivative is 1, and its effect does not appear, and in the second, 2x, so it appears. "
      + "Whoever memorizes the first row as a rule will inevitably make a mistake in the second.",
  },

  guided: {
    start: "Before you write a letter, ask: If I replace x = 2, what is the last operation I perform? "
      + "If it is plural, differentiate each term separately. If it is multiplication or division, use its rule. "
      + "If it is an exponent raised by a magnitude other than x alone, then it is a series. "
      + "You may need two rules in one problem, so always start with the external ones and then work your way down to the internal ones.",
    workedExamples: [
      {
        title: "Example 1 · Product rule",
        task: "Find f′(1) where f(x) = (3x² + 1)(x³ − 2).",
        steps: [
          {
            do: "The external operation is multiplication in parentheses, so the rule is the product rule.",
            why: "If you substituted a number, you would calculate the parentheses and then multiply them, as multiplication is the last thing you do.",
          },
          {
            do: "Name f = 3x² + 1 and g = x³ − 2, then f′ = 6x and g′ = 3x².",
            why: "Naming the two parts prevents confusion when substituting, and is a step worth writing down rather than memorizing mentally.",
          },
          {
            do: "Apply: f′g + fg′ = 6x(x³ − 2) + (3x² + 1)(3x²).",
            why: "Two sum terms: the first by the differentiation of the first, the second by the differentiation of the second, and there is no third for them.",
          },
          {
            do: "Replace x = 1: 6(1)(1 − 2) + (3 + 1)(3) = −6 + 12 = 6.",
            why: "Substitution after symbolic simplification is less error-prone than substitution at each step.",
          },
        ],
        answer: "f′(1) = 6",
      },
      {
        title: "Example 2 · String rule",
        task: "Find f′(−2) where f(x) = (2x + 5)⁴.",
        steps: [
          {
            do: "The inner one is g = 2x + 5 and the outer one is raised to the fourth power.",
            why: "If you substitute a number, you add first and then raise, then the raising is external.",
          },
          {
            do: "Derive the outer and keep the inner : 4(2x + 5)³.",
            why: "The power rule is applied to the entire expression as if it were a single variable, in this step only.",
          },
          {
            do: "Multiply by the internal derivative g′ = 2: f′ = 8(2x + 5)³.",
            why: "This factor is what distinguishes the series from the power rule alone, and neglecting it reduces the result by half here.",
          },
          {
            do: "Replace x = −2: 2(−2) + 5 = 1 with f′ = 8(1)³ = 8.",
            why: "Calculating the internals first simplifies the exponent to 1³ and avoids unnecessarily large numbers.",
          },
        ],
        answer: "f′(−2) = 8",
      },
    ],
    skipped: [
      {
        q: "Do I always need the division rule, or can I do without it?",
        a: "It can often be dispensed with. Write f/g in the form f · g⁻¹ and use the multiplication with the string, "
          + "The output is one. Some students find this less likely to cause subtraction order errors. "
          + "But the exam may ask for the rule explicitly, so know it anyway.",
      },
      {
        q: "How do I handle nested parentheses like ((x² + 1)³ + 2)⁴?",
        a: "Apply the series once for each layer, from outside to inside, and multiply the results. "
          + "Differentiate the fourth exponent first, keeping the inside, and then differentiate the inside with the series again. "
          + "The rule does not change no matter how many layers there are, but the product becomes longer.",
      },
      {
        q: "Why is the denominator squared in the division rule?",
        a: "Because it results from writing f/g = f · g⁻¹ and applying the product and the series: "
          + "The derivative of g⁻¹ is −g⁻² g′, so g² appears in the denominator when the two terms are unified. "
          + "Square is a mathematical result, not a memorized convention.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'power',
      family: "The first type is the power base",
      aim: "You subtract the exponent by a factor and subtract it by one.",
      objectives: [0],
      prompt: "Find f′(2) where f(x) = x⁵.",
      unit: "Number",
      answer: 80,
      tolerance: 0.01,
      solution: "f′(x) = 5x⁴, and at x = 2: 5 × 16 = 80.",
      commonErrors: [
        { value: 32, why: "You calculated f(2) = 2⁵ = 32, which is the value of the function, not its derivative." },
        { value: 16, why: "You decreased the exponent and forgot to subtract it by a factor. 2⁴ = 16, then you must multiply by 5." },
        { value: 10, why: "You lowered the power and multiplied it by x without raising it to the new power : 5 × 2 = 10." },
      ],
    },
    {
      id: 'product',
      family: "The second type is the product rule",
      aim: "Add two terms and do not multiply two derivatives.",
      objectives: [1],
      prompt: "Find f′(2) where f(x) = (x² + 1)(x − 3).",
      unit: "Number",
      answer: 1,
      tolerance: 0.01,
      solution: '‎f′ = 2x(x − 3) + (x² + 1)(1) = 3x² − 6x + 1‎. '
        + "And at x = 2: 12 − 12 + 1 = 1.",
      commonErrors: [
        { value: 4, why: "You multiply the two derivatives: 2x × 1 = 4 by x = 2. "
          + "The product rule is the sum of two terms, not the product of two derivatives. "
          + "The counterexample in the derivation above shows why." },
        { value: -5, why: "You calculated f(2) = 5 × (−1) = −5, which is the value of the function, not its derivative." },
        { value: 13, why: "You made a mistake in the sign inside 2x(x − 3) and added 12 instead of subtracting it." },
      ],
    },
    {
      id: 'quotient',
      family: "The third type is the division rule",
      aim: "Arrange the subtraction in the numerator and square the denominator.",
      objectives: [1],
      prompt: "Find f′(3) where f(x) = (x + 1)/(x − 1). Write the result as a signed decimal number.",
      unit: "Number",
      answer: -0.5,
      tolerance: 0.01,
      solution: '‎f′ = ((1)(x − 1) − (x + 1)(1))/(x − 1)² = −2/(x − 1)²‎. '
        + "And at x = 3: −2/4 = −0.5.",
      commonErrors: [
        { value: 0.5, why: "You reversed the order of subtraction in the numerator and wrote f g′ − f′ g. "
          + "The correct order begins with the derivative of the numerator multiplied by the denominator, and subtraction is not commutative." },
        { value: -1, why: "You did not square the denominator, so you divided by (3 − 1) = 2 instead of 4." },
        { value: 2, why: "You calculated f(3) = 4/2 = 2, which is the value of the function, not its derivative." },
      ],
    },
    {
      id: 'chain',
      family: "Fourth style · Chain rule",
      aim: "Multiply by the internal derivative and do not forget it.",
      objectives: [2],
      prompt: "Find f′(−2) where f(x) = (2x + 5)⁴.",
      unit: "Number",
      answer: 8,
      tolerance: 0.01,
      solution: '‎f′ = 4(2x + 5)³ × 2 = 8(2x + 5)³‎. '
        + "When x = −2 is 2x + 5 = 1, the result is 8 × 1 = 8.",
      commonErrors: [
        { value: 4, why: "You neglected the inner derivative. 4(1)³ = 4, and it is correct to multiply it by g′ = 2. "
          + "This factor is the whole difference between the power rule and the chain rule." },
        { value: 1, why: "You calculated f(−2) = 1⁴ = 1, which is the value of the function, not its derivative." },
        { value: 32, why: "You multiplied by 2 twice, or used the exponent 4 without reducing it to 3." },
      ],
    },
    {
      id: 'negative-exponent',
      family: "Type 5: Negative exponent",
      aim: "Rewrites exponentially before applying the rule.",
      objectives: [0],
      prompt: "Find f′(1) where f(x) = 3/x². and sign the result.",
      unit: "Number",
      answer: -6,
      tolerance: 0.01,
      solution: "Rewrite: f(x) = 3x⁻². "
        + "So f′ = 3(−2)x⁻³ = −6x⁻³ = −6/x³, and at x = 1 it equals −6.",
      commonErrors: [
        { value: 6, why: "You neglected the negative sign resulting from lowering the exponent −2. "
          + "The function 3/x² is decreasing at x = 1, so its derivative is inevitably negative." },
        { value: 3, why: "You calculated f(1) = 3, which is the value of the function, not its derivative." },
        { value: -2, why: "You neglected the parameter 3 and derived x⁻² alone." },
      ],
    },
  ],
};
