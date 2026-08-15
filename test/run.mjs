/* Integrity-layer test suite — runs the real modules in node with a
   localStorage shim. No mocks of store.js itself. */
import assert from "node:assert/strict";

globalThis.localStorage = (() => { let m = new Map(); return {
  getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)),
  removeItem: k => m.delete(k), clear: () => m.clear(),
  get length() { return m.size; }, key: i => [...m.keys()][i],
  [Symbol.iterator]: function* () { yield* m.keys(); }
}; })();
Object.keys = (o => k => (k === globalThis.localStorage ? [...k] : o(k)))(Object.keys);

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log("  ok   " + name); }
  catch (e) { fail++; console.log("  FAIL " + name + "\n       " + e.message); } };

const fresh = async () => { globalThis.localStorage.clear();
  return await import(`../js/store.js?v=${Math.random()}`); };

console.log("\n== P1 · INTEGRITY LAYER ==");

await t("every event is stamped with both version strings, separately", async () => {
  const S = await fresh();
  const e = S.append("OBSERVATION_CREATED", { text: "أ" }, { cardId: "H01-01" });
  assert.equal(e.qav, "qav-0.2-provisional");
  assert.equal(e.bsmv, "bsmv-0.1");
  assert.notEqual(e.qav, e.bsmv);
});

await t("editing appends OBSERVATION_REVISED and NEVER mutates the original", async () => {
  const S = await fresh();
  S.setDraft("H01-01", "observation", "النص الأول");
  assert.equal(S.commitObservation("H01-01", "H01"), "created");
  S.setDraft("H01-01", "observation", "النص الثاني");
  assert.equal(S.commitObservation("H01-01", "H01"), "revised");
  const evs = S.events().filter(e => e.cardId === "H01-01");
  assert.equal(evs.length, 2);
  assert.equal(evs[0].type, "OBSERVATION_CREATED");
  assert.equal(evs[0].payload.text, "النص الأول");   // original survives verbatim
  assert.equal(evs[1].type, "OBSERVATION_REVISED");
  assert.equal(S.derive("H01-01").observation, "النص الثاني");
  assert.equal(S.derive("H01-01").revisions, 1);
});

await t("no event is written when the text is unchanged", async () => {
  const S = await fresh();
  S.setDraft("H01-02", "observation", "ثابت"); S.commitObservation("H01-02", "H01");
  S.setDraft("H01-02", "observation", "ثابت");
  assert.equal(S.commitObservation("H01-02", "H01"), null);
  assert.equal(S.events().filter(e => e.cardId === "H01-02").length, 1);
});

await t("drafts survive a reload without becoming events (no data loss, no spam)", async () => {
  const S = await fresh();
  S.setDraft("H01-03", "observation", "نص لم يُحفظ بعد");
  assert.equal(S.events().length, 0);                       // typing is never an event
  assert.equal(S.getDraft("H01-03", "observation"), "نص لم يُحفظ بعد");   // readable at once
  await new Promise(r => setTimeout(r, 500));               // debounce window (400ms)
  const S2 = await import(`../js/store.js?v=${Math.random()}`);
  assert.equal(S2.getDraft("H01-03", "observation"), "نص لم يُحفظ بعد");  // durable with no explicit flush
});

await t("commitAllDrafts flushes every pending card (navigation guard)", async () => {
  const S = await fresh();
  S.setDraft("H01-04", "observation", "أ"); S.setDraft("H01-05", "observation", "ب");
  S.commitAllDrafts();
  assert.equal(S.events().filter(e => e.type === "OBSERVATION_CREATED").length, 2);
});

await t("the event log is append-only across the whole lifecycle", async () => {
  const S = await fresh();
  const ids = [];
  for (const txt of ["١", "٢", "٣"]) { S.setDraft("H01-06", "observation", txt); S.commitObservation("H01-06", "H01"); }
  S.append("CATEGORY_SET", { categories: ["وجهة", "اختيار"] }, { cardId: "H01-06" });
  S.append("LIFE_LINK_ANSWERED", { answer: "yes" }, { cardId: "H01-06" });
  S.events().forEach(e => ids.push(e.id));
  assert.equal(new Set(ids).size, ids.length, "event ids must be unique");
  assert.equal(S.events().length, 5);
  assert.deepEqual(S.derive("H01-06").categories, ["وجهة", "اختيار"]);
});

await t("legacy v1 data migrates and is honestly marked as pre-versioning", async () => {
  globalThis.localStorage.clear();
  globalThis.localStorage.setItem("foaad_h01_public_v1", JSON.stringify({
    current: 3, notes: { "H01-01": { observation: "ملاحظة قديمة", category: "وجهة", work: "اختيار قديم", review: "", returns: [] } }, events: []
  }));
  const S = await import(`../js/store.js?v=${Math.random()}`);
  const obs = S.events().find(e => e.type === "OBSERVATION_CREATED");
  assert.equal(obs.payload.text, "ملاحظة قديمة");
  assert.equal(obs.qav, "unknown-pre-v0.2");        // never back-dated to 0.2
  assert.equal(obs.migrated, true);
  assert.ok(S.events().some(e => e.type === "MIGRATION_NOTE"));
});

