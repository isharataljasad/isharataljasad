import { svg, rect, text, line } from '../svg.mjs';

// Energy bar charts for a 2 kg ball dropped from 5 m (g = 9.8): U = mgh, K = mgh0 − mgh.
const m = 2, g = 9.8, h0 = 5, E = m * g * h0; // 98 J
const stages = [[5, 'top, h = 5 m'], [2.5, 'h = 2.5 m'], [0, 'bottom, h = 0']];
const scale = 1.5; // px per J
const fig = svg('phy-energy', { w: 500, h: 290, title: 'Energy bar charts for a falling ball', desc: 'Three pairs of bars for a 2 kg ball dropped from 5 m with no air resistance. At the top: potential energy 98 J, kinetic energy 0. Halfway down: 49 J and 49 J. At the bottom: potential 0, kinetic 98 J. The total is always 98 J.' },
  stages.map(([h, lab], i) => {
    const U = m * g * h, K = E - U, x = 50 + i * 155, base = 220;
    return rect(x, base - U * scale, 40, U * scale || 0.5, { fill: '#355b90', stroke: '#355b90', rx: 2 })
      + rect(x + 50, base - K * scale, 40, K * scale || 0.5, { fill: '#9b6328', stroke: '#9b6328', rx: 2 })
      + text(x + 20, base - U * scale - 6, `${U.toFixed(0)} J`, { anchor: 'middle', size: 13 })
      + text(x + 70, base - K * scale - 6, `${K.toFixed(0)} J`, { anchor: 'middle', size: 13 })
      + text(x + 20, base + 18, 'U', { anchor: 'middle', color: '#355b90', weight: 650 })
      + text(x + 70, base + 18, 'K', { anchor: 'middle', color: '#9b6328', weight: 650 })
      + text(x + 45, base + 40, lab, { anchor: 'middle', size: 13, color: '#5e7376' });
  }).join('') + line(35, 220, 470, 220, { width: 1.5 })
  + text(250, 30, 'U + K = 98 J at every height (no air resistance)', { anchor: 'middle', size: 14, color: '#176e66' }));

