# Curriculum review and continuation handoff

## Current verified state after Claude report 5

Codex finished the interrupted correction pass locally on 2026-09-21. This section supersedes the counts and completion wording in the historical authoring report below.

- Working branch: `curriculum-architecture-20260921`.
- Last committed revision: `0f1ec07`; this correction pass made no commit, push, merge or deployment.
- Working directory: `C:/Users/BaytAlFuad/Documents/Codex/2026-09-16/use-the-opera-browser-connector-to/work/chemistry_deploy`.
- The index contains Claude's earlier staged changes. Later Claude and Codex corrections also exist as unstaged changes; `test/markdown.mjs` is new and must be included in any eventual commit. Inspect the full working tree, not just the staged diff.

| Measure | Local result |
| --- | ---: |
| Source records / unique episodes | 297 / 296 |
| Foundation units | 49 |
| Registered concepts | 13 |
| Available treatments for registered concepts | 17 / 39 |
| Concepts with all three approaches | 2 |
| Written library chapters | 11 |
| Episodes mapped to the concept registry | 13 / 296 |
| Units with no registered concept | 43 |
| Programme courses / courses still outlines | 50 / 46 |

Tools of Geometry has five written guides and seven of fifteen possible treatments. Its coordinate-plane, segments, midpoints and angles concepts still lack reference and practice routes. It is not complete across all three approaches. Registry mapping does not measure whether related material exists elsewhere on the site.

## Corrections completed

1. Retained Claude's table splitter and regression test: pipes inside code spans remain formula characters, and mismatched table widths fail the build. Rebuilt the broken segment and midpoint tables.
2. Completed the ray terminology correction, including the stale answer disclosure. AD and DA rays have different endpoints and share segment AD. BA and BD are opposite rays with common endpoint B.
3. Qualified intersection rules to distinguish distinct objects, coincident planes and overlapping rays/segments. Added different-line ray and segment cases to the reference table.
4. Corrected the practice guide's claim that apparent touching in a perspective drawing establishes an intersection. Facts must be stated, marked or deduced. Repaired the reference links to the actual measurement lessons.
5. Separated local availability (`generated`, `local-file`, `missing`) from deployment verification. Coverage JSON records deployment as `not-verified`; the page explicitly says publication is not verified. Removed unsupported claims about whether any real student has ever used the material.
6. Made the report explain that 17/39 applies only to registered concepts and that written-guide coverage is not three-approach completion.
7. Included the foundation index builder in `build:curriculum` so new chapters reconnect to their folder and source-record pages during the normal build.
8. Updated documentation to describe actual renderer scope, chapter counts and unsupported Markdown handling accurately.

## Verification in this pass

- Ran the complete `build:curriculum` chain successfully.
- All 20 test scripts passed; gate tests passed 42 checks.
- Markdown tests found 53 rectangular tables; the corrected distance table has four cells per row, and the corrected midpoint comparison has three.
- Routing checks covered 437 local pages with no clean-URL collisions and valid required document structure. This is not proof of production deployment.
- Opened both corrected tables in the in-app browser and visually inspected intact absolute-value formulas.
- Opened the coverage ledger in the browser and confirmed publication-unverified wording and the five-guides limitation.
- Curriculum tests checked reciprocal links for every registered concept with multiple approaches.
- No new mobile layout audit or real-student study was performed in this pass. Earlier browser claims below belong to the earlier authoring pass.

## Remaining work

The full curriculum still needs substantial authored content. Priorities include missing reference and practice routes, Semester 1 misconception-specific feedback, and verified current course outlines. Existing coordinate-plane figure labels remain small. The shared renderer still leaves unsupported single-asterisk emphasis and blockquote markers as literal text; it only supports its documented subset. Additional content review is needed before describing the whole site as ready.

## Claude continuation after the usage interruption

Picked up after the interruption, on the working tree as Codex left it. I verified the five review items against the built output rather than assuming, then fixed one further defect that Codex had flagged as outstanding.

### The five review items, checked in the output

