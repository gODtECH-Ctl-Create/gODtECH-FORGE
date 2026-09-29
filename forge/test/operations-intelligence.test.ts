import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-operations-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Operations Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await fs.access(path.join(cwd, ".forge", "intelligence", "OPERATIONS.md"));
  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/OPERATIONS.md"));
});

test("planner activates Operations Intelligence for infrastructure, production, and explicit operational work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const tasks = [
    "Update the Terraform network configuration",
    "Deploy the API to production",
    "Add observability metrics and alerts for the worker queue",
    "Create a rollback runbook for failed releases",
    "Add readiness and liveness health checks",
    "Implement backup and restore checks for the database",
  ];

  for (const task of tasks) {
    const plan = await createPlan(cwd, task);
    assert.ok(plan.capabilities.some((item) => item.capability === "operations"), task);
    assert.ok(plan.steps.some((step) => step.id === "review-operations" && step.capability === "operations"), task);
  }

  const production = await createPlan(cwd, "Deploy the API to production");
  assert.equal(production.risk, "high");
  assert.ok(production.approvals.some((item) => item.id === "approve-production-impact"));
  assert.ok(production.approvals.some((item) => item.id === "approve-risk-plan"));
});

test("planner does not add Operations Intelligence to lightweight non-operational work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const documentation = await createPlan(cwd, "Update README wording");
  const research = await createPlan(cwd, "Research competitors for the clinic product");
  const bug = await createPlan(cwd, "Fix validation error in the profile form");

  for (const plan of [documentation, research, bug]) {
    assert.equal(plan.capabilities.some((item) => item.capability === "operations"), false);
    assert.equal(plan.steps.some((step) => step.id === "review-operations"), false);
  }
});

test("prepare includes Operations Intelligence only when operations is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const reference = ".forge/intelligence/OPERATIONS.md";

  const infrastructure = await prepareWorkPacket(cwd, "Update the Kubernetes deployment strategy");
  const production = await prepareWorkPacket(cwd, "Deploy the API to production");
  const observability = await prepareWorkPacket(cwd, "Add observability metrics and alerts for the worker queue");
  const documentation = await prepareWorkPacket(cwd, "Update README wording");
  const bug = await prepareWorkPacket(cwd, "Fix validation error in the profile form");

  for (const packet of [infrastructure, production, observability]) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "operations"));
    assert.ok(packet.frameworkReferences.includes(reference));
  }

  for (const packet of [documentation, bug]) {
    assert.equal(packet.plan.capabilities.some((item) => item.capability === "operations"), false);
    assert.equal(packet.frameworkReferences.includes(reference), false);
  }
});

test("prepare includes bounded operations context for Operations Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Update the Kubernetes deployment strategy");

  assert.ok(Object.hasOwn(packet.projectContext, "operations.deployment_target"));
  assert.ok(Object.hasOwn(packet.projectContext, "operations.environments"));
  assert.ok(Object.hasOwn(packet.projectContext, "operations.observability_requirements"));
  assert.ok(Object.hasOwn(packet.projectContext, "technical.architecture"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
});
