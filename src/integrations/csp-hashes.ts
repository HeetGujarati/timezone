import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import type { AstroIntegration } from 'astro';

/**
 * Content Security Policy without 'unsafe-inline'.
 *
 * The site emits exactly one inline script — the theme setter, which must run
 * before first paint or a reader who chose dark mode gets a white flash on every
 * navigation. Rather than weaken the policy to permit it, this integration reads
 * every inline script out of the built HTML after the build, computes its SHA-256,
 * and writes those hashes into the CSP in dist/_headers.
 *
 * Two consequences worth knowing:
 *
 * - If the theme script changes by a single byte, the hash changes with it. That
 *   is the point: an attacker who could inject a script cannot make it match.
 * - JSON-LD blocks are `<script type="application/ld+json">`, which the HTML
 *   specification classes as data blocks rather than scripts. They are never
 *   executed and never CSP-checked, so they are deliberately not hashed — hashing
 *   4,570 unique JSON-LD blocks into one header would be absurd and unnecessary.
 */

/** Matches an inline <script> with no src, capturing its body. */
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g;

/** A data block, not a script. Never executed, never CSP-checked. */
function isDataBlock(attributes: string): boolean {
  const type = /type=["']([^"']+)["']/.exec(attributes)?.[1];
  if (type === undefined) return false;
  return !/^(text\/javascript|application\/javascript|module)$/i.test(type);
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

export function cspHashes(): AstroIntegration {
  return {
    name: 'meridiem:csp-hashes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distPath = dir.pathname;
        const hashes = new Set<string>();
        const seenBodies = new Set<string>();

        for await (const path of walk(distPath)) {
          if (!path.endsWith('.html')) continue;
          const html = await readFile(path, 'utf8');

          for (const match of html.matchAll(INLINE_SCRIPT)) {
            const attributes = match[1] ?? '';
            const body = match[2] ?? '';
            if (isDataBlock(attributes)) continue;
            if (body.trim() === '') continue;
            if (seenBodies.has(body)) continue;

            seenBodies.add(body);
            hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
          }
        }

        const headersPath = join(distPath, '_headers');
        let headers: string;
        try {
          headers = await readFile(headersPath, 'utf8');
        } catch {
          logger.error('public/_headers is missing — the CSP cannot be written.');
          throw new Error('public/_headers not found in build output');
        }

        const scriptSrc = ["'self'", ...[...hashes].sort()].join(' ');
        const updated = headers.replace('script-src __CSP_SCRIPT_SRC__', `script-src ${scriptSrc}`);

        if (updated === headers) {
          throw new Error(
            'public/_headers does not contain the __CSP_SCRIPT_SRC__ placeholder — the CSP would ship unhashed.',
          );
        }

        await writeFile(headersPath, updated, 'utf8');

        // The same policy, in the two other formats a host might want. Generated
        // rather than hand-maintained, so all three can never disagree about the
        // hash — which would be a silently broken theme script on one host only.
        const policy = /Content-Security-Policy: ([^\n]+)/.exec(updated)?.[1]?.trim();
        if (policy === undefined) throw new Error('Could not read the CSP back out of _headers');

        const otherHeaders = [...updated.matchAll(/^ {2}([A-Z][A-Za-z-]+): (.+)$/gm)]
          .map(([, name, value]) => ({ name: name ?? '', value: (value ?? '').trim() }))
          .filter(
            (header) =>
              header.name !== 'Content-Security-Policy' && !header.name.startsWith('Cache'),
          );

        const allHeaders = [{ name: 'Content-Security-Policy', value: policy }, ...otherHeaders];

        await writeFile(
          join(distPath, 'netlify.toml'),
          [
            '# Generated at build time by src/integrations/csp-hashes.ts. Do not edit by hand:',
            '# the CSP carries a SHA-256 of the inline theme script and changes when it does.',
            '',
            '[[headers]]',
            '  for = "/*"',
            '  [headers.values]',
            ...allHeaders.map((header) => `    ${header.name} = "${header.value}"`),
            '',
            '[[headers]]',
            '  for = "/_assets/*"',
            '  [headers.values]',
            '    Cache-Control = "public, max-age=31536000, immutable"',
            '',
          ].join('\n'),
          'utf8',
        );

        await writeFile(
          join(distPath, 'vercel.json'),
          `${JSON.stringify(
            {
              $schema: 'https://openapi.vercel.sh/vercel.json',
              headers: [
                {
                  source: '/(.*)',
                  headers: allHeaders.map((h) => ({ key: h.name, value: h.value })),
                },
                {
                  source: '/_assets/(.*)',
                  headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
                },
              ],
            },
            null,
            2,
          )}\n`,
          'utf8',
        );

        logger.info(
          `CSP: ${hashes.size} inline script hash${hashes.size === 1 ? '' : 'es'} written to ${relative(distPath, headersPath)}, netlify.toml and vercel.json (no unsafe-inline)`,
        );
      },
    },
  };
}
