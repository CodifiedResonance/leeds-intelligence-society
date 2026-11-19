/* Civic Papers: print, cite and copy. No tracking. */
(function () {
  'use strict';
  document.querySelectorAll('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
  var today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  document.querySelectorAll('[data-today]').forEach(function (el) { el.textContent = today; });
  document.querySelectorAll('[data-cite]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = document.getElementById(b.getAttribute('aria-controls'));
      var open = box.hidden; box.hidden = !open; b.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-copy'));
      var text = el.value !== undefined && el.tagName === 'INPUT' ? el.value : el.textContent;
      var done = function () { var n = b.parentNode.querySelector('[data-copied]'); if (n) { n.hidden = false; setTimeout(function () { n.hidden = true; }, 2500); } };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { select(el); });
      else select(el);
    });
  });
  function select(el) { if (el.select) { el.select(); return; } var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
})();
