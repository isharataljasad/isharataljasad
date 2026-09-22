export function parseAnswer(value) {
  const s=String(value ?? '').trim().replaceAll('−','-').replaceAll('٫','.').replace(/[٠-٩۰-۹]/g,c=>String(c.charCodeAt(0)-(c>='۰'?1776:1632)));
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const n=Number(s);
  return Number.isFinite(n)?n:null;
}
export function isCorrect(value, question) {
  const n=parseAnswer(value);
  return n!==null && Math.abs(n-question.answer)<=question.tolerance;
}
export function status(record) {
  if(!record) return 'Not started';
  if(record.transferRevealed) return 'Review needed';
  if(record.transferCorrect) return 'Check passed';
  return 'In progress';
}
