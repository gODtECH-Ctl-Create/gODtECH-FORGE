# gODtECH FORGE

**A universal operating framework for intelligent AI-assisted product development.**

FORGE sits between human product intent and AI execution. It gives AI agents a structured way to reason about a product before, during, and after implementation, while keeping project context, decisions, workflows, policies, and verification in one portable system.

## What FORGE does

```text
IDEA
  ↓
DISCOVER → RESEARCH → DEFINE → ARCHITECT → DESIGN
  ↓
BUILD → SECURE → TEST → VERIFY → DEPLOY → IMPROVE
```

FORGE combines modular product, market, research, architecture, design, engineering, security, quality, and operations intelligence. It is deliberately not one giant prompt. The relevant capabilities are activated according to the task, context, and risk.

## Repository shape

```text
AGENTS.md          agent entry point
README.md          human entry point
.github/           optional tool-specific discovery
.forge/            the complete FORGE system
```

Everything that makes FORGE work lives under `.forge/`. Project-specific context and state are maintained there as the product evolves.

## Approved technology baseline

**Rust + TypeScript + Python + CUE + Tree-sitter + Open Policy Agent (OPA)/Rego + WebAssembly (WASM) + Model Context Protocol (MCP) + SQLite + Playwright + GitHub Actions + OpenTelemetry**, with **Temporal** available as an advanced durable-workflow option.

These technologies implement FORGE itself. They do **not** dictate the application stack of a project using FORGE.

## Design principles

- Understand before building.
- Reason before defaulting.
- Build the right thing, not everything.
- Prefer root-cause fixes.
- Put guidance in instructions, knowledge in modules, and objective checks in tooling.
- Keep project context living and explicit.
- Protect core security and quality guardrails.
- Verify real behavior and experience, not just successful compilation.
- Scale the depth of analysis to the product's risk and complexity.

## Status

FORGE is in foundation development. The architecture and technology baseline are established first; intelligence modules, orchestration tooling, and executable verification will be added in deliberate layers.

## Vision

A developer should be able to start with an idea, give it to an AI agent operating with FORGE, and have the system help determine what should be built, why it should be built, how it should be designed and engineered, how it should be secured, and whether the resulting product is actually ready to ship.
