#!/usr/bin/env node
import path from "node:path";
import { showContext, updateContext } from "./context.js";
import { doctorProject } from "./doctor.js";
import { initProject } from "./init.js";
import { createPlan } from "./planner.js";
import type { CommandReport, ContextReport, InitReport, OrchestrationPlan, WorkflowRun } from "./types.js";
import { validateProject } from "./validate.js";
import { VERSION } from "./version.js";
import {
  advanceWorkflowRun,
  approveWorkflowRun,
  latestWorkflowRun,
  loadWorkflowRun,
  nextRunStep,
  startWorkflowRun,
} from "./workflow-run.js";

const HELP = `FORGE ${VERSION}

Usage:
  forge init [--cwd <directory>] [--dry-run] [--force] [--json]
  forge doctor [--cwd <directory>] [--json]
  forge validate [--cwd <directory>] [--strict] [--json]
  forge context [--cwd <directory>] [--json]
  forge context set --key <field> --value <value> [--cwd <directory>] [--json]
  forge plan --task <description> [--cwd <directory>] [--json]
  forge run start --task <description> [--cwd <directory>] [--json]
  forge run status [--id <run-id>] [--cwd <directory>] [--json]
  forge run approve --id <run-id> --checkpoint <checkpoint-id> --by <identity> [--cwd <directory>] [--json]
  forge run advance --id <run-id> --evidence <text> [--cwd <directory>] [--json]
  forge --version
  forge --help

Commands:
  init      Safely initialize FORGE in a repository.
  doctor    Diagnose runtime and repository prerequisites.
  validate  Validate the installed framework and project context.
  context   Inspect or safely update allowlisted project-context fields.
  plan      Classify work and produce a risk-aware execution plan.
  run       Start, inspect, approve, and advance persistent workflow runs.
`;

interface Arguments {
  command?: string;
  subcommand?: string;
  cwd: string;
  json: boolean;
  dryRun: boolean;
  force: boolean;
  strict: boolean;
  help: boolean;
  version: boolean;
  task?: string;
  key?: string;
  value?: string;
  id?: string;
  checkpoint?: string;
  by?: string;
  evidence?: string;
}

function requiredValue(argv: string[], index: number, flag: string): string {
  const next = argv[index + 1];
  if (!next) throw new Error(`${flag} requires a value.`);
  return next;
}

function parse(argv: string[]): Arguments {
  const parsed: Arguments = {
    cwd: process.cwd(),
    json: false,
    dryRun: false,
    force: false,
    strict: false,
    help: false,
    version: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]!;
    if (!value.startsWith("-") && !parsed.command) parsed.command = value;
    else if (!value.startsWith("-") && ["context", "run"].includes(parsed.command ?? "") && !parsed.subcommand) parsed.subcommand = value;
    else if (value === "--cwd") {
      parsed.cwd = path.resolve(requiredValue(argv, index, value));
      index += 1;
    } else if (value === "--task") {
      parsed.task = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--key") {
      parsed.key = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--value") {
      parsed.value = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--id") {
      parsed.id = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--checkpoint") {
      parsed.checkpoint = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--by") {
      parsed.by = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--evidence") {
      parsed.evidence = requiredValue(argv, index, value);
      index += 1;
    } else if (value === "--json") parsed.json = true;
    else if (value === "--dry-run") parsed.dryRun = true;
    else if (value === "--force") parsed.force = true;
    else if (value === "--strict") parsed.strict = true;
    else if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--version" || value === "-v") parsed.version = true;
    else throw new Error(`Unknown argument: ${value}`);
  }

  return parsed;
}

function printDiagnostics(report: CommandReport): void {
  for (const diagnostic of report.diagnostics) {
    const symbol = diagnostic.level === "ok" ? "✓" : diagnostic.level === "warning" ? "!" : "✗";
    console.log(`${symbol} ${diagnostic.message}`);
    if (diagnostic.detail) console.log(`  ${diagnostic.detail}`);
  }
}

function printInit(report: InitReport): void {
  console.log(report.dryRun ? "Initialization plan" : "Initialization result");
  for (const [label, files] of [
    ["create", report.created],
    ["update", report.updated],
    ["unchanged", report.unchanged],
    ["preserved", report.preserved],
    ["conflict", report.conflicts],
  ] as const) {
    for (const file of files) console.log(`- ${label}: ${file}`);
  }
  if (report.conflicts.length > 0) console.log("No files were written. Review conflicts or use --force for framework-owned files.");
}

