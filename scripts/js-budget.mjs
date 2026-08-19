#!/usr/bin/env node
/**
 * JavaScript budget.
 *
 * The interactive budget is 30 KB gzipped across the whole site and 15 KB for any
 * single page. Those are not aspirations — a time zone tool that takes two seconds
 * to become usable has failed at the one thing it exists for.
 *
 * Per-page cost follows the module graph rather than just the <script src> tags,
 * because Astro emits modulepreload links for shared chunks and those download
 * with the page.
 */
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { DIST, fail, matchAll, pass, readPages, walkDist } from './lib/dist.mjs';

const SITEWIDE_BUDGET = 30 * 1024;
const PER_PAGE_BUDGET = 15 * 1024;

const gzipCache = new Map();

async function gzippedSize(assetPath) {
  const cached = gzipCache.get(assetPath);
  if (cached !== undefined) return cached;
  const size = gzipSync(await readFile(assetPath)).length;
  gzipCache.set(assetPath, size);
  return size;
}

// 1. Every JavaScript asset in the build.
const assets = [];
for await (const path of walkDist()) {
  if (path.endsWith('.js')) assets.push(path);
}

let sitewide = 0;
const assetSizes = [];
for (const path of assets) {
  const size = await gzippedSize(path);
  sitewide += size;
  assetSizes.push({ name: path.replace(DIST, ''), size });
}

// 2. Per-page cost: scripts plus preloaded module chunks, transitively.
const pages = await readPages();
const worst = [];

for (const page of pages) {
  const referenced = new Set([
    ...matchAll(page.html, /<script[^>]+src="(\/[^"]+\.js)"/g),
    ...matchAll(page.html, /<link[^>]+rel="modulepreload"[^>]+href="(\/[^"]+\.js)"/g),
  ]);

  let total = 0;
  for (const href of referenced) {
    const assetPath = join(DIST, href.replace(/^\//, ''));
    try {
      await stat(assetPath);
      total += await gzippedSize(assetPath);
    } catch {
      /* Referenced asset missing — the link check reports that separately. */
    }
  }

  worst.push({ url: page.url, bytes: total });
}

worst.sort((a, b) => b.bytes - a.bytes);
const heaviest = worst[0];
const problems = [];

if (sitewide > SITEWIDE_BUDGET) {
  problems.push(
    `sitewide JavaScript is ${(sitewide / 1024).toFixed(1)} KB gzipped, over the ${SITEWIDE_BUDGET / 1024} KB budget`,
  );
}

for (const page of worst.filter((entry) => entry.bytes > PER_PAGE_BUDGET)) {
  problems.push(`${page.url} loads ${(page.bytes / 1024).toFixed(1)} KB gzipped`);
}

if (problems.length > 0) {
  fail(`JavaScript budget exceeded`, [
    ...problems,
    '',
    'Largest assets:',
    ...assetSizes
      .sort((a, b) => b.size - a.size)
      .slice(0, 8)
      .map((asset) => `  ${(asset.size / 1024).toFixed(1)} KB  ${asset.name}`),
  ]);
}

pass(
  `JS budget: ${(sitewide / 1024).toFixed(1)} KB gzipped sitewide across ${assets.length} assets (budget ${SITEWIDE_BUDGET / 1024} KB); heaviest page ${heaviest?.url ?? 'n/a'} at ${((heaviest?.bytes ?? 0) / 1024).toFixed(1)} KB (budget ${PER_PAGE_BUDGET / 1024} KB)`,
);
