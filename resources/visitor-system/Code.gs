/* نظام تسجيل الزائرات — Google Apps Script (ملف واحد).
 *
 * الوظائف العامة (بلا شرطة سفلية) هي فقط ما تستدعيه صفحة الزائرات:
 *   doGet, register, leaveStart, leaveReserve, leaveFinish.
 * كل ما عداها خاص (ينتهي اسمه بـ _) فلا يمكن استدعاؤه من المتصفح عبر
 * google.script.run. لا توجد وظيفة إدارة عامة: السجل يُنشأ تلقائيًا في Drive
 * المالكة عند أول تسجيل، والإدارة تعدّل السجل وتحذف منه مباشرة في Google Sheets.
 *
 * الزائرة لا ترى أي سجل. المغادرة تُربط بالزيارة نفسها برقمها (م) مع التحقق من
 * وقت وصولها، إما عبر رابط المغادرة الخاص الذي يظهر بعد التسجيل (صالح 3 أيام)،
 * أو برقم الهوية + الجوال (أحدث زيارة لها لم تُسجَّل مغادرتها).
 *
 * وقت المغادرة يأخذه الخادم لحظة ضغط «تسجيل المغادرة» (leaveReserve) ويحفظه عنده؛
 * الصفحة تكتب هذا الوقت نفسه تحت التوقيع، و leaveFinish يحفظ الوقت المحفوظ لدى
 * الخادم لا أي وقت من المتصفح. إن فشل الحفظ تُعاد الخلية فارغة وتبقى الزيارة
 * مفتوحة لإعادة المحاولة. */

const SCHOOL = 'ب/٩٦ صفوف عليا+ صعوبات التعلم+ م/٤٥';
const TZ = 'Asia/Riyadh';
const SHEET = 'السجل';
const HEAD_ROW = 3, FIRST_ROW = 4, COLS = 8, SIG_COL = 8;
const HEADERS = ['م', 'التاريخ والوقت', 'اسم الزائرة الثلاثي', 'رقم الهوية / الإقامة',
  'سبب الزيارة', 'جهة العمل / الصفة', 'رقم الجوال', 'التوقيع ووقت المغادرة'];
const WIDTHS = [45, 135, 220, 140, 210, 170, 115, 240];
const TOKEN_DAYS = 3, RESERVE_MINUTES = 5;
const PROPS = PropertiesService.getScriptProperties();

/* ---------- إنشاء السجل (تلقائيًا عند أول تسجيل، تحت القفل) ---------- */
function createSheet_() {
  const ss = SpreadsheetApp.create('سجل الزائرات — ' + SCHOOL);
  ss.setSpreadsheetTimeZone(TZ);
  const sh = ss.getSheets()[0];
  sh.setName(SHEET);
  sh.setRightToLeft(true);
  sh.getRange(1, 1, sh.getMaxRows(), COLS).setFontFamily('Arial').setFontSize(11)
    .setVerticalAlignment('middle').setWrap(true);

  sh.getRange('A1:H1').merge().setValue('سجل الزائرات للمدرسة').setFontSize(18).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#1F4E78').setHorizontalAlignment('center');
  sh.getRange('A2:B2').merge().setValue('اسم المدرسة:');
  sh.getRange('C2:E2').merge().setValue(SCHOOL);
  sh.getRange('F2').setValue('العام الدراسي:');
  sh.getRange('G2:H2').merge().setNumberFormat('@');
  sh.getRange('A2:H2').setFontSize(12).setHorizontalAlignment('right')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange('A2').setFontWeight('bold').setBackground('#DDEBF7');
  sh.getRange('F2').setFontWeight('bold').setBackground('#DDEBF7');

  sh.getRange(HEAD_ROW, 1, 1, COLS).setValues([HEADERS]).setFontSize(12).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground('#2F75B5').setHorizontalAlignment('center')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  sh.setRowHeight(1, 44); sh.setRowHeight(2, 32); sh.setRowHeight(HEAD_ROW, 40);
  WIDTHS.forEach((w, i) => sh.setColumnWidth(i + 1, w));
  formatDataRows_(sh, FIRST_ROW, sh.getMaxRows() - FIRST_ROW + 1);
  sh.setFrozenRows(HEAD_ROW);
  sh.getRange(HEAD_ROW, 1, sh.getMaxRows() - HEAD_ROW + 1, COLS).createFilter();
  SpreadsheetApp.flush();
  PROPS.setProperty('sheetId', ss.getId());
  Logger.log('تم إنشاء السجل: ' + ss.getUrl());
  return sh;
}

