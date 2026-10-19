# Astra's PetOS on Linux: the package

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19. Step (a) of the [Linux readiness check](linux-readiness-20261018.md),
built the way Astra chose on 2026-10-19: an add-on for the Linux people already run, owned by The Farm and checked by
Linux Penguin, for distributions whose own Node is 20 or newer, with Linux Penguin as the Linux guide, and pet
services that are off until someone turns one on. **Not released yet:** no release carries the package, and it has
not been installed on a real Linux computer yet (the Kali MacBook is the first).

## What it is

One file, `astras-pet-os_<version>_all.deb`, for Debian, Ubuntu, Raspberry Pi OS and Kali on any processor (nothing in
it is compiled). It is a tool of The Farm, the Linux twin of the Windows installer zip. Debian keeps the kernel and
security updates; the package rides on top. Astra's PetOS is still a platform, not an operating system.

| | Windows (the installer zip) | Linux (this package) |
| --- | --- | --- |
| Farm setup | The "Set up your farm" window, or `-Farm Example` / `-Farm Scratch -Pets ...` | `astras-pet-os setup` asks, or `--farm example` / `--farm scratch --pets ...` |
| Same farm? | `Get-FarmPets` in the installer | `scripts/farm-setup-20261019.mjs`, tested to list exactly the same pets |
| Pages | Start menu: System Map | App menu: System Map, Friendly Farmer's Desk |
| Desktop pets | Built from source on the PC | **Not yet** (step b of the readiness check) |
| Big red button | Stop Astra's PetOS (the desktop pets) | Stop Astra's PetOS (the pet services) |
| Linux Penguin | | Bundled: says which Linux this is and which of his tricks fits |
| Pet services | | Role Fairy and Chat Rat, **off** until you turn one on |

## Install it (once a release carries it)

```bash
sudo apt install ./astras-pet-os_0.3.0~beta_all.deb
astras-pet-os setup
astras-pet-os map
```

`apt` installs Node if it is missing (`Depends: nodejs (>= 20)`). Debian 13, current Kali and current Raspberry Pi OS
have Node 20 or newer; Debian 12 and Ubuntu 24.04 have Node 18, so the package does not install there (decision 3).
Installing runs nothing: the package has no maintainer scripts. Removing it (`sudo apt remove astras-pet-os`) leaves
each person's farm in their home.

## The commands

| Command | What it does |
| --- | --- |
| `astras-pet-os` | Linux Penguin says which Linux this is and which trick fits, then the commands |
| `astras-pet-os setup` | Set up your farm: Astra's example pets, or from scratch (`--farm`, `--pets` for no questions) |
| `astras-pet-os list-pets` | The pets you can put on your farm, with their ids |
| `astras-pet-os map`, `desk` | Open the System Map, or the Friendly Farmer's desk (with `xdg-open`) |
| `astras-pet-os penguin` | Linux Penguin's read-only check of this computer |
| `astras-pet-os services` | The pet services and whether each is on |
| `astras-pet-os service on <pet>`, `off <pet>` | Turn a pet service on (after checking the pet is ready) or off |
| `astras-pet-os stop` | The big red button: stop every pet service now |

## Linux Penguin, the Linux guide

