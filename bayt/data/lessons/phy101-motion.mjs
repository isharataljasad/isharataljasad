/* درس بيت الفؤاد · PHY 101 · المتجهات والحركة.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: منحنى الموضع ومنحنى السرعة جنبًا إلى جنب.
   المقصود أن الطالب يربط الميل بالسرعة والمساحة بالإزاحة في نظرة واحدة. */
const figure = `<svg viewBox="0 0 520 230" role="img" aria-labelledby="fig-motion-title" class="bayt-svg">`
  + `<title id="fig-motion-title">The position curve with time and the velocity curve with time, and the slope and area are marked on them</title>`
  /* منحنى الموضع: خط مستقيم، وميله هو السرعة. */
  + `<line x1="50" y1="180" x2="240" y2="180" stroke="#284955" stroke-width="2"/>`
  + `<line x1="50" y1="185" x2="50" y2="35" stroke="#284955" stroke-width="2"/>`
  + `<line x1="50" y1="170" x2="220" y2="62" stroke="#105c78" stroke-width="3"/>`
  + `<text x="38" y="44" font-size="15" fill="#284955">x</text>`
  + `<text x="246" y="186" font-size="15" fill="#284955">t</text>`
  + `<text x="62" y="58" font-size="14" fill="#105c78" text-anchor="start">Slope = velocity</text>`
  /* منحنى السرعة: خط أفقي، والمساحة تحته هي الإزاحة. */
  + `<rect x="300" y="92" width="160" height="88" fill="#cfe6ef"/>`
  + `<line x1="300" y1="180" x2="490" y2="180" stroke="#284955" stroke-width="2"/>`
  + `<line x1="300" y1="185" x2="300" y2="35" stroke="#284955" stroke-width="2"/>`
  + `<line x1="300" y1="92" x2="460" y2="92" stroke="#10766f" stroke-width="3"/>`
  + `<text x="288" y="44" font-size="15" fill="#284955">v</text>`
  + `<text x="496" y="186" font-size="15" fill="#284955">t</text>`
  + `<text x="312" y="62" font-size="14" fill="#10766f" text-anchor="end">Area is displacement</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'motion',

  objectives: [
    "Distinguish distance from displacement, and speed from velocity.",
    "You read the position curve and the velocity curve: slope, area, and what they indicate.",
    "You choose the equation of motion with constant acceleration from the data and the unknown.",
  ],

  boundaries: [
    "Motion in two dimensions and projectiles are not in this lesson.",
    "Relative movement and frameshifting are not here.",
    "We limit ourselves to constant acceleration; Variable acceleration requires integration and is outside the first decision.",
    "Falling with air resistance is outside the scope of the lesson.",
  ],

  prerequisites: [
    {
      title: "Consistency of units before substitution",
      why: "Equations of motion don't know your units; Mixing minutes with seconds silently gives an incorrect output.",
      recap: "Unite all quantities before substituting: time in seconds, distance in metres, and speed in m/s. "
        + "The 72 km/h = 20 m/s is divided by 3.6. "
        + "Write down the units in each step to catch the error before it costs you arithmetic.",
      href: '/semester-1/physics/measurement/',
      hrefLabel: "Study units and measurement",
    },
    {
      title: "Slope and area in a graph",
      why: "Half of the questions in this lesson are solved using the drawing alone, without any equation.",
      recap: "The slope of the line = Δy / Δx, i.e. the amount of ascent divided by the amount of advance. "
        + "The area of the rectangle is =, the length is ×, the width is = ½ ×, and the area of the triangle is = ½ ×, the base is ×, the height is ×. "
        + "A negative slope means going down, and the area under the axis is negative.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Displacement",
        en: 'Displacement',
        text: "Displacement is the change in position, Δx=x_f−x_i. It is a vector and depends only on the starting and ending positions. Returning to the starting position gives zero displacement even when the distance travelled is large.",
      },
      {
        term: "Distance",
        en: 'Distance',
        text: "Distance is the nonnegative length of the path travelled. It is at least the magnitude of displacement. In straight-line motion with no reversal, distance equals displacement magnitude.",
      },
      {
        term: "Velocity",
        en: 'Velocity',
        text: "Average velocity is displacement divided by elapsed time: v_avg=Δx/Δt. Instantaneous velocity is dx/dt, the slope of a position–time graph. In one dimension its sign indicates direction relative to the chosen positive axis.",
      },
      {
        term: "Speed",
        en: 'Speed',
        text: "Speed is the magnitude of instantaneous velocity and is nonnegative. Average speed is total distance divided by elapsed time. A completed round trip can have positive average speed but zero average velocity.",
      },
      {
        term: "Acceleration",
        en: 'Acceleration',
        text: "Average acceleration is Δv/Δt; instantaneous acceleration is dv/dt, measured in m/s². Acceleration can change the magnitude or direction of velocity. In one dimension, opposite signs of velocity and acceleration mean the object is slowing down.",
      },
    ],
    relations: [
      {
        formula: 'v = v₀ + a t',
        name: "No displacement",
        note: "Use it when the offset is not mentioned or requested.",
      },
      {
        formula: 'x = x₀ + v₀ t + ½ a t²',
        name: "No final speed",
        note: "Use it when a duration is given and an offset is requested.",
      },
      {
        formula: 'v² = v₀² + 2 a Δx',
        name: "Without time",
        note: "Use it when time is not mentioned; It is the fastest way to stop distance.",
      },
      {
        formula: 'slope of x–t = v ,  slope of v–t = a ,  area under v–t = Δx',
        name: "Read drawings",
        note: "Three readings replace equations in many questions.",
      },
    ],
    derivation: {
      title: "Why does the area under the velocity curve equal the displacement?",
      intro: "A rule that is often memorized for no reason, although its reason is seen in two lines.",
      steps: [
        {
          do: "Take a motion with constant speed v during the duration t: displacement Δx = v t.",
          why: "This is the simple case we're building on, which is the definition of speed upside down.",
        },
        {
          do: "Draw v against time: a horizontal line emerges, and the area below it is a rectangle with length t and height v.",
          why: "The area of the rectangle is v × t, which is literally the same expression we used to calculate the displacement.",
        },
        {
          do: "If the speed changes, divide the time into short periods in which the speed is almost constant.",
          why: "Each interval gives a small rectangle, and the sum of the rectangles is the sum of the displacements.",
        },
        {
          do: "Add the rectangles and reduce their width: the sum equals the area under the curve.",
          why: "The rule is not a convention but a result: area is a way to add v × Δt over all periods. "
            + "This is why it is valid for any shape of the curve, not just the straight line.",
        },
      ],
    },
  },

  visual: {
    title: "Slope and area: two readings that replace an equation",
    figure: {
      svg: figure,
      caption: "In a position-time curve, slope indicates speed. "
        + "In a velocity-time curve, the area under it indicates displacement, and its slope indicates acceleration.",
      alt: "Two drawings side by side. The left axis has a vertical axis of position and a horizontal axis of time, and has a straight line rising. "
        + "It should be noted that its tendency is speed. The right axis has a vertical axis of speed and a horizontal axis of time. "
        + "It contains a horizontal line and the area below it is shaded, so note that this area is the displacement.",
    },
    table: {
      caption: "Which equation to choose: Look at the missing quantity",
      head: ["Equation", "The missing quantity", "You choose it when"],
      rows: [
        ['v = v₀ + a t', "Offset Δx", "Duration is given and speed is requested, or vice versa"],
        ['x = x₀ + v₀ t + ½ a t²', "Final speed v", "The duration is given and the offset is requested"],
        ['v² = v₀² + 2 a Δx', "Time t", "Time is neither mentioned nor requested"],
        ['Δx = ½ (v₀ + v) t', "Accelerometer a", "The two speeds and duration are known"],
      ],
    },
    reading: "Practical method: Write the five quantities v₀, v, a, t, and Δx, and mark the knowns. "
      + "And the unknown is required. There remains one quantity that is neither known nor required, and it is what tells you the equation: "
      + "Choose the equation that does not contain it. This saves you from solving a system of two equations in most questions.",
  },

  guided: {
    start: "Determine the positive direction first and write it on the paper, so all signs after it are measured to it. "
      + "Then take stock of the five quantities and mark what is known and what is required. "
      + "Then choose the equation that excludes the remaining quantity. "
      + "It is not replaced before the units are unified; The equation does not alert you to mixing minutes with seconds.",
    workedExamples: [
      {
        title: "Example: 1 · Stopping distance",
        task: "A car with speed 20 m/s brakes with acceleration −4.0 m/s² to a stop. How far do you travel?",
        steps: [
          {
            do: ": v₀ = 20, v = 0, a = −4.0, Δx are required, and t is neither known nor required.",
            why: "The missing quantity is time, which determines the equation without experimentation.",
          },
          {
            do: "Choose v² = v₀² + 2aΔx because it alone does not contain t.",
            why: "Choosing an equation without the missing quantity will avoid solving two equations together.",
          },
          {
            do: "Replace : 0 = 400 + 2(−4.0)Δx, which is 8Δx = 400.",
            why: "The final velocity is zero because the car stopped; This information is extracted from words, not from numbers.",
          },
          {
            do: "Solve: Δx = 50 m.",
            why: "The resultant is positive even though the acceleration is negative, and this is true: "
              + "The car moves forward while its acceleration opposes its movement.",
          },
        ],
        answer: 'Δx = 50 m',
      },
      {
        title: "Example 2 · reading area under the velocity curve",
        task: "A body starts from rest and its speed increases linearly until it reaches 12 m/s after 6.0 s. "
          + "What is its displacement during this period?",
        steps: [
          {
            do: "v with t: Draw a line from (0, 0) to (6.0, 12), and the shape is a triangle underneath.",
            why: "The speed changes linearly, so the shape is a triangle, not a rectangle, and the difference between them is a factor of half.",
          },
          {
            do: "Calculate the area : ½ × 6.0 × 12 = 36 m.",
            why: "The area under the velocity curve is the displacement, as in the derivation above.",
          },
          {
            do: "Verify with the formula : a = 12/6.0 = 2.0 m/s² and x = ½(2.0)(6.0)² = 36 m.",
            why: "The two paths agree, and this is no coincidence: the equation ½at² is the area of the triangle itself written in symbols.",
          },
        ],
        answer: 'Δx = 36 m',
      },
    ],
    skipped: [
      {
        q: "Does negative acceleration always mean that an object is slowing down?",
        a: "No. This means that the acceleration is in the negative direction. "
          + "If the speed is also negative, then the body increases in speed in the negative direction. "
          + "The rule: If the acceleration sign agrees with the speed sign, the speed increases, and if they differ, it decreases.",
      },
      {
        q: "How can the speed be zero and the acceleration not zero?",
        a: "At the moment of trend reversal. A stone thrown upward has zero velocity at the highest point. "
          + "And 9.8 m/s² accelerated downwards at that same moment. "
          + "If the acceleration were zero there, the stone would remain suspended.",
      },
      {
        q: "When does distance equal displacement?",
        a: "When the movement is in a straight line and in one direction, there is no return. "
          + "Any reversal in direction makes the distance greater than the amount of displacement. "
          + "Because the distance adds all the positive lengths, while the displacement subtracts the return from the outgoing.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'displacement',
      family: "The first type is an offset, not a space",
      aim: "You subtract the return from the outgoing instead of adding them together.",
      objectives: [0],
      prompt: "A person walks 300 m east and then 100 m returns west. "
        + "What is its displacement in metres?",
      unit: 'm',
      answer: 200,
      tolerance: 0.5,
      solution: "Make East positive: Δx = +300 − 100 = +200 m. "
        + "The distance traveled is 400 m, which is another quantity.",
      commonErrors: [
        { value: 400, why: "You added the two lengths, and this is the distance traveled, not the displacement. "
          + "Displacement looks at the start and limit points alone, and returning west subtracts and does not add." },
        { value: 100, why: "You wrote the entire second half alone." },
        { value: 300, why: "You wrote throughout the first half and neglected to come back." },
      ],
    },
    {
      id: 'final-velocity',
      family: "The second type is final speed",
      aim: "It adds to the initial speed instead of neglecting it.",
      objectives: [2],
      prompt: "An object with initial velocity 5.0 m/s and acceleration 3.0 m/s². "
        + "What is its speed after 4.0 s?",
      unit: 'm/s',
      answer: 17,
      tolerance: 0.1,
      solution: '‎v = v₀ + at = 5.0 + (3.0)(4.0) = 5.0 + 12 = 17 m/s‎.',
      commonErrors: [
        { value: 12, why: "You calculated at alone and neglected v₀. "
          + "The limit at is the increase in speed, not the speed itself." },
        { value: 60, why: "v₀ × a × t. You multiplied the equation by addition, not multiplication, of three." },
        { value: 32, why: "You used ½at² instead of at; That is the displacement limit, not the speed limit." },
      ],
    },
    {
      id: 'stopping-distance',
      family: "The third type: Distance without time",
      aim: "Choose the equation that does not contain the missing quantity.",
      objectives: [2],
      prompt: "A car with speed 30 m/s brakes with acceleration −5.0 m/s² to a stop. "
        + "What is the stopping distance in metres?",
      unit: 'm',
      answer: 90,
      tolerance: 0.5,
      solution: "0 = (30)² + 2(−5.0)Δx, any 10Δx = 900, then Δx = 90 m.",
      commonErrors: [
        { value: 180, why: "You neglected the factor 2 in 2aΔx, so you divided by 5 instead of 10." },
        { value: 6, why: "You calculated the stopping time 30/5.0 = 6.0 s, not the distance. "
          + "Pay attention to the unit required: the question is about meters, not seconds." },
        { value: 45, why: "You divide the speed by the acceleration and then multiply by something, or use v₀/2a "
          + "v₀²/2a. Replace the speed into square." },
      ],
    },
    {
      id: 'area-under-graph',
      family: "Fourth type: Area under the velocity curve",
      aim: "Distinguish the triangle from the rectangle, that is, do not forget the half factor.",
      objectives: [1],
      prompt: "A body starts from rest and its speed increases linearly up to 16 m/s through 5.0 s. "
        + "What is its displacement during this period in metres?",
      unit: 'm',
      answer: 40,
      tolerance: 0.5,
      solution: "The figure under the velocity curve is a triangle with base 5.0 s and height 16 m/s. "
        + "The area is ½ × 5.0 × 16 = 40 m.",
      commonErrors: [
        { value: 80, why: "You calculated the area of rectangle 5.0 × 16. "
          + "The speed was not 16 m/s throughout the period, but reached it at the end of the period, as the shape is triangular." },
        { value: 3.2, why: "You divided the speed by the time and calculated the acceleration 3.2 m/s², not the displacement." },
        { value: 20, why: "You took half the time or half the speed twice; The factor of half is multiplied once "
          + "Multiplied by the product of the base and the height." },
      ],
    },
    {
      id: 'distance-from-rest',
      family: "Fifth pattern · Displacement from rest",
      aim: "You use the ½at² limit and do not mix it with the speed limit.",
      objectives: [2],
      prompt: "A body starts from rest with constant acceleration 2.0 m/s². "
        + "How much distance does he cover in meters during 5.0 s?",
      unit: 'm',
      answer: 25,
      tolerance: 0.2,
      solution: '‎x = v₀t + ½at² = 0 + ½(2.0)(25) = 25 m‎.',
      commonErrors: [
        { value: 50, why: "You neglected the half factor and calculated at². "
          + "Half is not a term: it is the effect of the speed increasing from zero rather than being complete from the beginning." },
        { value: 10, why: "You calculated the final speed at = 10 m/s, not the distance. "
          + "Your output unit is m/s and the question is for m." },
        { value: 5, why: "You multiplied the acceleration by the time and then divided, or you used ½at instead of ½at²; "
          + "Time enters a square." },
      ],
    },
  ],
};
