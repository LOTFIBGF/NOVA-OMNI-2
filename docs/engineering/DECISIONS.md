# Engineering Decisions

## DEC-001 — Audit before implementation
Decision: inspect existing behavior and architecture before replacing or adding features.
Reason: avoid duplicate systems, regressions, and unnecessary rewrites.

## DEC-002 — Security before production
Decision: authentication and authorization issues block production exposure.
Reason: protect user accounts, conversations, and secrets.

## DEC-003 — Test-backed completion
Decision: no task is Done without acceptance criteria and passing relevant tests.
Reason: make progress measurable and repeatable.

## DEC-004 — Preserve user work
Decision: never discard unknown untracked files, backups, or local changes.
Reason: prevent accidental data loss.

## DEC-005 — Documentation is the engineering record
Decision: update task board, status, decisions, bugs, and changelog as applicable.
Reason: preserve project history and make handoffs reliable.
