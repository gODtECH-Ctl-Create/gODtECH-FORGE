import assert from "node:assert/strict";
import test from "node:test";
import { forgeIdentityBanner, shouldShowForgeIdentity } from "../src/identity.js";

test("FORGE identity composes a stable GODTECH wordmark at common widths", () => {
  const wide = forgeIdentityBanner(80);
  const narrow = forgeIdentityBanner(40);

  assert.equal(wide, forgeIdentityBanner(80));
  assert.ok(wide.includes("Framework for Orchestrated Reasoning, Governance & Engineering"));
  assert.ok(narrow.includes("Framework for Orchestrated Reasoning, Governance & Engineering"));

  const wideLogo = wide.split("\n\n", 1)[0] ?? "";
  const narrowLogo = narrow.split("\n\n", 1)[0] ?? "";
  assert.ok(wideLogo.split("\n").every((line) => line.length <= 80));
  assert.ok(narrowLogo.split("\n").every((line) => line.length <= 40));
  assert.match(wideLogo, /[█▀▄]/u);
});

test("FORGE identity supports the shared ASCII fallback", () => {
  const banner = forgeIdentityBanner(80, false);
  const logo = banner.split("\n\n", 1)[0] ?? "";

  assert.ok(logo.includes("#"));
  assert.doesNotMatch(logo, /[█▀▄]/u);
  assert.ok(logo.split("\n").every((line) => line.length <= 80));
});

test("identity is shown only for interactive human-readable commands", () => {
  assert.equal(shouldShowForgeIdentity([], true), true);
  assert.equal(shouldShowForgeIdentity(["--help"], true), true);
  assert.equal(shouldShowForgeIdentity(["doctor"], true), true);
  assert.equal(shouldShowForgeIdentity(["--cwd", "/tmp/repo", "doctor"], true), true);

  assert.equal(shouldShowForgeIdentity(["doctor", "--json"], true), false);
  assert.equal(shouldShowForgeIdentity(["--version"], true), false);
  assert.equal(shouldShowForgeIdentity(["mcp", "serve"], true), false);
  assert.equal(shouldShowForgeIdentity(["--cwd", "/tmp/repo", "mcp", "serve"], true), false);
  assert.equal(shouldShowForgeIdentity(["doctor"], false), false);
  assert.equal(shouldShowForgeIdentity(["doctor"], true, true), false);
});
