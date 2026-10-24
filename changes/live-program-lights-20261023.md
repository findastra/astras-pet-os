# Live program lights (2026-10-23)

Astra, 2026-10-23: "most of my vrchat programs are launched right now and I am not seeing the green lights lighting up
on the pet program. lets fix all of those right now on rift rabbit."

- A 3rd party program's ON/OFF light on every pet program page is green while Kernel Koala's program-watch sees it open
  and red when it does not, even when the pet's own link to it is only planned (before, "planned" kept it red).
- The page reads `Documents\Astra's PetOS Data\kernel-grove\programs-page-data.js` again every five seconds, only when
  it is opened on this PC; a list older than a minute counts as nothing open.
- Kernel Koala now watches the VR programs too and writes that file (findastra/kernel-grove, branch
  `claude/vr-program-lights-20261023`).
- The light does not open or close a program yet: that is card 054's decision.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-23.
