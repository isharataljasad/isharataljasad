/* درس بيت الفؤاد · CHEM 101 · خواص المحاليل. */

/* الرسم: التخفيف. عدد النقاط واحد في الكأسين، والماء وحده زاد.
   والنقاط تمثّل كمية المذاب، لا بلوراتٍ داخل المحلول:
   الملح المذاب يتفكّك إلى أيونات ولا يبقى على هيئة بلورات. */
const figure = `<svg viewBox="0 0 480 270" role="img" aria-labelledby="fig-dil-title" class="bayt-svg">`
  + `<title id="fig-dil-title">Two cups: the first is a concentrated solution and the second is after adding water, and the amount of solute is the same in both</title>`
  /* الكأس الأول: ماء أقل. */
  + `<rect x="62" y="128" width="116" height="80" fill="#cfe6ef"/>`
  + `<path d="M 60 60 L 60 210 L 180 210 L 180 60" fill="none" stroke="#284955" stroke-width="3"/>`
  + `<circle cx="90" cy="150" r="5" fill="#10766f"/><circle cx="122" cy="144" r="5" fill="#10766f"/>`
  + `<circle cx="152" cy="156" r="5" fill="#10766f"/><circle cx="84" cy="176" r="5" fill="#10766f"/>`
  + `<circle cx="116" cy="182" r="5" fill="#10766f"/><circle cx="148" cy="174" r="5" fill="#10766f"/>`
  + `<circle cx="100" cy="199" r="5" fill="#10766f"/><circle cx="140" cy="196" r="5" fill="#10766f"/>`
  /* الكأس الثاني: الماء أعلى، والنقاط نفسها موزّعة على حجم أكبر. */
  + `<rect x="302" y="88" width="116" height="120" fill="#cfe6ef"/>`
  + `<path d="M 300 60 L 300 210 L 420 210 L 420 60" fill="none" stroke="#284955" stroke-width="3"/>`
  + `<circle cx="330" cy="108" r="5" fill="#10766f"/><circle cx="372" cy="118" r="5" fill="#10766f"/>`
  + `<circle cx="400" cy="100" r="5" fill="#10766f"/><circle cx="318" cy="142" r="5" fill="#10766f"/>`
  + `<circle cx="362" cy="152" r="5" fill="#10766f"/><circle cx="402" cy="146" r="5" fill="#10766f"/>`
  + `<circle cx="336" cy="186" r="5" fill="#10766f"/><circle cx="388" cy="192" r="5" fill="#10766f"/>`
  /* سهم الإضافة. */
  + `<line x1="196" y1="135" x2="282" y2="135" stroke="#c69748" stroke-width="3"/>`
  + `<polyline points="272,128 282,135 272,142" fill="none" stroke="#c69748" stroke-width="3"/>`
  + `<text x="282" y="122" font-size="15" fill="#c69748" text-anchor="end">Add water</text>`
  + `<text x="120" y="234" font-size="16" fill="#153748" text-anchor="middle">0.20 M</text>`
  + `<text x="360" y="234" font-size="16" fill="#153748" text-anchor="middle">0.10 M</text>`
  + `<text x="240" y="258" font-size="13" fill="#566f7a" text-anchor="middle">The number of points is the same in both cups; The volume alone doubled</text>`
  + `</svg>`;

