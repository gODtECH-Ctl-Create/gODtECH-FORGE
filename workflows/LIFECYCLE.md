# FORGE Product Lifecycle

FORGE uses a staged lifecycle. The orchestrator should activate only the reasoning needed for the current phase and task.

## 1. Discover

Understand the user's goal, problem, users, constraints, and desired outcome.

**Exit condition:** the problem and intended outcome are sufficiently understood.

## 2. Research

Gather evidence needed for product, market, technical, or design decisions. Distinguish evidence from assumptions.

**Exit condition:** important unknowns that affect decisions are resolved or explicitly recorded.

## 3. Define

Establish scope, non-goals, success criteria, priorities, and major trade-offs. Remove unnecessary work.

**Exit condition:** the product boundary is clear.

## 4. Architect

Determine page/system inventory, data flows, boundaries, integrations, technology choices, and important failure modes before deep implementation.

**Exit condition:** the proposed architecture supports the product requirements and known constraints.

## 5. Design

Define the user experience, interface direction, interaction model, accessibility needs, responsive behavior, and visual system when applicable.

**Exit condition:** the intended experience is sufficiently specified to implement without guessing.

## 6. Build

Implement incrementally while preserving project conventions and updating project context when decisions change.

**Exit condition:** the intended functionality is implemented and locally verifiable.

## 7. Secure

Review authentication, authorization, data handling, secrets, inputs, dependencies, infrastructure, and abuse cases according to the project's risk profile.

**Exit condition:** known security requirements have been addressed or explicitly accepted as risks.

## 8. Test

Run relevant unit, integration, end-to-end, type, lint, build, and domain-specific tests.

**Exit condition:** applicable automated checks pass or exceptions are documented.

## 9. Verify

Perform visual, responsive, accessibility, performance, integration, and production-readiness checks appropriate to the project.

**Exit condition:** verification finds no unresolved release-blocking defects.

## 10. Deploy

Validate environment configuration, migrations, observability, rollback considerations, and deployment behavior.

**Exit condition:** the release is safely deployable.

## 11. Improve

Capture production feedback, defects, performance findings, and product learning. Feed validated changes back into project context and future work.
