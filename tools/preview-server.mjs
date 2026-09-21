/* Local static preview that mirrors the Vercel `cleanUrls` + `trailingSlash:false`
   behaviour in vercel.json, so local checks exercise the same URLs students use.
   Review/development only: it does not run the access gate in middleware.js. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 4178);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

async function firstFile(candidates) {
  for (const c of candidates) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch { /* try next */ }
  }
  return null;
}

createServer(async (request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  // Block traversal: the resolved path must stay inside ROOT.
  const base = join(ROOT, normalize(pathname));
  if (base !== ROOT.replace(/[\\/]$/, '') && !base.startsWith(ROOT.replace(/[\\/]$/, '') + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  const file = await firstFile([
    ...(extname(base) ? [base] : []),
    base + '.html',
    join(base, 'index.html')
  ]);

  if (!file) {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><meta charset="utf-8"><h1>404</h1><p>Page not found.</p>');
    return;
  }

  response.writeHead(200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  response.end(await readFile(file));
}).listen(PORT, '127.0.0.1', () => console.log('preview on http://127.0.0.1:' + PORT + '/'));
