import { describe, expect, it } from 'vitest';
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  organizationSchema,
  softwareApplicationSchema,
  webSiteSchema,
} from './structured-data.ts';

describe('webSiteSchema', () => {
  it('carries a SearchAction with a query placeholder', () => {
    const schema = webSiteSchema('en');
    expect(schema.potentialAction['@type']).toBe('SearchAction');
    expect(schema.potentialAction.target.urlTemplate).toContain('{search_term_string}');
    expect(schema.potentialAction['query-input']).toBe('required name=search_term_string');
  });

  it('points at the localised home page and declares the language', () => {
    const schema = webSiteSchema('ja');
    expect(schema.url).toBe('https://meridiem.app/ja/');
    expect(schema.inLanguage).toBe('ja');
  });

  it('references the Organization by @id rather than repeating it', () => {
    expect(webSiteSchema('en').publisher).toEqual({ '@id': 'https://meridiem.app/#organization' });
  });
});

describe('softwareApplicationSchema', () => {
  const base = {
    name: 'Meridiem meeting planner',
    description: 'Find a meeting time that works across every zone on your team.',
    path: '/meeting-planner/',
    locale: 'en' as const,
  };

  it('declares the required category and a free offer', () => {
    const schema = softwareApplicationSchema(base);
    expect(schema.applicationCategory).toBe('UtilitiesApplication');
    expect(schema.offers.price).toBe('0');
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it('omits aggregateRating entirely when no review data is supplied', () => {
    expect(softwareApplicationSchema(base).aggregateRating).toBeUndefined();
    expect(Object.keys(softwareApplicationSchema(base))).not.toContain('aggregateRating');
  });

  it('emits aggregateRating only when real review data is passed', () => {
    const schema = softwareApplicationSchema({
      ...base,
      aggregateRating: { ratingValue: 4.6, reviewCount: 128 },
    });
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.6,
      reviewCount: 128,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('refuses a rating with no reviews behind it', () => {
    const schema = softwareApplicationSchema({
      ...base,
      aggregateRating: { ratingValue: 4.8, reviewCount: 0 },
    });
    expect(schema.aggregateRating).toBeUndefined();
  });

  it('refuses an out-of-range rating', () => {
    const schema = softwareApplicationSchema({
      ...base,
      aggregateRating: { ratingValue: 9, reviewCount: 10 },
    });
    expect(schema.aggregateRating).toBeUndefined();
  });
});

describe('howToSchema', () => {
  it('numbers steps from 1 and deep-links each to its anchor', () => {
    const schema = howToSchema({
      name: 'How to plan a meeting across time zones',
      description: 'Three steps.',
      path: '/meeting-planner/',
      locale: 'en',
      totalTime: 'PT2M',
      steps: [
        { name: 'Add your zones', text: 'Pick two to ten zones.', anchor: 'add-zones' },
        { name: 'Read the band', text: 'Shaded hours are working hours.', anchor: 'read-band' },
      ],
    });
    expect(schema.step).toHaveLength(2);
    expect(schema.step[0]?.position).toBe(1);
    expect(schema.step[1]?.url).toBe('https://meridiem.app/meeting-planner/#read-band');
    expect(schema.totalTime).toBe('PT2M');
  });
});

describe('faqPageSchema', () => {
  it('wraps each pair as a Question with an accepted Answer', () => {
    const schema = faqPageSchema(
      [{ question: 'Is New York ahead of London?', answer: 'No, it is 5 hours behind.' }],
      'en',
    );
    expect(schema.mainEntity[0]?.['@type']).toBe('Question');
    expect(schema.mainEntity[0]?.acceptedAnswer.text).toBe('No, it is 5 hours behind.');
  });
});

describe('breadcrumbListSchema', () => {
  it('numbers crumbs from 1 and omits the item URL on the current page', () => {
    const schema = breadcrumbListSchema(
      [
        { name: 'Home', path: '/' },
        { name: 'Convert', path: '/convert/' },
        { name: 'New York to London' },
      ],
      'de',
    );
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[1]?.item).toBe('https://meridiem.app/de/convert/');
    expect(schema.itemListElement[2]?.item).toBeUndefined();
  });
});

describe('articleSchema', () => {
  it('links back to the page it describes and names the publisher by @id', () => {
    const schema = articleSchema({
      headline: 'Why EST is ambiguous',
      description: 'EST means two different things.',
      path: '/guides/why-est-is-ambiguous/',
      locale: 'en',
      datePublished: '2026-01-01T00:00:00Z',
      dateModified: '2026-01-01T00:00:00Z',
      ogImage: '/og/guides/why-est-is-ambiguous.png',
      wordCount: 1100,
    });
    expect(schema.mainEntityOfPage['@id']).toBe(
      'https://meridiem.app/guides/why-est-is-ambiguous/',
    );
    expect(schema.image[0]).toMatch(/^https:\/\/meridiem\.app\/og\//);
    expect(schema.wordCount).toBe(1100);
  });
});

describe('organizationSchema', () => {
  it('is stable and carries a resolvable @id', () => {
    expect(organizationSchema()['@id']).toBe('https://meridiem.app/#organization');
    expect(organizationSchema()).toEqual(organizationSchema());
  });
});

describe('JSON-LD serialisation safety', () => {
  it('escapes a closing script tag hidden in user-facing text', () => {
    const schema = faqPageSchema(
      [{ question: '</script><img src=x onerror=alert(1)>', answer: 'Nice try.' }],
      'en',
    );
    const serialised = JSON.stringify(schema)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');
    expect(serialised).not.toContain('</script>');
    expect(serialised).not.toContain('<img');
    expect(serialised).toContain('\\u003c');
  });
});
