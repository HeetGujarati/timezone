---
title: The International Date Line, and why it bends
description: The date line is not a line of longitude. It zigzags around countries that would rather not be split in two, and it has moved.
summary: The International Date Line follows 180° longitude only loosely — it detours around Kiribati, Russia and the Aleutians, and countries have moved themselves across it for trade reasons.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 11
keywords:
  ['international date line', 'date line explained', 'kiribati time zone', 'day before day after']
related: ['how-time-zones-work', 'offsets-that-are-not-whole-hours', 'what-utc-really-is']
---

If you sail west from Los Angeles for long enough, you gain an hour roughly every fifteen degrees of longitude, and after twenty-four such gains you would be a full day out of step with the people you left. The International Date Line is where that day is handed back.

It is not, however, a line. It is a negotiated boundary that bends around the countries it would otherwise cut in half.

## Where it actually runs

The date line loosely follows 180° longitude through the Pacific, chosen in 1884 because it is the meridian most nearly opposite Greenwich and passes through very little land. Then it makes four significant detours:

**North, around the Aleutians.** It swings east so that all of Alaska keeps the same date, rather than splitting the island chain.

**Around Russia.** A westward bend keeps Chukotka on the Asian side.

**East, around Kiribati.** The largest detour, and the most interesting one. Kiribati straddles 180°, and until 1995 the country was split across two dates: its western islands were a day ahead of its eastern ones. Government offices in Tarawa shared only four working days a week with those in the Line Islands. In 1995 Kiribati moved the date line east, putting the whole country on the same date and pushing the boundary out to 150°W — a bulge of roughly 2,000 kilometres. This also gave Kiribati the earliest time zone on earth, UTC+14, and with it the first sunrise of the year 2000, which the government marketed enthusiastically.

**South, around Samoa and Tonga.** Samoa's own move in 2011 is the best modern example of the line being an economic instrument rather than a geographic one.

## Samoa's missing day

Until 2011, Samoa sat on the American side of the line, three hours behind Sydney but a day behind as well. Its main trading partners had shifted from the United States to Australia and New Zealand, and being a day out meant only four shared working days a week: Samoa's Friday was Australia's Saturday, and Samoa's Sunday was Australia's Monday.

At midnight on 29 December 2011, Samoa skipped straight to 31 December. **30 December 2011 did not exist in Samoa.** Nobody had a birthday, no contracts came due, and the country moved from UTC-11 to UTC+13.

Tokelau, administered by New Zealand, made the same jump on the same night.

Samoa had done the reverse in 1892, moving from the Asian side to the American one at the urging of American traders — and repeating 4 July twice to do it, which was presented as a favour to the American community.

## The 26-hour spread

Because of these detours, the world's offsets span more than twenty-four hours:

- **UTC+14** — Kiritimati (Christmas Island), Kiribati. The earliest clock on earth
- **UTC+13** — Samoa, Tonga, and Kiribati's Phoenix Islands
- **UTC-11** — American Samoa, Niue
- **UTC-12** — Baker Island and Howland Island, uninhabited US territories

That is a 26-hour span, which has a consequence worth internalising: **there are moments when three different calendar dates are in use simultaneously somewhere on earth**. For about two hours each day, Kiritimati is on one date, most of the world on the next, and Baker Island on the one before.

Any code that assumes a two-day window covers every zone is wrong during those windows. Any "what day is it globally" question has no answer.

Kiritimati and Baker Island are geographically about 2,100 kilometres apart and 26 hours apart on the clock. You could, in principle, watch the same sunset twice.

## What this means in practice

**Converting across the line changes the date, not just the hour.** Tokyo on Monday evening is Los Angeles on Monday morning; Auckland on Monday morning is Honolulu on Sunday afternoon. Every conversion page on this site marks the day change explicitly for exactly this reason — an hour that is right on the wrong day is a special kind of wrong.

**"Tomorrow" is not a global concept.** A deadline of "end of day Friday" means different instants for different people, and for a genuinely global audience the gap between the first Friday ending and the last is over a day. Say "23:59 UTC on Friday" if you mean a single moment.

**The line moves.** Not often, but it is a political boundary and it has changed within living memory — twice this century. Any system with a hardcoded notion of where it runs will eventually be wrong. The IANA database tracks these changes; that is what it is for.

## Crossing it in practice

Flights across the Pacific produce arrival times that look like errors and are not.

A flight leaving Tokyo at 17:00 on Monday and taking nine hours arrives in Los Angeles at 10:00 on **Monday** — seven hours before it left, by the clock. Going the other way, a flight leaving Los Angeles on Monday afternoon arrives in Tokyo on Wednesday morning, having skipped Tuesday almost entirely.

Neither is a paradox. The flight took nine hours in both directions; only the labels changed. This is exactly why the duration calculator on this site resolves both ends to instants before subtracting: the difference between two wall-clock readings across the date line is meaningless, while the difference between two instants is always the real elapsed time.

The practical consequence for anyone building booking or logistics software: **never compute a duration by subtracting local times**. It is right most of the time, which is what makes it dangerous.

## Which side is "ahead"

The convention confuses people because it inverts the intuition of a map. Countries just _west_ of the date line — New Zealand, Fiji, Kiribati — are the first to see each new day. Countries just _east_ of it — Hawaii, American Samoa — are the last.

So Auckland is nearly a full day ahead of Honolulu despite being only about 7,000 kilometres away, and the two are on different dates for most of every 24-hour cycle.

The rule that helps: the date line is where the day _starts_, and the day then sweeps westward around the globe, arriving back at the line 24 hours later as the next day begins. Kiritimati, at UTC+14, is the first inhabited place to reach any given date. Baker Island, at UTC-12, is the last.
