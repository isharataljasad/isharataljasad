import { plot, render, curve, dot, label } from '../svg.mjs';

// Boyle's law at constant T and n: PV = 6 bar·L.
const fig = render('chem-boyle', {
  title: 'Boyle’s law: pressure against volume at constant temperature',
  desc: 'A curve P = 6/V (pressure in bar, volume in litres) for a fixed amount of gas at constant temperature. Marked points (1, 6), (2, 3), (3, 2) and (6, 1) all have PV = 6 bar·L. Halving the volume doubles the pressure.',
}, plot({ x: [0, 7], y: [0, 8], xticks: [1, 2, 3, 4, 5, 6], yticks: [1, 2, 3, 4, 5, 6, 7], xlabel: 'V (L)', ylabel: 'P (bar)' }, [
  curve((v) => 6 / v, 0.86, 6.9),
  dot(1, 6, { color: '#b3412e' }), dot(2, 3, { color: '#b3412e' }), dot(3, 2, { color: '#b3412e' }), dot(6, 1, { color: '#b3412e' }),
  label(1, 6, '(1 L, 6 bar)', { dx: 10, dy: -4, size: 13 }), label(2, 3, '(2 L, 3 bar)', { dx: 10, dy: -6, size: 13 }), label(3, 2, '(3 L, 2 bar)', { dx: 8, dy: -8, size: 13 }), label(6, 1, '(6 L, 1 bar)', { dx: 0, dy: -12, anchor: 'middle', size: 13 }),
  label(3.6, 5.6, 'PV = 6 bar·L (constant)', { size: 14, color: '#176e66' }),
]));

