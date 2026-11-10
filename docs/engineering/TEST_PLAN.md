# Test Plan

## Required checks
- Unit tests for changed logic.
- Integration tests for API and database behavior.
- Authorization and ownership tests for private data.
- Client type checking and production build.
- Server type checking and production build.
- Regression tests for existing behavior.
- Manual end-to-end smoke tests.

## Conversation persistence checks
- Create a conversation and send messages.
- Refresh the page and verify the conversation remains.
- Restart the server and verify persistence.
- Create a second conversation and switch between both.
- Verify messages do not leak between users.
- Verify delete behavior and authorization.

## Multimodal checks
- Test valid and invalid image inputs.
- Test provider failures and size/type limits.
- Test audio permission, recording, transcription, playback, and errors.

## Completion evidence
Record exact commands, exit codes, and relevant results.
Never claim a test passed unless it was actually run.
