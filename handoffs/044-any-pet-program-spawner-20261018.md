status: open (waiting on Astra: OK to merge `claude/map-card-program-page-20261019`; pet.json `entry` or a field of its own (task 1); tasks 3 and 4 to do)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: PET-PROGRAM-FRAMEWORK.md (section 3), docs/images/pet-program-page-sketch-20261018.webp, scripts/pet-program-pages-20261018.mjs, test/pet-program-pages-test-20261018.mjs
---
## What I did

Astra, 2026-10-18: "please make sure every single pet app has a pet program spawn page, with just the basics first",
then, with her sketch of the Unity Den: "they need these at a minimum, and more." "Spawn page" is the page the Friendly
Farmer's Pet Program spawner makes (her words in the Startup Star chat that saved the sketch, 2026-10-18).

On branch `claude/pet-program-spawner-20261018` of astras-pet-os, made in a worktree in Claude's scratchpad so the live
hub folder stayed on `main`; **merged into `main` with PR #100 (`f4a90e5`, Astra's OK in chat, 2026-10-18)**:
- **`scripts/pet-program-pages-20261018.mjs`**, the spawner, a tool of The Farm (`the-farm-v1.0-pet-program-spawner-v1.0`).
  It writes `apps/pet-programs/<repo>-20261018.html` for each of the **38** registered and pipeline pets (20 + 18), and
  `apps/pet-programs/pet-program-spawner-20261018.html`, the list. `npm run build` runs it (`scripts/build.mjs`).
