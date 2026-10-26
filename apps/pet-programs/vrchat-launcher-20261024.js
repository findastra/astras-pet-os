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
    if (n.label) return n.label;
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
  // a layout based on the tracking locations/devices, and the desired launch option").
  var HEAD_MODES = ['space-calibrator', 'space-override', 'space-sync'];
  var OBJECT_SPOTS = { 'dance-pole': ['DP'], 'large-hoop': ['BDH', 'BDT'], 'small-hoop': ['LDH', 'LDT'] };
  var LOW = ['RF', 'LF', 'RA', 'LA', 'RK', 'LK'];
  // The recommended layout is the current one rearranged (Astra, 2026-10-26: "I want the recommended layout to be
  // generated based on what you have in current layout"): the same dongles and her own hubs, each dongle under the hub
  // for where its device is worn, one hub deep, the hubs spread over her USB controllers. The launch she plans decides
  // which dongles it needs; the rest are listed apart.
  function readScan(scanRes) {
    var found = { dongles: [], hubs: [], others: [], controllers: [] };
    (scanRes.controllers || []).forEach(function (c) {
      var ctrl = { name: controllerName(c), others: 0, node: c };
      found.controllers.push(ctrl);
      (function walk(n, depth, single, where) {
        (n.children || []).forEach(function (k) {
          var port = (k.location || '').match(/Port_#0*(\d+)/), hk = k.kind === 'hub' ? hubKind(k) : '';
          var at = where.concat(k.kind === 'hub' ? [(hk === 'single' ? 'single-TT hub' : 'hub') + (port ? ' port ' + port[1] : '')] : []);
          if (k.kind === 'hub') found.hubs.push({ kind: hk });
          if (isDongle(k)) found.dongles.push({ serial: k.serial, depth: depth, single: single, ctrl: ctrl.name, port: port ? port[1] : '', where: where });
          else if (k.kind === 'device') { ctrl.others++; if (depth > 0 && /receiver|drive/i.test(k.name || '')) found.others.push({ name: k.name, ctrl: ctrl.name }); }
          walk(k, depth + (k.kind === 'hub' ? 1 : 0), single || hk === 'single', at);
        });
      })(c, 0, false, []);
    });
    return found;
  }
  function recommend() {
    var out = dongle && dongle.querySelector('[data-dongle-suggest]'), planFor = dongle && dongle.querySelector('[data-dongle-for]');
    if (!out || !strapper) return;
    out.textContent = '';
    if (!lastScan) { out.appendChild(el('p', 'small', 'Scan USB first: the recommendation is built from your current layout.')); return; }
    var pick = (planFor.value || 'quest-pro|native').split('|'), hs = box.querySelector('[data-launch-headset="' + pick[0] + '"]');
    var objSel = hs && hs.querySelector('select[data-launch-switch="object-track"]'), obj = objSel ? objSel.value : '';
    // Which spot each of her devices is on, and whether this launch uses it.
    var spotOf = {}, needed = {}, label = {};
    Array.prototype.forEach.call(strapper.querySelectorAll('[data-strap-spot]'), function (sel) {
      var code = sel.getAttribute('data-strap-spot'), dev = sel.value, o = sel.options[sel.selectedIndex];
      if (!dev || !/^(vive-tracker-|index-controller-)/.test(dev)) return;
      var where = strapper.querySelector('[data-strap-row="' + code + '"] .strap-name');
      spotOf[dev] = { code: code, name: where ? where.textContent.replace(/\s*\[[^\]]*\]\s*$/, '').replace(/^\d+\s+/, '') : code };
      label[dev] = (o.getAttribute('data-short') || o.textContent).replace(/^Vive\s*/, '').replace(/\s*\[[^\]]*\]/, '').replace(/^Index Knuckles$/, 'Index controller');
      var objOf = Object.keys(OBJECT_SPOTS).filter(function (k) { return OBJECT_SPOTS[k].indexOf(code) >= 0; })[0];
      needed[dev] = !(code === 'H' && HEAD_MODES.indexOf(pick[1]) < 0) && !(objOf && objOf !== obj);
    });
    var map = readMap(), found = readScan(lastScan);
    var groups = { high: [], low: [] }, spare = [], unnamed = [];
    found.dongles.forEach(function (d) {
      var dev = map[d.serial], spot = dev && spotOf[dev];
      d.text = dev ? (label[dev] || dev) + (spot ? ' · ' + spot.name : ' · not on a spot') : 'Which device? Pick it on the left';
      if (!dev) unnamed.push(d);
      if (dev && (!spot || !needed[dev])) { spare.push(d); return; }
      groups[spot && LOW.indexOf(spot.code) >= 0 ? 'low' : 'high'].push(d);
    });
    // Her own multi-TT hubs (4 ports each) carry the dongles, one hub per group of four, each straight on a controller,
    // the controllers with the fewest other devices first.
    var multi = found.hubs.filter(function (h) { return h.kind === 'multi'; }).length;
    var ctrls = found.controllers.slice().sort(function (a, b) { return a.others - b.others; });
    var hubs = [];
    [['high', 'A', 'high on the wall, facing the play space'], ['low', 'B', 'low, at the front edge of the desk']].forEach(function (g) {
      for (var i = 0; i < groups[g[0]].length; i += 4) hubs.push({ name: 'Hub ' + g[1] + (groups[g[0]].length > 4 ? (i / 4 + 1) : ''), where: g[2], items: groups[g[0]].slice(i, i + 4) });
    });
    hubs.forEach(function (h, i) { h.at = ctrls.length ? ctrls[i % ctrls.length] : null; });
    var total = groups.high.length + groups.low.length;
    out.appendChild(el('p', 'small dongle-plan-head', total + ' of your ' + found.dongles.length + ' dongles in this launch, on ' + hubs.length + ' hub' + (hubs.length === 1 ? '' : 's') + (multi >= hubs.length ? ' (you have ' + multi + ' multi-TT hubs already).' : ' (you have ' + multi + ' multi-TT hubs; get ' + (hubs.length - multi) + ' more).')));
    // The same tree as Current, rearranged.
    var root = el('ul', 'dongle-branches dongle-root');
    ctrls.forEach(function (c) {
      var mine = hubs.filter(function (h) { return h.at === c; });
      var li = el('li', 'dongle-node'); li.setAttribute('data-kind', 'controller');
      var line = el('span', 'dongle-line'); line.appendChild(el('b', null, c.name));
      var n = mine.reduce(function (a, h) { return a + h.items.length; }, 0);
      if (n) line.appendChild(el('span', 'dongle-count', ' · ' + n + ' dongle' + (n === 1 ? '' : 's')));
      li.appendChild(line);
      var ul = el('ul', 'dongle-branches');
      mine.forEach(function (h) {
        var hl = el('li', 'dongle-node'); hl.setAttribute('data-kind', 'hub');
        var hline = el('span', 'dongle-line'); hline.appendChild(el('b', null, h.name)); hline.appendChild(el('span', 'dongle-port', ' · multi-TT, powered · ' + h.where));
        hl.appendChild(hline);
        var hul = el('ul', 'dongle-branches');
        h.items.forEach(function (d, k) {
          var dl = el('li', 'dongle-node'); dl.setAttribute('data-kind', 'tracker-dongle');
          var dline = el('span', 'dongle-line'); dline.appendChild(el('b', null, 'Watchman '));
          dline.appendChild(el('span', map[d.serial] ? 'dongle-dev' : 'dongle-flag', d.text));
          dline.appendChild(el('span', 'dongle-port', ' · port ' + (k + 1)));
          var was = 'now ' + (d.depth === 0 ? 'on the controller' : d.depth + ' hub' + (d.depth === 1 ? '' : 's') + ' deep') + (d.single ? ', behind the single-TT hub' : '') + (d.ctrl !== c.name ? ', on the ' + d.ctrl : '');
          dline.appendChild(el('span', 'dongle-serial', ' · ' + d.serial + ' (' + was + ')'));
          dl.appendChild(dline); hul.appendChild(dl);
        });
        hl.appendChild(hul); ul.appendChild(hl);
      });
      // The keyboard receiver and the drive go to the controller with no dongle hub, or the last one.
      if (!mine.length || c === ctrls[ctrls.length - 1]) found.others.splice(0).forEach(function (o) {
        var ol = el('li', 'dongle-node'); ol.setAttribute('data-kind', 'device');
        ol.appendChild(el('span', 'dongle-line dongle-other', o.name + ' · moved here, off the dongle hubs'));
        ul.appendChild(ol);
      });
      if (ul.children.length) li.appendChild(ul);
      root.appendChild(li);
    });
    out.appendChild(root);
    if (spare.length) {
      var sp = el('p', 'small dongle-rules', 'Not needed for this launch: ' + spare.map(function (d) { return d.text + ' (' + d.serial + ')'; }).join('; ') + '.');
      out.appendChild(sp);
    }
    if (unnamed.length) out.appendChild(el('p', 'small dongle-flag', unnamed.length + ' dongle' + (unnamed.length === 1 ? ' has' : 's have') + ' no device picked yet, so ' + (unnamed.length === 1 ? 'it is' : 'they are') + ' placed on Hub A until you pick.'));
    if (found.hubs.some(function (h) { return h.kind === 'single'; })) out.appendChild(el('p', 'small dongle-flag', 'Unplug the single-TT hub (05E3:0608): nothing goes through it.'));
    var how = el('ul', 'small dongle-rules');
    ['Each dongle in its cradle on a USB 2.0 extension, about 40 cm from the next, upright.', 'At least 45 cm from the PC (HTC’s own rule), with nothing metal or USB 3 next to it.',
      'Each hub plugged straight into the PC, never into another hub.'].forEach(function (t) { how.appendChild(el('li', null, t)); });
    out.appendChild(how);
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
        // Two controllers can share a name: number them so each is told apart.
        var named = {};
        (res.controllers || []).forEach(function (c) { var nm = controllerName(c); (named[nm] = named[nm] || []).push(c); });
        Object.keys(named).forEach(function (nm) { if (named[nm].length > 1) named[nm].forEach(function (c, i) { c.label = nm.replace(' controller', ' controller ' + (i + 1)); }); });
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

  // Poppy in 3D where the drawn figures stand (Astra, 2026-10-26: "3D render just put it as a mini model right in that
  // little spot where the body is"; "lets actually get a real 3D version of poppy for the trackers"). Her avatar is not
  // ours to publish, so a light copy lives only in Astra's PetOS Data on this PC (made from Poppy 1.fbx: body, face and
  // messy bun, no face shapes) and loads here only when it is there. Each spot gets a stand-in for the device on it
  // until the real device models are in; drag to turn her, click a spot to pick its device.
  var LOCAL_POPPY = "../../../../Astra's PetOS Data/rift-rabbit/poppy-mini-20261026.js";
  // Where each spot sits on her, from her bones (metres, she faces +z, her left is +x) plus an offset onto her skin.
  var POPPY_SPOTS = {
    F: ['Head', 0, 0.035, 0.085], H: ['Head', 0, 0.115, 0.07], FS: ['Chest', 0, 0.105, 0.085], BS: ['Chest', 0, 0.105, -0.1],
    FD: ['Chest', 0, -0.01, 0.095], BD: ['Chest', 0, -0.01, -0.095], FW: ['Hips', 0, -0.05, 0.085], BW: ['Hips', 0, -0.05, -0.1],
    RS: ['Hips', -0.15, -0.05, 0], LS: ['Hips', 0.15, -0.05, 0], RFS: ['Hips', -0.1, -0.05, 0.07], LFS: ['Hips', 0.1, -0.05, 0.07],
    RBS: ['Hips', -0.1, -0.05, -0.08], LBS: ['Hips', 0.1, -0.05, -0.08], RE: ['Elbow_R', -0.02, 0, -0.035], LE: ['Elbow_L', 0.02, 0, -0.035],
    RH: ['Wrist_R', -0.05, -0.05, 0.01], LH: ['Wrist_L', 0.05, -0.05, 0.01], RK: ['Knee_R', 0, 0.025, 0.06], LK: ['Knee_L', 0, 0.025, 0.06],
    RA: ['Foot_R', -0.045, 0.03, 0], LA: ['Foot_L', 0.045, 0.03, 0], RF: ['Big_Toe_R', 0, 0.045, -0.035], LF: ['Big_Toe_L', 0, 0.045, -0.035],
  };
  function miniModel(data) {
    var svg = strapper && strapper.querySelector('.strap-drawing'), stage = strapper && strapper.querySelector('[data-strap-stage]');
    if (!svg || !stage || !data || data.schema !== 'rift-rabbit-poppy-v1') return;
    var base = 'https://cdn.jsdelivr.net/npm/three@0.160.0/';
    import(base + 'build/three.module.js').then(function (THREE) {
      // Her copy holds plain positions and triangles, so it is read here straight from the GLB's JSON and binary chunks
      // (three's GLTFLoader needs an import map this page does not have).
      var bin = Uint8Array.from(atob(data.glb), function (c) { return c.charCodeAt(0); }).buffer;
      var dv = new DataView(bin), jsonLen = dv.getUint32(12, true);
      var gl = JSON.parse(new TextDecoder().decode(new Uint8Array(bin, 20, jsonLen)));
      var binStart = 20 + jsonLen + 8;
      function accessor(i) {
        var a = gl.accessors[i], v = gl.bufferViews[a.bufferView], n = { SCALAR: 1, VEC3: 3 }[a.type] * a.count;
        var off = binStart + (v.byteOffset || 0) + (a.byteOffset || 0);
        return a.componentType === 5126 ? new Float32Array(bin.slice(off, off + n * 4)) : a.componentType === 5125 ? new Uint32Array(bin.slice(off, off + n * 4)) : new Uint16Array(bin.slice(off, off + n * 2));
      }
      var scene = new THREE.Scene(), group = new THREE.Group();
      var skin = new THREE.MeshStandardMaterial({ color: '#2a3552', roughness: 0.55, metalness: 0.05 });
      gl.meshes.forEach(function (mesh) {
        mesh.primitives.forEach(function (p) {
          var g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.BufferAttribute(accessor(p.attributes.POSITION), 3));
          if (p.indices != null) g.setIndex(new THREE.BufferAttribute(accessor(p.indices), 1));
          g.computeVertexNormals();
          group.add(new THREE.Mesh(g, skin));
        });
      });
      scene.add(group);
      scene.add(new THREE.HemisphereLight('#b4dcff', '#0a0d13', 2.2));
      var key = new THREE.DirectionalLight('#ffffff', 1.3); key.position.set(1, 2, 2); scene.add(key);
      var rim = new THREE.DirectionalLight('#9fc4ff', 1.1); rim.position.set(-1, 1, -2); scene.add(rim);
      // The spots, each a ring in its state's colour with a stand-in for its device.
      var bones = data.meta.bones, spots = {};
      Object.keys(POPPY_SPOTS).forEach(function (code) {
        var s = POPPY_SPOTS[code], b = bones[s[0]];
        if (!b) return;
        var at = new THREE.Vector3(b[0] + s[1], b[1] + s[2], b[2] + s[3]), holder = new THREE.Group();
        holder.position.copy(at);
        var out = new THREE.Vector3(at.x, 0, at.z); if (out.lengthSq() < 1e-6) out.set(0, 0, 1);
        holder.lookAt(at.clone().add(out.normalize()));
        var ring = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 8, 24), new THREE.MeshBasicMaterial({ color: '#8a96ad' }));
        holder.add(ring);
        holder.userData.code = code;
        group.add(holder);
        spots[code] = { holder: holder, ring: ring, device: null };
      });
      var DEV = {
        tracker: function () { return new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.018, 20).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6a7088', emissive: '#16243c', roughness: 0.4 })); },
        index: function () { return new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.11, 0.032), new THREE.MeshStandardMaterial({ color: '#5a6072', emissive: '#16243c', roughness: 0.4 })); },
        'qpro-ctrl': function () { return new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.055, 4, 12), new THREE.MeshStandardMaterial({ color: '#121318' })); },
        'q3-ctrl': function () { return new THREE.Mesh(new THREE.CapsuleGeometry(0.017, 0.05, 4, 12), new THREE.MeshStandardMaterial({ color: '#ececf0' })); },
        qpro: function () { return new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.07), new THREE.MeshStandardMaterial({ color: '#101015' })); },
        q3: function () { return new THREE.Mesh(new THREE.BoxGeometry(0.142, 0.06, 0.075), new THREE.MeshStandardMaterial({ color: '#ececf0' })); },
        hand: function () { return new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: '#b4dcff', transparent: true, opacity: 0.35 })); },
      };
      var COLOR = { used: '#6cc7e8', joined: '#d994c6', head: '#e8c547', off: '#8a96ad' };
      // What she shows (2026-10-26: "put a tracker on every available spot on poppy, then her with nothing, and we can
      // toggle the tracker on/off on the UI"): what she wears today, a device on every spot, or nothing at all.
      var show = 'worn';
      try { show = localStorage.getItem('rift-rabbit-poppy-show') || 'worn'; } catch (e) { /* worn */ }
      var headsetKind = function () { return (svg.getAttribute('data-headset') || 'quest-pro') === 'quest-3' ? 'q3' : 'qpro'; };
      function paint() {
        Object.keys(spots).forEach(function (code) {
          var g = strapper.querySelector('[data-strap-dot="' + code + '"]'), sp = spots[code];
          if (!g) return;
          var kind = g.getAttribute('data-kind') || '', state = g.getAttribute('data-state') || 'off';
          if (show === 'all') { kind = code === 'F' ? headsetKind() : code === 'RH' || code === 'LH' ? 'index' : 'tracker'; state = 'used'; }
          if (show === 'none') kind = '';
          sp.ring.visible = show !== 'none';
          sp.ring.material.color.set(COLOR[state] || COLOR.off);
          if (sp.kind !== kind) {
            if (sp.device) sp.holder.remove(sp.device);
            sp.device = DEV[kind] ? DEV[kind]() : null;
            if (sp.device) sp.holder.add(sp.device);
            sp.kind = kind;
          }
        });
      }
      paint();
      box.addEventListener('strapper-change', paint);
      // The canvas covers the drawn figures (the left of the drawing, from her head to the floor), which step aside.
      var canvas = document.createElement('canvas');
      canvas.className = 'strap-mini';
      canvas.setAttribute('aria-label', 'Poppy in 3D with her tracking spots: drag to turn her, click a spot to pick its device');
      stage.appendChild(canvas);
      svg.classList.add('has-mini');
      var modes = document.createElement('div');
      modes.className = 'strap-mini-modes';
      modes.setAttribute('role', 'group'); modes.setAttribute('aria-label', 'What Poppy wears');
      [['worn', 'Today'], ['all', 'Every spot'], ['none', 'Nothing']].forEach(function (m) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'button'; b.textContent = m[1]; b.setAttribute('aria-pressed', String(show === m[0]));
        b.addEventListener('click', function () {
          show = m[0];
          try { localStorage.setItem('rift-rabbit-poppy-show', show); } catch (e) { /* this visit only */ }
          Array.prototype.forEach.call(modes.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          paint(); draw();
        });
        modes.appendChild(b);
      });
      stage.appendChild(modes);
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      var cam = new THREE.PerspectiveCamera(28, 1, 0.01, 50);
      var top = data.meta.box.max[1];
      function place() {
        var r = svg.getBoundingClientRect(), s = stage.getBoundingClientRect(), k = r.width / 1110;
        var x = r.left - s.left + stage.scrollLeft, y = r.top - s.top, w = 500 * k, h = 640 * k;
        canvas.style.left = x + 'px'; canvas.style.top = (y + 240 * k) + 'px'; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        modes.style.left = (x + 12) + 'px'; modes.style.top = (y + 200 * k) + 'px';
        renderer.setSize(w, h, false);
        cam.aspect = w / h; cam.updateProjectionMatrix();
        cam.position.set(0, top * 0.52, top * 2.05); cam.lookAt(0, top * 0.5, 0);
        draw();
      }
      function draw() { renderer.render(scene, cam); }
      // Drag to turn her; a double-click faces her front again.
      var turning = null, moved = false;
      canvas.addEventListener('pointerdown', function (e) { turning = e.clientX; moved = false; canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener('pointermove', function (e) { if (turning == null) return; var dx = e.clientX - turning; if (Math.abs(dx) > 2) moved = true; group.rotation.y += dx * 0.012; turning = e.clientX; draw(); });
      canvas.addEventListener('pointerup', function (e) {
        turning = null;
        if (moved) return;
        // A click on a spot opens its picker, as clicking it on the drawing does.
        var r = canvas.getBoundingClientRect(), ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), cam);
        var hit = ray.intersectObjects(Object.keys(spots).map(function (c) { return spots[c].holder; }), true)[0];
        for (var o = hit && hit.object; o; o = o.parent) if (o.userData && o.userData.code) { var g = strapper.querySelector('[data-strap-dot="' + o.userData.code + '"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); break; }
      });
      canvas.addEventListener('dblclick', function () { group.rotation.y = 0; draw(); });
      box.addEventListener('strapper-change', draw);
      window.addEventListener('resize', place);
      place();
    }).catch(function () { /* stays the drawing */ });
  }
  var poppy = document.createElement('script');
  poppy.setAttribute('src', LOCAL_POPPY);
  poppy.onload = function () { poppy.remove(); miniModel(window.riftRabbitPoppy); };
  poppy.onerror = function () { poppy.remove(); };
  if (strapper) document.head.appendChild(poppy);
})();
