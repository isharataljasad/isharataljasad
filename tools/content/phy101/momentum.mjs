import { svg, rect, text, line, vector } from '../svg.mjs';

// Before/after of a perfectly inelastic collision: 2 kg at +3 m/s hits 1 kg at rest, stick together at +2 m/s.
const cart = (x, y, w, lab, col) => rect(x, y, w, 40, { fill: col, stroke: '#183b3f' }) + text(x + w / 2, y + 26, lab, { anchor: 'middle', size: 14, color: '#fff', weight: 650 });
const fig = svg('phy-mom', { w: 500, h: 280, title: 'A perfectly inelastic collision: before and after', desc: 'Before: a 2 kg cart moving right at 3 m/s approaches a 1 kg cart at rest; total momentum 6 kg·m/s to the right. After: the carts are stuck together and move right at 2 m/s; total momentum is still 6 kg·m/s.' },
  text(20, 30, 'BEFORE', { weight: 650, size: 14, color: '#5e7376' })
  + line(20, 105, 480, 105, { width: 2 }) + cart(60, 65, 90, '2 kg', '#176e66') + vector(155, 85, 225, 85, 'a') + text(190, 60, '3 m/s', { anchor: 'middle', size: 14, color: '#176e66' })
  + cart(300, 65, 60, '1 kg', '#355b90') + text(330, 125, 'at rest', { anchor: 'middle', size: 13, color: '#5e7376' })
  + text(250, 150, 'p = (2)(3) + (1)(0) = 6 kg·m/s →', { anchor: 'middle', size: 14 })
  + text(20, 185, 'AFTER', { weight: 650, size: 14, color: '#5e7376' })
  + line(20, 250, 480, 250, { width: 2 }) + cart(200, 210, 90, '2 kg', '#176e66') + cart(290, 210, 60, '1 kg', '#355b90')
  + vector(355, 230, 405, 230, 'a') + text(380, 205, '2 m/s', { anchor: 'middle', size: 14, color: '#176e66' })
  + text(110, 236, 'p = (3)(2) = 6 kg·m/s →', { anchor: 'middle', size: 14 }));

