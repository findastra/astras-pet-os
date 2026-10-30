# Compact desktop pet sizes

By Astra. OpenAI Codex (GPT-6), 2026-10-30. Requested in the presence and sizing session; PR 268.

The display scale compresses natural size differences so small animals remain legible and large ones remain compact. It preserves each drawing's aspect ratio. It does not redraw or stretch body parts.

| Group | Maximum dimension, logical pixels |
| --- | ---: |
| Snail | 26 |
| Insects | 28 |
| Small birds and fish | 30–32 |
| Rodents and ferret | 34 |
| Rabbit, platypus, duck and parrot | 38 |
| Small cat, beaver and penguin | 40 |
| Dog | 44 |
| Panther and lynx | 46 |
| Unicorn | 54 |
| Giraffe | 56 |
| Whale | 64 |

Human characters retain the existing bottom-aligned 202-pixel art calibration and share a 52-pixel display height. Hats, horns, hair and wings do not set individual scales. The Farmer's whole drawing is 52 pixels high; its head/body ratio differs from the other human drawings and remains an artwork task. Paper Patty is a paper creature and stays paired with File Master, both 38 pixels high. Claude Bot is 48 pixels high instead of the old 88.125. Other objects use compact explicit sizes or the 40-pixel fallback.

The whale is largest by maximum dimension and, for current art, overall bounding area. It need not be taller than a giraffe. Every final dimension is capped after all group adjustments: 64 for the whale and 56 for everyone else. Windows display scaling then scales all pets equally.

`scripts/desktop-pets-20261011.cs` owns the rules. Its self-test checks final bounds with extreme aspect ratios, undistorted shapes, equal classes and species ordering, in addition to the existing human crop and paired movement checks. `--size-report` prints actual loaded crop and display dimensions without starting the live pets. The active artwork review keeps its own ownership; this change modifies no image assets.
