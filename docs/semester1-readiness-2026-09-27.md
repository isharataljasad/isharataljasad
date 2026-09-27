# Semester 1 study library — readiness review, 27 September 2026

> **Superseded for the integrated design** on branch `claude/unified-learning`: see
> `docs/unified-learning-2026-09-27.md`. The three-route structure described below
> is the release at `aa7c04c`.

Updated 27 September 2026 after integrating Claude's rewrite at `3a28052` and
expanding four brief foundations. This map describes the current source and
local build. The production password gate is preserved; this session has no
production password, so authenticated production content has not been checked.
Deployment evidence is recorded separately from teaching-content coverage.

## Sources of scope

- Official: the Yanbu Industrial College BSc Chemical Engineering plan and course
  descriptions recorded in `semester-1/curriculum.json`. The PDF could not be
  re-downloaded on 27 September (HTTP 503 / certificate failure), so the topic
  lists recorded earlier in the repository were used and not re-checked.
- No lecturer outline, laboratory list or supplied book files are in the
  repository. Order and assessed depth therefore remain unconfirmed.

## What was found

| Area | Finding before this review |
|---|---|
| 26 topic guides | Machine-translated English with errors: “the absolute value of a negative number is negative”; “Boycott” for secant; “Hit/Divide” for product/quotient rules; a friction caption calling mg cos θ the “vertical component”; “Details that matter” answers printed without their questions; references to a “training” quiz. |
| Figures | Overlapping and clipped labels; mislabelled diagrams (above). |
| 9 route collections | 333 short notes (≈ 70–150 words each), not substantial reading; Semester 1 and later-course chapters (integration, E&M, equilibrium…) mixed in one sequence; plain-digit formulas (BaCl2, Ba2+). |
| Deployment | Earlier dashboards, planner, quiz pages, other subjects and notes (e.g. `resources/claude-next.txt`, `data/project.json`) were still deployed behind the gate, reachable by URL. Legacy builders could overwrite the student pages. |

## What changed

- **Guides rewritten** in `tools/content/<course>/<topic>.mjs` (≈ 48 000 words):
  why it matters, the idea, background, definitions, a symbols/units table,
  formulas with conditions and limits, a derivation, a computed figure, a table,
  a method, 4–8 fully worked examples (every step has its reason; results and
  interpretation visible), common misunderstandings, and scope. 259 numerical
  claims are recomputed by `npm test`, including 27 checks for the added foundations.
- **Routes made substantial and distinct.** Each route page lists the Semester 1
  topics first, in order. Per topic: Book = definitions, symbols, formulas with
  conditions, derivation, an example; Pearson = method, key formulas, all worked
  examples, typical errors; Educator = why, idea, figures, tables, background,
  an explained example, misconceptions. The original short notes follow each
  topic. A **Compare** bar on every topic opens the same topic in the other
  routes and the full guide (`#topic-<id>` anchors). Background, “check your
  outline” and “beyond Semester 1” notes are separated; later-course notes are
  collapsed.
- **Honest attribution.** Every route states that its text is original study
  material, not a publisher course; Pearson video links are labelled as external
  and possibly account-only; the OpenStax CC BY credit remains on Chemistry Book.
- **Notation**: 71 formula/charge fixes in the chemistry and physics notes
  (`tools/fix-unit-notation.py`, reviewed line by line).
- **Deployment allow-list** (`.vercelignore`): only the 44 study pages, their
  images, the stylesheet and the gate deploy. Old URLs redirect to `/`
  (`vercel.json`). Legacy builders refuse to run (`tools/lib/legacy-guard.mjs`).
- **Tests**: `test/study.mjs` (structure, reading-only, links/anchors, content
  completeness, numerical checks, unit placement, deploy allow-list,
  reproducible rebuild), `test/routing.mjs` (computed from `.vercelignore`),
  `test/gate.mjs` (unchanged, 42 checks). Two tests of the retired quiz page
  were removed; other legacy tests run with `npm run test:legacy`.

