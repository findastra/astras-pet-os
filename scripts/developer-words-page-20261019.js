// Developer mode on a page (Astra, 2026-10-19: "takes away the farm nomenclature and uses the programming
// nomenclature ... so that the legitimate programmers don't get annoyed"). Every pet is an agent, every pet program an
// agent control hub, The Farm the Agent Control Hub. Loaded in a page's <head>, right after words-mode-20261019.js, so
// <html data-words="developer"> is set before anything is drawn and each page's own script can read it.
//
// Which words a page uses, first match wins:
//   1. ?words=developer or ?words=farm in the address (remembered in this browser);
//   2. the choice made with the words switch in a page footer, in this browser;
//   3. the installer's choice, in apps/words-mode-20261019.js (farm unless Developer mode was ticked).
// A remembered choice only counts while the installer's choice is the one it was made over, so installing again in
// the other mode is never hidden by an old click.
//
// Only what people read changes: text, title, alt, placeholder and aria-label, never ids, links, data or code.
// Nothing inside <code>, <pre>, <textarea> or [data-words-keep] changes, nor what is typed into a box: those are names,
// labels and what people wrote. The page's data (window.PetOSWordsData) is written above this code by scripts/developer-words-20261019.mjs.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
(function () {
  'use strict';
  var DATA = window.PetOSWordsData || { exact: [], words: [], panels: [], slugs: [], names: {} };
  var KEY = 'astras-pet-os:words';
  var MODES = { farm: 1, developer: 1 };
  var installed = window.ASTRAS_PET_OS_WORDS === 'developer' ? 'developer' : 'farm';

  function remembered() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      return v && MODES[v.mode] && v.over === installed ? v.mode : null;
    } catch (e) { return null; }
  }
  function remember(mode) {
    try { localStorage.setItem(KEY, JSON.stringify({ mode: mode, over: installed })); } catch (e) { /* this visit only */ }
  }
  var asked = null;
  try { var m = /[?&]words=(farm|developer)(?:&|#|$)/.exec(location.search || ''); asked = m && m[1]; } catch (e) { asked = null; }
  if (asked) remember(asked);
  var mode = asked || remembered() || installed;
  var developer = mode === 'developer';
  document.documentElement.setAttribute('data-words', mode);

  // ---- The swap: one pass for names and the exact words (capitals as written), then one for the other words (any
  // case, keeping the case found). A word only counts on its own: never inside a longer word, a file name, a path, a
  // link or a hyphenated label such as astras-pet-os or unity-unicorn-L1-tool-panel. ----
  function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var BEFORE = "(?<![\\w./\\\\@#-])", AFTER = "(?![\\w/\\\\@-]|\\.\\w)";
  function compile(pairs, flags, after) {
    var map = {}, list = [];
    pairs.forEach(function (p) { var k = flags ? p[0].toLowerCase() : p[0]; if (!(k in map)) { map[k] = p[1]; list.push(p[0]); } });
    list.sort(function (a, b) { return b.length - a.length; });
    return list.length ? { re: new RegExp(BEFORE + '(' + list.map(escape).join('|') + ')' + after, 'g' + flags), map: map } : null;
  }
  var exact = compile(DATA.exact, '', AFTER), words = compile(DATA.words, 'i', AFTER);
  // A pet's or pet program's slug at the start of a hyphenated label in running text, such as unity-stable-backlog (never a dated file name).
  var slugs = compile(DATA.slugs, '', '(?=-[a-zA-Z])');

  // Keep the case the farm word was written in: ALL CAPS, Title Case, Capitalized or as it is.
  function cased(found, out) {
    if (found.length > 1 && found === found.toUpperCase() && /[A-Z]/.test(found)) return out.toUpperCase();
    var parts = found.split(' ');
    if (parts.length > 1 && parts.every(function (w) { return /^[A-Z]/.test(w); })) return out.replace(/(^|\s)([a-z])/g, function (_, s, c) { return s + c.toUpperCase(); });
    if (/^[A-Z]/.test(found)) return out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }
  function swap(text) {
    if (!text || typeof text !== 'string') return text;
    var out = text;
    if (exact) out = out.replace(exact.re, function (w) { return exact.map[w]; });
    if (words) out = out.replace(words.re, function (w) { return cased(w, words.map[w.toLowerCase()]); });
    if (slugs) out = out.replace(slugs.re, function (w) { return slugs.map[w]; });
    return out;
  }
  // A tool panel's label, such as unity-unicorn-L1-tool-panel, becomes unity-agent-L1-panel.
  function legend(text) {
    var out = String(text || ''), i;
    var bySize = function (a, b) { return b[0].length - a[0].length; };
    var front = DATA.slugs.slice().sort(bySize), back = DATA.panels.slice().sort(bySize);
    for (i = 0; i < front.length; i++) if (out.indexOf(front[i][0] + '-') === 0) { out = front[i][1] + out.slice(front[i][0].length); break; }
    for (i = 0; i < back.length; i++) if (out.slice(-back[i][0].length) === back[i][0]) { out = out.slice(0, -back[i][0].length) + back[i][1]; break; }
    return out;
  }

  // The System Map's data, before it is drawn: names, jobs and descriptions, never ids or keys.
  var TEXT_KEYS = { name: 1, what: 1, why: 1, job: 1, detail: 1, how: 1, next: 1, who: 1, on: 1, word: 1, text: 1, note: 1, says: 1, mark: 1, setting: 1 };
  var TEXT_MAPS = { carries: 1, states: 1, types: 1 };
  function data(obj, all) {
    if (!developer || !obj || typeof obj !== 'object') return obj;
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (typeof v === 'string') { if (all || TEXT_KEYS[k]) obj[k] = swap(v); }
      else if (v && typeof v === 'object' && k !== 'hats' && k !== 'examples') data(v, TEXT_MAPS[k] === 1);
    });
    return obj;
  }

  // ---- The words switch, wherever a page has a [data-words-switch] slot (the footer of every agent control hub). ----
  function drawSwitch(slot) {
    if (slot.dataset.drawn) return;
    slot.dataset.drawn = '1';
    slot.setAttribute('data-words-keep', '');
    slot.textContent = '';
    var label = document.createElement('span');
    label.textContent = 'Words:';
    slot.appendChild(label);
    [['farm', 'Farm words'], ['developer', 'Developer words']].forEach(function (choice) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'words-choice';
      b.textContent = choice[1];
      b.setAttribute('aria-pressed', choice[0] === mode ? 'true' : 'false');
      b.title = choice[0] === 'developer' ? 'Programming words: agents and control hubs. Saved in this browser.' : 'The farm words: pets and pet programs. Saved in this browser.';
      b.addEventListener('click', function () {
        if (choice[0] === mode) return;
        remember(choice[0]);
        // The address wins over the switch, so leave it out when reloading.
        var url = location.href.replace(/([?&])words=(farm|developer)(&|(?=#)|$)/, '$1').replace(/[?&](?=#|$)/, '');
        if (url === location.href) location.reload(); else location.replace(url);
      });
      slot.appendChild(b);
    });
  }

  // ---- Walking the page ----
  var SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, KBD: 1, SAMP: 1, NOSCRIPT: 1 };
  var ATTRS = ['title', 'alt', 'placeholder', 'aria-label'];
  function kept(node) {
    for (var n = node.nodeType === 1 ? node : node.parentNode; n && n.nodeType === 1; n = n.parentNode) {
      if (SKIP[n.nodeName] || n.hasAttribute('data-words-keep')) return true;
    }
    return false;
  }
  function text(node) {
    if (kept(node)) return;
    var p = node.parentNode, next = p && p.classList && p.classList.contains('legend') ? legend(node.data) : swap(node.data);
    if (next !== node.data) node.data = next;
  }
  // A search box's placeholder or a button's title is read, so it changes; the value typed into a box never does.
  function attrs(el) {
    if (el.hasAttribute('data-words-keep') || (el.parentNode && el.parentNode.nodeType === 1 && kept(el.parentNode))) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v) { var next = swap(v); if (next !== v) el.setAttribute(ATTRS[i], next); }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { if (developer) text(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && root.hasAttribute('data-words-switch')) drawSwitch(root);
    var all = root.querySelectorAll ? root.querySelectorAll('[data-words-switch]') : [];
    for (var s = 0; s < all.length; s++) drawSwitch(all[s]);
    if (!developer) return;
    if (root.nodeType === 1) attrs(root);
    var tw = document.createTreeWalker(root, 1 | 4), n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) text(n); else attrs(n); }
  }
  function start() {
    walk(document.body);
    if (!developer) return;
    document.title = swap(document.title);
    if (!window.MutationObserver) return;
    var seen = new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'childList') for (var i = 0; i < r.addedNodes.length; i++) walk(r.addedNodes[i]);
        else if (r.type === 'characterData') text(r.target);
        else attrs(r.target);
      });
      seen.takeRecords(); // our own changes: already in the new words
    });
    seen.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  window.PetOSWords = {
    mode: mode, developer: developer, installed: installed,
    swap: function (t) { return developer ? swap(t) : t; },
    legend: function (t) { return developer ? legend(t) : t; },
    data: data,
    /** The developer names of a pet program, by repo: { agent, hub }, or null. */
    name: function (repo) { return DATA.names[repo] || null; },
    // For tests: the swap itself, whatever the mode.
    _swap: swap, _legend: legend,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
