/* ==========================================================================
   views.js — PURE MARKUP. No DOM access, no state mutation, no fetch.
   Every function takes data and returns an HTML string. This is what makes
   the flows renderable and testable outside a browser.
   ========================================================================== */

export const esc = (s = "") => String(s).replace(/[&<>"']/g,
  m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const excerpt = (s, n = 140) => { s = String(s || ""); return s.length > n ? esc(s.slice(0, n)) + "…" : esc(s); };
const fmt = iso => { try { return new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" }); } catch { return ""; } };

/* The node vocabulary. NEVER rendered before the user has written.
   "غير متأكد" and "لا شيء ينطبق" are complete, valid answers. */
export const CATEGORIES = ["إدراك","معيار","وجهة","اختيار","فعل","مسؤولية","مراجعة","عودة","صفة","أخرى"];
export const CATEGORIES_EXCLUSIVE = ["غير متأكد","لا شيء ينطبق"];

/* Bottleneck families. Two of them REFUSE to produce a plan — that refusal is
   the design, not a gap. */
export const BOTTLENECKS = [
  { key: "forget",      label: "أنسى",                      plan: true  },
  { key: "old_easier",  label: "القديم أسهل",               plan: true  },
  { key: "environment", label: "المكان يذكّرني به",          plan: true  },
  { key: "too_big",     label: "الفعل كبير",                plan: true  },
  { key: "unknown",     label: "لا أعرف ما الذي يمنعني",     plan: false, mode: "observe" },
  { key: "ambivalent",  label: "لستُ متأكدًا أني أريد هذا",  plan: false, mode: "back_to_card" }
];

/* ---------- 1 · اللقاء : the encounter ---------- */
export function encounter(card, d, { position, total, hizbTitle, draft } = {}) {
  const text = draft ?? d.observation ?? "";
  const written = String(text).trim().length > 0;
  return `
<article>
  <section class="register-corpus" aria-labelledby="ayah-label">
    <h1 class="visually-hidden" id="ayah-label">${esc(card.surah)} — ${esc(card.ayah)}</h1>
    <div class="card-meta">
      <span class="pill ord">${esc(hizbTitle)} · البطاقة ${position} من ${total}</span>
      <span class="pill">${esc(card.surah)}</span>
      <span class="pill">${esc(card.ayah)}</span>
    </div>
    <p class="ayah">${esc(card.verseText)}</p>
    <hr class="rule-gold">
    <div class="tadabbur">${esc(card.tadabburText)}</div>
  </section>

  <section class="register-human" aria-labelledby="obs-h">
    <h2 id="obs-h">ما الذي رأيته في هذه الآية؟</h2>
    <p class="lede">اكتب بلغتك أنت. لا يوجد جواب مطلوب، ولن يظهر لك أي تصنيف قبل أن تكتب.</p>
    <label for="obs">ملاحظتي</label>
    <textarea id="obs" name="obs" aria-describedby="obs-save">${esc(text)}</textarea>
    <p class="autosave" id="obs-save" role="status" aria-live="polite"></p>

    <div class="after-observation" id="afterObs" ${written ? "" : "hidden"}>
      <fieldset class="reset-fieldset">
        <legend class="field-label mt-0">إن أردت، اختر ما يقترب مما كتبت — يمكنك اختيار أكثر من واحد</legend>
        <p class="hint">هذا تصنيفك أنت لملاحظتك، وليس تفسيرًا للآية.</p>
        <div class="chips" id="cats">
          ${[...CATEGORIES, ...CATEGORIES_EXCLUSIVE].map(c => `
          <button type="button" class="chip" data-cat="${esc(c)}"
            aria-pressed="${d.categories.includes(c) ? "true" : "false"}">${esc(c)}</button>`).join("")}
        </div>
      </fieldset>
    </div>

    <div class="actions">
      <button type="button" class="btn" id="saveObs">حفظ ملاحظتي</button>
      <button type="button" class="btn ghost" id="prevCard" ${position <= 1 ? "disabled" : ""}>البطاقة السابقة</button>
      <button type="button" class="btn ghost" id="nextCard" ${position >= total ? "disabled" : ""}>البطاقة التالية</button>
    </div>
    <p class="privacy-note">ما تكتبه محفوظ في هذا الجهاز وحده. لا يُرسل إلى خادم، ولا يطّلع عليه أحد. تعديلك لا يمحو نصك الأول — يُحفظ الاثنان.</p>
  </section>

  ${written ? bridge(card, d) : ""}
</article>`;
}

/* ---------- 2 · الجسر : Quran → life. STRICTLY DOWNSTREAM. ----------
   Renders only after an observation exists. "لا" / "ليس الآن" end the session
   as COMPLETE — no nudge, no dimming, no follow-up. */
export function bridge(card, d) {
  const a = d.lifeAnswer;
  return `
<hr class="bridge-divider">
<section class="register-human" aria-labelledby="bridge-h">
  <h2 id="bridge-h">هل بقي هذا المعنى في القراءة فقط، أم مسّ شيئًا في حياتك؟</h2>
  <p class="lede">السؤال اختياري، و«لا» جواب كامل وصحيح.</p>
  <div class="chips" role="group" aria-label="جواب">
    <button type="button" class="chip" data-life="no"       aria-pressed="${a === "no" ? "true" : "false"}">بقي في القراءة</button>
    <button type="button" class="chip" data-life="not_now"  aria-pressed="${a === "not_now" ? "true" : "false"}">ليس الآن</button>
    <button type="button" class="chip" data-life="yes"      aria-pressed="${a === "yes" ? "true" : "false"}">مسّ شيئًا</button>
  </div>
  ${a === "no" || a === "not_now" ? `<p class="lede mt-3">انتهى اللقاء. هذا لقاء كامل.</p>` : ""}
  ${a === "yes" ? `
  <label for="lifeText">سمِّه بكلماتك أنت</label>
  <p class="hint" id="lifeHint">لن نسمّيه عنك، ولن نربطه بأي تشخيص.</p>
  <textarea id="lifeText" class="sm" aria-describedby="lifeHint">${esc(d.lifeText)}</textarea>

  <h3 class="mt-4">هل هناك اختيار صغير تريد أن تحمله معك من هذا اللقاء؟</h3>
  <label for="direction" class="visually-hidden">الاختيار</label>
  <p class="hint">اكتبه، أو اتركه فارغًا وامضِ — كلاهما نهاية صحيحة.</p>
  <input type="text" id="direction" value="${esc(d.direction)}" placeholder="اختيار صغير بكلماتك">
  <div class="actions">
    <button type="button" class="btn" id="saveBridge">حفظ</button>
  </div>` : ""}
</section>
${a === "yes" && d.direction ? supportModule(d) : ""}`;
}

/* ---------- 3 · الوحدة السلوكية الوحيدة ----------
   ONE module: implementation intention + coping plan (bsmv-0.1).
   Contains no Quranic claim, no interpretation, no diagnosis. */
export function supportModule(d) {
  const b = BOTTLENECKS.find(x => x.key === d.bottleneck);
  const p = d.plan || {};
  return `
<section class="register-support" aria-labelledby="tool-h">
  <span class="tool-eyebrow">أداة عملية · لا علاقة لها بتفسير الآية</span>
  <h2 id="tool-h">ما الذي يقف بينك وبين هذا؟</h2>
  <div class="chips" role="group" aria-label="العائق">
    ${BOTTLENECKS.map(x => `<button type="button" class="chip" data-bn="${x.key}"
      aria-pressed="${d.bottleneck === x.key ? "true" : "false"}">${esc(x.label)}</button>`).join("")}
  </div>

  ${b && b.mode === "back_to_card" ? `
  <p class="lede mt-3">إذن لا خطة الآن. التردد ليس عيبًا، ولا نبني عليه فعلًا.
  <br>عُد إلى البطاقة متى شئت.</p>` : ""}

  ${b && b.mode === "observe" ? `
  <p class="lede mt-3">إذن لا خطة هذا الأسبوع. لاحظ فقط: متى ظهر الأمر، وأين، وما الذي سبقه.
  <br>سجّل ما تراه دون أن تغيّر شيئًا.</p>
  <label for="observeNote">ما لاحظته — اختياري</label>
  <textarea id="observeNote" class="sm">${esc(p.observeNote || "")}</textarea>
  <div class="actions"><button type="button" class="btn secondary" id="savePlan">حفظ الملاحظة</button></div>` : ""}

  ${b && b.plan ? `
  <p class="lede mt-3">اكتب الخطة بكلماتك. نحن نرتّب الحقول فقط.</p>
  <label for="pAction">ما الفعل بالضبط؟</label>
  <p class="hint">أصغر صورة ممكنة منه.</p>
  <input type="text" id="pAction" value="${esc(p.action || "")}">
  <label for="pWhen">متى؟</label>
  <input type="text" id="pWhen" value="${esc(p.when || "")}" placeholder="مثال: بعد صلاة الفجر مباشرة">
  <label for="pWhere">أين؟</label>
  <input type="text" id="pWhere" value="${esc(p.where || "")}">
  <label for="pObstacle">ما العائق الذي تتوقعه؟</label>
  <input type="text" id="pObstacle" value="${esc(p.obstacle || "")}">
  <label for="pThen">إن ظهر هذا العائق، ماذا ستفعل؟</label>
  <input type="text" id="pThen" value="${esc(p.then || "")}">
  <div class="actions">
    <button type="button" class="btn secondary" id="savePlan">حفظ الخطة</button>
  </div>` : ""}
</section>`;
}

/* ---------- 4 · ما كتبتُه ---------- */
export function written(items) {
  if (!items.length) return head("ما كتبتُه", "كل ما كتبته بيدك، في مكان واحد.") +
    `<div class="empty"><b>لم تكتب شيئًا بعد.</b>افتح «اللقاء» واكتب ما رأيته في الآية.</div>`;
  return head("ما كتبتُه", "كل ما كتبته بيدك. تعديلك لا يمحو نصك الأول.") + `<div class="list">` +
    items.map(({ cardId, card, d }) => `
      <button type="button" class="row" data-card="${esc(cardId)}">
        <b>${esc(card.surah)} — ${esc(card.ayah)}</b>
        <span class="excerpt">${excerpt(d.observation)}</span>
        <small>${fmt(d.firstAt)}${d.revisions ? ` · نُقّحت ${d.revisions} مرة` : ""}${d.reviews.length ? " · فيها مراجعة" : ""}</small>
      </button>`).join("") + `</div>`;
}

/* ---------- 5 · ما اخترتُه ---------- */
export function chosen(items) {
  if (!items.length) return head("ما اخترتُه", "ما اخترت أنت أن تحمله إلى حياتك.") +
    `<div class="empty"><b>لا يوجد اختيار بعد.</b>لا نضيف لك عملًا من عندنا.</div>`;
  return head("ما اخترتُه", "ما اخترت أنت أن تحمله إلى حياتك، وما حدث فعلًا.") + `<div class="list">` +
    items.map(({ cardId, card, d }) => `
      <button type="button" class="row" data-card="${esc(cardId)}">
        <b>${esc(d.direction)}</b>
        ${d.plan && d.plan.action ? `<span class="excerpt">${esc(d.plan.action)}${d.plan.when ? " · " + esc(d.plan.when) : ""}</span>` : ""}
        <small>${esc(card.surah)} · ${esc(card.ayah)}${d.actions.length ? ` · ${d.actions.length} تسجيل` : ""}</small>
      </button>`).join("") + `</div>`;
}

/* ---------- 6 · العودة : TWO DOORS ----------
   RECOVERY and PERIODIC are separate entrances. A periodic return must never
   be entered through a door that implies something went wrong. */
export function returnHome() {
  return head("العودة", "العودة ليست دليل فشل.") + `
  <div class="list">
    <button type="button" class="row" data-return="recovery">
      <b>عدتُ بعد تعثر</b><small>حدث شيء لم يمضِ كما خططت.</small></button>
    <button type="button" class="row" data-return="periodic">
      <b>عدتُ لأراجع</b><small>لا شيء تعثر — أريد أن أعود إلى معنى أو ملاحظة.</small></button>
  </div>`;
}

/* Behavioural classifier only. GUARD: no religious vocabulary in this flow.
   A lapse is an event, not a verdict. The user may bring meaning; we do not. */
export const LAPSE_KINDS = [
  "مرة واحدة","يتكرر","عائق ظهر","تغيّرت الظروف","الخطة كانت أكبر من الواقع",
  "الوجهة غير واضحة","نسيت","شيء آخر كان أقوى","حالة شعورية","المكان أو الوقت","لا أعرف بعد"
];
export const LAPSE_NEEDS = [
  "تصغير الفعل","تغيير الوقت","تغيير المكان","إزالة محفز","إضافة بديل",
  "طلب دعم من شخص","العودة إلى البطاقة","فقط التسجيل"
];

export function returnRecovery() {
  return head("عدتُ بعد تعثر", "لا نحكم على ما حدث. نصفه فقط.") + `
  <section class="register-human">
    <label for="whatHappened">ماذا حدث فعلًا؟</label>
    <textarea id="whatHappened" class="sm"></textarea>
    <fieldset class="reset-fieldset">
      <legend class="field-label">أقرب وصف — يمكنك اختيار أكثر من واحد</legend>
      <div class="chips" id="lapseKinds">
        ${LAPSE_KINDS.map(k => `<button type="button" class="chip" data-kind="${esc(k)}" aria-pressed="false">${esc(k)}</button>`).join("")}
      </div>
    </fieldset>
    <fieldset class="reset-fieldset">
      <legend class="field-label">ما الذي تحتاجه الآن؟</legend>
      <div class="chips" id="lapseNeeds">
        ${LAPSE_NEEDS.map(k => `<button type="button" class="chip" data-need="${esc(k)}" aria-pressed="false">${esc(k)}</button>`).join("")}
      </div>
    </fieldset>
    <div class="actions">
      <button type="button" class="btn" id="saveRecovery">تسجيل</button>
      <button type="button" class="btn ghost" data-go="return">رجوع</button>
    </div>
  </section>`;
}

export function returnPeriodic(items) {
  return head("عدتُ لأراجع", "اختر ما تريد أن تعود إليه.") +
    (items.length ? `<div class="list">${items.map(({ cardId, card, d }) => `
      <button type="button" class="row" data-periodic="${esc(cardId)}">
        <b>${esc(card.surah)} — ${esc(card.ayah)}</b>
        <span class="excerpt">${excerpt(d.observation, 110)}</span>
        <small>${d.returns.length ? `${d.returns.length} عودة سابقة` : "لم تعد إليها بعد"}</small>
      </button>`).join("")}</div>`
      : `<div class="empty"><b>لا شيء تعود إليه بعد.</b>اكتب ملاحظة أولًا.</div>`);
}

/* ---------- 7 · الأحزاب ---------- */
export function hizbList(hizbs, current, cards, derived) {
  return head("الأحزاب", "افتح أي بطاقة دون ترتيب مفروض.") +
    `<div class="chips" role="group" aria-label="اختيار الحزب">
      ${hizbs.map(h => `<button type="button" class="chip" data-hizb="${h.id}"
        aria-pressed="${h.id === current ? "true" : "false"}">${esc(h.title)}</button>`).join("")}
    </div>
    <p class="lede mt-2">${esc(hizbMetaRange(hizbs, current))}</p>
    <div class="list">${cards.map((c, i) => {
      const d = derived[c.cardId];
      return `<button type="button" class="row" data-card="${esc(c.cardId)}">
        <b>${i + 1}. ${esc(c.surah)} — ${esc(c.ayah)}</b>
        <small>${d && d.observation ? "لك ملاحظة هنا" : "لم تكتب بعد"}</small></button>`;
    }).join("")}</div>`;
}
const hizbMetaRange = (hizbs, id) => (hizbs.find(h => h.id === id) || {}).range || "";

/* ---------- shared ---------- */
export function head(title, desc = "") {
  return `<h1>${esc(title)}</h1>${desc ? `<p class="lede">${esc(desc)}</p>` : ""}`;
}

/* ---------- safety surface (always reachable, never triggered) ----------
   No keyword scanning, no risk scoring, no automated intervention.
   VERIFY these numbers against ncmh.org.sa and moh.gov.sa before release. */
export function safetyDialog() {
  return `
<div class="dialog-body">
  <div class="dialog-head">
    <h2 id="safety-h">تحتاج مساعدة الآن؟</h2>
    <button type="button" class="close-btn" data-close aria-label="إغلاق">✕</button>
  </div>
  <p>هذا التطبيق ليس علاجًا ولا تشخيصًا ولا بديلًا عن رعاية طبية أو نفسية. إن كنت تمر بضيق شديد، الجهات التالية أقرب وأقدر:</p>
  <ul class="safety-routes">
    <li><b>المركز الوطني لتعزيز الصحة النفسية</b><a href="tel:920033360">920033360</a> — استشارات نفسية ودعم</li>
    <li><b>وزارة الصحة</b><a href="tel:937">937</a> — على مدار الساعة</li>
    <li><b>تطبيق «قريبون»</b>من المركز الوطني لتعزيز الصحة النفسية</li>
    <li><b>الطوارئ</b><a href="tel:997">997</a> الهلال الأحمر · <a href="tel:911">911</a></li>
  </ul>
  <p class="privacy-note">لا يقرأ التطبيق ما تكتبه ولا يحلّله ولا يرسله. هذه الصفحة متاحة دائمًا، ولا تظهر بناءً على شيء كتبته.</p>
</div>`;
}
