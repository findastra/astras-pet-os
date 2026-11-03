# The Model Pet Program

2026-11-02, Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/model-pet-program-20261102` (the "Friendly Farmer" chat), on
top of `claude/pet-stages-chart-20261102` (#276).

Astra, 2026-11-02: "a template pet program, like to actually see the website ... instead of it saying like actual
tools ... it'll just say tool one, tool two, tool three. And what this does is it actually will cover a whole bunch of
different types of like structures or like styles ... every rule really strictly kind of like chiseled out ... And then
also it appears across all of the platforms correctly ... come up with something for that [a name] as well."

- **The Model Pet Program** (`apps/pet-programs/model-pet-program-20261102.html`, `the-farm-v1.0-model-pet-program-v1.0`): a made-up pet, Pet Name, whose program is Pet Program Name. The pet program spawner draws it with the same
  `buildPetProgramPage` as every real page (`modelProgramData` in `scripts/pet-program-pages-20261018.mjs`), so it shows
  today's rules and nothing hand-made.
- What it shows once each: every tool panel; 3rd party, native and shared programs; seven tools (checked and works,
  an issue reported, an update waiting, not built, a daily cadence, a tool in its own panel at the top, a tool inside its
  own rounded box in L1); headsets and a device group with serial numbers; tricks with a cadence and a planned one;
  an L3 question; L4's approvals; R W X rows with In code, Rule only and Not built; a bound three clicks; an editorial
  note; friends with and without a page; nine placeholder drawings (`art/model-pet-program/`, SVG, nobody's art).
- The example tool both embedded tools run: `apps/pet-programs/model-pet-program-tool-20261102.html` and its script.
- It is not an animal: in no registry, so the desktop, the Markdown pets and the pet packs leave it out. The spawner's
  list links it first.
- `test/model-pet-program-test-20261102.mjs`: the Model Pet Program has every field and item field a real page has, every tool panel, every
  light and kind of item, placeholder names only, and the files on disk are what the spawner writes.
- PET-PROGRAM-FRAMEWORK.md section 3 and the checklist: change the Model Pet Program first when pages change, and check it on every
  screen with Platform Platypus's fit-check. README.md links it.
- Checked: Platform Platypus's fit-check (findastra/platform-platypus `tools/fit-check`), 19 of 19 screens fit (phones
  and iPads both ways up, laptop, desktop, a window dragged small, stretched wide and tall); the browser pane at phone,
  tablet and desktop size, with nothing wider than the screen.

## The redo (Astra, 2026-11-02: "look at the other pet programs we already built ... do a deep analysis ... try to redo this page")

Read against about 200 dated instructions of Astra's in the spawner, its stylesheet and script, the framework, the
memory of earlier chats, and the pages she shaped most (Wonderland Launchpad, Bass & Biscuits, GitHub Aquarium):

- **A tool that works on the page is in its own tool box in L1**, never a panel above the levels (2026-11-02, the APC64
  board: "that shouldn't be its own panel"; "on the page first, no breakouts"). tool-six is open, tool-seven starts
  closed, each with Open it full screen, as Bass & Biscuits has them; the example tool tells its box how tall it is, so
  there is no scroll bar or empty space.
- **Tools and tricks are named like every real one**: tool-one ... tool-seven, trick-one, trick-two.
- **Every drawing has its mood sticker**, from the one sticker set (art-kit STICKERS, indicators INDICATORS;
  2026-10-24: the nine mood symbols "stay the same across all pets"). The friends have drawings of their own.
- **The lights' words**: L1's closing words on every page said a grey light is "not checked yet"; since 2026-10-24 grey
  is "not created" and an unchecked item says report issues until someone checks it. Fixed on every page.
- **PET-PROGRAM-FRAMEWORK.md** lines that later decisions replaced: the maintenance light's four colours (2026-10-24,
  2026-10-26), the cyberhome and System Map squares as tools with no words (2026-10-23), the footer without languages
  (2026-10-24), the chat panel's square box (2026-10-20, 2026-10-23), the friends list's name, L2 with tricks only and
  L3 as L3-to-you only (2026-10-24), L4's rounded tool boxes, and the checklist (no connection boxes, no languages).
- Platform Platypus's fit-check after the redo: 19 of 19 screens fit.

## Astra's answers to the deck (2026-11-02, https://claude.ai/artifact/UabwS56hrUmZwYj52M2NNf)

"All recommended", then two changes in her own words:
1. **The name: the Model Pet Program**, not Show Pet ("a model pet program is better, not show pet. Remember, it's
   supposed to be the place that it lives"); Pet Name and Pet Program Name stay its placeholders. Files, label
   (`the-farm-v1.0-model-pet-program-v1.0`), drawings (`art/model-pet-program/`), test and card renamed. Its title
   shows the format: `v0.0.0 // YYYYMMDD` ("I also want to see YYYYMMDD ... and then V0.0.0").
2. **No special panels**: a pet's special panels become tool boxes in L1, in a pull request of its own.
3. **Toolsets from data**: a tool whose tools name it with `in` is a toolset, one rounded box holding them
   (`toolList` in the spawner); the model shows toolset-one with tool-eight and tool-nine.
4. **The colours every page gets: sky blue with darker boxes** ("I don't like the raspberry color page either. Let's
   make it like sky blue or something. With darker boxes"), not raspberry: a sky page, deep navy boxes, navy title ink.
   New `--box`, `--surface`, `--page-ink` and `--accent` colours in the stylesheet; the Farm, Wonderland
   Launchpad and Bass & Biscuits set them so they look exactly as before.

Fit-check: 19 of 19 screens for the model and for API Fairy's page in the new colours.

## Corrections, 2026-11-03

- **Colours: a classic blueprint, the same layout as always.** Astra: "Something's really wrong about the colors ...
  It's dark blue blocks ... I wanted you to just use the exact same formatting as we've been", then "we need to use the
  dark color ... do it like a blueprint color, blue and white and yellow. Like, make it very classical." The filled
  navy boxes are gone (`--box` is transparent again); every page without its own colours is Prussian blue with a faint
  drafting grid (`--grid`), white lines and lettering, yellow links, marks, serial numbers and L3's note. The Farm,
  Wonderland Launchpad and Bass & Biscuits set every new colour themselves and look exactly as before (their accent had
  been broken by a self-reference in the first version; fixed).
- **One tool that works on the page, not two**: Astra, "you have tool 6 and tool 7, but they're the exact same thing."
  tool-six stays (open, Open it full screen); its example is a plain tool (one line, three results, Run) instead of the
  pad grid. The toolset holds tool-seven and tool-eight.
- **Click a tool anywhere to open it**: main's #277 is merged into this branch, so the model has it too.
- Fit-check: 19 of 19 screens.
