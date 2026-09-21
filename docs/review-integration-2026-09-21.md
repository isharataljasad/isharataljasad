# Review integration 21 September 2026

Codex independently ran all 18 test scripts successfully on Claude's changes. The gate's 42 checks passed. Source changes for routing, external stylesheets, feedback, Markdown rendering and table accessibility were inspected.

## Corrections to the handoff

Python 3.12 and lxml are available in the bundled Codex runtime. In an isolated temporary copy, the semester builder followed by connect-foundations and connect-program ran successfully. All 26 topic pages reproduce. Two older overview pages (semester-1/index.html and semester-1/foundations/index.html) have existing navigation/copy differences after regeneration; the main working copy was not overwritten. This does not yet establish whole-site reproducibility.

A matching login page and Git commit do not prove that protected production pages were served correctly. Claude's content findings were local; deployment status and authenticated production inspection must be reported separately.

The preview is a static approximation, not a complete Vercel emulator. It does not implement authentication, production headers or redirects. It now binds only to loopback, handles malformed URL escapes, and does not reflect requested paths into error HTML. Stop its own process only; do not kill every Node process on the computer.

The CSP regression check now checks script and style hashes against their own directives. Claude's original check combined hashes from both directives, which could incorrectly approve a script whose hash appeared only in style-src.

## Scope

These repairs do not add missing curriculum chapters or establish learning effectiveness. Original inventory and outline-only labels remain accurate. The next teaching sample is Geometry episode 02, Points, Lines and Planes.
