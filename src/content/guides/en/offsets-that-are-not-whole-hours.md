---
title: The UTC offsets that are not whole hours
description: India, Nepal, Newfoundland and the Chatham Islands run on half and quarter hours. Here is the full list, and what breaks in software because of it.
summary: Around a fifth of the world lives on an offset that is not a whole number of hours from UTC. Software that assumes otherwise is not slightly wrong for those people — it is 30 or 45 minutes wrong, which is worse.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords:
  ['half hour time zones', 'utc offset 45 minutes', 'india time zone offset', 'nepal time zone']
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

The mental model of twenty-four hourly zones is wrong in an expensive way: it produces code that is confidently 30 or 45 minutes out for well over a billion people. A whole-hour error at least looks like an error. A 45-minute one looks like a typo, and gets shipped.

## The complete list

**Offsets at :30**

| Offset    | Where                                                   |
| --------- | ------------------------------------------------------- |
| UTC-09:30 | Marquesas Islands                                       |
| UTC-03:30 | Newfoundland and Labrador                               |
| UTC+03:30 | Iran                                                    |
| UTC+04:30 | Afghanistan                                             |
| UTC+05:30 | India, Sri Lanka                                        |
| UTC+06:30 | Myanmar, Cocos Islands                                  |
| UTC+09:30 | Central Australia — Northern Territory, South Australia |
| UTC+10:30 | Lord Howe Island (standard time)                        |

**Offsets at :45**

| Offset    | Where                                                |
| --------- | ---------------------------------------------------- |
| UTC+05:45 | Nepal                                                |
| UTC+08:45 | Southeastern Western Australia (Eucla, unofficially) |
| UTC+12:45 | Chatham Islands (standard time)                      |

India alone is 1.4 billion people. Add Iran, Afghanistan, Myanmar, Sri Lanka and Nepal and you are past a fifth of the planet, before counting Australia or Canada.

## The other kind of unusual offset

Not-whole-hour offsets are the well-known oddity. Two others matter as much.

**The range is 26 hours, not 24.** Kiritimati in Kiribati is UTC+14; Baker Island and Howland Island are UTC-12. That is a 26-hour span, which means there are moments when three different calendar dates are in use simultaneously somewhere on earth. Any code that assumes a two-day window covers all zones is wrong twice a day.

**Daylight saving is not always an hour.** Lord Howe Island, a small Australian island with a permanent population of around 380, shifts by 30 minutes: UTC+10:30 in winter, UTC+11:00 in summer. It is the only place on earth that does this, and it is the single best test case for a date library — any implementation that hardcodes a 60-minute shift is wrong there and nowhere else, which means it will pass every other test you write.

## What breaks

**Rounding to the nearest hour.** The most common failure. Code that computes an offset in hours as an integer silently truncates India to +5, which is 30 minutes wrong for every user in the country.

**Storing offsets as integers.** A schema column declared as an hour count cannot represent Kathmandu. This is usually discovered after the data is in it.

**Grid interfaces built on hour columns.** Any calendar or planner that lays out a day as 24 equal cells and assumes each zone's local hour aligns to a cell boundary will misplace half-hour and 45-minute zones. The band on this site's meeting planner uses instants as columns rather than local hours, so a +05:45 row shows 09:45 in the column where a UTC row shows 04:00 — which is the truth, rather than a tidier lie.

**Duration arithmetic across a 30-minute daylight change.** Assuming a daylight saving transition is exactly 3,600,000 milliseconds gives the wrong answer on Lord Howe Island, and only there.

## Getting it right

The fix is the same one that fixes almost every time zone bug: **never compute an offset yourself**. Ask the platform.

Every modern runtime ships the IANA database and will tell you the offset for a given zone at a given instant, in minutes, correctly, including for Kathmandu and Lord Howe. In JavaScript that is `Intl.DateTimeFormat` with `timeZoneName: 'longOffset'`, or a comparison of the zone's wall-clock reading against UTC — which is the approach this site's engine uses, because it stays exact even for the sub-minute local-mean-time offsets in pre-1900 data.

Then hold to three rules:

1. **Offsets are minutes**, never hours. If a variable is called `offsetHours`, it is already a bug.
2. **Test against Kathmandu and Lord Howe.** They break the two assumptions everything else lets you keep.
3. **Never round a time zone.** If a display has to be approximate, say so; do not silently move a user's clock by 30 minutes to make a layout easier.

## A worked example: what 45 minutes does to a grid

Take a meeting planner that lays the day out as 24 columns, one per hour, and shades each participant's working hours. The naive implementation computes each row by shifting the base row by the zone's offset in hours.

For London against New York that works: the New York row is the London row moved five cells to the right. For London against Kathmandu it does not. Kathmandu is 5 hours 45 minutes ahead, which is 5.75 cells, and there is no such thing as three-quarters of a cell. The implementation rounds — usually to 6 — and now every reading in that row is 15 minutes early.

The error is small enough to survive review and large enough to matter: a 09:00 meeting that the grid says is 09:00 for Kathmandu is really 08:45 there, and the person joining is fifteen minutes late to their own day.

The fix is to stop treating columns as hours. Make each column an _instant_, and ask the platform what the local wall clock reads in each zone at that instant. A +05:45 row then shows 09:45 where a UTC row shows 04:00 — visibly not aligned to the grid, which is the honest rendering. This site's meeting planner does exactly that, and the ragged edge on the Kathmandu row is a feature.

## Historical offsets are stranger still

Before standardisation, offsets were local mean solar time and precise to the second. The IANA database records them.

The Netherlands ran at UTC+00:19:32.13 from 1909 to 1937. Liberia was at UTC-00:44:30 until 1972. Ask a runtime for the offset of `Europe/Amsterdam` at a 1920 date and it will give you the exact value, seconds and all.

That is why the offset function underneath this site computes in seconds and rounds to minutes only at the display layer. A engine that stored minutes would quietly lose 32 seconds of Dutch history — which nobody would notice, and which would still be wrong.