## Foundation additions in this release

Four sections in `tools/content/support/` now provide 18 additional fully worked
examples, symbols, units, formula conditions, interpretation and common mistakes.
Each is present in its full topic guide and in Book, Pearson and Educator, with
its own contents link. References are linked at the end of each section.

- Relative motion: named frames, vector velocity addition, train and overtaking
  examples, river crossing with drift and upstream steering.
- Amount and formulas: the mole, entity counts, molar mass, composition,
  empirical and molecular formulas.
- Chemical naming: charge balance, polyatomic ions, variable-charge metals,
  molecular prefixes and the distinction between gaseous HCl and aqueous acid.
- Intermolecular forces: London forces, polarity, hydrogen bonding, ion–dipole
  interactions, boiling and vaporization, and qualified solubility predictions.

The review also corrected vertical-throw/projectile wording, the helium valence
exception, percentage-error terminology and five absolute-value fractions that
were incorrectly parsed. The renderer now rejects ambiguous or empty fractions;
regression checks protect their notation. These checks do not constitute a
subject-specialist review of every statement.

## Coverage map

Legend: **Explained** = present and sufficiently explained in the guide and all
three routes. **Brief** = present but short (collection notes only). **Missing**.
**Unconfirmed** = scope cannot be confirmed without the lecturer outline.

### MA 101 Calculus I (published: limits, continuity, derivatives, rates of change, approximations, optimization, curve sketching, Rolle’s theorem and the MVT)

| Topic | Status | Where |
|---|---|---|
| Limits (one-sided, algebraic, trigonometric, at infinity, squeeze, ε–δ by example) | Explained | `/semester-1/math/limits/`, routes `#topic-limits` |
| Continuity, IVT | Explained | `/semester-1/math/continuity/` |
| Derivative as a rate, tangent lines, differentiability | Explained | `/semester-1/math/derivative/` |
| Rules: power, product, quotient, chain, trig, exp/log, inverse trig, implicit, higher | Explained | `/semester-1/math/rules/` |
| Related rates | Explained | `/semester-1/math/related-rates/` |
| Linear approximation, differentials, error propagation | Explained | `/semester-1/math/approximation/` |
| Rolle and Mean Value Theorems | Explained | `/semester-1/math/mean-value/` |
| Extrema, curve shape, asymptotes, sketching | Explained | `/semester-1/math/curve-shape/` |
| Optimization | Explained | `/semester-1/math/optimization/` |
| L’Hôpital’s rule, Newton’s method, hyperbolic derivatives | Brief · Unconfirmed | route pages `#related` (Newton also in Approximation “Going further”) |
| Integration and its applications | Not Semester 1 per description | route pages `#beyond` (collapsed) |

### PHY 101 General Physics I (published: fundamentals, laws of motion and applications, laboratory experiments, graphing)

The eight-topic breakdown is a proposed order (description is broad).

| Topic | Status | Where |
|---|---|---|
| Units, conversion, dimensions, significant figures | Explained | `/semester-1/physics/measurement/` |
| Vectors, 1D kinematics, free fall, projectiles | Explained | `/semester-1/physics/motion/` |
| Relative motion | Explained | `/semester-1/physics/motion/#support-relative-motion`; all Physics routes at `#support-relative-motion` |
| Newton’s laws, free-body diagrams, tension, apparent weight | Explained | `/semester-1/physics/forces/` |
| Friction and inclines | Explained | `/semester-1/physics/friction/` |
| Work, energy, power | Explained · Unconfirmed in PHY 101 | `/semester-1/physics/energy/` |
| Impulse, momentum, collisions | Explained · Unconfirmed in PHY 101 | `/semester-1/physics/momentum/` |
| Circular motion | Explained · Unconfirmed in PHY 101 | `/semester-1/physics/circular-motion/` |
| Laboratory graphs, linearisation, uncertainty | Explained | `/semester-1/physics/lab-graphs/` |
| The specific PHY 101 experiments and report format | Missing (no lab list supplied) | — |
| Rigid-body equilibrium, springs/SHM, gravitation and orbits, air resistance | Brief · Unconfirmed | route pages `#related` |
| Rotational dynamics, fluids, waves, heat, electricity, optics, modern physics | Not Semester 1 per description | route pages `#beyond` |

