import { svg, rect, text, line, vector, path } from '../svg.mjs';

// Daniell cell: Zn anode in Zn²⁺, Cu cathode in Cu²⁺, salt bridge, external wire with voltmeter.
const fig = svg('chem-cell', { w: 500, h: 300, title: 'A galvanic (Daniell) cell: zinc and copper', desc: 'Two beakers. Left: a zinc electrode (anode, negative) in zinc sulfate solution, where Zn is oxidised to Zn²⁺. Right: a copper electrode (cathode, positive) in copper sulfate solution, where Cu²⁺ is reduced to Cu. A wire with a voltmeter reading 1.10 V connects the electrodes; electrons flow through the wire from zinc to copper. An inverted U-shaped salt bridge joins the solutions and lets ions move to keep each solution neutral.' },
  // beakers
  path('M40,140 L40,270 L200,270 L200,140', { color: '#183b3f', width: 2.5 }) + path('M300,140 L300,270 L460,270 L460,140', { color: '#183b3f', width: 2.5 })
  + rect(42, 170, 156, 98, { fill: '#e1e8e3', stroke: 'none', rx: 0 }) + rect(302, 170, 156, 98, { fill: '#d8e0ef', stroke: 'none', rx: 0 })
  // electrodes
  + rect(100, 110, 22, 130, { fill: '#9aa5a8', stroke: '#183b3f', rx: 2 }) + rect(378, 110, 22, 130, { fill: '#b8733a', stroke: '#183b3f', rx: 2 })
  + text(111, 258, 'Zn²⁺(aq)', { anchor: 'middle', size: 13 }) + text(389, 258, 'Cu²⁺(aq)', { anchor: 'middle', size: 13 })
  // salt bridge
  + path('M170,200 L170,120 L330,120 L330,200', { color: '#9b6328', width: 14 }) + text(250, 112, 'salt bridge', { anchor: 'middle', size: 13, color: '#9b6328' })
  // wire and voltmeter
  + line(111, 110, 111, 40, { width: 2 }) + line(389, 110, 389, 40, { width: 2 }) + line(111, 40, 225, 40, { width: 2 }) + line(275, 40, 389, 40, { width: 2 })
  + `<circle cx="250" cy="40" r="24" fill="#fff" stroke="#183b3f" stroke-width="2"/>` + text(250, 45, '1.10 V', { anchor: 'middle', size: 13, weight: 650 })
  + vector(140, 26, 210, 26, 'd', 2) + text(175, 18, 'e⁻', { anchor: 'middle', size: 14, color: '#355b90' }) + vector(290, 26, 360, 26, 'd', 2)
  + text(20, 100, 'ANODE (−)', { size: 13, weight: 650 }) + text(20, 118, 'oxidation', { size: 12, color: '#5e7376' }) + text(40, 290, 'Zn → Zn²⁺ + 2e⁻', { size: 13 })
  + text(410, 100, 'CATHODE (+)', { size: 13, weight: 650 }) + text(410, 118, 'reduction', { size: 12, color: '#5e7376' }) + text(300, 290, 'Cu²⁺ + 2e⁻ → Cu', { size: 13 }));

