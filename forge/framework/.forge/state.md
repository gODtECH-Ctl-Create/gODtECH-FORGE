# FORGE Project State

> This file is maintained by the AI agent using FORGE.

## Current stage

Phase II Intelligence active. Phase I executable foundation is complete.

## Completed

- FORGE repository foundation, agent contract, policies, README system, project context model, and provenance rules established.
- Stable contracts and composable CUE schemas implemented with automated validation.
- Cross-platform CLI implemented with safe initialization, diagnostics, validation, context management, planning, preparation, metrics, and persistent workflow runs.
- Risk-aware task classification, selective capability activation, model-tier hints, approval checkpoints, and secure-delivery workflows implemented.
- Deterministic repository preflight, bounded AI work packets, command discovery, Git-state inspection, secret-like path exclusion, and content-addressed caching implemented.
- Persistent runs support atomic writes, ordered evidence, approval gates, status lookup, safe resume, granular stage advancement, and compact batch completion.
- Provider-neutral MCP server and repository-bundled Codex plugin implemented.
- Privacy-preserving local efficiency metrics implemented for cache reuse, preparation latency, deterministic work, model-tier routing, and estimated context reduction.
- Apache-2.0 licensing adopted.
- Signed GitHub releases published through v0.7.0 with packaged CLI, installers, checksums, and provenance.
- DeployGuard exploratory benchmark phase completed and benchmark learning fed back into task classification.
- Compact governed workflow completion merged through PR #53.
- Intelligence module contract defined with explicit triggers, inputs, procedure, evidence rules, outputs, exit conditions, failure modes, efficiency notes, and security considerations.
- Product, Market, and Research Intelligence implemented as selectively activated bundled modules.
- Product-creation tasks now activate Product + Market + Research, while narrow feature tasks avoid unnecessary market/research loading.
- Architecture Intelligence implemented with proportional system-boundary, responsibility, dependency, data-flow, integration, failure-model, and handoff guidance.
- `forge prepare` selectively loads Architecture Intelligence only when the planner activates the existing `architecture` capability and reuses bounded `technical.*` architecture context.
- Design Intelligence implemented for material user-facing work with explicit user-flow, interaction-state, accessibility, responsive, design-system, and implementation-handoff guidance.
- The planner activates Design Intelligence only for material UI/UX intent, inserts a dedicated design-review step, and `forge prepare` reuses bounded `experience.*` context without loading Design for backend-only or lightweight work.
- Engineering Intelligence implemented with repository-aligned implementation planning, explicit contracts and migrations, failure behavior, compatibility, maintainability, and downstream verification handoffs.
- `forge prepare` selectively loads Engineering Intelligence through the planner's existing `engineering` capability and reuses bounded `technical.stack`, `technical.integrations`, and `technical.constraints` context.
- Security Intelligence implemented with trust-boundary, identity, authorization, sensitive-data, secret-handling, abuse-case, proportional-control, residual-risk, and verification-handoff guidance.
- `forge prepare` selectively loads Security Intelligence through the planner's existing `security` capability while preserving the existing `review-security` stage and human approval model.
- Quality Intelligence implemented with acceptance-to-test mapping, regression reasoning, proportional test-layer selection, failure-path coverage, test-gap reporting, release blockers, and verification handoff guidance.
- `forge prepare` selectively loads Quality Intelligence through the planner's existing `quality` capability while preserving the distinct `test` and `verify` stages and reusing only context already selected by active capabilities.
- Operations Intelligence implemented with deployment/runtime targeting, rollout and rollback planning, observability, health, capacity, failure recovery, migration operations, runbooks, ownership, and production-evidence guidance.
- The planner activates Operations Intelligence for infrastructure, production-impact, observability, health, rollback, runbook, capacity, backup/restore, and other material runtime work, adds a dedicated `review-operations` step, and `forge prepare` reuses bounded `operations.*` context.
- Documentation Intelligence implemented with audience/reader-outcome reasoning, source-of-truth selection, factual accuracy, information architecture, command/example verification, status accuracy, stale-content detection, and documentation verification handoff guidance.
- The planner reuses the existing `documentation` capability, adds a dedicated `review-documentation` step, and `forge prepare` selectively loads Documentation Intelligence with bounded project/documentation context.
- Master implementation roadmap tracking is centralized in issue #76, and the delivery workflow requires roadmap items to be ticked only after verified merge.

## Active work

- Build Git/Delivery Intelligence with a boundary that complements rather than duplicates the existing Git workflow.
- Build Provenance Intelligence with a boundary that complements rather than duplicates provenance policy.
- Evolve adaptive module selection using measured outcomes without loading every module for every task.

## Deferred / non-blocking

- Controlled plain-AI versus FORGE comparisons remain tracked in issue #49 as an evidence program, not a Phase II gate.
- Direct provider usage, retry, cost, and outcome telemetry remains optional until a suitable provider integration exposes trustworthy measurements.
- Public registry/distribution expansion remains independent of Intelligence development.
- Rust, Tree-sitter, OPA/Rego, Playwright enforcement, SQLite memory, additional native agent adapters, and StackPilot/Steward orchestration remain later-phase work.

## Open questions

- Which additional module outputs need machine-readable schemas beyond the shared Markdown contract?
- Which product and market decisions require external research versus stored project context?
- How should evidence quality and source freshness affect intelligence outputs?
- Which intelligence outputs should become durable project context, decisions, or run evidence?
- Which agent environments receive native adapters after the Intelligence layer matures?
- When should the Rust core become operationally necessary?

## Material risks

- Do not let intelligence modules become large generic prompts; activate only relevant guidance.
- Distinguish researched evidence, stored context, assumptions, and model judgment.
- Do not allow installation or upgrade to overwrite project-owned context.
- Do not let framework instructions become so large that agents ignore important rules.
- Do not claim provider-token, credit, or cost savings without direct measurement.
- Keep human approval for genuinely high-risk work.
- Keep framework source and contributor material out of consuming-project installations.
- Do not treat manually edited approval records as trusted without future integrity controls.
