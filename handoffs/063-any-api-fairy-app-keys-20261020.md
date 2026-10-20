status: open (waiting on Astra: delete the star key that showed in a screenshot; yes or no on API Fairy's first-save check)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-20
needs: handoffs/062-any-pet-chat-in-page-20261020.md, handoffs/056-any-key-requests-for-api-fairy-20261019.md, skills/key-request/SKILL.md, findastra/api-fairy `src/KeyRequests.cs`, findastra/astras-star-window `index.html`
---
## Task

From the chat "API Fairy", 2026-10-20. Astra ended it the same day ("merge what you can and leave a note we are ending
this chat"); this card is that note.

**Can API Fairy tell when Astra gives a key to a tool that keeps it inside a web page?** Her case is the GitHub key for
Astra's Window Star. She asked whether API Fairy detected it, and how, and if she didn't, to put a tool in there.

The same chat also started the pet chat work: the chat window should answer inside the page like Data Dealer's old
Data Chip. That has its own card, **062** (written in #172, carried by #173), with Astra's four questions. It is not
repeated here.

## Ownership and state

State: paused. Nothing is built, and no files are claimed.
Implementer: unassigned. Reviewer: unassigned.
Next action: Astra deletes the key that showed and makes a new one, then answers yes or no on the first-save check.
Whoever picks this up claims a scope here first.

## What I did

Read-only work. This card and its rows in handoffs/README.md are the only changes: no repo, folder or setting was
changed.

Astra made the star's fine-grained key on 2026-10-20 (named `astras-star-window`, this repo only, expires
2026-11-19). Findings:

- **API Fairy did not catch it, and today she can't.** The star's key request
  (`20261019-astras-star-window-github-token`, in her PC-only key-requests folder, see skills/key-request) has
  `where: "app"`. In api-fairy `src/KeyRequests.cs`, `See()` returns `cannot-see` for every `app` key ("It goes
  inside another program's own settings, where I can't look."). Her scanner only looks by name, in Windows
  environment variables and the `.env` folders she watches. Her page keeps the request under Waiting, status
  `requested`.
- She was not running when checked (no process), and her page data was last written at 00:28 MT on 2026-10-20,
  before the key was made.
- GitHub shows the key as "Never used". The star repo has no commit yet with the editor's save suffix
  "(Astra's Window Star, Portfolio Puffer's tool)"; its `main` is at 1863de9.
- Why the star needs a key: Capture commits the new picture to findastra/astras-star-window from the page (Git Data
  API). A web page cannot write to GitHub without one. Without a key, the star downloads a zip instead.
- **Security, not confirmed done:** Astra's screenshot of GitHub's token page showed the whole key in that chat. She
  was told to Delete that key on GitHub and make a new one, pasting it straight into the star without a screenshot.
  The value is not written anywhere in this card.
- Likely Brave snag, not tested: a key pasted into the star inside Puffer's page (an embedded frame on a file:// page)
  may be stored apart from the star's own page and may be forgotten. Connecting on "Open it on its own page" is
  safer.

**Proposal waiting on Astra (not built):** API Fairy watches for a key's first use where it shows from outside. For
the star: check the public repo's commits (api.github.com, no sign-in) for the editor's save suffix after the
request's `asked` date. When one is found, the request moves to "has a key", and the found-in text says a save landed
on GitHub after the key was asked for. This could be a general optional request field, for example
`seen_by: { github_commits: { repo, message_contains } }`.
- Catch 1: API Fairy has no network code today (no HttpClient, WebRequest or WebClient in `src/`). This would be her
  first time online, sending only a public repo's name, never a key.
- Catch 2: it detects the first use, not the key being made. GitHub has no API that lists a user's own personal
  access tokens. If the repo turns private, the check without sign-in fails and shows `cannot-see`.

Meanwhile, once her new key saves, any chat sets the request's `status` to `given` with a `status_date`
(skills/key-request, step 5).

Numbering: this card and the pet chat card (#172) were both written as 061. Codex's RGBee card reached `main` first
as 061 (6b7fd23), so the pet chat card is now 062 and this one is 063. This branch (#173) carries both notes, so
merging #173 alone lands them; #172 is then replaced and can be closed. Merging needs Astra to name the PR: a general
"merge what you can" was refused by the permission check (2026-10-20).

## Done when

- The key that showed is deleted on GitHub, and a new one saves from the star.
- The star's request reads `given` once a save with the new key has landed.
- Astra has answered yes or no on the first-save check. If yes: an api-fairy PR with tests (run them in memory with
  PowerShell `Add-Type`, because Malwarebytes deletes a freshly built `tests.exe`), skills/key-request describes the
  new field, and the star's request moves to "has a key" by itself after her first save.
- Every merge needs Astra's OK for that PR.

## Return

Record her answers, claims, PRs and test results in `## What I did` above, and update `status:` and the row in
handoffs/README.md.

## Receipt and review

Pending.
