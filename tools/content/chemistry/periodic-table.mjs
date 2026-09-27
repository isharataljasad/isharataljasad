import { svg, rect, text, vector } from '../svg.mjs';

// Schematic periodic table blocks with trend arrows.
const cell = 22, ox = 40, oy = 40;
const blockCells = [];
const add = (col, row, fill) => blockCells.push(rect(ox + col * cell, oy + row * cell, cell - 2, cell - 2, { fill, stroke: 'none', rx: 2 }));
for (let r = 0; r < 7; r++) {
  add(0, r, '#cfe3dc'); if (r > 0) add(1, r, '#cfe3dc');
  if (r >= 3) for (let c = 2; c < 12; c++) add(c, r, '#f1e2cc');
  if (r >= 1) for (let c = 12; c < 18; c++) add(c, r, '#d8e0ef');
}
add(17, 0, '#d8e0ef');
const fig = svg('chem-trends', { w: 500, h: 300, title: 'Periodic trends in atomic radius and ionisation energy', desc: 'A schematic periodic table with the s-block (teal, left), d-block (tan, middle) and p-block (blue, right). An arrow pointing right along the top says ionisation energy and electronegativity increase across a period and atomic radius decreases. An arrow pointing down the left side says atomic radius increases down a group and ionisation energy decreases.' },
  blockCells.join('')
  + text(ox + cell, oy + 7 * cell + 18, 's-block', { anchor: 'middle', size: 13, color: '#176e66' })
  + text(ox + 7 * cell, oy + 7 * cell + 18, 'd-block (transition metals)', { anchor: 'middle', size: 13, color: '#9b6328' })
  + text(ox + 15 * cell, oy + 7 * cell + 18, 'p-block', { anchor: 'middle', size: 13, color: '#355b90' })
  + vector(ox + 2 * cell, 22, ox + 12 * cell, 22, 'c', 2.5) + text(ox + 2 * cell, 14, 'across a period →: ionisation energy and electronegativity ↑, radius ↓', { size: 12, color: '#b3412e' })
  + vector(22, oy + 10, 22, oy + 6 * cell, 'd', 2.5) + text(10, oy + 7 * cell + 40, 'down a group: radius ↑, ionisation energy ↓', { size: 12, color: '#355b90' }));

