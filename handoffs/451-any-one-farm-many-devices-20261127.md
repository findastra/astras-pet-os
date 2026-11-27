# 451: One farm across all your devices, every pet once

status: open. #451 merged 2026-11-27 (039db1e7) and its two skills installed; step 1 is hub #NEWPR, waiting on Astra's merge; steps 2 to 4 next, one pull request each, each with her OK
for: any
implementer: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27
reviewer: Astra

Astra, 2026-11-27, with a home server next to her desktop PC: "We dont want duplicate pets right? This Pet OS is
being designed so pets can live across devices in a unified group of devices right? That only makes sense." Then
"Yes, start step 1" (the words-first pull request), "Yes, merge #451", and "Yes, start it" (step 1 below).

Devices in this hub are named by their kind only ("Desktop PC", "Home server"), never a model, computer name or
address (PROTECTION-RINGS.md, known gap 12); the details are in White Hat Weasel's private `devices.md`.

## What I did

- Hub #451 (`claude/one-farm-many-devices-20261127`), docs only, **merged 2026-11-27** as `039db1e7`: the 2026-11-27
  amendment at the top of `ASTRAS_PET_OS.md`, glossary rows in `skills/dev-mindset/SKILL.md`, section 3 of
  `skills/farm-security/SKILL.md`, `AGENTS.md`, `MAKE-IT-YOURS.md` and `docs/migration/PLAN.md`. Details:
  [changes/one-farm-many-devices-20261127.md](../changes/one-farm-many-devices-20261127.md). `npm test` on the
  branch: 536 tests, 530 pass, 0 fail, 6 skipped. dev-mindset and farm-security installed in both seats with Luna's
  Log's `skill-install-tool` right after the merge.
- Hub #NEWPR (`claude/pet-hosts-20261127`), step 1: `hosts` in `pets.json` (only `windows-pc`, the System Map's
  "Desktop PC", for now) and `"host": "windows-pc"` next to all 10 `server` lines; `test/pet-hosts-test-20261127.mjs`.
  Details: [changes/pet-hosts-20261127.md](../changes/pet-hosts-20261127.md).
- Found while checking (origin/main `8321cca9`), the parts that still treat one computer as one farm:
  - `linux/astras-pet-os-20261019.sh` makes a new farm in `~/.local/share/astras-pet-os` on any Linux computer.
  - Startup Star (`scripts/desktop-pets-20261011.cs`) starts every `server` in `pets.json` on the PC it runs on.
  - `pets.json` had `needs.os` (where a pet can run) but nothing for where it runs (fixed by step 1).
  - The farm lock lives in one install folder.
  - The Friendly Farmer's `role: "host"` (`pets.json` and 10 other files) now collides with real hosts.

## Not done (in this order, one pull request each)

1. ~~**Hosts in the registry.**~~ Hub #NEWPR. Left from it: Astra's answer on whether `role: "host"` becomes
   `orchestrator` (proposed, not decided; its own pull request if yes). The home server joins `hosts` when it has a
   System Map node (draft #384 adds a "Home server" node) and something is placed on it.
2. **Startup Star starts only what is placed on its own PC** (`BackgroundPets.Servers()`), so a star on a second
   Windows PC can never start a second copy of a pet. It needs to know which host it is: a local setting outside
   the repo, never a computer name in the hub.
3. **The Linux package joins a farm instead of making one:** a host agent that runs only the servers placed on that
   host. This comes before any part of Astra's PetOS goes on the home server.
4. **Phase 8 proper:** leases (one copy at a time), heartbeats, "runs on" on the Farm's cards, the farm lock listing
   hosts, and PLAN decision 6 (where the Farm itself runs), best decided after the home server's Ubuntu install.
5. ~~**After #451 merges:** install dev-mindset and farm-security.~~ Done 2026-11-27. After #NEWPR merges, install
   them again (both change in it).

## Rule until then

Never install Startup Star or the Linux package on the home server or on any other of Astra's devices. Working on
the home server over SSH (the Astra Wisp setup) installs no pets.
