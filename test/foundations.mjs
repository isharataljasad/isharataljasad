import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {skills,skillById} from '../foundations/assets/skills.mjs';
import {assess,answerRecord,progress,questionChanged,parseNumber,kinds} from '../foundations/assets/practice.mjs';
import {visuals} from '../foundations/assets/visuals.mjs';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const data=JSON.parse(read('semester-1/curriculum.json'));
assert.equal(skills.length,13);
assert.equal(new Set(skills.map(s=>s.id)).size,skills.length);
assert.deepEqual(skills.map(s=>s.id),['ratios','signs','notation','units','formulas','graphs','trigonometry','vectors','logs','change','area-volume','right-triangles','similarity']);
assert.deepEqual([...new Set(skills.map(s=>s.group))].sort(),['Algebra','Basic Math','Geometry','Next: Calculus','Trigonometry'].sort());
for(const id of ['ratios','units','formulas','graphs','area-volume','right-triangles','similarity','trigonometry','change']){
  assert.ok(visuals[id]?.html && visuals[id]?.caption);
  assert.ok(visuals[id].html.includes('aria-label') || visuals[id].html.includes('<caption>'));
}
const visit=(id,seen=new Set())=>{assert.ok(!seen.has(id),`Cycle at ${id}`);const next=new Set(seen);next.add(id);for(const parent of skillById[id].prerequisites){assert.ok(skillById[parent]);visit(parent,next);}};
for(const skill of skills){
  visit(skill.id);
  assert.ok(skill.goal && skill.idea && skill.worked.length===2 && skill.quick && skill.formula.includes('<math'));
  assert.ok(skill.guided.prompt && skill.guided.step && skill.guided.answer);
  for(const name of ['diagnostic','independent','retry','transfer','transferRetry']){
    const q=skill[name];assert.ok(q.prompt && q.hint && q.reason,`${skill.id}/${name}`);
    assert.ok(q.type==='choice' || q.type==='number');
    if(q.type==='choice'){
      assert.ok(q.options.length>=3 && Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length);
      for(let i=0;i<q.options.length;i++) if(i!==q.answer) assert.ok(kinds.includes(q.wrong?.[i]?.[0]),`${skill.id}/${name} option ${i}`);
      assert.equal(assess(q,String(q.answer)).correct,true);
    } else {
      assert.ok(Number.isFinite(q.answer) && q.tolerance>0);
      assert.equal(assess(q,String(q.answer)).correct,true);
      assert.equal(assess(q,String(q.answer+100)).correct,false);
    }
    assert.equal(assess(q,''),null);
  }
  assert.notEqual(skill.independent.prompt,skill.retry.prompt);
  assert.notEqual(skill.transfer.prompt,skill.transferRetry.prompt);
}
for(const topic of data.courses.flatMap(c=>c.topics)){
  assert.ok(Array.isArray(topic.foundationSkills));
  const html=read(topic.href.slice(1)+'index.html');
  assert.ok(html.includes('href="/foundations/"'));
  for(const {id,why} of topic.foundationSkills){
    assert.ok(skillById[id] && why.length>10);
    const area={ratios:'basic-math',signs:'basic-math',notation:'basic-math',units:'basic-math',formulas:'algebra',graphs:'algebra',logs:'algebra',change:'algebra',trigonometry:'trigonometry',vectors:'trigonometry','area-volume':'geometry','right-triangles':'geometry',similarity:'geometry'}[id];
    assert.ok(html.includes(`href="/foundations/${area}/"`),`${topic.key}/${id}`);
  }
}
assert.ok(existsSync(new URL('foundations/index.html',root)));
assert.ok(read('foundations/index.html').includes('297'));
assert.ok(!read('foundations/index.html').includes('/foundations/assets/app.mjs'));
assert.ok(read('semester-1/foundations/index.html').includes('redirect.mjs'));
assert.equal(parseNumber('−2.5'),-2.5);
assert.equal(parseNumber('1e3'),1000);
assert.equal(parseNumber('3 kg'),null);
const skill=skillById.signs;
const wrong=assess(skill.diagnostic,'1');
assert.deepEqual([wrong.correct,wrong.kind],[false,'numerical']);
assert.equal(progress(), 'Not started');
let q=answerRecord({},assess(skill.independent,String(skill.independent.answer)));
let transfer=answerRecord({},assess(skill.transfer,String(skill.transfer.answer)));
assert.equal(progress({questions:{independent:q,transfer}}),'Solved independently');
q=answerRecord({aid:true},assess(skill.independent,String(skill.independent.answer)));
assert.equal(progress({questions:{independent:q,transfer}}),'Needs review');
const retry=answerRecord({},assess(skill.retry,String(skill.retry.answer)));
assert.equal(progress({questions:{independent:q,retry,transfer}}),'Solved independently');
assert.equal(questionChanged({questionVersion:1},2),true);
assert.equal(questionChanged({questionVersion:2},2),false);
console.log('Math Foundations: 13 skills, four entry areas, original visuals, prerequisites, feedback, versioning and topic links passed.');
