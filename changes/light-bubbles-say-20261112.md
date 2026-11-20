# The lights' bubbles speak again on every pet program page (2026-11-12)

Astra, 2026-11-11: "Do an audit on this page for buttons. Make sure the buttons all work and they open the programs or
close them if they say they do." Then: "Yes, fix them."

The button audit of Unity Stable found that MCP for Unity's ON/OFF light said nothing when clicked. The cause was in
every spawned pet program page. `apps/pet-programs/pet-program-page-20261018.js` had two functions named `say`:
- the lights' `say(button, text)`, which shows the small bubble under a light;
- the pet chat window's `say(from, text, to)`, which adds a line to the chat.

The chat's `say` came later in the same scope, so it replaced the lights' one. Every light message sent with `say` went
into the chat log instead of the bubble. That covers "not created yet", "opening…", "closing…", why a program cannot be
opened, and "the watch is not running". Only the messages that came back from the watch still showed, because they use
`sayAt`.

- The chat's function is now `chatSay`. The lights' `say` is the only `say`.
- `test/cyberhome-chat-test-20261019.mjs` checks that the page script declares each function name once. The check
  fails on the old script.

Goes with findastra/benchmark-rock `claude/unity-lights-20261112` (MCP for Unity says why it cannot be opened; the
Unity editor opens the newest 2022.3.22f1 project) and findastra/unity-unicorn `claude/program-lights-open-20261112`
(the repo's own Unity Stable page opens and closes programs).

Claude Opus 5.5 (claude-opus-5-5), 2026-11-12.
