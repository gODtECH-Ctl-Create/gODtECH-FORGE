import path from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { showContext } from "./context.js";
import { createPlan } from "./planner.js";
import { prepareWorkPacket } from "./preflight.js";
import { latestWorkflowRun, loadWorkflowRun } from "./workflow-run.js";
import { VERSION } from "./version.js";

export const MCP_TOOL_NAMES = ["forge_prepare", "forge_plan", "forge_context", "forge_run_status"] as const;
export type ForgeMcpTool = (typeof MCP_TOOL_NAMES)[number];

const cwdSchema = z.string().min(1).max(500).optional().describe("Absolute or current-working-directory-relative path to the target repository.");
const taskSchema = z.string().min(1).max(4_000).describe("The outcome the coding agent should achieve.");
const idSchema = z.string().min(1).max(200).optional().describe("Optional workflow run ID.");

function targetDirectory(cwd?: string): string {
  return path.resolve(process.cwd(), cwd ?? ".");
}

function result(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

export async function executeForgeTool(name: ForgeMcpTool, args: { cwd?: string; task?: string; id?: string }): Promise<unknown> {
  const cwd = targetDirectory(args.cwd);
  if (name === "forge_prepare") return prepareWorkPacket(cwd, args.task ?? "");
  if (name === "forge_plan") return createPlan(cwd, args.task ?? "");
  if (name === "forge_context") return showContext(cwd);
  return args.id ? loadWorkflowRun(cwd, args.id) : latestWorkflowRun(cwd);
}

export function createForgeMcpServer(): McpServer {
  const server = new McpServer(
    { name: "forge", title: "FORGE", version: VERSION },
    { capabilities: { tools: {} }, instructions: "Use forge_prepare before substantial coding work. It completes deterministic discovery before model reasoning." },
  );

  server.registerTool(
    "forge_prepare",
    {
      title: "Prepare an AI work packet",
      description: "Perform bounded, model-free repository discovery and return reusable task context, risk, commands, and a model-tier hint.",
      inputSchema: z.object({ task: taskSchema, cwd: cwdSchema }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async (args) => result(await executeForgeTool("forge_prepare", args)),
  );

  server.registerTool(
    "forge_plan",
    {
      title: "Plan repository work",
      description: "Classify a task and return proportional capabilities, risk, approvals, workflow, and execution steps.",
      inputSchema: z.object({ task: taskSchema, cwd: cwdSchema }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => result(await executeForgeTool("forge_plan", args)),
  );

  server.registerTool(
    "forge_context",
    {
      title: "Read project context",
      description: "Return the installed project's product, technical, experience, security, and operations context.",
      inputSchema: z.object({ cwd: cwdSchema }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => result(await executeForgeTool("forge_context", args)),
  );

  server.registerTool(
    "forge_run_status",
    {
      title: "Read workflow status",
      description: "Return a named workflow run, or the latest run when no ID is supplied.",
      inputSchema: z.object({ id: idSchema, cwd: cwdSchema }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => result(await executeForgeTool("forge_run_status", args)),
  );

  return server;
}

export function startMcpServer(): void {
  serveStdio(createForgeMcpServer, {
    onerror: (error) => console.error(error.message),
  });
}
