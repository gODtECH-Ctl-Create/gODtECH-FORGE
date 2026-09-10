# FORGE Internal Contribution Guide

This guide applies while `forge/internal/` exists. It is intentionally separate from the eventual public adoption guide.

## Before starting

1. Read `VISION.md` to understand the intended outcome.
2. Read `BUILD-SPEC.md` for the technical contract.
3. Read `MODULES.md` to find the right subsystem boundary.
4. Read `ROADMAP.md` and identify dependency-safe work.
5. Read the relevant `.forge/` workflow and policy files.

## Choose the right layer

Before adding something, decide whether it belongs in:

```text
instruction
knowledge / intelligence
workflow
policy
schema
or enforcement
```

Do not solve a tooling problem with a giant prompt when deterministic enforcement is possible.

## Git workflow

Meaningful changes should follow:

```text
ISSUE → BRANCH → PLAN → IMPLEMENT → VERIFY → PULL REQUEST → REVIEW → MERGE
```

Prefer one coherent unit of work per branch. Avoid unrelated cleanup.

## Implementation expectations

- Preserve the `.forge/` public-facing shape unless the architecture decision explicitly changes it.
- Keep framework rules independent from project-specific context.
- Prefer explicit contracts and schemas over implicit conventions.
- Keep expensive AI reasoning behind selective activation.
- Make executable checks deterministic where possible.
- Document material architectural decisions.
- Add tests for executable behavior.

## Definition of done

A contribution is ready when:

- the intended problem is clearly defined;
- the correct module boundary is used;
- implementation is scoped and documented;
- relevant checks pass;
- no security or quality rule was bypassed;
- project/build documentation remains coherent;
- the change can be understood by the next contributor.

## Internal planning material

`forge/internal/` is temporary by design. Before public template release, maintainers should review every file here and decide whether it should be deleted or condensed into public documentation.
