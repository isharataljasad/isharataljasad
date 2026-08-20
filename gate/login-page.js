/* ==========================================================================
   gate/login-page.js — the ONLY markup served before authentication.

   Self-contained on purpose: no <link>, no font file, no script. Nothing from
   the application is fetchable until a valid session cookie exists, so the
   gate has no asset-shaped holes. The visual identity is carried by colour
   and rhythm alone, using the same palette as style.css.
   ========================================================================== */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function loginPage({ nonce, error = "", status = 200 }) {
  const msg = error
    ? `<p class="err" role="alert">${esc(error)}</p>`
    : `<p class="invite">هذه التجربة متاحة بدعوة. أدخل كلمة المرور للمتابعة.</p>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0e1a15">
<meta name="robots" content="noindex,nofollow">
<title>بلّغوا عني ولو آية · الدخول</title>
<style nonce="${nonce}">
:root{--ink:#0e1a15;--paper:#fbf8f1;--surface:#fff;--line:#ded8c9;--text:#16211c;
--muted:#5a6b62;--gold:#8a6d3b;--danger:#8c2f2f}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--ink);color:var(--text);
font-family:"Segoe UI","Noto Sans Arabic","Geeza Pro","Tahoma",system-ui,sans-serif;
display:flex;align-items:center;justify-content:center;padding:24px;line-height:1.8}
.card{width:100%;max-width:420px;background:var(--paper);border:1px solid var(--line);
border-radius:14px;padding:32px 28px}
.mark{width:44px;height:44px;border-radius:11px;background:var(--ink);color:#e8dcc0;
display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
h1{font-size:1.35rem;margin:0 0 4px;font-weight:700;letter-spacing:.2px}
.sub{margin:0 0 20px;color:var(--muted);font-size:.95rem}
.invite{margin:0 0 20px;font-size:.95rem}
.err{margin:0 0 20px;font-size:.95rem;color:var(--danger);font-weight:600}
label{display:block;font-size:.9rem;margin-bottom:8px;color:var(--muted)}
input{width:100%;padding:13px 14px;font-size:1.05rem;font-family:inherit;
border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text)}
input:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-color:var(--gold)}
button{width:100%;margin-top:16px;padding:13px 14px;font-size:1.05rem;font-family:inherit;
font-weight:700;color:var(--paper);background:var(--ink);border:0;border-radius:9px;cursor:pointer}
button:hover{background:#1b2e24}
button:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.foot{margin:22px 0 0;font-size:.82rem;color:var(--muted);text-align:center}
@media (prefers-reduced-motion:no-preference){.card{animation:in .25s ease-out}}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
</style>
</head>
<body>
<main class="card">
  <div class="mark" aria-hidden="true">ف</div>
  <h1>بلّغوا عني ولو آية</h1>
  <p class="sub">مسار الفؤاد للتدبر · من بيت الفؤاد</p>
  ${msg}
  <form method="POST" action="/login" autocomplete="off" accept-charset="UTF-8">
    <label for="pw">كلمة المرور</label>
    <input id="pw" name="password" type="password" required autofocus maxlength="256"
           autocomplete="current-password" spellcheck="false" dir="ltr">
    <button type="submit">الدخول</button>
  </form>
  <p class="foot">الدقة قبل البلاغة</p>
</main>
</body>
</html>`;
}

export const loginStatus = { ok: 200, bad: 401, limited: 429 };
