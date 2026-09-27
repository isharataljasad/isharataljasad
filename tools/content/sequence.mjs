/* One ordered lesson sequence per subject. Curriculum topics (semester-1/curriculum.json)
 * keep their existing URLs; `added` lessons are supporting lessons placed where a
 * later lesson first depends on them. See docs/migration-ledger.md. */
export const sequence = {
  ma101: [
    { id: 'functions', title: 'Functions you need for calculus', added: 'Prerequisite review combined from the function notes of the earlier collections.' },
    'limits', 'continuity', 'derivative', 'rules', 'related-rates', 'approximation', 'mean-value', 'curve-shape', 'optimization',
  ],
  phy101: [
    'measurement', 'motion',
    { id: 'relative-motion', title: 'Relative motion and reference frames', added: 'Expanded from a section of Vectors and motion.' },
    'forces', 'friction', 'energy', 'momentum', 'circular-motion', 'lab-graphs',
  ],
  chemistry: [
    'atomic-structure', 'quantum-theory', 'periodic-table', 'bonding',
    { id: 'intermolecular-forces', title: 'Intermolecular forces, phases and solubility', added: 'Needs polarity from Chemical bonding; needed by Properties of solutions.' },
    { id: 'chemical-naming', title: 'Writing formulas and naming compounds', added: 'Needs ion charges; needed before formulas are used in calculations.' },
    { id: 'moles-and-formulas', title: 'Moles, molar mass and chemical formulas', added: 'Needed by Reactions in solution, Properties of solutions and Properties of gases.' },
    'aqueous-reactions', 'solutions', 'gases', 'thermochemistry', 'electrochemistry',
  ],
};
