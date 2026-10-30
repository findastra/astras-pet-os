---
name: pet-page-audit
description: The Friendly Farmer's trick for auditing every pet program page at once - which pets have a page, which version each page shows, whether it has every tool panel, what it looks like (a screenshot and its colours) and whether its live link opens - as one table Astra can work through. Use when Astra asks to audit, screenshot or compare the pet program pages, asks which pets need updating, or for Flash Audit A62.
---

# Pet page audit (Astra, 2026-10-30)

Astra: "do an audit of every single one of the pets and their pet program ... a screenshot of what the current program
looks like ... colors ... what version of the pet program they're on, just to see who needs updated." Then: "make sure
the farmer knows about these tricks or that some kind of version of them is covered in the flash audit."

A trick of The Farm (`the-farm-v1.0-pet-page-audit-trick-v1.0`). It uses the pet program spawner
(`scripts/pet-program-pages-20261018.mjs`) and a headless browser, and changes nothing: it reports, Astra decides.
The Flash Audit runs it as A62 (docs/flash-audit-20261014.md).

## First: audit the newest `main`, never a stale copy

The first run (2026-10-30) audited a working copy that was 668 commits behind `main` and reported pages that no longer
existed. So, before anything else:

1. `git fetch`, then compare: `git rev-list --count HEAD..origin/main`. Anything above 0 means the copy is old.
2. Audit `origin/main` (a worktree, or the copy fast-forwarded when it is on `main` with nothing uncommitted). Never
   switch the live hub folder to another branch: Startup Star reads it (`skills/pet-app`).
3. Name the commit you audited in the report.

## The table: one row per numbered pet program, in `pet-programs.json` order

| Column | Where it comes from |
|---|---|
| Number, pet, pet program, stage | `pet-programs.json` (`number`, `icon`, `program`, `stage`) |
| Page | `apps/pet-programs/<repo>-20261018.html`, or "no page". A page in `MOVED_PAGES` is a redirect, not a leftover |
| Version | The `vX.Y.Z // YYYYMMDD` beside the title: the pet's own pet.json version (or `v?` when none is recorded). Flag one that is not `X.Y.Z` (for example `v0.1`) |
| Missing panels | Each label in the spawner's `PANELS` searched for on the page. A text search: confirm by eye before calling a panel missing |
| Screenshot | The page at 1280 × 900 in a headless browser (`msedge --headless=new --screenshot=… --allow-file-access-from-files`) |
| Colours | The largest colour areas of the screenshot, and whether the page uses the shared stylesheet or a look of its own |
| Live link | `https://findastra.github.io/astras-pet-os/apps/pet-programs/<repo>-20261018.html`: does it open (200)? |

Also check `npm test`'s spawner test: a page on disk that differs from the spawner means `npm run build` was not run.

## What to report

- Counts first: how many have a page, how many are missing one, and the versions grouped.
- Then every finding as one line with its fix and where it goes (the spawner, the pet's pet.json, pets.json).
- Give Astra the table as a page she can share (Claude: a private Artifact; Codex: an HTML file next to the task).
- What only Astra can decide (a pet's look, its version, publishing) is a question, not a fix (`skills/questions-as-slides`).

## Never

- Never edit a generated page by hand: fix the spawner or its sources, then `npm run build`.
- Never fix while auditing: the audit is read only. Fixes go on a branch, one pull request each, merged with Astra's OK.
- Never call a page current without saying which commit you looked at.
