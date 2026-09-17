import {parseAnswer,isCorrect,status} from './practice.mjs';

const storageKey='yic-bsce:published-2023:semester-1:v1';
let state={topics:{}};
try {const s=JSON.parse(localStorage.getItem(storageKey));if(s && typeof s.topics==='object' && s.topics!==null) state=s;}catch{}
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{document.querySelectorAll('.small-note').forEach(e=>e.textContent='Progress cannot be saved in this browser session.');}};
const safeRecord=key=>state.topics[key] && typeof state.topics[key]==='object'?state.topics[key]:{};

async function init(){
  const response=await fetch('/semester-1/curriculum.json');
  if(!response.ok) throw new Error('Course data unavailable');
  const curriculum=await response.json();
  const topics=curriculum.courses.flatMap(c=>c.topics);
  for(const t of topics){
    const record=state.topics[t.key];
    if(record && record.checkpointVersion!==t.checkpointVersion) delete state.topics[t.key];
  }
  for(const c of curriculum.courses){
    const passed=c.topics.filter(t=>status(state.topics[t.key])==='Check passed').length;
    document.querySelectorAll(`[data-course-progress="${c.id}"]`).forEach(e=>e.textContent=passed);
  }
  document.querySelectorAll('[data-state]').forEach(e=>{const s=status(state.topics[e.dataset.state]);e.textContent=s;e.dataset.status=s;});
  const last=topics.find(t=>t.key===state.lastTopic);
  const resume=document.getElementById('resume-link');
  if(last && resume){resume.href=last.href;resume.textContent=`Continue ${last.title} →`;document.getElementById('resume-note').textContent=status(state.topics[last.key]);}
  const topic=topics.find(t=>t.key===document.body.dataset.topic);
  if(!topic) return;
  state.lastTopic=topic.key;save();
  const record=safeRecord(topic.key);
  record.checkpointVersion=topic.checkpointVersion;
  const update=()=>{
    state.topics[topic.key]=record;record.updatedAt=new Date().toISOString();save();
    const display=document.getElementById('topic-status');
    if(record.transferRevealed) display.textContent='Reasoning reviewed. Try a different problem from the practice material before treating this as independent success.';
    else if(record.transferCorrect) display.textContent=`New example passed · ${record.transferAttempts} attempt${record.transferAttempts===1?'':'s'}. Explain why the method works before moving on.`;
    else display.textContent='Your practice is in progress. Try the new example after studying the idea.';
  };
  if(state.topics[topic.key]) update();
  for(const kind of ['diagnostic','transfer']){
    const section=document.querySelector(`[data-check="${kind}"]`), question=topic[kind];
    const feedback=section.querySelector('.feedback'), solution=section.querySelector('.solution');
    section.querySelector('form').addEventListener('submit',event=>{
      event.preventDefault();
      const input=section.querySelector('input').value;
      if(parseAnswer(input)===null){feedback.textContent='Enter a finite number only. The unit is shown above the field.';feedback.dataset.result='error';return;}
      record[`${kind}Attempts`]=(record[`${kind}Attempts`]||0)+1;
      const correct=isCorrect(input,question);
      if(correct) record[`${kind}Correct`]=true;
      feedback.dataset.result=correct?'correct':'retry';
      feedback.textContent=correct?(kind==='diagnostic'?'Correct. Read the explanation if needed, then try the new example.':'Correct. Check your units and explain the reasoning in your own words.'):'Not yet. Check the quantities, signs and units, then use the explanation below.';
      update();
    });
    section.querySelector('.reveal').addEventListener('click',()=>{
      if(!record[`${kind}Correct`]) record[`${kind}Revealed`]=true;
      solution.textContent=`Answer: ${question.answer}${question.unit?' '+question.unit:''}. ${question.explanation}`;
      solution.hidden=false;update();
    });
  }
}
init().catch(()=>{document.querySelectorAll('.feedback').forEach(e=>{e.textContent='Practice checking could not load. Refresh to try again; the written lessons remain available.';});});
