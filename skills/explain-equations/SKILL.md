---
name: explain-equations
description: How to show Astra an equation, formula or calculation anywhere (chat, docs, pages, slides, pull requests) - every variable defined first, then the equation written with an equals sign, then the equation solved for a real scenario from the work at hand. Also how to teach her a field that is new to her, from the beginning. Use whenever you are about to write math, a formula, a unit conversion or a numeric rule of thumb for Astra, in any project, as any assistant.
---

# Explain equations (Astra, 2026-11-19)

Astra, 2026-11-19, reading an abliteration deep dive: "I don't know what any of the equations are but they seem like
math I could understand, but I don't see equals signs. If you ever give me equations again, I want all of the
variables defined first, then the equation, then real life scenario solving equation ... choose wisely what problems
you want to show me, likely they will be what we are talking about. I know nothing about AI model weights, so you need
to teach me from the beginning."

## Every equation comes in three parts, in this order

1. **Variables.** A list before the equation: each symbol, what it is in plain words, its unit, and where its value
   comes from. Nothing appears in the equation that is not on the list.
2. **The equation**, written with an equals sign: `S = N × b ÷ 8`. Never an arrow (`←`, `→`, `:=`) and never a bare
   expression with no `=`. Write `×` and `÷` (`*` and `/` inside code), `sqrt()` for roots, and `Σ` only together with
   the words "add up, for every ...".
3. **A real scenario, solved.** Put real numbers from the work at hand into the equation, one step per line, with
   units, and end with what the answer means for the decision in front of her. Check the arithmetic before sending.

## Choose the problem wisely

- Show the equation that explains what she is deciding or asking about right now. If it does not change a decision or
  explain a result she is looking at, leave it out.
- Use numbers from her own setup (her machines, models, files, test results) before textbook numbers.
- One or two equations that matter beat five that don't.

## Teaching a field that is new to her

- Start from zero: define each new word the first time it appears, and build one idea at a time.
- She learns quickly and knows engineering math: use engineering analogies where they really fit (process flow,
  mass balances, design of experiments, control loops, unit conversions), then give the standard term so she can look
  it up (see `dev-mindset`).
- Toy numbers first, small enough to check by hand (three numbers, not 2,048), then say how big the real thing is.

## Example

**Variables**
- `S` = the model file's size, in bytes
- `N` = the number of weights (parameters) in the model; Qwen3.6-35B-A3B has about 35,000,000,000
- `b` = bits stored per weight: 16 for BF16, about 8.5 for Q8_0
- `8` = bits in one byte

**Equation**

`S = N × b ÷ 8`

**Real scenario:** will the full-size model fit in the 128 GB box?
- `S = 35,000,000,000 × 16 ÷ 8`
- `S = 70,000,000,000 bytes = 70 GB`
- 70 GB is less than 128 GB, so Heretic can load the full-size model with room to spare.

**Not like this:** `W ← W − r rᵀ W` (an arrow instead of `=`, and no variables defined).

Written by Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-19.
