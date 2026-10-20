status: open (waiting on Astra: OK to merge the pull request; named 2026-10-19)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: apps/beginner-guide-20261019.html, test/beginner-guide-test-20261019.mjs, INSTALL.md, MAKE-IT-YOURS.md, PET-WORDS.md, PET-PROGRAM-FRAMEWORK.md (section 13), TOOLS-AND-TRICKS.md
---
## What I did

Astra, 2026-10-19: her best friend Dev (GitHub XxdevilishxX, brand new to programming) should download Astra's PetOS
and make her own farm, choosing which of her apps are public or private like Astra does, and anyone can pull Astra's
pets, change them and put them into their own system. She asked for a very beginner-friendly, mobile-friendly guide
website, first as a tutorial tool on the Farmer, then whether it must sit "higher than the Farmer" in case someone
doesn't get the Farmer. The answer she was given: the Friendly Farmer is a core pet that every farm has and the
installer never lets anyone untick, and the guide is a public page anyone can read before installing, so The Farm
owning it is right. Built by a session started from her chat.

On branch `claude/beginner-guide-20261019` of astras-pet-os (from `main` at `9b9564f`; not on `main`, the pull request
is linked from this card's commit), made in a worktree in Claude's scratchpad with `core.autocrlf=false`, so the live
hub folder stayed on `main`:
- **`apps/beginner-guide-20261019.html`**, one page, no dependencies, works by double-click and on GitHub Pages
  (`https://findastra.github.io/astras-pet-os/apps/beginner-guide-20261019.html`). Ten steps that fold: what Astra's
  PetOS is (pets, pet programs, the Friendly Farmer, your farm, you as L4); install it (the one installer download,
  Example Pets or From Scratch, core pets, the star, the Start menu); work or school computers (browser and Markdown
  pets, never work around security); asking your own AI (a message to copy, what a good AI helper does); making it
  your own (a fork, or a private copy with pet-privatizer, renaming, removing examples); public or private, pet by pet
  (new pets start private, how to switch, what is lost); taking any of Astra's pets (six pets with their pictures and
  pet program pages, fork, change, add to `pets.json`, the Kennel); staying safe; 18 words, each farm word with its
  programmer word from PET-WORDS.md; and why the Friendly Farmer owns the guide (a core pet, always there, and a public
  page). Farm words come first, the programmer word in small violet text. Pictures load only from `art/frames/` (one
  art source). The script opens the step a link points at, folds or unfolds every step and copies a message; it sets
  text only with `textContent`, and sends and saves nothing. Graphite `#26272b` with neon lime, cyan, pink and violet.
- **`system-map.json`**: node `beginner-guide` (`own-program`, `of: farm`, label `the-farm-v1.0-beginner-guide-v1.0`),
  with a line from The Farm (`opens`) and two `runs-on` lines (web browser, GitHub). `npm run build` added its row to
  the registry table in TOOLS-AND-TRICKS.md (now 10 native programs), The Farm's pet program page lists it under "Your
  programs", and the System Map draws it.
- **README.md**: one line under "Beta testers and their AI: start here" linking the guide.
- **Records:** a credit line in AGENTS.md; The Farm's row in INTELLIGENCE-LEVELS.md; a decision row in
  `skills/new-pet-or-tool`; this card and its rows in `handoffs/README.md` (next free number 052).
- **`test/beginner-guide-test-20261019.mjs`** (9 tests): a dated name in `apps/` and a phone viewport; no outside script,
  stylesheet or font; no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, inline handlers, requests or
  storage; every link is a step on the page, a real file in the repo (relative, or a `github.com/findastra/astras-pet-os/blob/main/`
  link to a file that exists) or https; every picture is from `../art/frames/` and exists; the pets' names come from
  pet-programs.json; every step is there and folds, with the same installer link as INSTALL.md; nothing sensitive and no
  credit line; the map node, its line from The Farm and its registry row. It fails on a broken link or `innerHTML`
  (checked by breaking the page once, then restoring it).
- **Checks:** `npm run build` (changed only the files above); `npm run check` OK (20 pet apps); `npm test` 188 tests,
  187 pass, 0 fail, 1 skipped (the Pets Board).
