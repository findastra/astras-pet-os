# The Astral Plane's face tools in the hub (2026-11-03)

Astra, 2026-11-03: "I want to track my own face tracking data and my reaction to other people or scenarios to convert
that into how the AI should be reacting in VR chat. So I'm going to basically clone myself in VR chat, and then it's
going to build from there." She also asked why AI Astra's small mood shifts would need "truly random quantum bits".

- `system-map.json`: four new native tools of The Astral Plane (#7), state planned:
  `the-astral-plane-v1.0-face-recorder-v1.0`, the face tool now labelled `the-astral-plane-v1.0-face-codec-v1.0`
  (renamed in the second pass, below), `the-astral-plane-v1.0-reaction-learner-v1.0` and
  `the-astral-plane-v1.0-quantum-coin-v1.0`, plus the trick `the-astral-plane-v1.0-clone-session-trick-v1.0`, state
  planned. Five planned lines, linked the way the VRChat
  connector is: The Astral Plane opens each tool, and the face recorder listens to VRChat. They sit before the
  connector's VRChat line, so the VRChat pill on The Astral Plane's page still shows the connector's text. The trick has
  no line, like the other tricks.
- `npm run build` carried them to TOOLS-AND-TRICKS.md (273 rows), The Astral Plane's pet program page, its Markdown pet,
  the all-pets file and the System Map. Those pages say "planned, not built yet" for every planned item: this code is
  built and tested, but only on a branch.
- `INTELLIGENCE-LEVELS.md`, Astra Wisp's row: one sentence on the four face tools and the trick, not merged yet.
- `skills/new-pet-or-tool/SKILL.md`: the decision. The Astral Plane owns them, because AI Astra's face and reactions are
  her job; they are tools, not a new pet (same program, same data folder, no schedule). Pending Astra's OK.
- The code: findastra/the-astral-plane, branch `claude/face-tools-20261103` (`face/` and `skills/clone-session/`),
  where 113 tests pass. It has never run against live VRChat, VRCFaceTracking or a real headset, and the script that
  fills the quantum coin jar has not been run.
- This hub change: branch `ccr-3e9a4204-291t5t`.
- Waiting on Astra: the working names for the face language (a layer on top of VRCFaceTracking's Unified
  Expressions), one face snapshot and one reaction over time, now decided (second pass, below); a grant for reading
  VRChat's OSC output and its log, which is not on the map yet; and the-astral-plane's open decision 7 (which expressions AI Astra
  may change) before anything is sent to VRChat.
- `npm test`: the same 7 tests fail with and without this change in this cloud session (farm packs and farm setup, and
  the public-safety scan of two Discord Damsel files, need Astra's PC); none are about the map, tools or tricks.

Claude Opus 5.5, 2026-11-03.

## Second pass: Astra's decisions and the merge (2026-11-03)

Astra's decisions of 2026-11-03, in her words:

1. **The face language is the Face Codec** ("Face codec is fine"). It replaces the first pass's working name
   everywhere. She asked for developer-minded names that describe the whole face, not creative ones, so the creative
   names were turned down. Plain part names replace the earlier star words: one moment is a **face frame**, a few
   seconds of one reaction is a **reaction clip**, and its values are **signals**. A codec is an encoder and a decoder: it
   encodes Astra's whole face into signals and decodes signals into Unified Expressions weights.
2. **Two parts** ("I think VRChat AI Astra is a collection of me. It's basically a copy of me, but then Iris uses
   that. ... It's two parts."): **VRChat AI Astra** is the copy of Astra (her recordings, reaction book and persona),
   and **Iris** is the agent who will use that copy and make her own expressions from it. Iris is not built yet ("We
   haven't really made iris yet"), so no code is renamed: the face tools build the copy, so their `ai_astra_*` names
   stay, and the agent in `voice/` keeps its name until Iris is built.
3. **Face-out may change face and eye shapes only** (decision 7 in the-astral-plane's
   `docs/handoff-claude-20261019.md`): the Unified Expressions face shapes, the eyes and gaze; no toggles, no outfits.
   Face-out itself is still not built: `react` is a preview only.
4. **Other people get made-up names** ("just change the names so we know it's the same person, but not use their
   actual name"): one consistent pseudonym per person, never the real name (pseudonymization).
5. **Her OSC problem**: "the overlap between OSC goes burr and VRC face tracking, and about how the porting is can send
   out a lot, but only can receive one at a time." Many apps can send to VRChat's port 9000, but only one app can listen
   on VRChat's output, port 9001 on this PC. The fix is OSCQuery (current VRCFaceTracking uses it; whether OSCGoesBrrr
   does is not checked) or an OSC router such as VRCOSC; `netstat -ano | findstr :9001` shows which program holds the
   port. This is a step on her PC.
6. **Merging**: "just do what you need to do", for merging The Astral Plane's branch and publishing the roadmap.
7. **The roadmap** ("this roadmap looks great. I want to publish it to the README on the astral plane"): Fix the OSC
   overlap, record you, encode it, learn your reactions, build Iris, Iris's face in VRChat. It goes into
   the-astral-plane's README.

What changed in the code (the-astral-plane, `face/` and `skills/clone-session/`): the Face Codec rename
(the module is now `ai_astra_face_codec.py`; `FaceFrame`, `ReactionClip`, `SIGNALS`; the reaction book
keeps `clips`), decision 7 in code (`FACE_OUT_ALLOWED`, the 102 face and eye shapes the decoder keeps), made-up names
on by default (`Player-` and 6 hex digits from a keyed hash, HMAC-SHA256, with the PC's own salt; `--no-pseudonyms`
keeps event types only), and the review fixes: the relay's socket is bound to 127.0.0.1 before it sends, the recorder
warns that Astra's face in VRChat freezes when it stops while relaying, a write error stops it with a plain message,
`learn` skips a session file it cannot read, and the coin-jar script checks the jar before it signs in and keeps
rescued bits. 148 unit tests pass in `face/` (recorder 56, Face Codec 25, reactions 25, quantum coin 27, command line
15), with 28 in `voice/` and 63 in `vrchat-embodiment/`.

Status: merged into the-astral-plane `main` with Astra's OK on 2026-11-03; tested (unit tests); never run against live
VRChat, VRCFaceTracking or a real headset.

In this hub:

- `system-map.json`: the face tool of the first pass is now the **Face Codec** (`face-codec`,
  `the-astral-plane-v1.0-face-codec-v1.0`), and its link from The Astral Plane points to it. The five face nodes and
  their four lines from The Astral Plane are `now`, like the VRChat connector (merged with tests, never run live).
  Each job says it has never run against live VRChat or a real headset and that face-out is a preview only, and names
  the face and eye shapes limit and the made-up names. The face recorder's line to VRChat stays planned until a live
  test, like the connector's, and says the grant for reading VRChat's OSC output and log still waits on Gatekeeper
  Goddess and Astra.
- `npm run build` carried them to TOOLS-AND-TRICKS.md, The Astral Plane's pet program page, its Markdown pet, the
  all-pets file and the System Map page.
- `INTELLIGENCE-LEVELS.md`, Astra Wisp's row: the Face Codec names, merged on 2026-11-03, 148 unit tests, never run live.
- `skills/new-pet-or-tool/SKILL.md`: the face tools row has the Face Codec's label and Astra's OK in chat on
  2026-11-03; the Gatekeeper Goddess grant is still open.

Claude Opus 5.5, 2026-11-03.
