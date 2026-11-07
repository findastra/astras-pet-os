// Every pet program page spawned by the Friendly Farmer (PET-PROGRAM-FRAMEWORK.md, section 3): the paired lights,
// the live idle, awake and sad moods, the session notes that go to the backlog, export, the pet moving into its
// cyberhome, the L4 activity light and the chat window. In developer mode (the installer's switch, or a page's words
// switch) the agent is already home in its avatar panel, and one click on it says what it does.
// Saved in this browser only (section 6): the page sends nothing itself. Text goes into the page with textContent only.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18; cyberhome arrival, activity lights and chat window 2026-10-19;
// developer mode 2026-10-19.
(function () {
  'use strict';
  var config = JSON.parse(document.getElementById('pet-program-data').textContent);
  var KEY = 'astras-pet-os:' + config.homeSlug;
  var STORE = config.homeSlug + '-backlog';
  // Developer mode (Astra, 2026-10-19): developer-words-20261019.js, loaded in <head>, says which words this page uses
  // and swaps the words of what this script writes. There are no desktop pets in developer mode.
  var words = window.PetOSWords, dev = !!(words && words.developer);
  function T(s) { return words ? words.swap(s) : s; }

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

  // ---- The title fits on one line between the cyberhome and the System Map box, the version to its right (Astra,
  // 2026-10-20: "make that size of the title varying and have to fit between the two boxes"): the name gets smaller,
  // down to 20px. Still too long, the version goes on its own line below the name (Astra, 2026-10-21: "these always
  // stay together on one line until too collapsed, version line then goes below"), and the name, always one line
  // ("ALWAYS 1 LINE"), gets smaller again, down to 14px; past that it is cut with "…" and the whole name shows when you
  // point at it. Again whenever the window changes size, and after the page's words are swapped (developer mode makes
  // a name longer). ----
  var heading = document.querySelector('.title h1');
  var header = document.querySelector('.top'), titleBox = document.querySelector('.top > .title');
  function shrink(name, floor) {
    var size = parseFloat(window.getComputedStyle(heading).fontSize);
    function over() { return heading.scrollWidth > heading.clientWidth || (name && name.scrollWidth > name.clientWidth + 1); }
    while (over() && size > floor) { size -= 1; heading.style.fontSize = size + 'px'; }
    return over();
  }
  function fitTitle() {
    if (!heading) return;
    heading.style.fontSize = '';
    heading.classList.add('fits');
    heading.classList.remove('clipped', 'stacked'); // measure uncut and together first: a cut name always fits
    var name = heading.querySelector('.title-name');
    var clipped = shrink(name, 20);
    if (clipped) { heading.classList.add('stacked'); heading.style.fontSize = ''; clipped = shrink(name, 14); }
    heading.classList.toggle('clipped', clipped);
    if (name) { if (clipped) name.title = name.textContent; else name.removeAttribute('title'); }
  }
  // ---- The cyberhome and the System Map box are squares (Astra, 2026-10-21: "should always be a square"). Beside the
  // title, their side is the title column's height, so the header still ends at the bottom of the title's buttons
  // (#163), between 210 and 260px (smaller, a label no longer fits on the border); the stylesheet keeps them square at
  // every width. ----
  function fitSquares() {
    if (!header || !titleBox) return;
    if (window.matchMedia && !window.matchMedia('(min-width: 1001px)').matches) { header.style.removeProperty('--square'); return; }
    // Since 2026-10-23 they fit their tool and picture snugly (Astra: "make their squares fit them snugly"): the
    // stylesheet's --square, not the title column's height.
    header.style.removeProperty('--square');
    fitTitle();
  }
  // ---- The title stays between the two squares while its name fits there at full size, and moves below them only
  // when it outgrows that room (Astra, 2026-10-23: "at this point, the title could go between. only when it outgrows
  // should it move down"). Wide windows always have the room. ----
  function placeTitle() {
    if (!header || !heading) return;
    header.classList.add('title-between');
    if (!window.matchMedia || !window.matchMedia('(max-width: 1000px)').matches) return;
    heading.style.fontSize = '';
    heading.classList.add('fits');
    heading.classList.remove('clipped');
    heading.classList.add('stacked'); // the version may go under the name; the name itself must fit at full size
    var name = heading.querySelector('.title-name');
    var fits = heading.scrollWidth <= heading.clientWidth && (!name || name.scrollWidth <= name.clientWidth + 1);
    heading.classList.remove('stacked');
    if (!fits) header.classList.remove('title-between');
  }
  function fitHeader() { placeTitle(); fitTitle(); fitSquares(); }
  fitHeader();
  window.addEventListener('resize', fitHeader);
  document.addEventListener('DOMContentLoaded', fitHeader); // after developer-words-20261019.js has swapped the words
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeader);

  // ---- The paired lights: left ON/OFF (green, red), right working correctly or requires maintenance (blue, yellow).
  // Each click moves a light to its next state, and a bubble says what that state means (Astra, 2026-10-19). The
  // ON/OFF light is only ever on or off, never grey (Astra, 2026-10-21): something not built yet is off and stays off,
  // and its maintenance light is grey, not checked yet; clicking either says why. Marks saved before 2026-10-19 (`off`,
  // `fix`) still count. ----
  var lights = read('lights', {});
  function power(k, planned) { if (planned) return 'off'; var s = lights[k] || {}; return s.power || (s.off ? 'off' : 'on'); }
  // The second light (Astra, 2026-10-24: "the gray should be 'not created' ... they need to all be checked if they work
  // or not by you"; "yellow is 'report issues'"; an update found by the update audit is orange until L4 approves it):
  //   none   grey    not created: not built yet, or the check found it is not on this PC
  //   fix    yellow  report issues: you reported one (click), the check found one, or it has not been checked yet
  //   update orange  an update is waiting for your approval (Steam, or the update audit on GitHub)
  //   ok     blue    checked, and it works
  // A check is the hub's record (pets.json `checks`): data-check on the light, with its note and date.
  function care(b) {
    var k = b.dataset.item, s = lights[k] || {}, c = b.dataset.check || '';
    if (c === 'missing' || (!c && b.dataset.planned && !b.dataset.unseen)) return 'none';
    if (s.health === 'fix' || s.fix) return 'fix';
    if (isProgram(b) && update(b) === 'fix') return 'update';
    if (c === 'update') return 'update';
    if (c === 'issues') return 'fix';
    if (c === 'works' || (isProgram(b) && update(b) === 'ok')) return 'ok';
    return 'fix';
  }
  function reported(k) { var s = lights[k] || {}; return s.health === 'fix' || !!s.fix; }
  var SAYS = {
    on: 'on. Click again to switch it off.',
    off: 'off (the kill switch). Turning it back on asks you first.',
    ok: 'working correctly. Click again if it is broken.',
    fix: 'requires maintenance. It is listed under "Requires maintenance" in L4.',
    planned: 'not built yet, so it is off and there is nothing to check. Its lights work once it is built.',
    // A 3rd party program: green while Inference Iguana's program-watch sees it open on this PC, red otherwise.
    unseen: 'not seen running. Inference Iguana’s program-watch has not seen it open on this PC (it only reports while its watch runs, and only to a page opened on this PC). This light does not open or close it yet.',
    running: 'open now: Inference Iguana’s program-watch saw it running. This light does not close it yet.',
    // A VR device (2026-10-23): green while SteamVR has it on, from Inference Iguana's device-watch.
    deviceOn: 'on: SteamVR has it connected (Inference Iguana’s device-watch reads SteamVR’s log).',
    deviceOff: 'off: SteamVR does not have it connected right now, or SteamVR is not running.',
  };
  // Which 3rd party programs are open (Astra, 2026-10-23): Inference Iguana's program-watch writes them every five seconds
  // to one file in her Documents folder, and a page opened on this PC reads it again every five seconds. Ids are the
  // System Map's, as in `third-party:<id>`.
  var running = {}, runningSeen = null, updates = {};
  // A 3rd party program's second light: does it need an update? true, false, or not known (Astra, 2026-10-23).
  function isProgram(b) { return /^third-party:/.test(b.dataset.item || '') && !!b.dataset.unseen; }
  function update(b) { var u = updates[(b.dataset.item || '').replace(/^third-party:/, '')]; return u === true ? 'fix' : u === false ? 'ok' : ''; }
  function seen(b) { return !!running[(b.dataset.item || '').replace(/^(third-party|device):/, '')]; }
  function isDevice(b) { return /^device:/.test(b.dataset.item || ''); }
  var CARE = { none: 'not created', fix: 'report issues', update: 'update waiting for your approval', ok: 'checked, works' };
  function paint() {
    var buttons = document.querySelectorAll('button.light[data-item]'), names = {}, planned = {}, managed = {}, issues = [], waiting = [];
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i], k = b.dataset.item, name = b.dataset.name;
      names[k] = name; planned[k] = !!b.dataset.planned;
      if (b.classList.contains('onoff')) {
        if (b.dataset.presenceManaged) { managed[k] = true; continue; }
        var p = b.dataset.unseen ? (seen(b) ? 'on' : 'off') : power(k, planned[k]);
        b.classList.toggle('is-off', p === 'off');
        b.setAttribute('aria-pressed', p === 'on' ? 'true' : 'false');
        b.setAttribute('aria-label', name + ': ' + (b.dataset.unseen ? (p === 'on' ? 'open now' : 'not seen running') : planned[k] ? 'off, not built yet' : p));
      } else {
        var h = care(b);
        b.classList.toggle('is-fix', h === 'fix');
        b.classList.toggle('is-update', h === 'update');
        b.classList.toggle('is-unset', h === 'none');
        b.setAttribute('aria-pressed', h === 'fix' ? 'true' : 'false');
        b.setAttribute('aria-label', name + ': ' + CARE[h]);
        if (h === 'fix') issues.push(b); else if (h === 'update') waiting.push(b);
      }
    }
    var fix = document.getElementById('maintenance'), off = document.getElementById('switched-off');
    if (fix) {
      fix.textContent = '';
      if (!issues.length && !waiting.length) fix.appendChild(el('li', 'Nothing yellow or orange.', 'empty'));
      issues.forEach(function (b) { fix.appendChild(el('li', b.dataset.name + ': ' + (reported(b.dataset.item) ? 'you reported an issue (' + (lights[b.dataset.item].fixed_on || 'today') + ')' : b.dataset.check === 'issues' ? 'issue found: ' + (b.dataset.checkNote || '') : 'not checked yet'))); });
      waiting.forEach(function (b) { fix.appendChild(el('li', b.dataset.name + ': update waiting for your approval' + (b.dataset.checkNote ? ' (' + b.dataset.checkNote + ')' : ''))); });
    }
    if (off) {
      off.textContent = '';
      Object.keys(names).filter(function (k) { return !managed[k] && !planned[k] && power(k) === 'off'; }).forEach(function (k) { off.appendChild(el('li', names[k] + ': switched off in this browser')); });
    }
    // A level tool panel glows like L4 while something in it is in use: a program open or a device on (Astra,
    // 2026-10-23: "the L1 control panel is not lighting up even though we are using tools and programs in there").
    // L4's glow is yours (the page in use) and stays the activity script's.
    var levels = document.querySelectorAll('details.panel.level');
    for (var lv = 0; lv < levels.length; lv++) {
      var lg = levels[lv].querySelector(':scope > summary .legend');
      if (lg && /-L4-[a-z-]*panel$/.test(lg.textContent)) continue;
      var inUse = levels[lv].querySelector('button.light.onoff[data-unseen]:not(.is-off)');
      if (inUse) levels[lv].dataset.activity = 'live'; else delete levels[lv].dataset.activity;
    }
  }
  // The bubble that says what a light now means. One for the page, placed under the light that was clicked.
  var tip = el('div', null, 'light-bubble'), tipTimer;
  tip.setAttribute('role', 'status');
  tip.hidden = true;
  document.body.appendChild(tip);
  function say(b, text) { sayAt(b, b.dataset.name + ': ' + text); }
  function sayAt(b, text) {
    tip.textContent = text;
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
    if (b.dataset.presenceManaged) return; // Damsel's local controls own these two live power lights.
    e.preventDefault();
    var k = b.dataset.item, planned = !!b.dataset.planned, next;
    if (b.dataset.unseen && b.classList.contains('onoff')) { say(b, isDevice(b) ? (seen(b) ? SAYS.deviceOn : SAYS.deviceOff) : seen(b) ? SAYS.running + (runningSeen ? ' (' + localTime(runningSeen) + ')' : '') : SAYS.unseen); return; }
    if (b.classList.contains('care')) {
      // The second light: what the check found, and a click reports an issue or takes your report back.
      var h = care(b), note = b.dataset.checkNote ? ' ' + b.dataset.checkNote : '';
      if (h === 'none') { say(b, 'not created yet.' + note); return; }
      var r = lights[k] || (lights[k] = {});
      if (reported(k)) { delete r.health; delete r.fix; delete r.fixed_on; } else { r.health = 'fix'; r.fixed_on = localDay(); }
      write('lights', lights);
      paint();
      var now = care(b);
      say(b, reported(k) ? 'report issues: you reported one. It is listed in L4; click again to take it back.'
        : now === 'update' ? (isProgram(b) && update(b) === 'fix' ? 'update waiting for your approval: Steam has a newer version.' : 'update waiting for your approval.' + note) + ' L3 asks you in L4 before anything is updated.'
        : now === 'ok' ? 'checked, works.' + note : now === 'fix' && b.dataset.check === 'issues' ? 'report issues: the check found one.' + note : 'report issues: not checked yet.');
      return;
    }
    if (planned) { say(b, SAYS.planned); return; }
    var s = lights[k] || (lights[k] = {});
    var p = power(k, planned);
    if (p === 'off' && !window.confirm(T('Turn ' + b.dataset.name + ' back on? After a security OFF, only you (L4) may turn it on.'))) return;
    next = p === 'on' ? 'off' : 'on';
    s.power = next; delete s.off;
    write('lights', lights);
    paint();
    say(b, SAYS[next]);
  });
  paint();

  // Inference Iguana's list, loaded again every five seconds while the page is open on this PC. A list older than a minute
  // means the watch stopped, so nothing counts as open.
  (function () {
    if (!document.querySelector('button.light[data-unseen]')) return;
    if (!(location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))) return;
    // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents.
    var LOCAL_PROGRAMS = "../../../../Astra's PetOS Data/benchmark-rock/programs-page-data.js";
    function load() {
      var script = document.createElement('script');
      script.setAttribute('src', LOCAL_PROGRAMS + '?t=' + Date.now());
      script.onload = function () {
        script.remove();
        var d = window.benchmarkRockPrograms, now = {};
        if (d && d.schema === 'benchmark-rock-programs-v1' && Array.isArray(d.programs) && Date.now() - new Date(d.time).getTime() < 60000) {
          d.programs.forEach(function (p) { if (p && p.running && typeof p.id === 'string') now[p.id] = true; });
          (Array.isArray(d.devices) ? d.devices : []).forEach(function (v) { if (v && v.on === true && typeof v.id === 'string') now[v.id] = true; });
          var ups = {};
          d.programs.forEach(function (p) { if (p && typeof p.id === 'string' && (p.update === true || p.update === false)) ups[p.id] = p.update; });
          updates = ups;
          runningSeen = d.time;
        }
        running = now;
        paint();
      };
      script.onerror = function () { script.remove(); running = {}; paint(); };
      document.head.appendChild(script);
    }
    load();
    setInterval(function () { if (!document.hidden) load(); }, 5000);
  })();

  // ---- The pet's mood while this page is open: sad when it was not opened for two weeks, then idle; awake (the idle
  // face blinking) after you use the page, idle again after two quiet minutes. The mood it is in lights up in the
  // emotions tool panel (Astra, 2026-10-21: "get rid of this entirely; select from 9 emotions at bottom what to 'light
  // up'"); the cyberhome has no bubble any more. ----
  // Every face is already in the page; the script only shows one and hides the others (no picture address passes
  // through here).
  var den = document.querySelector('.den');
  var moodFigures = document.querySelectorAll('.mood[data-mood]');
  function lightUp(name) {
    for (var i = 0; i < moodFigures.length; i++) {
      var now = moodFigures[i].dataset.mood === name;
      moodFigures[i].classList.toggle('is-now', now);
      if (now) moodFigures[i].setAttribute('aria-current', 'true'); else moodFigures[i].removeAttribute('aria-current');
    }
  }
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
    lightUp(mood === 'awake' ? 'blink' : mood);
    // No blinking: the pet stays still (Astra, 2026-10-24: "make the animation of the rabbit moving go away on the pet
    // program, just want to see it static").
    clearInterval(blinker);
  }
  function used() {
    if (mood !== 'awake') show('awake');
    clearTimeout(quiet);
    quiet = setTimeout(function () { show('idle'); }, 120000);
  }
  ['pointerdown', 'keydown', 'input'].forEach(function (t) { document.addEventListener(t, used, { passive: true }); });
  show(mood);
  // One click: the current reminder, in the same small bubble the lights use, under the pet. In developer mode, what
  // the agent does, then the reminder (Astra, 2026-10-19: "you could click it and see what it does").
  if (den && (dev || has(den, 'idle'))) den.addEventListener('click', function () {
    sayAt(den, dev ? T(config.pet + ': ' + (config.summary || 'no description yet.') + ' ' + config.reminder) : config.pet + ': ' + config.reminder);
  });

  // The awake picture in the emotions tool panel stays still too (2026-10-24: "just want to see it static").

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

  // ---- The cyberhome (Astra, 2026-10-19): empty until this page opens, then the pet moves in from the top corner.
  // The page plays the arrival itself. Flying in from the desktop (from roaming, from the lineup, or out of Startup
  // Star when the desktop pet is hidden) needs Startup Star's link, which is not built yet. No star door in the den
  // since 2026-10-20 (Astra crossed it out). The script only changes the den's state: every picture is already in the
  // page. ----
  var still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (den && den.dataset.arrival === 'waiting' && dev) {
    // Developer mode: no desktop pets and no flight. The agent lives here already; click it to see what it does.
    den.dataset.arrival = 'home';
    var habitat = den.parentNode;
    if (habitat && habitat.title !== undefined) habitat.title = T('Click ' + config.pet + ' to see what it does.');
  } else if (den && den.dataset.arrival === 'waiting') {
    (still ? [['home', 0]] : [['arriving', 250], ['home', 1300]]).forEach(function (step) {
      setTimeout(function () { den.dataset.arrival = step[0]; }, step[1]);
    });
  }

  // ---- Activity (Astra, 2026-10-19): a level's tool panel glows while that level is working right now. L4 is you:
  // it glows while this page is in front of you and you used it in the last two minutes, dims when you go quiet and
  // stops while the page is hidden. L1 to L3 need Startup Star's link to know what is running (not built yet). The
  // separate activity light after each label is gone (Astra, 2026-10-21, moving it left to the pair); the glow stays. ----
  var HERE = {
    live: ['you are here', 'You are here: this page is in front of you and you used it (pointer, keys or scrolling) in the last two minutes.'],
    idle: ['you went quiet', 'Open, but you have not used this page for two minutes, or you are working in another window.'],
    off: ['you are away', 'This page is hidden behind another tab or window.'],
  };
  var L4 = null, L4quiet;
  var levelPanels = document.querySelectorAll('details.panel.level');
  for (var p = 0; p < levelPanels.length; p++) {
    var legend = levelPanels[p].querySelector('.legend');
    if (/-L4-[a-z-]*panel$/.test(legend ? legend.textContent : '')) L4 = { panel: levelPanels[p], legend: legend };
  }
  function here(state) {
    if (!L4) return;
    L4.panel.dataset.activity = state;
    L4.legend.title = HERE[state][1];
  }
  function present() {
    if (document.hidden) return;
    here('live');
    clearTimeout(L4quiet);
    L4quiet = setTimeout(function () { here('idle'); }, 120000);
  }
  ['pointerdown', 'keydown', 'input', 'wheel', 'scroll'].forEach(function (t) { document.addEventListener(t, present, { passive: true }); });
  // Reading the page counts as using it (Astra, 2026-10-19: "double check if these L4s are active when they are"):
  // moving the pointer over it or scrolling keeps L4 on, not only clicks and keys. A moving pointer counts once a second.
  var lastMove = 0;
  document.addEventListener('pointermove', function () {
    var now = Date.now();
    if (now - lastMove < 1000 && L4 && L4.panel.dataset.activity === 'live') return;
    lastMove = now;
    present();
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearTimeout(L4quiet); here('off'); } else present();
  });
  // Another window in front while this page still shows: you are working elsewhere, so L4 dims at once; back here, on.
  if (window.addEventListener) {
    window.addEventListener('blur', function () { if (!document.hidden) { clearTimeout(L4quiet); here('idle'); } });
    window.addEventListener('focus', present);
  }
  if (document.hidden) here('off'); else present();

  // ---- The chat window, like Data Chip's on Data Dealer (Astra, 2026-10-20 and 2026-11-03): the button opens it at
  // once, on Needs you when something waits on you, else on Ask. Questions about this page get an answer from the page
  // itself straight away; anything else goes to who answers. Who answers is the AI seated in the pet's harness on this
  // PC, Claude Code first, then Codex, then another AI the pet chat helper finds (Astra, 2026-11-03), or your own Claude
  // or ChatGPT in a new tab, or a note. The pet chat helper (scripts/pet-chat-helper-20261103.cs, card 283) seats them:
  // it says what it found on this PC, the answer streams into the window, and the agent's changes stay on its own branch
  // until you press Push and say yes in the helper's box on your PC. With no helper, a message for the seat waits in the
  // backlog and the pet says why. The page keeps no keys. The chat's own left light switches it off. ----
  var chat = document.getElementById('chat-open'), panel = document.getElementById('chat-panel');
  var chatText = document.getElementById('chat-text'), chatSend = document.getElementById('chat-send');
  var chatStatus = document.getElementById('chat-status'), chatSays = document.getElementById('chat-who-says'), chatLog = document.getElementById('chat-log');
  var chatSeat = document.getElementById('chat-seat'), chatNow = document.getElementById('chat-who-now');
  var chatPush = document.getElementById('chat-push'), chatNew = document.getElementById('chat-new');
  var whoButtons = panel ? panel.querySelectorAll('button[data-who]') : [];
  var SEAT_SAYS = ' answers here as ' + config.pet + ', seated in ' + config.home + '\'s harness on this PC. It reads the plan and ' + config.pet + '\'s repo and changes files only on its own branch; nothing reaches GitHub until you press Push and say yes on your PC.';
  var WHO = {
    'claude-code': { name: 'Claude Code', seat: true, says: 'Claude Code' + SEAT_SAYS },
    codex: { name: 'Codex', seat: true, says: 'Codex' + SEAT_SAYS },
    'other-ai': { name: 'another AI on this PC', seat: true, says: 'Another AI the pet chat helper finds on this PC. It names what it found; only Claude Code and Codex can be seated so far.' },
    claude: { name: 'your Claude', url: 'https://claude.ai/new?q=',
      says: 'Opens your Claude (claude.ai) in a new tab with your message and ' + config.home + '\'s name typed in. Nothing is sent from this page.' },
    chatgpt: { name: 'your ChatGPT', url: 'https://chatgpt.com/?q=',
      says: 'Opens your ChatGPT (chatgpt.com) in a new tab with your message and ' + config.home + '\'s name typed in. Nothing is sent from this page.' },
    note: { name: 'the backlog', says: 'Your message goes to ' + STORE + ', like a session note.' },
  };
  var saved = read('chat-with', null);
  var chosen = WHO[saved] ? saved : 'claude-code', chatLines = read('chat', []);
  // The pet chat helper on this PC, reached only through pet-chat-link-20261103.js (this script sends nothing itself).
  var link = window.PetChatLink || null, onThisPC = !!(link && link.onThisPC);
  var helper = false, agents = {}, order = [], petOk = false, petWhy = '', answering = false;
  function agentOf(k) { return agents[k] || null; }
  function ready(k) { var a = agentOf(k); return !!(helper && petOk && a && a.ready); }
  // Why a seat cannot answer right now, in plain words; empty when it can.
  function whyNot(k) {
    if (!onThisPC) return 'The seat answers only on the page opened from the PC where the pet chat helper runs.';
    if (!helper) return 'The pet chat helper is not running on this PC. Startup Star starts it when you sign in; its menu has Pet chat, then Start Pet chat.';
    if (!petOk) return petWhy || 'No agent can be seated for ' + config.pet + ' here.';
    if (k === 'other-ai') {
      var others = order.filter(function (id) { var a = agentOf(id); return a && a.found && !a.seatable; }).map(function (id) { return agentOf(id).name; });
      return others.length ? 'Found on this PC: ' + others.join(', ') + '. The pet chat cannot seat ' + (others.length === 1 ? 'it' : 'them') + ' yet; Claude Code and Codex can.' : 'The pet chat helper found no other AI on this PC.';
    }
    var a = agentOf(k);
    return !a ? 'The pet chat helper does not know ' + WHO[k].name + '.' : a.ready ? '' : a.name + ': ' + a.why + '.';
  }
  function seatState(k) {
    if (!helper) return onThisPC ? 'helper not running' : 'on this PC';
    if (k === 'other-ai') return order.some(function (id) { var a = agentOf(id); return a && a.found && !a.seatable; }) ? 'found, not yet' : 'none found';
    var a = agentOf(k);
    return !a || !a.found ? 'not on this PC' : !a.seatable ? 'found, not yet' : !a.signed_in ? 'sign in once' : 'ready';
  }
  function choose(k) {
    chosen = WHO[k] ? k : 'claude-code';
    for (var i = 0; i < whoButtons.length; i++) {
      var b = whoButtons[i], state = b.querySelector('[data-seat-state]');
      b.setAttribute('aria-pressed', b.dataset.who === chosen ? 'true' : 'false');
      if (state && WHO[b.dataset.who] && WHO[b.dataset.who].seat) state.textContent = seatState(b.dataset.who);
    }
    var why = WHO[chosen].seat ? whyNot(chosen) : '';
    if (chatSays) chatSays.textContent = WHO[chosen].says + (why ? ' ' + why : '');
    if (chatNow) chatNow.textContent = WHO[chosen].name.replace(/^your /, 'My ').replace(/^another/, 'Another');
    if (chatSeat) chatSeat.textContent = !WHO[chosen].seat ? 'Seat: empty' : ready(chosen) ? 'Seat: ' + WHO[chosen].name + ' · ready' : 'Seat: empty · ' + WHO[chosen].name + ' answers once seated';
  }
  function askHelper(path, extra) {
    var body = { pet: config.repo };
    for (var k in extra || {}) body[k] = extra[k];
    return link.ask(path, body);
  }
  // When the chat opens: who the helper found and whether this pet can have a seat. With nothing chosen yet, the first
  // ready one in the farm's order answers (Claude Code, then Codex).
  function hello() {
    if (!link) { choose(chosen); return; }
    link.load(function (found) {
      helper = found;
      if (!helper) { choose(chosen); return; }
      askHelper('hello').then(function (r) { return r.json(); }).then(function (d) {
        agents = {}; order = [];
        (d.agents || []).forEach(function (a) { if (a && typeof a.id === 'string') { agents[a.id] = a; order.push(a.id); } });
        petOk = d.pet_ok === true; petWhy = typeof d.pet_why === 'string' ? d.pet_why : '';
        if (!WHO[saved]) for (var i = 0; i < order.length; i++) if (WHO[order[i]] && ready(order[i])) { chosen = order[i]; break; }
        choose(chosen);
        var seat = d.seat;
        if (seat) {
          showPush(seat.unpushed, seat.branch);
          // An answer that finished after the page closed comes in now.
          var last = chatLines[chatLines.length - 1];
          if (typeof seat.last_said === 'string' && seat.last_said && last && last.from === 'me' && Date.parse(seat.last_at) > Date.parse(last.at)) say('pet', seat.last_said);
        }
        if (d.busy) chatStatus.textContent = config.pet + ' is still answering your last message.';
      }).catch(function () { helper = false; choose(chosen); });
    });
  }
  function showPush(n, branch) {
    if (!chatPush) return;
    chatPush.hidden = !(helper && n > 0);
    chatPush.textContent = 'Push ' + n + ' change' + (n === 1 ? '' : 's') + ' for review';
    chatPush.title = 'Sends ' + branch + ' to GitHub after you say yes in the box on your PC. Nothing is merged.';
  }
  function drawChat() {
    if (!chatLog) return;
    chatLog.textContent = '';
    chatLines.slice(-20).forEach(function (m) {
      var li = el('li', m.text);
      li.className = m.from === 'pet' ? 'pet' : 'me';
      li.title = localTime(m.at) + (m.to ? ' · to ' + m.to : '');
      chatLog.appendChild(li);
    });
    chatLog.scrollTop = 1e9;
  }
  function say(from, text, to) {
    chatLines.push({ at: new Date().toISOString(), from: from, to: to || null, text: text });
    chatLines = chatLines.slice(-20);
    write('chat', chatLines);
    drawChat();
  }
  // Questions this page can answer from what it shows, the way Data Chip answered from its own dashboard.
  function needsText() {
    var items = panel ? panel.querySelectorAll('.chat-needs li') : [];
    if (!items.length) return 'Nothing needs you right now.';
    var lines = [];
    for (var i = 0; i < items.length; i++) lines.push('• ' + items[i].textContent.trim());
    return items.length + (items.length === 1 ? ' thing needs' : ' things need') + ' you:\n' + lines.join('\n');
  }
  function toolsText() {
    var l1 = document.getElementById(config.petSlug + '-L1-control-panel');
    var cares = l1 ? l1.querySelectorAll('.light.care') : [];
    if (!cares.length) return 'I have no tools listed yet.';
    var n = { works: 0, fix: 0, update: 0, unset: 0 };
    for (var i = 0; i < cares.length; i++) {
      var c = cares[i].classList;
      if (c.contains('is-unset')) n.unset++; else if (c.contains('is-update')) n.update++; else if (c.contains('is-fix')) n.fix++; else n.works++;
    }
    return cares.length + ' things in L1: ' + n.works + ' checked and working, ' + n.fix + ' with an issue or not checked yet, ' + n.update + ' with an update waiting for your OK, ' + n.unset + ' not created yet.';
  }
  var QUICK = {
    explain: function () { return config.summary + ' Its tools and programs are in L1, its tricks in L2, what L3 asks you in L3, and your approvals, grants and Pet ID in L4.'; },
    needs: needsText,
    tools: toolsText,
  };
  function showView(v) {
    var views = panel ? panel.querySelectorAll('.chat-view') : [], tabs = panel ? panel.querySelectorAll('.chat-tabs button') : [];
    for (var i = 0; i < views.length; i++) views[i].hidden = views[i].dataset.viewOf !== v;
    for (var j = 0; j < tabs.length; j++) tabs[j].setAttribute('aria-pressed', tabs[j].dataset.view === v ? 'true' : 'false');
  }
  function chatOff() { var s = lights['chat:' + config.petSlug] || {}; return s.power ? s.power === 'off' : !!s.off; }
  function addNote(message) {
    var stamp = today(), n = backlog.entries.filter(function (x) { return x.id.indexOf('-backlog-' + stamp + '-') > -1; }).length + 1;
    backlog.entries.push({
      id: config.homeSlug + '-v1.0-backlog-' + stamp + '-' + String(n).padStart(3, '0'),
      created: new Date().toISOString(), author: 'you', kind: 'note', tool: config.petSlug + '-chat', text: message, attachments: [], status: 'new', run: null,
    });
    if (!write('backlog', backlog)) { backlog.entries.pop(); return false; }
    render();
    return true;
  }
  function openChat(open) {
    panel.hidden = !open;
    chat.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      showView(panel.querySelectorAll('.chat-needs li').length && !chatLines.length ? 'needs' : 'ask');
      if (chatText) chatText.focus();
      hello();
    }
  }
  // The seated agent's answer, typed into the pet's bubble as it comes: one JSON line at a time from the helper.
  function answer(message) {
    answering = true; chatSend.textContent = 'Stop'; chatStatus.textContent = '';
    var line = { at: new Date().toISOString(), from: 'pet', to: null, text: '' };
    chatLines.push(line); drawChat();
    var bubble = chatLog && chatLog.children[chatLog.children.length - 1];
    function show() { if (bubble) bubble.textContent = line.text || '…'; if (chatLog) chatLog.scrollTop = 1e9; }
    function onLine(text) {
      var m; try { m = JSON.parse(text); } catch (e) { return; }
      if (m.type === 'say' && typeof m.text === 'string') { line.text += m.text; show(); }
      else if (m.type === 'doing' && typeof m.text === 'string') chatStatus.textContent = m.text + '…';
      else if (m.type === 'seat' && chatSeat) chatSeat.textContent = 'Seat: ' + m.agent + ' · working on ' + m.branch;
      else if (m.type === 'problem' && typeof m.text === 'string') { line.text += (line.text ? '\n\n' : '') + m.text; show(); }
      else if (m.type === 'done') {
        var changed = Array.isArray(m.changed) ? m.changed.filter(function (f) { return typeof f === 'string'; }) : [];
        chatStatus.textContent = changed.length ? 'Changed on ' + m.branch + ': ' + changed.join(', ') + '.' : '';
        showPush(m.unpushed, m.branch);
      }
    }
    var buffer = '';
    askHelper('ask', { agent: chosen, text: message }).then(function (r) {
      if ((r.headers.get('Content-Type') || '').indexOf('ndjson') < 0) return r.json().then(function (d) { line.text = d.said || 'The pet chat helper said no.'; });
      var reader = r.body.getReader(), decoder = new TextDecoder();
      function pump() {
        return reader.read().then(function (x) {
          if (x.done) { if (buffer) onLine(buffer); return; }
          buffer += decoder.decode(x.value, { stream: true });
          var parts = buffer.split('\n'); buffer = parts.pop();
          parts.forEach(onLine);
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      line.text += (line.text ? '\n\n' : '') + 'I lost the pet chat helper while answering. Anything already changed is kept on my branch.';
    }).then(function () {
      answering = false; chatSend.textContent = 'Send';
      if (!line.text) line.text = 'I have no answer this time.';
      chatLines = chatLines.slice(-20); write('chat', chatLines); drawChat();
      if (chatSeat && ready(chosen)) chatSeat.textContent = 'Seat: ' + WHO[chosen].name + ' · ready';
    });
  }
  function send(message) {
    if (chatOff()) { chatStatus.textContent = 'The chat is switched off (its left light). Switch it on to send.'; return false; }
    var to = WHO[chosen];
    say('me', message, to.name);
    if (to.seat && ready(chosen)) { answer(message); return true; }
    if (to.url) {
      var prompt = T('This is about ' + config.home + ', ' + config.pet + '\'s pet program in Astra\'s PetOS') +
        (config.repoUrl ? ' (' + config.repoUrl + ')' : '') + '.\n\n' + message;
      try { if (navigator.clipboard) navigator.clipboard.writeText(prompt).catch(function () {}); } catch (e) { /* the new tab still has it */ }
      var tab = window.open(to.url + encodeURIComponent(prompt), '_blank');
      if (tab) { tab.opener = null; chatStatus.textContent = 'Opened ' + to.name + ' in a new tab. Your message is on the clipboard too, in case its box is empty.'; }
      else chatStatus.textContent = 'Your browser blocked the new tab. Your message is on the clipboard: open ' + to.name + ' and paste it.';
      return true;
    }
    if (!addNote(message)) { chatStatus.textContent = 'This browser would not save it (storage is full or blocked). Copy it somewhere safe.'; return false; }
    chatStatus.textContent = 'Saved to ' + STORE + '.';
    if (to.seat) say('pet', 'Nobody is in my seat yet. ' + whyNot(chosen) + ' I put your message in ' + STORE + ', and whoever sits here next picks it up from there. Ask me about this page (the buttons above) and I answer right away.');
    return true;
  }
  if (chat && panel && chatText && chatSend) {
    chat.addEventListener('click', function () { openChat(panel.hidden); });
    var close = document.getElementById('chat-close');
    if (close) close.addEventListener('click', function () { openChat(false); chat.focus(); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { openChat(false); chat.focus(); } });
    for (var w = 0; w < whoButtons.length; w++) whoButtons[w].addEventListener('click', function () { choose(this.dataset.who); write('chat-with', chosen); });
    var tabs = panel.querySelectorAll('.chat-tabs button');
    for (var t = 0; t < tabs.length; t++) tabs[t].addEventListener('click', function () { showView(this.dataset.view); });
    var quick = panel.querySelectorAll('.chat-quick button');
    for (var q = 0; q < quick.length; q++) quick[q].addEventListener('click', function () {
      if (chatOff()) { chatStatus.textContent = 'The chat is switched off (its left light). Switch it on to ask.'; return; }
      say('me', this.textContent);
      say('pet', QUICK[this.dataset.quick]());
    });
    // A Needs you item takes you to its place on the page, with its panel open, and the chat steps aside.
    var gotos = panel.querySelectorAll('[data-chat-goto]');
    for (var g = 0; g < gotos.length; g++) gotos[g].addEventListener('click', function () {
      var target = document.getElementById((this.getAttribute('href') || '').slice(1));
      if (target && target.tagName === 'DETAILS') target.open = true;
      openChat(false);
    });
    chatText.addEventListener('input', function () { chatStatus.textContent = ''; });
    chatSend.addEventListener('click', function () {
      // While the seat answers, Send is Stop.
      if (answering) { if (helper) askHelper('stop').catch(function () {}); chatStatus.textContent = 'Stopping…'; return; }
      var message = chatText.value.trim();
      if (!message) { chatStatus.textContent = 'Type a message first.'; chatText.focus(); return; }
      if (send(message)) chatText.value = '';
    });
    if (chatPush) chatPush.addEventListener('click', function () {
      if (!helper || answering) return;
      chatStatus.textContent = 'Say yes or no in the box on your PC…';
      askHelper('push').then(function (r) { return r.json(); }).then(function (d) {
        chatStatus.textContent = d.said || '';
        if (d.ok) {
          showPush(0, d.branch);
          var url = null; try { url = new URL(d.url); } catch (e) { url = null; }
          if (url && url.protocol === 'https:' && url.hostname === 'github.com') {
            var a = el('a', 'Open the pull request on GitHub');
            a.setAttribute('href', url.href); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
            chatStatus.appendChild(document.createTextNode(' '));
            chatStatus.appendChild(a);
          }
        }
      }).catch(function () { chatStatus.textContent = 'I lost the pet chat helper. Nothing was pushed.'; });
    });
    // Start over: a new conversation with the seat; the changes so far stay on the branch.
    if (chatNew) chatNew.addEventListener('click', function () {
      if (answering) return;
      chatLines = []; write('chat', chatLines); drawChat();
      chatStatus.textContent = 'Starting over.';
      if (helper) askHelper('new').catch(function () {});
    });
    choose(chosen);
    drawChat();
  }

  // ---- API Fairy's key requests (only on API Fairy Ring's page; Astra, 2026-10-19). ----
  // Who asked for a key, who has one, who doesn't, each with a link back to where it asked. The real list stays on
  // Astra's PC: API Fairy writes it (names only, never a key) to one fixed file in her Documents folder, and this page
  // reads that file only when it is opened there (a double-clicked file, or a preview served on this PC). Anywhere else
  // it shows the page's made-up examples. Every word goes in with textContent; only https links become links.
  (function () {
  if (config.repo !== 'api-fairy') return;
  var requestBox = document.getElementById('key-requests');
  if (!requestBox) return;
  {
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
        b.title = kind === 'onoff' ? 'ON/OFF (kill switch): click to switch' : 'Working correctly or requires maintenance: click to mark';
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
    var showRequests = function (requests, message, problems) {
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
      showRequests(list, why);
    };
    if (onThisPC) {
      var script = document.createElement('script');
      script.setAttribute('src', LOCAL_REQUESTS);
      script.onload = function () {
        var d = window.apiFairyKeyRequests;
        if (!d || d.schema !== 'api-fairy-key-requests-page-v1' || !Array.isArray(d.requests)) return examples('API Fairy\'s list on this PC is not one this page can read. These are made-up examples.');
        var rows = d.requests.filter(function (r) { return r && groupOf[r.group]; });
        showRequests(rows, 'API Fairy\'s list on this PC: ' + rows.length + (rows.length === 1 ? ' request' : ' requests') + ', ' + (d.scanned ? 'checked by name ' : 'listed without looking for the keys ') + localTime(d.checked) + '.', d.problems);
      };
      script.onerror = function () { examples('API Fairy has not written her list on this PC yet (open API Fairy, or run API Fairy.exe --key-requests). These are made-up examples.'); };
      document.head.appendChild(script);
    } else {
      examples('Made-up examples. The real list stays on Astra\'s PC and shows here only when this page is opened there.');
    }
  }
  })();

  // ---- GitHub Aquarium's outstanding items (only on its page; Astra, 2026-10-21, findastra/github-goldfish card 006). ----
  // What waits on Astra on GitHub: how many in each group and the first few of each, with the Pets Board for the rest.
  // The list names private repos, so it stays on Astra's PC: GitHub Aquarium's outstanding-items writes it to one fixed
  // file in her Documents folder, and this page reads that file only when it is opened there. Anywhere else it shows
  // the page's made-up examples. Every word goes in with textContent; only https links become links.
  (function () {
  if (config.repo !== 'github-goldfish') return;
  var box = document.getElementById('outstanding-items');
  if (!box) return;
  // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents.
  var LOCAL_ITEMS = "../../../../Astra's PetOS Data/github-aquarium/outstanding-items-page-data.js";
  var FIRST = 3;
  var source = document.getElementById('outstanding-source');
  var onThisPC = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var GROUPS = ['broken', 'you', 'chat', 'close', 'info'];
  var https = function (u) { try { return new URL(u).protocol === 'https:' ? new URL(u).href : null; } catch (e) { return null; } };
  var row = function (i) {
    var li = el('li', null, 'request' + (i.example ? ' example' : ''));
    var head = el('div', null, 'request-head');
    var text = (i.number ? i.repo + ' #' + i.number + ' ' : i.repo + ': ') + (i.title || '');
    var href = https(i.url);
    if (href) { var a = el('a', (i.group === 'you' ? '✨ ' : '') + text); a.href = href; a.rel = 'noopener'; a.target = '_blank'; head.appendChild(a); } else head.appendChild(el('b', text));
    if (i.example) head.appendChild(el('span', 'EXAMPLE', 'tag example-tag'));
    li.appendChild(head);
    li.appendChild(el('div', i.does || '', 'small'));
    return li;
  };
  var showItems = function (items, message) {
    if (source) source.textContent = message;
    GROUPS.forEach(function (g) {
      var list = box.querySelector('ul[data-group="' + g + '"]');
      var empty = box.querySelector('[data-empty="' + g + '"]');
      var count = box.querySelector('[data-count="' + g + '"]');
      // A group the page does not draw is left alone (and a page script never stops the rest of the page).
      if (!list || !empty || !count) return;
      var mine = items.filter(function (i) { return i && i.group === g; });
      list.textContent = '';
      mine.slice(0, FIRST).forEach(function (i) { list.appendChild(row(i)); });
      empty.hidden = mine.length > 0;
      count.textContent = mine.length ? mine.length + (mine.length > FIRST ? ', the first ' + FIRST + ' here, the rest on the Pets Board' : '') : '';
    });
  };
  var examples = function (why) {
    var list = [];
    try { list = JSON.parse(document.getElementById('outstanding-examples').textContent); } catch (e) { list = []; }
    showItems(list, why);
  };
  if (onThisPC) {
    var script = document.createElement('script');
    script.setAttribute('src', LOCAL_ITEMS);
    script.onload = function () {
      var d = window.githubAquariumOutstandingItems;
      if (!d || d.schema !== 'github-aquarium-outstanding-items-v1' || !Array.isArray(d.items)) return examples('The Goldfish\'s list on this PC is not one this page can read. These are made-up examples.');
      showItems(d.items, 'The Goldfish\'s list on this PC, checked ' + localTime(d.checked) + ': ' + d.repos + ' repos (' + d.private + ' private), ' + d.prs + ' open pull requests.');
    };
    script.onerror = function () { examples('The Goldfish has not written its list on this PC yet (run npm run outstanding-items in the hub folder). These are made-up examples.'); };
    document.head.appendChild(script);
  } else {
    examples('Made-up examples. The real list stays on Astra\'s PC and shows here only when this page is opened there.');
  }
  })();

  // ---- A folded tool opens when it is clicked anywhere, like a pill (Astra, 2026-11-02: "all you have to do is click on
  // the tool itself to open it"); open, it folds again from its name line, so clicks inside it stay its own. Its lights,
  // links, buttons and fields keep their own clicks, and selecting text in it does nothing. ----
  function foldClick(e, boxes, head, fold) {
    var box = e.target.closest && e.target.closest(boxes);
    // A box made without a fold (the notes box) always stays open.
    var b = box && box.querySelector(':scope > :is(' + head + ') ' + fold);
    if (!b) return;
    if (!e.target.closest(fold)) {
      if (e.target.closest('button, a, input, select, textarea, label, summary, [contenteditable]')) return;
      var h = e.target.closest(head);
      if (!box.classList.contains('is-folded') && !(h && h.parentElement === box)) return;
      var sel = window.getSelection();
      if (String(sel) && box.contains(sel.anchorNode)) return;
    }
    var folded = box.classList.toggle('is-folded');
    b.setAttribute('aria-expanded', String(!folded));
  }
  // A tool box (L4's parts), like the VRChat setups (2026-10-24).
  document.addEventListener('click', function (e) { foldClick(e, '.toolbox', '.toolbox-head', '.toolbox-fold'); });

  // ---- Clicking a pill opens or closes it, like Halo List's (Astra, 2026-10-23: "just clicking the bubble opens it").
  // Its lights, links, buttons and fields keep their own clicks, and selecting text in it does not close it. ----
  document.addEventListener('click', function (e) {
    var pill = e.target.closest && e.target.closest('li.pill');
    if (!pill || e.target.closest('button, a, input, select, textarea, label, summary')) return;
    if (pill.querySelector('.pill-body').contains(e.target) && String(window.getSelection())) return;
    var more = pill.querySelector(':scope > .pill-more');
    if (more) more.open = !more.open;
  });

  // ---- Rift Rabbit's VRChat launch panel (only on its page; Astra, 2026-10-23). Each headset's switches and the notes
  // on each try are saved in this browser; the page shows what a launch would start and which try went best. ----
  (function () {
  var box = document.getElementById('vrchat-launch');
  if (!box) return;
  // Each headset tool and each of its ways folds down to its name (Astra, 2026-10-24: "these also need to be
  // collapsable") and opens when clicked anywhere, like a tool box.
  box.addEventListener('click', function (e) {
    // Face tracking's box cannot be unticked or ticked: it is drawn in the page's pink, not greyed out (2026-10-24).
    if (e.target.matches && e.target.matches('[data-launch-locked]')) { e.preventDefault(); return; }
    foldClick(e, '.launch-mode, .launch-headset', '.launch-head, legend', '.launch-fold');
  });
  var RANK = { best: 4, good: 3, ok: 2, bad: 1 };
  var saved = read('vrchat-launch', {});
  function save() { write('vrchat-launch', saved); }
  // tracker-strapper (Astra, 2026-10-25): which device is on each of her 29 spots, and the launch options below follow it
  // ("then your launch options become available below"). Both headset tools show; only the one on 23 Face launches;
  // modes x.1 to x.3 wait for a tracker on 24 Head; Double Hip and Double Chest for both spots of their pair; each Object
  // Track VR object for the tracker on it. Rift Rabbit's launcher keeps the spots on her PC (vrchat-launcher-20261024.js
  // fills them in there and sends changes); anywhere else they show today's spots.
  var strapper = box.querySelector('[data-strapper]');
  // Each hoop has two spots, its side and its top; a tracker on either is enough (2026-10-26).
  var OBJECT_SPOT = { 'dance-pole': ['DP'], 'large-hoop': ['BDH', 'BDT'], 'small-hoop': ['LDH', 'LDT'] };
  function spotName(code) { var row = strapper.querySelector('[data-strap-row="' + code + '"] .strap-name'); return row ? row.textContent.replace(/\s+/g, ' ').trim() : code; }
  function strap() {
    if (!strapper) return;
    var worn = {};
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) { if (sel.value) worn[sel.getAttribute('data-strap-spot')] = sel.value; });
    function tracker(code) { return /^vive-tracker-/.test(worn[code] || ''); }
    // The Double pairs and choice set themselves from her spots, as Rift Rabbit's launcher sets them (Astra, 2026-10-26:
    // "I dont want to have to mess with double hip I want you do fix that program for me when I launch"): the usual
    // pair (Front and Back Waist, Front and Back Sternum) when both are worn, else the first two worn spots of the group.
    function pairOf(group, usual) { if (usual.every(tracker)) return usual; var f = group.filter(tracker); return f.length >= 2 ? f.slice(0, 2) : []; }
    var pairs = { hip: pairOf(['FW', 'BW', 'RS', 'LS', 'RFS', 'LFS', 'RBS', 'LBS'], ['FW', 'BW']), chest: pairOf(['FS', 'BS', 'FD', 'BD'], ['FS', 'BS']) };
    var full = { hip: pairs.hip.length === 2, chest: pairs.chest.length === 2 };
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-dot]'), function (g) {
      var code = g.getAttribute('data-strap-dot');
      var inPair = (full.hip && pairs.hip.indexOf(code) >= 0) || (full.chest && pairs.chest.indexOf(code) >= 0);
      g.setAttribute('data-state', !worn[code] ? 'off' : code === 'H' ? 'head' : inPair ? 'joined' : 'used');
      // The spot draws the device on it (2026-10-26: "look like HTC Vive 3.0, and Index Controller, etc.").
      var dev = worn[code] || '';
      g.setAttribute('data-kind', /^vive-tracker-/.test(dev) ? 'tracker' : /^index-controller-/.test(dev) ? 'index' : /^quest-pro-controller-/.test(dev) ? 'qpro-ctrl' :
        /^quest-3-controller-/.test(dev) ? 'q3-ctrl' : dev === 'quest-pro' ? 'qpro' : dev === 'quest-3' ? 'q3' : dev === 'hand-tracking' ? 'hand' : '');
    });
    // Her headset on the drawing follows 23 Face (Quest Pro or Quest 3).
    strapper.querySelector('.strap-drawing').setAttribute('data-headset', worn.F || '');
    // What she is wearing, listed under her: headset, controllers, and every tracker with its spot and the total.
    var devs = strapper.querySelector('[data-strap-devices]');
    if (devs) {
      var shortOf = function (code) { var sel = strapper.querySelector('[data-strap-spot="' + code + '"]'), o = sel && sel.options[sel.selectedIndex]; return o ? (o.getAttribute('data-short') || o.textContent) : ''; };
      var plain = function (code) { return spotName(code).replace(/\s*\[[^\]]*\]\s*$/, ''); };
      var fill = function (key, lines, x, cols) {
        var g = devs.querySelector('[data-strap-dev="' + key + '"]'); g.textContent = '';
        var per = Math.ceil(lines.length / cols) || 1;
        lines.forEach(function (line, i) {
          var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          t.setAttribute('class', 'strap-dev' + (/Quest/.test(line) ? ' brand-meta' : /Index/.test(line) ? ' brand-valve' : /^#\d/.test(line) ? ' brand-vive' : '')); t.setAttribute('x', x + Math.floor(i / per) * 135); t.setAttribute('y', 932 + (i % per) * 19);
          t.textContent = line; g.appendChild(t);
        });
      };
      var dots = Array.prototype.map.call(strapper.querySelectorAll('[data-strap-dot]'), function (g) { return g.getAttribute('data-strap-dot'); });
      var trackers = dots.filter(tracker).map(function (code) { return shortOf(code).replace(/^Vive\s*/, '').replace(/\s*\[[^\]]*\]/, '') + ' ' + plain(code).replace(/^\d+\s+/, ''); });
      fill('headset', [worn.F ? shortOf('F') : 'None'], 16, 1);
      fill('controllers', ['RH', 'LH'].filter(function (c) { return worn[c]; }).map(function (c) { return shortOf(c).replace(/ controller$/, '') + (c === 'RH' ? ' (R)' : ' (L)'); }), 100, 1);
      fill('trackers', trackers.length ? trackers : ['None'], 250, trackers.length > 5 ? 2 : 1);
      devs.querySelector('[data-strap-dev-count]').textContent = 'Trackers · ' + trackers.length;
    }
    var face = worn.F || '';
    var needs = [];
    if (!tracker('H')) needs.push(spotName('H'));
    Array.prototype.forEach.call(box.querySelectorAll('[data-launch-headset]'), function (hs) {
      // Both headset tools always show, as before (Astra, 2026-10-25: "I want to see the tool on here like it was
      // before"); the one whose headset is not on 23 Face says so and does not launch until it is.
      var id = hs.getAttribute('data-launch-headset');
      var wrongFace = !!face && id !== face;
      Array.prototype.forEach.call(hs.querySelectorAll('[data-launch-mode]'), function (card) {
        var line = card.querySelector('[data-launch-needs]');
        var mode = card.getAttribute('data-launch-mode'), rooted = hs.querySelector('[data-launch-switch="rooted"]');
        var need = wrongFace ? 'Needs the ' + (id === 'quest-3' ? 'Meta Quest 3' : 'Meta Quest Pro') + ' on ' + spotName('F') + '.' :
          mode === 'questlhsync' ? (rooted && rooted.checked ? '' : 'Needs the headset rooted with Magisk: tick Rooted with Magisk.') :
          mode !== 'native' && needs.length ? 'Needs a tracker on ' + needs[0] + '.' : '';
        line.textContent = need; line.hidden = !need;
        card.classList.toggle('is-blocked', !!need);
      });
      // A choice whose spots have no devices is greyed out; a saved choice that cannot be made goes back to Off.
      function gate(key, ok) {
        var sel = hs.querySelector('select[data-launch-switch="' + key + '"]');
        if (!sel) return;
        Array.prototype.forEach.call(sel.options, function (o) { o.disabled = !!o.value && !ok(o.value); });
        if (sel.selectedOptions[0] && sel.selectedOptions[0].disabled) { sel.value = ''; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      var auto = hs.querySelector('select[data-launch-switch="double-hip"]');
      var want = full.hip && full.chest ? 'both' : full.hip ? 'hip' : full.chest ? 'chest' : '';
      if (auto && auto.value !== want) { auto.value = want; auto.dispatchEvent(new Event('change', { bubbles: true })); }
      // Every object stays pickable (2026-10-26: "the drop down menu for object track vr isnt working"); the launcher names a
      // missing tracker if she launches without one.
    });
    box.dispatchEvent(new CustomEvent('strapper-change'));
  }
  if (strapper) {
    strapper.addEventListener('change', strap);
    box.addEventListener('change', function (e) { if (e.target.matches && e.target.matches('[data-launch-switch="rooted"]')) strap(); });
    box.addEventListener('strapper-load', strap);
    // Clicking a spot on her drawing opens its picker right there (Astra, 2026-10-25: "I want to just click the spot on
    // him, then drop down assign a device from there"). The picker is a copy of the spot's own select; a choice goes
    // into that select, so the launcher script sends it as before.
    var stage = strapper.querySelector('[data-strap-stage]'), pop = strapper.querySelector('[data-strap-pop]');
    var popSelect = pop.querySelector('[data-strap-pop-select]'), popFor = null;
    function closePop() { pop.hidden = true; if (popFor) popFor.classList.remove('is-open'); popFor = null; }
    function openPop(g) {
      var code = g.getAttribute('data-strap-dot'), own = strapper.querySelector('[data-strap-spot="' + code + '"]');
      if (popFor) popFor.classList.remove('is-open');
      popFor = g; g.classList.add('is-open');
      pop.querySelector('[data-strap-pop-name]').textContent = spotName(code);
      popSelect.textContent = '';
      Array.prototype.forEach.call(own.options, function (o) { var c = document.createElement('option'); c.value = o.value; c.textContent = o.textContent; popSelect.appendChild(c); });
      popSelect.value = own.value;
      popSelect.disabled = own.disabled;
      pop.querySelector('[data-strap-pop-note]').hidden = !own.disabled;
      pop.hidden = false;
      var dot = g.getBoundingClientRect(), box2 = stage.getBoundingClientRect();
      var left = dot.left - box2.left + stage.scrollLeft + dot.width + 6, top = dot.top - box2.top + stage.scrollTop - 8;
      if (left + pop.offsetWidth > stage.scrollWidth - 4) left = Math.max(4, dot.left - box2.left + stage.scrollLeft - pop.offsetWidth - 6);
      pop.style.left = left + 'px'; pop.style.top = Math.max(4, top) + 'px';
      if (!popSelect.disabled) popSelect.focus();
    }
    popSelect.addEventListener('change', function (e) {
      e.stopPropagation();
      var own = popFor && strapper.querySelector('[data-strap-spot="' + popFor.getAttribute('data-strap-dot') + '"]');
      if (!own) return;
      own.value = popSelect.value;
      own.dispatchEvent(new Event('change', { bubbles: true }));
      closePop();
    });
    pop.querySelector('[data-strap-pop-close]').addEventListener('click', closePop);
    strapper.addEventListener('click', function (e) {
      var g = e.target.closest && e.target.closest('[data-strap-dot]');
      if (g) openPop(g);
      else if (!pop.hidden && !(e.target.closest && e.target.closest('[data-strap-pop]'))) closePop();
    });
    strapper.addEventListener('keydown', function (e) {
      var g = e.target.closest && e.target.closest('[data-strap-dot]');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPop(g); }
      if (e.key === 'Escape' && !pop.hidden) { var back = popFor; closePop(); if (back) back.focus(); }
    });
  }
  Array.prototype.forEach.call(box.querySelectorAll('[data-launch-headset]'), function (hs) {
    var id = hs.getAttribute('data-launch-headset');
    var s = saved[id] = saved[id] || { switches: {}, tries: {} };
    var switches = hs.querySelectorAll('[data-launch-switch]');
    function value(input) { return input.type === 'checkbox' ? input.checked : input.value; }
    // OSCGoesBrrr drives the Lovense toys: a toy ticked ticks it, and it unticked unticks the toys; it may still be on
    // with no toy (Astra, 2026-10-26: "if any of the Lovense are selected, the OSCGoesBrrr is automatically selected.
    // just as if its turned off, the lovense devices are unselected").
    hs.addEventListener('change', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-launch-switch');
      var osc = hs.querySelector('[data-launch-switch="oscgoesbrrr"]');
      if (!k || !osc) return;
      function set(input, on) { if (input.checked !== on) { input.checked = on; input.dispatchEvent(new Event('change', { bubbles: true })); } }
      if (/^lovense-/.test(k) && e.target.checked) set(osc, true);
      if (k === 'oscgoesbrrr' && !osc.checked) Array.prototype.forEach.call(hs.querySelectorAll('[data-launch-switch^="lovense-"]'), function (c) { set(c, false); });
    });
    function refresh() {
      var sw = {};
      Array.prototype.forEach.call(switches, function (input) { sw[input.getAttribute('data-launch-switch')] = value(input); });
      // Each mode's start list names the chosen streamer and shows a switch's program while it is on.
      var picker = hs.querySelector('select[data-launch-switch="streamer"]');
      var streamerName = picker && picker.selectedOptions[0] ? picker.selectedOptions[0].textContent : '';
      var best = null;
      Array.prototype.forEach.call(hs.querySelectorAll('[data-launch-mode]'), function (card) {
        Array.prototype.forEach.call(card.querySelectorAll('[data-launch-extra]'), function (li) {
          var k = li.getAttribute('data-launch-extra');
          li.hidden = !sw[k];
          // A program with a choice (Double Hip, Double Chest or both) says which, after its name.
          var pick = hs.querySelector('select[data-launch-switch="' + k + '"]');
          if (pick && sw[k] && pick.selectedOptions[0]) li.textContent = li.getAttribute('data-launch-base') + ' (' + pick.selectedOptions[0].textContent + ')';
        });
        Array.prototype.forEach.call(card.querySelectorAll('[data-launch-streamer]'), function (li) { if (streamerName) li.textContent = streamerName; });
        var warn = card.querySelector('.launch-warn');
        if (warn) warn.hidden = (card.getAttribute('data-untested') || '').split(' ').indexOf(sw.streamer) < 0;
        var t = s.tries[card.getAttribute('data-launch-mode')];
        card.setAttribute('data-rating', (t && t.rating) || '');
        if (t && RANK[t.rating] && (!best || RANK[t.rating] > RANK[best.rating])) best = { rating: t.rating, name: card.querySelector('legend').textContent };
      });
      var bestLine = hs.querySelector('[data-launch-best]'); // the blurb line is gone (2026-10-24); kept only if a page has one
      if (bestLine) bestLine.textContent = best ? 'Best so far: ' + best.name + ' (' + best.rating + ').' : 'No tries rated yet.';
    }
    Array.prototype.forEach.call(switches, function (input) {
      var k = input.getAttribute('data-launch-switch');
      // Double Hip was a tick box before 2026-10-24: a saved tick means Double Hip, no tick means off.
      if (k in s.switches) { if (input.type === 'checkbox') input.checked = !!s.switches[k]; else input.value = s.switches[k] === true ? 'hip' : s.switches[k] === false ? '' : s.switches[k]; }
      input.addEventListener('change', function () { s.switches[k] = value(input); save(); refresh(); });
    });
    Array.prototype.forEach.call(hs.querySelectorAll('[data-launch-mode]'), function (card) {
      var m = card.getAttribute('data-launch-mode');
      var rating = card.querySelector('[data-launch-rating]'), note = card.querySelector('[data-launch-note]'), tried = card.querySelector('[data-launch-tried]');
      var t = s.tries[m] || {};
      rating.value = t.rating || ''; note.value = t.note || '';
      tried.textContent = t.day ? 'last changed ' + t.day : '';
      function keep() {
        s.tries[m] = { rating: rating.value, note: note.value, day: localDay() };
        tried.textContent = 'last changed ' + s.tries[m].day;
        save(); refresh();
      }
      rating.addEventListener('change', keep);
      note.addEventListener('change', keep);
    });
    refresh();
  });
  strap();
  })();

  // ---- A tool that works right on the page (an <iframe class="tool-frame"> in its tool panel) says how tall it is, so
  // its panel fits it (Astra's Window Star, 2026-10-20). Only the tool page in that panel is listened to, from the site
  // its panel opened (on any farm, whoever's site that is), and only for a height. ----
  function originOf(src) { try { return new URL(src, location.href).origin; } catch (e) { return null; } }
  window.addEventListener('message', function (e) {
    var msg = e.data;
    if (!msg || msg.type !== 'tool-panel-height') return;
    var frames = document.querySelectorAll('iframe.tool-frame');
    for (var i = 0; i < frames.length; i++) {
      // A wide tool in its own tool box (Bass & Biscuits' APC64 board, kits and lessons) may be long: its box grows to
      // fit it, with no scroll bar inside (Astra, 2026-11-02: "get rid of like the scroll bar on it").
      if (frames[i].contentWindow === e.source && e.origin === originOf(frames[i].getAttribute('src'))) frames[i].style.height = Math.min(frames[i].classList.contains('wide') ? 12000 : 1400, Math.max(200, Number(msg.height) || 0)) + 'px';
    }
  });
})();
