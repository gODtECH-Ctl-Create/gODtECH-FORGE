# FORGE Evidence Lab

This directory contains public benchmark materials for FORGE.

FORGE evidence must distinguish three things:

- observed repository behavior, such as files inspected, retries, validation commands and pass/fail outcomes;
- FORGE internal estimates, such as selected context characters and approximate context tokens avoided;
- provider billing data, such as paid tokens or credits, which must not be claimed unless it was captured directly from the provider.

The first external benchmark, DG-BM-001, proved FORGE can prepare and measure work on a real external project. It is intentionally labeled as a pilot because the control and assisted runs were not fully controlled.

Milestone 2 moves from pilot evidence to controlled multi-task benchmarking.

## Controlled benchmark rules

Each controlled benchmark must:

1. Start the plain and FORGE-assisted branches from the same application commit.
2. Use the same task brief, acceptance criteria, model/provider class and verification commands.
3. Keep the plain control free of FORGE-generated files unless the benchmark explicitly measures adoption in an already-initialized repository.
4. Record every command used for setup, implementation and verification.
5. Record every inspected file path without storing file contents.
6. Record retries, failed commands and human interventions.
7. Separate measured values from estimates in the published result.
8. Avoid credit-savings claims unless provider token or billing telemetry is captured directly.

## Planned task matrix

| ID | Area | Repository | Status | Goal |
| --- | --- | --- | --- | --- |
| DG-BM-002 | Authentication / security | DeployGuard | Planned | Add API key protection or session-based admin access with tests. |
| DG-BM-003 | Database migration | DeployGuard | Planned | Add incident assignment or audit events with schema changes and migration verification. |
| DG-BM-004 | GitHub Actions CI/CD | DeployGuard | Planned | Add a CI workflow that runs install, type-check, test and build. |
| DG-BM-005 | Kubernetes / runtime probes | DeployGuard | Planned | Add manifests or Helm-style deployment assets with health/readiness checks. |

## Publishing standard

A benchmark can be published as "controlled" only when the result file validates against `result.schema.json` and the write-up names any remaining limitations. If a run deviates from the protocol, publish it as a pilot or exploratory result.
