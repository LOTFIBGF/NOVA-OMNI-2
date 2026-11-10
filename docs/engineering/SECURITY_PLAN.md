# Security Plan

## Priority controls
- Investigate and remove unintended authentication bypasses.
- Enforce server-side authentication and authorization.
- Enforce ownership checks on conversations and uploaded files.
- Protect sessions and cookies.
- Validate and constrain all user input and uploaded media.
- Apply rate limits to sensitive and expensive endpoints.
- Configure CORS and security headers for intended environments.
- Keep secrets outside source control and logs.
- Avoid logging passwords, tokens, or private conversation content.
- Review dependency vulnerabilities and update risks.

## Environment separation
Local development settings must never silently weaken production security.
Production startup must fail safely when required security configuration is missing.

## Release gate
No production deployment until authentication, authorization, secret handling, and relevant security tests have been reviewed.
