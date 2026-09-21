/* التخطيط: أسابيع مؤرخة، مهام وعادات لكل أسبوع على حدة. */
import {
  load, addTask, toggleTask, removeTask, pushTaskToNextWeek,
  addHabit, toggleHabitDay, removeHabit, habitDays,
  weekKey, shiftWeek, weekLabel, dayLabel, relativeWeek, isCurrentWeek, tasksForWeek, weeksWithTasks,
} from './state.mjs';
import { days, skillById } from '../data/journey.mjs';
import { el, demoTag, wireShell, countNoun, nouns } from './shared.mjs';

const summary = document.querySelector('[data-summary]');
const habitList = document.querySelector('[data-habit-list]');
const label = document.querySelector('[data-week-label]');
const relative = document.querySelector('[data-week-relative]');
const todayButton = document.querySelector('[data-week-today]');

/* الأسبوع المعروض. يبدأ من الأسبوع الحالي، ويمكن تثبيته في العنوان
   حتى يبقى الأسبوع نفسه بعد إعادة تحميل الصفحة. */
let week = new URLSearchParams(location.search).get('week') || weekKey();
if (!/^\d{4}-\d{2}-\d{2}$/.test(week)) week = weekKey();

function setWeek(next) {
  week = next;
  const url = new URL(location.href);
  if (isCurrentWeek(week)) url.searchParams.delete('week');
  else url.searchParams.set('week', week);
  history.replaceState(null, '', url);
  render();
}

function renderWeekBar() {
  if (label) label.textContent = weekLabel(week);
  if (relative) {
    relative.textContent = relativeWeek(week);
    relative.classList.toggle('is-now', isCurrentWeek(week));
  }
  if (todayButton) todayButton.hidden = isCurrentWeek(week);

  /* الأسابيع التي فيها مهام، ليعرف الطالب أين يوجد عمل. */
  const marker = document.querySelector('[data-week-others]');
  if (marker) {
    /* «أسبوع واحد أخرى» غير سليم، فالوصف يُصاغ مع كل حالة على حدة. */
    const n = weeksWithTasks().filter((w) => w !== week).length;
    marker.textContent = !n ? ''
      : n === 1 ? 'لديك مهام في أسبوع آخر.'
        : n === 2 ? 'لديك مهام في أسبوعين آخرين.'
          : n <= 10 ? `لديك مهام في ${n} أسابيع أخرى.`
            : `لديك مهام في ${n} أسبوعًا آخر.`;
  }
}

function renderTasks() {
  const tasks = tasksForWeek(week);
  for (let day = 0; day < days.length; day++) {
    const list = document.querySelector(`[data-day-list="${day}"]`);
    const head = document.querySelector(`[data-day-date="${day}"]`);
    if (head) head.textContent = dayLabel(week, day);
    if (!list) continue;
    list.textContent = '';

    const forDay = tasks.filter((t) => t.day === day);
    if (!forDay.length) {
      list.append(el('li', { class: 'empty-day', text: 'لا مهام' }));
      continue;
    }
    for (const task of forDay) {
      const box = el('input', { type: 'checkbox', id: task.id });
      box.checked = task.done;
      box.addEventListener('change', () => { toggleTask(task.id); render(); });

      const remove = el('button', { type: 'button', class: 'icon-button', 'aria-label': `احذف: ${task.title}`, text: '×' });
      remove.addEventListener('click', () => { removeTask(task.id); render(); });

      const skill = task.skill ? skillById.get(task.skill) : null;
      const foot = el('div', { class: 'task-foot' },
        el('span', { class: 'task-meta', text: task.minutes ? `${task.minutes} دقيقة` : '' }),
        skill ? el('a', { href: skill.learn.href, class: 'task-link', text: 'افتح الدرس ←' }) : null,
        task.demo ? demoTag() : null);

      /* تأجيل مهمة لم تُنجز أفضل من حذفها أو تركها في ماضٍ لا يُقرأ. */
      if (!task.done) {
        const push = el('button', { type: 'button', class: 'link-button', text: 'أجّل للأسبوع القادم' });
        push.addEventListener('click', () => { pushTaskToNextWeek(task.id); render(); });
        foot.append(push);
      }

      list.append(el('li', { class: task.done ? 'task done' : 'task' },
        el('div', { class: 'task-row' }, box, el('label', { for: task.id, class: 'task-title', text: task.title }), remove),
        foot));
    }
  }

  const done = tasks.filter((t) => t.done).length;
  const minutes = tasks.filter((t) => !t.done).reduce((n, t) => n + (t.minutes || 0), 0);
  if (summary) {
    if (!tasks.length) {
      summary.textContent = isCurrentWeek(week)
        ? 'لا مهام هذا الأسبوع. أضف مهمة، أو ابدأ من هدف في صفحة رحلتي.'
        : 'لا مهام في هذا الأسبوع.';
    } else if (done === tasks.length) {
      summary.textContent = `أكملتَ ${countNoun(tasks.length, nouns.task)}. لم يتبقَّ شيء في هذا الأسبوع.`;
    } else {
      summary.textContent = `أكملتَ ${done} من ${countNoun(tasks.length, nouns.task)}. المتبقي نحو ${countNoun(minutes, nouns.minute)}.`;
    }
  }
}

