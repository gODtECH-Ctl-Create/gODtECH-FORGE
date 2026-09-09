# FORGE Lifecycle

The default product-development flow is:

```text
IDEA → DISCOVER → RESEARCH → DEFINE → ARCHITECT → DESIGN → BUILD → SECURE → TEST → VERIFY → DEPLOY → IMPROVE
```

Each stage has four parts:

1. Inputs: what must already be known.
2. Actions: what the agent should do.
3. Outputs: what becomes project context or an implementation artifact.
4. Exit conditions: what must be true before moving forward.

FORGE may shorten or expand the lifecycle for a task. It must not skip a stage silently when that stage contains a material product, technical, security, or quality decision.
