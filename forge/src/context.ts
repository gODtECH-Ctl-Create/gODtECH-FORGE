import { promises as fs } from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";
import { exists, writeText } from "./files.js";
import type { ContextReport } from "./types.js";

const EDITABLE_SCALARS = new Set([
  "project.name",
  "project.status",
  "project.owner",
  "product.problem",
  "product.value_proposition",
  "market.geography",
  "market.segment",
  "market.differentiation",
  "experience.ui_direction",
  "technical.architecture",
  "security.risk_level",
  "operations.deployment_target",
  "branding.product_identity",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getPath(root: unknown, dottedPath: string): unknown {
  let current: unknown = root;
  for (const part of dottedPath.split(".")) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }
  return current;
}

export function contextFile(cwd: string): string {
  return path.join(path.resolve(cwd), ".forge", "context", "project.yaml");
}

export async function loadProjectContext(cwd: string): Promise<Record<string, unknown>> {
  const file = contextFile(cwd);
  if (!(await exists(file))) throw new Error("FORGE project context is missing. Run forge init.");
  const source = await fs.readFile(file, "utf8");
  const document = parseDocument(source);
  if (document.errors.length > 0) throw new Error(`Project context is invalid YAML: ${document.errors[0]!.message}`);
  const value: unknown = document.toJS();
  if (!isRecord(value)) throw new Error("Project context must be a YAML mapping.");
  return value;
}

export async function showContext(cwd: string): Promise<ContextReport> {
  return {
    command: "context",
    ok: true,
    file: contextFile(cwd),
    context: await loadProjectContext(cwd),
  };
}

export async function updateContext(cwd: string, key: string, value: string): Promise<ContextReport> {
  if (!EDITABLE_SCALARS.has(key)) {
    throw new Error(`Context field is not editable through the CLI: ${key}`);
  }

  const file = contextFile(cwd);
  const source = await fs.readFile(file, "utf8");
  const document = parseDocument(source);
  if (document.errors.length > 0) throw new Error(`Project context is invalid YAML: ${document.errors[0]!.message}`);

  document.setIn(key.split("."), value);
  document.setIn(["forge", "last_updated"], new Date().toISOString().slice(0, 10));
  await writeText(file, document.toString({ lineWidth: 0 }));

  return {
    command: "context",
    ok: true,
    file,
    updated: key,
    value,
    context: await loadProjectContext(cwd),
  };
}

export function isEditableContextField(key: string): boolean {
  return EDITABLE_SCALARS.has(key);
}
