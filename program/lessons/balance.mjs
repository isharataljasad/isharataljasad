export function mixStreams(flowA,fractionA,flowB,fractionB){
 if(![flowA,fractionA,flowB,fractionB].every(Number.isFinite)||flowA<0||flowB<0||flowA+flowB<=0||fractionA<0||fractionA>1||fractionB<0||fractionB>1)throw new RangeError('Use nonnegative flows, a positive total flow and mass fractions from 0 to 1.');
 const flow=flowA+flowB;const solute=flowA*fractionA+flowB*fractionB;
 return {flow,solute,fraction:solute/flow};
}
export function balanceFeedback(raw){
 const value=typeof raw==='string'&&raw.trim()!==''?Number(raw):NaN;
 if(!Number.isFinite(value))return {correct:false,message:'Enter a number in percent, such as 8. Do not include the % sign.'};
 if(Math.abs(value-8)<0.01)return {correct:true,message:'Correct: 80 × 0.15 = 12 kg/h of solute, and 80 + 70 = 150 kg/h of mixture. 12 ÷ 150 × 100 = 8%. You used a component balance and a total balance.'};
 if(Math.abs(value-7.5)<0.01)return {correct:false,message:'7.5% is the unweighted average of 15% and 0%. The streams have different flow rates. Find solute flow first, then divide by total flow.'};
 if(Math.abs(value-0.08)<0.001)return {correct:false,message:'0.08 is the mass fraction. This answer asks for percent: multiply the fraction by 100.'};
 if(Math.abs(value-12)<0.01)return {correct:false,message:'12 is the solute mass flow in kg/h. The question asks for percent of the final mixture. Divide by 150 kg/h, then multiply by 100.'};
 if(Math.abs(value-15)<0.01)return {correct:false,message:'15% is the feed concentration, and 12 ÷ 80 also gives 15%. Both keep the solute inside stream A only. The 70 kg/h of water joins the same outlet, so divide by the total 150 kg/h, not by 80 kg/h. Diluting must lower the percentage.'};
 if(Math.abs(value-17.14)<0.01)return {correct:false,message:'17.14% is 12 ÷ 70. That divides by the water stream instead of the mixture. The outlet carries both feeds: 80 + 70 = 150 kg/h.'};
 if(Math.abs(value-13.33)<0.01)return {correct:false,message:'13.33% is the answer to the worked example above, which used 100 kg/h at 20% with 50 kg/h of water. This question has different numbers: 80 kg/h at 15% with 70 kg/h of water. Redo both balances with them.'};
 return {correct:false,message:'Draw the mixer boundary. Solute entering is 80 × 0.15 kg/h; pure water adds no solute. Total outlet flow is 80 + 70 kg/h. Use solute flow ÷ total flow × 100.'};
}
