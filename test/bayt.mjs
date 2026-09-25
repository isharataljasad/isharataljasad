/* قسم «بيت الفؤاد»: سلامة البيانات، ووجود صفحات التعلّم المرتبطة،
   وصحة العدد مع المعدود بالعربية، والتزام سياسة الأمان. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { sections, skills, goals, statuses, skillById, days } from '../bayt/data/journey.mjs';
import { lesson } from '../bayt/data/english-process-description.mjs';
import { countNoun, nouns } from '../bayt/app/shared.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (href) => {
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  return fs.existsSync(path.join(root, clean, 'index.html')) || fs.existsSync(path.join(root, `${clean}.html`));
};

/* ---- الأقسام السبعة ---- */
assert.equal(sections.length, 7, 'الأقسام سبعة');
assert.deepEqual(sections.map((s) => s.id),
  ['planner', 'english', 'math', 'physics', 'chemistry', 'biology', 'future']);
for (const section of sections) {
  assert.ok(statuses[section.status], `${section.id}: حالة غير معروفة`);
  assert.ok(section.note && section.note.length > 20, `${section.id}: لا بد من وصف صريح للحالة`);
  assert.ok(exists(section.href), `${section.id}: يشير إلى صفحة غير موجودة ${section.href}`);
}

/* كل مهارة لها درس موجود فعلًا. رابط مكسور هنا يعني طالبًا أمام صفحة 404. */
for (const skill of skills) {
  assert.ok(exists(skill.learn.href), `${skill.id}: درس غير موجود ${skill.learn.href}`);
  assert.ok(skill.learn.minutes > 0 && skill.learn.minutes <= 120, `${skill.id}: مدة غير معقولة`);
  assert.ok(sections.some((s) => s.id === skill.section), `${skill.id}: قسم غير معروف`);
}

/* ---- الأهداف والخطط ---- */
for (const goal of goals) {
  for (const id of goal.skills) assert.ok(skillById.has(id), `${goal.id}: مهارة غير معروفة ${id}`);
  for (const item of goal.weekPlan) {
    assert.ok(skillById.has(item.skill), `${goal.id}: خطة تشير إلى مهارة غير معروفة`);
    assert.ok(item.day >= 0 && item.day < days.length, `${goal.id}: يوم خارج الأسبوع`);
    assert.ok(item.minutes > 0, `${goal.id}: مهمة بلا مدة`);
  }
  /* هدف يوصف بأنه متاح يجب أن تكون له خطة فعلية. */
  if (goal.status === 'ready') assert.ok(goal.weekPlan.length >= 3, `${goal.id}: موصوف بأنه متاح بلا خطة كافية`);
  if (goal.status === 'soon') assert.equal(goal.weekPlan.length, 0, `${goal.id}: قيد التطوير ومعه خطة`);
}

const flagship = goals.find((g) => g.id === 'GOAL-CE201-REPORT');
assert.ok(flagship, 'التجربة الكاملة موجودة');
assert.equal(flagship.status, 'ready');
/* التجربة تمر بثلاثة أقسام: رياضيات ثم كيمياء/هندسة ثم إنجليزية. */
const areas = new Set(flagship.skills.map((id) => skillById.get(id).section));
assert.ok(areas.has('english') && areas.size >= 3, 'التجربة الكاملة تربط ثلاثة أقسام على الأقل');

/* ---- العدد مع المعدود ---- */
assert.equal(countNoun(1, nouns.task), '1 task');
assert.equal(countNoun(2, nouns.task), '2 tasks');
assert.equal(countNoun(5, nouns.task), '5 tasks');
assert.equal(countNoun(11, nouns.task), '11 tasks');
assert.equal(countNoun(3, nouns.sentence), '3 sentences');
assert.equal(countNoun(1, nouns.achievement), '1 achievement');

