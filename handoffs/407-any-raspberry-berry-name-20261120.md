# 407: Raspberry Berry's name in its own repo, after raspberry-berry#10

status: open, waits on Astra: merge hub #407; then the pet repo rename below, after findastra/raspberry-berry#10
for: any
implementer: Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20 (hub part)
reviewer: Astra

Astra, 2026-11-20: "the official names should be Raspberry Berry, and Raspberry Pi Maker, everything else is wrong."

## What I did

- Hub #407 (`claude/raspberry-berry-guide-20261120`): the name in `pet-programs.json`, `pets.json`, the rule files,
  desktop-art and the built pages; two new native tools on Raspberry Pi Maker (`pi-display-guide-tool`,
  `pi-pin-map-tool`). Details: [changes/raspberry-berry-pi-display-tools-20261120.md](../changes/raspberry-berry-pi-display-tools-20261120.md).
- Checks: `npm test` 0 fail (493 pass, 6 skipped), `npm run check` OK, click-check of the page and both tools clean
  except the two live links that 404 until merge.

## Not done

1. **findastra/raspberry-berry**: `pet.json` says `"pet": "Raspberry Pi"` and `index.html` says "Raspberry Pi Berry"
   (2 places). Change both to **Raspberry Berry**. Draft raspberry-berry#10 (`ccr-1b17636b-ttwc70`, the Pi stats
   screen) also edits `pet.json`: do this on its own branch after #10 is merged or closed, never on #10's branch.
2. raspberry-berry#10's setup doc says the Pi stays in its case with no mount. Astra's build mounts the Pi on the
   display's brass posts with the case lid taped on (the hub's `pi-display-guide-tool`). Tell its owner.
3. `status/pets-status.json` picks up the name on the Farmer's next round; check it did.
