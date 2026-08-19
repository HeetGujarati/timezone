import type { LocaleCode } from './locales.ts';

/**
 * Locales that receive the FULL programmatic page set rather than the launch
 * subset. Empty at launch to protect crawl budget on a new domain — SEO.md
 * documents when and how to flip a locale in here.
 */
export const FULL_PROGRAMMATIC_LOCALES: readonly LocaleCode[] = [];

/** How many city pairs each non-full locale ships, ranked by combined search value. */
export const LOCALISED_PAIR_LIMIT = 100;

/** Ad slots render nothing unless this is exactly "true". */
export const ADS_ENABLED = import.meta.env.PUBLIC_ADS_ENABLED === 'true';

/** Cookieless analytics. Empty string means: emit no analytics at all. */
export const CF_ANALYTICS_TOKEN =
  typeof import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN === 'string'
    ? import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN
    : '';

/** "full" = one OG image per URL. "essential" = shared per entity. */
export const OG_MODE: 'full' | 'essential' =
  import.meta.env.OG_MODE === 'essential' ? 'essential' : 'full';
