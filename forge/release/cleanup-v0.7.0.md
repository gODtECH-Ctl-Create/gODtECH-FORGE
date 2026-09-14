# Post-v0.7.0 cleanup audit

Reviewed against main commit c3cc9991d840e5f95b320c376a03ef424f334dee.

## Branch deletion candidates

These remote branch tips match their merged PR heads. No branches were deleted: automatic approval review rejected batch remote deletion including release branches. Delete only the branch refs, never the signed release tags. Recheck for new commits before later deletion.

| Branch | Merged PR |
| --- | --- |
| `release/v0.7.0` | #48 |
| `docs/benchmark-phase-summary` | #46 |
| `release/v0.6.2` | #45 |
| `evidence/dg-bm-005-result` | #44 |
| `release/v0.6.1` | #43 |
| `evidence/dg-bm-004-result` | #42 |
| `feat/cli-identity-integration` | #41 |
| `evidence/dg-bm-003-result` | #40 |
| `evidence/dg-bm-002-result` | #39 |
| `feat/cli-identity` | #38 |
| `fix/ci-layout-validation` | #36 |
| `docs/stackpilot-steward-architecture` | #33 |
| `feat/milestone-2-benchmark-protocol` | #32 |
| `site/issue-29-github-pages` | #30 |
| `docs/issue-27-powershell-policy` | #28 |
| `docs/issue-25-post-release-state` | #26 |
| `chore/issue-23-curated-release-metadata` | #24 |
| `chore/apache-2-license` | #22 |
| `feat/issue-19-release-readiness` | #20 |
| `feat/issue-17-efficiency-metrics` | #18 |
| `docs/issue-13-readme-redesign` | #16 |
| `feat/issue-14-mcp-plugin` | #15 |
| `feat/issue-11-work-packets` | #12 |
| `feat/issue-9-workflow-runs` | #10 |
| `feat/issue-7-orchestration-planner` | #8 |
| `feat/issue-5-forge-cli` | #6 |
| `feat/issue-3-phase-1-contracts` | #4 |

## Retain for review

- `main` and all version tags.
- `security/encrypted-internal-docs`: PR #2 remains unmerged. The encrypted vault is absent from main, where forge/internal still contains Markdown planning documents. Issue #1 remains unresolved; do not mark encryption complete. Historical Git exposure would also require explicit consideration in that security work.
- `fix/cli-layout-public-docs`: PR #35 contains layout-test and header asset differences absent from main. Retain pending a decision on those changes.
- `fix/readme-static-assets`: no matching merged PR established in this audit; retain pending review.
- `docs/steward-ecosystem-presentation`: current branch tip does not match the merged PR #34 head; retain pending review of the additional history.
- The active cleanup branch until its PR is merged.

## Repository and public state

- No tracked files were found under node_modules, dist, or .next, or matching *.tsbuildinfo, *.tgz, or *.log.
- The implementation layout test passed; this cleanup adds no implementation roots.
- Current landing-page, README, and release-guide installation examples now target v0.7.0.
- Original v0.6.0 terminal captures and historical release notes remain historical evidence.
- Controlled benchmarking has not started and is tracked in #49.
- Landing-page publication remains subject to merging this cleanup PR and a successful Pages deployment.
