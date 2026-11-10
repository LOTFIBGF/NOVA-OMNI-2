# Architecture — Initial Audit Map

## Repository structure
The project uses npm workspaces:
- shared
- server
- client

## Known entry points and scripts
- Root development script: dev
- Root test script: test (server tests)
- Root build script: build
- Server build script: build:server
- Client build script: build in the client workspace
- Server application composition: server/src/app.ts
- Server entry point previously inspected: server/src/index.ts

## Known server responsibilities
The existing Express application mounts API routers and includes security middleware and public/configuration/health routes. Exact route behavior must be verified from source before modification.

## Known storage observation
SQLite was previously reported at server/data/OmniKeyAI.db. Verify the actual database configuration and models before designing persistence changes.

## Audit required
- Client routing, state management, and conversation UI.
- API routes and request/response contracts.
- Database models, migrations, and ownership rules.
- Authentication, authorization, and sessions.
- Image and audio providers and their configuration.
- Error handling, logging, and rate limiting.

This document is an initial map, not a complete architecture specification.
