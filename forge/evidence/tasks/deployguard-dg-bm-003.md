# DG-BM-003: Database Migration

Status: exploratory complete

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

DG-BM-003 shipped to DeployGuard `main` at merge commit `d40758b`. The implementation adds an `incident_audit_events` table during API startup initialization, records created, updated and deleted incident activity, exposes `GET /incidents/:id/audit`, documents the behavior, and adds API tests for the audit event sequence.

The result is labeled exploratory because no plain-AI control branch was run from the same base commit. It verifies the shipped database behavior, but it does not claim provider-token, credit or controlled-efficiency savings.
