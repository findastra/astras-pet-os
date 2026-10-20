status: open (task 4 only: name the three tools and the trick in the page doc and Unity Unicorn's levels row)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-19
needs: findastra/unity-unicorn PR #17 (its README section "Asset creator, assets library and shaders shop", `skills/unity-asset-creator/SKILL.md`), docs/unity-unicorn-page-modules-20261018.md, system-map.json (the `unity-stable` tool and trick nodes)
---
## What I did

Astra, 2026-10-18: she wanted a trick called unity-asset-creator that follows the researched instructions for building
a good asset, as an ordered checklist, ending by exporting each asset and its version to a database on GitHub. That
database is unity-assets-library, on Unity Unicorn's pet program page below unity-asset-creator. She also asked for a
shaders-shop module in Unity Stable that downloads shaders for worlds and tracks which shaders each world uses. "lets
make this booth together and then publish those tools." The tools were built and used in Liminal Doors, and the booth
and sky v1.0.0 are in the library (findastra/unity-assets-library#1, merged 2026-10-19). This card publishes the tools.
Done by a side session of the Liminal Doors chat, Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19.

**findastra/unity-unicorn**: branch `claude/asset-creator-library-shaders-shop-20261019`, commit `23a62bf`,
[PR #17](https://github.com/findastra/unity-unicorn/pull/17), open, not merged. It is **stacked on PR #14**
(`claude/menu-map-20261019`), which is stacked on #13 (`claude/matcap-palette-20261019`): all three touch the same
lines of `pet.json`, the page and the tool-count test.
- `scripts/unity-asset-creator/` and `scripts/shaders-shop/`: the code, copied unchanged from findastra/liminal-doors
  branch `claude/fresh-start-20261018` (files last changed in `db27ce1`; the branch tip was `eb2ca2b`). Each folder is
  laid out like a world project (`Assets/` and `Tools/`, with the Unity `.meta` files). That covers the 12-step
  checklist, window, agent menus and exporter; the checklist doc v1.1.0 with its Craft section;
  `publish-asset-20261018.py`; the shaders-shop catalog, installer, world scan, window, agent menus and seven Unity
  Stable shaders; and the catalog refresher, offline scan and three world records.
- `tools/unity-asset-creator-20261019.json`, `tools/unity-assets-library-20261019.json`, `tools/shaders-shop-20261019.json`
  (`unity-unicorn.tool-catalog/v1`). unity-asset-creator's `last_used` cites the booth and sky export.
- `skills/unity-asset-creator/SKILL.md`: the trick (`unity-stable-v1.0-unity-asset-creator-trick-v1.0`). It covers
  how an agent walks the 12 steps through the agent queue, the steps that need Astra's own words (3, 7, 11), and what
  to ask first (downloads, shader installs). It also covers publishing, which Astra merges.
- Three guides in `docs/`, the page's built-in list (38), the L1 panel with unity-assets-library right below
  unity-asset-creator, the L2 tricks, `pet.json` `intelligence_levels`, version 0.4.5-20261019, README and AGENTS.md.
- `test/asset-tools-test-20261019.mjs`. It checks that every catalog source exists and that every Unity file has its
  `.meta`. It checks that the trick's step table matches `AssetChecklist.cs` in order (a swap makes it fail), that each
  item is in one panel, and that there are no machine paths or keys.
- Tests: `node --test test/*.mjs` gave 39 tests, 38 pass, 1 skipped, 0 fail. The four Python tests pass. The page
  renders in headless Edge with the three tools at the end of "Your tools on main".

**findastra/astras-pet-os**: branch `claude/unity-stable-asset-tools-20261019`,
[PR #119](https://github.com/findastra/astras-pet-os/pull/119), open, not on `main`.
- `system-map.json`: tool nodes `unity-asset-creator`, `unity-assets-library` and `shaders-shop` (state `now`,
  labels `unity-stable-v1.0-<tool>-v1.0`) after `asset-ledger`, so their boxes sit below the existing ones on Unity
  Unicorn's page. The trick node `unity-asset-creator-trick` (name `unity-asset-creator`) sits after
  make-a-prop-look-real. The file keeps its CRLF line endings.
- `npm run build` rebuilt `apps/pet-programs/unity-unicorn-20261018.html`, `system-map-20261012.html` and
  `TOOLS-AND-TRICKS.md` (168 rows).
- AGENTS.md, this card and its rows in `handoffs/README.md` (next free number 050).
- Tested in an LF clone in Claude's scratchpad. Nothing on Astra's PC was changed: the Liminal Doors folder was not
  read or touched (I read the same branch from GitHub).

**Not done:**
- Liminal Doors keeps its incubating copy of both tools. From now on a change should land in unity-unicorn first.
- unity-unicorn PRs #15 (also numbered 0.4.5) and #16, from other chats, are based on `main` and touch the same files
  (`pet.json`, the page, README, AGENTS.md). Whichever merges after the others needs `main` brought in and a new version
  number.
- The hub has no tool boxes yet for matcap-palette and menu-map (unity-unicorn #13 and #14).
- `docs/unity-unicorn-page-modules-20261018.md` and Unity Unicorn's row in `INTELLIGENCE-LEVELS.md` don't name the three
  tools or the trick yet. Hub PR #117 (another chat) rewrites both, so I left them alone to keep the two PRs apart. Add
  them there after #117 is merged.
- The library still has no licence (Astra's choice).

**Merged 2026-10-19 with Astra's OK in chat** ("Merge unity-unicorn#13, unity-unicorn#14, unity-unicorn#17 and
astras-pet-os#119, in that order"):
- unity-unicorn #14 (`27b275d`, into #13's branch) and #13 (`b80a469`) were already merged by another chat, and so was
  #15 (`7b1fdce`, also 0.4.5, with a test that no item is both a tool and a trick).
- I merged `main` into #17's branch (`0c7890e`): both sides kept, #17 became **0.4.6**, and its trick is listed as
  `unity-asset-creator-trick` (the hub's id), skill still at `skills/unity-asset-creator/SKILL.md`. Tests: 43, 42 pass,
  1 skipped. I retargeted #17 to `main` and merged it once CodeQL passed: **`2e631e4`**.
- Hub #119: `main` merged into its branch (`ad9d051`; card 050 kept beside 049, generated files rebuilt; 179 tests,
  178 pass, 1 skipped). Its merge commit is on GitHub's PR page; this card was written just before it.

## Task

1. ~~Astra: say which pull requests to merge~~ Done 2026-10-19 (above).
2. ~~Retarget and merge the stacked PRs~~ Done (#17 retargeted to `main`, merged as `2e631e4`).
3. ~~Merge hub #119 after #17.~~ Done after its checks passed. Its tool boxes say "works today", which is true once the code is on
   unity-unicorn's `main`.
4. **Still open.** Hub #117 is merged (`9d1cef7`), so add the three tools and the trick to
   `docs/unity-unicorn-page-modules-20261018.md` and Unity Unicorn's row in `INTELLIGENCE-LEVELS.md`, in a pull request.

## Done when

unity-unicorn #17 and hub #119 are merged. Unity Unicorn's pet program page then shows unity-asset-creator,
unity-assets-library and shaders-shop below its other tool boxes, and the unity-asset-creator trick in L2.

## Return

Write both merge commits here, set `status: done`, commit.
