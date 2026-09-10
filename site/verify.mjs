import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const required = ['index.html', 'styles.css', 'app.js', 'benchmarks/deployguard-001.html'];
for (const file of required) {
  if (!existsSync(resolve(root, file))) throw new Error(`Missing required site file: ${file}`);
}

const home = readFileSync(resolve(root, 'index.html'), 'utf8');
const benchmark = readFileSync(resolve(root, 'benchmarks/deployguard-001.html'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');

const requiredHomeText = [
  'FORGE', 'Install v0.6.0', 'Evidence Lab', '74.7%', 'not a claim of 74.7% credit savings',
  'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass', 'forge init --dry-run'
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

const forbiddenClaims = [
  'guaranteed token savings', 'guaranteed credit savings', '74.7% fewer credits', 'guaranteed hackathon'
];
for (const claim of forbiddenClaims) {
  if ((home + benchmark).toLowerCase().includes(claim.toLowerCase())) throw new Error(`Unsupported claim found: ${claim}`);
}

if (!css.includes('@media')) throw new Error('Responsive styles are missing.');
console.log('FORGE site verification passed.');
