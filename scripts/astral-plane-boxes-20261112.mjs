// The Astral Plane's own tool boxes on its pet program page, in L1 under Native tools (PET_BOXES in
// pet-program-pages-20261018.mjs). Astra, 2026-11-12: "Open up the astral plane and get all of this information on
// there, tools or whatever way you think makes sense." Three boxes: the roadmap she approved on 2026-11-03, what waits
// on her, and the research behind it. This hub is public: only what the hub's reports already say publicly goes here.
// Claude Opus 5.5, 2026-11-12.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

export const HUB_BLOB = 'https://github.com/findastra/astras-pet-os/blob/main/';
export const ASTRAL = 'https://github.com/findastra/the-astral-plane';
const REPORT = 'reports/Face%20tracking%20avatars%20and%20quantum%20simulation.md';

// Astra, 2026-11-03: "this roadmap looks great. I want to publish it to the README on the astral plane".
export const ROADMAP = [
  ['0', 'Fix the OSC overlap', 'VRCFaceTracking, OSCGoesBrrr and the face recorder all hear VRChat at once (OSCQuery or a router).', 'Researched; a step on your PC'],
  ['1', 'Record me', 'Save my face data during real moments, with my own notes ("friend told a joke").', 'face-recorder: built and tested, never run live'],
  ['2', 'Encode it', 'Turn raw tracking values into face frames with the Face Codec.', 'face-codec: built and tested'],
  ['3', 'Learn my reactions', 'Cut and keep my reaction clips: VRChat AI Astra, the copy of me.', 'reaction-learner: built and tested, preview only'],
  ['4', 'Build Iris', 'The agent who reads the copy of me and reacts her own way.', 'Not started'],
  ['5', "Iris's face in VRChat", 'Face and eye shapes only, after a private-world test.', 'Not started'],
];

export const WAITING = [
  ['Fix the OSC overlap (step 0)', 'With VRCFaceTracking and OSCGoesBrrr both open, run netstat -ano | findstr :9001 and look up the number at the end in Task Manager’s Details tab: whichever app holds port 9001 is the one blocking the other. Current VRCFaceTracking uses OSCQuery and needs no fixed port; VRCOSC’s router can give each app its own.'],
  ['First live test of the face tools', 'Follow the clone-session trick in a private world: start the recorder, mark a few moments, stop, learn, look at the reaction book. Nothing is sent to VRChat yet: face-out is preview only.'],
  ['The face recorder’s grant', 'It reads VRChat’s OSC output and its log, outside The Astral Plane’s own folder. That grant waits on Gatekeeper Goddess and you.'],
  ['Iris', 'Not built yet. VRChat AI Astra is the copy of you (your recordings and reaction clips); Iris will be the agent who uses it. Her code gets her name when she is made.'],
];

export const RESEARCH = [
  [HUB_BLOB + REPORT, 'The research report', 'Who else turns tracked faces into avatars, AI characters and robots; cloning your own reactions; the Face Codec; randomness and the quantum coin; OSC managers; Euler’s identity and simulating the universe.'],
  [HUB_BLOB + 'reports/README.md', 'The research README', 'The roadmap, the Quantum 10 and how a research paper is organized.'],
  [HUB_BLOB + 'research_notes/Cloning%20yourself%20in%20VRChat', 'Research notes: cloning yourself', 'The four note sets behind the second part of the report.'],
  [ASTRAL + '#readme', 'The Astral Plane’s README', 'The roadmap and the face tools (a private repo: sign in to GitHub).'],
];

export function roadmapBody() {
  const rows = ROADMAP.map(([n, step, what, status]) => `<tr><td>${esc(n)}</td><td><b>${esc(step)}</b></td><td>${esc(what)}</td><td>${esc(status)}</td></tr>`).join('');
  return `<p class="small">Astra’s plan, approved 2026-11-03. Two parts: <b>VRChat AI Astra</b> is the copy of Astra; <b>Iris</b> is the agent who uses it. The face format is the <b>Face Codec</b> (face frames and reaction clips, on top of Unified Expressions).</p>
<table class="astral-roadmap"><thead><tr><th>#</th><th>Step</th><th>What it means</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
<p class="small">Decided: Iris may move face and eye shapes only; other people in recordings get made-up names, the same one for the same person. None of it has run against live VRChat or a headset yet.</p>`;
}

export function waitingBody() {
  return `<ul class="items astral-waiting">${WAITING.map(([what, how]) => `<li><b>${esc(what)}.</b> ${esc(how)}</li>`).join('')}</ul>`;
}

export function researchBody() {
  return `<ul class="items astral-research">${RESEARCH.map(([href, name, about]) => `<li>${link(href, name)}: ${esc(about)}</li>`).join('')}</ul>`;
}
