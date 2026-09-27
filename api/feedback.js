/* POST /api/feedback — optional lesson feedback from the Semester 1 library.
 *
 * Storage: Upstash Redis over its REST API (the Redis offered through the Vercel
 * Marketplace). Credentials come only from the project's environment variables:
 * KV_REST_API_URL + KV_REST_API_TOKEN (the names the Vercel integration sets) or
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN. Without them the endpoint
 * fails closed: nothing is stored and the page says the comment was not sent.
 *
 * A record holds only: id, server time, subject, lesson, optional section,
 * category and comment. No IP address, cookie, user agent or name is stored.
 * Records are keyed by deployment environment, so preview and production never
 * mix:  feedback:<VERCEL_ENV>:<id>. There is no endpoint that lists or reads
 * feedback; the owner reads and deletes records in the Upstash console
 * (docs/feedback.md). */
import { LESSONS, SUBJECTS } from './_lib/lessons.js';

export const CATEGORIES = ['Explanation unclear', 'Possible error', 'Missing topic', 'Technical problem', 'Other'];
export const MAX_COMMENT = 1000;
export const MAX_BODY_BYTES = 6144;
export const RATE_PER_MINUTE = 30;
export const DUPLICATE_WINDOW_SECONDS = 600;

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});

export function storageConfig(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  // HTTPS only; plain HTTP is accepted solely for a local test double on this machine.
  if (!url || !token || !(/^https:\/\//.test(url) || /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/.test(url))) return null;
  return { url: url.replace(/\/$/, ''), token };
}

/** Validate a parsed body. Returns { value } or { error }. Pure: no storage, no request. */
export function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'The request was not understood.' };
  const subject = String(body.subject ?? '');
  const lesson = String(body.lesson ?? '');
  const section = body.section == null ? '' : String(body.section);
  const category = String(body.category ?? '');
  if (!SUBJECTS.includes(subject) || !LESSONS[subject]?.lessons.includes(lesson)) return { error: 'Unknown lesson.' };
  if (section && !LESSONS[subject].sections.includes(section)) return { error: 'Unknown lesson section.' };
  if (!CATEGORIES.includes(category)) return { error: 'Choose what kind of feedback this is.' };
  if (typeof body.comment !== 'string') return { error: 'Write a comment.' };
  // Keep line breaks and tabs; drop other control characters. Arabic and English are both accepted.
  const comment = body.comment.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!comment) return { error: 'Write a comment.' };
  if ([...comment].length > MAX_COMMENT) return { error: `Comments can be up to ${MAX_COMMENT} characters.` };
  return { value: { subject, lesson, section: section || null, category, comment } };
}

async function sha256(text) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function redis(cfg, commands, fetchImpl) {
  const res = await fetchImpl(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cfg.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`storage responded ${res.status}`);
  const out = await res.json();
  if (!Array.isArray(out) || out.length !== commands.length || out.some((r) => r && r.error)) throw new Error('storage error');
  return out.map((r) => r.result);
}

/** Handles one request. `deps` lets tests supply env, fetch, clock and id without touching real services. */
export async function handle(request, deps = {}) {
  const env = deps.env ?? process.env;
  const fetchImpl = deps.fetch ?? fetch;
  const now = deps.now ?? (() => new Date());
  const newId = deps.id ?? (() => `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`);

  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST', 'cache-control': 'no-store' } });
  // Same-origin only: browsers send Origin on cross-site POSTs; a mismatch is refused.
  const origin = request.headers.get('origin');
  const self = new URL(request.url).origin;
  if (!origin || origin !== self) return json(403, { ok: false, error: 'Feedback can only be sent from this site.' });
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return json(403, { ok: false, error: 'Feedback can only be sent from this site.' });
  if (!/^application\/json\b/i.test(request.headers.get('content-type') || '')) return json(415, { ok: false, error: 'The request was not understood.' });
  const declared = Number(request.headers.get('content-length') || '0');
  if (declared > MAX_BODY_BYTES) return json(413, { ok: false, error: 'The comment is too long.' });
  let text;
  try { text = await request.text(); } catch { return json(400, { ok: false, error: 'The request was not understood.' }); }
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'The comment is too long.' });
  let body;
  try { body = JSON.parse(text); } catch { return json(400, { ok: false, error: 'The request was not understood.' }); }
  const { value, error } = validate(body);
  if (error) return json(422, { ok: false, error });

  const cfg = storageConfig(env);
  if (!cfg) return json(503, { ok: false, error: 'Feedback storage is not set up yet.' });
  const scope = `feedback:${(env.VERCEL_ENV || 'development').replace(/[^a-z]/g, '')}`;
  try {
    const minute = Math.floor(now().getTime() / 60000);
    const [count] = await redis(cfg, [['INCR', `${scope}:rate:${minute}`], ['EXPIRE', `${scope}:rate:${minute}`, '120']], fetchImpl);
    if (Number(count) > RATE_PER_MINUTE) return json(429, { ok: false, error: 'Many comments are arriving at once. Please try again in a minute.' });
    const dedupeKey = `${scope}:recent:${await sha256(`${value.subject}|${value.lesson}|${value.comment}`)}`;
    const [fresh] = await redis(cfg, [['SET', dedupeKey, '1', 'NX', 'EX', String(DUPLICATE_WINDOW_SECONDS)]], fetchImpl);
    if (fresh !== 'OK') return json(200, { ok: true, duplicate: true, message: 'This comment was already received.' });
    const record = { id: newId(), receivedAt: now().toISOString(), ...value };
    const [stored] = await redis(cfg, [['SET', `${scope}:${record.id}`, JSON.stringify(record), 'NX']], fetchImpl);
    if (stored !== 'OK') {
      await redis(cfg, [['DEL', dedupeKey]], fetchImpl).catch(() => {});
      return json(503, { ok: false, error: 'The comment could not be stored.' });
    }
    return json(201, { ok: true, id: record.id });
  } catch {
    return json(503, { ok: false, error: 'The comment could not be stored.' });
  }
}

export async function POST(request) { return handle(request); }
export async function GET(request) { return handle(request); }
