# White Hat Weasel's Ghost In The Walls watch (2026-11-26)

Astra, 2026-11-20: "I want you to track attempted password logins to it somehow." 2026-11-26: "Start the tracker".

The home TP-Link router keeps no record of wrong guest passwords, so the tool records who got onto the guest
network instead.

- **`scripts/ghost-walls-guest-reader-20261126.py`:** signs in to the router read-only with the third-party
  tplinkrouterc6u library, lists the guest devices (MAC, address, name, band), signs out. The login comes from the
  Windows user variable `WHITE_HAT_LAB_ROUTER_PASSWORD` and is never printed or written. Answers in one JSON line.
- **`scripts/ghost-walls-watch-20261126.mjs`:** keeps the record: per device, first and last seen and how many separate
  visits; a log line for each join and leave; a failed look (for example while Astra is signed in at tplinkwifi.net, the
  router allows one admin at a time) keeps the record as it was. Writes only in `Astra's PetOS Data\white-hat-lab`.
- **White Hat Lab's server** runs it every third look (30 minutes), only once the login is set.
- **API Fairy key request** `20261126-white-hat-lab-white-hat-lab-router-password` (on her PC only).
- Tests: `test/ghost-walls-test-20261126.mjs`.

Not done: the library is not installed yet (Astra's OK first: it is a download from PyPI), the login is not set, so it
has never read the real router; and the tool box does not show the record yet (the page data file is written for it).

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-26.
