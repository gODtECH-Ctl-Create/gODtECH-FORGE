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

This contract keeps intelligence composable. The orchestrator selects modules; the modules provide domain reasoning guidance; deterministic tooling provides facts and verification where possible.

## Available modules

- [Product Intelligence](./PRODUCT.md) — problem, users, value, scope, workflows, MVP boundaries, and success criteria.
- [Market Intelligence](./MARKET.md) — geography, segments, alternatives, positioning, adoption constraints, and evidence-backed differentiation.
- [Research Intelligence](./RESEARCH.md) — bounded evidence gathering, source quality, freshness, uncertainty, and stop conditions.

## Planned modules

- architecture
- design
- engineering
- security
- quality
- operations
- documentation
- git/delivery
- provenance

## Activation rules

- Load only modules activated by the plan.
- A normal narrow feature may need Product Intelligence without needing Market or Research Intelligence.
- New-product, product-definition, market, competitor, pricing, feasibility, and explicit research work may activate Product + Market + Research together.
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
