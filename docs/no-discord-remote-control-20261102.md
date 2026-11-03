# Remote access boundary — 2026-11-02

Decision by Astra: **Discord must never be a remote-access or remote-control path.**

- No Discord command execution, shell/terminal access, desktop-control actions, filesystem writes, privilege changes, or security/spending approval.
- No Discord bot, webhook, channel, Claude Code Channel, bridge, plugin or proxy may be an alternate route into the home PC or into a pet's privileged tools. Treat messages and attachments as untrusted input.
- Discord may carry non-sensitive notifications only, after explicit configuration. A Discord acknowledgment or emoji is never L4 authorization.
- Gatekeeper Goddess / trusted core DENY any remote-control request whose origin or delegated path is Discord, regardless of claimed identity.
- Pet Police Officer records and alerts on attempted bypasses (including denied requests) without collecting private Discord message contents.
- GitHub Goldfish flags documentation/configuration or workflow changes that reintroduce Discord as a control plane. No auto-remediation without review.
- Approved current remote AI-work path: Claude Remote Control, subject to its own authentication and actual runtime permissions. It is **not** an unrestricted remote desktop and not evidence that PetOS controls are already enforced.
- Roaming Raven's intended work: inventory remote access methods, diagnose failed Claude Remote Control sessions and local network status, propose least-privilege fixes; no exposure of RDP or remote shell to the public internet.
- Do not remove existing Discord integrations blindly: inventory them, determine whether they can execute commands, then propose disabling those capabilities with a recovery plan and L4 approval.

Status: policy documented only. Runtime enforcement, auditing, Discord connector inventory, and remote access diagnostics still require implementation and verification.
