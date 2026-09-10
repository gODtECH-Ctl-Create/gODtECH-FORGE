import base64
import json
import os
import pathlib
import sys
from getpass import getpass
from hashlib import scrypt

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MAGIC = "FORGE-VAULT-1"
N = 2**14
R = 8
P = 1


def derive(password: bytes, salt: bytes) -> bytes:
    return scrypt(password, salt=salt, n=N, r=R, p=P, dklen=32)


def encrypt_file(source: pathlib.Path, target: pathlib.Path, password: bytes) -> None:
    data = source.read_bytes()
    salt = os.urandom(16)
    nonce = os.urandom(12)
    key = derive(password, salt)
    ciphertext = AESGCM(key).encrypt(nonce, data, MAGIC.encode())
    envelope = {
        "format": MAGIC,
        "kdf": "scrypt",
        "kdf_params": {"n": N, "r": R, "p": P},
        "cipher": "AES-256-GCM",
        "salt": base64.b64encode(salt).decode("ascii"),
        "nonce": base64.b64encode(nonce).decode("ascii"),
        "ciphertext": base64.b64encode(ciphertext).decode("ascii"),
    }
    target.write_text(json.dumps(envelope, indent=2) + "\n", encoding="utf-8")


def decrypt_file(source: pathlib.Path, target: pathlib.Path, password: bytes) -> None:
    envelope = json.loads(source.read_text(encoding="utf-8"))
    if envelope.get("format") != MAGIC:
        raise ValueError("Unsupported or invalid FORGE vault format")
    salt = base64.b64decode(envelope["salt"])
    nonce = base64.b64decode(envelope["nonce"])
    ciphertext = base64.b64decode(envelope["ciphertext"])
    key = derive(password, salt)
    target.write_bytes(AESGCM(key).decrypt(nonce, ciphertext, MAGIC.encode()))


def password_from_environment() -> bytes:
    value = os.getenv("FORGE_INTERNAL_PASSWORD")
    return (value if value is not None else getpass("FORGE internal password: ")).encode("utf-8")


def main() -> int:
    if len(sys.argv) != 4 or sys.argv[1] not in {"encrypt", "decrypt"}:
        print("Usage: python forge-vault.py encrypt|decrypt <source> <target>", file=sys.stderr)
        return 2

    mode = sys.argv[1]
    source = pathlib.Path(sys.argv[2])
    target = pathlib.Path(sys.argv[3])
    password = password_from_environment()

    try:
        if mode == "encrypt":
            encrypt_file(source, target, password)
        else:
            decrypt_file(source, target, password)
    except FileNotFoundError as exc:
        print(f"Missing file: {exc.filename}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"Vault operation failed: {exc}", file=sys.stderr)
        return 1

    print(f"{mode.title()}ed: {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
