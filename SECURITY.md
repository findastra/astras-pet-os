# Security Policy

Astra's PetOS and every pet repo under [findastra](https://github.com/findastra) follow this policy.
How the farm is protected (rings, walls, the security team, recovery) is described in the
[security model](docs/security-model-20261018.md) and [PROTECTION-RINGS.md](PROTECTION-RINGS.md).

## Supported versions

There are no releases yet. Security fixes go to the `main` branch of each repo; use the latest `main`.

## Reporting a vulnerability

**Never post a break-in, a leaked key or a way around a check in a public issue.** Report it privately:
[Report a vulnerability](https://github.com/findastra/astras-pet-os/security/advisories/new)
(GitHub private vulnerability reporting). For a pet repo, report it there or here; either reaches Astra.

Please include what is affected (repo, file, version or commit), how to reproduce it, and what an attacker could do.

## What to expect

This is a one-person project in early beta. Astra reads every report and replies as soon as she can. Fixes are
made privately, released to `main`, and the report is published as a GitHub security advisory once a fix is out
(coordinated disclosure). Credit is given to the reporter unless they ask not to be named.

## Scope

In scope: the code in this repo and the other `findastra` repos, the GitHub Pages sites, and the rules that
assistants follow here (AGENTS.md, CLAUDE.md, `skills/`), including prompt-injection paths.

Out of scope: third-party programs and services the pets use (report those to their makers), other people's farms,
and social engineering against Astra.
