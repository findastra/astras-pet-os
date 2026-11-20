---
name: devices
description: Where Astra's devices are written down (her computers, the home server, the Raspberry Pi, phones, VR, network). Use before answering, planning or building anything that depends on which device, model, specs, hostname or address, and before ever saying you don't know what hardware Astra has.
---

# Astra's devices (Astra, 2026-11-20)

Astra, 2026-11-20: "Why cant you figure out that there is a pet that keeps track of all the devices? Make it so you
can." The pet is **White Hat Weasel** (White Hat Lab, a security pet): his port checks list every device on the home
network, and he keeps the device list (asset inventory, ring 6).

## Before you answer anything about a device, read both

1. **The System Map** (`system-map.json`): every node in category `Device`, `Hardware`, `PC hardware` and
   `VR hardware`, and their links. It names each device by kind only ("Desktop PC", "Home server"); the desktop's
   parts come from PC Master's look.
2. **White Hat Weasel's device list**: `devices.md` in **findastra/white-hat-lab** (private). Models, specs,
   hostnames, addresses and jobs, each with where it came from. His newest port check in `scans/` lists what is on
   the network. In a cloud chat, attach the repo first (add the GitHub repo `findastra/white-hat-lab` to the session);
   on Astra's PC it is in her projects folder.

Only after both, say what is still unknown, and name the exact place to fill it (for a Windows PC: Settings → System
→ About; PC Master's look once it runs there).

## Keep it true

- New facts about a device (a photo, a spec Astra tells you, a scan): update its row in `devices.md` on a branch of
  findastra/white-hat-lab, with the date and the source, in the same chat.
- A new device: a row in `devices.md`, and a node on the System Map named by its kind only, never its model, hostname
  or address (PROTECTION-RINGS.md, known gap 12). `npm run build`, `npm test`.
- Never copy anything from `devices.md` into this hub or another public repo. No serial numbers, MAC addresses or
  passwords anywhere.

Made by Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
