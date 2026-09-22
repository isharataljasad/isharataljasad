/* ==========================================================================
   مخطّط درس بيت الفؤاد.

   الصفحات القائمة لا تستطيع بنيتُها حملَ ما تتطلبه المراجعة: لا متطلبات
   سابقة، ولا مفاهيم خاطئة، ولا أنماط أسئلة، ولا رسوم أصلية. هذا المخطّط
   يضيف الحقول الناقصة، ويتحقق منها عند البناء حتى لا يمرّ درس ناقص صامتًا.

   الطرق الثلاث تجتمع داخل الدرس الواحد:
     reference — تعريفات وعلاقات واشتقاق: المعرفة مرتّبة للرجوع إليها.
     visual    — رسم وجدول وتفاعل: الفكرة تُرى وتُجرَّب قبل أن تُحفظ.
     guided    — بداية ومتطلبات وخطوات بأسبابها: الطريق من الصفر إلى الحل.
   ========================================================================== */

/** الحقول التي لا يصحّ درس بدونها، ولماذا. */
const REQUIRED = {
  course: 'معرّف المقرر كما في curriculum.json',
  topic: 'معرّف الموضوع كما في curriculum.json',
  objectives: 'ما سيقدر الطالب عليه بعد الدرس',
  boundaries: 'ما لا يغطّيه الدرس، حتى لا يظنّ الطالب أنه أتمّ الموضوع',
  prerequisites: 'المتطلبات، كل واحد موصول بشرح يغطّيه فعلًا',
  reference: 'التعريفات والعلاقات',
  visual: 'الرسم والجدول',
  guided: 'البداية والأمثلة المحلولة',
  questionTypes: 'أنماط الأسئلة المتمايزة',
};

/** أقل ما يجعل الدرس مستوفيًا. أرقام مشتقّة من متطلبات المراجعة. */
export const MINIMUM = {
  objectives: 2,
  prerequisites: 1,
  definitions: 2,
  questionTypes: 4,
  workedSteps: 3,
};

export function validate(lesson) {
  const problems = [];
  const at = `${lesson.course ?? '?'}.${lesson.topic ?? '?'}`;

  for (const [field, why] of Object.entries(REQUIRED)) {
    if (lesson[field] === undefined) problems.push(`${at}: ينقص «${field}» — ${why}`);
  }
  if (problems.length) return problems;

  if (lesson.objectives.length < MINIMUM.objectives)
    problems.push(`${at}: الأهداف ${lesson.objectives.length}، والمطلوب ${MINIMUM.objectives} على الأقل`);
  if (!lesson.boundaries.length)
    problems.push(`${at}: حدود الدرس فارغة — الطالب يحتاج أن يعرف ما لم يُغطَّ`);
  if (lesson.prerequisites.length < MINIMUM.prerequisites)
    problems.push(`${at}: لا متطلبات مذكورة`);

  for (const p of lesson.prerequisites) {
    /* متطلب مذكور بلا علاج هو اسم معلّق: يخبر الطالب أنه ناقص ثم يتركه.
       صفحات ‎/foundations/‎ مكتبات ملفات مصدرية، لا شروحًا موجّهة لمهارة
       بعينها، فالإحالة إليها وحدها لا تعالج النقص. لذلك الشرح المضمّن
       إلزامي، والرابط إضافة اختيارية. */
    if (!p.recap) problems.push(`${at}: المتطلب «${p.title}» بلا شرح مضمّن يعالجه`);
    if (!p.why) problems.push(`${at}: المتطلب «${p.title}» بلا سبب يربطه بالدرس`);
  }

  const definitions = lesson.reference?.definitions ?? [];
  if (definitions.length < MINIMUM.definitions)
    problems.push(`${at}: التعريفات ${definitions.length}، والمطلوب ${MINIMUM.definitions}`);
  for (const d of definitions) {
    if (!d.term || !d.text) problems.push(`${at}: تعريف ناقص المصطلح أو النص`);
    /* المصطلح الإنجليزي مطلوب: الامتحان والمرجع بالإنجليزية. */
    if (!d.en) problems.push(`${at}: التعريف «${d.term}» بلا مقابل إنجليزي`);
  }

  if (!lesson.visual?.figure?.svg) problems.push(`${at}: لا رسم أصلي`);
  if (!lesson.visual?.figure?.alt) problems.push(`${at}: الرسم بلا وصف نصّي بديل`);
  if (!lesson.visual?.table) problems.push(`${at}: لا جدول`);

  if (!lesson.guided?.start) problems.push(`${at}: لا بداية واضحة للشرح المتدرّج`);
  const steps = (lesson.guided?.workedExamples ?? []).reduce((n, w) => n + (w.steps?.length ?? 0), 0);
  if (steps < MINIMUM.workedSteps)
    problems.push(`${at}: خطوات الأمثلة المحلولة ${steps}، والمطلوب ${MINIMUM.workedSteps}`);
  for (const w of lesson.guided?.workedExamples ?? []) {
    for (const s of w.steps ?? []) {
      /* الخطوة بلا سبب تُري الطالب ماذا فُعل ولا تُعلّمه لماذا. */
      if (!s.why) problems.push(`${at}: خطوة في «${w.title}» بلا سبب`);
    }
  }

  if (lesson.questionTypes.length < MINIMUM.questionTypes)
    problems.push(`${at}: أنماط الأسئلة ${lesson.questionTypes.length}، والمطلوب ${MINIMUM.questionTypes}`);
  const kinds = new Set();
  for (const q of lesson.questionTypes) {
    if (kinds.has(q.id)) problems.push(`${at}: معرّف سؤال مكرّر «${q.id}»`);
    kinds.add(q.id);
    if (typeof q.answer !== 'number') problems.push(`${at}: السؤال «${q.id}» بلا إجابة عددية`);
    if (typeof q.tolerance !== 'number') problems.push(`${at}: السؤال «${q.id}» بلا سماحية`);
    if (!q.solution) problems.push(`${at}: السؤال «${q.id}» بلا حلّ مشروح`);
    /* تغذية راجعة تقول «غير صحيح» فقط تترك الطالب حيث كان. */
    if (!(q.commonErrors ?? []).length)
      problems.push(`${at}: السؤال «${q.id}» بلا أخطاء شائعة تفسّر سبب الخطأ`);
    for (const e of q.commonErrors ?? []) {
      if (typeof e.value !== 'number') problems.push(`${at}: خطأ شائع بلا قيمة في «${q.id}»`);
      if (!e.why) problems.push(`${at}: خطأ شائع بلا تفسير في «${q.id}»`);
      if (Math.abs(e.value - q.answer) <= q.tolerance)
        problems.push(`${at}: «الخطأ الشائع» ${e.value} في «${q.id}» يقع داخل سماحية الإجابة الصحيحة`);
    }
  }

  /* الأهداف بلا أسئلة تقيسها تبقى وعدًا غير محقّق. */
  const covered = new Set(lesson.questionTypes.flatMap((q) => q.objectives ?? []));
  lesson.objectives.forEach((_, i) => {
    if (!covered.has(i)) problems.push(`${at}: الهدف رقم ${i + 1} لا يقيسه أي سؤال`);
  });

  return problems;
}
