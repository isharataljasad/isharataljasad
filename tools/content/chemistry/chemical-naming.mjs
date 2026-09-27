// Promoted from tools/content/support/chemical-naming.mjs (Codex, aa7c04c).
// Placed after Intermolecular forces and before Moles and formulas, where formulas are first used in calculations.
import s from '../support/chemical-naming.mjs';
import { svg, box, text, line, COLORS } from '../svg.mjs';

const cation = (x) => box(x, 50, 92, 56, ['Al³⁺', '+3'], { fill: '#e8f1f7', stroke: COLORS.d });
const anion = (x) => box(x, 50, 92, 56, ['SO₄²⁻', '−2'], { fill: '#f7ece2', stroke: COLORS.b });
const chargeFigure = svg('chem-naming-balance', { w: 560, h: 250, title: 'Charge balance in aluminium sulfate', desc: 'Two aluminium ions, each +3, give +6. Three sulfate ions, each −2, give −6. The total charge is zero, so the formula is Al₂(SO₄)₃ with parentheses around each complete sulfate ion.' },
  text(122, 32, 'cations', { anchor: 'middle', color: COLORS.muted }) + text(398, 32, 'anions', { anchor: 'middle', color: COLORS.muted }) +
  cation(24) + cation(128) + anion(248) + anion(352) + anion(456) +
  line(24, 132, 220, 132, { color: COLORS.d }) + line(248, 132, 548, 132, { color: COLORS.b }) +
  text(122, 156, '2 × (+3) = +6', { anchor: 'middle', color: COLORS.d, weight: 650 }) + text(398, 156, '3 × (−2) = −6', { anchor: 'middle', color: COLORS.b, weight: 650 }) +
  text(280, 196, 'total charge: +6 + (−6) = 0', { anchor: 'middle' }) +
  text(280, 228, 'formula: Al₂(SO₄)₃ — the sulfate ion stays intact', { anchor: 'middle', weight: 650 }));

export default {
  ...s,
  summary: 'Write formulas from ion charges and name ionic and molecular compounds so that the formula, the name and the charges always agree.',
  why: [s.intro, 'Every calculation that follows — moles, reactions in solution, gases — starts from a correct formula. A wrong subscript gives a wrong molar mass and a wrong mole ratio.'],
  idea: s.ideas,
  figure: { svg: chargeFigure, caption: 'Choose the smallest numbers of complete ions whose charges add to zero. Here 2 × (+3) balances 3 × (−2), giving Al₂(SO₄)₃.' },
  background: [
    { title: 'Ion charges from the periodic table', text: 'Main-group metals lose electrons to reach a noble-gas configuration: group 1 → 1+, group 2 → 2+, Al → 3+. Non-metals gain electrons: group 17 → 1−, group 16 → 2−, N → 3− (see Periodic table and Chemical bonding).' },
    { title: 'Ionic versus molecular', text: 'A metal with a non-metal (or a polyatomic ion such as NH₄⁺) usually forms an ionic compound; two non-metals form a molecular compound.' },
  ],
  method: { title: 'From name to formula and back', steps: [
    'Decide ionic or molecular.',
    'Ionic: write the cation and anion with their charges; choose the smallest numbers of each ion that make the total charge zero; keep polyatomic ions in parentheses when more than one is needed.',
    'Ionic name: cation name (with a Roman numeral for variable-charge metals) + anion name (-ide for single-element anions).',
    'Molecular: use prefixes for atom counts (omit mono- on the first element); do not reduce the formula.',
  ] },
  scope: ['Organic nomenclature and complex-ion names are outside Semester 1.'],
};
