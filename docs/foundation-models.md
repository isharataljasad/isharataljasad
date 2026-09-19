# Three Foundation models pilot

`/foundations/models/` presents three original, independent approaches to one Algebra concept, `ALG-FUNCTION-01` (functions and allowed inputs). The four-folder Foundations index and its 297 source-file records remain the primary library. This pilot is one concept, not three completed curricula and not the eventual combined engine.

| Student route | Editorial role | Source evidence used for the pilot |
| --- | --- | --- |
| Foundation 1 · Curriculum map | Show prerequisites, precise definitions, conditions, later uses, and coverage gaps. | Local `MATH-BOK.docx`, section “Functions and their allowed inputs,” plus the existing Algebra catalog. |
| Foundation 2 · Guided practice | Explain one decision, identify a specific error, retry with a changed case, and offer a narrow optional visual link. | Local `MATH-PEA.docx`, section “Functions, domains, and piecewise rules.” Its optional link points to the official [Introduction to Functions topic](https://www.pearson.com/channels/calculus/learn/patrick/00-functions/introduction-to-functions#assetId=3e52649e), which lists a five-minute “Relations and Functions” video. Link checked 19 September 2026; playback access was not established. |
| Foundation 3 · Kickstart guide | Reconstruct the meaning, representations, mechanism, worked cases, boundary checks, and distinct questions as self-contained text. | Supplied Algebra 1 subtitles A1 14 “Relations” and A1 15 “Functions,” cross-checked against the other two sources for missing steps. |

Student pages use only the neutral Foundation 1, 2, and 3 labels. The prose, examples, answer explanations, and SVG are original. The optional link goes to the source's own page; no source video, transcript, diagram, or book page is copied into this site. The student can complete each route without opening the video.

## Build and acceptance

The source text is under `foundations/models/source/`. Run `node tools/build-foundation-models.mjs` after editing it. The build produces one comparison page, one concept entry, and three routes. `test/foundation-models.mjs` checks the links, model separation, explanation-before-question order, and neutral student headings.

Before extending beyond this pilot, inventory the four-area curriculum against the candidate books and the 296-episode source map. Record gaps and publish new lessons only after their explanation and worked answers are reviewed. Compare the three routes with a real learner before deciding how to merge them. In the future single page, keep one concept ID; take the coverage and conditions from Foundation 1, the complete written starting path from Foundation 3, and the optional visual and targeted repair from Foundation 2 when they help. A video is never a prerequisite, and a correct answer to one question is not a mastery claim.
