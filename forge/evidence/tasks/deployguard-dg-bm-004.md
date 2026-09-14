# DG-BM-004: GitHub Actions CI/CD

Status: exploratory complete

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

DG-BM-004 shipped to DeployGuard `main` at merge commit `d4af54d`. The implementation adds `.github/workflows/ci.yml`, runs `npm ci`, workspace type-check, focused API tests and workspace build, and documents the same commands in the README.

The result is labeled exploratory because no plain-AI control branch was run from the same base commit. It verifies the shipped CI behavior, but it does not claim provider-token, credit or controlled-efficiency savings.
