// File Kingdom's tool page: one tool inside its tool box on File Kingdom's pet program page (?tool=<id>), or every
// tool when opened on its own. It reads only the page data File Master's look writes on this PC
// (window.fileKingdomTools, schema file-kingdom-tools-v1, from file-master's scripts/save-map-look-20261109.ps1) and
// builds the page with textContent only. With no look to read (the public site, another PC) it shows a made-up
// example, marked as one. Astra, 2026-11-09: "I need the File Kingdom (Pet Program) to have this information in
// panels"; "detailed enough for me to navigate to store and find things". Claude Opus 5.5 (claude-opus-5-5), 2026-11-09.
(function () {
  'use strict';
  var LOCAL = "../../../Astra's PetOS Data/file-master/file-kingdom-page-data.js";
  var SCHEMA = 'file-kingdom-tools-v1';
  var STALE_MS = 7 * 24 * 60 * 60 * 1000;
  var RUN = 'powershell -ExecutionPolicy Bypass -File "%USERPROFILE%\\Documents\\Astra\'s PetOS\\file-master\\scripts\\save-map-look-20261109.ps1"';
  var wanted = (new URLSearchParams(location.search).get('tool') || '').toLowerCase();
  var box = document.querySelector('[data-tools]');
  var lookedLine = document.querySelector('[data-looked]');

  // ---- inside its tool box: no background or header of its own, and the box is told how tall it is ----
  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (inTool) document.documentElement.classList.add('in-tool');
  function tell() {
    if (!inTool) return;
    try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.documentElement.scrollHeight) }, '*'); } catch (e) { /* no page around it */ }
  }
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);

  // ---- small builders (textContent only) ----
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function para(text, cls) { return el('p', cls || null, text); }
  function chip(text, kind) { return el('span', 'chip' + (kind ? ' ' + kind : ''), text); }
  function num(n) { return n == null ? '' : Number(n).toLocaleString(); }
  function size(b) { if (b == null) return ''; if (b >= 1073741824) return (b / 1073741824).toFixed(1) + ' GB'; if (b >= 1048576) return Math.round(b / 1048576) + ' MB'; return Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function day(iso) { return iso ? String(iso).slice(0, 10) : ''; }
  function when(iso) { if (!iso) return 'never'; var d = new Date(iso); return isNaN(d) ? iso : d.toLocaleString(); }
  function table(head, rows, nums) {
    var t = el('table'), tr = el('tr');
    head.forEach(function (h) { tr.appendChild(el('th', null, h)); });
    t.appendChild(tr);
    rows.forEach(function (r) { var row = el('tr'); r.forEach(function (c, i) { row.appendChild(el('td', nums && nums.indexOf(i) >= 0 ? 'n' : null, c == null ? '' : String(c))); }); t.appendChild(row); });
    return t;
  }
  function copy(text, button) {
    function done() { button.classList.add('done'); button.textContent = 'Copied'; setTimeout(function () { button.classList.remove('done'); button.textContent = 'Copy'; }, 1500); }
    function old() { var t = el('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { /* nothing to do */ } t.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, old); else old();
  }
  // A folder path with a Copy button. "<repo>" and the like are placeholders: Copy takes the folder before them, which
  // File Explorer's address bar opens as it is (it understands %USERPROFILE%).
  function isPath(p) { return /^(%[A-Za-z]+%|[A-Za-z]:\\)/.test(p || ''); }
  function pathRow(p) {
    var row = el('div', 'path');
    if (!isPath(p)) { row.appendChild(el('span', null, p)); return row; }
    row.appendChild(el('code', null, p));
    var open = p.replace(/\\?<.*$/, '');
    var b = el('button', null, 'Copy'); b.type = 'button'; b.title = 'Copy ' + open + ' (paste it into File Explorer’s address bar)';
    b.addEventListener('click', function () { copy(open, b); });
    row.appendChild(b);
    return row;
  }
  var ROLE_KIND = { home: 'ok', data: 'ok', inbox: 'cool', keep: '', hold: 'no', auto: '', temp: 'no' };

  // ---- what each tool box shows ----
  function whereToSave(d) {
    var list = el('ol', 'asks');
    (d.questions || []).forEach(function (q) {
      var li = add(el('li'), el('div', 'ask', q.ask));
      (q.save_in || []).forEach(function (p) { li.appendChild(pathRow(p)); });
      if (q.note) li.appendChild(para(q.note, 'sub'));
      list.appendChild(li);
    });
    return [para('Ask in this order; the first yes wins.', 'sub'), list];
  }

  function whereThingsLive(d) {
    var roles = d.roles || {}, rows = [];
    var search = el('input'); search.type = 'search'; search.placeholder = 'Find a place: chats, installers, D:…'; search.setAttribute('aria-label', 'Find a place on the save map');
    var out = [search];
    (d.groups || []).forEach(function (g) {
      var mine = (d.places || []).filter(function (p) { return p.group === g.id; });
      if (!mine.length) return;
      var h = el('h3', null, g.title); out.push(h);
      var shown = [];
      mine.forEach(function (p) {
        var row = el('div', 'place');
        var left = el('div'); left.appendChild(chip(roles[p.role] || p.role, ROLE_KIND[p.role]));
        var right = el('div');
        if (p.path) right.appendChild(pathRow(p.path));
        right.appendChild(para(p.holds));
        var facts = [];
        if (p.exists === false) facts.push('not there yet');
        else if (p.files != null) { facts.push(num(p.files) + ' files'); facts.push(size(p.bytes)); if (p.newest) facts.push('last change ' + day(p.newest)); }
        else if (p.complete === false) facts.push('not counted: Everything does not index this drive yet');
        facts.push('saves here: ' + p.who);
        right.appendChild(para(facts.join(' · '), 'facts'));
        add(row, left, right);
        row.setAttribute('data-text', [p.path, p.holds, p.who, roles[p.role], g.title].join(' ').toLowerCase());
        shown.push(row); rows.push({ row: row, head: h, group: shown }); out.push(row);
      });
    });
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      rows.forEach(function (r) { r.row.hidden = !!q && r.row.getAttribute('data-text').indexOf(q) < 0; });
      rows.forEach(function (r) { r.head.hidden = r.group.every(function (x) { return x.hidden; }); });
      tell();
    });
    return out;
  }

  var SEVERITY = { High: 'bad', Medium: 'no', Low: '' };
  function outOfPlace(d) {
    var f = d.findings || [];
    if (!f.length) return [para('Nothing out of place in the last look.', 'empty')];
    var out = [para('From the look of ' + when(d.looked) + '. Nothing is moved from here: each one says what fixes it.', 'sub')];
    f.forEach(function (x) {
      var b = el('div', 'finding');
      var h = el('h4'); add(h, chip(x.severity, SEVERITY[x.severity]), el('span', null, x.title), chip(num(x.count) + (x.bytes ? ' · ' + size(x.bytes) : '')));
      add(b, h, para(x.why), para('What to do: ' + x.fix, 'use'));
      if (x.examples && x.examples.length) {
        var more = el('details'); more.appendChild(el('summary', null, x.count > x.examples.length ? 'Show ' + x.examples.length + ' of ' + num(x.count) : 'Show ' + (x.count === 1 ? 'it' : 'all ' + x.count)));
        var ul = el('ul'); x.examples.forEach(function (p) { ul.appendChild(add(el('li'), el('code', null, p))); });
        more.appendChild(ul); more.addEventListener('toggle', tell); b.appendChild(more);
      }
      b.appendChild(para('Found through ' + x.source + '.', 'facts sub'));
      out.push(b);
    });
    return out;
  }

  function look(d) {
    var e = d.everything || {}, c = el('div', 'chips'), out = [];
    out.push(para('Last look: ' + when(d.looked) + (d.seconds ? ', ' + Math.round(d.seconds) + ' seconds' : '') + '. ' + (d.places || []).length + ' places, ' + (d.findings || []).length + ' kinds of thing out of place.'));
    c.appendChild(e.installed ? chip('Everything is on this PC', 'ok') : chip('Everything is not on this PC', 'no'));
    if (e.version) c.appendChild(chip('version ' + e.version));
    if (e.es_version) c.appendChild(chip('es.exe ' + e.es_version));
    if (e.installed) c.appendChild(e.answers ? chip('answering', 'ok') : chip(e.running ? 'running, not answering' : 'not running', 'bad'));
    if (e.items) c.appendChild(chip(num(e.items) + ' items in its index'));
    (e.indexed || []).forEach(function (r) { c.appendChild(chip('indexes ' + r, 'ok')); });
    (e.not_indexed || []).forEach(function (r) { c.appendChild(chip('does not index ' + r, 'no')); });
    out.push(el('h3', null, 'Everything, the index it asks')); out.push(c);
    if (e.why) out.push(para(e.why, 'note'));
    if (e.runs_as_admin) out.push(para('Everything is set to run as administrator, so Windows asks you each time it starts, and it does not start by itself when you sign in.', 'sub'));
    if ((e.not_indexed || []).length) out.push(para('A drive Everything does not index is walked instead, slowly, and cannot be searched. To add it: Everything > Tools > Options > Indexes > Folders > Add.', 'use'));
    var plans = d.plans || [];
    out.push(el('h3', null, 'Cleanup plans'));
    if (!plans.length) out.push(para('No plans written yet.', 'empty'));
    else out.push(table(['Plan', 'Written', 'Rows', 'You approved', 'What the rows do'], plans.map(function (p) {
      var by = p.by_action || {}; return [p.name, day(p.written), p.rows, p.approved, Object.keys(by).map(function (k) { return by[k] + ' ' + k; }).join(', ')];
    }), [2, 3]));
    out.push(para('A plan changes nothing until you mark its rows yes; then cleanup-plan does a dry run before the real one.', 'sub'));
    var tools = d.tools || {}, names = Object.keys(tools);
    out.push(el('h3', null, 'When each tool last ran'));
    if (!names.length) out.push(para('No runs recorded yet.', 'empty'));
    else out.push(table(['Tool', 'Last run', 'Its report folder'], names.map(function (k) { return [k, when(tools[k].last_run), tools[k].report]; })));
    out.push(el('h3', null, 'Look again'));
    var row = el('div', 'path'); row.appendChild(el('code', null, RUN));
    var b = el('button', null, 'Copy'); b.type = 'button'; b.addEventListener('click', function () { copy(RUN, b); }); row.appendChild(b);
    out.push(row);
    out.push(para('Read only, about 20 seconds. Paste it into a PowerShell window, or ask File Master in chat. This box updates by itself afterwards.', 'sub'));
    return out;
  }

  var VIEWS = {
    'where-to-save': { title: 'Where do I save this?', render: whereToSave },
    'where-things-live': { title: 'Where things live', render: whereThingsLive },
    'out-of-place': { title: 'Out of place', render: outOfPlace },
    'save-map-look': { title: 'The last look', render: look }
  };
  var ORDER = ['where-to-save', 'where-things-live', 'out-of-place', 'save-map-look'];

  // A made-up PC, for the public site and for a PC File Master has not looked at: the PetOS folders every farm has.
  var EXAMPLE = {
    questions: [
      { ask: 'Code, docs or pages of a project that has a GitHub repo', save_in: ["%USERPROFILE%\\Documents\\Astra's PetOS\\<repo>"], note: 'The folder is named exactly like the GitHub repo.' },
      { ask: 'Big or private files for a project: art originals, renders, recordings', save_in: ["%USERPROFILE%\\Documents\\Astra's PetOS Data\\<repo>\\<kind>"], note: 'Kept out of git on purpose.' },
      { ask: 'An installer', save_in: ['%USERPROFILE%\\Downloads\\installers'], note: 'One copy each.' },
      { ask: 'A secret: an API key, token or password', save_in: ['A password manager; keys through API Fairy'], note: 'Never a plain file.' },
      { ask: 'Not sure, or only for now', save_in: ['%USERPROFILE%\\Downloads'], note: 'Temporary.' }
    ],
    groups: [{ id: 'documents', title: 'Documents: everything we make' }, { id: 'user-folder', title: 'Your user folder' }],
    roles: { home: 'Projects live here', data: 'Project files kept out of git', inbox: 'Drop things here; they get sorted', auto: 'A program’s own; leave it' },
    places: [
      { group: 'documents', path: "%USERPROFILE%\\Documents\\Astra's PetOS", role: 'home', holds: 'Every project repo, one folder per repo.', who: 'you and every assistant' },
      { group: 'documents', path: "%USERPROFILE%\\Documents\\Astra's PetOS Data", role: 'data', holds: 'Project files that stay out of git.', who: 'you and every assistant' },
      { group: 'user-folder', path: '%USERPROFILE%', role: 'auto', holds: 'Each program’s own settings folder, the ones whose names start with a dot. They stay here.', who: 'the programs' },
      { group: 'user-folder', path: '%USERPROFILE%\\Downloads', role: 'inbox', holds: 'Anything not sorted yet.', who: 'you' }
    ]
  };

  // ---- drawing ----
  function draw(d) {
    box.textContent = '';
    var real = !!d && d.schema === SCHEMA;
    var age = real ? Date.now() - new Date(d.looked).getTime() : 0;
    if (lookedLine) lookedLine.textContent = real ? 'Last look: ' + when(d.looked) + '.' : '';
    var ids = wanted && VIEWS[wanted] ? [wanted] : ORDER;
    ids.forEach(function (id) {
      var v = VIEWS[id], sec = el('section', 'tool'), parts = [];
      if (!inTool) sec.appendChild(el('h2', null, v.title));
      if (!real && (id === 'out-of-place' || id === 'save-map-look')) {
        parts = [para('Nothing to show here: this box shows a PC’s own files only when File Kingdom’s page is opened on that PC, after File Master’s look has run.', 'empty')];
      } else {
        try { parts = v.render(real ? d : EXAMPLE) || []; } catch (e) { parts = [el('p', 'note', 'This box could not draw: ' + e.message)]; }
        if (!real) parts.unshift(para('An example, not a real PC. Your own save map shows here on your PC after File Master’s look.', 'note'));
      }
      if (real && age > STALE_MS) parts.unshift(el('p', 'note', 'This look is from ' + when(d.looked) + '. Run the look again to see today.'));
      parts.forEach(function (n) { if (n) sec.appendChild(n); });
      box.appendChild(sec);
    });
    tell();
  }

  // The search box keeps what was typed: the page reads the look once, and again only when a newer look is written.
  var seen = null;
  function load() {
    var s = document.createElement('script');
    s.src = LOCAL + '?t=' + Date.now();
    s.onload = function () { var d = window.fileKingdomTools; s.remove(); var stamp = d && d.looked; if (stamp !== seen || seen === null) { seen = stamp || ''; draw(d); } };
    s.onerror = function () { s.remove(); if (seen === null) { seen = ''; draw(null); } };
    document.head.appendChild(s);
  }
  load();
  setInterval(load, 60000);
  window.addEventListener('load', tell);
})();
