import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { createPlan } from "../src/planner.js";
import { prepareWorkPacket } from "../src/preflight.js";

async function initializedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-provenance-intelligence-"));
  await initProject({ cwd, now: new Date("2026-09-29T00:00:00Z") });
  return cwd;
}

test("init installs and preserves Provenance Intelligence", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const file = path.join(cwd, ".forge", "intelligence", "PROVENANCE.md");
  await fs.access(file);
  const content = await fs.readFile(file, "utf8");
  assert.match(content, /\.forge\/policies\/PROVENANCE\.md/);
  assert.match(content, /Git \/ Delivery Intelligence/);

  const second = await initProject({ cwd, now: new Date("2026-09-30T00:00:00Z") });
  assert.equal(second.ok, true);
  assert.ok(second.unchanged.includes(".forge/intelligence/PROVENANCE.md"));
});

test("planner activates Provenance Intelligence only for provenance-specific work", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const attribution = await createPlan(cwd, "Update FORGE provenance attribution in .forge/manifest.yaml");
  const release = await createPlan(cwd, "Record generated-by metadata and source traceability for release artifacts");
  const normalFeature = await createPlan(cwd, "Add audit API endpoint for incident history");
  const normalDocs = await createPlan(cwd, "Update README wording");

  for (const plan of [attribution, release]) {
    assert.ok(plan.capabilities.some((item) => item.capability === "provenance"));
    assert.ok(plan.signals.some((signal) => signal.includes("Provenance, attribution, or origin-traceability")));
    assert.ok(plan.steps.some((step) => step.id === "review-provenance" && step.capability === "provenance"));
  }

  assert.equal(normalFeature.capabilities.some((item) => item.capability === "provenance"), false);
  assert.equal(normalDocs.capabilities.some((item) => item.capability === "provenance"), false);
});

test("provenance review happens before delivery review and verification", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const plan = await createPlan(cwd, "Record artifact origin and attestation metadata for the release");
  const ids = plan.steps.map((step) => step.id);

  assert.ok(ids.indexOf("review-provenance") > -1);
  assert.ok(ids.indexOf("review-delivery") > ids.indexOf("review-provenance"));
  assert.ok(ids.indexOf("verify") > ids.indexOf("review-delivery"));
});

test("prepare selectively includes Provenance Intelligence and provenance policy", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const provenancePacket = await prepareWorkPacket(cwd, "Update attribution and evidence origin in .forge/manifest.yaml");
  const normalPacket = await prepareWorkPacket(cwd, "Fix failing incident status update");

  assert.ok(provenancePacket.plan.capabilities.some((item) => item.capability === "provenance"));
  assert.ok(provenancePacket.frameworkReferences.includes(".forge/intelligence/PROVENANCE.md"));
  assert.ok(provenancePacket.frameworkReferences.includes(".forge/policies/PROVENANCE.md"));
  assert.ok(provenancePacket.frameworkReferences.includes(".forge/intelligence/README.md"));

  assert.equal(normalPacket.plan.capabilities.some((item) => item.capability === "provenance"), false);
  assert.equal(normalPacket.frameworkReferences.includes(".forge/intelligence/PROVENANCE.md"), false);
});

test("Provenance Intelligence reuses bounded provenance context without exposing manifest contents", async (context) => {
  const cwd = await initializedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const packet = await prepareWorkPacket(cwd, "Correct stale provenance attribution in .forge/manifest.yaml");
  const keys = Object.keys(packet.projectContext);

  assert.ok(keys.includes("branding.forge_provenance"));
  assert.ok(keys.includes("project.name"));
  assert.ok(packet.preparation.selectedContextCharacters <= packet.preparation.maxContextCharacters);
  assert.equal(keys.some((key) => key.includes("manifest")), false);
  assert.equal(JSON.stringify(packet.projectContext).includes("initialized_at"), false);
});
