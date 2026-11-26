// The Flash Audit on The Farm's page (Astra, 2026-11-08: "each of those shows up as a tool and I can click it and it
// will go through ... all the other pet programs"; deck "The Farm: art and lights", "All recommended", answer 4: A).
// Each check shows the last saved run at once. Run asks the Flash Audit helper on this PC
// (scripts/flash-audit-helper-20261108.mjs, started by Startup Star) to check every pet program again; the newest run
// it writes replaces the pills' results. The helper answers only on this PC (127.0.0.1), and this file asks it only from
// a page this PC serves. Words go in with textContent only. Claude Opus 5.5 (claude-opus-5-5), 2026-11-08.
(function () {
  'use strict';
  var list = document.querySelector('.flash-checks');
  if (!list) return;
  // Where the helper answers comes from the file it writes when it starts, so no published file names a local address.
  var HELPER = null;
  // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents, as the program lights do.
  var FOLDER = "../../../../Astra's PetOS Data/astras-pet-os/flash-audit/";
  var DATA = FOLDER + 'flash-audit-page-data.js', HELPER_DATA = FOLDER + 'flash-audit-helper-page-data.js';
  var STATUSES = ['Missing', 'Incorrect', 'Not verified', 'On a branch'];
  var words = window.PetOSWords;
  function T(s) { return words ? words.swap(s) : s; }
  function served() { return /^https?:$/.test(location.protocol) && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname); }
  function onThisPC() { return location.protocol === 'file:' || served(); }
  function el(tag, text, cls) { var n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; }
  function say(id, text) { var s = list.querySelector('[data-flash-status="' + id + '"]'); if (s) s.textContent = T(text); }
  function day(d) { return /^\d{8}$/.test(d || '') ? d.slice(0, 4) + '-' + d.slice(4, 6) + '-' + d.slice(6) : (d || ''); }

  // The same sums as checkResults in scripts/flash-audit-checks-20261108.mjs.
  function results(pets, id) {
    var audited = pets.filter(function (p) { return p && p.audited; }), findings = [], failing = {};
    audited.forEach(function (p) {
      (p.rows || []).forEach(function (r) {
        if (r && r.check === id && r.status !== 'Pass') { findings.push({ pet: String(p.icon || p.repo), status: String(r.status), detail: String(r.detail || '') }); failing[p.repo] = true; }
      });
    });
    var counts = {};
    STATUSES.forEach(function (s) { counts[s] = findings.filter(function (f) { return f.status === s; }).length; });
    return { audited: audited.length, passing: audited.filter(function (p) { return !failing[p.repo]; }).length, findings: findings, counts: counts };
  }

  // The newest run on this PC replaces the page's own, unless the page's is newer.
  function render(data) {
    if (!data || !Array.isArray(data.pets) || !/^\d{8}$/.test(data.date || '')) return;
    var shown = (list.getAttribute('data-flash-run-date') || '').replace(/-/g, '');
    if (shown && shown > data.date) return;
    var run = day(data.date);
    list.setAttribute('data-flash-run-date', run);
    // The tool box's top line names the run's date too (Astra, 2026-11-09: "Yes, fix them").
    var shownDate = list.parentNode && list.parentNode.querySelector('[data-flash-run-shown]');
    if (shownDate) shownDate.textContent = run;
    var pills = list.querySelectorAll('li.flash-check');
    for (var i = 0; i < pills.length; i++) {
      var li = pills[i], id = li.getAttribute('data-check'), body = li.querySelector('.pill-body');
      if (!body || !li.querySelector('[data-flash-run]')) continue; // the auditor does not run this check by itself
      var res = results(data.pets, id);
      var desc = li.querySelector('[data-flash-desc]');
      if (desc) desc.textContent = desc.textContent.replace(/·[^·]*$/, '· ' + T(res.findings.length ? (res.audited - res.passing) + ' of ' + res.audited + ' pet programs need work' : 'all ' + res.audited + ' pet programs pass'));
      var counts = STATUSES.filter(function (s) { return res.counts[s]; }).map(function (s) { return res.counts[s] + ' ' + s.toLowerCase(); }).join(' · ');
      var summary = body.querySelector('[data-flash-summary]');
      if (!summary) { summary = el('p', null, 'small'); summary.setAttribute('data-flash-summary', ''); body.insertBefore(summary, body.firstChild); }
      summary.textContent = T('Last run ' + run + ': ' + res.passing + ' of ' + res.audited + ' pass' + (counts ? ' · ' + counts : '') + '.');
      var next;
      if (res.findings.length) {
        next = el('ul', null, 'flash-findings');
        res.findings.forEach(function (f) {
          var item = el('li');
          item.appendChild(el('b', f.pet));
          item.appendChild(document.createTextNode(' '));
          item.appendChild(el('span', f.status, 'tag'));
          item.appendChild(document.createTextNode(' ' + f.detail));
          next.appendChild(item);
        });
      } else next = el('p', T('Every pet program passes.'), 'empty');
      next.setAttribute('data-flash-findings', '');
      var old = body.querySelector('[data-flash-findings]');
      if (old) old.parentNode.replaceChild(next, old); else summary.parentNode.insertBefore(next, summary.nextSibling);
    }
  }

  function loadLocal() {
    if (!onThisPC()) return;
    var script = document.createElement('script');
    script.setAttribute('src', DATA + '?t=' + Date.now());
    script.onload = function () { script.remove(); render(window.flashAuditLedger); };
    script.onerror = function () { script.remove(); };
    document.head.appendChild(script);
  }
  loadLocal();

  // The helper's address on this PC, read again before each run (it may have started since the page opened).
  function findHelper(then) {
    var script = document.createElement('script');
    script.setAttribute('src', HELPER_DATA + '?t=' + Date.now());
    script.onload = function () {
      script.remove();
      var c = window.flashAuditHelper && window.flashAuditHelper.control;
      HELPER = typeof c === 'string' && /^http:\/\/(127\.0\.0\.1|localhost):\d{2,5}$/.test(c) ? c : null;
      then();
    };
    script.onerror = function () { script.remove(); HELPER = null; then(); };
    document.head.appendChild(script);
  }
  function notRunning(id, button) {
    button.disabled = false;
    say(id, 'The Flash Audit helper is not running on this PC. Startup Star starts it at sign-in; its menu has Flash Audit, Start.');
  }

  function finished(id, button) {
    fetch(HELPER + '/status').then(function (r) { return r.json(); }).then(function (s) {
      if (s.running) { setTimeout(function () { finished(id, button); }, 5000); return; }
      button.disabled = false;
      say(id, s.exit === 0 && !s.error ? 'Done: every pet program checked again (' + day(s.date) + ').' : 'The run stopped: ' + (s.error || 'see flash-audit-helper.log in Astra’s PetOS Data'));
      loadLocal();
    }).catch(function () { button.disabled = false; say(id, 'The Flash Audit helper stopped answering.'); });
  }

  document.addEventListener('click', function (e) {
    var button = e.target.closest && e.target.closest('[data-flash-run]');
    if (!button || !list.contains(button)) return;
    var id = button.getAttribute('data-flash-run');
    if (!served()) { say(id, 'Run works on a page this PC serves (an address starting with localhost or 127.0.0.1). Here the check shows the last run.'); return; }
    button.disabled = true;
    findHelper(function () {
      if (!HELPER) { notRunning(id, button); return; }
      // How long a run takes comes from the page (RUN_MINUTES in scripts/flash-audit-checks-20261108.mjs).
      var minutes = /^\d{1,3}$/.test(list.getAttribute('data-flash-run-minutes') || '') ? list.getAttribute('data-flash-run-minutes') : '20';
      say(id, 'Checking every pet program again… This takes about ' + minutes + ' minutes. You can close this page: the run keeps going, and every check shows it when it is done or when you open the page again.');
      fetch(HELPER + '/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ check: id }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.ok && !j.running) throw new Error(j.error || 'refused');
          finished(id, button);
        })
        .catch(function () { notRunning(id, button); });
    });
  });
})();
