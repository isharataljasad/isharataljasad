/* درس «وصف العملية» — كتابة أصلية لبيت الفؤاد.
   الشرح أولًا، ثم مثال محلول، ثم أخطاء شائعة، ثم مهمة قصيرة بمراجعة ذاتية.
   لا يُنسخ نص ناشر ولا تمرين من كتاب، ولا توجد شراكة مع أي جهة. */

export const lesson = {
  id: 'ENG-PROCESS-01',
  skill: 'SKILL-PROCESS-WRITING',
  title: "Description of an industrial process in English",
  minutes: 20,
  intro:
    "In each lab or training report you will be asked for a paragraph describing what is happening inside the device. This paragraph has a few fixed rules, and once you master it, it is ready for any other operation. The lesson is related to the lesson on material balance: you will describe the same mixer that you calculated.",
  prerequisite: {
    label: "material balance lesson",
    href: '/program/lessons/material-balances/',
    why: "It will describe the mixer contained in it, so read it first if you have not read it.",
  },

  sections: [
    {
      heading: "1 · Why the passive voice here specifically?",
      body: [
        "In common language it is recommended to avoid the passive voice. In describing the process, the opposite is true, because what is important is what happens to the substance, not who did it.",
        "Compare: <code dir=\"ltr\">The technician heats the feed to 60 °C</code> vs <code dir=\"ltr\">The feed is heated to 60 °C</code>. The second sentence is more accurate in the report because the technician may change, but the process does not change.",
        "Practical rule: Make <strong>Subject</strong> Or <strong>Stream</strong> The subject of the sentence, then use the verb in the passive voice and the simple present tense.",
      ],
      table: {
        caption: "Fixed formula",
        head: ["Item", "Figure", "Example"],
        rows: [
          ["The subject", "Material or stream", '<code dir="ltr">The solution</code>'],
          ["Action", "Simple present, passive voice", '<code dir="ltr">is fed</code>'],
          ["Detail", "Tool or condition", '<code dir="ltr">to the mixer at 100 kg/h</code>'],
        ],
      },
    },
    {
      heading: "2 · Serial links eliminate the need for numbering",
      body: [
        "Do not write the steps as a numbered list within a paragraph. Use links that show ranking: <code dir=\"ltr\">first</code>، <code dir=\"ltr\">then</code>، <code dir=\"ltr\">next</code>، <code dir=\"ltr\">finally</code>.",
        "The link to the result separates what happened from what resulted from it: <code dir=\"ltr\">as a result</code>، <code dir=\"ltr\">so that</code>، <code dir=\"ltr\">which gives</code>.",
        "Three connected sentences are clearer than six broken sentences. The link tells the reader where he or she is in the process.",
      ],
    },
    {
      heading: "3 · Example solution: mixer",
      body: [
        "Use the process from the material balance lesson: stream A flows at 100 kg/h and contains 20% solute; stream B supplies 50 kg/h of pure water. There is one outlet stream.",
      ],
      example: {
        label: "Model paragraph",
        text: 'Two streams are fed continuously to a mixing tank. First, feed A enters at 100 kg/h and carries 20% solute by mass. Then feed B, which is pure water, is added at 50 kg/h. The two streams are combined at steady state, so that the outlet flow is 150 kg/h. Because no solute is added or removed, the solute flow stays at 20 kg/h, which gives an outlet concentration of 13.3% by mass.',
        notes: [
          "Every sentence is subject to a current or a substance, not a person.",
          "<code dir=\"ltr\">First / Then</code> The two steps are arranged without numbering.",
          "<code dir=\"ltr\">so that</code> And<code dir=\"ltr\">which gives</code> They linked cause to effect.",
          "The numbers came in their units each time.",
        ],
      },
    },
    {
      heading: "4 · Repeated errors, and the reason for each error",
      table: {
        caption: "Correct before you submit",
        head: ["Error", "Why is it an error?", "The right thing"],
        rows: [
          [
            '<code dir="ltr">We put the water in the tank.</code>',
            "The report does not care about who carried it out. Also <code dir=\"ltr\">put</code> Slang in this context.",
            '<code dir="ltr">Water is added to the tank.</code>',
          ],
          [
            '<code dir="ltr">The feed was heated…</code>',
            "The past describes an experience that has ended. The description of a list process comes in the simple present tense.",
            '<code dir="ltr">The feed is heated…</code>',
          ],
          [
            '<code dir="ltr">The flow is 150.</code>',
            "A unitless number has no meaning in geometry.",
            '<code dir="ltr">The flow is 150 kg/h.</code>',
          ],
          [
            '<code dir="ltr">The mixer mixes the mixture.</code>',
            "Repeating the root weakens the sentence and does not add information.",
            '<code dir="ltr">The streams are combined in the mixer.</code>',
          ],
          [
            '<code dir="ltr">After that, after that…</code>',
            "Resetting the same link will cause it to lose its functionality.",
            "Diversify: <code dir=\"ltr\">then</code>، <code dir=\"ltr\">next</code>، <code dir=\"ltr\">finally</code>.",
          ],
        ],
      },
    },
  ],

  task: {
    prompt:
      "Write three to five sentences describing the following mixing process: A stream of 80 kg/h containing solute 15% and a stream of pure water of 70 kg/h enter a mixer at steady state, and one stream containing solute 8% exits.",
    hint: "Start with the number of currents, then describe each current in order, then state the output and its result.",
    /* قائمة المراجعة هي أداة التصحيح. الطالب يحكم على نصه بنفسه بمعايير
       معلنة، ولا يدّعي التطبيق أنه صحّح لغته. */
    checklist: [
      { id: 'passive', text: "The subject of every sentence is a substance or current, and the verb is passive." },
      { id: 'present', text: "All verbs are in the simple present." },
      { id: 'sequence', text: "I used at least two different sequence links." },
      { id: 'units', text: "Each number is stated in its unit." },
      { id: 'result', text: "I mentioned director concentration as a result, not as a separate sentence." },
      { id: 'length', text: "The text is between three and five sentences." },
    ],
    model: {
      label: "Sample answer after you try",
      text: 'Two streams are fed to a mixer that operates at steady state. First, a solution stream enters at 80 kg/h and carries 15% solute by mass. Then pure water is added at 70 kg/h. The streams are combined in a single outlet, so that the total flow becomes 150 kg/h. Since no solute is gained or lost, the outlet concentration is 8% by mass.',
      why: "Notice that the concentration came last linked to<code dir=\"ltr\">Since</code>Because the result of the budget is no independent information. This model is one of many correct formulations; Your ranking being different does not mean you are wrong.",
    },
  },

  outcome: {
    title: "Description of the mixing process in English",
    kind: "Technical writing",
  },
};
