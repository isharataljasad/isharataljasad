/* ==========================================================================
   app.js — RUNTIME. Wiring only. All markup lives in views.js, all writes in
   store.js. This file must contain no Quranic claim and no interpretation.
   ========================================================================== */

import * as S from "./store.js";
import * as V from "./views.js";
import { loadHizb, HIZBS, hizbMeta } from "./corpus.js";

let CARDS = [];              // current hizb, ordered
let hizbId = S.getState().hizb || "H01";
let view = "encounter";
let returnMode = null;
let saveTimer = null;

const $  = s => document.querySelector(s);
const app = () => $("#app");
const cardAt = i => CARDS[Math.max(0, Math.min(i, CARDS.length - 1))];
const cursor = () => S.getCursor(hizbId);
const setCursor = i => S.setCursor(hizbId, i);

/* ---- DIRTY GUARD: nothing the user typed is ever lost on navigation ------ */
function commit() { S.commitAllDrafts(); S.flush(); }
window.addEventListener("beforeunload", commit);
window.addEventListener("pagehide", commit);                 /* iOS bfcache */
document.addEventListener("visibilitychange", () => {        /* iOS app-switch */
  if (document.visibilityState === "hidden") commit();
});

/* ---- ROUTING ------------------------------------------------------------- */
const NAV = [
  ["encounter", "اللقاء"], ["written", "ما كتبتُه"], ["chosen", "ما اخترتُه"],
  ["return", "العودة"], ["hizbs", "الأحزاب"]
];

function go(v) {
  commit();
  view = v; returnMode = null;
  document.querySelectorAll(".nav").forEach(b =>
    b.setAttribute("aria-current", b.dataset.view === v ? "page" : "false"));
  if ($("#sideNav").classList.contains("open")) setDrawer(false);
  render();
  app().focus({ preventScroll: true });
}

function render() {
  const el = app();
  if (view === "encounter") {
    const i = cursor(), c = cardAt(i);
    if (!c) { el.innerHTML = `<div class="empty"><b>لا توجد بطاقات.</b></div>`; return; }
    const d = S.derive(c.cardId);
    el.innerHTML = V.encounter(c, d, {
      position: i + 1, total: CARDS.length,
      hizbTitle: hizbMeta(hizbId).title,
      draft: S.getDraft(c.cardId, "observation")
    });
    wireEncounter(c, d, i);
  } else if (view === "written") {
    el.innerHTML = V.written(collect(d => d.observation));
    wireCardRows();
  } else if (view === "chosen") {
    el.innerHTML = V.chosen(collect(d => d.direction));
    wireCardRows();
  } else if (view === "return") {
    if (returnMode === "recovery")      { el.innerHTML = V.returnRecovery(); wireRecovery(); }
    else if (returnMode === "periodic") { el.innerHTML = V.returnPeriodic(collect(d => d.observation)); wirePeriodic(); }
    else {
      el.innerHTML = V.returnHome();
      el.querySelectorAll("[data-return]").forEach(b =>
        b.onclick = () => { returnMode = b.dataset.return; render(); });
    }
  } else if (view === "hizbs") {
    const derived = Object.fromEntries(CARDS.map(c => [c.cardId, S.derive(c.cardId)]));
    el.innerHTML = V.hizbList(HIZBS, hizbId, CARDS, derived);
    el.querySelectorAll("[data-hizb]").forEach(b => b.onclick = () => switchHizb(b.dataset.hizb));
    wireCardRows();
  }
  if (view !== "encounter") window.scrollTo({ top: 0 });
  restoreFocus();
}

/* Only cards in the CURRENT hizb are resolvable to titles; others are skipped
   in the list rather than rendered with missing text. */
function collect(pred) {
  const byId = Object.fromEntries(CARDS.map(c => [c.cardId, c]));
  return S.cardsWith(pred).filter(x => byId[x.cardId])
    .map(x => ({ ...x, card: byId[x.cardId] }))
    .sort((a, b) => byId[a.cardId].index - byId[b.cardId].index);
}

function openCard(cardId) {
  const i = CARDS.findIndex(c => c.cardId === cardId);
  if (i < 0) return;
  commit(); setCursor(i); view = "encounter";
  document.querySelectorAll(".nav").forEach(b => b.setAttribute("aria-current", b.dataset.view === "encounter" ? "page" : "false"));
  render(); window.scrollTo({ top: 0 });
}
const wireCardRows = () => document.querySelectorAll("[data-card]").forEach(b => b.onclick = () => openCard(b.dataset.card));

