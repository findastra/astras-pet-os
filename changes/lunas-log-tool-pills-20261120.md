# Luna's Log's two new tools as pills (2026-11-20)

Card 011 in findastra/lunas-log built two tools for Skill Scout's program (2026-11-11 and 2026-11-12). Every pull
request on that card is merged, and on 2026-11-20 the install check found 45 of 45 copies the same as their masters.
The last item on the card's "Not done" list (item 7) was the hub side: the two tools were missing from Luna's Log's pet
program page.

- `system-map.json`: two `tool` nodes with `"of": "program-40"`, copied from the node shape of Luna's Log's other tools
  (`skill-census`, `skill-lint`, `skill-diff`, `public-snapshot`) and placed right after them:
  - `skill-files-tool`: the six-tab viewer of every skill, agent and rules file Claude and Codex read (where they live,
    what you write and what you get, every skill, rules and memory, the errors we keep having, how to organize). Read
    only; its data file holds private text and stays on the PC.
  - `skill-install-tool`: `plan`, `install --yes`, `check` and `retire-old --yes`; copies each skill's master from
    GitHub's main into `~/.claude/skills` and `~/.agents/skills`, with a backup and `receipt.json` for every folder it
    replaces.
- Names follow `<what>-<category>`, as the tools are named in Luna's Log. No `url` and no `embed`: the repo is private and
  the viewer's data never leaves the PC, the same as the other four tools.
- Rebuilt with `npm run build`: `apps/pet-programs/lunas-log-20261018.html` (L1's "Native tools" goes from 4 to 6),
  `TOOLS-AND-TRICKS.md`, `markdown-pets/all-pets-20261019.md`, `markdown-pets/lunas-log-20261019.md` and
  `system-map-20261012.html`.
- Nothing else changes: no program, grant, link, light check or other pet.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
