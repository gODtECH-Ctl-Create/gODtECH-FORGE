import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { doctorProject } from "../src/doctor.js";

test("doctor reports an uninitialized directory without crashing", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-doctor-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const report = doctorProject(cwd);
  assert.equal(report.ok, true);
  assert.equal(report.diagnostics.find((item) => item.id === "forge")?.level, "warning");
});
