# Retiring a pet: the Farmer's protocol and retire-check, 2026-11-17

Astra, 2026-11-17, after Port Spider was folded into White Hat Weasel: "make sure to delete it everywhere, not sure
about pet deletion, if the farmer has a rule to scrub everything or archive, etc. make a protocol and update his
software please". There was no rule before this.

- **The protocol**, `skills/retire-a-pet/SKILL.md` (trick `the-farm-v1.0-retire-a-pet-trick-v1.0`): everything live
  forgets the pet, every record keeps its name, its repo is archived (deleted only on Astra's words for that pet), its
  number is never reused, PC folders go to the Recycle Bin after a check for unsaved work.
- **retire-check** (`scripts/retire-check-20261117.mjs`, `npm run retire-check [-- --github]`): reads `retired_pets`
  in pets.json and lists every leftover in the hub, in each pet repo in the Astra's PetOS folder, on the PC and on
  GitHub. Read only.
- **pets.json `retired_pets`**: Port Spider is the first row.
- **pet-finder** calls a retired pet's repo or folder `retired-leftover`, never a missing pet.
- **Test** `test/retired-pets-test-20261117.mjs`: the hub keeps forgetting retired pets.
- **Port Spider's art** leaves the art source (desktop-art, moods, latest); drafts stay as records.
- On the map: the tool and the trick, of The Farm. New row in the new-pet-or-tool decision table.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-17.
