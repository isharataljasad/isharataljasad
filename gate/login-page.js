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
html,body{min-height:100%}
body{margin:0;background:var(--page);color:var(--text);
font-family:"IBM Plex Sans Arabic","Segoe UI","Noto Sans Arabic","Geeza Pro","Tahoma",system-ui,sans-serif;
-webkit-text-size-adjust:100%;line-height:1.8}
.bfs-bar{position:sticky;top:0;z-index:10;background:var(--page);border-bottom:1px solid #3A352F;box-shadow:inset 0 -2px 0 -1px rgba(141,180,206,.55)}
.bfs-in{display:flex;align-items:center;gap:14px;min-height:56px;max-width:1440px;margin:0 auto;padding:6px 20px;line-height:1.4}
.bfs-bar a{color:inherit;text-decoration:none}
.bfs-brand{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:1.0625rem;white-space:nowrap}
.bfs-brand svg{width:32px;height:32px}
.bfs-crumb{display:flex;align-items:center;gap:8px;min-width:0;font-size:.9375rem;white-space:nowrap}
.bfs-sep{color:#5A5249}
.bfs-path{display:inline-flex;align-items:center;gap:7px;color:#D8CFBF;font-weight:600}
.bfs-dot{width:8px;height:8px;border-radius:50%;background:var(--primary)}
.bfs-page{color:var(--muted)}
.bfs-actions{display:flex;gap:8px;margin-inline-start:auto}
.bfs-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;min-width:40px;padding:0 12px;border-radius:10px;border:1px solid #3A352F;background:#262320;color:var(--text);font-size:.9375rem;font-weight:600;cursor:pointer;list-style:none}
.bfs-btn::-webkit-details-marker{display:none}
.bfs-btn svg{width:20px;height:20px}
.bfs-btn:focus-visible,.bfs-bar a:focus-visible{outline:2px solid #E8906F;outline-offset:2px}
details.bfs-more{position:relative}
.bfs-menu{position:absolute;inset-inline-end:0;top:calc(100% + 6px);width:min(360px,calc(100vw - 24px));padding:10px;border-radius:16px;border:1px solid #3A352F;background:#262320;box-shadow:0 18px 48px rgba(0,0,0,.42)}
.bfs-menu h2{margin:4px 8px 6px;font-size:.8125rem;font-weight:600;color:var(--muted)}
.bfs-menu ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:4px}
.bfs-menu a{display:grid;min-height:52px;padding:8px 10px;border-radius:10px;line-height:1.35}
.bfs-menu a:hover{background:#312D28}
.bfs-menu small{font-size:.8125rem;color:var(--muted)}
@media (max-width:720px){.bfs-in{gap:10px;padding:4px 12px;min-height:52px}.bfs-brand span,.bfs-sep-page,.bfs-lbl{display:none}.bfs-crumb{display:grid;gap:0;line-height:1.3}.bfs-crumb-top{font-size:.75rem;color:var(--muted)}.bfs-page{font-size:.9375rem;font-weight:600;color:var(--text)}.bfs-btn{padding:0;width:40px}.bfs-menu{position:fixed;inset-inline:8px;top:58px;width:auto}}
.wrap{display:flex;justify-content:center;padding:clamp(24px,8vh,72px) 20px 40px}
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
<header class="bfs-bar"><div class="bfs-in">
  <a class="bfs-brand" href="https://baytalfuad.com/" aria-label="بيت الفؤاد — الرئيسية"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><g fill="none" stroke="#F2EBDD" stroke-linecap="round" stroke-linejoin="round"><circle cx="256" cy="268" r="222" stroke-width="9"/><path d="M212 395.82 L163.13 395.82 L105.73 219.18 L256 110 L406.27 219.18 L348.87 395.82 L300 395.82" stroke-width="30"/></g><g fill="#F2EBDD"><circle cx="256" cy="46" r="27"/><circle cx="467.13" cy="199.4" r="27"/><circle cx="386.49" cy="447.6" r="27"/><circle cx="125.51" cy="447.6" r="27"/><circle cx="44.87" cy="199.4" r="27"/></g><circle cx="256" cy="278" r="58" fill="#D97757"/></svg><span>بيت الفؤاد</span></a>
  <nav class="bfs-crumb" aria-label="موقعك في بيت الفؤاد"><span class="bfs-crumb-top"><span class="bfs-path"><span class="bfs-dot" aria-hidden="true"></span>القرآن والتدبر</span></span><span class="bfs-sep bfs-sep-page" aria-hidden="true">/</span><span class="bfs-page" aria-current="page">الدخول</span></nav>
  <div class="bfs-actions">
    <a class="bfs-btn" href="https://baytalfuad.com/#bf-search" aria-label="بحث في بيت الفؤاد ومسار كير"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><span class="bfs-lbl">بحث</span></a>
    <details class="bfs-more"><summary class="bfs-btn" aria-label="القائمة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span class="bfs-lbl">القائمة</span></summary>
      <nav class="bfs-menu" aria-label="منظومة بيت الفؤاد"><h2>منظومة بيت الفؤاد</h2><ul>
        <li><a href="https://baytalfuad.com/"><strong>الرئيسية</strong><small>بيت الفؤاد</small></a></li>
        <li><a href="https://www.masarcare.health/"><strong>الغذاء والجسد</strong><small>مسار كير</small></a></li>
        <li><a href="https://baytalfuad.com/sleep"><strong>النوم</strong><small>ركن النوم</small></a></li>
        <li><a href="https://baytalfuad.com/movement/"><strong>الحركة</strong><small>قوّتها</small></a></li>
        <li><a href="https://baytalfuad.com/ilm-sinaa/student/semester-1/"><strong>العلم والعمل</strong><small>الفصل الأول</small></a></li>
        <li><a href="/login" aria-current="page"><strong>الصلة</strong><small>القرآن والتدبر</small></a></li>
      </ul></nav>
    </details>
  </div>
</div></header>
<div class="wrap">
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
</div>
</body>
</html>`;
}

export const loginStatus = { ok: 200, bad: 401, limited: 429 };
