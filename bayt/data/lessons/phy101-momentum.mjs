/* درس بيت الفؤاد · PHY 101 · الدفع وكمّ الحركة.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. */

/* الرسم: تصادم يلتحم فيه الجسمان.
   الإشارات مكتوبة على الأسهم لأنها هي موضع الخطأ، لا الحساب. */
const figure = `<svg viewBox="0 0 480 250" role="img" aria-labelledby="fig-mom-title" class="bayt-svg">`
  + `<title id="fig-mom-title">The collision of two opposite bodies before and after the collision with speed sign</title>`
  /* قبل: جسمان متقابلان بسرعتين متعاكستي الإشارة. */
  + `<text x="52" y="86" font-size="15" fill="#153748" text-anchor="start">Before</text>`
  + `<rect x="90" y="60" width="66" height="44" fill="#cfe6ef" stroke="#284955" stroke-width="2"/>`
  + `<text x="123" y="88" font-size="15" fill="#153748" text-anchor="middle">3 kg</text>`
  + `<line x1="162" y1="82" x2="206" y2="82" stroke="#10766f" stroke-width="3"/>`
  + `<polyline points="196,75 208,82 196,89" fill="none" stroke="#10766f" stroke-width="3"/>`
  + `<text x="184" y="70" font-size="14" fill="#10766f" text-anchor="middle">+4</text>`
  + `<rect x="300" y="60" width="66" height="44" fill="#cfe6ef" stroke="#284955" stroke-width="2"/>`
  + `<text x="333" y="88" font-size="15" fill="#153748" text-anchor="middle">2 kg</text>`
  + `<line x1="294" y1="82" x2="250" y2="82" stroke="#c0392b" stroke-width="3"/>`
  + `<polyline points="260,75 248,82 260,89" fill="none" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="272" y="70" font-size="14" fill="#c0392b" text-anchor="middle">−5</text>`
  /* بعد: كتلة واحدة ملتحمة بسرعة واحدة. */
  + `<text x="52" y="186" font-size="15" fill="#153748" text-anchor="start">After</text>`
  + `<rect x="190" y="160" width="100" height="44" fill="#cfe6ef" stroke="#284955" stroke-width="2"/>`
  + `<text x="240" y="188" font-size="15" fill="#153748" text-anchor="middle">5 kg</text>`
  + `<line x1="296" y1="182" x2="326" y2="182" stroke="#10766f" stroke-width="3"/>`
  + `<polyline points="316,175 328,182 316,189" fill="none" stroke="#10766f" stroke-width="3"/>`
  + `<text x="342" y="187" font-size="14" fill="#10766f" text-anchor="middle">+0.4</text>`
  + `<text x="240" y="234" font-size="13" fill="#566f7a" text-anchor="middle">Total momentum before and after is equal to : 12 minus 10 equals 2</text>`
  + `</svg>`;

