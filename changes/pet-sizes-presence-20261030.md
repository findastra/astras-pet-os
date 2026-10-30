# Pet sizes and presence controls

By Astra, implemented by OpenAI Codex (GPT-6), 2026-10-30.

Astra requested consistent sizes and proportions within animal types, larger animals above smaller ones, and Workflow Whale as the largest pet with a modest upper limit. She also requested working OpenAI presence and direct launch controls for both presence apps in Discord Damsel.

Implementation is in progress on this branch. The desktop host sizing and Damsel launch hook belong to the root session; Damsel page controls and their generator belong to its delegated Damsel implementer. Existing artwork, the separate artwork review, unrelated pet settings, and user-reported issue flags are outside this scope.

Validation, review and integration evidence will be recorded in this pull request's handoff before delivery. No live desktop executable has been replaced.
