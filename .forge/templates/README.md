# FORGE Templates

Reusable artifacts generated from verified project context.

## README templates

`readme/` contains the standard README system for projects using FORGE:

- `README.md` — rules and selection logic
- `PRODUCT.md` — applications, platforms, and user-facing products
- `LIBRARY.md` — reusable packages and developer libraries
- `TOOL.md` — developer tools, command-line interfaces (CLIs), infrastructure utilities, and technical projects

FORGE selects and adapts the appropriate pattern instead of forcing every repository into the same README.

## Other templates

This directory will also hold templates for product briefs, architecture records, design decisions, security assessments, verification plans, deployment checklists, and other project artifacts.

Templates stay generic. Project-specific facts belong in `.forge/context/`, `.forge/decisions/`, and `.forge/state.md`.
