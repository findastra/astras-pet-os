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
   together. that would be 3 options but 1 software"): a menu like the streamer's. */ ''}<label class="launch-switch" hidden>DoubleHip DoubleChest Tracker <select data-launch-switch="double-hip" data-auto>${DOUBLE.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
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
// she is drawn twice now, from the front and from the back, side by side, at 3 px a centimetre, as a natural outline.
// Each spot sits on the view it belongs to; the side and front-side spots on the front view, the back ones on the back
// view, where her right is on your right. The pole's tracker sits on its top plate, the X-Pole's neon-green dome,
// facing down (2026-10-26: "make sure to put the tracker on the top plate"); the hoops' trackers
// sit on the outside of the rings, facing out.
// `view`, `x`, `y`: the spot on that view's figure (drawn 190 wide-centre, 930 floor, then placed); `kind`: what may go
// on it; `down`: drawn upside down.
const SCALE = 3 / 3.2, FLOOR = 860, VIEW_X = { front: 140, back: 380 };
// Her legs are two inches longer than drawn (2026-10-26: "make the models legs like 2 inches longer"): everything above
// the hips rises 16 (5 cm), the legs stretch from there to the floor.
const LIFT = 16, HIPS = 722;
const lift = (y) => y <= HIPS ? y - LIFT : 930 - (930 - y) * (930 - HIPS + LIFT) / (930 - HIPS);
const place = (s) => s.view ? { ...s, x: Math.round(VIEW_X[s.view] + (s.x - 190) * SCALE), y: Math.round(FLOOR - (930 - lift(s.y)) * SCALE) } : s;
export const SPOTS = [
  { code: 'RF', n: 1, name: 'Right Foot', view: 'front', x: 160, y: 922 }, { code: 'LF', n: 2, name: 'Left Foot', view: 'front', x: 220, y: 922 },
  { code: 'RA', n: 3, name: 'Right Ankle', view: 'front', x: 166, y: 892 }, { code: 'LA', n: 4, name: 'Left Ankle', view: 'front', x: 214, y: 892 },
  { code: 'RK', n: 5, name: 'Right Knee', view: 'front', x: 166, y: 800 }, { code: 'LK', n: 6, name: 'Left Knee', view: 'front', x: 214, y: 800 },
  { code: 'FW', n: 7, name: 'Front Waist', view: 'front', x: 190, y: 640 }, { code: 'BW', n: 8, name: 'Back Waist', view: 'back', x: 190, y: 640 },
  { code: 'RS', n: 9, name: 'Right Side', view: 'front', x: 138, y: 628 }, { code: 'LS', n: 10, name: 'Left Side', view: 'front', x: 242, y: 628 },
  { code: 'RFS', n: 11, name: 'Right Front-Side', view: 'front', x: 164, y: 642 }, { code: 'LFS', n: 12, name: 'Left Front-Side', view: 'front', x: 216, y: 642 },
  { code: 'RBS', n: 13, name: 'Right Back-Side', view: 'back', x: 216, y: 642 }, { code: 'LBS', n: 14, name: 'Left Back-Side', view: 'back', x: 164, y: 642 },
  { code: 'FD', n: 15, name: 'Front Diaphragm', view: 'front', x: 190, y: 594 }, { code: 'BD', n: 16, name: 'Back Diaphragm', view: 'back', x: 190, y: 594 },
  { code: 'FS', n: 17, name: 'Front Sternum', view: 'front', x: 190, y: 546 }, { code: 'BS', n: 18, name: 'Back Sternum', view: 'back', x: 190, y: 546 },
  { code: 'RE', n: 19, name: 'Right Elbow', view: 'front', x: 112, y: 600 }, { code: 'LE', n: 20, name: 'Left Elbow', view: 'front', x: 268, y: 600 },
  { code: 'RH', n: 21, name: 'Right Hand', view: 'front', x: 93, y: 724, kind: 'right-hand' }, { code: 'LH', n: 22, name: 'Left Hand', view: 'front', x: 287, y: 724, kind: 'left-hand' },
  { code: 'F', n: 23, name: 'Face', view: 'front', x: 190, y: 418, kind: 'headset' }, { code: 'H', n: 24, name: 'Head', view: 'back', x: 190, y: 372 },
  { code: 'DP', n: 25, name: 'Dance Pole', x: 984, y: 100, object: 'dance-pole', down: true },
  { code: 'BDH', n: 26, name: 'Big Dance Hoop', x: 770, y: 410, object: 'large-hoop' },
  { code: 'LDH', n: 27, name: 'Little Dance Hoop', x: 938, y: 328, object: 'small-hoop' },
].map(place);

