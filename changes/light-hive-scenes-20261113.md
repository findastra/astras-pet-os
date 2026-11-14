# Light Hive gets the old RGBee app's features, with fewer words (2026-11-13)

Astra: "whatever features that the new one doesn't have from the old one, just add them in there and try to reduce
the writing on the page."

- sync-my-lights-tool now has what the old RGBee app (`rgbee-20261009.html` in findastra/rgbee) had: scenes of your
  own (save, update by name, delete with undo), effects (Still, Breathe, Colour cycle, with speed), a colour per
  light, a desk preview with every light in its colour (faint = not reached yet), adding your own lights, and backup
  export/import (old RGBee backups load too). Lights off button.
- Breathe and Colour cycle reach the real lights: four smooth steps a second while the page is open, never a flash,
  and still under reduced motion.
- Fewer words: the tool's status lines and More details are shorter; Light Hive's summary (pet-programs.json,
  pets.json) and both tools' System Map text are one short line each.
- Pages rebuilt with `npm run build`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-13.
