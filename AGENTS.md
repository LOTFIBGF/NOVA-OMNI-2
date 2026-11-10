# NOVA-OMNI Engineering Rules

## Mandatory workflow
1. Inspect the existing implementation before changing code.
2. Read the relevant files, tests, package scripts, and architecture.
3. Define the task, scope, expected behavior, and acceptance criteria.
4. Never modify unrelated files.
5. Never overwrite user data, backups, or secrets.
6. Add or update tests for every behavior change.
7. Run relevant tests, type checks, and builds.
8. Review `git diff` and run `git diff --check`.
9. Record important decisions, bugs, and completed work in `docs/engineering/`.
10. Never mark a task Done until its acceptance criteria and tests pass.

## Security
- Never expose API keys, tokens, passwords, or `.env` contents.
- Never commit secrets or production credentials.
- Never disable authentication to make a feature work.
- Validate inputs and enforce authorization on the server.
- Treat local development mode separately from production.
- Do not deploy while authentication or authorization bypasses remain unresolved.

## Git safety
- Do not run destructive Git commands without explicit approval.
- Do not discard uncommitted changes.
- Keep work on the task's designated branch.
- Review the working tree before commits and pushes.

## Communication
- Explain the purpose of each task and its risks.
- Distinguish verified facts from assumptions.
- Report commands and their actual results honestly.
