status: open (paused 2026-10-20; waiting on Astra: whether the hub is public again, then a release; her review of the developer names)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19; paused 2026-10-20
needs: installer/install-astras-pet-os-20261014.ps1, developer-words-20261019.json, scripts/developer-words-20261019.mjs, scripts/developer-words-page-20261019.js, INSTALL.md (Developer mode)
---
## Ownership and state

State: paused, to pick up later (Astra, 2026-10-20: "end chat and leave note we will pick up later").
Implementer: none now; the writer that built it (Claude Opus 5.5) released every file. Writable for the next taker:
the files in `needs` above and this card.
Reviewer: unassigned. Next action: Astra's decisions below, then task 1 (the release).

### Where it stands (2026-10-20)

- **Merged:** developer mode, #155 (`4562834`, Astra's OK in chat). It is on `main`, but **in no release yet**: the
  Latest release is still `v0.3.0-beta` (2026-10-19), so the installer download has no Developer mode switch.
- **Blocker:** the hub repository is private since 2026-10-20 (Astra privated most repos), so the installer download,
  the hub's Pages site and its pictures answer 404 for anyone but Astra. A release is only useful once she decides
  whether the hub is public again: decision 1 in her private-repos deck (hub PR #167, the private-repos card or memo).
- **Also merged the same day, on the same pages:** #163 (the header fitted, the title always on one line, no star door;
  it carries #162) and #165 (on a phone the cyberhome and the System Map box side by side with the den and the rings
  as matching squares, the emotion and idle bubbles as clouds with thought-bubble puffs, nothing wider than its panel,
  the first three related pets in the System Map box up to 760px wide). Main's tree after #165 was the tested one:
  `npm test` 254 tests, 253 pass, 0 fail, 1 skipped (the Pets Board); `npm run check` OK.
- **Proposed, not started:** a separate Claude session to cut the release ("Release the installer with developer
  mode": version bump, card update, installer zip, Latest). Start it only after the blocker above is decided.
- Nothing is running for this card, and no file is half-edited: everything is on `main`.

## What I did

Astra, 2026-10-19: "I need there to be another installation option that's for developers. So it's an option that
basically takes away the farm nomenclature and uses the programming nomenclature. So instead of the Unity unicorn and
the unicorn stable, you would have the agent and the agent control hub ... a switch, developer switch, to have at the
installation at the beginning ... You can still use the images ... you would get rid of the like function where the UI
like goes everywhere ... you would basically have the cyber home just like have it living in there anyways, and you
could click it and see what it does."

On branch `claude/developer-mode-20261019` of astras-pet-os (its pull request is linked from this card's commit), made
in a clone in Claude's scratchpad, so the hub folder on Astra's PC was not touched:

- **The installer's switch.** The "Set up your farm" window has a **Developer mode** checkbox under its first line; it
  changes every word of the window at once (title, "Install with Astra's Example Agents", "Minimal Install", the
  Agent column with each pet's agent name, the groups, the count, the Install button, the jobs in programming words)
  and hides "Start my pets when Windows starts". AI agents pass `-Developer`; `-ListPets -Developer` adds each pet's
  agent name. `-SetupWindowPicture <png>` draws the window (with or without `-Developer`) and installs nothing, for
  tests and screenshots.
- **Developer mode installs no desktop pets.** It builds and starts nothing and nothing starts with Windows; a desktop
  pets program from an earlier install is stopped, its start-with-Windows entry removed and `bin` deleted. The Start
  menu gets **Agent Control Hub** (The Farm's pet program page), **System Map** and **Uninstall**, and the other mode's
  shortcuts are removed. The receipt says `"mode": "developer"`, `built_from_source: false`, `program_sha256: null`.
  The installer writes the mode into the installed `apps/words-mode-20261019.js` every time (farm or developer).
- **The words.** `developer-words-20261019.json`: the exact words (matched as written), the other words (any case, the
  case kept), the panel label endings and a **draft developer name for every one of the 84 pet programs** (Unity Unicorn
  is the Unity Agent, Unity Stable the Unity Agent Control Hub, The Farm the Agent Control Hub, the Friendly Farmer the
  Orchestrator Agent). `keep_home` keeps five pet program names that are the real names of the projects they run (Data
  Dealer, Paper Girl, The Astral Plane, Astra's GIF Maker, Spoonfed), so sentences about those projects still read
  right. `reviewed: false`: they wait on Astra.
- **The pages.** `scripts/developer-words-20261019.mjs` (run by `npm run build`) writes `apps/developer-words-20261019.js`:
  the words, every pet and pet program name with its developer name, and the page code
  (`scripts/developer-words-page-20261019.js`). Every pet program page, the list of them, the Farmer's desk and the
  System Map load it in `<head>`, after `apps/words-mode-20261019.js`. Which words a page shows: `?words=` in its
  address, then the words switch in its footer (saved in that browser, and only while the install is in the mode it was
  chosen over), then the installer's choice. It swaps only what people read (text, title, alt, placeholder, aria-label)
  and the panel labels; never ids, links, `<code>`, file names, repo names or what people typed. The System Map's own
  data gets the new names before it is drawn.
- **The cyberhome in developer mode.** No Startup Star door and no flight: the agent is already home in its avatar
  panel, and one click on it says what it does (its summary, then what is waiting on you). The click-bindings panel
  (desktop pet clicks) is hidden.
- **Fixed on the way:** a desktop draft's repo is read from its pet program page address as well as a GitHub link, in
  both the installer and `scripts/farm-setup-20261019.mjs`, so draft pets show their jobs in the window and `-Pets` finds
  them by repo name.
- **Docs:** INSTALL.md "Developer mode" (the person's steps and the agent's `-Developer`), a line at the top of
  README.md, a paragraph in PET-WORDS.md, READ ME FIRST and the `.cmd` launchers, the AGENTS.md credit line.
- **Tests:** `test/developer-mode-test-20261019.mjs`. Results and checks are in the pull request.
- On Astra's PC: nothing changed.

## Task

1. **A release with developer mode** (after Astra decides whether the hub is public again): bump `$Version` in the
   installer and `package.json`, build `astras-pet-os-installer.zip` with `node scripts/installer-zip-20261018.mjs <tag>`,
   publish it as the Latest release with her OK (card 042's rules), then test the downloaded zip in a scratch folder
   with `-Developer` and without, and with `-SetupWindowPicture` in both modes.
2. **Astra reviews the developer names** in `developer-words-20261019.json` (`names`) and the word list, then sets
   `reviewed: true`. Change a word in PET-WORDS.md first, then in that file, then `npm run build`.
3. **Linux:** `scripts/farm-setup-20261019.mjs` and the Debian package have no developer mode yet: add a `--developer`
   option that writes `apps/words-mode-20261019.js` and skips the desktop pet service.
4. **Markdown pets:** `markdown-pets/` are only in farm words; a developer set could be generated from the same words.
5. **New pet programs** need a developer name in `developer-words-20261019.json` when they are registered:
   `test/developer-mode-test-20261019.mjs` fails until each has one.

## Done when

The Latest release's installer has the Developer mode switch and it works from the downloaded zip, Astra has reviewed
the names, and Linux and the Markdown pets follow (tasks 3 and 4).

## Return

Update `## Ownership and state` and `## What I did` with each repo, pull request and commit; set `status: done`;
commit on a branch.

## Receipt and review

Pending: the next assistant records here which revision of this card it read, when, and what it takes on.
