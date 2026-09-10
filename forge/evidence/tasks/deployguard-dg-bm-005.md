# DG-BM-005: Kubernetes / Runtime Probes

Status: planned

Repository: https://github.com/gODtECH-Ctl-Create/deployguard

## Goal

Measure FORGE on infrastructure-adjacent delivery work.

## Task brief

Add Kubernetes deployment assets for DeployGuard with liveness and readiness probes tied to the app's health behavior.

## Acceptance criteria

- Deployment/service manifests or equivalent chart assets are added.
- Probes map to existing health behavior.
- Runtime configuration is documented.
- Static validation or dry-run validation is performed when tooling is available.
- Application build, type-check and tests remain passing.

## Benchmark notes

This task should be treated as higher-risk infrastructure work, especially if deployment defaults affect production-style behavior.
