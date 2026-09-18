import {skills,skillById} from './skills.mjs';
import {assess,answerRecord,progress,questionChanged} from './practice.mjs';
import {visuals} from './visuals.mjs';

const key='yic:math-foundations:v1';
const main=document.getElementById('main');
const params=new URLSearchParams(location.search);
const skill=skillById[params.get('skill')];
const from=params.get('from');
const safeFrom=from && /^\/semester-\d+\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(from) ? from : null;
let state={skills:{}};
try {const saved=JSON.parse(localStorage.getItem(key));if(saved && saved.skills && typeof saved.skills==='object') state=saved;} catch {}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{document.getElementById('storage-note').textContent='Progress cannot be saved in this browser.';}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linkTo=id=>`/foundations/?skill=${encodeURIComponent(id)}${safeFrom?`&from=${encodeURIComponent(safeFrom)}`:''}`;
const current=()=>state.skills[skill.id];
const touch=()=>{if(!current()) state.skills[skill.id]={questionVersion:skill.questionVersion,questions:{},updatedAt:new Date().toISOString()};return current();};
const questionState=name=>touch().questions[name] || {};
const setQuestion=(name,record)=>{const r=touch();r.questions[name]=record;r.updatedAt=new Date().toISOString();save();updateProgress();showRetries();};
function updateProgress(){
  const r=skill?current():null;
  if(skill){const target=document.getElementById('skill-status');target.textContent=progress(r);target.dataset.status=progress(r);}
  document.querySelectorAll('[data-skill-status]').forEach(el=>{const s=skillById[el.dataset.skillStatus],r=state.skills[s.id];el.textContent=progress(r);el.dataset.status=progress(r);});
}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function optionOrder(name,q){return q.options.map((_,i)=>i).sort((a,b)=>hash(skill.id+name+a)-hash(skill.id+name+b));}
function questionHtml(name,q,heading,label){
  const input=q.type==='choice' ? `<fieldset class="choices"><legend class="sr-only">${esc(q.prompt)}</legend>${optionOrder(name,q).map(i=>`<label><input type="radio" name="answer" value="${i}" required><span>${esc(q.options[i])}</span></label>`).join('')}</fieldset>` : `<label class="input-label" for="answer-${name}">Your answer${q.unit?` in ${esc(q.unit)}`:''}</label><input id="answer-${name}" name="answer" type="text" inputmode="decimal" autocomplete="off" required>`;
  return `<section class="question" id="${name}" data-question="${name}" ${name==='retry'||name==='transferRetry'?'hidden':''}><p class="eyebrow">${esc(label)}</p><h2>${esc(heading)}</h2><p>${esc(q.prompt)}</p><form>${input}<button type="submit">Check answer</button></form><p class="feedback" role="status" aria-live="polite"></p><div class="help-actions"><button type="button" data-hint>Get a hint</button><button type="button" data-reveal>Show the reasoning</button></div><p class="hint" hidden></p><p class="reason" hidden></p></section>`;
}
function listHtml(){
  document.title='Math Foundations | Yanbu Engineering Study';
  const groups=[
    {name:'Basic Math',id:'basic-math',description:'Number sense, signs, powers of ten, and units.'},
    {name:'Algebra',id:'algebra',description:'Rearrange relationships, read graphs, and use logarithms.'},
    {name:'Geometry',id:'geometry',description:'See dimensions, right triangles, and scale before using formulas.'},
    {name:'Trigonometry',id:'trigonometry',description:'Connect angles with components and direction.'},
    {name:'Next: Calculus',id:'calculus-bridge',description:'Connect average change to the derivative when your course needs it.'}
  ];
  return `<a class="back" href="/semester-1/">← Semester 1</a><header class="foundation-intro"><p class="eyebrow">SHARED THROUGH UNIVERSITY STUDY</p><h1>Math Foundations</h1><p>Choose the step blocking your science problem. Try a short check, repair the idea if needed, and return to your topic.</p><p class="quiet">Four entry points lead to one connected library. These original lessons support your courses; they are not another required course. A correct check is practice evidence, not a mastery claim.</p></header><section class="reading-promo" aria-label="Full reading lessons"><div><p class="eyebrow">EXPLANATION-FIRST READING</p><h2>Read the whole idea before the checks</h2><p>Five original chapters are available now in Basic Math, Algebra, Geometry, and Trigonometry. Each explains the concept before its selected question types.</p></div><a href="/foundations/reading/">Open reading chapters →</a></section><nav class="track-nav" aria-label="Foundation areas">${groups.map(g=>`<a href="#${g.id}">${esc(g.name)}</a>`).join('')}</nav>${groups.map(g=>`<section class="skill-group" id="${g.id}"><h2>${esc(g.name)}</h2><p class="group-description">${esc(g.description)}</p><div class="skill-grid">${skills.filter(s=>s.group===g.name).map(s=>`<a class="skill-card" href="${linkTo(s.id)}"><strong>${esc(s.title)}</strong><span>${esc(s.need)}</span><small data-skill-status="${s.id}">Not started</small></a>`).join('')}</div></section>`).join('')}<p class="quiet">Suggested earlier skills appear inside each lesson. You can open any skill directly.</p>`;
}
function skillHtml(){
  document.title=`${skill.title} | Math Foundations`;
  const prereqs=skill.prerequisites.length?`<p class="prereqs">Useful earlier steps: ${skill.prerequisites.map(id=>`<a href="${linkTo(id)}">${esc(skillById[id].title)}</a>`).join(' · ')}</p>`:'';
  const visual=visuals[skill.id];
  const figure=visual?`<figure class="lesson-visual">${visual.html}<figcaption>${esc(visual.caption)}</figcaption></figure>`:'';
  return `<div class="top-links"><a class="back" href="/foundations/${safeFrom?`?from=${encodeURIComponent(safeFrom)}`:''}">← All foundations</a><a class="return-link" href="${safeFrom || '/semester-1/'}">${safeFrom?'Return to your science topic':'Semester 1 courses'} →</a></div><header class="foundation-intro"><p class="eyebrow">MATH FOUNDATION</p><h1>${esc(skill.title)}</h1><p class="goal"><strong>Be able to:</strong> ${esc(skill.goal)}</p><p class="quiet">${esc(skill.need)}</p><p class="status-line">On this browser: <strong id="skill-status">Not started</strong></p>${prereqs}</header>${questionHtml('diagnostic',skill.diagnostic,'Check the starting point','TRY FIRST')}<section class="lesson" id="idea"><p class="eyebrow">THE IDEA</p><h2>Make the needed decision</h2><p>${esc(skill.idea)}</p><div class="equation">${skill.formula}</div>${figure}<div class="worked"><h3>Worked example</h3><ol>${skill.worked.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><details class="guided"><summary>Try one with a step of support</summary><p>${esc(skill.guided.prompt)}</p><details><summary>See the first step</summary><p>${esc(skill.guided.step)}</p></details><details><summary>Check the worked answer</summary><p>${esc(skill.guided.answer)}</p></details></details></section>${questionHtml('independent',skill.independent,'Solve a fresh problem','INDEPENDENT CHECK')}${questionHtml('retry',skill.retry,'Try a different problem','FRESH RETRY')}${questionHtml('transfer',skill.transfer,'Use it in science','TRANSFER')}${questionHtml('transferRetry',skill.transferRetry,'Transfer with new values','FRESH TRANSFER')}<section class="quick"><p class="eyebrow">QUICK REFERENCE</p><h2>Keep this in view</h2><p>${esc(skill.quick)}</p><p class="quiet">A hint or revealed solution counts as practice. An independent record requires fresh, unaided answers in both the skill and its science transfer. It is not a mastery grade.</p><a class="return-link" href="${safeFrom || '/semester-1/'}">${safeFrom?'Return to your science topic':'Semester 1 courses'} →</a></section>`;
}
function showRetries(){
  if(!skill) return;
  for(const [source,retry] of [['independent','retry'],['transfer','transferRetry']]){
    const r=current()?.questions?.[source];
    document.getElementById(retry).hidden=!(r && (r.wrong || r.aid || r.revealed));
  }
}
function bindQuestions(){
  for(const el of document.querySelectorAll('[data-question]')){
    const name=el.dataset.question,q=skill[name],feedback=el.querySelector('.feedback');
    el.querySelector('form').addEventListener('submit',event=>{
      event.preventDefault();
      const value=new FormData(event.currentTarget).get('answer');
      const result=assess(q,value);
      if(!result){feedback.textContent=q.type==='number'?'Enter a finite number. Use the unit shown above.':'Choose one answer.';feedback.dataset.result='error';return;}
      setQuestion(name,answerRecord(questionState(name),result));
      feedback.dataset.result=result.correct?'correct':'retry';
      const next=name==='independent'||name==='transfer'?'Review the idea, then try the fresh problem below.':name==='diagnostic'?'Review the idea below before the independent check.':'Use the hint or reasoning, then try again.';
      feedback.textContent=result.correct?`${name==='diagnostic'?'Good. You can move straight to the independent check.':'Correct. Explain the decision in your own words.'} ${q.reason}`:`${result.kind} difficulty: ${result.text} ${next}`;
    });
    el.querySelector('[data-hint]').addEventListener('click',()=>{
      setQuestion(name,{...questionState(name),aid:true});
      const box=el.querySelector('.hint');box.hidden=false;box.textContent=q.hint;
    });
    el.querySelector('[data-reveal]').addEventListener('click',()=>{
      setQuestion(name,{...questionState(name),aid:true,revealed:true});
      const box=el.querySelector('.reason');box.hidden=false;box.textContent=`Answer: ${q.type==='choice'?q.options[q.answer]:q.answer}${q.unit?' '+q.unit:''}. ${q.reason}`;
    });
  }
  document.querySelectorAll('.guided details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open){const r=touch();r.guided=true;save();updateProgress();}}));
}

for(const s of skills) if(questionChanged(state.skills[s.id],s.questionVersion)) delete state.skills[s.id];
save();
main.innerHTML=skill?skillHtml():listHtml();
updateProgress();
if(skill){bindQuestions();showRetries();}
