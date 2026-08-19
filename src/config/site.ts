import { DEFAULT_LOCALE, LOCALE_CODES } from './locales.ts';

/**
 * Canonical origin. Read from PUBLIC_SITE_URL at build time.
 *
 * The fallback exists only so `npm run dev` and CI work without a .env file.
 * DEPLOY.md states plainly: set PUBLIC_SITE_URL to your real domain before the
 * first production build, or canonicals and sitemaps will point at the wrong host.
 */
const FALLBACK_ORIGIN = 'https://meridiem.app';

function readOrigin(): string {
  const raw = import.meta.env.PUBLIC_SITE_URL;
  const value = typeof raw === 'string' && raw.length > 0 ? raw : FALLBACK_ORIGIN;
  // Normalise: absolute, https, no trailing slash, no path.
  const url = new URL(value);
  return `${url.protocol}//${url.host}`;
}

export const SITE = {
  /** Product name. Chosen for brandability, not exact-match keywords — see DECISIONS.md. */
  name: 'Meridiem',
  /** Used in <title> suffixes and OG images. */
  shortName: 'Meridiem',
  tagline: 'Time zone tools that tell you the truth',
  origin: readOrigin(),
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALE_CODES,
  /** Replaced by the owner before launch — tracked in DEPLOY.md "Placeholders". */
  contactEmail: 'hello@example.com',
  securityEmail: 'security@example.com',
  /** Legal entity behind the site. Placeholder until the owner fills it in. */
  legalEntity: '[LEGAL ENTITY NAME]',
  legalJurisdiction: '[JURISDICTION]',
  social: {
    x: '@meridiemapp',
    github: 'meridiem',
  },
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.origin}/`).href;
}
