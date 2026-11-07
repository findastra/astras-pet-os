# 3rd party lights open and close programs; no arrows in the three top boxes

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-06, for Astra.

Astra: "I should be able to press the red button, then it launches that program and the button turns green if its on
and detected. Fix all of the buttons in 3rd party programs." Then: "get rid of the dropdown arrows in the cyberhome and
the system map panels", "and get rid of it in the summary panel too".

- `apps/program-lights-control-20261106.js` (new, on every page with 3rd party programs): a click on a red light opens
  the program, a click on a green one closes it (asking first, never forced), through Inference Iguana's watch
  (benchmark-rock `claude/program-switch-20261106`). The watch's address comes from its own file on this PC.
- `apps/pet-programs/pet-program-page-20261018.js`: the light blinks while it opens or closes, then follows what the
  watch sees; a program it never opens says why. The page script still sends nothing itself (it asks the new file with
  an event).
- The cyberhome, quick summary and System Map boxes have no More details and no fold arrow (generator, CSS, test,
  PET-PROGRAM-FRAMEWORK.md section 3).

Checks: in the pane, Ableton Live's and Spotify's red lights opened them and turned green; Spotify's green light closed
it. Another site's request is refused. Hub tests: 383 pass; the one failure (installed farm from scratch) fails on main
too. Not done: nothing starts the watch at sign-in (Startup Star says Inference Iguana's watches start only when Astra
asks), so after a restart the lights stay red until the watch is started.
