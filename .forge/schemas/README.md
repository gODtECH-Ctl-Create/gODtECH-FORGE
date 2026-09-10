# FORGE schemas

These CUE schemas are the stable Phase 1 data boundary shared by future runtimes, the CLI, policies, adapters, and verification tooling.

## Contracts

| Schema | Purpose |
| --- | --- |
| `taxonomy.cue` | Shared lifecycle, capability, risk, status, and evidence vocabularies |
| `project-context.cue` | Product-specific living context |
| `module.cue` | Selectively activated intelligence and tooling modules |
| `workflow.cue` | Ordered procedures, approvals, outputs, and exit conditions |
| `decision-evidence.cue` | Durable decisions and their supporting evidence |
| `verification.cue` | Deterministic check results and release decisions |
| `manifest.cue` | FORGE installation and provenance metadata |

Contracts use semantic versions. Backward-compatible additions increment the minor version; incompatible field or meaning changes require a major version. Unknown integration-specific data belongs under `extensions`.

## Validation

Install the CUE CLI, then run:

```bash
cue vet .forge/schemas .forge/schemas/examples/valid/module.yaml
cue vet .forge/schemas .forge/schemas/examples/valid/workflow.yaml
cue vet .forge/schemas .forge/schemas/examples/valid/decision.yaml
cue vet .forge/schemas .forge/schemas/examples/valid/verification.yaml
```

The fixture under `examples/invalid/` is intentionally invalid and must cause `cue vet` to exit non-zero.
