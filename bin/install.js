#!/usr/bin/env node
/**
 * silex installer.
 *
 * Copies the bundled skill content from the package's `skills/silex/` directory
 * into the user's Claude Code skills folder:
 *   <homedir>/.claude/skills/silex/
 *
 * Cross-platform: reads os.homedir() so the same script works on Linux, macOS,
 * and Windows. No personal paths embedded.
 *
 * Note: This is the raw-skill install path. Users who prefer the plugin path
 * can run `/plugin install ojesusmp/Silex` inside Claude Code instead.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const PKG_ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(PKG_ROOT, "skills", "silex");
const TARGET = path.join(os.homedir(), ".claude", "skills", "silex");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (fs.statSync(p).isDirectory()) n += countFiles(p);
    else n++;
  }
  return n;
}

function main() {
  console.log("silex installer");
  console.log("  source : " + SOURCE);
  console.log("  target : " + TARGET);

  if (!fs.existsSync(SOURCE)) {
    console.error("\nsilex installer failed: skill source missing at " + SOURCE);
    console.error("This usually means the package was packed incorrectly. Please file an issue at https://github.com/ojesusmp/Silex/issues.");
    process.exit(1);
  }

  const existed = fs.existsSync(TARGET);
  if (existed) {
    console.log("\n  target already exists — overwriting skill files (your .journal/ folders in projects are NOT touched).");
  }

  fs.mkdirSync(TARGET, { recursive: true });
  copyRecursive(SOURCE, TARGET);

  const fileCount = countFiles(TARGET);
  console.log("\nsilex installed (" + fileCount + " files) at " + TARGET);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Add the SessionStart hook from hooks/session-start.md to your Claude Code settings.json.");
  console.log("     Pick the variant matching your shell (POSIX, PowerShell, or Node).");
  console.log("  2. Restart Claude Code.");
  console.log("  3. In any project, type 'silex' or '/silex' once. silex asks consent before creating .journal/.");
  console.log("");
  console.log("Docs: https://github.com/ojesusmp/Silex");
}

try {
  main();
} catch (err) {
  console.error("silex installer failed: " + err.message);
  process.exit(1);
}
