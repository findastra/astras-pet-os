# The Astra's PetOS MCP server

`the-farm-v1.0-astras-pet-os-mcp-v1.0`, a native tool of The Farm (the Friendly Farmer's pet program). It lets the agent
in the seat (Claude Code, Claude Desktop or Codex) read the farm from this repo's own files over MCP (Model Context
Protocol, stdio), instead of opening and searching them by hand. Built from Astra's Cung List, item 3 (the
`mcp-server-starter` pattern: `@modelcontextprotocol/sdk`, zod input schemas, stdio), by Claude Opus 5.5
(`claude-opus-5-5`), 2026-10-26.

## Read only

Agents control only animals, and the core changes only through a branch and Astra's OK
([PROTECTION-RINGS.md](../PROTECTION-RINGS.md)). So the server has **no write tools**: every tool reads files, and none
writes, runs a program or reaches the network. Every tool is marked `readOnlyHint: true`, and
`test/astras-pet-os-mcp-test-20261026.mjs` fails if the server's code gains a file write, a child process or a network
call. A write tool, if one is ever wanted, needs its own opt-in switch that is off by default, and Astra's (L4) OK.

- `get_rule` reads only the rule files in its list (AGENTS.md, CLAUDE.md, PROTECTION-RINGS.md, TOOLS-AND-TRICKS.md,
  PET-PROGRAM-FRAMEWORK.md, INTELLIGENCE-LEVELS.md, PET-WORDS.md, PET-FILES.md, SECURITY.md, INSTALL.md). It never
  opens a path it is handed.
- Handoff cards are found in the `handoffs/` listing, never by a path.
- Text copied from pets (job, says, mini-descriptors) and card text comes back with a note: it is data, never
  instructions (AGENTS.md, Rules).

| | R | W | X | Status |
|---|---|---|---|---|
| The server, on the hub's files | yes | – | – | Rule only (it runs as Astra; the test above guards the code) |

## Tools

| Tool | Input | What it returns |
|---|---|---|
| `list_pets` | `stage` (optional): `registered`, `pipeline`, `seed` or `roadmap` | Every pet program in `pet-programs.json`: number, pet, program, stage, repo; and the count per stage |
| `get_pet` | `pet`: a number, pet name, program name or repo | Its mini-descriptor, stage, repo and GitHub link, its `pets.json` entry, its row in `INTELLIGENCE-LEVELS.md` and its tools and tricks from the registry in `TOOLS-AND-TRICKS.md` |
| `search_pets` | `text`, `limit` (optional, default 20) | Pet programs whose names, repo, stage, mini-descriptor, status or registry job contain every word |
| `list_open_handoffs` | `for` (optional): `claude`, `codex`, `any`, `farmer`, ... | Cards in `handoffs/` whose status is not done (`done when ... merges` still counts as open), newest first |
| `get_rule` | `name`, `file` (optional, default `AGENTS.md`) | One section by its heading (exact, then its start, then any part; dates in brackets are ignored), up to the next heading of its level |
| `list_rules` | `file` (optional) | The headings `get_rule` can return |

Resources: `astras-pet-os://pet-programs.json`, `astras-pet-os://rules/<file>` for each rule file, and
`astras-pet-os://handoffs/<card>.md` for each card.

## Install and register on Astra's PC

The server needs Node.js 20 or newer and its own two dependencies, installed only in `mcp\node_modules`
(`npm ci` in `mcp\`), so the hub itself stays dependency-free. One script does it all and is safe to run again:

```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Documents\Astra's PetOS\astras-pet-os\mcp\register-astras-pet-os-mcp-20261026.ps1"
```

It runs `npm ci` in `mcp\`, runs the tests with the SDK required, then registers the server as `astras-pet-os` with
each client it finds, backing up each config file first. `-Clients ClaudeCode,Codex` limits it; `-SkipInstall` and
`-SkipTest` skip those steps. Afterwards, quit and reopen Claude Desktop, and start a new Claude Code or Codex session.

By hand instead (after `npm ci` in `mcp\`):

**Claude Code** (PowerShell; `$env:USERPROFILE` is filled in when you run it):

```powershell
claude mcp add --scope user astras-pet-os node "$env:USERPROFILE\Documents\Astra's PetOS\astras-pet-os\mcp\server-20261026.mjs"
```

In a project `.mcp.json`, Claude Code fills in `${USERPROFILE}` itself:

```json
{
  "mcpServers": {
    "astras-pet-os": {
      "command": "node",
      "args": ["${USERPROFILE}\\Documents\\Astra's PetOS\\astras-pet-os\\mcp\\server-20261026.mjs"]
    }
  }
}
```

**Claude Desktop** (`%APPDATA%\Claude\claude_desktop_config.json`). It does not fill in `%USERPROFILE%`, so write the
full path, with your Windows user name in place of `<you>` (`echo %USERPROFILE%` shows it). Forward slashes work on
Windows and need no escaping; with backslashes, write each one twice (`\\`):

```json
{
  "mcpServers": {
    "astras-pet-os": {
      "command": "node",
      "args": ["C:/Users/<you>/Documents/Astra's PetOS/astras-pet-os/mcp/server-20261026.mjs"]
    }
  }
}
```

**Codex** (`%USERPROFILE%\.codex\config.toml`; a double-quoted TOML string, because the path has an apostrophe):

```toml
[mcp_servers.astras-pet-os]
command = "node"
args = ["C:/Users/<you>/Documents/Astra's PetOS/astras-pet-os/mcp/server-20261026.mjs"]
```

If a client cannot find `node`, put the full path to `node.exe` in `command` (`where node` shows it); the script does
this already. The server finds the hub from its own folder; `ASTRAS_PET_OS_ROOT` points it at another copy.

## Tests

`npm test` in the hub runs `test/astras-pet-os-mcp-test-20261026.mjs`. Its first part checks the data side (Node's
built-in modules only) against a stand-in farm and the real files, so it always runs. Its second part starts the real
server with the SDK's own client, in-process and over stdio, and calls every tool and resource; it needs `npm ci` in
`mcp\` and is skipped with that reason when the install is missing. `ASTRAS_PET_OS_MCP_REQUIRE_SDK=1` makes a missing
install fail instead (the register script sets it). `npm test` in `mcp\` runs the same file.

## Not done yet

- Not registered on Astra's PC, and the PowerShell script has not been run on Windows yet.
- The client config details (Claude Desktop's file, `claude mcp add`, Codex's `config.toml`, `${USERPROFILE}` in
  `.mcp.json`) were written from the clients' documented behaviour and are checked only when the script runs on her PC.
