---
name: key-request
description: How any chat (Claude, Codex) or pet asks Astra for an API key, token, webhook or other secret - file a key request for API Fairy instead of only asking in chat, then give Astra its ✨ link. Use whenever your work needs a key that does not exist yet, before you write "you need to give me an API key", and when a key you asked for has been given or is no longer needed.
---

# Key requests: ask API Fairy, not the chat (Astra, 2026-10-19)

Astra: "a lot of chats are like, you need to give me an API key for this. You need to give me an API key for that. So
anytime a chat asks for an API key, I need the API fairy to know."

**API Fairy** (pet program **API Fairy Ring**, #4, `findastra/api-fairy`) keeps notes about keys, never the keys. A
**key request** is one small file that tells her who needs which key, what for, and where the ask lives. Her pet program
page (`apps/pet-programs/api-fairy-20261018.html`, the `api-fairy-key-requests-panel`) then shows Astra three groups:
**waiting on you**, **has a key**, and **declined or not needed**, each with a link back to you. Whether a key exists comes
from API Fairy's own scanner (Windows environment variables and the `.env` files she watches), by name only.

This is a harness skill: it belongs to the seat, so every chat follows it on every pet, and it brings no permissions.
The tool it feeds is API Fairy Ring's `api-fairy-ring-v1.0-key-requests-v1.0` (`src/KeyRequests.cs` in `findastra/api-fairy`).

## Never

- **Never ask Astra to paste a key** into a chat, a file, a card, a pull request or an issue, and never write a key value
  anywhere, the request included. API Fairy refuses a request that looks like it holds one.
- **Never reuse `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`** for a bot or tool: Claude Code and Codex read those names, so
  they would bill Astra's own sessions to the API. Give each key its own name, like `ROLE_FAIRY_ANTHROPIC_API_KEY`.
- **Never Astra's Claude Max login** (or her ChatGPT plan) behind a bot, proxy or tool other people use. Those run on an
  API key with a spend limit ([AGENTS.md](../../AGENTS.md), "How the agents work").
- Never put a real request in a repo. The list stays on Astra's PC (below, "Privacy").

## Steps

1. **Decide the request:** the provider, the key's name (its own, in capitals with underscores), where it goes, what it
   is for in one plain sentence, and the spend limit you suggest. Ask yourself whether a key is really needed.
2. **Have a link back.** The request points at where it lives: your pull request, your handoff card, an issue, or a
   claude.ai session link. A chat on the PC with no web link names itself in `asked_in` (its title and session id).
3. **File it** as one UTF-8 file, one key per file, named `<YYYYMMDD>-<requester>-<key-name>.json` in lowercase with
   hyphens, in:

   ```
   %USERPROFILE%\Documents\Astra's PetOS Data\api-fairy-ring\key-requests\
   ```

   It is in Documents, not AppData, on purpose: the Claude and Codex apps keep a private copy of AppData for every
   program they start, so a file a chat wrote there would never reach the fairy Astra runs. Write it with PowerShell or
   your editor's own write tool (Git Bash `/c/` paths with an apostrophe land in a stray `C:\c\` folder).

   ```json
   {
     "schema": "api-fairy-key-request-v1",
     "id": "20261019-role-fairy-anthropic-api-key",
     "asked": "2026-10-19",
     "requester": { "kind": "bot", "name": "Role Fairy's bots", "pet": "role-fairy" },
     "provider": "Anthropic",
     "key_name": "ROLE_FAIRY_ANTHROPIC_API_KEY",
     "where": "user-env",
     "for": "Answers for Fairy Ring's Discord bots, through Fairy Ring's own key, never the Max plan.",
     "spend_limit": "a monthly spend limit, set first",
     "link": "https://github.com/findastra/role-fairy/blob/main/handoffs/001-any-mommys-helper-bot-20261019.md",
     "status": "requested"
   }
   ```

   **A chat with no reach to the PC** (a cloud session): put the same JSON in your pull request or card under
   `## Key request for API Fairy`, and the next chat on Astra's PC files it.
4. **Tell Astra in one line, with ✨ next to the link** (her rule for anything she must act on):
   `✨ Key request for API Fairy: <KEY_NAME> (<provider>, <spend limit>) for <what>. Details: <link>.` Then how to give
   it: she makes the key herself on the provider's own page, sets the spend limit there, and adds it as a Windows user
   environment variable with that name (Windows' own editor, or **ADD A KEY** in API Fairy). Never through you.
5. **When it is done:** API Fairy finds the name and moves it to **has a key** by herself. Set `"status": "given"` and
   `"status_date"` in the file (or Astra does). No longer needed: `"status": "declined"` and a `"note"` saying why.
6. **Check** (optional, never in a loop): `API Fairy.exe --key-requests` in API Fairy's `bin` folder prints the three
   groups, names only, and refreshes her page. `--no-scan` lists the requests by their own status without looking for
   any key.

## The fields (`api-fairy-key-request-v1`)

| Field | Required | What goes in it |
|---|---|---|
| `schema` | yes | `api-fairy-key-request-v1` |
| `id` | no | A dated slug; the file name when missing |
| `asked` | yes | The date asked, `YYYY-MM-DD` |
| `requester` | yes | `kind` (`chat`, `pet`, `tool` or `bot`), `name` (who is asking, in words), `pet` (its pet's repo, if any) |
| `provider` | yes | Anthropic, OpenAI, Discord, GitHub..., or `not chosen yet` |
| `key_name` | no | The variable's name; empty while it is not chosen (then API Fairy can't look for it) |
| `where` | no | `user-env` (default), `system-env`, `dotenv` (a `.env` file in a folder she watches), `app` (inside another program's own settings: she can't look) or `github-secret` (she can't look) |
| `for` | yes | What the key is for, in one plain sentence |
| `spend_limit` | no | The limit you suggest; the amount is Astra's |
| `link` | yes, or `asked_in` | An https link to where the request lives |
| `asked_in` | no | The chat's name and session id, when there is no web link |
| `also` | no | Up to five more https links |
| `status` | no | `requested` (default), `given` or `declined` |
| `status_date`, `note` | no | When the status changed, and anything Astra should know |

API Fairy skips a file that is not this shape and says which one on her page, never what was in it.

## Privacy

The format, this skill, API Fairy's code and the page are public; **the requests are not.** Which services Astra uses,
and which keys exist on her PC, is material for targeted phishing ([PROTECTION-RINGS.md](../../PROTECTION-RINGS.md),
known gap 12). So the list lives only in her Documents folder, API Fairy writes what the page shows next to it, and the
page reads it only when it is opened on her PC. On GitHub the panel shows made-up examples.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19 (card 056).
