/* ==========================================================================
   bayt/app/state.mjs — حالة الطالب.

   كل ما يحفظه الطالب يبقى على جهازه في مفتاح واحد. لا يُرسل شيء إلى خادم،
   ولا يُقرأ أي مفتاح يخص الأقسام الدراسية القديمة.

   الإصدار 2: لكل مهمة أسبوعٌ مؤرخ، لا رقم يوم مجرّد. الأسبوع يُعرّف بتاريخ
   السبت الذي يبدأ به. تتبّع العادات صار لكل أسبوع أيضًا، فسجلّ أسبوع ماضٍ
   لا يُمحى حين يبدأ أسبوع جديد.

   كل عنصر يحمل `demo: true` أو `false`. البيانات التجريبية تُعرض بعلامة
   ظاهرة ويمكن مسحها وحدها.
   ========================================================================== */

const KEY = 'bayt-alfuad:v1';
const VERSION = 2;

const empty = () => ({ version: VERSION, goal: null, tasks: [], habits: [], achievements: [], updatedAt: null });

let memory = null;
let storageWorks = true;

export function storageAvailable() {
  return storageWorks;
}

/* ---- الأسابيع ----
   الأسبوع الدراسي في السعودية يبدأ السبت. مفتاح الأسبوع هو تاريخ ذلك السبت
   بصيغة YYYY-MM-DD، محسوبًا بالتوقيت المحلي لا بـ UTC حتى لا ينزلق اليوم. */

const iso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function weekKey(input = new Date()) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  /* getDay: الأحد 0 … السبت 6. نرجع إلى السبت السابق أو اليوم نفسه. */
  date.setDate(date.getDate() - ((date.getDay() + 1) % 7));
  return iso(date);
}

export function shiftWeek(key, weeks) {
  const date = new Date(`${key}T00:00:00`);
  date.setDate(date.getDate() + weeks * 7);
  return iso(date);
}

