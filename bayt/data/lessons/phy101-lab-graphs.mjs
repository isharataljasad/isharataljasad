/* درس بيت الفؤاد · PHY 101 · رسوم المختبر والاستدلال من البيانات.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: التمثيل نفسه مرتين، منحنيًا ثم مستقيمًا بعد التخطيط.
   المقصود أن الاستقامة ليست صدفة بل اختيار للمحورين. */
const figure = `<svg viewBox="0 0 480 240" role="img" aria-labelledby="fig-lab-title" class="bayt-svg">`
  + `<title id="fig-lab-title">Two representations: the first is curved when plotting periodic time with length, and the second is straight when plotting periodic time as a square</title>`
  /* يسارًا: منحنٍ. */
  + `<line x1="50" y1="180" x2="215" y2="180" stroke="#284955" stroke-width="2"/>`
  + `<line x1="50" y1="185" x2="50" y2="35" stroke="#284955" stroke-width="2"/>`
  + `<polyline points="50,180 90,133 130,111 170,96 210,85" fill="none" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="222" y="186" font-size="15" fill="#284955">L</text>`
  + `<text x="38" y="32" font-size="15" fill="#284955">T</text>`
  + `<text x="130" y="210" font-size="14" fill="#c0392b" text-anchor="middle">Curved: Not one slope</text>`
  /* يمينًا: مستقيم بعد تربيع المحور الرأسي. */
  + `<line x1="280" y1="180" x2="445" y2="180" stroke="#284955" stroke-width="2"/>`
  + `<line x1="280" y1="185" x2="280" y2="35" stroke="#284955" stroke-width="2"/>`
  + `<line x1="282" y1="174" x2="436" y2="58" stroke="#10766f" stroke-width="3"/>`
  + `<circle cx="312" cy="151" r="4" fill="#153748"/><circle cx="350" cy="122" r="4" fill="#153748"/>`
  + `<circle cx="388" cy="94" r="4" fill="#153748"/><circle cx="424" cy="66" r="4" fill="#153748"/>`
  + `<text x="452" y="186" font-size="15" fill="#284955">L</text>`
  + `<text x="262" y="32" font-size="15" fill="#284955">T²</text>`
  + `<text x="360" y="210" font-size="14" fill="#10766f" text-anchor="middle">Straight: slope has a meaning</text>`
  + `<text x="240" y="232" font-size="13" fill="#566f7a" text-anchor="middle">Integrity is a choice of two axes, no coincidence in the data</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'lab-graphs',

  objectives: [
    "You choose the two axes that make the relationship linear before you calculate any slope.",
    "You calculate the slope from two points on the alignment line, and read its unit and physical meaning.",
    "It differentiates between a reading within the measurement range and an extrapolation outside it, and does not claim more than what the data supports.",
  ],

  boundaries: [
    "Least squares regression and calculating the coefficient of determination are not in this lesson.",
    "Calculate uncertainty, error bars, and spread outside the range here.",
    "Statistical distributions and significance tests are not in this lesson.",
    "The logarithmic representation of exponent extraction is given a sign and is not detailed.",
  ],

  prerequisites: [
    {
      title: "Calculate the slope from two points",
      why: "Every quantum deduction in the laboratory goes by the mile, and a mistake in its calculation spoils the whole physical result.",
      recap: "slope = (y₂ − y₁)/(x₂ − x₁). "
        + "Take two points **on the matching line**, not two data points, and space them as far apart as possible to reduce the reading effect. "
        + "The unit of slope is the unit of the vertical axis divided by the unit of the horizontal, which reveals its physical meaning.",
      href: '/semester-1/physics/motion/',
      hrefLabel: "slope and area in motion lesson",
    },
    {
      title: "Reading complex units",
      why: "The unit of slope is what tells you what you measured; Whoever neglects it may name the result by another quantity.",
      recap: "The slope represents displacement with time and its unit is m/s, so it is velocity. "
        + "The slope of the representation of force with elongation and its unit is N/m, so it is a spring constant. "
        + "Write the unit before you name the quantity, not after you name it.",
      href: '/semester-1/physics/measurement/',
      hrefLabel: "Study units and measurement",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Independent and dependent variable",
        en: 'Independent and dependent variables',
        text: "Plot the independent variable on the horizontal axis and the dependent variable on the vertical axis. For a nonzero straight-line slope, swapping axes takes its reciprocal and changes its units. The relationship and the experimental design determine what each axis means.",
      },
      {
        term: "Line of best fit",
        en: 'Line of best fit',
        text: "A fitted line represents the trend of scattered measurements. It need not pass through an individual data point or through the origin. Use widely separated points on the fitted line to estimate its slope. A formal fit should state its method and any uncertainty assumptions.",
      },
      {
        term: "Planning",
        en: 'Linearisation',
        text: "Choose a function for the axis so that the relationship becomes straight, such as plotting T² instead of T. "
          + "Its benefit is that the slope is then a single number with a meaning, while the slope of the curve changes from one point to another.",
      },
      {
        term: "Extrapolation out of range",
        en: 'Extrapolation',
        text: "Estimating a value outside the range of measurements. "
          + "It is always weaker than internal reading, because the relationship may break outside of what you have experienced. "
          + "A spring is linear up to a certain limit after which it deforms, and the internal data does not tell you that.",
      },
      {
        term: "Intersection with the vertical axis",
        en: 'Intercept',
        text: "The vertical intercept is the dependent-variable value predicted when the independent variable is zero. It can represent a physical initial value or suggest a systematic offset. Interpret it using the model and the measured range.",
      },
    ],
    relations: [
      {
        formula: 'slope = (y₂ − y₁) / (x₂ − x₁)',
        name: "slope",
        note: "From two points on the conciliation line, far apart.",
      },
      {
        formula: 'unit(slope) = unit(y) / unit(x)',
        name: "slope unit",
        note: "It is evidence of the nature of the measured quantity.",
      },
      {
        formula: 'T = 2π √(L/g)  ⟹  T² = (4π²/g) L',
        name: "Pendulum layout",
        note: "Plot T² with L and the line of slope 4π²/g. comes out",
      },
      {
        formula: 'y = m x + c',
        name: "Font image",
        note: "Slope and intercept both have physical meaning.",
      },
    ],
    derivation: {
      title: "Why do we plot instead of calculating the slope directly from the curve?",
      intro: "It may be said: Why don't we take the slope of the curve and finish? The answer is that the slope is not a single number.",
      steps: [
        {
          do: "Draw the time of the pendulum T with the length L:, producing a curve that increases and then flattens.",
          why: "Because the relationship is T ∝ √L not T ∝ L, and the root makes this curvature.",
        },
        {
          do: "Try taking the slope of the curve: you'll get a different value at each position.",
          why: "The curve does not have a single slope, and a single number cannot be attributed to it. "
            + "Any number you get will depend on the two points you chose, and this is not a measurement.",
        },
        {
          do: "Square both sides of T = 2π√(L/g) and you get T² = (4π²/g) L.",
          why: "The relationship became y = m x with two new variables : T² and L.",
        },
        {
          do: "Draw T² with L: coming out with a line of slope 4π²/g, so g = 4π²/slope.",
          why: "The slope is now a single, meaningful number, and from it we extract a physical constant. "
            + "Straightness is not a property of the data, but rather the result of our choice of the two axes.",
        },
      ],
    },
  },

  visual: {
    title: "Integrity is a choice, not a coincidence",
    figure: {
      svg: figure,
      caption: "The same data is plotted twice. On the left, T and L come out with a curve that has no slope. "
        + "On the right is T² with L, so its slope line comes out as 4π²/g.",
      alt: "Two drawings side by side. The left axis has a vertical axis of periodic time and a horizontal axis of length, and has a red curve that goes up "
        + "Then it flattens, and underneath it is a statement saying that it is curved and has no slope. "
        + "The right axis has the vertical square of the periodic time and the horizontal axis is the length, and it contains data points with a green straight line passing between them, "
        + "Underneath it is a phrase that says it is straight and the slope has a meaning. "
        + "A final line reminds us that straightness is a choice of two axes, not a coincidence in the data.",
    },
    table: {
      caption: "What does slope mean in different experiments?",
      head: ["Vertical axis", "Horizontal axis", "slope unit", "The quantity it represents"],
      rows: [
        ["Offset (m)", "Time (s)", 'm/s', "Speed"],
        ["Speed (m/s)", "Time (s)", 'm/s²', "Acceleration"],
        ["Power (N)", "Elongation (m)", 'N/m', "Spring constant"],
        ['T² (s²)', "Length (m)", 's²/m', "4π²/g and from g"],
        ["Potentiometer (V)", "Current (A)", 'V/A = Ω', "Resistance"],
      ],
    },
    reading: "Read the third column alone: The unit defines the quantity before it names it. "
      + "That's why write the unit for the slope first, then ask: What physical quantity is this unit? "
      + "The fourth row shows that the tendency may not be the desired thing itself, but rather a step towards it: "
      + "The slope is 4π²/g and the required g, so a heart and a beat remain after reading the drawing.",
  },

  guided: {
    start: "Before drawing: Write down the theoretically expected relationship, then arrange it in the form y = m x + c "
      + "Determine what to place on each axis. "
      + "After drawing: Draw the alignment line, then take two far apart points from it, then calculate the slope in its unit. "
      + "Then translate the slope into the quantity required. "
      + "In the description: say what the data supports within its scope, and do not generalize beyond it.",
    workedExamples: [
      {
        title: "Example 1 · mile and its meaning",
        task: "Representing the displacement with time, and on the matching line there are two points : (2.0 s, 4.0 m) and (6.0 s, 20.0 m). "
          + "What quantity does the slope represent and what is its value?",
        steps: [
          {
            do: "Calculate: (20.0 − 4.0)/(6.0 − 2.0) = 16.0/4.0 = 4.0.",
            why: "The difference in the vertical over the difference in the horizontal, in this order and not the other way around.",
          },
          {
            do: "Module m/s.",
            why: "Vertical axis unit on horizontal unit; It is what is called quantity.",
          },
          {
            do: "So the slope speed value is 4.0 m/s.",
            why: "A non-zero intersection with the vertical axis means that the body did not start from the origin. "
              + "This is additional information, not an error.",
          },
        ],
        answer: 'slope = 4.0 m/s (velocity)',
      },
      {
        title: "Example 2 · Extracting a physical constant by plotting",
        task: "T² and L were drawn for a pendulum, so the slope was 4.00 s²/m. What is the value of g?",
        steps: [
          {
            do: "From T² = (4π²/g) L the slope is = 4π²/g.",
            why: "Comparing the relationship to the image y = m x determines what the slope represents before any calculation.",
          },
          {
            do: "Turn: g = 4π²/slope = 39.48/4.00.",
            why: "What is required in the first place, the solution requires the heart, not direct division by 4π².",
          },
          {
            do: "Output g = 9.87 m/s².",
            why: "It is close to the accepted value 9.81, and the difference is within what would be expected from a laboratory measurement. "
              + "The unit realizes : 1/(s²/m) = m/s², which is an acceleration unit.",
          },
        ],
        answer: 'g = 9.87 m/s²',
      },
    ],
    skipped: [
      {
        q: "Is the reconciliation line forced to pass through the origin?",
        a: "No, unless physics dictates it. "
          + "Representing force with elongation must go through the origin because zero elongation means zero force. "
          + "If it does not pass, this reveals a systematic error, such as an incorrect zero on the scale. "
          + "Forcing him to go through the original despite the data hides the error and does not correct it.",
      },
      {
        q: "How many data points are enough?",
        a: "Two points define a line but do not prove a line. "
          + "Sin is a claim about the relationship, and proving it requires sufficient points distributed over the entire period. "
          + "Five to seven points is a reasonable guideline in a first-year laboratory, with repeated measurement at each point.",
      },
      {
        q: "What is wrong with saying “the relationship is linear” after one experiment?",
        a: "It generalizes over an unmeasured extent. "
          + "Honest wording: “The relationship is linear in the range measured from such and such to that.” "
          + "The spring is linear until the limit of elasticity and then stops, and the resistance is constant until it heats up. "
          + "And what you do not measure, do not describe.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'slope-two-points',
      family: "The first type is a two-point slope",
      aim: "Arrange the two teams and do not reverse them.",
      objectives: [1],
      prompt: "On a matching line to represent displacement with time, there are two points : (2.0 s, 4.0 m) and (6.0 s, 20.0 m). "
        + "What is the slope?",
      unit: 'm/s',
      answer: 4,
      tolerance: 0.05,
      solution: '‎(20.0 − 4.0)/(6.0 − 2.0) = 16.0/4.0 = 4.0 m/s‎.',
      commonErrors: [
        { value: 0.25, why: "You divided the horizontal difference by the vertical. "
          + "The slope is the vertical over the horizontal, and the unit of your product is s/m, which is the reciprocal of the velocity." },
        { value: 3, why: "You added the values instead of subtracting them. : 24/8 = 3. The slope is a difference upon a difference." },
        { value: 16, why: "You calculated the vertical difference alone and did not divide it by the horizontal difference." },
      ],
    },
    {
      id: 'spring-constant',
      family: "The second type is a tendency in the physical sense",
      aim: "Reads the unit and translates it into a quantity.",
      objectives: [1],
      prompt: "On the representation of force with elongation are two points : (0.020 m, 5.0 N) and (0.080 m, 20.0 N). "
        + "What is the spring constant?",
      unit: 'N/m',
      answer: 250,
      tolerance: 2,
      solution: '‎(20.0 − 5.0)/(0.080 − 0.020) = 15.0/0.060 = 250 N/m‎.',
      commonErrors: [
        { value: 0.004, why: "You divide the elongation by the force. The unit of your output is m/N, which is the reciprocal of the spring constant." },
        { value: 2500, why: "You misplaced the decimal point when dividing by 0.060." },
        { value: 25, why: "You divided by 0.60 instead of 0.060, that is, with an error of a factor of ten in the elongation." },
      ],
    },
    {
      id: 'linearise-pendulum',
      family: "The third type: Fixed extraction by layout",
      aim: "The relationship fluctuates after comparing it to the line image.",
      objectives: [0, 1],
      prompt: "T² and L were drawn for a pendulum, so the slope was 4.00 s²/m. What is the value of g? "
        + "Use 4π² = 39.48.",
      unit: 'm/s²',
      answer: 9.87,
      tolerance: 0.1,
      solution: "slope = 4π²/g, g = 4π²/slope = 39.48/4.00 = 9.87 m/s².",
      commonErrors: [
        { value: 4, why: "You wrote the same mile. The slope is 4π²/g, not g, so it remains a heart and a beat." },
        { value: 39.48, why: "You wrote 4π² and did not divide it by the mile." },
        { value: 158, why: "You multiplied the slope by 4π² instead of dividing. "
          + "The quick scan : g is close to 9.8, so any result far from it requires reviewing the arrangement." },
      ],
    },
    {
      id: 'interpolate',
      family: "The fourth type is reading within the range",
      aim: "You read from a line a value between two measurements, not outside them.",
      objectives: [2],
      prompt: "The alignment line passes through the points (0, 2.0) and (4.0, 10.0), and the measurements were taken between x = 0 and x = 4.0. "
        + "What is the value of y at x = 2.0?",
      unit: "y module",
      answer: 6,
      tolerance: 0.05,
      solution: "The slope is = 8.0/4.0 = 2.0, and the intercept is 2.0, so y = 2.0(2.0) + 2.0 = 6.0. "
        + "x = 2.0 is within the measurement range, so this is an internal reading on which the data is based.",
      commonErrors: [
        { value: 4, why: "You neglected the intersection and counted m x alone. "
          + "The line does not pass through the origin, so y = m x + c not y = m x." },
        { value: 2, why: "You wrote the slope or intercept instead of y with x = 2.0." },
        { value: 10, why: "You wrote the value of y at the end of the range x = 4.0." },
      ],
    },
    {
      id: 'intercept',
      family: "Fifth pattern · Two-point intersection",
      aim: "You calculate the slope and then return to the intercept.",
      objectives: [1],
      prompt: "A conciliation line passes through the points (1.0, 5.0) and (3.0, 11.0). "
        + "What is its intersection with the vertical axis?",
      unit: "y module",
      answer: 2,
      tolerance: 0.05,
      solution: "slope = (11.0 − 5.0)/(3.0 − 1.0) = 3.0. "
        + "And from 5.0 = 3.0(1.0) + c it is c = 2.0.",
      commonErrors: [
        { value: 3, why: "You wrote the slope, not the intercept. The intersection value of y is at x = 0." },
        { value: 5, why: "You wrote the value of y at the first point. It is at x = 1.0, not x = 0." },
        { value: 0, why: "You assume that the line passes through the origin. "
          + "The colon does not allow this: if it had passed through the original, it would have been y = 5x and it would not have passed through the second point." },
      ],
    },
  ],
};
