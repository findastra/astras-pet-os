status: open (waiting on Astra: OK to merge the pull request; then the first live test in VRChat)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: INTELLIGENCE-LEVELS.md (Astra Wisp's row), system-map.json (`ai-astra`, `vrchat-connector`, `ai-astra-mind`), findastra/the-astral-plane `docs/handoff-claude-20261019.md`
---
## What I did

**Why.** [the-astral-plane PR #8](https://github.com/findastra/the-astral-plane/pull/8) ("The VRChat connector for any
agent, and VRChat AI Astra on a local model") was merged on Astra's OK in chat, 2026-10-19, as merge commit `8911b4a`
(feature commit `90fce6f`). Astra, 2026-10-19: The Astral Plane has three parts, the VRChat connector any agent can use
on its own PC, VRChat AI Astra (our own agent) and her model (a local model, probably on another laptop). Its handoff
listed the hub records as not done. This card brings them in line.

**What I changed** (branch `claude/astral-plane-records-20261019`, not on `main`; the pull request is linked from this
card's commit):
- `INTELLIGENCE-LEVELS.md`, Astra Wisp's row:
  - Column 1 (L1): the three parts, and the **VRChat connector** as The Astral Plane's native tool
    (`the-astral-plane-v1.0-vrchat-connector-v1.0`, `vrchat-embodiment/embodiment.py`: say, typing, move, turn, jump,
    stop). Its limits in code: this PC only, eight buttons, a move held 0.1 to 3 s and always released. 63 tests pass,
    and it has never run in live VRChat.
  - Column 3 (L3): **VRChat AI Astra** (`voice/ai_astra_voice.py`). Her cognitive core picks the goal, and a model
    writes her words: `--engine local` for any OpenAI-style server on this PC or the home network, or `--engine claude`.
    The connector is her body, and moves need `--allow-moves`. 25 tests pass against stubs. She has never run with a
    real model server or in live VRChat.
  - The 🔌 error now says the PC copy (`C:\ai_astra\ai_astra_main`) is a real clone of the-astral-plane, on `main` at
    `8911b4a`, just not under `Documents\Astra's PetOS` yet.
  - "What this shows", Level 3: Astra Wisp has VRChat AI Astra, not "her own non-LLM AI".
- `system-map.json`:
  - A new node `vrchat-connector`: type `tool`, of `ai-astra` (The Astral Plane), state `now`, label
    `the-astral-plane-v1.0-vrchat-connector-v1.0`, with a one-line job.
  - Two new lines. `ai-astra` → `vrchat-connector` (opens, now). `vrchat-connector` → `vrchat` (opens, **planned**):
    VRChat was already on the map as a third-party program, and this line is planned until the first live test,
    because nothing has ever reached live VRChat.
  - Updated text: the `ai-astra` job (the three parts) and the `ai-astra-mind` job and its model line. Both said
    "chatbox drafts today"; they now say her body is the connector, and a model server can be on Astra's own network.
  - CRLF kept: only these lines changed.
- `npm run build` regenerated `TOOLS-AND-TRICKS.md` (two more rows: the connector, and VRChat under The Astral Plane; 188 rows after merging `main`),
  `apps/pet-programs/the-astral-plane-20261018.html` ("Your tools": VRChat connector; VRChat "planned"),
  `markdown-pets/the-astral-plane-20261019.md`, `markdown-pets/all-pets-20261019.md` and `system-map-20261012.html`.
- `handoffs/README.md`: this card's row, and the next free number is now 056. This card was 053, then 054: Mirror Pool's card
  (#131) and the cyberhome card (#137) reached `main` first with those numbers, so they kept them.

**Tested,** in an LF clone (`core.autocrlf=false`) in Claude's scratchpad, never in Astra's PC folders: `npm run build`,
then `npm test`. `main` moved three times while this was open; after merging it (up to #134 and #141) into the branch and
rebuilding: 210 tests, 209 pass, 0 fail, 1 skipped. I looked at the rebuilt page in the browser pane: the connector
is under "Your tools" with its label, and VRChat is under "3rd party programs" as planned. Nothing on Astra's PC changed.
I only read the-astral-plane's merged docs from `C:\ai_astra\ai_astra_main`.

**Seen, not changed:**
- The Astral Plane's map node `ai-astra-mind` keeps state `now`, though no model server is set up yet. Its job says so.
- VRChat AI Astra can use Claude (`--engine claude`, since 2026-10-17), but the map has no line from The Astral Plane to
  Claude.
- Decisions waiting on Astra, from the-astral-plane's handoff: the word for the connector, which laptop, where her
  VRChat runs, her statistical brain, moves in public, expressions, and an MCP server.

## Task
1. Astra: OK to merge the pull request.
2. After the first live test in VRChat (the-astral-plane `docs/handoff-claude-20261019.md`, "Next live test"):
   - Set the `vrchat-connector` → `vrchat` line to `now`.
   - Take "never run in live VRChat" out of the row and the map.
   - Run `npm run build` and `npm test`.
3. When the PC copy moves under `Documents\Astra's PetOS\the-astral-plane` (through File Master), clear the 🔌 error.

## Done when
The pull request is merged, and after the live test, the row and the map say what VRChat really did.

## Return
Set status: done with the merge commit and the live test's date, commit.
