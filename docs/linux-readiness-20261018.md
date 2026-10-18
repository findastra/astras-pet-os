# Linux readiness check for Astra's PetOS

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-18. **A document only: no code, setting or repo was changed.** Card 041
holds what is left.

Astra is putting Kali Linux on her old MacBook Pro so she can test Astra's PetOS the way an outside attacker would, as
an authorized lab (White Hat Weasel, pet program #67, White Hat Lab). She also wants Astra's PetOS to install on Linux
without Microsoft, and asked whether it should be its own distribution or an add-on. This page checks every part of
the platform against Linux, with evidence, and recommends an order.

## In short

- **Astra's PetOS is a platform, not an operating system** ([skills/dev-mindset](../skills/dev-mindset/SKILL.md)
  glossary; [ASTRAS_PET_OS.md](../ASTRAS_PET_OS.md): "running on top of Windows/Linux host OSes, not a replacement
  kernel"). So the first Linux goal is a package that installs on the Linux people already run, not a new
  distribution.
- **Most of it already runs on Linux.** The Node scripts and tests run on Ubuntu every day (the Farmer's round), and
  every page is plain HTML. 22 of the 36 pet repos are browser pages or plain Node.
- **The hard part is the desktop pets** (and Startup Star and the installer, which are built around them): they are
  WinForms and Win32 code, compiled with the C# compiler that ships with Windows.
- **Kali is the tester, not the target.** It is White Hat Weasel's lab machine. The install target is the Debian
  family: Debian, Ubuntu, Raspberry Pi OS, and Kali too, since it is built on Debian.

## The components

✅ runs on Linux today · 🟡 runs after small changes (named) · ⛔ Windows-only (the Windows APIs are named, here or in
the next section)

Pet runtimes come from `runs_on` in each repo's `pet.json` on `main`, read from GitHub on 2026-10-18. `pets.json` has
no `runs_on` field. Code was read on GitHub, not cloned to the PC.

| Component | Linux | Evidence | What it depends on, or what has to change |
| --- | --- | --- | --- |
| **Hub: `npm test`, `npm run build -- --metadata-only`** | ✅ | GitHub Actions run 39142399506, 2026-10-18 (`main` at `e4d54eb`), image `ubuntu-24.04`, Node 22: 143 tests, 142 pass, 0 fail, 1 skipped (the pets-board workflow test, which skips everywhere until its workflow is added). The Farmer's round (`.github/workflows/farmer-daily-rounds.yml`, `runs-on: ubuntu-latest`) runs `node scripts/build.mjs --metadata-only`, `node scripts/build-interfaces-20261008.mjs` and `npm test` every day. | Node 20 or newer (`engines` in package.json) and Node's built-in modules only. Child processes are `process.execPath`, `git` and `gh`, all on Linux. Since then #88 added `test/farm-setup-test-20261018.mjs`, whose one installer test skips itself when `process.platform !== 'win32'` (it runs the PowerShell installer). |
| **Hub: full `npm run build`, `npm run check`** | ✅ (not run on Linux yet) | No Windows call found in `scripts/build.mjs`, `scripts/check-cage.mjs` or the frame scripts they run. | Untested: the full build (which renders frames) and the check have not been run on a Linux machine. It is the first thing to try on the MacBook. |
| **Hub: the tools that call GitHub** (pet-finder, pet-privatizer, the Idle Flash Audit, `publish-pet-tags`) | ✅ | They reach GitHub with Node's `fetch` or the `gh` command and run `git`, without a shell. | Debian's `gh` and `git` packages. They speak GitHub's API only (see open decision 8). |
| **Hub: `npm run generate`** (paid art) | ✅ (not run on Linux) | `scripts/generate-pets.mjs` runs the image bridge, `../image-bridge/imagine.mjs` (Node, kept in `findastra-discord-presence/image-bridge/`). | `OPENAI_API_KEY`. Costs money, so it stays Astra's call on any OS. |
| **Pages: the System Map** (`system-map-20261012.html`) | ✅ | HTML and JavaScript. three.js r128 from cdnjs and TrackballControls from jsdelivr, fonts from Google Fonts. | Any current browser. Needs the network for three.js. |
| **Pages: `cage.html`** (retired as a product, kept working) | ✅ | Reads `cage-data.js` so it works by double-click; no Windows call. | Nothing. No new Cage features (AGENTS.md). |
| **Pages: the Farmer's desk and `apps/`** (20 pages, the Farm's page today) | ✅ | Plain HTML. Local-service buttons accept only the PC's own loopback address ([local services](local-services-20261014.md)). | Some pages print Windows launcher names as text (`start-farmer-dock-20261008.cmd`, `Start API Fairy.cmd`, `.\run-scan.cmd`), and Voicemeeter Bug's page carries a Windows `launchPath`. A Linux install should show the Linux way, or "Available on a Windows host" (ASTRAS_PET_OS.md 5.2). |
| **The Farm** (the responsive website with a text box under every pet) | not built | [PLAN.md](migration/PLAN.md) Phase 3 plans Node `node:http` and `node:sqlite`. | Portable by design. `node:sqlite` needs Node 22.13 or newer without a flag. |
| **Desktop pets** (`scripts/desktop-pets-20261011.cs`, `scripts/pet-dock-tracker-20261011.cs`, built by `build-desktop-pets-20261011.ps1`) | ⛔ | WinForms, Win32 calls into `user32.dll`, `gdi32.dll`, `dwmapi.dll` and `kernel32.dll`, the registry, named Windows events, UI Automation and the .NET Framework 4 compiler (next section). | A port: see "The desktop-pet problem on Linux". |
| **Startup Star** (the tray Star is inside the desktop-pets program; `findastra/startup-star` adds its launchers) | ⛔ | The tray icon is WinForms `NotifyIcon`. The repo is PowerShell and VBScript: `install-shortcuts-20261012.ps1` (Start menu `.lnk`), `live-sync-20261017.ps1`, `open-star-20261018.vbs`, started from the Windows Startup folder and the scheduled task "Astras PetOS Startup Star". | Live sync is only `git` fast-forwards with safety checks, so it ports easily as a systemd user timer. The tray needs the desktop-pets port. |
| **Installer** (`installer/install-astras-pet-os-20261014.ps1`, `.cmd`, uninstaller) | ⛔ | Windows PowerShell, a WinForms "Set up your farm" window, `csc.exe`, `robocopy`, `Unblock-File`, `WScript.Shell` shortcuts, `%LOCALAPPDATA%\Programs\astras-pet-os`, start-with-Windows through the registry. | Its farm logic (Example or Scratch, core pets, `-Pets`) is what a Linux package needs. The Windows mechanics are replaced, not ported. |
| **Old Farmer dock** (`start-farmer-dock-20261008.cmd`) | ⛔ | A `.cmd` that compiles with `%WINDIR%\Microsoft.NET\...\csc.exe`. | Retired with the Cage; not worth porting. |
| **Pets: browser pages** (21 repos): Backup Beaver, Mail Snail, Meme Fiend, Patch Cat, Mesh Moth, Finance Finch, Health Hummy, Mommy's Mommies, Portfolio Puffer, VSCode Angel, Wifi Butterfly, Fuzzboi Friend, Platform Platypus, GitHub Goldfish, Gone Ghost (`ghost-protocol`), Python Panther (`learn-python`), Chip (`data-dealer`), Mine Mole, Raspberry Pi Berry, Gif Giraffe (`astras-gif-maker`), Paper Girl Patty (`paper-girl`) | ✅ | `runs_on` says "Any modern browser" or "Modern browser" for each, except: Mine Mole has no `runs_on` (its `entry` is an HTML page), and Gif Giraffe says "Windows desktop, in a browser page" (its program is one HTML page). GitHub Goldfish adds an optional Node 20 command line; Paper Girl's site is TypeScript with shell build scripts (`scripts/build-verified.sh`). | Nothing for the pages. Chip's `runs_on` says Data Dealer's own requirements are in its README; that project was not checked. Raspberry Pi Berry says "on Astra's PC" with no Pi connection: on Linux it could run on the Pi itself, which is a new job, not a port. |
| **Pet: Role Fairy** | ✅ (not run on Linux) | `runs_on`: "Node 24.17 or newer on Astra's PC, with her own Discord bot application". `src/bot.js` uses discord.js and reads its token from the environment; no Windows call. | Runs as a systemd user service. discord.js comes from npm (open decision 8). |
| **Pets: page runs, planned job needs a Windows-only program**: Deck Duck, RGBee, Rift Rabbit, Drum Dog, Project Parrot | ✅ page, ⛔ job | Deck Duck: "Windows PC (planned)", Elgato's Stream Deck software is for Windows and macOS. RGBee: "Light control is planned for Windows" (MSI Center, Corsair iCUE, Razer Synapse, Logitech G HUB). Rift Rabbit: "Windows desktop (placeholder)", Meta Horizon Link and Virtual Desktop's streamer are Windows programs. Drum Dog looks after Ableton Live (Windows and macOS). Project Parrot reviews OneNote (a Microsoft program with no Linux app). | Each needs a Linux-side program to look after (for example OpenRGB for lights, SteamVR's Linux build): a decision about the pet's job, per pet. |
| **Pet: Astra Wisp** (`the-astral-plane`) | 🟡 | Python with PySide6 (Qt) and psutil, an Electron front end (`standalone_frontend/`), a voice module (`voice/ai_astra_voice.py`). Launchers are `Run_AIAstra.bat` and `Launch_AIAstra_Test.cmd` (the `.bat` starts `electron.exe`). | Shell launchers instead of `.bat`/`.cmd`. Her VRChat body needs VRChat, which has no Linux build. |
| **Pet: Chat Rat** | 🟡 | `runs_on`: "Windows, Node 20+ (planned)". A Node server on the PC's loopback address. `start-chat-rat-20261016.ps1` launches it; `openFolder` refuses unless `process.platform === 'win32'` (it opens File Explorer). | A shell launcher, `xdg-open` for folders, and the Linux places where Claude and Codex keep their chats. |
| **Pet: Discord Damsel** (`findastra-discord-presence`) | 🟡 | Node apps with a local control panel. `src/rpc.js` stops unless `process.platform === 'win32'` and connects to Discord through the Windows named pipe `\\.\pipe\discord-ipc-N`. Tray: `scripts/tray-20261009.ps1`. Start at sign-in: `src/windows-startup.js` (the Startup folder under `%APPDATA%`). `.cmd` launchers. | Discord's Linux app listens on a Unix socket (`discord-ipc-N` under `$XDG_RUNTIME_DIR`), so the pipe path, a tray and a systemd user service change. Its detector already uses `os.homedir()`. |
| **Pet: Unity Unicorn** | 🟡 | The tool library is a browser page; the tools are Python scripts run in Unity or Blender (`scripts/run-unity-tool-20261011.py`, `neck-blender`, `marble-carver`, ...). | Unity and Blender have Linux builds; VRChat's Creator Companion app is Windows-only. Untested on Linux. |
| **Pet: File Master** | ⛔ | PowerShell: `Install-FileMaster.ps1` uses `Register-ScheduledTask`; `new-programs-watch-20261013.ps1` reads `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*` and `Get-AppxPackage`; he looks after Everything and SpaceSniffer (Windows programs). | PowerShell exists for Linux, but these cmdlets and registry keys do not. A Linux version would use a systemd timer, `dpkg-query` for new programs and `plocate` for search. |
| **Pet: API Fairy** | ⛔ | C# Windows app (`src/*.cs`, `build.cmd`). `src/Native.cs`: `user32` `GetLastInputInfo`, `GetWindowLong`, `SetWindowLong`, `AllowSetForegroundWindow`, `DestroyIcon`; `dwmapi` `DwmSetWindowAttribute`. `src/Scanner.cs` reads keys from the registry (`Registry.CurrentUser`, `Registry.LocalMachine`) and PowerShell's PSReadLine history; `src/Store.cs` encrypts notes with DPAPI (`ProtectedData`, `DataProtectionScope.CurrentUser`). | A Linux twin would read shell profiles, `environment.d` and shell history, and use the Secret Service (libsecret) instead of DPAPI. That is a new program. |
| **Pet: Voicemeeter Bug** | ⛔ | `runs_on`: "64-bit Windows with .NET Framework and an installed compatible Voicemeeter Remote API". | Voicemeeter is a Windows program. No Linux job unless Astra gives him one (a new decision, not a port). |
| **Pet: Claude Bot** | ⛔ (planned) | `runs_on`: "Windows (planned: C# compiled with the .NET Framework compiler included with Windows)". Nothing built (`entry` is README.md). | If it is built after the desktop-pets port, it can use the same toolkit. |
| **Pet: Sugarcube** (`spoonfed`) | not checked | No `pet.json` on `main`; the app is on the branch `claude/rescue-spoonfed-app-20261012`. INTELLIGENCE-LEVELS.md says iOS, Android and web. | Check when the app reaches `main`. |

Not counted: the four `candidates` in pets.json (two VRChat worlds, `image-bridge`, `fuzzbois`) are not pets, and
seed and roadmap pets have nothing built. Several roadmap pets are Linux by nature: Linux Penguin (#58, Linux Iceberg),
Shell Squid (#62), Kernel Koala (#63), Server Salamander (#49), Docker Dragon (#50), Proxy Axolotl (#64), White Hat
Weasel (#67) and Port Spider (#68).

**Count of the 36 pet repos:** 22 run on Linux today (21 pages and Role Fairy), 5 have a page that runs but a planned
job that needs a Windows-only program, 4 need small changes, 4 are Windows-only, 1 was not checked.

## Windows APIs the Windows-only hub parts use

**Desktop pets** (`scripts/desktop-pets-20261011.cs`, 882 lines):
- WinForms (`System.Windows.Forms`): borderless `TopMost` forms with `ShowInTaskbar = false`, a magenta
  `TransparencyKey`, `NotifyIcon` for the tray Star and its menu, `Screen.AllScreens` for roaming across monitors.
- Extended window styles in `CreateParams`: `WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW` (`0x08000080`) so pets never take
  focus or show in Alt+Tab, and `WS_EX_LAYERED` (`0x00080000`) for per-pixel transparency (wings, fins, ghosts).
- `user32.dll`: `UpdateLayeredWindow`, `GetDC`, `ReleaseDC`, `GetDpiForWindow`, `GetSystemMetricsForDpi`, `DestroyIcon`.
  `gdi32.dll`: `CreateCompatibleDC`, `SelectObject`, `DeleteObject`, `DeleteDC`. Clicks pass through the transparent
  pixels and land on the pet's body, so pets can be clicked and dragged.
- The registry: `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` for "Start desktop pets when I sign in", and a
  settings key for the Star's position and whether the pets are out.
- Named `EventWaitHandle`s (show, quit, check, toggle-star, line-up) and a named `Mutex`, so only one copy runs and
  `--quit` and the shortcuts can signal it.
- `System.Web.Script.Serialization` (JSON in .NET Framework only), `%LOCALAPPDATA%\astras-pet-apps\` for the status
  file.
- The dock tracker (`scripts/pet-dock-tracker-20261011.cs`) finds the Codex desktop app's mini window (a Windows
  Store package named `OpenAI.Codex_…`) and its avatar button, so the pets can dock to it, with UI Automation
  (`System.Windows.Automation`), `user32` `EnumWindows`, `GetWindowRect`, `GetClassName`, `GetWindowThreadProcessId`,
  `IsWindowVisible`, `IsIconic`, `GetWindowLong`, `dwmapi` `DwmGetWindowAttribute` and `kernel32`
  `GetPackageFullName`. Store packages and UI Automation exist only on Windows, so on Linux this part has nothing to
  attach to.
- The build: `csc.exe` from .NET Framework 4 (`%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\`), with references to
  `System.Windows.Forms.dll`, `System.Drawing.dll`, `System.Web.Extensions.dll` and the WPF folder's
  `UIAutomationClient.dll`, `UIAutomationTypes.dll` and `WindowsBase.dll`.

Mono (the old open-source .NET) can run some WinForms programs on Linux, but it cannot make these `user32` and
`gdi32` calls, and its UI Automation and named Windows events are partial at best. Running the program under Wine
might show whether the pets appear at all on the MacBook; that is a test, not a port.

**Installer** (`installer/install-astras-pet-os-20261014.ps1`): Windows PowerShell 5.1; `Add-Type` for
`System.Windows.Forms`, `System.Drawing` and `System.Web.Extensions`; compiles the desktop pets with `csc.exe`;
`robocopy`; `Unblock-File` (removes Windows' downloaded-file mark); `WScript.Shell` (COM) for Start menu `.lnk`
shortcuts; installs to `%LOCALAPPDATA%\Programs\astras-pet-os`; "Start my pets when Windows starts" runs the
desktop-pets program's `--install-startup` (the registry `Run` key); records SHA-256 hashes with `Get-FileHash`.

**Startup Star** (`findastra/startup-star`): PowerShell and VBScript, the Windows Startup folder
(`Astras PetOS Live Sync.vbs`), the scheduled task "Astras PetOS Startup Star" (sign-in and unlock), Start menu
shortcuts, and a log in `%LOCALAPPDATA%\astras-pet-apps\`.

## The desktop-pet problem on Linux

The desktop pets need windows that are transparent, let clicks through where there is no pet, stay on top of every
other window, can be placed anywhere and moved many times a second, never take focus and never show in the task bar,
across every monitor. Windows allows all of that. Linux desktops do not agree:

| What the pets need | X11 (Xfce, Kali's default desktop; any Xorg session) | KDE Plasma on Wayland, and wlroots desktops (Sway, Hyprland) | GNOME on Wayland (the default on Ubuntu and Debian's GNOME) |
| --- | --- | --- | --- |
| Transparent | Yes, with a compositing window manager (Xfce's has one) | Yes | Yes |
| Clicks through transparent pixels | Yes: an input shape (the XShape extension) | Yes: the surface's input region | Yes: the surface's input region |
| Always on top | Yes: `_NET_WM_STATE_ABOVE`, or a window the window manager does not manage | Yes: the **layer-shell** protocol's overlay layer | **No.** No protocol lets a normal app ask for it |
| Placed anywhere, moved freely | Yes | Yes: a layer-shell surface anchored to the screen, moved by its margins, one surface per monitor | **No.** Wayland apps cannot place their own windows |
| Not in the task bar, no focus | Yes: window-type and skip-taskbar hints | Yes: layer surfaces are not task-bar windows | n/a |
| Tray icon | StatusNotifierItem (Xfce and KDE have panels for it) | StatusNotifierItem | Only with the AppIndicator extension (Ubuntu ships it) |
| Start at sign-in | XDG autostart or a systemd user service | Same | Same |

**GNOME on Wayland** has three ways, none a sure one: run the pets as an X11 program under XWayland (it may partly
work: test it, especially above full-screen apps and on monitors with different scaling); write a GNOME Shell
extension (JavaScript inside GNOME, a second program to keep); or log in to GNOME on Xorg, which recent GNOME releases
are removing. The retired Cage is **not** the fallback: no browser roaming (AGENTS.md). On a desktop without pets, the
Farm page still shows every pet.

### A toolkit path for the port (for Astra to choose; not chosen here)

**First, whatever the toolkit:** split the desktop pets into a portable core (pet list and art loading, roaming,
lineup, partners, status file, `--self-test`) and a thin window layer, so Windows keeps working unchanged while a
Linux window layer is added. The desktop files are Codex's area ([PLAN.md](migration/PLAN.md), "Who edits what"), so
the split is planned with Codex.

Then prototype **one pet** (the Friendly Farmer, the only core pet) on two desktops, Kali's Xfce (X11) and KDE Plasma
(Wayland), with the two strongest paths, and choose on what the prototype shows:

| Path | What it keeps | X11 | Plasma and wlroots on Wayland | GNOME on Wayland | Cost |
| --- | --- | --- | --- | --- | --- |
| **A. C# on current .NET with Avalonia** | Most of the C# pet logic; one codebase for Windows and Linux | Yes | Through XWayland; layer-shell would need native code | XWayland | Leaves .NET Framework and `csc.exe`; NuGet packages; the Windows build changes too |
| **B. Qt 6 (PySide6 or C++) with LayerShellQt** | The farm already uses PySide6 (Astra Wisp) | Yes: frameless, stays-on-top and translucent window flags, an input mask | Yes: LayerShellQt is KDE's own layer-shell library | XWayland | A second program beside the Windows C# one |
| C. GTK with gtk-layer-shell | Nothing | GTK 3 only: GTK 4 cannot place its own windows | Yes: layer-shell's home | No | A new program in a new language |
| Not recommended: Electron or Tauri | | Yes | Cannot place windows | No | One heavy window per pet |

Every path adds a third-party toolkit, and the hub's rule is "no dependencies" (Node's built-in modules only); the
Windows program today uses only what ships with Windows. That exception is Astra's (open decision 6).

## Recommended order

### a) A Debian package of the portable core

One `.deb` that installs on Debian, Ubuntu, Raspberry Pi OS and Kali. No new distribution and no OS to maintain:
Debian keeps the kernel and security updates, and the package rides on top.

- **Contents:** the hub's pages and art (the System Map, the Farmer's desk, `apps/`, `cage.html` while it must keep
  working), the Node scripts, the registry, and the farm setup from the Windows installer (Example or Scratch, the core
  pets, a `--pets` list) as a Node script, so both installers share one farm logic.
- **One file for every machine:** nothing is compiled, so it is `Architecture: all`: the same file on the MacBook
  (amd64) and a Raspberry Pi (arm64).
- **Name:** the package takes the repo's name, `astras-pet-os` (names follow GitHub; Debian package names allow
  exactly that shape).
- **Where it puts things:** the release, read-only, in `/usr/share/astras-pet-os/`; each person's farm in their own
  home (`~/.local/share/astras-pet-os/`, settings in `~/.config/astras-pet-os/`), never in the system folders. Root
  installs the files; the pets never run as root.
- **Pets as systemd user services** (`~/.config/systemd/user/`, started with the person's session, no administrator
  rights), only for pets whose runtime runs on Linux: Role Fairy now, Chat Rat after its small changes, live sync as a
  timer (`git` fast-forwards with Startup Star's safety rules), and the Farm's server once Phase 3 builds it.
- **The Farm opened in a browser:** an `astras-pet-os` command and a menu entry that open the System Map and the
  Farmer's desk with `xdg-open`, as the Windows Start menu shortcuts do today.
- **Depends:** `nodejs (>= 20)`, from package.json. Recommends `git`, `gh`, `xdg-utils`. Debian 12 and Ubuntu 24.04 ship
  Node 18, which is too old; Debian 13 ships Node 20. Check each target with `apt-cache policy nodejs`, the MacBook
  first (Kali Rolling follows Debian testing).
- **Built and checked with Debian's own tools:** `dpkg-deb --build` and `lintian` (Debian's package checker), then an
  install test on a clean Debian and on Kali: `sudo apt install ./astras-pet-os_<version>_all.deb`, the System Map
  opens, the user services start, nothing listens beyond the PC itself, and uninstalling leaves the person's farm.
- **The ear tag:** a signed release (signed commits and releases, `skills/farm-security` section 6), so the package
  or its apt repository is signed. Agents never use Astra's security key.
- **Owner (recommendation):** a tool of The Farm, because the Windows installer is already The Farm's and the
  Friendly Farmer is the package manager. Alternative: a tool of Linux Iceberg (Linux Penguin owns packages and
  systemd). Either way Linux Penguin is the checker on Linux hosts (maker-checker rule).

**Needs from Astra:** her OK to build it on a branch (it is a core change), the owner (decision 2), the Node versions
it supports (decision 3), which pets get a Linux runtime first (decision 4), signing and where it is published
(decision 7), and the MacBook as the first install test (decision 10). When it ships, the core docs change with her
OK: the glossary row "Astra's PetOS: platform (runs on Windows)", the README's beta-tester steps and AGENTS.md's
"install only with `installer/install-astras-pet-os-20261014.ps1`" rule gain their Linux line.

### b) The desktop pets on Linux

After (a), because the pets need the core installed, and because the port is the largest piece of work:

1. The split into a portable core and a window layer (above), with Codex. Windows behaviour stays the same; the
   self-test proves it.
2. Prototype one pet on Xfce (X11) and on KDE Plasma (Wayland) with paths A and B.
3. Astra chooses the toolkit and the desktops.
4. Build every pet on it: tray Star with its clicks, lineup and roam, partners, moods, start at sign-in through XDG
   autostart or a systemd user service, in a package of its own so servers and Raspberry Pis can install the core
   without a desktop (its name from Astra).

**Needs from Astra:** the supported desktops (decision 5), the toolkit and its dependency exception (decision 6),
whether Windows moves to the same code or keeps its own, and an afternoon on the MacBook to look at the prototype,
since only a person can judge how the pets look and feel.

### c) Later: a Debian live image with Astra's PetOS installed

Only after (a) and (b) work, because an image of a platform that does not run yet helps nobody.

- Built with Debian's `live-build` (`lb config`, `lb build`), the same tool Kali uses for its images: Debian plus the
  package(s) from (a) and (b), the desktop chosen in (b), and a first start that opens the System Map, where the
  Friendly Farmer teaches "How to Take Care of Your Farm!" (ASTRAS_PET_OS.md, amendment of 2026-10-14).
- It is still Debian with the platform on top, not a new operating system, so the glossary keeps saying "platform".

**Needs from Astra:** a Debian build machine (a Debian virtual machine or the MacBook; an image is several GB and
can take an hour or more to build), where an ISO of that size is published, its signing, and **its name**
(decision 9). Debian's trademark policy limits how a derivative may use the Debian name.

## Kali's job: the tester

- **White Hat Weasel's lab** (White Hat Lab, #67, roadmap): test Astra's own farm the way an outsider would, on hosts
  Astra owns or names, nothing else (acceptance demonstration O in PLAN.md: refuse out-of-scope targets, give findings
  with evidence and fixes).
- **The second job** is a Debian-family install test of (a): Kali is built on Debian, so a package that installs there
  is a good sign for the others. It is not the recommended everyday system for a farm; Kali presents itself as a
  distribution for security testing.
- Linux Penguin (#58, Linux Iceberg) owns Linux administration, SSH, systemd and packages. His Mac checker and Kali
  trick wait in [linux-iceberg#2](https://github.com/findastra/linux-iceberg/pull/2).

## Open decisions for Astra

1. **Add-on first or distribution first?** Recommended: the Debian package first (a), a live image later (c).
2. **Who owns the Linux package?** Recommended: a tool of The Farm, with Linux Penguin as the checker. Or: a tool of
   Linux Iceberg.
3. **Node versions:** support only systems whose own Node is 20 or newer (Debian 13, current Kali, current Raspberry Pi
   OS), or also add Node from outside Debian for Debian 12 and Ubuntu 24.04 (a third-party source, so a supply-chain
   decision).
4. **Which pets run as Linux services first:** recommended Role Fairy now and Chat Rat after its small changes; and a
   Linux job, or none, for the pets whose program is Windows-only (File Master, API Fairy, Voicemeeter Bug, Deck
   Duck, RGBee, Rift Rabbit, Drum Dog, Project Parrot).
5. **Which Linux desktops get desktop pets:** recommended X11 and KDE Plasma. On GNOME on Wayland: test XWayland, write
   a GNOME Shell extension, or no desktop pets there (the Farm page still shows them).
6. **The desktop toolkit and its exception to "no dependencies":** chosen after the one-pet prototype (paths A and B
   above); and whether Windows moves to it too.
7. **Signing and publishing:** who signs packages and with which key (not her security key for agents' work), and
   where they live (a GitHub release first, an apt repository later). Publishing needs her OK.
8. **GitHub is Microsoft's, and it is the farm's only shared place** (`skills/farm-security` section 3). Nothing was
   changed. The choices:
   - **Stay** on GitHub.
   - **Mirror** to Codeberg or to a self-hosted Forgejo, with GitHub still the main copy. Codeberg is run by a German
     non-profit and is for free software, so it fits the public repos, not private farms (a farm's new repos start
     private). Forgejo, the software Codeberg runs, can be hosted at home (a home server or the Raspberry Pi) with
     private repos, push mirrors and its own Actions; it then needs a machine, TLS, backups and updates (Server
     Salamander's, Proxy Axolotl's and Backup Beaver's ground).
   - **Move** the main copy to Forgejo later, with GitHub as the mirror.

   What depends on GitHub today: every pet repo; the one art source, since pages load pictures from
   `raw.githubusercontent.com` (PET-FILES.md); GitHub Pages (the System Map's public copy, Ghost Protocol, Paper Girl,
   Platform Platypus, the Fuzzboi sites); GitHub Actions (the Farmer's daily round); the `gh` and GitHub API calls in
   the tools (pet-finder, pet-privatizer, the Idle Flash Audit, the Farmer's rounds, the profile round); the findastra
   profile README; the GitHub Goldfish's whole job; and the vet-clinic, which is a GitHub issue tracker. Changing the
   "only shared place" rule is a security change, so it is hers (L4). Other Microsoft pieces, for the same decision:
   the npm registry (owned by GitHub) that Discord Damsel's and Role Fairy's packages come from, VS Code (VSCode
   Angel's program), OneNote (Project Parrot's), and the Windows-only parts above.
9. **The live image's name**, if (c) happens, and the glossary's wording ("runs on Windows" becomes "runs on Windows
   and Linux" when (a) ships).
10. **The MacBook:** the first install test for (a), and White Hat Weasel's lab scope: which hosts and networks are in
    scope.

## Limits of this check

- No Linux machine was used. The Linux evidence is the GitHub Actions run named above and the code itself, read on
  GitHub on 2026-10-18.
- Not run on Linux: the full `npm run build`, `npm run check`, `npm run generate`, and every pet program.
- Distribution Node versions come from their release package lists as known on 2026-10-18; check each machine with
  `apt-cache policy nodejs`.
- Chip's Data Dealer project, Sugarcube's app branch and the candidates were not checked.
