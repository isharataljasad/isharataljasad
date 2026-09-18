export const kinds = ['conceptual','algebraic','numerical','graphical','units'];

export function parseNumber(value) {
  const s=String(value ?? '').trim().replaceAll('−','-');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const n=Number(s);
  return Number.isFinite(n)?n:null;
}

export function assess(question, value) {
  if (question.type==='choice') {
    if (value===null || String(value).trim()==='') return null;
    const index=Number(value);
    if (!Number.isInteger(index) || index<0 || index>=question.options.length) return null;
    if (index===question.answer) return {correct:true};
    const [kind,text]=question.wrong?.[index] || ['conceptual','Recheck the meaning of the quantities.'];
    return {correct:false,kind,text};
  }
  const number=parseNumber(value);
  if (number===null) return null;
  if (Math.abs(number-question.answer)<=question.tolerance) return {correct:true};
  const match=question.wrong?.find(item=>Math.abs(number-item.value)<=Math.max(question.tolerance,Math.abs(item.value)*0.0001));
  return {correct:false,kind:match?.kind || 'numerical',text:match?.text || 'Check the setup, signs and units; then compare with the worked example.'};
}

export function answerRecord(old={}, result) {
  const attempts=(old.attempts || 0)+1;
  return {...old,attempts,correct:result.correct || Boolean(old.correct),cleanCorrect:Boolean(old.cleanCorrect) || (result.correct && attempts===1 && !old.aid && !old.revealed),wrong:Boolean(old.wrong) || !result.correct,lastKind:result.kind || old.lastKind};
}

export function progress(record) {
  if (!record) return 'Not started';
  const q=record.questions || {};
  const independent=q.independent?.cleanCorrect || q.retry?.cleanCorrect;
  const transfer=q.transfer?.cleanCorrect || q.transferRetry?.cleanCorrect;
  if (independent && transfer) return 'Solved independently';
  if (Object.values(q).some(x=>x?.wrong || x?.aid || x?.revealed)) return 'Needs review';
  return 'Practised';
}

export function questionChanged(record, version) {
  return Boolean(record && record.questionVersion!==version);
}
