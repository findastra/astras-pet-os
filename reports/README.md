# Research

*By Astra.*

My research papers, in plain words, with the notes behind them. The paper answers the questions, and the tables below
show what I'm doing with the answers.

## What's in this folder

| File | What it answers |
|---|---|
| **[Face tracking avatars and quantum simulation](Face%20tracking%20avatars%20and%20quantum%20simulation.md)**, the research paper (updated 2026-11-03) | How to clone my reactions into AI Astra, Astralese, my OSC problem, quantum random bits and the Quantum 10, plus the first version's findings on face tracking, robot faces, AI characters, Euler's formula and toy universes |
| [Notes: Cloning yourself in VRChat](../research_notes/Cloning%20yourself%20in%20VRChat/) | The sources for the 2026-11-03 update: [cloning reactions](../research_notes/Cloning%20yourself%20in%20VRChat/cloning_reactions.md), [randomness and moods](../research_notes/Cloning%20yourself%20in%20VRChat/randomness_and_moods.md), [OSC and face data](../research_notes/Cloning%20yourself%20in%20VRChat/osc_and_face_data.md), [the Quantum 10](../research_notes/Cloning%20yourself%20in%20VRChat/quantum_10.md) |
| [Notes: Face tracking avatars and quantum simulation](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/) | The sources for the first version: [VR avatars](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/vr_avatar_face_tracking.md), [AI and game characters](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/ai_and_game_characters.md), [robots with faces](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/robots_with_faces.md), [Euler's identity](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/euler_identity_quantum.md), [simulating physics](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/quantum_universe_simulation.md), [access and learning](../research_notes/Face%20tracking%20avatars%20and%20quantum%20simulation/quantum_access_and_learning.md) |
| [The first report](../changes/face-tracking-quantum-research-20261103.md) and [this update](../changes/clone-research-update-20261103.md) | What changed, and when |

## How a research paper is organized

A research paper answers questions with evidence, in an order that lets you stop reading early. A classic scientific
paper, one that reports a new experiment, follows a fixed order called **IMRaD**: an Abstract, then Introduction,
Methods, Results and Discussion, then a list of References. This paper is a different kind, a **research report**
(a review of other people's work), so the same parts carry other names here. Each part has one job:

| Part | Its job | In a classic paper (IMRaD) | In this paper |
|---|---|---|---|
| Title | The main idea in a few words | Title | "Clone her reactions, then turn the phase" |
| Dated note | What changed, and when | Dates received and revised | The line under the title |
| Summary first | All the answers in a couple of paragraphs, so you can stop there | Abstract | The two opening paragraphs |
| The question | Why it matters and what is already known | Introduction | The first lines of each section; the newer sections start with what Astra asked |
| How it was researched | Where the evidence came from, so anyone can check it | Methods | Each note's opening lines on how it was sourced (which sites could be read, which only through search) |
| Sections | Each answers one question with evidence. The heading states the answer | Results | Cloning, Astralese, The Astral Plane, OSC, VRChat's launch, labs and robots, AI characters, randomness, Euler, toy universes, the timeline, costs, the Quantum 10 |
| Tables | Many facts side by side | Tables and figures | Labs that clone reactions, OSC tools, the OSC checklist, contacts, the Quantum 10 and more |
| Limits and gaps | What is uncertain. "Search summary" marks a fact read only from search results; "not verified" and "not found" mark the gaps | Discussion (limitations) | Inside every section, and in each note's "Gaps" lists |
| Conclusion | What it all means now, without repeating it | Discussion or Conclusion | The last section |
| Sources | Where each fact came from | References | The link in brackets after each fact, instead of a numbered list at the end |
| Notes | The raw research, with every source | Supplementary material | The two notes folders |

## What I'm doing

| Project | Step | Status | Next step | Where |
|---|---|---|---|---|
| Clone my reactions into AI Astra | Record my own face (face recorder) | Built and tested on a branch, not merged, never run live | Check my face is coming in with `describe --live`, then record one session in a private instance | the-astral-plane (private), branch `claude/face-tools-20261103`, `face/`; [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#the-astral-plane-got-four-face-tools-tested-but-never-run-live) |
| | Read faces as Astralese (face translator) | Built and tested on a branch, not merged, never run live | Run `describe` on my first session | Same branch, `face/` |
| | Learn my reactions into a reaction book (reaction learner) | Built and tested on a branch, not merged, never run live | `learn`, then review, rate and delete in `book` | Same branch, `face/` |
| | Pick one of my reactions for a moment (`react`) | Built and tested on a branch, not merged, never run live; a preview that sends nothing | Try `react "friend told a joke"` after the first `learn` | Same branch, `face/` |
| | Run a recording session (clone-session trick) | Written on a branch, not merged, never followed live | Follow it once, with the OK of anyone present | Same branch, `skills/clone-session/` |
| | Merge the face tools | Planned | Review the branch, then give my OK to merge | the-astral-plane |
| | Decide which expressions AI Astra may change (decision 7) | Planned | Write the allowlist; which expressions AI Astra may change is still my decision | the-astral-plane, open decision 7 |
| | Send reactions to VRChat through AI Astra's body | Planned (waits on decision 7) | Nothing until decision 7 | the-astral-plane |
| | Fit my noise fingerprint (blink timing, drift back to neutral) | Planned | After a few recordings | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#is-that-how-a-human-is) |
| | Blind test: can friends tell me from AI Astra? | Idea | After the first reactions work, with friends' consent | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#record-her-side-first-and-judge-the-clone-against-astra-herself) |
| Astralese | Names: Astralese (the face language), constellation (one face snapshot), comet (one reaction) | Planned (working names, waiting on my OK) | Say yes, or pick other names | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#astralese-turns-unified-expressions-into-constellations-and-comets) |
| Fix my OSC problem | Run the 10-step checklist | Planned | Next time it happens: OSC Debug (step 2), then the port check (step 4), and write down the symptom | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#most-osc-trouble-is-a-port-fight-or-a-stale-avatar-config) |
| | OSC Sonar (the OSC Sealion, repo osc-sonar) | Planned | Write down my symptoms, then build its port and mDNS checks | [pet-programs.json](../pet-programs.json) |
| The Quantum 10 | Sign up for IBM's free Open Plan (us-east) | Planned | Make the account; save the key on my PC only | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#signing-up-takes-five-steps-and-only-paid-plans-charge) |
| | Rehearse all ten on my PC (Qiskit Aer, fake backends) | Planned | Install Qiskit in its own environment | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#the-quantum-10) |
| | Run the ten on real IBM hardware | Planned | One job at a time with `max_execution_time` set; write down `job.usage()` | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#the-quantum-10) |
| | Fill the quantum coin jar (experiment 2) | Built and tested on a branch, not merged, never run live (the fill script has never been run) | Run the fill script with `--plan` first | the-astral-plane branch, `face/quantum/` |
| Euler VR visualizer | Euler slider in Unity and VR: the arrows 1 and e^(iθ) cancel at π | Idea | Prototype it with the numbers from experiment 1 | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#eulers-formula-is-the-grammar-of-every-quantum-gate-not-the-engine) |
| | VR replay of my real Quantum 10 runs, as a microgrant pitch | Idea | After the Quantum 10 | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#other-things-she-could-use) |
| Learning path | 3Blue1Brown's Euler lesson, Quantum Country, IBM Quantum Learning, then a toy universe on my GPU | Planned | Start with the 3Blue1Brown lesson | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#starting-costs-0-and-skill-is-the-bottleneck-not-money) |
| | Qiskit certification (about $200), Advocate Tier 1, then QAMP in a later year | Idea | After the Quantum 10 | [paper](Face%20tracking%20avatars%20and%20quantum%20simulation.md#she-has-a-chance-and-her-lane-is-visualisation) |

## The Quantum 10

Ten beginner experiments for IBM's 10 free minutes. The seconds are estimates from IBM's formula
(2 s + 0.00035 s × circuits × shots), not measurements.

| # | Name | What it shows | Rough QPU seconds |
|---|---|---|---|
| 1 | Euler slider | e^(iπ) + 1 = 0 makes an outcome certain | ~9 |
| 2 | Quantum coin for AI Astra | Fresh random bits for her coin jar | ~5.5 |
| 3 | Beat the classical limit (Bell and CHSH) | Correlations above the classical maximum of 2 | ~7.6 |
| 4 | Cat chorus (GHZ) | Up to 20 qubits all 0 or all 1 at once | ~17 |
| 5 | Beam me up (teleportation) | A qubit's state moved with one Bell pair | ~4 |
| 6 | Find the hidden card (Grover) | One query finds 1 card out of 4 | ~2.4 |
| 7 | How long does a qubit remember? (T1 and T2) | How fast a qubit forgets | ~27 |
| 8 | Toy universe I: magnet quench (Ising) | A tiny spin chain ticking forward in time | ~16 |
| 9 | Toy universe II: matter from nothing (Schwinger) | Particle pairs made from the vacuum | ~16 |
| 10 | Face constellation (art) | One Astralese face written onto 8 qubits and read back | ~6 |
| | **Total** | | **~110 s, under 2 minutes: it fits in the 10 minutes with about 8 minutes left for re-runs** |

Limits: many facts rest on search summaries (marked in the paper and notes), the QPU seconds are estimates, the face
tools have never run against live VRChat, and nothing here is legal advice.