function printContext(report: ContextReport): void {
  if (report.updated) console.log(`Updated ${report.updated}.`);
  console.log(JSON.stringify(report.context, null, 2));
}

function printPlan(plan: OrchestrationPlan): void {
  console.log(`Task: ${plan.task}`);
  console.log(`Classification: ${plan.taskKind}`);
  console.log(`Risk: ${plan.risk}`);
  console.log(`Workflow: ${plan.workflow}`);
  console.log("Capabilities:");
  for (const item of plan.capabilities) console.log(`- ${item.capability}: ${item.reasons.join(" ")}`);
  if (plan.approvals.length > 0) {
    console.log("Required approvals:");
    for (const approval of plan.approvals) console.log(`- ${approval.id}: ${approval.reason}`);
  }
  console.log("Execution plan:");
  for (const [index, item] of plan.steps.entries()) console.log(`${index + 1}. [${item.stage}] ${item.action}`);
}

function printRun(run: WorkflowRun): void {
  console.log(`Run: ${run.id}`);
  console.log(`Status: ${run.status}`);
  console.log(`Task: ${run.task}`);
  console.log(`Progress: ${run.completedSteps.length}/${run.plan.steps.length} steps`);
  const next = nextRunStep(run);
  if (next) console.log(`Next: [${next.stage}] ${next.action}`);
  const unresolved = run.approvals.filter((approval) => !approval.approvedAt);
  if (unresolved.length > 0) {
    console.log("Awaiting approvals:");
    for (const approval of unresolved) console.log(`- ${approval.id}: ${approval.reason}`);
  }
}

async function main(): Promise<number> {
  let args: Arguments;
  try {
    args = parse(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error("Run forge --help for usage.");
    return 2;
  }

  if (args.version) {
    console.log(VERSION);
    return 0;
  }
  if (args.help || !args.command) {
    console.log(HELP);
    return 0;
  }

  if (args.command === "init") {
    const report = await initProject({ cwd: args.cwd, dryRun: args.dryRun, force: args.force });
    args.json ? console.log(JSON.stringify(report, null, 2)) : printInit(report);
    return report.ok ? 0 : 2;
  }

  if (args.command === "plan") {
    const plan = await createPlan(args.cwd, args.task ?? "");
    args.json ? console.log(JSON.stringify(plan, null, 2)) : printPlan(plan);
    return 0;
  }

  if (args.command === "context") {
    if (args.subcommand && args.subcommand !== "set") throw new Error(`Unknown context command: ${args.subcommand}`);
    if (args.subcommand === "set" && (!args.key || args.value === undefined)) throw new Error("context set requires --key and --value.");
    const report =
      args.subcommand === "set"
        ? await updateContext(args.cwd, args.key!, args.value!)
        : await showContext(args.cwd);
    args.json ? console.log(JSON.stringify(report, null, 2)) : printContext(report);
    return 0;
  }

  if (args.command === "run") {
    if (!args.subcommand || !["start", "status", "approve", "advance"].includes(args.subcommand)) {
      throw new Error("run requires one of: start, status, approve, advance.");
    }

    let run: WorkflowRun;
    if (args.subcommand === "start") {
      if (!args.task) throw new Error("run start requires --task.");
      run = await startWorkflowRun(args.cwd, args.task);
    } else if (args.subcommand === "status") {
      run = args.id ? await loadWorkflowRun(args.cwd, args.id) : await latestWorkflowRun(args.cwd);
    } else if (args.subcommand === "approve") {
      if (!args.id || !args.checkpoint || !args.by) {
        throw new Error("run approve requires --id, --checkpoint, and --by.");
      }
      run = await approveWorkflowRun(args.cwd, args.id, args.checkpoint, args.by);
    } else {
      if (!args.id || !args.evidence) throw new Error("run advance requires --id and --evidence.");
      run = await advanceWorkflowRun(args.cwd, args.id, args.evidence);
    }

    args.json ? console.log(JSON.stringify(run, null, 2)) : printRun(run);
    return 0;
  }

  const report =
    args.command === "doctor"
      ? doctorProject(args.cwd)
      : args.command === "validate"
        ? await validateProject(args.cwd, args.strict)
        : undefined;

  if (!report) {
    console.error(`Unknown command: ${args.command}`);
    console.error("Run forge --help for usage.");
    return 2;
  }

  args.json ? console.log(JSON.stringify(report, null, 2)) : printDiagnostics(report);
  return report.ok ? 0 : 1;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
