/* ==========================================================================
   program/concepts.mjs — the shared teaching spine.

   One editable registry that gives every teachable idea a stable identity and
   connects it across the whole site:

     strand/semester -> course -> unit -> concept -> prerequisites
                                            |-> approach treatments (1, 2, 3)
                                            |-> source episodes (evidence)
                                            |-> related resources

   A `concept id` never changes and never encodes placement, so a concept can
   move between units or gain an approach without breaking a link, a bookmark
   or saved student progress.

   WHAT IS NOT IN HERE
   - Units and episodes are not listed. They are derived in
     tools/build-curriculum.mjs from foundations/reading/catalog.json, which is
     the single source of truth for the 296 catalogued episodes. Naming them
     twice would let the two copies drift.
   - Nothing here asserts that a concept is taught. The builder checks the
     filesystem for each approach's page and reports what actually exists.
   ========================================================================== */

/* The three student-facing approaches. Names stay neutral: a student chooses a
   way of learning, not a publisher. Which underlying material informed a
   treatment is recorded per concept in `evidence`, not in the label. */
export const approaches = [
  {
    number: 1,
    name: 'Curriculum reference',
    short: 'Reference',
    purpose: 'Where the idea belongs, precise definitions, the conditions that make it valid, and a compact table to check against.',
    bestFor: 'Revising, or checking a definition or restriction quickly.',
  },
  {
    number: 2,
    name: 'Guided practice',
    short: 'Practice',
    purpose: 'Distinct problem types, a decision to make, feedback that names the specific mistake, and a changed case to retry.',
    bestFor: 'You understand the idea and want to find out where your reasoning breaks.',
  },
  {
    number: 3,
    name: 'Written teaching guide',
    short: 'Full guide',
    purpose: 'A complete lesson built from the beginning, readable on its own without watching anything.',
    bestFor: 'Meeting the idea for the first time, or rebuilding it after a gap.',
  },
];

/* Strand ids used by Foundations. Programme concepts use their course area. */
export const strands = [
  { id: 'basic-math', group: 'Basic Math', tracks: ['BM'] },
  { id: 'algebra', group: 'Algebra', tracks: ['A1', 'A2'] },
  { id: 'geometry', group: 'Geometry', tracks: ['GE'] },
  { id: 'trigonometry', group: 'Trigonometry', tracks: ['TR'] },
];

/* Basic Math and Trigonometry episodes are numbered, not named, in the source
   catalogue, so their units have no title to derive. These names describe what
   the episodes in each chapter actually cover; they are editorial groupings for
   navigation, not official syllabus units. */
export const unitNames = {
  'BM/01': 'Whole numbers, decimals and expressions',
  'BM/02': 'Factors, fractions and equivalence',
  'BM/03': 'Fraction arithmetic and units of measure',
  'BM/04': 'Integers and signed arithmetic',
  'BM/05': 'Writing and solving one-step equations',
  'BM/06': 'Ratio, proportion and scale',
  'BM/07': 'Percent and its applications',
  'BM/08': 'Plane figures, angles and area',
  'BM/09': 'Solids, volume and surface area',
  'BM/10': 'Data displays and the coordinate plane',
  'BM/11': 'Counting and probability of events',
  'TR/1': 'Angles and the circular functions',
  'TR/2': 'Trigonometric identities',
  'TR/3': 'Solving triangles and vectors',
  'TR/4': 'Polar form and complex numbers',
};

/* --------------------------------------------------------------------------
   Concepts.

   `approaches` maps an approach number to the page that teaches it. A number
   that is absent means that treatment has not been written; the builder will
   show it as a gap rather than inventing a link. An entry whose `href` points
   at a page that does not exist fails the build.

   `evidence` names the material consulted when the treatment was written. It
   records provenance for review. No publisher prose, transcript, figure or
   question bank is reproduced anywhere on the site.
   -------------------------------------------------------------------------- */
