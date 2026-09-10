import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseDocument, stringify } from "yaml";
import { getPath, loadProjectContext } from "./context.js";
import { exists } from "./files.js";
import { createPlan } from "./planner.js";
import type {
  Capability,
  DiscoveredCommand,
  OrchestrationPlan,
  RepositoryLanguage,
  RepositoryManifest,
  WorkPacket,
} from "./types.js";
import { VERSION } from "./version.js";

const MAX_FILES = 4_000;
const MAX_CHANGED_FILES = 100;
const MAX_MANIFEST_BYTES = 128 * 1024;
const MAX_CONTEXT_FILES = 12;
const MAX_CONTEXT_CHARACTERS = 12_000;
const IGNORED_DIRECTORIES = new Set([
  ".forge",
  ".git",
  ".idea",
  ".next",
  ".venv",
  ".vscode",
  "__pycache__",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
  "vendor",
  "venv",
]);

const MANIFEST_NAMES: Record<string, string> = {
  "Cargo.toml": "rust",
  "Gemfile": "ruby",
  "Dockerfile": "container",
  "build.gradle": "gradle",
  "build.gradle.kts": "gradle",
  "composer.json": "php",
  "docker-compose.yml": "container",
  "docker-compose.yaml": "container",
  "go.mod": "go",
  "package.json": "node",
  "pom.xml": "maven",
  "pyproject.toml": "python",
  "requirements.txt": "python",
  "tsconfig.json": "typescript",
};

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  ".c": "C",
  ".cpp": "C++",
  ".cs": "C#",
  ".css": "CSS",
  ".cue": "CUE",
  ".go": "Go",
  ".html": "HTML",
  ".java": "Java",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".kt": "Kotlin",
  ".php": "PHP",
  ".py": "Python",
  ".rb": "Ruby",
  ".rs": "Rust",
  ".swift": "Swift",
  ".tf": "Terraform",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".vue": "Vue",
};

interface Inventory {
  files: string[];
  omitted: number;
  languages: RepositoryLanguage[];
  manifests: RepositoryManifest[];
  manifestContents: Map<string, string>;
}

type GitInspection = WorkPacket["repository"]["git"] & { fingerprint: string };

function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalize(file: string): string {
  return file.split(path.sep).join("/");
}

function isIgnored(relativePath: string, name: string): boolean {
  const normalized = normalize(relativePath);
  return IGNORED_DIRECTORIES.has(name) ||
    normalized === ".forge/cache" ||
    normalized.startsWith(".forge/cache/") ||
    normalized === ".forge/runs" ||
    normalized.startsWith(".forge/runs/");
}

function manifestKind(name: string): string | undefined {
  if (MANIFEST_NAMES[name]) return MANIFEST_NAMES[name];
  if (name.endsWith(".csproj") || name.endsWith(".sln")) return "dotnet";
  return undefined;
}

async function inventoryRepository(cwd: string): Promise<Inventory> {
  const files: string[] = [];
  const languageCounts = new Map<string, number>();
  const manifests: RepositoryManifest[] = [];
  const manifestContents = new Map<string, string>();
  let omitted = 0;
  let limitReached = false;

  async function visit(directory: string): Promise<void> {
    if (limitReached) return;
    let entries = await fs.readdir(directory, { withFileTypes: true });
    entries = entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (limitReached) return;
      const absolute = path.join(directory, entry.name);
      const relative = normalize(path.relative(cwd, absolute));
      if (entry.isDirectory()) {
        if (isIgnored(relative, entry.name)) continue;
        await visit(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      if (files.length >= MAX_FILES) {
        omitted += 1;
        limitReached = true;
        return;
      }
      files.push(relative);
      const language = LANGUAGE_EXTENSIONS[path.extname(entry.name).toLowerCase()];
      if (language) languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);

      const kind = manifestKind(entry.name);
      if (kind && manifests.length < 30) {
        const stat = await fs.stat(absolute);
        if (stat.size <= MAX_MANIFEST_BYTES) {
          const content = await fs.readFile(absolute, "utf8");
          manifests.push({ path: relative, kind, sha256: sha256(content) });
          manifestContents.set(relative, content);
        }
      }
    }
  }

  await visit(cwd);
  manifests.sort((left, right) => left.path.localeCompare(right.path));
  const languages = [...languageCounts.entries()]
    .map(([name, count]) => ({ name, files: count }))
    .sort((left, right) => right.files - left.files || left.name.localeCompare(right.name))
    .slice(0, 12);
  return { files, omitted, languages, manifests, manifestContents };
}

