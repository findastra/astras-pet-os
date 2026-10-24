// Rift Rabbit's VRChat launch panel (Astra, 2026-10-23: "a panel that is vrchat-launch-panel which has these distinct
// modules (they are configurations on how to launch VRChat)", to "try out all the different trackings and see what one
// works the best for me"). Two headsets, each with the same four ways of lining up the head and the Lighthouse devices,
// and switches for what else runs. The page only shows the plan and keeps Astra's notes on each try in this browser;
// it starts nothing (a web page cannot open programs on the PC).
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-23. Program names are the System Map's; the three drivers are
// pushrax/OpenVR-SpaceCalibrator, Nyabsi/OpenVR-SpaceOverride and shinyflvre/OpenVR-SpaceSync.

export const TOOL = 'wonderland-launchpad-v1.0-vrchat-launch-panel-v0.1';

export const STREAMERS = [
  ['virtual-desktop', 'Virtual Desktop'],
  ['steam-link', 'Steam Link'],
  ['meta-horizon-link', 'Meta Horizon Link (cable or Air Link)'],
];

// Double Hip Tracker's three uses, plus off (the empty value).
export const DOUBLE = [['', 'Off'], ['hip', 'Double Hip'], ['chest', 'Double Chest'], ['both', 'Both']];

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
    { name: 'Then open', opens: [{ name: 'Double Hip / Double Chest Tracker', extra: 'double-hip' }, { name: 'OVR Smooth Tracking' }, { name: 'OSCGoesBrrr', extra: 'oscgoesbrrr' }] },
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
${/* One program, three ways to use it (Astra, 2026-10-24: "DoubleHip and DoubleChest can be used independently, or
   together. that would be 3 options but 1 software"): a menu like the streamer's. */ ''}<label class="launch-switch">Double Hip / Double Chest Tracker <select data-launch-switch="double-hip">${DOUBLE.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
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
// VRChat Tracking, etc."), and it lists every program it starts, one per line in order, the streamer by the name
// chosen above and the switches' programs while they are on ("we need to show other programs that are starting per
// mode").
function modeCard(h, m, i) {
  const n = `${h.n}.${i}`;
  const untested = (m.untested || []).map((s) => STREAMERS.find(([id]) => id === s)?.[1]).filter(Boolean);
  return `<fieldset class="launch-mode" data-launch-mode="${esc(m.id)}"${untested.length ? ` data-untested="${esc(m.untested.join(' '))}"` : ''}><legend><button type="button" class="launch-fold" aria-expanded="true">Mode ${esc(n)} ${esc(m.name)}</button></legend>
<p class="launch-tracker">${esc(m.tracker)}</p>
<ul class="small launch-points">${m.points.map((p) => `<li>${esc(p)}</li>`).join('')}${untested.length ? `<li class="launch-warn" hidden>Not confirmed with ${esc(untested.join(', '))} yet.</li>` : ''}</ul>
<p class="small launch-label"><b>Starts, in order:</b></p>
<ol class="small launch-order">${launchOrder(h, m).map(step).join('')}</ol>
<p class="small"><b>Turn off:</b> ${m.off.map(esc).join(', ') || 'Nothing'}</p>
<div class="launch-try"><label class="small">How it went <select data-launch-rating>${RATINGS.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></label>
<label class="small launch-note-label">Notes <textarea rows="2" data-launch-note placeholder="Drift after how long, jumps, swaps, lag"></textarea></label>
<span class="small launch-tried" data-launch-tried></span></div>
<p><button type="button" class="button off" disabled title="Not built yet: a web page cannot start programs on the PC">Launch mode ${esc(n)}</button></p>
</fieldset>`;
}

// Each headset box is a tool, so its name sits inside its round border on the first row, with its paired lights left
// of it like every tool's (Astra, 2026-10-24: "title needs to be down inside and with indicator light buttons, its a
// tool"). `lights(key, name)` is the page spawner's.
export function vrchatLaunchBody(lights = () => '') {
  return HEADSETS.map((h) => `<div class="launch-headset" data-launch-headset="${esc(h.id)}"><div class="launch-head">${lights(`tool:vrchat-launch-${h.id}`, `${h.n}. ${h.name}`)}<button type="button" class="launch-fold launch-name" aria-expanded="true">${esc(h.n)}. ${esc(h.name)}</button></div>
${switchRow(h)}
<div class="launch-modes">${MODES.map((m, i) => modeCard(h, m, i)).join('\n')}</div>
</div>`).join('\n');
}
