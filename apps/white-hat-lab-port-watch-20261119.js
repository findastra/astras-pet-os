// White Hat Lab's port-watch-tool: every port open on this PC as a labeled row; click one to read who is connected
// right now, from where, the last peers seen, and how to close it. Inside its tool box on White Hat Lab's pet program
// page, or on its own. It reads only the page data White Hat Weasel's port watch writes on this PC
// (window.whiteHatLabPortWatch, schema white-hat-lab-port-watch-v1) and builds the page with textContent only.
// Astra, 2026-11-19: "I want to be able to click on a port, labeled, and I can read info about the latest traffic."
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-19.
(function () {
  'use strict';
  // The farm's own copy sits in Documents\Astra's PetOS\astras-pet-os; a branch worktree in Astra's PetOS Data\worktrees.
  var SOURCES = ["../../../Astra's PetOS Data/white-hat-lab/port-watch-page-data-20261119.js", '../../../white-hat-lab/port-watch-page-data-20261119.js'];
  var SCHEMA = 'white-hat-lab-port-watch-v1';
  var REFRESH_MS = 60000;
  var box = document.querySelector('[data-watch]');
  var checkedLine = document.querySelector('[data-checked]');
  // Which ports are open and the filter survive a reload (this tab only; a convenience, nothing depends on it).
  var KEEP = 'white-hat-lab-port-watch-view';
  var open = {};      // port -> shown
  var filter = 'all';
  var last = null;
  try { var kept = JSON.parse(sessionStorage.getItem(KEEP) || 'null'); if (kept) { open = kept.open || {}; filter = kept.filter || 'all'; } } catch (e) { /* storage off */ }
  function keep() { try { sessionStorage.setItem(KEEP, JSON.stringify({ open: open, filter: filter })); } catch (e) { /* storage off */ } }

  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (inTool) document.documentElement.classList.add('in-tool');
  function tell() {
    if (!inTool) return;
    try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.documentElement.scrollHeight) }, '*'); } catch (e) { /* no page around it */ }
  }
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function tag(kind, text) { return el('span', 'tag ' + kind, text); }
  function ago(iso) {
    var t = Date.parse(iso); if (!t) return 'unknown';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60); if (h < 48) return h + ' h ago';
    return Math.round(h / 24) + ' days ago';
  }
  function when(iso) { var t = Date.parse(iso); return t ? new Date(t).toLocaleString() : 'unknown'; }

  var KINDS = { petos: 'Our own (PetOS)', preview: 'Chat previews', app: 'Apps', windows: 'Windows' };
  var FILTERS = [['all', 'All'], ['left', 'Left over'], ['petos', KINDS.petos], ['preview', KINDS.preview], ['app', KINDS.app], ['windows', KINDS.windows], ['network', 'Reachable from other devices'], ['busy', 'Someone connected']];
  function shown(p) {
    if (filter === 'all') return true;
    if (filter === 'left') return p.leftover;
    if (filter === 'network') return p.reach !== 'this-pc';
    if (filter === 'busy') return (p.connections || []).length > 0;
    return p.kind === filter;
  }
  function reachTag(p) { return p.reach === 'this-pc' ? tag('ok', 'This PC only') : p.reach === 'tailscale' ? tag('check', 'Tailscale') : tag('net', 'Home network'); }

  function detail(p) {
    var d = el('div', 'detail');
    add(d, el('h3', null, 'What it is'),
      el('p', null, p.label + (p.pet ? ' · looked after by ' + p.pet : '')),
      el('p', 'meta', 'Program: ' + p.program + ' (process ' + p.pid + ')' + (p.started ? ' · started ' + ago(p.started) : '')));
    if (p.command) { var c = el('p'); c.appendChild(el('code', null, p.command)); d.appendChild(c); }
    add(d, el('h3', null, 'Who can reach it'), el('p', null, p.reach_words + ' (listening on ' + (p.addresses || []).join(', ') + ')'));
    if (p.reach !== 'this-pc') d.appendChild(el('p', 'meta', 'Other devices can reach it only if Windows Firewall lets them; your router forwards nothing in from the internet (port check, 2026-11-17).'));

    d.appendChild(el('h3', null, 'Connected right now'));
    var now = p.connections || [];
    if (!now.length) d.appendChild(el('p', 'empty', 'Nobody at this look.'));
    else {
      var t = el('table'), hr = el('tr'); ['From', 'Where', 'State'].forEach(function (h) { hr.appendChild(el('th', null, h)); }); t.appendChild(hr);
      now.forEach(function (x) { var r = el('tr'); add(r, el('td', null, x.from), el('td', null, x.where), el('td', null, x.state)); t.appendChild(r); });
      d.appendChild(t);
    }
    var outs = Object.keys(p.talks_out || {});
    if (outs.length) d.appendChild(el('p', 'meta', 'The program itself is also talking out to: ' + outs.map(function (k) { return p.talks_out[k] + ' × ' + k; }).join(', ') + '.'));

    d.appendChild(el('h3', null, 'Last seen connecting'));
    var peers = p.peers || [];
    if (!peers.length) d.appendChild(el('p', 'empty', 'Nobody seen yet since the watch started.'));
    else {
      var t2 = el('table'), h2 = el('tr'); ['From', 'Where', 'First seen', 'Last seen'].forEach(function (h) { h2.appendChild(el('th', null, h)); }); t2.appendChild(h2);
      peers.forEach(function (x) { var r = el('tr'); add(r, el('td', null, x.from), el('td', null, x.where), el('td', null, when(x.first)), el('td', null, ago(x.last))); t2.appendChild(r); });
      d.appendChild(t2);
    }

    d.appendChild(el('h3', null, 'Closing it'));
    if (p.closable) d.appendChild(el('p', 'how', (p.leftover ? 'This looks left over: a chat’s preview open for more than two hours. ' : '') + 'To close it, right-click Startup Star → White Hat Weasel → Close ' + p.port + '. The Weasel stops nothing by himself.'));
    else d.appendChild(el('p', 'how', p.kind === 'windows' ? 'Part of Windows: leave it open.' : 'Not one of our own servers, so the Weasel never closes it. Quit ' + p.label + ' itself if you don’t need it.'));
    return d;
  }

  function row(p) {
    var wrap = el('div', 'port' + (p.leftover ? ' left' : ''));
    var b = el('button'); b.type = 'button'; b.setAttribute('aria-expanded', open[p.port] ? 'true' : 'false');
    var name = el('span', 'name', p.label); name.appendChild(el('small', null, p.program + ' · ' + KINDS[p.kind]));
    var tags = el('span');
    if (p.leftover) tags.appendChild(tag('you', 'Left over'));
    if ((p.connections || []).length) tags.appendChild(tag('dim', p.connections.length + ' connected'));
    tags.appendChild(reachTag(p));
    add(b, el('span', 'num', String(p.port)), name, tags);
    b.addEventListener('click', function () { open[p.port] = !open[p.port]; keep(); draw(last); });
    wrap.appendChild(b);
    if (open[p.port]) wrap.appendChild(detail(p));
    return wrap;
  }

  function draw(d) {
    last = d;
    box.textContent = '';
    if (!d || d.schema !== SCHEMA) {
      var s = el('section', 'box'); add(s, el('h2', null, 'Port watch'),
        el('p', null, 'The port list is private: it shows only on Astra’s PC, where White Hat Weasel’s port watch writes it every 10 minutes. It is never on GitHub.'));
      box.appendChild(s); if (checkedLine) checkedLine.textContent = ''; tell(); return;
    }
    if (checkedLine) checkedLine.textContent = 'Last look ' + ago(d.checked) + ', every ' + d.every_minutes + ' minutes.';
    var a = d.ask;
    if (a && a.ports && a.ports.length) {
      var ask = el('section', 'box ask');
      add(ask, el('h2', null, 'White Hat Weasel asks: can I close ' + (a.ports.length === 1 ? 'this one?' : 'some of these?')),
        el('p', null, a.ports.length + ' port' + (a.ports.length === 1 ? '' : 's') + ' look left over: ' + a.ports.join(', ') + '. Click one below to see what it is. To close it: right-click Startup Star → White Hat Weasel → Close <port>.'),
        el('p', 'meta', 'Asked ' + ago(a.asked) + '. He asks once a day and never closes anything himself.'));
      box.appendChild(ask);
    }
    var list = el('section', 'box');
    var ports = d.ports || [];
    var counts = { left: 0, network: 0, busy: 0 };
    ports.forEach(function (p) { if (p.leftover) counts.left++; if (p.reach !== 'this-pc') counts.network++; if ((p.connections || []).length) counts.busy++; counts[p.kind] = (counts[p.kind] || 0) + 1; });
    add(list, el('h2', null, ports.length + ' ports open on this PC'), el('p', 'meta', 'Click a port to read what it is, who is connected and how to close it.'));
    var chips = el('div', 'chips');
    FILTERS.forEach(function (f) {
      var n = f[0] === 'all' ? ports.length : counts[f[0]] || 0;
      var c = el('button', null, f[1] + ' (' + n + ')'); c.type = 'button'; c.setAttribute('aria-pressed', filter === f[0] ? 'true' : 'false');
      c.addEventListener('click', function () { filter = f[0]; keep(); draw(last); });
      chips.appendChild(c);
    });
    list.appendChild(chips);
    var rows = el('div', 'ports');
    ports.filter(shown).forEach(function (p) { rows.appendChild(row(p)); });
    if (!rows.children.length) rows.appendChild(el('p', 'empty', 'No ports in this group right now.'));
    list.appendChild(rows);
    list.appendChild(el('p', 'meta', d.how || ''));
    box.appendChild(list);
    tell();
  }

  function load(i) {
    i = i || 0;
    if (i >= SOURCES.length) { if (!last) draw(null); return; }
    var s = document.createElement('script');
    s.src = SOURCES[i] + '?t=' + Date.now();
    s.onload = function () { s.remove(); if (window.whiteHatLabPortWatch && window.whiteHatLabPortWatch.schema === SCHEMA) draw(window.whiteHatLabPortWatch); else load(i + 1); };
    s.onerror = function () { s.remove(); load(i + 1); };
    document.head.appendChild(s);
  }
  load();
  setInterval(function () { load(); }, REFRESH_MS);
  window.addEventListener('load', tell);
})();
