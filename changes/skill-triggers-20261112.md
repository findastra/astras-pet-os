# dev-mindset and show-pet-panel say "Use when" and "Not for" (2026-11-12)

Astra, 2026-11-12: "All recommended" on Luna's Log card 011 (Skill Scout's audit of the farm's skills and rules
files), error 10: about 20 skill descriptions never said when to use them in the words assistants look for (census
rule SS004). Two of them are the hub's:

- `skills/dev-mindset`: "Use in every conversation about ..." becomes "Use when a conversation is about Astra's PetOS
  design, naming, docs or code (every such conversation). Not for everyday words that are not programming terms."
- `skills/show-pet-panel`: "Use at the start of every task that touches a pet ..." becomes "Use when a task touches a
  pet ...: at its start, and again after changing that page. Not for a page that is not a pet's program page (that is
  show-working-copy)."

Each stays one line, under 500 characters (383 and 422), Codex's safe size. The rest of both skills is unchanged.
Luna's Log's skill-install-tool installs the new text for Claude and Codex once this merges
(`install --yes --fetch`).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12. The other repos' triggers are on their own pull requests, listed on
Luna's Log card 011.
