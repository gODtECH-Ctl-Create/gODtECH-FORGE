import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

test("implementation and bundled assets stay inside the forge folder", async () => {
  const repositoryRoot = process.cwd();
  for (const oldRoot of ["src", "test", "scripts", "docs", "FORGE-INTERNAL", ".forge", "cue.mod"]) {
    await assert.rejects(fs.access(path.join(repositoryRoot, oldRoot)));
  }

  for (const compactPath of [
    "forge/src",
    "forge/test",
    "forge/scripts",
    "forge/internal",
    "forge/framework/.forge",
    "forge/framework/.forge/cue.mod/module.cue",
    "forge/codex/plugins/forge/.codex-plugin/plugin.json",
    "forge/codex/.agents/plugins/marketplace.json",
    "forge/assets/readme/forge-hero.svg",
  ]) {
    await fs.access(path.join(repositoryRoot, compactPath));
  }
});
