import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";

async function temporaryProject(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "forge-init-"));
}

test("init supports dry-run without writing", async (context) => {
  const cwd = await temporaryProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const report = await initProject({ cwd, dryRun: true, now: new Date("2026-09-10T00:00:00Z") });
  assert.equal(report.ok, true);
  assert.ok(report.created.includes(".forge/manifest.yaml"));
  await assert.rejects(fs.access(path.join(cwd, ".forge", "manifest.yaml")));
});

test("init creates a usable framework and is idempotent", async (context) => {
  const cwd = await temporaryProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const first = await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });
  assert.equal(first.ok, true);
  assert.ok(first.created.includes("AGENTS.md"));
  assert.ok(first.created.includes(".forge/cache/.gitignore"));
  assert.ok(first.created.includes(".forge/metrics/.gitignore"));

  const second = await initProject({ cwd, now: new Date("2026-09-11T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.equal(second.conflicts.length, 0);
  assert.ok(second.preserved.includes(".forge/manifest.yaml"));
  assert.ok(second.unchanged.includes("AGENTS.md"));
});

test("init aborts atomically on a framework-file conflict", async (context) => {
  const cwd = await temporaryProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await fs.writeFile(path.join(cwd, "AGENTS.md"), "existing instructions\n", "utf8");

  const report = await initProject({ cwd });
  assert.equal(report.ok, false);
  assert.deepEqual(report.conflicts, ["AGENTS.md"]);
  await assert.rejects(fs.access(path.join(cwd, ".forge", "manifest.yaml")));
  assert.equal(await fs.readFile(path.join(cwd, "AGENTS.md"), "utf8"), "existing instructions\n");
});

test("force replaces framework-owned conflicts but preserves project context", async (context) => {
  const cwd = await temporaryProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd });
  const contextPath = path.join(cwd, ".forge", "context", "project.yaml");
  await fs.writeFile(contextPath, "project:\n  name: custom\n", "utf8");
  await fs.writeFile(path.join(cwd, "AGENTS.md"), "old\n", "utf8");

  const report = await initProject({ cwd, force: true });
  assert.equal(report.ok, true);
  assert.ok(report.updated.includes("AGENTS.md"));
  assert.ok(report.preserved.includes(".forge/context/project.yaml"));
  assert.equal(await fs.readFile(contextPath, "utf8"), "project:\n  name: custom\n");
});
