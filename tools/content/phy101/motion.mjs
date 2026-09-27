import { plot, render, curve, dot, label, arrowSeg } from '../svg.mjs';

const g = 9.8, v0 = 20, th = Math.PI / 6, vx = v0 * Math.cos(th), vy = v0 * Math.sin(th);
const T = 2 * vy / g, R = vx * T, H = vy * vy / (2 * g);
const y = (x) => (vy / vx) * x - (g / (2 * vx * vx)) * x * x;
const fig = render('phy-proj', {
  title: 'Projectile launched at 20 m/s and 30° above the horizontal',
  desc: 'A parabolic path from the origin to a landing point about 35 m away, with maximum height about 5.1 m at x ≈ 17.7 m. At the launch point the velocity arrow is split into a horizontal component of 17.3 m/s and a vertical component of 10 m/s. At the top, the velocity is horizontal only (17.3 m/s). Near the landing point the vertical component points down.',
}, plot({ w: 500, h: 290, x: [-4, 42], y: [-3, 8.5], xticks: [10, 20], yticks: [2, 4, 6], xlabel: 'x (m)', ylabel: 'y (m)' }, [
  curve(y, 0, R),
  arrowSeg(0, 0, 5.5, 0, 'b'), arrowSeg(0, 0, 0, 3.4, 'c'),
  label(0.3, -1.9, 'vx = 17.3 m/s', { size: 13, color: '#9b6328' }),
  label(0.6, 3.9, 'vy = +10', { size: 13, color: '#b3412e' }),
  dot(R / 2, H, { color: '#183b3f', r: 4.5 }), arrowSeg(R / 2, H, R / 2 + 5.5, H, 'b'),
  label(R / 2, H, 'top: vy = 0, vx = 17.3 m/s', { dy: -14, anchor: 'middle', size: 13 }),
  arrowSeg(R, 0, R + 5.5, 0, 'b'), arrowSeg(R, 0, R, -2.6, 'c'),
  label(R, -2.4, 'vy = −10', { dx: -8, anchor: 'end', size: 13, color: '#b3412e' }),
  label(R, 0, 'lands at 35.3 m', { dx: -2, dy: -10, anchor: 'end', size: 13 }),
]));

