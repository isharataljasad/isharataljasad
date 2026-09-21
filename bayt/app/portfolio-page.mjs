/* ملف الإنجاز: عرض ما حُفظ، إضافة يدوية، وتصدير. */
import { load, addAchievement, removeAchievement, exportJson } from './state.mjs';
import { skillById, goalById } from '../data/journey.mjs';
import { el, demoTag, wireShell, countNoun, nouns } from './shared.mjs';

const box = document.querySelector('[data-achievements]');
const summary = document.querySelector('[data-summary]');

const arabicDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
};

function render() {
  if (!box) return;
  box.textContent = '';
  const { achievements } = load();

  if (summary) {
    summary.textContent = achievements.length
      ? `${countNoun(achievements.length, nouns.achievement)} محفوظ على هذا الجهاز.`
      : 'لا إنجازات بعد. أنجز مهمة الإنجليزية، أو أضف إنجازًا يدويًا.';
  }
  if (!achievements.length) {
    box.append(el('p', { class: 'section-note', text: 'حين تكمل مهمة تحفظ نتيجتها، ستظهر هنا بتاريخها والمهارة التي تثبتها.' }));
    return;
  }

  for (const item of achievements) {
    const skill = item.skill ? skillById.get(item.skill) : null;
    const goal = item.goal ? goalById.get(item.goal) : null;

    const head = el('div', { class: 'ach-head' },
      el('h3', { text: item.title }),
      el('span', { class: 'ach-kind', text: item.kind }),
      item.demo ? demoTag() : null);

    const meta = el('p', { class: 'ach-meta' },
      el('span', { text: arabicDate(item.savedAt) }),
      skill ? el('span', { text: ` · يثبت: ${skill.title}` }) : null,
      goal ? el('span', { text: ` · ضمن: ${goal.title}` }) : null);

    /* التقرير المنظّم يُعرض بأقسامه، لا كنص واحد. */
    const body = item.report ? renderReport(item.report)
      : item.body ? el('pre', { class: 'ach-body', dir: 'auto', text: item.body }) : null;

    const status = renderStatus(item.status);
    const edit = item.report
      ? el('a', { class: 'link-button', href: `/bayt/report/?edit=${item.id}`, text: 'راجع أو عدّل' })
      : null;

    const remove = el('button', { type: 'button', class: 'icon-button', 'aria-label': `احذف: ${item.title}`, text: '×' });
    remove.addEventListener('click', () => { removeAchievement(item.id); render(); refreshDemoBar(); });

    const foot = (edit) ? el('p', { class: 'ach-foot' }, edit) : null;
    box.append(el('article', { class: 'ach' }, el('div', { class: 'ach-top' }, head, remove), meta, status, body, foot));
  }
}

/* الحالات الثلاث معروضة منفصلة، فلا يُقرأ «أنجزتُ» على أنه «أتقنتُ». */
function renderStatus(status) {
  if (!status) return null;
  const checked = status.calculationChecked;
  const answer = checked === 'match' ? ['نتائج الحساب طابقت التحقق', 'ok']
    : checked === 'mismatch' ? ['بعض النتائج لم تطابق', 'warn']
      : ['لم يُطلب تحقق حسابي', 'idle'];
  return el('ul', { class: 'status-row' },
    el('li', { class: 'st ok', text: 'أتممتَ المهمة وسجّلتها' }),
    el('li', { class: `st ${answer[1]}`, text: answer[0] }),
    el('li', { class: 'st idle', text: 'الإتقان لا يُقاس هنا' }));
}

function renderReport(report) {
  const wrap = el('div', { class: 'ach-report' });
  const i = report.inputs || {}, r = report.results || {}, ref = report.reference || {};
  const round = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : '—');

  wrap.append(
    el('h4', { text: 'المدخلات' }),
    el('ul', {},
      el('li', { text: `التيار الأول: ${i.feedA} ${report.units?.flow || ''} · كسر ${i.fractionA}` }),
      el('li', { text: `التيار الثاني: ${i.feedB} ${report.units?.flow || ''} · كسر ${i.fractionB}` })),
    el('h4', { text: 'نتائجك' }),
    el('ul', {},
      el('li', { text: `التدفق الكلي الخارج: ${r.outTotal ?? '—'} ${report.units?.flow || ''}` }),
      el('li', { text: `تدفق المذاب الخارج: ${r.outSolute ?? '—'} ${report.units?.flow || ''}` }),
      el('li', { text: `نسبة المذاب: ${r.outPercent ?? '—'} %` })),
    el('h4', { text: 'الحساب المرجعي' }),
    el('ul', {},
      el('li', { text: `${round(ref.total)} ${report.units?.flow || ''} · ${round(ref.solute)} ${report.units?.flow || ''} · ${round(ref.percent)} %` })));

  if (report.assumptions?.length) {
    wrap.append(el('h4', { text: 'الافتراضات' }),
      el('ul', {}, ...report.assumptions.map((a) => el('li', { text: a }))));
  }
  if (report.description) {
    wrap.append(el('h4', { text: 'وصف العملية' }),
      el('p', { class: 'en', dir: 'ltr', lang: 'en', text: report.description }));
  }
  return wrap;
}

let refreshDemoBar = () => {};

const form = document.querySelector('[data-achievement-form]');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    if (!title) return;
    addAchievement({ title, kind: String(data.get('kind') || '').trim() || 'عمل', demo: false });
    form.reset();
    render();
  });
}

/* التصدير يُنزّل ملفًا محليًا؛ لا يُرفع شيء. */
const exportButton = document.querySelector('[data-export]');
if (exportButton) {
  exportButton.addEventListener('click', () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = el('a', { href: url, download: 'bayt-alfuad-data.json' });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

refreshDemoBar = wireShell(render);
render();
