status: open (waiting on Astra: OK to merge the click-check pull request; then fixing what it found)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: scripts/click-check-20261019.mjs, test/click-check-test-20261019.mjs, skills/new-pet-or-tool (decision row), ASTRAS_PET_OS.md (the Browser Bat line), PET-PROGRAM-FRAMEWORK.md (section 8)
---
## What I did

Astra, 2026-10-19: "propose a tool ... that will go through all the pet program pages and click on buttons and determine
which ones are [broken] ... whether they don't go anywhere, whether they go to the wrong place ... And those errors I
want to be corrected ... I need a tool that tests the clickness of the buttons." Asked whether it should be Browser
Bat's or the Friendly Farmer's, she chose The Farm ("make the click tester a tool of The Farm ... Update the Browser Bat
line in ASTRAS_PET_OS.md in the same PR"): The Farm makes these pages, so the fixes land in its own scripts.

On branch `claude/click-check-20261019` of astras-pet-os (from `main` at `893335f`, in a worktree in Claude's scratchpad
with `core.autocrlf=false`; Astra's live hub folder stayed on `main`; not on `main`, the pull request is linked from this
card's commit):

- **`scripts/click-check-20261019.mjs`**, the tool (`the-farm-v1.0-click-check-v1.0`, `npm run click-check`). Node's
  built-in modules only. It opens every page in `apps/pet-programs/` and `apps/` (or the pages named) in the Edge or
  Chrome already on the computer, headless, one throwaway profile and one private browser context per page, and clicks
  every link, button, panel label and element with a click handler, the way a person does (a real mouse press at the
  middle of it). For each one it says:
  - 💀 **goes nowhere**, 🚫 **dead end** (a missing file, page, tag or `#section`; on GitHub it tells "no such tag" from
    "no such repo"), 🔀 **wrong place** (by the registry: the System Map link on a pet's page must open that pet's own
    node, Repo its own repo, Open today's app pets.json's `app_url`, a pet's name that pet's page; a link to the page
    itself), 💥 **throws**, ↩️ **forgets** (it saves, but a reload shows the old state), 🙈 **covered**, ↕️ **moves when
    pressed** (the first press shifts the page, so a first click lands beside the button);
  - notes that are not the page's fault: 🔌 **service off** (a button that calls a program on this PC, which is not
    running), 🔒 **needs sign-in**, ❓ **could not tell**, ⏭️ **not clicked** (hidden until another click, or its label
    says it acts for real).
  - The report is grouped by cause, so one generator bug on 40 pages is one row, with the file to fix (the spawner and
    its data for spawned pages, never the page). Written as `click-check-<date>.html`, `.md` and `.json` with a picture
    of each broken button, in the computer's temp folder (`--out` to choose); never in this repo, and never with a path
    from this computer in it. Exit code 1 when something is broken.
  - **It sends nothing.** Every request that is not a GET (a form post), and every call to this PC (127.0.0.1), is
    stopped and reported; where a click goes is noted and the page stays put (the destination is checked on its own);
    a button whose label says it acts for real (delete, send, publish, ...) is not clicked unless `--click-all`.
  - What any press on the page does by itself (the pet waking up, the L4 activity light, a clock) is learned first and
    never counted for a button.
  - **Found on Astra's PC while building it:** Edge 155 on Windows restarts itself as a new process and drops the
    DevTools pipe Mirror Pool's fit-check uses, so click-check falls back to a DevTools port on 127.0.0.1 for the run;
    and five tabs of one headless browser take turns, so it starts one browser per page checked at once (`--tabs`,
    default 5).
  - **Not broken, and the tool now knows it** (each was a false alarm in a first run, checked by hand): a link that
    wraps onto two lines (it aims at each line); a button inside a section folded shut, clipped, switched off or faded
    out (hidden until the section opens, not covered); a checkbox drawn by its label (it clicks the label); a section
    still sliding open (it waits for animations); a page that shows its views by `#name` (Data Dealer's tabs) and the
    tab already open; files `.gitignore` keeps on this PC on purpose (the local service addresses,
    docs/local-services-20261014.md); and `KNOWN`, a short list checked by hand (Gone Ghost's logo: five clicks show the
    credits).
- **`test/click-check-test-20261019.mjs`** (10 tests): what an outside answer means; never opening this PC's programs or
  what acts for real; one row per cause; the wrong-place rules, and every spawned page's own System Map, Repo and
  today's-app links passing them; what counts as a click's own effect; no computer paths in a report; the file to fix;
  the tool on the map and in the registry; and a real browser test of a page with one of every kind of button (18
  buttons, every verdict right). The browser test runs where Edge or Chrome is found, never on GitHub's runners (CI).
- **Registered as a tool of The Farm:** the node `click-check` in `system-map.json` (with `runs-on` Node.js and
  `directs` the web browser, CRLF kept), so the Farmer's pet program page lists it in "Your tools" and TOOLS-AND-TRICKS.md
  has its row; `npm run click-check` in package.json and README.md ("For builders").
- **The Browser Bat line in ASTRAS_PET_OS.md** (Astra's ask): Browser Bat keeps the sites outside the farm; the farm's
  own pages are The Farm's, with an amendment at the top. The decision row in `skills/new-pet-or-tool`, a glossary row in
  `skills/dev-mindset` (link checker, UI smoke test, layout shift), **click-check** in PET-WORDS.md's system words,
  PET-PROGRAM-FRAMEWORK.md section 8 ("Detect"), the Farmer's row in INTELLIGENCE-LEVELS.md, a credit line in AGENTS.md,
  this card and its rows in `handoffs/README.md` (055 and 056 are taken on today's branches, so this is 057).
- `npm run build` rewrote the generated files (the System Map, The Farm's pet program page, TOOLS-AND-TRICKS.md, the
  Markdown pets, and the pages `main` had left stale after round #138, the same rebuild as pull request #142).

## What the first run found

The full run on this branch after `main` (#140 to #149) was merged in (2026-10-20, Edge 155, `GITHUB_TOKEN` from the
signed-in `gh` so private repos are told from missing ones): **65 pages, 4,106 buttons and links clicked in 15 minutes;
4,082 work.** Then two of its rows were rechecked after the tool learned they were by design (below).

1. **↕️ The page moves at the first press, on 16 of the spawned pages** (real). The first press anywhere makes the pet
   notice you; its bubble grows from one line to two, the cyberhome grows 21 px, and every button and link below it
   moves down, so a quick first click on a small light or panel label lands beside it. **Fixed** on branch
   `claude/click-check-fixes-20261019` (its own pull request): the bubble keeps room for three lines
   (`apps/pet-programs/pet-program-page-20261018.css`). click-check on that branch no longer reports it.
2. **🔒 `astras-pet-os` itself is private now** (and `portfolio-puffer` and `the-astral-plane`). Earlier the same night
   every hub link loaded for anyone. With the hub private, for anyone but Astra the GitHub Pages site (the beginner guide,
   the System Map), the README's installer download and every `github.com/findastra/astras-pet-os/...` link answer 404.
   Not changed here: whether it is meant is Astra's (a visibility change is hers).
3. Not broken, by design: API Fairy's page reads the key-request list from Documents, outside the repo (now a note);
   the Goldfish's "Release the goldfish" asks GitHub's API, which answered 403 because the signed-out limit was used up
   by the night's checks (now "could not tell").
4. Every outside link loads (with the hub private, its own links are sign-in only). Workflow Whirlpool's "Private
   source" link is sign-in only, as its label says.

**Not clicked (379):** each spawned page's chat-window buttons and Gone Ghost's folded items are now opened and clicked
in a second pass; what stays unclicked is three levels deep (a detail inside an item inside a folded section, on Gone
Ghost's page), plus 7 buttons whose labels say they act for real (Send, Delete ...).

## Task

1. Astra: OK to merge the pull request.
2. Fix what it found, one pull request per cause (the spawner's or each pet repo's), and run `npm run click-check` again
   on the branch to show the row is gone.
3. Astra decides how often it runs (only when asked, on every pull request, or nightly with the Idle Flash Audit) and
   whether the Flash Audit's A10, A48 and A59 should use it (they read the pages today; this clicks them).
4. Later: its results feed `broken-tools-on-the-farm` (planned) and turn a tool's maintenance light yellow.

## Done when

The pull request is merged and the first run's broken rows are fixed or answered.

## Return

Update `## What I did`, set `status: done`, commit on a branch.
