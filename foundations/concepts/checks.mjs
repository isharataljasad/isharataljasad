/* Device-local practice: attempts and reveals are recorded, never mastery. */
export const storageKey = 'yic-bsce:concept-checks:v1';
const object = x => x && typeof x === 'object' && !Array.isArray(x);
export function load(storage) {
  try { const x=JSON.parse(storage.getItem(storageKey)); if(object(x)&&object(x.concepts)) return x; } catch {}
  return {concepts:{}};
}
export function parseNumber(raw) {
  const s=String(raw??'').trim().replaceAll('−','-').replaceAll('٫','.')
    .replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776));
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const x=Number(s); return Number.isFinite(x)?x:null;
}
export function judge(q,raw) {
  if(q.kind==='choice') {
    if(raw===null || raw===undefined || !/^\d+$/.test(String(raw))) return {status:'invalid'};
    const o=q.options[Number(raw)];
    return !o?{status:'invalid'}:o.correct?{status:'correct'}:{status:'wrong',why:o.why};
  }
  const value=parseNumber(raw);
  if(value===null) return {status:'invalid'};
  if(Math.abs(value-q.answer)<=q.tolerance) return {status:'correct'};
  const known=(q.responses??[]).find(r=>Math.abs(value-r.value)<=q.tolerance);
  return {status:'wrong',why:known?.why};
}
export function currentEntry(old,q) {
  return object(old)&&old.version===q.version?old:{version:q.version,attempts:0,followUpAttempts:0};
}
export function recordAttempt(entry,result,follow=false) {
  if(result.status==='invalid') return;
  const attempts=follow?'followUpAttempts':'attempts';
  entry[attempts]=(Number(entry[attempts])||0)+1;
  entry[follow?'followUpLastStatus':'lastStatus']=result.status;
  if(result.status==='correct') entry[follow?'followUpSolved':'solved']=true;
  if(!follow&&result.status==='wrong') entry.followUpShown=true;
}
export async function initConceptChecks() {
  const host=document.querySelector('[data-concept-checks]'); if(!host)return;
  const slug=host.dataset.conceptChecks;let data;
  try {const r=await fetch(`/foundations/concepts/${slug}/checks.json`);if(!r.ok)throw Error();data=await r.json();if(!Array.isArray(data.checks))throw Error();}
  catch {host.querySelectorAll('.check-feedback').forEach(el=>el.textContent='Practice data could not load. Reload to retry; the written explanations and solutions remain available.');return;}
  let storage;try{storage=window.localStorage;}catch{}
  const state=load(storage),record=object(state.concepts[slug])?state.concepts[slug]:{};
  const summary=host.querySelector('[data-check-summary]');let storageWorks=Boolean(storage);
  for(const q of data.checks)record[q.id]=currentEntry(record[q.id],q);
  const report=()=>{
    const entries=data.checks.map(q=>record[q.id]);
    const independent=entries.filter(e=>e.solved&&!e.revealed).length;
    const afterReveal=entries.filter(e=>e.solved&&e.revealed).length;
    const followIndependent=entries.filter(e=>e.followUpSolved&&!e.followUpRevealed).length;
    const followRevealed=entries.filter(e=>e.followUpSolved&&e.followUpRevealed).length;
    if(summary)summary.textContent=`Correct without revealing this check: ${independent} of ${entries.length}. Correct after reveal: ${afterReveal}. Follow-ups correct without reveal: ${followIndependent}; after reveal: ${followRevealed}. This records attempts on this browser, not mastery or a university grade.${storageWorks?'':' Progress cannot be saved in this browser.'}`;
  };
  const persist=id=>{
    try {const latest=load(storage);if(!object(latest.concepts[slug]))latest.concepts[slug]={};latest.concepts[slug][id]=record[id];storage.setItem(storageKey,JSON.stringify(latest));storageWorks=true;}catch{storageWorks=false;}report();
  };
  for(const q of data.checks){
    const box=host.querySelector(`[data-check="${q.id}"]`);if(!box)continue;
    const entry=record[q.id],feedback=box.querySelector('.check-feedback'),solution=box.querySelector('.check-solution'),followBox=box.querySelector('.check-followup');
    const showFollow=()=>{if(followBox){followBox.hidden=false;entry.followUpShown=true;}};
    const bind=(form,problem,fb,follow)=>form?.addEventListener('submit',event=>{
      event.preventDefault();const raw=new FormData(form).get('answer'),result=judge(problem,raw);
      fb.dataset.result=result.status;
      if(result.status==='invalid'){fb.textContent=problem.kind==='choice'?'Choose one option before checking.':`Enter a finite number${problem.unit?` in ${problem.unit}`:''}, without unit text.`;return;}
      recordAttempt(entry,result,follow);
      if(result.status==='correct')fb.textContent=entry[follow?'followUpRevealed':'revealed']?'Correct after revealing the solution; recorded separately from an independent attempt.':'Correct without revealing this check. Explain the method before moving on; one answer does not establish mastery.';
      else {fb.textContent=`Not correct. ${result.why??'Review the model, units, signs and worked steps.'}${follow?' Try again or open the worked answer.':' Try the different problem below.'}`;if(!follow)showFollow();}
      persist(q.id);
    });
    bind(box.querySelector('form'),q,feedback,false);
    box.querySelector('.check-reveal').addEventListener('click',()=>{if(!entry.solved)entry.revealed=true;solution.hidden=false;showFollow();persist(q.id);});
    if(followBox){
      const fb=followBox.querySelector('.check-feedback'),disclosure=followBox.querySelector('details');
      bind(followBox.querySelector('form'),q.followUp,fb,true);
      disclosure?.addEventListener('toggle',()=>{if(disclosure.open&&!entry.followUpSolved){entry.followUpRevealed=true;persist(q.id);}});
      if(entry.followUpRevealed&&disclosure)disclosure.open=true;
      if(entry.followUpSolved){fb.dataset.result='correct';fb.textContent=entry.followUpRevealed?'Previously correct after revealing the follow-up.':'Previously correct without revealing the follow-up.';}
    }
    if(entry.solved){feedback.dataset.result='correct';feedback.textContent=entry.revealed?'Previously correct after revealing the solution.':'Previously correct without revealing this check.';}
    else if(entry.attempts){feedback.dataset.result='wrong';feedback.textContent='A previous attempt needs review.';}
    if(entry.revealed)solution.hidden=false;
    if(entry.followUpShown||entry.revealed||entry.followUpAttempts)showFollow();
    persist(q.id);
  }
  report();
}
if(typeof document!=='undefined')initConceptChecks();
