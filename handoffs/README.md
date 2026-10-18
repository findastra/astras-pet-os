# Handoffs

Task cards for whichever assistant picks them up. Format and rules:
[skills/handoff/SKILL.md](../skills/handoff/SKILL.md). Every card has a `## What I did` section
that lists explicitly what was changed, where, and what is not done.

To start: "Take the next open card for <you | any> in findastra/astras-pet-os."

| Card | For | Status |
| --- | --- | --- |
| [039: Installer "Set up your farm": Astra's example pets or from scratch](039-any-farm-setup-installer-20261018.md) | any | done 2026-10-18: #88 merged, v0.2.0-beta released, "core pets" kept |
| [036: Two PCs tonight: which jobs each one does, and the overnight Idle Flash Audit](036-any-overnight-two-pcs-20261018.md) | any | open, waits on Astra: the answer sheet (merges OK'd 2026-10-18) |
| [035: Codex framework pull requests, and branches that conflict with main](035-codex-framework-pull-requests-20261018.md) | Codex | open: 17 Codex pull requests to bring up to date; 3 branches held back for Astra |
| [033: Credit line "An Intelligent App, or Pet, by Astra." in every repo](033-any-intelligent-app-credit-line-20261018.md) | any | done 2026-10-18: all 29 pull requests merged |
| [032: The desktop pets read only the hub: draft list, rebuild, restart](032-any-desktop-reads-only-the-hub-20261018.md) | any | open, after Astra merges #60 and #58 |
| [031: Rebuild the desktop exe for group 3's one scale, keeping the Goldfish triple-click](031-codex-rebuild-desktop-girls-same-size-20261017.md) | Codex | open, after Astra merges `claude/girls-same-size-20261017` |
| [030: Redraw Gif Giraffe, Unity Unicorn and group 1 in group 4's style](030-codex-redraw-giraffe-unicorn-group-1-20261017.md) | Codex | open |
| [029: The hub folder on Astra's PC is back on `main`; rebuild the star after PR #23](029-codex-hub-folder-back-on-main-20261017.md) | Codex | open, after PR #23 is merged |
| [028: Idle Flash Audit of 2026-10-17: 78 fix PRs, round cards, every pet has a repo, folder rename tried](028-any-idle-flash-audit-20261017.md) | any | done 2026-10-18: Astra answered (#75); what is left is card 035 |
| [024: Pole Puff: create the `pole-puff` repo from `drafts/pole-puff/`](024-any-pole-puff-repo-20261012.md) | any | open: Astra approved the repo, the art and the look (2026-10-12); repo not created yet |
| [027: Skill sheet audit and fix batches (Skill Scout)](027-any-skill-sheet-audit-and-fixes-20261017.md) | any | open, waits on Astra: repo rename, pet-app v2, yes per batch |
| [026: Pictures only Astra can take (Flash Audit A55), and 25 picture PRs](026-any-pictures-astra-takes-20261017.md) | any | open, waits on Astra: in-world and desktop pictures; chat-rat#1 left for Codex |
| [025: Security follow-ups from the 2026-10-16 assessment](025-any-security-follow-ups-20261017.md) | any | open: findings 3 to 5; the security model (PR #26, now in PR #23); the Actions setting for the Farmer's round |
| [021: Startup Star shows API Fairy's bubbles](021-codex-startup-star-api-fairy-bubbles-20261017.md) | Codex | open |
| [020: Chat sync, folder rename plan row, Role Fairy (Fairy Ring #83), Nullbot dropped](020-any-chat-sync-and-folder-rename-20261017.md) | any | open, waits on Astra: File Master rename row |
| [019: Portfolio Puffer and the portfolio](019-any-portfolio-puffer-and-the-portfolio-20261017.md) | any | open, waits on Astra: read every employer page (site merged 2026-10-17) |
| [018: Curious faces and Health Hummy's beak](018-any-curious-faces-and-hummy-beak-20261017.md) | any | open, waits on Astra: OpenAI credits |
| [017: API Fairy's desktop app has never run; verify it](017-any-api-fairy-desktop-verify-20261017.md) | any | done 2026-10-17 |
| [012: Pet-first profile list and missing pets](012-farmer-pet-first-list-and-missing-pets-20261016.md) | Farmer | open, waits on Astra: #77's name, homes, Chat Rat, Workflow Whale |
| [010: Register Platform Platypus](010-farmer-register-platform-platypus-20261011.md) | Farmer | done 2026-10-17: registered with the existing seed sheet |
| [009: Register Spoonfed Sugarcube](009-farmer-register-spoonfed-sugarcube-20261011.md) | Farmer | open, art waits on Astra's OK; local only |
| [001: Register Claude Bot in the Cage](001-farmer-register-claude-bot.md) | Farmer | open |
| [002: Build Claude Bot v0](002-any-build-claude-bot.md) | any | open |
| [003: Goldfish audit of Claude Bot](003-goldfish-audit-claude-bot.md) | Goldfish | open |
| [004: Register RGBee in the Cage](004-farmer-register-rgbee.md) | Farmer | open, art waits on Astra's OK |
| [005: Goldfish audit of RGBee and old pet words](005-goldfish-audit-rgbee-and-pet-words.md) | Goldfish | open |
| [006: Register Fuzzboi Friend in the Cage](006-farmer-register-fuzzboi-friend.md) | Farmer | open, ready: apply the patch in fuzzboi-friend/cage/ |
| [007: Register Mail Snail in the Cage](007-farmer-register-mail-snail.md) | Farmer | open, waits on Astra's OK for the art |
| [008: Voicemeeter Bug to GitHub, then scrambled-audio detection](008-any-voicemeeter-bug-github-and-detection.md) | any | open: repo done; detection waits on the next failure |
| [011: Wrap-up of Claude session 012RaHVD (movement merge WIP, README screenshots)](011-any-claude-session-012RaHVD-wrapup-20261012.md) | any | open, waits on Astra |

## Merge order

Not kept in a file: a shared list here made every pull request conflict with the others. Each chat works the order out
from GitHub's open pull requests when it answers, and puts its number in its title
([skills/merge-order](../skills/merge-order/SKILL.md)). Astra, 2026-10-18.

## Card numbers on every branch

A card number is used once, across `main` and every branch. **Before you write a card, take the next free number
below and add its row here in the same commit**, so two chats working at once never pick the same one. Cards written
on a branch keep the number below when they reach `main`. `test/handoff-numbers-test-20261017.mjs` fails when two
cards share a number, or when a card uses a number this table gives to another card.

**Next free number: 040.** Checked on 2026-10-18 across every branch by Claude Opus 5.5 (036 and 037 are the desktop PC's for the overnight run, card 036; the other PC starts at 038; 031 and 032 are taken on branches; 033 is the credit-line card; 034 is the System Map card; 038 is used on two branches, `farmer-register-workflow-whirlpool` and `skill-scout-record-chat-order`, so one of them moves; 039 is the installer card). When numbers clashed, the
card that reached `main` first kept its number, then the oldest card on a branch.

| No. | Card | Where it is now |
| --- | --- | --- |
| 001–012 | The cards in the table above | `main` |
| 013 | `013-goldfish-flash-audit-20261014.md` | Codex branches (PRs #23, #26) |
| 014 | `014-any-rebuild-desktop-for-discord-damsel-20261014.md` | `claude/damsel-starts-presence-20261014` |
| 015 | `015-flash-audit-checkpoint-20261015.md` | Codex branches (PRs #23, #26) |
| 016 | `016-world-caretakers-and-l3-activity-20261016.md` | `codex/world-caretakers-20261016` (PR #26) |
| 017 | `017-any-api-fairy-desktop-verify-20261017.md` | `main` |
| 018 | `018-any-curious-faces-and-hummy-beak-20261017.md` | `claude/chat-reconcile-20261017` (PR #37) |
| 019 | `019-any-portfolio-puffer-and-the-portfolio-20261017.md` | `claude/chat-reconcile-20261017` (PR #37) |
| 020 | `020-any-chat-sync-and-folder-rename-20261017.md` | `main` |
| 021 | `021-codex-startup-star-api-fairy-bubbles-20261017.md` | `main` (was a second 020) |
| 022 | `022-security-enforcement-and-pet-catalog-20261014.md` | Codex branches (PRs #23, #26), still named `012-…`: rename it to 022 when it is merged |
| 023 | `023-halo-list-vscode-angel-program-20261017.md` | `claude/halo-list-program-20261017`, still named `013-…`: rename it to 023 when it is merged |
| 024 | `024-any-pole-puff-repo-20261012.md` | `main` (rewritten from PR #8 on 2026-10-18; was 010, then 018) |
| 025 | `025-any-security-follow-ups-20261017.md` | `main` |
| 026 | `026-any-pictures-astra-takes-20261017.md` | `main` |
| 027 | `027-any-skill-sheet-audit-and-fixes-20261017.md` | `claude/skill-scout-audit-20261017` (PR #50) |
| 028 | `028-any-idle-flash-audit-20261017.md` | `claude/idle-flash-audit-20261017` |
| 029 | `029-codex-hub-folder-back-on-main-20261017.md` | `claude/star-hub-on-main-20261017` |
| 030 | `030-codex-redraw-giraffe-unicorn-group-1-20261017.md` | `claude/pet-art-redesign-20261017` |
| 031 | `031-codex-rebuild-desktop-girls-same-size-20261017.md` | `claude/girls-same-size-20261017` |
| 032 | `032-any-desktop-reads-only-the-hub-20261018.md` | `claude/one-art-source-20261017` |
| 034 | `034-any-system-map-rings-and-grants-20261018.md` | `claude/system-map-redo-20261017` (PR #64; was 032, renumbered on 2026-10-18 because the desktop card took 032) |
| 035 | `035-codex-framework-pull-requests-20261018.md` | `claude/flash-audit-answers-20261018` |
| 036 | `036-any-overnight-two-pcs-20261018.md` | `claude/idle-flash-audit-20261018` |
| 037 | kept for the desktop PC's overnight run (card 036) | `claude/idle-flash-audit-20261018` |
| 039 | `039-any-farm-setup-installer-20261018.md` | `main` (merged with #88) |

Old drafts on dropped branches have no number: `001`–`005` on `pets-roam-life-20261009` (the "claude mini pet"
before it was named Claude Bot, and a new-pet lineup) and `008-farmer-register-new-placeholders.md` on
`claude/card-008-new-placeholders` and `add-backup-beaver-candidate`. If one is ever brought to `main`, it takes the
next free number.
