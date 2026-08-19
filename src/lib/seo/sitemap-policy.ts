/**
 * Sitemap priority and change-frequency policy.
 *
 * Both fields are hints that Google has said publicly it ignores; Bing and Yandex
 * still read them. They cost nothing, so they are set deliberately rather than left
 * at a flat default — and, more usefully, the section classifier here is what lets
 * the sitemap index be split by section and locale.
 */
export type PageSection =
  'home' | 'tool' | 'hub' | 'conversion' | 'city' | 'guide' | 'legal' | 'other';

export type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/** Strip a known locale prefix so classification works on the shared path shape. */
export function stripLocalePrefix(pathname: string, localeSegments: readonly string[]): string {
  const match = /^\/([^/]+)\//.exec(pathname);
  const first = match?.[1];
  if (first !== undefined && localeSegments.includes(first)) {
    return pathname.slice(first.length + 1);
  }
  return pathname;
}

export function classifyPath(pathWithoutLocale: string): PageSection {
  const path = pathWithoutLocale.endsWith('/') ? pathWithoutLocale : `${pathWithoutLocale}/`;

  if (path === '/') return 'home';
  if (path === '/convert/' || path === '/time-in/' || path === '/guides/') return 'hub';
  if (path.startsWith('/convert/')) return 'conversion';
  if (path.startsWith('/time-in/')) return 'city';
  if (path.startsWith('/guides/')) return 'guide';
  if (/^\/(privacy|terms|cookies|accessibility|about|contact)\/$/.test(path)) return 'legal';

  const TOOL_PATHS = new Set([
    '/meeting-planner/',
    '/world-clock/',
    '/time-difference/',
    '/working-hours-overlap/',
    '/unix-timestamp-converter/',
    '/duration-calculator/',
    '/countdown/',
    '/utc-time/',
    '/dst-changes/',
  ]);
  if (TOOL_PATHS.has(path)) return 'tool';

  return 'other';
}

const PRIORITY: Record<PageSection, number> = {
  home: 1.0,
  hub: 0.9,
  tool: 0.9,
  conversion: 0.8,
  city: 0.8,
  guide: 0.7,
  legal: 0.3,
  other: 0.5,
};

/**
 * Absolute times are never baked into a prerendered page, so a conversion page's
 * durable content only changes when tzdata does. The cron rebuild runs monthly,
 * and these frequencies say so honestly rather than claiming daily freshness.
 */
const CHANGE_FREQUENCY: Record<PageSection, ChangeFrequency> = {
  home: 'daily',
  hub: 'weekly',
  tool: 'weekly',
  conversion: 'weekly',
  city: 'weekly',
  guide: 'monthly',
  legal: 'yearly',
  other: 'monthly',
};

export function priorityFor(section: PageSection): number {
  return PRIORITY[section];
}

export function changeFrequencyFor(section: PageSection): ChangeFrequency {
  return CHANGE_FREQUENCY[section];
}

/** Non-English pages rank slightly below their English original at launch. */
export function localePriorityPenalty(isDefaultLocale: boolean): number {
  return isDefaultLocale ? 0 : 0.1;
}

export function sitemapEntryFor(
  pathname: string,
  localeSegments: readonly string[],
  isDefaultLocale: boolean,
): { section: PageSection; priority: number; changefreq: ChangeFrequency } {
  const section = classifyPath(stripLocalePrefix(pathname, localeSegments));
  const priority = Number(
    (priorityFor(section) - localePriorityPenalty(isDefaultLocale)).toFixed(2),
  );
  return { section, priority, changefreq: changeFrequencyFor(section) };
}
