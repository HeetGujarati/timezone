/**
 * The 14 launch locales. `en` is the default and lives at the site root; every
 * other locale is prefixed (`/es/`, `/de/`, …) via `prefixDefaultLocale: false`.
 *
 * `dir` drives `<html dir>` and the logical-property layout. `hourCycle` is the
 * convention a native reader expects — it is passed to `Intl` explicitly rather
 * than inferred, so a locale that formats 24h in one region cannot silently flip.
 * `firstDayOfWeek` is 1 = Monday … 7 = Sunday (ISO-8601 numbering) and drives the
 * meeting-planner grid.
 */
export type LocaleCode =
  | 'en'
  | 'es'
  | 'pt-BR'
  | 'fr'
  | 'de'
  | 'it'
  | 'ru'
  | 'tr'
  | 'ar'
  | 'hi'
  | 'id'
  | 'ja'
  | 'ko'
  | 'zh-Hans';

export type LocaleDefinition = {
  readonly code: LocaleCode;
  /** BCP-47 tag for `<html lang>` and `Intl` */
  readonly bcp47: string;
  /** Endonym — how speakers of the locale name their own language */
  readonly label: string;
  readonly dir: 'ltr' | 'rtl';
  readonly hourCycle: 'h12' | 'h23';
  readonly firstDayOfWeek: 1 | 6 | 7;
  /** hreflang value emitted for this locale */
  readonly hreflang: string;
  /** Lowercase URL path segment. Empty for the default locale, which lives at the root. */
  readonly segment: string;
};

export const LOCALES = [
  {
    code: 'en',
    bcp47: 'en',
    label: 'English',
    dir: 'ltr',
    hourCycle: 'h12',
    firstDayOfWeek: 7,
    hreflang: 'en',
    segment: '',
  },
  {
    code: 'es',
    bcp47: 'es',
    label: 'Español',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'es',
    segment: 'es',
  },
  {
    code: 'pt-BR',
    bcp47: 'pt-BR',
    label: 'Português (Brasil)',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 7,
    hreflang: 'pt-BR',
    segment: 'pt-br',
  },
  {
    code: 'fr',
    bcp47: 'fr',
    label: 'Français',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'fr',
    segment: 'fr',
  },
  {
    code: 'de',
    bcp47: 'de',
    label: 'Deutsch',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'de',
    segment: 'de',
  },
  {
    code: 'it',
    bcp47: 'it',
    label: 'Italiano',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'it',
    segment: 'it',
  },
  {
    code: 'ru',
    bcp47: 'ru',
    label: 'Русский',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'ru',
    segment: 'ru',
  },
  {
    code: 'tr',
    bcp47: 'tr',
    label: 'Türkçe',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'tr',
    segment: 'tr',
  },
  {
    code: 'ar',
    bcp47: 'ar',
    label: 'العربية',
    dir: 'rtl',
    hourCycle: 'h12',
    firstDayOfWeek: 6,
    hreflang: 'ar',
    segment: 'ar',
  },
  {
    code: 'hi',
    bcp47: 'hi',
    label: 'हिन्दी',
    dir: 'ltr',
    hourCycle: 'h12',
    firstDayOfWeek: 7,
    hreflang: 'hi',
    segment: 'hi',
  },
  {
    code: 'id',
    bcp47: 'id',
    label: 'Bahasa Indonesia',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'id',
    segment: 'id',
  },
  {
    code: 'ja',
    bcp47: 'ja',
    label: '日本語',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 7,
    hreflang: 'ja',
    segment: 'ja',
  },
  {
    code: 'ko',
    bcp47: 'ko',
    label: '한국어',
    dir: 'ltr',
    hourCycle: 'h12',
    firstDayOfWeek: 7,
    hreflang: 'ko',
    segment: 'ko',
  },
  {
    code: 'zh-Hans',
    bcp47: 'zh-Hans',
    label: '简体中文',
    dir: 'ltr',
    hourCycle: 'h23',
    firstDayOfWeek: 1,
    hreflang: 'zh-Hans',
    segment: 'zh-hans',
  },
] as const satisfies readonly LocaleDefinition[];

export const DEFAULT_LOCALE: LocaleCode = 'en';

export const LOCALE_CODES: readonly LocaleCode[] = LOCALES.map((l) => l.code);

/** Every locale except the default — these are the prefixed routes. */
export const PREFIXED_LOCALES: readonly LocaleCode[] = LOCALE_CODES.filter(
  (c) => c !== DEFAULT_LOCALE,
);

const BY_CODE = new Map<string, LocaleDefinition>(LOCALES.map((l) => [l.code, l]));

export function getLocale(code: string): LocaleDefinition {
  const found = BY_CODE.get(code);
  if (!found) throw new Error(`Unknown locale: ${code}`);
  return found;
}

export function isLocaleCode(value: string): value is LocaleCode {
  return BY_CODE.has(value);
}

const BY_SEGMENT = new Map<string, LocaleDefinition>(LOCALES.map((l) => [l.segment, l]));

/** Resolve a URL path segment (e.g. "pt-br") back to its locale definition. */
export function localeFromSegment(segment: string): LocaleDefinition | undefined {
  return BY_SEGMENT.get(segment);
}

/**
 * Build a site-root-relative path for a locale. English lives at the root,
 * every other locale is prefixed. Always returns a leading and trailing slash.
 */
export function localePath(code: LocaleCode, path = '/'): string {
  const { segment } = getLocale(code);
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const prefix = segment === '' ? '/' : `/${segment}/`;
  return `${prefix}${clean}`.replace(/\/{2,}/g, '/');
}
