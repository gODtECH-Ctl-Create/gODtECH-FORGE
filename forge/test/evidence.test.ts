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
  if (file === 'deployguard-dg-bm-002.md' || file === 'deployguard-dg-bm-003.md' || file === 'deployguard-dg-bm-004.md' || file === 'deployguard-dg-bm-005.md') {
    assert.match(content, /Status: exploratory complete/);
  } else {
    assert.match(content, /Status: planned/);
  }
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

const dgBm002 = JSON.parse(readFileSync(join(evidenceRoot, 'results', 'dg-bm-002.json'), 'utf8'));
assert.equal(dgBm002.benchmark_id, 'DG-BM-002');
assert.equal(dgBm002.status, 'exploratory');
assert.equal(dgBm002.controlled, false);
assert.equal(dgBm002.runs.forge_assisted.commit, 'e552e0e');
assert.equal(dgBm002.runs.control.verification[0].outcome, 'not_run');
assert.ok(
  dgBm002.claim_boundaries.some((boundary: string) => boundary.includes('No provider-token or credit-savings claim')),
  'DG-BM-002 result must preserve the credit-savings boundary'
);

const dgBm003 = JSON.parse(readFileSync(join(evidenceRoot, 'results', 'dg-bm-003.json'), 'utf8'));
assert.equal(dgBm003.benchmark_id, 'DG-BM-003');
assert.equal(dgBm003.status, 'exploratory');
assert.equal(dgBm003.controlled, false);
assert.equal(dgBm003.base_commit, 'e552e0e');
assert.equal(dgBm003.runs.forge_assisted.commit, 'd40758b');
assert.equal(dgBm003.runs.forge_assisted.failed_commands, 0);
assert.equal(dgBm003.runs.control.verification[0].outcome, 'not_run');
assert.ok(
  dgBm003.claim_boundaries.some((boundary: string) => boundary.includes('No provider-token or credit-savings claim')),
  'DG-BM-003 result must preserve the credit-savings boundary'
);

const dgBm004 = JSON.parse(readFileSync(join(evidenceRoot, 'results', 'dg-bm-004.json'), 'utf8'));
assert.equal(dgBm004.benchmark_id, 'DG-BM-004');
assert.equal(dgBm004.status, 'exploratory');
assert.equal(dgBm004.controlled, false);
assert.equal(dgBm004.base_commit, 'd40758b');
assert.equal(dgBm004.runs.forge_assisted.commit, 'd4af54d');
assert.equal(dgBm004.runs.forge_assisted.failed_commands, 0);
assert.equal(dgBm004.runs.control.verification[0].outcome, 'not_run');
assert.ok(
  dgBm004.claim_boundaries.some((boundary: string) => boundary.includes('No provider-token or credit-savings claim')),
  'DG-BM-004 result must preserve the credit-savings boundary'
);

const dgBm005 = JSON.parse(readFileSync(join(evidenceRoot, 'results', 'dg-bm-005.json'), 'utf8'));
assert.equal(dgBm005.benchmark_id, 'DG-BM-005');
assert.equal(dgBm005.status, 'exploratory');
assert.equal(dgBm005.controlled, false);
assert.equal(dgBm005.base_commit, 'd4af54d');
assert.equal(dgBm005.runs.forge_assisted.commit, '3aafd3c');
assert.equal(dgBm005.runs.forge_assisted.failed_commands, 0);
assert.equal(dgBm005.runs.control.verification[0].outcome, 'not_run');
assert.ok(
  dgBm005.claim_boundaries.some((boundary: string) => boundary.includes('No provider-token or credit-savings claim')),
  'DG-BM-005 result must preserve the credit-savings boundary'
);
