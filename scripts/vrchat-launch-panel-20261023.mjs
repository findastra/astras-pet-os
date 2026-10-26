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

// Her Lovense toys (Astra, 2026-10-26).
export const LOVENSE = [['nora', 'Nora'], ['domi-2', 'Domi 2'], ['lush-3', 'Lush 3'], ['vulse', 'Vulse']];

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
    { name: 'SteamVR', note: 'which opens', opens: [...(headset.face ? [{ name: 'VRCFaceTracking', extra: 'face' }] : []), { name: 'OVR Advanced Settings' }, { name: 'OVR Dynamic Resolution' }, ...mode.runs.map((r) => ({ name: r }))] },
    { name: 'Then open', opens: [{ name: 'DoubleHip DoubleChest Tracker', extra: 'double-hip' }, { name: 'Object Track VR', extra: 'object-track' }, { name: 'OVR Smooth Tracking' }, { name: 'Base Station FOV Viewer', extra: 'fov' }, { name: 'VR Pole Overlay', extra: 'pole' }, { name: 'OSCGoesBrrr', extra: 'oscgoesbrrr' }, { name: 'Woojer vest (Voicemeeter)', extra: 'woojer' }, ...LOVENSE.map(([id, name]) => ({ name: `Lovense ${name} (connect it in its app)`, extra: `lovense-${id}` }))] },
    { wait: 'Wait until all of those are connected and the trackers look smooth.' },
    { name: 'VRChat' },
  ];
}

