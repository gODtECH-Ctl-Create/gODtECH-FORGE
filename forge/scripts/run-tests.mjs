import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const testDirectory = path.join(repositoryRoot, "dist", "test");
const entries = await fs.readdir(testDirectory);
const tests = entries
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => path.join(testDirectory, name));

if (tests.length === 0) {
  console.error("No compiled tests were found.");
  process.exitCode = 1;
} else {
  const result = spawnSync(process.execPath, ["--test", ...tests], {
    cwd: repositoryRoot,
    shell: false,
    stdio: "inherit",
  });

  process.exitCode = result.status ?? 1;
}