// Double Hip's pair is any two of the eight waist spots, usually Front and Back Waist (Astra, 2026-10-25: "the double hip
// can be made from any of the 8 on the waist, but typical is FW, BW"); Double Chest's any two of the four chest and
// sternum spots, front with back crossed too (2026-10-26: "the front chest and back sternum can be combined for a
// doublechest, and front sternum back chest"). When exactly two spots of a group have trackers, they are the pair.
export const PAIR_SPOTS = { hip: ['FW', 'BW', 'RS', 'LS', 'RFS', 'LFS', 'RBS', 'LBS'], chest: ['FD', 'BD', 'FS', 'BS'] };

// Her devices, by the launcher's ids (findastra/rift-rabbit, its device table): [id, name in the picker, short name in
// the list]. Trackers by their number, sticker and serial ("HTC Vive 3.0 #1: (serial #)").
export const DEVICES = {
  headset: [['quest-pro', 'Meta Quest Pro', 'Quest Pro'], ['quest-3', 'Meta Quest 3', 'Quest 3']],
  'right-hand': [['index-controller-right', 'Valve Index Knuckles (right)', 'Index Knuckles'], ['quest-pro-controller-right', 'Meta Quest Touch Pro controller (right)', 'Quest Pro controller'], ['quest-3-controller-right', 'Meta Quest Touch Plus controller (right)', 'Quest 3 controller'], ['hand-tracking', 'The headset’s hand tracking', 'Hand tracking']],
  'left-hand': [['index-controller-left', 'Valve Index Knuckles (left)', 'Index Knuckles'], ['quest-pro-controller-left', 'Meta Quest Touch Pro controller (left)', 'Quest Pro controller'], ['quest-3-controller-left', 'Meta Quest Touch Plus controller (left)', 'Quest 3 controller'], ['hand-tracking', 'The headset’s hand tracking', 'Hand tracking']],
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
  F: 'quest-pro', H: 'vive-tracker-08', FS: 'vive-tracker-05', BS: 'vive-tracker-03', FW: 'vive-tracker-09', BW: 'vive-tracker-04',
  RK: 'vive-tracker-06', LK: 'vive-tracker-02', RF: 'vive-tracker-01', LF: 'vive-tracker-07', RH: 'index-controller-right', LH: 'index-controller-left',
};
export const PAIRS = { hip: ['FW', 'BW'], chest: ['FS', 'BS'] };

