// H09 (النساء ٢٤–٨٧) publication checks: approved image set, order, grouping, hashes, and reader wiring.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);const read=f=>fs.readFileSync(new URL(f,root));
const m=JSON.parse(read('tadabbur/data/h09-images.json'));
// Approved distribution (H09-FINAL.zip sha256 820ccaad…): intro 3; stations 15,22,24,17,12,23,25,22; summary 4.
assert.equal(m.count,167);assert.equal(m.pages.length,167);assert.equal(m.cardCount,41);assert.equal(m.stationCount,8);
assert.deepEqual(m.groups.map(g=>g.count),[3,15,22,24,17,12,23,25,22,4]);
assert.deepEqual(m.groups.map(g=>g.id),['H09-00-INTRO',...Array.from({length:8},(_,i)=>`H09-ST0${i+1}`),'H09-SUMMARY']);
let start=1;for(const g of m.groups){assert.equal(g.start,start,`${g.id} start`);start+=g.count;}
const srcs=new Set();
for(const [i,p] of m.pages.entries()){
  assert.ok(!srcs.has(p.src),`duplicate ${p.src}`);srcs.add(p.src);
  const g=m.groups.find(x=>x.id===p.group);assert.ok(i+1>=g.start&&i+1<g.start+g.count,`page ${i+1} outside its group`);
  assert.match(p.src,/^\/tadabbur\/images\/H09\/H09-[A-Z0-9-]+\/H09-[A-Z0-9]+-\d{2}\.png$/);
  assert.equal(createHash('sha256').update(read(p.src.slice(1))).digest('hex'),p.sha256,`hash ${p.src}`);
}
// every card H09-C001..C041 present, verses 24..87 all shown
const cards=new Set(m.pages.map(p=>p.card).filter(c=>/^H09-C\d{3}$/.test(c)));assert.equal(cards.size,41);
const verses=new Set(m.pages.flatMap(p=>p.verses||[]));assert.deepEqual([...verses].sort((a,b)=>a-b),Array.from({length:64},(_,i)=>i+24));
// no stray files in the H09 image folder
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
assert.equal(walk(fileURLToPath(new URL('tadabbur/images/H09',root))).length,167);
// reader wiring
const app=read('tadabbur/app.js').toString();
assert.match(app,/\{id:"H09", title:"الحزب التاسع", range:"النساء 24–87", count:41, images:true, stations:8, pages:167/);
assert.doesNotMatch(app,/H0\[1-8\]/,'record import must accept every published hizb');
assert.match(app,/download="\$\{esc\(fileName\)\}"/,'image download link');
assert.match(app,/fetchpriority="high"/);assert.match(app,/history\.replaceState/);
// signed-in caching for images only, gate unchanged otherwise
const mw=read('middleware.js').toString();
assert.match(mw,/startsWith\("\/tadabbur\/images\/"\)\s*\?\s*"private, max-age=604800"\s*:\s*"private, max-age=0, must-revalidate"/);
assert.match(mw,/if \(!authed\)/);
console.log('H09 verified: 167 approved images (hash-checked), 10 groups in order, 41 cards, verses 24–87, reader wiring.');
