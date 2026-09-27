/* Old Book / Pearson / Educator links. The page lists where every part of the old
 * collection now lives; each list item carries the old anchor id. This script only
 * follows that list: a link such as /ma101/book/#lesson-07 opens the lesson that now
 * holds the note, and a link without a fragment opens the subject contents. Without
 * JavaScript the same list is readable and clickable. */
(function () {
  var id = '';
  try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { id = ''; }
  var item = id ? document.getElementById(id) : null;
  var link = item ? item.querySelector('a[href]') : document.querySelector('.subject-heading a.button');
  if (link) location.replace(link.getAttribute('href'));
})();
