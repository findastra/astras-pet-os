// Bass & Biscuits' drum sounds and drum kits, shared by the APC64 deck (preview-my-apc64-tool) and the kit tool
// (apc64-drum-kit-tool). Every sound is made in the browser with Web Audio; Astra's own sound files stay in this
// browser (IndexedDB). Nothing is downloaded or sent. Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
(function () {
  'use strict';
  var ac = null, out = null, noiseBuf = null;
  function audio() {
    if (!ac) {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      ac = new A(); out = ac.createDynamicsCompressor(); out.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function env(g, t, peak, len) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + len); }
  function tone(type, f0, f1, len, vol, delay) {
    var t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + len);
    env(g, t, vol, len); o.connect(g); g.connect(out); o.start(t); o.stop(t + len + 0.05);
  }
  function noise(filter, freq, len, vol, delay) {
    var t = ac.currentTime + (delay || 0), s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = filter; f.frequency.value = freq; env(g, t, vol, len);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + len + 0.05);
  }

  // Each voice takes a loudness (0-1) and a tune (0.5-2, 1 = normal).
  var VOICES = {
    'Kick': function (v, k) { tone('sine', 150 * k, 45 * k, 0.45, v); },
    '808 boom': function (v, k) { tone('sine', 90 * k, 38 * k, 1.1, v); tone('triangle', 180 * k, 0, 0.02, v * 0.3); },
    'Punch kick': function (v, k) { tone('sine', 200 * k, 50 * k, 0.25, v); noise('lowpass', 900, 0.02, v * 0.6); },
    'Snare': function (v, k) { tone('triangle', 220 * k, 120 * k, 0.12, v * 0.5); noise('highpass', 1500 * k, 0.2, v * 0.7); },
    'Crack snare': function (v, k) { tone('triangle', 300 * k, 160 * k, 0.08, v * 0.4); noise('bandpass', 3500 * k, 0.16, v * 0.9); },
    'Soft snare': function (v, k) { noise('bandpass', 1800 * k, 0.3, v * 0.5); },
    'Clap': function (v, k) { [0, 0.012, 0.024].forEach(function (d) { noise('bandpass', 1200 * k, 0.06, v * 0.8, d); }); noise('bandpass', 1200 * k, 0.25, v * 0.5, 0.036); },
    'Rim': function (v, k) { tone('square', 1700 * k, 900 * k, 0.03, v * 0.35); },
    'Closed hat': function (v, k) { noise('highpass', 8000 * k, 0.05, v * 0.6); },
    'Open hat': function (v, k) { noise('highpass', 7000 * k, 0.35, v * 0.5); },
    'Shaker': function (v, k) { noise('bandpass', 6000 * k, 0.09, v * 0.5); },
    'Ride': function (v, k) { noise('highpass', 9000 * k, 0.6, v * 0.25); tone('square', 520 * k, 0, 0.4, v * 0.04); },
    'Crash': function (v, k) { noise('highpass', 5000 * k, 1.2, v * 0.5); },
    'Low tom': function (v, k) { tone('sine', 110 * k, 70 * k, 0.4, v); },
    'Mid tom': function (v, k) { tone('sine', 160 * k, 100 * k, 0.35, v); },
    'High tom': function (v, k) { tone('sine', 230 * k, 150 * k, 0.3, v); },
    'Bongo': function (v, k) { tone('sine', 420 * k, 300 * k, 0.12, v * 0.8); },
    'Cowbell': function (v, k) { tone('square', 560 * k, 0, 0.25, v * 0.15); tone('square', 845 * k, 0, 0.25, v * 0.15); },
    'Click': function (v, k) { tone('square', 2500 * k, 0, 0.015, v * 0.3); },
    'Zap': function (v, k) { tone('sawtooth', 1800 * k, 80 * k, 0.18, v * 0.25); },
    'Laser': function (v, k) { tone('square', 3000 * k, 300 * k, 0.3, v * 0.15); },
    'Bass blip': function (v, k) { tone('sawtooth', 55 * k, 0, 0.25, v * 0.35); tone('sine', 110 * k, 0, 0.25, v * 0.4); },
    'Vinyl crackle': function (v, k) { for (var i = 0; i < 6; i++) noise('highpass', 3000 * k, 0.01, v * 0.4, Math.random() * 0.3); }
  };
  // Which colour family a sound is: 0 kicks, 1 snares and claps, 2 hats and cymbals, 3 toms, 4 everything else.
  function family(name) {
    if (/kick|boom/i.test(name)) return 0;
    if (/snare|clap|rim/i.test(name)) return 1;
    if (/hat|ride|crash|shaker|crackle/i.test(name)) return 2;
    if (/tom|bongo/i.test(name)) return 3;
    return 4;
  }
  // Every kit lights its pads in its own five colours (one per family), so kits can be told apart at a glance
  // (Astra, 2026-11-03: "I can't tell them apart ... by just the colors of the buttons").
  var PALETTES = [
    ['#2ef2ff', '#ff4fd8', '#b6ff3b', '#ffc23b', '#b98bff'],   // neon
    ['#ff2a2a', '#ff8a1f', '#ffe14d', '#ff5fa2', '#ffffff'],   // fire
    ['#2f6bff', '#29e0ff', '#7fffd4', '#a9b8ff', '#5b3dff'],   // ocean
    ['#ffb3c7', '#c9b6ff', '#b8f2e6', '#ffe5a5', '#a0c4ff'],   // pastel
    ['#9b30ff', '#ff2bd6', '#e8b8ff', '#5d1dff', '#ff7ab8'],   // grape
    ['#ff3b30', '#f2f2f2', '#ffb000', '#9aa1ad', '#ff6a00'],   // red and silver
    ['#00ff9c', '#39ff14', '#00e5ff', '#d4ff3b', '#7cffcb'],   // alien green
    ['#ff6b00', '#00f0ff', '#ff00a0', '#fff200', '#00ff6a'],   // arcade
    ['#ffd700', '#ff9e3d', '#fff6b0', '#d4a017', '#ffe7d1'],   // gold
    ['#ff0055', '#7a00ff', '#00d1ff', '#ff00e6', '#4dff00']    // party
  ];
  var FILE_COLOR = '#ff9a3c';   // a pad playing one of Astra's own sound files

  // Ready-made kits: 16 pads, bottom row first, left to right (the 4x4 drum layout Live puts on the APC64).
  function kit(id, name, palette, pads) { return { id: id, name: name, ready: true, colors: PALETTES[palette], pads: pads.map(function (p) { return typeof p === 'string' ? { sound: p, tune: 1 } : p; }) }; }
  var READY = [
    kit('starter', 'Starter', 0, ['Kick', 'Rim', 'Snare', 'Clap', 'Low tom', 'Shaker', 'Closed hat', 'Mid tom', 'High tom', 'Cowbell', 'Open hat', 'Click', 'Crash', '808 boom', 'Crack snare', 'Ride']),
    kit('808', '808', 1, ['808 boom', 'Rim', 'Snare', 'Clap', { sound: '808 boom', tune: 0.8 }, { sound: '808 boom', tune: 1.25 }, 'Closed hat', 'Open hat', 'Low tom', 'Mid tom', 'High tom', 'Cowbell', 'Crash', 'Shaker', 'Click', 'Ride']),
    kit('house', 'House', 2, ['Punch kick', 'Clap', { sound: 'Closed hat', tune: 1.1 }, 'Open hat', 'Kick', 'Snare', 'Shaker', 'Ride', 'Bass blip', { sound: 'Bass blip', tune: 1.5 }, 'Rim', 'Cowbell', 'Crash', 'Bongo', { sound: 'Bongo', tune: 1.4 }, 'Click']),
    kit('lofi', 'Lo-fi', 3, [{ sound: 'Kick', tune: 0.85 }, 'Rim', 'Soft snare', 'Vinyl crackle', 'Low tom', 'Shaker', { sound: 'Closed hat', tune: 0.7 }, 'Mid tom', 'High tom', 'Bongo', { sound: 'Open hat', tune: 0.7 }, 'Click', { sound: 'Crash', tune: 0.6 }, '808 boom', { sound: 'Snare', tune: 0.8 }, { sound: 'Ride', tune: 0.8 }]),
    kit('trap', 'Trap', 4, ['808 boom', { sound: 'Crack snare', tune: 1.1 }, 'Clap', 'Closed hat', { sound: '808 boom', tune: 0.75 }, { sound: '808 boom', tune: 1.33 }, { sound: 'Closed hat', tune: 1.3 }, 'Open hat', 'Rim', 'Snare', 'Shaker', 'Click', 'Crash', 'Cowbell', 'Laser', 'Ride']),
    kit('rock', 'Rock', 5, ['Punch kick', 'Rim', 'Snare', 'Crack snare', 'Low tom', 'Mid tom', 'Closed hat', 'High tom', { sound: 'Low tom', tune: 0.8 }, 'Cowbell', 'Open hat', 'Ride', 'Crash', 'Kick', { sound: 'Crash', tune: 1.2 }, 'Clap']),
    kit('space', 'Space', 6, ['808 boom', 'Zap', 'Laser', 'Clap', 'Bass blip', { sound: 'Zap', tune: 0.6 }, { sound: 'Laser', tune: 1.5 }, 'Shaker', { sound: 'Bass blip', tune: 0.75 }, 'Bongo', 'Open hat', 'Click', 'Crash', { sound: 'Zap', tune: 1.4 }, { sound: 'Laser', tune: 0.7 }, 'Vinyl crackle'])
  ];
  // A new kit takes the next colour set no kit is using yet.
  function freshColors() {
    var used = allKits().map(function (k) { return (k.colors || [])[0]; });
    for (var i = 0; i < PALETTES.length; i++) if (used.indexOf(PALETTES[i][0]) < 0) return PALETTES[i].slice();
    return PALETTES[allKits().length % PALETTES.length].slice();
  }

  // Astra's own kits and which kit the deck plays, kept in this browser.
  var KITS_KEY = 'bass-biscuits-drum-kits-20261102', CURRENT_KEY = 'bass-biscuits-current-kit-20261102';
  function read(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function myKits() { var k = read(KITS_KEY, []); return Array.isArray(k) ? k.filter(function (x) { return x && x.id && Array.isArray(x.pads) && x.pads.length === 16; }) : []; }
  function allKits() { return READY.concat(myKits()); }
  function findKit(id) { var all = allKits(); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }
  function currentKit() { return findKit(read(CURRENT_KEY, 'starter')) || READY[0]; }
  function setCurrent(id) { write(CURRENT_KEY, id); }
  function saveMyKit(k) { var mine = myKits().filter(function (x) { return x.id !== k.id; }); mine.push({ id: k.id, name: String(k.name).slice(0, 40), colors: k.colors, pads: k.pads }); return write(KITS_KEY, mine); }
  function deleteMyKit(id) { write(KITS_KEY, myKits().filter(function (x) { return x.id !== id; })); if (read(CURRENT_KEY, '') === id) setCurrent('starter'); }
  function surprise() { var all = allKits(), cur = currentKit().id, pick = all[Math.floor(Math.random() * all.length)]; if (all.length > 1 && pick.id === cur) return surprise(); setCurrent(pick.id); return pick; }

  // Astra's own sound files: kept in IndexedDB, decoded once.
  var dbP = null, decoded = {};
  function db() {
    if (dbP) return dbP;
    dbP = new Promise(function (ok, no) {
      try { var r = indexedDB.open('bass-biscuits-sounds-20261102', 1); r.onupgradeneeded = function () { r.result.createObjectStore('files'); }; r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); }; } catch (e) { no(e); }
    });
    return dbP;
  }
  function putFile(id, blob) { return db().then(function (d) { return new Promise(function (ok, no) { var t = d.transaction('files', 'readwrite'); t.objectStore('files').put(blob, id); t.oncomplete = function () { delete decoded[id]; ok(); }; t.onerror = function () { no(t.error); }; }); }); }
  function getFile(id) { return db().then(function (d) { return new Promise(function (ok, no) { var q = d.transaction('files').objectStore('files').get(id); q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { no(q.error); }; }); }); }
  function fileBuffer(id) {
    if (decoded[id]) return Promise.resolve(decoded[id]);
    return getFile(id).then(function (b) { if (!b) return null; return b.arrayBuffer(); }).then(function (ab) { if (!ab) return null; return new Promise(function (ok, no) { audio().decodeAudioData(ab, ok, no); }); }).then(function (buf) { if (buf) decoded[id] = buf; return buf; });
  }

  // Play one pad of a kit.
  function playPad(pad, vel) {
    if (!audio() || !pad) return;
    var v = Math.max(0.15, Math.min(1, vel == null ? 0.9 : vel)), k = pad.tune || 1;
    if (pad.file) {
      fileBuffer(pad.file).then(function (buf) {
        if (!buf) return; var s = ac.createBufferSource(), g = ac.createGain();
        s.buffer = buf; s.playbackRate.value = k; g.gain.value = v; s.connect(g); g.connect(out); s.start();
      }).catch(function () { /* the file is gone from this browser */ });
      return;
    }
    (VOICES[pad.sound] || VOICES.Click)(v, k);
  }
  function padName(pad) { return pad ? (pad.file ? (pad.label || 'My sound') : pad.sound) : ''; }
  // A pad's colour in its kit (kits saved before 2026-11-03 have no colours of their own and light in the first set).
  function padColor(pad, k) { return pad && pad.file ? FILE_COLOR : ((k && k.colors) || PALETTES[0])[family(pad ? pad.sound : '')]; }

  window.DrumSounds = {
    audio: audio, voices: Object.keys(VOICES), ready: READY, allKits: allKits, myKits: myKits, findKit: findKit,
    currentKit: currentKit, setCurrent: setCurrent, saveMyKit: saveMyKit, deleteMyKit: deleteMyKit, surprise: surprise,
    freshColors: freshColors, putFile: putFile, playPad: playPad, padName: padName, padColor: padColor
  };
})();
