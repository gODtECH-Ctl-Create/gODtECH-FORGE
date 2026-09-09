# Verification

Verification is FORGE's proof layer.

The framework should distinguish between:

- **Automated checks**: objective signals such as tests, type checking, linting, builds, dependency or security checks, and other machine-verifiable conditions.
- **Agent review**: reasoning over architecture, requirements, code paths, failure modes, and consistency.
- **Visual review**: inspecting rendered interfaces when a user-facing experience changes.
- **Human approval**: decisions that require product ownership, business judgment, or explicit risk acceptance.

Future verification tooling should be composable by project type. A static library, web application, mobile application, and data service should not receive identical checks.

The central rule is simple:

> Do not treat an instruction as proof that the instruction was followed.
