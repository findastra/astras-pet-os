# MAKE IT YOURS

Astra's PetOS comes with **Astra's farm as an example**: her pets, her worlds and her pet programs, each wearing an
**EXAMPLE** tag on the System Map. This page shows how to turn it into **your own farm**: your own copy, your own
name, your own pets, and how to delete examples and get them back. Astra, 2026-10-14.

**Choose when you install (Astra, 2026-10-18).** The installer's **Set up your farm** window offers **Set up Your Farm
with Astra's Example Pets** (every example comes along) or **Set up Your Farm From Scratch** (only the **core pets**,
which every farm needs and which cannot be taken away, plus any examples you tick). Run the installer again any time to
change your mind. Choosing changes only your installed copy; the steps below change your own fork.

## The idea in one minute

- You make your own copy of Astra's PetOS on GitHub. Developers call it a **fork**: it is yours, and it stays linked to
  Astra's original (the **upstream**), so updates and security patches can reach you **when you choose**.
- Delete anything you do not want. **Nothing is ever lost:** every example stays online in Astra's repos, and your own
  copy remembers every change you make.
- Your data never goes into your copy. Your pets keep your data on your PC.

## 1. Make your own copy (once)

1. Make a free account at [github.com](https://github.com). A handle is enough; you do not need your real name.
2. Open [github.com/findastra/astras-pet-os](https://github.com/findastra/astras-pet-os) and press **Fork**, then
   **Create fork**. You now have `github.com/<you>/astras-pet-os`.
3. Give it your system's name: your fork → **Settings** → **Repository name**, for example `jordans-pet-os`
   (lowercase words joined by hyphens).
4. Install from **your** copy: your fork → **Code** → **Download ZIP**, unzip it, and run the installer
   (see the [README](README.md#beta-testers-and-their-ai-start-here)).

Or ask your AI: *"Help me fork findastra/astras-pet-os, rename it to `<name>`, and install it from my fork with its
installer. Show me each step before you do it."*

**Want your whole farm private? (Astra, 2026-10-18)** GitHub always keeps a fork of a public repo public, so a private
farm is a **private copy** instead of a fork. The Friendly Farmer's `pet-privatizer` tool makes one on your account,
with every branch and tag:

```
node scripts/pet-privatizer-20261018.mjs copy findastra/astras-pet-os <name> --yes
```

A copy is not linked to Astra's original the way a fork is: get updates with
`git pull https://github.com/findastra/astras-pet-os.git main` in your copy, when you choose (step 4). Run `copy` from
Astra's PetOS as you installed it, before you tell your farm it's yours (below): after that, Astra's hub is no longer one
of your farm's pets.

**Tell your farm it's yours (Astra, 2026-10-20).** Your copy's `pets.json` still says the farm is Astra's
(`"github_owner": "findastra"`). The Friendly Farmer's **make-it-yours** command changes that for you, so you never edit
the file by hand. In your copy's folder, with your own GitHub name:

```
node scripts/make-it-yours-20261020.mjs XxdevilishxX --dry-run
node scripts/make-it-yours-20261020.mjs XxdevilishxX
```

1. The first line only shows what would change. The second makes the change: your name becomes the farm's
   `"github_owner"`, and every pet that came with Astra's PetOS gets its own `"github_owner": "findastra"`, so it stays
   hers. The Friendly Farmer (your copy of the hub) is yours, and so is every pet you add later. Then it rebuilds your
   pages (`npm run build`).
2. Commit the change (`git commit -am "Make the farm mine"`), in a pull request if you like to check first.
3. Typed your name wrong, or renamed your account? Run it again with the right name: the farm and your own pets move to
   it, and Astra's pets stay hers.

Then the Friendly Farmer's tools act on your pets, and only while you are signed in to GitHub as you (`gh auth status`
shows who that is). They never change Astra's pets: to change one of hers, make your own copy first. Her pets' links,
the pictures and this guide still come from Astra's PetOS (the **upstream**); your own pets link to your account.

Or ask your AI: *"Make my copy of Astra's PetOS mine with the Friendly Farmer's make-it-yours command
(node scripts/make-it-yours-20261020.mjs with my GitHub name, as MAKE-IT-YOURS.md says). Run it with --dry-run first and
show me what it will change."*

## 2. Delete examples

| Where | How | Undo |
|---|---|---|
| **On the System Map** | Click it → **Remove from my map** | **Show removed** brings everything back. This only changes the map in your browser. |
| **From your installed farm** | The Friendly Farmer's farm-pets tool (below) | `add` brings it back |
| **From your fork** | In your fork, open `pets.json`, delete that pet's entry (the block with its name), and commit. Then download your fork again and rerun the installer. | Step 3 below |

Or ask your AI: *"Remove the example pet `<name>` from my farm's pets.json. Show me the change first, then commit it to my fork."*

**Add one pet to your farm, or take one away (Astra, 2026-10-21).** The Friendly Farmer's **farm-pets** tool changes
your installed farm one pet at a time, so you never run the whole installer again. It runs in your install folder
(`%LOCALAPPDATA%\Programs\astras-pet-os`; on Linux, `astras-pet-os pets ...`):

```
node scripts/farm-pets-20261021.mjs plan add evidence-locker
node scripts/farm-pets-20261021.mjs add evidence-locker --yes
node scripts/farm-pets-20261021.mjs plan remove evidence-locker
node scripts/farm-pets-20261021.mjs check
```

- `plan` shows what would happen and changes nothing. `--yes` does exactly that. Name a pet by its id, repo or name.
- **A pet brings the pets it needs.** Forensic Ferret needs Log Lynx, so adding Forensic Ferret adds Log Lynx too. The
  installer's window does the same when you tick a pet. What a pet needs is written in pets.json (`needs`).
- **What the Farmer cannot add, he says plainly.** He never installs another company's program: "Voicemeeter Bug
  needs Voicemeeter (required): install it yourself". The pet still comes in.
- **A pet other pets need stays.** He will not take Log Lynx away while Forensic Ferret needs it: take Forensic Ferret
  away first, or both together with `--with-dependents`. A pet that came only because another one needed it goes
  with `--and-unneeded`. Each pet's data on your computer, its pictures and its repo on GitHub always stay.
- **The farm lock**, `farm-lock-20261021.json` in your install folder, says exactly which pets your farm runs, where
  each came from, a SHA-256 of each one's entry and which pets need which. It stays on your computer and is never
  committed. `check` tells you whether your farm is still what the farm lock says. Developers call it a lockfile.
- If Startup Star is running, it restarts so your desktop pets show the change.
- In your fork (a hub copy in git) the Farmer only checks and records: its `pets.json` changes in a commit, as in the
  table above.
- Someone gave you a pet pack? `add <the pack's zip>` brings the pet with its code, checked against GitHub first
  (section 6).

Or ask your AI: *"Add the pet `<name>` to my farm with the Friendly Farmer's farm-pets tool (node
scripts/farm-pets-20261021.mjs in my install folder). Run plan first and show me what it needs, then add it."*

Astra's worlds (Astra's Infinite Pole, Piranesi House) live in their own repos. They are never downloaded with your
farm; on your map they are examples only.

## 3. Get something back

- **From Astra's repo:** every example is always online. Pets: `github.com/findastra/<pet's repo>`. Worlds:
  [astras-infinite-pole](https://github.com/findastra/astras-infinite-pole) and
  [piranesi-house](https://github.com/findastra/piranesi-house). Copy the pet's entry from
  [Astra's pets.json](https://github.com/findastra/astras-pet-os/blob/main/pets.json) back into yours.
- **From your own history:** your fork remembers every change. Your fork → **Commits** → open the change that removed
  it → **Revert**. Or ask your AI to revert that commit.

## 4. Get updates and security patches

Your fork → **Sync fork** → **Update branch**, when you want them (look at **Compare** first to see what changes).
Things you deleted stay deleted; new examples Astra adds may appear, and you can delete those too. If GitHub reports a
conflict, ask your AI for help or open a ticket at the [vet-clinic](https://github.com/findastra/vet-clinic).

## 5. Your own pets

- Ask your AI to make a pet for whatever you use: it follows the
  [Pet Program Framework](PET-PROGRAM-FRAMEWORK.md), gives the pet program its own repo (`<you>/<pet-program>`), and
  adds it to your `pets.json`. The Friendly Farmer will do this for you once his spawning tool is built.
- **Your pets' repos start private** (Astra, 2026-10-18). Making one public, or private again, is your choice, any
  time (Astra, 2026-10-20), with the Friendly Farmer's `pet-privatizer` or in the repo's **Settings** → **Danger
  Zone** → **Change visibility**:
  - `node scripts/pet-privatizer-20261018.mjs plan private <repo>` shows what making it private changes (stars and
    watchers are erased, a Pages site stops), then `apply private <repo> --yes`.
  - `plan public <repo>` shows what becomes visible (every commit of every branch, issues, releases) and scans every
    commit for keys, tokens, personal folder paths and local service addresses; `apply public <repo> --yes` stops if
    the scan found any. Remove it from the history (and revoke any key) first.
  - `plan private --all` or `plan public --all` checks every pet on your farm at once. `plan <repo>` alone means private.
  - It works only on your own pets (step 1, "Tell your farm it's yours") while you are signed in as you, never makes
    the hub that serves every farm's pictures private (Astra's `astras-pet-os`), and never makes public a pet whose
    `pets.json` entry says `stays_private`.
- Proud of it? Bring it to [the Kennel](https://github.com/findastra/the-kennel) so other farmers can adopt it.

## 6. Just one pet: a pet pack

Want one of Astra's pets (or your own) without the whole system? A **pet pack** is one pet in one zip (Astra,
2026-10-20): its repo at one version, its pictures, its pet program page, its Markdown pet, and a README that says
plainly what works on its own and what needs a farm. Unzip it and double-click `open-pet-program-20261020.html`:
nothing is installed. Developers call it a release bundle.

The Friendly Farmer's **pet-packs** tool makes one, in your copy of Astra's PetOS:

```
node scripts/pet-packs-20261020.mjs plan evidence-locker
node scripts/pet-packs-20261020.mjs build evidence-locker
```

- `plan` shows what the pet needs and what would go in, and changes nothing. `build` writes
  `pet-packs/<repo>-pet-pack-<date>.zip`. It reads the pet's repo from GitHub with your own sign-in (or a clone you
  name with `--from`), at its newest version or one you pick with `--ref` (a tag, a branch or a commit).
- **What a pet needs** is written once, in its `pets.json` entry as `needs` (`needs_key` says how): the computer it runs
  on, other pets (required or optional), parts of the core only a farm has (Startup Star runs every desktop pet), and
  third-party programs. Forensic Ferret needs Log Lynx; Voicemeeter Bug needs Voicemeeter. `npm test` checks every one.
- **The pictures are copied into the zip** when it is built, and never into the pet's repo: they stay in one place, the
  hub (PET-FILES.md, "Where the pictures live").
- It never packs the Friendly Farmer (install Astra's PetOS for that) or a pet whose entry says `stays_private`. A pet
  whose repo is private needs `--private`, because the zip then holds its private code: share it only with people you
  trust. It stops if the pet's files hold a key, a token, a personal folder path or a local service address.
- **Where to get one (Astra, 2026-10-21):** a pet's pack goes on that pet's own repo, as a file of a release, and only
  for pets whose repo is public, one pet at a time with the owner's OK. None is published yet; until then, a pack is one
  that someone built and gave you.
- **Put a pack's pet on your farm (Astra, 2026-10-22).** The Friendly Farmer's farm-pets tool (section 2) adds a pack
  to your installed farm, with its code:

  ```
  node scripts/farm-pets-20261021.mjs plan add evidence-locker-pet-pack-20261022.zip
  node scripts/farm-pets-20261021.mjs add evidence-locker-pet-pack-20261022.zip --yes
  ```

  - He checks the pack against itself first: every file must match its SHA-256 in the manifest, and nothing else may
    be in the zip.
  - He checks it against your farm: the pet must be on your farm's list, from the account that list names (never a
    lookalike), for this computer, with no key or personal folder path in it.
  - Then **he checks every file against the pet's own repo on GitHub**, at the pack's commit, with your own sign-in.
    Code that differs is always refused.
  - A pack he cannot check (a private repo your computer cannot read, or no internet) comes in only if you add
    `--unchecked` on purpose. The farm lock then says it was not checked.
  - The pet's code goes into its own folder next to your install (for Forensic Ferret,
    `%LOCALAPPDATA%\Programs\evidence-locker`; on Linux, `~/.local/share/astras-pet-os/pets/evidence-locker`).
    Nothing in it runs by itself: run its program from its README when you choose. Its pictures and page are your
    farm's own.
  - A newer pack of the same pet replaces that code, while the folder is unchanged. Taking the pet away (section 2)
    takes its code folder too, and so does uninstalling. A folder you changed is always kept.

Or ask your AI: *"Make a pet pack of `<the pet's repo>` with the Friendly Farmer's pet-packs tool (node
scripts/pet-packs-20261020.mjs). Run plan first and show me what it needs, then build it."*

## 7. Keep it safe

- **A fork of a public repo is public**, and GitHub cannot make it private: for a private farm, make a private copy
  (step 1). Never put keys, passwords or personal information in a public repo. Your pets keep your
  data on your PC, and GitHub's push protection stops most leaked keys.
- Pets with private data (health, money, private notes) belong in **private** repos of their own, not in your public fork.
- Install only with the installer, and only from your own fork or Astra's releases. See [SECURITY.md](SECURITY.md).

**Words you will see:** *fork* (your own linked copy), *upstream* (Astra's original), *commit* (one saved change),
*revert* (undo a commit), *sync fork* (bring in updates).