export default {
  summary: 'Electron configurations follow from filling orbitals in order of energy. The periodic table groups elements with similar outer electrons, and effective nuclear charge explains the trends in size, ionisation energy and electronegativity.',
  why: [
    'The periodic table is chemistry’s map. From an element’s position you can predict its outer electrons, the ions it forms, how reactive it is, whether it is a metal, and what kind of bonds it makes. These predictions guide material selection, corrosion behaviour and reaction design in chemical engineering.',
  ],
  idea: [
    'Electrons fill orbitals from the lowest energy upward (the **Aufbau principle**): 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, … Each orbital holds at most two electrons with opposite spins (**Pauli exclusion principle**). Within a subshell of equal-energy orbitals, electrons occupy separate orbitals with parallel spins before pairing (**Hund’s rule**).',
    'The **valence electrons** (outermost shell) govern chemistry. Elements in the same group have the same valence configuration — for example ns^{1} for the alkali metals — and therefore similar properties. The table’s blocks show which subshell is being filled: s, p, d or f.',
    'The key to the trends is **effective nuclear charge** Z_{eff}: the positive charge an outer electron actually feels, less than Z because inner electrons shield it. Across a period, Z increases while the added electrons are in the same shell and shield each other poorly, so Z_{eff} increases: the atoms become smaller and hold their electrons more tightly. Down a group, a new, larger shell is added each period, so atoms get bigger and outer electrons are easier to remove.',
    'So **atomic radius** decreases across a period and increases down a group; **ionisation energy** (energy to remove an electron) and **electronegativity** (pull on bonding electrons) increase across and decrease down. Small exceptions have clear reasons: ionisation energy drops from Be to B (the 2p electron is higher in energy than 2s) and from N to O (pairing repulsion in O’s 2p).',
    'Ions: cations are smaller than their atoms (fewer electrons, sometimes a whole shell removed); anions are larger. When transition metals form ions they lose their 4s electrons before 3d: Fe is [Ar]3d^{6}4s^{2}, Fe^{2+} is [Ar]3d^{6}.',
  ],
  background: [
    { title: 'Quantum numbers and subshells', text: 'Shell n contains subshells s, p, d, … with 1, 3, 5, … orbitals (see Quantum theory). Each orbital holds two electrons.' },
    { title: 'Noble-gas shorthand', text: 'Write the preceding noble gas in brackets for the core: Na = [Ne]3s^{1}.' },
  ],
  definitions: [
    ['Electron configuration', 'The distribution of electrons among orbitals, e.g. O: 1s^{2}2s^{2}2p^{4}.'],
    ['Valence electrons', 'Electrons in the outermost shell (for main-group elements: the ns and np electrons).'],
    ['Effective nuclear charge Z_{eff}', 'The net positive charge felt by an electron after shielding by other electrons; roughly Z − (number of core electrons) for valence electrons.'],
    ['Ionisation energy (IE)', 'Energy required to remove an electron from a gaseous atom or ion: X(g) → X^{+}(g) + e^{−}. Successive IEs increase.'],
    ['Electronegativity', 'The ability of an atom in a molecule to attract bonding electrons (Pauling scale: F = 3.98 highest).'],
    ['Paramagnetic / diamagnetic', 'Having unpaired electrons (attracted by a magnetic field) / all electrons paired (weakly repelled).'],
  ],
  symbols: [
    ['nℓ^{x}', 'x electrons in subshell ℓ of shell n (e.g. 2p⁴)', '—'], ['Z_{eff}', 'effective nuclear charge', 'proton charges'], ['IE_{1}, IE_{2}', 'first, second ionisation energies', 'kJ/mol'], ['χ', 'electronegativity', 'no unit'],
  ],
  formulas: [
    { name: 'Filling order', f: '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p …', when: 'Ground states of most atoms. Exceptions include Cr ([Ar]3d⁵4s¹) and Cu ([Ar]3d¹⁰4s¹).' },
    { name: 'Capacity', f: 's: 2,  p: 6,  d: 10,  f: 14 electrons', when: 'Each orbital holds 2 electrons of opposite spin (Pauli).' },
    { name: 'Valence effective charge (estimate)', f: 'Z_{eff} ≈ Z − (core electrons)', when: 'A rough guide for comparing main-group atoms; refined models (Slater’s rules) are beyond this topic.' },
    { name: 'Ion formation, transition metals', f: 'remove ns before (n − 1)d', when: 'Fe → Fe^{2+}: remove the two 4s electrons.' },
  ],
  derivation: {
    title: 'Why a large jump in ionisation energy reveals the valence electrons',
    intro: 'Magnesium ([Ne]3s²) has IE₁ = 738, IE₂ = 1451 and IE₃ = 7733 kJ/mol.',
    steps: [
      ['IE₁ and IE₂ remove the two 3s valence electrons.', 'Each removal is harder because the ion becomes more positive.'],
      ['IE₃ must remove an electron from the 2p core, much closer to the nucleus with far less shielding.', 'A new, inner shell.'],
      ['So IE₃ is about five times IE₂.', 'The jump marks the end of the valence shell.'],
    ],
    end: 'This is why magnesium forms Mg²⁺ but never Mg³⁺ in chemical reactions.',
  },
  figure: { svg: fig, caption: 'Across a period Z_eff rises: atoms shrink and hold electrons more tightly. Down a group a new shell is added: atoms grow and lose outer electrons more easily.' },
  table: {
    caption: 'Period 3: first ionisation energy and atomic radius',
    head: ['element', 'configuration', 'IE₁ (kJ/mol)', 'radius (pm)'],
    rows: [['Na', '[Ne]3s¹', '496', '186'], ['Mg', '[Ne]3s²', '738', '160'], ['Al', '[Ne]3s²3p¹', '578', '143'], ['Si', '[Ne]3s²3p²', '787', '118'], ['P', '[Ne]3s²3p³', '1012', '110'], ['S', '[Ne]3s²3p⁴', '1000', '103'], ['Cl', '[Ne]3s²3p⁵', '1251', '99'], ['Ar', '[Ne]3s²3p⁶', '1521', '71']],
    note: 'The general rise has two dips: Mg → Al (the 3p electron is higher in energy and slightly shielded by 3s) and P → S (the fourth 3p electron is paired and repelled). Radii are approximate and differ between sources depending on how they are defined.',
  },
  method: {
    title: 'Writing configurations and predicting trends',
    steps: [
      'Count the electrons (Z for a neutral atom; adjust for charge).',
      'Fill subshells in the Aufbau order, respecting capacities; use noble-gas shorthand.',
      'For orbital diagrams, apply Hund’s rule; count unpaired electrons.',
      'For cations of transition metals, remove the ns electrons first.',
      'For trends, compare positions: same period → Z_eff argument; same group → number of shells argument. Mention known exceptions.',
    ],
  },
  examples: [
    {
      title: 'Configuration and unpaired electrons of oxygen',
      problem: 'Write the ground-state configuration of oxygen (Z = 8) and find the number of unpaired electrons.',
      steps: [
        ['1s^{2} 2s^{2} 2p^{4}.', 'Fill 1s, 2s, then 2p with the remaining four electrons.'],
        ['2p has three orbitals: put one electron in each, then pair the fourth: ↑↓ ↑ ↑.', 'Hund’s rule.'],
      ],
      result: '1s²2s²2p⁴, with 2 unpaired electrons (oxygen atoms are paramagnetic).',
      meaning: 'A 2p³ configuration (nitrogen) would have 3 unpaired electrons.',
    },
    {
      title: 'A transition-metal ion',
      problem: 'Write configurations for Fe (Z = 26) and Fe^{3+}.',
      steps: [
        ['Fe: [Ar]3d^{6}4s^{2}.', '18 core electrons + 8.'],
        ['Fe^{3+}: remove the two 4s electrons, then one 3d: [Ar]3d^{5}.', 'Remove ns before (n − 1)d.'],
      ],
      result: 'Fe = [Ar]3d⁶4s²; Fe³⁺ = [Ar]3d⁵.',
      meaning: 'Writing Fe³⁺ as [Ar]3d³4s² is a common error; the 4s electrons go first.',
    },
    {
      title: 'Electrons needed for a noble-gas configuration',
      problem: 'An atom has shell arrangement 2, 8, 7. How many electrons must it gain to complete an octet? Which element and ion is it?',
      steps: [
        ['Outer shell has 7; an octet needs 8: gain 1.', 'Main-group atoms tend to reach 8 valence electrons.'],
        ['Total electrons 17 ⇒ chlorine; ion Cl^{−}.', 'Z = 17.'],
      ],
      result: 'Gains 1 electron to form Cl^{−} (configuration of argon).',
      meaning: 'Halogens (group 17) form 1− ions; alkali metals (2, 8, 1 etc.) form 1+ ions.',
    },
    {
      title: 'Compare sizes and ionisation energies',
      problem: 'Arrange Na, Mg and K in order of increasing atomic radius, and of increasing first ionisation energy.',
      steps: [
        ['Na and Mg are in period 3; Mg has higher Z_{eff}, so Mg is smaller than Na.', 'Across a period.'],
        ['K is below Na (an extra shell), so K is larger than Na.', 'Down a group.'],
        ['Ionisation energy follows the reverse order.', 'Smaller atoms hold electrons more tightly.'],
      ],
      result: 'Radius: Mg < Na < K. First ionisation energy: K < Na < Mg (419 < 496 < 738 kJ/mol).',
      meaning: 'This is why potassium reacts with water more violently than sodium.',
    },
    {
      title: 'Isoelectronic ions',
      problem: 'Order O^{2−}, F^{−}, Na^{+} and Mg^{2+} by size.',
      steps: [
        ['All have 10 electrons (the neon configuration).', 'Same electron count.'],
        ['Their proton numbers are 8, 9, 11, 12: more protons pull the same electrons closer.', 'Higher nuclear charge, smaller ion.'],
      ],
      result: 'Mg²⁺ < Na⁺ < F⁻ < O²⁻ (smallest to largest).',
      meaning: 'For isoelectronic species, size decreases as Z increases.',
    },
  ],
  mistakes: [
    ['Filling 3d before 4s for neutral atoms, or removing 3d before 4s for ions.', 'Fill 4s before 3d; ionise 4s before 3d.'],
    ['Pairing electrons before filling each orbital of a subshell singly.', 'Hund’s rule: singly first, parallel spins.'],
    ['“Atoms get bigger across a period because they have more electrons.”', 'They get smaller: the added electrons are in the same shell while Z_eff increases.'],
    ['Treating trends as rules with no exceptions.', 'Be/B and N/O ionisation dips, and Cr/Cu configurations, are the standard exceptions.'],
  ],
  scope: [
    'Quantitative shielding (Slater’s rules), lanthanides and actinides, and detailed transition-metal chemistry are beyond this topic.',
  ],
  checks: [
    ['O unpaired', 2, 2, 0], ['Mg jump', 7733 / 1451, 5.3, 0.05], ['Cl gain', 8 - 7, 1, 0], ['Fe3+ d', 26 - 3 - 18, 5, 0],
  ],
};
