/**
 * Pagination sizes.
 *
 * Lives in its own module because Astro hoists `getStaticPaths` into a separate
 * chunk, where frontmatter constants are out of scope — an imported value is
 * visible to both the hoisted function and the component body.
 */
export const PAIRS_PER_PAGE = 100;
