// White Hat Lab's tool page: the port-check-tool inside its tool box on White Hat Lab's pet program page
// (?tool=port-check), or on its own. It reads only the page data White Hat Weasel writes on this PC
// (window.whiteHatLabPortCheck, schema white-hat-lab-port-check-v1) and builds the page with textContent only.
// Astra, 2026-11-17: "lets squish port spider and make it a tool of the weasel"; "port assessment must be first".
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-17.
(function () {
  'use strict';
  var LOCAL = "../../../Astra's PetOS Data/white-hat-lab/port-check-page-data-20261117.js";
  var SCHEMA = 'white-hat-lab-port-check-v1';
  var box = document.querySelector('[data-tools]');
  var checkedLine = document.querySelector('[data-checked]');

  // ---- inside its tool box: no background or header of its own, and the box is told how tall it is ----
  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (inTool) document.documentElement.classList.add('in-tool');
  function tell() {
    if (!inTool) return;
    try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.documentElement.scrollHeight) }, '*'); } catch (e) { /* no page around it */ }
  }
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);

  // ---- small builders (textContent only) ----
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  var TAGS = { ok: 'OK', check: 'Check', you: 'You', admin: 'Admin' };
  function tag(kind, text) { return el('span', 'tag ' + (kind === 'admin' ? 'you' : kind || 'check'), text || TAGS[kind] || kind); }
  function link(href, text) { var a = el('a', null, text); a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; }
  function list(items, ordered, each) { var l = el(ordered ? 'ol' : 'ul'); (items || []).forEach(function (x) { l.appendChild(each(x)); }); return l; }
  function section(title, cls) { var s = el('section', 'box' + (cls ? ' ' + cls : '')); if (title) s.appendChild(el('h2', null, title)); return s; }

  function draw(d) {
    box.textContent = '';
    if (!d || d.schema !== SCHEMA) {
      var s = section('Port assessment');
      add(s, el('p', null, 'The port assessment is private: it shows here only on Astra’s PC, read from White Hat Weasel’s own folder. The reports stay in a private repo.'),
        el('p', 'meta', 'Newest port check: 2026-11-17.'));
      box.appendChild(s); tell(); return;
    }
    if (checkedLine) checkedLine.textContent = 'Checked ' + d.checked + '.';

    var top = section(d.title || 'Port assessment');
    add(top, add(el('p', 'verdict'), tag(d.verdict_kind || 'ok', d.verdict_tag), document.createTextNode(d.verdict)));
    (d.summary || []).forEach(function (p) { top.appendChild(el('p', null, p)); });
    var how = el('p', 'meta', d.how + ' ');
    if (d.report) how.appendChild(link(d.report, 'Full report'));
    top.appendChild(how);
    box.appendChild(top);

    var dev = section('Devices on the network');
    var wrap = el('div', 'scroll'); var t = el('table'); var hr = el('tr');
    ['Address', 'Device', 'Open (of ' + (d.ports_tested || '?') + ')', 'Assessment'].forEach(function (h) { hr.appendChild(el('th', null, h)); });
    t.appendChild(hr);
    (d.devices || []).forEach(function (x) {
      var tr = el('tr');
      add(tr, add(el('td'), el('code', null, x.address)), el('td', null, x.device), el('td', null, x.open),
        add(el('td'), tag(x.kind), document.createTextNode(x.note)));
      t.appendChild(tr);
    });
    wrap.appendChild(t); dev.appendChild(wrap); box.appendChild(dev);

    var grid = el('div', 'grid');
    var todo = section('What to do');
    todo.appendChild(list(d.todo, true, function (x) { return add(el('li'), tag(x.who), document.createTextNode(x.text)); }));
    var pc = section('This PC’s listeners');
    (d.this_pc || []).forEach(function (p) { pc.appendChild(el('p', null, p)); });
    var not = section('Not checked yet');
    not.appendChild(list(d.not_checked, false, function (x) { return el('li', null, x); }));
    add(grid, todo, pc, not);
    box.appendChild(grid);
    tell();
  }

  function load() {
    var s = document.createElement('script');
    s.src = LOCAL + '?t=' + Date.now();
    s.onload = function () { draw(window.whiteHatLabPortCheck); s.remove(); };
    s.onerror = function () { draw(null); s.remove(); };
    document.head.appendChild(s);
  }
  load();
  window.addEventListener('load', tell);
})();
