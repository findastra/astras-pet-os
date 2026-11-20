---
name: retire-a-pet
description: The Friendly Farmer's protocol for retiring a pet or folding it into another pet as a tool, everywhere, without losing its history. Use when Astra says a pet goes away, is squished, merged, folded into another pet, retired or deleted, and after any such change to check that nothing still treats it as a pet.
---

# Retire a pet (Astra, 2026-11-17)

Astra, 2026-11-17, after Port Spider was folded into White Hat Weasel: "make sure to delete it everywhere, not sure
about pet deletion, if the farmer has a rule to scrub everything or archive, etc. make a protocol and update his
software please".

The rule in one line: **everything live forgets the pet; every record keeps it; its repo is archived, never deleted.**

- **Live** is anything that treats it as a pet today: the registry, the map, pages, Markdown pets, developer words, art,
  menus, other pets' code and READMEs, the profile list, the portfolio's pet list, folders on the PC.
- **Records** say what happened and keep the old name: `changes/`, `handoffs/`, scan reports, Flash Audit rounds, dated
  snapshots (catalogs, project images), test fixtures and git history. Rewriting them would make the history lie.
- **Its repo is archived** (read only, private, history kept, undone from the repo's settings). Deleting a repo can't
  be undone and breaks every record's link, so it happens only when Astra says "delete the repo" for that pet, in her
  own words, after she is told the links in its records will break.

## Folded or retired?

Use `skills/new-pet-or-tool` first. **Folded**: its job moves to another pet as a tool or trick (Port Spider → White
Hat Lab's port-check-tool). **Retired**: its job ends. Either way the steps are the same; a fold also moves the job.

## Steps

1. **Ask and record.** Astra's words, the date, folded or retired, and where the job goes. Add a row to the
   new-pet-or-tool decision table. Show her the plan before anything leaves (dry run first, AGENTS.md).
2. **Move the job (a fold).** The new tool or trick node in `system-map.json` (`of` its new pet), its tool box, and the
   pet's reports or data moved into the new pet's repo (private stays private). Links that still matter are re-pointed
   to the new pet; the rest go.
3. **The hub forgets it.** In one pull request:
   - `pet-programs.json`: its entry goes. **Its number stays unused** (like 85): a number never means two pets.
   - `pets.json`: its entry goes, and a row goes into `retired_pets` (repo, pet, program, number, retired date, how,
     into, tool, repo_state, why, art). The retire-check reads this list.
   - `system-map.json`: its nodes, links, `code.repos` note and `hats` colour.
   - `developer-words-20261019.json`, then `npm run build`. The build does not delete files, so remove its page
     (`apps/pet-programs/<repo>-20261018.html`) and Markdown pet (`markdown-pets/<repo>-20261019.md`) yourself.
   - **Art:** `desktop-art/<art>`, `art/moods/<art>`, `art/latest/moods/<art>`, `art/latest/desktop-art/<art>` go.
     Drafts (`art/drafts`, `art/latest/drafts`) are records and stay. Git keeps every drawing.
   - Living docs (ASTRAS_PET_OS.md, the security model, the migration plan, skills) say where the job went.
   - `npm test`: the retired-pets test fails while any of this is left.
4. **Every other repo forgets it.** `npm run retire-check -- --github` lists every live mention in every pet repo on the
   PC. Fix each in that repo's own pull request: copies of hub files (developer words, the site's pet list) are copied
   or regenerated again; another pet's README or code that says "that is X's job" says where the job is now.
5. **GitHub.** Close or move its open pull requests first, then archive the repo (`gh repo archive`), with Astra's OK.
   Check the profile list (`skills/pet-organizer`) and the portfolio site.
6. **The PC.** Its clone in `Documents\Astra's PetOS\<repo>` and any `Astra's PetOS Data\<repo>` folder: check for
   uncommitted or unpushed work and for programs running from it (AGENTS.md), then send the folder to the Recycle Bin,
   never a hard delete. Startup Star's menu, Stream Deck keys and Discord presence entries that name it go too.
7. **Seats and memory.** Changed skills are installed with Luna's Log's skill-install-tool. Chat memories that call it
   a pet are updated. Other running chats don't read new rules by themselves: tell Astra which ones may still use it.
8. **Check.** `npm run retire-check` says "Clean" (records are counted, never changed). Write the change file.

## Never

- Never delete its repo, a record, or git history without Astra's words for that exact thing.
- Never give its number to another pet.
- Never edit another assistant's open branch to remove it; leave a note on the card or pull request instead.
- Never touch D: (her game drive) or a copy of the pet inside another chat's worktree.

## Pets retired so far

| Pet | Program | No. | Date | How | Repo |
|---|---|---|---|---|---|
| Port Spider | Port Web | 68 | 2026-11-17 | Folded into White Hat Weasel as `white-hat-lab-v1.0-port-check-tool-v1.0` | findastra/port-web, archived |

Written by Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-17.
