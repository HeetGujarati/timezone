import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE, absoluteUrl } from '~/config/site.ts';

export const prerender = true;

/**
 * Guides feed. English only for now — a feed mixing fourteen languages is worse
 * than no feed, and per-locale feeds are added when a locale has an audience.
 */
export const GET: APIRoute = async (context) => {
  const guides = (await getCollection('guides', (entry) => entry.id.startsWith('en/'))).sort(
    (a, b) => a.data.order - b.data.order,
  );

  return rss({
    title: `${SITE.name} — guides`,
    description: 'How time zones actually work, and how software gets them wrong.',
    site: context.site ?? SITE.origin,
    items: guides.map((guide) => {
      const slug = guide.id.replace(/^en\//, '');
      return {
        title: guide.data.title,
        description: guide.data.summary,
        link: absoluteUrl(`/guides/${slug}/`),
        pubDate: new Date(`${guide.data.publishedAt}T00:00:00Z`),
        categories: [...guide.data.keywords],
      };
    }),
    customData: '<language>en</language>',
  });
};
