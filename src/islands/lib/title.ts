/**
 * Countdown title sanitisation, kept pure so the security behaviour is testable.
 *
 * This is the only reader-supplied string on the site that reaches a page, and it
 * arrives through a URL someone else may have written. Control characters are
 * stripped and the length is capped here; the call site writes it with
 * `textContent`, never as HTML. Two independent reasons a crafted link cannot
 * inject anything into the page it produces.
 */
const MAX_TITLE_LENGTH = 80;

// Stripping control characters is the entire purpose of this expression. The rule
// exists to catch them appearing by accident, which is the opposite of what is
// happening here.
/* eslint-disable-next-line no-control-regex */
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029]/g;

export function sanitiseTitle(raw: string | null): string {
  if (raw === null) return '';
  return raw.replace(CONTROL_CHARACTERS, '').trim().slice(0, MAX_TITLE_LENGTH);
}
