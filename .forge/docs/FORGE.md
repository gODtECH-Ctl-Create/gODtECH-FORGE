# FORGE System Definition

## What FORGE is

FORGE is a universal operating framework for intelligent AI-assisted product development. It sits between human intent and AI execution and supplies structured reasoning, project context, workflows, policies, and verification.

## What FORGE is not

FORGE is not an application stack, a single model, or a giant prompt. It does not replace engineering judgment and it should not force every project through every capability.

## Operating model

1. The human supplies intent and constraints.
2. The agent reads FORGE and inspects the project.
3. FORGE determines which intelligence and workflow stages are relevant.
4. Missing material context is discovered, inferred, or researched.
5. Project-specific context is recorded in `.forge/`.
6. The agent implements against that context.
7. Verification checks the result.
8. Context, decisions, and state are updated as the product evolves.

## Core rule

The framework should help the agent build the right product correctly, not simply produce more code.
