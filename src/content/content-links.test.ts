import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isRewritable, localeFromPath, localiseHref } from '~/lib/markdown/localise-links.ts';

/**
 * Every Markdown link must point inside its own locale.
 *
 * A German page linking to `/contact/` sends the reader to the English contact
 * page. Nothing else catches this: the target exists, so the link checker is
 * satisfied, and the page renders fine — the reader just lands in the wrong
 * language. Astro 7's Markdown processor takes no rehype plugin without being
 * replaced wholesale, so the prefix is written by hand and checked here.
 */

const CONTENT_ROOT = new URL('.', import.meta.url).pathname;

function markdownFiles(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...markdownFiles(path));
    else if (entry.endsWith('.md')) found.push(path);
  }
  return found;
}

/** Markdown inline links: [text](/path/). Reference and HTML links are not used here. */
const MARKDOWN_LINK = /\]\(([^)\s]+)/gu;

describe('markdown content links', () => {
  const files = markdownFiles(CONTENT_ROOT);

  it('finds content to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('keeps every localised page’s links inside its own locale', () => {
    const wrong: string[] = [];

    for (const file of files) {
      const locale = localeFromPath(file);
      if (locale === undefined) continue; // English needs no prefix.

      const body = readFileSync(file, 'utf8');
      for (const [, href] of body.matchAll(MARKDOWN_LINK)) {
        if (!isRewritable(href)) continue;
        const relative = file.slice(file.indexOf('/content/') + 1);
        wrong.push(`${relative}: ${href} should be ${localiseHref(locale, href)}`);
      }
    }

    expect(wrong).toEqual([]);
  });
});
