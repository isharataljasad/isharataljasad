import { svg, line, text, vector } from '../svg.mjs';

// Enthalpy diagrams: exothermic (products lower) and endothermic (products higher).
const level = (x, y, lab, below = false) => line(x, y, x + 110, y, { width: 3 }) + text(x + 55, below ? y + 20 : y - 8, lab, { anchor: 'middle', size: 14 });
const fig = svg('chem-enthalpy', { w: 500, h: 270, title: 'Enthalpy diagrams for exothermic and endothermic reactions', desc: 'Left, exothermic: the reactants CH₄ + 2O₂ are at a higher enthalpy than the products CO₂ + 2H₂O; a downward arrow shows ΔH = −890 kJ, heat released to the surroundings. Right, endothermic: the reactant CaCO₃ is lower than the products CaO + CO₂; an upward arrow shows ΔH = +178 kJ, heat absorbed from the surroundings.' },
  text(20, 24, 'H', { italic: true, size: 16 }) + vector(28, 250, 28, 34, 'ink', 1.5)
  + level(50, 60, 'CH₄ + 2O₂') + level(50, 215, 'CO₂ + 2H₂O(l)', true) + vector(105, 64, 105, 211, 'c', 2.5) + text(115, 145, 'ΔH = −890 kJ', { size: 14, color: '#b3412e' })
  + text(105, 264, 'exothermic: heat released', { anchor: 'middle', size: 13, color: '#5e7376' })
  + level(300, 170, 'CaCO₃', true) + level(300, 90, 'CaO + CO₂') + vector(355, 166, 355, 96, 'a', 2.5) + text(365, 136, 'ΔH = +178 kJ', { size: 14, color: '#176e66' })
  + text(355, 264, 'endothermic: heat absorbed', { anchor: 'middle', size: 13, color: '#5e7376' }));

