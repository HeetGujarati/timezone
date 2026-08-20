import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE, absoluteUrl } from '~/config/site.ts';
import { CITIES } from '~/data/cities.ts';
import { TOOLS } from '~/data/tools.ts';

export const prerender = true;

/**
 * /llms.txt — the proposed convention for telling a language model what a site
 * holds and where the durable parts of it are, in Markdown rather than HTML.
 *
 * Two decisions worth stating. It lists the guides and the tools in full, and it
 * lists cities rather than the 1,448 pair pages: a model that knows the cities
 * and the URL shape can construct any pair link it needs, and a list of 1,448
 * links would be longer than the rest of the file put together for no extra
 * information. And it says plainly which figures on this site are computed at
 * build time and which are computed in the reader's browser, because a model
 * quoting a prerendered "current time" would be quoting the last rebuild.
 */
export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides', (entry) => entry.id.startsWith('en/'))).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}. ${SITE.defaultDescription}`,
    '',
    'Every offset, transition date and abbreviation on this site is read from the IANA time zone',
    'database through the runtime `Intl` API. Nothing is stored in a table maintained by hand, and',
    'no date library is used. The site is static: durable facts (standard and daylight offsets, the',
    'difference between two zones, transition dates, working-hour overlap) are rendered at build',
    'time and labelled "as of the last rebuild"; anything that depends on the current instant is',
    "computed in the reader's browser. A figure quoted from the HTML is a durable fact, not a live",
    'clock.',
    '',
    `Available in ${SITE.locales.length} languages. The English pages are at the paths below; a`,
    'translation is the same path behind its locale segment, for example `/de/guides/` or',
    '`/ja/time-in/tokyo/`.',
    '',
    '## Guides',
    '',
    ...guides.map((guide) => {
      const slug = guide.id.replace(/^en\//, '');
      return `- [${guide.data.title}](${absoluteUrl(`/guides/${slug}/`)}): ${guide.data.summary}`;
    }),
    '',
    '## Tools',
    '',
    ...TOOLS.map((tool) => `- [${tool.name}](${absoluteUrl(tool.path)}): ${tool.summary}`),
    '',
    '## City pages',
    '',
    `Current local time, offset, daylight saving status and next transition for ${CITIES.length}`,
    'cities, at `/time-in/{city}/`:',
    '',
    ...CITIES.map(
      (city) => `- [${city.name}](${absoluteUrl(`/time-in/${city.slug}/`)}) — ${city.timeZone}`,
    ),
    '',
    '## Conversion pages',
    '',
    'Every ordered pair of the cities above has a page at `/convert/{from}-to-{to}/` — for example',
    `${absoluteUrl('/convert/tokyo-to-berlin/')}. Each carries the difference, an hour-by-hour`,
    'table, both cities’ daylight saving dates and the overlap of their working days.',
    '',
    'Abbreviation pairs are at `/convert/{from}-to-{to}/` using the abbreviations themselves, for',
    `example ${absoluteUrl('/convert/est-to-cet/')}. These pages compute at a date on which the`,
    'abbreviation actually exists, because EST does not exist in July.',
    '',
    '## Optional',
    '',
    `- [Guides feed](${absoluteUrl('/guides/rss.xml')}): English guides, RSS 2.0`,
    `- [Sitemap index](${absoluteUrl('/sitemap-index.xml')}): every page in every language`,
    `- [About](${absoluteUrl('/about/')}): what the site is and how it computes what it shows`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
