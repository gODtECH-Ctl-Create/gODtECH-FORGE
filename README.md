# gODtECH FORGE

**A universal operating framework for intelligent AI-assisted product development.**

FORGE is a reusable repository template for building software products with AI. It sits between human intent and AI execution, giving an agent a structured way to reason about what should be built, how it should be designed and engineered, how it should be secured, and how the result should be verified.

FORGE is not a fixed application stack and it is not one giant prompt. Its capabilities are modular, project context is generated and maintained as the work evolves, and objective checks are separated from instructions.

## The model

```text
Human intent
    ↓
FORGE context + orchestration
    ↓
Product / Market / Research
    ↓
Architecture / Design
    ↓
Engineering / Security
    ↓
Build / Test / Verify
    ↓
Deploy / Improve
```

## Root structure

```text
README.md                 human entry point
AGENTS.md                 agent entry point
.github/                  tool-specific discovery/instructions
.forge/                   the FORGE system
```

Everything that belongs to the framework or its project-specific operating state lives under `.forge/`.

## Inside `.forge/`

```text
core/          orchestration and shared mechanisms
intelligence/  modular reasoning domains
workflows/     lifecycle procedures and exit conditions
policies/      non-negotiable framework guardrails
verification/  objective and human quality gates
adapters/      AI-environment integration guidance
templates/     project artifacts FORGE can generate
context/       living project-specific context
decisions/     consequential project decisions
state.md       current project state
docs/          FORGE system documentation
```

## Core lifecycle

IDEA → DISCOVER → RESEARCH → DEFINE → ARCHITECT → DESIGN → BUILD → SECURE → TEST → VERIFY → DEPLOY → IMPROVE

## Design principles

- Understand before building.
- Reason before defaulting.
- Build the right thing, not everything.
- Prefer root-cause fixes.
- Keep intelligence modular.
- Separate instructions from enforcement.
- Keep project context living.
- Never weaken core guardrails to bypass a check.
- Verify the product, not just the code.
- Use deeper controls when risk or complexity justifies them.

## Status

FORGE is in foundation development. The structure is intentionally being stabilized before the intelligence modules become extensive.

## Goal

A user should be able to start from FORGE, describe the product they want to build, and let an AI agent progressively establish the required context, activate the relevant intelligence, create the necessary project artifacts, build the product, verify it, and keep the project context current without requiring the user to manually configure a large collection of framework files.
