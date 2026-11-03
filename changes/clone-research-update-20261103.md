# Research update: cloning her reactions, quantum bits, OSC and the Quantum 10 (2026-11-03)

Astra, 2026-11-03: "I want to track my own face tracking data and my reaction to other people or scenarios to convert
that into how the AI should be reacting in VR chat. So I'm going to basically clone myself in VR chat, and then it's
going to build from there." She asked: "I want you to update this research paper", and "maybe put a chart, a table,
sorry, on the GitHub, like read me so I can look at it and have something like to see what I'm doing". She also asked
why she would need "truly random quantum bits and vary her small mood shifts", "Is that how a human is?", which OSC
managers exist, what to call "our face language", how someone gets access to quantum computing and whether she has a
chance, and for a fun name for a list of things to do with the free minutes ("Like the magic 10 or something. Magic
or maybe quantum 10.").

- `reports/Face tracking avatars and quantum simulation.md`: updated in place, with a dated line under the new title
  ("Clone her reactions, then turn the phase"). The opening summary and the conclusion now put her real goal first
  (cloning her own reactions so AI Astra reacts like her; reading her face live comes second). Six new sections, each
  sourced from the new notes:
  - Cloning yourself: behaviour cloning, facial reaction generation and REACT 2026's personalised tracks, the labs
    that clone one person's reactions, motion matching as retrieval for a framework-free mind, what to record (her
    side first, VRChat's log as context), how to test the clone, and VRChat's rules plus consent for other people.
  - The face language: first working names for it and its units (replaced in the second pass, below), as a layer on
    Unified Expressions, not a new standard.
  - The Astral Plane and its four new face tools and one trick, with plain status: built and tested on a branch, not
    merged, never run live, and preview-only.
  - OSC managers and her OSC problem: the tools, the common failures, a 10-step checklist, OSCQuery, two VRChat
    clients on one PC, and where OSC Sonar fits.
  - Randomness and the quantum coin: random data she already has, what quantum bits add and do not add, how the coin
    jar works, and "is that how a human is?".
  - Getting access and the Quantum 10: signing up, how the minutes are counted, whether she has a chance, the Quantum
    10 table (about 110 QPU seconds in all), and other things she could use.
- Corrections to the first version: IBM's free 10 minutes are per 28-day rolling window and counted in resource units
  since November 2026; VRChat's native face data is one 102-byte blob in VRCFaceTracking's own order, and Avatars SDK
  3.10.6 is dated 30 October 2026 (both now read from VRChat's docs source); on native face-tracking avatars
  VRCFaceTracking sends only that blob. The contacts table gained two rows (Learning to Listen, the REACT organisers).
- `reports/README.md` (new): what is in the folder, how a research paper is organized, a "What I'm doing" table
  (cloning steps and tools with their status, the face language's working names, the OSC problem and OSC Sonar, the
  Quantum 10, an Euler VR visualizer idea and the learning path) and the Quantum 10 table.
- Research only: no pet, registry, generated file or app changed. Many sites were blocked in the cloud session, so
  some facts come from search summaries; the paper and the notes mark them.

Claude Opus 5.5, 2026-11-03.

## Second pass: Astra's decisions and the merge (2026-11-03)

Astra, 2026-11-03, in her words:

1. **The face language is the Face Codec**: "Face codec is fine". She asked for developer-minded names that describe
   the whole face, not creative ones, so the first working names were turned down. Plain part names replace them: one
   moment is a **face frame**, a few seconds of one reaction is a **reaction clip**, and the values are **signals**. A
   codec is an encoder and a decoder: it encodes her whole face into signals and decodes signals into Unified
   Expressions weights.
2. **Two parts**: "I think VRChat AI Astra is a collection of me. It's basically a copy of me, but then Iris uses that.
   ... It's two parts." VRChat AI Astra is the copy of Astra (her recordings, reaction book and persona); Iris is the
   agent who will use that copy and make her own expressions from it. "We haven't really made iris yet": Iris is not
   built, and no code is renamed.
3. **Face-out may change face and eye shapes only** (The Astral Plane's decision 7): the Unified Expressions face
   shapes, the eyes and gaze; no toggles, no outfits. Face-out itself is still not built: preview only.
4. **Other people get made-up names**: "just change the names so we know it's the same person, but not use their
   actual name" (pseudonymization: one consistent pseudonym per person, never the real name).
5. **Her OSC problem**: "the overlap between OSC goes burr and VRC face tracking, and about how the porting is can send
   out a lot, but only can receive one at a time." Many apps can send to VRChat's port 9000, but only one app can
   listen on its output, port 9001 on her PC; the fix is OSCQuery (current VRCFaceTracking uses it; whether OSCGoesBrrr
   does was not verified) or a router such as VRCOSC's, and `netstat -ano | findstr :9001` shows who holds the port.
6. **Merging**: "just do what you need to do", for merging The Astral Plane's face tools and publishing the roadmap.
7. **The roadmap**: "this roadmap looks great. I want to publish it to the README on the astral plane".

- `reports/Face tracking avatars and quantum simulation.md`: the face language section is now "The Face Codec turns
  Unified Expressions into face frames and reaction clips", with why the name (codec = encoder + decoder,
  developer-minded, the whole face) and still a layer on Unified Expressions, not a new standard; signals, face
  frames and reaction clips replace the earlier words everywhere, including the stand-ins table and the Quantum 10's
  tenth experiment (now "Face frame"). The face tool is `face-codec` (was the face translator). New, briefly: the two
  parts (VRChat AI Astra and Iris, not built), face and eye shapes only, made-up names in the consent paragraph, and
  a subsection on her OSC problem with the fix and the `netstat` check. The tools' status is now merged into The Astral
  Plane's `main` with Astra's OK on 2026-11-03, unit-tested (148 in `face/`), never run against live VRChat,
  VRCFaceTracking or a real headset, face-out preview only. The dated note under the title says so. Every citation
  stays.
- `reports/README.md`: "What I'm doing" is now Astra's approved roadmap (steps 0 to 5), with the merge status, step 0's
  port check, the two parts and the names under it, then a short table of the other projects (the Quantum 10 and its
  coin jar, the Euler VR visualizer idea, the learning path, OSC Sonar). The face names and the Quantum 10's tenth row
  are updated; "How a research paper is organized", the Quantum 10 table and the links stay.
- Research only, as before: this pass changed no pet, registry, generated file or app.

Claude Opus 5.5, 2026-11-03.
