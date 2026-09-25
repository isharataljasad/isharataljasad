/* درس بيت الفؤاد · PHY 101 · الاحتكاك والمستوى المائل.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: جسم على مستوى مائل.
   الفكرة الوحيدة المقصودة: القوة العمودية عمودية على السطح لا على الأفق.
   ولهذا اقتُصر على ثلاثة أسهم؛ التحليل إلى مركّبتين في الجدول والمثال. */
const figure = `<svg viewBox="0 0 480 250" role="img" aria-labelledby="fig-incline-title" class="bayt-svg">`
  + `<title id="fig-incline-title">A body on an inclined plane has the normal force, weight, friction, and angle of slope at the base</title>`
  + `<line x1="80" y1="190" x2="400" y2="190" stroke="#566f7a" stroke-width="2" stroke-dasharray="5 4"/>`
  + `<line x1="80" y1="190" x2="400" y2="70" stroke="#284955" stroke-width="3"/>`
  + `<path d="M 118 190 A 38 38 0 0 0 112 176" fill="none" stroke="#566f7a" stroke-width="2"/>`
  + `<text x="126" y="184" font-size="16" fill="#284955">θ</text>`
  + `<rect x="212" y="100" width="52" height="34" fill="#cfe6ef" stroke="#284955" stroke-width="2" `
    + `transform="rotate(-20.6 238 117)"/>`
  /* القوة العمودية: عمودية على السطح المائل. */
  + `<line x1="238" y1="117" x2="220" y2="70" stroke="#10766f" stroke-width="3"/>`
  + `<polyline points="213,80 218,66 226,77" fill="none" stroke="#10766f" stroke-width="3"/>`
  + `<text x="196" y="62" font-size="16" fill="#10766f">N</text>`
  /* الوزن: رأسي دائمًا. */
  + `<line x1="238" y1="117" x2="238" y2="180" stroke="#c0392b" stroke-width="3"/>`
  + `<polyline points="231,170 238,182 245,170" fill="none" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="246" y="176" font-size="16" fill="#c0392b">mg</text>`
  /* الاحتكاك: على امتداد السطح، مضادّ للانزلاق. */
  + `<line x1="238" y1="117" x2="288" y2="98" stroke="#c69748" stroke-width="3"/>`
  + `<polyline points="278,92 290,97 280,105" fill="none" stroke="#c69748" stroke-width="3"/>`
  + `<text x="296" y="94" font-size="16" fill="#c69748">f</text>`
  + `<text x="240" y="226" font-size="14" fill="#566f7a" text-anchor="middle">The normal force is perpendicular to the inclined surface, not to the horizon</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'friction',

  objectives: [
    "Differentiate between static and kinetic friction and choose the appropriate model for each situation.",
    "The force of friction is calculated from the coefficient and the normal force on a horizontal surface.",
    "Decompose the weight into two components on an inclined plane and calculate the correct normal force.",
  ],

  boundaries: [
    "Rolling friction and fluid resistance are not covered in this lesson.",
    "The dependence of the coefficient of friction on speed, temperature and surface condition is neglected here.",
    "Pulley systems and interconnected bodies on ramps are outside the scope of this lesson.",
    "Friction in circular motion is the topic of the circular motion lesson.",
  ],

  prerequisites: [
    {
      title: "Free body diagram",
      why: "Friction depends on the normal force, and the normal force is known only from the vertical force diagram.",
      recap: "Isolate the object and draw on it: the weight, the normal force from the surface, the friction, and any applied force. "
        + "Then write ΣF = ma on two perpendicular axes. "
        + "Choose the two axes parallel to the surface and perpendicular to it in slope problems, not horizontal and vertical.",
      href: '/semester-1/physics/forces/',
      hrefLabel: "Study Newton's laws and free body diagram",
    },
    {
      title: "The sine and cosine of an angle",
      why: "The factoring of weight on the slope is based on them, and changing them is the most common mistake in this lesson.",
      recap: "For the composite slope angle θ: parallel to the surface mg sin θ, and perpendicular to it mg cos θ. "
        + "To remember: when a horizontal surface (θ = 0 () is sin 0 = 0, there is no vehicle pushing the body. "
        + "And cos 0 = 1, the normal force is equal to the entire weight. "
        + "If your choice gives you a result that contradicts this at zero, then you have switched the two functions.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Static friction",
        en: 'Static friction',
        text: "Static friction opposes the tendency of surfaces to slide relative to one another. Its magnitude adjusts as needed up to f_s,max=μ_sN. For the simple horizontal equilibrium examples, it balances the applied horizontal force until that limit is reached.",
      },
      {
        term: "Kinetic friction",
        en: 'Kinetic friction',
        text: "Kinetic friction opposes relative sliding. In the simplified dry-friction model its magnitude is f_k=μ_kN. The model neglects dependence on sliding speed and apparent contact area.",
      },
      {
        term: "Coefficient of friction",
        en: 'Coefficient of friction (μ)',
        text: "A unitless number that describes the roughness of both surfaces together, not just one surface. "
          + "Usually μ_s > μ_k, so more thrust is required to start the movement than to keep it going. "
          + "Its value often ranges between 0.1 and 1.0.",
      },
      {
        term: "Normal force on a slope",
        en: 'Normal force on an incline',
        text: "For a body on an incline with no other force component perpendicular to the surface and no perpendicular acceleration, N=mg cos θ. The downslope weight component is mg sin θ. The normal force decreases as the inclination increases; weight itself remains mg.",
      },
      {
        term: "Critical slope angle",
        en: 'Critical angle',
        text: "The angle at which sliding begins, is tan θ_c = μ_s. "
          + "Notice that mass disappears from this relationship: "
          + "The sliding initiation angle is the same for a heavy and light body of the same material.",
      },
    ],
    relations: [
      {
        formula: 'f_s ≤ μ_s N',
        name: "Stillness",
        note: "Inequality: Friction is equal to what is pushed up to the limit.",
      },
      {
        formula: 'f_k = μ_k N',
        name: "Kinetic",
        note: "Equality: one value as long as the movement continues.",
      },
      {
        formula: 'N = m g cos θ',
        name: "Verticality on a slope",
        note: "Cosine with perpendicular, and sine with parallel.",
      },
      {
        formula: 'mg sin θ',
        name: "Propelling vehicle",
        note: "Parallel to the surface, which is resisted by friction.",
      },
      {
        formula: 'tan θ_c = μ_s',
        name: "Sliding angle",
        note: "Completely mass independent.",
      },
    ],
    derivation: {
      title: "Why N = mg cos θ and why does the mass disappear from the sliding angle",
      intro: "Two rules are preserved, and one of them seems surprising: the slip angle does not change with mass.",
      steps: [
        {
          do: "Choose two axes: one parallel to the surface and the other perpendicular to it, not horizontal and vertical.",
          why: "With this choice, the acceleration of the body is on one axis only, so the two equations are simplified. "
            + "Choosing the horizontal and vertical axes is correct, but it unnecessarily introduces two components of the acceleration.",
        },
        {
          do: "Analyze the weight: its component perpendicular to the surface mg cos θ and parallel to it mg sin θ.",
          why: "The weight alone is tilted away from the two new axes; N and f are located on the two axes originally.",
        },
        {
          do: "On the vertical axis there is no acceleration, so N = mg cos θ.",
          why: "The body does not sink into the surface or rise from it, so the sum of the forces vertically is zero. "
            + "This is why N becomes smaller as the surface tilts, and with it the friction decreases.",
        },
        {
          do: "When you start sliding : mg sin θ = μ_s N = μ_s mg cos θ.",
          why: "This is the moment of limit equilibrium: the impulse equals the maximum resistance to friction.",
        },
        {
          do: "Divide both sides by mg cos θ and you get tan θ_c = μ_s.",
          why: "mass and g are omitted because they are on both ends. "
            + "Heaviness increases momentum and increases friction in the same proportion, so neither is more likely. "
            + "This is why a heavy and a light object slides at the same angle.",
        },
      ],
    },
  },

  visual: {
    title: "Perpendicular to the surface, not to the horizon",
    figure: {
      svg: figure,
      caption: "The weight is always vertical, while the normal force is inclined with the surface. "
        + "This is why it does not equal the weight on a slope, but rather its vertical component mg cos θ.",
      alt: "An inclined line representing a surface, with a dashed horizontal line below it, and between them the angle of slope at the base. "
        + "On the inclined surface there is a box inclined with the same slope as the surface itself. "
        + "Three arrows emerge from its center: a green arrow that is perpendicular to the inclined surface and tilts with it, which is the normal force. "
        + "A vertical red arrow downwards represents weight, and a golden arrow parallel to the surface upwards represents friction. "
        + "Under the drawing is a line reminding us that the normal force is perpendicular to the inclined surface, not to the horizon.",
    },
    table: {
      caption: "Static and kinetic: What is the difference in practice?",
      head: ["Face", "Stillness", "Kinetic"],
      rows: [
        ["Status", "The body is at rest", "The body is moving"],
        ["Formula", 'f_s ≤ μ_s N', 'f_k = μ_k N'],
        ["Value", "Variable up to a maximum", "Almost constant"],
        ["Factories", "μ_s is larger", "μ_k is smaller"],
        ["Typical question", "What is the minimum force to start the movement?", "What is the acceleration during motion?"],
      ],
    },
    reading: "The third row is the location of the most errors: static friction is calculated with μ_s N in any case, "
      + "This is only true at the edge of slippage. "
      + "You push a stationary box with 5 N and it does not move. Its friction is 5 N, not μ_s N. "
      + "Otherwise, he would not be still. The formula μ_s N gives the maximum, not the current value.",
  },

  guided: {
    start: "First ask: Is the object at rest or in motion? "
      + "If it is moving, then the friction is equal to μ_k N. "
      + "If it is stationary, the friction is equal to the force acting on it, and it does not reach μ_s N except at the edge of sliding. "
      + "Then on the slope: choose the two axes parallel to the surface and perpendicular to it, "
      + "Analyze the weight alone, and calculate N from the vertical axis before calculating the friction.",
    workedExamples: [
      {
        title: "Example 1 · Kinetic friction on a horizontal surface",
        task: "A box with mass 10 kg slides on a horizontal surface, and the coefficient of kinetic friction is 0.30. "
          + "What is the force of friction? Take g = 9.8 m/s².",
        steps: [
          {
            do: "On a horizontal surface with no other vertical forces: N = mg = 10 × 9.8 = 98 N.",
            why: "The normal force is the input to friction, so it is always calculated first. "
              + "It is equal to the weight here because the surface is horizontal and there is no vertical acceleration.",
          },
          {
            do: "The body is moving, so the model is : f_k = μ_k N = 0.30 × 98 = 29.4 N.",
            why: "The existing movement decides the choice of model; If it had been silent, the formula would have been different.",
          },
        ],
        answer: 'f_k = 29.4 N',
      },
      {
        title: "Example 2 · The normal and compound force driving a slope",
        task: "A body of mass 5.0 kg is on the slope of angle 30°. "
          + "Calculate the normal and compound forces parallel to the surface. Take g = 9.8 m/s².",
        steps: [
          {
            do: "Weight mg = 5.0 × 9.8 = 49 N, which is vertical.",
            why: "The weight never tilts with the surface; The diagonal is the two axes on which we analyze it.",
          },
          {
            do: "Vertical rooftop vehicle : mg cos 30° = 49 × 0.866 = 42.4 N, then N = 42.4 N.",
            why: "There is no acceleration perpendicular to the surface, the normal force balances this vehicle alone. "
              + "Note that it weighs less than 49 N, and this is expected whenever the surface tilts.",
          },
          {
            do: "The component parallel to the surface: mg sin 30° = 49 × 0.5 = 24.5 N.",
            why: "These are what push the body down the slope, and are resisted by friction. "
              + "Check : 42.4² + 24.5² ≈ 49², the factoring is correct.",
          },
        ],
        answer: 'N = 42.4 N, parallel component = 24.5 N',
      },
    ],
    skipped: [
      {
        q: "Why doesn't friction depend on the area of contact?",
        a: "Because increasing the area distributes the same weight over a larger area, the pressure decreases by the same amount. "
          + "Friction arises from real contact between microscopic protrusions, and its sum depends on the normal force "
          + "Not on virtual space. "
          + "This is in the simple model; Wide racing tires are against it for reasons outside this model.",
      },
      {
        q: "How can static friction be variable and have a constant coefficient?",
        a: "The parameter specifies the **maximum** not the actual value. "
          + "Static friction is exactly equal to the force acting to keep the body at rest. "
          + "It increases with it until it reaches μ_s N, where it becomes weak and begins to slide. "
          + "It is a response, not an imposed value.",
      },
      {
        q: "Can friction be in the direction of motion?",
        a: "Yes, it is what moves the car in the first place. "
          + "The tire pushes the ground back, and friction pushes the tire forward. "
          + "The precise rule is that friction opposes **relative sliding** between the two surfaces. "
          + "Not necessarily body movement.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'kinetic-flat',
      family: "The first type is kinetic friction on a horizontal surface",
      aim: "You calculate N first and then multiply by the modulus.",
      objectives: [1],
      prompt: "A box of mass 8.0 kg slides on a horizontal surface and the coefficient of kinetic friction is 0.25. "
        + "What is the force of friction? Take g = 9.8 m/s².",
      unit: 'N',
      answer: 19.6,
      tolerance: 0.2,
      solution: "N = mg = 8.0 × 9.8 = 78.4 N, f_k = 0.25 × 78.4 = 19.6 N.",
      commonErrors: [
        { value: 2, why: "You multiply the coefficient by the mass directly. "
          + "Friction depends on the normal force in newtons, not on the mass in kilograms. "
          + "The mass must be multiplied by g first." },
        { value: 78.4, why: "You wrote the normal force and did not multiply it by the coefficient." },
        { value: 313.6, why: "You divided by the coefficient instead of multiplying by it. "
          + "The coefficient is smaller than one, so friction is smaller than the normal force, not larger." },
      ],
    },
    {
      id: 'normal-incline',
      family: "Type 2: Normal force on a slope",
      aim: "Cosine is used with the vertical axis.",
      objectives: [2],
      prompt: "An object of mass 5.0 kg is on a slope of angle 30°. What is the normal force? "
        + "Take g = 9.8 m/s² and cos 30° = 0.866.",
      unit: 'N',
      answer: 42.4,
      tolerance: 0.3,
      solution: '‎N = mg cos θ = 5.0 × 9.8 × 0.866 = 42.4 N‎.',
      commonErrors: [
        { value: 49, why: "You used the entire mg. This is true on a horizontal surface alone; "
          + "On a slope, the surface carries only the vehicle perpendicular to it, which is smaller than the weight." },
        { value: 24.5, why: "You used sine instead of cosine and calculated the component parallel to the surface. "
          + "To verify: at θ = 0, N must equal the full weight, and the sine gives zero." },
        { value: 4.33, why: "You neglected g and calculated m cos θ, and the unit of your result is not newtons." },
      ],
    },
    {
      id: 'parallel-incline',
      family: "The third type is the propulsive vehicle",
      aim: "The sine is used with the parallel axis.",
      objectives: [2],
      prompt: "The body itself is 5.0 kg on the slope of 30°. "
        + "What is the component of the weight parallel to the surface? Take g = 9.8 m/s².",
      unit: 'N',
      answer: 24.5,
      tolerance: 0.2,
      solution: "mg sin θ = 5.0 × 9.8 × 0.5 = 24.5 N, which pushes the body down the slope.",
      commonErrors: [
        { value: 42.4, why: "You used cosine and calculated the component perpendicular to the surface. "
          + "The parallel component is accompanied by the sine function." },
        { value: 49, why: "You wrote the entire weight without factoring. "
          + "The weight is vertical, and the surface is inclined, so it must be factored on both axes." },
        { value: 9.8, why: "You wrote the gravitational acceleration instead of the force component." },
      ],
    },
    {
      id: 'critical-angle',
      family: "Fourth type: Sliding angle",
      aim: "The parameter is related to the tangent of the angle.",
      objectives: [0, 2],
      prompt: "The coefficient of static friction between an object and a surface is 1.0. "
        + "At what angle of slope in degrees does sliding begin?",
      unit: "Degree",
      answer: 45,
      tolerance: 0.5,
      solution: "tan θ_c = μ_s = 1.0, and the angle with a tangent of one is 45°. "
        + "Notice that the mass does not enter the calculation at all.",
      commonErrors: [
        { value: 1, why: "You wrote the value of the parameter. The parameter is the tangent of the angle, not the angle itself." },
        { value: 90, why: "Upright slope means free fall; "
          + "There is no surface in contact with the body at all, so there is no friction." },
        { value: 0, why: "At zero slope, the surface is horizontal and no vehicle is pushing the body, so there is no sliding." },
      ],
    },
    {
      id: 'static-start',
      family: "Type 5: Less force to initiate movement",
      aim: "The static coefficient is used at the sliding edge.",
      objectives: [0],
      prompt: "A box with mass 20 kg is at rest on a horizontal surface, and the coefficient of static friction is 0.50. "
        + "What is the smallest horizontal force moving it? Take g = 9.8 m/s².",
      unit: 'N',
      answer: 98,
      tolerance: 0.5,
      solution: "N = 20 × 9.8 = 196 N, and maximum static friction 0.50 × 196 = 98 N. "
        + "Any force exceeding 98 N starts motion.",
      commonErrors: [
        { value: 10, why: "You multiply the modulus by the mass. Friction depends on the normal force in newtons, "
          + "So multiply the mass by g first." },
        { value: 196, why: "You wrote the normal force and did not multiply it by the coefficient." },
        { value: 392, why: "You divided by the coefficient instead of multiplying by it." },
      ],
    },
  ],
};
