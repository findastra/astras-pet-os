// Rift Rabbit's VRChat launch panel (Astra, 2026-10-23: "a panel that is vrchat-launch-panel which has these distinct
// modules (they are configurations on how to launch VRChat)", to "try out all the different trackings and see what one
// works the best for me"). Two headsets, each with the same four ways of lining up the head and the Lighthouse devices,
// and switches for what else runs. The page shows the plan and keeps Astra's notes on each try in this browser. A web
// page cannot open programs, so the Launch buttons ask Rift Rabbit's own launcher on her PC
// (`wonderland-launchpad-v1.0-vr-launch-v1.0`, findastra/rift-rabbit, 127.0.0.1 only; Astra, 2026-10-24: "Launching is
// done by Rift Rabbit"); they stay off anywhere else.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-23. Program names are the System Map's; the three drivers are
// pushrax/OpenVR-SpaceCalibrator, Nyabsi/OpenVR-SpaceOverride and shinyflvre/OpenVR-SpaceSync.

export const TOOL = 'wonderland-launchpad-v1.0-vrchat-launch-panel-v0.1';

export const STREAMERS = [
  ['virtual-desktop', 'Virtual Desktop'],
  ['steam-link', 'Steam Link'],
  ['meta-horizon-link', 'Meta Horizon Link (cable or Air Link)'],
];

// DoubleHip DoubleChest Tracker's three uses, plus off (the empty value).
export const DOUBLE = [['', 'Off'], ['hip', 'Double Hip'], ['chest', 'Double Chest'], ['both', 'Both']];

// Object Track VR's objects, plus off (Astra, 2026-10-24: "Also will eventually have Object Track VR, for tracking the
// Small Hoop, Large Hoop, and Dance Pole ... its also a choice between the 4 objects being tracked, like the DoubleHip
// DoubleChest Tracker drop down"). She counts 4; the fourth is hers to name. The program is not out yet (Steam: coming
// soon), so a launch only says so.
export const OBJECTS = [['', 'Off'], ['small-hoop', 'Small Hoop'], ['large-hoop', 'Large Hoop'], ['dance-pole', 'Dance Pole']];

export const HEADSETS = [
  { id: 'quest-pro', n: 1, name: 'VRChat on Quest Pro', device: 'Quest Pro', face: true, about: 'Face and eye tracking through VRCFaceTracking.' },
  { id: 'quest-3', n: 2, name: 'VRChat on Quest 3', device: 'Quest 3', face: false, about: 'No face tracking.' },
];

// `tracker`: what tells SteamVR where the head is, the yellow line under the name. `points`: how it works and what to
// expect, one bullet each, under that line (Astra, 2026-10-24: "1 and 2 need to be combined into bullet points below
// the yellow title, make sure all of these tool sub panels follow that format. Also watch your capitalization, make
// consistent": names in Title Case, every line starting with a capital). `untested`: streamers not confirmed.
export const MODES = [
  {
    id: 'native', name: 'Native VRChat Tracking', tracker: 'No head tracker',
    points: [
      'The headset tracks itself; nothing corrects it.',
      'The baseline to compare the others with.',
      'Lighthouse trackers only line up if they were calibrated once.',
      'With no head tracker, nothing pulls them back when the headset drifts.',
    ],
    runs: [],
    off: ['Space Calibrator continuous calibration', 'Space Override', 'Space Sync'],
  },
  {
    id: 'space-calibrator', name: 'Space Calibrator', tracker: 'Head tracker, 2 positions for the head: the mounted tracker and the headset',
    points: [
      'The headset keeps its own position.',
      'Continuous calibration keeps re-measuring the gap between it and the tracker.',
      'What you use today.',
      'The two systems stay separate, so the gap it chases can grow during a long session.',
    ],
    runs: ['Space Calibrator'],
    off: ['Space Override', 'Space Sync'],
  },
  {
    id: 'space-override', name: 'Space Override', tracker: 'Head tracker, 1 position for the head: the mounted tracker',
    points: [
      'After one calibration, the head position is built from the tracker.',
      'Everything is on the Lighthouses, so nothing can drift apart.',
      'A head tracker that loses the base stations moves your view.',
      'It falls back to the headset if the tracker dies.',
      'Controllers can jump and settle; full-body in VRChat can look odd.',
    ],
    runs: ['Space Override'],
    off: ['Space Calibrator continuous calibration', 'Space Sync'],
    untested: ['meta-horizon-link'],
  },
  {
    id: 'space-sync', name: 'Space Sync', tracker: 'Head tracker, 1 position for the head: the headset in charge',
    points: [
      'The headset keeps its own position.',
      'The tracker measures the gap and moves the Lighthouse devices to follow it.',
      'A beta fork of Space Override, tested mostly on one setup.',
      'Trackers can sway on fast head turns until the head is still.',
    ],
    runs: ['Space Sync (Follow SLAM HMD mode)'],
    off: ['Space Calibrator continuous calibration', 'Space Override'],
    untested: ['meta-horizon-link'],
  },
];

