# gODtECH ecosystem

FORGE, StackPilot, and Steward are independent products with deliberately separated responsibilities.

```text
                        FORGE
              orchestrate / govern / verify
                         |
             +-----------+-----------+
             |                       |
             v                       v
        StackPilot                Steward
        BUILD IT             KEEP IT HEALTHY
             |                       |
             +-----------+-----------+
                         v
                   TARGET PROJECT
```

## Product boundaries

**FORGE** owns AI-assisted engineering orchestration, repository preparation, bounded context, risk classification, approvals, resumable workflows, and evidence-aware delivery.

**StackPilot** owns project scaffolding, golden paths, recipe rendering, generated-project validation, and stack-aware readiness.

**Steward** owns deterministic repository housekeeping, health findings, stable scan/report contracts, conservative remediation, and the trust boundary for future external rule packs.

## Integration

FORGE may invoke Steward through its public command-line interface (CLI), versioned JSON result contract, or `forge-evidence` adapter when repository health or maintenance is relevant.

StackPilot may consume Steward's versioned scan report as optional observational input. It does not absorb Steward findings into `readiness-v1` and does not invoke Steward remediation.

Neither StackPilot nor Steward is required for FORGE to operate. Neither product should import another product's private implementation modules.

## Non-duplication

- Generic housekeeping rules belong in Steward.
- Golden-path and stack-aware semantics belong in StackPilot.
- Cross-product workflow and governance belong in FORGE.
- Shared information crosses product boundaries through stable public contracts.

## Public references

- [gODtECH Steward](https://github.com/gODtECH-Ctl-Create/gODtECH-Steward)
- [Steward npm package](https://www.npmjs.com/package/@godtech/steward)
- [Steward v0.1.0](https://github.com/gODtECH-Ctl-Create/gODtECH-Steward/releases/tag/v0.1.0)
- [StackPilot](https://github.com/gODtECH-Ctl-Create/StackPilot)
- [StackPilot Steward integration](https://github.com/gODtECH-Ctl-Create/StackPilot/blob/main/docs/steward-integration.md)
