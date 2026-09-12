# FORGE Module Map

This file describes the target module system. Each module should have a clear responsibility, contract, and implementation boundary.

| Module | Responsibility | Main inputs | Main outputs | Dependencies |
| --- | --- | --- | --- | --- |
| Orchestrator | Select relevant capabilities and coordinate execution | task, project context, risk | execution plan | context, workflows, policies |
| Product Intelligence | Define problem, users, scope, value | product intent | product decisions | research, market |
| Market Intelligence | Understand market, alternatives, positioning | product context, research | market evidence, differentiation | research |
| Research | Gather and synthesize external evidence | research questions | evidence records | web/docs/tools |
| Architecture | Choose system shape and technical trade-offs | requirements, constraints | architecture decisions | code analysis, context |
| Design | Shape UX, UI, interaction, visual system | users, product goals | design direction, artifacts | product, research |
| Engineering | Guide implementation quality and maintainability | architecture, tasks | code changes, engineering decisions | project tooling |
| Security | Threat model and harden sensitive surfaces | architecture, data flows | risks, controls, security decisions | policy engine, analysis |
| Quality | Define correctness and release evidence | requirements, risk | verification plan/results | test/build tooling |
| Operations | Deployment, observability, recovery, maintenance | architecture, environment | operational plan | CI/CD, telemetry |
| Documentation | Keep README and technical docs current | verified project state | documentation artifacts | context, verification |
| Provenance | Identify FORGE-enabled projects and preserve attribution | FORGE metadata | manifest, attribution | templates, policy |
| Git / Delivery | Maintain reviewable repository workflow | work item | branch, commit, pull request lifecycle | GitHub tooling |
| Efficiency | Reduce unnecessary model work and repeated computation | task, context, prior results | routing/caching decisions | context, tooling, telemetry |
| Verification | Execute objective checks and collect evidence | project + verification plan | pass/fail evidence | tools, policies |
| Agent Adapters | Translate FORGE capabilities into agent-specific interfaces | FORGE contracts | adapter behavior | MCP / agent APIs |

## Module contract

Each mature module should define:

```text
PURPOSE
SCOPE
TRIGGERS
INPUTS
REASONING / PROCEDURE
TOOLS
OUTPUTS
EXIT CONDITIONS
FAILURE MODES
COST / EFFICIENCY NOTES
SECURITY CONSIDERATIONS
```

## Dependency rule

Modules should depend on stable contracts rather than reaching directly into unrelated modules. The orchestrator selects and composes capabilities; it should not become a dumping ground for domain logic.

## External deterministic tool boundaries

FORGE may integrate independently usable gODtECH tools through stable contracts. These integrations must preserve one canonical implementation for each capability.

### StackPilot

**Canonical responsibility:** project scaffolding, stack selection, golden paths, recipe rendering, generated-project validation, and stack-aware adoption/remediation.

FORGE may invoke StackPilot when a workflow needs a supported project shape or deterministic project generation. FORGE should consume StackPilot's public command or machine-readable contract and must not copy StackPilot's recipe or scaffolding logic.

### gODtECH Steward

**Canonical responsibility:** generic repository/software housekeeping, deterministic maintenance findings, repository-health reporting, and explicitly approved low-risk remediation.

FORGE may invoke Steward when repository maintenance or health evidence is relevant. FORGE should consume Steward's public command or machine-readable contract and must not reproduce Steward's generic maintenance rules inside the orchestration layer.

### Independence

StackPilot and Steward remain independently usable without FORGE. A FORGE integration is an adapter/orchestration path, not a runtime dependency for their primary functionality.

### Shared evidence

Where useful, external tool results may be normalized into FORGE verification/evidence contracts. Normalization must preserve the source tool's authority and schema/version information so that evidence remains attributable and auditable.

## Integration of existing design intelligence

The existing `frontend-design-workflow` work is a reference and candidate source for FORGE's design intelligence. It should be integrated by contract rather than copied blindly, preserving the strongest research, design-system, accessibility, responsive, motion, and visual-verification practices.