- **Pull request [#123](https://github.com/findastra/astras-pet-os/pull/123).** `main` moved three times while it was
  open (#122, #112, #104) and was merged in each time: every AGENTS.md credit line kept (`main`'s first), card numbers
  from `main` plus 051, the registry table and the System Map rebuilt with `npm run build`. After the last merge
  `npm test` 190 tests, 189 pass, 0 fail, 1 skipped; `npm run check` OK.
- **Looked at in the browser pane** through a temporary `beginner-guide-temp` entry in
  `%USERPROFILE%\Documents\Astra's Pet Apps\.claude\launch.json` (port 5196, removed afterwards; the other entries,
  including another session's new `unity-stable-closet`, kept): at 375 × 812 with every step open, no sideways scroll,
  every picture loads, no tap target under 32 px outside running text (buttons, step headers and step links are 44 px
  or more), no console errors; a step link opens its step;
  the copy button copies. At desktop width the three start cards and the steps sit in one 760 px column. Two fixes came
  from this (the download button's small line stacks under its label; the pet tiles are an even 3 by 2 grid).
  Screenshots by headless Edge from the same server, in Claude's scratchpad (`shots/`), sent to Astra in the chat.
- On Astra's PC nothing else changed: the live hub folder was only read and fetched.

- **Named by Astra, 2026-10-19** (in chat): *Yes: name the guide "How to Take Care of Your Farm!". Keep the file name,
  and let the map's first-run walk open this page.* Done on this branch: the page's title, heading and closing
  section; the map node's name and job (the registry table and The Farm's page rebuilt); the README link;
  PET-PROGRAM-FRAMEWORK.md section 13 (the first-run walk, a trick of The Farm not built yet, opens the guide);
  PET-WORDS.md (the word now means this page); TOOLS-AND-TRICKS.md's example trick is now the "first-run walk"; the
  lines in AGENTS.md, INTELLIGENCE-LEVELS.md and `skills/new-pet-or-tool`; the test checks the name. The file name and
  the label `the-farm-v1.0-beginner-guide-v1.0` stay, as she said.

## Found, not changed here (each is its own decision or follow-up)

1. ~~**The name.**~~ **Answered by Astra, 2026-10-19 (above).** The framework already has Astra's tutorial title, **"How to Take Care of Your Farm!"**
   (PET-PROGRAM-FRAMEWORK.md, section 13; PET-WORDS.md: "onboarding tutorial"), but there it names the first-run walk
   around the System Map, a trick of The Farm (TOOLS-AND-TRICKS.md, "Real examples"). Proposed: give the page that
   title, and let the map's first-run walk open it. Until Astra decides, the page says "a guide for beginners", the
   node is "Guide for beginners" and the file name stays plain. If she picks a name: change the page title, the node's
   `name`, and add it to PET-WORDS.md; the file name and label can stay (links depend on them).
2. **INSTALL.md and MAKE-IT-YOURS.md disagree.** INSTALL.md says never use the green **Code** button; MAKE-IT-YOURS.md
   (step 1.4 and step 2) says to install your own fork with **Code → Download ZIP**. The guide sends people to the
   installer for Astra's farm and to MAKE-IT-YOURS.md for installing from their own copy. Someone installing a fork has
   no installer zip of their own: Astra decides which path a fork uses.
3. **pet-privatizer only works on Astra's account for `plan` and `apply`.** `scripts/animal-guard-20261013.mjs` has
   `GITHUB_OWNER = 'findastra'`, so on Dev's own farm `plan` and `apply` would look at Astra's repos, not hers; only
   `copy` uses the signed-in account. The guide tells people to switch a pet's visibility in GitHub's own Settings, and
   uses pet-privatizer only for the private copy. Follow-up: the farm's owner from the signed-in account or a setting.

## Task

1. ~~**Astra:** the name (finding 1).~~ Answered 2026-10-19 and done (above).
2. **Astra:** OK to merge the pull request.
3. ~~After the name: rename as in finding 1.~~ Done.
4. Findings 2 and 3, each as its own pull request once Astra decides. Finding 3 has its own session (pet-privatizer on other
   farmers' GitHub accounts), waiting on Astra's OK for the animal guard.
5. Later: when the first-run walk on the System Map (section 13) is built, it opens this page (Astra, 2026-10-19), so
   there is one tutorial, not two.

## Done when

The pull request is merged and the page is live on GitHub Pages under its name.

## Return

Update `## What I did` with the merge commit and the name, set `status: done`, commit on a branch.
