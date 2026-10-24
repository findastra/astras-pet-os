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

export const HEADSETS = [
  { id: 'quest-pro', n: 1, name: 'VRChat on Quest Pro', face: true, about: 'Face and eye tracking through VRCFaceTracking.' },
  { id: 'quest-3', n: 2, name: 'VRChat on Quest 3', face: false, about: 'No face tracking.' },
];

// `head`: what tells SteamVR where the head is. `untested`: streamers its author has not confirmed.
export const MODES = [
  {
    id: 'native', name: 'Native VRChat tracking', tracker: 'no head tracker',
    head: 'The headset tracks itself; nothing corrects it.',
    runs: [],
    off: ['Space Calibrator continuous calibration', 'Space Override', 'Space Sync'],
    note: 'The baseline to compare the others with. Lighthouse trackers only line up if they were calibrated once; with no head tracker nothing pulls them back when the headset drifts.',
  },
  {
    id: 'space-calibrator', name: 'Space Calibrator', tracker: 'head tracker, 2 positions for the head: the mounted tracker and the headset',
    head: 'The headset keeps its own position; continuous calibration keeps re-measuring the gap between it and the tracker.',
    runs: ['Space Calibrator'],
    off: ['Space Override', 'Space Sync'],
    note: 'What you use today. The two systems stay separate, so the gap it chases can grow during a long session.',
  },
  {
    id: 'space-override', name: 'Space Override', tracker: 'head tracker, 1 position for the head: the mounted tracker',
    head: 'After one calibration the head position is built from the tracker; everything is on the Lighthouses.',
    runs: ['Space Override'],
    off: ['Space Calibrator continuous calibration', 'Space Sync'],
    untested: ['meta-horizon-link'],
    note: 'Nothing can drift apart, but a head tracker that loses the base stations moves your view. It has a fallback to the headset if the tracker dies. Controllers can jump and settle; full-body in VRChat can look odd.',
  },
  {
    id: 'space-sync', name: 'Space Sync', tracker: 'head tracker, 1 position for the head: the headset in charge',
    head: 'The headset keeps its own position; the tracker measures the gap and moves the Lighthouse devices to follow it.',
    runs: ['Space Sync (Follow SLAM HMD mode)'],
    off: ['Space Calibrator continuous calibration', 'Space Override'],
    untested: ['meta-horizon-link'],
    note: 'A beta fork of Space Override, tested mostly on one setup. Trackers can sway on fast head turns until the head is still.',
  },
];

// How each try went, kept in this browser.
export const RATINGS = [['', 'not tried yet'], ['bad', 'bad'], ['ok', 'ok'], ['good', 'good'], ['best', 'best so far']];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// The programs a launch starts, in order. Switches add theirs on the page.
export function launchOrder(headset, mode) {
  return ['SteamVR', 'the streamer', ...(headset.face ? ['VRCFaceTracking'] : []), ...mode.runs, 'VRChat'];
}

function switchRow(h) {
  const sw = (key, label, on) => `<label class="launch-switch"><input type="checkbox" data-launch-switch="${esc(key)}"${on ? ' checked' : ''}> ${esc(label)}</label>`;
  return `<div class="launch-switches">
${h.face ? '<span class="launch-fixed">Face tracking: VRCFaceTracking on</span>' : '<span class="launch-fixed">Face tracking: none</span>'}
${sw('oscgoesbrrr', 'OSCGoesBrrr', true)}
${sw('double-hip', 'Double Hip / Double Chest (Double Hip Tracker)', false)}
<label class="launch-switch">streamer <select data-launch-switch="streamer">${STREAMERS.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join('')}</select></label>
</div>`;
}

function modeCard(h, m, i) {
  const n = `${h.n}.${i + 1}`;
  const untested = (m.untested || []).map((s) => STREAMERS.find(([id]) => id === s)?.[1]).filter(Boolean);
  return `<fieldset class="launch-mode" data-launch-mode="${esc(m.id)}"${untested.length ? ` data-untested="${esc(m.untested.join(' '))}"` : ''}><legend>${esc(n)} ${esc(m.name)}</legend>
<p class="launch-tracker">${esc(m.tracker)}</p>
<p class="small">${esc(m.head)}</p>
<p class="small"><b>Starts:</b> <span class="launch-order">${launchOrder(h, m).map(esc).join(' → ')}</span><span class="launch-extra"></span></p>
<p class="small"><b>Turn off:</b> ${m.off.map(esc).join(', ') || 'nothing'}</p>
${untested.length ? `<p class="small launch-warn" hidden>Not confirmed with ${esc(untested.join(', '))} yet.</p>` : ''}
<p class="small">${esc(m.note)}</p>
<div class="launch-try"><label class="small">how it went <select data-launch-rating>${RATINGS.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></label>
<label class="small launch-note-label">notes <textarea rows="2" data-launch-note placeholder="drift after how long, jumps, swaps, lag"></textarea></label>
<span class="small launch-tried" data-launch-tried></span></div>
<p><button type="button" class="button off" disabled title="Not built yet: a web page cannot start programs on the PC">Launch ${esc(n)}</button></p>
</fieldset>`;
}

// Each headset box is a tool, so its name sits inside its round border on the first row, with its paired lights left
// of it like every tool's (Astra, 2026-10-24: "title needs to be down inside and with indicator light buttons, its a
// tool"). `lights(key, name)` is the page spawner's.
export function vrchatLaunchBody(lights = () => '') {
  return HEADSETS.map((h) => `<div class="launch-headset" data-launch-headset="${esc(h.id)}"><div class="launch-head">${lights(`tool:vrchat-launch-${h.id}`, `${h.n}. ${h.name}`)}<span class="launch-name">${esc(h.n)}. ${esc(h.name)}</span></div>
<p class="small">${esc(h.about)} <span class="launch-best" data-launch-best></span></p>
${switchRow(h)}
<div class="launch-modes">${MODES.map((m, i) => modeCard(h, m, i)).join('\n')}</div>
</div>`).join('\n');
}
