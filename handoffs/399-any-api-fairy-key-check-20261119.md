status: open (waiting on Astra: merge this pull request and findastra/api-fairy#14)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-19
needs: system-map.json, skills/key-request/SKILL.md, findastra/api-fairy README ("Key check: no key leaves in a push")
---
## Task

Astra, 2026-11-12: "I need a secrets manager or an API key manager because people are vibe coding and ... leaking
them onto the internet on their public repositories ... do some research on how I should be managing my API keys".
Then "get all of this started. I want to do all of these recommendations", and on 2026-11-19, to the five key safety
questions, "all recommended". Question 5: make the key check one of API Fairy's tools.

## Ownership and state

State: READY_FOR_REVIEW
Implementer: Claude Opus 5.5, this chat; writable files: the ones listed below; ownership: held until merge
Reviewer: none yet

## What I did

- 2026-11-12, on Astra's PC (no repo): a full leak check found no real key in any of the 114 findastra repos, any
  project folder or any git history; push protection turned on for `iris-the-origin-story` (all 29 public repos now
  covered); the key check installed for every push through the global git config (`hook.key-check`, event
  `pre-push`, git 2.55 config hooks, so each repo's own hooks still run).
- findastra/api-fairy#14 (branch `claude/key-check-tool-20261119`, c65ae5c): the key check's source as
  `tools/key-check-20261112.ps1`, with `-Install` for a new PC, `tests/key-check-test-20261119.ps1` (8 checks pass),
  a README section and a changes note.
- This branch, `claude/api-fairy-key-check-node-20261119`: `system-map.json` tool node `key-check`
  (`api-fairy-ring-v1.0-key-check-v1.0`, of `key-ring`, no url because findastra/api-fairy is private) and the
  `key-ring` → `key-check` `opens` link; rebuilt by `npm run build` (API Fairy Ring's page, the System Map page,
  `TOOLS-AND-TRICKS.md`, `markdown-pets/`).

## Not done / next (Astra's other four answers, 2026-11-19)

- Bitwarden for keys (account, then `bws run` for the pets): Astra makes the account; nothing installed yet.
- Both YubiKeys on her Microsoft account, GitHub, Google account and Bitwarden: she adds them, one page at a time.
- `OPENAI_API_KEY` renamed to `FARM_ART_OPENAI_API_KEY` in its three programs: a separate change (another chat).
- OpenAI monthly limit $10, auto-recharge off: Astra sets it on OpenAI's page.
- PR #343 (API Fairy Ring page) also adds key-ring tool nodes next to this one; whichever merges second takes a
  one-line merge in `system-map.json`.

## Receipt and review

Pending.
