import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-security-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Security Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await fs.access(path.join(cwd, ".forge", "intelligence", "SECURITY.md"));
  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/SECURITY.md"));
});

test("planner keeps Security Intelligence on security-sensitive work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const tasks = [
    "Implement OAuth authentication for admin accounts",
    "Add permission checks for tenant billing records",
    "Rotate API credentials without downtime",
    "Encrypt personal data before storing it",
    "Add passwordless account recovery",
  ];

  for (const task of tasks) {
    const plan = await createPlan(cwd, task);
    assert.ok(plan.capabilities.some((item) => item.capability === "security"), task);
    assert.ok(plan.steps.some((step) => step.id === "review-security" && step.capability === "security"), task);
  }
});

test("planner does not add Security Intelligence to non-security lightweight work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const documentation = await createPlan(cwd, "Update README wording");
  const research = await createPlan(cwd, "Research competitors for the clinic product");
  const ui = await createPlan(cwd, "Change dashboard spacing and button layout");

  for (const plan of [documentation, research, ui]) {
    assert.equal(plan.capabilities.some((item) => item.capability === "security"), false);
    assert.equal(plan.steps.some((step) => step.id === "review-security"), false);
  }
});

test("prepare includes Security Intelligence only when security is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const reference = ".forge/intelligence/SECURITY.md";

  const auth = await prepareWorkPacket(cwd, "Implement OAuth authentication for admin accounts");
  const permission = await prepareWorkPacket(cwd, "Add permission checks for tenant billing records");
  const credentials = await prepareWorkPacket(cwd, "Rotate API credentials without downtime");
  const documentation = await prepareWorkPacket(cwd, "Update README wording");
  const research = await prepareWorkPacket(cwd, "Research competitors for the clinic product");

  for (const packet of [auth, permission, credentials]) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "security"));
    assert.ok(packet.frameworkReferences.includes(reference));
  }

  for (const packet of [documentation, research]) {
    assert.equal(packet.plan.capabilities.some((item) => item.capability === "security"), false);
    assert.equal(packet.frameworkReferences.includes(reference), false);
  }
});

test("prepare includes bounded security context for Security Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Implement OAuth authentication for admin accounts");

  assert.ok(Object.hasOwn(packet.projectContext, "security.risk_level"));
  assert.ok(Object.hasOwn(packet.projectContext, "security.sensitive_data"));
  assert.ok(Object.hasOwn(packet.projectContext, "security.compliance_requirements"));
  assert.ok(Object.hasOwn(packet.projectContext, "technical.architecture"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
});
