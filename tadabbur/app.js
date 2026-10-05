const HIZBS = [
  {id:"H01", title:"الحزب الأول", range:"من الفاتحة إلى البقرة 74", count:33},
  {id:"H02", title:"الحزب الثاني", range:"البقرة 75–141", count:38},
  {id:"H03", title:"الحزب الثالث", range:"البقرة 142–202", count:37},
  {id:"H04", title:"الحزب الرابع", range:"البقرة 203–252", count:77},
  {id:"H05", title:"الحزب الخامس", range:"من البقرة 253 إلى آل عمران 14", count:55},
  {id:"H06", title:"الحزب السادس", range:"آل عمران 15–91", count:85},
  {id:"H07", title:"الحزب السابع", range:"آل عمران 92–170", count:40, images:true, stations:9, pages:156, rangeAr:"آل عمران ٩٢–١٧٠"},
  {id:"H08", title:"الحزب الثامن", range:"آل عمران 171 – النساء 23", count:33, images:true, stations:7, pages:142, rangeAr:"آل عمران ١٧١ – النساء ٢٣"}
];
const TOTAL = HIZBS.reduce((n,h)=>n+h.count,0);
const STORAGE_KEY = "baytalfuad.tadabbur.v1";
let corpusPromise = null;

const defaultState = {view:"encounter", hizb:"H01", card:1, scale:"md", notes:{}, chosen:[], recent:[]};
let state = loadState();
const app = document.getElementById("app");
const sideNav = document.getElementById("sideNav");
const menuBtn = document.getElementById("menuBtn");
const scaleSel = document.getElementById("scaleSel");
const confirmDlg = document.getElementById("confirmDlg");

function loadState(){
  try{
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return {...defaultState, ...(raw && typeof raw === "object" ? raw : {})};
  }catch{return {...defaultState};}
}
function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function meta(id){return HIZBS.find(h=>h.id===id) || HIZBS[0];}
function cardId(hizb,index){return `${hizb}-${String(index).padStart(2,"0")}`;}
function closeMenu(){sideNav.classList.remove("is-open");menuBtn.setAttribute("aria-expanded","false");}
function setActiveNav(view){document.querySelectorAll(".nav[data-view]").forEach(b=>b.classList.toggle("is-active",b.dataset.view===view));}
function toast(message){const el=document.createElement("div");el.className="toast";el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),1800);}

async function loadCorpus(){
  if(corpusPromise) return corpusPromise;
  corpusPromise=(async()=>{
    const parts=await Promise.all(Array.from({length:12},(_,i)=>i+1).map(async n=>{
      const res=await fetch(`/tadabbur/data/corpus-${n}.b64`,{cache:"force-cache"});
      if(!res.ok) throw new Error(`تعذر فتح جزء المحتوى ${n} (${res.status})`);
      return (await res.text()).trim();
    }));
    const binary=atob(parts.join(""));
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    if(typeof DecompressionStream!=="function") throw new Error("المتصفح يحتاج دعماً حديثاً لفك ضغط المحتوى.");
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const text=await new Response(stream).text();
    const corpus=JSON.parse(text);
    for(const h of HIZBS.filter(h=>!h.images)){const cards=corpus[h.id];if(!Array.isArray(cards)||cards.length!==h.count) throw new Error(`ملف ${h.id} غير مكتمل: ${cards?.length??0}/${h.count}`);}
    return corpus;
  })();
  return corpusPromise;
}
async function loadHizb(id){
  const corpus=await loadCorpus();
  return corpus[id].map((r,i)=>({card_id:cardId(id,i+1),hizb_id:id,index:i+1,surah:r[0],ayah:r[1],verse_text:r[2],tadabbur_text:r[3],saadi_text:""}));
}
async function getCard(id,index){const cards=await loadHizb(id);return cards[index-1];}
function remember(id){state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,30);saveState();}
function setView(view){state.view=view;saveState();setActiveNav(view);closeMenu();render();}
async function goToCard(hizb,index){const h=meta(hizb);state.hizb=hizb;state.card=Math.max(1,Math.min(h.count,Number(index)||1));state.view="encounter";saveState();setActiveNav("encounter");closeMenu();await render();}

function renderError(err){app.innerHTML=`<section class="error-card"><strong>تعذر فتح محتوى التدبر.</strong><div>${esc(err.message || "خطأ غير معروف")}</div><button class="btn primary" id="retryBtn" type="button">إعادة المحاولة</button></section>`;document.getElementById("retryBtn")?.addEventListener("click",()=>{corpusPromise=null;render();});}

