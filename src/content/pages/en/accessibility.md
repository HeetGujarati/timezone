---
title: Accessibility
description: What this site targets, what is tested automatically, and what to do if something does not work for you.
order: 6
updatedAt: '2026-01-15'
---

This site targets **WCAG 2.2 level AA**. The parts of that which can be tested automatically are tested on every build, and the build fails if they regress.

## What is enforced by the build

- **Colour contrast.** Every text pairing is checked against the 4.5:1 ratio and every focus indicator against 3:1, in both light and dark themes. The palette is read from the stylesheet rather than duplicated in the test, so changing a colour runs the check.
- **Markup semantics.** The linter runs accessibility rules over every component — missing labels, invalid ARIA and non-interactive elements with handlers all fail the build.
- **No horizontal overflow**, including in the right-to-left Arabic layout, checked in a real browser.

## Design decisions

- **Colour is never the only signal.** Working hours in the meeting planner carry a border as well as a fill; daylight saving warnings are words, not just an amber tint.
- **Results announce themselves.** Every result region is `aria-live="polite"`, so a conversion is read out when it changes rather than requiring a hunt.
- **Every input has a real label.** No placeholder-as-label anywhere.
- **Motion respects your preference.** With `prefers-reduced-motion` set, animation and smooth scrolling are switched off.
- **It works without JavaScript.** Every offset, transition date, reference table and explanation is in the prerendered page. Only live clocks and the interactive tools need scripting, and controls that would not work without it are hidden rather than shown as dead.
- **Times are monospaced with tabular figures**, so columns align and a ticking digit never shifts the text beside it.

## Known limitations

- The 24-hour band in the meeting planner is a wide table. It scrolls horizontally inside its own container rather than being reflowed, because a reflowed band stops being readable as a shape. The same information is available as text in the summary above it.
- Automated testing catches a minority of accessibility problems. If something here does not work for you, that is a bug and we would like to know.

## Telling us

Email the address on the [contact page](/contact/) with the page and what went wrong. Reports about assistive technology are especially useful, because they are the hardest thing to test for without the technology in front of you.