### CHEM 101 General Chemistry I (published: atomic structure, quantum theory, periodic table, chemical bonds, reactions in solution, properties of solutions and gases, thermochemistry, electrochemistry)

| Topic | Status | Where |
|---|---|---|
| Atomic structure, isotopes, ions, average atomic mass | Explained | `/semester-1/chemistry/atomic-structure/` |
| Quantum theory: photons, hydrogen spectrum, quantum numbers | Explained | `/semester-1/chemistry/quantum-theory/` |
| Configurations and periodic trends | Explained | `/semester-1/chemistry/periodic-table/` |
| Ionic/covalent bonding, Lewis, formal charge, resonance, VSEPR, polarity | Explained | `/semester-1/chemistry/bonding/` |
| Reactions in solution: net ionic, precipitation, acid–base, redox, limiting reactant, titration | Explained | `/semester-1/chemistry/aqueous-reactions/` |
| Solutions: concentration units, dilution, Henry, colligative properties | Explained | `/semester-1/chemistry/solutions/` |
| Gases: gas laws, ideal gas, Dalton, KMT, Graham | Explained | `/semester-1/chemistry/gases/` |
| Thermochemistry: first law, calorimetry, Hess, ΔH_f° | Explained | `/semester-1/chemistry/thermochemistry/` |
| Electrochemistry: cells, E°, ΔG, Nernst, electrolysis | Explained | `/semester-1/chemistry/electrochemistry/` |
| Mole, formulas, empirical and molecular formulas | Explained | `/semester-1/chemistry/atomic-structure/#support-amount-and-formulas`; all Chemistry routes at the same anchor |
| Writing formulas and naming compounds | Explained | `/semester-1/chemistry/bonding/#support-chemical-naming`; all Chemistry routes at the same anchor |
| Intermolecular forces, basic phase changes and solubility | Explained as supporting foundations; assessed depth unconfirmed | `/semester-1/chemistry/bonding/#support-intermolecular-forces`; all Chemistry routes at the same anchor |
| Detailed phase diagrams, hybridisation/MO, extended free-energy treatment | Brief · Unconfirmed | route pages `#related` and related topic explanations |
| Kinetics, equilibrium, acids/bases, nuclear, organic | Not Semester 1 per description | route pages `#beyond` |

## Verification for this release

- `npm test` passed: 44 study pages, 259 numerical checks, all 333 original
  collection notes placed once, internal links and anchors, the deployment
  allow-list, reading-only controls and deterministic generation. All 42 access
  gate checks passed; routing and content-security-policy checks passed.
- Local Chromium: all 44 pages opened at 390 × 844. No page-wide horizontal
  overflow, empty fraction terms, broken loaded images, answer controls or SVG
  text outside its image bounds were detected. Wide tables scroll within their
  containers. This automated geometry check does not establish every diagram's
  scientific accuracy or guarantee that labels never overlap.
- Visual review covered the 1440 × 1000 entrance and topic/route navigation,
  mobile explanatory text, formulas, the relative-motion vector diagram, the
  mole-conversion diagram and the hydrogen-bond diagram. The browser reported
  no page errors or console messages during the local walkthrough.
- In-app browser control could not start because of a Windows sandbox error;
  a separate local Chromium session was used for the review.

## Remaining limitations

1. Authenticated production content has not been verified in this session
   because no production password is available. Deployment success and local
   verification must not be described as an authenticated production walkthrough.
2. Lecturer outlines and PHY 101 laboratory list are still required to confirm
   order, depth, and whether Energy/Momentum/Circular motion are PHY 101 topics.
3. The guides were checked by recomputation and by reading, not by a subject
   specialist or by the student.
