# Pet sizes and presence controls

By Astra, implemented by OpenAI Codex (GPT-6), 2026-10-30.

Astra requested consistent sizes and proportions within animal types, larger animals above smaller ones, and Workflow Whale as the largest pet with a modest upper limit. She also requested working OpenAI presence and direct launch controls for both presence apps in Discord Damsel.

The desktop host uses one compressed species scale with a final aspect-preserving cap. Workflow Whale is largest by maximum dimension (64 logical pixels), with other pets capped at 56. The existing calibrated human group uses a shared 202-art-pixel crop at 52 logical pixels high. Rat and Dormouse share a size group; insects share another. Paper Patty and File Master remain equal-height paired companions. Claude Bot's 150% enlargement is removed. The Farmer retains his current drawing; his different head/body proportions cannot be equalized with a uniform display scale.

Damsel's generated page gains visible Start and open, Open controls and Stop sharing actions for each existing presence program, backed by her own fixed local launcher. Live power lights describe actual publishing instead of a saved browser switch. The desktop double-click starts that fixed launcher hidden; it does not run arbitrary page commands. Reported maintenance state and notes are preserved.

Validation: desktop candidate compiled and its complete self-test passed, including new extreme-aspect-ratio/cap checks, species order and hidden fixed-launcher checks. A read-only reviewer accepted C# SHA256 `777db51fbd43fd73a38c41440ddfe920edbea702a9aea7db63ff5b8270a0f677`. The size comparison loaded all 18 distinct images, both size states and zoom, with no script errors or overflow at 360 pixels. Remaining page/service checks and exact revisions are recorded in handoff 268. No live desktop executable has been replaced; core integration awaits Astra's approval.