// What a spot's colour says (the key she kept from the first drawing).
export const SPOT_STATES = [
  ['used', 'VRChat tracks it'],
  ['joined', 'Joined into one by DoubleHip DoubleChest Tracker, set for you from your spots (VRChat ignores it)'],
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
  { name: 'Woojer Vest 3', x: 610, y: 707, w: 145, scale: 1.25, label: [682, 884], svg: `<path d="M40 8 L30 0 M76 8 L86 0" stroke="#1d1d22" stroke-width="5" stroke-linecap="round"/>
<path d="M38 6 Q58 -1 78 6 L74 16 Q58 10 42 16 Z" fill="#2e2e35"/><rect x="50" y="0" width="16" height="6" rx="3" fill="none" stroke="#6a6a74" stroke-width="1.6"/>
<path d="M38 6 Q20 6 11 22 Q3 40 9 58 Q20 68 36 60 L46 44 L46 14 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/><path d="M78 6 Q96 6 105 22 Q113 40 107 58 Q96 68 80 60 L70 44 L70 14 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/>
${stitch('M38 10 Q22 11 14 24 Q7 40 12 55 Q21 63 34 57')}${stitch('M78 10 Q94 11 102 24 Q109 40 104 55 Q95 63 82 57')}
<path d="M44 36 L72 36 L70 94 L46 94 Z" fill="url(#toy-mesh)" stroke="#1d1d22" stroke-width="1"/>
<rect x="36" y="52" width="44" height="4" rx="1.5" fill="#18181d"/><rect x="53" y="49.5" width="10" height="9" rx="2" fill="#4a4a52" stroke="#7a7a84" stroke-width=".6"/>
<path d="M46 78 Q24 72 8 84 Q0 97 6 112 Q20 123 46 112 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/><path d="M70 78 Q92 72 108 84 Q116 97 110 112 Q96 123 70 112 Z" fill="url(#toy-vest)" stroke="#121216" stroke-width="1"/>
${stitch('M44 82 Q26 78 12 87 Q5 98 10 109 Q22 117 44 109')}${stitch('M72 82 Q90 78 104 87 Q111 98 106 109 Q94 117 72 109')}
<rect x="43" y="88" width="30" height="22" rx="4" fill="#202026"/><circle cx="58" cy="99" r="7" fill="#3b3b43" stroke="#8a8a94" stroke-width="1.2"/><circle cx="58" cy="99" r="3.2" fill="none" stroke="#b0b0ba" stroke-width="1"/><circle cx="58" cy="99" r="1.2" fill="#d0d0d8"/>
${pod(26, 33, 11)}${pod(90, 33, 11)}${pod(21, 99, 11)}${pod(95, 99, 11)}
<rect x="84" y="43" width="11" height="15" rx="2" fill="#0f0f13" stroke="#4a4a52" stroke-width=".8"/><circle cx="89.5" cy="48" r="2.4" fill="none" stroke="#7fd3ff" stroke-width=".8"/><rect x="86.5" y="52.5" width="6" height="1.2" fill="#7fd3ff" opacity=".7"/>
<path d="M49 60 V70 M67 60 V70 M47 112 V119 M69 112 V119" stroke="#c4313c" stroke-width="2.2" stroke-linecap="round"/>
<text x="18" y="50" font-size="5.5" fill="#9a9aa4" font-style="italic" transform="rotate(-20 18 50)">woojer</text>` },
  { name: 'Nora', x: 772, y: 787, w: 18, scale: 0.625, label: [786, 884], svg: `<path d="M27 74 C36 72 43 64 44 52 C44 44 39 42 36 47 C35 58 32 63 27 64 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M8 110 Q8 118 18 118 Q28 118 28 110 L28 84 C28 60 28 42 30 26 C32 12 30 2 22 2 C16 2 12 10 10 22 C6 40 8 60 8 84 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M11 18 Q20 22 30 18 M10 24 Q20 28 30 24" fill="none" stroke="#c2185b" stroke-width=".8" opacity=".7"/>
<rect x="8" y="81" width="20" height="4.5" rx="1" fill="url(#toy-silver)"/><circle cx="18" cy="94" r="2.6" fill="#fbd3e2"/><path d="M16.8 94 h2.4 M18 92.8 v2.4" stroke="#c2185b" stroke-width=".7"/><circle cx="18" cy="102" r="2.6" fill="#fbd3e2"/><path d="M16.8 102 h2.4" stroke="#c2185b" stroke-width=".7"/>
${shine(13, 34, 2.2, 16)}${shine(12.5, 100, 1.6, 9)}${shine(38, 54, 1.2, 5)}` },
  { name: 'Domi 2', x: 812, y: 791, w: 19, scale: 0.625, label: [821, 904], svg: `<path d="M8 36 Q15 33 22 36 L21 104 Q15 112 9 104 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/>
<path d="M9 25 Q15 30 21 25 L20 36 Q15 38 10 36 Z" fill="url(#toy-silver)"/><path d="M8.5 37.5 Q15 40 21.5 37.5" fill="none" stroke="#ff9ac2" stroke-width="1.6" opacity=".9"/>
<ellipse cx="15" cy="14" rx="14.5" ry="13" fill="url(#toy-head)" stroke="#c98aa6" stroke-width=".6"/>
<circle cx="15" cy="52" r="2.6" fill="#fbd3e2"/><circle cx="15" cy="60" r="2.6" fill="#fbd3e2"/><rect x="13.2" y="66" width="3.6" height="8" rx="1.8" fill="#fbd3e2"/>
${shine(9, 9, 3.6, 4.6)}${shine(11, 72, 1.6, 24)}` },
  { name: 'Lush 3', x: 846, y: 806, w: 14, scale: 0.625, label: [860, 884], svg: `<path d="M12 50 C12 30 22 14 38 8" fill="none" stroke="#8e0f3c" stroke-width="7" stroke-linecap="round"/><path d="M12 50 C12 30 22 14 38 8" fill="none" stroke="url(#toy-pink-line)" stroke-width="5.4" stroke-linecap="round"/><ellipse cx="39.5" cy="7.5" rx="5" ry="3.6" fill="#e8508f" stroke="#8e0f3c" stroke-width=".7" transform="rotate(-20 39.5 7.5)"/>
<ellipse cx="12" cy="66" rx="10.5" ry="19" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".8"/><path d="M4 74 Q12 80 20 74" fill="none" stroke="#c2185b" stroke-width=".8" opacity=".6"/>${shine(8, 60, 2.4, 9)}` },
  { name: 'Vulse', x: 884, y: 797, w: 15, scale: 0.625, label: [899, 904], svg: `<path d="M12 62 C12 38 26 18 44 10" fill="none" stroke="#9e1622" stroke-width="8.5" stroke-linecap="round"/><path d="M12 62 C12 38 26 18 44 10" fill="none" stroke="url(#toy-coral-line)" stroke-width="7" stroke-linecap="round"/><ellipse cx="45.5" cy="9.5" rx="5.6" ry="4.4" fill="#ff5a68" stroke="#9e1622" stroke-width=".7" transform="rotate(-25 45.5 9.5)"/>
<rect x="3.5" y="58" width="17" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="3" y="64" width="18" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="2.5" y="70" width="19" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/><rect x="2.5" y="76" width="19" height="6" rx="3" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".6"/>
<ellipse cx="12" cy="89" rx="10" ry="12.5" fill="url(#toy-coral)" stroke="#9e1622" stroke-width=".8"/>${shine(8, 86, 2.2, 6)}` },
];
const TOY_DEFS = `<defs>
<linearGradient id="toy-pink" x1="0" x2="1"><stop offset="0" stop-color="#7d0a33"/><stop offset=".22" stop-color="#d6346f"/><stop offset=".4" stop-color="#ff8fbd"/><stop offset=".58" stop-color="#e44a86"/><stop offset="1" stop-color="#8e0f3c"/></linearGradient>
<linearGradient id="toy-pink-line" x1="0" x2="1"><stop offset="0" stop-color="#c81c5c"/><stop offset="1" stop-color="#f06a9e"/></linearGradient>
<linearGradient id="toy-coral" x1="0" x2="1"><stop offset="0" stop-color="#7a0d17"/><stop offset=".25" stop-color="#e0303f"/><stop offset=".42" stop-color="#ff9aa2"/><stop offset=".6" stop-color="#f04452"/><stop offset="1" stop-color="#8a121e"/></linearGradient>
<linearGradient id="toy-coral-line" x1="0" x2="1"><stop offset="0" stop-color="#d22636"/><stop offset="1" stop-color="#ff7480"/></linearGradient>
<linearGradient id="toy-silver" x1="0" x2="1"><stop offset="0" stop-color="#8d8d96"/><stop offset=".5" stop-color="#e6e6ec"/><stop offset="1" stop-color="#8d8d96"/></linearGradient>
<radialGradient id="toy-head" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f6d3e1"/><stop offset="1" stop-color="#d79ab4"/></radialGradient>
<linearGradient id="toy-vest" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#4a4a55"/><stop offset=".35" stop-color="#2b2b33"/><stop offset="1" stop-color="#141418"/></linearGradient>
<pattern id="toy-mesh" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#2a2a31"/><circle cx="1.5" cy="1.5" r=".7" fill="#3d3d46"/></pattern>
<radialGradient id="toy-pod" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4a54"/><stop offset="1" stop-color="#141418"/></radialGradient>
</defs>`;

