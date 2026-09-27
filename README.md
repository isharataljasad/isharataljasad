# Bayt Al-Fuad · Semester 1 study library

The student entrance (`/`, `/bayt/`, `/semester-1/`) shows Mathematics, Physics
and Chemistry only. The subjects have 26 topic guides (9 + 8 + 9) and three
reading routes each — Book (reference & formulas), Pearson (methods & worked
examples), Educator (concepts & explanations). Every route lists the Semester 1
topics first; a Compare bar on each topic opens the same topic in the other
routes or the full guide. There are no quizzes, answer fields, scores or
progress requirements; every worked solution is visible.

## Where things live

- `tools/content/<course>/<topic>.mjs` — the teaching text of the 26 topics
  (original English), with computed figures and a `checks` list of numerical claims.
- `tools/data/study-library.json` — the 333 original collection notes, placed by
  `semester-1/curriculum.json` (topic resources) and `tools/data/route-plan.json`
  (background / related / beyond Semester 1).
- `tools/build-study.mjs` — the only builder of student pages (all `build:*` scripts).
  Earlier builders are preserved but refuse to run (`tools/lib/legacy-guard.mjs`).
- `docs/semester1-readiness-2026-09-27.md` — coverage map and remaining gaps.

## Maintain and verify

- `npm ci --ignore-scripts`
- `npm run build:study` rebuilds the 44 student pages (deterministic).
- `npm test` — student flow, content completeness and 232 numerical checks, links
  and anchors, deploy allow-list, reproducible build (`test/study.mjs`); access gate
  (`test/gate.mjs`); deployed pages and CSP (`test/routing.mjs`).
- `npm run test:legacy` — tests of preserved, non-deployed earlier material.
- `npm run preview` serves the local review site (without the production login).

## Deployment and scope

Vercel serves the site through the Git-connected project and the unchanged
password gate (`middleware.js`, `gate/`). `.vercelignore` is an allow-list: only
the 44 study pages, their images, `semester-1/assets/study.css` and the gate are
uploaded; earlier dashboards, planners, quiz pages, other subjects, notes and
tools stay in the repository only. Old URLs redirect to `/` (`vercel.json`).

All route text is original study material written for this library in the style
of each approach; it is not a reproduction of publisher textbooks, videos or
courses. Pearson video links are external and may need an account. Chemistry
Book notes are adapted from OpenStax Chemistry 2e (CC BY 4.0), credited on the page.
The lecturer’s current outline decides assessed scope and order.

## Historical project background

The domain owner authorized replacing the retired Quran application on 14 September 2026; that project has moved elsewhere. The original commit is 0442e18b2ea4f7eb74293e1f3dcfa7ce8d34670f and a full Git bundle was saved outside this checkout before changes.

Three independent tracks: Cengage/Pearson books, Educator, Pearson+. No content merge. Initial state records audit limits and pending student/parent acceptance. Pearson inventory is metadata and publisher links, not hosted video or textbook copies.

Existing server-side access gate is preserved, including existing environment variable names and cookie format, to preserve private access. Old user browser storage is not read or deleted. New project state uses science-project-v1. Browser state is device-local, not cloud-synchronized or connected automatically to AI conversations. JSON export/import transfers state; Markdown export is an agent handoff. IndexedDB attachments are local and excluded from JSON exports. Original attachments must be kept separately.

The earlier platform used a wider dashboard. Its material and data remain in
version control; the current student experience is the focused library above.
