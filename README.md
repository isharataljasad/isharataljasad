# Bayt Al-Fuad · Semester 1 study library

The student entrance (`/`, `/bayt/`, `/semester-1/`) shows Mathematics, Physics,
Chemistry and English, each with one button. Each subject is one ordered sequence
of lessons (10 + 9 + 12 + 20 = 51). Science lessons follow one pattern: what it
explains, background, the idea with a diagram, formulas with their meaning and
conditions, a first worked example, a different case, more cases, common
misunderstandings, then keep in mind and the next lesson. English lessons use a
language layout: purpose, prerequisites, explanation, language pattern, two
worked examples with annotations, common mistakes, keep in mind. There are no quizzes,
answer fields, scores or progress requirements; every worked solution is visible.

## Where things live

- `tools/content/sequence.mjs` — the lesson order of each subject.
- `tools/content/<course>/<lesson>.mjs` — lesson text (original English), with
  computed figures and a `checks` list of numerical claims. Four lessons wrap the
  sections in `tools/content/support/`.
- `tools/content/english/pack/` — the owner's English content pack, unchanged (canonical
  JSON, source registry, legacy inventory, audio production manifest);
  `tools/content/english/index.mjs` loads it and applies recorded corrections.
- `tools/build-study.mjs` — the only builder of student pages (all `build:*` scripts).
  Earlier builders are preserved but refuse to run (`tools/lib/legacy-guard.mjs`).
- `tools/data/study-library.json` — the 333 earlier collection notes (archive,
  not deployed). `tools/make-ledger.mjs` builds the migration ledger
  (`docs/migration-ledger.md`, `tools/data/migration-ledger.json`) from
  `tools/data/ledger/*.py` via `tools/data/ledger-annotations.json`.
- `docs/unified-learning-2026-09-27.md` — this design, the coverage map,
  verification and open items; `docs/compatibility-map.md` — old links;
  `docs/pilot-feedback-proposal.md` — feedback (not implemented).

## Maintain and verify

- `npm ci --ignore-scripts`
- `npm run build:study` rebuilds the 74 pages (deterministic); run
  `node tools/make-ledger.mjs` first after changing the ledger annotations.
- `npm test` — feedback endpoint behaviour (`test/feedback.mjs`); lessons, 296 numerical checks (all 259 of release aa7c04c traced),
  ledger, old links, reading-only pages, links and anchors, deploy allow-list,
  reproducible build and ledger (`test/study.mjs`); access gate (`test/gate.mjs`);
  deployed pages and CSP (`test/routing.mjs`).
- `npm run preview` serves the local review site with the `vercel.json`
  redirects, headers and allow-list (without the production login);
  `node test/browser.mjs` (which starts its own preview) checks every page, card alignment at six widths and 200% zoom, text contrast and the feedback flow, and in Chromium at desktop and phone
  width and follows old bookmarks.
- `npm run test:legacy` — tests of preserved, non-deployed earlier material.

## Lesson feedback

An optional feedback form ends every lesson and posts to `/api/feedback`, which
stores comments in Upstash Redis once the owner connects it. See `docs/feedback.md`
for setup, and for how to read and delete comments.

## Deployment and scope

Vercel serves the site through the Git-connected project and the unchanged
password gate (`middleware.js`, `gate/`). `.vercelignore` is an allow-list: only
the 74 pages, `semester-1/assets/study.css`, the old-link forwarder
`semester-1/assets/old-links.js` and the gate are uploaded; earlier dashboards,
planners, quiz pages, other subjects, notes and tools stay in the repository
only. Old URLs redirect as listed in `docs/compatibility-map.md`.

All lesson text is original study material written for this library; it is not a
reproduction of publisher textbooks, videos or courses. The Sources and credits
page of each subject lists the open references, the OpenStax Chemistry 2e credit
(CC BY 4.0) and optional external Pearson Channels videos, which may need an
account and are not required. The lecturer’s current outline decides assessed
scope and order.

## Historical project background

The domain owner authorized replacing the retired Quran application on 14 September 2026; that project has moved elsewhere. The original commit is 0442e18b2ea4f7eb74293e1f3dcfa7ce8d34670f and a full Git bundle was saved outside this checkout before changes.

Three independent tracks: Cengage/Pearson books, Educator, Pearson+. No content merge. Initial state records audit limits and pending student/parent acceptance. Pearson inventory is metadata and publisher links, not hosted video or textbook copies.

Existing server-side access gate is preserved, including existing environment variable names and cookie format, to preserve private access. Old user browser storage is not read or deleted. New project state uses science-project-v1. Browser state is device-local, not cloud-synchronized or connected automatically to AI conversations. JSON export/import transfers state; Markdown export is an agent handoff. IndexedDB attachments are local and excluded from JSON exports. Original attachments must be kept separately.

The earlier platform used a wider dashboard. Its material and data remain in
version control; the current student experience is the focused library above.
