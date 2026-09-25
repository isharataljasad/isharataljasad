/* درس بيت الفؤاد · MA 101 · الاتصال. */

/* الرسم: أنواع الانقطاع الثلاثة جنبًا إلى جنب.
   وضعُها في صورة واحدة هو المقصود: الطالب يميّزها بالمقارنة لا بالحفظ. */
const figure = `<svg viewBox="0 0 540 220" role="img" aria-labelledby="fig-cont-title" class="bayt-svg">`
  + `<title id="fig-cont-title">Three adjacent drawings showing the removable, jump and infinite discontinuity</title>`
  /* أولًا: قابل للإزالة — خط متصل فيه ثقب. */
  + `<line x1="20" y1="170" x2="160" y2="170" stroke="#284955" stroke-width="2"/>`
  + `<line x1="30" y1="150" x2="150" y2="70" stroke="#105c78" stroke-width="3"/>`
  + `<circle cx="90" cy="110" r="6" fill="#f3f7fa" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="90" y="196" font-size="14" fill="#284955" text-anchor="middle">Removable</text>`
  + `<text x="90" y="214" font-size="12" fill="#566f7a" text-anchor="middle">Limit exists</text>`
  /* ثانيًا: قفزي — فرعان بارتفاعين مختلفين. */
  + `<line x1="200" y1="170" x2="340" y2="170" stroke="#284955" stroke-width="2"/>`
  + `<line x1="210" y1="140" x2="268" y2="120" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="272" y1="70" x2="330" y2="50" stroke="#105c78" stroke-width="3"/>`
  + `<circle cx="268" cy="120" r="6" fill="#f3f7fa" stroke="#c0392b" stroke-width="3"/>`
  + `<circle cx="272" cy="70" r="5" fill="#105c78"/>`
  + `<text x="270" y="196" font-size="14" fill="#284955" text-anchor="middle">Jump</text>`
  + `<text x="270" y="214" font-size="12" fill="#566f7a" text-anchor="middle">Different one-sided limits</text>`
  /* ثالثًا: لا نهائي — فرعان يبتعدان عن خط رأسي. */
  + `<line x1="380" y1="170" x2="520" y2="170" stroke="#284955" stroke-width="2"/>`
  + `<line x1="450" y1="30" x2="450" y2="176" stroke="#c69748" stroke-width="2" stroke-dasharray="5 4"/>`
  + `<path d="M 390 160 Q 440 158 444 40" fill="none" stroke="#105c78" stroke-width="3"/>`
  + `<path d="M 456 40 Q 460 158 510 160" fill="none" stroke="#105c78" stroke-width="3"/>`
  + `<text x="450" y="196" font-size="14" fill="#284955" text-anchor="middle">Infinite</text>`
  + `<text x="450" y="214" font-size="12" fill="#566f7a" text-anchor="middle">Unbounded values</text>`
  + `</svg>`;

