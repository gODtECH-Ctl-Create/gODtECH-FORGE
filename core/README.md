# FORGE Core

The core is the smallest possible orchestration layer.

It is responsible for deciding:

- what project context is required;
- which intelligence modules apply to a task;
- which workflow stage the project is in;
- what output or decision is required next; and
- which verification gates must run before a task can be considered complete.

The core should remain small. Domain expertise belongs in `intelligence/`, lifecycle procedures belong in `workflows/`, and executable proof belongs in `verification/`.
