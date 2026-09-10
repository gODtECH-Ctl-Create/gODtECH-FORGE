# DG-BM-004: GitHub Actions CI/CD

Status: planned

Repository: https://github.com/gODtECH-Ctl-Create/deployguard

## Goal

Measure FORGE on automation and repository-governance work.

## Task brief

Add a GitHub Actions workflow for DeployGuard that installs dependencies and runs type-check, tests and build on pull requests.

## Acceptance criteria

- Workflow is committed under `.github/workflows/`.
- Workflow uses a supported Node version.
- Workflow avoids secrets and unnecessary permissions.
- Local verification commands pass.
- The workflow file is syntactically valid.

## Benchmark notes

This task should expose whether FORGE correctly scopes CI/CD work and avoids unrelated application-file inspection.
