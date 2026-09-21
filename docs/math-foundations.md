# Math Foundations text library

> These chapters are the **written teaching guide** route of the three-route model. Each one is registered as a concept in `program/concepts.mjs`, which also records its unit, its prerequisites and which other routes exist. See [curriculum-spine.md](curriculum-spine.md).

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

The early reading edition currently has eleven original chapters in the local build. Their source Markdown is under `foundations/reading/source/`; `tools/build-foundation-reading.mjs` generates the HTML. The chapter catalog contains 296 canonical episodes and links only the written chapters. The other 285 catalogue entries have no written-library chapter linked. Each written chapter explains the concepts and conditions before its selected question types and worked answers. A source file record is never labeled a written chapter merely because its transcript exists.

The [three-model pilot](foundation-models.md) adds separate live approaches to one Algebra concept. It is reached from `/foundations/` after the four folder cards. It does not change the eleven-chapter count or claim another episode is complete.

A chapter needs two registrations: a `[track, episode, path]` entry in the `lessons` list in `tools/build-foundation-reading.mjs`, and a `url` for that episode in `foundations/reading/catalog.json`. A Markdown file that is present but unregistered now stops the build and names itself; it used to be skipped in silence. The renderer understands `##`, `###`, `-` bullets, numbered lists, tables, `**bold**`, `` `code` `` and links to other chapter files by relative Markdown path.

Before adding a chapter, review the relevant transcript and independent references, identify assumed prerequisites and missing questions, then write new prose, examples, figures, question families, and answers. Do not copy transcript wording, exercises, frames, or branded teaching sequences. Check the mathematics and links, then rebuild both the reading pages and the folder index so the status remains accurate.

## Connections to Semester 1

Course topic panels point to the relevant Foundation subject folder. The legacy `/semester-1/foundations/` route redirects old section anchors to those folders. The previous practice engine files remain in the repository for reference, but `/foundations/` no longer loads them. Its old `?skill=` query is ignored by the static folder index, so existing bookmarks reach the folders instead of starting a question.

The site's password gate remains in place. The published index and early chapters do not claim that all 296 topics are taught or mastered.
