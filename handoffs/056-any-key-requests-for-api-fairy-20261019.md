status: open (waiting on Astra: merge the two pull requests; the request list stays on her PC unless she says otherwise)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: skills/key-request/SKILL.md, AGENTS.md (Rules), scripts/pet-program-pages-20261018.mjs (`PET_PANELS`), apps/pet-programs/pet-program-page-20261018.js, test/key-requests-test-20261019.mjs, findastra/api-fairy src/KeyRequests.cs and docs/key-requests-20261019.md
---
## What I did

Astra, 2026-10-19: "a lot of chats are like, you need to give me an API key for this. You need to give me an API key
for that. So anytime a chat asks for an API key, I need the API fairy to know. And I want the API fairy's pet program
interface to show me who is requesting a key, who has a key and who doesn't have a key. You know, if there's a request
and it's not being met and I haven't given the key, then I need a link to wherever that is that's requesting the key.
Put it on the API fairy's pet program page and show me what it looks like." Built by a session started from her chat.

**Which page:** her pet program page here, `apps/pet-programs/api-fairy-20261018.html` (what "Pet Program", one click
and the desktop pet open since 2026-10-19). Her own repo's `api-fairy-20261008.html` is the older offline notebook behind
**Open today's app**, not built to the sketch.

**This hub**, branch `claude/key-requests-20261019` (from `main` at `40e81c9`, in a worktree in Claude's scratchpad; the
live hub folder stayed on `main`); the pull request is linked from its commit:
- **The rule** in AGENTS.md (Rules): "Need a key? Ask API Fairy, not the chat (Astra, 2026-10-19)", and the harness
  skill **`skills/key-request`**: how any chat files a request (the folder, the JSON shape, the never-list: no value, no
  shared `ANTHROPIC_API_KEY`, never the Max plan behind a shared bot), how it tells Astra with ✨, and how a request is
  marked given or declined. Credit line at the end of AGENTS.md.
- **The panel** `api-fairy-key-requests-panel`, after her four level panels (a pet's own panels follow the sketch's
  order: `PET_PANELS` in the spawner): three groups labelled in their borders, `waiting-on-you` (full width, yellow
  border, a ✨ link to each request), `has-a-key` and `declined-or-not-needed`; every request has the paired lights; the
  panel has its activity light and folds; one column on a phone. The shared page script reads the real list from one
  fixed file, `../../../../Astra's PetOS Data/api-fairy-ring/key-requests-page-data.js`, and only when the page is opened
  on Astra's PC (a file, or a preview on this PC); otherwise it shows three made-up examples, each marked EXAMPLE.
  Text goes in with `textContent`; only https links become links.
- **The tool on the map:** `key-requests` (`api-fairy-ring-v1.0-key-requests-v1.0`, `of: key-ring`, `planned` until
  findastra/api-fairy merges it) in system-map.json, so the L1 panel and TOOLS-AND-TRICKS.md list it.
- Records: a decision row in `skills/new-pet-or-tool`, a glossary row (key request = credential request) in
  `skills/dev-mindset`, API Fairy's row in INTELLIGENCE-LEVELS.md, a paragraph in PET-PROGRAM-FRAMEWORK.md section 3,
  this card and its rows.
- **`test/key-requests-test-20261019.mjs`** (6 tests): the panel's place, labels, groups and fold; only API Fairy's page
  has it; the examples are made up and marked; the page loads one script, from the fixed path, only on this PC, checks
  its schema, links only https; the rule, the skill and the map node exist; and no request file or page data is anywhere
  in the hub.
- `npm run build -- --metadata-only`: only API Fairy's page, the System Map page, TOOLS-AND-TRICKS.md and her Markdown
  pets changed. `npm test`: 202 tests, 201 pass, 0 fail, 1 skipped (the Pets Board).

