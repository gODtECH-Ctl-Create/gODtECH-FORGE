#!/usr/bin/env node
import path from "node:path";
import { doctorProject } from "./doctor.js";
import { initProject } from "./init.js";
import type { CommandReport, InitReport } from "./types.js";
import { validateProject } from "./validate.js";
import { VERSION } from "./version.js";

const HELP = `FORGE ${VERSION}

Usage:
  forge init [--cwd <directory>] [--dry-run] [--force] [--json]
  forge doctor [--cwd <directory>] [--json]
  forge validate [--cwd <directory>] [--strict] [--json]
  forge --version
  forge --help

Commands:
  init      Safely initialize FORGE in a repository.
  doctor    Diagnose runtime and repository prerequisites.
  validate  Validate the installed framework and project context.
`;

interface Arguments {
  command?: string;
  cwd: string;
  json: boolean;
  dryRun: boolean;
  force: boolean;
  strict: boolean;
  help: boolean;
  version: boolean;
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
    if (!value.startsWith("-") && !parsed.command) {
      parsed.command = value;
    } else if (value === "--cwd") {
      const next = argv[index + 1];
      if (!next) throw new Error("--cwd requires a directory.");
      parsed.cwd = path.resolve(next);
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
  const heading = report.dryRun ? "Initialization plan" : "Initialization result";
  console.log(heading);
  for (const [label, files] of [
    ["create", report.created],
    ["update", report.updated],
    ["unchanged", report.unchanged],
    ["preserved", report.preserved],
    ["conflict", report.conflicts],
  ] as const) {
    for (const file of files) console.log(`- ${label}: ${file}`);
  }
  if (report.conflicts.length > 0) {
    console.log("No files were written. Review conflicts or use --force for framework-owned files.");
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
    const report = await initProject({
      cwd: args.cwd,
      dryRun: args.dryRun,
      force: args.force,
    });
    args.json ? console.log(JSON.stringify(report, null, 2)) : printInit(report);
    return report.ok ? 0 : 2;
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
