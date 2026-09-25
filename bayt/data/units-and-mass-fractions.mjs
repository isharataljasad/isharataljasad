/* درس «الوحدات والكسور الكتلية» — كتابة أصلية لبيت الفؤاد.

   كُتب لأن المهارة SKILL-UNITS كانت مرتبطة بدرس ترتيب العمليات، وهو لا
   يغطّيها. الدرس يخدم موازنة المواد مباشرة: كل مثال فيه تيار وتدفق وكسر. */

export const lesson = {
  id: 'MATH-UNITS-01',
  skill: 'SKILL-UNITS',
  title: "Units and mass fractions",
  minutes: 20,
  intro:
    "Before any material balance you need two tools: a consistent unit for each quantity, and a mass fraction that you know what it means. Most errors in engineering calculations are not in algebra, but in adding two numbers with two different units, or in multiplying a flow by a percentage without dividing it by a hundred.",
  leadsTo: {
    label: "material balance lesson",
    href: '/program/lessons/material-balances/',
    why: "Everything here is used directly there: Component flow = Total flow × mass fraction.",
  },

  sections: [
    {
      heading: "1 · Quantity is not a number alone",
      body: [
        "Engineering value = number + unit. “The flow 150» is an incomplete sentence that cannot be verified. «Flow 150 kg/h» complete sentence.",
        "From this follows the rule of addition: <strong>Add quantities only after expressing them in the same unit</strong>. Combining 12 mm with 1 cm does not equal 13; One of them is converted first to : 12 mm + 10 mm = 22 mm.",
        "From this follows the multiplication rule: units are multiplied and divided with numbers. If you multiply kg/h by an hour you get kg. The unit itself tells you if the calculation is reasonable.",
      ],
      table: {
        caption: "What is permissible with units?",
        head: ["Process", "Condition", "Example"],
        rows: [
          ["Addition or subtraction", "The two units are identical", '<code dir="ltr">100 kg/h + 50 kg/h = 150 kg/h</code>'],
          ["Hit", "Multiply the units along with the numbers", '<code dir="ltr">100 kg/h × 2 h = 200 kg</code>'],
          ["Divide", "Divide and cancel matching units", "<code dir=\"ltr\">20 kg/h ÷ 150 kg/h = 0.133</code> dimensionless"],
        ],
      },
    },
    {
      heading: "2 · Conversion by multiplying by one",
      body: [
        "Do not save the conversion direction. Write the conversion factor as a fraction of one, then multiply so that the unwanted unit is abbreviated.",
        "Example: convert <code dir=\"ltr\">0.5 t/h</code> To <code dir=\"ltr\">kg/h</code>. We know that <code dir=\"ltr\">1 t = 1000 kg</code>The breakage <code dir=\"ltr\">(1000 kg / 1 t)</code> Its value is one.",
        "<code dir=\"ltr\">0.5 t/h × (1000 kg / 1 t) = 500 kg/h</code>. The ton was abbreviated because it was in the numerator and denominator.",
        "If you multiply the fraction upside down, <code dir=\"ltr\">(1 t / 1000 kg)</code>When something was shortened: <code dir=\"ltr\">(t/h) × (t/kg) = t²/(h·kg)</code>. The ton was multiplied by itself and became <strong>Squared in the numerator</strong>The kilogram remains in the denominator, and this unit has no meaning here. <strong>The resulting unit is what tells you that you hit in the right direction</strong>Not your memory.",
      ],
    },
    {
      heading: "3 · Mass fraction: precise definition",
      body: [
        "The mass fraction of an ingredient is the mass of that ingredient divided by the mass of the whole mixture.",
        "<code dir=\"ltr\">x = Component mass ÷ Mixture mass</code>",
        "Because it is a mass-to-mass ratio, it is.. <strong>dimensionless</strong>, and its value is always between zero and one. The sum of the fractions of all the components in one stream equals exactly one, because you divided the whole by the whole.",
        "The percentage is the fraction itself multiplied by one hundred dissolved. «20% means <code dir=\"ltr\">x = 0.20</code>. In calculations, use fractions, not ratios. The percentage is for display only.",
      ],
      table: {
        caption: "Stream 100 kg/h has 20% dissolved",
        head: ["Component", "Mass fraction", "Flow"],
        rows: [
          ["Solute", '<code dir="ltr">0.20</code>', '<code dir="ltr">100 × 0.20 = 20 kg/h</code>'],
          ["Water", '<code dir="ltr">0.80</code>', '<code dir="ltr">100 × 0.80 = 80 kg/h</code>'],
          ["<strong>Total</strong>", '<code dir="ltr">1.00</code>', '<code dir="ltr">100 kg/h</code>'],
        ],
      },
    },
    {
      heading: "4 · The relationship that is used in every budget",
      body: [
        "From the definition of mass fraction comes the relationship that you will write in each balancing problem:",
        "<code dir=\"ltr\">Component flow = Total flow × Mass fraction</code>",
        "Note the units: <code dir=\"ltr\">kg/h × (dimensionless) = kg/h</code>. The result is flow, not ratio. Here's a quick check: If you get a unitless number where you're expecting a flow, you've hit something wrong.",
        "Conversely, if you know the component flow and the total flow, the fraction is the result of dividing them, and the units are abbreviated and an abstract number comes out as it should.",
      ],
      example: {
        label: "Solution example",
        steps: [
          "Stream 80 kg/h Mass fraction of solute 0.15. What is the flow of solute?",
          "<code dir=\"ltr\">80 kg/h × 0.15 = 12 kg/h</code> of solute.",
          "And water flow: <code dir=\"ltr\">80 × (1 − 0.15) = 80 × 0.85 = 68 kg/h</code>.",
          "Check: <code dir=\"ltr\">12 + 68 = 80 kg/h</code>, which is the total flow. The sum matches, so the calculation is consistent.",
        ],
      },
    },
    {
      heading: "5 · Repeated errors, and the reason for each error",
      table: {
        caption: "Correct before you continue",
        head: ["Error", "Why is it an error?", "The right thing"],
        rows: [
          ['<code dir="ltr">100 × 20 = 2000 kg/h</code>', "Multiply by the percentage, not by the fraction.", '<code dir="ltr">100 × 0.20 = 20 kg/h</code>'],
          ['<code dir="ltr">100 kg/h + 50 kg = 150</code>', "A flow is combined with a mass. The two quantities are different.", "Unite the basis first: either flow with flow, or mass with mass."],
          ["Mass fraction of 1.2", "A fraction is part of a whole, so it cannot exceed one.", "See division; Mostly I divided by the ingredient instead of the mixture."],
          ["Sum of fractions 0.9", "A forgotten component, or a calculation error.", "Total in one stream exactly = 1."],
          ["Mix the mass fraction with the molar", "The first is a mass ratio and the second is a moles ratio; Their values ​​are different for the same mixture.", "State the basis explicitly: mass fraction or mole fraction."],
        ],
      },
    },
  ],

  questions: [
    { q: "Convert <code dir=\"ltr\">1.2 t/h</code> To <code dir=\"ltr\">kg/h</code>, writing the conversion factor.",
      a: "<code dir=\"ltr\">1.2 t/h × (1000 kg / 1 t) = 1200 kg/h</code>. The ton was shortened, so it remained <code dir=\"ltr\">kg/h</code> It is required." },
    { q: "Stream 250 kg/h Mass fraction of salt 0.04. What is the flow of salt and the flow of water?",
      a: "Salt: <code dir=\"ltr\">250 × 0.04 = 10 kg/h</code>. Water: <code dir=\"ltr\">250 × 0.96 = 240 kg/h</code>. Examination: <code dir=\"ltr\">10 + 240 = 250 kg/h</code>." },
    { q: "A stream containing 30 kg/h solute and its total flow is 120 kg/h. What is the mass fraction and percentage?",
      a: "<code dir=\"ltr\">30 ÷ 120 = 0.25</code> Unitless, i.e. 25%. The units are abbreviated because the two quantities flow." },
    { q: "Your colleague said that the fraction of a component in a stream equals 1.3. what is wrong without seeing his calculation?",
      a: "A fraction is part of a whole, so it cannot exceed one. It is more likely that he divided by the mass of the ingredient instead of the mass of the mixture, or added ratios from two different streams." },
    { q: "A stream of A has the amount of 100 kg/h and its fraction is 0.20, and a stream of B has the amount of 50 kg/h pure water. What is the flow of solute inside the whole?",
      a: "<code dir=\"ltr\">100 × 0.20 = 20 kg/h</code> From A, and<code dir=\"ltr\">50 × 0 = 0</code> From B. Total 20 kg/h. This is the number you will use to balance the component in the next lesson." },
  ],
};
