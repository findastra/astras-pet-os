---
name: merge-order
description: Keep Astra's chats and pull requests in the order she should merge them, most important first. Use whenever a chat opens, updates, merges or closes a pull request that waits on Astra, when she asks what to merge first, and at the start of every chat (check your place in the list).
---

# Merge order (Astra, 2026-10-17)

Astra asked: **the chats on the left should be in the order of which merges she needs to do first, at the top.**

## What is possible, and what is not
- Every chat **starts its title with its place in the merge order, in front of the name it already has**:
  `1 · Friendly Farmer - Idle vs. Active Flash Audit` (Astra, 2026-10-18: keep the name she gave it). Astra's chat list
  is sorted by name, so the numbers put it in order; the one with `1` is next. A chat with nothing for Astra to merge
  starts with `✓`. How chats title and renumber themselves: [chat-order](../chat-order/SKILL.md).
- Claude app chats can rename each other (`set_session_title`) and message each other. Codex chats, ChatGPT and chats on
  another PC cannot be reached: their own chat renames itself when it reads chat-order, or Astra renames it.

## The list lives on GitHub, never in a file (Astra, 2026-10-18)
A ranked list kept in a repo file made every open pull request edit the same lines, so each merge left all the others
saying **"This branch has conflicts"**. So the order is **worked out fresh** each time from GitHub's open pull requests
(every repo Astra uses), with the rank rules below, and shown in two places only: **chat titles** and the **chart** in a
reply. No pull request edits a shared list.

Rank, most important first:
1. **Security fixes**, by the severity in the newest assessment (high before low). A fix that turns a protection on
   again comes before one that only documents it.
2. **Something broken that runs every day** (a failing scheduled round, a page that is down).
3. **What other pull requests build on**: the base before the pull requests stacked on it, and of two that touch the
   same lines, the bigger one first, so the smaller one's chat fixes the conflict.
4. **Everything else**, oldest first.
5. **Stale pull requests** (the Cage is retired, superseded, or a month old with no chat): listed last as
   "close?", for Astra to close or keep.

Same pull request in two repos (a hub copy and a live site): they sit next to each other, with the same chat.

## How to give Astra her action items (Astra, 2026-10-18)
**Every reply that has more than one merge or action for Astra** shows them as one numbered chart, in the order she
should do them (rank rules above, from the open pull requests right now), never as loose bullets:

| # | Do this | Pull request (what it does, one line) | Link | Chat |
|---|---|---|---|---|
| 1 | Merge | #47 Ghost Protocol links kept to http and https | https://github.com/findastra/astras-pet-os/pull/47 | 1 · Ghost Protocol fixes |
| 2 | Tick the box, then Save | Lets the Farmer's round open its pull request | https://github.com/findastra/astras-pet-os/settings/actions | (setting) |

- **#** is the order to do them in. **Do this** is one verb: Merge, Close, Answer, Look at, Tick, Delete.
- **Link** goes straight to the page where she acts: the pull request, the exact settings page, the chat's question. Full
  URL, in the repo that needs the action (ghost-protocol's pull requests link to ghost-protocol, not the hub).
- Say what must wait for what in the row ("only after #1").
- Things that need no action from her are not rows.
- Check each pull request's state just before the chart (`mergeable_state`): a row that has conflicts says
  **"Wait: its chat fixes the conflict first"**, never "Merge".

## When GitHub says "This branch has conflicts"
- Two pull requests changed the same lines; the one merged first wins. **Astra does not fix it on GitHub** (the
  "Resolve conflicts" button can lose work). The chat that made the pull request merges `main` into its branch, keeps
  both sides' meaning, runs `npm test`, pushes, and tells her when it is ready.
- To keep conflicts rare: merge one at a time, top of the chart first, and wait for the next chat's "ready" before the
  next merge when it touches the same files.

## Steps
1. **When your chat opens a pull request for Astra:** work out its rank from the open pull requests (rules above) and say
   it in the pull request's text. Do not write the list into any file.
2. **Number your chat** by [chat-order](../chat-order/SKILL.md): `N · <the chat's own name>`, or `✓ <the chat's own
   name>` when nothing waits on Astra. Only the number in front changes; the name stays Astra's.
3. **Tell the other chats** whose number changed: renumber the chats you can reach the same way and send each one a short
   message with its new number. List the chats you could not reach for Astra.
4. **After a merge or close:** everyone below moves up by one: renumber (steps 2 and 3). If your pull request now has a
   conflict, fix it right away (section above) and tell Astra when it is ready.
5. Astra can reorder the list any time; her order wins over the rules above.
6. Never merge to move up the list: merging is Astra's (AGENTS.md).
