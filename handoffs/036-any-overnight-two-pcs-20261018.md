status: open (waiting on Astra: the answer sheet and the merges; the desktop PC's jobs are done, the other PC's are its own)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-18
needs: docs/idle-flash-audit-20261017.md, docs/flash-audit-20261014.md, skills/merge-order/SKILL.md, handoffs/035-codex-framework-pull-requests-20261018.md
---
## Two PCs tonight (Astra, 2026-10-18)

Astra, about 05:00: "run all night to fix any errors you know about in this system", then "there is another pc working
alongside you tonight, on this account, please designate jobs / delineate them according to PC specs, hard jobs should
stay on desktop pc".

The two PCs share nothing but GitHub, so this card is how they split the work. **Read it before you start, and do only
your PC's jobs.**

### Desktop PC (8 cores / 16 threads, 32 GB, a discrete graphics card, mains power): the hard jobs, and every write to a pet repo
1. **The Idle Flash Audit of every pet program** ([how to](../docs/idle-flash-audit-20261017.md)), with the tools from
   hub PR #76 (grey and blue dots, A59). About 1,500 GitHub API calls for the audit, then fresh clones of every pet repo.
2. **Every fix branch tonight:** `claude/flash-audit-fixes-20261018` in each pet repo (one pull request each) and the
   hub's A59 fix branch of the same name.
3. **Hub branches** `claude/idle-flash-dots-tools-20261018` (PR #76: fixes to the tools themselves) and
   `claude/idle-flash-audit-20261018` (this card, the round cards, the evidence ledger, the answer sheet).
4. Anything that builds or renders: `npm run build`, the desktop pets (C#), Unity and VRChat (the Liminal Doors chats
   already run here).

### Other PC: light, read-only jobs, written only in its own chat or on its own branch
1. **Checker for hub PR #76** (maker-checker rule, `skills/farm-security` section 7): read the diff, run `npm test` in a
   fresh clone outside `Documents\Astra's PetOS`, and post what is wrong as a review comment on #76. Never push to its
   branch; the desktop fixes what it finds.
2. **Every open pull request across findastra** (42 at 05:00): which ones conflict, which are stale ("close?"), and the
   merge-order chart for Astra's morning ([skills/merge-order](../skills/merge-order/SKILL.md)). Read-only. Do not
   push to any `codex/*` branch or another chat's branch (card 035 is Codex's).
3. **Old handoff cards 001 to 012:** which are already done on GitHub, with the evidence. A list for Astra in its chat;
   no edits to `handoffs/README.md` tonight.

### Rules for both
- **One shared GitHub limit:** 5,000 API calls an hour for the whole account. The desktop's audit takes about 1,500 in
  its first hour; keep the other PC under about 1,000 an hour (`gh api rate_limit`).
- **One writer per repo.** The other PC makes no branch in a pet repo tonight, and neither PC edits a working copy in
  `Documents\Astra's PetOS`: fresh clones in a short temp folder only.
- **Card numbers:** the desktop holds 036 and 037. The other PC takes 038 and up if it needs a card, and adds its row in
  the same commit (on its own branch).
- Nothing merges without Astra's OK in chat. No pushes to `main`, nothing that costs money, signs in, installs or sends.
- Each PC ends with a short report in its own chat; the desktop's goes on this card under "What I did".

## What I did

Desktop PC, Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18, about 04:50 to 05:15 MDT. Nothing was merged, nothing was
pushed to `main`, and no working copy in `Documents\Astra's PetOS` was edited (fresh clones in `%TEMP%\ifa-20261018`).

