# The Astra's PetOS MCP server, a read-only tool of The Farm

2026-10-26, Claude Opus 5.5 (claude-opus-5-5), branch `claude/cung-list-petos-mcp-20261026`.

Astra's Cung List, item 3 (2026-10-26: an MCP server for Astra's PetOS, after the `mcp-server-starter` pattern;
existing repos only, free tiers only, one branch and one pull request per item).

- `mcp/`: the server (`server-20261026.mjs`, on `@modelcontextprotocol/sdk` with zod schemas, stdio), its data side
  (`farm-data-20261026.mjs`, Node's built-in modules only) and its own `package.json` and lock file. Tools:
  `list_pets`, `get_pet`, `search_pets`, `list_open_handoffs`, `get_rule`, `list_rules`; resources for the name list,
  the rules files and the cards. Read only: no write tools.
- `mcp/register-astras-pet-os-mcp-20261026.ps1`: installs the server's dependencies in `mcp\` only, tests it and
  registers it with Claude Code, Claude Desktop and Codex on Astra's PC; safe to run again. Not run on Windows yet.
- `test/astras-pet-os-mcp-test-20261026.mjs`: part 1 always runs; part 2 (the SDK client, in-process and over stdio)
  runs when `mcp\node_modules` is installed and is skipped with the reason otherwise.
- `system-map.json`: the tool's node (`astras-pet-os-mcp`, of The Farm), then `npm run build -- --metadata-only`
  (TOOLS-AND-TRICKS.md registry, The Farm's pet program page, the Markdown pets, the System Map).
- `skills/new-pet-or-tool/SKILL.md` (the decision: a tool of The Farm, Astra approves by merging),
  `INTELLIGENCE-LEVELS.md` (the Friendly Farmer's row), `docs/astras-pet-os-mcp-20261026.md`.

Review fixes (2026-10-26): handoff card file names may hold capitals (open card
`011-any-claude-session-012RaHVD-wrapup-20261012.md` was left out of `list_open_handoffs` and the resources); still no
dots, slashes or backslashes. Tests check every numbered card on disk is read and that card 011 is listed and readable.
Claude Opus 5.5 (`claude-opus-5-5`).
