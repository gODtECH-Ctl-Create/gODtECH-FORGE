# FORGE Templates

Reusable artifacts generated from verified project context.

## README templates

`readme/` contains the standard README system for projects using FORGE:

- `README.md` — rules, selection logic, and generation standards
- `PRODUCT.md` — applications, platforms, and user-facing products
- `LIBRARY.md` — reusable packages and developer libraries
- `TOOL.md` — developer tools, command-line interfaces (CLIs), infrastructure utilities, and technical projects

FORGE initializes the project README as part of early product planning. The agent selects and adapts the appropriate pattern from verified project context rather than waiting until the end of development.

Every generated README preserves required gODtECH FORGE provenance while keeping the product's own identity primary.

## Project provenance template

`manifest.yaml` is the starting point for the project's machine-readable FORGE provenance metadata. The agent populates it during initialization and keeps the framework version and synchronization state current.

## Other templates

This directory will also hold templates for product briefs, architecture records, design decisions, security assessments, verification plans, deployment checklists, and other project artifacts.

Templates stay generic. Project-specific facts belong in `.forge/context/`, `.forge/decisions/`, and `.forge/state.md`.