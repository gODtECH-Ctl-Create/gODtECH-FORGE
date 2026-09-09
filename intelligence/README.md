# Intelligence Modules

FORGE intelligence is modular. Each domain should be independently understandable, activatable, and testable.

Planned domains:

- `product/` — product definition, scope, outcomes, prioritization, and value.
- `market/` — users, competitors, positioning, differentiation, and commercial reasoning.
- `research/` — evidence gathering, source evaluation, synthesis, and uncertainty.
- `architecture/` — system design, data, boundaries, integrations, technology decisions, and trade-offs.
- `design/` — user experience (UX), user interface (UI), interaction, accessibility, visual systems, and design verification.
- `engineering/` — implementation standards, maintainability, testing, performance, and code quality.
- `security/` — threat-aware development, secrets, access control, data protection, and hardening.
- `quality/` — quality models, release criteria, and defect prevention.
- `operations/` — environments, deployment, observability, reliability, recovery, and production concerns.

A module should not become a giant prompt. Prefer compact rules plus references, workflows, examples, and executable checks where possible.