export default {
  course: 'chemistry',
  topic: 'solutions',

  objectives: [
    "Molarity is calculated from the mass of the solute and the volume of the solution, first converting the mass to moles.",
    "Use conservation of solute amount to calculate an unknown volume or concentration after dilution.",
    "Choose the appropriate concentration scale, and differentiate between molarity and mass percentage.",
  ],

  boundaries: [
    "Collective properties (boiling point elevation, osmotic pressure) are not covered in this lesson.",
    "Solubility, its curves, and the effect of heat on it are not here.",
    "Non-ideal solutions and volume changes when mixing are outside the scope of the lesson; "
      + "We assume that the volumes are additive.",
    "Calculations of the reaction in solution and the determination factor are the subject of the lesson “Reactions in Solution”.",
  ],

  prerequisites: [
    {
      title: "Convert mass to moles",
      why: "Molarity is defined in moles, not grams, so whoever divides grams by liters gets something else.",
      recap: "The number of moles is n = m / M, where m is the mass in grams and M is the molar mass in g/mol. "
        + "The molar mass is collected from the periodic table : M(NaCl) = 22.99 + 35.45 = 58.44 g/mol. "
        + "Example: 11.69 g from NaCl equals 11.69 / 58.44 = 0.200 mol.",
      href: '/semester-1/chemistry/atomic-structure/',
      hrefLabel: "Atomic mass in the lesson on the structure of the atom",
    },
    {
      title: "Convert milliliters to liters",
      why: "The unit for molarity is mol/L, leaving the volume in milliliters gives a result a thousand times smaller.",
      recap: "1 L = 1000 mL, the conversion is divided by one thousand: 250 mL = 0.250 L. "
        + "The sign of error is quick: a typical laboratory solution concentration falls between 0.01 and 10 mol/L, "
        + "If your output comes out in the hundreds, you probably did not convert the volume.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Solute and solvent",
        en: 'Solute and solvent',
        text: "The solute is the component with the least amount that diffuses into the other, and the solvent the most. "
          + "The solution is their sum. Most of the errors in this lesson are caused by confusing the “mass of the solvent” "
          + "And the “mass of the solution” when calculating the mass percentage.",
      },
      {
        term: "Molarity",
        en: 'Molarity (M)',
        text: "Moles of solute in one liter of **solution**, not of solvent : M = n / V in mol/L. "
          + "For this reason, the solute is dissolved first, then the volume is brought to the mark, and a liter of water is not added to begin with.",
      },
      {
        term: "Mass ratio",
        en: 'Mass percent',
        text: "The mass of the solute divided by the mass of the entire solution, multiplied by one hundred. "
          + "It does not require molar mass or volume, and is useful when the molar mass is unknown "
          + "Or when the solution is a mixture of uncertain composition.",
      },
      {
        term: "Molality",
        en: 'Molality (m)',
        text: "Moles of solute per kilogram of **solvent**. "
          + "It differs from molarity in the denominator: this is attributed to the solvent by mass, and that to the solution by volume. "
          + "Molality is preferred when temperature changes, because mass does not expand while volume does.",
      },
      {
        term: "Dilution",
        en: 'Dilution',
        text: "Adding a solvent to a solution. The amount of solute does not change at all, the volume increases, but the concentration decreases. "
          + "This is the content of the relationship C₁V₁ = C₂V₂.",
      },
    ],
    relations: [
      {
        formula: 'M = n / V   (mol / L of solution)',
        name: "Molarity",
        note: "Volume The volume of the final solution, not the volume of solvent added.",
      },
      {
        formula: 'n = m / M_molar',
        name: "Moles of mass",
        note: "An unmissable step: Molarity does not accept fines directly.",
      },
      {
        formula: 'C₁V₁ = C₂V₂',
        name: "Dilution",
        note: "The two sides represent moles of the same solute before and after addition.",
      },
      {
        formula: 'mass % = (mass solute / mass solution) × 100',
        name: "Mass ratio",
        note: "The denominator is the mass of the solution: the solute and solvent combined.",
      },
    ],
    derivation: {
      title: "Where did C₁V₁ = C₂V₂ come from and why is it not suitable for mixing",
      intro: "This relationship is often memorized and used out of place. If you saw where it came from, you would know when it breaks.",
      steps: [
        {
          do: "Write the moles of solute before dilution: n₁ = C₁ × V₁.",
          why: "This is just a reversal of the definition of molarity C = n/V, not a new law.",
        },
        {
          do: "Note that adding water does not add or subtract solute, so n₂ = n₁.",
          why: "That's the whole idea: what is preserved is the amount of solute, not the concentration or the volume. "
            + "The concentration decreases because the numerator is fixed and the denominator is increased.",
        },
        {
          do: "Write the moles after dilution as n₂ = C₂ × V₂ and equate the two expressions as : C₁V₁ = C₂V₂.",
          why: "Equality is not between the two concentrations nor between the two sizes, but rather between the two products. "
            + "Because each of them equals the same number of moles.",
        },
        {
          do: "This is why it breaks when two solutions containing a solute are mixed: then n = n₁ + n₂.",
          why: "Derivation Assume that the additive is free of solute. If there is solute in it, the moles must be added "
            + "Then divide by the total volume, and this is component balancing, not dilution.",
        },
      ],
    },
  },

  visual: {
    title: "Dilution: The solute is constant and the volume increases",
    figure: {
      svg: figure,
      caption: "Two cups: the number of drops is the same, and the water alone is more. "
        + "The dots represent the amount of solute; The dissolved salt does not exist in the form of crystals inside the solution, but rather disintegrates into ions.",
      alt: "Two cups side by side of equal volume. In the first, water fills the lower part, and there are eight green dots in it "
        + "Close together, and below it is written its concentration. Between them is an arrow indicating the addition of water. "
        + "In the second, the water is much higher, and it also has eight points, but they are far apart, and below it there is an equal concentration "
        + "First half. The number of points did not change, but the space in which they were distributed expanded.",
    },
    table: {
      caption: "Three measures of concentration: what is the numerator and what is the denominator",
      head: ["Scale", "numerator", "The place", "Affected by heat?", "When do you choose it?"],
      rows: [
        ["Molarity M", "Moles of solute", "liter of solution", "Yes, because volume expands", "Reactions in solution"],
        ["Mass ratio", "mass of solute", "Mass of solution", "No", "When you don't know the molar mass"],
        ["Molality m", "Moles of solute", "kilogram of solvent", "No", "Collective properties"],
      ],
    },
    reading: "Read the Maqam column alone: it is the site of most errors. "
      + "Molarity is attributed to **solution** and molality to **solvent**, "
      + "And the mass ratio to **solution** as well. "
      + "Whoever divides by the mass of the solvent by the mass ratio always obtains a number greater than the correct one.",
  },

  guided: {
    start: "Ask yourself two questions before any calculation: What have I been given, masses or moles? What position is required? "
      + "Volume of solution or mass of solvent? The answer to them determines the equation alone. "
      + "In dilution issues, always start with the question: Is the additive free of solute? "
      + "If there is a solute in it, the issue is balancing the component, not diluting it.",
    workedExamples: [
      {
        title: "Example 1 · Prepare a solution with a known concentration",
        task: "What mass of NaCl is needed to prepare 250 mL from a solution of 0.100 M? "
          + "Molar mass 58.44 g/mol.",
        steps: [
          {
            do: "Convert volume: 250 mL = 0.250 L.",
            why: "Molarity is in mol/L, so the volume must be in liters before any multiplication.",
          },
          {
            do: "Calculate the moles : n = C × V = 0.100 × 0.250 = 0.0250 mol.",
            why: "Inverting the definition of molarity gives moles of concentration and volume directly.",
          },
          {
            do: "Convert to mass: m = n × M = 0.0250 × 58.44 = 1.46 g.",
            why: "The scale weighs grams, not moles, so the last step is translation into what can be measured practically.",
          },
        ],
        answer: '1.46 g',
      },
      {
        title: "Example 2 · Dilution of a concentrated solution",
        task: "To what volume do we dilute 25.0 mL from 2.00 M solution so that its concentration becomes 0.500 M?",
        steps: [
          {
            do: "Check the condition: The additive is water with no solute, so the relationship C₁V₁ = C₂V₂ is valid.",
            why: "The derivation is based on the constant moles; If the additive contained a solute, this condition would be invalid.",
          },
          {
            do: "Replace : 2.00 × 25.0 = 0.500 × V₂.",
            why: "The units here are mL on both sides, and there is no need to convert as long as they are identical. "
              + "Because it is deleted from both sides.",
          },
          {
            do: "Solve: V₂ = 50.0 / 0.500 = 100 mL.",
            why: "The product is larger than the original volume. Here's a quick check: dilution always increases volume.",
          },
          {
            do: "Water added 100 − 25 = 75 mL, not 100 mL.",
            why: "The question may ask for the final volume or the volume of water added, which are different. "
              + "Read the requirements carefully before you write.",
          },
        ],
        answer: 'V₂ = 100 mL (water added = 75 mL)',
      },
    ],
    skipped: [
      {
        q: "Why do we supplement the volume to the mark and not add a liter of water?",
        a: "Because molarity is attributed to the volume of the **solution**, not the solvent. "
          + "Dissolving the solute changes the volume slightly. If you added a full liter of water, it would be the final volume "
          + "Greater than a liter, the concentration is less than required. "
          + "This is why volumetric flasks are made with a single mark at the neck.",
      },
      {
        q: "Does the concentration change if I take half the solution?",
        a: "No. Concentration is an intensive property: a ratio, not a quantity. "
          + "Half the solution contains half the moles in half the volume, and the ratio is the same. "
          + "This distinguishes it from the number of moles, which is actually the middle.",
      },
      {
        q: "Why mention molality at all if molarity is easier?",
        a: "Because volume expands with heat, but mass does not expand. "
          + "A solution whose molarity is 1.00 M at 20 °C decreases in molarity at 80 °C without anything coming out of it. "
          + "As for molality, it remains the same, which is why it is used in colligative properties that are measured over a temperature range.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'molarity-from-mass',
      family: "Type I · Molarity of mass",
      aim: "Convert mass to moles before dividing by volume.",
      objectives: [0],
      prompt: "5.85 g was dissolved from NaCl and sized to 0.500 L. "
        + "What is the molarity of the solution? Molar mass 58.44 g/mol.",
      unit: 'mol/L',
      answer: 0.2,
      tolerance: 0.005,
      solution: "n = 5.85 / 58.44 = 0.100 mol, then M = 0.100 / 0.500 = 0.200 mol/L.",
      commonErrors: [
        { value: 11.7, why: "You divided the fines directly by liters. molarity moles per liter, "
          + "It is necessary to divide by the molar mass first; Your output unit is g/L not mol/L." },
        { value: 0.1, why: "You stopped at the number of moles and did not divide by the volume.. 0.100 is n, not M." },
        { value: 0.05, why: "You multiplied by the volume instead of dividing by it." },
      ],
    },
    {
      id: 'dilution-concentration',
      family: "Type 2 · Concentration after dilution",
      aim: "Apply solute conservation in the correct direction.",
      objectives: [1],
      prompt: "25.0 mL was diluted from 2.00 M solution to a final volume of 100.0 mL. "
        + "What is the final concentration?",
      unit: 'mol/L',
      answer: 0.5,
      tolerance: 0.005,
      solution: '‎C₂ = C₁V₁ / V₂ = (2.00 × 25.0) / 100.0 = 0.500 mol/L‎. '
        + "The volume has become four times its volume and the concentration has become a quarter.",
      commonErrors: [
        { value: 8, why: "You inverted the ratio and calculated C₁V₂/V₁. Dilution always decreases concentration. "
          + "Any result greater than 2.00 is an error without needing to review the calculation." },
        { value: 2, why: "You wrote the original concentration. Adding water does not leave the concentration the same; "
          + "The constant is the number of moles, not the concentration." },
        { value: 0.02, why: "You omitted a conversion or over-divided 1000. "
          + "The units mL at both ends are deleted, and there is no need to convert at all." },
      ],
    },
    {
      id: 'moles-in-volume',
      family: "The third type: moles in a known volume",
      aim: "Convert milliliters to liters before multiplying.",
      objectives: [0],
      prompt: "How many moles of solute are in 250 mL than 0.400 M solution?",
      unit: 'mol',
      answer: 0.1,
      tolerance: 0.002,
      solution: "250 mL = 0.250 L, n = 0.400 × 0.250 = 0.100 mol.",
      commonErrors: [
        { value: 100, why: "You multiplied by 250 without converting to litres. "
          + "One hundred moles in a small cup is an unreasonable value, and this is a sufficient mark to review the unit." },
        { value: 1.6, why: "You divided the concentration on volume. Moles are a product, not a division, : n = C × V." },
        { value: 0.625, why: "You divide the volume by the concentration." },
      ],
    },
    {
      id: 'mass-percent',
      family: "Type IV: Mass ratio",
      aim: "Divide by the mass of the solution, not the mass of the solvent.",
      objectives: [2],
      prompt: "20.0 g of a substance is dissolved in 180.0 g of water. "
        + "What is the mass percentage of solute? Write the number without the ratio sign.",
      unit: '%',
      answer: 10,
      tolerance: 0.05,
      solution: "Solution mass 20.0 + 180.0 = 200.0 g, "
        + "The ratio is (20.0 / 200.0) × 100 = 10.0%.",
      commonErrors: [
        { value: 11.1, why: "You divided by the mass of the solvent 180.0 g, not by the mass of the solution 200.0 g. "
          + "The solution is both solute and solvent, and this is the most common error of this pattern." },
        { value: 20, why: "You write the mass of the solute in grams rather than percentages." },
        { value: 9, why: "You divided by 220, meaning you counted the solute twice in the denominator." },
      ],
    },
    {
      id: 'stock-volume',
      family: "Fifth type: Volume of concentrated solution",
      aim: "A solution to the unknown on the other side of the relationship.",
      objectives: [1],
      prompt: "How many milliliters of 6.00 M solution are needed to prepare 500.0 mL from 0.300 M solution?",
      unit: 'mL',
      answer: 25,
      tolerance: 0.2,
      solution: '‎V₁ = C₂V₂ / C₁ = (0.300 × 500.0) / 6.00 = 150 / 6.00 = 25.0 mL‎. '
        + "The volume is then supplemented with water to 500.0 mL.",
      commonErrors: [
        { value: 10000, why: "You inverted the ratio and calculated C₁V₂/C₂. "
          + "A concentrated solution always requires a volume smaller than the final volume. "
          + "An output greater than 500 is a clear error." },
        { value: 475, why: "You calculated the volume of water added, not the volume of the concentrated solution. "
          + "The required V₁, and the water added is 500 − 25 = 475 mL." },
        { value: 150, why: "You stopped at the product C₂V₂ = 150 and did not divide it by C₁." },
      ],
    },
  ],
};
