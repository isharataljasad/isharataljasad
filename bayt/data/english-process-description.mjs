/* درس «وصف العملية» — كتابة أصلية لبيت الفؤاد.
   الشرح أولًا، ثم مثال محلول، ثم أخطاء شائعة، ثم مهمة قصيرة بمراجعة ذاتية.
   لا يُنسخ نص ناشر ولا تمرين من كتاب، ولا توجد شراكة مع أي جهة. */

export const lesson = {
  id: 'ENG-PROCESS-01',
  skill: 'SKILL-PROCESS-WRITING',
  title: 'وصف عملية صناعية بالإنجليزية',
  minutes: 20,
  intro:
    'في كل تقرير مختبر أو تدريب ستُطلب منك فقرة تصف ما يحدث داخل الجهاز. هذه الفقرة لها قواعد ثابتة قليلة، ومتى أتقنتها صارت جاهزة لأي عملية أخرى. الدرس مرتبط بدرس موازنة المواد: ستصف الخلّاط نفسه الذي حسبته.',
  prerequisite: {
    label: 'درس موازنة المواد',
    href: '/program/lessons/material-balances/',
    why: 'ستصف الخلّاط الوارد فيه، فاقرأه أولًا إن لم تقرأه.',
  },

  sections: [
    {
      heading: '١ · لماذا المبني للمجهول هنا تحديدًا',
      body: [
        'في اللغة العامة يُنصح بتجنّب المبني للمجهول. في وصف العملية العكس صحيح، لأن المهم هو ما يحدث للمادة لا من فعله.',
        'قارن: <code dir="ltr">The technician heats the feed to 60 °C</code> مقابل <code dir="ltr">The feed is heated to 60 °C</code>. الجملة الثانية أدق في التقرير لأن الفنّي قد يتغير، والعملية لا تتغير.',
        'القاعدة العملية: اجعل <strong>المادة</strong> أو <strong>التيار</strong> فاعل الجملة، ثم استخدم الفعل في المبني للمجهول والمضارع البسيط.',
      ],
      table: {
        caption: 'الصيغة الثابتة',
        head: ['العنصر', 'الشكل', 'مثال'],
        rows: [
          ['الفاعل', 'المادة أو التيار', '<code dir="ltr">The solution</code>'],
          ['الفعل', 'مضارع بسيط، مبني للمجهول', '<code dir="ltr">is fed</code>'],
          ['التفصيل', 'الأداة أو الشرط', '<code dir="ltr">to the mixer at 100 kg/h</code>'],
        ],
      },
    },
    {
      heading: '٢ · روابط التسلسل تُغني عن الترقيم',
      body: [
        'لا تكتب الخطوات كقائمة مرقّمة داخل الفقرة. استخدم روابط تُظهر الترتيب: <code dir="ltr">first</code>، <code dir="ltr">then</code>، <code dir="ltr">next</code>، <code dir="ltr">finally</code>.',
        'ورابط النتيجة يفصل ما حدث عمّا ترتّب عليه: <code dir="ltr">as a result</code>، <code dir="ltr">so that</code>، <code dir="ltr">which gives</code>.',
        'ثلاث جمل مرتبطة أوضح من ست جمل مقطوعة. الرابط يخبر القارئ أين هو من العملية.',
      ],
    },
    {
      heading: '٣ · مثال محلول: الخلّاط',
      body: [
        'العملية كما في درس موازنة المواد: تيار A مقداره 100 kg/h ويحتوي 20% مذاب، وتيار B مقداره 50 kg/h ماء نقي، ويخرج تيار واحد.',
      ],
      example: {
        label: 'الفقرة النموذجية',
        text: 'Two streams are fed continuously to a mixing tank. First, feed A enters at 100 kg/h and carries 20% solute by mass. Then feed B, which is pure water, is added at 50 kg/h. The two streams are combined at steady state, so that the outlet flow is 150 kg/h. Because no solute is added or removed, the solute flow stays at 20 kg/h, which gives an outlet concentration of 13.3% by mass.',
        notes: [
          'كل جملة فاعلها تيار أو مادة، لا شخص.',
          '<code dir="ltr">First / Then</code> رتّبت الخطوتين دون ترقيم.',
          '<code dir="ltr">so that</code> و<code dir="ltr">which gives</code> ربطتا السبب بالنتيجة.',
          'الأرقام جاءت بوحداتها في كل مرة.',
        ],
      },
    },
    {
      heading: '٤ · أخطاء متكررة، وسبب كل خطأ',
      table: {
        caption: 'صحّح قبل أن تسلّم',
        head: ['الخطأ', 'لماذا يُعدّ خطأ', 'الصواب'],
        rows: [
          [
            '<code dir="ltr">We put the water in the tank.</code>',
            'التقرير لا يهتم بمن نفّذ. كما أن <code dir="ltr">put</code> عامية في هذا السياق.',
            '<code dir="ltr">Water is added to the tank.</code>',
          ],
          [
            '<code dir="ltr">The feed was heated…</code>',
            'الماضي يصف تجربة انتهت. وصف عملية قائمة يأتي بالمضارع البسيط.',
            '<code dir="ltr">The feed is heated…</code>',
          ],
          [
            '<code dir="ltr">The flow is 150.</code>',
            'رقم بلا وحدة لا معنى له في الهندسة.',
            '<code dir="ltr">The flow is 150 kg/h.</code>',
          ],
          [
            '<code dir="ltr">The mixer mixes the mixture.</code>',
            'تكرار الجذر يضعف الجملة ولا يضيف معلومة.',
            '<code dir="ltr">The streams are combined in the mixer.</code>',
          ],
          [
            '<code dir="ltr">After that, after that…</code>',
            'إعادة الرابط نفسه تُفقده وظيفته.',
            'نوّع: <code dir="ltr">then</code>، <code dir="ltr">next</code>، <code dir="ltr">finally</code>.',
          ],
        ],
      },
    },
  ],

  task: {
    prompt:
      'اكتب من ثلاث إلى خمس جمل تصف عملية الخلط التالية: تيار مقداره 80 kg/h ويحتوي 15% مذاب، وتيار ماء نقي مقداره 70 kg/h، يدخلان خلّاطًا في حالة مستقرة، ويخرج تيار واحد تركيزه 8% مذاب.',
    hint: 'ابدأ بعدد التيارات، ثم صف كل تيار بترتيب، ثم اذكر المخرج ونتيجته.',
    /* قائمة المراجعة هي أداة التصحيح. الطالب يحكم على نصه بنفسه بمعايير
       معلنة، ولا يدّعي التطبيق أنه صحّح لغته. */
    checklist: [
      { id: 'passive', text: 'فاعل كل جملة مادة أو تيار، والفعل مبني للمجهول.' },
      { id: 'present', text: 'كل الأفعال في المضارع البسيط.' },
      { id: 'sequence', text: 'استخدمتُ رابطي تسلسل مختلفين على الأقل.' },
      { id: 'units', text: 'كل رقم مذكور بوحدته.' },
      { id: 'result', text: 'ذكرتُ تركيز المخرج بوصفه نتيجة، لا كجملة منفصلة.' },
      { id: 'length', text: 'النص بين ثلاث وخمس جمل.' },
    ],
    model: {
      label: 'نموذج إجابة بعد محاولتك',
      text: 'Two streams are fed to a mixer that operates at steady state. First, a solution stream enters at 80 kg/h and carries 15% solute by mass. Then pure water is added at 70 kg/h. The streams are combined in a single outlet, so that the total flow becomes 150 kg/h. Since no solute is gained or lost, the outlet concentration is 8% by mass.',
      why: 'لاحظ أن التركيز جاء في النهاية مربوطًا بـ<code dir="ltr">Since</code>، لأنه نتيجة الموازنة لا معلومة مستقلة. هذا النموذج واحد من صياغات صحيحة كثيرة؛ اختلاف ترتيبك لا يعني خطأك.',
    },
  },

  outcome: {
    title: 'وصف عملية خلط بالإنجليزية',
    kind: 'كتابة تقنية',
  },
};
