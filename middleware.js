/* ==========================================================================
   middleware.js — SERVER-SIDE ACCESS GATE (Vercel Routing Middleware, edge)

   Runs at Vercel's edge before any static file is served, on EVERY deployment
   that contains this file — production, preview, branch alias, generated URL.
   That is the whole point: the gate travels with the deployment, so there is
   no second address at which the application is reachable unprotected.

   It knows nothing about the corpus and reads nothing the user writes.
   ========================================================================== */

import { ipAddress, next } from "@vercel/functions";
import {
  COOKIE, LOGIN_PATH, LOGOUT_PATH, SESSION_TTL_SECONDS,
  MAX_LOGIN_BODY_BYTES, MAX_PASSWORD_CHARS,
  classify, readCookie, setCookie, clearCookie,
  signToken, verifyToken, verifyPassword, validConfiguration, makeLimiter, sleep
} from "./gate/gate.js";
import { loginPage } from "./gate/login-page.js";

export const config = { matcher: "/((?!_vercel/).*)" };

const limiter = makeLimiter();

const MSG_REJECTED = "كلمة المرور غير صحيحة.";
const TOO_MANY = "محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.";
const MISCONFIGURED = "البوابة غير مهيأة على هذا النشر.";

/* Same headers for every gate response. The login page is the one place that
   needs an inline <style>, so it gets a nonce — never 'unsafe-inline'.
   form-action must be 'self' here: the app-wide policy in vercel.json sets it
   to 'none', which would silently block the login POST. */
function gateHeaders(nonce) {
  return {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store, no-cache, must-revalidate, private",
    "content-security-policy":
      `default-src 'none'; style-src 'nonce-${nonce}'; form-action 'self'; ` +
      `base-uri 'none'; frame-ancestors 'none'; img-src 'none'; script-src 'none'`,
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-frame-options": "DENY",
    "x-robots-tag": "noindex, nofollow"
  };
}

const nonce = () => {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...b)).replace(/=+$/, "");
};

const render = (error, status) => {
  const n = nonce();
  return new Response(loginPage({ nonce: n, error }), { status, headers: gateHeaders(n) });
};

const redirect = (url, cookie) => {
  const h = new Headers({ location: url, "cache-control": "no-store" });
  if (cookie) h.append("set-cookie", cookie);
  return new Response(null, { status: 303, headers: h });
};

/* Never fall open. A missing secret is a closed door, not an open one. */
const misconfigured = () => {
  const n = nonce();
  return new Response(loginPage({ nonce: n, error: MISCONFIGURED }), {
    status: 503, headers: gateHeaders(n)
  });
};

const clientIp = request =>
  ipAddress(request) ||
  request.headers.get("x-real-ip") ||
  (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
  "unknown";

export default async function middleware(request) {
  const url = new URL(request.url);
  const kind = classify(url.pathname);
  if (kind === "infra") return next();

  const HASH = process.env.FOAAD_ACCESS_PASSWORD_HASH;
  const SECRET = process.env.FOAAD_SESSION_SECRET;
  if (!validConfiguration(HASH, SECRET)) return misconfigured();

  const token = readCookie(request.headers.get("cookie"), COOKIE);
  const authed = await verifyToken(SECRET, token);

  if (kind === "logout") {
    return redirect(new URL(LOGIN_PATH, url).toString(), clearCookie());
  }

  if (kind === "login") {
    if (request.method === "GET" || request.method === "HEAD") {
      if (authed) return redirect(new URL("/", url).toString());
      return render("", 200);
    }
    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: { allow: "GET, HEAD, POST" } });
    }

    const ip = clientIp(request);
    const gate = limiter.check(ip);
    if (gate.locked) {
      await sleep(400);
      const response = render(TOO_MANY, 429);
      response.headers.set("retry-after", "300");
      return response;
    }
    if (gate.delay) await sleep(gate.delay);

    let password = "";
    const declaredLength = Number(request.headers.get("content-length") || "0");
    const bodyTooLarge = Number.isFinite(declaredLength) && declaredLength > MAX_LOGIN_BODY_BYTES;
    try {
      if (!bodyTooLarge) password = String((await request.formData()).get("password") ?? "");
    }
    catch { password = ""; }

    const acceptableLength = password.length <= MAX_PASSWORD_CHARS;
    const ok = !bodyTooLarge && acceptableLength && await verifyPassword(password, HASH);
    if (!ok) {
      limiter.fail(ip);
      /* One message for every failure mode: wrong, empty, malformed. Nothing
         in the body, status, or timing distinguishes "close" from "not close". */
      return render(MSG_REJECTED, 401);
    }
    limiter.succeed(ip);
    const value = await signToken(SECRET);
    return redirect(new URL("/", url).toString(), setCookie(value, SESSION_TTL_SECONDS));
  }

  /* kind === "protected" */
  if (!authed) {
    if (request.method === "GET" || request.method === "HEAD") {
      return redirect(new URL(LOGIN_PATH, url).toString());
    }
    return new Response(null, { status: 401, headers: { "cache-control": "no-store" } });
  }

  /* Authenticated: hand the request to the static file layer untouched, but
     make sure no shared cache ever stores a protected response. */
  return next({ headers: { "cache-control": "private, max-age=0, must-revalidate" } });
}
