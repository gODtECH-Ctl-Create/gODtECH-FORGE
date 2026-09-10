import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { validateProject } from "../src/validate.js";

test("validate accepts a freshly initialized project", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-validate-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });

  const report = await validateProject(cwd);
  assert.equal(report.diagnostics.some((item) => item.level === "error"), false);
  assert.equal(report.ok, true);
});

test("validate rejects an empty project name", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-validate-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });

  const contextPath = path.join(cwd, ".forge", "context", "project.yaml");
  const source = await fs.readFile(contextPath, "utf8");
  await fs.writeFile(contextPath, source.replace(/name: "[^"]+"/, 'name: ""'), "utf8");

  const report = await validateProject(cwd);
  assert.equal(report.ok, false);
  assert.equal(report.diagnostics.find((item) => item.id === "context:name")?.level, "error");
});