/* ---- درس الإنجليزية ---- */
assert.ok(exists(lesson.prerequisite.href), 'درس الإنجليزية يشير إلى متطلب موجود');
assert.equal(lesson.skill, 'SKILL-PROCESS-WRITING');
assert.ok(lesson.sections.length >= 4, 'الدرس فيه شرح قبل المهمة');
assert.ok(lesson.task.checklist.length >= 5, 'قائمة مراجعة ذاتية كافية');
assert.ok(lesson.task.model.text.length > 120, 'نموذج إجابة حقيقي');

/* الشرح قبل السؤال: المهمة تأتي بعد كل أقسام الشرح في الصفحة المبنية. */
const lessonPage = read('bayt/english/process-description/index.html');
assert.ok(lessonPage.indexOf('id="task"') > lessonPage.lastIndexOf('lesson-section">'), 'المهمة بعد الشرح');
assert.ok(/does not correct your language/i.test(lessonPage), 'الصفحة تذكر أن التطبيق لا يصحح اللغة');

/* ---- صدق الادعاءات ---- */
const home = read('bayt/index.html');
for (const phrase of ['does not guarantee', 'on your device']) {
  assert.ok(home.includes(phrase), `الصفحة الرئيسة يجب أن تذكر: ${phrase}`);
}
const english = read('bayt/english/index.html');
assert.ok(/A goal, not a promise|does not guarantee/i.test(english), 'قسم الإنجليزية لا يعد بدرجة');
/* لا إيحاء بشراكة مع ناشر. */
for (const page of ['bayt/index.html', 'bayt/english/index.html', 'bayt/english/process-description/index.html']) {
  assert.equal(/in partnership with|official partner|accredited by/i.test(read(page)), false, `${page}: إيحاء بشراكة`);
}

/* ---- سياسة الأمان: لا نص برمجي ولا نمط داخل الصفحة ---- */
const pages = ['bayt/index.html', 'bayt/journey/index.html', 'bayt/planner/index.html',
  'bayt/english/index.html', 'bayt/english/process-description/index.html',
  'bayt/math/units-and-mass-fractions/index.html', 'bayt/report/index.html', 'bayt/portfolio/index.html'];
