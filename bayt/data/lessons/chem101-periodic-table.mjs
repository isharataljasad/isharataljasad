/* درس بيت الفؤاد · CHEM 101 · الجدول الدوري والاتجاهات. */

/* الرسم: شبكة مبسّطة عليها سهما الاتجاه.
   الشبكة مجرّدة عمدًا: المقصود الاتجاه لا أسماء العناصر. */
const cells = (() => {
  const out = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      /* تدرّج اللون يحاكي تناقص نصف القطر عبر الدورة. */
      const shade = ['#dbe9f0', '#cfe3ec', '#c2dde8', '#b6d7e4', '#a9d1e0', '#9dcbdc', '#90c5d8'][c];
      out.push(`<rect x="${80 + c * 40}" y="${60 + r * 30}" width="40" height="30" `
        + `fill="${shade}" stroke="#7fa5b5" stroke-width="1"/>`);
    }
  }
  return out.join('');
})();

const figure = `<svg viewBox="0 0 480 250" role="img" aria-labelledby="fig-trend-title" class="bayt-svg">`
  + `<title id="fig-trend-title">A grid representing the periodic table with a horizontal arrow and a vertical arrow showing the directions of radius and ionization energy</title>`
  + cells
  /* السهم الأفقي: عبر الدورة. */
  + `<line x1="80" y1="44" x2="350" y2="44" stroke="#c0392b" stroke-width="3"/>`
  + `<polyline points="342,37 354,44 342,51" fill="none" stroke="#c0392b" stroke-width="3"/>`
  + `<text x="220" y="28" font-size="14" fill="#c0392b" text-anchor="middle">Across a period: smaller radius, higher ionization energy</text>`
  /* السهم الرأسي: أسفل المجموعة. */
  + `<line x1="64" y1="60" x2="64" y2="170" stroke="#10766f" stroke-width="3"/>`
  + `<polyline points="57,162 64,174 71,162" fill="none" stroke="#10766f" stroke-width="3"/>`
  + `<text x="240" y="206" font-size="14" fill="#10766f" text-anchor="middle">Below the group: the radius increases and the ionization energy decreases</text>`
  + `<text x="240" y="232" font-size="13" fill="#566f7a" text-anchor="middle">The reason in both cases is the same: the effective nuclear charge</text>`
  + `</svg>`;

