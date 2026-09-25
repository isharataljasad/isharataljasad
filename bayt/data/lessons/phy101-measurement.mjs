/* درس بيت الفؤاد · PHY 101 · الوحدات والقياس.

   تنبيه على مصدر الموضوع: نطاق PHY 101 منشور، أما تقسيمه إلى المواضيع
   الثمانية فمقترح ولم يؤكَّد بمخطط المقرر. محتوى هذا الدرس قياسي في أي
   مقرر فيزياء أولى، لكن موضعه في الترتيب يبقى مقترحًا. */

/* الرسم: سلسلة التحويل بالكسور، والوحدات المحذوفة مشطوبة.
   الشطب هو الفكرة: الوحدة تُحذف كما يُحذف العدد، لا بالحفظ بل بالاختصار. */
const figure = `<svg viewBox="0 0 560 130" role="img" aria-labelledby="fig-units-title" class="bayt-svg">`
  + `<title id="fig-units-title">90 Conversion series Kilometers per hour to meters per second, repeating units crossed out</title>`
  + `<text x="80" y="66" font-size="17" fill="#153748" text-anchor="middle">90 km</text>`
  + `<line x1="40" y1="78" x2="120" y2="78" stroke="#284955" stroke-width="2"/>`
  + `<text x="80" y="102" font-size="17" fill="#153748" text-anchor="middle">1 h</text>`
  + `<text x="142" y="86" font-size="18" fill="#566f7a" text-anchor="middle">×</text>`
  + `<text x="215" y="66" font-size="17" fill="#153748" text-anchor="middle">1000 m</text>`
  + `<line x1="168" y1="78" x2="262" y2="78" stroke="#284955" stroke-width="2"/>`
  + `<text x="215" y="102" font-size="17" fill="#153748" text-anchor="middle">1 km</text>`
  + `<text x="284" y="86" font-size="18" fill="#566f7a" text-anchor="middle">×</text>`
  + `<text x="350" y="66" font-size="17" fill="#153748" text-anchor="middle">1 h</text>`
  + `<line x1="306" y1="78" x2="394" y2="78" stroke="#284955" stroke-width="2"/>`
  + `<text x="350" y="102" font-size="17" fill="#153748" text-anchor="middle">3600 s</text>`
  + `<text x="418" y="86" font-size="18" fill="#566f7a" text-anchor="middle">=</text>`
  + `<text x="480" y="86" font-size="19" fill="#10766f" text-anchor="middle">25 m/s</text>`
  /* الشطب على الوحدات المتكررة: km في بسط الأول ومقام الثاني، h بالعكس. */
  + `<line x1="82" y1="60" x2="112" y2="60" stroke="#c0392b" stroke-width="2"/>`
  + `<line x1="214" y1="96" x2="240" y2="96" stroke="#c0392b" stroke-width="2"/>`
  + `<line x1="82" y1="96" x2="96" y2="96" stroke="#c0392b" stroke-width="2"/>`
  + `<line x1="348" y1="60" x2="362" y2="60" stroke="#c0392b" stroke-width="2"/>`
  + `</svg>`;
/* الجمل الشارحة تركت اللوحة إلى التعليق تحتها: السطر العربي الطويل داخل
   SVG يمتد يسارًا من نقطة إرسائه فيخرج عن الحدود ويُقتطع. */

