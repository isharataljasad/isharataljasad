# CLAUDE FULL-SITE FINISHING WORK ORDER

You are working on the production Quran tadabbur application:

- Production URL: https://www.isharataljasad.com/
- GitHub repository: `isharataljasad/isharataljasad`
- Working branch: `claude-full-site-finish-20260820`
- Base: latest `main` after merged H04 release PR #3
- Product identity: **بلّغوا عني ولو آية · مسار الفؤاد للتدبر · من بيت الفؤاد**

Your job is NOT to redesign one page or patch one bug. Your job is to perform a **complete product-quality finishing pass for the entire site**, covering UX, visual design, responsive behavior, accessibility, resilience, security, performance, copy consistency, navigation, and production readiness — while preserving the project's locked Quranic and research boundaries.

## 1. FIRST: INSPECT BEFORE EDITING

Before making changes, inspect the whole repository and current production behavior. Read at minimum:

- `index.html`
- `style.css`
- `js/app.js`
- `js/views.js`
- `js/store.js`
- `js/corpus.js`
- `js/versions.js`
- `middleware.js`
- `gate/*`
- `docs/*`
- `security/*`
- `test/*`
- `.github/workflows/locked-production.yml`
- `package.json`

Also inspect the production site on desktop and mobile dimensions. Do not assume the public crawler is current; repository `main` plus live runtime behavior are the source of truth.

Do not ask me routine design questions. Make strong professional decisions yourself, but obey every hard lock below.

## 2. HARD LOCKS — DO NOT VIOLATE

### Quranic corpus lock
The corpus is content, not design material. Do not rewrite, paraphrase, shorten, expand, modernize, correct, merge, split, reorder, or infer new Quranic/tadabbur content.

Current released corpus:

- H01 = 33 cards
- H02 = 38 cards
- H03 = 37 cards
- H04 = 77 cards
- TOTAL = 185 cards

`verse_text`, `tadabbur_text`, card IDs, hizb IDs, order, surah, and ayah labels are immutable unless a separate explicit corpus-correction instruction is supplied later.

The Supabase `cards` table is the runtime corpus source. Do not replace it with generated content.

### Architecture lock
Read `js/versions.js` and `docs/QURAN_ARCHITECTURE_v0.3_H04.md`.

The runtime architecture remains:

- `qav-0.2-provisional`

The research architecture after H04 is:

- `qav-0.3-provisional`

Do NOT silently inject qav-0.3 candidate findings into the executable user flow.

In particular:

- N15 القصد / النية is still a candidate research node.
- N09 الاستعانة is a research support-modulator candidate.
- Research findings are not permission to make new religious claims in UX copy.
- Behavioral support model version remains independently versioned from Quranic architecture.

### Sharia/content discipline
The governing rule is:

> لا يكفي أن يكون التدبر ممكنًا من الآية؛ يجب أيضًا ألا ينفي، يضيّق، يوسّع، أو يوهم حكمًا شرعيًا على خلاف ما قرره القرآن والسنة الصحيحة.

And:

> الدقة قبل البلاغة.

Therefore do not introduce new religious explanations, promises, causal claims, verdicts, recovery claims, spiritual scoring, or theological interpretation in the interface.

### No algorithmic overreach
Do not present the app as diagnosing the user, reading the heart, scoring faith, measuring sincerity, inferring religiosity, classifying sin, predicting acceptance, or determining divine approval.

Do not add scores, percentages, streaks, gamified points, spiritual rankings, badges, leaderboards, or coercive progress mechanics.

### Privacy lock
The present app deliberately keeps user writing local to the device unless existing architecture explicitly does otherwise. Do not introduce cloud storage, analytics of private notes, AI analysis of private text, trackers, or third-party behavioral profiling without an explicit future decision.

## 3. PRODUCT GOAL

The finished experience should feel like a serious, calm, premium Arabic product — not a prototype, not a dashboard template, and not a social-media page.

The experience should make the user feel:

1. I know where I am.
2. I can enter a Quranic encounter without friction.
3. The Quranic text is visually primary.
4. Tadabbur is readable and calm.
5. My own observation comes before any downstream categorization.
6. My writing is safe on this device.
7. I can stop at any point without the interface implying failure.
8. I can return later and find what I wrote and chose.
9. H01–H04 feel like one coherent product.
10. The site belongs clearly to بيت الفؤاد while retaining the identity of this specific path.

## 4. FULL UX / IA REVIEW

Audit and improve the complete information architecture, including:

- top bar / brand
- mobile menu
- desktop navigation
- encounter screen
- Quran card hierarchy
- tadabbur hierarchy
- observation writing area
- disclosure after observation
- life-link bridge
- direction / choice area
- support module
- previous / next navigation
- hizb selector
- cross-hizb switching
- "ما كتبتُه"
- "ما اخترتُه"
- return / recovery flow
- periodic return flow
- export
- erase data flow
- text-size controls
- safety/help dialog
- logout / access gate
- loading states
- empty states
- offline/cache states
- error states

Do not merely beautify these surfaces. Make the interaction model clearer, calmer, and easier to understand.

## 5. VISUAL DESIGN PASS

You have freedom to improve visual design substantially while keeping the product quiet and reverent.

Target qualities:

- Arabic-first RTL composition
- excellent typography
- generous but not wasteful spacing
- strong hierarchy
- excellent Quran text readability
- visually distinct but harmonious areas for Quran / tadabbur / user reflection
- dark calm palette consistent with بيت الفؤاد
- restrained gold / warm accent only where useful
- no decorative clutter
- no generic icon overload
- no glossy SaaS-dashboard look
- no neon gradients
- no childish gamification
- no unnecessary animation

Prefer semantic CSS and a small coherent design system rather than scattered one-off values.

Create or refine tokens for:

- spacing
- font sizes
- line heights
- radii
- borders
- surfaces
- text hierarchy
- focus states
- disabled states
- responsive breakpoints

Keep existing locally hosted Arabic fonts where appropriate. Do not introduce unnecessary external dependencies.

## 6. MOBILE IS A FIRST-CLASS TARGET

The site must be excellent on real phones, especially narrow Android/iPhone widths.

Test at least:

- 320 px
- 360 px
- 390 px
- 430 px
- 768 px
- desktop 1280+

Fix:

- cramped controls
- accidental horizontal scroll
- over-tall headers
- unreadable line length
- keyboard overlap with textareas
- poor touch targets
- drawer focus problems
- sticky elements hiding content
- safe-area issues
- textarea resize/scroll friction
- buttons wrapping badly
- Quran line-height problems

Do not solve mobile issues by shrinking text to unreadable sizes.

## 7. ACCESSIBILITY

Aim for WCAG 2.2 AA behavior where feasible for this static app.

Audit and improve:

- semantic landmarks
- heading order
- keyboard navigation
- visible focus
- aria state
- dialog behavior
- drawer behavior
- form labeling
- button names
- touch target size
- contrast
- reduced motion
- screen-reader announcements
- RTL reading order
- error messages
- text scaling

Preserve the existing principle that off-screen mobile navigation must not remain in the tab order.

## 8. ENCOUNTER EXPERIENCE — CORE QUALITY BAR

This is the most important surface.

Improve it so the visual order is unmistakable:

1. Hizb context / location
2. Ayah
3. Tadabbur
4. User observation
5. Only after the user has written: downstream bridge
6. Optional direction
7. Optional behavioral support

The interface must never front-load category vocabulary before the user's own observation.

Do not make the user feel forced to produce an action from every ayah.

Preserve the existing complete-session behavior for "لا" and "ليس الآن".

Preserve the rule that ambivalence or unknown blocker must not fabricate a plan.

## 9. HIZB EXPERIENCE

H01–H04 must feel fully supported.

Improve the hizb selection screen so it is obvious:

- which hizb is active
- each hizb's range
- switching is safe
- user notes are not lost
- loading/offline fallback is understandable

Do not introduce a competitive completion percentage.

The corpus loader must remain generalized; do not reintroduce hard-coded card-count gates.

## 10. USER WRITING / RETURN EXPERIENCE

Improve `ما كتبتُه`, `ما اخترتُه`, and `العودة` so they feel like useful personal surfaces rather than raw data views.

Requirements:

- clean grouping
- easy reopening of the original card
- dates/context where useful
- clear distinction between original observation and later revision if shown
- no false interpretation of the user's writing
- no AI-generated summaries of private text
- no spiritual labels

The recovery flow must remain behaviorally neutral. Do not inject religious vocabulary into the generic lapse/recovery interface.

## 11. RESILIENCE / OFFLINE / DATA SAFETY

Review the network-first + local-cache approach in `js/corpus.js` and local event-log behavior in `store.js`.

Improve user-facing states if needed, but preserve:

- drafts survive navigation/reload
- append-only event history behavior
- network failure falls back to valid cached corpus
- corrupt network corpus is rejected rather than silently rendered
- local user data is not silently discarded
- erase action remains explicit and destructive only after confirmation
- export remains reliable

Do not weaken these guarantees for visual simplicity.

