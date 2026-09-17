const stream = document.body.dataset.stream;

for (const section of document.querySelectorAll(stream === 'book' ? '.unit' : '.lesson')) {
  if (!section.id || section.closest('.unit')?.id === 'decision-index-for-rapid-review') continue;
  const control = document.createElement('div');
  control.className = 'review-control';
  control.innerHTML = '<span>YOUR REVIEW</span><button type="button" data-mark="understood">Understood</button><button type="button" data-mark="review">Review again</button>';
  const key = `biology-program:${stream}:${section.id}`;
  const buttons = [...control.querySelectorAll('button')];
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const sync = () => { const state = read(); for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.mark === state)); };
  for (const button of buttons) button.addEventListener('click', () => {
    const next = read() === button.dataset.mark ? '' : button.dataset.mark;
    try { if (next) localStorage.setItem(key, next); else localStorage.removeItem(key); } catch { /* browser storage unavailable */ }
    sync();
  });
  sync();
  section.append(control);
}

const backToTop = document.querySelector('.top-button');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const update = () => backToTop.classList.toggle('visible', window.scrollY > 750);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

let closedBeforePrint = [];
window.addEventListener('beforeprint', () => {
  closedBeforePrint = [...document.querySelectorAll('details.answer:not([open])')];
  for (const answer of closedBeforePrint) answer.open = true;
});
window.addEventListener('afterprint', () => {
  for (const answer of closedBeforePrint) answer.open = false;
  closedBeforePrint = [];
});
