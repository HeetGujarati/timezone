#!/usr/bin/env node
/**
 * A static server for `dist/`, used by Playwright and Lighthouse.
 *
 * `astro preview` would do, except that it keeps a background daemon: a second
 * invocation finds the first still listening, prints a notice and exits, which
 * Playwright reports as "process from config.webServer exited early". This
 * server has no daemon and no state.
 *
 * It also matches a static host more closely than a dev server does, which is
 * the point of testing against the built output at all:
 *
 * - a missing path serves `404.html` with a real 404 status, so the 404 test
 *   asserts what a reader would actually get;
 * - `/x/` resolves to `/x/index.html`, matching `trailingSlash: 'always'`;
 * - hashed assets under `/_assets/` are served immutable, everything else
 *   revalidates, mirroring `public/_headers`.
 *
 * Usage: node scripts/serve-dist.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const DIST = resolve(new URL('../dist/', import.meta.url).pathname);
const PORT = Number(process.argv[2] ?? process.env['PORT'] ?? 4321);

const TYPES = new Map(
  Object.entries({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }),
);

/** Resolve a URL path to a file inside dist, or null if there is none. */
async function resolveFile(pathname) {
  // normalize collapses '..' before the prefix check, so nothing outside dist is reachable.
  const candidate = resolve(join(DIST, normalize(decodeURIComponent(pathname))));
  if (!candidate.startsWith(DIST)) return null;

  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const index = join(candidate, 'index.html');
      await stat(index);
      return index;
    }
  } catch {
    // Fall through: a path with no trailing slash may still name a directory.
    try {
      const index = join(candidate, 'index.html');
      await stat(index);
      return index;
    } catch {
      return null;
    }
  }
  return null;
}

const server = createServer((request, response) => {
  void (async () => {
    const { pathname } = new URL(request.url ?? '/', `http://localhost:${PORT}`);
    const file = await resolveFile(pathname);

    if (file === null) {
      const notFound = join(DIST, '404.html');
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      createReadStream(notFound).pipe(response);
      return;
    }

    response.writeHead(200, {
      'Content-Type': TYPES.get(extname(file)) ?? 'application/octet-stream',
      'Cache-Control': pathname.startsWith('/_assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
    });
    createReadStream(file).pipe(response);
  })();
});

server.listen(PORT, () => {
  console.log(`Serving dist/ on http://localhost:${PORT}`);
});
