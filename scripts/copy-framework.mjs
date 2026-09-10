import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetRoot = path.join(repositoryRoot, "dist", "framework");
const forgeTarget = path.join(targetRoot, ".forge");

await fs.rm(targetRoot, { recursive: true, force: true });
await fs.mkdir(forgeTarget, { recursive: true });
await fs.copyFile(path.join(repositoryRoot, "AGENTS.md"), path.join(targetRoot, "AGENTS.md"));
await fs.copyFile(path.join(repositoryRoot, ".forge", "README.md"), path.join(forgeTarget, "README.md"));

for (const directory of [
  "adapters",
  "core",
  "docs",
  "intelligence",
  "policies",
  "schemas",
  "templates",
  "verification",
  "workflows",
]) {
  await fs.cp(
    path.join(repositoryRoot, ".forge", directory),
    path.join(forgeTarget, directory),
    { recursive: true },
  );
}
