import { SITE, absoluteUrl } from '~/config/site.ts';
import { localePath, getLocale, type LocaleCode } from '~/config/locales.ts';

/**
 * JSON-LD generators.
 *
 * Every value that reaches a page is serialised with JSON.stringify by
 * src/components/JsonLd.astro — never string concatenation — so a city name
 * containing a quote or an angle bracket cannot break out of the script block.
 */

type SchemaBase = {
  '@context': 'https://schema.org';
  '@type': string;
};

export type WebSiteSchema = SchemaBase & {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  alternateName?: string;
  url: string;
  description: string;
  inLanguage: string;
  publisher: { '@id': string };
  potentialAction: {
    '@type': 'SearchAction';
    target: { '@type': 'EntryPoint'; urlTemplate: string };
    'query-input': string;
  };
};

export type OrganizationSchema = SchemaBase & {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo: { '@type': 'ImageObject'; url: string; width: number; height: number };
  sameAs: string[];
};

export type AggregateRatingInput = {
  ratingValue: number;
  reviewCount: number;
};

export type SoftwareApplicationSchema = SchemaBase & {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: 'UtilitiesApplication';
  applicationSubCategory?: string;
  operatingSystem: string;
  browserRequirements: string;
  inLanguage: string;
  isAccessibleForFree: true;
  offers: {
    '@type': 'Offer';
    price: '0';
    priceCurrency: 'USD';
    availability: 'https://schema.org/InStock';
  };
  featureList?: string[];
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: 5;
    worstRating: 1;
  };
  publisher: { '@id': string };
};

export type HowToStepInput = {
  name: string;
  text: string;
  /** Fragment id on the page this step refers to, e.g. "pick-a-zone". */
  anchor: string;
};

export type HowToSchema = SchemaBase & {
  '@type': 'HowTo';
  name: string;
  description: string;
  totalTime: string;
  inLanguage: string;
  step: {
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
    url: string;
  }[];
};

export type FaqItem = { question: string; answer: string };

export type FaqPageSchema = SchemaBase & {
  '@type': 'FAQPage';
  inLanguage: string;
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[];
};

export type BreadcrumbItem = {
  name: string;
  /** Site-root-relative path without a locale prefix; the last crumb may omit it. */
  path?: string;
};

export type BreadcrumbListSchema = SchemaBase & {
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
};

export type ArticleSchema = SchemaBase & {
  '@type': 'Article';
  headline: string;
  description: string;
  inLanguage: string;
  datePublished: string;
  dateModified: string;
  author: { '@id': string };
  publisher: { '@id': string };
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
  image: string[];
  wordCount?: number;
};

const ORGANIZATION_ID = `${SITE.origin}/#organization`;
const WEBSITE_ID = `${SITE.origin}/#website`;

function languageOf(locale: LocaleCode): string {
  return getLocale(locale).bcp47;
}

/** Sitewide publisher identity. Emitted once per page and referenced by @id elsewhere. */
export function organizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    sameAs: [`https://x.com/${SITE.creator.x.replace('@', '')}`],
  };
}

/** Home page only. The SearchAction points at the world-clock city search. */
export function webSiteSchema(locale: LocaleCode): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: absoluteUrl(localePath(locale, '/')),
    description: SITE.defaultDescription,
    inLanguage: languageOf(locale),
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        // Built by hand rather than through absoluteUrl(), which deliberately
        // strips query strings so canonicals can never carry one. A SearchAction
        // template is the one place a query placeholder must survive.
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(localePath(locale, '/world-clock/'))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Tool pages.
 *
 * `aggregateRating` is emitted only when real, verifiable review data is passed in.
 * It is deliberately absent at launch: Google's structured-data policy treats
 * invented ratings as spam, and a fabricated "4.8 from 1,204 reviews" on a
 * brand-new domain is the fastest route to a manual action. Wire this up when a
 * genuine review source exists — the field is ready for it.
 */
export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
  locale: LocaleCode;
  subCategory?: string;
  featureList?: string[];
  aggregateRating?: AggregateRatingInput;
}): SoftwareApplicationSchema {
  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(localePath(input.locale, input.path)),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser. Works without JavaScript for reference data.',
    inLanguage: languageOf(input.locale),
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: { '@id': ORGANIZATION_ID },
  };

  if (input.subCategory !== undefined) schema.applicationSubCategory = input.subCategory;
  if (input.featureList !== undefined) schema.featureList = input.featureList;
  if (input.aggregateRating !== undefined) {
    const { ratingValue, reviewCount } = input.aggregateRating;
    if (reviewCount > 0 && ratingValue >= 1 && ratingValue <= 5) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }
  }

  return schema;
}

/** Step-by-step instructions for a tool or guide. Steps deep-link to page anchors. */
export function howToSchema(input: {
  name: string;
  description: string;
  path: string;
  locale: LocaleCode;
  /** ISO-8601 duration, e.g. "PT1M". */
  totalTime: string;
  steps: readonly HowToStepInput[];
}): HowToSchema {
  const pageUrl = absoluteUrl(localePath(input.locale, input.path));
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    totalTime: input.totalTime,
    inLanguage: languageOf(input.locale),
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${pageUrl}#${step.anchor}`,
    })),
  };
}

export function faqPageSchema(items: readonly FaqItem[], locale: LocaleCode): FaqPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: languageOf(locale),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Breadcrumbs. The trail is passed in already ordered from home to current page;
 * the final crumb omits `item` per Google's guidance for the page you are on.
 */
export function breadcrumbListSchema(
  items: readonly BreadcrumbItem[],
  locale: LocaleCode,
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const element: BreadcrumbListSchema['itemListElement'][number] = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      if (item.path !== undefined) {
        element.item = absoluteUrl(localePath(locale, item.path));
      }
      return element;
    }),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  locale: LocaleCode;
  datePublished: string;
  dateModified: string;
  ogImage: string;
  wordCount?: number;
}): ArticleSchema {
  const url = absoluteUrl(localePath(input.locale, input.path));
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    inLanguage: languageOf(input.locale),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [absoluteUrl(input.ogImage)],
  };
  if (input.wordCount !== undefined) schema.wordCount = input.wordCount;
  return schema;
}
