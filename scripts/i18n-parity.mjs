#!/usr/bin/env node
/**
 * Translation coverage.
 *
 * English is the contract. Any locale missing a key would render an English
 * sentence in the middle of an otherwise translated page, which reads worse than
 * either language alone — so a missing key fails the build. An *extra* key is also
 * an error: it means a string was renamed in English and the translation now
 * carries dead weight nobody will notice.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const I18N = new URL('../src/i18n/', import.meta.url).pathname;
const COPY = new URL('../src/content/tools/locales/', import.meta.url).pathname;
const GUIDES = new URL('../src/content/guides/', import.meta.url).pathname;
const PAGES = new URL('../src/content/pages/', import.meta.url).pathname;

const LOCALES = [
  'en',
  'es',
  'pt-BR',
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
  'zh-Hans',
];

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function listDir(path) {
  try {
    return await readdir(path);
  } catch {
    return [];
  }
}

const english = await readJson(join(I18N, 'en.json'));
const englishKeys = Object.keys(english);

const problems = [];
const report = [];

for (const locale of LOCALES) {
  const dictionaryPath = join(I18N, `${locale}.json`);
  let dictionary;
  try {
    dictionary = await readJson(dictionaryPath);
  } catch {
    problems.push(`${locale}: no dictionary at src/i18n/${locale}.json`);
    continue;
  }

  const keys = Object.keys(dictionary);
  const missing = englishKeys.filter((key) => !(key in dictionary));
  const extra = keys.filter((key) => !(key in english));
  const empty = englishKeys.filter(
    (key) => typeof dictionary[key] === 'string' && dictionary[key].trim() === '',
  );
  const untranslated =
    locale === 'en' ? [] : englishKeys.filter((key) => dictionary[key] === english[key]);

  if (missing.length > 0)
    problems.push(`${locale}: ${missing.length} missing keys — ${missing.slice(0, 5).join(', ')}`);
  if (extra.length > 0)
    problems.push(
      `${locale}: ${extra.length} keys not in English — ${extra.slice(0, 5).join(', ')}`,
    );
  if (empty.length > 0) problems.push(`${locale}: ${empty.length} empty values`);

  // Placeholders must survive translation, or the sentence loses its number.
  for (const key of englishKeys) {
    const source = english[key];
    const target = dictionary[key];
    if (typeof source !== 'string' || typeof target !== 'string') continue;
    const sourceSlots = [...source.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    const targetSlots = [...target.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    if (sourceSlots.join(',') !== targetSlots.join(',')) {
      problems.push(
        `${locale}: placeholder mismatch in "${key}" — expected {${sourceSlots.join('} {')}}`,
      );
    }
  }

  const hasCopy = (await listDir(COPY)).includes(`${locale}.ts`);
  const guideCount = (await listDir(join(GUIDES, locale))).filter((name) =>
    name.endsWith('.md'),
  ).length;
  const pageCount = (await listDir(join(PAGES, locale))).filter((name) =>
    name.endsWith('.md'),
  ).length;

  report.push({
    locale,
    keys: `${keys.length - missing.length}/${englishKeys.length}`,
    identicalToEnglish: untranslated.length,
    pageCopy: locale === 'en' ? 'source' : hasCopy ? 'yes' : 'FALLBACK',
    guides: `${guideCount}/12`,
    pages: `${pageCount}/6`,
  });
}

console.log('\nTranslation coverage\n');
console.table(report);

if (problems.length > 0) {
  console.error('\ni18n parity failed:\n');
  for (const problem of problems.slice(0, 30)) console.error(`  ${problem}`);
  if (problems.length > 30) console.error(`  ... and ${problems.length - 30} more`);
  process.exit(1);
}

console.log('i18n parity: every locale has every key, with matching placeholders');
