# Project Status

## Baseline recorded
- Repository: NOVA-OMNI
- Working branch at engineering setup: engineering/omni-master-system
- Base commit: f5ba893
- Base commit subject: Harden admin password hashing and verification
- Base branch: security/hardening-and-chat-persistence
- Remote tracking observed on base branch: nova2

## Existing working-tree files
The following untracked files were present during branch creation and must be preserved:
- Login
- server/src/__tests__/lib/crypto.test.ts.pre-security
- server/src/index.ts.bak2
- server/src/lib/crypto.ts.pre-security
- server/src/routes/admin.ts.pre-security

## Previously reported observations — reverify
- Client build previously succeeded.
- Vite client previously ran on localhost:5173.
- Express server previously ran on localhost:3001.
- SQLite database previously reported at server/data/OmniKeyAI.db.
- A local development authentication bypass was previously reported:
  "Dashboard Auth: Bypassed (Auto-authorized as local-dev-user-uid)".
- This bypass must be investigated before any production exposure.

## Current engineering status
- Engineering documentation: being established.
- Full architecture audit: pending.
- Security audit: pending.
- Conversation persistence audit: pending.
- Image and audio audit: pending.
- Suggestions audit: pending.

Do not interpret pending items as verified defects or completed features.
Update this file with actual command results and commit identifiers.
