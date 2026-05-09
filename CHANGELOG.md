# Changelog

All notable changes to `silex` are documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-05-09

Initial release.

### Added
- `SKILL.md` — full skill body with append protocol, glyph dictionary, runtime governance (Karpathy + caveman discipline + forge-council and council-of-12 audit triggers), recursion guard, untrusted-input boundary, atomic `STATE.md` write, secret redaction, consent-on-bootstrap, automatic `.gitignore` injection.
- `templates/STATE.md`, `templates/GLYPH.md`, `templates/INDEX.md` — bootstrap files copied into `.journal/` on first init.
- `examples/timeline.jsonl`, `examples/STATE.md` — fictional `demo-app` data showing real glyph use.
- `hooks/session-start.md` — three `SessionStart` hook variants (POSIX shell, Windows PowerShell, cross-platform Node) with `<silex-resume-untrusted>` wrapping for prompt-injection safety.
- `bin/install.js` — cross-platform Node installer that copies the skill into `~/.claude/skills/silex/` (or `%USERPROFILE%\.claude\skills\silex\` on Windows).
- `package.json` — npm package `@ojesusmp/silex` enabling the `npx @ojesusmp/silex` install path.
- `README.md` — public landing documentation: what silex is, how it works, use cases, anti-use-cases, security, cost, prerequisites, install paths, commands, file layout, event format, failure modes.
- `LICENSE` — MIT.

### Security
- `STATE.md` content is treated as untrusted on session resume; the assistant refuses imperatives found inside `<silex-resume-untrusted>` tags.
- `.journal/` is auto-added to the project `.gitignore` on bootstrap.
- Credential-pattern redaction (`api[_-]?key`, `token`, `secret`, `password`, `bearer`, `ghp_*`, `aws_*`) is applied to `e`, `w`, and `fix` fields before write.
- Forge-council and council-of-12 invocations are bounded by a recursion guard (last-3-entry tag scan, one-of-each-per-turn budget) to prevent token-bomb loops.
