/* ==========================================================================
   bayt/data/journey.mjs — العمود الفقري لتجربة «بيت الفؤاد».

   السلسلة التي تربط التطبيق كله:

     هدف الطالب  ←  المهارات المطلوبة  ←  التعلّم  ←  مهام في الجدول  ←  إنجاز

   كل قسم وكل هدف وكل مهارة يحمل معرّفًا ثابتًا لا يتغير، حتى يمكن إضافة مواد
   وفصول لاحقًا دون كسر رابط محفوظ أو تقدّم مخزّن على جهاز الطالب.

   لا شيء هنا يدّعي أن محتوى موجود. الحقل `status` يذكر الحالة الحقيقية،
   والبنّاء يتحقق من أن كل رابط تعلّم يشير إلى صفحة موجودة فعلًا.
   ========================================================================== */

/* حالات المحتوى. تظهر للطالب كما هي، دون تجميل. */
export const statuses = {
  ready: { label: 'متاح الآن', tone: 'ready' },
  partial: { label: 'متاح جزئيًا', tone: 'partial' },
  soon: { label: 'قيد التطوير', tone: 'soon' },
};

/* الأقسام السبعة. الترتيب هو ترتيب العرض في الصفحة الرئيسة. */
export const sections = [
  {
    id: 'planner',
    title: 'التخطيط',
    line: 'الوقت، الأولويات، الصحة، العلاقات، الميزانية، والعادات.',
    href: '/bayt/planner/',
    status: 'partial',
    note: 'الأسبوع والمهام والعادات تعمل وتُحفظ على جهازك. الميزانية والعلاقات لم تُبنَ بعد.',
  },
  {
    id: 'english',
    title: 'الإنجليزية',
    line: 'اللغة الأكاديمية، الكتابة والتقارير، والتحضير لـ IELTS Academic.',
    href: '/bayt/english/',
    status: 'partial',
    note: 'درس كتابة تقنية واحد مكتمل داخل بيت الفؤاد، وثلاثة مسارات دراسية سابقة. لا ضمان لأي درجة.',
  },
  {
    id: 'math',
    title: 'الرياضيات',
    line: 'الأساسيات ثم التفاضل والتكامل، بشرح قبل السؤال.',
    href: '/foundations/concepts/',
    status: 'partial',
    note: 'أحد عشر فصلًا مكتوبًا من أصل 296 حلقة مفهرسة، وتسعة مواضيع في تفاضل وتكامل 101.',
  },
  {
    id: 'physics',
    title: 'الفيزياء',
    line: 'القياس والحركة والقوى والطاقة.',
    href: '/semester-1/physics/',
    status: 'partial',
    note: 'ثمانية مواضيع بشرح وتمرين. لم تُراجع بعد بعمق مثل مواد الأساسيات.',
  },
  {
    id: 'chemistry',
    title: 'الكيمياء',
    line: 'الذرّة والروابط والمحاليل والاتزان.',
    href: '/semester-1/chemistry/',
    status: 'partial',
    note: 'تسعة مواضيع، وساحة تفاعلية للتركيب الذري.',
  },
  {
    id: 'biology',
    title: 'الأحياء',
    line: 'فهرس مصادر ومسارات دراسة.',
    href: '/biology/',
    status: 'soon',
    note: 'فهرسة مصادر فقط. لا توجد دروس أصلية مكتوبة بعد.',
  },
  {
    id: 'future',
    title: 'المستقبل',
    line: 'التدريب، المهارات المهنية، المشروعات، وملف الإنجاز.',
    href: '/bayt/portfolio/',
    status: 'partial',
    note: 'ملف الإنجاز يعمل ويحفظ ما تنجزه. أدلة التدريب والمشروعات لم تُكتب بعد.',
  },
];

/* المهارات. `learn` يشير إلى صفحة تعليمية موجودة على الموقع؛ البنّاء يفشل
   إذا لم تكن موجودة، حتى لا يصل الطالب إلى رابط مكسور. */
