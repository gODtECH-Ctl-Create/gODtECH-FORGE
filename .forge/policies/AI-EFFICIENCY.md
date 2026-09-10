# AI Efficiency & Reasoning Economy

FORGE is designed to maximize useful work per unit of AI computation, tokens, or credits. The agent should use model reasoning where judgment is valuable and deterministic tooling everywhere else.

## Core rule

> Do not spend model intelligence on work that FORGE, the repository, or a deterministic tool can establish reliably.

## Efficiency principles

- Load only the intelligence modules relevant to the task.
- Reuse verified project context, decisions, evidence, and previous analysis.
- Do not repeatedly rediscover unchanged repository facts.
- Prefer local inspection, parsing, validation, and tests before asking a model to reason about them.
- Use deterministic tools for deterministic questions.
- Avoid generating speculative implementation before requirements and constraints are sufficiently understood.
- Batch related reasoning when it is cheaper and clearer than repeated isolated calls.
- Escalate to deeper reasoning only when ambiguity, risk, novelty, or complexity justifies it.
- Use the smallest capable model or reasoning depth available when the execution environment supports model selection.
- Cache or persist reusable results when they remain valid.

## Deterministic-first examples

Prefer tooling for:

```text
Git status / diff             → Git
Repository structure          → filesystem + Tree-sitter
Package metadata              → package manager manifests
Syntax / parsing              → Tree-sitter
Configuration validation      → CUE
Policy evaluation             → Open Policy Agent (OPA) / Rego
Tests                         → project test runner
Builds                        → project build tooling
Browser behavior              → Playwright
Dependency facts              → lockfiles / package managers
Project state already known   → .forge/context + .forge/decisions
```

## Model-worthy work

Reserve substantive model effort for work such as:

- ambiguous product requirements;
- product and market reasoning;
- research synthesis;
- architectural trade-offs;
- design reasoning;
- novel debugging and root-cause analysis;
- security threat reasoning;
- prioritization and scope decisions;
- interpretation of conflicting evidence.

## Context economy

Project context is a persistent asset. Prefer concise structured records over repeatedly reconstructing the same information in conversation. Update context when a material decision changes; do not churn it for trivial events.

## Verification economy

Verification should be proportional to risk. Cheap deterministic checks should run early. Expensive or deep checks should be triggered when the affected surface, risk level, or release stage warrants them.

## Never optimize by weakening quality

Credit efficiency must never be achieved by skipping material security, testing, accessibility, correctness, or release checks. The goal is less wasted intelligence, not less engineering discipline.

## Future measurement

FORGE should eventually measure:

```text
model calls
input/output usage
reused context
cached analysis
reasoning escalations
deterministic tool usage
verification failures
completed work per model call
```

The objective is to improve the amount of reliable product work achieved for each unit of AI usage.
