# gODtECH FORGE

**A universal operating framework for intelligent AI-assisted product development.**

FORGE is designed to sit between human product intent and AI execution. It gives AI coding agents a structured way to reason about a product before, during, and after implementation.

FORGE is not a product template in the sense of a fixed application stack. It is a reusable development intelligence layer that can be applied to many kinds of software projects.

## Core lifecycle

```text
IDEA
  ↓
DISCOVER
  ↓
RESEARCH
  ↓
DEFINE
  ↓
ARCHITECT
  ↓
DESIGN
  ↓
BUILD
  ↓
SECURE
  ↓
TEST
  ↓
VERIFY
  ↓
DEPLOY
  ↓
IMPROVE
```

## Intelligence domains

- Product and market thinking
- Research and evidence gathering
- System architecture
- User experience (UX) and User Interface (UI) design
- Software engineering
- Security hardening
- Quality assurance and verification
- Deployment and operations

These domains are modular. A project should activate the intelligence relevant to the task instead of loading one enormous instruction set into an AI agent.

## Design principles

1. **Understand before building.** Missing context should be discovered before implementation.
2. **Reason before defaulting.** Technology, architecture, and design decisions must have a reason.
3. **Build the right thing, not everything.** Scope should be challenged and unnecessary work should be removed.
4. **Prefer root-cause fixes.** Do not paper over architectural or implementation problems.
5. **Separate instruction from enforcement.** AI guidance belongs in the framework; objective checks belong in automation.
6. **Keep project context living.** Product, architecture, design, decisions, and state evolve with the project.
7. **Ship only after verification.** A successful edit is not the same thing as a verified product.

## Repository structure

```text
core/          orchestration and shared mechanisms
intelligence/  modular reasoning domains
workflows/     lifecycle procedures and exit conditions
policies/      cross-cutting rules and guardrails
forge/         project-specific context and state
verification/  automated and human quality gates
adapters/      integrations for different AI environments
templates/     files generated or copied into a project

docs/          FORGE architecture and design documentation
```

## Status

FORGE is currently in foundation design. The repository is intentionally being built in layers so the core model is stable before the individual intelligence modules become extensive.

## Philosophy

FORGE should make good development practice easier for an AI agent to follow, not replace engineering judgment. The framework should remain modular, inspectable, evidence-based, and practical.