async function renderEncounter(){
  if(meta(state.hizb).images) return renderImageHizb(meta(state.hizb));
  const h=meta(state.hizb);const cards=await loadHizb(h.id);const c=cards[state.card-1]||cards[0];
  state.card=c.index;remember(c.card_id);
  const note=state.notes[c.card_id]||"";const chosen=state.chosen.includes(c.card_id);const pct=Math.round(c.index/h.count*100);
  app.innerHTML=`
    <section class="view-head">
      <div><p class="eyebrow">${esc(h.title)} · ${esc(h.range)}</p><h1>اللقاء</h1><p>اقرأ الآية، ثم التدبر، واكتب ما ظهر لك إن أردت.</p></div>
      <div class="progress" aria-label="التقدم داخل الحزب"><div class="progress-label"><span>البطاقة ${c.index} من ${h.count}</span><span>${pct}%</span></div><div class="bar"><span style="width:${pct}%"></span></div></div>
    </section>
    <article class="card">
      <div class="card-top"><span class="card-number">البطاقة ${c.index}</span><span class="hizb-chip">${esc(h.title)}</span></div>
      <div class="verse-ref">سورة ${esc(c.surah)} · ${esc(c.ayah)}</div>
      <p class="verse">${esc(c.verse_text)}</p>
      ${c.saadi_text?`<details class="saadi-details"><summary>تفسير السعدي</summary><p>${esc(c.saadi_text)}</p></details>`:""}
      <p class="section-label">تدبر الفؤاد</p>
      <div class="tadabbur">${esc(c.tadabbur_text)}</div>
      <div class="note-box"><label for="noteText">ما كتبتُه</label><textarea id="noteText" placeholder="اكتب ما رأيته أنت…">${esc(note)}</textarea><p class="note-hint">يحفظ تلقائيًا على هذا الجهاز فقط.</p></div>
      <div class="actions">
        <button class="btn" id="prevBtn" type="button" ${c.index===1?"disabled":""}>السابق</button>
        <button class="btn primary" id="nextBtn" type="button">${c.index===h.count?"اختيار حزب آخر":"التالي"}</button>
        <button class="btn ${chosen?"chosen":""}" id="chooseBtn" type="button">${chosen?"✓ اخترتُها":"أضف إلى ما اخترتُه"}</button>
      </div>
    </article>`;
  document.getElementById("noteText")?.addEventListener("input",e=>{const v=e.target.value;if(v.trim())state.notes[c.card_id]=v;else delete state.notes[c.card_id];saveState();});
  document.getElementById("prevBtn")?.addEventListener("click",()=>goToCard(h.id,c.index-1));
  document.getElementById("nextBtn")?.addEventListener("click",()=>c.index===h.count?setView("hizbs"):goToCard(h.id,c.index+1));
  document.getElementById("chooseBtn")?.addEventListener("click",()=>{state.chosen=chosen?state.chosen.filter(x=>x!==c.card_id):[...state.chosen,c.card_id];saveState();renderEncounter();});
}

