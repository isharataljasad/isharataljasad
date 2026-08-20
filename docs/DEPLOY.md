# Deployment — مسار الفؤاد للتدبر · بيت الفؤاد

TARGET (and nothing else):
  repo   isharataljasad/isharataljasad
  branch main  → production
  live   https://www.isharataljasad.com/

Everything reachable on this deployment sits behind the edge access gate in
`middleware.js`. There is no second address at which the application is served
without it.

## 1 · The deployed tree
Served as-is, no build step, no dependencies beyond `@vercel/functions` for the gate:

  index.html
  style.css
  icon.svg              (favicon + home-screen icon)
  manifest.webmanifest  (installability basics; scope "/", protected like everything else)
  js/{versions,store,corpus,views,app}.js
  fonts/{amiri-quran-ar,noto-sans-arabic-regular,noto-sans-arabic-bold}.woff2
  middleware.js + gate/
  vercel.json
  KEEP OUT OF PRODUCTION  test/  security/  docs/   (excluded by .vercelignore)

Vercel framework preset: **Other**; output directory: the directory containing index.html.
Required environment variables (server-only): `FOAAD_ACCESS_PASSWORD_HASH`,
`FOAAD_SESSION_SECRET`. A deployment missing either one closes the door (503) instead of
falling open.

## 2 · Deploy to a PREVIEW url first
Open a pull request, or `vercel deploy` without `--prod`. Do not promote to production
until §3 and §4 pass. The gate runs on preview deployments too.

## 3 · Post-deploy smoke checks (2 minutes, on the preview URL)
  1. `curl -sI <preview>` → 307 to `/login` when anonymous; after login 200 with
     `content-security-policy` and `x-robots-tag: noindex` present.
  2. `curl -s <preview>/fonts/amiri-quran-ar.woff2 -o /dev/null -w '%{http_code} %{size_download}\n'`
     → `200 59132`.
  3. Open DevTools → Network → filter Font → both families load, status 200, no fallback.
  4. Console must be EMPTY. Any CSP violation appears here; treat one as a blocker.
  5. Application → Local Storage → key `foaad_v2` appears after typing one observation.
  6. DevTools → Network → Offline → reload → cards still render from cache with the
     "نسخة محفوظة على جهازك" notice, and the notice offers "إعادة المحاولة".
     (The page shell itself still needs one online load; there is no service worker.)
  7. Switch the OS to dark mode and reload: the three registers stay distinct and the
     ayah keeps its contrast.
  8. At 320 px width there is no horizontal scrolling on any view.

## 4 · Gate
Promote to production only after: `npm test` and `bash security/verify-clientside-secrets.sh`
pass, the security package (security/) is executed and recorded, the human device script
passes on the four target browsers, and the label test has been run.

## 5 · Rollback
`git revert` the deploy commit, or in Vercel → Deployments → the previous deployment →
"Promote to Production". Rollback is instant; there is no server state and no migration
to undo. User data lives only in each visitor's own browser and is untouched by rollback.

## 6 · Data-loss warning to keep in mind
All user writing lives in `localStorage` on the visitor's device. Changing the storage
key `foaad_v2` in a future release, or a visitor clearing site data, destroys it with no
recovery. `foaad_v2` must be treated as a permanent contract from this deploy onward.
