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
