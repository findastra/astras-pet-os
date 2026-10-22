# Pole Puff

*By Astra.*

Pole Puff manages [Astra's Infinite Pole](https://github.com/findastra/astras-infinite-pole), Astra's VRChat world,
and works with Unity Unicorn on the world's Unity builds (Astra, 2026-10-12). It is a periwinkle puff that floats,
with a candy-striped pole for a tuft. Its pet program is **Infinite Studio** (`pet-programs.json` #38). One of the pets of Astra's PetOS ([astras-pet-os](https://github.com/findastra/astras-pet-os)).
**Draft:** this repo does not exist on GitHub yet; these files wait in `astras-pet-os/drafts/pole-puff/`.

## How to run it

Nothing to run yet. Open `index.html` in a browser to see the placeholder page with the pet and its nine moods.

To redraw the stand-in art: `node scripts/draw-pole-puff-20261011.mjs` (Node 20+, no dependencies).

## Limits

- No behaviour yet: nothing that manages the world is built.
- Art is a hand-drawn stand-in, not yet the generated house art, and is a draft until Astra approves it. Mood symbols are not composited.
- A seed in `pets.json`, not in the pipeline yet. Astra approved the `pole-puff` repo on 2026-10-12; it is not created yet. See
  [card 024](https://github.com/findastra/astras-pet-os/blob/main/handoffs/024-any-pole-puff-repo-20261012.md).

## License

MIT. See [LICENSE](LICENSE).
