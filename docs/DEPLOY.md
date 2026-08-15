# FOAAD v2.1 — deployment to the existing FOAAD Quran project

TARGET (and nothing else):
  repo   isharataljasad/masarcare-health
  branch foaad-public-preview
  live   https://foaad-quran.vercel.app

DO NOT TOUCH: `main`, the Anemia Bio-OS code, isharataljasad.com, or any other project.

## 1 · Replace the deployed tree
On branch `foaad-public-preview`, in the directory Vercel currently serves:

  DELETE   app.js                (root — superseded by js/)
  REPLACE  index.html
  REPLACE  style.css
  ADD      js/{versions,store,corpus,views,app}.js
  ADD      fonts/{amiri-quran-ar,noto-sans-arabic-regular,noto-sans-arabic-bold}.woff2
  ADD      vercel.json
  ADD      .vercelignore
  KEEP OUT OF PRODUCTION  test/  security/  docs/   (excluded by .vercelignore)

No build step. No dependencies. Vercel framework preset: **Other**; output directory: the
directory containing index.html.

## 2 · Deploy to a PREVIEW url first
Push to a branch other than the production branch, or `vercel deploy` without `--prod`.
Do not promote to https://foaad-quran.vercel.app until §3 and §4 pass.

## 3 · Post-deploy smoke checks (2 minutes, on the preview URL)
  1. `curl -sI <preview>` → 200, and `content-security-policy` header present.
  2. `curl -s <preview>/fonts/amiri-quran-ar.woff2 -o /dev/null -w '%{http_code} %{size_download}\n'`
     → `200 59132`.
  3. Open DevTools → Network → filter Font → both families load, status 200, no fallback.
  4. Console must be EMPTY. Any CSP violation appears here; treat one as a blocker.
  5. Application → Local Storage → key `foaad_v2` appears after typing one observation.
  6. DevTools → Network → Offline → reload → cards still render from cache with the
     "نسخة محفوظة على جهازك" notice. (The page shell itself still needs one online load;
     there is no service worker.)

## 4 · Gate
Promote to production only after: the security package (security/) is executed and
recorded, the human device script passes on the four target browsers, and the label
test has been run. See GO/NO-GO in the Block 3 report.

## 5 · Rollback
`git revert` the deploy commit, or in Vercel → Deployments → the previous deployment →
"Promote to Production". Rollback is instant; there is no server state and no migration
to undo. User data lives only in each visitor's own browser and is untouched by rollback.

## 6 · Data-loss warning to keep in mind
All user writing lives in `localStorage` on the visitor's device. Changing the storage
key `foaad_v2` in a future release, or a visitor clearing site data, destroys it with no
recovery. `foaad_v2` must be treated as a permanent contract from this deploy onward.
