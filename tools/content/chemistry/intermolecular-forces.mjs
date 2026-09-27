// Promoted from tools/content/support/intermolecular-forces.mjs (Codex, aa7c04c).
// Placed after Chemical bonding (it needs polarity) and before Properties of solutions.
import s from '../support/intermolecular-forces.mjs';
export default {
  ...s,
  summary: 'Forces between molecules — dispersion, dipole–dipole, hydrogen bonding and ion–dipole — decide boiling points, phase changes and which substances mix.',
  why: [s.intro, 'These attractions explain the properties chemical engineers use daily: boiling points for distillation, why water dissolves salts, and why oil and water separate.'],
  idea: s.ideas,
  background: [
    { title: 'Polarity from bonding', text: 'A molecule is polar when its bond dipoles do not cancel (see Chemical bonding). Electronegativity differences create bond dipoles; molecular shape decides whether they add or cancel.' },
    { title: 'Covalent bond versus attraction between molecules', text: 'Breaking a covalent bond changes the substance; overcoming an intermolecular attraction (boiling, dissolving) does not.' },
  ],
  method: { title: 'How to compare intermolecular forces', steps: [
    'List the particles present (molecules or ions) and decide whether each molecule is polar.',
    'Every molecule has dispersion forces; they grow with the number of electrons and with larger, more elongated molecules.',
    'Add dipole–dipole forces for polar molecules, hydrogen bonding when H is bonded to N, O or F and an N/O/F lone pair is available, ion–dipole forces for ions in polar solvents.',
    'Compare like with like (similar molar mass) before concluding; state the prediction as a tendency.',
  ] },
  scope: ['Qualitative comparisons only; vapour-pressure equations (Clausius–Clapeyron) and phase diagrams are not developed here. Check your outline.'],
};
