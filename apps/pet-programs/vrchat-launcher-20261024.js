// The Launch buttons on Rift Rabbit's VRChat launch panel (Astra, 2026-10-24: "Maybe i need to turn off all of the
// launch dependencies so this can be the main control hub"; "Launching is done by Rift Rabbit"). Only Rift Rabbit's
// page loads this script. A web page cannot start programs, so it asks Rift Rabbit's own launcher on this PC
// (wonderland-launchpad-v1.0-vr-launch-v1.0, in findastra/rift-rabbit, which listens on 127.0.0.1 only). Where it listens and its code are in one fixed
// file in Documents, so only the page opened from this PC can read them; anywhere
// else the buttons stay off and nothing is sent. Each step of a launch shows in its mode's card while it runs. Text
// goes into the page with textContent only.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-24.
(function () {
  'use strict';
  var box = document.getElementById('vrchat-launch');
  if (!box) return;
  if (!(location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))) return;
  // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents.
  var LOCAL_LAUNCH = "../../../../Astra's PetOS Data/rift-rabbit/vr-launch-page-data.js";
  var MARK = { waiting: '○', now: '◔', you: '☛', done: '✓', skipped: '–', failed: '✗' };
  var launcher = null, run = null, timer = null;
  var gos = box.querySelectorAll('[data-launch-go]');
  Array.prototype.forEach.call(gos, function (b) { b.setAttribute('data-label', b.textContent); });

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function live(r) { return !!r && (r.state === 'running' || r.state === 'ready'); }

  // A mode can launch while the watch answers, its SteamVR driver is installed, and no other launch is running.
  function paintButtons(problem) {
    Array.prototype.forEach.call(gos, function (b) {
      var m = b.closest('[data-launch-mode]').getAttribute('data-launch-mode');
      var installed = !!(launcher && launcher.installed && launcher.installed[m]);
      // tracker-strapper says what a mode still needs on its spots (the page script fills data-launch-needs).
      var needs = b.closest('[data-launch-mode]').querySelector('[data-launch-needs]');
      var blocked = needs && !needs.hidden ? needs.textContent : '';
      b.disabled = !launcher || !installed || live(run) || !!blocked;
      b.classList.toggle('off', b.disabled);
      b.textContent = launcher && !installed ? b.getAttribute('data-label') + ': not installed' : b.getAttribute('data-label');
      b.title = problem || (!launcher ? "Works on Astra's PC while Rift Rabbit's launcher runs" : !installed ? 'Its SteamVR driver is not installed yet' : blocked || (live(run) ? 'A launch is running' : 'Start this mode’s programs in order'));
    });
  }

  function ask(path, extra) {
    var body = { code: launcher.code };
    for (var k in extra || {}) body[k] = extra[k];
    // text/plain keeps it a simple request: the watch checks the code and where the page was opened from.
    return fetch(launcher.url + path, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), cache: 'no-store' })
      .then(function (r) { return r.json(); });
  }

  function cardOf(r) {
    var hs = r && box.querySelector('[data-launch-headset="' + r.headset + '"]');
    return hs && hs.querySelector('[data-launch-mode="' + r.mode + '"]');
  }

  function draw(card, r, said) {
    var area = card.querySelector('[data-launch-run]');
    // Drawn again only when something changed, so a button is never swapped out from under a click.
    var drawn = JSON.stringify([r, said || null]);
    if (!area.hidden && area.getAttribute('data-drawn') === drawn) return;
    area.setAttribute('data-drawn', drawn);
    area.hidden = false;
    area.textContent = '';
    // What the launcher last said (Stopped, done, a problem) comes first, above the steps (Astra, 2026-10-26: "move the
    // stopped part to the top above the line").
    var line = said || (r && r.said);
    if (line) area.appendChild(el('p', 'small launch-said', line));
    if (r) {
      var ol = el('ol', 'small launch-steps');
      r.steps.forEach(function (s) {
        var li = el('li');
        li.setAttribute('data-state', s.state);
        li.appendChild(el('span', 'launch-mark', MARK[s.state] || ''));
        li.appendChild(document.createTextNode(' ' + s.name));
        if (s.note) li.appendChild(el('span', 'launch-step-note', ' ' + s.note));
        ol.appendChild(li);
      });
      area.appendChild(ol);
      // What Start VRChat waits for: a light for each device and program.
      if (r.checks && r.checks.length && live(r)) {
        var checks = el('ul', 'small launch-checks');
        r.checks.forEach(function (c) { var li = el('li', null, c.name); li.setAttribute('data-on', c.on ? 'yes' : 'no'); checks.appendChild(li); });
        area.appendChild(checks);
      }
    }
    if (!live(r)) return;
    var row = el('p', 'launch-run-buttons');
    var waitingOnYou = r.steps.some(function (s) { return (s.id === 'headset' || s.id === 'streamer-on-headset') && s.state === 'you'; });
    if (waitingOnYou) row.appendChild(button('Next', 'next', true, 'The headset is connected; start SteamVR now'));
    if (r.steps.some(function (s) { return s.id === 'wait' && s.state !== 'waiting'; })) row.appendChild(button('Start VRChat', 'vrchat', r.state === 'ready', r.state === 'ready' ? 'Everything is on' : 'Waiting until everything is on'));
    row.appendChild(button('Stop', 'stop', true, 'Stop the launch; programs that are open stay open'));
    area.appendChild(row);
  }

  function button(text, path, on, title) {
    var b = el('button', 'button' + (on ? '' : ' off'), text);
    b.type = 'button'; b.disabled = !on; b.title = title;
    b.addEventListener('click', function () { b.disabled = true; ask('/' + path).then(show, lost); });
    return b;
  }

  // Draw what the watch said, and ask again every second while the launch runs.
  function show(res, card) {
    if (res && res.run) run = res.run;
    var target = cardOf(res && res.run) || card;
    if (target) draw(target, res && res.run, res && res.ok === false ? res.said : null);
    paintButtons();
    clearTimeout(timer);
    if (live(run)) timer = setTimeout(function () { ask('/status').then(show, lost); }, 1000);
  }

  function lost() {
    clearTimeout(timer);
    var card = cardOf(run);
    run = null; launcher = null;
    paintButtons("Rift Rabbit's launcher is not answering");
    if (card) card.querySelector('[data-launch-run]').removeAttribute('data-drawn');
    if (card) card.querySelector('[data-launch-run]').appendChild(el('p', 'small launch-said', "Rift Rabbit's launcher is not answering. Start it (rift-rabbit-20261024.exe), then reload this page."));
  }

  Array.prototype.forEach.call(gos, function (b) {
    b.addEventListener('click', function () {
      var hs = b.closest('[data-launch-headset]'), card = b.closest('[data-launch-mode]');
      function pick(k) { var i = hs.querySelector('[data-launch-switch="' + k + '"]'); return !i ? null : i.type === 'checkbox' ? i.checked : i.value; }
      b.disabled = true;
      ask('/launch', { headset: hs.getAttribute('data-launch-headset'), mode: card.getAttribute('data-launch-mode'), streamer: pick('streamer'), double: pick('double-hip') || '', object: pick('object-track') || '', osc: !!pick('oscgoesbrrr'), woojer: !!pick('woojer'), face: pick('face') === true, fov: !!pick('fov'), pole: !!pick('pole') })
        .then(function (res) { show(res, card); }, lost);
    });
  });

  // tracker-strapper's spots live in the launcher's settings on this PC: shown from its page file, changed through it.
  var strapper = box.querySelector('[data-strapper]');
  var said = strapper && strapper.querySelector('[data-strap-said]');
  function showSpots(d) {
    if (!strapper || !d || !d.spots) return;
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) {
      var v = d.spots[sel.getAttribute('data-strap-spot')] || '';
      sel.value = Array.prototype.some.call(sel.options, function (o) { return o.value === v; }) ? v : '';
    });
    box.dispatchEvent(new CustomEvent('strapper-load'));
  }
  function sendSpots() {
    var spots = {};
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) { if (sel.value) spots[sel.getAttribute('data-strap-spot')] = sel.value; });
    said.textContent = 'Saving…';
    // The launcher works out the Double pairs from the spots itself (2026-10-26).
    ask('/spots', { spots: spots }).then(function (res) {
      // The launcher's answer is what it kept: a change it refused goes back.
      showSpots(res);
      said.textContent = res && res.ok ? 'Saved on this PC. Launches use these spots.' : (res && res.said) || 'Not saved.';
    }, lost);
  }
  if (strapper) {
    strapper.addEventListener('change', function (e) {
      if (!launcher || !e.target.matches('[data-strap-spot]')) return;
      // One tracker on one spot: putting it on a new spot takes it off the old one.
      if (e.target.matches('[data-strap-spot]') && /^vive-tracker-/.test(e.target.value))
        Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) { if (sel !== e.target && sel.value === e.target.value) sel.value = ''; });
      sendSpots();
    });
  }
  box.addEventListener('strapper-change', function () { paintButtons(); });
  // Base Station FOV Viewer and VR Pole Overlay ticks only add them to the launch (Astra, 2026-10-26: "clicking the VR
  // Pole Overlay automatically opens it, I just need this to add to the sequence until launched"); to open one any time
  // she uses its row under 3rd party programs.

  // The dongle map (Astra, 2026-10-26: "show Current Layout on the Left as shown, and then Recommended Layout on the
  // right"; "make it so the dongles are labeled by which one they are corresponding to the models available"). The
  // launcher runs USBDeview and sends back each USB controller's branches; drawn with textContent. SteamVR does not log
  // which tracker a dongle is paired with, so she names each dongle once from her own devices; this PC remembers it.
  var dongle = document.querySelector('[data-dongle-map]');
  var lastScan = null, MAP_KEY = 'rift-rabbit-dongle-devices';
  function readMap() { try { return JSON.parse(localStorage.getItem(MAP_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writeMap(m) { try { localStorage.setItem(MAP_KEY, JSON.stringify(m)); } catch (e) { /* kept for this visit only */ } }
  function isDongle(n) { return n.kind === 'tracker-dongle'; }
  function dongles(n) { return (isDongle(n) ? 1 : 0) + (n.children || []).reduce(function (a, c) { return a + dongles(c); }, 0); }
  // Genesys hub chips: GL850 (05E3:0608) has one transaction translator for all its ports, GL852 (05E3:0610) one each.
  function hubKind(n) { var id = n.id || ''; return /VID_05E3&PID_0608/i.test(id) ? 'single' : /VID_05E3&PID_0610/i.test(id) ? 'multi' : /PID_0626/i.test(id) ? 'usb3' : ''; }
  function controllerName(n) {
    var v = /USB (2\.0|3\.\d+)/.exec(n.name || '');
    return 'USB ' + (v ? v[1] : '') + ' controller' + (/DEV_15B[6-8]/i.test(n.id || '') ? ' (on the CPU)' : /DEV_43EF/i.test(n.id || '') ? ' (on the chipset)' : '');
  }
  // Her devices that need a dongle, from tracker-strapper's lists: every Vive Tracker and both Index controllers.
  function deviceChoices() {
    var seen = {}, list = [];
    if (!strapper) return list;
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot] option'), function (o) {
      if (!/^(vive-tracker-|index-controller-)/.test(o.value) || seen[o.value]) return;
      seen[o.value] = true;
      list.push({ id: o.value, name: (o.getAttribute('data-short') || o.textContent).replace(/^Index Knuckles$/, 'Index controller') + (/-right$/.test(o.value) ? ' (R)' : /-left$/.test(o.value) ? ' (L)' : '') });
    });
    return list;
  }
  function branch(n, depth) {
    // The root hub only repeats its controller, so its devices hang straight off the controller.
    if (n.kind === 'root-hub') { var f = document.createDocumentFragment(); (n.children || []).forEach(function (c) { f.appendChild(branch(c, depth)); }); return f; }
    var li = el('li', 'dongle-node');
    li.setAttribute('data-kind', n.kind);
    var line = el('span', 'dongle-line'), port = (n.location || '').match(/Port_#0*(\d+)/);
    if (n.kind === 'controller') {
      line.appendChild(el('b', null, controllerName(n)));
      var count = dongles(n);
      if (count) line.appendChild(el('span', 'dongle-count', ' · ' + count + ' dongle' + (count === 1 ? '' : 's')));
    } else if (n.kind === 'hub') {
      var k = hubKind(n);
      line.appendChild(el('b', null, k === 'usb3' ? 'USB 3 hub' : 'Hub'));
      if (k === 'single') { var w = el('span', 'dongle-flag', ' · single-TT: all its ports share one 12 Mbit/s lane'); line.appendChild(w); li.setAttribute('data-warn', 'yes'); }
      if (k === 'multi') line.appendChild(el('span', 'dongle-port', ' · multi-TT'));
      if (port) line.appendChild(el('span', 'dongle-port', ' · port ' + port[1]));
    } else if (isDongle(n)) {
      var map = readMap(), pick = el('select', 'dongle-pick');
      pick.setAttribute('aria-label', 'Which device this dongle is paired with');
      pick.appendChild(new Option('Which device?', ''));
      deviceChoices().forEach(function (d) { pick.appendChild(new Option(d.name, d.id)); });
      pick.value = map[n.serial] || '';
      pick.addEventListener('change', function () { var m = readMap(); if (pick.value) m[n.serial] = pick.value; else delete m[n.serial]; writeMap(m); recommend(); });
      line.appendChild(el('b', null, 'Watchman '));
      line.appendChild(pick);
      if (port) line.appendChild(el('span', 'dongle-port', ' · port ' + port[1]));
      line.appendChild(el('span', 'dongle-serial', ' · ' + n.serial));
    } else {
      line.appendChild(el('span', 'dongle-other', n.kind === 'radio' ? 'Valve VR Radio' : n.name));
      if (port) line.appendChild(el('span', 'dongle-port', ' · port ' + port[1]));
    }
    li.appendChild(line);
    var kids = (n.children || []);
    if (kids.length) { var ul = el('ul', 'dongle-branches'); kids.forEach(function (c) { ul.appendChild(branch(c, depth + 1)); }); li.appendChild(ul); }
    return li;
  }

  // The recommended layout for the launch she plans, from the spots she wears (2026-10-26: "The dongle map should suggest
  // a layout based on the tracking locations/devices, and the desired launch option"). One answer, with its reasons.
  var HEAD_MODES = ['space-calibrator', 'space-override', 'space-sync'];
  var OBJECT_SPOTS = { 'dance-pole': ['DP'], 'large-hoop': ['BDH', 'BDT'], 'small-hoop': ['LDH', 'LDT'] };
  var LOW = ['RF', 'LF', 'RA', 'LA', 'RK', 'LK'];
  function recommend() {
    var out = dongle && dongle.querySelector('[data-dongle-suggest]'), planFor = dongle && dongle.querySelector('[data-dongle-for]');
    if (!out || !strapper) return;
    var pick = (planFor.value || 'quest-pro|native').split('|'), hs = box.querySelector('[data-launch-headset="' + pick[0] + '"]');
    var objSel = hs && hs.querySelector('select[data-launch-switch="object-track"]'), obj = objSel ? objSel.value : '';
    var map = readMap(), serialOf = {};
    Object.keys(map).forEach(function (s) { serialOf[map[s]] = s; });
    var groups = { high: [], low: [] };
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) {
      var code = sel.getAttribute('data-strap-spot'), dev = sel.value, o = sel.options[sel.selectedIndex];
      if (!dev || !/^(vive-tracker-|index-controller-)/.test(dev)) return;
      if (code === 'H' && HEAD_MODES.indexOf(pick[1]) < 0) return;
      var objOf = Object.keys(OBJECT_SPOTS).filter(function (k) { return OBJECT_SPOTS[k].indexOf(code) >= 0; })[0];
      if (objOf && objOf !== obj) return;
      var where = strapper.querySelector('[data-strap-row="' + code + '"] .strap-name');
      var spot = where ? where.textContent.replace(/\s*\[[^\]]*\]\s*$/, '').replace(/^\d+\s+/, '') : code;
      var name = (o.getAttribute('data-short') || o.textContent).replace(/^Vive\s*/, '').replace(/\s*\[[^\]]*\]/, '').replace(/^Index Knuckles$/, 'Index controller');
      groups[LOW.indexOf(code) >= 0 ? 'low' : 'high'].push({ label: name + ' · ' + spot, dongle: serialOf[dev] || '' });
    });
    out.textContent = '';
    var total = groups.high.length + groups.low.length;
    out.appendChild(el('p', 'small dongle-plan-head', total + ' dongle' + (total === 1 ? '' : 's') + ' for this launch.'));
    var ctrl = (lastScan && lastScan.controllers || []).map(controllerName);
    var hubs = [['high', 'Hub A · high on the wall, facing the play space', 'head, chest, waist, elbows, hands, hoop and pole'], ['low', 'Hub B · low, at the front edge of the desk', 'feet, ankles and knees']];
    hubs.forEach(function (h, i) {
      var items = groups[h[0]];
      if (!items.length) return;
      var sec = el('div', 'dongle-hub');
      sec.appendChild(el('b', null, h[1]));
      sec.appendChild(el('span', 'small dongle-port', ' · ' + h[2] + (ctrl.length > 1 ? ' · on a ' + ctrl[i % ctrl.length] : ' · on its own USB controller')));
      var ul = el('ul', 'small dongle-items');
      items.forEach(function (it) { var li = el('li', null, it.label); if (it.dongle) li.appendChild(el('span', 'dongle-serial', ' · dongle ' + it.dongle)); ul.appendChild(li); });
      sec.appendChild(ul);
      out.appendChild(sec);
    });
    var how = el('ul', 'small dongle-rules');
    ['Each dongle in its cradle on a USB 2.0 extension, about 40 cm from the next, upright.', 'At least 45 cm from the PC (HTC’s own rule), with nothing metal or USB 3 next to it.',
      'Powered multi-TT USB 2.0 hubs, one hub between the PC and each dongle.', 'The keyboard receiver and the Game Drive on other ports, not on the dongle hubs.'].forEach(function (t) { how.appendChild(el('li', null, t)); });
    out.appendChild(how);
    // What today's scan does differently.
    if (lastScan) {
      var flags = [], deep = 0, single = 0, onCtrl = 0, others = 0;
      (function walk(n, hubs, sTT) {
        var k = n.kind === 'hub' ? hubKind(n) : '';
        var h = hubs + (n.kind === 'hub' ? 1 : 0), s = sTT || k === 'single';
        if (isDongle(n)) { deep = Math.max(deep, h); if (s) single++; }
        if (n.kind === 'device' && h > 0 && n.name && /receiver|drive/i.test(n.name)) others++;
        (n.children || []).forEach(function (c) { walk(c, h, s); });
      })({ children: lastScan.controllers || [] }, 0, false);
      (lastScan.controllers || []).forEach(function (c) { if (dongles(c) > 0) onCtrl++; });
      var found = lastScan.dongles || 0;
      if (found < total) flags.push('This launch needs ' + total + ' dongles; ' + found + ' are plugged in.');
      if (single) flags.push(single + ' dongle' + (single === 1 ? '' : 's') + ' share a single-TT hub: swap it for a multi-TT hub.');
      if (deep > 1) flags.push('Some dongles sit ' + deep + ' hubs deep: keep it to one.');
      if (onCtrl === 1 && found > 4) flags.push('All ' + found + ' are on one USB controller: split them over two.');
      if (others) flags.push('A 2.4 GHz receiver or a drive shares the dongle hubs: move it.');
      if (flags.length) { var f = el('ul', 'small dongle-flags'); flags.forEach(function (t) { f.appendChild(el('li', null, t)); }); out.appendChild(f); }
    }
  }
  if (dongle) {
    var scan = dongle.querySelector('[data-dongle-scan]'), dsaid = dongle.querySelector('[data-dongle-said]'), tree = dongle.querySelector('[data-dongle-tree]');
    var planFor = dongle.querySelector('[data-dongle-for]');
    if (planFor) planFor.addEventListener('change', recommend);
    box.addEventListener('strapper-change', recommend);
    box.addEventListener('change', function (e) { if (e.target.matches && e.target.matches('[data-launch-switch="object-track"]')) recommend(); });
    recommend();
    scan.addEventListener('click', function () {
      scan.disabled = true; dsaid.textContent = 'Scanning…';
      ask('/usb-map').then(function (res) {
        scan.disabled = false;
        tree.textContent = '';
        if (!res || !res.ok) { dsaid.textContent = (res && res.said) || 'The scan did not work.'; return; }
        lastScan = res;
        dsaid.textContent = res.dongles + ' Watchman dongles found, ' + new Date(res.time).toLocaleTimeString() + '.';
        var ul = el('ul', 'dongle-branches dongle-root');
        (res.controllers || []).filter(function (c) { return dongles(c) > 0; }).concat((res.controllers || []).filter(function (c) { return dongles(c) === 0; })).forEach(function (c) { ul.appendChild(branch(c, 0)); });
        tree.appendChild(ul);
        recommend();
      }, lost);
    });
  }

  var script = document.createElement('script');
  script.setAttribute('src', LOCAL_LAUNCH + '?t=' + Date.now());
  script.onload = function () {
    script.remove();
    var d = window.riftRabbitLaunch;
    // Only this PC's address, and only a code that looks like one.
    if (!d || d.schema !== 'rift-rabbit-vr-launch-v1' || d.on !== true || !/^http:\/\/127\.0\.0\.1:\d{2,5}\/$/.test(d.url) || !/^[0-9a-f]{32,}$/i.test(d.code)) return;
    launcher = { url: d.url.slice(0, -1), code: d.code, installed: d.installed || {} };
    if (strapper) {
      Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) { sel.disabled = false; });
      said.textContent = 'Kept in Rift Rabbit’s launcher on this PC. A change saves at once.';
      showSpots(d);
    }
    if (dongle) { var sc = dongle.querySelector('[data-dongle-scan]'); sc.disabled = false; sc.classList.remove('off'); dongle.querySelector('[data-dongle-said]').textContent = 'Reads what is plugged in right now; nothing is changed.'; }
    paintButtons();
    // A launch still running (the page was reloaded) shows again in its card; a finished or stopped one does not.
    ask('/status').then(function (res) { if (res && live(res.run)) show(res); }, lost);
  };
  script.onerror = function () { script.remove(); };
  document.head.appendChild(script);
})();
