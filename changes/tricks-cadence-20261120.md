# Every scheduled job is a trick with its cadence (2026-11-20)

Astra, 2026-11-20, asked whether the recurring checks are listed in their own pet programs as tricks with their
cadence: "they need to be, this was the whole point of the tricks part of Astra's PetOS. Can you make sure they are all
updated with those, and look for more we missed or that we haven't written but should." (Astra, 2026-10-22: "anything
to do w/ schedule is under 'tricks' ... could put a cadence indicator".)

## How the jobs were found

- Every findastra repo's `.github/workflows`: three scheduled jobs exist (the Farmer's daily rounds, his profile round,
  the portfolio's GitHub stats). All three are now listed with their times.
- The Claude scheduled tasks on Astra's PC: File Master's Sunday check-in and Chat Rat's Saturday and Sunday export
  jobs. All three are now tricks with their days.
- Every node in `system-map.json` whose job says it runs on a timer, and every trick whose name or job repeats.
- Windows' Task Scheduler holds only Startup Star for the farm (at sign-in), so nothing new there.

## What changed (`system-map.json`; pages, TOOLS-AND-TRICKS.md and markdown pets rebuilt)

- **Cadences on tricks that had none:** Unity Stable's `weekly-update-from-friendly-farmer` and
  `weekly-copyright-auditor` (weekly), Chat Stack's `save-chats` (weekly, Saturdays).
- **New tricks that already run:** The Farm's `daily-rounds-trick` and `profile-round-trick` (daily, 06:17 and 06:47
  Denver), File Kingdom's `weekly-organizing-proposal` (Sundays, 19:00), Chat Stack's `chat-exports` (request on
  Saturdays, collect on Sundays).
- **New tricks written but not scheduled yet (planned):** The Farm's `click-check-round` and `flash-audit-round`
  (weekly), GitHub Aquarium's `branch-sweep-round` (weekly). Each says plainly that it still runs only when a chat
  starts it.
- **Tools that were missing:** The Farm's `daily-rounds` and `profile-round` (Astra, 2026-10-14, named them tools of
  The Farm, but neither was on the map), and Iced Out Iceberg's `github-stats-refresh` (every 6 hours). A script with
  written steps is both a tool and a trick (Astra, 2026-10-24), so the rounds are both.
- **Cadences on background tools that run by themselves:** `busy-watch` (every 2 minutes), `leftover-watch` and
  `port-watch-tool` (every 10 minutes), `program-watch` and `pet-moods` (every 5 seconds).

## Not changed here

- Luna's Log's `skill-census-trick` and The Pilot Plant's look tool: other open pull requests (#412, #409) are changing
  those pet programs.
- Scheduling the three planned tricks: that is a scheduled task or workflow for each, and waits on Astra.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.
