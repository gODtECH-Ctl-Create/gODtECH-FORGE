# FORGE release distribution

This directory contains the machine-install and release-preflight boundary for FORGE.

FORGE `v0.6.0` is the first publicly released Phase I version. It is licensed under Apache-2.0 and was published from a GitHub-verified signed annotated tag after the repository's release gates completed successfully.

Public release:

- GitHub Release: https://github.com/gODtECH-Ctl-Create/gODtECH-FORGE/releases/tag/v0.6.0
- Build provenance: https://github.com/gODtECH-Ctl-Create/gODtECH-FORGE/attestations/46538361

The npm registry is a separate publication boundary. Do not claim npm availability until the package is explicitly published there.

## What a release proves

A successful version-tag workflow must establish all of the following before GitHub Release publication:

1. `package.json`, `package-lock.json`, and `forge/src/version.ts` agree on the version.
2. The pushed tag is exactly `v<version>`.
3. Explicit license metadata and a root license file are present.
4. Curated metadata exists at `forge/release/notes/v<version>.md` and resolves to a non-empty release title and body.
5. The tag is annotated and its signature is verified by GitHub.
6. The tagged commit is already part of `main`.
7. Type checking, the full test suite, package build, packed-package installation, and CLI version smoke test pass.
8. SHA-256 checksums are generated and verified for the npm tarball and both installers.
9. GitHub Actions creates Sigstore-backed build-provenance attestations for the release assets.
10. Only after those gates pass is the GitHub Release created with the repository-controlled title and notes.

The workflow refuses to replace an existing release for the same tag.

## Curated release metadata

Each releasable version must have a Markdown file at `forge/release/notes/<tag>.md`, for example `forge/release/notes/v0.6.0.md`.

The first line is the GitHub Release title and must be a level-one Markdown heading containing the exact tag:

```markdown
# FORGE v0.6.0 — Phase I: Governed AI Engineering Foundation
```

Everything after that heading becomes the GitHub Release body. `resolve-release-notes.mjs` validates the tag-safe path, title, and non-empty body before expensive build or publication work begins. Missing or malformed curated metadata fails closed; the release workflow does not fall back to generated notes.

## Owner publication boundary

`v0.6.0` has already been published and must not be moved, reused, or overwritten. Future public versions remain owner-controlled and require a deliberately pushed signed annotated tag after the intended release commit is on `main`, repository CI is green, and matching curated release metadata exists.

For a future version, the publication sequence remains:

```bash
git switch main
git pull --ff-only
git tag -s vX.Y.Z -m "FORGE vX.Y.Z — <release title>"
git push origin vX.Y.Z
```

Pushing a matching signed version tag is the explicit GitHub Release trigger. The workflow fails closed if curated metadata, license, versions, signature, `main` ancestry, tests, package smoke test, checksums, or provenance do not pass.

## Install v0.6.0

Linux or macOS:

```bash
curl -fsSLO https://github.com/gODtECH-Ctl-Create/gODtECH-FORGE/releases/download/v0.6.0/install.sh
sh install.sh 0.6.0
forge --version
```

Windows PowerShell:

```powershell
Invoke-WebRequest https://github.com/gODtECH-Ctl-Create/gODtECH-FORGE/releases/download/v0.6.0/install.ps1 -OutFile install.ps1
.\install.ps1 -Version 0.6.0
forge --version
```

If Windows reports that running scripts is disabled, use a process-scoped bypass for the current PowerShell session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install.ps1 -Version 0.6.0
forge --version
```

Or invoke the installer in a one-off PowerShell process:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Version 0.6.0
forge --version
```

Only run `install.ps1` after downloading it from the canonical signed FORGE GitHub Release. Do not use a permanent machine-wide execution-policy bypass for FORGE installation.

Both installers download `forge-<version>.tgz` and `SHA256SUMS.txt` from the same canonical GitHub Release. They compute the package digest locally and stop before `npm install --global` if the checksum entry is missing, malformed, or does not match.

## Verify provenance independently

After downloading a release asset, GitHub CLI can verify the signed build provenance associated with the repository:

```bash
gh attestation verify forge-0.6.0.tgz \
  --repo gODtECH-Ctl-Create/gODtECH-FORGE \
  --source-ref refs/tags/v0.6.0
```

You can also verify the published SHA-256 manifest directly:

```bash
sha256sum --check SHA256SUMS.txt
```

On macOS, use `shasum -a 256` against the expected entry when `sha256sum` is unavailable. On Windows, use `Get-FileHash -Algorithm SHA256`.

Checksums protect integrity against accidental or altered downloads when compared with the release manifest. The GitHub/Sigstore attestation provides an independent provenance check binding the artifact digest to the GitHub Actions build.

## Rollback and revocation

Do not overwrite assets or reuse a signed version tag after publication. If a release is wrong or unsafe:

1. remove the affected GitHub Release so normal downloads stop;
2. keep the failed/withdrawn version recorded in project history;
3. fix the issue on a reviewed branch and merge it to `main`;
4. increment the version; and
5. publish a new signed tag and verified release.

A corrected release should be a new version rather than a mutation of an already attested artifact.

## Files

- `release-preflight.mjs` — deterministic metadata/license/version gate used by the tag workflow.
- `resolve-release-notes.mjs` — validates and resolves repository-controlled release title/body metadata.
- `notes/` — per-tag curated GitHub Release metadata.
- `install.sh` — checksum-verifying Linux/macOS installer.
- `install.ps1` — checksum-verifying Windows PowerShell installer.
- `.github/workflows/release.yml` — repository entry point that verifies, builds, attests, and publishes after a signed tag.
