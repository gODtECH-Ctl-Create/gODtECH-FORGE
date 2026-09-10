# DG-BM-003: Database Migration

Status: planned

Repository: https://github.com/gODtECH-Ctl-Create/deployguard

## Goal

Measure FORGE on a schema-changing application task.

## Task brief

Add incident assignment or incident audit events backed by PostgreSQL. Include the schema change, application logic, tests and documentation required to operate it locally.

## Acceptance criteria

- Schema change is represented in the repository's database workflow.
- Existing incident behavior remains compatible.
- New assignment or audit behavior has tests.
- Build, type-check and tests pass.
- Any migration or setup command is documented.

## Benchmark notes

This task should test whether FORGE improves context selection around database boundaries without hiding migration risk.
