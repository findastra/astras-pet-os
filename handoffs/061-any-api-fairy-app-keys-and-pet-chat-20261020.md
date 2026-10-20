status: open (waiting on Astra: A. build API Fairy's first-save check, yes or no; B. the four pet chat questions in the slides)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-20
needs: handoffs/056-any-key-requests-for-api-fairy-20261019.md, handoffs/054-any-cyberhome-link-20261019.md, skills/key-request/SKILL.md, findastra/api-fairy `src/KeyRequests.cs`, findastra/astras-star-window `index.html`, apps/data-dealer-20261008.html
---
## Task

Two threads from the chat "API Fairy" (2026-10-20), paused at Astra's word: "end chat and leave note we will pick up
later".

- **A.** Can API Fairy tell when Astra gives a key to a tool that keeps it inside a web page? Her case: the GitHub key
  for Astra's Window Star. Her words: did API Fairy detect it, how, and if she didn't, put a tool in there.
- **B.** The pet chat window (`<pet>-chat` on every pet program page) must work like Data Dealer's old Data Chip.
  Astra, twice, with Portfolio Puffer's chat panel: "this function is wrong. it needs to function how the old chip on
  datadealer was. he was fully interactive."

## Ownership and state

State: paused. Nothing is built for either thread, and no files are claimed.
Implementer: unassigned. Reviewer: unassigned.
Next action: Astra's answers (A: yes or no; B: the slides). Then whoever picks this up claims a scope here first.

## What I did

Read-only work. This card is the only change: no repo, folder or setting was changed.

### A. API Fairy and the star's key

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

### B. The pet chat window, like Data Chip

Today the chat panel only opens ChatGPT or Claude in a new tab, with the message on the clipboard. A separate Claude
session, "Pet chat window answers in the page, like Data Chip", researched it. Nothing was built and the hub was
unchanged (main at dc496db then). What it reported:

- Data Chip (`apps/data-dealer-20261008.html`, `petAsk()`) answered inside the page only because it ran as a
  claude.ai Artifact with `window.claude.use("sample")`. Opened as a file, it said it could only answer inside Claude.
- Astra opens Puffer's page as a file (Puffer and the hub are private, with no Pages site), so that way cannot work
  there.
- A small helper on her PC (127.0.0.1 only) streamed replies into a file:// page in headless Brave 155 and Edge 155.
  Her everyday Brave might still ask once.
- Codex on her PC is signed in and answered a test message. The desktop app's Claude Code, run on its own, says
  "Not logged in".
- This is card 054's planned "chat on this PC"; card 054's first question is still unanswered. Open PR #162 changes
  the same page generator.

Astra's questions, in her slides ✨ https://claude.ai/artifact/E5dV2dgdALFPEU29yCsuH9 (private to her). Each
recommends A:

1. **How should the chat answer inside the page?** A: a small helper on her PC (127.0.0.1 only) that runs Codex or
   Claude Code in the pet's folder and streams the reply into the window. B: private claude.ai copies of the pages,
   like Data Chip. C: a pay-per-message key pasted into the page.
2. **Who answers on this PC?** A: both, Codex first; Claude Code after she signs it in once.
3. **What may the pet's agent do?** A: read the pet's own folder only. Health Hummy and Finance Finch read nothing.
4. **How does the helper start?** A: quietly at Windows sign-in, with a "Stop pet chat" shortcut.

That session has the full findings and is the one to continue B (Astra's Claude app, linked from the "API Fairy"
chat).

## Done when

- **A.** Astra has answered yes or no on the first-save check. If yes: an api-fairy PR with tests (run them in memory
  with PowerShell `Add-Type`, because Malwarebytes deletes a freshly built `tests.exe`), skills/key-request
  describes the new field, and the star's request moves to "has a key" after her first save. Either way: the old key
  is deleted on GitHub, and the star's request reads `given` once a save with the new key has landed.
- **B.** On Puffer's page the chat answers inside the page as a conversation, like Data Chip, with the pet's own
  context, and the hand-off buttons stay as the fallback. It is checked in the browser with a screenshot, built in
  the generator on a hub branch with a PR, the pages are rebuilt, and `npm test` passes on an LF checkout.
- Every merge needs Astra's OK for that PR.

## Return

Record her answers, claims, PRs and test results in `## What I did` above, and update `status:` and the row in
handoffs/README.md.

## Receipt and review

Pending.
