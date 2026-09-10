import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { summarizeEfficiencyMetrics } from "../src/metrics.js";
import { prepareWorkPacket } from "../src/preflight.js";

test("metrics measure local preparation without retaining task or repository details", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-metrics-private-project-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd });

  const privateTask = "Fix confidential customer authentication incident";
  await prepareWorkPacket(cwd, privateTask, new Date("2026-09-10T10:00:00Z"));
  await prepareWorkPacket(cwd, privateTask, new Date("2026-09-10T10:01:00Z"));

  const report = await summarizeEfficiencyMetrics(cwd);
  assert.equal(report.events, 2);
  assert.equal(report.cacheHits, 1);
  assert.equal(report.cacheHitRate, 0.5);
  assert.equal(report.context.estimatedTokensAvoided >= 0, true);
  assert.equal(report.deterministicStepsCompleted, 10);
  assert.equal(report.malformedEvents, 0);

  const source = await fs.readFile(path.join(cwd, ".forge", "metrics", "prepare.jsonl"), "utf8");
  assert.equal(source.includes(privateTask), false);
  assert.equal(source.includes("forge-metrics-private-project"), false);
  assert.equal(source.includes("authentication incident"), false);
});

test("metrics ignore malformed local events and report the count", async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-metrics-malformed-"));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await initProject({ cwd });
  await fs.writeFile(path.join(cwd, ".forge", "metrics", "prepare.jsonl"), "not-json\n{}\n", "utf8");

  const report = await summarizeEfficiencyMetrics(cwd);
  assert.equal(report.events, 0);
  assert.equal(report.malformedEvents, 2);
  assert.ok(report.warnings.some((warning) => warning.includes("malformed")));
});
