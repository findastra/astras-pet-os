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
<p class="small launch-needs" data-launch-needs hidden></p>
<p><button type="button" class="button off" disabled data-launch-go title="Works on Astra's PC while Rift Rabbit's launcher runs">Launch ${esc(n)}</button></p>
<div class="launch-run" data-launch-run hidden></div>
</fieldset>`;
}

// tracker-strapper (Astra, 2026-10-25): her drawing of the 27 spots where tracking can happen, and which device is on
// each. "Should be so we can select which device is tracking which spot, then your launch options become available
// below"; "I only want to see this diagram once but it's not a launch tool". Her answers: named tracker-strapper; kept
// in Rift Rabbit's launcher settings on her PC (the page there changes them; anywhere else it shows today's spots);
// launch options wait for their spots; the headset on Face picks which launches show; the pole and hoops stand next to
// her, to scale. Numbers, names and codes are hers. Facing you, so her right is on the left.
// `x`, `y`: the spot on the drawing (2.4 px a centimetre: 5′7″ with slightly long arms and torso, her build); `kind`:
// what may go on it.
export const SPOTS = [
  { code: 'RF', n: 1, name: 'Right Foot', x: 308, y: 694 }, { code: 'LF', n: 2, name: 'Left Foot', x: 412, y: 694 },
  { code: 'RA', n: 3, name: 'Right Ankle', x: 322, y: 670 }, { code: 'LA', n: 4, name: 'Left Ankle', x: 398, y: 670 },
  { code: 'RK', n: 5, name: 'Right Knee', x: 326, y: 594 }, { code: 'LK', n: 6, name: 'Left Knee', x: 394, y: 594 },
  { code: 'FW', n: 7, name: 'Front Waist', x: 360, y: 489 }, { code: 'BW', n: 8, name: 'Back Waist', x: 360, y: 459, back: true },
  { code: 'RS', n: 9, name: 'Right Side', x: 302, y: 474 }, { code: 'LS', n: 10, name: 'Left Side', x: 418, y: 474 },
  { code: 'RFS', n: 11, name: 'Right Front-Side', x: 327, y: 486 }, { code: 'LFS', n: 12, name: 'Left Front-Side', x: 393, y: 486 },
  { code: 'RBS', n: 13, name: 'Right Back-Side', x: 327, y: 462, back: true }, { code: 'LBS', n: 14, name: 'Left Back-Side', x: 393, y: 462, back: true },
  { code: 'FS', n: 15, name: 'Front Sternum', x: 360, y: 434 }, { code: 'BS', n: 16, name: 'Back Sternum', x: 360, y: 416, back: true },
  { code: 'FC', n: 17, name: 'Front Chest', x: 360, y: 398 }, { code: 'BC', n: 18, name: 'Back Chest', x: 360, y: 380, back: true },
  { code: 'RE', n: 19, name: 'Right Elbow', x: 280, y: 446 }, { code: 'LE', n: 20, name: 'Left Elbow', x: 440, y: 446 },
  { code: 'RH', n: 21, name: 'Right Hand', x: 266, y: 536, kind: 'right-hand' }, { code: 'LH', n: 22, name: 'Left Hand', x: 454, y: 536, kind: 'left-hand' },
  { code: 'F', n: 23, name: 'Face', x: 360, y: 322, kind: 'headset' }, { code: 'H', n: 24, name: 'Head', x: 360, y: 291 },
  { code: 'DP', n: 25, name: 'Dance Pole', x: 600, y: 62, object: 'dance-pole' },
  { code: 'BDH', n: 26, name: 'Big Dance Hoop', x: 215, y: 475, object: 'large-hoop' },
  { code: 'LDH', n: 27, name: 'Little Dance Hoop', x: 158, y: 292, object: 'small-hoop' },
];

// Double Hip's pair is any two of the eight waist spots, usually Front and Back Waist (Astra, 2026-10-25: "the double hip
// can be made from any of the 8 on the waist, but typical is FW, BW"); Double Chest's any two of the four chest spots.
export const PAIR_SPOTS = { hip: ['FW', 'BW', 'RS', 'LS', 'RFS', 'LFS', 'RBS', 'LBS'], chest: ['FS', 'BS', 'FC', 'BC'] };

// Her devices, by the launcher's ids (findastra/rift-rabbit, its device table). Trackers by their number, sticker and
// serial ("HTC Vive 3.0 #1: (serial #)").
export const DEVICES = {
  headset: [['quest-pro', 'Meta Quest Pro'], ['quest-3', 'Meta Quest 3']],
  'right-hand': [['index-controller-right', 'Valve Index Knuckles (right)'], ['hand-tracking', 'The headset’s hand tracking']],
  'left-hand': [['index-controller-left', 'Valve Index Knuckles (left)'], ['hand-tracking', 'The headset’s hand tracking']],
  tracker: [
    ['vive-tracker-01', 'HTC Vive 3.0 #1 [RF] · LHR-F3DF780D'], ['vive-tracker-02', 'HTC Vive 3.0 #2 [L] · LHR-B2105741'],
    ['vive-tracker-03', 'HTC Vive 3.0 #3 [M] · LHR-91D63DB2'], ['vive-tracker-04', 'HTC Vive 3.0 #4 [C] · LHR-6BA0C57A'],
    ['vive-tracker-05', 'HTC Vive 3.0 #5 [ ] · LHR-28D88802'], ['vive-tracker-06', 'HTC Vive 3.0 #6 [R] · LHR-F8590C98'],
    ['vive-tracker-07', 'HTC Vive 3.0 #7 [LF] · LHR-E0ED8ACE'], ['vive-tracker-08', 'HTC Vive 3.0 #8 [H] · LHR-6963FCE5'],
    ['vive-tracker-09', 'HTC Vive 3.0 #9 [W] · LHR-467E1FA2'],
  ],
};

// Today's spots (Astra, 2026-10-25: "the body spots guess is right"), the same as the launcher's first settings.
export const WORN = {
  F: 'quest-pro', H: 'vive-tracker-08', FC: 'vive-tracker-05', BC: 'vive-tracker-03', FW: 'vive-tracker-09', BW: 'vive-tracker-04',
  RK: 'vive-tracker-06', LK: 'vive-tracker-02', RF: 'vive-tracker-01', LF: 'vive-tracker-07', RH: 'index-controller-right', LH: 'index-controller-left',
};
export const PAIRS = { hip: ['FW', 'BW'], chest: ['FC', 'BC'] };

// What a spot's colour says (the key she kept from the first drawing).
export const SPOT_STATES = [
  ['used', 'VRChat tracks it'],
  ['joined', 'Double Hip or Double Chest pair: joined by DoubleHip DoubleChest Tracker when that Double is on (VRChat ignores it)'],
  ['head', 'Lines up the Lighthouse space in x.1 to x.3 (VRChat ignores it)'],
  ['off', 'No device on this spot'],
];

const spotName = (s) => `${s.n} ${s.name} [${s.code}]`;

function strapperDrawing() {
  const spot = (s) => `<g class="strap-spot${s.back ? ' strap-back' : ''}" data-strap-dot="${esc(s.code)}" tabindex="0" role="button" aria-label="${esc(spotName(s))}"><title>${esc(spotName(s))}</title><circle cx="${s.x}" cy="${s.y}" r="8.5"/><text x="${s.x}" y="${s.y + 3.2}" text-anchor="middle">${s.n}</text></g>`;
  return `<svg class="strap-drawing" viewBox="0 0 640 716" role="img" aria-labelledby="strap-title"><title id="strap-title">Astra, 5′7″, facing you, with the dance pole and two dance hoops to scale, and her 27 tracking spots</title>
