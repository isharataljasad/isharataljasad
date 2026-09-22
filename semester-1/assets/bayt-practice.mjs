/* تدريب بيت الفؤاد: تغذية راجعة تسمّي الخطأ بدل أن تقول «غير صحيح».

   الفرق الذي يصنعه هذا الملف: حين يكتب الطالب 7 في سؤال «القيمة مقابل
   النهاية» فهو لم يخطئ عشوائيًا، بل أجاب عن سؤال آخر. الرسالة العامة
   تتركه يعيد الغلط نفسه؛ الرسالة التي تسمّي سببه تنقله خطوة.

   التقدّم هنا منفصل عن حالة الموضوع القديمة عمدًا: إتمام تمرين ليس
   إتقانًا للمهارة، ولا يصحّ أن يرفع حالة الموضوع من تلقائه. */
import { parseAnswer } from './practice.mjs';
import { countNoun, nouns } from '/bayt/app/arabic-count.mjs';

const storageKey = 'yic-bsce:published-2023:semester-1:v1';

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if (raw && typeof raw.topics === 'object' && raw.topics !== null) return raw;
  } catch { /* متصفّح يمنع التخزين، أو بيانات تالفة */ }
  return { topics: {} };
}

/* الحفظ قد يفشل بلا استثناء مفيد؛ النداء يخبرنا لنصدق مع الطالب. */
function persist(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

const unitText = (unit) => (unit && unit !== 'عدد' ? ` بوحدة ${unit}` : '');

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
        'تعذّر تحميل بيانات التدريب. الشرح والحلول المكتوبة أعلاه ما زالت متاحة.';
    }
    return;
  }

  const byId = new Map(data.questions.map((q) => [q.id, q]));
  const state = loadState();
  const record = (state.topics[key] && typeof state.topics[key] === 'object') ? state.topics[key] : {};
  state.topics[key] = record;
  /* سجلّ مستقل حتى لا يختلط بحقول الفحصين القديمين التي تقود حالة الموضوع. */
  const bayt = (record.bayt && typeof record.bayt === 'object') ? record.bayt : {};
  record.bayt = bayt;

  const summary = document.getElementById('bayt-summary');
  const update = () => {
    record.updatedAt = new Date().toISOString();
    const saved = persist(state);
    if (!summary) return;
    const solved = data.questions.filter((q) => bayt[q.id]?.correct).length;
    const revealed = data.questions.filter((q) => bayt[q.id]?.revealed).length;
    const total = data.questions.length;
    /* عبارات صريحة: العدد إنجاز تمارين، لا شهادة إتقان. */
    let line = `أجبتَ إجابة صحيحة عن ${solved} من ${countNoun(total, nouns.pattern)}.`;
    if (revealed) line += ` كشفتَ الحل في ${revealed} منها قبل الوصول إليه.`;
    line += ' هذا سجلّ تمرين على هذا المتصفح، وليس تقييمًا للإتقان ولا درجة جامعية.';
    if (!saved) line += ' تعذّر حفظ التقدّم في هذا المتصفح.';
    summary.textContent = line;
  };

  for (const section of sections) {
    const id = section.dataset.baytCheck;
    const question = byId.get(id);
    if (!question) continue;

    const feedback = section.querySelector('.bayt-feedback');
    const solution = section.querySelector('.bayt-solution');
    const entry = (bayt[id] && typeof bayt[id] === 'object') ? bayt[id] : {};
    bayt[id] = entry;

    section.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      const raw = section.querySelector('input').value;
      const value = parseAnswer(raw);
      if (value === null) {
        feedback.textContent = `اكتب عددًا فقط${unitText(question.unit)}. الرموز والكلمات لا تُقرأ هنا.`;
        feedback.dataset.result = 'error';
        return;
      }

      entry.attempts = (entry.attempts || 0) + 1;

      if (Math.abs(value - question.answer) <= question.tolerance) {
        entry.correct = true;
        feedback.dataset.result = 'correct';
        feedback.textContent = 'صحيح. اشرح لنفسك سبب كل خطوة قبل أن تنتقل؛ الإجابة وحدها لا تثبت الفهم.';
        update();
        return;
      }

      /* الخطأ المعروف يُقابَل بتفسيره. السماحية هنا أضيق من سماحية الإجابة
         حتى لا يلتقط تفسيرٌ إجابةً ليست هي. */
      const known = question.commonErrors.find((e) => Math.abs(value - e.value) <= question.tolerance);
      feedback.dataset.result = 'retry';
      feedback.textContent = known
        ? `ليست صحيحة، والسبب معروف: ${known.why}`
        : 'ليست صحيحة، وليست من الأخطاء التي نعرف سببها. '
          + 'راجع خطوات المثال المحلول أعلاه واحدة واحدة، وتحقق من الإشارات والأُسس.';
      update();
    });

    section.querySelector('.bayt-reveal').addEventListener('click', () => {
      if (!entry.correct) entry.revealed = true;
      solution.textContent = `الإجابة: ${question.answer}. ${question.solution}`;
      solution.hidden = false;
      update();
    });

    if (entry.correct || entry.attempts) {
      feedback.dataset.result = entry.correct ? 'correct' : 'retry';
      feedback.textContent = entry.correct
        ? 'أجبتَ عن هذا النمط إجابة صحيحة في جلسة سابقة.'
        : 'لديك محاولة سابقة على هذا النمط لم تصل بعد.';
    }
  }

  update();
}