- Each page has every module of the sketch, in its place: `<pet>-cyberhome` with the pet and its paired lights, the
  title (program name from pet-programs.json, `V? // <date added>`), `<home>-pet-program-quick-summary` (the
  mini-descriptor), `<pet>-intelligence-levels` holding the four stacked `<pet>-L1-module` to `<pet>-L4-module`,
  `<pet>-session-notes`, `<pet>-emotions` (the sketch's 3×3 layout), `<pet>-clicker-training`,
  `astras-pet-os-unified-footer` and `<pet>-chat` fixed bottom right. Every module collapses.
- **Where the content comes from**, never a second copy: programs, devices, tools, connection boxes and grants from
  `systemMapData` (the System Map); mood lines from `moodKey` (the Farmer's round); pictures from the hub only (A58):
  registered frames, then `desktop-art/desktop-drafts-20261018.json`, then `art/drafts/`, then `art/icons/`.
- **What works in the browser** (saved there only, `astras-pet-os:<home>:*` in localStorage; nothing is sent):
  the paired lights (ON/OFF green or red, maintenance blue or yellow, turning ON again asks first) and the L4 lists
  they feed; the live mood (sad when not opened for two weeks, idle, awake after you use the page, back to idle after
  two quiet minutes); one click on the pet shows the current reminder; session notes with an "about" picker and
  file names go to `<home>-backlog` before anything else, with export to JSON; the chat button.
- `apps/pet-programs/pet-program-page-20261018.css` and `.js`: one copy for every page.
- `system-map.json`: the tool node `pet-program-spawner` (of The Farm), so the map and the Farmer's own page list it.
- Docs: PET-PROGRAM-FRAMEWORK.md (section 3), AGENTS.md, README.md ("Run it"), INTELLIGENCE-LEVELS.md (the
  Farmer's row), `skills/new-pet-or-tool` (decision row), this card and its row.
- **`test/pet-program-pages-test-20261018.mjs`** (11 tests): a page for every animal; the pages equal the spawner's
  output (no hand edits); every module in the sketch's order and collapsible; titles from pet-programs.json; lights
  as named button pairs; every local file exists; pictures only from the hub; pet-written text escaped; the script
  uses textContent and sends nothing; no secret, address or personal path; private pets and repos handled.
- Checked: `npm run build -- --metadata-only` changed only the System Map page (the new tool); `npm test` 151 pass,
  1 skipped (the Pets Board); `npm run check` OK. In the browser pane (a temporary local server): Unity Stable, The
  Farm, Fairy Ring and the list at desktop width, Fairy Ring at phone width; a light switched off and marked yellow
  showed in L4; a note with `<b>` in it was saved as plain text; the chat panel opened; no console errors.
- On Astra's PC: a temporary `spawner-preview-temp` entry was added to `Astra's PetOS\.claude\launch.json` and
  removed after the check; the test note and lights were cleared from that browser. No pet folder was touched.
- **Astra's review, the same evening:** "the modules dont have dashes in the border text sometimes you have a dash at
  the end. and make sure that the emotion bubbles are written with the text border format too. the page is just
  supposed to demonstrate structural things, not actual aesthetic, you were closer before. do not loose all the things
  you had from that other page." Done: no mark after any label (the fold marker is gone; clicking the label folds), each
  emotion bubble has its mood's name in its top border, the emotions are the sketch's 3 by 3 again (one column on a
  phone), labels in a plain monospace font so their hyphens read as hyphens, the cyberhome a plain box, and nothing
  else removed. The test now checks the bubble labels, their order and that no label has a mark after it.

### Task 2: each pet's tools on the map (Claude Opus 5.5, `claude-opus-5-5`, 2026-10-18)

On branch `claude/tools-on-the-map-20261018`, commit `7e87fda` (from `main` at `f4a90e5`; `main` with #101 merged in
at `8af50f2`), [PR #106](https://github.com/findastra/astras-pet-os/pull/106), **merged into `main` as `346cb18`** (Astra's OK
in chat, 2026-10-19, after `main` with #102, #107 and #108 was merged in and the pages rebuilt); made in a worktree in
Claude's scratchpad:
- **`system-map.json`: 60 new `type: "tool"` nodes**, the shape of `pet-privatizer`: `of` the pet's program node,
  `state` `now` for code on the pet's `main` and `planned` for an open pull request or a design, a label, a one-line
  `job` that names where the tool lives. Only tools the pet's repo or the hub's docs name; no name was made up.
  - **Unity Stable (55)**, exactly unity-unicorn's `pet.json` `intelligence_levels.L1` (`main` at `d485db9`, the same
    lists as `docs/unity-unicorn-page-modules-20261018.md`): the **34 on `main`** (`now`; each job is the first
    sentence of its `tools/*.json` catalog, run-unity-tool's from its script) and the **21 not merged** (`planned`):
    18 in PR #1 (8 with a catalog file; for the 10 that are only in the Unity menu, the job comes from their C# code),
    glass-animal-tool and bubble-chair-blower in PR #3, and asset-ledger (design only). Labels
    `unity-stable-v1.0-<tool>-v1.0`. Dubstep Gunsmith's catalog file in PR #1 is a program, not a tool, so it is not
    here.
  - **The Farm:** `pet-finder` (`now`, `scripts/pet-finder-20261016.mjs`), `the-farm-v1.0-pet-finder-v1.0`.
  - **GitHub Aquarium:** `flash-audit` (`now`; `github-aquarium-v1.0-flash-audit-v1.0`, its code is in this hub) and
    `project-image-generator` (`now`; on github-goldfish `main`, `scripts/project-image-generator-20261017.mjs`).
  - **File Kingdom:** `mass-delete` (`planned`: only its guard exists, `scripts/mass-delete-guard-20261016.mjs`), with
    the label the docs give it, `file-master-v1.0-mass-delete-v1.0`. And **repo-catcher** and **new-programs-watch**
    changed from `planned` to `now`: both scripts are on file-master `main`.
  - **Chat Stack:** `save-missing` (`now`, chat-rat `chat-rat-20261016.mjs`), `chat-stack-v0.1.0-save-missing-v0.1.0`
    (its own pet.json writes `chat-rat-v0.1.0-…`, with the repo name in place of the program's).
- `npm run build -- --metadata-only` then changed only the System Map page and five spawn pages (Unity Stable, The
  Farm, GitHub Aquarium, File Kingdom, Chat Stack). `npm test`: 153 tests, 152 pass, 1 skipped (the Pets Board).
  `npm run check` OK.
- In the browser pane (a temporary `tools-on-the-map-temp` entry in `Astra's PetOS\.claude\launch.json`, removed
  after): Unity Stable's L1 module lists all 55 under "Your tools", the 21 not merged with grey lights and "planned";
  the other four pages list theirs; the System Map draws the new hammers on ring 3 with no console errors.
- Left out on purpose: harness-strapper (an example in TOOLS-AND-TRICKS.md and the framework, no code); Discord
  Tower's two presence apps (its pet.json calls them tools, the map already has them as programs); File Master's
  scanner, plan and undo scripts (INTELLIGENCE-LEVELS.md calls them tools, but they have no tool names); Chat Rat's
  per-question search tools (made at run time). sticker-manager and cli-proxy-api stay `planned` (merged, never
  installed or run), as their nodes already say.

### Native programs, native tools, native tricks (Claude Opus 5.5, `claude-opus-5-5`, 2026-10-19)

Astra, 2026-10-19, after #106: "i dont want to see each pets tools on the system map that sounds like too many", then
"make the tools section collapsable on each node. dont show on the system map at all, unless we are calling it a native
program. native tool, native trick. there should be a difference between the two. make those distinctions on the
tools/programs/tricks we have already created. make sure that the entire tool trick and program registry is a table on
github." On branch `claude/tools-on-cards-20261019` (from `main` at `1ef9306`), [PR #114](https://github.com/findastra/astras-pet-os/pull/114), **merged as `5de6f23`** (Astra's OK in chat, 2026-10-19):
- **The map draws no tool or trick.** Each pet program's card (and its pet's card) lists its native tools and native
  tricks in two sections that fold, closed until clicked; search finds them through their pet program; a line that
  started at a tool is drawn from its pet program, marked "via" the tool. The key's hammer is gone
  (`scripts/system-map-template-20261012.html`).
- **The three kinds** are defined in TOOLS-AND-TRICKS.md, PET-PROGRAM-FRAMEWORK.md (section 1), `skills/dev-mindset`,
  `skills/new-pet-or-tool` and an ASTRAS_PET_OS.md amendment. Applied to what exists: **Startup Star and the System
  Map** are native programs of The Farm (opened on their own; still drawn, still on ring 0); **vcc-package-manager and
  vrchat-avatar-upload** are native tricks of Unity Stable (no code, planned until written as skill files); **9 new trick
  nodes** (`type: "trick"`, 11 in all) for the skill files the pets' repos hold: The Farm's handoff, pet-finder and pet-organizer;
  Unity Stable's make-a-prop-look-real (and its two tricks to write); Discord Tower's dm-cleanup; Chat Stack's
  save-chats and ask-chat-rat. data-dealer is private, so its skills stay out.
- **The registry table** in TOOLS-AND-TRICKS.md, generated by `npm run build` (`partsTable` in
  `scripts/system-map-20261012.mjs`): every native program, tool and trick, and every third-party program a pet program
  runs, by pet program.
- The spawn pages read tricks from the map data (L2 "Your tricks"), so Unity Stable, Discord Tower and Chat Stack now
  list theirs; the Idle Flash Audit skips trick nodes when it looks for a pet's own node.
- Two new tests in `test/system-map-test-20261012.mjs`. Card 044's task 2 is marked done (#106, `346cb18`).

## Not there yet (the pages say so)

- **Tools:** a page lists what is on the map. After task 2, pets other than The Farm, Unity Stable, GitHub Aquarium,
  File Kingdom, Chat Stack, Discord Tower, API Fairy Ring, Am I a Ghost? and Workflow Whirlpool list none, because
  neither their repo nor the hub names a tool. A tool in an open pull request shows "planned", not "not merged" as the
  framework asks; its job says which pull request. No pet.json has `intelligence_levels` in the hub, and no audit
  compares a pet's tool files with the map yet.
- **Versions:** the hub records no pet program version, so titles read `V? // <date added>`.
- **Status:** the Farmer's last merged round on `main` is from 2026-10-11 and used the old mood meanings, so pages
  show only its line and date, never its mood.
- **Apps:** 16 pipeline pets have no `interface_url` in pets.json, so "No app wired up yet", though most have a page
  in their own repo.
- **Pictures:** Role Fairy has none; Claude Bot shows his icon only (his real art is private).
- **Not built:** the desktop pet docking into the cyberhome, ON/OFF enforced by the core, the chat bot, approve and
  decline, agent keys, the weekly backlog run, saving attached files themselves.
- **Not linked yet** from the System Map cards, the Farmer's desk, the desktop pets' double-click, pet.json `entry` or
  the profile: A59 says every place that shows a pet links one program page, and today that is still each pet's app.

## Task

1. ~~Astra decides which page a pet's double-click and A59 point at.~~ **Answered by Astra, 2026-10-18:** "the clicker
   training first 2 clicks are the same across the board, and starting at 3 they can be tool assigned. so 1 click shows
   the current reminder dialog box (blurb like BSOD does) which has yet to be created as a compoinent, and, 2 clicks
   opens/closes the pet program." Two clicks open or close the pet program, its page (the spawn page; "Open today's
   app" stays on it). The pages and the framework say so (branch `claude/clicker-rule-20261018`); the desktop part is
   card 046 (Codex). **Done on branch `claude/program-page-links-20261019`** (Astra, 2026-10-19: "yes one click always
   points to program page (Pet Program)"): pets.json `interface_url` and `interface_local_url` are each pet's program
   page and today's app is `app_url`; the README's **Pet Program** links, the profile round's home link, the Farmer's
   desk, the Pets Board, the desktop draft list and A59 follow it. pet.json `entry` stays the app in the pet's own repo.
   **The map card too** (Astra, 2026-10-19: "every place that shows a pet (pets.json interface_url, pet.json entry, the
   profile home link, the map card) opens its spawn page, with Open today's app on it"): each pet's card and its pet
   program's card on the System Map link the program page, from pets.json `interface_url` (branch
   `claude/map-card-program-page-20261019`). **pet.json `entry` waits on Astra:** it is the start file in the pet's own
   repo, which the Farmer's round, Flash Audit A09 and A59 check as a file there; a field of its own (`homepage`, as in
   package.json) can hold the program page without breaking them. Either way it is a pull request in each pet repo.
2. ~~Put each pet's tools on the map (`system-map.json` tool nodes with `of` = its program), starting with Unity
   Unicorn from the modules doc; the pages follow on the next build.~~ Done in PR #106
   (above), merged as `346cb18` on 2026-10-19. When unity-unicorn PR #1 or #3 merges, change those tools to `now`.
3. Record each pet's version (from its pet.json) where the build can read it, so the title shows it.
4. Add `interface_url` for the pipeline pets whose repo has a working page.

## Done when

Every pet's double-click and A59 links open its program page, and each page lists the pet's real tools and version.

## Return

Update `## What I did` with each change and its commit, set `status: done`, commit on a branch.
