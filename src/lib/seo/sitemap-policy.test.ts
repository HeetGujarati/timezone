import { describe, expect, it } from 'vitest';
import {
  changeFrequencyFor,
  classifyPath,
  priorityFor,
  sitemapEntryFor,
  stripLocalePrefix,
} from './sitemap-policy.ts';

const SEGMENTS = ['es', 'de', 'pt-br', 'zh-hans', 'ar'];

describe('stripLocalePrefix', () => {
  it('removes a known locale prefix', () => {
    expect(stripLocalePrefix('/de/world-clock/', SEGMENTS)).toBe('/world-clock/');
    expect(stripLocalePrefix('/zh-hans/', SEGMENTS)).toBe('/');
  });

  it('leaves an English path alone', () => {
    expect(stripLocalePrefix('/world-clock/', SEGMENTS)).toBe('/world-clock/');
  });

  it('does not mistake a page slug for a locale', () => {
    expect(stripLocalePrefix('/convert/berlin-to-madrid/', SEGMENTS)).toBe(
      '/convert/berlin-to-madrid/',
    );
  });
});

describe('classifyPath', () => {
  it.each([
    ['/', 'home'],
    ['/convert/', 'hub'],
    ['/time-in/', 'hub'],
    ['/guides/', 'hub'],
    ['/convert/new-york-to-london/', 'conversion'],
    ['/time-in/tokyo/', 'city'],
    ['/guides/what-is-utc/', 'guide'],
    ['/meeting-planner/', 'tool'],
    ['/unix-timestamp-converter/', 'tool'],
    ['/privacy/', 'legal'],
    ['/accessibility/', 'legal'],
  ])('classifies %s as %s', (path, expected) => {
    expect(classifyPath(path)).toBe(expected);
  });

  it('tolerates a missing trailing slash', () => {
    expect(classifyPath('/meeting-planner')).toBe('tool');
  });
});

describe('priority and change frequency', () => {
  it('ranks home above hubs above individual pages above legal', () => {
    expect(priorityFor('home')).toBeGreaterThan(priorityFor('hub'));
    expect(priorityFor('hub')).toBeGreaterThan(priorityFor('conversion'));
    expect(priorityFor('conversion')).toBeGreaterThan(priorityFor('guide'));
    expect(priorityFor('guide')).toBeGreaterThan(priorityFor('legal'));
  });

  it('claims freshness only where it is real', () => {
    expect(changeFrequencyFor('home')).toBe('daily');
    expect(changeFrequencyFor('guide')).toBe('monthly');
    expect(changeFrequencyFor('legal')).toBe('yearly');
  });
});

describe('sitemapEntryFor', () => {
  it('scores the English home page at 1.0', () => {
    expect(sitemapEntryFor('/', SEGMENTS, true)).toEqual({
      section: 'home',
      priority: 1,
      changefreq: 'daily',
    });
  });

  it('applies the non-default-locale penalty', () => {
    expect(sitemapEntryFor('/de/meeting-planner/', SEGMENTS, false).priority).toBe(0.8);
  });

  it('keeps every priority inside the valid 0–1 range', () => {
    for (const path of ['/', '/convert/', '/privacy/', '/de/privacy/', '/ar/time-in/tokyo/']) {
      const { priority } = sitemapEntryFor(path, SEGMENTS, !path.startsWith('/de/'));
      expect(priority).toBeGreaterThanOrEqual(0);
      expect(priority).toBeLessThanOrEqual(1);
    }
  });
});
