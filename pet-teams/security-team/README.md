# Security Team

*A pet team from Astra's PetOS: 8 pets that work together, as text you give to your own AI. By Astra.*

Watch your own PC and your own home network, the way Astra's security pets watch hers: one group for the network, one for the PC. They look and explain; you decide and make every change yourself.

| Group | Pet | Its job in this team |
| --- | --- | --- |
| Network | Packet Piranha | The network's health: loss, latency, DNS and routes. Says whether the network was fine at a given moment, so a problem is put in the right place (the router, the provider, DNS or a website). |
| Network | White Hat Weasel | Ports and devices: which ports are open on this computer, which program owns each, who is connected and from where, which devices this computer has seen on the home network, and what to close. Security checks only on your own computer and network. |
| Network | Wifi Butterfly | The radios nearby: Wi-Fi networks and Bluetooth devices, and any that are new or unknown. Only its security role is part of this team; the rest of its job is still being chosen. |
| Network | Roaming Raven | Remote access and VPNs: which ways in from outside are switched on (remote desktop, SSH, a VPN or tailnet), whether each is meant to be, and how to keep the ones you use private. |
| PC | Kernel Koala | What runs on your PC: every program and what it is, what is safe to stop, the leftovers that keep running after a window closes, and what starts at sign-in. |
| PC | Log Lynx | The logs: errors and crashes in the system's own logs, failed sign-ins, and anything that repeats. Reads logs; never clears them. |
| PC | Forensic Ferret | When something looks wrong: a case with a timeline of what happened when, from the other pets' findings, with a fingerprint (SHA-256) of every file kept as evidence. It never changes or deletes what it looks at. |
| PC | Patch Cat | Patches: which security updates Windows, the drivers and the apps are still missing, and whether the antivirus is on and up to date. It lists; you install. |

## What this is, and what it is not

- **It is text.** Every file here is Markdown. Nothing in it installs, runs or downloads anything by itself, and
  you do not need Astra's PetOS. Read every file before you give it to an AI: it is short.
- **The pets look; you change.** Each pet suggests read-only checks with your computer's own commands. The AI
  shows you each command first and runs it only after you say yes. Fixes are steps you take yourself.
- **Your own computer and network only.** The pets refuse anyone else's devices, networks or websites.
- **Not included:** the programs Astra's pets run on her own PC (each pet says which). Here the AI does the
  looking itself, so it is only as careful as the AI and harness you use. Its rules are instructions, not a lock:
  your harness's own permission prompts are what actually stop a command, so keep them on.

## Use it one of three ways

1. **One file, any AI.** Give [security-team-all-in-one-20261120.md](security-team-all-in-one-20261120.md) to the AI you use and say: *"Read this
   file. You are this team. Follow its rules. Start with the Network group."*
2. **As skills, in an agent harness that loads skill folders** (Claude Code, Codex, and others that read
   `SKILL.md`). Copy the folders in `skills/` into your harness's skills folder, one folder per pet. Keep the
   harness's permission prompts on, so every command still asks you first.
3. **Just read it.** Each pet's checks are plain commands with what they read: run the ones you want yourself.

For memory, tell the AI which folder it may write its notes in (rule 3): one dated Markdown file per day per pet.

## Check you have the real copy

Get these files from Astra's PetOS on GitHub (https://github.com/findastra/astras-pet-os/blob/main/pet-teams/security-team), not from a stranger's zip. Every file's SHA-256
fingerprint is in [sha256sums-20261120.txt](sha256sums-20261120.txt); if one differs from GitHub's, the file was changed: don't use it.

- Windows (PowerShell, in this folder): `Get-FileHash -Algorithm SHA256 -Path (Get-ChildItem -Recurse -File).FullName`
- Linux or Mac (in this folder): `sha256sum -c sha256sums-20261120.txt` (Mac: `shasum -a 256 -c sha256sums-20261120.txt`)

## Files

- [security-team-all-in-one-20261120.md](security-team-all-in-one-20261120.md): the whole team in one file.
- [skills/packet-piranha/SKILL.md](skills/packet-piranha/SKILL.md): Packet Piranha alone, as a skill.
- [skills/white-hat-weasel/SKILL.md](skills/white-hat-weasel/SKILL.md): White Hat Weasel alone, as a skill.
- [skills/wifi-butterfly/SKILL.md](skills/wifi-butterfly/SKILL.md): Wifi Butterfly alone, as a skill.
- [skills/roaming-raven/SKILL.md](skills/roaming-raven/SKILL.md): Roaming Raven alone, as a skill.
- [skills/kernel-koala/SKILL.md](skills/kernel-koala/SKILL.md): Kernel Koala alone, as a skill.
- [skills/log-lynx/SKILL.md](skills/log-lynx/SKILL.md): Log Lynx alone, as a skill.
- [skills/forensic-ferret/SKILL.md](skills/forensic-ferret/SKILL.md): Forensic Ferret alone, as a skill.
- [skills/patch-cat/SKILL.md](skills/patch-cat/SKILL.md): Patch Cat alone, as a skill.
- [sha256sums-20261120.txt](sha256sums-20261120.txt): the fingerprints.

Want the whole farm, with the desktop pets? [Install Astra's PetOS](https://github.com/findastra/astras-pet-os/blob/main/INSTALL.md). Each pet's own page and
its single Markdown pet are in [markdown-pets](https://github.com/findastra/astras-pet-os/blob/main/markdown-pets/README.md).

*Made from Astra's PetOS registry by the Friendly Farmer's the-farm-v1.0-pet-teams-v1.0. Do not edit it: change
`pet-teams-20261120.json` and run `npm run build`.*
