# SessionStart hook

Do not copy a shell snippet manually. Run `npx github:ojesusmp/Silex install --target codex`, `npx github:ojesusmp/Silex install --target claude`, or `npx github:ojesusmp/Silex install --target both`.

The installer preserves the existing JSON document and unrelated hook arrays, removes only earlier Silex managed entries (including its legacy raw-state reader), and adds current marked lifecycle entries. Each entry invokes the absolute installed runtime with `--provider codex` or `--provider claude`:

```text
node <provider-home>/silex/bin/silex.js hook SessionStart --provider <provider> --managed-by=silex-v2
```

The runtime loads allowlisted fields from `.journal/STATE.json`, revalidates and bounds them, and emits JSON inside `<silex-resume-untrusted>` tags. It never reads or prints raw `.journal/STATE.md`.

Verify with `npx github:ojesusmp/Silex doctor --target <provider>`. Remove with `npx github:ojesusmp/Silex uninstall --target <provider>`; unrelated hooks remain unchanged.
