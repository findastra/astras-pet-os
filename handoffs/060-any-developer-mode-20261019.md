status: open (waits on Astra: OK to merge; then her review of the developer names)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: installer/install-astras-pet-os-20261014.ps1, developer-words-20261019.json, scripts/developer-words-20261019.mjs, scripts/developer-words-page-20261019.js, INSTALL.md (Developer mode)
---
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

1. **Astra reviews the developer names** in `developer-words-20261019.json` (`names`) and the word list, then sets
   `reviewed: true`. Change a word in PET-WORDS.md first, then in that file, then `npm run build`.
2. **Linux:** `scripts/farm-setup-20261019.mjs` and the Debian package have no developer mode yet: add a `--developer`
   option that writes `apps/words-mode-20261019.js` and skips the desktop pet service.
3. **Markdown pets:** `markdown-pets/` are only in farm words; a developer set could be generated from the same words.
4. **New pet programs** get a developer name when they are registered: the build prints the ones without one (they keep
   their farm names in developer mode until then).

## Done when

Astra has merged the pull request and reviewed the names, and Linux and the Markdown pets follow (tasks 2 and 3).

## Return

Update `## What I did` with each repo, pull request and commit; set `status: done`; commit on a branch.
