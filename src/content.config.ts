import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from astro:content, which is deprecated.
import { z } from 'zod';

/**
 * Guides live as Markdown, one directory per locale. The schema is enforced at
 * build time, so a guide missing a description or carrying a bad date fails the
 * build rather than shipping a page with an empty meta description.
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().min(10).max(70),
    /** Meta description. Capped below the 155-character ceiling the audit enforces. */
    description: z.string().min(50).max(155),
    /** The answer-first opening sentence, rendered above the article body. */
    summary: z.string().min(60).max(400),
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
    title: z.string().min(3).max(70),
    description: z.string().min(40).max(155),
    order: z.number().int().min(1),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    noIndex: z.boolean().default(false),
  }),
});

export const collections = { guides, pages };