| Item | Evidence |
| --- | --- |
| 1 · Table parser | `test/markdown.mjs` covers the splitter, a bars-in-code table, and ragged rows in both directions. 53 published tables, all rectangular. Both repaired tables measured in the browser: every row shares one set of column positions and widths, and `AB = |a − b|`, `|a − b|` and `|−3 − 9| = 12` each sit in a single cell. |
| 2 · Opposite rays | No route claims `ray AD` and `ray DA` are opposite rays. All three state the shared-endpoint rule, and all three keep `ray AD ∩ ray DA = segment AD`. |
| 3 · Intersection trichotomy | Neither route states the blanket "nothing, one point, or a whole line" any more; both scope it to lines and planes and give the ray/segment exception. |
| 4 · Local versus deployed | `coverage.json` carries `deployment: {status: "not-verified"}`; route states are `generated` / `local-file` / `missing`; the word "Published" no longer appears on the ledger. |
| 5 · Tools of Geometry wording | The stale "Tools of Geometry is complete … first unit finished end to end" heading is replaced in place, with a note recording what it used to say. Five written guides, 7 of 15 treatments, four concepts missing their reference and practice routes. |

### A further defect found and fixed: Markdown reaching students as literal characters

Codex's remaining-work note said the renderer "still leaves unsupported single-asterisk emphasis and blockquote markers as literal text". That was not cosmetic — it was shipping on **7 of 17 pages**, including a chapter that predates this work:

- `*beyond*`, `*not*`, `*undefined terms*`, `*its own*` and others rendered with their asterisks visible.
- The configuration blockquote in the practice route rendered as a paragraph beginning `> Plane M contains line g`.

`tools/lib/markdown.mjs` now supports both. Emphasis runs after bold so `**x**` is untouched, and both delimiters must hug non-space, so an asterisk used for multiplication is left alone — `3 * 4 * 5` stays as written. Blockquotes join consecutive `> ` lines into one paragraph and still run inline markup inside.

The renderer's stated contract was "anything else raises rather than being swallowed", which was not true. It now holds: `#### `, `![image]`, `* ` and `+ ` bullets, `---` rules, nested lists and fenced code each raise with the alternative to write instead.

After rebuilding: 16 `<em>` and 2 `<blockquote>` render, and no page carries an unrendered marker. The remaining `&gt;` characters are genuine mathematics (`3 > −8`, `|−8| > |−3|`), which the test deliberately does not flag — it checks only for a paragraph opening with a quote marker and for asterisk-delimited text.

### Verification

- Full `build:curriculum` chain, then all **20** test scripts pass.
- `test/markdown.mjs` extended: emphasis, arithmetic asterisks left alone, blockquotes, seven unsupported constructs each raising, and a scan of every published page for literal markers.
- Both repaired tables inspected through the DOM at a 1000 px viewport. The Browser pane was stuck at a large zoom and returned blank or fragmentary screenshots throughout this pass, so the visual check was done by measuring laid-out cell geometry instead of by eye. That is stronger evidence for "is this a rectangular grid", but it is not a substitute for a human look at the typography.

### Still outstanding

Unchanged from Codex's list: reference and practice routes for four Geometry concepts, Semester 1 misconception-specific feedback, small labels on `coordinate-plane.svg`, and current official course outlines. Nothing in this pass touched the gate, and nothing was committed, pushed or deployed.

## Historical authoring report

The following is retained for history. Its counts, publication labels and completion claims are superseded by the current verified section above.

# Handoff: curriculum architecture for three approaches · 21 September 2026

For Codex to review and publish. Nothing was pushed, merged or deployed. The access gate was not touched.

---

## Second pass — corrections and five Geometry written guides

### The ray error you found: confirmed, and it was mine

You were right. With `A`, `B`, `D` in that order, `B` lies on **both** `ray AD` and `ray DA`; their intersection is segment `AD`. Only a point beyond an endpoint distinguishes the two rays. Both occurrences in `approach-2.md` are corrected, and the correction now states the rule positively rather than just removing the false claim:

- `ray AD ∩ ray DA = segment AD`, `ray AD ∪ ray DA = line AD`.
- The reference route gained the same rule in its notation section, two boundary-check rows, and a fourth question that tests it directly.

Worth recording: **your expanded chapter already had this right** (§2 and answer 7 both state the shared segment). My route 2 contradicted route 3 on the same concept. A cross-route contradiction is a failure mode the tests cannot catch, and it argues for reading the routes against each other whenever a concept has more than one.

### Independent conceptual review

I re-derived every claim in the new material by hand rather than relying on the suite. One further imprecision found and fixed, plus one clarification:

- **`plane ABE` in approach 2** was marked simply "valid", which invited the reading that it is another name for `M`. It is a valid name for a *different* plane, since `E` is not in `M`. A row was added making that explicit, and the three genuine names for `M` are now given together.
- **Reflex angles** in GE 05: the chapter said measures run `0` to `180` immediately after defining a full turn as `360°`. It now scopes reflex and directed angles out explicitly and points to trigonometry.

