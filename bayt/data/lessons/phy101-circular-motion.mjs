/* درس بيت الفؤاد · PHY 101 · الحركة الدائرية.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: ثلاث نقاط على دائرة، عند كل منها سهمان.
   التكرار مقصود: السرعة تغيّر اتجاهها والتسارع يبقى نحو المركز دائمًا. */
const pair = (px, py, vx, vy, ax, ay) =>
  `<line x1="${px}" y1="${py}" x2="${vx}" y2="${vy}" stroke="#10766f" stroke-width="3"/>`
  + `<circle cx="${vx}" cy="${vy}" r="4" fill="#10766f"/>`
  + `<line x1="${px}" y1="${py}" x2="${ax}" y2="${ay}" stroke="#c0392b" stroke-width="3"/>`
  + `<circle cx="${ax}" cy="${ay}" r="4" fill="#c0392b"/>`;

const figure = `<svg viewBox="0 0 440 260" role="img" aria-labelledby="fig-circ-title" class="bayt-svg">`
  + `<title id="fig-circ-title">A circle with three points, at each point a tangential velocity arrow and an acceleration arrow toward the center</title>`
  + `<circle cx="220" cy="130" r="80" fill="none" stroke="#284955" stroke-width="2" stroke-dasharray="6 5"/>`
  + `<circle cx="220" cy="130" r="4" fill="#284955"/>`
  + pair(220, 50, 172, 50, 220, 92)
  + pair(151, 170, 172, 206, 186, 150)
  + pair(289, 170, 310, 134, 254, 150)
  + `<text x="160" y="42" font-size="16" fill="#10766f">v</text>`
  + `<text x="228" y="88" font-size="16" fill="#c0392b">a</text>`
  + `<text x="220" y="248" font-size="14" fill="#566f7a" text-anchor="middle">v: tangent; a: toward the centre</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'circular-motion',

  objectives: [
    "Centripetal acceleration and centripetal force are calculated from velocity, radius, and mass.",
    "Identify the real forces whose radial resultant provides the centripetal force.",
    "Relate period to speed on a circular path.",
  ],

  boundaries: [
    "Irregular circular motion (change in speed) is not in this lesson.",
    "Rotation of rigid bodies, torque and rotational inertia are out of range.",
    "Oblique curves (banking) are not counted here.",
    "Movement in rotating frames and imaginary forces are mentioned for correction and are not calculated.",
  ],

  prerequisites: [
    {
      title: "Resultant force and free body diagram",
      why: "The centripetal force is not a new force added, but rather the resultant of the real forces in the direction of the center.",
      recap: "Draw the body with only the real forces on it: weight, surface force, friction, and tension. "
        + "Then add them towards the center and equal the sum to mv²/r. "
        + "Do not draw an arrow named “central force” next to it; It is the result of summation and has no element.",
      href: '/semester-1/physics/forces/',
      hrefLabel: "Study Newton's laws",
    },
    {
      title: "Acceleration is a change in velocity",
      why: "The whole idea is based on the fact that a change in direction is an acceleration, even if the amount is fixed.",
      recap: "Acceleration is a = Δv/Δt and velocity is a vector, so its change includes a change in direction. "
        + "A body rotating at a constant speed is accelerating at every moment because its direction is constantly changing. "
        + "This does not contradict the stability of the magnitude, because the acceleration is perpendicular to the speed and does not increase or decrease it.",
      href: '/semester-1/physics/motion/',
      hrefLabel: "Vectors in motion lesson",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Uniform circular motion",
        en: 'Uniform circular motion',
        text: "Motion on a circular path at constant speed. Velocity still changes because its direction changes, so acceleration is nonzero and points toward the centre.",
      },
      {
        term: "Centripetal acceleration",
        en: 'Centripetal acceleration',
        text: "The inward acceleration for uniform circular motion has magnitude a_c=v²/r. It is perpendicular to velocity. At fixed radius, doubling speed quadruples the acceleration.",
      },
      {
        term: "Centripetal force",
        en: 'Centripetal force',
        text: "The resultant force toward the center: F_c = m v²/r. "
          + "**It is not a new kind of force** and is not added to the free-body diagram; "
          + "Rather, it is the role played by a real force such as tension, friction, gravity, or surface force.",
      },
      {
        term: "Period (T)",
        en: 'Period (T)',
        text: "The time required for a complete cycle. "
          + "The distance in one revolution is the circumference of the circle 2πr, so the speed is v = 2πr/T.",
      },
      {
        term: "Centrifugal force",
        en: 'Centrifugal force',
        text: "Centrifugal force is an inertial force used in a rotating frame. It is not an additional interaction force in an inertial-frame free-body diagram. In this lesson, diagrams use an inertial frame and include only the real forces providing inward acceleration.",
      },
    ],
    relations: [
      {
        formula: 'a_c = v² / r',
        name: "Centripetal acceleration",
        note: "towards the center; And the speed is squared.",
      },
      {
        formula: 'F_c = m v² / r',
        name: "Centripetal force",
        note: "A role played by real power, not additional power.",
      },
      {
        formula: 'v = 2 π r / T',
        name: "Speed of the cycle",
        note: "Circumference of the circle divided by the cycle time.",
      },
      {
        formula: "v_max = √(μ_s g r) on a horizontal curve",
        name: "Maximum cornering speed",
        note: "Independent of mass, because mass is at both ends.",
      },
    ],
    derivation: {
      title: "How is an object accelerating when its speed is constant?",
      intro: "An apparent contradiction that confuses many people: “constant speed” and “accelerating” in the same sentence.",
      steps: [
        {
          do: "Refer to the definition: Acceleration is a change in **velocity**, not its magnitude.",
          why: "A vector has magnitude and direction, and a change in either of them is a change in it. "
            + "Everyday language means speed alone, and hence the confusion.",
        },
        {
          do: "Visualize the velocity arrow at two close points on the circle: their length is the same and their direction is different.",
          why: "The difference between them is not zero, the difference is Δv, which is what the acceleration measures.",
        },
        {
          do: "Subtract the two arrows: the difference points inside the circle, i.e. towards the center.",
          why: "This is why the acceleration is called centripetal; Direction is a geometric result, not a convention.",
        },
        {
          do: "Since acceleration is perpendicular to velocity, the work of the centripetal force is zero.",
          why: "The kinetic energy does not change, so the speed remains constant. "
            + "The contradiction disappears completely: the acceleration rotates the vector and does not lengthen it. "
            + "This is the same result that I saw in the energy lesson for work.",
        },
      ],
    },
  },

  visual: {
    title: "Velocity is rotating, and acceleration is pointing to the center",
    figure: {
      svg: figure,
      caption: "At each point: a green tangential arrow is velocity, and a red arrow toward the center is acceleration. "
        + "The direction of green changes with position, and red always indicates the center.",
      alt: "A dashed circle with a dot in the middle representing the center. There are three dots around it. "
        + "From each point, two arrows emerge: a green one tangent to the circle, representing speed, and a red one pointing toward the center, representing acceleration. "
        + "The direction of the green arrow varies with position, while the red indicates the center in the three positions. "
        + "Under the drawing is a line that says that the velocity is tangential and changes, and the acceleration is always toward the center.",
    },
    table: {
      caption: "Who plays the role of the central force in every situation?",
      head: ["Attitude", "Real power", "Note"],
      rows: [
        ["Car on a horizontal curve", "Static friction", "Stay still because the tire doesn't slip"],
        ["A ball at the limit of a string", "Tighten the thread", "The rotation disappears if the thread breaks"],
        ["Moon around a planet", "Gravity", "No touching or flossing"],
        ["Rider at the top of the ring", "Weight and seat force together", "Both are down, i.e. towards the centre"],
        ["A dress in a washing machine that spins", "Cylinder wall force", "The wall pushes the dress inward"],
      ],
    },
    reading: "There is no line in the second column that says “central power,” and this is intentional. "
      + "It is a role, not a type: always ask, “What real power refers to the center here?” "
      + "Then set its resultant equal to mv²/r. "
      + "And read the last row: The garment remains in the cylinder because the wall pushes it inward. "
      + "No, because a force pushes it out.",
  },

  guided: {
    start: "Draw the body at the moment you are studying, and determine where the center is. "
      + "Then make the positive direction toward the center, and collect the real forces on this axis. "
      + "Then type ΣF = mv²/r and solve. "
      + "Do not add an arrow in the name of centripetal force, nor add centrifugal force; "
      + "The first is the result of addition, and the second does not exist in this context.",
    workedExamples: [
      {
        title: "Example 1 · Centripetal acceleration",
        task: "A body moving on a circle of radius 25 m with a constant speed 10 m/s., what is its centripetal acceleration?",
        steps: [
          {
            do: "Substitute in a_c = v²/r = (10)²/25 = 100/25.",
            why: "Speed enters squared; Entering it without a square is the most common error here.",
          },
          {
            do: "Output 4.0 m/s² toward the center.",
            why: "Mentioning direction is part of the answer: acceleration here does not change the magnitude but rather the direction.",
          },
        ],
        answer: 'a_c = 4.0 m/s² toward the centre',
      },
      {
        title: "Example 2 · Maximum speed on a horizontal curve",
        task: "A car turns on a horizontal curve with radius 50 m, and coefficient of static friction 0.40. "
          + "What is the maximum speed before sliding? Take g = 9.8 m/s².",
        steps: [
          {
            do: "The only force towards the center is static friction, the maximum being μ_s N = μ_s mg.",
            why: "The surface is horizontal, so N = mg. is static friction, not kinetic, because the tire rolls and does not slide sideways.",
          },
          {
            do: "Equal: μ_s m g = m v²/r.",
            why: "The left end is the most that friction can provide, and the right is what movement requires. "
              + "Exceeding the speed makes what is required greater than what is available and it slips.",
          },
          {
            do: "Delete m from both sides : v² = μ_s g r = 0.40 × 9.8 × 50 = 196.",
            why: "The mass disappears, so the maximum cornering speed is the same for the truck and the small car on the same surface. "
              + "This is a result that surprises many.",
          },
          {
            do: "Take the root: v = 14 m/s.",
            why: "The output of 196 is v² and its unit is m²/s²; The question is about speed.",
          },
        ],
        answer: 'v_max = 14 m/s',
      },
    ],
    skipped: [
      {
        q: "Why am I pushed out into the corner if there is no repulsive force?",
        a: "Because you are not being pushed out at all; Your body tends to continue in a straight line by its own inertia, "
          + "The car turns under you. You collide with the door, and the door pushes you **inside**, "
          + "This is the only real horizontal force over you. "
          + "The feeling of being pushed out is real, but its interpretation is insufficiency, not force.",
      },
      {
        q: "If central power is just a role, why does it have a special name?",
        a: "The name describes the direction, not the source, as we say “vertical force.” "
          + "Its benefit is that it combines different positions under one equation: "
          + "Whatever the source of the force, if it points to the center, its magnitude is mv²/r. "
          + "The mistake is to think that the name is an independent type and draw an additional arrow.",
      },
      {
        q: "How does the water stay in the upside down bucket on top of the spin?",
        a: "Because gravity at that moment points to the center of the circle, so it plays the role of a central force. "
          + "The water does \"fall\", but it falls along a curved path that matches the path of the bucket. "
          + "If the speed slows below a certain limit, gravity becomes greater than necessary for the bending, and the water leaves the bucket.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'centripetal-accel',
      family: "The first type: Centripetal acceleration",
      aim: "Square the speed and divide by the radius.",
      objectives: [0],
      prompt: "A body rotating on a circle of radius 25 m at a constant speed 10 m/s., what is its centripetal acceleration?",
      unit: 'm/s²',
      answer: 4,
      tolerance: 0.05,
      solution: "a_c = v²/r = 100/25 = 4.0 m/s² toward the center.",
      commonErrors: [
        { value: 0.4, why: "You divide the speed by the radius without squaring it. "
          + "The speed is entered squared, and your output unit is 1/s, not m/s²." },
        { value: 250, why: "You multiplied by the radius instead of dividing by it. "
          + "The wider the circle, the less acceleration needed to change direction." },
        { value: 2.5, why: "You divide the radius by the speed." },
      ],
    },
    {
      id: 'centripetal-force',
      family: "The second type: Central force",
      aim: "Enter the mass and divide by the radius.",
      objectives: [1],
      prompt: "A car of mass 1200 kg turns with speed 20 m/s on a curve of radius 50 m. "
        + "How much centripetal force is needed?",
      unit: 'N',
      answer: 9600,
      tolerance: 20,
      solution: '‎F_c = m v²/r = 1200 × 400 / 50 = 9600 N‎، '
        + "It is provided by static friction between the tires and the road.",
      commonErrors: [
        { value: 480, why: "You didn't square the speed, you counted m v / r." },
        { value: 480000, why: "You calculated m v² and did not divide by the radius." },
        { value: 8, why: "You calculated the acceleration v²/r and neglected the mass. "
          + "The unit of your output is m/s² and the question is about newtons." },
      ],
    },
    {
      id: 'speed-from-period',
      family: "The third type is the speed of the time course",
      aim: "Use the circumference of the circle, not the radius.",
      objectives: [2],
      prompt: "A body makes a complete revolution on a circle of radius 2.0 m at 4.0 s. What is its speed?",
      unit: 'm/s',
      answer: 3.14,
      tolerance: 0.05,
      solution: '‎v = 2πr/T = 2π(2.0)/4.0 = 12.57/4.0 = 3.14 m/s‎.',
      commonErrors: [
        { value: 12.57, why: "You calculated the circumference 2πr and did not divide it by the cycle time. "
          + "Circumference is distance and speed is distance over time." },
        { value: 0.5, why: "You divided the radius by time and neglected 2π. "
          + "The distance traveled in a cycle is the circumference, not the radius." },
        { value: 1.57, why: "You used πr/T, which means half the circumference. Full cycle full circumference." },
      ],
    },
    {
      id: 'max-turn-speed',
      family: "Fourth mode · Maximum cornering speed",
      aim: "Friction equals the demand and takes the root.",
      objectives: [1],
      prompt: "Horizontal curve with radius 50 m and coefficient of static friction 0.40. "
        + "What is the maximum cornering speed? Take g = 9.8 m/s².",
      unit: 'm/s',
      answer: 14,
      tolerance: 0.2,
      solution: "μ_s m g = m v²/r, the mass is deleted and v² = μ_s g r = 0.40 × 9.8 × 50 = 196 remains, "
        + "And v = 14 m/s.",
      commonErrors: [
        { value: 196, why: "You forgot the square root. 196 is v² and its unit is m²/s²." },
        { value: 22.1, why: "You neglected the coefficient of friction and calculated √(g r). "
          + "Friction is the source of the centripetal force here, so it cannot be eliminated." },
        { value: 1.98, why: "You neglected the radius and calculated √(μ_s g)." },
      ],
    },
    {
      id: 'net-force-constant-speed',
      family: "The fifth type is the resultant force with constant speed",
      aim: "You realize that the stability of the amount does not mean the absence of the outcome.",
      objectives: [1],
      prompt: "A body of mass 2.0 kg is rotating with a constant speed of 4.0 m/s on a circle of radius 8.0 m. "
        + "What is the magnitude of the resultant forces acting on it?",
      unit: 'N',
      answer: 4,
      tolerance: 0.05,
      solution: "Constant magnitude does not mean lack of acceleration: the direction changes. "
        + "The resultant is m v²/r = 2.0 × 16 / 8.0 = 4.0 N toward the center.",
      commonErrors: [
        { value: 0, why: "You thought that constant speed meant zero outcome. "
          + "The constant is the magnitude alone, and the direction is constantly changing, and this is acceleration that requires force. "
          + "If the resultant did not exist, the body would move in a straight line." },
        { value: 32, why: "You calculated m v² and did not divide by the radius." },
        { value: 1, why: "You didn't square the speed, you counted m v / r." },
      ],
    },
  ],
};
