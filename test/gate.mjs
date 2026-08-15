/* ==========================================================================
   test/gate.mjs — ACCESS GATE TESTS

   Runs the shipped gate code, not a copy of it. Node 18+ (Web Crypto).
   Iteration count is lowered ONLY where a test would otherwise spend seconds
   in PBKDF2; the production value lives in gate.js and is asserted below.
   ========================================================================== */

import {
  PBKDF2_ITERATIONS, hashPassword, verifyPassword, parseHash, timingSafeEqual,
  signToken, verifyToken, readCookie, setCookie, clearCookie, COOKIE,
  classify, makeLimiter, LOCK_AFTER, SESSION_TTL_SECONDS, b64u, unb64u,
  MAX_LOGIN_BODY_BYTES, MAX_PASSWORD_CHARS, validConfiguration
} from "../gate/gate.js";
import { loginPage } from "../gate/login-page.js";
import middleware from "../middleware.js";

let pass = 0, fail = 0;
const group = t => console.log(`\n== ${t} ==`);
async function ok(name, fn) {
  try { await fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}
const eq = (a, b, m = "") => { if (a !== b) throw new Error(`${m} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); };
const truthy = (v, m = "") => { if (!v) throw new Error(m || "expected truthy"); };

const SECRET = "test_session_secret_2026_0123456789_abcdefghijk";
const FAST = 100000;   // above the parser floor, fast enough for a test run

/* Build a hash at the production format but cheap iterations for the harness. */
async function fastHash(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: FAST }, key, 256);
  return `pbkdf2$sha256$${FAST}$${b64u(salt)}$${b64u(bits)}`;
}

/* ------------------------------------------------------------------ */
group("GATE · PASSWORD HASHING");

await ok("production iteration count is not silently weakened", () => {
  if (PBKDF2_ITERATIONS < 310000) throw new Error(`iterations dropped to ${PBKDF2_ITERATIONS}`);
});

await ok("a correct password verifies, a wrong one does not", async () => {
  const stored = await fastHash("ريحانة-٢٠٢٦");
  truthy(await verifyPassword("ريحانة-٢٠٢٦", stored), "correct password rejected");
  eq(await verifyPassword("ريحانة-٢٠٢٥", stored), false, "wrong password accepted");
  eq(await verifyPassword("", stored), false, "empty password accepted");
});

await ok("the same password hashes differently every time (unique salt)", async () => {
  const a = await hashPassword("same", FAST), b = await hashPassword("same", FAST);
  truthy(a !== b, "two hashes of one password are identical — salt is not random");
  truthy(await verifyPassword("same", a) && await verifyPassword("same", b));
});

await ok("a malformed or weakened hash string is refused, never trusted", async () => {
  for (const bad of ["", "plaintext", "pbkdf2$sha1$310000$aa$bb", "pbkdf2$sha256$50$aa$bb",
                     "pbkdf2$sha256$310000$aa", "md5$x$1$a$b"]) {
    eq(parseHash(bad), null, `accepted malformed hash: ${bad}`);
    eq(await verifyPassword("anything", bad), false, `verified against malformed hash: ${bad}`);
  }
});

await ok("deployment configuration rejects a weak hash or short session secret", async () => {
  const weak = await fastHash("strong-password");
  eq(validConfiguration(weak, "x".repeat(43)), false);
  const production = await hashPassword("strong-password");
  eq(validConfiguration(production, "short"), false);
  eq(validConfiguration(production, "x".repeat(43)), true);
});

await ok("comparison is constant-time by construction (no early return on first differing byte)", () => {
  const a = Uint8Array.from([1, 2, 3, 4]);
  eq(timingSafeEqual(a, Uint8Array.from([1, 2, 3, 4])), true);
  eq(timingSafeEqual(a, Uint8Array.from([9, 2, 3, 4])), false);
  eq(timingSafeEqual(a, Uint8Array.from([1, 2, 3, 9])), false);
  eq(timingSafeEqual(a, Uint8Array.from([1, 2, 3])), false, "length mismatch must fail");
});

/* ------------------------------------------------------------------ */
group("GATE · SESSION TOKEN");

await ok("a freshly signed token verifies", async () => {
  truthy(await verifyToken(SECRET, await signToken(SECRET)));
});

await ok("a token signed with another secret is rejected (secret rotation kills sessions)", async () => {
  const t = await signToken("old-secret");
  eq(await verifyToken("new-secret", t), false);
});

await ok("an expired token is rejected even though its signature is valid", async () => {
  const t = await signToken(SECRET, { ttl: 60, now: Date.now() - 3600e3 });
  eq(await verifyToken(SECRET, t), false);
});

await ok("extending the expiry inside the cookie invalidates the signature", async () => {
  const t = await signToken(SECRET);
  const [v, exp, sig] = t.split(".");
  const forged = `${v}.${Number(exp) + 999999}.${sig}`;
  eq(await verifyToken(SECRET, forged), false, "expiry is not covered by the signature");
});

await ok("garbage, empty, and wrong-version tokens are rejected", async () => {
  for (const t of ["", "x", "1.2", "1.2.3.4", "9." + (Math.floor(Date.now() / 1e3) + 99) + ".AAAA", null, undefined]) {
    eq(await verifyToken(SECRET, t), false, `accepted token: ${t}`);
  }
  eq(await verifyToken("", await signToken(SECRET)), false, "empty secret must never verify");
});

await ok("session lifetime is bounded to a single sitting", () => {
  truthy(SESSION_TTL_SECONDS <= 24 * 3600, "session TTL longer than a day");
});

/* ------------------------------------------------------------------ */
group("GATE · COOKIE FLAGS");

await ok("the session cookie carries HttpOnly, Secure, SameSite=Strict and an expiry", () => {
  const c = setCookie("abc", 3600);
  truthy(c.startsWith("__Host-foaad_gate="), c);
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict", "Priority=High", "Path=/", "Max-Age=3600"]) {
    truthy(c.includes(flag), `missing ${flag} in: ${c}`);
  }
});

await ok("logout clears the cookie with the same flags and a zero lifetime", () => {
  const c = clearCookie();
  truthy(c.includes("Max-Age=0") && c.includes("HttpOnly") && c.includes("Secure") && c.includes("SameSite=Strict"), c);
});

await ok("the cookie parser is not fooled by a lookalike name", () => {
  eq(readCookie(`not_${COOKIE}=evil; ${COOKIE}=real; other=x`), "real");
  eq(readCookie(`${COOKIE}x=evil`), null);
  eq(readCookie(null), null);
});

/* ------------------------------------------------------------------ */
group("GATE · PATH CLASSIFICATION");

await ok("only /login and /logout are outside the protection", () => {
  eq(classify("/login"), "login");
  eq(classify("/logout"), "logout");
  eq(classify("/_vercel/insights/script.js"), "infra");
  for (const p of ["/", "/index.html", "/style.css", "/js/app.js", "/js/corpus.js",
                   "/fonts/amiri-quran-ar.woff2", "/test/cards.json", "/anything"]) {
    eq(classify(p), "protected", `${p} is not protected`);
  }
});

/* ------------------------------------------------------------------ */
group("GATE · BRUTE-FORCE DAMPING");

await ok("repeated failures introduce a growing delay", () => {
  const l = makeLimiter();
  const seen = [];
  for (let i = 0; i < 5; i++) { seen.push(l.check("1.1.1.1").delay); l.fail("1.1.1.1"); }
  truthy(seen[0] === 0 && seen[seen.length - 1] > seen[1], `delays did not grow: ${seen}`);
});

await ok(`the address is locked out after ${LOCK_AFTER} failures`, () => {
  const l = makeLimiter();
  for (let i = 0; i < LOCK_AFTER; i++) l.fail("2.2.2.2");
  truthy(l.check("2.2.2.2").locked, "not locked after the threshold");
});

await ok("a successful login clears the counter for that address", () => {
  const l = makeLimiter();
  for (let i = 0; i < 3; i++) l.fail("3.3.3.3");
  l.succeed("3.3.3.3");
  eq(l.check("3.3.3.3").delay, 0);
});

await ok("one address being locked never locks another", () => {
  const l = makeLimiter();
  for (let i = 0; i < LOCK_AFTER; i++) l.fail("4.4.4.4");
  eq(l.check("5.5.5.5").locked, false);
});

/* ------------------------------------------------------------------ */
group("GATE · LOGIN PAGE SURFACE");

await ok("the login page contains no hint, no recovery, no registration, no app content", () => {
  const html = loginPage({ nonce: "n" });
  for (const s of ["تلميح", "نسيت", "استعادة", "تسجيل حساب", "إنشاء حساب",
                   "hint", "forgot", "register", "style.css", "js/app.js", "fonts/"]) {
    truthy(!html.includes(s), `login page leaks: ${s}`);
  }
});

await ok("the login page carries the identity lines required by the brief", () => {
  const html = loginPage({ nonce: "n" });
  for (const s of ["بلّغوا عني ولو آية", "مسار التدبر من مشروع الفؤاد",
                   "هذه التجربة متاحة بدعوة", "كلمة المرور", "الدخول"]) {
    truthy(html.includes(s), `login page missing: ${s}`);
  }
  truthy(html.includes('dir="rtl"') && html.includes('lang="ar"'), "not RTL Arabic");
  truthy(html.includes('name="robots"'), "login page is indexable");
});

await ok("the error state replaces the invitation line and is announced to assistive tech", () => {
  const html = loginPage({ nonce: "n", error: "كلمة المرور غير صحيحة." });
  truthy(html.includes('role="alert"'), "error not announced");
  truthy(!html.includes("هذه التجربة متاحة بدعوة"), "both states rendered at once");
});

await ok("the page is self-contained: no external asset request before login", () => {
  const html = loginPage({ nonce: "n" });
  truthy(!/<link\b/i.test(html), "login page requests an external stylesheet");
  truthy(!/<script\b/i.test(html), "login page loads a script");
  truthy(!/<img\b/i.test(html), "login page loads an image");
  truthy(!/https?:\/\//i.test(html.replace(/<html[^>]*>/i, "")), "login page reaches a remote origin");
});

/* ------------------------------------------------------------------ */
group("GATE · MIDDLEWARE END TO END");

const PASSWORD = "كلمة-اختبار-قوية-2026";
process.env.FOAAD_ACCESS_PASSWORD_HASH = await hashPassword(PASSWORD);
process.env.FOAAD_SESSION_SECRET = SECRET;

const req = (path, init = {}) => new Request(`https://www.isharataljasad.com${path}`, init);
const form = pw => {
  const fd = new FormData(); fd.set("password", pw);
  return req("/login", { method: "POST", body: fd });
};
const cookieFrom = res => (res.headers.get("set-cookie") || "").split(";")[0];
const isPassThrough = res => res.headers.has("x-middleware-next") || res.status === 200;

await ok("an anonymous visitor gets no application HTML — only a redirect to the gate", async () => {
  const res = await middleware(req("/"));
  eq(res.status, 303);
  eq(res.headers.get("location"), "https://www.isharataljasad.com/login");
  eq(await res.text(), "", "a body was returned to an anonymous visitor");
});

await ok("every application asset is refused anonymously, not just the page", async () => {
  for (const p of ["/index.html", "/style.css", "/js/app.js", "/js/corpus.js", "/js/store.js",
                   "/fonts/amiri-quran-ar.woff2"]) {
    const res = await middleware(req(p));
    truthy(res.status === 303 && !res.headers.has("x-middleware-next"), `${p} was served anonymously`);
  }
});

await ok("a non-GET request without a session is refused outright", async () => {
  const res = await middleware(req("/js/app.js", { method: "POST" }));
  eq(res.status, 401);
});

await ok("the correct password issues a signed, hardened session cookie", async () => {
  const res = await middleware(form(PASSWORD));
  eq(res.status, 303);
  const sc = res.headers.get("set-cookie") || "";
  truthy(sc.startsWith(`${COOKIE}=`), sc);
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict"]) truthy(sc.includes(flag), `missing ${flag}`);
  truthy(await verifyToken(SECRET, sc.split(";")[0].split("=")[1]), "issued token does not verify");
});

await ok("a wrong password returns 401, sets no cookie, and says nothing specific", async () => {
  const res = await middleware(form("not-the-password"));
  eq(res.status, 401);
  eq(res.headers.get("set-cookie"), null, "a cookie was issued on failure");
  const body = await res.text();
  truthy(body.includes("كلمة المرور غير صحيحة."), "generic message missing");
  truthy(!body.includes(PASSWORD), "the password appears in the response");
});

await ok("oversized login bodies and passwords are rejected without a session", async () => {
  const hugeHeader = await middleware(req("/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "content-length": String(MAX_LOGIN_BODY_BYTES + 1) },
    body: "password=x"
  }));
  eq(hugeHeader.status, 401);
  eq(hugeHeader.headers.get("set-cookie"), null);

  const fd = new FormData(); fd.set("password", "x".repeat(MAX_PASSWORD_CHARS + 1));
  const hugePassword = await middleware(req("/login", { method: "POST", body: fd }));
  eq(hugePassword.status, 401);
  eq(hugePassword.headers.get("set-cookie"), null);
});

await ok("a wrong password and an empty password are indistinguishable in the response", async () => {
  const a = await middleware(form("wrong-one"));
  const b = await middleware(form(""));
  eq(a.status, b.status);
  const strip = s => s.replace(/nonce="[^"]+"/g, "");
  eq(strip(await a.text()), strip(await b.text()), "responses differ between failure modes");
});

await ok("a valid session passes the request through to the static layer", async () => {
  const login = await middleware(form(PASSWORD));
  const res = await middleware(req("/js/app.js", { headers: { cookie: cookieFrom(login) } }));
  truthy(isPassThrough(res), `expected pass-through, got ${res.status}`);
  truthy(!res.headers.has("location"), "an authenticated request was redirected");
});

await ok("a forged or expired cookie does not pass", async () => {
  const forged = await signToken("attacker-secret");
  const stale = await signToken(SECRET, { ttl: 60, now: Date.now() - 7200e3 });
  for (const t of [forged, stale, "1.9999999999.AAAA", "garbage"]) {
    const res = await middleware(req("/", { headers: { cookie: `${COOKIE}=${t}` } }));
    eq(res.status, 303, `a bad cookie (${t.slice(0, 12)}…) was accepted`);
  }
});

await ok("logout clears the cookie and the cleared session no longer opens the app", async () => {
  const login = await middleware(form(PASSWORD));
  const out = await middleware(req("/logout", { headers: { cookie: cookieFrom(login) } }));
  eq(out.status, 303);
  truthy((out.headers.get("set-cookie") || "").includes("Max-Age=0"), "cookie not cleared");
  const after = await middleware(req("/", { headers: { cookie: `${COOKIE}=` } }));
  eq(after.status, 303);
});

await ok("an authenticated visitor asking for the login page is sent into the app", async () => {
  const login = await middleware(form(PASSWORD));
  const res = await middleware(req("/login", { headers: { cookie: cookieFrom(login) } }));
  eq(res.status, 303);
  eq(res.headers.get("location"), "https://www.isharataljasad.com/");
});

await ok("the gate page is never cached and never framed", async () => {
  const res = await middleware(req("/login"));
  truthy((res.headers.get("cache-control") || "").includes("no-store"), "login page is cacheable");
  eq(res.headers.get("x-frame-options"), "DENY");
  truthy((res.headers.get("content-security-policy") || "").includes("frame-ancestors 'none'"));
});

await ok("the gate page allows its own form to submit (form-action would otherwise block it)", async () => {
  const res = await middleware(req("/login"));
  truthy((res.headers.get("content-security-policy") || "").includes("form-action 'self'"),
    "form-action does not permit the login POST");
});

await ok("the inline style is nonced, and the nonce changes on every response", async () => {
  const a = await middleware(req("/login")), b = await middleware(req("/login"));
  const nonceOf = r => (r.headers.get("content-security-policy").match(/'nonce-([^']+)'/) || [])[1];
  truthy(nonceOf(a) && nonceOf(b) && nonceOf(a) !== nonceOf(b), "nonce is static");
  truthy((await a.text()).includes(`nonce="${nonceOf(a)}"`), "style nonce does not match the header");
});

await ok("a deployment with no secret configured closes the door instead of opening it", async () => {
  const hash = process.env.FOAAD_ACCESS_PASSWORD_HASH, sec = process.env.FOAAD_SESSION_SECRET;
  delete process.env.FOAAD_ACCESS_PASSWORD_HASH;
  const a = await middleware(req("/"));
  eq(a.status, 503, "missing password hash fell open");
  truthy(!a.headers.has("x-middleware-next"), "request was passed through unprotected");
  process.env.FOAAD_ACCESS_PASSWORD_HASH = hash;
  delete process.env.FOAAD_SESSION_SECRET;
  eq((await middleware(req("/"))).status, 503, "missing session secret fell open");
  process.env.FOAAD_SESSION_SECRET = sec;
});

await ok("no secret or password ever reaches a response body or header", async () => {
  const responses = [
    await middleware(req("/login")),
    await middleware(form("wrong")),
    await middleware(req("/"))
  ];
  for (const r of responses) {
    const dump = JSON.stringify([...r.headers]) + await r.text();
    truthy(!dump.includes(PASSWORD), "the password leaked into a response");
    truthy(!dump.includes(SECRET), "the session secret leaked into a response");
    truthy(!dump.includes(process.env.FOAAD_ACCESS_PASSWORD_HASH), "the stored hash leaked into a response");
  }
});

await ok("brute force against the gate ends in lock-out, not in a stream of tries", async () => {
  const fresh = new Request("https://www.isharataljasad.com/login");
  let locked = false;
  for (let i = 0; i < LOCK_AFTER + 2; i++) {
    const fd = new FormData(); fd.set("password", `guess-${i}`);
    const res = await middleware(new Request(fresh, {
      method: "POST", body: fd, headers: { "x-forwarded-for": "203.0.113.9" }
    }));
    if (res.status === 429) { locked = true; break; }
  }
  truthy(locked, "the gate never rate-limited a burst of wrong passwords");
});

/* ------------------------------------------------------------------ */
group("GATE · THE APPLICATION IS UNCHANGED BY THE GATE");

await ok("the gate imports nothing from the application and touches no user data", async () => {
  const { readFile } = await import("node:fs/promises");
  const strip = t => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const src  = strip(await readFile(new URL("../middleware.js", import.meta.url), "utf8"));
  const gate = strip(await readFile(new URL("../gate/gate.js", import.meta.url), "utf8"));
  const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map(m => m[1]);
  for (const i of imports) {
    truthy(i === "@vercel/functions" || i.startsWith("./gate/"),
      `the gate imports application code: ${i}`);
  }
  for (const s2 of ["foaad_v2", "supabase", "localStorage", "H01", "H02",
                    "verse_text", "tadabbur", "observation"]) {
    truthy(!src.includes(s2), `middleware references application internals: ${s2}`);
    truthy(!gate.includes(s2), `gate references application internals: ${s2}`);
  }
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
