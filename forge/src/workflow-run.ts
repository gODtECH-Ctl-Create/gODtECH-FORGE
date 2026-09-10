import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseDocument, stringify } from "yaml";
import { exists } from "./files.js";
import { createPlan } from "./planner.js";
import type {
  CompletedRunStep,
  OrchestrationPlan,
  WorkflowRun,
  WorkflowRunApproval,
  WorkflowRunStatus,
} from "./types.js";

const RUN_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,100}$/;
const RUN_STATUSES = new Set<WorkflowRunStatus>(["awaiting-approval", "in-progress", "completed"]);

export interface StartRunOptions {
  now?: Date;
  id?: string;
}

export interface TransitionOptions {
  now?: Date;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function runsDirectory(cwd: string): string {
  return path.join(path.resolve(cwd), ".forge", "runs");
}

function assertRunId(id: string): void {
  if (!RUN_ID.test(id)) throw new Error(`Invalid workflow run ID: ${id}`);
}

function runFile(cwd: string, id: string): string {
  assertRunId(id);
  return path.join(runsDirectory(cwd), `${id}.yaml`);
}

function timestamp(date = new Date()): string {
  return date.toISOString();
}

function generatedRunId(date: Date): string {
  return `${date.toISOString().replace(/[-:.]/g, "")}-${randomUUID().slice(0, 8)}`;
}

function unresolvedApprovals(run: WorkflowRun): WorkflowRunApproval[] {
  return run.approvals.filter((approval) => !approval.approvedAt);
}

function expectedStatus(run: WorkflowRun): WorkflowRunStatus {
  if (run.completedSteps.length === run.plan.steps.length) return "completed";
  if (unresolvedApprovals(run).length > 0) return "awaiting-approval";
  return "in-progress";
}

function validateRun(value: unknown, expectedId?: string): WorkflowRun {
  if (!isRecord(value)) throw new Error("Workflow run must be a YAML mapping.");
  if (value.schemaVersion !== 1) throw new Error("Unsupported workflow run schema version.");
  if (typeof value.id !== "string" || !RUN_ID.test(value.id)) throw new Error("Workflow run has an invalid ID.");
  if (expectedId && value.id !== expectedId) throw new Error("Workflow run ID does not match its filename.");
  if (typeof value.status !== "string" || !RUN_STATUSES.has(value.status as WorkflowRunStatus)) {
    throw new Error("Workflow run has an invalid status.");
  }
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
    throw new Error("Workflow run timestamps are missing.");
  }
  if (typeof value.task !== "string" || !value.task.trim()) throw new Error("Workflow run task is missing.");
  if (!isRecord(value.plan) || !Array.isArray(value.plan.steps) || !Array.isArray(value.plan.approvals)) {
    throw new Error("Workflow run plan is invalid.");
  }
  if (!Array.isArray(value.approvals) || !Array.isArray(value.completedSteps)) {
    throw new Error("Workflow run transition history is invalid.");
  }

  const run = value as unknown as WorkflowRun;
  const planStepIds = run.plan.steps.map((step) => step.id);
  if (planStepIds.some((id) => typeof id !== "string") || new Set(planStepIds).size !== planStepIds.length) {
    throw new Error("Workflow run plan contains invalid or duplicate steps.");
  }
  if (run.completedSteps.length > planStepIds.length) throw new Error("Workflow run has too many completed steps.");
  run.completedSteps.forEach((item, index) => {
    if (!isRecord(item) || item.stepId !== planStepIds[index] || typeof item.evidence !== "string" || !item.evidence.trim()) {
      throw new Error("Workflow run completed steps do not match the plan order.");
    }
    if (typeof item.completedAt !== "string") throw new Error("Workflow run step timestamp is missing.");
  });

  const checkpointIds = run.plan.approvals.map((approval) => approval.id);
  if (new Set(checkpointIds).size !== checkpointIds.length || run.approvals.length !== checkpointIds.length) {
    throw new Error("Workflow run approvals do not match the plan.");
  }
  run.approvals.forEach((approval, index) => {
    if (!isRecord(approval) || approval.id !== checkpointIds[index] || approval.required !== true) {
      throw new Error("Workflow run approvals do not match the plan.");
    }
    const approved = approval.approvedAt !== undefined || approval.approvedBy !== undefined;
    if (approved && (typeof approval.approvedAt !== "string" || typeof approval.approvedBy !== "string" || !approval.approvedBy.trim())) {
      throw new Error("Workflow run contains an incomplete approval record.");
    }
  });

