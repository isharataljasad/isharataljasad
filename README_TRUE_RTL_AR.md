# إشارات الجسد | Bio-OS — نسخة TRUE RTL v3

هذه نسخة كاملة جاهزة للاختبار والرفع على GitHub/Vercel.

## أهم ما تم إصلاحه

- جعل اتجاه الموقع بالكامل عربيًا: `<html lang="ar" dir="rtl">`.
- إصلاح الأسهم في سلاسل الفؤاد من: `إشارة إلى جهاز` إلى: `إشارة ← جهاز`.
- إصلاح Breadcrumbs لتتحرك بصريًا من اليمين إلى اليسار:
  `الرئيسية ← خريطة الجسم ← الجلد ← الكيس الدهني`.
- إصلاح سلاسل المنهج والخطوات والخرائط لتعمل كـ RTL حقيقي، وليس مجرد محاذاة يمين.
- إضافة صفحات تصنيف جاهزة للتوسع تحت `/body/`.
- إضافة سجل مواضيع قابل للتوسع: `/assets/data/topics.json`.
- الحفاظ على المصطلحات الإنجليزية داخل RTL باستخدام `dir="ltr"` حيث يلزم.

## طريقة الاختبار محليًا

افتح الملف:

`index.html`

ثم اختبر هذه المسارات:

- `body.html`
- `body/skin.html`
- `body/skin/epidermoid-cyst.html`
- `method.html`
- `library.html`

## طريقة الرفع

ارفع محتويات هذا المجلد من الداخل إلى جذر GitHub repository، وليس المجلد نفسه.

بعد Commit وانتظار Vercel حتى يظهر Ready، افتح:

- `https://www.isharataljasad.com/`
- `https://www.isharataljasad.com/body.html`
- `https://www.isharataljasad.com/body/skin.html`
- `https://www.isharataljasad.com/body/skin/epidermoid-cyst.html`

## قاعدة التوسع

المسار المعتمد:

الرئيسية ← خريطة الجسم ← التصنيف/الجهاز ← الموضوع

مثال:

الرئيسية ← خريطة الجسم ← الجلد ← الكيس الدهني

