#!/usr/bin/env node
import { composeLogo } from "@godtech/cli-identity";

function shouldShowIdentity(argv: string[]): boolean {
  if (!process.stdout.isTTY) return false;
  if (argv.includes("--json")) return false;
  if (argv.includes("--help") || argv.includes("-h")) return true;
  const command = argv.find((value) => !value.startsWith("-"));
  return command === undefined;
}

if (shouldShowIdentity(process.argv.slice(2))) {
  const width = Math.max(40, Math.min(128, process.stdout.columns ?? 80));
  console.log(composeLogo("GODTECH", "FORGE", { targetCols: width }));
  console.log("");
  console.log("Framework for Orchestrated Reasoning, Governance & Engineering");
  console.log("");
}

await import("./cli.js");
