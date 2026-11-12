# Luna's Log's tools, tricks and Skill catalog on the System Map

2026-11-11. Astra, of Luna's Log's page: "This pet program has the right content but the wrong format. So please
check the latest template from the farmer ... some good examples would be the Unity Den or the Rift Rabbits Wonderland
Launchpad."

Luna's Log's spawned page already had the Farmer's frame but showed no tools, no programs and no tricks of its own,
because none were on the System Map. `system-map.json` now has, each `"of": "program-40"`:

- four native tools from `skill-scout-20261017.mjs`: skill-census, skill-lint, skill-diff, public-snapshot;
- three native tricks from its `skills/`: skill-census, skill-fix, write-a-skill;
- the Skill catalog native program (`skill-catalog-20261111.html` in findastra/lunas-log), opened from its pill;
- skill-census's 3rd party programs: Node.js, Git for Windows and the GitHub CLI, also in its pets.json `needs`.

The lunas-log → unity-unicorn link no longer says Skill Scout's job is undecided. Generated files rebuilt with
`npm run build`. Luna's Log copies this page into its own repo as `index.html` (findastra/lunas-log pull request of
the same day), the way Unity Stable's page is the hub frame.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-11.

## Later the same day: her colours and a button audit

Astra: "give this like a pink but dark pink background that matches her. And let's do an audit for all the buttons to
make sure they work or don't work. If they want to open or close the apps."

- `:root[data-pet="skill-scout"]` in the page stylesheet: a dark pink page, panel lines in her hair lavender (#cda1e5)
  and her bow pink (#f57666) for links and marks, both sampled from her picture.
- click-check on Luna's Log's page: 172 clicks work. Her 3rd party programs are command-line tools with no window:
  Node.js (green while scripts run) asked "Close Node.js?" for nothing, so a program the watch cannot open now says why
  and offers no close either (`pet-program-page-20261018.js`, every page). Git for Windows and the GitHub CLI are not
  in Inference Iguana's watch, so their lights stay red and a click says the watch does not follow them.
