// Regression tests for defects fixed in the October 2026 integrity audit.
import fs from 'node:fs';import assert from 'node:assert/strict';import {loginPage} from '../gate/login-page.js';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const app=read('tadabbur/app.js'),css=read('tadabbur/style.css');

// 1) Importing an old-origin record must never silently drop a note.
const src=app.match(/const IMPORT_MARK=[^\n]*\nfunction mergeImportedNotes[^\n]*\n/);
assert.ok(src,'mergeImportedNotes helper present');
const merge=new Function(src[0]+'return mergeImportedNotes;')();
const local={'H01-01':'محلي','H01-02':'نفسه'};
const imported={'H01-01':'قديم','H01-02':'نفسه','H02-03':'جديد','H02-04':'   '};
const r=merge(local,imported);
assert.match(r.notes['H01-01'],/محلي/);assert.match(r.notes['H01-01'],/قديم/,'imported conflicting note kept');
assert.equal(r.notes['H01-02'],'نفسه');assert.equal(r.notes['H02-03'],'جديد');assert.equal(r.notes['H02-04'],undefined);
assert.equal(r.kept,1);assert.deepEqual(local,{'H01-01':'محلي','H01-02':'نفسه'},'input not mutated');
const again=merge(r.notes,imported);assert.deepEqual(again.notes,r.notes,'re-importing the same file is idempotent');assert.equal(again.kept,0);
assert.doesNotMatch(app,/state\.notes=\{\.\.\.j\.notes,\.\.\.state\.notes\}/,'old lossy merge removed');

// 2) Closed mobile drawer must leave the tab order; Escape closes it.
const mobile=css.slice(css.indexOf('@media (max-width:900px)'));
assert.match(mobile,/\.side-nav\{[^}]*visibility:hidden/);assert.match(mobile,/\.side-nav\.is-open\{[^}]*visibility:visible/);
assert.match(app,/e\.key==="Escape"&&sideNav\.classList\.contains\("is-open"\)\)\{closeMenu\(\);menuBtn\.focus\(\);/);

// 3) The login page's way out must not point back into the gate (/ redirects to /login).
const html=loginPage({nonce:'n'});
for(const [,href] of html.matchAll(/<a href="([^"]+)"/g)) assert.notEqual(href,'/', 'login link loops back to /login');
console.log('Audit regressions passed: lossless import merge, mobile drawer focus, login exit link.');
