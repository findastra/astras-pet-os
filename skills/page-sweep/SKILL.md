---
name: page-sweep
description: The Friendly Farmer's trick for looking at every pet program page at once - which pets have a page, which version each page shows, whether it has every tool panel, what colours it really shows, whether its live link answers - with a screenshot of each, in one sheet Astra can work through. Use when Astra asks to audit, check, compare or screenshot all the pet program pages, their colours or their versions, or before a Flash Audit's page-layout checks.
---

# Page sweep (Astra, 2026-10-30)

Astra, 2026-10-30: "do an audit of every single one of the 84 pets ... the pet name, the pet program, and then a
screenshot of what the current program looks like ... colors right now, or if they even exist at all ... what version
of the pet program they're on, just to see who needs updated", then "make sure the farmer knows about these tricks or
that some kind of version of them is covered in the flash audit".

The Flash Audit goes one pet at a time. A page sweep looks at **every pet program page side by side**, so what the
pets share shows: one palette on every page, one panel missing everywhere, versions that are behind. It is a trick of
The Farm (`the-farm-v1.0-page-sweep-trick-v1.0`): The Farm makes these pages (the pet program spawner), so it checks
them, as it does with click-check. It **only reports**. Fixes go on a branch, through the Flash Audit or the pet's chat.

It uses only what The Farm already has: Node, git, the spawner and its test, a headless Edge or Chrome with a
throwaway profile (as click-check does), and GitHub Pages. It sends nothing and signs in to nothing.

## 1. Sweep `main`, not whatever the PC has (the first sweep got this wrong)

The first sweep, 2026-10-30, audited the hub folder on Astra's PC while it sat on a branch 778 commits behind `main`.
Every finding about the template was out of date: `main` already had the panels it called missing. So, first:

1. `git fetch origin`, then compare the hub folder with `origin/main`:
   `git rev-list --count HEAD..origin/main` (behind) and `git status -sb`. Write down the commit you sweep.
2. **Never switch the hub folder's branch to sweep it**: Startup Star reads that folder live (`skills/pet-app`). Sweep a
   worktree of `origin/main` in a short temp folder instead (`git worktree add --detach %TEMP%\sweep origin/main`), and
   remove it after.
3. A hub folder that is behind `main`, or on an old branch, is itself a finding for Astra (Flash Audit A17): the
   desktop pets and pages she sees are old.
4. Node or git missing from PATH on Astra's PC: Node is in the Codex runtime
   (`%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`), and git comes with
   GitHub Desktop (`%LOCALAPPDATA%\GitHubDesktop\app-<version>\resources\app\git\cmd\git.exe`). Look the File Master
   way before saying either is missing (`skills/find-things`).

## 2. What to check for every pet, and the Flash Audit check it feeds

Every numbered pet in `pet-programs.json` (count them from the file, never from memory; on 2026-10-30 there were 84).
Its page is `apps/pet-programs/<repo>-20261018.html` in the swept commit.

| Look at | How | Flash Audit |
|---|---|---|
| Has a page | The file exists. A seed or roadmap pet with none is **Missing (planned)**, not broken. | A09 |
| A page with no pet | A file in `apps/pet-programs/` whose repo is in no `pet-programs.json` entry. First check the spawner's `MOVED_PAGES` (`scripts/pet-program-pages-20261018.mjs`): a pet whose repo moved keeps its old address as a page that sends you on, on purpose, and that is not a finding (the first sweep called `findastra-discord-presence-20261018.html` a leftover; it is Discord Tower's redirect). | A59 |
| Every tool panel | `node --test test/pet-program-pages-test-20261018.mjs` checks every page has all of the spawner's `PANELS`, in order. Read its output; never count panels by eye. | A09, A60 |
| Version | The title's `v<version> // <date>`: the version is `version` in pets.json (the pet's own `pet.json` version), and the date is the day the pet was added, not its last update. `version_assigned: true` means the pet's `pet.json` has no version yet and the hub gave it the starting 0.1.0: those pets are the first to update. A version must be `MAJOR.MINOR.PATCH` (`v0.1` is short a number; the spawner's test lets it through). List who is on which version, lowest first. | A07 |
| Colours | Screenshot the page (below) and measure the largest colour areas **from the picture's pixels**, not the CSS tokens: a token can say dark while the page shows pink. Pages that all show the same palette fail "each pet has a distinct stationery palette". | A50 |
| What it looks like | One screenshot per page, 1280 × 900, first screen. | A09, A55 |
| Live link | `https://findastra.github.io/astras-pet-os/apps/pet-programs/<repo>-20261018.html` answers 200, and so does every `interface_live_url` in pets.json. A 404 is reported with the address. | A10 |

## 3. Screenshots

Headless Edge (or Chrome), a throwaway profile, never Astra's own:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars `
  --no-first-run "--user-data-dir=$env:TEMP\page-sweep-profile" --allow-file-access-from-files `
  --window-size=1280,900 --virtual-time-budget=5000 "--screenshot=<out>\<NN>-<repo>.png" <page as a file:/// URL>
```

Open the page from the swept worktree, so the pictures match the commit you write down. Look at a few screenshots
yourself before trusting the rest: a blank or error page is a finding, not a colour.

## 4. The sheet

One row per pet, in `pet-programs.json` order: number, pet program, pet, stage, page, version, missing panels,
colours on screen (swatches), screenshot, live link. On top: how many have a page, how many have none, and what
stood out, each with its Flash Audit ID. Give the commit swept.

- Keep the sheet and the screenshots out of the hub (a temp folder, or a private Artifact with the screenshots as its
  files). They are evidence for this run, not repo pictures: pictures for READMEs are A55's, through
  project-image-generator.
- Never write a personal path, a private pet's data or a private repo's page into it.

## 5. Then

1. Tell Astra what stood out, in Flash Audit order, and link the sheet.
2. A fix that needs no decision (a leftover page, a version a pet's own `pet.json` already states) goes on a
   `claude/` branch in a worktree, with a pull request, through the spawner or the pet's own repo: **never by
   editing a generated page**. Run `npm run build` and `npm test`.
3. A new palette, a page for a seed or roadmap pet, or anything that changes what a page shows is Astra's to decide
   (A50 says a new look is shown to her before it lands). Ask as a slideshow (`skills/questions-as-slides`).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-30.
