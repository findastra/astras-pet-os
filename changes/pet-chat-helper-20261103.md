# The pet chat helper: Claude Code, then Codex, seated in the pet's harness, supervised

2026-11-03, Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/pet-chat-helper-20261103` (the "Friendly Farmer"
chat), on top of `claude/pet-chat-window-20261103` (#283).

Astra, 2026-11-03, asked "May I build the pet chat helper so Claude Code and Codex can answer and make changes from the
page?": "Yes, build it". Her answers to card 061 are the rules it follows: a helper on this PC; Claude Code first, then
Codex, or what another farm has, or the person's choice; agents change things, supervised; it starts at sign-in.

What changed:

- **`scripts/pet-chat-helper-20261103.cs`** (`the-farm-v1.0-pet-chat-helper-v1.0`): a background program with no window,
  built by `build-desktop-pets-20261011.ps1` next to Startup Star (and so by the installer on every farm). It:
  - listens on this PC only, on a port it picks at each start, and answers only a page that sends the code from
    `Astra's PetOS Data\astras-pet-os\pet-chat\pet-chat-page-data.js`; a web site's request is refused;
  - finds Claude Code (on the PATH, `~\.local\bin`, the Claude app's own copy), Codex (the PATH, Codex's own bin), and
    names Gemini CLI and GitHub Copilot CLI when they are there; it checks each one's sign-in;
  - seats the chosen agent in its own worktree of the pet's repo (`claude/pet-chat-<repo>-YYYYMMDD` or `codex/…`), made
    from origin's main in the data folder, so Astra's own copy of the pet is never touched;
  - runs Claude Code `--restricted` (file tools only, confined to that folder and a fresh copy of the plan, none of her
    settings, plugins or MCP servers) and Codex in its workspace-write sandbox with `--ignore-user-config` (her model
    choice comes along, her plugins do not); no API key and no Claude app session reach either; her message goes in on
    stdin;
  - streams the answer to the page, commits each answer's changes on the branch itself with hooks off, and pushes only
    after Astra says yes in its own Windows box, never to main;
  - refuses private pets, answers one message at a time for at most 15 minutes, stops at once from the page or the star,
    and logs every answer in its data folder.
- **Startup Star** starts it at sign-in, with **Pet chat** in its menu (Stop pet chat; open its folder). Its self-test
  checks the new entry.
- **The chat window** (`apps/pet-programs/pet-chat-link-20261103.js`, the only part of a page that talks to anything,
  and only to the helper): each seat says ready, sign in once, not on this PC, or found, not yet; with nothing chosen,
  the first ready one answers; the answer types into the pet's bubble with what it is doing under it; Send is Stop while
  it answers; **Push N changes for review** and **Start over**; after a push, a link to the pull request. With no helper,
  or on the public site, a message waits in the backlog and the pet says why.
- `system-map.json`: the tool on The Farm. PET-PROGRAM-FRAMEWORK.md section 3, item 10: how it works.
- Tests: `test/pet-chat-helper-test-20261103.mjs` builds the helper and runs it against stand-in agents, a made-up pet
  and its own pretend GitHub (9 tests); `test/cyberhome-chat-test-20261019.mjs` runs the window against a pretend helper
  (18 tests).

Checked on Astra's PC: the helper found Claude Code (the Claude app's copy, not signed in outside the app yet) and
Codex (signed in), made the worktree and branch on a copy of Mail Snail, and started Codex, which answered "Your
workspace is out of credits" (the same answer Codex gives outside the helper). Not checked yet: a real answer from
Claude Code (after her one-time sign-in), and the helper started by her live Startup Star (after this merges and the
star is rebuilt).
