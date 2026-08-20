#!/usr/bin/env node
/**
 * SEO integrity audit.
 *
 * Duplicate titles and descriptions are the fastest way for a large programmatic
 * site to be classified as thin, and an hreflang pointing at a 404 actively
 * damages the cluster it belongs to. Both are cheap to check and catastrophic to
 * miss, so the build fails on either.
 *
 * Uniqueness is scoped per locale, not sitewide. Spanish and Brazilian
 * Portuguese both write "Política de cookies"; English and French both write
 * "Contact". Those pages are different pages for different readers, joined by a
 * complete hreflang cluster, and treating them as duplicates would force the
 * copy to be contorted to satisfy the checker.
 *
 * What a sitewide check was really catching is a separate fault with a separate
 * name: a localised page still carrying its English title because no
 * translation exists for it. `untranslated` tests that directly, by comparing
 * each localised page against its own English counterpart.
 */
import { decodeEntities, firstMatch, pass, readPages } from './lib/dist.mjs';

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;

const pages = await readPages();
const built = new Set(pages.map((page) => page.url));

/** Per-locale maps: locale -> (text -> first URL seen). */
const titles = new Map();
const descriptions = new Map();
/** English title and description by route, to detect untranslated pages. */
const englishByRoute = new Map();
/** Localised pages, resolved against English after every page has been read. */
const localisedByRoute = new Map();

const LOCALE_SEGMENTS = new Set([
  'es', 'pt-br', 'fr', 'de', 'it', 'ru', 'tr', 'ar', 'hi', 'id', 'ja', 'ko', 'zh-hans',
]);

/** '/de/guides/x/' -> { locale: 'de', route: '/guides/x/' }. English has no prefix. */
function splitLocale(url) {
  const first = url.split('/')[1] ?? '';
  if (!LOCALE_SEGMENTS.has(first)) return { locale: 'en', route: url };
  return { locale: first, route: url.slice(first.length + 1) };
}

function seenIn(map, locale) {
  let inner = map.get(locale);
  if (inner === undefined) {
    inner = new Map();
    map.set(locale, inner);
  }
  return inner;
}
const problems = {
  missingTitle: [],
  missingDescription: [],
  missingCanonical: [],
  duplicateTitle: [],
  duplicateDescription: [],
  untranslated: [],
  longTitle: [],
  longDescription: [],
  brokenHreflang: [],
  missingSelfHreflang: [],
  missingXDefault: [],
  multipleH1: [],
  missingH1: [],
  relativeCanonical: [],
};

// English first, so a localised page always has its counterpart to compare against.
const ordered = [...pages].sort(
  (a, b) => Number(splitLocale(a.url).locale !== 'en') - Number(splitLocale(b.url).locale !== 'en'),
);

for (const page of ordered) {
  const { locale, route } = splitLocale(page.url);
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
      const seen = seenIn(titles, locale);
      const previous = seen.get(clean);
      if (previous !== undefined) {
        problems.duplicateTitle.push(`"${clean}" — ${previous} and ${page.url}`);
      } else seen.set(clean, page.url);

      if (locale === 'en') {
        englishByRoute.set(route, { ...englishByRoute.get(route), title: clean });
      } else {
        localisedByRoute.set(page.url, { route, title: clean });
      }
    }
  }

  if (description !== undefined) {
    const clean = decodeEntities(description);
    if (clean.length > MAX_DESCRIPTION) {
      problems.longDescription.push(`${page.url} (${clean.length})`);
    }
    if (!isNoIndex) {
      const seen = seenIn(descriptions, locale);
      const previous = seen.get(clean);
      if (previous !== undefined) {
        problems.duplicateDescription.push(
          `"${clean.slice(0, 60)}..." — ${previous} and ${page.url}`,
        );
      } else seen.set(clean, page.url);

      if (locale === 'en') {
        englishByRoute.set(route, { ...englishByRoute.get(route), description: clean });
      } else {
        const entry = localisedByRoute.get(page.url);
        if (entry !== undefined) entry.description = clean;
      }
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

// A page is untranslated when BOTH its title and description still match the
// English original. Requiring both matters: French for "Contact" is "Contact",
// and Spanish and Portuguese share "Política de cookies" — a title-only test
// calls those untranslated when they are correct translations that happen to
// coincide. The descriptions underneath them differ, and that is the tell.
for (const [url, entry] of localisedByRoute) {
  const english = englishByRoute.get(entry.route);
  if (english === undefined) continue;
  if (english.title === entry.title && english.description === entry.description) {
    problems.untranslated.push(`${url} is still the English page`);
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

// `titles` and `descriptions` are keyed by locale, so their sizes are locale counts.
// The figure worth reporting is how many distinct strings those locale buckets hold.
const countStrings = (byLocale) =>
  [...byLocale.values()].reduce((total, seen) => total + seen.size, 0);

pass(
  `SEO audit: ${pages.length} pages across ${titles.size} locales — ${countStrings(titles)} unique titles, ${countStrings(descriptions)} unique descriptions, 0 duplicates within a locale, 0 untranslated pages, 0 broken hreflang, every page has one h1 and an absolute canonical`,
);
