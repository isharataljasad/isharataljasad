/* درس بيت الفؤاد · CHEM 101 · خواص الغازات. */

/* الرسم: المقياسان جنبًا إلى جنب على محور واحد.
   الفكرة أن السيليزية تبدأ من نقطة اعتباطية، فالنسب فيها بلا معنى. */
const tick = (x, label, kelvin) =>
  `<line x1="${x}" y1="100" x2="${x}" y2="124" stroke="#284955" stroke-width="2"/>`
  + `<text x="${x}" y="90" font-size="15" fill="#c0392b" text-anchor="middle">${label}</text>`
  + `<text x="${x}" y="144" font-size="15" fill="#105c78" text-anchor="middle">${kelvin}</text>`;

const figure = `<svg viewBox="0 0 480 240" role="img" aria-labelledby="fig-gas-title" class="bayt-svg">`
  + `<title id="fig-gas-title">One temperature axis has two readings: Celsius above and Kelvin below</title>`
  + `<line x1="40" y1="112" x2="450" y2="112" stroke="#284955" stroke-width="2"/>`
  + tick(60, '−273', '0')
  + tick(229, '27', '300')
  + tick(399, '327', '600')
  + `<text x="40" y="34" font-size="14" fill="#c0392b" text-anchor="start">Celsius</text>`
  + `<text x="40" y="184" font-size="14" fill="#105c78" text-anchor="start">Kelvin</text>`
  /* علامة الصفر المطلق: هنا يبدأ مقياس واحد ولا يبدأ الآخر. */
  + `<line x1="60" y1="60" x2="60" y2="100" stroke="#c69748" stroke-width="2" stroke-dasharray="4 3"/>`
  + `<text x="70" y="58" font-size="13" fill="#c69748" text-anchor="start">Absolute zero</text>`
  + `<text x="240" y="208" font-size="14" fill="#566f7a" text-anchor="middle">27°C → 327°C: Celsius ratios are not absolute ratios</text>`
  + `<text x="240" y="228" font-size="14" fill="#566f7a" text-anchor="middle">300 K → 600 K: absolute temperature doubles</text>`
  + `</svg>`;

