<a name="readme-top"></a>

<div align="center">

# ⚒️ gODtECH FORGE

### **Framework for Orchestrated Reasoning, Governance & Engineering**

**A universal operating framework for intelligent AI-assisted product development.**

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=18&duration=2200&pause=700&color=7C3AED&center=true&vCenter=true&width=1000&lines=Product+Thinking+%7C+Market+Intelligence+%7C+Research;Architecture+%7C+Design+%2F+UX+%7C+Engineering;Security+%7C+Quality+%7C+Verification+%7C+Deployment;Human+Intent+%E2%86%92+AI+Reasoning+%E2%86%92+Verified+Software" alt="Animated FORGE capabilities" />

<p>
  <img src="https://img.shields.io/badge/status-foundation--development-7c3aed?style=for-the-badge" alt="Foundation development" />
  <img src="https://img.shields.io/badge/architecture-polyglot-111827?style=for-the-badge" alt="Polyglot architecture" />
  <img src="https://img.shields.io/badge/AI-agent--ready-0f766e?style=for-the-badge" alt="AI agent ready" />
  <img src="https://img.shields.io/badge/license-TBD-6b7280?style=for-the-badge" alt="License to be decided" />
</p>

<p>
  <a href="#what-is-forge">What is FORGE?</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#intelligence">Intelligence</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

</div>

---

## ⚡ The 30-second version

FORGE is a **reusable development intelligence system** that sits between human product intent and AI execution.

It is designed so an AI agent does not simply receive a feature request and start writing code. Instead, the agent is guided through the reasoning that should happen around the work: what the product is, who it serves, what the market looks like, what should and should not be built, which architecture fits, how the experience should behave, how the system should be secured, and how the result should be verified before it is considered ready.

```text
                    HUMAN INTENT
                         ↓
                 ┌───────────────┐
                 │     FORGE     │
                 └───────┬───────┘
                         ↓
          REASON → DESIGN → ENGINEER
                         ↓
                   VERIFY → SHIP
```

FORGE is **not** a fixed application stack, a single model, or one giant prompt. It is a modular framework that can be applied to very different projects and can activate deeper reasoning only when the task, product, or risk requires it.

<a href="#readme-top">↑ back to top</a>

---

## 🧠 What is FORGE?

FORGE turns good product and engineering practice into a repeatable operating system for AI-assisted development.

### The core idea

> **Build the right thing, the right way, and prove that it works.**

The framework separates four concerns that are often mixed together:

| Concern | FORGE responsibility |
| --- | --- |
| 🧠 Intelligence | Domain reasoning, research, analysis, decisions |
| 🧭 Workflow | What should happen, in what order, and when a stage is complete |
| 🛡️ Policy | Guardrails that should remain true across projects |
| ✅ Enforcement | Automated and human verification of the result |

The project using FORGE owns its product-specific context. FORGE supplies the reusable methodology around it.

---

## 🔁 The lifecycle

<a name="how-it-works"></a>

```text
IDEA
  │
  ▼
DISCOVER ──→ RESEARCH ──→ DEFINE
                            │
                            ▼
                       ARCHITECT
                            │
                            ▼
                         DESIGN
                            │
                            ▼
                          BUILD
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
             SECURE                  TEST
                │                       │
                └───────────┬───────────┘
                            ▼
                          VERIFY
                            │
                            ▼
                         DEPLOY
                            │
                            ▼
                         IMPROVE
                            │
                            └────────────→ next decision
```

Every stage should eventually have an explicit contract:

```text
INPUTS → REASONING → OUTPUTS → EXIT CONDITIONS
```

That means FORGE can tell an agent not only **what to do**, but also what evidence is required before moving forward.

---

## 🧩 Intelligence

<a name="intelligence"></a>

FORGE is intentionally modular. A simple UI adjustment should not load the entire framework. A high-risk authentication change should not receive the same treatment as a copy edit.

| Intelligence | Questions it helps answer |
| --- | --- |
| 🎯 Product | What problem are we solving? What belongs in scope? |
| 📈 Market | Who needs this? What already exists? Where is the opportunity? |
| 🔎 Research | What evidence supports the direction? |
| 🏗️ Architecture | What system shape and technology choices actually fit? |
| 🎨 Design / UX | What should the product feel like and how should users move through it? |
| ⚙️ Engineering | How should it be implemented, tested, maintained, and evolved? |
| 🔐 Security | What can go wrong, and how do we harden against it? |
| 🧪 Quality | How do we know the implementation is correct? |
| 🚀 Operations | How do we deploy, observe, recover, and improve it? |
| 📚 Documentation | How do we leave the project understandable and usable? |