function formatDataRows_(sh, row, n) {
  const r = sh.getRange(row, 1, n, COLS);
  r.setFontFamily('Arial').setFontSize(11).setVerticalAlignment('middle').setWrap(true)
    .setHorizontalAlignment('right')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  [1, 2, 4, 7, SIG_COL].forEach(c => sh.getRange(row, c, n, 1).setHorizontalAlignment('center'));
  sh.getRange(row, 1, n, 1).setNumberFormat('0').setFontWeight('bold');
  sh.getRange(row, 2, n, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  sh.getRange(row, 4, n, 1).setNumberFormat('@');
  sh.getRange(row, 7, n, 1).setNumberFormat('@');
  sh.setRowHeights(row, n, 36);
}

/* create=true فقط داخل register تحت القفل. */
function sheet_(create) {
  const id = PROPS.getProperty('sheetId');
  if (!id) {
    if (create) return createSheet_();
    throw new Error('لا توجد زيارات مسجلة بعد.');
  }
  const sh = SpreadsheetApp.openById(id).getSheetByName(SHEET);
  if (!sh) throw new Error('ورقة «' + SHEET + '» غير موجودة في ملف السجل. أعيدي اسمها كما كان.');
  return sh;
}

/* ---------- الصفحة ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const token = /^[a-f0-9]{32}$/.test(p.v || '') ? p.v : '';
  const html = PAGE
    .replace('__URL__', ScriptApp.getService().getUrl())
    .replace('__MODE__', p.p === 'out' ? 'out' : 'reg')
    .replace('__TOKEN__', token)
    .replace(/__SCHOOL__/g, SCHOOL);
  return HtmlService.createHtmlOutput(html)
    .setTitle('تسجيل الزائرات')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- تنظيف المدخلات ---------- */
function digits_(s) {
  return String(s == null ? '' : s)
    .replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 0x6F0))
    .replace(/[\s\-()]/g, '');
}
function text_(s, max, label) {
  s = String(s == null ? '' : s).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^[=+\-@]+/, '').trim();
  if (!s) throw new Error('اكتبي ' + label + '.');
  if (s.length > max) throw new Error(label + ' أطول من المسموح.');
  return s;
}
function idNo_(s) {
  const v = digits_(s);
  if (!/^[12]\d{9}$/.test(v)) throw new Error('رقم الهوية / الإقامة يتكون من 10 أرقام ويبدأ بـ 1 أو 2.');
  return v;
}
function mobile_(s) {
  let v = digits_(s).replace(/^\+/, '').replace(/^00/, '');
  if (/^9665\d{8}$/.test(v)) v = '0' + v.slice(3);
  if (/^5\d{8}$/.test(v)) v = '0' + v;
  if (!/^05\d{8}$/.test(v)) throw new Error('رقم الجوال يتكون من 10 أرقام ويبدأ بـ 05.');
  return v;
}
function fmt_(d) { return Utilities.formatDate(d, TZ, 'dd/MM/yyyy HH:mm'); }
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('النظام مشغول، حاولي بعد لحظات.');
  try { return fn(); } finally { lock.releaseLock(); }
}
function lastNum_(sh) {
  const last = sh.getLastRow();
  if (last < FIRST_ROW) return 0;
  return sh.getRange(FIRST_ROW, 1, last - FIRST_ROW + 1, 1).getValues()
    .reduce((m, v) => Math.max(m, Number(v[0]) || 0), 0);
}
function pruneTokens_() {
  const all = PROPS.getProperties(), limit = Date.now() - TOKEN_DAYS * 86400000;
  Object.keys(all).forEach(k => {
    if (k.indexOf('t_') !== 0 && k.indexOf('r_') !== 0) return;
    try { if (JSON.parse(all[k]).a < limit) PROPS.deleteProperty(k); } catch (e) { PROPS.deleteProperty(k); }
  });
}