The package carries Linux Penguin (pet program #58, Linux Iceberg) from his own repo at a pinned commit
([linux/bundled-pets-20261019.json](../linux/bundled-pets-20261019.json)), so there is one copy of his tools, owned by
him. His Linux check, `linux-iceberg-v0.1-linux-check-v1.0`, reads `/etc/os-release` to find the distribution's
family, and his trick for that family helps the person (and their AI) find their way around and keep packages,
updates and services in order. **One trick per family** (Astra, 2026-10-19): the Debian-family trick covers Debian,
Ubuntu, Kali, Raspberry Pi OS, Mint and Pop!_OS. His check already recognises the Fedora, Arch, SUSE and Alpine
families and says their tricks are not written yet. He pops up in the terminal; on the desktop once desktop pets run
on Linux. The pin points at [linux-iceberg#3](https://github.com/findastra/linux-iceberg/pull/3) until it is merged.

## Pet services (off unless you turn one on)

A pet service is a pet program running on its own in the background, as a systemd **user** service: no administrator
rights, started when you log in, stopped when you log out. The package installs one template,
`/usr/lib/systemd/user/astras-pet-os-pet@.service`, and never turns it on. `astras-pet-os service on <pet>` checks the
pet first and says what is missing. The package never downloads code or packages for you: you clone the pet yourself.

- **Role Fairy** (`role-fairy`): her program into `~/.local/share/astras-pet-os/pets/role-fairy`, her packages from her
  lockfile (`pnpm install --frozen-lockfile --prod`), her `config.json`, and `DISCORD_BOT_TOKEN=` in
  `~/.config/astras-pet-os/pets/role-fairy.env` (`chmod 600`). **Run each bot on one computer only:** if she already
  runs on the PC, leave her off on the Linux one. Her `package.json` asks for Node 24.17 or newer, so she does not run on
  Debian 13's Node 20 until that is lowered in her repo (after testing on Node 20) or the computer has a newer Node.
- **Chat Rat** (`chat-rat`): his program into `~/.local/share/astras-pet-os/pets/chat-rat`. He listens on this computer
  only. Saving and searching chats work; his "open folder" button still opens File Explorer only, a small change in
  his repo that is not made yet.

## Where things go

| Where | What |
| --- | --- |
| `/usr/share/astras-pet-os/` | The release, read only: this repo at the release's commit, without the Windows installer, git files, `linux/` (placed below instead) and license files (the license is in `copyright`, once) |
| `/usr/share/astras-pet-os/pets/linux-iceberg/` | Linux Penguin's tools, tricks, `pet.json` and README |
| `/usr/bin/astras-pet-os` | The command (runs `scripts/linux-cli-20261019.mjs` with Node); `man astras-pet-os` explains it |
| `/usr/lib/systemd/user/astras-pet-os-pet@.service` | The pet service template, off |
| `/usr/share/applications/` | System Map, Friendly Farmer's Desk, Stop Astra's PetOS (big red button) |
| `/usr/share/icons/hicolor/256x256/apps/astras-pet-os.png` | The Friendly Farmer's happy picture, from the one art source |
| `/usr/share/doc/astras-pet-os/` | `copyright` (machine-readable, MIT) and `changelog.gz` |
| `~/.local/share/astras-pet-os/farm/` | Your farm: its `pets.json`, draft list and `farm-receipt.json` |
| `~/.local/share/astras-pet-os/pets/<repo>/` | Pet programs you cloned for pet services |
| `~/.config/astras-pet-os/pets/<pet>.env` | A pet service's secrets, readable only by you |

## Build it

```bash
node scripts/linux-deb-20261019.mjs v0.3.0-beta out
```

The first argument is any tag or commit (default `HEAD`); the package is built from git, never from the working
folder, so it holds exactly what is committed. It needs the network to fetch the bundled pets at their pinned commits
(`--no-bundled` leaves them out). `node scripts/linux-deb-20261019.mjs --list <file.deb>` shows what is inside a
package. The builder uses Node's own modules only (a `.deb` is an `ar` archive of `debian-binary`, `control.tar.gz` and
`data.tar.gz`), so it builds on Windows too. Its tar headers are plain ustar: a path over 100 bytes is split at a slash
into ustar's `prefix` and `name`, which dpkg joins again. **Never pax headers:** dpkg stops on them ("unsupported PAX tar
header type", `lib/dpkg/tarfn.c`), while GNU tar, libarchive and lintian read them without a word, so only a test that
looks at each header catches it. On Debian, check a package with `dpkg-deb --info`, `dpkg-deb --contents`
and `lintian`.

## What was tested, and what was not

**Checker review, 2026-10-19** (a separate read-only Claude session, the maker-checker rule): one blocker, fixed. The
first build wrote pax headers for its two paths over 100 bytes, which dpkg refuses, so `apt install` would have failed.
Also fixed from the review: git and license files and `linux/` are no longer shipped, a man page is added, a pet
service stopped by systemd is no longer marked failed, `--pets` ignores case as the installer does, and Linux
Penguin's check counts updates in any language and holds no loopback address with a port.

**Tested on Windows, 2026-10-19:**
- `npm test`: 164 tests, 163 pass, 0 fail, 1 skipped (the pets-board workflow test, which skips everywhere). The 10
  new ones are in `test/linux-package-test-20261019.mjs`. They cover the farm setup, its exact agreement with the
  Windows installer's `Get-FarmPets` (same 37 pets, order, core flags, drafts, repos and jobs), the command, the
  service checks, the menu entries, the bundle pin, long tar names, and a full package read back with every md5
  checked.
- A package built with Linux Penguin bundled (99 MB, 1,205 files) was read by three independent programs: Windows'
  `tar` (libarchive) read the `ar` wrapper, GNU tar unpacked both archives inside, and Python's `tarfile` found no pax
  and no GNU long-name header (its longest path, 120 bytes, reads back whole). Unpacked, `md5sum -c` matched all 1,205
  files, and the command ran from the unpacked copy.
- Linux Penguin's tests in his repo: 38 of 38 (`bash tests/linux-check-test-20261019.sh`).

**Not tested yet** (no Linux computer was used): `dpkg-deb --info`, `lintian`, `apt install` on Debian or Kali; the
systemd unit; `xdg-open`; the menu entries in a real desktop; Linux Penguin's check on a real Linux computer. The
first test is the Kali MacBook, from RED USB.

## What is left (with Astra's OK)

1. Install it on the Kali MacBook and run `lintian` there; fix what it finds.
2. Publish it on a release: who signs it and where it lives (decision 7). Then INSTALL.md, the README's install link,
   AGENTS.md's beta-tester rule and the dev-mindset glossary ("runs on Windows") gain their Linux line.
3. After [linux-iceberg#3](https://github.com/findastra/linux-iceberg/pull/3) is merged, move the penguin's pin to that
   commit on his `main`.
4. Chat Rat's "open folder" on Linux (`xdg-open`), in his repo; Role Fairy's Node requirement, in hers.
5. Desktop pets on Linux (step b), with Codex, so the penguin can pop up on the desktop. Until then, the pages show
   every pet in the release, as on Windows: only the desktop pets read the farm.
6. Known lintian note: the System Map loads three.js and Google Fonts from the internet (`privacy-breach-generic`), so
   the 3D map does not work offline. A local copy is a change to the "no dependencies" rule, so it is Astra's call.
7. A System Map card for this tool (`the-farm-v1.0-linux-package-v0.1`) and The Farm's grant to run Linux Penguin's
   check: after the tools-on-the-map pull request (#106), with Astra.
