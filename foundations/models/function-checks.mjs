export function classifyPairs(pairs){
 const outputs=new Map();
 for(const [x,y] of pairs){if(outputs.has(x)&&outputs.get(x)!==y)return false;outputs.set(x,y)}
 return true;
}
export function circleIntersections(x){if(!Number.isFinite(x)||Math.abs(x)>2)return [];const y=Math.sqrt(Math.max(0,4-x*x));return y===0?[0]:[-y,y]}
export function classifyFeedback(value){
 if(value==='function')return {correct:true,message:'Yes. Each of the inputs −2, 1 and 3 has exactly one output. Two inputs sharing output 6 is allowed. Now check the changed case below.'};
 if(value==='repeated-output')return {correct:false,message:'You found a repeated output, 6. Follow the input instead: input 1 gives 6 and input 3 also gives 6. Neither input has two outputs. Revisit “A function is a relation with a dependable output”, then try again.'};
 if(value==='count')return {correct:false,message:'The number of pairs does not decide this. A relation with three pairs can be a function or fail to be one. Check whether the same input is assigned two different outputs.'};
 return {correct:false,message:'Choose a reason before checking.'};
}
