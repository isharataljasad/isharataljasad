# Bayt Al-Fuad · Semester 1 study library

The student entrance contains Mathematics, Physics and Chemistry only. Each
subject has three reading collections: Book, Pearson and Educator. The root,
`/bayt/` and `/semester-1/` all open this same focused entrance.

The 9 collections contain 333 source lesson units (overlapping treatments, not
333 distinct syllabus objectives). The 26 semester topic guides combine
definitions, formulas, diagrams and worked examples. An additional 153 worked
applications show their solutions immediately. There are no assessments,
answer-entry forms, grades or progress requirements in this student flow.

## Maintain and verify

- `npm ci --ignore-scripts`
- `npm run build:study` rebuilds the 44 student pages.
- `npm test` checks the focused experience, all links and local assets, preserved
  content, numerical models, authentication and deployment routing.
- `npm run preview` serves the local review site (without production login).

`tools/build-study.mjs` is the authoritative student-page builder. All advertised
build aliases use it. The original source collections are retained as structured
HTML units in `tools/data/study-library.json`; its provenance hashes reference
the published pages at commit `5f5268a2f12d90ac22dc62653ec9a0bf774ab804`.
Combined explanations remain in `bayt/data/lessons/` and the scope/topic mapping
in `semester-1/curriculum.json`.

Earlier dashboard, programme and quiz builders remain historical tools. Their
old UI assertions are superseded by `test/study.mjs`; the active lesson and
scientific checks still run. Do not run the earlier builders on the student
entrance. Old unrelated material is preserved but not linked from this flow.
Existing browser storage is neither read nor deleted by the new reading pages.

## Deployment and scope

Generated pages are committed. Vercel serves them as a static site through the
existing Git-connected `isharataljasad` project and its unchanged password gate.
Source/tool folders remain excluded by `.vercelignore`. Do not touch unrelated
hosting projects.

The reading collections include supporting and extension chapters. The current
lecturer outline still determines assessed scope and sequence. These are
original/adapted study companions, not licensed reproductions of whole Pearson
or Educator courses. OpenStax attribution remains on the Chemistry Book route;
external publisher links may require an account.

## Historical project background

The domain owner authorized replacing the retired Quran application on 14 September 2026; that project has moved elsewhere. The original commit is 0442e18b2ea4f7eb74293e1f3dcfa7ce8d34670f and a full Git bundle was saved outside this checkout before changes.

Three independent tracks: Cengage/Pearson books, Educator, Pearson+. No content merge. Initial state records audit limits and pending student/parent acceptance. Pearson inventory is metadata and publisher links, not hosted video or textbook copies.

Existing server-side access gate is preserved, including existing environment variable names and cookie format, to preserve private access. Old user browser storage is not read or deleted. New project state uses science-project-v1. Browser state is device-local, not cloud-synchronized or connected automatically to AI conversations. JSON export/import transfers state; Markdown export is an agent handoff. IndexedDB attachments are local and excluded from JSON exports. Original attachments must be kept separately.

The earlier platform used a wider dashboard. Its material and data remain in
version control; the current student experience is the focused library above.
