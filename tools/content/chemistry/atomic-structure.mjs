import { svg, text, line, circle, vector } from '../svg.mjs';

// Nuclide symbol diagram: ²⁷₁₃Al³⁺ with labelled parts.
const fig = svg('chem-nuclide', { w: 500, h: 260, title: 'Reading a nuclide symbol: aluminium-27 ion with charge 3+', desc: 'The symbol Al with mass number 27 written top left, atomic number 13 bottom left and charge 3+ top right. Labels explain: mass number A = protons + neutrons = 27; atomic number Z = protons = 13; charge = protons − electrons = +3. So the ion has 13 protons, 14 neutrons and 10 electrons.' },
  text(190, 150, 'Al', { size: 64, anchor: 'middle', weight: 650 })
  + text(142, 102, '27', { size: 28, anchor: 'end', color: '#355b90' })
  + text(142, 168, '13', { size: 28, anchor: 'end', color: '#176e66' })
  + text(236, 102, '3+', { size: 28, color: '#b3412e' })
  + vector(60, 60, 112, 88, 'd', 1.8) + text(20, 40, 'mass number A = p + n', { size: 14, color: '#355b90' })
  + vector(60, 205, 112, 170, 'a', 1.8) + text(20, 226, 'atomic number Z = p', { size: 14, color: '#176e66' })
  + vector(330, 60, 272, 88, 'c', 1.8) + text(300, 40, 'charge = p − e', { size: 14, color: '#b3412e' })
  + line(296, 110, 296, 200, { color: '#e1e8e3', width: 1.5 })
  + text(306, 125, 'protons  p = 13', { size: 14 }) + text(306, 152, 'neutrons n = 27 − 13 = 14', { size: 14 }) + text(306, 179, 'electrons e = 13 − 3 = 10', { size: 14 }));

