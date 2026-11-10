status: open (answered 2026-11-09: all recommended; each yes is being done, one pull request at a time)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-09
needs: docs/mcp-assessment-20261109.md, card 306, #254, #255
---
## Task

Astra, 2026-11-09: "look through all the pets that we have right now and see if there's MCPs out there that are worth
getting for us and do a critical assessment on if I actually would use it with what I have or what I intend to use it
on in the future. And then get a list ready of ones that we think that all of them could use. And tell me if this is
going to benefit for me and how it will." Then: "So MCPs are a L3 trick? Or something else?" She approved the plan in
chat the same day.

## Ownership and state

State: open, waiting on Astra's answers.
Implementer: Claude Opus 5.5, the "Astra's PetOS - MCP Assessment" chat; writable files: the three files of #319;
ownership: released after this commit.
Reviewer: unassigned; next action: Astra answers the deck, then one pull request per yes.

## What I did

- `docs/mcp-assessment-20261109.md` (#319): all 87 pets against 29 MCP servers, each with keeper pet, maker, verdict
  and reason; where an MCP server sits in L1 to L4 (a tool at L1, called by the seat at L3); how a yes gets installed
  and registered. `changes/mcp-assessment-20261109.md`.
- The same chart as a private page for Astra ("Astra's PetOS MCP Servers", with a pet finder), and the deck "MCP Server
  Questions": eight questions, recommendations marked, last slide for "all recommended".
- Research: each server's own repo or page, GitHub stars and dates from the GitHub API on 2026-11-09, and Anthropic's
  connector directory.
- Astra asked, 2026-11-09: "Did you make sure to cover when ChatGPT is seated? Or later, Kimi, Qwen, or Copilot, etc.
  or my local models use it?" Added "Which seats can use them" to the doc and the page: MCP belongs to the harness,
  not the model; which seats can use servers on the PC and on the internet; ChatGPT stays an adviser with no access
  unless she changes that rule. Also said who Serena is (Oraios AI's coding tool from #255, not a pet).
- Nothing installed, no config changed, no map node or page changed.
- Tests on this branch: `changes-folder`, `handoff-numbers` and `public-safety`: 12 of 12 pass. Full `npm test`:
  394 of 400 pass, 1 skipped; the same 5 fail on `main` (the Windows farm-setup test and four pet chat helper tests),
  listed in the pull request.

## The eight questions

1. Merge #254 (The Farm's own read-only MCP server) after a rebase, a fix to its install paths and a re-test.
   Recommended: yes.
2. Microsoft Learn's docs server in Claude Code and Codex, kept by PC Master. Recommended: yes, both.
3. MCP Inspector as the checker for every new server, kept by White Hat Weasel. Recommended: yes.
4. alphaXiv and PubMed connectors for Paper Patty. Recommended: both.
5. Yelp connector for Spoonfed Sugarcube. Recommended: yes.
6. Turn off the ten plugin servers that were never signed in to (the plugins' skills stay). Recommended: yes.
7. Serena in #255. Recommended: keep it off and take it out, with the second Context7.
8. Which mail and calendar Astra uses (decides Mail Snail, Calendar Crow, Mommy's Mommies). No recommendation.

**Astra's answers, 2026-11-09:** "All recommended, but I use iCloud and Android, so I guess both google and iCloud."

- 1 to 7: the recommended answer each (yes to #254 after the fix, Microsoft Learn in Claude Code and Codex, MCP
  Inspector kept by White Hat Weasel, alphaXiv and PubMed, Yelp, the ten plugin servers off with their skills kept,
  Serena off and out of #255).
- 8: both. The Google side (her Android phone) can use the Gmail and Google Calendar connectors already connected,
  read-only first, when Mail Snail, Calendar Crow or Mommy's Mommies are built; the iCloud side waits for a safe
  Windows option.

## Found on the PC while checking (not changed here)

- Claude Code's user settings lost the `UnityMCP` entry on 2026-11-09; a backup taken that morning still has it. The
  "Restore Claude Sessions" chat was working on that file, so it stays that chat's to put back. Card 306's first check
  with Unity open is still owed after that.
- For a few hours on 2026-11-09 the global git settings file and Codex's settings folder were only in Documents, and
  git commits failed with "Author identity unknown" (this card's first commits named the noreply identity on the
  command line). By 21:30 both were back in the home folder, git's identity answered again and Codex's config still
  listed node_repl and unityMCP. The "Restore Claude Sessions" chat was told, at Astra's OK ("Yes, tell it").
- #254 and #255 install scripts write Codex's old settings path and the Claude app's private AppData copy.

## Done when

Each of the eight has Astra's answer recorded here; every yes is in its own pull request (registered like `unity-mcp`,
#306), checked from a new chat, merged on her OK; #254 and #255 are merged or closed.

## Return

Record her answers under "The eight questions" with the date, then each pull request's number beside its question.

## Receipt and review

Pending.
