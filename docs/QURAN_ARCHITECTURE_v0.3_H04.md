# Quran Architecture v0.3 — H04 Delta

**Project:** بلّغوا عني ولو آية · مسار الفؤاد للتدبر · بيت الفؤاد  
**Source:** `H04_EPISODE_MAP_AND_ALGORITHM.txt`  
**Corpus:** H04 = Al-Baqarah 203–252 · 77 independently locked cards  
**Status:** **PROVISIONAL AFTER 4/60 HIZBS**

> This document records a research architecture delta. It does not declare a final Qur'anic algorithm and it does not silently inject candidate nodes into the user-facing flow.

## Baseline

The last formally audited architecture snapshot before H04 was the post-H02 `v0.2` registry with N01–N14. H03 did not produce a formally locked Algorithm Delta, so H04 is merged over that audited baseline while the corpus coverage count advances to 4/60.

## H04 title and central question

**من القول إلى الثبات**

كيف يتحول ما تعرفه من الحق إلى معيارٍ وقصدٍ وحدٍّ وفعلٍ ثابت حين تتدخل الشهوة والخصومة والخوف؟

## New node candidate

### N15 — القصد / النية

- **Type:** Intent state / control modifier
- **Status:** Candidate — not core
- **Evidence:** H04 only at this stage
- **Proposed position:** `N04 المعيار → N15 القصد/النية → N06 الاختيار/الاستجابة`
- **Guard:** the system may ask the user to state purpose; it must never claim knowledge of hidden intention or score sincerity.

Representative evidence: H04-30, H04-39, H04-43, H04-47, H04-50, H04-67.

## Reinforced nodes

- **N04 المعيار — CORE:** strongly reinforced as multi-dimensional: benefit/harm, dunya/akhirah, religion over admiration, ma’ruf, priority under competing interests, competence in authority.
- **N07 حد المسؤولية — CONDITIONAL:** strongly reinforced; capacity, rights, no-harm, divine limits, ma’ruf, child interest and priority rules may bound action.
- **N09 الاستعانة — CANDIDATE SUPPORT MODULATOR:** moves beyond H01-only evidence through H04. It is modeled as cross-stage support, not a fixed linear step.
- **N11 المراجعة — CORE:** H04 strengthens reality-testing of claims, readiness, action and outcomes.
- **N12 العودة / المثابة — CORE:** further confirmed as return/repair under relevant conditions.
- **N13 التكرار — PROVISIONAL:** reinforced, but no universal threshold or causal chain is proven.
- **N14 الصفة / الصبغة — EMERGING:** reinforced as an outcome pattern, not an automatic result.

## H04 transition delta

- `T-H04-01` N01 → N04 — strong candidate / strengthen
- `T-H04-02` N04 → N15 — candidate
- `T-H04-03` N15 → N06 — candidate
- N06 → N07 — strengthened but remains conditional
- N07 → N08 — strengthened but remains conditional
- `T-H04-06` N08 → N11 — strong candidate reality-test edge
- N11 → N12 — strengthened optional feedback edge
- N13 → N14 — strengthened but remains provisional and non-causal
- N09 is represented with candidate support-modulator overlays into N02 / N06 / N08 / N12 rather than one mandatory sequence.

## H04 mechanisms

1. **Claim ≠ truth:** seek confirming action and context.
2. **Intent modifies action:** preserve declared purpose when the corpus makes purpose relevant.
3. **Boundary before execution:** check divine limit, capacity, rights, no-harm and priority where relevant.
4. **Discomfort ≠ wrong:** dislike/fear/difficulty alone does not invalidate a commanded or good action.
5. **Hope = causes + mercy:** take causes without relying on the action instead of God’s mercy.
6. **Small test → readiness signal:** a signal only, never an infallible diagnosis.
7. **Assistance is cross-stage:** guidance, patience, steadiness and outcome are sought while causes are taken.
8. **Repair must not become harm:** lawful return/reconciliation remains bounded by reform and non-harm where relevant.
9. **Long-horizon measure:** worldly appearance, abundance or immediate comfort is not a sufficient measure of truth, rank or ultimate good.
10. **Understanding should move to action:** H04 repeatedly directs understanding of limits toward implementation.

## Code-ready research states

```text
intent_state:
  declared_purpose
  reform_intent
  harm_intent
  sincerity_signal
  confidence_level

evidence_check:
  claim_text
  observed_action
  context_clues
  consistency_status

boundary_state:
  sharia_limit
  capacity_limit
  rights_of_others
  no_harm_constraint
  priority_rule
  known_norm_context

test_state:
  small_test
  response
  readiness_signal

assistance_state:
  guidance_sought
  patience_sought
  steadiness_sought
  causes_taken

repair_state:
  error_or_harm_detected
  return_available
  reform_condition
  rights_to_restore
```

### Guards

- `intent_state` is user reflection only; the system must not infer hidden intentions.
- `evidence_check` is reflective comparison, not diagnosis or labeling.
- `readiness_signal` is provisional, not deterministic.
- No new node or edge in this delta is permitted to become a user-facing theological judgment.

## Provisional H04 flow

`البيان → قلب قابل → معيار → قصد/نية → اختيار → حد مسؤولية → فعل → أثر → مراجعة الواقع → عودة/إصلاح عند الحاجة → تكرار → صفة متشكلة`

With:

`الاستعانة بالله = cross-stage support, not one closed step`

## Runtime boundary

The research registry is now **v0.3 / 4 of 60**.

The current browser runtime remains stamped `qav-0.2-provisional` because the H04 additions are candidate/modulator findings and have **not** been injected into the user's executable flow. The code exposes `QURAN_RESEARCH_ARCHITECTURE_VERSION = "qav-0.3-provisional"` so the research snapshot is explicit without overstating operational certainty.

Promotion of v0.3 into the executable runtime requires a later gate confirming which candidate edges may safely affect user-facing behavior.

---

**الدقة قبل البلاغة.**
