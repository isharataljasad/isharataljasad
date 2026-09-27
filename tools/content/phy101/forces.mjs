import { svg, rect, vector, text, line } from '../svg.mjs';

// Free-body diagram: 5 kg block on a frictionless floor pulled by T = 20 N at 30°.
const cx = 190, cy = 150;
const fig = svg('phy-fbd', { w: 480, h: 300, title: 'Free-body diagram of a block pulled at an angle', desc: 'A block on a horizontal frictionless floor. Four forces act at its centre: weight mg = 49 N straight down, normal force N straight up, and the tension T = 20 N pointing up and to the right at 30° above the horizontal. Dashed lines show the components T cos 30° = 17.3 N horizontally and T sin 30° = 10 N vertically. Axes: x to the right, y up.' },
  line(40, 190, 360, 190, { width: 2.5 })
  + rect(cx - 50, cy - 40, 100, 80, { fill: '#e6f0ea', stroke: '#183b3f' })
  + vector(cx, cy, cx, cy + 105, 'c') + text(cx + 8, cy + 100, 'mg = 49 N', { color: '#b3412e', size: 14 })
  + vector(cx, cy, cx, cy - 115, 'a') + text(cx + 8, cy - 100, 'N = 39 N', { color: '#176e66', size: 14 })
  + vector(cx, cy, cx + 150 * Math.cos(Math.PI / 6), cy - 150 * Math.sin(Math.PI / 6), 'd') + text(cx + 138, cy - 82, 'T = 20 N', { color: '#355b90', size: 14 })
  + line(cx, cy, cx + 130, cy, { color: '#355b90', width: 1.5, dash: '5 4' }) + line(cx + 130, cy, cx + 130, cy - 75, { color: '#355b90', width: 1.5, dash: '5 4' })
  + text(cx + 95, cy + 18, 'T cos 30°', { color: '#355b90', size: 13, anchor: 'middle' })
  + text(cx + 136, cy - 34, 'T sin 30°', { color: '#355b90', size: 13 })
  + text(cx + 62, cy - 6, '30°', { size: 13 })
  + vector(400, 260, 450, 260, 'ink', 1.6) + vector(400, 260, 400, 210, 'ink', 1.6) + text(454, 265, 'x', { italic: true, size: 14 }) + text(395, 205, 'y', { italic: true, size: 14, anchor: 'end' })
  + text(40, 225, 'frictionless floor', { size: 13, color: '#5e7376' }));