export default {
  course: 'phy101',
  topic: 'measurement',

  objectives: [
    "Convert between units in the order of conversion factors so that unwanted units are omitted.",
    "Determine the number of significant figures in a multiplication or division result, and round to it.",
    "Dimensional analysis is used to judge an equation before solving it.",
  ],

  boundaries: [
    "Calculating statistical uncertainty and standard deviation is not in this lesson.",
    "Error propagation by partial derivatives is not here.",
    "Addition and subtraction have a different significant number base than multiplication and division. "
      + "We have only discussed it here by reference.",
  ],

  prerequisites: [
    {
      title: "Decimal forces and scientific formula",
      why: "The prefixes are all forces of ten, so anyone who does not read 10⁻⁶ with confidence cannot convert between them.",
      recap: "A positive exponent means multiplication: 10³ = 1000. and a negative exponent means division: 10⁻³ = 0.001. "
        + "When the forces are multiplied, the exponents add : 10³ × 10⁻⁶ = 10⁻³. "
        + "The scientific form writes the number as a number between 1 and 10 multiplied by a power of ten, such as 7 × 10⁻⁵.",
    },
    {
      title: "Multiply and reduce fractions",
      why: "The conversion operator is a fraction, and the conversion series is the multiplication of fractions, and deletion in it is the same as contraction of fractions.",
      recap: "When multiplying fractions, the numerator is multiplied by the numerator and the denominator is multiplied by the denominator. Any factor appears in the numerator "
        + "And the denominator is removed : (3 × 5)/(5 × 7) = 3/7. The units are treated exactly like these factors, "
        + "km in the numerator and km in the denominator are eliminated.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Fundamental quantities in the international system",
        en: 'SI base quantities',
        text: "SI has seven base quantities. This course often uses length in metres (m), mass in kilograms (kg), and time in seconds (s). Derived units combine base units; for example, a newton is kg·m/s².",
      },
      {
        term: "Conversion factor",
        en: 'Conversion factor',
        text: "A fraction whose numerator and denominator represent the same expression in two different units, so its value is one. "
          + "Same as (1000 m)/(1 km), it is equal to 1 because 1000 m and 1 km are equal lengths. "
          + "Because it is equal to one, multiplying by it does not change the amount, but rather changes the unit with which we express it.",
      },
      {
        term: "Significant figure",
        en: 'Significant figure',
        text: "Significant figures indicate the precision represented by a measured value. Nonzero digits, zeros between significant digits, and trailing zeros after a decimal point following a nonzero digit are significant. Leading zeros are not. Thus 0.00340 has three significant figures: 3, 4 and the final 0.",
      },
      {
        term: "Distance",
        en: 'Dimension',
        text: "A dimension describes the kind of physical quantity independently of the chosen unit: length L, mass M and time T. Velocity has dimension L/T whether expressed in m/s or km/h. Quantities added together must have the same dimensions.",
      },
    ],
    relations: [
      {
        formula: '1 km = 10³ m ,  1 cm = 10⁻² m ,  1 μm = 10⁻⁶ m',
        name: "Common prefixes",
        note: "The prefix is a power of ten that is multiplied by the base unit, not a new unit.",
      },
      {
        formula: '[v] = L/T ,  [a] = L/T² ,  [F] = M·L/T²',
        name: "Dimensions of kinetic quantities",
        note: "It is derived from the definition: speed is displacement divided by time, and acceleration is speed divided by time.",
      },
      {
        formula: "The number of significant figures in the product of multiplication or division = is the least in the data",
        name: "Multiplication and division rule",
        note: "The result is no more accurate than the weakest measurement entered into it.",
      },
    ],
    derivation: {
      title: "Why is it permissible to multiply by the conversion factor without changing the quantity?",
      intro: "Multiplication usually changes the amount, so how can we multiply and nothing changes? The answer is in the value of the factor itself.",
      steps: [
        {
          do: "Depart from the known equality 1 h = 3600 s.",
          why: "This is not a conversion rule but a fact about time: the two durations are the same, and the two expressions are different.",
        },
        {
          do: "Divide both sides by 1 h and you get 1 = (3600 s)/(1 h).",
          why: "Dividing an amount by itself gives one, so the resulting fraction has a value of one, nothing more and nothing less.",
        },
        {
          do: "Multiply your quantity by this fraction, or by its reciprocal (1 h)/(3600 s).",
          why: "Multiplying by one does not change the amount. The reciprocal also equals one, so you can choose which one.",
        },
        {
          do: "Choose an orientation that places the unit to be deleted opposite its current position.",
          why: "Here the common error occurs: both factors are correct, and the direction alone is what eliminates or doubles the unit.",
        },
      ],
    },
  },

  visual: {
    title: "Cancel units using conversion factors",
    figure: {
      svg: figure,
      caption: "The series for converting 90 km/h to m/s. The crossed-out unit appeared in the numerator and denominator and was deleted just as a number is deleted, and what remains without crossing out is the unit of the result and your evidence of the correct order of the factors.",
      alt: "Three fractions multiplied together, then the equal sign and the result. The first fraction is ninety kilometers per hour, "
        + "The second is one thousand meters divided by one kilometre, and the third is one hour divided by three thousand six hundred seconds. "
        + "The result is twenty-five meters per second. The word kilometer is crossed out in the numerator of the first and the denominator of the second. "
        + "The word hour is crossed out in the denominator of the first and the numerator of the third, so only the meter and the second are left uncrossed.",
    },
    table: {
      caption: "The prefixes you will encounter in this course",
      head: ["Prefix", "Symbol", "Factories", "Example"],
      rows: [
        ["Kilo", 'k', '10³', '1 km = 1000 m'],
        ["My year", 'c', '10⁻²', '1 cm = 0.01 m'],
        ["Millie", 'm', '10⁻³', '1 mm = 0.001 m'],
        ["Micro", 'μ', '10⁻⁶', '1 μm = 0.000001 m'],
        ["Nano", 'n', '10⁻⁹', '1 nm = 10⁻⁹ m'],
      ],
    },
    reading: "Note that the symbol m denotes “millie” when it precedes a unit, and “meter” when it is the unit itself. "
      + "mm is millimeters, and ms is milliseconds. Mixing between “micro” and “micro” changes the result a thousand times. "
      + "This is the most frequent mistake in this lesson.",
  },

  guided: {
    start: "Start by writing down what you have and what you want in their units. Then arrange the conversion factors so that each unit falls into place "
      + "Undesirable, sometimes in the numerator and sometimes in the denominator. Do not calculate any number before you are sure that the units are "
      + "The remainder is exactly what is required; The units detect an error in the arrangement before it costs you the calculation.",
    workedExamples: [
      {
        title: "Example 1 · conversion speed",
        task: "Convert 90 km/h to m/s.",
        steps: [
          {
            do: "Write down the requirement: We want m in the numerator and s in the denominator, and we have km in the numerator and h in the denominator.",
            why: "Setting the goal in units makes selecting factors a decision rather than a guess.",
          },
          {
            do: "To remove km from the numerator, multiply by (1000 m)/(1 km).",
            why: "km is now in the numerator, so we put it in the denominator to cancel out, and m comes in its place.",
          },
          {
            do: "To remove h from the denominator, multiply by (1 h)/(3600 s).",
            why: "h is in the denominator, so we put it in the numerator to cancel out, and s is inserted in the denominator.",
          },
          {
            do: "Calculate : 90 × 1000 ÷ 3600 = 25, and the remaining unit is m/s.",
            why: "The calculation is the last step because the units have proven the correctness of the arrangement before it.",
          },
        ],
        answer: '25 m/s',
      },
      {
        title: "Example 2 · Significant numbers in division",
        task: "Sample mass 12.5 g and volume 4.1 cm³. Calculate the density.",
        steps: [
          {
            do: "Swear: 12.5 ÷ 4.1 = 3.0487..",
            why: "We calculate first with all the numbers, then we round at the limit, not at every step.",
          },
          {
            do: "Count the significant figures: 12.5 has three, and 4.1 has two.",
            why: "The rule looks at the weakest data, so the outcome is governed by the least.",
          },
          {
            do: "Round to two significant figures: 3.0 g/cm³.",
            why: "Writing 3.0487 claims accuracy that the measurement did not give; The extra number is fabricated information.",
          },
        ],
        answer: '3.0 g/cm³',
      },
    ],
    skipped: [
      {
        q: "Why do we write 3.0 and not 3 when their values are equal?",
        a: "Because they are not equal to the declared accuracy,. 3 has one significant digit, which means that the value is approximately between 2.5 and 3.5. "
          + "3.0 has two numbers, meaning it is between 2.95 and 3.05. The zero here is information, not embellishment.",
      },
      {
        q: "How do I know the order of the conversion factors is wrong before I calculate?",
        a: "Look at the remaining units. If km·h remains or a square unit appears that you did not request, the order is reversed. "
          + "This is the benefit of writing units at each step: it detects the error before the calculation.",
      },
      {
        q: "Does dimensional analysis prove the validity of the equation?",
        a: "No. It reveals error and does not prove what is correct. An equation whose dimensions are consistent may be wrong in a numerical factor. "
          + "Like x = v·t and x = 2v·t, their dimensions are the same and one of them is wrong. "
          + "The difference in dimensions alone is sufficient to definitively rule that there is an error.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'convert-speed',
      family: "The first type is a compound transformation",
      aim: "Arranging two factors in two different directions in one problem.",
      objectives: [0],
      prompt: "Convert 108 km/h to m/s.",
      unit: 'm/s',
      answer: 30,
      tolerance: 0.05,
      solution: "108 × (1000 m / 1 km) × (1 h / 3600 s)., km and h are deleted, leaving m/s. "
        + "And the account is 108 × 1000 ÷ 3600 = 30.",
      commonErrors: [
        { value: 388.8, why: "You multiplied by 3.6 instead of dividing by it. A quick rule is to divide by 3.6 "
          + "When moving from km/h to m/s, because a meter is smaller than a kilometer while a second is smaller than an hour." },
        { value: 108000, why: "You converted kilometers into meters and forgot to convert hours into seconds. "
          + "Your result is m/h, not m/s. Check the remaining units before calculating." },
        { value: 1.8, why: "You divided 60 only once. An hour is sixty minutes and a minute is sixty seconds. "
          + "The clock is 3600, not 60." },
      ],
    },
    {
      id: 'sig-figs',
      family: "The second type: Significant numbers",
      aim: "Decide how many numbers you are allowed to write in the output.",
      objectives: [1],
      prompt: "Mass of 24.8 g and volume of 6.0 cm³. Calculate the density in whole significant figures, "
        + "Write the result as a number.",
      unit: 'g/cm³',
      answer: 4.1,
      tolerance: 0.01,
      solution: "24.8 ÷ 6.0 = 4.1333.. in 24.8 there are three significant figures and in 6.0 there are two significant figures, "
        + "The result has two significant figures : 4.1 g/cm³.",
      commonErrors: [
        { value: 4.13, why: "You kept three or more significant figures, and perhaps wrote the machine's output as is. "
          + "The given 6.0 has only two numbers, and the result is not more accurate than the weakest measurement entered into it. "
          + "The machine does not know the accuracy of your measurement; The approximation is your decision." },
        { value: 4, why: "You rounded to one significant figure. The minimum data contains two numbers, not one." },
        { value: 0.242, why: "You divide the volume by the mass. density mass over volume, "
          + "The unit of your output is cm³/g, which is the reciprocal of density." },
      ],
    },
    {
      id: 'dimensions',
      family: "The third type: Dimensional analysis",
      aim: "Decomposition of a complex unit into its basic units.",
      objectives: [2],
      prompt: "Pressure is force divided by area. If we express the unit pressure in terms of kg, m and s only, "
        + "What is the exponent of the meter in this expression? Write the number with a sign.",
      unit: "Exponent",
      answer: -1,
      tolerance: 0.01,
      solution: "The force is kg·m/s², the area is m²., and the pressure is kg·m/(s²·m²) = kg/(m·s²). "
        + "The meter becomes in the denominator with one power, its exponent is −1.",
      commonErrors: [
        { value: 1, why: "You took the power of the meter from the power alone and neglected to divide the area. "
          + "The area m² in the denominator reduces the exponent from +1 to −1." },
        { value: -2, why: "This is the power of the second, not the power of the meter. The expression is kg·m⁻¹·s⁻², so pay attention to which letter you read." },
        { value: 2, why: "You put the area in the numerator. Pressure is a force over an area, so area is the denominator." },
      ],
    },
    {
      id: 'prefix',
      family: "Fourth style · Prefixes",
      aim: "The prefix is read with its integer modulus without confusion between milli and micro.",
      objectives: [0],
      prompt: "What is the thickness of 250 μm. plate in metres?",
      unit: 'm',
      answer: 0.00025,
      tolerance: 0.0000005,
      solution: "μ means 10⁻⁶, then 250 μm = 250 × 10⁻⁶ m = 2.5 × 10⁻⁴ m = 0.00025 m.",
      commonErrors: [
        { value: 0.25, why: "You read the code μ as “Milly.” Miele 10⁻³ and Micro 10⁻⁶, "
          + "The difference between them is a thousand fold." },
        { value: 2.5, why: "You used “centi» 10⁻²” instead of “micro”." },
        { value: 0.00000025, why: "You used “Nano » 10⁻⁹” instead of “Micro » 10⁻⁶.”." },
      ],
    },
    {
      id: 'consistency',
      family: "Fifth pattern: Consistency of units before substitution",
      aim: "Unite units before using any equation, not after.",
      objectives: [0],
      prompt: "An object moves at a constant speed 15 m/s for a period of 4.0 minutes. What is the distance traveled in metres?",
      unit: 'm',
      answer: 3600,
      tolerance: 1,
      solution: "The equation x = v·t requires the time in seconds because the speed is in m/s. "
        + "4.0 min = 240 s, the distance is 15 × 240 = 3600 m.",
      commonErrors: [
        { value: 60, why: "You are compensated directly in minutes. Speed ​​is in m/s, time should be in seconds; "
          + "Your output unit is m·min/s, which is not a space." },
        { value: 216000, why: "You converted minutes to seconds twice, or multiplied by 3600 instead of 240." },
        { value: 900, why: "You multiplied 15 by 60 and calculated a distance of one minute, not four." },
      ],
    },
  ],
};
