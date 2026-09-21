/* vercel.json sets cleanUrls:true and trailingSlash:false, so `/a/b` is the
   canonical URL for both `a/b.html` and `a/b/index.html`. When both exist the
   server can only serve one of them, and the other page becomes unreachable.
   That happened with the CE 201 lesson: `program/lessons/material-balances.html`
   (an unstyled source fragment) shadowed the built page in the same folder.

   This test walks the tree that actually gets deployed and fails on any such
   pair, and on any published page that is missing the document basics. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');

/* Kept in step with .vercelignore plus paths Vercel never serves. */
const NOT_DEPLOYED = new Set(['node_modules', '.git', '.github', '.claude', 'test', 'security', 'docs', 'source', 'tools']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (NOT_DEPLOYED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = walk(root);
assert.ok(pages.length > 100, `Expected the published site, found ${pages.length} pages`);

const collisions = [];
for (const file of pages) {
  if (path.basename(file) === 'index.html') continue;
  // `foo.html` collides with `foo/index.html` under cleanUrls.
  const sibling = path.join(file.slice(0, -'.html'.length), 'index.html');
  if (fs.existsSync(sibling)) collisions.push(path.relative(root, file));
}
assert.deepEqual(collisions, [], `Two files claim one clean URL:\n  ${collisions.join('\n  ')}`);

/* A deployed .html file is a page a student can land on, so it needs the
   document basics. Source fragments belong under a source/ folder instead. */
const incomplete = [];
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const missing = [
    /<!doctype html>/i.test(html) ? '' : 'doctype',
    /<html[^>]*\slang=/i.test(html) ? '' : 'lang',
    /<meta[^>]+charset=/i.test(html) ? '' : 'charset',
    /<title>[^<]+<\/title>/i.test(html) ? '' : 'title',
    /name="viewport"/i.test(html) ? '' : 'viewport',
  ].filter(Boolean);
  if (missing.length) incomplete.push(`${path.relative(root, file)} (missing ${missing.join(', ')})`);
}
assert.deepEqual(incomplete, [], `Deployed pages are not complete documents:\n  ${incomplete.join('\n  ')}`);

/* Tables scroll sideways on a phone; a keyboard reader has to be able to
   reach that scroll container or the overflowing columns are unreadable. */
const unreachable = [];
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [wrapper] of html.matchAll(/<div class="(?:reading|model)-table-wrap"[^>]*>/g)) {
    if (!/tabindex="0"/.test(wrapper)) unreachable.push(`${path.relative(root, file)}: ${wrapper}`);
  }
}
assert.deepEqual(unreachable, [], `Scrollable tables are not keyboard reachable:\n  ${unreachable.join('\n  ')}`);

/* trailingSlash:false means a page stored at a/b/index.html is served at "/a/b",
   so a relative asset path on it resolves against "/a/" -- one level above the
   folder holding the file. chemistry/atomic loaded "./engine.js" this way and
   landed on /chemistry/engine.js in production while working locally. */
const misresolved = [];
for (const file of pages) {
  const rel = file.slice(root.length).split(path.sep).join('/');
  const servedUrl = rel.endsWith('/index.html') ? (rel.slice(0, -'/index.html'.length) || '/') : rel.slice(0, -'.html'.length);
  for (const [, raw] of fs.readFileSync(file, 'utf8').matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:|\/)/i.test(raw)) continue;
    const target = raw.split('#')[0].split('?')[0];
    if (!target) continue;
    const landing = new URL(target, 'http://x' + servedUrl).pathname;
    const base = path.join(root, landing);
    const exists = [base, base + '.html', path.join(base, 'index.html')]
      .some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    if (!exists) misresolved.push(`${rel} served at ${servedUrl}: "${raw}" -> ${landing} (missing)`);
  }
}
assert.deepEqual(misresolved, [], `Relative paths break at the canonical URL:\n  ${misresolved.join('\n  ')}`);

/* Every inline <script>/<style> that ships must be covered by a sha256 in the
   Content-Security-Policy. A local preview applies no CSP, so an edited inline
   block keeps working here and is silently blocked in production instead. */
const csp = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
  .headers.find((h) => h.source === '/(.*)')
  .headers.find((h) => h.key === 'Content-Security-Policy').value;
const allowedFor = (kind) => {
  const directive = csp.split(';').map(s => s.trim()).find(s => s.startsWith(kind + '-src ')) || '';
  return new Set([...directive.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(m => m[1]));
};

const unhashed = [];
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const blocks = [
    ...[...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => ['script', m[1]]),
    ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => ['style', m[1]]),
  ];
  for (const [kind, body] of blocks) {
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    if (!allowedFor(kind).has(digest)) unhashed.push(`${path.relative(root, file)} (${kind}-src sha256-${digest})`);
  }
}
assert.deepEqual(unhashed, [], `Inline code is not allow-listed in the CSP:\n  ${unhashed.join('\n  ')}`);

console.log(`Routing: ${pages.length} deployed pages, no clean-URL collisions, complete documents, keyboard-reachable tables, CSP hashes current.`);
