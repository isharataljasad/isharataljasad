# إشارات الجسد | Bio-OS — نسخة كاملة للرفع إلى GitHub/Vercel

تاريخ النسخة: 2026-05-13

## ما الجديد؟
- إضافة محور جديد: الدم والطاقة (`body-blood.html`).
- إضافة المقال المنشور: لماذا لا تتحسن الأنيميا رغم الحديد؟ (`body-blood-anemia-loop.html`).
- تحديث `topics.json` والمكتبة وخريطة الجسم و`sitemap.xml`.
- هذه نسخة كاملة وليست Patch؛ تصلح بعد حذف ملفات GitHub الحالية.

## طريقة الرفع الصحيحة بعد حذف ملفات GitHub
1. فك ضغط هذا الملف على جهازك.
2. افتح المجلد الناتج.
3. ارفع محتويات المجلد نفسها إلى جذر المستودع GitHub، وليس المجلد الخارجي.
4. يجب أن ترى `index.html` مباشرة في جذر المستودع.
5. يجب أن ترى أيضًا: `topics.json`, `sitemap.xml`, `robots.txt`, `vercel.json`, وملفات الصفحات `.html`.
6. لا ترفع ملف ZIP نفسه إلى GitHub كبديل عن الملفات.
7. بعد الرفع انتظر Vercel حتى يعيد النشر، ثم افتح:
   - https://www.isharataljasad.com/
   - https://www.isharataljasad.com/body-blood-anemia-loop.html

## ملاحظة مهمة
إذا ظهر 404 بعد النشر، تأكد أن `index.html` موجود في الجذر، وليس داخل مجلد داخلي مثل `isharataljasad_full_site_anemia/index.html`.