  if (run.status !== expectedStatus(run)) throw new Error("Workflow run status is inconsistent with its transitions.");
  return run;
}

async function writeRun(cwd: string, run: WorkflowRun): Promise<void> {
  validateRun(run, run.id);
  const file = runFile(cwd, run.id);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, stringify(run, { lineWidth: 0 }), { encoding: "utf8", flag: "wx" });
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export async function loadWorkflowRun(cwd: string, id: string): Promise<WorkflowRun> {
  const file = runFile(cwd, id);
  if (!(await exists(file))) throw new Error(`Workflow run not found: ${id}`);
  const document = parseDocument(await fs.readFile(file, "utf8"));
  if (document.errors.length > 0) throw new Error(`Workflow run is invalid YAML: ${document.errors[0]!.message}`);
  return validateRun(document.toJS(), id);
}

export async function latestWorkflowRun(cwd: string): Promise<WorkflowRun> {
  const directory = runsDirectory(cwd);
  if (!(await exists(directory))) throw new Error("No workflow runs exist. Start one with forge run start.");
  const files = (await fs.readdir(directory))
    .filter((name) => name.endsWith(".yaml"))
    .sort();
  if (!files[0]) throw new Error("No workflow runs exist. Start one with forge run start.");
  const runs = await Promise.all(files.map((name) => loadWorkflowRun(cwd, name.slice(0, -5))));
  runs.sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));
  return runs[0]!;
}

export async function startWorkflowRun(cwd: string, task: string, options: StartRunOptions = {}): Promise<WorkflowRun> {
  const now = options.now ?? new Date();
  const id = options.id ?? generatedRunId(now);
  assertRunId(id);
  if (await exists(runFile(cwd, id))) throw new Error(`Workflow run already exists: ${id}`);

  const plan = await createPlan(cwd, task);
  const at = timestamp(now);
  const run: WorkflowRun = {
    schemaVersion: 1,
    id,
    status: plan.approvals.length > 0 ? "awaiting-approval" : "in-progress",
    createdAt: at,
    updatedAt: at,
    task: plan.task,
    plan,
    approvals: plan.approvals.map((approval) => ({ ...approval })),
    completedSteps: [],
  };
  await writeRun(cwd, run);
  return run;
}

export async function approveWorkflowRun(
  cwd: string,
  id: string,
  checkpointId: string,
  approvedBy: string,
  options: TransitionOptions = {},
): Promise<WorkflowRun> {
  if (!approvedBy.trim()) throw new Error("--by must identify the human approving this checkpoint.");
  const run = await loadWorkflowRun(cwd, id);
  if (run.status === "completed") throw new Error("A completed workflow run cannot be approved.");
  const approval = run.approvals.find((item) => item.id === checkpointId);
  if (!approval) throw new Error(`Approval checkpoint not found: ${checkpointId}`);
  if (approval.approvedAt) throw new Error(`Approval checkpoint is already approved: ${checkpointId}`);

  const at = timestamp(options.now);
  approval.approvedAt = at;
  approval.approvedBy = approvedBy.trim();
  run.updatedAt = at;
  run.status = expectedStatus(run);
  await writeRun(cwd, run);
  return run;
}

export async function advanceWorkflowRun(
  cwd: string,
  id: string,
  evidence: string,
  options: TransitionOptions = {},
): Promise<WorkflowRun> {
  if (!evidence.trim()) throw new Error("--evidence must describe the objective result of the completed step.");
  const run = await loadWorkflowRun(cwd, id);
  if (run.status === "completed") throw new Error("Workflow run is already complete.");
  const unresolved = unresolvedApprovals(run);
  if (unresolved.length > 0) {
    throw new Error(`Workflow run requires approval: ${unresolved.map((item) => item.id).join(", ")}`);
  }

  const next = run.plan.steps[run.completedSteps.length];
  if (!next) throw new Error("Workflow run has no remaining step.");
  const at = timestamp(options.now);
  const completion: CompletedRunStep = { stepId: next.id, evidence: evidence.trim(), completedAt: at };
  run.completedSteps.push(completion);
  run.updatedAt = at;
  run.status = expectedStatus(run);
  await writeRun(cwd, run);
  return run;
}

export function nextRunStep(run: WorkflowRun): OrchestrationPlan["steps"][number] | undefined {
  return run.plan.steps[run.completedSteps.length];
}