export function weekDates(key) {
  const start = new Date(`${key}T00:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

const formatter = (options) => {
  try { return new Intl.DateTimeFormat('ar', options); } catch { return null; }
};

export function weekLabel(key) {
  const dates = weekDates(key);
  const fmt = formatter({ day: 'numeric', month: 'long' });
  if (!fmt) return `A week ${key}`;
  return `${fmt.format(dates[0])} – ${fmt.format(dates[6])}`;
}

export function dayLabel(key, index) {
  const fmt = formatter({ day: 'numeric', month: 'numeric' });
  return fmt ? fmt.format(weekDates(key)[index]) : '';
}

export const isCurrentWeek = (key) => key === weekKey();

export function relativeWeek(key) {
  const diff = Math.round((new Date(`${key}T00:00:00`) - new Date(`${weekKey()}T00:00:00`)) / 604800000);
  if (diff === 0) return "This week";
  if (diff === 1) return "Next week";
  if (diff === -1) return "Last week";
  return diff > 0 ? `After ${diff} Weeks` : `Before ${Math.abs(diff)} Weeks`;
}

/* ---- التحميل والترحيل ---- */
export function load() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { memory = empty(); return memory; }
    const parsed = JSON.parse(raw);
    memory = migrate(parsed);
    /* يُثبَّت الترحيل فورًا، فلا يبقى في التخزين شكلٌ قديم يخالف ما يقرأه
       الكود. تُكتب مرة واحدة فقط، عند أول فتح بعد الترقية. */
    if (parsed?.version !== VERSION) save();
  } catch {
    storageWorks = false;
    memory = empty();
  }
  return memory;
}

/* الترحيل لا يحذف شيئًا. بيانات الإصدار 1 لا أسبوع لها، فتُنسب إلى الأسبوع
   الحالي، وسجلّ العادات القديم يصير سجلَّ هذا الأسبوع. */
function migrate(saved) {
  if (!saved || typeof saved !== 'object') return empty();
  const base = empty();
  const current = weekKey();

  base.goal = typeof saved.goal === 'string' ? saved.goal : null;
  base.updatedAt = typeof saved.updatedAt === 'string' ? saved.updatedAt : null;

  base.tasks = (Array.isArray(saved.tasks) ? saved.tasks : [])
    .filter((t) => t && typeof t === 'object')
    .map((t) => ({ ...t, week: typeof t.week === 'string' ? t.week : current, day: Number(t.day) || 0 }));

  base.habits = (Array.isArray(saved.habits) ? saved.habits : [])
    .filter((h) => h && typeof h === 'object')
    .map((h) => {
      if (h.log && typeof h.log === 'object') return { ...h, log: h.log };
      const legacy = Array.isArray(h.days) ? h.days : [];
      const { days, ...rest } = h;
      return { ...rest, log: legacy.length ? { [current]: legacy } : {} };
    });

  base.achievements = (Array.isArray(saved.achievements) ? saved.achievements : [])
    .filter((a) => a && typeof a === 'object');

  return base;
}

export function save() {
  const state = load();
  state.version = VERSION;
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageWorks = false;
  }
  return state;
}

const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* ---- الهدف ---- */
export function setGoal(goalId) {
  load().goal = goalId;
  return save();
}

/* ---- المهام ---- */
export function tasksForWeek(week) {
  return load().tasks.filter((t) => t.week === week);
}

export function weeksWithTasks() {
  return [...new Set(load().tasks.map((t) => t.week))].sort();
}

export function addTask({ title, day, minutes, skill, href, week, demo = false }) {
  const state = load();
  state.tasks.push({
    id: id('task'), title, week: week || weekKey(), day: Number(day) || 0,
    minutes: Number(minutes) || 0, skill: skill || null, href: href || null,
    done: false, demo: Boolean(demo),
  });
  return save();
}

/* خطة الهدف تُضاف إلى أسبوع بعينه، ولا تتكرر داخله. */
export function addWeekPlan(plan, { week = weekKey(), demo = false } = {}) {
  const state = load();
  let added = 0;
  for (const item of plan) {
    const exists = state.tasks.some(
      (t) => t.week === week && t.skill === item.skill && t.day === item.day && t.title === item.title
    );
    if (exists) continue;
    addTask({ ...item, week, demo });
    added++;
  }
  save();
  return added;
}

export function toggleTask(taskId) {
  const task = load().tasks.find((t) => t.id === taskId);
  if (task) task.done = !task.done;
  return save();
}

export function removeTask(taskId) {
  const state = load();
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  return save();
}

/* نقل مهمة غير منجزة إلى الأسبوع التالي بدل حذفها. */
export function pushTaskToNextWeek(taskId) {
  const task = load().tasks.find((t) => t.id === taskId);
  if (task) task.week = shiftWeek(task.week, 1);
  return save();
}

/* ---- العادات ---- */
export function addHabit({ title, area, demo = false }) {
  const state = load();
  if (state.habits.some((h) => h.title === title)) return state;
  state.habits.push({ id: id('habit'), title, area: area || '', log: {}, demo: Boolean(demo) });
  return save();
}

export function habitDays(habit, week) {
  return Array.isArray(habit.log?.[week]) ? habit.log[week] : [];
}

export function toggleHabitDay(habitId, week, day) {
  const habit = load().habits.find((h) => h.id === habitId);
  if (!habit) return load();
  if (!habit.log || typeof habit.log !== 'object') habit.log = {};
  const list = Array.isArray(habit.log[week]) ? habit.log[week] : [];
  const index = list.indexOf(day);
  if (index === -1) list.push(day); else list.splice(index, 1);
  if (list.length) habit.log[week] = list; else delete habit.log[week];
  return save();
}

export function removeHabit(habitId) {
  const state = load();
  state.habits = state.habits.filter((h) => h.id !== habitId);
  return save();
}

/* ---- ملف الإنجاز ----
   الإنجاز قد يحمل `report`: عمل منظّم قابل للمراجعة والتعديل، لا نصًا واحدًا.
   `status` يفصل ثلاثة معانٍ لا يجوز خلطها:
     completed          — سجّل الطالب عملًا. هذا كل ما يعرفه التطبيق يقينًا.
     calculationChecked — هل طابق حسابه التحقق العددي؟ صحة إجابة واحدة.
     mastery            — لا يُسجَّل أبدًا. الإتقان يحتاج تكرارًا وزمنًا وحكمًا بشريًا. */
export function addAchievement({ title, kind, body, skill, goal, report, status, demo = false }) {
  const state = load();
  const record = {
    id: id('ach'), title, kind: kind || "Work", body: body || '',
    skill: skill || null, goal: goal || null,
    report: report || null,
    status: { completed: true, calculationChecked: 'not-checked', ...(status || {}) },
    savedAt: new Date().toISOString(), updatedAt: null, demo: Boolean(demo),
  };
  state.achievements.unshift(record);
  save();
  return record;
}

export function updateAchievement(achievementId, patch) {
  const record = load().achievements.find((a) => a.id === achievementId);
  if (!record) return null;
  Object.assign(record, patch, { updatedAt: new Date().toISOString() });
  save();
  return record;
}

export function getAchievement(achievementId) {
  return load().achievements.find((a) => a.id === achievementId) || null;
}

export function removeAchievement(achievementId) {
  const state = load();
  state.achievements = state.achievements.filter((a) => a.id !== achievementId);
  return save();
}

/* ---- البيانات التجريبية ---- */
export function hasDemo() {
  const state = load();
  return [...state.tasks, ...state.habits, ...state.achievements].some((x) => x.demo);
}

export function clearDemo() {
  const state = load();
  for (const key of ['tasks', 'habits', 'achievements']) state[key] = state[key].filter((x) => !x.demo);
  return save();
}

export function clearAll() {
  memory = empty();
  try { localStorage.removeItem(KEY); } catch { /* التخزين محجوب أصلًا */ }
  return memory;
}

export function exportJson() {
  return JSON.stringify(load(), null, 2);
}
