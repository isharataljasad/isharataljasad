/* درس بيت الفؤاد · CHEM 101 · الكيمياء الحرارية. */

/* الرسم: مخطط مستويات الطاقة للحالتين.
   الإشارة ليست اصطلاحًا يُحفظ بل اتجاه سهم يُرى: نزولٌ فسالب، صعودٌ فموجب. */
const figure = `<svg viewBox="0 0 480 240" role="img" aria-labelledby="fig-thermo-title" class="bayt-svg">`
  + `<title id="fig-thermo-title">Two side-by-side energy diagrams: an exothermic reaction with lower products and an endothermic reaction with higher products</title>`
  + `<line x1="30" y1="40" x2="30" y2="190" stroke="#284955" stroke-width="2"/>`
  + `<text x="46" y="32" font-size="13" fill="#284955" text-anchor="start">Energy</text>`
  /* طارد للحرارة: النواتج أدنى من المتفاعلات. */
  + `<line x1="60" y1="70" x2="125" y2="70" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="135" y1="170" x2="200" y2="170" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="130" y1="72" x2="130" y2="164" stroke="#c0392b" stroke-width="2"/>`
  + `<polyline points="124,154 130,166 136,154" fill="none" stroke="#c0392b" stroke-width="2"/>`
  + `<text x="92" y="60" font-size="13" fill="#284955" text-anchor="middle">Reactants</text>`
  + `<text x="167" y="162" font-size="13" fill="#284955" text-anchor="middle">Outputs</text>`
  + `<text x="136" y="120" font-size="14" fill="#c0392b" text-anchor="end">ΔH &lt; 0</text>`
  + `<text x="130" y="212" font-size="14" fill="#153748" text-anchor="middle">Exothermic</text>`
  /* ماص للحرارة: النواتج أعلى. */
  + `<line x1="280" y1="170" x2="345" y2="170" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="355" y1="70" x2="420" y2="70" stroke="#105c78" stroke-width="3"/>`
  + `<line x1="350" y1="168" x2="350" y2="76" stroke="#10766f" stroke-width="2"/>`
  + `<polyline points="344,86 350,74 356,86" fill="none" stroke="#10766f" stroke-width="2"/>`
  + `<text x="312" y="190" font-size="13" fill="#284955" text-anchor="middle">Reactants</text>`
  + `<text x="387" y="60" font-size="13" fill="#284955" text-anchor="middle">Outputs</text>`
  + `<text x="356" y="120" font-size="14" fill="#10766f" text-anchor="end">ΔH &gt; 0</text>`
  + `<text x="350" y="212" font-size="14" fill="#153748" text-anchor="middle">Endothermic</text>`
  + `</svg>`;

