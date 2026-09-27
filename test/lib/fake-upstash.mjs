/* A minimal in-memory stand-in for the Upstash Redis REST pipeline API, for tests only.
 * It is NOT a feedback destination: nothing survives the process. */
import http from 'node:http';

export function createStore() {
  const data = new Map(), expiry = new Map();
  let failing = false;
  const alive = (k) => { const t = expiry.get(k); if (t && t <= Date.now()) { data.delete(k); expiry.delete(k); } return data.has(k); };
  function run([cmd, ...args]) {
    switch (String(cmd).toUpperCase()) {
      case 'INCR': { const k = args[0]; const v = (alive(k) ? Number(data.get(k)) : 0) + 1; data.set(k, String(v)); return v; }
      case 'EXPIRE': { if (!alive(args[0])) return 0; expiry.set(args[0], Date.now() + Number(args[1]) * 1000); return 1; }
      case 'SET': {
        const [k, v, ...opts] = args; const up = opts.map((o) => String(o).toUpperCase());
        if (up.includes('NX') && alive(k)) return null;
        data.set(k, v); expiry.delete(k);
        const ex = up.indexOf('EX'); if (ex >= 0) expiry.set(k, Date.now() + Number(opts[ex + 1]) * 1000);
        return 'OK';
      }
      case 'GET': return alive(args[0]) ? data.get(args[0]) : null;
      case 'DEL': { let n = 0; for (const k of args) if (data.delete(k)) n++; return n; }
      case 'KEYS': { const re = new RegExp('^' + String(args[0]).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'); return [...data.keys()].filter((k) => alive(k) && re.test(k)); }
      default: throw new Error(`unsupported ${cmd}`);
    }
  }
  return {
    data, run,
    setFailing(v) { failing = v; },
    records(prefix) { return [...data.keys()].filter((k) => k.startsWith(prefix) && !/:rate:|:recent:/.test(k)).map((k) => JSON.parse(data.get(k))); },
    /** A fetch implementation for the pipeline endpoint, checking the bearer token. */
    fetchFor(token) {
      return async (url, init) => {
        if (failing) return new Response('unavailable', { status: 503 });
        if (!String(url).endsWith('/pipeline') || init.headers.authorization !== `Bearer ${token}`) return new Response('{"error":"unauthorized"}', { status: 401 });
        const out = JSON.parse(init.body).map((c) => { try { return { result: run(c) }; } catch (e) { return { error: e.message }; } });
        return new Response(JSON.stringify(out), { status: 200, headers: { 'content-type': 'application/json' } });
      };
    },
  };
}

/** Serve the stand-in over local HTTP (for the browser test's preview server). */
export function serve(store, token) {
  const f = store.fetchFor(token);
  const server = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const r = await f(`http://x${req.url}`, { headers: { authorization: req.headers.authorization }, body });
    res.writeHead(r.status, { 'content-type': 'application/json' }); res.end(await r.text());
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` })));
}
