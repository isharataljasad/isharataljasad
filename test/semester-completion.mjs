import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessons} from '../bayt/data/lessons/index.mjs';
import {explorations,evaluate} from '../semester-1/assets/exploration-models.mjs';
import {readProgress,saveProgress,storageKey} from '../semester-1/assets/progress-store.mjs';
import {parseAnswer} from '../semester-1/assets/practice.mjs';
const curriculum=JSON.parse(fs.readFileSync(new URL('../semester-1/curriculum.json',import.meta.url)));
const topics=curriculum.courses.flatMap(c=>c.topics);
assert.equal(lessons.length,26); assert.equal(Object.keys(explorations).length,26);
for(const t of topics){
 const h=fs.readFileSync(new URL(`..${t.href}index.html`,import.meta.url),'utf8');
 const m=explorations[t.key]; assert.ok(m);
 const ref=h.indexOf('id="bayt-reference"'), guide=h.indexOf('id="bayt-guided"'), firstQuestion=h.indexOf('<form');
 assert.ok(ref>0 && guide>ref && firstQuestion>guide,`${t.key}: questions precede teaching`);
 for(const x of [m.min,m.start,m.max]){
  const r=evaluate(m,x); assert.ok(r.value===null||Number.isFinite(r.value));assert.ok(r.text);
 }
 assert.equal(evaluate(m,NaN).value,null);
 assert.equal(evaluate(m,m.max+m.step).value,null);
}
const calc=(key,x)=>evaluate(explorations[key],x).value;
assert.equal(calc('MA101.limits',3),null);
assert.ok(Math.abs(calc('MA101.limits',2.999)-6)<.002);
assert.equal(calc('MA101.continuity',4),0);
assert.equal(calc('MA101.optimization',5),25);
assert.equal(calc('MA101.optimization',0),0);
assert.equal(calc('PHY101.friction',20),0);
assert.equal(calc('PHY101.friction',25),2);
assert.equal(calc('PHY101.motion',2),20);
assert.equal(calc('PHY101.motion',4),0);
assert.equal(calc('PHY101.momentum',-5),-2);
assert.equal(calc('CHEM101.aqueous-reactions',.02),.01);
assert.equal(calc('CHEM101.aqueous-reactions',.003),.003);
assert.equal(calc('CHEM101.electrochemistry',0),1.1);
assert.ok(Math.abs(calc('CHEM101.electrochemistry',2)-1.04084)<1e-10);
assert.equal(calc('CHEM101.solutions',1000),.1);
assert.equal(parseAnswer('−٠٫٣'),-.3); assert.equal(parseAnswer('۱۲٫۵'),12.5);
assert.equal(parseAnswer('٣ kg'),null);
// Regression: two training systems write in either order without losing the other.
const memory=new Map(); const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
const a={topics:{T:{checkpointVersion:1,transferCorrect:true}},lastTopic:'T'};
const b={topics:{T:{bayt:{ladder:{correct:true,version:'1'}}}}};
assert.ok(saveProgress(b,'bayt','T',storage));assert.ok(saveProgress(a,'legacy',undefined,storage));
let merged=readProgress(storage);assert.equal(merged.topics.T.bayt.ladder.correct,true);assert.equal(merged.topics.T.transferCorrect,true);
a.topics.T.transferRevealed=true;saveProgress(a,'legacy',undefined,storage);saveProgress(b,'bayt','T',storage);
merged=readProgress(storage);assert.equal(merged.topics.T.transferRevealed,true);assert.equal(merged.lastTopic,'T');
storage.setItem(storageKey,'invalid');assert.deepEqual(readProgress(storage),{topics:{}});
assert.equal(saveProgress(a,'legacy',undefined,{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}),false);
// Independent worked-result checks for newly added topics (not schema-only tests).
const answer=(topic,id)=>lessons.find(l=>l.topic===topic).questionTypes.find(q=>q.id===id).answer;
assert.ok(Math.abs(answer('related-rates','ladder')+6*.4/Math.sqrt(100-36))<1e-12);
assert.ok(Math.abs(answer('approximation','reciprocal')-(.5-.02/4))<1e-12);
assert.equal(answer('mean-value','mvt'),(36-4)/(6-2)/2);
assert.equal(answer('curve-shape','minimum'),1-3);
assert.equal(answer('quantum-theory','capacity'),2*3**2);
assert.equal(answer('bonding','count'),5+3*6+1);
assert.equal(answer('aqueous-reactions','neutralization'),25*.2/.1);
assert.equal(answer('electrochemistry','gibbs'),-2*96485/1000);
console.log('Semester completion: 26 teaching-first routes, 26 model domains, scientific boundary cases, Arabic inputs and independent progress writers passed.');