// What each device looks like on its spot (Astra, 2026-10-26: "Lets make the tracker spots actually look like HTC Vive
// 3.0, and Index Controller, etc. depending on selection", then "You need the index controllers, Qpro controllers, q3
// controllers, too"): a Vive Tracker 3.0 is a rounded three-lobed puck with its round centre and light; an Index
// controller its handle and ring; a Touch Pro controller a ringless grip with its cameras; a Touch Plus a ringless grip;
// a Quest Pro a slim visor; a Quest 3 a deeper front with its three sensor slots; hand tracking an open hand. An empty
// spot is a dashed ring. The spot's number rides on a badge at its corner, its colour halo says what it does.
const DEVICE_SYMBOLS = `<symbol id="ico-tracker" viewBox="-12 -12 24 24"><path d="M0 -10.5 C3.5 -10.5 7 -5 9.6 0.5 C11.6 4.8 9.8 9 5.6 9.4 C2 9.8 -2 9.8 -5.6 9.4 C-9.8 9 -11.6 4.8 -9.6 0.5 C-7 -5 -3.5 -10.5 0 -10.5 Z" fill="#3b3d48" stroke="#dfe5f2" stroke-width="1.2"/><circle r="5.2" fill="#1a1a1f" stroke="#55555f" stroke-width="1"/><circle r="2.6" fill="#33333b"/><circle cy="-7.2" r="1.1" fill="#6cc7e8"/></symbol>
<symbol id="ico-index" viewBox="-12 -12 24 24"><path d="M-2.6 -2 L-2.8 10 Q0 12 2.8 10 L2.6 -2 Z" fill="#3b3d48" stroke="#dfe5f2" stroke-width="1.2"/><ellipse cy="-6" rx="7" ry="5.4" fill="#2e3039" stroke="#dfe5f2" stroke-width="1.2"/><ellipse cy="-6" rx="3.6" ry="2.6" fill="#33333b"/><path d="M-7 -3 Q-10.5 4 -3 8" fill="none" stroke="#dfe5f2" stroke-width="1.6"/></symbol>
<symbol id="ico-qpro-ctrl" viewBox="-12 -12 24 24"><path d="M-4 -9 Q0 -11.5 4.5 -9 L4.5 -2 Q4 6 2.6 10.5 Q0 11.8 -2.6 10.5 Q-4 6 -4.5 -2 Z" fill="#33353f" stroke="#dfe5f2" stroke-width="1.2"/><circle cx="-1.6" cy="-6.6" r="1" fill="#55555f"/><circle cx="1.8" cy="-6.6" r="1" fill="#55555f"/><circle cy="-3" r="1.9" fill="#2e2e36" stroke="#6a6a74" stroke-width=".6"/></symbol>
<symbol id="ico-q3-ctrl" viewBox="-12 -12 24 24"><path d="M-5 -8 Q0 -11 5 -8 Q6.5 -4 4 -1 Q3.5 6 2.4 10 Q0 11.4 -2.4 10 Q-3.5 6 -4 -1 Q-6.5 -4 -5 -8 Z" fill="#ececf0" stroke="#7a7a86" stroke-width="1"/><circle cy="-5" r="2" fill="#c9c9d2"/><circle cx="3" cy="-6.6" r=".9" fill="#9a9aa6"/></symbol>
<symbol id="ico-qpro" viewBox="-12 -12 24 24"><path d="M-11 -4 Q0 -8.5 11 -4 L10 3.5 Q0 6 -10 3.5 Z" fill="#1b1b20" stroke="#8a8a96" stroke-width="1"/><path d="M-8 -2.5 Q0 -5 8 -2.5" fill="none" stroke="#5a5a66" stroke-width="1"/><ellipse cx="-4.5" cy=".6" rx="3" ry="1.5" fill="#3a3a46"/><ellipse cx="4.5" cy=".6" rx="3" ry="1.5" fill="#3a3a46"/></symbol>
<symbol id="ico-q3" viewBox="-12 -12 24 24"><path d="M-11 -6 Q0 -9 11 -6 L11 5 Q0 8 -11 5 Z" fill="#ececf0" stroke="#7a7a86" stroke-width="1"/><rect x="-8" y="-2" width="3.4" height="5.6" rx="1.7" fill="#2a2a32"/><rect x="-1.7" y="-2" width="3.4" height="5.6" rx="1.7" fill="#2a2a32"/><rect x="4.6" y="-2" width="3.4" height="5.6" rx="1.7" fill="#2a2a32"/></symbol>
<symbol id="ico-hand" viewBox="-12 -12 24 24"><path d="M-5 10 L-6 0 L-8.5 -4 M-6 0 L-4 -9 M-2 -1 L-1 -10.5 M1 -1 L2.5 -9.5 M3.5 0 L5.6 -6.5 M-5 10 Q2 12 4.5 6 L6 -1" fill="none" stroke="#d9d2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>`;
export const SPOT_KINDS = ['tracker', 'index', 'qpro-ctrl', 'q3-ctrl', 'qpro', 'q3', 'hand'];
const KIND_SIZE = { tracker: 23, index: 46, 'qpro-ctrl': 34, 'q3-ctrl': 34, qpro: 0, q3: 0, hand: 46 };

