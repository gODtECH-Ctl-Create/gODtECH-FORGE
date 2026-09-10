# DG-BM-002: Authentication / Security

Status: planned

Repository: https://github.com/gODtECH-Ctl-Create/deployguard

## Goal

Add a small security boundary to DeployGuard's API without changing the product into a full identity platform.

## Task brief

Protect mutating incident endpoints with an API key while keeping read-only health checks public. The implementation should be configurable through environment variables, documented for local development, and covered by tests.

## Acceptance criteria

- Public health endpoint still works without credentials.
- Mutating incident endpoints reject missing or invalid credentials.
- Valid credentials allow the protected operation.
- Secret values are read from environment configuration.
- Tests cover allowed and rejected paths.
- Build, type-check and tests pass.

## Benchmark notes

This task is security-sensitive, so FORGE should classify it at a higher risk level than basic feature work and surface appropriate verification requirements.