**findastra/api-fairy**, branch `claude/key-requests-20261019` (from `main` at `7147871`, in a worktree in Claude's
scratchpad; her PC folder was not touched); the pull request is linked from its commit:
- `src/KeyRequests.cs`: reads the request files (16 KB each, 500 at most, no links), refuses any that looks like it
  holds a key value (her own key-shape test; session ids and dated slugs are names), checks each key by name against her
  scanner (environment variables and watched `.env` files, never example files), sorts it into the three groups and
  writes the page data (names and notes only).
- `src/App.cs`: the check runs on her scanner thread every 2 seconds (the folder is watched); a new request pops up in
  her bubble and a Windows notification; the number waiting is in her tooltip and badge; a **Key requests** tray item
  opens her pet program page; `--key-requests [folder] [--no-scan]` checks once and prints the groups.
- `tests/Tests.cs`: 32 new checks; 115 pass, 0 fail. **Run in memory** (PowerShell `Add-Type` with the same compiler):
  Malwarebytes removes a freshly built `bin\tests.exe` in the scratchpad, as it did on 2026-10-08. The app itself builds.
- README (Key requests, Limits, code map), SECURITY.md (what she reads and writes), `docs/key-requests-20261019.md`,
  AGENTS.md credit line, pet.json `updated` and `built_with`.

**On Astra's PC** (not in any repo):
- New folder `%USERPROFILE%\Documents\Astra's PetOS Data\api-fairy-ring\key-requests\` with the **8 requests already
  known**, as links back to where each was asked: CLI Proxy API's key with a spend limit (Discord Damsel's card 006/007,
  never a Claude login); the Ask Astra bot's `ASK_ASTRA_ANTHROPIC_API_KEY` and `ASK_ASTRA_DISCORD_TOKEN`
  (findastra-discord-presence#8, its code on #7); Role Fairy's `ROLE_FAIRY_ANTHROPIC_API_KEY` and
  `ROLE_FAIRY_FEEDBACK_DISCORD_TOKEN` (role-fairy cards 002 and 001); AI Astra's voice, Claude engine
  (`ANTHROPIC_API_KEY`, the-astral-plane voice README; it should get a name of its own); the Friendly Farmer's
  `FARMER_TOKEN` (a GitHub secret; GitHub Goldfish asks for the same; from MOOD-KEY.md); and `OPENAI_API_KEY` for The
  Farm's art generator (given). Found by searching every repo's open handoff cards and the open pull requests.
- Ran the scratch build once: `"API Fairy.exe" --key-requests` wrote `key-requests-page-data.js` there. Result: 7
  waiting on you, 1 has a key (`OPENAI_API_KEY` found by name), 0 declined.
- A temporary `api-fairy-ring-page` entry in `Astra's Pet Apps\.claude\launch.json` (removed after) served a scratch
  folder that mirrors Documents, so the browser pane showed the page with the real list; screenshots by headless Edge
  were sent to Astra in the chat.

## Waiting on Astra

1. OK to merge findastra/api-fairy's pull request, then this one (the map node goes `now` after it).
2. **Where the list lives:** on her PC only (built this way, because the list shows which services she uses), or
   public on GitHub too. Moving it later is easy; un-publishing is not.
3. Each waiting request: make the key herself on the provider's page with a spend limit, set it as a Windows user
   environment variable with that name, and API Fairy moves it to has a key.

## Task (after the merges)

1. On Astra's PC: `Start API Fairy.cmd --rebuild` in her api-fairy folder (its working copy is behind `main`: fast-forward
   it first), so the running fairy watches the requests.
2. Copy `skills/key-request/SKILL.md` into `%USERPROFILE%\.claude\skills\key-request\` and `%USERPROFILE%\.codex\skills\key-request\`
   (as with pet-app), so every new chat sees it without opening the hub.
3. Set the `key-requests` node to `now` and run `npm run build`.
4. Later: buttons on the page to mark a request given or declined (they would need API Fairy to write the file, since a
   page can't), and AI Astra's voice gets a key name of its own.

## Done when

Both pull requests are merged, the running API Fairy shows the requests, and Astra has answered question 2.

## Return

Update `## What I did`, set `status: done`, commit on a branch.
