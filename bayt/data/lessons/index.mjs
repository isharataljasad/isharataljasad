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

export const lessons = [
  ma101Limits,
  ma101Continuity,
  ma101Derivative,
  ma101Rules,
  phy101Measurement,
  phy101Motion,
  phy101Forces,
  chem101AtomicStructure,
  chem101Solutions,
  chem101Gases,
];
