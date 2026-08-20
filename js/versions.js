/* ==========================================================================
   versions.js — SEPARATELY VERSIONED, PERMANENTLY.
   A behavioural finding must never bump the Quranic architecture version,
   and a Quranic architecture change must never bump the behaviour model.
   Both are stamped on EVERY event at the moment of writing.
   ========================================================================== */

/* Runtime remains on the last execution-safe architecture. H04 has produced a
   newer RESEARCH architecture snapshot, but its new N15/N09 relationships are
   still candidate/modulator findings and are not yet injected into user flow. */
export const QURAN_ARCHITECTURE_VERSION = "qav-0.2-provisional";
export const QURAN_RESEARCH_ARCHITECTURE_VERSION = "qav-0.3-provisional";
export const BEHAVIOR_SUPPORT_MODEL_VERSION = "bsmv-0.1";
export const SCHEMA_VERSION = 2;

/* qav-0.2-provisional — RUNTIME
     Execution-safe runtime architecture. User-facing flow is unchanged.
   qav-0.3-provisional — RESEARCH, after H04 (4 of 60)
     H04 delta recorded in the architecture registry.
     N15 القصد/النية is a candidate; N09 الاستعانة is a cross-hizb support
     modulator candidate. The research snapshot is not treated as final and is
     not silently injected into the user's path.
   bsmv-0.1
     One module: implementation intention + coping plan.
     Contains NO Quranic claim of any kind. */
