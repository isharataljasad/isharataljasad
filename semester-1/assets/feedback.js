/* Optional lesson feedback. Sends the form to the same-origin /api/feedback.
 * "Received" is shown only after the server confirms the comment was stored.
 * On any failure the page says it was not sent and leaves the text in the box. */
(function () {
  var form = document.querySelector('form[data-feedback]');
  if (!form || !window.fetch) return;
  form.hidden = false;
  var status = form.querySelector('[data-status]');
  var button = form.querySelector('button[type="submit"]');
  var comment = form.querySelector('textarea[name="comment"]');
  var count = form.querySelector('[data-count]');
  var pending = false;
  var MAX = 1000;

  function length(text) { return Array.from(text).length; }
  function say(kind, text) {
    status.className = 'feedback-status' + (kind ? ' ' + kind : '');
    status.textContent = text;
  }
  function updateCount() { if (count) count.textContent = String(length(comment.value)); }
  comment.addEventListener('input', updateCount);
  updateCount();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending) return;
    var chosen = form.querySelector('input[name="category"]:checked');
    var text = comment.value.trim();
    if (!chosen) { say('error', 'Not sent: choose what kind of feedback this is.'); form.querySelector('input[name="category"]').focus(); return; }
    if (!text) { say('error', 'Not sent: write a comment first.'); comment.focus(); return; }
    if (length(text) > MAX) { say('error', 'Not sent: comments can be up to ' + MAX + ' characters.'); comment.focus(); return; }

    pending = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    say('', 'Sending…');
    var payload = {
      subject: form.elements.subject.value,
      lesson: form.elements.lesson.value,
      section: form.elements.section.value || null,
      category: chosen.value,
      comment: text
    };
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
    fetch('/api/feedback', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
    }).then(function (r) {
      if (r.res.ok && r.data && r.data.ok === true) {
        say('ok', r.data.duplicate ? 'This comment was already received. Thank you.' : 'Thank you. Your feedback was received.');
        form.reset();
        updateCount();
      } else {
        var reason = r.data && r.data.error ? ' ' + r.data.error : '';
        say('error', 'Your feedback was not sent.' + reason + ' Your text is still in the box, so you can try again or copy it.');
      }
    }).catch(function () {
      say('error', 'Your feedback was not sent because the connection failed. Your text is still in the box, so you can try again or copy it.');
    }).then(function () {
      if (timer) clearTimeout(timer);
      pending = false;
      button.disabled = false;
      button.removeAttribute('aria-busy');
    });
  });
})();
