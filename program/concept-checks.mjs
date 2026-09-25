/* ==========================================================================
   program/concept-checks.mjs

   Interactive checks for the Guided practice route of each concept.

   These do not replace the written decisions in `approach-2.md`; they follow
   them. A reader who has worked through the families meets the same
   decisions here as something to commit to, get judged on, and then be
   handed a DIFFERENT problem for.

   Design rules that the data has to honour, and that test/concept-checks.mjs
   enforces:

   - A `response` is a possibility, not a diagnosis. The wording says what the
     value is consistent with, because one number cannot establish what a
     person was thinking.
   - `followUp` must be a different problem, not the same one re-asked. It is
     shown after a wrong answer, so revealing the solution does not hand over
     the answer to the thing that tests the repair.
   - `version` changes whenever the question's content changes, so a saved
     attempt against an old wording is discarded rather than counted.
   - Nothing here awards mastery. A single correct answer is one correct
     answer, and the runtime says so.
   ========================================================================== */

/* `n` builds a numeric check; `c` builds a justified-choice check. */
const n = (id, prompt, answer, opts = {}) => ({
  id, kind: 'number', prompt, answer,
  tolerance: opts.tolerance ?? 0.001,
  unit: opts.unit ?? '',
  solution: opts.solution,
  responses: opts.responses ?? [],
  followUp: opts.followUp,
  prerequisite: opts.prerequisite,
  version: opts.version ?? 1,
});

const c = (id, prompt, options, opts = {}) => ({
  id, kind: 'choice', prompt, options,
  solution: opts.solution,
  followUp: opts.followUp,
  prerequisite: opts.prerequisite,
  version: opts.version ?? 1,
});

