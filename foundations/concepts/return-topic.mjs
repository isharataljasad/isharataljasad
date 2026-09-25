/* Carry a safe return route across foundation explanations and practice. */
export function safeTopic(value, origin) {
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || !/^\/(?:semester-1|ma101|phy101|chemistry)\/[a-z0-9/-]*$/i.test(url.pathname)) return null;
    return url.pathname + url.hash;
  } catch { return null; }
}
if (typeof document !== 'undefined') {
  const requested = new URLSearchParams(location.search).get('from');
  const from = safeTopic(requested || document.referrer, location.origin);
  if (from) {
    const link = document.createElement('a');
    link.href = from;
    link.className = 'back';
    link.textContent = '← Return to your science topic';
    const row = document.createElement('p');
    row.append(link);
    document.querySelector('main')?.prepend(row);
    for (const anchor of document.querySelectorAll('a[href]')) {
      const url = new URL(anchor.href, location.origin);
      if (url.origin === location.origin && url.pathname.startsWith('/foundations/')) {
        url.searchParams.set('from', from);
        anchor.href = url.pathname + url.search + url.hash;
      }
    }
  }
}
