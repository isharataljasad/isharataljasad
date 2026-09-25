/* مهمة الإنجليزية: عدّاد، نموذج إجابة بعد المحاولة، وحفظ في ملف الإنجاز. */
import { addAchievement } from './state.mjs';
import { lesson } from '../data/english-process-description.mjs';
import { countNoun, nouns } from './shared.mjs';

const form = document.querySelector('[data-english-task]');
const answer = document.querySelector('#answer');
const counter = document.querySelector('[data-counter]');
const note = document.querySelector('[data-save-note]');
const modelBox = document.querySelector('[data-model]');
const modelButton = document.querySelector('[data-show-model]');

/* عدّ الجمل تقريبي: نقطة أو علامة استفهام أو تعجب تُنهي جملة. الغرض تذكير
   الطالب بحدود المهمة، لا الحكم على لغته. */
const countSentences = (text) => text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;

function updateCounter() {
  if (!answer || !counter) return;
  const text = answer.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const sentences = countSentences(text);
  const inRange = sentences >= 3 && sentences <= 5;
  counter.textContent = text
    ? `${countNoun(words, nouns.word)} · about ${countNoun(sentences, nouns.sentence)}${inRange ? '' : " - Between three and five are required"}`
    : "Between three and five sentences are required.";
  counter.classList.toggle('warn', Boolean(text) && !inRange);
}

if (answer) {
  answer.addEventListener('input', updateCounter);
  updateCounter();
}

/* النموذج يظهر بطلب الطالب، بعد أن يكون قد كتب شيئًا أو اختار أن يراه. */
if (modelButton && modelBox) {
  modelButton.addEventListener('click', () => {
    const shown = !modelBox.hidden;
    modelBox.hidden = shown;
    modelButton.textContent = shown ? "Show sample answer" : "Hide sample answer";
    if (!shown) modelBox.scrollIntoView({ block: 'nearest' });
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = answer ? answer.value.trim() : '';
    if (!text) {
      if (note) { note.textContent = "Write your text first before saving."; note.classList.add('warn'); }
      return;
    }
    const checked = [...form.querySelectorAll('input[name="check"]:checked')].map((i) => i.value);
    const labels = lesson.task.checklist.filter((c) => checked.includes(c.id)).map((c) => c.text);

    addAchievement({
      title: lesson.outcome.title,
      kind: lesson.outcome.kind,
      skill: lesson.skill,
      goal: 'GOAL-CE201-REPORT',
      body: `${text}

- I checked myself: ${labels.length ? labels.join(' / ') : "I did not mark any item"} (${checked.length} of ${lesson.task.checklist.length})`,
      demo: false,
    });

    if (note) {
      note.classList.remove('warn');
      note.textContent = `Save to your achievement file with ${checked.length} of ${lesson.task.checklist.length} Review items. Open the achievement file to see it.`;
    }
  });
}
