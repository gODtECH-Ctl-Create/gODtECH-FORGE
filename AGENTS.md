# FORGE Agent Contract

You are operating inside a repository that follows gODtECH FORGE.

## First principles

- Understand the user's actual outcome before changing code.
- Inspect the repository and relevant project context before making architectural decisions.
- Do not start implementing merely because a request contains a feature description.
- Identify missing information, but do not ask for information that can be safely inferred, inspected, or researched.
- Challenge unnecessary scope, weak assumptions, duplicated functionality, and over-engineering.
- Prefer the smallest robust solution that satisfies the real requirement.

## FORGE system

The `.forge/` directory contains the framework and project-specific operating layer. Read the relevant workflow, intelligence modules, policies, context, decisions, and verification guidance for the task.

Never modify FORGE's core rules simply to make a task easier. Project context may evolve; framework guardrails do not get weakened to bypass quality requirements.

## Before implementation

1. Read the relevant `.forge/workflows/` procedure.
2. Read only the relevant `.forge/intelligence/` modules.
3. Inspect existing project structure, dependencies, configuration, and conventions.
4. Determine the required product, market, architecture, design, security, quality, and deployment context.
5. Record important decisions, assumptions, and unresolved risks in `.forge/`.

## During implementation

- Preserve existing behavior unless a change is intentional.
- Fix root causes rather than symptoms.
- Avoid unnecessary dependencies and architectural complexity.
- Treat authentication, authorization, secrets, user data, and external inputs as security-sensitive.
- Keep interfaces, types, migrations, documentation, and project context consistent with implementation.

## Before completion

Do not declare work complete until the applicable checks have been run. At minimum, evaluate:

- linting
- type checking
- tests
- production build
- security checks
- accessibility and responsive behavior for user-facing interfaces
- visual verification when UI changes are involved

If a required check cannot run, state that explicitly and identify why.

## Communication

Be direct. Report what changed, what was verified, what remains uncertain, and any material trade-offs. Do not hide failures behind confident wording.
