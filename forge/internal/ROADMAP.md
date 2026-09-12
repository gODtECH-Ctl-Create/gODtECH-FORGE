# FORGE Implementation Roadmap

This roadmap describes the intended build order. Contributors may pick work from any phase when dependencies are satisfied.

## Phase 0 · Foundation

- [x] System definition
- [x] Repository structure
- [x] Project context model
- [x] Agent contract
- [x] README generation system
- [x] Provenance rules
- [x] Git and delivery workflow
- [x] AI-efficiency policy
- [x] Approved technology baseline

## Phase 1 · Contracts and schemas

- [x] Define stable module contract
- [x] Define workflow schema
- [x] Define project-context schema in CUE
- [x] Define decision/evidence schema
- [x] Define verification-result schema
- [x] Define provenance manifest schema
- [x] Define capability and risk taxonomy
- [x] Define installation and distribution model
- [ ] Define cross-tool contracts for external deterministic capabilities

## Phase 2 · Orchestrator core

- [x] Build a minimal TypeScript CLI shell
- [x] Implement `forge init`, `doctor`, and `validate`
- [ ] Build Rust core runtime
- [x] Implement task classification
- [x] Implement selective module activation
- [x] Implement context loading and writing
- [x] Implement workflow execution model
- [x] Implement human-approval checkpoints
- [x] Build deterministic repository preflight and compact AI work packets
- [x] Add task budgets and model-escalation hints for agent adapters
- [ ] Orchestrate independent deterministic tools through stable contracts
- [ ] Invoke StackPilot for scaffolding, generation, and supported project adoption
- [ ] Invoke Steward for repository maintenance and safe remediation when applicable

## Phase 3 · Intelligence

- [ ] Product intelligence
- [ ] Market intelligence
- [ ] Research intelligence
- [ ] Architecture intelligence
- [ ] Design intelligence integration
- [ ] Engineering intelligence
- [ ] Security intelligence
- [ ] Quality intelligence
- [ ] Operations intelligence
- [ ] Documentation intelligence
- [ ] Git/delivery intelligence
- [ ] Provenance intelligence

## Phase 4 · Deterministic tooling

- [ ] Tree-sitter repository analysis
- [ ] CUE validation
- [ ] Open Policy Agent (OPA) / Rego evaluation
- [x] Dependency and manifest inspection
- [x] Git state and branch checks
- [x] Build/test command discovery
- [ ] WebAssembly execution boundary where justified
- [ ] Define deterministic tooling adapter contract
- [ ] Integrate StackPilot as the scaffolding/golden-path tool
- [ ] Integrate Steward as the repository-maintenance/housekeeping tool
- [ ] Ensure generic maintenance rules have one canonical implementation in Steward rather than being duplicated in Forge or StackPilot

## Phase 5 · Verification

- [ ] Playwright browser verification
- [ ] Accessibility checks
- [ ] Responsive checks
- [ ] Visual verification
- [ ] Security verification
- [ ] Production-build verification
- [ ] Deployment smoke tests
- [ ] Verification evidence storage
- [ ] Correlate external deterministic-tool results into Forge evidence
- [ ] Feed Steward health/finding results into proportional Forge verification decisions

## Phase 6 · Memory and efficiency

- [ ] SQLite project memory
- [ ] Context deduplication
- [ ] Research/result caching
- [x] Deterministic-first routing
- [x] Model escalation policy
- [ ] Usage/cost telemetry
- [ ] Efficiency metrics
- [ ] Baseline-versus-assisted credit measurement
- [ ] Cache and reuse validated external deterministic-tool results where safe

## Phase 7 · Agent ecosystem

- [ ] Model Context Protocol (MCP) server
- [ ] Codex adapter
- [ ] Claude adapter
- [ ] Cursor adapter
- [ ] GitHub Copilot adapter
- [ ] Generic agent integration contract

## Phase 8 · Operations and durability

- [ ] OpenTelemetry instrumentation
- [ ] Durable run history
- [ ] Recovery/resume semantics
- [ ] Temporal integration where justified
- [ ] Release management
- [ ] Upgrade/migration strategy for FORGE-enabled repositories

## Phase 9 · Template productization

- [ ] Automated repository-template release
- [x] Clean separation of framework vs project state
- [ ] Documentation for adopters
- [ ] Public contribution model
- [x] Remove or relocate internal planning material
- [ ] Stable versioning and release process

## Cross-product architecture

FORGE, StackPilot, and Steward are complementary gODtECH systems with different canonical responsibilities:

```text
                    gODtECH FORGE
          orchestration / policy / workflow
                         |
             +-----------+-----------+
             |                       |
             v                       v
        StackPilot                Steward
        "BUILD IT"            "KEEP IT HEALTHY"
             |                       |
             +-----------+-----------+
                         v
                   TARGET PROJECT
```

### StackPilot boundary

StackPilot owns stack selection, golden paths, recipe rendering, scaffolding, generated-project validation, and stack-aware adoption/remediation. Forge may invoke it when a workflow needs a supported project shape or generation step.

### Steward boundary

Steward owns generic repository/software housekeeping, deterministic maintenance findings, health reporting, and explicitly approved low-risk remediation. Forge may invoke it during preparation, implementation, or verification when repository health is relevant.

### Non-duplication rule

Forge orchestrates the tools rather than copying their domain implementations. StackPilot must not reproduce Steward's generic housekeeping rules, and Steward must not reproduce StackPilot's golden-path assumptions. Shared facts should cross boundaries through stable machine-readable contracts.

### Independence rule

StackPilot and Steward remain independently usable. Neither should require Forge for its primary functionality. Forge integration is an optional orchestration path layered over stable public interfaces.
