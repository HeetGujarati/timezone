import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOCALES, type LocaleCode } from '~/config/locales.ts';

/**
 * No locale's prose may contain a script that is not its own.
 *
 * This catches a specific, invisible failure: a clause borrowed from the wrong
 * language while writing a translation. It survives type-checking, the build,
 * and review — it only fails in front of a reader. Two have already happened
 * here: a Russian fragment in the Japanese converter FAQ, and the bare English
 * word "territory" left inside a Chinese sentence.
 *
 * Latin is checked differently from the rest. Every locale legitimately carries
 * UTC, IANA, tzdata and zone identifiers, so for non-Latin locales this looks
 * for runs of Latin letters that are *not* on the allowed list of technical
 * terms rather than for Latin at all.
 */

const CONTENT = new URL('.', import.meta.url).pathname;

const SCRIPTS = {
  cyrillic: /[Ѐ-ӿ]/u,
  arabic: /[؀-ۿ]/u,
  devanagari: /[ऀ-ॿ]/u,
  hangul: /[가-힯ᄀ-ᇿ]/u,
  kana: /[぀-ゟ゠-ヿ]/u,
  han: /[一-鿿]/u,
} as const;

type Script = keyof typeof SCRIPTS;

/** Japanese uses han for kanji; the rest own exactly one script. */
const OWN_SCRIPTS: Partial<Record<LocaleCode, readonly Script[]>> = {
  ru: ['cyrillic'],
  ar: ['arabic'],
  hi: ['devanagari'],
  ko: ['hangul'],
  ja: ['kana', 'han'],
  'zh-Hans': ['han'],
};

/** Locales that do not use Latin script for their own prose. */
const NON_LATIN: readonly LocaleCode[] = ['ru', 'ar', 'hi', 'ko', 'ja', 'zh-Hans'];

/**
 * Latin runs every locale is allowed to carry: standards bodies, zone
 * identifiers, protocol names, and the placeholders the legal pages use.
 */
const ALLOWED_LATIN = new Set(
  [
    'UTC', 'GMT', 'IANA', 'tzdata', 'Olson', 'NOAA', 'ISO', 'RFC', 'API', 'CDN', 'ARIA',
    'WCAG', 'AA', 'GDPR', 'CCPA', 'EEA', 'EU', 'UK', 'DST', 'JavaScript', 'Intl', 'HTML', 'CSS', 'JSON', 'URL',
    'Meridiem', 'SECURITY', 'md', 'LEGAL', 'ENTITY', 'NAME', 'JURISDICTION',
    'America', 'New_York', 'Asia', 'Kathmandu', 'Europe', 'London', 'Argentina',
    'Buenos_Aires', 'Africa', 'Pacific', 'Australia', 'Etc', 'Chatham', 'Lord', 'Howe',
    'hello', 'example', 'com', 'security', 'txt', 'well', 'known', 'mailto', 'http',
    'https', 'theme', 'planner', 'zones', 'pinned', 'cities', 'light', 'dark', 'Cookie',
    'meridiem', 'prefers', 'reduced', 'motion', 'aria', 'live', 'polite', 'Apollo',
    'Unix', 'CUT', 'TUC', 'EST', 'EDT', 'CET', 'CEST', 'IST', 'JST', 'KST', 'AEDT',
    'AKDT', 'PST', 'PDT', 'BST', 'UTC-5', 'UTC-4', 'UTC+0', 'UTC+3',
    // The official English names the abbreviations stand for. The guide on
    // ambiguous abbreviations is *about* these strings, so they stay in English
    // in every locale — translating "Indian Standard Time" would destroy the
    // point, which is that three different standards share the letters IST.
    'Indian', 'Irish', 'Israel', 'Central', 'China', 'Cuba', 'Pacific',
    'Philippine', 'Bangladesh', 'Eastern', 'Australian', 'European', 'Standard',
    'CST', 'AEST', 'NZDT', 'NZST', 'ICU',
    // Product, project and standard names the guides cite by name.
    'Reddit', 'Mozilla', 'Linux', 'Cloudflare', 'DNS', 'GPS', 'TAI', 'UT1', 'BIPM',
    'Greenwich', 'Newfoundland', 'Kiritimati', 'Olson', 'British', 'Summer', 'Time',
    'AOLserver', 'PostgreSQL', 'MySQL', 'SQL', 'Server', 'Java', 'Python', 'Go',
    'NTP', 'NTPv', 'pandas', 'schema', 'org', 'BIGINT', 'TIMESTAMP', 'TIMESTAMPTZ',
    'DATETIME', 'time_t', 'Instant', 'int', 'long', 'Postgres', 'DynamoDB', 'schema',
    'ECMAScript', 'Temporal', 'zoneinfo', 'ZoneInfo', 'LoadLocation', 'tzdata',
  ].map((term) => term.toLowerCase()),
);

