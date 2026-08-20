import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_TITLE_LENGTH, formatTitle } from '~/lib/seo/metadata.ts';

/**
 * Every Markdown title must survive `formatTitle` inside the sixty characters a
 * result page shows.
 *
 * `formatTitle` drops the brand suffix rather than overflow (decision D26), so
 * this is really a check on the raw title: no translated guide or support page
 * may exceed sixty characters on its own. The zod schema allows seventy so that
 * a draft is not rejected mid-write; the build is what has to be right, and
 * `scripts/seo-audit.mjs` fails on the rendered HTML for the same reason. This
 * test moves that failure from a three-minute build to a four-second run.
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

/** Frontmatter titles are quoted in every translated file and bare in some English ones. */
const TITLE_LINE = /^title:\s*(?:"([^"]*)"|'([^']*)'|(.*))$/mu;

function frontmatterTitle(path: string): string {
  const source = readFileSync(path, 'utf8');
  const frontmatter = source.split('---')[1] ?? '';
  const match = TITLE_LINE.exec(frontmatter);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
}

describe('rendered titles fit the sixty characters a search result shows', () => {
  for (const collection of ['guides', 'pages'] as const) {
    it(`holds for every ${collection} entry`, () => {
      const overlong: string[] = [];
      for (const path of markdownFiles(join(CONTENT_ROOT, collection))) {
        const rendered = formatTitle(frontmatterTitle(path));
        if (rendered.length > MAX_TITLE_LENGTH) {
          overlong.push(`${path.slice(CONTENT_ROOT.length)}: ${rendered.length} — ${rendered}`);
        }
      }
      expect(overlong).toEqual([]);
    });
  }
});
