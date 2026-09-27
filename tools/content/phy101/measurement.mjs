import { svg, text, line } from '../svg.mjs';

// Unit-conversion chain 90 km/h → 25 m/s with cancelled units.
// One number/unit pair, right/left of the centre; a struck unit gets a red line through it.
const part = (x, y, num, unit, struck) => {
  const w = unit.length * 10.5;
  return text(x - 3, y, num, { anchor: 'end', size: 17 }) + text(x + 3, y, unit, { size: 17 })
    + (struck ? line(x + 1, y - 3, x + 5 + w, y - 9, { color: '#b3412e', width: 2.2 }) : '');
};
const frac = (x, top, bottom, cancelTop, cancelBottom) => part(x, 70, ...top, cancelTop) + line(x - 50, 82, x + 50, 82, { width: 1.6 }) + part(x, 108, ...bottom, cancelBottom);
const fig = svg('phy-units', { w: 500, h: 170, title: 'Converting 90 km/h to m/s with conversion factors', desc: '90 km per 1 h, times 1000 m per 1 km, times 1 h per 3600 s, equals 25 m/s. The unit km cancels between the first numerator and the second denominator, and h cancels between the first denominator and the third numerator; both are struck through in red.' },
  frac(70, ['90', 'km'], ['1', 'h'], true, true) + text(140, 88, '×', { anchor: 'middle', size: 18 })
  + frac(210, ['1000', 'm'], ['1', 'km'], false, true) + text(280, 88, '×', { anchor: 'middle', size: 18 })
  + frac(350, ['1', 'h'], ['3600', 's'], true, false) + text(420, 88, '=', { anchor: 'middle', size: 18 })
  + text(470, 94, '25 m/s', { anchor: 'middle', size: 18, weight: 650, color: '#176e66' })
  + text(250, 150, 'Each factor equals 1, so the quantity is unchanged; units cancel like numbers.', { anchor: 'middle', size: 13, color: '#5e7376' }));