function runGit(cwd: string, args: string[]): string | undefined {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : undefined;
}

function isSensitivePath(file: string): boolean {
  const segments = normalize(file).toLowerCase().split("/");
  const name = segments.at(-1) ?? "";
  return name === ".env" ||
    name.startsWith(".env.") ||
    name.endsWith(".pem") ||
    name.endsWith(".key") ||
    name.includes("credential") ||
    name.includes("secret") ||
    segments.includes("secrets");
}

function inspectGit(cwd: string): GitInspection {
  const root = runGit(cwd, ["rev-parse", "--show-toplevel"]);
  if (!root) return { detected: false, dirty: false, changedFiles: [], changedFilesTruncated: false, fingerprint: "no-git" };

  const branch = runGit(cwd, ["branch", "--show-current"]) || undefined;
  const commit = runGit(cwd, ["rev-parse", "HEAD"]) || undefined;
  const raw = runGit(cwd, ["status", "--porcelain=v1", "--untracked-files=all"]) ?? "";
  const nonVolatileChanges = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/^"|"$/g, ""))
    .map((file) => file.includes(" -> ") ? file.split(" -> ").at(-1)! : file)
    .map(normalize)
    .filter((file) => !file.startsWith(".forge/cache/") && !file.startsWith(".forge/runs/"))
    .sort();
  const projectChanges = nonVolatileChanges.filter((file) => !file.startsWith(".forge/"));
  const sensitiveChanges = projectChanges.filter(isSensitivePath).length;
  const allChanges = projectChanges.filter((file) => !isSensitivePath(file));
  const changedFiles = allChanges.slice(0, MAX_CHANGED_FILES);
  const trackedHashes = changedFiles.map((file) => {
    const hash = runGit(cwd, ["hash-object", "--", file]);
    return `${file}:${hash ?? "unavailable"}`;
  });
  return {
    detected: true,
    branch,
    commit,
    dirty: nonVolatileChanges.length > 0,
    changedFiles,
    changedFilesTruncated: allChanges.length > changedFiles.length,
    fingerprint: sha256(JSON.stringify({ root, branch, commit, allChanges, sensitiveChanges, trackedHashes })),
  };
}

function discoverCommands(inventory: Inventory): DiscoveredCommand[] {
  const commands: DiscoveredCommand[] = [];
  const files = new Set(inventory.files);
  const packageEntries = [...inventory.manifestContents.entries()].filter(([file]) => file.endsWith("package.json"));
  for (const [file, source] of packageEntries) {
    try {
      const value: unknown = JSON.parse(source);
      if (typeof value !== "object" || value === null || !("scripts" in value)) continue;
      const scripts = (value as { scripts?: unknown }).scripts;
      if (typeof scripts !== "object" || scripts === null || Array.isArray(scripts)) continue;
      const directory = path.posix.dirname(file);
      const at = (name: string): string => directory === "." ? name : `${directory}/${name}`;
      const runner = files.has(at("pnpm-lock.yaml"))
        ? "pnpm"
        : files.has(at("yarn.lock"))
          ? "yarn"
          : files.has(at("bun.lock")) || files.has(at("bun.lockb"))
            ? "bun"
            : "npm";
      for (const name of Object.keys(scripts).sort()) {
        const script = (scripts as Record<string, unknown>)[name];
        if (typeof script === "string" && /^(build|check|lint|test|typecheck|verify)(:|$)/.test(name)) {
          commands.push({ name, command: `${runner} run ${name}`, source: file });
        }
      }
    } catch {
      // Invalid manifests are reported as warnings by prepareWorkPacket.
    }
  }

  const kinds = new Set(inventory.manifests.map((manifest) => manifest.kind));
  if (kinds.has("rust")) commands.push({ name: "test", command: "cargo test", source: "Cargo.toml" });
  if (kinds.has("go")) commands.push({ name: "test", command: "go test ./...", source: "go.mod" });
  if (kinds.has("python")) commands.push({ name: "test", command: "python -m pytest", source: "Python manifest" });
  if (kinds.has("dotnet")) commands.push({ name: "test", command: "dotnet test", source: ".NET manifest" });
  if (kinds.has("maven")) commands.push({ name: "test", command: "mvn test", source: "pom.xml" });
  if (kinds.has("gradle")) commands.push({ name: "test", command: "./gradlew test", source: "Gradle manifest" });

  return commands
    .filter((item, index, list) => list.findIndex((other) => other.command === item.command) === index)
    .slice(0, 30);
}