export default {
  summary: 'Work transfers energy. Kinetic and potential energy trade places, and the total is conserved unless friction or other forces add or remove energy. Power is the rate of energy transfer.',
  why: [
    'Energy methods solve problems that are awkward with forces alone: the speed of a roller coaster at the bottom of a hill, the height a spring launches a ball, the power a motor needs to lift a load. Energy is also the currency of engineering: efficiency, losses, fuel and electricity costs are all energy bookkeeping.',
  ],
  idea: [
    '**Work** is how a force transfers energy to or from an object as it moves: W = Fd cos θ, where θ is the angle between the force and the displacement. Only the component of the force along the motion does work. A force perpendicular to the motion (like the normal force on a level floor) does no work. A force opposing the motion (friction) does negative work: it removes energy.',
    '**Kinetic energy** K = {{1|2}}mv^{2} is the energy of motion. The **work–energy theorem** says the net work done on an object equals its change in kinetic energy: W_{net} = ΔK. Note the v²: doubling the speed quadruples the kinetic energy, which is why stopping distances grow so quickly with speed.',
    'Some forces — gravity and ideal springs — store the work done against them as **potential energy**: U_{g} = mgh (height measured from any chosen reference level) and U_{s} = {{1|2}}kx^{2}. These are **conservative** forces: the work they do depends only on the start and end positions, not the path.',
    'If only conservative forces do work, mechanical energy is conserved: K + U stays constant. If friction or other non-conservative forces act, K_{i} + U_{i} + W_{other} = K_{f} + U_{f}; friction’s negative work becomes thermal energy. Energy is never destroyed, only transferred or transformed.',
    '**Power** is the rate of doing work or transferring energy: P = W/Δt, measured in watts (1 W = 1 J/s). For a force along the velocity, P = Fv. Efficiency compares useful output with input: η = P_{out}/P_{in}, always less than 100% in real machines.',
  ],
  background: [
    { title: 'Components and the cosine', text: 'The component of F along the displacement is F cos θ. cos 0° = 1, cos 90° = 0, cos 180° = −1.' },
    { title: 'Kinematics link', text: 'v² = v₀² + 2aΔx multiplied by m/2 gives ½mv² − ½mv₀² = maΔx = FΔx: the work–energy theorem for a constant force.' },
  ],
  definitions: [
    ['Work W', 'Energy transferred by a force acting through a displacement: W = Fd cos θ (constant force). Unit: joule, 1 J = 1 N·m. Scalar, can be negative.'],
    ['Kinetic energy K', 'K = {{1|2}}mv^{2}; never negative.'],
    ['Gravitational potential energy', 'U_{g} = mgh near the Earth’s surface, with h measured from a chosen reference level. Only changes ΔU matter.'],
    ['Elastic potential energy', 'U_{s} = {{1|2}}kx^{2} for an ideal spring stretched or compressed by x from its natural length.'],
    ['Mechanical energy', 'E = K + U.'],
    ['Power P', 'Rate of energy transfer, P = {{W|Δt}}; unit watt (W). 1 kW·h = 3.6 × 10^{6} J.'],
  ],
  symbols: [
    ['W', 'work', 'J'], ['K, U', 'kinetic, potential energy', 'J'], ['h', 'height above the reference level', 'm'],
    ['k', 'spring constant', 'N/m'], ['x', 'spring extension or compression', 'm'], ['P', 'power', 'W = J/s'], ['η', 'efficiency', '% or fraction'],
  ],
  formulas: [
    { name: 'Work by a constant force', f: 'W = Fd cos θ', when: 'Force constant in size and direction over the displacement d; θ is the angle between F and the displacement. For a varying force, W is the area under the F–x graph.' },
    { name: 'Work–energy theorem', f: 'W_{net} = ΔK = {{1|2}}mv_{f}^{2} − {{1|2}}mv_{i}^{2}', when: 'Always true for a particle; W_net is the work of all forces together.' },
    { name: 'Conservation of mechanical energy', f: 'K_{i} + U_{i} = K_{f} + U_{f}', when: 'Only conservative forces (gravity, ideal springs) do work. Otherwise include W_{other}: K_{i} + U_{i} + W_{other} = K_{f} + U_{f}.' },
    { name: 'Spring force and energy', f: 'F = −kx;   U_{s} = {{1|2}}kx^{2}', when: 'Ideal spring within its elastic limit (Hooke’s law).' },
    { name: 'Power', f: 'P = {{W|Δt}};   P = Fv', when: 'P = Fv for a force parallel to the velocity; instantaneous power.' },
  ],
  derivation: {
    title: 'Speed at the bottom of a frictionless slope does not depend on its shape',
    intro: 'An object starts from rest at height h and slides without friction to the bottom.',
    steps: [
      ['K_{i} + U_{i} = K_{f} + U_{f}: 0 + mgh = {{1|2}}mv^{2} + 0.', 'Only gravity does work (the normal force is perpendicular to the motion).'],
      ['v^{2} = 2gh ⇒ v = √{2gh}.', 'The mass cancels.'],
    ],
    end: 'A steep slope and a gentle one of the same height give the same final speed (the gentle one just takes longer). Energy methods ignore the path; that is their power.',
  },
  figure: { svg: fig, caption: 'As the ball falls, potential energy (blue) turns into kinetic energy (gold). With no air resistance the total stays 98 J.' },
  table: {
    caption: 'The 2 kg ball dropped from 5 m (g = 9.8 m/s²)',
    head: ['height h (m)', 'U = mgh (J)', 'K = 98 − U (J)', 'speed v = √(2K/m) (m/s)'],
    rows: [['5', '98', '0', '0'], ['2.5', '49', '49', '7.0'], ['1', '19.6', '78.4', '8.85'], ['0', '0', '98', '9.90']],
    note: 'Speed is not proportional to the distance fallen: halfway down the ball already has 71% of its final speed.',
  },
  method: {
    title: 'Energy problem-solving',
    steps: [
      'Choose the system and the initial and final states. Sketch both.',
      'Choose a reference level for height (U_{g} = 0 there).',
      'List K and U in each state. Identify forces that do work but have no potential energy (friction, applied pushes): they enter as W_{other}.',
      'Write K_{i} + U_{i} + W_{other} = K_{f} + U_{f} and solve.',
      'Use forces and kinematics instead when you need time or acceleration; energy gives speeds and positions.',
    ],
  },
  examples: [
    {
      title: 'Work by a force at an angle',
      problem: 'A 50 N pull at 37° above the horizontal drags a box 4.0 m across a floor. How much work does the pull do?',
      steps: [
        ['W = Fd cos θ = 50 × 4.0 × cos 37°.', 'Only the horizontal component does work.'],
        ['= 200 × 0.799 = 160 J.', 'cos 37° ≈ 0.799.'],
      ],
      result: 'W ≈ 160 J.',
      meaning: 'The vertical component (≈ 30 N) does no work because the box does not move vertically.',
    },
    {
      title: 'Speed from energy conservation',
      problem: 'A ball is dropped from 5.0 m. Find its speed just before hitting the ground (no air resistance).',
      steps: [
        ['mgh = {{1|2}}mv^{2}.', 'Potential energy becomes kinetic energy.'],
        ['v = √{2gh} = √{2 × 9.8 × 5.0} = √{98} = 9.90 m/s.', 'Mass cancels.'],
      ],
      result: 'v ≈ 9.9 m/s.',
      meaning: 'Same result as kinematics (v² = 2gΔy), found without time.',
    },
    {
      title: 'Friction removes energy',
      problem: 'A 2.0 kg block slides down a 3.0 m high ramp from rest and reaches the bottom at 6.0 m/s. How much energy did friction remove?',
      steps: [
        ['Initial: U_{i} = mgh = 2.0 × 9.8 × 3.0 = 58.8 J; K_{i} = 0.', 'Reference level at the bottom.'],
        ['Final: K_{f} = {{1|2}}(2.0)(6.0)^{2} = 36 J; U_{f} = 0.', 'Kinetic energy at the bottom.'],
        ['W_{friction} = E_{f} − E_{i} = 36 − 58.8 = −22.8 J.', 'Non-conservative work equals the change in mechanical energy.'],
      ],
      result: 'Friction removed 22.8 J (it became thermal energy).',
      meaning: 'Without friction the block would have reached √(2 × 9.8 × 3) = 7.67 m/s.',
    },
    {
      title: 'A spring launcher',
      problem: 'A spring with k = 400 N/m is compressed 0.10 m and launches a 0.050 kg ball vertically. How high does the ball rise above its launch point (no losses)?',
      steps: [
        ['Spring energy: {{1|2}}kx^{2} = {{1|2}}(400)(0.10)^{2} = 2.0 J.', 'Stored elastic energy.'],
        ['At the top all of it is gravitational: mgh = 2.0 J.', 'K = 0 at the highest point.'],
        ['h = {{2.0|0.050 × 9.8}} = 4.08 m.', 'Solve for h.'],
      ],
      result: 'h ≈ 4.1 m.',
      meaning: 'Doubling the compression would quadruple the stored energy and the height.',
    },
    {
      title: 'Power of a motor',
      problem: 'A motor lifts a 100 kg load 12 m at constant speed in 20 s. Find the useful power. If the motor draws 800 W, what is its efficiency?',
      steps: [
        ['Work against gravity: W = mgh = 100 × 9.8 × 12 = 11 760 J.', 'Constant speed: no change in kinetic energy.'],
        ['P = {{W|t}} = {{11 760|20}} = 588 W.', 'Rate of doing work.'],
        ['η = {{588|800}} = 0.735.', 'Useful output over input.'],
      ],
      result: 'Useful power 588 W; efficiency ≈ 73.5%.',
      meaning: 'The other 212 W becomes heat in the motor and gearing.',
    },
    {
      title: 'Average power',
      problem: 'A motor transfers 600 J in 5 s. Find its average power.',
      steps: [['P = {{600 J|5 s}} = 120 W.', 'Definition of power.']],
      result: '120 W.',
      meaning: 'Energy and power are different: 600 J is an amount; 120 W is how fast it is delivered.',
    },
  ],
  mistakes: [
    ['“Any force on a moving object does work.”', 'Only the component along the displacement does work; perpendicular forces (normal force on a level floor, centripetal force) do none.'],
    ['Forgetting the sign of work.', 'Friction and braking forces do negative work, reducing kinetic energy.'],
    ['Using K = mv² or forgetting to square v.', 'K = ½mv².'],
    ['Using conservation of mechanical energy when friction acts.', 'Include W_friction (negative) or the energy lost to heat.'],
    ['Confusing energy (J) with power (W).', 'Power is energy per unit time. kW·h is a unit of energy.'],
  ],
  scope: [
    'Gravitational potential energy mgh assumes heights small compared with the Earth’s radius.',
    'Work by variable forces (area under F–x graphs) is introduced; general line integrals are beyond this course.',
  ],
  checks: [
    ['work', 50 * 4 * Math.cos(37 * Math.PI / 180), 160, 0.5], ['drop v', Math.sqrt(2 * 9.8 * 5), 9.90, 0.005],
    ['ramp U', 2 * 9.8 * 3, 58.8, 1e-9], ['ramp W', 36 - 58.8, -22.8, 1e-9], ['ramp v', Math.sqrt(2 * 9.8 * 3), 7.67, 0.005],
    ['spring', 0.5 * 400 * 0.01, 2, 1e-12], ['spring h', 2 / (0.05 * 9.8), 4.08, 0.005],
    ['motor W', 100 * 9.8 * 12, 11760, 1e-9], ['motor P', 11760 / 20, 588, 1e-9], ['eff', 588 / 800, 0.735, 1e-12], ['avg P', 600 / 5, 120, 0],
    ['table v 2.5', Math.sqrt(2 * 49 / 2), 7.0, 1e-9], ['table v 1', Math.sqrt(2 * 78.4 / 2), 8.85, 0.005], ['71%', 7 / 9.899, 0.71, 0.005],
  ],
};
