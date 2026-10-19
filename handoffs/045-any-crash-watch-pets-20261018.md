status: open (waiting on Astra: merge the four pull requests, in order; pet art)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: findastra/log-den, findastra/packet-river and findastra/evidence-locker on `claude/build-20261018`; this card's branch `claude/crash-watch-pets-20261018`
---
## Why

At 12:49 on 2026-10-18 a .NET "Unhandled exception" window appeared on Astra's desktop and closed before anyone could
read its Details. Astra asked which pet it was reported to: none, because Log Lynx, Forensic Ferret and Packet Piranha
were roadmap pets with no code. It took a chat an hour of matching screenshot times against other sessions' scratch
folders to find that it was a test copy of the desktop pets run by the "Astra's PetOS - Installation Kit" session (the
WriteStatus null reference fixed in #88). Astra then asked: "build all of these and the infrastructure they need to
monitor this crash ... show me the pet programs, then I will let you know if to push".

## What I did

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18, chat "Astra's PetOS - Network Issue". Pushed on Astra's OK in chat ("Push the four branches and open one pull request per repo"); nothing is merged.

**Pull requests, in merge order:** 1. [log-den#2](https://github.com/findastra/log-den/pull/2) · 2. [packet-river#2](https://github.com/findastra/packet-river/pull/2) · 3. [evidence-locker#2](https://github.com/findastra/evidence-locker/pull/2) · 4. [astras-pet-os#105](https://github.com/findastra/astras-pet-os/pull/105) (this branch). #101, #102 and #103 touch some of the same lines: whichever merges second needs `main` merged in.

**Three pet programs, each a Windows tray program built on the PC by the C# compiler that ships with Windows, with a
console build for checks, and a pet program page with every module of Astra's 2026-10-18 sketch:**

| Repo | Branch, commit (pushed) | Tools | Self-test |
|---|---|---|---|
| log-den (Log Lynx, #48) | `claude/build-20261018`, `9048875` | crash-catcher, windows-log-reader, heartbeat-checker, farm-event-log (`contracts/farm-event-v1-20261018.cs` and `.schema.json`) | 38 pass |
| packet-river (Packet Piranha, #53) | `claude/build-20261018`, `4b77cc7` | ping-sampler, dns-checker, reach-checker, route-tracer, link-watcher | 20 pass |
| evidence-locker (Forensic Ferret, #70) | `claude/build-20261018`, `7cdd1ab` | case-opener, evidence-collector, custody-log, timeline-builder | 22 pass |

- **The infrastructure:** the farm event log, one JSON-lines record format (`astras-pet-os-farm-event-v1`) that every
  pet program writes to `%LOCALAPPDATA%\astras-pet-os\<pet-program>\events-YYYYMMDD.jsonl`. One copy, in log-den;
  Packet River's and Evidence Locker's build scripts compile it from `..\log-den\contracts\` (one tool, one owner).
  Records stay on the PC (paths, command lines, addresses) and are never committed.
- **How the crash is caught:** Log Lynx looks at every top-level window every 1.5 s. On a .NET crash window it presses
  **Details** only (Windows creates the stack-trace text only when it is shown; UI Automation cannot see it from the
  Claude app) and never Continue or Quit; it reads the text with WM_GETTEXT, takes a PrintWindow picture (DPI-aware),
  and records the process from WMI with its SHA-256. A "crash-dialog-closed" record says when the window went away.
- **This hub, branch `claude/crash-watch-pets-20261018`** (worktree in the chat's scratchpad; Astra's live hub folder was
  not touched): `pet-programs.json` stage roadmap → pipeline for #48, #53, #70; three `pipeline` entries and four
  relations in `pets.json`; `system-map.json`: the three roadmap nodes removed (the pipeline pets' nodes replace them,
  ids `log-den`, `packet-river`, `evidence-locker`; their four old links and hat colours moved over), three grants asked
  for (`log-lynx-watch` R, `packet-piranha-probe` X, `forensic-ferret-read` R, all **written only**: the programs run as
  Astra), and their code languages; three rows in `INTELLIGENCE-LEVELS.md` and its counts; three decision rows in
  `skills/new-pet-or-tool`; two glossary rows in `skills/dev-mindset` (farm event log, chain of custody); a credit line
  in `AGENTS.md`; this card and its rows (next free number 046). Generated files rebuilt with `npm run build`. The branch
  was rebuilt on `main` after #100 (the pet program spawner) merged: the spawner now also writes basic pages for the
  three in `apps/pet-programs/`, and every pet's spawned page lists Log Lynx's and Forensic Ferret's read grants under
  "Who may reach it" (they read every pet's farm events).

**Tested on Astra's desktop PC** (data in the chat's scratchpad with `--data`, never `%LOCALAPPDATA%`; Astra's real
desktop pets, PID 1960, were never touched):
- The real crash, reproduced: the hub at `0bf2d4e` (before #88) in a scratch worktree, `pets.json` without Voicemeeter
  Bug, built and run with `--test-ui`. Log Lynx caught `desktop-pets-20261008 crashed: System.NullReferenceException in
  AstraDesktopPets.PetsWindow.WriteStatus` about 4 s after it appeared, with the whole stack trace and a whole picture.
  Packet Piranha sampled every 20 s (all fine). Forensic Ferret opened case C-20261018-001 a minute later on its own:
  "It was a test copy in a Claude Code session's work folder. Claude Code session "Astra's PetOS - Network Issue"
  (093fba70) ran it"; network fine; chain of custody intact. The scratch test copy was stopped by PID after each run.
- The 12:49 crash after the fact: `evidence-locker --case-at 2026-10-18T12:49:34` found Astra's Greenshot capture at
  12:49:34 and named "Astra's PetOS - Installation Kit" (cab544b7, 105 files changed, test installs) as the place to
  start: the same answer the chat found by hand, in 2 s.
- `--crash-demo` (a window that crashes on purpose) is caught the same way.
- Pages checked in headless Edge at desktop and phone width: every module in the sketch's order, live data, no overflow.
- Privacy: `findSensitive` from `scripts/public-safety-20261014.mjs` over all 32 files of the three repos: 0 flagged.
- Hub, on `main` at `f4a90e5` plus this branch: `npm run build` OK; `npm test` 153 tests, 152 pass, 0 fail, 1 skipped;
  `npm run check` OK.

## Task

1. ~~Push and open the pull requests~~ done 2026-10-18 (above).
2. **Astra:** merge (each pet's pull request, then this hub's). Until the hub merges, the pets are roadmap pets that work.
3. **Astra:** pet art for Log Lynx, Packet Piranha and Forensic Ferret (paid; prompts not written yet). Until then the
   pages show a text face and the tray shows a small drawn icon.
4. After the push, replace the measured code languages in `system-map.json` with GitHub's.
5. Later (not asked for yet): Startup Star or the installer starting the three at sign-in; the Farmer watching Log
   Lynx's heartbeat (the relation is `planned`); Cipher Owl signing cases; a crash ticket to the vet-clinic.

## Done when

The four pull requests are merged, the three pets show on the System Map as pipeline pets, and Astra has run them from
her own Start menu or Explorer (so they use the real `%LOCALAPPDATA%`).

## Return

Update `## What I did` with the pushes, pull requests and merges; set `status: done`.
