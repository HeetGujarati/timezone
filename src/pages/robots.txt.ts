import type { APIRoute } from 'astro';
import { SITE, absoluteUrl } from '~/config/site.ts';

export const prerender = true;

/**
 * robots.txt, generated at build so the sitemap URL follows PUBLIC_SITE_URL.
 *
 * Deliberately permissive: nothing is disallowed. Blocking CSS or JS breaks
 * Google's ability to render the page, and this site has no private routes,
 * no API, no admin surface and no build-tool directory worth hiding — every
 * URL that exists is one we want indexed.
 */
export const GET: APIRoute = () => {
  const body = [
    '# https://www.robotstxt.org/robotstxt.html',
    `# ${SITE.name} — every page here is meant to be indexed.`,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Nothing is disallowed. Blocking CSS or JS would stop crawlers rendering the tools.',
    '',
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
