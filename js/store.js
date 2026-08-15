/* ==========================================================================
   store.js — INTEGRITY LAYER (Block 2, P1)

   RULE 1  The event log is APPEND-ONLY. Nothing is ever mutated or deleted
           except by explicit whole-store erase by the user.
   RULE 2  Editing an observation appends OBSERVATION_REVISED. The original
           OBSERVATION_CREATED keeps its text forever.
   RULE 3  Every event carries qav + bsmv at time of writing.
   RULE 4  Drafts are scratch, not events. They exist only so typing is never
           lost. A draft becomes an event on commit (explicit save, navigation,
           blur, or unload).
   ========================================================================== */

import { QURAN_ARCHITECTURE_VERSION, BEHAVIOR_SUPPORT_MODEL_VERSION, SCHEMA_VERSION } from "./versions.js";

const KEY = "foaad_v2";
const LEGACY_KEY = "foaad_h01_public_v1";

const blank = () => ({
  schema: SCHEMA_VERSION,
  createdAt: new Date().toISOString(),
  installId: uid(),          // local only; never transmitted (no transmission exists)
  hizb: "H01",
  cursor: {},
  drafts: {},                // scratch buffer — NOT events
  prefs: { scale: "md" },
  consent: { pilot: false, decidedAt: null },
  events: []
});

function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) ||
    (Date.now().toString(36) + Math.random().toString(36).slice(2));
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      s.drafts ||= {}; s.cursor ||= {}; s.events ||= [];
      s.prefs ||= { scale: "md" };
      s.consent ||= { pilot: false, decidedAt: null };
      return s;
    }
  } catch (e) { /* fall through to migration / blank */ }
  const fresh = blank();
  const migrated = migrateLegacy(fresh);
  persist(migrated);
  return migrated;
}

/* ---- LEGACY MIGRATION -----------------------------------------------------
   The v1 build overwrote observations in place, so prior text is already lost.
   We import what survives and mark it honestly: the architecture version at
   the time of writing is UNKNOWN and must never be reported as qav-0.2.      */
function migrateLegacy(s) {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null"); } catch { raw = null; }
  if (!raw) return s;
  const at = new Date().toISOString();
  const stamp = (type, cardId, payload) => s.events.push({
    id: uid(), type, at, cardId, hizbId: cardId ? cardId.split("-")[0] : null, payload,
    qav: "unknown-pre-v0.2", bsmv: "unknown-pre-v0.1", migrated: true
  });
  for (const [cardId, n] of Object.entries(raw.notes || {})) {
    if (n.observation) stamp("OBSERVATION_CREATED", cardId, { text: n.observation });
    if (n.category)    stamp("CATEGORY_SET", cardId, { categories: [n.category] });
    if (n.life)        stamp("LIFE_CONNECTION", cardId, { text: n.life });
    if (n.work)        stamp("DIRECTION_CHOSEN", cardId, { text: n.work });
    if (n.review)      stamp("REVIEW", cardId, { text: n.review });
    for (const r of n.returns || []) stamp("RETURN_PERIODIC", cardId, { target: r.target, text: r.text, kindUnknown: true });
  }
  for (const e of raw.events || []) stamp("LEGACY_EVENT", e.cardId || null, { legacyType: e.type, text: e.text, legacyAt: e.at });
  if (s.events.length) stamp("MIGRATION_NOTE", null, {
    from: LEGACY_KEY, note: "v1 overwrote observations in place; pre-migration revision history is unrecoverable."
  });
  return s;
}

let persistFailed = false;
let flushTimer = null;

function writeNow(s = state) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); return true; }
  catch (e) { persistFailed = true; return false; }   // quota / Private Browsing
}
/* Events persist immediately. Drafts persist on a short debounce so a long
   observation does not serialise the whole log on every keystroke — that is
   what janks on mid-range Android. Always flushed on blur/hide/unload. */
function persist(s = state) { return writeNow(s); }
function persistSoon() {
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { flushTimer = null; writeNow(); }, 400);
}
export function flush() { if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; } return writeNow(); }
export const persistDidFail = () => persistFailed;

/* ---- APPEND-ONLY WRITE --------------------------------------------------- */
export function append(type, payload = {}, meta = {}) {
  const ev = {
    id: uid(),
    type,
    at: new Date().toISOString(),
    cardId: meta.cardId ?? null,
    hizbId: meta.hizbId ?? (meta.cardId ? String(meta.cardId).split("-")[0] : null),
    payload,
    qav: QURAN_ARCHITECTURE_VERSION,
    bsmv: BEHAVIOR_SUPPORT_MODEL_VERSION
  };
  state.events.push(ev);
  persist();
  return ev;
}