export const skills = [
  {
    id: 'SKILL-MATBAL',
    title: 'موازنة المواد حول حدود نظام',
    why: 'أول أداة حقيقية في الهندسة الكيميائية: ترسم حدودًا، وتحسب ما يدخل وما يخرج.',
    section: 'chemistry',
    learn: { href: '/program/lessons/material-balances/', label: 'درس موازنة المواد', minutes: 25 },
    evidence: 'حساب تركيز مخرج خلّاط بخطوات مشروحة.',
  },
  {
    id: 'SKILL-UNITS',
    title: 'الوحدات والكسور الكتلية',
    why: 'أكثر أخطاء الحسابات الهندسية سببها وحدة لم تُوحَّد قبل الجمع، أو نسبة مئوية ضُربت دون قسمتها على مئة.',
    section: 'math',
    /* كان هذا يشير إلى درس ترتيب العمليات، وهو لا يغطي الوحدات ولا الكسور
       الكتلية. كُتب درس أصلي يغطي المهارة فعلًا ويمهّد لموازنة المواد. */
    learn: { href: '/bayt/math/units-and-mass-fractions/', label: 'درس الوحدات والكسور الكتلية', minutes: 20 },
    evidence: 'تحويل وحدات بعامل تحويل، وحساب تدفق مكوّن من كسر كتلي.',
  },
  {
    id: 'SKILL-PROCESS-WRITING',
    title: 'وصف عملية صناعية بالإنجليزية',
    why: 'التقرير الذي لا يُفهم لا يُقرأ. وصف العملية هو أول ما يُطلب في أي تقرير مختبر أو تدريب.',
    section: 'english',
    learn: { href: '/bayt/english/process-description/', label: 'درس وصف العملية', minutes: 20 },
    evidence: 'فقرة إنجليزية تصف عملية خلط، مع مراجعة ذاتية.',
  },
  {
    id: 'SKILL-GEOMETRY-READ',
    title: 'قراءة رسم هندسي دون افتراضات',
    why: 'الرسم نموذج لا دليل. تمييز المذكور عن الظاهر يمنع أخطاء كثيرة لاحقًا.',
    section: 'math',
    learn: { href: '/foundations/concepts/points-lines-and-planes/', label: 'النقاط والمستقيمات والمستويات', minutes: 30 },
    evidence: 'تحديد ما يجوز استنتاجه من رسم وما لا يجوز.',
  },
];

/* الأهداف. كل هدف يجمع مهارات، وكل مهارة تولّد مهمة في جدول الطالب. */
export const goals = [
  {
    id: 'GOAL-CE201-REPORT',
    title: 'أنجز أول تقرير موازنة مواد',
    audience: 'طالب هندسة كيميائية · الفصل الثالث',
    summary: 'تتعلّم موازنة المواد، تحسب مثالًا، ثم تصف العملية بالإنجليزية كما يُطلب في التقرير.',
    course: 'CE201',
    skills: ['SKILL-UNITS', 'SKILL-MATBAL', 'SKILL-PROCESS-WRITING'],
    outcome: 'تقرير واحد يجمع الحساب بوحداته وافتراضاته مع الوصف الإنجليزي، محفوظ وقابل للتعديل.',
    status: 'ready',
    report: { href: '/bayt/report/', label: 'افتح نموذج التقرير' },
    weekPlan: [
      { skill: 'SKILL-UNITS', day: 0, minutes: 20, title: 'ادرس الوحدات والكسور الكتلية' },
      { skill: 'SKILL-MATBAL', day: 1, minutes: 25, title: 'ادرس درس موازنة المواد' },
      { skill: 'SKILL-MATBAL', day: 2, minutes: 15, title: 'احسب مثال الخلّاط بنفسك' },
      { skill: 'SKILL-PROCESS-WRITING', day: 3, minutes: 20, title: 'ادرس وصف العملية بالإنجليزية' },
      { skill: 'SKILL-PROCESS-WRITING', day: 4, minutes: 30, title: 'اكتب التقرير كاملًا واحفظه' },
    ],
  },
  {
    id: 'GOAL-IELTS-7',
    title: 'التحضير لـ IELTS Academic بهدف 7',
    audience: 'طالب جامعي يخطط لدراسات عليا',
    summary: 'مسار طويل. المتاح الآن جزء الكتابة الأكاديمية فقط داخل بيت الفؤاد.',
    course: null,
    skills: ['SKILL-PROCESS-WRITING'],
    outcome: 'نماذج كتابة مصحّحة ذاتيًا. الدرجة لا يضمنها أحد.',
    status: 'partial',
    weekPlan: [
      { skill: 'SKILL-PROCESS-WRITING', day: 1, minutes: 20, title: 'ادرس وصف العملية بالإنجليزية' },
    ],
  },
  {
    id: 'GOAL-COOP',
    title: 'الاستعداد للتدريب التعاوني',
    audience: 'طالب يقترب من سنة التدريب',
    summary: 'المهارات والملف المهني. لم تُكتب أدلة هذا المسار بعد.',
    course: 'CE490',
    skills: [],
    outcome: 'ملف إنجاز قابل للعرض على جهة التدريب.',
    status: 'soon',
    weekPlan: [],
  },
];

/* عادات أسبوعية افتراضية يقترحها التخطيط. الطالب يضيف أو يحذف. */
export const suggestedHabits = [
  { id: 'HABIT-SLEEP', title: 'نوم منتظم قبل منتصف الليل', area: 'الصحة' },
  { id: 'HABIT-MOVE', title: 'حركة 30 دقيقة', area: 'الصحة' },
  { id: 'HABIT-REVIEW', title: 'مراجعة 20 دقيقة قبل النوم', area: 'الدراسة' },
  { id: 'HABIT-CONTACT', title: 'تواصل مع الأهل', area: 'العلاقات' },
];

export const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const skillById = new Map(skills.map((s) => [s.id, s]));
export const goalById = new Map(goals.map((g) => [g.id, g]));
