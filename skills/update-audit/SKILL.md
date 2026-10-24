---
name: update-audit
description: Weekly check that a pet's GitHub-released programs on Astra's PC match GitHub's newest release. A newer release turns the program's light orange and L3 asks L4 to approve the update; nothing is ever updated without Astra's yes. Use for Rift Rabbit's VR software, or any pet program whose programs come from GitHub releases.
---

# update-audit (a trick of Wonderland Launchpad, Rift Rabbit's program)

Astra, 2026-10-24: "Please make sure they are up to date with whatever GitHub has and that is shown in their indicator
lights if they are updated or not. no auto github updates. if it happens to be found on updater audit, make the light
orange, then have L3 ask me if L4 wants to approve update."

## When

Once a week, and whenever Astra asks whether her VR software is up to date.

## Steps

1. In the hub (`findastra/astras-pet-os`), run the audit's own tool, which only reads:
   `node scripts/update-audit-20261024.mjs --dry-run`. It reads each program's installed version on this PC (its .exe or
   its Windows uninstall entry) and GitHub's newest release. Programs from Steam are not in it: Steam reports their updates
   to Inference Iguana's program-watch.
2. If anything changed, run it without `--dry-run` (it writes the results into the pet's `checks` in `pets.json`), then
   `npm run build` and `npm test`, and open a hub PR. Results:
   - `works` (blue): installed and as new as GitHub's release.
   - `update` (orange): GitHub has a newer release. The page's L4 control panel lists "L3 asks: approve the update of …".
   - `missing` (grey, not created): not installed on this PC.
   - `issues` (yellow): the version or the release could not be read.
3. **L3 asks L4.** For every orange program, ask Astra in chat, as a question with the program, the installed version,
   the new version, the release date and the download's file name, source and size. Never update on your own.
4. Only after Astra's yes for that program: download that release's installer from its GitHub releases page, compare its
   size with GitHub's, open it for Astra (Windows asks her for admin rights), then run the audit again so the light turns
   blue, and open the hub PR.
5. A program a pet uses that is not on GitHub (BOOTH, Patreon: OVR Smooth Tracking, DoubleHip DoubleChest Tracker) cannot
   be audited by the tool: say so, and leave its check as Claude last recorded it.

## Never

- Never update, download or install anything without Astra's yes for that program.
- Never turn on a program's own automatic updates.
- Never add a program to the tool's list (`AUDITED` in `scripts/update-audit-20261024.mjs`) without its pet, its light's
  key and its GitHub repo.