<path class="strap-floor" d="M8 704 H632"/>
<g class="strap-body"><ellipse cx="360" cy="322" rx="22" ry="28"/><path d="M360 350 V366 M296 368 L424 368 L404 466 L412 512 L308 512 L316 466 Z M296 368 L280 446 L268 530 M424 368 L440 446 L452 530 M330 512 L326 594 L322 680 L304 698 M390 512 L394 594 L398 680 L416 698"/><ellipse class="strap-band" cx="360" cy="322" rx="34" ry="9"/><ellipse class="strap-ring" cx="360" cy="474" rx="58" ry="15"/></g>
<g class="strap-props"><circle cx="120" cy="330" r="54"/><circle cx="130" cy="560" r="120"/><path d="M600 52 V700"/></g>
${SPOTS.map(spot).join('\n')}
</svg>`;
}

function strapperList() {
  const options = (s) => {
    const kind = s.kind || 'tracker';
    return `<option value="">Nothing</option>${DEVICES[kind].map(([id, name]) => `<option value="${esc(id)}"${WORN[s.code] === id ? ' selected' : ''}>${esc(name)}</option>`).join('')}`;
  };
  const row = (s) => `<label class="strap-row" data-strap-row="${esc(s.code)}"><span class="strap-name"><b>${s.n}</b> ${esc(s.name)} <span class="strap-code">[${esc(s.code)}]</span></span><select data-strap-spot="${esc(s.code)}" disabled>${options(s)}</select></label>`;
  const pair = (p, label) => `<label class="strap-row strap-pair">${esc(label)} <span class="strap-pair-picks">${[0, 1].map((i) => `<select data-strap-pair="${p}" data-strap-i="${i}" disabled>${PAIR_SPOTS[p].map((code) => { const s = SPOTS.find((x) => x.code === code); return `<option value="${esc(code)}"${PAIRS[p][i] === code ? ' selected' : ''}>${esc(spotName(s))}</option>`; }).join('')}</select>`).join(' + ')}</span></label>`;
  return `<div class="strap-list">${SPOTS.map(row).join('\n')}</div>
