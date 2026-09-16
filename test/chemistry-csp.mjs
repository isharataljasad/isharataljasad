import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('chemistry/index.html',root),'utf8');
const config=JSON.parse(readFileSync(new URL('vercel.json',root),'utf8'));
for(const tag of ['script','style']){
 const match=html.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
 assert.ok(match,`missing ${tag} block`);
 const hash=`sha256-${createHash('sha256').update(match[1],'utf8').digest('base64')}`;
 const policies=config.headers.flatMap(h=>h.headers||[]).filter(h=>h.key==='Content-Security-Policy');
 assert.ok(policies.length,'missing Content-Security-Policy');
 assert.ok(policies.every(h=>h.value.includes(`'${hash}'`)),`Chemistry inline ${tag} blocked by CSP: ${hash}`);
 console.log(`PASS Chemistry ${tag} CSP hash authorized: ${hash}`);
}
