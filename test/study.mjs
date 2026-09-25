import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {lessons} from '../bayt/data/lessons/index.mjs';
import {validate} from '../bayt/data/lessons/schema.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const curriculum=JSON.parse(read('semester-1/curriculum.json'));
const library=JSON.parse(read('tools/data/study-library.json'));
const counts={ma101:{book:39,pearson:29,educator:39},phy101:{book:35,pearson:28,educator:37},chemistry:{book:34,pearson:46,educator:46}};
const allPages=['index.html','bayt/index.html','semester-1/index.html'];
for(const p of allPages){const h=read(p);assert.equal((h.match(/data-subject=/g)||[]).length,3,p);for(const c of curriculum.courses)for(const r of Object.keys(counts[c.id]))assert.ok(h.includes(`href="/${c.id}/${r}/"`),`${p}: direct ${c.id}/${r}`);}
let articles=0,examples=0;
for(const c of curriculum.courses){
 for(const p of [`${c.id}/index.html`,`semester-1/${c.path}/index.html`]){allPages.push(p);const h=read(p);assert.equal((h.match(/class="engine-card"/g)||[]).length,3);assert.equal((h.match(/class="topic-row"/g)||[]).length,c.topics.length);}
 for(const [r,n] of Object.entries(counts[c.id])){
  const p=`${c.id}/${r}/index.html`,h=read(p);allPages.push(p);
  assert.equal((h.match(/class="lesson (?:math|physics|chemistry)-lesson"/g)||[]).length,n,p);articles+=n;
  assert.ok(h.includes('id="equation-review"'),`${p}: formula reference missing`);
  for(const u of library[c.id][r].units)for(const l of u.lessons)assert.ok(h.includes(l.html),`${p}: source material changed or dropped: ${l.id}`);
 }
 for(const t of c.topics){
  const p=t.href.slice(1)+'index.html',h=read(p);allPages.push(p);
  const l=lessons.find(x=>x.course===c.id&&x.topic===t.id);assert.deepEqual(validate(l),[]);
  for(const id of ['overview','definitions','formulas','visual','worked','applications','clarifications'])assert.ok(h.includes(`id="${id}"`),`${p}: ${id}`);
  for(const q of l.questionTypes){assert.ok(h.includes(`data-worked-example="${q.id}"`));assert.ok(Number.isFinite(q.answer));examples++;}
  assert.ok(h.includes(l.visual.figure.svg),`${p}: visual changed`);
  assert.ok(h.includes('tabindex="0" role="region"'));
  for(const r of Object.keys(counts[c.id]))for(const id of t.resources[r]??[]){assert.ok(read(`${c.id}/${r}/index.html`).includes(`id="${id}"`),`${t.key}: broken source mapping ${r}/${id}`);}
 }
}
assert.equal(articles,333);assert.equal(examples,153);assert.equal(lessons.length,26);
const htmlCache=new Map(allPages.map(p=>[p,read(p)]));
const toFile=url=>url==='/'?'index.html':url.endsWith('/')?url.slice(1)+'index.html':url.slice(1);
for(const [p,h] of htmlCache){
 assert.match(h,/<html lang="en" dir="ltr">/);
 assert.equal((h.match(/<h1[ >]/g)||[]).length,1,p);
 assert.ok(!/<(?:form|input|button|script)\b/i.test(h),`${p}: assessment or script UI leaked`);
 assert.ok(!/Partially available|Under development|Your answer|Reveal answer|topic checks passed|data-question=|data-bayt-check=|<details class="answer"/i.test(h),`${p}: old assessment UI leaked`);
 assert.ok(!/href="\/(?:program|foundations|biology|english|bayt)(?:[\/#"])/i.test(h),`${p}: unrelated destination in student flow`);
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${p}: duplicate ids`);
 for(const [,raw] of h.matchAll(/(?:src|href)="([^" ]+)"/g)){
  if(/^(?:https?:|mailto:|data:)/.test(raw))continue;
  const [url,anchor]=raw.split('#');let target=url?toFile(url):p;
  assert.ok(fs.existsSync(path.join(root,target)),`${p}: missing ${raw}`);
  if(anchor){const other=read(target);assert.ok(other.includes(`id="${anchor}"`),`${p}: missing anchor ${raw}`);}
  if(url&&target.endsWith('.html'))assert.ok(htmlCache.has(target),`${p}: link escapes focused study flow: ${raw}`);
 }
}
// Idempotence: a rebuild must preserve all original lessons without accumulating
// navigation, duplicating sections or restoring a broader dashboard.
const hashes=()=>Object.fromEntries(allPages.map(p=>[p,createHash('sha256').update(read(p)).digest('hex')]));
const before=hashes();execFileSync(process.execPath,['tools/build-study.mjs'],{cwd:root});assert.deepEqual(hashes(),before);
console.log(`Study release: ${allPages.length} pages; 3 subjects; 9 routes; all 333 original units, 26 guides and 153 worked applications; no quizzes; links, anchors, assets and reproducible build passed.`);