/* ---------- تسجيل الزيارة ---------- */
function register(f) {
  f = f || {};
  const name = text_(f.name, 80, 'الاسم الثلاثي');
  if (name.split(' ').length < 3) throw new Error('اكتبي الاسم الثلاثي كاملًا.');
  const d = {
    name, id: idNo_(f.id), reason: text_(f.reason, 200, 'سبب الزيارة'),
    work: text_(f.work, 100, 'جهة العمل / الصفة'), mobile: mobile_(f.mobile),
  };
  return withLock_(() => {
    const sh = sheet_(true);
    // الرقم التالي من السجل نفسه، فحذف صفوف الاختبار يدويًا يعيد الترقيم تلقائيًا.
    const num = lastNum_(sh) + 1;
    const row = Math.max(sh.getLastRow() + 1, FIRST_ROW);
    if (row > sh.getMaxRows()) {
      sh.insertRowsAfter(sh.getMaxRows(), 200);
      formatDataRows_(sh, row, sh.getMaxRows() - row + 1);
    }
    sh.getRange(row, 1, 1, 7).setValues([[num, new Date(), d.name, d.id, d.reason, d.work, d.mobile]]);
    SpreadsheetApp.flush();
    const back = sh.getRange(row, 1, 1, 7).getValues()[0];
    if (Number(back[0]) !== num || !(back[1] instanceof Date) || String(back[3]) !== d.id || String(back[6]) !== d.mobile) {
      sh.getRange(row, 1, 1, COLS).clearContent();
      throw new Error('تعذّر حفظ الزيارة، حاولي مرة أخرى.');
    }
    pruneTokens_();
    const token = Utilities.getUuid().replace(/-/g, '');
    PROPS.setProperty('t_' + token, JSON.stringify({ n: num, a: back[1].getTime() }));
    return { ok: true, time: fmt_(back[1]), token };
  });
}

/* ---------- المغادرة ---------- */
function rows_(sh) {
  const last = sh.getLastRow();
  return last < FIRST_ROW ? [] : sh.getRange(FIRST_ROW, 1, last - FIRST_ROW + 1, 7).getValues();
}
function isOpen_(sh, row) {
  const cell = sh.getRange(row, SIG_COL);
  return cell.getValue() === '' && !cell.getNote();
}
/* يحدد الزيارة: بالرابط الخاص (رقم + وقت وصول مطابق) أو برقم الهوية + الجوال. */
function resolve_(sh, key) {
  key = key || {};
  const vals = rows_(sh);
  if (key.v) {
    let t = null;
    try { t = JSON.parse(PROPS.getProperty('t_' + String(key.v)) || 'null'); } catch (e) { t = null; }
    const i = t ? vals.findIndex(v => Number(v[0]) === t.n && v[1] instanceof Date && Math.abs(v[1].getTime() - t.a) < 2000) : -1;
    if (i < 0) throw new Error('رابط المغادرة غير صالح أو انتهت مدته. استخدمي رقم الهوية والجوال.');
    if (!isOpen_(sh, FIRST_ROW + i)) throw new Error('سُجّلت مغادرة هذه الزيارة مسبقًا. شكرًا لكِ.');
    return { num: t.n, row: FIRST_ROW + i };
  }
  const id = idNo_(key.id), mobile = mobile_(key.mobile);
  let best = null;
  vals.forEach((v, i) => {
    if (String(v[3]) === id && String(v[6]) === mobile && isOpen_(sh, FIRST_ROW + i)) {
      if (!best || Number(v[0]) > best.num) best = { num: Number(v[0]), row: FIRST_ROW + i };
    }
  });
  if (!best) throw new Error('لم نجد زيارة مفتوحة بهذه البيانات. تأكدي من رقم الهوية والجوال.');
  return best;
}

/* فتح صفحة التوقيع: يتحقق من الزيارة فقط، ولا يأخذ وقتًا. */
function leaveStart(key) {
  const r = resolve_(sheet_(false), key);
  return { ok: true, num: r.num };
}

