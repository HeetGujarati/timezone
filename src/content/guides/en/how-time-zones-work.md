---
title: How time zones actually work
description: Time zones are a political artefact layered over a geographic problem. Here is the mechanism, and why software gets it wrong.
summary: A time zone is not a slice of the globe — it is a named set of rules about what a clock in a particular place has read, does read, and is scheduled to read. That distinction is the whole subject.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  ['how time zones work', 'time zone explained', 'what is a time zone', 'iana time zone database']
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Ask most people what a time zone is and they will describe a vertical stripe on a map: the world divided into twenty-four equal slices, one hour apart, each governed by longitude. That model is tidy, memorable, and wrong in ways that will eventually cost you a meeting.

A time zone is a **named set of rules**, maintained by a government, about what clocks in a particular territory read. The rules can change. They change for political reasons, economic reasons, and occasionally on a fortnight's notice. Longitude is where the idea started; it is not where it ended up.

## Where the idea came from

Before the 1880s, every town kept its own time, set by local noon — the moment the sun crossed the meridian overhead. Bristol was ten minutes behind London, and nobody minded, because nothing travelled fast enough for ten minutes to matter.

Railways changed that. A timetable that says a train leaves at 10:15 is useless when 10:15 means something different at each end of the line, and by the 1840s British railway companies had simply imposed London time on their whole network. The United States followed in 1883, with the railroads carving the country into four zones by fiat. The International Meridian Conference in 1884 made Greenwich the prime meridian and gave the world a common reference to measure from.

The important part of that history is that time zones were invented to solve a coordination problem, by the organisations that had the problem. They were never a description of where the sun is.

## What a zone actually contains

The authoritative record is the **IANA time zone database**, also called tzdata or the Olson database. It is a text file, updated several times a year, and every operating system, browser and programming language you use is reading some version of it.

For each zone it records:

- an identifier, like `America/New_York` or `Asia/Kathmandu`
- the offset from UTC that applied during each period in that zone's history
- the rules for when that offset changes, if it does
- an abbreviation for each period, where one exists

The identifiers follow an `Area/Location` convention, and the location is a representative city rather than a country — because countries split, merge, and change their rules independently of their borders. `America/Argentina/Buenos_Aires` exists because Argentina's provinces once kept different time from each other.

Note what a zone is not: it is not an offset. `America/New_York` is not "UTC-5". It is a zone whose offset is UTC-5 for part of the year and UTC-4 for the rest, and which was on UTC-5 year-round during the Second World War, and which used a different rule set before 1966. Storing "UTC-5" and calling it New York is the single most common time zone bug in software.

## The rules change, and not gradually

In 2016 Turkey abandoned daylight saving with about three weeks' notice, and stayed on UTC+3 permanently. In 2018 North Korea moved its clocks by 30 minutes to realign with the South. In 2022 Iran abolished daylight saving; the same year Mexico dropped it for most of the country. Egypt reinstated it in 2023 after abolishing it in 2014.

Each of those was a tzdata release, and each one broke every system that had a hardcoded offset table. This is why the engine behind every page on this site reads offsets from the runtime's copy of tzdata rather than from anything stored here. A rebuild picks up the new rules; nothing needs to be edited.

## Why offsets are not all whole hours

Around a fifth of the world's population lives on an offset that is not a whole number of hours from UTC. India is at UTC+05:30, chosen as a single compromise zone for a country wide enough to justify two. Nepal is at UTC+05:45, forty-five minutes offset partly to assert independence from Indian time. The Chatham Islands are at UTC+12:45. Newfoundland is at UTC-03:30.

Software that assumes offsets are whole hours does not merely round — it produces answers that are 30 or 45 minutes wrong for hundreds of millions of people, which is exactly the size of error that gets noticed on the call and not before.

## The two days a year when local time is not a function

Daylight saving creates two annual discontinuities, and they are the reason "convert this local time" is harder than it looks.

**Spring forward deletes an hour.** In New York on the change-over date, 01:59:59 is followed immediately by 03:00:00. The local time 02:30 does not occur. If a user types it, there is no correct instant to return — only policies for what to return instead.

**Fall back repeats an hour.** 01:30 occurs twice, once on daylight time and once an hour later on standard time. A local time alone is genuinely ambiguous; you need to know which occurrence was meant, and most interfaces never ask.

Every tool on this site resolves both explicitly and tells you what it did. Silently picking one is how a calendar entry ends up an hour out with nobody noticing until the call.

## What this means in practice

Three rules follow from the mechanism, and they cover most of what goes wrong:

1. **Store instants, not local times.** A UTC timestamp is unambiguous. A local time is a timestamp plus a zone plus a policy for the two awkward days.
2. **Store the zone identifier, not the offset.** `Europe/London` survives a rule change; `UTC+0` does not, and is wrong for half the year anyway.
3. **Convert at the point of display, using the runtime's tzdata.** Not at the point of storage, and never from a table you maintain yourself.

The reason this site keeps saying "as of the last rebuild" about offsets, and computes current times in your browser instead, is the same reason. The rules are not ours to freeze.
