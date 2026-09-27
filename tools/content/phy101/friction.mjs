import { svg, vector, text, line, path } from '../svg.mjs';

// Block on a 30° incline, sliding down; axes along/perpendicular to the slope.
const th = Math.PI / 6, c = Math.cos(th), s = Math.sin(th);
const A = [60, 250], Bx = 420, By = 250 - (420 - 60) * Math.tan(th); // incline from A up to the right
const u = [c, -s], nrm = [-s, -c]; // up-slope unit (screen coords), outward normal
const P = [230, 250 - (230 - 60) * Math.tan(th)];
const C = [P[0] + nrm[0] * 30, P[1] + nrm[1] * 30]; // block centre
const corner = (a, b) => [C[0] + u[0] * a + nrm[0] * b, C[1] + u[1] * a + nrm[1] * b];
const blk = [corner(-40, -30), corner(40, -30), corner(40, 30), corner(-40, 30)];
const L = 95;
const fig = svg('phy-incline', { w: 480, h: 300, title: 'Forces on a block sliding down a 30° incline', desc: 'A block on a slope inclined at 30°. Weight mg acts straight down. The normal force N acts perpendicular to the slope, away from it. Kinetic friction f acts up the slope, opposite to the sliding motion. Dashed arrows show the weight components: mg sin θ down the slope and mg cos θ into the slope.' },
  path(`M${A[0]},${A[1]} L${Bx},${By.toFixed(1)} L${Bx},${A[1]} Z`, { color: '#183b3f', width: 2, fill: '#f1f4ef' })
  + text(A[0] + 58, A[1] - 8, 'θ = 30°', { size: 14 })
  + path(`M${blk.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L')} Z`, { color: '#183b3f', width: 1.5, fill: '#e6f0ea' })
  + vector(C[0], C[1], C[0], C[1] + L, 'c') + text(C[0] + 6, C[1] + L + 4, 'mg', { color: '#b3412e', size: 14 })
  + vector(C[0], C[1], C[0] + nrm[0] * L * c, C[1] + nrm[1] * L * c, 'a') + text(C[0] + nrm[0] * L * c - 26, C[1] + nrm[1] * L * c - 4, 'N', { color: '#176e66', size: 15, weight: 650 })
  + vector(C[0], C[1], C[0] + u[0] * 60, C[1] + u[1] * 60, 'b') + text(C[0] + u[0] * 60 + 6, C[1] + u[1] * 60 - 4, 'f (friction)', { color: '#9b6328', size: 14 })
  + line(C[0], C[1], C[0] - u[0] * L * s, C[1] - u[1] * L * s, { color: '#b3412e', width: 1.8, dash: '5 4', arrow: 'c' })
  + text(C[0] - u[0] * L * s - 8, C[1] - u[1] * L * s + 20, 'mg sin θ', { color: '#b3412e', size: 13, anchor: 'end' })
  + line(C[0], C[1], C[0] - nrm[0] * L * c, C[1] - nrm[1] * L * c, { color: '#b3412e', width: 1.8, dash: '5 4', arrow: 'c' })
  + text(C[0] - nrm[0] * L * c + 6, C[1] - nrm[1] * L * c + 16, 'mg cos θ', { color: '#b3412e', size: 13 })
  + vector(C[0] + nrm[0] * 120 + u[0] * 35, C[1] + nrm[1] * 120 + u[1] * 35, C[0] + nrm[0] * 120 - u[0] * 35, C[1] + nrm[1] * 120 - u[1] * 35, 'ink', 1.6)
  + text(C[0] + nrm[0] * 120 - u[0] * 35 - 6, C[1] + nrm[1] * 120 - u[1] * 35 + 4, 'sliding direction', { size: 13, anchor: 'end', color: '#5e7376' }));

