import type { LocaleCode } from '~/config/locales.ts';

/**
 * The resolved metadata for one page in one locale. Structurally this mirrors the
 * Next.js App Router `Metadata` object so the strategy ports one-to-one, but it is
 * consumed by src/components/SeoHead.astro at build time rather than by a framework
 * convention. Everything is required and already absolute by the time it lands here:
 * the page templates cannot forget a canonical or an hreflang cluster.
 */
export type ResolvedMetadata = {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  robots: RobotsDirectives;
  openGraph: OpenGraphMetadata;
  twitter: TwitterMetadata;
  alternates: AlternateLinks;
};

export type RobotsDirectives = {
  index: boolean;
  follow: boolean;
  googleBot: {
    index: boolean;
    follow: boolean;
    'max-snippet': number;
    'max-image-preview': 'none' | 'standard' | 'large';
    'max-video-preview': number;
  };
};

export type OpenGraphImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type OpenGraphMetadata = {
  type: 'website' | 'article';
  siteName: string;
  url: string;
  title: string;
  description: string;
  locale: string;
  alternateLocales: string[];
  images: OpenGraphImage[];
};

export type TwitterMetadata = {
  card: 'summary_large_image';
  title: string;
  description: string;
  images: string[];
  creator: string;
};

export type AlternateLinks = {
  /** hreflang value → absolute URL. Includes a self-reference and `x-default`. */
  languages: Record<string, string>;
};

/** What a page template hands to the metadata engine. Everything else is derived. */
export type MetadataInput = {
  title: string;
  description?: string | undefined;
  keywords?: readonly string[] | undefined;
  /** Site-root-relative path, with leading and trailing slash, no locale prefix. */
  path: string;
  locale: LocaleCode;
  /** Locales in which this exact path exists. Drives the hreflang cluster. */
  availableLocales: readonly LocaleCode[];
  /** Site-root-relative OG image path. Falls back to the site default. */
  ogImage?: string | undefined;
  ogImageAlt?: string | undefined;
  ogType?: 'website' | 'article' | undefined;
  noIndex?: boolean | undefined;
};