export default {
  course: 'chemistry',
  topic: 'periodic-table',

  objectives: [
    "The period and number of valence electrons are determined from the atomic number.",
    "The effective nuclear charge is approximately calculated from the atomic number and the number of blocking electrons.",
    "Compares two elements in radius and ionization energy based on effective nuclear charge.",
  ],

  boundaries: [
    "The anomalies in the electron configuration of some transition elements are not in this lesson.",
    "Successive ionization energies and the interpretation of their jumps are beyond the scope here.",
    "Magnetic properties and their relationship to single electrons are not here.",
    "Slater's exact rules for calculating effective charge outside the range; We use simple approximation.",
  ],

  prerequisites: [
    {
      title: "Atomic number and number of electrons",
      why: "Everything in this lesson is based on the number and arrangement of electrons, which come from the atomic number.",
      recap: "The atomic number Z is the number of protons, and is equal to the number of electrons in a neutral atom. "
        + "Chlorine Z = 17 has seventeen electrons. "
        + "As for the ion, its number of electrons is Z, with a minus charge.",
      href: '/semester-1/chemistry/atomic-structure/',
      hrefLabel: "Lesson on the structure of the atom",
    },
    {
      title: "Arrangement of electrons in levels",
      why: "The period is the number of the last level, and the group is determined by the electrons of that level; "
        + "Whoever does not arrange the electrons does not read the location of the element.",
      recap: "The first level holds two electrons, the second has eight, and the third has eight in the first elements. "
        + "For sodium, Z = 11 and the shell arrangement is 2, 8, 1: three occupied shells place it in period 3, "
        + "And one electron at the end, so it is in the first group. "
        + "and sulfur, Z = 16, has the shell arrangement 2, 8, 6: period 3 with six valence electrons.",
    },
  ],

  reference: {
    definitions: [
      {
        term: "Period",
        en: "Period",
        text: "A period is a horizontal row of the periodic table. In the main-group examples used here, the period identifies the highest occupied principal shell. Moving across a period changes nuclear charge and valence-electron count.",
      },
      {
        term: "Group",
        en: 'Group',
        text: "A vertical column, and its elements are similar in the number of valence electrons and thus in chemical behavior. "
          + "This similarity is why the table is arranged in the first place: chemistry is governed by valence electrons.",
      },
      {
        term: "Blocking",
        en: 'Shielding',
        text: "The inner electrons shield part of the nucleus's attraction from the valence electrons. "
          + "The outer electron does not feel all the charge of the nucleus, but rather what remains of it after the inner electrons block it.",
      },
      {
        term: "Effective nuclear charge",
        en: 'Effective nuclear charge (Z_eff)',
        text: "The net attraction felt by a valence electron is : Z_eff ≈ Z − S, where S is the number of blocking electrons. "
          + "It is the key that explains all the table trends in this lesson.",
      },
      {
        term: "Atomic radius",
        en: 'Atomic radius',
        text: "Atomic radius describes atomic size using a stated convention, such as half the distance between two bonded identical atoms. Across a main-group period it generally decreases as effective nuclear attraction increases. Down a group it generally increases as additional shells are occupied.",
      },
      {
        term: "Ionization energy",
        en: 'Ionization energy',
        text: "First ionization energy is the energy required to remove an electron from a gaseous ground-state atom. It generally increases across a main-group period and decreases down a group, with exceptions explained by electron configurations. Radius alone does not determine every comparison.",
      },
    ],
    relations: [
      {
        formula: 'Z_eff ≈ Z − S',
        name: "Effective charge",
        note: "A simple approximation: S is the number of inner electrons.",
      },
      {
        formula: "Cross course: Z_eff ↑, radius ↓, IE ↑",
        name: "Horizontal direction",
        note: "The level is the same, the charge increases, so the attraction increases.",
      },
      {
        formula: "Bottom group: n ↑, radius ↑, IE ↓",
        name: "Vertical direction",
        note: "A new level is further away and the blocking is greater, so the attraction weakens.",
      },
    ],
    derivation: {
      title: "Why does an atom get smaller as we add electrons through the cycle?",
      intro: "The result appears to be inverted: we add electrons and the volume becomes smaller. The reason is that the addition does not occur alone.",
      steps: [
        {
          do: "Go from sodium Z = 11 to chlorine Z = 17 in the third cycle.",
          why: "Comparison within a single cycle fixes the number of levels and isolates the effect of charge alone.",
        },
        {
          do: "Note that the added electrons enter **the same level**, not a new level.",
          why: "The distance from the nucleus does not increase by adding a level; This is the difference from going down in a group.",
        },
        {
          do: "The number of internal electrons remained ten in both, so the blocking remained almost unchanged. "
            + "While the protons increased by six.",
          why: "The electrons of the same level mask each other weakly, so the increase in charge appears net in Z_eff.",
        },
        {
          do: "Z_eff rises from 1 to 7, and gravity pulls the cloud inward, making the radius smaller.",
          why: "volume is not determined by the number of electrons, but by the intensity of attraction on them. "
            + "This is why the chlorine atom is smaller than the sodium atom, even though it contains more electrons.",
        },
      ],
    },
  },

  visual: {
    title: "Two arrows explained by one reason",
    figure: {
      svg: figure,
      caption: "Throughout the cycle, Z_eff rises, the radius becomes smaller, and the ionization energy increases. "
        + "Below the group, a level is added, the blocking increases, the radius increases, and the ionization energy decreases.",
      alt: "A grid of rectangles representing the periodic table simplified, and its color gets darker as we move to the right. "
        + "Above it is a red horizontal arrow pointing to the right, and above it is a statement saying that the radius decreases and the ionization energy increases throughout the period. "
        + "To its left is a green vertical arrow pointing down, and under the grid is a phrase saying that the radius increases "
        + "The ionization energy decreases down the group. A final line mentions that the reason in both cases is the effective nuclear charge.",
    },
    table: {
      caption: "Four elements: location, effective charge, and volume",
      head: ["Item", 'Z', "Distribution", "Course", "Blocking electrons", "Z_eff approx"],
      rows: [
        ['Na', '11', '2, 8, 1', '3', '10', '1'],
        ['Mg', '12', '2, 8, 2', '3', '10', '2'],
        ['S', '16', '2, 8, 6', '3', '10', '6'],
        ['Cl', '17', '2, 8, 7', '3', '10', '7'],
      ],
    },
    reading: "Read the last two columns together: Blocking holds at ten at four, and Z_eff goes from one to seven. "
      + "This is the reason why the chlorine atom is smaller than sodium, even though it has more electrons. "
      + "Note that the number of valence electrons is equal to Z_eff in this approximation, and this is a coincidence that is useful for memorization and not a general rule.",
  },

  guided: {
    start: "Start from the atomic number and distribute the electrons : 2, then 8, then 8. "
      + "The number of occupied levels is the period, and the number of electrons of the last level is the valence electrons. "
      + "Then calculate Z_eff = Z − S where S is the sum of electrons in the internal levels. "
      + "Then every comparison became easy: a larger Z_eff in the same cycle means a smaller atom and greater ionization energy.",
    workedExamples: [
      {
        title: "Example 1 · The location of an item and its effective charge",
        task: "For the element Z = 16., determine its period, number of valence electrons, and approximately its effective nuclear charge.",
        steps: [
          {
            do: "Distribute the electrons: 2, 8, 6.",
            why: "The first level accommodates two, the second eight, leaving six for the third. "
              + "Distribution is the source of everything that follows it.",
          },
          {
            do: "The number of occupied levels is three, so the element is in the third cycle.",
            why: "The period is the number of the highest level occupied, neither the number of electrons nor the atomic number.",
          },
          {
            do: "The last level has six electrons, so they are valence electrons.",
            why: "It determines the chemical behavior and location of the element in the group.",
          },
          {
            do: "Blocking S = 2 + 8 = 10, Z_eff ≈ 16 − 10 = 6.",
            why: "Inner electrons alone are shielding; The electrons of the same level are weakly shielded and we neglect them.",
          },
        ],
        answer: 'Period 3, six valence electrons, Z_eff ≈ 6',
      },
      {
        title: "Example 2 · Comparing two sizes",
        task: "Which is smaller: the sodium atom Z = 11 or the chlorine atom Z = 17? And why?",
        steps: [
          {
            do: "They are both in the third period, and each has ten inner electrons.",
            why: "Fixing the cycle isolates the effect of charge; Otherwise, the effect of adding a level would be mixed with the effect of increasing the protons.",
          },
          {
            do: "Z_eff(Na) ≈ 1 and Z_eff(Cl) ≈ 7.",
            why: "The difference is seven times in net attraction, which is a huge difference that cannot be neglected.",
          },
          {
            do: "Chlorine is smaller because a stronger attraction pulls the electron cloud inward.",
            why: "This is despite the fact that chlorine contains six more electrons; "
              + "The volume is determined by the intensity of attraction, not the number of electrons.",
          },
        ],
        answer: 'Cl is smaller (Z_eff 7 vs 1)',
      },
    ],
    skipped: [
      {
        q: "Why don't we count the electrons of the same level among the blocking?",
        a: "Because it is located on average at the same distance from the nucleus, not between the electron and the nucleus. "
          + "Its blocking is weak. The simple approximation neglects it completely. "
          + "Slater's rules give it a small weight of about 0.35 per electron, which is beyond the scope of this lesson.",
      },
      {
        q: "Is the ion the volume of its atom?",
        a: "No. A positive ion is always smaller than its atom: it has lost an electron, so the repulsion is reduced, and perhaps an entire level is lost. "
          + "The negative ion is larger than its atom: it gained an electron, increasing the repulsion, while the protons remained the same. "
          + "The same attraction is distributed among more electrons.",
      },
      {
        q: "Are the trends consistent without exception?",
        a: "No. There are known exceptions to the ionization energy, such as the ionization energy of aluminum being lower than that of magnesium "
          + "Even though he is later in the course. It is caused by the structure of the sublevels and not the effective charge alone. "
          + "Its details are beyond the scope of this lesson. The trend is a general rule, not a law without exception.",
      },
    ],
  },

  questionTypes: [
    {
      id: 'zeff-na',
      family: "Type I: Effective nuclear charge",
      aim: "Blocking electrons are subtracted from the atomic number.",
      objectives: [1],
      prompt: "Sodium has an atomic number of 11 and a distribution of 2, 8, 1. "
        + "What is approximately its effective nuclear charge?",
      unit: "charge",
      answer: 1,
      tolerance: 0.1,
      solution: "The blocking electrons are internal : 2 + 8 = 10. "
        + "Z_eff ≈ 11 − 10 = 1.",
      commonErrors: [
        { value: 11, why: "You wrote the entire nuclear charge. The outer electron does not feel all of it "
          + "Because the internal electrons block part of it." },
        { value: 10, why: "You wrote the number of blocking electrons. It is the subtract, not the result." },
        { value: 21, why: "You added instead of subtracting. Blocking reduces net attraction, not increases it." },
      ],
    },
    {
      id: 'period',
      family: "The second type: Determine the course",
      aim: "Count levels, not electrons.",
      objectives: [0],
      prompt: "An element with atomic number 16. is in which period it occurs?",
      unit: "Course number",
      answer: 3,
      tolerance: 0.1,
      solution: "Distribution 2, 8, 6 There are three occupied levels, and the element is in the third cycle.",
      commonErrors: [
        { value: 16, why: "You wrote the atomic number. The period number is the highest occupied level, not the number of electrons." },
        { value: 6, why: "You wrote the number of valence electrons. This defines the group, not the course." },
        { value: 2, why: "You only counted completely filled levels. "
          + "The third level is occupied, even if it is not full, it is counted." },
      ],
    },
    {
      id: 'valence',
      family: "The third type: valence electrons",
      aim: "You read the last level alone.",
      objectives: [0],
      prompt: "An element with atomic number 13., how many valence electrons does it have?",
      unit: "Electron",
      answer: 3,
      tolerance: 0.1,
      solution: "The distribution is 2, 8, 3, so there are three electrons in the last level.",
      commonErrors: [
        { value: 13, why: "You wrote the entire atomic number. Valence electrons are the electrons of the last level alone." },
        { value: 10, why: "You wrote inner electrons. It is the obscured, not the equal." },
        { value: 8, why: "You wrote the capacity of the level, not what was actually occupied with it." },
      ],
    },
    {
      id: 'compare-zeff',
      family: "The fourth type: Comparing two items",
      aim: "Isolate the effect of charge by stabilizing the cycle.",
      objectives: [1, 2],
      prompt: "Sodium Z = 11 and chlorine Z = 17, both in the third period and have ten inner electrons. "
        + "How much greater is the effective nuclear charge of chlorine than that of sodium?",
      unit: "charge",
      answer: 6,
      tolerance: 0.1,
      solution: "Z_eff(Cl) = 17 − 10 = 7 and Z_eff(Na) = 11 − 10 = 1, 6. difference "
        + "This is why the chlorine atom is smaller and its ionization energy is greater, even though it has more electrons.",
      commonErrors: [
        { value: 28, why: "You added the two atomic numbers. What is required is the difference between two effective charges, not their sum." },
        { value: 7, why: "You wrote Z_eff for chlorine alone. The amount of increase required, i.e. the difference between the two values." },
        { value: 20, why: "You subtracted the blocking electrons twice, or calculated 17 − 11 + 10." },
      ],
    },
    {
      id: 'shielding',
      family: "Type 5: Counting the blocking electrons",
      aim: "Separates the interior from the exterior.",
      objectives: [1],
      prompt: "An element with atomic number 15 and distribution 2, 8, 5. How many electrons does it block?",
      unit: "Electron",
      answer: 10,
      tolerance: 0.1,
      solution: "Blocking from internal levels alone: 2 + 8 = 10. "
        + "The five in the last level are valence electrons, and we neglect to block them in this approximation.",
      commonErrors: [
        { value: 15, why: "You counted all the electrons. The electron does not obscure itself, "
          + "The last level electrons are not blocking in this approximation." },
        { value: 5, why: "You counted the valence electrons. She is the veiled one, not the veiled one." },
        { value: 2, why: "You counted the first level alone. Blocking includes all internal levels." },
      ],
    },
  ],
};
