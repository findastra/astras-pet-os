# MCP servers for Astra's PetOS: which ones are worth it

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-09, for Astra.

Astra, 2026-11-09: "look through all the pets that we have right now and see if there's MCPs out there that are worth
getting for us and do a critical assessment on if I actually would use it with what I have or what I intend to use it
on in the future." She approved the plan in chat the same day.

- **`docs/mcp-assessment-20261109.md`**: all 87 pets against 29 MCP servers. Five shared by many pets (three to get,
  one of them a checker, and two already in place), five for one pet, nine for later, ten to skip, and 44 pets that
  need none. Each
  with its keeper pet, maker, verdict and reason.
- **Where an MCP server sits:** a tool at L1 (a 3rd party program, or a native tool when the farm made it), called by
  the seat at L3, its steps a trick at L2, its grant L4's. Written into the doc from the 2026-10-24 rule ("who does the
  work decides the kind").
- **Which seats can use them** (Astra: "Did you make sure to cover when ChatGPT is seated? Or later, Kimi, Qwen, or
  Copilot, etc. or my local models use it?"): MCP belongs to the harness, not the model, so a grant names the seat;
  each harness checked in its own docs; ChatGPT stays an adviser with no access unless L4 changes that rule.
- Nothing is installed and no map node or page changes here. Each server waits for Astra's yes in the decision deck
  named on this pull request's card; a yes is registered like `unity-mcp` (#306), in its own pull request.
