# silex

> Fiber-optic memory for AI coding sessions. Continuous, glyph-compressed timeline journal that survives reboots and self-loads on resume.

`silex` (Latin: *flint, silica*) is a [Claude Code](https://claude.com/claude-code) skill that writes a per-project timeline as you work. After every meaningful step — edit, test, build, commit, decision, wall hit, fix — one compressed JSON line is appended to `.journal/timeline.jsonl` and a live snapshot is refreshed in `.journal/STATE.md`. Each assistant turn ends with a one-line receipt so you can see whether the journal kept up.

If your computer reboots or your chat dies, nothing is lost: the last saved line is your recovery point. When you start a new chat in the same directory, a one-line `SessionStart` hook reads `STATE.md` and hands the assistant your project context automatically. No briefing required.

---

## You will want silex when…

- Your chat hits the context window mid-refactor and you have to start a new one.
- The host machine reboots during a multi-hour debug session.
- You rotate between 2–3 client or repo contexts in one day and lose your place each time.
- You finish a tricky fix and want a low-noise audit trail of what was tried.

## How it works

```
you act
  └─> assistant decides if the step is meaningful
        ├─ no  → skip (single Read, single Grep, scratch reasoning)
        └─ yes → append one JSON line to .journal/timeline.jsonl
                 → atomically rewrite .journal/STATE.md (.tmp + rename)
                 → end the turn with one-line receipt: 📓 jrn +N │ <last action>

next chat in same project
  └─> SessionStart hook prints STATE.md (wrapped in untrusted-input tags)
        └─> assistant reads it, prints "📓 resumed: <proj> │ next: <act>"
              └─> continues without user briefing
```

There is **no daemon, no watcher, no background process**. The assistant writes the entries itself, governed by the skill body. The only thing that runs outside the assistant is one `SessionStart` hook (a single shell command) that prints `STATE.md` when a chat begins. See [`skills/silex/hooks/session-start.md`](skills/silex/hooks/session-start.md).

## Use cases

**Long refactor across days.** You are two days into rewiring an auth system. You step away, the chat dies, you come back tomorrow. The new chat opens with the current decision tree, last wall hit, and next planned action — no re-briefing.

**Crash recovery.** Claude Code or the host machine crashes mid-session. The last appended line is your recovery point. No manual save was required.

**Multi-repo context switching.** You rotate between three client repos in one day. Each `.journal/` is per-project, so resume picks up exactly where that project was left.

**Postmortem and audit trail.** After a tricky bug fix, `timeline.jsonl` is a compact record of what was tried, what failed, and the decision that resolved it — faster to scan than chat history.

## When NOT to use silex

- Throwaway one-shot scripts where the journal would outlive the work it documents.
- Repos under team policy that forbids untracked private working files.
- Highly sensitive codebases where even redacted error strings in a local journal exceed your project's data-handling rules.

## Cost

- Per-turn footer: ≈ 10 tokens.
- `STATE.md` injected on session start: ≈ 200–1000 tokens depending on activity.
- `timeline.jsonl` rotates at 10 MB per project (roughly 50,000 entries before rotation).
- Disk footprint: a typical project's `.journal/` stays well under 1 MB.

## Security

`.journal/STATE.md` is treated as **untrusted input** on session resume. The `SessionStart` hook wraps the snapshot in `<silex-resume-untrusted>...</silex-resume-untrusted>` tags, and the skill body instructs the assistant to refuse any imperative content found inside. This means:

- Cloning a public repository that contains a `.journal/` is safe — the boundary is enforced and any prompt-injection payload in `STATE.md` is rejected.
- The `.journal/` folder is automatically added to your project's `.gitignore` on bootstrap, so journals never ship to remotes by default.
- Error strings and stack traces are scrubbed for credential patterns (`api_key`, `token`, `password`, `bearer`, `ghp_*`, `aws_*`) before being written to disk.
- You should still review an unfamiliar `.journal/STATE.md` before resuming if you do not trust the source of the repository.

silex itself never sends data anywhere. Everything stays on your local disk.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) with `SessionStart` hook support.
- Knowledge of where your Claude Code `settings.json` lives (the Claude Code docs cover OS-specific locations).
- For the **git clone** install path: `git`.
- For the **npx** install path: Node.js 14+ and `npm`.

## Install

Pick **one** of the install paths below. All four land the skill in your Claude Code config.

### Option A — Claude Code plugin (Recommended, one slash command)

Inside any Claude Code session, run:

```
/plugin marketplace add ojesusmp/Silex
/plugin install silex@silex
```

Claude Code pulls the repository, registers the plugin, and the `silex` skill becomes available immediately. To update later, run `/plugin update silex` from inside Claude Code.

### Option B — `git clone` (raw skill install, no Node required)

