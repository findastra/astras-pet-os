// Every pet program page spawned by the Friendly Farmer (PET-PROGRAM-FRAMEWORK.md, section 3): the paired lights,
// the live idle, awake and sad moods, the session notes that go to the backlog, export, and the chat button.
// Saved in this browser only (section 6): nothing is sent anywhere. Text goes into the page with textContent only.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
(function () {
  'use strict';
  var config = JSON.parse(document.getElementById('pet-program-data').textContent);
  var KEY = 'astras-pet-os:' + config.homeSlug;
  var STORE = config.homeSlug + '-backlog';

  function read(name, fallback) {
    try { var v = localStorage.getItem(KEY + ':' + name); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(name, value) {
    try { localStorage.setItem(KEY + ':' + name, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function el(tag, text, cls) { var n = document.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; return n; }
  // Dates on this PC's own clock (Astra's dates are local, not UTC).
  function pad(n) { return String(n).padStart(2, '0'); }
  function localDay(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function localTime(iso) { var d = new Date(iso); return localDay(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function today() { return localDay().replace(/-/g, ''); }

  // ---- The paired lights: left ON/OFF (green, red), right maintenance (blue, yellow). ----
  var lights = read('lights', {});
  function paint() {
    var buttons = document.querySelectorAll('button.light[data-item]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i], s = lights[b.dataset.item] || {}, name = b.dataset.name;
      if (b.classList.contains('onoff')) {
        b.classList.toggle('is-off', !!s.off);
        b.setAttribute('aria-pressed', s.off ? 'false' : 'true');
        b.setAttribute('aria-label', name + ': ' + (s.off ? 'off' : 'on'));
      } else {
        b.classList.toggle('is-fix', !!s.fix);
        b.setAttribute('aria-pressed', s.fix ? 'true' : 'false');
        b.setAttribute('aria-label', name + ': ' + (s.fix ? 'requires maintenance' : 'working correctly'));
      }
    }
    var names = {};
    for (var j = 0; j < buttons.length; j++) names[buttons[j].dataset.item] = buttons[j].dataset.name;
    var fix = document.getElementById('maintenance'), off = document.getElementById('switched-off');
    if (fix) {
      fix.textContent = '';
      var marked = Object.keys(lights).filter(function (k) { return lights[k].fix && names[k]; });
      if (!marked.length) fix.appendChild(el('li', 'Nothing marked yellow in this browser.', 'empty'));
      marked.forEach(function (k) { fix.appendChild(el('li', names[k] + ': requires maintenance (marked ' + (lights[k].fixed_on || 'today') + ')')); });
    }
    if (off) {
      off.textContent = '';
      Object.keys(lights).filter(function (k) { return lights[k].off && names[k]; }).forEach(function (k) { off.appendChild(el('li', names[k] + ': switched off in this browser')); });
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.light[data-item]');
    if (!b) return;
    var s = lights[b.dataset.item] || (lights[b.dataset.item] = {});
    if (b.classList.contains('onoff')) {
      if (s.off && !window.confirm('Turn ' + b.dataset.name + ' back on? After a security OFF, only you (L4) may turn it on.')) return;
      s.off = !s.off;
    } else {
      s.fix = !s.fix;
      s.fixed_on = s.fix ? localDay() : undefined;
    }
    write('lights', lights);
    paint();
  });
  paint();

  // ---- The pet's mood while this page is open: sad when it was not opened for two weeks, then idle; awake (the idle
  // face blinking) after you use the page, idle again after two quiet minutes. ----
  // Every face is already in the page; the script only shows one and hides the others (no picture address passes
  // through here).
  var den = document.querySelector('.den');
  var bubble = document.getElementById('bubble');
  function has(box, name) { return !!(box && box.querySelector('img[data-face="' + name + '"]')); }
  function face(box, name) {
    if (!box || !has(box, name)) return;
    var imgs = box.querySelectorAll('img[data-face]');
    for (var i = 0; i < imgs.length; i++) imgs[i].hidden = imgs[i].dataset.face !== name;
  }
  var opened = read('opened', null);
  var mood = opened && Date.now() - Date.parse(opened) > 14 * 864e5 && has(den, 'sad') ? 'sad' : 'idle';
  write('opened', new Date().toISOString());
  var quiet, blinker;
  function show(next) {
    mood = next;
    face(den, mood === 'sad' ? 'sad' : 'idle');
    if (bubble) bubble.textContent = config.lines[mood === 'awake' ? 'blink' : mood] || '';
    clearInterval(blinker);
    if (mood === 'awake' && has(den, 'blink')) blinker = setInterval(function () {
      face(den, 'blink'); setTimeout(function () { if (mood === 'awake') face(den, 'idle'); }, 180);
    }, 4000);
  }
  function used() {
    if (mood !== 'awake') show('awake');
    clearTimeout(quiet);
    quiet = setTimeout(function () { show('idle'); }, 120000);
  }
  ['pointerdown', 'keydown', 'input'].forEach(function (t) { document.addEventListener(t, used, { passive: true }); });
  show(mood);
  if (den && has(den, 'idle')) den.addEventListener('click', function () { if (bubble) bubble.textContent = config.reminder; }); // one click: the current reminder

  // The awake picture in the emotions panel blinks too.
  var awake = document.querySelector('.awake-faces');
  if (has(awake, 'blink')) setInterval(function () {
    face(awake, 'blink'); setTimeout(function () { face(awake, 'idle'); }, 180);
  }, 3500);

  // ---- Session notes: every submission goes to the backlog first (section 7). ----
  var backlog = read('backlog', { schema: 'pet-program-backlog-v1', store: STORE, entries: [] });
  var list = document.getElementById('backlog'), count = document.getElementById('backlog-count'), last = document.getElementById('last-entry');
  function render() {
    if (count) count.textContent = String(backlog.entries.length);
    if (last) last.textContent = backlog.entries.length ? localTime(backlog.entries[backlog.entries.length - 1].created).slice(0, 10) : 'none yet';
    if (!list) return;
    list.textContent = '';
    backlog.entries.slice().reverse().forEach(function (n) {
      var li = el('li');
      li.appendChild(el('code', n.id));
      li.appendChild(document.createTextNode(' ' + localTime(n.created) + (n.tool ? ' · about ' + n.tool : '') + ' · ' + n.status));
      if (n.text) li.appendChild(el('div', n.text));
      if (n.attachments.length) li.appendChild(el('div', 'files: ' + n.attachments.map(function (a) { return a.name; }).join(', '), 'small'));
      list.appendChild(li);
    });
  }
  var form = document.getElementById('notes'), text = document.getElementById('note-text'), files = document.getElementById('note-file'), about = document.getElementById('note-about'), fileNote = document.getElementById('note-files');
  if (files) files.addEventListener('change', function () {
    fileNote.textContent = files.files.length ? 'Adding: ' + Array.prototype.map.call(files.files, function (f) { return f.name; }).join(', ') : '';
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var attachments = Array.prototype.map.call(files.files || [], function (f) { return { name: f.name, type: f.type, size: f.size }; });
    if (!text.value.trim() && !attachments.length) { text.focus(); return; }
    var stamp = today(), n = backlog.entries.filter(function (x) { return x.id.indexOf('-backlog-' + stamp + '-') > -1; }).length + 1;
    backlog.entries.push({
      id: config.homeSlug + '-v1.0-backlog-' + stamp + '-' + String(n).padStart(3, '0'),
      created: new Date().toISOString(), author: 'you',
      kind: attachments.some(function (a) { return /^image\//.test(a.type); }) ? 'screenshot' : 'note',
      tool: about && about.value ? about.value : null, text: text.value.trim(), attachments: attachments, status: 'new', run: null,
    });
    if (!write('backlog', backlog)) { window.alert('This browser would not save the note (storage is full or blocked). Copy it somewhere safe.'); backlog.entries.pop(); return; }
    text.value = ''; files.value = ''; fileNote.textContent = 'Saved to ' + STORE + '.';
    render();
  });
  var exportButton = document.getElementById('export');
  if (exportButton) exportButton.addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(backlog, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = STORE + '-' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  render();

  // ---- The chat button: opens the panel that says the chat bot is not connected yet. ----
  var chat = document.getElementById('chat-open'), panel = document.getElementById('chat-panel');
  if (chat && panel) chat.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    chat.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
  });

  // ---- API Fairy's key requests (only on API Fairy Ring's page; Astra, 2026-10-19). ----
  // Who asked for a key, who has one, who doesn't, each with a link back to where it asked. The real list stays on
  // Astra's PC: API Fairy writes it (names only, never a key) to one fixed file in her Documents folder, and this page
  // reads that file only when it is opened there (a double-clicked file, or a preview served on this PC). Anywhere else
  // it shows the page's made-up examples. Every word goes in with textContent; only https links become links.
  var requestBox = document.getElementById('key-requests');
  if (requestBox) {
    // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents.
    var LOCAL_REQUESTS = "../../../../Astra's PetOS Data/api-fairy-ring/key-requests-page-data.js";
    var source = document.getElementById('key-requests-source');
    var onThisPC = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    var KEY_GROUPS = ['waiting', 'has-key', 'declined'];
    var groupOf = { waiting: 1, 'has-key': 1, declined: 1 };
    var https = function (u) { try { return new URL(u).protocol === 'https:' ? new URL(u).href : null; } catch (e) { return null; } };
    var linkText = function (href) {
      var u = new URL(href), p = u.pathname.split('/').filter(Boolean);
      if (u.hostname === 'github.com' && p.length >= 4 && p[2] === 'pull') return p[1] + ' pull request #' + p[3];
      if (u.hostname === 'github.com' && p.length >= 4 && p[2] === 'issues') return p[1] + ' issue #' + p[3];
      var card = p.indexOf('handoffs');
      if (u.hostname === 'github.com' && card > -1 && p[card + 1]) return p[1] + ' card ' + p[card + 1].slice(0, 3);
      if (u.hostname === 'github.com' && p.length >= 5 && p[2] === 'blob') return p[1] + ' ' + p.slice(4).join('/');
      if (u.hostname === 'github.com' && p.length >= 2) return p[1] + (p.length > 2 ? ' (' + p[p.length - 1] + ')' : ' on GitHub');
      if (/(^|\.)claude\.ai$/.test(u.hostname)) return 'the Claude chat';
      return u.hostname;
    };
    var line = function (parent, label, text, cls) {
      if (!text) return;
      var d = el('div', null, cls || 'small');
      if (label) d.appendChild(el('span', label + ' ', 'request-label'));
      d.appendChild(document.createTextNode(text));
      parent.appendChild(d);
    };
    var seen = function (r) {
      if (r.found === 'yes') return 'found ' + (r.key_name || 'it') + ' in ' + (r.found_in || 'a place she watches') + '.';
      if (r.found === 'no') return 'no key named ' + r.key_name + ' in ' + (r.where_words || 'the places she watches') + ' yet.';
      return r.found_in || 'not checked yet.';
    };
    var row = function (r) {
      var li = el('li', null, 'request' + (r.example ? ' example' : ''));
      var head = el('div', null, 'request-head');
      var who = r.requester || {};
      var item = 'request:' + r.id, name = (who.name || 'someone') + ' key request';
      var pair = el('span', null, 'lights');
      ['onoff', 'care'].forEach(function (kind) {
        var b = el('button', null, 'light ' + kind);
        b.type = 'button';
        b.dataset.item = item; b.dataset.name = name;
        b.title = kind === 'onoff' ? 'ON/OFF (kill switch): green on, red off' : 'Maintenance: blue working correctly, yellow requires maintenance';
        b.setAttribute('aria-label', name + (kind === 'onoff' ? ': on' : ': working correctly'));
        pair.appendChild(b);
      });
      head.appendChild(pair);
      head.appendChild(el('b', who.name || 'someone'));
      var about = [who.kind, who.pet].filter(Boolean).join(' · ');
      if (about) head.appendChild(el('span', ' (' + about + ')', 'small'));
      if (r.example) head.appendChild(el('span', 'EXAMPLE', 'tag example-tag'));
      li.appendChild(head);
      var href = https(r.link);
      var where = el('div', null, 'request-link');
      if (href) {
        var a = el('a', (r.group === 'waiting' ? '✨ ' : '') + linkText(href));
        a.href = href; a.rel = 'noopener'; a.target = '_blank';
        where.appendChild(document.createTextNode('asked in '));
        where.appendChild(a);
      } else if (r.asked_in) where.appendChild(document.createTextNode((r.group === 'waiting' ? '✨ ' : '') + 'asked in ' + r.asked_in));
      li.appendChild(where);
      var more = (Array.isArray(r.also) ? r.also : []).map(https).filter(Boolean);
      if (more.length) {
        var also = el('div', 'also: ', 'small');
        more.forEach(function (h, i) {
          var b = el('a', linkText(h)); b.href = h; b.rel = 'noopener'; b.target = '_blank';
          if (i) also.appendChild(document.createTextNode(' · '));
          also.appendChild(b);
        });
        li.appendChild(also);
      }
      var key = el('div', null, 'request-key');
      key.appendChild(el('code', r.key_name || 'no key name yet'));
      key.appendChild(document.createTextNode(' · ' + (r.provider || 'provider not chosen') + (r.where_words ? ' · goes in ' + r.where_words : '')));
      li.appendChild(key);
      line(li, 'for:', r.for);
      line(li, 'spend limit:', r.spend_limit || 'none named');
      line(li, 'asked:', r.asked + (r.status !== 'requested' && r.status ? ' · ' + r.status + (r.status_date ? ' ' + r.status_date : '') : ''));
      line(li, 'API Fairy:', seen(r) + (r.fairy_note ? ' ' + r.fairy_note : ''));
      if (r.note) line(li, null, r.note, 'request-note');
      return li;
    };
    var show = function (requests, message, problems) {
      source.textContent = message;
      KEY_GROUPS.forEach(function (g) {
        var list = requestBox.querySelector('ul[data-group="' + g + '"]');
        var empty = requestBox.querySelector('[data-empty="' + g + '"]');
        var count = requestBox.querySelector('[data-count="' + g + '"]');
        var mine = requests.filter(function (r) { return r && r.group === g; });
        list.textContent = '';
        mine.forEach(function (r) { list.appendChild(row(r)); });
        empty.hidden = mine.length > 0;
        count.textContent = mine.length ? mine.length + (mine.length === 1 ? ' request' : ' requests') : '';
      });
      if (problems && problems.length) {
        var p = el('ul', null, 'plain small request-problems');
        problems.forEach(function (t) { p.appendChild(el('li', 'Skipped ' + t)); });
        source.appendChild(p);
      }
      paint();
    };
    var examples = function (why) {
      var list = [];
      try { list = JSON.parse(document.getElementById('key-request-examples').textContent); } catch (e) { list = []; }
      show(list, why);
    };
    if (onThisPC) {
      var script = document.createElement('script');
      script.setAttribute('src', LOCAL_REQUESTS);
      script.onload = function () {
        var d = window.apiFairyKeyRequests;
        if (!d || d.schema !== 'api-fairy-key-requests-page-v1' || !Array.isArray(d.requests)) return examples('API Fairy\'s list on this PC is not one this page can read. These are made-up examples.');
        var rows = d.requests.filter(function (r) { return r && groupOf[r.group]; });
        show(rows, 'API Fairy\'s list on this PC: ' + rows.length + (rows.length === 1 ? ' request' : ' requests') + ', ' + (d.scanned ? 'checked by name ' : 'listed without looking for the keys ') + localTime(d.checked) + '.', d.problems);
      };
      script.onerror = function () { examples('API Fairy has not written her list on this PC yet (open API Fairy, or run API Fairy.exe --key-requests). These are made-up examples.'); };
      document.head.appendChild(script);
    } else {
      examples('Made-up examples. The real list stays on Astra\'s PC and shows here only when this page is opened there.');
    }
  }
})();