Checked and found correct: every intersection rule (line–line, line–plane, plane–plane, and now ray–ray); every determination condition; the betweenness converse, including that `DE = 8, EF = 5, DF = 11` makes the three points non-collinear because no betweenness equation holds; all six, six and seven question answers in GE 03, 04 and 05; and every "what a drawing may tell you" row.

### Three-way navigation

All six directed edges between the Geometry treatments now work, verified in the browser:

`1→2 ✓ 1→3 ✓ 2→1 ✓ 2→3 ✓ 3→1 ✓ 3→2 ✓`, plus a hub link from each, and each route marking itself `aria-current="page"`.

The missing direction was route 3, a reading chapter built by a different generator. `tools/build-foundation-reading.mjs` now reads the concept registry and injects the same switcher, but only when there are at least two treatments to switch between — so the other ten chapters are unchanged. `test/curriculum.mjs` now asserts every directed edge for every concept with more than one route.

### Coverage report corrections

The old report was misleading in two ways, both fixed:

- **"Written" conflated existence with authorship.** Each route now reports **Generated** (the page exists *and* a source file here rebuilds it — the path is shown), **Published** (exists, but this repository cannot rebuild it), or **Missing**. A key on the page defines all three.
- **The question count was not a question count.** It counted answer disclosures and forms, so it reported `0` for chapters that plainly carry six question families. It now recognises the three shapes the pages actually use — headed families, a numbered question list, interactive checks — **and names which one it read**. When it recognises none it reports "not identified" rather than `0`, and the test forbids a bare `0` so a parsing failure can never again be displayed as "no questions".

Corrected counts, spot-checked against the headings: GE 02 → 12, GE 03 → 6, GE 04 → 6, GE 05 → 7, order-of-operations → 8, foundation-1 → 3, foundation-3 → 6, CE 201 → 1 interactive.

### Tools of Geometry: five written guides, one unit far from finished

> **Corrected.** This section originally read "Tools of Geometry is complete … the first unit finished end to end". That was wrong, and it is the claim item 5 of the review asked me to withdraw. Every episode of the unit has a **written teaching guide**, which is one of the three approaches. Only `GE 02` has all three. The unit holds **7 of a possible 15 treatments**; the reference and practice routes are missing for the other four concepts. A written guide for every episode is not completion across the three approaches.

| Episode | Chapter | Routes present | Missing | Questions | Figure |
| --- | --- | ---: | --- | ---: | --- |
| GE 01 | The coordinate plane | 1 of 3 | reference, practice | 6 | 1 |
| GE 02 | Points, lines and planes | **3 of 3** | — | 12 | 4 |
| GE 03 | Measuring segments | 1 of 3 | reference, practice | 6 | 1 new |
| GE 04 | Midpoints and segment congruence | 1 of 3 | reference, practice | 6 | 1 new |
| GE 05 | Angles | 1 of 3 | reference, practice | 7 | 1 new |

Each new chapter states what it covers and what it does not, teaches before asking, and ends with question families whose answers give reasons. Each targets the misconception its own content sets up: distance versus difference of coordinates and the letter-chaining rule in GE 03; **averaging versus subtracting** in GE 04 — the error GE 03 makes likely; and **arm length versus measure** in GE 05.

The three new diagrams are original and were verified numerically, not by eye:

- `segment-addition.svg` — the brace widths are exactly 5, 4 and 9 units at 35 px per unit.
- `midpoint-average.svg` — `AM` and `MB` are both exactly 198 px, and the figure sets the average against the difference side by side.
- `angle-arm-length.svg` — both angles measure **50.0°** (computed from the arm coordinates; they differed by 0.5° in my first draft and the figure asserts they are congruent), with arms in a ratio of exactly 2.5 and one arc radius for both.

All three are 520 wide, scaling to 0.56 at 375 px, so their 19 px labels arrive at 10.7 px — the legibility rule from the first pass.

### Second-pass verification

19 tests pass. 437 pages, zero broken links, zero misresolving relative paths, zero unhashed inline code. At 375 px the three new chapters and both new index pages show no horizontal overflow, one `h1` each, and every scrollable table in the tab order.

New test coverage: every directed navigation edge; route `state` must match a real source path; a route may never report `0` questions; the counting method must be named.

### Where the ledger stands now

13 concepts · **17 of 39 treatments** · 11 written chapters · 13 of 296 episodes attached · 43 of 49 units still empty · 2 concepts with all three routes.

Geometry now has 5 concepts across 12 units. Basic Math 4, Algebra 2, Trigonometry 1, plus CE 201.

### What remains

