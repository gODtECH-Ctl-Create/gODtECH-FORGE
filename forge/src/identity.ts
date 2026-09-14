import { getProduct, renderIdentity } from "@godtech/cli-identity";

const FORGE_IDENTITY = getProduct("forge");

if (!FORGE_IDENTITY) {
  throw new Error("FORGE identity profile is not registered in @godtech/cli-identity.");
}

export interface ForgeIdentityOptions {
  targetCols?: number;
  unicode?: boolean;
}

export function forgeIdentityBanner(
  targetCols = process.stdout.columns ?? 80,
  unicode = true
): string {
  const width = Math.max(40, Math.min(128, Math.floor(targetCols)));
  return renderIdentity(FORGE_IDENTITY, {
    targetCols: width,
    unicode,
  });
}

export function shouldShowForgeIdentity(
  argv: string[],
  isTTY = Boolean(process.stdout.isTTY)
): boolean {
  if (!isTTY) return false;
  if (argv.includes("--json")) return false;
  if (argv.includes("--no-banner")) return false;
  if (argv.includes("--version") || argv.includes("-v")) return false;

  const flagsWithValues = new Set([
    "--cwd",
    "--task",
    "--key",
    "--value",
    "--id",
    "--checkpoint",
    "--by",
    "--evidence",
  ]);

  let command: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]!;
    if (flagsWithValues.has(value)) {
      index += 1;
      continue;
    }
    if (value.startsWith("-")) continue;
    command = value;
    break;
  }

  return command !== "mcp";
}

export function printForgeIdentity(options: ForgeIdentityOptions = {}): void {
  if (!process.stdout.isTTY) return;
  console.log(
    forgeIdentityBanner(
      options.targetCols ?? process.stdout.columns ?? 80,
      options.unicode ?? true
    )
  );
  console.log("");
}
