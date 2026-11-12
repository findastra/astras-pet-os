// The Pilot Plant's tool page: one program's live preview inside its pill on The Pilot Plant's pet program page
// (?tool=<id>), or every program when opened on its own. GeoGebra, the Natural Number Game and WebPlotDigitizer run
// right here from their own sites. Everything else comes from the page data The Pilot Plant's look writes on this PC
// (window.pilotPlantTools, schema the-pilot-plant-tools-v1); the page is built with textContent only.
// Astra, 2026-11-06: "all recommended" (the PC Master Race way); 2026-11-12: "Yes, build it".
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.
(function () {
  'use strict';
  var LOCAL = "../../../Astra's PetOS Data/the-pilot-plant/pilot-plant-page-data.js";
  var SCHEMA = 'the-pilot-plant-tools-v1';
  var STALE_MS = 30 * 60 * 1000;
  var wanted = (new URLSearchParams(location.search).get('tool') || '').toLowerCase();
  var box = document.querySelector('[data-tools]');
  var lookedLine = document.querySelector('[data-looked]');

  // ---- inside its pill: no background or header of its own, and the pill is told how tall it is ----
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
  function para(text, cls) { return el('p', cls || null, text); }
  function chip(text, kind) { return el('span', 'chip' + (kind ? ' ' + kind : ''), text); }
  function use(text) { return el('p', 'use', text); }
  function when(iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? iso : d.toLocaleString(); }
  function link(href, text) { var a = el('a', null, text); a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; }
  function table(head, rows, off) {
    var t = el('table'); var tr = el('tr');
    head.forEach(function (h) { tr.appendChild(el('th', null, h)); }); t.appendChild(tr);
    rows.forEach(function (r) { var row = el('tr', off && off(r) ? 'off' : null); r.cells.forEach(function (c) { row.appendChild(el('td', null, c == null ? '' : String(c))); }); t.appendChild(row); });
    return t;
  }
  function frame(src, title) {
    var f = el('iframe', 'frame'); f.src = src; f.title = title;
    f.referrerPolicy = 'no-referrer';
    var p = el('p', 'sub'); p.appendChild(document.createTextNode('Running from its own site. ')); p.appendChild(link(src, 'Open it on its own'));
    return [f, p];
  }

  // ---- the header every installed program shares: on this PC or not, version, who signed it, running ----
  function status(t) {
    var c = el('div', 'chips');
    if (!t) { c.appendChild(chip('not in the last look', 'no')); return c; }
    c.appendChild(t.installed ? chip('on this PC', 'ok') : chip('not on this PC yet', 'no'));
    if (t.version) c.appendChild(chip('version ' + t.version));
    if (t.installed) {
      if (t.signed === true) c.appendChild(chip('signed by ' + (t.signer || 'its maker'), 'ok'));
      else if (t.unsigned) c.appendChild(chip('not signed', 'no'));
      else if (t.signed === false) c.appendChild(chip('signature not valid', 'bad'));
    }
    if (t.running) c.appendChild(chip('running now', 'run'));
    return c;
  }
  function notYet(t, what) { return t && t.installed ? null : para('Not on this PC yet. ' + what + ' It waits for your OK to download it.', 'note'); }
  function files(list, label) {
    if (list == null) return para('Everything is not running, so your ' + label + ' could not be listed.', 'empty');
    if (!list.length) return para('No ' + label + ' found on this PC yet.', 'empty');
    return table(['File', 'Folder', 'Changed'], list.map(function (f) { return { cells: [f.name, f.folder, when(f.modified)] }; }));
  }

  var D = null; // the last look, or null
  function T(id) { return D && D.tools ? D.tools[id] : null; }

  var VIEWS = {
    look: { title: 'The Pilot Plant’s look', local: true, render: function () {
      var tools = (D && D.tools) || {}, ids = Object.keys(tools);
      return [para('Last look: ' + when(D.looked) + '. It reads only: never installs, changes or opens your files, and never writes a Jupyter token or a Zotero key.'),
        table(['Program', 'On this PC', 'Version', 'Signed by'], ids.map(function (k) { var t = tools[k]; return { cells: [t.name, t.web ? 'runs in the page' : t.installed ? 'yes' : 'not yet', t.version || '', t.signer || (t.unsigned ? 'not signed' : '')], t: t }; }), function (r) { return r.t.installed === false; }),
        D.everything ? null : para('Everything is not running, so recent flowsheets and notebooks are not listed.', 'note')];
    } },
    dwsim: { title: 'DWSIM', local: true, render: function () {
      var t = T('dwsim');
      return [status(t), notYet(t, 'DWSIM 9.0.5 (GPL 3, by Daniel Medeiros), 273 MB from its GitHub release.'),
        use('A process simulator: draw a flowsheet of streams and unit operations (pumps, heat exchangers, columns, reactors) and it solves the mass and energy balances with real thermodynamics. Home and learning only, never work files.'),
        el('h3', null, 'Your newest flowsheets'), files(t && t.flowsheets, 'flowsheets')];
    } },
    qalculate: { title: 'Qalculate!', local: true, render: function () {
      var t = T('qalculate'), out = [status(t), notYet(t, 'Qalculate! 5.13.2 (GPL 2, by Hanna Knutsson), 63 MB from its GitHub release.'),
        use('A calculator that understands units: type “5 bar × 2 m³ to kJ” or “80 °F to K” and it converts as it goes. It also does algebra, constants and uncertainty.')];
      if (t && t.history && t.history.length) { out.push(el('h3', null, 'Your last calculations')); out.push(table(['Line'], t.history.map(function (h) { return { cells: [h] }; }))); }
      else if (t && t.installed) out.push(para('No saved history yet.', 'empty'));
      return out;
    } },
    jupyterlab: { title: 'Jupyter', local: true, render: function () {
      var t = T('jupyterlab'), out = [status(t), notYet(t, 'Python 3.13.17 (PSF licence), 29 MB from python.org, in its own folder (your Store Python stays as it is); then JupyterLab, NumPy, SymPy and Matplotlib from PyPI.'),
        use('Notebooks for working things out: NumPy for the numbers, SymPy for the algebra and calculus, Matplotlib for the plots. Python Jungle shows this pill too.')];
      var p = t && t.packages;
      if (p) out.push(table(['Package', 'Version'], ['jupyterlab', 'numpy', 'sympy', 'matplotlib'].map(function (k) { return { cells: [k, p[k] || 'not installed'], miss: !p[k] }; }), function (r) { return r.miss; }));
      if (t && t.servers && t.servers.length) t.servers.forEach(function (s) { var a = 'http://127.0.0.1:' + s.port + '/lab'; var q = el('p'); q.appendChild(document.createTextNode('JupyterLab is running' + (s.root ? ' in ' + s.root : '') + ': ')); q.appendChild(link(a, 'open it')); out.push(q); });
      else if (p && p.jupyterlab) out.push(para('JupyterLab is not running now.', 'empty'));
      out.push(el('h3', null, 'Your newest notebooks')); out.push(files(t && t.notebooks, 'notebooks'));
      return out;
    } },
    geogebra: { title: 'GeoGebra', render: function () {
      return [use('Graph functions, solve equations and do geometry, right here. Free for non-commercial use; nothing is installed.')].concat(frame('https://www.geogebra.org/calculator', 'GeoGebra calculator'));
    } },
    'natural-number-game': { title: 'Natural Number Game', render: function () {
      return [use('Prove facts about numbers, starting from 0 and “the next number”, in the Lean proof assistant: a game of small levels. Your progress stays in this browser; the game can export it to a file.')].concat(frame('https://adam.math.hhu.de/#/g/leanprover-community/nng4', 'Natural Number Game'));
    } },
    zotero: { title: 'Zotero', local: true, render: function () {
      var t = T('zotero'), out = [status(t), notYet(t, 'Zotero 10.0.8 (AGPL 3, by the Corporation for Digital Scholarship), 104 MB from zotero.org.'),
        use('Your paper library: save articles and books with one click, add notes and cite them. AI Doghouse shows this pill too, next to its research library.')];
      if (t && t.note) out.push(para(t.note, 'note'));
      if (t && t.api === 'on') {
        out.push(para((t.total != null ? t.total + ' items in your library. ' : '') + 'Newest:'));
        out.push(table(['Title', 'Kind', 'Year'], (t.recent || []).map(function (r) { return { cells: [r.title, r.kind, r.year] }; })));
      }
      return out;
    } },
    webplotdigitizer: { title: 'WebPlotDigitizer', render: function () {
      return [use('Pull the numbers back out of a chart picture: load the image, click the axes, then the curve. Version 4, open source (AGPL 3); version 5 is closed source and not used.')].concat(frame('https://apps.automeris.io/wpd4/', 'WebPlotDigitizer 4'));
    } },
  };
  var ORDER = ['look', 'dwsim', 'qalculate', 'jupyterlab', 'geogebra', 'natural-number-game', 'zotero', 'webplotdigitizer'];

  // ---- drawing ----
  function draw() {
    box.textContent = '';
    var ok = D && D.schema === SCHEMA;
    if (lookedLine) lookedLine.textContent = ok ? 'Last look: ' + when(D.looked) + '.' : '';
    var ids = wanted && VIEWS[wanted] ? [wanted] : ORDER;
    ids.forEach(function (id) {
      var v = VIEWS[id]; var sec = el('section', 'tool');
      if (!inTool) sec.appendChild(el('h2', null, v.title));
      var parts;
      if (v.local && !ok) parts = [para('Nothing to show here: this box shows your PC only when The Pilot Plant’s pet program page is opened on that PC, after its look has run.', 'empty')];
      else { try { parts = v.render() || []; } catch (e) { parts = [el('p', 'note', 'This box could not draw: ' + e.message)]; } }
      parts.forEach(function (n) { if (n) sec.appendChild(n); });
      if (ok && v.local && Date.now() - new Date(D.looked).getTime() > STALE_MS) sec.insertBefore(el('p', 'note', 'This look is from ' + when(D.looked) + ': The Pilot Plant’s watch may not be running.'), sec.firstChild);
      box.appendChild(sec);
    });
    tell();
  }

  var drawnWeb = false;
  function load() {
    // A pill that only runs a site needs no look, and is drawn once so the site is not reloaded every minute.
    if (wanted && VIEWS[wanted] && !VIEWS[wanted].local) { if (!drawnWeb) { drawnWeb = true; draw(); } return; }
    var s = document.createElement('script');
    s.src = LOCAL + '?t=' + Date.now();
    s.onload = function () { D = window.pilotPlantTools || null; draw(); s.remove(); };
    s.onerror = function () { D = null; draw(); s.remove(); };
    document.head.appendChild(s);
  }
  load();
  setInterval(load, 60000);
  window.addEventListener('load', tell);
})();
