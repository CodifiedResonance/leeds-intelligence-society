/* Leeds Intelligence Society: forms and sharing. No tracking, no cookies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* ---- Tabs: Join / Support ---- */
  var forms = { join: $('#form-join'), support: $('#form-support') };
  var success = $('#form-success');
  var current = 'join';

  function show(kind, updateHash) {
    current = kind;
    $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tab') === kind ? 'true' : 'false'); });
    forms.join.hidden = kind !== 'join';
    forms.support.hidden = kind !== 'support';
    success.hidden = true;
    if (updateHash && history.replaceState) history.replaceState(null, '', kind === 'join' ? '#join' : '#support-form');
  }
  $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-tab'), true); }); });
  $$('[data-open="support"]').forEach(function (a) { a.addEventListener('click', function () { show('support', false); }); });
  function fromHash() { if (location.hash === '#support-form') show('support'); else if (location.hash === '#join') show('join'); }
  window.addEventListener('hashchange', fromHash); fromHash();

  /* ---- Submission to Formspree ---- */
  var COPY = {
    join: { title: "You're on the list.", body: "We'll be in touch with the first gathering's date and venue as soon as they're confirmed.", note: 'No ticket is needed yet.' },
    support: { title: 'Thank you for stepping forward.', body: "Your offer has reached the organiser. We'll reply to the email address you gave.", note: 'Nothing is committed until we have talked.' }
  };

  Object.keys(forms).forEach(function (kind) {
    var form = forms[kind];
    var btn = $('button[type=submit]', form);
    var label = btn.innerHTML;
    var err = $('.form-error', form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      if (/YOUR_(JOIN|SUPPORT)_FORM_ID/.test(form.action)) {
        err.textContent = 'This form is not connected yet. Add the Formspree endpoint in index.html.';
        err.hidden = false; return;
      }
      if ($('[name=_gotcha]', form).value) return;
      btn.disabled = true; btn.innerHTML = 'Sending your details… <span aria-hidden="true">↗</span>';
      var data = new FormData(form);
      data.append('submitted_at', new Date().toISOString());
      data.append('page', location.href.split('#')[0]);

      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            if (!res.ok) {
              var msg = json && json.errors && json.errors.length ? json.errors.map(function (x) { return x.message; }).join(' ') : 'Your details could not be sent.';
              throw new Error(msg);
            }
          });
        })
        .then(function () {
          form.reset();
          form.hidden = true;
          $('#success-title').textContent = COPY[kind].title;
          $('#success-body').textContent = COPY[kind].body;
          $('#success-note').textContent = COPY[kind].note;
          success.hidden = false; success.focus();
        })
        .catch(function (x) {
          err.textContent = (x && x.message ? x.message : 'Something went wrong.') + ' Please check your connection and try again.';
          err.hidden = false;
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });
  $('#success-back').addEventListener('click', function () { show(current, false); $('input[name=name]', forms[current]).focus(); });

  /* ---- Share ---- */
  var share = $('#share'), fallback = $('#share-fallback');
  if (share) share.addEventListener('click', function () {
    var data = { title: 'Leeds Intelligence Society', text: 'A free society for people building with AI. Side by side. In Leeds.', url: 'https://leedsintelligencesociety.com/' };
    var done = function () { share.textContent = 'Link copied ✓'; };
    var fail = function () { fallback.hidden = false; fallback.focus(); fallback.select(); };
    if (navigator.share) { navigator.share(data).catch(function (e) { if (!e || e.name !== 'AbortError') fail(); }); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(data.url).then(done, fail); }
    else fail();
  });
})();
