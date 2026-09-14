#!/usr/bin/env node
import { printForgeIdentity, shouldShowForgeIdentity } from "./identity.js";

const argv = process.argv.slice(2);
const noBanner = process.env.FORGE_NO_BANNER === "1";
const ascii = process.env.FORGE_ASCII === "1";

if (shouldShowForgeIdentity(argv, Boolean(process.stdout.isTTY), noBanner)) {
  printForgeIdentity({ unicode: !ascii });
}

await import("./cli.js");
