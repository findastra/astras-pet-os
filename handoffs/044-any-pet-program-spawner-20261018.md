status: open (waiting on Astra: OK to merge; which page a pet's double-click opens)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: PET-PROGRAM-FRAMEWORK.md (section 3), docs/images/pet-program-page-sketch-20261018.webp, scripts/pet-program-pages-20261018.mjs, test/pet-program-pages-test-20261018.mjs
---
## What I did

Astra, 2026-10-18: "please make sure every single pet app has a pet program spawn page, with just the basics first",
then, with her sketch of the Unity Den: "they need these at a minimum, and more." "Spawn page" is the page the Friendly
Farmer's Pet Program spawner makes (her words in the Startup Star chat that saved the sketch, 2026-10-18).

On branch `claude/pet-program-spawner-20261018` of astras-pet-os (not on `main`; its pull request is linked from the
commit), made in a worktree in Claude's scratchpad so the live hub folder stayed on `main`:
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
- On Astra's PC: a temporary `spawner-preview-temp` entry was added to `Astra's Pet Apps\.claude\launch.json` and
  removed after the check; the test note and lights were cleared from that browser. No pet folder was touched.
- **Astra's review, the same evening:** "the modules dont have dashes in the border text sometimes you have a dash at
  the end. and make sure that the emotion bubbles are written with the text border format too. the page is just
  supposed to demonstrate structural things, not actual aesthetic, you were closer before. do not loose all the things
  you had from that other page." Done: no mark after any label (the fold marker is gone; clicking the label folds), each
  emotion bubble has its mood's name in its top border, the emotions are the sketch's 3 by 3 again (one column on a
  phone), labels in a plain monospace font so their hyphens read as hyphens, the cyberhome a plain box, and nothing
  else removed. The test now checks the bubble labels, their order and that no label has a mark after it.

## Not there yet (the pages say so)

- **Tools:** only tools that are nodes on the System Map show. Unity Unicorn's 30-odd tools are only in
  `docs/unity-unicorn-page-modules-20261018.md`; most pets list none. No pet.json has `intelligence_levels` in the hub.
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
   card 046 (Codex). Still to do here: point A59's other places (pets.json `interface_url`, pet.json `entry`, the
   profile home link, the map card) at the program page, with Astra's OK, since it changes every "Open app" link.
2. Put each pet's tools on the map (`system-map.json` tool nodes with `of` = its program), starting with Unity
   Unicorn from the modules doc; the pages follow on the next build.
3. Record each pet's version (from its pet.json) where the build can read it, so the title shows it.
4. Add `interface_url` for the pipeline pets whose repo has a working page.

## Done when

Every pet's double-click and A59 links open its program page, and each page lists the pet's real tools and version.

## Return

Update `## What I did` with each change and its commit, set `status: done`, commit on a branch.
