# System Map: Start here, and a Developer switch next to 2D | 3D (2026-11-17)

Astra, 2026-11-17: "someone looking at it for the first time needs clearer instructions on what is going on, but
mainly just at the very core of it ... what we need actually is a 2D switch, a 3D switch, and a developer switch. And
the developer would name these things what they actually really are." A cybersecurity engineer will read the map.

- `scripts/system-map-template-20261012.html`:
  - **Start here** at the top of the key, in four numbered lines: read it from the middle out, what the glass is, what
    lies outside it, and what the lines and clicks show.
  - **Developer** button in the bottom bar, next to 2D | 3D. It is the pages' existing developer words
    (`?words=developer`, remembered in this browser), so 2D and 3D both work in either words. In developer words the
    key opens with an **Architecture overview** instead of Start here (a trust-zone diagram; rings are logical trust
    zones, not CPU protection rings; grants are R W X at privilege levels L1 to L4; ✓ In code / ⚠︎ Rule only /
    ○ Not built = technical control / policy / not built), and the two key sections are titled by their standard names.
  - Each ring in the key shows its developer name, what lives there, and its standard term on a small line below.
- `system-map.json` `rings.list[].dev`: the developer name, standard term and description of every ring (trusted core
  (TCB), orchestrator, agents, first-party code, trust boundary, LLM providers, software supply chain, asset
  inventory, external advisory AI, owner (L4)). Drafts from the dev-mindset glossary until Astra reviews them.
- The trust boundary's description says plainly that today the agents run inside Claude Code or Codex, so the line is
  mostly policy; the enforced controls are the grants marked In code.
- `scripts/system-map-20261012.mjs`: PROTECTION-RINGS.md's rings table gains a Standard term column from the same data.
- Not changed: the word swap for pet names (for example "Fuzzbois Site Agent Control Hub") in
  `developer-words-20261019.json`, still `reviewed: false`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-17.
