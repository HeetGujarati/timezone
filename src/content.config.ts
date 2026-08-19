import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from astro:content, which is deprecated.
import { z } from 'zod';
import { atLeast } from '~/lib/content/information-length.ts';

/**
 * Guides live as Markdown, one directory per locale. The schema is enforced at
 * build time, so a guide missing a description or carrying a bad date fails the
 * build rather than shipping a page with an empty meta description.
 */
/**
 * Minimum lengths go through `atLeast`, which weights CJK characters above Latin
 * ones. A raw count makes one floor mean two different things: twenty characters
 * of Chinese is a complete meta description, twenty of English is three words.
 * Maximums stay as raw counts — those exist because search results truncate by
 * rendered width, where a CJK glyph is the wider one.
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(70).refine(atLeast(10).check, atLeast(10).message),
    /** Meta description. Capped below the 155-character ceiling the audit enforces. */
    description: z.string().max(155).refine(atLeast(50).check, atLeast(50).message),
    /** The answer-first opening sentence, rendered above the article body. */
    summary: z.string().max(400).refine(atLeast(60).check, atLeast(60).message),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** Ordering on the hub page. Lower is earlier. */
    order: z.number().int().min(1),
    keywords: z.array(z.string().min(3)).min(2).max(8),
    /** Slugs of related guides, cross-linked at the foot of the article. */
    related: z.array(z.string()).max(4).default([]),
  }),
});

/**
 * Support and legal pages, one directory per locale. Same shape as guides so a
 * translation is a file rather than a code change.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().max(70).refine(atLeast(3).check, atLeast(3).message),
    description: z.string().max(155).refine(atLeast(40).check, atLeast(40).message),
    order: z.number().int().min(1),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    noIndex: z.boolean().default(false),
  }),
});

export const collections = { guides, pages };
