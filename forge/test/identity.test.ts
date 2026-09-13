import assert from "node:assert/strict";
import test from "node:test";
import { forgeIdentityBanner } from "../src/identity.js";

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
