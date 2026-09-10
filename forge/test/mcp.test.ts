import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { initProject } from "../src/init.js";
import { executeForgeTool, MCP_TOOL_NAMES } from "../src/mcp.js";

test("MCP exposes a small bounded tool surface", () => {
  assert.deepEqual(MCP_TOOL_NAMES, ["forge_prepare", "forge_metrics", "forge_plan", "forge_context", "forge_run_status"]);
});

test("MCP tools reuse the deterministic planner", async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "forge-mcp-"));
  try {
    await initProject({ cwd });
    const plan = await executeForgeTool("forge_plan", { cwd, task: "Update README wording" }) as { taskKind: string; risk: string };
    assert.equal(plan.taskKind, "documentation");
    assert.equal(plan.risk, "low");
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});

test("stdio transport completes an MCP handshake and lists tools", async () => {
  const child = spawn(process.execPath, [path.resolve("dist/src/cli.js"), "mcp", "serve"], { stdio: ["pipe", "pipe", "pipe"] });
  const output: Buffer[] = [];
  child.stdout.on("data", (chunk: Buffer) => output.push(chunk));
  child.stdin.write(`${JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "forge-test", version: "1.0.0" } },
  })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })}\n`);
  child.stdin.end();
  const code = await new Promise<number | null>((resolve) => child.once("close", resolve));
  assert.equal(code, 0);
  const messages = Buffer.concat(output).toString("utf8").trim().split(/\r?\n/).map((line) => JSON.parse(line));
  assert.equal(messages[0].result.serverInfo.name, "forge");
  assert.deepEqual(messages[1].result.tools.map((tool: { name: string }) => tool.name), MCP_TOOL_NAMES);
});
