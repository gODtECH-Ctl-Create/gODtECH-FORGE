import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import {
  advanceWorkflowRun,
  approveWorkflowRun,
  latestWorkflowRun,
  loadWorkflowRun,
  startWorkflowRun,
} from "../src/workflow-run.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-run-"));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });
  return cwd;
}

test("a low-risk workflow advances in plan order and completes", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  let run = await startWorkflowRun(cwd, "Update README wording", {
    id: "20260910T100000000Z-docs",
    now: new Date("2026-09-10T10:00:00Z"),
  });
  assert.equal(run.status, "in-progress");
  assert.equal((await latestWorkflowRun(cwd)).id, run.id);

  for (let index = 0; index < run.plan.steps.length; index += 1) {
    run = await advanceWorkflowRun(cwd, run.id, `Evidence for step ${index + 1}`, {
      now: new Date(`2026-09-10T10:0${index + 1}:00Z`),
    });
  }

  assert.equal(run.status, "completed");
  assert.deepEqual(run.completedSteps.map((item) => item.stepId), run.plan.steps.map((item) => item.id));
  await assert.rejects(advanceWorkflowRun(cwd, run.id, "extra evidence"), /already complete/);
});

test("a high-risk workflow waits for every human approval", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  let run = await startWorkflowRun(cwd, "Drop table in production", {
    id: "20260910T110000000Z-critical",
    now: new Date("2026-09-10T11:00:00Z"),
  });
  assert.equal(run.status, "awaiting-approval");
  assert.equal(run.approvals.length, 3);
  await assert.rejects(advanceWorkflowRun(cwd, run.id, "not allowed"), /requires approval/);
  await assert.rejects(approveWorkflowRun(cwd, run.id, "missing", "reviewer"), /not found/);

  for (const [index, checkpoint] of run.approvals.entries()) {
    run = await approveWorkflowRun(cwd, run.id, checkpoint.id, "release-owner", {
      now: new Date(`2026-09-10T11:0${index + 1}:00Z`),
    });
    assert.equal(run.status, index === run.approvals.length - 1 ? "in-progress" : "awaiting-approval");
  }

  await assert.rejects(
    approveWorkflowRun(cwd, run.id, run.approvals[0]!.id, "release-owner"),
    /already approved/,
  );
  const advanced = await advanceWorkflowRun(cwd, run.id, "Repository and context inspected.");
  assert.equal(advanced.completedSteps.length, 1);
});

test("status without an ID selects the newest run by creation time", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await startWorkflowRun(cwd, "Update docs", {
    id: "z-older",
    now: new Date("2026-09-10T09:00:00Z"),
  });
  await startWorkflowRun(cwd, "Fix typo", {
    id: "a-newer",
    now: new Date("2026-09-10T12:00:00Z"),
  });
  assert.equal((await latestWorkflowRun(cwd)).id, "a-newer");
});

test("run IDs and persisted transitions are validated", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await assert.rejects(startWorkflowRun(cwd, "Update docs", { id: "../escape" }), /Invalid workflow run ID/);
  const run = await startWorkflowRun(cwd, "Update docs", { id: "valid-run" });
  const file = path.join(cwd, ".forge", "runs", `${run.id}.yaml`);
  const source = await fs.readFile(file, "utf8");
  await fs.writeFile(file, source.replace("status: in-progress", "status: completed"), "utf8");
  await assert.rejects(loadWorkflowRun(cwd, run.id), /status is inconsistent/);
});
