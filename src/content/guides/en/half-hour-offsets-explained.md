---
title: Why India runs half an hour off UTC
description: Half-hour and 45-minute offsets are not accidents of geography. They are compromises, assertions of independence, and in one case a bureaucratic joke.
summary: India runs at UTC+05:30 because it split the difference between two proposed zones. Nepal runs at UTC+05:45 partly to not be India. Every unusual offset has a story, and most of them are political.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords:
  ['why india half hour', 'nepal 45 minutes', 'half hour time zone', 'india standard time history']
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

The obvious question about India Standard Time is why it is not a whole number of hours from anything. The answer is that time zones are decided by governments, and governments are not optimising for the convenience of your date library.

## India: one country, two natural zones, one compromise

India spans about 29 degrees of longitude — from Gujarat in the west to Arunachal Pradesh in the east. That is enough for roughly two hours of solar time. By the ordinary logic of time zones, India should have two.

Under British rule it effectively did. Bombay Time and Calcutta Time were separate, roughly 39 minutes apart, and Madras Time sat between them as a railway standard. When India standardised after independence in 1947, it chose a single zone at UTC+05:30 — 82.5°E, the meridian running near Mirzapur, almost exactly between the two old standards.

The reasoning was national unity and administrative simplicity, and the cost is real. In summer, the sun rises in Arunachal Pradesh around 04:00 and sets around 16:00, while offices keep hours set for Delhi. Assam's tea industry has run an unofficial "Bagan time" one hour ahead for over a century, precisely because the national clock does not fit. Proposals for a second Indian zone surface every few years and are rejected on the same grounds every time.

## Nepal: forty-five minutes of sovereignty

Nepal is at UTC+05:45. Fifteen minutes ahead of India, and the only zone in the world at that offset.

The geographic justification is Gaurishankar, a mountain east of Kathmandu used as the national meridian reference. The political justification is that Nepal is not India, and 15 minutes is a cheap and permanent way to say so. Nepal moved from UTC+05:30 to UTC+05:45 in 1986.

Both stories are true, and locals will tell you either depending on how the question is asked. What matters practically is that the offset is exact and permanent — Nepal does not observe daylight saving — and that a great deal of software gets it wrong by rounding to +05:30 or +06:00.

## Chatham Islands: 45 minutes and daylight saving

The Chatham Islands, about 800 kilometres east of New Zealand, run at UTC+12:45 in winter and UTC+13:45 in summer. Around 600 people live there.

The offset is roughly solar: the islands sit far enough east of the New Zealand mainland to justify the extra 45 minutes. The daylight saving is inherited from New Zealand, which means the islands are one of only two places on earth with both a quarter-hour offset and a seasonal shift.

## Lord Howe Island: the 30-minute daylight shift

Lord Howe Island, off eastern Australia, population around 380, is UTC+10:30 in winter and UTC+11:00 in summer. It shifts by **thirty minutes**, and it is the only place on earth that does.

The reasoning was moderation. The island wanted daylight saving to align with the New South Wales mainland but found a full hour excessive for a place that small, so it split the difference in 1981. The result is the single best test case in the world for date-handling code: any library that hardcodes a 60-minute daylight shift is wrong on Lord Howe Island and correct everywhere else, which means it will pass every test you write unless you write that one.

## The ones that have gone

**Netherlands: UTC+00:19:32.13.** From 1909 to 1937 the Netherlands ran at Amsterdam's local mean time, specified to the second. It was rounded to +00:20 in 1937 and abandoned for CET in 1940. The IANA database still carries it, which is why offsets in this site's engine are computed as seconds rather than minutes — a runtime asked about a 1920 Dutch date will answer with that value, and rounding it away would be a small lie.

**Liberia: UTC-00:44:30.** Until 1972, Liberia ran 44 minutes and 30 seconds behind Greenwich, the last country on earth with a non-whole-minute offset.

**Singapore: five changes.** Singapore has been at +06:55:25, +07:00, +07:20, +07:30, +09:00 and now +08:00. It sits west of the meridian that would justify +08:00, and stays there to align with Malaysia, which moved in 1982.

## The pattern

None of these offsets is about the sun. India split a political difference. Nepal asserted independence. Singapore followed a trading partner. Lord Howe compromised with itself.

Which is the argument for the design decision underneath every page on this site: **never compute an offset from longitude, and never store one in a table you maintain**. Ask the IANA database, which records what each government actually decided, including the decisions that make no astronomical sense — because those are the ones your users live in.

## North Korea's thirty-minute statement

In August 2015, North Korea moved its clocks back 30 minutes, from UTC+09:00 to UTC+08:30, and named the result Pyongyang Time. The stated reason was to undo a change imposed during the Japanese occupation, which had aligned Korea with Tokyo.

The practical effect was that North and South Korea, which had shared a clock since 1961, were now 30 minutes apart.

In May 2018, after the inter-Korean summit at Panmunjom, North Korea moved back to UTC+09:00. The announcement described it as a first practical step toward unification, and the clocks in the Peace House had been showing both times side by side during the talks.

Two tzdata releases, three years apart, for a change that had nothing to do with the sun and everything to do with politics. That is the normal case, not the exception.

## Venezuela's half hour, and its reversal

In December 2007 Venezuela moved from UTC-04:00 to UTC-04:30, a half-hour shift the government presented as giving children more daylight on the way to school. In May 2016 it moved back, this time framed as an energy-saving measure during a severe electricity crisis.

Nine years at an unusual offset, then back. Any system that had encoded Venezuela's offset as a constant needed changing twice.

## The lesson for anyone storing time

These are not edge cases in the sense of being rare. Between them, this guide has described offset changes in Nepal, Samoa, Tokelau, North Korea, Venezuela, Turkey, Russia, Iran, Mexico, Brazil and Egypt — all within living memory, most within the last two decades.

The IANA database absorbs each of them in a release. A hardcoded table absorbs none of them, and fails silently, and the failure looks like a scheduling mistake by a person rather than a bug in the software.
