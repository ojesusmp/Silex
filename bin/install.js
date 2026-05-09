#!/usr/bin/env node
/**
 * silex installer.
 *
 * Copies the bundled skill files into the user's Claude Code skills directory:
 *   <homedir>/.claude/skills/silex/
 *
 * Cross-platform: reads os.homedir() so the same script works on Linux, macOS,
 * and Windows. No personal paths embedded.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const PKG_ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(os.homedir(), ".claude", "skills", "silex");

const ITEMS = [
  "SKILL.md",
  "README.md",
  "LICENSE",
  "templates",
  "examples",
  "hooks",
];

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

function main() {
  console.log("silex installer");
  console.log("  source : " + PKG_ROOT);
  console.log("  target : " + TARGET);

  const existed = fs.existsSync(TARGET);
  if (existed) {
    console.log("\n  target already exists — overwriting skill files (your .journal/ folders in projects are NOT touched).");
  }

  fs.mkdirSync(TARGET, { recursive: true });

  let copied = 0;
  for (const item of ITEMS) {
    const src = path.join(PKG_ROOT, item);
    const dest = path.join(TARGET, item);
    if (fs.existsSync(src)) {
      copyRecursive(src, dest);
      console.log("  copied " + item);
      copied++;
    }
  }

  console.log("\nsilex installed (" + copied + " items) at " + TARGET);
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
