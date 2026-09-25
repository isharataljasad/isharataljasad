import assert from 'node:assert/strict';
import {load,parseNumber,judge,currentEntry,recordAttempt,storageKey} from '../foundations/concepts/checks.mjs';
import {conceptChecks} from '../program/concept-checks.mjs';
import {safeTopic} from '../foundations/concepts/return-topic.mjs';
assert.equal(safeTopic('/semester-1/math/limits/#learn','https://example.test'),'/semester-1/math/limits/#learn');
for(const url of ['https://evil.test/semester-1/math/','javascript:alert(1)','/login','/foundations/concepts/'])assert.equal(safeTopic(url,'https://example.test'),null);
for(const raw of ['',null,undefined,'Infinity','4 kg','2+2','1,2'])assert.equal(parseNumber(raw),null);
assert.equal(parseNumber('−٠٫٣'),-.3);assert.equal(parseNumber('۱۲٫۵'),12.5);
assert.equal(parseNumber('2e3'),2000);assert.equal(parseNumber('0'),0);
const choice={kind:'choice',options:[{why:'wrong'},{correct:true}]};
assert.equal(judge(choice,'1').status,'correct');assert.equal(judge(choice,'0').status,'wrong');
for(const raw of [null,'','bad','9'])assert.equal(judge(choice,raw).status,'invalid');
const memory=new Map(),storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
for(const value of ['bad','null','[]','{"concepts":[]}']){storage.setItem(storageKey,value);assert.deepEqual(load(storage),{concepts:{}});}
assert.deepEqual(load({getItem(){throw Error('blocked');}}),{concepts:{}});
assert.deepEqual(currentEntry({version:1,solved:true},{version:2}),{version:2,attempts:0,followUpAttempts:0});
const entry=currentEntry(null,{version:2});recordAttempt(entry,{status:'invalid'});assert.equal(entry.attempts,0);
recordAttempt(entry,{status:'wrong'});assert.equal(entry.attempts,1);assert.equal(entry.followUpShown,true);
recordAttempt(entry,{status:'correct'},true);assert.equal(entry.followUpAttempts,1);assert.equal(entry.followUpSolved,true);assert.equal(entry.solved,undefined);
for(const [slug,checks]of Object.entries(conceptChecks))for(const q of checks)for(const problem of [q,q.followUp]){
 const answer=problem.kind==='choice'?String(problem.options.findIndex(o=>o.correct)):String(problem.answer);
 assert.equal(judge(problem,answer).status,'correct',`${slug}/${q.id}`);
 for(const r of problem.responses??[])assert.equal(judge(problem,String(r.value)).status,'wrong');
}
console.log('Concept runtime: selected choice, blank vs zero, finite input, version reset, storage failures and separate follow-ups passed.');
