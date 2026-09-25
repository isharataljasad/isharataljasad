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
  ready: { label: "Available now", tone: 'ready' },
  partial: { label: "Partially available", tone: 'partial' },
  soon: { label: "Under development", tone: 'soon' },
};

/* الأقسام السبعة. الترتيب هو ترتيب العرض في الصفحة الرئيسة. */
export const sections = [
  {
    id: 'planner',
    title: "Planning",
    line: "Time, priorities, health, relationships, budget, and habits.",
    href: '/bayt/planner/',
    status: 'partial',
    note: "Week, tasks and habits are running and saved on your device. Budget and relationships not yet built.",
  },
  {
    id: 'english',
    title: "English",
    line: "Academic language, writing and reports, and preparation for IELTS Academic.",
    href: '/bayt/english/',
    status: 'partial',
    note: "One technical writing lesson completed within Bayt Al-Fuad, and three previous courses of study. No guarantee of any grade.",
  },
  {
    id: 'math',
    title: "Mathematics",
    line: "The basics, then calculus, with an explanation before the question.",
    href: '/foundations/concepts/',
    status: 'partial',
    note: "Eleven written chapters of the original 296 indexed episode, and nine topics in the 101. calculus.",
  },
  {
    id: 'physics',
    title: "Physics",
    line: "Measurement, motion, forces and energy.",
    href: '/semester-1/physics/',
    status: 'partial',
    note: "Eight topics with explanation and exercises. It has not yet been reviewed as deeply as the Essentials materials.",
  },
  {
    id: 'chemistry',
    title: "Chemistry",
    line: "Atoms, bonds, solutions, and equilibrium.",
    href: '/semester-1/chemistry/',
    status: 'partial',
    note: "Nine topics, and an interactive arena for atomic structure.",
  },
  {
    id: 'biology',
    title: "Biology",
    line: "Index of sources and study paths.",
    href: '/biology/',
    status: 'soon',
    note: "Indexing sources only. There are no original lessons written yet.",
  },
  {
    id: 'future',
    title: "The future",
    line: "Training, professional skills, projects, and portfolio.",
    href: '/bayt/portfolio/',
    status: 'partial',
    note: "Achievement file runs and saves what you accomplish. Training and project manuals have not yet been written.",
  },
];

/* المهارات. `learn` يشير إلى صفحة تعليمية موجودة على الموقع؛ البنّاء يفشل
   إذا لم تكن موجودة، حتى لا يصل الطالب إلى رابط مكسور. */
export const skills = [
  {
    id: 'SKILL-MATBAL',
    title: "material balance around the boundaries of a system",
    why: "The first real tool in chemical engineering: it draws boundaries, calculates what goes in and what goes out.",
    section: 'chemistry',
    learn: { href: '/program/lessons/material-balances/', label: "material balance lesson", minutes: 25 },
    evidence: "Calculating the concentration of the mixer outlet with explained steps.",
  },
  {
    id: 'SKILL-UNITS',
    title: "Units and mass fractions",
    why: "Most errors in engineering calculations are caused by a unit that was not standardized before addition, or a percentage that was multiplied without dividing it by a hundred.",
    section: 'math',
    /* كان هذا يشير إلى درس ترتيب العمليات، وهو لا يغطي الوحدات ولا الكسور
       الكتلية. كُتب درس أصلي يغطي المهارة فعلًا ويمهّد لموازنة المواد. */
    learn: { href: '/bayt/math/units-and-mass-fractions/', label: "Study mass units and fractions", minutes: 20 },
    evidence: "Convert units with a conversion factor, and calculate a mass fraction flow.",
  },
  {
    id: 'SKILL-PROCESS-WRITING',
    title: "Description of an industrial process in English",
    why: "A report that is not understood is not read. A description of the process is the first thing requested in any laboratory or training report.",
    section: 'english',
    learn: { href: '/bayt/english/process-description/', label: "Lesson describing the process", minutes: 20 },
    evidence: "An English paragraph describing a mixing process, with self-review.",
  },
  {
    id: 'SKILL-GEOMETRY-READ',
    title: "Read an engineering drawing without assumptions",
    why: "Model drawing not guide. Distinguishing what is stated from what is apparent prevents many mistakes later.",
    section: 'math',
    learn: { href: '/foundations/concepts/points-lines-and-planes/', label: "Points, lines and planes", minutes: 30 },
    evidence: "Determine what is permissible to be inferred from a drawing and what is not permissible.",
  },
];

/* الأهداف. كل هدف يجمع مهارات، وكل مهارة تولّد مهمة في جدول الطالب. */
export const goals = [
  {
    id: 'GOAL-CE201-REPORT',
    title: "Complete your first material balance report",
    audience: "Chemical engineering student, third semester",
    summary: "You learn to balance materials, calculate an example, and then describe the process in English as requested in the report.",
    course: 'CE201',
    skills: ['SKILL-UNITS', 'SKILL-MATBAL', 'SKILL-PROCESS-WRITING'],
    outcome: "One report that combines the calculation with its units and assumptions with the English description, saved and editable.",
    status: 'ready',
    report: { href: '/bayt/report/', label: "Open the report form" },
    weekPlan: [
      { skill: 'SKILL-UNITS', day: 0, minutes: 20, title: "Study mass units and fractions" },
      { skill: 'SKILL-MATBAL', day: 1, minutes: 25, title: "Study the lesson on material balance" },
      { skill: 'SKILL-MATBAL', day: 2, minutes: 15, title: "Calculate the mixer example yourself" },
      { skill: 'SKILL-PROCESS-WRITING', day: 3, minutes: 20, title: "Study the description of the process in English" },
      { skill: 'SKILL-PROCESS-WRITING', day: 4, minutes: 30, title: "Write the complete report and save it" },
    ],
  },
  {
    id: 'GOAL-IELTS-7',
    title: "Preparing for IELTS Academic with the goal of 7",
    audience: "A college student planning graduate studies",
    summary: "Long path. Only the academic writing section is available now within Bayt Al-Fuad.",
    course: null,
    skills: ['SKILL-PROCESS-WRITING'],
    outcome: "Self-corrected writing samples. The degree is not guaranteed by anyone.",
    status: 'partial',
    weekPlan: [
      { skill: 'SKILL-PROCESS-WRITING', day: 1, minutes: 20, title: "Study the description of the process in English" },
    ],
  },
  {
    id: 'GOAL-COOP',
    title: "Preparing for cooperative training",
    audience: "A student approaching his training year",
    summary: "Skills and professional profile. The evidence for this path has not yet been written.",
    course: 'CE490',
    skills: [],
    outcome: "An achievement file that can be viewed by the training entity.",
    status: 'soon',
    weekPlan: [],
  },
];

/* عادات أسبوعية افتراضية يقترحها التخطيط. الطالب يضيف أو يحذف. */
export const suggestedHabits = [
  { id: 'HABIT-SLEEP', title: "Regular sleep before midnight", area: "Health" },
  { id: 'HABIT-MOVE', title: "30 minutes of movement", area: "Health" },
  { id: 'HABIT-REVIEW', title: "20-minute review before bed", area: "Study" },
  { id: 'HABIT-CONTACT', title: "Communicate with parents", area: "Relationships" },
];

export const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const skillById = new Map(skills.map((s) => [s.id, s]));
export const goalById = new Map(goals.map((g) => [g.id, g]));
