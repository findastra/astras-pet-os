# Astra's task corrections move from Claude's memory into the skills for those tasks

2026-11-12. Skill Scout's card 011 (findastra/lunas-log), decision 5, approved by Astra: "Merge 1–5, approve 6". Her
every-chat corrections went into both global rules files. The corrections that belong to one task go into that task's
skill, so that Codex and new chats get them too, not only a Claude chat that happens to open the memory note.

- `skills/merge-order`: her own message names the pull requests, and closing counts too; re-scan every open pull
  request in the repo right before a merge; point a stacked pull request at `main` before merging its base; in the hub,
  take main's generated files after a conflict, then build and test.
- `skills/questions-as-slides`: answered stays answered (never re-ask or recommend a different answer); ✨ marks only
  what she must answer.
- `skills/pet-app`: show the working copy with `show-working-copy`, never the live page, before the first edit.

Not here: dev-mindset (#327 is changing it), and the Unity corrections, which went to Unity Stable's own
`vrchat-unity-world` skill in findastra/unity-unicorn.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-12.