// How each try went, kept in this browser.
export const RATINGS = [['', 'Not tried yet'], ['bad', 'Bad'], ['ok', 'OK'], ['good', 'Good'], ['best', 'Best so far']];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// The steps of a launch, in Astra's order (2026-10-24: "It's usually Virtual Desktop, Quest Pro, Virtual Desktop on
// Quest Pro, SteamVR (which opens a lot of others, VRCFaceTracking, OVR Advanced Settings, OVR Dynamic Resolution),
// then I open DoubleHip DoubleChest Tracker, OVRSmoothTracking, OSCGoesBrrr ... once all of those are connected and the
// trackers look smoother I will open VRChat"). A step is { name } or { name, opens: [...] } or { wait }; `streamer`
// marks the streamer's name, filled in from the switch on the page; `extra` marks a program a switch adds.
export function launchOrder(headset, mode) {
  return [
    { streamer: true, name: STREAMERS[0][1] },
    { name: headset.device },
    { streamer: true, name: STREAMERS[0][1], after: ` on the ${headset.device}` },
    { name: 'SteamVR', note: 'which opens', opens: [...(headset.face ? [{ name: 'VRCFaceTracking' }] : []), { name: 'OVR Advanced Settings' }, { name: 'OVR Dynamic Resolution' }, ...mode.runs.map((r) => ({ name: r }))] },
    { name: 'Then open', opens: [{ name: 'DoubleHip DoubleChest Tracker', extra: 'double-hip' }, { name: 'Object Track VR', extra: 'object-track' }, { name: 'OVR Smooth Tracking' }, { name: 'OSCGoesBrrr', extra: 'oscgoesbrrr' }, { name: 'Woojer vest (Voicemeeter)', extra: 'woojer' }] },
    { wait: 'Wait until all of those are connected and the trackers look smooth.' },
    { name: 'VRChat' },
  ];
}

function switchRow(h) {
  const sw = (key, label, on) => `<label class="launch-switch"><input type="checkbox" data-launch-switch="${esc(key)}"${on ? ' checked' : ''}> ${esc(label)}</label>`;
  return `<div class="launch-switches">
${h.face
    // Face tracking is a box like the others, but one that cannot be unticked: always on with the Quest Pro, never on
    // the Quest 3 (Astra, 2026-10-24: "these need to look similar but the only caveat is the first one cant turn off
    // its always on ... maybe box you cant uncheck").
    ? '<label class="launch-switch launch-fixed" title="Always on with the Quest Pro"><input type="checkbox" checked aria-disabled="true" data-launch-locked> VRCFaceTracking (always on)</label>'
    : '<label class="launch-switch launch-fixed" title="The Quest 3 has no face tracking"><input type="checkbox" aria-disabled="true" data-launch-locked> VRCFaceTracking (no face tracking)</label>'}
${sw('oscgoesbrrr', 'OSCGoesBrrr', true)}
${/* The haptic vest (Astra, 2026-10-24: "We also need an option for Woojer vest (similar to OSCGoesBrrr)"). It has
   no program of its own: it is a Bluetooth audio device that Voicemeeter plays to, so the launch opens Voicemeeter. */ ''}${sw('woojer', 'Woojer vest', false)}
${/* One program, three ways to use it (Astra, 2026-10-24: "DoubleHip and DoubleChest can be used independently, or
   together. that would be 3 options but 1 software"): a menu like the streamer's. */ ''}<label class="launch-switch">DoubleHip DoubleChest Tracker <select data-launch-switch="double-hip">${DOUBLE.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
<label class="launch-switch" title="Not out yet: a launch only says so">Object Track VR <select data-launch-switch="object-track">${OBJECTS.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
<label class="launch-switch">Streamer <select data-launch-switch="streamer">${STREAMERS.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
</div>`;
}

// One step of the start list; a program a switch adds shows only while its switch is on.
function step(s) {
  if (s.wait) return `<li class="launch-wait">${esc(s.wait)}</li>`;
  const name = s.streamer ? `<span data-launch-streamer>${esc(s.name)}</span>${esc(s.after || '')}` : esc(s.name);
  const opens = s.opens ? `${s.note ? `, ${esc(s.note)}:` : ':'}<ul>${s.opens.map((o) => `<li${o.extra ? ` data-launch-extra="${esc(o.extra)}" data-launch-base="${esc(o.name)}" hidden` : ''}>${esc(o.name)}</li>`).join('')}</ul>` : '';
  return `<li>${name}${opens}</li>`;
}

