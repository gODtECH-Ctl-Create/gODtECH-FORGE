import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const preflightScript = path.join(repositoryRoot, "forge", "release", "release-preflight.mjs");
const shellInstaller = path.join(repositoryRoot, "forge", "release", "install.sh");
const powershellInstaller = path.join(repositoryRoot, "forge", "release", "install.ps1");

async function releaseFixture(options: { version?: string; cliVersion?: string; license?: string; lockVersion?: string } = {}): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "forge-release-"));
  const version = options.version ?? "1.2.3";
  const cliVersion = options.cliVersion ?? version;
  const license = options.license ?? "MIT";
  const lockVersion = options.lockVersion ?? version;

  await fs.mkdir(path.join(root, "forge", "src"), { recursive: true });
  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ name: "@godtech/forge", version, license }, null, 2),
    "utf8",
  );
  await fs.writeFile(
    path.join(root, "package-lock.json"),
    JSON.stringify({ name: "@godtech/forge", version: lockVersion, packages: { "": { name: "@godtech/forge", version: lockVersion, license } } }, null, 2),
    "utf8",
  );
  await fs.writeFile(path.join(root, "forge", "src", "version.ts"), `export const VERSION = "${cliVersion}";\n`, "utf8");
  if (license !== "UNLICENSED") await fs.writeFile(path.join(root, "LICENSE"), "fixture license text\n", "utf8");
  return root;
}

function runPreflight(root: string, tag: string) {
  return spawnSync(process.execPath, [preflightScript, "--root", root, "--tag", tag], {
    cwd: repositoryRoot,
    encoding: "utf8",
    shell: false,
  });
}

test("release preflight blocks the current UNLICENSED state", async (context) => {
  const root = await releaseFixture({ license: "UNLICENSED" });
  context.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runPreflight(root, "v1.2.3");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /blocked until the owner selects an explicit license/i);
});

test("release preflight rejects tag, CLI, and lockfile version mismatches", async (context) => {
  const root = await releaseFixture();
  context.after(() => fs.rm(root, { recursive: true, force: true }));

  assert.equal(runPreflight(root, "v1.2.4").status, 1);

  await fs.writeFile(path.join(root, "forge", "src", "version.ts"), 'export const VERSION = "1.2.4";\n', "utf8");
  assert.equal(runPreflight(root, "v1.2.3").status, 1);

  await fs.writeFile(path.join(root, "forge", "src", "version.ts"), 'export const VERSION = "1.2.3";\n', "utf8");
  const lock = JSON.parse(await fs.readFile(path.join(root, "package-lock.json"), "utf8")) as Record<string, unknown>;
  lock.version = "1.2.2";
  await fs.writeFile(path.join(root, "package-lock.json"), JSON.stringify(lock, null, 2), "utf8");
  assert.equal(runPreflight(root, "v1.2.3").status, 1);
});

test("release preflight passes only with aligned version and explicit license metadata", async (context) => {
  const root = await releaseFixture();
  context.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runPreflight(root, "v1.2.3");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Release preflight passed for v1\.2\.3/);
});

test("installers fail closed around release checksum verification", async () => {
  const [shell, powershell] = await Promise.all([
    fs.readFile(shellInstaller, "utf8"),
    fs.readFile(powershellInstaller, "utf8"),
  ]);

  for (const source of [shell, powershell]) {
    assert.match(source, /SHA256SUMS\.txt/);
    assert.match(source, /checksum mismatch/i);
    assert.match(source, /nothing was installed/i);
    assert.match(source, /github\.com\/\$?REPOSITORY|github\.com\/\$Repository/i);
  }

  assert.match(shell, /sha256sum|shasum/);
  assert.match(shell, /npm install --global/);
  assert.match(powershell, /Get-FileHash/);
  assert.match(powershell, /install --global/);
});

test("POSIX installer does not invoke npm when the downloaded checksum is wrong", { skip: process.platform === "win32" }, async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "forge-install-checksum-"));
  context.after(() => fs.rm(root, { recursive: true, force: true }));
  const fakeBin = path.join(root, "bin");
  const fakeRelease = path.join(root, "release");
  const marker = path.join(root, "npm-called");
  await fs.mkdir(fakeBin);
  await fs.mkdir(fakeRelease);
  await fs.writeFile(path.join(fakeRelease, "forge-1.2.3.tgz"), "package bytes\n", "utf8");
  await fs.writeFile(path.join(fakeRelease, "SHA256SUMS.txt"), `${"0".repeat(64)}  forge-1.2.3.tgz\n`, "utf8");

  const fakeCurl = `#!/usr/bin/env sh
set -eu
url=''
out=''
while [ "$#" -gt 0 ]; do
  case "$1" in
    -o) out=$2; shift 2 ;;
    -*) shift ;;
    *) url=$1; shift ;;
  esac
done
cp "$FAKE_RELEASE/$(basename "$url")" "$out"
`;
  const fakeNpm = `#!/usr/bin/env sh
printf 'called\\n' > "$NPM_MARKER"
exit 0
`;
  await fs.writeFile(path.join(fakeBin, "curl"), fakeCurl, { encoding: "utf8", mode: 0o755 });
  await fs.writeFile(path.join(fakeBin, "npm"), fakeNpm, { encoding: "utf8", mode: 0o755 });

  const result = spawnSync("sh", [shellInstaller, "1.2.3"], {
    encoding: "utf8",
    shell: false,
    env: {
      ...process.env,
      PATH: `${fakeBin}:${process.env.PATH ?? ""}`,
      FAKE_RELEASE: fakeRelease,
      NPM_MARKER: marker,
    },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /checksum mismatch/i);
  await assert.rejects(fs.access(marker));
});
