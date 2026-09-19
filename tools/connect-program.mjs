import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const curriculum=JSON.parse(read('semester-1/curriculum.json'));
const topicPages=curriculum.courses.flatMap(c=>c.topics.map(t=>t.href.slice(1)+'index.html'));
const pages=['semester-1/index.html',...curriculum.courses.map(c=>`semester-1/${c.path}/index.html`),...topicPages,'foundations/index.html',...['basic-math','algebra','geometry','trigonometry'].map(s=>`foundations/${s}/index.html`),'foundations/models/index.html','foundations/models/functions-and-domain/index.html',...[1,2,3].map(n=>`foundations/models/functions-and-domain/foundation-${n}/index.html`)];
for(const file of pages){
 let html=read(file);
 if(!html.includes('href="/program/"'))html=html.replace('</nav><span class="semester">','<a href="/program/">Programme map</a></nav><span class="semester">');
 html=html.replace('href="/">← Semester 1','href="/semester-1/">← Semester 1');
 if(topicPages.includes(file)){
  // Retain the existing question IDs so previous browser progress still works.
  const diagnostic=html.match(/<div id="try">[\s\S]*?<\/noscript><\/section><\/div>/)?.[0];
  if(!diagnostic)throw new Error(`Missing diagnostic block in ${file}`);
  html=html.replace(diagnostic,'').replace('<div id="transfer">',diagnostic+'<div id="transfer">');
  html=html.replace('<a href="#try">Try</a><a href="#learn">Learn</a>','<a href="#learn">Learn</a><a href="#try">Check</a>');
  html=html.replace('TRY FIRST','CHECK THE IDEA').replace('Start with a short challenge','Check the explanation');
 }
 if(file==='semester-1/index.html')html=html.replace('Choose the topic you need. Try a short problem, work through the explanation, then solve a new example.','Choose the topic you need. Read the explanation and worked example, then apply the idea to a new case.').replace('These three science courses account for 12 credit hours in the published first-semester plan. Other university requirements are outside this study workspace. Later semesters will be added after their course scope is confirmed.','These three science courses account for 12 of the 18 credits in the saved first-semester plan. The programme map includes the other requirements and all later semesters, with learning availability shown for each course.');
 write(file,html);
}
console.log(`Connected programme navigation and placed explanations before checks in ${topicPages.length} current science topics.`);
