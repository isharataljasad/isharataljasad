/* Local static preview that mirrors vercel.json: `cleanUrls`, `trailingSlash:false`,
   the redirects and the response headers (including the Content-Security-Policy),
   and serves only the files that .vercelignore lets through. Local checks therefore
   exercise the same URLs, old-link redirects and script rules students get.
   Review/development only: it does not run the access gate in middleware.js. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { deployedFiles } from '../test/lib/deployed.mjs';
import { handle as feedback } from '../api/feedback.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 4178);
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
const deployed = deployedFiles(ROOT);
const headers = Object.fromEntries(vercel.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key, h.value]));
// '/(.+)' matches every path except the entrance '/' (search-engine policy).
const nonRoot = Object.fromEntries((vercel.headers.find((h) => h.source === '/(.+)')?.headers ?? []).map((h) => [h.key, h.value]));
const headersFor = (pathname) => (pathname === '/' ? headers : { ...headers, ...nonRoot });
function redirectFor(pathname) {
  for (const r of vercel.redirects) {
    const [prefix, param] = r.source.split('/:');
    if (!param ? pathname === r.source : param.endsWith('+') ? pathname.startsWith(prefix + '/') && pathname.length > prefix.length + 1 : pathname === prefix || pathname.startsWith(prefix + '/')) return r.destination;
  }
  return null;
}

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
  const query = new URL(request.url, 'http://localhost').search;
  if (pathname.length > 1 && pathname.endsWith('/')) { response.writeHead(308, { location: pathname.slice(0, -1) + query }).end(); return; }
  // The feedback function, as Vercel would run it. Storage comes from this process's
  // environment (KV_REST_API_URL / KV_REST_API_TOKEN); without it the endpoint fails closed.
  if (pathname === '/api/feedback') {
    let body = ''; for await (const chunk of request) body += chunk;
    const init = { method: request.method, headers: request.headers };
    if (!['GET', 'HEAD'].includes(request.method)) init.body = body;
    const res = await feedback(new Request(`http://127.0.0.1:${PORT}${request.url}`, init));
    response.writeHead(res.status, { ...headers, ...Object.fromEntries(res.headers) });
    response.end(Buffer.from(await res.arrayBuffer()));
    return;
  }
  const to = redirectFor(pathname);
  if (to) { response.writeHead(307, { location: to }).end(); return; }
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

  const relative = file ? file.slice(ROOT.replace(/[\\/]$/, '').length + 1).split(sep).join('/') : '';
  if (!file || !deployed.has(relative)) {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><meta charset="utf-8"><h1>404</h1><p>Page not found.</p>');
    return;
  }

  response.writeHead(200, {
    ...headersFor(pathname),
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  response.end(await readFile(file));
}).listen(PORT, '127.0.0.1', () => console.log('preview on http://127.0.0.1:' + PORT + '/'));
