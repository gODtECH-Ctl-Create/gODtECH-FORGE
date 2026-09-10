# FORGE release readiness

This directory contains the machine-install and release-preflight boundary for FORGE.

The repository is **release-ready, not publicly released**. Publication remains owner-controlled. The tag workflow is intentionally unable to publish while `package.json` is `UNLICENSED` or while a non-empty root license file is absent.

## What a release proves

A successful version-tag workflow must establish all of the following before GitHub Release publication:

1. `package.json`, `package-lock.json`, and `forge/src/version.ts` agree on the version.
2. The pushed tag is exactly `v<version>`.
3. Explicit license metadata and a root license file are present.
4. The tag is annotated and its signature is verified by GitHub.
5. The tagged commit is already part of `main`.
6. Type checking, the full test suite, package build, packed-package installation, and CLI version smoke test pass.
7. SHA-256 checksums are generated and verified for the npm tarball and both installers.
8. GitHub Actions creates Sigstore-backed build-provenance attestations for the release assets.
9. Only after those gates pass is the GitHub Release created.

The workflow refuses to replace an existing release for the same tag.

## Owner publication boundary

Do not create a public version tag until the owner has deliberately selected the project license and the related license metadata has been reviewed.

After the license decision is committed to `main` and CI is green, the intended publication action is a signed annotated tag, for example:

```bash
git switch main
git pull --ff-only
git tag -s v0.6.0 -m "FORGE v0.6.0"
git push origin v0.6.0
```

Pushing that signed tag is the explicit release trigger. The workflow will still fail closed if the license, versions, signature, `main` ancestry, tests, package smoke test, checksums, or provenance step do not pass.

## Install from a selected release

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
- `install.sh` — checksum-verifying Linux/macOS installer.
- `install.ps1` — checksum-verifying Windows PowerShell installer.
- `.github/workflows/release.yml` — repository entry point that verifies, builds, attests, and publishes after a signed tag.
