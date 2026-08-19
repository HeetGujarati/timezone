#!/usr/bin/env node
/**
 * `set:html` bypasses Astro's escaping. Exactly one component is allowed to use it —
 * src/components/JsonLd.astro, which only ever receives JSON.stringify output with
 * `<`, `>` and `&` escaped. Anywhere else it is an XSS hole, so the build fails.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const ALLOWED = new Set(['components/JsonLd.astro']);
const PATTERN = /set:html/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const violations = [];
for await (const path of walk(SRC)) {
  if (!/\.(astro|ts|tsx|js|mjs)$/.test(path)) continue;
  const relativePath = relative(SRC, path);
  if (ALLOWED.has(relativePath)) continue;

  const source = await readFile(path, 'utf8');
  for (const line of source.split('\n').entries()) {
    const [index, text] = line;
    if (PATTERN.test(text)) violations.push(`${relativePath}:${index + 1}: ${text.trim()}`);
    PATTERN.lastIndex = 0;
  }
}

if (violations.length > 0) {
  console.error('set:html found outside src/components/JsonLd.astro:\n');
  for (const violation of violations) console.error(`  ${violation}`);
  console.error('\nBuild HTML with Astro templating, or render text with a plain expression.');
  process.exit(1);
}

console.log(`set:html audit: clean (only ${[...ALLOWED].join(', ')} may use it)`);
