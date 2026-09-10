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

## Integration of existing design intelligence

The existing `frontend-design-workflow` work is a reference and candidate source for FORGE's design intelligence. It should be integrated by contract rather than copied blindly, preserving the strongest research, design-system, accessibility, responsive, motion, and visual-verification practices.
