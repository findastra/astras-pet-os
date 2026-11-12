# The MCP Roadmap, and the approved MCP servers on the System Map

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-09, for Astra.

Astra, 2026-11-09, after answering the deck "MCP Server Questions" with "All recommended" (hub card 319): "I want
there to be some kind of listing for this or plan on GitHub, not sure the appropriate way to present it on there. Maybe
it's just a separate MCP Roadmap and it goes with the other roadmaps. I like the table."

- **`docs/mcp-roadmap-20261109.md`**: the MCP Roadmap. It has:
  - the stages a server moves through, as a chart like the README's Pet stages: found, checked, approved, connected,
    on the map;
  - the table of servers, with keeper pet, stage and next step, in four groups: now and next, later, not adopted, and
    the one question still open.
- **README**: an "MCP Roadmap" section after "Pet stages", linking the roadmap and the research
  (`docs/mcp-assessment-20261109.md`, which now points to the roadmap for where each server stands).
- **System Map** (`system-map.json`): the servers she approved, recorded like `unity-mcp` (#306).
  - Nodes: Context7, Microsoft Learn MCP, MCP Inspector, alphaXiv, PubMed, Yelp.
  - Each has a `manages` link from its keeper and `directs` links from Claude Code (and Codex for Microsoft Learn).
  - The keepers are AI Dashund, PC Master, White Hat Weasel, Paper Patty's Paper Girl and Spoonfed.
  - Context7 and MCP Inspector are `now`: one is connected, the other was run that day. The rest are `planned` until
    she connects them and a new chat calls each one once.
- **`pets.json`**: each keeper's `needs.programs` names its server.
- `npm run build -- --metadata-only` put each one in its keeper's 3rd party programs on the pet program pages (AI
  Doghouse, PC Master Race, Paper Girl, Spoonfed, White Hat Lab), the TOOLS-AND-TRICKS.md registry and the System Map.