/* ---- ENCOUNTER ----------------------------------------------------------- */
function wireEncounter(c, d, i) {
  const obs = $("#obs"), status = $("#obs-save"), after = $("#afterObs");

  obs.oninput = () => {
    S.setDraft(c.cardId, "observation", obs.value);          // scratch, not an event
    after.hidden = !obs.value.trim();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {                 /* announce settled state only */
      status.textContent = S.persistDidFail()
        ? "تعذّر الحفظ على هذا الجهاز — انسخ نصك قبل الإغلاق"
        : "محفوظ في هذا الجهاز";
    }, 700);
  };
  obs.onblur = () => { if (S.commitObservation(c.cardId, hizbId)) refresh(); };

  $("#saveObs").onclick = () => {
    const r = S.commitObservation(c.cardId, hizbId);
    toast(r === "revised" ? "حُفظ التنقيح — ونصك الأول محفوظ أيضًا" : "حُفظ في جهازك");
    refresh();
  };

  /* multi-select; the two exclusive answers clear the rest and vice versa */
  document.querySelectorAll("[data-cat]").forEach(btn => btn.onclick = () => {
    const val = btn.dataset.cat;
    const excl = V.CATEGORIES_EXCLUSIVE.includes(val);
    const on = btn.getAttribute("aria-pressed") === "true";
    document.querySelectorAll("[data-cat]").forEach(b => {
      const bx = V.CATEGORIES_EXCLUSIVE.includes(b.dataset.cat);
      if (excl ? !bx || b !== btn : bx) b.setAttribute("aria-pressed", "false");
    });
    btn.setAttribute("aria-pressed", on ? "false" : "true");
    const picked = [...document.querySelectorAll('[data-cat][aria-pressed="true"]')].map(b => b.dataset.cat);
    S.append("CATEGORY_SET", { categories: picked }, { cardId: c.cardId, hizbId });
  });

  $("#prevCard").onclick = () => { commit(); setCursor(i - 1); render(); window.scrollTo({ top: 0 }); };
  $("#nextCard").onclick = () => { commit(); setCursor(i + 1); render(); window.scrollTo({ top: 0 }); };

  wireBridge(c);
}

/* ---- BRIDGE (downstream only) -------------------------------------------- */
function wireBridge(c) {
  document.querySelectorAll("[data-life]").forEach(b => b.onclick = () => {
    S.append("LIFE_LINK_ANSWERED", { answer: b.dataset.life }, { cardId: c.cardId, hizbId });
    refresh();
  });
  const save = $("#saveBridge");
  if (save) save.onclick = () => {
    const life = $("#lifeText").value.trim(), dir = $("#direction").value.trim();
    const d = S.derive(c.cardId);
    if (life && life !== d.lifeText) S.append("LIFE_CONNECTION", { text: life }, { cardId: c.cardId, hizbId });
    if (dir && dir !== d.direction)  S.append("DIRECTION_CHOSEN", { text: dir }, { cardId: c.cardId, hizbId });
    toast("حُفظ"); refresh();
  };
  wireSupport(c);
}

/* ---- THE SINGLE SUPPORT MODULE ------------------------------------------- */
function wireSupport(c) {
  document.querySelectorAll("[data-bn]").forEach(b => b.onclick = () => {
    S.append("BOTTLENECK_NOTED", { key: b.dataset.bn }, { cardId: c.cardId, hizbId });
    refresh();
  });
  const sp = $("#savePlan");
  if (!sp) return;
  sp.onclick = () => {
    const d = S.derive(c.cardId);
    const p = $("#pAction") ? {
      action: $("#pAction").value.trim(), when: $("#pWhen").value.trim(),
      where: $("#pWhere").value.trim(), obstacle: $("#pObstacle").value.trim(),
      then: $("#pThen").value.trim()
    } : { observeNote: $("#observeNote").value.trim() };
    S.append(d.plan ? "PLAN_REVISED" : "PLAN_CREATED", p, { cardId: c.cardId, hizbId });
    toast("حُفظت الخطة في جهازك"); refresh();
  };
}

/* Re-render replaces innerHTML, which drops focus to <body>. Keyboard users
   would lose their place on every chip press. Remember a stable key for the
   focused control and restore it after the new markup lands. */
let focusKey = null;
function rememberFocus() {
  const el = document.activeElement;
  if (!el || el === document.body) { focusKey = null; return; }
  for (const a of ["id", "data-cat", "data-bn", "data-life", "data-kind", "data-need"]) {
    const v = el.getAttribute && el.getAttribute(a);
    if (v) { focusKey = `[${a}="${CSS.escape(v)}"]`; return; }
  }
  focusKey = null;
}
function restoreFocus() {
  if (!focusKey) return;
  const el = document.querySelector(focusKey);
  focusKey = null;
  if (el) el.focus({ preventScroll: true });
}
function refresh() { rememberFocus(); const y = window.scrollY; render(); window.scrollTo({ top: y }); }

