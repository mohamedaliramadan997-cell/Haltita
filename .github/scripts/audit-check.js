/* eslint-disable no-console -- CI script, not app code (rules.md §6 covers the app). */
// Runs `npm audit` and fails on any high/critical advisory that is not in
// .github/audit-allowlist.json. Known advisories inside Expo's tree stay visible
// in the log but don't block CI; any new one does.
const { execSync } = require('node:child_process');

const BLOCKING = new Set(['high', 'critical']);
const allowlist = require('../audit-allowlist.json');
const allowed = new Set(allowlist.advisories.map((a) => a.id));

// npm audit exits non-zero whenever it finds anything, so read stdout from the error too.
let output;
try {
  output = execSync('npm audit --json', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (err) {
  output = err.stdout;
}

let report;
try {
  report = JSON.parse(output);
} catch {
  console.error('npm audit did not return JSON:\n' + output);
  process.exit(1);
}
if (report.error) {
  console.error('npm audit failed: ' + JSON.stringify(report.error));
  process.exit(1);
}

// Collect the root advisories (the `via` entries that are objects, not package names).
const advisories = new Map();
for (const vuln of Object.values(report.vulnerabilities || {})) {
  for (const via of vuln.via) {
    if (typeof via !== 'object') continue;
    const id = via.url.split('/').pop();
    if (!advisories.has(id)) advisories.set(id, { id, ...via, packages: new Set() });
    advisories.get(id).packages.add(vuln.name);
  }
}

const blocking = [];
for (const adv of advisories.values()) {
  if (!BLOCKING.has(adv.severity)) continue;
  const tag = allowed.has(adv.id) ? 'allowed ' : 'BLOCKING';
  console.log(`${tag} ${adv.severity.padEnd(8)} ${adv.id} ${adv.name} ${adv.range}: ${adv.title}`);
  if (!allowed.has(adv.id)) blocking.push(adv);
}

for (const id of allowed) {
  if (!advisories.has(id)) {
    console.log(`notice: ${id} is no longer reported; remove it from .github/audit-allowlist.json`);
  }
}

if (blocking.length > 0) {
  console.error(
    `\n${blocking.length} new high/critical advisory(ies). Fix them or, with the owner's approval, add them to the allowlist.`,
  );
  process.exit(1);
}
console.log('\nAudit OK: no new high/critical advisories.');
