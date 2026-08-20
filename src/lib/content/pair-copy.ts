import type { City } from '~/data/cities.ts';
import type { LocaleCode } from '~/config/locales.ts';
import { useTranslations, type TranslationKey } from '~/lib/i18n/index.ts';
import { pickVariant } from '~/lib/seo/slug-hash.ts';
import { formatDuration } from './duration.ts';
import { formatZoneReading } from './zone-reading.ts';
import type { PairFacts } from './pair-facts.ts';

/**
 * Sentence templates for city-pair pages, in every language the site ships.
 *
 * The shapes live in the flat i18n dictionaries rather than here, for two
 * reasons. The dictionaries already have a parity check that fails the build
 * when a locale is missing a key, so a half-translated pair page cannot ship.
 * And the grammar these sentences need is not the same in every language:
 * English wants "ahead of" before a city name and "behind" bare, Japanese wants
 * the direction glued to the duration, Russian inflects the city name's role
 * through a preposition. A template per locale gets all of that right; an
 * English template with a substituted direction word gets it wrong everywhere
 * but English.
 *
 * Every slot has two phrasings per locale, chosen deterministically from the
 * pair's slug — so no two pages carry the same paragraph verbatim and a given
 * page reads identically on every rebuild. Two rather than English's four is
 * deliberate: the facts interpolated into them differ per pair regardless, so
 * with a hundred pairs per locale no two rendered sentences are alike; the
 * variants only stop the *shape* repeating, and two shapes over a hundred pages
 * is enough for that. See DECISIONS.md D28.
 */

type CopyInput = {
  from: City;
  to: City;
  slug: string;
  facts: PairFacts;
  locale: LocaleCode;
};

/** The two variant keys for a slot, e.g. `pair.summary.ahead.1` and `.2`. */
function variants(prefix: string): TranslationKey[] {
  return [`${prefix}.1`, `${prefix}.2`] as TranslationKey[];
}

/** Where midday in the source city lands on the target city's clock. */
function landingKey(facts: PairFacts): TranslationKey {
  const row = facts.hourTable[12];
  if (row === undefined) return 'pair.landing.afternoon';
  if (row.toHour < 6) return 'pair.landing.smallHours';
  if (row.toHour < 12) return 'pair.landing.morning';
  if (row.toHour < 18) return 'pair.landing.afternoon';
  if (row.toHour < 22) return 'pair.landing.evening';
  return 'pair.landing.lateNight';
}

/** The answer-first opening sentence. This is what a search result will quote. */
export function summarySentence({ from, to, slug, facts, locale }: CopyInput): string {
  const t = useTranslations(locale);

  if (facts.sameZone) {
    return t(pickVariant(variants('pair.summary.same'), slug, 'summary'), {
      from: from.name,
      to: to.name,
      zone: facts.from.timeZone.replace('_', ' '),
    });
  }

  const prefix = facts.targetAhead ? 'pair.summary.ahead' : 'pair.summary.behind';
  return t(pickVariant(variants(prefix), slug, 'summary'), {
    from: from.name,
    to: to.name,
    gap: formatDuration(locale, facts.differenceMinutes),
    landing: t(landingKey(facts)),
  });
}

/** Introduces the 24-row hour mapping. */
export function tableIntro({ from, to, slug, locale }: CopyInput): string {
  const t = useTranslations(locale);
  return t(pickVariant(variants('pair.tableIntro'), slug, 'tableIntro'), {
    from: from.name,
    to: to.name,
  });
}

/** The daylight-saving section's opening line. */
export function dstIntro({ from, to, slug, facts, locale }: CopyInput): string {
  const t = useTranslations(locale);
  const bothChange = facts.from.observesDst && facts.to.observesDst;
  const neitherChanges = !facts.from.observesDst && !facts.to.observesDst;

  if (neitherChanges) {
    return t(pickVariant(variants('pair.dst.neither'), slug, 'dstIntro'), {
      from: from.name,
      to: to.name,
    });
  }

  if (bothChange) {
    return t(pickVariant(variants('pair.dst.both'), slug, 'dstIntro'), {
      from: from.name,
      to: to.name,
    });
  }

  return t(pickVariant(variants('pair.dst.one'), slug, 'dstIntro'), {
    changing: facts.from.observesDst ? from.name : to.name,
    stable: facts.from.observesDst ? to.name : from.name,
  });
}

