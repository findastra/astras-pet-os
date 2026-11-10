// PC Master Race's tool page: one tool's live preview inside its tool box on PC Master Race's pet program page
// (?tool=<id>), or every tool when opened on its own. It reads only the page data PC Master Race's look writes on this
// PC (window.pcMasterRaceTools, schema pc-master-race-tools-v1) and builds the page with textContent only.
// Astra, 2026-11-03: "the tool opens and I can see a preview of it and use it straight from this pet program and not
// have to open up the other program." Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
(function () {
  'use strict';
  var LOCAL = "../../../Astra's PetOS Data/pc-master-race/pc-tools-page-data.js";
  var SCHEMA = 'pc-master-race-tools-v1';
  var STALE_MS = 30 * 60 * 1000;
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
  function table(head, rows, opts) {
    var t = el('table'); var tr = el('tr');
    head.forEach(function (h) { tr.appendChild(el('th', null, h)); });
    t.appendChild(tr);
    rows.forEach(function (r) {
      var row = el('tr', opts && opts.off && opts.off(r) ? 'off' : null);
      r.cells.forEach(function (c, i) { row.appendChild(el('td', opts && opts.num && opts.num.indexOf(i) >= 0 ? 'n' : null, c == null ? '' : String(c))); });
      t.appendChild(row);
    });
    return t;
  }
  function bar(pct) { var b = el('div', 'bar'); var s = el('span', pct >= 90 ? 'full' : null); s.style.width = Math.max(0, Math.min(100, pct || 0)) + '%'; b.appendChild(s); return b; }
  function when(iso) { if (!iso) return 'never'; var d = new Date(iso); return isNaN(d) ? iso : d.toLocaleString(); }
  function link(href, text) { var a = el('a', null, text); a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; }

  // ---- the header every tool box shares: on this PC or not, its version, who signed it, running, its license ----
  function status(t, id) {
    var c = el('div', 'chips');
    if (!t) { c.appendChild(chip('not in the last look', 'no')); return c; }
    if (t.held) c.appendChild(chip('held, not installed', 'bad'));
    else c.appendChild(t.installed ? chip('on this PC', 'ok') : chip('not on this PC yet', 'no'));
    if (t.version) c.appendChild(chip('version ' + t.version));
    if (t.installed) {
      if (t.signed === true) c.appendChild(chip('signed by ' + (t.signer || 'its maker'), 'ok'));
      else if (t.unsigned) c.appendChild(chip('not signed', 'no'));
      else if (t.signed === false) c.appendChild(chip('signature not valid', 'bad'));
    }
    if (t.running) c.appendChild(chip('running now', 'run'));
    if (t.license) c.appendChild(chip('license ' + t.license, t.license === 'accepted' ? 'ok' : 'no'));
    return c;
  }
  function where(t) {
    if (!t || !t.installed || !t.path) return null;
    var p = el('p', 'sub'); p.appendChild(document.createTextNode('Lives in ')); p.appendChild(el('code', null, t.path)); return p;
  }
  function notes(t) {
    var out = [];
    if (t && t.held) out.push(el('p', 'note', t.held));
    if (t && t.unsigned) out.push(el('p', 'sub', t.unsigned));
    if (t && t.note) out.push(el('p', 'note', t.note));
    return out;
  }
  function use(text) { return el('p', 'use', text); }
  function needsLicense(t, name) {
    return t && t.installed && t.license !== 'accepted'
      ? el('p', 'note', 'Microsoft’s Sysinternals license for ' + name + ' is not accepted yet, so PC Master leaves it alone. Accept it once (open ' + name + ' and click Agree, or tell Claude in chat), and this box fills on the next look.')
      : null;
  }

  // ---- what each tool box shows ----
  var VIEWS = {
    learn: { title: 'Learn how a computer is organized', render: learn },
    look: { title: 'PC Master Race’s look', render: function (d) {
      var tools = d.tools || {}, ids = Object.keys(tools), on = ids.filter(function (k) { return tools[k].installed; });
      return [para('Last look: ' + when(d.looked) + '. ' + on.length + ' of ' + ids.length + ' tools are on this PC.'),
        table(['Tool', 'On this PC', 'Version', 'Signed by'], ids.map(function (k) { var t = tools[k]; return { cells: [t.name, t.held ? 'held' : t.installed ? 'yes' : 'not yet', t.version || '', t.signer || (t.unsigned ? 'not signed' : '')], t: t }; }), { off: function (r) { return !r.t.installed; } }),
        use('It looks every 10 minutes while its watch runs (winget and WizTree every hour), only reads, and never runs anything as administrator.')];
    } },
    everything: { title: 'Everything', render: function (d) {
      var t = d.tools.everything, es = d.tools.es, p = (t && t.preview) || {}, out = [status(t), where(t)];
      out.push(para('Its index was last saved ' + when(p.index_saved) + '. Everything’s command line (es.exe): ' + (es && es.installed ? 'on this PC, version ' + (es.version || '?') : 'not on this PC yet') + '.'));
      if (p.address) {
        out.push(el('h3', null, 'Search your PC here'));
        var f = el('iframe', 'frame'); f.src = p.address; f.title = 'Everything search'; f.setAttribute('referrerpolicy', 'no-referrer'); out.push(f);
        out.push(use('This is Everything’s own search page, answering on this PC only. Type in its box; click a result to open it.'));
      } else if (p.web_search_on && !p.this_pc_only) out.push(el('p', 'note', 'Everything’s web search is on but open to the network, so PC Master does not show it here.'));
      else if (t && t.installed && !t.running) out.push(el('p', 'note', 'Everything is not running, so its search cannot show here. It runs as administrator, so starting it brings up a Windows prompt for you.'));
      if (p.biggest && p.biggest.length) { out.push(el('h3', null, 'Biggest files')); out.push(table(['File', 'GB'], p.biggest.map(function (b) { return { cells: [b.path, b.gb] }; }), { num: [1] })); }
      return out.concat(notes(t), notes(es));
    } },
    spacesniffer: { title: 'SpaceSniffer', render: function (d) {
      var t = d.tools.spacesniffer, drives = (t && t.preview && t.preview.drives) || [];
      return [status(t), where(t), el('h3', null, 'How full each drive is'),
        table(['Drive', 'Name', 'Size GB', 'Free GB', 'Used'], drives.map(function (v) { return { cells: [v.drive, v.name, v.size_gb, v.free_gb, v.used_pct == null ? '' : v.used_pct + '%'] }; }), { num: [2, 3, 4] }),
        use('These numbers come from Windows. SpaceSniffer’s map of boxes (what fills each drive) draws in its own window.')].concat(notes(t));
    } },
    wiztree: { title: 'WizTree', render: function (d) {
      var t = d.tools.wiztree, p = t && t.preview, out = [status(t), where(t)];
      if (p && p.biggest) { out.push(el('h3', null, 'Biggest folders in your user folder')); out.push(table(['Folder', 'GB', 'Files'], p.biggest.map(function (b) { return { cells: [b.path, b.gb, b.files] }; }), { num: [1, 2] })); out.push(para('Scanned ' + when(p.checked) + '.', 'sub')); }
      else if (t && t.installed) out.push(para('Its first scan comes with the next hourly look.', 'empty'));
      out.push(use('WizTree scans without administrator here, so it walks the folders (slower than its admin mode). Its own window shows the whole drive in seconds.'));
      return out.concat(notes(t));
    } },
    usbdeview: { title: 'USBDeview', render: function (d) {
      var t = d.tools.usbdeview, p = (t && t.preview) || {}, list = p.devices || [];
      return [status(t), where(t), para((p.connected || 0) + ' of ' + list.length + ' USB devices are plugged in now.'),
        table(['Device', 'Type', 'Plugged in', 'Hub / port', 'Maker'], list.map(function (v) { return { cells: [v.name || v.description, v.type, v.connected ? 'yes' : 'no', v.hub, v.vendor], v: v }; }), { off: function (r) { return !r.v.connected; } }),
        use('From USBDeview’s own quiet export. Rift Rabbit’s dongle map uses the same program.')].concat(notes(t));
    } },
    'cpu-z': { title: 'CPU-Z', render: function (d) {
      var t = d.tools['cpu-z'], pc = d.pc || {}, out = [status(t), where(t)];
      out.push(cpuTable(pc));
      out.push(use('Windows’ own numbers for the same parts. CPU-Z’s full report asks for administrator each time, so it stays in its own window.'));
      return out.concat(ramNote(pc), notes(t));
    } },
    hwinfo: { title: 'HWiNFO64', render: function (d) {
      var t = d.tools.hwinfo;
      return [status(t), where(t), use('HWiNFO64 shows every sensor (temperatures, clocks, voltages, fans) in its own window. Its sensor log can feed this box later; that is not built yet.')].concat(notes(t));
    } },
    crystaldiskinfo: { title: 'CrystalDiskInfo', render: function (d) {
      var t = d.tools.crystaldiskinfo, disks = (d.pc && d.pc.disks) || [];
      return [status(t), where(t), el('h3', null, 'Is each drive healthy?'),
        table(['Drive', 'Kind', 'Connected by', 'Health', 'Size GB'], disks.map(function (k) { return { cells: [k.name, k.media, k.bus, k.health, k.size_gb] }; }), { num: [4] }),
        use('Windows’ own health check. CrystalDiskInfo reads every SMART number (hours on, temperature, wear) in its own window, with administrator.')].concat(notes(t));
    } },
    latencymon: { title: 'LatencyMon', render: function (d) { var t = d.tools.latencymon; return [status(t)].concat(notes(t), [use('LatencyMon finds the driver behind audio crackle or VR stutter. It waits for your word before it is installed.')]); } },
    'process-explorer': { title: 'Process Explorer', render: function (d) {
      var t = d.tools['process-explorer'], top = (d.pc && d.pc.top_memory) || [];
      return [status(t), where(t), el('h3', null, 'What uses the most memory now'), table(['Program', 'MB'], top.map(function (p) { return { cells: [p.name, p.mb] }; }), { num: [1] }),
        use('Process Explorer shows the whole tree: which program started which, what each has open, and a VirusTotal check, in its own window. Stopping programs stays Kernel Koala’s job, in Kernel Grove.')].concat(notes(t));
    } },
    autoruns: { title: 'Autoruns', render: function (d) {
      var t = d.tools.autoruns, e = t && t.preview && t.preview.entries, out = [status(t), where(t)];
      if (e) { out.push(el('h3', null, 'What starts at sign-in and as a task (Microsoft’s own hidden)')); out.push(table(['Entry', 'Where it starts from', 'On', 'Company'], e.map(function (x) { return { cells: [x.entry, x.where, x.enabled ? 'yes' : 'no', x.company], x: x }; }), { off: function (r) { return !r.x.enabled; } })); }
      out.push(needsLicense(t, 'Autoruns'));
      out.push(use('Switching items off stays with you: Kernel Grove’s startup switch, or Autoruns’ own window.'));
      return out.concat(notes(t));
    } },
    'process-monitor': { title: 'Process Monitor', render: function (d) { var t = d.tools['process-monitor']; return [status(t), where(t), use('Records every file and registry touch, to see what a program really does. Recording needs administrator, so it runs only when you start it.')].concat(notes(t)); } },
    rammap: { title: 'RAMMap', render: function (d) {
      var t = d.tools.rammap, p = (t && t.preview) || {}, used = p.total_gb ? Math.round((1 - p.free_gb / p.total_gb) * 100) : null, out = [status(t), where(t)];
      out.push(para('Memory in use: ' + (p.total_gb ? (Math.round((p.total_gb - p.free_gb) * 10) / 10) + ' of ' + p.total_gb + ' GB' : 'unknown') + '.'));
      if (used != null) out.push(bar(used));
      out.push(use('RAMMap shows where every page of memory goes (cache, drivers, each program) in its own window, with administrator.'));
      return out.concat(notes(t));
    } },
    tcpview: { title: 'TCPView', render: function (d) {
      var t = d.tools.tcpview, p = t && t.preview, out = [status(t), where(t)];
      if (p) { out.push(el('h3', null, 'Which programs talk over the network')); out.push(table(['Program', 'Talking', 'Listening'], p.programs.map(function (x) { return { cells: [x.name, x.established, x.listening] }; }), { num: [1, 2] })); }
      out.push(needsLicense(t, 'TCPView'));
      return out.concat(notes(t), [use('Packet Piranha measures how well the network works; this shows who is using it.')]);
    } },
    coreinfo: { title: 'Coreinfo', render: function (d) {
      var t = d.tools.coreinfo, p = t && t.preview, out = [status(t), where(t)];
      if (p && p.text) { out.push(el('h3', null, 'Your cores and caches')); out.push(el('pre', null, p.text)); }
      out.push(needsLicense(t, 'Coreinfo'));
      return out.concat(notes(t), [use('A star (*) marks which logical processors share each cache: the map of how your CPU is built.')]);
    } },
    winobj: { title: 'WinObj', render: function (d) { var t = d.tools.winobj; return [status(t), where(t), use('WinObj browses Windows’ own inner map of objects (devices, drivers, events, the names programs share) in its own window. A good companion to the book Windows Internals.')].concat(notes(t)); } },
    handle: { title: 'Handle', render: function (d) { var t = d.tools.handle; return [status(t), where(t), use('Shows what has a file or folder open, the usual reason a rename or delete fails. It needs administrator, so ask Claude to run it with your OK, or use PowerToys’ File Locksmith.')].concat(notes(t)); } },
    sigcheck: { title: 'Sigcheck', render: function (d) {
      var t = d.tools.sigcheck, list = (t && t.preview && t.preview.tools) || [];
      return [status(t), where(t), el('h3', null, 'Who signed each tool'),
        table(['Tool', 'Signed', 'By'], list.map(function (x) { return { cells: [x.name, x.signed ? 'yes' : 'no', x.signer || ''] }; })),
        use('Checked by Windows on every look. Sigcheck itself can go deeper (hashes, VirusTotal) when you ask.')].concat(notes(t));
    } },
    powertoys: { title: 'PowerToys', render: function (d) {
      var t = d.tools.powertoys, p = (t && t.preview) || { on: [], off: [] };
      return [status(t), where(t), el('h3', null, 'Switched on (' + p.on.length + ')'), para(p.on.join(', ') || 'none'), el('h3', null, 'Switched off (' + p.off.length + ')'), para(p.off.join(', ') || 'none', 'sub'),
        use('Worth having on: File Locksmith (what holds a file), Peek (spacebar preview), PowerRename (bulk rename with a preview) and Command Palette (a launcher). Switch them in PowerToys’ Settings.')].concat(notes(t));
    } },
    winget: { title: 'winget', render: function (d) {
      var t = d.tools.winget, p = t && t.preview, out = [status(t)];
      if (p) { out.push(para((p.note || '') + ' Checked ' + when(p.checked) + '.')); if (p.updates.length) out.push(table(['Program', 'You have', 'Newest', 'winget id'], p.updates.map(function (u) { return { cells: [u.name, u.version, u.available, u.id] }; }))); }
      else out.push(para('Its first check comes with the next hourly look.', 'empty'));
      out.push(use('Nothing is updated from here. Patch Cat keeps programs patched; an update waits for your OK.'));
      return out.concat(notes(t));
    } },
    wireshark: { title: 'Wireshark', render: function (d) {
      var t = d.tools.wireshark, a = (t && t.preview && t.preview.adapters) || [];
      return [status(t), where(t), el('h3', null, 'Network adapters it can record on'), a.length ? table(['Adapter'], a.map(function (x) { return { cells: [x] }; })) : para('None listed.', 'empty'),
        use('Recording happens only in Wireshark’s own window, when you start it. Packet Piranha owns network checks.')].concat(notes(t));
    } },
    'windows-performance-recorder': { title: 'Windows Performance Recorder', render: function (d) { var t = d.tools['windows-performance-recorder']; return [status(t), where(t), use('Built into Windows: a deep recording of why the PC is slow, read afterwards in Windows Performance Analyzer. Recording needs administrator, so it runs only when you ask.')].concat(notes(t)); } },
  };
  var ORDER = ['learn', 'look', 'everything', 'spacesniffer', 'wiztree', 'usbdeview', 'cpu-z', 'hwinfo', 'crystaldiskinfo', 'latencymon', 'process-explorer', 'autoruns', 'process-monitor', 'rammap', 'tcpview', 'coreinfo', 'winobj', 'handle', 'sigcheck', 'powertoys', 'winget', 'wireshark', 'windows-performance-recorder'];

  function cpuTable(pc) {
    var cpu = pc.cpu || {}, rows = [
      { cells: ['Processor', cpu.name || 'unknown'] },
      { cells: ['Cores / threads', (cpu.cores || '?') + ' cores, ' + (cpu.threads || '?') + ' threads'] },
      { cells: ['Top speed Windows reports', cpu.max_mhz ? cpu.max_mhz + ' MHz' : '?'] },
    ];
    (pc.caches || []).forEach(function (c) { rows.push({ cells: ['L' + c.level + ' cache', c.kb >= 1024 ? (c.kb / 1024) + ' MB' : c.kb + ' KB'] }); });
    (pc.memory || []).forEach(function (m) { rows.push({ cells: ['Memory ' + m.slot, m.gb + ' GB at ' + (m.speed || '?') + ' MT/s' + (m.part ? ' (' + m.part + ')' : '')] }); });
    (pc.gpus || []).forEach(function (g) { rows.push({ cells: ['Graphics', g.name] }); });
    if (pc.board) rows.push({ cells: ['Motherboard', pc.board] });
    if (pc.windows) rows.push({ cells: ['Windows', pc.windows] });
    return table(['Part', 'Yours'], rows);
  }
  // A memory stick whose part number names a faster speed than it runs at (EXPO or XMP off in the BIOS).
  function ramNote(pc) {
    var m = (pc.memory || [])[0]; if (!m || !m.part || !m.speed) return [];
    var rated = /(\d{4})/.exec(m.part); if (!rated || Number(rated[1]) < m.speed + 200) return [];
    return [el('p', 'note', 'Your memory’s part number (' + m.part + ') names ' + rated[1] + ', and Windows says it runs at ' + m.speed + ' MT/s. Memory runs at its rated speed only when EXPO (AMD) or XMP is switched on in the BIOS. Worth a look; not changed from here.')];
  }

  // ---- learn-computer-organization-tool: the reading path, tied to Astra's own parts ----
  var LESSONS = [
    { n: 1, title: 'Code, by Charles Petzold (2nd edition, 2022)', why: 'From switches to a whole working computer, in plain English and no math. Start here.' },
    { n: 2, title: 'Nand2Tetris (The Elements of Computing Systems)', why: 'Build a computer starting from NAND gates, then its machine language and a small operating system, in browser simulators. Free.', href: 'https://www.nand2tetris.org/' },
    { n: 3, title: 'Ben Eater’s 8-bit computer videos', why: 'A whole computer built on breadboards, wire by wire. Free on YouTube.', href: 'https://eater.net/8bit' },
    { n: 4, title: 'Computer Organization and Design (Patterson and Hennessy, RISC-V edition)', why: 'The standard university textbook for this exact subject: how a processor and its memory are built.' },
    { n: 5, title: 'Computer Systems: A Programmer’s Perspective (Bryant and O’Hallaron)', why: 'How programs really use the caches, memory and processes below them.' },
    { n: 6, title: 'Windows Internals, Part 1', why: 'How Windows itself is organized. Sysinternals is its lab kit: Mark Russinovich made the tools and co-wrote the book.' },
  ];
  var HANDS_ON = [
    ['Digital (logic simulator)', 'https://github.com/hneemann/Digital', 'Draw gates and flip-flops, then run them.'],
    ['Ripes', 'https://github.com/mortbopet/Ripes', 'Watch a RISC-V processor’s pipeline step by step.'],
    ['Compiler Explorer', 'https://godbolt.org/', 'See the machine instructions your code turns into.'],
  ];
  function learn(d) {
    var pc = (d && d.pc) || {}, out = [];
    var KEY = 'pc-master-race-lessons';
    var done = {}; try { done = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { done = {}; }
    out.push(para('You work where chips are made, so you already know the bottom layer. This path goes from the transistor up; tick each step when you finish it (the ticks stay in this browser).'));
    LESSONS.forEach(function (l) {
      var c = el('div', 'lesson');
      var h = el('h3', null, l.n + '. '); if (l.href) h.appendChild(link(l.href, l.title)); else h.appendChild(document.createTextNode(l.title));
      var tick = el('label'); var box = el('input'); box.type = 'checkbox'; box.checked = !!done[l.n];
      box.addEventListener('change', function () { done[l.n] = box.checked; try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) { /* storage off */ } });
      tick.appendChild(box); tick.appendChild(document.createTextNode('Done'));
      add(c, h, para(l.why), tick); out.push(c);
    });
    out.push(el('h3', null, 'Try it with your hands'));
    var ul = el('ul'); HANDS_ON.forEach(function (x) { var li = el('li'); li.appendChild(link(x[1], x[0])); li.appendChild(document.createTextNode(': ' + x[2])); ul.appendChild(li); }); out.push(ul);
    out.push(el('h3', null, 'The memory ladder, on your own PC'));
    var caches = {}; (pc.caches || []).forEach(function (c) { caches[c.level] = c.kb; });
    var size = function (kb) { return kb == null ? 'not reported' : kb >= 1024 ? (kb / 1024) + ' MB' : kb + ' KB'; };
    var ssd = (pc.disks || []).filter(function (x) { return /ssd/i.test(x.media || ''); })[0], usb = (pc.disks || []).filter(function (x) { return /usb/i.test(x.bus || ''); })[0];
    var ladder = table(['Level', 'Yours', 'How long a read takes (typical, not measured here)'], [
      { cells: ['Registers', 'inside each core', 'under a nanosecond'] },
      { cells: ['L1 cache', size(caches[1]) + ' in all', 'about 1 ns'] },
      { cells: ['L2 cache', size(caches[2]) + ' in all', 'about 3 to 4 ns'] },
      { cells: ['L3 cache', size(caches[3]) + ', shared', 'about 10 to 15 ns'] },
      { cells: ['Memory (RAM)', (pc.memory_total_gb || '?') + ' GB', 'about 70 to 100 ns'] },
      { cells: ['SSD', ssd ? ssd.name + ', ' + ssd.size_gb + ' GB' : 'not reported', 'tens of microseconds'] },
      { cells: ['USB hard drive', usb ? usb.name + ', ' + usb.size_gb + ' GB' : 'none', 'several milliseconds'] },
    ]);
    ladder.className = 'ladder'; out.push(ladder);
    if (/X3D/i.test((pc.cpu && pc.cpu.name) || '')) out.push(para('Your ' + pc.cpu.name.replace(/\s+\d+-Core Processor$/i, '') + ' has AMD’s 3D V-Cache: extra L3 cache stacked on top of the cores, which is why its L3 is so large. Games love it because more of their data fits one step from the cores.'));
    out.push(para('Each step down is bigger and slower; the processor keeps what it needs next in the small, fast levels. That idea, the memory hierarchy, is the heart of computer organization.', 'sub'));
    return out.concat(ramNote(pc));
  }

  // ---- drawing ----
  function draw(d) {
    box.textContent = '';
    if (!d || d.schema !== SCHEMA) {
      box.appendChild(para(wanted === 'learn' ? '' : 'Nothing to show here: this page shows a PC’s tools only when PC Master Race’s pet program page is opened on that PC, after its look has run.', 'empty'));
      if (wanted === 'learn') learn(null).forEach(function (n) { box.appendChild(n); });
      tell(); return;
    }
    var age = Date.now() - new Date(d.looked).getTime();
    if (lookedLine) lookedLine.textContent = 'Last look: ' + when(d.looked) + '.';
    var ids = wanted && VIEWS[wanted] ? [wanted] : ORDER;
    ids.forEach(function (id) {
      var v = VIEWS[id]; if (!v) return;
      var sec = el('section', 'tool');
      if (!inTool) sec.appendChild(el('h2', null, v.title));
      var parts = []; try { parts = v.render(d) || []; } catch (e) { parts = [el('p', 'note', 'This box could not draw: ' + e.message)]; }
      parts.forEach(function (n) { if (n) sec.appendChild(n); });
      if (age > STALE_MS && id !== 'learn') sec.insertBefore(el('p', 'note', 'This look is from ' + when(d.looked) + ': PC Master Race’s watch may not be running.'), sec.firstChild);
      box.appendChild(sec);
    });
    tell();
  }

  function load() {
    var s = document.createElement('script');
    s.src = LOCAL + '?t=' + Date.now();
    s.onload = function () { draw(window.pcMasterRaceTools); s.remove(); };
    s.onerror = function () { draw(null); s.remove(); };
    document.head.appendChild(s);
  }
  load();
  setInterval(load, 60000);
  window.addEventListener('load', tell);
})();
