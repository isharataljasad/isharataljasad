/* درس بيت الفؤاد · MA 101 · النهايات.
   محتوى أصلي. المصطلحات بالإنجليزية لأن المرجع والامتحان بالإنجليزية. */

/* الرسم: المنحنى y=(x²−9)/(x−3) خطٌّ مستقيم فيه ثقب واحد.
   الثقب هو الدرس كلّه: الدالة غير معرّفة عند 3، والنهاية موجودة عندها. */
const figure = `<svg viewBox="0 0 520 340" role="img" aria-labelledby="fig-limits-title" class="bayt-svg">`
  + `<title id="fig-limits-title">A straight line passes through the points, and it has an empty circle at =3 and =6</title>`
  + `<line x1="40" y1="300" x2="500" y2="300" stroke="#284955" stroke-width="2"/>`
  + `<line x1="120" y1="320" x2="120" y2="30" stroke="#284955" stroke-width="2"/>`
  + `<text x="486" y="322" font-size="15" fill="#284955">x</text>`
  + `<text x="98" y="42" font-size="15" fill="#284955">y</text>`
  + `<line x1="60" y1="244" x2="480" y2="48" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="300" y1="300" x2="300" y2="132" stroke="#c69748" stroke-width="2" stroke-dasharray="5 4"/>`
  + `<line x1="120" y1="132" x2="300" y2="132" stroke="#c69748" stroke-width="2" stroke-dasharray="5 4"/>`
  + `<circle cx="300" cy="132" r="7" fill="#f3f7fa" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="292" y="322" font-size="15" fill="#284955">3</text>`
  + `<text x="100" y="138" font-size="15" fill="#284955">6</text>`
  /* النص العربي في SVG يُرسى من يمينه، فيمتد يسارًا. بلا text-anchor
     صريح تخرج العبارة الطويلة عن يسار اللوحة وتُقتطع. */
  + `<text x="312" y="122" font-size="14" fill="#c0392b" text-anchor="start">Not defined at 3</text>`
  + `<text x="330" y="196" font-size="14" fill="#105c78" text-anchor="start">y = x + 3</text>`
  + `<text x="140" y="72" font-size="14" fill="#566f7a" text-anchor="start">the limit is equal to 6</text>`
  + `</svg>`;

