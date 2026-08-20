/**
 * Structural HTML and accessibility checks across the built site.
 *
 * Not a full HTML validator — Astro's compiler already refuses malformed
 * markup, and a full parse of 4,570 pages would cost more than it catches. What
 * it checks is the class of fault that compiles cleanly and still fails WCAG or
 * a screen reader:
 *
 * - a duplicate `id` on one page, which silently breaks every `aria-labelledby`,
 *   `aria-controls` and skip link pointing at it;
 * - an `aria-*` reference whose target is not on the page;
 * - an `<img>` with no `alt` attribute at all (`alt=""` is correct for
 *   decoration and is accepted);
 * - a `<html>` element with no `lang`, or with `dir` missing on a right-to-left
 *   locale;
 * - a heading level skipped from h1 straight to h3, which turns the outline into
 *   a lie for anyone navigating by headings;
 * - a `<button>` or `<a>` with no accessible name.
 *
 * Every one of these has shipped on a real site behind a green type check.
 */
import { fail, pass, readPages } from './lib/dist.mjs';

const RTL_PREFIXES = ['/ar/'];

const problems = {
  duplicateId: [],
  danglingAriaReference: [],
  imageWithoutAlt: [],
  missingLang: [],
  missingDir: [],
  skippedHeadingLevel: [],
  namelessControl: [],
  unrenderedEscape: [],
};

/**
 * A JavaScript escape sequence that reached the page as text.
 *
 * `<span>\u25c6</span>` in an .astro template is not a diamond — Astro renders
 * the six characters literally, and it shipped that way on 1,120 world-clock
 * cards. Nothing else catches it: the markup is valid, the control still has an
 * accessible name, and the string is too short for the untranslated-copy audit.
 *
 * Script and style bodies are exempt because an escape is legitimate there, as
 * are <code> and <pre>, where a guide may be quoting one on purpose.
 */
const ESCAPE_IN_TEXT = /\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g;
const EXEMPT_ELEMENTS = /<(script|style|code|pre)\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Attribute values on one element, as a map. Good enough for generated markup. */
function attributes(tag) {
  const found = new Map();
  for (const [, name, value] of tag.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) {
    found.set(name.toLowerCase(), value);
  }
  return found;
}

/** True when an element carries text or an explicit label a screen reader can use. */
function hasAccessibleName(attrs, inner) {
  if ((attrs.get('aria-label') ?? '').trim() !== '') return true;
  if ((attrs.get('aria-labelledby') ?? '').trim() !== '') return true;
  if ((attrs.get('title') ?? '').trim() !== '') return true;
  // An <img alt="…"> or <svg><title> inside the control names it too.
  if (/<img[^>]+alt="[^"]+"/.test(inner)) return true;
  if (/<(title|desc)>[^<]+</.test(inner)) return true;
  return inner.replace(/<[^>]*>/g, '').trim() !== '';
}

/** Counts, so the summary reports what was actually examined rather than a vacuous pass. */
const counted = { ids: 0, ariaReferences: 0, images: 0, controls: 0, headings: 0 };

const pages = await readPages();

for (const page of pages) {
  const { html, url } = page;

  // --- escape sequences that should have been characters ---------------------
  for (const [escape] of html.replace(EXEMPT_ELEMENTS, '').matchAll(ESCAPE_IN_TEXT)) {
    problems.unrenderedEscape.push(`${url} renders "${escape}" as text`);
  }

  // --- ids -----------------------------------------------------------------
  const ids = new Set();
  const duplicated = new Set();
  for (const [, id] of html.matchAll(/\sid="([^"]+)"/g)) {
    if (ids.has(id)) duplicated.add(id);
    ids.add(id);
    counted.ids += 1;
  }
  for (const id of duplicated) problems.duplicateId.push(`${url} #${id}`);

  // --- aria references -----------------------------------------------------
  for (const [, attribute, value] of html.matchAll(
    /\s(aria-labelledby|aria-describedby|aria-controls|aria-owns)="([^"]+)"/g,
  )) {
    counted.ariaReferences += 1;
    for (const target of value.trim().split(/\s+/)) {
      if (!ids.has(target)) {
        problems.danglingAriaReference.push(`${url} ${attribute}="${target}" has no such id`);
      }
    }
  }

  // --- images --------------------------------------------------------------
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    counted.images += 1;
    if (!/\salt="/.test(tag)) problems.imageWithoutAlt.push(`${url} ${tag.slice(0, 90)}`);
  }

  // --- document language ---------------------------------------------------
  const htmlTag = /<html\b[^>]*>/.exec(html)?.[0] ?? '';
  const htmlAttrs = attributes(htmlTag);
  if ((htmlAttrs.get('lang') ?? '') === '') problems.missingLang.push(url);
  if (RTL_PREFIXES.some((prefix) => url.startsWith(prefix)) && htmlAttrs.get('dir') !== 'rtl') {
    problems.missingDir.push(`${url} is right-to-left but <html dir> is not "rtl"`);
  }

  // --- heading outline -----------------------------------------------------
  let previousLevel = 0;
  for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
    counted.headings += 1;
    const current = Number(level);
    if (previousLevel !== 0 && current > previousLevel + 1) {
      problems.skippedHeadingLevel.push(`${url} h${previousLevel} → h${current}`);
      break;
    }
    previousLevel = current;
  }

  // --- named controls ------------------------------------------------------
  for (const match of html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const [, element, rawAttributes = '', inner = ''] = match;
    const attrs = attributes(`<${element}${rawAttributes}>`);
    // An anchor with no href is not a control; it is a named target.
    if (element === 'a' && !attrs.has('href')) continue;
    if (attrs.get('aria-hidden') === 'true') continue;
    counted.controls += 1;
    if (!hasAccessibleName(attrs, inner)) {
      problems.namelessControl.push(`${url} <${element}${rawAttributes.slice(0, 70)}>`);
    }
  }
}

const failures = Object.entries(problems).filter(([, list]) => list.length > 0);

if (failures.length > 0) {
  fail(
    'HTML audit failed:',
    failures.flatMap(([name, list]) => [
      `${name}: ${list.length}`,
      ...list.slice(0, 5).map((detail) => `  ${detail}`),
      ...(list.length > 5 ? [`  ... and ${list.length - 5} more`] : []),
    ]),
  );
}

pass(
  `HTML audit: ${pages.length} pages — ${counted.ids} ids all unique per page, ${counted.ariaReferences} aria references all resolving, ${counted.images} images all with alt, ${counted.controls} controls all named, ${counted.headings} headings with no skipped level, no unrendered escape sequences, every page declaring its language`,
);
