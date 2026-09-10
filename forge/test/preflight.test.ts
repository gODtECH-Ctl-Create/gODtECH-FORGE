import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { updateContext } from "../src/context.js";
import { initProject } from "../src/init.js";
import { prepareWorkPacket } from "../src/preflight.js";

function git(cwd: string, args: string[]): void {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", shell: false });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `git ${args.join(" ")} failed`);
}

async function preparedProject(): Promise<string> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-prepare-"));
  await initProject({ cwd, now: new Date("2026-09-10T00:00:00Z") });
  await fs.mkdir(path.join(cwd, "src"));
  await fs.writeFile(path.join(cwd, "src", "app.ts"), "export const ready = true;\n", "utf8");
  await fs.writeFile(
    path.join(cwd, "package.json"),
    JSON.stringify({ scripts: { build: "tsc", test: "node --test", start: "node app.js" } }, null, 2),
    "utf8",
  );
  await fs.writeFile(path.join(cwd, ".env"), "PRIVATE_TOKEN=initial-placeholder\n", "utf8");
  git(cwd, ["init"]);
  git(cwd, ["config", "user.name", "FORGE Tests"]);
  git(cwd, ["config", "user.email", "forge-tests@example.invalid"]);
  git(cwd, ["add", "."]);
  git(cwd, ["commit", "-m", "fixture"]);
  return cwd;
}

test("prepare builds and reuses a compact deterministic work packet", async (context) => {
  const cwd = await preparedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const first = await prepareWorkPacket(cwd, "Update README wording", new Date("2026-09-10T10:00:00Z"));
  assert.equal(first.cached, false);
  assert.equal(first.plan.taskKind, "documentation");
  assert.equal(first.preparation.suggestedModelTier, "economy");
  assert.ok(first.preparation.selectedContextCharacters <= first.preparation.maxContextCharacters);
  assert.equal(first.repository.git.detected, true);
  assert.equal(first.repository.git.dirty, false);
  assert.ok(first.repository.languages.some((item) => item.name === "TypeScript"));
  assert.equal(first.repository.languages.some((item) => item.name === "CUE"), false);
  assert.ok(first.repository.manifests.some((item) => item.path === "package.json"));
  assert.ok(first.commands.some((item) => item.command === "npm run build"));
  assert.ok(first.commands.some((item) => item.command === "npm run test"));
  assert.equal(first.commands.some((item) => item.command.includes("start")), false);
  const gitStatus = spawnSync("git", ["status", "--porcelain"], { cwd, encoding: "utf8", shell: false });
  assert.equal(gitStatus.stdout.trim(), "");

  const second = await prepareWorkPacket(cwd, "Update README wording", new Date("2026-09-11T10:00:00Z"));
  assert.equal(second.cached, true);
  assert.equal(second.fingerprint, first.fingerprint);
  assert.equal(second.createdAt, first.createdAt);
});

test("prepare excludes secret content and fingerprints material manifest changes", async (context) => {
  const cwd = await preparedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const first = await prepareWorkPacket(cwd, "Fix application error");
  await fs.writeFile(path.join(cwd, ".env"), "PRIVATE_TOKEN=do-not-leak-this-value\n", "utf8");
  const withSecretChange = await prepareWorkPacket(cwd, "Fix application error");
  assert.equal(JSON.stringify(withSecretChange).includes("do-not-leak-this-value"), false);
  assert.equal(withSecretChange.repository.git.changedFiles.some((file) => file.includes(".env")), false);

  const packagePath = path.join(cwd, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packagePath, "utf8")) as { scripts: Record<string, string> };
  packageJson.scripts.lint = "eslint .";
  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2), "utf8");
  const changed = await prepareWorkPacket(cwd, "Fix application error");
  assert.notEqual(changed.fingerprint, first.fingerprint);
  assert.ok(changed.commands.some((item) => item.command === "npm run lint"));
});

test("prepare fingerprints material project-context changes", async (context) => {
  const cwd = await preparedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));

  const first = await prepareWorkPacket(cwd, "Design a new account feature");
  await updateContext(cwd, "technical.architecture", "Modular monolith with PostgreSQL");
  const changed = await prepareWorkPacket(cwd, "Design a new account feature");
  assert.notEqual(changed.fingerprint, first.fingerprint);
  assert.equal(changed.projectContext["technical.architecture"], "Modular monolith with PostgreSQL");
});

test("prepare warns when an allowlisted package manifest is invalid", async (context) => {
  const cwd = await preparedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await fs.writeFile(path.join(cwd, "package.json"), "{ invalid json\n", "utf8");

  const packet = await prepareWorkPacket(cwd, "Fix application error");
  assert.ok(packet.warnings.some((warning) => warning.includes("Could not parse package.json")));
});

test("prepare respects the repository's JavaScript package manager", async (context) => {
  const cwd = await preparedProject();
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await fs.writeFile(path.join(cwd, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n", "utf8");

  const packet = await prepareWorkPacket(cwd, "Fix application error");
  assert.ok(packet.commands.some((item) => item.command === "pnpm run test"));
  assert.equal(packet.commands.some((item) => item.command === "npm run test"), false);
});