**The Idle Flash Audit** of programs 3 to 83 and the Farmer's whole-list card (#1), through the GitHub API, with the tools
of hub PR #76 and Goldfish's preflight read first and run from `codex/l3-activity-20261016` (it is not on Goldfish's
`main`; it only inspects the data it is given). About 1,800 of the account's 5,000 calls an hour.
- Round cards, evidence ledger and fix results: [docs/flash-audit-rounds-20261018/](../docs/flash-audit-rounds-20261018/README.md)
  (this branch, PR #77). Every exception starts with its dot; fixed ones say which pull request fixed them.
- Answer sheet (blue-dot decisions only, private to Astra): <https://claude.ai/artifact/MNccdeav6V3cteWdWJ5PUC>,
  collection `answers`. Its own store was read back once: empty, as it should be.

**Fix pull requests** (branch `claude/flash-audit-fixes-20261018`, each clean and mergeable; Astra's OK in chat merges them):

| Repo | Pull request | What it fixes |
| --- | --- | --- |
| mommys-mommies | [#5](https://github.com/findastra/mommys-mommies/pull/5) | README and pet.json link to the renamed repo (A31) |
| voicemeeter-bug | [#3](https://github.com/findastra/voicemeeter-bug/pull/3) | README links to its pet program, Audio Rescue (A59) |
| the-cats-closet | [#2](https://github.com/findastra/the-cats-closet/pull/2) | README "Run it" and "Limits" (A15) |
| the-police-station | [#2](https://github.com/findastra/the-police-station/pull/2) | README "Limits" (A15) |
| ai-doghouse | [#2](https://github.com/findastra/ai-doghouse/pull/2) | README "Limits" (A15) |
| astras-pet-os | [#79](https://github.com/findastra/astras-pet-os/pull/79) | pets.json links Fuzzboi Friend's live program (A59); cage-data.js rebuilt |

The other 76 repos needed nothing that is the Idle Flash Audit's to fix: the 78 fix pull requests of 2026-10-17 are merged.

**Errors fixed in the tools** (hub PR #76, `claude/idle-flash-dots-tools-20261018`; `npm test` 142 pass, 1 skipped):
the refresh script re-applies A59; the cards and the answer sheet carry the run's date and its title; the answer sheet no
longer repeats the first run's answered questions; visibility, art and route questions come from what the run found;
the made-up test folders "me" and "private" are not personal paths; A06 compared a pet's name with its program's map node
(two false alarms); links to renamed repos are fixed, not only reported; seed and roadmap READMEs get a Limits section from
their stage; a pet missing from pets.json is blue (A33); card wording for retired names and the framework checks.
One commit (3f038f6) tripped the public-safety test for a minute with a path in a comment; 62f642b fixed it.

**Cards:** 028 and 033 are done (all their pull requests merged; Astra's answers applied in #75).

**What waits on Astra (answer sheet):**
- Ten pet repos are public on GitHub while pets.json says private: Chip, Voicemeeter Bug, Patch Cat, Meme Fiend (on
  the private-pets list), Gif Giraffe, Backup Beaver, Rift Rabbit, Wifi Butterfly, Mesh Moth, Raspberry Pi Berry.
- Chat Rat is a pipeline pet in pet-programs.json but not in pets.json (registering it is hers, A33); its branch
  `claude/chat-rat-ask-20261017` stays held back (card 035).
- Ten pets have branches with work and no pull request; merging hub PRs #76, #77, #79 and the five fix pull requests.

**Found, for the pet's own chat (code, not overnight):** Voicemeeter Bug's pet.json `entry` is its build script while
the hub shows its page (A59); api-fairy's README and code default to `Documents\Projects`; Paper Girl's README has a
local test address (`terminal.local`); Gif Giraffe and Raspberry Pi Berry say "growing" where the registry says
"hatching" (A16); Role Fairy has no row in INTELLIGENCE-LEVELS.md; 15 pages disagree with their third-party program
lists (A54); Codex's framework parts (A41, A44, A45, A52) wait on card 035.

**Fixes itself:** about 40 profile lines do not link their program yet, because #75 renamed the seed repos after the
profile round last ran. The Farmer's profile round (daily, 12:47 UTC) rewrites them from the hub.

**Not verified:** anything that needs a click, a desktop launch, a sign-in or a person (A11, A19's live part, A22, A37,
A40). **Other PC:** nothing from it on GitHub by 05:15 (no review on #76 yet).

## Done when
The audit's pull requests are open, the round cards and answer sheet are ready, and both PCs have reported.

## Return
Results on this card and in docs/flash-audit-rounds-20261018/; set status: done.
