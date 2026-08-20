#!/usr/bin/env node
/**
 * Rasterises `public/favicon.svg` into the formats browsers still ask for.
 *
 * The mark is a meridian: the line where one day becomes the next, drawn through
 * a circle whose halves are the ante and the post of *ante meridiem*. It is two
 * shapes and one colour because it has to survive being drawn 16 pixels wide.
 *
 * The SVG is the source. Everything else here is generated from it, so the icon
 * can be changed in one file:
 *
 * - `favicon.ico` — browsers request `/favicon.ico` whether or not the page
 *   declares an icon, and a missing one is a 404 in every reader's console. It
 *   holds 16, 32 and 48 pixel images as PNG payloads, which every browser since
 *   Windows Vista reads.
 * - `apple-touch-icon.png` — 180 square, opaque, for an iOS home screen.
 * - `icon-192.png` and `icon-512.png` — the manifest's icons.
 *
 * Usage: node scripts/make-icons.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const PUBLIC = new URL('../public/', import.meta.url);

const source = await readFile(new URL('favicon.svg', PUBLIC), 'utf8');

/** Render the mark at a given pixel size. */
function render(size) {
  return new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

/**
 * Pack PNGs into an ICO container.
 *
 * The format is a six-byte header, a sixteen-byte directory entry per image, and
 * then the image payloads. A dimension of 256 is stored as 0, which is why the
 * byte is masked rather than written straight.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach(({ size, png }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size & 0xff, entry); // width, 0 meaning 256
    directory.writeUInt8(size & 0xff, entry + 1); // height
    directory.writeUInt8(0, entry + 2); // palette size: none, it is truecolour
    directory.writeUInt8(0, entry + 3); // reserved
    directory.writeUInt16LE(1, entry + 4); // colour planes
    directory.writeUInt16LE(32, entry + 6); // bits per pixel
    directory.writeUInt32LE(png.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.png)]);
}

const icoSizes = [16, 32, 48];
const iconFile = ico(icoSizes.map((size) => ({ size, png: render(size) })));
await writeFile(new URL('favicon.ico', PUBLIC), iconFile);

const pngs = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
for (const [name, size] of pngs) {
  await writeFile(new URL(name, PUBLIC), render(size));
}

console.log(
  `icons: favicon.ico (${icoSizes.join(', ')}px, ${iconFile.length} bytes) and ` +
    pngs.map(([name, size]) => `${name} (${size}px)`).join(', '),
);
