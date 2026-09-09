# FORGE System Model

## Purpose

FORGE is a reusable framework that helps AI agents develop software products with disciplined product thinking, research, architecture, design, engineering, security, verification, and operations.

It is not itself the product being built. It is the development system applied to the product.

## Operating model

```text
Human intent
    ↓
Agent
    ↕
FORGE orchestration
    ├── project context
    ├── intelligence modules
    ├── workflows
    ├── policies
    └── verification
    ↕
Project repository
```

The AI agent remains the conversational and execution interface. FORGE supplies structured knowledge, procedures, project state, and enforcement mechanisms.

## Two kinds of rules

### Framework rules

Universal rules maintained by FORGE. These cover how an agent should reason and how quality is enforced.

### Project context

Facts and decisions specific to the product being built. These are created and maintained during project initialization and development.

Project context must never weaken universal framework guardrails.

## Context acquisition

FORGE should not require users to manually populate a large configuration surface.

Instead, the agent should:

1. inspect available repository context;
2. determine which required context is missing;
3. ask focused questions only for information that cannot be inferred or researched;
4. research externally where appropriate;
5. write structured answers into `forge/context/`;
6. record consequential decisions in `forge/decisions/`; and
7. keep project state current as the work evolves.

## Modular intelligence

Intelligence domains are activated according to the project and task. A marketing landing-page change does not need the same reasoning stack as a database migration or security-sensitive authentication change.

Each module should define:

- when it applies;
- what context it needs;
- what decisions it helps make;
- what outputs it produces;
- what checks or exit conditions apply.

## Quality model

FORGE separates guidance from proof.

Guidance tells the agent what good work looks like. Verification determines whether the result satisfies objective checks.

The framework should prefer automated enforcement for things that can be objectively measured and human or agent review for things that require judgment.
