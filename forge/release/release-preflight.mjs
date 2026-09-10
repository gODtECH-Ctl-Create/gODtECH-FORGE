#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "..", "..");

function parseArgs(argv) {
  const args = { root: defaultRoot, tag: process.env.GITHUB_REF_NAME ?? "" };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--root") {
      const next = argv[index + 1];
      if (!next) throw new Error("--root requires a directory.");
      args.root = path.resolve(next);
      index += 1;
    } else if (value === "--tag") {
      const next = argv[index + 1];
      if (!next) throw new Error("--tag requires a value such as v0.6.0.");
      args.tag = next;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  return args;
}

async function readJson(filePath, label) {
  let text;
  try {
    text = await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Could not read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Could not parse ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function findLicenseFile(root) {
  for (const name of ["LICENSE", "LICENSE.md", "LICENSE.txt"]) {
    const candidate = path.join(root, name);
    try {
      const content = await fs.readFile(candidate, "utf8");
      if (content.trim().length > 0) return name;
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
    }
  }
  return undefined;
}

function readCliVersion(source) {
  const match = source.match(/export\s+const\s+VERSION\s*=\s*["']([^"']+)["']/);
  if (!match) throw new Error("Could not read FORGE CLI version from forge/src/version.ts.");
  return match[1];
}

async function main() {
  const { root, tag } = parseArgs(process.argv.slice(2));
  if (!tag) throw new Error("A release tag is required. Pass --tag vX.Y.Z or set GITHUB_REF_NAME.");

  const packageJson = await readJson(path.join(root, "package.json"), "package.json");
  const packageLock = await readJson(path.join(root, "package-lock.json"), "package-lock.json");
  const versionSource = await fs.readFile(path.join(root, "forge", "src", "version.ts"), "utf8");

  const version = typeof packageJson.version === "string" ? packageJson.version.trim() : "";
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`package.json contains an invalid release version: ${version || "<missing>"}.`);
  }

  const expectedTag = `v${version}`;
  if (tag !== expectedTag) throw new Error(`Release tag ${tag} does not match package version ${version}; expected ${expectedTag}.`);

  const cliVersion = readCliVersion(versionSource);
  if (cliVersion !== version) throw new Error(`CLI version ${cliVersion} does not match package version ${version}.`);

  const lockVersion = typeof packageLock.version === "string" ? packageLock.version : "";
  const lockPackageVersion = packageLock.packages?.[""]?.version;
  if (lockVersion !== version || lockPackageVersion !== version) {
    throw new Error(`package-lock.json version metadata must match package version ${version}.`);
  }

  if (packageJson.private === true) throw new Error("Release publication is blocked because package.json is private.");

  const license = typeof packageJson.license === "string" ? packageJson.license.trim() : "";
  const lockLicense = typeof packageLock.packages?.[""]?.license === "string" ? packageLock.packages[""].license.trim() : "";
  if (!license || license.toUpperCase() === "UNLICENSED") {
    throw new Error("Release publication is blocked until the owner selects an explicit license in package.json.");
  }
  if (lockLicense !== license) throw new Error("package-lock.json license metadata must match package.json before release.");

  const licenseFile = await findLicenseFile(root);
  if (!licenseFile) throw new Error("Release publication is blocked until a non-empty LICENSE, LICENSE.md, or LICENSE.txt file is present.");

  console.log(`Release preflight passed for ${tag}.`);
  console.log(`Version: ${version}`);
  console.log(`License metadata: ${license}`);
  console.log(`License file: ${licenseFile}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
