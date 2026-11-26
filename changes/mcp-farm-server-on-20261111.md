# The Farm's own MCP server is on; the plugin servers stay as they are

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-11, for Astra.

Astra, 2026-11-11: "Can you just do all this stuff for me?" (after #322, the MCP Roadmap, merged).

- **The Farm's own read-only MCP server (`astras-pet-os-mcp`, #254) is registered and works on her PC.**
  - Its register script ran outside the Claude app (started through Explorer), after the "Restore Claude Sessions"
    chat released `~/.claude.json` for that one write.
  - Results: `claude mcp list` shows it Connected, `codex mcp list` shows it enabled, and one `get_pet` call answered.
  - `system-map.json`: its node goes from `planned` to `now`. The MCP Roadmap's row 1 and
    `docs/astras-pet-os-mcp-20261026.md` say so.
- **The ten plugin servers that wait for a sign-in stay as they are**, the recommended choice. The roadmap says why.
- **Card 319** records what was done and what still waits on her:
  - the four connectors (Microsoft Learn, alphaXiv, PubMed, Yelp) need her claude.ai sign-in;
  - the Unity check waits for the D: drive.
