# silex

> Fiber-optic memory for AI coding sessions. Continuous, glyph-compressed timeline journal that survives reboots and self-loads on resume.

`silex` (Latin: flint, silica → silicon → fiber-optic glass) is a Claude Code skill that writes a per-project timeline as you work. After every meaningful step — edit, test, build, commit, decision, wall hit, fix — one compressed JSON line is appended to `.journal/timeline.jsonl` and a live snapshot is refreshed in `.journal/STATE.md`. Each assistant turn ends with a one-line receipt so you can see at a glance whether the journal kept up.

If your computer reboots or your chat dies, nothing is lost: the last saved line is your recovery point. When you start a new chat in the same directory, a one-line `SessionStart` hook reads `STATE.md` and hands the assistant your project context automatically. No briefing required.

## Why

Long projects burn tokens reloading context every new chat. Manual snapshot tools work but require you to remember to save. `silex` is the continuous append layer that runs alongside your work, costing almost nothing per step and giving you free recovery and free resume.

## Install

1. Copy this folder to your Claude Code skills directory:
   - Linux / macOS: `~/.claude/skills/silex/`
   - Windows: `%USERPROFILE%\.claude\skills\silex\`
2. Add the snippet from `hooks/session-start.md` to your Claude Code `settings.json` under `hooks.SessionStart`. Three variants are provided — pick the one matching your shell.
3. Restart your Claude Code session.

That is the entire installation. No daemon, no database, no PostToolUse hooks.

## Use

In any project directory:

- Type `silex` or `/silex` once → bootstraps `.journal/` and starts logging.
- Or just start working — `silex` auto-bootstraps on the first meaningful action.

Useful commands:

| Command | Effect |
|---------|--------|
| `/silex audit` | Scan recent tool calls for drift; catch up missed entries |
| `/silex mark <label>` | Append a milestone to `INDEX.md` |
| `/silex resume` / `resume journal` | Reload `STATE.md` and continue |
| `/silex log <text>` | Manual free-form append |
| `/silex glyph add <char>=<meaning>` | Extend `GLYPH.md` |

## File layout

```
<project-root>/.journal/
├── timeline.jsonl   # append-only events (one JSON per line)
├── STATE.md         # live snapshot (overwritten per append)
├── GLYPH.md         # shorthand dictionary
└── INDEX.md         # milestones
```

## Event format

```jsonc
{"t":"2026-05-09T14:32:01Z","a":"E","f":"src/auth.ts:42","r":"✓","w":"null check"}
{"t":"2026-05-09T14:33:45Z","a":"T","r":"✓","ms":840,"tag":"unit"}
{"t":"2026-05-09T14:35:10Z","a":"W","f":"src/db.ts","e":"EPERM","fix":"chmod 644"}
```

See [SKILL.md](SKILL.md) for the full schema, glyph dictionary, append protocol, and edge-case handling.

## Per-turn receipt

Every assistant turn ends with one of:

```
📓 jrn +2 │ E src/x.ts │ T 12/12        ← wrote 2
📓 jrn +0 │ skip: read-only lookups       ← nothing to log
📓 jrn ⚠ +0 │ MISSED — catching up        ← self-flag, recovers next turn
```

If you ever see `MISSED` and no recovery, run `/silex audit`.

## Credits

Created by [@ojesusmp](https://github.com/ojesusmp).
Repository: <https://github.com/ojesusmp/Silex>

## License

MIT. See [LICENSE](LICENSE).
