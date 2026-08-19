import { LOCALE_CODES, DEFAULT_LOCALE, localePath, type LocaleCode } from '~/config/locales.ts';

/**
 * Locale-aware link helpers for Markdown content.
 *
 * Content lives one directory per locale, so `src/content/pages/de/about.md` is
 * the German about page — but a link written as `/contact/` in that file points
 * at the *English* contact page. Component links go through `hrefFor`; Markdown
 * body links have no such hook.
 *
 * Astro 7's default Markdown processor does not take rehype plugins without
 * swapping the processor out, which would change the rendered HTML of every
 * page on the site for the sake of link prefixing. So translations carry the
 * prefix explicitly, and `content-links.test.ts` fails the build if one is
 * missed — a rule that is checked rather than remembered.
 */

const LOCALE_SEGMENTS = new Set(
  LOCALE_CODES.filter((code) => code !== DEFAULT_LOCALE).map(
    (code) => localePath(code, '/').split('/')[1] ?? '',
  ),
);

/** `src/content/pages/de/about.md` → `de`. Undefined for English or an unknown directory. */
export function localeFromPath(filePath: string | undefined): LocaleCode | undefined {
  if (filePath === undefined) return undefined;
  const segments = filePath.split(/[\\/]/);
  // The directory immediately above the file is the locale.
  const directory = segments[segments.length - 2];
  if (directory === undefined) return undefined;
  const match = LOCALE_CODES.find((code) => code === directory);
  return match === DEFAULT_LOCALE ? undefined : match;
}

function alreadyLocalised(pathname: string): boolean {
  return LOCALE_SEGMENTS.has(pathname.split('/')[1] ?? '');
}

/**
 * Paths that exist once for the whole site and must never carry a locale.
 * `/.well-known/` is fixed by RFC 8615; the rest are single files at the root.
 */
function isSiteWide(pathname: string): boolean {
  if (pathname.startsWith('/.well-known/')) return true;
  // A last segment with an extension is a file, not a localised page:
  // /robots.txt, /llms.txt, /sitemap-index.xml, /og/convert/x.png.
  const last = pathname.split('/').filter(Boolean).at(-1) ?? '';
  return last.includes('.');
}

/** Whether a href is a localised site page, and so needs its locale prefix. */
export function isRewritable(href: unknown): href is string {
  if (typeof href !== 'string') return false;
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  if (isSiteWide(href)) return false;
  return !alreadyLocalised(href);
}

export function localiseHref(locale: LocaleCode, href: string): string {
  return localePath(locale, href);
}