function boundedValue(value: unknown): unknown {
  if (typeof value === "string") return value.slice(0, 500);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 10).map(boundedValue);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).slice(0, 20).map(([key, item]) => [key, boundedValue(item)]));
  }
  return undefined;
}

function selectContext(context: Record<string, unknown>, plan: OrchestrationPlan): Record<string, unknown> {
  const paths = new Set(["project.name", "project.status", "product.problem", "security.risk_level"]);
  const capabilities = new Set(plan.capabilities.map((item) => item.capability));
  const byCapability: Partial<Record<Capability, string[]>> = {
    product: ["product.value_proposition", "product.goals", "product.non_goals"],
    market: ["market.geography", "market.segment", "market.differentiation"],
    architecture: ["technical.architecture", "technical.stack", "technical.constraints"],
    engineering: ["technical.stack", "technical.integrations", "technical.constraints"],
    design: ["experience.platforms", "experience.ux_priorities", "experience.accessibility_requirements"],
    security: ["security.sensitive_data", "security.compliance_requirements"],
    operations: ["operations.deployment_target", "operations.environments", "operations.observability_requirements"],
    documentation: ["branding.product_identity"],
  };
  for (const capability of capabilities) for (const item of byCapability[capability] ?? []) paths.add(item);

  const selected: Record<string, unknown> = {};
  for (const item of paths) {
    const value = boundedValue(getPath(context, item));
    if (value !== undefined) {
      const candidate = { ...selected, [item]: value };
      if (JSON.stringify(candidate).length <= MAX_CONTEXT_CHARACTERS) selected[item] = value;
    }
  }
  return selected;
}

async function existingFrameworkReferences(cwd: string, plan: OrchestrationPlan): Promise<string[]> {
  const candidates = [
    "AGENTS.md",
    ".forge/policies/CORE.md",
    ".forge/policies/AI-EFFICIENCY.md",
    ".forge/workflows/LIFECYCLE.md",
    ".forge/workflows/GIT.md",
  ];
  const capabilities = new Set(plan.capabilities.map((item) => item.capability));
  if (capabilities.has("security")) candidates.push(".forge/policies/PROVENANCE.md");
  if (capabilities.has("verification") || capabilities.has("quality")) candidates.push(".forge/verification/README.md");
  if (capabilities.has("documentation")) candidates.push(".forge/workflows/README-GENERATION.md");
  if (["product", "market", "research", "architecture", "design", "engineering", "security", "quality", "operations"].some((item) => capabilities.has(item as Capability))) {
    candidates.push(".forge/intelligence/README.md");
  }
  const results = await Promise.all(candidates.map(async (file) => ({ file, present: await exists(path.join(cwd, file)) })));
  return results.filter((item) => item.present).map((item) => item.file).sort().slice(0, MAX_CONTEXT_FILES);
}

function suggestedTier(plan: OrchestrationPlan): WorkPacket["preparation"]["suggestedModelTier"] {
  if (plan.risk === "high" || plan.risk === "critical") return "advanced";
  if (plan.taskKind === "documentation" && plan.risk === "low") return "economy";
  return "standard";
}

function packetFile(cwd: string, fingerprint: string): string {
  return path.join(cwd, ".forge", "cache", "work-packets", `${fingerprint}.yaml`);
}