/* ---- RETURN -------------------------------------------------------------- */
function wireRecovery() {
  const pick = sel => [...document.querySelectorAll(`${sel} [aria-pressed="true"]`)]
    .map(b => b.dataset.kind || b.dataset.need);
  document.querySelectorAll("#lapseKinds .chip, #lapseNeeds .chip").forEach(b =>
    b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true"));
  $("#saveRecovery").onclick = () => {
    S.append("RETURN_RECOVERY", {
      what: $("#whatHappened").value.trim(),
      kinds: pick("#lapseKinds"), needs: pick("#lapseNeeds")
    }, {});
    toast("سُجّل"); returnMode = null; render();
  };
  document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { returnMode = null; render(); });
}
function wirePeriodic() {
  document.querySelectorAll("[data-periodic]").forEach(b => b.onclick = () => {
    const id = b.dataset.periodic;
    S.append("RETURN_PERIODIC", { target: "card" }, { cardId: id, hizbId: id.split("-")[0] });
    openCard(id);
  });
}

/* ---- HIZB SWITCH --------------------------------------------------------- */
async function switchHizb(id) {
  if (id === hizbId) return;
  commit();
  hizbId = id; S.setHizb(id);
  await boot({ keepView: "hizbs" });
}

/* ---- CHROME -------------------------------------------------------------- */
function toast(text) {
  document.querySelector(".toast")?.remove();
  const d = document.createElement("div");
  d.className = "toast"; d.setAttribute("role", "status"); d.textContent = text;
  document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
}
const isMobile = () => window.matchMedia("(max-width:860px)").matches;

/* The drawer used to be hidden with transform alone, which leaves it in the
   tab order and readable by screen readers while off-screen. */
function setDrawer(open) {
  const n = $("#sideNav");
  n.classList.toggle("open", open);
  $("#menuBtn").setAttribute("aria-expanded", String(open));
  if (open) n.querySelector(".nav").focus({ preventScroll: true });
  else if (isMobile()) $("#menuBtn").focus({ preventScroll: true });
}

function wireChrome() {
  $("#menuBtn").onclick = () => setDrawer(!$("#sideNav").classList.contains("open"));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && $("#sideNav").classList.contains("open")) setDrawer(false);
  });
  window.addEventListener("resize", () => { if (!isMobile()) $("#sideNav").classList.remove("open"); });
  document.querySelectorAll(".nav").forEach(b => b.onclick = () => go(b.dataset.view));
  /* The safety surface is the one thing that must never be unreachable.
     <dialog>.showModal() is unsupported on iOS < 15.4 and older Android
     WebViews, so fall back to a plain open panel with manual focus + Esc. */
  $("#helpBtn").onclick = () => {
    const dlg = $("#safetyDlg"), opener = document.activeElement;
    dlg.innerHTML = V.safetyDialog();
    const close = () => {
      if (typeof dlg.close === "function" && dlg.open) dlg.close(); else dlg.removeAttribute("open");
      document.removeEventListener("keydown", onKey);
      if (opener && opener.focus) opener.focus({ preventScroll: true });   // Safari does not always restore
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    dlg.querySelector("[data-close]").onclick = close;
    if (typeof dlg.showModal === "function") { dlg.showModal(); }
    else { dlg.setAttribute("open", ""); dlg.classList.add("dialog-fallback"); }
    document.addEventListener("keydown", onKey);
    dlg.querySelector("[data-close]").focus({ preventScroll: true });
  };
  $("#exportBtn").onclick = () => {
    commit();
    const blob = new Blob([JSON.stringify(S.exportBundle(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "foaad-my-record.json"; a.click();
    URL.revokeObjectURL(a.href);
  };
  $("#eraseBtn").onclick = () => {
    if (confirm("سيُحذف كل ما كتبته من هذا الجهاز نهائيًا. لا يمكن التراجع. هل تريد المتابعة؟")) {
      S.eraseEverything(); location.reload();
    }
  };
  const scale = $("#scaleSel");
  scale.value = S.getState().prefs.scale || "md";
  document.body.dataset.scale = scale.value;
  scale.onchange = () => { document.body.dataset.scale = scale.value; S.setPref("scale", scale.value); };
}

/* ---- BOOT ---------------------------------------------------------------- */
async function boot({ keepView } = {}) {
  app().innerHTML = `<div class="empty" role="status">جارٍ تحميل البطاقات…</div>`;
  try {
    const r = await loadHizb(hizbId);
    CARDS = r.cards;
    view = keepView || "encounter";
    render();
    if (r.source === "cache") toast("نسخة محفوظة على جهازك — تعذّر الاتصال");
  } catch (e) {
    app().innerHTML = `<div class="empty"><b>تعذّر تحميل البطاقات.</b>
      لا يوجد اتصال، ولا توجد نسخة محفوظة على هذا الجهاز بعد.
      <div class="actions center"><button class="btn" id="retry">إعادة المحاولة</button></div></div>`;
    $("#retry").onclick = () => boot({ keepView });
  }
}

wireChrome();
boot();
