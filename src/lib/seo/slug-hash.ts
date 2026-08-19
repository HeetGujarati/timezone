/**
 * Deterministic variant selection.
 *
 * Programmatic pages that share one sentence template get filtered as thin
 * duplicates, so every generated slot has at least four phrasings and this picks
 * between them. The choice is a pure function of the slug and the slot name, which
 * means it is stable across builds — the same page reads the same way tomorrow, and
 * a rebuild never rewrites 1,448 pages for no reason.
 *
 * FNV-1a: eight lines, no dependency, and more than enough distribution for
 * choosing between four options.
 */

const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

/**
 * MurmurHash3's finalizer.
 *
 * FNV-1a alone has weak avalanche in its low bits, and `hash % 4` reads only those
 * two bits — which made every similar slug pick the same variant and produced 1,448
 * pages sharing one sentence. This mixes the high bits down before the modulo.
 */
function avalanche(input: number): number {
  let hash = input;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

export function hashString(value: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return avalanche(hash >>> 0);
}

/**
 * Pick one option deterministically. `slot` salts the hash, so two slots on the
 * same page do not both land on index 0 and produce a page that reads like a form
 * letter.
 */
export function pickVariant<T>(options: readonly T[], slug: string, slot: string): T {
  if (options.length === 0) throw new Error(`No variants supplied for slot "${slot}"`);
  const index = hashString(`${slug}::${slot}`) % options.length;
  const chosen = options[index];
  if (chosen === undefined) throw new Error(`Variant selection failed for slot "${slot}"`);
  return chosen;
}

/** Pick `count` distinct options, deterministically, for lists like related links. */
export function pickDistinct<T>(
  options: readonly T[],
  slug: string,
  slot: string,
  count: number,
): T[] {
  const pool = [...options];
  const picked: T[] = [];
  let salt = 0;

  while (picked.length < Math.min(count, options.length) && pool.length > 0) {
    const index = hashString(`${slug}::${slot}::${salt}`) % pool.length;
    const [chosen] = pool.splice(index, 1);
    if (chosen !== undefined) picked.push(chosen);
    salt += 1;
  }

  return picked;
}
