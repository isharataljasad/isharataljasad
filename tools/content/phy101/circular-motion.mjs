import { svg, circle, vector, text, line } from '../svg.mjs';

const cx = 200, cy = 150, r = 100;
const pt = (deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
const at = (deg) => {
  const [x, y] = pt(deg), t = [-Math.sin(deg * Math.PI / 180), -Math.cos(deg * Math.PI / 180)]; // screen tangent (counter-clockwise)
  return circle(x, y, 6, { fill: '#183b3f' })
    + vector(x, y, x + t[0] * 70, y + t[1] * 70, 'd')
    + vector(x, y, x + (cx - x) * 0.55, y + (cy - y) * 0.55, 'c');
};
const fig = svg('phy-circ', { w: 480, h: 300, title: 'Velocity and acceleration in uniform circular motion', desc: 'A circle of radius r traversed counter-clockwise at constant speed. At two positions the velocity arrow is tangent to the circle and the acceleration arrow points to the centre. The velocity has constant length but changes direction; the acceleration always points inward.' },
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#176e66" stroke-width="2.5" stroke-dasharray="3 5"/>`
  + circle(cx, cy, 4, { fill: '#5e7376' }) + text(cx + 10, cy + 5, 'centre', { size: 13, color: '#5e7376' })
  + line(cx, cy, ...pt(200), { color: '#5e7376', width: 1.4, dash: '4 3' }) + text(cx - 50, cy + 8, 'r', { italic: true, color: '#5e7376' })
  + at(30) + at(120)
  + text(pt(30)[0] - 8, pt(30)[1] - 64, 'v (tangent)', { size: 14, color: '#355b90' })
  + text(pt(30)[0] + 4, pt(30)[1] + 44, 'a = v²/r', { size: 14, color: '#b3412e' })
  + text(330, 240, 'speed constant,', { size: 14 }) + text(330, 260, 'direction changing', { size: 14 }) + text(330, 280, '⇒ acceleration inward', { size: 14, color: '#b3412e' }));

export default {
  summary: 'An object moving in a circle at constant speed is accelerating towards the centre, a = v²/r. Some real force (tension, friction, gravity, normal force) must supply the net inward force mv²/r.',
  why: [
    'Cars rounding bends, centrifuges, rotating machinery, satellites and roller coaster loops all move on curved paths. Designing a safe road bend (friction and banking), a centrifuge (separation force) or a rotating shaft (stresses) needs the relationship between speed, radius and inward force.',
  ],
  idea: [
    'Velocity is a vector. In uniform circular motion the speed is constant, but the **direction** of the velocity changes continuously (it is always tangent to the circle). A change of velocity is an acceleration, so the object is accelerating even though its speed does not change.',
    'The acceleration points towards the centre (**centripetal** means “centre-seeking”) and has magnitude a_{c} = {{v^{2}|r}}. Faster motion or a tighter circle means more acceleration: doubling the speed quadruples it.',
    'By Newton’s second law, a net force towards the centre is required: ΣF_{in} = {{mv^{2}|r}}. This is not a new kind of force. It is the net result of real forces: the tension in a string whirling a ball, friction between tyres and road, gravity on a satellite, the normal force from a banked track or loop. On a free-body diagram you draw the real forces only, never a separate “centripetal force”.',
    'If the inward force disappears (a string breaks), the object does not fly outward along the radius; it continues in a straight line along the tangent, as the first law says. The outward “push” you feel in a turning car is your body’s inertia, not a real outward force.',
    'Circular motion is often described with angles: the **angular speed** ω = Δθ/Δt in rad/s, with v = ωr, and the **period** T (time for one revolution), with v = {{2πr|T}} and ω = {{2π|T}}.',
  ],
  background: [
    { title: 'Radians', text: 'An angle in radians is arc length divided by radius: θ = s/r. One revolution = 2π rad = 360°. rpm (revolutions per minute) × 2π/60 gives rad/s.' },
    { title: 'Newton’s second law along a chosen axis', text: 'Take the positive axis pointing towards the centre: ΣF_{toward centre} = m·{{v^{2}|r}}.' },
  ],
  definitions: [
    ['Uniform circular motion', 'Motion on a circle at constant speed.'],
    ['Centripetal acceleration', 'a_{c} = {{v^{2}|r}} = ω^{2}r, directed towards the centre.'],
    ['Period T and frequency f', 'T is the time for one revolution; f = 1/T revolutions per second (Hz).'],
    ['Angular speed ω', 'ω = {{Δθ|Δt}} = {{2π|T}} (rad/s); v = ωr.'],
    ['Banked curve', 'A road tilted at angle θ so that the horizontal component of the normal force helps provide the inward force.'],
  ],
  symbols: [
    ['r', 'radius of the circular path', 'm'], ['v', 'speed', 'm/s'], ['a_{c}', 'centripetal acceleration', 'm/s²'],
    ['T', 'period', 's'], ['ω', 'angular speed', 'rad/s'], ['μ_{s}', 'coefficient of static friction', '—'],
  ],
  formulas: [
    { name: 'Centripetal acceleration', f: 'a_{c} = {{v^{2}|r}} = ω^{2}r', when: 'Uniform circular motion; directed towards the centre. For non-uniform circular motion this is the radial part of the acceleration.' },
    { name: 'Net inward force', f: 'ΣF_{in} = {{mv^{2}|r}}', when: 'Sum of the components of the real forces along the radius, towards the centre positive.' },
    { name: 'Speed, period, angular speed', f: 'v = {{2πr|T}} = ωr;   ω = {{2π|T}} = 2πf', when: 'Constant speed.' },
    { name: 'Maximum speed on a flat curve', f: 'v_{max} = √{μ_{s}gr}', when: 'Level road, friction alone provides the inward force; the tyres do not slip (static friction).' },
    { name: 'Ideal banking speed', f: 'tan θ = {{v^{2}|rg}}', when: 'Banked curve with no friction needed at this speed.' },
  ],
  derivation: {
    title: 'Where a = v²/r comes from',
    intro: 'In a short time Δt the object moves through a small angle Δθ. Its velocity keeps size v but turns through the same angle Δθ.',
    steps: [
      ['The change in velocity has magnitude |Δv| ≈ vΔθ.', 'For a small angle, the arc swept by the tip of the velocity arrow is v × Δθ.'],
      ['The angle turned is Δθ = {{vΔt|r}}.', 'Arc length travelled (vΔt) divided by radius.'],
      ['a = {{|Δv||Δt}} = v{{Δθ|Δt}} = v·{{v|r}} = {{v^{2}|r}}.', 'Divide by Δt.'],
      ['Δv points towards the centre (perpendicular to v).', 'As Δt → 0 the change is at right angles to the velocity, i.e. inward.'],
    ],
    end: 'Check units: (m/s)²/m = m/s².',
  },
  figure: { svg: fig, caption: 'The velocity (blue) is tangent to the path; the acceleration (red) points to the centre. Both change direction continuously while their sizes stay constant.' },
  table: {
    caption: 'What provides the inward force?',
    head: ['situation', 'force(s) pointing to the centre', 'equation'],
    rows: [['ball on a string (horizontal circle, ignoring gravity sag)', 'tension T', 'T = mv²/r'], ['car on a flat bend', 'static friction f_{s}', 'f_{s} = mv²/r ≤ μ_{s}mg'], ['car on a banked bend (no friction)', 'horizontal part of normal force', 'N sin θ = mv²/r, N cos θ = mg'], ['top of a vertical loop', 'weight + normal force (both down)', 'mg + N = mv²/r'], ['satellite in circular orbit', 'gravity', 'GMm/r² = mv²/r']],
  },
  method: {
    title: 'Circular-motion problems',
    steps: [
      'Identify the circle: its centre, its radius and the plane it lies in.',
      'Draw the free-body diagram with real forces only.',
      'Take one axis pointing towards the centre (and usually one vertical).',
      'Write ΣF_{toward centre} = mv^{2}/r and, if needed, ΣF_{vertical} = 0.',
      'Solve for the unknown; for friction on a flat curve use f_{s} ≤ μ_{s}N to find the limit.',
    ],
  },
  examples: [
    {
      title: 'Centripetal acceleration',
      problem: 'An object moves at 6 m/s around a circle of radius 3 m. Find its acceleration.',
      steps: [['a_{c} = {{v^{2}|r}} = {{36|3}} = 12 m/s^{2}.', 'Directed towards the centre.']],
      result: '12 m/s^{2} towards the centre.',
      meaning: 'More than g (9.8 m/s²), even though the speed is modest, because the circle is tight.',
    },
    {
      title: 'Net inward force',
      problem: 'A 2 kg object travels in a circle of radius 4 m at 4 m/s. Find the net inward force.',
      steps: [['F = {{mv^{2}|r}} = {{2 × 16|4}} = 8 N.', 'Newton’s second law towards the centre.']],
      result: '8 N towards the centre.',
      meaning: 'This is the net force; it could be supplied by tension, friction or any other real force.',
    },
    {
      title: 'Maximum speed on a flat bend',
      problem: 'A car rounds a flat bend of radius 50 m. μ_{s} between tyres and road is 0.80. What is the maximum speed without skidding?',
      steps: [
        ['Inward force: static friction f_{s} ≤ μ_{s}N = μ_{s}mg.', 'Flat road: N = mg.'],
        ['At the limit: μ_{s}mg = {{mv^{2}|r}} ⇒ v = √{μ_{s}gr}.', 'Mass cancels.'],
        ['v = √{0.80 × 9.8 × 50} = √{392} = 19.8 m/s.', 'Substitute.'],
      ],
      result: 'About 19.8 m/s (≈ 71 km/h).',
      meaning: 'On a wet road with μₛ = 0.40 the limit falls to 14 m/s (about 50 km/h).',
    },
    {
      title: 'Banked curve',
      problem: 'At what angle should a curve of radius 100 m be banked so that cars at 20 m/s need no friction?',
      steps: [
        ['Vertical: N cos θ = mg. Horizontal (inward): N sin θ = {{mv^{2}|r}}.', 'Normal force is perpendicular to the tilted road.'],
        ['Divide: tan θ = {{v^{2}|rg}} = {{400|100 × 9.8}} = 0.408.', 'N and m cancel.'],
        ['θ = arctan 0.408 = 22.2°.', 'Solve for the angle.'],
      ],
      result: 'About 22°.',
      meaning: 'Cars faster than 20 m/s need friction pointing down the slope; slower cars need it pointing up the slope.',
    },
    {
      title: 'Top of a vertical loop',
      problem: 'A roller coaster car goes over the inside top of a loop of radius 10 m. What is the minimum speed at the top for the car to stay on the track?',
      steps: [
        ['At the top both weight and normal force point down (towards the centre): mg + N = {{mv^{2}|r}}.', 'Inside of the loop.'],
        ['The minimum speed is when the track just stops pushing: N = 0, so mg = {{mv^{2}|r}}.', 'Contact is about to be lost.'],
        ['v_{min} = √{gr} = √{9.8 × 10} = 9.90 m/s.', 'Solve.'],
      ],
      result: 'About 9.9 m/s.',
      meaning: 'Slower than this, gravity alone would pull the car inward more than needed and it would leave the circular path.',
    },
    {
      title: 'Period and angular speed',
      problem: 'A centrifuge spins at 3000 rpm with the sample 0.10 m from the axis. Find ω, v and the acceleration as a multiple of g.',
      steps: [
        ['ω = 3000 × {{2π|60}} = 314 rad/s.', 'Convert rpm to rad/s.'],
        ['v = ωr = 314 × 0.10 = 31.4 m/s.', 'Linear speed.'],
        ['a = ω^{2}r = 314^{2} × 0.10 = 9.87 × 10^{3} m/s^{2} ≈ 1000g.', 'Centripetal acceleration.'],
      ],
      result: 'ω ≈ 314 rad/s, v ≈ 31.4 m/s, a ≈ 1000g.',
      meaning: 'That large effective gravity is what separates particles quickly.',
    },
  ],
  mistakes: [
    ['“Constant speed means no acceleration.”', 'The direction changes, so the velocity changes: a = v²/r inward.'],
    ['Adding a separate “centripetal force” to the free-body diagram.', 'mv²/r is the required net inward force, supplied by real forces.'],
    ['“There is an outward centrifugal force.”', 'In an inertial frame there is none; the outward feeling is inertia. If released, objects move along the tangent.'],
    ['Using the diameter instead of the radius.', 'r is measured from the centre of the circle.'],
    ['Using rpm directly as ω.', 'Convert: ω (rad/s) = rpm × 2π/60.'],
  ],
  scope: [
    'Uniform circular motion and simple vertical circles. Rotational dynamics (torque, moment of inertia) and gravitation beyond the circular-orbit equation are covered in the collection notes and later courses.',
  ],
  checks: [
    ['ac', 36 / 3, 12, 0], ['F', 2 * 16 / 4, 8, 0], ['vmax', Math.sqrt(0.8 * 9.8 * 50), 19.8, 0.05], ['wet', Math.sqrt(0.4 * 9.8 * 50), 14, 0.05],
    ['bank', Math.atan(400 / 980) * 180 / Math.PI, 22.2, 0.05], ['loop', Math.sqrt(98), 9.90, 0.005],
    ['omega', 3000 * 2 * Math.PI / 60, 314, 0.2], ['v', 314.16 * 0.1, 31.4, 0.05], ['a/g', (3000 * 2 * Math.PI / 60) ** 2 * 0.1 / 9.8, 1000, 10],
  ],
};
