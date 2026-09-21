/* الرحلة: تحويل هدف إلى مهام في الأسبوع. */
import { addWeekPlan, setGoal, load } from './state.mjs';
import { goalById, days } from '../data/journey.mjs';
import { countNoun, nouns } from './shared.mjs';

for (const button of document.querySelectorAll('[data-add-goal]')) {
  const goalId = button.getAttribute('data-add-goal');
  const goal = goalById.get(goalId);
  const note = document.querySelector(`[data-added-for="${goalId}"]`);
  if (!goal || !note) continue;

  button.addEventListener('click', () => {
    const added = addWeekPlan(goal.weekPlan, { demo: false });
    setGoal(goalId);
    note.textContent = added
      ? `أُضيفت ${countNoun(added, nouns.task)} إلى أسبوعك. افتح البلانر لترتيبها.`
      : 'مهام هذا الهدف موجودة في أسبوعك بالفعل.';
    note.classList.add('is-visible');
  });
}

/* لو كان الطالب قد اختار هدفًا سابقًا، نُظهر ذلك عند فتح الصفحة. */
const current = load().goal;
if (current) {
  const card = document.getElementById(current);
  if (card) {
    const note = card.querySelector('[data-added-for]');
    const count = load().tasks.filter((t) => goalById.get(current)?.weekPlan.some((p) => p.title === t.title)).length;
    if (note && count) {
      note.textContent = `هذا هدفك الحالي، و${countNoun(count, nouns.task)} من مهامه في أسبوعك.`;
      note.classList.add('is-visible');
    }
    card.classList.add('is-current');
  }
}

/* أول يوم فيه مهمة من الخطة، لمساعدة الطالب على البدء. */
export const firstDay = (goal) => (goal?.weekPlan.length ? days[goal.weekPlan[0].day] : null);
