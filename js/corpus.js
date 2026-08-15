/* ==========================================================================
   corpus.js — CORPUS LOADER (Block 2, P4)

   Generalised over hizbs. Adding H03 is a data operation: append one row to
   HIZBS and import the cards. No code path counts cards.
   The v1 gate `if (C.length !== 33) throw` is GONE.
   ========================================================================== */

const SUPABASE_URL = "https://umoaquvxkoagmirascgm.supabase.co";
const SUPABASE_KEY = "sb_publishable_HFWDLuAB_8n4d_sg9zAG5g_D85cbaHI";
const SELECT = "card_id,hizb_id,index,surah,ayah,verse_text,tadabbur_text";

export const HIZBS = [
  { id: "H01", title: "الحزب الأول",  range: "من الفاتحة إلى البقرة 74" },
  { id: "H02", title: "الحزب الثاني", range: "من البقرة 75 إلى البقرة 141" }
];
export const hizbMeta = id => HIZBS.find(h => h.id === id) || { id, title: id, range: "" };

const cacheKey = id => `foaad_corpus_${id}`;
const REQUIRED = ["card_id", "hizb_id", "index", "surah", "ayah", "verse_text", "tadabbur_text"];

function invalid(msg) { const e = new Error(msg); e.code = "invalid"; return e; }
function validate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) throw invalid("empty result");
  const bad = rows.find(r => REQUIRED.some(f => r[f] === null || r[f] === undefined || r[f] === ""));
  if (bad) throw invalid(`incomplete card: ${bad.card_id || "?"}`);
  return rows;
}
const shape = r => ({
  cardId: r.card_id, hizbId: r.hizb_id, index: r.index,
  surah: r.surah, ayah: r.ayah, verseText: r.verse_text, tadabburText: r.tadabbur_text
});

function readCache(id) {
  try {
    const c = JSON.parse(localStorage.getItem(cacheKey(id)) || "null");
    return c && Array.isArray(c.cards) && c.cards.length ? c : null;
  } catch { return null; }
}
function writeCache(id, cards) {
  try { localStorage.setItem(cacheKey(id), JSON.stringify({ fetchedAt: new Date().toISOString(), cards })); }
  catch { /* quota — cache is an optimisation, not a requirement */ }
}

/* Network first, cache as fallback. Corpus is immutable, so a stale cache is
   safe; an unreachable server is not a reason for the product to disappear. */
export async function loadHizb(id, { fetchImpl = fetch } = {}) {
  const url = `${SUPABASE_URL}/rest/v1/cards?hizb_id=eq.${encodeURIComponent(id)}&select=${SELECT}&order=index.asc`;
  try {
    const res = await fetchImpl(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const cards = validate(await res.json()).map(shape);
    writeCache(id, cards);
    return { cards, source: "network", count: cards.length };
  } catch (err) {
    const cached = readCache(id);
    if (cached) return {
      cards: cached.cards, source: "cache", fetchedAt: cached.fetchedAt, count: cached.cards.length,
      /* A corrupt server response is NOT the same as being offline. The user
         still gets the corpus, but the condition is reported, never swallowed. */
      warning: err.code === "invalid" ? `corpus rejected: ${err.message}` : "offline"
    };
    throw err;
  }
}
