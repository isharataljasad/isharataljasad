# إشارات الجسد | Bio-OS — Website

مشروع عربي للصحة الرقمية والتثقيف الصحي المنهجي.

## Deployment

### Vercel (Recommended)
1. Push this folder to a GitHub repo
2. Connect the repo to [vercel.com](https://vercel.com)
3. Vercel auto-detects the static site — no build step needed
4. Set custom domain in Vercel dashboard

### GitHub Pages
1. Push to a repo, go to **Settings → Pages**
2. Select branch `main`, folder `/` (root)
3. The `.nojekyll` file ensures proper CSS/JS loading

### Netlify
1. Drag-and-drop this folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Or connect via Git

## Before Deployment Checklist

- [ ] Replace `https://bio-os.sa` in `sitemap.xml`, all HTML files, and `robots.txt` with your actual domain
- [ ] Add images to `/images/` (see `images/README.md`)
- [ ] Review all content for final approval
- [ ] Test all navigation links
- [ ] Verify mobile responsiveness
- [ ] Run Lighthouse audit

## Quick Domain Replace

```bash
# Replace placeholder domain with your actual domain
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" -o -name "*.json" \) \
  -exec sed -i 's|https://bio-os.sa|https://YOUR-ACTUAL-DOMAIN.com|g' {} +
```

## Structure

```
├── index.html              # الرئيسية
├── about.html              # من نحن
├── method.html             # المنهج
├── what-we-do.html         # ماذا نقدم
├── what-we-do-not-do.html  # ماذا لا نقدم
├── for-whom.html           # لمن هذا الموقع
├── library.html            # المكتبة
├── privacy.html            # الخصوصية
├── medical-disclaimer.html # إخلاء المسؤولية الطبية
├── contact.html            # تواصل معنا
├── faq.html                # الأسئلة الشائعة
├── for-professionals.html  # للمهنيين
├── updates.html            # التحديثات
├── 404.html                # صفحة الخطأ
├── css/style.css
├── js/main.js
├── images/
├── sitemap.xml
├── robots.txt
├── vercel.json
├── manifest.json
├── favicon.svg
├── .nojekyll
└── README.md
```

## Tech

- Pure HTML/CSS/JS — no build step
- RTL Arabic layout
- Responsive (mobile-first)
- SEO: Open Graph, Twitter Cards, JSON-LD, sitemap
- Security headers via `vercel.json`
- PWA-ready via `manifest.json`
