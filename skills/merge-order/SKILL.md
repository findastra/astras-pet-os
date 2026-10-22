---
name: merge-order
description: Work out the order Astra should merge pull requests in, most important first, and show it as one numbered chart with a direct link for each action. Use whenever a chat opens, updates, merges or closes a pull request that waits on Astra, when she asks what to merge first, and before asking her for any go-ahead (merge, push, open a pull request), so the question points to the decision that must come first.
---

# Merge order (Astra, 2026-10-17)

Astra asked to see which merges she needs to do first. The order is shown in the **numbered chart** in a reply.
**Chat titles are not numbered** (Astra, 2026-10-18: "the numbering rule isnt working just remove it from skills
entirely"): never rename a chat to show its place in the order.

## The list lives on GitHub, never in a file (Astra, 2026-10-18)
A ranked list kept in a repo file made every open pull request edit the same lines, so each merge left all the others
saying **"This branch has conflicts"**. So the order is **worked out fresh** each time from GitHub's open pull requests
(every repo Astra uses), with the rank rules below, and shown only in the **chart** in a reply. No pull request edits a
shared list.

**Start from GitHub Aquarium's outstanding-items (Astra, 2026-10-21).** On Astra's PC, run `npm run outstanding-items -- --md`
in the hub folder before you build a chart: it reads every repo she owns (read only, with the PC's own GitHub sign-in)
and lists, in this rank, the jobs failing on a main branch, the pull requests ready for her OK, the cards that wait on
her, and what each chat must fix first (conflicts, failing checks, pull requests stacked on another branch). It also
refreshes her Pets Board and GitHub Aquarium's panel. Check the rows that matter to your question just before you ask.

Rank, most important first:
1. **Security fixes**, by the severity in the newest assessment (high before low). A fix that turns a protection on
   again comes before one that only documents it.
2. **Something broken that runs every day** (a failing scheduled round, a page that is down).
3. **What other pull requests build on**: the base before the pull requests stacked on it, and of two that touch the
   same lines, the bigger one first, so the smaller one's chat fixes the conflict.
4. **Everything else**, oldest first.
5. **Stale pull requests** (the Cage is retired, superseded, or a month old with no chat): listed last as
   "close?", for Astra to close or keep.

Same pull request in two repos (a hub copy and a live site): they sit next to each other.

## How to give Astra her action items (Astra, 2026-10-18)
**Every reply that has more than one merge or action for Astra** shows them as one numbered chart, in the order she
should do them (rank rules above, from the open pull requests right now), never as loose bullets:

| # | Do this | Pull request (what it does, one line) | Link |
|---|---|---|---|
| 1 | Merge | #47 Ghost Protocol links kept to http and https | https://github.com/findastra/astras-pet-os/pull/47 |
| 2 | Tick the box, then Save | Lets the Farmer's round open its pull request | https://github.com/findastra/astras-pet-os/settings/actions |

- **#** is the order to do them in. **Do this** is one verb: Merge, Close, Answer, Look at, Tick, Delete.
- **Link** goes straight to the page where she acts: the pull request, the exact settings page, the chat's question. Full
  URL, in the repo that needs the action (ghost-protocol's pull requests link to ghost-protocol, not the hub).
- Say what must wait for what in the row ("only after #1").
- Things that need no action from her are not rows.
- Check each pull request's state just before the chart (`mergeable_state`): a row that has conflicts says
  **"Wait: its chat fixes the conflict first"**, never "Merge".

## Point her to the first decision (Astra, 2026-10-19)
Astra, about the buttons under a chat's question (Claude's next-step box): "use these so it directs me to the other
decision that needs to be made first before I make it, so that I don't create a bunch of [broken] branches."

Before you ask Astra for a go-ahead or a choice (merge, push, open a pull request, start something), check whether
another decision has to come first:
- an open pull request that yours is stacked on, or that touches the same files (rank rule 3);
- a question waiting on her in another chat whose answer changes your branch;
- a pull request of yours with a conflict (its chat fixes that first, section below).

Then:
1. **Something comes first:** ask about that one, not yours. The question names it and says why it is first ("First
   merge log-den#8: it changes the same program"), and the first button takes her there: Claude's answer to the button
   links the other chat (its `local_…` session link opens it in one click) or the pull request; Codex, or a chat with
   no buttons, puts that link on the first line of the reply. Ask for your own decision only after that one is made.
2. **Nothing comes first:** ask for yours, with your recommendation as the first button.
3. **Just before you act on her answer,** fetch again. If `main` moved while she answered, rebase or merge `main` into
   your branch and run the tests again before you push, and say so in one line.

Never offer a button that makes a branch, pushes or merges ahead of a decision it depends on.

Example (2026-10-19): the `--startup` branches in log-den, packet-river and evidence-locker were ready while #8 in
each repo (the draft pet art, in the same programs) was still open. The question should have pointed to the three #8s
first. They merged while she answered, so the branches were rebased on the new `main` and tested again before the push.

## When GitHub says "This branch has conflicts"
- Two pull requests changed the same lines; the one merged first wins. **Astra does not fix it on GitHub** (the
  "Resolve conflicts" button can lose work). The chat that made the pull request merges `main` into its branch, keeps
  both sides' meaning, runs `npm test`, pushes, and tells her when it is ready.
- To keep conflicts rare: merge one at a time, top of the chart first, and wait for the next chat's "ready" before the
  next merge when it touches the same files.

## Steps
1. **When your chat opens a pull request for Astra:** work out its rank from the open pull requests (rules above) and say
   it in the pull request's text. Do not write the list into any file.
2. **In your reply,** give the numbered chart when there is more than one action for her.
3. **Before you ask her for any go-ahead,** check what has to be decided first, and ask about that one first
   ("Point her to the first decision").
4. **After a merge or close:** if your pull request now has a conflict, fix it right away (section above) and tell Astra
   when it is ready.
5. Astra can reorder the list any time; her order wins over the rules above.
6. Never merge to move up the list: merging waits for Astra's OK in chat (AGENTS.md).