const spotName = (s) => `${s.n} ${s.name} [${s.code}]`;

// A smooth closed outline through points (Catmull-Rom as cubic curves).
function smooth(points) {
  const n = points.length, p = (i) => points[(i + n) % n];
  let d = `M${p(0)[0]} ${p(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${c[0]} ${c[1]}`;
  }
  return d + ' Z';
}

// Her body as one natural outline (2026-10-26: "body still looks weird, just make it a natural female body outline"):
// her right half from the neck, down the arm and round the hand, up to the armpit, down the bust, waist, hip and leg to
// the foot, and up the inner leg; the left half is its mirror. Drawn 190 wide-centre, 930 floor.
const HALF = [[179, 450], [177, 474], [160, 484], [140, 491], [128, 502], [120, 540], [106, 598], [95, 662], [89, 700],
  [84, 716], [86, 734], [94, 742], [101, 730], [101, 710], [106, 680], [116, 630], [124, 590], [133, 548], [140, 536],
  [141, 556], [148, 574], [154, 612], [146, 646], [138, 682], [139, 726], [146, 772], [150, 804], [149, 846], [156, 900],
  [149, 918], [146, 928], [170, 930], [176, 920], [177, 900], [180, 850], [182, 806], [185, 760], [189, 722]];
const BODY = smooth([...HALF, ...HALF.slice().reverse().map(([x, y]) => [380 - x, y])].map(([x, y]) => [x, Math.round(lift(y) * 10) / 10]));

// Her hair, black like a galaxy, up in a bun over her head (2026-10-26: "show the hair as black and galaxy like, its in
// a bun over the head"). A few stars twinkle in it.
const STARS = (pts) => pts.map(([x, y, r]) => `<circle class="strap-star" cx="${x}" cy="${y}" r="${r}"/>`).join('');
const HAIR_FRONT = `<path class="strap-hair" d="M166 412 C164 384 216 384 214 412 C206 398 174 398 166 412 Z"/>`;
const HAIR_BACK = `<path class="strap-hair" d="M165 418 C160 380 220 380 215 418 C214 440 204 452 190 454 C176 452 166 440 165 418 Z"/>`;
const BUN = `<ellipse class="strap-hair" cx="190" cy="378" rx="19" ry="15"/><path class="strap-hair-tie" d="M176 388 Q190 394 204 388"/>${STARS([[184, 372, 1.3], [197, 381, .9], [190, 368, .8], [176, 384, .7], [205, 375, .8]])}`;

