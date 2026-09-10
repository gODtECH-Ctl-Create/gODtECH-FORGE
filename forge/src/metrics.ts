import { promises as fs } from "node:fs";
import path from "node:path";
import type { EfficiencyMetricsReport, PrepareMetricEvent, WorkPacket } from "./types.js";

const METRICS_DIRECTORY = path.join(".forge", "metrics");
const METRICS_FILE = "prepare.jsonl";
const MAX_METRICS_BYTES = 5 * 1024 * 1024;
const MAX_EVENTS = 10_000;
const APPROXIMATE_CHARACTERS_PER_TOKEN = 4;

function estimatedTokens(characters: number): number {
  return Math.ceil(characters / APPROXIMATE_CHARACTERS_PER_TOKEN);
}

function finiteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPrepareMetricEvent(value: unknown): value is PrepareMetricEvent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const event = value as Partial<PrepareMetricEvent>;
  return event.schemaVersion === 1 &&
    event.event === "prepare" &&
    typeof event.recordedAt === "string" &&
    typeof event.cacheHit === "boolean" &&
    ["documentation", "research", "security", "infrastructure", "bug", "refactor", "feature"].includes(event.taskKind ?? "") &&
    ["low", "medium", "high", "critical"].includes(event.risk ?? "") &&
    ["economy", "standard", "advanced"].includes(event.suggestedModelTier ?? "") &&
    finiteNonNegative(event.durationMs) &&
    finiteNonNegative(event.candidateContextCharacters) &&
    finiteNonNegative(event.selectedContextCharacters) &&
    finiteNonNegative(event.filesScanned) &&
    finiteNonNegative(event.commandsDiscovered) &&
    finiteNonNegative(event.frameworkReferencesSelected) &&
    finiteNonNegative(event.deterministicStepsCompleted);
}

async function ensureMetricsDirectory(cwd: string): Promise<string> {
  const directory = path.join(cwd, METRICS_DIRECTORY);
  await fs.mkdir(directory, { recursive: true });
  try {
    await fs.writeFile(path.join(directory, ".gitignore"), "*\n!.gitignore\n", { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  return directory;
}

export async function recordPrepareMetric(
  cwd: string,
  packet: WorkPacket,
  candidateContextCharacters: number,
  durationMs: number,
  recordedAt = new Date(),
): Promise<boolean> {
  try {
    const directory = await ensureMetricsDirectory(cwd);
    const event: PrepareMetricEvent = {
      schemaVersion: 1,
      event: "prepare",
      recordedAt: recordedAt.toISOString(),
      cacheHit: packet.cached,
      taskKind: packet.plan.taskKind,
      risk: packet.plan.risk,
      suggestedModelTier: packet.preparation.suggestedModelTier,
      durationMs: Math.max(0, Math.round(durationMs)),
      candidateContextCharacters,
      selectedContextCharacters: packet.preparation.selectedContextCharacters,
      filesScanned: packet.repository.filesScanned,
      commandsDiscovered: packet.commands.length,
      frameworkReferencesSelected: packet.frameworkReferences.length,
      deterministicStepsCompleted: packet.preparation.deterministicWorkCompleted.length,
    };
    await fs.appendFile(path.join(directory, METRICS_FILE), `${JSON.stringify(event)}\n`, "utf8");
    return true;
  } catch {
    return false;
  }
}

function countBy(events: PrepareMetricEvent[], select: (event: PrepareMetricEvent) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of events) {
    const key = select(event);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Number((numerator / denominator).toFixed(4));
}

export async function summarizeEfficiencyMetrics(cwdInput: string): Promise<EfficiencyMetricsReport> {
  const cwd = path.resolve(cwdInput);
  const file = path.join(cwd, METRICS_DIRECTORY, METRICS_FILE);
  let source = "";
  const warnings: string[] = [];

  try {
    const stat = await fs.stat(file);
    if (stat.size > MAX_METRICS_BYTES) warnings.push(`Only the newest ${MAX_METRICS_BYTES} bytes of metrics were analyzed.`);
    const handle = await fs.open(file, "r");
    try {
      const length = Math.min(stat.size, MAX_METRICS_BYTES);
      const buffer = Buffer.alloc(length);
      await handle.read(buffer, 0, length, Math.max(0, stat.size - length));
      source = buffer.toString("utf8");
      if (stat.size > length) source = source.slice(source.indexOf("\n") + 1);
    } finally {
      await handle.close();
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") warnings.push("Metrics could not be read.");
  }

  let malformedEvents = 0;
  const parsed: PrepareMetricEvent[] = [];
  for (const line of source.split(/\r?\n/).filter(Boolean)) {
    try {
      const value: unknown = JSON.parse(line);
      if (isPrepareMetricEvent(value)) parsed.push(value);
      else malformedEvents += 1;
    } catch {
      malformedEvents += 1;
    }
  }
  if (malformedEvents > 0) warnings.push(`${malformedEvents} malformed metric event(s) were ignored.`);
  const events = parsed.slice(-MAX_EVENTS);
  if (parsed.length > events.length) warnings.push(`Only the newest ${MAX_EVENTS} valid events were summarized.`);

  const cacheHits = events.filter((event) => event.cacheHit).length;
  const contextCharactersConsidered = events.reduce((sum, event) => sum + event.candidateContextCharacters, 0);
  const contextCharactersSelected = events.reduce((sum, event) => sum + event.selectedContextCharacters, 0);
  const contextCharactersAvoided = Math.max(0, contextCharactersConsidered - contextCharactersSelected);
  const durationTotal = events.reduce((sum, event) => sum + event.durationMs, 0);

  return {
    command: "metrics",
    events: events.length,
    cacheHits,
    cacheHitRate: ratio(cacheHits, events.length),
    averagePrepareDurationMs: events.length === 0 ? 0 : Math.round(durationTotal / events.length),
    context: {
      charactersConsidered: contextCharactersConsidered,
      charactersSelected: contextCharactersSelected,
      charactersAvoided: contextCharactersAvoided,
      reductionRate: ratio(contextCharactersAvoided, contextCharactersConsidered),
      estimatedTokensConsidered: estimatedTokens(contextCharactersConsidered),
      estimatedTokensSelected: estimatedTokens(contextCharactersSelected),
      estimatedTokensAvoided: estimatedTokens(contextCharactersAvoided),
    },
    modelTiers: countBy(events, (event) => event.suggestedModelTier),
    taskKinds: countBy(events, (event) => event.taskKind),
    deterministicStepsCompleted: events.reduce((sum, event) => sum + event.deterministicStepsCompleted, 0),
    malformedEvents,
    warnings,
    privacy: "Local aggregate only. No task text, filenames, source, repository identity, Git metadata, or secrets are recorded.",
    disclaimer: "Token values use an approximate four-characters-per-token heuristic. They are not provider billing or guaranteed credit savings.",
  };
}
