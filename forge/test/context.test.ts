import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getPath, showContext, updateContext } from "../src/context.js";
import { initProject } from "../src/init.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-context-"));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });
  return cwd;
}

test("context reads and updates allowlisted project fields", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const initial = await showContext(cwd);
  assert.equal(getPath(initial.context, "project.name"), path.basename(cwd));

  const updated = await updateContext(cwd, "product.problem", "Teams lose project context between AI sessions.");
  assert.equal(getPath(updated.context, "product.problem"), "Teams lose project context between AI sessions.");
  assert.equal(getPath(updated.context, "forge.last_updated"), new Date().toISOString().slice(0, 10));
});

test("context rejects fields outside the safe scalar allowlist", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await assert.rejects(
    updateContext(cwd, "forge.active_modules", "security"),
    /not editable through the CLI/,
  );
});
