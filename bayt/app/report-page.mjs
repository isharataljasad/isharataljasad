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
      liveBox.append(el('p', { class: 'section-note', text: "Enter both streams and fractions to display a summary of the inputs. The fraction between 0 and 1, not a percentage." }));
      return;
    }
    liveBox.append(
      el('p', { class: 'section-note', text: "Your input as understood by the application. The account is on you, not on him:" }),
      el('ul', { class: 'live-list' },
        el('li', { text: `Overall interior = ${num('feedA')} + ${num('feedB')} kg/h` }),
        el('li', { text: `Solute from the first stream = ${num('feedA')} × ${num('fractionA')} kg/h` }),
        el('li', { text: `Solute from the second stream = ${num('feedB')} × ${num('fractionB')} kg/h` })));
  }

  const near = (a, b, tol) => a !== null && Math.abs(a - b) <= tol;

  /* يقارن إجابة الطالب بالحساب المرجعي. النتيجة «صحة إجابة»، لا أكثر. */
  function checkAnswers() {
    const ref = reference();
    if (!ref) return { state: 'not-checked', lines: ["Input is not complete, verification cannot be done."] };

    const parts = [
      ["Total outflow", num('outTotal'), ref.total, 0.01, 'kg/h'],
      ["Outflow of solute", num('outSolute'), ref.solute, 0.01, 'kg/h'],
      ["Percentage of solute in the outlet", num('outPercent'), ref.percent, 0.05, '%'],
    ];
    const lines = [];
    let matched = 0, answered = 0;
    for (const [name, given, expected, tol, unit] of parts) {
      if (given === null) { lines.push(`${name}: You did not enter a value.`); continue; }
      answered++;
      if (near(given, expected, tol)) { matched++; lines.push(`${name}: matches (${expected.toFixed(2)} ${unit}).`); }
      else lines.push(`${name}: You have ${given}And the account gives ${expected.toFixed(2)} ${unit}.`);
    }
    if (!answered) return { state: 'not-checked', lines: ["No results have been entered yet."] };
    return { state: matched === parts.length ? 'match' : 'mismatch', lines, matched, total: parts.length };
  }

  function renderCheck() {
    if (!checkBox) return;
    const result = checkAnswers();
    checkBox.textContent = '';
    checkBox.dataset.state = result.state;
    const title = result.state === 'match'
      ? "Your results match the reference calculation for this problem."
      : result.state === 'mismatch'
        ? `Match ${result.matched} of ${result.total}. Review what doesn't match.`
        : "Can't verify yet.";
    checkBox.append(
      el('p', { class: 'check-title', text: title }),
      el('ul', {}, ...result.lines.map((line) => el('li', { text: line }))),
      el('p', { class: 'section-note', text: "This is a check of one issue. Matching numbers is not mastering a skill." }));
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
    checkBox.append(el('p', { class: 'check-title', text: "Values have changed; Recheck." }));
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
    if (heading) heading.textContent = "Modify a saved report";
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.textContent = "Save the modification";
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
      if (saveNote) { saveNote.className = 'save-note warn'; saveNote.textContent = "Complete the two flows and two fractions before saving."; }
      return;
    }
    if (!description) {
      if (saveNote) { saveNote.className = 'save-note warn'; saveNote.textContent = "Write the process description in English before saving."; }
      return;
    }

    const result = checkAnswers();
    const report = {
      kind: 'material-balance',
      units: { flow: 'kg/h', fraction: "No unit (0–1)", percent: '%' },
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
      if (saveNote) { saveNote.className = 'save-note'; saveNote.textContent = "The report has been updated. Open the achievement file to see it."; }
    } else {
      addAchievement({
        title: "Material balance report: a two-stream mixer",
        kind: "Report",
        skill: 'SKILL-MATBAL',
        goal: 'GOAL-CE201-REPORT',
        report, status, demo: false,
      });
      if (saveNote) {
        saveNote.className = 'save-note';
        saveNote.textContent = `Save the complete report: the account, its units, and${countNoun(assumptions.length, nouns.assumption)} And the English description.`;
      }
      form.reset();
      renderLive();
      if (checkBox) { checkBox.textContent = ''; delete checkBox.dataset.state; }
      checkShown = false;
    }
  });

  renderLive();
}
