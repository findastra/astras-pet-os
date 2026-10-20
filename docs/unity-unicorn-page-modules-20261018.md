# Unity Unicorn's page, tool panel by tool panel (2026-10-18)

*The example for [PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md), section 3: what goes in each of Unity
Unicorn's four intelligence-level panels, so no tool is missed. Read from
[findastra/unity-unicorn](https://github.com/findastra/unity-unicorn) on 2026-10-18, after its PR #9 was merged:
`main` at `69453f7`, every branch and Codex's open drafts #1 and #3 (every other branch is already in `main`). The page
has these panels since [PR #8](https://github.com/findastra/unity-unicorn/pull/8) and
[PR #9](https://github.com/findastra/unity-unicorn/pull/9), and its `pet.json` holds the same lists as
`intelligence_levels`; this doc follows that block. Claude Opus 5.5 (`claude-opus-5-5`).*

*Panels, not modules (Astra, 2026-10-19): this doc called them modules, and so did Unity Unicorn's own page
(`unity-unicorn-L1-module`) until [unity-unicorn PR #11](https://github.com/findastra/unity-unicorn/pull/11) renamed
them `unity-unicorn-L1-panel` to `-L4-panel` (page 0.4.2; not merged until Astra's OK). The file keeps its name,
because links point at it. Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19.*

*Tool panels (Astra, 2026-10-19: "I do want all of it to say tool panel instead of just panel"): the hub's pages say
`unity-unicorn-L1-tool-panel` to `-L4-tool-panel`; Unity Unicorn's own page keeps `-L1-panel` until its own pull
request renames them (card 047, task 7).*

*Tools and tricks (Astra, 2026-10-19): [PR #114](https://github.com/findastra/astras-pet-os/pull/114) made vcc-package-manager and vrchat-avatar-upload native tricks of
Unity Stable, because they have no code, only written steps. That answers question 3 below. This doc now has 34 tools
on `main` (with matcap-palette and menu-map, unity-unicorn [PR #13](https://github.com/findastra/unity-unicorn/pull/13) and [PR #14](https://github.com/findastra/unity-unicorn/pull/14)) and 4 tricks to write. [unity-unicorn PR #15](https://github.com/findastra/unity-unicorn/pull/15) made the
same move in `pet.json` and on the page (version 0.4.5, merged as `7b1fdce`). Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19.*

*Asset tools (Astra, 2026-10-18: "lets make this booth together and then publish those tools"): [unity-unicorn PR #17](https://github.com/findastra/unity-unicorn/pull/17)
(version 0.4.6, merged as `2e631e4`) brought in unity-asset-creator, unity-assets-library and shaders-shop, and the
unity-asset-creator trick. This doc now has 37 tools on `main`; their tool boxes on the hub came with
[PR #119](https://github.com/findastra/astras-pet-os/pull/119) (card 049). Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19.*

Home: **Unity Stable** (`pet-programs.json`; Astra kept the name on 2026-10-18).

## `unity-unicorn-L1-tool-panel`

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

**Your tools on `main` (37)** (`L1.tools`): each tool's kind is the one its catalog file gives. 36 have a catalog file
in `tools/`; run-unity-tool is the 37th. The other two catalog files in `tools/` belong to the tricks to write (L2).

| Kind | Tools |
|---|---|
| Audit (11) | button-check, cloud-collider-audit, cloud-collider-validation, cloud-physics-check, cloud-survey, masonry-structural-audit, menu-map, no-windows-audit-tool, prop-decomposer, scene-yaml-inspection, world-validator |
| Generator (9) | cloud-mesh-generator, cloud-sea-fusion, marble-carver, masonry-regeneration, neck-blender, realistic-prop-restyle, vine-bloomer, wall-texture-rebuild, world-spawn-tool |
| Editor (5) | cloud-lounge-smoothing (its file is `cloud-puff-smoothing-20261011.json`), house-scene-builder, masonry-unity-refresh, matcap-palette, no-windows-scene-refresh |
| Build (3) | desktop-world-test, occlusion-bake, reflection-probe-bake |
| Preview (3) | asset-contact-sheet, scene-preview-render, time-season-tide-preview |
| Utility (2) | foreground-tool-recorder, run-unity-tool (the runner script, `scripts/run-unity-tool-20261011.py`; it has no catalog file) |
| Workflow (3) | face-transfer, shaders-shop, unity-asset-creator |
| Library (1) | unity-assets-library (its catalog file points at the public repo findastra/unity-assets-library; no code in unity-unicorn) |

The four that came in on 2026-10-18:
- **face-transfer** was merged in [PR #6](https://github.com/findastra/unity-unicorn/pull/6)
  (`scripts/face-transfer-20261011.py`, its guide and tests).
- **prop-decomposer** and **realistic-prop-restyle** were merged in
  [PR #7](https://github.com/findastra/unity-unicorn/pull/7), with the trick that uses them (L2).
- **world-spawn-tool** moved in from findastra/liminal-doors in PR #9 (`scripts/world-spawn-tool/`, its guide and 9
  offline tests); liminal-doors#1, where it started, is closed without merging. Its `--apply` step still copies a
  reference world. Astra's rule since 2026-10-18 is that new worlds start fresh from VCC's World template, so that step
  must change before the next world.

Two came in on 2026-10-19: **matcap-palette** ([PR #13](https://github.com/findastra/unity-unicorn/pull/13): a page panel of matcaps on spheres and a Unity window that puts
one on a material's matcap slot) and **menu-map** ([PR #14](https://github.com/findastra/unity-unicorn/pull/14): a Unity export of an avatar's built radial menu and the
page panel that draws it with its parameter budget).

Three more came in on 2026-10-19 with [PR #17](https://github.com/findastra/unity-unicorn/pull/17), built and first used in Liminal Doors and moved over unchanged:
- **unity-asset-creator** (`scripts/unity-asset-creator/`): walks one world asset through a researched 12-step
  checklist, then exports each version and opens a pull request to the library.
- **unity-assets-library**: the public library of finished assets and their versions,
  [findastra/unity-assets-library](https://github.com/findastra/unity-assets-library). Astra asked for it right below
  unity-asset-creator.
- **shaders-shop** (`scripts/shaders-shop/`): downloads shaders for worlds and tracks which shaders each world uses.

**vcc-package-manager** and **vrchat-avatar-upload** are not tools any more: since [PR #114](https://github.com/findastra/astras-pet-os/pull/114) they are tricks to write
(L2). Their catalog files stay in `tools/`, with kind `Trick to write` instead of Workflow ([unity-unicorn PR #15](https://github.com/findastra/unity-unicorn/pull/15)): the System Map
and TOOLS-AND-TRICKS.md cite them, and the tool library can still record a real run.

**Your tools not merged (21)** (`L1.tools_not_merged`; each marked "not merged" on the page):

| Where | Tools |
|---|---|
| [PR #1](https://github.com/findastra/unity-unicorn/pull/1) (draft, Codex), with a catalog file (8) | bending-adder, chain-dangle-weights, fan-fitter, golden-painter, gunsmith-loadout, rgb-painter, sparkle-strapper, star-effects-diagnostic |
| PR #1, Unity menu only, **no catalog file** (10) | copyright-logger, copyright-catcher, hair-weighter, spring-joint-strapper, learn-add-ons ("Learn add-ons from selected avatar"), blood-bender-strapper, water-bender-strapper, sparkle-bender-strapper, wing-strapper, neck-bow-strapper |
| [PR #3](https://github.com/findastra/unity-unicorn/pull/3) (draft, Codex) (2) | glass-animal-tool, bubble-chair-blower |
| design only (1) | asset-ledger (decided 2026-10-14; the design, `docs/asset-ledger-20261014.md`, was merged in PR #2; no code yet) |

That is 37 tools on `main` and 21 not merged. Both drafts conflict with `main`. Unity Unicorn's card
[002](https://github.com/findastra/unity-unicorn/blob/main/handoffs/002-codex-merge-avatar-effects-and-glass-tools-20261018.md)
asks Codex to bring them up to date, write the 10 missing catalog files and move each tool from `tools_not_merged` to
`tools` when it is merged. PR #3 stays a draft until bubble-chair-blower molds around the seated avatar. Poppy's project
already has PR #1's Unity menu installed.

The sketch shows two of these as **copyright-collector** and **copyright-auditor**; the code in PR #1 names them
**copyright-logger** and **copyright-catcher**.

No tool of another pet is listed here: the Friendly Farmer's, Skill Scout's and Door Dormouse's stay in their own pet
programs.

## `unity-unicorn-L2-tool-panel`

**Your tricks** (`L2.tricks`): **make-a-prop-look-real**
([skills/make-a-prop-look-real/SKILL.md](https://github.com/findastra/unity-unicorn/blob/main/skills/make-a-prop-look-real/SKILL.md),
merged in PR #7). It uses the L1 tools prop-decomposer and realistic-prop-restyle, and every download it makes is a row
in `docs/download-ledger-20261018.json`.

**unity-asset-creator-trick**
([skills/unity-asset-creator/SKILL.md](https://github.com/findastra/unity-unicorn/blob/main/skills/unity-asset-creator/SKILL.md),
merged in PR #17): how the seated agent walks the checklist's 12 steps through the world's agent queue, which steps need
Astra's own words, and how it publishes. It uses the L1 tools unity-asset-creator, shaders-shop and unity-assets-library.
It is listed with `-trick` because no item may be both a tool and a trick (unity-unicorn PR #15's test).

**Tricks to write (4)** (`L2.tricks_to_write`): from the sketch, weekly-update-from-friendly-farmer and
weekly-copyright-auditor; since [PR #114](https://github.com/findastra/astras-pet-os/pull/114), **vcc-package-manager** (the skill book's section 4, VCC packages) and
**vrchat-avatar-upload** (section 2, uploading through the SDK), which were catalogued as Workflow tools. The skill book
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

## `unity-unicorn-L3-tool-panel`

**The seat:** Claude Code or Codex when a chat is working on it. The page does not show it live yet: the presence link
is not built.
**Harness skills** on this PC (`L3.skills`; Claude Code's, not the pet's): face-transfer, vrchat-unity-world.
face-transfer is in L1 and L3 by name only: in L1 it is the pet's tool (script and catalog file, PR #6); in L3 it is
Claude Code's skill of the same name, installed on the PC.
Planned: the L3 activity bubble, suggestions, and token use from Token Toucan.

## `unity-unicorn-L4-tool-panel`

**Approvals waiting on you:** merging unity-unicorn PR #1 and PR #3, once Codex has brought them up to date.
**Always yours:** the VRChat copyright agreement at upload (the skill book: "Always ask Astra before clicking OK").
**Grants:** none recorded yet (Iron Gates is planned). **Keys:** none; there is no agent key system yet.

## Waiting on Astra

1. Copyright tools: are they **copyright-collector and copyright-auditor** (the sketch) or **copyright-logger and
   copyright-catcher** (the code)?
2. What is **Unity Unicorn Icon** as a program?
3. *Answered 2026-10-19:* vcc-package-manager and vrchat-avatar-upload are native tricks, not tools ([PR #114](https://github.com/findastra/astras-pet-os/pull/114)).
   They are tricks to write in L2; [unity-unicorn PR #15](https://github.com/findastra/unity-unicorn/pull/15) (merged as `7b1fdce`) moved them in `pet.json` and on the page.
4. Merging PR #1 and PR #3, after Codex has done card 002.
