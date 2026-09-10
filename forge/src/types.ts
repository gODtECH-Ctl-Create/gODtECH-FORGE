export type Level = "ok" | "warning" | "error";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type TaskKind = "documentation" | "research" | "security" | "infrastructure" | "bug" | "refactor" | "feature";
export type Capability =
  | "product"
  | "market"
  | "research"
  | "architecture"
  | "design"
  | "engineering"
  | "security"
  | "quality"
  | "operations"
  | "documentation"
  | "provenance"
  | "git-delivery"
  | "efficiency"
  | "verification"
  | "agent-adapter";

export interface Diagnostic {
  id: string;
  level: Level;
  message: string;
  detail?: string;
}

export interface CommandReport {
  command: string;
  ok: boolean;
  diagnostics: Diagnostic[];
}

export interface InitReport {
  command: "init";
  ok: boolean;
  dryRun: boolean;
  created: string[];
  updated: string[];
  unchanged: string[];
  preserved: string[];
  conflicts: string[];
}

export interface ContextReport {
  command: "context";
  ok: boolean;
  file: string;
  updated?: string;
  value?: string;
  context: Record<string, unknown>;
}

export interface ActivatedCapability {
  capability: Capability;
  reasons: string[];
}

export interface ApprovalCheckpoint {
  id: string;
  reason: string;
  required: true;
}

export interface PlanStep {
  id: string;
  stage: string;
  action: string;
  capability: Capability;
}

export interface OrchestrationPlan {
  command: "plan";
  task: string;
  taskKind: TaskKind;
  risk: RiskLevel;
  workflow: "lightweight-delivery" | "standard-delivery" | "secure-delivery" | "research";
  signals: string[];
  capabilities: ActivatedCapability[];
  approvals: ApprovalCheckpoint[];
  steps: PlanStep[];
}

export type WorkflowRunStatus = "awaiting-approval" | "in-progress" | "completed";

export interface WorkflowRunApproval extends ApprovalCheckpoint {
  approvedAt?: string;
  approvedBy?: string;
}

export interface CompletedRunStep {
  stepId: string;
  evidence: string;
  completedAt: string;
}

export interface WorkflowRun {
  schemaVersion: 1;
  id: string;
  status: WorkflowRunStatus;
  createdAt: string;
  updatedAt: string;
  task: string;
  plan: OrchestrationPlan;
  approvals: WorkflowRunApproval[];
  completedSteps: CompletedRunStep[];
}

export interface RepositoryManifest {
  path: string;
  kind: string;
  sha256: string;
}

export interface RepositoryLanguage {
  name: string;
  files: number;
}

export interface DiscoveredCommand {
  name: string;
  command: string;
  source: string;
}

export interface WorkPacket {
  schemaVersion: 1;
  command: "prepare";
  id: string;
  fingerprint: string;
  cached: boolean;
  createdAt: string;
  task: string;
  plan: OrchestrationPlan;
  repository: {
    git: {
      detected: boolean;
      branch?: string;
      commit?: string;
      dirty: boolean;
      changedFiles: string[];
      changedFilesTruncated: boolean;
    };
    filesScanned: number;
    filesOmitted: number;
    manifests: RepositoryManifest[];
    languages: RepositoryLanguage[];
  };
  projectContext: Record<string, unknown>;
  commands: DiscoveredCommand[];
  frameworkReferences: string[];
  preparation: {
    deterministicWorkCompleted: string[];
    modelWorkRemaining: string[];
    suggestedModelTier: "economy" | "standard" | "advanced";
    selectedContextCharacters: number;
    maxContextFiles: number;
    maxContextCharacters: number;
  };
  warnings: string[];
}
