import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export const DIST = new URL('../../dist/', import.meta.url).pathname;

/** Every file under dist/, recursively. */
export async function* walkDist(dir = DIST) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDist(path);
    else yield path;
  }
}

/** Every built HTML page, as { url, path, html }. */
export async function readPages() {
  const pages = [];
  for await (const path of walkDist()) {
    if (!path.endsWith('.html')) continue;
    const relativePath = relative(DIST, path);
    const url = `/${relativePath.split(sep).join('/')}`
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '/');
    pages.push({ url, path, html: await readFile(path, 'utf8') });
  }
  return pages.sort((a, b) => a.url.localeCompare(b.url));
}

/** Extract the first capture of every match, or an empty array. */
export function matchAll(html, pattern) {
  return [...html.matchAll(pattern)]
    .map((match) => match[1])
    .filter((value) => value !== undefined);
}

export function firstMatch(html, pattern) {
  return pattern.exec(html)?.[1];
}

/** Decode the handful of entities that appear in attribute values. */
export function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

export function fail(message, details = []) {
  console.error(`\n${message}\n`);
  for (const detail of details.slice(0, 40)) console.error(`  ${detail}`);
  if (details.length > 40) console.error(`  ... and ${details.length - 40} more`);
  process.exit(1);
}

export function pass(message) {
  console.log(message);
}
