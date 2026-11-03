# The Astral Plane's face tools in the hub (2026-11-03)

Astra, 2026-11-03: "I want to track my own face tracking data and my reaction to other people or scenarios to convert
that into how the AI should be reacting in VR chat. So I'm going to basically clone myself in VR chat, and then it's
going to build from there." She also asked why AI Astra's small mood shifts would need "truly random quantum bits".

- `system-map.json`: four new native tools of The Astral Plane (#7), state planned:
  `the-astral-plane-v1.0-face-recorder-v1.0`, `the-astral-plane-v1.0-face-translator-v1.0`,
  `the-astral-plane-v1.0-reaction-learner-v1.0` and `the-astral-plane-v1.0-quantum-coin-v1.0`, plus the trick
  `the-astral-plane-v1.0-clone-session-trick-v1.0`, state planned. Five planned lines, linked the way the VRChat
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
- Waiting on Astra: the working names Astralese (the face language, a layer on top of VRCFaceTracking's Unified
  Expressions), constellation (one face snapshot) and comet (one reaction over time); a grant for reading VRChat's OSC
  output and its log, which is not on the map yet; and the-astral-plane's open decision 7 (which expressions AI Astra
  may change) before anything is sent to VRChat.
- `npm test`: the same 7 tests fail with and without this change in this cloud session (farm packs and farm setup, and
  the public-safety scan of two Discord Damsel files, need Astra's PC); none are about the map, tools or tricks.

Claude Opus 5.5, 2026-11-03.
