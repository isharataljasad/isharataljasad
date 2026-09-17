import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {parseAnswer,isCorrect,status} from '../semester-1/assets/practice.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');
const data=JSON.parse(read('semester-1/curriculum.json'));
assert.deepEqual(data.courses.map(c=>c.code),['MA 101','PHY 101','CHEM 101']);
assert.equal(data.activeSemester,1);
assert.equal(data.courses.reduce((s,c)=>s+c.credits,0),12);
assert.match(data.scopeStatus,/provisional/);
assert.ok(!/href="\/(biology|english)\//.test(html));
const topics=data.courses.flatMap(c=>c.topics);
assert.equal(topics.length,26);
assert.equal(new Set(topics.map(t=>t.key)).size,topics.length);
for(const t of topics){
 const page=read(t.href.slice(1)+'index.html');
 assert.ok(page.includes('data-topic="'+t.key+'"'));
 for(const kind of ['diagnostic','transfer']){
  const q=t[kind];
  assert.ok(Number.isFinite(q.answer));
  assert.ok(q.explanation.length>0);
  assert.ok(isCorrect(String(q.answer),q));
  assert.ok(!isCorrect('',q));
  assert.ok(!isCorrect(String(q.answer+100),q));
 }
 assert.ok(t.suggestedPrevious.every(k=>topics.some(x=>x.key===k)));
 assert.ok(Object.values(t.resources).some(list=>list.length>0));
 for(const [,url] of page.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)){
  const path=url.slice(1)+(url.endsWith('/')?'index.html':'');
  assert.ok(existsSync(new URL(path,root)),`Broken local link: ${path}`);
 }
}
assert.equal(parseAnswer('−2.5'),-2.5);
assert.equal(parseAnswer('1e3'),1000);
for(const x of ['',' ','Infinity','NaN','3 kg']) assert.equal(parseAnswer(x),null);
assert.equal(status(), 'Not started');
assert.equal(status({transferCorrect:true}), 'Check passed');
assert.equal(status({transferCorrect:true,transferRevealed:true}), 'Review needed');
console.log('Semester 1: scope, 26 routes, 52 checks, links and progress states passed.');
