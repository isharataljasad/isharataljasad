/* ==========================================================================
   gate/gate.js — ACCESS GATE, PURE LOGIC.

   No secret is stored here. Everything comes from the environment at runtime.
   Web Crypto only (PBKDF2 + HMAC): runs unchanged on the Vercel Edge runtime
   and on Node 18+, so the same code that ships is the code the tests exercise.

   RULE  This file must never import the corpus, the store, or any view.
         The gate knows nothing about cards and never sees what a user writes.
   ========================================================================== */

const enc = new TextEncoder();

/* ---- encoding helpers ---------------------------------------------------- */
export const b64u = bytes =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export const unb64u = s => {
  const p = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(p + "=".repeat((4 - (p.length % 4)) % 4));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
};

/* Constant-time byte compare. Never use === on a secret-derived value. */
export function timingSafeEqual(a, b) {
  const x = new Uint8Array(a), y = new Uint8Array(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

/* ---- password hashing (PBKDF2-HMAC-SHA256) -------------------------------
   Format stored in FOAAD_ACCESS_PASSWORD_HASH:
     pbkdf2$sha256$<iterations>$<saltB64url>$<hashB64url>
   Argon2/scrypt are not available in the Edge runtime; PBKDF2 with a high
   iteration count is the strongest primitive that is.                       */
export const PBKDF2_ITERATIONS = 310000;
export const MAX_PBKDF2_ITERATIONS = 1000000;
export const MAX_PASSWORD_CHARS = 256;
export const MAX_LOGIN_BODY_BYTES = 4096;
export const MIN_SESSION_SECRET_CHARS = 43;

export async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

export async function hashPassword(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derive(password, salt, iterations);
  return `pbkdf2$sha256$${iterations}$${b64u(salt)}$${b64u(bits)}`;
}

export function parseHash(stored) {
  const p = String(stored || "").split("$");
  if (p.length !== 5 || p[0] !== "pbkdf2" || p[1] !== "sha256") return null;
  const iterations = Number(p[2]);
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > MAX_PBKDF2_ITERATIONS) return null;
  try {
    const salt = unb64u(p[3]), hash = unb64u(p[4]);
    if (salt.length !== 16 || hash.length !== 32) return null;
    return { iterations, salt, hash };
  }
  catch { return null; }
}

export function validConfiguration(storedHash, sessionSecret) {
  const parsed = parseHash(storedHash);
  return Boolean(
    parsed &&
    parsed.iterations === PBKDF2_ITERATIONS &&
    typeof sessionSecret === "string" &&
    sessionSecret.length >= MIN_SESSION_SECRET_CHARS &&
    /^[A-Za-z0-9_-]+$/.test(sessionSecret)
  );
}

export async function verifyPassword(password, stored) {
  const parsed = parseHash(stored);
  if (!parsed) return false;
  const bits = await derive(String(password ?? ""), parsed.salt, parsed.iterations);
  return timingSafeEqual(bits, parsed.hash);
}

/* ---- session token -------------------------------------------------------
   token = 1.<expiryEpochSeconds>.<HMAC-SHA256(secret, "1.<expiry>")>
   The expiry is inside the signed payload, so editing the cookie's Max-Age
   buys nothing: the server re-reads and re-verifies the expiry every request.
   Rotating FOAAD_SESSION_SECRET invalidates every live session at once.     */
export const TOKEN_VERSION = "1";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;   // 8h — one sitting, not a month

async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]);
}

export async function signToken(secret, { ttl = SESSION_TTL_SECONDS, now = Date.now() } = {}) {
  const exp = Math.floor(now / 1000) + ttl;
  const payload = `${TOKEN_VERSION}.${exp}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(payload));
  return `${payload}.${b64u(sig)}`;
}

export async function verifyToken(secret, token, { now = Date.now() } = {}) {
  if (!secret || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [v, expRaw, sigRaw] = parts;
  if (v !== TOKEN_VERSION) return false;
  const exp = Number(expRaw);
  if (!Number.isInteger(exp)) return false;
  let given;
  try { given = unb64u(sigRaw); } catch { return false; }
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(`${v}.${exp}`)));
  /* Signature first, expiry second — both checked, neither short-circuited
     in a way that leaks which one failed. */
  const sigOk = timingSafeEqual(given, expected);
  const fresh = exp * 1000 > now;
  return sigOk && fresh;
}

/* ---- cookies -------------------------------------------------------------- */
/* __Host- prevents Domain scoping and requires Secure + Path=/, reducing the
   chance that another subdomain can overwrite or fixate the session cookie. */
export const COOKIE = "__Host-foaad_gate";

export function readCookie(header, name = COOKIE) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export const setCookie = (value, maxAge) =>
  `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict; Priority=High`;

export const clearCookie = () =>
  `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict; Priority=High`;

/* ---- routing decision -----------------------------------------------------
   PUBLIC is deliberately tiny: the login page renders from the middleware
   itself with an inline, nonced <style> and system fonts, so NOTHING in the
   deployment — not a font, not the stylesheet — is served before login.     */
export const LOGIN_PATH = "/login";
export const LOGOUT_PATH = "/logout";

export function classify(pathname) {
  if (pathname === LOGIN_PATH) return "login";
  if (pathname === LOGOUT_PATH) return "logout";
  if (pathname.startsWith("/_vercel/")) return "infra";
  return "protected";
}

/* ---- brute-force damping --------------------------------------------------
   Per-instance memory. This is a damper, not a distributed rate limiter: an
   Edge instance is not shared globally, so a determined attacker across many
   edges sees a weaker limit than the numbers below. The real cost ceiling is
   PBKDF2 itself (310k iterations per attempt). See docs/ACCESS-GATE.md for
   the durable-store upgrade path.                                            */
export const WINDOW_MS = 15 * 60 * 1000;
export const LOCK_AFTER = 8;
export const LOCK_MS = 5 * 60 * 1000;
const DELAYS = [0, 0, 250, 750, 1500, 3000, 3000, 3000];

export function makeLimiter() {
  const hits = new Map();
  const prune = now => { for (const [k, v] of hits) if (now - v.first > WINDOW_MS && now > v.until) hits.delete(k); };
  return {
    check(ip, now = Date.now()) {
      prune(now);
      const h = hits.get(ip);
      if (!h) return { locked: false, delay: 0 };
      if (now < h.until) return { locked: true, delay: 0 };
      if (now - h.first > WINDOW_MS) { hits.delete(ip); return { locked: false, delay: 0 }; }
      return { locked: false, delay: DELAYS[Math.min(h.n, DELAYS.length - 1)] };
    },
    fail(ip, now = Date.now()) {
      const h = hits.get(ip) || { n: 0, first: now, until: 0 };
      h.n += 1;
      if (h.n >= LOCK_AFTER) { h.until = now + LOCK_MS; h.n = 0; h.first = now; }
      hits.set(ip, h);
    },
    succeed(ip) { hits.delete(ip); },
    size: () => hits.size
  };
}

export const sleep = ms => (ms > 0 ? new Promise(r => setTimeout(r, ms)) : Promise.resolve());
