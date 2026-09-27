import { svg, line, text, vector, rect, path } from '../svg.mjs';

// Sliding ladder: wall, floor, ladder of 5 m with x = 3, y = 4.
const s = 40, ox = 120, oy = 250; // 1 m = 40 px
const fig = svg('ma-rr', { w: 480, h: 290, title: 'Sliding ladder: a 5 m ladder against a wall', desc: 'A wall on the left and the floor at the bottom. A ladder of length 5 m leans against the wall. The foot is x = 3 m from the wall and moves away at 0.5 m/s (arrow pointing right). The top is y = 4 m above the floor and slides down (arrow pointing down). The right triangle satisfies x² + y² = 25.' },
  rect(ox - 18, 20, 18, oy - 20, { fill: '#e1e8e3', stroke: '#183b3f', rx: 0 })
  + line(ox - 18, oy, 470, oy, { width: 2.5 })
  + line(ox, oy - 4 * s, ox + 3 * s, oy, { color: '#9b6328', width: 6 })
  + path(`M${ox},${oy - 16} L${ox + 16},${oy - 16} L${ox + 16},${oy}`, { color: '#183b3f', width: 1.5 })
  + vector(ox + 3 * s + 8, oy - 12, ox + 3 * s + 70, oy - 12, 'a')
  + text(ox + 3 * s + 76, oy - 20, 'dx/dt = 0.5 m/s', { color: '#176e66', size: 14 })
  + vector(ox + 60, oy - 4 * s - 10, ox + 60, oy - 4 * s + 40, 'c')
  + text(ox + 70, oy - 4 * s + 20, 'dy/dt = ? (top slides down)', { color: '#b3412e', size: 14 })
  + text(ox + 1.5 * s, oy + 22, 'x = 3 m', { anchor: 'middle' })
  + text(ox - 26, oy - 2 * s, 'y = 4 m', { anchor: 'end', size: 14 })
  + text(ox + 1.9 * s, oy - 2.3 * s, 'L = 5 m', { color: '#9b6328' })
  + text(300, 40, 'x² + y² = 25 at every instant', { anchor: 'middle', size: 14, color: '#5e7376' }));