export default {
  summary: 'Describe motion with position, velocity and acceleration as vectors; with constant acceleration, four equations predict everything, and horizontal and vertical motions are independent.',
  why: [
    'Kinematics — the description of motion — is the language of all mechanics. Before asking why something moves (forces), you need to describe how it moves: where it is, how fast, in which direction, and how that changes. Braking distances, falling objects, thrown or launched objects and conveyor systems are all kinematics.',
  ],
  idea: [
    'Many physical quantities have a direction as well as a size. **Vectors** (displacement, velocity, acceleration, force) have magnitude and direction; **scalars** (distance, speed, time, mass, energy) have magnitude only. In one dimension the direction is shown by a sign after choosing a positive direction: +5 m/s means 5 m/s in the positive direction, −5 m/s means 5 m/s the other way.',
    '**Displacement** Δx = x_{f} − x_{i} is the change in position, not the distance travelled: walk 3 m east and 3 m back and your displacement is 0 though you walked 6 m. **Velocity** is the rate of change of position, v = dx/dt; **acceleration** is the rate of change of velocity, a = dv/dt. Acceleration is not “speed”: a car braking while moving forward has negative acceleration (with forward positive), and a ball at the top of its flight has zero velocity but acceleration −9.8 m/s².',
    'On graphs: the slope of a position–time graph is velocity; the slope of a velocity–time graph is acceleration; the area under a velocity–time graph is displacement.',
    'When acceleration is **constant**, the four “kinematic equations” below follow from these definitions. Choose the one that contains the unknown and three known quantities. Free fall near the Earth’s surface, neglecting air resistance, is constant acceleration with a = −g = −9.8 m/s² (taking up as positive).',
    'In two dimensions, resolve vectors into perpendicular components. For a projectile with no air resistance, the horizontal and vertical motions are **independent**: horizontally a_{x} = 0, so v_{x} is constant; vertically a_{y} = −g. The same time t links them. At the top of the path v_{y} = 0, but v_{x} and the acceleration g are unchanged.',
  ],
  background: [
    { title: 'Right-triangle trigonometry', text: 'For a vector of magnitude A at angle θ above the +x axis: A_{x} = A cos θ, A_{y} = A sin θ, and A = √{A_{x}^{2} + A_{y}^{2}}, tan θ = A_{y}/A_{x}.' },
    { title: 'Quadratic formula', text: 'at^{2} + bt + c = 0 has t = {{−b ± √{b^{2} − 4ac}|2a}}. In kinematics, keep the root that makes physical sense (usually t > 0).' },
    { title: 'Derivatives as rates', text: 'v = dx/dt and a = dv/dt (see Mathematics: “Derivative as a rate”).' },
  ],
  definitions: [
    ['Position and displacement', 'x is location relative to a chosen origin; displacement Δx = x_{f} − x_{i} (vector).'],
    ['Average velocity', 'v_{avg} = {{Δx|Δt}}; average speed = total distance/time (scalar, never negative).'],
    ['Instantaneous velocity', 'v = {{dx|dt}}, the slope of the x–t graph.'],
    ['Acceleration', 'a = {{dv|dt}}, the slope of the v–t graph. Units m/s².'],
    ['Free fall', 'Motion under gravity alone: acceleration g = 9.8 m/s² downward, independent of mass (air resistance neglected).'],
    ['Projectile', 'An object moving in two dimensions under gravity alone: constant horizontal velocity, constant downward acceleration g.'],
  ],
  symbols: [
    ['x, y', 'position coordinates', 'm'],
    ['v_{0}, v', 'initial and final velocity (signed)', 'm/s'],
    ['a', 'acceleration (signed, constant here)', 'm/s²'],
    ['t', 'time elapsed', 's'],
    ['g', 'magnitude of free-fall acceleration, 9.8 m/s² (9.81 in some texts)', 'm/s²'],
    ['θ', 'launch angle above the horizontal', '° or rad'],
  ],
  formulas: [
    { name: 'Constant-acceleration equations', f: 'v = v_{0} + at;   Δx = v_{0}t + {{1|2}}at^{2};   v^{2} = v_{0}^{2} + 2aΔx;   Δx = {{v_{0} + v|2}}t', when: 'Only when a is constant. All quantities signed relative to one chosen positive direction.' },
    { name: 'Vector components', f: 'A_{x} = A cos θ,  A_{y} = A sin θ;   A = √{A_{x}^{2} + A_{y}^{2}}', when: 'θ measured from the +x axis. If θ is measured from another direction, sin and cos swap — draw the triangle.' },
    { name: 'Projectile motion', f: 'x = v_{0} cos θ · t;   y = v_{0} sin θ · t − {{1|2}}gt^{2};   v_{y} = v_{0} sin θ − gt', when: 'No air resistance; up positive; launch from the origin.' },
    { name: 'Level-ground results', f: 'time of flight T = {{2v_{0} sin θ|g}};   range R = {{v_{0}^{2} sin 2θ|g}};   max height H = {{(v_{0} sin θ)^{2}|2g}}', when: 'Only when launch and landing heights are equal. Otherwise solve the y-equation for t.' },
    { name: 'Relative velocity', f: 'v_{A relative to C} = v_{A relative to B} + v_{B relative to C}', when: 'Vector addition (Galilean relativity, speeds much less than light).' },
  ],
  derivation: {
    title: 'Where Δx = v₀t + ½at² comes from',
    intro: 'For constant a, the velocity–time graph is a straight line from v_{0} to v = v_{0} + at.',
    steps: [
      ['Displacement = area under the v–t graph.', 'Area of (velocity × time) has units of metres.'],
      ['The area is a rectangle v_{0}t plus a triangle {{1|2}}t(v − v_{0}) = {{1|2}}t(at).', 'Split the trapezium.'],
      ['Δx = v_{0}t + {{1|2}}at^{2}.', 'Add the two parts.'],
      ['Eliminating t with t = (v − v_{0})/a gives v^{2} = v_{0}^{2} + 2aΔx.', 'Useful when time is not given.'],
    ],
    end: 'In calculus terms, the equations come from integrating a = dv/dt and v = dx/dt with a constant.',
  },
  figure: { svg: fig, caption: 'The horizontal velocity (gold) stays 17.3 m/s throughout. The vertical velocity (red) starts at +10 m/s, is zero at the top and is −10 m/s on landing. Arrows are not to the same scale as the axes.' },
  table: {
    caption: 'The projectile (20 m/s at 30°, g = 9.8 m/s²) at selected times',
    head: ['t (s)', 'x (m)', 'y (m)', 'v_{x} (m/s)', 'v_{y} (m/s)'],
    rows: [['0', '0', '0', '17.3', '10.0'], ['0.5', '8.66', '3.78', '17.3', '5.10'], ['1.02', '17.7', '5.10', '17.3', '0'], ['1.5', '26.0', '3.98', '17.3', '−4.70'], ['2.04', '35.3', '0', '17.3', '−10.0']],
    note: 'v_{x} never changes; v_{y} decreases by 9.8 m/s every second. The motion is symmetric about the top.',
  },
  method: {
    title: 'Kinematics problem-solving',
    steps: [
      'Sketch the motion. Choose an origin and a positive direction (for 2D: x horizontal, y up).',
      'List knowns and the unknown with signs: v_{0}, v, a, Δx, t. In free fall a = −9.8 m/s² (up positive).',
      'Check that the acceleration is constant during the stage you analyse; split the motion into stages if it changes.',
      'Choose the equation that contains the unknown and only known quantities.',
      'For 2D: resolve the initial velocity, treat x and y separately, and connect them through t.',
      'Check sign, units and size of the answer.',
    ],
  },
  examples: [
    {
      title: 'Speed after constant acceleration',
      problem: 'A cart starts from rest and accelerates at 3 m/s^{2} for 4 s. Find its final speed and the distance travelled.',
      steps: [
        ['v_{0} = 0, a = 3 m/s^{2}, t = 4 s.', 'List the knowns.'],
        ['v = v_{0} + at = 0 + 3 × 4 = 12 m/s.', 'Equation containing v, v₀, a, t.'],
        ['Δx = v_{0}t + {{1|2}}at^{2} = 0 + {{1|2}}(3)(16) = 24 m.', 'Equation containing Δx.'],
      ],
      result: 'v = 12 m/s; Δx = 24 m.',
      meaning: 'Check with the average velocity: (0 + 12)/2 × 4 = 24 m.',
    },
    {
      title: 'Braking distance',
      problem: 'A car travelling at 25 m/s brakes with constant deceleration 5 m/s^{2}. How far does it travel before stopping?',
      steps: [
        ['Take forward positive: v_{0} = 25 m/s, v = 0, a = −5 m/s^{2}.', 'Braking acceleration opposes the motion, so it is negative.'],
        ['v^{2} = v_{0}^{2} + 2aΔx ⇒ 0 = 625 + 2(−5)Δx.', 'Time is not needed, so use the equation without t.'],
        ['Δx = {{625|10}} = 62.5 m.', 'Solve.'],
      ],
      result: '62.5 m.',
      meaning: 'Braking distance is proportional to v²: at double the speed (50 m/s) it would be four times as long, 250 m.',
    },
    {
      title: 'Vertical throw',
      problem: 'A ball is thrown straight up at 15 m/s. Find its maximum height and the time to reach it (g = 9.8 m/s^{2}).',
      steps: [
        ['Up positive: v_{0} = +15 m/s, a = −9.8 m/s^{2}; at the top v = 0.', 'The ball stops momentarily at the top.'],
        ['Height: 0 = 15^{2} + 2(−9.8)Δy ⇒ Δy = {{225|19.6}} = 11.5 m.', 'v² = v₀² + 2aΔy.'],
        ['Time: 0 = 15 − 9.8t ⇒ t = 1.53 s.', 'v = v₀ + at.'],
      ],
      result: 'Maximum height ≈ 11.5 m, reached after ≈ 1.53 s.',
      meaning: 'At the top the velocity is 0 but the acceleration is still −9.8 m/s²; otherwise the ball would stay there.',
    },
    {
      title: 'Projectile on level ground',
      problem: 'A ball is launched at 20 m/s, 30° above the horizontal, over level ground. Find the time of flight, the range and the maximum height.',
      steps: [
        ['Components: v_{x} = 20 cos 30° = 17.32 m/s, v_{y0} = 20 sin 30° = 10.0 m/s.', 'Resolve the launch velocity.'],
        ['Landing: y = 0 = 10t − 4.9t^{2} ⇒ t = {{10|4.9}} = 2.04 s (t = 0 is the launch).', 'Vertical motion alone decides the time.'],
        ['Range: x = 17.32 × 2.041 = 35.3 m.', 'Constant horizontal velocity times the same time.'],
        ['Maximum height: v_{y} = 0 ⇒ H = {{10^{2}|2 × 9.8}} = 5.10 m.', 'v_{y}^{2} = v_{y0}^{2} − 2gH.'],
      ],
      result: 'T ≈ 2.04 s, R ≈ 35.3 m, H ≈ 5.10 m.',
      meaning: 'Check with R = v₀² sin 2θ/g = 400 × sin 60°/9.8 = 35.3 m. A 60° launch would give the same range but a higher path.',
    },
    {
      title: 'A horizontal launch from a height',
      problem: 'A stone is thrown horizontally at 8 m/s from a cliff 20 m high. Where does it land?',
      steps: [
        ['Vertical: v_{y0} = 0, Δy = −20 m: −20 = −4.9t^{2} ⇒ t = √{{{20|4.9}}} = 2.02 s.', 'Horizontal launch means zero initial vertical velocity.'],
        ['Horizontal: x = 8 × 2.02 = 16.2 m.', 'v_x is constant.'],
      ],
      result: 'It lands about 16.2 m from the foot of the cliff after 2.02 s.',
      meaning: 'The level-ground range formula does not apply here, because launch and landing heights differ.',
    },
  ],
  mistakes: [
    ['Treating distance and displacement as the same.', 'Displacement is a signed vector change in position; distance is the total path length.'],
    ['Deceleration means negative acceleration.', 'An object slows down when a and v have opposite signs. Moving in the negative direction and speeding up also gives negative a.'],
    ['“At the top, acceleration is zero.”', 'Velocity is zero at the top; acceleration is still g downward.'],
    ['Using constant-acceleration equations when a changes.', 'Split the motion into stages of constant a, or use calculus.'],
    ['Using the range formula when launch and landing heights differ.', 'Solve the vertical equation for t instead.'],
    ['Mixing sin and cos in components.', 'cos goes with the side adjacent to the angle. Draw the triangle.'],
  ],
  scope: [
    'Air resistance is neglected throughout; it is discussed qualitatively in the collection notes (terminal speed).',
    'g is taken as 9.8 m/s²; use your course’s value (9.81 m/s²) if required — answers change slightly.',
  ],
  checks: [
    ['vx', vx, 17.32, 0.005], ['T', T, 2.04, 0.005], ['R', R, 35.3, 0.05], ['H', H, 5.10, 0.005],
    ['cart', 3 * 4, 12, 0], ['cart dist', 0.5 * 3 * 16, 24, 0], ['brake', 625 / 10, 62.5, 0],
    ['throw H', 225 / 19.6, 11.5, 0.05], ['throw t', 15 / 9.8, 1.53, 0.005],
    ['table t=0.5 y', 10 * 0.5 - 4.9 * 0.25, 3.78, 0.01], ['table t=1.5 y', 10 * 1.5 - 4.9 * 2.25, 3.98, 0.01], ['table vy 1.5', 10 - 9.8 * 1.5, -4.7, 1e-9],
    ['range formula', 400 * Math.sin(Math.PI / 3) / 9.8, 35.3, 0.05],
    ['cliff t', Math.sqrt(20 / 4.9), 2.02, 0.005], ['cliff x', 8 * Math.sqrt(20 / 4.9), 16.2, 0.05],
  ],
};
