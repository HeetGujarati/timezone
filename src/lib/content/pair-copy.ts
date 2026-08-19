import type { City } from '~/data/cities.ts';
import { pickVariant } from '~/lib/seo/slug-hash.ts';
import type { PairFacts } from './pair-facts.ts';

/**
 * Sentence templates for city-pair pages.
 *
 * Every slot has at least four phrasings, chosen deterministically from the pair's
 * slug — so no two pages carry the same paragraph verbatim, and any given page
 * reads identically on every rebuild. The *facts* interpolated into them differ per
 * pair regardless; the variants stop 1,448 pages sharing a sentence shape.
 *
 * These are written to be read, not to hit a word count. If a slot has nothing
 * useful to say for a particular pair, it returns null and the section does not
 * render.
 */

type CopyInput = {
  from: City;
  to: City;
  slug: string;
  facts: PairFacts;
};

/** The answer-first opening sentence. This is what a search result will quote. */
export function summarySentence({ from, to, slug, facts }: CopyInput): string {
  if (facts.sameZone) {
    const variants = [
      `${from.name} and ${to.name} are on the same clock: both keep ${facts.from.timeZone.replace('_', ' ')} time, so there is never a difference between them.`,
      `There is no time difference between ${from.name} and ${to.name} — both cities sit in the same time zone, and their clocks change together.`,
      `${from.name} and ${to.name} share a time zone, so whatever time it is in one, it is the same in the other, all year.`,
      `Same zone, same clock: ${from.name} and ${to.name} are never apart, including on the days daylight saving moves them both at once.`,
    ];
    return pickVariant(variants, slug, 'summary');
  }

  // Two forms, because "ahead" needs "of" before a city name and "behind" does not.
  // Getting this wrong produces "Singapore ahead of." on 700 pages.
  const beforeCity = facts.targetAhead ? 'ahead of' : 'behind';
  const trailing = facts.targetAhead ? 'ahead' : 'behind';
  const gap = facts.differenceLabel.replace(/ (ahead|behind)$/, '');

  const variants = [
    `${to.name} is ${gap} ${beforeCity} ${from.name} right now — so ${from.name} midday lands in ${to.name}'s ${describeMiddayLanding(facts)}.`,
    `Right now ${to.name} runs ${gap} ${beforeCity} ${from.name}. That gap is not fixed: it moves when either city changes its clocks.`,
    `The difference between ${from.name} and ${to.name} is currently ${gap}, with ${to.name} ${trailing} — the table below maps every hour of the day between them.`,
    `${from.name} to ${to.name} is a shift of ${gap}, ${to.name} ${trailing}. Below: the hour-by-hour mapping, both cities' daylight saving dates, and when you can actually talk.`,
  ];
  return pickVariant(variants, slug, 'summary');
}

function describeMiddayLanding(facts: PairFacts): string {
  const row = facts.hourTable[12];
  if (row === undefined) return 'afternoon';
  if (row.toHour < 6) return 'small hours';
  if (row.toHour < 12) return 'morning';
  if (row.toHour < 18) return 'afternoon';
  if (row.toHour < 22) return 'evening';
  return 'late night';
}

/** Introduces the 24-row hour mapping. */
export function tableIntro({ from, to, slug }: CopyInput): string {
  const variants = [
    `Every hour of a ${from.name} day, and what the clock reads in ${to.name} at that same moment.`,
    `The full day mapped across: read down the left for ${from.name}, across for ${to.name}.`,
    `Each row is one instant. A marked day means ${to.name} has already turned the calendar page.`,
    `Hour by hour, ${from.name} against ${to.name}, computed for a real date rather than by adding a fixed offset.`,
  ];
  return pickVariant(variants, slug, 'tableIntro');
}