<div class="strap-pairs">${pair('hip', 'Double Hip pair')}
${pair('chest', 'Double Chest pair')}</div>`;
}

export function trackerStrapper(lights = () => '') {
  return `<div class="launch-headset strapper" data-strapper><div class="launch-head">${lights('tool:tracker-strapper', 'rift-rabbit-tracker-strapper')}<button type="button" class="launch-fold launch-name" aria-expanded="true">rift-rabbit-tracker-strapper</button></div>
${strapperDrawing()}
<ul class="small strap-key">${SPOT_STATES.map(([id, text]) => `<li data-state="${id}">${esc(text)}</li>`).join('')}</ul>
${strapperList()}
<p class="small strap-said" data-strap-said>Change these on the page opened on your PC while Rift Rabbit’s launcher runs; here they show today’s spots.</p>
<p class="strap-footer">27 locations tracking can occur, devices may vary</p>
</div>`;
}

// Each headset box is a tool, so its name sits inside its round border on the first row, with its paired lights left
// of it like every tool's (Astra, 2026-10-24: "title needs to be down inside and with indicator light buttons, its a
// tool"). `lights(key, name)` is the page spawner's. tracker-strapper comes first: the launches below follow it.
export function vrchatLaunchBody(lights = () => '') {
  return trackerStrapper(lights) + '\n' + HEADSETS.map((h) => `<div class="launch-headset" data-launch-headset="${esc(h.id)}"><div class="launch-head">${lights(`tool:vrchat-launch-${h.id}`, `${h.n}. ${h.name}`)}<button type="button" class="launch-fold launch-name" aria-expanded="true">${esc(h.n)}. ${esc(h.name)}</button></div>
${switchRow(h)}
<div class="launch-modes">${MODES.map((m, i) => modeCard(h, m, i)).join('\n')}</div>
</div>`).join('\n');
}
