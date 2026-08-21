import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { createRequire } from 'node:module';
import type { AstroIntegration } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Open Graph images, generated from the built HTML rather than from a list.
 *
 * Every template already declares the `og:image` it wants. Enumerating those
 * declarations from `dist` instead of re-deriving them here means the two cannot
 * drift: an image is generated precisely when a page asks for one, and a page
 * that asks for one always gets it. A route added later needs no change to this
 * file.
 *
 * **Images are per entity, not per URL.** `/og/convert/tokyo-berlin.png` is
 * referenced by all fourteen locales of that pair, so 4,570 pages need about
 * 1,800 images rather than 4,570. The wording on the card is taken from the
 * English page — the one whose path carries no locale prefix — because the card
 * is shared and its text has to be one language. Decision D27 in DECISIONS.md.
 */

const WIDTH = 1200;
const HEIGHT = 630;

/** Tokens copied from src/styles/tokens.css. Satori has no CSS variables. */
const INK = '#111721';
const PAPER = '#f5f6f8';
const GRAPHITE = '#5c6674';
const ACCENT = '#2743c8';
const RULE = '#dde1e7';

const require = createRequire(import.meta.url);

/**
 * IBM Plex Sans Condensed ships plain `.woff`, which Satori reads; the variable
 * package ships only `.woff2`, which it does not. Latin subset only: the card
 * text is always the English wording, and shipping four scripts would add
 * megabytes to the build for glyphs no card uses.
 */
function fontPath(weight: 400 | 600 | 700): string {
  return require.resolve(
    `@fontsource/ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-${weight}-normal.woff`,
  );
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const OG_IMAGE = /<meta property="og:image" content="([^"]+)"/;
const OG_TITLE = /<meta property="og:title" content="([^"]+)"/;
const OG_DESCRIPTION = /<meta property="og:description" content="([^"]+)"/;

function decodeEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

/** A card, keyed by the image path every page that wants it agreed on. */
interface Card {
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  /** True once the English page has claimed it; later locales then leave it alone. */
  readonly fromDefaultLocale: boolean;
}

/**
 * `/de/guides/x/` → true, `/guides/x/` → false. The default locale has no prefix,
 * so a first segment that is a known locale segment means this is a translation.
 */
function isPrefixed(pagePath: string, localeSegments: readonly string[]): boolean {
  const first = pagePath.split('/').filter(Boolean)[0];
  return first !== undefined && localeSegments.includes(first);
}

/** The section label printed above the title. Derived from the image path. */
function eyebrowFor(imagePath: string): string {
  const segments = imagePath.replace(/^\/og\//, '').split('/');
  if (segments.length < 2) return 'YourWorldTime';
  switch (segments[0]) {
    case 'guides':
      return 'Guide';
    case 'convert':
      return 'Time zone conversion';
    case 'time-in':
      return 'Local time';
    default:
      return 'YourWorldTime';
  }
}

/** Trim to a word boundary so a long description does not run off the card. */
function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const space = cut.lastIndexOf(' ');
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

/**
 * The card layout, as the plain object tree Satori accepts in place of JSX.
 * Written by hand because the project has no JSX runtime and does not want one
 * for six nodes.
 */
function cardTree(card: Card, siteName: string, origin: string): Record<string, unknown> {
  const host = new URL(origin).host;
  const node = (
    type: string,
    style: Record<string, unknown>,
    children: unknown,
  ): Record<string, unknown> => ({ type, props: { style, children } });

  return node(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '64px 72px',
      fontFamily: 'IBM Plex Sans Condensed',
      // A single accent rule down the left edge: the one brand mark that survives
      // being scaled to a 120px thumbnail in a chat client.
      borderLeft: `16px solid ${ACCENT}`,
    },
    [
      node('div', { display: 'flex', flexDirection: 'column' }, [
        node(
          'div',
          {
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: 28,
          },
          card.eyebrow,
        ),
        node(
          'div',
          { fontSize: 66, fontWeight: 700, color: INK, lineHeight: 1.12, letterSpacing: '-0.01em' },
          clamp(card.title, 78),
        ),
        node(
          'div',
          { fontSize: 32, fontWeight: 400, color: GRAPHITE, lineHeight: 1.4, marginTop: 28 },
          clamp(card.description, 150),
        ),
      ]),
      node(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `2px solid ${RULE}`,
          paddingTop: 26,
        },
        [
          node('div', { fontSize: 30, fontWeight: 700, color: INK }, siteName),
          node('div', { fontSize: 26, fontWeight: 400, color: GRAPHITE }, host),
        ],
      ),
    ],
  );
}

export function ogImages(options: { siteName: string; origin: string }): AstroIntegration {
  return {
    name: 'meridiem:og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const started = Date.now();
        const distPath = dir.pathname;

        // Locale segments are read back out of the built tree: any directory at the
        // root that holds an index.html and is a two-to-seven character tag.
        const localeSegments = (await readdir(distPath, { withFileTypes: true }))
          .filter((entry) => entry.isDirectory() && /^[a-z]{2}(-[a-z0-9]+)?$/.test(entry.name))
          .map((entry) => entry.name);

        const cards = new Map<string, Card>();

        for await (const path of walk(distPath)) {
          if (!path.endsWith('.html')) continue;
          const html = await readFile(path, 'utf8');

          const image = OG_IMAGE.exec(html)?.[1];
          if (image === undefined) continue;

          // og:image is absolute in the markup; the file it names is relative to dist.
          let imagePath: string;
          try {
            imagePath = new URL(image).pathname;
          } catch {
            imagePath = image;
          }
          if (!imagePath.startsWith('/og/') || !imagePath.endsWith('.png')) continue;

          const pagePath = `/${relative(distPath, dirname(path)).split(sep).join('/')}/`;
          const fromDefaultLocale = !isPrefixed(pagePath, localeSegments);
          const existing = cards.get(imagePath);
          // First writer wins, except that the English page always outranks a
          // translation — the card is shared, so its text must be one language.
          if (existing !== undefined && (existing.fromDefaultLocale || !fromDefaultLocale))
            continue;

          cards.set(imagePath, {
            title: decodeEntities(OG_TITLE.exec(html)?.[1] ?? '').replace(
              new RegExp(`\\s*\\|\\s*${options.siteName}$`),
              '',
            ),
            description: decodeEntities(OG_DESCRIPTION.exec(html)?.[1] ?? ''),
            eyebrow: eyebrowFor(imagePath),
            fromDefaultLocale,
          });
        }

        // The fallback card, referenced by SITE.defaultOgImage rather than by a page.
        if (!cards.has('/og/default.png')) {
          cards.set('/og/default.png', {
            title: options.siteName,
            description: 'Time zone tools that tell you the truth.',
            eyebrow: 'YourWorldTime',
            fromDefaultLocale: true,
          });
        }

        const fonts = await Promise.all(
          ([400, 600, 700] as const).map(async (weight) => ({
            name: 'IBM Plex Sans Condensed',
            data: await readFile(fontPath(weight)),
            weight,
            style: 'normal' as const,
          })),
        );

        let written = 0;
        for (const [imagePath, card] of cards) {
          const svg = await satori(cardTree(card, options.siteName, options.origin) as never, {
            width: WIDTH,
            height: HEIGHT,
            fonts,
          });
          const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

          const target = join(distPath, imagePath);
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, png);
          written += 1;
        }

        const seconds = ((Date.now() - started) / 1000).toFixed(1);
        logger.info(`${written} Open Graph image(s) rendered in ${seconds}s`);
      },
    },
  };
}
