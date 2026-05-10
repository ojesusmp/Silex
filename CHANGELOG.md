# Changelog

All notable changes to `silex` are documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-05-09

Plugin layout. Same skill, now installable as a Claude Code plugin alongside the existing raw-skill install paths.

### Added
- `.claude-plugin/plugin.json` — Claude Code plugin manifest declaring the silex skill.
- `.claude-plugin/marketplace.json` — marketplace listing so the repo can be added via `/plugin marketplace add ojesusmp/Silex`.
- README install Option A: `/plugin install silex@silex` — one-slash-command install inside any Claude Code session.

### Changed
- Skill content moved from repo root into `skills/silex/` (`SKILL.md`, `templates/`, `examples/`, `hooks/`). This is required for Claude Code's plugin layout.
- `bin/install.js` copies from `skills/silex/` (was: from repo root). End-user install location unchanged.
- `package.json` files whitelist updated for new layout. `npm` package now ships `.claude-plugin/`, `skills/`, `bin/`, `README.md`, `LICENSE`, `CHANGELOG.md`.
- `SKILL.md` frontmatter version bumped to 1.1.0.
- README internal links updated to point at the new `skills/silex/...` paths.

### Migration notes
- Existing `~/.claude/skills/silex/` installs are not affected — `npx @ojesusmp/silex` and the manual paths still land the skill in the same place.
- New install path: `/plugin install silex@silex` (after `/plugin marketplace add ojesusmp/Silex`).

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
