# Benchmark Rock's server, named once in pets.json (2026-11-20)

Astra, 2026-11-20: "every pet gets its own server ... so we can end separate ones of them at a time on demand and not
the whole system at once ... They should all be named after their pet program, and then dash server dash the date it
was updated, which would be today." Her answers to the deck "Pet Servers: Two Questions": "I want the one server per
pet, I dont care if [it] stops stuff together. cant have that many [running]. all recommended everything else". The
rule is the Flash Audit's check A72, "Its own server" (#372).

- **`server` in pets.json:** a pet's server is written once, in its entry, as its path inside the pet's own folder.
  Benchmark Rock is the first: `bin/benchmark-rock-server-20261120.exe`, built by findastra/benchmark-rock's pull
  request for the same change (the same program as its window, built a second time under its server's name).
- **Startup Star** (`scripts/desktop-pets-20261011.cs`): `BackgroundPets.Servers()` reads every `server` line from
  pets.json (only a plain path inside the pet's folder: no drive, no `..`, no quote, and a name ending in
  `-server-YYYYMMDD` with `.exe`, `.mjs`, `.js` or `.ps1`), and Inference Iguana's entry starts that program. A farm
  whose pets.json has no line for it starts the window program, which keeps watch the same way. The self-test checks
  both, and refuses unsafe paths. The star has to be rebuilt on the PC after the merge (bin is gitignored).
- **`test/pet-servers-test-20261120.mjs`:** each `server` is named after its pet program in pet-programs.json, then
  `-server-` and the date; one per pet; and the star never names the file itself.

The next renames go the same way, easiest first: Kernel Grove, White Hat Lab, Wonderland Launchpad, then Log Den's
three together and Audio Rescue; then the two that join several programs into one (Discord Tower's three presences,
then The Farm's four jobs). The White Hat Weasel already knows Benchmark Rock's server by "benchmark-rock" in its
command line; it reads `server` from pets.json with the first rename whose name it would not know.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
