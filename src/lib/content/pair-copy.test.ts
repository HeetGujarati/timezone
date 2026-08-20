import { describe, expect, it } from 'vitest';
import { LOCALE_CODES, type LocaleCode } from '~/config/locales.ts';
import { PAIRS, pairBySlug } from '~/data/pairs.ts';
import { buildPairFacts } from './pair-facts.ts';
import {
  callWindowSentence,
  dstIntro,
  pairFaqs,
  summarySentence,
  tableIntro,
} from './pair-copy.ts';

const INSTANT = Date.UTC(2026, 0, 15, 12, 0, 0);

function inputFor(slug: string, locale: LocaleCode = 'en') {
  const pair = pairBySlug(slug);
  if (pair === undefined) throw new Error(`No such pair: ${slug}`);
  return {
    from: pair.from,
    to: pair.to,
    slug,
    locale,
    facts: buildPairFacts(pair.from, pair.to, INSTANT),
  };
}

describe('generated pair copy', () => {
  it('opens with a sentence that answers the query directly', () => {
    const sentence = summarySentence(inputFor('new-york-to-london'));
    expect(sentence).toMatch(/London|New York/);
    expect(sentence.length).toBeGreaterThan(60);
  });

  it('never produces a dangling preposition', () => {
    // "Singapore ahead of." was a real bug: "ahead" needs "of" before a city name
    // and nothing after it at the end of a clause.
    for (const pair of PAIRS.slice(0, 300)) {
      const sentence = summarySentence({
        from: pair.from,
        to: pair.to,
        slug: pair.slug,
        locale: 'en',
        facts: buildPairFacts(pair.from, pair.to, INSTANT),
      });
      expect(sentence, pair.slug).not.toMatch(/\bahead of[.,]/);
      expect(sentence, pair.slug).not.toMatch(/\bahead of\s*$/);
      expect(sentence, pair.slug).not.toMatch(/\bbehind of\b/);
      expect(sentence, pair.slug).not.toMatch(/\ba \d+ hours\b/);
    }
  });

  it('produces a different opening sentence for the reverse direction', () => {
    expect(summarySentence(inputFor('new-york-to-london'))).not.toBe(
      summarySentence(inputFor('london-to-new-york')),
    );
  });

  it('says plainly when two cities share a zone', () => {
    // Mumbai and Delhi are both Asia/Kolkata.
    const sentence = summarySentence(inputFor('mumbai-to-delhi'));
    expect(sentence).toMatch(/same (clock|time zone|zone)|never a difference|never apart/i);
  });

  it('adapts the daylight-saving paragraph to what the pair actually does', () => {
    // Neither India nor Japan observes daylight saving.
    expect(dstIntro(inputFor('delhi-to-tokyo'))).toMatch(/neither|both keep|no daylight saving/i);
    // The United States does, India does not.
    expect(dstIntro(inputFor('new-york-to-delhi'))).toMatch(
      /only one|does not|half of this pair|while/i,
    );
  });

  it('states honestly when a pair has no shared working hours', () => {
    const sentence = callWindowSentence(inputFor('los-angeles-to-mumbai'));
    expect(sentence).toMatch(/no (hour|shared)|do not overlap|Zero overlap/i);
  });

  it('gives a concrete window when one exists', () => {
    const sentence = callWindowSentence(inputFor('london-to-new-york'));
    expect(sentence).toMatch(/\d{2}:\d{2}–\d{2}:\d{2}/);
  });

  it('builds pair-specific FAQ answers, not boilerplate', () => {
    const nyLon = pairFaqs(inputFor('new-york-to-london'));
    const tokyoBer = pairFaqs(inputFor('tokyo-to-berlin'));
    expect(nyLon.length).toBeGreaterThanOrEqual(4);
    expect(nyLon[0]?.answer).not.toBe(tokyoBer[0]?.answer);
    for (const faq of nyLon) {
      expect(faq.answer.length).toBeGreaterThan(40);
      expect(faq.answer).not.toContain('undefined');
      expect(faq.answer).not.toContain('null');
    }
  });

  it('is stable across calls, so a rebuild does not rewrite every page', () => {
    const first = summarySentence(inputFor('sydney-to-dublin'));
    const second = summarySentence(inputFor('sydney-to-dublin'));
    expect(first).toBe(second);
  });

  it('uses both phrasings across the pair set, not just one', () => {
    // Outputs differ per pair because city names are interpolated, so this checks
    // the distinct *templates* are all in use rather than counting strings.
    const markers = ['Every hour of a', 'The whole day mapped across'];
    const seen = new Set<string>();

    for (const pair of PAIRS.slice(0, 200)) {
      const sentence = tableIntro({
        from: pair.from,
        to: pair.to,
        slug: pair.slug,
        locale: 'en',
        facts: buildPairFacts(pair.from, pair.to, INSTANT),
      });
      const marker = markers.find((candidate) => sentence.startsWith(candidate));
      expect(marker, `unrecognised phrasing: ${sentence}`).toBeDefined();
      if (marker !== undefined) seen.add(marker);
    }

    expect(seen.size).toBe(markers.length);
  });

  /**
   * The reason this module exists. Before it, every one of these sentences
   * rendered in English on all fourteen locales.
   */
  it("renders in the reader's language, in every locale", () => {
    for (const locale of LOCALE_CODES) {
      const input = inputFor('tokyo-to-berlin', locale);
      const sentence = summarySentence(input);
      expect(sentence, locale).not.toContain('{');
      expect(sentence, locale).toContain('Tokyo');

      for (const faq of pairFaqs(input)) {
        expect(faq.question, `${locale} question`).not.toContain('{');
        expect(faq.answer, `${locale} answer`).not.toContain('{');
        expect(faq.answer, `${locale} answer`).not.toContain('undefined');
      }

      // Only English should read as English.
      if (locale !== 'en') {
        expect(sentence, locale).not.toBe(summarySentence(inputFor('tokyo-to-berlin')));
      }
    }
  });
});