export default {
  summary: 'Friction is the contact force along a surface. Static friction adjusts up to a limit; kinetic friction has a fixed size, μₖN, and opposes sliding.',
  why: [
    'Friction lets you walk, lets car tyres grip and brakes stop, and keeps loads from sliding off conveyors. It also wastes energy in machines. Inclined planes appear in ramps, conveyors, roads and chutes; resolving forces along and perpendicular to a slope is a skill used throughout mechanics.',
  ],
  idea: [
    'When two surfaces are pressed together, the contact force has a part perpendicular to the surface (the normal force N) and a part along it (friction). Friction opposes **relative sliding** — or, if the surfaces are not sliding, the tendency to slide.',
    '**Static friction** acts when there is no sliding. It is not a fixed number: it takes whatever value (from 0 up to a maximum μ_{s}N) is needed to prevent slipping. Push a heavy box gently and it does not move: static friction exactly matches your push. Push harder than μ_{s}N and the box starts to slide.',
    '**Kinetic friction** acts once sliding occurs: f_{k} = μ_{k}N, directed opposite to the velocity of sliding. Usually μ_{k} < μ_{s}, which is why it is harder to start something sliding than to keep it sliding. The coefficients depend on the pair of materials, not (to a good approximation) on the contact area or the speed.',
    'On an **incline** of angle θ, choose axes along the slope and perpendicular to it. Then only the weight needs resolving: mg sin θ acts down the slope and mg cos θ acts into the slope. With no other perpendicular forces, N = mg cos θ, not mg.',
    'A block rests on an incline without sliding as long as mg sin θ ≤ μ_{s}mg cos θ, that is tan θ ≤ μ_{s}. The angle at which it just starts to slide satisfies tan θ = μ_{s}; notice that the mass cancels.',
  ],
  background: [
    { title: 'Free-body diagrams and ΣF = ma', text: 'Draw only forces acting on the object; resolve along chosen axes; apply ΣF_{x} = ma_{x}, ΣF_{y} = ma_{y} (see Newton laws and force diagrams).' },
    { title: 'Resolving on a slope', text: 'The angle between the weight and the perpendicular to the slope equals the slope angle θ. So the components are mg sin θ (along) and mg cos θ (perpendicular). Check with θ = 0: nothing along, all perpendicular.' },
  ],
  definitions: [
    ['Static friction f_{s}', 'Friction when surfaces do not slide: 0 ≤ f_{s} ≤ μ_{s}N, with whatever direction and size prevents slipping.'],
    ['Kinetic friction f_{k}', 'Friction during sliding: f_{k} = μ_{k}N, opposite to the direction of sliding.'],
    ['Coefficient of friction μ', 'A dimensionless number describing a pair of surfaces; μ_{s} for static, μ_{k} for kinetic.'],
    ['Angle of repose', 'The steepest incline angle on which an object stays at rest: tan θ = μ_{s}.'],
  ],
  symbols: [
    ['μ_{s}, μ_{k}', 'static and kinetic friction coefficients', 'no unit'],
    ['N', 'normal force', 'N (newton)'],
    ['f_{s}, f_{k}', 'static and kinetic friction forces', 'N'],
    ['θ', 'incline angle above horizontal', '°'],
  ],
  formulas: [
    { name: 'Static friction', f: 'f_{s} ≤ μ_{s}N', when: 'An inequality: use f_{s} = μ_{s}N only at the point of slipping. Otherwise find f_{s} from ΣF = 0.' },
    { name: 'Kinetic friction', f: 'f_{k} = μ_{k}N', when: 'Surfaces sliding. Direction opposite to the relative velocity. Approximately independent of speed and contact area.' },
    { name: 'Incline components', f: 'along the slope: mg sin θ;   perpendicular: mg cos θ', when: 'θ measured from the horizontal.' },
    { name: 'Sliding down with friction', f: 'a = g(sin θ − μ_{k} cos θ)', when: 'Block sliding down, no other forces. If the result is negative, the block decelerates (and eventually stops).' },
    { name: 'Onset of sliding', f: 'tan θ_{max} = μ_{s}', when: 'Block at rest on an incline with no other forces along the slope.' },
  ],
  derivation: {
    title: 'Acceleration of a block sliding down a rough incline',
    intro: 'Axes: x down the slope (the direction of motion), y perpendicular to it.',
    steps: [
      ['y: N − mg cos θ = 0 ⇒ N = mg cos θ.', 'No acceleration perpendicular to the slope.'],
      ['Friction: f_{k} = μ_{k}N = μ_{k}mg cos θ, pointing up the slope.', 'Opposes the sliding.'],
      ['x: mg sin θ − μ_{k}mg cos θ = ma.', 'Down-slope component of weight minus friction.'],
      ['a = g(sin θ − μ_{k} cos θ).', 'The mass cancels.'],
    ],
    end: 'With θ = 30° and μₖ = 0.20: a = 9.8(0.500 − 0.173) = 3.20 m/s². Heavy and light blocks of the same material slide down with the same acceleration.',
  },
  figure: { svg: fig, caption: 'On an incline, take axes along and perpendicular to the slope. The weight’s components (dashed) are mg sin θ along and mg cos θ into the slope; N balances mg cos θ, and friction opposes the sliding.' },
  table: {
    caption: 'Typical friction coefficients (approximate; real values vary with surface condition)',
    head: ['surfaces', 'μ_{s}', 'μ_{k}'],
    rows: [['rubber on dry concrete', '1.0', '0.8'], ['steel on steel (dry)', '0.74', '0.57'], ['wood on wood', '0.25–0.5', '0.2'], ['rubber on wet concrete', '0.3', '0.25'], ['ice on ice', '0.1', '0.03']],
    note: 'Treat tabulated coefficients as rough guides. In problems, use the values given.',
  },
  method: {
    title: 'Friction problems',
    steps: [
      'Draw the FBD. Decide whether the surfaces slide (kinetic) or not (static), and in which direction motion occurs or tends to occur. Friction points opposite.',
      'Find N from the perpendicular equation — do not assume N = mg.',
      'Kinetic: f_{k} = μ_{k}N. Static: first find the friction needed for equilibrium, then compare it with μ_{s}N. If the need exceeds μ_{s}N, the object slides.',
      'Apply ΣF = ma along the motion.',
      'Check: does the answer make sense when μ = 0 or θ = 0?',
    ],
  },
  examples: [
    {
      title: 'Kinetic friction on a level floor',
      problem: 'A 20 kg crate is pushed across a floor by a horizontal 80 N force. μ_{k} = 0.30. Find the friction force and the acceleration (g = 9.8 m/s^{2}).',
      steps: [
        ['N = mg = 20 × 9.8 = 196 N.', 'Horizontal push: no other vertical forces, so here N = mg.'],
        ['f_{k} = 0.30 × 196 = 58.8 N, opposite to the motion.', 'Kinetic friction formula.'],
        ['a = {{80 − 58.8|20}} = 1.06 m/s^{2}.', 'Net force divided by mass.'],
      ],
      result: 'f_{k} = 58.8 N; a ≈ 1.06 m/s^{2}.',
      meaning: 'If the push were exactly 58.8 N the crate would slide at constant velocity.',
    },
    {
      title: 'Does it move? (static friction)',
      problem: 'The same 20 kg crate is at rest; μ_{s} = 0.50. A horizontal push of 60 N is applied. Does it move, and what is the friction force?',
      steps: [
        ['Maximum static friction: μ_{s}N = 0.50 × 196 = 98 N.', 'The largest friction the floor can supply without slipping.'],
        ['The push 60 N is less than 98 N, so the crate stays at rest.', 'Compare the need with the limit.'],
        ['Equilibrium: f_{s} = 60 N (not 98 N).', 'Static friction only supplies what is needed.'],
      ],
      result: 'It does not move; f_{s} = 60 N.',
      meaning: 'Writing f = μₛN = 98 N would predict a 38 N net force backwards on a crate at rest — impossible.',
    },
    {
      title: 'Sliding down an incline',
      problem: 'A block slides down a 30° incline with μ_{k} = 0.20. Find its acceleration.',
      steps: [
        ['a = g(sin θ − μ_{k} cos θ).', 'Derived above; mass cancels.'],
        ['= 9.8(0.500 − 0.20 × 0.866) = 9.8 × 0.327.', 'Substitute.'],
      ],
      result: 'a ≈ 3.20 m/s^{2} down the slope.',
      meaning: 'Without friction it would be g sin 30° = 4.9 m/s².',
    },
    {
      title: 'Angle at which sliding starts',
      problem: 'A box rests on a board whose angle is slowly increased. μ_{s} = 0.40. At what angle does it start to slide?',
      steps: [
        ['On the point of slipping: mg sin θ = μ_{s}mg cos θ.', 'Down-slope pull equals maximum static friction.'],
        ['tan θ = μ_{s} = 0.40 ⇒ θ = arctan 0.40.', 'Divide by mg cos θ.'],
      ],
      result: 'θ ≈ 21.8°.',
      meaning: 'This gives a simple experiment to measure μₛ.',
    },
    {
      title: 'Net force with friction',
      problem: 'An object slides on a horizontal surface. N = 60 N, μ_{k} = 0.2, and a forward applied force is 30 N. Find the net forward force.',
      steps: [
        ['f_{k} = 0.2 × 60 = 12 N backwards.', 'Opposes sliding.'],
        ['ΣF = 30 − 12 = 18 N forward.', 'Forward positive.'],
      ],
      result: '18 N forward.',
      meaning: 'Friction reduces the effect of the applied force; it does not depend on the size of the push.',
    },
  ],
  extra: [
    { title: 'Air resistance and terminal speed (check whether your outline includes it)', text: [
      'A body moving through air or water feels a **drag** force opposite to its velocity, and drag grows with speed. A falling object therefore speeds up less and less: once drag equals the weight, the net force is zero and the speed stops increasing. That constant speed is the **terminal speed**.',
      'In the simple linear model F_{drag} = bv, terminal speed satisfies mg = bv_{t}, so v_{t} = mg/b. For m = 1.0 kg and b = 2.0 N·s/m (with g = 9.8 m/s^{2}), v_{t} = 9.8/2.0 = 4.9 m/s. Many real objects follow a quadratic law (drag ∝ v²) instead; the model must match the situation.',
    ] },
  ],
  mistakes: [
    ['Always writing f = μN for static friction.', 'Static friction is ≤ μₛN. Use the equality only at the point of slipping.'],
    ['Taking N = mg on an incline.', 'On an incline N = mg cos θ (if no other perpendicular forces).'],
    ['Friction always points backwards.', 'It opposes relative sliding. A crate on an accelerating truck bed is pushed forward by static friction.'],
    ['Swapping sin and cos on the incline.', 'Check θ = 0: the along-slope component must vanish, so it is mg sin θ.'],
    ['Friction depends on contact area.', 'In the simple model it depends only on μ and N.'],
  ],
  scope: [
    'Coulomb’s friction model (constant μ) is an approximation. Rolling resistance, lubrication and air drag need other models.',
  ],
  checks: [
    ['terminal', 1 * 9.8 / 2, 4.9, 1e-12],
    ['fk', 0.3 * 196, 58.8, 1e-9], ['a', (80 - 58.8) / 20, 1.06, 1e-9], ['fsmax', 0.5 * 196, 98, 1e-9],
    ['incline', 9.8 * (0.5 - 0.2 * Math.cos(th)), 3.20, 0.005], ['angle', Math.atan(0.4) * 180 / Math.PI, 21.8, 0.05],
    ['net', 30 - 12, 18, 0], ['frictionless', 9.8 * 0.5, 4.9, 1e-12],
  ],
};