export default {
  summary: 'Physics is measured quantities with units. Convert carefully, check dimensions, and report results with sensible precision.',
  why: [
    'A number without a unit means nothing in physics: “the speed is 25” could be 25 m/s or 25 km/h, a factor of 3.6 apart. Many real engineering failures came from mixed units. Units are also your best error detector: if an equation for a distance produces m/s, it is wrong before you compare any numbers.',
    'Every experiment also has limited precision. Knowing how many digits are meaningful stops you reporting 3.14159 m for a length measured with a ruler.',
  ],
  idea: [
    'Every physical quantity is a **number times a unit**. The SI system uses seven base units; in mechanics you need three: the metre (m) for length, the kilogram (kg) for mass, and the second (s) for time. All other mechanical units are combinations: speed in m/s, acceleration in m/s^{2}, force in newtons, 1 N = 1 kg·m/s^{2}, energy in joules, 1 J = 1 N·m.',
    'To convert units, multiply by **conversion factors** that equal 1, such as {{1000 m|1 km}} or {{1 h|3600 s}}. Arrange each factor so the unwanted unit cancels, exactly like cancelling numbers in a fraction. Because each factor equals 1, the physical quantity does not change — only its description does.',
    'Prefixes scale units by powers of ten: kilo (k) = 10^{3}, centi (c) = 10^{−2}, milli (m) = 10^{−3}, micro (μ) = 10^{−6}. For squared and cubed units the factor is squared or cubed: 1 m^{2} = (100 cm)^{2} = 10^{4} cm^{2}, and 1 m^{3} = 10^{6} cm^{3} = 1000 L.',
    '**Dimensional analysis** checks equations: both sides, and every term added together, must have the same dimensions. In x = x_{0} + v_{0}t + {{1|2}}at^{2}, each term is a length: m, (m/s)(s) = m, (m/s^{2})(s^{2}) = m. You can add metres to metres, never metres to seconds.',
    '**Significant figures** communicate precision. When multiplying or dividing, keep as many significant figures as the least precise input. When adding or subtracting, keep as many decimal places as the least precise input. Keep extra digits during a calculation and round only the final answer.',
  ],
  background: [
    { title: 'Powers of ten', text: '10^{a} × 10^{b} = 10^{a+b}; {{10^{a}|10^{b}}} = 10^{a−b}. Scientific notation writes 0.00052 as 5.2 × 10^{−4}.' },
    { title: 'Rearranging a formula', text: 'To make t the subject of v = at, divide both sides by a: t = v/a. Do the same operation to both sides.' },
  ],
  definitions: [
    ['SI base units (mechanics)', 'metre (m), kilogram (kg), second (s). Others include the kelvin (K), mole (mol) and ampere (A).'],
    ['Derived unit', 'A combination of base units, e.g. newton N = kg·m/s^{2}, joule J = N·m = kg·m^{2}/s^{2}, watt W = J/s, pascal Pa = N/m^{2}.'],
    ['Conversion factor', 'A ratio equal to 1, such as 1000 m/1 km, used to change units without changing the quantity.'],
    ['Dimension', 'The type of a quantity: length [L], mass [M], time [T]. Speed has dimensions [L]/[T].'],
    ['Significant figures', 'The digits that carry meaning about precision: all non-zero digits, zeros between them, and trailing zeros after a decimal point. Leading zeros (0.004) are not significant.'],
    ['Accuracy and precision', 'Accuracy: closeness to the true value. Precision: closeness of repeated measurements to each other (and the fineness of the scale).'],
  ],
  symbols: [
    ['m, kg, s', 'metre, kilogram, second', 'SI base units'],
    ['N', 'newton, unit of force', 'kg·m/s²'],
    ['J', 'joule, unit of energy and work', 'N·m = kg·m²/s²'],
    ['ρ (rho)', 'density = mass/volume', 'kg/m³ (or g/cm³)'],
  ],
  formulas: [
    { name: 'Speed conversion', f: '1 m/s = 3.6 km/h;   v(m/s) = {{v(km/h)|3.6}}', when: 'Exact, since 1 km = 1000 m and 1 h = 3600 s.' },
    { name: 'Area and volume conversions', f: '1 m^{2} = 10^{4} cm^{2};   1 m^{3} = 10^{6} cm^{3} = 10^{3} L;   1 mL = 1 cm^{3}', when: 'Square or cube the length factor.' },
    { name: 'Density', f: 'ρ = {{m|V}}', when: 'For a uniform material. 1 g/cm^{3} = 1000 kg/m^{3} (water ≈ 1.00 g/cm³ near room temperature).' },
    { name: 'Dimensional consistency', f: '[left side] = [right side];  only like dimensions can be added', when: 'Always required. Consistency does not prove an equation correct (pure-number factors such as 1/2 are invisible), but inconsistency proves it wrong.' },
    { name: 'Rounding rules', f: '× ÷ : fewest significant figures;   + − : fewest decimal places', when: 'Apply to the final answer. Exact numbers (counted objects, defined conversions) do not limit precision.' },
  ],
  derivation: {
    title: 'Why 1 m/s = 3.6 km/h',
    intro: 'Convert 1 m/s to km/h with conversion factors.',
    steps: [
      ['1 {{m|s}} × {{1 km|1000 m}} × {{3600 s|1 h}}.', 'Arrange each factor so m and s cancel.'],
      ['= {{3600|1000}} {{km|h}} = 3.6 km/h.', 'Multiply the numbers; the units left are km/h.'],
    ],
    end: 'So to go from km/h to m/s divide by 3.6: 90 km/h = 25 m/s; 36 km/h = 10 m/s.',
  },
  figure: { svg: fig, caption: 'A conversion chain. Arrange each factor so that the unwanted unit appears once on top and once underneath, then cancel.' },
  table: {
    caption: 'Common SI prefixes',
    head: ['prefix', 'symbol', 'factor', 'example'],
    rows: [['giga', 'G', '10⁹', '1 GW = 10⁹ W'], ['mega', 'M', '10⁶', '1 MPa = 10⁶ Pa'], ['kilo', 'k', '10³', '1 km = 1000 m'], ['centi', 'c', '10⁻²', '1 cm = 0.01 m'], ['milli', 'm', '10⁻³', '1 mm = 0.001 m'], ['micro', 'μ', '10⁻⁶', '1 μs = 10⁻⁶ s'], ['nano', 'n', '10⁻⁹', '1 nm = 10⁻⁹ m']],
    note: 'Note the capital M (mega) versus lower-case m (milli): a factor of 10⁹ apart.',
  },
  method: {
    title: 'How to handle units in any calculation',
    steps: [
      'Write every given quantity with its unit, and convert all of them to SI (m, kg, s) before substituting.',
      'Build conversions as chains of factors equal to 1; check that unwanted units cancel.',
      'Before substituting numbers, check the dimensions of the formula you are using.',
      'Carry units through the calculation; the unit of the answer should appear automatically.',
      'Round the final answer to the appropriate number of significant figures, and ask whether its size is reasonable.',
    ],
  },
  examples: [
    {
      title: 'Speed conversion',
      problem: 'Convert 36 km/h to m/s.',
      steps: [
        ['36 {{km|h}} × {{1000 m|1 km}} × {{1 h|3600 s}}.', 'km and h cancel.'],
        ['= {{36 000|3600}} m/s = 10 m/s.', 'Multiply the numbers.'],
      ],
      result: '36 km/h = 10 m/s.',
      meaning: 'Quick check: divide by 3.6.',
    },
    {
      title: 'Density with a unit conversion',
      problem: 'A sample has mass 250 g and volume 100 cm^{3}. Find its density in g/cm^{3} and in kg/m^{3}.',
      steps: [
        ['ρ = {{250 g|100 cm^{3}}} = 2.5 g/cm^{3}.', 'Definition of density.'],
        ['2.5 {{g|cm^{3}}} × {{1 kg|1000 g}} × {{10^{6} cm^{3}|1 m^{3}}} = 2500 kg/m^{3}.', '1 m³ = 10⁶ cm³ (cube of 100 cm/m).'],
      ],
      result: 'ρ = 2.5 g/cm^{3} = 2.5 × 10^{3} kg/m^{3}.',
      meaning: 'About two and a half times as dense as water — typical of rock or aluminium (2.70 g/cm³).',
    },
    {
      title: 'Dimensional check of an equation',
      problem: 'A student writes v^{2} = v_{0}^{2} + 2at for motion with constant acceleration. Is it dimensionally correct?',
      steps: [
        ['Left side: (m/s)^{2} = m^{2}/s^{2}.', 'Dimensions of velocity squared.'],
        ['Term 2at: (m/s^{2})(s) = m/s.', 'Acceleration times time is a velocity, not a velocity squared.'],
        ['m^{2}/s^{2} cannot be added to m/s.', 'Terms added together must have the same dimensions.'],
      ],
      result: 'The equation is wrong. The correct form is v^{2} = v_{0}^{2} + 2aΔx: (m/s²)(m) = m²/s².',
      meaning: 'A dimension check catches the error without any numbers.',
    },
    {
      title: 'Significant figures in a calculation',
      problem: 'A block measures 2.45 cm × 3.1 cm × 1.20 cm. Report its volume.',
      steps: [
        ['V = 2.45 × 3.1 × 1.20 = 9.114 cm^{3} (unrounded).', 'Multiply; keep all digits for now.'],
        ['The least precise factor, 3.1 cm, has 2 significant figures.', 'For multiplication, the fewest significant figures decide.'],
      ],
      result: 'V ≈ 9.1 cm^{3}.',
      meaning: 'Reporting 9.114 cm³ would claim a precision the measurements do not have.',
    },
    {
      title: 'An area conversion',
      problem: 'A plate has area 250 cm^{2}. Express it in m^{2}.',
      steps: [
        ['1 m = 100 cm, so 1 m^{2} = 100^{2} cm^{2} = 10^{4} cm^{2}.', 'Square the length factor.'],
        ['250 cm^{2} × {{1 m^{2}|10^{4} cm^{2}}} = 0.025 m^{2}.', 'Arrange to cancel cm².'],
      ],
      result: '0.025 m^{2} (= 2.5 × 10^{−2} m^{2}).',
      meaning: 'Using 100 instead of 10⁴ would give 2.5 m², a hundred times too large.',
    },
  ],
  mistakes: [
    ['Converting cm² to m² by dividing by 100.', 'Square the factor: divide by 10⁴. For volumes divide by 10⁶.'],
    ['Mixing units in one formula (km with m, minutes with seconds).', 'Convert everything to SI first.'],
    ['Rounding at every intermediate step.', 'Carry extra digits and round only the final answer, or rounding errors accumulate.'],
    ['“Dimensionally consistent means correct.”', 'Consistency is necessary, not sufficient; numerical factors like ½ cannot be checked by dimensions.'],
    ['Confusing mass (kg) and weight (N).', 'Mass is the amount of matter; weight is the gravitational force mg, measured in newtons.'],
  ],
  scope: [
    'Uncertainty propagation beyond significant-figure rules (standard deviations, combined uncertainties) is introduced in the laboratory topic and developed in laboratory courses.',
  ],
  checks: [
    ['36 km/h', 36 * 1000 / 3600, 10, 1e-12], ['90 km/h', 90 / 3.6, 25, 1e-12], ['density', 250 / 100, 2.5, 0],
    ['density SI', 2.5 / 1000 * 1e6, 2500, 1e-9], ['volume', 2.45 * 3.1 * 1.2, 9.114, 1e-9], ['area', 250 / 1e4, 0.025, 1e-15],
  ],
};
