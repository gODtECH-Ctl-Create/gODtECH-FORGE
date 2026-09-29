# Intelligence

FORGE intelligence is modular domain guidance. Modules are activated by task and project context rather than loaded wholesale.

## Module contract

Every mature intelligence module defines:

- PURPOSE
- SCOPE
- TRIGGERS
- INPUTS
- PROCEDURE
- TOOLS AND EVIDENCE
- OUTPUTS
- EXIT CONDITIONS
- FAILURE MODES
- COST / EFFICIENCY NOTES
- SECURITY CONSIDERATIONS

Modules may add domain-specific acceptance criteria when a precise handoff boundary is useful.

This contract keeps intelligence composable. The orchestrator selects modules; the modules provide domain reasoning guidance; deterministic tooling provides facts and verification where possible.

## Available modules

- [Product Intelligence](./PRODUCT.md) — problem, users, value, scope, workflows, MVP boundaries, and success criteria.
- [Market Intelligence](./MARKET.md) — geography, segments, alternatives, positioning, adoption constraints, and evidence-backed differentiation.
- [Research Intelligence](./RESEARCH.md) — bounded evidence gathering, source quality, freshness, uncertainty, and stop conditions.
- [Architecture Intelligence](./ARCHITECTURE.md) — system boundaries, responsibilities, dependency direction, data/integration flows, topology, failure implications, and proportional architecture decisions.
- [Design Intelligence](./DESIGN.md) — user flows, information hierarchy, interaction states, accessibility, responsive behavior, design-system reuse, and implementation-ready experience handoff.
- [Engineering Intelligence](./ENGINEERING.md) — repository-aligned implementation reasoning, contract and migration changes, failure behavior, compatibility, maintainability, and verification-ready code handoff.
- [Security Intelligence](./SECURITY.md) — trust boundaries, identity, authorization, sensitive data, secrets, abuse cases, proportional controls, residual risk, and security verification handoff.
- [Quality Intelligence](./QUALITY.md) — acceptance-to-test mapping, regression risk, positive/negative paths, proportional test layers, test gaps, release blockers, and verification-ready quality evidence.

## Planned modules

- operations
- documentation
- git/delivery
- provenance

## Activation rules

- Load only modules activated by the plan.
- A normal feature may activate Product + Architecture + Engineering without automatically requiring Market or Research Intelligence.
- Material UI/UX work activates Design Intelligence before Engineering; backend-only features and non-user-facing changes do not pay that design-context cost.
- New-product, product-definition, market, competitor, pricing, feasibility, and explicit research work may activate Product + Market + Research together; Architecture joins when structural technical decisions are required, Design joins only when a material user-facing surface is in scope, and Engineering joins when implementation is actually requested.
- Feature, bug, refactor, security, and infrastructure implementation work can activate Engineering directly according to the planner's existing capability model.
- Sensitive identity, permission, secret, payment, personal-data, production, destructive, and high-risk work activates Security Intelligence according to the planner's existing risk/capability model.
- Feature, bug, refactor, security, and infrastructure work activates Quality Intelligence through the planner's existing `quality` capability; lightweight documentation and research work do not pay that quality-context cost.
- Security, infrastructure, and material refactor work may activate Architecture directly without Product Intelligence.
- A module may request another module when a material decision depends on evidence or another domain.
- Do not use module activation as permission to broaden scope beyond the user's outcome.

## Evidence boundary

Intelligence must distinguish:

- verified project context;
- user-provided requirements;
- external evidence;
- model inference;
- unresolved assumptions.

External facts that may be current, contested, geographic, regulatory, commercial, or otherwise consequential should be researched rather than guessed.

## Efficiency rule

FORGE should not load every intelligence file into every task. Reuse stored context, select the smallest relevant module set, and stop research/reasoning when additional work is unlikely to change the decision.
