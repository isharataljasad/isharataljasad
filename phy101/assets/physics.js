const stream = document.body.dataset.stream;
const lessons = [...document.querySelectorAll('.physics-lesson')];
const keyFor = lesson => `physics101:${stream}:${lesson.id}`;
const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { if (value) localStorage.setItem(key, value); else localStorage.removeItem(key); } catch { /* Storage may be unavailable. */ } };

function updateProgress() {
  const count = lessons.filter(lesson => read(keyFor(lesson)) === 'understood').length;
  const output = document.getElementById('progress-count');
  if (output) output.textContent = String(count);
}

for (const lesson of lessons) {
  const control = document.createElement('div');
  control.className = 'review-control';
  control.innerHTML = '<span>YOUR REVIEW</span><button type="button" data-mark="understood">Understood</button><button type="button" data-mark="review">Review again</button>';
  const buttons = [...control.querySelectorAll('button')];
  const sync = () => {
    const current = read(keyFor(lesson));
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.mark === current));
    updateProgress();
  };
  for (const button of buttons) button.addEventListener('click', () => {
    const value = read(keyFor(lesson)) === button.dataset.mark ? '' : button.dataset.mark;
    write(keyFor(lesson), value);
    sync();
  });
  sync();
  lesson.append(control);
}

const search = document.getElementById('lesson-search');
if (search) search.addEventListener('input', () => {
  const term = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const lesson of lessons) {
    const show = !term || lesson.querySelector('h3').textContent.toLocaleLowerCase().includes(term) || lesson.closest('.unit').querySelector('h2').textContent.toLocaleLowerCase().includes(term);
    lesson.hidden = !show;
    if (show) visible++;
  }
  for (const unit of document.querySelectorAll('.unit:not(.index-unit):not(.appendix)')) unit.hidden = ![...unit.querySelectorAll('.physics-lesson')].some(lesson => !lesson.hidden);
  document.getElementById('search-status').textContent = term ? `${visible} of ${lessons.length} lessons shown` : '';
});

const topButton = document.querySelector('.top-button');
if (topButton) {
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const update = () => topButton.classList.toggle('visible', window.scrollY > 750);
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
