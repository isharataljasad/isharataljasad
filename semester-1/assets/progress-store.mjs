export const storageKey='yic-bsce:published-2023:semester-1:v1';
export function readProgress(storage){
 try { storage??=globalThis.localStorage; const value=JSON.parse(storage.getItem(storageKey));
  if(value && value.topics && typeof value.topics==='object' && !Array.isArray(value.topics)) return value;
 } catch {}
 return {topics:{}};
}
/* Each writer owns its own fields; always read the latest record before saving. */
export function saveProgress(state,domain,topicKey,storage){
 try {
  storage??=globalThis.localStorage;
  const latest=readProgress(storage);
  if(domain==='bayt') {
   const bayt={...latest.topics[topicKey]?.bayt};
   for(const [id,entry] of Object.entries(state.topics[topicKey].bayt)) {
    const old=bayt[id];
    bayt[id]=old?.version===entry.version?{...old,...entry,correct:old.correct||entry.correct,revealed:old.revealed||entry.revealed,attempts:Math.max(old.attempts??0,entry.attempts??0)}:entry;
   }
   latest.topics[topicKey]={...latest.topics[topicKey],bayt,updatedAt:new Date().toISOString()};
  } else {
   const entries=topicKey?[[topicKey,state.topics[topicKey]??{}]]:Object.entries(state.topics);
   for(const [key,record] of entries) {
    latest.topics[key]={...record,bayt:latest.topics[key]?.bayt??record.bayt};
   }
   if(state.lastTopic) latest.lastTopic=state.lastTopic;
  }
  storage.setItem(storageKey,JSON.stringify(latest));return true;
 } catch {return false;}
}