/** The best-times-to-call block. */
export function callWindowSentence({ from, to, slug, facts, locale }: CopyInput): string {
  const t = useTranslations(locale);

  if (facts.callWindows.length === 0) {
    return t(pickVariant(variants('pair.call.none'), slug, 'callWindow'), {
      from: from.name,
      to: to.name,
    });
  }

  const window = facts.callWindows[0];
  if (window === undefined) return '';

  return t(pickVariant(variants('pair.call.some'), slug, 'callWindow'), {
    duration: formatDuration(locale, window.minutes),
    fromRange: window.fromRange,
    toRange: window.toRange,
    from: from.name,
    to: to.name,
  });
}

/** Introduces the facts strip. */
export function factsIntro({ slug, locale }: CopyInput): string {
  const t = useTranslations(locale);
  return t(pickVariant(variants('pair.factsIntro'), slug, 'factsIntro'));
}

/**
 * Pair-specific FAQ. Every answer is built from this pair's computed facts, so no
 * two pages carry the same answer text.
 */
export function pairFaqs(input: CopyInput): { question: string; answer: string }[] {
  const { from, to, facts, locale } = input;
  const t = useTranslations(locale);
  const gap = formatDuration(locale, facts.differenceMinutes);
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: t('pair.faq.q.difference', { from: from.name, to: to.name }),
    answer: facts.sameZone
      ? t('pair.faq.a.difference.same', { zone: facts.from.timeZone })
      : t(facts.targetAhead ? 'pair.faq.a.difference.ahead' : 'pair.faq.a.difference.behind', {
          from: from.name,
          to: to.name,
          gap,
        }),
  });

  const window = facts.callWindows[0];
  faqs.push({
    question: t('pair.faq.q.bestTime', { from: from.name, to: to.name }),
    answer:
      window === undefined
        ? t('pair.faq.a.bestTime.none')
        : t('pair.faq.a.bestTime.some', {
            fromRange: window.fromRange,
            toRange: window.toRange,
            from: from.name,
            to: to.name,
          }),
  });

  for (const side of [
    { city: from, zone: facts.from },
    { city: to, zone: facts.to },
  ]) {
    faqs.push({
      question: t('pair.faq.q.observesDst', { city: side.city.name }),
      answer: !side.zone.observesDst
        ? t('pair.faq.a.observesDst.no', {
            city: side.city.name,
            standard: side.zone.standardOffsetLabel,
          })
        : side.zone.nextChange === null
          ? t('pair.faq.a.observesDst.yes', {
              city: side.city.name,
              standard: side.zone.standardOffsetLabel,
              daylight: side.zone.daylightOffsetLabel ?? side.zone.standardOffsetLabel,
            })
          : t('pair.faq.a.observesDst.yesNext', {
              city: side.city.name,
              standard: side.zone.standardOffsetLabel,
              daylight: side.zone.daylightOffsetLabel ?? side.zone.standardOffsetLabel,
              date: side.zone.nextChange.isoDate,
              direction: t(
                side.zone.nextChange.direction === 'forward'
                  ? 'pair.faq.direction.forward'
                  : 'pair.faq.direction.back',
              ),
              minutes: side.zone.nextChange.deltaMinutes,
            }),
    });
  }

  const middayRow = facts.hourTable[12];
  if (middayRow !== undefined && !facts.sameZone) {
    const dayClause: TranslationKey =
      middayRow.dayDelta > 0
        ? 'pair.faq.dayClause.next'
        : middayRow.dayDelta < 0
          ? 'pair.faq.dayClause.previous'
          : 'pair.faq.dayClause.same';

    faqs.push({
      question: t('pair.faq.q.midday', { from: from.name, to: to.name }),
      answer: t('pair.faq.a.midday', {
        time: `${String(middayRow.toHour).padStart(2, '0')}:${String(middayRow.toMinute).padStart(2, '0')}`,
        to: to.name,
        dayClause: t(dayClause),
        stability: t(
          facts.from.observesDst || facts.to.observesDst
            ? 'pair.faq.stability.seasonal'
            : 'pair.faq.stability.fixed',
        ),
      }),
    });
  }

  if (facts.from.timeZone !== facts.to.timeZone) {
    faqs.push({
      question: t('pair.faq.q.zones', { from: from.name, to: to.name }),
      answer: t('pair.faq.a.zones', {
        from: from.name,
        to: to.name,
        fromZone: facts.from.timeZone,
        toZone: facts.to.timeZone,
        fromReading: formatZoneReading(locale, facts.from.abbreviation, facts.from.offsetLabel),
        toReading: formatZoneReading(locale, facts.to.abbreviation, facts.to.offsetLabel),
      }),
    });
  }

  return faqs;
}
