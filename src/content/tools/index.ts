import type { LocaleCode } from '~/config/locales.ts';
import type { PageCopy } from './types.ts';
import { en } from './en.ts';

/**
 * Per-locale page copy, with a clean fall back to English.
 *
 * A locale that has not been written yet renders in English rather than showing
 * empty sections or raw keys — a half-translated page is worse than an English
 * one, and scripts/i18n-parity.mjs reports which locales are still falling back.
 */
const registry = import.meta.glob<{ default?: PageCopy } & Record<string, PageCopy>>(
  './locales/*.ts',
  { eager: true },
);

function loadCopy(locale: LocaleCode): PageCopy | undefined {
  const entry = registry[`./locales/${locale}.ts`];
  if (entry === undefined) return undefined;
  return entry.default ?? entry[locale.replace('-', '')] ?? undefined;
}

export function getPageCopy(locale: LocaleCode): PageCopy {
  return loadCopy(locale) ?? en;
}

/** Whether a locale has its own copy, or is falling back to English. */
export function hasPageCopy(locale: LocaleCode): boolean {
  return loadCopy(locale) !== undefined;
}

export { en };
export type { PageCopy, ToolKey, ToolCopy, Faq, Section } from './types.ts';
