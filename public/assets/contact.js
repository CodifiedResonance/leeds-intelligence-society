/* Contact the author: prefill from the paper a reader came from, and send to Formspree. No tracking. */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var paper = $('c-paper'), purpose = $('c-purpose'), type = $('c-type'), cited = $('cited-field');
  var err = form.querySelector('.form-error'), btn = $('c-submit'), label = btn.innerHTML;

  // ?paper=water preselects the paper; ?purpose=cite preselects "cited".
  var q = new URLSearchParams(location.search);
  var p = q.get('paper');
  if (p) Array.prototype.forEach.call(paper.options, function (o) { if (o.getAttribute('data-paper') === p) paper.value = o.value; });
  if (q.get('purpose') === 'cite') purpose.value = 'Tell you where we have cited a paper';
  if (q.get('purpose') === 'briefing') purpose.value = 'Request a briefing';

  function sync() {
    cited.hidden = purpose.value !== 'Tell you where we have cited a paper';
    $('subject').value = 'Contact: ' + (purpose.value || 'Enquiry') + (type.value ? ' (' + type.value + ')' : '') + ' re ' + paper.value;
  }
  [paper, purpose, type].forEach(function (el) { el.addEventListener('change', sync); });
  sync();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (el) { return !el.checkValidity(); });
    if (missing.length) {
      err.textContent = 'Please complete: ' + missing.map(function (el) { return form.querySelector('label[for="' + el.id + '"]').childNodes[0].textContent.trim(); }).join(', ') + '.';
      err.hidden = false; missing[0].focus(); return;
    }
    if (/YOUR_CONTACT_FORM_ID/.test(form.action)) { err.textContent = 'This form is not connected yet. Add the Formspree endpoint in contact/index.html.'; err.hidden = false; return; }
    if (form.querySelector('[name=_gotcha]').value) return;
    sync();
    btn.disabled = true; btn.innerHTML = 'Sending…';
    var data = new FormData(form);
    data.append('submitted_at', new Date().toISOString());
    data.append('came_from', document.referrer || 'direct');
    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok) throw new Error(json && json.errors && json.errors.length ? json.errors.map(function (x) { return x.message; }).join(' ') : 'Your message could not be sent.');
        });
      })
      .then(function () { form.hidden = true; $('contact-done').hidden = false; $('contact-done').focus(); })
      .catch(function (x) { err.textContent = (x && x.message ? x.message : 'Something went wrong.') + ' Please try again.'; err.hidden = false; })
      .then(function () { btn.disabled = false; btn.innerHTML = label; });
  });
})();
