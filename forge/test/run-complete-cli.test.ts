import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { stringify } from "yaml";
import { initProject } from "../src/init.js";
import { startWorkflowRun } from "../src/workflow-run.js";

function completeViaCli(cwd: string, id: string, evidenceFile: string) {
  return spawnSync(
    process.execPath,
    [
      path.resolve("dist/src/cli.js"),
      "run",
      "complete",
      "--id",
      id,
      "--evidence-file",
      evidenceFile,
      "--cwd",
      cwd,
      "--json",
    ],
    { cwd: path.resolve("."), encoding: "utf8", shell: false },
  );
}

test("run complete accepts YAML and JSON evidence files", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-run-complete-cli-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });

  for (const extension of ["yaml", "json"]) {
    const run = await startWorkflowRun(cwd, "Update README wording", {
      id: `cli-${extension}`,
      now: new Date("2026-09-10T15:00:00Z"),
    });
    const evidence = Object.fromEntries(
      run.plan.steps.map((step) => [step.id, `Evidence for ${step.id}`]),
    );
    const file = path.join(cwd, `evidence.${extension}`);
    await fs.writeFile(
      file,
      extension === "json" ? JSON.stringify(evidence, null, 2) : stringify(evidence),
      "utf8",
    );

    const result = completeViaCli(cwd, run.id, file);
    assert.equal(result.status, 0, result.stderr);
    const completed = JSON.parse(result.stdout) as { status: string; completedSteps: unknown[] };
    assert.equal(completed.status, "completed");
    assert.equal(completed.completedSteps.length, run.plan.steps.length);
  }
});
