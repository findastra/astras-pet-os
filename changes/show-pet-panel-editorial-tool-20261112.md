# show-pet-panel serves pages with Skill Scout's editorial-preview-tool

2026-11-12. Astra asked for chats to open the program being worked on in the chat's browser pane by themselves, with
"editorial" shown at the top (2026-11-11), then "Yes, turn it on" for the tool (findastra/lunas-log#10, merged and
installed the same day), and "Yes, do it here" for pointing this skill at it.

- `skills/show-pet-panel/SKILL.md`, "How": serve the page with
  `%USERPROFILE%/.claude/tools/editorial-preview-tool/editorial-preview-tool-20261111.mjs open "<folder>"` instead of
  `python -m http.server`. The tool serves 127.0.0.1 only, one server per folder shared by every chat, adds the
  EDITORIAL bar (repo, branch, commit, merged or not), reloads the page after every save, and serves
  `Documents\Astra's PetOS Data` read-only, so a page served from a worktree still shows its program lights, key
  requests, outstanding items and pet chat. Checked on this branch's `apps/pet-programs/lunas-log-20261018.html`: the
  bar is there and the program-lights data file loads.
- "When": the page reloads by itself. The editorial status panel section names the bar as the second sign. "Never":
  no Artifacts, no Chrome unless she asks.
- The installed copies in `%USERPROFILE%/.claude/skills/show-pet-panel/` and `%USERPROFILE%/.codex/skills/show-pet-panel/`
  are updated after the merge.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12. Card 010 in findastra/lunas-log, item 3.