function parseStoredId(id){const m=/^(H\d{2})-(\d+)$/.exec(id);return m?{hizb:m[1],index:Number(m[2])}:null;}
async function hydrateIds(ids){const out=[];for(const id of ids){const p=parseStoredId(id);if(!p)continue;try{const c=await getCard(p.hizb,p.index);out.push(c);}catch{}}return out;}
function itemHtml(c,extra=""){const h=meta(c.hizb_id);return `<article class="list-item"><div class="list-item-top"><h3>${esc(h.title)} · البطاقة ${c.index}</h3><span class="pill">سورة ${esc(c.surah)} · ${esc(c.ayah)}</span></div>${extra}<button class="btn secondary open-card" data-hizb="${c.hizb_id}" data-index="${c.index}" type="button">افتح البطاقة</button></article>`;}
function wireOpenCards(){document.querySelectorAll(".open-card").forEach(b=>b.addEventListener("click",()=>goToCard(b.dataset.hizb,Number(b.dataset.index))));}
async function renderWritten(){const ids=Object.keys(state.notes).filter(id=>state.notes[id]?.trim());const cards=await hydrateIds(ids);app.innerHTML=`<section class="view-head"><div><p class="eyebrow">سجلك المحلي</p><h1>ما كتبتُه</h1><p>${cards.length} كتابة محفوظة على هذا الجهاز.</p></div></section>${cards.length?`<div class="list">${cards.map(c=>itemHtml(c,`<p>${esc(state.notes[c.card_id])}</p>`)).join("")}</div>`:`<section class="empty">لم تكتب شيئًا بعد. عد إلى «اللقاء» واكتب تحت أي بطاقة.</section>`}`;wireOpenCards();}
async function renderChosen(){const cards=await hydrateIds(state.chosen);app.innerHTML=`<section class="view-head"><div><p class="eyebrow">ما حملته معك</p><h1>ما اخترتُه</h1><p>${cards.length} بطاقة مختارة.</p></div></section>${cards.length?`<div class="list">${cards.map(c=>itemHtml(c,`<p>${esc(c.tadabbur_text)}</p>`)).join("")}</div>`:`<section class="empty">لم تختر بطاقة بعد. يمكنك اختيار أي بطاقة من «اللقاء».</section>`}`;wireOpenCards();}
async function renderReturn(){const cards=await hydrateIds(state.recent.slice(0,10));const written=Object.keys(state.notes).filter(k=>state.notes[k]?.trim()).length;app.innerHTML=`<section class="view-head"><div><p class="eyebrow">مراجعة هادئة</p><h1>العودة</h1><p>ارجع إلى ما مررت به بدل أن تبدأ من الصفر.</p></div></section><div class="stats"><div class="stat"><b>${state.recent.length}</b><span>بطاقة زرتها</span></div><div class="stat"><b>${written}</b><span>كتابة محفوظة</span></div><div class="stat"><b>${state.chosen.length}</b><span>بطاقة مختارة</span></div></div>${cards.length?`<div class="list">${cards.map(c=>itemHtml(c,`<p>${esc(c.tadabbur_text.slice(0,240))}${c.tadabbur_text.length>240?"…":""}</p>`)).join("")}</div>`:`<section class="empty">ابدأ بأول لقاء، وستظهر هنا بطاقات العودة.</section>`}`;wireOpenCards();}
const imageManifests={};
// Image-based hizbs (H07, H08…): same reader, per-hizb manifest, element ids/classes and saved position.
// H07 keeps its original ids (#h07Group, .h07-image…) and state key (h07Page).
async function renderImageHizb(h){
  const key=h.id.toLowerCase();
  if(!imageManifests[h.id]){
    const response=await fetch(`/tadabbur/data/${key}-images.json`);
    if(!response.ok) throw new Error(`تعذر تحميل صور ${h.title}`);
    imageManifests[h.id]=await response.json();
  }
  const manifest=imageManifests[h.id];
  const pages=manifest.pages;
  const pageKey=`${key}Page`;
  const pageNumber=Math.max(1,Math.min(pages.length,Number(state[pageKey])||1));
  state[pageKey]=pageNumber;saveState();
  const page=pages[pageNumber-1];
  const group=manifest.groups.find(g=>g.id===page.group);
  const ar=n=>Number(n).toLocaleString('ar-SA',{useGrouping:false});
  const controls=()=>`<div class="actions ${key}-paging img-paging"><button class="btn ${key}-prev" type="button" ${pageNumber===1?'disabled':''}>السابق</button><span aria-live="polite">الصورة ${ar(pageNumber)} من ${ar(pages.length)}</span><button class="btn primary ${key}-next" type="button" ${pageNumber===pages.length?'disabled':''}>التالي</button></div>`;
  app.innerHTML=`<section class="view-head"><div><p class="eyebrow">${esc(h.title)} · ${esc(h.rangeAr)}</p><h1>اللقاء</h1><p>${ar(h.stations)} محطات · ${ar(h.count)} بطاقة · ${ar(pages.length)} صورة</p></div></section>
    <section class="${key}-controls img-controls" aria-label="التنقل في ${esc(h.title)}">
      <label for="${key}Group">المحطة أو القسم</label><select id="${key}Group">${manifest.groups.map(g=>`<option value="${g.start}" ${g.id===group.id?'selected':''}>${esc(g.label)} (${ar(g.count)} صورة)</option>`).join('')}</select>
      <label for="${key}Page">الصورة داخل القسم</label><select id="${key}Page">${pages.slice(group.start-1,group.start-1+group.count).map((p,i)=>`<option value="${group.start+i}" ${group.start+i===pageNumber?'selected':''}>${ar(i+1)} · ${esc(p.title)}</option>`).join('')}</select>
    </section>${controls()}
    <figure class="${key}-figure img-figure"><a href="${esc(page.src)}" target="_blank" rel="noopener" aria-label="فتح الصورة بحجمها الأصلي للتكبير"><img class="${key}-image img-page" src="${esc(page.src)}" width="1080" height="1920" alt="${esc(page.label)} — ${esc(page.title)} — الصورة ${esc(page.stationPage)}"></a><figcaption>${esc(page.title)} · <a href="${esc(page.src)}" target="_blank" rel="noopener">فتح بالحجم الأصلي</a></figcaption></figure>
    <p id="${key}ImageError" class="error-card" hidden>تعذر تحميل الصورة. <button class="btn" id="${key}ImageRetry" type="button">إعادة المحاولة</button></p>${controls()}`;
  const jump=async value=>{state[pageKey]=Number(value);saveState();await render();app.scrollIntoView({block:'start'});};
  document.getElementById(`${key}Group`).addEventListener('change',e=>jump(e.target.value));
  document.getElementById(`${key}Page`).addEventListener('change',e=>jump(e.target.value));
  document.querySelectorAll(`.${key}-prev`).forEach(b=>b.addEventListener('click',()=>jump(pageNumber-1)));
  document.querySelectorAll(`.${key}-next`).forEach(b=>b.addEventListener('click',()=>jump(pageNumber+1)));
  const img=document.querySelector(`.${key}-image`);
  img.addEventListener('error',()=>{document.getElementById(`${key}ImageError`).hidden=false;});
  document.getElementById(`${key}ImageRetry`).addEventListener('click',()=>render());
}