/** The daylight-saving section's opening line. */
export function dstIntro({ from, to, slug, facts }: CopyInput): string {
  const bothChange = facts.from.observesDst && facts.to.observesDst;
  const neitherChanges = !facts.from.observesDst && !facts.to.observesDst;

  if (neitherChanges) {
    const variants = [
      `Neither ${from.name} nor ${to.name} changes its clocks, so the difference between them is the same every day of the year.`,
      `Good news for anyone scheduling: neither city observes daylight saving, so this gap never moves.`,
      `${from.name} and ${to.name} both keep one offset all year. Whatever difference you work out today holds in six months.`,
      `No daylight saving in either place — the difference below is a constant, not a seasonal one.`,
    ];
    return pickVariant(variants, slug, 'dstIntro');
  }

  if (bothChange) {
    const variants = [
      `Both cities change their clocks, but not necessarily on the same date — which is why the difference between them shifts for a few weeks each year.`,
      `${from.name} and ${to.name} both observe daylight saving. If their change dates differ, so does the gap between them for the weeks in between.`,
      `Each city moves its clocks twice a year. The dates below are what matters: between them, the usual difference is temporarily wrong.`,
      `Two cities, four clock changes a year. The difference you rely on holds except in the gaps between these dates.`,
    ];
    return pickVariant(variants, slug, 'dstIntro');
  }

  const changing = facts.from.observesDst ? from.name : to.name;
  const stable = facts.from.observesDst ? to.name : from.name;
  const variants = [
    `${changing} changes its clocks; ${stable} does not. The difference between them therefore shifts by an hour twice a year.`,
    `Only one of these cities observes daylight saving — ${changing} — so the gap is not the same in January as it is in July.`,
    `${stable} keeps one offset all year while ${changing} moves twice. That is the whole reason this difference is seasonal.`,
    `Half of this pair changes its clocks. ${changing} moves, ${stable} stays, and the difference follows ${changing}.`,
  ];
  return pickVariant(variants, slug, 'dstIntro');
}

/** The best-times-to-call block. Returns null when there is genuinely no window. */
export function callWindowSentence({ from, to, slug, facts }: CopyInput): string {
  if (facts.callWindows.length === 0) {
    const variants = [
      `There is no hour where both cities are inside a 09:00–18:00 working day. Someone has to move — the nearest workable windows are below.`,
      `A standard working day in ${from.name} and one in ${to.name} do not overlap at all. Any call between them is early for one side or late for the other.`,
      `No shared business hours. This is a pair where "let's find a time that works for everyone" has no answer, and pretending otherwise wastes a week of emails.`,
      `Zero overlap between 09:00 and 18:00 in both cities. The honest options are an early start, a late finish, or working asynchronously.`,
    ];
    return pickVariant(variants, slug, 'callWindow');
  }

  const window = facts.callWindows[0];
  if (window === undefined) return '';

  const hours = Math.floor(window.minutes / 60);
  const minutes = window.minutes % 60;
  const duration =
    minutes === 0 ? `${hours} hour${hours === 1 ? '' : 's'}` : `${hours}h ${minutes}m`;

  const variants = [
    `You have ${duration} of shared working time: ${window.fromRange} in ${from.name}, which is ${window.toRange} in ${to.name}.`,
    `The window is ${duration} wide — ${window.fromRange} where you are in ${from.name}, ${window.toRange} for ${to.name}.`,
    `Both cities are at their desks for ${duration} a day: ${window.fromRange} ${from.name} time, ${window.toRange} in ${to.name}.`,
    `${duration} of overlap. Book inside ${window.fromRange} ${from.name} and it lands at ${window.toRange} in ${to.name}.`,
  ];
  return pickVariant(variants, slug, 'callWindow');
}

/** Introduces the facts strip. */
export function factsIntro({ slug }: CopyInput): string {
  const variants = [
    `The underlying data, in case you need to put it in a calendar invite or a config file.`,
    `The zone identifiers and offsets behind everything above.`,
    `Reference values — these are what a computer needs, rather than what a person reads.`,
    `The exact identifiers, for anyone wiring this into software rather than a calendar.`,
  ];
  return pickVariant(variants, slug, 'factsIntro');
}

/**
 * Pair-specific FAQ. Every answer is built from this pair's computed facts, so no
 * two pages carry the same answer text.
 */