// Each way is a mode, numbered from .0, the native one first (Astra, 2026-10-24: "call them modes. Mode 1.0 Native
// VRChat Tracking, etc."; later the same day: "Get rid of the "Mode" so go back to numbering with . ("2.0 Native VRChat
// Tracking" and "Launch 2.0""), and it lists every program it starts, one per line in order, the streamer by the name
// chosen above and the switches' programs while they are on ("we need to show other programs that are starting per
// mode").
function modeCard(h, m, i) {
  const n = `${h.n}.${i}`;
  const untested = (m.untested || []).map((s) => STREAMERS.find(([id]) => id === s)?.[1]).filter(Boolean);
  return `<fieldset class="launch-mode" data-launch-mode="${esc(m.id)}"${untested.length ? ` data-untested="${esc(m.untested.join(' '))}"` : ''}><legend><button type="button" class="launch-fold" aria-expanded="true">${esc(n)} ${esc(m.name)}</button></legend>
<p class="launch-tracker">${esc(m.tracker)}</p>
<ul class="small launch-points">${m.points.map((p) => `<li>${esc(p)}</li>`).join('')}${untested.length ? `<li class="launch-warn" hidden>Not confirmed with ${esc(untested.join(', '))} yet.</li>` : ''}</ul>
<p class="small launch-label"><b>Starts, in order:</b></p>
<ol class="small launch-order">${launchOrder(h, m).map(step).join('')}</ol>
<p class="small"><b>Turn off:</b> ${m.off.map(esc).join(', ') || 'Nothing'}</p>
<div class="launch-try"><label class="small">How it went <select data-launch-rating>${RATINGS.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></label>
<label class="small launch-note-label">Notes <textarea rows="2" data-launch-note placeholder="Drift after how long, jumps, swaps, lag"></textarea></label>
<span class="small launch-tried" data-launch-tried></span></div>
<p><button type="button" class="button off" disabled data-launch-go title="Works on Astra's PC while Rift Rabbit's launcher runs">Launch ${esc(n)}</button></p>
<div class="launch-run" data-launch-run hidden></div>
</fieldset>`;
}

// Where each tracker is worn (Astra, 2026-10-25, "the body spots guess is right"), by its sticker and serial (the System
// Map's). `pair`: the Double choice that joins it with its partner (her DoubleHip DoubleChest Tracker: Hip [W] + [C],
// Chest [ ] + [M]), A first. `head`: the tracker on the headset in modes x.1 to x.3. `back`: worn on the back, drawn
// dashed beside its front partner. `x`, `y`: the marker on the drawing; `side`: which side its label is on.
export const TRACKERS = [
  { sticker: '[H]', serial: 'LHR-6963FCE5', spot: 'Head tracker', head: true, x: 220, y: 28, side: 'left' },
  { sticker: '[ ]', serial: 'LHR-28D88802', spot: 'Front chest', pair: 'chest', x: 208, y: 142, side: 'left' },
  { sticker: '[M]', serial: 'LHR-91D63DB2', spot: 'Back chest', pair: 'chest', back: true, x: 232, y: 142, side: 'right' },
  { sticker: '[W]', serial: 'LHR-467E1FA2', spot: 'Front waist', pair: 'hip', x: 208, y: 224, side: 'left' },
  { sticker: '[C]', serial: 'LHR-6BA0C57A', spot: 'Back waist', pair: 'hip', back: true, x: 232, y: 224, side: 'right' },
  { sticker: '[R]', serial: 'LHR-F8590C98', spot: 'Right knee', x: 178, y: 348, side: 'left' },
  { sticker: '[L]', serial: 'LHR-B2105741', spot: 'Left knee', x: 262, y: 348, side: 'right' },
  { sticker: '[RF]', serial: 'LHR-F3DF780D', spot: 'Right foot', x: 170, y: 430, side: 'left' },
  { sticker: '[LF]', serial: 'LHR-E0ED8ACE', spot: 'Left foot', x: 270, y: 430, side: 'right' },
];

// What each tracker is doing in the launch the drawing shows; the page script sets them.
export const TRACKER_STATES = [
  ['used', 'VRChat tracks it'],
  ['joined', 'Joined by DoubleHip DoubleChest Tracker (VRChat ignores it)'],
  ['head', 'Lines up the Lighthouse space (VRChat ignores it)'],
  ['off', 'Not used in this mode'],
];

