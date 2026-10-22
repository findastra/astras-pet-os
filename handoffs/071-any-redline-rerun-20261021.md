status: waiting on Astra's OK to merge the pull request (and two questions: redlines 13 and 28)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21
needs: handoffs/066-any-page-notes-and-tray-20261021.md, scripts/pet-program-pages-20261018.mjs, apps/pet-programs/pet-program-page-20261018.css and .js, system-map.json, pets.json, pet-programs.json
---
## What I did

Astra, 2026-10-21, after card 066 merged: "these need to be stacking in rows of 3, then 2,1 on collapse. Some redlines
were not captured. All of the colored lines on the edited page I uploaded need to be noted, they are all called
"redlines" in my engineering world, I use different colors to denote certain objects on the page for clarity. Do a
rerun. Look where I crossed out VRCFT, you still have it." Then a second screenshot: a long tool name wrapped and cut
a gap in its pill's border line.

I re-read every coloured mark on her Unity Stable screenshot at full zoom (crops of the 2000px image, not the
browser's view) and listed each one below. Branch `claude/redline-rerun-20261021` of astras-pet-os, made in a
worktree in Claude's scratchpad; the live hub folder stayed on `main`.

## The redline register

Status: **done** = in card 066 and still right; **missed** = card 066 missed or misread it, fixed on this branch;
**ask** = what it means is not certain.

| # | Colour | Where | What it says or shows | What the page does now | Status |
|---|---|---|---|---|---|
| 1 | green | cyberhome speech bubble | "get rid of this entirely; select from 9 emotions at bottom" | no bubble; the mood lights up in `<pet>-emotions` | done |
| 2 | green | arrow to the emotions | "what to 'light up'" | same as 1 | done |
| 3 | red | left of the cyberhome | "unity-unicorn-cyberhome panel should always be a square; astras-pet-os panel too, they can push together or stack, but when this happens the title goes below them both" | both squares; side by side, title below, then stacked | done |
| 4 | red | `v?` after the title | "remember to assign version #s" | each pet's version from pets.json (0.1.0 where its pet.json has none; Unity Stable v0.5.1) | done |
| 5 | cyan | brackets round the title and version | "these always stay together on one line until too collapsed, version line then goes below" | one line, version below when too narrow | done |
| 6 | red | `unity-stable-pet-program-quick-summary` | "pet-program" struck | `unity-stable-quick-summary` | done |
| 7 | red | the summary | "with" and "26 dated tools, open arch audits, concise summaries and evidenced execution history" struck; "for organizing Unity worlds and" added before "avatar plans"; "It contains tools to develop each, a working closet by Devilish, and pages that display world information." added | "A local Unity and VRChat desk for organizing Unity worlds and avatar plans. It contains ..." (card 066 had dropped "plans") | missed |
| 8 | red | "Open today's app" button | an X over the whole button | no buttons under the title; the app is linked in L4's pet passport ("App") and the footer | missed (066 only took "today's" out) |
| 9 | red | "Repo" button | an X | no Repo button; the repo is in the passport and footer | done |
| 10 | red | `unity-unicorn-system-map` | "unity-unicorn" struck, "astras-pet-os" written | `astras-pet-os-system-map` | done |
| 11 | red | "its node: unity-stable" | struck | not printed (the link still opens that node) | done |
| 12 | red | right of the map box | "always a square" | square | done |
| 13 | red | under the intelligence-levels border, right of centre | a short line with no words | nothing changed | ask |
| 14 | red | "not set yet (click it)" in the legend | underlined: "If this is the case, then the on/off button should never show as gray because those are either on or off" | ON/OFF is only ever green or red; "not checked yet" is the maintenance light's grey | done |
| 15 | cyan | legend "on ... working correctly" to the L1 label | a bracket from the two lights after the label, arrow to two drawn before it | the pair sits before the label (066); now **nothing after it**: the activity light is gone, and the tool panel's glow still shows L4 "you are here" | missed |
| 16 | green | circles round each section heading | "3rd party programs · #", "Your programs · #", "Avatar tools · 22", "World tools · 37" | every heading has its count | done |
| 17 | green | right side list | "3rd Party Programs = L1, Native Programs = L1, Native Tools = L1, Native Tricks = L2" | Native programs, Native tools (Avatar/World tools), Native tricks in L2 | done |
| 18 | green, pink, cyan | under that list | "Tools = runs once", "Tricks = scheduled tool runs"; Tools underlined pink, Tricks cyan | the trick definition (card 066, answer 2) | done |
| 19 | red | "VRCFT (VRCFaceTracking)" | "VRCFT" and the brackets struck; "controls your avatar's face tracking" | **VRCFaceTracking**, "Controls your avatar's face tracking." | missed |
| 20 | red | VRChat | "A social virtual reality platform" | her words exactly (066 had added "where your worlds and avatars live") | missed |
| 21 | red | "Unity 2022.3.22f1 and Unity Hub" | "2022.3.22f1 and" struck, "Hub" written above, "2022.3.22f1" written after "Unity Hub"; "organizes your Unity projects." | **Unity Hub 2022.3.22f1**, "Organizes your Unity projects." | missed |
| 22 | red | VRChat Creator Companion | "Companion" arrowed up to the end of the first line; "???" | one line (pills are wider now); its does line from 066 | done, now one line |
| 23 | red | Blender | "???", "idea, not agreed yet" struck, its ON/OFF light circled | its does line from 066; the link is **now** (in use), so no tag and its lights are on; in Unity Unicorn's needs as optional | missed |
| 24 | red | arrow to Blender's light | "make sure this 'on' link is working correctly for all tools and panels" | every pill and every level tool panel has the same clickable pair; checked in the browser | done |
| 25 | red | arrows to the "???" | "Summarize what each program does in here. Audit all program descriptions to ensure they are correct." | a `does` line on every program (066), Astra's own words where she wrote them (19 to 21) | done |
| 26 | red | box at the bottom | "panel / oo tool / tool description" | lights and name in the border, the description inside | done |
| 27 | cyan | "oo" before face-transfer, neck-blender, matcap-palette, "etc." | the lights go in the border line, left of the name, on every tool | done | done |
| 28 | green | ellipse round cloud-physics-check | "does this one have an underline because it's a direct link? If so, make all the others like that." | the underline was the pointer resting on it; no name is a direct link (answered in 066's slides) | ask |
| 29 | cyan | three tray icons circled | "these are not supposed to be in the tray. only the Startup Star should ever be in the tray. please fix the recent change that directed this." | the three crash-watch pets and Voicemeeter Bug have no tray icon; menus in Startup Star | done |
| 30 | (her words) | the whole L1 panel | "these need to be stacking in rows of 3, then 2,1 on collapse" | sections stack; pills three to a row, then two, then one | missed |
| 31 | (2nd screenshot) | cloud-collider-validation, cloud-lounge-smoothing | red boxes: the wrapped name cut a gap in the border line | a name stays on one line in the border; too long for the pill, it ends in "…" | missed |

Unity Hub 2022.3.22f1 is Astra's wording (21). In software terms 2022.3.22f1 is the Unity editor version VRChat
needs, which Unity Hub installs; Unity Hub has its own version number.

## Checks

- `npm run build`, `npm test` (299 pass, 0 fail) and `npm run check` in the LF worktree.
- Unity Stable from the branch, served on 127.0.0.1, in the browser pane at 1500px (three across), 800px (two) and the
  375px phone size (one); World tools names on one line.

## Next

- Astra's OK to merge the pull request.
- Two questions: 13 (the short red line under the levels border: a stray mark, or something to move?) and 28 (should
  every name be a direct link to the tool's own page instead of opening the pill?).
