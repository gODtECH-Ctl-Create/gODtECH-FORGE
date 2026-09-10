import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultFrameworkRoot, exists, normalizeRelative, walkFiles, writeText } from "./files.js";
import type { InitReport } from "./types.js";
import { VERSION } from "./version.js";

export interface InitOptions {
  cwd: string;
  dryRun?: boolean;
  force?: boolean;
  frameworkRoot?: string;
  now?: Date;
}

interface PlannedFile {
  relativePath: string;
  content: string;
  projectOwned: boolean;
}

function quoted(value: string): string {
  return JSON.stringify(value);
}

function projectContext(projectName: string, date: string): string {
  return `project:
  name: ${quoted(projectName)}
  status: discovery

product:
  problem: ""
  users: []
  value_proposition: ""
  goals: []
  non_goals: []

market:
  geography: ""
  segment: ""
  competitors: []
  differentiation: ""
  evidence: []

experience:
  platforms: []
  ux_priorities: []
  ui_direction: ""
  accessibility_requirements: []

technical:
  architecture: ""
  stack: []
  integrations: []
  constraints: []

security:
  risk_level: medium
  sensitive_data: []
  compliance_requirements: []

operations:
  deployment_target: ""
  environments: []
  observability_requirements: []

branding:
  product_identity: ${quoted(projectName)}
  forge_provenance:
    readme: required
    metadata: required
    ui: optional
    wording: "Built with gODtECH FORGE — Framework for Orchestrated Reasoning, Governance & Engineering."

forge:
  active_modules: []
  open_questions: []
  material_risks: []
  last_updated: ${date}
`;
}

function manifest(projectName: string, timestamp: string): string {
  return `forge:
  name: gODtECH FORGE
  version: ${VERSION}
  role: development-framework
  attribution:
    readme: required
    metadata: required
    ui: optional

project:
  name: ${quoted(projectName)}
  initialized_at: ${timestamp}
  last_synced_at: ${timestamp}
  installation: cli
`;
}

function initialState(): string {
  return `# Project State

## Current stage
Discovery

## Completed
- FORGE initialized.

## In progress
- Establish verified product and technical context.

## Open questions
- What outcome should the product deliver?
- Who are the primary users?
- Which constraints materially affect architecture and delivery?

## Material risks
- Unknown until project discovery is complete.
`;
}

async function planFiles(options: InitOptions): Promise<PlannedFile[]> {
  const frameworkRoot = options.frameworkRoot ?? defaultFrameworkRoot();
  if (!(await exists(frameworkRoot))) {
    throw new Error(`FORGE framework assets are missing at ${frameworkRoot}`);
  }

  const staticFiles = await walkFiles(frameworkRoot);
  const planned: PlannedFile[] = [];

  for (const source of staticFiles) {
    const relativePath = normalizeRelative(path.relative(frameworkRoot, source));
    planned.push({
      relativePath,
      content: await fs.readFile(source, "utf8"),
      projectOwned: false,
    });
  }

  const projectName = path.basename(path.resolve(options.cwd));
  const now = options.now ?? new Date();
  const timestamp = now.toISOString();
  const date = timestamp.slice(0, 10);

  planned.push(
    {
      relativePath: ".forge/cache/.gitignore",
      content: "*\n!.gitignore\n",
      projectOwned: false,
    },
    {
      relativePath: ".forge/context/project.yaml",
      content: projectContext(projectName, date),
      projectOwned: true,
    },
    {
      relativePath: ".forge/manifest.yaml",
      content: manifest(projectName, timestamp),
      projectOwned: true,
    },
    {
      relativePath: ".forge/state.md",
      content: initialState(),
      projectOwned: true,
    },
  );

  return planned;
}

export async function initProject(options: InitOptions): Promise<InitReport> {
  const cwd = path.resolve(options.cwd);
  await fs.mkdir(cwd, { recursive: true });
  const planned = await planFiles({ ...options, cwd });

  const report: InitReport = {
    command: "init",
    ok: true,
    dryRun: options.dryRun ?? false,
    created: [],
    updated: [],
    unchanged: [],
    preserved: [],
    conflicts: [],
  };

  const writes: PlannedFile[] = [];

  for (const file of planned) {
    const target = path.join(cwd, file.relativePath);
    if (!(await exists(target))) {
      report.created.push(file.relativePath);
      writes.push(file);
      continue;
    }

    const current = await fs.readFile(target, "utf8");
    if (current === file.content) {
      report.unchanged.push(file.relativePath);
      continue;
    }

    if (file.projectOwned) {
      report.preserved.push(file.relativePath);
      continue;
    }

    if (options.force) {
      report.updated.push(file.relativePath);
      writes.push(file);
    } else {
      report.conflicts.push(file.relativePath);
    }
  }

  if (report.conflicts.length > 0) {
    report.ok = false;
    return report;
  }

  if (!report.dryRun) {
    for (const file of writes) {
      await writeText(path.join(cwd, file.relativePath), file.content);
    }
  }

  return report;
}
