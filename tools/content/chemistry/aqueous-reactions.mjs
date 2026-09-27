import { svg, box, vector, text } from '../svg.mjs';

const fig = svg('chem-stoich', { w: 520, h: 250, title: 'The stoichiometry route: always pass through moles', desc: 'Flow diagram. Top row: mass of A (grams) divided by molar mass gives moles of A; volume of solution times molarity also gives moles of A. Moles of A times the mole ratio from the balanced equation gives moles of B. Moles of B times molar mass gives mass of B, or divided by molarity gives volume of solution of B.' },
  box(10, 20, 130, 54, ['mass of A (g)']) + box(10, 150, 130, 54, ['volume of A', 'solution (L)'], { bold: false })
  + box(195, 85, 120, 54, ['moles of A'], { fill: '#fff' }) + box(370, 85, 120, 54, ['moles of B'], { fill: '#fff' })
  + box(370, 10, 140, 50, ['mass of B (g)']) + box(370, 170, 140, 54, ['volume of B', 'solution (L)'], { bold: false })
  + vector(140, 50, 195, 100, 'ink', 1.6) + text(150, 62, '÷ M (g/mol)', { size: 12, color: '#5e7376' })
  + vector(140, 175, 195, 125, 'ink', 1.6) + text(150, 172, '× c (mol/L)', { size: 12, color: '#5e7376' })
  + vector(315, 112, 370, 112, 'c', 2.5) + text(342, 150, 'mole ratio', { size: 12, anchor: 'middle', color: '#b3412e' }) + text(342, 165, 'from balanced', { size: 12, anchor: 'middle', color: '#b3412e' }) + text(342, 180, 'equation', { size: 12, anchor: 'middle', color: '#b3412e' })
  + vector(430, 85, 430, 62, 'ink', 1.6) + text(438, 78, '× M', { size: 12, color: '#5e7376' })
  + vector(430, 139, 430, 168, 'ink', 1.6) + text(438, 158, '÷ c', { size: 12, color: '#5e7376' }));