/* عند ضغط «تسجيل المغادرة»: الخادم يأخذ الوقت ويحفظه عنده مع رمز حجز. */
function leaveReserve(key, num) {
  return withLock_(() => {
    const r = resolve_(sheet_(false), key);
    if (r.num !== Number(num)) throw new Error('تغيّرت بيانات الزيارة، أعيدي المحاولة.');
    const now = new Date(), nonce = Utilities.getUuid().replace(/-/g, '');
    PROPS.setProperty('r_' + r.num, JSON.stringify({ a: now.getTime(), k: nonce }));
    return { ok: true, time: fmt_(now), nonce };
  });
}

/* حفظ التوقيع بالوقت المحجوز لدى الخادم؛ عند أي فشل تُعاد الخلية فارغة. */
function leaveFinish(key, num, dataUrl, nonce) {
  if (typeof dataUrl !== 'string' || dataUrl.indexOf('data:image/png;base64,') !== 0 || dataUrl.length > 500000) {
    throw new Error('التوقيع غير صالح، أعيدي المحاولة.');
  }
  return withLock_(() => {
    const sh = sheet_(false);
    const r = resolve_(sh, key);
    if (r.num !== Number(num)) throw new Error('تغيّرت بيانات الزيارة، أعيدي المحاولة.');
    let res = null;
    try { res = JSON.parse(PROPS.getProperty('r_' + r.num) || 'null'); } catch (e) { res = null; }
    if (!res || res.k !== String(nonce) || Date.now() - res.a > RESERVE_MINUTES * 60000) {
      throw new Error('انتهت مهلة التأكيد، اضغطي «تسجيل المغادرة» مرة أخرى.');
    }
    const t = fmt_(new Date(res.a));
    const cell = sh.getRange(r.row, SIG_COL);
    try {
      const img = SpreadsheetApp.newCellImage().setSourceUrl(dataUrl)
        .setAltTextTitle('توقيع الزائرة').setAltTextDescription('غادرت: ' + t).build();
      cell.setValue(img);
      cell.setNote('وقت المغادرة: ' + t);
      sh.setRowHeight(r.row, 80);
      SpreadsheetApp.flush();
      const v = cell.getValue();
      if (!v || typeof v.getContentUrl !== 'function' && typeof v.getUrl !== 'function') throw new Error('no image');
    } catch (err) {
      cell.clearContent(); cell.clearNote(); SpreadsheetApp.flush();
      console.error('leaveFinish: ' + err);
      throw new Error('تعذّر حفظ التوقيع، ولم تُسجَّل المغادرة. حاولي مرة أخرى.');
    }
    PROPS.deleteProperty('r_' + r.num);
    return { ok: true, time: t };
  });
}

