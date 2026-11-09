status: READY_FOR_REVIEW (waits on Astra's merge OK for #312 here and findastra/rgbee#11)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-11-08
needs: findastra/rgbee cards 001 and 002, card 061
---
## Task

Astra, 2026-11-08: every RGB light in the apartment synced to Light Hive; a rainforest with lightning across the
lights; Light Hive's page "really dark" with "different LED border panels". Deck answers: all recommended.

## What I did

- Hub (#312): `apps/rgbee-sync-my-lights-20261108.html`, `apps/rgbee-rainforest-storm-20261108.html`, their System
  Map nodes with `light-hive-helper`, Govee Mirror, Squiggle and Lightstrip, the Corsair K65 PLUS keyboard and links;
  Light Hive's LED look in `apps/pet-programs/pet-program-page-20261018.css`; `changes/light-hive-sync-and-storm-20261108.md`.
- RGBee (findastra/rgbee#11): `helper/light-hive-helper-20261108.cs`, cards 001 and 002.
- Tests: `node --test test/*.mjs` 383 pass, 5 fail (the same 5 as clean `main`). On Astra's PC the storm tool reached
  the Razer lights through the helper.
- Card 061's Light Hive half: the three Govee lights are listed individually, models marked not checked.

## Done when

1. Astra's OK, then rgbee#11 and #312 merge; her PC hub copy fast-forwards.
2. The helper is built from the merged rgbee and run on her PC (until Startup Star starts it: rgbee card 002).
3. Govee checked after Astra turns on LAN Control for each light in the Govee Home app.

## Receipt and review

Pending.
