/* اختبارات دروس بيت الفؤاد داخل صفحات الفصل الأول.

   تفحص ما يمكن للآلة أن تفحصه: البنية، والحساب، وسلامة الروابط، وتطابق
   الصفحة مع مصدرها. لا تفحص صحة الشرح ولا ملاءمته للطالب؛ ذلك عمل مراجع
   بشري، ويُذكر بين حدود المراجعة. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { lessons } from '../bayt/data/lessons/index.mjs';
import { validate, MINIMUM } from '../bayt/data/lessons/schema.mjs';
import { parseAnswer } from '../semester-1/assets/practice.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const curriculum = JSON.parse(read('semester-1/curriculum.json'));

const topics = new Map();
for (const course of curriculum.courses) {
  for (const t of course.topics) topics.set(`${course.id}.${t.id}`, t);
}

let checks = 0;
const ok = (label, fn) => { fn(); checks += 1; void label; };

for (const lesson of lessons) {
  const at = `${lesson.course}.${lesson.topic}`;

  ok(`${at}: يطابق المخطط`, () => {
    assert.deepEqual(validate(lesson), [], `${at} لا يستوفي المخطط`);
  });

  const topic = topics.get(at);
  ok(`${at}: موضوع معروف في المنهج`, () => {
    assert.ok(topic, `${at} لا يوافق موضوعًا في curriculum.json`);
  });

  /* الأخطاء الشائعة هي جوهر التغذية الراجعة، فيجب أن تكون قابلة للالتقاط
     فعلًا: لو خرجت عن سماحية المقارنة لما ظهر تفسيرها للطالب أبدًا. */
  for (const q of lesson.questionTypes) {
    ok(`${at}/${q.id}: الأخطاء الشائعة متمايزة والتقاطها ممكن`, () => {
      const seen = new Set();
      for (const e of q.commonErrors) {
        assert.notEqual(Math.abs(e.value - q.answer) <= q.tolerance, true,
          `${at}/${q.id}: الخطأ ${e.value} داخل سماحية الإجابة`);
        for (const other of seen) {
          assert.ok(Math.abs(e.value - other) > q.tolerance,
            `${at}/${q.id}: خطآن شائعان لا يمكن التمييز بينهما (${e.value} و${other})`);
        }
        seen.add(e.value);
      }
    });

    /* الإجابة المخزَّنة يجب أن تمر بالمحلّل نفسه الذي يمر به جواب الطالب،
       وإلا قبلنا في البيانات ما نرفضه في الواجهة. */
    ok(`${at}/${q.id}: الإجابة عدد صالح`, () => {
      assert.equal(parseAnswer(String(q.answer)), q.answer);
      assert.ok(q.tolerance > 0, `${at}/${q.id}: السماحية يجب أن تكون موجبة`);
    });
  }

  /* الهدف الذي لا يقيسه سؤال وعدٌ غير محقَّق. */
  ok(`${at}: كل هدف يقيسه سؤال`, () => {
    const covered = new Set(lesson.questionTypes.flatMap((q) => q.objectives ?? []));
    for (let i = 0; i < lesson.objectives.length; i += 1) {
      assert.ok(covered.has(i), `${at}: الهدف ${i + 1} بلا سؤال يقيسه`);
    }
  });

  /* الصفحة المبنية يجب أن تعكس الدرس، وإلا كان التحرير اليدوي قد سبقها. */
  const html = read(path.join(topic.href.slice(1), 'index.html'));

  ok(`${at}: الصفحة تحمل الأقسام الأربعة`, () => {
    for (const id of ['definitions', 'visual', 'worked', 'applications']) {
      assert.ok(html.includes(`id="${id}"`), `${at}: القسم ${id} مفقود من الصفحة`);
    }
  });

  ok(`${at}: كل نمط سؤال له كتلة في الصفحة`, () => {
    for (const q of lesson.questionTypes) {
      assert.ok(html.includes(`data-worked-example="${q.id}"`), `${at}: النمط ${q.id} مفقود`);
    }
  });

  ok(`${at}: الرسم أصلي لا صورة ناشر`, () => {
    const start = html.indexOf('id="visual"');
    const end = html.indexOf('id="worked"');
    const block = html.slice(start, end);
    assert.ok(block.includes('<svg'), `${at}: لا رسم أصلي في القسم البصري`);
    assert.ok(!/<img[^>]*\/(educator|pearson|book)\//.test(block),
      `${at}: القسم البصري يعتمد على صورة من مصدر خارجي`);
  });

  ok(`${at}: الرسم موصوف لمن لا يراه`, () => {
    assert.ok(html.includes('role="img"'), `${at}: الرسم بلا دور معلن`);
    assert.ok(html.includes('aria-labelledby='), `${at}: الرسم بلا عنوان مرتبط`);
  });

  ok(`${at}: الجدول يبلغه لوح المفاتيح ويحمل اسمًا`, () => {
    const wrap = html.match(/<div class="table-wrap"[^>]*>/);
    assert.ok(wrap, `${at}: لا جدول`);
    assert.ok(wrap[0].includes('tabindex="0"'), `${at}: الجدول لا يبلغه لوح المفاتيح`);
    assert.ok(wrap[0].includes('aria-label='), `${at}: الجدول بلا اسم`);
  });

  ok(`${at}: ملف بيانات الأسئلة يطابق الدرس`, () => {
    const data = JSON.parse(read(path.join('semester-1/assets/bayt', `${topic.key}.json`)));
    assert.equal(data.questions.length, lesson.questionTypes.length);
    for (const q of lesson.questionTypes) {
      const stored = data.questions.find((x) => x.id === q.id);
      assert.ok(stored, `${at}: ${q.id} مفقود من ملف البيانات`);
      assert.equal(stored.answer, q.answer);
      assert.equal(stored.commonErrors.length, q.commonErrors.length);
    }
  });

  ok(`${at}: لا كتل مكرّرة من بناء سابق`, () => {
    const opens = (html.match(/<!--bayt:start-->/g) || []).length;
    const closes = (html.match(/<!--bayt:end-->/g) || []).length;
    assert.equal(opens, closes, `${at}: علامات البناء غير متوازنة`);
    assert.equal((html.match(/id="applications"/g) || []).length, 1,
      `${at}: قسم التدريب مكرّر`);
  });

  /* سياسة الأمان تمنع النصوص والأنماط المضمّنة بلا بصمة. */
  ok(`${at}: لا نصوص ولا أنماط مضمّنة أضفناها`, () => {
    const start = html.indexOf('<!--bayt:start-->');
    const blocks = html.slice(start);
    assert.ok(!/<style[ >]/.test(blocks), `${at}: نمط مضمّن يخالف سياسة الأمان`);
    assert.ok(!/ style="/.test(blocks), `${at}: سمة style مضمّنة تخالف سياسة الأمان`);
  });

  ok(`${at}: ورقة أنماط الدرس مرتبطة مرة واحدة`, () => {
    assert.equal((html.match(/study\.css/g) || []).length, 1);
  });

  /* المتطلب يُعالَج في مكانه؛ الرابط الاختياري يجب أن يشير إلى ملف موجود. */
  ok(`${at}: روابط المتطلبات الاختيارية موجودة`, () => {
    for (const p of lesson.prerequisites) {
      assert.ok(p.recap && p.recap.length > 40, `${at}: شرح المتطلب «${p.title}» أقصر من أن يعالجه`);
      if (!p.href) continue;
      const clean = p.href.split('#')[0].replace(/^\//, '');
      const target = clean.endsWith('/') ? path.join(clean, 'index.html') : clean;
      assert.ok(fs.existsSync(path.join(root, target)),
        `${at}: رابط المتطلب «${p.title}» يشير إلى ${p.href} وهو غير موجود`);
    }
  });

  /* رابط الفيديو لا يُدرج إلا بعد التحقق، والعلامة تُلزمنا بذلك. */
  ok(`${at}: لا فيديو غير متحقَّق منه`, () => {
    const v = lesson.visual.video;
    if (!v) return;
    assert.equal(v.verified, true, `${at}: رابط فيديو غير موسوم بالتحقق`);
    assert.ok(v.note, `${at}: رابط فيديو بلا بيان لما يغطّيه`);
  });
}

/* الحدّ الأدنى ليس زينة: لو خُفّض لمرّت دروس ناقصة. */
ok('الحدّ الأدنى لم يُخفَّض', () => {
  assert.ok(MINIMUM.questionTypes >= 4);
  assert.ok(MINIMUM.definitions >= 2);
  assert.ok(MINIMUM.workedSteps >= 3);
});

console.log(`bayt-lessons: ${checks} فحصًا ناجحًا على ${lessons.length} درسًا.`);
