# DeployGuard Benchmark Phase Summary

This document summarizes the public DeployGuard benchmark phase completed after the FORGE v0.6.0 release.

## What Was Completed

DeployGuard became FORGE's first external benchmark project and exercised FORGE across five task areas:

| ID | Area | DeployGuard outcome | FORGE evidence status |
| --- | --- | --- | --- |
| DG-BM-001 | Incident CRUD pilot | PostgreSQL-backed incident lifecycle benchmark | Pilot complete |
| DG-BM-002 | Authentication / security | API-key protection for mutating incident endpoints | Exploratory complete |
| DG-BM-003 | Database migration | Incident audit events and audit endpoint | Exploratory complete |
| DG-BM-004 | GitHub Actions CI/CD | Pull-request CI for install, type-check, API tests and build | Exploratory complete |
| DG-BM-005 | Kubernetes / runtime probes | Baseline Kubernetes manifests with API, web and database probes | Exploratory complete |

## Verified Outcomes

- FORGE was installed and used against a separate real repository.
- DeployGuard accepted FORGE initialization and generated project operating context.
- Four additional product and operations changes shipped through issue, branch, PR, CI and merge.
- DeployGuard now has security, database audit, CI and Kubernetes-runtime benchmark surfaces.
- FORGE Evidence Lab records each benchmark with limitations and claim boundaries.

## What This Evidence Proves

This phase proves that FORGE can support and document AI-assisted engineering work on a real external project. It also proves that FORGE can keep implementation evidence, verification notes and public claim boundaries visible as work moves across security, database, CI/CD and infrastructure tasks.

## What This Evidence Does Not Prove

DG-BM-002 through DG-BM-005 are exploratory, not controlled benchmark results. A plain-AI control branch was not executed from the same base commit for those runs.

FORGE does not claim provider-token or credit savings from these exploratory results. Provider billing telemetry was not captured, and FORGE internal context estimates remain separate from paid provider usage.

DG-BM-005 added Kubernetes manifests and probes, but no live cluster apply was performed for that benchmark in this environment. The result is not a production availability, SLO or hardening claim.

## Product Learning

The benchmark phase exposed one concrete FORGE product issue: a new incident CRUD feature could be classified as a bug because the word `incident` appeared in the task. That behavior has been turned into a product improvement: feature-intent wording such as "add incident CRUD" is classified as feature work, while outage or failure language remains bug work.

## Next Evidence Step

The next benchmark phase should run controlled plain-AI versus FORGE-assisted branches from the same base commit, with identical task briefs, verification commands and provider telemetry where available.
