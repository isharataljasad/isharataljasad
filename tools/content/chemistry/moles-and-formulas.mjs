// Promoted from tools/content/support/amount-and-formulas.mjs (Codex, aa7c04c).
// Placed before Reactions in solution, which depends on moles and molar mass.
import s from '../support/amount-and-formulas.mjs';
export default {
  ...s,
  title: 'Moles, molar mass and chemical formulas',
  summary: 'The mole links the particles in a formula to the grams on a balance: n = m/M and N = nN_{A}. Formulas give atom ratios, percentage composition and empirical formulas.',
  why: [s.intro, 'Reaction stoichiometry, solution concentrations and gas amounts are all expressed in moles. This lesson is the bridge from formulas to every later calculation.'],
  idea: s.ideas,
  background: [
    { title: 'Reading a formula', text: 'Subscripts count atoms in one formula unit; parentheses multiply a group (see Writing formulas and naming compounds).' },
    { title: 'Measurement and units', text: 'Carry units through every step (g ÷ g/mol = mol) and round only the final answer to the least precise measurement. Mass is measured on a balance in grams; volumes in mL or L.' },
    { title: 'Average atomic mass', text: 'Periodic-table atomic masses are isotope-weighted averages (see Atomic structure); they are the values used for molar masses.' },
  ],
  method: { title: 'Mass, moles and particles', steps: [
    'Name the entity (atoms, molecules, formula units, ions).',
    'Find the molar mass from the formula: sum of (atom count × atomic molar mass).',
    'Convert grams → moles with n = m/M, moles → entities with N = nN_{A}; reverse as needed.',
    'For composition: mass of element in one mole ÷ molar mass × 100%. For an empirical formula: grams → moles for each element, divide by the smallest, clear fractions.',
  ] },
  scope: ['Combustion analysis and hydrate formulas are not treated. Stoichiometry in reactions continues in Reactions in solution.'],
};
