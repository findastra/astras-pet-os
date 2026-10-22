status: open (waiting on Astra: merge findastra/kernel-grove#3, then findastra/astras-pet-os#187; then build and try it)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21
needs: findastra/kernel-grove (README.md, AGENTS.md, kernel-grove-20261021.cs), log-den's contracts/background-pet-20261021.cs, PET-PROGRAM-FRAMEWORK.md section 4 (no tray icon), handoffs/066-any-page-notes-and-tray-20261021.md
---
## What I did

Astra, 2026-10-21, with a screenshot of Task Manager full of "Service Host" rows: "what are all of these programs
running on my task manager? I have been doing a lot of vibe coding lately, I need this to be cleaned up ... Make a tool
for me and decide what pet it goes on for managing task manager and monitoring unnecessary applications. Suggestions
too please."

**The pet:** Kernel Koala (Kernel Grove, #63, "Processes, memory, drivers and OS internals"). Decision row in
`skills/new-pet-or-tool`. Log Lynx only records crashes, File Master only files, Startup Star only starts the farm's pets.

**findastra/kernel-grove#3** (`claude/process-sweep-20261021`, 02e8da2, not merged; the repo is private). Local copy:
`%USERPROFILE%\Documents\Astra's Pet Apps\kernel-grove` (cloned 2026-10-21; it was not on the PC), left on that branch.
- `kernel-grove-20261021.cs` and `build-kernel-grove-20261021.ps1`: a native Windows window, built with the C# compiler
  that ships with Windows, compiling log-den's two contracts from `..\log-den\contracts`. Tabs: At a glance (numbered
  suggestions), Running now (every program grouped by app, coloured keep / your choice / safe to stop, with Stop it),
  Starts at sign-in (switch Astra's own items in StartupApproved, the way Task Manager does), Service Host (what every
  row is). Tools: `kernel-grove-v1.0-process-sweep-v1.0`, `-startup-switch-v1.0`, `-service-host-explainer-v1.0`,
  `-leftover-watch-v1.0`.
- The leftover watch (`--watch`, `--startup`) has **no tray icon and no pop-ups** (card 066's rule): it writes
  `menu-20261021.json` and `mood-20261021.json` in `%LOCALAPPDATA%\astras-pet-os\kernel-grove` (curious when leftovers
  run or memory is above 85%); `--look`, `--tool`, `--quit` reach it through log-den's signals.
- Never stops Windows, security, AI apps, pets, programs running as administrator, or itself and what it runs under;
  checks a program's start time before stopping it; never asks for administrator permission; saved reports have no
  command lines. Every stop, switch and look goes to the farm event log.
- README.md, AGENTS.md, pet.json (tools, levels, data, audit), `.gitignore` (bin/).
- Checked: `bin\kernel-grove-check-20261021.exe --self-test` 67 pass, 0 fail; `--report` on Astra's PC (302 programs);
  `--screenshot` drew all four tabs off screen, looked at; the watch run live on a throwaway data folder in Claude's
  scratchpad (menu and mood written, `--tool` reached it, `--quit` stopped it, events logged). Two bugs found on her PC
  and fixed: the Store's `python3.13.exe` was not seen as Python; programs running as administrator hid their paths
  (now read with QueryFullProcessImageName).

**This hub branch** (`claude/kernel-grove-pipeline-20261021`, findastra/astras-pet-os#187, made in a worktree in Claude's scratchpad with
`core.autocrlf=false`; the live hub folder stayed on `main`), done the way Linux Penguin moved (0a472d4):
- pet-programs.json #63 stage pipeline; pets.json pipeline entry (private, hatching, version 0.1.0-20261021, `needs`:
  Windows and log-den; no Startup Star need, since it has no desktop pet).
- system-map.json: the roadmap node `kernel-koala` gives way to the pipeline node (its link to Linux Iceberg moved);
  four tool nodes of program-63; two grants asked for, written only: `kernel-koala-look` (R) and `kernel-koala-stop`
  (W, only on Astra's click); code languages.
- `scripts/desktop-pets-20261011.cs`: Kernel Koala in Startup Star's `BackgroundPets` (exe
  `kernel-grove\bin\kernel-grove-20261021.exe`, started with `--startup`, no alarmed face), with a self-test check.
- INTELLIGENCE-LEVELS.md row; AGENTS.md credit; `npm run build` (its page `apps/pet-programs/kernel-grove-20261018.html`
  and Markdown pet, the grant on every page's R W X panel, the generated docs).
- Checked: `npm test` 284 tests, 283 pass, 0 fail, 1 skipped; `npm run check` OK; the star built in the worktree and
  `desktop-pets-check-20261011.exe <worktree> --self-test` PASS (the live star was not rebuilt or restarted); Kernel
  Grove's page looked at in the browser pane through a temporary local server on the worktree: four native tools, the
  R W X panel, no console errors.

**What Astra's PC showed on 2026-10-21** (for the suggestions): memory 54% of 31 GB; no leftovers at that moment;
93 Service Host rows = 94 Windows services, about 270 MB together (normal); Desktop Window Manager 1.5 GB (high);
MSI Center (10 parts, about 300 MB), Razer Cortex and its Game Manager service, Logitech G HUB's updater and services
still running; Claude 1.3 GB plus 6 open Code sessions about 1 GB; Steam, Opera GX, Opera GX Browser Assistant and Send
to OneNote on at sign-in; Discord Damsel runs from a Codex task folder (`Documents\Codex\2026-10-15\...`), not its repo.
Log Lynx had used about 1,400 s of CPU in 31 hours (its crash-catcher looks every 1.5 s).

## Still open

1. **Astra:** merge findastra/kernel-grove#3, then findastra/astras-pet-os#187 (approval in chat; the assistant merges).
2. **After the merges, on Astra's PC:** in `kernel-grove`, `git switch main` and pull, run
   `build-kernel-grove-20261021.ps1`, open `bin\kernel-grove-20261021.exe`. Rebuild and restart Startup Star from the
   hub folder (card 066 already asks for this after #186) so Kernel Koala's menu appears. The watch does not start at
   sign-in unless Astra asks for it.
3. Pet art for Kernel Koala (costs money; waits on Astra's OK).
4. Not built: drivers and OS internals (the rest of Kernel Koala's job); the core enforcing the tools' ON/OFF.

## Return

Merge with Astra's OK, then set this card done or hand the open items on.