const LATIN_RUN = /[A-Za-z][A-Za-z0-9_-]*/gu;

/** 'UTC-5' and 'UTC-05' both reduce to 'UTC'; 'New_York' is left intact. */
function core(word: string): string {
  return word.replace(/[-_0-9]+$/u, '');
}

/**
 * A hyphenated or underscored compound passes when every part passes. This is
 * what lets through `.well-known` (fixed by RFC 8615) and the literal local
 * storage keys `meridiem-theme`, `meridiem-planner-zones`, `meridiem-pinned-cities`,
 * which are identifiers a reader must be able to copy exactly.
 */
function isAllowed(word: string): boolean {
  const stem = core(word).toLowerCase();
  if (ALLOWED_LATIN.has(stem)) return true;
  const parts = stem.split(/[-_]/u).filter(Boolean);
  return parts.length > 1 && parts.every((part) => ALLOWED_LATIN.has(part));
}

function markdownFiles(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...markdownFiles(path));
    else if (entry.endsWith('.md')) found.push(path);
  }
  return found;
}

function localeOf(path: string): LocaleCode | undefined {
  const directory = path.split('/').at(-2);
  return LOCALES.map((locale) => locale.code).find(
    (code) => code.toLowerCase() === directory?.toLowerCase(),
  );
}

/**
 * Quotation marks of every style these locales use. Text inside them is a
 * deliberate quotation — the UTC guide has to print the English "coordinated
 * universal time" and the French "temps universel coordonné" to explain where
 * CUT and TUC came from, and that is content, not leakage.
 */
const QUOTED =
  /[«„“”"‘’'「『][^«„“”"‘’'」』]{0,120}[»„“”"‘’'」』]/gu;

/** Strip code spans, fenced blocks, links, quotations and frontmatter keys. */
function prose(markdown: string): string {
  return markdown
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/```[\s\S]*?```/gu, '')
    .replace(/`[^`]*`/gu, '')
    .replace(/\]\([^)]*\)/gu, ']')
    .replace(/^\s*(publishedAt|updatedAt|order|keywords|related):.*$/gmu, '')
    .replace(QUOTED, ' ');
}

describe('markdown content', () => {
  const files = markdownFiles(CONTENT).filter((file) => localeOf(file) !== undefined);

  it('finds content to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('never borrows another language’s script', () => {
    const leaks: string[] = [];
    for (const file of files) {
      const locale = localeOf(file)!;
      const own = OWN_SCRIPTS[locale] ?? [];
      const text = prose(readFileSync(file, 'utf8'));
      for (const script of Object.keys(SCRIPTS) as Script[]) {
        if (own.includes(script)) continue;
        const match = SCRIPTS[script].exec(text);
        if (match !== null) {
          leaks.push(`${file.slice(file.indexOf('/content/'))}: ${script} "${match[0]}"`);
        }
      }
    }
    expect(leaks).toEqual([]);
  });

  it('leaves no untranslated English words in non-Latin locales', () => {
    const leaks: string[] = [];
    for (const file of files) {
      const locale = localeOf(file)!;
      if (!NON_LATIN.includes(locale)) continue;
      const text = prose(readFileSync(file, 'utf8'));
      for (const [word] of text.matchAll(LATIN_RUN)) {
        if (core(word).length < 3) continue;
        if (isAllowed(word)) continue;
        leaks.push(`${file.slice(file.indexOf('/content/'))}: "${word}"`);
      }
    }
    expect(leaks.slice(0, 5)).toEqual([]);
  });
});
