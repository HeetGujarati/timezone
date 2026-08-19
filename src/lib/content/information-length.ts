/**
 * A length measure that means the same thing in every script.
 *
 * The content schema sets minimum lengths to reject a description too thin to
 * be useful. Counting raw characters makes that floor mean different things in
 * different languages: "如何报告错误、提出问题，或反映安全问题。" is a complete,
 * well-formed meta description in twenty characters, while twenty characters of
 * English is barely three words. A uniform floor of forty would have forced
 * padding into the Chinese, Japanese and Korean copy — making it worse in order
 * to satisfy a rule written for Latin script.
 *
 * So a CJK character counts for more than one. The weight is a deliberate
 * approximation: a Han ideograph or a Hangul syllable carries roughly the
 * information of a short Latin word rather than a Latin letter.
 *
 * Maximum lengths are NOT measured this way. Those exist because search results
 * truncate by rendered width, and a CJK glyph is wider than a Latin one — so
 * the raw character count is already the conservative measure there.
 */

/** Hiragana, katakana, Han (incl. extension A and compatibility), and Hangul syllables. */
const CJK =
  /[぀-ゟ゠-ヿ㐀-䶿一-鿿豈-﫿가-힯]/gu;

/**
 * Chosen so that a natural CJK sentence clears the same floor a natural English
 * one does, without letting a two-word fragment through.
 */
export const CJK_WEIGHT = 2.5;

export function informationLength(text: string): number {
  const cjk = (text.match(CJK) ?? []).length;
  return text.length - cjk + cjk * CJK_WEIGHT;
}

/** Builds the zod refinement message so every field reports its own floor. */
export function atLeast(minimum: number) {
  return {
    check: (value: string) => informationLength(value) >= minimum,
    message: `Too short: needs the information of ${minimum} Latin characters (CJK counts ${CJK_WEIGHT}x)`,
  };
}