// The headset on her face, Quest Pro or Quest 3 as 23 Face says ("make the Quest Pro or Quest 3 cutouts"): the page
// shows the one that is on.
// The headsets at their real size on her face (Meta's cut sheets: Quest Pro 196 mm wide; Quest 3 about 184 mm), 3.2 to a
// centimetre in her drawing.
const HEADSETS_FRONT = `<g class="strap-hs strap-hs-quest-pro"><path class="strap-band" d="M160 410 C150 396 156 374 178 368 C200 364 222 370 228 386 C231 394 228 404 222 410"/>
<path class="strap-headset" d="M159 406 Q190 398 221 406 L220 422 Q219 430 210 430 Q190 433 170 430 Q161 430 160 422 Z"/><path d="M164 409 Q190 402 216 409" fill="none" stroke="#8a8a98" stroke-width="1.2"/><circle cx="166" cy="417" r="1.8" fill="#5a5a66"/><circle cx="214" cy="417" r="1.8" fill="#5a5a66"/></g>
<g class="strap-hs strap-hs-quest-3"><path class="strap-band-soft" d="M161 410 C152 398 157 380 176 374 M219 410 C228 398 223 380 204 374 M176 374 Q190 366 204 374"/>
<path class="strap-headset-q3" d="M160.5 402 Q190 395 219.5 402 L219.5 428 Q219.5 434 212 434 Q190 437 168 434 Q160.5 434 160.5 428 Z"/><rect x="167" y="410" width="9" height="17" rx="4.5" fill="#24242c"/><rect x="185.5" y="410" width="9" height="17" rx="4.5" fill="#24242c"/><rect x="204" y="410" width="9" height="17" rx="4.5" fill="#24242c"/></g>`;
const HEADSETS_BACK = `<g class="strap-hs strap-hs-quest-pro"><path class="strap-headset" d="M166 392 Q190 386 214 392 L212 408 Q190 413 168 408 Z"/><path d="M171 398 Q190 393 209 398" fill="none" stroke="#8a8a98" stroke-width="1.2"/></g>
<g class="strap-hs strap-hs-quest-3"><path class="strap-band-soft" d="M162 404 Q190 396 218 404"/><rect class="strap-headset-q3" x="176" y="398" width="28" height="13" rx="5"/></g>`;

function figure(view) {
  const front = view === 'front';
  return `<g class="strap-figure strap-${view}" transform="translate(${VIEW_X[view] - 190 * SCALE} ${FLOOR - 930 * SCALE}) scale(${SCALE})">
<ellipse class="strap-shadow" cx="190" cy="930" rx="62" ry="6"/>
<path class="strap-skin" d="${BODY}"/>
<g transform="translate(0 -${LIFT})"><ellipse class="strap-skin" cx="190" cy="420" rx="24" ry="31"/>
${front ? '<path class="strap-crease" d="M160 552 Q172 566 186 558 M194 558 Q208 566 220 552 M190 626 v2"/>' : '<path class="strap-crease" d="M190 492 V700 M160 520 Q172 532 168 552 M220 520 Q208 532 212 552"/>'}
${front ? HAIR_FRONT : HAIR_BACK}${BUN}
${front ? HEADSETS_FRONT : HEADSETS_BACK}</g>
</g>`;
}

// The aerial hoops (lyra) hang from the ceiling at the same height, each on a black rope wrapped round the top of the
// plain ring (2026-10-26: "hoops are suspended at the same height, and both by black ropes that go around the plain
// hoop"; "dance hoops are also black and sparkly like a rainbow galaxy").
// Her hoops as they are (her photos, 2026-10-26): black glossy tube covered in fine holographic rainbow glitter, hung
// from the ceiling on a black spanset through a black figure-8 ring, both at the same height.
const RAINBOW = ['#ff4fa3', '#ff9a3c', '#ffe14a', '#4dff8f', '#4dc3ff', '#9a6bff'];
const lyra = (cx, cy, r) => {
  // Glitter: tiny dots at an even step round the ring, the rainbow in order, in three lanes across the tube.
  const step = 1.1, n = Math.round((2 * Math.PI * r) / step);
  const glitter = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, lane = [-3.2, -1, 1.2, 3.3][i % 4], rr = r + lane;
    return `<circle cx="${(cx + rr * Math.cos(a)).toFixed(1)}" cy="${(cy + rr * Math.sin(a)).toFixed(1)}" r=".85" fill="${RAINBOW[Math.floor(i / 4) % 6]}"/>`;
  }).join('');
  const top = cy - r;
  return `<g class="strap-lyra"><path class="strap-rope" d="M${cx} 50 V${top - 30}"/><circle class="strap-fig8" cx="${cx}" cy="${top - 24}" r="5"/><circle class="strap-fig8" cx="${cx}" cy="${top - 14}" r="6.5"/><path class="strap-rope" d="M${cx} ${top - 8} V${top}"/>
<circle class="strap-hoop" cx="${cx}" cy="${cy}" r="${r}"/><g>${glitter}</g><path class="strap-hoop-gloss" d="M${(cx - r * 0.7).toFixed(1)} ${(cy - r * 0.7).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r * 0.2).toFixed(1)} ${(cy - r * 0.98).toFixed(1)}"/></g>`;
};