export default {
  summary: 'Atoms are made of protons, neutrons and electrons. Z (protons) fixes the element; A counts protons plus neutrons; the charge counts missing or extra electrons.',
  why: [
    'Every chemical property begins with atomic structure. The number of protons decides which element you have; the electrons decide how it bonds and reacts; the neutrons affect mass and nuclear stability. Isotopic masses give the atomic masses used in every mole calculation in chemistry and chemical engineering.',
  ],
  idea: [
    'An atom has a tiny, dense **nucleus** containing positively charged **protons** and uncharged **neutrons**, surrounded by negatively charged **electrons**. Almost all the mass is in the nucleus; almost all the volume is the space occupied by electrons. A nucleus is about 10^{−15} m across, an atom about 10^{−10} m — a factor of 100 000.',
    'The **atomic number Z** is the number of protons. It defines the element: every atom with 6 protons is carbon. The **mass number A** is the number of protons plus neutrons. A neutral atom has as many electrons as protons.',
    '**Isotopes** are atoms of the same element (same Z) with different numbers of neutrons (different A), for example carbon-12 and carbon-14. Isotopes have almost identical chemistry because chemistry is governed by electrons.',
    'An **ion** has gained or lost electrons; the number of protons never changes in a chemical reaction. A **cation** (positive) has lost electrons: Mg^{2+} has 12 protons and 10 electrons. An **anion** (negative) has gained electrons: Cl^{−} has 17 protons and 18 electrons.',
    'The atomic mass printed on the periodic table is a **weighted average** of the masses of the naturally occurring isotopes, weighted by their abundances. That is why chlorine’s atomic mass is 35.45 u even though no chlorine atom has that mass.',
  ],
  background: [
    { title: 'Charges and signs', text: 'A proton has charge +1 (in units of e = 1.602 × 10^{−19} C), an electron −1. Net charge = (number of protons) − (number of electrons).' },
    { title: 'Weighted average', text: 'A weighted average multiplies each value by its fraction (abundance/100) and adds: Σ(fraction × value). The fractions must add to 1.' },
  ],
  definitions: [
    ['Atomic number Z', 'Number of protons in the nucleus; identifies the element.'],
    ['Mass number A', 'Number of protons + neutrons (a whole number). Neutrons n = A − Z.'],
    ['Isotopes', 'Atoms with the same Z but different A (different numbers of neutrons).'],
    ['Ion', 'An atom or group of atoms with a net charge due to gained or lost electrons. Cation: positive; anion: negative.'],
    ['Atomic mass unit (u)', '1/12 of the mass of a carbon-12 atom, 1.6605 × 10^{−27} kg. Proton and neutron masses are each about 1 u; an electron is about 1/1836 u.'],
    ['Average atomic mass', 'Abundance-weighted average of isotope masses, as printed on the periodic table.'],
  ],
  symbols: [
    ['Z', 'atomic number (protons)', '—'], ['A', 'mass number (protons + neutrons)', '—'], ['n', 'number of neutrons', '—'],
    ['^{A}_{Z}X^{q}', 'nuclide symbol: element X with mass number A, atomic number Z, charge q', '—'], ['u', 'atomic mass unit', '1.6605 × 10⁻²⁷ kg'],
  ],
  formulas: [
    { name: 'Neutrons', f: 'n = A − Z', when: 'A is the mass number of a specific isotope, not the average atomic mass.' },
    { name: 'Electrons in an ion', f: 'electrons = Z − q', when: 'q is the charge with its sign: Mg^{2+} (q = +2) has 12 − 2 = 10; Cl^{−} (q = −1) has 17 + 1 = 18.' },
    { name: 'Average atomic mass', f: 'M_{avg} = Σ (fractional abundance × isotopic mass)', when: 'Abundances as fractions that add to 1 (divide percentages by 100).' },
  ],
  derivation: {
    title: 'Why chlorine’s atomic mass is 35.45 u',
    intro: 'Natural chlorine is 75.78% chlorine-35 (34.969 u) and 24.22% chlorine-37 (36.966 u).',
    steps: [
      ['0.7578 × 34.969 = 26.50 u.', 'Contribution of Cl-35.'],
      ['0.2422 × 36.966 = 8.953 u.', 'Contribution of Cl-37.'],
      ['Sum: 26.50 + 8.953 = 35.45 u.', 'The weighted average.'],
    ],
    end: 'The average lies closer to 35 because Cl-35 is about three times as abundant. No individual chlorine atom has mass 35.45 u.',
  },
  figure: { svg: fig, caption: 'Reading ²⁷₁₃Al³⁺: 13 protons (so aluminium), 14 neutrons and, because the charge is 3+, three fewer electrons than protons: 10.' },
  table: {
    caption: 'Counting particles',
    head: ['species', 'Z (protons)', 'A', 'neutrons', 'electrons'],
    rows: [['²³Na', '11', '23', '12', '11'], ['²³Na⁺', '11', '23', '12', '10'], ['³⁵Cl⁻', '17', '35', '18', '18'], ['²⁴Mg²⁺', '12', '24', '12', '10'], ['¹⁶O²⁻', '8', '16', '8', '10'], ['¹⁴C', '6', '14', '8', '6']],
    note: 'Na⁺, Mg²⁺ and O²⁻ all have 10 electrons: they are isoelectronic with neon, but they are different elements because their proton numbers differ.',
  },
  method: {
    title: 'How to count particles',
    steps: [
      'Find Z from the element symbol (periodic table): protons = Z.',
      'Neutrons = A − Z, using the mass number of the stated isotope.',
      'Electrons = Z − charge (subtract a positive charge, add the size of a negative charge).',
      'For average atomic mass, convert percentages to fractions and form Σ(fraction × mass).',
      'Check: a cation has fewer electrons than protons; an anion has more.',
    ],
  },
  examples: [
    {
      title: 'Neutrons in an isotope',
      problem: 'An atom has mass number 23 and atomic number 11. How many neutrons does it have, and what element is it?',
      steps: [
        ['n = A − Z = 23 − 11 = 12.', 'Mass number counts protons and neutrons.'],
        ['Z = 11 is sodium.', 'The proton number identifies the element.'],
      ],
      result: '12 neutrons; the atom is sodium-23.',
      meaning: 'Any atom with 11 protons is sodium, whatever its neutron number.',
    },
    {
      title: 'Electrons in an ion',
      problem: 'How many electrons are in Mg^{2+} (Z = 12) and in S^{2−} (Z = 16)?',
      steps: [
        ['Mg^{2+}: 12 − 2 = 10 electrons.', 'A 2+ charge means two electrons fewer than protons.'],
        ['S^{2−}: 16 + 2 = 18 electrons.', 'A 2− charge means two extra electrons.'],
      ],
      result: 'Mg^{2+}: 10 electrons; S^{2−}: 18 electrons.',
      meaning: 'Ionisation never changes the proton number or the element.',
    },
    {
      title: 'Average atomic mass',
      problem: 'Boron is 19.9% ¹⁰B (10.013 u) and 80.1% ¹¹B (11.009 u). Find its average atomic mass.',
      steps: [
        ['0.199 × 10.013 + 0.801 × 11.009.', 'Weighted average with fractional abundances.'],
        ['= 1.993 + 8.818 = 10.81 u.', 'Add the contributions.'],
      ],
      result: '10.81 u (as on the periodic table).',
      meaning: 'The average is closer to 11 because boron-11 is about four times more abundant.',
    },
    {
      title: 'Abundance from the average mass',
      problem: 'Copper has isotopes ⁶³Cu (62.930 u) and ⁶⁵Cu (64.928 u); its average atomic mass is 63.546 u. Find the abundance of ⁶³Cu.',
      steps: [
        ['Let x be the fraction of ⁶³Cu; then 1 − x is ⁶⁵Cu.', 'Two isotopes whose fractions add to 1.'],
        ['62.930x + 64.928(1 − x) = 63.546.', 'Weighted-average equation.'],
        ['64.928 − 1.998x = 63.546 ⇒ x = {{1.382|1.998}} = 0.692.', 'Solve for x.'],
      ],
      result: 'About 69.2% ⁶³Cu (and 30.8% ⁶⁵Cu).',
      meaning: 'The accepted natural abundance of ⁶³Cu is 69.15%, which agrees.',
    },
  ],
  mistakes: [
    ['Using the periodic-table atomic mass as A to find neutrons.', 'A is a whole number for a specific isotope. Chlorine’s 35.45 is an average, not a mass number.'],
    ['Changing the number of protons when an ion forms.', 'Only electrons are gained or lost in chemical changes.'],
    ['Adding electrons for a positive charge.', 'Positive means electrons were lost: electrons = Z − (positive charge).'],
    ['“Isotopes are different elements.”', 'Isotopes have the same Z, so they are the same element with different masses.'],
  ],
  scope: [
    'Nuclear reactions and radioactive decay are not part of this topic (see “Beyond Semester 1” in the collections).',
    'Electron arrangement in atoms is developed in “Quantum theory” and “Periodic table”.',
  ],
  checks: [
    ['Cl', 0.7578 * 34.969 + 0.2422 * 36.966, 35.45, 0.005], ['B', 0.199 * 10.013 + 0.801 * 11.009, 10.81, 0.005],
    ['Cu x', (64.928 - 63.546) / (64.928 - 62.930), 0.692, 0.0005], ['Na n', 23 - 11, 12, 0], ['S2-', 16 + 2, 18, 0], ['Al e', 13 - 3, 10, 0],
  ],
};
