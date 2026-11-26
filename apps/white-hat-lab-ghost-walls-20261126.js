// White Hat Lab's ghost-in-the-walls-tool: every device that got onto the guest network, newest first, with who is on
// now, first and last seen and how many visits. Inside its tool box on White Hat Lab's pet program page, or on its own.
// It reads only the page data White Hat Weasel's Ghost In The Walls watch writes on this PC
// (window.whiteHatLabGhostWalls, schema white-hat-lab-ghost-walls-v1) and builds the page with textContent only.
// Astra, 2026-11-26: "Yes, add it" (the guest list on White Hat Lab's page). Claude Opus 5.5 (claude-opus-5-5), 2026-11-26.
(function () {
  'use strict';
  // The farm's own copy sits in Documents\Astra's PetOS\astras-pet-os; a branch worktree in Astra's PetOS Data\worktrees.
  var SOURCES = ["../../../Astra's PetOS Data/white-hat-lab/ghost-walls-page-data-20261126.js", '../../../white-hat-lab/ghost-walls-page-data-20261126.js'];
  var SCHEMA = 'white-hat-lab-ghost-walls-v1';
  var REFRESH_MS = 60000;
  var box = document.querySelector('[data-watch]');
  var checkedLine = document.querySelector('[data-checked]');
  var last = null;

  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (inTool) document.documentElement.classList.add('in-tool');
  function tell() {
    if (!inTool) return;
    try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '*'); } catch (e) { /* no page around it */ }
  }
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function ago(iso) {
    var t = Date.parse(iso); if (!t) return 'unknown';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60); if (h < 48) return h + ' h ago';
    return Math.round(h / 24) + ' days ago';
  }
  function when(iso) { var t = Date.parse(iso); return t ? new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'unknown'; }
  function stat(n, words) { var s = el('span', n ? null : 'zero'); add(s, el('b', null, String(n)), document.createTextNode(words)); return s; }

  function draw(d) {
    last = d;
    box.textContent = '';
    if (!d || d.schema !== SCHEMA) {
      var p = el('section', 'box'); add(p, el('h2', null, 'Ghost In The Walls'),
        el('p', null, 'The guest list is private: it shows only on Astra’s PC, where White Hat Weasel’s Ghost In The Walls watch writes it every 30 minutes. It is never on GitHub.'));
      box.appendChild(p); if (checkedLine) checkedLine.textContent = ''; tell(); return;
    }
    if (checkedLine) checkedLine.textContent = 'Last look ' + ago(d.checked) + ', every ' + d.every_minutes + ' minutes.';
    var devices = d.devices || [];
    var s = el('section', 'box');
    var today = devices.filter(function (x) { return Date.now() - Date.parse(x.last_seen) < 864e5; }).length;
    add(s, el('h2', null, 'Who got onto Ghost In The Walls'),
      add(el('div', 'now'), stat(d.guests_now || 0, d.guests_now === 1 ? ' on now' : ' on now'), stat(today, ' in the last day'), stat(devices.length, ' seen in all')));
    if (d.last && d.last !== 'ok') s.appendChild(el('p', 'warn', 'The last look did not get through: ' + d.last + ' The list below is from the look before; nobody was marked as gone.'));
    if (!devices.length) s.appendChild(el('p', 'empty', 'Nobody has gotten in yet.'));
    else {
      var wrap = el('div', 'list'), t = el('table'), hr = el('tr');
      [['Device'], ['Now'], ['Band', 'hide-narrow'], ['Visits'], ['First seen', 'hide-narrow'], ['Last seen']].forEach(function (h) { hr.appendChild(el('th', h[1] || null, h[0])); });
      t.appendChild(hr);
      devices.forEach(function (x) {
        var r = el('tr', x.on_now ? 'on' : null);
        var name = el('td'); name.appendChild(document.createTextNode(x.name || 'No name given'));
        var id = el('div', 'meta'); id.appendChild(el('code', null, (x.mac || '') + (x.ip ? '  ' + x.ip : ''))); name.appendChild(id);
        var now = el('td'); now.appendChild(x.on_now ? el('span', 'tag ok', 'On now') : el('span', 'tag dim', 'Gone'));
        add(r, name, now, el('td', 'hide-narrow', x.band || ''), el('td', null, String(x.visits || 1)), el('td', 'hide-narrow', when(x.first_seen)), el('td', null, x.on_now ? 'now' : ago(x.last_seen)));
        t.appendChild(r);
      });
      wrap.appendChild(t); s.appendChild(wrap);
    }
    add(s, el('p', 'how', 'Your router does not record wrong passwords, so this is everyone who got in: a visit starts when a device shows up and ends when it is gone at a look. Phones use a private address per network, so the same phone keeps the same address here.'),
      el('p', 'meta', 'Read only, every ' + d.every_minutes + ' minutes; skipped while you are signed in at tplinkwifi.net. The full log of joins and leaves is ghost-walls-log-20261126.txt in Astra’s PetOS Data\\white-hat-lab.'));
    box.appendChild(s);
    tell();
  }

  function load(i) {
    i = i || 0;
    if (i >= SOURCES.length) { if (!last) draw(null); return; }
    var s = document.createElement('script');
    s.src = SOURCES[i] + '?t=' + Date.now();
    s.onload = function () { s.remove(); if (window.whiteHatLabGhostWalls && window.whiteHatLabGhostWalls.schema === SCHEMA) draw(window.whiteHatLabGhostWalls); else load(i + 1); };
    s.onerror = function () { s.remove(); load(i + 1); };
    document.head.appendChild(s);
  }
  load();
  setInterval(function () { load(); }, REFRESH_MS);
  window.addEventListener('load', tell);
})();
