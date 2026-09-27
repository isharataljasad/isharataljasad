import { svg, text, line, circle, vector } from '../svg.mjs';

// Lewis structure and shape of water, and linear CO2 with cancelling dipoles.
const dots = (x, y, dx, dy) => circle(x - dx, y - dy, 2.6, { fill: '#183b3f' }) + circle(x + dx, y + dy, 2.6, { fill: '#183b3f' });
const fig = svg('chem-shape', { w: 500, h: 270, title: 'Water is bent and polar; carbon dioxide is linear and non-polar', desc: 'Left: water, oxygen in the centre bonded to two hydrogens at about 104.5 degrees, with two lone pairs on oxygen shown as dot pairs. Bond dipole arrows point from each hydrogen toward oxygen; they add to a net dipole pointing up toward the oxygen side. Right: carbon dioxide, O=C=O in a straight line with two lone pairs on each oxygen. The two bond dipoles point outward in opposite directions and cancel, so the molecule has no net dipole.' },
  // water
  text(120, 120, 'O', { size: 30, anchor: 'middle', weight: 650 })
  + line(108, 128, 62, 178, { width: 3 }) + line(132, 128, 178, 178, { width: 3 })
  + text(52, 196, 'H', { size: 26, anchor: 'middle' }) + text(188, 196, 'H', { size: 26, anchor: 'middle' })
  + dots(100, 88, 6, -3) + dots(140, 88, 6, 3)
  + text(120, 172, '104.5°', { size: 13, anchor: 'middle', color: '#5e7376' })
  + vector(70, 160, 98, 132, 'c', 2) + vector(170, 160, 142, 132, 'c', 2)
  + vector(120, 64, 120, 24, 'd', 3) + text(130, 32, 'net dipole', { size: 13, color: '#355b90' })
  + text(120, 238, 'H₂O: 2 bonds + 2 lone pairs', { size: 14, anchor: 'middle' }) + text(120, 258, 'bent, polar', { size: 14, anchor: 'middle', color: '#b3412e' })
  // CO2
  + text(300, 150, 'O', { size: 30, anchor: 'middle', weight: 650 }) + text(380, 150, 'C', { size: 30, anchor: 'middle', weight: 650 }) + text(460, 150, 'O', { size: 30, anchor: 'middle', weight: 650 })
  + line(318, 134, 362, 134, { width: 3 }) + line(318, 144, 362, 144, { width: 3 }) + line(398, 134, 442, 134, { width: 3 }) + line(398, 144, 442, 144, { width: 3 })
  + dots(300, 108, 6, 0) + dots(300, 168, 6, 0) + dots(460, 108, 6, 0) + dots(460, 168, 6, 0)
  + vector(370, 188, 318, 188, 'c', 2) + vector(390, 188, 442, 188, 'c', 2)
  + text(372, 238, 'CO₂: two C=O bonds, no lone pairs on C', { size: 13, anchor: 'middle' }) + text(380, 258, 'linear, dipoles cancel: non-polar', { size: 14, anchor: 'middle', color: '#176e66' }));

