/* درس بيت الفؤاد · PHY 101 · الشغل والطاقة والقدرة.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: أعمدة الطاقة في ثلاث لحظات من سقوط واحد.
   المجموع ثابت والتوزيع يتغيّر؛ وهذا هو معنى «الحفظ» مرئيًّا. */
const bar = (x, peH, keH) => {
  const pieces = [];
  /* طاقة الوضع تُرسم من الأعلى، والحركة تحتها، فيبقى أعلى العمود واحدًا. */
  if (peH > 0) pieces.push(`<rect x="${x}" y="${180 - peH - keH}" width="60" height="${peH}" fill="#c69748"/>`);
  if (keH > 0) pieces.push(`<rect x="${x}" y="${180 - keH}" width="60" height="${keH}" fill="#10766f"/>`);
  pieces.push(`<rect x="${x}" y="60" width="60" height="120" fill="none" stroke="#284955" stroke-width="2"/>`);
  return pieces.join('');
};

const figure = `<svg viewBox="0 0 480 250" role="img" aria-labelledby="fig-energy-title" class="bayt-svg">`
  + `<title id="fig-energy-title">There are three pillars of energy for a falling body: potential energy decreases, kinetic energy increases, and the total is constant</title>`
  + `<line x1="30" y1="60" x2="450" y2="60" stroke="#566f7a" stroke-width="2" stroke-dasharray="5 4"/>`
  + `<text x="446" y="52" font-size="13" fill="#566f7a" text-anchor="end">Total energy is constant</text>`
  + bar(50, 120, 0)
  + bar(190, 60, 60)
  + bar(330, 0, 120)
  + `<line x1="30" y1="180" x2="450" y2="180" stroke="#284955" stroke-width="2"/>`
  + `<text x="80" y="200" font-size="14" fill="#284955" text-anchor="middle">Highest point</text>`
  + `<text x="220" y="200" font-size="14" fill="#284955" text-anchor="middle">In the middle</text>`
  + `<text x="360" y="200" font-size="14" fill="#284955" text-anchor="middle">Before arrival</text>`
  /* مفتاح الألوان. */
  + `<rect x="60" y="222" width="16" height="12" fill="#c69748"/>`
  + `<text x="146" y="233" font-size="13" fill="#284955" text-anchor="start">Potential energy</text>`
  + `<rect x="250" y="222" width="16" height="12" fill="#10766f"/>`
  + `<text x="340" y="233" font-size="13" fill="#284955" text-anchor="start">Motion energy</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'energy',

  objectives: [
    "You calculate the work from the force, the displacement, and the angle between them, and read its sign.",
    "Apply conservation of mechanical energy when non-conservative forces do no net work on the chosen system.",
    "Power is calculated from work and time, and is distinguished from work itself.",
  ],

  boundaries: [
    "Elastic spring energy and harmonic vibration are not covered in this lesson.",
    "Thermal energy and its transformations are the subject of thermochemistry, not this lesson.",
    "Energy in the theorem of relativity is completely out of scale.",
    "Examples for this lesson ignore air resistance unless otherwise noted.",
  ],

  prerequisites: [
    {
      title: "Force and free body diagram",
      why: "Work is calculated for each force separately, so whoever does not take stock of the forces does not know which ones did work.",
      recap: "Draw the body alone with the external forces on it: weight, surface force, and any acting force. "
        + "Then calculate the occupancy of each one. "
        + "Note that the normal surface force does not do work in the horizontal movement because it is perpendicular to the displacement.",
      href: '/semester-1/physics/forces/',
      hrefLabel: "Study Newton's laws",
    },
    {
      title: "Sine and cosine of common angles",
      why: "The angle between force and displacement enters the calculation via cos θ, and its error changes the entire result.",
      recap: "cos 0° = 1, cos 60° = 0.5, cos 90° = 0, cos 180° = −1. "
        + "Both sides noticed that the force in the direction of motion does the greatest possible work. "
        + "The perpendicular to it does nothing, and the opposite to it does negative work.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Work",
        en: 'Work',
        text: "For a constant force and displacement, W=Fd cos θ, measured in joules. Work is positive when the force has a component along displacement, negative when opposed, and zero when perpendicular. If the object does not move, mechanical work on it is zero, even though holding it can require metabolic effort.",
      },
      {
        term: "Kinetic energy",
        en: 'Kinetic energy',
        text: "Translational kinetic energy is K=½mv², measured in joules. It is nonnegative and equals zero at rest. Doubling speed quadruples kinetic energy for the same mass.",
      },
      {
        term: "Gravitational potential energy",
        en: 'Gravitational potential energy',
        text: "PE = m g h where h is the height above a reference level of your choice. "
          + "Its absolute value is arbitrary because the reference is arbitrary, but the **difference** between two situations does not change as the reference changes. "
          + "The difference alone is what enters the calculations.",
      },
      {
        term: "Conservative force",
        en: 'Conservative force',
        text: "A conservative force does work that depends only on the starting and ending positions. It has an associated potential energy with W=−ΔU. Gravity is an example. Frictional work generally depends on the path and cannot be represented by such a position-only potential.",
      },
      {
        term: "Power",
        en: 'Power',
        text: "Average power is work divided by elapsed time, P_avg=W/Δt, in watts (J/s). Instantaneous power is dW/dt. Two machines can do the same work while having different average powers if they take different times.",
      },
    ],
    relations: [
      {
        formula: 'W = F d cos θ',
        name: "Work",
        note: "The angle between force and displacement, not necessarily between force and the horizontal.",
      },
      {
        formula: 'KE = ½ m v²',
        name: "Kinetic energy",
        note: "The speed is squared, and the half is unforgettable.",
      },
      {
        formula: 'PE = m g h',
        name: "Potential energy",
        note: "It's the difference that matters, not the absolute value.",
      },
      {
        formula: 'W_net = ΔKE',
        name: "Work and energy theorem",
        note: "Total work equals the change in kinetic energy, not the energy itself.",
      },
      {
        formula: "KE + PE = constant   (No non-conservative forces)",
        name: "Conservation of mechanical energy",
        note: "Its condition is clear: no friction, no resistance, and no external force doing work.",
      },
      {
        formula: 'P = W / t',
        name: "Capacity",
        note: "Its unit is the watt, and the unit of work is the joule. Don't confuse them.",
      },
    ],
    derivation: {
      title: "Why does the force perpendicular to the motion do no work?",
      intro: "A seemingly strange result: a moon has been orbiting the Earth for millions of years and no work is being done on it. Let's see why.",
      steps: [
        {
          do: "Refer to the definition : W = F d cos θ, the angle between force and displacement.",
          why: "Work does not measure force alone or displacement alone, but rather what the force has in common in the direction of displacement.",
        },
        {
          do: "Put θ = 90°: into cos 90° = 0, the work is zero no matter how big F and d are.",
          why: "The vehicle in the direction of movement is non-existent, as the force does not push the body forward or restrain it.",
        },
        {
          do: "Apply to uniform circular motion: force to the center, velocity on the tangent, and the angle between them 90°.",
          why: "The work is zero at every moment, and therefore the kinetic energy does not change, and therefore the amount of speed remains constant.",
        },
        {
          do: "Notice what was not said: speed is constant in magnitude, not constant in direction. The body is accelerating despite the lack of work.",
          why: "This is the source of confusion: absence of work means constant speed. "
            + "It does not mean a lack of force or a lack of acceleration. "
            + "Force changes direction without changing magnitude.",
        },
      ],
    },
  },

  visual: {
    title: "Conservation: The sum is fixed and the distribution varies",
    figure: {
      svg: figure,
      caption: "A body falling freely. Potential energy decreases and kinetic energy increases by the same amount. "
        + "The top of the column remains at the dotted line for the three moments.",
      alt: "Three columns of equal total height, surmounted by one dashed line indicating the stability of the total. "
        + "The first column is completely filled with the color of the potential energy at the highest point. "
        + "The second is half of it is potential energy at the top and half of it is kinetic energy at the bottom. "
        + "The third is all filled with the color of motion energy before reaching the ground. "
        + "The total is the same in the three columns, but its distribution has changed.",
    },
    table: {
      caption: "Sign of work according to the angle between force and displacement",
      head: ["Corner θ", 'cos θ', "Work sign", "Example"],
      rows: [
        ['0°', '1', "Positive and maximum possible", "Push a box in the direction of its movement"],
        ['60°', '0.5', "Positive and less", "Pull the bag with an inclined rope"],
        ['90°', '0', "Zero", "Surface force on a body moving horizontally"],
        ['180°', '−1', "Negative", "Friction on a moving body"],
      ],
    },
    reading: "The third row is the key to many questions: a very large force, a very large displacement, and zero work. "
      + "The fourth row explains why friction slows down: its work is negative, so kinetic energy decreases. "
      + "Note that the sign is not a term, but rather says that the energy entered or left the body.",
  },

  guided: {
    start: "First define the system, then ask: Is a non-conservative force acting? "
      + "If the answer is no, use energy conservation: write the total energy in the two cases and equate them, "
      + "You will save yourself the hassle of calculating forces and acceleration. "
      + "If the answer is yes, calculate the work of that force and include it in the budget. "
      + "Choose a reference level for elevation and write it down; Any level is fine as long as you stick to it in both cases.",
    workedExamples: [
      {
        title: "Example 1 · Work an oblique force",
        task: "The distance bag 4.0 m is pulled by the force of 50 N in a rope making 60° with the horizontal. "
          + "What work does this force do?",
        steps: [
          {
            do: "The angle between the force and the displacement is 60°, and the displacement is horizontal.",
            why: "The angle in law is between force and displacement, not between force and any other direction; "
              + "Here it happened that the displacement was horizontal and coincided with the angle of the rope.",
          },
          {
            do: "Replace : W = 50 × 4.0 × cos 60° = 50 × 4.0 × 0.5.",
            why: "The cosine captures the horizontal component alone; The vertical component does not do work because the displacement is horizontal.",
          },
          {
            do: "Output 100 J.",
            why: "It is half what it would be if the rope were horizontal, because only half of the force acts in the direction of movement.",
          },
        ],
        answer: 'W = 100 J',
      },
      {
        title: "Example 2 · speed of energy conservation",
        task: "A body falls from rest from a height 5.0 m. What is its speed before reaching the ground? "
          + "Neglect air resistance and take the g = 9.8 m/s².",
        steps: [
          {
            do: "There are no non-conservative forces (we neglected resistance), so mechanical energy is conserved.",
            why: "Check the condition first; If resistance were mentioned, the method would be invalid and its work would have to be calculated.",
          },
          {
            do: "Make the ground a reference: at the top PE = mgh and KE = 0, at the bottom PE = 0 and KE = ½mv².",
            why: "Choosing the reference at the ground eliminates a complete term and simplifies the equation, and it is a free choice.",
          },
          {
            do: "Equal : mgh = ½mv², and remove m from both sides, so v = √(2gh).",
            why: "Eliminating mass is not an accidental simplification but a consequence: the speed of free fall does not depend on mass.",
          },
          {
            do: "Replace : v = √(2 × 9.8 × 5.0) = √98 = 9.9 m/s.",
            why: "Don't forget the root; The output of 98 is v² and its module m²/s² is not m/s.",
          },
        ],
        answer: 'v ≈ 9.9 m/s',
      },
    ],
    skipped: [
      {
        q: "If the choice of reference level were free, wouldn't potential energy be meaningless?",
        a: "The absolute value is really meaningless, the difference is what is meaningful. "
          + "Physics never asks about PE alone, but about ΔPE, and this difference is the same no matter how you choose the reference. "
          + "The only condition is that you adhere to the same reference in both cases.",
      },
      {
        q: "Can kinetic energy be negative?",
        a: "Not at all, because the mass is positive and the velocity is squared. "
          + "The **change** in kinetic energy is negative when the body slows down. "
          + "As for potential energy, it may be negative if you choose a reference higher than the body, and this is acceptable and there is no problem with it.",
      },
      {
        q: "Why do we use energy at all if the equations of motion are sufficient?",
        a: "Because energy is a scalar quantity and not a vector, it does not require factoring into components or tracking of trends. "
          + "It solves problems in which the path is curved or the force is variable, which are problems that equations cannot solve "
          + "Constant acceleration. An example is sliding down a curved slope: energy gives speed in one line.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'work-angle',
      family: "The first type: Work an oblique force",
      aim: "You include the cosine and do not neglect it.",
      objectives: [0],
      prompt: "A force 50 N pulls a body at a distance 4.0 m, and between it and the displacement is an angle 60°. "
        + "What is the work done in a joule?",
      unit: 'J',
      answer: 100,
      tolerance: 1,
      solution: '‎W = F d cos θ = 50 × 4.0 × cos 60° = 50 × 4.0 × 0.5 = 100 J‎.',
      commonErrors: [
        { value: 200, why: "You neglected cos θ and counted F d alone. "
          + "This is only true when the force is exactly in the direction of the displacement, i.e. θ = 0." },
        { value: 173, why: "You used sin 60° or cos 30°. "
          + "The formula takes the cosine of the angle between the force and the displacement, which is 60° here." },
        { value: 0, why: "You thought the job was zero. It is zero at 90° alone; "
          + "At 60°, half the force remains in the direction of motion." },
      ],
    },
    {
      id: 'kinetic',
      family: "The second type: kinetic energy",
      aim: "Square the speed and multiply by half.",
      objectives: [1],
      prompt: "What is the kinetic energy of an object with mass 2.0 kg moving with speed 6.0 m/s?",
      unit: 'J',
      answer: 36,
      tolerance: 0.5,
      solution: '‎KE = ½ m v² = ½ × 2.0 × 36 = 36 J‎.',
      commonErrors: [
        { value: 72, why: "You neglected the half factor and calculated m v²." },
        { value: 12, why: "You did not square the speed and calculated m v, and this is momentum, not kinetic energy. "
          + "And his unit is kg·m/s not J." },
        { value: 6, why: "You calculated ½ m v:, neglected the square and kept the half." },
      ],
    },
    {
      id: 'free-fall-speed',
      family: "The third type: Speed of energy conservation",
      aim: "Take root at the limit and don't stop at v².",
      objectives: [1],
      prompt: "A body falls from rest from a height 20 m. What is its speed before reaching the ground? "
        + "Ignore resistance and take g = 9.8 m/s².",
      unit: 'm/s',
      answer: 19.8,
      tolerance: 0.2,
      solution: "mgh = ½mv², v = √(2gh) = √(2 × 9.8 × 20) = √392 = 19.8 m/s.",
      commonErrors: [
        { value: 392, why: "You forgot the square root. 392 is v² and its unit is m²/s². "
          + "The question is about the speed of its unit m/s." },
        { value: 196, why: "You calculated gh and neglected the factor 2 and the root together." },
        { value: 9.8, why: "You wrote gravitational acceleration instead of velocity." },
      ],
    },
    {
      id: 'potential',
      family: "Fourth type · Potential energy",
      aim: "You hit all three and don't drop g.",
      objectives: [1],
      prompt: "What is the gravitational potential energy of an object with mass 3.0 kg at a height of 2.0 m above the reference? "
        + "Take g = 9.8 m/s².",
      unit: 'J',
      answer: 58.8,
      tolerance: 0.3,
      solution: '‎PE = mgh = 3.0 × 9.8 × 2.0 = 58.8 J‎.',
      commonErrors: [
        { value: 6, why: "You calculated m h and dropped g. "
          + "Your output unit is kg·m which is not power." },
        { value: 29.4, why: "You hit it in half. The factor of half is in kinetic energy, not in potential energy." },
        { value: 19.6, why: "You neglected the mass and counted g h alone." },
      ],
    },
    {
      id: 'power',
      family: "Fifth type · Ability",
      aim: "Divide work by time and distinguish watts from joules.",
      objectives: [2],
      prompt: "600 J work is done through 4.0 s. What is the power done?",
      unit: 'W',
      answer: 150,
      tolerance: 1,
      solution: '‎P = W/t = 600/4.0 = 150 W‎.',
      commonErrors: [
        { value: 2400, why: "You multiplied the work by time. Power is a rate, and the rate is divided by time, not multiplied." },
        { value: 600, why: "You wrote the work itself. Work in joules and power in watts, "
          + "Power describes the speed at which work is done, not its amount." },
        { value: 0.0067, why: "You flipped the fraction and divided the time by the work." },
      ],
    },
  ],
};
