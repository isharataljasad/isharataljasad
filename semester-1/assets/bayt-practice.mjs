/* تدريب بيت الفؤاد: تغذية راجعة تسمّي الخطأ بدل أن تقول «غير صحيح».

   الفرق الذي يصنعه هذا الملف: حين يكتب الطالب 7 في سؤال «القيمة مقابل
   النهاية» فهو لم يخطئ عشوائيًا، بل أجاب عن سؤال آخر. الرسالة العامة
   تتركه يعيد الغلط نفسه؛ الرسالة التي تسمّي سببه تنقله خطوة.

   التقدّم هنا منفصل عن حالة الموضوع القديمة عمدًا: إتمام تمرين ليس
   إتقانًا للمهارة، ولا يصحّ أن يرفع حالة الموضوع من تلقائه. */
import { parseAnswer } from './practice.mjs';
import { countNoun, nouns } from '/bayt/app/arabic-count.mjs';
import {readProgress,saveProgress} from './progress-store.mjs';

const unitText = (unit) => (unit && unit !== "Number" ? ` in ${unit}` : '');

export async function initBaytPractice() {
  const sections = [...document.querySelectorAll('[data-bayt-check]')];
  if (!sections.length) return;

  const key = document.body.dataset.topic;
  if (!key) return;

  let data;
  try {
    const response = await fetch(`/semester-1/assets/bayt/${key}.json`);
    if (!response.ok) throw new Error('unavailable');
    data = await response.json();
  } catch {
    for (const section of sections) {
      section.querySelector('.bayt-feedback').textContent =
        "Unable to load training data. The explanation and solutions written above are still available.";
    }
    return;
  }

  const byId = new Map(data.questions.map((q) => [q.id, q]));
  const state = readProgress();
  const record = (state.topics[key] && typeof state.topics[key] === 'object') ? state.topics[key] : {};
  state.topics[key] = record;
  /* سجلّ مستقل حتى لا يختلط بحقول الفحصين القديمين التي تقود حالة الموضوع. */
  const bayt = (record.bayt && typeof record.bayt === 'object') ? record.bayt : {};
  record.bayt = bayt;

  const summary = document.getElementById('bayt-summary');
  const update = () => {
    record.updatedAt = new Date().toISOString();
    const saved = saveProgress(state,'bayt',key);
    if (!summary) return;
    const solved = data.questions.filter((q) => bayt[q.id]?.correct).length;
    const revealed = data.questions.filter((q) => bayt[q.id]?.revealed).length;
    const total = data.questions.length;
    /* عبارات صريحة: العدد إنجاز تمارين، لا شهادة إتقان. */
    let line = `Correct answers: ${solved} of ${countNoun(total, nouns.pattern)}.`;
    if (revealed) line += ` You revealed the solution in ${revealed} questions before answering correctly.`;
    line += " This is a log of practice on this browser, not a proficiency assessment nor a degree.";
    if (!saved) line += " Unable to save progress in this browser.";
    summary.textContent = line;
  };

  for (const section of sections) {
    const id = section.dataset.baytCheck;
    const question = byId.get(id);
    if (!question) continue;

    const feedback = section.querySelector('.bayt-feedback');
    const solution = section.querySelector('.bayt-solution');
    const entry = (bayt[id] && typeof bayt[id] === 'object' && bayt[id].version===question.version) ? bayt[id] : {version:question.version};
    bayt[id] = entry;

    section.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      const raw = section.querySelector('input').value;
      const value = parseAnswer(raw);
      if (value === null) {
        feedback.textContent = `Just type a number${unitText(question.unit)}. Symbols and words are not read here.`;
        feedback.dataset.result = 'error';
        return;
      }

      entry.attempts = (entry.attempts || 0) + 1;

      if (Math.abs(value - question.answer) <= question.tolerance) {
        entry.correct = true;
        feedback.dataset.result = 'correct';
        feedback.textContent = "Correct. Explain why each step works before moving on; a correct answer alone does not establish understanding.";
        update();
        return;
      }

      /* الخطأ المعروف يُقابَل بتفسيره. السماحية هنا أضيق من سماحية الإجابة
         حتى لا يلتقط تفسيرٌ إجابةً ليست هي. */
      const known = question.commonErrors.find((e) => Math.abs(value - e.value) <= question.tolerance);
      feedback.dataset.result = 'retry';
      feedback.textContent = known
        ? `Not correct. This value may result from the following approach: ${known.why}`
        : "Not correct. This value does not match an anticipated wrong answer. "
          + "Review the steps of the solved example above one by one, and check the sign and exponents.";
      update();
    });

    section.querySelector('.bayt-reveal').addEventListener('click', () => {
      if (!entry.correct) entry.revealed = true;
      solution.textContent = `Answer: ${question.answer}. ${question.solution}`;
      solution.hidden = false;
      update();
    });

    if (entry.correct || entry.attempts) {
      feedback.dataset.result = entry.correct ? 'correct' : 'retry';
      feedback.textContent = entry.correct
        ? "You answered this question correctly in a previous session."
        : "Your previous attempt on this question still needs review.";
    }
  }

  update();
}