function strapperDrawing() {
  // Every spot carries each device's drawing; the page shows the one for the device on it.
  const spot = (s) => `<g class="strap-spot" data-strap-dot="${esc(s.code)}" data-kind="" tabindex="0" role="button" aria-label="${esc(spotName(s))}: pick its device"><title>${esc(spotName(s))}</title>
<circle class="strap-halo" cx="${s.x}" cy="${s.y}" r="18"/><circle class="strap-empty" cx="${s.x}" cy="${s.y}" r="8"/>
${SPOT_KINDS.filter((k) => KIND_SIZE[k]).map((k) => `<use class="ico ico-${k}" href="#ico-${k}" x="${s.x - KIND_SIZE[k] / 2}" y="${s.y - KIND_SIZE[k] / 2}" width="${KIND_SIZE[k]}" height="${KIND_SIZE[k]}"${s.down ? ` transform="rotate(180 ${s.x} ${s.y})"` : ''}/>`).join('')}
<circle class="strap-badge" cx="${s.x + 15}" cy="${s.y - 14}" r="8"/><text x="${s.x + 15}" y="${s.y - 10.5}" text-anchor="middle">${s.n}</text></g>`;
  // Each toy stands on the floor with a soft shadow under it.
  const toy = (t) => `<g class="strap-toy"><ellipse class="strap-toy-shadow" cx="${t.x + t.w / 2}" cy="861" rx="${t.w / 2 + 4}" ry="3.5"/><g transform="translate(${t.x} ${t.y}) scale(${t.scale})">${t.svg}</g><text x="${t.label[0]}" y="${t.label[1]}" text-anchor="middle">${esc(t.name)}</text></g>`;
  return `<svg class="strap-drawing" data-headset="quest-pro" viewBox="0 0 1110 916" role="img" aria-labelledby="strap-title"><title id="strap-title">Astra, 5′7″, from the front and from the back, with her 27 tracking spots; the aerial hoops hanging from the ceiling, her five toys and the dance pole beside her, to scale</title>
<defs>${DEVICE_SYMBOLS}<linearGradient id="strap-skin" x1="0" x2="1"><stop offset="0" stop-color="#7f8fb8"/><stop offset=".5" stop-color="#b9c6e6"/><stop offset="1" stop-color="#7f8fb8"/></linearGradient>
<radialGradient id="strap-galaxy" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".45" stop-color="#160f2c"/><stop offset="1" stop-color="#050409"/></radialGradient>
<linearGradient id="strap-hoop" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#1a1030"/><stop offset=".25" stop-color="#2a0f3a"/><stop offset=".5" stop-color="#0b1a33"/><stop offset=".75" stop-color="#14261c"/><stop offset="1" stop-color="#1a1030"/></linearGradient>
<linearGradient id="strap-pole" x1="0" x2="1"><stop offset="0" stop-color="#050506"/><stop offset=".4" stop-color="#3a3a42"/><stop offset=".55" stop-color="#121216"/><stop offset="1" stop-color="#050506"/></linearGradient>
<linearGradient id="strap-chrome-x" x1="0" x2="1"><stop offset="0" stop-color="#6f7887"/><stop offset=".4" stop-color="#f1f4fa"/><stop offset="1" stop-color="#596273"/></linearGradient>
<radialGradient id="strap-dome" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#d8ffb0"/><stop offset=".5" stop-color="#5dff3a"/><stop offset="1" stop-color="#1e9a10"/></radialGradient>
<radialGradient id="strap-glow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient></defs>
${TOY_DEFS}
<path class="strap-ceiling" d="M470 50 H1100"/><path class="strap-floor" d="M8 862 H1102"/>
<ellipse cx="260" cy="560" rx="260" ry="330" fill="url(#strap-glow)"/>
${figure('front')}${figure('back')}
<text class="strap-view" x="140" y="284" text-anchor="middle">FRONT SIDE</text><text class="strap-view" x="380" y="284" text-anchor="middle">BACK SIDE</text>
${lyra(620, 410, 150)}${lyra(870, 328, 68)}
<g class="strap-pole">${/* The X-Pole as it stands (2026-10-26: "make the x pole geometry real life accurate"): a 45 mm black pole from a
  neon-green ceiling dome about a foot across to a neon-green floor dome, with its silver base collar just above the floor. */ ''}<path d="M974 52 Q974 98 1020 100 Q1066 98 1066 52 Z" fill="url(#strap-dome)" class="strap-dome"/><text class="strap-prop-names" x="1020" y="78" text-anchor="middle" style="fill:#0b2a06;font-weight:600">X-POLE</text>
<rect x="1013" y="98" width="14" height="732" fill="url(#strap-pole)"/><rect x="1011" y="804" width="18" height="18" rx="2" fill="url(#strap-chrome-x)"/><rect x="1012" y="822" width="16" height="10" fill="#b8bec9"/>
<path d="M990 862 Q990 832 1020 830 Q1050 832 1050 862 Z" fill="url(#strap-dome)" class="strap-dome"/></g>
<text class="strap-prop-names" x="962" y="106" text-anchor="end">faces down</text>
<g class="strap-prop-names"><text x="620" y="574" text-anchor="middle">Big Dance Hoop</text><text x="870" y="414" text-anchor="middle">Little Dance Hoop</text><text x="1020" y="890" text-anchor="middle">Dance Pole</text></g>
${TOYS.map(toy).join('\n')}
<text class="strap-toy-group" x="858" y="772" text-anchor="middle">Lovense</text>
<text class="strap-toy-note" x="770" y="690" text-anchor="middle">Toys don’t track</text>
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

export function trackerStrapper(lights = () => '') {
  return `<div class="launch-headset strapper" data-strapper><div class="launch-head">${lights('tool:tracker-strapper', 'rift-rabbit-tracker-strapper')}<button type="button" class="launch-fold launch-name" aria-expanded="true">rift-rabbit-tracker-strapper</button></div>
<div class="strap-stage" data-strap-stage>${strapperDrawing()}
<div class="strap-pop" data-strap-pop hidden role="dialog" aria-label="Pick the device on this spot"><b data-strap-pop-name></b><button type="button" class="strap-pop-close" data-strap-pop-close aria-label="Close">×</button><select data-strap-pop-select></select><span class="small" data-strap-pop-note hidden>Change it on the page opened on your PC.</span></div></div>
${/* The key in a box, one row each (2026-10-26: "make this a key in a box, stacked rows"; then "get rid of 'all 27
   positions' and the other 27 possible locations thing, I dont want to have to mess with double hip"). */ ''}<div class="strap-legend">
<div class="strap-box"><p class="strap-box-title">Key</p><ul class="small strap-key">${SPOT_STATES.map(([id, text]) => `<li data-state="${id}">${esc(text)}</li>`).join('')}</ul>
<p class="small strap-said" data-strap-said>Change these on the page opened on your PC while Rift Rabbit’s launcher runs; here they show today’s spots.</p></div>
</div>
${strapperStore()}
</div>`;
}

// The dongle map (Astra, 2026-10-26: "make a tool for us to run it and show a branch where each dongle is? There are so
// many ways to plug them in, we want to optimize it"): Rift Rabbit's launcher runs USBDeview and walks Windows' device
// tree; the page draws each USB controller as a branch, its hubs under it, and every dongle where it is plugged in.
export function dongleMap(lights = () => '') {
  return `<div class="launch-headset dongle-map" data-dongle-map><div class="launch-head">${lights('tool:dongle-map', 'rift-rabbit-dongle-map')}<button type="button" class="launch-fold launch-name" aria-expanded="true">rift-rabbit-dongle-map</button></div>
<p class="small dongle-about">Which USB controller and hub each Watchman dongle and Valve VR Radio is on, read by USBDeview. Dongles crowded on one controller or behind many hubs are the ones to spread out.</p>
<p class="dongle-run"><button type="button" class="button off" disabled data-dongle-scan>Scan USB</button> <span class="small" data-dongle-said>Works on the page opened on your PC while Rift Rabbit’s launcher runs.</span></p>
<div class="dongle-tree" data-dongle-tree></div>
</div>`;
}

// Each headset box is a tool, so its name sits inside its round border on the first row, with its paired lights left
// of it like every tool's (Astra, 2026-10-24: "title needs to be down inside and with indicator light buttons, its a
// tool"). `lights(key, name)` is the page spawner's. tracker-strapper comes first: the launches below follow it.
export function vrchatLaunchBody(lights = () => '') {
  return trackerStrapper(lights) + '\n' + dongleMap(lights) + '\n' + HEADSETS.map((h) => `<div class="launch-headset" data-launch-headset="${esc(h.id)}"><div class="launch-head">${lights(`tool:vrchat-launch-${h.id}`, `${h.n}. ${h.name}`)}<button type="button" class="launch-fold launch-name" aria-expanded="true">${esc(h.n)}. ${esc(h.name)}</button></div>
${switchRow(h)}
<div class="launch-modes">${MODES.map((m, i) => modeCard(h, m, i)).join('\n')}</div>
</div>`).join('\n');
}
