import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { prepareWorkPacket } from "../src/preflight.js";

const STATIC_INTELLIGENCE_MODULES = [
  ".forge/intelligence/PRODUCT.md",
  ".forge/intelligence/MARKET.md",
  ".forge/intelligence/RESEARCH.md",
  ".forge/intelligence/ARCHITECTURE.md",
  ".forge/intelligence/DESIGN.md",
  ".forge/intelligence/ENGINEERING.md",
  ".forge/intelligence/SECURITY.md",
  ".forge/intelligence/QUALITY.md",
  ".forge/intelligence/OPERATIONS.md",
  ".forge/intelligence/DOCUMENTATION.md",
  ".forge/intelligence/GIT_DELIVERY.md",
  ".forge/intelligence/PROVENANCE.md",
] as const;

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-intelligence-phase-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("clean initialization ships the complete static Intelligence module set", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  for (const modulePath of STATIC_INTELLIGENCE_MODULES) {
    await fs.access(path.join(cwd, modulePath));
  }

  const installed = (await fs.readdir(path.join(cwd, ".forge", "intelligence")))
    .filter((name) => name !== "README.md")
    .map((name) => `.forge/intelligence/${name}`)
    .sort();
  assert.deepEqual(installed, [...STATIC_INTELLIGENCE_MODULES].sort());
});

test("representative prepared work covers every completed static Intelligence mapping", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const tasks = [
    "Research competitors and market feasibility for a new clinic product",
    "Add audit API endpoint for incident history",
    "Redesign the checkout form for responsive accessibility",
    "Implement OAuth authentication for customer accounts",
    "Add backup restore monitoring and rollback for production deployment",
    "Update FORGE attribution and .forge/manifest.yaml version provenance",
  ];

  const selected = new Set<string>();
  for (const task of tasks) {
    const packet = await prepareWorkPacket(cwd, task);
    for (const reference of packet.frameworkReferences) selected.add(reference);
  }

  for (const modulePath of STATIC_INTELLIGENCE_MODULES) {
    assert.ok(selected.has(modulePath), `Expected representative plans to select ${modulePath}`);
  }
});

test("phase closure preserves selective Intelligence loading", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Fix failing incident status update");
  const selectedModules = packet.frameworkReferences.filter((reference) =>
    reference.startsWith(".forge/intelligence/") && reference !== ".forge/intelligence/README.md"
  );

  assert.deepEqual(selectedModules.sort(), [
    ".forge/intelligence/ENGINEERING.md",
    ".forge/intelligence/GIT_DELIVERY.md",
    ".forge/intelligence/QUALITY.md",
  ]);
});
