# USBDeview's folder on the System Map (2026-11-20)

File Master's cleanup plan, row 101 (Astra's yes; done 2026-11-09), moved NirSoft's USBDeview 3.10 out of Documents
and into `Downloads\installers\USBDeview-3.10`. The Stream Deck knob fixes of 2026-11-19 (benchmark-rock#14,
pc-master-race#2, rift-rabbit#16) already point the programs there; the map's description was the last stale mention.

- `system-map.json`, node `usbdeview`, its `job`: "downloaded 2026-10-26 to the USBDeview-3.10 folder in Documents" is
  now "downloaded 2026-10-26; since File Master's cleanup (2026-11-09) it is in Downloads\installers\USBDeview-3.10".
  Rift Rabbit's dongle map and the SHA-256 match are unchanged.
- `system-map-20261012.html` rebuilt with `npm run build`, so the map shows the new folder when USBDeview is clicked.
- Nothing else changes: no program, grant, link or other node.

Pull request #399. By Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
