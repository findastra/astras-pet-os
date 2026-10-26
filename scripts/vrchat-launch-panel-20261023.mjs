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
  // x.4 (Astra, 2026-10-25: her friend found CreoleVR/QuestLHSync; her answers, "all recommended": a fifth mode in each
  // headset tool, waiting for a headset rooted with Magisk). Like Space Sync with the headset's cameras doing the head
  // tracker's job, so 24 Head [H] is free for another spot.
  {
    id: 'questlhsync', name: 'QuestLHSync', tracker: 'No head tracker: the rooted headset’s own cameras see the base stations',
    points: [
      'The headset keeps its own position.',
      'Its cameras see the base stations’ laser flashes, and the Lighthouse devices follow the headset.',
      'Needs the headset rooted with Magisk (Singularity), its QuestLHSync module, and its SteamVR driver on the PC.',
      'The first time, look at each base station; it locks in about half a minute.',
      'Runs alone: two tools moving the same trackers fight each other.',
    ],
    runs: ['QuestLHSync (inside SteamVR)'],
    off: ['Space Calibrator continuous calibration', 'Space Override', 'Space Sync'],
    rooted: true,
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
${/* Mode x.4 needs the headset rooted with Magisk (Astra, 2026-10-25); she ticks this once it is. */ ''}${sw('rooted', 'Rooted with Magisk', false)}
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
// launch options wait for their spots; both headset tools always show, and only the one on Face launches; the pole and hoops stand next to
// her, to scale. Then: "stick figure is a woman obvs", the chest and sternum rings like the waist's, "put the human on
// the left and the toys on the right in a spacious and proportional way", "I want to just click the spot on him, then
// drop down assign a device from there", and a shorter list. Numbers, names and codes are hers. Facing you, so her right
// is on the left.
// `x`, `y`: the spot on the drawing (2.4 px a centimetre: 5′7″ with slightly long arms and torso, her build); `back`:
// on the back half of its ring, drawn dashed; `kind`: what may go on it.
export const SPOTS = [
  { code: 'RF', n: 1, name: 'Right Foot', x: 158, y: 694 }, { code: 'LF', n: 2, name: 'Left Foot', x: 242, y: 694 },
  { code: 'RA', n: 3, name: 'Right Ankle', x: 172, y: 668 }, { code: 'LA', n: 4, name: 'Left Ankle', x: 228, y: 668 },
  { code: 'RK', n: 5, name: 'Right Knee', x: 176, y: 600 }, { code: 'LK', n: 6, name: 'Left Knee', x: 224, y: 600 },
  { code: 'FW', n: 7, name: 'Front Waist', x: 200, y: 500 }, { code: 'BW', n: 8, name: 'Back Waist', x: 200, y: 472, back: true },
  { code: 'RS', n: 9, name: 'Right Side', x: 148, y: 486 }, { code: 'LS', n: 10, name: 'Left Side', x: 252, y: 486 },
  { code: 'RFS', n: 11, name: 'Right Front-Side', x: 174, y: 497 }, { code: 'LFS', n: 12, name: 'Left Front-Side', x: 226, y: 497 },
  { code: 'RBS', n: 13, name: 'Right Back-Side', x: 174, y: 475, back: true }, { code: 'LBS', n: 14, name: 'Left Back-Side', x: 226, y: 475, back: true },
  { code: 'FS', n: 15, name: 'Front Sternum', x: 200, y: 450 }, { code: 'BS', n: 16, name: 'Back Sternum', x: 200, y: 426, back: true },
  { code: 'FC', n: 17, name: 'Front Chest', x: 200, y: 405 }, { code: 'BC', n: 18, name: 'Back Chest', x: 200, y: 379, back: true },
  { code: 'RE', n: 19, name: 'Right Elbow', x: 136, y: 448 }, { code: 'LE', n: 20, name: 'Left Elbow', x: 264, y: 448 },
  { code: 'RH', n: 21, name: 'Right Hand', x: 122, y: 540, kind: 'right-hand' }, { code: 'LH', n: 22, name: 'Left Hand', x: 278, y: 540, kind: 'left-hand' },
  { code: 'F', n: 23, name: 'Face', x: 200, y: 322, kind: 'headset' }, { code: 'H', n: 24, name: 'Head', x: 200, y: 288 },
  { code: 'DP', n: 25, name: 'Dance Pole', x: 955, y: 62, object: 'dance-pole' },
  { code: 'BDH', n: 26, name: 'Big Dance Hoop', x: 555, y: 495, object: 'large-hoop' },
  { code: 'LDH', n: 27, name: 'Little Dance Hoop', x: 488, y: 342, object: 'small-hoop' },
];

// Double Hip's pair is any two of the eight waist spots, usually Front and Back Waist (Astra, 2026-10-25: "the double hip
// can be made from any of the 8 on the waist, but typical is FW, BW"); Double Chest's any two of the four chest spots.
export const PAIR_SPOTS = { hip: ['FW', 'BW', 'RS', 'LS', 'RFS', 'LFS', 'RBS', 'LBS'], chest: ['FS', 'BS', 'FC', 'BC'] };

// Her devices, by the launcher's ids (findastra/rift-rabbit, its device table): [id, name in the picker, short name in
// the list]. Trackers by their number, sticker and serial ("HTC Vive 3.0 #1: (serial #)").
export const DEVICES = {
  headset: [['quest-pro', 'Meta Quest Pro', 'Quest Pro'], ['quest-3', 'Meta Quest 3', 'Quest 3']],
  'right-hand': [['index-controller-right', 'Valve Index Knuckles (right)', 'Index Knuckles'], ['hand-tracking', 'The headset’s hand tracking', 'Hand tracking']],
  'left-hand': [['index-controller-left', 'Valve Index Knuckles (left)', 'Index Knuckles'], ['hand-tracking', 'The headset’s hand tracking', 'Hand tracking']],
  tracker: [
    ['vive-tracker-01', 'HTC Vive 3.0 #1 [RF] · LHR-F3DF780D', 'Vive #1 [RF]'], ['vive-tracker-02', 'HTC Vive 3.0 #2 [L] · LHR-B2105741', 'Vive #2 [L]'],
    ['vive-tracker-03', 'HTC Vive 3.0 #3 [M] · LHR-91D63DB2', 'Vive #3 [M]'], ['vive-tracker-04', 'HTC Vive 3.0 #4 [C] · LHR-6BA0C57A', 'Vive #4 [C]'],
    ['vive-tracker-05', 'HTC Vive 3.0 #5 [ ] · LHR-28D88802', 'Vive #5 [ ]'], ['vive-tracker-06', 'HTC Vive 3.0 #6 [R] · LHR-F8590C98', 'Vive #6 [R]'],
    ['vive-tracker-07', 'HTC Vive 3.0 #7 [LF] · LHR-E0ED8ACE', 'Vive #7 [LF]'], ['vive-tracker-08', 'HTC Vive 3.0 #8 [H] · LHR-6963FCE5', 'Vive #8 [H]'],
    ['vive-tracker-09', 'HTC Vive 3.0 #9 [W] · LHR-467E1FA2', 'Vive #9 [W]'],
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

// Her five toys (Astra, 2026-10-25: "forgot about 5 toys, they dont track though", "look up those devices for better
// sketches", "make them look realistic"): drawn from the makers' product photos, standing on the floor, with no spot.
// The Woojer Vest 3 is to her scale (about 51 cm: a harness with a handle loop, two big transducers high on the chest,
// a mesh spine with a chest strap, and a waist belt with two more transducers and a round buckle). The four Lovense
// toys are drawn twice their size so their shapes read: Nora a 24.4 cm rotating rabbit, Domi 2 a 23 cm mini wand, Lush 3
// an 18 cm egg with a thin tail, Vulse a 21 cm thrusting egg with a ribbed neck and a long tail. `x`, `y`: the drawing's
// top left; `label`: where its name sits.
const shine = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity=".28"/>`;
const pod = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#toy-pod)" stroke="#55555e" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="none" stroke="#2c2c33" stroke-width="1"/>`;
export const TOYS = [
  { name: 'Woojer Vest 3', x: 596, y: 578, label: [654, 716], svg: `<path d="M38 6 Q58 0 78 6 L74 15 Q58 10 42 15 Z" fill="#2e2e35"/><rect x="50" y="1" width="16" height="5" rx="2.5" fill="none" stroke="#6a6a74" stroke-width="1.4"/>
<path d="M38 6 Q20 6 11 22 Q3 40 9 58 Q20 67 35 60 L45 44 L46 14 Z" fill="url(#toy-vest)"/><path d="M78 6 Q96 6 105 22 Q113 40 107 58 Q96 67 81 60 L71 44 L70 14 Z" fill="url(#toy-vest)"/>
<path d="M44 38 L72 38 L70 94 L46 94 Z" fill="url(#toy-mesh)" stroke="#1d1d22" stroke-width="1"/>
<rect x="38" y="52" width="40" height="4" rx="1.5" fill="#1b1b20"/><rect x="54" y="50" width="8" height="8" rx="1.5" fill="#44444c"/>
<path d="M46 78 Q24 73 8 84 Q0 97 6 112 Q20 122 46 112 Z" fill="url(#toy-vest)"/><path d="M70 78 Q92 73 108 84 Q116 97 110 112 Q96 122 70 112 Z" fill="url(#toy-vest)"/>
<rect x="44" y="88" width="28" height="22" rx="4" fill="#232329"/><circle cx="58" cy="99" r="6.5" fill="#3b3b43" stroke="#7a7a84" stroke-width="1.2"/><circle cx="58" cy="99" r="2" fill="#9a9aa4"/>
${pod(26, 33, 11)}${pod(90, 33, 11)}${pod(21, 99, 11)}${pod(95, 99, 11)}
<rect x="84" y="44" width="10" height="13" rx="2" fill="#15151a" stroke="#4a4a52" stroke-width=".8"/><circle cx="89" cy="49" r="2.2" fill="none" stroke="#7fd3ff" stroke-width=".8"/>
<path d="M50 60 V68 M66 60 V68 M48 112 V118 M68 112 V118" stroke="#c4313c" stroke-width="2" stroke-linecap="round"/>
<text x="20" y="48" font-size="5" fill="#8a8a94" transform="rotate(-18 20 48)">woojer</text>` },
  { name: 'Nora', x: 724, y: 583, label: [742, 716], svg: `<path d="M27 74 C36 72 43 64 43 52 C43 45 38 43 36 48 C35 58 32 63 27 64 Z" fill="url(#toy-pink)"/>
<path d="M8 110 Q8 117 18 117 Q28 117 28 110 L28 84 C28 60 28 40 30 24 C32 12 30 2 22 2 C16 2 12 10 10 22 C6 40 8 60 8 84 Z" fill="url(#toy-pink)"/>
<rect x="8" y="81" width="20" height="4" rx="1" fill="url(#toy-silver)"/><circle cx="18" cy="96" r="2.2" fill="#f7c3d6"/><circle cx="18" cy="104" r="2.2" fill="#f7c3d6"/>
${shine(13, 30, 2.2, 14)}${shine(13, 98, 1.8, 9)}` },
  { name: 'Domi 2', x: 776, y: 588, label: [791, 716], svg: `<path d="M8 34 Q15 31 22 34 L21 104 Q15 112 9 104 Z" fill="url(#toy-pink)"/>
<path d="M9 25 Q15 30 21 25 L20 35 Q15 37 10 35 Z" fill="url(#toy-silver)"/>
<ellipse cx="15" cy="14" rx="14" ry="13" fill="url(#toy-head)"/>
<circle cx="15" cy="50" r="2.2" fill="#f7c3d6"/><circle cx="15" cy="58" r="2.2" fill="#f7c3d6"/><rect x="13" y="64" width="4" height="7" rx="2" fill="#f7c3d6"/>
${shine(9, 9, 3.5, 4.5)}${shine(11, 70, 1.6, 22)}` },
  { name: 'Lush 3', x: 814, y: 614, label: [830, 716], svg: `<path d="M12 50 C12 30 22 14 38 8" fill="none" stroke="url(#toy-pink-line)" stroke-width="5.5" stroke-linecap="round"/><circle cx="39" cy="8" r="4.2" fill="#e8508f"/>
<ellipse cx="12" cy="66" rx="10" ry="19" fill="url(#toy-pink)"/>${shine(8, 60, 2.4, 9)}` },
  { name: 'Vulse', x: 864, y: 599, label: [880, 716], svg: `<path d="M12 62 C12 38 26 18 44 10" fill="none" stroke="url(#toy-coral-line)" stroke-width="7" stroke-linecap="round"/><circle cx="45" cy="9.5" r="5" fill="#ff5a68"/>
<rect x="3.5" y="58" width="17" height="6" rx="3" fill="url(#toy-coral)"/><rect x="3" y="64" width="18" height="6" rx="3" fill="url(#toy-coral)"/><rect x="2.5" y="70" width="19" height="6" rx="3" fill="url(#toy-coral)"/><rect x="2.5" y="76" width="19" height="6" rx="3" fill="url(#toy-coral)"/>
<ellipse cx="12" cy="88" rx="9.5" ry="12" fill="url(#toy-coral)"/>${shine(8, 86, 2.2, 6)}` },
];
const TOY_DEFS = `<defs>
<linearGradient id="toy-pink" x1="0" x2="1"><stop offset="0" stop-color="#b8164f"/><stop offset=".45" stop-color="#f0609a"/><stop offset="1" stop-color="#a8124a"/></linearGradient>
<linearGradient id="toy-pink-line" x1="0" x2="1"><stop offset="0" stop-color="#c81c5c"/><stop offset="1" stop-color="#f06a9e"/></linearGradient>
<linearGradient id="toy-coral" x1="0" x2="1"><stop offset="0" stop-color="#c8202f"/><stop offset=".45" stop-color="#ff6b76"/><stop offset="1" stop-color="#b81a28"/></linearGradient>
<linearGradient id="toy-coral-line" x1="0" x2="1"><stop offset="0" stop-color="#d22636"/><stop offset="1" stop-color="#ff7480"/></linearGradient>
<linearGradient id="toy-silver" x1="0" x2="1"><stop offset="0" stop-color="#8d8d96"/><stop offset=".5" stop-color="#e6e6ec"/><stop offset="1" stop-color="#8d8d96"/></linearGradient>
<radialGradient id="toy-head" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f6d3e1"/><stop offset="1" stop-color="#d79ab4"/></radialGradient>
<linearGradient id="toy-vest" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3c3c45"/><stop offset="1" stop-color="#1f1f25"/></linearGradient>
<pattern id="toy-mesh" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#2a2a31"/><circle cx="1.5" cy="1.5" r=".7" fill="#3d3d46"/></pattern>
<radialGradient id="toy-pod" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4a54"/><stop offset="1" stop-color="#141418"/></radialGradient>
</defs>`;

const spotName = (s) => `${s.n} ${s.name} [${s.code}]`;

function strapperDrawing() {
  const spot = (s) => `<g class="strap-spot${s.back ? ' strap-back' : ''}" data-strap-dot="${esc(s.code)}" tabindex="0" role="button" aria-label="${esc(spotName(s))}: pick its device"><title>${esc(spotName(s))}</title><circle cx="${s.x}" cy="${s.y}" r="10"/><text x="${s.x}" y="${s.y + 3.6}" text-anchor="middle">${s.n}</text></g>`;
  const toy = (t) => `<g class="strap-toy"><g transform="translate(${t.x} ${t.y})">${t.svg}</g><text x="${t.label[0]}" y="${t.label[1]}" text-anchor="middle">${esc(t.name)}</text></g>`;
  return `<svg class="strap-drawing" viewBox="0 0 990 724" role="img" aria-labelledby="strap-title"><title id="strap-title">Astra, 5′7″, facing you, with her 27 tracking spots; the dance hoops, her five toys and the dance pole beside her, to scale</title>
<path class="strap-floor" d="M8 704 H982"/>
${TOY_DEFS}
<g class="strap-body"><path class="strap-hair" d="M176 322 Q174 292 200 290 Q226 292 224 322 M177 330 Q170 352 166 376 M223 330 Q230 352 234 376"/><ellipse cx="200" cy="320" rx="22" ry="28"/><path d="M200 348 V368 M152 368 L248 368 L236 486 L254 528 L146 528 L164 486 Z M152 368 L136 448 L124 534 M248 368 L264 448 L276 534 M180 528 L176 600 L172 680 L154 698 M220 528 L224 600 L228 680 L246 698"/><ellipse class="strap-band" cx="200" cy="322" rx="34" ry="9"/><ellipse class="strap-ring" cx="200" cy="392" rx="42" ry="13"/><ellipse class="strap-ring strap-ring-dashed" cx="200" cy="438" rx="38" ry="12"/><ellipse class="strap-ring" cx="200" cy="486" rx="52" ry="14"/></g>
<g class="strap-props"><circle cx="450" cy="380" r="54"/><circle cx="470" cy="580" r="120"/><path d="M955 52 V700"/></g>
<g class="strap-prop-names"><text x="450" y="454" text-anchor="middle">Little Dance Hoop</text><text x="470" y="718" text-anchor="middle">Big Dance Hoop</text><text x="955" y="718" text-anchor="middle">Dance Pole</text></g>
${TOYS.map(toy).join('\n')}
<text class="strap-toy-group" x="819" y="568" text-anchor="middle">Lovense, drawn 2× size</text>
<text class="strap-toy-note" x="760" y="548" text-anchor="middle">Toys don’t track</text>
${SPOTS.map(spot).join('\n')}
</svg>`;
}

// The pickers, one per spot, kept out of sight: clicking a spot on the drawing opens its picker there. The list under
// the drawing shows only the spots with a device, one short line each.
function strapperStore() {
  const options = (s) => {
    const kind = s.kind || 'tracker';
    return `<option value="" data-short="">Nothing</option>${DEVICES[kind].map(([id, name, short]) => `<option value="${esc(id)}" data-short="${esc(short)}"${WORN[s.code] === id ? ' selected' : ''}>${esc(name)}</option>`).join('')}`;
  };
  const row = (s) => `<label data-strap-row="${esc(s.code)}"><span class="strap-name"><b>${s.n}</b> ${esc(s.name)} <span class="strap-code">[${esc(s.code)}]</span></span><select data-strap-spot="${esc(s.code)}" disabled>${options(s)}</select></label>`;
  return `<div class="strap-store" hidden>${SPOTS.map(row).join('\n')}</div>`;
}

function strapperPairs() {
  const pair = (p, label) => `<label class="strap-pair">${esc(label)} <span class="strap-pair-picks">${[0, 1].map((i) => `<select data-strap-pair="${p}" data-strap-i="${i}" disabled>${PAIR_SPOTS[p].map((code) => { const s = SPOTS.find((x) => x.code === code); return `<option value="${esc(code)}"${PAIRS[p][i] === code ? ' selected' : ''}>${esc(`${s.n} ${s.code}`)}</option>`; }).join('')}</select>`).join(' + ')}</span></label>`;
  return `<div class="strap-pairs">${pair('hip', 'Double Hip pair')}
${pair('chest', 'Double Chest pair')}</div>`;
}

export function trackerStrapper(lights = () => '') {
  return `<div class="launch-headset strapper" data-strapper><div class="launch-head">${lights('tool:tracker-strapper', 'rift-rabbit-tracker-strapper')}<button type="button" class="launch-fold launch-name" aria-expanded="true">rift-rabbit-tracker-strapper</button></div>
<div class="strap-stage" data-strap-stage>${strapperDrawing()}
<div class="strap-pop" data-strap-pop hidden role="dialog" aria-label="Pick the device on this spot"><b data-strap-pop-name></b><button type="button" class="strap-pop-close" data-strap-pop-close aria-label="Close">×</button><select data-strap-pop-select></select><span class="small" data-strap-pop-note hidden>Change it on the page opened on your PC.</span></div></div>
<ul class="small strap-key">${SPOT_STATES.map(([id, text]) => `<li data-state="${id}">${esc(text)}</li>`).join('')}</ul>
<ul class="strap-worn" data-strap-worn></ul>
${strapperPairs()}
${strapperStore()}
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