export default {
  summary: 'Redox reactions can be split so that electrons flow through a wire. Galvanic cells convert chemical energy to electrical energy (E°cell = E°cathode − E°anode); electrolysis uses electricity to drive non-spontaneous reactions (Faraday’s laws).',
  why: [
    'Batteries, fuel cells, corrosion, electroplating and the industrial production of aluminium, chlorine and sodium hydroxide are all electrochemistry. Engineers use electrode potentials to predict which metals corrode, to design corrosion protection (sacrificial anodes), and Faraday’s laws to size electrolysis plants.',
  ],
  idea: [
    'In a redox reaction electrons move from the species being oxidised to the species being reduced. If the two **half-reactions** are placed in separate compartments connected by a wire, the electrons must travel through the wire: an electric current. This is a **galvanic (voltaic) cell**.',
    'Oxidation happens at the **anode**, reduction at the **cathode** (“an ox, red cat”). In a galvanic cell the anode is the negative terminal and electrons flow through the external wire from anode to cathode. A **salt bridge** (or porous barrier) lets ions move between the solutions so that each stays electrically neutral; without it the current stops immediately.',
    'Each half-reaction has a **standard reduction potential** E° (in volts), measured against the standard hydrogen electrode (defined as 0 V) at 1 M, 1 bar and usually 25 °C. The more positive E°, the stronger the tendency to be reduced. The cell voltage is **E°_{cell} = E°_{cathode} − E°_{anode}**, using both values as reduction potentials without changing their signs. Multiplying a half-reaction to balance electrons does **not** change its E° (potential is an intensive property).',
    'A positive E°_{cell} means the reaction is spontaneous as written: ΔG° = −nFE°_{cell} < 0. Away from standard concentrations, the **Nernst equation** adjusts the voltage; as a battery discharges, the reactant concentrations fall and the voltage drops.',
    'In **electrolysis** an external power supply forces a non-spontaneous reaction, for example splitting molten NaCl into Na and Cl₂. The amount of product is set by the charge passed: Q = It, and n(e⁻) = Q/F, where F = 96 485 C/mol is the charge of one mole of electrons (**Faraday’s law**).',
  ],
  background: [
    { title: 'Oxidation numbers', text: 'Oxidation: oxidation number increases (electrons lost). Reduction: it decreases (electrons gained). See Reactions in solution.' },
    { title: 'Balancing half-reactions', text: 'Balance atoms other than O and H; add H₂O for O, H⁺ for H (acidic solution); add electrons to balance charge; multiply so that electrons lost = electrons gained; add.' },
    { title: 'Charge and current', text: 'Q (coulombs) = I (amperes) × t (seconds). 1 A = 1 C/s.' },
  ],
  definitions: [
    ['Half-reaction', 'The oxidation or reduction part of a redox reaction written separately, showing electrons.'],
    ['Anode / cathode', 'Electrode where oxidation / reduction occurs (in every kind of cell).'],
    ['Galvanic cell', 'A cell in which a spontaneous redox reaction produces electrical energy.'],
    ['Electrolytic cell', 'A cell in which electrical energy drives a non-spontaneous reaction.'],
    ['Standard reduction potential E°', 'The potential of a reduction half-reaction relative to the standard hydrogen electrode, with all species in standard states.'],
    ['Cell notation', 'Anode on the left, cathode on the right: Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s); | is a phase boundary, || the salt bridge.'],
    ['Faraday constant F', 'Charge of 1 mol of electrons: 96 485 C/mol.'],
  ],
  symbols: [
    ['E°', 'standard potential', 'V'], ['E_{cell}', 'cell potential (voltage)', 'V'], ['n', 'moles of electrons transferred per mole of reaction', 'mol'], ['F', 'Faraday constant, 96 485', 'C/mol'],
    ['ΔG°', 'standard Gibbs energy change', 'J/mol (kJ/mol)'], ['Q', 'charge (in Faraday’s law) or reaction quotient (in Nernst)', 'C or —'], ['I, t', 'current, time', 'A, s'],
  ],
  formulas: [
    { name: 'Standard cell potential', f: 'E°_{cell} = E°_{cathode} − E°_{anode}', when: 'Both E° values are reduction potentials from the table; do not reverse the sign of the anode value and then also subtract it.' },
    { name: 'Spontaneity', f: 'ΔG° = −nFE°_{cell}', when: 'E° > 0 ⇔ ΔG° < 0 ⇔ spontaneous as written (under standard conditions).' },
    { name: 'Nernst equation (25 °C)', f: 'E = E° − {{0.0592 V|n}} log Q', when: 'T = 298 K; Q is the reaction quotient (products over reactants, with pure solids omitted).' },
    { name: 'Faraday’s law of electrolysis', f: 'n(e^{−}) = {{It|F}};   n(product) = n(e^{−}) ÷ (electrons per formula)', when: 'Assumes 100% current efficiency; t in seconds.' },
  ],
  derivation: {
    title: 'The Daniell cell voltage from the table',
    intro: 'Zn²⁺ + 2e⁻ → Zn has E° = −0.76 V; Cu²⁺ + 2e⁻ → Cu has E° = +0.34 V.',
    steps: [
      ['Copper has the more positive E°, so Cu²⁺ is reduced: copper is the cathode.', 'The stronger oxidising agent is reduced.'],
      ['Zinc is oxidised: Zn → Zn²⁺ + 2e⁻ at the anode.', 'The other half-reaction runs in reverse.'],
      ['E°_{cell} = +0.34 − (−0.76) = +1.10 V.', 'Cathode minus anode, both as reduction potentials.'],
      ['Overall: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), n = 2.', 'Electrons cancel.'],
    ],
    end: 'ΔG° = −2 × 96 485 × 1.10 = −212 kJ/mol: strongly spontaneous. Zinc metal dropped into copper sulfate solution becomes coated with copper — the same reaction without the wire.',
  },
  figure: { svg: fig, caption: 'Zinc is oxidised at the anode; electrons flow through the wire to the copper cathode, where Cu²⁺ is reduced. The salt bridge completes the circuit by moving ions, not electrons.' },
  table: {
    caption: 'Selected standard reduction potentials at 25 °C',
    head: ['half-reaction', 'E° (V)'],
    rows: [['F₂(g) + 2e⁻ → 2F⁻(aq)', '+2.87'], ['Cl₂(g) + 2e⁻ → 2Cl⁻(aq)', '+1.36'], ['O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)', '+1.23'], ['Ag⁺(aq) + e⁻ → Ag(s)', '+0.80'], ['Cu²⁺(aq) + 2e⁻ → Cu(s)', '+0.34'], ['2H⁺(aq) + 2e⁻ → H₂(g)', '0.00 (definition)'], ['Fe²⁺(aq) + 2e⁻ → Fe(s)', '−0.44'], ['Zn²⁺(aq) + 2e⁻ → Zn(s)', '−0.76'], ['Al³⁺(aq) + 3e⁻ → Al(s)', '−1.66'], ['Li⁺(aq) + e⁻ → Li(s)', '−3.04']],
    note: 'Top: strongest oxidising agents (easily reduced). Bottom: the metals are the strongest reducing agents (easily oxidised).',
  },
  method: {
    title: 'Galvanic-cell and electrolysis problems',
    steps: [
      'Write both half-reactions as reductions with their E° values.',
      'The one with the more positive E° is the cathode (reduction); reverse the other for the anode (oxidation).',
      'E°_{cell} = E°_{cathode} − E°_{anode}. Positive means spontaneous.',
      'Balance electrons (multiply half-reactions — without changing E°), add, and cancel; n is the number of electrons transferred.',
      'For electrolysis: Q = It, n(e⁻) = Q/F, then the mole ratio from the half-reaction, then mass.',
    ],
  },
  examples: [
    {
      title: 'Cell potential from two half-reactions',
      problem: 'Cathode and anode reduction potentials are +0.50 V and −0.20 V. Find E°_{cell}. Repeat for +0.80 V and −0.40 V.',
      steps: [
        ['E°_{cell} = 0.50 − (−0.20) = 0.70 V.', 'Subtracting a negative potential adds its size.'],
        ['E°_{cell} = 0.80 − (−0.40) = 1.20 V.', 'Same rule.'],
      ],
      result: '0.70 V and 1.20 V.',
      meaning: 'Both positive: both reactions are spontaneous as written.',
    },
    {
      title: 'A silver–copper cell',
      problem: 'Using the table, find E°_{cell} and the overall reaction for a cell made from Ag⁺/Ag and Cu²⁺/Cu. Write the cell notation.',
      steps: [
        ['Ag⁺/Ag (+0.80 V) is more positive: silver is the cathode. Copper is the anode.', 'Compare E° values.'],
        ['E°_{cell} = 0.80 − 0.34 = 0.46 V.', 'Cathode minus anode.'],
        ['Balance electrons: 2Ag⁺ + 2e⁻ → 2Ag (E° still +0.80 V); Cu → Cu²⁺ + 2e⁻.', 'Multiply the silver half-reaction by 2; potential is unchanged.'],
        ['Overall: Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s).', 'Add and cancel electrons.'],
      ],
      result: 'E°_{cell} = +0.46 V. Cell: Cu(s) | Cu²⁺(aq) || Ag⁺(aq) | Ag(s).',
      meaning: 'Doubling the silver half-reaction’s potential to 1.60 V would be a mistake.',
    },
    {
      title: 'Gibbs energy from cell potential',
      problem: 'Find ΔG° for the Daniell cell (E°_{cell} = 1.10 V, n = 2).',
      steps: [['ΔG° = −nFE° = −2 × 96 485 × 1.10 = −2.12 × 10^{5} J/mol.', 'Units: C × V = J.']],
      result: 'ΔG° ≈ −212 kJ/mol.',
      meaning: 'The negative sign confirms spontaneity; this is the maximum electrical work per mole of reaction.',
    },
    {
      title: 'Electroplating copper',
      problem: 'A current of 2.00 A passes through CuSO₄ solution for 30.0 min. What mass of copper is deposited? (M(Cu) = 63.55 g/mol)',
      steps: [
        ['Q = It = 2.00 × 1800 = 3600 C.', '30.0 min = 1800 s.'],
        ['n(e^{−}) = {{3600|96 485}} = 0.0373 mol.', 'Faraday’s law.'],
        ['Cu²⁺ + 2e⁻ → Cu: n(Cu) = 0.0373/2 = 0.01866 mol.', 'Two electrons per copper atom.'],
        ['m = 0.01866 × 63.55 = 1.19 g.', 'Moles to mass.'],
      ],
      result: '≈ 1.19 g of copper.',
      meaning: 'Doubling the current or the time doubles the mass deposited.',
    },
    {
      title: 'Effect of concentration (Nernst)',
      problem: 'In a Daniell cell at 25 °C, [Zn²⁺] = 1.0 M and [Cu²⁺] = 0.010 M. Find E_{cell}.',
      steps: [
        ['Q = {{[Zn^{2+}]|[Cu^{2+}]}} = {{1.0|0.010}} = 100.', 'Solids omitted.'],
        ['E = 1.10 − {{0.0592|2}} log 100 = 1.10 − 0.0296 × 2 = 1.04 V.', 'Nernst equation, n = 2.'],
      ],
      result: 'E_{cell} ≈ 1.04 V.',
      meaning: 'As the cell discharges, Cu²⁺ is used up and the voltage falls gradually.',
    },
    {
      title: 'Balancing a redox equation in acidic solution',
      problem: 'Permanganate oxidises iron(II) in acid: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺. Balance the equation.',
      steps: [
        ['Oxidation half-reaction: Fe²⁺ → Fe³⁺ + e⁻.', 'Iron’s oxidation number rises from +2 to +3.'],
        ['Reduction: MnO₄⁻ → Mn²⁺. Add 4 H₂O on the right to balance O, then 8 H⁺ on the left to balance H: MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O.', 'In acid, H₂O balances oxygen and H⁺ balances hydrogen.'],
        ['Balance charge with electrons: left +7, right +2, so add 5 e⁻ on the left: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.', 'Mn goes from +7 to +2: it gains 5 electrons.'],
        ['Multiply the iron half-reaction by 5 and add: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.', 'Electrons lost must equal electrons gained, so they cancel.'],
        ['Check charge: left −1 + 8 + 10 = +17; right +2 + 15 = +17.', 'Atoms and charge both balance.'],
      ],
      result: 'MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.',
      meaning: 'This reaction is used to measure iron by titration: 1 mol of permanganate reacts with 5 mol of Fe²⁺. In basic solution the method differs (add OH⁻ to neutralise the H⁺).',
    },
  ],
  mistakes: [
    ['Multiplying E° when a half-reaction is multiplied.', 'E° is intensive: it does not change with the coefficients.'],
    ['Reversing the anode’s sign and then also subtracting it.', 'Use E°cell = E°cathode − E°anode with table values, or add the oxidation potential — not both.'],
    ['“Electrons flow through the salt bridge.”', 'Electrons flow in the wire; ions move in the salt bridge and solutions.'],
    ['Assuming the anode is always positive.', 'In a galvanic cell the anode is negative; in an electrolytic cell it is positive. Oxidation happens at the anode in both.'],
    ['Using minutes in Q = It.', 'Time must be in seconds.'],
  ],
  scope: [
    'Detailed battery chemistries, corrosion kinetics and overpotentials are beyond this topic.',
    'The Nernst equation is shown at 25 °C; the general form uses RT/(nF) ln Q.',
  ],
  checks: [
    ['redox charge L', -1 + 8 + 10, 17, 0], ['redox charge R', 2 + 15, 17, 0],
    ['E1', 0.5 + 0.2, 0.7, 1e-12], ['E2', 0.8 + 0.4, 1.2, 1e-12], ['Daniell', 0.34 + 0.76, 1.10, 1e-12], ['AgCu', 0.8 - 0.34, 0.46, 1e-12],
    ['dG', -2 * 96485 * 1.1 / 1000, -212, 0.5], ['Q', 2 * 1800, 3600, 0], ['ne', 3600 / 96485, 0.0373, 0.00005], ['mCu', 3600 / 96485 / 2 * 63.55, 1.19, 0.005],
    ['Nernst', 1.10 - 0.0592 / 2 * Math.log10(100), 1.04, 0.002],
  ],
};
