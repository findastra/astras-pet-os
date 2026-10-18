status: taken by Claude Opus 5.5 on the desktop PC (Idle Flash Audit, overnight 2026-10-18); the other PC takes the "Other PC" jobs below
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
(The desktop fills this in by morning.)

## Done when
The audit's pull requests are open, the round cards and answer sheet are ready, and both PCs have reported.

## Return
Results on this card and in docs/flash-audit-rounds-20261018/; set status: done.
