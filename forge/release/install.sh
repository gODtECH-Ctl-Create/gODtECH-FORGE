#!/usr/bin/env sh
set -eu

REPOSITORY="gODtECH-Ctl-Create/gODtECH-FORGE"

fail() {
  printf '%s\n' "FORGE install failed: $*" >&2
  exit 1
}

usage() {
  cat <<'USAGE'
Usage: sh install.sh <version>
Example: sh install.sh 0.6.0

The installer downloads the selected GitHub release package and SHA-256
manifest, verifies the package checksum, then installs the package globally
with npm. A leading "v" in the version is accepted.
USAGE
}

[ "$#" -eq 1 ] || {
  usage >&2
  exit 2
}

command -v curl >/dev/null 2>&1 || fail "curl is required."
command -v npm >/dev/null 2>&1 || fail "npm is required (Node.js 20 or newer)."

VERSION=${1#v}
case "$VERSION" in
  ''|*[!0-9A-Za-z.-]*) fail "invalid version: $1" ;;
esac

TAG="v$VERSION"
ASSET="forge-$VERSION.tgz"
BASE_URL="https://github.com/$REPOSITORY/releases/download/$TAG"
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t forge-install) || fail "could not create a temporary directory."
trap 'rm -rf "$TMP_DIR"' EXIT HUP INT TERM

ARCHIVE="$TMP_DIR/$ASSET"
CHECKSUMS="$TMP_DIR/SHA256SUMS.txt"

printf '%s\n' "Downloading FORGE $VERSION..."
curl -fsSL "$BASE_URL/$ASSET" -o "$ARCHIVE" || fail "could not download $ASSET from the canonical GitHub release."
curl -fsSL "$BASE_URL/SHA256SUMS.txt" -o "$CHECKSUMS" || fail "could not download SHA256SUMS.txt from the canonical GitHub release."

EXPECTED=$(awk -v name="$ASSET" '$2 == name || $2 == "*" name { print $1 }' "$CHECKSUMS")
[ -n "$EXPECTED" ] || fail "SHA256SUMS.txt does not contain an entry for $ASSET."
case "$EXPECTED" in
  *[!0-9A-Fa-f]*|'') fail "checksum entry for $ASSET is malformed." ;;
esac
[ "${#EXPECTED}" -eq 64 ] || fail "checksum entry for $ASSET is not SHA-256."

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL=$(sha256sum "$ARCHIVE" | awk '{ print $1 }')
elif command -v shasum >/dev/null 2>&1; then
  ACTUAL=$(shasum -a 256 "$ARCHIVE" | awk '{ print $1 }')
else
  fail "sha256sum or shasum is required for checksum verification."
fi

[ "$ACTUAL" = "$EXPECTED" ] || fail "checksum mismatch for $ASSET; nothing was installed."
printf '%s\n' "Checksum verified. Installing FORGE $VERSION..."

npm install --global "$ARCHIVE" || fail "npm installation failed."

if command -v forge >/dev/null 2>&1; then
  INSTALLED=$(forge --version 2>/dev/null || true)
  [ "$INSTALLED" = "$VERSION" ] || fail "installed forge reports version ${INSTALLED:-<unknown>}, expected $VERSION."
fi

printf '%s\n' "FORGE $VERSION installed successfully."
printf '%s\n' "Run: forge --version"