export default {
  summary: 'Atoms bond by transferring electrons (ionic) or sharing them (covalent). Lewis structures count the electrons; VSEPR turns electron domains into shapes; shape and electronegativity decide polarity.',
  why: [
    'Bonding explains why salt is a hard, high-melting solid while methane is a gas; why water dissolves ions and oil does not; why some molecules absorb infrared radiation. Molecular shape and polarity decide boiling points, solubility and reactivity — the properties that matter when choosing solvents, designing separations or handling chemicals safely.',
  ],
  idea: [
    'Atoms bond because the bonded arrangement has lower energy. Main-group atoms often end up with eight valence electrons around them (the **octet rule**; hydrogen needs two).',
    'In an **ionic bond**, electrons are transferred from a metal to a non-metal, forming cations and anions held together by electrostatic attraction. Ionic compounds form extended **lattices**, not separate molecules: NaCl describes the 1:1 ratio of ions in the crystal. In a **covalent bond**, non-metal atoms **share** pairs of electrons. Sharing is unequal when the atoms have different electronegativities: the bond is **polar**, with partial charges δ+ and δ−.',
    'A **Lewis structure** shows every valence electron: bonding pairs as lines, lone pairs as dots. Count the total valence electrons, connect the atoms with single bonds, complete octets on outer atoms, then on the central atom, forming double or triple bonds if necessary. **Formal charges** (valence electrons − lone-pair electrons − bonds) help choose the best structure: formal charges close to zero, with any negative charge on the more electronegative atom. When two or more equally good structures differ only in where the double bond is, the real molecule is a **resonance hybrid** of them.',
    '**VSEPR** (valence-shell electron-pair repulsion): the electron domains around a central atom (each bond — single, double or triple — or lone pair counts as one domain) spread out as far apart as possible. Two domains: linear (180°); three: trigonal planar (120°); four: tetrahedral (109.5°). The **molecular shape** names only the atom positions: with four domains, 4 bonds give tetrahedral (CH₄), 3 bonds + 1 lone pair give trigonal pyramidal (NH₃, 107°), 2 bonds + 2 lone pairs give bent (H₂O, 104.5°). Lone pairs repel more strongly and squeeze the bond angles.',
    'A molecule is **polar** if its bond dipoles do not cancel. CO₂ has polar bonds, but it is linear and the two dipoles cancel, so the molecule is non-polar. Water is bent, so its dipoles add to a net dipole: water is polar. Shape and bond polarity must both be considered.',
  ],
  background: [
    { title: 'Valence electrons from the periodic table', text: 'For main-group elements, the number of valence electrons equals the group’s last digit: H 1, C 4, N 5, O 6, F and Cl 7. Add one electron for each negative charge of an ion; subtract one for each positive charge.' },
    { title: 'Electronegativity', text: 'Increases across a period and up a group (F highest). Pauling values: H 2.20, C 2.55, N 3.04, O 3.44, F 3.98, Na 0.93, Cl 3.16.' },
  ],
  definitions: [
    ['Ionic bond', 'Electrostatic attraction between oppositely charged ions, typically metal cations and non-metal anions, in a lattice.'],
    ['Covalent bond', 'A shared pair (single), two pairs (double) or three pairs (triple) of electrons between two atoms.'],
    ['Polar covalent bond', 'Unequal sharing due to an electronegativity difference; roughly 0.4–1.8 on the Pauling scale (larger differences are mostly ionic). The cut-offs are only a guide.'],
    ['Lewis structure', 'A diagram showing all valence electrons as bonding pairs and lone pairs.'],
    ['Formal charge', 'FC = (valence electrons) − (lone-pair electrons) − (number of bonds).'],
    ['Electron domain', 'A region of electron density around a central atom: a lone pair or a bond (single, double or triple counts once).'],
    ['Dipole moment', 'A measure of charge separation. A molecule with a net dipole is polar.'],
  ],
  symbols: [
    ['δ+, δ−', 'partial positive and negative charges', '—'], ['—, =, ≡', 'single, double, triple bond', '—'], ['χ', 'electronegativity', 'no unit'], ['FC', 'formal charge', 'electron charges'],
  ],
  formulas: [
    { name: 'Total valence electrons', f: 'Σ(valence electrons of atoms) − (ion charge)', when: 'For anions the charge is negative, so electrons are added: CO₃²⁻ has 4 + 3(6) + 2 = 24.' },
    { name: 'Formal charge', f: 'FC = V − L − B', when: 'V = valence electrons of the free atom; L = electrons in lone pairs on the atom; B = number of bonds (shared pairs). The formal charges add up to the overall charge.' },
    { name: 'Ionic formula', f: 'total positive charge = total negative charge', when: 'Ionic compounds are neutral: Al³⁺ and O²⁻ give Al₂O₃ (2 × 3 = 3 × 2).' },
    { name: 'VSEPR geometry', f: '2 domains: linear 180°;  3: trigonal planar 120°;  4: tetrahedral 109.5°;  5: trigonal bipyramidal;  6: octahedral', when: 'Domains around the central atom; lone pairs compress angles slightly.' },
  ],
  derivation: {
    title: 'Building the Lewis structure of CO₂',
    intro: 'Carbon has 4 valence electrons and each oxygen 6.',
    steps: [
      ['Total: 4 + 2(6) = 16 electrons (8 pairs).', 'Count first.'],
      ['Skeleton O–C–O uses 2 pairs; complete the oxygen octets with 3 lone pairs each: 2 + 6 = 8 pairs used.', 'Outer atoms first.'],
      ['Carbon now has only 4 electrons. Move one lone pair from each O into a bond: O=C=O.', 'Form multiple bonds to complete the central octet.'],
      ['Formal charges: C: 4 − 0 − 4 = 0; each O: 6 − 4 − 2 = 0.', 'All zero: the best structure.'],
    ],
    end: 'Two electron domains on carbon (two double bonds) make CO₂ linear, 180°.',
  },
  figure: { svg: fig, caption: 'Water: four electron domains, two of them lone pairs, so the molecule is bent and the bond dipoles add. Carbon dioxide: two domains, linear, and the dipoles cancel.' },
  table: {
    caption: 'From domains to shape (central atom)',
    head: ['molecule', 'bonding domains', 'lone pairs', 'electron geometry', 'molecular shape', 'polar?'],
    rows: [['CO₂', '2', '0', 'linear', 'linear, 180°', 'no'], ['BF₃', '3', '0', 'trigonal planar', 'trigonal planar, 120°', 'no'], ['CH₄', '4', '0', 'tetrahedral', 'tetrahedral, 109.5°', 'no'], ['NH₃', '3', '1', 'tetrahedral', 'trigonal pyramidal, ≈107°', 'yes'], ['H₂O', '2', '2', 'tetrahedral', 'bent, ≈104.5°', 'yes']],
    note: 'NH₃ and H₂O have the same electron geometry as CH₄ but different molecular shapes, because lone pairs are not counted in the shape name.',
  },
  method: {
    title: 'From formula to polarity',
    steps: [
      'Count the total valence electrons (adjust for ion charge).',
      'Choose the central atom (usually the least electronegative, never H) and draw single bonds to the outer atoms.',
      'Complete octets of outer atoms, then place remaining electrons on the central atom.',
      'If the central atom lacks an octet, form double or triple bonds. Check formal charges; consider resonance.',
      'Count electron domains on the central atom → electron geometry → molecular shape (atoms only).',
      'Decide polarity: are there polar bonds, and do their dipoles cancel by symmetry?',
    ],
  },
  examples: [
    {
      title: 'Counting valence electrons',
      problem: 'How many valence electrons are in CO₂, H₂O and the nitrate ion NO₃⁻?',
      steps: [
        ['CO₂: 4 + 2 × 6 = 16.', 'C has 4, each O 6.'],
        ['H₂O: 2 × 1 + 6 = 8.', 'Each H has 1.'],
        ['NO₃⁻: 5 + 3 × 6 + 1 = 24.', 'Add one electron for the 1− charge.'],
      ],
      result: '16, 8 and 24.',
      meaning: 'Every structure you draw must use exactly this many electrons.',
    },
    {
      title: 'Lewis structure and shape of ammonia',
      problem: 'Draw the Lewis structure of NH₃ and predict its shape and polarity.',
      steps: [
        ['Valence electrons: 5 + 3(1) = 8 (4 pairs).', 'Count.'],
        ['Three N–H bonds use 3 pairs; the fourth pair is a lone pair on N.', 'N has an octet; each H has 2.'],
        ['Four domains → tetrahedral electron geometry; one lone pair → trigonal pyramidal shape, ≈107°.', 'VSEPR.'],
        ['N–H bonds are polar (3.04 vs 2.20) and the pyramid is not symmetric, so the dipoles do not cancel.', 'Polarity.'],
      ],
      result: 'Trigonal pyramidal and polar.',
      meaning: 'This polarity, with hydrogen bonding, makes ammonia very soluble in water.',
    },
    {
      title: 'Formal charge and resonance: nitrate',
      problem: 'Draw NO₃⁻ and find the formal charges.',
      steps: [
        ['24 electrons; N central with three O atoms.', 'Count and skeleton.'],
        ['After completing octets, N needs one double bond: one N=O and two N–O.', 'Complete the central octet.'],
        ['FC: N = 5 − 0 − 4 = +1; double-bonded O = 6 − 4 − 2 = 0; each single-bonded O = 6 − 6 − 1 = −1. Sum: +1 + 0 − 1 − 1 = −1 ✓.', 'Formal charges add to the ion’s charge.'],
        ['The double bond can be to any of the three O atoms: three equivalent resonance structures.', 'Resonance.'],
      ],
      result: 'A resonance hybrid: all three N–O bonds are identical, between single and double in length; trigonal planar, 120°.',
      meaning: 'Resonance structures are not flipping back and forth; the real ion is one average structure.',
    },
    {
      title: 'Formula of an ionic compound',
      problem: 'Write the formulas of the compounds formed by (a) Mg²⁺ and Cl⁻, (b) Al³⁺ and O²⁻.',
      steps: [
        ['(a) One Mg²⁺ balances two Cl⁻: MgCl₂.', '+2 − 2 = 0.'],
        ['(b) Lowest common multiple of 3 and 2 is 6: two Al³⁺ (+6) and three O²⁻ (−6): Al₂O₃.', 'Balance the charges.'],
      ],
      result: 'MgCl₂ and Al₂O₃.',
      meaning: 'Subscripts come from balancing charges; they are not the charges themselves.',
    },
    {
      title: 'Polar bonds, non-polar molecule',
      problem: 'CCl₄ has four polar C–Cl bonds. Is the molecule polar?',
      steps: [
        ['Carbon has four bonding domains and no lone pairs: tetrahedral.', 'VSEPR.'],
        ['Four identical bond dipoles arranged symmetrically in a tetrahedron cancel.', 'Vector sum is zero.'],
      ],
      result: 'CCl₄ is non-polar.',
      meaning: 'CH₂Cl₂, with two different kinds of bond, is polar.',
    },
  ],
  mistakes: [
    ['Calling NaCl a molecule.', 'It is an ionic lattice; NaCl is its formula unit (ratio).'],
    ['Counting a double bond as two domains in VSEPR.', 'Any bond counts as one domain.'],
    ['Naming the shape from the electron geometry.', 'H₂O has tetrahedral electron geometry but a bent molecular shape.'],
    ['“A molecule with polar bonds is polar.”', 'Symmetric shapes (CO₂, CCl₄, BF₃) cancel bond dipoles.'],
    ['Forgetting the ion charge when counting electrons.', 'Anions add electrons; cations subtract.'],
  ],
  scope: [
    'Hybridisation and molecular orbital theory (bond order from orbital overlap) are in the related collection notes; check whether your outline includes them.',
    'Expanded octets (5 or 6 domains) are listed but not developed.',
  ],
  checks: [
    ['CO2 e', 4 + 12, 16, 0], ['H2O e', 2 + 6, 8, 0], ['NO3 e', 5 + 18 + 1, 24, 0], ['CO3 e', 4 + 18 + 2, 24, 0],
    ['FC sum', 1 + 0 - 1 - 1, -1, 0], ['Al2O3', 2 * 3 - 3 * 2, 0, 0], ['NH EN diff', 3.04 - 2.20, 0.84, 1e-9],
  ],
};
