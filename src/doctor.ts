import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import type { CommandReport, Diagnostic } from "./types.js";

function available(command: string, args: string[], cwd: string): boolean {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    stdio: "ignore",
  });
  return result.status === 0;
}

export function doctorProject(cwdInput: string): CommandReport {
  const cwd = path.resolve(cwdInput);
  const diagnostics: Diagnostic[] = [];
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

  diagnostics.push(
    nodeMajor >= 20
      ? { id: "node", level: "ok", message: `Node.js ${process.versions.node} is supported.` }
      : { id: "node", level: "error", message: "Node.js 20 or newer is required." },
  );

  if (!existsSync(cwd)) {
    diagnostics.push({ id: "directory", level: "error", message: `Directory does not exist: ${cwd}` });
    return { command: "doctor", ok: false, diagnostics };
  }

  diagnostics.push({ id: "directory", level: "ok", message: `Working directory: ${cwd}` });

  diagnostics.push(
    available("git", ["rev-parse", "--is-inside-work-tree"], cwd)
      ? { id: "git", level: "ok", message: "Git repository detected." }
      : { id: "git", level: "warning", message: "No Git repository detected.", detail: "Initialize Git before material delivery work." },
  );

  diagnostics.push(
    existsSync(path.join(cwd, ".forge", "manifest.yaml"))
      ? { id: "forge", level: "ok", message: "FORGE installation detected." }
      : { id: "forge", level: "warning", message: "FORGE is not initialized.", detail: "Run forge init." },
  );

  diagnostics.push(
    available("cue", ["version"], cwd)
      ? { id: "cue", level: "ok", message: "CUE CLI is available." }
      : { id: "cue", level: "warning", message: "CUE CLI is unavailable.", detail: "Basic validation works; install CUE for full schema validation." },
  );

  return {
    command: "doctor",
    ok: diagnostics.every((diagnostic) => diagnostic.level !== "error"),
    diagnostics,
  };
}
