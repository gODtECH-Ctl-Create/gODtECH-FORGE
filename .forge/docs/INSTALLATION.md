# FORGE installation and distribution

FORGE is currently a portable repository framework, not yet an installable executable. Today it can be copied into or forked with a project. The target product is an installable CLI that manages the framework safely.

## Supported adoption modes

| Mode | Intended user | Status | Trade-off |
| --- | --- | --- | --- |
| CLI: `forge init` | Existing or new repositories | Planned; recommended target | Safe merging, validation, version tracking, and upgrades |
| Repository template | New projects | Usable after template hardening | Fast start, but weaker upgrade behavior |
| Fork FORGE itself | FORGE contributors | Usable now | Appropriate for framework development, not ordinary product adoption |
| Manual copy of `.forge/` + `AGENTS.md` | Early adopters | Usable now | No automated conflict handling or upgrades |

## Target commands

```bash
npm install --global @godtech/forge
forge init
forge doctor
forge validate
forge upgrade
forge eject
```

The registry package identifier may include an owner scope where the registry requires uniqueness. Everyday commands, generated code, filenames, and project configuration use the neutral `forge` / `FORGE` identity.

The TypeScript package provides the cross-platform CLI. A later Rust core provides high-confidence analysis and local execution behind the same interface. Users should not need to install Rust.

## Installation boundary

`forge init` will:

1. inspect the repository before writing;
2. ask only when a conflict or material choice cannot be inferred;
3. install the portable `.forge/` framework and agent discovery files;
4. create `.forge/manifest.yaml` with the installed version and ownership metadata;
5. initialize project context without overwriting verified product information;
6. generate or update product documentation using the selected template;
7. validate the result and report every changed file.

It must not select the consuming application's stack, overwrite unrelated files, store credentials, or silently replace project-owned content.

## Ownership and upgrades

Framework-owned files are updated from a versioned release. Project-owned context, decisions, state, evidence, and local extensions are preserved. Files with mixed ownership require a three-way merge or human decision.

`forge eject` removes framework-owned runtime material only after showing a dry-run. Product code and project-owned records remain untouched.

## Packaging direction

- Confirm the available npm package identifier; an owner scope may be used for registry ownership without becoming a code or command prefix.
- Publish versioned release archives and checksums on GitHub.
- Keep the portable framework usable without the CLI.
- Add Homebrew, Scoop, and standalone binaries only after the CLI contract stabilizes.
- Sign releases and verify checksums before installation.
