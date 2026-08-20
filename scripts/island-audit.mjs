#!/usr/bin/env node
/**
 * Every island finds its controls by `data-role`, and every one of those roles has
 * to exist in the prerendered HTML.
 *
 * This is not a hypothetical: the converter shipped with its two `<select>`s
 * missing `data-role="from"` and `data-role="to"`, so `connectedCallback` returned
 * at its first guard and the site's headline tool did nothing at all. Nothing
 * failed — no type error, no console error, no missing asset. The page simply sat
 * there. A guard that reads both halves of the contract is the only thing that
 * catches that class of defect.
 *
 * The roles are read out of the island sources rather than listed here, so the
 * contract cannot drift: an island that starts querying a new role fails this
 * audit until the markup grows one.
 *
 * Usage: node scripts/island-audit.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ISLANDS = resolve(new URL('../src/islands/', import.meta.url).pathname);
const DIST = resolve(new URL('../dist/', import.meta.url).pathname);

const DEFINE = /customElements\.define\(\s*'([a-z][a-z0-9-]*)'/u;
/** Literal lookups, plus the two helpers that take a role as a string argument. */
const ROLE_PATTERNS = [
  /data-role="([a-z][a-z0-9-]*)"/gu,
  /#field\('([a-z][a-z0-9-]*)'\)/gu,
  /#value\('([a-z][a-z0-9-]*)'\)/gu,
];

/** tag → the roles that island queries. */
async function readContracts() {
  const contracts = new Map();
  for (const name of await readdir(ISLANDS)) {
    if (!name.endsWith('.ts') || name.endsWith('.test.ts')) continue;
    const source = await readFile(join(ISLANDS, name), 'utf8');
    const tag = DEFINE.exec(source)?.[1];
    if (tag === undefined) continue;

    const roles = new Set();
    for (const pattern of ROLE_PATTERNS) {
      for (const match of source.matchAll(pattern)) roles.add(match[1]);
    }
    // One island mounts itself on a marker it creates, so its tag never appears in
    // the built HTML. Its roles still have to be there, on at least one page.
    const selfMounting = source.includes(`document.createElement('${tag}')`);
    if (roles.size > 0) {
      contracts.set(tag, { file: name, roles: [...roles].sort(), selfMounting });
    }
  }
  return contracts;
}

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const contracts = await readContracts();
if (contracts.size === 0) {
  console.error('island audit: no islands found — the extraction is broken, not the markup');
  process.exit(1);
}

const failures = [];
const seen = new Map([...contracts.keys()].map((tag) => [tag, 0]));
let pages = 0;

for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  pages += 1;

  for (const [tag, contract] of contracts) {
    const missing = contract.roles.filter((role) => !html.includes(`data-role="${role}"`));

    if (contract.selfMounting) {
      if (missing.length === 0) seen.set(tag, (seen.get(tag) ?? 0) + 1);
      continue;
    }

    if (!html.includes(`<${tag}`)) continue;
    seen.set(tag, (seen.get(tag) ?? 0) + 1);
    if (missing.length > 0) {
      failures.push({ page: file.slice(DIST.length), tag, missing: missing.join(', ') });
    }
  }
}

const unused = [...seen].filter(([, count]) => count === 0).map(([tag]) => tag);

console.log(`island audit: ${pages} pages, ${contracts.size} islands`);
console.table(
  [...contracts].map(([tag, contract]) => ({
    island: tag,
    roles: contract.roles.length,
    pages: seen.get(tag) ?? 0,
  })),
);

if (unused.length > 0) {
  console.error(`\nDefined but never rendered: ${unused.join(', ')}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} pages are missing controls their island needs:`);
  console.table(failures.slice(0, 20));
}

if (failures.length > 0 || unused.length > 0) process.exit(1);
console.log('Every island finds every control it looks for.');
