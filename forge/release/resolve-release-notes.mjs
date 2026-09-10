#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}

function fail(message) {
  console.error(`Release notes error: ${message}`);
  process.exit(1);
}

const root = path.resolve(readOption("--root") ?? process.cwd());
const tag = readOption("--tag") ?? process.env.GITHUB_REF_NAME;
const bodyOutput = readOption("--body-output");

if (!tag) {
  fail("a release tag is required via --tag or GITHUB_REF_NAME.");
}

if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(tag)) {
  fail(`tag ${tag} is not a supported version tag.`);
}

const notesPath = path.join(root, "forge", "release", "notes", `${tag}.md`);
let source;
try {
  source = await fs.readFile(notesPath, "utf8");
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    fail(`curated release notes are required at forge/release/notes/${tag}.md.`);
  }
  throw error;
}

const normalized = source.replace(/\r\n/g, "\n");
const lines = normalized.split("\n");
const heading = lines[0] ?? "";

if (!heading.startsWith("# ") || heading.slice(2).trim().length === 0) {
  fail("the first line must be a '# <release title>' heading.");
}

const title = heading.slice(2).trim();
if (!title.includes(tag)) {
  fail(`the release title must include ${tag}.`);
}

const body = lines.slice(1).join("\n").trim();
if (!body) {
  fail("the curated release body must not be empty.");
}

if (bodyOutput) {
  const outputPath = path.resolve(bodyOutput);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${body}\n`, "utf8");
}

process.stdout.write(`${title}\n`);
