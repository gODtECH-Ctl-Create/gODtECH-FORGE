#!/usr/bin/env node
import { printForgeIdentity } from "./identity.js";

function shouldShowIdentity(argv: string[]): boolean {
  if (!process.stdout.isTTY) return false;
  if (argv.includes("--json")) return false;
  if (argv.includes("--help") || argv.includes("-h")) return true;
  return !argv.some((value) => !value.startsWith("-"));
}

if (shouldShowIdentity(process.argv.slice(2))) printForgeIdentity();

await import("./cli.js");