export const concepts = [
  {
    id: 'ALG-FUNCTION-01',
    slug: 'functions-and-domain',
    title: 'Functions and allowed inputs',
    summary: 'Decide whether one input has two outputs, then find the inputs a formula permits.',
    strand: 'algebra',
    unit: 'A1/Functions',
    episodes: [['A1', '14'], ['A1', '15']],
    courses: ['MA101'],
    prerequisites: ['ALG-VARIABLE-01', 'GEO-COORDINATE-01'],
    next: [],
    hub: '/foundations/models/functions-and-domain/',
    approaches: {
      1: '/foundations/models/functions-and-domain/foundation-1/',
      2: '/foundations/models/functions-and-domain/foundation-2/',
      3: '/foundations/models/functions-and-domain/foundation-3/',
    },
    evidence: 'Local MATH-BOK.docx section on functions and allowed inputs; local MATH-PEA.docx section on functions, domains and piecewise rules; supplied Algebra 1 episodes 14 and 15.',
    verified: {
      on: '2026-09-21',
      checks: [
        'every domain and endpoint substitution recomputed by hand',
        'the parabola SVG matches y = x²/2 to 2e-15 over 1001 sampled points',
        'both misconception replies and the changed case driven in the browser',
        'vertical-line explorer checked at x = 0 and at both tangent endpoints',
      ],
    },
    gaps: ['Piecewise and composite functions are separate concepts and are not covered'],
  },
  {
    id: 'ALG-VARIABLE-01',
    slug: 'variables-and-expressions',
    title: 'Variables and expressions',
    summary: 'Read a letter as a stand-in for a number, and an expression as an instruction.',
    strand: 'algebra',
    unit: 'A1/Basic Concepts',
    episodes: [['A1', '01']],
    courses: ['MA101'],
    prerequisites: ['BM-ORDER-01'],
    next: ['ALG-FUNCTION-01', 'CE-MATBAL-01'],
    hub: '/foundations/concepts/variables-and-expressions/',
    approaches: {
      1: '/foundations/concepts/variables-and-expressions/approach-1/',
      2: '/foundations/concepts/variables-and-expressions/approach-2/',
      3: '/foundations/reading/algebra/variables-and-expressions/',
    },
    evidence: 'Supplied Algebra 1 episode 01.',
  },
  {
    id: 'GEO-COORDINATE-01',
    slug: 'coordinate-plane',
    title: 'The coordinate plane',
    summary: 'Locate a point from an ordered pair, and read a quadrant from the signs.',
    strand: 'geometry',
    unit: 'GE/Tools of Geometry',
    episodes: [['GE', '01']],
    courses: ['MA101'],
    prerequisites: ['BM-INTEGER-01'],
    next: ['ALG-FUNCTION-01', 'GEO-INCIDENCE-01', 'TRIG-ANGLE-01'],
    hub: '/foundations/concepts/coordinate-plane/',
    approaches: {
      1: '/foundations/concepts/coordinate-plane/approach-1/',
      2: '/foundations/concepts/coordinate-plane/approach-2/',
      3: '/foundations/reading/geometry/coordinate-plane/',
    },
    evidence: 'Supplied Geometry episode 01.',
  },
  {
    id: 'GEO-INCIDENCE-01',
    slug: 'points-lines-and-planes',
    title: 'Points, lines and planes',
    summary: 'Name ideal objects correctly and state exactly which points two of them share.',
    strand: 'geometry',
    unit: 'GE/Tools of Geometry',
    episodes: [['GE', '02']],
    courses: ['MA101', 'CE202'],
    prerequisites: ['GEO-COORDINATE-01'],
    next: ['GEO-SEGMENT-01'],
    hub: '/foundations/concepts/points-lines-and-planes/',
    approaches: {
      1: '/foundations/concepts/points-lines-and-planes/approach-1/',
      2: '/foundations/concepts/points-lines-and-planes/approach-2/',
      3: '/foundations/reading/geometry/points-lines-and-planes/',
    },
    evidence: 'Supplied Geometry episode 02, cross-checked against the coordinate-plane chapter for shared notation.',
    verified: {
      on: '2026-09-21',
      checks: [
        'incidence and determination rules checked against their stated conditions',
        'all eight table-of-contents anchors resolve on each new route',
        'all three routes reachable from each other; current route marked',
        'five scrollable tables focusable and in the tab order at 375px',
        'no horizontal overflow at 375px; single h1 per page',
      ],
    },
    gaps: ['Segment and angle measure, congruence and proof technique are later concepts', 'The reference and practice routes carry no diagram; the written guide supplies all four'],
  },
  {
    id: 'GEO-SEGMENT-01',
    slug: 'measuring-segments',
    title: 'Measuring segments',
    summary: 'Give a line coordinates, read distance as a difference, and decide betweenness by measurement.',
    strand: 'geometry',
    unit: 'GE/Tools of Geometry',
    episodes: [['GE', '03']],
    courses: ['MA101', 'CE202'],
    prerequisites: ['GEO-INCIDENCE-01', 'BM-INTEGER-01'],
    next: ['GEO-MIDPOINT-01'],
    hub: '/foundations/concepts/measuring-segments/',
    approaches: {
      1: '/foundations/concepts/measuring-segments/approach-1/',
      2: '/foundations/concepts/measuring-segments/approach-2/',
      3: '/foundations/reading/geometry/measuring-segments/',
    },
    evidence: 'Supplied Geometry episode 03, written to follow the naming chapter and to reuse absolute value from Basic Math 04.1.',
    verified: {
      on: '2026-09-21',
      checks: [
        'all six answers recomputed, including both negative-coordinate subtractions',
        'the solve-and-check question re-solved and both parts confirmed positive',
        'the betweenness pair checked in both directions (16 holds, 15 fails)',
      ],
    },
    gaps: ['Reference and guided-practice routes not written', 'Distance between two points in the plane belongs to the coordinate-geometry unit'],
  },
  {
    id: 'GEO-MIDPOINT-01',
    slug: 'midpoints-and-congruence',
    title: 'Midpoints and segment congruence',
    summary: 'Average endpoints to locate a midpoint, recover a missing endpoint, and use ≅ against = correctly.',
    strand: 'geometry',
    unit: 'GE/Tools of Geometry',
    episodes: [['GE', '04']],
    courses: ['MA101'],
    prerequisites: ['GEO-SEGMENT-01'],
    next: ['GEO-ANGLE-01'],
    hub: '/foundations/concepts/midpoints-and-congruence/',
    approaches: {
      1: '/foundations/concepts/midpoints-and-congruence/approach-1/',
      2: '/foundations/concepts/midpoints-and-congruence/approach-2/',
      3: '/foundations/reading/geometry/midpoints-and-congruence/',
    },
    evidence: 'Supplied Geometry episode 04. The averaging-versus-subtracting contrast was written because it is the error the previous chapter sets up.',
    verified: {
      on: '2026-09-21',
      checks: [
        'every midpoint recomputed and checked equidistant from both endpoints',
        'the backwards endpoint problem solved twice, by formula and by repeated move, with matching results',
        'bisector counts checked against the definition, including the single perpendicular case',
      ],
    },
    gaps: ['Reference and guided-practice routes not written', 'Perpendicularity is only named here; it is defined in the angles chapter'],
  },
  {
    id: 'GEO-ANGLE-01',
    slug: 'angles-geometry',
    title: 'Angles',
    summary: 'Name an angle unambiguously, measure it in degrees, add measures, and ignore how long the arms are drawn.',
    strand: 'geometry',
    unit: 'GE/Tools of Geometry',
    episodes: [['GE', '05']],
    courses: ['MA101', 'PHY101'],
    prerequisites: ['GEO-MIDPOINT-01'],
    next: ['TRIG-ANGLE-01'],
    approaches: { 3: '/foundations/reading/geometry/angles/' },
    evidence: 'Supplied Geometry episode 05. The arm-length figure was drawn because that misconception is the one a diagram actively encourages.',
    verified: {
      on: '2026-09-21',
      checks: [
        'all seven answers recomputed, including both addition-postulate solves',
        'both solved values checked to leave every part positive and under 180 degrees',
        'the two fifty-degree arcs in the figure drawn at one radius and measured equal',
      ],
    },
    gaps: ['Reference and guided-practice routes not written', 'Angle pairs (complementary, supplementary, vertical) and parallel-line angles are later units'],
  },
  {
    id: 'BM-ORDER-01',
    slug: 'order-of-operations',
    title: 'Order of operations',
    summary: 'Evaluate an expression in the order the notation actually requires.',
    strand: 'basic-math',
    unit: 'BM/01',
    episodes: [['BM', '01.3']],
    courses: ['MA101'],
    prerequisites: ['BM-EXPONENT-01'],
    next: ['ALG-VARIABLE-01', 'CE-MATBAL-01'],
    hub: '/foundations/concepts/order-of-operations/',
    approaches: {
      1: '/foundations/concepts/order-of-operations/approach-1/',
      2: '/foundations/concepts/order-of-operations/approach-2/',
      3: '/foundations/reading/basic-math/order-of-operations/',
    },
    evidence: 'Supplied Basic Math episode 01.3. Reference and practice routes written to close '
      + 'the coverage gap. The practice route keeps one expression fixed and alters a single mark '
      + 'per family, because on this topic nearly every wrong answer is the correct value of a '
      + 'slightly different expression, and naming that expression is the feedback that helps.',
  },
  {
    id: 'BM-EXPONENT-01',
    slug: 'exponents',
    title: 'Exponents',
    summary: 'Read a power as repeated multiplication and keep its base straight.',
    strand: 'basic-math',
    unit: 'BM/01',
    episodes: [['BM', '01.2']],
    courses: ['MA101'],
    prerequisites: ['BM-EXPRESSION-01'],
    next: ['BM-ORDER-01'],
    hub: '/foundations/concepts/exponents/',
    approaches: {
      1: '/foundations/concepts/exponents/approach-1/',
      2: '/foundations/concepts/exponents/approach-2/',
      3: '/foundations/reading/basic-math/exponents/',
    },
    evidence: 'Supplied Basic Math episode 01.2. Reference and practice routes written to close '
      + 'the coverage gap. The practice route works on one square tile so that squaring a length '
      + 'carries a visible consequence — the unit changes and the area scales by the square of the '
      + 'scale factor — rather than being an exercise in symbol handling.',
  },
  {
    id: 'BM-EXPRESSION-01',
    slug: 'expressions-and-variables',
    title: 'Expressions and variables',
    summary: 'Turn a described quantity into an expression, and evaluate it.',
    strand: 'basic-math',
    unit: 'BM/01',
    episodes: [['BM', '01.1']],
    courses: ['MA101'],
    prerequisites: [],
    next: ['BM-EXPONENT-01', 'BM-INTEGER-01'],
    hub: '/foundations/concepts/expressions-and-variables/',
    approaches: {
      1: '/foundations/concepts/expressions-and-variables/approach-1/',
      2: '/foundations/concepts/expressions-and-variables/approach-2/',
      3: '/foundations/reading/basic-math/expressions-and-variables/',
    },
    evidence: 'Supplied Basic Math episode 01.1. Reference and practice routes written to close '
      + 'the coverage gap: the written guide existed alone, so there was no route for a reader '
      + 'who wanted a ruling rather than an explanation, and none that made the reader decide.',
  },
  {
    id: 'BM-INTEGER-01',
    slug: 'integers-and-the-number-line',
    title: 'Integers and the number line',
    summary: 'Place signed numbers on a line and compare them by position, not size.',
    strand: 'basic-math',
    unit: 'BM/04',
    episodes: [['BM', '04.1']],
    courses: ['MA101'],
    prerequisites: ['BM-EXPRESSION-01'],
    next: ['GEO-COORDINATE-01', 'GEO-SEGMENT-01'],
    hub: '/foundations/concepts/integers-and-the-number-line/',
    approaches: {
      1: '/foundations/concepts/integers-and-the-number-line/approach-1/',
      2: '/foundations/concepts/integers-and-the-number-line/approach-2/',
      3: '/foundations/reading/basic-math/integers-and-the-number-line/',
    },
    evidence: 'Supplied Basic Math episode 04.1. Written to close the gap the coverage ledger exposed: this concept is a prerequisite of the coordinate plane but had no treatment at all.',
    verified: {
      on: '2026-09-21',
      checks: [
        'all five answers recomputed, including the freezer comparison',
        'number-line figure checked for tick spacing and label legibility at 375px (10.2px effective)',
        'both chapter cross-links resolve; figure has descriptive alternative text',
      ],
    },
    gaps: ['Reference and guided-practice routes not written', 'Integer arithmetic (episodes 04.2 to 04.6) is a separate concept and is not covered'],
  },
  {
    id: 'TRIG-ANGLE-01',
    slug: 'angles',
    title: 'Angles and radian measure',
    summary: 'Measure an angle by the arc it cuts, and convert between degrees and radians.',
    strand: 'trigonometry',
    unit: 'TR/1',
    episodes: [['TR', '1.1']],
    courses: ['MA101', 'PHY101'],
    prerequisites: ['GEO-COORDINATE-01', 'GEO-ANGLE-01'],
    next: [],
    approaches: { 3: '/foundations/reading/trigonometry/angles/' },
    evidence: 'Supplied Trigonometry episode 1.1.',
  },
  {
    id: 'CE-MATBAL-01',
    slug: 'material-balances',
    title: 'A first material balance',
    summary: 'Draw a boundary, account for what enters and leaves, and find a mixture composition.',
    strand: 'process',
    unit: 'CE201/Units and process variables',
    episodes: [],
    courses: ['CE201'],
    prerequisites: ['BM-ORDER-01', 'ALG-VARIABLE-01'],
    next: [],
    approaches: { 3: '/program/lessons/material-balances/' },
    evidence: 'Original lesson written for CE 201 from the course topic list. No episode inventory covers this course.',
    verified: {
      on: '2026-09-21',
      checks: [
        'mixer arithmetic checked at water feeds of 0, 10, 50, 100 and 300 kg/h',
        'six named wrong answers each return their own repair, distinct from the generic hint',
        'non-numeric and unit-bearing input rejected with a usable message',
      ],
    },
    gaps: ['Reacting and unsteady systems, recycle and purge are not covered', 'Only one worked mixer; CE 201 needs many more lessons'],
  },
];
