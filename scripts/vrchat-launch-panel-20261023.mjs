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

// tracker-strapper (Astra, 2026-10-25): her drawing of the 29 spots where tracking can happen, and which device is on
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
// The waist spots sit on her hip bones, the sternum spots high on her chest and between her shoulder blades (2026-10-26).
// Her legs are two inches longer than drawn (2026-10-26: "make the models legs like 2 inches longer"): everything above
// the hips rises 16 (5 cm), the legs stretch from there to the floor.
const LIFT = 16, HIPS = 722;
const lift = (y) => y <= HIPS ? y - LIFT : 930 - (930 - y) * (930 - HIPS + LIFT) / (930 - HIPS);
const place = (s) => s.view ? { ...s, x: Math.round(VIEW_X[s.view] + (s.x - 190) * SCALE), y: Math.round(FLOOR - (930 - lift(s.y)) * SCALE) } : s;
export const SPOTS = [
  { code: 'RF', n: 1, name: 'Right Foot', view: 'front', x: 160, y: 922 }, { code: 'LF', n: 2, name: 'Left Foot', view: 'front', x: 220, y: 922 },
  { code: 'RA', n: 3, name: 'Right Ankle', view: 'front', x: 166, y: 892 }, { code: 'LA', n: 4, name: 'Left Ankle', view: 'front', x: 214, y: 892 },
  { code: 'RK', n: 5, name: 'Right Knee', view: 'front', x: 166, y: 800 }, { code: 'LK', n: 6, name: 'Left Knee', view: 'front', x: 214, y: 800 },
  { code: 'FW', n: 7, name: 'Front Waist', view: 'front', x: 190, y: 670 }, { code: 'BW', n: 8, name: 'Back Waist', view: 'back', x: 190, y: 670 },
  { code: 'RS', n: 9, name: 'Right Side', view: 'front', x: 139, y: 666 }, { code: 'LS', n: 10, name: 'Left Side', view: 'front', x: 241, y: 666 },
  { code: 'RFS', n: 11, name: 'Right Front-Side', view: 'front', x: 161, y: 669 }, { code: 'LFS', n: 12, name: 'Left Front-Side', view: 'front', x: 219, y: 669 },
  { code: 'RBS', n: 13, name: 'Right Back-Side', view: 'back', x: 219, y: 669 }, { code: 'LBS', n: 14, name: 'Left Back-Side', view: 'back', x: 161, y: 669 },
  { code: 'FD', n: 15, name: 'Front Diaphragm', view: 'front', x: 190, y: 594 }, { code: 'BD', n: 16, name: 'Back Diaphragm', view: 'back', x: 190, y: 594 },
  { code: 'FS', n: 17, name: 'Front Sternum', view: 'front', x: 190, y: 512 }, { code: 'BS', n: 18, name: 'Back Sternum', view: 'back', x: 190, y: 512 },
  { code: 'RE', n: 19, name: 'Right Elbow', view: 'front', x: 112, y: 600 }, { code: 'LE', n: 20, name: 'Left Elbow', view: 'front', x: 268, y: 600 },
  { code: 'RH', n: 21, name: 'Right Hand', view: 'front', x: 93, y: 724, kind: 'right-hand' }, { code: 'LH', n: 22, name: 'Left Hand', view: 'front', x: 287, y: 724, kind: 'left-hand' },
  { code: 'F', n: 23, name: 'Face', view: 'front', x: 190, y: 418, kind: 'headset' }, { code: 'H', n: 24, name: 'Head', view: 'back', x: 190, y: 372 },
  { code: 'DP', n: 25, name: 'Dance Pole', x: 1012, y: 54, object: 'dance-pole', side: true },
  // Each hoop's two spots (2026-10-26): on the side at 3 o'clock and high on the ring at half past one. Both stay off the
  // bottom, where she sits and hangs, and off the top tab, where the rigging and her hands are; either one is enough.
  { code: 'BDH', n: 26, name: 'Big Dance Hoop Side', x: 770, y: 410, object: 'large-hoop' },
  { code: 'BDT', n: 27, name: 'Big Dance Hoop Top', x: 716, y: 295, object: 'large-hoop' },
  { code: 'LDH', n: 28, name: 'Little Dance Hoop Side', x: 938, y: 328, object: 'small-hoop' },
  { code: 'LDT', n: 29, name: 'Little Dance Hoop Top', x: 904, y: 269, object: 'small-hoop' },
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

// Her five toys (Astra, 2026-10-25: "forgot about 5 toys, they dont track though"; 2026-10-26: "none of these look like
// real life models of the actual equipment"): traced from the makers' product photos, true size at 3 to a centimetre,
// standing on the floor with no spot.
// - Woojer Vest 3, about 51 cm: two padded shoulder straps with a big round transducer high on each, the control box with
//   its screen on her left strap, the mesh spine with its chest strap, and the winged waist belt with two more transducers
//   and a round buckle between red-trimmed webbing.
// - Lovense Nora, 24.4 cm: a pink curved shaft with its rabbit arm, a silver band and a white handle.
// - Domi 2, 23 cm: a black mini wand, a round head on a short neck, a silver band and a long body.
// - Lush 3, 18 cm: a pink egg lying on its side, its thin tail arching up and over it.
// - Vulse, 21 cm: a coral egg with a ribbed end, its tail arching up and over it.
// `x`, `y`: the drawing's top left; `scale`: from the outline's own units; `label`: where its name goes.
const shine = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity=".28"/>`;
const pod = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="#0c0c0f"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#toy-pod)" stroke="#55555f" stroke-width=".6"/><circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="#24242a" stroke-width=".9"/><path d="M${cx - r * 0.62} ${cy - r * 0.42} A ${r * 0.78} ${r * 0.78} 0 0 1 ${cx + r * 0.28} ${cy - r * 0.74}" fill="none" stroke="#9a9aa6" stroke-width=".7" opacity=".6"/>`;
const stitch = (d) => `<path d="${d}" fill="none" stroke="#4a4a54" stroke-width=".45" stroke-dasharray="1.1 .9"/>`;
const STRAP = 'M6.4 1.3 C14 0 26 2 31.9 6.4 C31 18 29.5 30 29.8 40.4 C30 52 32 62 34 70.2 L13 72.3 C9 62 3 52 2.1 40.4 C1 30 0 20 0.9 14.9 C1.5 8 3.5 3 6.4 1.3 Z';
const BELT = 'M0 80.9 C10 77 22 75.5 29.8 76.6 C38 78 44 84 50 85 C56 84 62 78 70.2 76.6 C78 75.5 90 77 100 80.9 C101.5 92 101.5 104 100 114.9 C90 118.5 80 119.5 70.2 119 C62 118 56 113 50 112.8 C44 113 38 118 29.8 119 C20 119.5 10 118.5 0 114.9 C-1.5 104 -1.5 92 0 80.9 Z';
export const TOYS = [
  { name: 'Woojer Vest 3', x: 536, y: 707, w: 129, scale: 1.29, label: [600, 884], svg: `<path d="${BELT}" fill="url(#toy-vest)" stroke="#3a3a44" stroke-width=".8"/>${stitch('M3 83 C12 80 22 79 29.8 80 C38 81 44 87 50 88 C56 87 62 81 70.2 80 C78 79 88 80 97 83')}
<path d="M27 68 h7 v12 h-7 Z M66 68 h7 v12 h-7 Z" fill="#111114"/><path d="M28 71 h5 M67 71 h5" stroke="#c4313c" stroke-width="1"/>
<path d="${STRAP}" fill="url(#toy-vest)" stroke="#3a3a44" stroke-width=".8"/><path d="${STRAP}" transform="translate(100 0) scale(-1 1)" fill="url(#toy-vest)" stroke="#3a3a44" stroke-width=".8"/>
${stitch('M7 4 C2 12 2.6 30 3.6 40 C4.5 52 9 62 14 70')}${stitch('M93 4 C98 12 97.4 30 96.4 40 C95.5 52 91 62 86 70')}
<path d="M31.9 6.4 Q50 2.5 68.1 6.4 L67 16 Q50 13 33 16 Z" fill="#18181c" stroke="#3a3a44" stroke-width=".6"/><rect x="46" y="7" width="8" height="2.6" rx="1.3" fill="none" stroke="#a0a0aa" stroke-width=".7"/>
<path d="M42 16 L58 16 L59 92 L41 92 Z" fill="url(#toy-mesh)" stroke="#2a2a31" stroke-width=".6"/><text x="0" y="0" font-size="3.2" fill="#8a8a94" transform="translate(51.2 78) rotate(-90)">born to feel</text>
<rect x="30" y="53.6" width="40" height="2.6" fill="#0e0e11"/><rect x="34" y="52" width="5.4" height="5.8" rx="1" fill="#24242a" stroke="#6a6a74" stroke-width=".5"/><rect x="60.6" y="52" width="5.4" height="5.8" rx="1" fill="#24242a" stroke="#6a6a74" stroke-width=".5"/>
${pod(20.5, 27.5, 10.5)}${pod(79.5, 27.5, 10.5)}
<g transform="rotate(-8 73 52)"><rect x="64.5" y="42.5" width="17" height="19" rx="2.2" fill="#0d0d10" stroke="#55555f" stroke-width=".6"/><rect x="66.4" y="44.4" width="9.6" height="14" rx="1" fill="#071820"/><circle cx="71.2" cy="49.4" r="2.2" fill="none" stroke="#39c6ff" stroke-width=".6"/><rect x="67.6" y="53.6" width="7" height=".8" fill="#39c6ff" opacity=".8"/><rect x="67.6" y="55.6" width="4.6" height=".8" fill="#ffffff" opacity=".6"/><circle cx="78.6" cy="47" r=".9" fill="#55555f"/><circle cx="78.6" cy="51" r=".9" fill="#55555f"/></g>
<text x="0" y="0" font-size="4.6" fill="#d6d6de" letter-spacing=".2" transform="translate(7.5 60) rotate(-13)">woojer</text>
<rect x="31" y="96" width="38" height="6" fill="#121216"/><path d="M36.4 94.4 v9.2 M63.6 94.4 v9.2" stroke="#c4313c" stroke-width="1.2"/>
${pod(12.8, 99, 9.2)}${pod(87.2, 99, 9.2)}
<circle cx="50" cy="99" r="5.4" fill="#26262c" stroke="#a0a0aa" stroke-width=".8"/><circle cx="50" cy="99" r="2.6" fill="none" stroke="#c8c8d0" stroke-width=".6"/><circle cx="50" cy="99" r=".9" fill="#e0e0e8"/>` },
  { name: 'Nora', x: 752, y: 787, w: 24, scale: 1, label: [764, 884], svg: `<path d="M8.4 37 C3.6 34 1.6 28 2.2 22.4 C2.6 19.6 5 19.4 5.6 22.2 C6.4 26.8 7.6 29.8 10 31 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".5"/>
<path d="M7.6 45.5 C7 34 8 22 11 12 C12.6 6 15 2.6 17.6 3 C20.6 3.6 20.6 8 19.6 13 C18 22 17 34 16.6 45.5 Z" fill="url(#toy-pink)" stroke="#8e0f3c" stroke-width=".5"/>
<rect x="7.2" y="45" width="9.8" height="2.4" rx=".6" fill="url(#toy-silver)"/><path d="M7.2 47.4 L7.2 69 Q7.2 73 12.1 73 Q17 73 17 69 L17 47.4 Z" fill="url(#toy-white)" stroke="#a7a7b2" stroke-width=".4"/>
${shine(12.3, 22, 1, 9)}${shine(9.6, 59, .9, 8)}` },
  { name: 'Domi 2', x: 814, y: 791, w: 17, scale: 1, label: [822, 884], svg: `<path d="M5.8 13.6 Q8.5 15 11.2 13.6 L12 19.6 Q8.5 21 5 19.6 Z" fill="url(#toy-black)"/>
<circle cx="8.5" cy="7.5" r="7.5" fill="url(#toy-black-head)"/><path d="M2.4 21 Q8.5 18.4 14.6 21 L15 66.6 Q15 69 12.8 69 L4.2 69 Q2 69 2 66.6 Z" fill="url(#toy-black)" stroke="#3a3a42" stroke-width=".4"/>
<rect x="2.3" y="25.6" width="12.4" height="1.6" fill="url(#toy-silver)"/><circle cx="8.5" cy="33" r=".9" fill="#55555f"/><circle cx="8.5" cy="37" r=".9" fill="#55555f"/>
${shine(5.4, 4.6, 1.8, 2.2)}${shine(5.4, 46, .8, 16)}` },
  { name: 'Lush 3', x: 864, y: 830, w: 34, scale: 1, label: [881, 884], svg: `<path d="M11 25 C2 22 .5 9 9.6 3.4 C17.6 -1.2 27.6 1.6 30 8.6" fill="none" stroke="#9c0f4a" stroke-width="4.2" stroke-linecap="round"/><path d="M11 25 C2 22 .5 9 9.6 3.4 C17.6 -1.2 27.6 1.6 30 8.6" fill="none" stroke="url(#toy-pink-line)" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="30.4" cy="10.6" rx="2.8" ry="1.8" fill="#ec3a85" stroke="#9c0f4a" stroke-width=".5" transform="rotate(62 30.4 10.6)"/>
<path d="M9.6 25 C11.6 19.6 21 17.6 27.6 19.2 C33.4 20.6 33.6 28 28 29.6 C21.6 31.4 11.6 30.4 9.6 25 Z" fill="url(#toy-pink-v)" stroke="#9c0f4a" stroke-width=".5"/>${shine(22, 21.6, 6, 1.1)}` },
  { name: 'Vulse', x: 926, y: 828, w: 38, scale: 1, label: [945, 884], svg: `<path d="M12.6 26 C4 24 .6 12 7.6 5 C13.6 -.4 24 1.4 26.4 8" fill="none" stroke="#9e1622" stroke-width="4.6" stroke-linecap="round"/><path d="M12.6 26 C4 24 .6 12 7.6 5 C13.6 -.4 24 1.4 26.4 8" fill="none" stroke="url(#toy-coral-line)" stroke-width="3.4" stroke-linecap="round"/>
<ellipse cx="26.8" cy="10" rx="2.8" ry="2" fill="#ff5a68" stroke="#9e1622" stroke-width=".5" transform="rotate(60 26.8 10)"/>
<path d="M20 20.6 C31 19.6 38 22.6 38 26.4 C38 30 31 32.6 20 31.8 Z" fill="url(#toy-coral-v)" stroke="#9e1622" stroke-width=".5"/>
${[12, 14.2, 16.4, 18.6].map((x, i) => `<rect x="${x}" y="${20.6 + i * .1}" width="2.4" height="${11.2 - i * .2}" rx="1.2" fill="url(#toy-coral-v)" stroke="#9e1622" stroke-width=".45"/>`).join('')}${shine(29, 22.6, 5, 1)}` },
];
const TOY_DEFS = `<defs>
<linearGradient id="toy-pink" x1="0" x2="1"><stop offset="0" stop-color="#7d0a33"/><stop offset=".22" stop-color="#d6346f"/><stop offset=".4" stop-color="#ff8fbd"/><stop offset=".58" stop-color="#e44a86"/><stop offset="1" stop-color="#8e0f3c"/></linearGradient>
<linearGradient id="toy-pink-line" x1="0" x2="1"><stop offset="0" stop-color="#c81c5c"/><stop offset="1" stop-color="#f06a9e"/></linearGradient>
<linearGradient id="toy-coral" x1="0" x2="1"><stop offset="0" stop-color="#7a0d17"/><stop offset=".25" stop-color="#e0303f"/><stop offset=".42" stop-color="#ff9aa2"/><stop offset=".6" stop-color="#f04452"/><stop offset="1" stop-color="#8a121e"/></linearGradient>
<linearGradient id="toy-coral-line" x1="0" x2="1"><stop offset="0" stop-color="#d22636"/><stop offset="1" stop-color="#ff7480"/></linearGradient>
<linearGradient id="toy-pink-v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff7fb4"/><stop offset=".45" stop-color="#ec3a85"/><stop offset="1" stop-color="#9c0f4a"/></linearGradient>
<linearGradient id="toy-coral-v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff9aa2"/><stop offset=".45" stop-color="#f2404f"/><stop offset="1" stop-color="#8a121e"/></linearGradient>
<linearGradient id="toy-white" x1="0" x2="1"><stop offset="0" stop-color="#c9c9d2"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#b4b4be"/></linearGradient>
<linearGradient id="toy-black" x1="0" x2="1"><stop offset="0" stop-color="#08080a"/><stop offset=".4" stop-color="#3a3a42"/><stop offset="1" stop-color="#0a0a0c"/></linearGradient>
<radialGradient id="toy-black-head" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#55555f"/><stop offset=".6" stop-color="#1c1c21"/><stop offset="1" stop-color="#050506"/></radialGradient>
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
const DEVICE_SYMBOLS = `<symbol id="ico-tracker" viewBox="-12 -12 24 24"><path d="M0 -10.5 C3.5 -10.5 7 -5 9.6 0.5 C11.6 4.8 9.8 9 5.6 9.4 C2 9.8 -2 9.8 -5.6 9.4 C-9.8 9 -11.6 4.8 -9.6 0.5 C-7 -5 -3.5 -10.5 0 -10.5 Z" fill="#30323c" stroke="#dfe5f2" stroke-width="1"/><path d="M-6.6 -3.4 C-4.6 -7.6 -2.2 -9.2 0 -9.2 C2.2 -9.2 4.6 -7.6 6.6 -3.4" fill="none" stroke="#ffffff" stroke-width=".7" opacity=".35"/>
<ellipse cx="-7.6" cy="4.6" rx="1" ry="1.6" fill="#16161b" transform="rotate(-30 -7.6 4.6)"/><ellipse cx="7.6" cy="4.6" rx="1" ry="1.6" fill="#16161b" transform="rotate(30 7.6 4.6)"/><ellipse cx="0" cy="8.2" rx="1.8" ry=".8" fill="#16161b"/><ellipse cx="-3.6" cy="-6.4" rx=".8" ry="1.3" fill="#16161b" transform="rotate(30 -3.6 -6.4)"/><ellipse cx="3.6" cy="-6.4" rx=".8" ry="1.3" fill="#16161b" transform="rotate(-30 3.6 -6.4)"/>
<circle cy="1" r="4.8" fill="#1a1a1f" stroke="#6a6f80" stroke-width=".8"/><circle cy="1" r="3" fill="none" stroke="#3a3d48" stroke-width=".7"/><circle cy="1" r="1.3" fill="#4a4e5c"/><circle cy="-6.4" r="1" fill="#6cc7e8"/></symbol>
<symbol id="ico-tracker-side" viewBox="-12 -12 24 24"><rect x="-6" y="-11" width="12" height="3" rx="1" fill="#55555f" stroke="#c9d1e0" stroke-width=".6"/><rect x="-1.4" y="-8.2" width="2.8" height="2.4" fill="#8a8f9c"/><path d="M-11 -4.6 Q-11 -6 -9.4 -6 H9.4 Q11 -6 11 -4.6 L10.2 1.6 Q8.4 6.6 0 7.2 Q-8.4 6.6 -10.2 1.6 Z" fill="#30323c" stroke="#dfe5f2" stroke-width="1"/><path d="M-9 -3.4 H9" stroke="#ffffff" stroke-width=".6" opacity=".35"/><ellipse cx="-6" cy="1.6" rx="1.4" ry=".8" fill="#16161b"/><ellipse cx="6" cy="1.6" rx="1.4" ry=".8" fill="#16161b"/><circle cx="0" cy="1.8" r="1" fill="#6cc7e8"/></symbol>
<symbol id="ico-index" viewBox="-12 -12 24 24"><path d="M-3.6 -3 C-3.8 2 -3.2 7 -2.4 10.4 Q0 11.8 2.4 10.4 C3.2 7 3.8 2 3.6 -3 Z" fill="#2b2d36" stroke="#dfe5f2" stroke-width="1"/><rect x="-1.1" y="1" width="2.2" height="6.4" rx="1" fill="#16161b"/>
<path d="M-6.2 -6.4 C-6.2 -10.8 6.2 -10.8 6.2 -6.4 C6.2 -3 3.8 -1.4 0 -1.4 C-3.8 -1.4 -6.2 -3 -6.2 -6.4 Z" fill="#3b3d48" stroke="#dfe5f2" stroke-width="1"/><ellipse cx=".4" cy="-6.4" rx="2" ry="2.7" fill="#16161b" stroke="#6a6f80" stroke-width=".5"/><circle cx="-3.4" cy="-5.6" r="1.1" fill="#16161b" stroke="#6a6f80" stroke-width=".4"/><circle cx="3.8" cy="-7.6" r=".6" fill="#6a6f80"/><circle cx="3.8" cy="-5.2" r=".6" fill="#6a6f80"/>
<path d="M-3.8 -2 C-8.6 .6 -8.2 7.6 -2.8 9.8" fill="none" stroke="#9aa3b8" stroke-width="1.8"/><path d="M-3.8 -2 C-8.6 .6 -8.2 7.6 -2.8 9.8" fill="none" stroke="#2b2d36" stroke-width=".6" stroke-dasharray="1 1"/></symbol>
<symbol id="ico-qpro-ctrl" viewBox="-12 -12 24 24"><path d="M-4.6 -9.6 Q0 -11.8 4.8 -9.6 Q6 -6 4.6 -2 Q4 6 2.6 10.5 Q0 11.8 -2.6 10.5 Q-4 6 -4.6 -2 Q-6 -6 -4.6 -9.6 Z" fill="#2b2d36" stroke="#dfe5f2" stroke-width="1"/><path d="M-3.6 -9 Q0 -10.6 3.8 -9" fill="none" stroke="#ffffff" stroke-width=".6" opacity=".4"/><circle cx="-2.2" cy="-8.2" r=".8" fill="#6a6f80"/><circle cx="0" cy="-8.8" r=".8" fill="#6a6f80"/><circle cx="2.2" cy="-8.2" r=".8" fill="#6a6f80"/><circle cy="-4.2" r="2" fill="#16161b" stroke="#6a6f80" stroke-width=".5"/><circle cx="2.6" cy="-1.2" r=".8" fill="#16161b"/><circle cx="-2.4" cy="-1.2" r=".8" fill="#16161b"/></symbol>
<symbol id="ico-q3-ctrl" viewBox="-12 -12 24 24"><path d="M-5 -8 Q0 -11 5 -8 Q6.5 -4 4 -1 Q3.5 6 2.4 10 Q0 11.4 -2.4 10 Q-3.5 6 -4 -1 Q-6.5 -4 -5 -8 Z" fill="#ececf0" stroke="#7a7a86" stroke-width="1"/><path d="M-3.6 -8.4 Q0 -10 3.6 -8.4" fill="none" stroke="#ffffff" stroke-width=".7"/><circle cy="-5" r="2" fill="#2a2a32"/><circle cx="3.2" cy="-2.4" r=".8" fill="#9a9aa6"/><circle cx="-2.6" cy="-2.2" r=".8" fill="#9a9aa6"/></symbol>
<symbol id="ico-qpro" viewBox="-12 -12 24 24"><path d="M-11 -4 Q0 -8.5 11 -4 L10 3.5 Q0 6 -10 3.5 Z" fill="#1b1b20" stroke="#8a8a96" stroke-width="1"/></symbol>
<symbol id="ico-q3" viewBox="-12 -12 24 24"><path d="M-11 -6 Q0 -9 11 -6 L11 5 Q0 8 -11 5 Z" fill="#ececf0" stroke="#7a7a86" stroke-width="1"/></symbol>
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

// Her body as one natural outline, head to feet in one line (2026-10-26: "body still looks weird, just make it a natural female body outline"):
// her right half from the neck, down the arm and round the hand, up to the armpit, down the bust, waist, hip and leg to
// the foot, and up the inner leg; the left half is its mirror. Drawn 190 wide-centre, 930 floor.
const HALF = [[176, 392], [167, 404], [165, 421], [168, 438], [175, 449], [179, 457], [178, 474], [160, 484], [140, 491],
  [128, 502], [120, 540], [106, 598], [95, 662], [89, 700], [84, 716], [86, 734], [94, 742], [101, 730], [101, 710],
  [106, 680], [116, 630], [124, 590], [133, 548], [140, 536], [141, 556], [148, 574], [154, 612], [148, 636], [140, 656],
  [137, 672], [139, 700], [143, 740], [148, 778], [150, 806], [149, 846], [155, 888], [151, 904], [143, 918], [141, 926],
  [148, 930], [172, 930], [178, 921], [177, 904], [178, 888], [180, 850], [182, 806], [184, 760], [186, 716], [189, 692]];
const BODY = smooth([[190, 388], ...HALF, ...HALF.slice().reverse().map(([x, y]) => [380 - x, y])].map(([x, y]) => [x, Math.round(lift(y) * 10) / 10]));

// Her hair, black like a galaxy, up in a bun over her head (2026-10-26: "show the hair as black and galaxy like, its in
// a bun over the head"). A few stars twinkle in it.
const STARS = (pts) => pts.map(([x, y, r]) => `<circle class="strap-star" cx="${x}" cy="${y}" r="${r}"/>`).join('');
const HAIR_FRONT = `<path class="strap-hair" d="M166 418 C163 392 178 386 190 386 C202 386 217 392 214 418 C212 430 211 438 209 445 L205.5 445 C207 430 206 412 200 404 C194 398 186 398 180 404 C174 412 173 430 174.5 445 L171 445 C169 438 168 430 166 418 Z"/>
<path class="strap-face" d="M186.5 438.5 Q190 440.5 193.5 438.5 M184 444.5 Q190 448 196 444.5"/>`;
const HAIR_BACK = `<path class="strap-hair" d="M165 418 C160 380 220 380 215 418 C214 440 204 452 190 454 C176 452 166 440 165 418 Z"/>`;
const BUN = `<ellipse class="strap-hair" cx="190" cy="378" rx="19" ry="15"/><path class="strap-hair-tie" d="M176 388 Q190 394 204 388"/>${STARS([[184, 372, 1.3], [197, 381, .9], [190, 368, .8], [176, 384, .7], [205, 375, .8]])}`;

// The headset on her face, Quest Pro or Quest 3 as 23 Face says ("make the Quest Pro or Quest 3 cutouts"): the page
// shows the one that is on.
// The headsets at their real size on her face (Meta's cut sheets: Quest Pro 196 mm wide; Quest 3 about 184 mm), 3.2 to a
// centimetre in her drawing.
const HEADSETS_FRONT = `<g class="strap-hs strap-hs-quest-pro"><path class="strap-band" d="M159 408 C152 392 160 376 178 371 C196 367 216 372 224 386 C228 394 226 402 221 408"/>
<path class="strap-headset" d="M158.5 405 Q190 396 221.5 405 L220.5 423 Q219.5 431 210 431.5 Q190 434 170 431.5 Q160.5 431 159.5 423 Z"/><path d="M161 407.5 Q190 399.5 219 407.5" fill="none" stroke="#e8eefc" stroke-width=".9" opacity=".55"/>
<path d="M163 416 Q190 410 217 416" fill="none" stroke="#3a3d4a" stroke-width="5" opacity=".7"/><circle cx="166" cy="425" r="1.4" fill="#4a4e5c"/><circle cx="214" cy="425" r="1.4" fill="#4a4e5c"/><circle cx="178" cy="428" r="1.1" fill="#4a4e5c"/><circle cx="202" cy="428" r="1.1" fill="#4a4e5c"/><circle cx="190" cy="429" r="1.1" fill="#4a4e5c"/></g>
<g class="strap-hs strap-hs-quest-3"><path class="strap-band-soft" d="M161 410 C152 398 157 380 176 374 M219 410 C228 398 223 380 204 374 M176 374 Q190 366 204 374"/>
<path class="strap-headset-q3" d="M160.5 402 Q190 395 219.5 402 L219.5 428 Q219.5 434 212 434 Q190 437 168 434 Q160.5 434 160.5 428 Z"/><rect x="167" y="410" width="9" height="17" rx="4.5" fill="#24242c"/><rect x="185.5" y="410" width="9" height="17" rx="4.5" fill="#24242c"/><rect x="204" y="410" width="9" height="17" rx="4.5" fill="#24242c"/></g>`;
// From the back: the Quest Pro's halo band round her head and its battery at the back; the Quest 3's soft strap.
const HEADSETS_BACK = `<g class="strap-hs strap-hs-quest-pro"><path class="strap-band" d="M166 414 Q190 406 214 414"/><rect class="strap-headset" x="180" y="408" width="20" height="15" rx="5"/><path d="M184 412 h12" stroke="#a8b3d0" stroke-width=".8" opacity=".6"/></g>
<g class="strap-hs strap-hs-quest-3"><path class="strap-band-soft" d="M165 410 Q190 400 215 410 M167 426 Q190 418 213 426"/></g>`;

function figure(view) {
  const front = view === 'front';
  return `<g class="strap-figure strap-${view}" transform="translate(${VIEW_X[view] - 190 * SCALE} ${FLOOR - 930 * SCALE}) scale(${SCALE})">
<ellipse class="strap-shadow" cx="190" cy="930" rx="62" ry="6"/>
<path class="strap-skin" d="${BODY}"/>
<g transform="translate(0 -${LIFT})">
${front ? '<path class="strap-crease" d="M160 552 Q172 566 186 558 M194 558 Q208 566 220 552 M190 626 v2"/>' : '<path class="strap-crease" d="M190 492 V700 M160 520 Q172 532 168 552 M220 520 Q208 532 212 552"/>'}
${front ? HAIR_FRONT : HAIR_BACK}${BUN}
${front ? HEADSETS_FRONT : HEADSETS_BACK}</g>
</g>`;
}

// The aerial hoops (lyra) hang from her 9 ft ceiling at the same height (2026-10-26: "hoops are suspended at the same
// height, and both by black ropes"), each on a black spanset to a black figure-8 and the lyra's tab. The tube (25 mm)
// is black with a random galaxy glitter, as hers are (her photos; "the hoop needs to be a random galaxy material not the
// pattern you are showing"): soft clouds of violet, blue, magenta and teal, holographic flakes of every size and colour
// scattered at random, and a few bright white sparks. A fixed seed keeps the same sparkle on every build.
const GALAXY_CLOUDS = ['#5a2bd6', '#2a4fd0', '#7b3cff', '#3a3ccf'];
const HOLO = ['#ffffff', '#ffffff', '#ffffff', '#e6e2ff', '#c6a8ff', '#9fd0ff', '#7ef9ff', '#ff8fd0', '#d9b8ff'];
const seeded = (seed) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const lyra = (cx, cy, r, seed) => {
  const rnd = seeded(seed), at = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  // Faint violet and blue clouds at an even step round the ring, the tube black between them.
  const many = Math.round(r / 6);
  const clouds = Array.from({ length: many }, (_, i) => {
    const a = ((i + 0.2 * rnd()) / many) * Math.PI * 2, len = (Math.PI * 2 / many) * 0.55;
    return `<path d="M${at(a, r)} A ${r} ${r} 0 0 1 ${at(a + len, r)}" stroke="${GALAXY_CLOUDS[i % GALAXY_CLOUDS.length]}" stroke-width="5" opacity=".3"/>`;
  }).join('');
  // Small stars spread evenly: one in each short stretch of the ring, at a random spot across the tube.
  const count = Math.round(r * 4);
  const flakes = Array.from({ length: count }, (_, i) => {
    const a = ((i + rnd()) / count) * Math.PI * 2, rr = r + (rnd() - 0.5) * 6.4, big = rnd() > 0.96;
    return `<circle cx="${at(a, rr).replace(' ', '" cy="')}" r="${(big ? 0.75 : 0.22 + rnd() * 0.3).toFixed(2)}" fill="${HOLO[Math.floor(rnd() * HOLO.length)]}" opacity="${(0.6 + rnd() * 0.4).toFixed(2)}"/>`;
  }).join('');
  const sparkCount = Math.round(r / 18);
  const sparks = Array.from({ length: sparkCount }, (_, i) => {
    const [x, y] = at(((i + 0.5) / sparkCount) * Math.PI * 2, r).split(' ').map(Number), k = 1.6;
    return `<path d="M${x - k} ${y} H${x + k} M${x} ${y - k} V${y + k}" stroke="#ffffff" stroke-width=".45"/>`;
  }).join('');
  const top = cy - r;
  return `<g class="strap-lyra"><path class="strap-rope" d="M${cx} ${CEILING} V${top - 30}"/><circle class="strap-fig8" cx="${cx}" cy="${top - 24}" r="5"/><circle class="strap-fig8" cx="${cx}" cy="${top - 14}" r="6.5"/><path class="strap-rope" d="M${cx} ${top - 8} V${top}"/>
<circle class="strap-hoop" cx="${cx}" cy="${cy}" r="${r}"/><g fill="none" class="strap-galaxy">${clouds}</g><g>${flakes}${sparks}</g><path class="strap-hoop-gloss" d="M${at(Math.PI * 1.22, r - 2.4)} A ${r - 2.4} ${r - 2.4} 0 0 1 ${at(Math.PI * 1.5, r - 2.4)}"/></g>`;
};

// Her ceiling is 9 ft (2.74 m) over the floor at 3 to a centimetre.
const CEILING = Math.round(FLOOR - 274.3 * 3);

// The X-Pole XPERT Pro (X-POLE's parts list and FAQ, "What's the size of the upper dome/base?": upper dome 280 mm (11"),
// base 120 mm; 45 mm pole), in her neon green and black (2026-10-26: "make the x pole geometry real life accurate";
// "the Dome looks too thick, and the bottom too"). From the ceiling down: the rubber pad, the shallow upper dome, the
// chrome adjuster and its cover, the 45 mm black pole, the X-LOCK sleeve with its black band, and the small domed base.
// Her tracker sits under the left of the upper dome, facing down.
const POLE_X = 1040;
const xpole = (x = POLE_X, c = CEILING, f = FLOOR) => `<g class="strap-pole"><rect x="${x - 41}" y="${c}" width="82" height="1.6" fill="#101012"/>
<path d="M${x - 42} ${c + 1.6} H${x + 42} Q${x + 41} ${c + 4.6} ${x + 30} ${c + 6.6} Q${x + 16} ${c + 9.4} ${x + 9} ${c + 10} H${x - 9} Q${x - 16} ${c + 9.4} ${x - 30} ${c + 6.6} Q${x - 41} ${c + 4.6} ${x - 42} ${c + 1.6} Z" fill="url(#strap-dome)" class="strap-dome"/>
<rect x="${x - 9}" y="${c + 10}" width="18" height="2.4" rx="1" fill="url(#strap-chrome-x)"/><rect x="${x - 4.6}" y="${c + 12.4}" width="9.2" height="34" fill="url(#strap-chrome-x)"/><path d="M${x - 4.6} ${c + 16} h9.2 M${x - 4.6} ${c + 19} h9.2 M${x - 4.6} ${c + 22} h9.2 M${x - 4.6} ${c + 25} h9.2" stroke="#7a8392" stroke-width=".5"/>
<rect x="${x - 7.6}" y="${c + 46}" width="15.2" height="9" rx="1.5" fill="url(#strap-chrome-x)"/>
<rect x="${x - 6.75}" y="${c + 55}" width="13.5" height="${f - c - 55 - 44}" fill="url(#strap-pole)"/><path d="M${x - 6.75} ${(c + f) / 2} h13.5" stroke="#2a2a30" stroke-width=".6"/>
<rect x="${x - 8}" y="${f - 44}" width="16" height="30" rx="1.5" fill="url(#strap-chrome-x)"/><rect x="${x - 8}" y="${f - 33}" width="16" height="7" fill="#0b0b0e"/><text x="${x}" y="${f - 27.6}" text-anchor="middle" font-size="4.4" font-weight="700" fill="#e8e8ee">X</text><circle cx="${x}" cy="${f - 39}" r=".9" fill="#3a3f48"/>
<rect x="${x - 5.5}" y="${f - 14}" width="11" height="8" fill="url(#strap-chrome-x)"/>
<path d="M${x - 18} ${f} H${x + 18} Q${x + 17.5} ${f - 4} ${x + 9} ${f - 5.6} Q${x} ${f - 6.6} ${x - 9} ${f - 5.6} Q${x - 17.5} ${f - 4} ${x - 18} ${f} Z" fill="url(#strap-dome)" class="strap-dome"/></g>`;

function strapperDrawing() {
  // Every spot carries each device's drawing; the page shows the one for the device on it.
  const spot = (s) => `<g class="strap-spot" data-strap-dot="${esc(s.code)}" data-kind="" tabindex="0" role="button" aria-label="${esc(spotName(s))}: pick its device"><title>${esc(spotName(s))}</title>
<circle class="strap-halo" cx="${s.x}" cy="${s.y}" r="18"/><circle class="strap-empty" cx="${s.x}" cy="${s.y}" r="8"/>
${SPOT_KINDS.filter((k) => KIND_SIZE[k]).map((k) => `<use class="ico ico-${k}" href="#ico-${k}${k === 'tracker' && s.side ? '-side' : ''}" x="${s.x - KIND_SIZE[k] / 2}" y="${s.y - KIND_SIZE[k] / 2}" width="${KIND_SIZE[k]}" height="${KIND_SIZE[k]}"${s.down ? ` transform="rotate(180 ${s.x} ${s.y})"` : ''}/>`).join('')}
<circle class="strap-badge" cx="${s.x + 15}" cy="${s.y - 14}" r="8"/><text x="${s.x + 15}" y="${s.y - 10.5}" text-anchor="middle">${s.n}</text></g>`;
  // Each toy stands on the floor with a soft shadow under it.
  const toy = (t) => `<g class="strap-toy"><ellipse class="strap-toy-shadow" cx="${t.x + t.w / 2}" cy="861" rx="${t.w / 2 + 4}" ry="3.5"/><g transform="translate(${t.x} ${t.y}) scale(${t.scale})">${t.svg}</g><text x="${t.label[0]}" y="${t.label[1]}" text-anchor="middle">${esc(t.name)}</text></g>`;
  return `<svg class="strap-drawing" data-headset="quest-pro" viewBox="0 0 1110 916" role="img" aria-labelledby="strap-title"><title id="strap-title">Astra, 5′7″, from the front and from the back, with her 29 tracking spots; the aerial hoops hanging from the ceiling, her five toys and the dance pole beside her, to scale</title>
<defs>${DEVICE_SYMBOLS}<linearGradient id="strap-skin" x1="0" x2="1"><stop offset="0" stop-color="#7f8fb8"/><stop offset=".5" stop-color="#b9c6e6"/><stop offset="1" stop-color="#7f8fb8"/></linearGradient>
<radialGradient id="strap-galaxy" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".45" stop-color="#160f2c"/><stop offset="1" stop-color="#050409"/></radialGradient>
<linearGradient id="strap-hoop" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#1a1030"/><stop offset=".25" stop-color="#2a0f3a"/><stop offset=".5" stop-color="#0b1a33"/><stop offset=".75" stop-color="#14261c"/><stop offset="1" stop-color="#1a1030"/></linearGradient>
<linearGradient id="strap-pole" x1="0" x2="1"><stop offset="0" stop-color="#050506"/><stop offset=".4" stop-color="#3a3a42"/><stop offset=".55" stop-color="#121216"/><stop offset="1" stop-color="#050506"/></linearGradient>
<linearGradient id="strap-chrome-x" x1="0" x2="1"><stop offset="0" stop-color="#6f7887"/><stop offset=".4" stop-color="#f1f4fa"/><stop offset="1" stop-color="#596273"/></linearGradient>
<radialGradient id="strap-dome" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#d8ffb0"/><stop offset=".5" stop-color="#5dff3a"/><stop offset="1" stop-color="#1e9a10"/></radialGradient>
<radialGradient id="strap-glow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient></defs>
${TOY_DEFS}
<path class="strap-ceiling" d="M470 ${CEILING} H1100"/><text class="strap-prop-names" x="476" y="${CEILING + 20}">9 ft ceiling</text><path class="strap-floor" d="M8 862 H1102"/>
<ellipse cx="260" cy="560" rx="260" ry="330" fill="url(#strap-glow)"/>
${figure('front')}${figure('back')}
<text class="strap-view" x="140" y="284" text-anchor="middle">Front Side</text><text class="strap-view" x="380" y="284" text-anchor="middle">Back Side</text>
${lyra(620, 410, 150, 26)}${lyra(870, 328, 68, 27)}
${xpole()}
<text class="strap-prop-names" x="992" y="58" text-anchor="end">faces down</text>
<g class="strap-prop-names"><text x="620" y="416" text-anchor="middle">Big Dance Hoop</text><text x="870" y="324" text-anchor="middle">Little</text><text x="870" y="343" text-anchor="middle">Dance Hoop</text><text x="${POLE_X}" y="884" text-anchor="middle">X-Pole</text><text x="${POLE_X}" y="904" text-anchor="middle">XPERT Pro</text></g>
${TOYS.map(toy).join('\n')}
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
