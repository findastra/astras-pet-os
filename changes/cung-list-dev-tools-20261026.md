# The Cung List: Context7, Serena, Superpowers and the PC install script (2026-10-26)

Astra asked for "the Cung List": 15 ideas from Tyson Cung's public GitHub, fitted to her own repos, free tiers only,
one branch and one pull request per work item. This branch holds items 2, 4 and 7, the list itself and the one script
her PC runs.

- `.mcp.json`: Claude Code's project file for MCP servers, with Context7 (Upstash's hosted server) and Serena (run by
  uvx, Claude Code context, this project, one tool per action). `.serena/project.yml` reads JavaScript with the
  TypeScript language server; Serena's memories stay out of git.
- `skills/pet-app/SKILL.md`: building a new pet follows six stages (brainstorm, written plan, test first, build,
  self-review, verification), the Superpowers method fitted to the existing steps, none dropped; how to install the
  Superpowers plugin, and which rule wins where it disagrees with the hub.
- `docs/cung-list-20261026.md`: all 15 items, where each landed, its status and what is left for her PC; the Codex
  `config.toml` lines.
- `scripts/cung-list-install-20261026.ps1`: one script, safe to run again, for Ollama, Node.js LTS (only when
  missing), uv and a first Serena download, Docker Desktop (only on a yes), Gemini CLI, Dyad and a ccusage test run.
- `test/cung-list-dev-tools-test-20261026.mjs`: checks the script's text, the winget ids and commands against the
  docs, `.mcp.json`, the skill's stages and the list.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-26, branch `claude/cung-list-dev-tools-20261026`.

Review fixes (2026-10-26): Serena pinned to the tested commit `9e1cced0c34ed48d668e179f7c56c77b4d14a3e3` and switched from
the `claude-code` context (its prompt forbids Claude's built-in Read and Edit on code files) to `ide` (forbids nothing),
re-checked with the MCP handshake (23 tools); the install script names its real test file, and the test now checks every
repo path the script names and the Serena pin. Claude Opus 5.5 (`claude-opus-5-5`).
