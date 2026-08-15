# Security Policy

This is a **documentation and research repository** — it ships no executable application code of its own.
`scripts/*.ps1` only download/verify reference material and never execute third-party code. The repository is
also an installable DSH bundle whose entry point (`index.js`) only reads its own `SKILL.md` and registers one
agent skill; it performs no network, subprocess, or write operations.

## Reporting a vulnerability

If you find a security issue (for example, sensitive material accidentally included in the repository, or a
problem in the bundle entry point), please **do not open a public issue**. Report it privately via GitHub's
[private vulnerability reporting](https://github.com/PerryLink/dsh-plugin-guide/security/advisories/new).

### Before you report

- **Redact your report**: remove any tokens, API keys, credentials, request headers, personal paths, or private
  content before submitting. Reports that must reference such material should describe it without quoting it.
- Include the affected file/version (package version or commit) and, when available, steps to reproduce.

### Response expectations

- We aim to acknowledge privately reported vulnerabilities within **7 days** and to publish a fix or a
  coordinated-disclosure plan within **30 days**.
- This is a community-maintained repository; response times depend on maintainer availability.

### Credit and disclosure

- Reporters who follow this policy are credited in the advisory (or anonymously, if they prefer).
- We coordinate disclosure with the reporter: fixes are merged first, then the advisory is published.

## Scope

- Third-party content in `downloads/` is not part of this repository's distribution and carries its own licenses —
  see [NOTICE.md](NOTICE.md).
- We do not control the upstream projects referenced here (DeepSeek Harness, Cordis, community repositories).
  Issues in those projects should be reported to their own trackers.