export default {
  summary: 'An ideal gas obeys PV = nRT with T in kelvin. The simple gas laws, gas densities, mixtures (Dalton) and gas stoichiometry all follow, and kinetic-molecular theory explains why.',
  why: [
    'Gases are everywhere in chemical engineering: reactor feeds and products, combustion, compressors, storage cylinders, airbags, breathing gases. The ideal gas law lets you calculate how much gas a vessel holds, what pressure it will reach when heated, or what volume of gas a reaction produces — and knowing its assumptions tells you when a real gas will deviate.',
  ],
  idea: [
    'A gas is described by four variables: pressure P, volume V, temperature T and amount n. For an **ideal gas** they are linked by **PV = nRT**. Temperature must be absolute (kelvin): T(K) = T(°C) + 273.15. Using °C gives nonsense, such as zero volume at 0 °C.',
    'Holding two variables fixed gives the classic laws. **Boyle**: at constant n and T, P ∝ 1/V (halve the volume, double the pressure). **Charles**: at constant n and P, V ∝ T. **Gay-Lussac**: at constant n and V, P ∝ T. **Avogadro**: at constant P and T, V ∝ n — equal volumes of gases contain equal numbers of molecules. For one sample changing conditions, use {{P_{1}V_{1}|T_{1}}} = {{P_{2}V_{2}|T_{2}}}.',
    '**Kinetic-molecular theory** explains these laws. Gas molecules are in constant random motion; their own volume is negligible compared with the container; they do not attract or repel except during elastic collisions; and their average kinetic energy is proportional to the absolute temperature. Pressure is the result of molecules colliding with the walls. Heating makes them move faster and hit harder and more often.',
    'In a **mixture**, each gas behaves as if it were alone: its **partial pressure** is P_{i} = n_{i}RT/V, and the total pressure is the sum (**Dalton’s law**), so P_{i} = χ_{i}P_{total}.',
    '**Real gases** deviate from ideal behaviour at high pressure (molecules’ own volume matters) and low temperature (attractions matter). At ordinary conditions the ideal gas law is usually accurate to a few percent.',
  ],
  background: [
    { title: 'Pressure units', text: '1 atm = 101.325 kPa = 760 mmHg = 1.01325 bar. 1 bar = 100 kPa. 1 Pa = 1 N/m².' },
    { title: 'Choosing R', text: 'R = 0.08206 L·atm/(mol·K) with P in atm and V in L; R = 8.314 J/(mol·K) = 8.314 L·kPa/(mol·K) with SI units. The units of R decide the units of P and V.' },
  ],
  definitions: [
    ['Pressure', 'Force per unit area, P = F/A. Gas pressure comes from molecular collisions with the walls.'],
    ['Absolute temperature', 'Kelvin scale: T(K) = T(°C) + 273.15. 0 K is absolute zero.'],
    ['Ideal gas', 'A model gas of point particles with no intermolecular forces; obeys PV = nRT exactly.'],
    ['STP', 'Standard temperature and pressure. The IUPAC definition is 273.15 K and 1 bar (molar volume 22.71 L); many textbooks still use 0 °C and 1 atm (22.41 L). Check which your course uses.'],
    ['Partial pressure', 'The pressure a gas in a mixture would exert if it alone occupied the whole volume.'],
    ['Effusion', 'Escape of gas through a tiny hole; lighter gases effuse faster (Graham’s law).'],
  ],
  symbols: [
    ['P', 'pressure', 'atm, kPa, bar'], ['V', 'volume', 'L or m³'], ['n', 'amount of gas', 'mol'], ['T', 'absolute temperature', 'K'],
    ['R', 'gas constant', '0.08206 L·atm/(mol·K) or 8.314 J/(mol·K)'], ['M', 'molar mass', 'g/mol (kg/mol in u_rms)'], ['χ_{i}', 'mole fraction of gas i', '—'],
  ],
  formulas: [
    { name: 'Ideal gas law', f: 'PV = nRT', when: 'Ideal behaviour (low to moderate pressure, not too cold); T in kelvin; units consistent with R.' },
    { name: 'Combined gas law', f: '{{P_{1}V_{1}|T_{1}}} = {{P_{2}V_{2}|T_{2}}}', when: 'Fixed amount of gas (n constant). Drop any variable that is also constant.' },
    { name: 'Density and molar mass', f: 'd = {{PM|RT}};   M = {{dRT|P}}', when: 'From PV = nRT with n = m/M. Units: d in g/L with R in L·atm/(mol·K) and P in atm.' },
    { name: 'Dalton’s law', f: 'P_{total} = P_{1} + P_{2} + …;   P_{i} = χ_{i}P_{total}', when: 'Ideal gases that do not react with each other.' },
    { name: 'Molecular speed and effusion', f: 'u_{rms} = √{{{3RT|M}}};   {{rate_{1}|rate_{2}}} = √{{{M_{2}|M_{1}}}}', when: 'u_rms with R = 8.314 J/(mol·K) and M in kg/mol. Graham’s law at the same T and P.' },
  ],
  derivation: {
    title: 'Where Boyle’s law comes from',
    intro: 'Start from PV = nRT and hold n and T constant.',
    steps: [
      ['The right side nRT is then a constant, call it k.', 'Nothing on the right changes.'],
      ['PV = k, so P = k/V: pressure is inversely proportional to volume.', 'Rearrange.'],
      ['For two states of the same sample: P_{1}V_{1} = P_{2}V_{2}.', 'Both equal k.'],
    ],
    end: 'Molecular picture: in half the volume the molecules hit each square metre of wall twice as often, so the pressure doubles.',
  },
  figure: { svg: fig, caption: 'At constant temperature, pressure and volume are inversely proportional: every point on the curve has PV = 6 bar·L. The graph is a hyperbola, not a straight line.' },
  table: {
    caption: 'Molar volume of an ideal gas',
    head: ['conditions', 'T', 'P', 'V_{m} = RT/P'],
    rows: [['0 °C, 1 atm (older “STP”)', '273.15 K', '1 atm', '22.41 L/mol'], ['0 °C, 1 bar (IUPAC STP)', '273.15 K', '1 bar', '22.71 L/mol'], ['25 °C, 1 atm', '298.15 K', '1 atm', '24.47 L/mol']],
  },
  method: {
    title: 'Gas-law problems',
    steps: [
      'Convert temperature to kelvin and choose pressure/volume units that match your value of R.',
      'If one sample changes conditions, use the combined gas law, cancelling constant variables.',
      'If you need n (or mass), use PV = nRT; for mass, n = m/M.',
      'For reactions producing gases: moles from stoichiometry, then V = nRT/P.',
      'For mixtures, find each partial pressure; for gas collected over water subtract the water vapour pressure.',
      'Check: does heating raise P (or V)? Does compressing raise P?',
    ],
  },
  examples: [
    {
      title: 'Boyle’s law',
      problem: 'An ideal gas at 2.0 bar occupies 3.0 L. At constant temperature it is compressed to 1.5 L. Find the new pressure.',
      steps: [['P_{2} = {{P_{1}V_{1}|V_{2}}} = {{2.0 × 3.0|1.5}} = 4.0 bar.', 'n and T constant.']],
      result: '4.0 bar.',
      meaning: 'Halving the volume doubled the pressure.',
    },
    {
      title: 'Heating a sealed container',
      problem: 'A rigid container holds gas at 100 kPa and 300 K. It is heated to 450 K. Find the pressure.',
      steps: [
        ['Constant V and n: {{P_{1}|T_{1}}} = {{P_{2}|T_{2}}}.', 'Gay-Lussac’s law.'],
        ['P_{2} = 100 × {{450|300}} = 150 kPa.', 'Temperatures in kelvin.'],
      ],
      result: '150 kPa.',
      meaning: 'Using °C (e.g. 27 °C → 177 °C) directly would wrongly predict a 6.6-fold increase. This is why aerosol cans must not be heated.',
    },
    {
      title: 'Moles in a cylinder',
      problem: 'A 50.0 L cylinder contains nitrogen at 15.0 atm and 25 °C. How many moles and what mass of N₂ does it hold?',
      steps: [
        ['n = {{PV|RT}} = {{15.0 × 50.0|0.08206 × 298.15}} = 30.7 mol.', 'T = 25 + 273.15 = 298.15 K.'],
        ['m = 30.7 × 28.02 = 859 g.', 'M(N₂) = 28.02 g/mol.'],
      ],
      result: '≈ 30.7 mol, about 0.86 kg of N₂.',
      meaning: 'At 15 atm the ideal-gas estimate is good to a few percent for nitrogen.',
    },
    {
      title: 'Molar mass from gas density',
      problem: 'An unknown gas has density 1.25 g/L at 0 °C and 1.00 atm. Find its molar mass.',
      steps: [['M = {{dRT|P}} = {{1.25 × 0.08206 × 273.15|1.00}} = 28.0 g/mol.', 'Rearranged ideal gas law.']],
      result: 'M ≈ 28.0 g/mol (consistent with N₂ or CO).',
      meaning: 'Gas density measurements are a classic way to identify gases.',
    },
    {
      title: 'Gas volume from a reaction',
      problem: 'What volume of CO₂ at 25 °C and 1.00 atm is produced when 10.0 g of CaCO₃ decomposes? CaCO₃(s) → CaO(s) + CO₂(g).',
      steps: [
        ['n(CaCO₃) = {{10.0|100.09}} = 0.0999 mol.', 'M(CaCO₃) = 100.09 g/mol.'],
        ['n(CO₂) = 0.0999 mol (1 : 1).', 'Mole ratio.'],
        ['V = {{nRT|P}} = {{0.0999 × 0.08206 × 298.15|1.00}} = 2.44 L.', 'Ideal gas law.'],
      ],
      result: '≈ 2.44 L of CO₂.',
      meaning: 'Coefficients give mole ratios; the gas law converts moles to volume.',
    },
    {
      title: 'Partial pressures',
      problem: 'A mixture contains 0.60 mol N₂ and 0.20 mol O₂ at a total pressure of 2.0 atm. Find each partial pressure.',
      steps: [
        ['χ(N₂) = {{0.60|0.80}} = 0.75; χ(O₂) = 0.25.', 'Mole fractions.'],
        ['P(N₂) = 0.75 × 2.0 = 1.5 atm; P(O₂) = 0.25 × 2.0 = 0.50 atm.', 'P_i = χ_i P_total.'],
      ],
      result: 'N₂ 1.5 atm, O₂ 0.50 atm (sum 2.0 atm).',
      meaning: 'Oxygen’s partial pressure, not the total pressure, controls how much oxygen dissolves in blood or water.',
    },
    {
      title: 'Graham’s law',
      problem: 'How many times faster does H₂ (M = 2.0 g/mol) effuse than O₂ (M = 32.0 g/mol)?',
      steps: [['{{rate(H_{2})|rate(O_{2})}} = √{{{32.0|2.0}}} = √{16} = 4.0.', 'Lighter molecules move faster at the same temperature.']],
      result: 'H₂ effuses 4.0 times as fast.',
      meaning: 'Rates depend on the square root of the mass ratio, not the ratio itself.',
    },
  ],
  mistakes: [
    ['Using °C in gas laws.', 'Always convert to kelvin.'],
    ['Mismatched units with R.', 'With 0.08206 use atm and L; with 8.314 use Pa and m³ (or kPa and L).'],
    ['Using 22.4 L/mol at any conditions.', 'That value applies only at 0 °C and 1 atm.'],
    ['Adding pressures of gases in different containers.', 'Dalton’s law applies to gases sharing the same volume.'],
    ['Forgetting to take the square root in Graham’s law.', 'Rate ratio = √(M₂/M₁).'],
  ],
  scope: [
    'Real-gas equations (van der Waals) are described qualitatively only.',
    'Speed distributions (Maxwell–Boltzmann) are introduced by name; only the rms speed is calculated.',
  ],
  checks: [
    ['boyle', 2 * 3 / 1.5, 4, 1e-12], ['heat', 100 * 450 / 300, 150, 1e-9], ['n N2', 15 * 50 / (0.08206 * 298.15), 30.7, 0.05],
    ['m N2', 15 * 50 / (0.08206 * 298.15) * 28.02, 859, 1], ['M', 1.25 * 0.08206 * 273.15, 28.0, 0.05],
    ['CO2 V', 10 / 100.09 * 0.08206 * 298.15, 2.44, 0.005], ['PN2', 0.75 * 2, 1.5, 1e-12], ['graham', Math.sqrt(16), 4, 0],
    ['Vm atm', 0.08206 * 273.15, 22.41, 0.01], ['Vm bar', 0.08314 * 273.15, 22.71, 0.01], ['Vm 25', 0.08206 * 298.15, 24.47, 0.01],
  ],
};
