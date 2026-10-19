# Unity Unicorn's page, module by module (2026-10-18)

*The example for [PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md), section 3: what goes in each of Unity
Unicorn's four intelligence-level modules, so no tool is missed. Read from
[findastra/unity-unicorn](https://github.com/findastra/unity-unicorn) on 2026-10-18, after its PR #9 was merged:
`main` at `69453f7`, every branch and Codex's open drafts #1 and #3 (every other branch is already in `main`). The page
has these modules since [PR #8](https://github.com/findastra/unity-unicorn/pull/8) and
[PR #9](https://github.com/findastra/unity-unicorn/pull/9), and its `pet.json` holds the same lists as
`intelligence_levels`; this doc follows that block. Claude Opus 5.5 (`claude-opus-5-5`).*

Home: **Unity Stable** (`pet-programs.json`; Astra kept the name on 2026-10-18).

## `unity-unicorn-L1-module`

**3rd party programs** (`L1.third_party`): Unity 2022.3, VRChat Creator Companion (VCC), VRChat SDK, Blender
(marble-carver, vine-bloomer, neck-blender, prop-decomposer and realistic-prop-restyle run in it), VRCFT (face
tracking). Third-party packages it works with, from its skill book: Poiyomi, VRCFury, Modular Avatar with NDMF, lilToon,
d4rkAvatarOptimizer, AudioLink, Gesture Manager, Av3Emulator, SPS Configurator.

**Your programs** (`L1.native`): Poppy (avatar project; it has the Unity Unicorn menu installed, Tools › Unity Unicorn),
Piranesi House (world; Piranesi Nessi looks after it too, so it is also a connection box), Liminal Doors (world;
world-spawn-tool was first written there), Dubstep Gunsmith (Astra's catalog site for avatar gun effects; in PR #1, not
merged, and its source is only in the Codex workspace on the PC). PR #1 also gives Dubstep Gunsmith a catalog file,
`tools/dubstep-gunsmith-20261012.json`, but it is a program, not a tool. The sketch also shows **Unity Unicorn Icon**;
it is not in `pet.json` or on the page until Astra says what it is.

**Your tools on `main` (34)** (`L1.tools`): each tool's kind is the one its catalog file gives. 33 have a catalog file
in `tools/`; run-unity-tool is the 34th.

| Kind | Tools |
|---|---|
| Audit (10) | button-check, cloud-collider-audit, cloud-collider-validation, cloud-physics-check, cloud-survey, masonry-structural-audit, no-windows-audit-tool, prop-decomposer, scene-yaml-inspection, world-validator |
| Generator (9) | cloud-mesh-generator, cloud-sea-fusion, marble-carver, masonry-regeneration, neck-blender, realistic-prop-restyle, vine-bloomer, wall-texture-rebuild, world-spawn-tool |
| Editor (4) | cloud-lounge-smoothing (its file is `cloud-puff-smoothing-20261011.json`), house-scene-builder, masonry-unity-refresh, no-windows-scene-refresh |
| Build (3) | desktop-world-test, occlusion-bake, reflection-probe-bake |
| Preview (3) | asset-contact-sheet, scene-preview-render, time-season-tide-preview |
| Utility (2) | foreground-tool-recorder, run-unity-tool (the runner script, `scripts/run-unity-tool-20261011.py`; it has no catalog file) |
| Workflow (3) | face-transfer, vcc-package-manager, vrchat-avatar-upload |

The four that came in on 2026-10-18:
- **face-transfer** was merged in [PR #6](https://github.com/findastra/unity-unicorn/pull/6)
  (`scripts/face-transfer-20261011.py`, its guide and tests).
- **prop-decomposer** and **realistic-prop-restyle** were merged in
  [PR #7](https://github.com/findastra/unity-unicorn/pull/7), with the trick that uses them (L2).
- **world-spawn-tool** moved in from findastra/liminal-doors in PR #9 (`scripts/world-spawn-tool/`, its guide and 9
  offline tests); liminal-doors#1, where it started, is closed without merging. Its `--apply` step still copies a
  reference world. Astra's rule since 2026-10-18 is that new worlds start fresh from VCC's World template, so that step
  must change before the next world.

**vcc-package-manager** and **vrchat-avatar-upload** appear here only, not in L2: they are catalogued as tools of kind
Workflow. Whether they should be tricks is still waiting on Astra (question 3 below).

**Your tools not merged (21)** (`L1.tools_not_merged`; each marked "not merged" on the page):

| Where | Tools |
|---|---|
| [PR #1](https://github.com/findastra/unity-unicorn/pull/1) (draft, Codex), with a catalog file (8) | bending-adder, chain-dangle-weights, fan-fitter, golden-painter, gunsmith-loadout, rgb-painter, sparkle-strapper, star-effects-diagnostic |
| PR #1, Unity menu only, **no catalog file** (10) | copyright-logger, copyright-catcher, hair-weighter, spring-joint-strapper, learn-add-ons ("Learn add-ons from selected avatar"), blood-bender-strapper, water-bender-strapper, sparkle-bender-strapper, wing-strapper, neck-bow-strapper |
| [PR #3](https://github.com/findastra/unity-unicorn/pull/3) (draft, Codex) (2) | glass-animal-tool, bubble-chair-blower |
| design only (1) | asset-ledger (decided 2026-10-14; the design, `docs/asset-ledger-20261014.md`, was merged in PR #2; no code yet) |

That is 34 tools on `main` and 21 not merged. Both drafts conflict with `main`. Unity Unicorn's card
[002](https://github.com/findastra/unity-unicorn/blob/main/handoffs/002-codex-merge-avatar-effects-and-glass-tools-20261018.md)
asks Codex to bring them up to date, write the 10 missing catalog files and move each tool from `tools_not_merged` to
`tools` when it is merged. PR #3 stays a draft until bubble-chair-blower molds around the seated avatar. Poppy's project
already has PR #1's Unity menu installed.

The sketch shows two of these as **copyright-collector** and **copyright-auditor**; the code in PR #1 names them
**copyright-logger** and **copyright-catcher**.

No tool of another pet is listed here: the Friendly Farmer's, Skill Scout's and Door Dormouse's stay in their own pet
programs.

## `unity-unicorn-L2-module`

**Your tricks** (`L2.tricks`): **make-a-prop-look-real**
([skills/make-a-prop-look-real/SKILL.md](https://github.com/findastra/unity-unicorn/blob/main/skills/make-a-prop-look-real/SKILL.md),
merged in PR #7). It uses the L1 tools prop-decomposer and realistic-prop-restyle, and every download it makes is a row
in `docs/download-ledger-20261018.json`.

**Tricks to write** (`L2.tricks_to_write`), from the sketch: weekly-update-from-friendly-farmer,
weekly-copyright-auditor. The skill book
([docs/skills-20261009.md](https://github.com/findastra/unity-unicorn/blob/main/docs/skills-20261009.md)) holds what
the Unicorn has learned (finding the newest avatar version, uploading through the SDK, diagnosing failed builds, VCC
packages). Each one becomes a trick once it is written as a skill file.

**Schedule:** a weekly self-audit on Thursday ([MOOD-KEY.md](../MOOD-KEY.md)); a weekly backlog run that bundles new
session notes into the next task; each tool's use dates come only from real run reports (Unknown otherwise).

**Connection boxes** on the page: Friendly Farmer (his round, and the sketch's weekly update), Rift Rabbit (VR
performance findings that become world build tasks; `relations` in pets.json), Skill Scout (its tricks; suggested in
system-map.json), Piranesi Nessi (Unity builds of Piranesi House; planned, not in the relations yet). The migration plan
also names Pole Puff and OSC Sealion (their worlds' Unity builds and face-tracking rigs); they are not on the page or in
the relations yet.

## `unity-unicorn-L3-module`

**The seat:** Claude Code or Codex when a chat is working on it. The page does not show it live yet: the presence link
is not built.
**Harness skills** on this PC (`L3.skills`; Claude Code's, not the pet's): face-transfer, vrchat-unity-world.
face-transfer is in L1 and L3 by name only: in L1 it is the pet's tool (script and catalog file, PR #6); in L3 it is
Claude Code's skill of the same name, installed on the PC.
Planned: the L3 activity bubble, suggestions, and token use from Token Toucan.

## `unity-unicorn-L4-module`

**Approvals waiting on you:** merging unity-unicorn PR #1 and PR #3, once Codex has brought them up to date.
**Always yours:** the VRChat copyright agreement at upload (the skill book: "Always ask Astra before clicking OK").
**Grants:** none recorded yet (Iron Gates is planned). **Keys:** none; there is no agent key system yet.

## Waiting on Astra

1. Copyright tools: are they **copyright-collector and copyright-auditor** (the sketch) or **copyright-logger and
   copyright-catcher** (the code)?
2. What is **Unity Unicorn Icon** as a program?
3. Should vcc-package-manager and vrchat-avatar-upload move from tools to tricks? Until you say, they stay in L1.
4. Merging PR #1 and PR #3, after Codex has done card 002.
