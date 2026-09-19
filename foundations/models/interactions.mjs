import {circleIntersections,classifyFeedback} from './function-checks.mjs';
const form=document.querySelector('#function-check');
if(form){
 form.addEventListener('submit',event=>{event.preventDefault();const result=classifyFeedback(new FormData(form).get('reason'));document.querySelector('#function-feedback').textContent=result.message;if(result.correct)document.querySelector('#changed-case').hidden=false;});
 document.querySelector('#changed-check').addEventListener('submit',event=>{event.preventDefault();const answer=new FormData(event.currentTarget).get('changed');document.querySelector('#changed-feedback').textContent=answer==='conflict'?'Correct. Input 3 now has outputs 6 and 8. The decisive change was a conflicting input, not the number of outputs in the whole set.':'Check the two pairs beginning with 3. They give different outputs for that same input, so the new relation is not a function.';});
}
const slider=document.querySelector('#graph-input');
if(slider){
 const update=()=>{const x=Number(slider.value);const ys=circleIntersections(x);const left=170+x*48,right=170+x*48;for(const [id,pos] of [['parabola-scan',left],['circle-scan',right]]){const el=document.querySelector('#'+id);el.setAttribute('x1',pos);el.setAttribute('x2',pos)}const point=document.querySelector('#parabola-hit');point.setAttribute('cx',left);point.setAttribute('cy',150-(x*x/2)*48);for(let i=0;i<2;i++){const dot=document.querySelector('#circle-hit-'+i);dot.setAttribute('cx',right);dot.setAttribute('cy',150-(ys[i]??0)*48);dot.setAttribute('visibility',i<ys.length?'visible':'hidden')};document.querySelector('#graph-value').textContent=x.toFixed(1);document.querySelector('#graph-feedback').textContent=`At x = ${x.toFixed(1)}, the parabola has one output and the circle has ${ys.length===1?'one output at this edge':'two different outputs'}. ${ys.length===1?'A passing line at the edge does not rescue the circle: other vertical lines still meet it twice.':'The circle fails the function rule because one input has two outputs.'}`};
 slider.addEventListener('input',update);update();
}
