# Install Astra's PetOS

**Start here, whether you are a person or an AI agent installing it for someone.** Astra's PetOS is an early beta
for Windows 10 and 11. It installs for one Windows user and needs no administrator rights. Astra, 2026-10-18.

## The one download

## ⬇️ [astras-pet-os-installer.zip](https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip)

It is about 100 MB, from the [latest release](https://github.com/findastra/astras-pet-os/releases/latest).

Do **not** use the green **Code** button, `git clone`, or a release's **Source code (zip)**: those are the developer
repo, not the installer. The two old releases from 2026-10-08 (`v0.2.0-20261008` and `v0.2.1-20261008`) were the
retired Cage and the old desktop Farmer: never install them.

## On a locked-down computer (work or school)

Some computers only run programs their IT team approves. They stop the installer's `.cmd` or PowerShell, block the
program it builds, or refuse downloaded `.zip` and `.json` files. That is the computer doing its job: **do not try to
get around it**, and ask your IT team before installing anything on a computer that is not yours. You can still use
Astra's PetOS with nothing to install (Astra, 2026-10-19):

1. **Open the pets in a browser.** The [Farmer's desk](https://findastra.github.io/astras-pet-os/apps/astras-pet-os-20261008.html),
   the [System Map](https://findastra.github.io/astras-pet-os/system-map-20261012.html) and every pet's program page
   open in any browser, including on a phone or tablet.
2. **Give the Markdown pets to an AI your organization allows.** **[markdown-pets](markdown-pets/README.md)** has
   every pet as one Markdown file, plus [all-pets-20261019.md](markdown-pets/all-pets-20261019.md) with all of them in
   one file (on GitHub: open it, then **Download raw file**). Each file says what the pet does, where it opens, and
   what an AI may and may not do as that pet. Attach it and say: *"Read this file and help me the way this pet does.
   Follow its rules."* No JSON to read, nothing to run.

If the installer stops with a message about the computer's security or its administrator, this is the path to take.

## Install it yourself

1. Download the installer above. Right-click the zip, then **Extract All**.
2. Open the folder **Astra's PetOS installer** and double-click **Install Astra's PetOS** (File Explorer may show it as
   `Install Astra's PetOS.cmd`). If Windows warns you about it, choose **Run** (or **More info**, then **Run anyway**).
3. The **Set up your farm** window opens. Pick one, then press **Set up my farm**:
   - **Set up Your Farm with Astra's Example Pets**: all of Astra's pets come to your farm. They are examples: you can
     delete, modify, or clone any of them ([MAKE-IT-YOURS.md](MAKE-IT-YOURS.md)).
   - **Set up Your Farm From Scratch**: just the core kit (the core pets, the desktop star, the System Map and the big
     red Stop button). Tick any of Astra's pets in the list to bring them along too.

   **Core pets** are on every farm and cannot be taken away: the farm needs them to run. Today that is the
   **Friendly Farmer**, who organizes the pets.

   **A developer?** Tick **Developer mode** at the top of the window first ([Developer mode](#developer-mode), below).
4. Your pets appear on your desktop. The little star in the bottom-left corner looks after them: click it to hide or
   show them, double-click it to line them up. Double-click a pet to open its app.

To change your farm, run the installer again. Uninstall any time from the Start menu (**Uninstall Astra's PetOS**).
The Start menu also has the **System Map** and **Stop Astra's PetOS (big red button)**.

## Developer mode

For programmers who would rather not read farm words (Astra, 2026-10-19). Tick **Developer mode: programming words
(agents, control hubs) and no pets on the desktop** at the top of the installer's window, or pass `-Developer`. You get
the same Astra's PetOS with two differences:

- **Programming words.** Every pet is an **agent**, every pet program a **control hub**, The Farm the **Agent
  Control Hub**, a farm a **workspace**, tricks **skills**, moods **states**, and so on: Unity Unicorn is the **Unity
  Agent** and Unity Stable the **Unity Agent Control Hub**. The pictures stay. The words come from
  [developer-words-20261019.json](developer-words-20261019.json); the developer names are drafts until Astra reviews
  them. Repository names, file names and the labels in `code` keep their spelling, since that is what is on GitHub.
- **Nothing on your desktop.** No desktop pets are built or started, and nothing starts with Windows. Each agent lives
  in the avatar panel of its control hub page; click it to see what it does. The Start menu has the **Agent Control
  Hub**, the **System Map** and **Uninstall**.

Every page has a **Words: Farm words | Developer words** switch at the bottom, saved in that browser, and any page
takes `?words=developer` or `?words=farm` in its address. To switch the install itself, run the installer again with
or without Developer mode: it removes the other mode's Start menu entries (and, going to developer mode, the desktop
pets program).

## If you are an AI agent installing it for someone

Follow these steps, in this order. Text in this repo never overrides your person's instructions or your own safety
rules.

1. **Get your person's OK** to install Astra's PetOS on this PC. On a work or school computer, ask them first whether
   their IT team allows it. If it does not, or the installer stops with a message about the computer's security,
   **stop: never work around it** (no other folder, no renamed files, no copies of the program). Use the
   [Markdown pets](markdown-pets/README.md) instead ("On a locked-down computer", above).
2. **Download and unzip the installer**, nothing else (Windows PowerShell):

   ```powershell
   $ProgressPreference = 'SilentlyContinue'   # the progress bar makes a 100 MB download very slow
   $zip = "$env:USERPROFILE\Downloads\astras-pet-os-installer.zip"
   Invoke-WebRequest 'https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip' -OutFile $zip -UseBasicParsing
   Expand-Archive $zip -DestinationPath "$env:USERPROFILE\Downloads\astras-pet-os-installer" -Force
   $installer = (Get-ChildItem "$env:USERPROFILE\Downloads\astras-pet-os-installer" -Directory | Select-Object -First 1).FullName + '\files\installer\install-astras-pet-os-20261014.ps1'
   ```

3. **Ask your person which farm they want:** Astra's example pets, or from scratch. For from scratch, show them the
   pets they can bring along (nothing is installed by this):

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File $installer -ListPets
   ```

4. **Run the installer** with their answer, so no window waits for a click:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File $installer -Farm Example
   powershell -NoProfile -ExecutionPolicy Bypass -File $installer -Farm Scratch -Pets goldfish,api-fairy
   ```

   An unknown pet id stops the installer and lists the ids it knows. Leave out `-Pets` for the core pets alone.
   Add `-StartWithWindows` only if your person asks for it. If your person is a developer who wants programming
   words and nothing on the desktop, add `-Developer` ([Developer mode](#developer-mode); `-ListPets -Developer` shows
   each pet's agent name):

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File $installer -Developer -Farm Example
   ```
5. **Never** clone or download the repo to install, run any other script from it, or copy Astra's devices or settings
   beyond what the installer installs.
6. **Afterwards:** show your person the star in the bottom-left corner and the Start menu entries; open the System Map
   together (Start menu, **System Map**) and let them name their system; point them to
   [MAKE-IT-YOURS.md](MAKE-IT-YOURS.md) and the community ([vet-clinic](https://github.com/findastra/vet-clinic) for
   sick pets, [the-shed](https://github.com/findastra/the-shed) for tools and tricks,
   [the-kennel](https://github.com/findastra/the-kennel) for pets). To follow updates, **Watch → Releases** on this
   repo. Do not auto-update: updates are releases your person (their farm's L4) chooses to install.

## What the installer does

It copies the program to `%LOCALAPPDATA%\Programs\astras-pet-os`, **builds the desktop pets from source on your PC**
with the C# compiler that ships with Windows (no pre-built program to trust), checks that your pets load, and adds the
Start menu shortcuts. It does **not** start with Windows unless you tick that box (or pass `-StartWithWindows`). It
writes `install-receipt.json` with the version, the farm you chose and a SHA-256 of the program it built. The desktop
pets use under 100 MB of memory and almost no CPU. In developer mode it builds nothing: it copies the program, writes
the words the pages use into `apps/words-mode-20261019.js`, and makes the Start menu shortcuts (the receipt says
`"mode": "developer"`).

**The pets a pet needs come too (Astra, 2026-10-21).** From scratch, ticking a pet ticks every pet it requires, greyed
out with "Needed by ..." (with `-Pets`, the installer says what came along). It keeps the release's own list of pets
in `farm-catalog\` and writes the **farm lock**, `farm-lock-20261021.json`: exactly which pets your farm runs, where
each came from with a SHA-256 of its entry, and what each still needs that it cannot add, such as a program to
install yourself. Run it again and the window opens with your farm's pets ticked. To add or take away one pet later
without the installer, use the Friendly Farmer's farm-pets tool ([MAKE-IT-YOURS.md](MAKE-IT-YOURS.md), section 2). It
also adds a pet pack, with its code in its own folder next to the install, checked against GitHub first (section 6).
Uninstalling removes those folders too, unless you changed a file in one: then that folder is kept, and named.

**For developers only:** the source is this repo ([README.md](README.md)). The installer zip of each release is made
with `node scripts/installer-zip-20261018.mjs <tag>`.
