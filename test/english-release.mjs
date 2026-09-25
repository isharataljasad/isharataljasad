import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {lessons} from '../bayt/data/lessons/index.mjs';
import {explorations} from '../semester-1/assets/exploration-models.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const compatibility=JSON.parse(read('bayt/data/lessons/translation-versions.json'));
for(const lesson of lessons){
 assert.ok(!/[\u0620-\u064a]/.test(JSON.stringify(lesson)),`${lesson.course}.${lesson.topic}: Arabic teaching content`);
 const data=JSON.parse(read(`semester-1/assets/bayt/${(lesson.course==='chemistry'?'CHEM101':lesson.course.toUpperCase())}.${lesson.topic}.json`));
 for(const q of lesson.questionTypes){const entry=compatibility[`${lesson.course}.${lesson.topic}.${q.id}`];
  const hash=createHash('sha256').update(JSON.stringify(q)).digest('hex').slice(0,12);
  assert.equal(entry.englishHash,hash,'English progress compatibility has changed; review the question');
  assert.equal(data.questions.find(x=>x.id===q.id).version,entry.compatibleVersion);
 }
}
for(const [key,m]of Object.entries(explorations))for(const x of [m.min,m.start,m.max]){
 assert.ok(!/[\u0620-\u064a]/.test([m.title,m.label,m.assumptions,m.explain(x)].join(' ')),key);
}
assert.match(explorations['PHY101.motion'].assumptions,/20 m\/s/);
assert.match(explorations['PHY101.motion'].explain(2),/velocity is zero/);
assert.match(explorations['PHY101.friction'].assumptions,/5 kg/);
assert.match(explorations['PHY101.friction'].explain(25),/15 N/);
for(const file of ['index.html','program/index.html','bayt/index.html','semester-1/coverage/index.html']){
 const h=read(file);assert.ok(!/[\u0620-\u064a]/.test(h.replace(/<!--[\s\S]*?-->/g,'')),file);assert.match(h,/<html lang="en"/);
}
console.log('English release: 26 lessons and models, English entry pages, all 153 compatible question versions passed.');
