import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {catalog} from '../program/catalog.mjs';
import {mixStreams,balanceFeedback} from '../program/lessons/balance.mjs';
import {classifyPairs,circleIntersections,classifyFeedback} from '../foundations/models/function-checks.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
assert.equal(catalog.courses.length,50);
assert.equal(new Set(catalog.courses.map(c=>c.id)).size,50);
assert.equal(catalog.courses.filter(c=>c.semester==='elective').length,4);
assert.deepEqual(catalog.semesters.map(s=>s.number),[1,2,3,4,5,6,7,8]);
for(const semester of catalog.semesters){
 const credits=catalog.courses.filter(c=>c.semester===semester.number).reduce((s,c)=>s+c.credits,0);
 assert.equal(credits+semester.electiveCredits,semester.credits,`Semester ${semester.number} credit mismatch`);
}
assert.equal(catalog.semesters.reduce((s,c)=>s+c.credits,0),128);
assert.equal(catalog.courses.filter(c=>c.status==='lessons-available').length,3);
assert.equal(catalog.courses.filter(c=>c.status==='starter-available').length,1);
const files=['index.html','program/index.html','program/lessons/material-balances/index.html',...catalog.courses.map(c=>`program/courses/${c.id.toLowerCase()}/index.html`)];
for(const course of catalog.courses){
 assert.ok(course.sourceIds.every(id=>catalog.sources.some(s=>s.id===id)));
 assert.equal(course.officialPrerequisites,null);
 assert.equal(course.status==='outline-only',course.resources.length===0);
 assert.ok(course.topics.length>0);
}
for(const file of files){
 const page=read(file);
 assert.ok(!/\son[a-z]+\s*=|<script(?![^>]*\bsrc=)/i.test(page),`Inline code violates CSP: ${file}`);
 assert.equal((page.match(/<h1[ >]/g)||[]).length,1);
 for(const [,url] of page.matchAll(/(?:href|src)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){
  const target=path.join(root,url.replace(/^\//,''),url.endsWith('/')?'index.html':'');
  assert.ok(fs.existsSync(target),`Missing local destination: ${file} -> ${url}`);
 }
}
const current=JSON.parse(read('semester-1/curriculum.json'));
for(const topic of current.courses.flatMap(c=>c.topics)){
 const page=read(topic.href.slice(1)+'index.html');
 assert.ok(page.indexOf('id="learn"')<page.indexOf('id="try"'),`Question still comes first: ${topic.key}`);
 assert.ok(page.includes('data-question="diagnostic"')&&page.includes('data-question="transfer"'));
}
const mix=mixStreams(100,.2,50,0);
assert.equal(mix.flow,150);assert.equal(mix.solute,20);assert.ok(Math.abs(mix.fraction-2/15)<1e-12);
for(const b of [0,10,50,100,300]){const m=mixStreams(100,.2,b,0);assert.equal(m.solute,20);assert.ok(m.fraction>=0&&m.fraction<=.2)}
assert.equal(mixStreams(80,.15,70,0).fraction,.08);
assert.equal(mixStreams(0,.2,50,.1).fraction,.1);
for(const args of [[0,.2,0,0],[-1,.2,10,0],[1,2,1,0],[NaN,.2,1,0]])assert.throws(()=>mixStreams(...args),RangeError);
assert.ok(balanceFeedback('8').correct);
for(const raw of ['','NaN','Infinity','7.5','0.08','12','8%'])assert.equal(balanceFeedback(raw).correct,false);
assert.notEqual(balanceFeedback('7.5').message,balanceFeedback('0.08').message);
assert.equal(classifyPairs([[-2,5],[1,6],[3,6]]),true);
assert.equal(classifyPairs([[-2,5],[1,6],[3,6],[3,8]]),false);
assert.equal(classifyPairs([[1,6],[1,6]]),true);
assert.equal(circleIntersections(0).length,2);assert.equal(circleIntersections(2).length,1);assert.equal(circleIntersections(-2).length,1);assert.equal(circleIntersections(3).length,0);
assert.equal(classifyFeedback('repeated-output').correct,false);assert.equal(classifyFeedback('function').correct,true);
const guide=read('foundations/models/functions-and-domain/foundation-3/index.html');
assert.ok(guide.includes('interval notation')&&guide.includes('graph-input'));
console.log('Programme: 50 unique course records, 128-credit reference plan, local links, explanation-first flow, conservation and function edge cases passed.');