await t("export bundle carries both versions and the full log", async () => {
  const S = await fresh();
  S.setDraft("H01-07", "observation", "x"); S.commitObservation("H01-07", "H01");
  const b = S.exportBundle();
  assert.equal(b.quranArchitectureVersion, "qav-0.2-provisional");
  assert.equal(b.behaviorSupportModelVersion, "bsmv-0.1");
  assert.equal(b.events.length, 1);
});

console.log("\n== P3 · BRIDGE IS STRICTLY DOWNSTREAM ==");
const V = await import("../js/views.js");
const card = { cardId: "H01-01", surah: "سورة الفاتحة", ayah: "الآيات 2–4", verseText: "﴿…﴾", tadabburText: "نص التدبر" };
const empty = { observation: "", revisions: 0, categories: [], lifeAnswer: null, lifeText: "", direction: "", bottleneck: null, plan: null, actions: [], reviews: [], returns: [] };

await t("no category vocabulary is rendered before the user writes", async () => {
  const html = V.encounter(card, empty, { position: 1, total: 33, hizbTitle: "الحزب الأول" });
  assert.ok(html.includes('id="afterObs" hidden'), "disclosure block must be hidden");
  assert.ok(!/هل بقي هذا المعنى/.test(html), "bridge must not render before an observation exists");
});

await t("bridge appears only after an observation, module only after a direction", async () => {
  const withObs = { ...empty, observation: "رأيت شيئًا" };
  let html = V.encounter(card, withObs, { position: 1, total: 33, hizbTitle: "الحزب الأول" });
  assert.ok(/هل بقي هذا المعنى/.test(html));
  assert.ok(!/ما الذي يقف بينك/.test(html), "support module must not appear without a direction");
  html = V.encounter(card, { ...withObs, lifeAnswer: "yes", lifeText: "ص", direction: "اختيار صغير" }, { position: 1, total: 33, hizbTitle: "الحزب الأول" });
  assert.ok(/ما الذي يقف بينك/.test(html), "module appears downstream of a user-written direction");
});

await t('"لا" and "ليس الآن" end the session as complete, with no follow-up', async () => {
  for (const a of ["no", "not_now"]) {
    const html = V.bridge(card, { ...empty, observation: "x", lifeAnswer: a });
    assert.ok(/هذا لقاء كامل/.test(html));
    assert.ok(!/سمِّه بكلماتك/.test(html));
    assert.ok(!/ما الذي يقف بينك/.test(html));
  }
});

await t("ambivalence and unknown-blocker REFUSE to produce a plan", async () => {
  const base = { ...empty, observation: "x", lifeAnswer: "yes", direction: "د" };
  const amb = V.supportModule({ ...base, bottleneck: "ambivalent" });
  assert.ok(/لا خطة الآن/.test(amb));
  assert.ok(!/ما الفعل بالضبط/.test(amb));
  const unk = V.supportModule({ ...base, bottleneck: "unknown" });
  assert.ok(/لا خطة هذا الأسبوع/.test(unk));
  assert.ok(!/ما الفعل بالضبط/.test(unk));
  const plan = V.supportModule({ ...base, bottleneck: "forget" });
  assert.ok(/ما الفعل بالضبط/.test(plan) && /إن ظهر هذا العائق/.test(plan));
});

await t("GUARD: the lapse/recovery flow contains no religious vocabulary", async () => {
  const html = V.returnRecovery() + V.returnHome();
  for (const w of ["توبة", "ذنب", "معصية", "تقصير", "إيمان", "تقوى", "عقاب", "فشلت", "N12"])
    assert.ok(!html.includes(w), `forbidden in lapse flow: ${w}`);
});

await t("GUARD: no score, percentage, streak or counter in any user-facing view", async () => {
  const html = [
    V.encounter(card, { ...empty, observation: "x" }, { position: 1, total: 33, hizbTitle: "ح" }),
    V.returnHome(), V.returnRecovery(),
    V.written([{ cardId: "H01-01", card, d: { ...empty, observation: "x", firstAt: new Date().toISOString(), reviews: [] } }]),
    V.chosen([{ cardId: "H01-01", card, d: { ...empty, direction: "د", actions: [], plan: null } }])
  ].join("");
  assert.ok(!/progress|%|نسبة|درجة|نقاط|تتابع|streak/i.test(html), "no quantified progress anywhere");
});

await t("safety surface is static and never triggered by content", async () => {
  const html = V.safetyDialog();
  assert.ok(/920033360/.test(html) && /937/.test(html));
  assert.ok(/ليس علاجًا/.test(html));
  assert.ok(/لا يقرأ التطبيق ما تكتبه/.test(html));
});

console.log("\n== P4 · CORPUS LOADER GENERALISATION ==");
const cards = JSON.parse((await import("node:fs")).readFileSync(new URL("./cards.json", import.meta.url), "utf8"));
const C = await import("../js/corpus.js");

