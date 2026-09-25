/* درس بيت الفؤاد · CHEM 101 · تركيب الذرة. */

/* الرسم: الرمز النووي مشروحًا بأسهم. الطالب يرى أين يُكتب كل عدد
   ولماذا، بدل أن يحفظ أن «العلوي هو الكتلي».

   تنبيه على إرساء النص العربي في SVG: اتجاه الكتابة يقلب معنى text-anchor،
   فـ start يضع x عند الحافة اليمنى والنص يمتد يسارًا، و end يضع x عند
   الحافة اليسرى والنص يمتد يمينًا. عكسُ ذلك يجعل الوسوم تركب على الرمز. */
const figure = `<svg viewBox="0 0 520 260" role="img" aria-labelledby="fig-atom-title" class="bayt-svg">`
  + `<title id="fig-atom-title">Nuclear symbol for chlorine with arrows showing the position of the mass number, atomic number and charge</title>`
  + `<text x="290" y="96" font-size="26" fill="#153748" text-anchor="middle">35</text>`
  + `<text x="290" y="150" font-size="26" fill="#153748" text-anchor="middle">17</text>`
  + `<text x="340" y="130" font-size="44" fill="#105c78" text-anchor="middle">Cl</text>`
  + `<text x="386" y="100" font-size="24" fill="#c69748" text-anchor="middle">−</text>`
  /* أسهم من النصوص التفسيرية إلى مواضعها في الرمز. */
  + `<line x1="256" y1="62" x2="274" y2="86" stroke="#566f7a" stroke-width="2"/>`
  + `<line x1="256" y1="186" x2="274" y2="154" stroke="#566f7a" stroke-width="2"/>`
  + `<line x1="400" y1="64" x2="392" y2="90" stroke="#566f7a" stroke-width="2"/>`
  /* الوسوم اليسرى: حافتها اليمنى عند 250، فتمتد يسارًا بعيدًا عن الرمز. */
  + `<text x="250" y="56" font-size="15" fill="#284955" text-anchor="end">Mass number</text>`
  + `<text x="250" y="76" font-size="13" fill="#566f7a" text-anchor="end">Protons + neutrons</text>`
  + `<text x="250" y="192" font-size="15" fill="#284955" text-anchor="end">Atomic number</text>`
  + `<text x="250" y="212" font-size="13" fill="#566f7a" text-anchor="end">Protons</text>`
  /* الوسوم اليمنى: حافتها اليسرى عند 404، فتمتد يمينًا بعيدًا عن الشحنة. */
  + `<text x="404" y="56" font-size="15" fill="#284955" text-anchor="start">Charge</text>`
  + `<text x="404" y="76" font-size="13" fill="#566f7a" text-anchor="start">Electron change</text>`
  + `<text x="260" y="240" font-size="14" fill="#10766f" text-anchor="middle">17 protons · 18 neutrons · 18 electrons</text>`
  + `</svg>`;