### Selective activation

```text
simple content change
      ↓
engineering + documentation

new product
      ↓
product + market + research + architecture + design + engineering

payment / identity / sensitive data
      ↓
all relevant domains + deeper security + stronger verification
```

The objective is **proportional intelligence**, not maximum ceremony.

---

## 🗃️ Living project context

FORGE keeps project-specific information separate from framework rules.

```text
.forge/
├── context/
│   └── project.yaml        ← evolving product + technical context
├── decisions/              ← important decisions and trade-offs
├── state.md                ← current project state
├── workflows/              ← reusable procedures
├── intelligence/           ← reasoning modules
├── policies/               ← non-negotiable guardrails
├── verification/           ← quality and release gates
└── templates/              ← generated project artifacts
```

The user does not need to manually maintain a giant configuration file. The agent should discover missing context, ask only material questions, research what can be researched, and keep the project-specific layer current as the product evolves.

---

## 🏛️ Architecture

<a name="architecture"></a>

```text
                              FORGE
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
              CONTEXT       INTELLIGENCE    WORKFLOWS
                 │              │              │
                 └──────────────┼──────────────┘
                                │
                           POLICIES
                                │
                           ORCHESTRATION
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
             AI AGENT                    TOOLING
                  │                           │
          ┌───────┼────────┐          ┌───────┼────────┐
          ▼       ▼        ▼          ▼       ▼        ▼
        MCP    CLI      adapters   analysis  verify  observe
                  │                           │
                  └─────────────┬─────────────┘
                                ▼
                         TARGET PROJECT
```

FORGE's implementation stack and the consuming project's application stack are deliberately independent.

A FORGE-powered project can be built with Next.js, Laravel, Django, Go, Rust, .NET, Flutter, or another reasonable stack. FORGE should understand and verify the project instead of forcing its own implementation technologies onto it.

---

## 🛠️ Approved technology baseline

<a name="stack"></a>

<p align="center">
  <img src="https://skillicons.dev/icons?i=rust,ts,nodejs,python,sqlite,githubactions,playwright&perline=8" alt="FORGE technology stack" />
</p>

| Technology | Role inside FORGE |
| --- | --- |
| **Rust** | Core engine and high-confidence local/system tooling |
| **TypeScript + Node.js** | Command-Line Interface (CLI), orchestration glue, integrations, developer tooling |
| **Python** | Research, analysis, scoring, and experimental intelligence tooling |
| **CUE** | Strong configuration modeling and validation |
| **Tree-sitter** | Structural source-code analysis across languages |
| **Open Policy Agent (OPA) + Rego** | Executable policy, security, and governance rules |
| **WebAssembly (WASM)** | Portable execution boundary for selected policies and checks |
| **Model Context Protocol (MCP)** | Agent-facing tools, resources, and prompts |
| **SQLite** | Local project memory, state, evidence, and verification data |
| **Playwright** | Browser, interaction, responsive, and visual verification |
| **GitHub Actions** | Continuous Integration (CI), automated quality gates, and repository workflows |
| **OpenTelemetry** | Traces, metrics, and logs for FORGE operations |
| **Temporal** | Optional durable orchestration for genuinely long-running stateful workflows |

### Stack doctrine

**Every technology must earn its operational cost.** FORGE can be technically sophisticated without making every project consume the full stack.

---

## 🛡️ Verification is part of the product

A successful edit is not the same thing as a verified product.

FORGE is intended to combine multiple levels of evidence:

```text
SOURCE
  ↓
static analysis
  ↓
type / lint checks
  ↓
tests
  ↓
production build
  ↓
security policies
  ↓
runtime checks
  ↓
browser verification
  ↓
visual / responsive review
  ↓
release decision
```

The enforcement layer exists specifically so quality does not depend on the AI remembering every instruction.

---

## 🎨 README & documentation intelligence

FORGE treats the repository README as part of the product experience, not an afterthought.

A generated README can be structured around:

- a strong project hero and positioning statement
- capability and feature matrices
- real screenshots, demos, or animations when available
- architecture and data-flow diagrams
- technology and infrastructure maps
- setup and deployment instructions
- security and operational notes
- current status and roadmap
- design doctrine and product rationale

The README templates inside `.forge/templates/readme/` are designed to generate this style from project context while validating that links, assets, commands, and claims are consistent with the actual repository.

---

## 🔄 How a project uses FORGE

