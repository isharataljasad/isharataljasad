import { svg, rect, text, vector, circle } from '../svg.mjs';

// Dilution: same moles of solute in a larger volume.
const beaker = (x, w, h, fillH, n, label1, label2) => {
  let s = rect(x, 200 - fillH, w, fillH, { fill: '#d8e0ef', stroke: 'none', rx: 0 }) + `<path d="M${x},${200 - h} L${x},200 L${x + w},200 L${x + w},${200 - h}" fill="none" stroke="#183b3f" stroke-width="2.5"/>`;
  // solute particles, deterministic positions
  for (let i = 0; i < n; i++) s += circle(x + 12 + ((i * 37) % (w - 24)), 196 - 8 - ((i * 53) % (fillH - 16)), 4.5, { fill: '#b3412e' });
  return s + text(x + w / 2, 225, label1, { anchor: 'middle', size: 14 }) + text(x + w / 2, 245, label2, { anchor: 'middle', size: 13, color: '#5e7376' });
};
const fig = svg('chem-dilute', { w: 500, h: 260, title: 'Dilution keeps the amount of solute and increases the volume', desc: 'Left beaker: 0.20 L of 1.5 M solution containing 0.30 mol of solute, shown as 12 closely spaced dots. Right beaker: after adding water to 0.60 L, the same 12 dots are spread through three times the volume, so the concentration is 0.50 M.' },
  beaker(40, 120, 150, 50, 12, '0.20 L of 1.5 M', 'n = 0.30 mol') + vector(185, 150, 290, 150, 'a', 2.5) + text(237, 138, 'add water', { anchor: 'middle', size: 13, color: '#176e66' })
  + beaker(310, 150, 170, 150, 12, '0.60 L of 0.50 M', 'n = 0.30 mol (unchanged)') + text(250, 30, 'c₁V₁ = c₂V₂: moles of solute before = after', { anchor: 'middle', size: 14, color: '#183b3f' }));