await t("loads any hizb by id — no hard-coded card count", async () => {
  for (const id of ["H01", "H02"]) {
    const rows = cards.filter(c => c.hizb_id === id);
    const r = await C.loadHizb(id, { fetchImpl: async () => ({ ok: true, json: async () => rows }) });
    assert.equal(r.count, rows.length);
    assert.equal(r.source, "network");
  }
  assert.equal(cards.filter(c => c.hizb_id === "H01").length, 33);
  assert.equal(cards.filter(c => c.hizb_id === "H02").length, 38);
});

await t("a hypothetical H03 of any size loads with zero code change", async () => {
  const h3 = Array.from({ length: 41 }, (_, i) => ({ ...cards[0], card_id: `H03-${i + 1}`, hizb_id: "H03", index: i + 1 }));
  const r = await C.loadHizb("H03", { fetchImpl: async () => ({ ok: true, json: async () => h3 }) });
  assert.equal(r.count, 41);
});

await t("rejects an incomplete card instead of rendering a blank ayah", async () => {
  const bad = [{ ...cards[0], card_id: "H09-01", hizb_id: "H09", verse_text: "" }];
  await assert.rejects(() => C.loadHizb("H09", { fetchImpl: async () => ({ ok: true, json: async () => bad }) }));
  await assert.rejects(() => C.loadHizb("H09", { fetchImpl: async () => ({ ok: false, status: 500 }) }));
});

await t("a corrupt server response is reported, not silently swallowed", async () => {
  const rows = cards.filter(c => c.hizb_id === "H02");
  await C.loadHizb("H02", { fetchImpl: async () => ({ ok: true, json: async () => rows }) });
  const r = await C.loadHizb("H02", { fetchImpl: async () => ({ ok: true, json: async () => [{ card_id: "H02-01" }] }) });
  assert.equal(r.source, "cache");
  assert.match(r.warning, /corpus rejected/);
});

await t("falls back to cache when the network fails (product survives outage)", async () => {
  const rows = cards.filter(c => c.hizb_id === "H01");
  await C.loadHizb("H01", { fetchImpl: async () => ({ ok: true, json: async () => rows }) });
  const r = await C.loadHizb("H01", { fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal(r.source, "cache");
  assert.equal(r.count, 33);
});


console.log("\n== BLOCK 3 · DELIVERY, A11Y & PLATFORM GUARDS ==");
const fsx = (await import("node:fs")).default;
const read = f => fsx.readFileSync(new URL("../" + f, import.meta.url), "utf8");

await t("every aria-labelledby / aria-controls / label[for] target exists", async () => {
  const html = read("index.html"), v = read("js/views.js"), all = html + v;
  const ids = new Set([...all.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const attr of [/aria-labelledby="([^"]+)"/g, /aria-controls="([^"]+)"/g, /for="([^"]+)"/g])
    for (const m of all.matchAll(attr))
      assert.ok(ids.has(m[1]), `dangling reference: ${m[0]}`);
});

await t("no inline style attributes anywhere (strict CSP, no 'unsafe-inline')", async () => {
  for (const f of ["index.html", "js/views.js", "js/app.js"])
    assert.ok(!/style="/.test(read(f)), `inline style in ${f}`);
});

await t("closed mobile drawer leaves the tab order (visibility, not transform alone)", async () => {
  const css = read("style.css");
  assert.match(css, /\.side-nav\{[^}]*visibility:hidden/s);
  assert.match(css, /\.side-nav\.open\{[^}]*visibility:visible/s);
});

await t("safety dialog has a showModal fallback and restores focus to its trigger", async () => {
  const a = read("js/app.js");
  assert.match(a, /typeof dlg\.showModal === "function"/);
  assert.match(a, /setAttribute\("open", ""\)/);
  assert.match(a, /opener\.focus/);
});

await t("cursor and hizb persist through explicit setters, not side effects", async () => {
  const S = await fresh();
  S.setCursor("H01", 7); S.setHizb("H02");
  assert.equal(S.getCursor("H01"), 7);
  const S2 = await import(`../js/store.js?v=${Math.random()}`);
  assert.equal(S2.getCursor("H01"), 7);
  assert.equal(S2.getState().hizb, "H02");
  assert.ok(!/setPref\("_"/.test(read("js/app.js")), "fake pref write must be gone");
});

await t("drafts are debounced but flush() makes them durable immediately", async () => {
  const S = await fresh();
  S.setDraft("H01-08", "observation", "نص أثناء الكتابة");
  assert.equal(S.getDraft("H01-08", "observation"), "نص أثناء الكتابة");   // in memory at once
  S.flush();
  const S2 = await import(`../js/store.js?v=${Math.random()}`);
  assert.equal(S2.getDraft("H01-08", "observation"), "نص أثناء الكتابة");  // survives reload
});

await t("iOS lifecycle: commit is bound to pagehide and visibilitychange", async () => {
  const a = read("js/app.js");
  assert.match(a, /"pagehide", commit/);
  assert.match(a, /visibilitychange/);
  assert.match(a, /visibilityState === "hidden"/);
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
