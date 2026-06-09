# موجّه حماية الكلى — إشارات الجسد | بوصلة الإشارات

موقع ثابت (Static) للموسم الأول: **«الكلى لا تنهار فجأة»**.
محتوى تثقيفي لتنظيم الأسئلة مع الطبيب — **ليس تشخيصًا ولا وصفًا علاجيًا ولا جرعات**.

> نفهم الإشارة… لنحمي الحياة · isharataljasad.com

## المحتوى
- `index.html` — الرئيسية: الهيرو، التنويه، الفكرة المركزية، خريطة الموسم (10 حلقات)، بوابة «متى لا تنتظر؟».
- `episode-1.html` … `episode-10.html` — صفحات الحلقات.
- `master-form.html` — الدخول للموسم التفاعلي (نسخ/طباعة/مسح).
- `404.html` — صفحة غير موجودة.
- `assets/css/styles.css` · `assets/js/main.js` · `assets/img/*.svg`.

## المواصفات
HTML/CSS/JS ثابت — بدون React وبدون أدوات بناء. عربي كامل `lang="ar" dir="rtl"`، متجاوب يبدأ من الجوال. الخطوط من Google Fonts (Tajawal + IBM Plex Sans Arabic) مع بدائل نظام. لا تُحفظ أي بيانات من النموذج.

## تشغيل محلي
```bash
python3 -m http.server 8000   # ثم: http://localhost:8000
```

## نشر على GitHub Pages
```bash
git init && git add . && git commit -m "موجّه حماية الكلى"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```
ثم: Settings → Pages → Source: `main` / `root`.

## نشر على Vercel
لوحة التحكم: Add New → Project → اربط المستودع → Framework: **Other** · بلا أمر بناء · Output: `./` → Deploy.
أو: `npm i -g vercel && vercel --prod`.

## قواعد الهوية والمحتوى
تُستخدم فقط: إشارات الجسد · بوصلة الإشارات · موجّه حماية الكلى · الموسم الأول | الكلى لا تنهار فجأة · نفهم الإشارة… لنحمي الحياة.
يُمنع: Bio-OS، «محرك»، «سلسلة»، لغة التشخيص، الوعود العلاجية، الجرعات، «ابدأ/أوقف الدواء».

## تنويه
محتوى للتثقيف الصحي وتنظيم الأسئلة مع الطبيب؛ لا يقدّم تشخيصًا فرديًا أو علاجًا أو جرعات، ولا يطلب بدء أو إيقاف دواء. أي قرار طبي يعتمد على الطبيب المعالج والحالة والتحاليل والأعراض والأدوية الحالية.


## الدخول للموسم

تم حذف صفحة الماستر فورم وإضافة صفحة `access.html`. كلمة المرور التجريبية الحالية داخل `assets/js/main.js` هي `KIDNEY2026`. غيّر قيمة `KIDNEY_SEASON_PASSWORD` قبل النشر إذا رغبت. هذه حماية ناعمة مناسبة للبروتوتايب الساكن وليست حماية خادم حقيقية.


## v4 robustness fix
- Added critical inline fallback CSS to every HTML page so the site remains readable even if external CSS fails to load after deployment.
- Reveal animations are now safe: content is visible even if JavaScript fails.
- Master form page remains removed.
- If a page appears unstyled online, confirm the full `assets/` folder was uploaded with `assets/css/styles.css`, `assets/js/main.js`, and `assets/img/`.
