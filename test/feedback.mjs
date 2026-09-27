/* Behaviour of the lesson feedback endpoint (api/feedback.js), run against an in-memory
 * stand-in for the Upstash REST API (test/lib/fake-upstash.mjs). Checks validation,
 * same-origin protection, size limits, rate and duplicate limits, fail-closed behaviour
 * without storage, what a stored record contains, and that success is reported only
 * after the record is stored. The real destination is verified separately (docs/feedback.md). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { handle, validate, CATEGORIES, MAX_COMMENT, RATE_PER_MINUTE, storageConfig } from '../api/feedback.js';
import { LESSONS } from '../api/_lib/lessons.js';
import { createStore } from './lib/fake-upstash.mjs';

const root = path.resolve(import.meta.dirname, '..');
const ORIGIN = 'https://www.isharataljasad.com';
const TOKEN = 'test-token';
let n = 0;
const ok = async (name, fn) => { await fn(); n++; console.log(`  ok   ${name}`); };
const good = { subject: 'physics', lesson: 'motion', section: 'examples', category: 'Possible error', comment: 'The second example uses 9.8 m/s² but the text says 9.81.' };
const req = (body, { origin = ORIGIN, type = 'application/json', method = 'POST', site = 'same-origin', raw } = {}) => new Request(`${ORIGIN}/api/feedback`, {
  method, headers: { ...(origin ? { origin } : {}), ...(type ? { 'content-type': type } : {}), ...(site ? { 'sec-fetch-site': site } : {}) },
  body: method === 'POST' ? (raw ?? JSON.stringify(body)) : undefined,
});
const setup = (envName = 'production') => {
  const store = createStore();
  let clock = Date.parse('2026-09-28T10:00:00Z'), seq = 0;
  const deps = { env: { KV_REST_API_URL: 'https://example-redis.upstash.io', KV_REST_API_TOKEN: TOKEN, VERCEL_ENV: envName }, fetch: store.fetchFor(TOKEN), now: () => new Date(clock), id: () => `id${++seq}` };
  return { store, deps, tick: (ms) => { clock += ms; } };
};
const read = async (res) => ({ status: res.status, body: await res.json().catch(() => null) });

console.log('== FEEDBACK · VALIDATION ==');
await ok('the generated lesson list matches the four subjects and 51 lessons', () => {
  assert.deepEqual(Object.keys(LESSONS), ['math', 'physics', 'chemistry', 'english']);
  assert.deepEqual(Object.values(LESSONS).map((s) => s.lessons.length), [10, 9, 12, 20]);
});
await ok('a complete, canonical submission is accepted as it is', () => {
  assert.deepEqual(validate(good).value, { ...good });
});
await ok('unknown subjects, lessons and sections are refused', () => {
  for (const bad of [{ ...good, subject: 'biology' }, { ...good, lesson: 'nope' }, { ...good, section: 'dashboard' }, { ...good, subject: 'english', lesson: 'motion' }]) assert.ok(validate(bad).error, JSON.stringify(bad));
});
await ok('a category from the five is required', () => {
  assert.deepEqual(CATEGORIES, ['Explanation unclear', 'Possible error', 'Missing topic', 'Technical problem', 'Other']);
  assert.ok(validate({ ...good, category: '' }).error);
  assert.ok(validate({ ...good, category: 'Grade' }).error);
});
await ok('a comment is required and limited to 1000 characters (counted as characters, not bytes)', () => {
  assert.ok(validate({ ...good, comment: '   ' }).error);
  assert.ok(validate({ ...good, comment: 42 }).error);
  assert.ok(validate({ ...good, comment: 'x'.repeat(MAX_COMMENT + 1) }).error);
  assert.equal(validate({ ...good, comment: 'ب'.repeat(MAX_COMMENT) }).value.comment.length, MAX_COMMENT);
});
await ok('Arabic and English comments keep their text; control characters are removed', () => {
  const v = validate({ ...good, comment: 'الشرح غير واضح في المثال الثاني.\r\nThe units are missing.\u0007' }).value;
  assert.equal(v.comment, 'الشرح غير واضح في المثال الثاني.\nThe units are missing.');
});
await ok('the section is optional', () => { assert.equal(validate({ ...good, section: '' }).value.section, null); });

console.log('== FEEDBACK · REQUEST PROTECTION ==');
await ok('only POST is accepted; there is no way to read or list feedback', async () => {
  const { deps } = setup();
  for (const method of ['GET', 'PUT', 'DELETE']) assert.equal((await handle(req(null, { method }), deps)).status, 405, method);
});
await ok('cross-origin and origin-less posts are refused', async () => {
  const { deps, store } = setup();
  assert.equal((await handle(req(good, { origin: 'https://evil.example' }), deps)).status, 403);
  assert.equal((await handle(req(good, { origin: null }), deps)).status, 403);
  assert.equal((await handle(req(good, { site: 'cross-site' }), deps)).status, 403);
  assert.equal(store.records('feedback:').length, 0);
});
await ok('only JSON is accepted, and oversized bodies are refused before parsing', async () => {
  const { deps } = setup();
  assert.equal((await handle(req(good, { type: 'text/plain' }), deps)).status, 415);
  assert.equal((await handle(req(null, { raw: '{"a":"' + 'x'.repeat(7000) + '"}' }), deps)).status, 413);
  assert.equal((await handle(req(null, { raw: '{not json' }), deps)).status, 400);
});
await ok('invalid content is refused with a reason and nothing is stored', async () => {
  const { deps, store } = setup();
  const r = await read(await handle(req({ ...good, category: '' }), deps));
  assert.equal(r.status, 422); assert.equal(r.body.ok, false); assert.ok(r.body.error);
  assert.equal(store.records('feedback:').length, 0);
});

console.log('== FEEDBACK · STORAGE ==');
await ok('without storage credentials the endpoint fails closed (not sent, nothing claimed)', async () => {
  const r = await read(await handle(req(good), { env: {}, fetch: () => { throw new Error('must not be called'); } }));
  assert.equal(r.status, 503); assert.equal(r.body.ok, false);
  assert.equal(storageConfig({ KV_REST_API_URL: 'http://example.com', KV_REST_API_TOKEN: 't' }), null, 'plain HTTP to a remote host is refused');
});
await ok('a valid comment is stored with only the allowed fields, then success is reported', async () => {
  const { deps, store } = setup();
  const r = await read(await handle(req(good), deps));
  assert.equal(r.status, 201); assert.deepEqual(r.body, { ok: true, id: 'id1' });
  const [rec] = store.records('feedback:production:');
  assert.deepEqual(Object.keys(rec).sort(), ['category', 'comment', 'id', 'lesson', 'receivedAt', 'section', 'subject']);
  assert.deepEqual(rec, { id: 'id1', receivedAt: '2026-09-28T10:00:00.000Z', ...good });
  assert.ok(!JSON.stringify([...store.data.entries()]).match(/ip|user-agent|cookie/i), 'no IP, cookie or user agent anywhere in storage');
});
await ok('preview and production records are kept apart', async () => {
  const p = setup('preview');
  await handle(req(good), p.deps);
  assert.equal(p.store.records('feedback:preview:').length, 1);
  assert.equal(p.store.records('feedback:production:').length, 0);
});
await ok('a storage failure is reported as not sent', async () => {
  const { deps, store } = setup();
  store.setFailing(true);
  const r = await read(await handle(req(good), deps));
  assert.equal(r.status, 503); assert.equal(r.body.ok, false);
  store.setFailing(false);
  assert.equal(store.records('feedback:').length, 0);
});
await ok('the same comment twice within ten minutes is stored once', async () => {
  const { deps, store, tick } = setup();
  assert.equal((await handle(req(good), deps)).status, 201);
  const again = await read(await handle(req(good), deps));
  assert.equal(again.status, 200); assert.equal(again.body.duplicate, true);
  assert.equal(store.records('feedback:production:').length, 1);
  tick(11 * 60 * 1000);
  store.run(['DEL', ...[...store.data.keys()].filter((k) => k.includes(':recent:'))]); // the window has passed
  assert.equal((await handle(req(good), deps)).status, 201);
  assert.equal(store.records('feedback:production:').length, 2);
});
await ok('a failed record write after reservation can be retried without a false success', async () => {
  const { deps, store } = setup();
  const transport = deps.fetch;
  let fail = true;
  deps.fetch = async (url, init) => {
    const writesRecord = JSON.parse(init.body).some(([cmd, key]) => cmd === 'SET' && !/:rate:|:recent:/.test(key));
    if (fail && writesRecord) { fail = false; return new Response('unavailable', { status: 503 }); }
    return transport(url, init);
  };
  assert.equal((await handle(req(good), deps)).status, 503);
  assert.equal(store.records('feedback:production:').length, 0);
  const retry = await read(await handle(req(good), deps));
  assert.equal(retry.status, 201); assert.equal(retry.body.ok, true);
  assert.deepEqual(store.records('feedback:production:'), [{ id: retry.body.id, receivedAt: '2026-09-28T10:00:00.000Z', ...good }]);
});
await ok('a retry after a lost storage acknowledgement confirms the existing record exactly once', async () => {
  const { deps, store } = setup();
  const transport = deps.fetch;
  let loseReply = true;
  deps.fetch = async (url, init) => {
    const result = await transport(url, init);
    if (loseReply && JSON.parse(init.body).some(([cmd, key]) => cmd === 'SET' && !/:rate:|:recent:/.test(key))) {
      loseReply = false; throw new Error('Connection lost after storage committed');
    }
    return result;
  };
  assert.equal((await handle(req(good), deps)).status, 503);
  assert.equal(store.records('feedback:production:').length, 1);
  const retry = await read(await handle(req(good), deps));
  assert.equal(retry.status, 200); assert.equal(retry.body.duplicate, true);
  assert.equal(store.records('feedback:production:').length, 1);
  assert.equal(store.records('feedback:production:')[0].id, retry.body.id);
});
await ok('a concurrent retry never succeeds merely because another request reserved the comment', async () => {
  const { deps, store } = setup();
  const transport = deps.fetch;
  let entered, release, hold = true;
  const enteredWrite = new Promise(resolve => { entered = resolve; });
  const resumeWrite = new Promise(resolve => { release = resolve; });
  deps.fetch = async (url, init) => {
    if (hold && JSON.parse(init.body).some(([cmd, key]) => cmd === 'SET' && !/:rate:|:recent:/.test(key))) {
      hold = false; entered(); await resumeWrite;
    }
    return transport(url, init);
  };
  const first = handle(req(good), deps);
  await enteredWrite;
  try {
    const retry = await read(await handle(req(good), deps));
    assert.equal(retry.body.ok, true);
    assert.equal(store.records('feedback:production:').length, 1, 'success must already have a durable record');
  } finally { release(); }
  assert.equal((await first).status, 200);
  assert.equal(store.records('feedback:production:').length, 1);
});
await ok('changing the section or category preserves distinct feedback with the same comment', async () => {
  const { deps, store } = setup();
  for (const note of [good, { ...good, section: null }, { ...good, category: 'Other' }]) {
    assert.equal((await handle(req(note), deps)).status, 201);
  }
  assert.equal(store.records('feedback:production:').length, 3);
});
await ok('an expired reservation or an unrelated colliding record never produces success', async () => {
  const { deps, store } = setup();
  await handle(req(good), deps);
  store.run(['SET', 'feedback:production:id1', JSON.stringify({ comment: 'unrelated existing record' })]);
  const collision = await read(await handle(req(good), deps));
  assert.equal(collision.status, 503); assert.equal(collision.body.ok, false);
  const transport = deps.fetch;
  deps.fetch = async (url, init) => {
    if (JSON.parse(init.body).some(([cmd, key]) => cmd === 'GET' && key.includes(':recent:'))) {
      store.run(['DEL', ...[...store.data.keys()].filter(k => k.includes(':recent:'))]);
    }
    return transport(url, init);
  };
  const expired = await read(await handle(req(good), deps));
  assert.equal(expired.status, 503); assert.equal(expired.body.ok, false);
});
await ok(`more than ${RATE_PER_MINUTE} comments in a minute are refused, and the limit resets`, async () => {
  const { deps, store, tick } = setup();
  for (let i = 0; i < RATE_PER_MINUTE; i++) assert.equal((await handle(req({ ...good, comment: `note ${i}` }), deps)).status, 201);
  assert.equal((await handle(req({ ...good, comment: 'one more' }), deps)).status, 429);
  tick(60 * 1000);
  assert.equal((await handle(req({ ...good, comment: 'next minute' }), deps)).status, 201);
  assert.equal(store.records('feedback:production:').length, RATE_PER_MINUTE + 1);
});

console.log('== FEEDBACK · PAGES ==');
await ok('every lesson page carries one collapsed feedback block after the next-lesson links', () => {
  for (const [subject, { lessons }] of Object.entries(LESSONS)) for (const lesson of lessons) {
    const h = fs.readFileSync(path.join(root, `semester-1/${subject}/${lesson}/index.html`), 'utf8');
    assert.equal((h.match(/<details class="feedback" id="feedback">/g) || []).length, 1, `${subject}/${lesson}`);
    assert.ok(h.indexOf('class="next-topic"') < h.indexOf('class="feedback"'), `${subject}/${lesson}: next lesson stays first`);
    assert.ok(h.includes(`name="subject" value="${subject}"`) && h.includes(`name="lesson" value="${lesson}"`), `${subject}/${lesson}: prefilled`);
    assert.ok(h.includes('Please do not include personal information.'), `${subject}/${lesson}: privacy note`);
    assert.ok(!/name="(?:name|email|phone|tel)"|type="email"|type="tel"/.test(h), `${subject}/${lesson}: no personal fields`);
    assert.ok(h.includes('<script src="/semester-1/assets/feedback.js" defer></script>'), `${subject}/${lesson}: script`);
  }
});
await ok('the page script shows success only after the server confirms storage, and keeps the draft otherwise', () => {
  const js = fs.readFileSync(path.join(root, 'semester-1/assets/feedback.js'), 'utf8');
  assert.match(js, /if \(r\.res\.ok && r\.data && r\.data\.ok === true\) \{[\s\S]*?form\.reset\(\)/);
  assert.match(js, /not sent[\s\S]*still in the box/);
  assert.ok(!/localStorage|sessionStorage|indexedDB/.test(js), 'no browser storage stands in for the destination');
  assert.match(js, /if \(pending\) return;/);
});

console.log(`\nFeedback: ${n} checks passed.`);
