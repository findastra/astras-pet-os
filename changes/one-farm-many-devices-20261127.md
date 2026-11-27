# One farm across all your devices, every pet once · 2026-11-27

Astra, 2026-11-27, with a home server (the GEEKOM) joining her desktop PC: "We dont want duplicate pets right? This
Pet OS is being designed so pets can live across devices in a unified group of devices right? That only makes
sense." Then "Yes, start step 1" for the words-first pull request. Docs only: nothing runs differently.

The architecture already said so (ASTRAS_PET_OS.md, section 2 "cross-device, distributed"; 5.2 execution hosts; 5.3
"where it can run and where it is actually running ... idempotency keys and leases"). What was out of step is what
the hub built since: one computer = one farm. This change writes the decision down where every assistant reads it.

- **ASTRAS_PET_OS.md:** a new amendment at the top. A farm is all of one user's devices (hosts); `pets.json` lists
  each pet once; each pet's server runs on one host at a time (placement, held by a lease); a pet that must see
  another device gets a probe there (a tool, no face, mood or memory); every host runs only a host agent (Startup
  Star on Windows today). Until hosts are recorded, no second farm on another of the owner's devices.
- **skills/dev-mindset/SKILL.md (glossary):** "Astra's PetOS" runs on Windows and Linux hosts; "A farm" is one user's
  devices, not one install; new rows Host, Host agent, Placement, Probe and Duplicate pet (split brain). The Host row
  says the Friendly Farmer's `role: "host"` collides with real hosts; renaming it to `orchestrator` is proposed only.
- **skills/farm-security/SKILL.md, section 3:** "One farm, many hosts": a device joins only with L4's approval, hosts
  talk only through typed, allowlisted actions, SSH between her own devices is the setup cable, not a pet channel.
  Status: written only; recording and checking hosts is planned.
- **AGENTS.md:** the same rule next to "Farms never connect to each other".
- **MAKE-IT-YOURS.md:** for every farm owner: install on one computer only until devices can be recorded as hosts.
- **docs/migration/PLAN.md:** decision 6 (where the Farm runs first) is still open, but whatever the answer, it is
  one farm; Phase 8 now reads "more devices join the same farm as hosts".

Next steps (card 451): hosts in `pets.json` with a test; Startup Star starts only servers placed on its own PC;
the Linux package joins a farm instead of making one; then leases, heartbeats and "runs on" on the Farm's cards.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-27. Card and pull request: #451.