export default {
  course: 'chemistry',
  topic: 'thermochemistry',

  objectives: [
    "It defines the system and its surroundings, and applies sign conventions from the perspective of the system.",
    "The heat transferred from q = m c ΔT is calculated with an ordered temperature difference.",
    "Heat contents are summed by Hess's law while preserving the signs.",
  ],

  boundaries: [
    "Entropy, Gibbs free energy, and reaction spontaneity are not covered in this lesson.",
    "The change in specific heat capacity with temperature is neglected here.",
    "When the volume is constant, the price, (q_v), is given a sign; And our calculations when the pressure is constant.",
    "Bond energies and calculating ΔH of them are beyond the scope of this lesson.",
  ],

  prerequisites: [
    {
      title: "Malls calculation",
      why: "Enthalpy is often given per mole, as the relationship between mass and heat goes through moles.",
      recap: "n = m / M. If ΔH = −890 kJ/mol for methane combustion, "
        + "Burning 0.50 mol releases 445 kJ. "
        + "Pay attention to “per mole”: it is part of the unit, not an addition to the phrase.",
      href: '/semester-1/chemistry/solutions/',
      hrefLabel: "Convert mass to moles",
    },
    {
      title: "Order of subtraction in temperature difference",
      why: "The sign ΔT determines the sign q, so reversing the subtraction changes the meaning of the entire result.",
      recap: "ΔT = T_final − T_initial, always final first. "
        + "An increase from 20 °C to 35 °C gives ΔT = +15, and a decrease from 35 to 20 gives −15. "
        + "Note that the temperature difference is the same in Celsius and Kelvin, so there is no need for conversion here.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "System and surroundings",
        en: 'System and surroundings',
        text: "The system is the part selected for study; the surroundings are everything outside it. In a reaction calorimetry model, one may choose the reacting chemicals as the system and the water and vessel as surroundings. Always state this choice before assigning heat signs.",
      },
      {
        term: "Heat",
        en: 'Heat (q)',
        text: "Energy transferred due to a temperature difference, in joules. "
          + "It is not a property that the body possesses, but rather a transfer that occurs; "
          + "It is not said “the heat of the body” in the sense of what it contains, but rather the heat transferred to or from it.",
      },
      {
        term: "Exothermic reaction",
        en: 'Exothermic',
        text: "An exothermic process transfers heat from the chosen system to its surroundings. At constant pressure under the usual calorimetry assumptions, ΔH<0. The surroundings may warm while the system loses energy.",
      },
      {
        term: "Endothermic reaction",
        en: 'Endothermic',
        text: "An endothermic process absorbs heat into the chosen system from its surroundings. At constant pressure under the usual calorimetry assumptions, ΔH>0. The surroundings may cool, for example during some salt-dissolution processes.",
      },
      {
        term: "Enthalpy",
        en: 'Enthalpy change (ΔH)',
        text: "Enthalpy H=U+pV is a state function. Its change equals heat transferred at constant pressure when only pressure–volume work occurs. Because ΔH depends on the initial and final states, reaction enthalpies can be combined using Hess’s law.",
      },
      {
        term: "Specific heat capacity",
        en: 'Specific heat capacity (c)',
        text: "Specific heat capacity relates heat to mass and temperature change: q=mcΔT when c is approximately constant and there is no phase change. Water has c≈4.18 J/(g·°C), so substantial heat can produce a comparatively small temperature change.",
      },
    ],
    relations: [
      {
        formula: 'q = m c ΔT',
        name: "Transferred heat",
        note: "Usually suitable for the environment (water), not the system directly.",
      },
      {
        formula: 'ΔT = T_final − T_initial',
        name: "Temperature difference",
        note: "final first; The order determines the sign.",
      },
      {
        formula: 'q_system = − q_surroundings',
        name: "Heat exchange",
        note: "What one loses, the other gains; Hence the negative sign.",
      },
      {
        formula: 'ΔH_total = Σ ΔH_steps',
        name: "Hess's law",
        note: "Gather with its sign; If a step is reversed, its sign is reversed.",
      },
    ],
    derivation: {
      title: "Why is ΔH negative in the reaction that heats water?",
      intro: "It seems contradictory: the temperature has risen and the sign is negative. The contradiction disappears once we determine who the regime is.",
      steps: [
        {
          do: "Identify the system: it is the reactants, not water or the beaker.",
          why: "Water is a measuring instrument, not a subject of study. Every sign is read from the perspective of the system alone.",
        },
        {
          do: "The reaction released energy from it into the water, so the system **lost** energy.",
          why: "Loss is a decrease, and the decrease is written with a negative sign; The sign describes direction, not quantity.",
        },
        {
          do: "Write : q_system = −q_water., if the water absorbed by +2000 J is q_system = −2000 J.",
          why: "Energy cannot be destroyed: what the water gains is exactly what the reaction loses, and the two signs are opposite.",
        },
        {
          do: "The increase in water temperature is evidence that ΔH is negative, not positive.",
          why: "This is where the common mistake lies: water is viewed and its condition is attributed to the system. "
            + "The practical rule: heat the surroundings, the reaction is repulsive and its sign is negative.",
        },
      ],
    },
  },

  visual: {
    title: "Heat-transfer direction determines the sign",
    figure: {
      svg: figure,
      caption: "In an exotherm, energy drops from the reactants to the products, so ΔH is negative. "
        + "In the absorber, it rises and is positive. The sign describes the direction of the arrow, not the amount of heat.",
      alt: "Two diagrams side by side, and the vertical axis on the left indicates energy. "
        + "On the left, the line of reactants is higher and the line of products is lower, with a red arrow pointing down between them. "
        + "Underneath it is described as exothermic and its heat content is negative. "
        + "On the right, the line of reactants is lower and the line of products is higher, and between them is a green arrow pointing upward. "
        + "Underneath it is described as endothermic and its heat content is positive.",
    },
    table: {
      caption: "From observation to reference",
      head: ["What you notice", "The state of the surroundings", "System status", "ΔH sign", "Type"],
      rows: [
        ["The cup is hot", "Gain heat", "He lost energy", "Negative", "Repellent"],
        ["The cup got cold", "He lost heat", "Gain energy", "Positive", "Absorbent"],
        ["dissolution salt cools the water", "He lost heat", "Gain energy", "Positive", "Absorbent"],
        ["Combustion heats the air", "Gain heat", "He lost energy", "Negative", "Repellent"],
      ],
    },
    reading: "Read the second and third columns together: they are always opposites, that is q_sys = −q_surr. "
      + "Notice that the first column is what you see, and the fourth is what you write, and there is one step between them: "
      + "Ask what happened to the system, not what happened to the cup.",
  },

  guided: {
    start: "First write: “The system is…”. Then calculate q for water as q = mcΔT with ΔT arranged as final and then as initial. "
      + "Then invert the sign to get q for the system. "
      + "If ΔH is required per mole, divide by the number of moles reacting in the experiment. "
      + "In Hessian problems: arrange the equations so that the intermediates are eliminated, and invert the sign of each equation you reverse.",
    workedExamples: [
      {
        title: "Example 1 · The temperature of heating water",
        task: "How much heat is needed to raise the temperature of 250 g of water from 20.0 °C to 45.0 °C? "
          + "Take c = 4.18 J/(g·°C).",
        steps: [
          {
            do: "Calculate ΔT = 45.0 − 20.0 = 25.0 °C.",
            why: "The difference is not the final value. If you substituted 45.0, you would calculate heating from absolute zero Celsius, and this does not make sense.",
          },
          {
            do: "Replace : q = 250 × 4.18 × 25.0.",
            why: "The units are abbreviated : g × J/(g·°C) × °C, leaving only the joule.",
          },
          {
            do: "The output is 26125 J ≈ 26.1 kJ, and its sign is positive because water has been gained.",
            why: "Water here is what we are studying, so the gain is positive. "
              + "If the water were surrounding, it would react, and we would invert the sign when moving to the system.",
          },
        ],
        answer: 'q = 26125 J ≈ 26.1 kJ',
      },
      {
        title: "Example 2 · from calorimeter measurement to reaction sign",
        task: "A reaction was carried out in 100.0 g of water and its temperature increased 5.00 °C. "
          + "What does q interact with? Take c = 4.18 J/(g·°C).",
        steps: [
          {
            do: "The system is the interaction, and the surroundings is the water.",
            why: "Identifying the system first is what prevents sign error later.",
          },
          {
            do: "Calculate the temperature of the water: q_water = 100.0 × 4.18 × 5.00 = +2090 J.",
            why: "Positive because the water gained heat and its temperature rose.",
          },
          {
            do: "Invert the sign to the system : q_reaction = −2090 J.",
            why: "What the water gained is what the reaction lost. "
              + "The reaction is exothermic, although what you observed was a rise in temperature.",
          },
        ],
        answer: 'q_reaction = −2090 J (exothermic)',
      },
    ],
    skipped: [
      {
        q: "Why don't we convert the temperature to Kelvin here as we did for gases?",
        a: "Because q = mcΔT uses a **difference** not an absolute value. "
          + "The degree length is the same in Celsius and Kelvin, so the difference is the same in them. "
          + "Gas laws use ratios between absolute values, and the ratio changes with the change of the zero point.",
      },
      {
        q: "How can ΔH be a state function even though the temperature depends on the path?",
        a: "The temperature in general really depends on the track. But **when the pressure is constant** the heat transferred is equal "
          + "The change in enthalpy, which is a function of state. "
          + "The constraint “pressure constant” is what makes ΔH independent of the path, and thus Hess’s law holds true.",
      },
      {
        q: "Is an exothermic reaction always spontaneous?",
        a: "No. Many extruders are automatic, but the decisive factor is not the ΔH alone, but the Gibbs free energy. "
          + "It combines enthalpy with entropy and heat. "
          + "The dissolution of some salts is endothermic and occurs spontaneously. Detailing that is beyond the scope of this lesson.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'heat-water',
      family: "Mode 1 · Heat from mcΔT",
      aim: "The difference is used, not the final value.",
      objectives: [1],
      prompt: "How many joules would it take to raise the temperature of 200.0 g of water from 25.0 °C to 75.0 °C? "
        + "Take c = 4.18 J/(g·°C).",
      unit: 'J',
      answer: 41800,
      tolerance: 50,
      solution: "ΔT = 75.0 − 25.0 = 50.0 °C, q = 200.0 × 4.18 × 50.0 = 41800 J.",
      commonErrors: [
        { value: 62700, why: "You used the final temperature 75.0 instead of the difference. "
          + "The law takes ΔT, and substituting the final value means heating from zero Celsius, which is not what is desired." },
        { value: 20900, why: "You used the initial temperature 25.0 instead of the difference." },
        { value: 836, why: "You neglected ΔT and counted m c alone." },
      ],
    },
    {
      id: 'sign-convention',
      family: "Type 2 · Enthalpy sign",
      aim: "The sign is read from the perspective of the system, not the environment.",
      objectives: [0],
      prompt: "Reaction releases 50.0 kJ per mole. What is ΔH and kJ/mol module? Write the number with a sign.",
      unit: 'kJ/mol',
      answer: -50,
      tolerance: 0.2,
      solution: "Release means the system has lost power, so the sign is negative : ΔH = −50.0 kJ/mol.",
      commonErrors: [
        { value: 50, why: "You ignored the sign. The exothermic reaction ΔH is negative because the system has lost energy, "
          + "Even if the temperature of the water around it rises; Water is part of the surroundings, not a system." },
        { value: -50000, why: "You converted to joules even though the question specified kJ/mol. "
          + "The sign is correct and the unit is incorrect." },
        { value: 0, why: "Enthalpy does not exist in a reaction that releases energy; "
          + "Its absence means that there is no difference in energy between the reactants and products." },
      ],
    },
    {
      id: 'delta-t',
      family: "The third type is the arrangement of temperature differences",
      aim: "Subtract the final minus the primary in this order.",
      objectives: [1],
      prompt: "The temperature of solution decreased from 24.0 °C to 18.5 °C. What does ΔT indicate?",
      unit: '°C',
      answer: -5.5,
      tolerance: 0.05,
      solution: '‎ΔT = T_final − T_initial = 18.5 − 24.0 = −5.5 °C‎. '
        + "A negative sign means that the solution has lost heat, so the process is absorbent from the perspective of what is dissolved in it.",
      commonErrors: [
        { value: 5.5, why: "You reversed the subtraction and calculated the initial minus the final. "
          + "The agreed upon order is final first, which makes the sign indicate the direction." },
        { value: 42.5, why: "You collected the two temperatures. The difference is subtraction, not addition." },
        { value: 18.5, why: "You wrote the final temperature instead of the difference." },
      ],
    },
    {
      id: 'hess',
      family: "The fourth type is summation by Hess's law",
      aim: "It is combined using signs and not abstract quantities.",
      objectives: [2],
      prompt: "A reaction that takes place in two steps: the first is ΔH₁ = −200 kJ and the second is ΔH₂ = +80 kJ. "
        + "What is the total ΔH with kJ unit? Write the number with a sign.",
      unit: 'kJ',
      answer: -120,
      tolerance: 0.5,
      solution: '‎ΔH = ΔH₁ + ΔH₂ = −200 + 80 = −120 kJ‎. '
        + "The heat content is a state function, so the sum of the steps is the total change, regardless of the path.",
      commonErrors: [
        { value: 280, why: "You added the two expressions, ignoring the signs. "
          + "The first step releases and the second absorbs, they are partly opposed and not cumulative." },
        { value: -280, why: "You also made the second step negative. Its sign is positive as given." },
        { value: 120, why: "You got the amount right and you missed the sign. "
          + "The repulsive is greater than the absorber here, so the resultant is repulsive and its sign is negative." },
      ],
    },
    {
      id: 'specific-heat',
      family: "Fifth type: Finding the specific capacity",
      aim: "c is isolated in the right denominator.",
      objectives: [1],
      prompt: "A sample with mass 50.0 g absorbed an amount of 500 J and its temperature increased 4.80 °C. "
        + "What is its specific heat capacity?",
      unit: 'J/(g·°C)',
      answer: 2.083,
      tolerance: 0.02,
      solution: '‎c = q / (m ΔT) = 500 / (50.0 × 4.80) = 500 / 240 = 2.08 J/(g·°C)‎.',
      commonErrors: [
        { value: 240, why: "You calculated m ΔT and did not divide q by it." },
        { value: 0.48, why: "You flipped the fraction and calculated m ΔT / q." },
        { value: 10, why: "You divided by the mass alone and neglected ΔT." },
      ],
    },
  ],
};
