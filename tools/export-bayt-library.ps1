<#
  Export the Semester 1 library into the Bayt Al-Fuad site (Corner 03, العلم والصنعة).

  Reads the generated pages of this repository (built by tools/build-study.mjs) and
  writes a copy under <BaytRoot>/<Base>/ with links, assets and header pointing into
  Bayt Al-Fuad. Lesson text, order and anchors are not touched. The optional
  feedback form is left out: Bayt Al-Fuad has no feedback service yet, and the form
  must not appear where it cannot deliver.

  Usage:  powershell -File tools/export-bayt-library.ps1 -BaytRoot C:\path\to\baytalfuad
  Re-running replaces the whole <Base> folder, so the output is always the current
  build. Rebuild this repository first (npm run build:study) after content changes.
#>
param(
  [Parameter(Mandatory = $true)][string]$BaytRoot,
  [string]$Base = 'ilm-sinaa/student/semester-1'
)
$ErrorActionPreference = 'Stop'
$src = Split-Path -Parent $PSScriptRoot
$out = Join-Path $BaytRoot ($Base -replace '/', '\')
$utf8 = New-Object System.Text.UTF8Encoding($false)
$B = '/' + $Base.Trim('/')

# Source page -> destination folder (relative to $Base). Lessons, contents and sources
# keep their paths; the old Book/Pearson/Educator forwarders move beside English's.
$map = [ordered]@{ 'semester-1' = '' }
foreach ($s in 'math', 'physics', 'chemistry', 'english') {
  Get-ChildItem (Join-Path $src "semester-1\$s") -Recurse -Filter index.html | ForEach-Object {
    $rel = $_.DirectoryName.Substring($src.Length + 1) -replace '\\', '/'
    $map[$rel] = $rel.Substring('semester-1/'.Length)
  }
}
foreach ($old in @{ 'ma101' = 'math'; 'phy101' = 'physics'; 'chemistry' = 'chemistry' }.GetEnumerator()) {
  foreach ($kind in 'book', 'pearson', 'educator') { $map["$($old.Key)/$kind"] = "$($old.Value)/old-links/$kind" }
}

$brandOld = '<a class="brand" href="/">BAYT AL-FUAD<span>Semester 1 · Study library</span></a>'
$brandNew = '<a class="brand" href="/" lang="ar" dir="rtl" aria-label="العودة إلى بيت الفؤاد">بيت الفؤاد<span>الركن 03 · العلم والصنعة</span></a>'
$crumbOld = '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Semester 1</a>'
$crumbNew = '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/ilm-sinaa/" lang="ar">العلم والصنعة</a><span aria-hidden="true">/</span><a href="/ilm-sinaa/student/" lang="ar">نظام الطالب</a><span aria-hidden="true">/</span><a href="' + $B + '/">Semester 1</a>'
$footOld = '<footer class="site-footer"><a href="/">Semester 1</a>'
$footNew = '<footer class="site-footer"><a href="' + $B + '/">Semester 1</a>'

function Convert-Page([string]$html) {
  $html = $html.Replace($brandOld, $brandNew).Replace($crumbOld, $crumbNew).Replace($footOld, $footNew)
  $html = $html.Replace('<script src="/semester-1/assets/feedback.js" defer></script>', '')
  $html = [regex]::Replace($html, '<details class="feedback" id="feedback">[\s\S]*?</details>', '')
  $html = $html.Replace('href="/semester-1/', 'href="' + $B + '/').Replace('src="/semester-1/', 'src="' + $B + '/')
  $html = $html.Replace('<link rel="icon" href="data:,">', '<link rel="icon" href="/assets/icon.svg" type="image/svg+xml">')
  $html = $html.Replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive">')
  return $html
}

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
$written = 0
foreach ($entry in $map.GetEnumerator()) {
  $from = Join-Path $src (($entry.Key -replace '/', '\') + '\index.html')
  if (-not (Test-Path $from)) { throw "Missing source page: $($entry.Key)" }
  $dir = if ($entry.Value) { Join-Path $out ($entry.Value -replace '/', '\') } else { $out }
  New-Item -ItemType Directory -Force $dir | Out-Null
  $html = Convert-Page ([IO.File]::ReadAllText($from, $utf8))
  [IO.File]::WriteAllText((Join-Path $dir 'index.html'), $html, $utf8)
  $written++
}

$assets = Join-Path $out 'assets'
New-Item -ItemType Directory -Force $assets | Out-Null
$css = [IO.File]::ReadAllText((Join-Path $src 'semester-1\assets\study.css'), $utf8)
$css += "`n/* Bayt Al-Fuad: the Arabic brand and breadcrumb items inside this English library. */`n" +
  ".brand[lang=""ar""], .breadcrumbs [lang=""ar""] { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif; letter-spacing: 0; text-transform: none; }`n"
[IO.File]::WriteAllText((Join-Path $assets 'study.css'), $css, $utf8)
Copy-Item (Join-Path $src 'semester-1\assets\old-links.js') $assets

# Every internal link must now stay inside Bayt Al-Fuad's paths.
$left = Get-ChildItem $out -Recurse -Filter index.html | Select-String -Pattern '(href|src|action)="/(semester-1|ma101|phy101|chemistry|english|api)\b' -AllMatches
if ($left) { $left | ForEach-Object { Write-Warning "$($_.Path): $($_.Matches[0].Value)" }; throw 'Unconverted library links remain.' }
Write-Output "Wrote $written pages and 2 assets to $out"
