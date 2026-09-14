#!/usr/bin/env node
import { printForgeIdentity, shouldShowForgeIdentity } from "./identity.js";

const argv = process.argv.slice(2);

if (shouldShowForgeIdentity(argv)) {
  printForgeIdentity({ unicode: !argv.includes("--ascii") });
}

await import("./cli.js");
