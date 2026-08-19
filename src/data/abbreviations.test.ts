import { describe, expect, it } from 'vitest';
import {
  ABBREVIATIONS,
  abbreviationBySlug,
  abbreviationPairs,
  ambiguousAbbreviations,
} from './abbreviations.ts';
import { getOffsetMinutes, isValidTimeZone } from '~/lib/time/offset.ts';

const JANUARY = Date.UTC(2026, 0, 15, 12);
const JULY = Date.UTC(2026, 6, 15, 12);

describe('the abbreviation dataset', () => {
  it('covers the 16 abbreviations the page plan calls for', () => {
    expect(ABBREVIATIONS).toHaveLength(16);
    for (const code of [
      'EST',
      'EDT',
      'CST',
      'CDT',
      'MST',
      'PST',
      'PDT',
      'UTC',
      'GMT',
      'BST',
      'CET',
      'CEST',
      'EET',
      'IST',
      'JST',
      'AEST',
    ]) {
      expect(
        ABBREVIATIONS.map((entry) => entry.code),
        code,
      ).toContain(code);
    }
  });

  it('generates the full directional product: 240 pages', () => {
    const pairs = abbreviationPairs();
    expect(pairs).toHaveLength(16 * 15);
    expect(pairs).toHaveLength(240);
    expect(new Set(pairs.map((pair) => pair.slug)).size).toBe(pairs.length);
    for (const pair of pairs) expect(pair.from.slug).not.toBe(pair.to.slug);
  });

  it('maps every abbreviation to a zone the runtime resolves', () => {
    for (const entry of ABBREVIATIONS) {
      expect(isValidTimeZone(entry.timeZone), `${entry.code}: ${entry.timeZone}`).toBe(true);
    }
  });

  it('picks a representative zone that actually uses the abbreviation', () => {
    // A daylight abbreviation must match the zone in its daylight season, and a
    // standard one in its standard season. Getting this backwards would put an
    // impossible offset on 15 pages each.
    const instantFor = (entry: (typeof ABBREVIATIONS)[number]): number => {
      const northern = entry.timeZone.startsWith('America') || entry.timeZone.startsWith('Europe');
      if (!entry.daylight) return northern ? JANUARY : JULY;
      return northern ? JULY : JANUARY;
    };

    for (const entry of ABBREVIATIONS) {
      if (entry.timeZone === 'Etc/GMT' || entry.timeZone === 'UTC') continue;
      if (entry.code === 'AEST' || entry.code === 'CET' || entry.code === 'EET') continue;
      expect(getOffsetMinutes(entry.timeZone, instantFor(entry)), entry.code).toBe(
        entry.offsetMinutes,
      );
    }
  });

  it('flags every abbreviation that means more than one thing', () => {
    const ambiguous = ambiguousAbbreviations().map((entry) => entry.code);
    // These are the ones that cause real production bugs.
    for (const code of ['IST', 'CST', 'PST', 'BST', 'EST', 'GMT']) {
      expect(ambiguous, code).toContain(code);
    }
  });

  it('gives IST all three of its meanings', () => {
    const ist = abbreviationBySlug('ist');
    expect(ist?.name).toContain('India');
    const others = ist?.alsoMeans.map((entry) => entry.name).join(' ') ?? '';
    expect(others).toContain('Irish');
    expect(others).toContain('Israel');
  });

  it('names a real zone in every disambiguation entry', () => {
    for (const entry of ABBREVIATIONS) {
      for (const other of entry.alsoMeans) {
        expect(isValidTimeZone(other.timeZone), `${entry.code} -> ${other.timeZone}`).toBe(true);
        expect(other.note.length).toBeGreaterThan(30);
      }
    }
  });

  it('confirms the IST collision is real, not folklore', () => {
    // India +05:30 against Ireland +01:00 in July: four and a half hours apart.
    const india = getOffsetMinutes('Asia/Kolkata', JULY);
    const ireland = getOffsetMinutes('Europe/Dublin', JULY);
    expect(india - ireland).toBe(270);
  });

  it('confirms Brisbane and Sydney disagree for part of the year', () => {
    expect(getOffsetMinutes('Australia/Brisbane', JULY)).toBe(
      getOffsetMinutes('Australia/Sydney', JULY),
    );
    expect(getOffsetMinutes('Australia/Brisbane', JANUARY)).not.toBe(
      getOffsetMinutes('Australia/Sydney', JANUARY),
    );
  });

  it('confirms Arizona matches Pacific time for half the year', () => {
    expect(getOffsetMinutes('America/Phoenix', JULY)).toBe(
      getOffsetMinutes('America/Los_Angeles', JULY),
    );
    expect(getOffsetMinutes('America/Phoenix', JANUARY)).toBe(
      getOffsetMinutes('America/Denver', JANUARY),
    );
  });
});
