# Every pet program has a weekly audit (2026-11-16)

Astra, 2026-11-16: "all 85 pets should have audits that they do on a weekly basis. tell me what each of the 85 pets is
auditing for in list form." Then, to writing the proposed audits into the registry on a branch: "Yes, on a branch".

## What changed

- **Seven animals' audits now say what they check.** Mail Snail, Backup Beaver and Deck Duck said "my plan" although
  their job is decided. Patch Cat, Wifi Butterfly and Gif Giraffe said "my plan" although their mini-descriptor in
  `pet-programs.json` holds a confirmed part of the job (Patch Cat's and Wifi Butterfly's security roles, and the GIF
  maker); their `needs` still ask Astra for the rest of the job. API Fairy's subject described her program's source
  instead of her keys; it now matches her job (the subject came from her repo's `hub.submit` of 2026-10-15, which the
  round will not take again, because it only takes a newer date).
- **The eleven seeds in `pets.json` `seeds` have an audit block**: what each will check once it hatches. The Friendly
  Farmer's round does not run them (a seed has no animal entry); the block moves into the pipeline entry with the pet.
  Flowsheet Flamingo's uses the same words as #337, which hatches him.
- **The eighteen roadmap pets, and Dubstep Gunsmith, have an audit block on their System Map node**
  (`system-map.json`), their only record besides `pet-programs.json`. Dubstep Gunsmith is a seed in
  `pet-programs.json` but has no seed entry in `pets.json`, so his is on the Dubstep Armory node. Stock Fox's job is
  not decided, so his says "my plan" and asks for one.
- **The self-audit pill on every pet program page says what is real.** It read "The Friendly Farmer's round checks
  <home>: <subject>", which made a planned check read as a built one. It now reads "<pet>'s audit: <subject>. Today the
  Friendly Farmer's round checks only <home>'s repo files and the cards that wait on you."
  (`scripts/pet-program-pages-20261018.mjs`; the pages are rebuilt.)
- **`test/weekly-audits-test-20261116.mjs`**: every pet program in `pet-programs.json` has an audit block with a
  weekly cadence (the Farmer's is daily), a subject and a need, wherever its record lives; and "my plan" only while the
  pet's job is not decided (the mini-descriptor is read first).

## Not changed

- The pets' own `pet.json` files: Mail Snail's, Backup Beaver's and Deck Duck's still say "my plan" in their repos, and
  API Fairy's still submits her old subject. Nothing flags that difference yet: the Flash Audit's A16 checks only that
  an audit block exists, and the round does not compare audits.
- **Mail Snail's job is written two ways**: bills for Finance Finch in `pets.json`, sorting and cleaning up mail in
  `pet-programs.json` and INTELLIGENCE-LEVELS.md. Her audit covers both until Astra picks one.
- What a self-audit really checks today is the same for every animal (pet.json, README, AGENTS.md, cards waiting on
  Astra, new commits; PET-FILES.md, "Rounds, self-audits and submissions"). The subject is what each pet audits once its
  own checks are built; most are not.
- #245 adds Reactor Raccoon as a seed with no audit block: once this is merged, that pull request needs one to pass
  the new test.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-16, branch `claude/weekly-audits-every-pet-20261116`. Reviewed by a
separate read-only checker session (maker-checker, `skills/farm-security` section 7); its findings are fixed here.
