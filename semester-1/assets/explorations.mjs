import {explorations,evaluate} from './exploration-models.mjs';
const format=n=>n===null?"Undefined":Number(n.toPrecision(6)).toLocaleString('en-US',{maximumSignificantDigits:6});
export function initExplorations() {
 const holder=document.querySelector('[data-exploration]');
 const model=explorations[document.body.dataset.topic];
 if(!holder||!model) return;
 const slider=holder.querySelector('input');
 const value=holder.querySelector('[data-explore-input]');
 const output=holder.querySelector('[data-explore-result]');
 const why=holder.querySelector('[data-explore-why]');
 const rows=holder.querySelector('tbody');
 function update(){
  const x=Number(slider.value), result=evaluate(model,x);
  value.textContent=`${format(x)} ${model.unit}`;
  output.textContent=`${format(result.value)} ${model.resultUnit}`;
  why.textContent=result.text;
  rows.replaceChildren();
  const sample=[Math.max(model.min,x-model.step),x,Math.min(model.max,x+model.step)];
  for(const v of [...new Set(sample.map(n=>Number(n.toFixed(10))))]){
   const tr=document.createElement('tr');
   for(const text of [format(v),format(evaluate(model,v).value)]){
    const td=document.createElement('td');td.textContent=text;tr.append(td);
   }
   rows.append(tr);
  }
 }
 slider.addEventListener('input',update);
 holder.querySelector('button').addEventListener('click',()=>{slider.value=model.start;update();});
 holder.hidden=false;update();
}