function renderHabits() {
  if (!habitList) return;
  habitList.textContent = '';
  const { habits } = load();
  if (!habits.length) {
    habitList.append(el('p', { class: 'section-note', text: 'لا عادات بعد.' }));
    return;
  }
  for (const habit of habits) {
    const marked = habitDays(habit, week);
    const head = el('div', { class: 'habit-head' },
      el('strong', { text: habit.title }),
      habit.area ? el('span', { class: 'habit-area', text: habit.area }) : null,
      el('span', { class: 'habit-count', text: `${marked.length} / 7` }),
      habit.demo ? demoTag() : null);

    const boxes = el('div', { class: 'habit-days' });
    days.forEach((name, index) => {
      const on = marked.includes(index);
      const button = el('button', {
        type: 'button', class: on ? 'habit-day on' : 'habit-day',
        'aria-pressed': on ? 'true' : 'false',
        'aria-label': `${habit.title} — ${name} ${dayLabel(week, index)}`,
        text: name.slice(0, 3),
      });
      button.addEventListener('click', () => { toggleHabitDay(habit.id, week, index); render(); });
      boxes.append(button);
    });

    const remove = el('button', { type: 'button', class: 'icon-button', 'aria-label': `احذف العادة: ${habit.title}`, text: '×' });
    remove.addEventListener('click', () => { removeHabit(habit.id); render(); });

    habitList.append(el('div', { class: 'habit' }, el('div', { class: 'habit-top' }, head, remove), boxes));
  }
}

let refreshDemoBar = () => {};
function render() { renderWeekBar(); renderTasks(); renderHabits(); refreshDemoBar(); }

/* ---- التنقل ---- */
for (const [selector, delta] of [['[data-week-prev]', -1], ['[data-week-next]', 1]]) {
  const button = document.querySelector(selector);
  if (button) button.addEventListener('click', () => setWeek(shiftWeek(week, delta)));
}
if (todayButton) todayButton.addEventListener('click', () => setWeek(weekKey()));

/* ---- النماذج ---- */
const taskForm = document.querySelector('[data-task-form]');
if (taskForm) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(taskForm);
    const title = String(data.get('title') || '').trim();
    if (!title) return;
    addTask({ title, day: data.get('day'), minutes: data.get('minutes'), week, demo: false });
    taskForm.reset();
    render();
  });
}

const habitForm = document.querySelector('[data-habit-form]');
if (habitForm) {
  habitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(habitForm);
    const title = String(data.get('title') || '').trim();
    if (!title) return;
    addHabit({ title, area: String(data.get('area') || '').trim(), demo: false });
    habitForm.reset();
    render();
  });
}

refreshDemoBar = wireShell(render);
render();
