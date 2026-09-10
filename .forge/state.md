# FORGE Project State

> This file is maintained by the AI agent using FORGE.

## Current stage
Orchestrator core — CLI minimum viable product

## Completed
- FORGE repository foundation, agent contract, policies, and README system established.
- Stable Phase 1 contracts and composable CUE schemas merged.
- Automated CUE contract validation established.
- CLI-first installation and distribution model accepted.
- TypeScript CLI shell implemented with help and version output.
- `forge init`, `forge doctor`, and `forge validate` implemented.
- Dry-run, JSON output, strict validation, conflict detection, and project-owned context preservation implemented.
- Cross-platform Node.js test matrix and installed-project CUE smoke test added.

## In progress
- Review and merge the CLI minimum viable product.
- Confirm the public package identifier and registry ownership.
- Design task classification and selective module activation.
- Resolve protection of internal planning material.

## Open questions
- Which agent environments receive native adapters first?
- Which checks are universal and which are project-specific?
- Which additional files require mixed-ownership merge semantics?
- When should the Rust core become operationally necessary?

## Material risks
- Do not allow installation or upgrade to overwrite project-owned context.
- Do not let framework instructions become so large that agents ignore important rules.
- Do not ship unsigned or unverifiable installation artifacts.
- Do not claim registry availability before a package is actually published.
- Do not treat existing public internal documents as confidential without resolving Git history.
