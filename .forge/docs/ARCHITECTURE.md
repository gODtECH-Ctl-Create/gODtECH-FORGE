# FORGE Architecture

FORGE has five separable concerns:

```text
Agent entry point
      ↓
Orchestration
      ↓
Intelligence + Workflows + Policies
      ↓
Project Context / Decisions / State
      ↓
Verification + external tooling
```

### Agent entry point
`/AGENTS.md` provides the small, discoverable contract an agent should read first.

### Orchestration
`core/` determines what context and modules are relevant to a task. It should stay lightweight.

### Intelligence
`intelligence/` contains domain-specific reasoning guidance. Modules are activated selectively.

### Workflows and policies
`workflows/` define procedures and exit conditions. `policies/` contain cross-cutting guardrails that should not be weakened by project context.

### Project state
`context/`, `decisions/`, and `state.md` contain the living project-specific layer. The agent maintains these as material information changes.

### Verification
`verification/` defines checks and quality gates. Where possible, checks should be executable rather than purely instructional.

The root should remain intentionally small: `README.md`, `AGENTS.md`, optional tool-discovery files such as `.github/`, and the single `.forge/` system directory.
