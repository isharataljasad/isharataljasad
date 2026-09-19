import {mixStreams,balanceFeedback} from './balance.mjs';
const water=document.querySelector('#water-flow');
const paint=()=>{const b=Number(water.value);const result=mixStreams(100,.2,b,0);document.querySelector('#water-value').textContent=`${b} kg/h`;document.querySelector('#mixer-result').textContent=`${result.flow} kg/h total; ${result.solute} kg/h solute; ${(result.fraction*100).toFixed(2)}% solute by mass.`;document.querySelector('#out-label').textContent=`${result.flow} kg/h`;};
water.addEventListener('input',paint);paint();
document.querySelector('#balance-check').addEventListener('submit',event=>{event.preventDefault();const result=balanceFeedback(document.querySelector('#balance-answer').value);const output=document.querySelector('#balance-feedback');output.textContent=result.message;output.dataset.correct=String(result.correct);});
