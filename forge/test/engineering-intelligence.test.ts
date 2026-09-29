import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-engineering-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Engineering Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await fs.access(path.join(cwd, ".forge", "intelligence", "ENGINEERING.md"));
  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/ENGINEERING.md"));
});

test("planner keeps Engineering Intelligence on implementation-capable work", async (context) => {
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
    assert.ok(plan.capabilities.some((item) => item.capability === "engineering"), task);
    assert.ok(plan.steps.some((step) => step.id === "implement" && step.capability === "engineering"), task);
  }
});

test("planner does not add Engineering Intelligence to non-implementation work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const documentation = await createPlan(cwd, "Update README wording");
  const research = await createPlan(cwd, "Research competitors for the clinic product");

  assert.equal(documentation.capabilities.some((item) => item.capability === "engineering"), false);
  assert.equal(research.capabilities.some((item) => item.capability === "engineering"), false);
  assert.equal(documentation.steps.some((step) => step.id === "implement"), false);
  assert.equal(research.steps.some((step) => step.id === "implement"), false);
});

test("prepare includes Engineering Intelligence only when engineering is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const reference = ".forge/intelligence/ENGINEERING.md";

  const feature = await prepareWorkPacket(cwd, "Add account recovery workflow and API endpoint");
  const bug = await prepareWorkPacket(cwd, "Fix broken account status update");
  const refactor = await prepareWorkPacket(cwd, "Refactor account module dependencies");
  const security = await prepareWorkPacket(cwd, "Implement OAuth authentication for admin accounts");
  const infrastructure = await prepareWorkPacket(cwd, "Update the Terraform network configuration");
  const documentation = await prepareWorkPacket(cwd, "Update README wording");
  const research = await prepareWorkPacket(cwd, "Research competitors for the clinic product");

  for (const packet of [feature, bug, refactor, security, infrastructure]) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "engineering"));
    assert.ok(packet.frameworkReferences.includes(reference));
  }

  for (const packet of [documentation, research]) {
    assert.equal(packet.plan.capabilities.some((item) => item.capability === "engineering"), false);
    assert.equal(packet.frameworkReferences.includes(reference), false);
  }
});

test("prepare includes bounded technical implementation context for Engineering Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Fix broken account status update");

  assert.ok(Object.hasOwn(packet.projectContext, "technical.stack"));
  assert.ok(Object.hasOwn(packet.projectContext, "technical.integrations"));
  assert.ok(Object.hasOwn(packet.projectContext, "technical.constraints"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
});
