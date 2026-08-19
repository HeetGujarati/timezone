import { describe, expect, it } from 'vitest';
import {
  MAX_DESCRIPTION_LENGTH,
  buildAlternates,
  buildMetadata,
  buildRobots,
  formatTitle,
  mergeKeywords,
  truncateDescription,
} from './metadata.ts';
import { SITE } from '~/config/site.ts';

describe('truncateDescription', () => {
  it('leaves a short description untouched', () => {
    expect(truncateDescription('Convert time zones.')).toBe('Convert time zones.');
  });

  it('never exceeds the ceiling, ellipsis included', () => {
    const long = 'Convert any time zone to any other time zone for any date you choose. '.repeat(5);
    const result = truncateDescription(long);
    expect(result.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(result.endsWith('…')).toBe(true);
  });

  it('breaks at a word boundary rather than mid-word', () => {
    const long = `${'word '.repeat(40)}finalword`;
    const result = truncateDescription(long);
    expect(result).not.toMatch(/wo…$/);
  });

  it('collapses whitespace', () => {
    expect(truncateDescription('  a   b \n c ')).toBe('a b c');
  });

  it('honours a custom ceiling', () => {
    expect(truncateDescription('abcdefghij klmnop', 12).length).toBeLessThanOrEqual(12);
  });

  it('falls back to a hard cut when a word boundary would gut the snippet', () => {
    const result = truncateDescription(`${'x'.repeat(200)} tail`, 50);
    expect(result.length).toBe(50);
  });
});

describe('formatTitle', () => {
  it('appends the site name', () => {
    expect(formatTitle('World clock')).toBe('World clock | Meridiem');
  });

  it('does not duplicate a site name already present', () => {
    expect(formatTitle('Meridiem world clock')).toBe('Meridiem world clock');
  });

  it('matches the site name case-insensitively', () => {
    expect(formatTitle('MERIDIEM world clock')).toBe('MERIDIEM world clock');
  });
});

describe('mergeKeywords', () => {
  it('puts page keywords first and appends the global set', () => {
    const merged = mergeKeywords(['tokyo time'], ['world clock']);
    expect(merged).toEqual(['tokyo time', 'world clock']);
  });

  it('de-duplicates case-insensitively', () => {
    expect(mergeKeywords(['World Clock'], ['world clock'])).toEqual(['World Clock']);
  });

  it('drops empty entries', () => {
    expect(mergeKeywords(['  ', 'utc'], [])).toEqual(['utc']);
  });

  it('merges the site-wide keywords by default', () => {
    expect(mergeKeywords(['tokyo time'])).toContain('world clock');
  });
});

describe('buildRobots', () => {
  it('indexes and follows by default with the required Google directives', () => {
    const robots = buildRobots();
    expect(robots.index).toBe(true);
    expect(robots.googleBot['max-snippet']).toBe(-1);
    expect(robots.googleBot['max-image-preview']).toBe('large');
  });

  it('flips every directive when noIndex is set', () => {
    const robots = buildRobots(true);
    expect(robots.index).toBe(false);
    expect(robots.follow).toBe(false);
    expect(robots.googleBot.index).toBe(false);
  });
});

describe('buildAlternates', () => {
  it('emits one absolute self-referencing entry per available locale plus x-default', () => {
    const { languages } = buildAlternates('/world-clock/', ['en', 'de', 'ar']);
    expect(languages).toEqual({
      en: 'https://meridiem.app/world-clock/',
      de: 'https://meridiem.app/de/world-clock/',
      ar: 'https://meridiem.app/ar/world-clock/',
      'x-default': 'https://meridiem.app/world-clock/',
    });
  });

  it('never emits an hreflang for a locale the page does not exist in', () => {
    const { languages } = buildAlternates('/dst-changes/', ['en', 'ja']);
    expect(Object.keys(languages).sort()).toEqual(['en', 'ja', 'x-default']);
  });

  it('points x-default at the first available locale when English is absent', () => {
    const { languages } = buildAlternates('/only-japanese/', ['ja']);
    expect(languages['x-default']).toBe('https://meridiem.app/ja/only-japanese/');
  });

  it('uses the BCP-47 tag for hreflang, not the URL segment', () => {
    const { languages } = buildAlternates('/', ['pt-BR', 'zh-Hans']);
    expect(languages['pt-BR']).toBe('https://meridiem.app/pt-br/');
    expect(languages['zh-Hans']).toBe('https://meridiem.app/zh-hans/');
  });
});

describe('buildMetadata', () => {
  const base = {
    title: 'Convert New York time to London time',
    description: 'New York is 5 hours behind London right now.',
    path: '/convert/new-york-to-london/',
    locale: 'de' as const,
    availableLocales: ['en', 'de'] as const,
  };

  it('builds an absolute, locale-correct canonical', () => {
    expect(buildMetadata(base).canonical).toBe(
      'https://meridiem.app/de/convert/new-york-to-london/',
    );
  });

  it('strips query strings and fragments from the canonical', () => {
    const metadata = buildMetadata({ ...base, path: '/countdown/' });
    expect(metadata.canonical).toBe('https://meridiem.app/de/countdown/');
    expect(metadata.canonical).not.toContain('?');
  });

  it('maps the locale to an Open Graph territory tag', () => {
    expect(buildMetadata(base).openGraph.locale).toBe('de_DE');
    expect(buildMetadata(base).openGraph.alternateLocales).toEqual(['en_US']);
  });

  it('always ships a summary_large_image Twitter card with an absolute image', () => {
    const { twitter } = buildMetadata(base);
    expect(twitter.card).toBe('summary_large_image');
    expect(twitter.images[0]).toMatch(/^https:\/\//);
  });

  it('falls back to the site description when a page supplies none', () => {
    const metadata = buildMetadata({ ...base, description: undefined });
    expect(metadata.description).toBe(SITE.defaultDescription);
  });

  it('supports noIndex without touching anything else', () => {
    const metadata = buildMetadata({ ...base, noIndex: true });
    expect(metadata.robots.index).toBe(false);
    expect(metadata.canonical).toBe('https://meridiem.app/de/convert/new-york-to-london/');
  });

  it('keeps the resolved title inside the SERP limit for a realistic page', () => {
    expect(buildMetadata(base).title.length).toBeLessThanOrEqual(60);
  });
});
