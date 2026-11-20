# Every assistant reads White Hat Weasel's device list (2026-11-20)

Astra, 2026-11-20, after an assistant said it knew the specs of only one of her four computers: "Why cant you figure
out that there is a pet that keeps track of all the devices? Make it so you can." Then: "it is a security pet, clue:
the system map has the devices on it." The pet is White Hat Weasel: his port check of 2026-11-17 lists every device
on the home network.

- **skills/devices/SKILL.md** (new): before answering anything about a device, read the System Map's device nodes,
  then White Hat Weasel's private `devices.md` (findastra/white-hat-lab), attaching that repo in a cloud chat.
  Keep it true; never copy details into a public repo.
- **CLAUDE.md:** one line pointing to the skill.
- **system-map.json:** a "Home server" node (named by kind only, PROTECTION-RINGS.md known gap 12), linked from
  Server Hearth (manages), White Hat Lab (findings) and to the home router.
- **findastra/white-hat-lab** (same branch name): `devices.md`, the private list: every computer, the router, phones,
  VR and other hardware, with specs where known, each with its source, and what is still unknown (the laptop's and
  the GEEKOM's specs, the MacBook's year, two unidentified devices).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
