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
    var line = said || (r && r.said);
    if (line) area.appendChild(el('p', 'small launch-said', line));
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
  // Base Station FOV Viewer and VR Pole Overlay: a tick opens it now, an untick closes it (Astra, 2026-10-26: "I would
  // like to be able to turn these on at any moment").
  box.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-launch-switch');
    if (!launcher || (k !== 'fov' && k !== 'pole')) return;
    var on = e.target.checked;
    // Both headset tools have the tick; keep them the same.
    Array.prototype.forEach.call(box.querySelectorAll('[data-launch-switch="' + k + '"]'), function (i) { i.checked = on; });
    ask('/overlay', { id: k === 'fov' ? 'base-station-fov' : 'vr-pole-overlay', on: on }).then(function (res) { e.target.title = (res && res.said) || ''; }, lost);
  });

  // The dongle map: the launcher runs USBDeview and sends back each USB controller's branches; drawn with textContent.
  var dongle = document.querySelector('[data-dongle-map]');
  function dongles(n) { return (n.kind === 'tracker-dongle' || n.kind === 'radio' ? 1 : 0) + (n.children || []).reduce(function (a, c) { return a + dongles(c); }, 0); }
  function branch(n) {
    var li = el('li', 'dongle-node');
    li.setAttribute('data-kind', n.kind);
    var line = el('span', 'dongle-line');
    line.appendChild(el('b', null, n.name));
    var port = (n.location || '').match(/Port_#0*(\d+)\.Hub_#0*(\d+)/);
    if (port) line.appendChild(el('span', 'dongle-port', ' · port ' + port[1] + ' of hub ' + port[2]));
    if (n.serial && (n.kind === 'tracker-dongle' || n.kind === 'radio')) line.appendChild(el('span', 'dongle-serial', ' · ' + n.serial));
    if (n.tracker) line.appendChild(el('span', 'dongle-tracker', ' → ' + n.tracker));
    var count = dongles(n);
    if (n.children && count) line.appendChild(el('span', 'dongle-count', ' (' + count + ' dongle' + (count === 1 ? '' : 's') + ')'));
    li.appendChild(line);
    if (n.children) { var ul = el('ul', 'dongle-branches'); n.children.forEach(function (c) { ul.appendChild(branch(c)); }); li.appendChild(ul); }
    return li;
  }
  if (dongle) {
    var scan = dongle.querySelector('[data-dongle-scan]'), dsaid = dongle.querySelector('[data-dongle-said]'), tree = dongle.querySelector('[data-dongle-tree]');
    scan.addEventListener('click', function () {
      scan.disabled = true; dsaid.textContent = 'Scanning…';
      ask('/usb-map').then(function (res) {
        scan.disabled = false;
        tree.textContent = '';
        if (!res || !res.ok) { dsaid.textContent = (res && res.said) || 'The scan did not work.'; return; }
        dsaid.textContent = res.dongles + ' Watchman dongles found, ' + new Date(res.time).toLocaleTimeString() + '.';
        var ul = el('ul', 'dongle-branches dongle-root');
        (res.controllers || []).filter(function (c) { return dongles(c) > 0; }).concat((res.controllers || []).filter(function (c) { return dongles(c) === 0; })).forEach(function (c) { ul.appendChild(branch(c)); });
        tree.appendChild(ul);
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
