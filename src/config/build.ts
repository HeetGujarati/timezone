/**
 * The instant this build ran.
 *
 * Prerendered pages must never present a stale "current time", so this value is
 * used only for two things: seeding form inputs that JavaScript immediately
 * overwrites with the real now, and rendering example timestamps that are
 * explicitly labelled as examples. Absolute current times are rendered client-side.
 *
 * Pin BUILD_INSTANT in the environment for a byte-reproducible build.
 */
const fromEnv = Number(process.env['BUILD_INSTANT']);
export const BUILD_INSTANT = Number.isSafeInteger(fromEnv) && fromEnv > 0 ? fromEnv : Date.now();

/** Midnight UTC on the build date — a stable seed for date inputs. */
export const BUILD_DATE_UTC = new Date(BUILD_INSTANT).toISOString().slice(0, 10);

/** The two years every page reports daylight-saving transitions for. */
export const CURRENT_YEAR = new Date(BUILD_INSTANT).getUTCFullYear();
export const NEXT_YEAR = CURRENT_YEAR + 1;
