# Math Foundations text library

## Student entry

`/foundations/` opens with four subject folders: Basic Math, Algebra, Geometry, and Trigonometry. It does not load the former question-first practice application. Each folder lists every supplied subtitle file by episode and exact file name. Each file has a record page with an honest writing status. A record links to an original written chapter only when that chapter exists.

The original source files remain in the user's local `Downloads/Math Foundations/Educator.com` directory. Their transcript text is not published on the student site. The committed `foundations/source-files.json` and generated pages index their names and canonical episode identities. Use `node tools/build-foundation-index.mjs --import <source-directory>` to rebuild the index from the local files, then `node tools/build-foundation-index.mjs` for routine regeneration from the committed manifest. The import checks source titles against `foundations/reading/catalog.json`.

| Folder | Source files | Distinct episodes |
| --- | ---: | ---: |
| Basic Math | 67 | 67 |
| Algebra 1 + Algebra 2 | 136 | 135 |
| Geometry | 71 | 71 |
| Trigonometry | 23 | 23 |
| **Total** | **297** | **296** |

Two Algebra 2 transcript files belong to episode 30. Both are listed separately, while their episode is counted once. The source index is a file inventory, not 297 completed explanations.

## Written chapters

The early reading edition currently has seven original chapters. Their source Markdown is under `foundations/reading/source/`; `tools/build-foundation-reading.mjs` generates the HTML. The chapter catalog contains 296 canonical episodes and links only the written chapters. The other 289 are marked unwritten. Each published chapter explains the concepts and conditions before its selected question types and worked answers. A source file record is never labeled a written chapter merely because its transcript exists.

The [three-model pilot](foundation-models.md) adds separate live approaches to one Algebra concept. It is reached from `/foundations/` after the four folder cards. It does not change the seven-chapter count or claim another episode is complete.

Before adding a chapter, review the relevant transcript and independent references, identify assumed prerequisites and missing questions, then write new prose, examples, figures, question families, and answers. Do not copy transcript wording, exercises, frames, or branded teaching sequences. Check the mathematics and links, then rebuild both the reading pages and the folder index so the status remains accurate.

## Connections to Semester 1

Course topic panels point to the relevant Foundation subject folder. The legacy `/semester-1/foundations/` route redirects old section anchors to those folders. The previous practice engine files remain in the repository for reference, but `/foundations/` no longer loads them. Its old `?skill=` query is ignored by the static folder index, so existing bookmarks reach the folders instead of starting a question.

The site's password gate remains in place. The published index and early chapters do not claim that all 296 topics are taught or mastered.
