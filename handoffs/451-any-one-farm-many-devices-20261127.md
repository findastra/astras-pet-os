# 451: One farm across all your devices, every pet once

status: open, waits on Astra: merge hub #451 (docs only); then steps 1 to 5 below, one pull request each, each with her OK
for: any
implementer: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27
reviewer: Astra

Astra, 2026-11-27, with a home server (the GEEKOM) next to her desktop PC: "We dont want duplicate pets right? This
Pet OS is being designed so pets can live across devices in a unified group of devices right? That only makes
sense." Then "Yes, start step 1" (the words-first pull request).

## What I did

- Hub #451 (`claude/one-farm-many-devices-20261127`), docs only: the 2026-11-27 amendment at the top of
  `ASTRAS_PET_OS.md`, glossary rows in `skills/dev-mindset/SKILL.md`, section 3 of `skills/farm-security/SKILL.md`,
  `AGENTS.md`, `MAKE-IT-YOURS.md` and `docs/migration/PLAN.md`. Details:
  [changes/one-farm-many-devices-20261127.md](../changes/one-farm-many-devices-20261127.md).
- Checks: `npm test` on the branch: 536 tests, 530 pass, 0 fail, 6 skipped.
- Found while checking (origin/main `8321cca9`), the parts that still treat one computer as one farm:
  - `linux/astras-pet-os-20261019.sh` makes a new farm in `~/.local/share/astras-pet-os` on any Linux computer.
  - Startup Star (`scripts/desktop-pets-20261011.cs`) starts every `server` in `pets.json` on the PC it runs on.
  - `pets.json` has `needs.os` (where a pet can run) but nothing for where it runs.
  - The farm lock lives in one install folder.
  - The Friendly Farmer's `role: "host"` (`pets.json` and 10 other files) now collides with real hosts.

## Not done (in this order, one pull request each)

1. **Hosts in the registry.** A list of the farm's hosts (name, OS, what it is for, approved by Astra) and a `host`
   on every pet's `server` in `pets.json`; a test that fails if a server is placed on no host or on two. Names only:
   the hub is public, so no device addresses. Ask Astra whether `role: "host"` becomes `orchestrator` in the same
   pull request (proposed, not decided).
2. **Startup Star starts only what is placed on its own PC** (`BackgroundPets.Servers()`), so a star on a second
   Windows PC can never start a second copy of a pet.
3. **The Linux package joins a farm instead of making one:** a host agent that runs only the servers placed on that
   host. This comes before any part of Astra's PetOS goes on the GEEKOM.
4. **Phase 8 proper:** leases (one copy at a time), heartbeats, "runs on" on the Farm's cards, the farm lock listing
   hosts, and PLAN decision 6 (where the Farm itself runs), best decided after the GEEKOM's Ubuntu install.
5. **After #451 merges:** install the two changed skills (dev-mindset, farm-security) in both seats with Luna's
   Log's `skill-install-tool`.

## Rule until then

Never install Startup Star or the Linux package on the GEEKOM or on any other of Astra's devices. Working on the
GEEKOM over SSH (the Astra Wisp setup) installs no pets.
