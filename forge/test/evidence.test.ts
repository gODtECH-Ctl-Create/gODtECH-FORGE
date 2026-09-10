import { strict as assert } from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const evidenceRoot = join(root, 'forge', 'evidence');

assert.ok(existsSync(join(evidenceRoot, 'README.md')), 'Evidence README is missing');
assert.ok(existsSync(join(evidenceRoot, 'protocol.md')), 'Benchmark protocol is missing');
assert.ok(existsSync(join(evidenceRoot, 'result.schema.json')), 'Result schema is missing');

const protocol = readFileSync(join(evidenceRoot, 'protocol.md'), 'utf8');
const normalizedProtocol = protocol.toLowerCase();
for (const required of ['same base commit', 'provider billing telemetry', 'Publication checklist']) {
  assert.ok(normalizedProtocol.includes(required.toLowerCase()), `Protocol is missing required guardrail: ${required}`);
}

const tasksDir = join(evidenceRoot, 'tasks');
const taskFiles = readdirSync(tasksDir).filter((file) => file.endsWith('.md')).sort();
assert.deepEqual(taskFiles, [
  'deployguard-dg-bm-002.md',
  'deployguard-dg-bm-003.md',
  'deployguard-dg-bm-004.md',
  'deployguard-dg-bm-005.md'
]);

for (const file of taskFiles) {
  const content = readFileSync(join(tasksDir, file), 'utf8');
  assert.match(content, /Status: planned/);
  assert.ok(content.includes('## Acceptance criteria'), `${file} must name acceptance criteria`);
}

const pilot = JSON.parse(readFileSync(join(evidenceRoot, 'results', 'dg-bm-001.json'), 'utf8'));
assert.equal(pilot.benchmark_id, 'DG-BM-001');
assert.equal(pilot.controlled, false);
assert.equal(pilot.runs.control.unique_files_inspected, 7);
assert.equal(pilot.runs.forge_assisted.unique_files_inspected, 5);
assert.equal(pilot.runs.forge_assisted.forge_metrics.estimated_context_reduction_percent, 74.7);
assert.equal(pilot.runs.control.provider_billing, null);
assert.ok(
  pilot.claim_boundaries.some((boundary: string) => boundary.includes('not a provider-token or credit-savings claim')),
  'Pilot result must preserve the credit-savings boundary'
);
