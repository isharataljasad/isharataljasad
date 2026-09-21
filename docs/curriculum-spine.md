# The shared teaching spine

One registry connects the whole site: `program/concepts.mjs`. Everything below is generated from it by `tools/build-curriculum.mjs`, and nothing in it asserts that a lesson exists — the builder checks the filesystem and reports what it finds.

## The chain

```
strand / semester
  -> course            (program/catalog.mjs, 50 records)
    -> unit            (derived from foundations/reading/catalog.json)
      -> concept       (program/concepts.mjs, stable id)
        -> prerequisites and next concepts
        -> approach 1, 2, 3 treatments
        -> source episodes (evidence)
        -> related resources
```

## Stable identity

A concept id such as `GEO-INCIDENCE-01` never changes and never encodes placement. A concept can move to another unit, gain a route or be attached to another course without renaming, so links, bookmarks and saved progress survive. `test/curriculum.mjs` rejects any id that encodes a semester or unit number.

Existing URLs were not moved. The functions pilot keeps `/foundations/models/functions-and-domain/foundation-{1,2,3}/`, the written chapters keep `/foundations/reading/<group>/<slug>/`, and the Semester 1 topic pages keep their `yic-bsce:published-2023:semester-1:v1` progress key. The registry points at wherever a treatment already lives rather than duplicating it.

## The three routes

| Route | Student-facing name | What it does |
| --- | --- | --- |
| 1 | Curriculum reference | Placement, precise definitions, the conditions that make each rule valid, compact tables. |
| 2 | Guided practice | Distinct problem families, a decision to make, feedback naming the specific error, a changed case. |
| 3 | Written teaching guide | A complete lesson built from the beginning, readable without watching anything. |

Names stay neutral. Which underlying material informed a treatment is recorded per concept in `evidence`, never in the student-facing label. The written chapters under `/foundations/reading/` are route 3 treatments; they were not rewritten, only registered.

## Units are derived, not listed

`tools/build-curriculum.mjs` groups the 296 catalogued episodes into 49 units by reading the title prefix before `" - "`. Basic Math and Trigonometry number their episodes instead of naming them, so those 15 units take their titles from `unitNames` in the registry. Every episode lands in exactly one unit, and the build fails if a unit has no derivable title.

This keeps one source of truth. Adding an episode to `foundations/reading/catalog.json` adds it to a unit automatically; it never needs listing twice.

## Adding a concept

1. Add an entry to `concepts` in `program/concepts.mjs` with a stable id, the unit it belongs to, its source episodes, its prerequisites and what it leads to. Prerequisite edges must be mirrored in the other concept's `next`, or the build fails.
2. Write the treatments you have material for. A route with Markdown at `foundations/concepts/source/<slug>/approach-<n>.md` is generated at `/foundations/concepts/<slug>/approach-<n>/`. A route that already exists elsewhere is just pointed at.
3. Give the concept a `hub` if it should have a comparison page.
4. Run `npm run build:curriculum`, then `npm test`.

A concept with no treatments is fine and is the honest default. It appears in the index and the ledger as material available with nothing written.

## Adding a written chapter

Unchanged from [math-foundations.md](math-foundations.md): write the Markdown under `foundations/reading/source/`, register it in the `lessons` list in `tools/build-foundation-reading.mjs`, and give its episode a `url` in `foundations/reading/catalog.json`. An unregistered file fails the build by name.

## The Markdown renderer

`tools/lib/markdown.mjs` is the one renderer, and it supports exactly this list:

`## heading` · `### heading` · tables · `1.` ordered lists · `- ` bullet lists · `> ` blockquotes · `:::answer Label … :::` · `**bold**` · `*emphasis*` · `` `code` `` · `[label](target)`

Two rules that caused real defects:

- **A pipe inside `` `code` `` stays in its cell.** Splitting a row on every pipe turned `` `AB = |a - b|` `` into three cells and shipped ragged tables. A row whose width differs from the header now raises.
- **Anything else that looks like Markdown raises**, naming what to write instead. `#### `, `![image]`, `* ` and `+ ` bullets, `---`, nested lists and fenced code are all rejected. Before this, unsupported syntax was swallowed into a paragraph, so `*beyond*` and `> Plane M …` reached students with their markers visible on seven pages.

Emphasis runs after bold, and both delimiters must hug non-space, so `3 * 4` is left alone.

`tools/lib/markdown.mjs` is shared by the reading and concept-approach builders; the older functions-model builder still has its own renderer. It understands `##`, `###`, tables, ordered and unordered lists, `:::answer Label … :::` disclosures, `**bold**`, `` `code` `` and links. Malformed tables and disclosure markers raise errors. Other unsupported syntax remains paragraph text. Absolute-value bars inside inline code are preserved in tables, and table rows must match the header width. `tools/build-foundation-reading.mjs` was moved onto it and its output verified byte-identical across all 16 generated files.

## Figures

A figure is registered in the `figures` table in `tools/build-foundation-reading.mjs`, keyed by `<chapter url>|<heading id>`, with explicit `width` and `height`.

Size the type for the phone, not the desktop. A 660-wide figure renders at about 292px at a 375px viewport, a scale of 0.44, so a label at `font-size="15"` arrives at roughly 6.6px and cannot be read. Either keep the figure narrow — the geometry figures are 360 to 440 wide and scale to 0.66–0.81 — or raise the type so the effective size stays near 10px or above. `foundations/reading/figures/coordinate-plane.svg` is 660 wide with small labels and has the same problem; it has not been changed.

## Keeping the routes consistent with each other

When a concept has more than one treatment, the routes must agree on the facts they share. The test suite cannot check this — it can only check that pages exist and link to each other — so it is a reading job.

It has already caught one real error: the guided-practice route claimed that with `A`, `B`, `D` in order, `B` lies on `ray AD` but not on `ray DA`, while the written guide correctly said the two rays share segment `AD`. Whenever you add a route to a concept that already has one, read the new route against the existing one on every shared definition before publishing.

## The coverage ledger

`/program/coverage/` and `program/coverage.json` are generated from the registry plus the filesystem. Each route reports one of three states:

| State | Meaning |
| --- | --- |
| Generated locally | A local page and an identified source file exist. This is not deployment evidence. |
| Local page | A local page exists, but this registry has not identified its source. This is not deployment evidence. |
| Missing | No treatment is registered for that route. |

**Question counts name their method.** The pages use three shapes — headed families (`## Family 1 · …`), a numbered list under a question heading, or interactive check forms — so one selector cannot cover them. The counter reports which shape it read, and reports `null`, shown as "not identified", when it recognises none. It must never report `0`: a counter that does not understand the markup has not found zero questions, and `test/curriculum.mjs` fails on a bare `0`. An earlier version counted only answer disclosures and forms, and so reported `0` for chapters carrying six question families.

`test/curriculum.mjs` also fails if the ledger claims a route the registry does not declare, a page that does not exist, a treatment under 200 words, or a `generated` state whose source file is missing.

The ledger also reports the 26 Semester 1 topic pages separately, because they put all three treatments on one page rather than splitting them into routes, and it summarises the 50 programme courses by availability.

## Local readiness and publication

The ledger records deployment separately as `not-verified`. File existence cannot establish production availability. Tools of Geometry has five written guides and seven of fifteen possible treatments; four concepts still need reference and practice treatments. This is written-guide coverage, not completion across all three approaches. The full registry has 13 concepts, 17 of 39 treatments, and two concepts with all three approaches.