## 12. PERFORMANCE

Audit:

- initial HTML/CSS/JS weight
- render-blocking resources
- unnecessary DOM churn
- re-render/focus restoration cost
- repeated listeners
- layout shift
- font loading
- caching behavior
- mobile responsiveness

Keep this a lightweight application. Do not migrate to React/Next/Vue/Svelte just to polish the UI. The current no-build/static architecture is a feature unless there is an overwhelming reason otherwise — and if so, do not migrate in this task.

## 13. SECURITY

Run and respect the existing security checks.

Review:

- CSP
- middleware/access gate
- client-side secret scan
- Supabase publishable key usage
- XSS risk in rendered user text
- unsafe innerHTML patterns
- URL handling
- export behavior
- logout
- cookies/session behavior

Do not weaken CSP by adding `unsafe-inline` or `unsafe-eval` just to make styling easier.

Never commit service-role keys, private secrets, tokens, passwords, or admin credentials.

## 14. COPY / BRAND CONSISTENCY

Audit all user-visible Arabic copy for product consistency only.

You MAY improve interface microcopy where it is purely operational.

You MAY NOT edit Quranic/tadabbur corpus text.

Use one coherent identity:

- **بلّغوا عني ولو آية**
- **مسار الفؤاد للتدبر**
- **من بيت الفؤاد**

Remove obsolete references to unrelated health/Bio-OS/MasarCare branding from this Quran path unless a safety/legal reason requires a neutral بيت الفؤاد reference.

Do not turn the site into a marketing landing page. Product use comes first.

## 15. SEO / METADATA / PWA BASICS

Improve only what is appropriate for the authenticated/protected nature of the product.

Review:

- title
- description
- canonical
- theme color
- favicon/app icon
- manifest if present
- installability basics if already supported
- mobile home-screen quality

Do not accidentally expose protected/private application content through indexing configuration.

## 16. TESTING — REQUIRED

Before you declare completion:

1. Run `npm ci --ignore-scripts` if needed.
2. Run `npm test`.
3. Run `bash security/verify-clientside-secrets.sh`.
4. Fix every failure caused by your changes.
5. Add tests for meaningful new behavior.
6. Do not delete tests just to make CI green.
7. Update locked hashes only for files intentionally changed and only after reviewing the diff.

Also manually verify the main user journey:

- login/access gate
- H01 load
- H02 load
- H03 load
- H04 load
- write observation
- navigate away and back
- choose life-link answer
- save direction
- support module conditions
- switch hizb
- open `ما كتبتُه`
- open `ما اخترتُه`
- return flow
- export
- erase confirmation
- mobile drawer
- text scaling
- safety dialog
- offline cached corpus behavior where feasible

## 17. IMPLEMENTATION DISCIPLINE

- Work only on `claude-full-site-finish-20260820`.
- Make changes directly; do not stop at an audit report.
- Prefer simple maintainable solutions.
- Do not add libraries without a strong reason.
- Do not create duplicate CSS systems.
- Remove dead code only when verified unused.
- Preserve backward compatibility for existing localStorage data.
- Preserve event version stamps.
- Keep research architecture and runtime architecture explicitly separate.

## 18. REQUIRED DELIVERABLES

When finished:

1. Commit all changes to the working branch.
2. Create a pull request to `main` titled:
   `Finish and polish the full Quran tadabbur site`
3. In the PR description include:
   - UX changes
   - visual changes
   - mobile changes
   - accessibility changes
   - resilience/data-safety changes
   - performance changes
   - security changes
   - files changed
   - tests run and exact result
   - explicit confirmation that Quranic corpus text was not modified
   - explicit confirmation that qav-0.3 research candidates were not silently promoted into runtime behavior
4. Do NOT merge the PR yourself.
5. End your response to me with exactly these sections:

### WHAT I CHANGED
### WHAT I DELIBERATELY DID NOT CHANGE
### TEST RESULTS
### REMAINING RISKS
### PR LINK

## 19. FINAL ACCEPTANCE STANDARD

Do not call this complete merely because it looks better.

The task is complete only when the site is:

- visually coherent
- calm and premium
- excellent in Arabic RTL
- excellent on mobile
- understandable without explanation
- robust under reload/navigation
- safe with user writing
- accessible by keyboard
- clean under CI/security checks
- fully supports H01–H04
- faithful to the locked corpus
- faithful to "الدقة قبل البلاغة"
- still explicitly PROVISIONAL in research architecture after 4/60 hizbs

Proceed now. Inspect, implement, test, commit, and open the PR. Do not stop after recommendations.