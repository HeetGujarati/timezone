#!/usr/bin/env node
/**
 * SEO integrity audit.
 *
 * Duplicate titles and descriptions are the fastest way for a large programmatic
 * site to be classified as thin, and an hreflang pointing at a 404 actively
 * damages the cluster it belongs to. Both are cheap to check and catastrophic to
 * miss, so the build fails on either.
 */
import { decodeEntities, firstMatch, pass, readPages } from './lib/dist.mjs';

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;

const pages = await readPages();
const built = new Set(pages.map((page) => page.url));

const titles = new Map();
const descriptions = new Map();
const problems = {
  missingTitle: [],
  missingDescription: [],
  missingCanonical: [],
  duplicateTitle: [],
  duplicateDescription: [],
  longTitle: [],
  longDescription: [],
  brokenHreflang: [],
  missingSelfHreflang: [],
  missingXDefault: [],
  multipleH1: [],
  missingH1: [],
  relativeCanonical: [],
};

for (const page of pages) {
  const isNoIndex = /<meta name="robots" content="noindex/.test(page.html);

  const title = firstMatch(page.html, /<title>([^<]*)<\/title>/);
  const description = firstMatch(page.html, /<meta name="description" content="([^"]*)"/);
  const canonical = firstMatch(page.html, /<link rel="canonical" href="([^"]*)"/);

  if (title === undefined || title.trim() === '') problems.missingTitle.push(page.url);
  if (description === undefined || description.trim() === '') {
    problems.missingDescription.push(page.url);
  }
  if (canonical === undefined) problems.missingCanonical.push(page.url);
  else if (!canonical.startsWith('https://')) problems.relativeCanonical.push(page.url);

  if (title !== undefined) {
    const clean = decodeEntities(title);
    if (clean.length > MAX_TITLE) problems.longTitle.push(`${page.url} (${clean.length})`);
    // noindex pages are excluded from uniqueness: a 404 does not compete.
    if (!isNoIndex) {
      const seen = titles.get(clean);
      if (seen !== undefined) problems.duplicateTitle.push(`"${clean}" — ${seen} and ${page.url}`);
      else titles.set(clean, page.url);
    }
  }

  if (description !== undefined) {
    const clean = decodeEntities(description);
    if (clean.length > MAX_DESCRIPTION) {
      problems.longDescription.push(`${page.url} (${clean.length})`);
    }
    if (!isNoIndex) {
      const seen = descriptions.get(clean);
      if (seen !== undefined) {
        problems.duplicateDescription.push(`"${clean.slice(0, 60)}..." — ${seen} and ${page.url}`);
      } else descriptions.set(clean, page.url);
    }
  }

  const h1Count = (page.html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count === 0) problems.missingH1.push(page.url);
  if (h1Count > 1) problems.multipleH1.push(`${page.url} (${h1Count})`);

  // hreflang: every target must be a page that was actually built.
  const alternates = [
    ...page.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g),
  ];
  if (alternates.length > 0) {
    let hasSelf = false;
    let hasXDefault = false;

    for (const [, hreflang, href] of alternates) {
      if (href === undefined || hreflang === undefined) continue;
      const target = new URL(decodeEntities(href)).pathname;
      if (!built.has(target)) problems.brokenHreflang.push(`${page.url} -> ${hreflang} ${target}`);
      if (target === page.url && hreflang !== 'x-default') hasSelf = true;
      if (hreflang === 'x-default') hasXDefault = true;
    }

    if (!hasSelf) problems.missingSelfHreflang.push(page.url);
    if (!hasXDefault) problems.missingXDefault.push(page.url);
  }
}

const failures = Object.entries(problems).filter(([, list]) => list.length > 0);

if (failures.length > 0) {
  console.error('\nSEO audit failed:\n');
  for (const [name, list] of failures) {
    console.error(`  ${name}: ${list.length}`);
    for (const detail of list.slice(0, 6)) console.error(`    ${detail}`);
    if (list.length > 6) console.error(`    ... and ${list.length - 6} more`);
  }
  process.exit(1);
}

pass(
  `SEO audit: ${pages.length} pages — ${titles.size} unique titles, ${descriptions.size} unique descriptions, 0 duplicates, 0 broken hreflang, every page has one h1 and an absolute canonical`,
);
