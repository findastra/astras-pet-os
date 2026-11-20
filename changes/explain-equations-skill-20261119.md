# Explain equations: the variables, then the equation, then a real scenario solved (2026-11-19)

Astra, 2026-11-19, reading an abliteration deep dive: "If you ever give me equations again, I want all of the
variables defined first, then the equation, then real life scenario solving equation ... I know nothing about AI model
weights, so you need to teach me from the beginning."

- **New skill `skills/explain-equations/SKILL.md`**, for every assistant (Claude, Codex, any other) in every project:
  an equation, formula or calculation for Astra comes in three parts, in this order. First the variables (each symbol
  in plain words, its unit and where its value comes from), then the equation written with an equals sign (never an
  arrow or a bare expression), then a real scenario from the work at hand, solved one step per line with units. It
  also says which equation to show (the one that explains what she is deciding now, with numbers from her own setup)
  and how to teach a field that is new to her from the beginning (each new word defined, engineering analogies where
  they fit, toy numbers first). Its example works out a model file's size from its number of weights.
- **Where it sits:** next to `skills/questions-as-slides`. Both are rules for talking to Astra that every chat uses, so
  the master stays in the hub. It belongs to the seat, not to one pet, so it is not a trick node in `system-map.json`
  or a row in TOOLS-AND-TRICKS.md, and no generated file changes.
- **Not installed yet:** Luna's Log's skill-install-tool installs a master only as it is on GitHub's `main`, and only
  when its manifest lists it (findastra/lunas-log, `tools/skill-install-tool/skill-install-manifest-20261112.json`).
  After this pull request merges, the manifest gets an `explain-equations` row (seats `claude` and `codex`), and
  `install --yes --fetch` puts the skill in `%USERPROFILE%\.claude\skills` and `%USERPROFILE%\.agents\skills`.

Pull request #392. By Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), 2026-11-19.
