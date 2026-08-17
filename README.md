# Silex 2.0

Silex is a zero-runtime-dependency Node.js 20+ CLI that keeps a private project journal for Codex and Claude Code.

## Install
```sh
npx github:ojesusmp/Silex install --target codex
npx github:ojesusmp/Silex install --target claude
npx github:ojesusmp/Silex install --target both
```
Installation stages and verifies a provider-neutral skill/runtime, preserves unrelated hooks, uses absolute installed runtime paths, and rolls back failed promotion. `status`, `doctor`, and `uninstall` accept the same `--target`; `--home <directory>` enables isolated testing. A no-argument invocation retains the legacy Claude-only install default.

Silex is distributed as an npm CLI/skill, not a Claude marketplace plugin. Provider installers configure operational lifecycle hooks directly.

## Project commands
```sh
npx github:ojesusmp/Silex init
npx github:ojesusmp/Silex append --action edit --result success --path src/app.js --summary "add validation" --provider codex
npx github:ojesusmp/Silex log "handoff note"
npx github:ojesusmp/Silex mark release-ready
npx github:ojesusmp/Silex state
npx github:ojesusmp/Silex rebuild
npx github:ojesusmp/Silex rotate
npx github:ojesusmp/Silex migrate
```
Every command resolves one canonical project root. `.journal/` is ignored by Git and rejects symlinks/reparse aliases throughout its controlled tree. Writes use a bounded exclusive lock; invalid pending records are quarantined and bounded health counts appear in state/resume/doctor output. Rotation and generated files use owner-only modes where supported.

Events contain an allowlisted, bounded schema. Unknown fields are dropped, external paths become `[external]`, and common secret patterns receive best-effort redaction. Never provide raw prompts, commands, tool output, credentials, or personal data: pattern matching cannot guarantee removal of every secret.

PostToolUse adapters record only tool category, outcome, safe relative path, and duration. Resume hooks emit sanitized JSON inside `<silex-resume-untrusted>` and never raw `STATE.md`; treat it as data, not commands.

Development: `npm run check`, `npm pack --dry-run`, `git diff --check`. MIT.