export default {
  summary: 'Forces change motion. Isolate one object, draw every force acting on it, and apply ΣF = ma along each axis.',
  why: [
    'Newton’s laws explain and predict motion from its causes. Every structure, machine and vehicle is designed by balancing or using forces: cables in tension, supports pushing up, engines pushing forward, friction resisting. The free-body diagram is the single most important tool in mechanics; nearly every mistake in force problems is a mistake in the diagram.',
  ],
  idea: [
    '**First law (inertia):** if the net force on an object is zero, its velocity stays constant — it stays at rest or keeps moving in a straight line at constant speed. A force is not needed to keep something moving; it is needed to **change** its motion.',
    '**Second law:** the net force equals mass times acceleration, ΣF = ma. It is a vector equation, so it holds separately along each axis: ΣF_{x} = ma_{x} and ΣF_{y} = ma_{y}. Mass measures how hard it is to change an object’s velocity. The unit of force is the newton: 1 N = 1 kg·m/s².',
    '**Third law:** forces come in pairs. If A pushes on B, then B pushes on A with an equal and opposite force. The two forces act on **different** objects, so they never cancel each other on a single free-body diagram. The Earth pulls you down (your weight); you pull the Earth up equally.',
    'A **free-body diagram** (FBD) shows one chosen object and only the forces acting **on it**: weight (mg, down), contact forces (normal force perpendicular to a surface, friction along it), tensions (along ropes, pulling away from the object), and applied pushes or pulls. Forces the object exerts on other things do not belong on its diagram, and neither does “ma” — ma is the result, not a force.',
    'The **normal force** is whatever the surface must supply to stop the object sinking in. It equals the weight only in the simplest case (horizontal surface, no other vertical forces, no vertical acceleration). If you pull up on a rope at an angle, the floor pushes less; in an accelerating lift it changes too.',
  ],
  background: [
    { title: 'Vector components', text: 'A force F at angle θ above the +x axis has F_{x} = F cos θ and F_{y} = F sin θ (see Vectors and motion).' },
    { title: 'Weight', text: 'Weight is the gravitational force: W = mg, with g = 9.8 m/s² near the Earth’s surface. A 5 kg mass weighs 49 N. Mass (kg) is not weight (N).' },
  ],
  definitions: [
    ['Force', 'A push or pull on an object due to an interaction with another object; a vector measured in newtons (N).'],
    ['Net force ΣF', 'The vector sum of all forces acting on the object.'],
    ['Equilibrium', 'ΣF = 0, so a = 0: the object is at rest or moving at constant velocity.'],
    ['Normal force N', 'The contact force perpendicular to a surface, preventing objects from passing through it.'],
    ['Tension T', 'The pulling force exerted by a rope or cable, directed along it away from the object. For an ideal (massless) rope over an ideal pulley, the tension is the same throughout.'],
    ['Free-body diagram', 'A sketch of one isolated object with arrows for every external force acting on it, plus chosen axes.'],
  ],
  symbols: [
    ['ΣF', 'net (vector sum of) force', 'N'],
    ['m', 'mass', 'kg'],
    ['a', 'acceleration', 'm/s²'],
    ['W = mg', 'weight', 'N'],
    ['N, T', 'normal force, tension', 'N'],
  ],
  formulas: [
    { name: 'Newton’s second law', f: 'ΣF_{x} = ma_{x},   ΣF_{y} = ma_{y}', when: 'In an inertial (non-accelerating) reference frame, for a body of constant mass. Sum only forces acting on the chosen body.' },
    { name: 'Equilibrium', f: 'ΣF_{x} = 0,   ΣF_{y} = 0', when: 'Object at rest or moving with constant velocity.' },
    { name: 'Weight', f: 'W = mg', when: 'Near the Earth’s surface, g ≈ 9.8 m/s².' },
    { name: 'Third law', f: 'F_{A on B} = −F_{B on A}', when: 'Always; the two forces act on different bodies and are of the same type (both gravitational, both contact, …).' },
    { name: 'Apparent weight in a lift', f: 'N = m(g + a)', when: 'Vertical acceleration a, up positive. N is what a bathroom scale reads.' },
  ],
  derivation: {
    title: 'Why the normal force is not always mg',
    intro: 'Use the block in the figure: m = 5 kg, pulled by T = 20 N at 30° above horizontal, on a frictionless floor.',
    steps: [
      ['Vertical forces: N up, T sin 30° = 10 N up, mg = 49 N down.', 'Resolve every force along y.'],
      ['The block does not leave the floor, so a_{y} = 0: N + 10 − 49 = 0.', 'ΣF_{y} = ma_{y} with a_{y} = 0.'],
      ['N = 39 N, which is less than mg = 49 N.', 'The rope carries part of the weight.'],
      ['Horizontally: T cos 30° = 17.3 N = ma_{x} ⇒ a_{x} = 3.46 m/s².', 'ΣF_{x} = ma_{x}.'],
    ],
    end: 'N is found from the equations, never assumed. On an incline, or with an upward pull, or in a lift, it differs from mg.',
  },
  figure: { svg: fig, caption: 'Free-body diagram of a 5 kg block pulled at 30°. Only forces acting on the block are drawn. The pull’s vertical component reduces the normal force to 39 N.' },
  table: {
    caption: 'Scale reading (normal force) for a 60 kg person in a lift (g = 9.8 m/s², up positive)',
    head: ['motion of the lift', 'acceleration a', 'N = m(g + a)'],
    rows: [['at rest or constant velocity', '0', '588 N'], ['starting upward', '+2 m/s²', '708 N'], ['slowing while going up', '−2 m/s²', '468 N'], ['cable broken (free fall)', '−9.8 m/s²', '0 N (“weightless”)']],
    note: 'The person’s weight mg = 588 N never changes; the normal force changes with the acceleration.',
  },
  method: {
    title: 'Newton’s-law problem procedure',
    steps: [
      'Choose the object (or objects, separately). Draw a free-body diagram for each: weight, normal forces, friction, tensions, applied forces — only forces acting on it.',
      'Choose axes; for motion along a surface, put x along the surface. Mark the direction of the acceleration.',
      'Resolve every force into components along the axes.',
      'Write ΣF_{x} = ma_{x} and ΣF_{y} = ma_{y} for each object.',
      'For connected objects, use the constraint (same magnitude of acceleration for a taut rope) and the same tension on both ends of an ideal rope.',
      'Solve, then check units, signs and limiting cases (e.g. does the answer reduce correctly when an angle is 0?).',
    ],
  },
  examples: [
    {
      title: 'Acceleration from the net force',
      problem: 'A 4 kg object has horizontal forces of 20 N to the right and 8 N to the left. Find its acceleration.',
      steps: [
        ['Take right as positive: ΣF_{x} = 20 − 8 = 12 N.', 'Add forces with signs.'],
        ['a = {{ΣF|m}} = {{12|4}} = 3 m/s^{2}.', 'Newton’s second law.'],
      ],
      result: 'a = 3 m/s^{2} to the right.',
      meaning: 'Only the net force matters; the object could be moving either way at this instant.',
    },
    {
      title: 'Pulling at an angle',
      problem: 'A 5 kg block on a frictionless floor is pulled by a rope with tension 20 N at 30° above horizontal. Find its acceleration and the normal force.',
      steps: [
        ['x: T cos 30° = 5a_{x} ⇒ 17.32 = 5a_{x} ⇒ a_{x} = 3.46 m/s^{2}.', 'Horizontal component causes the acceleration.'],
        ['y: N + T sin 30° − mg = 0 ⇒ N = 49 − 10 = 39 N.', 'No vertical acceleration.'],
      ],
      result: 'a = 3.46 m/s^{2}; N = 39 N.',
      meaning: 'Setting N = mg would be wrong here.',
    },
    {
      title: 'Two connected blocks (Atwood machine)',
      problem: 'Masses of 3 kg and 5 kg hang on either side of an ideal pulley, joined by a light string. Find the acceleration and the tension (g = 9.8 m/s^{2}).',
      steps: [
        ['The heavier 5 kg mass goes down, the 3 kg mass up, both with the same magnitude a.', 'A taut, inextensible string forces equal accelerations.'],
        ['3 kg (up positive): T − 3g = 3a.', 'FBD of the lighter mass.'],
        ['5 kg (down positive): 5g − T = 5a.', 'FBD of the heavier mass; its positive direction is its direction of motion.'],
        ['Add: 2g = 8a ⇒ a = {{2 × 9.8|8}} = 2.45 m/s^{2}. Then T = 3(9.8 + 2.45) = 36.75 N.', 'Adding eliminates T.'],
      ],
      result: 'a = 2.45 m/s^{2}; T ≈ 36.8 N.',
      meaning: 'T lies between the two weights (29.4 N and 49 N), as it must: it holds back the heavy mass and lifts the light one.',
    },
    {
      title: 'Equilibrium with two cables',
      problem: 'A 10 kg sign hangs from two cables, each making 30° with the horizontal, symmetric about the sign. Find the tension in each cable.',
      steps: [
        ['Horizontal components cancel by symmetry.', 'Equal angles and equal tensions.'],
        ['Vertical: 2T sin 30° − mg = 0 ⇒ 2T(0.5) = 98.', 'Equilibrium, ΣF_y = 0.'],
        ['T = 98 N.', 'Solve.'],
      ],
      result: 'Each cable has tension 98 N — as large as the whole weight.',
      meaning: 'Shallow cables need large tensions: at 10° each tension would be 98/(2 sin 10°) ≈ 282 N.',
    },
    {
      title: 'Apparent weight',
      problem: 'A 60 kg person stands on a scale in a lift accelerating upward at 2 m/s^{2}. What does the scale read?',
      steps: [
        ['Forces on the person: N up, mg = 588 N down; a = +2 m/s^{2} (up positive).', 'FBD of the person.'],
        ['N − mg = ma ⇒ N = 60(9.8 + 2) = 708 N.', 'Second law, vertical.'],
      ],
      result: 'The scale reads 708 N (about 72 kg on a scale calibrated in kg).',
      meaning: 'The scale measures the normal force, not the weight.',
    },
  ],
  extra: [
    { title: 'Torque and rotational equilibrium (check whether your outline includes it)', text: [
      'A force can make an object turn. Its turning effect about a pivot is the **torque** τ = rF sin φ, where r is the distance from the pivot to where the force acts and φ is the angle between r and F. Only the perpendicular part of the force turns the object: a 10 N force at right angles to a 0.30 m wrench gives τ = 3.0 N·m, but the same force pushed along the wrench gives zero torque.',
      'An object is in **static equilibrium** only when both the net force and the net torque are zero. Example: a light beam balances on a pivot with a 20 N load 2.0 m to the right and a 10 N load 4.0 m to the left. The clockwise torque 20 × 2.0 = 40 N·m equals the anticlockwise torque 10 × 4.0 = 40 N·m, so the beam does not turn; the pivot pushes up with 30 N so that the forces also balance.',
    ] },
  ],
  mistakes: [
    ['“A moving object needs a net force to keep moving.”', 'Constant velocity needs zero net force. Net force causes acceleration, not motion.'],
    ['Cancelling third-law pairs on one FBD.', 'The pair acts on two different objects. On one object’s diagram only one of them appears.'],
    ['Assuming N = mg always.', 'Find N from ΣF_y = ma_y. Angled pulls, inclines and accelerating lifts change it.'],
    ['Drawing “ma” as a force on the FBD.', 'ma is the result of the forces; it is not an extra force.'],
    ['Using mass instead of weight (kg instead of N).', 'Weight is mg in newtons.'],
  ],
  scope: [
    'Friction and inclined planes are in the next topic; circular motion (net inward force) in its own topic.',
    'Ropes and pulleys are ideal (massless, frictionless) unless stated. Only static torque balance appears (optional section); rotational dynamics is not treated.',
  ],
  checks: [
    ['torque', 10 * 0.3, 3, 1e-12], ['beam', 20 * 2 - 10 * 4, 0, 0], ['pivot', 20 + 10, 30, 0],
    ['net', (20 - 8) / 4, 3, 0], ['ax', 20 * Math.cos(Math.PI / 6) / 5, 3.46, 0.005], ['N', 49 - 20 * Math.sin(Math.PI / 6), 39, 1e-9],
    ['atwood a', 2 * 9.8 / 8, 2.45, 1e-12], ['atwood T', 3 * (9.8 + 2.45), 36.75, 1e-9], ['sign T', 98 / (2 * 0.5), 98, 1e-9],
    ['10deg', 98 / (2 * Math.sin(10 * Math.PI / 180)), 282, 0.5], ['lift', 60 * 11.8, 708, 1e-9], ['lift down', 60 * 7.8, 468, 1e-9], ['rest', 60 * 9.8, 588, 1e-9],
  ],
};
