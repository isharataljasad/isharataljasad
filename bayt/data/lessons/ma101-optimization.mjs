/* درس بيت الفؤاد · MA 101 · التحسين. */

/* الرسم: مسألة السياج بجانب جدار.
   اخترناها لأن القيد فيها مرئي: ضلع لا يحتاج سياجًا، وهذا وحده يغيّر الجواب. */
const figure = `<svg viewBox="0 0 460 240" role="img" aria-labelledby="fig-opt-title" class="bayt-svg">`
  + `<title id="fig-opt-title">A rectangle adjacent to a wall, three sides of which are fences and the fourth is the wall</title>`
  + `<line x1="70" y1="60" x2="390" y2="60" stroke="#153748" stroke-width="7"/>`
  + `<text x="264" y="46" font-size="15" fill="#153748" text-anchor="middle">The wall</text>`
  /* الأضلاع الثلاثة التي تحتاج سياجًا. */
  + `<line x1="90" y1="60" x2="90" y2="180" stroke="#c69748" stroke-width="4"/>`
  + `<line x1="90" y1="180" x2="370" y2="180" stroke="#c69748" stroke-width="4"/>`
  + `<line x1="370" y1="60" x2="370" y2="180" stroke="#c69748" stroke-width="4"/>`
  + `<rect x="90" y="60" width="280" height="120" fill="#cfe6ef" opacity="0.45"/>`
  + `<text x="230" y="128" font-size="15" fill="#105c78" text-anchor="middle">Space</text>`
  + `<text x="230" y="202" font-size="16" fill="#284955" text-anchor="middle">x</text>`
  + `<text x="76" y="126" font-size="16" fill="#284955" text-anchor="middle">y</text>`
  + `<text x="384" y="126" font-size="16" fill="#284955" text-anchor="middle">y</text>`
  + `<text x="230" y="228" font-size="13" fill="#566f7a" text-anchor="middle">The fence covers only three sides, so the constraint is x + 2y</text>`
  + `</svg>`;

