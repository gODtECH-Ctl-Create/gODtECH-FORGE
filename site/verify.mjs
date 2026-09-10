import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const required = ['index.html', 'styles.css', 'app.js', 'benchmarks/deployguard-001.html', 'benchmarks/controlled-program.html'];
for (const file of required) {
  if (!existsSync(resolve(root, file))) throw new Error(`Missing required site file: ${file}`);
}

const home = readFileSync(resolve(root, 'index.html'), 'utf8');
const benchmark = readFileSync(resolve(root, 'benchmarks/deployguard-001.html'), 'utf8');
const controlled = readFileSync(resolve(root, 'benchmarks/controlled-program.html'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');

const requiredHomeText = [
  'FORGE', 'Install v0.6.0', 'Evidence Lab', '74.7%', 'not a claim of 74.7% credit savings',
  'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass', 'forge init --dry-run',
  'Controlled multi-task benchmarks'
];
for (const text of requiredHomeText) {
  if (!home.includes(text)) throw new Error(`Homepage is missing required copy: ${text}`);
}

const requiredBenchmarkText = [
  'PILOT · DG-BM-001', '28.6% fewer', 'Provider tokens / cost', 'Not available',
  'not provider billing data', 'ab59830', '638be04'
];
for (const text of requiredBenchmarkText) {
  if (!benchmark.includes(text)) throw new Error(`Benchmark page is missing required evidence: ${text}`);
}

const requiredControlledText = [
  'Controlled multi-task benchmarking', 'DG-BM-002', 'DG-BM-003', 'DG-BM-004', 'DG-BM-005',
  'same base commit', 'not claim provider-token or credit savings'
];
for (const text of requiredControlledText) {
  if (!controlled.includes(text)) throw new Error(`Controlled benchmark page is missing required protocol copy: ${text}`);
}

const forbiddenClaims = [
  'guaranteed token savings', 'guaranteed credit savings', '74.7% fewer credits', 'guaranteed hackathon'
];
for (const claim of forbiddenClaims) {
  if ((home + benchmark + controlled).toLowerCase().includes(claim.toLowerCase())) throw new Error(`Unsupported claim found: ${claim}`);
}

if (!css.includes('@media')) throw new Error('Responsive styles are missing.');
console.log('FORGE site verification passed.');
