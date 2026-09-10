# FORGE Codex plugin

This local marketplace packages FORGE's provider-neutral MCP server for Codex. Install the CLI from source first so the `forge` executable is available on `PATH`.

```bash
npm ci
npm run build
npm link
codex plugin marketplace add ./forge/codex
codex plugin add forge@personal
```

Start a new Codex thread after installation. The plugin exposes `forge_prepare`, `forge_metrics`, `forge_plan`, `forge_context`, and `forge_run_status`. It does not call a model, execute discovered project commands, modify application source, or approve workflow gates.

Any MCP-compatible client can use the same server without the Codex plugin:

```json
{
  "mcpServers": {
    "forge": {
      "command": "forge",
      "args": ["mcp", "serve"]
    }
  }
}
```
