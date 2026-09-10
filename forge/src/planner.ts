import { getPath, loadProjectContext } from "./context.js";
import type {
  ActivatedCapability,
  ApprovalCheckpoint,
  Capability,
  OrchestrationPlan,
  PlanStep,
  RiskLevel,
  TaskKind,
} from "./types.js";

const RISK_RANK: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

const KIND_RULES: Array<{ kind: TaskKind; pattern: RegExp }> = [
  { kind: "security", pattern: /\b(auth|authentication|authorization|oauth|password|secret|credential|encrypt|security|permission)\b/i },
  { kind: "documentation", pattern: /\b(readme|documentation|docs|copy|wording|typo|comment)\b/i },
  { kind: "research", pattern: /\b(research|investigate|compare|market|competitor|feasibility)\b/i },
  { kind: "infrastructure", pattern: /\b(terraform|kubernetes|docker|pipeline|ci\/?cd|deploy|infrastructure|cloud|database migration)\b/i },
  { kind: "bug", pattern: /\b(bug|fix|broken|failure|failing|error|regression|incident)\b/i },
  { kind: "refactor", pattern: /\b(refactor|performance|optimi[sz]e|cleanup|restructure)\b/i },
];

const KIND_CAPABILITIES: Record<TaskKind, Capability[]> = {
  documentation: ["documentation", "verification"],
  research: ["product", "market", "research", "documentation", "verification"],
  security: ["architecture", "engineering", "security", "quality", "verification"],
  infrastructure: ["architecture", "engineering", "operations", "quality", "verification"],
  bug: ["engineering", "quality", "verification"],
  refactor: ["architecture", "engineering", "quality", "verification"],
  feature: ["product", "architecture", "engineering", "quality", "verification"],
};

function maximum(left: RiskLevel, right: RiskLevel): RiskLevel {
  return RISK_RANK[left] >= RISK_RANK[right] ? left : right;
}

function classifyKind(task: string): TaskKind {
  return KIND_RULES.find((rule) => rule.pattern.test(task))?.kind ?? "feature";
}

function addCapability(
  collection: Map<Capability, Set<string>>,
  capability: Capability,
  reason: string,
): void {
  const reasons = collection.get(capability) ?? new Set<string>();
  reasons.add(reason);
  collection.set(capability, reasons);
}

function step(id: string, stage: string, action: string, capability: Capability): PlanStep {
  return { id, stage, action, capability };
}

export async function createPlan(cwd: string, taskInput: string): Promise<OrchestrationPlan> {
  const task = taskInput.trim();
  if (!task) throw new Error("--task must contain a description of the requested outcome.");

  const context = await loadProjectContext(cwd);
  const taskKind = classifyKind(task);
  let risk: RiskLevel = taskKind === "documentation" || taskKind === "research" ? "low" : "medium";
  const signals: string[] = [];
  const approvals: ApprovalCheckpoint[] = [];
  const capabilities = new Map<Capability, Set<string>>();

  for (const capability of KIND_CAPABILITIES[taskKind]) {
    addCapability(capabilities, capability, `Required for ${taskKind} work.`);
  }
  addCapability(capabilities, "efficiency", "Prefer deterministic checks and reuse existing context.");
  addCapability(capabilities, "git-delivery", "Material changes require reviewable delivery.");

  const sensitive = /\b(auth|authentication|authorization|oauth|password|secret|credential|payment|billing|personal data|pii|encrypt|permission)\b/i.test(task);
  const production = /\b(prod|production|live environment|release|customer data)\b/i.test(task);
  const destructive = /\b(drop table|delete (all|database|records|data)|truncate|destroy|purge|reset database|force push)\b/i.test(task);

  if (sensitive) {
    risk = maximum(risk, "high");
    signals.push("Sensitive identity, payment, secret, permission, or personal-data surface detected.");
    addCapability(capabilities, "security", "Sensitive surface requires threat and control review.");
    addCapability(capabilities, "architecture", "Sensitive boundaries require architecture review.");
  }
  if (production) {
    risk = maximum(risk, "high");
    signals.push("Production, release, or customer-data impact detected.");
    addCapability(capabilities, "operations", "Production impact requires deployment and recovery planning.");
    approvals.push({ id: "approve-production-impact", reason: "A human must approve production or customer-data impact.", required: true });
  }
  if (destructive) {
    risk = "critical";
    signals.push("Destructive or difficult-to-recover operation detected.");
    approvals.push({ id: "approve-destructive-operation", reason: "A human must approve the exact destructive target and recovery plan.", required: true });
  }

  const projectRisk = getPath(context, "security.risk_level");
  if ((taskKind === "security" || taskKind === "infrastructure" || sensitive || production) &&
      typeof projectRisk === "string" &&
      ["high", "critical"].includes(projectRisk)) {
    risk = maximum(risk, projectRisk as RiskLevel);
    signals.push(`Project context declares a ${projectRisk} security-risk baseline.`);
  }

  if (risk === "high" || risk === "critical") {
    approvals.unshift({ id: "approve-risk-plan", reason: `A human must approve the ${risk}-risk execution plan before implementation.`, required: true });
    addCapability(capabilities, "security", "High-risk work requires security review.");
    addCapability(capabilities, "verification", "High-risk work requires stronger evidence.");
  }

  const workflow =
    taskKind === "research"
      ? "research"
      : risk === "high" || risk === "critical"
        ? "secure-delivery"
        : taskKind === "documentation" && risk === "low"
          ? "lightweight-delivery"
          : "standard-delivery";

  const steps: PlanStep[] = [
    step("inspect-context", "define", "Confirm repository state, intended outcome, constraints, and existing decisions.", "efficiency"),
  ];
  if (capabilities.has("product")) steps.push(step("define-outcome", "define", "Confirm users, value, scope, and non-goals.", "product"));
  if (capabilities.has("market")) steps.push(step("gather-evidence", "research", "Gather and record only evidence material to the decision.", "research"));
  if (capabilities.has("architecture")) steps.push(step("review-architecture", "architect", "Select the smallest robust design and record trade-offs.", "architecture"));
  if (capabilities.has("security")) steps.push(step("review-security", "secure", "Identify trust boundaries, threats, and required controls.", "security"));
  if (capabilities.has("engineering")) steps.push(step("implement", "build", "Implement the scoped change while preserving unrelated behavior.", "engineering"));
  if (capabilities.has("quality")) steps.push(step("test", "test", "Run checks proportional to the affected surface and risk.", "quality"));
  steps.push(step("verify", "verify", "Collect objective evidence and determine whether exit conditions are met.", "verification"));
  steps.push(step("deliver", "deploy", "Use the repository issue, branch, review, and merge workflow.", "git-delivery"));

  const activated: ActivatedCapability[] = [...capabilities.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([capability, reasons]) => ({ capability, reasons: [...reasons] }));

  return {
    command: "plan",
    task,
    taskKind,
    risk,
    workflow,
    signals,
    capabilities: activated,
    approvals,
    steps,
  };
}
