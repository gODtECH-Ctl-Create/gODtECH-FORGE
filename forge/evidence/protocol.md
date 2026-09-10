# Controlled Benchmark Protocol

This protocol is used to compare plain AI-assisted development against FORGE-assisted development on the same project task.

## Purpose

FORGE exists to reduce repository rediscovery, bound context, preserve governance and produce stronger engineering evidence before expensive AI reasoning is spent. The benchmark must measure those effects without turning estimates into marketing claims.

## Experimental design

Each benchmark uses two branches:

- `control`: AI works without FORGE preparation.
- `forge-assisted`: AI uses FORGE preparation, planning, run state and metrics before implementation.

Both branches must begin from the same base commit unless the benchmark is explicitly labeled as a pilot.

## Required inputs

Each run must define:

- repository name and URL;
- immutable base commit;
- benchmark ID;
- task brief;
- acceptance criteria;
- allowed model/provider class;
- allowed commands;
- environment notes;
- verification commands.

## Required measurements

Record these values for both branches:

- inspected file count and unique inspected file paths;
- files edited;
- failed commands;
- implementation retries;
- human interventions;
- verification commands and outcomes;
- build/type-check/test status;
- elapsed wall-clock time if available;
- exact provider token or credit data only if captured directly.

Record these FORGE-only values when available:

- `forge prepare` duration;
- task kind and risk;
- deterministic preparation step count;
- selected versus considered context characters;
- estimated context tokens avoided;
- cache hit count;
- run ID and run status.

## Guardrails

Use careful language:

- Say "estimated context reduction" for FORGE's internal context-selection estimate.
- Say "fewer files inspected" only when file inspections were counted.
- Say "credit savings" only when provider billing telemetry exists.
- Do not compare total productivity when verification scopes differ.

## Failure handling

If either branch cannot complete:

1. Preserve the failed result.
2. Record the last passing state.
3. Record failed commands and error classes.
4. Publish as failed, partial or exploratory rather than silently discarding the run.

## Publication checklist

Before publishing:

- result JSON validates against `result.schema.json`;
- write-up includes limitations;
- numbers distinguish observed, estimated and unavailable data;
- task brief and acceptance criteria are included or linked;
- claim wording avoids unsupported credit, cost or universal performance guarantees.