export default {
  course: 'chemistry',
  topic: 'atomic-structure',

  objectives: [
    "Extracts the number of protons, neutrons and electrons from the nuclear symbol and from the charge.",
    "Differentiate between atomic number, mass number, and average atomic mass.",
    "The average atomic mass is calculated from the masses and abundances of isotopes.",
  ],

  boundaries: [
    "The distribution of electrons on sublevels is the subject of the quantum theory lesson, not this lesson.",
    "Nuclear binding energy and radioactive decay are beyond this lesson.",
    "Polyatomic ions such as sulfates are not here; We limit ourselves to monoatomic ions.",
  ],

  prerequisites: [
    {
      title: "Read the nuclear symbol",
      why: "Every calculation in this lesson begins by reading two numbers of the symbol, so a mistake in reading spoils what comes after it.",
      recap: "The symbol is written with two numbers to the left of the element symbol: the upper one is the mass number A, "
        + "The bottom one is the atomic number Z., so A is the sum of protons and neutrons, and Z is the number of protons alone. "
        + "Remember that Z defines the element: every atom that has a proton 17 is chlorine, no matter how many neutrons it has.",
    },
    {
      title: "Weighted average",
      why: "Atomic mass is an average weighted by abundance, and whoever calculates it as an arithmetic average is mistaken in every issue of isotopes.",
      recap: "The arithmetic mean treats the values equally, and the weighted gives each value its weight. "
        + "If 90% from the sample has a mass of 20 and 10% has a mass of 30, then the weighted average "
        + "0.90 × 20 + 0.10 × 30 = 21, not (20 + 30)/2 = 25. "
        + "The result is always close to the most abundant value, which is a sign that quickly reveals your error.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Atomic number",
        en: 'Atomic number (Z)',
        text: "The number of protons in the nucleus. It is the identity of the element: it does not change in chemical reactions. "
          + "Changing it means another element. In a neutral atom, the number of electrons is also equal to "
          + "But this is a casual equality that ends as soon as the atom becomes an ion.",
      },
      {
        term: "Mass number",
        en: 'Mass number (A)',
        text: "The sum of protons and neutrons in the nucleus, which is always an integer because it is a count, not a measurement. "
          + "Hence: the number of neutrons = A − Z.",
      },
      {
        term: "Isotope",
        en: 'Isotope',
        text: "Atoms of the same element differ in the number of neutrons, so they agree in Z and differ in A. "
          + "Their chemical behavior is almost identical because chemistry is governed by electrons, not neutrons. "
          + "But their mass varies.",
      },
      {
        term: "Atomic mass",
        en: 'Atomic mass',
        text: "Weighted average of the masses of an element's isotopes according to their abundance in nature, in atomic mass unit u. "
          + "It is not usually an integer, and this is the difference that distinguishes it from the mass number: "
          + "The mass of chlorine is 35.45 u and not a single chlorine atom has a mass of 35.45.",
      },
      {
        term: "ion",
        en: 'Ion',
        text: "An atom that has lost or gained electrons, so its balance is disturbed. "
          + "The loss of electrons gives a positive charge because there are more protons. "
          + "Acquiring it gives a negative charge. The nucleus does not change in either case.",
      },
    ],
    relations: [
      {
        formula: 'protons = Z',
        name: "Protons",
        note: "It is read directly from the atomic number, and is not affected by the charge at all.",
      },
      {
        formula: 'neutrons = A − Z',
        name: "Neutrons",
        note: "Subtract, not add. It is the only one that differs between isotopes of the element.",
      },
      {
        formula: 'electrons = Z − charge',
        name: "Electrons",
        note: "Note the subtraction with the sign: +3 charge means Z − 3, and −2 charge means Z + 2.",
      },
      {
        formula: 'atomic mass = Σ (fraction × isotope mass)',
        name: "Average atomic mass",
        note: "Abundances are converted from percentages to decimals before multiplying.",
      },
    ],
    derivation: {
      title: "Why is the mass of chlorine 35.45 and there is no chlorine atom with this mass?",
      intro: "A question that confuses many students: The periodic table gives a fractional number, and the nucleus contains only integers.",
      steps: [
        {
          do: "Chlorine has two major isotopes: ³⁵Cl, with abundance 75.77%, and ³⁷Cl, with abundance 24.23%.",
          why: "Natural chlorine is a mixture, not one type, so any number that represents it must represent the mixture.",
        },
        {
          do: "Convert abundance to decimals : 0.7577 and 0.2423.",
          why: "The percentage is not multiplied directly; A decimal fraction represents each isotope's share of the unit.",
        },
        {
          do: "Multiply the mass of each peer by its quota and add: 0.7577 × 34.97 + 0.2423 × 36.97.",
          why: "This is the weighted average: each isotope is affected to the extent of its presence, not equally.",
        },
        {
          do: "The output is 26.50 + 8.96 = 35.46, which is close to the supported value 35.45.",
          why: "The result is closer to 35 than to 37 because the light isotope is more abundant. "
            + "This is a quick sign that reveals the error in the calculation before reviewing it.",
        },
      ],
    },
  },

  visual: {
    title: "Nuclear symbol: where each number is written",
    figure: {
      svg: figure,
      caption: "The symbol ³⁵Cl⁻: is the mass number at the top left, the atomic number at the bottom, and the charge at the top right.",
      alt: "The symbol for chlorine and three numbers: thirty-five at the top left, which is the mass number, i.e. sum "
        + "Protons and neutrons, and seventeen at the bottom left, which is the atomic number, that is, the protons alone. "
        + "There is a negative sign at the top right, which is the charge that changes the number of electrons alone. "
        + "Below the drawing is a line showing the total: seventeen protons, eighteen neutrons, and eighteen electrons.",
    },
    table: {
      caption: "Three types of comparison, to make it clear what changes and what remains",
      head: ["Type", 'Z', 'A', "Protons", "Neutrons", "electrons"],
      rows: [
        ["³⁵Cl atom is neutral", '17', '35', '17', '18', '17'],
        ["Its isotope ³⁷Cl is neutral", '17', '37', '17', '20', '17'],
        ["ion ³⁵Cl⁻", '17', '35', '17', '18', '18'],
        ["ion ²⁷Al³⁺", '13', '27', '13', '14', '10'],
      ],
    },
    reading: "Read the first two rows together: A changed and only the neutrons changed, they are isotopes. "
      + "Then read the first and third rows: Fix everything except the electrons, as this is an ion of an atom that has no isotope. "
      + "The distinction between these two changes is what the student will be most tested in this subject.",
  },

  guided: {
    start: "Start with the atomic number Z: is protons, which is a constant that is not affected by charge and is not changed by isotopes. "
      + "Then neutrons by subtraction A − Z. and finally electrons, which are the only ones affected by charge. "
      + "In this order, you will not confuse the three, because you start with the constant and end with the variable.",
    workedExamples: [
      {
        title: "Example: 1 · is a positive ion",
        task: "How many protons, neutrons and electrons are in ²⁷Al³⁺?",
        steps: [
          {
            do: "The atomic number of aluminum is Z = 13, and the protons are 13.",
            why: "Protons are the identity of the element, and do not change by losing or gaining electrons.",
          },
          {
            do: "Neutrons = A − Z = 27 − 13 = 14.",
            why: "The mass number is the sum of the protons and neutrons. Subtracting the protons leaves the neutrons.",
          },
          {
            do: "Electrons = Z − charge = 13 − 3 = 10.",
            why: "The charge +3 means the loss of three electrons, so the positive becomes three more than the negative.",
          },
        ],
        answer: '13 protons, 14 neutrons, 10 electrons',
      },
      {
        title: "Example 2 · average atomic mass",
        task: "There are two isotopes : ⁶³X with mass 62.93 u with abundance 69.15%, and ⁶⁵X with mass 64.93 u with abundance 30.85%. "
          + "Calculate its atomic mass.",
        steps: [
          {
            do: "Convert the two numbers into two fractions : 0.6915 and 0.3085.",
            why: "A decimal is the isotope's share of a unit, and a percentage does not lend itself to direct multiplication.",
          },
          {
            do: "Multiply and add : 0.6915 × 62.93 + 0.3085 × 64.93.",
            why: "Each isotope contributes as abundant as it is; This is the meaning of weighting.",
          },
          {
            do: "Output 43.52 + 20.03 = 63.55 u.",
            why: "The result is closer to 62.93 because the lighter isotope is more abundant, so this is a quick check of the validity of the calculation.",
          },
        ],
        answer: '63.55 u',
      },
    ],
    skipped: [
      {
        q: "Why don't protons change in chemical reactions?",
        a: "Because a chemical reaction is an exchange or sharing of electrons, and does not reach the nucleus. "
          + "Changing protons means changing the element itself, and this is a nuclear reaction, not a chemical one. "
          + "It requires orders of magnitude more energy.",
      },
      {
        q: "Is the mass number the same as the atomic mass?",
        a: "No. The mass number is an integer count of the particles in a single nucleus. "
          + "Atomic mass is a weighted measurement of the mixture of isotopes as they exist in nature, and is often fractional. "
          + "Confusing them is the most common mistake in this topic.",
      },
      {
        q: "Why is the mass of the isotope not a strictly integer even though the particles are counted?",
        a: "Because part of the mass of the particles is converted into binding energy that holds the nucleus together, "
          + "The mass of the nucleus is slightly less than the sum of the masses of its individual components. "
          + "Detailing this is beyond the scope of this lesson, as mentioned above.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'neutrons',
      family: "The first type: Counting neutrons",
      aim: "It applies subtraction, not addition, and distinguishes A from Z.",
      objectives: [0, 1],
      prompt: "How many neutrons are in a ⁵⁶Fe atom? Note that the atomic number of iron is 26.",
      unit: "Neutron",
      answer: 30,
      tolerance: 0.01,
      solution: "Neutrons = A − Z = 56 − 26 = 30.",
      commonErrors: [
        { value: 26, why: "You wrote the atomic number, which is the number of protons, not neutrons." },
        { value: 56, why: "You wrote the mass number, which is the sum of the protons and neutrons together, not the neutrons alone." },
        { value: 82, why: "You added the two numbers instead of subtracting them. The mass number already includes protons, so addition counts them twice." },
      ],
    },
    {
      id: 'electrons-ion',
      family: "The second type: Ion electrons",
      aim: "The charge is applied to the electrons alone, and with the correct sign.",
      objectives: [0],
      prompt: "How many electrons are in the ion ³²S²⁻? Note that the atomic number of sulfur is 16.",
      unit: "Electron",
      answer: 18,
      tolerance: 0.01,
      solution: "Electrons = Z − charge = 16 − (−2) = 18. "
        + "A negative charge means gaining two electrons, so there are two more electrons than protons.",
      commonErrors: [
        { value: 14, why: "You subtracted 2 instead of adding it. The charge −2 means the gain of two electrons, and the gain increases, not decreases." },
        { value: 16, why: "You neglected the charge and treated the ion as a neutral atom." },
        { value: 32, why: "You wrote the mass number. Electrons have nothing to do with A at all." },
      ],
    },
    {
      id: 'weighted-mass',
      family: "The third type: average atomic mass",
      aim: "Weight by abundance rather than taking an average.",
      objectives: [2],
      prompt: "An element has two isotopes: the first has a mass of 10.0 u and its abundance is 20.0%, and the second has a mass of 11.0 u and its abundance is 80.0%. "
        + "What is its atomic mass in u?",
      unit: 'u',
      answer: 10.8,
      tolerance: 0.02,
      solution: '‎0.200 × 10.0 + 0.800 × 11.0 = 2.00 + 8.80 = 10.8 u‎. '
        + "Note that the output is close to 11.0 because the second isotope is the most abundant.",
      commonErrors: [
        { value: 10.5, why: "You took the arithmetic mean (10.0 + 11.0)/2 and neglected abundance. "
          + "The two counterparts are not equal in existence, so it is not valid for them to have equal influence. "
          + "The revealing sign: the output should tend towards the more abundant isotope, which is 11.0. here" },
        { value: 10.2, why: "You reversed the two abundances: you gave 80% to the light isotope and 20% to the heavy isotope." },
        { value: 21, why: "You added the products after using the percentages as they were without converting them to decimals." },
      ],
    },
    {
      id: 'charge-from-counts',
      family: "The fourth type: Inferring the charge",
      aim: "Reverse the relationship: from numbers to charge instead of vice versa.",
      objectives: [0],
      prompt: "An ion in which 20 is a proton and 18 is an electron. What did you charge? Write the number with a sign.",
      unit: "charge",
      answer: 2,
      tolerance: 0.01,
      solution: "charge = protons − electrons = 20 − 18 = +2. "
        + "More protons, so the charge is positive.",
      commonErrors: [
        { value: -2, why: "You reversed the sign. An increase in protons gives a positive charge; "
          + "Negativity comes from excess electrons." },
        { value: 38, why: "You added the two numbers. Charge is the difference between positive and negative, not the sum of them." },
        { value: 18, why: "You wrote the number of electrons instead of the charge." },
      ],
    },
    {
      id: 'isotope-vs-ion',
      family: "Type 5: Isotope or ion",
      aim: "It determines which number has changed, which is what distinguishes an isotope from an ion.",
      objectives: [1],
      prompt: "An atom ⁴⁰Ca has an atomic number of 20. Another atom has the same atomic number and mass number 44. "
        + "How many neutrons are in this other type?",
      unit: "Neutron",
      answer: 24,
      tolerance: 0.01,
      solution: "The stability of Z and the variability of A means that they are isotopes, and the difference is in the neutrons alone. "
        + "Neutrons = 44 − 20 = 24.",
      commonErrors: [
        { value: 20, why: "You wrote the atomic number. It is fixed between the two counterparts, and is not what is required." },
        { value: 4, why: "You calculated the difference between the two mass numbers 44 − 40, which is the increase in neutrons "
          + "Not their total number." },
        { value: 44, why: "You wrote the mass number without subtracting the protons." },
      ],
    },
  ],
};