export default {
  course: 'ma101',
  topic: 'limits',

  objectives: [
    "the limit is calculated by direct substitution when it is legitimate, and it is known when it is not.",
    "The limit of a fraction in which the substitution gives the form 0/0 is calculated by factoring or multiplying the conjugate.",
    "Differentiate between the value of a function at a point and its limit at that point.",
    "Rule that the limit does not exist if the two side limits are different.",
  ],

  boundaries: [
    "Limits at infinity and horizontal asymptotes are not in this lesson.",
    "The exact definition of epsilon and delta is not here; We work with numerical and graphical behavior.",
    "L'Hopital's rule is not here because it requires the derivative, which is a later lesson.",
    "Trigonometric limits such as sin(x)/x are not in this lesson.",
  ],

  prerequisites: [
    {
      title: "Difference of two squares factoring and triangular factoring",
      why: "The first way to remove the indeterminate form 0/0 is factoring. If you are unable to analyze, stop the solution at the beginning.",
      recap: "The difference between two squares : a² − b² = (a − b)(a + b). example : x² − 9 = (x − 3)(x + 3) because 9 = 3². "
        + "The trinomial x² + bx + c is analyzed by looking for two numbers whose product is c and whose sum is b. "
        + "Example: x² − 5x + 6 = (x − 2)(x − 3) because (−2)(−3) = 6 and (−2) + (−3) = −5.",
    },
    {
      title: "cancellation in algebraic fractions, and when is it permissible?",
      why: "After factored, you will delete a factor from the numerator and denominator, and this deletion is conditional on a condition that is easy to forget.",
      recap: "It is permissible to reduce the common factor as long as it is not equal to zero. (x − 3)(x + 3) / (x − 3) = x + 3 "
        + "True for all x except x = 3. The equality here is conditional, not absolute, which is why we write x ≠ 3 next to it. "
        + "This is exactly what makes the cancellation legitimate inside the limit, as you will see in the derivation below.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "the limit",
        en: 'Limit',
        text: "The limit of f(x) as x approaches a is L when f(x) approaches L as x approaches a from both sides, excluding x=a itself. We write lim(x→a) f(x)=L. The value f(a) may differ from L or may be undefined.",
      },
      {
        term: "one-sided limit",
        en: 'One-sided limit',
        text: "A left-hand limit uses x<a; a right-hand limit uses x>a. A finite two-sided limit exists exactly when both one-sided limits exist and equal the same finite number.",
      },
      {
        term: "Indeterminate form",
        en: 'Indeterminate form',
        text: "The form 0/0 obtained by direct substitution is not a value. Different expressions with this form can have different limits. Simplify the expression or use another valid limit argument before deciding the result.",
      },
      {
        term: "Direct substitution",
        en: 'Direct substitution',
        text: "Polynomials are continuous everywhere. A rational function is continuous wherever its denominator is nonzero. At such points its limit equals its value. Check the denominator and domain before substituting.",
      },
    ],
    relations: [
      {
        formula: 'lim(x→a) f(x) = L',
        name: "Basic wording",
        note: "It reads: The closer we bring x to a, the closer f(x) is to L.",
      },
      {
        formula: "lim(x→a⁻) f = lim(x→a⁺) f  ⟺ the limit is there",
        name: "Condition of existence",
        note: "The difference between the two sides alone is sufficient to rule that there is no limit.",
      },
      {
        formula: "lim(x→a) p(x) = p(a) for polynomial p",
        name: "Direct substitution",
        note: "Polynomials do not create surprises, and substitution is always legitimate.",
      },
    ],
    derivation: {
      title: "Why is it permissible to delete the factor even though it is equal to zero at the point",
      intro: "This is the question that many explanations skip. Deletion seems like a clear violation, so let's see why it's legitimate.",
      steps: [
        {
          do: "Start at (x² − 9)/(x − 3) and factor the numerator to (x − 3)(x + 3).",
          why: "factoring reveals the common factor that creates zero in the denominator, so we know the source of the problem instead of confronting it.",
        },
        {
          do: "Note that the definition of limit speaks of x being close to 3 and x ≠ 3.",
          why: "This is the crucial point: the limit never asks about the value of the function at 3, but rather about its behavior around it.",
        },
        {
          do: "As long as x ≠ 3, x − 3 ≠ 0, and division by a non-zero number are allowed, eliminate the operator.",
          why: "Deletion is prohibited only at zero, and we have excluded zero by definition itself, so there is no objection left.",
        },
        {
          do: "The expression becomes x + 3 for every x ≠ 3, which is a polynomial, so substitute x = 3 to get 6.",
          why: "The two functions match in every point that concerns the limit, so their limit is the same, and it is permissible to substitute it for the second.",
        },
      ],
    },
  },

  visual: {
    title: "A hole in the graph does not change the limit",
    figure: {
      svg: figure,
      caption: "The (x² − 9)/(x − 3) curve is the same line as y = x + 3, minus one point at x = 3.",
      alt: "An upward straight line represents y = x + 3. At x = 3, there is a closed circle at the position whose height is 6. "
        + "That is, the point is omitted from the curve. Two dashed lines connect the two axes to the position of the circle to show that "
        + "The path comes to the height 6 from both sides, despite the absence of the same point.",
    },
    table: {
      caption: "Values of the function when approaching 3 from both sides",
      head: ['x', "The side", 'f(x) = (x² − 9)/(x − 3)'],
      rows: [
        ['2.9', "From the left", '5.9'],
        ['2.99', "From the left", '5.99'],
        ['2.999', "From the left", '5.999'],
        ['3', "Same point", "Undefined (0/0)"],
        ['3.001', "From the right", '6.001'],
        ['3.01', "From the right", '6.01'],
        ['3.1', "From the right", '6.1'],
      ],
    },
    reading: "Read the table row by row: The last column approaches 6 from both sides, and the middle row alone "
      + "It has no value. This is the difference that the lesson measures: the limit is described by the surrounding rows, not the middle row. "
      + "If the two columns were approaching two different numbers, we would say that the limit does not exist.",
  },

  guided: {
    start: "Always start with direct substitution. If a specific number comes out, you're done in one step. "
      + "If the indeterminate form 0/0 comes out, this is not the end of the method, but rather its beginning: go to the factoring, "
      + "If there is a square root, multiply by the conjugate. That's the whole decision tree in this lesson.",
    workedExamples: [
      {
        title: "Example: 1 · is a fraction that gives 0/0, solved by factorization",
        task: "Find lim(x→2) (x² − 4)/(x − 2).",
        steps: [
          {
            do: "Substitute x = 2: for the numerator 4 − 4 = 0 and the denominator for 2 − 2 = 0, and the form is 0/0.",
            why: "We start with substitution to find out whether we need additional work at all. Indeterminate form 0/0 tells us we need it.",
          },
          {
            do: "Factor the numerator : x² − 4 = (x − 2)(x + 2).",
            why: "The appearance of 0 in both the numerator and denominator means that (x − 2) is a common factor, and the factoring shows it.",
          },
          {
            do: "Remove (x − 2) from the numerator and denominator, leaving x + 2 for every x ≠ 2.",
            why: "the limit considers x close to 2 and not equal to it, so the factor is non-zero and the deletion is legitimate.",
          },
          {
            do: "Substitute x = 2 into x + 2 and you get 4.",
            why: "x + 2 is a polynomial, and direct substitution is always legitimate.",
          },
        ],
        answer: '4',
      },
      {
        title: "Example: 2 · is a square root, solved by multiplying the conjugate",
        task: "Find lim(x→0) (√(x + 4) − 2)/x.",
        steps: [
          {
            do: "Substitute x = 0: for the numerator √4 − 2 = 0 and the denominator for 0, and the form is 0/0.",
            why: "The first step remains the same no matter how much the form of the expression changes: try the substitution first.",
          },
          {
            do: "factoring is not useful here because of the root, so multiply the numerator and denominator by the conjugate (√(x + 4) + 2).",
            why: "Multiplying the root by its conjugate removes the root via (a − b)(a + b) = a² − b², and multiplying by the same expression "
              + "A numerator and a denominator do not change the value of the fraction.",
          },
          {
            do: "The numerator becomes (x + 4) − 4 = x, so the fraction becomes x / (x(√(x + 4) + 2)).",
            why: "Here the common factor x that was hidden behind the root appeared; This is the purpose of multiplying by the conjugate.",
          },
          {
            do: "Remove x, leaving 1/(√(x + 4) + 2), then replace x = 0 and you get 1/(2 + 2) = 0.25.",
            why: "Deletion is permissible because x ≠ 0 is inside the limit, and the denominator after substitution is not equal to zero, so substitution is permissible.",
          },
        ],
        answer: '0.25',
      },
    ],
    skipped: [
      {
        q: "Why is it called \"0/0 «\" \"Unassigned\" instead of zero or one?",
        a: "Because the same image leads to different results : lim(x→0) x/x = 1 and lim(x→0) x²/x = 0, "
          + "The three lim(x→0) 5x/x = 5.s give 0/0 upon substitution and end up as 1, 0, and 5. "
          + "The image does not determine the result, hence the name.",
      },
      {
        q: "Is the limit always equal to the value of the function at the point?",
        a: "No. They are equal when the function is continuous at that point, which is the topic of the next lesson. "
          + "Here, I saw a function whose limit at 3 is equal to 6, while it has no value at 3 at all. "
          + "The function may have a value that contradicts its limit, as in the third question of the training.",
      },
      {
        q: "Is it enough to calculate the limit from one side?",
        a: "It is not enough to judge existence. It is sufficient to rule non-existence if you calculate the two aspects and find them different. "
          + "But if you count only one aspect, you have not examined half of the issue.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'direct',
      family: "The first type: direct substitution",
      aim: "You know when the matter is finished in one step.",
      objectives: [0],
      prompt: "Find lim(x→4) (2x² − 3x + 1).",
      unit: "Number",
      answer: 21,
      tolerance: 0.001,
      solution: "The expression is a polynomial, so direct substitution is : 2(4²) − 3(4) + 1 = 32 − 12 + 1 = 21. "
        + "There is no need for factoring or any trick, because the substitution did not give an unspecified picture.",
      commonErrors: [
        { value: -3, why: "You multiplied 2 by 4 instead of 4². The exponent is applied before multiplication by : 2(16) = 32, not 2(4) = 8." },
        { value: 45, why: "You added 12 instead of subtracting it. The term −3x is negative, so at x = 4 it equals −12." },
        { value: 20, why: "You neglected the constant term +1 at the end of the expression." },
      ],
    },
    {
      id: 'factor',
      family: "Mode 2 · indeterminate form 0/0 is removed by factoring",
      aim: "Shift the expression before the substitution instead of stopping at 0/0.",
      objectives: [1],
      prompt: "Find lim(x→5) (x² − 25)/(x − 5).",
      unit: "Number",
      answer: 10,
      tolerance: 0.001,
      solution: "Substitution gives 0/0. Factor the numerator : x² − 25 = (x − 5)(x + 5), then eliminate (x − 5) "
        + "Because x ≠ 5 is inside the limit. x + 5 remains, and substituting in gives 5 + 5 = 10.",
      commonErrors: [
        { value: 0, why: "0/0 read zero. Indeterminate form 0/0 is not valuable; It is an indication that you must convert the expression first." },
        { value: 1, why: "You read 0/0 as one because the numerator and denominator are equal. But they are equal only to zero, "
          + "This does not make the fraction one; See example x²/x in “Questions beyond explanation.”" },
        { value: 5, why: "You deleted the operator and then wrote the a value itself. After deletion, x + 5 remains, not x, so substitution gives 10." },
      ],
    },
    {
      id: 'value-vs-limit',
      family: "The third type: value versus limit",
      aim: "Distinguish between what a function is equal to at a point and what it approaches around it.",
      objectives: [2],
      prompt: "A function defined as : f(x) = (x² − 4)/(x − 2) for each x ≠ 2 and f(2) = 7. "
        + "Find lim(x→2) f(x).",
      unit: "Number",
      answer: 4,
      tolerance: 0.001,
      solution: "the limit does not look at x = 2 at all, the value of f(2) = 7 does not enter the calculation. "
        + "For every x ≠ 2 there is f(x) = (x − 2)(x + 2)/(x − 2) = x + 2, so the limit is 2 + 2 = 4. "
        + "This is a function whose limit is 4 and whose value is 7 at the same point, which are two different things.",
      commonErrors: [
        { value: 7, why: "You gave the value of the function at 2, and the question is about the limit. the limit is described by the points surrounding 2, "
          + "And don't look at 2 itself. The f(2) = 7 in question was put in question to test you on this particular difference." },
        { value: 0, why: "You stopped at the indeterminate form 0/0 and read it as zero, and did not analyze the numerator." },
        { value: 2, why: "You wrote the value of a in place of the result of the expression after the cancellation. After deleting, x + 2 remains, so the result is 4." },
      ],
    },
    {
      id: 'one-sided',
      family: "Fourth style · One-sided limit",
      aim: "One aspect is examined carefully, and it is the basis for ruling that there is no limit.",
      objectives: [3],
      prompt: "Let f(x) = |x − 5|/(x − 5)., find the limit from the left as lim(x→5⁻) f(x).",
      unit: "Number",
      answer: -1,
      tolerance: 0.001,
      solution: "To the left of 5, x < 5, so x − 5 is negative, and the absolute value of a negative number is negative: "
        + "|x − 5| = −(x − 5)., the fraction becomes −(x − 5)/(x − 5) = −1 for every x < 5, and the limit is −1. "
        + "On the right, the result is +1. The two sides are different, so the general limit at 5 does not exist.",
      commonErrors: [
        { value: 1, why: "You counted from the right. The symbol 5⁻ means approaching values smaller than 5, and then.. "
          + "x − 5 is negative, so the absolute value is decoded with a negative sign." },
        { value: 0, why: "You thought the numerator would become zero as you approached. The numerator and denominator both approach zero, "
          + "Their ratio remains constant at −1 and does not approach zero." },
        { value: 5, why: "You wrote the point we are approaching instead of the value the function is approaching." },
      ],
    },
    {
      id: 'conjugate',
      family: "Type 5: A square root that requires a conjugate",
      aim: "Choose the right tool when factoring fails.",
      objectives: [1],
      prompt: "Find lim(x→0) (√(x + 9) − 3)/x. Write the result as a decimal number.",
      unit: "Number",
      answer: 0.16667,
      tolerance: 0.002,
      solution: "substitution gives 0/0, and the factoring is not useful due to the presence of the root. Multiply the numerator and denominator by the conjugate "
        + "(√(x + 9) + 3), so the numerator becomes (x + 9) − 9 = x, and the fraction becomes x/(x(√(x + 9) + 3)). "
        + "Remove x, leaving 1/(√(x + 9) + 3), and when x = 0 equals 1/(3 + 3) = 1/6 ≈ 0.1667.",
      commonErrors: [
        { value: 0.33333, why: "You forgot the term +3 in the denominator after multiplying the conjugate, so you took 1/3 instead of 1/(3 + 3)." },
        { value: 0, why: "You read 0/0 zero without hitting the accompaniment." },
        { value: 6, why: "You reversed the fraction. Output 1/6 not 6; Review the position of the numerator and denominator after elimination." },
      ],
    },
  ],
};
