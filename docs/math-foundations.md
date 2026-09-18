# Shared Math Foundations

## Purpose and scope

This library is optional support for a science problem, not a prerequisite course. It now has four visible entry areas: **Basic Math** (`ratios`, `signs`, `notation`, `units`), **Algebra** (`formulas`, `graphs`, `logs`), **Geometry** (`area-volume`, `right-triangles`, `similarity`), and **Trigonometry** (`trigonometry`, `vectors`). `change` is a separate bridge into Calculus I. The skill IDs remain stable at `/foundations/?skill=<id>` and can receive a same-site `from` topic path, which provides a return link. The Semester 1 manifest maps specific mathematical obstacles to these IDs; future semesters should reuse the IDs, adding lessons only when a distinct skill is required.

The first layer covers number and ratio sense, signed arithmetic, powers of ten, units and precision, formula rearrangement, graph slope, area and volume, right-triangle distance, similar-shape scale, radians and components, logarithms, and the average-to-local-rate bridge. These are selected for current MA 101, PHY 101, and CHEM 101 questions or immediate preparation. Detailed integration, multivariable calculus, differential equations, probability and statistics, and advanced data analysis belong with later confirmed course scope. The published college plan establishes provisional scope; this map does not assert an official teaching order.

Prerequisites are suggestions, not locks: `ratios → signs → notation → units`; `ratios → formulas → graphs → change`; `units → area-volume → similarity`; `ratios → right-triangles → trigonometry → vectors`; `notation + formulas → logs`; `graphs` also supports `vectors`. Links in the lesson show the earlier steps. A student who solves the diagnostic can go directly to the independent check.

## Evidence from the three existing engines

Inspected the local `MATH-BOK.docx`, `MATH-EDU.docx`, `MATH-PEA.docx`, `Learning Engines.docx`, and the native `/ma101/book/`, `/ma101/educator/`, `/ma101/pearson/` routes. The site routes contain 39 Book cards, 39 Educator cards, and 29 Pearson cards. This review did not inspect every page of the source calculus PDF or the original subtitle RAR; it uses the available authored guides and their site implementations.

| Engine | Reusable strength seen in the material | Limitation addressed here |
| --- | --- | --- |
| Book | Principle, condition, worked solution, common trap, and compact equation retrieval. Its domain examples show why a rule is valid. | The full 39-card route is too much when a single algebraic step blocks a physics or chemistry problem. |
| Educator | Meaning → method → worked reasoning → independent check. The written route reconstructs explanation without requiring video. Its secant-to-tangent sequence is useful for rates. | A student must still search a long calculus sequence to repair one cross-subject gap. Original subtitle completeness is not assumed. |
| Pearson | A clear first move, plausible wrong answer, specific correction, and another try. Optional videos are secondary to a self-contained card. | Revealing an answer or marking a card read does not demonstrate independent transfer; a long source catalog adds search work. |

The shared lesson uses a short diagnostic, names the likely difficulty, states the minimum idea and valid conditions, shows meaningful steps, offers optional supported work, then asks for a fresh skill check and a science transfer. The quick reference is at the end. Source context is recorded in this editorial document; the client-side lesson files contain only our teaching content.

### Additional source inventory and original lessons

The local `Downloads/Math Foundations/Educator.com` folder contains 296 SRT files: Basic Math (67), Algebra 1 (63), Algebra 2 (73), Geometry (70), and Trigonometry (23). We inspected the filenames and selected transcript passages on units, proportions, graph slope, measurement, right triangles, similarity, Pythagorean distance, prism volume, and angle/trig decisions. These are noisy transcriptions and do not certify every spoken explanation or diagram. They inform topic selection and the likely order of a clear explanation; they are not copied into the student site. The newly written geometry lessons live in `foundations/assets/geometry.mjs`; original SVG figures and tables live in `foundations/assets/visuals.mjs`. The student interface has no source-provider labels or video dependency.

This is a curated first layer, not a claim that all 296 source lessons have been rebuilt or that a student has mastered a whole subject. The first release stays behind the existing site password gate. Review mathematical checks, accessibility, and source provenance as new lessons are added, and complete a separate rights and editorial review before any release without the gate.

Editorial rule for later expansion: start with a specific obstacle in Calculus I, Physics, or Chemistry; identify the smallest missing skill; write our own explanation, example, figure or table and a different independent check; connect it back to that science topic. Do not copy a transcript, slide, source exercise, branded teaching sequence, or video frame. Keep the four areas as useful entry points, not locked courses. Add linear algebra, multivariable work, differential equations, and probability/statistics as linked layers when the student's confirmed courses require them. Preserve the distinction between an unaided check and durable mastery.

## Practice records

Records use browser local storage key `yic:math-foundations:v1`, separate from existing science topic records. Each skill has a `questionVersion`; a changed version discards its old answers. A diagnostic or supported step records **Practised**. A wrong answer, hint, or revealed reasoning records **Needs review** until the student answers a *different* skill problem and a *different* science transfer unaided on their first attempt. Those two fresh checks record **Solved independently**, a limited practice observation, not mastery. Revealing a solution never turns that same question into independent success. If a question is revised, increment its version, including its retries.

The first release uses selected answer types: numeric results, method choice, interpretation, and error identification. Wrong choices and common numeric errors receive specific feedback labelled conceptual, algebraic, numerical, graphical, or units. New values alone are insufficient for some skills, so independent questions also test method or interpretation. Delayed recall across days, broader item banks, teacher review, and cross-device progress are future work. No mastery or exam-readiness claim is made from these checks.

## Integration

The shared navigation link is on the Semester 1 hub, course pages, and topic pages. Topic panels name the immediate math obstacle and pass the topic URL as a return path. The old `/semester-1/foundations/` route redirects legacy anchors into the shared library. A `from` path is accepted only for a Semester topic on this site.

The `tools/connect-foundations.mjs` mapping is the source for Semester 1 topic links and the manifest's `foundationSkills` fields. When a later semester is built, its own topic mapping should point at these IDs rather than copy the lessons. Preserve the existing access middleware and separate science practice records.
The new Geometry links currently point from Physics measurement and forces. Geometry lessons include Chemistry and engineering transfer cases; a Chemistry topic link should be added only where the topic actually asks for that geometric decision. Similarity is available in the library and can gain a topic link when it solves a confirmed course obstacle.
