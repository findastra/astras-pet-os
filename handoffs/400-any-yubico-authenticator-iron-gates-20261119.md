# 400 · any · Yubico Authenticator on Gatekeeper Goddess (2026-11-19)

- Status: open (waiting on Astra: merge)
- State: READY_FOR_REVIEW
- Branch: `claude/yubico-authenticator-iron-gates-20261119`
- By: Claude Opus 5.5 (`claude-opus-5-5`)

Astra, 2026-11-19: "lets get that Yubico authenticator app and please put that on the Gatekeeper Goddess as a 3rd party progranm".

## What I did

- Installed Yubico Authenticator on Astra's PC with her OK: v7.4.2, Yubico's official winget package `Yubico.Authenticator` (publisher Yubico AB, installer from Yubico's GitHub release, hash verified by winget).
- `system-map.json`: new third-party program node `yubico-authenticator` (Desktop app, now), and links iron-gates → yubico-authenticator (manages), yubico-authenticator → security-key (manages), yubico-authenticator → windows-pc (runs-on). The `security-key` job now says Astra has two YubiKeys, one a spare.
- `pets.json`: Iron Gates' `needs.programs` lists `yubico-authenticator` (optional), so the needs test stays in step with the map.
- `npm run build`: Iron Gates' page shows "3rd party programs · 1: Yubico Authenticator"; Ghost Protocol's page picks up the security key's new text.

Why: adding the second YubiKey to accounts said "already exists". The app's Passkeys tab shows which sites each key already holds, so Astra can tell which key is on which account.

## Checks

- `node --test test/*.mjs`: 487 pass, 6 skipped, 1 fail (the known `farm-setup` Windows test that fails in every worktree).
- Seen in the browser pane from this branch (editorial preview): L1 shows the new program.

## Not done

- Iron Gates' own repo (private) has a YubiKey enrollment list; it was not updated from here. Which accounts hold which key is private and stays out of this public repo.

## Receipt and review

Pending: Astra's merge.
