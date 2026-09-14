export const TRACKS=['books','educator','pearson'];
export const STATUSES={audit:'قيد التدقيق',trial:'جاهز للتجربة',approved:'التدقيق مغلق'};
export function assessmentStatus(a={}){const n=['understood','applied','needMore'].filter(k=>a[k]).length;return n===3?'مكتمل':n||a.note?'جزئي':'لم يبدأ'}
export function canMerge(state){return TRACKS.every(k=>{const t=state.tracks[k];return t.status==='approved'&&t.parent&&t.student})}
export function validateState(s){
 if(!s||s.schema!==1||typeof s.revision!=='string'||!s.tracks||!s.assessments||!Array.isArray(s.journal)||s.journal.length>10000)throw Error('صيغة ذاكرة المشروع غير صالحة.');
 for(const k of TRACKS){const t=s.tracks[k];if(!t||!STATUSES[t.status]||typeof t.parent!=='boolean'||typeof t.student!=='boolean'||!['owner','next','note'].every(x=>typeof t[x]==='string'&&t[x].length<=20000))throw Error('بيانات المسار غير صالحة.');}
 for(const [id,a] of Object.entries(s.assessments)){if(!/^R\d{2}$/.test(id)||!a||!['understood','applied','needMore','note'].every(k=>a[k]===undefined||typeof a[k]==='string'&&a[k].length<=20000))throw Error('تقييم غير صالح.');for(const k of ['understood','applied','needMore'])if(a[k]&&!['yes','partial','no'].includes(a[k]))throw Error('قيمة تقييم غير صالحة.');}
 for(const e of s.journal)if(!e||!['id','date','track','author','text'].every(k=>typeof e[k]==='string')||!['all',...TRACKS].includes(e.track)||e.text.length>30000||!Number.isFinite(Date.parse(e.date)))throw Error('سجل غير صالح.');
 return s;
}
export function handoff(s,names){return `# تسليم مشروع العلوم\nالتحديث: ${s.updatedAt}\nلا دمج قبل إغلاق تدقيق المصادر واعتماد الأب وتجربة الطالب.\nالمصادر: الكتابان (Cengage + Pearson)، Educator، Pearson+.\n\n`+TRACKS.map(k=>{const t=s.tracks[k];return `## ${names[k]}\nالحالة: ${STATUSES[t.status]}\nالمسؤول: ${t.owner}\nالتالي: ${t.next}\nاعتماد الأب: ${t.parent?'نعم':'لم يسجل'}\nتجربة الطالب: ${t.student?'معتمدة':'لم تعتمد'}\nملاحظة: ${t.note}\n`}).join('\n')+'\n## آخر المستجدات\n'+s.journal.slice(0,20).map(e=>`${e.date} | ${e.author} | ${e.text}`).join('\n\n')+'\n\nافحص الملفات والأدلة قبل تحديث الحالة. لا تعتبر هذا السجل إثبات مشاهدة الفيديوهات. أعد تقريرًا يوضح المنجز والمتبقي والخطوة التالية، ولا تدّع تحديث المنصة تلقائيًا.\n';}
