import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-git-delivery-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Git Delivery Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const file = path.join(cwd, ".forge", "intelligence", "GIT_DELIVERY.md");
  await fs.access(file);
  const content = await fs.readFile(file, "utf8");
  assert.match(content, /\.forge\/workflows\/GIT\.md/);
  assert.match(content, /Provenance Intelligence/);

  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/GIT_DELIVERY.md"));
});

test("planner activates Git Delivery Intelligence for governed work without adding a task kind", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const tasks = [
    "Update README wording",
    "Research competitors for the clinic product",
    "Add audit API endpoint for incident history",
    "Fix failing incident status update",
    "Update the Terraform network configuration",
    "Implement OAuth authentication for payment accounts",
  ];

  for (const task of tasks) {
    const plan = await createPlan(cwd, task);
    const matches = plan.capabilities.filter((item) => item.capability === "git-delivery");
    assert.equal(matches.length, 1, task);
    assert.ok(plan.steps.some((step) => step.id === "review-delivery" && step.capability === "git-delivery"), task);
    assert.ok(plan.steps.some((step) => step.id === "deliver" && step.capability === "git-delivery"), task);
  }
});

test("Git delivery review happens before verification and delivery execution", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const plan = await createPlan(cwd, "Add audit API endpoint for incident history");
  const ids = plan.steps.map((step) => step.id);

  assert.ok(ids.indexOf("review-delivery") > -1);
  assert.ok(ids.indexOf("verify") > ids.indexOf("review-delivery"));
  assert.ok(ids.indexOf("deliver") > ids.indexOf("verify"));
});

test("prepare includes Git Delivery Intelligence and procedural Git workflow", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packets = [
    await prepareWorkPacket(cwd, "Update README wording"),
    await prepareWorkPacket(cwd, "Research competitors for the clinic product"),
    await prepareWorkPacket(cwd, "Add audit API endpoint for incident history"),
  ];

  for (const packet of packets) {
    assert.ok(packet.plan.capabilities.some((item) => item.capability === "git-delivery"));
    assert.ok(packet.frameworkReferences.includes(".forge/intelligence/GIT_DELIVERY.md"));
    assert.ok(packet.frameworkReferences.includes(".forge/workflows/GIT.md"));
    assert.ok(packet.frameworkReferences.includes(".forge/intelligence/README.md"));
  }
});

test("Git Delivery Intelligence does not broaden bounded project context", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Update README wording");
  const keys = Object.keys(packet.projectContext);

  assert.ok(keys.includes("project.name"));
  assert.ok(keys.includes("project.status"));
  assert.ok(keys.includes("branding.product_identity"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
  assert.equal(keys.some((key) => key.startsWith("git.")), false);
});
