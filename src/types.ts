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