export function pairFaqs(input: CopyInput): { question: string; answer: string }[] {
  const { from, to, facts } = input;
  const gap = facts.differenceLabel;
  const faqs: { question: string; answer: string }[] = [];

  // `differenceLabel` ends in "ahead" or "behind"; "ahead" needs "of" before a city
  // name, "behind" does not. Concatenating blindly produced "5 hours ahead New York".
  const gapBeforeCity = gap.replace(/ ahead$/, ' ahead of');

  faqs.push({
    question: `What is the time difference between ${from.name} and ${to.name}?`,
    answer: facts.sameZone
      ? `There is none. Both cities are in the ${facts.from.timeZone} time zone, so their clocks always read the same and change together.`
      : `${to.name} is ${gapBeforeCity} ${from.name}. That figure is current — it changes by an hour when either city starts or ends daylight saving, and the exact dates are listed above.`,
  });

  faqs.push({
    question: `When is the best time to call ${to.name} from ${from.name}?`,
    answer:
      facts.callWindows.length === 0
        ? `There is no time that is inside normal working hours in both cities, so someone has to take the call outside them. The nearest workable windows are listed above — pick one and alternate who gets the awkward slot.`
        : `Between ${facts.callWindows[0]?.fromRange} in ${from.name}, which is ${facts.callWindows[0]?.toRange} in ${to.name}. That is the only stretch where both cities are inside a 09:00–18:00 day.`,
  });

  faqs.push({
    question: `Does ${from.name} observe daylight saving time?`,
    answer: facts.from.observesDst
      ? `Yes. ${from.name} runs on ${facts.from.standardOffsetLabel} in winter and ${facts.from.daylightOffsetLabel} in summer. ${
          facts.from.nextChange === null
            ? ''
            : `The next change is on ${facts.from.nextChange.isoDate}, when clocks go ${facts.from.nextChange.direction === 'forward' ? 'forward' : 'back'} ${facts.from.nextChange.deltaMinutes} minutes.`
        }`.trim()
      : `No. ${from.name} stays on ${facts.from.standardOffsetLabel} all year, so its clocks never move.`,
  });

  faqs.push({
    question: `Does ${to.name} observe daylight saving time?`,
    answer: facts.to.observesDst
      ? `Yes. ${to.name} runs on ${facts.to.standardOffsetLabel} in winter and ${facts.to.daylightOffsetLabel} in summer. ${
          facts.to.nextChange === null
            ? ''
            : `The next change is on ${facts.to.nextChange.isoDate}, when clocks go ${facts.to.nextChange.direction === 'forward' ? 'forward' : 'back'} ${facts.to.nextChange.deltaMinutes} minutes.`
        }`.trim()
      : `No. ${to.name} keeps ${facts.to.standardOffsetLabel} year-round.`,
  });

  const middayRow = facts.hourTable[12];
  if (middayRow !== undefined && !facts.sameZone) {
    faqs.push({
      question: `If it is midday in ${from.name}, what time is it in ${to.name}?`,
      answer: `It is ${String(middayRow.toHour).padStart(2, '0')}:${String(middayRow.toMinute).padStart(2, '0')} in ${to.name}${
        middayRow.dayDelta > 0
          ? `, and already the following day — ${to.name} has crossed into tomorrow while ${from.name} is still at lunch`
          : middayRow.dayDelta < 0
            ? `, still on the previous day — ${to.name} has not yet reached the date ${from.name} is on`
            : `, on the same calendar date`
      }. That holds for the current offsets; ${facts.from.observesDst || facts.to.observesDst ? 'it shifts by an hour around the daylight saving dates listed above' : 'and it does not change through the year, because neither city moves its clocks'}.`,
    });
  }

  if (facts.from.timeZone !== facts.to.timeZone) {
    faqs.push({
      question: `Which time zones do ${from.name} and ${to.name} use?`,
      answer: `${from.name} uses ${facts.from.timeZone} (currently ${facts.from.abbreviation}, ${facts.from.offsetLabel}) and ${to.name} uses ${facts.to.timeZone} (currently ${facts.to.abbreviation}, ${facts.to.offsetLabel}). Those identifiers are the ones to use in code — abbreviations are ambiguous, offsets change.`,
    });
  }

  return faqs;
}
