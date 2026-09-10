# FORGE Project State

> This file is maintained by the AI agent using FORGE.

## Current stage
Phase I public release complete — measurement studies and distribution expansion next

## Completed
- FORGE repository foundation, agent contract, policies, and README system established.
- Stable Phase 1 contracts and composable CUE schemas merged.
- Automated CUE contract validation established.
- CLI-first installation and distribution model accepted.
- TypeScript CLI shell implemented with help and version output.
- `forge init`, `forge doctor`, and `forge validate` implemented.
- Dry-run, JSON output, strict validation, conflict detection, and project-owned context preservation implemented.
- Cross-platform Node.js test matrix and installed-project CUE smoke test added.
- Repository implementation, tests, scripts, framework assets, and internal planning consolidated under `forge/`.
- `forge context` inspection and safe scalar updates implemented.
- `forge plan` task classification, risk escalation, selective capability activation, workflow selection, and human-approval checkpoints implemented.
- Persistent workflow runs with atomic YAML writes, ordered evidence, approval gates, status lookup, and safe resume transitions implemented.
- `forge prepare` bounded repository inspection, manifest/language detection, Git-state hashing, command discovery, selective context, model-tier hints, and content-addressed packet caching implemented without AI calls.
- Secret-like paths, dependencies, build output, installed FORGE assets, and volatile run/cache state excluded from AI packet inventory.
- Provider-neutral MCP server and validated Codex plugin implemented under the compact `forge/` distribution folder.
- Privacy-preserving local preparation metrics implemented for cache reuse, latency, deterministic work, tier routing, and estimated context reduction.
- Apache-2.0 selected and applied across package metadata and repository documentation.
- `v0.6.0` published as the first public Phase I GitHub Release from a GitHub-verified signed annotated tag on `main`.
- `v0.6.0` release assets include the packaged CLI, Linux/macOS installer, Windows PowerShell installer, SHA-256 manifest, and GitHub/Sigstore-backed build provenance.

## In progress
- Confirm the public npm package identifier and registry ownership before any npm publication.
- Design opt-in assisted-versus-unassisted studies using provider-reported usage and outcome data.
- Sequence Phase II intelligence work from measured developer value rather than adding heavy components speculatively.

## Open questions
- Which agent environments receive native adapters first?
- Which checks are universal and which are project-specific?
- Which additional files require mixed-ownership merge semantics?
- When should the Rust core become operationally necessary?

## Material risks
- Do not allow installation or upgrade to overwrite project-owned context.
- Do not let framework instructions become so large that agents ignore important rules.
- Do not ship unsigned or unverifiable installation artifacts.
- Do not claim registry availability before a package is actually published.
- Keep framework source and contributor material out of consuming-project installations.
- Do not treat manually edited approval records as trusted without future integrity controls.
