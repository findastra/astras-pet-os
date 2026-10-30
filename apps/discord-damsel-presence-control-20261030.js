// By Astra. OpenAI Codex, 2026-10-30. Fixed local Damsel controls; never saves or clears maintenance reports.
(function () {
  'use strict';
  var box = document.getElementById('discord-damsel-presence-control');
  if (!box) return;
  var note = document.getElementById('presence-control-note');
  var keys = ['openai', 'anthropic'], data = null, statuses = {}, busy = {}, sequence = 0, connection = 0, timer;
  var lights = document.querySelectorAll('button.onoff[data-presence-managed]');
  function description(s) {
    if (!s) return 'Not connected to Discord Damsel. Double-click her desktop pet to reconnect.';
    if (s.blocked) return s.message || 'Another installation uses this control port. Nothing was changed.';
    if (!s.installed) return 'Not installed beside Discord Tower.';
    if (!s.running) return 'App stopped. Start and open to run it.';
    if (s.mode === 'off') return 'App running; sharing is off.';
    if (s.published && s.connected) return 'Card published to Discord. Discord chooses which activity appears on your profile.';
    if (s.connected) return 'App running and connected to Discord; no card published yet.';
    return 'App running; no card published. Automatic waits for activity. Open controls for details.';
  }
  function paint() {
    keys.forEach(function (key) {
      var s = statuses[key], card = box.querySelector('[data-presence-card="' + key + '"]');
      card.querySelector('[data-presence-status]').textContent = description(s);
      card.querySelector('[data-presence-start]').disabled = !data || !!busy[key] || !!(s && (s.blocked || !s.installed));
      card.querySelector('[data-presence-stop]').disabled = !data || !!busy[key] || !s || !s.running || s.mode === 'off' || !!s.blocked;
    });
    Array.prototype.forEach.call(lights, function (button) {
      var key = button.dataset.item === 'program:openai-discord-presence' ? 'openai' : 'anthropic';
      var s = statuses[key], on = !!(s && s.mode !== 'off' && s.published && s.connected);
      button.classList.toggle('is-off', !on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.setAttribute('aria-label', button.dataset.name + ': ' + (on ? 'publishing now' : 'not publishing'));
      button.title = description(s) + ' Click to use the presence controls.';
    });
  }
  function lost(message) {
    sequence++; connection++; data = null; statuses = {}; clearTimeout(timer);
    note.textContent = message || 'Discord Damsel is not answering. Double-click her desktop pet, then reload this page.';
    paint();
  }
  function ask(path, app) {
    var input = { code: data.code };
    if (app) input.app = app;
    return fetch(data.url + path, { method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(input), cache: 'no-store', signal: AbortSignal.timeout(25000) }).then(function (response) {
      return response.json().then(function (result) {
        if (!response.ok || !result.ok) throw new Error(result.error || 'The local control action failed.');
        return result;
      });
    });
  }
  function refresh() {
    if (!data || keys.some(function (key) { return busy[key]; })) return;
    var current = ++sequence;
    ask('/api/status').then(function (result) {
      if (current !== sequence) return;
      statuses = result.apps || {}; paint();
      clearTimeout(timer); timer = setTimeout(refresh, 3000);
    }, function () { if (current === sequence) lost(); });
  }
  function change(key, start) {
    if (!data || busy[key]) return;
    var generation = connection;
    busy[key] = true; sequence++; clearTimeout(timer); paint();
    // A tab created inside this click survives popup blockers while the local app starts.
    var tab = start ? window.open('about:blank', '_blank') : null;
    if (tab) tab.opener = null;
    ask(start ? '/api/start' : '/api/stop', key).then(function (result) {
      if (generation !== connection) { if (tab) tab.close(); return; }
      statuses[key] = result.status;
      note.textContent = start ? 'Started. The controls show the app’s current activity and Discord connection.' : 'Sharing switched off for this app.';
      if (tab) tab.location.replace(key === 'openai' ? 'http://127.0.0.1:38761/' : 'http://127.0.0.1:38762/');
      else if (start) note.textContent += ' Use its Open controls link if your browser blocked the new tab.';
    }, function (error) {
      if (tab) tab.close();
      if (generation !== connection) return;
      note.textContent = error.message || 'The control action failed. Open its controls or try again.';
    }).finally(function () { busy[key] = false; paint(); refresh(); });
  }
  keys.forEach(function (key) {
    box.querySelector('[data-presence-start="' + key + '"]').addEventListener('click', function () { change(key, true); });
    box.querySelector('[data-presence-stop="' + key + '"]').addEventListener('click', function () { change(key, false); });
  });
  Array.prototype.forEach.call(lights, function (button) {
    button.addEventListener('click', function () {
      box.closest('details').open = true;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      note.textContent = 'Use Start and open or Stop sharing above. These lights show live publishing, and do not save an ON setting.';
    });
  });
  paint();
  if (location.protocol !== 'file:') {
    note.textContent = 'Open the installed Discord Damsel desktop pet for Start and open and the local control links.';
    return;
  }
  keys.forEach(function (key) {
    var link = box.querySelector('[data-presence-controls="' + key + '"]');
    link.href = key === 'openai' ? 'http://127.0.0.1:38761/' : 'http://127.0.0.1:38762/';
    link.removeAttribute('aria-disabled');
  });
  var bootstrap = document.createElement('script');
  bootstrap.src = "../../../../Astra's PetOS Data/discord-tower/presence-control-page-data-20261030.js?t=" + Date.now();
  bootstrap.onload = function () {
    var value = window.DiscordDamselPresenceData;
    if (!value || value.url !== 'http://127.0.0.1:38764' || !/^[a-f0-9]{64}$/.test(value.code || '')) { lost(); return; }
    connection++; data = value;
    note.textContent = 'Connected to local presence controls. Your maintenance report is unchanged.';
    refresh();
  };
  bootstrap.onerror = function () { lost(); };
  document.head.appendChild(bootstrap);
})();
