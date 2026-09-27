# Old links and where they go

The integrated library replaces the three route collections (Book, Pearson,
Educator) and the separate subject hubs. Earlier bookmarks keep working as
follows. Checked in a local browser against `tools/preview-server.mjs`, which
applies the `vercel.json` redirects, the trailing-slash rule, the headers and the
`.vercelignore` allow-list (`node test/browser.mjs`). They have not been checked
on a Vercel preview or in production.

## Server redirects (`vercel.json`, temporary 307)

| Old URL | New URL |
|---|---|
| `/ma101` | `/semester-1/math` |
| `/phy101` | `/semester-1/physics` |
| `/chemistry` | `/semester-1/chemistry` |
| `/english`, `/english/…` (anything else under it) | `/semester-1/english` (before this change these went to `/`) |
| `/english/book`, `/english/pearson`, `/english/educator` | `/semester-1/english/old-links/<route>`, which forwards `#lesson-N` to the lesson listed for that block in the pack's `legacy-inventory.csv` |
| `/program…`, `/foundations…`, `/biology…`, `/bayt/…`, `/semester-1/coverage`, … | `/` (unchanged from aa7c04c) |

A URL fragment such as `#topic-motion` is never sent to the server. Browsers
keep it across a redirect, and the subject contents pages carry the same
`topic-<id>` ids that the old hubs had, so `/phy101#topic-motion` opens the
Physics contents at Vectors and motion.

## Old route pages (`/<course>/<book|pearson|educator>`)

These nine URLs are now small forwarding pages. Each one lists every anchor the
old page had and links it to the new place:

| Old anchor | Goes to |
|---|---|
| none | the subject contents |
| `#topic-<id>` | that lesson, e.g. `/ma101/book#topic-derivative` → `/semester-1/math/derivative` |
| `#topic-relative-motion`, `#topic-moles-and-formulas`, `#topic-chemical-naming`, `#topic-intermolecular-forces` | the new lessons (there were no such anchors before; added so the lesson ids work everywhere) |
| `#lesson-NN` (each of the 333 notes) | the lesson section named in the migration ledger, e.g. `/ma101/book#lesson-07` → `/semester-1/math/limits#more-examples` |
| `#lesson-NN` of an archived note | the subject contents (the note is outside the published description; its text is in `tools/data/study-library.json`) |
| `#support-<id>`, `#background`, `#related`, `#beyond`, `#equation-review` | the lesson or contents page that now carries that material |

`semester-1/assets/old-links.js` reads the fragment and calls
`location.replace()` with the listed link, so the old URL does not stay in the
history. It is the only script on the site, it is loaded only on these nine
pages, and it is a same-origin file, so the existing CSP (`script-src 'self'`)
allows it without a new hash. Without JavaScript the page is a readable,
clickable list.

## Sections that became lessons

The four support sections that Codex added in aa7c04c are now full lessons.
Their old anchors stay on the lessons they came from, as a one-line note with a
link:

| Old anchor | New lesson |
|---|---|
| `/semester-1/physics/motion#support-relative-motion` | `/semester-1/physics/relative-motion` |
| `/semester-1/chemistry/atomic-structure#support-amount-and-formulas` | `/semester-1/chemistry/moles-and-formulas` |
| `/semester-1/chemistry/bonding#support-chemical-naming` | `/semester-1/chemistry/chemical-naming` |
| `/semester-1/chemistry/bonding#support-intermolecular-forces` | `/semester-1/chemistry/intermolecular-forces` |

Lesson section anchors changed: `#definitions`, `#visual`, `#method` and
`#examples` still exist; `#why`, `#background`, `#idea`, `#formulas`,
`#mistakes` and `#scope` keep their ids, and `#different-case`,
`#more-examples` and `#further` are new. The per-note destinations are listed
in `docs/migration-ledger.md`.
