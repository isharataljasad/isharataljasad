import { svg, text, line, vector } from '../svg.mjs';

// Hydrogen energy levels E_n = −2.18e−18/n² J (drawn to scale in energy), with Balmer transitions to n = 2.
const En = (n) => -2.18 / (n * n); // units of 10⁻¹⁸ J
const Y = (e) => 30 + (-e) * 105; // e in 10⁻¹⁸ J: 0 → 30, −2.18 → 259
const levels = [1, 2, 3, 4, 5];
const fig = svg('chem-levels', { w: 500, h: 290, title: 'Energy levels of the hydrogen atom and the visible (Balmer) transitions', desc: 'Horizontal lines show the allowed energies E_n = −2.18 × 10⁻¹⁸ J / n² for n = 1 to 5, drawn to scale, with n = ∞ at zero energy. The levels crowd together as n increases. Downward arrows from n = 3, 4 and 5 to n = 2 show photon emission at 656 nm (red), 486 nm and 434 nm.' },
  levels.map((n) => line(150, Y(En(n)), 440, Y(En(n)), { width: 2 }) + (n <= 3 ? text(140, Y(En(n)) + 5, `n = ${n}`, { anchor: 'end', size: 14 }) + text(446, Y(En(n)) + 5, `${En(n).toFixed(3)}`, { size: 12, color: '#5e7376' }) : '')).join('')
  + text(140, Y(En(4)) - 2, 'n = 4, 5 …', { anchor: 'end', size: 12, color: '#5e7376' })
  + line(150, Y(0), 440, Y(0), { width: 1.5, dash: '5 4', color: '#5e7376' }) + text(140, Y(0) - 4, 'n = ∞', { anchor: 'end', size: 12 }) + text(446, Y(0) + 5, '0', { size: 12, color: '#5e7376' })
  + text(446, 18, '×10⁻¹⁸ J', { size: 12, color: '#5e7376' })
  + [[3, '#b3412e', '656 nm'], [4, '#176e66', '486 nm'], [5, '#355b90', '434 nm']].map(([n, c, l], i) => vector(220 + i * 70, Y(En(n)), 220 + i * 70, Y(En(2)) - 2, i === 0 ? 'c' : i === 1 ? 'a' : 'd', 2.5) + text(220 + i * 70, Y(En(2)) + 22, l, { anchor: 'middle', size: 13, color: c })).join('')
  + text(20, 280, 'Energy increases upward. Emission: electron drops, photon carries away ΔE.', { size: 13, color: '#5e7376' }));

