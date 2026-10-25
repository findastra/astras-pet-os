status: open (benchmark-rock#4 and #224 merged with Astra's OK, 2026-10-23; #3 and #221 to be rebuilt on top; then the local build and Startup Star)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-23
needs: findastra/benchmark-rock (README.md, AGENTS.md, benchmark-rock-20261023.cs), log-den's contracts/background-pet-20261021.cs, handoffs/067-any-kernel-grove-process-sweep-20261021.md, PET-PROGRAM-FRAMEWORK.md section 4 (no tray icon)
---
## What I did

Astra, 2026-10-23, after a hung Blender render held her graphics card for 13 hours: "make sure nothing else is eating
up my graphic card right now", then "Give the graphics card watch to Inference Iguana (Benchmark Rock); Kernel Koala
keeps processes and memory." (#223, merged), then "Create the Inference Iguana, Benchmark rock, and show me in the
broswer pane here when you have it".

**findastra/benchmark-rock#4** (`claude/gpu-watch-20261023`, 28c17eb; the repo is private), not merged:
- `benchmark-rock-20261023.cs` and `build-benchmark-rock-20261023.ps1`: a native Windows window, built with the C#
  compiler that ships with Windows, compiling log-den's two contracts from `..\log-den\contracts` (or `-LogDen`).
- `benchmark-rock-v1.0-gpu-watch-v1.0`: tabs **Graphics cards** (per card: its own memory in use, how busy and on which
  engine, biggest users) and **Using the graphics card** (every program: graphics memory, borrowed memory, busy, engine,
  window). Live every three seconds. Read-only; **Open Kernel Grove** is where a program is stopped.
- `benchmark-rock-v1.0-busy-watch-v1.0`: a look every two minutes in the background, no tray icon; curious at 90%
  graphics memory, or when a program with no window keeps a card 80% busy for ten minutes.
- Windows' GPU counters (what Task Manager reads) plus DXGI for names and sizes, matched by LUID. dwm's number counts
  other programs' windows (9.3 GB on a card using 7.6 GB, 2026-10-23), so it stays out of "biggest" lists. DXGI lists
  the RX 9070 XT twice; the empty second view is hidden.

**This pull request (#224):** #72 to the pipeline (pet-programs.json, pets.json, system-map.json with two tools and the
written-only grant `inference-iguana-look`), Inference Iguana in Startup Star's `BackgroundPets`, the
INTELLIGENCE-LEVELS row, `changes/benchmark-rock-pipeline-20261023.md`, and the rebuilt pages.

**Evidence (2026-10-23, from inside the Claude app on Astra's PC):** Benchmark Rock `--self-test` 48 passed, 0 failed;
`--report` and `--json` on the live cards; both tabs drawn with `--screenshot`; `--watch` then `--quit` on a throwaway
data folder (mood `sleep`, menu items, three farm events). Hub `npm test`: 332 tests, 330 pass, 1 fail (the Windows
from-scratch installer test, failing on main too), 1 skipped. Startup Star built in the worktree: `--self-test` PASS.
Benchmark Rock's pet program page looked at in the browser pane: both tools, no console errors.

## Merge order (Astra, 2026-10-23)

Another chat built Benchmark Rock the same evening: findastra/benchmark-rock#3 (program-watch moved from Kernel Grove,
with the VR programs) creates the same two files, `benchmark-rock-20261023.cs` and `build-benchmark-rock-20261023.ps1`,
and hub #221 (live program lights) changes `system-map.json` and `pets.json` around Inference Iguana. Astra, in chat:
"Merge findastra/benchmark-rock PR #4 and findastra/astras-pet-os PR #224 first, and leave #3 and #221 for the other
chat to rebuild on top of mine." So **#3 and #221 are rebuilt on top of main** by the chat that owns them:
program-watch becomes a third tool of the one Benchmark Rock program (`Rock.Tools`, its own self-test checks, its
`--programs`, `--close-program` and `--open-program` commands next to `--report`), and #221 moves program-watch to
program-72 next to `gpu-watch` and `busy-watch`. The pipeline node's id is `benchmark-rock`.

## What is left

1. Done when this card merged: benchmark-rock#4, then #224 (Astra's OK in chat, 2026-10-23).
2. The other chat: rebuild benchmark-rock#3 and hub #221 on top of them (above).
3. After both merge: clone benchmark-rock into `Documents\Astra's PetOS` next to kernel-grove and log-den, build it,
   and rebuild and restart Startup Star (read its current cards first) so Inference Iguana's menu shows.
4. Astra tries the window herself. Not done yet.
5. Pet art for Inference Iguana (costs money: waits on her OK).
6. Planned: inference benchmarks and latency, once Llama Librarian's Model Library has a local model to run.