export default {
  course: 'chemistry',
  topic: 'gases',

  objectives: [
    "Convert to Kelvin before any gas calculations, and you will learn why Celsius does not work in ratios.",
    "PV = nRT and the two-state law apply in units consistent with the gas constant used.",
    "You calculate the partial pressure from the mole fraction, and differentiate it from the total pressure.",
  ],

  boundaries: [
    "Graham's law of diffusion and flow is not in this lesson.",
    "The van der Waals equation is mentioned for reference and is not calculated here.",
    "Mathematical derivation of kinetic theory and distribution of off-scale velocities.",
    "Calculations of reactions that produce gases are the subject of another lesson; Here we limit ourselves to the state of the gas itself.",
  ],

  prerequisites: [
    {
      title: "Calculate the number of moles",
      why: "Letter n In the ideal gas law moles do not fines, and many problems give you mass.",
      recap: "n = m / M where M is the molar mass of g/mol. "
        + "Example: 64 g from O₂ has a molar mass of 32 g/mol, so the number of moles is 2.0 mol. "
        + "Note that O₂ is a diatomic molecule, so its molar mass is twice the atomic mass.",
      href: '/semester-1/chemistry/solutions/',
      hrefLabel: "Converting mass to moles in the solutions lesson",
    },
    {
      title: "Consistency of units with the gas constant",
      why: "The value of R varies with units, so using a value with other units silently gives an incorrect result.",
      recap: "With R = 0.08206 L·atm/(mol·K) the pressure should be atm and the volume should be L "
        + "And the temperature is in K. "
        + "With R = 8.314 J/(mol·K), the pressure is Pa and the volume is m³. "
        + "The practical rule: choose R first and then convert everything to its units, not the other way around.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Absolute temperature",
        en: 'Absolute temperature',
        text: "Temperature measured from absolute zero in Kelvin (: K = °C + 273.15.). "
          + "Its zero is not a term, but rather a physical limit at which translational kinetic energy is non-existent. "
          + "For this reason alone, it is suitable for ratios and division in the gas laws.",
      },
      {
        term: "Ideal gas",
        en: 'Ideal gas',
        text: "A model that assumes three things: that the volume of the particles is negligible compared to the volume of the container; "
          + "There are no forces of attraction between them, and their collisions are completely elastic. "
          + "It is a good approximation at low pressures and high temperatures, and it gets worse as the gas approaches liquefaction.",
      },
      {
        term: "Gas constant",
        en: 'Gas constant (R)',
        text: "A constant that relates pressure and volume to moles and temperature. "
          + "Its value is 0.08206 L·atm/(mol·K) or 8.314 J/(mol·K), which are the same value in two different units. "
          + "Choosing the value forces you to choose the units of the remainder.",
      },
      {
        term: "Partial pressure",
        en: 'Partial pressure',
        text: "The pressure that a single component in a gaseous mixture would create if it occupied the container alone. "
          + "It is equal to the mole fraction multiplied by the total pressure: P_i = x_i P_total. "
          + "The sum of the partial pressures is the total pressure, and this is Dalton's law.",
      },
      {
        term: "molar fraction",
        en: 'Mole fraction',
        text: "Moles of a component divided by the total moles of the mixture. A unitless number between zero and one, "
          + "The sum of the mole fractions of the mixture's components equals one. "
          + "It is not pressure, so it is not correct to write it as an answer to a question about pressure.",
      },
    ],
    relations: [
      {
        formula: 'P V = n R T',
        name: "Ideal gas law",
        note: "Four quantities and a constant; Three are given and a fourth is requested.",
      },
      {
        formula: 'P₁V₁ / T₁ = P₂V₂ / T₂',
        name: "The law of both cases",
        note: "for the same amount of gas; Delete evidence from both parties.",
      },
      {
        formula: 'T(K) = T(°C) + 273.15',
        name: "Conversion to absolute",
        note: "A first step that cannot be postponed or skipped.",
      },
      {
        formula: 'P_i = x_i P_total ,  Σ P_i = P_total',
        name: "Dalton's law",
        note: "The mole fraction is unitless, and the partial pressure is unit pressure.",
      },
    ],
    derivation: {
      title: "Why is Kelvin mandatory and Celsius not sufficient?",
      intro: "It is said, “Convert to Kelvin” for no reason, and it is forgotten at the first problem. The reason is simpler than one might think.",
      steps: [
        {
          do: "Take a gas at 27 °C that is heated to 327 °C at constant pressure. "
            + "If you calculated the percentage in Celsius, you would find it to be 327/27 ≈ 12.",
          why: "The ratio is what determines how much the volume is doubled, so its error multiplies the error of the answer twelve times.",
        },
        {
          do: "And in Kelvin : 600.15 / 300.15 ≈ 2.0, that is, the volume is doubled only once.",
          why: "A huge difference between the two answers stems from the choice of the measure alone, not the calculation.",
        },
        {
          do: "The reason is that zero Celsius is a term: it is the freezing point of water, not the absence of heat.",
          why: "The ratio between two measurements is meaningless unless zero is real. "
            + "Otherwise, “twice ten degrees” would equal twenty, which is belied by the analogy.",
        },
        {
          do: "Try the threshold: at 0 °C the ratio becomes a division by zero, and at −10 °C it becomes negative.",
          why: "A negative or infinite volume is physically impossible, and this alone is proof that the scale is not valid for proportions. "
            + "As for Kelvin, its zero is unreachable, so this problem never occurs.",
        },
      ],
    },
  },

  visual: {
    title: "Two measurements of the same temperature, and one correct ratio",
    figure: {
      svg: figure,
      caption: "The temperature itself is read with two scales. The distances between them are equal, "
        + "But the starting point varies, and the percentage depends on the starting point, not the distance.",
      alt: "One horizontal axis with three marks. Above each sign is the reading in Celsius and below it is the reading in Kelvin. "
        + "The first sign is negative two hundred and seventy-three Celsius, which is zero kelvin, and it indicates absolute zero. "
        + "The second is twenty-seven Celsius, which is three hundred kelvins. The third is three hundred and twenty-seven, which is six hundred kelvins. "
        + "Under the drawing are two lines comparing the two ratios: in Celsius, the temperature appears to have multiplied twelve times; "
        + "And in kelvin only once.",
    },
    table: {
      caption: "Gas laws as special cases of a single law",
      head: ["Law", "The constant", "Formula", "Behavior"],
      rows: [
        ["Boyle", "T and n", 'P₁V₁ = P₂V₂', "Pressure and volume are inverse"],
        ["Charles", "P and n", 'V₁/T₁ = V₂/T₂', "Volume and temperature are direct"],
        ["Gay-Lussac", "V and n", 'P₁/T₁ = P₂/T₂', "Pressure and temperature are direct"],
        ["Avogadro", "P and T", 'V₁/n₁ = V₂/n₂', "Volume and moles are direct"],
        ["Community", "n only", 'P₁V₁/T₁ = P₂V₂/T₂', "Includes the first three"],
      ],
    },
    reading: "Do not memorize the first four rows. Save the last row and delete from it what proves your question: "
      + "If the pressure is constant, P is eliminated from both sides, thus Charles's law remains, and if the temperature is constant, Boyle's law remains. "
      + "Every letter in the last row must have an absolute unit if it is heat.",
  },

  guided: {
    start: "Convert the temperature to Kelvin first, even before you read the rest of the question. "
      + "Then ask: Do I have one condition or two? One case is solved by PV = nRT, "
      + "The two cases are P₁V₁/T₁ = P₂V₂/T₂ with the constant deleted from them. "
      + "If you use PV = nRT, choose the value of R first, then convert the pressure and volume to their units.",
    workedExamples: [
      {
        title: "Example 1 · is a volume from the ideal gas law",
        task: "What is the volume 2.00 mol of a gas at 300 K and pressure 1.50 atm? "
          + "Take R = 0.08206 L·atm/(mol·K).",
        steps: [
          {
            do: "The temperature is originally given in Kelvin, so there is no conversion. Pressing atm corresponds to the selected R.",
            why: "Checking the modules before substitution is cheaper than discovering the error after.",
          },
          {
            do: "Sort: V = nRT/P.",
            why: "What is required is in the numerator and the remainder around it; Arranging the equation before substitution reduces calculator errors.",
          },
          {
            do: "Replace : V = (2.00 × 0.08206 × 300) / 1.50 = 49.24 / 1.50 = 32.8 L.",
            why: "The units are abbreviated : mol × L·atm/(mol·K) × K / atm, leaving only L. "
              + "This confirms that the order is correct.",
          },
        ],
        answer: 'V = 32.8 L',
      },
      {
        title: "Example 2 · Two cases with heat conversion",
        task: "A gas with volume 1.00 L at 27 °C is heated to 327 °C at constant pressure. What is its new volume?",
        steps: [
          {
            do: "Convert : 27 °C = 300.15 K and 327 °C = 600.15 K.",
            why: "Always the first step. If Celsius had been left out, the ratio would have been 12 instead of 2, and the answer would be six times wrong.",
          },
          {
            do: "The pressure is constant, so remove it from both ends: V₁/T₁ = V₂/T₂. remains",
            why: "Deleting saves you the pressure value that was not given in the first place and is not needed.",
          },
          {
            do: "Solve: V₂ = V₁ × T₂/T₁ = 1.00 × 600.15/300.15 = 2.00 L.",
            why: "The absolute temperature doubled and the volume doubled. "
              + "The relationship is direct. Heating with constant pressure increases the volume, not decreases it. This is a quick check of the answer.",
          },
        ],
        answer: 'V₂ = 2.00 L',
      },
    ],
    skipped: [
      {
        q: "Why don't we convert the temperature differences into kelvins?",
        a: "Because the difference is the same in the two scales: one degree Celsius is equal to one kelvin in magnitude. "
          + "The height of 10 °C is the height of 10 K. "
          + "The conversion is necessary for the absolute value, not the difference, because the difference is in the starting point, not in the length of the degree.",
      },
      {
        q: "When does the ideal gas model break in practice?",
        a: "At high pressures, the volume of the particles themselves becomes negligible compared to the volume of the container. "
          + "At low temperatures, the forces of attraction become effective and the gas approaches liquefaction. "
          + "In these two terms, a correction such as the van der Waals equation is used, which is outside the scope of this lesson.",
      },
      {
        q: "Is the volume of a mole of oxygen different from a mole of hydrogen under the same conditions?",
        a: "No, ideally. Avogadro's law says that volume depends on the number of moles alone "
          + "It does not depend on the type of gas, because the model neglects the volume of the molecule and its forces. "
          + "In reality, there is a slight difference, which is one of the manifestations of the deviation of real gases from ideal ones.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'to-kelvin',
      family: "The first type: conversion to absolute",
      aim: "273.15 adds, not subtracts.",
      objectives: [0],
      prompt: "Convert 52 °C to Kelvin.",
      unit: 'K',
      answer: 325.15,
      tolerance: 0.3,
      solution: '‎K = 52 + 273.15 = 325.15 K‎.',
      commonErrors: [
        { value: 52, why: "Not converted at all. Celsius is not used in any gas calculation." },
        { value: 221.15, why: "You subtracted 52 from 273.15 instead of adding them. "
          + "The positive temperature in Celsius is higher than the freezing point, so its Kelvin is greater than 273, not smaller." },
        { value: -221.15, why: "You subtract 273.15 from 52, and this is the inverse conversion from Kelvin to Celsius." },
      ],
    },
    {
      id: 'ideal-volume',
      family: "Style II · volume of PV = nRT",
      aim: "Arrange the equation before substitution.",
      objectives: [1],
      prompt: "What is the volume 3.00 mol of an ideal gas at 400 K and pressure 2.00 atm? "
        + "Take R = 0.08206 L·atm/(mol·K).",
      unit: 'L',
      answer: 49.2,
      tolerance: 0.3,
      solution: '‎V = nRT/P = (3.00 × 0.08206 × 400) / 2.00 = 98.47 / 2.00 = 49.2 L‎.',
      commonErrors: [
        { value: 98.5, why: "You forgot to divide by pressure. nRT alone is not volume; Its unit is L·atm." },
        { value: 196.9, why: "You multiplied by the pressure instead of dividing by it. "
          + "Pressure and volume are inverse, so doubling the pressure halves the volume, not doubles it." },
        { value: 16.4, why: "You neglected the number of moles and calculated RT/P alone." },
      ],
    },
    {
      id: 'two-state',
      family: "The third type: Two states with heating",
      aim: "Transform before you divide, and this is where the Kelvin effect appears.",
      objectives: [0],
      prompt: "A gas with volume 2.00 L at 27 °C is heated to 327 °C at constant pressure. "
        + "What is its new volume in litres?",
      unit: 'L',
      answer: 4,
      tolerance: 0.05,
      solution: "Convert : 300.15 K and 600.15 K. "
        + "With constant pressure : V₂ = V₁ × T₂/T₁ = 2.00 × 600.15/300.15 = 4.00 L.",
      commonErrors: [
        { value: 24.2, why: "You divided in Celsius and got a ratio of 327/27 ≈ 12. "
          + "Zero Celsius is a term, not non-existence, as the ratios in it are meaningless; "
          + "The correct ratio in Kelvin is 2.0." },
        { value: 1, why: "You inverted the ratio and divided T₁/T₂. Heating with constant pressure increases the volume, not decreases it." },
        { value: 2, why: "You wrote the original volume without changing it." },
      ],
    },
    {
      id: 'moles-from-pvt',
      family: "Type 4 · Moles of the state",
      aim: "Isolates n and checks the reasonableness of the output.",
      objectives: [1],
      prompt: "How many moles of an ideal gas occupy 11.2 L at 273.15 K and 1.00 atm pressure? "
        + "Take R = 0.08206 L·atm/(mol·K).",
      unit: 'mol',
      answer: 0.5,
      tolerance: 0.01,
      solution: '‎n = PV/RT = (1.00 × 11.2) / (0.08206 × 273.15) = 11.2 / 22.41 = 0.500 mol‎.',
      commonErrors: [
        { value: 2, why: "You flipped the fraction and calculated RT/PV. "
          + "The revealing sign: one mole occupies 22.4 L in these conditions, "
          + "11.2 L must be half a mole, not a mole." },
        { value: 11.2, why: "You wrote the volume. The number of moles in units of mol is required, not L." },
        { value: 22.4, why: "You wrote the standard molar volume instead of calculating it." },
      ],
    },
    {
      id: 'partial-pressure',
      family: "Type 5: Partial pressure",
      aim: "Multiply the mole fraction by the total pressure and do not stop at the fraction.",
      objectives: [2],
      prompt: "A gas mixture containing 0.25 mol from A and 0.75 mol from B, and the total pressure is 4.0 atm. "
        + "What is the partial pressure of A?",
      unit: 'atm',
      answer: 1,
      tolerance: 0.02,
      solution: "molar fraction x_A = 0.25 / 1.00 = 0.25, "
        + "The partial pressure is P_A = 0.25 × 4.0 = 1.0 atm.",
      commonErrors: [
        { value: 0.25, why: "You stopped at mole fraction. A fraction is a unitless number, "
          + "The partial pressure is measured as atm; You lack a hit in total pressure." },
        { value: 3, why: "You calculated the partial pressure for B, not A. "
          + "The largest component has the highest pressure, and A has the lowest here." },
        { value: 4, why: "You wrote down the total pressure. The partial pressure of a single component is always smaller than that of a mixture." },
      ],
    },
  ],
};
