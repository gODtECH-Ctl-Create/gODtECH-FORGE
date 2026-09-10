import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { updateContext } from "../src/context.js";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-plan-"));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });
  return cwd;
}

test("planner keeps documentation work lightweight", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const plan = await createPlan(cwd, "Update README wording");
  assert.equal(plan.taskKind, "documentation");
  assert.equal(plan.risk, "low");
  assert.equal(plan.workflow, "lightweight-delivery");
  assert.equal(plan.approvals.length, 0);
  assert.equal(plan.capabilities.some((item) => item.capability === "security"), false);
});

test("planner escalates identity and payment work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const plan = await createPlan(cwd, "Implement OAuth authentication for payment accounts");
  assert.equal(plan.taskKind, "security");
  assert.equal(plan.risk, "high");
  assert.equal(plan.workflow, "secure-delivery");
  assert.ok(plan.capabilities.some((item) => item.capability === "security"));
  assert.ok(plan.approvals.some((item) => item.id === "approve-risk-plan"));
});

test("planner requires explicit approval for destructive production work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const plan = await createPlan(cwd, "Drop table in production");
  assert.equal(plan.risk, "critical");
  assert.ok(plan.approvals.some((item) => item.id === "approve-production-impact"));
  assert.ok(plan.approvals.some((item) => item.id === "approve-destructive-operation"));
});

test("planner respects the project's high-risk baseline", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await updateContext(cwd, "security.risk_level", "high");

  const plan = await createPlan(cwd, "Update the Terraform network configuration");
  assert.equal(plan.taskKind, "infrastructure");
  assert.equal(plan.risk, "high");
  assert.ok(plan.signals.some((signal) => signal.includes("high security-risk baseline")));
});