export default {
  summary: 'Momentum p = mv is a vector. A force acting for a time changes it (impulse). In a collision with no external force, total momentum is conserved.',
  why: [
    'Momentum is the natural quantity for collisions, impacts and explosions — crash safety, pile drivers, jet and rocket propulsion, the recoil of a gun. During a collision the forces are huge, brief and hard to measure, but momentum lets you predict the outcome without knowing them. Impulse explains why airbags, crumple zones and bent knees reduce injuries.',
  ],
  idea: [
    '**Momentum** p = mv combines mass and velocity. It is a vector, so direction matters: with right positive, a 2 kg ball at 3 m/s to the left has p = −6 kg·m/s.',
    'Newton’s second law can be written ΣF = {{Δp|Δt}}. Rearranged, **impulse** J = FΔt = Δp: a force acting for a time changes momentum. To stop a moving object you need a definite impulse (its momentum). You can deliver it with a large force for a short time or a small force for a long time. Airbags and crumple zones lengthen the stopping time, so the force on the passenger is smaller.',
    'In a collision between two objects, each pushes the other with equal and opposite forces for the same time (Newton’s third law). So the impulses are equal and opposite and the momentum lost by one is gained by the other. If no **external** net force acts on the system, the **total momentum is conserved**: Σp_{before} = Σp_{after}. This is true for every collision, bouncy or sticky.',
    'Kinetic energy is a different story. In an **elastic** collision kinetic energy is also conserved (ideal billiard balls). In an **inelastic** collision some kinetic energy becomes heat, sound and deformation. In a **perfectly inelastic** collision the objects stick together, and the loss of kinetic energy is as large as momentum conservation allows.',
    'The **centre of mass** of a system moves as if all the mass were there and all external forces acted there. With no external force, the centre of mass moves at constant velocity, even while the parts collide or fly apart.',
  ],
  background: [
    { title: 'Signs in one dimension', text: 'Choose a positive direction and give every velocity a sign. A rebound reverses the sign of velocity.' },
    { title: 'Newton’s third law', text: 'Forces between two objects are equal in size and opposite in direction, and act on different objects.' },
  ],
  definitions: [
    ['Momentum p', 'p = mv, a vector in the direction of the velocity. Unit kg·m/s.'],
    ['Impulse J', 'J = F_{avg}Δt = Δp; equals the area under a force–time graph. Unit N·s (= kg·m/s).'],
    ['Isolated system', 'A system on which the net external force is zero (or negligible during a brief collision).'],
    ['Elastic collision', 'Both momentum and kinetic energy are conserved.'],
    ['Inelastic collision', 'Momentum is conserved; kinetic energy is not. Perfectly inelastic: the objects stick together.'],
    ['Centre of mass', 'x_{cm} = {{m_{1}x_{1} + m_{2}x_{2} + …|m_{1} + m_{2} + …}}, the mass-weighted average position.'],
  ],
  symbols: [
    ['p', 'momentum', 'kg·m/s'], ['J', 'impulse', 'N·s'], ['F_{avg}', 'average force during contact', 'N'], ['Δt', 'contact time', 's'], ['v_{i}, v_{f}', 'velocities before and after (signed)', 'm/s'],
  ],
  formulas: [
    { name: 'Impulse–momentum theorem', f: 'J = F_{avg}Δt = Δp = mv_{f} − mv_{i}', when: 'Always; F_avg is the time-averaged net force. Use signed velocities.' },
    { name: 'Conservation of momentum', f: 'm_{1}v_{1i} + m_{2}v_{2i} = m_{1}v_{1f} + m_{2}v_{2f}', when: 'No net external force on the system during the interaction (or the collision is so brief that external impulses are negligible). In 2D, conserve each component separately.' },
    { name: 'Perfectly inelastic', f: 'v_{f} = {{m_{1}v_{1i} + m_{2}v_{2i}|m_{1} + m_{2}}}', when: 'Objects stick together after the collision.' },
    { name: 'Elastic, target at rest (1D)', f: 'v_{1f} = {{m_{1} − m_{2}|m_{1} + m_{2}}}v_{1i};   v_{2f} = {{2m_{1}|m_{1} + m_{2}}}v_{1i}', when: 'Head-on elastic collision with m_{2} initially at rest.' },
  ],
  derivation: {
    title: 'Why momentum is conserved in a collision',
    intro: 'Two carts collide. During contact, cart 1 pushes cart 2 with force F and cart 2 pushes cart 1 with −F (third law), for the same time Δt.',
    steps: [
      ['Impulse on cart 2: Δp_{2} = FΔt.', 'Impulse–momentum theorem.'],
      ['Impulse on cart 1: Δp_{1} = −FΔt.', 'Equal and opposite force, same time.'],
      ['Δp_{1} + Δp_{2} = 0.', 'Add them.'],
    ],
    end: 'The total momentum does not change. External forces (friction with the track) would spoil this, but during a brief collision their impulse is usually negligible.',
  },
  figure: { svg: fig, caption: 'Momentum before (6 kg·m/s) equals momentum after (6 kg·m/s). Kinetic energy is not conserved: it drops from 9 J to 6 J.' },
  table: {
    caption: 'Momentum and kinetic energy in the collision shown',
    head: ['', 'momentum (kg·m/s)', 'kinetic energy (J)'],
    rows: [['before', '2 × 3 + 1 × 0 = 6', '½ × 2 × 3² = 9'], ['after', '3 × 2 = 6', '½ × 3 × 2² = 6'], ['change', '0 (conserved)', '−3 (lost to heat, sound, deformation)']],
    note: 'Always conserve momentum in collisions; conserve kinetic energy only if the collision is stated to be elastic.',
  },
  method: {
    title: 'Momentum problems',
    steps: [
      'Define the system (usually all colliding objects) and check that external forces are zero or negligible during the interaction.',
      'Choose a positive direction; write every velocity with its sign.',
      'Write total momentum before = total momentum after (component by component in 2D).',
      'If the collision is elastic, add conservation of kinetic energy; if the objects stick, use one final velocity.',
      'For forces during impact, use impulse: F_{avg} = Δp/Δt.',
      'Check signs (does a rebound come out negative?) and compare kinetic energies before and after (KE cannot increase unless stored energy is released).',
    ],
  },
  examples: [
    {
      title: 'Impulse and a change of direction',
      problem: 'A 2 kg body changes velocity from +5 m/s to +2 m/s. Find the impulse. Then find the impulse if instead it rebounds at −2 m/s.',
      steps: [
        ['J = m(v_{f} − v_{i}) = 2(2 − 5) = −6 N·s.', 'Slowing down in the positive direction: negative impulse.'],
        ['Rebound: J = 2(−2 − 5) = −14 N·s.', 'The velocity change is 7 m/s, not 3 m/s.'],
      ],
      result: '−6 N·s; with a rebound, −14 N·s.',
      meaning: 'Bouncing requires a larger impulse than stopping: the wall must first stop the body and then push it back.',
    },
    {
      title: 'Average force in an impact',
      problem: 'A 0.15 kg ball moving at 40 m/s is caught and stopped in 0.02 s. Find the average force. What if the hand moves back so that stopping takes 0.10 s?',
      steps: [
        ['Δp = 0.15(0 − 40) = −6.0 kg·m/s.', 'Change in momentum.'],
        ['F_{avg} = {{Δp|Δt}} = {{−6.0|0.02}} = −300 N.', 'Impulse–momentum theorem.'],
        ['With Δt = 0.10 s: F_{avg} = −60 N.', 'Same impulse over five times the time.'],
      ],
      result: '300 N, reduced to 60 N by extending the stopping time.',
      meaning: 'This is the principle of airbags, crumple zones and bending your knees on landing.',
    },
    {
      title: 'Perfectly inelastic collision',
      problem: 'A 2 kg cart at 3 m/s hits a 1 kg cart at rest and they stick together. Find their common speed and the kinetic energy lost.',
      steps: [
        ['2(3) + 1(0) = (2 + 1)v_{f}.', 'Conservation of momentum.'],
        ['v_{f} = 2 m/s.', 'Solve.'],
        ['K before 9 J; K after {{1|2}}(3)(2)^{2} = 6 J. Lost: 3 J.', 'Compare kinetic energies.'],
      ],
      result: 'v_{f} = 2 m/s; 3 J of kinetic energy lost.',
      meaning: 'Momentum is conserved while one-third of the kinetic energy is not.',
    },
    {
      title: 'Elastic collision of equal masses',
      problem: 'A 1 kg ball at 4 m/s hits an identical ball at rest, head-on and elastically. Find both final velocities.',
      steps: [
        ['m_{1} = m_{2}, so v_{1f} = {{0|2}} × 4 = 0 and v_{2f} = {{2|2}} × 4 = 4 m/s.', 'Elastic formulas with the target at rest.'],
        ['Check momentum: 4 = 0 + 4 ✓. Kinetic energy: 8 J = 0 + 8 J ✓.', 'Both conserved.'],
      ],
      result: 'The first ball stops; the second moves off at 4 m/s.',
      meaning: 'This is what you see in a Newton’s cradle.',
    },
    {
      title: 'Recoil (an “explosion”)',
      problem: 'A 60 kg skater at rest throws a 3 kg ball forward at 10 m/s. Find the skater’s recoil velocity.',
      steps: [
        ['Total momentum before = 0.', 'Everything starts at rest.'],
        ['0 = 3(10) + 60v ⇒ v = −0.5 m/s.', 'Momentum after must also total zero.'],
      ],
      result: 'The skater moves backwards at 0.5 m/s.',
      meaning: 'Kinetic energy increased (from 0 to 157.5 J), supplied by the skater’s muscles. Momentum is still conserved.',
    },
  ],
  mistakes: [
    ['Ignoring the signs of velocities.', 'Momentum is a vector. Opposite directions need opposite signs.'],
    ['Conserving kinetic energy in every collision.', 'Only in elastic collisions. Momentum is conserved in all isolated collisions.'],
    ['Using conservation of momentum when an external force acts over a long time.', 'Check the system is isolated, or the interaction brief.'],
    ['Treating impulse as a force.', 'Impulse is force × time, with units N·s.'],
  ],
  scope: [
    'Collisions in one dimension are treated fully; two-dimensional collisions use the same idea with components.',
    'Variable-mass systems (rockets) are beyond this topic.',
  ],
  checks: [
    ['J1', 2 * (2 - 5), -6, 0], ['J2', 2 * (-2 - 5), -14, 0], ['F', -6 / 0.02, -300, 1e-9], ['F2', -6 / 0.1, -60, 1e-9],
    ['vf', 6 / 3, 2, 0], ['KE lost', 9 - 6, 3, 0], ['elastic v2', 2 * 1 / 2 * 4, 4, 0], ['recoil', -30 / 60, -0.5, 0],
    ['recoil KE', 0.5 * 3 * 100 + 0.5 * 60 * 0.25, 157.5, 1e-9],
  ],
};
