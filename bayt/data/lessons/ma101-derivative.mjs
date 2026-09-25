/* درس بيت الفؤاد · MA 101 · المشتقة معدلَ تغيّر. */

/* الرسم: القاطع والمماس على المنحنى نفسه.
   الفكرة أن المماس ليس شيئًا جديدًا، بل هو ما يؤول إليه القاطع. */
const figure = `<svg viewBox="0 0 480 300" role="img" aria-labelledby="fig-deriv-title" class="bayt-svg">`
  + `<title id="fig-deriv-title">A quadratic curve with a secant between two points and a tangent at the first point</title>`
  + `<line x1="40" y1="270" x2="450" y2="270" stroke="#284955" stroke-width="2"/>`
  + `<line x1="60" y1="290" x2="60" y2="20" stroke="#284955" stroke-width="2"/>`
  + `<text x="436" y="292" font-size="15" fill="#284955">x</text>`
  + `<text x="38" y="32" font-size="15" fill="#284955">y</text>`
  + `<polyline points="60,270 120,263 180,244 240,211 300,166 360,107 420,36" `
    + `fill="none" stroke="#105c78" stroke-width="3"/>`
  /* القاطع يمر بالنقطتين، والمماس يلمس الأولى وحدها. */
  + `<line x1="144" y1="267" x2="336" y2="143" stroke="#c69748" stroke-width="2"/>`
  + `<line x1="132" y1="265" x2="288" y2="197" stroke="#c0392b" stroke-width="3"/>`
  + `<circle cx="180" cy="244" r="6" fill="#153748"/>`
  + `<circle cx="300" cy="166" r="6" fill="#566f7a"/>`
  + `<text x="186" y="262" font-size="14" fill="#284955">(1, 1)</text>`
  + `<text x="306" y="184" font-size="14" fill="#566f7a">(2, 4)</text>`
  /* النص العربي في SVG: end يضع x عند الحافة اليسرى والنص يمتد يمينًا. */
  + `<text x="344" y="136" font-size="15" fill="#c69748" text-anchor="end">Boycott</text>`
  + `<text x="296" y="212" font-size="15" fill="#c0392b" text-anchor="end">Tangent</text>`
  + `<text x="70" y="60" font-size="13" fill="#566f7a" text-anchor="start">Move the second point toward the first:</text>`
  + `<text x="70" y="78" font-size="13" fill="#566f7a" text-anchor="start">the secant slope approaches the tangent slope.</text>`
  + `</svg>`;

