import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-quality-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Quality Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await fs.access(path.join(cwd, ".forge", "intelligence", "QUALITY.md"));
  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/QUALITY.md"));
});

test("planner keeps Quality Intelligence on implementation work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const tasks = [
    "Add account recovery workflow and API endpoint",
    "Fix broken account status update",
    "Refactor account module dependencies",
    "Implement OAuth authentication for admin accounts",
    "Update the Terraform network configuration",
  ];

  for (const task of tasks) {
    const plan = await createPlan(cwd, task);
    assert.ok(plan.capabilities.some((item) => item.capability === "quality"), task);
    assert.ok(plan.steps.some((step) => step.id === "test" && step.capability === "quality"), task);
    assert.ok(plan.steps.some((step) => step.id === "verify" && step.capability === "verification"), task);
    assert.ok(plan.steps.findIndex((step) => step.id === "test") < plan.steps.findIndex((step) => step.id === "verify"), task);
  }
});

test("planner does not add Quality Intelligence to lightweight documentation or research work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const documentation = await createPlan(cwd, "Update README wording");
  const research = await createPlan(cwd, "Research competitors for the clinic product");

  for (const plan of [documentation, research]) {
    assert.equal(plan.capabilities.some((item) => item.capability === "quality"), false);
    assert.equal(plan.steps.some((step) => step.id === "test"), false);
    assert.ok(plan.steps.some((step) => step.id === "verify" && step.capability === "verification"));
  }
});

test("prepare includes Quality Intelligence only when quality is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const reference = ".forge/intelligence/QUALITY.md";

  const feature = await prepareWorkPacket(cwd, "Add account recovery workflow and API endpoint");
  const bug = await prepareWorkPacket(cwd, "Fix broken account status update");
  const refactor = await prepareWorkPacket(cwd, "Refactor account module dependencies");
  const security = await prepareWorkPacket(cwd, "Implement OAuth authentication for admin accounts");
  const infrastructure = await prepareWorkPacket(cwd, "Update the Terraform network configuration");
  const documentation = await prepareWorkPacket(cwd, "Update README wording");
  const research = await prepareWorkPacket(cwd, "Research competitors for the clinic product");

  for (const packet of [feature, bug, refactor, security, infrastructure]) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "quality"));
    assert.ok(packet.frameworkReferences.includes(reference));
  }

  for (const packet of [documentation, research]) {
    assert.equal(packet.plan.capabilities.some((item) => item.capability === "quality"), false);
    assert.equal(packet.frameworkReferences.includes(reference), false);
  }
});

test("Quality Intelligence reuses bounded context selected by the active plan", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const feature = await prepareWorkPacket(cwd, "Add account recovery workflow and API endpoint");
  const security = await prepareWorkPacket(cwd, "Implement OAuth authentication for admin accounts");
  const infrastructure = await prepareWorkPacket(cwd, "Update the Terraform network configuration");

  assert.ok(Object.hasOwn(feature.projectContext, "technical.stack"));
  assert.ok(Object.hasOwn(feature.projectContext, "technical.constraints"));
  assert.ok(Object.hasOwn(security.projectContext, "security.sensitive_data"));
  assert.ok(Object.hasOwn(security.projectContext, "security.compliance_requirements"));
  assert.ok(Object.hasOwn(infrastructure.projectContext, "operations.deployment_target"));

  for (const packet of [feature, security, infrastructure]) {
    assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
  }
});
