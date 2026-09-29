import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-documentation-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Documentation Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  await fs.access(path.join(cwd, ".forge", "intelligence", "DOCUMENTATION.md"));
  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/DOCUMENTATION.md"));
});

test("planner adds documentation review when documentation capability is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const documentation = await createPlan(cwd, "Update README wording");
  const research = await createPlan(cwd, "Research competitors for the clinic product");

  for (const plan of [documentation, research]) {
    assert.ok(plan.capabilities.some((item) => item.capability === "documentation"));
    assert.ok(plan.steps.some((step) => step.id === "review-documentation" && step.capability === "documentation"));
  }
});

test("planner does not add Documentation Intelligence to unrelated implementation work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const feature = await createPlan(cwd, "Add audit API endpoint for incident history");
  const bug = await createPlan(cwd, "Fix validation error in the profile form");
  const infrastructure = await createPlan(cwd, "Update the Terraform network configuration");

  for (const plan of [feature, bug, infrastructure]) {
    assert.equal(plan.capabilities.some((item) => item.capability === "documentation"), false);
    assert.equal(plan.steps.some((step) => step.id === "review-documentation"), false);
  }
});

test("prepare includes Documentation Intelligence only when documentation is active", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  const reference = ".forge/intelligence/DOCUMENTATION.md";

  const documentation = await prepareWorkPacket(cwd, "Update README wording");
  const research = await prepareWorkPacket(cwd, "Research competitors for the clinic product");
  const feature = await prepareWorkPacket(cwd, "Add audit API endpoint for incident history");
  const bug = await prepareWorkPacket(cwd, "Fix validation error in the profile form");

  for (const packet of [documentation, research]) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "documentation"));
    assert.ok(packet.frameworkReferences.includes(reference));
    assert.ok(packet.frameworkReferences.includes(".forge/intelligence/README.md"));
    assert.ok(packet.frameworkReferences.includes(".forge/workflows/README-GENERATION.md"));
  }

  for (const packet of [feature, bug]) {
    assert.equal(packet.plan.capabilities.some((item) => item.capability === "documentation"), false);
    assert.equal(packet.frameworkReferences.includes(reference), false);
  }
});

test("prepare includes bounded documentation context", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Update README wording");

  assert.ok(Object.hasOwn(packet.projectContext, "project.name"));
  assert.ok(Object.hasOwn(packet.projectContext, "project.status"));
  assert.ok(Object.hasOwn(packet.projectContext, "product.problem"));
  assert.ok(Object.hasOwn(packet.projectContext, "branding.product_identity"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
});
