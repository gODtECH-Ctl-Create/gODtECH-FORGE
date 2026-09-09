# FORGE Architecture

## Layer model

FORGE is organized into layers so framework intelligence can evolve without forcing every project to consume every rule at once.

```text
core
  ├── orchestration
  ├── context management
  └── decision routing

intelligence
  ├── product
  ├── market
  ├── research
  ├── architecture
  ├── design
  ├── engineering
  ├── security
  ├── quality
  └── operations

workflows
  └── lifecycle procedures

policies
  └── universal guardrails

forge
  ├── context
  ├── decisions
  └── state

verification
  └── automated and human quality gates

adapters
  └── agent-specific integration
```

## Separation of concerns

The core should remain small. It should decide what the agent needs next, not contain every domain-specific rule.

Intelligence modules contain domain expertise.

Workflows describe sequences and exit conditions.

Policies contain non-negotiable cross-cutting requirements.

Project context contains only information about the current product.

Verification contains mechanisms that can independently test claims made by the agent.

Adapters translate FORGE into the conventions of a particular AI coding environment.

## Context precedence

When instructions overlap, use this precedence:

1. safety and universal security policies;
2. FORGE core rules;
3. project-specific requirements and decisions;
4. task-specific user intent;
5. implementation convenience.

Lower-priority information must not silently override higher-priority guardrails.

## Design constraint

Do not make FORGE depend on one framework, cloud provider, programming language, or AI vendor. Technology-specific guidance belongs in optional modules or project context.