Clone the repo elsewhere, then place the skill content into your Claude Code skills folder.

Linux / macOS (symlink):

```bash
git clone https://github.com/ojesusmp/Silex.git ~/silex-repo
ln -s ~/silex-repo/skills/silex ~/.claude/skills/silex
```

Windows PowerShell (copy):

```powershell
git clone https://github.com/ojesusmp/Silex.git $env:USERPROFILE\silex-repo
Copy-Item -Recurse "$env:USERPROFILE\silex-repo\skills\silex" "$env:USERPROFILE\.claude\skills\silex"
```

To update later: `git pull` inside the cloned folder, then refresh the symlink (Linux/macOS) or re-copy (Windows).

### Option C — `npx` (cross-platform, one command, raw skill install)

```bash
npx @ojesusmp/silex
```

Works on Linux, macOS, and Windows as long as Node + npm are installed. Installs the skill content into `~/.claude/skills/silex/`.

To update later: re-run the same command — `npx` always fetches the latest published version.

### Option D — manual

Download a release ZIP from the [GitHub repository](https://github.com/ojesusmp/Silex), copy the contents of its `skills/silex/` directory into `~/.claude/skills/silex/` (Linux / macOS) or `%USERPROFILE%\.claude\skills\silex\` (Windows).

---

After any install path:

1. Add the `SessionStart` hook from [`skills/silex/hooks/session-start.md`](skills/silex/hooks/session-start.md) to your Claude Code `settings.json`. Three variants are provided — pick the one matching your shell.
2. Restart your Claude Code session.
3. In any project, type `silex` or `/silex` once. silex asks consent before creating `.journal/` and adding it to `.gitignore`.

That is the entire installation. No daemon, no database, no `PostToolUse` hooks.

## Use

Useful commands:

| Command | Effect |
|---------|--------|
| `silex` or `/silex` | Bootstrap or status |
| `/silex audit` | Scan recent tool calls for drift; catch up missed entries |
| `/silex mark <label>` | Append a milestone to `INDEX.md` |
| `/silex resume` or `resume journal` | Reload `STATE.md` and continue |
| `/silex log <text>` | Manual free-form append |
| `/silex glyph add <char>=<meaning>` | Extend `GLYPH.md` |

## File layout

```
<project-root>/.journal/
├── timeline.jsonl   # append-only events (one JSON per line)
├── STATE.md         # live snapshot (overwritten per append, atomic)
├── GLYPH.md         # shorthand dictionary
└── INDEX.md         # milestones (manual /silex mark)
```

## Event format

```jsonc
{"t":"2026-05-09T14:32:01Z","a":"E","f":"src/auth.ts:42","r":"✓","w":"null check"}
{"t":"2026-05-09T14:33:45Z","a":"T","r":"✓","ms":840,"tag":"unit"}
{"t":"2026-05-09T14:35:10Z","a":"W","f":"src/db.ts","e":"EPERM","fix":"chmod 644"}
```

See [SKILL.md](skills/silex/SKILL.md) for the full schema, glyph dictionary, append protocol, runtime governance, and edge-case handling.

## Per-turn receipt

Every assistant turn ends with one of:

```
📓 jrn +2 │ E src/x.ts │ T 12/12        ← wrote 2 entries
📓 jrn +0 │ skip: read-only lookups       ← nothing to log
📓 jrn ⚠ +0 │ MISSED — catching up        ← self-flag, recovers next turn
```

If you ever see `MISSED` and no recovery on the following turn, run `/silex audit`.

## Failure modes (user-facing)

| Symptom | What happened | What to do |
|---------|---------------|------------|
| `📓 jrn ⚠ MISSED` repeats over multiple turns | Skill drifted on appends | Run `/silex audit` |
| No `📓 jrn …` footer at all | Skill not engaging | Type `silex` once to force-load |
| Wrong project resumed | Nested `.journal/` confusion | Run `/silex init` at the correct project root |
| `timeline.jsonl` grew very large | Rotation did not trigger | Rename manually to `timeline-<date>.jsonl`; silex will start fresh on next append |
| `STATE.md` looks out of date | Crash before the snapshot rewrite | Next append rebuilds it from the timeline tail |
| `STATE.md.tmp` left over after a crash | Atomic-rename interrupted | silex deletes it on the next session start |

## Contributing

Issues and pull requests are welcome at <https://github.com/ojesusmp/Silex/issues>. The design rationale lives in [SKILL.md](skills/silex/SKILL.md). The skill is intentionally minimal — feature requests should be checked against the "What silex does NOT do" section of `SKILL.md` first.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Credits

Created by [@ojesusmp](https://github.com/ojesusmp).
Repository: <https://github.com/ojesusmp/Silex>

## License

MIT. See [LICENSE](LICENSE).
