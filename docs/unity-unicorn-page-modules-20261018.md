# Unity Unicorn's page, module by module (2026-10-18)

*The example for [PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md), section 3: what goes in each of Unity
Unicorn's four intelligence-level modules, so no tool is missed. Read from
[findastra/unity-unicorn](https://github.com/findastra/unity-unicorn) on 2026-10-18: `main`, every branch and the open
pull requests #1 and #3. Claude Opus 5.5 (`claude-opus-5-5`). Nothing here is built on the page yet.*

Home: **Unity Stable** (`pet-programs.json`; Astra kept the name on 2026-10-18).

## `unity-unicorn-L1-module`

**3rd party programs:** Unity, VRChat Creator Companion (VCC), VRChat and its SDK, Blender (marble-carver and
vine-bloomer run in it), VRCFT (face tracking). Third-party packages it works with, from its skill book: Poiyomi, VRCFury, Modular Avatar
with NDMF, lilToon, d4rkAvatarOptimizer, AudioLink, Gesture Manager, Av3Emulator, SPS Configurator.

**Your programs:** Piranesi House (from the sketch; Piranesi Nessi looks after it too, so it is also a connection box),
Unity Unicorn Icon (from the sketch), Dubstep Gunsmith (Astra's catalog site for avatar gun effects; in PR #1, and its
source is only in the Codex workspace on the PC).

**Your tools on `main` (30):** each tool's kind is the one its catalog file gives.

| Kind | Tools |
|---|---|
| Audit (9) | button-check, cloud-collider-audit, cloud-collider-validation, cloud-physics-check, cloud-survey, masonry-structural-audit, no-windows-audit-tool, scene-yaml-inspection, world-validator |
| Generator (7) | cloud-mesh-generator, cloud-sea-fusion, marble-carver, masonry-regeneration, neck-blender, vine-bloomer, wall-texture-rebuild |
| Editor (4) | cloud-lounge-smoothing (its file is `cloud-puff-smoothing-20261011.json`), house-scene-builder, masonry-unity-refresh, no-windows-scene-refresh |
| Build (3) | desktop-world-test, occlusion-bake, reflection-probe-bake |
| Preview (3) | asset-contact-sheet, scene-preview-render, time-season-tide-preview |
| Utility (2) | foreground-tool-recorder, run-unity-tool (the runner script, `scripts/run-unity-tool-20261011.py`; it has no catalog file) |
| Workflow (2) | vcc-package-manager, vrchat-avatar-upload |

**Your tools not merged** (each marked "not merged" on the page):

| Where | Tools |
|---|---|
| [PR #1](https://github.com/findastra/unity-unicorn/pull/1), with a catalog file (8) | bending-adder, chain-dangle-weights, fan-fitter, golden-painter, gunsmith-loadout, rgb-painter, sparkle-strapper, star-effects-diagnostic |
| PR #1, Unity menu only, **no catalog file** (10) | copyright-logger, copyright-catcher, hair-weighter, spring-joint-strapper, learn-add-ons ("Learn add-ons from selected avatar"), blood-bender-strapper, water-bender-strapper, sparkle-bender-strapper, wing-strapper, neck-bow-strapper |
| [PR #3](https://github.com/findastra/unity-unicorn/pull/3) (2) | glass-animal-tool, bubble-chair-blower |
| branch `claude/face-transfer-20261011`, no pull request (1) | face-transfer |
| branch `claude/asset-ledger-20261014`, design only (0) | asset-ledger (decided 2026-10-14; a design and a card for Codex, no code yet) |

That is 30 tools on `main` and 21 not merged. The sketch shows two, **copyright-collector** and
**copyright-auditor**; the code in PR #1 names them **copyright-logger** and **copyright-catcher**.

## `unity-unicorn-L2-module`

**Your tricks:** none written as tricks yet.
- From the sketch, to write: weekly-update-from-friendly-farmer, weekly-copyright-auditor.
- The skill book ([docs/skills-20261009.md](https://github.com/findastra/unity-unicorn/blob/main/docs/skills-20261009.md))
  holds what the Unicorn has learned (finding the newest avatar version, uploading through the SDK, diagnosing failed
  builds, VCC packages). Each one becomes a trick once it is written as a skill file.
- **vcc-package-manager** and **vrchat-avatar-upload** are catalogued as tools of kind Workflow, but each is a list of
  steps an AI follows. By AGENTS.md ("Tools vs tricks") they are tricks.

**Schedule:** a weekly self-audit on Thursday ([MOOD-KEY.md](../MOOD-KEY.md)); each tool run is recorded with its date.

**Connection boxes**, from `relations` in pets.json and system-map.json: Friendly Farmer (his round, and the sketch's
weekly update), Rift Rabbit (VR performance findings that become world build tasks), Skill Scout (its tricks). The
migration plan adds Piranesi Nessi, Pole Puff and OSC Sealion (their worlds' Unity builds and face-tracking rigs); they
are not in the relations yet.

## `unity-unicorn-L3-module`

**The seat:** Claude Code or Codex when a chat is working on it; "Seat: empty" otherwise.
**Harness skills** on this PC (Claude Code's, not the pet's): face-transfer, vrchat-unity-world.

## `unity-unicorn-L4-module`

**Approvals waiting on you:** none recorded yet. The skill book already names one: the VRChat copyright agreement is
always Astra's to click. Others: merging PR #1 and PR #3.

## Waiting on Astra

1. Copyright tools: are they **copyright-collector and copyright-auditor** (the sketch) or **copyright-logger and
   copyright-catcher** (the code)?
2. What is **Unity Unicorn Icon** as a program?
3. Should vcc-package-manager and vrchat-avatar-upload move from tools to tricks?
4. The 10 menu tools in PR #1 need catalog files, so the page and the Goldfish can see them. That is work for the
   Unity Unicorn's chat, in its own repo.
