import { composeLogo } from "@godtech/cli-identity";

const FORGE_SUBTITLE = "Framework for Orchestrated Reasoning, Governance & Engineering";

export function forgeIdentityBanner(targetCols = process.stdout.columns ?? 80): string {
  const width = Math.max(40, Math.min(128, Math.floor(targetCols)));
  return `${composeLogo("GODTECH", "FORGE", { targetCols: width })}\n\n${FORGE_SUBTITLE}`;
}

export function printForgeIdentity(): void {
  if (!process.stdout.isTTY) return;
  console.log(forgeIdentityBanner());
  console.log("");
}