function validateCachedPacket(value: unknown, fingerprint: string): WorkPacket {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Cached work packet is invalid.");
  const packet = value as WorkPacket;
  if (packet.schemaVersion !== 1 || packet.command !== "prepare" || packet.fingerprint !== fingerprint) {
    throw new Error("Cached work packet does not match its fingerprint.");
  }
  return packet;
}

async function writePacket(file: string, packet: WorkPacket): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, stringify(packet, { lineWidth: 0 }), { encoding: "utf8", flag: "wx" });
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export async function prepareWorkPacket(cwdInput: string, taskInput: string, now = new Date()): Promise<WorkPacket> {
  const cwd = path.resolve(cwdInput);
  const [context, plan, inventory] = await Promise.all([
    loadProjectContext(cwd),
    createPlan(cwd, taskInput),
    inventoryRepository(cwd),
  ]);
  const git = inspectGit(cwd);
  const commands = discoverCommands(inventory);
  const frameworkReferences = await existingFrameworkReferences(cwd, plan);
  const projectContext = selectContext(context, plan);
  const rawContext = await fs.readFile(path.join(cwd, ".forge", "context", "project.yaml"));
  const referenceHashes = await Promise.all(frameworkReferences.map(async (file) => `${file}:${sha256(await fs.readFile(path.join(cwd, file)))}`));
  const fingerprint = sha256(JSON.stringify({
    version: VERSION,
    task: plan.task,
    plan,
    git: git.fingerprint,
    context: sha256(rawContext),
    manifests: inventory.manifests,
    files: inventory.files,
    referenceHashes,
  }));
  const file = packetFile(cwd, fingerprint);

  if (await exists(file)) {
    const document = parseDocument(await fs.readFile(file, "utf8"));
    if (document.errors.length > 0) throw new Error(`Cached work packet is invalid YAML: ${document.errors[0]!.message}`);
    const cached = validateCachedPacket(document.toJS(), fingerprint);
    return { ...cached, cached: true };
  }

  const warnings: string[] = [];
  if (inventory.omitted > 0) warnings.push(`Repository scan reached the ${MAX_FILES}-file limit; ${inventory.omitted} additional files were omitted.`);
  if (git.changedFilesTruncated) warnings.push(`Git changes were limited to ${MAX_CHANGED_FILES} paths.`);
  for (const [fileName, source] of inventory.manifestContents) {
    if (fileName.endsWith("package.json")) {
      try { JSON.parse(source); } catch { warnings.push(`Could not parse ${fileName}; commands from it were omitted.`); }
    }
  }

  const packet: WorkPacket = {
    schemaVersion: 1,
    command: "prepare",
    id: fingerprint.slice(0, 16),
    fingerprint,
    cached: false,
    createdAt: now.toISOString(),
    task: plan.task,
    plan,
    repository: {
      git: {
        detected: git.detected,
        ...(git.branch ? { branch: git.branch } : {}),
        ...(git.commit ? { commit: git.commit } : {}),
        dirty: git.dirty,
        changedFiles: git.changedFiles,
        changedFilesTruncated: git.changedFilesTruncated,
      },
      filesScanned: inventory.files.length,
      filesOmitted: inventory.omitted,
      manifests: inventory.manifests,
      languages: inventory.languages,
    },
    projectContext,
    commands,
    frameworkReferences,
    preparation: {
      deterministicWorkCompleted: [
        "Loaded verified project context.",
        "Classified the task and calculated risk.",
        "Selected relevant capabilities and framework references.",
        "Inventoried repository languages and allowlisted manifests.",
        "Inspected Git state and discovered available verification commands.",
      ],
      modelWorkRemaining: [
        "Resolve only material ambiguity not answered by the packet.",
        "Apply judgment to the selected plan and implement the scoped outcome.",
        "Return evidence for the listed exit conditions.",
      ],
      suggestedModelTier: suggestedTier(plan),
      selectedContextCharacters: JSON.stringify(projectContext).length,
      maxContextFiles: MAX_CONTEXT_FILES,
      maxContextCharacters: MAX_CONTEXT_CHARACTERS,
    },
    warnings,
  };
  await writePacket(file, packet);
  return packet;
}
