import { LOCALES, getLocale, localePath, type LocaleCode } from '~/config/locales.ts';
import { SITE, absoluteUrl, toOpenGraphLocale, getLocaleKeywords } from '~/config/site.ts';
import type {
  AlternateLinks,
  MetadataInput,
  OpenGraphImage,
  ResolvedMetadata,
  RobotsDirectives,
} from './types.ts';

/**
 * Google truncates descriptions around 155–160 characters. The brief's hard ceiling
 * is 155, and scripts/seo-audit.mjs asserts it across every built page, so that is
 * the number enforced here — the ellipsis counts toward it rather than pushing past it.
 */
export const MAX_DESCRIPTION_LENGTH = 155;

/** Titles beyond ~60 characters get cut in the SERP. Asserted at build time. */
export const MAX_TITLE_LENGTH = 60;

const ELLIPSIS = '…';

/**
 * Truncate to the ceiling, breaking at a word boundary so the snippet does not end
 * mid-word. A description already inside the limit is returned untouched.
 */
export function truncateDescription(
  description: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH,
): string {
  const clean = description.trim().replace(/\s+/g, ' ');
  if (clean.length <= maxLength) return clean;

  const hardCut = clean.slice(0, maxLength - ELLIPSIS.length);
  const lastSpace = hardCut.lastIndexOf(' ');
  // Only break at a word boundary if that does not throw away half the snippet.
  const body = lastSpace > maxLength * 0.6 ? hardCut.slice(0, lastSpace) : hardCut;
  return `${body.replace(/[,;:.\s]+$/, '')}${ELLIPSIS}`;
}

/**
 * `[Page Title] | [Site Name]`, unless the page title already carries the brand —
 * "YourWorldTime — time zone converter" must not become "YourWorldTime — … | YourWorldTime".
 *
 * The brand is dropped when appending it would push the title past
 * `MAX_TITLE_LENGTH`. Decision D26: a translated guide title is the part a
 * reader searched for, and several languages need most of the sixty characters
 * to say the same thing English says in forty. Losing the brand costs nothing a
 * search result does not already show under the URL; losing the last four words
 * of the title costs the click.
 */
export function formatTitle(
  title: string,
  siteName: string = SITE.name,
  maxLength: number = MAX_TITLE_LENGTH,
): string {
  const clean = title.trim().replace(/\s+/g, ' ');
  if (clean.toLowerCase().includes(siteName.toLowerCase())) return clean;
  const branded = `${clean} | ${siteName}`;
  return branded.length <= maxLength ? branded : clean;
}

/**
 * Merge page, locale-specific, and global keywords. Case-insensitively de-duplicated,
 * order preserved: page keywords first, then locale keywords, then global.
 */
export function mergeKeywords(
  pageKeywords: readonly string[] = [],
  globalKeywords: readonly string[] = SITE.globalKeywords,
  locale?: LocaleCode,
): string[] {
  const localeKeywords = locale ? getLocaleKeywords(locale) : [];
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const keyword of [...pageKeywords, ...localeKeywords, ...globalKeywords]) {
    const clean = keyword.trim();
    const key = clean.toLowerCase();
    if (clean.length === 0 || seen.has(key)) continue;
    seen.add(key);
    merged.push(clean);
  }
  return merged;
}

export function buildRobots(noIndex = false): RobotsDirectives {
  return {
    index: !noIndex,
    follow: !noIndex,
    googleBot: {
      index: !noIndex,
      follow: !noIndex,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

/**
 * The hreflang cluster for one path.
 *
 * Every entry is absolute and self-referencing, and `x-default` points at the
 * English URL. Locales in which the path does not exist are omitted entirely —
 * an hreflang pointing at a 404 is worse than no hreflang at all, so
 * `availableLocales` is a required input rather than an assumed "all".
 */
export function buildAlternates(
  path: string,
  availableLocales: readonly LocaleCode[],
): AlternateLinks {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    if (!availableLocales.includes(locale.code)) continue;
    languages[locale.hreflang] = absoluteUrl(localePath(locale.code, path));
  }

  const fallbackLocale = availableLocales.includes(SITE.defaultLocale)
    ? SITE.defaultLocale
    : availableLocales[0];
  if (fallbackLocale !== undefined) {
    languages['x-default'] = absoluteUrl(localePath(fallbackLocale, path));
  }

  return { languages };
}

function buildOgImages(imagePath: string | undefined, alt: string): OpenGraphImage[] {
  const image = SITE.defaultOgImage;
  return [
    {
      url: absoluteUrl(imagePath ?? image.path),
      width: image.width,
      height: image.height,
      alt,
    },
  ];
}

/**
 * The one metadata engine every page type goes through. `buildToolMetadata`,
 * `buildInfoMetadata` and `buildArticleMetadata` are thin, opinionated wrappers —
 * they exist so a page cannot accidentally invent its own robots policy or OG type.
 */
export function buildMetadata(input: MetadataInput): ResolvedMetadata {
  const {
    title,
    description,
    keywords,
    path,
    locale,
    availableLocales,
    ogImage,
    ogImageAlt,
    ogType = 'website',
    noIndex = false,
  } = input;

  const resolvedTitle = formatTitle(title);
  const resolvedDescription = truncateDescription(description ?? SITE.defaultDescription);
  const canonical = absoluteUrl(localePath(locale, path));
  // A noindex page is not part of an hreflang cluster. Search engines ignore
  // hreflang that points at pages they will not index, and the 404 pages were
  // emitting thirteen localised annotations that could never be honoured — plus
  // an x-default aimed at English from every one of them, with no self-reference.
  const alternates: AlternateLinks = noIndex
    ? { languages: {} }
    : buildAlternates(path, availableLocales);

  const alternateLocales = availableLocales
    .filter((code) => code !== locale)
    .map((code) => toOpenGraphLocale(code));

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: mergeKeywords(keywords, SITE.globalKeywords, locale),
    canonical,
    robots: buildRobots(noIndex),
    openGraph: {
      type: ogType,
      siteName: SITE.name,
      url: canonical,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: toOpenGraphLocale(locale),
      alternateLocales,
      images: buildOgImages(ogImage, ogImageAlt ?? resolvedTitle),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [absoluteUrl(ogImage ?? SITE.defaultOgImage.path)],
      creator: SITE.creator.x,
    },
    alternates,
  };
}

/** Tool pages: indexable, website-typed, keyword set led by the tool's own terms. */
export function buildToolMetadata(input: MetadataInput): ResolvedMetadata {
  return buildMetadata({ ...input, ogType: 'website' });
}

/** Informational pages (about, privacy, terms): indexable but low-priority. */
export function buildInfoMetadata(input: MetadataInput): ResolvedMetadata {
  return buildMetadata({ ...input, ogType: 'website' });
}

/** Guides: article-typed for Open Graph, so shares render as editorial content. */
export function buildArticleMetadata(input: MetadataInput): ResolvedMetadata {
  return buildMetadata({ ...input, ogType: 'article' });
}

/** `<html lang>` / `<html dir>` for a locale, so templates never hardcode either. */
export function documentAttributes(locale: LocaleCode): { lang: string; dir: 'ltr' | 'rtl' } {
  const { bcp47, dir } = getLocale(locale);
  return { lang: bcp47, dir };
}
