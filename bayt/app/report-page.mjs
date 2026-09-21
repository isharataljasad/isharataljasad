/* تقرير موازنة المواد: حساب بوحداته وافتراضاته + وصف إنجليزي، في إنجاز واحد.

   التطبيق يفصل ثلاثة أشياء لا يجوز خلطها:
     إتمام المهمة  — سجّل الطالب عملًا. يقين.
     صحة الإجابة   — هل طابق حسابُه التحقق العددي لهذه المسألة وحدها؟
     إتقان المهارة — لا يُدّعى هنا إطلاقًا. */
import { addAchievement, updateAchievement, getAchievement } from './state.mjs';
import { el, countNoun, nouns } from './shared.mjs';

const form = document.querySelector('[data-report-form]');
if (form) {
  const field = (name) => form.querySelector(`[name="${name}"]`);
  const liveBox = document.querySelector('[data-live]');
  const checkBox = document.querySelector('[data-check-result]');
  const saveNote = document.querySelector('[data-save-note]');
  const heading = document.querySelector('[data-report-mode]');

  /* التعديل: ?edit=<id> يفتح إنجازًا محفوظًا في النموذج نفسه. */
  const editingId = new URLSearchParams(location.search).get('edit');
  const editing = editingId ? getAchievement(editingId) : null;

  const num = (name) => {
    const raw = String(field(name)?.value ?? '').trim();
    if (raw === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  };

  /* الحساب المرجعي. يُعرض للطالب بعد أن يُدخل إجابته، لا قبلها. */
  function reference() {
    const feedA = num('feedA'), fracA = num('fractionA');
    const feedB = num('feedB'), fracB = num('fractionB');
    if ([feedA, fracA, feedB, fracB].some((v) => v === null)) return null;
    if (feedA < 0 || feedB < 0 || feedA + feedB <= 0) return null;
    if (fracA < 0 || fracA > 1 || fracB < 0 || fracB > 1) return null;
    const total = feedA + feedB;
    const solute = feedA * fracA + feedB * fracB;
    return { total, solute, percent: (solute / total) * 100 };
  }

  function renderLive() {
    if (!liveBox) return;
    const ref = reference();
    liveBox.textContent = '';
    if (!ref) {
      liveBox.append(el('p', { class: 'section-note', text: 'أدخل التدفقين والكسرين ليظهر ملخص المدخلات. الكسر بين 0 و 1، لا نسبة مئوية.' }));
      return;
    }
    liveBox.append(
      el('p', { class: 'section-note', text: 'مدخلاتك كما فهمها التطبيق. الحساب عليك، لا عليه:' }),
      el('ul', { class: 'live-list' },
        el('li', { text: `الداخل الكلي = ${num('feedA')} + ${num('feedB')} kg/h` }),
        el('li', { text: `مذاب من التيار الأول = ${num('feedA')} × ${num('fractionA')} kg/h` }),
        el('li', { text: `مذاب من التيار الثاني = ${num('feedB')} × ${num('fractionB')} kg/h` })));
  }

  const near = (a, b, tol) => a !== null && Math.abs(a - b) <= tol;

  /* يقارن إجابة الطالب بالحساب المرجعي. النتيجة «صحة إجابة»، لا أكثر. */
  function checkAnswers() {
    const ref = reference();
    if (!ref) return { state: 'not-checked', lines: ['لم تكتمل المدخلات، فلا يمكن التحقق.'] };

    const parts = [
      ['التدفق الكلي الخارج', num('outTotal'), ref.total, 0.01, 'kg/h'],
      ['تدفق المذاب الخارج', num('outSolute'), ref.solute, 0.01, 'kg/h'],
      ['نسبة المذاب في المخرج', num('outPercent'), ref.percent, 0.05, '%'],
    ];
    const lines = [];
    let matched = 0, answered = 0;
    for (const [name, given, expected, tol, unit] of parts) {
      if (given === null) { lines.push(`${name}: لم تُدخل قيمة.`); continue; }
      answered++;
      if (near(given, expected, tol)) { matched++; lines.push(`${name}: يطابق (${expected.toFixed(2)} ${unit}).`); }
      else lines.push(`${name}: لديك ${given}، والحساب يعطي ${expected.toFixed(2)} ${unit}.`);
    }
    if (!answered) return { state: 'not-checked', lines: ['لم تُدخل أي نتيجة بعد.'] };
    return { state: matched === parts.length ? 'match' : 'mismatch', lines, matched, total: parts.length };
  }

  function renderCheck() {
    if (!checkBox) return;
    const result = checkAnswers();
    checkBox.textContent = '';
    checkBox.dataset.state = result.state;
    const title = result.state === 'match'
      ? 'نتائجك تطابق الحساب المرجعي لهذه المسألة.'
      : result.state === 'mismatch'
        ? `طابق ${result.matched} من ${result.total}. راجع ما لم يطابق.`
        : 'لا يمكن التحقق بعد.';
    checkBox.append(
      el('p', { class: 'check-title', text: title }),
      el('ul', {}, ...result.lines.map((line) => el('li', { text: line }))),
      el('p', { class: 'section-note', text: 'هذا تحقق من مسألة واحدة. مطابقة الأرقام ليست إتقانًا للمهارة.' }));
    return result;
  }

  /* نتيجة التحقق تخص القيم التي حُسبت عليها. إن تغيّرت أي قيمة بعدها صارت
     النتيجة قديمة، وتركها معروضة يجعل الطالب يقرأ «تطابق» على أرقام لم
     تُقارن. تُمسح وتُستبدل بدعوة لإعادة التحقق. */
  const inputFields = ['feedA', 'fractionA', 'feedB', 'fractionB'];
  const answerFields = ['outTotal', 'outSolute', 'outPercent'];
  let checkShown = false;

  function staleCheck() {
    if (!checkBox || !checkShown) return;
    checkShown = false;
    checkBox.textContent = '';
    checkBox.dataset.state = 'stale';
    checkBox.append(el('p', { class: 'check-title', text: 'تغيّرت القيم؛ أعد التحقق.' }));
  }

  for (const name of [...inputFields, ...answerFields]) {
    field(name)?.addEventListener('input', () => {
      if (inputFields.includes(name)) renderLive();
      staleCheck();
    });
  }

  document.querySelector('[data-check]')?.addEventListener('click', () => {
    renderCheck();
    checkShown = true;
  });

  /* ---- تعبئة النموذج عند التعديل ---- */
  if (editing?.report) {
    const r = editing.report;
    for (const [name, value] of Object.entries(r.inputs || {})) if (field(name)) field(name).value = value;
    for (const [name, value] of Object.entries(r.results || {})) if (field(name)) field(name).value = value;
    if (field('assumptions')) field('assumptions').value = (r.assumptions || []).join('\n');
    if (field('processDescription')) field('processDescription').value = r.description || '';
    if (heading) heading.textContent = 'تعديل تقرير محفوظ';
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.textContent = 'احفظ التعديل';
    renderLive();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const ref = reference();
    /* الاسم processDescription لا description، لأن الأخير يصطدم
       بـ <meta name="description"> لو بحث أحدهم في المستند كله. */
    const description = String(field('processDescription')?.value ?? '').trim();
    const assumptions = String(field('assumptions')?.value ?? '')
      .split('\n').map((s) => s.trim()).filter(Boolean);

    if (!ref) {
      if (saveNote) { saveNote.className = 'save-note warn'; saveNote.textContent = 'أكمل التدفقين والكسرين قبل الحفظ.'; }
      return;
    }
    if (!description) {
      if (saveNote) { saveNote.className = 'save-note warn'; saveNote.textContent = 'اكتب وصف العملية بالإنجليزية قبل الحفظ.'; }
      return;
    }

    const result = checkAnswers();
    const report = {
      kind: 'material-balance',
      units: { flow: 'kg/h', fraction: 'بلا وحدة (0–1)', percent: '%' },
      inputs: {
        feedA: num('feedA'), fractionA: num('fractionA'),
        feedB: num('feedB'), fractionB: num('fractionB'),
      },
      results: { outTotal: num('outTotal'), outSolute: num('outSolute'), outPercent: num('outPercent') },
      reference: { total: ref.total, solute: ref.solute, percent: ref.percent },
      assumptions,
      description,
    };
    const status = { completed: true, calculationChecked: result.state };

    if (editing) {
      updateAchievement(editing.id, { report, status });
      if (saveNote) { saveNote.className = 'save-note'; saveNote.textContent = 'حُدّث التقرير. افتح ملف الإنجاز لتراه.'; }
    } else {
      addAchievement({
        title: 'تقرير موازنة مواد: خلّاط بتيارين',
        kind: 'تقرير',
        skill: 'SKILL-MATBAL',
        goal: 'GOAL-CE201-REPORT',
        report, status, demo: false,
      });
      if (saveNote) {
        saveNote.className = 'save-note';
        saveNote.textContent = `حُفظ التقرير كاملًا: الحساب ووحداته و${countNoun(assumptions.length, nouns.assumption)} والوصف الإنجليزي.`;
      }
      form.reset();
      renderLive();
      if (checkBox) { checkBox.textContent = ''; delete checkBox.dataset.state; }
      checkShown = false;
    }
  });

  renderLive();
}