```text
01  Start with an idea
02  Give the idea to an AI agent operating with FORGE
03  FORGE determines what context is missing
04  The agent discovers, asks, researches, and records context
05  Relevant intelligence modules activate
06  Product, architecture, and design decisions become explicit
07  Implementation begins
08  Verification and policy gates run continuously
09  Project context and decisions evolve with the product
10  Ship only when the evidence supports shipping
```

The framework should feel like **one coherent operating system**, even though its capabilities are modular internally.

---

## 📦 Installation model

FORGE currently works as a portable repository framework: early adopters can copy `.forge/` and `AGENTS.md`, while framework contributors can fork this repository.

The planned recommended experience is an installable cross-platform CLI:

```bash
npm install --global @godtech/forge
forge init
forge doctor
forge validate
forge upgrade
```

The CLI will add FORGE to new or existing repositories, preserve project-owned context during upgrades, and keep the consuming project's application stack independent. Normal commands and generated project code use the neutral `forge` / `FORGE` identity; origin attribution is kept to the manifest and one appropriate developer-facing location. Repository-template and manual installation modes will remain supported. See [the installation and distribution contract](.forge/docs/INSTALLATION.md).

---

## 📌 Design doctrine

**Understand before building.** Do not confuse speed with skipping reasoning.

**Reason before defaulting.** Technology and design should be selected for the product, not because an AI model sees the same stack everywhere.

**Build the right thing.** Scope is a decision. Removing unnecessary work is part of good engineering.

**Fix causes, not symptoms.** A patch that hides an architectural problem is not a quality fix.

**Keep intelligence proportional.** More risk and complexity should trigger deeper controls.

**Separate guidance from proof.** Instructions tell the agent what good work looks like. Tooling checks whether it actually happened.

**Keep context alive.** Decisions should remain understandable after the original conversation is gone.

**Protect the guardrails.** Project context can change. Core quality and security policies cannot be weakened simply to make a task easier.

---

## 🗺️ Roadmap

<a name="roadmap"></a>

### Phase I · Foundation

- [x] FORGE system definition
- [x] repository architecture
- [x] project context schema
- [x] core agent contract
- [x] approved technology baseline
- [x] README template system
- [ ] executable core orchestrator

### Phase II · Intelligence

- [ ] product intelligence
- [ ] market intelligence
- [ ] research workflow
- [ ] architecture intelligence
- [ ] design intelligence integration
- [ ] engineering intelligence
- [ ] security intelligence
- [ ] quality intelligence
- [ ] operations intelligence

### Phase III · Enforcement

- [ ] CUE project validation
- [ ] Tree-sitter code analysis
- [ ] OPA / Rego policy engine
- [ ] browser verification with Playwright
- [ ] repository quality gates
- [ ] evidence and verification history

### Phase IV · Agent ecosystem

- [ ] Model Context Protocol (MCP) server
- [ ] FORGE CLI (Command-Line Interface)
- [ ] Codex adapter
- [ ] Claude adapter
- [ ] Cursor adapter
- [ ] GitHub Copilot adapter

### Phase V · Durable intelligence

- [ ] OpenTelemetry observability
- [ ] local intelligence store
- [ ] durable workflow orchestration
- [ ] Temporal integration where justified
- [ ] reusable FORGE project initialization

---

## 📊 Current status

```text
CORE MODEL                 ████████████████████  ESTABLISHED
REPOSITORY FOUNDATION      ████████████████████  ESTABLISHED
CONTEXT MODEL              ████████████████████  ESTABLISHED
README INTELLIGENCE        ████████████░░░░░░░░  FOUNDATION
INTELLIGENCE MODULES       ████░░░░░░░░░░░░░░░░  IN DEVELOPMENT
ORCHESTRATOR               ██░░░░░░░░░░░░░░░░░░  PLANNED
EXECUTABLE VERIFICATION    ██░░░░░░░░░░░░░░░░░░  PLANNED
AGENT ADAPTERS             █░░░░░░░░░░░░░░░░░░░  PLANNED
```

**Foundation development · architecture established · implementation underway**

---

## 🤝 Contributing

FORGE is intended to remain inspectable and modular. Contributions should improve the intelligence model, workflows, tooling, verification, or agent interoperability without turning the framework into an opaque collection of prompts.

Before changing a core rule, consider whether the behavior belongs in:

```text
instruction
knowledge
workflow
policy
or enforcement
```

That distinction is fundamental to the project.

---

<div align="center">

### ⚒️ Forge better products.

**Think first. Build deliberately. Verify reality. Ship with evidence.**

<a href="#readme-top">↑ back to top</a>

</div>
