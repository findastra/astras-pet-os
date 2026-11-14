# show-pet-panel says "Use when" and "Not for" (2026-11-12)

Astra, 2026-11-12: "All recommended" on Luna's Log card 011 (Skill Scout's audit of the farm's skills and rules
files), error 10: about 20 skill descriptions never said when to use them in the words assistants look for (census
rule SS004). Two of them are the hub's; this change does one:

- `skills/show-pet-panel`: "Use at the start of every task that touches a pet ..." becomes "Use when a task touches a
  pet ...: at its start, and again after changing that page. Not for a page that is not a pet's program page (that is
  show-working-copy)." One line, 422 characters, under Codex's safe size of 500. The rest of the skill is unchanged.
- `skills/dev-mindset` is left to the card 011 chat, which owns that file for its task corrections (after #327). The
  proposed trigger is on card 011.

Luna's Log's skill-install-tool installs the new text for Claude and Codex once this merges (`install --yes --fetch`).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12. The other repos' triggers are on their own pull requests, listed on
Luna's Log card 011.
