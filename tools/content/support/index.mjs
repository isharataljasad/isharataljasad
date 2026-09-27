import relativeMotion from './relative-motion.mjs';
import amountAndFormulas from './amount-and-formulas.mjs';
import chemicalNaming from './chemical-naming.mjs';
import intermolecularForces from './intermolecular-forces.mjs';

// Essential background lives in existing subject guides, not a fourth subject
// or another dashboard. Each block is also rendered in every source route.
export const supportByTopic = {
 'phy101/motion':[relativeMotion],
 'chemistry/atomic-structure':[amountAndFormulas],
 'chemistry/bonding':[chemicalNaming,intermolecularForces],
};
export const supportingLessons = Object.values(supportByTopic).flat();
