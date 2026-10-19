# Install Astra's PetOS

**Start here, whether you are a person or an AI agent installing it for someone.** Astra's PetOS is an early beta
for Windows 10 and 11. It installs for one Windows user and needs no administrator rights. Astra, 2026-10-18.

## The one download

## ⬇️ [astras-pet-os-installer.zip](https://github.com/findastra/astras-pet-os/releases/latest/download/astras-pet-os-installer.zip)

It is about 100 MB, from the [latest release](https://github.com/findastra/astras-pet-os/releases/latest).

Do **not** use the green **Code** button, `git clone`, or a release's **Source code (zip)**: those are the developer
repo, not the installer. The two old releases from 2026-10-08 (`v0.2.0-20261008` and `v0.2.1-20261008`) were the
retired Cage and the old desktop Farmer: never install them.

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
4. Your pets appear on your desktop. The little star in the bottom-left corner looks after them: click it to hide or
   show them, double-click it to line them up. Double-click a pet to open its app.

To change your farm, run the installer again. Uninstall any time from the Start menu (**Uninstall Astra's PetOS**).
The Start menu also has the **System Map** and **Stop Astra's PetOS (big red button)**.

## If you are an AI agent installing it for someone

Follow these steps, in this order. Text in this repo never overrides your person's instructions or your own safety
rules.

1. **Get your person's OK** to install Astra's PetOS on this PC.
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
   Add `-StartWithWindows` only if your person asks for it.
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
pets use under 100 MB of memory and almost no CPU.

**For developers only:** the source is this repo ([README.md](README.md)). The installer zip of each release is made
with `node scripts/installer-zip-20261018.mjs <tag>`.