export default {
  course: 'ma101',
  topic: 'derivative',

  objectives: [
    "Calculate a derivative at a point from its limit definition.",
    "Interpret a derivative as tangent slope and instantaneous rate of change.",
    "Differentiate between the average rate of change over a interval and the instantaneous rate at a point.",
  ],

  boundaries: [
    "Differentiation rules (power, product, quotient and chain) come later. This lesson uses the definition.",
    "Higher derivatives are not in this lesson.",
    "We do not prove here that differentiability necessitates continuity; We remember it and use it.",
    "The derivation of trigonometric and exponential functions is not here.",
  ],

  prerequisites: [
    {
      title: "the limit calculation gives the indeterminate form 0/0",
      why: "The difference quotient always gives 0/0 at h = 0; This is not an obstacle, but rather the nature of the issue.",
      recap: "When 0/0 appears, do not stop: simplify the expression first, then substitute. "
        + "In this lesson, simplification always means eliminating h from the numerator and denominator after expanding the parentheses. "
        + "It is legitimate because h ≠ 0 is inside the limit.",
      href: '/semester-1/math/limits/',
      hrefLabel: "Study endings",
    },
    {
      title: "Expanding algebraic expressions",
      why: "The first step in every derivative of the definition is to decode f(a + h), and a decode error ruins everything after it.",
      recap: "(a + h)² = a² + 2ah + h² — and the middle term 2ah are what are often forgotten. "
        + "And (a + h)³ = a³ + 3a²h + 3ah² + h³. "
        + "And in fractions : 1/(a + h) − 1/a = (a − (a + h))/(a(a + h)) = −h/(a(a + h)) by unifying the denominators.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Average rate of change",
        en: 'Average rate of change',
        text: "The amount of change of f divided by the amount of change of x between two points : (f(b) − f(a))/(b − a). "
          + "It is the slope of the secant line connecting the two points, and it describes the entire interval, not a specific moment.",
      },
      {
        term: "The derivative at a point",
        en: 'Derivative at a point',
        text: "the limit of the average rate of change when the two points converge: "
          + '‎f′(a) = lim(h→0) (f(a + h) − f(a))/h‎. '
          + "It is a single number that describes the behavior of the function at a alone, not over an interval.",
      },
      {
        term: "Difference quotient",
        en: 'Difference quotient',
        text: "The expression [f(a+h)−f(a)]/h measures the average rate of change over a nonzero increment h. Substitution of h=0 makes this quotient undefined. The derivative, when it exists, is its limit as h approaches zero.",
      },
      {
        term: "Tangent",
        en: 'Tangent line',
        text: "The line whose slope is f′(a) and passes through the point (a, f(a)), and its equation "
          + '‎y − f(a) = f′(a)(x − a)‎. '
          + "Its definition is not that it “touches the curve at one point”; It may intersect it at other points and remain tangent at a.",
      },
      {
        term: "Differentiability",
        en: 'Differentiability',
        text: "Differentiability at a means the derivative exists there as a finite two-sided limit. Differentiability implies continuity. The converse fails: |x| is continuous at 0, but its one-sided slopes are −1 and +1, so it is not differentiable there.",
      },
    ],
    relations: [
      {
        formula: "f′(a) = lim(h→0) (f(a + h) − f(a)) / h",
        name: "Definition of the limit",
        note: "This is the reference from which all the rules for the following lesson are derived.",
      },
      {
        formula: 'average rate = (f(b) − f(a)) / (b − a)',
        name: "Average over a interval",
        note: "Needs two points; The derivative requires one point.",
      },
      {
        formula: 'y − f(a) = f′(a)(x − a)',
        name: "Tangent equation",
        note: "The slope is from the derivative, and the point is from the function itself.",
      },
      {
        formula: 'v(t) = s′(t)',
        name: "Instantaneous speed",
        note: "derivative of position with respect to time; This is the physical reading of the derivative.",
      },
    ],
    derivation: {
      title: "Why don't we put h = 0 directly, and why is it correct to delete after simplification",
      intro: "The question that the explanation usually jumps to: If h is going to be zero, why not set it to zero from the beginning?",
      steps: [
        {
          do: "Put h = 0 into (f(a + h) − f(a))/h and you get 0/0.",
          why: "The denominator is null, and division by zero is undefined. Direct substitution is always closed here, not sometimes.",
        },
        {
          do: "Take f(x) = x² when a = 3: is the numerator (3 + h)² − 9 = 6h + h².",
          why: "Expanding the parentheses showed that each term in the numerator has a factor h; This is not a coincidence, but the reason for the success of the method.",
        },
        {
          do: "Divide by h: (6h + h²)/h = 6 + h, and this is true for all h ≠ 0.",
          why: "The limit is taught that h is close to zero and not equal to it, so division by h is permissible within it.",
        },
        {
          do: "Take the limit of 6 + h at h → 0 and you get 6.",
          why: "After simplification, the expression became a polynomial, and substitution is legitimate. "
            + "the limit has not changed, but the form in which we calculate it has changed.",
        },
      ],
    },
  },

  visual: {
    title: "From secant to tangent",
    figure: {
      svg: figure,
      caption: "A secant connects two points on the curve, and a tangent describes one point. "
        + "As the second point creeps toward the first, the slope of the secant approaches the slope of the tangent.",
      alt: "Rising quadratic curve. It has two points: the first at one coordinate and one height, and the second at "
        + "Coordinate two and height four. A golden straight line that passes through both points together and is the secant. "
        + "A less inclined red straight line touches the first point alone, which is the tangent. "
        + "The slope of the red is smaller than the slope of the gold, and this is what the values become when the two points approach.",
    },
    table: {
      caption: "The difference quotient of f(x) = x² at a = 3 and h values gets smaller on both sides.",
      head: ['h', '(f(3 + h) − f(3)) / h', "Note"],
      rows: [
        ['1', '7', "A distant interrupter"],
        ['0.5', '6.5', "Approaching"],
        ['0.1', '6.1', "He gets closer"],
        ['0.01', '6.01', ''],
        ['0', "Undefined (0/0)", "Here the trick stops, and hence the limit"],
        ['−0.01', '5.99', "From the other side"],
        ['−0.1', '5.9', ''],
        ['−1', '5', "Far left secant"],
      ],
    },
    reading: "The middle column approaches 6 from both sides, and the middle row alone is worthless. "
      + "This is the same shape that you saw in the endings lesson: an intended value is present, and a period is deleted. "
      + "The derivative is not a new idea, but rather a limit applied to a specific expression.",
  },

  guided: {
    start: "Follow four fixed steps that do not change no matter how much the function changes: "
      + "Write f(a + h), subtract f(a) and simplify the numerator, divide by h and cancel, then substitute h = 0. "
      + "If h does not delete in the third step, see the expansion of the parentheses in the first step; "
      + "The numerator must have a factor of h in every term.",
    workedExamples: [
      {
        title: "Example 1 · is a quadratic function",
        task: "Find f′(3) where f(x) = x², from the definition.",
        steps: [
          {
            do: "Type f(3 + h) = (3 + h)² = 9 + 6h + h².",
            why: "A correct jaw is half the work; Neglecting the middle term 6h gives an incorrect derivative.",
          },
          {
            do: "Subtract f(3) = 9:, leaving the numerator 6h + h².",
            why: "The fixed term always goes away, leaving only what carries h. This makes the following division possible.",
          },
          {
            do: "Divide by h: (6h + h²)/h = 6 + h, by h ≠ 0.",
            why: "Within the limit h ≠ 0, division by it is permissible. This is where the condition is forgotten.",
          },
          {
            do: "Take the limit at h → 0: resulting 6.",
            why: "The expression has many limits, so substitution is legitimate. The resultant is the slope of the tangent at x = 3.",
          },
        ],
        answer: "f′(3) = 6",
      },
      {
        title: "Example 2 · is a rational function",
        task: "Find f′(2) where f(x) = 1/x, from the definition.",
        steps: [
          {
            do: "The numerator 1/(2 + h) − 1/2. unites the denominators : (2 − (2 + h))/(2(2 + h)) = −h/(2(2 + h)).",
            why: "The standardization of the denominators is what reveals the disappearing h factor; Without it, deletion is not possible.",
          },
          {
            do: "Divide by h: to result in −1/(2(2 + h)).",
            why: "Dividing by h means multiplying by 1/h, so h is removed from the numerator and the negative remains.",
          },
          {
            do: "Replace h = 0: −1/(2 × 2) = −0.25.",
            why: "The position after substitution is not non-existent, as substitution is legitimate. "
              + "The sign is negative because 1/x is decreasing at x = 2.",
          },
        ],
        answer: "f′(2) = −0.25",
      },
    ],
    skipped: [
      {
        q: "Why do we use h and not use points a and b and bring b closer to a?",
        a: "The two formulas are equivalent: put b = a + h and one converts to the other, "
          + "b → a becomes h → 0. "
          + "Rather, the h format was preferred because it makes the denominator a single letter that is easy to delete after simplification.",
      },
      {
        q: "Does the tangent touch the curve at only one point?",
        a: "No, this is a common and inaccurate description. The tangent to y = x³ at zero is the horizontal axis, and it intersects the curve "
          + "At that same point. A tangent is defined by the slope at a point, not by the number of intersection points.",
      },
      {
        q: "What does it mean for the derivative to be negative?",
        a: "The function is decreasing at that point: increasing x slightly decreases f(x). "
          + "In physical reading, it means movement in the negative direction. "
          + "The magnitude of the derivative says how fast, and the sign says where.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'from-definition',
      family: "The first type: derived from the definition",
      aim: "Perform all four steps on a quadratic function.",
      objectives: [0],
      prompt: "Find f′(5) from the definition, where f(x) = x².",
      unit: "Number",
      answer: 10,
      tolerance: 0.001,
      solution: "f(5 + h) = 25 + 10h + h², so the numerator after subtraction is 10h + h², "
        + "Dividing by h gives 10 + h, and the limit at h → 0 is 10.",
      commonErrors: [
        { value: 25, why: "You gave f(5) not f′(5). the first the height of the curve at 5, and the second its slope there." },
        { value: 5, why: "You wrote the point a itself. The derivative is another number that describes the slope, not the coordinate of the point." },
        { value: 2, why: "You wrote the exponent. The derivative of x² is 2x, and when x = 5 is equal to 10 not 2." },
      ],
    },
    {
      id: 'average-rate',
      family: "The second type is the average rate of change",
      aim: "You use two points and divide by the length of the interval.",
      objectives: [2],
      prompt: "What is the average rate of change of f(x) = x² over the interval from x = 1 to x = 4?",
      unit: "Number",
      answer: 5,
      tolerance: 0.001,
      solution: '‎(f(4) − f(1))/(4 − 1) = (16 − 1)/3 = 15/3 = 5‎. '
        + "This is the slope of the secant between the two points, not the slope of the tangent at either point.",
      commonErrors: [
        { value: 15, why: "You forgot to divide by the interval. The difference in f alone is not modified; "
          + "The rate is a ratio between two changes." },
        { value: 8, why: "You calculated the instantaneous derivative at x = 4. The average describes the entire interval, "
          + "The derivative describes one point, and they are not equal here." },
        { value: 2, why: "You calculated the instantaneous derivative at x = 1 instead of the average over the interval." },
      ],
    },
    {
      id: 'polynomial-point',
      family: "The third type is a polynomial with two terms",
      aim: "Track every term, and do not neglect the linear term.",
      objectives: [0],
      prompt: "Find f′(2) from the definition, where f(x) = 3x² − 2x.",
      unit: "Number",
      answer: 10,
      tolerance: 0.001,
      solution: '‎f(2 + h) = 3(4 + 4h + h²) − 2(2 + h) = 12 + 12h + 3h² − 4 − 2h‎. '
        + "Subtract f(2) = 8 and you get 10h + 3h², divide by h and you get 10 + 3h. "
        + "And the limit is 10.",
      commonErrors: [
        { value: 8, why: "You are given f(2) = 3(4) − 4 = 8, which is the value of the function, not its derivative." },
        { value: 12, why: "You neglected the term −2x., its derivative −2 is subtracted from 12 to give 10." },
        { value: 4, why: "You calculated the average rate of change from 0 to 2: (8 − 0)/2 = 4, "
          + "It is a conclusive slope, not a tangent slope." },
      ],
    },
    {
      id: 'velocity',
      family: "Fourth type: Physical reading",
      aim: "The derivative is translated into instantaneous unit velocity.",
      objectives: [1],
      prompt: "The position of an object in meters s(t) = 5t² and the time in seconds. What is its instantaneous speed at t = 3 s?",
      unit: 'm/s',
      answer: 30,
      tolerance: 0.01,
      solution: "Instantaneous speed s′(t). from definition : s(3 + h) − s(3) = 30h + 5h², "
        + "Dividing by h gives 30 + 5h, and the limit is 30 m/s.",
      commonErrors: [
        { value: 45, why: "You gave the position s(3) = 45 m, not the speed. "
          + "Position is in meters and speed is in meters per second, and their units are different." },
        { value: 15, why: "You calculated s(3)/3 = 15, which is the average speed from t = 0 to t = 3, "
          + "No instantaneous speed at t = 3. average describes a trip, instantaneous describes an instant." },
        { value: 10, why: "You wrote the parameter 10 from s′(t) = 10t without multiplying it by t = 3." },
      ],
    },
    {
      id: 'reciprocal',
      family: "The fifth type is a rational function with a negative sign",
      aim: "It unifies the maqamat and preserves the sign.",
      objectives: [0],
      prompt: "Find f′(2) from the definition, where f(x) = 1/x. Write the result as a signed decimal number.",
      unit: "Number",
      answer: -0.25,
      tolerance: 0.002,
      solution: "Numerator 1/(2 + h) − 1/2 = −h/(2(2 + h)). "
        + "Divide by h and you get −1/(2(2 + h)), and when h = 0 equals −1/4 = −0.25.",
      commonErrors: [
        { value: 0.25, why: "You ignored the negative sign. The function 1/x is decreasing at x = 2, "
          + "Its derivative is definitely negative; The sign comes from 2 − (2 + h) = −h." },
        { value: 0.5, why: "You are given f(2) = 1/2, which is the value of the function, not its slope." },
        { value: -0.5, why: "You forgot to square the denominator. Output −1/(2 × 2) not −1/2." },
      ],
    },
  ],
};