export const getState = () => state;
export const events = () => state.events;

/* ---- DRAFTS (scratch, never events) -------------------------------------- */
export function setDraft(cardId, field, value) {
  state.drafts[cardId] ||= {};
  state.drafts[cardId][field] = value;
  state.drafts[cardId].at = new Date().toISOString();
  persistSoon();
}
export const getDraft = (cardId, field) => state.drafts?.[cardId]?.[field] ?? null;
export function clearDraft(cardId, field) {
  if (state.drafts?.[cardId]) { delete state.drafts[cardId][field]; persist(); }
}

/* Commit a draft observation. Returns "created" | "revised" | null. */
export function commitObservation(cardId, hizbId) {
  const draft = getDraft(cardId, "observation");
  if (draft === null) return null;
  const text = String(draft).trim();
  const current = derive(cardId).observation;
  if (text === (current || "")) { clearDraft(cardId, "observation"); return null; }
  if (!text && !current) { clearDraft(cardId, "observation"); return null; }
  const type = current ? "OBSERVATION_REVISED" : "OBSERVATION_CREATED";
  append(type, { text }, { cardId, hizbId });
  clearDraft(cardId, "observation");
  return current ? "revised" : "created";
}

export function commitAllDrafts() {
  for (const cardId of Object.keys(state.drafts || {})) commitObservation(cardId, cardId.split("-")[0]);
}

/* ---- REDUCER (read model — never stored) --------------------------------- */
export function derive(cardId) {
  const out = {
    observation: "", revisions: 0, categories: [],
    lifeAnswer: null, lifeText: "", direction: "", bottleneck: null,
    plan: null, actions: [], reviews: [], returns: [], firstAt: null, lastAt: null
  };
  for (const e of state.events) {
    if (e.cardId !== cardId) continue;
    out.firstAt ||= e.at; out.lastAt = e.at;
    switch (e.type) {
      case "OBSERVATION_CREATED": out.observation = e.payload.text; break;
      case "OBSERVATION_REVISED": out.observation = e.payload.text; out.revisions++; break;
      case "CATEGORY_SET":        out.categories = e.payload.categories || []; break;
      case "LIFE_LINK_ANSWERED":  out.lifeAnswer = e.payload.answer; break;
      case "LIFE_CONNECTION":     out.lifeText = e.payload.text; break;
      case "DIRECTION_CHOSEN":    out.direction = e.payload.text; break;
      case "BOTTLENECK_NOTED":    out.bottleneck = e.payload.key; break;
      case "PLAN_CREATED":
      case "PLAN_REVISED":        out.plan = e.payload; break;
      case "ACTION_LOGGED":       out.actions.push(e); break;
      case "REVIEW":              out.reviews.push(e); break;
      case "RETURN_RECOVERY":
      case "RETURN_PERIODIC":     out.returns.push(e); break;
    }
  }
  return out;
}

export function cardsWith(predicate) {
  const ids = [...new Set(state.events.filter(e => e.cardId).map(e => e.cardId))];
  return ids.map(id => ({ cardId: id, d: derive(id) })).filter(({ d }) => predicate(d));
}

/* ---- PREFS / CONSENT ----------------------------------------------------- */
export function setPref(k, v) { state.prefs[k] = v; persist(); }
export function setCursor(hizbId, i) { state.cursor[hizbId] = i; persist(); }
export const getCursor = hizbId => state.cursor[hizbId] ?? 0;
export function setHizb(id) { state.hizb = id; persist(); }
export function setConsent(pilot) {
  state.consent = { pilot: !!pilot, decidedAt: new Date().toISOString() };
  persist();
  append(pilot ? "CONSENT_GIVEN" : "CONSENT_DECLINED", { scope: "pilot" });
}

/* ---- EXPORT / ERASE ------------------------------------------------------ */
export function exportBundle() {
  return {
    exportedAt: new Date().toISOString(),
    schema: state.schema,
    quranArchitectureVersion: QURAN_ARCHITECTURE_VERSION,
    behaviorSupportModelVersion: BEHAVIOR_SUPPORT_MODEL_VERSION,
    note: "Append-only event log. OBSERVATION_REVISED entries do not replace OBSERVATION_CREATED.",
    prefs: state.prefs,
    consent: state.consent,
    events: state.events
  };
}
export function eraseEverything() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
  for (const k of Object.keys(localStorage)) if (k.startsWith("foaad_corpus_")) localStorage.removeItem(k);
  state = blank();
  persist();
}
