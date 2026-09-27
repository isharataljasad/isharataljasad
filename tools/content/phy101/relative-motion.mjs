// Promoted from tools/content/support/relative-motion.mjs (added by Codex in aa7c04c)
// to a lesson of its own, placed straight after vectors and motion.
import s from '../support/relative-motion.mjs';
export default {
  ...s,
  summary: 'Every velocity is measured relative to an observer. Name the frame, then add velocities as vectors: v_{A/C} = v_{A/B} + v_{B/C}.',
  why: [s.intro, 'Relative motion is used whenever a vehicle moves through a moving medium — boats in currents, aircraft in wind, conveyors and moving walkways — and whenever two moving objects approach or overtake each other.'],
  idea: s.ideas,
  background: [
    { title: 'Vector components', text: 'A velocity at angle θ has components v cos θ and v sin θ along perpendicular axes; its magnitude is √{v_{x}^{2} + v_{y}^{2}} (see Vectors and motion).' },
    { title: 'Constant velocity', text: 'With constant velocity, distance along a direction = (velocity component in that direction) × time.' },
  ],
  method: { title: 'How to solve a relative-motion problem', steps: [
    'Name every velocity with two labels: the moving object and the observer (v_{boat/water}, v_{water/bank}).',
    'Choose axes once and write every velocity in components with signs.',
    'Chain the frames so the middle label cancels: v_{A/C} = v_{A/B} + v_{B/C}.',
    'Use the component along a required direction to find times; use the magnitude only for a speed along the actual path.',
  ] },
  scope: ['Classical (Galilean) velocity addition only: speeds far below the speed of light, frames that do not rotate relative to each other.', 'Accelerating frames are not treated.'],
};
