# Changelog
## 2.0.0
- Added a provider-neutral Node.js 20+ CLI for Codex and Claude Code.
- Added schema validation, bounds, redaction, path safety, locking, pending fallback, atomic projection, and collision-free rotation.
- Added safe structured resume from `STATE.json`; raw Markdown is never injected.
- Added idempotent marked hook merge, manifest, status, doctor, surgical uninstall, v1 migration, tests, and CI.
- Hardened all controlled journal paths against links/reparse aliases; added provider-specific metadata-only hooks, quarantine health, transactional rollback, canonical-root resolution, exact-path uninstall, and adversarial cross-platform tests.
- Removed non-operational Claude marketplace metadata; Silex 2 is distributed as an npm CLI/skill.