export default {
  summary: 'Reactions release or absorb heat. Measure heat with q = mcΔT (calorimetry); express reaction heats as ΔH; combine them with Hess’s law, enthalpies of formation or bond enthalpies.',
  why: [
    'Energy balances are at the heart of chemical engineering: sizing heat exchangers, controlling reactor temperature so that an exothermic reaction does not run away, comparing fuels, and estimating energy costs. Thermochemistry gives the numbers and the sign conventions those balances need.',
  ],
  idea: [
    'Separate the universe into the **system** (the reaction or substance you study) and the **surroundings** (everything else). Energy flows between them as **heat** q or **work** w. The first law of thermodynamics — conservation of energy — says ΔU = q + w, where U is the internal energy. Chemistry sign convention: q > 0 when heat flows **into** the system, w > 0 when work is done **on** the system.',
    'Most reactions happen at constant pressure (open to the atmosphere). Then the heat exchanged equals the change in **enthalpy**, q_{p} = ΔH. An **exothermic** reaction releases heat, ΔH < 0 (the surroundings get warmer); an **endothermic** reaction absorbs heat, ΔH > 0 (the surroundings get colder).',
    '**Temperature** is not the same as **heat**. Heat is energy transferred; temperature measures how hot something is. The heat needed to change a temperature is q = mcΔT, where c is the specific heat capacity (water: 4.184 J/(g·°C), unusually high). A **calorimeter** measures reaction heats: the heat released by the reaction is absorbed by the water (and the calorimeter), so q_{reaction} = −q_{water}.',
    'Enthalpy is a **state function**: ΔH depends only on the starting and final states, not the route. That gives **Hess’s law**: if a reaction is the sum of steps, its ΔH is the sum of their ΔH values. Reversing a reaction changes the sign of ΔH; multiplying its coefficients multiplies ΔH. A thermochemical equation’s ΔH refers to the amounts written.',
    'Tabulated **standard enthalpies of formation** ΔH_{f}° (forming 1 mol of compound from its elements in their standard states; zero for an element in its standard state) let you compute any reaction: ΔH°_{rxn} = ΣnΔH_{f}°(products) − ΣnΔH_{f}°(reactants). Average **bond enthalpies** give quick estimates: breaking bonds costs energy, forming bonds releases it.',
  ],
  background: [
    { title: 'Moles and stoichiometry', text: 'ΔH is per mole of reaction “as written”. If 2 mol of a reactant appears in the equation, burning 1 mol releases half the stated heat.' },
    { title: 'Units', text: '1 kJ = 1000 J. A temperature change of 1 °C equals a change of 1 K, so ΔT is the same in both units.' },
  ],
  definitions: [
    ['System and surroundings', 'The part being studied, and everything else that can exchange energy with it.'],
    ['Heat q and work w', 'Energy transferred because of a temperature difference (q) or by a force acting through a distance, e.g. expansion (w). Signs: positive into the system.'],
    ['Enthalpy change ΔH', 'The heat exchanged at constant pressure (with only expansion work). ΔH < 0 exothermic; ΔH > 0 endothermic.'],
    ['Specific heat capacity c', 'Heat needed to raise 1 g of a substance by 1 °C; J/(g·°C).'],
    ['Standard enthalpy of formation ΔH_{f}°', 'ΔH for forming 1 mol of a compound from its elements in their standard states at 1 bar (usually 25 °C). Zero for elements in their standard states (O₂(g), C(graphite), …).'],
    ['Bond enthalpy', 'Average enthalpy needed to break 1 mol of a given bond in the gas phase.'],
  ],
  symbols: [
    ['q', 'heat', 'J or kJ'], ['w', 'work', 'J'], ['ΔU, ΔH', 'internal energy change, enthalpy change', 'kJ (or kJ/mol)'], ['m', 'mass', 'g'],
    ['c', 'specific heat capacity', 'J/(g·°C)'], ['C_{cal}', 'heat capacity of a calorimeter', 'J/°C'], ['ΔT', 'T_{final} − T_{initial}', '°C or K'],
  ],
  formulas: [
    { name: 'First law', f: 'ΔU = q + w;   w = −P_{ext}ΔV', when: 'Chemistry convention (positive into the system). w = −PΔV for expansion against constant external pressure.' },
    { name: 'Heat and temperature', f: 'q = mcΔT', when: 'No phase change within the temperature range; c approximately constant.' },
    { name: 'Calorimetry', f: 'q_{reaction} = −(m_{water}c_{water}ΔT + C_{cal}ΔT)', when: 'Insulated calorimeter, no heat lost. Omit C_cal if the calorimeter’s own heat capacity is negligible.' },
    { name: 'Hess’s law', f: 'ΔH_{overall} = ΣΔH_{steps};   reverse: −ΔH;   × k: kΔH', when: 'Always (enthalpy is a state function). States (s, l, g, aq) must match.' },
    { name: 'From formation enthalpies', f: 'ΔH°_{rxn} = ΣnΔH_{f}°(products) − ΣnΔH_{f}°(reactants)', when: 'Standard conditions; n = coefficients; use the correct physical states (H₂O(l) and H₂O(g) differ by 44 kJ/mol).' },
    { name: 'From bond enthalpies (estimate)', f: 'ΔH ≈ Σ(bonds broken) − Σ(bonds formed)', when: 'Gas-phase estimate using average values; accurate to perhaps 10–20 kJ/mol per bond.' },
  ],
  derivation: {
    title: 'Hess’s law with two steps',
    intro: 'Step 1: C(s) + ½O₂(g) → CO(g), ΔH₁ = −110.5 kJ. Step 2: CO(g) + ½O₂(g) → CO₂(g), ΔH₂ = −283.0 kJ.',
    steps: [
      ['Add the equations: C(s) + O₂(g) + CO(g) → CO(g) + CO₂(g).', 'Add left sides and right sides.'],
      ['Cancel CO, which appears on both sides: C(s) + O₂(g) → CO₂(g).', 'CO is an intermediate.'],
      ['ΔH = −110.5 + (−283.0) = −393.5 kJ.', 'Add the enthalpy changes.'],
    ],
    end: 'This is ΔH_f° of CO₂. The heat of forming CO directly is hard to measure (some CO₂ always forms), but Hess’s law gives it from the other two.',
  },
  figure: { svg: fig, caption: 'In an exothermic reaction the products have lower enthalpy than the reactants and heat flows out; in an endothermic reaction they are higher and heat flows in.' },
  table: {
    caption: 'Standard enthalpies of formation at 25 °C (kJ/mol)',
    head: ['substance', 'ΔH_{f}°', 'substance', 'ΔH_{f}°'],
    rows: [['CO₂(g)', '−393.5', 'CH₄(g)', '−74.6'], ['H₂O(l)', '−285.8', 'C₂H₅OH(l)', '−277.6'], ['H₂O(g)', '−241.8', 'NH₃(g)', '−45.9'], ['CO(g)', '−110.5', 'O₂(g), H₂(g), C(graphite)', '0']],
    note: 'Values from standard reference tables (small differences between textbooks are normal).',
  },
  method: {
    title: 'Thermochemistry calculations',
    steps: [
      'Decide what is the system and what is the surroundings; assign the sign of q from the direction of heat flow.',
      'Calorimetry: q = mcΔT for the water (plus C_calΔT); q_reaction = −q_surroundings; divide by moles reacted for ΔH per mole.',
      'Hess’s law: arrange the given equations (reverse, multiply) so that they add to the target equation; do the same to their ΔH values.',
      'Formation enthalpies: products minus reactants, each multiplied by its coefficient; elements in standard states count as zero.',
      'Scale ΔH to the actual amount reacting; report sign and unit (kJ or kJ/mol).',
    ],
  },
  examples: [
    {
      title: 'Heat to warm a sample',
      problem: 'Find q for 50 g of a substance with c = 2.0 J/(g·°C) warmed by 3.0 °C.',
      steps: [['q = mcΔT = 50 × 2.0 × 3.0 = 300 J.', 'Direct substitution.']],
      result: 'q = +300 J (heat absorbed by the sample).',
      meaning: 'Water (c = 4.184) would need about twice as much heat for the same change.',
    },
    {
      title: 'Coffee-cup calorimetry',
      problem: '50.0 mL of 1.0 M HCl and 50.0 mL of 1.0 M NaOH, both at 22.0 °C, are mixed; the temperature rises to 28.7 °C. Assume the solution has mass 100.0 g and c = 4.184 J/(g·°C), and neglect the cup. Find ΔH per mole of water formed.',
      steps: [
        ['q_{solution} = 100.0 × 4.184 × 6.7 = 2.80 × 10^{3} J.', 'ΔT = 28.7 − 22.0 = 6.7 °C.'],
        ['q_{reaction} = −2.80 kJ.', 'Heat released by the reaction is absorbed by the solution.'],
        ['n(H₂O) = 0.0500 L × 1.0 M = 0.050 mol.', 'H⁺ + OH⁻ → H₂O, 1 : 1.'],
        ['ΔH = {{−2.80 kJ|0.050 mol}} = −56 kJ/mol.', 'Per mole of reaction.'],
      ],
      result: 'ΔH ≈ −56 kJ/mol.',
      meaning: 'The accepted value for strong acid–strong base neutralisation is about −56 to −57 kJ/mol.',
    },
    {
      title: 'Reversing a reaction',
      problem: 'A reaction has ΔH = −120 kJ as written. Find ΔH for the reverse reaction, and for twice the reverse reaction.',
      steps: [
        ['Reverse: +120 kJ.', 'Reversing changes the sign.'],
        ['Twice the reverse: 2 × (+120) = +240 kJ.', 'Multiplying coefficients multiplies ΔH.'],
      ],
      result: '+120 kJ and +240 kJ.',
      meaning: 'If forming a bond releases energy, breaking it costs the same amount.',
    },
    {
      title: 'Enthalpy of combustion from formation enthalpies',
      problem: 'Find ΔH° for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).',
      steps: [
        ['Products: −393.5 + 2(−285.8) = −965.1 kJ.', 'Coefficients multiply ΔH_f°.'],
        ['Reactants: −74.6 + 2(0) = −74.6 kJ.', 'O₂ is an element in its standard state.'],
        ['ΔH° = −965.1 − (−74.6) = −890.5 kJ.', 'Products minus reactants.'],
      ],
      result: 'ΔH° ≈ −890 kJ per mole of CH₄.',
      meaning: 'Burning 1.0 kg of methane (62.3 mol) releases about 5.5 × 10⁴ kJ. With H₂O(g) instead of H₂O(l) the answer would be −802 kJ.',
    },
    {
      title: 'Hess’s law',
      problem: 'A → B: ΔH = +20 kJ; B → C: ΔH = −50 kJ. Find ΔH for A → C and for C → A.',
      steps: [
        ['Add the steps: A → C, ΔH = 20 + (−50) = −30 kJ.', 'B cancels.'],
        ['C → A is the reverse: +30 kJ.', 'Change the sign.'],
      ],
      result: 'A → C: −30 kJ; C → A: +30 kJ.',
      meaning: 'The path through B does not matter; only the start and end states do.',
    },
    {
      title: 'First law with expansion work',
      problem: 'A system absorbs 100 J of heat and does 30 J of work on its surroundings. Find ΔU.',
      steps: [['q = +100 J; w = −30 J (work done by the system).', 'Signs from the system’s point of view.'], ['ΔU = 100 + (−30) = 70 J.', 'First law.']],
      result: 'ΔU = +70 J.',
      meaning: 'Adding 130 J would be wrong: energy used to do work leaves the system.',
    },
  ],
  mistakes: [
    ['Confusing heat and temperature.', 'Heat is energy transferred (J); temperature is a measure of hotness (°C, K).'],
    ['Wrong sign in calorimetry.', 'If the water warms, the reaction released heat: q_reaction is negative.'],
    ['Forgetting to multiply ΔH_f° by the coefficients.', 'Use n × ΔH_f° for each species.'],
    ['Giving elements a non-zero ΔH_f°.', 'Elements in their standard states have ΔH_f° = 0 (but O₃ or C(diamond) do not).'],
    ['Mixing up H₂O(l) and H₂O(g).', 'Their ΔH_f° values differ by 44 kJ/mol (the enthalpy of vaporisation).'],
  ],
  scope: [
    'Gibbs energy appears only in Electrochemistry (ΔG° = −nFE°); entropy is not developed in these lessons. Check your outline.',
    'Heat capacities are treated as constant. The energy of a phase change is shown in Intermolecular forces; full heating curves are not developed.',
  ],
  checks: [
    ['q', 50 * 2 * 3, 300, 1e-9], ['cal q', 100 * 4.184 * 6.7, 2803, 1], ['cal dH', -100 * 4.184 * 6.7 / 1000 / 0.05, -56, 0.1],
    ['comb', -393.5 + 2 * -285.8 - (-74.6), -890.5, 1e-9], ['comb g', -393.5 + 2 * -241.8 - (-74.6), -802.5, 1e-9],
    ['per kg', 1000 / 16.04 * 890.5, 5.55e4, 0.01e4], ['hess', -110.5 - 283.0, -393.5, 1e-9], ['dU', 100 - 30, 70, 0], ['ABC', 20 - 50, -30, 0],
  ],
};
