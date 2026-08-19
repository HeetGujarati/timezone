import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from './locales.ts';

/**
 * Canonical origin. Read from PUBLIC_SITE_URL at build time.
 *
 * The fallback exists only so `npm run dev` and CI work without a .env file.
 * DEPLOY.md states plainly: set PUBLIC_SITE_URL to your real domain before the
 * first production build, or canonicals and sitemaps will point at the wrong host.
 */
const FALLBACK_ORIGIN = 'https://meridiem.app';

function readOrigin(): string {
  const raw = import.meta.env.PUBLIC_SITE_URL ?? process.env['PUBLIC_SITE_URL'];
  const value = typeof raw === 'string' && raw.length > 0 ? raw : FALLBACK_ORIGIN;
  // Normalise: absolute, no trailing slash, no path.
  const url = new URL(value);
  return `${url.protocol}//${url.host}`;
}

export const SITE = {
  /** Product name. Chosen for brandability, not exact-match keywords — see DECISIONS.md. */
  name: 'Meridiem',
  shortName: 'Meridiem',
  tagline: 'Time zone tools that tell you the truth',

  /**
   * Used whenever a page supplies no description of its own. Kept under the
   * 155-character ceiling enforced by src/lib/seo/metadata.ts.
   */
  defaultDescription:
    'Convert time zones, plan meetings across continents and track DST changes. Accurate to the IANA database, free, and fast on any device.',

  /**
   * Site-wide keywords, merged into every page's keyword set and de-duplicated.
   * Deliberately short: keyword stuffing is a liability, not an asset.
   */
  globalKeywords: [
    'time zone converter',
    'world clock',
    'meeting planner',
    'time difference',
    'UTC',
    'daylight saving time',
  ],

  origin: readOrigin(),
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALE_CODES,

  /** Fallback OG image, generated at build into /og/default.png. */
  defaultOgImage: {
    path: '/og/default.png',
    width: 1200,
    height: 630,
    alt: 'Meridiem — time zone converter, meeting planner and world clock',
  },

  creator: {
    name: 'Meridiem',
    /** Replaced by the owner before launch — tracked in DEPLOY.md "Placeholders". */
    url: 'https://meridiem.app',
    x: '@meridiemapp',
    github: 'meridiem',
  },

  /** Replaced by the owner before launch — tracked in DEPLOY.md "Placeholders". */
  contactEmail: 'hello@example.com',
  securityEmail: 'security@example.com',
  legalEntity: '[LEGAL ENTITY NAME]',
  legalJurisdiction: '[JURISDICTION]',
} as const;

/**
 * Open Graph wants underscored territory tags (`en_US`), not the BCP-47 tags used
 * in `<html lang>` and hreflang. Mapped explicitly rather than derived, because
 * the correct territory for a language is a judgement call — pt-BR is Brazil,
 * but `es` targets Spain and `ar` is written in Modern Standard form for the
 * whole region, so it takes the most-populous territory.
 */
const OG_LOCALES: Record<LocaleCode, string> = {
  en: 'en_US',
  es: 'es_ES',
  'pt-BR': 'pt_BR',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  ru: 'ru_RU',
  tr: 'tr_TR',
  ar: 'ar_AR',
  hi: 'hi_IN',
  id: 'id_ID',
  ja: 'ja_JP',
  ko: 'ko_KR',
  'zh-Hans': 'zh_CN',
};

export function toOpenGraphLocale(locale: LocaleCode): string {
  return OG_LOCALES[locale];
}

/** Absolute URL for a site-root-relative path. Always absolute, never with a query string. */
export function absoluteUrl(path: string): string {
  const url = new URL(path, `${SITE.origin}/`);
  url.search = '';
  url.hash = '';
  return url.href;
}