// One drawing of her body for the launch she is looking at (Astra, 2026-10-25: "I just want to see the diagram change,
// based on what selections are made. One diagram, and the headset changes too"). Facing you, so her right is on the
// left; back trackers are dashed beside their front partner. It shows the mode last clicked and that headset's switches,
// and the --ignore-trackers list the launcher writes into VRChat's launch options in Steam.
function trackerDiagram() {
  const label = (t) => {
    const lx = t.side === 'left' ? 150 : 290, anchor = t.side === 'left' ? 'end' : 'start';
    return `<path class="trk-leader" d="M ${lx + (t.side === 'left' ? 4 : -4)} ${t.y} L ${t.x + (t.side === 'left' ? -9 : 9)} ${t.y}"/>
<text x="${lx}" y="${t.y - 2}" text-anchor="${anchor}">${esc(t.sticker)} ${esc(t.spot)}<tspan class="trk-state" x="${lx}" dy="15" data-trk-state></tspan></text>`;
  };
  const marker = (t) => `<g class="trk${t.back ? ' trk-back' : ''}" data-trk="${esc(t.sticker)}" data-serial="${esc(t.serial)}"${t.pair ? ` data-trk-pair="${esc(t.pair)}"` : ''}${t.head ? ' data-trk-head' : ''}><title>${esc(t.sticker)} ${esc(t.spot)}, ${esc(t.serial)}</title>
<circle cx="${t.x}" cy="${t.y}" r="8"/>
${label(t)}</g>`;
  const join = (pair, y) => `<rect class="trk-join" data-trk-join="${pair}" x="192" y="${y - 15}" width="56" height="30" rx="15"/>`;
  const hand = (x, name) => `<g class="trk-hand"><rect x="${x - 7}" y="250" width="14" height="22" rx="5"/><text x="${x}" y="292" text-anchor="middle">${esc(name)}</text></g>`;
  return `<div class="trk-diagram" data-trk-diagram data-headset="quest-pro" data-woojer="off">
<p class="trk-showing"><b data-trk-showing>1.1 Space Calibrator on the Quest Pro</b> <span class="small">· click a mode below to see its trackers</span></p>
<svg viewBox="0 0 440 466" role="img" aria-labelledby="trk-title"><title id="trk-title">Where each tracker is worn and what it does in this launch</title>
<g class="trk-body"><circle cx="220" cy="58" r="24"/><path d="M220 82 V94 M168 100 Q220 92 272 100 L262 232 Q220 242 178 232 Z M178 232 L170 262 Q220 274 270 262 L262 232 M168 104 L140 180 L124 250 M272 104 L300 180 L316 250 M184 266 L176 350 L170 430 L152 440 M256 266 L264 350 L270 430 L288 440"/></g>
<path class="trk-vest" d="M176 104 L264 104 L258 202 L182 202 Z"/><text class="trk-vest" x="290" y="184">Woojer vest</text>
<g class="trk-hs trk-hs-quest-pro"><rect x="194" y="48" width="52" height="16" rx="7"/><path class="trk-leader" d="M 286 56 L 250 56"/><text x="290" y="54">Quest Pro<tspan class="trk-state" x="290" dy="15">face and eye tracking</tspan></text></g>
<g class="trk-hs trk-hs-quest-3"><rect x="190" y="44" width="60" height="24" rx="10"/><circle cx="204" cy="56" r="2.5"/><circle cx="236" cy="56" r="2.5"/><path class="trk-leader" d="M 286 56 L 254 56"/><text x="290" y="54">Quest 3<tspan class="trk-state" x="290" dy="15">no face tracking</tspan></text></g>
${join('chest', 142)}${join('hip', 224)}
${hand(124, 'Index R')}${hand(316, 'Index L')}
${TRACKERS.map(marker).join('\n')}
</svg>
<ul class="small trk-key">${TRACKER_STATES.map(([id, text]) => `<li data-state="${id}">${esc(text)}</li>`).join('')}</ul>
<p class="small trk-steam">VRChat’s launch options in Steam: <code data-trk-steam></code></p>
</div>`;
}

// Each headset box is a tool, so its name sits inside its round border on the first row, with its paired lights left
// of it like every tool's (Astra, 2026-10-24: "title needs to be down inside and with indicator light buttons, its a
// tool"). `lights(key, name)` is the page spawner's. The tracker drawing comes first, above both.
export function vrchatLaunchBody(lights = () => '') {
  return trackerDiagram() + '\n' + HEADSETS.map((h) => `<div class="launch-headset" data-launch-headset="${esc(h.id)}" data-launch-device="${esc(h.device)}"><div class="launch-head">${lights(`tool:vrchat-launch-${h.id}`, `${h.n}. ${h.name}`)}<button type="button" class="launch-fold launch-name" aria-expanded="true">${esc(h.n)}. ${esc(h.name)}</button></div>
${switchRow(h)}
<div class="launch-modes">${MODES.map((m, i) => modeCard(h, m, i)).join('\n')}</div>
</div>`).join('\n');
}
