import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { exists } from "./files.js";
import type { CommandReport, Diagnostic } from "./types.js";

const REQUIRED_FILES = [
  "AGENTS.md",
  ".forge/manifest.yaml",
  ".forge/context/project.yaml",
  ".forge/policies/CORE.md",
  ".forge/workflows/GIT.md",
  ".forge/schemas/project-context.cue",
  ".forge/cue.mod/module.cue",
] as const;

function scalar(document: string, dottedPath: string): string | undefined {
  const target = dottedPath.split(".");
  const stack: Array<{ indent: number; key: string }> = [];

  for (const line of document.split(/\r?\n/)) {
    if (/^\s*(#|$)/.test(line)) continue;
    const match = /^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
    if (!match) continue;

    const indent = match[1]?.length ?? 0;
    const key = match[2] ?? "";
    const value = (match[3] ?? "").trim();

    while (stack.length > 0 && stack[stack.length - 1]!.indent >= indent) stack.pop();
    const currentPath = [...stack.map((item) => item.key), key];

    if (currentPath.join(".") === target.join(".") && value !== "") {
      return value.replace(/^["']|["']$/g, "");
    }

    if (value === "") stack.push({ indent, key });
  }

  return undefined;
}

function runCue(cwd: string): Diagnostic {
  const version = spawnSync("cue", ["version"], { cwd, encoding: "utf8", shell: false, stdio: "ignore" });
  if (version.status !== 0) {
    return {
      id: "cue",
      level: "warning",
      message: "CUE schema validation was not run.",
      detail: "Install the CUE CLI for complete contract validation.",
    };
  }

  const result = spawnSync(
    "cue",
    ["vet", "-d", "#ProjectContext", "./schemas", "./context/project.yaml"],
    { cwd: path.join(cwd, ".forge"), encoding: "utf8", shell: false },
  );

  return result.status === 0
    ? { id: "cue", level: "ok", message: "Project context satisfies the CUE contract." }
    : {
        id: "cue",
        level: "error",
        message: "Project context failed CUE validation.",
        detail: (result.stderr || result.stdout || "").trim(),
      };
}

export async function validateProject(cwdInput: string, strict = false): Promise<CommandReport> {
  const cwd = path.resolve(cwdInput);
  const diagnostics: Diagnostic[] = [];

  for (const relativePath of REQUIRED_FILES) {
    diagnostics.push(
      (await exists(path.join(cwd, relativePath)))
        ? { id: `file:${relativePath}`, level: "ok", message: `${relativePath} is present.` }
        : { id: `file:${relativePath}`, level: "error", message: `${relativePath} is missing.` },
    );
  }

  const contextPath = path.join(cwd, ".forge", "context", "project.yaml");
  if (await exists(contextPath)) {
    const context = await fs.readFile(contextPath, "utf8");
    const name = scalar(context, "project.name");
    const status = scalar(context, "project.status");
    const risk = scalar(context, "security.risk_level");

    diagnostics.push(
      name
        ? { id: "context:name", level: "ok", message: `Project name: ${name}` }
        : { id: "context:name", level: "error", message: "project.name must be populated." },
    );
    diagnostics.push(
      status && ["discovery", "planning", "active", "maintenance", "deprecated", "archived"].includes(status)
        ? { id: "context:status", level: "ok", message: `Project status: ${status}` }
        : { id: "context:status", level: "error", message: "project.status is missing or invalid." },
    );
    diagnostics.push(
      risk && ["low", "medium", "high", "critical"].includes(risk)
        ? { id: "context:risk", level: "ok", message: `Security risk: ${risk}` }
        : { id: "context:risk", level: "error", message: "security.risk_level is missing or invalid." },
    );

    diagnostics.push(runCue(cwd));
  }

  const hasErrors = diagnostics.some((diagnostic) => diagnostic.level === "error");
  const hasWarnings = diagnostics.some((diagnostic) => diagnostic.level === "warning");

  return {
    command: "validate",
    ok: !hasErrors && !(strict && hasWarnings),
    diagnostics,
  };
}
