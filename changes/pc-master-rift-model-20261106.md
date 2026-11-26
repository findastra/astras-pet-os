# PC Master Race on Rift Rabbit's model (2026-11-06)

Astra sent Wonderland Launchpad's page (Rift Rabbit): "use this as a model Pet Program". Then she answered "All
recommended" on the deck "Rift Rabbit as the model". The answers:

1. Both pets follow it: PC Master Race now, and the engineering pet when it is built.
2. Copy L3's note, the devices and the tools working on the page now. Open buttons come later, as their own step.

All of it is data. The page generator is unchanged.

- **L3's note at the top**: PC Master Race's `editorial` in `pets.json` says what works and what's next. It is signed
  the way Rift Rabbit's is.
- **Devices it looks after**: a new group, `desktop-pc-parts`, on the System Map. It holds seven parts that PC Master's
  look reads from Windows: the processor, the graphics card, two memory sticks, the drive inside the PC (C:), the WD
  Game Drive (D:) and the motherboard. It shows models only, with no serial numbers.
  - PC Master Race links to the group the way Rift Rabbit links to its trackers. The group is its own node, not
    `windows-pc`: a line drawn to a group reaches every member, and many pets run on `windows-pc`.
  - Each part has a check from today's look in `pets.json` `checks` (`device:<id>`), so its second light is real.
    The memory sticks' note says they run at 4800 MT/s, while their part name says 6000.
- **His tools working on the page**: `learn-computer-organization-tool` and `pc-look-tool` no longer have
  `start_closed`. They open inside their pills, full width, like Rift Rabbit's tracker strapper.
- **Not done**: Open buttons on each program's pill, like Rift Rabbit's Launch buttons. They need a launcher on the PC
  (127.0.0.1 only) and an Iron Gates grant.

Checked in the browser pane and in headless Edge from the branch's own copy. `npm run build` changes only PC Master
Race's page and the System Map page. `npm test`: 384 tests, 380 pass, 3 skipped, 1 fails: the Windows farm-setup test,
which fails on `main` the same way.

Claude Opus 5.5 (`claude-opus-5-5`).