for (const page of pages) {
  const html = read(page);
  assert.equal(/<script(?![^>]*\ssrc=)/.test(html), false, `${page}: نص برمجي داخل الصفحة`);
  assert.equal(/<style[ >]/.test(html), false, `${page}: نمط داخل الصفحة`);
  assert.equal(/\son[a-z]+\s*=\s*"/i.test(html), false, `${page}: معالج حدث داخل الوسم`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${page}: عنوان رئيس واحد`);
  assert.match(html, /<html lang="en" dir="ltr">/, `${page}: اتجاه الصفحة`);
  assert.ok(html.includes('bayt.css'), `${page}: ملف التنسيق`);
  /* كل رابط داخلي يشير إلى صفحة أو ملف موجود. */
  for (const [, href] of html.matchAll(/href="(\/[^"#?]+)"/g)) {
    const target = href.endsWith('/') ? path.join(root, href.slice(1), 'index.html') : path.join(root, href.slice(1));
    assert.ok(fs.existsSync(target), `${page}: رابط مكسور ${href}`);
  }
}

/* ---- الأسابيع المؤرخة ---- */
const state = await import('../bayt/app/state.mjs');
/* الأسبوع يبدأ السبت. 2026-09-19 سبت، و2026-09-21 اثنين يليه. */
assert.equal(state.weekKey(new Date('2026-09-19T12:00:00')), '2026-09-19', 'السبت يبدأ أسبوعه');
assert.equal(state.weekKey(new Date('2026-09-21T12:00:00')), '2026-09-19', 'الاثنين ينتمي لسبت قبله');
assert.equal(state.weekKey(new Date('2026-09-25T23:00:00')), '2026-09-19', 'الجمعة آخر الأسبوع');
assert.equal(state.weekKey(new Date('2026-09-26T00:30:00')), '2026-09-26', 'السبت التالي أسبوع جديد');
assert.equal(state.shiftWeek('2026-09-19', 1), '2026-09-26');
assert.equal(state.shiftWeek('2026-09-19', -1), '2026-09-12');
assert.equal(state.weekDates('2026-09-19').length, 7);

/* البلانر يعرض شريط الأسبوع وتاريخ كل يوم. */
const plannerPage = read('bayt/planner/index.html');
for (const hook of ['data-week-prev', 'data-week-next', 'data-week-today', 'data-week-label', 'data-day-date="0"']) {
  assert.ok(plannerPage.includes(hook), `البلانر ينقص فيه ${hook}`);
}
/* المهام والعادات مرتبطة بأسبوع في الشيفرة، لا برقم يوم وحده. */
const plannerCode = read('bayt/app/planner-page.mjs');
assert.ok(plannerCode.includes('tasksForWeek'), 'المهام تُقرأ لكل أسبوع');
assert.ok(plannerCode.includes('habitDays(habit, week)'), 'سجل العادات لكل أسبوع');
const stateCode = read('bayt/app/state.mjs');
assert.ok(stateCode.includes('const VERSION = 2'), 'إصدار الحالة مرفوع');
assert.ok(/habit\.log\[week\]/.test(stateCode), 'سجل العادة مفهرس بالأسبوع');
/* الترحيل لا يحذف بيانات المستخدم. */
assert.ok(stateCode.includes('h.days') && stateCode.includes('legacy'), 'ترحيل سجل العادات القديم موجود');

/* ---- المهارة مرتبطة بشرح يغطيها ---- */
const units = skillById.get('SKILL-UNITS');
assert.equal(units.learn.href, '/bayt/math/units-and-mass-fractions/', 'مهارة الوحدات لها درسها الخاص');
assert.notEqual(units.learn.href, '/foundations/reading/basic-math/order-of-operations/', 'لا تعود لدرس لا يغطيها');
const unitsPage = read('bayt/math/units-and-mass-fractions/index.html');
for (const topic of ['Mass fraction', 'Conversion factor', 'Component flow']) {
  assert.ok(unitsPage.toLowerCase().includes(topic.toLowerCase()), `درس الوحدات لا يغطي: ${topic}`);
}
assert.ok(unitsPage.includes('/program/lessons/material-balances/'), 'درس الوحدات يمهّد لموازنة المواد');
assert.ok((unitsPage.match(/<details class="reading-answer"/g) || []).length >= 5, 'خمسة تطبيقات بإجابات مشروحة');
/* الشرح قبل التطبيق. */
assert.ok(unitsPage.indexOf('class="question-list"') > unitsPage.indexOf('Mass fraction'), 'التطبيق بعد الشرح');

/* ---- التقرير الكامل ---- */
const reportPage = read('bayt/report/index.html');
for (const field of ['feedA', 'fractionA', 'feedB', 'fractionB', 'outTotal', 'outSolute', 'outPercent', 'assumptions', 'processDescription']) {
  assert.ok(reportPage.includes(`name="${field}"`), `نموذج التقرير ينقصه الحقل ${field}`);
}
/* الاسم description وحده يصطدم بـ meta name="description". */
assert.equal(/<textarea[^>]*name="description"/.test(reportPage), false, 'اسم الحقل يتعارض مع وسم الوصف');
assert.ok(reportPage.includes('kg/h'), 'الوحدات معلنة في النموذج');

/* التمييز الثلاثي معلن للطالب ومسجّل في البيانات. */
for (const line of ['Task completion', 'Correct answer', 'Skill Mastery']) {
  assert.ok(reportPage.includes(line), `صفحة التقرير لا تفصل: ${line}`);
}
assert.ok(/does not record|does not claim|not recorded/i.test(reportPage), 'الإتقان لا يُدّعى');
const reportCode = read('bayt/app/report-page.mjs');
assert.ok(reportCode.includes('calculationChecked'), 'صحة الإجابة مسجّلة منفصلة');
assert.equal(/mastery\s*:\s*true/.test(reportCode), false, 'لا يُسجَّل إتقان إطلاقًا');
assert.ok(stateCode.includes('mastery') && stateCode.includes('لا يُسجَّل أبدًا'), 'الحالة توثّق أن الإتقان لا يُسجَّل');

/* نتيجة التحقق لا تبقى معروضة بعد تغيير قيمة تؤثر في الحساب، وإلا قرأ
   الطالب «تطابق» على أرقام لم تُقارن. */
assert.ok(reportCode.includes('staleCheck'), 'لا يوجد إبطال لنتيجة التحقق');
assert.ok(reportCode.includes('Values have changed; Recheck'), 'رسالة إعادة التحقق مفقودة');
for (const fieldName of ['outTotal', 'outSolute', 'outPercent', 'feedA', 'fractionA', 'feedB', 'fractionB']) {
  assert.ok(new RegExp(`'${fieldName}'`).test(reportCode), `الحقل ${fieldName} لا يُبطل التحقق عند تغييره`);
}

/* ---- صحة شرح عامل التحويل ----
   قلب الكسر يعطي (t/h) × (t/kg) = t²/(h·kg): الطن مربَّع في البسط لا المقام. */
assert.ok(unitsPage.includes('t²/(h·kg)'), 'الناتج الصحيح لقلب العامل غير مذكور');
assert.ok(unitsPage.includes('numerator'), 'موضع t² غير مذكور');
assert.equal(/t²[^.<]{0,40}in the denominator/.test(unitsPage.replace(/<[^>]+>/g, ' ')), false, 'ما زال يضع t² في المقام');

/* التقرير قابل للمراجعة والتعديل. */
assert.ok(reportCode.includes("get('edit')"), 'التقرير يُفتح للتعديل');
assert.ok(reportCode.includes('updateAchievement'), 'التعديل يحدّث الإنجاز نفسه لا ينشئ آخر');
const portfolioCode = read('bayt/app/portfolio-page.mjs');
assert.ok(portfolioCode.includes('/bayt/report/?edit='), 'ملف الإنجاز يتيح فتح التقرير للتعديل');
assert.ok(portfolioCode.includes('renderReport'), 'التقرير يُعرض بأقسامه لا كنص واحد');

/* الهدف يَعِد بتقرير، فلا بد من رابط نموذجه. */
assert.ok(flagship.report?.href === '/bayt/report/', 'الهدف يشير إلى نموذج التقرير');
assert.ok(exists(flagship.report.href), 'نموذج التقرير موجود');

/* ---- مساحة اللمس ---- */
const css = read('bayt/bayt.css');
assert.match(css, /\.icon-button[\s\S]*?min-height:\s*44px/, 'زر الحذف لا يقل عن 44 بكسل');
assert.match(css, /\.link-button[\s\S]*?min-height:\s*44px/, 'رابط التأجيل لا يقل عن 44 بكسل');
assert.match(css, /\.week-step[\s\S]*?min-height:\s*44px/, 'أزرار التنقل بين الأسابيع لا تقل عن 44 بكسل');
assert.match(css, /\[data-state="stale"\]/, 'حالة «قديمة» بلا تنسيق');

/* ---- [hidden] يجب أن يخفي فعلًا ----
   أي قاعدة display في ملف التنسيق تتغلب على الخاصية، فكان شريط البيانات
   التجريبية يظهر ولو لم توجد بيانات تجريبية: خبر كاذب للطالب. */
assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/, 'قاعدة [hidden] العامة مفقودة');
/* كل عنصر يُخفى بالخاصية يبدأ مخفيًا في الصفحة المبنية. */
for (const page of pages) {
  const html = read(page);
  for (const hook of ['data-demo-bar', 'data-storage-warning', 'data-model', 'data-week-today']) {
    const tag = html.match(new RegExp(`<[^>]*${hook}[^>]*>`));
    if (tag) assert.match(tag[0], /\shidden(\s|>)/, `${page}: ${hook} لا يبدأ مخفيًا`);
  }
}

console.log(`بيت الفؤاد: ${sections.length} أقسام، ${goals.length} أهداف، ${skills.length} مهارات بدروس موجودة، ${pages.length} صفحات تلتزم السياسة.`);
