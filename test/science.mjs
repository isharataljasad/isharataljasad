import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateState,canMerge,assessmentStatus,handoff} from '../js/model.js';
const seed=JSON.parse(await readFile(new URL('../data/project.json',import.meta.url)));
assert.equal(validateState(seed),seed);assert.equal(canMerge(seed),false);
assert.equal(assessmentStatus({understood:'yes'}),'جزئي');assert.equal(assessmentStatus({note:'test'}),'جزئي');assert.equal(assessmentStatus({understood:'no',applied:'no',needMore:'yes'}),'مكتمل');
const approved=structuredClone(seed);for(const t of Object.values(approved.tracks)){t.status='approved';t.parent=true;t.student=true}assert.equal(canMerge(approved),true);approved.tracks.books.student=false;assert.equal(canMerge(approved),false);
assert.throws(()=>validateState({...seed,schema:9}));assert.throws(()=>validateState({...seed,assessments:{R00:{understood:'bogus'}}}));
const p=JSON.parse(await readFile(new URL('../data/pearson.json',import.meta.url)));const ids=new Map(p.reqs.flatMap(r=>r.primary.map(v=>[v.id,v])));assert.equal(ids.size,372);assert.equal(p.reqs.length,26);assert.equal(p.reqs.reduce((n,r)=>n+r.primary.length+r.supporting.length,0),527);
for(const v of ids.values())for(const key of ['u','tu','ws','pr'])if(v[key]){const u=new URL(v[key]);assert.equal(u.protocol,'https:');assert.ok(['www.pearson.com','static.studychannel.pearsonprd.tech'].includes(u.hostname));}
assert.ok(handoff(seed,{books:'Books',educator:'Educator',pearson:'Pearson'}).includes(seed.tracks.pearson.next));
console.log('PASS: source inventory, approval gates, partial feedback, invalid import rejection, handoff.');

