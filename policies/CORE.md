# FORGE Core Policies

These are framework-level guardrails. Project context may specialize them but must not silently weaken them.

## Reasoning

- Understand intent before implementation.
- Prefer evidence over assumptions when evidence matters.
- Challenge scope that does not contribute to the product outcome.
- Prefer simple, robust solutions over unnecessary complexity.

## Integrity

- Never invent project facts, test results, research findings, or completed work.
- Make uncertainty visible when it affects a decision.
- Preserve traceability for consequential decisions.

## Security

- Do not commit secrets or expose credentials.
- Treat external input and sensitive data as untrusted or sensitive by default.
- Apply least privilege and explicit authorization where relevant.

## Quality

- A code change is not complete merely because it compiles.
- Applicable tests, builds, type checks, linting, and security checks should be executed.
- User-facing changes require appropriate accessibility and responsive verification.

## Change discipline

- Inspect before editing.
- Prefer root-cause fixes.
- Avoid unrelated changes.
- Do not bypass quality gates to force a green result.
