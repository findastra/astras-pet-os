// The chat window's link to the pet chat helper on this PC (the-farm-v1.0-pet-chat-helper-v1.0, card 283), on every pet
// program page. The page script itself sends nothing; this is the one thing a page talks to, and only that helper.
// Where it listens and its code are in one fixed file in the farm's data folder, two folders above the farm, so only a
// page opened from this PC can read them (the way Rift Rabbit's Launch buttons reach its launcher). Anywhere else it
// does nothing and the chat says why. Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
(function () {
  'use strict';
  // From apps/pet-programs/ in Documents\Astra's PetOS\astras-pet-os up to Documents.
  var HELPER = "../../../../Astra's PetOS Data/astras-pet-os/pet-chat/pet-chat-page-data.js";
  var onThisPC = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var helper = null;
  // Read the page data file again each time the chat opens: the helper picks a new port and code at every start.
  function load(then) {
    if (!onThisPC) { helper = null; then(false); return; }
    var script = document.createElement('script');
    script.setAttribute('src', HELPER + '?t=' + Date.now());
    script.onload = function () {
      script.remove();
      var d = window.petChatHelper;
      helper = d && d.schema === 'astras-pet-os-pet-chat-v1' && d.on === true && typeof d.code === 'string' && /^http:\/\/127\.0\.0\.1:\d{1,5}\/$/.test(d.url) ? d : null;
      then(!!helper);
    };
    script.onerror = function () { script.remove(); helper = null; then(false); };
    document.head.appendChild(script);
  }
  // Text/plain keeps it a simple request: the helper checks the code and where the page was opened from.
  function ask(path, body) {
    if (!helper) return Promise.reject(new Error('The pet chat helper is not running on this PC.'));
    var sent = { code: helper.code };
    for (var k in body || {}) sent[k] = body[k];
    return fetch(helper.url + path, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(sent), cache: 'no-store' });
  }
  window.PetChatLink = { onThisPC: onThisPC, load: load, ask: ask };
})();