export default {
  course: 'ma101',
  topic: 'continuity',

  objectives: [
    "Check the three conditions for continuity at a point and identify any condition that fails.",
    "Classify discontinuities as removable, jump, or infinite.",
    "Find a constant that makes a piecewise function continuous where its pieces meet.",
  ],

  boundaries: [
    "Continuity on intervals and uniform continuity are beyond this lesson.",
    "The mean value theorem uses continuity and is covered in a later lesson.",
    "We do not prove here that elementary functions are continuous on their domains; We use that as a fact.",
  ],

  prerequisites: [
    {
      title: "Calculate the limit point",
      why: "The continuity is checked by comparing the limit with the value of the function. Anyone who does not calculate the limit does not check the continuity.",
      recap: "substitute first; If a specific number comes out, it is the limit. If the image comes out 0/0, analyze and summarize "
        + "Then substitute. Example : lim(x→3) (x² − 9)/(x − 3) = 6 after the cancellation (x − 3).",
      href: '/semester-1/math/limits/',
      hrefLabel: "Study endings completely",
    },
    {
      title: "Side ends",
      why: "The jump discontinuity is discovered by comparing the two sides, and never appears by calculating one side.",
      recap: "limit from left lim(x→a⁻) looking at x < a, from right lim(x→a⁺) looking at x > a. "
        + "In the divergent function, each side uses its own expression. "
        + "The general limit exists if the two sides exist and are equal, otherwise it does not exist.",
      href: '/semester-1/math/limits/',
      hrefLabel: "Side endings in the endings lesson",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Continuity at a point",
        en: 'Continuity at a point',
        text: "A function is continuous at a when f(a) is defined, lim(x→a) f(x) exists, and that limit equals f(a). Failure of any of these conditions gives a discontinuity at that point.",
      },
      {
        term: "Removable discontinuity",
        en: 'Removable discontinuity',
        text: "A finite limit exists, but f(a) is missing or differs from the limit. Defining f(a) to equal that limit repairs continuity without changing the function at other points.",
      },
      {
        term: "Jump discontinuity",
        en: 'Jump discontinuity',
        text: "Both one-sided limits are finite but unequal. Changing the value at a single point cannot make these limits equal.",
      },
      {
        term: "Infinite discontinuity",
        en: 'Infinite discontinuity',
        text: "The function becomes unbounded near the point. For example, 1/(x−5)² tends to +∞ from both sides of 5. For 1/(x−5), the signs differ on the two sides. Neither has a finite two-sided limit at 5.",
      },
    ],
    relations: [
      {
        formula: 'f continuous at a  ⟺  f(a) defined  ∧  lim exists  ∧  lim = f(a)',
        name: "The three conditions",
        note: "Read them through a checklist: check them in order and stop at the first condition that occurs.",
      },
      {
        formula: 'lim(x→a⁻) f ≠ lim(x→a⁺) f  ⟹  jump',
        name: "Jump tag",
        note: "The two sides exist and are different, and this is what distinguishes it from the infinite.",
      },
      {
        formula: 'lim(x→a) f = L ≠ f(a)  ⟹  removable',
        name: "Removable tag",
        note: "Limit exists, the flaw is in the point alone.",
      },
    ],
    derivation: {
      title: "Why do we need three conditions and two conditions are not enough?",
      intro: "The third condition may seem to be a repetition of the first two. Let us see an example in which each condition alone falls while the other two are met.",
      steps: [
        {
          do: "Take f(x) = (x² − 4)/(x − 2) at x = 2: limit 4 exists, but f(2) is undefined.",
          why: "Here the first condition alone fails. If we were satisfied with the existence of the limit, we would call this function continuous, but it is not.",
        },
        {
          do: "Take g(x) = |x − 2|/(x − 2) with g(2) = 0: The value is defined, but the limit does not exist.",
          why: "Here the second condition alone fails. The presence of a value at a point says nothing about the behavior of the function around it.",
        },
        {
          do: "Take h(x) = (x² − 4)/(x − 2) for every x ≠ 2 with h(2) = 7: the value is defined and the limit is present, they are different.",
          why: "Here the first two conditions were met and the third one failed. Therefore, equality must be explicitly stipulated.",
        },
        {
          do: "Combine the three: It is not enough for the two parties to exist, they must meet.",
          why: "The meaning of continuity is that the path of the function reaches the same point without a jump or a hole. "
            + "This is exactly what equality expresses in the third condition.",
        },
      ],
    },
  },

  visual: {
    title: "Three types of discontinuity",
    figure: {
      svg: figure,
      caption: "From the left: a hole in a continuous path, then a jump between two branches, then two branches that rise infinitely on either side of a vertical line — this is the image of the even exponent in the denominator.",
      alt: "Three adjacent drawings. The first is an upward diagonal line with a hollow circle in its middle, so the path and the point are the same "
        + "Deleted alone. The second has two inclined branches, one higher than the other, and the limit of the lower branch ends with a circle "
        + "It is empty and the top begins with a filled circle, with a jump between them. The third is a dashed vertical line with two branches approaching it "
        + "And they go up and away from him without limit.",
    },
    table: {
      caption: "Any condition falls into each type",
      head: ["Type", "f(a) defined?", "Is the limit there?", "Are they equal?", "Is it possible to redefine a point?"],
      rows: [
        ["Removable (worthless)", "No", "Yes", '—', "Yes"],
        ["Removable (with different value)", "Yes", "Yes", "No", "Yes"],
        ["Jump", "May be", "No", '—', "No"],
        ["Infinite", "No", "No", '—', "No"],
      ],
    },
    reading: "The last column is the practical criterion: the first type alone is flawed in one point. "
      + "The other two types are flawed in the behavior of the function around the point, and any value you put at it does not correct them. "
      + "That is why the student is often asked about “the value that makes the function continuous,” and this question is only valid in the first type.",
  },

  guided: {
    start: "Check the conditions in order and do not jump. First: Is f(a) defined? Second: Calculate the limit from both sides. "
      + "Third: Compare it with f(a). and stop at the first condition that falls, as it alone determines the type of discontinuity. "
      + "As for “find the value of the constant” problems, they always apply the third condition: equate the limit with the value.",
    workedExamples: [
      {
        title: "Example 1 · discontinuity rating",
        task: "Rate the discontinuity f(x) = (x² − 1)/(x − 1) at x = 1.",
        steps: [
          {
            do: "Check f(1): denominator 1 − 1 = 0, value is not defined. The first condition is invalid.",
            why: "We started with the easiest one: substitution immediately detects whether a point is outside the domain.",
          },
          {
            do: "Calculate the limit : (x − 1)(x + 1)/(x − 1) = x + 1 for every x ≠ 1, so the limit is 2.",
            why: "The failure of the first condition does not determine the type; The type is determined by the presence or absence of the limit.",
          },
          {
            do: "the limit exists and is finished, the discontinuity is removable.",
            why: "It is enough to define f(1) = 2 for the function to become continuous, and the defect then lies in one point, not in the path.",
          },
        ],
        answer: 'removable discontinuity, limit = 2',
      },
      {
        title: "Example 2 · Find a constant that makes the function continuous",
        task: "Find the a that makes f continuous at x = 2, where f(x) = ax + 1 of x ≤ 2, "
          + "And f(x) = x² + 3 for x > 2.",
        steps: [
          {
            do: "Calculate the limit from the right: lim(x→2⁺) (x² + 3) = 4 + 3 = 7.",
            why: "To the right of 2 the second formula works, as it is the only one used in this limit.",
          },
          {
            do: "Calculate the limit from the left and the value of the function: both are a(2) + 1 = 2a + 1.",
            why: "The condition x ≤ 2 includes the point itself, so the left branch gives the value and the left limit together.",
          },
          {
            do: "Equate both sides : 2a + 1 = 7, so a = 3.",
            why: "continuity requires that the two sides meet at the same function value. Equality is the translation of the third condition.",
          },
        ],
        answer: 'a = 3',
      },
    ],
    skipped: [
      {
        q: "Why do we say that the discontinuity is “removable” when the given function is actually discontinuous?",
        a: "The label describes the possibility of reform, not the current state. The function as given is discontinuous, "
          + "But a new function can be defined that matches it everywhere except that point, and is continuous. "
          + "As for the jump and the infinite, this is not possible in them, no matter what you do with a single point.",
      },
      {
        q: "Is every manifold function interrupted at the intersection point?",
        a: "No. Bifurcation is a writing style, not a judgment on behavior. If the two sides and the value of the function are equal, then they are continuous. "
          + "Example : f(x) = x for x < 0 and f(x) = x for x ≥ 0 is a fully connected hyperlinked function.",
      },
      {
        q: "What is the relationship between connectivity and differentiability?",
        a: "Every function is differentiable at a point at which it is continuous, and the opposite is not true. "
          + "|x| is continuous at zero and cannot be differentiated there due to the acute angle. "
          + "This will be detailed in the derivative lesson, which is outside the scope of this lesson.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'removable-value',
      family: "Type 1 · A value that removes the discontinuity",
      aim: "The third condition applies: equal the value to the limit.",
      objectives: [2],
      prompt: "f(x) = (x² − 16)/(x − 4) function for both x ≠ 4 and f(4) = k. "
        + "What value of k makes f continuous at x = 4?",
      unit: "Number",
      answer: 8,
      tolerance: 0.001,
      solution: "Analyze and reduce : (x − 4)(x + 4)/(x − 4) = x + 4 for every x ≠ 4, so the limit is 4 + 4 = 8. "
        + "The continuity requires k = 8.",
      commonErrors: [
        { value: 4, why: "You wrote the point a = 4 instead of the limit value. After the cancellation x + 4 remains, "
          + "substituting it gives 8, not 4." },
        { value: 0, why: "You read the indeterminate form 0/0 as zero without factoring, so you thought the limit was zero." },
        { value: 16, why: "You substituted in the numerator alone. What is required is the limit of the entire fraction after the cancellation." },
      ],
    },
    {
      id: 'jump-size',
      family: "The second type is measuring the jump",
      aim: "You calculate the two sides and compare them instead of just one.",
      objectives: [1],
      prompt: "For the function f(x) = |x − 2|/(x − 2) at x = 2:, calculate the limit from the right minus the limit from the left.",
      unit: "Number",
      answer: 2,
      tolerance: 0.001,
      solution: "On the right x > 2 then |x − 2| = x − 2 and the ratio is +1. and on the left x < 2 "
        + "The ratio is |x − 2| = −(x − 2), the ratio is −1., and the difference is 1 − (−1) = 2, which is the amount of the jump.",
      commonErrors: [
        { value: 0, why: "You thought the two sides were equal. The absolute value is decoded by two different signs "
          + "On either side of 2, hence the difference." },
        { value: -2, why: "You reversed the order of presentation. The right minus the left is required, i.e. 1 − (−1)." },
        { value: 1, why: "You only calculated one side and did not subtract the other." },
      ],
    },
    {
      id: 'infinite-point',
      family: "The third type is the position of infinite discontinuity",
      aim: "The absence of status alone is distinguished from the absence of both sides together.",
      objectives: [1],
      prompt: "At any value of x the function f(x) = (x + 2)/(x² − 9) has infinite discontinuity "
        + "With a positive value of x?",
      unit: "x value",
      answer: 3,
      tolerance: 0.001,
      solution: "The denominator is non-existent at x = 3 and x = −3, and the numerator is non-existent at either of them. "
        + "They are both endless discontinuitys. The positive value is x = 3.",
      commonErrors: [
        { value: -2, why: "This is the root of the numerator, not the denominator. The null of the numerator alone gives zero, "
          + "It does not create an infinite discontinuity." },
        { value: 9, why: "You took the constant from x² − 9 without solving the equation. The two roots of x² = 9 are ±3." },
        { value: 0, why: "The denominator at x = 0 is equal to −9 and it is not zero, so the function is continuous there." },
      ],
    },
    {
      id: 'three-conditions',
      family: "Fourth style: Checking the conditions",
      aim: "The limit is calculated at a location where both the numerator and denominator are non-existent.",
      objectives: [0],
      prompt: "For the function f(x) = (x − 3)/(x² − 9):, what is its limit at x → 3? "
        + "Write the result as a decimal number.",
      unit: "Number",
      answer: 0.16667,
      tolerance: 0.002,
      solution: "Factor the denominator : x² − 9 = (x − 3)(x + 3), so the fraction is (x − 3)/((x − 3)(x + 3)) = 1/(x + 3) "
        + "For each x ≠ 3. the substitution gives 1/6 ≈ 0.1667. "
        + "the limit exists and the discontinuity at 3 is removable, not infinite.",
      commonErrors: [
        { value: 0, why: "Indeterminate form 0/0 read zero. The absence of the numerator and denominator together is a sign of a common factor "
          + "It should be shortened, not marked as a zero result." },
        { value: 6, why: "You reversed the fraction. After the shortening remains 1/(x + 3), the result is 1/6, not 6." },
        { value: 0.33333, why: "You shortened incorrectly and it remains 1/(2x) or something similar. "
          + "The denominator after the cancellation is x + 3, and when x = 3 is equal to 6, not 3." },
      ],
    },
    {
      id: 'piecewise-constant',
      family: "Type 5 · Constant in a manifold function",
      aim: "You use the correct branch for each side before equating them.",
      objectives: [2],
      prompt: "Find a that makes the function continuous at x = 1, where f(x) = ax − 4 of x ≤ 1, "
        + "And f(x) = x² + 2x − 1 for x > 1.",
      unit: "Number",
      answer: 6,
      tolerance: 0.001,
      solution: "From the right : 1 + 2 − 1 = 2., from the left and from the value : a(1) − 4 = a − 4. "
        + "The equality a − 4 = 2 gives a = 6.",
      commonErrors: [
        { value: -2, why: "You set a − 4 to zero instead of setting it equal to the limit of the right branch." },
        { value: 2, why: "You wrote the value of the right limit instead of the value of a. after finding the limit that remains "
          + "Solve the equation a − 4 = 2." },
        { value: 10, why: "You added 4 to the limit twice, or you calculated the right branch 1 + 2 + 1 = 4 "
          + "Ignoring the −1. sign" },
      ],
    },
  ],
};
