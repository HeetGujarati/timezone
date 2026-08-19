#!/usr/bin/env node
/**
 * Internal link check.
 *
 * Every href to an internal path must resolve to a file that was actually built.
 * A broken internal link on a site whose whole value is cross-linked reference
 * pages is worse than a missing page — it is a page that promises and does not
 * deliver.
 */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, decodeEntities, fail, matchAll, pass, readPages } from './lib/dist.mjs';

const pages = await readPages();
const built = new Set(pages.map((page) => page.url));

async function existsInDist(path) {
  try {
    await access(join(DIST, path));
    return true;
  } catch {
    return false;
  }
}

const broken = [];
let checked = 0;

for (const page of pages) {
  const hrefs = matchAll(page.html, /href="([^"]+)"/g).map(decodeEntities);

  for (const href of hrefs) {
    // External, anchors, and non-http schemes are out of scope.
    if (!href.startsWith('/') || href.startsWith('//')) continue;

    const [pathOnly] = href.split('#');
    if (pathOnly === undefined || pathOnly === '') continue;

    checked += 1;

    if (built.has(pathOnly)) continue;
    // Assets and non-HTML endpoints: check the file itself.
    if (await existsInDist(pathOnly.replace(/^\//, ''))) continue;

    broken.push(`${page.url} -> ${href}`);
  }
}

if (broken.length > 0) {
  fail(`Broken internal links: ${broken.length} of ${checked} checked`, broken);
}

pass(`Link check: ${checked} internal links across ${pages.length} pages, 0 broken`);
