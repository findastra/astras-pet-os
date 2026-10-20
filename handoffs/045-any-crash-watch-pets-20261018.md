status: done 2026-10-19 (Astra's call in chat): built, merged (#105), started at sign-in, and registered with draft pet art; left for Astra: approving the drafts
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: findastra/log-den, findastra/packet-river and findastra/evidence-locker on `main` (built from `claude/build-20261018`), cloned side by side in `%USERPROFILE%\Documents\Astra's PetOS`; this card's branches `claude/crash-watch-pets-20261018` (#105) and `claude/crash-watch-sign-in-20261019`
---
## Why

At 12:49 on 2026-10-18 a .NET "Unhandled exception" window appeared on Astra's desktop and closed before anyone could
read its Details. Astra asked which pet it was reported to: none, because Log Lynx, Forensic Ferret and Packet Piranha
were roadmap pets with no code. It took a chat an hour of matching screenshot times against other sessions' scratch
folders to find that it was a test copy of the desktop pets run by the "Astra's PetOS - Installation Kit" session (the
WriteStatus null reference fixed in #88). Astra then asked: "build all of these and the infrastructure they need to
monitor this crash ... show me the pet programs, then I will let you know if to push".

## What I did

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18 and 2026-10-19, chat "Astra's PetOS - Network Issue". Pushed on Astra's OK in chat ("Push the four branches and open one pull request per repo"), merged on her OK of 2026-10-19 ("Merge log-den#2, packet-river#2 and evidence-locker#2 now, then astras-pet-os#105 once its CodeQL checks pass").

**Pull requests, in merge order:** 1. [log-den#2](https://github.com/findastra/log-den/pull/2), merged as `5e0af07` · 2. [packet-river#2](https://github.com/findastra/packet-river/pull/2), merged as `eb3b2e0` · 3. [evidence-locker#2](https://github.com/findastra/evidence-locker/pull/2), merged as `502eb99` · 4. [astras-pet-os#105](https://github.com/findastra/astras-pet-os/pull/105) (this branch). `main` was merged into this branch twice while it waited: #101 (every grant kept; this branch's are 15 to 17), then #80, #102, #106, #107 and #108 (both sides of AGENTS.md, the decision table and the card table kept; card numbers from `main`, next free 047). Following #106, the three pets' 13 tools are tool nodes of their pet programs on the System Map (`program-48`, `program-53`, `program-70`), so the spawned pages list them; the code languages are GitHub's (2026-10-19).

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

**Started at sign-in, 2026-10-19** (Claude Opus 5.5, `claude-opus-5-5`, a side session started from the crash-watch
chat; branch `claude/crash-watch-sign-in-20261019`). Astra chose the method in chat: "Yes: clone log-den, packet-river
and evidence-locker into Documents\Astra's PetOS, build them there, and add the three Startup-folder shortcuts."
- **Cloned** the three on `main`, side by side, in `%USERPROFILE%\Documents\Astra's PetOS\` (log-den `874daa1`,
  packet-river `e00f80a`, evidence-locker `39e1f8c`). Built each there with its `build-<repo>-20261018.ps1`;
  `bin\<repo>-check-20261018.exe --self-test --data <scratch folder>`: 38, 20 and 22 pass, 0 fail. `bin\` is ignored by
  Git, so the working trees stay clean.
- **Three shortcuts in Astra's Startup folder** (`shell:startup`): `Astras PetOS Log Den.lnk`,
  `Astras PetOS Packet River.lnk` and `Astras PetOS Evidence Locker.lnk`. Each one starts
  `%USERPROFILE%\Documents\Astra's PetOS\<repo>\bin\<repo>-20261018.exe` with no arguments, in its repo folder. This is the
  real Startup folder: a chat's writes to Roaming AppData are not redirected (nothing under the Claude package's
  `LocalCache\Roaming`; the Discord Presence `.vbs` files written from a chat on 2026-10-17 are there too). The path
  uses the name `Astra's PetOS` (a junction today), so the planned folder rename keeps them working.
- **Why this way** (Astra picked it from three): Explorer starts them as Astra when she signs in, so their records land
  in the real `%LOCALAPPDATA%\astras-pet-os\`. No code changed; each README already suggested a Startup-folder
  shortcut. They do not depend on Startup Star, which is never the pets' execution engine (ASTRAS_PET_OS.md) and
  restarts often (rebuilds, live sync, its 10-minute check). To turn one off: Task Manager → Startup apps, or delete its
  shortcut. **Not chosen:** Startup Star starting them (its source is Codex's, and a star started from a chat would start
  them inside that app's private AppData), and an installer checkbox (they are not in the installer, and Astra's PC runs
  them from the repo folders).
- **Limits:** they start once per sign-in. One that quits or crashes stays off until the next sign-in or a double-click.
  A repeating check like the star's needs a quiet `--startup` flag in each program first: today a second copy opens
  its page in the browser (`if (!created) ... OpenPage()`). To rebuild one, quit it from its tray menu first. Live sync
  fast-forwards the three folders but does not rebuild `bin\`.
- **Not started by me:** a program started from a chat runs inside the Claude app's private `%LOCALAPPDATA%`. Before
  Astra's first start, the `%LOCALAPPDATA%\astras-pet-os\` seen from a chat was the Claude app's private copy, with an
  empty `log-den\`, so there were no real records yet.
- `INTELLIGENCE-LEVELS.md`: the three rows link to `main`, say merged 2026-10-19 and set to start at sign-in, and lose
  the "on a branch, not merged" error; the level 2 summary says the same.

**Pet art and registration, 2026-10-19** (Claude Opus 5.5, `claude-opus-5-5`, the crash-watch chat; hub branch
`claude/crash-watch-art-20261019`, and `claude/crash-watch-art-20261019` in each pet repo). Astra in chat: "Yes: write the
three art prompts, generate their mood sheets on my OpenAI account, show me the drawings, then finish them like Python
Panther (registered, desktop pets, icons, README pictures)."
- **First start, before the art:** the three were started through Explorer (so as Astra's own programs, writing to the
  real `%LOCALAPPDATA%\astras-pet-os\`; checked: nothing in the Claude package's copy). Log Lynx's Windows-log reader at
  once found a real crash from that night (`Unity.ILPP.Trigger`, Unity 2022.3.22f1, 01:24).
- **Prompts** in `scripts/generate-pets.mjs` (palettes no other pet uses): `log-lynx` (an electric-teal lynx with navy
  spots and tangerine ear tufts, holding a lime logbook), `packet-piranha` (an aqua-cyan piranha with a crimson belly,
  lemon fins and a toothy underbite), `forensic-ferret` (a golden-yellow ferret with a violet bandit mask, holding a hot
  pink magnifying glass). **Three images generated** on Astra's OpenAI account through the image bridge:
  `art/sheets/<art>-20261019.png`. Each checked by eye: one body in nine cells, grey background, black outline, no drawn
  symbols. Drafts until Astra approves them.
- **Registered:** `pets.json` moves the three from `pipeline` to `pets` (`art`, `asset_date` 20261019, kinds `cat`,
  `fish` and `dog`, one-click `interface_url` = their pet program pages, `app_url` = their repo's Run it), and the three
  are friends in `cage_life` (they hang out on the desktop); `pet-programs.json` stage registered; INTELLIGENCE-LEVELS.md
  rows registered with their icons. `npm run build`: 9 frames each in `art/frames/<art>/`, the roster (23 pets), the
  README table, the spawned pages, the System Map and the Markdown pets.
- **Icons:** `art/icons/<repo>-20261012.png` from `scripts/make-icons-20261012.mjs` (the script also refreshed six other
  pets' icons and added two new ones; those were left out on purpose, for their own change), and a Windows app icon each,
  `art/app-icons/<repo>/<repo>-icon-20261019.ico` (16 to 256 px; classic bitmaps below 256 so .NET reads them), made from
  the idle frame.
- **The desktop pets** show every registered pet from its frames (desktop art is optional), so the three join the desktop
  once Startup Star restarts with this `pets.json`. `scripts/desktop-pets-20261011.cs` (Codex's) is unchanged.
- **Each pet repo** (v0.1.1): its page shows the art (the hub folder next to it, else GitHub, else a text face), the tray
  uses the hub's app icon, the build embeds it when the hub sits next to the repo, the README has a Pictures section
  (`docs/images/<repo>-program-page-20261019.png`, demo data, paths shown as %USERPROFILE%) and says registered with draft
  art. Self-tests 38, 20 and 22 pass; `findSensitive` over the three repos: 0 flagged.

**A quiet `--startup`, 2026-10-19** (Claude Opus 5.5, `claude-opus-5-5`, a side session of the sign-in chat; branch
`claude/startup-flag-20261019` in each pet repo). Pushed and opened on Astra's OK in chat; each merge waits on her OK.
- [log-den#9](https://github.com/findastra/log-den/pull/9), [packet-river#9](https://github.com/findastra/packet-river/pull/9)
  and [evidence-locker#9](https://github.com/findastra/evidence-locker/pull/9) (v0.1.2, open): with `--startup`, a copy
  started while one for the same data folder runs exits with 0 and opens nothing (Packet River and Evidence Locker also
  skip rewriting the page's data). Without it a second start opens the page, as before. The single-copy name is
  unchanged. Self-tests 43, 25 and 27 pass (five new checks each); a `--startup` copy run while a scratch folder's mutex
  was held exited with 0 and made no page folder. No startup entry was added or changed.
- **After they merge:** each running copy keeps 0.1.1 until Astra quits it from its tray menu,
  `build-<repo>-20261018.ps1` runs in its folder in `Documents\Astra's PetOS`, and she starts it again from its Startup
  shortcut. Live sync does not rebuild `bin\`.
- **A repeat check that uses it** (Astra's decision, not built): only after that rebuild (an older build ignores the
  flag and opens the page); one scheduled task per pet (a task's actions run one after another, and a tray program never
  ends); as Astra with "Run only when user is logged on" (the mutex is per sign-in session and the data folder is her
  `%LOCALAPPDATA%`), started by Windows and never from a chat; `--startup` on every start, the three shortcuts included,
  or the task replaces them; logon, unlock and every 10 minutes with IgnoreNew, like the star's. It restarts a pet that
  quit or crashed (the mutex ends with the process), not a hung one, and a pet quit from its tray comes back at the next
  check.

## Task

1. ~~Push and open the pull requests~~ done 2026-10-18 (above).
2. ~~Merge~~ the three pets merged 2026-10-19; this hub pull request merges once CodeQL passes (Astra's OK).
3. ~~Pet art~~ generated 2026-10-19 (above). **Astra:** approve the three drafts, or say which to redraw (with `--match`).
4. ~~Code languages from GitHub~~ done 2026-10-19.
5. ~~Starting the three at sign-in~~ done 2026-10-19 on Astra's PC with Startup-folder shortcuts (above).
   **Astra:** start them once: double-click the three `Astras PetOS …` shortcuts in `shell:startup`, or sign out and
   in. Then three tray icons show (a purple lynx, a cyan piranha, a yellow ferret).
6. Later (not asked for yet): the installer offering the same to beta testers; ~~a quiet `--startup` flag~~ in the
   three #9 pull requests (above; merging waits on Astra); a repeat check that restarts a pet that quit (Astra's
   decision; how, above); the Farmer watching Log Lynx's heartbeat (the relation is `planned`); Cipher Owl signing
   cases; a crash ticket to the vet-clinic.

## Done when

The four pull requests are merged, the three pets show on the System Map as pipeline pets, and Astra has run them from
her own Start menu or Explorer (so they use the real `%LOCALAPPDATA%`).

## Return

Update `## What I did` with the pushes, pull requests and merges; set `status: done`.
