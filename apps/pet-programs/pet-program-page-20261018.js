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

  // ---- The paired lights: left ON/OFF (green, red), right working correctly or requires maintenance (blue, yellow).
  // Each click moves a light to its next state, and a bubble says what that state means (Astra, 2026-10-19). Something
  // not built yet starts grey: not set yet. Marks saved before 2026-10-19 (`off`, `fix`) still count. ----
  var lights = read('lights', {});
  function power(k, planned) { var s = lights[k] || {}; return s.power || (s.off ? 'off' : (planned ? '' : 'on')); }
  function health(k, planned) { var s = lights[k] || {}; return s.health || (s.fix ? 'fix' : (planned ? '' : 'ok')); }
  var SAYS = {
    on: 'on. Click again to switch it off.',
    off: 'off (the kill switch). Turning it back on asks you first.',
    ok: 'working correctly. Click again if it is broken.',
    fix: 'requires maintenance. It is listed under "Requires maintenance" in L4.',
  };
  function paint() {
    var buttons = document.querySelectorAll('button.light[data-item]'), names = {}, planned = {};
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i], k = b.dataset.item, name = b.dataset.name;
      names[k] = name; planned[k] = !!b.dataset.planned;
      if (b.classList.contains('onoff')) {
        var p = power(k, planned[k]);
        b.classList.toggle('is-off', p === 'off');
        b.classList.toggle('is-unset', !p);
        b.setAttribute('aria-pressed', p === 'on' ? 'true' : 'false');
        b.setAttribute('aria-label', name + ': ' + (p === 'on' ? 'on' : p === 'off' ? 'off' : 'not set yet'));
      } else {
        var h = health(k, planned[k]);
        b.classList.toggle('is-fix', h === 'fix');
        b.classList.toggle('is-unset', !h);
        b.setAttribute('aria-pressed', h === 'fix' ? 'true' : 'false');
        b.setAttribute('aria-label', name + ': ' + (h === 'ok' ? 'working correctly' : h === 'fix' ? 'requires maintenance' : 'not checked yet'));
      }
    }
    var fix = document.getElementById('maintenance'), off = document.getElementById('switched-off');
    if (fix) {
      fix.textContent = '';
      var marked = Object.keys(names).filter(function (k) { return health(k, planned[k]) === 'fix'; });
      if (!marked.length) fix.appendChild(el('li', 'Nothing marked yellow in this browser.', 'empty'));
      marked.forEach(function (k) { fix.appendChild(el('li', names[k] + ': requires maintenance (marked ' + (lights[k].fixed_on || 'today') + ')')); });
    }
    if (off) {
      off.textContent = '';
      Object.keys(names).filter(function (k) { return power(k, planned[k]) === 'off'; }).forEach(function (k) { off.appendChild(el('li', names[k] + ': switched off in this browser')); });
    }
  }
  // The bubble that says what a light now means. One for the page, placed under the light that was clicked.
  var tip = el('div', null, 'light-bubble'), tipTimer;
  tip.setAttribute('role', 'status');
  tip.hidden = true;
  document.body.appendChild(tip);
  function say(b, text) {
    tip.textContent = b.dataset.name + ': ' + text;
    tip.hidden = false;
    var r = b.getBoundingClientRect(), width = document.documentElement.clientWidth;
    tip.style.left = (window.scrollX + Math.max(8, Math.min(r.left - 8, width - tip.offsetWidth - 8))) + 'px';
    tip.style.top = (window.scrollY + r.bottom + 8) + 'px';
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { tip.hidden = true; }, 4000);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.light[data-item]');
    if (!b) return;
    e.preventDefault();
    var k = b.dataset.item, planned = !!b.dataset.planned, next;
    var s = lights[k] || (lights[k] = {});
    if (b.classList.contains('onoff')) {
      var p = power(k, planned);
      if (p === 'off' && !window.confirm('Turn ' + b.dataset.name + ' back on? After a security OFF, only you (L4) may turn it on.')) return;
      next = p === 'on' ? 'off' : 'on';
      s.power = next; delete s.off;
    } else {
      next = health(k, planned) === 'ok' ? 'fix' : 'ok';
      s.health = next; delete s.fix;
      s.fixed_on = next === 'fix' ? localDay() : undefined;
    }
    write('lights', lights);
    paint();
    say(b, SAYS[next]);
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

  // The awake picture in the emotions tool panel blinks too.
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
})();