export default {
  course: 'ma101',
  topic: 'optimization',

  objectives: [
    "The objective function is written in one variable using the constraint equation.",
    "Determine the feasible domain and check its endpoints as well as its critical points.",
    "Justify whether the critical point is maximum or minimum instead of assuming that it is.",
  ],

  boundaries: [
    "Optimization with two or more variables and Lagrange multipliers are not in this lesson.",
    "Optimization under constraints of inequalities (linear programming) is out of scope.",
    "Numerical methods for optimization are not here.",
    "Optimization problems that require trigonometric or exponential functions are not in this lesson.",
  ],

  prerequisites: [
    {
      title: "Derivation rules",
      why: "After building the model, the automated step remains: differentiate and equal to zero. A derivation error corrupts a correct model.",
      recap: "The force rule is (xⁿ)′ = n x^(n−1), and the product rule is (fg)′ = f′g + fg′. "
        + "The objective functions in this lesson are mostly polynomials, so the differentiation is straightforward after expanding the parentheses. "
        + "Expanding the bracket before derivation is easier than applying the product to most problems.",
      href: '/semester-1/math/rules/',
      hrefLabel: "Study the rules of derivation",
    },
    {
      title: "Solve a quadratic equation",
      why: "Equating the derivative to zero gives a quadratic equation in most of the problems in this lesson, and it may have two roots.",
      recap: "By factoring : x² − 8x + 12 = (x − 2)(x − 6) = 0, the roots are 2 and 6. "
        + "Or by common law x = (−b ± √(b² − 4ac)) / 2a. "
        + "When two roots appear, both are not necessarily acceptable: geometric constraints often exclude one or the other.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Objective function",
        en: 'Objective function',
        text: "The quantity to be maximized or minimized: area, volume, cost, or distance. "
          + "It is first written as it comes naturally, even with two variables, and then reduced to one variable.",
      },
      {
        term: "Constraint",
        en: 'Constraint',
        text: "An equation linking the two variables, its source is given in the question: the length of an available fence, or a fixed perimeter, "
          + "Or required volume. "
          + "It is your only tool for deleting a variable from the objective function, so derivation is not valid before using it.",
      },
      {
        term: "Critical point",
        en: 'Critical point',
        text: "A critical number c lies in the domain and satisfies f′(c)=0 or has an undefined derivative. It is a candidate for an extremum, not a guarantee. For example, x³ has a stationary point at 0 but no local maximum or minimum there.",
      },
      {
        term: "Feasible domain",
        en: 'Feasible domain',
        text: "Values that have meaning in the problem, not in algebra alone: lengths are positive, "
          + "The cut piece is smaller than half the side, and so on. "
          + "Its definition is not formal: it is what excludes unacceptable roots and identifies the parties that must be examined.",
      },
      {
        term: "Second derivative test",
        en: 'Second derivative test',
        text: "Suppose f′(c)=0 and the second derivative exists near c. If f″(c)>0, f has a local minimum at c; if f″(c)<0, it has a local maximum. If f″(c)=0, this test is inconclusive. Check the first derivative on both sides or use another argument.",
      },
    ],
    relations: [
      {
        formula: "f′(c) = 0 at inner limit",
        name: "Critical point condition",
        note: "A necessary, not sufficient, condition: every internal limit is critical, and not every critical limit is an limit.",
      },
      {
        formula: "f″(c) < 0 ⟹ maximum,  f″(c) > 0 ⟹ minor",
        name: "Second derivative test",
        note: "Faster than checking sign when the second derivative is smoothed out.",
      },
      {
        formula: "Compare f at critical points and at both ends of the range",
        name: "The absolute limit",
        note: "On a closed interval, the absolute limit is one of these values.",
      },
    ],
    derivation: {
      title: "Why solving f′(x) = 0 is not enough",
      intro: "The saved step is “differentiate and equal to zero,” which gives an incorrect answer in two common cases.",
      steps: [
        {
          do: "Take f(x) = x² on the interval [1, 4] and ask for the largest value.",
          why: "A small example reveals the problem more clearly than general words.",
        },
        {
          do: "The derivative 2x zeros at x = 0, which is completely outside the interval.",
          why: "The memorized method gives nothing here, yet the function definitely has the largest value.",
        },
        {
          do: "Examine the terminals : f(1) = 1 and f(4) = 16, the maximum is 16 at the terminal.",
          why: "The function is increasing over the entire interval, with the largest value at the far right, "
            + "The derivative does not exist there, nor does it need to exist.",
        },
        {
          do: "The second case: a root of the derivative lies outside the geometrically permissible range, or on its edge, giving a zero value.",
          why: "As in the box problem below: The derivative has two roots, one of which makes the magnitude zero. "
            + "Algebra does not know that the length is not negative nor that the volume is zero; You are the one who knows.",
        },
      ],
    },
  },

  visual: {
    title: "Use the constraint before differentiating",
    figure: {
      svg: figure,
      caption: "A rectangular space next to a wall. Only three sides need a fence, "
        + "The constraint is x + 2y = L, not 2x + 2y = L., and this difference alone changes the optimal dimensions.",
      alt: "A rectangle adjacent at the top to a thick line representing a wall. "
        + "The other three sides are drawn in the color of the fence: the left and right sides are each of length y, "
        + "The bottom one has a length of x., and inside the rectangle is the word space. "
        + "Below it is a line indicating that the fence covers only three sides, so the entry is x plus double y.",
    },
    table: {
      caption: "Steps to the solution, and what goes wrong at each step",
      head: ["Step", "What you do", "Common mistake here"],
      rows: [
        ['1', "Draw and label the variables", "Derivation before drawing, so the restriction is lost"],
        ['2', "Write the objective function", "Confusing goal and restriction"],
        ['3', "Write the constraint equation", "Count the side of the wall within the fence"],
        ['4', "Delete a variable and write the target with one variable", "Differentiation with two variables together"],
        ['5', "Specify the allowed field", "Skip this step entirely"],
        ['6', "Differentiate and equal to zero", "Accept each root without checking"],
        ['7', "Check critical points and terminals", "Just the critical point"],
        ['8', "Answer what you are asked", "Give x space allowance, or vice versa"],
      ],
    },
    reading: "Steps five and seven are the ones that are skipped the most and are the ones that lead to the most losing grades. "
      + "The eighth step deserves a pause: many mathematically correct solutions answer another question. "
      + "Dimension is given where space is required. Read the question again before writing the answer.",
  },

  guided: {
    start: "Draw the shape and label its dimensions in letters before any calculations. Then write two separate lines: "
      + "The line “I want to maximize/minimize..” is the goal function, and the line “It is given that..” which is the constraint. "
      + "Then use the constraint to delete a variable. Then write the domain that is explicitly allowed by the inequality. "
      + "And then just derive. Finally, return to the question: What exactly was asked?",
    workedExamples: [
      {
        title: "Example 1 · The largest area with a fixed perimeter",
        task: "A rectangle with perimeter 40 m. is its largest possible area?",
        steps: [
          {
            do: "Target: A = x y. and constraint: 2x + 2y = 40, i.e. y = 20 − x.",
            why: "Separating the goal from the restriction prevents confusion between them, which is the most common mistake of this type.",
          },
          {
            do: "Replace : A(x) = x(20 − x) = 20x − x².",
            why: "The function now has one variable, and this is the condition for differentiation. The derivation is not valid before this step.",
          },
          {
            do: "The range : 0 < x < 20 because both lengths are positive.",
            why: "The field determines what roots we accept and what edges we examine. Skipping it is the root of most mistakes.",
          },
          {
            do: "Derive : A′ = 20 − 2x = 0 from x = 10, and A″ = −2 < 0 is maximum.",
            why: "The second derivative is negative and constant, so the point is definitely maximum and there is no need to examine the edges here; "
              + "If left untested, it would be a claim without evidence.",
          },
          {
            do: "Area A = 10 × 10 = 100 m².",
            why: "The question is about space, not distance, so the answer is 100, not 10. "
              + "Note that the optimal shape is a square, and this is a general result for a fixed perimeter.",
          },
        ],
        answer: 'A = 100 m²',
      },
      {
        title: "Example 2 · An open box from a square plate",
        task: "A square plate with side 12 cm. is cut from its corners with squares of side x, then the ends are folded. "
          + "Which x gives the largest volume?",
        steps: [
          {
            do: "Dimensions of base (12 − 2x) in (12 − 2x), height x, "
              + "The volume is V = x(12 − 2x)².",
            why: "It is cut from both ends together, so the decrease is 2x, not x., and this is a frequent error.",
          },
          {
            do: "The range: 0 < x < 6, because 12 − 2x must remain positive.",
            why: "At x = 6 the base is non-existent and the volume is non-existent; This is a limit, not a solution.",
          },
          {
            do: "Decompose and differentiate : V = 4x³ − 48x² + 144x, so V′ = 12x² − 96x + 144 = 12(x − 2)(x − 6).",
            why: "Derivation before derivation is easier than the product rule here, and there are fewer errors.",
          },
          {
            do: "The two roots are 2 and 6., and the second is the end of the domain and gives V = 0, so it is excluded.",
            why: "Algebra gave two roots, and geometry excluded one. "
              + "If 6 had been accepted, the answer would have been the smallest possible volume, not the largest.",
          },
          {
            do: "So x = 2 cm, and the volume is 2 × 8² = 128 cm³.",
            why: "Examination of both ends confirms: at x → 0 and at x → 6 the volume becomes zero. "
              + "The internal value is the greatest.",
          },
        ],
        answer: 'x = 2 cm, V = 128 cm³',
      },
    ],
    skipped: [
      {
        q: "Why does the square always give an answer in constant perimeter problems?",
        a: "Because the function A = x(P/2 − x) is a parabola whose vertex is at the midpoint of its roots, "
          + "It is the place where the two dimensions are equal. "
          + "This is a result of the complete circumference. As for a wall that relieves you of a side, the answer is not square. "
          + "As in the issue of the fence above.",
      },
      {
        q: "When do I use the second derivative test and when do I examine the edges?",
        a: "The second derivative determines whether the point is maximum or minimum **locally**. "
          + "If the domain is a closed interval, then the absolute limit may be at one limit. "
          + "It is necessary to compare the values of the function at critical points and at both ends. "
          + "If the field is open and the function leads to zero at both ends, then the critical point is what is required.",
      },
      {
        q: "What if the derivative gives a negative root?",
        a: "Eliminate it if it represents length or volume, as these are inherently positive quantities. "
          + "This is the meaning of the permissible field: algebra does not know that the side is not negative, "
          + "You are the one who imposes this condition. Do not drop the root without mentioning the reason for dropping it.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'max-area',
      family: "Type 1: The largest area with a fixed perimeter",
      aim: "You use the constraint to delete a variable, and answer what you were asked about.",
      objectives: [0],
      prompt: "A rectangle with perimeter 40 m. is its largest possible area in square metres?",
      unit: 'm²',
      answer: 100,
      tolerance: 0.5,
      solution: "y = 20 − x at A = 20x − x², A′ = 20 − 2x = 0 at x = 10. "
        + "The A″ = −2 < 0 is a maximum, and the space is 10 × 10 = 100 m².",
      commonErrors: [
        { value: 10, why: "You were given dimension, not space. Question about the area in square metres, "
          + "Complete the last step by multiplying the two dimensions." },
        { value: 400, why: "You treated 40 as a side of the square. is the ocean, "
          + "The side is 40/4 = 10 and the area is 100." },
        { value: 40, why: "You wrote the given perimeter instead of the required area." },
      ],
    },
    {
      id: 'min-sum-squares',
      family: "The second type: The smallest sum of two squares",
      aim: "Justify that the point is a minimum, not a maximum.",
      objectives: [2],
      prompt: "Two positive numbers whose sum is 12. What is the smallest value of the sum of their squares?",
      unit: "Number",
      answer: 72,
      tolerance: 0.5,
      solution: "y = 12 − x to S = x² + (12 − x)² = 2x² − 24x + 144. "
        + "S′ = 4x − 24 = 0 is at x = 6, and S″ = 4 > 0 is minor. "
        + "The total is 36 + 36 = 72.",
      commonErrors: [
        { value: 144, why: "You squared the sum and calculated 12². "
          + "The sum of the two squares is not the square of the sum : (a + b)² = a² + 2ab + b²." },
        { value: 36, why: "You calculated the square of one number and neglected the other. The sum of the two squares is required." },
        { value: 6, why: "You gave the value of the number, not the sum of the squares." },
      ],
    },
    {
      id: 'box-cut',
      family: "The third type: Two roots, one of which is rejected",
      aim: "It excludes the root that falls outside the permitted range.",
      objectives: [1],
      prompt: "A square plate with sides 12 cm, whose corners are cut with squares with sides x, then folded to form an open box. "
        + "What value of x in centimeters gives the largest volume?",
      unit: 'cm',
      answer: 2,
      tolerance: 0.05,
      solution: "V = x(12 − 2x)² and V′ = 12(x − 2)(x − 6), the roots are 2 and 6. "
        + "The range is 0 < x < 6, so 6 is a term that gives zero volume. So x = 2 cm.",
      commonErrors: [
        { value: 6, why: "You accepted the other root without checking the domain. "
          + "At x = 6, the base becomes 12 − 12 = 0 and the volume ceases; "
          + "It is the smallest possible volume, not the largest." },
        { value: 3, why: "You divided the side by 4. Division by four is a rule reserved for another problem, "
          + "It does not result from the derivation of this function." },
        { value: 128, why: "You gave the volume no value x. The question is about the length of the cut piece in centimeters." },
      ],
    },
    {
      id: 'endpoint',
      family: "Fourth style · limit at one limit",
      aim: "The terms are checked when the derivative does not exist within the interval.",
      objectives: [1],
      prompt: "What is the largest value of the function f(x) = x² on the closed interval from x = 1 to x = 4?",
      unit: "Number",
      answer: 16,
      tolerance: 0.05,
      solution: "f′(x) = 2x zeros when x = 0 is outside the interval, so there are no critical points inside it. "
        + "We examine the extremes : f(1) = 1 and f(4) = 16, the maximum is 16.",
      commonErrors: [
        { value: 0, why: "You set the derivative equal to zero and accept x = 0 even though it is outside the interval. "
          + "The critical point is only accepted if it falls within the range." },
        { value: 1, why: "You took the smaller end. The function is increasing over this interval, with the largest value at the far right." },
        { value: 8, why: "You calculated f′(4) = 8, which is the value of the derivative, not the value of the function." },
      ],
    },
    {
      id: 'fence-wall',
      family: "Fifth style · A restriction with a missing side",
      aim: "The entry is written from form, not from habit.",
      objectives: [0],
      prompt: "A rectangular fence is intended next to a wall, so the side adjacent to the wall does not require a fence. "
        + "Disposable 60 m of fence. What is the largest possible area in square metres?",
      unit: 'm²',
      answer: 450,
      tolerance: 1,
      solution: "The entry x + 2y = 60 is in x = 60 − 2y, and the space is A = xy = 60y − 2y². "
        + "And A′ = 60 − 4y = 0 is at y = 15, then x = 30 and the space is 450 m².",
      commonErrors: [
        { value: 225, why: "You used the constraint 2x + 2y = 60 and a square with side 15. came out "
          + "The wall relieves you of a side, so the constraint is x + 2y and the optimal shape is not a square: "
          + "The side parallel to the wall is twice each of the other two sides." },
        { value: 900, why: "You considered 60 to be a side or you counted the sides incorrectly and 30 × 30. came out" },
        { value: 15, why: "You gave the dimension y, not the required space." },
      ],
    },
  ],
};