export const conceptChecks = {

  'expressions-and-variables': [
    c('classify', 'A print shop writes `pq + d` on a quote. What kind of object is it?', [
      { label: 'An expression', correct: true },
      { label: 'An equation', why: 'An equation asserts that two sides agree, and needs an equals sign. This has none, so there is nothing to be true or false — only a value once the letters are assigned.' },
      { label: 'An inequality', why: 'An inequality compares two sides with a comparison sign. None is present here.' },
    ], {
      solution: '`pq + d` is an expression: it has a value once `p`, `q` and `d` are assigned, and it claims nothing. "Solve it" is not a question it admits.',
      followUp: {
        prompt: 'Now decide: what kind of object is `pq + d = 31`?',
        kind: 'choice',
        options: [
          { label: 'An equation', correct: true },
          { label: 'An expression', why: 'The equals sign adds a claim that the two sides agree, which an expression does not make.' },
        ],
        solution: 'It is an equation. It claims the two sides agree, and that claim can be true or false depending on the assignment.',
      },
    }),
    n('translate', 'Write "twice the total of the item cost `pq` and the delivery `d`" and evaluate it at `p = 7`, `q = 4`, `d = 3`.', 62, {
      unit: 'riyals',
      solution: '`2(pq + d) = 2(28 + 3) = 62`. The words "the total of ... and ..." name one quantity, and "twice" applies to all of it.',
      responses: [
        { value: 59, why: 'consistent with writing `2pq + d`, which doubles the item cost and leaves the delivery single.' },
        { value: 31, why: 'consistent with evaluating `pq + d` and not applying "twice" at all.' },
        { value: 35, why: 'consistent with reading `p(q + d)`, which multiplies a price by a sum of bottles and riyals — quantities that cannot be added.' },
      ],
      followUp: {
        prompt: 'A different phrasing: "the item cost, plus twice the delivery". Evaluate it at the same values.',
        answer: 34, tolerance: 0.001, unit: 'riyals',
        solution: '`pq + 2d = 28 + 6 = 34`. Here "twice" reaches only the delivery, because the words group it that way.',
      },
      prerequisite: { label: 'Order of operations', href: '/foundations/concepts/order-of-operations/approach-1/' },
    }),
    n('substitute', 'Evaluate `2a² + b` at `a = -3` and `b = 5`.', 23, {
      solution: '`2(-3)² + 5 = 2(9) + 5 = 23`. The bracket around `-3` keeps the sign inside the base.',
      responses: [
        { value: -13, why: 'consistent with dropping the bracket and reading `-3²` as `-(3²) = -9`, giving `2(-9) + 5`.' },
        { value: 11, why: 'consistent with replacing the square by the magnitude: `2 × 3 + 5 = 11`. Squaring gives 9, not 3.' },
        { value: 41, why: 'consistent with squaring the whole of `2a` rather than `a` alone.' },
      ],
      followUp: {
        prompt: 'Now evaluate `b - a²` at the same values, `a = -3` and `b = 5`.',
        answer: -4, tolerance: 0.001,
        solution: '`5 - (-3)² = 5 - 9 = -4`. The square is positive, and it is subtracted.',
      },
    }),
  ],

  'order-of-operations': [
    n('levels', 'Evaluate `6 × (5 - 2)² ÷ 9`, settling one level at a time.', 6, {
      solution: '`6 × 3² ÷ 9` → `6 × 9 ÷ 9` → `54 ÷ 9` → `6`.',
      responses: [
        { value: 29.6, why: 'consistent with dropping the bracket, which demotes the subtraction from level 1 to last and leaves the power acting on `2` alone.' },
        { value: 2, why: 'consistent with omitting the square: `6 × 3 ÷ 9 = 2`. The grouped value must be squared first.' },
        { value: 54, why: 'consistent with stopping before the division.' },
      ],
      followUp: {
        prompt: 'Now evaluate `4 × (7 - 3)² ÷ 8`, one level at a time.',
        answer: 8, tolerance: 0.001,
        solution: '`4 × 4² ÷ 8` → `4 × 16 ÷ 8` → `64 ÷ 8` → `8`.',
      },
    }),
    n('tie', 'Evaluate `54 ÷ 9 × 2`.', 12, {
      solution: 'Division and multiplication are tied at level 3, so the one written first goes first: `6 × 2 = 12`.',
      responses: [
        { value: 3, why: 'consistent with evaluating `54 ÷ (9 × 2)` — a correct value for an expression that was not written.' },
      ],
      followUp: {
        prompt: 'Same rule, other level: evaluate `9 - 4 + 2`.',
        answer: 7, tolerance: 0.001,
        solution: 'Addition and subtraction are tied at level 4, so left to right: `5 + 2 = 7`. Answering `3` evaluates `9 - (4 + 2)`.',
      },
    }),
    n('base', 'Evaluate `5 - x²` at `x = -2`.', 1, {
      solution: '`5 - (-2)² = 5 - 4 = 1`. The bracket keeps the minus inside the base.',
      responses: [
        { value: 9, why: 'consistent with dropping the bracket, writing `5 - -2²`, and reading `-2²` as `-(2²) = -4`.' },
        { value: -4, why: 'consistent with evaluating `-2²` alone and not subtracting it from 5.' },
      ],
      followUp: {
        prompt: 'Now give `-4²` and `(-4)²` as a single sum: `-4² + (-4)²`.',
        answer: 0, tolerance: 0.001,
        solution: '`-16 + 16 = 0`. The first has base `4`; the second has base `-4`.',
      },
    }),
  ],

  'exponents': [
    n('area', 'A square tile has side `s = 3 cm`. Give its area as a number in `cm²`.', 9, {
      unit: 'cm²',
      solution: '`(3 cm)² = 9 cm²`. Both the number and the unit are squared.',
      responses: [
        { value: 6, why: 'consistent with reading the exponent as a multiplier, `3 × 2`.' },
        { value: 12, why: 'consistent with computing a perimeter, `4s`, rather than an area.' },
      ],
      followUp: {
        prompt: 'The side is tripled. Give the new area in `cm²`.',
        answer: 81, tolerance: 0.001, unit: 'cm²',
        solution: '`(3s)² = (9 cm)² = 81 cm²`. Tripling a length multiplies area by nine, not by three.',
      },
    }),
    c('coefficient', 'A tile of side `s` has its side tripled. Which expression gives the new area?', [
      { label: '`(3s)²`', correct: true },
      { label: '`3s²`', why: 'That is three times the original area — three separate tiles, not one larger tile. Only `s` is squared and the `3` sits outside.' },
      { label: '`3s`', why: 'That is a length, not an area. Nothing has been squared.' },
    ], {
      solution: 'Tripling the side gives a new side `3s`, so the new area is `(3s)² = 9s²`.',
      followUp: {
        prompt: 'At `s = 2`, evaluate `3s²`.',
        kind: 'number', answer: 12, tolerance: 0.001,
        solution: '`3 × 2² = 3 × 4 = 12`. The coefficient multiplies after the power is taken.',
      },
    }),
    n('negative-exponent', 'Evaluate `3/x²` at `x = 2`. Enter one numerical value.', 0.75, {
      tolerance: 0.005,
      solution: '`3/2² = 3/4 = 0.75`. Rewrite as `3x⁻²` if that is clearer; the exponent acts on `x` alone.',
      responses: [
        { value: 1.5, why: 'consistent with evaluating `3/x` instead of `3/x²`: the denominator is 4, not 2.' },
        { value: 2.25, why: 'consistent with squaring the whole of `3/x` rather than `x` alone.' },
      ],
      followUp: {
        prompt: 'Now evaluate `(3/x)²` at `x = 2`, to see the difference a bracket makes.',
        answer: 2.25, tolerance: 0.005,
        solution: '`(3/2)² = 1.5² = 2.25`. Here the bracket puts the whole quotient inside the base.',
      },
    }),
  ],

  'integers-and-the-number-line': [
    c('limit', 'A vaccine store must be held at or below `-20 °C`. Tuesday logged `-18 °C`. Is that within limit?', [
      { label: 'No, it is warmer than the limit', correct: true },
      { label: 'Yes, because 18 is a smaller number than 20', why: 'consistent with comparing the digits and ignoring the side of zero. Among negatives the larger digit is the smaller number, so `-18` lies to the right of `-20` and is warmer.' },
      { label: 'It cannot be decided from one reading', why: 'consistent with treating a single reading as insufficient evidence, but a limit is a threshold and one reading above it is already a breach.' },
    ], {
      solution: '`-18` lies to the right of `-20` on the line, so it is warmer. "At or below" needs a position further left, such as `-20` or `-25`.',
      followUp: {
        prompt: 'Of the readings `-22`, `-18` and `-25`, enter the coldest.',
        answer: -25, tolerance: 0.001, unit: '°C',
        solution: '`-25` lies furthest left, so it is coldest, although `25` is the largest digit.',
      },
    }),
    n('order', 'Enter the smaller of `-25` and `-18`.', -25, {
      solution: '`-25` lies further left on the number line, so it is the smaller number.',
      responses: [
        { value: -18, why: 'consistent with ranking by absolute value. `|-25|` exceeds `|-18|`, but the bars discard the side of zero, which is what an order comparison needs.' },
      ],
      followUp: {
        prompt: 'Now enter the value of `|-25| - |-18|`.',
        answer: 7, tolerance: 0.001,
        solution: '`25 - 18 = 7`. Both bars report a distance from zero, and a distance is never negative.',
      },
    }),
    n('double-sign', 'Evaluate `-(-22)` and explain what the outer negative sign does.', 22, {
      solution: 'A minus sign in front means "the opposite of", so this asks for the opposite of negative twenty-two.',
      responses: [
        { value: -22, why: 'consistent with treating one sign as a typing slip and deleting it. Each sign is an instruction.' },
        { value: 0, why: 'consistent with reading the two signs as cancelling to nothing rather than as two applications of "the opposite of".' },
      ],
      followUp: {
        prompt: 'A number and its opposite always sum to the same value. Enter `-22 + 22`.',
        answer: 0, tolerance: 0.001,
        solution: 'Zero, which is exactly what "same distance from zero, other side" means.',
      },
    }),
  ],

  'variables-and-expressions': [
    n('less-than', 'Pages cost `nc` riyals. Evaluate "nine riyals less than the cost of the pages" at `n = 10`, `c = 2`.', 11, {
      unit: 'riyals',
      solution: '`nc - 9 = 20 - 9 = 11`. "Less than" reduces from the quantity named second, so the symbols reverse the word order.',
      responses: [
        { value: -11, why: 'consistent with writing `9 - nc`, following the order the words arrive in. A negative charge would mean the shop pays the customer.' },
        { value: 20, why: 'consistent with computing the page cost and not applying the reduction at all.' },
      ],
      followUp: {
        prompt: 'Now evaluate "the discount `d` subtracted from the setup charge `s`" at `s = 15`, `d = 9`.',
        answer: 6, tolerance: 0.001, unit: 'riyals',
        solution: '`s - d = 15 - 9 = 6`. The same reversal: "subtracted from" reduces the quantity named second.',
      },
    }),
    n('bracket-minus', 'Evaluate `nc - (s - 9)` at `n = 10`, `c = 2`, `s = 15`.', 14, {
      unit: 'riyals',
      solution: 'Evaluate the bracket first: `20 - (15 - 9) = 20 - 6 = 14`.',
      responses: [
        { value: -4, why: 'consistent with deleting the bracket without changing the signs inside it, giving `nc - s - 9`. The minus in front applies to both terms.' },
        { value: 26, why: 'consistent with adding the bracketed quantity instead of subtracting it.' },
      ],
      followUp: {
        prompt: 'A new job has `n = 8`, `c = 3`, `s = 10`. Evaluate `nc - (s - 4)`.',
        answer: 18, tolerance: 0.001, unit: 'riyals',
        solution: '`24 - (10 - 4) = 24 - 6 = 18`. Removing the bracket gives `24 - 10 + 4`.',
      },
    }),
    n('read-back', 'Evaluate `(s + nc)/n` at `n = 10`, `c = 2`, `s = 15`.', 3.5, {
      tolerance: 0.005, unit: 'riyals per page',
      solution: '`(15 + 20)/10 = 3.5` riyals per page: the whole charge shared across the pages, higher than the `c = 2` printing cost because the setup is included.',
      responses: [
        { value: 17, why: 'consistent with losing the bracket and reading `s + nc/n`, which simplifies to `s + c` and is not a cost per page.' },
        { value: 35, why: 'consistent with computing the total charge and not dividing by the pages.' },
      ],
      followUp: {
        prompt: 'For which value of `n` is `(s + nc)/n` undefined?',
        answer: 0, tolerance: 0.001,
        solution: '`n = 0`. A job with no pages still incurs the setup charge, so the total is not zero, but "cost per page" has nothing to divide by.',
      },
    }),
  ],

  'coordinate-plane': [
    c('axis-point', 'A survey peg sits at `(0, -7)`. Which quadrant is it in?', [
      { label: 'Neither, it is on an axis', correct: true },
      { label: 'Quadrant III', why: 'consistent with reading "below the origin" as quadrant III or IV. But `x = 0` puts the peg on the y-axis, and the quadrants are the open regions between the axes.' },
      { label: 'Quadrant IV', why: 'consistent with the same reading. A zero coordinate always places a point on an axis, which belongs to no quadrant.' },
    ], {
      solution: 'A point with a zero coordinate lies on a boundary, and a boundary is in no region. A question offering only III or IV has no correct option.',
      followUp: {
        prompt: 'Peg `A` is at `(1, -2)`. Enter its quadrant number.',
        answer: 4, tolerance: 0.001,
        solution: 'Positive `x` and negative `y` is quadrant IV.',
      },
    }),
    n('on-the-line', 'The line through `A(1, -2)` and `B(3, 2)` is `y = 2x - 4`. What `y` does it give at `x = 4`?', 4, {
      solution: '`2(4) - 4 = 4`. So `C(4, 4)` lies on the line and `D(4, 3)` does not.',
      responses: [
        { value: 3, why: 'consistent with reading the value off a sketch, where `D(4, 3)` sits close enough to the line to look as though it belongs.' },
        { value: 8, why: 'consistent with computing `2x` and not subtracting the intercept.' },
      ],
      followUp: {
        prompt: 'Peg `D` is at `(4, 3)`. What is the vertical gap in metres to the line `y = 2x - 4` at the same x-coordinate?',
        answer: 1, tolerance: 0.001, unit: 'm',
        solution: 'At `x = 4`, the line has `y = 4`. The vertical gap is `|4 - 3| = 1 m`. This is not the shortest perpendicular distance to the line.',
      },
    }),
    c('vertical', 'Two pegs sit at `(5, 1)` and `(5, 7)`. What is the slope of the line through them?', [
      { label: 'Undefined', correct: true },
      { label: 'Zero', why: 'consistent with confusing a vertical line with a horizontal one. Zero slope means no rise per unit of run, which describes a flat line.' },
      { label: 'Very large', why: 'consistent with treating division by zero as producing a huge number. There is no run to divide by at all, so no value exists.' },
    ], {
      solution: 'The run is `5 - 5 = 0`, so the slope is undefined and `y = mx + c` cannot describe the line. It is `x = 5`, and a third peg is tested by whether its `x` equals 5.',
      followUp: {
        prompt: 'A different pair sits at `(2, 6)` and `(9, 6)`. Enter the slope of the line through them.',
        answer: 0, tolerance: 0.001,
        solution: 'The rise is `6 - 6 = 0` and the run is `7`, so the slope is `0`. This is the horizontal case, where the slope exists and equals zero — the opposite situation to the vertical line above.',
      },
    }),
  ],

  'measuring-segments': [
    n('negative-coord', 'Stations `P` and `Q` sit at `-9 m` and `-3 m` on a pipe run. Find `PQ`.', 6, {
      unit: 'm',
      solution: '`|-9 - (-3)| = |-6| = 6` metres. Subtracting a negative adds.',
      responses: [
        { value: 12, why: 'consistent with reading `-9 - (-3)` as `-9 - 3`, which mishandles the double sign.' },
      ],
      followUp: {
        prompt: 'Station `R` is at `4 m`. Find `QR`.',
        answer: 7, tolerance: 0.001, unit: 'm',
        solution: '`|-3 - 4| = |-7| = 7` metres. Reading `-3 - 4` as `-1` would give a one-metre weld gap instead of seven.',
      },
    }),
    c('betweenness', 'Three marks give `DE = 8`, `EF = 5`, `DF = 11`. Is `E` between `D` and `F`?', [
      { label: 'No, and the three are not collinear at all', correct: true },
      { label: 'No, but they are still on one line', why: 'consistent with stopping at the failed addition. If the three were on one line in any order, one of the three additions would have worked; none does.' },
      { label: 'Yes', why: 'consistent with applying the addition rule without testing it. `8 + 5 = 13`, which is not `11`.' },
    ], {
      solution: '`8 + 5 = 13 ≠ 11`, so `E` is not between them. And since the two shorter lengths exceed the longest, the marks form a triangle.',
      followUp: {
        prompt: 'Marks `A`, `B`, `C` lie in that order with `AC = 30` and `AB = 11`. Find `BC`.',
        answer: 19, tolerance: 0.001,
        solution: '`BC = AC - AB = 30 - 11 = 19`, the same postulate rearranged.',
      },
    }),
    n('unknown', '`P`, `Q`, `R` lie in that order with `PQ = 2x + 1`, `QR = x - 3`, `PR = 25`. Find `x`.', 9, {
      solution: '`(2x + 1) + (x - 3) = 25` gives `3x - 2 = 25`, so `x = 9`.',
      responses: [
        { value: 19, why: 'consistent with solving for `PQ` rather than for `x`. `PQ = 2(9) + 1 = 19`.' },
        { value: 8, why: 'consistent with dropping the `-2` when collecting terms, solving `3x = 25` and rounding.' },
      ],
      followUp: {
        prompt: 'Using that `x`, find `QR`.',
        answer: 6, tolerance: 0.001,
        solution: '`QR = 9 - 3 = 6`, and `19 + 6 = 25` confirms the whole.',
      },
    }),
  ],

  'midpoints-and-congruence': [
    n('average', 'A rail is marked at `-3` and `9` metres. Enter the coordinate halfway between them.', 3, {
      unit: 'm',
      solution: '`(-3 + 9)/2 = 3`. It is six metres from each mark, and six is half of twelve.',
      responses: [
        { value: 6, why: 'consistent with computing the distance `12` and halving it. That is the length of each half, not a position on this rail: `6` is nine metres from `-3` and three from `9`.' },
        { value: 12, why: 'consistent with computing the distance between the marks rather than the point between them.' },
      ],
      followUp: {
        prompt: 'For the same two marks, enter the distance between them.',
        answer: 12, tolerance: 0.001, unit: 'm',
        solution: '`|-3 - 9| = 12`. An absolute difference answers "how far apart"; an average answers "where is the middle".',
      },
    }),
    n('midpoint-x', 'A beam runs from `A(-2, 5)` to `B(6, 1)`. Enter the `x` coordinate of its midpoint.', 2, {
      solution: '`(-2 + 6)/2 = 2`. Each coordinate is averaged separately.',
      responses: [
        { value: 4, why: 'consistent with halving the horizontal distance `8` rather than averaging the two coordinates.' },
      ],
      followUp: {
        prompt: 'Now enter the `y` coordinate of that midpoint.',
        answer: 3, tolerance: 0.001,
        solution: '`(5 + 1)/2 = 3`, so the sling point is `(2, 3)`. From `A` it is four across and two down, and from there to `B` is four across and two down again.',
      },
    }),
    n('missing-end', '`M(2, 3)` is the midpoint of `AB` and `A(-2, 5)`. Enter the `x` coordinate of `B`.', 6, {
      solution: '`(-2 + x)/2 = 2` gives `x = 6`. Nothing is halved here; an equation is solved.',
      responses: [
        { value: 1, why: 'consistent with halving the midpoint coordinate.' },
        { value: 0, why: 'consistent with averaging `M` with `A`, which lands on the quarter point of the beam — a real point on the drawing, and the wrong one.' },
      ],
      followUp: {
        prompt: 'Enter the `y` coordinate of `B`.',
        answer: 1, tolerance: 0.001,
        solution: '`(5 + y)/2 = 3` gives `y = 1`, so `B` is `(6, 1)`.',
      },
    }),
  ],

  'angles-geometry': [
    c('naming', 'Three arms are welded at `B`, running to `A`, `D` and `C`. Is `∠B` a legal name for one of the angles?', [
      { label: 'No, three rays leave `B` so the name is ambiguous', correct: true },
      { label: 'Yes, the vertex letter is enough', why: 'consistent with a diagram where only one angle sits at the vertex. Here `∠B` could mean `∠ABD`, `∠DBC` or `∠ABC`, and an ambiguous name is not a name.' },
    ], {
      solution: 'Each angle needs three letters, with `B` in the middle: `∠ABD`, `∠DBC`, `∠ABC`.',
      followUp: {
        prompt: 'Is `∠ABD` the same angle as `∠DBA`? Enter 1 for yes or 0 for no.',
        answer: 1, tolerance: 0.001,
        solution: 'Yes. Reversing the outer letters names the same pair of arms. Moving the middle letter, as in `∠BAD`, moves the vertex and gives a different angle.',
      },
    }),
    n('addition', '`m∠ABD = 35°` and `m∠DBC = 55°`, with `D` in the interior of `∠ABC`. Find `m∠ABC`.', 90, {
      unit: 'degrees',
      solution: '`35 + 55 = 90`, so `∠ABC` is a right angle — because the arithmetic says so, not because the sketch looks square.',
      responses: [
        { value: 20, why: 'consistent with subtracting the two measures rather than adding them.' },
        { value: 35, why: 'consistent with reporting one part instead of the whole.' },
      ],
      followUp: {
        prompt: 'If instead `m∠ABC = 120°` and `m∠ABD = 35°`, find `m∠DBC`.',
        answer: 85, tolerance: 0.001, unit: 'degrees',
        solution: '`120 - 35 = 85`. The same postulate rearranged.',
      },
    }),
    c('diagram', 'On a drawing an angle looks square but carries no small square and no stated measure. May you use `90°` in a calculation?', [
      { label: 'No, an unmarked angle asserts nothing', correct: true },
      { label: 'Yes, if it clearly looks like a right angle', why: 'consistent with treating the drawing as evidence. Only a mark, a stated measure or a derived value may be used; appearance is not a claim.' },
    ], {
      solution: 'What is marked may be used; what is merely drawn may not. This is the same rule that governs equal-looking lengths.',
      followUp: {
        prompt: 'In the joint above, `m∠ABD = 35°` and `m∠DBC = 55°` are given. Enter `m∠ABC` in degrees, and note that this time you are entitled to the answer.',
        answer: 90, tolerance: 0.001, unit: 'degrees',
        solution: '`35 + 55 = 90`. So the angle really is a right angle — established by the givens, not by how the drawing looks. A correct conclusion reached from the page would still have been reached the wrong way.',
      },
    }),
  ],

  'angles': [
    n('to-radians', 'A dish turns `225°`. Express that in radians, as a decimal.', 3.927, {
      tolerance: 0.01, unit: 'rad',
      solution: '`225 × π/180 = 5π/4 ≈ 3.927`. More than half a revolution and less than one, so it must lie between `π` and `2π`.',
      responses: [
        { value: 12892, why: 'consistent with using the reciprocal factor `180/π`. The two factors differ by about 3283, so a reversal is obvious from the size.' },
        { value: 0.625, why: 'consistent with dividing by 360 rather than converting.' },
      ],
      followUp: {
        prompt: 'A log reads `11π/6` radians. Express it in degrees.',
        answer: 330, tolerance: 0.5, unit: 'degrees',
        solution: '`(11π/6) × 180/π = 330°`.',
      },
    }),
    n('arc', 'A marker sits at `r = 2.5 m` on the dish rim. The dish turns `60°`. How far does the marker travel?', 2.618, {
      tolerance: 0.02, unit: 'm',
      solution: 'Convert first: `60° = π/3 ≈ 1.047`. Then `s = rθ = 2.5 × 1.047 ≈ 2.62 m`, which is a sixth of the `15.7 m` circumference.',
      responses: [
        { value: 150, why: 'consistent with substituting `60` without converting. That is an arc sixty times the radius of its own circle, for a sixth of a turn.' },
      ],
      followUp: {
        prompt: 'The same marker, with the dish turning `450°`. How far does it travel?',
        answer: 19.63, tolerance: 0.1, unit: 'm',
        solution: '`450° = 5π/2 ≈ 7.854` rad, so `s = 2.5 × 7.854 ≈ 19.6 m`. Distance uses the full rotation, not the reduced angle.',
      },
    }),
    c('boundary', 'The dish turns `-450°` from its initial ray. Where does the marker finish?', [
      { label: 'On the negative y-axis, in no quadrant', correct: true },
      { label: 'Quadrant IV', why: 'consistent with treating `270°` as inside the interval from `270°` to `360°` rather than at its edge. Boundary directions belong to no quadrant.' },
      { label: 'Quadrant III', why: 'consistent with the same edge confusion on the other side.' },
    ], {
      solution: '`-450 + 720 = 270`, which is the negative y-axis: due south if the initial ray points east.',
      followUp: {
        prompt: 'Reduce `690°` by whole turns and enter the result in degrees.',
        answer: 330, tolerance: 0.5, unit: 'degrees',
        solution: '`690 - 360 = 330°`. Reduce for direction; keep the original when the question is about the sweep.',
      },
    }),
  ],

  'material-balances': [
    n('total', 'Feed A is `100 kg/h` and feed B is `50 kg/h` into a steady mixer with no reaction. Find the outlet flow.', 150, {
      tolerance: 0.5, unit: 'kg/h',
      solution: 'Steady state with no reaction gives input = output: `100 + 50 = 150 kg/h`.',
      responses: [
        { value: 50, why: 'consistent with subtracting the streams rather than adding them.' },
        { value: 350, why: 'consistent with adding the tank inventory of about 200 kg to the flows. A mass in kg and a flow in kg/h cannot be added, and at steady state the inventory does not enter the balance.' },
      ],
      followUp: {
        prompt: 'A different tank receives `10 kg/h` and discharges `7 kg/h`. Enter its accumulation.',
        answer: 3, tolerance: 0.001, unit: 'kg/h',
        solution: '`10 - 7 = 3 kg/h`. Here input does not equal output, so the short form is unavailable.',
      },
    }),
    n('fraction', 'Feed A is `100 kg/h` at `20%` solute by mass; feed B is `50 kg/h` of pure water. Find the outlet solute mass fraction, as a percentage.', 13.33, {
      tolerance: 0.1, unit: '%',
      solution: 'Solute: `100 × 0.20 = 20 kg/h`. Total: `150 kg/h`. Fraction: `20/150 = 13.33%`. The solute flow did not change; the total it sits in grew.',
      responses: [
        { value: 20, why: 'consistent with reporting the feed fraction unchanged, or the solute flow in kg/h as though it were a percentage.' },
        { value: 10, why: 'consistent with taking the unweighted average of 20% and 0%, which would need the two flows to be equal.' },
      ],
      followUp: {
        prompt: 'Enter the outlet solute flow in `kg/h` for the same mixer.',
        answer: 20, tolerance: 0.1, unit: 'kg/h',
        solution: '`20 + 0 = 20 kg/h`, unchanged. Dilution moves the fraction and leaves the component flow alone.',
      },
    }),
    n('weighted', 'Feed A is `80 kg/h` at `15%` solute; feed B is `70 kg/h` of pure water. Find the outlet mass fraction, as a percentage.', 8, {
      tolerance: 0.1, unit: '%',
      solution: 'Solute in: `80 × 0.15 = 12 kg/h`. Total: `150 kg/h`. Fraction: `12/150 = 8.00%`.',
      responses: [
        { value: 7.5, why: 'consistent with averaging 15% and 0% without weighting. That would be right only if the flows were equal; at 80 against 70 the richer stream pulls the result above the midpoint.' },
        { value: 12, why: 'consistent with reporting the solute flow in kg/h rather than the fraction.' },
      ],
      followUp: {
        prompt: 'If both feeds were `75 kg/h`, one at `15%` and one pure, what would the outlet fraction be, as a percentage?',
        answer: 7.5, tolerance: 0.1, unit: '%',
        solution: '`75 × 0.15 = 11.25 kg/h` in `150 kg/h`, which is `7.5%`. With equal flows the unweighted average happens to be right — which is exactly the condition it needs.',
      },
    }),
  ],
};
