/* ==========================================================================
   gate/login-page.js — the ONLY markup served before authentication.

   Self-contained on purpose: no <link>, no font file, no script. Nothing from
   the application is fetchable until a valid session cookie exists, so the
   gate has no asset-shaped holes. The visual identity follows site/site.css
   (calm ivory page, Bayt navy action); the approved Bayt Al-Fuad mark is
   inlined as SVG, unchanged, so it needs no image request.
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
<meta name="theme-color" content="#F4F1EA">
<meta name="robots" content="noindex,nofollow">
<title>الدخول · بيت الفؤاد</title>
<style nonce="${nonce}">
:root{--page:#F4F1EA;--surface:#FBFAF6;--line:#DCD6CA;--line-strong:#8E8778;--text:#1F2933;
--muted:#56606B;--primary:#233A52;--primary-hover:#2F4B68;--danger:#8A3428}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--page);color:var(--text);
font-family:"Segoe UI","Noto Sans Arabic","Geeza Pro","Tahoma",system-ui,sans-serif;
-webkit-text-size-adjust:100%;
display:flex;align-items:center;justify-content:center;padding:24px;line-height:1.8}
.card{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--line);
border-radius:10px;padding:32px 28px}
.mark{display:block;width:44px;height:44px;border-radius:10px;margin-bottom:18px}
h1{font-size:1.35rem;margin:0 0 4px;font-weight:700;letter-spacing:0}
.sub{margin:0 0 20px;color:var(--muted);font-size:.95rem}
.invite{margin:0 0 20px;font-size:.95rem}
.err{margin:0 0 20px;font-size:.95rem;color:var(--danger);font-weight:600}
label{display:block;font-size:.9rem;margin-bottom:8px;color:var(--muted)}
input{width:100%;padding:13px 14px;font-size:1.05rem;font-family:inherit;
border:1px solid var(--line-strong);border-radius:8px;background:#fff;color:var(--text)}
input:focus-visible{outline:3px solid var(--primary);outline-offset:2px;border-color:var(--primary)}
button{width:100%;margin-top:16px;padding:13px 14px;font-size:1.05rem;font-family:inherit;
font-weight:700;color:#fff;background:var(--primary);border:0;border-radius:8px;cursor:pointer}
button:hover{background:var(--primary-hover)}
button:focus-visible{outline:3px solid var(--primary);outline-offset:3px}
.foot{margin:22px 0 0;font-size:.9rem;color:var(--muted);text-align:center}
.foot a{color:var(--primary)}
.foot a:focus-visible{outline:3px solid var(--primary);outline-offset:3px;border-radius:2px}
</style>
</head>
<body>
<main class="card">
  <svg class="mark" viewBox="0 0 512 512" width="44" height="44" aria-hidden="true" focusable="false"> <defs>  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">   <stop offset="0" stop-color="#F0D08A"/>   <stop offset="0.5" stop-color="#B8883F"/>   <stop offset="1" stop-color="#6F4C1F"/>  </linearGradient> </defs> <rect width="512" height="512" rx="128" fill="#050912"/> <circle cx="256" cy="256" r="174" fill="#08101D" stroke="url(#g)" stroke-width="5"/> <path d="M256 106 399 210 344 378H168L113 210Z" fill="none" stroke="url(#g)" stroke-width="6" opacity=".55"/> <circle cx="256" cy="256" r="62" fill="#0B1322" stroke="url(#g)" stroke-width="5"/> <circle cx="256" cy="256" r="12" fill="#F0CF85"/> <circle cx="256" cy="106" r="9" fill="#D8AF5D"/> <circle cx="399" cy="210" r="9" fill="#D8AF5D"/> <circle cx="344" cy="378" r="9" fill="#D8AF5D"/> <circle cx="168" cy="378" r="9" fill="#D8AF5D"/> <circle cx="113" cy="210" r="9" fill="#D8AF5D"/></svg>
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