export default {
  summary: 'When quantities are linked by an equation, their rates of change are linked too. Differentiate the equation with respect to time.',
  why: [
    'In real systems several quantities change at the same time and depend on each other: the level and the volume of liquid in a tank, the radius and the area of a spreading spill, the pressure and volume of a gas. Often one rate is easy to measure and another is what you need. Related rates turn a geometric or physical relationship into a relationship between rates.',
  ],
  idea: [
    'Suppose two quantities x and y both depend on time t and are always connected by an equation, such as x^{2} + y^{2} = 25 for a ladder of length 5 m. Because the equation holds at every instant, the two sides change at the same rate. Differentiating both sides with respect to t (using the chain rule) gives an equation connecting {{dx|dt}} and {{dy|dt}}.',
    'The chain rule is the key step. Since x is a function of t, {{d|dt}}(x^{2}) = 2x{{dx|dt}}, not 2x. Every variable that changes with time brings its own rate factor.',
    'There is one crucial order of operations: **differentiate first, substitute the instantaneous values second.** If you substitute x = 3 before differentiating, x becomes a constant and its rate disappears. Only quantities that are genuinely constant (a fixed ladder length, a fixed tank cross-section) may be substituted before differentiating.',
    'Signs carry meaning. A negative rate means the quantity is decreasing. In the ladder problem the top slides down, so {{dy|dt}} comes out negative, and that is correct.',
  ],
  background: [
    { title: 'Chain rule', text: 'If y depends on t, then {{d|dt}} f(y) = f′(y){{dy|dt}}. Examples: {{d|dt}}(r^{2}) = 2r{{dr|dt}}; {{d|dt}}(V) = {{dV|dt}}.' },
    { title: 'Geometry formulas', text: 'Circle area A = πr^{2}; sphere volume V = {{4|3}}πr^{3}; cylinder volume V = πr^{2}h; cone volume V = {{1|3}}πr^{2}h; Pythagoras a^{2} + b^{2} = c^{2}; similar triangles give equal ratios of corresponding sides.' },
  ],
  definitions: [
    ['Rate of change with respect to time', '{{dQ|dt}} is how fast a quantity Q changes per unit time. Positive: Q increasing; negative: Q decreasing.'],
    ['Related rates', 'Rates of change of quantities that are linked by an equation. Differentiating the equation with respect to t links the rates.'],
    ['Instantaneous value', 'The value of a changing quantity at the particular moment asked about (for example, “when x = 3 m”). It is substituted only after differentiating.'],
  ],
  symbols: [
    ['t', 'time', 's, min, …'],
    ['{{dx|dt}}, {{dV|dt}}', 'rate of change of x or V', 'units of x (or V) per unit time'],
    ['r, h, V, A', 'radius, height, volume, area', 'm, m, m³, m²'],
  ],
  formulas: [
    { name: 'General pattern', f: 'F(x, y) = constant  ⇒  {{d|dt}}F(x, y) = 0', when: 'The equation must hold for all times in the interval, not just at one instant.' },
    { name: 'Chain rule in time', f: '{{d|dt}} x^{n} = nx^{n−1}{{dx|dt}}', when: 'x is a differentiable function of t.' },
    { name: 'Tank with constant cross-section', f: 'V = Ah  ⇒  {{dV|dt}} = A{{dh|dt}}', when: 'Only when the cross-sectional area A is constant (a vertical cylinder or prism). For a cone or sphere A changes with h.' },
  ],
  derivation: {
    title: 'Why the circle’s area grows faster when the circle is larger',
    intro: 'A circular oil spill has A = πr^{2}. Differentiate with respect to t.',
    steps: [
      ['{{dA|dt}} = 2πr{{dr|dt}}.', 'Chain rule: r depends on t.'],
      ['2πr is the circumference.', 'A thin ring of width Δr added around the edge has area ≈ (circumference)·Δr.'],
    ],
    end: 'For the same outward speed dr/dt, a larger spill adds a longer ring each second, so its area grows faster. The formula expresses a picture.',
  },
  figure: { svg: fig, caption: 'A 5 m ladder slides away from a wall. The foot and the top move at different speeds, but x² + y² = 25 links them at every instant.' },
  table: {
    caption: 'The ladder at different moments (foot moving out at 0.5 m/s)',
    head: ['x (m)', 'y (m)', 'dy/dt = −(x/y)(dx/dt) (m/s)'],
    rows: [['1', '4.899', '−0.102'], ['3', '4', '−0.375'], ['4', '3', '−0.667'], ['4.8', '1.4', '−1.714']],
    note: 'The foot moves at a constant speed, but the top falls faster and faster as it approaches the floor. The rate depends on the instant.',
  },
  method: {
    title: 'Related-rates procedure',
    steps: [
      'Draw a diagram. Label the quantities that change with letters, and write constants as numbers.',
      'Write down the given rate(s) and the rate you want, with units and signs (decreasing ⇒ negative).',
      'Find an equation that links the quantities at every instant (geometry or physics). If it has an extra variable, remove it using another relation, such as similar triangles.',
      'Differentiate both sides with respect to t, using the chain rule for every changing quantity.',
      'Only now substitute the values at the given instant (use the equation itself to find any missing value), and solve for the unknown rate.',
      'State the answer with units and interpret the sign.',
    ],
  },
  examples: [
    {
      title: 'The sliding ladder',
      problem: 'A 5 m ladder leans against a wall. Its foot slides away at 0.5 m/s. How fast is the top sliding down when the foot is 3 m from the wall?',
      steps: [
        ['Let x = distance of the foot from the wall and y = height of the top. Then x^{2} + y^{2} = 25.', 'Pythagoras holds at every instant; the length 5 m is constant.'],
        ['Differentiate: 2x{{dx|dt}} + 2y{{dy|dt}} = 0.', 'Both x and y depend on t.'],
        ['At the instant: x = 3, so y = √{25 − 9} = 4. Given {{dx|dt}} = 0.5.', 'Use the original equation to find y.'],
        ['2(3)(0.5) + 2(4){{dy|dt}} = 0 ⇒ {{dy|dt}} = −{{3|8}} = −0.375.', 'Solve for the unknown rate.'],
      ],
      result: '{{dy|dt}} = −0.375 m/s: the top slides down at 0.375 m/s.',
      meaning: 'The negative sign means y is decreasing, which matches the picture.',
    },
    {
      title: 'A growing square',
      problem: 'A square’s side is 4 m and increasing at 0.5 m/min. How fast is its area increasing?',
      steps: [
        ['A = s^{2}.', 'Relationship at every instant.'],
        ['{{dA|dt}} = 2s{{ds|dt}}.', 'Differentiate with respect to t.'],
        ['= 2(4)(0.5) = 4.', 'Substitute s = 4 and ds/dt = 0.5 after differentiating.'],
      ],
      result: '{{dA|dt}} = 4 m^{2}/min.',
      meaning: 'Substituting s = 4 first would give A = 16, a constant, and a wrong rate of 0.',
    },
    {
      title: 'Filling a cylindrical tank',
      problem: 'A vertical cylindrical tank has cross-sectional area 3 m^{2}. The level rises at 0.2 m/min. How fast is the volume increasing?',
      steps: [
        ['V = Ah with A = 3 m^{2} constant.', 'For a vertical cylinder the cross-section does not change with height.'],
        ['{{dV|dt}} = A{{dh|dt}} = 3 × 0.2.', 'Differentiate; A is a constant factor.'],
      ],
      result: '{{dV|dt}} = 0.6 m^{3}/min.',
      meaning: 'Equivalently, 600 L of liquid enter per minute.',
    },
    {
      title: 'Filling a conical tank (similar triangles)',
      problem: 'Water flows at 2 m^{3}/min into an inverted cone of height 4 m and top radius 2 m. How fast is the level rising when the water is 2 m deep?',
      steps: [
        ['V = {{1|3}}πr^{2}h, where r is the radius of the water surface.', 'Volume of a cone.'],
        ['Similar triangles: {{r|h}} = {{2|4}}, so r = {{h|2}} and V = {{1|3}}π{{h^{2}|4}}h = {{π|12}}h^{3}.', 'Eliminate r so that V depends on h alone.'],
        ['{{dV|dt}} = {{π|4}}h^{2}{{dh|dt}}.', 'Differentiate with respect to t.'],
        ['2 = {{π|4}}(2)^{2}{{dh|dt}} = π{{dh|dt}} ⇒ {{dh|dt}} = {{2|π}}.', 'Substitute h = 2 and dV/dt = 2 only now.'],
      ],
      result: '{{dh|dt}} = {{2|π}} ≈ 0.637 m/min.',
      meaning: 'Because the cone narrows downwards, the level rises faster when the water is shallow.',
    },
    {
      title: 'An inflating balloon',
      problem: 'Air is pumped into a spherical balloon at 100 cm^{3}/s. How fast is the radius increasing when r = 5 cm?',
      steps: [
        ['V = {{4|3}}πr^{3}.', 'Volume of a sphere.'],
        ['{{dV|dt}} = 4πr^{2}{{dr|dt}}.', 'Differentiate; 4πr^{2} is the surface area.'],
        ['100 = 4π(25){{dr|dt}} ⇒ {{dr|dt}} = {{1|π}}.', 'Substitute r = 5 after differentiating.'],
      ],
      result: '{{dr|dt}} = {{1|π}} ≈ 0.318 cm/s.',
      meaning: 'As the balloon grows, the same air flow spreads over a larger surface, so the radius grows more slowly.',
    },
  ],
  mistakes: [
    ['Substituting the instantaneous value before differentiating.', 'Differentiate first. A quantity that changes must stay a variable until after differentiation.'],
    ['Writing {{d|dt}}(x^{2}) = 2x.', 'x depends on t, so {{d|dt}}(x^{2}) = 2x{{dx|dt}}.'],
    ['Ignoring the sign of a decreasing quantity.', 'A draining tank has dV/dt < 0; a falling ladder top has dy/dt < 0. Use the sign in the equation and interpret it at the end.'],
    ['Using V = Ah for a cone.', 'The cross-section of a cone changes with height. Use similar triangles to write V in terms of one variable.'],
    ['Mixing units (cm with m, minutes with seconds).', 'Convert all quantities to one unit system before substituting.'],
  ],
  scope: [
    'The problems use explicit geometric or physical relationships; setting up models with several independent unknowns needs extra equations.',
    'All rates are with respect to time t; the same method works for any common independent variable.',
  ],
  checks: [
    ['ladder dy/dt', -(3 * 0.5) / 4, -0.375, 1e-12],
    ['table x=4', -(4 / 3) * 0.5, -0.667, 1e-3],
    ['table x=1 y', Math.sqrt(24), 4.899, 1e-3], ['table x=1 rate', -(1 / Math.sqrt(24)) * 0.5, -0.102, 1e-3],
    ['table x=4.8 y', Math.sqrt(25 - 4.8 ** 2), 1.4, 1e-9], ['table x=4.8 rate', -(4.8 / 1.4) * 0.5, -1.714, 1e-3],
    ['square', 2 * 4 * 0.5, 4, 0], ['cylinder', 3 * 0.2, 0.6, 1e-12],
    ['cone', 2 / (Math.PI / 4 * 4), 2 / Math.PI, 1e-12], ['cone value', 2 / Math.PI, 0.637, 1e-3],
    ['balloon', 100 / (4 * Math.PI * 25), 1 / Math.PI, 1e-12],
  ],
};
