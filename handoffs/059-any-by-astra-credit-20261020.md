status: open (the hub part merged with #161; waits on Astra: the 82 pet repo pull requests, then the repo descriptions)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-20
needs: PET-FILES.md (README row), docs/flash-audit-20261014.md (A15), scripts/farmer-rounds-20261009.mjs, scripts/idle-flash-audit-20261017.mjs, scripts/idle-flash-fix-20261017.mjs, scripts/idle-flash-new-repos-20261017.mjs, scripts/idle-flash-refresh-20261018.mjs, scripts/pet-program-link-20261018.mjs, apps/github-goldfish-20261008.html, test/credit-line-readme-only-test-20261019.mjs
---
## What I did

Astra, 2026-10-20, with a screenshot of the-astral-plane's README: "still seeing this phrase where it shouldnt be, in
all of the pet prorograms". The rule of 2026-10-19 (hub #113, card 052) had kept card 033's credit line once, at the
top of each pet repo's own README; every pet repo is also its pet program's repo, so that put it in all of them. One
question deck asked which READMEs keep it. Her answer: **"A (recommended). Take [the line] out of every pet repo's
README and write 'By Astra.' where a credit is needed."**

On branch `claude/by-astra-credit-20261020` of the hub (in a clone in Claude's scratchpad; Astra's PC folders were
not touched):
- **The rule:** PET-FILES.md's README row says the credit is `*By Astra.*`, and that a README that still has a retired
  credit line (card 033's, or the "pet app" line before it) is reported. Flash Audit A15 and
  `docs/idle-flash-audit-20261017.md` say the same.
- **The checks:** the Farmer's round (`auditPet`) now says "my README has the old credit line" for a retired line and
  "my README needs "By Astra."" when there is no credit; it names the retired line and never quotes it, so the
  generated status file and the Farmer's desk stay clean. The Idle Flash audit (A15) reports a retired line as
  Incorrect; its fix script changes a retired line to `*By Astra.*` (or adds it); the new-repo script writes
  `*By Astra.*`; the 2026-10-18 refresh script writes "By Astra" if it is ever run again; the README link script
  still finds the credit line (old or new) to put the Pet program link under it. The hub's copy of GitHub Goldfish
  reports a retired line too.
- **The guard:** `test/credit-line-readme-only-test-20261019.mjs` now fails on the retired line anywhere, READMEs
  included, except history (cards, the dated Flash Audit rounds), tests and the checkers above; a second test checks
  that the hub README and the draft pets' READMEs have `*By Astra.*`.
- **The hub's own README** and `drafts/pole-puff/README.md` say `*By Astra.*`. AGENTS.md has a credit line.
- **Tests:** `test/rounds-test-20261009.mjs` (a retired line is a finding that never quotes it; "By Astra." passes) and
  the fixtures of `test/idle-flash-dots-test-20261018.mjs`. `npm test` in an LF clone: 240 tests, 239 pass, 0 fail,
  1 skipped (the Pets Board); `node scripts/build.mjs --metadata-only` changes nothing else.

In the pet repos, each on branch `claude/by-astra-credit-20261020` with its own pull request (the list is below):
- **82 READMEs:** `*An Intelligent App, or Pet, by Astra.*` becomes `*By Astra.*`; nothing else changes. The 82 are
  every findastra repo whose README had the line (checked through the GitHub API for all 104 repos, 2026-10-20).
- **github-goldfish** also: its README checker (`github-goldfish-20261008.html` and its copy `index.html`) reports a
  retired line and asks for "By Astra."; its AGENTS.md rule and README table say so; `test/engine.test.mjs` covers it
  (66 of 66 pass).
- **lunas-log** also: `templates/AGENTS-TEMPLATE.md` and `proposals/pet-app/SKILL.md` say "By Astra." (29 of 29 pass).
  Its 2026-10-17 census data and skill review keep their wording, as records.
- **workflow-whirlpool:** the pull request goes into its only branch, Codex's `codex/workflow-whale-20261018`.

Kept as written, on purpose: cards, the dated Flash Audit rounds and ledger, art prompts and provenance notes
(`desktop-art/mine-mole/prompt-20261011.md`, `spoonfed/sugarcube-art-provenance-20261011.md`), github-goldfish's own
old cards. No installed skill copy on the PC (`~/.claude/skills`, `~/.codex`) had the line.

**Where it stands (2026-10-20, end of that chat):** the hub pull request merged with Astra's OK as #161
(`dc496db`, after main's #152 and #160 were merged into it; 240 of 241 tests passed on the merged tree). All 82 pet
repo pull requests are open and their branches on GitHub match what was tested; none is merged. Later the same day
Astra made most repos private, the hub included (the hub's records follow in #167, open): that changes nothing in
these README-only pull requests, but merge them through GitHub as before. The local clones were in
Claude's scratchpad only; nothing is left unpushed.

## Task

1. **Merge** (waits on Astra's OK): the hub pull request first, since its checks change, then the 82 pet repo pull
   requests (README only, so their order does not matter).
2. **Repo descriptions (waits on Astra's OK; a public settings change):** 14 GitHub repo descriptions still call the
   pet "a pet app by Astra": spoonfed, rgbee, chat-rat, wifi-butterfly, rift-rabbit, raspberry-berry, patch-cat,
   mine-mole, mesh-moth, meme-fiend, mail-snail, fuzzboi-friend, deck-duck, astras-gif-maker (and the retired word
   "pet app" in each). With her OK: `gh repo edit findastra/<repo> --description "<new words>"`, each new description
   ending "By Astra." or leaving the credit out.
3. **The next Farmer's round** rewrites `status/pets-status.json`, the Farmer's desk and the pet program pages'
   "Last check" lines, which still say "my README needs the credit line" from the round before this change.
4. **Card numbers:** #155 (developer mode) and #136 (aquarium) still carry 058 and 057 and renumber to 060 and up
   when they merge.

## Done when

Every pull request below is merged, the next round shows no credit finding, and the descriptions are changed or
Astra said to leave them.

## Return

Update `## What I did` with the merges; set `status: done`.

## The pull requests

| Repo | Pull request |
| --- | --- |
| agent-colony | [agent-colony#2](https://github.com/findastra/agent-colony/pull/2) |
| ai-doghouse | [ai-doghouse#4](https://github.com/findastra/ai-doghouse/pull/4) |
| api-fairy | [api-fairy#9](https://github.com/findastra/api-fairy/pull/9) |
| astras-gif-maker | [astras-gif-maker#3](https://github.com/findastra/astras-gif-maker/pull/3) |
| backup-beaver | [backup-beaver#5](https://github.com/findastra/backup-beaver/pull/5) |
| bamboo-studio | [bamboo-studio#2](https://github.com/findastra/bamboo-studio/pull/2) |
| benchmark-rock | [benchmark-rock#2](https://github.com/findastra/benchmark-rock/pull/2) |
| browser-belfry | [browser-belfry#2](https://github.com/findastra/browser-belfry/pull/2) |
| cache-canyon | [cache-canyon#2](https://github.com/findastra/cache-canyon/pull/2) |
| chat-rat | [chat-rat#10](https://github.com/findastra/chat-rat/pull/10) |
| cipher-hollow | [cipher-hollow#2](https://github.com/findastra/cipher-hollow/pull/2) |
| claude-bot | [claude-bot#4](https://github.com/findastra/claude-bot/pull/4) |
| cluster-shore | [cluster-shore#2](https://github.com/findastra/cluster-shore/pull/2) |
| container-hoard | [container-hoard#2](https://github.com/findastra/container-hoard/pull/2) |
| crows-nest | [crows-nest#2](https://github.com/findastra/crows-nest/pull/2) |
| data-dealer | [data-dealer#10](https://github.com/findastra/data-dealer/pull/10) |
| data-marsh | [data-marsh#2](https://github.com/findastra/data-marsh/pull/2) |
| deck-duck | [deck-duck#7](https://github.com/findastra/deck-duck/pull/7) |
| drum-dog | [drum-dog#8](https://github.com/findastra/drum-dog/pull/8) |
| dubstep-armory | [dubstep-armory#2](https://github.com/findastra/dubstep-armory/pull/2) |
| evidence-locker | [evidence-locker#10](https://github.com/findastra/evidence-locker/pull/10) |
| file-master | [file-master#10](https://github.com/findastra/file-master/pull/10) |
| finance-finch | [finance-finch#7](https://github.com/findastra/finance-finch/pull/7) |
| findastra-discord-presence | [findastra-discord-presence#31](https://github.com/findastra/findastra-discord-presence/pull/31) |
| fuzzboi-friend | [fuzzboi-friend#5](https://github.com/findastra/fuzzboi-friend/pull/5) |
| ghost-protocol | [ghost-protocol#7](https://github.com/findastra/ghost-protocol/pull/7) |
| github-goldfish | [github-goldfish#21](https://github.com/findastra/github-goldfish/pull/21) |
| health-hummy | [health-hummy#7](https://github.com/findastra/health-hummy/pull/7) |
| infinite-studio | [infinite-studio#2](https://github.com/findastra/infinite-studio/pull/2) |
| iron-gates | [iron-gates#2](https://github.com/findastra/iron-gates/pull/2) |
| journal-lagoon | [journal-lagoon#2](https://github.com/findastra/journal-lagoon/pull/2) |
| kernel-grove | [kernel-grove#2](https://github.com/findastra/kernel-grove/pull/2) |
| learn-python | [learn-python#6](https://github.com/findastra/learn-python/pull/6) |
| linux-iceberg | [linux-iceberg#6](https://github.com/findastra/linux-iceberg/pull/6) |
| log-den | [log-den#10](https://github.com/findastra/log-den/pull/10) |
| lunas-log | [lunas-log#4](https://github.com/findastra/lunas-log/pull/4) |
| mail-snail | [mail-snail#7](https://github.com/findastra/mail-snail/pull/7) |
| market-meadow | [market-meadow#2](https://github.com/findastra/market-meadow/pull/2) |
| meme-fiend | [meme-fiend#6](https://github.com/findastra/meme-fiend/pull/6) |
| mesh-moth | [mesh-moth#6](https://github.com/findastra/mesh-moth/pull/6) |
| mine-mole | [mine-mole#7](https://github.com/findastra/mine-mole/pull/7) |
| model-library | [model-library#2](https://github.com/findastra/model-library/pull/2) |
| nessis-ocean | [nessis-ocean#2](https://github.com/findastra/nessis-ocean/pull/2) |
| osc-sonar | [osc-sonar#2](https://github.com/findastra/osc-sonar/pull/2) |
| packet-river | [packet-river#10](https://github.com/findastra/packet-river/pull/10) |
| paper-girl | [paper-girl#5](https://github.com/findastra/paper-girl/pull/5) |
| passport-harbor | [passport-harbor#2](https://github.com/findastra/passport-harbor/pull/2) |
| patch-cat | [patch-cat#7](https://github.com/findastra/patch-cat/pull/7) |
| photo-roost | [photo-roost#2](https://github.com/findastra/photo-roost/pull/2) |
| platform-platypus | [platform-platypus#7](https://github.com/findastra/platform-platypus/pull/7) |
| port-web | [port-web#2](https://github.com/findastra/port-web/pull/2) |
| portfolio-puffer | [portfolio-puffer#9](https://github.com/findastra/portfolio-puffer/pull/9) |
| project-parrot | [project-parrot#7](https://github.com/findastra/project-parrot/pull/7) |
| proxy-lake | [proxy-lake#3](https://github.com/findastra/proxy-lake/pull/3) |
| raspberry-berry | [raspberry-berry#6](https://github.com/findastra/raspberry-berry/pull/6) |
| rgbee | [rgbee#7](https://github.com/findastra/rgbee/pull/7) |
| rift-rabbit | [rift-rabbit#7](https://github.com/findastra/rift-rabbit/pull/7) |
| roam-map | [roam-map#2](https://github.com/findastra/roam-map/pull/2) |
| role-fairy | [role-fairy#8](https://github.com/findastra/role-fairy/pull/8) |
| server-hearth | [server-hearth#2](https://github.com/findastra/server-hearth/pull/2) |
| shell-trench | [shell-trench#2](https://github.com/findastra/shell-trench/pull/2) |
| spoonfed | [spoonfed#7](https://github.com/findastra/spoonfed/pull/7) |
| storage-warren | [storage-warren#2](https://github.com/findastra/storage-warren/pull/2) |
| sync-stream | [sync-stream#2](https://github.com/findastra/sync-stream/pull/2) |
| task-island | [task-island#2](https://github.com/findastra/task-island/pull/2) |
| test-track | [test-track#2](https://github.com/findastra/test-track/pull/2) |
| the-astral-plane | [the-astral-plane#11](https://github.com/findastra/the-astral-plane/pull/11) |
| the-cats-closet | [the-cats-closet#4](https://github.com/findastra/the-cats-closet/pull/4) |
| the-police-station | [the-police-station#3](https://github.com/findastra/the-police-station/pull/3) |
| the-recovery-room | [the-recovery-room#2](https://github.com/findastra/the-recovery-room/pull/2) |
| the-threshold | [the-threshold#4](https://github.com/findastra/the-threshold/pull/4) |
| the-triage-desk | [the-triage-desk#2](https://github.com/findastra/the-triage-desk/pull/2) |
| threat-observatory | [threat-observatory#2](https://github.com/findastra/threat-observatory/pull/2) |
| token-canopy | [token-canopy#3](https://github.com/findastra/token-canopy/pull/3) |
| unity-unicorn | [unity-unicorn#26](https://github.com/findastra/unity-unicorn/pull/26) |
| update-tidepool | [update-tidepool#2](https://github.com/findastra/update-tidepool/pull/2) |
| video-vault | [video-vault#2](https://github.com/findastra/video-vault/pull/2) |
| voicemeeter-bug | [voicemeeter-bug#9](https://github.com/findastra/voicemeeter-bug/pull/9) |
| vscode-angel | [vscode-angel#10](https://github.com/findastra/vscode-angel/pull/10) |
| white-hat-lab | [white-hat-lab#2](https://github.com/findastra/white-hat-lab/pull/2) |
| wifi-butterfly | [wifi-butterfly#6](https://github.com/findastra/wifi-butterfly/pull/6) |
| workflow-whirlpool | [workflow-whirlpool#3](https://github.com/findastra/workflow-whirlpool/pull/3) |
