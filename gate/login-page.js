/* ==========================================================================
   gate/login-page.js — the ONLY markup served before authentication.

   Self-contained on purpose: no <link>, no font file, no script. Nothing from
   the application is fetchable until a valid session cookie exists, so the
   gate has no asset-shaped holes. The visual identity follows site/site.css
   (unified Bayt Al-Fuad identity v1: warm charcoal, ivory text, the Quran path's blue action); the current pentagon mark is inlined as SVG, so it needs no image request.
   ========================================================================== */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function loginPage({ nonce, error = "", status = 200 }) {
  const msg = error
    ? `<p class="err" role="alert">${esc(error)}</p>`
    : `<p class="invite">هذا القسم خاص. أدخل كلمة المرور للمتابعة.</p>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1B1A18">
<meta name="robots" content="noindex,nofollow">
<title>الدخول · بيت الفؤاد</title>
<style nonce="${nonce}">
:root{color-scheme:dark;--page:#1B1A18;--surface:#282521;--line:#413B34;--line-strong:#7A7266;--text:#F2EBDD;--muted:#ABA192;--primary:#8DB4CE;--primary-hover:#A8C8DD;--on-primary:#1B1A18;--danger:#F0A08A;--field:#211F1C}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--page);color:var(--text);
font-family:"IBM Plex Sans Arabic","Segoe UI","Noto Sans Arabic","Geeza Pro","Tahoma",system-ui,sans-serif;
-webkit-text-size-adjust:100%;
display:flex;align-items:center;justify-content:center;padding:24px;line-height:1.8}
.card{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--line);
border-radius:14px;padding:32px 28px}
.mark{display:block;width:52px;height:52px;margin-bottom:18px}
h1{font-size:1.35rem;margin:0 0 4px;font-weight:700;letter-spacing:0}
.sub{margin:0 0 20px;color:var(--muted);font-size:.95rem}
.invite{margin:0 0 20px;font-size:.95rem}
.err{margin:0 0 20px;font-size:.95rem;color:var(--danger);font-weight:600}
label{display:block;font-size:.9rem;margin-bottom:8px;color:var(--muted)}
input{width:100%;padding:13px 14px;font-size:1.05rem;font-family:inherit;
border:1px solid var(--line-strong);border-radius:10px;background:var(--field);color:var(--text)}
input:focus-visible{outline:3px solid var(--primary);outline-offset:2px;border-color:var(--primary)}
button{width:100%;margin-top:16px;padding:13px 14px;font-size:1.05rem;font-family:inherit;
font-weight:700;color:var(--on-primary);background:var(--primary);border:0;border-radius:999px;cursor:pointer}
button:hover{background:var(--primary-hover)}
button:focus-visible{outline:3px solid var(--primary);outline-offset:3px}
.foot{margin:22px 0 0;font-size:.9rem;color:var(--muted);text-align:center}
.foot a{color:var(--primary)}
.foot a:focus-visible{outline:3px solid var(--primary);outline-offset:3px;border-radius:2px}
</style>
</head>
<body>
<main class="card">
  <svg class="mark" viewBox="0 0 512 512" width="52" height="52" aria-hidden="true" focusable="false"><g fill="none" stroke="#F2EBDD" stroke-linecap="round" stroke-linejoin="round"><circle cx="256" cy="268" r="222" stroke-width="7"/><path d="M212 395.82 L163.13 395.82 L105.73 219.18 L256 110 L406.27 219.18 L348.87 395.82 L300 395.82" stroke-width="28"/></g><g fill="#F2EBDD"><circle cx="256" cy="46" r="25"/><circle cx="467.13" cy="199.4" r="25"/><circle cx="386.49" cy="447.6" r="25"/><circle cx="125.51" cy="447.6" r="25"/><circle cx="44.87" cy="199.4" r="25"/></g><circle cx="256" cy="278" r="54" fill="#D97757"/></svg>
  <h1>بيت الفؤاد</h1>
  <p class="sub">دخول إلى قسم خاص</p>
  ${msg}
  <form method="POST" action="/login" autocomplete="off" accept-charset="UTF-8">
    <label for="pw">كلمة المرور</label>
    <input id="pw" name="password" type="password" required autofocus maxlength="256"
           autocomplete="current-password" spellcheck="false" dir="ltr">
    <button type="submit">دخول</button>
  </form>
  <p class="foot"><a href="https://baytalfuad.com/">العودة إلى بيت الفؤاد</a></p>
</main>
</body>
</html>`;
}

export const loginStatus = { ok: 200, bad: 401, limited: 429 };
