status: open (waits on Astra: merge this card's pull request, then enroll the key account by account)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-27
needs: findastra/iron-gates (private), findastra/backup-beaver (private)
---
# 257: Astra's YubiKey belongs to Gatekeeper Goddess; Backup Beaver tracks the spare and the recovery codes

## The decision (Astra, 2026-10-27, in chat)

- **Gatekeeper Goddess (Iron Gates) owns the YubiKey.** It is the L4 security key: the proof that an approval or a
  sign-in is Astra and not an agent. This is the key `PET-PROGRAM-FRAMEWORK.md` means by "signed with L4's security
  key once signing is in place".
- **Backup Beaver (Backup Dam) tracks where the spare key and the recovery codes are kept**, and when the spare was
  last checked. The place only, never a code, the same way API Fairy keeps notes about keys and never the keys.

Nothing about which accounts use the key, or where anything is kept, goes in this public hub. That lives in the two
private pet repos.

## What I did

- This card (hub, public): the decision only.
- findastra/iron-gates: `docs/yubikey-enrollment-20261027.md`, the checklist of accounts to enroll the key on, most
  important first, with what each account supports. Its own pull request.
- findastra/backup-beaver: `docs/yubikey-spare-and-recovery-20261027.md`, the record of where the spare key and each
  account's recovery codes are kept (places, never codes). Its own pull request.
- Not changed: the mini-descriptors in `pet-programs.json`. They still read as before; adding the YubiKey to either
  pet's descriptor is a separate change if Astra wants it on the pet program pages.

## Reality check

Enrolling the YubiKey on GitHub protects **signing in** to Astra's account. It does not stop an agent that already
holds a GitHub token: tokens keep working without the key. Making "core needs Astra" an enforced rule needs more,
for example commits or merges signed with a key that must be touched (`ed25519-sk`). That is Gatekeeper Goddess's
later work, not part of this card.

## Not done

- Astra enrolls the key herself on each account (Claude cannot press the key or enter passwords).
- A second YubiKey as the spare, if she does not have one: with only one key, losing it can lock her out.
