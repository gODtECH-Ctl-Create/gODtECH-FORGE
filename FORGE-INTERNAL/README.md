# FORGE Internal Vault

This directory contains protected FORGE planning material that is intentionally kept separate from the portable `.forge/` framework.

The internal documents are stored only as encrypted ciphertext. The decryption password is never stored in Git.

## Protected bundle

`vault/forge-internal-docs.zip.enc` contains the internal FORGE vision, build specification, module map, roadmap, and contribution guide.

## Local access

Install the required Python dependency:

```bash
python -m pip install -r requirements.txt
```

Set the external password or allow the tool to prompt for it:

```bash
# PowerShell
$env:FORGE_INTERNAL_PASSWORD = "<external-secret>"

# Bash
export FORGE_INTERNAL_PASSWORD="<external-secret>"
```

Decrypt the bundle:

```bash
python vault/forge-vault.py decrypt vault/forge-internal-docs.zip.enc vault/forge-internal-docs.zip
```

The decrypted archive is intentionally ignored by Git. Keep the password outside the repository and share it only with authorized maintainers.

## Security model

- Encryption: AES-256-GCM authenticated encryption.
- Password derivation: Scrypt with a per-file random salt.
- Password/key: external secret only; never commit it.
- Repository access: still controlled separately through GitHub permissions and branch protection.
- Public/template release: `FORGE-INTERNAL/` can be removed without changing the portable `.forge/` framework.