export default {
  summary: 'A solution’s composition is described by concentration units (molarity, molality, mass percent, mole fraction). Dilution conserves solute. Dissolved particles lower vapour pressure and freezing point and raise boiling point and osmotic pressure.',
  why: [
    'Chemical engineers prepare, mix and separate solutions constantly: making reagents to a specified concentration, diluting stock solutions, predicting how much gas dissolves in a liquid under pressure, protecting engines with antifreeze, and understanding osmosis in membranes and water purification. Choosing the right concentration unit for the job avoids serious errors.',
  ],
  idea: [
    'A solution is a homogeneous mixture: a **solute** dissolved in a **solvent**. Whether something dissolves depends on the balance between the attractions broken (solute–solute, solvent–solvent) and those formed (solute–solvent): “like dissolves like” — polar and ionic substances dissolve in polar solvents such as water; non-polar substances in non-polar solvents.',
    'A **saturated** solution holds the maximum amount of solute at that temperature and is in equilibrium with undissolved solid. Stirring speeds up dissolving but does not change how much can dissolve. Most solids become more soluble in hot water (not all); gases become **less** soluble as temperature rises, but **more** soluble at higher partial pressure (Henry’s law) — the reason carbonated drinks fizz when opened.',
    'Concentration can be expressed in several ways. **Molarity** (mol per litre of solution) is convenient for measuring volumes in the lab, but changes slightly with temperature because volume does. **Molality** (mol per kilogram of solvent) does not change with temperature and is used for freezing- and boiling-point calculations. Mass percent and mole fraction are also common.',
    'When a solution is **diluted**, solvent is added but the moles of solute do not change: c_{1}V_{1} = c_{2}V_{2}.',
    '**Colligative properties** depend on the number of dissolved particles, not their identity. A non-volatile solute lowers the solvent’s vapour pressure, so the solution boils at a higher temperature and freezes at a lower one; it also creates osmotic pressure across a semipermeable membrane. Ionic solutes give more particles: NaCl gives about 2 per formula unit (the van ’t Hoff factor i ≈ 2), CaCl₂ about 3, glucose 1. Real values of i are slightly lower than ideal because ions interact.',
  ],
  background: [
    { title: 'Moles and molar mass', text: 'n = m/M; M(NaCl) = 58.44 g/mol, M(glucose, C₆H₁₂O₆) = 180.16 g/mol.' },
    { title: 'Intermolecular attractions', text: 'Hydrogen bonding, dipole–dipole and dispersion forces decide which substances mix (see Intermolecular forces, phases and solubility).' },
  ],
  definitions: [
    ['Molarity c (M)', 'Moles of solute per litre of solution: c = n/V.'],
    ['Molality m', 'Moles of solute per kilogram of solvent: m = n_{solute}/m_{solvent} (mol/kg).'],
    ['Mass percent', '{{mass of solute|mass of solution}} × 100%.'],
    ['Mole fraction χ', 'χ_{A} = n_{A}/n_{total}; the mole fractions of all components add to 1.'],
    ['Saturated solution', 'A solution in equilibrium with undissolved solute; its concentration is the solubility at that temperature.'],
    ['Colligative property', 'A property depending on the number of solute particles: vapour-pressure lowering, boiling-point elevation, freezing-point depression, osmotic pressure.'],
    ['van ’t Hoff factor i', 'Number of particles produced per formula unit dissolved (ideal: glucose 1, NaCl 2, CaCl₂ 3).'],
  ],
  symbols: [
    ['c or M', 'molarity', 'mol/L'], ['m', 'molality (not mass!)', 'mol/kg solvent'], ['χ', 'mole fraction', '—'], ['K_{f}, K_{b}', 'freezing and boiling constants (water: 1.86 and 0.512)', '°C·kg/mol'],
    ['Π', 'osmotic pressure', 'atm (or Pa)'], ['k_{H}', 'Henry’s law constant', 'mol/(L·atm)'], ['R', 'gas constant, 0.08206', 'L·atm/(mol·K)'],
  ],
  formulas: [
    { name: 'Molarity and dilution', f: 'c = {{n|V}};   c_{1}V_{1} = c_{2}V_{2}', when: 'V is the volume of solution. Dilution: only solvent added, no reaction.' },
    { name: 'Molality', f: 'm = {{n_{solute}|mass of solvent (kg)}}', when: 'Divide by the solvent’s mass, not the solution’s.' },
    { name: 'Henry’s law', f: 'c_{gas} = k_{H}P_{gas}', when: 'Dilute gas solubility at constant temperature; P is the partial pressure of that gas. Some books define the constant the other way round (P = k c); check units.' },
    { name: 'Raoult’s law', f: 'P_{solvent} = χ_{solvent}P°_{solvent}', when: 'Ideal solution; non-volatile solute.' },
    { name: 'Boiling and freezing points', f: 'ΔT_{b} = iK_{b}m;   ΔT_{f} = iK_{f}m', when: 'Dilute solutions; m is molality; ΔT is the size of the change (boiling point rises, freezing point falls).' },
    { name: 'Osmotic pressure', f: 'Π = iMRT', when: 'Dilute solutions; M molarity, T in kelvin, R = 0.08206 L·atm/(mol·K).' },
  ],
  derivation: {
    title: 'Why dilution obeys c₁V₁ = c₂V₂',
    intro: 'Take V₁ litres of a solution of molarity c₁ and add water to a total volume V₂.',
    steps: [
      ['Moles of solute before: n = c_{1}V_{1}.', 'Definition of molarity.'],
      ['Adding solvent adds no solute: n is unchanged.', 'Conservation of the solute.'],
      ['After: n = c_{2}V_{2}. So c_{1}V_{1} = c_{2}V_{2}.', 'Equate the two expressions for n.'],
    ],
    end: 'V₁ and V₂ may be in any volume unit, as long as it is the same on both sides.',
  },
  figure: { svg: fig, caption: 'Diluting 0.20 L of 1.5 M solution to 0.60 L: the 0.30 mol of solute spreads through three times the volume, so the concentration drops to one third, 0.50 M.' },
  table: {
    caption: 'Freezing-point depression of water for different solutes (m = 0.10 mol/kg, ideal i)',
    head: ['solute', 'particles per formula', 'i', 'ΔT_{f} = iK_{f}m (°C)', 'freezing point (°C)'],
    rows: [['glucose C₆H₁₂O₆', '1 molecule', '1', '0.186', '−0.186'], ['NaCl', 'Na⁺ + Cl⁻', '2', '0.372', '−0.372'], ['CaCl₂', 'Ca²⁺ + 2Cl⁻', '3', '0.558', '−0.558']],
    note: 'Measured depressions for NaCl and CaCl₂ are slightly smaller than these ideal values, because oppositely charged ions associate in solution.',
  },
  method: {
    title: 'Solution calculations',
    steps: [
      'Identify which concentration unit the problem needs (molarity for volumes and reactions; molality for ΔT_{b}, ΔT_{f}; mole fraction for Raoult).',
      'Convert masses to moles and volumes to litres (or solvent masses to kg).',
      'For dilution use c₁V₁ = c₂V₂; for colligative properties decide i from the formula of the solute.',
      'Substitute, keeping units, and check whether the answer is a change (ΔT) or a final value (T).',
    ],
  },
  examples: [
    {
      title: 'Molarity',
      problem: 'Find the molarity of 0.30 mol of solute in 0.50 L of solution, and of 5.85 g NaCl in 250 mL of solution.',
      steps: [
        ['c = {{0.30|0.50}} = 0.60 M.', 'c = n/V.'],
        ['n(NaCl) = {{5.85|58.44}} = 0.100 mol; c = {{0.100|0.250}} = 0.400 M.', 'Convert grams to moles and mL to L.'],
      ],
      result: '0.60 M and 0.400 M.',
      meaning: 'To prepare the NaCl solution, dissolve 5.85 g and make up to 250 mL in a volumetric flask (not add 250 mL of water).',
    },
    {
      title: 'Dilution',
      problem: 'A 0.20 L sample of 1.5 M solution is diluted to 0.60 L. Find the final concentration.',
      steps: [['c_{2} = {{c_{1}V_{1}|V_{2}}} = {{1.5 × 0.20|0.60}} = 0.50 M.', 'Moles of solute are conserved.']],
      result: '0.50 M.',
      meaning: 'Tripling the volume divides the concentration by three.',
    },
    {
      title: 'Preparing a dilute solution from a stock',
      problem: 'What volume of 12.0 M HCl is needed to make 500 mL of 0.600 M HCl?',
      steps: [
        ['V_{1} = {{c_{2}V_{2}|c_{1}}} = {{0.600 × 500 mL|12.0}} = 25.0 mL.', 'Same unit (mL) on both sides.'],
        ['Add the 25.0 mL of acid to water, then make up to 500 mL.', 'Safety: always add acid to water.'],
      ],
      result: '25.0 mL of the stock solution.',
      meaning: 'Diluting concentrated acid releases heat; adding it slowly to water avoids splattering.',
    },
    {
      title: 'Antifreeze: freezing-point depression',
      problem: 'Dissolve 0.10 mol glucose in 0.50 kg of water (K_{f} = 1.86 °C·kg/mol). Find the freezing point.',
      steps: [
        ['m = {{0.10 mol|0.50 kg}} = 0.20 mol/kg.', 'Molality: divide by the solvent mass.'],
        ['ΔT_{f} = iK_{f}m = 1 × 1.86 × 0.20 = 0.372 °C.', 'Glucose does not ionise: i = 1.'],
        ['T_{f} = 0 − 0.372 = −0.372 °C.', 'The freezing point is lowered from 0 °C.'],
      ],
      result: 'Freezing point ≈ −0.37 °C.',
      meaning: 'Using 0.10 mol NaCl instead would give about −0.74 °C (i ≈ 2).',
    },
    {
      title: 'Henry’s law',
      problem: 'At 25 °C, k_{H} for CO₂ in water is 3.4 × 10^{−2} mol/(L·atm). Find the CO₂ solubility at a CO₂ partial pressure of 2.5 atm (a sealed soft drink), and at 4.0 × 10^{−4} atm (open air).',
      steps: [
        ['Sealed: c = 3.4 × 10^{−2} × 2.5 = 0.085 M.', 'c = k_H P.'],
        ['Open air: c = 3.4 × 10^{−2} × 4.0 × 10^{−4} = 1.4 × 10^{−5} M.', 'Much lower partial pressure.'],
      ],
      result: '0.085 M sealed; 1.4 × 10^{−5} M in open air.',
      meaning: 'Opening the bottle lowers the CO₂ pressure, so gas comes out of solution as bubbles.',
    },
    {
      title: 'Osmotic pressure',
      problem: 'Find the osmotic pressure of 0.10 M glucose at 25 °C.',
      steps: [['Π = iMRT = 1 × 0.10 × 0.08206 × 298 = 2.45 atm.', 'T in kelvin: 25 + 273 = 298 K.']],
      result: 'Π ≈ 2.4 atm.',
      meaning: 'Even dilute solutions produce large osmotic pressures; reverse osmosis must exceed them to push water out.',
    },
  ],
  mistakes: [
    ['Confusing molality with molarity.', 'Molality divides by kg of solvent; molarity by litres of solution.'],
    ['Dividing by the volume of water added rather than the final solution volume.', 'Molarity uses the total solution volume.'],
    ['Forgetting i for ionic solutes.', 'NaCl gives about twice, CaCl₂ about three times, the effect of a non-electrolyte.'],
    ['Reporting ΔT_f as the freezing point.', 'The freezing point is 0 °C − ΔT_f for water.'],
    ['“Stirring increases solubility.”', 'It speeds dissolving but does not change the equilibrium amount.'],
  ],
  scope: [
    'Colligative formulas are for dilute, near-ideal solutions; concentrated and non-ideal solutions need activity coefficients.',
    'Solubility equilibria (K_{sp}) are not covered in these lessons; check your outline.',
  ],
  checks: [
    ['c', 0.3 / 0.5, 0.6, 1e-12], ['NaCl mol', 5.85 / 58.44, 0.1, 0.0005], ['NaCl c', 5.85 / 58.44 / 0.25, 0.4, 0.002],
    ['dilute', 1.5 * 0.2 / 0.6, 0.5, 1e-12], ['stock', 0.6 * 500 / 12, 25, 1e-9], ['dTf', 1.86 * 0.2, 0.372, 1e-9],
    ['henry', 3.4e-2 * 2.5, 0.085, 1e-12], ['henry air', 3.4e-2 * 4e-4, 1.4e-5, 0.05e-5], ['osm', 0.1 * 0.08206 * 298, 2.45, 0.005],
    ['table CaCl2', 3 * 1.86 * 0.1, 0.558, 1e-9],
  ],
};
