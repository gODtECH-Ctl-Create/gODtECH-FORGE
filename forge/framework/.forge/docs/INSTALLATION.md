# FORGE installation and distribution

FORGE now has a source-installable TypeScript CLI. It is not yet published to a public package registry, so registry installation commands remain release targets rather than current claims.

## Current source installation

```bash
git clone https://github.com/gODtECH-Ctl-Create/gODtECH-FORGE.git
cd gODtECH-FORGE
npm ci
npm run build
npm link
forge --help
```

Users interact with the neutral `forge` command. The repository URL and an eventual registry scope may carry the owner name where provenance or registry ownership requires it.

## Supported adoption modes

| Mode | Intended user | Status | Trade-off |
| --- | --- | --- | --- |
| CLI: `forge init` | Existing or new repositories | Implemented from source | Safe initialization, validation, diagnostics, and version tracking |
| Repository template | New projects | Usable after template hardening | Fast start, but weaker upgrade behavior |
| Fork FORGE itself | FORGE contributors | Usable now | Appropriate for framework development, not ordinary product adoption |
| Manual copy of `.forge/` + `AGENTS.md` | Early adopters | Usable now | No automated conflict handling or upgrades |

## Current commands

```bash
forge init
forge init --dry-run
forge doctor
forge validate
forge validate --strict
forge context
forge context set --key product.problem --value "Describe the problem"
forge plan --task "Implement account authentication"
forge --version
```

Commands support `--cwd <directory>` and `--json`. Initialization aborts before writing when a framework-owned file conflicts, unless the user explicitly supplies `--force`. Project-owned context, state, and manifest files are preserved during repeated initialization.

## Installation boundary

`forge init`:

1. inspects the target before writing;
2. packages the portable framework and agent-discovery file;
3. creates a provenance manifest;
4. initializes project context and state;
5. preserves existing project-owned records;
6. supports a no-write dry run;
7. reports every created, updated, unchanged, preserved, or conflicting file.

It does not select the consuming application's stack, store credentials, or silently replace existing content.

## Source repository layout

The repository keeps its reusable implementation under one `forge/` directory:

```text
forge/
├── src/          # CLI and orchestration code
├── test/         # executable regression tests
├── scripts/      # build and packaging helpers
├── framework/    # assets installed into consuming projects
└── internal/     # contributor planning material
```

Only package metadata, the project README and license, GitHub automation, and the agent-discovery entry point remain at the repository root. Installed projects receive the portable `.forge/` workspace and `AGENTS.md`; they do not receive FORGE's source, tests, or internal planning files.

## Planned commands

```bash
forge upgrade
forge eject
forge mcp serve
forge plugin install <provider>
```

## Packaging direction

- Confirm the available npm package identifier before public publishing.
- Publish versioned release archives and checksums on GitHub.
- Keep the portable framework usable without the CLI.
- Add Homebrew, Scoop, and standalone binaries only after the CLI contract stabilizes.
- Sign releases and verify checksums before installation.