/* ---------- واجهة الجوال ---------- */
const PAGE = String.raw`<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<style>
*{box-sizing:border-box}
body{margin:0;background:#FBF8F2;color:#2E2A24;font-family:"Segoe UI",Tahoma,Arial,sans-serif;font-size:17px;line-height:1.6}
.wrap{max-width:520px;margin:0 auto;padding:18px 16px 40px}
.card{background:#fff;border:1px solid #D9BC7E;border-radius:14px;padding:20px 18px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.school{text-align:center;font-weight:700;font-size:18px;margin:6px 0 2px}
h1{text-align:center;color:#9A7433;font-size:22px;margin:4px 0 16px}
label{display:block;font-weight:600;margin:14px 0 6px}
input,textarea{width:100%;font:inherit;padding:11px 12px;border:1px solid #CFC6B6;border-radius:10px;background:#fff}
input:focus,textarea:focus{outline:2px solid #B8914A;border-color:#B8914A}
.ltr{direction:ltr;text-align:right}
button{width:100%;margin-top:20px;padding:14px;font:inherit;font-weight:700;font-size:18px;color:#fff;background:#B8914A;border:0;border-radius:12px}
button[disabled]{opacity:.6}
button.alt{background:#fff;color:#8A6A2E;border:1px solid #B8914A;margin-top:10px;font-size:16px;padding:10px}
.err{color:#B3261E;font-weight:600;margin-top:12px;min-height:1em}
.ok{text-align:center}
.ok .tick{font-size:48px;color:#2E7D32;line-height:1}
.note{font-size:14px;color:#6B6358;margin-top:14px}
a.link{display:block;text-align:center;margin-top:18px;color:#8A6A2E;font-weight:600}
a.btn{display:block;text-align:center;margin-top:18px;padding:14px;border-radius:12px;background:#B8914A;color:#fff;font-weight:700;text-decoration:none}
canvas{width:100%;aspect-ratio:3/1;border:1px dashed #B8914A;border-radius:10px;background:#fff;touch-action:none;display:block}
[hidden]{display:none!important}
</style></head><body><div class="wrap">
<div class="school">__SCHOOL__</div>

<section id="reg" class="card" hidden>
<h1>تسجيل زيارة</h1>
<form id="regForm" novalidate>
<label for="name">اسم الزائرة الثلاثي</label><input id="name" autocomplete="name" maxlength="80" required>
<label for="id">رقم الهوية / الإقامة</label><input id="id" class="ltr" inputmode="numeric" maxlength="14" required>
<label for="reason">سبب الزيارة</label><textarea id="reason" rows="2" maxlength="200" required></textarea>
<label for="work">جهة العمل / الصفة</label><input id="work" maxlength="100" required>
<label for="mobile">رقم الجوال</label><input id="mobile" class="ltr" inputmode="tel" placeholder="05xxxxxxxx" maxlength="16" required>
<button id="regBtn" type="submit">تسجيل الزيارة</button>
<div class="err" id="regErr" role="alert"></div>
<div class="note">تُستخدم بياناتكِ لسجل زيارات المدرسة فقط، ولا تطّلع عليها إلا إدارة المدرسة.</div>
</form>
<a class="link" id="toOut" target="_top">تسجيل المغادرة</a>
</section>

<section id="done" class="card ok" hidden>
<div class="tick">✓</div>
<h1>تم تسجيل زيارتكِ بنجاح</h1>
<div>وقت الوصول: <bdi id="doneTime" dir="ltr" style="font-weight:700"></bdi></div>
<div class="note">عند الانصراف اضغطي الزر التالي لتسجيل المغادرة والتوقيع. احتفظي بهذه الصفحة، أو امسحي الرمز مرة أخرى واختاري «تسجيل المغادرة».</div>
<a class="btn" id="doneOut" target="_top">تسجيل المغادرة عند الانصراف</a>
</section>

<section id="out1" class="card" hidden>
<h1>تسجيل المغادرة</h1>
<form id="outForm" novalidate>
<label for="oid">رقم الهوية / الإقامة</label><input id="oid" class="ltr" inputmode="numeric" maxlength="14" required>
<label for="omobile">رقم الجوال</label><input id="omobile" class="ltr" inputmode="tel" placeholder="05xxxxxxxx" maxlength="16" required>
<button id="outBtn" type="submit">متابعة</button>
<div class="err" id="outErr" role="alert"></div>
</form>
</section>

<section id="sign" class="card" hidden>
<h1>التوقيع عند المغادرة</h1>
<div class="note">يُسجَّل وقت المغادرة تلقائيًا لحظة الضغط على «تسجيل المغادرة».</div>
<label>وقّعي بإصبعكِ داخل المربع</label>
<canvas id="pad" width="600" height="200"></canvas>
<button class="alt" id="clearBtn" type="button">مسح التوقيع</button>
<button id="signBtn" type="button">تسجيل المغادرة</button>
<div class="err" id="signErr" role="alert"></div>
</section>

<section id="left" class="card ok" hidden>
<div class="tick">✓</div>
<h1>تم تسجيل مغادرتكِ</h1>
<div>وقت المغادرة: <bdi id="leftTime" dir="ltr" style="font-weight:700"></bdi></div>
<div class="note">شكرًا لزيارتكِ.</div>
</section>

<section id="fail" class="card ok" hidden>
<h1>تعذّر المتابعة</h1><div class="err" id="failMsg"></div>
<a class="link" id="failOut" target="_top">تسجيل المغادرة برقم الهوية والجوال</a>
</section>
</div>
<script>
var URL = '__URL__', MODE = '__MODE__', TOKEN = '__TOKEN__';
var KEY = null, NUM = 0;
function $(id) { return document.getElementById(id); }
function show(id) { ['reg','done','out1','sign','left','fail'].forEach(function (x) { $(x).hidden = x !== id; }); window.scrollTo(0, 0); }
function msg(e) { return String((e && e.message) || e || 'حدث خطأ، حاولي مرة أخرى.').replace(/^(Error|Exception):\s*/, ''); }
$('toOut').href = URL + '?p=out';
$('failOut').href = URL + '?p=out';

$('regForm').addEventListener('submit', function (ev) {
  ev.preventDefault();
  var b = $('regBtn'); b.disabled = true; b.textContent = 'جارٍ التسجيل…'; $('regErr').textContent = '';
  google.script.run.withSuccessHandler(function (r) {
    $('doneTime').textContent = r.time;
    $('doneOut').href = URL + '?p=out&v=' + r.token;
    show('done');
  }).withFailureHandler(function (e) {
    b.disabled = false; b.textContent = 'تسجيل الزيارة'; $('regErr').textContent = msg(e);
  }).register({ name: $('name').value, id: $('id').value, reason: $('reason').value, work: $('work').value, mobile: $('mobile').value });
});

function start(key, onErr) {
  google.script.run.withSuccessHandler(function (r) {
    KEY = key; NUM = r.num; show('sign'); fit();
  }).withFailureHandler(onErr).leaveStart(key);
}
$('outForm').addEventListener('submit', function (ev) {
  ev.preventDefault();
  var b = $('outBtn'); b.disabled = true; $('outErr').textContent = '';
  start({ id: $('oid').value, mobile: $('omobile').value }, function (e) { b.disabled = false; $('outErr').textContent = msg(e); });
});

/* لوحة التوقيع */
var pad = $('pad'), ctx = pad.getContext('2d'), drawing = false, inked = 0;
function fit() { ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111'; }
function pos(e) { var r = pad.getBoundingClientRect(); return { x: (e.clientX - r.left) * pad.width / r.width, y: (e.clientY - r.top) * pad.height / r.height }; }
pad.addEventListener('pointerdown', function (e) { drawing = true; pad.setPointerCapture(e.pointerId); var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
pad.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); inked++; });
['pointerup','pointercancel','pointerleave'].forEach(function (t) { pad.addEventListener(t, function () { drawing = false; }); });
$('clearBtn').onclick = function () { ctx.clearRect(0, 0, pad.width, pad.height); inked = 0; };

$('signBtn').onclick = function () {
  if (inked < 8) { $('signErr').textContent = 'وقّعي داخل المربع أولًا.'; return; }
  var b = $('signBtn');
  function fail(e) { b.disabled = false; b.textContent = 'تسجيل المغادرة'; $('signErr').textContent = msg(e); }
  b.disabled = true; b.textContent = 'جارٍ الحفظ…'; $('signErr').textContent = '';
  /* الوقت يأتي من الخادم (leaveReserve) ويُكتب تحت التوقيع كما هو، ثم يحفظه الخادم نفسه. */
  google.script.run.withSuccessHandler(function (res) {
    var out = document.createElement('canvas'); out.width = 600; out.height = 250;
    var o = out.getContext('2d');
    o.fillStyle = '#fff'; o.fillRect(0, 0, 600, 250);
    o.drawImage(pad, 0, 0, 600, 200);
    o.fillStyle = '#111'; o.font = 'bold 26px Arial, sans-serif'; o.textAlign = 'center'; o.direction = 'rtl';
    o.fillText('غادرت: \u2066' + res.time + '\u2069', 300, 236);
    google.script.run.withSuccessHandler(function (r) {
      $('leftTime').textContent = r.time; show('left');
    }).withFailureHandler(fail).leaveFinish(KEY, NUM, out.toDataURL('image/png'), res.nonce);
  }).withFailureHandler(fail).leaveReserve(KEY, NUM);
};

if (MODE === 'out' && TOKEN) {
  start({ v: TOKEN }, function (e) { $('failMsg').textContent = msg(e); show('fail'); });
} else if (MODE === 'out') { show('out1'); } else { show('reg'); }
</script></body></html>`;