function renderHizbs(){app.innerHTML=`<section class="view-head"><div><p class="eyebrow">${TOTAL} بطاقة · ثمانية أحزاب</p><h1>الأحزاب</h1><p>المحتوى محفوظ داخل بيت الفؤاد نفسه ولا يعتمد على موقع خارجي أو قاعدة بيانات خارجية.</p></div></section><div class="hizb-grid">${HIZBS.map(h=>`<button class="hizb-card ${h.id===state.hizb?"current":""}" data-hizb="${h.id}" type="button"><strong>${h.title}</strong><span>${h.range}</span><small>${h.count} بطاقة${h.images?` · ${Number(h.stations).toLocaleString("ar-SA")} محطات · ${Number(h.pages).toLocaleString("ar-SA",{useGrouping:false})} صورة`:""}</small></button>`).join("")}</div>`;document.querySelectorAll(".hizb-card").forEach(b=>b.addEventListener("click",()=>goToCard(b.dataset.hizb,b.dataset.hizb===state.hizb?state.card:1)));}
async function render(){setActiveNav(state.view);document.body.dataset.scale=state.scale;scaleSel.value=state.scale;try{if(state.view==="encounter")return await renderEncounter();if(state.view==="written")return await renderWritten();if(state.view==="chosen")return await renderChosen();if(state.view==="return")return await renderReturn();return renderHizbs();}catch(err){renderError(err);}}

document.querySelectorAll(".nav[data-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
menuBtn.addEventListener("click",()=>{const open=sideNav.classList.toggle("is-open");menuBtn.setAttribute("aria-expanded",String(open));});
scaleSel.addEventListener("change",()=>{state.scale=scaleSel.value;saveState();document.body.dataset.scale=state.scale;});
document.getElementById("exportBtn").addEventListener("click",()=>{const payload={exportedAt:new Date().toISOString(),project:"بيت الفؤاد | مسار الفؤاد للتدبر",version:1,totalCorpusCards:TOTAL,notes:state.notes,chosen:state.chosen,recent:state.recent};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`baytalfuad-tadabbur-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("تم تجهيز نسخة من سجلك");});
document.getElementById("eraseBtn").addEventListener("click",()=>confirmDlg.showModal());
confirmDlg.addEventListener("close",()=>{if(confirmDlg.returnValue==="confirm"){localStorage.removeItem(STORAGE_KEY);state={...defaultState};corpusPromise=null;render();toast("تم مسح السجل المحلي");}});
window.addEventListener("hashchange",()=>closeMenu());
{const q=new URLSearchParams(location.search).get("hizb");if(q&&HIZBS.some(h=>h.id===q&&h.images)){state.hizb=q;state.view="encounter";}}
render();

// Import the existing export without changing or uploading the visitor's record.
document.getElementById("importRecord").addEventListener("change",async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>2000000)throw Error("الملف كبير جدًا");const j=JSON.parse(await f.text());if(j.version!==1||!j.notes||typeof j.notes!=="object"||Array.isArray(j.notes)||!Array.isArray(j.chosen)||!Array.isArray(j.recent))throw Error("ملف سجل غير صالح");const valid=id=>/^H0[1-8]-[0-9]{2,3}$/.test(id);for(const [k,v]of Object.entries(j.notes))if(!valid(k)||typeof v!=="string")throw Error("ملاحظة غير صالحة");if(!j.chosen.every(valid)||!j.recent.every(valid))throw Error("بطاقة غير صالحة");state.notes={...j.notes,...state.notes};state.chosen=[...new Set([...state.chosen,...j.chosen])];state.recent=[...new Set([...state.recent,...j.recent])].slice(0,30);saveState();await render();toast("تم استيراد سجلك على هذا الجهاز");}catch(err){toast(err.message||"تعذر استيراد السجل");}finally{e.target.value="";}});
