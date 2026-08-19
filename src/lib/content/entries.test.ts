import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOCALES } from '~/config/locales.ts';
import { entryPrefix, entrySlug, findLocaleEntry, isLocaleEntry } from './entries.ts';

/**
 * Mirrors Astro's glob loader: it slugifies the path into the entry ID, so
 * `pt-BR/about.md` is stored as `pt-br/about`.
 */
function loaderId(directory: string, file: string): string {
  return `${directory.toLowerCase()}/${file.replace(/\.md$/, '')}`;
}

const CONTENT = new URL('../../content/', import.meta.url).pathname;

function entriesOnDisk(collection: 'pages' | 'guides'): Array<{ id: string }> {
  const root = join(CONTENT, collection);
  return readdirSync(root)
    .filter((directory) => statSync(join(root, directory)).isDirectory())
    .flatMap((directory) =>
      readdirSync(join(root, directory))
        .filter((file) => file.endsWith('.md'))
        .map((file) => ({ id: loaderId(directory, file) })),
    );
}

describe('entryPrefix', () => {
  it('lowercases the locale code, matching what the loader slugifies', () => {
    expect(entryPrefix('pt-BR')).toBe('pt-br/');
    expect(entryPrefix('zh-Hans')).toBe('zh-hans/');
    expect(entryPrefix('de')).toBe('de/');
  });

  it('keeps a prefix for English, which has no URL segment but does have a directory', () => {
    // prefixDefaultLocale is false, so English pages sit at the root — but the
    // content still lives in src/content/pages/en/. Keying off the URL segment
    // would produce '/' and match everything.
    expect(entryPrefix('en')).toBe('en/');
  });
});

describe('entrySlug', () => {
  it('strips the locale segment', () => {
    expect(entrySlug('pt-br/about')).toBe('about');
    expect(entrySlug('zh-hans/what-utc-really-is')).toBe('what-utc-really-is');
  });
});

describe('findLocaleEntry', () => {
  const entries = [{ id: 'en/about' }, { id: 'pt-br/about' }, { id: 'zh-hans/about' }];

  it('finds an entry whose directory was not already lowercase', () => {
    // The bug: looking up `pt-BR/about` misses `pt-br/about`, and the English
    // fallback then renders — silently, on every page, for two locales.
    expect(findLocaleEntry(entries, 'pt-BR', 'about')?.id).toBe('pt-br/about');
    expect(findLocaleEntry(entries, 'zh-Hans', 'about')?.id).toBe('zh-hans/about');
  });

  it('returns undefined for a locale that has no translation', () => {
    expect(findLocaleEntry(entries, 'ja', 'about')).toBeUndefined();
  });
});

describe('isLocaleEntry', () => {
  it('does not confuse one locale for another that shares a prefix', () => {
    // 'pt-br/' must not match an entry under a hypothetical 'pt/'.
    expect(isLocaleEntry({ id: 'pt-br/about' }, 'pt-BR')).toBe(true);
    expect(isLocaleEntry({ id: 'en/about' }, 'pt-BR')).toBe(false);
  });
});

describe.each(['pages', 'guides'] as const)('%s on disk', (collection) => {
  const entries = entriesOnDisk(collection);
  const slugs = entries.filter((entry) => isLocaleEntry(entry, 'en')).map((entry) => entrySlug(entry.id));

  it('has English entries to key off', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('resolves every translation that exists on disk', () => {
    // Catches the whole class of bug: a directory present but never found.
    const unreachable: string[] = [];
    for (const { code } of LOCALES) {
      const present = entries.filter((entry) => entry.id.startsWith(`${code.toLowerCase()}/`));
      for (const entry of present) {
        if (findLocaleEntry(entries, code, entrySlug(entry.id)) === undefined) {
          unreachable.push(`${code}: ${entry.id}`);
        }
      }
    }
    expect(unreachable).toEqual([]);
  });
});
