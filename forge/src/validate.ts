import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseDocument } from "yaml";
import { getPath } from "./context.js";
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
    const source = await fs.readFile(contextPath, "utf8");
    const document = parseDocument(source);
    const context = document.errors.length === 0 ? document.toJS() : undefined;
    const name = getPath(context, "project.name");
    const status = getPath(context, "project.status");
    const risk = getPath(context, "security.risk_level");

    if (document.errors.length > 0) {
      diagnostics.push({
        id: "context:yaml",
        level: "error",
        message: "Project context is invalid YAML.",
        detail: document.errors[0]!.message,
      });
    }

    diagnostics.push(
      typeof name === "string" && name.trim()
        ? { id: "context:name", level: "ok", message: `Project name: ${name}` }
        : { id: "context:name", level: "error", message: "project.name must be populated." },
    );
    diagnostics.push(
      typeof status === "string" && ["discovery", "planning", "active", "maintenance", "deprecated", "archived"].includes(status)
        ? { id: "context:status", level: "ok", message: `Project status: ${status}` }
        : { id: "context:status", level: "error", message: "project.status is missing or invalid." },
    );
    diagnostics.push(
      typeof risk === "string" && ["low", "medium", "high", "critical"].includes(risk)
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
