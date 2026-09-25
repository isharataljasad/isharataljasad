/* درس بيت الفؤاد · PHY 101 · قوانين نيوتن ومخطط الجسم الحر.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: مخطط الجسم الحر. الجسم معزول عمدًا عن الأرض والسطح،
   لأن أول خطوة في الحل أن تقرّر: أي جسم أرسم قواه؟ */
const figure = `<svg viewBox="0 0 480 270" role="img" aria-labelledby="fig-fbd-title" class="bayt-svg">`
  + `<title id="fig-fbd-title">Free-body diagram: An isolated box with a vertical force upward, a weight downward, and a horizontal force</title>`
  + `<rect x="190" y="100" width="100" height="70" rx="4" fill="#cfe6ef" stroke="#284955" stroke-width="2"/>`
  /* القوة العمودية على السطح، لأعلى. */
  + `<line x1="240" y1="100" x2="240" y2="34" stroke="#10766f" stroke-width="3"/>`
  + `<polyline points="233,44 240,32 247,44" fill="none" stroke="#10766f" stroke-width="3"/>`
  + `<text x="252" y="52" font-size="17" fill="#10766f">N</text>`
  /* الوزن، لأسفل. */
  + `<line x1="240" y1="170" x2="240" y2="228" stroke="#c0392b" stroke-width="3"/>`
  + `<polyline points="233,218 240,230 247,218" fill="none" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="252" y="216" font-size="17" fill="#c0392b">W = mg</text>`
  /* القوة المؤثرة أفقيًا. */
  + `<line x1="290" y1="135" x2="378" y2="135" stroke="#c69748" stroke-width="3"/>`
  + `<polyline points="368,128 380,135 368,142" fill="none" stroke="#c69748" stroke-width="3"/>`
  + `<text x="336" y="124" font-size="17" fill="#c69748">F</text>`
  + `<text x="240" y="256" font-size="13" fill="#566f7a" text-anchor="middle">Every arrow here has a force affecting this body alone</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'forces',

  objectives: [
    "You first identify the body and then draw the external forces on it alone in a free-body diagram.",
    "ΣF = ma is applied to each axis, and calculates acceleration, force, or mass.",
    "Distinguish a third-law pair, which acts on two different bodies, from balanced forces acting on one body.",
  ],

  boundaries: [
    "Friction and the inclined plane are the topic of the next lesson; Here we assume surfaces are smooth unless otherwise stated.",
    "Moments and rotational equilibrium are not covered in this lesson.",
    "Accelerated systems as frames of reference (imaginary forces) are out of scope.",
    "Air resistance is neglected in all of the examples in this lesson.",
  ],

  prerequisites: [
    {
      title: "Movement with constant acceleration",
      why: "Newton's second law gives you acceleration, then you need equations of motion to arrive at speed or distance.",
      recap: "v = v₀ + at, x = x₀ + v₀t + ½at² and v² = v₀² + 2aΔx. "
        + "The issue of forces often ends with acceleration, and the second half remains pure motion.",
      href: '/semester-1/physics/motion/',
      hrefLabel: "Study vectors and motion",
    },
    {
      title: "Decompose a vector into two components",
      why: "Inclined force does not enter ΣF = ma as is; Its vehicle enters on each axle.",
      recap: "The force of F makes an angle of θ with the horizontal: its horizontal component F cos θ and vertical F sin θ. "
        + "The sum of the squares of the two components is equal to the square of the magnitude, and this is a quick check of the validity of the factoring. "
        + "Note that cos accompanies the axis from which the angle is measured.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Free body diagram",
        en: 'Free-body diagram',
        text: "A drawing that isolates a single body and shows the external forces acting on it alone. "
          + "The forces with which it affects others are not depicted, nor are the internal forces between its parts. "
          + "The first step is not drawing, but choosing the body: changing the choice changes the whole plan.",
      },
      {
        term: "Resultant force",
        en: 'Net force',
        text: "The vector sum of the external forces: ΣF. "
          + "It is the only one that enters Newton's second law; Balanced forces are not neglected in the drawing "
          + "But it cancels some of them out in total.",
      },
      {
        term: "Weight",
        en: 'Weight',
        text: "The force of gravity of the Earth on the body : W = mg, in newtons. "
          + "It is fundamentally different from mass: mass is the amount of matter in kilograms and does not change with location. "
          + "Weight is a force that changes with g.",
      },
      {
        term: "Normal force",
        en: 'Normal force',
        text: "A force exerted by a surface on an object perpendicular to the surface. "
          + "It is not always equal to weight; It is equal to it in a special case: "
          + "A horizontal surface with no vertical acceleration or other vertical force.",
      },
      {
        term: "Newton's third law",
        en: 'Newton third law',
        text: "If A acts on B with a force, B acts on A with an equal and opposite force. "
          + "The crucial difference: the two forces affect **two different bodies**, "
          + "They are never combined in one free body diagram nor do they cancel each other out.",
      },
    ],
    relations: [
      {
        formula: 'ΣF = m a',
        name: "Newton II",
        note: ": ΣFx = max and ΣFy = may. are applied to each axis independently",
      },
      {
        formula: 'W = m g',
        name: "Weight",
        note: "Force in newtons, not mass in kilograms.",
      },
      {
        formula: "N = m(g + a) In an elevator accelerating upward",
        name: "Normal force in an elevator",
        note: "It becomes m(g − a) on downward acceleration, and zero in free fall.",
      },
      {
        formula: 'F_AB = −F_BA',
        name: "Action and reaction",
        note: "On two different bodies; That's why they don't prevent movement.",
      },
    ],
    derivation: {
      title: "Why doesn't normal force always equal weight?",
      intro: "N = mg is preserved as a law, which is not a law but the result of a special case. Let's see where it comes from and when it drops.",
      steps: [
        {
          do: "Draw a body on a stationary horizontal surface: the vertical forces are N up and W down.",
          why: "The chart limits what enters the equation; What is not drawn will not appear in the total.",
        },
        {
          do: "Apply Newton's second vertically: N − W = m a_y.",
          why: "This is the general equation. Everything after it is a branch of it according to the value of a_y.",
        },
        {
          do: "If the object is at rest or moving at a constant speed, then a_y = 0 results in N = W.",
          why: "Here the preserved rule originated. Its condition is a_y = 0, which is a condition that is forgotten and the rule is unjustly generalized.",
        },
        {
          do: "If the body accelerates vertically, such as an elevator ascending with an acceleration of a, then N = m(g + a) > W.",
          why: "Equality was broken because its condition was broken. "
            + "In free fall, a = g becomes N = 0, and this is apparent weightlessness: "
            + "Gravity did not disappear, but the surface force did.",
        },
      ],
    },
  },

  visual: {
    title: "Free-body diagram: one body, its forces alone",
    figure: {
      svg: figure,
      caption: "The box is intentionally isolated from the roof and ground. Every arrow has a force acting on it, "
        + "Nothing is depicted in it that affects others.",
      alt: "An isolated rectangular box in the center of the drawing. A green arrow emerges from the top, its symbol is N, which is the surface force. "
        + "Below it is a red downward arrow whose symbol is W and equals the mass multiplied by the gravitational acceleration. "
        + "On its right side is a horizontal golden arrow, symbol F. "
        + "Under the drawing is a line reminding us that each arrow has a force on this body alone.",
    },
    table: {
      caption: "The normal force on a body of mass m in different situations",
      head: ["Attitude", "Vertical acceleration", "N vertical force", "Compared to weight"],
      rows: [
        ["Stay on a horizontal surface", '0', 'mg', "Equal"],
        ["An elevator accelerates upward by a", '+a', 'm(g + a)', "Bigger"],
        ["An elevator accelerates downward by a", '−a', 'm(g − a)', "Smaller"],
        ["Free fall", '−g', '0', "Non-existent"],
        ["Static with vertical push down F", '0', 'mg + F', "Bigger"],
      ],
    },
    reading: "Only the first row yields N = mg, which is preserved and incorrectly generalized to the rest. "
      + "And read the last row carefully: The body is at rest and yet N ≠ mg, "
      + "Stillness alone is not enough; The condition is that there is no other vertical force.",
  },

  guided: {
    start: "Start with a written sentence: “The object I am studying is this.” "
      + "Then draw on it the external forces alone: always the weight, and the force of the surface if it is in contact. "
      + "The force of the thread if it is tied, and any applied force are mentioned. "
      + "Then choose a positive direction for each axis, and write ΣF = ma for each axis individually. "
      + "Do not mix the forces of two bodies in one equation; Every body has its own diagram and equation.",
    workedExamples: [
      {
        title: "Example 1 · Acceleration on a smooth surface",
        task: "A box of mass 5.0 kg on a smooth horizontal surface is pushed by a horizontal force 20 N. What is its acceleration?",
        steps: [
          {
            do: "The body is the box. Forces on it: weight down, surface force up, and horizontal push.",
            why: "Identifying the body first prevents the introduction of forces that affect the surface or the driving hand.",
          },
          {
            do: "Vertical: No acceleration, N = W and N = W do not enter the horizontal calculation.",
            why: "The two axes are independent; Balanced vertical forces do not affect horizontal acceleration.",
          },
          {
            do: "Horizontally : ΣFx = 20 N alone because the surface is smooth, a = 20/5.0 = 4.0 m/s².",
            why: "Smoothness means no friction, so there is no horizontal force other than pushing.",
          },
        ],
        answer: 'a = 4.0 m/s²',
      },
      {
        title: "Example 2 · Surface force in an elevator",
        task: "A person with mass 60 kg stands in an elevator accelerating upward by 2.0 m/s². "
          + "What is the force of the ground on it? Take g = 9.8 m/s².",
        steps: [
          {
            do: "The body is the person. The forces on it are : N up from the floor, and W = mg down.",
            why: "The elevator is not the object studied, its forces are not depicted here.",
          },
          {
            do: "Make UP positive and write : N − mg = ma.",
            why: "The upward acceleration is positive by our choice, so the right side is positive, so N will be greater than the weight.",
          },
          {
            do: "Solve: N = m(g + a) = 60 × (9.8 + 2.0) = 60 × 11.8 = 708 N.",
            why: "The weight is 588 N, the force is 708 N, and the difference between 120 N is exactly ma. "
              + "This is what the rider feels as extra weight when starting the climb.",
          },
        ],
        answer: 'N = 708 N',
      },
    ],
    skipped: [
      {
        q: "If every action has an equal and opposite reaction, why does anything move at all?",
        a: "Because the two forces affect two different bodies. "
          + "You push the box and it accelerates due to your force on it, and the box pushes you and you are affected by its force. "
          + "The two forces do not come together on one body and are canceled out. "
          + "As for the two forces that cancel each other, they are on the same body, such as weight and surface force, and they are not an action-reaction pair.",
      },
      {
        q: "Does “weightlessness” on the space station mean zero gravity?",
        a: "No. The gravity there is close to 90% than its value on the surface. "
          + "But the station and everything in it are in continuous free fall around the Earth, so the acceleration is the same for all. "
          + "There is no contact force between the pioneer and the station ground. "
          + "The null is N, not W, as in the fourth row of the table.",
      },
      {
        q: "When do I need a chart for each body instead of just one?",
        a: "When you are asked about an internal force between two bodies, such as the tension of the thread connecting them. "
          + "If you are asked about the acceleration of the entire system, one diagram of the total mass is sufficient. "
          + "Because internal forces cancel each other out. As for tension, it does not appear unless you isolate one of the two bodies.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'second-law',
      family: "The first type is acceleration of force",
      aim: "You divide the force by the mass in the right direction.",
      objectives: [1],
      prompt: "A net force 12 N acts on a body of mass 3.0 kg. What is its acceleration?",
      unit: 'm/s²',
      answer: 4,
      tolerance: 0.05,
      solution: '‎a = ΣF/m = 12/3.0 = 4.0 m/s²‎.',
      commonErrors: [
        { value: 36, why: "You multiply the force by the mass. The relationship is F = ma, so the acceleration is F/m not F × m; "
          + "And your output unit is N·kg which is not acceleration." },
        { value: 0.25, why: "You divide the mass by the force. Review which two quantities are in the numerator." },
        { value: 9, why: "You subtracted instead of division." },
      ],
    },
    {
      id: 'weight',
      family: "The second type is weight versus mass",
      aim: "Differentiate between kilograms and newtons.",
      objectives: [1],
      prompt: "What is the weight of an object of mass 8.0 kg on the surface of the Earth? Take g = 9.8 m/s².",
      unit: 'N',
      answer: 78.4,
      tolerance: 0.2,
      solution: '‎W = mg = 8.0 × 9.8 = 78.4 N‎.',
      commonErrors: [
        { value: 8, why: "You wrote the mass. Weight is a force whose unit is a newton, and mass is a quantity of matter whose unit is a kilogram. "
          + "They are two different quantities, not measures of the same thing." },
        { value: 0.816, why: "You divided the mass by g instead of multiplying it by it." },
        { value: 80, why: "You used g = 10 even though the question specified 9.8. "
          + "Approximation is acceptable when left up to you, not when the value is given." },
      ],
    },
    {
      id: 'elevator-normal',
      family: "The third type is surface force with vertical acceleration",
      aim: "Draw the chart and do not generalize N = mg.",
      objectives: [0, 1],
      prompt: "A person with mass 70 kg in an elevator is accelerating upward by 3.0 m/s². "
        + "What is the force of the ground on it? Take g = 9.8 m/s².",
      unit: 'N',
      answer: 896,
      tolerance: 2,
      solution: "N − mg = ma, N = m(g + a) = 70 × 12.8 = 896 N.",
      commonErrors: [
        { value: 686, why: "You calculated mg and neglected the acceleration. "
          + "The equality N = mg requires that there be no vertical acceleration, which is a condition that is violated here." },
        { value: 210, why: "You counted ma alone. This is the resultant force, not the ground force; "
          + "Floor force includes balancing weight as well." },
        { value: 476, why: "You subtracted the acceleration instead of adding it, and calculated m(g − a). "
          + "This works for an elevator accelerating downward; Here the acceleration is upward, so the force is greater than the weight, not smaller." },
      ],
    },
    {
      id: 'net-force',
      family: "The fourth type is the result of two opposing forces",
      aim: "It is subtracted before it is divided, and does not stop at the result.",
      objectives: [1],
      prompt: "Two horizontal forces on a body of mass 2.0 kg: 15 N to the right and 9.0 N to the left. "
        + "How much is it accelerating?",
      unit: 'm/s²',
      answer: 3,
      tolerance: 0.05,
      solution: "The resultant 15 − 9.0 = 6.0 N to the right, then a = 6.0/2.0 = 3.0 m/s².",
      commonErrors: [
        { value: 12, why: "You added the two forces instead of subtracting them. Forces are vectors, and opposites are subtracted. "
          + "If they were combined, the acceleration would be greater, even though one hinders the other." },
        { value: 6, why: "You stopped at the net force and did not divide it by the mass. "
          + "Your output unit is N and the question is for m/s²." },
        { value: 1.5, why: "You divided by the power or multiplied by the mass instead of dividing by it." },
      ],
    },
    {
      id: 'third-law',
      family: "Type 5: Reaction",
      aim: "You realize that the two forces are on two bodies, so they are not canceled or changed by mass.",
      objectives: [2],
      prompt: "Your hand pushes a box of mass 4.0 kg with a force of 10 N along a smooth surface. "
        + "How much force does the box exert on your hand?",
      unit: 'N',
      answer: 10,
      tolerance: 0.1,
      solution: "By Newton's third law, the two forces are equal in magnitude and opposite in direction: 10 N. "
        + "It does not depend on mass or acceleration. "
        + "However, the box accelerates because the force of your hand affects it, and its force affects you.",
      commonErrors: [
        { value: 40, why: "You multiply the force by the mass. The reaction is always equal to the action, "
          + "It has nothing to do with the mass of either body." },
        { value: 2.5, why: "You divided the force by the mass and calculated the acceleration 2.5 m/s², not the force. "
          + "Pay attention to the desired unit." },
        { value: 0, why: "You thought that the reaction cancels out the action, so the result is zero. "
          + "The two forces are on two different bodies, so they do not come together in one diagram or cancel out." },
      ],
    },
  ],
};
