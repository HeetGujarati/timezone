# Design

YourWorldTime is used by someone who is already slightly stressed: they have a call to
schedule, three colleagues in three continents, and a nagging worry that they are about
to get it wrong by an hour. The interface has one job — be _believable_. It should read
like a precise instrument, not a landing page.

Three consequences run through every decision below.

1. **Numbers are the product.** Times get a monospaced face and tabular figures so
   columns align and a ticking digit never shifts the layout beside it.
2. **One signature element, everything else quiet.** The 24-hour band in the meeting
   planner is the thing worth looking at. Nothing else competes with it.
3. **Nothing decorative.** No hero gradient, no illustration, no motion for its own sake.
   Every pixel either carries information or gets out of the way.

---

## Colour

Six named values. Each is declared once per theme in `src/styles/tokens.css`; components
read semantic roles (`--color-text`, `--color-accent`) and never a raw hex.

| Token        | Light     | Dark      | Role                                             |
| ------------ | --------- | --------- | ------------------------------------------------ |
| `--ink`      | `#111721` | `#0c1017` | Body text on light; the page ground on dark      |
| `--paper`    | `#f5f6f8` | `#e9ecf1` | The page ground on light; body text on dark      |
| `--graphite` | `#5c6674` | `#98a3b3` | Secondary text, labels, table headers            |
| `--accent`   | `#2743c8` | `#8fa5ff` | Links, focus rings, the working-hours band       |
| `--signal`   | `#9a4a08` | `#f0a868` | Daylight-saving warnings and "this changes soon" |
| `--rule`     | `#dde1e7` | `#232a35` | Hairlines and table borders                      |

**Why these.** The brief warned against the two palettes generative tools reach for by
default: cream-and-terracotta, and near-black-with-acid-green. Both were avoided
deliberately.

`--ink` is a blue-black rather than a true black, because a true black next to a saturated
accent vibrates. `--paper` is cooled rather than warmed — a warm off-white reads as
"editorial", and this is an instrument. `--accent` is a deep indigo: it survives on both
grounds, it is not the default framework blue, and it does not read as a warning. That
last point matters, because `--signal` — a burnt amber — is reserved exclusively for
daylight-saving transitions. When something on this site is amber, the clocks are about
to move. Nothing else is allowed to borrow that meaning.

**Every pairing is measured, not eyeballed.** `src/styles/contrast.test.ts` reads the
palette out of `tokens.css` and fails the build if any text pairing drops below WCAG 2.2
AA's 4.5:1, or any focus ring below the 3:1 required for non-text. Current margins:

| Pairing            | Light  | Dark   |
| ------------------ | ------ | ------ |
| Body text on page  | 16.6:1 | 16.1:1 |
| Muted text on page | 5.4:1  | 7.5:1  |
| Link on page       | 7.1:1  | 8.2:1  |
| Signal on page     | 5.8:1  | 9.5:1  |

The test earned its place immediately: the first band palette separated "working hours"
from "asleep" by 1.06:1, which is invisible. It now separates by at least 1.35:1 in both
themes, _and_ the component marks working hours with a border — so the distinction never
rests on colour alone (WCAG 1.4.1).

---

## Type

Three faces, all self-hosted through `@fontsource`. No Google Fonts request, no
third-party origin, which is what lets `connect-src` and `font-src` stay at `'self'`.

| Role    | Face                        | Why                                                                                                                                             |
| ------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Display | IBM Plex Sans Condensed 600 | Headings. Condensed buys horizontal room for a long headline like "Convert New York time to Kathmandu time" without dropping to a smaller size. |
| Body    | IBM Plex Sans Variable      | Prose and UI.                                                                                                                                   |
| Numbers | IBM Plex Mono 400/600       | Every time, offset and countdown.                                                                                                               |

**Why the Plex family.** It was designed as an engineering typeface — it reads as
instrumentation rather than marketing, which is exactly the register this site wants. It
is also the only open family that covers all fourteen launch locales coherently: Plex ships
Latin, Latin Extended, Cyrillic and Greek in the core faces, plus matching Arabic and
Devanagari cuts for `ar` and `hi`. A site that switches to a completely different typeface
in Arabic looks like a translation bolted on afterwards.

**One caveat, stated because it is visible.** The condensed cut has no Cyrillic block, so
Russian headings are set in the variable family instead — the same typeface, uncondensed.
The alternative was a system font in the middle of the brand, which is worse.