export default {
  summary: 'Light comes in photons with energy E = hν. Electrons in atoms can only have certain energies, so atoms absorb and emit light only at particular wavelengths. Electrons are described by orbitals labelled by quantum numbers.',
  why: [
    'Quantum theory explains why elements have their chemical properties, why they give characteristic colours in flames and spectra, and how spectroscopy — the main analytical tool of chemistry — identifies substances and measures concentrations. It also underlies lasers, LEDs, solar cells and the periodic table itself.',
  ],
  idea: [
    'Light is an electromagnetic wave with wavelength λ and frequency ν related by c = λν. But in 1900–1905 Planck and Einstein showed that light energy comes in packets called **photons**, each with energy E = hν = {{hc|λ}}. Shorter wavelength means higher energy: ultraviolet photons carry more energy than red ones.',
    'The **photoelectric effect** proved this. Light ejects electrons from a metal only if each photon has enough energy (frequency above a threshold). Brighter light of too low a frequency ejects none, because brightness means more photons, not more energetic ones.',
    'Heated hydrogen gas emits light only at certain wavelengths — a **line spectrum**, not a continuous rainbow. Bohr explained this: the electron can only occupy levels with energies E_{n} = −{{2.18 × 10^{−18} J|n^{2}}}, n = 1, 2, 3, … When it drops from a higher level to a lower one, it emits a photon whose energy equals the difference, ΔE = hν. The energies are negative because the electron is bound; zero means the electron has been removed (ionised).',
    'Electrons also behave as waves (de Broglie, λ = h/mv), and the full quantum-mechanical model replaces Bohr’s orbits by **orbitals**: regions where the electron is likely to be found. Each orbital is labelled by three quantum numbers, and each electron by a fourth: n (shell, size and energy), l (subshell shape: s, p, d, f), m_{l} (orientation) and m_{s} (spin, +½ or −½).',
    'The **Heisenberg uncertainty principle** says an electron’s position and momentum cannot both be known exactly, which is why we speak of probability, not paths.',
  ],
  background: [
    { title: 'Scientific notation', text: 'Quantum quantities are tiny: h = 6.626 × 10^{−34} J·s. Multiply coefficients and add exponents: (6.626 × 10^{−34})(2.998 × 10^{8}) = 1.986 × 10^{−25}.' },
    { title: 'Unit conversions', text: '1 nm = 10^{−9} m. Energy per mole = energy per photon × N_{A} (6.022 × 10^{23} mol^{−1}).' },
  ],
  definitions: [
    ['Wavelength λ, frequency ν', 'λ: distance between wave crests (m); ν: number of waves per second (Hz = s^{−1}).'],
    ['Photon', 'A quantum (packet) of light energy, E = hν.'],
    ['Ground and excited states', 'The lowest-energy arrangement (n = 1 for hydrogen) and any higher-energy arrangement.'],
    ['Emission / absorption', 'An electron dropping to a lower level emits a photon; a photon of exactly the right energy can raise an electron to a higher level.'],
    ['Orbital', 'A region of space described by a wavefunction where an electron of given energy is likely to be found; it holds at most two electrons of opposite spin.'],
    ['Quantum numbers', 'n = 1, 2, 3, …; l = 0 to n − 1 (s, p, d, f for l = 0, 1, 2, 3); m_{l} = −l to +l; m_{s} = ±½.'],
  ],
  symbols: [
    ['h', 'Planck’s constant, 6.626 × 10⁻³⁴', 'J·s'], ['c', 'speed of light, 2.998 × 10⁸', 'm/s'], ['λ', 'wavelength', 'm (often nm)'],
    ['ν', 'frequency', 'Hz = s⁻¹'], ['E_{n}', 'energy of level n (hydrogen)', 'J'], ['n, l, m_{l}, m_{s}', 'quantum numbers', '—'],
  ],
  formulas: [
    { name: 'Wave relation', f: 'c = λν', when: 'All electromagnetic radiation in vacuum.' },
    { name: 'Photon energy', f: 'E = hν = {{hc|λ}}', when: 'Energy of one photon. Multiply by N_{A} for a mole of photons.' },
    { name: 'Hydrogen energy levels (Bohr)', f: 'E_{n} = −{{2.18 × 10^{−18} J|n^{2}}}', when: 'Hydrogen atom (one electron) only. Multi-electron atoms need the full quantum model.' },
    { name: 'Transition energy', f: 'ΔE = 2.18 × 10^{−18} J ({{1|n_{f}^{2}}} − {{1|n_{i}^{2}}}) ;  |ΔE| = {{hc|λ}}', when: 'Hydrogen. ΔE < 0 for emission (n_i > n_f).' },
    { name: 'de Broglie wavelength', f: 'λ = {{h|mv}}', when: 'Any moving particle; significant only for very small masses such as electrons.' },
    { name: 'Orbital counts', f: 'n^{2} orbitals and 2n^{2} electrons per shell;  2l + 1 orbitals per subshell', when: 's: 1 orbital, p: 3, d: 5, f: 7.' },
  ],
  derivation: {
    title: 'The red line of hydrogen from the energy levels',
    intro: 'Predict the wavelength emitted when an electron drops from n = 3 to n = 2.',
    steps: [
      ['ΔE = 2.18 × 10^{−18}({{1|4}} − {{1|9}}) = 2.18 × 10^{−18} × 0.1389 = 3.03 × 10^{−19} J.', 'Energy released (magnitude).'],
      ['λ = {{hc|ΔE}} = {{(6.626 × 10^{−34})(2.998 × 10^{8})|3.03 × 10^{−19}}} = 6.56 × 10^{−7} m.', 'Photon energy relation.'],
      ['= 656 nm, red light.', '1 nm = 10⁻⁹ m.'],
    ],
    end: 'This matches the measured red line of hydrogen (656.3 nm) — strong evidence that energies are quantised.',
  },
  figure: { svg: fig, caption: 'Hydrogen’s energy levels drawn to scale. Drops to n = 2 give the visible lines; the biggest drop (5 → 2) gives the shortest wavelength.' },
  table: {
    caption: 'Allowed quantum numbers for the first three shells',
    head: ['n', 'l (subshell)', 'm_{l} values', 'orbitals', 'max electrons'],
    rows: [['1', '0 (1s)', '0', '1', '2'], ['2', '0 (2s), 1 (2p)', '0; −1, 0, +1', '1 + 3 = 4', '8'], ['3', '0 (3s), 1 (3p), 2 (3d)', '0; −1…+1; −2…+2', '1 + 3 + 5 = 9', '18']],
    note: 'There is no 2d or 1p subshell, because l must be less than n.',
  },
  method: {
    title: 'Photon and spectrum calculations',
    steps: [
      'Convert wavelengths to metres (nm × 10⁻⁹).',
      'Use c = λν to switch between wavelength and frequency.',
      'Use E = hν = hc/λ for one photon; multiply by N_{A} and divide by 1000 for kJ/mol.',
      'For hydrogen transitions, compute ΔE from the level formula, then λ = hc/|ΔE|.',
      'Check the region: 400–700 nm is visible; shorter is UV, longer is IR.',
    ],
  },
  examples: [
    {
      title: 'Energy of a photon',
      problem: 'Find the energy of one photon of green light (λ = 500 nm) and of one mole of such photons.',
      steps: [
        ['E = {{hc|λ}} = {{(6.626 × 10^{−34})(2.998 × 10^{8})|500 × 10^{−9}}} = 3.97 × 10^{−19} J.', 'Convert nm to m first.'],
        ['Per mole: 3.97 × 10^{−19} × 6.022 × 10^{23} = 2.39 × 10^{5} J/mol = 239 kJ/mol.', 'Multiply by Avogadro’s number.'],
      ],
      result: '3.97 × 10^{−19} J per photon; 239 kJ/mol.',
      meaning: 'This is comparable to chemical bond energies, which is why visible and UV light can drive chemical reactions (photosynthesis, fading of dyes).',
    },
    {
      title: 'Scaling with wavelength',
      problem: 'A photon’s wavelength is halved. By what factor does its energy change? If its frequency is tripled instead?',
      steps: [
        ['E = hc/λ: halving λ doubles E.', 'Energy is inversely proportional to wavelength.'],
        ['E = hν: tripling ν triples E.', 'Energy is proportional to frequency.'],
      ],
      result: '×2 and ×3.',
      meaning: 'Blue photons (≈ 450 nm) carry about 1.5 times the energy of red ones (≈ 680 nm).',
    },
    {
      title: 'Frequency from wavelength',
      problem: 'A radio station broadcasts at 100 MHz. Find the wavelength.',
      steps: [['λ = {{c|ν}} = {{2.998 × 10^{8}|1.00 × 10^{8}}} = 3.00 m.', 'c = λν.']],
      result: 'λ ≈ 3.0 m.',
      meaning: 'Radio photons carry very little energy (6.6 × 10⁻²⁶ J): far too little to break bonds.',
    },
    {
      title: 'Ionisation energy of hydrogen',
      problem: 'How much energy is needed to remove the electron from a ground-state hydrogen atom? Express it per mole.',
      steps: [
        ['From n = 1 to n = ∞: ΔE = 0 − (−2.18 × 10^{−18}) = 2.18 × 10^{−18} J.', 'E_∞ = 0.'],
        ['× 6.022 × 10^{23} = 1.31 × 10^{6} J/mol = 1312 kJ/mol.', 'Per mole.'],
      ],
      result: '2.18 × 10^{−18} J per atom = 1312 kJ/mol.',
      meaning: 'This agrees with the measured first ionisation energy of hydrogen.',
    },
    {
      title: 'Allowed quantum numbers',
      problem: 'Which set is not allowed: (a) n = 2, l = 1, m_{l} = −1; (b) n = 3, l = 3, m_{l} = 0; (c) n = 4, l = 2, m_{l} = +2?',
      steps: [
        ['(a) l = 1 < 2 and |m_{l}| ≤ 1: allowed (a 2p orbital).', 'Check l < n and −l ≤ m_l ≤ l.'],
        ['(b) l = 3 is not less than n = 3: not allowed.', 'l can be at most n − 1 = 2.'],
        ['(c) l = 2 < 4 and m_{l} = +2 ≤ 2: allowed (a 4d orbital).', 'Both rules satisfied.'],
      ],
      result: 'Set (b) is not allowed.',
      meaning: 'This is why there are no “3f” orbitals.',
    },
  ],
  mistakes: [
    ['Forgetting to convert nm to m.', 'Multiply nanometres by 10⁻⁹ before using c or hc.'],
    ['“Brighter light has more energetic photons.”', 'Brightness is the number of photons; each photon’s energy depends only on its frequency.'],
    ['Applying E_n = −2.18 × 10⁻¹⁸/n² J to atoms other than hydrogen.', 'The Bohr formula works for one-electron species only.'],
    ['Thinking of orbitals as fixed circular paths.', 'Orbitals are probability regions; the electron has no definite path.'],
    ['Allowing l = n.', 'l ranges from 0 to n − 1.'],
  ],
  scope: [
    'Wavefunction mathematics (Schrödinger equation) is described qualitatively only.',
    'Electron configurations and the filling order are developed in the Periodic table topic.',
  ],
  checks: [
    ['green E', 6.626e-34 * 2.998e8 / 500e-9, 3.97e-19, 0.005e-19], ['per mol', 6.626e-34 * 2.998e8 / 500e-9 * 6.022e23 / 1000, 239, 0.5],
    ['radio', 2.998e8 / 1e8, 3.0, 0.005], ['radio E', 6.626e-34 * 1e8, 6.6e-26, 0.05e-26],
    ['Hα ΔE', 2.18e-18 * (1 / 4 - 1 / 9), 3.03e-19, 0.005e-19], ['Hα λ nm', 6.626e-34 * 2.998e8 / (2.18e-18 * (1 / 4 - 1 / 9)) * 1e9, 656, 1],
    ['Hβ nm', 6.626e-34 * 2.998e8 / (2.18e-18 * (1 / 4 - 1 / 16)) * 1e9, 486, 1], ['Hγ nm', 6.626e-34 * 2.998e8 / (2.18e-18 * (1 / 4 - 1 / 25)) * 1e9, 434, 1],
    ['IE', 2.18e-18 * 6.022e23 / 1000, 1312, 1],
  ],
};
