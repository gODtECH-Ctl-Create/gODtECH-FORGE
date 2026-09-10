# FORGE Build Specification

## 1. Purpose

FORGE is a reusable, agent-facing operating framework for AI-assisted product development. Its job is to turn human product intent into structured, evidence-driven engineering work.

FORGE should provide five connected capabilities:

```text
UNDERSTAND → REASON → EXECUTE → VERIFY → REMEMBER
```

## 2. System boundary

FORGE implements the development intelligence around a target project. It does not replace the target project's application code, product stack, hosting provider, or AI model.

```text
USER
  ↓
AI AGENT
  ↕
FORGE
  ├── orchestration
  ├── intelligence
  ├── workflows
  ├── policies
  ├── context / memory
  ├── tooling
  └── verification
  ↓
TARGET PROJECT
```

## 3. Product-development lifecycle

```text
IDEA
 ↓
DISCOVER
 ↓
RESEARCH
 ↓
DEFINE
 ↓
ARCHITECT
 ↓
DESIGN
 ↓
BUILD
 ↓
SECURE
 ↓
TEST
 ↓
VERIFY
 ↓
DEPLOY
 ↓
IMPROVE
```

Stages are adaptive. FORGE should not force a full ceremony for a trivial task, but it must not silently skip material product, architecture, security, or quality decisions.

## 4. Core engines

### 4.1 Orchestrator
Determines which context, intelligence modules, workflows, policies, tools, and verification checks apply to the current task.

### 4.2 Context engine
Maintains structured project-specific facts such as users, product goals, market evidence, constraints, architecture, design direction, security risk, deployment targets, open questions, and current state.

### 4.3 Decision system
Records important decisions, alternatives considered, evidence, trade-offs, and consequences. Decisions should remain useful after the original conversation is gone.

### 4.4 Intelligence modules
Domain modules provide reasoning guidance without forcing every task to load every domain.

Expected domains:

- product
- market
- research
- architecture
- design / User Experience (UX) / User Interface (UI)
- engineering
- security
- quality
- operations
- documentation

### 4.5 Workflow engine
Encodes procedures as inputs → actions → outputs → exit conditions.

### 4.6 Policy engine
Holds non-negotiable cross-cutting rules and executable governance. Project context may specialize a policy but must not weaken protected security and quality constraints.

### 4.7 Verification engine
Uses deterministic analysis and runtime checks to establish evidence that implementation and product behavior meet the relevant requirements.

### 4.8 Provenance system
Maintains machine-readable FORGE identity and required attribution for FORGE-enabled projects.

## 5. AI efficiency architecture

FORGE should minimize unnecessary model work.

```text
                 TASK
                   ↓
        CAN TOOLING ANSWER THIS?
             ↙           ↘
           YES             NO
            ↓               ↓
       DETERMINISTIC      MODEL
          TOOLING        REASONING
             ↘             ↙
                  RESULT
```

The system should reuse context, cache valid analysis, load modules selectively, and escalate to deeper model reasoning only when ambiguity, novelty, risk, or complexity warrants it.

## 6. Tooling architecture

Approved baseline responsibilities:

| Technology | Responsibility |
| --- | --- |
| Rust | core engine and high-confidence local/system tooling |
| TypeScript + Node.js | Command-Line Interface (CLI), orchestration glue, integrations |
| Python | research, analysis, scoring, experimentation |
| CUE | configuration and schema validation |
| Tree-sitter | structural source analysis |
| Open Policy Agent (OPA) + Rego | policy and governance evaluation |
| WebAssembly (WASM) | portable execution boundary for selected logic |
| Model Context Protocol (MCP) | agent-facing tools, resources, and prompts |
| SQLite | local state, memory, evidence, and verification history |
| Playwright | browser, interaction, responsive, and visual verification |
| GitHub Actions | repository automation and quality gates |
| OpenTelemetry | traces, metrics, and logs |
| Temporal | optional durable orchestration for long-running workflows |

## 7. Git and delivery contract

Meaningful work should normally follow:

```text
ISSUE → BRANCH → PLAN → IMPLEMENT → VERIFY → COMMIT → PULL REQUEST → REVIEW → MERGE
```

Protected branches must not receive direct implementation pushes. Emergency work may use a hotfix branch but still requires verification and review through the repository's defined safeguards.

## 8. README generation contract

For a new product, the AI should generate the first README early, after enough product context exists to describe the project accurately and before substantial implementation makes the documentation stale from the start.

The README must be product-specific and may use the project's real visual assets, architecture, capabilities, setup, deployment, security, status, and doctrine. It should use the FORGE README reference patterns but never copy another product's identity or claims.

## 9. Verification contract

Verification must be proportional to risk and affected surface.

Possible layers include:

```text
format / lint
→ type checks
→ unit / integration tests
→ build
→ security checks
→ database / migration checks
→ accessibility
→ browser / end-to-end checks
→ responsive / visual verification
→ deployment smoke checks
```

## 10. Human authority

FORGE should identify decisions that require human approval when consequences are material, including significant product scope changes, destructive data operations, security exceptions, legal/compliance decisions, production risk, or irreversible infrastructure changes.

## 11. Integration model

The portable unit is the `.forge/` system plus the required agent-discovery entry point. Optional adapters translate FORGE capabilities for specific agent environments.

The implementation of FORGE must remain independent of the target project's application stack.

## 12. Completion definition

A FORGE task is complete when:

1. the intended outcome is understood;
2. the appropriate workflow and intelligence were applied;
3. implementation is complete;
4. applicable verification has passed or is explicitly blocked with a documented reason;
5. project context and decisions reflect material changes;
6. required documentation and provenance are current;
7. the delivery path is clean and reviewable.