export default {
  course: 'phy101',
  topic: 'momentum',

  objectives: [
    "Calculate momentum and impulse, and connect them through the impulse–momentum theorem.",
    "It applies momentum conservation to an isolated system while preserving velocity sign.",
    "Differentiate between elastic and inelastic collisions in terms of what is saved and what is lost.",
  ],

  boundaries: [
    "Collisions in two dimensions and factored momentum into two components are not in this lesson.",
    "The center of mass and its motion are out of scope here.",
    "Systems with variable mass, such as rockets, are not in this lesson.",
    "The coefficient of restitution is not covered here.",
  ],

  prerequisites: [
    {
      title: "Choose a positive direction and stick to it",
      why: "Quantum motion is a vector, and almost all of the errors in this lesson are sign errors, not calculation errors.",
      recap: "Write on your paper “The right is positive” before any number. "
        + "Then write each velocity with its sign: the one to the right is positive and the one to the left is negative. "
        + "A body at rest has a zero velocity, not negative.",
      href: '/semester-1/physics/motion/',
      hrefLabel: "Vectors and sign in motion lesson",
    },
    {
      title: "Newton's third law",
      why: "Conservation of momentum is a direct result of it, and whoever understands this knows why it is required that the system be isolated.",
      recap: "The force exerted by A on B is equal in magnitude and opposite in direction to the force of B on A. "
        + "They affect during the same period, so the two payments are equal and opposite. "
        + "What one gains in terms of movement, the other loses.",
      href: '/semester-1/physics/forces/',
      hrefLabel: "Study Newton's laws",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Momentum",
        en: 'Momentum',
        text: "p = m v, a vector quantity with unit kg·m/s. "
          + "Its direction is the direction of speed, and its sign in linear motion follows your chosen positive direction. "
          + "Note that it is linear in speed, unlike the kinetic energy that is squared in it.",
      },
      {
        term: "Impulse",
        en: 'Impulse',
        text: "Impulse is the time integral of net force and equals the change in momentum, J=Δp. For constant force, J=FΔt; the same formula uses average force when force varies. Units are N·s or kg·m/s. For the same momentum change, a longer stopping time reduces average force.",
      },
      {
        term: "Isolated system",
        en: 'Isolated system',
        text: "A system with zero net external force has constant total momentum. During a brief collision, momentum conservation can be a useful approximation when external impulse is negligible compared with the internal momentum exchanges.",
      },
      {
        term: "Perfectly inelastic collision",
        en: 'Perfectly inelastic collision',
        text: "The bodies stick together and share a common final velocity. With negligible external impulse, total momentum is conserved. Kinetic energy is generally reduced as energy becomes internal energy, deformation or sound. For fixed initial momenta, sticking gives the greatest kinetic-energy loss among ordinary collisions without an added energy source.",
      },
      {
        term: "Elastic collision",
        en: 'Elastic collision',
        text: "Both momentum and kinetic energy are conserved. "
          + "It is an ideal model that collisions of billiard balls and gaseous molecules approach. "
          + "It is not fully achieved in large objects.",
      },
    ],
    relations: [
      {
        formula: 'p = m v',
        name: "Momentum",
        note: "vector; Carry the sign with you to every line.",
      },
      {
        formula: 'J = F Δt = Δp',
        name: "The theorem of impulse and momentum",
        note: "Great power in a short time is equivalent to small power in a long time.",
      },
      {
        formula: 'Σ p_before = Σ p_after',
        name: "Preserving the momentum",
        note: "For isolated system; It is valid in all types of collisions.",
      },
      {
        formula: 'm₁v₁ + m₂v₂ = (m₁ + m₂) v_f',
        name: "Adhesive collision",
        note: "The right side has one mass and one speed.",
      },
    ],
    derivation: {
      title: "Why is momentum conserved, and why is kinetic energy not conserved with it?",
      intro: "The two memorizations seem related, but they are not. The reason is clear from the source of each.",
      steps: [
        {
          do: "During a collision, each body exerts a force on the other, and they are equal and opposite according to Newton's third law.",
          why: "This is the starting point: conservation is not an independent principle but a consequence of the third law.",
        },
        {
          do: "They affect during the same period, so the two impulses F Δt are equal and opposite.",
          why: "The contact time for the two bodies is necessarily the same, so equal forces necessitate equal thrusts.",
        },
        {
          do: "The push is a change in the amount of movement, so what one gains is lost by the other, and the total is fixed.",
          why: "Preservation arises from the opposition, not from the nature of the collision. This is why it is true for both elastic and inflexible ones.",
        },
        {
          do: "As for kinetic energy, nothing similar protects it: "
            + "Internal forces may deform the two objects, heat them and produce sound.",
          why: "Total energy is always conserved, but **kinetic** is transformed into other forms. "
            + "There is no law that prevents this transformation, while there is something that prevents the imbalance of the total momentum. "
            + "Hence: momentum is always conserved, and kinetic energy is in elastic alone.",
        },
      ],
    },
  },

  visual: {
    title: "Signs before numbers",
    figure: {
      svg: figure,
      caption: "Two opposite bodies joining. Momentum before = 3(+4) + 2(−5) = +2 kg·m/s, "
        + "Then = 5 × (+0.4) = +2 kg·m/s., and a positive sign means that the conjoined mass is moving to the right.",
      alt: "Two rows. In the first row there are two objects: the left one has a mass of three kilograms and its arrow to the right has a positive value of four. "
        + "The right one has a mass of two kilograms and its arrow to the left has a negative value of five. "
        + "In the second row, there is one mass of five kilograms and a small arrow to the right with a positive value of four out of ten. "
        + "Below them is a line showing that the sum of the momentum before is equal to it after.",
    },
    table: {
      caption: "What is preserved and what is not preserved in each type",
      head: ["Type", "Momentum", "Kinetic energy", "What happens to the two bodies?"],
      rows: [
        ["Flexible", "Saved", "Reserved", "They separate without loss"],
        ["Inflexible", "Saved", "Unreserved", "They separate with loss"],
        ["Completely inflexible", "Saved", "Unpreserved and most lost", "They fuse and move together"],
        ["Explosion", "Saved", "It increases", "They disperse with stored energy"],
      ],
    },
    reading: "The second column is the same in the four rows, and the third changes. "
      + "This is the content of the above derivation: the conservation guaranteed by the third law is the conservation of momentum alone. "
      + "Notice the last row: the explosion is an inverted collision, and the momentum in it is also conserved. "
      + "A stationary cannon, from which a shell is fired to the right, bounces back to the left, so that the total remains zero.",
  },

  guided: {
    start: "Write the positive direction first. Then make a table with two columns: before and after, "
      + "Put m v in each box with its mark. Then equate the sum of the two columns. "
      + "Do not calculate kinetic energy, thinking that it is conserved. Check the collision type first. "
      + "If the two bodies collide, the other side has one mass and one unknown speed.",
    workedExamples: [
      {
        title: "Example 1 · coalescing with different sign",
        task: "An object of mass 3.0 kg moving to the right with speed 4.0 m/s collides with an object of mass 2.0 kg "
          + "He moves left at a speed of 5.0 m/s, and they collide. What is their speed after the collision?",
        steps: [
          {
            do: "Make right positive : v₁ = +4.0 and v₂ = −5.0.",
            why: "Writing the two signs explicitly before the calculation is the difference between the correct and incorrect answer here.",
          },
          {
            do: "Quantity of movement before : 3.0(+4.0) + 2.0(−5.0) = 12 − 10 = +2.0 kg·m/s.",
            why: "Addition is vector addition, so negative is subtracted. "
              + "If the amounts were added together, 22 would come out, which is an error of eleven times.",
          },
          {
            do: "After the collision one mass 5.0 kg has a speed of v: 5.0 v = +2.0.",
            why: "Coalition means one speed, the unknown is one, and one equation is sufficient.",
          },
          {
            do: "So v = +0.40 m/s, that is, right.",
            why: "The positive sign is part of the answer, not an adornment: it says that the confluent mass is moving to the right. "
              + "Because the momentum of the first body was greater.",
          },
        ],
        answer: 'v = +0.40 m/s (to the right)',
      },
      {
        title: "Example 2 · Lost energy in docking",
        task: "In the previous example, how much kinetic energy was lost?",
        steps: [
          {
            do: "Before : ½(3.0)(4.0)² + ½(2.0)(5.0)² = 24 + 25 = 49 J.",
            why: "Energy is scalar, not vector, so the velocity is squared and the sign disappears; "
              + "That is why the two terms are added and not subtracted.",
          },
          {
            do: "After : ½(5.0)(0.40)² = 0.40 J.",
            why: "The speed after docking is small, and squaring makes it even smaller.",
          },
          {
            do: "Missing 49 − 0.40 = 48.6 J.",
            why: "It turns into heat, distortion, and sound. "
              + "The quantum of motion remains conserved at the same time, and this is not a contradiction: the two quantities are governed by two different laws.",
          },
        ],
        answer: 'ΔKE ≈ 48.6 J lost',
      },
    ],
    skipped: [
      {
        q: "How is momentum conserved and energy lost in the collision itself?",
        a: "Because the two quantities measure two different things. "
          + "Quantum of motion is a vector protected by the opposition of forces in the third law. "
          + "Kinetic energy is standard, and nothing prevents it from being transformed into heat and deformation. "
          + "Total energy is always conserved, and what is lost is its kinetic form, not the energy itself.",
      },
      {
        q: "Why does an airbag reduce injury if the change in momentum is the same?",
        a: "Because F Δt = Δp and its right end are already fixed: the rider will stop in both cases. "
          + "Prolonging Δt inevitably makes F smaller. "
          + "The pillow does not reduce the change in the amount of movement, but rather spreads it over a longer time, and force is what hurts.",
      },
      {
        q: "Is momentum conserved if there is friction?",
        a: "Not in the long run, because friction is an external force. "
          + "But during the collision itself, the collision forces are orders of magnitude greater than the friction. "
          + "Its time is very short, so the effect of friction is neglected and the system is treated as isolated at that moment. "
          + "This is a justified approximation, not ignoring the force.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'momentum-basic',
      family: "The first type: Calculating momentum",
      aim: "Multiply the mass by the velocity in the correct unit.",
      objectives: [0],
      prompt: "What is the momentum of a car with mass 1500 kg traveling at speed 20 m/s?",
      unit: 'kg·m/s',
      answer: 30000,
      tolerance: 10,
      solution: '‎p = m v = 1500 × 20 = 30000 kg·m/s‎.',
      commonErrors: [
        { value: 75, why: "You divide the mass by the speed. The amount of motion is a product of multiplication, not division." },
        { value: 300000, why: "You made a mistake in the number of zeros:. 1500 × 20 = 30000, not 300000." },
        { value: 600000, why: "You multiplied by the square of the speed or added the kinetic energy factor; "
          + "The quantum of motion is linear in velocity and not quadratic." },
      ],
    },
    {
      id: 'inelastic-rest',
      family: "The second type: docking with a stationary body",
      aim: "It is divided by the total mass, not by one of them.",
      objectives: [1],
      prompt: "An object of mass 2.0 kg moving with speed 6.0 m/s collides with a stationary object of mass 4.0 kg and they merge. "
        + "What is their speed after the collision?",
      unit: 'm/s',
      answer: 2,
      tolerance: 0.05,
      solution: "2.0(6.0) + 4.0(0) = (2.0 + 4.0) v, 12 = 6.0 v and v = 2.0 m/s.",
      commonErrors: [
        { value: 6, why: "You wrote the initial velocity. After coalescence, the mass tripled. "
          + "The speed must decrease." },
        { value: 3, why: "You divide by the mass of the moving object alone. "
          + "After coalescence, the two masses move together, so the denominator is their sum." },
        { value: 1.5, why: "You divide by the mass of the body at rest alone." },
      ],
    },
    {
      id: 'signed-collision',
      family: "The third type is a collision of two sign",
      aim: "Subtract, not add, when the two velocities are opposite.",
      objectives: [1],
      prompt: "An object 3.0 kg moving to the right with a speed of 4.0 m/s collides with an object 2.0 kg moving to the left with a speed of 5.0 m/s, "
        + "They join. What is their speed after the collision? Make the right positive and write the sign.",
      unit: 'm/s',
      answer: 0.4,
      tolerance: 0.02,
      solution: '‎3.0(+4.0) + 2.0(−5.0) = 12 − 10 = +2.0‎. '
        + "Then 5.0 v = +2.0 then v = +0.40 m/s right.",
      commonErrors: [
        { value: 4.4, why: "You added the two expressions, neglecting the sign of the second object : (12 + 10)/5 = 4.4. "
          + "The second body moves to the left, so its momentum is negative and subtracted." },
        { value: -0.4, why: "You missed the final sign. "
          + "The momentum of the first 12 is greater than 10, so the resultant is positive and the movement is to the right." },
        { value: 2, why: "You stopped at the total momentum +2.0 kg·m/s and did not divide it by the total mass." },
      ],
    },
    {
      id: 'impulse',
      family: "Fourth style · impulse",
      aim: "The force is multiplied by the time and the unit of the resultant is known.",
      objectives: [0],
      prompt: "Force 200 N acts for duration 0.050 s. How much is the thrust?",
      unit: 'N·s',
      answer: 10,
      tolerance: 0.1,
      solution: "J = F Δt = 200 × 0.050 = 10 N·s, which is equivalent to 10 kg·m/s in terms of momentum change.",
      commonErrors: [
        { value: 4000, why: "You divided power by time. impulse is a product of multiplication; "
          + "Dividing by time gives the rate of change of force, which is not what is required." },
        { value: 200, why: "You wrote force. Thrust combines force and time, and its unit is N·s, not N." },
        { value: 0.05, why: "You wrote time instead of impulse." },
      ],
    },
    {
      id: 'energy-lost',
      family: "Type 5 · Energy lost in fusion",
      aim: "It calculates energy before and after and does not assume conservation.",
      objectives: [2],
      prompt: "An object 2.0 kg with a speed of 6.0 m/s joins a stationary object 4.0 kg and they move together with a speed of 2.0 m/s. "
        + "How many joules of kinetic energy were lost?",
      unit: 'J',
      answer: 24,
      tolerance: 0.5,
      solution: "Before : ½(2.0)(6.0)² = 36 J. and after : ½(6.0)(2.0)² = 12 J. "
        + "The missing 36 − 12 = 24 J turned into heat, distortion, and sound.",
      commonErrors: [
        { value: 0, why: "You assumed that kinetic energy is conserved. "
          + "They are preserved in elastic collision alone; Coalition is the type of collision that loses the most energy. "
          + "What is preserved here is the momentum, not the energy." },
        { value: 36, why: "You wrote the energy before the collision, not the energy lost." },
        { value: 12, why: "You wrote the energy after the collision, not the difference between them." },
      ],
    },
  ],
};