function switchRow(h) {
  const sw = (key, label, on) => `<label class="launch-switch"><input type="checkbox" data-launch-switch="${esc(key)}"${on ? ' checked' : ''}> ${esc(label)}</label>`;
  return `<div class="launch-switches">
${/* Face tracking is a choice on the Quest Pro, and the Quest 3 has none, so no box there (Astra, 2026-10-26: "I also do
   have the option of using facetracking or not on Quest Pro, its just Quest 3 doesnt have it, so you can remove it from
   there"). */ ''}${h.face ? sw('face', 'VRCFaceTracking', true) : ''}
${/* Her two overlays, ticked on or off at any moment: on her PC a tick opens or closes it right away, and a launch opens
   the ticked ones (2026-10-26: "I would like to be able to turn these on at any moment, and I see what they are showing
   in game"). */ ''}${sw('fov', 'Base Station FOV Viewer', false)}
${sw('pole', 'VR Pole Overlay', false)}
${sw('oscgoesbrrr', 'OSCGoesBrrr', true)}
${/* Mode x.4 needs the headset rooted with Magisk (Astra, 2026-10-25); she ticks this once it is. */ ''}${sw('rooted', 'Rooted with Magisk', false)}
${/* The haptic vest (Astra, 2026-10-24: "We also need an option for Woojer vest (similar to OSCGoesBrrr)"). It has
   no program of its own: it is a Bluetooth audio device that Voicemeeter plays to, so the launch opens Voicemeeter. */ ''}${sw('woojer', 'Woojer vest', false)}
${/* Which of her Lovense toys (2026-10-26: "need to select which if not all of the Lovense Toys"). They connect in their
   own app, so a launch lists them as a reminder. */ ''}<span class="launch-switch launch-group">Lovense ${LOVENSE.map(([id, name]) => `<label><input type="checkbox" data-launch-switch="lovense-${esc(id)}"> ${esc(name)}</label>`).join(' ')}</span>
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
// Then (2026-10-26): "Redo these designs they still are not ergonomic or look good (person, objects)", and "The person
// is hard to understand, you can break away from the conventional design I had as long as you can tell front to back":
// she is drawn twice now, from the front and from the back, side by side, at 3 px a centimetre. Each spot sits on the
// view it belongs to; the side and front-side spots on the front view, the back ones on the back view, where her right
// is on your right. The hoops are aerial hoops hanging from the ceiling, the pole runs floor to ceiling.
// `view`, `x`, `y`: the spot on that view's figure (drawn 190 wide-centre, 930 floor, then placed); `kind`: what may go
// on it.
const SCALE = 3 / 3.2, FLOOR = 860, VIEW_X = { front: 140, back: 380 };
const place = (s) => s.view ? { ...s, x: Math.round(VIEW_X[s.view] + (s.x - 190) * SCALE), y: Math.round(FLOOR - (930 - s.y) * SCALE) } : s;
export const SPOTS = [
  { code: 'RF', n: 1, name: 'Right Foot', view: 'front', x: 150, y: 924 }, { code: 'LF', n: 2, name: 'Left Foot', view: 'front', x: 230, y: 924 },
  { code: 'RA', n: 3, name: 'Right Ankle', view: 'front', x: 158, y: 894 }, { code: 'LA', n: 4, name: 'Left Ankle', view: 'front', x: 222, y: 894 },
  { code: 'RK', n: 5, name: 'Right Knee', view: 'front', x: 160, y: 800 }, { code: 'LK', n: 6, name: 'Left Knee', view: 'front', x: 220, y: 800 },
  { code: 'FW', n: 7, name: 'Front Waist', view: 'front', x: 190, y: 650 }, { code: 'BW', n: 8, name: 'Back Waist', view: 'back', x: 190, y: 650 },
  { code: 'RS', n: 9, name: 'Right Side', view: 'front', x: 126, y: 640 }, { code: 'LS', n: 10, name: 'Left Side', view: 'front', x: 254, y: 640 },
  { code: 'RFS', n: 11, name: 'Right Front-Side', view: 'front', x: 160, y: 650 }, { code: 'LFS', n: 12, name: 'Left Front-Side', view: 'front', x: 220, y: 650 },
  { code: 'RBS', n: 13, name: 'Right Back-Side', view: 'back', x: 220, y: 650 }, { code: 'LBS', n: 14, name: 'Left Back-Side', view: 'back', x: 160, y: 650 },
  { code: 'FS', n: 15, name: 'Front Sternum', view: 'front', x: 190, y: 594 }, { code: 'BS', n: 16, name: 'Back Sternum', view: 'back', x: 190, y: 594 },
  { code: 'FC', n: 17, name: 'Front Chest', view: 'front', x: 190, y: 538 }, { code: 'BC', n: 18, name: 'Back Chest', view: 'back', x: 190, y: 538 },
  { code: 'RE', n: 19, name: 'Right Elbow', view: 'front', x: 108, y: 598 }, { code: 'LE', n: 20, name: 'Left Elbow', view: 'front', x: 272, y: 598 },
  { code: 'RH', n: 21, name: 'Right Hand', view: 'front', x: 93, y: 716, kind: 'right-hand' }, { code: 'LH', n: 22, name: 'Left Hand', view: 'front', x: 287, y: 716, kind: 'left-hand' },
  { code: 'F', n: 23, name: 'Face', view: 'front', x: 190, y: 416, kind: 'headset' }, { code: 'H', n: 24, name: 'Head', view: 'back', x: 190, y: 404 },
  { code: 'DP', n: 25, name: 'Dance Pole', x: 1020, y: 130, object: 'dance-pole' },
  { code: 'BDH', n: 26, name: 'Big Dance Hoop', x: 790, y: 410, object: 'large-hoop' },
  { code: 'LDH', n: 27, name: 'Little Dance Hoop', x: 948, y: 402, object: 'small-hoop' },
].map(place);

// Double Hip's pair is any two of the eight waist spots, usually Front and Back Waist (Astra, 2026-10-25: "the double hip
// can be made from any of the 8 on the waist, but typical is FW, BW"); Double Chest's any two of the four chest and
// sternum spots, front with back crossed too (2026-10-26: "the front chest and back sternum can be combined for a
// doublechest, and front sternum back chest"). When exactly two spots of a group have trackers, they are the pair.
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

// Her five toys (Astra, 2026-10-25: "forgot about 5 toys, they dont track though"; 2026-10-26: "redo the woojer and
// lovense toys to look exactly like real life"): drawn from the makers' product photos, true size at her scale,
// standing on the floor under the big hoop, with no spot. Woojer Vest 3, about 51 cm: a black harness with a handle
// loop, two big round transducers high on the chest, a mesh spine with its chest strap and screen, and a winged waist
// belt with two more transducers and a round buckle, red stitching. Lovense Nora, 24.4 cm: a pink rotating-head rabbit
// with its arm, a silver band and buttons. Domi 2, 23 cm: a mini wand, pale round head on a grey neck, pink handle.
// Lush 3, 18 cm: a pink egg with a thin bendable tail. Vulse, 21 cm: a coral thrusting egg with a ribbed neck and a long
// curled tail. `x`, `y`: the drawing's top left; `scale`: from the outline's own size to hers; `label`: its name.
const shine = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity=".3"/>`;
const pod = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 1.5}" fill="#141418"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#toy-pod)" stroke="#60606a" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="#2c2c33" stroke-width="1.2"/><path d="M${cx - r * 0.6} ${cy - r * 0.45} A ${r * 0.8} ${r * 0.8} 0 0 1 ${cx + r * 0.3} ${cy - r * 0.75}" fill="none" stroke="#8a8a96" stroke-width=".9" opacity=".7"/>`;
const stitch = (d) => `<path d="${d}" fill="none" stroke="#5a5a64" stroke-width=".7" stroke-dasharray="1.6 1.4"/>`;
export const TOYS = [
  { name: 'Woojer Vest 3', x: 500, y: 707, scale: 1.25, label: [572, 880], svg: `<path d="M40 8 L30 0 M76 8 L86 0" stroke="#1d1d22" stroke-width="5" stroke-linecap="round"/>
<path d="M38 6 Q58 -1 78 6 L74 16 Q58 10 42 16 Z" fill="#2e2e35"/><rect x="50" y="0" width="16" height="6" rx="3" fill="none" stroke="#6a6a74" stroke-width="1.6"/>
<path d="M38 6 Q20 6 11 22 Q3 40 9 58 Q20 68 36 60 L46 44 L46 14 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/><path d="M78 6 Q96 6 105 22 Q113 40 107 58 Q96 68 80 60 L70 44 L70 14 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/>
${stitch('M38 10 Q22 11 14 24 Q7 40 12 55 Q21 63 34 57')}${stitch('M78 10 Q94 11 102 24 Q109 40 104 55 Q95 63 82 57')}
<path d="M44 36 L72 36 L70 94 L46 94 Z" fill="url(#toy-mesh)" stroke="#1d1d22" stroke-width="1"/><text x="51" y="78" font-size="3.4" fill="#6a6a74" transform="rotate(90 51 78)">born to feel</text>
<rect x="36" y="52" width="44" height="4" rx="1.5" fill="#18181d"/><rect x="53" y="49.5" width="10" height="9" rx="2" fill="#4a4a52" stroke="#7a7a84" stroke-width=".6"/>
<path d="M46 78 Q24 72 8 84 Q0 97 6 112 Q20 123 46 112 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/><path d="M70 78 Q92 72 108 84 Q116 97 110 112 Q96 123 70 112 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/>
${stitch('M44 82 Q26 78 12 87 Q5 98 10 109 Q22 117 44 109')}${stitch('M72 82 Q90 78 104 87 Q111 98 106 109 Q94 117 72 109')}
<rect x="43" y="88" width="30" height="22" rx="4" fill="#202026"/><circle cx="58" cy="99" r="7" fill="#3b3b43" stroke="#8a8a94" stroke-width="1.2"/><circle cx="58" cy="99" r="3.2" fill="none" stroke="#b0b0ba" stroke-width="1"/><circle cx="58" cy="99" r="1.2" fill="#d0d0d8"/>
${pod(26, 33, 11)}${pod(90, 33, 11)}${pod(21, 99, 11)}${pod(95, 99, 11)}
<rect x="84" y="43" width="11" height="15" rx="2" fill="#0f0f13" stroke="#4a4a52" stroke-width=".8"/><circle cx="89.5" cy="48" r="2.4" fill="none" stroke="#7fd3ff" stroke-width=".8"/><rect x="86.5" y="52.5" width="6" height="1.2" fill="#7fd3ff" opacity=".7"/>
<path d="M49 60 V70 M67 60 V70 M47 112 V119 M69 112 V119" stroke="#c4313c" stroke-width="2.2" stroke-linecap="round"/>
<text x="18" y="50" font-size="5.5" fill="#9a9aa4" font-style="italic" transform="rotate(-20 18 50)">woojer</text>` },
  { name: 'Nora', x: 680, y: 787, scale: 0.625, label: [694, 880], svg: `<path d="M27 74 C36 72 43 64 44 52 C44 44 39 42 36 47 C35 58 32 63 27 64 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M8 110 Q8 118 18 118 Q28 118 28 110 L28 84 C28 60 28 42 30 26 C32 12 30 2 22 2 C16 2 12 10 10 22 C6 40 8 60 8 84 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M11 18 Q20 22 30 18 M10 24 Q20 28 30 24" fill="none" stroke="#c2185b" stroke-width=".8" opacity=".7"/>
<rect x="8" y="81" width="20" height="4.5" rx="1" fill="url(#toy-silver)"/><circle cx="18" cy="94" r="2.6" fill="#fbd3e2"/><path d="M16.8 94 h2.4 M18 92.8 v2.4" stroke="#c2185b" stroke-width=".7"/><circle cx="18" cy="102" r="2.6" fill="#fbd3e2"/><path d="M16.8 102 h2.4" stroke="#c2185b" stroke-width=".7"/>
${shine(13, 34, 2.2, 16)}${shine(12.5, 100, 1.6, 9)}${shine(38, 54, 1.2, 5)}` },
  { name: 'Domi 2', x: 722, y: 791, scale: 0.625, label: [731, 880], svg: `<path d="M8 36 Q15 33 22 36 L21 104 Q15 112 9 104 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M9 25 Q15 30 21 25 L20 36 Q15 38 10 36 Z" fill="url(#toy-silver)"/><path d="M8.5 37.5 Q15 40 21.5 37.5" fill="none" stroke="#ff9ac2" stroke-width="1.6" opacity=".9"/>
<ellipse cx="15" cy="14" rx="14.5" ry="13" fill="url(#toy-head)" stroke="#c98aa6" stroke-width=".6"/>
<circle cx="15" cy="52" r="2.6" fill="#fbd3e2"/><circle cx="15" cy="60" r="2.6" fill="#fbd3e2"/><rect x="13.2" y="66" width="3.6" height="8" rx="1.8" fill="#fbd3e2"/>
${shine(9, 9, 3.6, 4.6)}${shine(11, 72, 1.6, 24)}` },
  { name: 'Lush 3', x: 758, y: 806, scale: 0.625, label: [772, 880], svg: `<path d="M12 50 C12 30 22 14 38 8" fill="none" stroke="#8e0f3c" stroke-width="7" stroke-linecap="round"/><path d="M12 50 C12 30 22 14 38 8" fill="none" stroke="url(#toy-pink-line)" stroke-width="5.4" stroke-linecap="round"/><ellipse cx="39.5" cy="7.5" rx="5" ry="3.6" fill="#e8508f" stroke="#8e0f3c" stroke-width=".7" transform="rotate(-20 39.5 7.5)"/>
<ellipse cx="12" cy="66" rx="10.5" ry="19" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/><path d="M4 74 Q12 80 20 74" fill="none" stroke="#c2185b" stroke-width=".8" opacity=".6"/>${shine(8, 60, 2.4, 9)}` },
  { name: 'Vulse', x: 800, y: 797, scale: 0.625, label: [815, 880], svg: `<path d="M12 62 C12 38 26 18 44 10" fill="none" stroke="#9e1622" stroke-width="8.5" stroke-linecap="round"/><path d="M12 62 C12 38 26 18 44 10" fill="none" stroke="url(#toy-coral-line)" stroke-width="7" stroke-linecap="round"/><ellipse cx="45.5" cy="9.5" rx="5.6" ry="4.4" fill="#ff5a68" stroke="#9e1622" stroke-width=".7" transform="rotate(-25 45.5 9.5)"/>
<rect x="3.5" y="58" width="17" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="3" y="64" width="18" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="2.5" y="70" width="19" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="2.5" y="76" width="19" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/>
<ellipse cx="12" cy="89" rx="10" ry="12.5" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".8"/>${shine(8, 86, 2.2, 6)}` },
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

// What each device looks like on its spot (Astra, 2026-10-26: "Lets make the tracker spots actually look like HTC Vive
// 3.0, and Index Controller, etc. depending on selection"): a Vive Tracker 3.0 is a rounded three-lobed puck with its
// round centre and light; an Index controller its handle and ring; a headset a visor; hand tracking an open hand. An
// empty spot is a small ring. The spot's number rides on a badge at its corner, its colour ring says what it does.
const DEVICE_SYMBOLS = `<symbol id="ico-tracker" viewBox="-12 -12 24 24"><path d="M0 -10.5 C3.5 -10.5 7 -5 9.6 0.5 C11.6 4.8 9.8 9 5.6 9.4 C2 9.8 -2 9.8 -5.6 9.4 C-9.8 9 -11.6 4.8 -9.6 0.5 C-7 -5 -3.5 -10.5 0 -10.5 Z" fill="#26262c" stroke="#8a8a96" stroke-width="1"/><circle r="5.2" fill="#1a1a1f" stroke="#55555f" stroke-width="1"/><circle r="2.6" fill="#33333b"/><circle cy="-7.2" r="1.1" fill="#6cc7e8"/></symbol>
<symbol id="ico-index" viewBox="-12 -12 24 24"><path d="M-2.6 -2 L-2.8 10 Q0 12 2.8 10 L2.6 -2 Z" fill="#26262c" stroke="#8a8a96" stroke-width="1"/><ellipse cy="-6" rx="7" ry="5.4" fill="#1d1d22" stroke="#8a8a96" stroke-width="1"/><ellipse cy="-6" rx="3.6" ry="2.6" fill="#33333b"/><path d="M-7 -3 Q-10 4 -3 8" fill="none" stroke="#6a6a74" stroke-width="1.4"/></symbol>
<symbol id="ico-headset" viewBox="-12 -12 24 24"><path d="M-11 -4 Q0 -8.5 11 -4 L10 4.5 Q0 7.5 -10 4.5 Z" fill="#1b1b20" stroke="#8a8a96" stroke-width="1"/><path d="M-8 -2.5 Q0 -5 8 -2.5" fill="none" stroke="#5a5a66" stroke-width="1"/><ellipse cx="-4.5" cy="1" rx="3" ry="1.6" fill="#3a3a46"/><ellipse cx="4.5" cy="1" rx="3" ry="1.6" fill="#3a3a46"/></symbol>
<symbol id="ico-hand" viewBox="-12 -12 24 24"><path d="M-5 10 L-6 0 L-8.5 -4 M-6 0 L-4 -9 M-2 -1 L-1 -10.5 M1 -1 L2.5 -9.5 M3.5 0 L5.6 -6.5 M-5 10 Q2 12 4.5 6 L6 -1" fill="none" stroke="#d9d2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>`;

const spotName = (s) => `${s.n} ${s.name} [${s.code}]`;

// Her figure, the same body for both views (drawn 190 wide-centre, 930 floor): the front view wears the headset's
// visor and shows her face side; the back view shows her long hair and the headset's back strap, where [H] rides.
function figure(view) {
  const limb = (d, w) => `<path class="strap-limb-edge" d="${d}" stroke-width="${w + 4}"/><path class="strap-limb" d="${d}" stroke-width="${w}"/>`;
  const head = view === 'front'
    ? `<path class="strap-hair" d="M164 418 C158 372 222 372 216 418 C220 445 226 470 232 490 C216 486 208 472 205 454 L175 454 C172 472 164 486 148 490 C154 470 160 445 164 418 Z"/>
<ellipse class="strap-skin" cx="190" cy="420" rx="25" ry="33"/><path class="strap-hair" d="M166 404 C170 380 210 380 214 404 C204 392 176 392 166 404 Z"/>
<rect class="strap-headset" x="158" y="404" width="64" height="24" rx="11"/><path class="strap-crease" d="M182 442 Q190 446 198 442"/>`
    : `<ellipse class="strap-skin" cx="190" cy="420" rx="25" ry="33"/>
<path class="strap-hair" d="M163 416 C158 368 222 368 217 416 C222 448 230 478 236 504 C214 500 166 500 144 504 C150 478 158 448 163 416 Z"/>
<rect class="strap-headset" x="164" y="398" width="52" height="11" rx="5"/>`;
  return `<g class="strap-figure strap-${view}" transform="translate(${VIEW_X[view] - 190 * SCALE} ${FLOOR - 930 * SCALE}) scale(${SCALE})">
<ellipse class="strap-shadow" cx="190" cy="930" rx="70" ry="7"/>
${limb('M166 700 L160 800 M214 700 L220 800', 42)}${limb('M160 800 L158 900 M220 800 L222 900', 28)}
<ellipse class="strap-skin" cx="152" cy="922" rx="17" ry="8"/><ellipse class="strap-skin" cx="228" cy="922" rx="17" ry="8"/>
${limb('M130 496 L108 598 M250 496 L272 598', 24)}${limb('M108 598 L95 700 M272 598 L285 700', 19)}
<ellipse class="strap-skin" cx="93" cy="716" rx="10" ry="15"/><ellipse class="strap-skin" cx="287" cy="716" rx="10" ry="15"/>
${limb('M190 448 V488', 20)}
<path class="strap-skin" d="M134 494 C148 482 168 476 190 476 C212 476 232 482 246 494 C256 520 248 548 240 572 C234 596 228 612 230 626 C234 652 252 670 254 700 C230 718 150 718 126 700 C128 670 146 652 150 626 C152 612 146 596 140 572 C132 548 124 520 134 494 Z"/>
${view === 'front' ? '<path class="strap-crease" d="M160 528 Q174 540 186 532 M194 532 Q206 540 220 528"/>' : '<path class="strap-crease" d="M190 500 V690 M160 520 Q176 530 172 548 M220 520 Q204 530 208 548"/>'}
${head}
</g>`;
}

// An aerial hoop (lyra) hanging from the ceiling on a spanset, with its tab and carabiner (2026-10-26: "they are aerial
// toys that hang from the ceiling"). `r`: its radius at her scale.
const lyra = (cx, cy, r) => `<g class="strap-lyra"><path class="strap-rig" d="M${cx} 50 V${cy - r - 18}"/><rect class="strap-carabiner" x="${cx - 4}" y="${cy - r - 22}" width="8" height="14" rx="4"/><path class="strap-tab" d="M${cx - 6} ${cy - r + 2} Q${cx} ${cy - r - 12} ${cx + 6} ${cy - r + 2}"/><circle class="strap-hoop" cx="${cx}" cy="${cy}" r="${r}"/><circle class="strap-hoop-shine" cx="${cx}" cy="${cy}" r="${r}"/></g>`;

function strapperDrawing() {
  // Every spot carries the four device drawings; the page shows the one for the device on it.
  const spot = (s) => `<g class="strap-spot" data-strap-dot="${esc(s.code)}" data-kind="" tabindex="0" role="button" aria-label="${esc(spotName(s))}: pick its device"><title>${esc(spotName(s))}</title>
<circle class="strap-halo" cx="${s.x}" cy="${s.y}" r="14"/><circle class="strap-empty" cx="${s.x}" cy="${s.y}" r="7"/>
${['tracker', 'index', 'headset', 'hand'].map((k) => `<use class="ico ico-${k}" href="#ico-${k}" x="${s.x - 12}" y="${s.y - 12}" width="24" height="24"/>`).join('')}
<circle class="strap-badge" cx="${s.x + 12}" cy="${s.y - 11}" r="7.5"/><text x="${s.x + 12}" y="${s.y - 8}" text-anchor="middle">${s.n}</text></g>`;
  const toy = (t) => `<g class="strap-toy"><g transform="translate(${t.x} ${t.y}) scale(${t.scale})">${t.svg}</g><text x="${t.label[0]}" y="${t.label[1]}" text-anchor="middle">${esc(t.name)}</text></g>`;
  return `<svg class="strap-drawing" viewBox="0 0 1080 900" role="img" aria-labelledby="strap-title"><title id="strap-title">Astra, 5′7″, from the front and from the back, with her 27 tracking spots; the aerial hoops hanging from the ceiling, her five toys and the dance pole beside her, to scale</title>
<defs>${DEVICE_SYMBOLS}<linearGradient id="strap-skin" x1="0" x2="1"><stop offset="0" stop-color="#7f8fb8"/><stop offset=".5" stop-color="#b9c6e6"/><stop offset="1" stop-color="#7f8fb8"/></linearGradient>
<linearGradient id="strap-chrome" x1="0" x2="1"><stop offset="0" stop-color="#6f7887"/><stop offset=".35" stop-color="#f1f4fa"/><stop offset=".6" stop-color="#9aa3b3"/><stop offset="1" stop-color="#596273"/></linearGradient>
<radialGradient id="strap-glow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient></defs>
${TOY_DEFS}
<path class="strap-ceiling" d="M470 50 H1070"/><path class="strap-floor" d="M8 862 H1072"/>
<ellipse cx="260" cy="560" rx="260" ry="330" fill="url(#strap-glow)"/>
${figure('front')}${figure('back')}
<text class="strap-view" x="140" y="890" text-anchor="middle">FRONT · facing you</text><text class="strap-view" x="380" y="890" text-anchor="middle">BACK · her right on your right</text>
${lyra(640, 410, 150)}${lyra(880, 402, 68)}
<g class="strap-pole"><rect x="1010" y="50" width="20" height="6" rx="2" fill="url(#strap-chrome)"/><rect x="1014" y="56" width="12" height="800" fill="url(#strap-chrome)"/><ellipse cx="1020" cy="858" rx="20" ry="5" fill="url(#strap-chrome)"/></g>
<g class="strap-prop-names"><text x="640" y="574" text-anchor="middle">Big Dance Hoop</text><text x="880" y="488" text-anchor="middle">Little Dance Hoop</text><text x="1020" y="890" text-anchor="middle">Dance Pole</text></g>
${TOYS.map(toy).join('\n')}
<text class="strap-toy-group" x="760" y="766" text-anchor="middle">Lovense</text>
<text class="strap-toy-note" x="680" y="690" text-anchor="middle">Toys don’t track</text>
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
  return `<div class="strap-pairs">${pair('hip', 'Double Hip pair (any two waist spots, 7–14)')}
${pair('chest', 'Double Chest pair (any two of 15–18, front or back)')}</div>`;
}

export function trackerStrapper(lights = () => '') {
  return `<div class="launch-headset strapper" data-strapper><div class="launch-head">${lights('tool:tracker-strapper', 'rift-rabbit-tracker-strapper')}<button type="button" class="launch-fold launch-name" aria-expanded="true">rift-rabbit-tracker-strapper</button></div>
<div class="strap-stage" data-strap-stage>${strapperDrawing()}
<div class="strap-pop" data-strap-pop hidden role="dialog" aria-label="Pick the device on this spot"><b data-strap-pop-name></b><button type="button" class="strap-pop-close" data-strap-pop-close aria-label="Close">×</button><select data-strap-pop-select></select><span class="small" data-strap-pop-note hidden>Change it on the page opened on your PC.</span></div></div>
${/* The key in a box, one row each, with her line under it; the devices on her beside it, one row each (Astra,
   2026-10-26: "can you make this a key in a box, stacked rows, instead, and put the 27 locations thing there too, also
   list the other actual list as stacked rows too, maybe next to it or below"). */ ''}<div class="strap-legend">
<div class="strap-box"><p class="strap-box-title">Key</p><ul class="small strap-key">${SPOT_STATES.map(([id, text]) => `<li data-state="${id}">${esc(text)}</li>`).join('')}</ul>
<p class="strap-footer">27 locations tracking can occur, devices may vary</p></div>
<div class="strap-box"><p class="strap-box-title">On her now</p><ul class="strap-worn" data-strap-worn></ul></div>
</div>
${strapperPairs()}
${strapperStore()}
<p class="small strap-said" data-strap-said>Change these on the page opened on your PC while Rift Rabbit’s launcher runs; here they show today’s spots.</p>
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