1. **Reference and guided-practice routes for GE 03, 04 and 05.** Each has only the written guide. The registry records this per concept in `gaps`.
2. **`coordinate-plane.svg` still has the small-label problem** — 660 wide with small type, the defect I fixed in my own figures. Untouched to keep this diff reviewable.
3. **Semester 1 feedback is still generic** and its schema still cannot express misconceptions or problem families. Unchanged, and still the largest learning gap.
4. **The next unit** is `GE/Reasoning and Proof` (7 episodes), which follows directly from these five.
5. Curriculum evidence — current official outlines, lab procedures, assessment requirements — still missing.

---

## Worktree and branch

| | |
| --- | --- |
| Worktree | `C:\Users\BaytAlFuad\Documents\Codex\2026-09-16\use-the-opera-browser-connector-to\work\chemistry_deploy` |
| Branch | `curriculum-architecture-20260921` |
| Base | `0f1ec07` — the published `origin/main`, including your routing repairs and the expanded Geometry episode 02 |
| State | staged, uncommitted |

Your published work was verified present before any edit: `test/routing.mjs`, `tools/preview-server.mjs`, the three extracted stylesheets, the relocated source fragments, and both new docs. The three clean-URL collision files are gone.

## Your corrections, accepted

- **Python is available.** Recorded. I did not need to run the Python builder this pass and did not modify it, so semester-1 page generation is untouched.
- **The CSP check mixing directives was a real bug in my test.** Your per-directive fix is correct and is what `test/routing.mjs` now runs.
- **"A matching login page and Git commit do not prove production is served correctly."** Agreed. I made no production claim this pass; the site stayed behind the gate and I did not authenticate.
- **Killing every Node process was bad advice.** Stop only the preview process.

## What this pass built

### 1. One registry connects the whole site

`program/concepts.mjs` is the spine:

```
strand/semester -> course -> unit -> concept -> prerequisites
                                       |-> approach 1, 2, 3
                                       |-> source episodes
                                       |-> related resources
```

A concept id (`GEO-INCIDENCE-01`) is stable and encodes no placement, so a concept can move or gain a route without breaking a link or saved progress. The build refuses an id that encodes a semester or unit number, an unmirrored prerequisite edge, an unknown course or episode, or an approach pointing at a page that does not exist. Four such errors were caught and fixed while writing the registry.

**No existing URL moved.** The functions pilot, the written chapters and the Semester 1 topic pages keep their addresses and their `yic-bsce:published-2023:semester-1:v1` progress key. Treatments that already existed are pointed at, not duplicated.

### 2. Units are derived, so all 296 episodes are accounted for

`tools/build-curriculum.mjs` groups the catalogue into **49 units** by the title prefix before `" - "`. Basic Math and Trigonometry number rather than name their episodes, so those 15 units take titles from `unitNames`. Every episode lands in exactly one unit and the build fails if a unit has no title. Nothing is listed twice.

Reconciled inventory, all recomputed this pass:

| Source | Count |
| --- | ---: |
| Foundations source records | 297 |
| Unique episodes | 296 (Algebra 2 ep. 30 has two files) |
| Derived units | 49 |
| Programme courses | 50 (46 required, 4 elective) |
| Semester 1 live topics | 26, each already carrying book/pearson/educator treatments |
| Chemistry route inventories | Goldwhite 35, Franklin Ow 24, Pearson 9 arenas, 7 books |

The three inventories do **not** cover the same topics, and the registry does not pretend they do: coverage is recorded per concept per route.

### 3. One Markdown renderer

`tools/lib/markdown.mjs` now serves every builder. `tools/build-foundation-reading.mjs` was moved onto it and **its output verified byte-identical across all 16 generated files** before anything else changed. Your `:::answer` disclosure support was preserved exactly.

### 4. New pages

- `/foundations/concepts/` — every unit in all four subjects, including the 43 with no concept yet, so gaps are visible rather than hidden.
- `/foundations/concepts/points-lines-and-planes/` — hub comparing the three routes.
- `/foundations/concepts/points-lines-and-planes/approach-1/` and `approach-2/` — new original reference and guided-practice treatments. Route 3 is **your expanded chapter**, registered rather than rewritten.
- `/program/coverage/` and `program/coverage.json` — the coverage ledger.
- `/foundations/reading/basic-math/integers-and-the-number-line/` — new chapter with an original diagram.

### 5. The coverage ledger

Generated from the registry plus the filesystem. A route counts as written only if its page exists; the word, section, figure and question counts are measured from that page. `test/curriculum.mjs` fails if the ledger claims a route the registry does not declare, a page that does not exist, or a treatment under 200 words.

## Coverage ledger, current state

