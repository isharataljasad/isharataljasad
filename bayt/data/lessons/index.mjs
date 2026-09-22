/* سجلّ دروس بيت الفؤاد الكاملة.
   الدرس هنا يعني: الطرق الثلاث مجتمعة داخل صفحة واحدة، بأهداف وحدود
   ومتطلبات معالَجة وأنماط أسئلة تفسّر الخطأ. ما دون ذلك لا يُدرج. */
import ma101Limits from './ma101-limits.mjs';
import ma101Derivative from './ma101-derivative.mjs';
import phy101Measurement from './phy101-measurement.mjs';
import ma101Continuity from './ma101-continuity.mjs';
import chem101AtomicStructure from './chem101-atomic-structure.mjs';

import chem101Solutions from './chem101-solutions.mjs';

import phy101Motion from './phy101-motion.mjs';

import ma101Rules from './ma101-rules.mjs';

import phy101Forces from './phy101-forces.mjs';

import chem101Gases from './chem101-gases.mjs';

import phy101Energy from './phy101-energy.mjs';

import chem101Thermochemistry from './chem101-thermochemistry.mjs';

import ma101Optimization from './ma101-optimization.mjs';

import phy101Momentum from './phy101-momentum.mjs';

import chem101PeriodicTable from './chem101-periodic-table.mjs';

import phy101Friction from './phy101-friction.mjs';

import phy101CircularMotion from './phy101-circular-motion.mjs';

import phy101LabGraphs from './phy101-lab-graphs.mjs';
import ma101RelatedRates from './ma101-related-rates.mjs';
import ma101Approximation from './ma101-approximation.mjs';
import ma101MeanValue from './ma101-mean-value.mjs';
import ma101CurveShape from './ma101-curve-shape.mjs';
import chem101QuantumTheory from './chem101-quantum-theory.mjs';
import chem101Bonding from './chem101-bonding.mjs';
import chem101AqueousReactions from './chem101-aqueous-reactions.mjs';
import chem101Electrochemistry from './chem101-electrochemistry.mjs';
import { extendLessons } from './extensions.mjs';

export const lessons = extendLessons([
  ma101Limits,
  ma101Continuity,
  ma101Derivative,
  ma101Rules,
  ma101RelatedRates,
  ma101Approximation,
  ma101MeanValue,
  ma101CurveShape,
  ma101Optimization,
  phy101Measurement,
  phy101Motion,
  phy101Forces,
  phy101Friction,
  phy101Energy,
  phy101Momentum,
  phy101CircularMotion,
  phy101LabGraphs,
  chem101AtomicStructure,
  chem101Solutions,
  chem101Gases,
  chem101PeriodicTable,
  chem101Thermochemistry,
  chem101QuantumTheory,
  chem101Bonding,
  chem101AqueousReactions,
  chem101Electrochemistry,
]);
