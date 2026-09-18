import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {skillById} from '../foundations/assets/skills.mjs';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const curriculumPath=join(root,'semester-1','curriculum.json');
const curriculum=JSON.parse(readFileSync(curriculumPath,'utf8'));
// Each link names the mathematical obstacle in this science topic.
const links={
  'MA101.limits':[['formulas','Algebraic: factor and cancel only for allowed inputs'],['change','Conceptual: nearby values and the value at a point']],
  'MA101.continuity':[['graphs','Graphical: compare both sides and the point value']],
  'MA101.derivative':[['change','Conceptual: average rate toward a local rate'],['graphs','Graphical: read slope and its units']],
  'MA101.rules':[['formulas','Algebraic: read the structure before manipulating it'],['trigonometry','Conceptual: use radians in trig derivatives']],
  'MA101.related-rates':[['formulas','Algebraic: isolate the changing quantity'],['graphs','Graphical: a rate is a slope with units']],
  'MA101.approximation':[['graphs','Graphical: use a nearby slope'],['formulas','Algebraic: substitute into a local model']],
  'MA101.mean-value':[['graphs','Graphical: connect interval and local slopes'],['change','Conceptual: distinguish average and instantaneous rates']],
  'MA101.curve-shape':[['graphs','Graphical: use slope signs to read shape']],
  'MA101.optimization':[['formulas','Algebraic: build a one-variable model'],['graphs','Graphical: compare candidates and endpoints']],
  'PHY101.measurement':[['units','Units: convert and check dimensions'],['notation','Numerical: keep powers of ten and precision'],['area-volume','Geometry: distinguish square and cubic units']],
  'PHY101.motion':[['vectors','Conceptual: keep velocity direction'],['graphs','Graphical: position and velocity slopes']],
  'PHY101.forces':[['vectors','Conceptual: choose axes and add signed components'],['trigonometry','Numerical: resolve a force from its stated angle'],['right-triangles','Geometry: find the magnitude of perpendicular components']],
  'PHY101.friction':[['trigonometry','Numerical: resolve an inclined force'],['vectors','Conceptual: choose the direction of friction']],
  'PHY101.energy':[['trigonometry','Conceptual: choose the force component along motion'],['formulas','Algebraic: isolate energy or power']],
  'PHY101.momentum':[['vectors','Conceptual: track direction in a momentum balance'],['formulas','Algebraic: solve for an unknown mass or speed']],
  'PHY101.circular-motion':[['formulas','Algebraic: rearrange v²/r'],['trigonometry','Conceptual: connect angles and direction']],
  'PHY101.lab-graphs':[['graphs','Graphical: slope, axes and scatter'],['units','Units: report a slope with the right dimensions']],
  'CHEM101.atomic-structure':[['notation','Numerical: read powers and signed charges']],
  'CHEM101.quantum-theory':[['notation','Numerical: calculate at very small scales'],['formulas','Algebraic: rearrange energy relations']],
  'CHEM101.periodic-table':[],
  'CHEM101.bonding':[['trigonometry','Conceptual: interpret molecular angles']],
  'CHEM101.aqueous-reactions':[['ratios','Numerical: read a balanced amount ratio'],['units','Units: move between amount and concentration']],
  'CHEM101.solutions':[['ratios','Conceptual: amount divided by total volume'],['units','Units: convert volume before calculating']],
  'CHEM101.gases':[['units','Units: use kelvin and compatible pressure units'],['formulas','Algebraic: isolate a gas-state variable']],
  'CHEM101.thermochemistry':[['formulas','Algebraic: rearrange q = mcΔT'],['signs','Numerical: interpret the sign of heat'],['units','Units: follow energy and temperature differences']],
  'CHEM101.electrochemistry':[['signs','Numerical: subtract a negative potential'],['formulas','Algebraic: keep cathode minus anode order']]
};

let replaced=0;
for(const course of curriculum.courses){
  for(const topic of course.topics){
    if(!(topic.key in links)) throw new Error(`No mapping for ${topic.key}`);
    const mapped=links[topic.key];
    for(const [id] of mapped) if(!skillById[id]) throw new Error(`Unknown skill ${id}`);
    topic.foundationSkills=mapped.map(([id,why])=>({id,why}));
    delete topic.foundation;
    const path=join(root,topic.href.slice(1),'index.html');
    let html=readFileSync(path,'utf8');
    const panel=mapped.length?`<aside class="foundation-help"><h3>Math step getting in the way?</h3><ul>${mapped.map(([id,why])=>`<li><a href="/foundations/?skill=${id}&amp;from=${encodeURIComponent(topic.href)}">${why} →</a></li>`).join('')}</ul></aside>`:'';
    const oldLink=/<a class="foundation-link" href="\/semester-1\/foundations\/#(?:algebra|trigonometry|graphs|units|logs)">[^<]*<\/a>/;
    const existing=/<aside class="foundation-help">.*?<\/aside>/;
    if(oldLink.test(html)) html=html.replace(oldLink,panel);
    else if(existing.test(html)) html=html.replace(existing,panel);
    else if(mapped.length) throw new Error(`Foundation panel missing: ${topic.key}`);
    if(!html.includes('href="/foundations/"')) html=html.replace('</nav><span class="semester">','<a href="/foundations/">Foundations</a></nav><span class="semester">');
    writeFileSync(path,html);
    replaced++;
  }
}
writeFileSync(curriculumPath,JSON.stringify(curriculum,null,2)+'\n');
for(const path of ['index.html','semester-1/index.html','semester-1/math/index.html','semester-1/physics/index.html','semester-1/chemistry/index.html']){
  const full=join(root,path);let html=readFileSync(full,'utf8');
  if(!html.includes('href="/foundations/"')) html=html.replace('</nav><span class="semester">','<a href="/foundations/">Foundations</a></nav><span class="semester">');
  html=html.replaceAll('/semester-1/foundations/','/foundations/');
  writeFileSync(full,html);
}
console.log(`Connected ${replaced} science topics to shared Math Foundations.`);