export default {
  summary: 'In water, many compounds exist as ions. Reactions in solution — precipitation, acid–base and redox — are written as net ionic equations, and their amounts are calculated through moles using balanced equations.',
  why: [
    'Most chemistry in industry, the environment and living things happens in water: water treatment removes ions by precipitation, titrations measure concentrations in quality control, neutralisation treats acidic waste, and redox reactions drive corrosion and batteries. Knowing which species actually react, and in what amounts, is the basis of process design and analysis.',
  ],
  idea: [
    'A **balanced equation** conserves atoms and charge. Its coefficients give **mole ratios**, never mass ratios: in 2H₂ + O₂ → 2H₂O, 2 mol of H₂ react with 1 mol of O₂. To calculate amounts, always go through moles (see the figure).',
    'When ionic compounds or strong acids dissolve, they separate into ions: they are **strong electrolytes**. NaCl(aq) is really Na⁺(aq) and Cl⁻(aq). Weak acids (such as acetic acid) and weak bases ionise only partly (weak electrolytes); sugar does not ionise at all (non-electrolyte).',
    'Writing reactions as ions shows what really happens. Mixing AgNO₃(aq) with NaCl(aq) forms solid AgCl. In the **complete ionic equation**, Na⁺ and NO₃⁻ appear unchanged on both sides — they are **spectator ions**. Removing them gives the **net ionic equation**: Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Solubility rules tell you which products are insoluble (precipitates).',
    'The three main reaction types are: **precipitation** (an insoluble solid forms), **acid–base neutralisation** (H⁺ from an acid combines with OH⁻ from a base: H⁺ + OH⁻ → H₂O for strong acid–strong base), and **oxidation–reduction** (redox), in which electrons are transferred. Oxidation is loss of electrons (oxidation number increases); reduction is gain (oxidation number decreases). They always happen together.',
    'When reactants are not in the exact mole ratio, the one that runs out first is the **limiting reactant**; it determines the maximum (theoretical) yield. The actual yield divided by the theoretical yield gives the percent yield. For solutions, moles = molarity × volume, which makes **titration** possible: measure the volume of a solution of known concentration needed to react exactly with an unknown.',
  ],
  background: [
    { title: 'The mole and molar mass', text: '1 mol = 6.022 × 10^{23} particles. Molar mass M (g/mol) is the sum of atomic masses in the formula: M(NaCl) = 22.99 + 35.45 = 58.44 g/mol. n = m/M.' },
    { title: 'Molarity', text: 'c = {{n|V}} in mol/L (M). Volumes in litres: 25.0 mL = 0.0250 L. See Properties of solutions.' },
    { title: 'Common ions', text: 'NO₃⁻ nitrate, SO₄²⁻ sulfate, CO₃²⁻ carbonate, OH⁻ hydroxide, NH₄⁺ ammonium, PO₄³⁻ phosphate.' },
  ],
  definitions: [
    ['Electrolyte', 'A substance that produces ions in water, so that the solution conducts electricity. Strong: fully ionised; weak: partly ionised.'],
    ['Precipitate', 'An insoluble solid formed when two solutions are mixed.'],
    ['Spectator ion', 'An ion present on both sides of the ionic equation, unchanged.'],
    ['Net ionic equation', 'The equation showing only the species that actually change.'],
    ['Acid / base (Arrhenius and Brønsted–Lowry)', 'An acid produces H⁺ in water (proton donor); a base produces OH⁻ (proton acceptor).'],
    ['Oxidation number', 'A bookkeeping charge: elements 0; monatomic ions their charge; O usually −2; H usually +1 (−1 in metal hydrides); the sum equals the overall charge.'],
    ['Limiting reactant', 'The reactant that is completely consumed first; it fixes the maximum amount of product.'],
    ['Equivalence point', 'The point in a titration at which the reactants have been mixed in exactly the stoichiometric ratio.'],
  ],
  symbols: [
    ['n', 'amount of substance', 'mol'], ['m', 'mass', 'g'], ['M', 'molar mass', 'g/mol'], ['c (or [X])', 'molar concentration', 'mol/L (M)'], ['V', 'volume of solution', 'L'], ['(s), (l), (g), (aq)', 'solid, liquid, gas, dissolved in water', '—'],
  ],
  formulas: [
    { name: 'Moles', f: 'n = {{m|M}};   n = cV', when: 'm in grams, M in g/mol; c in mol/L, V in litres.' },
    { name: 'Mole ratio', f: 'n_{B} = n_{A} × {{coefficient of B|coefficient of A}}', when: 'Only from a balanced equation. To predict how much product forms, start from the limiting reactant.' },
    { name: 'Percent yield', f: '% yield = {{actual yield|theoretical yield}} × 100%', when: 'Theoretical yield computed from the limiting reactant.' },
    { name: 'Titration at equivalence', f: 'c_{A}V_{A} × {{b|a}} = c_{B}V_{B}   for  aA + bB → products', when: 'At the equivalence point. For a 1:1 reaction (HCl + NaOH), c_{A}V_{A} = c_{B}V_{B}.' },
    { name: 'Solubility guidelines (summary)', f: 'soluble: Na⁺, K⁺, NH₄⁺, NO₃⁻ compounds (all); most Cl⁻, Br⁻, I⁻ (except Ag⁺, Pb²⁺, Hg₂²⁺); most SO₄²⁻ (except Ba²⁺, Pb²⁺, Ca²⁺ slightly).  Insoluble: most CO₃²⁻, PO₄³⁻, OH⁻, S²⁻ (except with Group 1 and NH₄⁺)', when: 'Rules of thumb at room temperature; “insoluble” means very slightly soluble.' },
  ],
  derivation: {
    title: 'From a molecular equation to a net ionic equation',
    intro: 'Silver nitrate solution is mixed with sodium chloride solution.',
    steps: [
      ['Molecular: AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq).', 'Balanced; AgCl is insoluble (solubility rules).'],
      ['Complete ionic: Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s) + Na⁺(aq) + NO₃⁻(aq).', 'Split strong electrolytes into ions; keep the solid together.'],
      ['Cancel the spectators Na⁺ and NO₃⁻.', 'They appear unchanged on both sides.'],
      ['Net ionic: Ag⁺(aq) + Cl⁻(aq) → AgCl(s).', 'Check: atoms balanced; charge 0 = 0.'],
    ],
    end: 'Any soluble silver salt and any soluble chloride give the same net reaction.',
  },
  figure: { svg: fig, caption: 'Grams and litres cannot be compared directly across a reaction. Convert to moles, use the mole ratio from the balanced equation, then convert back.' },
  table: {
    caption: 'Assigning oxidation numbers',
    head: ['species', 'oxidation numbers', 'reason'],
    rows: [['O₂, Fe, Cl₂', '0', 'uncombined elements'], ['Fe³⁺', '+3', 'monatomic ion: its charge'], ['H₂O', 'H +1, O −2', 'standard values; sum 0'], ['SO₄²⁻', 'S +6, O −2', 'S + 4(−2) = −2'], ['MnO₄⁻', 'Mn +7, O −2', 'Mn + 4(−2) = −1'], ['H₂O₂', 'H +1, O −1', 'peroxide: exception for O']],
  },
  method: {
    title: 'Solving a reaction-in-solution problem',
    steps: [
      'Write and balance the molecular equation; identify the reaction type.',
      'If asked, write the complete ionic and net ionic equations (split only soluble strong electrolytes).',
      'Convert every given quantity to moles (n = m/M or n = cV).',
      'Find the limiting reactant: divide each reactant’s moles by its coefficient; the smallest result is limiting.',
      'Use the mole ratio from the limiting reactant to find moles of product, then convert to the requested unit.',
      'Check charge and atom balance, units and significant figures.',
    ],
  },
  examples: [
    {
      title: 'Balancing an equation',
      problem: 'Balance the combustion of propane: C₃H₈ + O₂ → CO₂ + H₂O.',
      steps: [
        ['Carbon: 3 on the left, so write 3 CO₂.', 'Balance elements that appear in only one substance on each side first.'],
        ['Hydrogen: 8 on the left, so write 4 H₂O.', 'Each water molecule has 2 H.'],
        ['Oxygen on the right: 3 × 2 + 4 × 1 = 10 atoms, so write 5 O₂ on the left.', 'Leave the free element (O₂) until last; it can be adjusted without upsetting the others.'],
        ['Check: C 3 = 3; H 8 = 8; O 10 = 10.', 'Every element must balance.'],
      ],
      result: 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
      meaning: 'Only coefficients were changed. Changing a subscript (writing H₂O₂) would describe a different substance.',
    },
    {
      title: 'Moles from a balanced equation',
      problem: 'For 2H₂ + O₂ → 2H₂O, how much water forms from 3 mol H₂ with excess O₂? How much O₂ is used?',
      steps: [
        ['n(H₂O) = 3 × {{2|2}} = 3 mol.', 'Ratio H₂O : H₂ = 2 : 2.'],
        ['n(O₂) = 3 × {{1|2}} = 1.5 mol.', 'Ratio O₂ : H₂ = 1 : 2.'],
      ],
      result: '3 mol H₂O; 1.5 mol O₂ consumed.',
      meaning: 'In grams: 3 mol × 18.02 g/mol = 54.1 g of water.',
    },
    {
      title: 'Limiting reactant in a precipitation',
      problem: '0.20 mol Ag⁺ is mixed with 0.12 mol Cl⁻ (Ag⁺ + Cl⁻ → AgCl). Find the maximum amount of AgCl and what is left over.',
      steps: [
        ['The ratio is 1 : 1, and there is less Cl⁻.', 'Divide each by its coefficient (1): 0.20 vs 0.12.'],
        ['Cl⁻ is limiting: n(AgCl) = 0.12 mol.', 'The limiting reactant fixes the product.'],
        ['Ag⁺ left: 0.20 − 0.12 = 0.08 mol.', 'Excess reactant remains in solution.'],
      ],
      result: '0.12 mol AgCl (≈ 17.2 g, M = 143.32 g/mol); 0.08 mol Ag⁺ remains.',
      meaning: 'The reactant present in the larger amount is not automatically in excess; compare moles divided by coefficients.',
    },
    {
      title: 'Mass of precipitate from solution volumes',
      problem: '50.0 mL of 0.100 M BaCl₂ is mixed with excess Na₂SO₄. What mass of BaSO₄ precipitates? (M(BaSO₄) = 233.4 g/mol)',
      steps: [
        ['Net ionic: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).', 'BaSO₄ is insoluble; Na⁺ and Cl⁻ are spectators.'],
        ['n(Ba²⁺) = 0.100 × 0.0500 = 5.00 × 10^{−3} mol.', 'n = cV with V in litres.'],
        ['n(BaSO₄) = 5.00 × 10^{−3} mol (1 : 1); m = 5.00 × 10^{−3} × 233.4 = 1.17 g.', 'Mole ratio, then mass.'],
      ],
      result: '1.17 g BaSO₄.',
      meaning: 'This gravimetric method is used to determine sulfate or barium content.',
    },
    {
      title: 'Acid–base titration',
      problem: '25.0 mL of HCl is neutralised by 18.6 mL of 0.150 M NaOH. Find the HCl concentration.',
      steps: [
        ['HCl + NaOH → NaCl + H₂O (1 : 1). Net ionic: H⁺ + OH⁻ → H₂O.', 'Strong acid, strong base.'],
        ['n(NaOH) = 0.150 × 0.0186 = 2.79 × 10^{−3} mol = n(HCl).', 'At equivalence the moles match.'],
        ['c(HCl) = {{2.79 × 10^{−3}|0.0250}} = 0.112 M.', 'c = n/V.'],
      ],
      result: '[HCl] = 0.112 M.',
      meaning: 'For H₂SO₄, which gives two H⁺ per formula, the NaOH needed would double for the same concentration.',
    },
    {
      title: 'Identify oxidation and reduction',
      problem: 'In Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), which species is oxidised, which reduced, and what are the oxidising and reducing agents?',
      steps: [
        ['Zn: 0 → +2 (loses 2 e⁻): oxidised.', 'Oxidation number increases.'],
        ['Cu: +2 → 0 (gains 2 e⁻): reduced.', 'Oxidation number decreases.'],
        ['Oxidising agent: Cu²⁺ (it takes electrons). Reducing agent: Zn (it gives electrons).', 'Each agent is the reactant that causes the other change.'],
      ],
      result: 'Zn is oxidised (reducing agent); Cu²⁺ is reduced (oxidising agent).',
      meaning: 'Half-reactions: Zn → Zn²⁺ + 2e⁻ and Cu²⁺ + 2e⁻ → Cu. This reaction powers the Daniell cell (Electrochemistry).',
    },
    {
      title: 'Percent yield',
      problem: 'A reaction should give 12.0 g of product (theoretical yield) but 10.2 g is collected. Find the percent yield.',
      steps: [['{{10.2|12.0}} × 100% = 85.0%.', 'Actual over theoretical.']],
      result: '85.0%.',
      meaning: 'A percent yield above 100% signals an error, such as a wet (not fully dried) product.',
    },
  ],
  mistakes: [
    ['Using mass ratios from the coefficients.', 'Coefficients are mole ratios. Convert grams to moles first.'],
    ['Changing subscripts to balance an equation.', 'Only coefficients may change; subscripts define the substance.'],
    ['Splitting solids, weak acids or water into ions.', 'Only soluble strong electrolytes are written as separate ions.'],
    ['Using mL in n = cV.', 'Convert to litres.'],
    ['Assuming the reactant with the smaller mass is limiting.', 'Compare moles divided by coefficients.'],
    ['Oxidation = gaining oxygen only.', 'Oxidation is loss of electrons (increase in oxidation number), whether or not oxygen is involved.'],
  ],
  scope: [
    'Balancing redox equations by the half-reaction method is shown in Electrochemistry (acidic solution).',
    'Acid–base equilibria (pH of weak acids, buffers) are not covered in this lesson; check your outline.',
  ],
  checks: [
    ['propane O', 3 * 2 + 4, 10, 0], ['propane O2', 10 / 2, 5, 0],
    ['water', 3 * 2 / 2, 3, 0], ['O2', 1.5, 3 / 2, 0], ['water g', 3 * 18.02, 54.1, 0.05], ['AgCl', 0.12 * 143.32, 17.2, 0.05], ['Ag left', 0.2 - 0.12, 0.08, 1e-12],
    ['Ba mol', 0.1 * 0.05, 5e-3, 1e-15], ['BaSO4', 5e-3 * 233.4, 1.17, 0.005], ['NaOH', 0.15 * 0.0186, 2.79e-3, 1e-9], ['HCl', 0.15 * 0.0186 / 0.025, 0.112, 0.0005], ['yield', 10.2 / 12 * 100, 85, 1e-9],
    ['MnO4', 7 - 8, -1, 0], ['SO4', 6 - 8, -2, 0],
  ],
};