**How the faces are scoped.** A browser fetches a face the moment its family is reached
while searching for a glyph, even when it finds nothing usable there. So the default stacks
name only the faces that draw Latin, and `:lang(ar)`, `:lang(hi)` and `:lang(ru)` in
`src/styles/tokens.css` add the script family on the pages that need it. Measured per
locale: 122KB of fonts on `/de/`, 111KB on `/ru/`, 209KB on `/ar/`, 275KB on `/hi/` — and no
page loading a face it cannot draw with. `DECISIONS.md` D34 records how that went wrong
first.

Japanese, Korean and Simplified Chinese use the system stack rather than a self-hosted CJK
face. A full CJK webfont is 4–8 MB; even subset it dwarfs the entire rest of the page, and
every one of those platforms ships an excellent default. Bandwidth budget beats typographic
uniformity here, and it is not close.

**Scale.** A 1.2 minor third from a 16px base: `0.6875 · 0.75 · 0.875 · 1 · 1.125 · 1.375 ·
1.75 · 2.125 · 2.75rem`. Tight enough that a 24-row reference table stays dense and
scannable, wide enough that an `h1` still lands. Line heights: 1.15 for headings, 1.35 for
dense UI, 1.6 for prose. Measure capped at 68 characters.

---

## The mark

A meridian: a circle divided down the middle, one half filled and one half hollow, for the
_ante_ and the _post_ of _ante YourWorldTime_. Two shapes and one colour, because it has to
survive being drawn sixteen pixels wide in a browser tab, and because a site whose subject
is precision should not have a logo that needs explaining.

`public/favicon.svg` is the source. `npm run icons` rasterises it into `favicon.ico` (16, 32
and 48), `apple-touch-icon.png` (180) and the two sizes the web manifest names, so the mark
exists once and every derivative follows from it.

The `favicon.ico` is not optional decoration: a browser requests `/favicon.ico` whether or
not the page declares an icon, and without the file every visit logs a 404.

---

## Spacing and geometry

A 4px base scale (`0.25 · 0.5 · 0.75 · 1 · 1.25 · 1.5 · 2 · 2.5 · 3 · 4rem`). Radii stay
small — 3px, 6px, 10px — because heavily rounded corners read as friendly, and this
interface is aiming for _trustworthy_. Hairlines are 1px `--rule`, never a shadow: shadows
imply depth and physicality that a data table does not have.

All spacing uses logical properties (`margin-inline`, `padding-block`, `inset-inline-start`),
so the Arabic layout mirrors correctly without a single RTL override.

---

## The signature element: the 24-hour band

The meeting planner renders each participant's day as a horizontal 24-cell band. Read down
the columns and the overlap is a shape you see rather than a number you compute.

Three states, distinguished by fill _and_ by border so the encoding is never colour-only:

- **Working hours** — `--color-band-working`, with a top border in `--accent`
- **Fringe hours** — `--color-band-fringe`, the hour either side of the working day
- **Asleep** — `--color-band-asleep`, no border

The current hour carries a 2px `--signal` marker. That is the only place motion or
saturation appears anywhere on the site.

---

## Dark mode

Driven by `prefers-color-scheme`, overridable by a toggle, persisted in `localStorage`.

The flash of wrong theme is prevented by one small inline script in `<head>` that reads the
stored preference and stamps `data-theme` on `<html>` before first paint. It is the only
inline script on the site, and it is hashed into the CSP at build time rather than waved
through with `'unsafe-inline'` — see `SECURITY.md`.

The toggle button ships in the HTML with the `hidden` attribute and is revealed by its
island. A reader with JavaScript disabled never sees a control that cannot work, but still
gets dark mode from their system preference. (`[hidden] { display: none !important }` is in
the base layer, because a utility class that sets `display` otherwise beats the UA rule and
the button would flash into view.)

---

## Accessibility

Targeting WCAG 2.2 AA, with the parts that can be tested, tested.

- Visible focus ring on everything focusable: 2px `--accent`, 2px offset, ≥3:1 in both themes.
- A skip link as the first focusable element on the page.
- `aria-live="polite"` on every result region, so a conversion announces itself.
- Every input has a real `<label>`; no placeholder-as-label anywhere.
- `prefers-reduced-motion` collapses all animation and smooth scrolling.
- Colour is never the sole carrier of meaning — the band uses borders, DST warnings use words.
- Everything prerendered works with JavaScript disabled. Only live "current time" readouts
  need it, and they are labelled as such rather than rendering an empty box.

---

## Mobile

The primary input must be usable above the fold on a 360px-wide phone without scrolling.
That constraint drove the header down to 56px, moved the tool navigation into a horizontally
scrolling strip below it, and stacks the converter's from/to fields rather than placing them
side by side. The 24-hour band scrolls horizontally inside its own container — the page body
never scrolls sideways, in any locale, including RTL.
