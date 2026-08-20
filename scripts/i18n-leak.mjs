#!/usr/bin/env node
/**
 * English leaking into a translated page.
 *
 * The parity script proves every locale has every dictionary key. It cannot
 * prove a template used one. A heading written straight into the markup renders
 * in English on all fourteen locales, passes the type check, passes parity,
 * passes the SEO audit — and is the single most visible way a localised site
 * looks unfinished.
 *
 * This compares the rendered text of every translated page against its English
 * counterpart and fails on any sentence the two share. Shared text is not always
 * wrong: a city name, an IANA identifier, a UTC offset and an abbreviation are
 * the same in every language, and so is a standards body. So the comparison runs
 * only on segments long enough to be prose, and skips segments that are entirely
 * proper nouns, identifiers or numbers.
 *
 * The English pages themselves are never compared, and neither are the locale
 * chrome elements that legitimately name other languages — the language switcher
 * says "Deutsch" on every page in every locale, and should.
 */
import { readPages, fail, pass } from './lib/dist.mjs';

/** Below this, a shared segment is far more likely a proper noun than a sentence. */
const MIN_PROSE_LENGTH = 14;

const LOCALE_SEGMENTS = new Set([
  'es',
  'pt-br',
  'fr',
  'de',
  'it',
  'ru',
  'tr',
  'ar',
  'hi',
  'id',
  'ja',
  'ko',
  'zh-hans',
]);

/**
 * Text that is identical across languages by design. Zone identifiers, city and
 * country names, the standards bodies, the abbreviations the site is about, and
 * the language switcher's list of language names.
 */
const SHARED_BY_DESIGN = [
  /^[A-Z][A-Za-z]*\/[A-Za-z_+\-/]+$/, // Asia/Kathmandu, Etc/GMT+12
  /^UTC[+-]\d/, // UTC+05:45
  /^[A-Z]{2,5}$/, // EST, AEDT, IANA, UTC
  /^[\d\s:+→.,°'’"–—/-]+$/u, // numbers, times, offsets, coordinates
  /^(Meridiem|IANA|NOAA|ISO 8601|RFC 3339|JavaScript|Intl)$/,
];

/** The language switcher names every language in its own language, on every page. */
const LANGUAGE_NAMES = new Set([
  'English',
  'Español',
  'Português (Brasil)',
  'Français',
  'Deutsch',
  'Italiano',
  'Русский',
  'Türkçe',
  'العربية',
  'हिन्दी',
  'Bahasa Indonesia',
  '日本語',
  '한국어',
  '简体中文',
]);

/** Visible text segments, one per block-level element, with tags and scripts removed. */
function textSegments(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    // Zone pickers list 400-odd IANA locations by their English exonym in every
    // locale, deliberately: decision D25 says city names stay in Latin script
    // because transliterating them would mean inventing them. Comparing those
    // lists would report 400 leaks per page and hide the real ones.
    .replace(/<select[\s\S]*?<\/select>/gi, ' ')
    .replace(/<datalist[\s\S]*?<\/datalist>/gi, ' ')
    // Code is code. A SQL column name and a Python call are the same in every
    // language, and the guides quote both at length.
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ');
  return body
    .split(/<\/(?:p|h1|h2|h3|h4|li|td|th|dt|dd|figcaption|caption|summary|button|a|span)>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);
}

/**
 * True when a segment is nothing but proper nouns, numbers and punctuation —
 * "New York 09:00–18:00", "Chatham Islands", "Asia/Kolkata 09:00". City names
 * stay in Latin script in every locale by decision D25, and a working-hours
 * range is digits, so a segment made only of those is shared on purpose.
 */
function isProperNounPhrase(segment) {
  const words = segment
    .replace(/[\d:–—→.,·&()/+-]+/gu, ' ')
    .split(/\s+/u)
    .filter(Boolean);
  if (words.length === 0) return true;
  return words.every((word) => /^[A-Z]/u.test(word));
}

/** Placeholders the owner replaces before launch. Identical everywhere until then. */
const OWNER_PLACEHOLDER = /\[(LEGAL ENTITY NAME|JURISDICTION)\]|example\.com/;

function isProse(segment) {
  if (segment.length < MIN_PROSE_LENGTH) return false;
  if (LANGUAGE_NAMES.has(segment)) return false;
  if (SHARED_BY_DESIGN.some((pattern) => pattern.test(segment))) return false;
  if (OWNER_PLACEHOLDER.test(segment)) return false;
  if (isProperNounPhrase(segment)) return false;
  // A segment with no lower-case run of three letters is a label or an acronym.
  return /[a-z]{3}/.test(segment);
}

const pages = await readPages();
const englishByRoute = new Map();
const translated = [];

for (const page of pages) {
  const first = page.url.split('/')[1] ?? '';
  if (LOCALE_SEGMENTS.has(first))
    translated.push({ ...page, route: page.url.slice(first.length + 1) });
  else englishByRoute.set(page.url, page);
}

const leaks = new Map();
let comparedPages = 0;
let comparedSegments = 0;

for (const page of translated) {
  const english = englishByRoute.get(page.route);
  if (english === undefined) continue;
  comparedPages += 1;

  const englishSegments = new Set(textSegments(english.html).filter(isProse));
  for (const segment of new Set(textSegments(page.html))) {
    if (!isProse(segment)) continue;
    comparedSegments += 1;
    if (!englishSegments.has(segment)) continue;
    const existing = leaks.get(segment);
    if (existing === undefined) leaks.set(segment, { count: 1, example: page.url });
    else existing.count += 1;
  }
}

if (leaks.size > 0) {
  const ranked = [...leaks.entries()].sort((a, b) => b[1].count - a[1].count);
  fail(
    `English leaked into translated pages: ${ranked.length} distinct string(s)`,
    ranked.map(
      ([segment, { count, example }]) =>
        `${count} page(s), e.g. ${example}\n      "${segment.slice(0, 120)}"`,
    ),
  );
}

pass(
  `i18n leak audit: ${comparedPages} translated pages compared against their English counterparts, ${comparedSegments} prose segments checked, no English found`,
);
