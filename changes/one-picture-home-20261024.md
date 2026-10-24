# One home for every pet picture (2026-10-24)

Astra, 2026-10-24: "All of these pet icons should have their own hosted spot online somewhere, where anything can
update them. So that I dont have to keep doing them individually, and getting caught versions behind." She answered
the six questions all recommended.

- Every picture has an address that never changes:
  `https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/latest/…` (icons, app icons, draft frames,
  desktop art), plus the already stable `art/frames/…` and `art/moods/…`. `npm run build` keeps `art/latest/` on the
  newest drawing, so a new drawing shows everywhere within 5 minutes, with nothing else edited.
- The one-art-source check also fails when the hub is private or a repo links a dated picture, and its daily result
  shows in GitHub Aquarium's outstanding items.
- The hub's own pages link the new addresses.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-24.