| | |
| --- | ---: |
| Concepts registered | 10 |
| Treatments live | 14 of 30 possible |
| Concepts with all three routes | 2 (functions, points-lines-and-planes) |
| Written chapters | 8 (was 7) |
| Episodes attached to a concept | 11 of 296 |
| Units with no concept | 43 of 49 |
| Concepts with recorded verification | 4 |

Per strand: Basic Math 4 concepts across 11 units, Algebra 2 across 22, Geometry 2 across 12, Trigonometry 1 across 4, plus CE 201.

**This is an early spine, not a covered curriculum.** 285 of 296 episodes have indexed source material and nothing written. 46 of 50 courses remain outlines. The ledger says so on the page.

## Content added, and why

**Points, lines and planes, routes 1 and 2.** Chosen because your expanded chapter gave route 3 real depth, so the concept could demonstrate all three routes working together without duplicating the guide. Route 1 is a reference: definitions, determination conditions, every intersection case, five boundary claims tested. Route 2 is practice: one fixed configuration reused across four genuinely different problem families — naming, determination, intersection, and reading a drawing — each with a misconception table that names the wrong reasoning and supplies a changed case.

**Integers and the number line.** Chosen because the ledger exposed it as a dangling prerequisite: `GEO-COORDINATE-01` required it and it had no treatment at all. Covers the two jobs of the minus sign, order by position, the digit-comparison misconception, opposites and double signs, absolute value as distance, and choosing a sign convention. Five question families with reasoned answers, and an original diagram that shows order and distance as separate measurements.

All prose, examples, tables and SVG are original. No publisher prose, transcript, figure or question bank is reproduced. `evidence` on each concept records what informed it.

## Tests and browser checks

`npm test` runs **19 scripts; all pass.** New: `test/curriculum.mjs`. Modified: `test/reading.mjs` (chapter counts now derive from the catalogue instead of being hardcoded, and every figure must exist and carry alternative text ≥ 10 chars), `test/foundation-models.mjs` (the ordering assertion now targets the concepts link rather than removed wording).

Browser checks on the local preview, **simulated, not student evidence**:

- Concept index: 49 unit blocks, 10 concepts, 13 live route chips and 17 marked missing, all 23 internal links resolve.
- Approach 2: all 8 table-of-contents anchors resolve; all three routes reachable; current route carries `aria-current`; both disclosures open and reveal content.
- Seven pages at 375px: zero horizontal overflow, one `h1` each, every scrollable table focusable and in the tab order, every image carrying alternative text.
- Full-site audits: 434 pages, zero broken internal links, zero misresolving relative paths, zero unhashed inline code.

### One defect found and fixed in my own work

My first number-line SVG was 660 wide with `font-size="15"` labels. At 375px that scales to 0.44, so labels rendered at about **6.6px** — unreadable. Raised to 23 and re-measured at **10.2px**. Your geometry figures avoid this by staying 360–440 wide (scale 0.66–0.81); I have written that rule into `docs/curriculum-spine.md`.

## Reproducing

```bash
npm test
```

```bash
npm run build:curriculum
```

```bash
node tools/preview-server.mjs
```

The preview binds to loopback and does not run the gate. Stop that process only.

## Remaining blockers and next work

1. **`foundations/reading/figures/coordinate-plane.svg` has the small-label problem** — 660 wide with the same label sizes as my first attempt. Not changed this pass to keep the diff reviewable. Worth the same treatment.
2. **Semester 1 answer feedback is still generic.** All 26 topics share `/semester-1/assets/app.js`, which returns one message for every wrong answer, and their two questions are a matched pair rather than different families. The ledger states this. Fixing it means extending the topic schema, which lives in the Python builder.
3. **The Semester 1 topic schema still cannot express the teaching standard** — no field for prerequisites, misconceptions, problem types or figures. Python is available, so this is now actionable; it was the largest learning gap I reported last pass and it is unchanged.
4. **43 of 49 units have no concept.** The next natural batch is the rest of `GE/Tools of Geometry` (measuring segments, midpoints, angles), which follows directly from the chapter you expanded.
5. **Curriculum evidence still missing.** Current official course outlines, laboratory procedures and assessment requirements. Nothing on the site should be read as the college's syllabus.

## Honest limits

Simulated walkthroughs only: I drove the pages programmatically and checked the mathematics, the links and the layout. No real student has used any of this, so nothing here is evidence about learning. Not a formal accessibility audit, not a security review, and not a statement about production, which stayed behind the password gate throughout. The site is not ready to be called complete, and the ledger is the place that says what is actually there.
