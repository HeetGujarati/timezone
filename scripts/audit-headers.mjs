#!/usr/bin/env node
/**
 * Header audit.
 *
 * The Content Security Policy is the single most consequential line of
 * configuration on a static site, and the easiest to weaken by accident — one
 * 'unsafe-inline' added to fix a stubborn script and the policy stops meaning
 * anything. This checks the built output rather than the source, because the
 * source carries a placeholder and the build is what ships.
 */
import { readFile } from 'node:fs/promises';

const DIST = new URL('../dist/', import.meta.url).pathname;

const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'X-Frame-Options',
];

const REQUIRED_DIRECTIVES = [
  "default-src 'none'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
];

const BANNED_DIRECTIVES = [
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'unsafe-hashes'",
  'data: ; script-src',
];

const problems = [];

const headers = await readFile(`${DIST}_headers`, 'utf8');
const policyLine = /^ {2}Content-Security-Policy: (.+)$/m.exec(headers)?.[1];

if (policyLine === undefined) {
  problems.push('dist/_headers has no Content-Security-Policy line');
} else {
  if (policyLine.includes('__CSP_SCRIPT_SRC__')) {
    problems.push('the CSP placeholder was never replaced — the build integration did not run');
  }
  if (!/script-src 'self' 'sha256-[A-Za-z0-9+/=]{40,}'/.test(policyLine)) {
    problems.push("script-src does not carry 'self' plus at least one SHA-256 hash");
  }
  for (const directive of REQUIRED_DIRECTIVES) {
    if (!policyLine.includes(directive)) problems.push(`CSP is missing: ${directive}`);
  }
  for (const banned of BANNED_DIRECTIVES) {
    if (policyLine.includes(banned)) problems.push(`CSP contains a banned directive: ${banned}`);
  }
}

for (const header of REQUIRED_HEADERS) {
  if (!headers.includes(`${header}:`)) problems.push(`dist/_headers is missing ${header}`);
}

if (!/max-age=63072000; includeSubDomains; preload/.test(headers)) {
  problems.push('HSTS is not set to two years with includeSubDomains and preload');
}

// The other two host formats must carry the identical policy.
for (const [file, pattern] of [
  ['netlify.toml', /Content-Security-Policy = "([^"]+)"/],
  ['vercel.json', /"key": "Content-Security-Policy",\s*"value": "([^"]+)"/],
]) {
  try {
    const contents = await readFile(`${DIST}${file}`, 'utf8');
    const policy = pattern.exec(contents)?.[1];
    if (policy === undefined) problems.push(`${file} carries no Content-Security-Policy`);
    else if (policyLine !== undefined && policy !== policyLine) {
      problems.push(`${file} CSP does not match dist/_headers — one host would break`);
    }
  } catch {
    problems.push(`${file} was not generated`);
  }
}

if (problems.length > 0) {
  console.error('\nHeader audit failed:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

const hashCount = (policyLine?.match(/'sha256-/g) ?? []).length;
console.log(
  `Header audit: CSP with ${hashCount} inline hash${hashCount === 1 ? '' : 'es'}, no unsafe directives, all ${REQUIRED_HEADERS.length} headers present, identical across _headers, netlify.toml and vercel.json`,
);
