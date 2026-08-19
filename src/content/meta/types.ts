/**
 * Titles and descriptions for the programmatically generated pages.
 *
 * These live apart from `PageCopy` because they are functions, not strings: a
 * pair page's title names two cities and a city page's description names a
 * country, so the locale supplies a shape rather than a sentence.
 *
 * City and abbreviation names stay in their canonical Latin form in every
 * locale. Transliterating eighty city names into fourteen languages would mean
 * inventing 1,120 proper nouns with no source to check them against, which the
 * brief forbids; country names come from `Intl.DisplayNames`, which is CLDR
 * data and therefore real. See DECISIONS.md D24.
 */

export type PairMetaInput = {
  /** Canonical city name, Latin script. */
  from: string;
  to: string;
  /** Localised magnitude only — "4 Stunden 30 Minuten". Direction is the template's. */
  difference: string;
  /** True when the target city's clock reads later than the source's. */
  targetAhead: boolean;
  /** True when both cities share one IANA zone, so there is no difference to state. */
  sameZone: boolean;
  /** True when the offsets coincide today without the zones being identical. */
  sameTime: boolean;
};

export type CityMetaInput = {
  city: string;
  /** Localised country name, from Intl.DisplayNames. */
  country: string;
  /** Whether this zone has scheduled transitions to list. */
  hasTransitions: boolean;
};

export type AbbreviationMetaInput = {
  /** Abbreviation code, e.g. EST. Never translated — it is the search term. */
  from: string;
  to: string;
  difference: string;
  targetAhead: boolean;
  sameTime: boolean;
};

export type MetaTemplates = {
  pairTitle: (input: PairMetaInput) => string;
  pairDescription: (input: PairMetaInput) => string;
  cityTitle: (input: CityMetaInput) => string;
  cityDescription: (input: CityMetaInput) => string;
  abbreviationTitle: (input: AbbreviationMetaInput) => string;
  abbreviationDescription: (input: AbbreviationMetaInput) => string;
};
