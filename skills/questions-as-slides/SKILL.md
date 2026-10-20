---
name: questions-as-slides
description: Whenever you need Astra to answer something before you can go on (a decision, a name, a choice between options, missing information), show the questions as a slideshow, one question per slide with its explanation, and link it in chat. Use in every project, by every assistant (Claude, Codex, any other).
---

# Questions as slides (Astra, 2026-10-19)

Astra: "When you ask me questions that you need the answers to, I want to see them in slideshows with explanations.
Everybody should be doing this."

## When
- Any question whose answer you need: a decision, a name, a choice between options, information only she has.
- One deck per batch: gather every open question of the task into the same deck, instead of asking one at a time.
- A plain go-ahead ("OK to merge #133?") can stay in chat; merges keep the numbered chart (`skills/merge-order`).

## Each slide
1. **The question**, in one line, as the title.
2. **Why it matters:** one to three plain sentences: what it decides and what changes with each answer.
3. **The options**, when there are any: what each one means in practice. Mark your recommendation **Recommended**
   and say why in one line. Never hide an option you think she might want.
4. **What is already decided**, so she never answers twice.
5. **Where the answer goes:** the card, file or pull request that records it.

The first slide says what the questions are about and how many there are. The last slide lists every question with
its recommended answer, so she can say "all recommended" or change one.

## How
- **Claude:** make the deck with the Artifact tool (`action: "quickstart"`, `intent: "slides"`), private, and give
  the link.
- **Codex, or no slide tool:** a self-contained HTML slideshow (one slide per screen, arrow keys and Next/Back
  buttons, readable on a phone), saved where the task's other files are, and opened for her.
- **In chat**, put ✨ right next to the deck's link and list the questions in one short line each, so she sees them
  even before she opens it.
- Plain language, sentence case. When a word is a developer term, give the plain meaning on the slide.
- When she answers, record each answer where the slide said, and show anything still open in the next deck as open.
